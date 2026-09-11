/**
 * AcsRiskTroponinEngine.ts
 * Emergency Medicine & Cardiology: Acute Coronary Syndrome (ACS) Risk Stratification,
 * HEART Score, TIMI Risk Score, GRACE 2.0 Score, ESC High-Sensitivity Troponin (hs-cTn)
 * 0/1-Hour and 0/2-Hour Rapid Diagnostic Protocols, and Evidence-Based Revascularization Timing.
 * Location: frontend/.gemini/skills/AcsRiskTroponinEngine.ts
 */

export type HeartHistoryScore = 0 | 1 | 2; // Slightly (0), Moderately (1), Highly suspicious (2)
export type HeartEcgScore = 0 | 1 | 2; // Normal (0), Non-specific/LBBB (1), Significant ST deviation (2)
export type HeartAgeScore = 0 | 1 | 2; // <45 (0), 45-64 (1), >=65 (2)
export type HeartRiskFactorsScore = 0 | 1 | 2; // 0 (0), 1-2 (1), >=3 or atherosclerotic disease (2)
export type HeartTroponinScore = 0 | 1 | 2; // <=URL (0), 1-3x URL (1), >3x URL (2)

export type EscTroponinAssay = 'HS_CTNT_ROCHE' | 'HS_CTNI_ABBOTT';
export type EscProtocolTiming = 'ZERO_ONE_HOUR' | 'ZERO_TWO_HOUR';

export type KillipClass = 1 | 2 | 3 | 4; // 1: No CHF, 2: Rales/S3/JVD, 3: Frank pulmonary edema, 4: Cardiogenic shock

export interface HeartScoreInput {
  history: HeartHistoryScore;
  ecg: HeartEcgScore;
  age: HeartAgeScore;
  riskFactors: HeartRiskFactorsScore;
  troponin: HeartTroponinScore;
}

export interface HeartScoreResult {
  totalScore: number; // 0 to 10
  riskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  maceRatePercent: number; // 6-week major adverse cardiac event rate
  clinicalDisposition: string;
  recommendation: string;
}

export interface HsTroponinInput {
  assay: EscTroponinAssay;
  protocolTiming: EscProtocolTiming;
  chestPainOnsetHours: number; // symptom duration
  baselineTroponinNgL: number; // 0h sample
  repeatTroponinNgL: number; // 1h or 2h sample
}

export interface EscTroponinResult {
  pathway: 'RULE_OUT' | 'OBSERVE' | 'RULE_IN';
  deltaTroponinNgL: number;
  negativePredictiveValuePercent: number;
  positivePredictiveValuePercent: number;
  earlyPresenterWarning: boolean;
  pathwayRationale: string;
  clinicalAction: string;
}

export interface TimiScoreInput {
  age65OrOlder: boolean;
  threeOrMoreCadRiskFactors: boolean;
  knownCadStenosis50Percent: boolean;
  aspirinUsePast7Days: boolean;
  severeAnginaEpisodesPast24h: boolean;
  stDeviationPoint5Mm: boolean;
  elevatedCardiacMarkers: boolean;
}

export interface TimiScoreResult {
  totalScore: number; // 0 to 7
  riskTier: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  fourteenDayMacePercent: number;
  revascularizationBenefit: string;
}

export interface GraceScoreInput {
  ageYears: number; // e.g. 30 to 95
  heartRateBpm: number; // e.g. 40 to 180
  systolicBpMmHg: number; // e.g. 70 to 220
  serumCreatinineMgDl: number; // e.g. 0.5 to 6.0
  killipClass: KillipClass;
  cardiacArrestAtAdmission: boolean;
  stSegmentDeviation: boolean;
  elevatedCardiacMarkers: boolean;
}

export interface GraceScoreResult {
  totalScore: number; // typical range 50 to 250
  inHospitalMortalityPercent: number;
  sixMonthMortalityPercent: number;
  riskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  invasiveStrategyTiming: 'IMMEDIATE_LESS_THAN_2H' | 'EARLY_LESS_THAN_24H' | 'SELECTIVE_OR_NON_INVASIVE';
  timingRationale: string;
}

export interface AcsPharmacotherapyInput {
  contraindicationToAspirin: boolean; // true anaphylaxis/allergy
  priorStrokeOrTia: boolean; // contraindication for prasugrel
  ageOver75OrWeightUnder60Kg: boolean; // prasugrel dose reduction / caution
  plannedEarlyInvasiveCatheterization: boolean; // triggers pre-treatment vs lab-table loading
  rightVentricularInfarctionSuspected: boolean; // V4R elevation, hypotension with nitrates
  recentPde5InhibitorUse: boolean; // Sildenafil <24h, Tadalafil <48h
  gastrointestinalBleedRiskHigh: boolean;
}

export interface AcsPharmacotherapyResult {
  aspirinRecommendation: string;
  p2y12InhibitorChoice: 'TICAGRELOR' | 'PRASUGREL' | 'CLOPIDOGREL' | 'HOLD_FOR_ANGIOGRAPHY';
  p2y12DosingRationale: string;
  anticoagulationRecommendation: string;
  nitrateAndOpioidSafety: string;
  gastricProtection: string;
  criticalWarnings: string[];
}

