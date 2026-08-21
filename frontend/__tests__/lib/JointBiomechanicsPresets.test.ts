import { JOINT_ROM_NORMS, assessMobility, getJointNorms } from '../../lib/physiotherapy/JointBiomechanicsPresets';

describe('JointBiomechanicsPresets', () => {
  it('contains norms for shoulder, elbow, wrist, hip, knee, ankle, cervical, lumbar', () => {
    expect(JOINT_ROM_NORMS.length).toBeGreaterThanOrEqual(8);
    const joints = JOINT_ROM_NORMS.map(n => n.joint);
    expect(joints).toContain('shoulder');
    expect(joints).toContain('knee');
    expect(joints).toContain('hip');
  });

  it('correctly identifies Normal, Hypomobile, and Hypermobile for shoulder flexion', () => {
    expect(assessMobility('shoulder', 'Flexion', 160).status).toBe('Normal');
    expect(assessMobility('shoulder', 'Flexion', 100).status).toBe('Hypomobile');
    expect(assessMobility('shoulder', 'Flexion', 200).status).toBe('Hypermobile');
  });

  it('getJointNorms returns non-empty list for knee', () => {
    const kneeNorms = getJointNorms('knee');
    expect(kneeNorms.length).toBeGreaterThan(0);
    expect(kneeNorms[0].joint).toBe('knee');
  });
});
