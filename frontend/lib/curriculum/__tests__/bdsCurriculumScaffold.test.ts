import {
  BDS_CURRICULUM,
  BDS_METADATA,
  getBDSSubjectById,
  getBDSLessonById,
} from '../bdsCurriculumScaffold';

describe('BDS Dental Curriculum Scaffold', () => {
  it('should define a 5-year academic program', () => {
    expect(BDS_CURRICULUM).toHaveLength(5);
    expect(BDS_METADATA.totalYears).toBe(5);
    expect(BDS_METADATA.totalSemesters).toBe(10);
    expect(BDS_METADATA.regulatoryBody).toContain('DCI');
  });

  it('should contain core dental subjects across years', () => {
    expect(BDS_METADATA.totalSubjects).toBeGreaterThanOrEqual(9);
    expect(getBDSSubjectById('bds-ga')).toBeDefined();
    expect(getBDSSubjectById('bds-dm')).toBeDefined();
    expect(getBDSSubjectById('bds-op')).toBeDefined();
    expect(getBDSSubjectById('bds-cd')).toBeDefined();
    expect(getBDSSubjectById('bds-os')).toBeDefined();
    expect(getBDSSubjectById('bds-pr')).toBeDefined();
  });

  it('should contain 3D interactive and simulation lessons', () => {
    expect(BDS_METADATA.lessonsWith3D).toBeGreaterThan(5);
    expect(BDS_METADATA.lessonsWithSimulation).toBeGreaterThan(3);

    const tmjLesson = getBDSLessonById('ga-003');
    expect(tmjLesson).toBeDefined();
    expect(tmjLesson?.has3DContent).toBe(true);
    expect(tmjLesson?.hasSimulation).toBe(true);

    const nerveBlockLesson = getBDSLessonById('os-001');
    expect(nerveBlockLesson).toBeDefined();
    expect(nerveBlockLesson?.has3DContent).toBe(true);
    expect(nerveBlockLesson?.hasSimulation).toBe(true);
  });

  it('should return undefined for non-existent IDs', () => {
    expect(getBDSSubjectById('non-existent-subject')).toBeUndefined();
    expect(getBDSLessonById('non-existent-lesson')).toBeUndefined();
  });
});
