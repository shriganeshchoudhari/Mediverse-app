/**
 * HormoneSecretionEngine.ts
 * Endocrine System Hormone Secretion & HPA Axis Simulation Engine
 * Location: frontend/.gemini/skills/3d/HormoneSecretionEngine.ts
 *
 * Implements:
 * 1. Thyroid follicular colloid oscillation (TRH → TSH → T3/T4 cycle).
 * 2. Adrenal cortex circadian activation (ACTH stimulated cortisol).
 * 3. Pituitary ultradian pulse phase (~90-min compressed).
 * 4. Pancreatic beta-cell pulsatile insulin exocytosis.
 * 5. HPA axis 4-state sequential phase cycling.
 */

import * as THREE from 'three';

export interface EndocrineState {
  tshLevel: number;                    // 0.5–5.0 mIU/L
  follicularColloidVolume: number;     // 0.5 (secreting) to 1.0 (stored)
  adrenalCortexActivation: number;     // 0–1 (0=basal, 1=stress ACTH stimulated)
  pituitaryPulsePhase: number;         // 0–2π ultradian oscillation
  pancreaticBetaExocytosis: number;    // 0–1 insulin granule release
  hpaAxisPhase:
    | 'HYPOTHALAMUS_CRH'
    | 'PITUITARY_ACTH'
    | 'ADRENAL_CORTISOL'
    | 'FEEDBACK_INHIBITION';
}

/**
 * Computes the real-time endocrine secretory state.
 *
 * @param elapsedSeconds  - Wall-clock time from useFrame state.clock.elapsedTime
 * @param tshLevel        - Baseline TSH setpoint (0.5–5.0 mIU/L, default 2.0)
 * @param cortisolPhase   - Circadian day phase 0–1 (0=midnight, 0.3=peak morning)
 */
export function computeEndocrineState(
  elapsedSeconds: number,
  tshLevel = 2.0,
  cortisolPhase = 0.3,
): EndocrineState {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. FOLLICULAR COLLOID VOLUME (0.8 rad/s oscillation between 0.5–1.0)
  //    Large colloid = stored thyroglobulin; small = active secretion
  // ──────────────────────────────────────────────────────────────────────────
  const follicularColloidVolume = 0.75 + 0.25 * Math.sin(elapsedSeconds * 0.8);

  // ──────────────────────────────────────────────────────────────────────────
  // 2. ADRENAL CORTEX ACTIVATION (0.6 rad/s sinusoidal circadian approximation)
  //    Phase-shifted by cortisolPhase (user-supplied day position)
  // ──────────────────────────────────────────────────────────────────────────
  const adrenalCortexActivation =
    0.5 + 0.5 * Math.sin(elapsedSeconds * 0.6 + cortisolPhase * Math.PI * 2);

  // ──────────────────────────────────────────────────────────────────────────
  // 3. PITUITARY ULTRADIAN PULSE PHASE (1.1 rad/s → ~5.7-second display period)
  // ──────────────────────────────────────────────────────────────────────────
  const pituitaryPulsePhase = (elapsedSeconds * 1.1) % (Math.PI * 2);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. PANCREATIC BETA-CELL EXOCYTOSIS (1.5 rad/s pulsatile, half-wave rectified)
  // ──────────────────────────────────────────────────────────────────────────
  const pancreaticBetaExocytosis = Math.max(0, Math.sin(elapsedSeconds * 1.5));

  // ──────────────────────────────────────────────────────────────────────────
  // 5. HPA AXIS SEQUENTIAL 4-PHASE CYCLE (4-second total period)
  //    HYPOTHALAMUS_CRH → PITUITARY_ACTH → ADRENAL_CORTISOL → FEEDBACK_INHIBITION
  // ──────────────────────────────────────────────────────────────────────────
  const HPA_PERIOD = 4.0;
  const hpaNorm = (elapsedSeconds % HPA_PERIOD) / HPA_PERIOD; // 0–1

  let hpaAxisPhase: EndocrineState['hpaAxisPhase'];
  if (hpaNorm < 0.25) {
    hpaAxisPhase = 'HYPOTHALAMUS_CRH';
  } else if (hpaNorm < 0.50) {
    hpaAxisPhase = 'PITUITARY_ACTH';
  } else if (hpaNorm < 0.75) {
    hpaAxisPhase = 'ADRENAL_CORTISOL';
  } else {
    hpaAxisPhase = 'FEEDBACK_INHIBITION';
  }

  return {
    tshLevel: Math.max(0.5, Math.min(5.0, tshLevel)),
    follicularColloidVolume,
    adrenalCortexActivation,
    pituitaryPulsePhase,
    pancreaticBetaExocytosis,
    hpaAxisPhase,
  };
}
