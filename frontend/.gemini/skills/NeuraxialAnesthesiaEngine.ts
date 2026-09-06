/**
 * NeuraxialAnesthesiaEngine.ts
 *
 * Biophysical, dermatomal, and clinical decision engine for Neuraxial Anesthesia
 * (Spinal, Epidural, Combined Spinal-Epidural [CSE]), Bromage Motor Blockade,
 * High/Total Spinal Crisis Resuscitation, Epidural Test Dose Protocols,
 * Local Anesthetic Systemic Toxicity (LAST) with 20% Lipid Emulsion (Intralipid),
 * and Post-Dural Puncture Headache (PDPH) with Epidural Blood Patch (EBP).
 *
 * Implements:
 * 1. Dermatome Sensory & Autonomic Level Mapping:
 *    - T4: Nipple line (Standard target for Cesarean delivery, upper abdominal laparotomy)
 *    - T6: Xiphoid process (Lower abdominal, pelvic, hernia surgery)
 *    - T10: Umbilicus (Labor analgesia, hip surgery, transurethral resection TURP)
 *    - L1: Inguinal ligament (Knee/foot surgery)
 *    - S1-S5: Saddle perineal block (Anorectal surgery)
 *    - Triad of Blockade: Autonomic sympathetic block is typically 2-4 segments HIGHER
 *      than sensory pinprick block; motor block is 2 segments LOWER.
 * 2. Modified Bromage Scale for Motor Blockade:
 *    - Grade 0 (Nil): Full flexion of hips, knees, and ankles (0% motor block)
 *    - Grade 1 (Partial): Just able to flex knees, full ankle movement (33% motor block)
 *    - Grade 2 (Almost Complete): Unable to flex knees, can flex ankles/toes (66% motor block)
 *    - Grade 3 (Complete): Complete lower extremity motor paralysis (100% motor block)
 * 3. High & Total Spinal Emergency Resuscitation:
 *    - High Spinal (Sensory >= T1, Cervical C3-C5):
 *      - Intercostal paralysis (T1-T11) -> subjective dyspnea, inability to cough
 *      - Phrenic paralysis (C3-C5) -> diaphragmatic arrest -> acute apnea
 *      - Cardioaccelerator block (T1-T4) + Bezold-Jarisch reflex -> profound bradycardia (HR < 40 bpm) + hypotension
 *    - Total Spinal (Intracranial brainstem spread): Loss of consciousness, bilateral dilated fixed pupils, cardiovascular arrest
 *    - Resuscitation sequence: 100% O2, endotracheal intubation, Epinephrine (10-50 mcg IV boluses), Atropine (0.5-1.0 mg), rapid crystalloid co-load
 * 4. Epidural Test Dose Interpretation:
 *    - Standard: 3 mL 1.5% Lidocaine with 1:200,000 Epinephrine (45 mg lidocaine + 15 mcg epinephrine)
 *    - Intravascular criteria: HR increase >= 20 bpm (or SBP rise >= 15 mmHg) within 45 seconds, tinnitus, metallic taste
 *    - Intrathecal (subarachnoid) criteria: Rapid dense motor block (Bromage >= 1) and warm sensory block within 3-5 min
 * 5. ASRA Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Emulsion Protocol:
 *    - Bupivacaine vs Ropivacaine vs Lidocaine cardiotoxicity
 *    - ASRA guidelines: Stop LA, 100% O2, avoid acidosis, Midazolam for seizures, 20% Lipid Emulsion bolus (1.5 mL/kg) + infusion (0.25 mL/kg/min)
 * 6. Post-Dural Puncture Headache (PDPH) & Epidural Blood Patch:
 *    - Classic postural headache (worse standing, relieved supine)
 *    - Epidural Blood Patch: Aseptic injection of 15 - 20 mL autologous blood into epidural space
 *
 * Location: frontend/.gemini/skills/NeuraxialAnesthesiaEngine.ts
 */

export type DermatomeLevel =
  | 'C2'
  | 'C3'
  | 'C4'
  | 'C5'
  | 'C6'
  | 'C7'
  | 'C8'
  | 'T1'
  | 'T2'
  | 'T3'
  | 'T4'
  | 'T5'
  | 'T6'
  | 'T7'
  | 'T8'
  | 'T9'
  | 'T10'
  | 'T11'
  | 'T12'
  | 'L1'
  | 'L2'
  | 'L3'
  | 'L4'
  | 'L5'
  | 'S1'
  | 'S2'
  | 'S3'
  | 'S4'
  | 'S5'
  | 'NONE';

