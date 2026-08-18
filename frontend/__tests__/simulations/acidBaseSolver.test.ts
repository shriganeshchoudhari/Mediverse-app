import {
  solvePH,
  solveHCO3,
  solvePaCO2,
  calculateHIonConcentration,
  calculateAnionGap,
  calculateWinterCompensation,
  calculateMetabolicAlkalosisCompensation,
  calculateRespiratoryAcidosisCompensation,
  calculateRespiratoryAlkalosisCompensation,
  generateIsobar,
  generateBufferLine,
  solveAcidBase,
  NON_BICARB_BUFFER_SLOPE,
} from '../../lib/simulations/acidBaseSolver';

describe('Acid-Base & Davenport Nomogram Physiology Solver Tests', () => {
  describe('1. Henderson-Hasselbalch Equilibria', () => {
    test('calculates normal baseline pH 7.40 with PaCO2 40 mmHg and HCO3 24 mEq/L', () => {
      const ph = solvePH(40, 24);
      expect(ph).toBeCloseTo(7.40, 2);

      const hIon = calculateHIonConcentration(ph);
      expect(hIon).toBeGreaterThan(39);
      expect(hIon).toBeLessThan(41);
    });

    test('calculates accurate pH for acidemia and alkalemia states', () => {
      // Acute Hypercapnia: PaCO2 = 60 mmHg, HCO3 = 24 mEq/L -> pH = 6.1 + log10(24 / 1.8) = 6.1 + 1.125 = 7.22
      const acidPh = solvePH(60, 24);
      expect(acidPh).toBeCloseTo(7.225, 2);

      // Acute Hypocapnia: PaCO2 = 20 mmHg, HCO3 = 24 mEq/L -> pH = 6.1 + log10(24 / 0.6) = 6.1 + 1.602 = 7.70
      const alkPh = solvePH(20, 24);
      expect(alkPh).toBeCloseTo(7.70, 2);

      // Severe Metabolic Acidosis: PaCO2 = 40 mmHg, HCO3 = 10 mEq/L -> pH = 6.1 + log10(10 / 1.2) = 7.02
      const metAcidPh = solvePH(40, 10);
      expect(metAcidPh).toBeCloseTo(7.02, 2);
    });

    test('solves inverse Henderson-Hasselbalch functions correctly', () => {
      const targetPH = 7.40;
      const targetPaCO2 = 40;
      const calculatedHCO3 = solveHCO3(targetPH, targetPaCO2);
      expect(calculatedHCO3).toBeCloseTo(23.94, 1);

      const calculatedPaCO2 = solvePaCO2(targetPH, 24);
      expect(calculatedPaCO2).toBeCloseTo(40.1, 1);
    });

    test('guards against non-positive parameters without crashing', () => {
      expect(solvePH(0, 24)).toBe(7.40);
      expect(solveHCO3(7.40, 0)).toBe(24.0);
      expect(solvePaCO2(7.40, 0)).toBe(40.0);
    });
  });

  describe('2. Anion Gap & Delta Dynamics', () => {
    test('calculates normal physiological anion gap (12 mEq/L)', () => {
      const agResult = calculateAnionGap(140, 104, 24);
      // AG = 140 - (104 + 24) = 140 - 128 = 12
      expect(agResult.anionGap).toBe(12);
      expect(agResult.isNormal).toBe(true);
      expect(agResult.isHigh).toBe(false);
      expect(agResult.category).toBe('normal_ag');
    });

    test('identifies High Anion Gap Metabolic Acidosis (HAGMA) with classic Delta Ratio', () => {
      // Typical DKA: Na 138, Cl 96, HCO3 10 -> AG = 138 - (96 + 10) = 32 (Elevated by 20)
      // Delta Gap = 32 - 12 = 20
      // Delta HCO3 = 24 - 10 = 14
      // Delta Ratio = 20 / 14 = 1.43 (Uncomplicated pure HAGMA)
      const agResult = calculateAnionGap(138, 96, 10);
      expect(agResult.anionGap).toBe(32);
      expect(agResult.isHigh).toBe(true);
      expect(agResult.deltaGap).toBe(20);
      expect(agResult.deltaRatio).toBe(1.43);
      expect(agResult.interpretation).toContain('Pure High Anion Gap');
      expect(agResult.differentials.some(d => d.includes('Diabetic Ketoacidosis'))).toBe(true);
    });

    test('identifies Normal Anion Gap (Hyperchloremic) Acidosis (NAGMA)', () => {
      // Severe Diarrhea / RTA: Na 140, Cl 116, HCO3 12 -> AG = 140 - (116 + 12) = 12
      const agResult = calculateAnionGap(140, 116, 12);
      expect(agResult.anionGap).toBe(12);
      expect(agResult.isHigh).toBe(false);
      expect(agResult.category).toBe('normal_ag');
      expect(agResult.differentials.some(d => d.includes('Diarrhea'))).toBe(true);
    });

    test('corrects Anion Gap for hypoalbuminemia', () => {
      // Patient with severe hypoalbuminemia (albumin 2.0 g/dL, normal 4.0)
      // Measured: Na 140, Cl 104, HCO3 24 -> Unadjusted AG = 12. Corrected AG = 12 + 2.5*(4-2) = 17
      const agResult = calculateAnionGap(140, 104, 24, 2.0);
      expect(agResult.anionGap).toBe(17);
      expect(agResult.isHigh).toBe(true);
    });
  });

  describe("3. Respiratory Compensation Rules & Winter's Formula", () => {
    test("validates Winter's formula for appropriately compensated metabolic acidosis", () => {
      // HCO3 = 12 mEq/L -> Expected PaCO2 = 1.5 * 12 + 8 = 26 (+/- 2, range 24-28)
      const evalAdequate = calculateWinterCompensation(12, 26);
      expect(evalAdequate.expectedValue).toBe(26);
      expect(evalAdequate.minExpected).toBe(24);
      expect(evalAdequate.maxExpected).toBe(28);
      expect(evalAdequate.status).toBe('adequate');
      expect(evalAdequate.interpretation).toContain('appropriate respiratory compensation');
    });

    test("detects concomitant respiratory acidosis when PaCO2 is higher than Winter's ceiling", () => {
      // HCO3 = 12 mEq/L, Actual PaCO2 = 36 mmHg (> 28 mmHg ceiling) -> Respiratory failure / fatigue
      const evalUnder = calculateWinterCompensation(12, 36);
      expect(evalUnder.status).toBe('under_compensated');
      expect(evalUnder.interpretation).toContain('Concomitant Respiratory Acidosis');
    });

    test("detects concomitant respiratory alkalosis when PaCO2 is lower than Winter's floor", () => {
      // HCO3 = 12 mEq/L, Actual PaCO2 = 18 mmHg (< 24 mmHg floor) -> e.g. Salicylates or Sepsis
      const evalOver = calculateWinterCompensation(12, 18);
      expect(evalOver.status).toBe('over_compensated');
      expect(evalOver.interpretation).toContain('Concomitant Respiratory Alkalosis');
    });

    test('validates Metabolic Alkalosis hypoventilatory compensation', () => {
      // HCO3 = 36 mEq/L -> Expected PaCO2 = 0.7 * 36 + 21 = 46.2 (+/- 2, range 44.2 - 48.2)
      const evalAlk = calculateMetabolicAlkalosisCompensation(36, 46);
      expect(evalAlk.status).toBe('adequate');
      expect(evalAlk.expectedValue).toBe(46.2);
    });

    test('evaluates Acute vs Chronic Respiratory Acidosis compensation', () => {
      // PaCO2 = 60 mmHg (ΔPaCO2 = +20 mmHg, so 2 units of 10 mmHg)
      // Acute: Expected HCO3 = 24 + 1.0 * 2 = 26 (+/- 1)
      const acuteEval = calculateRespiratoryAcidosisCompensation(60, 26, false);
      expect(acuteEval.status).toBe('adequate');
      expect(acuteEval.expectedValue).toBe(26);

      // Chronic: Expected HCO3 = 24 + 3.5 * 2 = 31 (+/- 2)
      const chronicEval = calculateRespiratoryAcidosisCompensation(60, 31, true);
      expect(chronicEval.status).toBe('adequate');
      expect(chronicEval.expectedValue).toBe(31);
    });

    test('evaluates Acute vs Chronic Respiratory Alkalosis compensation', () => {
      // PaCO2 = 20 mmHg (ΔPaCO2 = -20 mmHg, so 2 units of 10 mmHg drop)
      // Acute: Expected HCO3 = 24 - 2.0 * 2 = 20 (+/- 1)
      const acuteEval = calculateRespiratoryAlkalosisCompensation(20, 20, false);
      expect(acuteEval.status).toBe('adequate');
      expect(acuteEval.expectedValue).toBe(20);

      // Chronic: Expected HCO3 = 24 - 5.0 * 2 = 14 (+/- 2)
      const chronicEval = calculateRespiratoryAlkalosisCompensation(20, 14, true);
      expect(chronicEval.status).toBe('adequate');
      expect(chronicEval.expectedValue).toBe(14);
    });
  });

  describe('4. Davenport Nomogram & Buffer Lines', () => {
    test('generates standard non-bicarbonate buffer line with slope of -25 slykes', () => {
      const bufferLine = generateBufferLine(7.40, 24.0, NON_BICARB_BUFFER_SLOPE);
      expect(bufferLine.length).toBeGreaterThan(5);

      // Find points near pH 7.20 and 7.40
      const pt740 = bufferLine.find(p => Math.abs(p.ph - 7.40) < 0.01);
      const pt720 = bufferLine.find(p => Math.abs(p.ph - 7.20) < 0.01);

      expect(pt740?.hco3).toBe(24);
      // At pH 7.20 (ΔpH = -0.20): [HCO3-] = 24 + (-25)*(-0.20) = 24 + 5 = 29
      expect(pt720?.hco3).toBeCloseTo(29.0, 0);
    });

    test('generates CO2 isobars covering physiological range', () => {
      const isobar40 = generateIsobar(40);
      expect(isobar40.length).toBeGreaterThan(10);
      // At pH 7.40 on PaCO2 = 40 isobar, HCO3 should be ~24
      const normalPoint = isobar40.find(p => Math.abs(p.ph - 7.40) < 0.01);
      expect(normalPoint?.hco3).toBeCloseTo(24, 0);
    });
  });

  describe('5. Automated ABG Diagnostic Classifier on Clinical Presets', () => {
    test('Classifies Diabetic Ketoacidosis (DKA) correctly', () => {
      // Patient with severe DKA: pH 7.15, PaCO2 20 mmHg, HCO3 7 mEq/L, Na 134, Cl 96
      // Winter's: 1.5 * 7 + 8 = 18.5 (range 16.5 - 20.5) -> PaCO2 20 is adequate compensation
      // AG = 134 - (96 + 7) = 31 (High AG)
      const dkaResult = solveAcidBase({
        paco2: 20,
        hco3: 7,
        na: 134,
        cl: 96,
      });

      expect(dkaResult.ph).toBeCloseTo(7.16, 1);
      expect(dkaResult.phCategory).toBe('acidemia');
      expect(dkaResult.primaryDisorder).toBe('compensated_metabolic_acidosis');
      expect(dkaResult.diagnosticLabel).toContain('High Anion Gap');
      expect(dkaResult.anionGap.isHigh).toBe(true);
      expect(dkaResult.anionGap.anionGap).toBe(31);
      expect(dkaResult.compensation.status).toBe('adequate');
      expect(dkaResult.clinicalSeverity).toBe('severe');
      expect(dkaResult.steps.length).toBe(4);
    });

    test('Classifies Severe Vomiting (Metabolic Alkalosis) correctly', () => {
      // Patient with persistent gastric outlet vomiting: pH 7.55, PaCO2 48 mmHg, HCO3 40 mEq/L, Na 138, Cl 86
      const vomitingResult = solveAcidBase({
        paco2: 48,
        hco3: 40,
        na: 138,
        cl: 86,
      });

      expect(vomitingResult.ph).toBeCloseTo(7.54, 1);
      expect(vomitingResult.phCategory).toBe('alkalemia');
      expect(vomitingResult.primaryDisorder).toBe('compensated_metabolic_alkalosis');
      expect(vomitingResult.differentials.some(d => d.includes('Vomiting'))).toBe(true);
      expect(vomitingResult.compensation.measuredParameter).toBe('PaCO2');
    });

    test('Classifies COPD Acute-on-Chronic Exacerbation correctly', () => {
      // Patient with COPD exacerbation: PaCO2 70 mmHg, HCO3 32 mEq/L, isChronic = true
      const copdResult = solveAcidBase({
        paco2: 70,
        hco3: 32,
        isChronic: true,
      });

      expect(copdResult.ph).toBeCloseTo(7.28, 1);
      expect(copdResult.phCategory).toBe('acidemia');
      expect(copdResult.primaryDisorder).toBe('chronic_respiratory_acidosis');
      expect(copdResult.diagnosticLabel).toContain('Respiratory Acidosis');
      expect(copdResult.differentials.some(d => d.includes('COPD'))).toBe(true);
    });

    test('Classifies Panic Attack Acute Hyperventilation correctly', () => {
      // Patient with panic attack: PaCO2 22 mmHg, HCO3 21 mEq/L, Na 140, Cl 107
      const panicResult = solveAcidBase({
        paco2: 22,
        hco3: 21,
        na: 140,
        cl: 107,
        isChronic: false,
      });

      expect(panicResult.ph).toBeCloseTo(7.60, 1);
      expect(panicResult.phCategory).toBe('alkalemia');
      expect(panicResult.primaryDisorder).toBe('acute_respiratory_alkalosis');
      expect(panicResult.differentials.some(d => d.includes('Panic Attack'))).toBe(true);
      expect(panicResult.anionGap.isNormal).toBe(true);
    });

    test('Classifies Mixed Severe Metabolic Acidosis and Respiratory Acidosis', () => {
      // Cardiac arrest / hypoventilation + lactic acidosis: PaCO2 65 mmHg, HCO3 14 mEq/L
      const mixedResult = solveAcidBase({
        paco2: 65,
        hco3: 14,
        na: 140,
        cl: 98,
      });

      expect(mixedResult.ph).toBeLessThan(7.10);
      expect(mixedResult.clinicalSeverity).toBe('life_threatening');
      expect(mixedResult.primaryDisorder).toBe('mixed_metabolic_and_respiratory_acidosis');
    });

    test('Classifies Mixed Salicylate Poisoning (Metabolic Acidosis + Respiratory Alkalosis)', () => {
      // Salicylate toxicity: HCO3 12 mEq/L (Metabolic acidosis) + PaCO2 16 mmHg (Excess central hyperventilation)
      const salicylateResult = solveAcidBase({
        paco2: 16,
        hco3: 12,
        na: 140,
        cl: 98,
      });

      expect(salicylateResult.primaryDisorder).toBe('mixed_metabolic_acidosis_and_respiratory_alkalosis');
      expect(salicylateResult.compensation.status).toBe('over_compensated');
    });
  });
});
