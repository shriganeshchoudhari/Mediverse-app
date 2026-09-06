/**
 * ThyroidCrisisEngine.ts
 *
 * Biophysical engine for Endocrine Emergencies:
 * - Burch-Wartofsky Point Scale (BWPS) for Thyroid Storm
 * - Japan Thyroid Association (JTA) Akamizu Diagnostic Criteria
 * - Popoveniuc Myxedema Coma Diagnostic Score
 * - Multimodal Pharmacotherapy Sequential Timing Solver (Thionamide -> 1h Iodine -> Beta-blocker -> Steroid -> Cholestyramine)
 * - 8 Comprehensive Clinical Presets
 *
 * Location: frontend/.gemini/skills/ThyroidCrisisEngine.ts
 */

export type CrisisType = 'THYROID_STORM' | 'MYXEDEMA_COMA';

export interface BwpsParameters {
  temperatureFahrenheit: number; // 99.0 to 106.0
  cnsStatus: 'NONE' | 'MILD_AGITATION' | 'MODERATE_DELIRIUM_PSYCHOSIS' | 'SEVERE_SEIZURES_COMA';
  giHepaticStatus: 'NONE' | 'MODERATE_DIARRHEA_NAUSEA_PAIN' | 'SEVERE_JAUNDICE';
  heartRateBpm: number; // 70 to 200
  heartFailureStatus: 'NONE' | 'MILD_PEDAL_EDEMA' | 'MODERATE_BIBASILAR_RALES' | 'SEVERE_PULMONARY_EDEMA';
  atrialFibrillationPresent: boolean;
  precipitatingHistoryPresent: boolean; // infection, surgery, trauma, iodinated contrast, etc.
}

export interface BwpsScoreBreakdown {
  thermoregulatoryPoints: number;
  cnsPoints: number;
  giHepaticPoints: number;
  cardiovascularPoints: number;
  atrialFibrillationPoints: number;
  precipitatingHistoryPoints: number;
  totalPoints: number;
  interpretation: 'UNLIKELY' | 'IMPENDING_STORM' | 'HIGHLY_SUGGESTIVE_STORM';
  clinicalSummary: string;
}

export interface MyxedemaScoreParameters {
  temperatureCelsius: number; // 30.0 to 37.0
  cnsDysfunction: 'NORMAL' | 'SOMNOLENCE_LETHARGY' | 'OBTUNDATION' | 'COMA';
  gastrointestinalDysfunction: 'NORMAL' | 'ANOREXIA_ABDOMINAL_PAIN' | 'ILEUS_MEGACOLON';
  heartRateBpm: number; // 30 to 80
  meanArterialPressureMmHg: number; // 40 to 100
  serumSodiumMeqL: number; // 110 to 142
  serumGlucoseMgDl: number; // 40 to 120
  hypoxemiaOrHypercapnia: boolean; // PaO2 < 60 or PaCO2 > 50
  precipitatingEventIdentified: boolean; // sepsis, cold exposure, stroke, sedatives
}

export interface MyxedemaScoreBreakdown {
  thermoregulatoryPoints: number;
  cnsPoints: number;
  giPoints: number;
  cardiovascularPoints: number;
  metabolicPoints: number;
  precipitatingPoints: number;
  totalPoints: number;
  interpretation: 'UNLIKELY' | 'EQUIVOCAL' | 'HIGHLY_SUGGESTIVE_MYXEDEMA';
  clinicalSummary: string;
}

export interface DrugAdministrationOrder {
  drug: 'PTU' | 'METHIMAZOLE' | 'SSKI_LUGOLS' | 'PROPRANOLOL' | 'ESMOLOL' | 'HYDROCORTISONE' | 'CHOLESTYRAMINE' | 'IV_LEVOTHYROXINE' | 'IV_LIOTHYRONINE';
  minuteAdministered: number; // relative timeline in minutes
}

export interface PharmacotherapySequenceEvaluation {
  thionamideGiven: boolean;
  iodineGiven: boolean;
  iodineDelayMinutes: number | null;
  isIodineTimingSafe: boolean; // MUST be given >= 60 min AFTER thionamide
  betaBlockerGiven: boolean;
  corticosteroidGiven: boolean;
  cholestyramineGiven: boolean;
  allEssentialStepsCompleted: boolean;
  warnings: string[];
  recommendations: string[];
}

