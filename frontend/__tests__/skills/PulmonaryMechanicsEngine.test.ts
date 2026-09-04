import * as THREE from 'three';
import {
  computePulmonaryCycleState,
  createTrachealCartilageMaterial,
} from '../../.gemini/skills/3d/PulmonaryMechanicsEngine';

describe('PulmonaryMechanicsEngine', () => {
  it('correctly calculates inspiration phase during the first 33% of tidal breathing', () => {
    // At 14 breaths/min, 1 cycle = ~4.28s. At t = 0.5s (~12%), phase is INSPIRATION
    const state = computePulmonaryCycleState(0.5, 14);
    expect(state.phase).toBe('INSPIRATION');
    expect(state.lungScaleFactor).toBeGreaterThan(1.0);
    expect(state.diaphragmDisplacementY).toBeLessThan(0); // downward excursion
    expect(state.intrapleuralPressureCmH2O).toBeLessThan(-5.0); // more negative during inspiration
  });

  it('correctly calculates expiration phase during the remaining 67% of cycle', () => {
    // At 14 breaths/min, t = 2.5s (~58%) is EXPIRATION
    const state = computePulmonaryCycleState(2.5, 14);
    expect(state.phase).toBe('EXPIRATION');
    expect(state.lungVolumeLiters).toBeGreaterThanOrEqual(2.5);
  });

  it('clamps extreme respiratory rates between 6 and 60 breaths/min', () => {
    const slow = computePulmonaryCycleState(0.5, 2);
    expect(slow.respiratoryRateBpm).toBe(6);

    const fast = computePulmonaryCycleState(0.5, 120);
    expect(fast.respiratoryRateBpm).toBe(60);
  });

  it('creates tracheal cartilage material with correct optical properties', () => {
    const mat = createTrachealCartilageMaterial();
    expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(mat.color.getHexString()).toBe('cbd5e1');
    expect(mat.roughness).toBeCloseTo(0.35, 2);
  });
});