export interface ComprehensiveAcsEvaluation {
  heart: HeartScoreResult;
  troponinEsc: EscTroponinResult;
  timi: TimiScoreResult;
  grace: GraceScoreResult;
  pharmacotherapy: AcsPharmacotherapyResult;
  unifiedClinicalSynthesis: string;
  teachingPearls: string[];
}

/**
 * Calculates the HEART Score and stratifies 6-week MACE risk.
 */
export function calculateHeartScore(input: HeartScoreInput): HeartScoreResult {
  const totalScore = input.history + input.ecg + input.age + input.riskFactors + input.troponin;

  let riskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  let maceRatePercent: number;
  let clinicalDisposition: string;
  let recommendation: string;

  if (totalScore <= 3) {
    riskCategory = 'LOW';
    maceRatePercent = 1.7;
    clinicalDisposition = 'Low Risk for 6-Week MACE (0.9% - 1.7%). Candidate for rapid discharge or outpatient provocative testing.';
    recommendation = 'Patients with HEART Score 0-3 have an extremely low rate of 6-week AMI or mortality. If serial high-sensitivity troponin remains undetectable/negative and the patient is symptom-free, early discharge with outpatient stress testing or CCTA within 72 hours is standard of care.';
  } else if (totalScore <= 6) {
    riskCategory = 'INTERMEDIATE';
    maceRatePercent = 16.6;
    clinicalDisposition = 'Intermediate Risk for 6-Week MACE (12% - 16.6%). Requires admission to Clinical Decision Unit (CDU) or Telemetry.';
    recommendation = 'Patients with HEART Score 4-6 require admission for telemetry monitoring, serial cardiac biomarkers at 3-6 hours, and non-invasive functional or anatomical testing (Stress Echo, SPECT MPI, or Coronary CTA) prior to discharge.';
  } else {
    riskCategory = 'HIGH';
    maceRatePercent = 50.1;
    clinicalDisposition = 'High Risk for 6-Week MACE (50% - 65%). Urgent inpatient admission and early invasive strategy.';
    recommendation = 'Patients with HEART Score 7-10 have a >50% probability of MACE within 6 weeks. Immediate initiation of medical therapy (DAPT, anticoagulation, statin) and referral for early invasive coronary angiography are mandatory.';
  }

  return {
    totalScore,
    riskCategory,
    maceRatePercent,
    clinicalDisposition,
    recommendation
  };
}

/**
 * Evaluates European Society of Cardiology (ESC) 0/1h and 0/2h rapid high-sensitivity troponin algorithm.
 */
