import {
  calculateGValue,
  generateTegTraceCoordinates,
  computeTegHemostasisState,
  TEG_PRESETS,
  TegPresetId,
} from '../../.gemini/skills/TegHemostasisEngine';

describe('TegHemostasisEngine — Viscoelastic Accuracy & Algorithms', () => {
  test('accurately calculates G-value (shear modulus)', () => {
    // MA = 50 mm -> G = (5000 * 50) / (100 - 50) = 5000 dynes/cm^2
    expect(calculateGValue(50)).toBe(5000);

    // MA = 60 mm -> G = (5000 * 60) / (100 - 60) = 300000 / 40 = 7500 dynes/cm^2
    expect(calculateGValue(60)).toBe(7500);

    // Extreme boundaries
    expect(calculateGValue(0)).toBe(0);
    expect(calculateGValue(99)).toBe(495000);
  });

  test('generates symmetric and valid TEG trace coordinates', () => {
    const coords = generateTegTraceCoordinates(6.0, 2.0, 60.0, 60.0, 1.5);
    expect(coords.length).toBeGreaterThan(50);

    coords.forEach((pt) => {
      expect(pt.upperAmplitudeMm).toBeGreaterThanOrEqual(0);
      expect(pt.lowerAmplitudeMm).toBeLessThanOrEqual(0);
      expect(pt.upperAmplitudeMm).toBeCloseTo(-pt.lowerAmplitudeMm, 1);
      expect(pt.totalAmplitudeMm).toBeCloseTo(pt.upperAmplitudeMm * 2, 1);
    });
  });

  test('evaluates Normal Physiological Hemostasis preset', () => {
    const preset = TEG_PRESETS.NORMAL_PHYSIOLOGICAL_HEMOSTASIS;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.phenotype).toBe('NORMAL_PHYSIOLOGICAL');
    expect(state.interventions.cryoprecipitatePools).toBe(0);
    expect(state.interventions.plateletUnits).toBe(0);
    expect(state.interventions.txaDoseGrams).toBe(0);
    expect(state.interventions.protamineDoseMg).toBe(0);
    expect(state.activeAlarms).toContain('OPTIMAL_HEMOSTATIC_EQUILIBRIUM');
  });

  test('evaluates Severe Hypofibrinogenemia preset and prescribes Cryoprecipitate', () => {
    const preset = TEG_PRESETS.SEVERE_HYPOFIBRINOGENEMIA_MASSIVE_HEMORRHAGE;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.phenotype).toBe('HYPOFIBRINOGENEMIA');
    expect(state.interventions.cryoprecipitatePools).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('CRITICAL_HYPOFIBRINOGENEMIA_CRYOPRECIPITATE_NEEDED');
  });

  test('evaluates Isolated Thrombocytopenia preset and prescribes Platelets', () => {
    const preset = TEG_PRESETS.THROMBOCYTOPENIA_OR_TICP;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.phenotype).toBe('THROMBOCYTOPENIA_PLATELET_DYSFUNCTION');
    expect(state.interventions.plateletUnits).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('SEVERE_PLATELET_DEFICIT_LOW_CLOT_STRENGTH');
  });

  test('evaluates Primary Hyperfibrinolysis preset and prescribes TXA', () => {
    const preset = TEG_PRESETS.PRIMARY_HYPERFIBRINOLYSIS_TRAUMA;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.phenotype).toBe('PRIMARY_HYPERFIBRINOLYSIS');
    expect(state.interventions.txaDoseGrams).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('FULMINANT_HYPERFIBRINOLYSIS_TXA_EMERGENCY');
  });

  test('evaluates Post-CPB Heparin Rebound preset and prescribes Protamine', () => {
    const preset = TEG_PRESETS.SYSTEMIC_HEPARIN_EFFECT_POST_CPB;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.phenotype).toBe('HEPARIN_EFFECT');
    expect(state.interventions.protamineDoseMg).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('CIRCULATING_HEPARIN_PROTAMINE_REVERSAL_REQUIRED');
  });

  test('evaluates Dilutional Lethal Triad preset with hypocalcemia and acidosis', () => {
    const preset = TEG_PRESETS.DILUTIONAL_ACIDOSIS_HYPOTHERMIA_TRIAD;
    const state = computeTegHemostasisState(preset.initialState);

    expect(state.lethalTriadPresent).toBe(true);
    expect(state.interventions.calciumChlorideGrams).toBeGreaterThan(0);
    expect(state.activeAlarms).toContain('LETHAL_TRIAD_HYPOTHERMIA_ACIDOSIS_COAGULOPATHY');
  });

  test('verifies all 8 presets compute valid non-NaN states', () => {
    const presetKeys = Object.keys(TEG_PRESETS) as TegPresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = TEG_PRESETS[key];
      const state = computeTegHemostasisState(preset.initialState);

      expect(isNaN(state.gValueDynesCm2)).toBe(false);
      expect(state.confidencePct).toBeGreaterThan(80);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.clinicalGuidance.length).toBeGreaterThan(10);
      expect(state.traceCoordinates.length).toBeGreaterThan(0);
    });
  });
});
