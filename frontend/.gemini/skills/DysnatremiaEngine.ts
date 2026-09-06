/**
 * DysnatremiaEngine.ts
 *
 * Biophysical & Clinical Pharmacokinetic Simulation Engine for
 * Dysnatremia (Hyponatremia & Hypernatremia), Adrogué-Madias Fluid Kinetics,
 * Osmotic Demyelination Syndrome (ODS) Risk Guardrails, and Neuro-Osmotherapy.
 *
 * Location: frontend/.gemini/skills/DysnatremiaEngine.ts
 */

export type PatientBiologicalSex = 'MALE' | 'FEMALE';
export type PatientAgeCategory = 'ADULT' | 'ELDERLY'; // > 65 years

export interface DysnatremiaPatientProfile {
  weightKg: number;
  sex: PatientBiologicalSex;
  ageCategory: PatientAgeCategory;
  baselineSerumSodiumMeqL: number; // e.g. 112 or 160
  baselineSerumPotassiumMeqL: number; // e.g. 3.2
  serumGlucoseMgDl: number; // e.g. 100 or 450
  serumBunMgDl: number; // e.g. 18
  measuredSerumOsmolalityMOsmKg?: number; // optional measured
  urineSodiumMeqL: number; // e.g. 12 or 65
  urineOsmolalityMOsmKg: number; // e.g. 80 or 520
  urineOutputMlHr: number; // e.g. 60 or 350
  hasSevereNeuroSymptoms: boolean; // seizures, coma, stupor, herniation
  isHighRiskForOds: boolean; // Na < 105, hypokalemia, alcoholism, malnutrition, cirrhosis
}

export type InfusateType =
  | 'NACL_3_PERCENT' // 513 mEq/L
  | 'NACL_0_9_PERCENT' // 154 mEq/L
  | 'RINGERS_LACTATE' // 130 mEq/L
  | 'NACL_0_45_PERCENT' // 77 mEq/L
  | 'D5W_OR_FREE_WATER' // 0 mEq/L
  | 'MANNITOL_20_PERCENT'; // 1098 mOsm/L, 0 mEq/L Na

export interface InfusateProperties {
  name: string;
  sodiumMeqL: number;
  potassiumMeqL: number;
  osmolalityMOsmL: number;
  tonicityCategory: 'HYPERTONIC' | 'ISOTONIC' | 'HYPOTONIC' | 'FREE_WATER';
}

export const INFUSATE_REGISTRY: Record<InfusateType, InfusateProperties> = {
  NACL_3_PERCENT: {
    name: '3% Hypertonic Saline',
    sodiumMeqL: 513,
    potassiumMeqL: 0,
    osmolalityMOsmL: 1026,
    tonicityCategory: 'HYPERTONIC',
  },
  NACL_0_9_PERCENT: {
    name: '0.9% Normal Saline',
    sodiumMeqL: 154,
    potassiumMeqL: 0,
    osmolalityMOsmL: 308,
    tonicityCategory: 'ISOTONIC',
  },
  RINGERS_LACTATE: {
    name: "Ringer's Lactate",
    sodiumMeqL: 130,
    potassiumMeqL: 4,
    osmolalityMOsmL: 273,
    tonicityCategory: 'ISOTONIC',
  },
  NACL_0_45_PERCENT: {
    name: '0.45% Half-Normal Saline',
    sodiumMeqL: 77,
    potassiumMeqL: 0,
    osmolalityMOsmL: 154,
    tonicityCategory: 'HYPOTONIC',
  },
  D5W_OR_FREE_WATER: {
    name: 'D5W / Enteral Free Water',
    sodiumMeqL: 0,
    potassiumMeqL: 0,
    osmolalityMOsmL: 278, // in vivo metabolizes to 0 mOsm effective
    tonicityCategory: 'FREE_WATER',
  },
  MANNITOL_20_PERCENT: {
    name: '20% Mannitol',
    sodiumMeqL: 0,
    potassiumMeqL: 0,
    osmolalityMOsmL: 1098,
    tonicityCategory: 'HYPERTONIC',
  },
};

