/**
 * MembraneBiophysicsEngine.ts
 * Lipid Bilayer Biophysics & Membrane Protein Conformational Engine
 * Location: frontend/.gemini/skills/3d/MembraneBiophysicsEngine.ts
 *
 * Implements:
 * 1. Phospholipid lateral thermal undulation (fluid mosaic model).
 * 2. GPCR 7-TM helix conformational cycling (R → R* transition).
 * 3. Markov-like stochastic ion channel gating (open/closed).
 * 4. Na+/K+ ATPase Post-Albers 4-state catalytic cycle.
 * 5. Cholesterol rigidity modulation of membrane fluidity.
 */

import * as THREE from 'three';

export interface MembraneState {
  phospholipidWaveAmplitude: number; // 0.01-0.08 lateral undulation
  gpcrConformationAngle: number;     // 0=closed, 1=open (0.0-1.0)
  ionChannelGating: boolean;         // true = open, false = closed
  naKPumpPhase: 'E1_OPEN_IN' | 'E1P_PHOSPHORYLATED' | 'E2P_OPEN_OUT' | 'E2_DEPHOSPHORYLATED';
  cholesterolRigidity: number;       // 0.0 (fluid) to 1.0 (rigid)
}

// Internal mutable state for Markov gating (module-level singleton)
let _lastGatingToggleTime = 0;
let _ionChannelOpen = false;

/**
 * Computes real-time biophysical state of the plasma membrane.
 *
 * @param elapsedSeconds  - Wall-clock time from useFrame state.clock.elapsedTime
 * @param temperature     - Temperature in Celsius (default 37 °C body temp)
 * @param cholesterolFraction - Mole fraction of cholesterol 0.0–0.5 (default 0.30)
 */
export function computeMembraneState(
  elapsedSeconds: number,
  temperature = 37,
  cholesterolFraction = 0.3,
): MembraneState {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. PHOSPHOLIPID LATERAL THERMAL UNDULATION
  //    Amplitude scaled slightly by temperature (higher T → more motion)
  // ──────────────────────────────────────────────────────────────────────────
  const tempScale = Math.max(0.8, Math.min(1.2, temperature / 37));
  const phospholipidWaveAmplitude =
    (0.035 + 0.025 * Math.sin(elapsedSeconds * 2.3)) * tempScale;

  // ──────────────────────────────────────────────────────────────────────────
  // 2. GPCR CONFORMATIONAL CYCLING  (0 → 1 → 0 every 3 seconds)
  //    Uses half-period sine wave rectified to [0,1]
  // ──────────────────────────────────────────────────────────────────────────
  const gpcrConformationAngle = 0.5 + 0.5 * Math.sin((elapsedSeconds / 3) * Math.PI * 2 - Math.PI / 2);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. ION CHANNEL MARKOV-LIKE STOCHASTIC GATING
  //    Toggles approximately every 1.5 seconds; deterministic seeded from time
  // ──────────────────────────────────────────────────────────────────────────
  const GATING_PERIOD = 1.5;
  if (elapsedSeconds - _lastGatingToggleTime >= GATING_PERIOD) {
    _ionChannelOpen = !_ionChannelOpen;
    _lastGatingToggleTime = elapsedSeconds;
  }
  const ionChannelGating = _ionChannelOpen;

  // ──────────────────────────────────────────────────────────────────────────
  // 4. Na+/K+ ATPase POST-ALBERS 4-STATE CYCLE (2-second period)
  //    E1_OPEN_IN → E1P_PHOSPHORYLATED → E2P_OPEN_OUT → E2_DEPHOSPHORYLATED
  // ──────────────────────────────────────────────────────────────────────────
  const pumpCycleDuration = 2.0;
  const pumpPhaseNorm = (elapsedSeconds % pumpCycleDuration) / pumpCycleDuration; // 0–1

  let naKPumpPhase: MembraneState['naKPumpPhase'];
  if (pumpPhaseNorm < 0.25) {
    naKPumpPhase = 'E1_OPEN_IN';
  } else if (pumpPhaseNorm < 0.50) {
    naKPumpPhase = 'E1P_PHOSPHORYLATED';
  } else if (pumpPhaseNorm < 0.75) {
    naKPumpPhase = 'E2P_OPEN_OUT';
  } else {
    naKPumpPhase = 'E2_DEPHOSPHORYLATED';
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 5. CHOLESTEROL RIGIDITY
  //    Linearly ramps from 0 at 0 mol% to 1.0 at 50 mol%
  // ──────────────────────────────────────────────────────────────────────────
  const cholesterolRigidity = Math.min(1.0, Math.max(0.0, cholesterolFraction / 0.5));

  return {
    phospholipidWaveAmplitude,
    gpcrConformationAngle,
    ionChannelGating,
    naKPumpPhase,
    cholesterolRigidity,
  };
}
