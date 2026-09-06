/**
 * PreeclampsiaMgso4Engine.ts
 *
 * Biophysical & Clinical Decision Engine for Hypertensive Disorders of Pregnancy,
 * ACOG Preeclampsia with Severe Features, Zuspan/Pritchard Magnesium Sulfate (MgSO4) Kinetics,
 * Toxicity Cascades, 10% Calcium Gluconate Antidote, and Emergent Antihypertensives.
 *
 * Location: frontend/.gemini/skills/PreeclampsiaMgso4Engine.ts
 */

export type GestationalHypertensionClassification =
  | 'CHRONIC_HYPERTENSION'
  | 'GESTATIONAL_HYPERTENSION'
  | 'PREECLAMPSIA_WITHOUT_SEVERE_FEATURES'
  | 'PREECLAMPSIA_WITH_SEVERE_FEATURES'
  | 'HELLP_SYNDROME'
  | 'ECLAMPSIA'
  | 'NORMOTENSIVE_PREGNANCY';

export type MagnesiumToxicityStage =
  | 'SUBTHERAPEUTIC' // < 4.8 mg/dL (< 2.0 mmol/L)
  | 'THERAPEUTIC' // 4.8 - 8.4 mg/dL (2.0 - 3.5 mmol/L)
  | 'LOSS_OF_REFLEXES' // 9.0 - 12.0 mg/dL (loss of deep tendon reflexes, patellar hyporeflexia)
  | 'RESPIRATORY_DEPRESSION' // 12.0 - 15.0 mg/dL (RR < 12, hypoventilation, arrest)
  | 'CARDIAC_ARREST'; // > 15.0 - 20.0 mg/dL (AV nodal block, asystole)

export interface MaternalObstetricVitals {
  gestationalAgeWeeks: number; // e.g. 34.5 weeks
  systolicBpMmHg: number; // e.g. 172
  diastolicBpMmHg: number; // e.g. 114
  heartRateBpm: number; // e.g. 88
  respiratoryRateBpm: number; // e.g. 16 or 8
  oxygenSaturationPct: number; // e.g. 98 or 88
  urineOutputMlHr: number; // e.g. 18 (oliguria) or 45
  patellarReflexGrade: 0 | 1 | 2 | 3 | 4; // 0=absent, 1=hypoactive, 2=normal, 3=hyperactive, 4=clonus
  hasActiveSeizure: boolean; // tonic-clonic eclampsia
  hasPersistentSevereHeadacheOrVisualChanges: boolean; // scotomata, photopsia
  hasSevereEpigastricOrRuqPain: boolean; // hepatic capsular stretch
  hasPulmonaryEdema: boolean; // rales, orthopnea
}

export interface MaternalLabs {
  plateletCountPerUl: number; // normal 150k-400k; < 100k is severe
  serumCreatinineMgDl: number; // normal in preg 0.4-0.8; > 1.1 or 2x baseline is severe
  astUperL: number; // normal 10-35; > 70 is severe
  altUperL: number; // normal 10-35; > 70 is severe
  ldhUperL: number; // > 600 indicates hemolysis
  urineProteinToCreatinineRatio: number; // >= 0.3 indicates preeclampsia
  twentyFourHourUrineProteinMg: number; // >= 300 mg indicates preeclampsia
}

export interface Mgso4Regimen {
  loadingDoseGrams: number; // typically 4 or 6 g IV over 15-20 min
  maintenanceRateGramsHr: number; // typically 1 or 2 g/hr IV (or 0)
  calciumGluconateAdministered: boolean; // 10% 1g IV push
  calciumDoseGrams: number; // 1.0 g
  infusionHoursElapsed: number; // hours of infusion
  antihypertensiveSelected: 'NONE' | 'LABETALOL_IV' | 'HYDRALAZINE_IV' | 'NIFEDIPINE_ORAL';
  antihypertensiveDoseGiven: string; // e.g. "Labetalol 20 mg IV"
}

export interface PreeclampsiaEvaluation {
  classification: GestationalHypertensionClassification;
  hasSevereFeatures: boolean;
  severeFeatureCriteriaMet: string[];
  estimatedSerumMagnesiumMgDl: number;
  serumMagnesiumMmolL: number;
  magnesiumToxicityStage: MagnesiumToxicityStage;
  isMagnesiumToxic: boolean;
  mgso4IndicationRecommendation: string;
  antihypertensiveRecommendation: string;
  deliveryTimingRecommendation: string;
  emergencyActionRequired: string;
  clinicalSafetyAlerts: string[];
}