export interface ThyroidCrisisPreset {
  id: string;
  name: string;
  crisisType: CrisisType;
  description: string;
  bwpsParams: BwpsParameters;
  myxedemaParams: MyxedemaScoreParameters;
  freeT4NgDl: number; // normal 0.8 - 1.8
  totalT3NgDl: number; // normal 80 - 200
  tshUiuMl: number; // normal 0.4 - 4.0
}

/**
 * Calculates Burch-Wartofsky Point Scale (BWPS) score for Thyroid Storm
 */
export function calculateBwpsScore(params: BwpsParameters): BwpsScoreBreakdown {
  // 1. Thermoregulatory dysfunction
  let thermoregulatoryPoints = 0;
  const temp = params.temperatureFahrenheit;
  if (temp >= 104.0) thermoregulatoryPoints = 30;
  else if (temp >= 103.0) thermoregulatoryPoints = 25;
  else if (temp >= 102.0) thermoregulatoryPoints = 20;
  else if (temp >= 101.0) thermoregulatoryPoints = 15;
  else if (temp >= 100.0) thermoregulatoryPoints = 10;
  else if (temp >= 99.0) thermoregulatoryPoints = 5;

  // 2. CNS effects
  let cnsPoints = 0;
  switch (params.cnsStatus) {
    case 'MILD_AGITATION':
      cnsPoints = 10;
      break;
    case 'MODERATE_DELIRIUM_PSYCHOSIS':
      cnsPoints = 20;
      break;
    case 'SEVERE_SEIZURES_COMA':
      cnsPoints = 30;
      break;
    default:
      cnsPoints = 0;
  }

  // 3. GI-hepatic dysfunction
  let giHepaticPoints = 0;
  switch (params.giHepaticStatus) {
    case 'MODERATE_DIARRHEA_NAUSEA_PAIN':
      giHepaticPoints = 10;
      break;
    case 'SEVERE_JAUNDICE':
      giHepaticPoints = 20;
      break;
    default:
      giHepaticPoints = 0;
  }

  // 4. Cardiovascular dysfunction (Tachycardia + Heart Failure + Atrial Fibrillation)
  let tachyPoints = 0;
  const hr = params.heartRateBpm;
  if (hr >= 140) tachyPoints = 25;
  else if (hr >= 130) tachyPoints = 20;
  else if (hr >= 120) tachyPoints = 15;
  else if (hr >= 110) tachyPoints = 10;
  else if (hr >= 90) tachyPoints = 5;

  let hfPoints = 0;
  switch (params.heartFailureStatus) {
    case 'MILD_PEDAL_EDEMA':
      hfPoints = 5;
      break;
    case 'MODERATE_BIBASILAR_RALES':
      hfPoints = 10;
      break;
    case 'SEVERE_PULMONARY_EDEMA':
      hfPoints = 15;
      break;
    default:
      hfPoints = 0;
  }

  const cardiovascularPoints = tachyPoints + hfPoints;
  const atrialFibrillationPoints = params.atrialFibrillationPresent ? 10 : 0;

  // 5. Precipitating history
  const precipitatingHistoryPoints = params.precipitatingHistoryPresent ? 10 : 0;

  const totalPoints =
    thermoregulatoryPoints +
    cnsPoints +
    giHepaticPoints +
    cardiovascularPoints +
    atrialFibrillationPoints +
    precipitatingHistoryPoints;

  let interpretation: 'UNLIKELY' | 'IMPENDING_STORM' | 'HIGHLY_SUGGESTIVE_STORM' = 'UNLIKELY';
  let clinicalSummary = `BWPS score ${totalPoints}: Thyroid storm is unlikely (< 25 points). Continue monitoring underlying thyrotoxicosis.`;

  if (totalPoints >= 45) {
    interpretation = 'HIGHLY_SUGGESTIVE_STORM';
    clinicalSummary = `BWPS score ${totalPoints}: Highly suggestive of Thyroid Storm (>= 45 points). Immediate ICU admission and emergency multimodal pharmacotherapy required.`;
  } else if (totalPoints >= 25) {
    interpretation = 'IMPENDING_STORM';
    clinicalSummary = `BWPS score ${totalPoints}: Impending Thyroid Storm / severe thyrotoxicosis (25-44 points). Close hemodynamic monitoring and aggressive antithyroid stabilization advised.`;
  }

  return {
    thermoregulatoryPoints,
    cnsPoints,
    giHepaticPoints,
    cardiovascularPoints,
    atrialFibrillationPoints,
    precipitatingHistoryPoints,
    totalPoints,
    interpretation,
    clinicalSummary,
  };
}

