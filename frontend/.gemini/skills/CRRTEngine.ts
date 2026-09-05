/**
 * CRRTEngine.ts
 * 
 * Continuous Renal Replacement Therapy (CRRT) & Extracorporeal Blood Purification Simulation Engine.
 * 
 * Implements:
 * - 4 Classic Modalities: SCUF, CVVH (Pre- vs Post-Dilution), CVVHD, and CVVHDF
 * - Transmembrane Pressure (TMP), Filter Pressure Drop (ΔP_filter), and Membrane Fouling / Clotting Kinetics
 * - KDIGO Effluent Dosing Guidelines (mL/kg/h) & Filtration Fraction (FF %)
 * - Regional Citrate Anticoagulation (RCA) Protocol with Circuit iCa, Systemic iCa, and Citrate Lock Ratio
 * - Solute Clearance Kinetics (Urea/BUN, Potassium, Bicarbonate, Creatinine) and 24-hr Fluid Balance
 * - 6 Evidence-Based Critical Care AKI Scenarios
 * 
 * Location: frontend/.gemini/skills/CRRTEngine.ts
 */

export type CRRTModality = 'SCUF' | 'CVVH' | 'CVVHD' | 'CVVHDF';

export type DilutionMode = 'PRE_DILUTION' | 'POST_DILUTION';

export type AnticoagulationStrategy = 'NONE' | 'HEPARIN' | 'REGIONAL_CITRATE';

export interface CRRTPatientParameters {
  weightKg: number;
  hematocritPct: number; // e.g. 30%
  baselineBUNMgDl: number;
  baselineCreatinineMgDl: number;
  baselinePotassiumMeqL: number;
  baselineBicarbonateMeqL: number;
  totalCalciumMmolL: number; // e.g. 2.3 mmol/L
  systemicIonizedCalciumMmolL: number; // e.g. 1.15 mmol/L
  fluidOverloadLiters: number; // e.g. +4.5 L
}

export interface CRRTPumpSettings {
  modality: CRRTModality;
  bloodFlowQbMlMin: number; // 100 - 300 mL/min
  dialysateFlowQdMlHr: number; // 0 - 3000 mL/hr
  replacementFlowQrepMlHr: number; // 0 - 3000 mL/hr
  dilutionMode: DilutionMode;
  netUltrafiltrationRateMlHr: number; // 0 - 500 mL/hr
  anticoagulation: AnticoagulationStrategy;
  citrateDoseMmolPerLBlood: number; // 2.0 - 4.5 mmol/L blood flow
  calciumInfusionRateMmolHr: number; // 1.0 - 5.0 mmol/hr
}

export interface CRRTHydraulicPressures {
  accessPressureMmHg: number; // -250 to -50 mmHg
  filterInletPressureMmHg: number; // +100 to +300 mmHg
  filterReturnPressureMmHg: number; // +50 to +180 mmHg
  effluentPressureMmHg: number; // -150 to +50 mmHg
  filterPressureDropMmHg: number; // Pin - Pout (normal 20-70 mmHg)
  transmembranePressureMmHg: number; // (Pin + Pout)/2 - Peff
  isHighTMPAlarm: boolean; // TMP > 250 mmHg
  isFilterClotted: boolean; // TMP > 300 mmHg or ΔP > 150 mmHg
  isAccessSuctionAlarm: boolean; // Pacc < -220 mmHg
  isReturnObstructionAlarm: boolean; // Pret > 220 mmHg
}

export interface KDIGODoseMetrics {
  totalEffluentFlowMlHr: number;
  prescribedDoseMlKgHr: number;
  deliveredDoseMlKgHr: number; // assuming 88% operational uptime
  filtrationFractionPct: number; // (QUF / Qplasma) * 100%
  isFiltrationFractionHigh: boolean; // > 20-25%
  doseCategory: 'SUBTHERAPEUTIC' | 'KDIGO_TARGET' | 'ACCEPTABLE' | 'EXCESSIVE';
  doseGuidance: string;
}

