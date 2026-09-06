/**
 * NeuromuscularBlockadeEngine.ts
 * Biophysical & Pharmacodynamic Engine for Neuromuscular Blockade (NMB),
 * Train-of-Four (TOF) Quantitative Acceleromyography, Post-Tetanic Count (PTC),
 * Postoperative Residual Curarization (PORC), and Sugammadex / Neostigmine Reversal.
 * Location: frontend/.gemini/skills/NeuromuscularBlockadeEngine.ts
 */

export type NmbaDrugType =
  | 'ROCURONIUM' // Aminosteroid (Sugammadex target)
  | 'VECURONIUM' // Aminosteroid (Sugammadex target)
  | 'CISATRACURIUM' // Benzylisoquinolinium (Hoffmann elimination; Sugammadex ineffective)
  | 'SUCCINYLCHOLINE'; // Depolarizing blocker (Phase I vs Phase II block)

export type NeuromuscularBlockDepth =
  | 'COMPLETE_BLOCK' // TOF 0/4, PTC 0
  | 'DEEP_BLOCK' // TOF 0/4, PTC 1-5
  | 'MODERATE_BLOCK' // TOF 1-3/4
  | 'SHALLOW_BLOCK' // TOF 4/4, TOF ratio < 0.40
  | 'MINIMAL_BLOCK' // TOF 4/4, TOF ratio 0.40 - 0.89
  | 'FULL_RECOVERY'; // TOF ratio >= 0.90 (90%)

export type ReversalAgentType =
  | 'SUGAMMADEX'
  | 'NEOSTIGMINE_GLYCOPYRROLATE'
  | 'SPONTANEOUS_RECOVERY';

export interface NeuromuscularPatientParameters {
  weightKg: number;
  nmbaDrug: NmbaDrugType;
  doseMgPerKg: number;
  minutesSinceDosing: number;
  coreTemperatureCelsius: number; // Hypothermia (<35 C) prolongs NMBA duration
  hasEndStageRenalDisease: boolean;
  hasSevereHepaticFailure: boolean;
  isTakingMagnesiumOrAminoglycoside: boolean; // Potentiates NMBA
}

export interface TofMonitoringResult {
  twitchCount: number; // 0, 1, 2, 3, or 4
  twitchHeightsPercent: [number, number, number, number]; // T1, T2, T3, T4 (0 to 100%)
  tofRatio: number; // T4 / T1 (0.0 to 1.0)
  postTetanicCount: number; // 0 to 15 (valid when TOF is 0/4)
  depth: NeuromuscularBlockDepth;
  safeForExtubation: boolean; // Strictly requires TOF ratio >= 0.90
  residualParalysisRisk: 'NONE' | 'LOW' | 'MODERATE' | 'SEVERE_AIRWAY_COLLAPSE';
  mechanismNote: string;
}

export interface ReversalRecommendation {
  recommendedAgent: ReversalAgentType;
  reversalDoseMg: number;
  reversalDosePerKg: number;
  adjunctGlycopyrrolateMg: number;
  estimatedTimeToTof90Minutes: number;
  isSugammadexContraindicatedOrIneffective: boolean;
  isNeostigmineContraindicated: boolean;
  clinicalSafetyAlerts: string[];
}

/**
 * 1. Calculate Pharmacodynamic Neuromuscular Receptor Occupancy & TOF Twitches
 */