/**
 * Calculates Popoveniuc Diagnostic Score for Myxedema Coma
 */
export function calculateMyxedemaScore(params: MyxedemaScoreParameters): MyxedemaScoreBreakdown {
  // 1. Thermoregulation (Hypothermia)
  let thermoregulatoryPoints = 0;
  const temp = params.temperatureCelsius;
  if (temp < 32.0) thermoregulatoryPoints = 30;
  else if (temp < 35.0) thermoregulatoryPoints = 20;
  else if (temp < 35.5) thermoregulatoryPoints = 10;

  // 2. CNS dysfunction
  let cnsPoints = 0;
  switch (params.cnsDysfunction) {
    case 'SOMNOLENCE_LETHARGY':
      cnsPoints = 15;
      break;
    case 'OBTUNDATION':
      cnsPoints = 25;
      break;
    case 'COMA':
      cnsPoints = 35;
      break;
    default:
      cnsPoints = 0;
  }

  // 3. GI dysfunction
  let giPoints = 0;
  switch (params.gastrointestinalDysfunction) {
    case 'ANOREXIA_ABDOMINAL_PAIN':
      giPoints = 10;
      break;
    case 'ILEUS_MEGACOLON':
      giPoints = 20;
      break;
    default:
      giPoints = 0;
  }

  // 4. Cardiovascular (Bradycardia & Hypotension)
  let cardioPoints = 0;
  if (params.heartRateBpm < 50) cardioPoints += 15;
  else if (params.heartRateBpm < 60) cardioPoints += 10;

  if (params.meanArterialPressureMmHg < 65) cardioPoints += 15;
  else if (params.meanArterialPressureMmHg < 75) cardioPoints += 10;

  // 5. Metabolic & Respiratory (Hyponatremia, Hypoglycemia, Hypercapnia)
  let metabolicPoints = 0;
  if (params.serumSodiumMeqL < 125) metabolicPoints += 15;
  else if (params.serumSodiumMeqL < 132) metabolicPoints += 10;

  if (params.serumGlucoseMgDl < 55) metabolicPoints += 15;
  else if (params.serumGlucoseMgDl < 70) metabolicPoints += 10;

  if (params.hypoxemiaOrHypercapnia) metabolicPoints += 15;

  // 6. Precipitating factor
  const precipitatingPoints = params.precipitatingEventIdentified ? 10 : 0;

  const totalPoints =
    thermoregulatoryPoints +
    cnsPoints +
    giPoints +
    cardioPoints +
    metabolicPoints +
    precipitatingPoints;

  let interpretation: 'UNLIKELY' | 'EQUIVOCAL' | 'HIGHLY_SUGGESTIVE_MYXEDEMA' = 'UNLIKELY';
  let clinicalSummary = `Popoveniuc score ${totalPoints}: Myxedema coma unlikely (< 25 points).`;

  if (totalPoints >= 60) {
    interpretation = 'HIGHLY_SUGGESTIVE_MYXEDEMA';
    clinicalSummary = `Popoveniuc score ${totalPoints}: Highly suggestive of Myxedema Coma (>= 60 points). Urgent IV Levothyroxine + IV Liothyronine + stress-dose Hydrocortisone mandatory.`;
  } else if (totalPoints >= 25) {
    interpretation = 'EQUIVOCAL';
    clinicalSummary = `Popoveniuc score ${totalPoints}: Equivocal / intermediate risk of myxedema decompensation (25-59 points). ICU monitoring indicated.`;
  }

  return {
    thermoregulatoryPoints,
    cnsPoints,
    giPoints,
    cardiovascularPoints: cardioPoints,
    metabolicPoints,
    precipitatingPoints,
    totalPoints,
    interpretation,
    clinicalSummary,
  };
}

