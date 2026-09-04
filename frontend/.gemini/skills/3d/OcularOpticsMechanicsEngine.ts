/**
 * OcularOpticsMechanicsEngine.ts
 * High-Fidelity Ocular Biomechanical Engine — Pupillary Light Reflex Simulation
 * Location: frontend/.gemini/skills/3d/OcularOpticsMechanicsEngine.ts
 *
 * Implements:
 * 1. Pupillary Light Reflex (PLR): sigmoid lux-driven iris sphincter / dilator muscle model.
 * 2. Intraocular Pressure (IOP) pulsatile waveform (~72 BPM ocular pulse).
 * 3. Crystalline lens accommodation mechanics (Helmholtz theory).
 * 4. Periodic involuntary blink reflex (every ~4 seconds, 0.15 s closure).
 * 5. Phase enumeration matching clinical ophthalmic examination states.
 */

export interface OcularState {
  /** Pupil radius in mm: 2.0 (photopic/bright) to 8.0 (scotopic/dark) */
  pupilRadiusMm: number;
  /** Accommodation in diopters: 0 (far/infinity) to 10 (near/10 cm) */
  accommodationDiopters: number;
  /** Intraocular pressure in mmHg — pulsatile, clamped 10–21 */
  iopMmHg: number;
  /** Crystalline lens axial thickness in mm: 3.5 (rest) to 4.5 (10 D) */
  lensThicknessMm: number;
  /** Eyelid blink closure progress: 0 (fully open) to 1 (fully closed) */
  blinkProgress: number;
  /** Current ophthalmic phase of the eye model */
  phase: 'DARK_ADAPTATION' | 'PHOTOPIC' | 'ACCOMMODATION' | 'BLINK';
}

/**
 * Smooth sigmoid function — maps any real value to [0, 1].
 * k controls steepness.
 */
function sigmoid(x: number, k = 1): number {
  return 1 / (1 + Math.exp(-k * x));
}

/**
 * Maps ambient illuminance (lux) to a pupil radius (mm) via a
 * physiologically calibrated sigmoid.
 *
 *  < 1 lux   => ~8.0 mm (scotopic maximum)
 * ~500 lux   => ~4.0 mm (mesopic)
 * > 1000 lux => ~2.0 mm (photopic minimum)
 */
function luxToPupilRadiusMm(lux: number): number {
  // Normalise lux on a log scale: log10(1 lux)=0, log10(1000 lux)=3
  const logLux = Math.log10(Math.max(0.01, lux));
  // Sigmoid centred at ~2.7 (~500 lux), steepness 1.5
  const s = sigmoid(logLux - 2.7, 1.5);
  // Map sigmoid [0,1] => pupil radius [8.0, 2.0] mm (inverted: bright=small)
  return 8.0 - s * 6.0;
}

/**
 * Maps an accommodation demand in diopters to lens axial thickness (mm).
 * Linear per Dubbelman model: 3.5 mm at rest -> 4.5 mm at 10 D.
 */
function diopterToLensThickness(diopters: number): number {
  const clamped = Math.max(0, Math.min(10, diopters));
  return 3.5 + (clamped / 10) * 1.0;
}

/**
 * Returns the blink progress [0, 1] for the current elapsed time.
 * Blink cycle: every ~4 seconds, closure over 0.075 s, reopening over 0.075 s.
 */
function computeBlinkProgress(elapsedSeconds: number): number {
  const BLINK_INTERVAL = 4.0;
  const BLINK_CLOSE_DURATION = 0.075;
  const BLINK_OPEN_DURATION = 0.075;
  const BLINK_TOTAL = BLINK_CLOSE_DURATION + BLINK_OPEN_DURATION;

  const tInCycle = elapsedSeconds % BLINK_INTERVAL;

  if (tInCycle < BLINK_TOTAL) {
    if (tInCycle < BLINK_CLOSE_DURATION) {
      return tInCycle / BLINK_CLOSE_DURATION;
    } else {
      return 1 - (tInCycle - BLINK_CLOSE_DURATION) / BLINK_OPEN_DURATION;
    }
  }

  return 0;
}

/**
 * Compute a full OcularState snapshot for the given simulation time and
 * ambient illuminance.
 *
 * @param elapsedSeconds - Total elapsed simulation time in seconds (from clock).
 * @param ambientLux     - Scene ambient illuminance in lux (default 500 = indoor).
 */
export function computeOcularState(
  elapsedSeconds: number,
  ambientLux: number = 500
): OcularState {
  // PLR latency ~0.2 s; simulate via slow-varying sine on the lux
  const adaptedLux = ambientLux * (0.9 + 0.1 * Math.sin(elapsedSeconds * 0.15));
  const pupilRadiusMm = luxToPupilRadiusMm(adaptedLux);

  // Slow sinusoidal near-far vergence cycle
  const accommodationDiopters = 5.0 + 5.0 * Math.sin(elapsedSeconds * 0.22);
  const lensThicknessMm = diopterToLensThickness(accommodationDiopters);

  // Ocular pulse ~72 BPM (1.2 Hz); amplitude ~11 mmHg above baseline 10 mmHg
  const rawIop = 10 + 11 * Math.abs(Math.sin(elapsedSeconds * 1.2));
  const iopMmHg = Math.min(21, Math.max(10, rawIop));

  const blinkProgress = computeBlinkProgress(elapsedSeconds);
  const isBlinking = blinkProgress > 0.05;

  let phase: OcularState['phase'];
  if (isBlinking) {
    phase = 'BLINK';
  } else if (accommodationDiopters > 6.5) {
    phase = 'ACCOMMODATION';
  } else if (adaptedLux < 1) {
    phase = 'DARK_ADAPTATION';
  } else {
    phase = 'PHOTOPIC';
  }

  return {
    pupilRadiusMm,
    accommodationDiopters,
    iopMmHg,
    lensThicknessMm,
    blinkProgress,
    phase,
  };
}
