/**
 * ReproductiveCycleEngine.ts
 * Endocrine-Biomechanical Engine for Human Ovarian & Uterine Endometrial Cycle
 * Location: frontend/.gemini/skills/3d/ReproductiveCycleEngine.ts
 *
 * Implements:
 * 1. 28-Day Menstrual Cycle phases: Menstrual (1-5), Proliferative/Follicular (6-13), Ovulation (14), Secretory/Luteal (15-28).
 * 2. Dominant Graafian follicle recruitment, antral expansion (4mm -> 20mm), and LH-triggered rupture.
 * 3. Corpus luteum vascularization and luteolysis kinetics.
 * 4. Endometrial stratum functionale hypertrophy (2mm -> 12mm) and post-luteal desquamation.
 */

export interface ReproductiveCycleState {
  /** Current day of the standard 28-day cycle (1.0 to 28.0) */
  cycleDay: number;
  /** Current clinical phase of the ovarian/uterine cycle */
  phase: 'MENSTRUAL' | 'FOLLICULAR' | 'OVULATION' | 'LUTEAL';
  /** Dominant Graafian follicle diameter in millimeters (4 mm resting -> 20 mm pre-ovulatory) */
  dominantFollicleDiameterMm: number;
  /** Functional endometrial lining thickness in millimeters (2 mm basal/menses -> 12 mm secretory) */
  endometriumThicknessMm: number;
  /** Whether the corpus luteum is endocrine-active and visible */
  corpusLuteumVisible: boolean;
  /** Whether the mid-cycle LH (Luteinizing Hormone) surge is active */
  lhSurgeActive: boolean;
  /** Serum progesterone concentration in ng/mL (peaks mid-luteal ~20 ng/mL) */
  progesteroneLevel: number;
  /** Serum estradiol-17β concentration in pg/mL (peaks late follicular ~350 pg/mL) */
  estradiolLevel: number;
}

/**
 * Computes the real-time ovarian and endometrial structural dynamics for a given cycle day
 *
 * @param cycleDay - Value from 1 to 28 (fractional values supported for smooth animation)
 */
export function computeReproductiveCycleState(cycleDay: number): ReproductiveCycleState {
  // Wrap into 1.0 to 28.0 range
  let day = ((cycleDay - 1) % 28) + 1;
  if (day < 1) day += 28;

  let phase: ReproductiveCycleState['phase'] = 'FOLLICULAR';
  let follicleMm = 4.0;
  let endoMm = 4.0;
  let corpusLuteum = false;
  let lhSurge = false;
  let prog = 0.5;
  let e2 = 40.0;

  if (day <= 5) {
    // Days 1-5: Menstrual Phase (Desquamation of functional endometrium)
    phase = 'MENSTRUAL';
    const progress = day / 5;
    endoMm = 6.0 - progress * 4.0; // shedding down to 2 mm
    follicleMm = 4.0 + progress * 2.0; // early antral recruitment
    prog = 0.5;
    e2 = 30 + progress * 20;
  } else if (day <= 13.5) {
    // Days 6-13: Proliferative / Follicular Phase (Estrogen driven)
    phase = 'FOLLICULAR';
    const progress = (day - 5) / 8.5;
    endoMm = 2.0 + progress * 6.0; // proliferation: 2 -> 8 mm
    follicleMm = 6.0 + progress * 14.0; // Graafian selection: 6 -> 20 mm
    prog = 0.8;
    e2 = 60 + Math.pow(progress, 2) * 280; // pre-ovulatory estradiol spike (~340 pg/mL)
    if (day >= 12.5) {
      lhSurge = true;
    }
  } else if (day <= 14.5) {
    // Day 14: Ovulation (Follicular stigma rupture & oocyte release)
    phase = 'OVULATION';
    endoMm = 8.5;
    follicleMm = 20.0;
    lhSurge = true;
    prog = 1.8;
    e2 = 250;
  } else {
    // Days 15-28: Secretory / Luteal Phase (Progesterone driven by Corpus Luteum)
    phase = 'LUTEAL';
    const lutealDay = day - 14.5;
    const progress = lutealDay / 13.5;

    corpusLuteum = true;
    // Endometrium reaches maximum secretory thickness ~12 mm around day 21
    if (day <= 21) {
      const p1 = (day - 14.5) / 6.5;
      endoMm = 8.5 + p1 * 3.5; // 8.5 -> 12.0 mm
      prog = 2.0 + p1 * 18.0; // 2 -> 20 ng/mL
      e2 = 120 + p1 * 80;
    } else {
      // Days 22-28: Luteolysis (regression without hCG rescue)
      const p2 = (day - 21) / 7.0;
      endoMm = 12.0 - p2 * 2.0; // subtle ischemia before menses
      prog = 20.0 * (1.0 - p2 * 0.9); // sharp progesterone withdrawal
      e2 = 200 * (1.0 - p2 * 0.8);
      if (day > 26) {
        corpusLuteum = false; // regresses to corpus albicans
      }
    }
    follicleMm = 4.0; // collapsed / post-ovulatory
  }

  return {
    cycleDay: day,
    phase,
    dominantFollicleDiameterMm: follicleMm,
    endometriumThicknessMm: endoMm,
    corpusLuteumVisible: corpusLuteum,
    lhSurgeActive: lhSurge,
    progesteroneLevel: prog,
    estradiolLevel: e2,
  };
}

/**
 * Maps continuous simulation time in seconds to an accelerated 28-day cycle.
 * Full 28-day cycle completes in cycleDurationSeconds (default: 28 seconds).
 */
export function animateCycleDay(elapsedSeconds: number, cycleDurationSeconds = 28): number {
  const norm = (elapsedSeconds % cycleDurationSeconds) / cycleDurationSeconds;
  return 1.0 + norm * 27.0;
}
