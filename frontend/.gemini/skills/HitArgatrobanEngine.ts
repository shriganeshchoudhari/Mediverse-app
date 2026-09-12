/**
 * HitArgatrobanEngine.ts
 *
 * Comprehensive Biophysical & Clinical Engine for Heparin-Induced Thrombocytopenia (HIT):
 * - Warkentin 4Ts Clinical Probability Scoring (Thrombocytopenia, Timing, Thrombosis, oTher causes)
 * - Anti-PF4/Heparin Optical Density (OD) & Functional Serotonin Release Assay (SRA) Likelihood Mechanics
 * - Direct Thrombin Inhibitor (DTI) Precision Titration: Argatroban (Hepatic) vs Bivalirudin (Renal)
 * - Critical "Never Events" & Safety Interlocks (Platelet Transfusion Prohibition, Warfarin Gangrene Safeguard)
 *
 * Location: frontend/.gemini/skills/HitArgatrobanEngine.ts
 */

export type HitProbabilityCategory = 'LOW_PROBABILITY' | 'INTERMEDIATE_PROBABILITY' | 'HIGH_PROBABILITY';

export type PlateletDropCategory =
  | 'DROP_GT_50_NADIR_GE_20' // 2 points: >50% fall and nadir >= 20k
  | 'DROP_30_50_OR_NADIR_10_19' // 1 point: 30-50% fall or nadir 10-19k
  | 'DROP_LT_30_OR_NADIR_LT_10'; // 0 points: <30% fall or nadir < 10k

export type TimingCategory =
  | 'DAY_5_TO_10_OR_RAPID_WITHIN_30D' // 2 points: Day 5-10 or <=1 day with heparin in last 30d
  | 'DAY_GT_10_OR_UNCLEAR_OR_RAPID_31_100D' // 1 point: Day >10, unclear timing, or rapid with heparin 31-100d
  | 'FALL_LT_DAY_4_NO_RECENT_HEPARIN'; // 0 points: Fall <4 days without recent heparin in 100d

export type ThrombosisCategory =
  | 'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION' // 2 points: New thrombosis, skin necrosis, or systemic reaction
  | 'PROGRESSIVE_RECURRENT_OR_SUSPECTED' // 1 point: Progressive/recurrent thrombosis, erythema
  | 'NONE'; // 0 points: None

export type OtherCausesCategory =
  | 'NONE_EVIDENT' // 2 points: No other cause evident
  | 'POSSIBLE_ALTERNATIVE_PRESENT' // 1 point: Possible alternative cause present
  | 'DEFINITE_ALTERNATIVE_PRESENT'; // 0 points: Definite alternative cause present (sepsis/DIC/CPB)

export type DtiAgent = 'ARGATROBAN' | 'BIVALIRUDIN' | 'FONDAPARINUX' | 'DOAC';

export interface HitPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  baselinePlatelets10e9L: number; // e.g. 240 (x 10^9/L or /uL / 1000)
  currentPlatelets10e9L: number; // e.g. 85
  daysSinceHeparinExposure: number; // e.g. 7 days
  hadHeparinInPast30Days: boolean;
  hadHeparinInPast31To100Days: boolean;
  plateletDropCategory: PlateletDropCategory;
  timingCategory: TimingCategory;
  thrombosisCategory: ThrombosisCategory;
  otherCausesCategory: OtherCausesCategory;
  // Lab Tests
  antiPf4ElisaOpticalDensity?: number; // OD cutoff 0.40
  isSraPositiveLowHeparin?: boolean; // SRA >= 50% release at 0.1-0.3 U/mL
  isSraInhibitedHighHeparin?: boolean; // SRA < 20% release at 100 U/mL (antigen excess)
  // Organ Function for DTI Selection
  serumTotalBilirubinMgDl: number; // Normal < 1.2
  hasSevereHepaticImpairmentOrShock: boolean;
  creatinineClearanceMlMin: number; // e.g. 75
  baselineApttSeconds: number; // Normal ~28-35 s
  currentApttSeconds: number;
  // Active Management States
  activeAnticoagulant: DtiAgent;
  currentDtiDose: number; // Argatroban in mcg/kg/min, Bivalirudin in mg/kg/h
  isPlateletTransfusionGiven: boolean;
  isWarfarinActiveInAcutePhase: boolean;
}