export interface RCAMetrics {
  circuitIonizedCalciumMmolL: number; // target 0.25 - 0.35 mmol/L
  systemicIonizedCalciumMmolL: number; // target 1.10 - 1.30 mmol/L
  totalCalciumToIonizedCalciumRatio: number; // Total Ca (mmol/L) / Systemic iCa (mmol/L)
  isCitrateAccumulationWarning: boolean; // ratio >= 2.5 ("Citrate Lock")
  clinicalStatus: string;
}

export interface SoluteClearanceRates {
  ureaClearanceMlMin: number;
  potassiumClearanceMlMin: number;
  creatinineClearanceMlMin: number;
  bicarbonateDeliveryMmolHr: number;
}

export interface CRRTKineticPoint {
  hour: number;
  bunMgDl: number;
  potassiumMeqL: number;
  bicarbonateMeqL: number;
  cumulativeNetFluidRemovedMl: number;
  transmembranePressureMmHg: number;
}

export interface CRRTClinicalPreset {
  id: string;
  title: string;
  patientProfile: string;
  diagnosis: string;
  modality: CRRTModality;
  dilutionMode: DilutionMode;
  anticoagulation: AnticoagulationStrategy;
  recommendedSettings: Partial<CRRTPumpSettings>;
  patientParams: CRRTPatientParameters;
  description: string;
  clinicalGoals: string;
  highYieldPearl: string;
}

/**
 * Calculates Circuit Pressures and Transmembrane Pressure (TMP)
 * TMP = (Pin + Pout) / 2 - Peffluent
 * ΔP_filter = Pin - Pout
 */
export function calculateCRRTPressures(
  settings: CRRTPumpSettings,
  filterClottingProgress: number = 0 // 0.0 (fresh) to 1.0 (completely clogged)
): CRRTHydraulicPressures {
  const { bloodFlowQbMlMin, netUltrafiltrationRateMlHr, replacementFlowQrepMlHr, dialysateFlowQdMlHr, modality } = settings;

  // Total ultrafiltration flow through hollow fiber membrane (mL/hr)
  const qUfMlHr = modality === 'SCUF' 
    ? netUltrafiltrationRateMlHr 
    : netUltrafiltrationRateMlHr + (modality === 'CVVHD' ? 0 : replacementFlowQrepMlHr);

  // Access pressure is negative (suction from venous catheter)
  const accessPressure = -60 - (bloodFlowQbMlMin * 0.45);

  // Filter pressure drop is proportional to blood flow, blood viscosity, and clotting
  const baselineDeltaP = 25 + (bloodFlowQbMlMin * 0.16);
  const filterPressureDrop = +(baselineDeltaP + (filterClottingProgress * 140)).toFixed(1);

  // Filter return pressure (venous return into patient)
  const filterReturnPressure = +(70 + (bloodFlowQbMlMin * 0.3) + (filterClottingProgress * 20)).toFixed(1);

  // Inlet pressure = return pressure + drop
  const filterInletPressure = +(filterReturnPressure + filterPressureDrop).toFixed(1);

  // Effluent pressure: suction needed to pull dialysate and ultrafiltrate through dialyzer
  // Total effluent flow:
  const totalEffluent = dialysateFlowQdMlHr + qUfMlHr;
  const effluentSuction = (totalEffluent / 60) * 1.8 + (filterClottingProgress * 120);
  const effluentPressure = +(30 - effluentSuction).toFixed(1);

  // Transmembrane Pressure (TMP)
  const pMeanBlood = (filterInletPressure + filterReturnPressure) / 2;
  const tmp = +(pMeanBlood - effluentPressure).toFixed(1);

  const isHighTMPAlarm = tmp > 250;
  const isFilterClotted = tmp > 300 || filterPressureDrop > 160 || filterClottingProgress >= 0.85;
  const isAccessSuctionAlarm = accessPressure < -220;
  const isReturnObstructionAlarm = filterReturnPressure > 220;

  return {
    accessPressureMmHg: +accessPressure.toFixed(1),
    filterInletPressureMmHg: filterInletPressure,
    filterReturnPressureMmHg: filterReturnPressure,
    effluentPressureMmHg: effluentPressure,
    filterPressureDropMmHg: filterPressureDrop,
    transmembranePressureMmHg: tmp,
    isHighTMPAlarm,
    isFilterClotted,
    isAccessSuctionAlarm,
    isReturnObstructionAlarm,
  };
}

