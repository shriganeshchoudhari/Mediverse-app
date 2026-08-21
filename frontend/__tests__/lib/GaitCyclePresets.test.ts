import { RANCHO_GAIT_PHASES, PATHOLOGICAL_GAITS } from '../../lib/physiotherapy/GaitCyclePresets';

describe('GaitCyclePresets', () => {
  it('RANCHO_GAIT_PHASES has exactly 8 phases spanning 0% to 100% of cycle', () => {
    expect(RANCHO_GAIT_PHASES.length).toBe(8);
    expect(RANCHO_GAIT_PHASES[0].percentOfCycle.start).toBe(0);
    expect(RANCHO_GAIT_PHASES[7].percentOfCycle.end).toBe(100);
  });

  it('has at least 5 classic gait deviations', () => {
    expect(PATHOLOGICAL_GAITS.length).toBeGreaterThanOrEqual(5);
    const names = PATHOLOGICAL_GAITS.map(g => g.name);
    expect(names.some(n => n.includes('Trendelenburg'))).toBe(true);
    expect(names.some(n => n.includes('Hemiplegic'))).toBe(true);
    expect(names.some(n => n.includes('Steppage'))).toBe(true);
    expect(names.some(n => n.includes('Ataxic'))).toBe(true);
    expect(names.some(n => n.includes('Parkinsonian'))).toBe(true);
  });
});
