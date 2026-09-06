/**
 * PeritonealDialysisEngine.ts
 *
 * Biophysical & clinical engine for Peritoneal Dialysis (PD), Peritoneal Equilibration
 * Testing (PET), Three-Pore Membrane Transport, Kt/V Adequacy, Ultrafiltration Failure (UFF),
 * and 2022 ISPD Peritonitis Management.
 *
 * Implements:
 * 1. Watson Anthropometric Total Body Water (TBW, V in Liters)
 * 2. Standard Twardowski 4-hour Peritoneal Equilibration Test (PET)
 *    - D/P Creatinine (corrected for glucose interference) & D/D0 Glucose ratio
 *    - Four transport categories: High, High-Average, Low-Average, Low
 * 3. Three-Pore Membrane Transport & Ultrafiltration Failure (UFF)
 *    - Sodium sieving (\Delta Na) via Aquaporin-1 ultra-small pores
 *    - Classification: Type I (hyperpermeability), Type II (AQP-1 loss), Type III (sclerosis/EPS), Type IV (lymphatic)
 * 4. PD Adequacy: Weekly Peritoneal + Residual Renal Kt/V & Creatinine Clearance
 * 5. Prescription Modeling: CAPD vs APD (CCPD/NIPD) + Dextrose (1.5%, 2.25%, 4.25%) vs Icodextrin 7.5%
 * 6. 2022 ISPD Peritonitis Diagnostic Criteria & Empiric IP Antibiotic Protocols
 *
 * Location: frontend/.gemini/skills/PeritonealDialysisEngine.ts
 */

export type PetTransportCategory =
  | 'HIGH_TRANSPORTER'
  | 'HIGH_AVERAGE_TRANSPORTER'
  | 'LOW_AVERAGE_TRANSPORTER'
  | 'LOW_TRANSPORTER';

export type UffClassification =
  | 'NO_UFF'
  | 'TYPE_I_HYPERPERMEABILITY'
  | 'TYPE_II_AQUAPORIN_DEFECT'
  | 'TYPE_III_MEMBRANE_SCLEROSIS'
  | 'TYPE_IV_HIGH_LYMPHATIC_ABSORPTION'
  | 'MECHANICAL_OR_CATHETER_PROBLEM';

export type PdModality = 'CAPD' | 'APD_CCPD' | 'APD_NIPD';

export type GlucoseAssayMethod = 'JAFFE_CORRECTED' | 'ENZYMATIC_DIRECT';

export interface PetSamplingData {
  infusionVolumeMl: number; // usually 2000 mL
  dextroseConcentrationPct: number; // 1.5, 2.25, 3.86, or 4.25%
  serumCreatinineMgDl: number;
  serumGlucoseMgDl: number;
  serumBunMgDl: number;
  serumSodiumMmolL: number;
  // Dialysate values
  dialysate0hGlucoseMgDl: number;
  dialysate2hGlucoseMgDl: number;
  dialysate2hCreatinineMgDl: number;
  dialysate4hGlucoseMgDl: number;
  dialysate4hCreatinineMgDl: number;
  dialysate60minSodiumMmolL: number; // for sodium sieving test
  effluentDrainVolumeMl: number; // 4-hour drain volume
  assayMethod: GlucoseAssayMethod;
}

export interface PatientDemographics {
  ageYears: number;
  sex: 'MALE' | 'FEMALE';
  heightCm: number;
  weightKg: number;
  isDiabetic: boolean;
  isAnuric: boolean;
}

export interface PdPrescription {
  modality: PdModality;
  dayExchanges: {
    volumeMl: number;
    dwellHours: number;
    solutionType: 'DEXTROSE_1_5' | 'DEXTROSE_2_25' | 'DEXTROSE_4_25' | 'ICODEXTRIN_7_5';
  }[];
  nightCycles?: {
    numberOfCycles: number;
    fillVolumeMl: number;
    cycleDurationHours: number;
    solutionType: 'DEXTROSE_1_5' | 'DEXTROSE_2_25' | 'DEXTROSE_4_25';
  };
  totalDialysateVolumeLPerDay: number;
  totalEffluentDrainLPerDay: number;
  dialysateUreaNitrogenMgDl: number;
}

export interface ResidualRenalFunction {
  dailyUrineVolumeL: number;
  urineUreaNitrogenMgDl: number;
  urineCreatinineMgDl: number;
}

export interface PeritonitisEvaluation {
  hasAbdominalPain: boolean;
  isEffluentCloudy: boolean;
  effluentWbcPerMicroL: number;
  neutrophilPercent: number; // PMN %
  dwellDurationHours: number;
  cultureGramStain?: 'GRAM_POSITIVE_COCCI' | 'GRAM_NEGATIVE_BACILLI' | 'POLYMICROBIAL' | 'FUNGAL' | 'NO_GROWTH';
}

