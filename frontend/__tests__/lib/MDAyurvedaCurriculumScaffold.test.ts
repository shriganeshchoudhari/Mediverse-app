import {
  MD_AYURVEDA_CURRICULUM,
  getMDAyurvedaSpecialtyById
} from '../../lib/curriculum/mdAyurvedaCurriculumScaffold';

describe('MDAyurvedaCurriculumScaffold', () => {
  it('MD_AYURVEDA_CURRICULUM has exactly 8 specialties', () => {
    expect(MD_AYURVEDA_CURRICULUM.length).toBe(8);
  });

  it('every specialty has unique id, unique ccimSpecialtyCode, and at least 3 subjects', () => {
    const ids = new Set();
    const codes = new Set();
    MD_AYURVEDA_CURRICULUM.forEach(spec => {
      expect(ids.has(spec.id)).toBe(false);
      ids.add(spec.id);
      expect(codes.has(spec.ccimSpecialtyCode)).toBe(false);
      codes.add(spec.ccimSpecialtyCode);
      expect(spec.subjects.length).toBeGreaterThanOrEqual(3);
    });
  });

  it('every subject has at least 3 lessons', () => {
    MD_AYURVEDA_CURRICULUM.forEach(spec => {
      spec.subjects.forEach(sub => {
        expect(sub.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('getMDAyurvedaSpecialtyById returns Kayachikitsa', () => {
    const spec = getMDAyurvedaSpecialtyById('md-kayachikitsa');
    expect(spec).toBeDefined();
    expect(spec?.name).toContain('Kayachikitsa');
  });
});
