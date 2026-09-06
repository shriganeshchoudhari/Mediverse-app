/**
 * MassiveTransfusionDcrEngine.ts
 * Biophysical & Resuscitation Engine for Damage Control Resuscitation (DCR),
 * Massive Transfusion Protocol (MTP), Lethal Triad Dynamics, Viscoelastic Hemostatic Targets,
 * and Transfusion Complication Surveillance.
 * Location: frontend/.gemini/skills/MassiveTransfusionDcrEngine.ts
 */

export interface PatientTraumaVitals {
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  heartRateBpm: number;
  temperatureCelsius: number; // Lethal Triad: < 35.0 C severely impairs clotting
  arterialPh: number; // Lethal Triad: < 7.20 blunts thrombin burst
  baseDeficitMeqL: number; // > 6 mEq/L correlates with massive hemorrhage
  hemoglobinGDl: number;
  plateletCountPerUl: number;
  serumFibrinogenMgDl: number; // Target > 150-200 mg/dL in trauma
  ionizedCalciumMmolL: number; // Target > 1.1 mmol/L (citrate toxicity risk)
  isPenetratingTrauma: boolean;
  isPositiveFastUltrasound: boolean;
  hasTraumaticBrainInjury: boolean; // Precludes permissive hypotension (Target SBP >= 100-110)
}

export interface ResuscitationFluidAdministered {
  prbcUnits: number;
  ffpUnits: number;
  plateletPheresisUnits: number; // 1 apheresis = ~6 pooled units
  cryoprecipitateDoses: number; // 1 dose = 10 units
  crystalloidNormalSalineLiters: number; // Aggressive crystalloid triggers dilutional coagulopathy
  txaGivenWithin3Hours: boolean; // CRASH-2 protocol
  calciumChlorideGramsGiven: number;
}

export interface ViscoelasticParameters {
  rTimeMinutes: number; // TEG Reaction time (Normal 5-10 min)
  alphaAngleDegrees: number; // TEG Alpha angle (Normal 53-72 deg)
  maximumAmplitudeMm: number; // TEG MA (Normal 50-70 mm)
  ly30Percent: number; // TEG Lysis at 30 min (Normal 0-3%)
}

export interface AbcScoreResult {
  score: number;
  mtpActivationRecommended: boolean;
  shockIndex: number;
  shockIndexInterpretation: string;
}

export interface LethalTriadSeverity {
  hypothermiaSeverity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE_CRITICAL';
  acidosisSeverity: 'NORMAL' | 'MILD' | 'MODERATE' | 'SEVERE_CRITICAL';
  coagulopathySeverity: 'NONE' | 'MODERATE_CONSUMPTION' | 'SEVERE_TIC' | 'FULMINANT_HYPERFIBRINOLYSIS';
  lethalTriadScore: number; // 0 to 3
  predictedMortalityPercent: number;
}

export interface ResuscitationQualityEvaluation {
  ratioPrcbFfpPlt: string; // e.g. "1:1:1" or "4:1:0"
  isBalancedRatioAchieved: boolean;
  permissiveHypotensionAdherence: 'OPTIMAL' | 'OVER_RESUSCITATED' | 'UNDER_RESUSCITATED' | 'TBI_HYPOTENSION_CONTRAINDICATED';
  viscoelasticTherapyGuidance: string[];
  calciumCitrateAdequacy: 'ADEQUATE' | 'CRITICAL_HYPOCALCEMIA_RISK';
  crystalloidDilutionHazard: boolean;
  clinicalRecommendations: string[];
}

/**
 * 1. ABC (Assessment of Blood Consumption) Score & Shock Index
 */
export function calculateAbcScore(vitals: PatientTraumaVitals): AbcScoreResult {
  let score = 0;
  if (vitals.isPenetratingTrauma) score += 1;
  if (vitals.systolicBpMmHg <= 90) score += 1;
  if (vitals.heartRateBpm >= 120) score += 1;
  if (vitals.isPositiveFastUltrasound) score += 1;

  const shockIndex = vitals.systolicBpMmHg > 0 ? +(vitals.heartRateBpm / vitals.systolicBpMmHg).toFixed(2) : 2.0;

  let shockIndexInterpretation = 'Normal Shock Index (< 0.7)';
  if (shockIndex >= 1.4) {
    shockIndexInterpretation = 'Severe Hemorrhagic Shock (SI >= 1.4, high risk of immediate arrest)';
  } else if (shockIndex >= 1.0) {
    shockIndexInterpretation = 'Marked Hemodynamic Instability (SI >= 1.0, occult hypoperfusion)';
  } else if (shockIndex >= 0.7) {
    shockIndexInterpretation = 'Mild Shock / Borderline Compensation (0.7 - 0.9)';
  }

  return {
    score,
    mtpActivationRecommended: score >= 2 || shockIndex >= 1.3,
    shockIndex,
    shockIndexInterpretation,
  };
}