/**
 * Validates sequential multimodal pharmacotherapy in Thyroid Storm
 */
export function evaluateThyroidStormPharmacotherapy(orders: DrugAdministrationOrder[]): PharmacotherapySequenceEvaluation {
  const ptuOrder = orders.find(o => o.drug === 'PTU' || o.drug === 'METHIMAZOLE');
  const iodineOrder = orders.find(o => o.drug === 'SSKI_LUGOLS');
  const betaBlockerOrder = orders.find(o => o.drug === 'PROPRANOLOL' || o.drug === 'ESMOLOL');
  const steroidOrder = orders.find(o => o.drug === 'HYDROCORTISONE');
  const cholestyramineOrder = orders.find(o => o.drug === 'CHOLESTYRAMINE');

  const warnings: string[] = [];
  const recommendations: string[] = [];

  const thionamideGiven = !!ptuOrder;
  const iodineGiven = !!iodineOrder;
  const betaBlockerGiven = !!betaBlockerOrder;
  const corticosteroidGiven = !!steroidOrder;
  const cholestyramineGiven = !!cholestyramineOrder;

  let iodineDelayMinutes: number | null = null;
  let isIodineTimingSafe = true;

  if (iodineGiven && !thionamideGiven) {
    isIodineTimingSafe = false;
    warnings.push(
      'CRITICAL DANGER: Inorganic iodine administered without prior thionamide! Iodine will act as substrate (Jod-Basedow effect) and accelerate hormone synthesis, worsening thyrotoxic storm.'
    );
  } else if (iodineGiven && ptuOrder) {
    iodineDelayMinutes = iodineOrder.minuteAdministered - ptuOrder.minuteAdministered;
    if (iodineDelayMinutes < 60) {
      isIodineTimingSafe = false;
      warnings.push(
        `TIMING VIOLATION: Iodine administered only ${iodineDelayMinutes} minutes after thionamide. Guidelines mandate waiting at least 60 minutes after thionamide to ensure complete thyroid peroxidase organification blockade before administering iodine.`
      );
    }
  }

  if (!thionamideGiven) {
    recommendations.push('Administer Thionamide: Propylthiouracil (PTU) 200 mg q4h PO/NG (preferred in storm due to 5\'-deiodinase blockade) or Methimazole 20 mg q4-6h.');
  }

  if (!iodineGiven) {
    recommendations.push('Prepare Inorganic Iodine (SSKI 5 drops q6h or Lugol\'s 10 drops q8h) to block hormone release (Wolff-Chaikoff effect), administered >= 1 hour after thionamide.');
  }

  if (!betaBlockerGiven) {
    recommendations.push('Initiate non-selective Beta-blocker: Propranolol 60-80 mg PO q4h or IV Esmolol infusion to control adrenergic hyperactivity and inhibit T4-to-T3 conversion.');
  }

  if (!corticosteroidGiven) {
    recommendations.push('Administer Stress-Dose Glucocorticoid: Hydrocortisone 100 mg IV q8h or Dexamethasone 2 mg IV q6h to treat relative adrenal insufficiency and reduce peripheral T3.');
  }

  if (!cholestyramineGiven) {
    recommendations.push('Consider Cholestyramine 4 g PO QID to bind thyroid hormones in the gut and interrupt enterohepatic recirculation.');
  }

  const allEssentialStepsCompleted = thionamideGiven && iodineGiven && isIodineTimingSafe && betaBlockerGiven && corticosteroidGiven;

  return {
    thionamideGiven,
    iodineGiven,
    iodineDelayMinutes,
    isIodineTimingSafe,
    betaBlockerGiven,
    corticosteroidGiven,
    cholestyramineGiven,
    allEssentialStepsCompleted,
    warnings,
    recommendations,
  };
}

/**
 * 8 Clinical Presets
 */
