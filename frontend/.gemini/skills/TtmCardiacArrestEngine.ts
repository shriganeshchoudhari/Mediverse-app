/**
 * TtmCardiacArrestEngine.ts
 * Targeted Temperature Management (TTM), Post-Cardiac Arrest Syndrome (PCAS),
 * Shivering Kinetics, Rewarming Electrolyte Shifts, and Multimodal Neuroprognostication.
 * Location: frontend/.gemini/skills/TtmCardiacArrestEngine.ts
 */

export type TtmProtocolTarget = 'TARGET_33C' | 'TARGET_36C' | 'NORMOTHERMIA_37C';

export type TtmPhase = 'INDUCTION' | 'MAINTENANCE' | 'CONTROLLED_REWARMING' | 'POST_REWARMING_NORMOTHERMIA';

export interface TtmPatientInput {
  targetProtocol: TtmProtocolTarget;
  currentCoreTempC: number; // e.g., 32.0 to 39.0 °C
  hoursPostRosc: number; // 0 to 96 hours
  shiveringScoreBsas: number; // Bedside Shivering Assessment Scale (0=none, 1=masseter, 2=shoulders/chest, 3=generalized)
  rewarmingRateCDegPerHour: number; // e.g., 0.10 to 0.60 °C/hr (safe: 0.15-0.25 °C/hr)
  // Multimodal Neuroprognostication Parameters (evaluated at >= 72h post-ROSC)
  pupillaryCornealReflexesBilateralAbsent: boolean; // Bilateral absence at >= 72h
  ssepN20BilateralAbsent: boolean; // Somatosensory Evoked Potential bilateral loss of N20
  eegSuppressionOrBurstSuppression: boolean; // Highly malignant EEG background
  serumNse48to72hUgL: number; // Neuron-Specific Enolase in µg/L (normal < 17; severe > 60 µg/L)
  ctGrayWhiteRatioGwr: number; // CT Gray-White Ratio (< 1.10 indicates severe cerebral edema)
  sedationClearedForAssessment: boolean;
}

export interface TtmClinicalMetrics {
  currentPhase: TtmPhase;
  cmro2ReductionPercent: number; // Cerebral metabolic rate reduction (~6-8% per °C drop)
  shiveringMetabolicSurgePercent: number; // Oxygen consumption surge from shivering (up to 300%)
  cardiacRateOutputModifier: {
    heartRateFactor: number; // Hypothermia induces protective bradycardia
    expectedOsbornJWave: boolean; // Common at < 33 °C
  };
  electrolyteRisk: {
    potassiumShiftTendency: 'INTRACELLULAR_HYPOKALEMIA' | 'REWARMING_HYPERKALEMIA_SURGE' | 'STABLE';
    warningMessage: string;
  };
  rewarmingSafetyAssessment: 'OPTIMAL_SLOW' | 'HAZARDOUS_RAPID_REWARMING';
  neuroprognostication: {
    isPrognosticationTimingValid: boolean; // Must be >= 72h post-ROSC with sedation cleared
    poorOutcomeProbabilityPercent: number; // Likelihood of CPC 3-5 (Cerebral Performance Category)
    concordantMalignantMarkersCount: number;
    prognosticationVerdict: 'INSUFFICIENT_DATA_EARLY' | 'FAVORABLE_RECOVERY_POTENTIAL' | 'INDETERMINATE' | 'HIGH_LIKELIHOOD_POOR_NEUROLOGICAL_OUTCOME';
  };
  clinicalActionChecklist: string[];
  diagnosticSummary: string;
}