export type BromageGrade = 0 | 1 | 2 | 3;

export interface NeuraxialTechnique {
  type: 'SPINAL' | 'EPIDURAL' | 'CSE';
  punctureInterspace: 'L2_L3' | 'L3_L4' | 'L4_L5';
  needleType: 'WHITACRE_PENCIL_POINT' | 'SPROTTE_PENCIL_POINT' | 'QUINCKE_CUTTING' | 'TUOHY_EPIDURAL';
  needleGauge: number; // e.g. 25, 27, 18
  localAnesthetic: 'BUPIVACAINE_HYPERBARIC_0_75' | 'BUPIVACAINE_ISOBARIC_0_5' | 'ROPIVACAINE_0_5' | 'LIDOCAINE_2_PERCENT';
  localAnestheticDoseMg: number; // e.g. 10 - 15 mg
  adjuvantOpioid: 'FENTANYL_15MCG' | 'SUFENTANIL_5MCG' | 'MORPHINE_DURAMORPH_100MCG' | 'NONE';
  patientPositionDuringBlock: 'SITTING' | 'LATERAL_DECUBITUS' | 'SUPINE' | 'TRENDELENBURG';
}

export interface NeuraxialPatientVitals {
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  respiratoryRateBpm: number;
  oxygenSaturationPct: number;
  patientWeightKg: number;
}

export interface NeuraxialBlockStatus {
  sensoryDermatomeLevel: DermatomeLevel;
  autonomicSympatheticLevel: DermatomeLevel;
  motorBlockBromage: BromageGrade;
  hasDifficultyBreathingOrInabilityToCough: boolean;
  hasNumbnessInHandsOrFingers: boolean; // T1 / C8-C6 involvement
  hasHornerSyndrome: boolean; // Stellate ganglion sympathetic block (ptosis, miosis, anhidrosis)
  hasPhrenicArrest: boolean; // C3-C5 diaphragmatic arrest
  hasTotalSpinalBrainstemSpread: boolean;
}

export interface EpiduralTestDoseEvaluation {
  administered: boolean;
  heartRateIncreaseBpm: number; // >= 20 bpm positive
  systolicBpIncreaseMmHg: number; // >= 15 mmHg positive
  hasPerioralTinglingOrTinnitus: boolean;
  hasRapidMotorWeaknessUnder5Min: boolean;
  isIntravascularCatheter: boolean;
  isIntrathecalCatheter: boolean;
  interpretationVerdict: 'NEGATIVE_SAFE' | 'POSITIVE_INTRAVASCULAR' | 'POSITIVE_INTRATHECAL';
  recommendation: string;
}

export interface LastToxicityEvaluation {
  isActive: boolean;
  symptoms: ('CIRCUMORAL_NUMBNESS' | 'METALLIC_TASTE' | 'TINNITUS' | 'SEIZURES' | 'REFRACTORY_VENTRICULAR_ARRHYTHMIA' | 'CARDIOVASCULAR_COLLAPSE')[];
  lipidEmulsionBolusGiven: boolean;
  lipidEmulsionInfusionStarted: boolean;
  recommendedLipidBolusMl: number; // 1.5 mL/kg of 20% Intralipid
  recommendedLipidInfusionMlHr: number; // 0.25 mL/kg/min * 60 min
  maxCumulativeDoseMl: number; // 12 mL/kg
  contraindicatedDrugsAlerts: string[];
}

export interface PdphEvaluation {
  hasPosturalHeadache: boolean;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'NONE';
  hoursPostPuncture: number;
  associatedSymptoms: ('NECK_STIFFNESS' | 'PHOTOPHOBIA' | 'TINNITUS_AUDITORY' | 'NAUSEA')[];
  epiduralBloodPatchIndicated: boolean;
  recommendedBloodPatchVolumeMl: number; // 15 - 20 mL autologous blood
  conservativeMeasures: string[];
}