/**
 * Calculates KDIGO Effluent Dosing Metrics & Filtration Fraction
 * Target: 20 - 25 mL/kg/hr delivered
 */
export function calculateKDIGODose(
  settings: CRRTPumpSettings,
  patientWeightKg: number,
  hematocritPct: number
): KDIGODoseMetrics {
  const { modality, dialysateFlowQdMlHr, replacementFlowQrepMlHr, netUltrafiltrationRateMlHr, bloodFlowQbMlMin } = settings;

  // Effluent flow = Dialysate + Replacement + Net UF
  let effectiveDialysate = 0;
  let effectiveReplacement = 0;

  if (modality === 'CVVHD' || modality === 'CVVHDF') {
    effectiveDialysate = dialysateFlowQdMlHr;
  }
  if (modality === 'CVVH' || modality === 'CVVHDF') {
    effectiveReplacement = replacementFlowQrepMlHr;
  }

  const totalEffluentFlow = effectiveDialysate + effectiveReplacement + netUltrafiltrationRateMlHr;
  const prescribedDose = +(totalEffluentFlow / Math.max(30, patientWeightKg)).toFixed(1);
  const deliveredDose = +(prescribedDose * 0.88).toFixed(1); // 88% average operational uptime

  // Filtration Fraction (FF) = (QUF / Qplasma) * 100%
  // Plasma flow in mL/hr:
  const qPlasmaMlHr = bloodFlowQbMlMin * (1 - (hematocritPct / 100)) * 60;
  const qUfMlHr = effectiveReplacement + netUltrafiltrationRateMlHr;
  const filtrationFraction = qPlasmaMlHr > 0 ? +((qUfMlHr / qPlasmaMlHr) * 100).toFixed(1) : 0;
  const isFiltrationFractionHigh = filtrationFraction > 22; // High clotting risk

  let doseCategory: KDIGODoseMetrics['doseCategory'] = 'KDIGO_TARGET';
  let doseGuidance = 'Optimal KDIGO guideline-directed effluent clearance target (20 - 25 mL/kg/h).';

  if (deliveredDose < 20) {
    doseCategory = 'SUBTHERAPEUTIC';
    doseGuidance = 'Subtherapeutic effluent clearance (<20 mL/kg/h). High risk of progressive uremia, hyperkalemia, and fluid retention.';
  } else if (deliveredDose <= 25) {
    doseCategory = 'KDIGO_TARGET';
    doseGuidance = 'Delivered effluent dose meets international KDIGO/ADQI consensus guidelines (20 - 25 mL/kg/h).';
  } else if (deliveredDose <= 35) {
    doseCategory = 'ACCEPTABLE';
    doseGuidance = 'Higher clearance tier (25 - 35 mL/kg/h). Monitor for hypophosphatemia, hypokalemia, and trace element wasting.';
  } else {
    doseCategory = 'EXCESSIVE';
    doseGuidance = 'Excessive effluent dose (>35 mL/kg/h). ATN & RENAL studies demonstrate no mortality benefit, with accelerated antibiotic and nutrient wasting.';
  }

  return {
    totalEffluentFlowMlHr: totalEffluentFlow,
    prescribedDoseMlKgHr: prescribedDose,
    deliveredDoseMlKgHr: deliveredDose,
    filtrationFractionPct: filtrationFraction,
    isFiltrationFractionHigh,
    doseCategory,
    doseGuidance,
  };
}

/**
 * Calculates Regional Citrate Anticoagulation (RCA) & Citrate Lock Monitoring
 * Target: Circuit iCa < 0.35 mmol/L, Systemic iCa 1.10 - 1.30 mmol/L, Total Ca / iCa < 2.5
 */
