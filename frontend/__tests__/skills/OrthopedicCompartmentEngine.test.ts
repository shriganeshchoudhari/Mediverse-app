import {
  computeOrthopedicState,
  ORTHOPEDIC_PRESETS,
  OrthopedicInputParams,
} from '@/.gemini/skills/OrthopedicCompartmentEngine';

const DEFAULT_PARAMS: OrthopedicInputParams = {
  presetId: 'TIBIAL_FRACTURE_ANTERIOR_ACS',
  region: 'LOWER_LEG_4_COMPARTMENT',
  sbpMmHg: 128,
  dbpMmHg: 70,
  anteriorPressureMmHg: 48,
  lateralPressureMmHg: 26,
  superficialPostPressureMmHg: 16,
  deepPostPressureMmHg: 22,
  forearmVolarPressureMmHg: 18,
  castSplitBivalved: false,
  legElevatedAboveHeart: false,
  anterolateralIncision: false,
  posteromedialIncision: false,
  volarIncision: false,
  hoursSinceInjury: 4,
  urineColorMyoglobinuria: 'CLEAR_YELLOW',
  serumCreatineKinaseUPerL: 1400,
  passiveStretchPain: true,
};

describe('OrthopedicCompartmentEngine', () => {
  describe('Delta P & ACS Diagnosis', () => {
    test('diagnoses ACS when Delta P <= 30 mmHg (DBP 70 - ICP 48 = 22 mmHg)', () => {
      const state = computeOrthopedicState({ ...DEFAULT_PARAMS, anteriorPressureMmHg: 48 });
      expect(state.acsDiagnosed).toBe(true);
      expect(state.worstDeltaPMmHg).toBe(22);
      expect(state.fasciotomyIndicated).toBe(true);
      expect(state.activeAlarms).toContain('ACUTE_COMPARTMENT_SYNDROME_DELTA_P');
    });

    test('reassuring perfusion when Delta P > 30 mmHg and absolute ICP < 30 mmHg', () => {
      const state = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        presetId: 'BENIGN_MUSCLE_CONTUSION_RESOLVING',
        anteriorPressureMmHg: 18,
        lateralPressureMmHg: 14,
        deepPostPressureMmHg: 15,
        dbpMmHg: 75,
      });
      expect(state.acsDiagnosed).toBe(false);
      expect(state.worstDeltaPMmHg).toBe(57);
      expect(state.fasciotomyIndicated).toBe(false);
      expect(state.activeAlarms).toContain('OPTIMAL');
    });

    test('paradoxical leg elevation drops effective DBP and worsens Delta P', () => {
      const atHeartLevel = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        dbpMmHg: 70,
        anteriorPressureMmHg: 38,
        legElevatedAboveHeart: false,
      });
      const elevated = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        dbpMmHg: 70,
        anteriorPressureMmHg: 38,
        legElevatedAboveHeart: true,
      });
      expect(elevated.worstDeltaPMmHg).toBeLessThan(atHeartLevel.worstDeltaPMmHg);
    });
  });

  describe('Cast Bivalving & Decompression', () => {
    test('bivalving circumferential cast drops compartment pressures significantly', () => {
      const tightCast = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        anteriorPressureMmHg: 42,
        castSplitBivalved: false,
      });
      const bivalved = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        anteriorPressureMmHg: 42,
        castSplitBivalved: true,
      });
      const antTight = tightCast.compartments.find(c => c.name.includes('Anterior'))?.pressureMmHg;
      const antBivalved = bivalved.compartments.find(c => c.name.includes('Anterior'))?.pressureMmHg;
      expect(antBivalved).toBeLessThan(antTight!);
    });

    test('2-incision 4-compartment fasciotomy achieves complete decompression', () => {
      const state = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        anterolateralIncision: true,
        posteromedialIncision: true,
      });
      expect(state.fasciotomyState.completeDecompressionAchieved).toBe(true);
      expect(state.fasciotomyIndicated).toBe(false);
      expect(state.worstAbsoluteIcpMmHg).toBeLessThanOrEqual(8);
    });
  });

  describe('Rhabdomyolysis Severity', () => {
    test('detects severe rhabdomyolysis with tea-colored urine and elevated CK', () => {
      const state = computeOrthopedicState({
        ...DEFAULT_PARAMS,
        presetId: 'CRUSH_INJURY_4_COMPARTMENT',
        urineColorMyoglobinuria: 'TEA_COLORED',
        serumCreatineKinaseUPerL: 38000,
      });
      expect(state.rhabdomyolysisSeverity).toBe('SEVERE_AKI_RISK');
      expect(state.activeAlarms).toContain('RHABDOMYOLYSIS_MYOGLOBINURIA');
    });
  });

  describe('Preset Catalog Integrity', () => {
    test('all 6 presets have required clinical metadata', () => {
      expect(Object.keys(ORTHOPEDIC_PRESETS)).toHaveLength(6);
      Object.values(ORTHOPEDIC_PRESETS).forEach(p => {
        expect(p.title).toBeTruthy();
        expect(p.injuryMechanism).toBeTruthy();
        expect(p.clinicalScenario).toBeTruthy();
        expect(p.nerveDeficit).toBeTruthy();
      });
    });
  });
});