export function evaluateEscTroponinAlgorithm(input: HsTroponinInput): EscTroponinResult {
  const delta = Math.round((input.repeatTroponinNgL - input.baselineTroponinNgL) * 10) / 10;
  const isEarlyPresenter = input.chestPainOnsetHours < 3.0;

  let pathway: 'RULE_OUT' | 'OBSERVE' | 'RULE_IN' = 'OBSERVE';
  let npv = 99.1;
  let ppv = 75.0;
  let rationale = '';
  let action = '';

  if (input.assay === 'HS_CTNT_ROCHE') {
    // Roche Elecsys hs-cTnT algorithm (ESC 2020/2023)
    if (input.protocolTiming === 'ZERO_ONE_HOUR') {
      // 0/1h protocol
      if ((input.baselineTroponinNgL < 5 && !isEarlyPresenter) || (input.baselineTroponinNgL < 12 && Math.abs(delta) < 3)) {
        pathway = 'RULE_OUT';
        npv = 99.5;
        ppv = 15.0;
        rationale = 'Meets ESC 0/1h Rule-Out criteria: Baseline hs-cTnT < 5 ng/L (with onset >=3h) OR (Baseline < 12 ng/L AND 1h Delta < 3 ng/L).';
        action = 'Acute NSTEMI ruled out with >99% NPV. Assess HEART score: if HEART <=3 and pain-free, discharge with outpatient follow-up. If HEART >=4, admit for observation.';
      } else if (input.baselineTroponinNgL >= 52 || delta >= 5) {
        pathway = 'RULE_IN';
        npv = 40.0;
        ppv = 77.2;
        rationale = 'Meets ESC 0/1h Rule-In criteria: Baseline hs-cTnT >= 52 ng/L OR 1h Delta >= 5 ng/L.';
        action = 'High probability of acute myocardial injury/NSTEMI (PPV ~77%). Cardiology consultation, telemetry admission, DAPT, parenteral anticoagulation, and early invasive coronary angiography (<24h).';
      } else {
        pathway = 'OBSERVE';
        npv = 92.0;
        ppv = 45.0;
        rationale = 'Intermediate hs-cTnT kinetics: falls into the Observe (Gray) Zone. Does not meet rule-out or rule-in.';
        action = 'Mandatory 3-hour hs-cTn repeat. Perform bedside echocardiography to assess regional wall motion abnormalities (RWMA) and consider CCTA.';
      }
    } else {
      // 0/2h protocol
      if ((input.baselineTroponinNgL < 5 && !isEarlyPresenter) || (input.baselineTroponinNgL < 14 && Math.abs(delta) < 4)) {
        pathway = 'RULE_OUT';
        npv = 99.3;
        ppv = 16.0;
        rationale = 'Meets ESC 0/2h Rule-Out criteria: Baseline < 5 ng/L (onset >=3h) OR (Baseline < 14 ng/L AND 2h Delta < 4 ng/L).';
        action = 'Rule-out safe for discharge if combined with low clinical suspicion (HEART <=3).';
      } else if (input.baselineTroponinNgL >= 52 || delta >= 10) {
        pathway = 'RULE_IN';
        npv = 42.0;
        ppv = 78.5;
        rationale = 'Meets ESC 0/2h Rule-In criteria: Baseline >= 52 ng/L OR 2h Delta >= 10 ng/L.';
        action = 'Rule-in confirmed for NSTEMI. Immediate cardiology consultation and invasive management.';
      } else {
        pathway = 'OBSERVE';
        npv = 91.5;
        ppv = 48.0;
        rationale = 'Intermediate 0/2h troponin levels. Inconclusive kinetics.';
        action = 'Serial monitoring, bedside echo, and functional evaluation.';
      }
    }
  } else {
    // Abbott Architect hs-cTnI algorithm (ESC 2020/2023)
    if (input.protocolTiming === 'ZERO_ONE_HOUR') {
      if ((input.baselineTroponinNgL < 4 && !isEarlyPresenter) || (input.baselineTroponinNgL < 5 && Math.abs(delta) < 2)) {
        pathway = 'RULE_OUT';
        npv = 99.6;
        ppv = 14.0;
        rationale = 'Meets ESC 0/1h Rule-Out criteria: Baseline hs-cTnI < 4 ng/L (onset >=3h) OR (Baseline < 5 ng/L AND 1h Delta < 2 ng/L).';
        action = 'Acute myocardial infarction ruled out with >99% NPV. Validate with low HEART score before outpatient disposition.';
      } else if (input.baselineTroponinNgL >= 52 || delta >= 6) {
        pathway = 'RULE_IN';
        npv = 38.0;
        ppv = 82.0;
        rationale = 'Meets ESC 0/1h Rule-In criteria: Baseline hs-cTnI >= 52 ng/L OR 1h Delta >= 6 ng/L.';
        action = 'Rule-in confirmed for NSTEMI. High PPV (~82%). Initiate DAPT, anticoagulation, and invasive coronary angiography.';
      } else {
        pathway = 'OBSERVE';
        npv = 93.0;
        ppv = 42.0;
        rationale = 'Falls into hs-cTnI Observe Zone: troponin mildly elevated without diagnostic delta.';
        action = 'Obtain 3-hour hs-cTnI. Evaluate differential diagnosis including myocarditis, PE, tachyarrhythmia, renal failure, and sepsis.';
      }
    } else {
      // 0/2h protocol
      if ((input.baselineTroponinNgL < 4 && !isEarlyPresenter) || (input.baselineTroponinNgL < 6 && Math.abs(delta) < 2)) {
        pathway = 'RULE_OUT';
        npv = 99.4;
        ppv = 15.0;
        rationale = 'Meets ESC 0/2h Rule-Out criteria for hs-cTnI.';
        action = 'Rule-out pathway validated.';
      } else if (input.baselineTroponinNgL >= 52 || delta >= 7) {
        pathway = 'RULE_IN';
        npv = 39.0;
        ppv = 83.5;
        rationale = 'Meets ESC 0/2h Rule-In criteria for hs-cTnI.';
        action = 'Rule-in confirmed for NSTEMI.';
      } else {
        pathway = 'OBSERVE';
        npv = 92.0;
        ppv = 44.0;
        rationale = 'Observe Zone for hs-cTnI 0/2h.';
        action = 'Obtain 3-hour troponin and imaging.';
      }
    }
  }

  // Early presenter safeguard override
  let earlyPresenterWarning = false;
  if (isEarlyPresenter && pathway === 'RULE_OUT' && (input.baselineTroponinNgL < 5 && Math.abs(delta) === 0)) {
    earlyPresenterWarning = true;
    pathway = 'OBSERVE';
    rationale = 'Early Presenter Caveat (<3 hours of chest pain onset): A single undetectable baseline troponin cannot rule out ACS because myocardial troponin takes 1-3 hours to enter systemic circulation. Repeat troponin at 1 or 2 hours is strictly required before safe rule-out.';
    action = 'Do NOT discharge based solely on 0-hour troponin. Complete the 1-hour or 2-hour delta sample.';
  }

  return {
    pathway,
    deltaTroponinNgL: delta,
    negativePredictiveValuePercent: npv,
    positivePredictiveValuePercent: ppv,
    earlyPresenterWarning,
    pathwayRationale: rationale,
    clinicalAction: action
  };
}

/**
 * Calculates TIMI Risk Score for UA/NSTEMI and predicts 14-day MACE.
 */
