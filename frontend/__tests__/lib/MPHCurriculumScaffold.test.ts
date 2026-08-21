import { MPH_CURRICULUM, MPH_METADATA } from '../../lib/curriculum/mphCurriculumScaffold';

describe('MPHCurriculumScaffold', () => {
    it('has >= 5 subjects with lessons.length >= 3', () => {
        expect(MPH_CURRICULUM.length).toBeGreaterThanOrEqual(5);
        MPH_CURRICULUM.forEach(subject => {
            expect(subject.lessons.length).toBeGreaterThanOrEqual(3);
        });
    });

    it('has regulatoryBody in MPH_METADATA', () => {
        expect(MPH_METADATA.regulatoryBody).toBeDefined();
    });
});
