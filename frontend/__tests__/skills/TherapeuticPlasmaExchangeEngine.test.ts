import {
  calculatePlasmaVolume,
  calculateSoluteFractionRemaining,
  calculateSoluteRemovalPercent,
  initializeTpeSession,
  stepTpeProcedure,
  evaluateCoagulationAndElectrolytes,
  getAsfaIndication,
  PatientDemographics,
  TpeProcedureSettings,
} from '../../.gemini/skills/TherapeuticPlasmaExchangeEngine';

describe('TherapeuticPlasmaExchangeEngine', () => {
  describe('Plasma Volume (PV) Calculation', () => {
    it('accurately calculates PV from weight and hematocrit', () => {
      // 70 kg, 40% Hct -> 70 * 70 * 0.60 = 2940 mL
      const pv70kg = calculatePlasmaVolume(70, 0.40);
      expect(pv70kg).toBe(2940);

      // 50 kg, 30% Hct -> 50 * 70 * 0.70 = 2450 mL
      const pv50kg = calculatePlasmaVolume(50, 0.30);
      expect(pv50kg).toBe(2450);
    });
  });

  describe('First-Order Solute Removal Kinetics', () => {
    it('conforms to C(Ve) = C0 * e^(-Ve/PV)', () => {
      // 1.0 PV exchange -> e^(-1) ~ 0.3678 -> 63.2% removed
      const remaining1Pv = calculateSoluteFractionRemaining(1.0);
      expect(remaining1Pv).toBeCloseTo(0.368, 2);
      expect(calculateSoluteRemovalPercent(1.0)).toBeCloseTo(63.2, 1);

      // 1.5 PV exchange -> e^(-1.5) ~ 0.2231 -> 77.7% removed
      const remaining1_5Pv = calculateSoluteFractionRemaining(1.5);
      expect(remaining1_5Pv).toBeCloseTo(0.223, 2);
      expect(calculateSoluteRemovalPercent(1.5)).toBeCloseTo(77.7, 1);

      // 2.0 PV exchange -> e^(-2.0) ~ 0.1353 -> 86.5% removed
      const remaining2Pv = calculateSoluteFractionRemaining(2.0);
      expect(remaining2Pv).toBeCloseTo(0.135, 2);
      expect(calculateSoluteRemovalPercent(2.0)).toBeCloseTo(86.5, 1);
    });
  });

  describe('TPE Procedure & Coagulation Kinetics', () => {
    const defaultPatient: PatientDemographics = {
      weightKg: 70,
      hematocritFraction: 0.40,
      baselinePathogenConc: 100,
      baselineFibrinogenMgDl: 300,
      baselinePlatelets: 220000,
      baselineIonizedCaMmolL: 1.25,
    };

    const albuminSettings: TpeProcedureSettings = {
      targetPvMultiplier: 1.0,
      replacementFluidType: 'albumin_5',
      splitFfpFraction: 0,
      acdaRatio: 12,
      bloodFlowRateMlMin: 100,
      calciumGluconateInfusionMgHr: 1000,
      hasLiverImpairment: false,
    };

    it('demonstrates dilutional hypofibrinogenemia with 5% albumin replacement', () => {
      let state = initializeTpeSession(defaultPatient, albuminSettings);
      expect(state.currentFibrinogenMgDl).toBe(300);

      // Step until ~1.0 PV reached
      state = stepTpeProcedure(state, defaultPatient, albuminSettings, 60);
      state = stepTpeProcedure(state, defaultPatient, albuminSettings, 60);

      expect(state.fractionPvExchanged).toBeGreaterThanOrEqual(0.9);
      // Fibrinogen should drop ~60% (down to ~110-130 mg/dL)
      expect(state.currentFibrinogenMgDl).toBeLessThan(150);
      expect(state.currentFibrinogenMgDl).toBeGreaterThan(50);
    });

    it('preserves fibrinogen when Fresh Frozen Plasma (FFP) is used as replacement', () => {
      const ffpSettings: TpeProcedureSettings = {
        ...albuminSettings,
        replacementFluidType: 'ffp',
      };
      let state = initializeTpeSession(defaultPatient, ffpSettings);

      state = stepTpeProcedure(state, defaultPatient, ffpSettings, 60);
      state = stepTpeProcedure(state, defaultPatient, ffpSettings, 60);

      // FFP preserves fibrinogen close to donor levels
      expect(state.currentFibrinogenMgDl).toBeGreaterThan(250);
    });

    it('demonstrates citrate-induced hypocalcemia when IV calcium infusion is omitted', () => {
      const noCaSettings: TpeProcedureSettings = {
        ...albuminSettings,
        calciumGluconateInfusionMgHr: 0, // No calcium replacement
      };
      let state = initializeTpeSession(defaultPatient, noCaSettings);

      state = stepTpeProcedure(state, defaultPatient, noCaSettings, 60);
      state = stepTpeProcedure(state, defaultPatient, noCaSettings, 60);

      expect(state.systemicIonizedCaMmolL).toBeLessThan(1.05);
      expect(state.citrateToxicityLevel).not.toBe('none');
    });

    it('detects citrate accumulation / "citrate lock" in liver impairment', () => {
      const liverSettings: TpeProcedureSettings = {
        ...albuminSettings,
        hasLiverImpairment: true,
        calciumGluconateInfusionMgHr: 400,
      };
      let state = initializeTpeSession(defaultPatient, liverSettings);

      state = stepTpeProcedure(state, defaultPatient, liverSettings, 60);
      state = stepTpeProcedure(state, defaultPatient, liverSettings, 60);

      expect(state.totalCaToIonizedCaRatio).toBeGreaterThan(2.5);
      const audit = evaluateCoagulationAndElectrolytes(state, liverSettings);
      expect(audit.citrateAccumulationAlert).toBe(true);
    });
  });

  describe('ASFA 2023 Guidelines Catalog', () => {
    it('classifies TTP as Category I with mandatory FFP replacement', () => {
      const ttpInfo = getAsfaIndication('ttp');
      expect(ttpInfo.asfaCategory).toBe('I');
      expect(ttpInfo.recommendedReplacement).toBe('ffp');
      expect(ttpInfo.clinicalPearls.some((p) => p.includes('contraindicated in TTP'))).toBe(true);
    });

    it('classifies Myasthenia Gravis and GBS as Category I with 5% albumin replacement', () => {
      const mgInfo = getAsfaIndication('myasthenia_gravis');
      expect(mgInfo.asfaCategory).toBe('I');
      expect(mgInfo.recommendedReplacement).toBe('albumin_5');

      const gbsInfo = getAsfaIndication('gbs');
      expect(gbsInfo.asfaCategory).toBe('I');
      expect(gbsInfo.recommendedReplacement).toBe('albumin_5');
    });

    it('classifies NMOSD as Category II', () => {
      const nmosdInfo = getAsfaIndication('nmosd');
      expect(nmosdInfo.asfaCategory).toBe('II');
    });
  });
});