export function calculateTimiRiskScore(input: TimiScoreInput): TimiScoreResult {
  let score = 0;
  if (input.age65OrOlder) score += 1;
  if (input.threeOrMoreCadRiskFactors) score += 1;
  if (input.knownCadStenosis50Percent) score += 1;
  if (input.aspirinUsePast7Days) score += 1;
  if (input.severeAnginaEpisodesPast24h) score += 1;
  if (input.stDeviationPoint5Mm) score += 1;
  if (input.elevatedCardiacMarkers) score += 1;

  let riskTier: 'LOW' | 'INTERMEDIATE' | 'HIGH';
  let fourteenDayMacePercent: number;
  let revascularizationBenefit: string;

  if (score <= 2) {
    riskTier = 'LOW';
    fourteenDayMacePercent = score === 0 || score === 1 ? 4.7 : 8.3;
    revascularizationBenefit = 'Conservative / Ischemia-guided strategy. Routine immediate invasive intervention shows limited benefit unless recurrent ischemia occurs.';
  } else if (score <= 4) {
    riskTier = 'INTERMEDIATE';
    fourteenDayMacePercent = score === 3 ? 13.2 : 19.9;
    revascularizationBenefit = 'Routine early invasive strategy (<24 hours) recommended. Trials demonstrate significant reduction in composite endpoint of death, MI, or recurrent refractory ischemia.';
  } else {
    riskTier = 'HIGH';
    fourteenDayMacePercent = score === 5 ? 26.2 : 40.9;
    revascularizationBenefit = 'High benefit from early invasive revascularization (<24 hours). Strongly consider upfront intensive medical stabilization and urgent catheterization.';
  }

  return {
    totalScore: score,
    riskTier,
    fourteenDayMacePercent,
    revascularizationBenefit
  };
}

/**
 * Calculates GRACE 2.0 Risk Score and determines invasive timing.
 */
export function calculateGraceScore(input: GraceScoreInput): GraceScoreResult {
  let score = 0;

  // Age points
  if (input.ageYears < 35) score += 0;
  else if (input.ageYears < 45) score += 18;
  else if (input.ageYears < 55) score += 36;
  else if (input.ageYears < 65) score += 55;
  else if (input.ageYears < 75) score += 73;
  else if (input.ageYears < 85) score += 91;
  else score += 100;

  // Heart rate points
  if (input.heartRateBpm < 70) score += 0;
  else if (input.heartRateBpm < 90) score += 7;
  else if (input.heartRateBpm < 110) score += 13;
  else if (input.heartRateBpm < 150) score += 23;
  else if (input.heartRateBpm < 200) score += 36;
  else score += 46;

  // Systolic BP points (inverse relationship)
  if (input.systolicBpMmHg < 80) score += 63;
  else if (input.systolicBpMmHg < 100) score += 58;
  else if (input.systolicBpMmHg < 120) score += 47;
  else if (input.systolicBpMmHg < 140) score += 37;
  else if (input.systolicBpMmHg < 160) score += 26;
  else if (input.systolicBpMmHg < 200) score += 11;
  else score += 0;

  // Serum Creatinine points
  if (input.serumCreatinineMgDl < 0.4) score += 2;
  else if (input.serumCreatinineMgDl < 0.8) score += 5;
  else if (input.serumCreatinineMgDl < 1.2) score += 8;
  else if (input.serumCreatinineMgDl < 1.6) score += 11;
  else if (input.serumCreatinineMgDl < 2.0) score += 14;
  else if (input.serumCreatinineMgDl < 4.0) score += 23;
  else score += 31;

  // Killip Class points
  if (input.killipClass === 1) score += 0;
  else if (input.killipClass === 2) score += 21;
  else if (input.killipClass === 3) score += 43;
  else if (input.killipClass === 4) score += 64;

  // Additional binary variables
  if (input.cardiacArrestAtAdmission) score += 43;
  if (input.stSegmentDeviation) score += 30;
  if (input.elevatedCardiacMarkers) score += 15;

  // In-hospital and 6-month mortality estimation based on GRACE 2.0 calibration
  let inHospitalMortalityPercent: number;
  let sixMonthMortalityPercent: number;
  let riskCategory: 'LOW' | 'INTERMEDIATE' | 'HIGH';

  if (score <= 108) {
    riskCategory = 'LOW';
    inHospitalMortalityPercent = Math.max(0.5, Math.round((score / 108) * 1.5 * 10) / 10);
    sixMonthMortalityPercent = Math.max(1.5, Math.round((score / 108) * 4.5 * 10) / 10);
  } else if (score <= 140) {
    riskCategory = 'INTERMEDIATE';
    inHospitalMortalityPercent = Math.round((1.5 + ((score - 108) / 32) * 3.5) * 10) / 10;
    sixMonthMortalityPercent = Math.round((4.5 + ((score - 108) / 32) * 6.5) * 10) / 10;
  } else {
    riskCategory = 'HIGH';
    inHospitalMortalityPercent = Math.min(45.0, Math.round((5.0 + Math.pow((score - 140) / 25, 1.8) * 6.0) * 10) / 10);
    sixMonthMortalityPercent = Math.min(65.0, Math.round((11.0 + Math.pow((score - 140) / 25, 1.8) * 9.0) * 10) / 10);
  }

  let invasiveStrategyTiming: 'IMMEDIATE_LESS_THAN_2H' | 'EARLY_LESS_THAN_24H' | 'SELECTIVE_OR_NON_INVASIVE';
  let timingRationale: string;

  if (input.killipClass === 4 || input.cardiacArrestAtAdmission || input.systolicBpMmHg < 90) {
    invasiveStrategyTiming = 'IMMEDIATE_LESS_THAN_2H';
    timingRationale = 'VERY HIGH RISK criteria present (Cardiogenic shock, resuscitation post-cardiac arrest, or severe hypotension). Immediate coronary angiography (<2 hours) indicated regardless of biomarker or ECG details.';
  } else if (score > 140 || input.stSegmentDeviation || input.elevatedCardiacMarkers) {
    invasiveStrategyTiming = 'EARLY_LESS_THAN_24H';
    timingRationale = 'HIGH RISK criteria present (GRACE Score > 140, dynamic ST deviation, or confirmed troponin elevation). Early invasive coronary angiography (<24 hours) significantly reduces recurrent ischemia and re-hospitalization.';
  } else {
    invasiveStrategyTiming = 'SELECTIVE_OR_NON_INVASIVE';
    timingRationale = 'LOW RISK profile (GRACE Score <= 108, Killip 1, stable vitals). Selective invasive evaluation or non-invasive anatomical/functional testing (Coronary CTA or Stress Echo) is recommended.';
  }

  return {
    totalScore: score,
    inHospitalMortalityPercent,
    sixMonthMortalityPercent,
    riskCategory,
    invasiveStrategyTiming,
    timingRationale
  };
}

