/**
 * CrossBridgeCyclingEngine.ts
 * Biomechanical Engine for Huxley Sliding Filament Theory & Sarcomere Dynamics
 * Location: frontend/.gemini/skills/3d/CrossBridgeCyclingEngine.ts
 *
 * Implements:
 * 1. Sarcomere length oscillation (1.7 µm to 2.3 µm) driven by cross-bridge cycling frequency.
 * 2. Myosin S1 globular head power stroke angular displacement (45° resting to 90° power stroke).
 * 3. Lymn-Taylor actomyosin ATPase biochemical states (Attachment, Power Stroke, ATP Binding, Detachment, Cocking).
 * 4. Muscle fatigue attenuation affecting peak tetanic tension generation.
 */

export interface SarcomereState {
  /** Length of the sarcomere in micrometers (rest: 2.1 µm, active range: 1.7 to 2.3 µm) */
  sarcomereLengthUm: number;
  /** Angle of the myosin S1 cross-bridge head in degrees (45° pre-stroke -> 90° post-stroke) */
  myosinHeadAngleDeg: number;
  /** Active isometric/isotonic tension force normalized 0.0 to 1.0 */
  crossBridgeForce: number;
  /** Width fraction of the central A-band relative to resting sarcomere */
  aZoneWidthFraction: number;
  /** Accumulated metabolic muscle fatigue (0.0 fresh to 1.0 exhausted) */
  fatigueLevel: number;
  /** Current Lymn-Taylor catalytic cycle biochemical phase */
  phase: 'ATP_BINDING' | 'DETACHMENT' | 'COCKING' | 'POWER_STROKE' | 'RIGOR';
}

/**
 * Computes the real-time biomechanical state of a single sarcomere functional unit
 *
 * @param elapsedSeconds - Monotonic simulation time in seconds
 * @param contractionFrequencyHz - Twitch/tetanus cycling rate in Hz (default: 2 Hz)
 * @param fatigueLevel - Muscle fatigue factor from 0.0 to 1.0 (default: 0)
 */
export function computeSarcomereState(
  elapsedSeconds: number,
  contractionFrequencyHz = 2,
  fatigueLevel = 0.0
): SarcomereState {
  const clampedFatigue = Math.max(0, Math.min(1, fatigueLevel));
  const effectiveFreq = Math.max(0.1, Math.min(60, contractionFrequencyHz));
  const period = 1.0 / effectiveFreq;
  const cycleProgress = (elapsedSeconds % period) / period; // 0.0 to 1.0

  let phase: SarcomereState['phase'] = 'COCKING';
  let myoAngle = 45; // 45 degrees resting
  let forceNorm = 0;
  let slUm = 2.1; // resting length

  // 4-Phase Lymn-Taylor cross-bridge cycle
  if (cycleProgress < 0.25) {
    // Phase 1: ATP Binding & Detachment (dissociation of myosin from actin)
    phase = 'ATP_BINDING';
    const p = cycleProgress / 0.25;
    myoAngle = 90 - p * 45; // returning from stroke
    forceNorm = (1 - p) * 0.2;
    slUm = 1.8 + p * 0.3; // elastic return towards rest
  } else if (cycleProgress < 0.50) {
    // Phase 2: ATP Hydrolysis & Cocking (head is primed at 45 degrees)
    phase = 'COCKING';
    myoAngle = 45;
    forceNorm = 0.05;
    slUm = 2.1;
  } else if (cycleProgress < 0.85) {
    // Phase 3: Power Stroke (Pi release triggers 45 -> 90 deg tilt, sliding actin)
    phase = 'POWER_STROKE';
    const p = (cycleProgress - 0.50) / 0.35;
    myoAngle = 45 + p * 45; // 45 -> 90 degrees
    forceNorm = Math.sin(p * Math.PI * 0.5) * (1 - clampedFatigue * 0.65);
    slUm = 2.1 - p * 0.35; // sliding filament shortening from 2.1 to 1.75 um
  } else {
    // Phase 4: ADP Release & Rigor Complex (transient tight binding before next ATP)
    phase = 'RIGOR';
    myoAngle = 90;
    forceNorm = (1 - clampedFatigue * 0.65) * 0.8;
    slUm = 1.75;
  }

  return {
    sarcomereLengthUm: slUm,
    myosinHeadAngleDeg: myoAngle,
    crossBridgeForce: forceNorm,
    aZoneWidthFraction: 1.5 / slUm, // constant A-band width ~1.5 um over varying SL
    fatigueLevel: clampedFatigue,
    phase,
  };
}
