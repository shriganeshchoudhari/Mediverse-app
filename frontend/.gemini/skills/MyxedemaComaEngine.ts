/**
 * MyxedemaComaEngine.ts
 *
 * Comprehensive Biophysical & Clinical Engine for Myxedema Coma & Severe Hypothyroid Crisis:
 * - Popoveniuc Diagnostic Scoring System (Thermoregulation, CNS, GI, CV, Precipitating Event, Metabolic)
 * - Critical "Steroids Before Thyroid Hormone" Adrenal Crisis Interlock
 * - ATA Guidelines IV Thyroid Hormone Kinetics: Levothyroxine (T4) vs Liothyronine (T3) Titration
 * - Passive External Rewarming vs Vasodilatory Collapse Mechanics
 * - Dynamic Ventilatory & Free-Water Hyponatremia Protocols
 *
 * Location: frontend/.gemini/skills/MyxedemaComaEngine.ts
 */

export type CnsDysfunctionTier =
  | 'ABSENT' // 0 pts
  | 'SOMNOLENCE_LETHARGY' // 10 pts
  | 'STUPOR_DELIRIUM' // 20 pts
  | 'SEIZURES_COMA'; // 30 pts

export type GiDysfunctionTier =
  | 'ABSENT' // 0 pts
  | 'ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION' // 10 pts
  | 'PARALYTIC_ILEUS_MEGACOLON'; // 20 pts

export type ThyroidRegimenType = 'T4_MONOTHERAPY' | 'COMBINATION_T4_T3' | 'T3_MONOTHERAPY';

export interface MyxedemaPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  coreTemperatureCelsius: number; // e.g. 31.4 °C
  cnsDysfunction: CnsDysfunctionTier;
  giDysfunction: GiDysfunctionTier;
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  hasPericardialOrPleuralEffusion: boolean;
  hasCongestiveHeartFailure: boolean;
  hasKnownCoronaryArteryDisease: boolean;
  hasPrecipitatingInfectionOrCold: boolean;
  serumSodiumMeqL: number; // e.g. 122 mEq/L
  serumGlucoseMgDl: number; // e.g. 62 mg/dL
  pao2MmHg: number; // e.g. 54 mmHg
  paco2MmHg: number; // e.g. 58 mmHg
  baselineRandomCortisolMcgDl: number; // Normal > 18 mcg/dL in critical stress
  isHydrocortisoneAdministeredFirst: boolean;
  thyroidRegimen: ThyroidRegimenType;
  selectedT4LoadingDoseMcg: number; // Standard 200 - 400 mcg IV
  selectedT3LoadingDoseMcg: number; // Standard 5 - 20 mcg IV
  isActiveExternalRewarmingApplied: boolean;
}

export interface PopoveniucScoreResult {
  thermoregulationPoints: number;
  cnsPoints: number;
  giPoints: number;
  cardiovascularPoints: number;
  precipitatingEventPoints: number;
  metabolicPoints: number;
  totalScore: number; // 0 to 110+
  diagnosticCategory: 'DIAGNOSTIC_MYXEDEMA_COMA' | 'HIGH_RISK_IMPENDING' | 'UNLIKELY';
  estimatedMortalityPercent: number; // 25% to 60%
  clinicalSummary: string;
}

export interface ThyroidDosingGuidance {
  regimenType: ThyroidRegimenType;
  recommendedT4LoadingMcg: number;
  recommendedT4DailyMaintenanceMcg: number;
  recommendedT3LoadingMcg: number;
  recommendedT3DailyMaintenanceMcg: number;
  rationale: string;
  cardiacWarning?: string;
}

export interface AdrenalSafetyEvaluation {
  isSteroidPretreatmentSatisfied: boolean;
  adrenalCrisisRiskLevel: 'CRITICAL_LETHAL' | 'SAFE_PROTECTED';
  hydrocortisoneRegimen: string;
  clinicalRationale: string;
}

export interface SupportiveCareEvaluation {
  rewarmingGuidance: string;
  rewarmingSafetyWarning?: string;
  ventilatoryGuidance: string;
  hyponatremiaGuidance: string;
}

export interface MyxedemaComprehensiveOutput {
  popoveniuc: PopoveniucScoreResult;
  adrenalSafety: AdrenalSafetyEvaluation;
  thyroidDosing: ThyroidDosingGuidance;
  supportiveCare: SupportiveCareEvaluation;
  safetyInterlocks: string[];
  immediateActionChecklist: string[];
  clinicalPearls: string[];
}

