/**
 * NeuronActionPotentialEngine.ts
 * Neurophysiology Action Potential & Saltatory Conduction Engine
 * Location: frontend/.gemini/skills/3d/NeuronActionPotentialEngine.ts
 *
 * Simulates:
 * 1. Hodgkin-Huxley membrane voltage dynamics (-70 mV resting -> +30 mV overshoot -> -80 mV refractory).
 * 2. Saltatory electrical impulse jumping between Nodes of Ranvier.
 * 3. Pre-synaptic vesicle exocytosis at terminal boutons.
 */

import * as THREE from 'three';

export interface ActionPotentialState {
  membranePotentialMv: number; // -80 to +30 mV
  impulsePositionNorm: number; // 0.0 (hillock) to 1.0 (terminal)
  activeNodeIndex: number; // 0 to 4 (5 nodes of Ranvier)
  isDepolarized: boolean;
  vesicleExocytosisGlow: number; // 0.0 to 1.0 at terminal
  signalColorHex: string; // Electric cyan / gold spark
}

/**
 * Computes neuronal action potential conduction wave
 */
export function computeActionPotentialState(elapsedSeconds: number, firingFrequencyHz = 5): ActionPotentialState {
  const period = 1.0 / Math.max(1, Math.min(50, firingFrequencyHz));
  const tCycle = (elapsedSeconds % period) / period; // 0.0 to 1.0

  // Signal propagation along axon length (0.0 to 0.75 of period is conduction, 0.75-1.0 is refractory)
  const impulsePositionNorm = Math.min(1.0, tCycle / 0.75);

  // 5 discrete Nodes of Ranvier along the axon
  const activeNodeIndex = Math.min(4, Math.floor(impulsePositionNorm * 5));

  let membranePotentialMv = -70;
  let isDepolarized = false;
  let vesicleExocytosisGlow = 0;

  if (tCycle < 0.15) {
    // Depolarization spike (Na+ influx)
    const p = tCycle / 0.15;
    membranePotentialMv = -70 + 100 * Math.sin(p * Math.PI * 0.5); // reaches +30 mV
    isDepolarized = true;
  } else if (tCycle < 0.40) {
    // Repolarization (K+ efflux) & after-hyperpolarization
    const p = (tCycle - 0.15) / 0.25;
    membranePotentialMv = 30 - 110 * p; // drops to -80 mV
  } else if (tCycle < 0.75) {
    // Return to resting -70 mV via Na+/K+ ATPase
    const p = (tCycle - 0.40) / 0.35;
    membranePotentialMv = -80 + 10 * p;
  } else {
    membranePotentialMv = -70;
  }

  // Terminal bouton exocytosis triggers when impulse reaches the end
  if (impulsePositionNorm > 0.85) {
    vesicleExocytosisGlow = Math.sin(((impulsePositionNorm - 0.85) / 0.15) * Math.PI);
  }

  const signalColorHex = isDepolarized ? '#38bdf8' : '#eab308';

  return {
    membranePotentialMv: Math.round(membranePotentialMv),
    impulsePositionNorm,
    activeNodeIndex,
    isDepolarized,
    vesicleExocytosisGlow,
    signalColorHex,
  };
}

/**
 * Creates Myelin Sheath Oligodendrocyte/Schwann Material
 */
export function createMyelinSheathMaterial(clippingPlanes: THREE.Plane[] = []): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    color: new THREE.Color('#fef08a'), // Lipid-rich yellow-white myelin
    roughness: 0.28,
    metalness: 0.12,
    clippingPlanes,
    clipShadows: true,
  });
}
