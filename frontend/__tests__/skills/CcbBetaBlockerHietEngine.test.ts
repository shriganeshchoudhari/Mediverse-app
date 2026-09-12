import {
  evaluateShockSeverity,
  calculateHietDosing,
  evaluateAdjuvants,
  performOverdoseEvaluation,
  OVERDOSE_PRESETS,
  OverdosePatientInput,
} from '../../.gemini/skills/CcbBetaBlockerHietEngine';

describe('CcbBetaBlockerHietEngine', () => {
  const baseInput: OverdosePatientInput = {
    patientAgeYears: 50,
    patientWeightKg: 70,
    toxinClass: 'CCB_NON_DIHYDROPYRIDINE',
    specificDrug: 'VERAPAMIL',
    estimatedIngestionDoseMg: 3600,
    hoursPostIngestion: 3,
    isExtendedReleaseFormulation: true,
    heartRateBpm: 36,
    systolicBpMmHg: 72,
    diastolicBpMmHg: 44,
    qrsIntervalMs: 96,
    qtcIntervalMs: 450,
    bloodGlucoseMgDl: 320,
    serumPotassiumMeqL: 4.0,
    arterialPh: 7.20,
    serumLactateMmolL: 5.2,
    hasCentralVenousAccess: true,
    isHietInitiated: true,
    insulinInfusionRateUnitsKgH: 2.0,
    dextroseInfusionRateGKgH: 0.5,
    isIvCalciumAdministered: true,
    calciumSaltType: 'CALCIUM_CHLORIDE',
    calciumDoseGrams: 2.0,
    isGlucagonAdministered: false,
    glucagonBolusMg: 0,
    vasopressorActive: 'NOREPINEPHRINE',
    isLipidRescueConsidered: false,
  };

  describe('evaluateShockSeverity', () => {
    it('calculates MAP and identifies severe cardiogenic shock', () => {
      const res = evaluateShockSeverity(baseInput);
      expect(res.meanArterialPressureMmHg).toBe(53);
      expect(res.severityCategory).toBe('REFRACTORY_CARDIOGENIC_COLLAPSE');
      expect(res.inHospitalMortalityRiskPercent).toBeGreaterThanOrEqual(25);
    });

    it('differentiates vasodilatory shock phenotype in Amlodipine ingestion', () => {
      const amlodipineInput: OverdosePatientInput = {
        ...baseInput,
        toxinClass: 'CCB_DIHYDROPYRIDINE',
        specificDrug: 'AMLODIPINE',
        heartRateBpm: 92,
        systolicBpMmHg: 80,
        diastolicBpMmHg: 40,
      };
      const res = evaluateShockSeverity(amlodipineInput);
      expect(res.vasodilatoryVsCardiogenicPhenotype).toContain('Distributive Vasodilation');
    });
  });

  describe('calculateHietDosing', () => {
    it('calculates 1 unit/kg bolus and infusion rates for 70kg patient', () => {
      const hiet = calculateHietDosing(baseInput);
      expect(hiet.recommendedBolusUnits).toBe(70);
      expect(hiet.recommendedInitialInfusionUnitsPerHour).toBe(70);
      expect(hiet.currentInfusionDoseUnitsPerHour).toBe(140); // 2 U/kg/h * 70kg
      expect(hiet.maximalTitrationCapUnitsPerHour).toBe(700); // 10 U/kg/h * 70kg
    });

    it('triggers critical hypoglycemia warning when glucose < 100 mg/dL', () => {
      const hypoInput: OverdosePatientInput = {
        ...baseInput,
        bloodGlucoseMgDl: 75,
      };
      const hiet = calculateHietDosing(hypoInput);
      expect(hiet.dextroseSupportNeeds.hypoglycemiaWarning).toContain('CRITICAL HYPOGLYCEMIA ALERT');
    });

    it('triggers critical hypokalemia alert when K+ < 3.0 mEq/L', () => {
      const hypoKInput: OverdosePatientInput = {
        ...baseInput,
        serumPotassiumMeqL: 2.7,
      };
      const hiet = calculateHietDosing(hypoKInput);
      expect(hiet.potassiumGuardrail.hypokalemiaAlert).toContain('CRITICAL HYPOKALEMIA ALERT');
    });
  });

  describe('evaluateAdjuvants', () => {
    it('calculates correct elemental calcium delivering 3x higher stoichiometry for chloride vs gluconate', () => {
      const chloride = evaluateAdjuvants(baseInput);
      expect(chloride.calciumGuidance.elementalCalciumMeqDelivered).toBe(27.2); // 2g * 13.6 mEq

      const gluconateInput: OverdosePatientInput = {
        ...baseInput,
        calciumSaltType: 'CALCIUM_GLUCONATE',
      };
      const gluconate = evaluateAdjuvants(gluconateInput);
      expect(gluconate.calciumGuidance.elementalCalciumMeqDelivered).toBe(9.3); // 2g * 4.65 mEq
    });

    it('flags peripheral route extravasation warning for calcium chloride without central line', () => {
      const peripheralChlorideInput: OverdosePatientInput = {
        ...baseInput,
        hasCentralVenousAccess: false,
      };
      const res = evaluateAdjuvants(peripheralChlorideInput);
      expect(res.calciumGuidance.safetyRouteWarning).toContain('EXTRAVASATION TISSUE NECROSIS HAZARD');
    });

    it('indicates glucagon in beta-blocker overdose with shock', () => {
      const bbInput: OverdosePatientInput = {
        ...baseInput,
        toxinClass: 'BETA_BLOCKER',
        specificDrug: 'METOPROLOL',
      };
      const res = evaluateAdjuvants(bbInput);
      expect(res.glucagonGuidance.indicated).toBe(true);
      expect(res.glucagonGuidance.dosingRationale).toContain('adenylyl cyclase');
    });
  });

  describe('performOverdoseEvaluation & Presets', () => {
    it('correctly executes evaluation across all 4 presets', () => {
      for (const preset of OVERDOSE_PRESETS) {
        const evalOut = performOverdoseEvaluation(preset.inputs);
        expect(evalOut.shockSeverity.meanArterialPressureMmHg).toBeGreaterThan(0);
        expect(evalOut.immediateActionDirectives.length).toBeGreaterThanOrEqual(5);
        expect(evalOut.clinicalPearls.length).toBeGreaterThanOrEqual(5);
      }
    });

    it('triggers membrane stabilization alert with sodium bicarbonate recommendation for Propranolol QRS widening', () => {
      const propranololPreset = OVERDOSE_PRESETS[1].inputs;
      const evalOut = performOverdoseEvaluation(propranololPreset);
      expect(evalOut.criticalSafetyInterlocks.some((i) => i.includes('SODIUM CHANNEL BLOCKADE'))).toBe(true);
    });

    it('triggers peripheral calcium chloride vesicant interlock in Preset 4', () => {
      const errorPreset = OVERDOSE_PRESETS[3].inputs;
      const evalOut = performOverdoseEvaluation(errorPreset);
      expect(evalOut.criticalSafetyInterlocks.some((i) => i.includes('CRITICAL ROUTE CONTRAINDICATION'))).toBe(true);
    });
  });
});