/**
 * Calculate Popoveniuc Diagnostic Score for Myxedema Coma.
 */
export function calculatePopoveniucScore(input: MyxedemaPatientInput): PopoveniucScoreResult {
  // 1. Thermoregulatory Dysfunction (Core Temperature)
  let thermoPoints = 0;
  const temp = input.coreTemperatureCelsius;
  if (temp < 32.0) thermoPoints = 20;
  else if (temp < 35.0) thermoPoints = 10;
  else thermoPoints = 0;

  // 2. CNS Effects
  let cnsPoints = 0;
  if (input.cnsDysfunction === 'SEIZURES_COMA') cnsPoints = 30;
  else if (input.cnsDysfunction === 'STUPOR_DELIRIUM') cnsPoints = 20;
  else if (input.cnsDysfunction === 'SOMNOLENCE_LETHARGY') cnsPoints = 10;
  else cnsPoints = 0;

  // 3. GI Effects
  let giPoints = 0;
  if (input.giDysfunction === 'PARALYTIC_ILEUS_MEGACOLON') giPoints = 20;
  else if (input.giDysfunction === 'ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION') giPoints = 10;
  else giPoints = 0;

  // 4. Cardiovascular Dysfunction
  let cvPoints = 0;
  if (input.heartRateBpm < 50) cvPoints += 10;
  const map = Math.round((2 * input.diastolicBpMmHg + input.systolicBpMmHg) / 3);
  if (map < 65 || input.systolicBpMmHg < 90) cvPoints += 10;
  if (input.hasPericardialOrPleuralEffusion) cvPoints += 10;
  if (input.hasCongestiveHeartFailure) cvPoints += 10;

  // 5. Precipitating Event
  const precipPoints = input.hasPrecipitatingInfectionOrCold ? 10 : 0;

  // 6. Metabolic Disturbances
  let metabPoints = 0;
  if (input.serumSodiumMeqL < 130) metabPoints += 10;
  if (input.serumGlucoseMgDl < 70) metabPoints += 10;
  if (input.pao2MmHg < 60 || input.paco2MmHg > 50) metabPoints += 10;

  const totalScore = thermoPoints + cnsPoints + giPoints + cvPoints + precipPoints + metabPoints;

  let diagnosticCategory: PopoveniucScoreResult['diagnosticCategory'];
  let mortality = 15;
  let summary = '';

  if (totalScore >= 60) {
    diagnosticCategory = 'DIAGNOSTIC_MYXEDEMA_COMA';
    mortality = 45;
    summary =
      `Score ${totalScore} (≥60): Diagnostic of Myxedema Coma. Multiorgan decompensation secondary to severe thyroid deficiency. Immediate ICU admission, stress-dose hydrocortisone, IV thyroid hormone loading, and mechanical ventilation required. In-hospital mortality is 30-50%.`;
  } else if (totalScore >= 25) {
    diagnosticCategory = 'HIGH_RISK_IMPENDING';
    mortality = 20;
    summary =
      `Score ${totalScore} (25-59): Impending Decompensation / High Risk. Significant hypothyroid systemic involvement with high likelihood of rapid progression to overt coma. Aggressive treatment and close hemodynamic monitoring indicated.`;
  } else {
    diagnosticCategory = 'UNLIKELY';
    mortality = 5;
    summary =
      `Score ${totalScore} (<25): Myxedema Coma Unlikely. Isolated primary or secondary hypothyroidism without critical multisystem collapse. Continue outpatient or floor-based thyroid replacement while evaluating alternative etiologies.`;
  }

  return {
    thermoregulationPoints: thermoPoints,
    cnsPoints,
    giPoints,
    cardiovascularPoints: cvPoints,
    precipitatingEventPoints: precipPoints,
    metabolicPoints: metabPoints,
    totalScore,
    diagnosticCategory,
    estimatedMortalityPercent: mortality,
    clinicalSummary: summary,
  };
}

/**
 * Evaluate Adrenal Crisis Safety & Hydrocortisone Protocol.
 */
