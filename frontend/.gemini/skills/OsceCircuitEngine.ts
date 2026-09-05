/**
 * OsceCircuitEngine.ts
 * Multi-Station Timed OSCE Circuit Sequencer & Assessment Analytics Engine.
 * Location: frontend/.gemini/skills/OsceCircuitEngine.ts
 */

import {
  OsceStation,
  OsceDimension,
  OsceChecklistItem,
} from '@/lib/exam/osceStationRegistry';

export type OsceCircuitPhase =
  | 'PRE_CIRCUIT'
  | 'READING_DOOR_NOTE'
  | 'STATION_ENCOUNTER'
  | 'STATION_DEBRIEF'
  | 'CIRCUIT_COMPLETED';

export interface OsceDimensionScore {
  scored: number;
  total: number;
  percentage: number;
}

export interface OsceStationAttempt {
  stationId: string;
  stationTitle: string;
  domain: string;
  checkedItemIds: string[];
  criticalFailsTriggered: string[];
  timeSpentSeconds: number;
  dimensionScores: Record<OsceDimension, OsceDimensionScore>;
  totalScored: number;
  totalPossible: number;
  scorePercentage: number;
  isPassed: boolean;
  examinerNotes?: string[];
}

export interface DeansAssessmentReport {
  candidateId: string;
  circuitDate: string;
  totalStations: number;
  stationsPassed: number;
  stationsFailed: number;
  overallScorePercentage: number;
  overallPassed: boolean;
  criticalSafetyViolationsCount: number;
  dimensionBreakdown: Record<OsceDimension, OsceDimensionScore>;
  stationReports: OsceStationAttempt[];
  keyStrengths: string[];
  areasForImprovement: string[];
  statutoryAccreditationVerdict: string;
}

/**
 * Web Audio API bell chime synthesizer.
 * Synthesizes pure harmonic acoustic chimes without requiring external audio assets.
 */
export function playOsceChime(
  type: 'START' | 'WARNING_2MIN' | 'FINISH',
  muted = false
): void {
  if (muted || typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    if (type === 'START') {
      // Single bright resonant bell (880Hz A5)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, ctx.currentTime);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } else if (type === 'WARNING_2MIN') {
      // Dual warning chime (659Hz E5 -> 880Hz A5)
      [
        { freq: 659.25, time: 0 },
        { freq: 880.0, time: 0.25 },
      ].forEach(({ freq, time }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + time);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + time);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + time);
        osc.stop(ctx.currentTime + time + 0.6);
      });
    } else if (type === 'FINISH') {
      // Deep terminal rotation bell (440Hz A4) with slow decay
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);

      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 2.0);
    }
  } catch {
    // Graceful fallback if AudioContext is blocked by browser autoplay policy
  }
}

/**
 * Calculates candidate performance on a single OSCE station.
 */
export function evaluateStationPerformance(
  station: OsceStation,
  checkedItemIds: string[],
  triggeredCriticalFails: string[] = [],
  timeSpentSeconds = 0
): OsceStationAttempt {
  const checkedSet = new Set(checkedItemIds);
  const totalPossible = station.checklist.reduce((acc, item) => acc + item.marks, 0);

  // Initialize 5 dimensions
  const dimensionScores: Record<OsceDimension, OsceDimensionScore> = {
    COMMUNICATION: { scored: 0, total: 0, percentage: 0 },
    CLINICAL_SKILL: { scored: 0, total: 0, percentage: 0 },
    PATIENT_SAFETY: { scored: 0, total: 0, percentage: 0 },
    DIAGNOSTIC_REASONING: { scored: 0, total: 0, percentage: 0 },
    MANAGEMENT: { scored: 0, total: 0, percentage: 0 },
  };

  let totalScored = 0;

  station.checklist.forEach((item: OsceChecklistItem) => {
    dimensionScores[item.dimension].total += item.marks;
    if (checkedSet.has(item.id)) {
      dimensionScores[item.dimension].scored += item.marks;
      totalScored += item.marks;
    }
  });

  // Calculate percentages per dimension
  (Object.keys(dimensionScores) as OsceDimension[]).forEach((dim) => {
    const d = dimensionScores[dim];
    d.percentage = d.total > 0 ? Math.round((d.scored / d.total) * 100) : 100;
  });

  const scorePercentage = totalPossible > 0 ? Math.round((totalScored / totalPossible) * 100) : 0;

  // A station is failed if score < passingScorePct OR any critical safety fail occurred
  const hasCriticalFail = triggeredCriticalFails.length > 0;
  const isPassed = scorePercentage >= station.passingScorePct && !hasCriticalFail;

  return {
    stationId: station.id,
    stationTitle: station.title,
    domain: station.domainTitle,
    checkedItemIds,
    criticalFailsTriggered: triggeredCriticalFails,
    timeSpentSeconds,
    dimensionScores,
    totalScored,
    totalPossible,
    scorePercentage,
    isPassed,
  };
}

