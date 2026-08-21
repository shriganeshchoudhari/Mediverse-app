import { PATHOGEN_OUTBREAK_PRESETS, calculateHerdImmunityThreshold, calculateSEIRTrajectory } from '../../lib/public-health/EpidemicModelPresets';

describe('EpidemicModelPresets', () => {
  it('contains COVID-19, Measles, Influenza', () => {
    const names = PATHOGEN_OUTBREAK_PRESETS.map(p => p.name);
    expect(names.some(n => n.includes('COVID-19'))).toBe(true);
    expect(names.some(n => n.includes('Measles'))).toBe(true);
    expect(names.some(n => n.includes('Influenza'))).toBe(true);
  });

  it('computes correct HIT for R0=3.0 (~66.7%)', () => {
    const hit = calculateHerdImmunityThreshold(3.0);
    expect(hit).toBeCloseTo(0.667, 2);
  });

  it('returns non-empty trajectory array', () => {
    // n: 100000, initialI: 10, beta: 0.5, sigma: 0.2, gamma: 0.1, days: 30, npiReductionPct: 0
    const trajectory = calculateSEIRTrajectory(100000, 10, 0.5, 0.2, 0.1, 30, 0);
    expect(trajectory.length).toBeGreaterThan(0);
  });
});
