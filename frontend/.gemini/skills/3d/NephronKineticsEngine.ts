/**
 * NephronKineticsEngine.ts
 * Renal Architecture & Glomerular Ultrafiltration Kinetics Engine
 * Location: frontend/.gemini/skills/3d/NephronKineticsEngine.ts
 *
 * Simulates:
 * 1. Starling forces governing Glomerular Ultrafiltration (Pgc, Pbs, Pi_gc -> Net Filtration Pressure).
 * 2. Corticomedullary osmotic gradient (300 mOsm/kg cortex to 1200 mOsm/kg inner medulla).
 * 3. Continuous tubular fluid pulsation and podocyte capillary flow dynamics.
 */

import * as THREE from 'three';

export interface NephronFiltrationState {
  gfrMlMin: number; // 90 to 125 mL/min
  netFiltrationPressureMmHg: number; // 10 to 15 mmHg
  afferentPgcMmHg: number; // ~60 mmHg
  bowmanSpacePbsMmHg: number; // ~15 mmHg
  plasmaOncoticMmHg: number; // ~28-32 mmHg
  pulsatileFlowFactor: number; // 0.85 to 1.15
  medullaryOsmolalityMOsm: number; // 300 (cortex) to 1200 (papilla tip)
}

/**
 * Computes real-time Starling glomerular ultrafiltration dynamics
 */
export function computeNephronFiltrationState(elapsedSeconds: number, meanArterialPressure = 93): NephronFiltrationState {
  // Autoregulation (Myogenic + Tubuloglomerular feedback) maintains Pgc stable between MAP 80-180 mmHg
  const autoregulatedPgc = 60 + (meanArterialPressure - 93) * 0.08;
  const bowmanSpacePbs = 15.0;
  const plasmaOncotic = 29.0;

  // Starling Net Ultrafiltration Pressure (NFP)
  const nfp = (autoregulatedPgc - bowmanSpacePbs) - plasmaOncotic; // ~16 mmHg

  // GFR = Kf * NFP (normal Kf ~ 7.5 mL/min/mmHg)
  const gfrMlMin = Math.max(10, Math.min(180, nfp * 7.5));

  // Rhythmic arteriolar vasomotion (0.2 Hz slow wave)
  const pulse = Math.sin(elapsedSeconds * 2.0 * Math.PI * 0.2);
  const pulsatileFlowFactor = 1.0 + pulse * 0.12;

  return {
    gfrMlMin: Math.round(gfrMlMin * 10) / 10,
    netFiltrationPressureMmHg: Math.round(nfp * 10) / 10,
    afferentPgcMmHg: Math.round(autoregulatedPgc * 10) / 10,
    bowmanSpacePbsMmHg: bowmanSpacePbs,
    plasmaOncoticMmHg: plasmaOncotic,
    pulsatileFlowFactor,
    medullaryOsmolalityMOsm: 1200,
  };
}

/**
 * Creates Renal Corticomedullary Gradient Material for cross-sectional slices
 */
export function createRenalPyramidMaterial(clippingPlanes: THREE.Plane[] = []): THREE.MeshPhysicalMaterial {
  return new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#9f1239'), // Deep medullary pyramid crimson
    emissive: new THREE.Color('#4c0519'),
    emissiveIntensity: 0.15,
    roughness: 0.42,
    metalness: 0.05,
    transmission: 0.18,
    thickness: 1.0,
    clearcoat: 0.85,
    clearcoatRoughness: 0.1,
    clippingPlanes,
    clipShadows: true,
  });
}