export interface MasterNeuraxialEvaluation {
  meanArterialPressureMmHg: number;
  blockAdequacyForSurgery: 'ADEQUATE_CESAREAN_T4' | 'ADEQUATE_LABOR_T10' | 'INADEQUATE_TOO_LOW' | 'DANGEROUSLY_HIGH';
  highSpinalState: 'NORMAL' | 'HIGH_SPINAL_T1_T3' | 'CERVICAL_PHRENIC_ARREST' | 'TOTAL_SPINAL_COLLAPSE';
  emergencyActionsRequired: string[];
  testDoseEval: EpiduralTestDoseEvaluation;
  lastEval: LastToxicityEvaluation;
  pdphEval: PdphEvaluation;
  clinicalAlerts: string[];
}

// Ordered dermatome hierarchy for comparison
export const DERMATOME_ORDER: DermatomeLevel[] = [
  'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8',
  'T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12',
  'L1', 'L2', 'L3', 'L4', 'L5',
  'S1', 'S2', 'S3', 'S4', 'S5',
  'NONE'
];

/**
 * Returns true if dermatome A is cephalad to (higher than or equal to) dermatome B.
 */
export function isDermatomeHigherOrEqual(a: DermatomeLevel, b: DermatomeLevel): boolean {
  if (a === 'NONE') return false;
  if (b === 'NONE') return true;
  const idxA = DERMATOME_ORDER.indexOf(a);
  const idxB = DERMATOME_ORDER.indexOf(b);
  return idxA <= idxB;
}

/**
 * Evaluates the Epidural Test Dose response.
 */
export function evaluateEpiduralTestDose(
  administered: boolean,
  deltaHrBpm: number,
  deltaSbpMmHg: number,
  hasPerioralTinglingOrTinnitus: boolean,
  hasRapidMotorWeaknessUnder5Min: boolean
): EpiduralTestDoseEvaluation {
  if (!administered) {
    return {
      administered: false,
      heartRateIncreaseBpm: 0,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Test dose not yet administered. Inject 3 mL 1.5% Lidocaine with 1:200,000 Epinephrine and monitor for 3-5 minutes.',
    };
  }

  const isIntravascular = deltaHrBpm >= 20 || deltaSbpMmHg >= 15 || hasPerioralTinglingOrTinnitus;
  const isIntrathecal = hasRapidMotorWeaknessUnder5Min;

  let interpretationVerdict: 'NEGATIVE_SAFE' | 'POSITIVE_INTRAVASCULAR' | 'POSITIVE_INTRATHECAL' = 'NEGATIVE_SAFE';
  let recommendation = '';

  if (isIntravascular) {
    interpretationVerdict = 'POSITIVE_INTRAVASCULAR';
    recommendation =
      'POSITIVE TEST DOSE (INTRAVASCULAR): Do NOT inject local anesthetic! Aspirate for blood, withdraw catheter 1-2 cm or remove and replace at another interspace. Epinephrine surge or CNS signs confirm vascular entry.';
  } else if (isIntrathecal) {
    interpretationVerdict = 'POSITIVE_INTRATHECAL';
    recommendation =
      'POSITIVE TEST DOSE (INTRATHECAL): Rapid motor/sensory blockade demonstrates subarachnoid catheter placement. Do NOT use as epidural! Either convert to continuous spinal or remove and replace.';
  } else {
    interpretationVerdict = 'NEGATIVE_SAFE';
    recommendation =
      'NEGATIVE TEST DOSE: No heart rate surge or motor blockade detected. Catheter safely confirmed in epidural space. Proceed with titrated fractional local anesthetic dosing.';
  }

  return {
    administered: true,
    heartRateIncreaseBpm: deltaHrBpm,
    systolicBpIncreaseMmHg: deltaSbpMmHg,
    hasPerioralTinglingOrTinnitus,
    hasRapidMotorWeaknessUnder5Min,
    isIntravascularCatheter: isIntravascular,
    isIntrathecalCatheter: isIntrathecal,
    interpretationVerdict,
    recommendation,
  };
}

/**
 * Calculates ASRA 20% Lipid Emulsion dosing for Local Anesthetic Systemic Toxicity (LAST).
 */
export function calculateLastLipidRescue(patientWeightKg: number): {
  bolusMl: number;
  infusionMlHr: number;
  maxDoseMl: number;
} {
  const weight = Math.max(30, Math.min(150, patientWeightKg));
  const bolusMl = Math.round(weight * 1.5);
  // 0.25 mL/kg/min * 60 min = 15 mL/kg/hr
  const infusionMlHr = Math.round(weight * 0.25 * 60);
  const maxDoseMl = Math.round(weight * 12);

  return {
    bolusMl,
    infusionMlHr,
    maxDoseMl,
  };
}

