/**
 * AdrenalCrisisSteroidEngine.ts
 *
 * Biophysical simulation and clinical decision-support engine for:
 * Acute Adrenal Crisis, Primary Adrenal Insufficiency (Addison's Disease),
 * Secondary/Tertiary Hypothalamic-Pituitary-Adrenal (HPA) Axis Suppression,
 * Synthetic Glucocorticoid / Mineralocorticoid Equivalency Kinetics,
 * Diagnostic Cosyntropin (ACTH) Stimulation, and Stress-Dose Steroid Protocols.
 *
 * References & Clinical Guidelines:
 * - Bornstein SR, et al. Diagnosis and Treatment of Primary Adrenal Insufficiency:
 *   An Endocrine Society Clinical Practice Guideline. J Clin Endocrinol Metab. 2016.
 * - Hahner S, et al. Management of Adrenal Crisis: A Statement by the European
 *   Society of Endocrinology. Eur J Endocrinol. 2020.
 * - Rushworth RL, et al. Adrenal Crisis. N Engl J Med. 2019.
 * - Liu MM, et al. Perioperative steroid management in patients with adrenal insufficiency.
 *   Br J Surg. 2017.
 *
 * Location: frontend/.gemini/skills/AdrenalCrisisSteroidEngine.ts
 */

export type AdrenalPathologyType =
  | 'PRIMARY_ADDISONS_AUTOIMMUNE'
  | 'PRIMARY_BILATERAL_ADRENAL_HEMORRHAGE' // Waterhouse-Friderichsen
  | 'SECONDARY_PITUITARY_PANHYPOPITUITARISM'
  | 'TERTIARY_EXOGENOUS_STEROID_WITHDRAWAL'
  | 'CRITICALLY_ILL_CIRCI'; // Corticosteroid Insufficiency in Critically Ill

export type StressSeverityLevel =
  | 'BASAL_PHYSIOLOGIC'
  | 'MINOR_STRESS_FEVER' // Upper respiratory infection, mild fever
  | 'MODERATE_SURGICAL_STRESS' // Cholecystectomy, joint replacement
  | 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK'; // Whipple, CABG, septic shock, multi-trauma

export type SyntheticCorticosteroidType =
  | 'HYDROCORTISONE' // Cortisol itself
  | 'PREDNISONE'
  | 'PREDNISOLONE'
  | 'METHYLPREDNISOLONE'
  | 'DEXAMETHASONE'
  | 'FLUDROCORTISONE';

export interface CorticosteroidEquivalencyData {
  name: string;
  equivalentDoseMg: number; // Equivalent to 20 mg Hydrocortisone
  glucocorticoidPotency: number; // Relative to Hydrocortisone = 1
  mineralocorticoidPotency: number; // Relative to Hydrocortisone = 1 (Fludrocortisone = 250)
  biologicalHalfLifeHours: number; // Short (8-12), Intermediate (18-36), Long (36-54)
  crossReactsWithCortisolAssay: boolean; // Dexamethasone does NOT cross-react (ideal before cosyntropin)
}

export const CORTICOSTEROID_PROPERTIES: Record<SyntheticCorticosteroidType, CorticosteroidEquivalencyData> = {
  HYDROCORTISONE: {
    name: 'Hydrocortisone (Cortisol)',
    equivalentDoseMg: 20,
    glucocorticoidPotency: 1.0,
    mineralocorticoidPotency: 1.0,
    biologicalHalfLifeHours: 10,
    crossReactsWithCortisolAssay: true,
  },
  PREDNISONE: {
    name: 'Prednisone (Prodrug)',
    equivalentDoseMg: 5,
    glucocorticoidPotency: 4.0,
    mineralocorticoidPotency: 0.8,
    biologicalHalfLifeHours: 24,
    crossReactsWithCortisolAssay: true,
  },
  PREDNISOLONE: {
    name: 'Prednisolone',
    equivalentDoseMg: 5,
    glucocorticoidPotency: 4.0,
    mineralocorticoidPotency: 0.8,
    biologicalHalfLifeHours: 24,
    crossReactsWithCortisolAssay: true,
  },
  METHYLPREDNISOLONE: {
    name: 'Methylprednisolone',
    equivalentDoseMg: 4,
    glucocorticoidPotency: 5.0,
    mineralocorticoidPotency: 0.5,
    biologicalHalfLifeHours: 24,
    crossReactsWithCortisolAssay: true,
  },
  DEXAMETHASONE: {
    name: 'Dexamethasone',
    equivalentDoseMg: 0.75,
    glucocorticoidPotency: 30.0,
    mineralocorticoidPotency: 0.0,
    biologicalHalfLifeHours: 48,
    crossReactsWithCortisolAssay: false,
  },
  FLUDROCORTISONE: {
    name: 'Fludrocortisone (9alpha-fluorocortisol)',
    equivalentDoseMg: 2.0,
    glucocorticoidPotency: 10.0,
    mineralocorticoidPotency: 250.0,
    biologicalHalfLifeHours: 24,
    crossReactsWithCortisolAssay: true,
  },
};

