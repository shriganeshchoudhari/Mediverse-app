import {
  BNYS_METADATA,
  BNYS_CURRICULUM,
  BNYSSubject,
  BNYSLesson,
} from '@/lib/curriculum/bnysCurriculumScaffold';

describe('BNYS Curriculum Scaffold', () => {
  test('BNYS_METADATA has correct programCode "BNYS"', () => {
    expect(BNYS_METADATA).toBeDefined();
    expect(BNYS_METADATA.programCode).toBe('BNYS');
    expect(BNYS_METADATA.programName).toBe('Bachelor of Naturopathy & Yogic Sciences');
  });

  test('BNYS_CURRICULUM has at least 6 subjects', () => {
    expect(Array.isArray(BNYS_CURRICULUM)).toBe(true);
    expect(BNYS_CURRICULUM.length).toBeGreaterThanOrEqual(6);
  });

  test('each subject has at least 3 lessons', () => {
    BNYS_CURRICULUM.forEach((subject: BNYSSubject) => {
      expect(subject.id).toBeDefined();
      expect(subject.title).toBeTruthy();
      expect(Array.isArray(subject.lessons)).toBe(true);
      expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
    });
  });

  test('each lesson has id, title, duration, and keyPoints array', () => {
    BNYS_CURRICULUM.forEach((subject: BNYSSubject) => {
      subject.lessons.forEach((lesson: BNYSLesson) => {
        expect(typeof lesson.id).toBe('string');
        expect(lesson.id.length).toBeGreaterThan(0);

        expect(typeof lesson.title).toBe('string');
        expect(lesson.title.length).toBeGreaterThan(0);

        expect(typeof lesson.duration).toBe('string');
        expect(lesson.duration.length).toBeGreaterThan(0);

        expect(Array.isArray(lesson.keyPoints)).toBe(true);
        expect(lesson.keyPoints.length).toBeGreaterThan(0);
        lesson.keyPoints.forEach((point: string) => {
          expect(typeof point).toBe('string');
          expect(point.length).toBeGreaterThan(0);
        });
      });
    });
  });

  test('BNYS_METADATA.domain === "AYUSH"', () => {
    expect(BNYS_METADATA.domain).toBe('AYUSH');
    expect(BNYS_METADATA.regulatoryBody).toContain('CCYN');
  });
});
