import { calculateICER } from '../../lib/public-health/HealthEconomicsPresets';

describe('HealthEconomicsPresets', () => {
  it('computes correct QALYs and ICER', () => {
    const comparator = {
      strategyA: { name: 'Intervention A', costInr: 100000, survivalYears: 5, utilityQoL: 0.8 },
      strategyB: { name: 'Intervention B', costInr: 50000, survivalYears: 3, utilityQoL: 0.6 }
    };
    const result = calculateICER(comparator, 200000);
    expect(result.qalyA).toBeCloseTo(4.0, 2);
    expect(result.qalyB).toBeCloseTo(1.8, 2);
    expect(result.deltaQALY).toBeCloseTo(2.2, 1);
    expect(result.deltaCostInr).toBe(50000);
    expect(result.icerInrPerQALY).toBeGreaterThan(0);
    expect(result.costEffectivenessCategory).toBeDefined();
  });
});
