import {
  BSMS_METADATA,
  BSMS_CURRICULUM,
  BSMSSubject,
  BSMSLesson,
} from '@/lib/curriculum/bsmsCurriculumScaffold';

describe('BSMS Curriculum Scaffold', () => {
  test('BSMS_METADATA.programCode === "BSMS"', () => {
    expect(BSMS_METADATA).toBeDefined();
    expect(BSMS_METADATA.programCode).toBe('BSMS');
    expect(BSMS_METADATA.programName).toBe('Bachelor of Siddha Medicine & Surgery');
  });

  test('BSMS_CURRICULUM has at least 6 subjects', () => {
    expect(Array.isArray(BSMS_CURRICULUM)).toBe(true);
    expect(BSMS_CURRICULUM.length).toBeGreaterThanOrEqual(6);
  });

  test('subjects contain Gunapadam (or Siddha materia medica subject)', () => {
    const hasGunapadam = BSMS_CURRICULUM.some(
      (subject: BSMSSubject) =>
        subject.title.toLowerCase().includes('gunapadam') ||
        subject.code.toUpperCase().includes('GUNAPM') ||
        subject.id.toLowerCase().includes('gunapm')
    );
    expect(hasGunapadam).toBe(true);

    const gunapadamSubject = BSMS_CURRICULUM.find(
      (s: BSMSSubject) => s.code === 'BSMS-GUNAPM'
    );
    expect(gunapadamSubject).toBeDefined();
    expect(gunapadamSubject?.lessons.length).toBeGreaterThanOrEqual(3);
  });

  test('BSMS_METADATA.domain === "AYUSH"', () => {
    expect(BSMS_METADATA.domain).toBe('AYUSH');
    expect(BSMS_METADATA.regulatoryBody).toContain('CCIM');
  });

  test('each subject in BSMS_CURRICULUM has structured lessons', () => {
    BSMS_CURRICULUM.forEach((subject: BSMSSubject) => {
      expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      subject.lessons.forEach((lesson: BSMSLesson) => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.duration).toBeTruthy();
        expect(Array.isArray(lesson.keyPoints)).toBe(true);
        expect(lesson.keyPoints.length).toBeGreaterThan(0);
      });
    });
  });
});
