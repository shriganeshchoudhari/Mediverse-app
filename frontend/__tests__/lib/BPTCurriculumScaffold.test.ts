import { BPT_CURRICULUM, BPT_METADATA, getBPTSubjectById } from '../../lib/curriculum/bptCurriculumScaffold';

describe('BPTCurriculumScaffold', () => {
  it('has exactly 4 academic years', () => {
    expect(BPT_CURRICULUM.length).toBe(4);
  });

  it('every year has subjects and every subject has lessons.length >= 3', () => {
    BPT_CURRICULUM.forEach((year: any) => {
      expect(year.subjects.length).toBeGreaterThan(0);
      year.subjects.forEach((subject: any) => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('BPT_METADATA has regulatoryBody "IAP (Indian Association of Physiotherapists)"', () => {
    expect(BPT_METADATA.regulatoryBody).toBe('IAP (Indian Association of Physiotherapists)');
  });

  it('getBPTSubjectById returns the requested subject', () => {
    if (BPT_CURRICULUM[0] && BPT_CURRICULUM[0].subjects[0]) {
      const subject = BPT_CURRICULUM[0].subjects[0];
      const result = getBPTSubjectById(subject.id);
      expect(result).toBeDefined();
      expect(result?.id).toBe(subject.id);
    }
  });
});