export const THYROID_CRISIS_PRESETS: ThyroidCrisisPreset[] = [
  {
    id: 'fulminant-thyroid-storm',
    name: 'Fulminant Thyroid Storm with Atrial Fibrillation',
    crisisType: 'THYROID_STORM',
    description: 'Severe Graves disease decompensation: 103.8°F hyperthermia, delirium, AF with rapid ventricular response (155 bpm), jaundice, and pulmonary congestion. BWPS score = 75.',
    bwpsParams: {
      temperatureFahrenheit: 103.8,
      cnsStatus: 'MODERATE_DELIRIUM_PSYCHOSIS',
      giHepaticStatus: 'SEVERE_JAUNDICE',
      heartRateBpm: 155,
      heartFailureStatus: 'MODERATE_BIBASILAR_RALES',
      atrialFibrillationPresent: true,
      precipitatingHistoryPresent: true,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 155,
      meanArterialPressureMmHg: 95,
      serumSodiumMeqL: 138,
      serumGlucoseMgDl: 110,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 6.8,
    totalT3NgDl: 480,
    tshUiuMl: 0.01,
  },
  {
    id: 'impending-storm-postop',
    name: 'Impending Thyroid Storm Post-Thyroidectomy',
    crisisType: 'THYROID_STORM',
    description: 'Postoperative thyrotoxic release following manipulation of toxic multinodular goiter: Temp 100.6°F, sinus tachycardia 118 bpm, mild agitation. BWPS score = 40.',
    bwpsParams: {
      temperatureFahrenheit: 100.6,
      cnsStatus: 'MILD_AGITATION',
      giHepaticStatus: 'NONE',
      heartRateBpm: 118,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: false,
      precipitatingHistoryPresent: true,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 128,
      meanArterialPressureMmHg: 90,
      serumSodiumMeqL: 140,
      serumGlucoseMgDl: 105,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 3.4,
    totalT3NgDl: 290,
    tshUiuMl: 0.02,
  },
  {
    id: 'classical-myxedema-coma',
    name: 'Classical Myxedema Coma in Elderly Patient',
    crisisType: 'MYXEDEMA_COMA',
    description: 'Severe hypothyroid collapse triggered by winter cold exposure: Temp 32.8°C (91.0°F), profound lethargy/obtundation, sinus bradycardia 42 bpm, MAP 56 mmHg, Na+ 118 mEq/L. Popoveniuc score = 85.',
    bwpsParams: {
      temperatureFahrenheit: 96.0,
      cnsStatus: 'NONE',
      giHepaticStatus: 'NONE',
      heartRateBpm: 42,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: false,
      precipitatingHistoryPresent: false,
    },
    myxedemaParams: {
      temperatureCelsius: 32.8,
      cnsDysfunction: 'OBTUNDATION',
      gastrointestinalDysfunction: 'ILEUS_MEGACOLON',
      heartRateBpm: 42,
      meanArterialPressureMmHg: 56,
      serumSodiumMeqL: 118,
      serumGlucoseMgDl: 52,
      hypoxemiaOrHypercapnia: true,
      precipitatingEventIdentified: true,
    },
    freeT4NgDl: 0.1,
    totalT3NgDl: 18,
    tshUiuMl: 88.0,
  },
  {
    id: 'amiodarone-induced-thyrotoxicosis',
    name: 'Amiodarone-Induced Thyrotoxicosis (AIT Type 2) Storm',
    crisisType: 'THYROID_STORM',
    description: 'Destructive thyroiditis from chronic amiodarone therapy: Temp 102.2°F, AF with rapid ventricular response 145 bpm, extreme agitation, abdominal cramps. BWPS score = 60.',
    bwpsParams: {
      temperatureFahrenheit: 102.2,
      cnsStatus: 'MODERATE_DELIRIUM_PSYCHOSIS',
      giHepaticStatus: 'MODERATE_DIARRHEA_NAUSEA_PAIN',
      heartRateBpm: 145,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: true,
      precipitatingHistoryPresent: true,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 145,
      meanArterialPressureMmHg: 92,
      serumSodiumMeqL: 139,
      serumGlucoseMgDl: 112,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 5.2,
    totalT3NgDl: 340,
    tshUiuMl: 0.01,
  },
  {
    id: 'urosepsis-thyroid-storm',
    name: 'Graves Disease Precipitated by Gram-Negative Sepsis',
    crisisType: 'THYROID_STORM',
    description: 'E. coli bacteremia triggering severe thyroid storm in previously untreated Graves disease: Temp 104.2°F, tachycardia 138 bpm, hallucinations, diarrhea. BWPS score = 70.',
    bwpsParams: {
      temperatureFahrenheit: 104.2,
      cnsStatus: 'MODERATE_DELIRIUM_PSYCHOSIS',
      giHepaticStatus: 'MODERATE_DIARRHEA_NAUSEA_PAIN',
      heartRateBpm: 138,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: false,
      precipitatingHistoryPresent: true,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 138,
      meanArterialPressureMmHg: 82,
      serumSodiumMeqL: 135,
      serumGlucoseMgDl: 125,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 4.8,
    totalT3NgDl: 390,
    tshUiuMl: 0.01,
  },
  {
    id: 'uncomplicated-thyrotoxicosis',
    name: 'Uncomplicated Thyrotoxicosis (No Storm)',
    crisisType: 'THYROID_STORM',
    description: 'Symptomatic Graves disease without crisis: Mild fever 99.4°F, sinus tachycardia 105 bpm, mild tremor/anxiety, normal mentation, no heart failure. BWPS score = 15.',
    bwpsParams: {
      temperatureFahrenheit: 99.4,
      cnsStatus: 'MILD_AGITATION',
      giHepaticStatus: 'NONE',
      heartRateBpm: 105,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: false,
      precipitatingHistoryPresent: false,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 105,
      meanArterialPressureMmHg: 88,
      serumSodiumMeqL: 140,
      serumGlucoseMgDl: 98,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 2.5,
    totalT3NgDl: 220,
    tshUiuMl: 0.05,
  },
  {
    id: 'apathetic-thyroid-storm',
    name: 'Apathetic Thyroid Storm in Elderly',
    crisisType: 'THYROID_STORM',
    description: 'Masked thyrotoxic crisis in an 82-year-old: Lack of classic hyperactivity, presenting with profound lethargy, AF with heart failure, and jaundice. Temp 100.8°F. BWPS score = 55.',
    bwpsParams: {
      temperatureFahrenheit: 100.8,
      cnsStatus: 'MODERATE_DELIRIUM_PSYCHOSIS',
      giHepaticStatus: 'SEVERE_JAUNDICE',
      heartRateBpm: 122,
      heartFailureStatus: 'SEVERE_PULMONARY_EDEMA',
      atrialFibrillationPresent: true,
      precipitatingHistoryPresent: true,
    },
    myxedemaParams: {
      temperatureCelsius: 37.0,
      cnsDysfunction: 'NORMAL',
      gastrointestinalDysfunction: 'NORMAL',
      heartRateBpm: 122,
      meanArterialPressureMmHg: 80,
      serumSodiumMeqL: 136,
      serumGlucoseMgDl: 102,
      hypoxemiaOrHypercapnia: false,
      precipitatingEventIdentified: false,
    },
    freeT4NgDl: 3.9,
    totalT3NgDl: 260,
    tshUiuMl: 0.01,
  },
  {
    id: 'myxedema-coma-hypercapnia',
    name: 'Myxedema Coma with Acute Hypercapnic Respiratory Failure',
    crisisType: 'MYXEDEMA_COMA',
    description: 'Post-radioiodine hypothyroidism with medication non-compliance: Temp 33.4°C, somnolent/obtunded, severe hypoventilation (PaCO2 68 mmHg), HR 48 bpm, hypoglycemia. Popoveniuc score = 75.',
    bwpsParams: {
      temperatureFahrenheit: 96.0,
      cnsStatus: 'NONE',
      giHepaticStatus: 'NONE',
      heartRateBpm: 48,
      heartFailureStatus: 'NONE',
      atrialFibrillationPresent: false,
      precipitatingHistoryPresent: false,
    },
    myxedemaParams: {
      temperatureCelsius: 33.4,
      cnsDysfunction: 'OBTUNDATION',
      gastrointestinalDysfunction: 'ANOREXIA_ABDOMINAL_PAIN',
      heartRateBpm: 48,
      meanArterialPressureMmHg: 62,
      serumSodiumMeqL: 122,
      serumGlucoseMgDl: 58,
      hypoxemiaOrHypercapnia: true,
      precipitatingEventIdentified: true,
    },
    freeT4NgDl: 0.2,
    totalT3NgDl: 24,
    tshUiuMl: 72.0,
  },
];
