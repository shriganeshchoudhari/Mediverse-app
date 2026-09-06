/**
 * NeonatalResuscitationEngine.ts
 *
 * Biophysical engine for Neonatal Resuscitation Program (NRP 8th Edition) & APGAR Scoring:
 * - Full APGAR calculation (1, 5, 10 minutes) across 5 standard physiological parameters
 * - NRP 8th Edition decision tree (PPV, MR. SOPA, 3:1 compressions, UVC epinephrine, volume expansion)
 * - Target pre-ductal SpO2 nomogram by minute of life (1 to 10 min)
 * - Weight-based drug dosage calculator (Epinephrine IV/ETT, Normal Saline bolus)
 * - Sarnat criteria for Hypoxic Ischemic Encephalopathy (HIE) & Therapeutic Hypothermia
 * - 8 Comprehensive Clinical Presets
 *
 * Location: frontend/.gemini/skills/NeonatalResuscitationEngine.ts
 */

export interface ApgarParameters {
  appearanceColor: 0 | 1 | 2; // 0=Central cyanosis/pale, 1=Acrocyanosis, 2=Completely pink
  pulseHeartRate: 0 | 1 | 2; // 0=Absent, 1=<100 bpm, 2=>=100 bpm
  grimaceReflex: 0 | 1 | 2; // 0=No response, 1=Grimace, 2=Crying/coughing/sneezing
  activityTone: 0 | 1 | 2; // 0=Flaccid, 1=Some flexion, 2=Active motion
  respirationEffort: 0 | 1 | 2; // 0=Absent/apneic, 1=Weak/irregular/gasping, 2=Vigorous lusty cry
}

export interface ApgarEvaluation {
  totalScore: number;
  category: 'SEVERE_DEPRESSION' | 'MODERATE_DEPRESSION' | 'NORMAL_TRANSITION';
  clinicalSummary: string;
}

export interface NrpInterventionState {
  initialStepsDone: boolean; // Warm, position, clear airway if needed, dry, stimulate
  ppvActive: boolean; // Positive Pressure Ventilation
  mrSopaPerformed: boolean; // Mask, Reposition, Suction, Open mouth, Pressure, Alternative airway
  advancedAirwayPlaced: boolean; // ETT or LMA
  chestCompressionsActive: boolean; // 3:1 ratio (90 compressions + 30 breaths = 120/min)
  epinephrineGiven: boolean;
  volumeExpanderGiven: boolean;
}

export interface NeonatalPatientState {
  gestationalAgeWeeks: number;
  birthWeightKg: number;
  minuteOfLife: number; // 0 to 10 minutes
  heartRateBpm: number;
  preDuctalSpO2Pct: number;
  currentFiO2: number; // 0.21 to 1.0
  interventions: NrpInterventionState;
  apgar1Min: ApgarParameters;
  apgar5Min?: ApgarParameters;
  apgar10Min?: ApgarParameters;
  cordPh?: number;
  cordBaseExcess?: number;
  meconiumPresent: boolean;
  diaphragmaticHerniaSuspected: boolean;
}

export interface NrpStepRecommendation {
  recommendedAction: string;
  targetSpO2Range: [number, number];
  isTargetSpO2Met: boolean;
  fio2AdjustmentGuidance: string;
  epinephrineDoseUvcMg: number;
  epinephrineDoseUvcMl: number; // 1:10,000 solution (0.1 mg/mL) -> 0.2 mL/kg
  epinephrineDoseEttMl: number; // 1.0 mL/kg
  normalSalineBolusMl: number; // 10 mL/kg
  therapeuticHypothermiaEligible: boolean;
  sarnatHieGrade: 'NONE' | 'STAGE_I_MILD' | 'STAGE_II_MODERATE' | 'STAGE_III_SEVERE';
}

export interface NeonatalPreset {
  id: string;
  name: string;
  description: string;
  patient: NeonatalPatientState;
}

/**
 * Pre-ductal SpO2 targets by minute of life (AHA/AAP NRP 8th Edition guidelines)
 */
export const NRP_TARGET_PREDUCTAL_SPO2: { [minute: number]: [number, number] } = {
  1: [60, 65],
  2: [65, 70],
  3: [70, 75],
  4: [75, 80],
  5: [80, 85],
  6: [85, 90],
  7: [85, 90],
  8: [85, 95],
  9: [85, 95],
  10: [85, 95],
};