export function calculateRCAMetrics(
  settings: CRRTPumpSettings,
  baselineSystemicICa: number = 1.15,
  baselineTotalCa: number = 2.25,
  impairedHepaticCitrateMetabolism: boolean = false
): RCAMetrics {
  const { anticoagulation, citrateDoseMmolPerLBlood, calciumInfusionRateMmolHr, bloodFlowQbMlMin } = settings;

  if (anticoagulation !== 'REGIONAL_CITRATE') {
    return {
      circuitIonizedCalciumMmolL: baselineSystemicICa,
      systemicIonizedCalciumMmolL: baselineSystemicICa,
      totalCalciumToIonizedCalciumRatio: +(baselineTotalCa / Math.max(0.1, baselineSystemicICa)).toFixed(2),
      isCitrateAccumulationWarning: false,
      clinicalStatus: 'Standard systemic or no anticoagulation in use.',
    };
  }

  // Pre-filter Citrate chelation of ionized calcium in the filter circuit
  // Normal target: 3.0 mmol citrate / L blood binds iCa down to 0.25 - 0.35 mmol/L
  const circuitICa = +(Math.max(0.18, 1.15 - (citrateDoseMmolPerLBlood * 0.28))).toFixed(2);

  // Systemic calcium status depends on post-filter calcium chloride replacement and hepatic clearance
  let systemicICa = baselineSystemicICa;
  let totalCa = baselineTotalCa;

  if (impairedHepaticCitrateMetabolism) {
    // Citrate Lock: Citrate cannot be oxidized in Krebs cycle. It accumulates systemically,
    // chelating calcium and causing refractory hypocalcemia with widening anion gap acidosis.
    systemicICa = +(Math.max(0.65, baselineSystemicICa - 0.35 + (calciumInfusionRateMmolHr * 0.04))).toFixed(2);
    totalCa = +(baselineTotalCa + 0.85 + (calciumInfusionRateMmolHr * 0.2)).toFixed(2);
  } else {
    // Normal hepatic metabolism: Citrate is converted to bicarbonate, and systemic iCa is maintained
    systemicICa = +(baselineSystemicICa + ((calciumInfusionRateMmolHr - 2.2) * 0.06)).toFixed(2);
    totalCa = +(baselineTotalCa + ((calciumInfusionRateMmolHr - 2.2) * 0.08)).toFixed(2);
  }

  const totalToIonizedRatio = +(totalCa / Math.max(0.1, systemicICa)).toFixed(2);
  const isCitrateAccumulationWarning = totalToIonizedRatio >= 2.5;

  let clinicalStatus = 'RCA therapeutic: Circuit iCa inhibited; systemic calcium stable.';
  if (circuitICa > 0.40) {
    clinicalStatus = 'Under-anticoagulated: Circuit iCa > 0.40 mmol/L. High risk of premature filter clotting.';
  } else if (isCitrateAccumulationWarning) {
    clinicalStatus = 'CRITICAL ALERT: Citrate Lock / Toxicity (Total Ca / iCa >= 2.5). Impaired hepatic metabolism. Stop citrate; switch to heparin or saline flushes.';
  } else if (systemicICa < 1.0) {
    clinicalStatus = 'Systemic hypocalcemia: Increase systemic calcium chloride infusion.';
  }

  return {
    circuitIonizedCalciumMmolL: circuitICa,
    systemicIonizedCalciumMmolL: systemicICa,
    totalCalciumToIonizedCalciumRatio: totalToIonizedRatio,
    isCitrateAccumulationWarning,
    clinicalStatus,
  };
}

/**
 * Calculates Solute Clearance Rates (mL/min)
 */
