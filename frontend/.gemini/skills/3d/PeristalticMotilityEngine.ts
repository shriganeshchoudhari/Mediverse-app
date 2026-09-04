/**
 * PeristalticMotilityEngine.ts
 * GI Tract Motility & Peristaltic Wave Propagation Engine
 * Location: frontend/.gemini/skills/3d/PeristalticMotilityEngine.ts
 *
 * Implements:
 * 1. Traveling peristaltic wave position (caudal propagation).
 * 2. 8-segment contraction amplitude array (traveling wave envelope).
 * 3. Pyloric sphincter gating (gastric emptying oscillation).
 * 4. Intestinal villi sway phase (lacteals / absorption motion).
 * 5. Haustra churning phase (colonic segmentation contractions).
 */

import * as THREE from 'three';

export interface GIMotilityState {
  peristalticWavePosition: number;         // 0.0 to 1.0 (wave progresses along GI tube)
  segmentContractionAmplitudes: number[];  // array of 8 values, each 0-1 for each GI segment
  pyloriSphincterOpen: number;             // 0 (closed) to 1 (open)
  villiMotionPhase: number;                // 0–2π, drives villi sway
  haustraContractionPhase: number;         // for colonic haustra churning
}

/**
 * Computes the real-time GI tract motility state.
 *
 * @param elapsedSeconds - Wall-clock time from useFrame state.clock.elapsedTime
 * @param fastingState   - true = MMC (interdigestive) motility pattern; false = fed peristalsis
 */
export function computeGIMotilityState(
  elapsedSeconds: number,
  fastingState = false,
): GIMotilityState {
  // ──────────────────────────────────────────────────────────────────────────
  // 1. PERISTALTIC WAVE POSITION
  //    Rate halved during fasting (migrating motor complex is slower ~0.15)
  // ──────────────────────────────────────────────────────────────────────────
  const waveSpeed = fastingState ? 0.15 : 0.3;
  const peristalticWavePosition = (elapsedSeconds * waveSpeed) % 1.0;

  // ──────────────────────────────────────────────────────────────────────────
  // 2. SEGMENT CONTRACTION AMPLITUDES (traveling wave, 8 segments)
  //    Each segment i peaks when peristalticWavePosition * 8 ≈ i
  // ──────────────────────────────────────────────────────────────────────────
  const segmentContractionAmplitudes: number[] = [];
  for (let i = 0; i < 8; i++) {
    const raw = Math.sin((peristalticWavePosition * 8 - i) * Math.PI * 2);
    segmentContractionAmplitudes.push(Math.max(0, raw) * 0.4);
  }

  // ──────────────────────────────────────────────────────────────────────────
  // 3. PYLORIC SPHINCTER OPEN STATE (0→1 every 4 seconds)
  //    Represents gastric emptying bolus release
  // ──────────────────────────────────────────────────────────────────────────
  const pyloriSphincterOpen = 0.5 + 0.5 * Math.sin((elapsedSeconds / 4) * Math.PI * 2 - Math.PI / 2);

  // ──────────────────────────────────────────────────────────────────────────
  // 4. VILLI MOTION PHASE (3.0 rad/s – lacteals rhythmic contraction)
  // ──────────────────────────────────────────────────────────────────────────
  const villiMotionPhase = elapsedSeconds * 3.0;

  // ──────────────────────────────────────────────────────────────────────────
  // 5. HAUSTRA CONTRACTION PHASE (0.8 rad/s – slow colonic churning)
  // ──────────────────────────────────────────────────────────────────────────
  const haustraContractionPhase = elapsedSeconds * 0.8;

  return {
    peristalticWavePosition,
    segmentContractionAmplitudes,
    pyloriSphincterOpen,
    villiMotionPhase,
    haustraContractionPhase,
  };
}