export type HyponatremiaEtiologyClassification =
  | 'HYPERTONIC_TRANSLOCATIONAL' // Hyperglycemia, Mannitol
  | 'ISOTONIC_PSEUDOHYPONATREMIA' // Hypertriglyceridemia, paraproteinemia
  | 'HYPOTONIC_HYPOVOLEMIC_EXTRARENAL' // GI loss, burns, dehydration (UNa < 20)
  | 'HYPOTONIC_HYPOVOLEMIC_RENAL' // Diuretics, mineralocorticoid deficiency, CSW (UNa > 20)
  | 'HYPOTONIC_EUVOLEMIC_SIADH' // SIADH (UNa > 30-40, UOsm > 100)
  | 'HYPOTONIC_EUVOLEMIC_POLYDYPSIA_POTOMANIA' // Psychogenic polydipsia / Beer potomania (UOsm < 100)
  | 'HYPOTONIC_EUVOLEMIC_ENDOCRINE' // Hypothyroidism, glucocorticoid deficiency
  | 'HYPOTONIC_HYPERVOLEMIC_CHF_CIRRHOSIS' // Congestive heart failure, Cirrhosis (UNa < 20)
  | 'HYPOTONIC_HYPERVOLEMIC_RENAL_FAILURE' // Advanced renal failure, AKI (UNa > 20)
  | 'NORMONATREMIA'
  | 'HYPERNATREMIA_DEHYDRATION'
  | 'HYPERNATREMIA_CENTRAL_DI'
  | 'HYPERNATREMIA_NEPHROGENIC_DI';

export interface InfusionRegimen {
  selectedInfusate: InfusateType;
  infusionRateMlHr: number; // e.g. 100 mL/hr or bolus
  durationHours: number; // e.g. 6 or 24 hours
  bolusesGiven3PercentCount: number; // e.g. 1, 2, or 3 boluses of 100-150 mL
  bolusVolumeMl: number; // usually 100 or 150 mL
  ddavpClampGiven: boolean; // Desmopressin 1-2 mcg IV
}

export interface DysnatremiaEvaluation {
  totalBodyWaterLiters: number;
  calculatedSerumOsmolalityMOsmKg: number;
  glucoseCorrectedSodiumMeqL: number;
  effectiveTonicityState: 'HYPOTONIC' | 'ISOTONIC' | 'HYPERTONIC';
  etiologyClassification: HyponatremiaEtiologyClassification;
  etiologyDiagnosticRationale: string;

  // Kinetics via Adrogué-Madias
  deltaSodiumPerLiterInfusateMeqL: number;
  predicted24hSodiumChangeMeqL: number;
  projectedSerumSodiumMeqL: number;

  // Safety & ODS Monitoring
  safe24hCorrectionLimitMeqL: number; // 8 or 6 if high risk
  isAtRiskForOsmoticDemyelination: boolean;
  isOvercorrecting: boolean;
  emergencyBolusRecommendation: string;
  overcorrectionRescuePlan: string;

  // Hypernatremia Free Water Deficit
  freeWaterDeficitLiters: number;
  recommendedWaterReplacementRateMlHr: number;

  // Neuro-Osmotherapy Target
  osmotherapyIcpTargetSodiumMeqL: number;
  osmotherapyRecommendation: string;

  clinicalSafetyAlerts: string[];
}

/**
 * Calculates Total Body Water (TBW) using gender and age-adjusted fractions
 */
export function calculateTotalBodyWater(
  weightKg: number,
  sex: PatientBiologicalSex,
  ageCategory: PatientAgeCategory
): number {
  let factor = 0.6;
  if (sex === 'MALE') {
    factor = ageCategory === 'ELDERLY' ? 0.5 : 0.6;
  } else {
    factor = ageCategory === 'ELDERLY' ? 0.45 : 0.5;
  }
  return parseFloat((weightKg * factor).toFixed(1));
}

/**
 * Calculates Katz / Hillier corrected serum sodium for hyperglycemia
 */
export function calculateCorrectedSodium(
  measuredSodium: number,
  glucoseMgDl: number
): number {
  if (glucoseMgDl <= 100) return measuredSodium;
  // Standard Katz coefficient: 1.6 mEq/L per 100 mg/dL glucose elevation above 100
  // For glucose > 400 mg/dL, Hillier 2.4 coefficient can apply; here we use 1.6 - 2.0 linear interpolation
  const excessGlucose100 = (glucoseMgDl - 100) / 100;
  const correctionFactor = glucoseMgDl > 400 ? 2.4 : 1.6;
  const corrected = measuredSodium + excessGlucose100 * correctionFactor;
  return parseFloat(corrected.toFixed(1));
}