/**
 * Evaluates whether maternal criteria meet ACOG Preeclampsia with Severe Features
 */
export function evaluateSevereFeatureCriteria(
  vitals: MaternalObstetricVitals,
  labs: MaternalLabs
): { hasSevere: boolean; criteria: string[] } {
  const criteria: string[] = [];

  // Severe Hypertension
  if (vitals.systolicBpMmHg >= 160 || vitals.diastolicBpMmHg >= 110) {
    criteria.push(
      `Severe Blood Pressure Range (BP ${vitals.systolicBpMmHg}/${vitals.diastolicBpMmHg} mmHg >= 160/110)`
    );
  }

  // Thrombocytopenia
  if (labs.plateletCountPerUl < 100000) {
    criteria.push(
      `Thrombocytopenia (Platelets ${labs.plateletCountPerUl.toLocaleString()} /µL < 100,000 /µL)`
    );
  }

  // Impaired Liver Function
  if (labs.astUperL >= 70 || labs.altUperL >= 70) {
    criteria.push(
      `Impaired Hepatic Function (AST ${labs.astUperL} U/L or ALT ${labs.altUperL} U/L >= 2x Upper Limit of Normal)`
    );
  }

  // Severe persistent RUQ or epigastric pain
  if (vitals.hasSevereEpigastricOrRuqPain) {
    criteria.push(
      'Severe Persistent Epigastric / Right Upper Quadrant Pain (Glisson Capsule Distension)'
    );
  }

  // Renal Insufficiency
  if (labs.serumCreatinineMgDl > 1.1) {
    criteria.push(
      `Renal Insufficiency (Serum Creatinine ${labs.serumCreatinineMgDl} mg/dL > 1.1 mg/dL)`
    );
  }

  // Pulmonary Edema
  if (vitals.hasPulmonaryEdema) {
    criteria.push('Pulmonary Edema with Hypoxemia');
  }

  // Persistent Neurological / Visual Symptoms
  if (vitals.hasPersistentSevereHeadacheOrVisualChanges) {
    criteria.push(
      'New-Onset Persistent Severe Headache Unresponsive to Medication or Scotomata / Photopsia'
    );
  }

  return {
    hasSevere: criteria.length > 0,
    criteria,
  };
}

/**
 * Classifies the exact hypertensive disorder of pregnancy
 */
export function classifyHypertensiveDisorder(
  vitals: MaternalObstetricVitals,
  labs: MaternalLabs
): GestationalHypertensionClassification {
  if (vitals.hasActiveSeizure) {
    return 'ECLAMPSIA';
  }

  // HELLP Syndrome (Hemolysis LDH >= 600, AST >= 70, Platelets < 100k)
  if (
    labs.ldhUperL >= 600 &&
    (labs.astUperL >= 70 || labs.altUperL >= 70) &&
    labs.plateletCountPerUl < 100000
  ) {
    return 'HELLP_SYNDROME';
  }

  const isHypertensive =
    vitals.systolicBpMmHg >= 140 || vitals.diastolicBpMmHg >= 90;

  if (!isHypertensive) {
    return 'NORMOTENSIVE_PREGNANCY';
  }

  const { hasSevere } = evaluateSevereFeatureCriteria(vitals, labs);

  const hasProteinuria =
    labs.urineProteinToCreatinineRatio >= 0.3 ||
    labs.twentyFourHourUrineProteinMg >= 300;

  if (vitals.gestationalAgeWeeks < 20) {
    return 'CHRONIC_HYPERTENSION';
  }

  if (hasSevere) {
    return 'PREECLAMPSIA_WITH_SEVERE_FEATURES';
  }

  if (hasProteinuria) {
    return 'PREECLAMPSIA_WITHOUT_SEVERE_FEATURES';
  }

  return 'GESTATIONAL_HYPERTENSION';
}

/**
 * Computes circulating serum magnesium level and toxicity status
 * based on renal function, urine output, infusion rate, and calcium gluconate antidote.
 */
