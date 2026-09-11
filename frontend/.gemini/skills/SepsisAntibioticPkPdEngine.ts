/**
 * SepsisAntibioticPkPdEngine.ts
 * Biophysical & Pharmacokinetic/Pharmacodynamic (PK/PD) Engine for Sepsis Resuscitation Bundles (SEP-1),
 * Dynamic Fluid Responsiveness, Antimicrobial PK/PD Target Attainment (fT>MIC, Cmax/MIC, AUC/MIC),
 * and Serial Procalcitonin (PCT) De-escalation Kinetics.
 * Location: frontend/.gemini/skills/SepsisAntibioticPkPdEngine.ts
 */

export type SepsisSeverityType =
  | 'SIRS_UNCOMPLICATED'
  | 'SEPSIS_ORGAN_DYSFUNCTION' // SOFA increase >= 2
  | 'SEPTIC_SHOCK_REFRACTORY'; // Hypotension needing vasopressors + Lactate > 2 despite fluids

export type AntibioticClassType =
  | 'BETA_LACTAM_TIME_DEPENDENT' // Piperacillin-Tazobactam, Meropenem, Cefepime
  | 'AMINOGLYCOSIDE_CONC_DEPENDENT' // Gentamicin, Amikacin
  | 'GLYCOPEPTIDE_AUC_DEPENDENT' // Vancomycin (AUC/MIC 400-600)
  | 'FLUOROQUINOLONE_AUC_DEPENDENT'; // Levofloxacin

export interface PatientSepsisVitals {
  weightKg: number;
  creatinineClearanceMlMin: number; // Augmented Renal Clearance (ARC > 130) vs CKD
  systolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  heartRateBpm: number;
  serumLactateMmolL: number;
  baselineProcalcitoninMcgL: number;
  currentProcalcitoninMcgL: number;
  isNorepinephrineInfusing: boolean;
  norepinephrineDoseMcgKgMin: number;
  isVasopressinInfusing: boolean;
}

export interface Sep1BundleChecklist {
  serumLactateMeasuredInitial: boolean;
  bloodCulturesDrawnBeforeAntibiotics: boolean;
  broadSpectrumAntibioticsAdministeredWithin1Hour: boolean;
  crystalloid30MlPerKgCompleted: boolean; // Required if MAP < 65 or initial lactate >= 4.0
  repeatLactateWithin2To4Hours: boolean; // Required if initial lactate > 2.0
  dynamicFluidResponsivenessAssessed: boolean; // Passive Leg Raise / SVV
}

export interface AntibioticPkPdDosingInput {
  drugName: string;
  antibioticClass: AntibioticClassType;
  doseMg: number;
  dosingIntervalHours: number;
  infusionDurationHours: number; // e.g. 0.5h standard vs 3.0-4.0h extended vs 24h continuous
  pathogenMicMgL: number; // e.g. Pseudomonas aeruginosa MIC = 8 mg/L for Pip-Tazo, 2 mg/L for Meropenem
}

export interface Sep1ComplianceResult {
  isCompliant: boolean;
  bundlePhase: 'HOUR_1_BUNDLE' | 'HOUR_3_HOUR_6_BUNDLE' | 'FULLY_COMPLIANT';
  failedElements: string[];
  fluidVolumeRequiredMl: number;
  fluidVolumeAdministeredStatus: string;
  clinicalActionAlerts: string[];
}

export interface PkPdAttainmentResult {
  indexType: 'fT_GREATER_THAN_MIC' | 'CMAX_TO_MIC' | 'AUC_TO_MIC';
  targetValueRequired: string;
  simulatedValue: number;
  isTargetAttained: boolean;
  optimizationRecommendation: string;
  augmentedRenalClearanceHazard: boolean;
}

export interface ProcalcitoninKineticResult {
  procalcitoninDropPercent: number;
  isDeEscalationSafe: boolean;
  recommendation: string;
}

/**
 * 1. Evaluate SEP-1 Hour-1 and Hour-3 Bundle Compliance
 */