/**
 * 2. Lethal Triad Kinetics & Mortality Prediction
 */
export function evaluateLethalTriad(vitals: PatientTraumaVitals): LethalTriadSeverity {
  // Hypothermia grading
  let hypothermiaSeverity: LethalTriadSeverity['hypothermiaSeverity'] = 'NORMAL';
  if (vitals.temperatureCelsius < 32.0) hypothermiaSeverity = 'SEVERE_CRITICAL';
  else if (vitals.temperatureCelsius < 34.0) hypothermiaSeverity = 'MODERATE';
  else if (vitals.temperatureCelsius < 36.0) hypothermiaSeverity = 'MILD';

  // Acidosis grading
  let acidosisSeverity: LethalTriadSeverity['acidosisSeverity'] = 'NORMAL';
  if (vitals.arterialPh < 7.10 || vitals.baseDeficitMeqL >= 12) acidosisSeverity = 'SEVERE_CRITICAL';
  else if (vitals.arterialPh < 7.25 || vitals.baseDeficitMeqL >= 8) acidosisSeverity = 'MODERATE';
  else if (vitals.arterialPh < 7.35 || vitals.baseDeficitMeqL >= 4) acidosisSeverity = 'MILD';

  // Coagulopathy grading
  let coagulopathySeverity: LethalTriadSeverity['coagulopathySeverity'] = 'NONE';
  if (vitals.serumFibrinogenMgDl < 100 || vitals.plateletCountPerUl < 50000) {
    coagulopathySeverity = 'FULMINANT_HYPERFIBRINOLYSIS';
  } else if (vitals.serumFibrinogenMgDl < 150 || vitals.plateletCountPerUl < 100000) {
    coagulopathySeverity = 'SEVERE_TIC';
  } else if (vitals.serumFibrinogenMgDl < 200) {
    coagulopathySeverity = 'MODERATE_CONSUMPTION';
  }

  // Lethal triad score (0-3)
  let triadPoints = 0;
  if (vitals.temperatureCelsius < 35.0) triadPoints += 1;
  if (vitals.arterialPh < 7.20 || vitals.baseDeficitMeqL >= 8) triadPoints += 1;
  if (vitals.serumFibrinogenMgDl < 150 || vitals.plateletCountPerUl < 100000) triadPoints += 1;

  // Empirical mortality calibration
  let predictedMortality = 8;
  if (triadPoints === 1) predictedMortality = 25;
  else if (triadPoints === 2) predictedMortality = 55;
  else if (triadPoints === 3) predictedMortality = 88;

  return {
    hypothermiaSeverity,
    acidosisSeverity,
    coagulopathySeverity,
    lethalTriadScore: triadPoints,
    predictedMortalityPercent: predictedMortality,
  };
}

/**
 * 3. Evaluate Viscoelastic & Damage Control Resuscitation Quality
 */
