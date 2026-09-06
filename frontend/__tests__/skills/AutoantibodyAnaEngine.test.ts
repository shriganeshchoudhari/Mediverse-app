import {
  getTiterNumeric,
  calculatePostTestProbability,
  calculateEularAcrSleScore,
  calculateAcrEularSscScore,
  calculateSjogrenScore,
  computeAutoantibodyState,
  AUTOANTIBODY_PRESETS,
  AutoantibodyPresetId,
} from '../../.gemini/skills/AutoantibodyAnaEngine';

describe('AutoantibodyAnaEngine — Diagnostic Logic & ICAP HEp-2 IFA Scoring', () => {
  test('accurately maps ANA titer strings to numeric dilution ratios', () => {
    expect(getTiterNumeric('NEGATIVE')).toBe(0);
    expect(getTiterNumeric('1:40')).toBe(40);
    expect(getTiterNumeric('1:80')).toBe(80);
    expect(getTiterNumeric('1:160')).toBe(160);
    expect(getTiterNumeric('1:640')).toBe(640);
    expect(getTiterNumeric('1:2560')).toBe(2560);
  });

  test('calculates Bayesian post-test probability across titers and isolated DFS70', () => {
    // Negative ANA -> low probability
    const negProb = calculatePostTestProbability('NEGATIVE', 'AC-1_HOMOGENEOUS', false);
    expect(negProb).toBeLessThan(5.0);

    // High titer 1:1280 -> elevated post-test probability
    const highProb = calculatePostTestProbability('1:1280', 'AC-1_HOMOGENEOUS', false);
    expect(highProb).toBeGreaterThan(60.0);

    // Isolated DFS70 drastically reduces post-test probability even with positive ANA 1:320
    const dfsProb = calculatePostTestProbability('1:320', 'AC-2_DENSE_FINE_SPECKLED', true);
    expect(dfsProb).toBeLessThan(10.0);
  });

  test('scores 2019 ACR/EULAR criteria for SLE correctly', () => {
    const slePreset = AUTOANTIBODY_PRESETS.SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS;
    const result = calculateEularAcrSleScore(slePreset.initialState);

    expect(result.score).toBeGreaterThanOrEqual(10);
    expect(result.isClassified).toBe(true);

    // Entry criterion failure if ANA < 1:80
    const entryFail = calculateEularAcrSleScore({
      ...slePreset.initialState,
      anaTiter: '1:40',
    });
    expect(entryFail.score).toBe(0);
    expect(entryFail.isClassified).toBe(false);
  });

  test('scores 2013 ACR/EULAR criteria for Systemic Sclerosis correctly', () => {
    const sscPreset = AUTOANTIBODY_PRESETS.DIFFUSE_SYSTEMIC_SCLEROSIS_SCL70;
    const result = calculateAcrEularSscScore(sscPreset.initialState);

    expect(result.score).toBeGreaterThanOrEqual(9);
    expect(result.isClassified).toBe(true);
  });

  test('scores 2016 ACR/EULAR criteria for Primary Sjogren Syndrome correctly', () => {
    const sjogrenPreset = AUTOANTIBODY_PRESETS.PRIMARY_SJOGREN_SYNDROME_RO_LA;
    const result = calculateSjogrenScore(sjogrenPreset.initialState);

    expect(result.score).toBeGreaterThanOrEqual(4);
    expect(result.isClassified).toBe(true);
  });

  test('validates all 8 clinical presets generate sound, non-NaN diagnostic states', () => {
    const presetKeys = Object.keys(AUTOANTIBODY_PRESETS) as AutoantibodyPresetId[];
    expect(presetKeys.length).toBe(8);

    presetKeys.forEach((key) => {
      const preset = AUTOANTIBODY_PRESETS[key];
      const state = computeAutoantibodyState(preset.initialState);

      expect(state.postTestAutoimmuneProbabilityPct).toBeGreaterThan(0);
      expect(state.postTestAutoimmuneProbabilityPct).toBeLessThanOrEqual(100);
      expect(state.primarySuspectedDiagnosis.length).toBeGreaterThan(5);
      expect(state.activeAlarms.length).toBeGreaterThan(0);
      expect(state.clinicalRecommendations.length).toBeGreaterThan(0);
      expect(state.ifaMorphologyDescription.length).toBeGreaterThan(10);
    });
  });

  test('evaluates Active SLE with Lupus Nephritis preset', () => {
    const preset = AUTOANTIBODY_PRESETS.SYSTEMIC_LUPUS_ERYTHEMATOSUS_LUPUS_NEPHRITIS;
    const state = computeAutoantibodyState(preset.initialState);

    expect(state.eularSleClassified).toBe(true);
    expect(state.activeAlarms).toContain('ACTIVE_LUPUS_NEPHRITIS_CLASS_III_IV_RISK');
    expect(state.primarySuspectedDiagnosis).toContain('Systemic Lupus Erythematosus');
  });

  test('evaluates Granulomatosis with Polyangiitis (GPA / c-ANCA Anti-PR3) preset', () => {
    const preset = AUTOANTIBODY_PRESETS.GRANULOMATOSIS_WITH_POLYANGIITIS_CANCA_PR3;
    const state = computeAutoantibodyState(preset.initialState);

    expect(state.primarySuspectedDiagnosis).toContain('Granulomatosis with Polyangiitis');
    expect(state.activeAlarms).toContain('FULMINANT_PAUCI_IMMUNE_NECROTIZING_VASCULITIS_RISK');
  });

  test('evaluates Isolated Anti-DFS70 in Asymptomatic Individual preset', () => {
    const preset = AUTOANTIBODY_PRESETS.HEALTHY_CONTROL_DFS70_ISOLATED;
    const state = computeAutoantibodyState(preset.initialState);

    expect(state.primarySuspectedDiagnosis).toContain('Isolated Anti-DFS70');
    expect(state.activeAlarms).toContain('BENIGN_DFS70_PATTERN_LOW_AUTOIMMUNE_RISK');
    expect(state.postTestAutoimmuneProbabilityPct).toBeLessThan(10);
  });
});
