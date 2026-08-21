import {
  calculateNEWS2Score,
  SAMPLE_NEWS2_SCENARIOS
} from '../../lib/nursing/NEWS2Presets';

describe('NEWS2Presets', () => {
  it('returns score 0 (Low risk) for stable vitals', () => {
    const result = calculateNEWS2Score({
      respirationRate: 16,
      spo2Scale1: 98,
      usesOxygen: false,
      systolicBp: 120,
      heartRate: 75,
      consciousness: 'Alert',
      temperature: 36.8
    }, false);
    expect(result.totalScore).toBe(0);
    expect(result.riskTier).toBe('Low');
  });

  it('returns High risk tier and non-empty SBAR script for severe deterioration', () => {
    const result = calculateNEWS2Score({
      respirationRate: 28,
      spo2Scale1: 90,
      usesOxygen: true,
      systolicBp: 85,
      heartRate: 125,
      consciousness: 'CVPU',
      temperature: 39.5
    }, false);
    expect(result.totalScore).toBeGreaterThanOrEqual(7);
    expect(result.riskTier).toBe('High');
    expect(result.sbarScript).toBeTruthy();
    expect(result.sbarScript.situation).toContain('NEWS2 score');
  });

  it('has at least 3 clinical scenarios in SAMPLE_NEWS2_SCENARIOS', () => {
    expect(SAMPLE_NEWS2_SCENARIOS.length).toBeGreaterThanOrEqual(3);
  });
});