export function calculateSoluteClearance(
  settings: CRRTPumpSettings,
  hematocritPct: number
): SoluteClearanceRates {
  const { modality, bloodFlowQbMlMin, dialysateFlowQdMlHr, replacementFlowQrepMlHr, dilutionMode, netUltrafiltrationRateMlHr } = settings;

  const qbMlMin = bloodFlowQbMlMin;
  const qpMlMin = qbMlMin * (1 - (hematocritPct / 100)); // Plasma flow
  const qdMlMin = dialysateFlowQdMlHr / 60;
  const qrepMlMin = replacementFlowQrepMlHr / 60;
  const qnetUfMlMin = netUltrafiltrationRateMlHr / 60;
  const qUfMlMin = qrepMlMin + qnetUfMlMin;

  let ureaClearanceMlMin = 0;

  if (modality === 'SCUF') {
    // Only ultrafiltrate convection
    ureaClearanceMlMin = qnetUfMlMin;
  } else if (modality === 'CVVHD') {
    // Pure diffusion (diffusive saturation of dialysate ~100% for urea)
    ureaClearanceMlMin = Math.min(qpMlMin, qdMlMin + qnetUfMlMin);
  } else if (modality === 'CVVH') {
    // Pure convection
    if (dilutionMode === 'PRE_DILUTION') {
      const dilutionFactor = qpMlMin / (qpMlMin + qrepMlMin);
      ureaClearanceMlMin = qUfMlMin * dilutionFactor;
    } else {
      // Post-dilution
      ureaClearanceMlMin = qUfMlMin;
    }
  } else if (modality === 'CVVHDF') {
    // Combined diffusion + convection
    const convClearance = dilutionMode === 'PRE_DILUTION'
      ? qUfMlMin * (qpMlMin / (qpMlMin + qrepMlMin))
      : qUfMlMin;
    ureaClearanceMlMin = Math.min(qpMlMin, qdMlMin + convClearance);
  }

  const potassiumClearance = +(ureaClearanceMlMin * 0.98).toFixed(1);
  const creatinineClearance = +(ureaClearanceMlMin * 0.92).toFixed(1);

  // Bicarbonate delivery from replacement/dialysate (standard 32 mmol/L buffer)
  const totalDialyticFluidLPerHr = (dialysateFlowQdMlHr + replacementFlowQrepMlHr) / 1000;
  const bicarbDelivery = +(totalDialyticFluidLPerHr * 32 * 0.45).toFixed(1);

  return {
    ureaClearanceMlMin: +ureaClearanceMlMin.toFixed(1),
    potassiumClearanceMlMin: potassiumClearance,
    creatinineClearanceMlMin: creatinineClearance,
    bicarbonateDeliveryMmolHr: bicarbDelivery,
  };
}

/**
 * Simulates 24-Hour Solute & Fluid Kinetics
 */
export function simulateCRRT24HourKinetics(
  settings: CRRTPumpSettings,
  patient: CRRTPatientParameters,
  filterClottingRate: number = 0.015 // clotting accumulation per hour
): CRRTKineticPoint[] {
  const points: CRRTKineticPoint[] = [];

  let currentBun = patient.baselineBUNMgDl;
  let currentK = patient.baselinePotassiumMeqL;
  let currentBicarb = patient.baselineBicarbonateMeqL;
  let cumulativeFluid = 0;

  const { ureaClearanceMlMin, potassiumClearanceMlMin, bicarbonateDeliveryMmolHr } = calculateSoluteClearance(settings, patient.hematocritPct);

  // Total body water volume (liters) ~60% of weight
  const tbwLiters = patient.weightKg * 0.6;

  for (let hour = 0; hour <= 24; hour += 2) {
    if (hour > 0) {
      // Urea generation in critically ill hypercatabolic patient: ~15-20 mg/dL/day
      const ureaGeneratedPerHour = 0.75;
      const ureaClearedPerHour = (ureaClearanceMlMin * 60 / 1000) * (currentBun / tbwLiters);
      currentBun = Math.max(10, currentBun - ureaClearedPerHour + ureaGeneratedPerHour);

      // Potassium clearance towards equilibrium with dialysate/replacement (assume 3.0 mEq/L fluid)
      const kTarget = 3.8;
      const kClearedRate = (potassiumClearanceMlMin / 60) * 0.08;
      currentK = currentK + (kTarget - currentK) * kClearedRate;

      // Bicarbonate normalization towards 24 mEq/L
      const bicarbTarget = 24.0;
      const bicarbCorrection = (bicarbonateDeliveryMmolHr / tbwLiters) * 0.25;
      currentBicarb = Math.min(26, currentBicarb + bicarbCorrection);

      // Cumulative fluid removed
      cumulativeFluid += settings.netUltrafiltrationRateMlHr * 2;
    }

    // Progressive TMP drift with clotting
    const clottingAtHour = Math.min(0.9, (hour * filterClottingRate));
    const pressures = calculateCRRTPressures(settings, clottingAtHour);

    points.push({
      hour,
      bunMgDl: +currentBun.toFixed(1),
      potassiumMeqL: +currentK.toFixed(2),
      bicarbonateMeqL: +currentBicarb.toFixed(1),
      cumulativeNetFluidRemovedMl: +cumulativeFluid.toFixed(0),
      transmembranePressureMmHg: pressures.transmembranePressureMmHg,
    });
  }

  return points;
}

