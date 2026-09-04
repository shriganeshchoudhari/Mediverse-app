import * as THREE from 'three';
import {
  computeActionPotentialState,
  createMyelinSheathMaterial,
} from '../../.gemini/skills/3d/NeuronActionPotentialEngine';

describe('NeuronActionPotentialEngine', () => {
  it('computes depolarization overshoot to +30 mV during early phase', () => {
    // At 5 Hz, period is 0.2s. At t = 0.015s (~7.5% into cycle), membrane is depolarized
    const ap = computeActionPotentialState(0.015, 5);
    expect(ap.isDepolarized).toBe(true);
    expect(ap.membranePotentialMv).toBeGreaterThan(0);
    expect(ap.signalColorHex).toBe('#38bdf8'); // electric cyan spark
  });

  it('computes repolarization and after-hyperpolarization', () => {
    // At 5 Hz, t = 0.07s (~35% into cycle) is repolarization / refractory
    const ap = computeActionPotentialState(0.07, 5);
    expect(ap.membranePotentialMv).toBeLessThan(0);
  });

  it('triggers terminal vesicle exocytosis glow when impulse reaches end of axon', () => {
    // At 5 Hz, t = 0.14s (~70% into cycle), impulse is near terminal (>0.85 progress)
    const ap = computeActionPotentialState(0.14, 5);
    expect(ap.impulsePositionNorm).toBeGreaterThan(0.8);
    expect(ap.vesicleExocytosisGlow).toBeGreaterThan(0);
  });

  it('creates Myelin Sheath material with characteristic lipid appearance', () => {
    const mat = createMyelinSheathMaterial();
    expect(mat).toBeInstanceOf(THREE.MeshStandardMaterial);
    expect(mat.color.getHexString()).toBe('fef08a');
    expect(mat.roughness).toBeCloseTo(0.28, 2);
  });
});