/**
 * Computes APGAR score from 5 individual components
 */
export function calculateApgarScore(params: ApgarParameters): ApgarEvaluation {
  const totalScore =
    params.appearanceColor +
    params.pulseHeartRate +
    params.grimaceReflex +
    params.activityTone +
    params.respirationEffort;

  let category: ApgarEvaluation['category'] = 'NORMAL_TRANSITION';
  let clinicalSummary = `APGAR score ${totalScore}: Normal physiological transition (7-10). Routine post-delivery care.`;

  if (totalScore <= 3) {
    category = 'SEVERE_DEPRESSION';
    clinicalSummary = `APGAR score ${totalScore}: Severely depressed neonate (0-3). Immediate resuscitation and continuous positive pressure ventilation indicated.`;
  } else if (totalScore <= 6) {
    category = 'MODERATE_DEPRESSION';
    clinicalSummary = `APGAR score ${totalScore}: Moderately depressed (4-6). Requires vigorous clearing, tactile stimulation, and assisted ventilation.`;
  }

  return { totalScore, category, clinicalSummary };
}

/**
 * Master NRP 8th Edition Step-by-Step Decision Engine
 */
export function evaluateNrpStatus(patient: NeonatalPatientState): NrpStepRecommendation {
  const minute = Math.max(1, Math.min(10, Math.round(patient.minuteOfLife)));
  const targetSpO2Range = NRP_TARGET_PREDUCTAL_SPO2[minute] || [85, 95];
  const isTargetSpO2Met =
    patient.preDuctalSpO2Pct >= targetSpO2Range[0] &&
    patient.preDuctalSpO2Pct <= targetSpO2Range[1] + 5;

  let recommendedAction = '';
  let fio2AdjustmentGuidance = '';

  // 1. Airway / Breathing / Circulation hierarchy
  if (patient.diaphragmaticHerniaSuspected) {
    recommendedAction =
      'CRITICAL: Congenital Diaphragmatic Hernia suspected! Bag-mask PPV is STRICTLY CONTRAINDICATED as air enters gastrointestinal tract in chest. Proceed immediately with direct Endotracheal Intubation (ETT) and place orogastric tube to decompress stomach.';
  } else if (patient.heartRateBpm < 60) {
    if (!patient.interventions.ppvActive) {
      recommendedAction =
        'Profound bradycardia (HR < 60 bpm). Immediately initiate Positive Pressure Ventilation (PPV) at 40-60 breaths/min with PIP 20-25 cmH2O and PEEP 5 cmH2O.';
    } else if (!patient.interventions.advancedAirwayPlaced) {
      recommendedAction =
        'HR remains < 60 bpm despite PPV. Perform MR. SOPA corrective steps immediately (Mask adjustment, Reposition head, Suction mouth/nose, Open mouth, Pressure increase) and proceed to emergency Endotracheal Intubation.';
    } else if (!patient.interventions.chestCompressionsActive) {
      recommendedAction =
        'HR < 60 bpm despite 30 seconds of effective ventilation via ETT. Initiate 3:1 coordinated Chest Compressions (90 compressions + 30 breaths = 120 events/min) using 2-thumb encircling technique. Increase FiO2 to 100%.';
    } else if (!patient.interventions.epinephrineGiven) {
      recommendedAction =
        'HR remains < 60 bpm after 60 seconds of compressions and 100% O2. Administer IV Epinephrine via Umbilical Venous Catheter (UVC): 0.02 mg/kg (0.2 mL/kg of 1:10,000) followed by 3 mL Normal Saline flush.';
    } else if (!patient.interventions.volumeExpanderGiven) {
      recommendedAction =
        'Persistent bradycardia/poor perfusion: Administer Normal Saline or O-negative packed RBCs (10 mL/kg IV over 5-10 min) for suspected hypovolemia or fetal-maternal hemorrhage.';
    } else {
      recommendedAction =
        'Continue coordinated 3:1 compressions and 100% ventilation. Repeat UVC Epinephrine every 3-5 minutes. Re-check ETT depth and evaluate for tension pneumothorax with transillumination.';
    }
  } else if (patient.heartRateBpm < 100) {
    if (!patient.interventions.ppvActive) {
      recommendedAction =
        'Heart rate < 100 bpm or apnea/gasping. Initiate Positive Pressure Ventilation (PPV) immediately at 40-60 breaths/min. Connect pre-ductal pulse oximeter on right wrist.';
    } else if (!patient.interventions.mrSopaPerformed) {
      recommendedAction =
        'HR 60-99 bpm with PPV: Verify chest rise. If no chest rise or HR not improving, perform MR. SOPA corrective sequence.';
    } else {
      recommendedAction =
        'Continue effective PPV. Reassess HR and chest rise every 30 seconds. Prepare for laryngeal mask (LMA) or endotracheal intubation if no improvement.';
    }
  } else {
    // HR >= 100 bpm
    if (patient.interventions.ppvActive) {
      recommendedAction =
        'Heart rate >= 100 bpm with effective spontaneous breathing. Gradually wean PPV rate and transition to continuous positive airway pressure (CPAP 5 cmH2O) or blow-by oxygen.';
    } else {
      recommendedAction =
        'Vigorous infant with HR >= 100 bpm and regular respiratory effort. Continue skin-to-skin contact, maintain normothermia (36.5 - 37.5°C), and monitor pre-ductal SpO2.';
    }
  }

  // 2. FiO2 Adjustment Guidance based on minute of life
  if (patient.preDuctalSpO2Pct < targetSpO2Range[0]) {
    fio2AdjustmentGuidance = `Pre-ductal SpO2 (${patient.preDuctalSpO2Pct}%) is below target for minute ${minute} (${targetSpO2Range[0]}-${targetSpO2Range[1]}%). Increase blender FiO2 by 10-20% increments to avoid hypoxia.`;
  } else if (patient.preDuctalSpO2Pct > targetSpO2Range[1] + 5 && patient.currentFiO2 > 0.21) {
    fio2AdjustmentGuidance = `Pre-ductal SpO2 (${patient.preDuctalSpO2Pct}%) exceeds target for minute ${minute}. Titrate blender FiO2 downward by 10% to prevent hyperoxic oxidative stress.`;
  } else {
    fio2AdjustmentGuidance = `Pre-ductal SpO2 is on target for minute ${minute} (${targetSpO2Range[0]}-${targetSpO2Range[1]}%). Maintain current blender FiO2 (${Math.round(patient.currentFiO2 * 100)}%).`;
  }

  // 3. Drug and volume calculations based on birth weight
  const wt = patient.birthWeightKg;
  const epinephrineDoseUvcMg = Math.round(0.02 * wt * 1000) / 1000;
  const epinephrineDoseUvcMl = Math.round(0.2 * wt * 100) / 100; // 0.1 mg/mL 1:10,000 -> 0.2 mL/kg
  const epinephrineDoseEttMl = Math.round(1.0 * wt * 100) / 100; // 1.0 mL/kg
  const normalSalineBolusMl = Math.round(10 * wt * 10) / 10;

  // 4. Sarnat Staging & Therapeutic Hypothermia Eligibility
  let therapeuticHypothermiaEligible = false;
  let sarnatHieGrade: NrpStepRecommendation['sarnatHieGrade'] = 'NONE';

  const cordPh = patient.cordPh ?? 7.25;
  const cordBe = patient.cordBaseExcess ?? -4;

  if (cordPh <= 7.00 || cordBe <= -16 || (patient.apgar10Min && calculateApgarScore(patient.apgar10Min).totalScore <= 5)) {
    if (patient.gestationalAgeWeeks >= 36) {
      therapeuticHypothermiaEligible = true;
      sarnatHieGrade = 'STAGE_II_MODERATE';
    }
  }

  return {
    recommendedAction,
    targetSpO2Range,
    isTargetSpO2Met,
    fio2AdjustmentGuidance,
    epinephrineDoseUvcMg,
    epinephrineDoseUvcMl,
    epinephrineDoseEttMl,
    normalSalineBolusMl,
    therapeuticHypothermiaEligible,
    sarnatHieGrade,
  };
}