export function evaluateSep1Compliance(
  vitals: PatientSepsisVitals,
  bundle: Sep1BundleChecklist
): Sep1ComplianceResult {
  const failed: string[] = [];
  const alerts: string[] = [];

  const fluidVolumeRequiredMl = +(vitals.weightKg * 30).toFixed(0);
  const requires30MlPerKg = vitals.meanArterialPressureMmHg < 65 || vitals.serumLactateMmolL >= 4.0;
  const requiresRepeatLactate = vitals.serumLactateMmolL > 2.0;

  // Hour-1 components
  if (!bundle.serumLactateMeasuredInitial) {
    failed.push('Initial serum lactate measurement missing.');
  }

  if (!bundle.bloodCulturesDrawnBeforeAntibiotics) {
    failed.push('Blood cultures must be drawn PRIOR to starting empirical antibiotics.');
    alerts.push('Blood cultures drawn after antimicrobials drop diagnostic yield by >50%.');
  }

  if (!bundle.broadSpectrumAntibioticsAdministeredWithin1Hour) {
    failed.push('Broad-spectrum IV antimicrobials not administered within 1 hour of sepsis recognition.');
    alerts.push('Each hour of delay in antibiotic administration in septic shock increases mortality by ~7.6%.');
  }

  if (requires30MlPerKg && !bundle.crystalloid30MlPerKgCompleted) {
    failed.push(`Rapid administration of 30 mL/kg crystalloid (${fluidVolumeRequiredMl} mL) incomplete.`);
  }

  // Resuscitation and repeat lactate
  if (requiresRepeatLactate && !bundle.repeatLactateWithin2To4Hours) {
    failed.push('Repeat serum lactate within 2-4 hours required to assess lactate clearance.');
  }

  if (vitals.meanArterialPressureMmHg < 65 && !vitals.isNorepinephrineInfusing) {
    alerts.push('MAP < 65 mmHg despite initial fluid: Immediately initiate IV Norepinephrine (first-line vasopressor).');
  }

  if (vitals.norepinephrineDoseMcgKgMin > 0.25 && !vitals.isVasopressinInfusing) {
    alerts.push('Refractory vasoplegia: Add fixed-dose Vasopressin (0.03 units/min) to reduce Norepinephrine requirements.');
  }

  const isCompliant = failed.length === 0;

  let fluidVolumeAdministeredStatus = '30 mL/kg crystalloid not mandated (MAP >= 65 and initial lactate < 4.0)';
  if (requires30MlPerKg) {
    fluidVolumeAdministeredStatus = bundle.crystalloid30MlPerKgCompleted
      ? `Completed: ${fluidVolumeRequiredMl} mL balanced crystalloid administered.`
      : `Pending: Administer ${fluidVolumeRequiredMl} mL balanced crystalloid rapidly.`;
  }

  return {
    isCompliant,
    bundlePhase: isCompliant ? 'FULLY_COMPLIANT' : 'HOUR_1_BUNDLE',
    failedElements: failed,
    fluidVolumeRequiredMl,
    fluidVolumeAdministeredStatus,
    clinicalActionAlerts: alerts,
  };
}

/**
 * 2. Calculate Antimicrobial PK/PD Target Attainment (Beta-lactam, Aminoglycoside, Vancomycin)
 */