/**
 * Master Clinical Evaluation of Neuraxial Anesthesia & Complications.
 */
export function evaluateNeuraxialWorkstation(
  technique: NeuraxialTechnique,
  patient: NeuraxialPatientVitals,
  block: NeuraxialBlockStatus,
  testDose: EpiduralTestDoseEvaluation,
  lastState: LastToxicityEvaluation,
  pdphState: PdphEvaluation
): MasterNeuraxialEvaluation {
  const alerts: string[] = [];
  const emergencyActions: string[] = [];
  const mapMmHg = Math.round(patient.diastolicBpMmHg + (patient.systolicBpMmHg - patient.diastolicBpMmHg) / 3);

  // 1. High Spinal vs Total Spinal Determination
  let highSpinalState: 'NORMAL' | 'HIGH_SPINAL_T1_T3' | 'CERVICAL_PHRENIC_ARREST' | 'TOTAL_SPINAL_COLLAPSE' = 'NORMAL';

  if (block.hasTotalSpinalBrainstemSpread) {
    highSpinalState = 'TOTAL_SPINAL_COLLAPSE';
    alerts.push('TOTAL SPINAL COLLAPSE: Loss of consciousness, bilateral dilated fixed pupils, and total vascular collapse.');
    emergencyActions.push('1. Call for emergency obstetric/anesthesia arrest team');
    emergencyActions.push('2. Immediate endotracheal intubation with 100% O2');
    emergencyActions.push('3. Epinephrine 50 - 100 mcg IV bolus for profound vasodilation and bradycardia');
    emergencyActions.push('4. Atropine 1 mg IV for cardioaccelerator denervation (T1-T4)');
    emergencyActions.push('5. Left uterine displacement (LUD) if pregnant to relieve aortocaval compression');
  } else if (block.hasPhrenicArrest || isDermatomeHigherOrEqual(block.sensoryDermatomeLevel, 'C4')) {
    highSpinalState = 'CERVICAL_PHRENIC_ARREST';
    alerts.push('HIGH SPINAL (PHRENIC PARALYSIS): Diaphragmatic arrest (C3-C5 involvement) with inability to breathe.');
    emergencyActions.push('1. Assist ventilation with bag-mask 100% O2 and prepare immediate intubation');
    emergencyActions.push('2. Phenylephrine 100 mcg or Ephedrine 10 mg for profound sympathectomy');
    emergencyActions.push('3. Rapid crystalloid IV bolus 1000 mL');
  } else if (isDermatomeHigherOrEqual(block.sensoryDermatomeLevel, 'T2') || block.hasNumbnessInHandsOrFingers) {
    highSpinalState = 'HIGH_SPINAL_T1_T3';
    alerts.push('HIGH SPINAL (T1-T3): Cardioaccelerator fibers blocked. Monitor closely for Bezold-Jarisch severe bradycardia.');
    emergencyActions.push('1. Administer Ephedrine 5-10 mg or Glycopyrrolate 0.2 mg to treat bradycardia');
    emergencyActions.push('2. Elevate head of bed slightly (if block placed > 20 min prior) to halt further rostral spread');
  }

  // 2. Surgical Adequacy Evaluation
  let blockAdequacyForSurgery: 'ADEQUATE_CESAREAN_T4' | 'ADEQUATE_LABOR_T10' | 'INADEQUATE_TOO_LOW' | 'DANGEROUSLY_HIGH' =
    'INADEQUATE_TOO_LOW';

  if (highSpinalState !== 'NORMAL') {
    blockAdequacyForSurgery = 'DANGEROUSLY_HIGH';
  } else if (isDermatomeHigherOrEqual(block.sensoryDermatomeLevel, 'T4')) {
    blockAdequacyForSurgery = 'ADEQUATE_CESAREAN_T4';
  } else if (isDermatomeHigherOrEqual(block.sensoryDermatomeLevel, 'T10')) {
    blockAdequacyForSurgery = 'ADEQUATE_LABOR_T10';
  } else {
    blockAdequacyForSurgery = 'INADEQUATE_TOO_LOW';
    alerts.push('Block level is below T10. Inadequate for labor analgesia or abdominal surgical intervention.');
  }

  // 3. LAST Toxicity Check
  const lipidDoses = calculateLastLipidRescue(patient.patientWeightKg);
  const contraindicatedDrugsAlerts: string[] = [];

  if (lastState.isActive) {
    alerts.push('LOCAL ANESTHETIC SYSTEMIC TOXICITY (LAST) ACTIVE: Stop infusion, administer 20% Lipid Emulsion immediately!');
    emergencyActions.push(`1. Administer 20% Lipid Emulsion bolus: ${lipidDoses.bolusMl} mL IV over 2-3 minutes`);
    emergencyActions.push(`2. Start continuous 20% Lipid infusion: ${lipidDoses.infusionMlHr} mL/hr`);
    emergencyActions.push('3. Suppress seizures with Midazolam 1-2 mg IV (avoid large propofol doses)');
    contraindicatedDrugsAlerts.push('CONTRAINDICATED: Vasopressin (causes pulmonary vasoconstriction and poor resuscitation)');
    contraindicatedDrugsAlerts.push('CONTRAINDICATED: Calcium Channel Blockers and Beta-Blockers');
    contraindicatedDrugsAlerts.push('REDUCE Epinephrine dose: Use small boluses (< 1 mcg/kg, e.g. 10-20 mcg)');
  }

  // 4. PDPH Check
  let epiduralBloodPatchIndicated = false;
  const conservativeMeasures: string[] = [
    'Oral hydration (2 - 3 L/day) and caffeine 300 mg PO',
    'Acetaminophen 1g + Ibuprofen 400 mg every 6-8 hours',
    'Horizontal bed rest (relieves gravitational CSF traction on meninges)',
  ];

  if (pdphState.hasPosturalHeadache && (pdphState.severity === 'SEVERE' || pdphState.severity === 'MODERATE')) {
    epiduralBloodPatchIndicated = true;
    alerts.push('Severe Post-Dural Puncture Headache: Epidural Blood Patch (EBP) is the definitive gold standard treatment.');
  }

  return {
    meanArterialPressureMmHg: mapMmHg,
    blockAdequacyForSurgery,
    highSpinalState,
    emergencyActionsRequired: emergencyActions,
    testDoseEval: testDose,
    lastEval: {
      ...lastState,
      recommendedLipidBolusMl: lipidDoses.bolusMl,
      recommendedLipidInfusionMlHr: lipidDoses.infusionMlHr,
      maxCumulativeDoseMl: lipidDoses.maxDoseMl,
      contraindicatedDrugsAlerts,
    },
    pdphEval: {
      ...pdphState,
      epiduralBloodPatchIndicated,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures,
    },
    clinicalAlerts: alerts,
  };
}