/**
 * 8 Clinical Presets
 */
export const NEONATAL_PRESETS: NeonatalPreset[] = [
  {
    id: 'term-vigorous-normal',
    name: 'Term Vigorous Newborn (Normal Transition)',
    description: '39-week 3.4 kg infant born via uncomplicated spontaneous vaginal delivery. Crying vigorously, HR 145 bpm, APGAR 9/9, normal transition on room air (FiO2 0.21).',
    patient: {
      gestationalAgeWeeks: 39,
      birthWeightKg: 3.4,
      minuteOfLife: 1,
      heartRateBpm: 145,
      preDuctalSpO2Pct: 63,
      currentFiO2: 0.21,
      interventions: {
        initialStepsDone: true,
        ppvActive: false,
        mrSopaPerformed: false,
        advancedAirwayPlaced: false,
        chestCompressionsActive: false,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 1, // acrocyanosis
        pulseHeartRate: 2, // >100
        grimaceReflex: 2, // vigorous cry
        activityTone: 2, // active motion
        respirationEffort: 2, // lusty cry
      },
      cordPh: 7.28,
      cordBaseExcess: -3,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'meconium-secondary-apnea',
    name: 'Meconium Aspiration with Secondary Apnea',
    description: '41-week 3.8 kg infant born through thick pea-soup meconium. Limp, apneic, HR 75 bpm. Current guidelines mandate immediate PPV rather than routine direct tracheal suctioning.',
    patient: {
      gestationalAgeWeeks: 41,
      birthWeightKg: 3.8,
      minuteOfLife: 1,
      heartRateBpm: 75,
      preDuctalSpO2Pct: 52,
      currentFiO2: 0.21,
      interventions: {
        initialStepsDone: true,
        ppvActive: true,
        mrSopaPerformed: false,
        advancedAirwayPlaced: false,
        chestCompressionsActive: false,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 0, // pale/cyanotic
        pulseHeartRate: 1, // <100 bpm
        grimaceReflex: 0, // no response
        activityTone: 0, // limp
        respirationEffort: 0, // apneic
      },
      cordPh: 7.12,
      cordBaseExcess: -11,
      meconiumPresent: true,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'severe-asphyxia-full-nrp',
    name: 'Severe Intrapartum Asphyxia (Full NRP Algorithm)',
    description: 'Emergency C-section for cord prolapse: 38-week 3.1 kg infant with profound bradycardia (HR 40 bpm) and no respiratory effort. Requires ETT, 3:1 compressions, and UVC epinephrine.',
    patient: {
      gestationalAgeWeeks: 38,
      birthWeightKg: 3.1,
      minuteOfLife: 3,
      heartRateBpm: 40,
      preDuctalSpO2Pct: 44,
      currentFiO2: 1.0,
      interventions: {
        initialStepsDone: true,
        ppvActive: true,
        mrSopaPerformed: true,
        advancedAirwayPlaced: true,
        chestCompressionsActive: true,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 0,
        pulseHeartRate: 1,
        grimaceReflex: 0,
        activityTone: 0,
        respirationEffort: 0,
      },
      cordPh: 6.89,
      cordBaseExcess: -21,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'preterm-28wk-cpap',
    name: 'Preterm 28-Week Resuscitation (Plastic Wrap & CPAP)',
    description: 'Extremely preterm 28-week 1.1 kg infant. Placed in occlusive polyethylene bag under radiant warmer. Initiated on CPAP 5 cmH2O and blended FiO2 0.30 to avoid hyperoxia.',
    patient: {
      gestationalAgeWeeks: 28,
      birthWeightKg: 1.1,
      minuteOfLife: 2,
      heartRateBpm: 120,
      preDuctalSpO2Pct: 68,
      currentFiO2: 0.30,
      interventions: {
        initialStepsDone: true,
        ppvActive: false,
        mrSopaPerformed: false,
        advancedAirwayPlaced: false,
        chestCompressionsActive: false,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 1,
        pulseHeartRate: 2,
        grimaceReflex: 1,
        activityTone: 1,
        respirationEffort: 1,
      },
      cordPh: 7.24,
      cordBaseExcess: -5,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'congenital-diaphragmatic-hernia',
    name: 'Congenital Diaphragmatic Hernia (Immediate ETT)',
    description: '39-week 3.2 kg infant with scaphoid abdomen and dextrocardia. Bag-mask PPV is strictly contraindicated; requires immediate endotracheal intubation to prevent stomach inflation.',
    patient: {
      gestationalAgeWeeks: 39,
      birthWeightKg: 3.2,
      minuteOfLife: 1,
      heartRateBpm: 85,
      preDuctalSpO2Pct: 56,
      currentFiO2: 1.0,
      interventions: {
        initialStepsDone: true,
        ppvActive: false,
        mrSopaPerformed: false,
        advancedAirwayPlaced: true,
        chestCompressionsActive: false,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 0,
        pulseHeartRate: 1,
        grimaceReflex: 1,
        activityTone: 1,
        respirationEffort: 1,
      },
      cordPh: 7.18,
      cordBaseExcess: -9,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: true,
    },
  },
  {
    id: 'placental-abruption-shock',
    name: 'Placental Abruption & Hemorrhagic Shock',
    description: '37-week 2.9 kg infant delivered amidst massive maternal abruption. Profound pallor, weak pulses, and bradycardia unresponsive to initial PPV. Indication for 10 mL/kg emergency O-neg PRBCs.',
    patient: {
      gestationalAgeWeeks: 37,
      birthWeightKg: 2.9,
      minuteOfLife: 4,
      heartRateBpm: 55,
      preDuctalSpO2Pct: 48,
      currentFiO2: 1.0,
      interventions: {
        initialStepsDone: true,
        ppvActive: true,
        mrSopaPerformed: true,
        advancedAirwayPlaced: true,
        chestCompressionsActive: true,
        epinephrineGiven: true,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 0,
        pulseHeartRate: 1,
        grimaceReflex: 0,
        activityTone: 0,
        respirationEffort: 0,
      },
      cordPh: 6.95,
      cordBaseExcess: -18,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'transient-tachypnea-ttn',
    name: 'Transient Tachypnea of the Newborn (TTN)',
    description: '39-week 3.5 kg infant born via scheduled cesarean delivery without labor. Grunting, tachypneic (RR 78/min) with mild subcostal retractions. Promptly responsive to blow-by and nasal CPAP.',
    patient: {
      gestationalAgeWeeks: 39,
      birthWeightKg: 3.5,
      minuteOfLife: 5,
      heartRateBpm: 135,
      preDuctalSpO2Pct: 84,
      currentFiO2: 0.25,
      interventions: {
        initialStepsDone: true,
        ppvActive: false,
        mrSopaPerformed: false,
        advancedAirwayPlaced: false,
        chestCompressionsActive: false,
        epinephrineGiven: false,
        volumeExpanderGiven: false,
      },
      apgar1Min: {
        appearanceColor: 1,
        pulseHeartRate: 2,
        grimaceReflex: 2,
        activityTone: 2,
        respirationEffort: 1,
      },
      cordPh: 7.30,
      cordBaseExcess: -2,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
  {
    id: 'hie-therapeutic-hypothermia',
    name: 'Moderate HIE with Therapeutic Hypothermia Protocol',
    description: '38-week 3.3 kg infant with uterine rupture. Cord pH 6.92, BE -19, APGAR 1/3/4 at 1/5/10 min. Meets full Sarnat Stage II criteria for 72-hour whole-body cooling to 33.5°C.',
    patient: {
      gestationalAgeWeeks: 38,
      birthWeightKg: 3.3,
      minuteOfLife: 10,
      heartRateBpm: 110,
      preDuctalSpO2Pct: 91,
      currentFiO2: 0.35,
      interventions: {
        initialStepsDone: true,
        ppvActive: true,
        mrSopaPerformed: true,
        advancedAirwayPlaced: true,
        chestCompressionsActive: false,
        epinephrineGiven: true,
        volumeExpanderGiven: true,
      },
      apgar1Min: {
        appearanceColor: 0,
        pulseHeartRate: 1,
        grimaceReflex: 0,
        activityTone: 0,
        respirationEffort: 0,
      },
      apgar10Min: {
        appearanceColor: 1,
        pulseHeartRate: 2,
        grimaceReflex: 0,
        activityTone: 0,
        respirationEffort: 1,
      },
      cordPh: 6.92,
      cordBaseExcess: -19,
      meconiumPresent: false,
      diaphragmaticHerniaSuspected: false,
    },
  },
];