/**
 * Formulates tailored DAPT, anticoagulation, and adjuvant medical therapy with safety interlocks.
 */
export function evaluateAcsPharmacotherapy(input: AcsPharmacotherapyInput): AcsPharmacotherapyResult {
  const warnings: string[] = [];

  // 1. Aspirin
  let aspirinRec = '';
  if (input.contraindicationToAspirin) {
    aspirinRec = 'Aspirin CONTRAINDICATED (True allergy/anaphylaxis). Use Clopidogrel 300-600 mg loading dose as sole antiplatelet agent.';
    warnings.push('Aspirin allergy reported: Clopidogrel substitute indicated.');
  } else {
    aspirinRec = 'Chewable Aspirin 162-325 mg immediately (non-enteric coated for rapid sublingual/gastric absorption), followed by 81 mg daily indefinitely.';
  }

  // 2. P2Y12 Inhibitor Selection
  let p2y12Choice: 'TICAGRELOR' | 'PRASUGREL' | 'CLOPIDOGREL' | 'HOLD_FOR_ANGIOGRAPHY' = 'TICAGRELOR';
  let p2y12Rationale = '';

  if (input.priorStrokeOrTia) {
    p2y12Choice = 'TICAGRELOR';
    p2y12Rationale = 'Ticagrelor 180 mg loading dose preferred (followed by 90 mg BID). PRASUGREL STRICTLY CONTRAINDICATED due to history of prior stroke or TIA (excess fatal intracranial hemorrhage).';
    warnings.push('Prasugrel contraindicated: Prior Stroke/TIA.');
  } else if (input.plannedEarlyInvasiveCatheterization) {
    p2y12Choice = 'PRASUGREL';
    p2y12Rationale = 'Prasugrel 60 mg loading dose (followed by 10 mg daily) at the time of PCI once coronary anatomy is confirmed. In NSTEMI undergoing early invasive strategy (<24h), withholding upstream P2Y12 inhibitor pre-treatment until coronary anatomy is defined avoids surgical delays if CABG is urgently indicated (ISAR-REACT 5 trial).';
    if (input.ageOver75OrWeightUnder60Kg) {
      warnings.push('Prasugrel caution: Age >=75 or Weight <60 kg requires 5 mg daily maintenance dose.');
    }
  } else {
    p2y12Choice = 'TICAGRELOR';
    p2y12Rationale = 'Ticagrelor 180 mg loading dose + 90 mg BID. Outperforms Clopidogrel in all-cause mortality and stent thrombosis without excess overall major bleeding (PLATO trial).';
  }

  // 3. Parenteral Anticoagulation
  const anticoagulationRec = 'Enoxaparin 1 mg/kg SC every 12 hours (or UFH bolus 60 units/kg max 4000 units + infusion 12 units/kg/h titrated to aPTT 50-70s). In cath lab, switch or supplement with IV UFH bolus if PCI performed.';

  // 4. Nitrates and Opioids Safety Interlock
  let nitrateAndOpioidSafety = 'Sublingual Nitroglycerin 0.4 mg q5min (up to 3 doses) for ischemic chest discomfort. Morphine reserved only for severe refractory pain (may delay oral P2Y12 absorption).';

  if (input.rightVentricularInfarctionSuspected) {
    nitrateAndOpioidSafety = 'NITRATES STRICTLY CONTRAINDICATED: Patient has suspected Right Ventricular (RV) infarction. RV filling is highly preload-dependent; venodilation from nitrates induces sudden, catastrophic hypotension and circulatory arrest.';
    warnings.push('CRITICAL CONTRAINDICATION: Nitrates prohibited in RV infarction.');
  } else if (input.recentPde5InhibitorUse) {
    nitrateAndOpioidSafety = 'NITRATES STRICTLY CONTRAINDICATED: Recent phosphodiesterase-5 (PDE-5) inhibitor use within 24h (Sildenafil/Vardenafil) or 48h (Tadalafil). Synergistic cGMP accumulation causes profound, refractory vasodilation and fatal shock.';
    warnings.push('CRITICAL CONTRAINDICATION: Nitrates prohibited with recent PDE-5 inhibitor use.');
  }

  // 5. Gastroprotection
  const gastricProtection = input.gastrointestinalBleedRiskHigh
    ? 'Proton Pump Inhibitor (e.g. Pantoprazole 40 mg daily) strongly recommended: Patient has elevated GI bleeding risk while receiving DAPT + parenteral anticoagulation.'
    : 'Routine PPI co-prescription recommended for patients receiving DAPT with risk factors (age >=65, anticoagulant, steroid use).';

  return {
    aspirinRecommendation: aspirinRec,
    p2y12InhibitorChoice: p2y12Choice,
    p2y12DosingRationale: p2y12Rationale,
    anticoagulationRecommendation: anticoagulationRec,
    nitrateAndOpioidSafety,
    gastricProtection,
    criticalWarnings: warnings
  };
}

