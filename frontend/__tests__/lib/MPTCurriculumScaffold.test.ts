import { MPT_CURRICULUM, MPT_METADATA } from '../../lib/curriculum/mptCurriculumScaffold';

describe('MPTCurriculumScaffold', () => {
  it('has 5 specialties', () => {
    expect(MPT_CURRICULUM.length).toBe(5);
  });

  it('every specialty has subjects with at least 3 lessons each', () => {
    MPT_CURRICULUM.forEach((specialty: any) => {
      expect(specialty.subjects.length).toBeGreaterThan(0);
      specialty.subjects.forEach((subject: any) => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('MPT_METADATA is defined', () => {
    expect(MPT_METADATA).toBeDefined();
  });
});