/**
 * Calculates serum osmolality: 2*Na + Glucose/18 + BUN/2.8
 */
export function calculateSerumOsmolality(
  sodiumMeqL: number,
  glucoseMgDl: number,
  bunMgDl: number
): number {
  const osmo = 2 * sodiumMeqL + glucoseMgDl / 18 + bunMgDl / 2.8;
  return parseFloat(osmo.toFixed(1));
}

/**
 * Calculates Free Water Deficit for Hypernatremia:
 * FWD = TBW * (SerumNa / 140 - 1)
 */
export function calculateFreeWaterDeficit(
  tbwLiters: number,
  serumSodiumMeqL: number
): number {
  if (serumSodiumMeqL <= 140) return 0;
  const deficit = tbwLiters * (serumSodiumMeqL / 140 - 1);
  return parseFloat(Math.max(0, deficit).toFixed(2));
}

/**
 * Adrogué-Madias Formula for Delta Serum Sodium per 1 Liter of Infusate:
 * Delta [Na] = (Na_infusate + K_infusate - Na_serum) / (TBW + 1)
 */
export function calculateAdrogueMadiasDelta(
  infusate: InfusateProperties,
  currentSerumSodiumMeqL: number,
  tbwLiters: number
): number {
  const delta =
    (infusate.sodiumMeqL + infusate.potassiumMeqL - currentSerumSodiumMeqL) /
    (tbwLiters + 1);
  return parseFloat(delta.toFixed(3));
}

/**
 * Diagnoses dysnatremia etiology based on volume status, osmolality, and urine studies
 */
export function classifyDysnatremiaEtiology(
  patient: DysnatremiaProfileSummary
): { etiology: HyponatremiaEtiologyClassification; rationale: string } {
  const {
    serumSodium,
    correctedSodium,
    serumOsmolality,
    urineSodium,
    urineOsmolality,
  } = patient;

  // Hypernatremia
  if (serumSodium > 145) {
    if (urineOsmolality < 300) {
      return {
        etiology: 'HYPERNATREMIA_CENTRAL_DI',
        rationale:
          'Inappropriately dilute urine (UOsm < 300 mOsm/kg) in the presence of hypernatremia indicates Diabetes Insipidus (Central vs Nephrogenic). High desmopressin responsiveness differentiates Central DI.',
      };
    }
    return {
      etiology: 'HYPERNATREMIA_DEHYDRATION',
      rationale:
        'Hypernatremia with concentrated urine (UOsm > 600-800 mOsm/kg) reflects intact renal ADH response to severe free water loss or inadequate water intake.',
    };
  }

  // Normonatremia
  if (serumSodium >= 135 && serumSodium <= 145) {
    return {
      etiology: 'NORMONATREMIA',
      rationale:
        'Normal serum sodium within physiological homeostatic range (135–145 mEq/L).',
    };
  }

  // Hyponatremia (< 135)
  // Step 1: Check tonicity / calculated osmolality
  if (serumOsmolality > 295) {
    return {
      etiology: 'HYPERTONIC_TRANSLOCATIONAL',
      rationale: `Hypertonic translocational hyponatremia driven by effective osmoles (Glucose ${patient.glucoseMgDl} mg/dL). Corrected sodium is ${correctedSodium} mEq/L.`,
    };
  }

  if (serumOsmolality >= 275 && serumOsmolality <= 295) {
    return {
      etiology: 'ISOTONIC_PSEUDOHYPONATREMIA',
      rationale:
        'Isotonic pseudohyponatremia due to plasma volume expansion by solid phase (extreme hypertriglyceridemia or paraproteinemia/multiple myeloma). Direct ion-selective electrode eliminates artifact.',
    };
  }

  // True Hypotonic Hyponatremia (< 275 mOsm/kg)
  if (urineOsmolality < 100) {
    return {
      etiology: 'HYPOTONIC_EUVOLEMIC_POLYDYPSIA_POTOMANIA',
      rationale:
        'Maximally dilute urine (UOsm < 100 mOsm/kg) indicates suppressed ADH. Etiology: Primary/psychogenic polydipsia (>15 L/day) or low solute intake (Beer Potomania, Tea & Toast diet). High risk of rapid self-overcorrection upon solute challenge!',
    };
  }

  // Urine Osmolality >= 100 mOsm/kg -> Impaired water excretion (ADH present)
  if (urineSodium < 20) {
    // Low urine sodium -> Avid renal sodium retention (low effective circulating volume)
    return {
      etiology: 'HYPOTONIC_HYPOVOLEMIC_EXTRARENAL',
      rationale:
        'Hypotonic hyponatremia with UNa < 20 mEq/L indicates low effective circulating arterial volume triggering non-osmotic ADH release. Causes: Extrarenal volume loss (vomiting, diarrhea, third-spacing) or hypervolemic states (CHF, Cirrhosis).',
    };
  } else {
    // Urine sodium >= 20-30 mEq/L
    if (urineSodium >= 30 && urineOsmolality > 100) {
      return {
        etiology: 'HYPOTONIC_EUVOLEMIC_SIADH',
        rationale:
          'Classic SIADH criteria met: Hypotonic hyponatremia, euvolemic exam, inappropriately elevated urine osmolality (>100 mOsm/kg, often > 300), and elevated urine sodium (> 30–40 mEq/L) reflecting normal dietary sodium excretion in euvolemia.',
      };
    }
    return {
      etiology: 'HYPOTONIC_HYPOVOLEMIC_RENAL',
      rationale:
        'Hypotonic hyponatremia with renal sodium wasting (UNa > 20 mEq/L). Causes: Thiazide/loop diuretics, cerebral salt wasting (CSW), or primary adrenal insufficiency (Addison disease).',
    };
  }
}

