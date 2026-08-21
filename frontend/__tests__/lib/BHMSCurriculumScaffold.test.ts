import {
  BHMS_CURRICULUM,
  BHMS_METADATA
} from '../../lib/curriculum/bhmsCurriculumScaffold';

describe('BHMSCurriculumScaffold', () => {
  it('BHMS_CURRICULUM has 4 academic years', () => {
    expect(BHMS_CURRICULUM.length).toBe(4);
  });

  it('every year has subjects with at least 3 lessons each', () => {
    BHMS_CURRICULUM.forEach(year => {
      year.subjects.forEach(sub => {
        expect(sub.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('BHMS_METADATA exists and has regulatoryBody CCH', () => {
    expect(BHMS_METADATA).toBeDefined();
    expect(BHMS_METADATA.regulatoryBody).toContain('CCH');
  });
});
