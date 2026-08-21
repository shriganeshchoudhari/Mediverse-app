import {
  PHARMD_CURRICULUM,
  PHARMD_METADATA,
  getPharmDSubjectById
} from '../../lib/curriculum/pharmdCurriculumScaffold';

describe('PharmDCurriculumScaffold', () => {
  it('has exactly 6 academic years in PHARMD_CURRICULUM', () => {
    expect(PHARMD_CURRICULUM.length).toBe(6);
  });

  it('has subjects in every year and every subject has at least 3 lessons', () => {
    PHARMD_CURRICULUM.forEach(year => {
      expect(year.subjects.length).toBeGreaterThan(0);
      year.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('has regulatoryBody "PCI (Pharmacy Council of India)" in PHARMD_METADATA', () => {
    expect(PHARMD_METADATA.regulatoryBody).toBe('PCI (Pharmacy Council of India)');
  });

  it('returns the requested subject when getPharmDSubjectById is called', () => {
    if (PHARMD_CURRICULUM[0] && PHARMD_CURRICULUM[0].subjects[0]) {
      const subjectId = PHARMD_CURRICULUM[0].subjects[0].id;
      const subject = getPharmDSubjectById(subjectId);
      expect(subject).toBeDefined();
      expect(subject?.id).toBe(subjectId);
    }
  });
});
