import {
  evaluateAbg,
  evaluateCbc,
  evaluateElectrolytes,
  evaluateCoagulation,
  CLINICAL_LAB_PRESETS,
} from '../../.gemini/skills/ClinicalLabInterpretationEngine';

describe('ClinicalLabInterpretationEngine', () => {
  describe('evaluateAbg', () => {
    it('correctly classifies normal acid-base homeostasis', () => {
      const res = evaluateAbg({
        pH: 7.40,
        paCO2: 40,
        hco3: 24,
        paO2: 95,
        fiO2: 0.21,
        na: 140,
        cl: 104,
        albumin: 4.0,
      });

      expect(res.pHCategory).toBe('NORMAL_PH');
      expect(res.primaryDisturbance).toBe('Normal Acid-Base Homeostasis');
      expect(res.rawAnionGap).toBe(12);
      expect(res.correctedAnionGap).toBe(12);
      expect(res.anionGapStatus).toBe('NORMAL_AG');
      expect(res.aaGradient).toBeLessThanOrEqual(15);
    });

    it('correctly identifies High Anion Gap Metabolic Acidosis with Winter\'s compensation (DKA)', () => {
      const res = evaluateAbg({
        pH: 7.15,
        paCO2: 20,
        hco3: 8,
        na: 135,
        cl: 97,
        albumin: 4.0,
      });

      expect(res.pHCategory).toBe('ACIDEMIA');
      expect(res.primaryDisturbance).toBe('Primary Metabolic Acidosis');
      expect(res.anionGapStatus).toBe('HIGH_AG');
      // AG = 135 - (97 + 8) = 30
      expect(res.correctedAnionGap).toBe(30);
      // Winter's formula: 1.5 * 8 + 8 = 20 (+/- 2) -> 18 to 22
      expect(res.wintersExpectedPaCO2).toEqual({ min: 18, max: 22, target: 20 });
      expect(res.compensationStatus).toBe('Adequately Compensated Metabolic Acidosis');
      // Delta-Delta: (30 - 12) / (24 - 8) = 18 / 16 = 1.13 -> Pure HAGMA
      expect(res.deltaDeltaRatio).toBe(1.13);
      expect(res.deltaDeltaInterpretation).toContain('Pure High Anion Gap');
    });

    it('correctly applies albumin correction to Anion Gap in hypoalbuminemia', () => {
      // If albumin is 2.0 g/dL (2.0 below normal 4.0), AG should be corrected up by 2.5 * 2.0 = +5.0
      const res = evaluateAbg({
        pH: 7.30,
        paCO2: 30,
        hco3: 15,
        na: 138,
        cl: 114,
        albumin: 2.0,
      });

      // Raw AG = 138 - (114 + 15) = 9
      expect(res.rawAnionGap).toBe(9);
      // Corrected AG = 9 + 2.5*(4-2) = 14
      expect(res.correctedAnionGap).toBe(14);
      expect(res.anionGapStatus).toBe('HIGH_AG');
    });

    it('identifies concurrent respiratory acidosis when PaCO2 exceeds Winter\'s formula ceiling', () => {
      const res = evaluateAbg({
        pH: 7.10,
        paCO2: 32, // Expected 1.5*8 + 8 = 20 (+/- 2, max 22), 32 is much higher
        hco3: 8,
        na: 140,
        cl: 100,
        albumin: 4.0,
      });

      expect(res.compensationStatus).toContain('Concurrent Respiratory Acidosis');
    });

    it('identifies concurrent respiratory alkalosis when PaCO2 is lower than Winter\'s formula floor', () => {
      const res = evaluateAbg({
        pH: 7.28,
        paCO2: 12, // Expected max 20, min 18, 12 is lower
        hco3: 8,
        na: 140,
        cl: 100,
        albumin: 4.0,
      });

      expect(res.compensationStatus).toContain('Concurrent Respiratory Alkalosis');
    });

    it('detects mixed HAGMA with concurrent metabolic alkalosis via Delta-Delta ratio > 2.0', () => {
      // Severe DKA with vomiting: HCO3 is 18 (deltaHCO3 = 6), but AG is 32 (deltaAG = 20) -> ratio = 20 / 6 = 3.33
      const res = evaluateAbg({
        pH: 7.32,
        paCO2: 35,
        hco3: 18,
        na: 140,
        cl: 90,
        albumin: 4.0,
      });

      expect(res.deltaDeltaRatio).toBeGreaterThan(2.0);
      expect(res.deltaDeltaInterpretation).toContain('Concurrent Metabolic Alkalosis');
    });

    it('calculates Alveolar Gas Equation and A-a gradient correctly', () => {
      // Room air (FiO2 = 0.21), PaCO2 = 40, PaO2 = 60
      // PAO2 = 0.21 * (760 - 47) - (40 / 0.8) = 149.73 - 50 = 99.73 ~ 99.7 mmHg
      // A-a gradient = 99.7 - 60 = 39.7 mmHg
      const res = evaluateAbg({
        pH: 7.38,
        paCO2: 40,
        hco3: 24,
        paO2: 60,
        fiO2: 0.21,
        patientAge: 40,
      });

      expect(res.alveolarO2).toBeCloseTo(99.7, 0);
      expect(res.aaGradient).toBeCloseTo(39.7, 0);
      expect(res.expectedAaGradient).toBe(14); // (40 / 4) + 4
      expect(res.pfRatio).toBeCloseTo(285.7, 0); // 60 / 0.21
    });
  });

  describe('evaluateCbc', () => {
    it('correctly calculates Mentzer Index to suggest Thalassemia Trait vs IDA', () => {
      // Thalassemia: MCV 65, RBC 5.8 -> Mentzer = 65 / 5.8 = 11.2 (< 13)
      const thalRes = evaluateCbc({
        hemoglobin: 11.0,
        hematocrit: 35,
        rbc: 5.8,
        mcv: 65,
        rdw: 13.0,
        wbc: 6.5,
        platelets: 250,
      });

      expect(thalRes.mcvClassification).toBe('MICROCYTIC');
      expect(thalRes.mentzerIndex).toBe(11.2);
      expect(thalRes.mentzerInterpretation).toContain('Thalassemia Trait');

      // IDA: MCV 68, RBC 3.2 -> Mentzer = 68 / 3.2 = 21.3 (>= 13)
      const idaRes = evaluateCbc({
        hemoglobin: 8.0,
        hematocrit: 25,
        rbc: 3.2,
        mcv: 68,
        rdw: 18.5,
        wbc: 7.0,
        platelets: 420,
      });

      expect(idaRes.mentzerIndex).toBe(21.3);
      expect(idaRes.mentzerInterpretation).toContain('Iron Deficiency Anemia');
    });

    it('calculates Reticulocyte Production Index (RPI) correctly', () => {
      // Female, Hct 21% (maturation factor 2.0), Retic 12%
      // Corrected Retic = 12 * (21 / 42) = 6.0%
      // RPI = 6.0 / 2.0 = 3.0 (Hyperproliferative / Hemolysis)
      const hemolRes = evaluateCbc({
        hemoglobin: 7.0,
        hematocrit: 21,
        rbc: 2.3,
        mcv: 92,
        rdw: 16.0,
        wbc: 8.5,
        platelets: 220,
        reticulocytePercent: 12.0,
        patientSex: 'female',
      });

      expect(hemolRes.reticulocyteProductionIndex).toBe(3.0);
      expect(hemolRes.rpiClassification).toBe('HYPERPROLIFERATIVE');
    });

    it('flags pancytopenia when all 3 cell lineages are depressed', () => {
      const res = evaluateCbc({
        hemoglobin: 6.8,
        hematocrit: 20,
        rbc: 2.0,
        mcv: 88,
        rdw: 13.5,
        wbc: 2.1,
        platelets: 38,
      });

      expect(res.pancytopenia).toBe(true);
      expect(res.differentialDiagnosis).toContain('Aplastic Anemia');
    });
  });

  describe('evaluateElectrolytes', () => {
    it('corrects sodium in severe hyperglycemia via Katz formula', () => {
      // Measured Na 128, Glucose 600
      // Excess glucose = 500 -> Correction = 0.016 * 500 = +8.0 -> Corrected Na = 136
      const res = evaluateElectrolytes({
        sodium: 128,
        potassium: 4.5,
        chloride: 96,
        bicarbonate: 22,
        bun: 28,
        creatinine: 1.1,
        glucose: 600,
        calcium: 9.0,
        albumin: 4.0,
      });

      expect(res.correctedSodium).toBe(136.0);
      expect(res.sodiumStatus).toBe('EUNATREMIA');
    });

    it('corrects calcium in hypoalbuminemia', () => {
      // Measured Ca 7.2, Albumin 2.0 -> Corrected Ca = 7.2 + 0.8*(4.0 - 2.0) = 7.2 + 1.6 = 8.8 (Normal)
      const res = evaluateElectrolytes({
        sodium: 140,
        potassium: 4.0,
        chloride: 104,
        bicarbonate: 24,
        bun: 15,
        creatinine: 0.9,
        glucose: 90,
        calcium: 7.2,
        albumin: 2.0,
      });

      expect(res.correctedCalcium).toBe(8.8);
      expect(res.calciumStatus).toBe('EUCALCEMIA');
    });

    it('calculates serum osmolality, osmolar gap, and BUN/Cr ratio', () => {
      // Na 140, Gluc 90, BUN 56, Cr 2.0, Measured Osm 320
      // Calc Osm = 2*140 + 90/18 + 56/2.8 = 280 + 5 + 20 = 305
      // Osmolar gap = 320 - 305 = 15 (> 10)
      // BUN/Cr = 56 / 2.0 = 28 (> 20:1 -> Pre-renal)
      const res = evaluateElectrolytes({
        sodium: 140,
        potassium: 4.2,
        chloride: 102,
        bicarbonate: 24,
        bun: 56,
        creatinine: 2.0,
        glucose: 90,
        calcium: 9.2,
        albumin: 4.0,
        measuredOsmolality: 320,
      });

      expect(res.calculatedOsmolality).toBe(305.0);
      expect(res.osmolarGap).toBe(15.0);
      expect(res.osmolarGapElevated).toBe(true);
      expect(res.bunCreatinineRatio).toBe(28.0);
      expect(res.akiPhenotype).toBe('PRE_RENAL_AZOTEMIA');
    });
  });

  describe('evaluateCoagulation', () => {
    it('evaluates 1:1 mixing study correction for Factor Deficiency (Hemophilia)', () => {
      const res = evaluateCoagulation({
        pt: 12.0,
        inr: 1.0,
        aptt: 65.0,
        fibrinogen: 300,
        dDimer: 180,
        mixingStudyAptt: 28.0, // Normalizes
        ast: 25,
        alt: 20,
        alp: 80,
        ggt: 25,
        totalBilirubin: 0.8,
        directBilirubin: 0.2,
      });

      expect(res.coagPathwayDefect).toBe('ISOLATED_INTRINSIC_APTT');
      expect(res.mixingStudyOutcome).toBe('CORRECTS_FACTOR_DEFICIENCY');
    });

    it('evaluates 1:1 mixing study failure to correct for circulating inhibitor (Lupus Anticoagulant)', () => {
      const res = evaluateCoagulation({
        pt: 12.2,
        inr: 1.0,
        aptt: 62.0,
        fibrinogen: 320,
        dDimer: 240,
        mixingStudyAptt: 58.0, // Fails to correct
        ast: 20,
        alt: 22,
        alp: 90,
        ggt: 20,
        totalBilirubin: 0.6,
        directBilirubin: 0.2,
      });

      expect(res.coagPathwayDefect).toBe('ISOLATED_INTRINSIC_APTT');
      expect(res.mixingStudyOutcome).toBe('FAILS_TO_CORRECT_INHIBITOR');
    });

    it('detects Alcoholic Hepatitis pattern with De Ritis Ratio (AST/ALT) > 2.0', () => {
      const res = evaluateCoagulation({
        pt: 16.5,
        inr: 1.5,
        aptt: 32.0,
        fibrinogen: 220,
        dDimer: 350,
        ast: 260,
        alt: 100,
        alp: 120,
        ggt: 240,
        totalBilirubin: 8.5,
        directBilirubin: 5.5,
      });

      expect(res.deRitisRatio).toBe(2.6);
      expect(res.liverEnzymePattern).toBe('HEPATOCELLULAR_ALCOHOLIC');
      expect(res.hyperbilirubinemiaType).toBe('CONJUGATED_DIRECT');
    });
  });

  describe('CLINICAL_LAB_PRESETS', () => {
    it('contains 12 presets with valid parameters and clinical teaching', () => {
      expect(CLINICAL_LAB_PRESETS.length).toBe(12);
      for (const preset of CLINICAL_LAB_PRESETS) {
        expect(preset.id).toBeDefined();
        expect(preset.title).toBeDefined();
        expect(preset.patientVignette).toBeDefined();
        expect(preset.teachingExplanation).toBeDefined();
        expect(preset.expectedDiagnosis).toBeDefined();

        if (preset.abgParams) {
          const abg = evaluateAbg(preset.abgParams);
          expect(abg.primaryDisturbance).toBeDefined();
        }
        if (preset.cbcParams) {
          const cbc = evaluateCbc(preset.cbcParams);
          expect(cbc.mcvClassification).toBeDefined();
        }
        if (preset.cmpParams) {
          const cmp = evaluateElectrolytes(preset.cmpParams);
          expect(cmp.correctedSodium).toBeGreaterThan(0);
        }
        if (preset.coagParams) {
          const coag = evaluateCoagulation(preset.coagParams);
          expect(coag.coagPathwayDefect).toBeDefined();
        }
      }
    });
  });
});