export function evaluateAdrenalSafety(input: MyxedemaPatientInput): AdrenalSafetyEvaluation {
  const isCortisolCriticallyLow = input.baselineRandomCortisolMcgDl < 18.0;

  if (!input.isHydrocortisoneAdministeredFirst) {
    return {
      isSteroidPretreatmentSatisfied: false,
      adrenalCrisisRiskLevel: 'CRITICAL_LETHAL',
      hydrocortisoneRegimen: 'Hydrocortisone NOT given prior to thyroid hormone!',
      clinicalRationale:
        'FATAL ADRENAL CRISIS TRIGGER: Thyroid hormone increases hepatic metabolic clearance of cortisol and accelerates total body oxygen consumption. In severe hypothyroidism, adrenal reserve is blunted. Administering thyroid hormone without prior corticosteroids can trigger immediate refractory shock, cardiovascular collapse, and death.',
    };
  }

  return {
    isSteroidPretreatmentSatisfied: true,
    adrenalCrisisRiskLevel: 'SAFE_PROTECTED',
    hydrocortisoneRegimen: 'Hydrocortisone 100 mg IV q8h (or 200 - 300 mg/day continuous infusion).',
    clinicalRationale:
      'Protected Against Adrenal Crisis: Empirical stress-dose hydrocortisone covers potential concomitant primary adrenal insufficiency (Schmidt syndrome) or secondary central hypopituitarism during hypermetabolic induction.',
  };
}

/**
 * Compute ATA Guidelines Thyroid Hormone Regimen & Cardiac Adjustments.
 */
export function calculateThyroidDosing(input: MyxedemaPatientInput): ThyroidDosingGuidance {
  const hasCadOrElderly = input.hasKnownCoronaryArteryDisease || input.patientAgeYears >= 65;

  let recT4Load = 300;
  let recT4Maint = 75;
  let recT3Load = 10;
  let recT3Maint = 5;
  let cardWarn: string | undefined;

  if (hasCadOrElderly) {
    recT4Load = 200; // Lower loading dose in CAD/elderly
    recT4Maint = 50;
    recT3Load = 5;
    recT3Maint = 2.5;
    cardWarn =
      'CORONARY ARTERY DISEASE / ELDERLY CAUTION: Elevated risk of myocardial ischemia, acute coronary syndrome, and fatal ventricular arrhythmias upon reintroduction of thyroid hormone. Maintain conservative loading doses (T4 ≤ 250 mcg IV) and avoid high T3 doses.';
  }

  let rationale = '';
  if (input.thyroidRegimen === 'T4_MONOTHERAPY') {
    rationale =
      `IV Levothyroxine (T4) Monotherapy: Recommended initial loading dose of ${recT4Load} mcg IV slow bolus, followed by ${recT4Maint} mcg IV daily until patient can tolerate oral therapy. Provides smooth, physiologic conversion to T3 via deiodinases without sharp T3 serum peaks.`;
  } else if (input.thyroidRegimen === 'COMBINATION_T4_T3') {
    rationale =
      `Combination IV T4 + T3 Therapy: Recommended in profound coma without severe CAD. Administer IV T4 ${recT4Load} mcg bolus + IV T3 ${recT3Load} mcg bolus, then T3 2.5 - 5 mcg q8h. Bypasses severely impaired peripheral 5'-deiodinase activity in critical illness.`;
  } else {
    rationale =
      'IV Liothyronine (T3) Monotherapy: Rapid genomic onset, but produces dramatic fluctuations in serum T3 and carries the highest risk of fatal arrhythmias. Generally reserved for refractory cases.';
  }

  return {
    regimenType: input.thyroidRegimen,
    recommendedT4LoadingMcg: recT4Load,
    recommendedT4DailyMaintenanceMcg: recT4Maint,
    recommendedT3LoadingMcg: recT3Load,
    recommendedT3DailyMaintenanceMcg: recT3Maint,
    rationale,
    cardiacWarning: cardWarn,
  };
}

/**
 * Evaluate Supportive Care: Rewarming, Ventilation, and Hyponatremia.
 */