export interface FourTsScoreResult {
  thrombocytopeniaPoints: number;
  timingPoints: number;
  thrombosisPoints: number;
  otherCausesPoints: number;
  totalScore: number; // 0 to 8
  probabilityCategory: HitProbabilityCategory;
  estimatedHitPrevalencePercent: number; // Low: <1%, Int: 10-14%, High: ~50-64%
  clinicalRecommendation: string;
}

export interface HitSerologyEvaluation {
  elisaResult: 'NEGATIVE' | 'WEAK_POSITIVE' | 'MODERATE_POSITIVE' | 'STRONG_POSITIVE' | 'NOT_TESTED';
  elisaInterpretation: string;
  sraResult: 'CONFIRMED_HIT' | 'NEGATIVE' | 'ATYPICAL' | 'PENDING_OR_NOT_ORDERED';
  sraInterpretation: string;
}

export interface DtiDosingPlan {
  selectedAgent: DtiAgent;
  initialRecommendedDose: number;
  doseUnit: string;
  targetApttRangeSeconds: string; // e.g. "45 - 75 s" (1.5 - 3x baseline)
  metabolicClearancePathway: string;
  doseAdjustmentGuidance: string;
  warfarinTransitionSafeguards: string[];
}

export interface HitComprehensiveOutput {
  fourTs: FourTsScoreResult;
  serology: HitSerologyEvaluation;
  dtiPlan: DtiDosingPlan;
  safetyInterlocks: string[];
  immediateActionChecklist: string[];
  clinicalPearls: string[];
}

/**
 * Compute Warkentin 4Ts Score for Heparin-Induced Thrombocytopenia.
 */
export function calculate4TsScore(
  thrombocytopenia: PlateletDropCategory,
  timing: TimingCategory,
  thrombosis: ThrombosisCategory,
  otherCauses: OtherCausesCategory
): FourTsScoreResult {
  let thrombocytopeniaPoints = 0;
  if (thrombocytopenia === 'DROP_GT_50_NADIR_GE_20') thrombocytopeniaPoints = 2;
  else if (thrombocytopenia === 'DROP_30_50_OR_NADIR_10_19') thrombocytopeniaPoints = 1;
  else thrombocytopeniaPoints = 0;

  let timingPoints = 0;
  if (timing === 'DAY_5_TO_10_OR_RAPID_WITHIN_30D') timingPoints = 2;
  else if (timing === 'DAY_GT_10_OR_UNCLEAR_OR_RAPID_31_100D') timingPoints = 1;
  else timingPoints = 0;

  let thrombosisPoints = 0;
  if (thrombosis === 'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION') thrombosisPoints = 2;
  else if (thrombosis === 'PROGRESSIVE_RECURRENT_OR_SUSPECTED') thrombosisPoints = 1;
  else thrombosisPoints = 0;

  let otherCausesPoints = 0;
  if (otherCauses === 'NONE_EVIDENT') otherCausesPoints = 2;
  else if (otherCauses === 'POSSIBLE_ALTERNATIVE_PRESENT') otherCausesPoints = 1;
  else otherCausesPoints = 0;

  const totalScore = thrombocytopeniaPoints + timingPoints + thrombosisPoints + otherCausesPoints;

  let probabilityCategory: HitProbabilityCategory;
  let estimatedPrevalence: number;
  let recommendation: string;

  if (totalScore <= 3) {
    probabilityCategory = 'LOW_PROBABILITY';
    estimatedPrevalence = 0.8; // < 1%
    recommendation =
      'Low Probability (Score 0-3): Negative predictive value exceeds 99%. Discontinuation of heparin is generally NOT required, and laboratory testing for HIT antibodies is NOT recommended unless high index of clinical suspicion.';
  } else if (totalScore <= 5) {
    probabilityCategory = 'INTERMEDIATE_PROBABILITY';
    estimatedPrevalence = 12.0; // ~10-14%
    recommendation =
      'Intermediate Probability (Score 4-5): ~10-14% risk of true HIT. Immediately cease ALL heparin products (including heparin flushes and heparin-coated catheters). Order anti-PF4/heparin immunoassay and initiate non-heparin therapeutic anticoagulation.';
  } else {
    probabilityCategory = 'HIGH_PROBABILITY';
    estimatedPrevalence = 58.0; // ~50-64%
    recommendation =
      'High Probability (Score 6-8): High risk of life- and limb-threatening thrombosis (~50%). Immediately stop ALL heparin products. Promptly initiate therapeutic non-heparin anticoagulation (Argatroban or Bivalirudin). Order anti-PF4 immunoassay and confirm with functional Serotonin Release Assay (SRA).';
  }

  return {
    thrombocytopeniaPoints,
    timingPoints,
    thrombosisPoints,
    otherCausesPoints,
    totalScore,
    probabilityCategory,
    estimatedHitPrevalencePercent: estimatedPrevalence,
    clinicalRecommendation: recommendation,
  };
}

