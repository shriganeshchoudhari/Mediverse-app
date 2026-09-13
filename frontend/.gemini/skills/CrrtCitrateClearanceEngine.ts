/**
 * CrrtCitrateClearanceEngine.ts
 * Biophysical & Pharmacokinetic Engine for Continuous Renal Replacement Therapy (CRRT),
 * Modalities (CVVH, CVVHD, CVVHDF, SCUF), Convective vs Diffusive Solute Clearance,
 * Filtration Fraction, KDIGO Effluent Dosing & Regional Citrate Anticoagulation (RCA).
 *
 * References:
 * - KDIGO Clinical Practice Guideline for Acute Kidney Injury. Kidney Int Suppl. 2012;2(1):1-138.
 * - Ronco C, Bellomo R, Homel P, et al. Effects of different doses in continuous veno-venous
 *   haemofiltration on outcomes of acute renal failure: a prospective randomised trial.
 *   Lancet. 2000;356(9223):26-30.
 * - Schneider AG, Bellomo R, Bagshaw SM, et al. Choice of renal replacement therapy modality
 *   and dialysis dependence after acute kidney injury: a systematic review and meta-analysis.
 *   Intensive Care Med. 2013;39(6):987-997.
 * - Schilder L, Nurmohamed SA, ter Wee PM, et al. Citrate anticoagulation in continuous
 *   veno-venous hemofiltration. Nat Rev Nephrol. 2014;10(9):524-533.
 */

export type CrrtModality = 'cvvh' | 'cvvhd' | 'cvvhdf' | 'scuf';
export type ReplacementMode = 'pre_filter' | 'post_filter' | 'split_50_50';

export interface CrrtParameters {
  modality: CrrtModality;
  bloodFlowQbMlMin: number; // 100 - 300 mL/min (typical 150-200)
  dialysateFlowQdMlHr: number; // 0 - 4000 mL/h
  replacementFlowQrepMlHr: number; // 0 - 4000 mL/h
  replacementMode: ReplacementMode;
  netUltrafiltrationMlHr: number; // 0 - 1000 mL/h (fluid balance removal)
  patientWeightKg: number;
  hematocritFraction: number; // 0.20 - 0.50 (e.g. 0.30)
}

export interface CitrateAnticoagulationParameters {
  citrateInfusionRateMmolHr: number; // typical 10 - 40 mmol/h
  circuitIonizedCaMmolL: number; // target 0.25 - 0.35 mmol/L
  systemicIonizedCaMmolL: number; // target 1.10 - 1.30 mmol/L
  totalSerumCaMmolL: number; // normal 2.15 - 2.55 mmol/L
  hepaticFunction: 'normal' | 'mild_impairment' | 'severe_failure_shock';
}

export interface CrrtDoseReport {
  totalEffluentMlHr: number;
  prescribedEffluentDoseMlKgHr: number;
  effectiveDeliveredDoseMlKgHr: number; // pre-dilution corrected
  preDilutionClearancePenaltyPercent: number; // % reduction in clearance
  filtrationFractionPercent: number; // < 20-25% target
  filtrationFractionSafe: boolean;
  plasmaFlowQpMlMin: number;
  totalUltrafiltrationQufMlHr: number;
  kdigoDoseAdequate: boolean; // >= 20-25 mL/kg/h
}

export interface SoluteClearanceMetrics {
  ureaClearanceMlMin: number; // MW 60 Da (diffusive & convective Sc ~ 1.0)
  creatinineClearanceMlMin: number; // MW 113 Da
  vancomycinClearanceMlMin: number; // MW 1448 Da (Sc ~ 0.80)
  myoglobinClearanceMlMin: number; // MW 17,800 Da (Sc ~ 0.55 in high flux CVVH, Sc ~ 0 in CVVHD)
  middleMoleculeAdvantage: 'Predominantly Convective (CVVH)' | 'Predominantly Diffusive (CVVHD)' | 'Balanced Synergistic (CVVHDF)';
}