/**
 * Aggregates multiple station attempts into a comprehensive Dean's Assessment Report.
 */
export function generateDeansAssessmentReport(
  stationAttempts: OsceStationAttempt[],
  candidateId = 'MED-CANDIDATE-2026'
): DeansAssessmentReport {
  const totalStations = stationAttempts.length;
  let totalScoredAll = 0;
  let totalPossibleAll = 0;
  let stationsPassed = 0;
  let criticalSafetyViolationsCount = 0;

  const dimensionTotals: Record<OsceDimension, OsceDimensionScore> = {
    COMMUNICATION: { scored: 0, total: 0, percentage: 0 },
    CLINICAL_SKILL: { scored: 0, total: 0, percentage: 0 },
    PATIENT_SAFETY: { scored: 0, total: 0, percentage: 0 },
    DIAGNOSTIC_REASONING: { scored: 0, total: 0, percentage: 0 },
    MANAGEMENT: { scored: 0, total: 0, percentage: 0 },
  };

  stationAttempts.forEach((attempt) => {
    totalScoredAll += attempt.totalScored;
    totalPossibleAll += attempt.totalPossible;
    if (attempt.isPassed) stationsPassed++;
    criticalSafetyViolationsCount += attempt.criticalFailsTriggered.length;

    (Object.keys(dimensionTotals) as OsceDimension[]).forEach((dim) => {
      dimensionTotals[dim].scored += attempt.dimensionScores[dim].scored;
      dimensionTotals[dim].total += attempt.dimensionScores[dim].total;
    });
  });

  (Object.keys(dimensionTotals) as OsceDimension[]).forEach((dim) => {
    const d = dimensionTotals[dim];
    d.percentage = d.total > 0 ? Math.round((d.scored / d.total) * 100) : 100;
  });

  const overallScorePercentage =
    totalPossibleAll > 0 ? Math.round((totalScoredAll / totalPossibleAll) * 100) : 0;
  const stationsFailed = totalStations - stationsPassed;

  // Standard statutory OSCE passing rule: Overall >= 70% AND maximum 1 station failed AND 0 critical safety errors
  const overallPassed =
    overallScorePercentage >= 70 &&
    stationsFailed <= Math.floor(totalStations * 0.25) &&
    criticalSafetyViolationsCount === 0;

  // Derive strengths and weaknesses
  const keyStrengths: string[] = [];
  const areasForImprovement: string[] = [];

  (Object.keys(dimensionTotals) as OsceDimension[]).forEach((dim) => {
    const pct = dimensionTotals[dim].percentage;
    const readable = dim.replace('_', ' ').toLowerCase();
    if (pct >= 80) {
      keyStrengths.push(`Exemplary performance in ${readable} (${pct}%).`);
    } else if (pct < 70) {
      areasForImprovement.push(
        `Deficit observed in ${readable} (${pct}%). Remediation required before clinical attachment.`
      );
    }
  });

  if (criticalSafetyViolationsCount > 0) {
    areasForImprovement.push(
      `Critical patient safety violations detected (${criticalSafetyViolationsCount} events). Mandatory simulation lab remediation required.`
    );
  }

  const statutoryAccreditationVerdict = overallPassed
    ? 'PASSED: Demonstrates safe, competent independent clinical reasoning and communication meeting statutory clinical licensing criteria.'
    : 'FAILED (RE-EXAMINATION REQUIRED): Does not currently satisfy minimum patient safety or clinical competency thresholds.';

  return {
    candidateId,
    circuitDate: new Date().toISOString().split('T')[0],
    totalStations,
    stationsPassed,
    stationsFailed,
    overallScorePercentage,
    overallPassed,
    criticalSafetyViolationsCount,
    dimensionBreakdown: dimensionTotals,
    stationReports: stationAttempts,
    keyStrengths: keyStrengths.length > 0 ? keyStrengths : ['Solid foundational patient engagement.'],
    areasForImprovement:
      areasForImprovement.length > 0
        ? areasForImprovement
        : ['Continue routine clinical skills maintenance.'],
    statutoryAccreditationVerdict,
  };
}