export function evaluateSupportiveCare(input: MyxedemaPatientInput): SupportiveCareEvaluation {
  let rewarmingGuidance =
    'Passive External Rewarming: Use ordinary blankets, warm ambient room temperature (72-75 °F), and minimize heat loss. Core body temperature should rise gradually at ≤ 0.5 - 1.0 °C per hour.';
  let rewarmWarning: string | undefined;

  if (input.isActiveExternalRewarmingApplied) {
    rewarmWarning =
      'CRITICAL REWARMING HAZARD: Active external rewarming (forced-air warming blankets, heated water pads) causes rapid cutaneous peripheral vasodilation, shunting blood away from the core and precipitating profound distributive shock and cardiovascular collapse.';
  }

  let ventGuidance = '';
  if (input.paco2MmHg > 50 || input.pao2MmHg < 60 || input.cnsDysfunction === 'SEIZURES_COMA' || input.cnsDysfunction === 'STUPOR_DELIRIUM') {
    ventGuidance =
      `IMMEDIATE INTUBATION MANDATED: Severe hypercapnia (PaCO2 ${input.paco2MmHg} mmHg) and profound CNS depression reflect blunted respiratory center drive, respiratory muscle myopathy, and macroglossia. Initiate mechanical ventilation without delay.`;
  } else {
    ventGuidance =
      'Monitor continuous pulse oximetry and serial ABGs closely. Non-invasive monitoring acceptable if mentation is intact and PaCO2 < 45 mmHg.';
  }

  let sodiumGuidance = '';
  if (input.serumSodiumMeqL < 120 && (input.cnsDysfunction === 'SEIZURES_COMA' || input.cnsDysfunction === 'STUPOR_DELIRIUM')) {
    sodiumGuidance =
      `Severe Symptomatic Hyponatremia (${input.serumSodiumMeqL} mEq/L): High circulating ADH (impaired free water clearance). Administer 3% Hypertonic Saline (100 mL IV bolus over 10 minutes, max 8-10 mEq/L rise in 24h) to avert cerebral edema and herniation.`;
  } else if (input.serumSodiumMeqL < 130) {
    sodiumGuidance =
      `Moderate Euvolemic Hyponatremia (${input.serumSodiumMeqL} mEq/L): Primarily managed with strict free water restriction (< 1000 mL/day) and isotonic crystalloids. Corrects gradually as thyroid hormone restores renal hemodynamics.`;
  } else {
    sodiumGuidance = 'Serum sodium is preserved. Avoid excessive hypotonic IV fluid administration.';
  }

  return {
    rewarmingGuidance,
    rewarmingSafetyWarning: rewarmWarning,
    ventilatoryGuidance: ventGuidance,
    hyponatremiaGuidance: sodiumGuidance,
  };
}

/**
 * Perform Comprehensive Myxedema Coma Evaluation.
 */
