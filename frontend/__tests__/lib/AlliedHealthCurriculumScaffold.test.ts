import { ALLIED_HEALTH_MAJORS, ALLIED_HEALTH_METADATA, getAlliedMajorById } from '../../lib/curriculum/alliedHealthCurriculumScaffold';

describe('AlliedHealthCurriculumScaffold', () => {
  it('ALLIED_HEALTH_MAJORS has 4 majors', () => {
    expect(ALLIED_HEALTH_MAJORS).toHaveLength(4);
  });

  it('every major has subjects and every subject has lessons.length >= 3', () => {
    ALLIED_HEALTH_MAJORS.forEach(major => {
      expect(major.subjects.length).toBeGreaterThan(0);
      major.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('ALLIED_HEALTH_METADATA has regulatoryBody NCAHP', () => {
    expect(ALLIED_HEALTH_METADATA.regulatoryBody).toContain('NCAHP');
  });

  it('getAlliedMajorById returns the requested major', () => {
    const major = getAlliedMajorById('perfusion');
    expect(major).toBeDefined();
    expect(major?.name).toBe('Perfusion Technology');
  });
});