/**
 * Performs a unified comprehensive clinical ACS evaluation combining all scores and algorithms.
 */
export function performComprehensiveAcsEvaluation(params: {
  heartInput: HeartScoreInput;
  troponinInput: HsTroponinInput;
  timiInput: TimiScoreInput;
  graceInput: GraceScoreInput;
  pharmacotherapyInput: AcsPharmacotherapyInput;
}): ComprehensiveAcsEvaluation {
  const heart = calculateHeartScore(params.heartInput);
  const troponinEsc = evaluateEscTroponinAlgorithm(params.troponinInput);
  const timi = calculateTimiRiskScore(params.timiInput);
  const grace = calculateGraceScore(params.graceInput);
  const pharmacotherapy = evaluateAcsPharmacotherapy(params.pharmacotherapyInput);

  let unifiedClinicalSynthesis = '';
  if (troponinEsc.pathway === 'RULE_IN' || grace.invasiveStrategyTiming === 'IMMEDIATE_LESS_THAN_2H') {
    unifiedClinicalSynthesis = `CONFIRMED ACUTE CORONARY SYNDROME (NSTEMI/HIGH-RISK ACS): Patient has high-risk features (GRACE ${grace.totalScore}, TIMI ${timi.totalScore}, HEART ${heart.totalScore}) with ${troponinEsc.pathway === 'RULE_IN' ? 'troponin rule-in' : 'critical hemodynamic instability'}. Mandates immediate/early invasive catheterization (${grace.invasiveStrategyTiming === 'IMMEDIATE_LESS_THAN_2H' ? '<2 hours' : '<24 hours'}), full DAPT, and anticoagulation.`;
  } else if (troponinEsc.pathway === 'RULE_OUT' && heart.riskCategory === 'LOW') {
    unifiedClinicalSynthesis = `RAPID ACS RULE-OUT CONFIRMED: High-sensitivity troponin ESC algorithm met rule-out criteria (>99% NPV) and HEART score is LOW (${heart.totalScore}/10). 6-week MACE probability is <1.7%. Safe for early emergency department discharge with outpatient provocative testing or coronary CTA within 72 hours.`;
  } else {
    unifiedClinicalSynthesis = `INTERMEDIATE RISK / OBSERVE ZONE: Clinical findings are discordant or in the diagnostic gray-zone (HEART ${heart.totalScore}/10, Troponin status: ${troponinEsc.pathway}). Requires Clinical Decision Unit (CDU) admission, 3-hour hs-cTn repeat, bedside echocardiography to rule out RWMA, and ischemia testing prior to discharge.`;
  }

  const teachingPearls = [
    'ESC 0/1-Hour Protocol Diagnostic Power: High-sensitivity cardiac troponin algorithms leverage both absolute baseline thresholds and minute 1-hour deltas (e.g. 3-5 ng/L) to achieve >99% negative predictive value, enabling safe discharge within 60 minutes for low-risk patients.',
    'Early Presenter Safeguard (<3 hours): If a patient presents within 3 hours of chest pain onset, a single undetectable baseline troponin cannot rule out ACS because intracellular troponin release requires time to accumulate. A repeat 1-hour or 2-hour delta sample is mandatory.',
    'HEART vs TIMI vs GRACE Roles: HEART score was developed specifically for undifferentiated emergency department chest pain to identify patients safe for early discharge. TIMI stratifies ischemic risk and revascularization benefit in confirmed NSTEMI/UA. GRACE provides the most accurate prognostic calibration for in-hospital and 6-month mortality.',
    'ISAR-REACT 5 & Upstream P2Y12 Pre-Treatment: Routine pre-treatment with potent P2Y12 inhibitors (Prasugrel/Ticagrelor) prior to knowing coronary anatomy in NSTEMI is no longer recommended if early angiography (<24h) is scheduled, as it delays emergent CABG without reducing ischemic events.',
    'Right Ventricular Infarction Nitrate Hazard: In patients with inferior ischemia, an RV4 lead must be obtained. Nitroglycerin venodilation severely reduces RV preload and causes catastrophic, refractory hypotension.',
    'Type 1 vs Type 2 Myocardial Infarction: An elevated troponin does not equal plaque rupture. Sepsis, severe anemia, tachyarrhythmias, and hypertensive emergency can cause myocardial oxygen supply-demand mismatch (Type 2 MI), requiring treatment of the underlying cause rather than emergency PCI.'
  ];

  return {
    heart,
    troponinEsc,
    timi,
    grace,
    pharmacotherapy,
    unifiedClinicalSynthesis,
    teachingPearls
  };
}