export interface PeritonealDialysisEvaluation {
  // Anthropometry
  bsaM2: number;
  watsonTbwLiters: number;

  // PET Test Results
  correctedDialysateCr4h: number;
  dpCreatinine4h: number;
  dpCreatinine2h: number;
  dd0Glucose4h: number;
  dd0Glucose2h: number;
  petTransportCategory: PetTransportCategory;

  // Sodium Sieving & Net UF
  sodiumDipMmolL: number; // Na_serum - Na_dialysate_60min (or Na_0 - Na_60)
  hasIntactAquaporins: boolean; // dip >= 5 mmol/L
  netUltrafiltration4hMl: number;
  hasUltrafiltrationFailure: boolean; // 4h drain < 400 mL net with 3.86/4.25% or < 100 mL with 2.25%
  uffClassification: UffClassification;

  // Solute Adequacy & Kt/V
  peritonealUreaClearanceLPerDay: number;
  weeklyPeritonealKtV: number;
  renalUreaClearanceLPerDay: number;
  weeklyRenalKtV: number;
  totalWeeklyKtV: number;
  residualGfrMlMin: number;
  weeklyCreatinineClearanceLPerWeekPer173: number;
  adequacyStatus: 'OPTIMAL' | 'MARGINAL' | 'INADEQUATE';

  // Peritonitis Analysis
  peritonitisCriteriaMet: boolean;
  peritonitisCriteriaCount: number;
  peritonitisSeverity: 'NONE' | 'CONFIRMED_PERITONITIS' | 'SUSPECTED_INDETERMINATE';
  recommendedAntibiotics: string[];
  catheterRemovalIndicated: boolean;
  catheterRemovalReason?: string;

  // Modality Recommendation
  recommendedModality: PdModality;
  modalityRationale: string;
  clinicalAlerts: string[];
}

/**
 * Watson Formula for Total Body Water (TBW, V) in Liters.
 */
export function calculateWatsonTbw(
  ageYears: number,
  sex: 'MALE' | 'FEMALE',
  heightCm: number,
  weightKg: number
): number {
  if (sex === 'MALE') {
    return 2.447 - 0.09156 * ageYears + 0.1074 * heightCm + 0.3362 * weightKg;
  } else {
    return -2.097 + 0.1069 * heightCm + 0.2466 * weightKg;
  }
}

/**
 * Mosteller Body Surface Area (BSA) in m².
 */
export function calculateBsa(heightCm: number, weightKg: number): number {
  return Math.sqrt((heightCm * weightKg) / 3600);
}

/**
 * Jaffe glucose correction for dialysate creatinine:
 * High dextrose reacts with picric acid yielding falsely high creatinine.
 * Correction factor: 0.0005 mg/dL creatinine per mg/dL glucose.
 */
export function correctDialysateCreatinine(
  measuredCr: number,
  measuredGlucose: number,
  method: GlucoseAssayMethod
): number {
  if (method === 'ENZYMATIC_DIRECT') {
    return measuredCr;
  }
  const correction = 0.0005 * measuredGlucose;
  return Math.max(0.01, measuredCr - correction);
}

/**
 * Classifies PET transport category using Twardowski standards.
 */
export function classifyPetTransport(dpCr4h: number, dd0Glu4h: number): PetTransportCategory {
  // Standard Twardowski cutoff values for 4-hour D/P Creatinine:
  // High: >= 0.82
  // High-Average: 0.65 - 0.81
  // Low-Average: 0.50 - 0.64
  // Low: < 0.50
  if (dpCr4h >= 0.82) {
    return 'HIGH_TRANSPORTER';
  } else if (dpCr4h >= 0.65) {
    return 'HIGH_AVERAGE_TRANSPORTER';
  } else if (dpCr4h >= 0.50) {
    return 'LOW_AVERAGE_TRANSPORTER';
  } else {
    return 'LOW_TRANSPORTER';
  }
}

/**
 * Evaluates Ultrafiltration Failure (UFF) based on the Three-Pore Model.
 */
