/**
 * VentilatorWeaningEngine.ts
 * Pulmonology, Intensive Care & Mechanical Ventilation Engine.
 * Implements Yang-Tobin RSBI & Dynamic Rate-of-Rise, P0.1 Neuromuscular Drive,
 * Diaphragmatic Ultrasound (Excursion & Thickening Fraction TFdi),
 * Spontaneous Breathing Trial (SBT: PSV vs T-Piece) Criteria, and Cuff Leak Test.
 * Location: frontend/.gemini/skills/VentilatorWeaningEngine.ts
 */

export type SbtTechnique = 'low_level_psv' | 't_piece' | 'cpap_zero_peep';
export type WeaningFailureReason =
  | 'none'
  | 'excessive_work_of_breathing'
  | 'ventilator_induced_diaphragmatic_dysfunction'
  | 'laryngeal_edema_failed_cuff_leak'
  | 'blunted_central_respiratory_drive'
  | 'cardiovascular_weaning_failure_diastolic_overload';

export interface PatientWeaningState {
  patientAge: number;
  daysIntubated: number;
  currentSbtTechnique: SbtTechnique;
  sbtDurationMinutes: number; // 0 to 120 min

  // Respiratory Mechanics & Pattern
  respiratoryRateBpm: number;
  tidalVolumeMl: number;
  initialSbtRsbi: number; // RSBI at minute 1 of trial
  p01AirwayOcclusionPressureCmH2o: number; // 1.0 - 2.0 normal; > 3.5-4.0 excessive drive
  rapidShallowBreathingPattern: boolean; // thoracoabdominal paradox / retractions

  // Point-of-Care Diaphragmatic Ultrasound (POCUS)
  diaphragmaticExcursionCm: number; // normal > 1.0 - 1.5 cm
  endInspiratoryThicknessMm: number; // e.g. 2.8 mm
  endExpiratoryThicknessMm: number; // e.g. 2.0 mm

  // Gas Exchange & Hemodynamics
  spo2Percent: number;
  fio2Delivered: number; // 0.21 - 1.0
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;

  // Cuff Leak Test (Post-Extubation Stridor Screen)
  cuffLeakVolumeMl: number; // < 110 mL = failed leak / high stridor risk
  baselineInspiratoryVtMl: number; // for % leak calculation

  // Pre-Extubation Interventions
  steroidProphylaxisActive: boolean; // IV methylprednisolone for failed cuff leak
}

export interface RsbiAudit {
  rsbiValue: number;
  isRsbiFavorable: boolean; // < 105 breaths/min/L
  rsbiRateOfRisePercent: number; // % change from start of SBT
  isFatiguingOverTime: boolean; // rise > 20%
  clinicalInterpretation: string;
}

export interface DiaphragmaticUltrasoundAudit {
  thickeningFractionPercent: number;
  isThickeningAdequate: boolean; // >= 30%
  isExcursionAdequate: boolean; // >= 1.0 cm
  hasVidd: boolean; // Ventilator-Induced Diaphragmatic Dysfunction
  ultrasoundSummary: string;
}

export interface SbtEvaluationReport {
  isSbtSuccessful: boolean;
  readyForExtubation: boolean;
  failureTriggers: string[];
  extubationSafetyChecklist: string[];
  weaningFailureClassification: WeaningFailureReason;
  actionableRecommendations: string[];
}

export interface CuffLeakAudit {
  cuffLeakPercentage: number;
  isLeakAdequate: boolean; // absolute >= 110 mL and >= 15%
  stridorRisk: 'Low (< 5%)' | 'Intermediate (15-20%)' | 'High (> 35% - Laryngeal Edema)';
  steroidIndicationNote: string;
}

export interface WeaningScenario {
  id: string;
  name: string;
  patientSummary: string;
  initialState: PatientWeaningState;
  clinicalPearls: string[];
}

/**
 * 1. Rapid Shallow Breathing Index (Yang-Tobin) & Rate of Rise Kinetics
 * RSBI = RR / Vt (in Liters)
 */
