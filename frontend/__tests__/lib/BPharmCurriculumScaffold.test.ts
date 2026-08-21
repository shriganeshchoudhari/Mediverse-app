import {
  BPHARM_CURRICULUM,
  BPHARM_METADATA
} from '../../lib/curriculum/bpharmCurriculumScaffold';

describe('BPharmCurriculumScaffold', () => {
  it('has 4 academic years in BPHARM_CURRICULUM', () => {
    expect(BPHARM_CURRICULUM.length).toBe(4);
  });

  it('has subjects with at least 3 lessons each in every year', () => {
    BPHARM_CURRICULUM.forEach(year => {
      expect(year.subjects.length).toBeGreaterThan(0);
      year.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('has BPHARM_METADATA defined', () => {
    expect(BPHARM_METADATA).toBeDefined();
    expect(BPHARM_METADATA.regulatoryBody).toContain('PCI');
  });
});
