import {
  calculateLeanBodyMass,
  calculateAgeCorrectedMac,
  estimateBis,
  computeTciAnesthesiaState,
  TCI_PRESETS,
  TciPresetId,
} from '../../.gemini/skills/TciAnesthesiaEngine';

describe('TciAnesthesiaEngine — Target-Controlled Infusion & MAC Modeling', () => {
  test('accurately calculates James Lean Body Mass (LBM) for male and female', () => {
    const maleLbm = calculateLeanBodyMass(75, 176, 'M');
    expect(maleLbm).toBeGreaterThan(50);
    expect(maleLbm).toBeLessThan(75);

    const femaleLbm = calculateLeanBodyMass(52, 158, 'F');
    expect(femaleLbm).toBeGreaterThan(30);
    expect(femaleLbm).toBeLessThan(50);

    expect(calculateLeanBodyMass(0, 0, 'M')).toBe(50);
  });

  test('calculates Mapleson age-corrected volatile MAC correctly', () => {
    const baseline = calculateAgeCorrectedMac(40, {
      sevofluranePct: 2.0,
      desfluranePct: 0,
      isofluranePct: 0,
      nitrousOxidePct: 0,
    });
    expect(baseline.totalMac).toBeCloseTo(1.0, 1);
    expect(baseline.macAwake).toBeCloseTo(0.35, 1);
    expect(baseline.macBar).toBeCloseTo(0.67, 1);

    const elderly = calculateAgeCorrectedMac(80, {
      sevofluranePct: 2.0,
      desfluranePct: 0,
      isofluranePct: 0,
      nitrousOxidePct: 0,
    });
    expect(elderly.totalMac).toBeGreaterThan(baseline.totalMac);

    const combined = calculateAgeCorrectedMac(40, {
      sevofluranePct: 1.0,
      desfluranePct: 3.0,
      isofluranePct: 0,
      nitrousOxidePct: 0,
    });
    expect(combined.totalMac).toBeCloseTo(1.0, 1);
  });

  test('accurately estimates BIS with Emax hypnotic-opioid synergism', () => {
    const awakeBis = estimateBis(0, 0, 0);
    expect(awakeBis).toBe(98);

    const propofolAlone = estimateBis(3.5, 0, 0);
    expect(propofolAlone).toBeGreaterThanOrEqual(40);
    expect(propofolAlone).toBeLessThanOrEqual(60);

    const synergized = estimateBis(3.5, 2.5, 0);
    expect(synergized).toBeLessThan(propofolAlone);

    const deepBis = estimateBis(6.0, 4.0, 0);
    expect(deepBis).toBeLessThan(30);
  });

  test('validates all 8 clinical presets generate sound, non-NaN biophysical states', () => {
    const presetKeys = Object.keys(TCI_PRESETS) as TciPresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = TCI_PRESETS[key];
      const state = computeTciAnesthesiaState(preset.initialState);

      expect(state.leanBodyMassKg).toBeGreaterThan(15);
      expect(state.bodyMassIndex).toBeGreaterThan(10);
      expect(state.bisScore).toBeGreaterThanOrEqual(0);
      expect(state.bisScore).toBeLessThanOrEqual(98);
      expect(state.predictedTimeToAwakenMinutes).toBeGreaterThanOrEqual(0);
      expect(state.contextSensitiveHalfTimeMinutes).toBeGreaterThan(0);
      expect(state.hypnoticOpioidSynergyScore).toBeGreaterThanOrEqual(0);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.clinicalGuidance.length).toBeGreaterThan(10);
      expect(state.timeSeries.length).toBe(13);
    });
  });

  test('evaluates Standard Adult TIVA preset', () => {
    const preset = TCI_PRESETS.STANDARD_ADULT_GENERAL_ANESTHESIA;
    const state = computeTciAnesthesiaState(preset.initialState);

    expect(state.bisScore).toBeGreaterThanOrEqual(40);
    expect(state.bisScore).toBeLessThanOrEqual(60);
    expect(state.burstSuppressionRatioPct).toBe(0);
    expect(state.activeAlarms).toContain('OPTIMAL_SURGICAL_ANESTHESIA_BIS_40_60');
  });

  test('evaluates Neuroanesthesia Burst Suppression preset', () => {
    const preset = TCI_PRESETS.NEUROANESTHESIA_BURST_SUPPRESSION;
    const state = computeTciAnesthesiaState(preset.initialState);

    expect(state.bisScore).toBeLessThan(30);
    expect(state.burstSuppressionRatioPct).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('DEEP_BURST_SUPPRESSION_ELECTROCORTICAL_SILENCE');
  });

  test('evaluates Impending Intraoperative Awareness preset and triggers emergency alarm', () => {
    const preset = TCI_PRESETS.INTRAOPERATIVE_AWARENESS_ALARM;
    const state = computeTciAnesthesiaState(preset.initialState);

    expect(state.bisScore).toBeGreaterThan(65);
    expect(state.activeAlarms).toContain('AWARENESS_RISK_INSUFFICIENT_HYPNOTIC_DEPTH');
    expect(state.clinicalGuidance).toContain('CRITICAL AWARENESS HAZARD');
  });

  test('evaluates Balanced Volatile Sevoflurane + N2O preset', () => {
    const preset = TCI_PRESETS.BALANCED_VOLATILE_SEVOFLURANE_N2O;
    const state = computeTciAnesthesiaState(preset.initialState);

    expect(state.totalAgeCorrectedMac).toBeGreaterThan(1.0);
    expect(state.bisScore).toBeLessThanOrEqual(60);
  });
});
