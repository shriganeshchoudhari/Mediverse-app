import {
  probabilityToOdds,
  oddsToProbability,
  calculateLikelihoodRatios,
  applyBayesianUpdate,
  computeDiagnosticCascade,
  computeContingencyTable,
  computePaukerKassirerThresholds,
  DIAGNOSTIC_SCENARIOS,
  DiagnosticTest,
} from '../../.gemini/skills/BayesianDiagnosticEngine';

describe('BayesianDiagnosticEngine Unit Tests', () => {
  const dummyTest: DiagnosticTest = {
    id: 'test-troponin',
    name: 'Cardiac Troponin High Sens',
    targetCondition: 'Acute MI',
    sensitivity: 0.90,
    specificity: 0.90,
    lrPositive: 9.0,
    lrNegative: 0.111,
    costUsd: 50,
    invasivenessRisk: 'low',
    turnaroundTime: '30m',
    description: 'hs-cTn',
  };

  it('1. converts between probability and odds accurately', () => {
    // P = 0.5 -> Odds = 1.0
    expect(probabilityToOdds(0.5)).toBeCloseTo(1.0, 4);
    expect(oddsToProbability(1.0)).toBeCloseTo(0.5, 4);

    // P = 0.2 -> Odds = 0.2 / 0.8 = 0.25
    expect(probabilityToOdds(0.2)).toBeCloseTo(0.25, 4);
    expect(oddsToProbability(0.25)).toBeCloseTo(0.2, 4);
  });

  it('2. computes likelihood ratios from sensitivity and specificity', () => {
    // Sens = 0.95, Spec = 0.90
    // LR+ = 0.95 / (1 - 0.90) = 9.5
    // LR- = (1 - 0.95) / 0.90 = 0.05 / 0.90 = 0.056
    const { lrPositive, lrNegative } = calculateLikelihoodRatios(0.95, 0.90);
    expect(lrPositive).toBeCloseTo(9.5, 1);
    expect(lrNegative).toBeCloseTo(0.056, 2);
  });

  it('3. applies Bayesian update for positive and negative test results', () => {
    const preProb = 0.20; // 20% pre-test probability
    // Pre-odds = 0.25. Positive LR = 9.0 -> Post-odds = 2.25 -> Post-prob = 2.25 / 3.25 = 0.6923
    const posStep = applyBayesianUpdate(preProb, dummyTest, 'positive');
    expect(posStep.postTestProb).toBeCloseTo(0.6923, 2);
    expect(posStep.result).toBe('positive');

    // Negative LR = 0.111 -> Post-odds = 0.25 * 0.111 = 0.02775 -> Post-prob = 0.02775 / 1.02775 = 0.027
    const negStep = applyBayesianUpdate(preProb, dummyTest, 'negative');
    expect(negStep.postTestProb).toBeCloseTo(0.027, 2);
    expect(negStep.result).toBe('negative');
  });

  it('4. computes sequential multi-step diagnostic cascades', () => {
    const sequence = [
      { test: dummyTest, result: 'positive' as const },
      { test: dummyTest, result: 'positive' as const },
    ];
    // Start with 10% (odds 0.111) -> Step 1 (odds 1.0, prob 50%) -> Step 2 (odds 9.0, prob 90%)
    const cascade = computeDiagnosticCascade(0.10, sequence);
    expect(cascade.steps).toHaveLength(2);
    expect(cascade.steps[0].postTestProb).toBeCloseTo(0.50, 1);
    expect(cascade.steps[1].postTestProb).toBeCloseTo(0.90, 1);
    expect(cascade.finalProbability).toBeCloseTo(0.90, 1);
  });

  it('5. computes 2x2 contingency table and predictive values', () => {
    const prevalence = 0.10; // 10% in 1000 patients = 100 diseased, 900 non-diseased
    const table = computeContingencyTable(prevalence, dummyTest, 1000);

    expect(table.truePositives).toBe(90);  // 100 * 0.90
    expect(table.falseNegatives).toBe(10); // 100 * 0.10
    expect(table.falsePositives).toBe(90); // 900 * (1 - 0.90)
    expect(table.trueNegatives).toBe(810); // 900 * 0.90
    expect(table.ppv).toBeCloseTo(0.50, 2); // 90 / (90 + 90) = 50%
    expect(table.npv).toBeCloseTo(0.9878, 2); // 810 / 820 = 98.8%
  });

  it('6. determines Pauker-Kassirer thresholds and clinical decision', () => {
    // High benefit (80), low harm of treat (20), minimal test harm (5)
    const thresholds = computePaukerKassirerThresholds(80, 20, 5, dummyTest, 0.40);
    expect(thresholds.testingThreshold).toBeLessThan(thresholds.treatmentThreshold);
    expect(thresholds.currentAction).toBe('TEST_INDICATED');

    // Very low probability (1%) -> NO_TEST_NO_TREAT
    const lowP = computePaukerKassirerThresholds(80, 20, 5, dummyTest, 0.01);
    expect(lowP.currentAction).toBe('NO_TEST_NO_TREAT');

    // Very high probability (95%) -> TREAT_IMMEDIATELY
    const highP = computePaukerKassirerThresholds(80, 20, 5, dummyTest, 0.95);
    expect(highP.currentAction).toBe('TREAT_IMMEDIATELY');
  });

  it('7. loads scenario presets and validates clinical data', () => {
    expect(DIAGNOSTIC_SCENARIOS.length).toBeGreaterThanOrEqual(4);
    const peScenario = DIAGNOSTIC_SCENARIOS.find(s => s.id === 'pulmonary-embolism');
    expect(peScenario).toBeDefined();
    expect(peScenario?.recommendedTests.length).toBeGreaterThanOrEqual(3);
  });
});