/**
 * Evaluate Serological and Functional HIT Laboratory Tests.
 */
export function evaluateHitSerology(
  opticalDensity?: number,
  isSraLowHeparin?: boolean,
  isSraInhibitedHighHeparin?: boolean
): HitSerologyEvaluation {
  let elisaResult: HitSerologyEvaluation['elisaResult'] = 'NOT_TESTED';
  let elisaInterpretation = 'Anti-PF4/heparin ELISA has not been documented.';

  if (opticalDensity !== undefined) {
    if (opticalDensity < 0.4) {
      elisaResult = 'NEGATIVE';
      elisaInterpretation =
        `ELISA Negative (OD ${opticalDensity.toFixed(2)} < 0.40): Excludes HIT with >99% negative predictive value. Alternative causes for thrombocytopenia should be pursued.`;
    } else if (opticalDensity < 1.0) {
      elisaResult = 'WEAK_POSITIVE';
      elisaInterpretation =
        `Weakly Positive ELISA (OD ${opticalDensity.toFixed(2)}, range 0.40 - 0.99): Low-to-moderate specificity (~50%). May represent non-pathogenic antibodies commonly seen post-cardiac surgery. Functional platelet activation assay (SRA) is required.`;
    } else if (opticalDensity < 2.0) {
      elisaResult = 'MODERATE_POSITIVE';
      elisaInterpretation =
        `Moderately Positive ELISA (OD ${opticalDensity.toFixed(2)}, range 1.00 - 1.99): High probability of pathogenic anti-PF4/heparin antibodies. Confirm with functional SRA while maintaining non-heparin anticoagulation.`;
    } else {
      elisaResult = 'STRONG_POSITIVE';
      elisaInterpretation =
        `Strongly Positive ELISA (OD ${opticalDensity.toFixed(2)} >= 2.00): Strongly predictive (>95% correlation) of platelet-activating antibodies. Diagnostic of HIT in an appropriate clinical context.`;
    }
  }

  let sraResult: HitSerologyEvaluation['sraResult'] = 'PENDING_OR_NOT_ORDERED';
  let sraInterpretation = 'Serotonin Release Assay (SRA) pending or not ordered.';

  if (isSraLowHeparin !== undefined && isSraInhibitedHighHeparin !== undefined) {
    if (isSraLowHeparin && isSraInhibitedHighHeparin) {
      sraResult = 'CONFIRMED_HIT';
      sraInterpretation =
        'Definitive Gold-Standard HIT Confirmed: >=50% serotonin release at low heparin (0.1-0.3 U/mL) with complete inhibition (<20%) at supratherapeutic heparin (100 U/mL) due to antigen excess displacing antibodies.';
    } else if (!isSraLowHeparin) {
      sraResult = 'NEGATIVE';
      sraInterpretation =
        'SRA Negative: Absent platelet activation at therapeutic heparin concentrations. Pathogenic platelet-activating antibodies not detected.';
    } else {
      sraResult = 'ATYPICAL';
      sraInterpretation =
        'Atypical SRA Pattern: Persistent serotonin release at high heparin (100 U/mL) suggests autoimmune HIT (aHIT) or heparin-independent platelet activating antibodies.';
    }
  }

  return {
    elisaResult,
    elisaInterpretation,
    sraResult,
    sraInterpretation,
  };
}

/**
 * Compute Direct Thrombin Inhibitor (DTI) Regimen & Organ-Adjusted Dosing.
 */
