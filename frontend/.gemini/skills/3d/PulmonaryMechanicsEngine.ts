/**
 * PulmonaryMechanicsEngine.ts
 * Biomechanical Respiratory Ventilation & Alveolar Dynamics Engine
 * Location: frontend/.gemini/skills/3d/PulmonaryMechanicsEngine.ts
 *
 * Simulates:
 * 1. Dual-phase tidal ventilation (Active Inspiration vs Passive Elastic Expiration).
 * 2. Asymmetric anatomical lobar expansion (Right 3 lobes vs Left 2 lobes with cardiac notch).
 * 3. Diaphragmatic dome downward piston excursion.
 * 4. Alveolar-capillary blood-gas oxygenation color gradient.
 */

import * as THREE from 'three';

export interface PulmonaryCycleState {
  respiratoryRateBpm: number;
  timeSeconds: number;
  phase: 'INSPIRATION' | 'EXPIRATION';
  lungVolumeLiters: number; // 2.5 L (FRC) to 3.0 L (Tidal Peak)
  lungScaleFactor: number; // 1.0 (FRC) to 1.12 (Peak inspiration)
  diaphragmDisplacementY: number; // Downward piston motion (0.0 to -0.15)
  intrapleuralPressureCmH2O: number; // -5 to -8 cmH2O
  capillaryOxygenationHue: string; // Mixed venous blue -> Oxygenated red
}

/**
 * Computes physiological respiratory state based on elapsed time and breathing rate
 */
export function computePulmonaryCycleState(elapsedSeconds: number, respiratoryRateBpm = 14): PulmonaryCycleState {
  const clampedRate = Math.max(6, Math.min(60, respiratoryRateBpm));
  const cycleDuration = 60 / clampedRate;
  const tNorm = (elapsedSeconds % cycleDuration) / cycleDuration; // 0.0 to 1.0

  // Typical I:E ratio is 1:2 (Inspiration = 33% of cycle, Expiration = 67% of cycle)
  const isInspiration = tNorm < 0.33;

  let expansionCurve = 0;
  let intrapleuralPressureCmH2O = -5.0;

  if (isInspiration) {
    // S-curve active muscular inspiration
    const p = tNorm / 0.33;
    expansionCurve = 0.5 * (1 - Math.cos(p * Math.PI));
    intrapleuralPressureCmH2O = -5.0 - expansionCurve * 3.0; // drops to -8 cmH2O
  } else {
    // Passive exponential elastic recoil expiration
    const p = (tNorm - 0.33) / 0.67;
    expansionCurve = Math.exp(-p * 3.0) * (1 - p);
    intrapleuralPressureCmH2O = -8.0 + (1 - expansionCurve) * 3.0;
  }

  // Clamped expansion curve between 0.0 and 1.0
  const normalizedExpansion = Math.max(0, Math.min(1, expansionCurve));

  // Tidal volume: resting FRC 2.5 L + 0.5 L tidal volume
  const lungVolumeLiters = 2.5 + normalizedExpansion * 0.5;
  const lungScaleFactor = 1.0 + normalizedExpansion * 0.10;
  const diaphragmDisplacementY = -normalizedExpansion * 0.12;

  // Oxygenation hue shift
  const r = Math.round(180 + normalizedExpansion * 65);
  const b = Math.round(80 - normalizedExpansion * 40);
  const capillaryOxygenationHue = `rgb(${r}, 30, ${b})`;

  return {
    respiratoryRateBpm: clampedRate,
    timeSeconds: elapsedSeconds,
    phase: isInspiration ? 'INSPIRATION' : 'EXPIRATION',
    lungVolumeLiters,
    lungScaleFactor,
    diaphragmDisplacementY,
    intrapleuralPressureCmH2O,
    capillaryOxygenationHue,
  };
}

/**
 * Creates Tracheobronchial Cartilage Rings Material
 */
export function createTrachealCartilageMaterial(clippingPlanes: THREE.Plane[] = []): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#cbd5e1'), // Semitranslucent hyaline cartilage
    roughness: 0.35,
    metalness: 0.05,
    clippingPlanes,
    clipShadows: true,
  });
}