export function evaluateUltrafiltrationFailure(
  netUf4hMl: number,
  dextrosePct: number,
  dpCr4h: number,
  sodiumDipMmolL: number
): { hasUff: boolean; classification: UffClassification } {
  // ISPD standard criteria for UFF:
  // Net UF < 400 mL after 4-hour dwell with 3.86% (or 4.25%) dextrose.
  // With 2.25% dextrose, net UF < 100 mL is abnormal.
  const isHypertonic = dextrosePct >= 3.86;
  const cutoff = isHypertonic ? 400 : 100;
  const hasUff = netUf4hMl < cutoff;

  if (!hasUff) {
    return { hasUff: false, classification: 'NO_UFF' };
  }

  // Type I: Hyperpermeability (High solute transport D/P Cr >= 0.82, intact AQP1 with normal sodium dip)
  // Rapid absorption of glucose dissipates osmotic gradient prematurely.
  if (dpCr4h >= 0.82 && sodiumDipMmolL >= 5) {
    return { hasUff: true, classification: 'TYPE_I_HYPERPERMEABILITY' };
  }

  // Type II: Aquaporin-1 Defect (Impaired transcellular water flow, sodium sieving dip < 5 mmol/L)
  if (sodiumDipMmolL < 5 && dpCr4h >= 0.50) {
    return { hasUff: true, classification: 'TYPE_II_AQUAPORIN_DEFECT' };
  }

  // Type III: Membrane Sclerosis / Fibrosis / EPS Precursor (Low transport D/P Cr < 0.50 with loss of UF)
  if (dpCr4h < 0.50) {
    return { hasUff: true, classification: 'TYPE_III_MEMBRANE_SCLEROSIS' };
  }

  // If transport is high-average and sodium dip is intact, could be high lymphatic absorption (>2 mL/min)
  if (sodiumDipMmolL >= 5) {
    return { hasUff: true, classification: 'TYPE_IV_HIGH_LYMPHATIC_ABSORPTION' };
  }

  return { hasUff: true, classification: 'MECHANICAL_OR_CATHETER_PROBLEM' };
}

/**
 * Full biophysical evaluation of Peritoneal Dialysis mechanics, adequacy, and peritonitis.
 */