export function calculateAntibioticPkPd(
  vitals: PatientSepsisVitals,
  antibiotic: AntibioticPkPdDosingInput
): PkPdAttainmentResult {
  const isArc = vitals.creatinineClearanceMlMin > 130;

  if (antibiotic.antibioticClass === 'BETA_LACTAM_TIME_DEPENDENT') {
    // Time-dependent killing: %fT > MIC
    // Critical care target: %fT > MIC >= 70% (or 100% in severe septic shock)
    const halfLifeHours = isArc ? 0.7 : vitals.creatinineClearanceMlMin < 50 ? 2.5 : 1.1;
    const ke = Math.LN2 / halfLifeHours;
    const vd = vitals.weightKg * 0.32; // Expanded Vd in sepsis (~0.32 L/kg)
    const peakConc = (antibiotic.doseMg / vd) * (antibiotic.infusionDurationHours <= 1.0 ? 1.0 : 0.75);

    let timeAboveMicHours = 0;
    if (peakConc > antibiotic.pathogenMicMgL) {
      const postInfusionHours = Math.max(0, Math.log(peakConc / antibiotic.pathogenMicMgL) / ke);
      timeAboveMicHours = antibiotic.infusionDurationHours + postInfusionHours;
    }
    const simulatedPercentage = Math.min(
      100,
      Math.max(5, Math.round((timeAboveMicHours / antibiotic.dosingIntervalHours) * 100))
    );

    const isTargetAttained = simulatedPercentage >= 70;
    let recommendation = `Optimal beta-lactam target attained (%fT > MIC = ${simulatedPercentage}% >= 70%).`;
    if (!isTargetAttained) {
      recommendation =
        `SUB-THERAPEUTIC (%fT > MIC = ${simulatedPercentage}% < 70%): Convert to 3-4 hour Extended Infusion or continuous infusion. Extended infusion dramatically sustains drug above MIC in septic hyperdynamic/ARC circulation.`;
    }

    return {
      indexType: 'fT_GREATER_THAN_MIC',
      targetValueRequired: '%fT > MIC >= 70% (100% in critical sepsis)',
      simulatedValue: simulatedPercentage,
      isTargetAttained,
      optimizationRecommendation: recommendation,
      augmentedRenalClearanceHazard: isArc,
    };
  }

  if (antibiotic.antibioticClass === 'AMINOGLYCOSIDE_CONC_DEPENDENT') {
    // Concentration-dependent: Cmax / MIC >= 8-10
    // Volume of distribution in sepsis is expanded (0.35 - 0.45 L/kg)
    const vd = vitals.weightKg * 0.35;
    const simulatedCmax = +(antibiotic.doseMg / vd).toFixed(1);
    const cmaxRatio = +(simulatedCmax / antibiotic.pathogenMicMgL).toFixed(1);
    const isTargetAttained = cmaxRatio >= 8.0;

    let recommendation = `Cmax/MIC ratio of ${cmaxRatio} is therapeutic (>= 8-10). Extended-interval dosing maximizes bactericidal peak and minimizes nephrotoxicity.`;
    if (!isTargetAttained) {
      recommendation = `SUB-THERAPEUTIC PEAK (${cmaxRatio} < 8-10): Increase single extended-interval dose to 7 mg/kg to overcome expanded septic volume of distribution.`;
    }

    return {
      indexType: 'CMAX_TO_MIC',
      targetValueRequired: 'Cmax / MIC >= 8.0 - 10.0',
      simulatedValue: cmaxRatio,
      isTargetAttained,
      optimizationRecommendation: recommendation,
      augmentedRenalClearanceHazard: isArc,
    };
  }

  // Glycopeptide / Fluoroquinolone: AUC24 / MIC
  // Vancomycin consensus target AUC24/MIC = 400 - 600 mg*h/L
  const dailyDose = (antibiotic.doseMg * 24) / antibiotic.dosingIntervalHours;
  const clearanceLPerHour = (vitals.creatinineClearanceMlMin * 0.06 * 0.7); // Approximate vancomycin clearance
  const estimatedAuc = +(dailyDose / Math.max(1, clearanceLPerHour)).toFixed(0);
  const aucRatio = +(estimatedAuc / antibiotic.pathogenMicMgL).toFixed(0);

  const isTargetAttained = aucRatio >= 400 && aucRatio <= 600;
  let recommendation = `Target AUC24/MIC of ${aucRatio} achieved (400-600 mg*h/L). Safe clinical efficacy with minimal AKI risk.`;
  if (aucRatio < 400) {
    recommendation = `SUB-THERAPEUTIC AUC (${aucRatio} < 400): Increases risk of treatment failure and vancomycin intermediate resistance (VISA). Increase daily dose.`;
  } else if (aucRatio > 600) {
    recommendation = `NEPHROTOXIC HAZARD (AUC ${aucRatio} > 600): Significantly elevated risk of acute kidney injury (AKI). Reduce maintenance dose.`;
  }

  return {
    indexType: 'AUC_TO_MIC',
    targetValueRequired: 'AUC24 / MIC = 400 - 600 mg*h/L',
    simulatedValue: aucRatio,
    isTargetAttained,
    optimizationRecommendation: recommendation,
    augmentedRenalClearanceHazard: isArc,
  };
}

/**
 * 3. Procalcitonin (PCT) De-Escalation Dynamics
 */
export function evaluateProcalcitoninKinetics(
  baselinePctMcgL: number,
  currentPctMcgL: number
): ProcalcitoninKineticResult {
  if (baselinePctMcgL <= 0) {
    return {
      procalcitoninDropPercent: 0,
      isDeEscalationSafe: false,
      recommendation: 'Baseline procalcitonin missing or zero; obtain serial levels.',
    };
  }

  const dropPercent = +(((baselinePctMcgL - currentPctMcgL) / baselinePctMcgL) * 100).toFixed(1);
  const isDeEscalationSafe = dropPercent >= 80 || currentPctMcgL < 0.50;

  let recommendation = '';
  if (currentPctMcgL < 0.25) {
    recommendation =
      'Bacterial infection resolved or highly unlikely (PCT < 0.25 mcg/L). Discontinuation of antimicrobials strongly recommended.';
  } else if (isDeEscalationSafe) {
    recommendation = `Favorable kinetic response (PCT dropped ${dropPercent}% or < 0.50 mcg/L). Safe to de-escalate or discontinue antimicrobials according to stewardship protocols.`;
  } else {
    recommendation = `Treatment non-response or ongoing infection (PCT drop only ${dropPercent}%). Re-evaluate source control, repeat imaging, and review microbiological sensitivities.`;
  }

  return {
    procalcitoninDropPercent: dropPercent,
    isDeEscalationSafe,
    recommendation,
  };
}