export function performMyxedemaEvaluation(input: MyxedemaPatientInput): MyxedemaComprehensiveOutput {
  const popoveniuc = calculatePopoveniucScore(input);
  const adrenalSafety = evaluateAdrenalSafety(input);
  const thyroidDosing = calculateThyroidDosing(input);
  const supportiveCare = evaluateSupportiveCare(input);

  const safetyInterlocks: string[] = [];

  if (!adrenalSafety.isSteroidPretreatmentSatisfied) {
    safetyInterlocks.push(
      'CRITICAL SAFETY INTERLOCK: Stress-dose IV Hydrocortisone (100 mg q8h) MUST be given BEFORE or simultaneously with IV thyroid hormone. Administering thyroid hormone alone will accelerate cortisol metabolism and precipitate lethal acute adrenal collapse.'
    );
  }

  if (supportiveCare.rewarmingSafetyWarning) {
    safetyInterlocks.push(supportiveCare.rewarmingSafetyWarning);
  }

  if (input.hasKnownCoronaryArteryDisease && input.selectedT3LoadingDoseMcg > 10) {
    safetyInterlocks.push(
      `HIGH T3 ARRHYTHMIA WARNING: Selected T3 dose (${input.selectedT3LoadingDoseMcg} mcg) exceeds safe threshold (5-10 mcg) in a patient with coronary artery disease. May trigger fatal myocardial infarction or refractory ventricular tachycardia.`
    );
  }

  const immediateActions: string[] = [
    `Popoveniuc Score: ${popoveniuc.totalScore} points (${popoveniuc.diagnosticCategory.replace(/_/g, ' ')}). Estimated Mortality: ~${popoveniuc.estimatedMortalityPercent}%.`,
  ];

  if (adrenalSafety.isSteroidPretreatmentSatisfied) {
    immediateActions.push('Hydrocortisone 100 mg IV administered (adrenal protection confirmed).');
  } else {
    immediateActions.push('HOLD THYROID HORMONE: Immediately draw baseline cortisol, then administer Hydrocortisone 100 mg IV bolus.');
  }

  if (popoveniuc.totalScore >= 25) {
    immediateActions.push(`Initiate IV Levothyroxine ${thyroidDosing.recommendedT4LoadingMcg} mcg loading infusion.`);
    if (input.thyroidRegimen === 'COMBINATION_T4_T3') {
      immediateActions.push(`Add IV Liothyronine ${thyroidDosing.recommendedT3LoadingMcg} mcg bolus.`);
    }
  }

  if (supportiveCare.ventilatoryGuidance.includes('INTUBATION MANDATED')) {
    immediateActions.push('Prepare immediate endotracheal intubation and lung-protective mechanical ventilation.');
  }

  immediateActions.push('Initiate passive external rewarming with warm blankets; avoid active forced-air heaters.');

  const clinicalPearls: string[] = [
    'The Steroids-First Rule: Always draw random cortisol and administer stress-dose IV hydrocortisone (100 mg q8h) before or simultaneously with thyroid hormone. Accelerating metabolic clearance of cortisol in a patient with exhausted adrenal reserve induces immediate fatal vascular collapse.',
    'Passive vs Active Rewarming: Active external warming dilates cutaneous vascular beds, causing sudden pooling of blood and profound hypotension. Only passive external warming (standard warm blankets) should be employed.',
    'Popoveniuc Score Cutoff: A score ≥ 60 is diagnostic of myxedema coma; 25-59 indicates impending decompensation. The score integrates hypothermia, CNS lethargy/coma, GI obstipation/ileus, bradycardia/effusions, and metabolic derangements.',
    'Combination T4 + T3 Controversy: T4 provides a stable prohormone reservoir, while T3 bypasses the severe 5\'-deiodinase inhibition seen in critical illness. In patients with known CAD or elderly, T4 monotherapy is preferred to avoid lethal ventricular arrhythmias.',
    'Free Water Clearance Defect: Myxedema coma patients have non-osmotic hypersecretion of ADH and decreased GFR. Hyponatremia is common and dilutional; treat with free water restriction unless severe seizures mandate 3% hypertonic saline.'
  ];

  return {
    popoveniuc,
    adrenalSafety,
    thyroidDosing,
    supportiveCare,
    safetyInterlocks,
    immediateActionChecklist: immediateActions,
    clinicalPearls,
  };
}

export interface MyxedemaPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: MyxedemaPatientInput;
}

