/**
 * CardiogenicShockEngine.test.ts
 * Unit tests for CardiogenicShockEngine.
 */

import {
  computeHemodynamics,
  classifyScaiStage,
  auditRvFailure,
  recommendMcsEscalation,
  SHOCK_SCENARIOS,
  HemodynamicProfile,
  InotropeVasopressorDoses,
} from '../../.gemini/skills/CardiogenicShockEngine';

describe('CardiogenicShockEngine', () => {
  const defaultHemo: HemodynamicProfile = {
    systolicBpMmHg: 85,
    diastolicBpMmHg: 55,
    meanArterialPressureMmHg: 65,
    heartRateBpm: 110,
    cardiacOutputLpm: 3.5,
    cardiacIndexLpmM2: 1.8,
    bodySurfaceAreaM2: 1.94,
    centralVenousPressureMmHg: 14,
    meanPulmonaryArteryPressureMmHg: 32,
    pulmonaryArterySystolicMmHg: 44,
    pulmonaryArteryDiastolicMmHg: 24,
    pulmonaryCapillaryWedgePressureMmHg: 22,
    arterialLactateMmolL: 3.2,
    mixedVenousSatSvo2Percent: 54,
    urineOutputMlKgHr: 0.35,
    hasCardiacArrestModifier: false,
  };

  const defaultDrugs: InotropeVasopressorDoses = {
    norepinephrineMcgKgMin: 0.15,
    epinephrineMcgKgMin: 0,
    dobutamineMcgKgMin: 5.0,
    milrinoneMcgKgMin: 0,
    vasopressinUnitsMin: 0,
    dopamineMcgKgMin: 0,
  };

  describe('computeHemodynamics', () => {
    it('calculates CPO, PAPi, SVR, PVR, and VIS correctly', () => {
      const res = computeHemodynamics(defaultHemo, defaultDrugs);

      // CPO = (65 * 3.5) / 451 = 227.5 / 451 = 0.504 -> 0.50 Watts
      expect(res.cardiacPowerOutputWatts).toBeCloseTo(0.50, 1);

      // PAPi = (44 - 24) / 14 = 20 / 14 = 1.43
      expect(res.pulmonaryArteryPulsatilityIndex).toBeCloseTo(1.43, 1);

      // SVR = ((65 - 14) * 80) / 3.5 = (51 * 80) / 3.5 = 4080 / 3.5 = 1166
      expect(res.systemicVascularResistanceDyneSecCm5).toBe(1166);

      // PVR = (32 - 22) / 3.5 = 10 / 3.5 = 2.86 Wood Units
      expect(res.pulmonaryVascularResistanceWoodUnits).toBeCloseTo(2.86, 1);

      // VIS = 0 + 5 + 0 + 100*(0.15) + 0 + 0 = 20
      expect(res.vasoactiveInotropicScore).toBe(20);
    });
  });

  describe('classifyScaiStage', () => {
    it('classifies Classic Shock (Stage C) correctly', () => {
      const scenario = SHOCK_SCENARIOS.anterior_stemi_stage_c;
      const res = classifyScaiStage(scenario.initialHemodynamics, scenario.initialVasoactives, scenario.initialDevice);

      expect(res.stage).toBe('C');
      expect(res.stageWithModifier).toBe('Stage C');
      expect(res.mortalityRiskPercent).toBeGreaterThan(15);
      expect(res.criteriaMet.length).toBeGreaterThan(0);
    });

    it('classifies Pre-Shock (Stage B) with preserved end-organ perfusion', () => {
      const scenario = SHOCK_SCENARIOS.chronic_hf_decompensated_stage_b;
      const res = classifyScaiStage(scenario.initialHemodynamics, scenario.initialVasoactives, scenario.initialDevice);

      expect(res.stage).toBe('B');
      expect(res.mortalityRiskPercent).toBeLessThan(15);
    });

    it('classifies Extremis (Stage E) with Cardiac Arrest Modifier', () => {
      const scenario = SHOCK_SCENARIOS.post_arrest_refractory_extremis;
      const res = classifyScaiStage(scenario.initialHemodynamics, scenario.initialVasoactives, scenario.initialDevice);

      expect(res.stage).toBe('E');
      expect(res.hasCardiacArrestModifier).toBe(true);
      expect(res.stageWithModifier).toBe('Stage E_CA');
      expect(res.mortalityRiskPercent).toBeGreaterThan(70);
    });
  });

  describe('auditRvFailure', () => {
    it('identifies preserved RV function in anterior STEMI', () => {
      const scenario = SHOCK_SCENARIOS.anterior_stemi_stage_c;
      const audit = auditRvFailure(scenario.initialHemodynamics);

      expect(audit.isRvFailurePresent).toBe(false);
      expect(audit.papiValue).toBeGreaterThan(1.2);
    });

    it('identifies severe RV failure in inferior/RV infarction', () => {
      const scenario = SHOCK_SCENARIOS.biventricular_inferior_rv_mi;
      const audit = auditRvFailure(scenario.initialHemodynamics);

      expect(audit.isRvFailurePresent).toBe(true);
      expect(audit.rvFailureSeverity).toBe('Severe Biventricular Collapse');
      expect(audit.papiValue).toBeLessThan(0.9);
      expect(audit.cvpToPcwpRatio).toBeGreaterThan(0.8);
    });
  });

  describe('recommendMcsEscalation', () => {
    it('recommends isolated LV microaxial pump (Impella CP) for isolated LV shock', () => {
      const scenario = SHOCK_SCENARIOS.anterior_stemi_stage_c;
      const rec = recommendMcsEscalation(scenario.initialHemodynamics, scenario.initialVasoactives, 'none');

      expect(rec.primaryDevice).toBe('impella_cp');
      expect(rec.lvUnloadingRequired).toBe(true);
      expect(rec.rvSupportRequired).toBe(false);
      expect(rec.deviceRationale).toMatch(/DanGer Shock/i);
    });

    it('recommends biventricular support / ECPELLA for severe RV failure', () => {
      const scenario = SHOCK_SCENARIOS.biventricular_inferior_rv_mi;
      const rec = recommendMcsEscalation(scenario.initialHemodynamics, scenario.initialVasoactives, 'none');

      expect(rec.primaryDevice).toBe('ecpella_combined');
      expect(rec.rvSupportRequired).toBe(true);
      expect(rec.deviceRationale).toMatch(/biventricular/i);
    });

    it('recommends emergent ECPELLA / VA-ECMO for Stage E extremis shock', () => {
      const scenario = SHOCK_SCENARIOS.post_arrest_refractory_extremis;
      const rec = recommendMcsEscalation(scenario.initialHemodynamics, scenario.initialVasoactives, 'none');

      expect(rec.primaryDevice).toBe('ecpella_combined');
      expect(rec.lvUnloadingRequired).toBe(true);
      expect(rec.deviceRationale).toMatch(/ECPELLA/i);
    });
  });
});
