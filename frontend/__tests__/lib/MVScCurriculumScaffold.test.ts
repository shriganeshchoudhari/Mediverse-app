import { MVSC_SPECIALTIES } from '../../lib/curriculum/mvscCurriculumScaffold';

describe('MVSc Curriculum Scaffold', () => {
  it('MVSC_SPECIALTIES has >= 4 specialties', () => {
    expect(MVSC_SPECIALTIES.length).toBeGreaterThanOrEqual(4);
  });
});