export interface DysnatremiaProfileSummary {
  serumSodium: number;
  correctedSodium: number;
  serumOsmolality: number;
  glucoseMgDl: number;
  urineSodium: number;
  urineOsmolality: number;
}

/**
 * Master Workstation Evaluation Function
 */
export function evaluateDysnatremiaWorkstation(
  patient: DysnatremiaPatientProfile,
  regimen: InfusionRegimen
): DysnatremiaEvaluation {
  const tbw = calculateTotalBodyWater(patient.weightKg, patient.sex, patient.ageCategory);
  const correctedNa = calculateCorrectedSodium(patient.baselineSerumSodiumMeqL, patient.serumGlucoseMgDl);
  const serumOsmo = calculateSerumOsmolality(
    patient.baselineSerumSodiumMeqL,
    patient.serumGlucoseMgDl,
    patient.serumBunMgDl
  );

  const effectiveTonicity: 'HYPOTONIC' | 'ISOTONIC' | 'HYPERTONIC' =
    serumOsmo < 275 ? 'HYPOTONIC' : serumOsmo > 295 ? 'HYPERTONIC' : 'ISOTONIC';

  const { etiology, rationale } = classifyDysnatremiaEtiology({
    serumSodium: patient.baselineSerumSodiumMeqL,
    correctedSodium: correctedNa,
    serumOsmolality: serumOsmo,
    glucoseMgDl: patient.serumGlucoseMgDl,
    urineSodium: patient.urineSodiumMeqL,
    urineOsmolality: patient.urineOsmolalityMOsmKg,
  });

  const infusateProps = INFUSATE_REGISTRY[regimen.selectedInfusate];
  const deltaPerLiter = calculateAdrogueMadiasDelta(
    infusateProps,
    patient.baselineSerumSodiumMeqL,
    tbw
  );

  // Calculate volume infused in 24 hours
  const totalInfusionHours = Math.min(24, regimen.durationHours);
  const continuousInfusedLiters = (regimen.infusionRateMlHr * totalInfusionHours) / 1000;
  const bolusLiters =
    (regimen.bolusesGiven3PercentCount * regimen.bolusVolumeMl) / 1000;

  // Bolus delta: Boluses of 3% NaCl (513 mEq/L)
  const bolusInfusate = INFUSATE_REGISTRY['NACL_3_PERCENT'];
  const bolusDeltaPerLiter = calculateAdrogueMadiasDelta(
    bolusInfusate,
    patient.baselineSerumSodiumMeqL,
    tbw
  );
  const bolusSodiumIncrease = bolusDeltaPerLiter * bolusLiters;

  // Continuous infusion delta
  const continuousSodiumDelta = deltaPerLiter * continuousInfusedLiters;

  // Total predicted 24h change
  let predicted24hChange = parseFloat(
    (bolusSodiumIncrease + continuousSodiumDelta).toFixed(1)
  );

  // If DDAVP clamp given, urine water retention blocks excessive rise
  if (regimen.ddavpClampGiven && predicted24hChange > 4) {
    predicted24hChange = parseFloat((predicted24hChange * 0.65).toFixed(1));
  }

  const projectedSerumNa = parseFloat(
    (patient.baselineSerumSodiumMeqL + predicted24hChange).toFixed(1)
  );

  // Safety limits: ODS risk threshold
  // Standard: <= 8 mEq/L in 24h (and <= 16 mEq/L in 48h)
  // High-Risk (Na < 105, hypokalemia, alcoholism, malnutrition, advanced liver disease): <= 4-6 mEq/L in 24h
  const safeLimit = patient.isHighRiskForOds ? 6.0 : 8.0;
  const isAtRiskForODS = patient.baselineSerumSodiumMeqL < 120 && predicted24hChange > safeLimit;
  const isOvercorrecting = predicted24hChange > safeLimit;

  // Emergency Bolus Recommendation
  let emergencyBolusRec = '';
  if (patient.hasSevereNeuroSymptoms && patient.baselineSerumSodiumMeqL < 130) {
    emergencyBolusRec =
      'CRITICAL SYMPTOMATIC HYPONATREMIA: Immediately administer 100 to 150 mL of 3% Hypertonic Saline IV over 10–20 minutes. Repeat up to 2 times every 30 minutes until seizures/stupor resolve or acute +4 to +6 mEq/L target elevation achieved. Do not delay for infusion pump setup!';
  } else if (patient.baselineSerumSodiumMeqL < 120) {
    emergencyBolusRec =
      'Severe asymptomatic or mildly symptomatic hyponatremia: Bolus therapy not indicated. Initiate controlled slow infusion targeting <= 4–8 mEq/L rise in 24 hours with Q2-4H electrolyte checks.';
  } else {
    emergencyBolusRec =
      'Bolus 3% NaCl not indicated. Manage underlying etiology and titrate fluid restriction or enteral fluids.';
  }

  // Overcorrection Rescue Plan
  let overcorrectionPlan = '';
  if (isOvercorrecting) {
    overcorrectionPlan =
      'OVERCORRECTION EMERGENCY (ODS RISK): Rate exceeds safe limit (> ' +
      safeLimit +
      ' mEq/L in 24h). IMMEDIATELY stop active saline infusions. Administer Desmopressin (DDAVP) 1 to 2 mcg IV/SC every 6–8 hours to clamp aquaporin water channels and infuse D5W at 3 to 5 mL/kg/hr to re-lower serum sodium back into safe therapeutic target zone.';
  } else {
    overcorrectionPlan =
      'Correction rate is within safe limits (<= ' +
      safeLimit +
      ' mEq/L/24h). Maintain scheduled Q4H serum sodium checks. If brisk free water diuresis (> 100 mL/hr) develops, anticipate imminent overcorrection and prepare DDAVP rescue.';
  }

  // Hypernatremia Free Water Deficit
  const fwd = calculateFreeWaterDeficit(tbw, patient.baselineSerumSodiumMeqL);
  // Safe lowering rate: <= 10-12 mEq/L per 24 hours (~0.5 mEq/L/hr) to prevent cerebral edema
  const recommendedWaterRate =
    fwd > 0 ? parseFloat(((fwd * 1000) / 24).toFixed(0)) : 0;

  // Neuro-Osmotherapy Target
  const osmoTargetNa = 150; // Target 145-155 mEq/L for cerebral edema / elevated ICP
  let osmoRec = '';
  if (regimen.selectedInfusate === 'NACL_3_PERCENT') {
    osmoRec =
      'Neuro-Osmotherapy Protocol: 3% Hypertonic Saline exerts osmotic gradient across intact blood-brain barrier (reflection coefficient sigma = 1.0), drawing water from brain parenchyma without intravascular hypovolemia. Target serum Na 145–155 mEq/L and serum osmolality <= 320 mOsm/kg.';
  } else if (regimen.selectedInfusate === 'MANNITOL_20_PERCENT') {
    osmoRec =
      'Mannitol 20% Osmotherapy: Administer 0.5 to 1.0 g/kg IV bolus over 20 minutes. Causes rapid osmotic diuresis and plasma volume expansion followed by diuresis. Monitor osmolar gap; hold if serum osmolality > 320 mOsm/kg or osmolar gap > 20 to prevent acute tubular necrosis.';
  } else {
    osmoRec =
      'Standard fluid selected. For targeted neuro-osmotherapy in cerebral edema/ICP crisis, switch to 3% NaCl or 20% Mannitol.';
  }

  // Safety Alerts
  const alerts: string[] = [];
  if (patient.baselineSerumSodiumMeqL < 115) {
    alerts.push(
      'EXTREME HYPONATREMIA (< 115 mEq/L): High risk of cerebral edema, non-cardiogenic pulmonary edema (Ayus-Arieff syndrome), and fatal brainstem herniation.'
    );
  }
  if (patient.isHighRiskForOds) {
    alerts.push(
      'HIGH-RISK ODS CRITERIA IDENTIFIED: Strict 24-hour correction ceiling capped at 4–6 mEq/L. Rapid correction risks irreversible Central Pontine & Extrapontine Myelinolysis (locked-in syndrome).'
    );
  }
  if (isOvercorrecting) {
    alerts.push(
      `PREDICTED OVERCORRECTION DETECTED: 24-hour rise of +${predicted24hChange} mEq/L exceeds safe threshold of ${safeLimit} mEq/L. High risk of Osmotic Demyelination Syndrome!`
    );
  }
  if (patient.serumGlucoseMgDl > 250) {
    alerts.push(
      `HYPERGLYCEMIA ARTIFACT: Measured Na (${patient.baselineSerumSodiumMeqL}) reflects translocational osmotic shift. Corrected true sodium is ${correctedNa} mEq/L.`
    );
  }
  if (patient.baselineSerumSodiumMeqL > 155) {
    alerts.push(
      'SEVERE HYPERNATREMIA (> 155 mEq/L): Correct slowly at <= 0.5 mEq/L/hr (max 10-12 mEq/L/24h) to prevent acute cerebral edema, seizures, and permanent brain damage.'
    );
  }
  if (patient.urineOutputMlHr > 200 && patient.baselineSerumSodiumMeqL < 125) {
    alerts.push(
      'BRISK SPONTANEOUS WATER DIURESIS (> 200 mL/hr): Spontaneous clearance of free water can cause serum sodium to jump > 15 mEq/L in hours. Consider proactive DDAVP clamp!'
    );
  }

  return {
    totalBodyWaterLiters: tbw,
    calculatedSerumOsmolalityMOsmKg: serumOsmo,
    glucoseCorrectedSodiumMeqL: correctedNa,
    effectiveTonicityState: effectiveTonicity,
    etiologyClassification: etiology,
    etiologyDiagnosticRationale: rationale,
    deltaSodiumPerLiterInfusateMeqL: deltaPerLiter,
    predicted24hSodiumChangeMeqL: predicted24hChange,
    projectedSerumSodiumMeqL: projectedSerumNa,
    safe24hCorrectionLimitMeqL: safeLimit,
    isAtRiskForOsmoticDemyelination: isAtRiskForODS,
    isOvercorrecting,
    emergencyBolusRecommendation: emergencyBolusRec,
    overcorrectionRescuePlan: overcorrectionPlan,
    freeWaterDeficitLiters: fwd,
    recommendedWaterReplacementRateMlHr: recommendedWaterRate,
    osmotherapyIcpTargetSodiumMeqL: osmoTargetNa,
    osmotherapyRecommendation: osmoRec,
    clinicalSafetyAlerts: alerts,
  };
}