export function calculateDtiDosing(
  agent: DtiAgent,
  bilirubinMgDl: number,
  hasSevereHepaticImpairment: boolean,
  crClMlMin: number,
  baselineApttSeconds: number
): DtiDosingPlan {
  const baseAptt = Math.max(25, baselineApttSeconds);
  const targetLower = Math.round(baseAptt * 1.5);
  const targetUpper = Math.round(baseAptt * 3.0);
  const targetRangeStr = `${targetLower} - ${targetUpper} s (1.5 - 3.0× baseline)`;

  let initialDose = 2.0;
  let doseUnit = 'mcg/kg/min';
  let clearance = 'Hepatic metabolism (98%) / biliary excretion. Preferred in renal failure and ESRD.';
  let adjustment = '';

  const warfarinSafeguards = [
    'CRITICAL: Warfarin is ABSOLUTELY CONTRAINDICATED during acute HIT. Premature initiation causes acute microvascular thrombosis, skin necrosis, and Venous Limb Gangrene due to rapid Protein C depletion.',
    'If Warfarin was already administered when HIT was suspected, IMMEDIATELY administer IV Vitamin K (10 mg) to restore Protein C levels.',
    'Defer Warfarin transition until platelet count has fully recovered (>= 150 x 10^9/L).',
    'When transitioning, co-administer Argatroban + Warfarin for a minimum of 5 days AND until the target INR is achieved for at least 2 consecutive days.',
    'Argatroban artifactually prolongs the PT/INR! When co-infusing at 2 mcg/kg/min, target an INR > 4.0 before stopping Argatroban, then recheck INR 4-6 hours post-cessation (or use chromogenic Factor X assay).',
  ];

  if (agent === 'ARGATROBAN') {
    doseUnit = 'mcg/kg/min';
    clearance = 'Hepatic (fecal/biliary). Unaffected by renal failure or hemodialysis.';
    if (hasSevereHepaticImpairment || bilirubinMgDl > 1.5) {
      initialDose = 0.5;
      adjustment =
        `Hepatic Impairment / Critical Illness (Bilirubin ${bilirubinMgDl} mg/dL): Initial dose reduced by 75% to 0.5 mcg/kg/min (or 0.25 mcg/kg/min in multiorgan failure) to prevent catastrophic drug accumulation.`;
    } else {
      initialDose = 2.0;
      adjustment =
        'Standard Adult Regimen: 2.0 mcg/kg/min continuous IV infusion. Check aPTT at 2 hours and titrate in increments of 0.25-0.5 mcg/kg/min to target.';
    }
  } else if (agent === 'BIVALIRUDIN') {
    doseUnit = 'mg/kg/h';
    clearance = 'Enzymatic cleavage (80%) + Renal elimination (20%). Preferred in cardiac surgery/PCI or combined hepatic failure.';
    if (crClMlMin < 30) {
      initialDose = 0.05;
      adjustment =
        `Severe Renal Impairment (CrCl ${crClMlMin} mL/min): Dose reduced to 0.05 mg/kg/h to avoid accumulation. In ESRD/dialysis, start at 0.03-0.05 mg/kg/h.`;
    } else if (crClMlMin < 60) {
      initialDose = 0.10;
      adjustment = `Moderate Renal Impairment (CrCl ${crClMlMin} mL/min): Dose reduced to 0.10 mg/kg/h.`;
    } else {
      initialDose = 0.15;
      adjustment = 'Standard Adult Regimen: 0.15 - 0.20 mg/kg/h continuous IV infusion, titrated to aPTT 1.5 - 2.5× baseline.';
    }
  } else if (agent === 'FONDAPARINUX') {
    doseUnit = 'mg SC daily';
    clearance = '100% Renal. Strictly contraindicated if CrCl < 30 mL/min.';
    initialDose = 7.5; // 5 mg for <50kg, 7.5 for 50-100kg, 10 for >100kg
    adjustment = 'Off-label alternative for hemodynamically stable, non-critically ill patients without severe renal impairment.';
  } else {
    // DOAC
    doseUnit = 'mg PO BID';
    clearance = 'Hepatic / Renal. Rivaroxaban 15 mg BID or Apixaban 5-10 mg BID.';
    initialDose = 15;
    adjustment = 'First-line oral option for outpatient transition once acute thrombosis stabilizes and patient can tolerate oral intake.';
  }

  return {
    selectedAgent: agent,
    initialRecommendedDose: initialDose,
    doseUnit,
    targetApttRangeSeconds: targetRangeStr,
    metabolicClearancePathway: clearance,
    doseAdjustmentGuidance: adjustment,
    warfarinTransitionSafeguards: warfarinSafeguards,
  };
}

