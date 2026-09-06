import {
  calculateMeldNa,
  calculateChildPugh,
  calculateMaddreyDf,
  calculateSaag,
  computeCirrhosisState,
  CIRRHOSIS_PRESETS,
  CirrhosisPresetId,
} from '../../.gemini/skills/CirrhosisPortalHypertensionEngine';

describe('CirrhosisPortalHypertensionEngine — MELD-Na, Child-Pugh & Portal Dynamics', () => {
  test('accurately calculates UNOS 2016 MELD-Na score with hyponatremia correction', () => {
    // Normal baseline: Bili 1.1, Cr 0.9, INR 1.1, Na 140, no dialysis -> ~7 - 9
    const baseline = calculateMeldNa(1.1, 0.9, 1.1, 140, false);
    expect(baseline.meldNa).toBeGreaterThanOrEqual(6);
    expect(baseline.meldNa).toBeLessThanOrEqual(10);
    expect(baseline.mortalityPct).toBeLessThan(5.0);

    // Severe decompensation with hyponatremia: Bili 4.8, Cr 3.4, INR 2.2, Na 124 -> MELD-Na > 30
    const decompensated = calculateMeldNa(4.8, 3.4, 2.2, 124, false);
    expect(decompensated.meldNa).toBeGreaterThan(30);
    expect(decompensated.mortalityPct).toBeGreaterThan(50.0);

    // Dialysis cap enforcement: Cr set to 4.0
    const dialysisPatient = calculateMeldNa(3.0, 1.8, 2.0, 130, true);
    const nonDialysisCr4 = calculateMeldNa(3.0, 4.0, 2.0, 130, false);
    expect(dialysisPatient.meldNa).toBe(nonDialysisCr4.meldNa);
  });

  test('accurately stratifies Child-Turcotte-Pugh (CTP) classes A, B, and C', () => {
    // Class A: Bili 1.1 (1), Alb 4.1 (1), INR 1.1 (1), Ascites NONE (1), Enceph NONE (1) -> 5 pts
    const classA = calculateChildPugh(1.1, 4.1, 1.1, 'NONE', 'NONE');
    expect(classA.score).toBe(5);
    expect(classA.ctpClass).toBe('CLASS_A');
    expect(classA.oneYearSurvival).toBe(100);

    // Class B: Bili 2.5 (2), Alb 3.0 (2), INR 1.8 (2), Ascites MILD (2), Enceph NONE (1) -> 9 pts
    const classB = calculateChildPugh(2.5, 3.0, 1.8, 'MILD_CONTROLLED', 'NONE');
    expect(classB.score).toBe(9);
    expect(classB.ctpClass).toBe('CLASS_B');
    expect(classB.oneYearSurvival).toBe(80);

    // Class C: Bili 4.0 (3), Alb 2.2 (3), INR 2.4 (3), Ascites MODERATE (3), Enceph GRADE_3_4 (3) -> 15 pts
    const classC = calculateChildPugh(4.0, 2.2, 2.4, 'MODERATE_SEVERE_REFRACTORY', 'GRADE_3_4');
    expect(classC.score).toBe(15);
    expect(classC.ctpClass).toBe('CLASS_C');
    expect(classC.oneYearSurvival).toBe(45);
  });

  test('calculates Maddrey Discriminant Function (DF) for acute alcoholic hepatitis', () => {
    // PT patient 28s, control 12s, Total Bili 18 mg/dL -> DF = 4.6 * 16 + 18 = 91.6
    const df = calculateMaddreyDf(28.0, 12.0, 18.0);
    expect(df).toBeCloseTo(91.6, 1);
    expect(df).toBeGreaterThanOrEqual(32); // severe
  });

  test('calculates Serum-Ascites Albumin Gradient (SAAG)', () => {
    // Serum Alb 2.4 g/dL, Ascitic Alb 0.7 g/dL -> SAAG = 1.7 g/dL (Portal HTN >= 1.1)
    const saag = calculateSaag(2.4, 0.7);
    expect(saag).toBe(1.7);
    expect(saag).toBeGreaterThanOrEqual(1.1);
  });

  test('validates all 8 clinical presets generate sound, non-NaN biophysical states', () => {
    const presetKeys = Object.keys(CIRRHOSIS_PRESETS) as CirrhosisPresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = CIRRHOSIS_PRESETS[key];
      const state = computeCirrhosisState(preset.initialState);

      expect(state.meldNaScore).toBeGreaterThanOrEqual(6);
      expect(state.meldNaScore).toBeLessThanOrEqual(40);
      expect(state.childPughScore).toBeGreaterThanOrEqual(5);
      expect(state.childPughScore).toBeLessThanOrEqual(15);
      expect(state.hepaticVenousPressureGradientMmhg).toBeGreaterThanOrEqual(0);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.clinicalGuidance.length).toBeGreaterThan(15);
    });
  });

  test('evaluates Compensated Cirrhosis Child-Pugh Class A preset', () => {
    const preset = CIRRHOSIS_PRESETS.COMPENSATED_CIRRHOSIS_CHILD_A;
    const state = computeCirrhosisState(preset.initialState);

    expect(state.childPughClass).toBe('CLASS_A');
    expect(state.isClinicallySignificantPortalHypertension).toBe(false);
    expect(state.activeAlarms).toContain('COMPENSATED_CIRRHOSIS_STABLE_HEMODYNAMICS');
  });

  test('evaluates Acute Variceal Hemorrhage CSPH preset', () => {
    const preset = CIRRHOSIS_PRESETS.ACUTE_VARICEAL_HEMORRHAGE_CSPH;
    const state = computeCirrhosisState(preset.initialState);

    expect(state.hepaticVenousPressureGradientMmhg).toBeGreaterThanOrEqual(12);
    expect(state.isHighRiskVaricealBleed).toBe(true);
    expect(state.activeAlarms).toContain('HIGH_RISK_VARICEAL_HEMORRHAGE_CRITICAL_HVPG');
  });

  test('evaluates Spontaneous Bacterial Peritonitis (SBP) preset', () => {
    const preset = CIRRHOSIS_PRESETS.DECOMPENSATED_ASCITES_SBP_PERITONITIS;
    const state = computeCirrhosisState(preset.initialState);

    expect(state.isSpontaneousBacterialPeritonitis).toBe(true);
    expect(state.isPortalHypertensiveAscites).toBe(true);
    expect(state.activeAlarms).toContain('SPONTANEOUS_BACTERIAL_PERITONITIS_EMERGENCY');
    expect(state.clinicalGuidance).toContain('SBP PARACENTESIS ALERT');
  });

  test('evaluates Severe Alcoholic Hepatitis with high Maddrey DF preset', () => {
    const preset = CIRRHOSIS_PRESETS.SEVERE_ALCOHOLIC_HEPATITIS_MADDREY_HIGH;
    const state = computeCirrhosisState(preset.initialState);

    expect(state.isSevereAlcoholicHepatitis).toBe(true);
    expect(state.activeAlarms).toContain('SEVERE_ALCOHOLIC_HEPATITIS_MADDREY_GE_32');
    expect(state.clinicalGuidance).toContain('Prednisolone 40 mg/day');
  });

  test('evaluates Hepatorenal Syndrome Type 1 (HRS-AKI) preset', () => {
    const preset = CIRRHOSIS_PRESETS.HEPATORENAL_SYNDROME_TYPE_1_HRS_AKI;
    const state = computeCirrhosisState(preset.initialState);

    expect(state.isHepatorenalSyndromeSuspected).toBe(true);
    expect(state.activeAlarms).toContain('HEPATORENAL_SYNDROME_TYPE_1_AKI_SUSPECTED');
    expect(state.clinicalGuidance).toContain('Terlipressin');
  });
});
