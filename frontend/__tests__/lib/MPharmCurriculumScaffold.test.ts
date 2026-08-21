import {
  MPHARM_CURRICULUM,
  MPHARM_METADATA,
  getMPharmSpecialtyById
} from '../../lib/curriculum/mpharmCurriculumScaffold';

describe('MPharmCurriculumScaffold', () => {
  it('has 4 postgraduate specialties in MPHARM_CURRICULUM', () => {
    expect(MPHARM_CURRICULUM.length).toBe(4);
    const names = MPHARM_CURRICULUM.map(s => s.name);
    expect(names).toContain('Pharmaceutics');
    expect(names).toContain('Pharmacology');
    expect(names).toContain('Pharmaceutical Chemistry');
    expect(names).toContain('Pharmacy Practice');
  });

  it('every specialty has subjects with at least 3 lessons', () => {
    MPHARM_CURRICULUM.forEach(spec => {
      expect(spec.subjects.length).toBeGreaterThan(0);
      spec.subjects.forEach(sub => {
        expect(sub.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('getMPharmSpecialtyById returns Pharmaceutics', () => {
    const spec = getMPharmSpecialtyById('m1');
    expect(spec).toBeDefined();
    expect(spec?.name).toBe('Pharmaceutics');
  });

  it('MPHARM_METADATA has regulatoryBody PCI', () => {
    expect(MPHARM_METADATA).toBeDefined();
    expect(MPHARM_METADATA.regulatoryBody).toContain('PCI');
  });
});