/**
 * Pre-configured clinical scenarios for simulation
 */
export interface DysnatremiaPreset {
  id: string;
  name: string;
  description: string;
  patient: DysnatremiaPatientProfile;
  regimen: InfusionRegimen;
}

export const DYSNATREMIA_PRESETS: DysnatremiaPreset[] = [
  {
    id: 'ACUTE_SEVERE_SYMPTOMATIC_HYPONATREMIA',
    name: 'Acute Severe Symptomatic Hyponatremia (Seizures / Marathon Runner)',
    description:
      'Exercise-associated water intoxication in a 28-year-old female runner. Na 112 mEq/L with tonic-clonic seizures. Requires immediate 3% NaCl 100 mL boluses to stop herniation.',
    patient: {
      weightKg: 55,
      sex: 'FEMALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 112,
      baselineSerumPotassiumMeqL: 4.1,
      serumGlucoseMgDl: 95,
      serumBunMgDl: 12,
      urineSodiumMeqL: 18,
      urineOsmolalityMOsmKg: 140,
      urineOutputMlHr: 40,
      hasSevereNeuroSymptoms: true,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'NACL_3_PERCENT',
      infusionRateMlHr: 50,
      durationHours: 6,
      bolusesGiven3PercentCount: 2,
      bolusVolumeMl: 100,
      ddavpClampGiven: false,
    },
  },
  {
    id: 'CHRONIC_SIADH_PARANEOPLASTIC',
    name: 'Chronic Euvolemic SIADH (Small Cell Lung Cancer)',
    description:
      '68-year-old male with SCLC and mild lethargy. Euvolemic, Na 118 mEq/L, UNa 65 mEq/L, UOsm 540 mOsm/kg. Managed with fluid restriction and oral sodium/urea.',
    patient: {
      weightKg: 70,
      sex: 'MALE',
      ageCategory: 'ELDERLY',
      baselineSerumSodiumMeqL: 118,
      baselineSerumPotassiumMeqL: 4.4,
      serumGlucoseMgDl: 105,
      serumBunMgDl: 8,
      urineSodiumMeqL: 65,
      urineOsmolalityMOsmKg: 540,
      urineOutputMlHr: 50,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'NACL_0_9_PERCENT',
      infusionRateMlHr: 40,
      durationHours: 24,
      bolusesGiven3PercentCount: 0,
      bolusVolumeMl: 100,
      ddavpClampGiven: false,
    },
  },
  {
    id: 'CIRRHOSIS_HYPOVOLEMIC_HIGH_ODS_RISK',
    name: 'Decompensated Cirrhosis with Hypokalemia (High ODS Risk)',
    description:
      '54-year-old male with alcohol-related cirrhosis, ascites, and Na 108 mEq/L, K 2.8 mEq/L. High ODS risk limits 24h correction to strict max 4–6 mEq/L.',
    patient: {
      weightKg: 75,
      sex: 'MALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 108,
      baselineSerumPotassiumMeqL: 2.8,
      serumGlucoseMgDl: 110,
      serumBunMgDl: 26,
      urineSodiumMeqL: 8,
      urineOsmolalityMOsmKg: 420,
      urineOutputMlHr: 30,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: true,
    },
    regimen: {
      selectedInfusate: 'NACL_0_9_PERCENT',
      infusionRateMlHr: 50,
      durationHours: 12,
      bolusesGiven3PercentCount: 0,
      bolusVolumeMl: 100,
      ddavpClampGiven: false,
    },
  },
  {
    id: 'OVERCORRECTION_RESCUE_DDAVP',
    name: 'Rapid Overcorrection Rescue (DDAVP & D5W Clamp)',
    description:
      'Accidental overcorrection: patient with beer potomania was given normal saline and sodium surged by +14 mEq/L in 12 hours. Emergency DDAVP clamp and D5W indicated to prevent locked-in syndrome.',
    patient: {
      weightKg: 65,
      sex: 'FEMALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 110,
      baselineSerumPotassiumMeqL: 3.1,
      serumGlucoseMgDl: 90,
      serumBunMgDl: 6,
      urineSodiumMeqL: 15,
      urineOsmolalityMOsmKg: 85,
      urineOutputMlHr: 350,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: true,
    },
    regimen: {
      selectedInfusate: 'NACL_3_PERCENT',
      infusionRateMlHr: 120,
      durationHours: 24,
      bolusesGiven3PercentCount: 1,
      bolusVolumeMl: 150,
      ddavpClampGiven: true,
    },
  },
  {
    id: 'DEHYDRATION_HYPERNATREMIA_ELDERLY',
    name: 'Severe Dehydration Hypernatremia in Frail Elderly',
    description:
      '82-year-old female from nursing home with dementia, fever, and unreplaced water loss. Na 162 mEq/L, Free Water Deficit ~5.6 Liters. Controlled enteral free water / D5W replacement.',
    patient: {
      weightKg: 50,
      sex: 'FEMALE',
      ageCategory: 'ELDERLY',
      baselineSerumSodiumMeqL: 162,
      baselineSerumPotassiumMeqL: 4.6,
      serumGlucoseMgDl: 120,
      serumBunMgDl: 48,
      urineSodiumMeqL: 35,
      urineOsmolalityMOsmKg: 780,
      urineOutputMlHr: 25,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'D5W_OR_FREE_WATER',
      infusionRateMlHr: 220,
      durationHours: 24,
      bolusesGiven3PercentCount: 0,
      bolusVolumeMl: 100,
      ddavpClampGiven: false,
    },
  },
  {
    id: 'CENTRAL_DIABETES_INSIPIDUS_POST_OP',
    name: 'Post-Transsphenoidal Central Diabetes Insipidus',
    description:
      '38-year-old male post-pituitary adenoma resection. Massive polyuria (450 mL/hr), dilute urine (UOsm 90 mOsm/kg), serum Na 154 mEq/L. Responds dramatically to DDAVP.',
    patient: {
      weightKg: 80,
      sex: 'MALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 154,
      baselineSerumPotassiumMeqL: 3.9,
      serumGlucoseMgDl: 100,
      serumBunMgDl: 14,
      urineSodiumMeqL: 12,
      urineOsmolalityMOsmKg: 90,
      urineOutputMlHr: 450,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'D5W_OR_FREE_WATER',
      infusionRateMlHr: 350,
      durationHours: 12,
      bolusesGiven3PercentCount: 0,
      bolusVolumeMl: 100,
      ddavpClampGiven: true,
    },
  },
  {
    id: 'TBI_ELEVATED_ICP_OSMOTHERAPY',
    name: 'Traumatic Brain Injury & Targeted 3% NaCl Osmotherapy',
    description:
      '24-year-old male with severe TBI and refractory intracranial hypertension (ICP 28 mmHg). 3% NaCl infusion titrated to achieve target hypernatremia 148–152 mEq/L.',
    patient: {
      weightKg: 78,
      sex: 'MALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 138,
      baselineSerumPotassiumMeqL: 4.2,
      serumGlucoseMgDl: 110,
      serumBunMgDl: 16,
      urineSodiumMeqL: 45,
      urineOsmolalityMOsmKg: 450,
      urineOutputMlHr: 80,
      hasSevereNeuroSymptoms: true,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'NACL_3_PERCENT',
      infusionRateMlHr: 80,
      durationHours: 12,
      bolusesGiven3PercentCount: 1,
      bolusVolumeMl: 150,
      ddavpClampGiven: false,
    },
  },
  {
    id: 'HYPERGLYCEMIC_HHS_PSEUDOHYPONATREMIA',
    name: 'Hyperglycemic Hyperosmolar State (Translocational)',
    description:
      '62-year-old female with Type 2 DM, glucose 850 mg/dL, measured Na 124 mEq/L. Corrected true sodium is 136 mEq/L (eunatremic). Avoid hypertonic saline!',
    patient: {
      weightKg: 72,
      sex: 'FEMALE',
      ageCategory: 'ADULT',
      baselineSerumSodiumMeqL: 124,
      baselineSerumPotassiumMeqL: 4.8,
      serumGlucoseMgDl: 850,
      serumBunMgDl: 52,
      urineSodiumMeqL: 40,
      urineOsmolalityMOsmKg: 620,
      urineOutputMlHr: 120,
      hasSevereNeuroSymptoms: false,
      isHighRiskForOds: false,
    },
    regimen: {
      selectedInfusate: 'NACL_0_9_PERCENT',
      infusionRateMlHr: 250,
      durationHours: 12,
      bolusesGiven3PercentCount: 0,
      bolusVolumeMl: 100,
      ddavpClampGiven: false,
    },
  },
];