/**
 * Comprehensive Heparin-Induced Thrombocytopenia Evaluation.
 */
export function performHitEvaluation(input: HitPatientInput): HitComprehensiveOutput {
  const fourTs = calculate4TsScore(
    input.plateletDropCategory,
    input.timingCategory,
    input.thrombosisCategory,
    input.otherCausesCategory
  );

  const serology = evaluateHitSerology(
    input.antiPf4ElisaOpticalDensity,
    input.isSraPositiveLowHeparin,
    input.isSraInhibitedHighHeparin
  );

  const dtiPlan = calculateDtiDosing(
    input.activeAnticoagulant,
    input.serumTotalBilirubinMgDl,
    input.hasSevereHepaticImpairmentOrShock,
    input.creatinineClearanceMlMin,
    input.baselineApttSeconds
  );

  const safetyInterlocks: string[] = [];

  if (input.isPlateletTransfusionGiven) {
    safetyInterlocks.push(
      'CRITICAL DANGER (Platelet Transfusion Administered): Platelet transfusions in active HIT are like "fuel on fire"—platelets release PF4, binding antibody and triggering catastrophic arterial/venous thrombosis and acute limb loss. Discontinue transfusions immediately.'
    );
  }

  if (input.isWarfarinActiveInAcutePhase) {
    safetyInterlocks.push(
      'CRITICAL WARNING (Active Warfarin during Acute Thrombocytopenia): Rapid depletion of Protein C precedes Factor II/X inhibition, precipitating acute microvascular thrombosis and Venous Limb Gangrene. Immediately administer IV Vitamin K (10 mg) to reverse warfarin.'
    );
  }

  if (input.activeAnticoagulant === 'ARGATROBAN' && input.serumTotalBilirubinMgDl > 1.5 && input.currentDtiDose > 0.75) {
    safetyInterlocks.push(
      `ARGATROBAN OVERDOSE RISK: Patient has elevated Bilirubin (${input.serumTotalBilirubinMgDl} mg/dL) while receiving ${input.currentDtiDose} mcg/kg/min. Recommended starting dose in hepatic dysfunction is 0.5 mcg/kg/min.`
    );
  }

  if (input.activeAnticoagulant === 'BIVALIRUDIN' && input.creatinineClearanceMlMin < 30 && input.currentDtiDose > 0.08) {
    safetyInterlocks.push(
      `BIVALIRUDIN ACCUMULATION RISK: Severe renal impairment (CrCl ${input.creatinineClearanceMlMin} mL/min) with current dose ${input.currentDtiDose} mg/kg/h exceeds safe clearance threshold (0.05 mg/kg/h).`
    );
  }

  const immediateActions: string[] = [
    `4Ts Probability Stratification: Score ${fourTs.totalScore}/8 (${fourTs.probabilityCategory.replace('_', ' ')}). Estimated HIT Prevalence: ~${fourTs.estimatedHitPrevalencePercent}%.`,
  ];

  if (fourTs.totalScore >= 4) {
    immediateActions.push('STOP ALL HEPARIN IMMEDIATELY: Discontinue all UFH, LMWH, heparin line flushes, and remove/replace heparin-bonded catheters.');
    immediateActions.push(`Initiate therapeutic non-heparin anticoagulation with ${dtiPlan.selectedAgent} (initial target dose: ${dtiPlan.initialRecommendedDose} ${dtiPlan.doseUnit}).`);
    immediateActions.push(`Monitor aPTT every 2-4 hours until therapeutic target (${dtiPlan.targetApttRangeSeconds}) is achieved.`);
    immediateActions.push('Screen for Bilateral Lower Extremity DVT with duplex ultrasound, even in the absence of clinical symptoms (silent DVT occurs in up to 50% of HIT patients).');
  } else {
    immediateActions.push('Heparin continuation is generally safe. Investigate alternative causes of acute thrombocytopenia (sepsis, medication-induced, hemodilution).');
  }

  const clinicalPearls: string[] = [
    'The 4Ts Score Rule: A score of 0 to 3 carries a >99% Negative Predictive Value. Unnecessary DTI therapy carries a 1-2% major bleeding risk per day, so do not reflexively order anti-PF4 ELISA in low-probability patients.',
    'Timing Exception (Rapid-Onset HIT): While classical HIT manifests 5 to 10 days after heparin exposure, patients with heparin exposure in the prior 30 days retain circulating anti-PF4 antibodies and can drop platelets within hours of re-exposure.',
    'Argatroban vs Bivalirudin Organ Cleaving: Argatroban is cleared entirely by the liver (ideal in renal failure/ESRD; reduce dose by 75% in hepatic impairment). Bivalirudin is cleared 80% enzymatically and 20% renally (ideal in hepatic failure or post-cardiac surgery).',
    'The Warfarin Gangrene Trap: Warfarin monotherapy or premature loading in acute HIT produces a paradoxical hypercoagulable state due to rapid Protein C depletion, causing microvascular thrombosis and Venous Limb Gangrene requiring amputation.',
    'Functional SRA Gold Standard: ELISA detects both non-pathogenic and pathogenic antibodies. The Serotonin Release Assay (SRA) measures true platelet activation, confirmed when high-dose heparin (100 U/mL) suppresses serotonin release below 20% due to antigen excess.'
  ];

  return {
    fourTs,
    serology,
    dtiPlan,
    safetyInterlocks,
    immediateActionChecklist: immediateActions,
    clinicalPearls,
  };
}