export function evaluateDcrResuscitation(
  vitals: PatientTraumaVitals,
  fluids: ResuscitationFluidAdministered,
  visco: ViscoelasticParameters
): ResuscitationQualityEvaluation {
  const recommendations: string[] = [];
  const viscoGuidance: string[] = [];

  // Blood Product Ratios (pRBC : FFP : Platelet unit equivalents)
  // 1 apheresis platelet = 1 pool = matches 6 units of pRBC/FFP in a 1:1:1 pack
  const effectivePlatelets = fluids.plateletPheresisUnits * 6;
  const ratioPrcbFfpPlt = `${fluids.prbcUnits}:${fluids.ffpUnits}:${fluids.plateletPheresisUnits}`;

  const isBalancedRatioAchieved =
    fluids.prbcUnits > 0 &&
    fluids.ffpUnits >= fluids.prbcUnits * 0.7 &&
    effectivePlatelets >= fluids.prbcUnits * 0.7;

  // Permissive Hypotension Audit
  let permissiveHypotensionAdherence: ResuscitationQualityEvaluation['permissiveHypotensionAdherence'] = 'OPTIMAL';
  if (vitals.hasTraumaticBrainInjury) {
    if (vitals.systolicBpMmHg < 100) {
      permissiveHypotensionAdherence = 'TBI_HYPOTENSION_CONTRAINDICATED';
      recommendations.push(
        'CONTRAINDICATION: Permissive hypotension is forbidden in Traumatic Brain Injury. Maintain SBP >= 100-110 mmHg to preserve Cerebral Perfusion Pressure (CPP).'
      );
    }
  } else {
    if (vitals.systolicBpMmHg > 105) {
      permissiveHypotensionAdherence = 'OVER_RESUSCITATED';
      recommendations.push(
        'SBP > 100 mmHg in uncontrolled non-TBI bleeding risks "popping the clot", worsening intracavitary blood loss.'
      );
    } else if (vitals.systolicBpMmHg < 75) {
      permissiveHypotensionAdherence = 'UNDER_RESUSCITATED';
      recommendations.push(
        'Severe hypotension (SBP < 75 mmHg) threatens critical coronary and cerebral hypoperfusion.'
      );
    }
  }

  // Crystalloid Dilution Hazard
  const crystalloidDilutionHazard = fluids.crystalloidNormalSalineLiters > 1.5;
  if (crystalloidDilutionHazard) {
    recommendations.push(
      `Crystalloid Overload (${fluids.crystalloidNormalSalineLiters} L): Crystalloids degrade endothelial glycocalyx, cause hyperchloremic acidosis, and worsen dilutional coagulopathy. Restrict to minimal carrier fluid.`
    );
  }

  // TXA Guideline (CRASH-2 / CRASH-3)
  if (!fluids.txaGivenWithin3Hours) {
    recommendations.push(
      'Tranexamic Acid (TXA) has not been confirmed within 3 hours. Administer 1g IV bolus over 10 min, then 1g infusion over 8 hrs.'
    );
  }

  // Viscoelastic Target Guidance
  if (visco.rTimeMinutes > 10) {
    viscoGuidance.push(`Prolonged R-Time (${visco.rTimeMinutes} min > 10): Factor deficiency. Administer 2-4 units Fresh Frozen Plasma (FFP) or 4-Factor PCC.`);
  }

  if (visco.alphaAngleDegrees < 60) {
    viscoGuidance.push(`Low Alpha Angle (${visco.alphaAngleDegrees} deg < 60): Fibrinogen cleavage deficit. Administer Cryoprecipitate (10 units) or Fibrinogen Concentrate (2-4 g).`);
  }

  if (visco.maximumAmplitudeMm < 55) {
    viscoGuidance.push(`Low Maximum Amplitude (${visco.maximumAmplitudeMm} mm < 55): Platelet count/function exhaustion. Transfuse Apheresis Platelets and verify Cryoprecipitate.`);
  }

  if (visco.ly30Percent > 3.0) {
    viscoGuidance.push(`High LY30 (${visco.ly30Percent}% > 3%): Hyperfibrinolysis present. Immediate high-dose TXA indicated.`);
  }

  // Calcium & Citrate Management
  // Citrate in blood products chelates calcium. 1g CaCl2 recommended every 4 units of blood products
  const calciumNeededGrams = +(fluids.prbcUnits / 4).toFixed(1);
  const isHypocalcemiaCritical =
    vitals.ionizedCalciumMmolL < 1.1 || fluids.calciumChlorideGramsGiven < calciumNeededGrams * 0.5;

  let calciumCitrateAdequacy: ResuscitationQualityEvaluation['calciumCitrateAdequacy'] = 'ADEQUATE';
  if (isHypocalcemiaCritical) {
    calciumCitrateAdequacy = 'CRITICAL_HYPOCALCEMIA_RISK';
    recommendations.push(
      `Ionized Calcium is low (${vitals.ionizedCalciumMmolL} mmol/L). Citrate in stored blood chelates calcium, paralyzing clotting enzymes. Administer 1g Calcium Chloride IV (or 3g Calcium Gluconate).`
    );
  }

  return {
    ratioPrcbFfpPlt,
    isBalancedRatioAchieved,
    permissiveHypotensionAdherence,
    viscoelasticTherapyGuidance: viscoGuidance,
    calciumCitrateAdequacy,
    crystalloidDilutionHazard,
    clinicalRecommendations: recommendations,
  };
}
