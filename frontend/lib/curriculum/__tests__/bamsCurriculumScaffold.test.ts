import {
  BAMS_CURRICULUM,
  BAMS_METADATA,
  getBAMSSubjectById,
  getBAMSLessonById,
  getAllMarmaLessons,
} from '../bamsCurriculumScaffold';

describe('BAMS Ayurvedic Curriculum Scaffold', () => {
  it('should define a 5-year BAMS structure with CCIM accreditation', () => {
    expect(BAMS_CURRICULUM).toHaveLength(5);
    expect(BAMS_METADATA.totalYears).toBe(5);
    expect(BAMS_METADATA.regulatoryBody).toContain('CCIM');
  });

  it('should include Rachana Sharira with 107 Marma Points', () => {
    const rachana = getBAMSSubjectById('bams-rs');
    expect(rachana).toBeDefined();
    expect(rachana?.name).toContain('Rachana Sharira');

    const marmaLessons = getAllMarmaLessons();
    expect(marmaLessons.length).toBeGreaterThanOrEqual(2);
    expect(marmaLessons.some((l) => l.title.includes('107 Marma Points'))).toBe(true);
  });

  it('should contain Kriya Sharira, Dravyaguna, and Kayachikitsa subjects', () => {
    expect(getBAMSSubjectById('bams-ks')).toBeDefined();
    expect(getBAMSSubjectById('bams-dg')).toBeDefined();
    expect(getBAMSSubjectById('bams-kk')).toBeDefined();
    expect(getBAMSSubjectById('bams-st')).toBeDefined();
  });

  it('should flag lessons with simulation and 3D models', () => {
    expect(BAMS_METADATA.lessonsWith3D).toBeGreaterThan(0);
    expect(BAMS_METADATA.lessonsWithSimulation).toBeGreaterThan(0);

    const panchakarmaLesson = getBAMSLessonById('kk-002');
    expect(panchakarmaLesson).toBeDefined();
    expect(panchakarmaLesson?.hasSimulation).toBe(true);
  });

  it('should return undefined for non-existent IDs', () => {
    expect(getBAMSSubjectById('non-existent-subject')).toBeUndefined();
    expect(getBAMSLessonById('non-existent-lesson')).toBeUndefined();
  });
});