export function evaluatePeritonealDialysis(
  patient: PatientDemographics,
  pet: PetSamplingData,
  rx: PdPrescription,
  renal?: ResidualRenalFunction,
  peritonitis?: PeritonitisEvaluation
): PeritonealDialysisEvaluation {
  const alerts: string[] = [];

  // 1. Anthropometry
  const bsaM2 = calculateBsa(patient.heightCm, patient.weightKg);
  const watsonTbwLiters = calculateWatsonTbw(
    patient.ageYears,
    patient.sex,
    patient.heightCm,
    patient.weightKg
  );

  // 2. PET Calculations
  const correctedDialysateCr4h = correctDialysateCreatinine(
    pet.dialysate4hCreatinineMgDl,
    pet.dialysate4hGlucoseMgDl,
    pet.assayMethod
  );
  const correctedDialysateCr2h = correctDialysateCreatinine(
    pet.dialysate2hCreatinineMgDl,
    pet.dialysate2hGlucoseMgDl,
    pet.assayMethod
  );

  const dpCreatinine4h = correctedDialysateCr4h / Math.max(0.1, pet.serumCreatinineMgDl);
  const dpCreatinine2h = correctedDialysateCr2h / Math.max(0.1, pet.serumCreatinineMgDl);

  const dd0Glucose4h =
    pet.dialysate4hGlucoseMgDl / Math.max(1, pet.dialysate0hGlucoseMgDl);
  const dd0Glucose2h =
    pet.dialysate2hGlucoseMgDl / Math.max(1, pet.dialysate0hGlucoseMgDl);

  const petTransportCategory = classifyPetTransport(dpCreatinine4h, dd0Glucose4h);

  // 3. Three-Pore Sodium Sieving & Net Ultrafiltration
  // Sodium sieving dip: difference between serum Na and 60-min dialysate Na
  const sodiumDipMmolL = Math.max(0, pet.serumSodiumMmolL - pet.dialysate60minSodiumMmolL);
  const hasIntactAquaporins = sodiumDipMmolL >= 5;

  const netUltrafiltration4hMl = pet.effluentDrainVolumeMl - pet.infusionVolumeMl;

  const { hasUff, classification: uffClassification } = evaluateUltrafiltrationFailure(
    netUltrafiltration4hMl,
    pet.dextroseConcentrationPct,
    dpCreatinine4h,
    sodiumDipMmolL
  );

  if (hasUff) {
    alerts.push(
      `Ultrafiltration Failure Detected (${uffClassification.replace(/_/g, ' ')}): Net 4h UF is ${netUltrafiltration4hMl} mL.`
    );
  }

  // 4. Adequacy & Kt/V
  // Daily Peritoneal Clearance K_PD = (DUN / BUN) * V_drain (L/day)
  const dunBunRatio =
    pet.serumBunMgDl > 0 ? rx.dialysateUreaNitrogenMgDl / pet.serumBunMgDl : 0.8;
  const peritonealUreaClearanceLPerDay = dunBunRatio * rx.totalEffluentDrainLPerDay;
  const weeklyPeritonealKtV = (peritonealUreaClearanceLPerDay * 7) / Math.max(10, watsonTbwLiters);

  let renalUreaClearanceLPerDay = 0;
  let weeklyRenalKtV = 0;
  let residualGfrMlMin = 0;

  if (!patient.isAnuric && renal && renal.dailyUrineVolumeL > 0) {
    const uunBunRatio =
      pet.serumBunMgDl > 0 ? renal.urineUreaNitrogenMgDl / pet.serumBunMgDl : 0;
    renalUreaClearanceLPerDay = uunBunRatio * renal.dailyUrineVolumeL;
    weeklyRenalKtV = (renalUreaClearanceLPerDay * 7) / Math.max(10, watsonTbwLiters);

    // Residual GFR = (Urea Clearance + Cr Clearance) / 2
    // Clearance (mL/min) = (U * V) / (P * 1440)
    const urineVolMl = renal.dailyUrineVolumeL * 1000;
    const ureaClMlMin =
      (renal.urineUreaNitrogenMgDl * urineVolMl) /
      Math.max(1, pet.serumBunMgDl * 1440);
    const crClMlMin =
      (renal.urineCreatinineMgDl * urineVolMl) /
      Math.max(0.1, pet.serumCreatinineMgDl * 1440);
    residualGfrMlMin = (ureaClMlMin + crClMlMin) / 2;
  }

  const totalWeeklyKtV = weeklyPeritonealKtV + weeklyRenalKtV;

  // Weekly Creatinine Clearance in L/week/1.73m²
  const weeklyPdCrClearanceL = dpCreatinine4h * rx.totalEffluentDrainLPerDay * 7;
  const weeklyRenalCrClearanceL =
    !patient.isAnuric && renal && renal.dailyUrineVolumeL > 0
      ? (renal.urineCreatinineMgDl / Math.max(0.1, pet.serumCreatinineMgDl)) *
        renal.dailyUrineVolumeL *
        7
      : 0;
  const weeklyCreatinineClearanceLPerWeekPer173 =
    ((weeklyPdCrClearanceL + weeklyRenalCrClearanceL) * 1.73) / Math.max(1.0, bsaM2);

  let adequacyStatus: 'OPTIMAL' | 'MARGINAL' | 'INADEQUATE' = 'OPTIMAL';
  if (totalWeeklyKtV >= 1.7) {
    adequacyStatus = 'OPTIMAL';
  } else if (totalWeeklyKtV >= 1.5) {
    adequacyStatus = 'MARGINAL';
    alerts.push('Marginal Total Weekly Kt/V (1.50 - 1.69). Close clinical monitoring advised.');
  } else {
    adequacyStatus = 'INADEQUATE';
    alerts.push('Inadequate Total Weekly Kt/V (< 1.70). Increase exchange volume or cycles.');
  }

  // 5. Peritonitis Evaluation (ISPD 2022 Criteria: >=2 of 3)
  // 1. Clinical symptoms (abdominal pain / cloudy bag)
  // 2. Dialysate WBC > 100/µL with >= 50% PMN (after >= 2h dwell)
  // 3. Positive Gram stain / culture
  let peritonitisCriteriaCount = 0;
  let peritonitisCriteriaMet = false;
  let peritonitisSeverity: 'NONE' | 'CONFIRMED_PERITONITIS' | 'SUSPECTED_INDETERMINATE' = 'NONE';
  const recommendedAntibiotics: string[] = [];
  let catheterRemovalIndicated = false;
  let catheterRemovalReason: string | undefined = undefined;

  if (peritonitis) {
    if (peritonitis.hasAbdominalPain || peritonitis.isEffluentCloudy) {
      peritonitisCriteriaCount++;
    }

    if (
      peritonitis.effluentWbcPerMicroL > 100 &&
      peritonitis.neutrophilPercent >= 50 &&
      peritonitis.dwellDurationHours >= 2
    ) {
      peritonitisCriteriaCount++;
    }

    if (peritonitis.cultureGramStain && peritonitis.cultureGramStain !== 'NO_GROWTH') {
      peritonitisCriteriaCount++;
    }

    if (peritonitisCriteriaCount >= 2) {
      peritonitisCriteriaMet = true;
      peritonitisSeverity = 'CONFIRMED_PERITONITIS';
      alerts.push('ISPD Peritonitis Criteria Met (>=2 criteria positive). Initiate immediate IP antibiotics.');

      // ISPD 2022 Empiric Intraperitoneal Antibiotic Regimen
      recommendedAntibiotics.push('IP Cefazolin 15-20 mg/kg once daily in long dwell (Gram-positive coverage)');
      recommendedAntibiotics.push('IP Ceftazidime 1000-1500 mg once daily OR IP Tobramycin 0.6 mg/kg (Gram-negative coverage)');
      recommendedAntibiotics.push('IP Heparin 500 units/L dialysate to prevent catheter lumen fibrin occlusion');

      if (peritonitis.cultureGramStain === 'FUNGAL') {
        catheterRemovalIndicated = true;
        catheterRemovalReason = 'Fungal Peritonitis (ISPD absolute indication for immediate catheter removal to prevent peritoneal sclerosing encapsulation)';
        alerts.push('EMERGENCY: Fungal peritonitis diagnosed. Remove PD catheter immediately and convert to hemodialysis.');
      } else if (peritonitis.cultureGramStain === 'POLYMICROBIAL') {
        alerts.push('Polymicrobial / enteric flora detected: Evaluate for intra-abdominal catastrophe (visceral perforation/diverticulitis). Add IP Metronidazole.');
      }
    } else if (peritonitisCriteriaCount === 1) {
      peritonitisSeverity = 'SUSPECTED_INDETERMINATE';
      alerts.push('Suspected peritonitis: 1 criterion present. Repeat effluent cell count and differential in 4-6 hours.');
    }
  }

  // 6. Modality & Prescription Rationale
  let recommendedModality: PdModality = 'CAPD';
  let modalityRationale = '';

  if (petTransportCategory === 'HIGH_TRANSPORTER') {
    recommendedModality = 'APD_CCPD';
    modalityRationale =
      'High transporter: Solutes equilibrate rapidly, and dextrose is absorbed quickly leading to early loss of ultrafiltration. Short cycle dwell times via APD (Automated Peritoneal Dialysis) are preferred. Consider daytime Icodextrin 7.5% to maintain ultrafiltration during long daytime dwells without glucose absorption.';
  } else if (petTransportCategory === 'HIGH_AVERAGE_TRANSPORTER') {
    recommendedModality = rx.modality === 'APD_CCPD' ? 'APD_CCPD' : 'CAPD';
    modalityRationale =
      'High-Average transporter: Versatile membrane with balanced solute clearance and ultrafiltration. Well suited for both standard 4-exchange CAPD and APD with long day dwell.';
  } else if (petTransportCategory === 'LOW_AVERAGE_TRANSPORTER') {
    recommendedModality = 'CAPD';
    modalityRationale =
      'Low-Average transporter: Solute clearance is dependent on prolonged contact time. Longer dwell times (CAPD with 4-5 hour day dwells and 8-10 hour night dwell) optimize weekly Kt/V and creatinine clearance.';
  } else {
    // LOW_TRANSPORTER
    recommendedModality = 'CAPD';
    modalityRationale =
      'Low (Slow) transporter: Excellent ultrafiltration capacity but slow solute equilibration. Rapid-cycle APD will cause severe solute under-dialysis. Requires long dwell volumes (CAPD 2.5L dwells or APD with large day fill volume).';
  }

  return {
    bsaM2,
    watsonTbwLiters,
    correctedDialysateCr4h,
    dpCreatinine4h,
    dpCreatinine2h,
    dd0Glucose4h,
    dd0Glucose2h,
    petTransportCategory,
    sodiumDipMmolL,
    hasIntactAquaporins,
    netUltrafiltration4hMl,
    hasUltrafiltrationFailure: hasUff,
    uffClassification,
    peritonealUreaClearanceLPerDay,
    weeklyPeritonealKtV,
    renalUreaClearanceLPerDay,
    weeklyRenalKtV,
    totalWeeklyKtV,
    residualGfrMlMin,
    weeklyCreatinineClearanceLPerWeekPer173,
    adequacyStatus,
    peritonitisCriteriaMet,
    peritonitisCriteriaCount,
    peritonitisSeverity,
    recommendedAntibiotics,
    catheterRemovalIndicated,
    catheterRemovalReason,
    recommendedModality,
    modalityRationale,
    clinicalAlerts: alerts,
  };
}

