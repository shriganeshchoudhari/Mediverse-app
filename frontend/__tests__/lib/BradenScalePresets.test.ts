import {
  BRADEN_SUBSCALES,
  calculateBradenScore,
  WOUND_STAGES
} from '../../lib/nursing/BradenScalePresets';

describe('BradenScalePresets', () => {
  it('has 6 subscales (Sensory, Moisture, Activity, Mobility, Nutrition, Friction)', () => {
    expect(BRADEN_SUBSCALES.length).toBe(6);
    const names = BRADEN_SUBSCALES.map(s => s.name.toLowerCase());
    expect(names.some(n => n.includes('sensory'))).toBe(true);
    expect(names.some(n => n.includes('moisture'))).toBe(true);
    expect(names.some(n => n.includes('activity'))).toBe(true);
    expect(names.some(n => n.includes('mobility'))).toBe(true);
    expect(names.some(n => n.includes('nutrition'))).toBe(true);
    expect(names.some(n => n.includes('friction'))).toBe(true);
  });

  it('returns Severe Risk with lowest scores', () => {
    const result = calculateBradenScore({
      sensory: 1, moisture: 1, activity: 1, mobility: 1, nutrition: 1, friction: 1
    });
    expect(result.riskCategory).toBe('Severe Risk');
    expect(result.totalScore).toBe(6);
  });

  it('returns No Risk with maximum score', () => {
    const result = calculateBradenScore({
      sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3
    });
    expect(result.totalScore).toBe(23);
    expect(result.riskCategory).toBe('No Risk');
  });

  it('has at least 5 staging levels', () => {
    expect(WOUND_STAGES.length).toBeGreaterThanOrEqual(5);
    const stages = WOUND_STAGES.map(s => s.stage);
    expect(stages).toContain('I');
    expect(stages).toContain('II');
    expect(stages).toContain('III');
    expect(stages).toContain('IV');
  });
});