export function calculateRsbi(state: PatientWeaningState): RsbiAudit {
  const { respiratoryRateBpm: rr, tidalVolumeMl: vtMl, initialSbtRsbi, sbtDurationMinutes } = state;
  const vtLiters = Math.max(0.05, vtMl / 1000);
  const rsbiValue = Math.round(rr / vtLiters);

  const isRsbiFavorable = rsbiValue < 105;

  let rsbiRateOfRisePercent = 0;
  if (initialSbtRsbi > 0) {
    rsbiRateOfRisePercent = Math.round(((rsbiValue - initialSbtRsbi) / initialSbtRsbi) * 100);
  }

  // Rate of rise > 20% during SBT heralds diaphragmatic exhaustion
  const isFatiguingOverTime = sbtDurationMinutes >= 30 && rsbiRateOfRisePercent > 20;

  let clinicalInterpretation = `RSBI is favorable (${rsbiValue} < 105). High predictive validity for extubation success.`;
  if (!isRsbiFavorable) {
    clinicalInterpretation = `RSBI elevated (${rsbiValue} >= 105 breaths/min/L): Severe rapid shallow breathing pattern indicating ventilatory fatigue.`;
  } else if (isFatiguingOverTime) {
    clinicalInterpretation = `RSBI has risen by ${rsbiRateOfRisePercent}% during the trial (initial ${initialSbtRsbi} -> current ${rsbiValue}). Silent diaphragmatic fatigue detected despite single snapshot < 105.`;
  }

  return {
    rsbiValue,
    isRsbiFavorable,
    rsbiRateOfRisePercent,
    isFatiguingOverTime,
    clinicalInterpretation,
  };
}

/**
 * 2. Bedside Diaphragmatic Ultrasound: Excursion & Thickening Fraction (TFdi)
 * TFdi (%) = ((Tinsp - Texp) / Texp) * 100
 */
export function calculateDiaphragmaticUltrasound(state: PatientWeaningState): DiaphragmaticUltrasoundAudit {
  const { diaphragmaticExcursionCm: de, endInspiratoryThicknessMm: tinsp, endExpiratoryThicknessMm: texp } = state;
  const effectiveTexp = Math.max(0.5, texp);
  const thickeningFractionPercent = Math.round(((tinsp - effectiveTexp) / effectiveTexp) * 100);

  const isThickeningAdequate = thickeningFractionPercent >= 30;
  const isExcursionAdequate = de >= 1.0;
  const hasVidd = !isThickeningAdequate || !isExcursionAdequate;

  let ultrasoundSummary = 'Normal diaphragmatic contractile recruitment (TFdi >= 30% and Excursion >= 1.0 cm).';
  if (hasVidd) {
    ultrasoundSummary = `Ventilator-Induced Diaphragmatic Dysfunction (VIDD) detected: Thickening fraction (${thickeningFractionPercent}%) < 30% or Excursion (${de} cm) < 1.0 cm. Diaphragmatic atrophy from prolonged mechanical ventilation.`;
  }

  return {
    thickeningFractionPercent,
    isThickeningAdequate,
    isExcursionAdequate,
    hasVidd,
    ultrasoundSummary,
  };
}

/**
 * 3. Quantitative Cuff Leak Test Audit (Post-Extubation Stridor Screen)
 */
export function auditCuffLeak(state: PatientWeaningState): CuffLeakAudit {
  const { cuffLeakVolumeMl: leakMl, baselineInspiratoryVtMl: vtInspMl, steroidProphylaxisActive } = state;
  const effectiveVt = Math.max(100, vtInspMl);
  const cuffLeakPercentage = Math.round((leakMl / effectiveVt) * 100);

  const isLeakAdequate = leakMl >= 110 && cuffLeakPercentage >= 15;

  let stridorRisk: CuffLeakAudit['stridorRisk'] = 'Low (< 5%)';
  let steroidIndicationNote = 'Adequate air leak around deflated cuff confirms patent upper airway. Low risk of post-extubation stridor.';

  if (leakMl < 80 || cuffLeakPercentage < 10) {
    stridorRisk = 'High (> 35% - Laryngeal Edema)';
    steroidIndicationNote = steroidProphylaxisActive
      ? 'High stridor risk: Cuff leak < 110 mL indicates severe laryngeal edema. Corticosteroid prophylaxis active; ensure minimum 4-6 hours pre-treatment before extubation.'
      : 'CRITICAL LARYNGEAL EDEMA: Cuff leak < 110 mL (< 10%). Immediate extubation will precipitate acute post-extubation stridor. Administer IV Methylprednisolone 20 mg q4h x 4 doses and postpone extubation 6-12 hours.';
  } else if (!isLeakAdequate) {
    stridorRisk = 'Intermediate (15-20%)';
    steroidIndicationNote = 'Borderline cuff leak (80-110 mL). Pre-extubation steroids recommended if high-risk features (female, intubation > 6 days, large ETT) present.';
  }

  return {
    cuffLeakPercentage,
    isLeakAdequate,
    stridorRisk,
    steroidIndicationNote,
  };
}