export interface AcsPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: {
    heart: HeartScoreInput;
    troponin: HsTroponinInput;
    timi: TimiScoreInput;
    grace: GraceScoreInput;
    pharmacotherapy: AcsPharmacotherapyInput;
  };
}

export const ACS_PRESETS: AcsPreset[] = [
  {
    id: 'LOW_RISK_RULE_OUT',
    name: 'Low-Risk Atypical Chest Pain (Safe ED Discharge)',
    badge: 'HEART 2 • hs-cTn Rule-Out',
    description: '38 yo male with atypical pleuritic chest tightness, normal 12-lead ECG, single cardiovascular risk factor, and undetectable baseline/1-hour hs-cTnT. Safe for early discharge with outpatient CCTA.',
    inputs: {
      heart: { history: 1, ecg: 0, age: 0, riskFactors: 1, troponin: 0 },
      troponin: { assay: 'HS_CTNT_ROCHE', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 5, baselineTroponinNgL: 3.2, repeatTroponinNgL: 3.5 },
      timi: { age65OrOlder: false, threeOrMoreCadRiskFactors: false, knownCadStenosis50Percent: false, aspirinUsePast7Days: false, severeAnginaEpisodesPast24h: false, stDeviationPoint5Mm: false, elevatedCardiacMarkers: false },
      grace: { ageYears: 38, heartRateBpm: 68, systolicBpMmHg: 122, serumCreatinineMgDl: 0.8, killipClass: 1, cardiacArrestAtAdmission: false, stSegmentDeviation: false, elevatedCardiacMarkers: false },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: false, rightVentricularInfarctionSuspected: false, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: false }
    }
  },
  {
    id: 'HIGH_RISK_NSTEMI',
    name: 'High-Risk NSTEMI (Early Invasive <24 Hours)',
    badge: 'HEART 8 • hs-cTn Rule-In',
    description: '66 yo female with retrosternal pressure radiating to jaw, dynamic ST depressions in V4-V6, elevated and surging hs-cTnT (68 -> 85 ng/L). Requires DAPT, enoxaparin, and catheterization within 24h.',
    inputs: {
      heart: { history: 2, ecg: 2, age: 2, riskFactors: 2, troponin: 2 },
      troponin: { assay: 'HS_CTNT_ROCHE', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 4, baselineTroponinNgL: 68.0, repeatTroponinNgL: 85.0 },
      timi: { age65OrOlder: true, threeOrMoreCadRiskFactors: true, knownCadStenosis50Percent: true, aspirinUsePast7Days: true, severeAnginaEpisodesPast24h: true, stDeviationPoint5Mm: true, elevatedCardiacMarkers: true },
      grace: { ageYears: 66, heartRateBpm: 92, systolicBpMmHg: 138, serumCreatinineMgDl: 1.3, killipClass: 1, cardiacArrestAtAdmission: false, stSegmentDeviation: true, elevatedCardiacMarkers: true },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: true, rightVentricularInfarctionSuspected: false, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: false }
    }
  },
  {
    id: 'GRAY_ZONE_OBSERVE',
    name: 'Intermediate Gray-Zone hs-cTn (CDU Observation & 3h Repeat)',
    badge: 'HEART 5 • Observe Zone',
    description: '56 yo male with intermittent exertional chest tightness, non-specific T-wave flattening, borderline baseline hs-cTnI (14 ng/L) with static 1h delta. Mandates telemetry, bedside echo, and 3-hour hs-cTn.',
    inputs: {
      heart: { history: 1, ecg: 1, age: 1, riskFactors: 1, troponin: 1 },
      troponin: { assay: 'HS_CTNI_ABBOTT', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 3.5, baselineTroponinNgL: 14.0, repeatTroponinNgL: 15.5 },
      timi: { age65OrOlder: false, threeOrMoreCadRiskFactors: true, knownCadStenosis50Percent: false, aspirinUsePast7Days: false, severeAnginaEpisodesPast24h: true, stDeviationPoint5Mm: false, elevatedCardiacMarkers: false },
      grace: { ageYears: 56, heartRateBpm: 76, systolicBpMmHg: 130, serumCreatinineMgDl: 1.0, killipClass: 1, cardiacArrestAtAdmission: false, stSegmentDeviation: false, elevatedCardiacMarkers: false },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: false, rightVentricularInfarctionSuspected: false, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: false }
    }
  },
  {
    id: 'EARLY_PRESENTER_CAVEAT',
    name: 'Hyperacute Early Presenter (<1h Onset, Undetectable Biomarker Pitfall)',
    badge: 'Onset <1h • Safeguard Active',
    description: '52 yo male presenting with 45 minutes of diaphoresis and retrosternal crushing pain. Initial hs-cTn is deceptively undetectable. Premature rule-out is prohibited; 1h/2h serial delta is strictly mandatory.',
    inputs: {
      heart: { history: 2, ecg: 1, age: 1, riskFactors: 2, troponin: 0 },
      troponin: { assay: 'HS_CTNT_ROCHE', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 0.75, baselineTroponinNgL: 3.0, repeatTroponinNgL: 3.0 },
      timi: { age65OrOlder: false, threeOrMoreCadRiskFactors: true, knownCadStenosis50Percent: false, aspirinUsePast7Days: false, severeAnginaEpisodesPast24h: true, stDeviationPoint5Mm: false, elevatedCardiacMarkers: false },
      grace: { ageYears: 52, heartRateBpm: 84, systolicBpMmHg: 142, serumCreatinineMgDl: 1.1, killipClass: 1, cardiacArrestAtAdmission: false, stSegmentDeviation: false, elevatedCardiacMarkers: false },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: false, rightVentricularInfarctionSuspected: false, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: false }
    }
  },
  {
    id: 'CARDIOGENIC_SHOCK_VERY_HIGH_RISK',
    name: 'Very High-Risk ACS in Cardiogenic Shock (Immediate Invasive <2 Hours)',
    badge: 'Killip IV • Immediate Angio <2h',
    description: '71 yo male in severe cardiogenic shock (BP 82/50, HR 125, pulmonary crackles, Killip 4). GRACE score 198. Urgent invasive catheterization (<2 hours), mechanical support evaluation, avoid beta-blockers/nitrates.',
    inputs: {
      heart: { history: 2, ecg: 2, age: 2, riskFactors: 2, troponin: 2 },
      troponin: { assay: 'HS_CTNT_ROCHE', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 3, baselineTroponinNgL: 94.0, repeatTroponinNgL: 142.0 },
      timi: { age65OrOlder: true, threeOrMoreCadRiskFactors: true, knownCadStenosis50Percent: true, aspirinUsePast7Days: true, severeAnginaEpisodesPast24h: true, stDeviationPoint5Mm: true, elevatedCardiacMarkers: true },
      grace: { ageYears: 71, heartRateBpm: 125, systolicBpMmHg: 82, serumCreatinineMgDl: 2.1, killipClass: 4, cardiacArrestAtAdmission: false, stSegmentDeviation: true, elevatedCardiacMarkers: true },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: true, rightVentricularInfarctionSuspected: false, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: true }
    }
  },
  {
    id: 'RV_INFARCT_NITRATE_CONTRAINDICATION',
    name: 'Inferior Ischemia & Right Ventricular Infarct (Nitrate Preload Collapse)',
    badge: 'RV Infarction • Nitrates Prohibited',
    description: '59 yo male with acute inferior wall ischemia and ST elevations in right precordial lead V4R. Preload-dependent RV failure causes profound shock if nitrates or diuretics are administered.',
    inputs: {
      heart: { history: 2, ecg: 2, age: 1, riskFactors: 2, troponin: 2 },
      troponin: { assay: 'HS_CTNT_ROCHE', protocolTiming: 'ZERO_ONE_HOUR', chestPainOnsetHours: 3.5, baselineTroponinNgL: 55.0, repeatTroponinNgL: 78.0 },
      timi: { age65OrOlder: false, threeOrMoreCadRiskFactors: true, knownCadStenosis50Percent: false, aspirinUsePast7Days: false, severeAnginaEpisodesPast24h: true, stDeviationPoint5Mm: true, elevatedCardiacMarkers: true },
      grace: { ageYears: 59, heartRateBpm: 58, systolicBpMmHg: 98, serumCreatinineMgDl: 1.2, killipClass: 1, cardiacArrestAtAdmission: false, stSegmentDeviation: true, elevatedCardiacMarkers: true },
      pharmacotherapy: { contraindicationToAspirin: false, priorStrokeOrTia: false, ageOver75OrWeightUnder60Kg: false, plannedEarlyInvasiveCatheterization: true, rightVentricularInfarctionSuspected: true, recentPde5InhibitorUse: false, gastrointestinalBleedRiskHigh: false }
    }
  }
];