export function calculateNeuromuscularState(
  patient: NeuromuscularPatientParameters
): TofMonitoringResult {
  // Base duration and elimination kinetics based on drug
  let durationFactor = 1.0;
  if (patient.coreTemperatureCelsius < 35.0) {
    durationFactor *= 1.35; // Hypothermia impairs enzymatic/organ clearance
  }
  if (patient.isTakingMagnesiumOrAminoglycoside) {
    durationFactor *= 1.3; // Synergistic presynaptic ACh blockade
  }

  if (patient.nmbaDrug === 'ROCURONIUM') {
    if (patient.hasSevereHepaticFailure) durationFactor *= 1.6;
    if (patient.hasEndStageRenalDisease) durationFactor *= 1.3;
  } else if (patient.nmbaDrug === 'VECURONIUM') {
    if (patient.hasSevereHepaticFailure || patient.hasEndStageRenalDisease) durationFactor *= 1.5;
  } else if (patient.nmbaDrug === 'CISATRACURIUM') {
    // Cisatracurium undergoes Hofmann elimination and ester hydrolysis independent of liver/kidneys
    // Organ failure has minimal impact
    if (patient.coreTemperatureCelsius < 35.0) durationFactor *= 1.5; // Hofmann elimination is highly temperature & pH dependent
  }

  // Calculate effective elapsed recovery time
  const effectiveMinutes = patient.minutesSinceDosing / durationFactor;

  // Typical clinical timeline for 2x ED95 intubating dose (e.g. 0.6 mg/kg Rocuronium, 0.1 mg/kg Vecuronium, 0.15 mg/kg Cisatracurium)
  // 0-25m: Complete/Deep block (TOF 0/4)
  // 25-35m: PTC 1-8
  // 35-50m: TOF 1-3/4 (Moderate block)
  // 50-65m: TOF 4/4 with fade (Shallow block, TOFR < 0.40)
  // 65-80m: Minimal block (TOFR 0.40 - 0.89)
  // >80m: Full recovery (TOFR >= 0.90)

  let twitchCount = 0;
  let t1 = 0;
  let t2 = 0;
  let t3 = 0;
  let t4 = 0;
  let tofRatio = 0.0;
  let postTetanicCount = 0;
  let depth: NeuromuscularBlockDepth = 'COMPLETE_BLOCK';

  if (patient.nmbaDrug === 'SUCCINYLCHOLINE') {
    // Rapid depolarizing block: usually full recovery by 10-12 mins unless pseudocholinesterase deficient
    if (effectiveMinutes < 4) {
      depth = 'COMPLETE_BLOCK';
      twitchCount = 0;
      t1 = 0;
      t2 = 0;
      t3 = 0;
      t4 = 0;
      tofRatio = 0;
      postTetanicCount = 0;
    } else if (effectiveMinutes < 8) {
      depth = 'MODERATE_BLOCK';
      twitchCount = 4;
      // Phase I block has no fade: all 4 twitches are equal in height
      const h = Math.min(80, (effectiveMinutes - 4) * 20);
      t1 = h;
      t2 = h;
      t3 = h;
      t4 = h;
      tofRatio = 1.0;
      postTetanicCount = 10;
    } else {
      depth = 'FULL_RECOVERY';
      twitchCount = 4;
      t1 = 100;
      t2 = 100;
      t3 = 100;
      t4 = 100;
      tofRatio = 1.0;
      postTetanicCount = 15;
    }
  } else {
    // Non-depolarizing block kinetics
    if (effectiveMinutes < 20) {
      depth = 'COMPLETE_BLOCK';
      twitchCount = 0;
      postTetanicCount = 0;
    } else if (effectiveMinutes < 35) {
      depth = 'DEEP_BLOCK';
      twitchCount = 0;
      postTetanicCount = Math.min(8, Math.max(1, Math.round((effectiveMinutes - 20) * 0.5)));
    } else if (effectiveMinutes < 42) {
      depth = 'MODERATE_BLOCK';
      twitchCount = 1;
      t1 = 25;
      postTetanicCount = 10;
    } else if (effectiveMinutes < 50) {
      depth = 'MODERATE_BLOCK';
      twitchCount = 2;
      t1 = 45;
      t2 = 20;
      postTetanicCount = 12;
    } else if (effectiveMinutes < 58) {
      depth = 'MODERATE_BLOCK';
      twitchCount = 3;
      t1 = 65;
      t2 = 45;
      t3 = 25;
      postTetanicCount = 15;
    } else if (effectiveMinutes < 68) {
      depth = 'SHALLOW_BLOCK';
      twitchCount = 4;
      t1 = 80;
      t2 = 65;
      t3 = 50;
      t4 = 25;
      tofRatio = +(t4 / t1).toFixed(2);
      postTetanicCount = 15;
    } else if (effectiveMinutes < 82) {
      depth = 'MINIMAL_BLOCK';
      twitchCount = 4;
      t1 = 95;
      t2 = 90;
      t3 = 80;
      t4 = Math.min(85, Math.round(50 + (effectiveMinutes - 68) * 2.5));
      tofRatio = +(t4 / t1).toFixed(2);
      postTetanicCount = 15;
    } else {
      depth = 'FULL_RECOVERY';
      twitchCount = 4;
      t1 = 100;
      t2 = 100;
      t3 = 98;
      t4 = 94;
      tofRatio = +(t4 / t1).toFixed(2);
      postTetanicCount = 15;
    }
  }

  const safeForExtubation = depth === 'FULL_RECOVERY' && tofRatio >= 0.90;

  let residualParalysisRisk: TofMonitoringResult['residualParalysisRisk'] = 'NONE';
  if (depth === 'COMPLETE_BLOCK' || depth === 'DEEP_BLOCK') {
    residualParalysisRisk = 'SEVERE_AIRWAY_COLLAPSE';
  } else if (depth === 'MODERATE_BLOCK' || depth === 'SHALLOW_BLOCK') {
    residualParalysisRisk = 'SEVERE_AIRWAY_COLLAPSE';
  } else if (depth === 'MINIMAL_BLOCK') {
    residualParalysisRisk = 'MODERATE';
  }

  let mechanismNote = '';
  if (safeForExtubation) {
    mechanismNote = 'Quantitative TOF ratio >= 0.90 verified. Receptor occupancy < 70%. Safe for tracheal extubation.';
  } else if (depth === 'COMPLETE_BLOCK' || depth === 'DEEP_BLOCK') {
    mechanismNote = 'Receptor occupancy >= 95%. Zero twitches on TOF. Post-tetanic count guides depth. Neostigmine cannot reverse this depth.';
  } else if (depth === 'MODERATE_BLOCK') {
    mechanismNote = `Receptor occupancy 80-90%. TOF ${twitchCount}/4 twitches. Fade present due to pre-junctional nAChR blockade inhibiting ACh replenishment.`;
  } else {
    mechanismNote = `Shallow/Minimal block (TOFR ${tofRatio}). Cannot reliably detect fade by tactile or visual inspection; requires quantitative acceleromyography to prevent PORC.`;
  }

  return {
    twitchCount,
    twitchHeightsPercent: [t1, t2, t3, t4],
    tofRatio,
    postTetanicCount,
    depth,
    safeForExtubation,
    residualParalysisRisk,
    mechanismNote,
  };
}