export interface PatientAdrenalParameters {
  pathology: AdrenalPathologyType;
  stressLevel: StressSeverityLevel;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  serumSodiumMeqL: number; // Hyponatremia typical (120-134 mEq/L)
  serumPotassiumMeqL: number; // Hyperkalemia in primary (5.2-7.0 mEq/L)
  serumGlucoseMgDl: number; // Hypoglycemia common in crisis (< 70 mg/dL)
  baselineSerumCortisolMcgDl: number; // Low (< 5 mcg/dL highly suspicious)
  plasmaActhPgMl: number; // High in primary (>100 pg/mL), low in secondary (<15 pg/mL)
}

export interface AdrenalEmergencyTreatmentPlan {
  ivBolusHydrocortisoneMg: number; // 100 mg IV stat recommended
  continuousInfusionHydrocortisoneMgDay: number; // 200 mg/24h continuous or 50 mg IV q6h
  dexamethasoneUsedAsInitialBolus: boolean; // 4 mg IV if cosyntropin test pending
  isotonicSalineLitersFirst24Hours: number; // Resuscitation fluid (0.9% NaCl with D5W)
  dextroseGivenForHypoglycemia: boolean; // D5W or 50% Dextrose
  fludrocortisoneDoseMgDaily: number; // Only needed once Hydrocortisone tapered < 50 mg/day
}

export interface CosyntropinTestResult {
  baselineCortisolMcgDl: number;
  baselineSerumCortisolMcgDl: number;
  cortisolAt30MinMcgDl: number;
  cortisolAt60MinMcgDl: number;
  passedStimulationTest: boolean; // Peak >= 18 mcg/dL defines intact adrenal reserve
  interpretation: string;
}

export interface CrisisResuscitationOutcome {
  crisisAvertedOrControlled: boolean;
  predicted24HrSystolicBp: number;
  predicted24HrSerumSodium: number;
  predicted24HrSerumPotassium: number;
  mineralocorticoidReplacedSufficiently: boolean;
  cosyntropinAssayIntegrityPreserved: boolean;
  stressDoseSufficiencyPercent: number;
  clinicalSafetyAlerts: string[];
}

/**
 * 1. Calculate Equivalent Glucocorticoid & Mineralocorticoid Potency
 */
export function calculateSteroidEquivalency(
  sourceDrug: SyntheticCorticosteroidType,
  sourceDoseMg: number,
  targetDrug: SyntheticCorticosteroidType
): {
  equivalentTargetDoseMg: number;
  glucocorticoidEquivalentHydrocortisoneMg: number;
  mineralocorticoidEquivalentHydrocortisoneMg: number;
} {
  const src = CORTICOSTEROID_PROPERTIES[sourceDrug];
  const tgt = CORTICOSTEROID_PROPERTIES[targetDrug];

  // Ratio based on hydrocortisone reference (20 mg)
  const hydrocortisoneGlucoEquiv = (sourceDoseMg / src.equivalentDoseMg) * 20;
  const targetDose = (hydrocortisoneGlucoEquiv / 20) * tgt.equivalentDoseMg;

  const hydrocortisoneMineraloEquiv = (sourceDoseMg / src.equivalentDoseMg) * src.mineralocorticoidPotency * 20;

  return {
    equivalentTargetDoseMg: +targetDose.toFixed(2),
    glucocorticoidEquivalentHydrocortisoneMg: +hydrocortisoneGlucoEquiv.toFixed(1),
    mineralocorticoidEquivalentHydrocortisoneMg: +hydrocortisoneMineraloEquiv.toFixed(1),
  };
}

/**
 * 2. High-Dose (250 mcg) Cosyntropin (ACTH) Stimulation Test Evaluation
 */