export const TTM_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: TtmPatientInput;
}[] = [
  {
    id: 'ttm-33-maintenance-shivering',
    name: 'TTM-33°C Maintenance with Active Shivering',
    badge: 'Counter-Warming & Sedation Alert',
    description: 'A 58-year-old post-VF arrest patient maintained at 33.0°C at 12 hours post-ROSC. Bedside Shivering Score is 2 (pectoral tremors), increasing VO2 and risking secondary ischemic injury. Requires surface counter-warming and escalated anti-shivering protocol.',
    input: {
      targetProtocol: 'TARGET_33C',
      currentCoreTempC: 33.0,
      hoursPostRosc: 12,
      shiveringScoreBsas: 2,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 22,
      ctGrayWhiteRatioGwr: 1.25,
      sedationClearedForAssessment: false,
    },
  },
  {
    id: 'rapid-hazardous-rewarming',
    name: 'Hazardous Rapid Rewarming (Vasodilatory Shock & Hyperkalemia)',
    badge: 'Rewarming Rate Alert (> 0.25°C/h)',
    description: 'Rewarming phase at 32 hours post-ROSC occurring too rapidly (0.50°C/hr). Triggers massive peripheral vasodilation, rebound cerebral hyperthermia, and dangerous potassium efflux from intracellular stores.',
    input: {
      targetProtocol: 'TARGET_33C',
      currentCoreTempC: 35.2,
      hoursPostRosc: 32,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.50,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 28,
      ctGrayWhiteRatioGwr: 1.20,
      sedationClearedForAssessment: false,
    },
  },
  {
    id: 'multimodal-poor-outcome-72h',
    name: 'Day 3 Multimodal Neuroprognostication (Devastating Injury)',
    badge: 'Bilateral Absent N20 & GWR < 1.10',
    description: 'At 76 hours post-ROSC with sedation held, patient has absent pupillary/corneal reflexes, bilateral loss of N20 cortical SSEP, burst-suppression EEG, and high NSE (85 µg/L). Meets strict multimodal criteria for poor neurological outcome (CPC 4-5).',
    input: {
      targetProtocol: 'TARGET_36C',
      currentCoreTempC: 37.0,
      hoursPostRosc: 76,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: true,
      ssepN20BilateralAbsent: true,
      eegSuppressionOrBurstSuppression: true,
      serumNse48to72hUgL: 85,
      ctGrayWhiteRatioGwr: 1.06,
      sedationClearedForAssessment: true,
    },
  },
  {
    id: 'favorable-recovery-awakening',
    name: 'Day 3 Favorable Neurological Recovery (Preserved SSEP & Brainstem)',
    badge: 'Good Recovery Potential',
    description: 'At 72 hours post-ROSC following TTM-36°C, sedation is cleared. Patient exhibits intact brainstem reflexes, normal cortical N20 SSEP, reactive continuous EEG, and low NSE (15 µg/L). High probability of functional recovery (CPC 1-2).',
    input: {
      targetProtocol: 'TARGET_36C',
      currentCoreTempC: 36.8,
      hoursPostRosc: 74,
      shiveringScoreBsas: 0,
      rewarmingRateCDegPerHour: 0.20,
      pupillaryCornealReflexesBilateralAbsent: false,
      ssepN20BilateralAbsent: false,
      eegSuppressionOrBurstSuppression: false,
      serumNse48to72hUgL: 15,
      ctGrayWhiteRatioGwr: 1.28,
      sedationClearedForAssessment: true,
    },
  },
];

/**
 * Computes TTM Phase, Shivering Surge, Metabolic Reduction & Multimodal Neuroprognostication
 */
