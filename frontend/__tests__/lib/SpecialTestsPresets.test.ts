import { SPECIAL_TESTS_REGISTRY, getTestsByJoint } from '../../lib/physiotherapy/SpecialTestsPresets';

describe('SpecialTestsPresets', () => {
  it('SPECIAL_TESTS_REGISTRY contains at least 15 tests', () => {
    expect(SPECIAL_TESTS_REGISTRY.length).toBeGreaterThanOrEqual(15);
  });

  it('getTestsByJoint for "Knee" returns Lachman and McMurray', () => {
    const kneeTests = getTestsByJoint('Knee').map(t => t.name);
    expect(kneeTests.some(n => n.includes('Lachman'))).toBe(true);
    expect(kneeTests.some(n => n.includes('McMurray'))).toBe(true);
  });
});
