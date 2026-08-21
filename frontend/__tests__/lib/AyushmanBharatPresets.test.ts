import { PMJAY_PACKAGES, ELIGIBILITY_CATEGORIES } from '../../lib/public-health/AyushmanBharatPresets';

describe('AyushmanBharatPresets', () => {
  it('contains CABG, PTCA, Knee Replacement packages', () => {
    const names = PMJAY_PACKAGES.map(p => p.procedureName);
    expect(names.some(n => n.includes('CABG'))).toBe(true);
    expect(names.some(n => n.includes('PTCA'))).toBe(true);
    expect(names.some(n => n.includes('Knee Replacement'))).toBe(true);
  });

  it('contains SECC deprivation categories', () => {
    expect(ELIGIBILITY_CATEGORIES.length).toBeGreaterThan(0);
    const categories = ELIGIBILITY_CATEGORIES.map(c => c.category);
    expect(categories.some(c => c.includes('SECC') || c.includes('Rural') || c.includes('Urban'))).toBe(true);
  });
});