export function computeMagnesiumKinetics(
  regimen: Mgso4Regimen,
  urineOutputMlHr: number,
  serumCreatinineMgDl: number
): {
  estimatedMgMgDl: number;
  estimatedMgMmolL: number;
  stage: MagnesiumToxicityStage;
  isToxic: boolean;
} {
  // Baseline physiological magnesium in pregnancy: ~ 1.8 mg/dL
  let level = 1.8;

  // Loading dose effect: 4g adds ~ 2.5 mg/dL; 6g adds ~ 3.5 mg/dL
  if (regimen.loadingDoseGrams > 0) {
    level += (regimen.loadingDoseGrams / 4) * 2.6;
  }

  // Maintenance rate effect over time:
  // Magnesium is 100% renally cleared.
  // Normal GFR/UO (>= 35 mL/hr) achieves steady state around 5.5 - 6.5 mg/dL at 2 g/hr.
  // Oliguria (< 30 mL/hr) or elevated creatinine (> 1.1) causes rapid drug accumulation!
  const renalClearanceFactor =
    urineOutputMlHr < 20 || serumCreatinineMgDl >= 1.5
      ? 1.8 // severe accumulation
      : urineOutputMlHr < 30 || serumCreatinineMgDl > 1.1
      ? 1.4 // moderate accumulation
      : 1.0; // normal clearance

  const infusionAccumulation =
    regimen.maintenanceRateGramsHr *
    Math.min(regimen.infusionHoursElapsed, 12) *
    0.30 *
    renalClearanceFactor;

  level += infusionAccumulation;

  // Calcium Gluconate Antidote effect:
  // Calcium competitively antagonizes magnesium at motor endplate and cardiac conduction
  if (regimen.calciumGluconateAdministered) {
    // Physiologically reduces effective toxicity by displacing Mg
    level = Math.max(2.4, level - 4.5);
  }

  level = parseFloat(level.toFixed(1));
  const mmolL = parseFloat((level * 0.4114).toFixed(2));

  // Determine toxicity stage
  let stage: MagnesiumToxicityStage = 'THERAPEUTIC';
  if (level < 4.8) {
    stage = 'SUBTHERAPEUTIC';
  } else if (level <= 8.4) {
    stage = 'THERAPEUTIC';
  } else if (level < 12.0) {
    stage = 'LOSS_OF_REFLEXES';
  } else if (level < 15.0) {
    stage = 'RESPIRATORY_DEPRESSION';
  } else {
    stage = 'CARDIAC_ARREST';
  }

  const isToxic = level > 8.4 && !regimen.calciumGluconateAdministered;

  return {
    estimatedMgMgDl: level,
    estimatedMgMmolL: mmolL,
    stage,
    isToxic,
  };
}

/**
 * Master Workstation Evaluation Function
 */