export function evaluateTtmCase(input: TtmPatientInput): TtmClinicalMetrics {
  const {
    targetProtocol,
    currentCoreTempC,
    hoursPostRosc,
    shiveringScoreBsas,
    rewarmingRateCDegPerHour,
    pupillaryCornealReflexesBilateralAbsent,
    ssepN20BilateralAbsent,
    eegSuppressionOrBurstSuppression,
    serumNse48to72hUgL,
    ctGrayWhiteRatioGwr,
    sedationClearedForAssessment,
  } = input;

  // 1. Phase Determination
  let phase: TtmPhase = 'INDUCTION';
  if (hoursPostRosc < 4) {
    phase = 'INDUCTION';
  } else if (hoursPostRosc <= 28) {
    phase = 'MAINTENANCE';
  } else if (hoursPostRosc <= 44) {
    phase = 'CONTROLLED_REWARMING';
  } else {
    phase = 'POST_REWARMING_NORMOTHERMIA';
  }

  // 2. CMRO2 & Metabolic Reduction (~7% per °C drop below 37.0 °C)
  const degreesBelowNormal = Math.max(0, 37.0 - currentCoreTempC);
  const cmro2Reduction = Math.round(degreesBelowNormal * 7.0 * 10) / 10;

  // 3. Shivering Oxygen Surge
  // BSAS: 0=none, 1=masseter (+50%), 2=shoulders/arms (+120%), 3=generalized (+250-300%)
  let shiveringSurge = 0;
  if (shiveringScoreBsas === 1) shiveringSurge = 50;
  else if (shiveringScoreBsas === 2) shiveringSurge = 120;
  else if (shiveringScoreBsas === 3) shiveringSurge = 280;

  // 4. Cardiovascular & Osborn Wave
  // Heart rate slows by ~10-12 bpm per °C cooling
  const hrFactor = Math.max(0.6, Math.round((1 - degreesBelowNormal * 0.08) * 100) / 100);
  const osbornJ = currentCoreTempC < 33.0;

  // 5. Electrolyte Shift Risk
  let kTendency: TtmClinicalMetrics['electrolyteRisk']['potassiumShiftTendency'] = 'STABLE';
  let kWarning = 'Potassium shifts stable.';

  if (phase === 'INDUCTION' || (phase === 'MAINTENANCE' && currentCoreTempC < 35.0)) {
    kTendency = 'INTRACELLULAR_HYPOKALEMIA';
    kWarning = 'Cooling causes potassium shift into cells. Maintain K+ ~3.5-4.0 mEq/L, but avoid over-supplementation.';
  } else if (phase === 'CONTROLLED_REWARMING') {
    kTendency = 'REWARMING_HYPERKALEMIA_SURGE';
    kWarning = 'Rewarming shifts potassium back out of cells. Discontinue potassium infusions prior to initiating rewarming to prevent lethal rebound hyperkalemia!';
  }

  // 6. Rewarming Safety (target 0.15 - 0.25 °C/hr, max 0.3 °C/hr)
  let rewarmSafety: TtmClinicalMetrics['rewarmingSafetyAssessment'] = 'OPTIMAL_SLOW';
  if (phase === 'CONTROLLED_REWARMING' && rewarmingRateCDegPerHour > 0.25) {
    rewarmSafety = 'HAZARDOUS_RAPID_REWARMING';
  }

  // 7. Multimodal Neuroprognostication at >= 72h
  const isTimingValid = hoursPostRosc >= 72 && sedationClearedForAssessment;

  let poorOutcomeProb = 10;
  let malignantMarkers = 0;

  if (pupillaryCornealReflexesBilateralAbsent) malignantMarkers += 2;
  if (ssepN20BilateralAbsent) malignantMarkers += 2;
  if (eegSuppressionOrBurstSuppression) malignantMarkers += 1;
  if (serumNse48to72hUgL > 60) malignantMarkers += 1;
  if (ctGrayWhiteRatioGwr < 1.10) malignantMarkers += 1;

  let verdict: TtmClinicalMetrics['neuroprognostication']['prognosticationVerdict'] = 'INSUFFICIENT_DATA_EARLY';

  if (!isTimingValid) {
    verdict = 'INSUFFICIENT_DATA_EARLY';
    poorOutcomeProb = 30; // Indeterminate early
  } else {
    if (malignantMarkers >= 2) {
      verdict = 'HIGH_LIKELIHOOD_POOR_NEUROLOGICAL_OUTCOME';
      poorOutcomeProb = Math.min(99, 85 + malignantMarkers * 3);
    } else if (malignantMarkers === 1) {
      verdict = 'INDETERMINATE';
      poorOutcomeProb = 45;
    } else {
      verdict = 'FAVORABLE_RECOVERY_POTENTIAL';
      poorOutcomeProb = 12;
    }
  }

  // 8. Clinical Action Checklist & Alerts
  const actions: string[] = [];

  if (shiveringScoreBsas >= 1) {
    actions.push(`SHIVERING ALERT (BSAS ${shiveringScoreBsas}): Surges metabolic rate by +${shiveringSurge}%. Implement anti-shivering bundle: surface counter-warming of hands/feet, IV Magnesium Sulfate (goal 3-4 mg/dL), acetaminophen, buspirone, and dexmedetomidine. Reserve paralytics if refractory.`);
  }

  if (rewarmSafety === 'HAZARDOUS_RAPID_REWARMING') {
    actions.push(`RAPID REWARMING WARNING (${rewarmingRateCDegPerHour} °C/hr): Exceeds safe limit (0.15-0.25 °C/hr). Rapid rewarming triggers massive vasodilation, refractory shock, hyperkalemia, and rebound cerebral edema.`);
  }

  if (osbornJ) {
    actions.push(`ECG ALERT: Core temperature ${currentCoreTempC} °C is below 33.0 °C. Typical Osborn (J) waves and sinus bradycardia are expected physiologic responses.`);
  }

  if (phase === 'POST_REWARMING_NORMOTHERMIA') {
    actions.push('STRICT NORMOTHERMIA: Maintain core temperature strictly <= 37.5 °C for 72 hours post-ROSC. Fever markedly worsens secondary anoxic brain injury.');
  }

  if (isTimingValid) {
    if (verdict === 'HIGH_LIKELIHOOD_POOR_NEUROLOGICAL_OUTCOME') {
      actions.push(`MULTIMODAL NEUROPROGNOSTICATION: Multiple robust markers of devastating hypoxic-ischemic brain injury (FPR < 1% for absent SSEP/PLR). Discuss goals of care with surrogate decision makers.`);
    } else if (verdict === 'FAVORABLE_RECOVERY_POTENTIAL') {
      actions.push('NEUROPROGNOSTICATION: Preserved cortical SSEPs and brainstem reflexes indicate favorable neurological recovery potential. Continue neuro-intensive supportive care.');
    }
  } else if (hoursPostRosc < 72) {
    actions.push('PROGNOSTICATION TIMING: Premature neuroprognostication before 72 hours post-ROSC or prior to drug clearance is prone to grave false-positive errors.');
  }

  let summary = '';
  if (phase === 'MAINTENANCE') {
    summary = `TTM maintenance phase at ${currentCoreTempC} °C (${targetProtocol}). CMRO2 reduced by ${cmro2Reduction}%. Shivering BSAS is ${shiveringScoreBsas} (+${shiveringSurge}% VO2 surge).`;
  } else if (phase === 'CONTROLLED_REWARMING') {
    summary = `Controlled rewarming phase (${rewarmingRateCDegPerHour} °C/hr). Safety: ${rewarmSafety.replace(/_/g, ' ')}. ${kWarning}`;
  } else if (isTimingValid) {
    summary = `Multimodal neuroprognostication at ${hoursPostRosc}h: ${verdict.replace(/_/g, ' ')} (${malignantMarkers} concordant malignant criteria).`;
  } else {
    summary = `Post-cardiac arrest TTM in progress (${hoursPostRosc}h post-ROSC, temp ${currentCoreTempC} °C). Phase: ${phase.replace(/_/g, ' ')}.`;
  }

  return {
    currentPhase: phase,
    cmro2ReductionPercent: cmro2Reduction,
    shiveringMetabolicSurgePercent: shiveringSurge,
    cardiacRateOutputModifier: {
      heartRateFactor: hrFactor,
      expectedOsbornJWave: osbornJ,
    },
    electrolyteRisk: {
      potassiumShiftTendency: kTendency,
      warningMessage: kWarning,
    },
    rewarmingSafetyAssessment: rewarmSafety,
    neuroprognostication: {
      isPrognosticationTimingValid: isTimingValid,
      poorOutcomeProbabilityPercent: poorOutcomeProb,
      concordantMalignantMarkersCount: malignantMarkers,
      prognosticationVerdict: verdict,
    },
    clinicalActionChecklist: actions,
    diagnosticSummary: summary,
  };
}
