import {
  BSC_NURSING_CURRICULUM,
  BSC_NURSING_METADATA,
  getBScNursingSubjectById,
} from '../../lib/curriculum/bscNursingCurriculumScaffold';

describe('BScNursingCurriculumScaffold', () => {
  it('has exactly 4 academic years', () => {
    expect(BSC_NURSING_CURRICULUM.length).toBe(4);
  });

  it('has subjects for every year and every subject has at least 3 lessons', () => {
    BSC_NURSING_CURRICULUM.forEach(year => {
      expect(year.subjects.length).toBeGreaterThan(0);
      year.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('has regulatoryBody "INC (Indian Nursing Council)"', () => {
    expect(BSC_NURSING_METADATA.regulatoryBody).toBe('INC (Indian Nursing Council)');
  });

  it('returns the requested subject by id', () => {
    const firstSubjectId = BSC_NURSING_CURRICULUM[0].subjects[0].id;
    const subject = getBScNursingSubjectById(firstSubjectId);
    expect(subject).toBeDefined();
    expect(subject?.id).toBe(firstSubjectId);
  });
});