/**
 * 4. Comprehensive Spontaneous Breathing Trial (SBT) & Extubation Readiness Evaluation
 */
export function evaluateSbtReadiness(state: PatientWeaningState): SbtEvaluationReport {
  const rsbiAudit = calculateRsbi(state);
  const pocusAudit = calculateDiaphragmaticUltrasound(state);
  const cuffAudit = auditCuffLeak(state);

  const failureTriggers: string[] = [];
  const extubationSafetyChecklist: string[] = [];
  const actionableRecommendations: string[] = [];
  let weaningFailureClassification: WeaningFailureReason = 'none';

  // Check RSBI
  if (!rsbiAudit.isRsbiFavorable) {
    failureTriggers.push(`RSBI failure (${rsbiAudit.rsbiValue} >= 105 breaths/min/L)`);
    weaningFailureClassification = 'excessive_work_of_breathing';
  } else if (rsbiAudit.isFatiguingOverTime) {
    failureTriggers.push(`Dynamic RSBI fatigue (+${rsbiAudit.rsbiRateOfRisePercent}% rise over trial)`);
    weaningFailureClassification = 'excessive_work_of_breathing';
  } else {
    extubationSafetyChecklist.push(`RSBI favorable (${rsbiAudit.rsbiValue} < 105)`);
  }

  // Check P0.1 Neuromuscular Drive
  if (state.p01AirwayOcclusionPressureCmH2o > 4.0) {
    failureTriggers.push(`Excessive neuro-ventilatory drive (P0.1 ${state.p01AirwayOcclusionPressureCmH2o} > 4.0 cmH2O): Imminent exhaustion`);
    if (weaningFailureClassification === 'none') weaningFailureClassification = 'excessive_work_of_breathing';
  } else if (state.p01AirwayOcclusionPressureCmH2o < 1.0) {
    failureTriggers.push(`Blunted central respiratory drive (P0.1 ${state.p01AirwayOcclusionPressureCmH2o} < 1.0 cmH2O): Over-sedation or encephalopathy`);
    weaningFailureClassification = 'blunted_central_respiratory_drive';
  } else {
    extubationSafetyChecklist.push(`Normal respiratory drive (P0.1 ${state.p01AirwayOcclusionPressureCmH2o} cmH2O)`);
  }

  // Check VIDD / Ultrasound
  if (pocusAudit.hasVidd) {
    failureTriggers.push(`Diaphragmatic dysfunction (TFdi ${pocusAudit.thickeningFractionPercent}% < 30% or Excursion ${state.diaphragmaticExcursionCm} < 1.0 cm)`);
    if (weaningFailureClassification === 'none') weaningFailureClassification = 'ventilator_induced_diaphragmatic_dysfunction';
  } else {
    extubationSafetyChecklist.push(`Diaphragmatic strength preserved (TFdi ${pocusAudit.thickeningFractionPercent}%)`);
  }

  // Check Vital Signs & Gas Exchange
  if (state.respiratoryRateBpm > 35) failureTriggers.push(`Tachypnea (RR ${state.respiratoryRateBpm} > 35 bpm)`);
  if (state.respiratoryRateBpm < 8) failureTriggers.push(`Bradypnea (RR ${state.respiratoryRateBpm} < 8 bpm)`);
  if (state.spo2Percent < 90) failureTriggers.push(`Hypoxemia (SpO2 ${state.spo2Percent}% < 90%)`);
  if (state.heartRateBpm > 130) failureTriggers.push(`Severe tachycardia (HR ${state.heartRateBpm} > 130 bpm)`);
  if (state.systolicBpMmHg > 180) {
    failureTriggers.push(`Hypertensive crisis (SBP ${state.systolicBpMmHg} > 180 mmHg): Cardiovascular weaning failure`);
    weaningFailureClassification = 'cardiovascular_weaning_failure_diastolic_overload';
  }
  if (state.rapidShallowBreathingPattern) {
    failureTriggers.push('Thoracoabdominal paradoxical breathing / accessory muscle retractions');
  }

  // Check Cuff Leak
  if (!cuffAudit.isLeakAdequate && !state.steroidProphylaxisActive) {
    failureTriggers.push(`Failed Cuff Leak (${cuffAudit.cuffLeakPercentage}% / ${state.cuffLeakVolumeMl} mL): High laryngeal edema risk`);
    if (weaningFailureClassification === 'none') weaningFailureClassification = 'laryngeal_edema_failed_cuff_leak';
  } else if (!cuffAudit.isLeakAdequate && state.steroidProphylaxisActive) {
    extubationSafetyChecklist.push('Failed cuff leak mitigated by active corticosteroid pre-treatment');
  } else {
    extubationSafetyChecklist.push(`Patent upper airway confirmed (Cuff leak ${state.cuffLeakVolumeMl} mL)`);
  }

  const isSbtSuccessful = failureTriggers.length === 0;
  const readyForExtubation = isSbtSuccessful && state.sbtDurationMinutes >= 30;

  if (readyForExtubation) {
    actionableRecommendations.push('PATIENT MEETS ALL EXTUBATION CRITERIA: Suction oropharynx, deflate cuff, and extubate to nasal cannula / low-flow O2.');
  } else {
    actionableRecommendations.push('ABORT EXTUBATION: Resume resting assist-control ventilation to rest respiratory musculature.');
    if (weaningFailureClassification === 'ventilator_induced_diaphragmatic_dysfunction') {
      actionableRecommendations.push('VIDD Protocol: Avoid over-assistance (excessive PSV causes diaphragm disuse); train diaphragm with proportional assist ventilation (PAV+) or neurally adjusted ventilatory assist (NAVA).');
    } else if (weaningFailureClassification === 'laryngeal_edema_failed_cuff_leak') {
      actionableRecommendations.push('Administer IV Methylprednisolone 20 mg q4h x 4 doses and repeat cuff leak test in 12 hours.');
    } else if (weaningFailureClassification === 'cardiovascular_weaning_failure_diastolic_overload') {
      actionableRecommendations.push('Cardiac Weaning Failure: Abrupt loss of positive intrathoracic pressure increases venous return and LV afterload, unmasking acute diastolic pulmonary edema. Administer pre-SBT IV Furosemide or Nitroglycerin.');
    }
  }

  return {
    isSbtSuccessful,
    readyForExtubation,
    failureTriggers,
    extubationSafetyChecklist,
    weaningFailureClassification,
    actionableRecommendations,
  };
}