export function evaluatePreeclampsiaWorkstation(
  vitals: MaternalObstetricVitals,
  labs: MaternalLabs,
  regimen: Mgso4Regimen
): PreeclampsiaEvaluation {
  const { hasSevere, criteria } = evaluateSevereFeatureCriteria(vitals, labs);
  const classification = classifyHypertensiveDisorder(vitals, labs);

  const { estimatedMgMgDl, estimatedMgMmolL, stage, isToxic } =
    computeMagnesiumKinetics(
      regimen,
      vitals.urineOutputMlHr,
      labs.serumCreatinineMgDl
    );

  // MgSO4 Recommendation
  let mgRec = '';
  if (classification === 'ECLAMPSIA') {
    mgRec =
      'CRITICAL ECLAMPSIA SEIZURE PROTOCOL: Administer Magnesium Sulfate 6 g IV loading dose over 15–20 minutes, followed by 2 g/hr continuous infusion. If recurrent seizures occur, administer an additional 2 g IV bolus over 5 minutes. Maintain airway, left lateral uterine displacement, and supplemental oxygen.';
  } else if (
    classification === 'PREECLAMPSIA_WITH_SEVERE_FEATURES' ||
    classification === 'HELLP_SYNDROME'
  ) {
    mgRec =
      'SEIZURE PROPHYLAXIS MANDATED (ACOG Level A): Initiate Magnesium Sulfate Zuspan regimen (4 to 6 g IV loading dose over 20 minutes, followed by 1 to 2 g/hr continuous infusion) for seizure prevention during labor and 24 hours postpartum.';
  } else if (classification === 'PREECLAMPSIA_WITHOUT_SEVERE_FEATURES') {
    mgRec =
      'Preeclampsia without severe features: Routine magnesium sulfate seizure prophylaxis is controversial / optional per ACOG. Close clinical observation for development of severe features is required.';
  } else {
    mgRec =
      'Magnesium sulfate is not indicated for chronic or uncomplicated gestational hypertension in the absence of preeclampsia.';
  }

  // Emergent Antihypertensive Protocol (ACOG Guidelines)
  let antihtnRec = '';
  const isSevereBP = vitals.systolicBpMmHg >= 160 || vitals.diastolicBpMmHg >= 110;
  if (isSevereBP) {
    antihtnRec =
      'EMERGENT ANTIHYPERTENSIVE THERAPY MANDATED (Goal: reduce BP to 140–150 / 90–100 mmHg within 30–60 min to prevent hemorrhagic stroke): First-line options: (1) IV Labetalol: 20 mg IV push over 2 min, re-check BP in 10 min; if still severe, give 40 mg, then 80 mg (max 220 mg). (2) IV Hydralazine: 5 to 10 mg IV over 2 min, re-check BP in 20 min; repeat 10 mg if needed. (3) Oral Nifedipine: 10 to 20 mg immediate-release PO.';
  } else if (vitals.systolicBpMmHg >= 140 || vitals.diastolicBpMmHg >= 90) {
    antihtnRec =
      'Non-severe hypertension (140–159 / 90–109 mmHg): Pharmacotherapy optional unless chronic hypertension or persistent diastolic >= 100 mmHg. Avoid over-reduction of BP to maintain uteroplacental perfusion.';
  } else {
    antihtnRec = 'Blood pressure is within acceptable physiological parameters.';
  }

  // Delivery Timing Recommendation (ACOG Guidelines)
  let deliveryRec = '';
  if (
    classification === 'ECLAMPSIA' ||
    classification === 'HELLP_SYNDROME' ||
    vitals.hasPulmonaryEdema
  ) {
    deliveryRec =
      'EMERGENT DELIVERY INDICATED: Stabilize maternal airway, hemodynamic status, and magnesium infusion, then proceed with expeditious delivery regardless of gestational age. Vaginal delivery preferred if cervix favorable, otherwise Cesarean delivery.';
  } else if (classification === 'PREECLAMPSIA_WITH_SEVERE_FEATURES') {
    if (vitals.gestationalAgeWeeks >= 34) {
      deliveryRec =
        'Delivery indicated at >= 34.0 weeks gestation for preeclampsia with severe features after maternal stabilization.';
    } else {
      deliveryRec =
        'Gestational age < 34.0 weeks: Expectant management in a tertiary care center with maternal-fetal subspecialists. Administer Betamethasone (12 mg IM q24h x 2 doses) for fetal lung maturity. Deliver immediately if maternal or fetal deterioration occurs.';
    }
  } else if (
    classification === 'PREECLAMPSIA_WITHOUT_SEVERE_FEATURES' ||
    classification === 'GESTATIONAL_HYPERTENSION'
  ) {
    deliveryRec =
      'Delivery recommended at 37.0 weeks gestation, or earlier if spontaneous labor, non-reassuring fetal status, or progression to severe features.';
  } else {
    deliveryRec = 'Routine obstetric care and expectant management to term.';
  }

  // Emergency Action Required
  let emergencyAction = '';
  if (vitals.hasActiveSeizure) {
    emergencyAction =
      'ACTIVE ECLAMPTIC SEIZURE: Call for obstetric code team, ensure maternal left lateral tilt, suction oropharynx, administer high-flow oxygen, and push Magnesium Sulfate 6g IV load over 15–20 minutes!';
  } else if (isToxic) {
    emergencyAction =
      'MAGNESIUM TOXICITY DETECTED: Immediately STOP magnesium infusion! Check airway and ventilation. Administer 10% Calcium Gluconate 1 g (10 mL) IV push slowly over 3 to 5 minutes. Monitor patellar reflexes and respiratory rate.';
  } else if (isSevereBP) {
    emergencyAction =
      'EMERGENT SEVERE HYPERTENSION: Administer IV Labetalol 20 mg or Hydralazine 10 mg within 15 minutes to prevent intracranial hemorrhage!';
  } else {
    emergencyAction =
      'Continue standard preeclampsia monitoring: hourly vitals, patellar reflexes, respiratory rate, and strict intake/output charting.';
  }

  // Clinical Safety Alerts
  const alerts: string[] = [];
  if (vitals.hasActiveSeizure) {
    alerts.push(
      'ACTIVE ECLAMPSIA SEIZURE: Prevent maternal hypoxia, trauma, and aspiration. Magnesium sulfate is drug of choice, far superior to Phenytoin or Diazepam.'
    );
  }
  if (vitals.urineOutputMlHr < 30) {
    alerts.push(
      `OLIGURIA DETECTED (${vitals.urineOutputMlHr} mL/hr < 30 mL/hr): Magnesium is eliminated 100% by the kidneys. Oliguria leads to rapid, fatal toxic accumulation. Reduce or hold maintenance rate!`
    );
  }
  if (vitals.respiratoryRateBpm < 12) {
    alerts.push(
      `RESPIRATORY DEPRESSION (RR ${vitals.respiratoryRateBpm} breaths/min < 12): Sign of severe magnesium toxicity. Stop infusion and prepare 10% Calcium Gluconate!`
    );
  }
  if (vitals.patellarReflexGrade === 0 && regimen.loadingDoseGrams > 0) {
    alerts.push(
      'ABSENT PATELLAR REFLEXES (Grade 0): Earliest clinical manifestation of magnesium toxicity (serum level 9–12 mg/dL). Hold infusion and check serum level.'
    );
  }
  if (labs.plateletCountPerUl < 50000) {
    alerts.push(
      `CRITICAL THROMBOCYTOPENIA (${labs.plateletCountPerUl.toLocaleString()} /µL): Neuraxial anesthesia (spinal/epidural) is strictly contraindicated due to risk of epidural hematoma. Prepare platelet transfusion for delivery.`
    );
  }
  if (vitals.hasPulmonaryEdema) {
    alerts.push(
      'PULMONARY EDEMA ACTIVE: Restrict fluids, administer IV Furosemide 20–40 mg, provide supplemental O2/CPAP, and deliver expeditiously.'
    );
  }

  return {
    classification,
    hasSevereFeatures: hasSevere,
    severeFeatureCriteriaMet: criteria,
    estimatedSerumMagnesiumMgDl: estimatedMgMgDl,
    serumMagnesiumMmolL: estimatedMgMmolL,
    magnesiumToxicityStage: stage,
    isMagnesiumToxic: isToxic,
    mgso4IndicationRecommendation: mgRec,
    antihypertensiveRecommendation: antihtnRec,
    deliveryTimingRecommendation: deliveryRec,
    emergencyActionRequired: emergencyAction,
    clinicalSafetyAlerts: alerts,
  };
}

