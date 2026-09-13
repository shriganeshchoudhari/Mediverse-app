import {
  calculateNews2Score,
  calculateFluidBalanceSummary,
  generateSepsisProgressionCase,
  News2Vitals
} from '../../.gemini/skills/BedsideFlowsheetNews2Engine';

describe('BedsideFlowsheetNews2Engine Unit Tests', () => {
  it('1. calculates normal baseline vitals as NEWS2 = 0 (Low Risk)', () => {
    const normalVitals: News2Vitals = {
      respiratoryRate: 14,
      spo2Scale: 1,
      spo2Percent: 98,
      onSupplementalOxygen: false,
      systolicBp: 120,
      heartRate: 72,
      consciousness: 'A',
      temperatureCelsius: 36.8
    };

    const res = calculateNews2Score(normalVitals);
    expect(res.totalScore).toBe(0);
    expect(res.riskLevel).toBe('LOW');
    expect(res.hasSingleParameterScoreThree).toBe(false);
  });

  it('2. calculates severe sepsis vitals as NEWS2 >= 7 (High Risk / Emergency MET)', () => {
    const septicVitals: News2Vitals = {
      respiratoryRate: 28, // 3 points
      spo2Scale: 1,
      spo2Percent: 92, // 2 points
      onSupplementalOxygen: true, // 2 points
      systolicBp: 86, // 3 points
      heartRate: 134, // 3 points
      consciousness: 'C', // 3 points
      temperatureCelsius: 39.4 // 2 points
    };

    const res = calculateNews2Score(septicVitals);
    expect(res.totalScore).toBeGreaterThanOrEqual(12);
    expect(res.riskLevel).toBe('HIGH');
    expect(res.clinicalAction).toMatch(/EMERGENCY ESCALATION/i);
  });

  it('3. flags single parameter score of 3 (e.g. SBP 85 mmHg) as LOW_MEDIUM risk', () => {
    const singleExtremeVitals: News2Vitals = {
      respiratoryRate: 16,
      spo2Scale: 1,
      spo2Percent: 97,
      onSupplementalOxygen: false,
      systolicBp: 85, // 3 points
      heartRate: 80,
      consciousness: 'A',
      temperatureCelsius: 37.0
    };

    const res = calculateNews2Score(singleExtremeVitals);
    expect(res.totalScore).toBe(3);
    expect(res.hasSingleParameterScoreThree).toBe(true);
    expect(res.riskLevel).toBe('LOW_MEDIUM');
  });

  it('4. correctly applies Scale 2 SpO2 for hypercapnic respiratory failure (target 88-92%)', () => {
    const copdVitals: News2Vitals = {
      respiratoryRate: 18,
      spo2Scale: 2,
      spo2Percent: 90, // target 88-92% -> 0 points on Scale 2
      onSupplementalOxygen: true,
      systolicBp: 124,
      heartRate: 84,
      consciousness: 'A',
      temperatureCelsius: 37.0
    };

    const res = calculateNews2Score(copdVitals);
    expect(res.spo2Score).toBe(0); // 0 points for 90% SpO2 on Scale 2
  });

  it('5. penalizes hyperoxia on supplemental oxygen in Scale 2 (SpO2 >= 97% triggers 3 points)', () => {
    const hyperoxicCopdVitals: News2Vitals = {
      respiratoryRate: 18,
      spo2Scale: 2,
      spo2Percent: 98, // Dangerous hyperoxia in COPD
      onSupplementalOxygen: true,
      systolicBp: 120,
      heartRate: 80,
      consciousness: 'A',
      temperatureCelsius: 37.0
    };

    const res = calculateNews2Score(hyperoxicCopdVitals);
    expect(res.spo2Score).toBe(3); // 3 points penalty for loss of hypoxic drive hazard
  });

  it('6. calculates 24h cumulative fluid balance and percent fluid overload correctly', () => {
    const sepsisCase = generateSepsisProgressionCase();
    const summary = calculateFluidBalanceSummary(sepsisCase.hourlyData, sepsisCase.admissionWeightKg);

    expect(summary.total24hIntakeMl).toBeGreaterThan(0);
    expect(summary.total24hOutputMl).toBeGreaterThan(0);
    expect(summary.percentFluidOverload).toBeDefined();
  });
});
