import {
  HEALTHCARE_DOMAINS,
  getDomainById,
  getDomainsByTier,
  TOTAL_LESSON_COUNT,
  DOMAIN_IDS,
} from '../healthcareLandscapeScaffold';

describe('Healthcare Landscape Scaffold', () => {
  it('should define exactly 9 healthcare domains', () => {
    expect(HEALTHCARE_DOMAINS).toHaveLength(9);
    expect(DOMAIN_IDS).toHaveLength(9);
  });

  it('should contain all required domain identifiers', () => {
    const expectedIds = [
      'allopathic',
      'dental',
      'ayush',
      'pharmacy',
      'nursing',
      'physiotherapy',
      'allied',
      'veterinary',
      'public-health',
    ];
    expectedIds.forEach((id) => {
      expect(DOMAIN_IDS).toContain(id);
      const domain = getDomainById(id);
      expect(domain).toBeDefined();
      expect(domain?.id).toBe(id);
      expect(domain?.programs.length).toBeGreaterThan(0);
      expect(domain?.routePath).toMatch(/^\/healthcare/);
    });
  });

  it('should group domains correctly into tiers', () => {
    const tier1 = getDomainsByTier(1);
    const tier2 = getDomainsByTier(2);
    const tier3 = getDomainsByTier(3);

    expect(tier1.length).toBeGreaterThanOrEqual(3);
    expect(tier2.length).toBeGreaterThanOrEqual(3);
    expect(tier3.length).toBeGreaterThanOrEqual(2);

    expect(tier1.map((d) => d.id)).toEqual(
      expect.arrayContaining(['allopathic', 'dental', 'ayush', 'pharmacy'])
    );
  });

  it('should calculate total lesson count accurately', () => {
    expect(TOTAL_LESSON_COUNT).toBeGreaterThan(500);
    const sum = HEALTHCARE_DOMAINS.reduce((acc, d) => acc + d.lessonCount, 0);
    expect(TOTAL_LESSON_COUNT).toBe(sum);
  });

  it('should return undefined for invalid domain ID', () => {
    expect(getDomainById('non-existent-domain')).toBeUndefined();
  });
});
