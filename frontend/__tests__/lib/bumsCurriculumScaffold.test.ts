import {
  BUMS_METADATA,
  BUMS_CURRICULUM,
  BUMSSubject,
  BUMSLesson,
} from '@/lib/curriculum/bumsCurriculumScaffold';

describe('BUMS Curriculum Scaffold', () => {
  test('BUMS_METADATA.programCode === "BUMS"', () => {
    expect(BUMS_METADATA).toBeDefined();
    expect(BUMS_METADATA.programCode).toBe('BUMS');
    expect(BUMS_METADATA.programName).toBe('Bachelor of Unani Medicine & Surgery');
  });

  test('BUMS_CURRICULUM has at least 6 subjects', () => {
    expect(Array.isArray(BUMS_CURRICULUM)).toBe(true);
    expect(BUMS_CURRICULUM.length).toBeGreaterThanOrEqual(6);
  });

  test('subjects include Kulliyat (or similar first subject)', () => {
    const hasKulliyat = BUMS_CURRICULUM.some(
      (subject: BUMSSubject) =>
        subject.title.toLowerCase().includes('kulliyat') ||
        subject.code.toUpperCase().includes('KULL') ||
        subject.id.toLowerCase().includes('kull')
    );
    expect(hasKulliyat).toBe(true);

    const kulliyatSubject = BUMS_CURRICULUM.find(
      (s: BUMSSubject) => s.code === 'BUMS-KULL'
    );
    expect(kulliyatSubject).toBeDefined();
    expect(kulliyatSubject?.lessons.length).toBeGreaterThanOrEqual(3);
  });

  test('BUMS_METADATA.regulatoryBody includes "CCIM"', () => {
    expect(BUMS_METADATA.regulatoryBody).toBeDefined();
    expect(BUMS_METADATA.regulatoryBody).toContain('CCIM');
    expect(BUMS_METADATA.domain).toBe('AYUSH');
  });

  test('each subject in BUMS_CURRICULUM has valid lessons with keyPoints', () => {
    BUMS_CURRICULUM.forEach((subject: BUMSSubject) => {
      expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      subject.lessons.forEach((lesson: BUMSLesson) => {
        expect(lesson.id).toBeTruthy();
        expect(lesson.title).toBeTruthy();
        expect(lesson.duration).toBeTruthy();
        expect(Array.isArray(lesson.keyPoints)).toBe(true);
        expect(lesson.keyPoints.length).toBeGreaterThan(0);
      });
    });
  });
});