export interface HitPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: HitPatientInput;
}

export const HIT_PRESETS: HitPreset[] = [
  {
    id: 'CLASSICAL_POSTOP_HIT_DVT',
    name: 'Classic Day 7 Post-Op HIT with Acute DVT (4Ts = 7, High Probability)',
    badge: '4Ts = 7 • High Risk • DVT',
    description: '64 yo female day 7 status-post total knee arthroplasty on enoxaparin prophylaxis. Platelets dropped from 260 to 72 x 10^9/L (>70% drop). Developed tender left calf edema with duplex-confirmed DVT. No alternative etiology.',
    inputs: {
      patientAgeYears: 64,
      patientWeightKg: 74,
      baselinePlatelets10e9L: 260,
      currentPlatelets10e9L: 72,
      daysSinceHeparinExposure: 7,
      hadHeparinInPast30Days: false,
      hadHeparinInPast31To100Days: false,
      plateletDropCategory: 'DROP_GT_50_NADIR_GE_20',
      timingCategory: 'DAY_5_TO_10_OR_RAPID_WITHIN_30D',
      thrombosisCategory: 'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION',
      otherCausesCategory: 'NONE_EVIDENT',
      antiPf4ElisaOpticalDensity: 2.34,
      isSraPositiveLowHeparin: true,
      isSraInhibitedHighHeparin: true,
      serumTotalBilirubinMgDl: 0.8,
      hasSevereHepaticImpairmentOrShock: false,
      creatinineClearanceMlMin: 68,
      baselineApttSeconds: 30,
      currentApttSeconds: 32,
      activeAnticoagulant: 'ARGATROBAN',
      currentDtiDose: 2.0,
      isPlateletTransfusionGiven: false,
      isWarfarinActiveInAcutePhase: false,
    },
  },
  {
    id: 'RAPID_ONSET_HIT_CARDIAC',
    name: 'Rapid-Onset HIT with Recent Heparin Exposure (4Ts = 8, Extreme Risk)',
    badge: '4Ts = 8 • Rapid Onset • SRA +',
    description: '70 yo male re-admitted for unstable angina after CABG 18 days ago. Heparin bolus administered; within 14 hours platelets plummeted from 210 to 45 x 10^9/L. Acute systemic chills/tachycardia post-bolus.',
    inputs: {
      patientAgeYears: 70,
      patientWeightKg: 82,
      baselinePlatelets10e9L: 210,
      currentPlatelets10e9L: 45,
      daysSinceHeparinExposure: 1,
      hadHeparinInPast30Days: true,
      hadHeparinInPast31To100Days: false,
      plateletDropCategory: 'DROP_GT_50_NADIR_GE_20',
      timingCategory: 'DAY_5_TO_10_OR_RAPID_WITHIN_30D',
      thrombosisCategory: 'CONFIRMED_NEW_OR_SKIN_NECROSIS_OR_REACTION',
      otherCausesCategory: 'NONE_EVIDENT',
      antiPf4ElisaOpticalDensity: 2.85,
      isSraPositiveLowHeparin: true,
      isSraInhibitedHighHeparin: true,
      serumTotalBilirubinMgDl: 1.0,
      hasSevereHepaticImpairmentOrShock: false,
      creatinineClearanceMlMin: 55,
      baselineApttSeconds: 28,
      currentApttSeconds: 29,
      activeAnticoagulant: 'BIVALIRUDIN',
      currentDtiDose: 0.15,
      isPlateletTransfusionGiven: false,
      isWarfarinActiveInAcutePhase: false,
    },
  },
  {
    id: 'ICU_SEPSIS_LOW_HIT',
    name: 'ICU Sepsis / DIC Platelet Drop (4Ts = 2, Low Probability / Non-HIT)',
    badge: '4Ts = 2 • Low Risk • Sepsis',
    description: '58 yo female admitted to ICU for septic shock secondary to pneumonia. Platelets dropped from 180 to 95 x 10^9/L on day 2 of hospital stay. Obvious severe sepsis with microvascular consumption. Low probability; heparin continuation safe.',
    inputs: {
      patientAgeYears: 58,
      patientWeightKg: 68,
      baselinePlatelets10e9L: 180,
      currentPlatelets10e9L: 95,
      daysSinceHeparinExposure: 2,
      hadHeparinInPast30Days: false,
      hadHeparinInPast31To100Days: false,
      plateletDropCategory: 'DROP_30_50_OR_NADIR_10_19',
      timingCategory: 'FALL_LT_DAY_4_NO_RECENT_HEPARIN',
      thrombosisCategory: 'NONE',
      otherCausesCategory: 'DEFINITE_ALTERNATIVE_PRESENT',
      antiPf4ElisaOpticalDensity: 0.18,
      isSraPositiveLowHeparin: false,
      isSraInhibitedHighHeparin: false,
      serumTotalBilirubinMgDl: 1.4,
      hasSevereHepaticImpairmentOrShock: false,
      creatinineClearanceMlMin: 48,
      baselineApttSeconds: 32,
      currentApttSeconds: 34,
      activeAnticoagulant: 'ARGATROBAN',
      currentDtiDose: 0,
      isPlateletTransfusionGiven: false,
      isWarfarinActiveInAcutePhase: false,
    },
  },
  {
    id: 'HEPATIC_IMPAIRMENT_ARGATROBAN_TITRATION',
    name: 'Concomitant Hepatic Impairment with Argatroban Dose Reduction',
    badge: '4Ts = 6 • Hepatic Dosing 0.5 mcg/kg/min',
    description: '67 yo male with ischemic stroke and cirrhosis (Bilirubin 3.4 mg/dL) presenting with Day 8 UFH drop from 195 to 60 x 10^9/L. High risk HIT requiring Argatroban with mandatory 75% starting dose reduction.',
    inputs: {
      patientAgeYears: 67,
      patientWeightKg: 78,
      baselinePlatelets10e9L: 195,
      currentPlatelets10e9L: 60,
      daysSinceHeparinExposure: 8,
      hadHeparinInPast30Days: false,
      hadHeparinInPast31To100Days: false,
      plateletDropCategory: 'DROP_GT_50_NADIR_GE_20',
      timingCategory: 'DAY_5_TO_10_OR_RAPID_WITHIN_30D',
      thrombosisCategory: 'NONE',
      otherCausesCategory: 'NONE_EVIDENT',
      antiPf4ElisaOpticalDensity: 1.62,
      isSraPositiveLowHeparin: true,
      isSraInhibitedHighHeparin: true,
      serumTotalBilirubinMgDl: 3.4,
      hasSevereHepaticImpairmentOrShock: true,
      creatinineClearanceMlMin: 42,
      baselineApttSeconds: 34,
      currentApttSeconds: 36,
      activeAnticoagulant: 'ARGATROBAN',
      currentDtiDose: 0.5,
      isPlateletTransfusionGiven: false,
      isWarfarinActiveInAcutePhase: false,
    },
  },
];