// -------------------------------------------------------------------------
// CLINICAL PRESETS (8 Comprehensive Scenarios)
// -------------------------------------------------------------------------

export interface PdPreset {
  id: string;
  name: string;
  category: string;
  description: string;
  patient: PatientDemographics;
  pet: PetSamplingData;
  rx: PdPrescription;
  renal?: ResidualRenalFunction;
  peritonitis?: PeritonitisEvaluation;
}

export const PD_CLINICAL_PRESETS: PdPreset[] = [
  {
    id: 'NORMAL_HIGH_AVERAGE_CAPD',
    name: 'Normal High-Average Transporter (Standard CAPD)',
    category: 'Standard Adequacy',
    description:
      '54-year-old male with diabetic nephropathy on standard 4x2L CAPD. Normal high-average membrane transport, robust sodium sieving, clear effluent, and optimal total weekly Kt/V of 1.88.',
    patient: {
      ageYears: 54,
      sex: 'MALE',
      heightCm: 172,
      weightKg: 74,
      isDiabetic: true,
      isAnuric: false,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 2.25,
      serumCreatinineMgDl: 8.5,
      serumGlucoseMgDl: 130,
      serumBunMgDl: 52,
      serumSodiumMmolL: 138,
      dialysate0hGlucoseMgDl: 2150,
      dialysate2hGlucoseMgDl: 1100,
      dialysate2hCreatinineMgDl: 4.4,
      dialysate4hGlucoseMgDl: 750,
      dialysate4hCreatinineMgDl: 6.1,
      dialysate60minSodiumMmolL: 131, // Dip = 7 mmol/L (intact aquaporin-1)
      effluentDrainVolumeMl: 2320, // Net UF = +320 mL
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_2_25' },
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 9, solutionType: 'DEXTROSE_2_25' },
      ],
      totalDialysateVolumeLPerDay: 8.0,
      totalEffluentDrainLPerDay: 9.1,
      dialysateUreaNitrogenMgDl: 42,
    },
    renal: {
      dailyUrineVolumeL: 0.6,
      urineUreaNitrogenMgDl: 280,
      urineCreatinineMgDl: 55,
    },
    peritonitis: {
      hasAbdominalPain: false,
      isEffluentCloudy: false,
      effluentWbcPerMicroL: 12,
      neutrophilPercent: 15,
      dwellDurationHours: 4,
      cultureGramStain: 'NO_GROWTH',
    },
  },
  {
    id: 'TYPE_1_UFF_HIGH_TRANSPORTER',
    name: 'Type I Ultrafiltration Failure (Hyperpermeability)',
    category: 'Membrane Dysfunction',
    description:
      '62-year-old female with 5 years on PD. D/P Cr is 0.89 (High Transporter). Glucose rapidly dissipates causing osmotic gradient collapse and 4-hour net UF of only 80 mL. Clear candidate for APD and Daytime Icodextrin.',
    patient: {
      ageYears: 62,
      sex: 'FEMALE',
      heightCm: 160,
      weightKg: 68,
      isDiabetic: false,
      isAnuric: true,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 4.25,
      serumCreatinineMgDl: 9.8,
      serumGlucoseMgDl: 105,
      serumBunMgDl: 64,
      serumSodiumMmolL: 139,
      dialysate0hGlucoseMgDl: 3950,
      dialysate2hGlucoseMgDl: 1400,
      dialysate2hCreatinineMgDl: 7.2,
      dialysate4hGlucoseMgDl: 710,
      dialysate4hCreatinineMgDl: 8.8,
      dialysate60minSodiumMmolL: 132, // Dip = 7 mmol/L (intact AQP1)
      effluentDrainVolumeMl: 2080, // Net UF = only 80 mL on 4.25%! (Normal >= 400 mL)
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 4, solutionType: 'DEXTROSE_2_25' },
        { volumeMl: 2000, dwellHours: 4, solutionType: 'DEXTROSE_4_25' },
        { volumeMl: 2000, dwellHours: 4, solutionType: 'DEXTROSE_2_25' },
        { volumeMl: 2000, dwellHours: 8, solutionType: 'DEXTROSE_4_25' },
      ],
      totalDialysateVolumeLPerDay: 8.0,
      totalEffluentDrainLPerDay: 8.3,
      dialysateUreaNitrogenMgDl: 58,
    },
    peritonitis: {
      hasAbdominalPain: false,
      isEffluentCloudy: false,
      effluentWbcPerMicroL: 20,
      neutrophilPercent: 18,
      dwellDurationHours: 4,
    },
  },
  {
    id: 'AQUAPORIN_1_DEFECT_TYPE_2_UFF',
    name: 'Aquaporin-1 Defect (Type II Ultrafiltration Failure)',
    category: 'Membrane Dysfunction',
    description:
      '58-year-old male with progressive refractory fluid overload despite 4.25% dextrose bags. Sodium sieving test shows a dip of only 1.5 mmol/L (abnormal < 5), confirming selective water-channel loss with preserved small-pore solute transport.',
    patient: {
      ageYears: 58,
      sex: 'MALE',
      heightCm: 178,
      weightKg: 86,
      isDiabetic: false,
      isAnuric: true,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 4.25,
      serumCreatinineMgDl: 10.2,
      serumGlucoseMgDl: 112,
      serumBunMgDl: 70,
      serumSodiumMmolL: 140,
      dialysate0hGlucoseMgDl: 4000,
      dialysate2hGlucoseMgDl: 2300,
      dialysate2hCreatinineMgDl: 4.5,
      dialysate4hGlucoseMgDl: 1450,
      dialysate4hCreatinineMgDl: 6.8,
      dialysate60minSodiumMmolL: 138.5, // Dip = 1.5 mmol/L! Loss of AQP-1
      effluentDrainVolumeMl: 2180, // Net UF = 180 mL on 4.25% (severe UFF)
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'APD_CCPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 14, solutionType: 'ICODEXTRIN_7_5' },
      ],
      nightCycles: {
        numberOfCycles: 5,
        fillVolumeMl: 2000,
        cycleDurationHours: 9,
        solutionType: 'DEXTROSE_2_25',
      },
      totalDialysateVolumeLPerDay: 12.0,
      totalEffluentDrainLPerDay: 12.3,
      dialysateUreaNitrogenMgDl: 52,
    },
  },
  {
    id: 'ENCAPSULATING_PERITONEAL_SCLEROSIS_PRECURSOR',
    name: 'Peritoneal Sclerosis Precursor (Type III UFF)',
    category: 'Critical Pathology',
    description:
      '68-year-old female with 9 years of PD vintage presenting with progressive loss of solute clearance (D/P Cr 0.41) and ultrafiltration failure. Peritoneal CT shows focal thickening. Urgent cessation of PD and transition to hemodialysis advised.',
    patient: {
      ageYears: 68,
      sex: 'FEMALE',
      heightCm: 155,
      weightKg: 52,
      isDiabetic: false,
      isAnuric: true,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 4.25,
      serumCreatinineMgDl: 11.5,
      serumGlucoseMgDl: 98,
      serumBunMgDl: 78,
      serumSodiumMmolL: 136,
      dialysate0hGlucoseMgDl: 3980,
      dialysate2hGlucoseMgDl: 2900,
      dialysate2hCreatinineMgDl: 2.8,
      dialysate4hGlucoseMgDl: 2350,
      dialysate4hCreatinineMgDl: 4.6, // Low D/P Cr = 0.40
      dialysate60minSodiumMmolL: 134, // Dip = 2 mmol/L
      effluentDrainVolumeMl: 2110, // Net UF = 110 mL on 4.25%
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 1500, dwellHours: 6, solutionType: 'DEXTROSE_2_25' },
        { volumeMl: 1500, dwellHours: 6, solutionType: 'DEXTROSE_4_25' },
        { volumeMl: 1500, dwellHours: 12, solutionType: 'DEXTROSE_4_25' },
      ],
      totalDialysateVolumeLPerDay: 4.5,
      totalEffluentDrainLPerDay: 4.7,
      dialysateUreaNitrogenMgDl: 38,
    },
  },
  {
    id: 'ISPD_ACUTE_PERITONITIS',
    name: 'ISPD Acute Peritonitis (Effluent WBC 2,450/µL, 92% PMN)',
    category: 'Infectious Emergency',
    description:
      '47-year-old male with severe diffuse abdominal rebound tenderness and cloudy dialysate effluent. Effluent microscopy shows 2,450 WBC/µL with 92% neutrophils. Empiric IP Cefazolin + Ceftazidime + Heparin instituted immediately.',
    patient: {
      ageYears: 47,
      sex: 'MALE',
      heightCm: 175,
      weightKg: 80,
      isDiabetic: true,
      isAnuric: false,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 2.25,
      serumCreatinineMgDl: 9.0,
      serumGlucoseMgDl: 165,
      serumBunMgDl: 60,
      serumSodiumMmolL: 137,
      dialysate0hGlucoseMgDl: 2180,
      dialysate2hGlucoseMgDl: 1050,
      dialysate2hCreatinineMgDl: 4.9,
      dialysate4hGlucoseMgDl: 680,
      dialysate4hCreatinineMgDl: 6.9, // D/P Cr elevated acutely during inflammation
      dialysate60minSodiumMmolL: 130,
      effluentDrainVolumeMl: 2280,
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_2_25' },
        { volumeMl: 2000, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 9, solutionType: 'DEXTROSE_2_25' },
      ],
      totalDialysateVolumeLPerDay: 8.0,
      totalEffluentDrainLPerDay: 8.9,
      dialysateUreaNitrogenMgDl: 46,
    },
    peritonitis: {
      hasAbdominalPain: true,
      isEffluentCloudy: true,
      effluentWbcPerMicroL: 2450,
      neutrophilPercent: 92,
      dwellDurationHours: 4,
      cultureGramStain: 'GRAM_POSITIVE_COCCI',
    },
  },
  {
    id: 'ANURIC_INADEQUATE_KT_V',
    name: 'Anuric Inadequate Clearance (Total Weekly Kt/V 1.38)',
    category: 'Adequacy Failure',
    description:
      '50-year-old male with recent cessation of residual urine output. Peritoneal Kt/V alone on 4x2L CAPD yields only 1.38 (KDOQI target >= 1.70). Needs prescription intensification with increased fill volume or transition to automated cycling.',
    patient: {
      ageYears: 50,
      sex: 'MALE',
      heightCm: 182,
      weightKg: 88, // Large TBW
      isDiabetic: false,
      isAnuric: true,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 2.25,
      serumCreatinineMgDl: 11.2,
      serumGlucoseMgDl: 95,
      serumBunMgDl: 75,
      serumSodiumMmolL: 138,
      dialysate0hGlucoseMgDl: 2200,
      dialysate2hGlucoseMgDl: 1250,
      dialysate2hCreatinineMgDl: 4.1,
      dialysate4hGlucoseMgDl: 880,
      dialysate4hCreatinineMgDl: 5.6, // D/P Cr = 0.50 (low-average)
      dialysate60minSodiumMmolL: 132,
      effluentDrainVolumeMl: 2250,
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 6, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 6, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 6, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2000, dwellHours: 6, solutionType: 'DEXTROSE_2_25' },
      ],
      totalDialysateVolumeLPerDay: 8.0,
      totalEffluentDrainLPerDay: 8.8,
      dialysateUreaNitrogenMgDl: 48,
    },
  },
  {
    id: 'LOW_TRANSPORTER_CAPD_OPTIMIZED',
    name: 'Low Transporter Optimized on High-Volume CAPD',
    category: 'Prescription Optimization',
    description:
      '44-year-old female low transporter (D/P Cr 0.46) with tremendous ultrafiltration capacity. Successfully maintained on 4 x 2.5L CAPD long dwells with excellent fluid balance and total Kt/V of 1.76.',
    patient: {
      ageYears: 44,
      sex: 'FEMALE',
      heightCm: 165,
      weightKg: 58,
      isDiabetic: false,
      isAnuric: false,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 2.25,
      serumCreatinineMgDl: 7.8,
      serumGlucoseMgDl: 90,
      serumBunMgDl: 48,
      serumSodiumMmolL: 139,
      dialysate0hGlucoseMgDl: 2190,
      dialysate2hGlucoseMgDl: 1480,
      dialysate2hCreatinineMgDl: 2.6,
      dialysate4hGlucoseMgDl: 1120, // High D/D0 (0.51)
      dialysate4hCreatinineMgDl: 3.6, // D/P Cr = 0.46 (Low transporter)
      dialysate60minSodiumMmolL: 131,
      effluentDrainVolumeMl: 2460, // Strong UF (+460 mL)
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'CAPD',
      dayExchanges: [
        { volumeMl: 2500, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2500, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2500, dwellHours: 5, solutionType: 'DEXTROSE_1_5' },
        { volumeMl: 2500, dwellHours: 9, solutionType: 'DEXTROSE_2_25' },
      ],
      totalDialysateVolumeLPerDay: 10.0,
      totalEffluentDrainLPerDay: 11.6,
      dialysateUreaNitrogenMgDl: 34,
    },
    renal: {
      dailyUrineVolumeL: 0.4,
      urineUreaNitrogenMgDl: 240,
      urineCreatinineMgDl: 48,
    },
  },
  {
    id: 'ICODEXTRIN_RESCUED_VOLUME_OVERLOAD',
    name: 'High Transporter Rescued with Icodextrin 7.5%',
    category: 'Prescription Optimization',
    description:
      '60-year-old male high transporter (D/P Cr 0.85) previously suffering from daytime fluid reabsorption on APD. Day dwell converted to 7.5% Icodextrin colloid solution, achieving sustained net UF (+540 mL) without systemic glucose loading.',
    patient: {
      ageYears: 60,
      sex: 'MALE',
      heightCm: 170,
      weightKg: 78,
      isDiabetic: true,
      isAnuric: true,
    },
    pet: {
      infusionVolumeMl: 2000,
      dextroseConcentrationPct: 2.25,
      serumCreatinineMgDl: 8.8,
      serumGlucoseMgDl: 145,
      serumBunMgDl: 58,
      serumSodiumMmolL: 138,
      dialysate0hGlucoseMgDl: 2150,
      dialysate2hGlucoseMgDl: 1020,
      dialysate2hCreatinineMgDl: 5.4,
      dialysate4hGlucoseMgDl: 580,
      dialysate4hCreatinineMgDl: 7.5, // D/P Cr = 0.85 (High transporter)
      dialysate60minSodiumMmolL: 130,
      effluentDrainVolumeMl: 2120,
      assayMethod: 'JAFFE_CORRECTED',
    },
    rx: {
      modality: 'APD_CCPD',
      dayExchanges: [
        { volumeMl: 2000, dwellHours: 14, solutionType: 'ICODEXTRIN_7_5' },
      ],
      nightCycles: {
        numberOfCycles: 5,
        fillVolumeMl: 2000,
        cycleDurationHours: 9,
        solutionType: 'DEXTROSE_1_5',
      },
      totalDialysateVolumeLPerDay: 12.0,
      totalEffluentDrainLPerDay: 13.4,
      dialysateUreaNitrogenMgDl: 44,
    },
  },
];