/**
 * 5. Standard Weaning Clinical Scenarios Catalog
 */
export const WEANING_SCENARIOS: Record<string, WeaningScenario> = {
  successful_psv_wean: {
    id: 'successful_psv_wean',
    name: '1. Smooth Wean: Post-Op Day 3 Laparotomy (Low-Level PSV Success)',
    patientSummary:
      '58yo male intubated 72 hours for septic shock secondary to perforated diverticulitis, now resolved. PSV 7/5, RR 18, Vt 480 mL (RSBI 38), P0.1 1.6 cmH2O, TFdi 38%, Cuff leak 210 mL.',
    initialState: {
      patientAge: 58,
      daysIntubated: 3,
      currentSbtTechnique: 'low_level_psv',
      sbtDurationMinutes: 30,
      respiratoryRateBpm: 18,
      tidalVolumeMl: 480,
      initialSbtRsbi: 36,
      p01AirwayOcclusionPressureCmH2o: 1.6,
      rapidShallowBreathingPattern: false,
      diaphragmaticExcursionCm: 1.6,
      endInspiratoryThicknessMm: 3.2,
      endExpiratoryThicknessMm: 2.3,
      spo2Percent: 97,
      fio2Delivered: 0.35,
      heartRateBpm: 84,
      systolicBpMmHg: 126,
      diastolicBpMmHg: 76,
      cuffLeakVolumeMl: 210,
      baselineInspiratoryVtMl: 480,
      steroidProphylaxisActive: false,
    },
    clinicalPearls: [
      'RSBI is 18 / 0.48 = 37.5 (< 105), stable throughout trial.',
      'Low-level PSV (7 cmH2O) overcomes endotracheal tube resistance without masking weaning failure (JAMA 2019).',
      'Extubation directly indicated.',
    ],
  },
  vidd_diaphragmatic_atrophy: {
    id: 'vidd_diaphragmatic_atrophy',
    name: '2. Difficult Wean: Ventilator-Induced Diaphragmatic Dysfunction (VIDD)',
    patientSummary:
      '68yo female intubated 14 days for severe ARDS with prolonged paralytic infusion. T-Piece SBT at min 45: RR 34, Vt 260 mL (RSBI 131), P0.1 5.2 cmH2O, Diaphragm TFdi 14% (severe atrophy).',
    initialState: {
      patientAge: 68,
      daysIntubated: 14,
      currentSbtTechnique: 't_piece',
      sbtDurationMinutes: 45,
      respiratoryRateBpm: 34,
      tidalVolumeMl: 260,
      initialSbtRsbi: 75,
      p01AirwayOcclusionPressureCmH2o: 5.2,
      rapidShallowBreathingPattern: true,
      diaphragmaticExcursionCm: 0.6,
      endInspiratoryThicknessMm: 1.6,
      endExpiratoryThicknessMm: 1.4,
      spo2Percent: 91,
      fio2Delivered: 0.40,
      heartRateBpm: 122,
      systolicBpMmHg: 162,
      diastolicBpMmHg: 94,
      cuffLeakVolumeMl: 180,
      baselineInspiratoryVtMl: 400,
      steroidProphylaxisActive: false,
    },
    clinicalPearls: [
      'Prolonged sedation and neuromuscular blockade caused profound VIDD (TFdi 14% < 30%, Excursion 0.6 cm).',
      'Excessive P0.1 (5.2 cmH2O) demonstrates desperate central respiratory drive attempting to stimulate a wasted diaphragm.',
      'Extubation would trigger rapid post-extubation hypercapnic respiratory arrest; abort SBT and initiate diaphragmatic rehabilitation.',
    ],
  },
  failed_cuff_leak_laryngeal_edema: {
    id: 'failed_cuff_leak_laryngeal_edema',
    name: '3. Failed Cuff Leak: Post-Extubation Stridor & Glottic Edema Hazard',
    patientSummary:
      '42yo female intubated 8 days following difficult intubation with traumatic airway. Mechanically weaned on PSV (RSBI 52, normal P0.1), but Cuff Leak is only 45 mL (< 10%).',
    initialState: {
      patientAge: 42,
      daysIntubated: 8,
      currentSbtTechnique: 'low_level_psv',
      sbtDurationMinutes: 30,
      respiratoryRateBpm: 21,
      tidalVolumeMl: 410,
      initialSbtRsbi: 50,
      p01AirwayOcclusionPressureCmH2o: 1.8,
      rapidShallowBreathingPattern: false,
      diaphragmaticExcursionCm: 1.4,
      endInspiratoryThicknessMm: 2.9,
      endExpiratoryThicknessMm: 2.1,
      spo2Percent: 98,
      fio2Delivered: 0.30,
      heartRateBpm: 88,
      systolicBpMmHg: 128,
      diastolicBpMmHg: 78,
      cuffLeakVolumeMl: 45,
      baselineInspiratoryVtMl: 450,
      steroidProphylaxisActive: false,
    },
    clinicalPearls: [
      'Although lung mechanics and RSBI are perfect, the Cuff Leak is 45 mL (< 110 mL threshold, 10% leak).',
      'Immediate extubation carries a > 35% risk of acute laryngeal stridor and emergency re-intubation.',
      'Administer IV Methylprednisolone 20 mg q4h x 4 doses (minimum 4-6 hour lead time) before repeating cuff leak test.',
    ],
  },
  cardiovascular_weaning_failure: {
    id: 'cardiovascular_weaning_failure',
    name: '4. Occult Cardiovascular Weaning Failure (Diastolic Overload & Flash Edema)',
    patientSummary:
      '74yo male with ischemic cardiomyopathy (EF 30%). At minute 25 of T-piece trial, develops severe hypertension (SBP 195 mmHg), diaphoresis, tachypnea (RR 32), and bibasilar rales.',
    initialState: {
      patientAge: 74,
      daysIntubated: 5,
      currentSbtTechnique: 't_piece',
      sbtDurationMinutes: 25,
      respiratoryRateBpm: 32,
      tidalVolumeMl: 290,
      initialSbtRsbi: 62,
      p01AirwayOcclusionPressureCmH2o: 3.8,
      rapidShallowBreathingPattern: true,
      diaphragmaticExcursionCm: 1.2,
      endInspiratoryThicknessMm: 2.8,
      endExpiratoryThicknessMm: 2.1,
      spo2Percent: 88,
      fio2Delivered: 0.45,
      heartRateBpm: 128,
      systolicBpMmHg: 195,
      diastolicBpMmHg: 110,
      cuffLeakVolumeMl: 190,
      baselineInspiratoryVtMl: 450,
      steroidProphylaxisActive: false,
    },
    clinicalPearls: [
      'Switching from positive-pressure ventilation to spontaneous breathing eliminates positive intrathoracic pressure, suddenly increasing venous return (preload) and LV transmural afterload.',
      'In a stiff failing LV, this causes acute diastolic overload and flash cardiogenic pulmonary edema during the SBT.',
      'Treat with pre-weaning IV diuresis (Furosemide) and preload/afterload reduction (Nitroglycerin).',
    ],
  },
};