/**
 * 2. Precision Reversal Protocol Solver (Sugammadex vs Neostigmine)
 */
export function formulateReversalPlan(
  patient: NeuromuscularPatientParameters,
  tofState: TofMonitoringResult,
  isImmediateEmergencyRescue: boolean = false
): ReversalRecommendation {
  const alerts: string[] = [];

  // Check agent compatibility
  const isSugammadexIneffective =
    patient.nmbaDrug === 'CISATRACURIUM' || patient.nmbaDrug === 'SUCCINYLCHOLINE';

  const isNeostigmineContraindicated =
    tofState.depth === 'COMPLETE_BLOCK' ||
    tofState.depth === 'DEEP_BLOCK' ||
    tofState.twitchCount < 2;

  let recommendedAgent: ReversalAgentType = 'SUGAMMADEX';
  let reversalDosePerKg = 0;
  let adjunctGlycopyrrolateMg = 0;
  let estimatedTimeToTof90Minutes = 2.0;

  if (isImmediateEmergencyRescue && (patient.nmbaDrug === 'ROCURONIUM' || patient.nmbaDrug === 'VECURONIUM')) {
    // "Cannot intubate, cannot oxygenate" (CICO) rescue dose
    recommendedAgent = 'SUGAMMADEX';
    reversalDosePerKg = 16.0;
    estimatedTimeToTof90Minutes = 1.5;
    alerts.push(
      'EMERGENCY RESCUE REVERSAL: 16 mg/kg Sugammadex administered for immediate CICO crisis following 1.2 mg/kg Rocuronium.'
    );
  } else if (!isSugammadexIneffective) {
    // Sugammadex available for aminosteroids
    recommendedAgent = 'SUGAMMADEX';
    if (tofState.depth === 'COMPLETE_BLOCK' || tofState.depth === 'DEEP_BLOCK') {
      reversalDosePerKg = 4.0; // Deep block (PTC 1-2)
      estimatedTimeToTof90Minutes = 3.0;
      alerts.push('Deep Block Reversal: 4.0 mg/kg Sugammadex required for PTC 1-2. Neostigmine is completely ineffective at this depth.');
    } else {
      reversalDosePerKg = 2.0; // Moderate block (reappearance of T2)
      estimatedTimeToTof90Minutes = 2.0;
    }
  } else if (patient.nmbaDrug === 'CISATRACURIUM') {
    // Cisatracurium cannot be encapsulated by Sugammadex -> Must use Neostigmine or wait
    recommendedAgent = 'NEOSTIGMINE_GLYCOPYRROLATE';
    alerts.push('Cisatracurium is a benzylisoquinolinium: SUGAMMADEX IS ENTIRELY INEFFECTIVE. Must use Neostigmine + Glycopyrrolate.');

    if (isNeostigmineContraindicated) {
      alerts.push(
        'WARNING: Neostigmine cannot be administered until at least 2 twitches on TOF return. High risk of paradoxical muscle weakness and prolonged paralysis.'
      );
      reversalDosePerKg = 0.05;
      estimatedTimeToTof90Minutes = 25.0;
    } else {
      reversalDosePerKg = 0.05; // 0.03 - 0.07 mg/kg
      adjunctGlycopyrrolateMg = +(patient.weightKg * 0.01).toFixed(2); // 0.2 mg glyco per 1 mg neostigmine (~0.01 mg/kg)
      estimatedTimeToTof90Minutes = 12.0;
    }
  } else {
    // Succinylcholine
    recommendedAgent = 'SPONTANEOUS_RECOVERY';
    reversalDosePerKg = 0;
    estimatedTimeToTof90Minutes = 5.0;
    alerts.push('Succinylcholine undergoes rapid spontaneous hydrolysis by plasma pseudocholinesterase (butyrylcholinesterase). Neither Sugammadex nor Neostigmine is indicated.');
  }

  const reversalDoseMg = +(reversalDosePerKg * patient.weightKg).toFixed(1);

  // Sugammadex and Hormonal Contraceptives Alert
  if (recommendedAgent === 'SUGAMMADEX') {
    alerts.push(
      'CONTRACEPTIVE WARNING: Sugammadex binds circulating progesterone. Advise women of childbearing potential on oral contraceptives to use an additional non-hormonal barrier method for 7 days.'
    );
  }

  return {
    recommendedAgent,
    reversalDoseMg,
    reversalDosePerKg,
    adjunctGlycopyrrolateMg,
    estimatedTimeToTof90Minutes,
    isSugammadexContraindicatedOrIneffective: isSugammadexIneffective,
    isNeostigmineContraindicated,
    clinicalSafetyAlerts: alerts,
  };
}
