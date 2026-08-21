import { BRUNNSTROM_STAGES, PNF_PATTERNS, MODIFIED_ASHWORTH_SCALE } from '../../lib/physiotherapy/NeurorehabPresets';

describe('NeurorehabPresets', () => {
  it('BRUNNSTROM_STAGES has 6 stages of motor recovery', () => {
    expect(BRUNNSTROM_STAGES.length).toBe(6);
    expect(BRUNNSTROM_STAGES[0].stage).toBe(1);
    expect(BRUNNSTROM_STAGES[5].stage).toBe(6);
  });

  it('PNF_PATTERNS has at least 8 diagonal patterns', () => {
    expect(PNF_PATTERNS.length).toBeGreaterThanOrEqual(8);
  });

  it('has 6 levels (0, 1, 1+, 2, 3, 4)', () => {
    expect(MODIFIED_ASHWORTH_SCALE.length).toBe(6);
    const levels = MODIFIED_ASHWORTH_SCALE.map(l => l.score);
    expect(levels).toEqual(['0', '1', '1+', '2', '3', '4']);
  });
});