export function evaluateCosyntropinTest(
  baselineCortisol: number,
  adrenalPathology: AdrenalPathologyType,
  steroidAdministeredRecently: SyntheticCorticosteroidType | 'NONE'
): CosyntropinTestResult {
  let peakAt60 = baselineCortisol;

  if (adrenalPathology === 'PRIMARY_ADDISONS_AUTOIMMUNE' || adrenalPathology === 'PRIMARY_BILATERAL_ADRENAL_HEMORRHAGE') {
    // Adrenal cortex destroyed -> flat failure to stimulate (< 10-12 mcg/dL)
    peakAt60 = Math.min(12, baselineCortisol + 2.5);
  } else if (adrenalPathology === 'TERTIARY_EXOGENOUS_STEROID_WITHDRAWAL' || adrenalPathology === 'SECONDARY_PITUITARY_PANHYPOPITUITARISM') {
    // Adrenal cortex atrophied from chronic lack of ACTH -> subnormal response
    peakAt60 = Math.min(16, baselineCortisol + 5.0);
  } else {
    // Intact reserve / mild CIRCI
    peakAt60 = Math.max(19, baselineCortisol + 10.0);
  }

  const peakAt30 = +(baselineCortisol + (peakAt60 - baselineCortisol) * 0.75).toFixed(1);
  peakAt60 = +peakAt60.toFixed(1);

  const passedStimulationTest = peakAt60 >= 18.0;

  let interpretation = '';
  if (steroidAdministeredRecently !== 'NONE' && steroidAdministeredRecently !== 'DEXAMETHASONE') {
    interpretation =
      'INVALID TEST: Exogenous steroid cross-reacts with immunoassays, creating a falsely elevated cortisol measurement. Dexamethasone is the only steroid permitted before ACTH testing.';
  } else if (passedStimulationTest) {
    interpretation =
      'Intact Adrenal Reserve: Peak cortisol >= 18 mcg/dL rules out primary and longstanding secondary adrenal insufficiency.';
  } else {
    interpretation =
      'Adrenal Insufficiency Confirmed: Subnormal peak (< 18 mcg/dL). Correlate with baseline ACTH to distinguish primary (high ACTH) from central (low/normal ACTH).';
  }

  return {
    baselineCortisolMcgDl: baselineCortisol,
    baselineSerumCortisolMcgDl: baselineCortisol,
    cortisolAt30MinMcgDl: peakAt30,
    cortisolAt60MinMcgDl: peakAt60,
    passedStimulationTest,
    interpretation,
  };
}

/**
 * 3. Required Daily Stress-Dose Coverage Calculator
 */
export function getRequiredStressDoseHydrocortisoneMg(stressLevel: StressSeverityLevel): {
  requiredDailyHydrocortisoneMg: number;
  dosingSchedule: string;
  fludrocortisoneRequired: boolean;
} {
  switch (stressLevel) {
    case 'BASAL_PHYSIOLOGIC':
      return {
        requiredDailyHydrocortisoneMg: 20, // 15-25 mg/day standard (e.g. 10mg am, 5mg noon, 5mg 4pm)
        dosingSchedule: '10 mg at 08:00, 5 mg at 12:00, 5 mg at 16:00 PO',
        fludrocortisoneRequired: true, // Primary requires 0.05 - 0.2 mg PO daily
      };
    case 'MINOR_STRESS_FEVER':
      return {
        requiredDailyHydrocortisoneMg: 50, // Double or triple oral dose (40-60 mg/day)
        dosingSchedule: 'Double oral dose: 20 mg am, 15 mg noon, 15 mg pm PO x 3 days',
        fludrocortisoneRequired: true,
      };
    case 'MODERATE_SURGICAL_STRESS':
      return {
        requiredDailyHydrocortisoneMg: 100, // 50 mg IV pre-op, then 25 mg IV q8h
        dosingSchedule: '50 mg IV pre-induction, then 25-50 mg IV q8h for 24-48 hours',
        fludrocortisoneRequired: false, // High-dose hydrocortisone (>50 mg/day) provides sufficient mineralocorticoid cross-talk
      };
    case 'MAJOR_SURGICAL_OR_SEPTIC_SHOCK':
    default:
      return {
        requiredDailyHydrocortisoneMg: 200, // 100 mg IV stat, then 200 mg/24h continuous or 50 mg q6h
        dosingSchedule: '100 mg IV bolus stat, followed by 200 mg/day continuous IV infusion (or 50 mg IV q6h)',
        fludrocortisoneRequired: false,
      };
  }
}

/**
 * 4. Master Simulation Engine: Acute Adrenal Crisis Resuscitation
 */
