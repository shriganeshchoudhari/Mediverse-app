import { MHA_CURRICULUM } from '../../lib/curriculum/mhaCurriculumScaffold';

describe('MHACurriculumScaffold', () => {
    it('has >= 5 subjects with lessons.length >= 3', () => {
        expect(MHA_CURRICULUM.length).toBeGreaterThanOrEqual(5);
        MHA_CURRICULUM.forEach(subject => {
            expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
        });
    });
});
