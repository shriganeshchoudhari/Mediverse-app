import {
  MSC_NURSING_CURRICULUM,
  MSC_NURSING_METADATA,
} from '../../lib/curriculum/mscNursingCurriculumScaffold';

describe('MScNursingCurriculumScaffold', () => {
  it('has 5 specialties', () => {
    expect(MSC_NURSING_CURRICULUM.length).toBe(5);
  });

  it('every specialty has subjects with at least 3 lessons each', () => {
    MSC_NURSING_CURRICULUM.forEach(specialty => {
      expect(specialty.subjects.length).toBeGreaterThan(0);
      specialty.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('MSC_NURSING_METADATA is defined', () => {
    expect(MSC_NURSING_METADATA).toBeDefined();
  });
});