/**
 * Pre-configured clinical scenarios for simulation
 */
export interface PreeclampsiaPreset {
  id: string;
  name: string;
  description: string;
  vitals: MaternalObstetricVitals;
  labs: MaternalLabs;
  regimen: Mgso4Regimen;
}

export const PREECLAMPSIA_PRESETS: PreeclampsiaPreset[] = [
  {
    id: 'PREECLAMPSIA_SEVERE_FEATURES_LABOR',
    name: 'Preeclampsia with Severe Features in Active Labor',
    description:
      '36-week primigravida with BP 172/114 mmHg, severe frontal headache, 3+ hyperreflexia, and proteinuria. Zuspan MgSO4 loading dose and IV Labetalol indicated.',
    vitals: {
      gestationalAgeWeeks: 36.2,
      systolicBpMmHg: 172,
      diastolicBpMmHg: 114,
      heartRateBpm: 88,
      respiratoryRateBpm: 18,
      oxygenSaturationPct: 98,
      urineOutputMlHr: 45,
      patellarReflexGrade: 3,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: true,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 145000,
      serumCreatinineMgDl: 0.9,
      astUperL: 42,
      altUperL: 38,
      ldhUperL: 320,
      urineProteinToCreatinineRatio: 0.85,
      twentyFourHourUrineProteinMg: 950,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 2,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 2,
      antihypertensiveSelected: 'LABETALOL_IV',
      antihypertensiveDoseGiven: 'Labetalol 20 mg IV push',
    },
  },
  {
    id: 'ACTIVE_ECLAMPTIC_SEIZURE_ACUTE',
    name: 'Acute Eclamptic Seizure Crisis (Airway & 6g MgSO4 Bolus)',
    description:
      '31-week woman with witnessed generalized tonic-clonic seizure, BP 180/120 mmHg, and post-ictal stertorous breathing. Immediate 6g MgSO4 bolus, airway protection, and emergent delivery planning.',
    vitals: {
      gestationalAgeWeeks: 31.4,
      systolicBpMmHg: 180,
      diastolicBpMmHg: 120,
      heartRateBpm: 125,
      respiratoryRateBpm: 24,
      oxygenSaturationPct: 92,
      urineOutputMlHr: 35,
      patellarReflexGrade: 4,
      hasActiveSeizure: true,
      hasPersistentSevereHeadacheOrVisualChanges: true,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 115000,
      serumCreatinineMgDl: 1.2,
      astUperL: 85,
      altUperL: 78,
      ldhUperL: 520,
      urineProteinToCreatinineRatio: 1.4,
      twentyFourHourUrineProteinMg: 1800,
    },
    regimen: {
      loadingDoseGrams: 6,
      maintenanceRateGramsHr: 2,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 1,
      antihypertensiveSelected: 'LABETALOL_IV',
      antihypertensiveDoseGiven: 'Labetalol 40 mg IV push',
    },
  },
  {
    id: 'MAGNESIUM_TOXICITY_RESPIRATORY_ARREST',
    name: 'Oliguric Magnesium Toxicity & Respiratory Depression',
    description:
      '35-week woman on 2g/hr MgSO4 infusion with acute kidney injury, urine output 12 mL/hr, absent deep tendon reflexes (grade 0), respiratory rate 8 bpm, and serum Mg 13.5 mg/dL. 10% Calcium Gluconate antidote mandated.',
    vitals: {
      gestationalAgeWeeks: 35.0,
      systolicBpMmHg: 148,
      diastolicBpMmHg: 94,
      heartRateBpm: 58,
      respiratoryRateBpm: 8,
      oxygenSaturationPct: 88,
      urineOutputMlHr: 12,
      patellarReflexGrade: 0,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: false,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 130000,
      serumCreatinineMgDl: 2.1,
      astUperL: 45,
      altUperL: 40,
      ldhUperL: 380,
      urineProteinToCreatinineRatio: 0.9,
      twentyFourHourUrineProteinMg: 1100,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 2,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 8,
      antihypertensiveSelected: 'NONE',
      antihypertensiveDoseGiven: 'None',
    },
  },
  {
    id: 'HELLP_SYNDROME_THROMBOCYTOPENIA',
    name: 'HELLP Syndrome with Critical Thrombocytopenia',
    description:
      '33-week gravida with epigastric pain, platelet count 38,000 /µL, AST 380 U/L, and LDH 1,150 U/L. Neuraxial blockade contraindicated; requires maternal stabilization and expeditious delivery.',
    vitals: {
      gestationalAgeWeeks: 33.1,
      systolicBpMmHg: 164,
      diastolicBpMmHg: 106,
      heartRateBpm: 96,
      respiratoryRateBpm: 18,
      oxygenSaturationPct: 97,
      urineOutputMlHr: 30,
      patellarReflexGrade: 3,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: false,
      hasSevereEpigastricOrRuqPain: true,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 38000,
      serumCreatinineMgDl: 1.0,
      astUperL: 380,
      altUperL: 320,
      ldhUperL: 1150,
      urineProteinToCreatinineRatio: 1.2,
      twentyFourHourUrineProteinMg: 1400,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 1,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 3,
      antihypertensiveSelected: 'HYDRALAZINE_IV',
      antihypertensiveDoseGiven: 'Hydralazine 10 mg IV',
    },
  },
  {
    id: 'ACUTE_PULMONARY_EDEMA_PREECLAMPSIA',
    name: 'Severe Preeclampsia with Acute Pulmonary Edema',
    description:
      '37-week woman with BP 185/122 mmHg, dyspnea, bilateral crackles, SpO2 86%, and orthopnea. Requires immediate IV Furosemide, supplemental oxygen, IV labetalol, and emergent delivery.',
    vitals: {
      gestationalAgeWeeks: 37.0,
      systolicBpMmHg: 185,
      diastolicBpMmHg: 122,
      heartRateBpm: 112,
      respiratoryRateBpm: 28,
      oxygenSaturationPct: 86,
      urineOutputMlHr: 22,
      patellarReflexGrade: 2,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: true,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: true,
    },
    labs: {
      plateletCountPerUl: 165000,
      serumCreatinineMgDl: 1.3,
      astUperL: 55,
      altUperL: 48,
      ldhUperL: 410,
      urineProteinToCreatinineRatio: 1.8,
      twentyFourHourUrineProteinMg: 2200,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 1,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 2,
      antihypertensiveSelected: 'LABETALOL_IV',
      antihypertensiveDoseGiven: 'Labetalol 20 mg IV push',
    },
  },
  {
    id: 'REFRACTORY_SEVERE_HYPERTENSION_CASCADE',
    name: 'Refractory Severe Hypertension (Stepwise Labetalol Cascade)',
    description:
      'BP remains 176/116 mmHg despite Labetalol 20 mg. Demonstrates ACOG recommended escalation: Labetalol 40 mg -> 80 mg -> Hydralazine 10 mg.',
    vitals: {
      gestationalAgeWeeks: 35.5,
      systolicBpMmHg: 176,
      diastolicBpMmHg: 116,
      heartRateBpm: 92,
      respiratoryRateBpm: 16,
      oxygenSaturationPct: 98,
      urineOutputMlHr: 50,
      patellarReflexGrade: 2,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: false,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 180000,
      serumCreatinineMgDl: 0.8,
      astUperL: 32,
      altUperL: 28,
      ldhUperL: 260,
      urineProteinToCreatinineRatio: 0.55,
      twentyFourHourUrineProteinMg: 600,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 2,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 1,
      antihypertensiveSelected: 'LABETALOL_IV',
      antihypertensiveDoseGiven: 'Labetalol 40 mg IV push',
    },
  },
  {
    id: 'GESTATIONAL_HYPERTENSION_TERM',
    name: 'Gestational Hypertension at 38 Weeks (Non-Severe)',
    description:
      '38-week gravida with new-onset BP 146/92 mmHg, no proteinuria, normal labs, and no symptoms. Delivery recommended without routine magnesium sulfate.',
    vitals: {
      gestationalAgeWeeks: 38.2,
      systolicBpMmHg: 146,
      diastolicBpMmHg: 92,
      heartRateBpm: 76,
      respiratoryRateBpm: 15,
      oxygenSaturationPct: 99,
      urineOutputMlHr: 60,
      patellarReflexGrade: 2,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: false,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 240000,
      serumCreatinineMgDl: 0.6,
      astUperL: 22,
      altUperL: 18,
      ldhUperL: 190,
      urineProteinToCreatinineRatio: 0.15,
      twentyFourHourUrineProteinMg: 120,
    },
    regimen: {
      loadingDoseGrams: 0,
      maintenanceRateGramsHr: 0,
      calciumGluconateAdministered: false,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 0,
      antihypertensiveSelected: 'NONE',
      antihypertensiveDoseGiven: 'None',
    },
  },
  {
    id: 'CALCIUM_GLUCONATE_REVERSED_TOXICITY',
    name: 'Magnesium Toxicity Successfully Reversed with 10% Calcium Gluconate',
    description:
      'Post-antidote verification: patient previously had respiratory depression from magnesium overdose; 1g 10% Calcium Gluconate IV restored spontaneous ventilation and reflexes.',
    vitals: {
      gestationalAgeWeeks: 34.0,
      systolicBpMmHg: 142,
      diastolicBpMmHg: 88,
      heartRateBpm: 72,
      respiratoryRateBpm: 14,
      oxygenSaturationPct: 98,
      urineOutputMlHr: 25,
      patellarReflexGrade: 1,
      hasActiveSeizure: false,
      hasPersistentSevereHeadacheOrVisualChanges: false,
      hasSevereEpigastricOrRuqPain: false,
      hasPulmonaryEdema: false,
    },
    labs: {
      plateletCountPerUl: 155000,
      serumCreatinineMgDl: 1.2,
      astUperL: 40,
      altUperL: 35,
      ldhUperL: 310,
      urineProteinToCreatinineRatio: 0.7,
      twentyFourHourUrineProteinMg: 800,
    },
    regimen: {
      loadingDoseGrams: 4,
      maintenanceRateGramsHr: 1,
      calciumGluconateAdministered: true,
      calciumDoseGrams: 1.0,
      infusionHoursElapsed: 6,
      antihypertensiveSelected: 'NONE',
      antihypertensiveDoseGiven: 'None',
    },
  },
];