/**
 * 6 Evidence-Based Critical Care AKI Presets
 */
export const CRRT_PRESETS: CRRTClinicalPreset[] = [
  {
    id: 'septic-aki-cvvhdf',
    title: 'Septic Shock with Anuric AKI & Volume Overload',
    patientProfile: 'Thomas K. (Age 62, Male, 82 kg)',
    diagnosis: 'Severe Fecal Peritonitis, Septic Shock on Norepinephrine, AKI Stage 3, Anuria, +5.2 L Fluid Overload',
    modality: 'CVVHDF',
    dilutionMode: 'POST_DILUTION',
    anticoagulation: 'REGIONAL_CITRATE',
    recommendedSettings: {
      modality: 'CVVHDF',
      bloodFlowQbMlMin: 200,
      dialysateFlowQdMlHr: 1000,
      replacementFlowQrepMlHr: 1000,
      dilutionMode: 'POST_DILUTION',
      netUltrafiltrationRateMlHr: 150,
      anticoagulation: 'REGIONAL_CITRATE',
      citrateDoseMmolPerLBlood: 3.0,
      calciumInfusionRateMmolHr: 2.2,
    },
    patientParams: {
      weightKg: 82,
      hematocritPct: 29,
      baselineBUNMgDl: 92,
      baselineCreatinineMgDl: 4.8,
      baselinePotassiumMeqL: 5.6,
      baselineBicarbonateMeqL: 15,
      totalCalciumMmolL: 2.2,
      systemicIonizedCalciumMmolL: 1.14,
      fluidOverloadLiters: 5.2,
    },
    description: 'Hemodynamically unstable patient with multi-organ failure. CVVHDF balances high diffusive clearance of small uremic toxins with convective middle-molecule clearance and controlled negative fluid balance.',
    clinicalGoals: 'Deliver KDIGO target dose (25 mL/kg/h), remove 3.6 L fluid over 24h, maintain hemodynamic MAP >= 65 mmHg without circuit clotting.',
    highYieldPearl: 'In septic shock with high vasopressor requirements, CRRT provides significantly superior hemodynamic stability compared to intermittent hemodialysis by avoiding rapid osmotic fluid shifts.',
  },
  {
    id: 'hyperkalemia-cvvhd',
    title: 'Refractory Hyperkalemia with ECG Changes',
    patientProfile: 'Maria S. (Age 54, Female, 68 kg)',
    diagnosis: 'Crush Syndrome, Severe Rhabdomyolysis, AKI Stage 3, Serum K+ 7.8 mEq/L with Peaked T-Waves and PR Prolongation',
    modality: 'CVVHD',
    dilutionMode: 'POST_DILUTION',
    anticoagulation: 'HEPARIN',
    recommendedSettings: {
      modality: 'CVVHD',
      bloodFlowQbMlMin: 250,
      dialysateFlowQdMlHr: 2200,
      replacementFlowQrepMlHr: 0,
      dilutionMode: 'POST_DILUTION',
      netUltrafiltrationRateMlHr: 50,
      anticoagulation: 'HEPARIN',
      citrateDoseMmolPerLBlood: 0,
      calciumInfusionRateMmolHr: 0,
    },
    patientParams: {
      weightKg: 68,
      hematocritPct: 34,
      baselineBUNMgDl: 85,
      baselineCreatinineMgDl: 6.2,
      baselinePotassiumMeqL: 7.8,
      baselineBicarbonateMeqL: 13,
      totalCalciumMmolL: 2.1,
      systemicIonizedCalciumMmolL: 1.10,
      fluidOverloadLiters: 1.8,
    },
    description: 'Life-threatening hyperkalemia with cardiotoxicity refractory to medical management (calcium gluconate, insulin/dextrose, salbutamol). High-dialysate flow CVVHD exploits steep concentration gradient for rapid diffusive potassium clearance.',
    clinicalGoals: 'Rapidly lower potassium below 5.5 mEq/L within 4 hours using zero-potassium or low-potassium dialysate, preventing lethal ventricular arrhythmias.',
    highYieldPearl: 'Diffusion (CVVHD) is vastly superior to convection (CVVH) for rapid removal of small, unbound electrolytes like potassium and urea.',
  },
  {
    id: 'lactic-acidosis-cvvh',
    title: 'Severe Lactic Acidosis & Toxic Shock',
    patientProfile: 'Ahmed B. (Age 48, Male, 75 kg)',
    diagnosis: 'Severe Metformin-Associated Lactic Acidosis (MALA), Arterial pH 7.08, Lactate 14.5 mmol/L, HCO3- 7 mEq/L',
    modality: 'CVVH',
    dilutionMode: 'PRE_DILUTION',
    anticoagulation: 'NONE',
    recommendedSettings: {
      modality: 'CVVH',
      bloodFlowQbMlMin: 220,
      dialysateFlowQdMlHr: 0,
      replacementFlowQrepMlHr: 2400,
      dilutionMode: 'PRE_DILUTION',
      netUltrafiltrationRateMlHr: 100,
      anticoagulation: 'NONE',
      citrateDoseMmolPerLBlood: 0,
      calciumInfusionRateMmolHr: 0,
    },
    patientParams: {
      weightKg: 75,
      hematocritPct: 38,
      baselineBUNMgDl: 78,
      baselineCreatinineMgDl: 5.1,
      baselinePotassiumMeqL: 6.1,
      baselineBicarbonateMeqL: 7.5,
      totalCalciumMmolL: 2.15,
      systemicIonizedCalciumMmolL: 1.18,
      fluidOverloadLiters: 2.2,
    },
    description: 'Profound metabolic acidosis and metformin toxicity. High-volume CVVH with pre-dilution provides massive bicarbonate buffer delivery while convective drag clears metformin (MW 165 Da, Vd 1-5 L/kg).',
    clinicalGoals: 'Normalize arterial pH > 7.30, deliver standard bicarbonate buffer, and clear systemic metformin with high replacement exchange.',
    highYieldPearl: 'Pre-dilution replacement fluid reduces hematocrit and protein concentration inside the filter fibers, preventing membrane fouling and prolonging filter lifespan during high-volume convective therapy.',
  },
  {
    id: 'filter-clotting-tmp',
    title: 'Acute Filter Thrombosis & TMP Alarm',
    patientProfile: 'Robert M. (Age 70, Male, 88 kg)',
    diagnosis: 'Septic Disseminated Intravascular Coagulation (DIC), COVID-19 Microvascular Thrombosis, TMP 315 mmHg Alarm',
    modality: 'CVVHDF',
    dilutionMode: 'POST_DILUTION',
    anticoagulation: 'NONE',
    recommendedSettings: {
      modality: 'CVVHDF',
      bloodFlowQbMlMin: 180,
      dialysateFlowQdMlHr: 1200,
      replacementFlowQrepMlHr: 1200,
      dilutionMode: 'POST_DILUTION',
      netUltrafiltrationRateMlHr: 100,
      anticoagulation: 'NONE',
      citrateDoseMmolPerLBlood: 0,
      calciumInfusionRateMmolHr: 0,
    },
    patientParams: {
      weightKg: 88,
      hematocritPct: 41,
      baselineBUNMgDl: 88,
      baselineCreatinineMgDl: 4.2,
      baselinePotassiumMeqL: 5.2,
      baselineBicarbonateMeqL: 18,
      totalCalciumMmolL: 2.2,
      systemicIonizedCalciumMmolL: 1.12,
      fluidOverloadLiters: 3.0,
    },
    description: 'CRRT circuit running without anticoagulation due to recent surgical bleed. Transmembrane pressure (TMP) has climbed past 310 mmHg with rising filter pressure drop, signaling irreversible hollow-fiber coagulation.',
    clinicalGoals: 'Identify clotting membrane failure, prevent circuit blood loss, rinse back blood safely, and transition to Regional Citrate Anticoagulation.',
    highYieldPearl: 'A simultaneous rise in TMP and ΔP_filter (>150 mmHg) confirms blood pathway thrombosis, whereas an isolated rise in TMP reflects secondary membrane protein cake build-up on the dialysate side.',
  },
  {
    id: 'citrate-toxicity-lock',
    title: 'Citrate Accumulation ("Citrate Lock") in Shock Liver',
    patientProfile: 'Elena V. (Age 57, Female, 65 kg)',
    diagnosis: 'Acute Liver Failure, Ischemic Hepatitis, CRRT with Regional Citrate Anticoagulation, Total Ca / iCa Ratio 2.85',
    modality: 'CVVHD',
    dilutionMode: 'POST_DILUTION',
    anticoagulation: 'REGIONAL_CITRATE',
    recommendedSettings: {
      modality: 'CVVHD',
      bloodFlowQbMlMin: 150,
      dialysateFlowQdMlHr: 1500,
      replacementFlowQrepMlHr: 0,
      dilutionMode: 'POST_DILUTION',
      netUltrafiltrationRateMlHr: 100,
      anticoagulation: 'REGIONAL_CITRATE',
      citrateDoseMmolPerLBlood: 3.5,
      calciumInfusionRateMmolHr: 3.0,
    },
    patientParams: {
      weightKg: 65,
      hematocritPct: 27,
      baselineBUNMgDl: 64,
      baselineCreatinineMgDl: 3.8,
      baselinePotassiumMeqL: 4.8,
      baselineBicarbonateMeqL: 16,
      totalCalciumMmolL: 3.10, // Soaring total calcium
      systemicIonizedCalciumMmolL: 0.82, // Refractory hypocalcemia
      fluidOverloadLiters: 2.5,
    },
    description: 'Patient with severe hepatic dysfunction receiving RCA. Failing liver cannot metabolize citrate in the citric acid cycle. Unmetabolized citrate binds calcium systemically: Total Calcium / iCa ratio exceeds 2.85 with worsening metabolic acidosis and widening anion gap.',
    clinicalGoals: 'Recognize Citrate Toxicity / Citrate Lock (ratio >= 2.5), immediately stop citrate infusion, administer IV calcium, and switch to heparin or saline flushes.',
    highYieldPearl: 'In Citrate Lock, systemic ionized calcium paradoxically falls despite soaring total serum calcium because the accumulated citrate avidly chelates calcium into inactive complexes.',
  },
  {
    id: 'post-cardiac-scuf',
    title: 'Post-Cardiopulmonary Bypass Fluid Overload',
    patientProfile: 'Walter H. (Age 74, Male, 80 kg)',
    diagnosis: 'Post-CABG x 4 & Aortic Valve Replacement, Low Cardiac Output Syndrome, Acute Pulmonary Edema, +6.0 L Fluid Overload',
    modality: 'SCUF',
    dilutionMode: 'POST_DILUTION',
    anticoagulation: 'HEPARIN',
    recommendedSettings: {
      modality: 'SCUF',
      bloodFlowQbMlMin: 150,
      dialysateFlowQdMlHr: 0,
      replacementFlowQrepMlHr: 0,
      dilutionMode: 'POST_DILUTION',
      netUltrafiltrationRateMlHr: 250,
      anticoagulation: 'HEPARIN',
      citrateDoseMmolPerLBlood: 0,
      calciumInfusionRateMmolHr: 0,
    },
    patientParams: {
      weightKg: 80,
      hematocritPct: 32,
      baselineBUNMgDl: 28,
      baselineCreatinineMgDl: 1.4,
      baselinePotassiumMeqL: 4.4,
      baselineBicarbonateMeqL: 22,
      totalCalciumMmolL: 2.25,
      systemicIonizedCalciumMmolL: 1.16,
      fluidOverloadLiters: 6.0,
    },
    description: 'Postoperative cardiac surgery patient with severe anasarca and ventilator dependence secondary to fluid overload, but preserved renal excretory function. Pure ultrafiltration (SCUF) removes fluid without wasting dialysate or electrolytes.',
    clinicalGoals: 'Safely remove 4-6 L of fluid over 24-48 hours (250 mL/h) to facilitate extubation while preserving cardiac filling pressures.',
    highYieldPearl: 'SCUF is exclusively indicated for volume overload without severe uremia or acidosis; because no dialysate or replacement fluid is used, solute clearance is restricted purely to ultrafiltrate volume.',
  },
];