export const MYXEDEMA_PRESETS: MyxedemaPreset[] = [
  {
    id: 'CLASSICAL_ELDERLY_COMA',
    name: 'Classical Elderly Myxedema Coma with Hypothermia (Popoveniuc = 80)',
    badge: 'Score = 80 • Severe Coma • Temp 31.2°C',
    description: '78 yo female brought from home obtunded during winter. Core temperature 31.2°C, heart rate 38 bpm, BP 82/52 mmHg, macroglossia, delayed relaxation of reflexes, Na 120 mEq/L, glucose 58 mg/dL. Severe classical presentation.',
    inputs: {
      patientAgeYears: 78,
      patientWeightKg: 65,
      coreTemperatureCelsius: 31.2,
      cnsDysfunction: 'SEIZURES_COMA',
      giDysfunction: 'ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION',
      heartRateBpm: 38,
      systolicBpMmHg: 82,
      diastolicBpMmHg: 52,
      hasPericardialOrPleuralEffusion: true,
      hasCongestiveHeartFailure: true,
      hasKnownCoronaryArteryDisease: false,
      hasPrecipitatingInfectionOrCold: true,
      serumSodiumMeqL: 120,
      serumGlucoseMgDl: 58,
      pao2MmHg: 52,
      paco2MmHg: 58,
      baselineRandomCortisolMcgDl: 9.2,
      isHydrocortisoneAdministeredFirst: true,
      thyroidRegimen: 'COMBINATION_T4_T3',
      selectedT4LoadingDoseMcg: 300,
      selectedT3LoadingDoseMcg: 10,
      isActiveExternalRewarmingApplied: false,
    },
  },
  {
    id: 'SEPSIS_UNPROTECTED_ADRENAL',
    name: 'Pneumonia Sepsis with Unprotected Adrenal Status (Fatal Crisis Hazard)',
    badge: 'Score = 80 • Unprotected Adrenal • Fatal Risk',
    description: '71 yo male with severe myxedema coma precipitated by lobar pneumonia. Core temp 32.8°C, stupor, septic shock. Thyroid hormone ordered WITHOUT hydrocortisone premedication, triggering lethal adrenal crisis interlock.',
    inputs: {
      patientAgeYears: 71,
      patientWeightKg: 76,
      coreTemperatureCelsius: 32.8,
      cnsDysfunction: 'STUPOR_DELIRIUM',
      giDysfunction: 'PARALYTIC_ILEUS_MEGACOLON',
      heartRateBpm: 48,
      systolicBpMmHg: 84,
      diastolicBpMmHg: 50,
      hasPericardialOrPleuralEffusion: true,
      hasCongestiveHeartFailure: false,
      hasKnownCoronaryArteryDisease: false,
      hasPrecipitatingInfectionOrCold: true,
      serumSodiumMeqL: 124,
      serumGlucoseMgDl: 64,
      pao2MmHg: 50,
      paco2MmHg: 62,
      baselineRandomCortisolMcgDl: 6.4,
      isHydrocortisoneAdministeredFirst: false, // Critical Danger
      thyroidRegimen: 'T4_MONOTHERAPY',
      selectedT4LoadingDoseMcg: 300,
      selectedT3LoadingDoseMcg: 0,
      isActiveExternalRewarmingApplied: false,
    },
  },
  {
    id: 'IMPENDING_CAD_CAUTION',
    name: 'Impending Myxedema Decompensation with Severe CAD (Low-Dose Titration)',
    badge: 'Score = 50 • CAD Caution • T4 200 mcg',
    description: '69 yo male with prior CABG and ischemic cardiomyopathy presenting with severe lethargy, cold intolerance, temp 34.2°C, bradycardia 44 bpm, BP 94/62 mmHg. Requires conservative T4 monotherapy (200 mcg) to avert acute MI.',
    inputs: {
      patientAgeYears: 69,
      patientWeightKg: 82,
      coreTemperatureCelsius: 34.2,
      cnsDysfunction: 'SOMNOLENCE_LETHARGY',
      giDysfunction: 'ANOREXIA_ABDOMINAL_PAIN_CONSTIPATION',
      heartRateBpm: 44,
      systolicBpMmHg: 94,
      diastolicBpMmHg: 62,
      hasPericardialOrPleuralEffusion: false,
      hasCongestiveHeartFailure: false,
      hasKnownCoronaryArteryDisease: true, // CAD caution
      hasPrecipitatingInfectionOrCold: true,
      serumSodiumMeqL: 132,
      serumGlucoseMgDl: 78,
      pao2MmHg: 68,
      paco2MmHg: 46,
      baselineRandomCortisolMcgDl: 22.0,
      isHydrocortisoneAdministeredFirst: true,
      thyroidRegimen: 'T4_MONOTHERAPY',
      selectedT4LoadingDoseMcg: 200,
      selectedT3LoadingDoseMcg: 0,
      isActiveExternalRewarmingApplied: false,
    },
  },
  {
    id: 'ACTIVE_REWARMING_COLLAPSE',
    name: 'Active Rewarming Vasodilatory Shock & Hypoventilation Coma',
    badge: 'Score = 70 • Rewarming Hazard Active',
    description: '74 yo female with temp 30.6°C treated with active high-heat forced-air warming blanket, precipitating peripheral cutaneous vasodilation and worsening hypotension (72/44 mmHg). Immediate cessation of active warming required.',
    inputs: {
      patientAgeYears: 74,
      patientWeightKg: 60,
      coreTemperatureCelsius: 30.6,
      cnsDysfunction: 'SEIZURES_COMA',
      giDysfunction: 'PARALYTIC_ILEUS_MEGACOLON',
      heartRateBpm: 36,
      systolicBpMmHg: 72,
      diastolicBpMmHg: 44,
      hasPericardialOrPleuralEffusion: true,
      hasCongestiveHeartFailure: false,
      hasKnownCoronaryArteryDisease: false,
      hasPrecipitatingInfectionOrCold: true,
      serumSodiumMeqL: 118,
      serumGlucoseMgDl: 54,
      pao2MmHg: 48,
      paco2MmHg: 68,
      baselineRandomCortisolMcgDl: 12.0,
      isHydrocortisoneAdministeredFirst: true,
      thyroidRegimen: 'COMBINATION_T4_T3',
      selectedT4LoadingDoseMcg: 250,
      selectedT3LoadingDoseMcg: 10,
      isActiveExternalRewarmingApplied: true, // Active rewarming hazard
    },
  },
];