export function simulateAdrenalCrisisResuscitation(
  patient: PatientAdrenalParameters,
  treatment: AdrenalEmergencyTreatmentPlan
): CrisisResuscitationOutcome {
  const alerts: string[] = [];
  const required = getRequiredStressDoseHydrocortisoneMg(patient.stressLevel);

  // Total equivalent hydrocortisone given
  let totalDailyHydrocortisoneEquivalent = treatment.continuousInfusionHydrocortisoneMgDay;
  if (treatment.ivBolusHydrocortisoneMg > 0) {
    totalDailyHydrocortisoneEquivalent += treatment.ivBolusHydrocortisoneMg;
  }
  if (treatment.dexamethasoneUsedAsInitialBolus) {
    totalDailyHydrocortisoneEquivalent += 4 * (20 / 0.75); // 4 mg Dexamethasone ~= 106.7 mg Hydrocortisone
  }

  const stressDoseSufficiency = Math.min(
    100,
    Math.round((totalDailyHydrocortisoneEquivalent / required.requiredDailyHydrocortisoneMg) * 100)
  );

  // Cosyntropin assay integrity check
  let assayIntegrity = true;
  if (treatment.ivBolusHydrocortisoneMg > 0 && !treatment.dexamethasoneUsedAsInitialBolus) {
    assayIntegrity = false;
    alerts.push(
      'DIAGNOSTIC TRAP: Hydrocortisone administered prior to ACTH stimulation cross-reacts with serum cortisol immunoassays. Use Dexamethasone 4 mg IV if diagnostic confirmation is urgently required.'
    );
  }

  // Mineralocorticoid assessment
  let mineralocorticoidSufficient = false;
  const isPrimary = patient.pathology === 'PRIMARY_ADDISONS_AUTOIMMUNE' || patient.pathology === 'PRIMARY_BILATERAL_ADRENAL_HEMORRHAGE';

  if (totalDailyHydrocortisoneEquivalent >= 50) {
    // Hydrocortisone >= 50 mg/day binds renal mineralocorticoid receptors saturating 11beta-HSD2
    mineralocorticoidSufficient = true;
  } else if (treatment.fludrocortisoneDoseMgDaily >= 0.05) {
    mineralocorticoidSufficient = true;
  } else if (!isPrimary) {
    // Secondary/tertiary spares aldosterone (driven by RAAS, not ACTH)
    mineralocorticoidSufficient = true;
  } else {
    alerts.push(
      'MINERALOCORTICOID DEFICIENCY: Hydrocortisone dose is < 50 mg/day without fludrocortisone coverage in primary Addison disease (risk of hyperkalemic hyponatremic shock).'
    );
  }

  // Fluid Resuscitation & Sodium Kinetics
  let predictedSodium = patient.serumSodiumMeqL;
  let predictedPotassium = patient.serumPotassiumMeqL;
  let predictedSbp = patient.systolicBpMmHg;

  if (treatment.isotonicSalineLitersFirst24Hours >= 2.0) {
    predictedSodium = Math.min(138, patient.serumSodiumMeqL + treatment.isotonicSalineLitersFirst24Hours * 3);
    predictedSbp = Math.min(125, patient.systolicBpMmHg + treatment.isotonicSalineLitersFirst24Hours * 7 + (stressDoseSufficiency / 100) * 15);
  } else {
    alerts.push('UNDER-RESUSCITATION: Minimum 2-3 Liters 0.9% Normal Saline required in first 24 hours to restore intravascular volume in adrenal crisis.');
    predictedSbp = Math.max(60, patient.systolicBpMmHg + 5);
  }

  // Potassium clearance with mineralocorticoid activity
  if (mineralocorticoidSufficient && treatment.isotonicSalineLitersFirst24Hours >= 2.0) {
    predictedPotassium = Math.max(3.8, +(patient.serumPotassiumMeqL - 1.2).toFixed(1));
  } else {
    predictedPotassium = +(patient.serumPotassiumMeqL - 0.2).toFixed(1);
  }

  // Hypoglycemia check
  if (patient.serumGlucoseMgDl < 70 && !treatment.dextroseGivenForHypoglycemia) {
    alerts.push('HYPOGLYCEMIA UNCORRECTED: Failure to administer D5W/D5NS with hydrocortisone in adrenal crisis risks neuroglycopenic seizure/coma.');
  }

  const crisisAverted = stressDoseSufficiency >= 85 && treatment.isotonicSalineLitersFirst24Hours >= 2.0 && predictedSbp >= 95;

  return {
    crisisAvertedOrControlled: crisisAverted,
    predicted24HrSystolicBp: Math.round(predictedSbp),
    predicted24HrSerumSodium: Math.round(predictedSodium),
    predicted24HrSerumPotassium: predictedPotassium,
    mineralocorticoidReplacedSufficiently: mineralocorticoidSufficient,
    cosyntropinAssayIntegrityPreserved: assayIntegrity,
    stressDoseSufficiencyPercent: stressDoseSufficiency,
    clinicalSafetyAlerts: alerts,
  };
}
