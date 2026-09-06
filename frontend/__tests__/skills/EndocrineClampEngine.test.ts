import {
  calculateBSA,
  calculateBMI,
  calculateHomaIR,
  calculateHomaBeta,
  calculateQUICKI,
  calculateGirFromInfusion,
  evaluateDkaResolution,
  computeEndocrineClampState,
  ENDOCRINE_PRESETS,
  EndocrinePresetId,
} from '../../.gemini/skills/EndocrineClampEngine';

describe('EndocrineClampEngine — Physiological & Mathematical Accuracy', () => {
  test('accurately calculates BSA and BMI', () => {
    // 70 kg, 178 cm -> BMI = 70 / (1.78)^2 = 22.09 -> 22.1
    const bmi = calculateBMI(178, 70);
    expect(bmi).toBeCloseTo(22.1, 1);

    // Mosteller BSA = sqrt(178 * 70 / 3600) = sqrt(3.461) = 1.86 m^2
    const bsa = calculateBSA(178, 70);
    expect(bsa).toBeCloseTo(1.86, 1);
  });

  test('accurately calculates HOMA-IR and QUICKI', () => {
    // Fasting Glucose = 100 mg/dL, Fasting Insulin = 10 uU/mL -> HOMA-IR = (100 * 10) / 405 = 2.47
    const homaIR = calculateHomaIR(100, 10);
    expect(homaIR).toBe(2.47);

    // QUICKI = 1 / (log10(100) + log10(10)) = 1 / (2 + 1) = 0.333
    const quicki = calculateQUICKI(100, 10);
    expect(quicki).toBe(0.333);
  });

  test('accurately calculates HOMA-Beta (% beta cell function)', () => {
    // Fasting Glucose = 86 mg/dL, Fasting Insulin = 10 uU/mL -> (360 * 10) / (86 - 63) = 3600 / 23 = 156.5%
    const homaBeta = calculateHomaBeta(86, 10);
    expect(homaBeta).toBeCloseTo(156.5, 1);
  });

  test('accurately computes GIR from D20W infusion rate', () => {
    // 70 kg patient receiving 210 mL/hr of 20% dextrose (200 mg/mL)
    // GIR = (210 * 200) / (70 * 60) = 42000 / 4200 = 10.0 mg/kg/min
    const gir = calculateGirFromInfusion(210, 20, 70);
    expect(gir).toBe(10.0);
  });

  test('evaluates DKA resolution criteria correctly', () => {
    // Active severe DKA
    const activeDka = evaluateDkaResolution(290, {
      arterialPh: 7.14,
      bicarbonateMeqL: 8,
      betaHydroxybutyrateMmolL: 6.2,
      anionGap: 24,
      potassiumMeqL: 4.8,
      serumOsmolalityMOsmKg: 318,
    });
    expect(activeDka.isAnionGapClosed).toBe(false);
    expect(activeDka.isReadyForSubQTransition).toBe(false);

    // Resolved DKA ready for subQ transition
    const resolvedDka = evaluateDkaResolution(140, {
      arterialPh: 7.35,
      bicarbonateMeqL: 20,
      betaHydroxybutyrateMmolL: 0.4,
      anionGap: 10,
      potassiumMeqL: 4.2,
      serumOsmolalityMOsmKg: 290,
    });
    expect(resolvedDka.isAnionGapClosed).toBe(true);
    expect(resolvedDka.isGlucoseControlled).toBe(true);
    expect(resolvedDka.isReadyForSubQTransition).toBe(true);
  });

  test('evaluates Lean Healthy volunteer with high M value and normal sensitivity', () => {
    const preset = ENDOCRINE_PRESETS.LEAN_HEALTHY_INSULIN_SENSITIVE;
    const state = computeEndocrineClampState(preset.initialState);

    expect(state.steadyStateMValue).toBeGreaterThan(8.0);
    expect(state.homaIR).toBeLessThan(1.5);
    expect(state.insulinResistanceGrade).toBe('NORMAL_INSULIN_SENSITIVE');
    expect(state.activeAlarms).toContain('OPTIMAL_CLAMP_EQUILIBRIUM');
  });

  test('evaluates Metabolic Syndrome preset with impaired glucose disposal', () => {
    const preset = ENDOCRINE_PRESETS.METABOLIC_SYNDROME_INSULIN_RESISTANT;
    const state = computeEndocrineClampState(preset.initialState);

    expect(state.steadyStateMValue).toBeLessThan(6.0);
    expect(state.homaIR).toBeGreaterThan(3.0);
    expect(state.insulinResistanceGrade).toBe('MODERATE_METABOLIC_SYNDROME');
  });

  test('evaluates Athlete Supra-Sensitive preset with M value > 12 mg/kg/min', () => {
    const preset = ENDOCRINE_PRESETS.ATHLETE_SUPRA_SENSITIVE;
    const state = computeEndocrineClampState(preset.initialState);

    expect(state.steadyStateMValue).toBeGreaterThan(12.0);
    expect(state.insulinResistanceGrade).toBe('HIGHLY_SENSITIVE_ATHLETE');
  });

  test('evaluates Severe Acute DKA preset with severe ketoacidosis alarm', () => {
    const preset = ENDOCRINE_PRESETS.SEVERE_ACUTE_DKA_PROTOCOL;
    const state = computeEndocrineClampState(preset.initialState);

    expect(state.activeAlarms).toContain('SEVERE_HIGH_ANION_GAP_KETOACIDOSIS');
    expect(state.dkaMetrics.isAnionGapClosed).toBe(false);
  });

  test('verifies all 8 presets compute valid non-NaN states', () => {
    const presetKeys = Object.keys(ENDOCRINE_PRESETS) as EndocrinePresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = ENDOCRINE_PRESETS[key];
      const state = computeEndocrineClampState(preset.initialState);

      expect(isNaN(state.bmi)).toBe(false);
      expect(isNaN(state.bsaM2)).toBe(false);
      expect(isNaN(state.steadyStateMValue)).toBe(false);
      expect(isNaN(state.homaIR)).toBe(false);
      expect(isNaN(state.quickiIndex)).toBe(false);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.protocolRecommendations.length).toBeGreaterThan(0);
    });
  });
});