// -------------------------------------------------------------------------
// CLINICAL PRESETS (8 Comprehensive Realistic Scenarios)
// -------------------------------------------------------------------------

export interface NeuraxialPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  technique: NeuraxialTechnique;
  patient: NeuraxialPatientVitals;
  block: NeuraxialBlockStatus;
  testDose: EpiduralTestDoseEvaluation;
  lastState: LastToxicityEvaluation;
  pdphState: PdphEvaluation;
}

export const NEURAXIAL_PRESETS: NeuraxialPreset[] = [
  {
    id: 'IDEAL_LABOR_EPIDURAL',
    name: 'Ideal Labor Analgesia Epidural (T10 Sensory, Bromage 0)',
    category: 'Obstetric Analgesia',
    description:
      '26-year-old primigravida at 5 cm cervical dilation. Lumbar epidural placed at L3-L4 using 18G Tuohy needle. T10 sensory level bilaterally with 0.1% Ropivacaine + 2 mcg/mL Fentanyl. Bromage 0 allows maternal mobility ("walking epidural").',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'ROPIVACAINE_0_5',
      localAnestheticDoseMg: 20,
      adjuvantOpioid: 'FENTANYL_15MCG',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 78,
      systolicBpMmHg: 118,
      diastolicBpMmHg: 72,
      respiratoryRateBpm: 16,
      oxygenSaturationPct: 99,
      patientWeightKg: 68,
    },
    block: {
      sensoryDermatomeLevel: 'T10',
      autonomicSympatheticLevel: 'T6',
      motorBlockBromage: 0,
      hasDifficultyBreathingOrInabilityToCough: false,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: true,
      heartRateIncreaseBpm: 4,
      systolicBpIncreaseMmHg: 2,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Negative test dose. Proceed with programmed intermittent epidural bolus (PIEB).',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 102,
      recommendedLipidInfusionMlHr: 1020,
      maxCumulativeDoseMl: 816,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'ELECTIVE_CESAREAN_SPINAL',
    name: 'Elective Cesarean Spinal (T4 Sensory Level, Bromage 3)',
    category: 'Obstetric Anesthesia',
    description:
      '31-year-old for repeat elective Cesarean section. Spinal anesthesia at L3-L4 using 25G Whitacre pencil-point needle. Hyperbaric Bupivacaine 12 mg + Fentanyl 15 mcg + Morphine 100 mcg. Crisp T4 sensory level achieved with Bromage 3 motor block.',
    technique: {
      type: 'SPINAL',
      punctureInterspace: 'L3_L4',
      needleType: 'WHITACRE_PENCIL_POINT',
      needleGauge: 25,
      localAnesthetic: 'BUPIVACAINE_HYPERBARIC_0_75',
      localAnestheticDoseMg: 12,
      adjuvantOpioid: 'MORPHINE_DURAMORPH_100MCG',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 84,
      systolicBpMmHg: 112,
      diastolicBpMmHg: 68,
      respiratoryRateBpm: 15,
      oxygenSaturationPct: 99,
      patientWeightKg: 74,
    },
    block: {
      sensoryDermatomeLevel: 'T4',
      autonomicSympatheticLevel: 'T2',
      motorBlockBromage: 3,
      hasDifficultyBreathingOrInabilityToCough: false,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: false,
      heartRateIncreaseBpm: 0,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Single-shot spinal; test dose not applicable.',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 111,
      recommendedLipidInfusionMlHr: 1110,
      maxCumulativeDoseMl: 888,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'HIGH_SPINAL_T1_BRADYCARDIA',
    name: 'High Spinal Anesthesia (T1 Block & Bezold-Jarisch Bradycardia)',
    category: 'Neuraxial Emergencies',
    description:
      'Excessive cephalad spread of hyperbaric spinal block following steep Trendelenburg positioning. Sensory level reaches T1 with numbness in little fingers (C8). Cardioaccelerator fibers (T1-T4) blocked, triggering severe bradycardia (HR 36 bpm) and hypotension (BP 72/40).',
    technique: {
      type: 'SPINAL',
      punctureInterspace: 'L2_L3',
      needleType: 'SPROTTE_PENCIL_POINT',
      needleGauge: 25,
      localAnesthetic: 'BUPIVACAINE_HYPERBARIC_0_75',
      localAnestheticDoseMg: 15,
      adjuvantOpioid: 'FENTANYL_15MCG',
      patientPositionDuringBlock: 'TRENDELENBURG',
    },
    patient: {
      heartRateBpm: 36,
      systolicBpMmHg: 72,
      diastolicBpMmHg: 40,
      respiratoryRateBpm: 18,
      oxygenSaturationPct: 96,
      patientWeightKg: 65,
    },
    block: {
      sensoryDermatomeLevel: 'T1',
      autonomicSympatheticLevel: 'C6',
      motorBlockBromage: 3,
      hasDifficultyBreathingOrInabilityToCough: true,
      hasNumbnessInHandsOrFingers: true,
      hasHornerSyndrome: true,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: false,
      heartRateIncreaseBpm: 0,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Emergency high spinal management required.',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 98,
      recommendedLipidInfusionMlHr: 975,
      maxCumulativeDoseMl: 780,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'TOTAL_SPINAL_BRAINSTEM_COLLAPSE',
    name: 'Total Spinal Crisis (Phrenic Arrest & Brainstem Spread)',
    category: 'Neuraxial Emergencies',
    description:
      'Inadvertent subarachnoid injection of large-volume epidural dose (15 mL 2% Lidocaine). Rapid cephalad ascension into cervical cisterns and brainstem. Complete diaphragmatic phrenic arrest (C3-C5), loss of consciousness, unreactive mydriasis, and profound asystolic threat.',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'LIDOCAINE_2_PERCENT',
      localAnestheticDoseMg: 300,
      adjuvantOpioid: 'NONE',
      patientPositionDuringBlock: 'SUPINE',
    },
    patient: {
      heartRateBpm: 32,
      systolicBpMmHg: 45,
      diastolicBpMmHg: 22,
      respiratoryRateBpm: 0,
      oxygenSaturationPct: 78,
      patientWeightKg: 70,
    },
    block: {
      sensoryDermatomeLevel: 'C2',
      autonomicSympatheticLevel: 'C2',
      motorBlockBromage: 3,
      hasDifficultyBreathingOrInabilityToCough: true,
      hasNumbnessInHandsOrFingers: true,
      hasHornerSyndrome: true,
      hasPhrenicArrest: true,
      hasTotalSpinalBrainstemSpread: true,
    },
    testDose: {
      administered: false,
      heartRateIncreaseBpm: 0,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Execute Total Spinal Code sequence immediately.',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 105,
      recommendedLipidInfusionMlHr: 1050,
      maxCumulativeDoseMl: 840,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'POSITIVE_TEST_DOSE_INTRAVASCULAR',
    name: 'Positive Epidural Test Dose (Intravascular Epinephrine Surge)',
    category: 'Epidural Catheter Safety',
    description:
      'Following epidural catheter threading, 3 mL 1.5% Lidocaine with 1:200,000 Epinephrine was injected. At 35 seconds, heart rate spiked by +28 bpm (72 -> 100 bpm), SBP rose by +22 mmHg, and patient reported metallic taste and tinnitus. Intravascular placement confirmed.',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'LIDOCAINE_2_PERCENT',
      localAnestheticDoseMg: 45,
      adjuvantOpioid: 'NONE',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 100,
      systolicBpMmHg: 142,
      diastolicBpMmHg: 86,
      respiratoryRateBpm: 18,
      oxygenSaturationPct: 99,
      patientWeightKg: 68,
    },
    block: {
      sensoryDermatomeLevel: 'NONE',
      autonomicSympatheticLevel: 'NONE',
      motorBlockBromage: 0,
      hasDifficultyBreathingOrInabilityToCough: false,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: true,
      heartRateIncreaseBpm: 28,
      systolicBpIncreaseMmHg: 22,
      hasPerioralTinglingOrTinnitus: true,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: true,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'POSITIVE_INTRAVASCULAR',
      recommendation: 'POSITIVE TEST DOSE: Catheter is in an epidural vein. Do NOT inject further! Withdraw or re-site catheter.',
    },
    lastState: {
      isActive: false,
      symptoms: ['METALLIC_TASTE', 'TINNITUS'],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 102,
      recommendedLipidInfusionMlHr: 1020,
      maxCumulativeDoseMl: 816,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'ACCIDENTAL_INTRATHECAL_EPIDURAL',
    name: 'Accidental Subarachnoid Catheter (Rapid Dense Motor Block)',
    category: 'Epidural Catheter Safety',
    description:
      '3 mL test dose administered through suspected epidural catheter. Within 3.5 minutes, patient develops dense sensory block up to T6 and Bromage 2 motor block (unable to lift legs). Confirms subarachnoid catheter placement.',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'LIDOCAINE_2_PERCENT',
      localAnestheticDoseMg: 45,
      adjuvantOpioid: 'NONE',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 70,
      systolicBpMmHg: 104,
      diastolicBpMmHg: 62,
      respiratoryRateBpm: 15,
      oxygenSaturationPct: 99,
      patientWeightKg: 72,
    },
    block: {
      sensoryDermatomeLevel: 'T6',
      autonomicSympatheticLevel: 'T4',
      motorBlockBromage: 2,
      hasDifficultyBreathingOrInabilityToCough: false,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: true,
      heartRateIncreaseBpm: 3,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: true,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: true,
      interpretationVerdict: 'POSITIVE_INTRATHECAL',
      recommendation: 'POSITIVE INTRATHECAL: Catheter is subarachnoid. Do NOT administer planned 10-15 mL epidural bolus! Re-label as spinal or replace.',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 108,
      recommendedLipidInfusionMlHr: 1080,
      maxCumulativeDoseMl: 864,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'LAST_BUPIVACAINE_TOXICITY',
    name: 'Bupivacaine LAST & 20% Lipid Emulsion Rescue Protocol',
    category: 'Toxicology & Safety',
    description:
      'Inadvertent intravenous injection of 20 mL 0.5% Bupivacaine (100 mg). Patient experiences tonic-clonic seizures, followed rapidly by widened QRS complexes, ventricular tachycardia, and cardiovascular collapse. 20% Lipid Emulsion indicated immediately.',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'BUPIVACAINE_ISOBARIC_0_5',
      localAnestheticDoseMg: 100,
      adjuvantOpioid: 'NONE',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 140,
      systolicBpMmHg: 58,
      diastolicBpMmHg: 30,
      respiratoryRateBpm: 8,
      oxygenSaturationPct: 82,
      patientWeightKg: 70,
    },
    block: {
      sensoryDermatomeLevel: 'NONE',
      autonomicSympatheticLevel: 'NONE',
      motorBlockBromage: 0,
      hasDifficultyBreathingOrInabilityToCough: true,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: false,
      heartRateIncreaseBpm: 0,
      systolicBpIncreaseMmHg: 0,
      hasPerioralTinglingOrTinnitus: true,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: true,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'POSITIVE_INTRAVASCULAR',
      recommendation: 'LAST EMERGENCY: Follow ASRA 20% Lipid Emulsion Checklist.',
    },
    lastState: {
      isActive: true,
      symptoms: [
        'CIRCUMORAL_NUMBNESS',
        'METALLIC_TASTE',
        'TINNITUS',
        'SEIZURES',
        'REFRACTORY_VENTRICULAR_ARRHYTHMIA',
        'CARDIOVASCULAR_COLLAPSE',
      ],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 105,
      recommendedLipidInfusionMlHr: 1050,
      maxCumulativeDoseMl: 840,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: false,
      severity: 'NONE',
      hoursPostPuncture: 0,
      associatedSymptoms: [],
      epiduralBloodPatchIndicated: false,
      recommendedBloodPatchVolumeMl: 18,
      conservativeMeasures: [],
    },
  },
  {
    id: 'SEVERE_PDPH_BLOOD_PATCH',
    name: 'Severe Post-Dural Puncture Headache (Epidural Blood Patch)',
    category: 'Post-Procedure Complications',
    description:
      '24-year-old postpartum day 2 post-unintentional dural puncture with 17G Tuohy needle ("wet tap"). Severe incapacitating bifrontal/occipital headache upon sitting upright, accompanied by photophobia, neck stiffness, and auditory muffling. Bed rest and caffeine failed. Epidural Blood Patch indicated.',
    technique: {
      type: 'EPIDURAL',
      punctureInterspace: 'L3_L4',
      needleType: 'TUOHY_EPIDURAL',
      needleGauge: 18,
      localAnesthetic: 'ROPIVACAINE_0_5',
      localAnestheticDoseMg: 20,
      adjuvantOpioid: 'FENTANYL_15MCG',
      patientPositionDuringBlock: 'SITTING',
    },
    patient: {
      heartRateBpm: 76,
      systolicBpMmHg: 114,
      diastolicBpMmHg: 70,
      respiratoryRateBpm: 16,
      oxygenSaturationPct: 99,
      patientWeightKg: 64,
    },
    block: {
      sensoryDermatomeLevel: 'NONE',
      autonomicSympatheticLevel: 'NONE',
      motorBlockBromage: 0,
      hasDifficultyBreathingOrInabilityToCough: false,
      hasNumbnessInHandsOrFingers: false,
      hasHornerSyndrome: false,
      hasPhrenicArrest: false,
      hasTotalSpinalBrainstemSpread: false,
    },
    testDose: {
      administered: true,
      heartRateIncreaseBpm: 2,
      systolicBpIncreaseMmHg: 2,
      hasPerioralTinglingOrTinnitus: false,
      hasRapidMotorWeaknessUnder5Min: false,
      isIntravascularCatheter: false,
      isIntrathecalCatheter: false,
      interpretationVerdict: 'NEGATIVE_SAFE',
      recommendation: 'Block resolved; patient now symptomatic with PDPH.',
    },
    lastState: {
      isActive: false,
      symptoms: [],
      lipidEmulsionBolusGiven: false,
      lipidEmulsionInfusionStarted: false,
      recommendedLipidBolusMl: 96,
      recommendedLipidInfusionMlHr: 960,
      maxCumulativeDoseMl: 768,
      contraindicatedDrugsAlerts: [],
    },
    pdphState: {
      hasPosturalHeadache: true,
      severity: 'SEVERE',
      hoursPostPuncture: 48,
      associatedSymptoms: ['NECK_STIFFNESS', 'PHOTOPHOBIA', 'TINNITUS_AUDITORY', 'NAUSEA'],
      epiduralBloodPatchIndicated: true,
      recommendedBloodPatchVolumeMl: 20,
      conservativeMeasures: [
        'Hydration & Caffeine oral therapy',
        'Acetaminophen & NSAIDs',
        'Supine posture maintenance',
      ],
    },
  },
];
