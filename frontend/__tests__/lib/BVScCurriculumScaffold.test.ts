import { BVSC_CURRICULUM, BVSC_METADATA } from '../../lib/curriculum/bvscCurriculumScaffold';

describe('BVSc Curriculum Scaffold', () => {
  it('BVSC_CURRICULUM has 5 years and subjects have lessons.length >= 3', () => {
    expect(BVSC_CURRICULUM).toHaveLength(5);
    BVSC_CURRICULUM.forEach(year => {
      year.subjects.forEach(subject => {
        expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  it('BVSC_METADATA has regulatoryBody VCI', () => {
    expect(BVSC_METADATA.regulatoryBody).toContain('VCI');
  });
});