export interface CitrateSafetyReport {
  circuitAnticoagulationAdequate: boolean; // circuit iCa 0.25 - 0.35
  systemicHypocalcemiaAlert: boolean; // systemic iCa < 1.05
  totalToIonizedCaRatio: number; // Ratio > 2.5 warns of citrate accumulation ("citrate lock")
  citrateAccumulationAlert: boolean;
  metabolicStatus: 'Normal Bicarbonate Generation' | 'Metabolic Alkalosis (Excess Citrate)' | 'Citrate Lock / Acidosis (Hepatic Failure)';
  recommendations: string[];
}

export interface FilterPressureMetrics {
  transmembranePressureMmHg: number; // TMP = (Part + Pven)/2 - Peff
  filterPressureDropMmHg: number; // Delta P = Part - Pven
  membraneFoulingWarning: boolean; // TMP > 200 mmHg
  filterClottingWarning: boolean; // Delta P > 150 mmHg
}

export interface CrrtScenario {
  id: string;
  name: string;
  patientDiagnosis: string;
  patientProfile: string;
  weightKg: number;
  hematocrit: number;
  defaultParams: CrrtParameters;
  defaultCitrate: CitrateAnticoagulationParameters;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Effluent Dose, Pre-dilution Penalty & Filtration Fraction
 */
export function calculateCrrtDose(params: CrrtParameters): CrrtDoseReport {
  const {
    modality,
    bloodFlowQbMlMin,
    dialysateFlowQdMlHr,
    replacementFlowQrepMlHr,
    replacementMode,
    netUltrafiltrationMlHr,
    patientWeightKg,
    hematocritFraction,
  } = params;

  // Zero out invalid flows based on modality
  let effectiveQd = dialysateFlowQdMlHr;
  let effectiveQrep = replacementFlowQrepMlHr;
  let effectiveNetUf = netUltrafiltrationMlHr;

  if (modality === 'cvvh') effectiveQd = 0;
  if (modality === 'cvvhd') effectiveQrep = 0;
  if (modality === 'scuf') {
    effectiveQd = 0;
    effectiveQrep = 0;
  }

  // Plasma Flow (Qp) in mL/min and mL/h
  const plasmaFlowQpMlMin = bloodFlowQbMlMin * (1 - hematocritFraction);
  const plasmaFlowQpMlHr = plasmaFlowQpMlMin * 60;

  // Total Ultrafiltration (Quf) = Replacement Flow + Net UF
  const totalUltrafiltrationQufMlHr = effectiveQrep + effectiveNetUf;

  // Total Effluent Flow (Qeff) = Qd + Qrep + Net UF
  const totalEffluentMlHr = effectiveQd + totalUltrafiltrationQufMlHr;

  // Prescribed Effluent Dose (mL/kg/h)
  const prescribedEffluentDoseMlKgHr =
    patientWeightKg > 0 ? Math.round((totalEffluentMlHr / patientWeightKg) * 10) / 10 : 0;

  // Pre-dilution Fraction & Clearance Penalty
  let preDilutionFraction = 0;
  if (replacementMode === 'pre_filter' && effectiveQrep > 0) {
    preDilutionFraction = 1.0;
  } else if (replacementMode === 'split_50_50' && effectiveQrep > 0) {
    preDilutionFraction = 0.5;
  }

  const preFilterRepFlowMlHr = effectiveQrep * preDilutionFraction;
  // Dilution factor = Qp / (Qp + Qrep,pre)
  const dilutionFactor =
    preFilterRepFlowMlHr > 0 ? plasmaFlowQpMlHr / (plasmaFlowQpMlHr + preFilterRepFlowMlHr) : 1.0;

  const preDilutionClearancePenaltyPercent = Math.round((1 - dilutionFactor) * 100);

  // Effective Delivered Dose (mL/kg/h)
  // Dilution affects convective portion of clearance
  const convectivePortion = totalUltrafiltrationQufMlHr * dilutionFactor;
  const diffusivePortion = effectiveQd;
  const effectiveDeliveredMlHr = convectivePortion + diffusivePortion;
  const effectiveDeliveredDoseMlKgHr =
    patientWeightKg > 0 ? Math.round((effectiveDeliveredMlHr / patientWeightKg) * 10) / 10 : 0;

  // Filtration Fraction (FF) = Quf / (Qp + Qrep,pre) * 100
  const denominator = plasmaFlowQpMlHr + preFilterRepFlowMlHr;
  const filtrationFractionPercent =
    denominator > 0 ? Math.round((totalUltrafiltrationQufMlHr / denominator) * 1000) / 10 : 0;
  const filtrationFractionSafe = filtrationFractionPercent <= 25.0;

  // KDIGO recommendation is delivered 20-25 mL/kg/h
  const kdigoDoseAdequate = effectiveDeliveredDoseMlKgHr >= 20.0;

  return {
    totalEffluentMlHr,
    prescribedEffluentDoseMlKgHr,
    effectiveDeliveredDoseMlKgHr,
    preDilutionClearancePenaltyPercent,
    filtrationFractionPercent,
    filtrationFractionSafe,
    plasmaFlowQpMlMin: Math.round(plasmaFlowQpMlMin),
    totalUltrafiltrationQufMlHr,
    kdigoDoseAdequate,
  };
}

/**
 * 2. Calculate Specific Solute Clearance (Urea, Creatinine, Middle Molecules)
 */
export function calculateSoluteClearance(
  params: CrrtParameters,
  doseReport: CrrtDoseReport
): SoluteClearanceMetrics {
  const { modality, dialysateFlowQdMlHr, replacementFlowQrepMlHr, replacementMode, netUltrafiltrationMlHr, bloodFlowQbMlMin, hematocritFraction } = params;

  let effectiveQd = dialysateFlowQdMlHr;
  let effectiveQrep = replacementFlowQrepMlHr;
  if (modality === 'cvvh') effectiveQd = 0;
  if (modality === 'cvvhd') effectiveQrep = 0;
  if (modality === 'scuf') { effectiveQd = 0; effectiveQrep = 0; }

  const qpMlHr = bloodFlowQbMlMin * (1 - hematocritFraction) * 60;
  let preDilutionRatio = 0;
  if (replacementMode === 'pre_filter') preDilutionRatio = 1.0;
  else if (replacementMode === 'split_50_50') preDilutionRatio = 0.5;

  const qrepPre = effectiveQrep * preDilutionRatio;
  const dilutionFactor = qrepPre > 0 ? qpMlHr / (qpMlHr + qrepPre) : 1.0;

  const totalQuf = effectiveQrep + netUltrafiltrationMlHr;

  // Solute Sieving Coefficients (Sc):
  // Urea: Sc ~ 1.0, Diffusive ~ 1.0
  // Creatinine: Sc ~ 1.0, Diffusive ~ 0.95
  // Vancomycin: Sc ~ 0.80, Diffusive ~ 0.65
  // Myoglobin (17.8 kDa): Sc ~ 0.55 (convective high-flux), Diffusive ~ 0.05
  const ureaTotalMlHr = effectiveQd * 0.95 + totalQuf * dilutionFactor * 1.0;
  const creatTotalMlHr = effectiveQd * 0.90 + totalQuf * dilutionFactor * 0.98;
  const vancTotalMlHr = effectiveQd * 0.60 + totalQuf * dilutionFactor * 0.80;
  const myogTotalMlHr = effectiveQd * 0.05 + totalQuf * dilutionFactor * 0.55;

  let middleMoleculeAdvantage: 'Predominantly Convective (CVVH)' | 'Predominantly Diffusive (CVVHD)' | 'Balanced Synergistic (CVVHDF)' =
    'Balanced Synergistic (CVVHDF)';
  if (modality === 'cvvh') middleMoleculeAdvantage = 'Predominantly Convective (CVVH)';
  else if (modality === 'cvvhd') middleMoleculeAdvantage = 'Predominantly Diffusive (CVVHD)';

  return {
    ureaClearanceMlMin: Math.round((ureaTotalMlHr / 60) * 10) / 10,
    creatinineClearanceMlMin: Math.round((creatTotalMlHr / 60) * 10) / 10,
    vancomycinClearanceMlMin: Math.round((vancTotalMlHr / 60) * 10) / 10,
    myoglobinClearanceMlMin: Math.round((myogTotalMlHr / 60) * 10) / 10,
    middleMoleculeAdvantage,
  };
}

/**
 * 3. Regional Citrate Anticoagulation (RCA) & "Citrate Lock" Surveillance
 */
export function evaluateCitrateAnticoagulation(
  citrate: CitrateAnticoagulationParameters
): CitrateSafetyReport {
  const {
    circuitIonizedCaMmolL,
    systemicIonizedCaMmolL,
    totalSerumCaMmolL,
    hepaticFunction,
  } = citrate;

  // Circuit anticoagulation check: target circuit iCa 0.25 - 0.35 mmol/L
  const circuitAnticoagulationAdequate =
    circuitIonizedCaMmolL >= 0.20 && circuitIonizedCaMmolL <= 0.38;

  // Systemic hypocalcemia check: target systemic iCa >= 1.10 mmol/L
  const systemicHypocalcemiaAlert = systemicIonizedCaMmolL < 1.05;

  // Total Ca to Ionized Ca ratio:
  // Ratio > 2.5 is diagnostic of Citrate Accumulation ("citrate lock")
  const totalToIonizedCaRatio =
    systemicIonizedCaMmolL > 0
      ? Math.round((totalSerumCaMmolL / systemicIonizedCaMmolL) * 100) / 100
      : 0;

  const citrateAccumulationAlert =
    totalToIonizedCaRatio >= 2.5 || hepaticFunction === 'severe_failure_shock';

  let metabolicStatus:
    | 'Normal Bicarbonate Generation'
    | 'Metabolic Alkalosis (Excess Citrate)'
    | 'Citrate Lock / Acidosis (Hepatic Failure)' = 'Normal Bicarbonate Generation';

  if (citrateAccumulationAlert) {
    metabolicStatus = 'Citrate Lock / Acidosis (Hepatic Failure)';
  } else if (systemicIonizedCaMmolL > 1.25 && circuitIonizedCaMmolL < 0.25) {
    metabolicStatus = 'Metabolic Alkalosis (Excess Citrate)';
  }

  const recommendations: string[] = [];

  if (!circuitAnticoagulationAdequate) {
    if (circuitIonizedCaMmolL > 0.38) {
      recommendations.push(
        `Under-anticoagulation in circuit (iCa ${circuitIonizedCaMmolL} mmol/L > 0.35). Increase pre-filter citrate infusion by 10-20% to prevent filter clotting.`
      );
    } else {
      recommendations.push(
        `Over-chelation in circuit (iCa ${circuitIonizedCaMmolL} mmol/L < 0.25). Decrease citrate infusion rate slightly.`
      );
    }
  } else {
    recommendations.push(
      'Circuit anticoagulation is optimal (circuit iCa 0.25 - 0.35 mmol/L). Filter life maximized.'
    );
  }

  if (systemicHypocalcemiaAlert) {
    recommendations.push(
      `CRITICAL: Systemic hypocalcemia (systemic iCa ${systemicIonizedCaMmolL} mmol/L). Increase systemic IV Calcium Chloride / Gluconate infusion immediately to prevent tetany and arrhythmias.`
    );
  }

  if (citrateAccumulationAlert) {
    recommendations.push(
      `CITRATE TOXICITY ("CITRATE LOCK"): Total Ca / Ionized Ca ratio ${totalToIonizedCaRatio} >= 2.5. Liver unable to metabolize citrate. Discontinue citrate immediately; convert to systemic heparin or no-anticoagulation CRRT.`
    );
  }

  return {
    circuitAnticoagulationAdequate,
    systemicHypocalcemiaAlert,
    totalToIonizedCaRatio,
    citrateAccumulationAlert,
    metabolicStatus,
    recommendations,
  };
}

/**
 * 4. Transmembrane Pressure (TMP) & Pressure Drop Calculator
 */
export function calculateFilterPressures(
  arterialPressureMmHg: number = 100,
  venousPressureMmHg: number = 120,
  effluentPressureMmHg: number = -50
): FilterPressureMetrics {
  // TMP = (Part + Pven)/2 - Peff
  const tmp = (arterialPressureMmHg + venousPressureMmHg) / 2 - effluentPressureMmHg;
  // Pressure Drop = Part - Pven (or Ppre-filter - Ppost-filter)
  const filterPressureDropMmHg = Math.abs(arterialPressureMmHg - venousPressureMmHg);

  const membraneFoulingWarning = tmp >= 200;
  const filterClottingWarning = filterPressureDropMmHg >= 150;

  return {
    transmembranePressureMmHg: Math.round(tmp),
    filterPressureDropMmHg: Math.round(filterPressureDropMmHg),
    membraneFoulingWarning,
    filterClottingWarning,
  };
}

/**
 * 5. CRRT Clinical Scenarios Catalog
 */
export const CRRT_SCENARIOS: Record<string, CrrtScenario> = {
  septic_shock_aki: {
    id: 'septic_shock_aki',
    name: '1. Septic Shock & AKI Stage 3 (Balanced CVVHDF with RCA)',
    patientDiagnosis: 'Septic Shock / Sepsis-Induced Oliguric AKI',
    patientProfile: '64yo male with fecal peritonitis, on norepinephrine, anuric for 18h, BUN 98 mg/dL, Cr 4.6 mg/dL, K+ 6.2 mEq/L.',
    weightKg: 80,
    hematocrit: 0.28,
    defaultParams: {
      modality: 'cvvhdf',
      bloodFlowQbMlMin: 180,
      dialysateFlowQdMlHr: 1200,
      replacementFlowQrepMlHr: 1000,
      replacementMode: 'post_filter',
      netUltrafiltrationMlHr: 150,
      patientWeightKg: 80,
      hematocritFraction: 0.28,
    },
    defaultCitrate: {
      citrateInfusionRateMmolHr: 24,
      circuitIonizedCaMmolL: 0.29,
      systemicIonizedCaMmolL: 1.18,
      totalSerumCaMmolL: 2.30,
      hepaticFunction: 'normal',
    },
    clinicalPearls: [
      'Delivered effluent dose of 29.4 mL/kg/h exceeds the KDIGO 20-25 mL/kg/h target, accounting for downtime.',
      'CVVHDF provides high small solute diffusion (clearance of urea/K+) plus convective middle-molecule cytokine clearance.',
      'Target post-filter circuit iCa 0.25-0.35 mmol/L guarantees long filter lifespan (> 72 hours).',
    ],
  },
  rhabdomyolysis_myoglobin: {
    id: 'rhabdomyolysis_myoglobin',
    name: '2. Crush Injury & Rhabdomyolysis (High-Volume Convective CVVH)',
    patientDiagnosis: 'Severe Traumatic Rhabdomyolysis / Pigment Nephropathy',
    patientProfile: '32yo male trapped in building collapse. Serum CK 142,000 U/L, serum myoglobin 28,000 mcg/L, dark tea urine.',
    weightKg: 85,
    hematocrit: 0.35,
    defaultParams: {
      modality: 'cvvh',
      bloodFlowQbMlMin: 220,
      dialysateFlowQdMlHr: 0,
      replacementFlowQrepMlHr: 2800,
      replacementMode: 'pre_filter',
      netUltrafiltrationMlHr: 100,
      patientWeightKg: 85,
      hematocritFraction: 0.35,
    },
    defaultCitrate: {
      citrateInfusionRateMmolHr: 28,
      circuitIonizedCaMmolL: 0.31,
      systemicIonizedCaMmolL: 1.15,
      totalSerumCaMmolL: 2.25,
      hepaticFunction: 'normal',
    },
    clinicalPearls: [
      'Myoglobin has a high molecular weight (17.8 kDa) and requires pure convective hemofiltration (CVVH) with high-cutoff filter.',
      'Pre-dilution replacement fluid dilutes blood entering the hemofilter, preventing hemoconcentration and protein fouling.',
      'Target delivered dose ~ 30-35 mL/kg/h to maximize continuous myoglobin clearance.',
    ],
  },
  cirrhosis_citrate_lock: {
    id: 'cirrhosis_citrate_lock',
    name: '3. Decompensated Cirrhosis & Citrate Toxicity ("Citrate Lock")',
    patientDiagnosis: 'Hepatorenal Syndrome AKI / End-Stage Liver Disease',
    patientProfile: '55yo female with alcohol-related cirrhosis, MELD 36, jaundice, severe coagulopathy, rising total calcium.',
    weightKg: 65,
    hematocrit: 0.24,
    defaultParams: {
      modality: 'cvvhd',
      bloodFlowQbMlMin: 150,
      dialysateFlowQdMlHr: 1600,
      replacementFlowQrepMlHr: 0,
      replacementMode: 'post_filter',
      netUltrafiltrationMlHr: 50,
      patientWeightKg: 65,
      hematocritFraction: 0.24,
    },
    defaultCitrate: {
      citrateInfusionRateMmolHr: 20,
      circuitIonizedCaMmolL: 0.26,
      systemicIonizedCaMmolL: 0.92,
      totalSerumCaMmolL: 2.65,
      hepaticFunction: 'severe_failure_shock',
    },
    clinicalPearls: [
      'Total Ca to Ionized Ca ratio = 2.65 / 0.92 = 2.88 (> 2.5), diagnostic of severe citrate lock.',
      'Liver cannot metabolize citrate into bicarbonate; unmetabolized citrate binds circulating calcium, worsening acidosis and shock.',
      'Immediate action: Stop citrate infusion immediately; switch to systemic heparin or no-anticoagulation CRRT with frequent saline flushes.',
    ],
  },
  cardiorenal_scuf: {
    id: 'cardiorenal_scuf',
    name: '4. Refractory Acute Decompensated Heart Failure (SCUF / CVVHD)',
    patientDiagnosis: 'Cardiorenal Syndrome Type 1 / Diuretic Resistance',
    patientProfile: '71yo male with ischemic cardiomyopathy (LVEF 15%), anasarca, refractory to continuous furosemide + metolazone.',
    weightKg: 90,
    hematocrit: 0.32,
    defaultParams: {
      modality: 'scuf',
      bloodFlowQbMlMin: 120,
      dialysateFlowQdMlHr: 0,
      replacementFlowQrepMlHr: 0,
      replacementMode: 'post_filter',
      netUltrafiltrationMlHr: 250,
      patientWeightKg: 90,
      hematocritFraction: 0.32,
    },
    defaultCitrate: {
      citrateInfusionRateMmolHr: 16,
      circuitIonizedCaMmolL: 0.32,
      systemicIonizedCaMmolL: 1.22,
      totalSerumCaMmolL: 2.35,
      hepaticFunction: 'mild_impairment',
    },
    clinicalPearls: [
      'SCUF focuses purely on fluid removal (net ultrafiltration 200-300 mL/h) with zero solute exchange.',
      'Preserves renal perfusion and avoids intravascular depletion by matching ultrafiltration rate to interstitial refill rate.',
      'If uremia or hyperkalemia develops, convert from SCUF to CVVHD or CVVHDF.',
    ],
  },
};
