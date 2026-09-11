/**
 * DkaHhsEngine.ts
 * Diabetic Ketoacidosis (DKA), Hyperosmolar Hyperglycemic State (HHS),
 * Potassium Safety Interlock, Two-Bag Fluid Titration System,
 * and Osmotic Cerebral Edema Prevention Workstation.
 * Location: frontend/.gemini/skills/DkaHhsEngine.ts
 */

export type GlycemicCrisisType = 'MILD_DKA' | 'MODERATE_DKA' | 'SEVERE_DKA' | 'HHS' | 'MIXED_DKA_HHS' | 'CONTROLLED_EUGLYCEMIA';

export interface DkaHhsPatientInput {
  measuredGlucoseMgDl: number; // e.g. 150 - 1400 mg/dL
  measuredSodiumMeqL: number; // e.g. 115 - 160 mEq/L
  measuredPotassiumMeqL: number; // e.g. 2.5 - 6.5 mEq/L
  serumChlorideMeqL: number; // e.g. 90 - 120 mEq/L
  serumBicarbonateMeqL: number; // e.g. 3 - 30 mEq/L
  arterialVenousPh: number; // e.g. 6.85 - 7.45
  serumBunMgDl: number; // e.g. 10 - 120 mg/dL
  betaHydroxybutyrateMmolL: number; // e.g. 0.2 - 15 mmol/L (> 3.0 diagnostic of DKA)
  patientWeightKg: number; // e.g. 40 - 120 kg
  patientAgeYears: number; // e.g. 8 - 85 years (pediatric < 20 high cerebral edema risk)
  hourlyGlucoseDropRateMgDlH: number; // Rate of glucose decline e.g. 0 - 180 mg/dL/h
  bag1RateMlH: number; // Bag 1 (0% Dextrose with electrolytes) mL/h
  bag2RateMlH: number; // Bag 2 (10% Dextrose with electrolytes) mL/h
  activeInsulinInfusionUnitsPerKgH: number; // Regular insulin drip e.g. 0.0 - 0.2 U/kg/h
  gcsScore: number; // Glasgow Coma Scale 3 - 15
}

export interface DkaHhsClinicalMetrics {
  diagnosis: GlycemicCrisisType;
  correctedSodiumMeqL: number;
  effectiveOsmolalityMOsmKg: number;
  totalOsmolalityMOsmKg: number;
  anionGapMeqL: number;
  waterDeficitLiters: number;
  // Potassium Gate
  potassiumGateStatus: 'HOLD_INSULIN_CRITICAL' | 'PERMIT_INSULIN_REPLETE_K' | 'PERMIT_INSULIN_HOLD_K';
  potassiumGateAction: string;
  // Two-Bag Infusion
  totalInfusionRateMlH: number;
  deliveredDextrosePercent: number; // e.g. 0% to 10%
  dextroseDeliveryRateGH: number; // Grams of glucose per hour
  twoBagRecommendation: string;
  // Cerebral Edema
  cerebralEdemaRiskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'IMMINENT_HERNIATION';
  cerebralEdemaWarning: string | null;
  cerebralEdemaRescueTreatment: string | null;
  // Resolution & Subcutaneous Transition
  isDkaResolved: boolean;
  resolutionCriteriaPassed: string[];
  subcutaneousBridgeRecommendation: string;
  diagnosticSummary: string;
}

export const DKA_HHS_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: DkaHhsPatientInput;
}[] = [
  {
    id: 'severe-pediatric-dka',
    name: 'Severe Pediatric DKA (High Cerebral Edema Risk)',
    badge: 'Pediatric Emergency',
    description: 'A 14-year-old with new-onset Type 1 Diabetes presents with Kussmaul respirations, vomiting, and lethargy (GCS 13). Blood glucose 540 mg/dL, pH 7.02, HCO3 6 mEq/L, beta-hydroxybutyrate 8.4 mmol/L, K 4.1 mEq/L. Requires tight two-bag dextrose titration to avoid rapid drop in osmolality and cerebral edema.',
    input: {
      measuredGlucoseMgDl: 540,
      measuredSodiumMeqL: 130,
      measuredPotassiumMeqL: 4.1,
      serumChlorideMeqL: 98,
      serumBicarbonateMeqL: 6,
      arterialVenousPh: 7.02,
      serumBunMgDl: 34,
      betaHydroxybutyrateMmolL: 8.4,
      patientWeightKg: 45,
      patientAgeYears: 14,
      hourlyGlucoseDropRateMgDlH: 60,
      bag1RateMlH: 200,
      bag2RateMlH: 0,
      activeInsulinInfusionUnitsPerKgH: 0.08,
      gcsScore: 13,
    },
  },
  {
    id: 'hypokalemic-dka-trap',
    name: 'Severe DKA with Hypokalemic Trap (HOLD Insulin)',
    badge: 'Safety Interlock Trigger',
    description: 'A 28-year-old with Type 1 Diabetes presents after 3 days of gastroenteritis. Glucose 480 mg/dL, pH 7.15, HCO3 10 mEq/L, and serum potassium 2.9 mEq/L. Starting insulin before potassium reaches 3.3 mEq/L triggers catastrophic dysrhythmias and cardiac arrest.',
    input: {
      measuredGlucoseMgDl: 480,
      measuredSodiumMeqL: 132,
      measuredPotassiumMeqL: 2.9,
      serumChlorideMeqL: 96,
      serumBicarbonateMeqL: 10,
      arterialVenousPh: 7.15,
      serumBunMgDl: 42,
      betaHydroxybutyrateMmolL: 6.5,
      patientWeightKg: 65,
      patientAgeYears: 28,
      hourlyGlucoseDropRateMgDlH: 0,
      bag1RateMlH: 250,
      bag2RateMlH: 0,
      activeInsulinInfusionUnitsPerKgH: 0.0,
      gcsScore: 14,
    },
  },
  {
    id: 'profound-elderly-hhs',
    name: 'Severe Hyperosmolar Hyperglycemic State (HHS)',
    badge: 'Profound Dehydration',
    description: 'A 72-year-old with Type 2 Diabetes and pneumonia presents with severe obtundation (GCS 10). Blood glucose is 980 mg/dL, serum sodium 146 mEq/L, pH 7.36, HCO3 22 mEq/L, beta-hydroxybutyrate 1.1 mmol/L, effective osmolality > 345 mOsm/kg. Free water deficit exceeds 8.5 liters.',
    input: {
      measuredGlucoseMgDl: 980,
      measuredSodiumMeqL: 146,
      measuredPotassiumMeqL: 4.8,
      serumChlorideMeqL: 104,
      serumBicarbonateMeqL: 22,
      arterialVenousPh: 7.36,
      serumBunMgDl: 68,
      betaHydroxybutyrateMmolL: 1.1,
      patientWeightKg: 78,
      patientAgeYears: 72,
      hourlyGlucoseDropRateMgDlH: 55,
      bag1RateMlH: 300,
      bag2RateMlH: 0,
      activeInsulinInfusionUnitsPerKgH: 0.05,
      gcsScore: 10,
    },
  },
  {
    id: 'two-bag-dextrose-transition',
    name: 'DKA Two-Bag Transition (Glucose Falling < 200 mg/dL)',
    badge: 'Two-Bag Active Titration',
    description: 'A 22-year-old responding to resuscitation. Glucose has dropped from 460 to 192 mg/dL, but anion gap is still elevated at 15 mEq/L and beta-hydroxybutyrate is 2.4 mmol/L. Dextrose must be blended into the infusion (Bag 2) to maintain insulin clearance of ketoacidosis without hypoglycemia.',
    input: {
      measuredGlucoseMgDl: 192,
      measuredSodiumMeqL: 138,
      measuredPotassiumMeqL: 4.3,
      serumChlorideMeqL: 106,
      serumBicarbonateMeqL: 17,
      arterialVenousPh: 7.31,
      serumBunMgDl: 20,
      betaHydroxybutyrateMmolL: 2.4,
      patientWeightKg: 70,
      patientAgeYears: 22,
      hourlyGlucoseDropRateMgDlH: 45,
      bag1RateMlH: 100,
      bag2RateMlH: 100,
      activeInsulinInfusionUnitsPerKgH: 0.05,
      gcsScore: 15,
    },
  },
];

/**
 * Calculates corrected sodium based on Katz / Hillier formula.
 * Normal correction: Measured Na + 1.6 * (Glucose - 100) / 100
 * For Glucose > 400 mg/dL, 2.0 multiplier is widely accepted clinically.
 */
export function calculateCorrectedSodium(measuredNa: number, glucoseMgDl: number): number {
  if (glucoseMgDl <= 100) return measuredNa;
  const factor = glucoseMgDl > 400 ? 2.0 : 1.6;
  const correction = factor * ((glucoseMgDl - 100) / 100);
  return parseFloat((measuredNa + correction).toFixed(1));
}

/**
 * Calculates effective serum osmolality:
 * 2 * Na + (Glucose / 18)  (mOsm/kg)
 * BUN is omitted because urea penetrates cell membranes freely and does not create an effective osmotic gradient.
 */
export function calculateEffectiveOsmolality(measuredNa: number, glucoseMgDl: number): number {
  const osm = 2 * measuredNa + glucoseMgDl / 18;
  return parseFloat(osm.toFixed(1));
}

/**
 * Calculates total serum osmolality:
 * 2 * Na + (Glucose / 18) + (BUN / 2.8)
 */
export function calculateTotalOsmolality(measuredNa: number, glucoseMgDl: number, bunMgDl: number): number {
  const osm = 2 * measuredNa + glucoseMgDl / 18 + bunMgDl / 2.8;
  return parseFloat(osm.toFixed(1));
}

/**
 * Calculates serum anion gap:
 * Na - (Cl + HCO3)
 */
export function calculateAnionGap(measuredNa: number, chloride: number, bicarbonate: number): number {
  return parseFloat((measuredNa - (chloride + bicarbonate)).toFixed(1));
}

/**
 * Estimates free water deficit in liters based on corrected sodium.
 * TBW = 0.6 * weight (kg)
 * Deficit = TBW * (1 - 140 / Corrected Na)
 */
export function calculateWaterDeficitLiters(weightKg: number, correctedNa: number): number {
  const tbw = 0.6 * weightKg;
  if (correctedNa <= 140) return 0;
  const deficit = tbw * (1 - 140 / correctedNa);
  return parseFloat(Math.max(0, deficit).toFixed(1));
}

/**
 * Classifies glycemic crisis into Mild DKA, Moderate DKA, Severe DKA, HHS, or Mixed DKA/HHS.
 */
export function classifyGlycemicCrisis(input: DkaHhsPatientInput, effectiveOsm: number, anionGap: number): GlycemicCrisisType {
  const isKetotic = input.betaHydroxybutyrateMmolL >= 3.0;
  const isAcidotic = input.arterialVenousPh < 7.30 || input.serumBicarbonateMeqL < 18;
  const isHyperosmolar = effectiveOsm >= 320;
  const isHighGlucose = input.measuredGlucoseMgDl > 600;

  if (isKetotic && isAcidotic && isHyperosmolar && isHighGlucose) {
    return 'MIXED_DKA_HHS';
  }

  if (isHyperosmolar && isHighGlucose && !isAcidotic && input.betaHydroxybutyrateMmolL < 3.0) {
    return 'HHS';
  }

  if (isKetotic || isAcidotic || input.measuredGlucoseMgDl >= 250) {
    if (input.arterialVenousPh < 7.00 || input.serumBicarbonateMeqL < 10 || input.gcsScore < 12) {
      return 'SEVERE_DKA';
    }
    if (input.arterialVenousPh < 7.25 || input.serumBicarbonateMeqL < 15) {
      return 'MODERATE_DKA';
    }
    return 'MILD_DKA';
  }

  return 'CONTROLLED_EUGLYCEMIA';
}

/**
 * Evaluates the Potassium Safety Interlock.
 * RULE: If K < 3.3 mEq/L, HOLD insulin infusion to prevent fatal arrhythmias!
 */
export function evaluatePotassiumGate(serumK: number): {
  status: 'HOLD_INSULIN_CRITICAL' | 'PERMIT_INSULIN_REPLETE_K' | 'PERMIT_INSULIN_HOLD_K';
  action: string;
} {
  if (serumK < 3.3) {
    return {
      status: 'HOLD_INSULIN_CRITICAL',
      action: 'CRITICAL SAFETY INTERLOCK: HOLD INSULIN INFUSION IMMEDIATELY. Administer IV potassium (20-40 mEq/h) until serum K+ >= 3.3 mEq/L. Starting insulin will drive K+ into cells, causing fatal ventricular fibrillation or asystole.',
    };
  }
  if (serumK <= 5.2) {
    return {
      status: 'PERMIT_INSULIN_REPLETE_K',
      action: 'SAFE FOR INSULIN INFUSION. Add 20-30 mEq K+ per liter of IV maintenance fluid to maintain target serum K+ 4.0 - 5.0 mEq/L. Monitor serum K+ every 2 hours.',
    };
  }
  return {
    status: 'PERMIT_INSULIN_HOLD_K',
    action: 'SAFE FOR INSULIN INFUSION. DO NOT add potassium to IV fluids while K+ > 5.2 mEq/L. Recheck serum K+ in 2 hours as insulin and rehydration will drive potassium levels down rapidly.',
  };
}

/**
 * Evaluates Two-Bag fluid delivery and titration recommendations.
 * Bag 1: 0% Dextrose + electrolytes
 * Bag 2: 10% Dextrose + electrolytes
 */
export function evaluateTwoBagInfusion(
  bag1RateMlH: number,
  bag2RateMlH: number,
  glucoseMgDl: number,
  anionGap: number,
  diagnosis: GlycemicCrisisType
): {
  totalRateMlH: number;
  deliveredDextrosePercent: number;
  dextroseDeliveryRateGH: number;
  recommendation: string;
} {
  const totalRate = bag1RateMlH + bag2RateMlH;
  const deliveredDextrosePercent = totalRate > 0 ? parseFloat(((bag2RateMlH * 10) / totalRate).toFixed(1)) : 0;
  const dextroseDeliveryRateGH = parseFloat(((bag2RateMlH * 0.1)).toFixed(1)); // 10% dextrose = 100 mg/mL = 0.1 g/mL

  const isDka = diagnosis.includes('DKA');
  const targetThreshold = isDka ? 200 : 300;

  let recommendation = '';

  if (glucoseMgDl > targetThreshold) {
    if (bag2RateMlH > 0) {
      recommendation = `Glucose is > ${targetThreshold} mg/dL. Bag 2 (D10W) should be minimized or off (100% Bag 1) to allow steady glycemic descent (50-75 mg/dL/h).`;
    } else {
      recommendation = `Optimal initial phase: 100% Bag 1 (0% Dextrose) running. Glucose remains > ${targetThreshold} mg/dL. Monitor glucose hourly.`;
    }
  } else {
    // Glucose <= threshold (200 in DKA, 300 in HHS)
    if (anionGap > 12) {
      if (deliveredDextrosePercent < 4.0) {
        recommendation = `CRITICAL TITRATION: Glucose is <= ${targetThreshold} mg/dL while anion gap remains elevated (${anionGap} mEq/L). Increase Bag 2 (D10W) to achieve at least 5% Dextrose delivery (50/50 split) while CONTINUING insulin drip (0.05-0.1 U/kg/h) to clear ketoacidosis without causing hypoglycemia.`;
      } else {
        recommendation = `EXCELLENT TWO-BAG TITRATION: Currently delivering ${deliveredDextrosePercent}% Dextrose. This safely supports ongoing insulin infusion to suppress ketogenesis and close the anion gap.`;
      }
    } else {
      recommendation = `Anion gap has normalized (<= 12 mEq/L) with glucose <= ${targetThreshold} mg/dL. Patient is approaching DKA resolution criteria. Prepare for subcutaneous insulin transition.`;
    }
  }

  return {
    totalRateMlH: totalRate,
    deliveredDextrosePercent,
    dextroseDeliveryRateGH,
    recommendation,
  };
}

/**
 * Calculates Cerebral Edema Risk Index based on decline rates, osmolality, age, and neurological status.
 */
export function evaluateCerebralEdemaRisk(
  dropRateMgDlH: number,
  effectiveOsm: number,
  ageYears: number,
  ph: number,
  gcsScore: number
): {
  level: 'LOW' | 'MODERATE' | 'HIGH' | 'IMMINENT_HERNIATION';
  warning: string | null;
  rescueTreatment: string | null;
} {
  const isPediatric = ageYears < 20;
  const isPrecipitousDrop = dropRateMgDlH > 90;
  const isRapidDrop = dropRateMgDlH > 75;
  const isSevereAcidosis = ph < 7.10;
  const isNeurologicallyImpaired = gcsScore <= 12;

  if (gcsScore <= 9 || (isNeurologicallyImpaired && isPrecipitousDrop)) {
    return {
      level: 'IMMINENT_HERNIATION',
      warning: 'CRITICAL WARNING: Imminent cerebral herniation / severe osmotic brain edema detected (GCS <= 9 or profound decline). Immediate hyperosmolar therapy indicated.',
      rescueTreatment: 'EMERGENT INTERVENTION: Administer 3% Hypertonic Saline 2.5 - 5.0 mL/kg IV over 20-30 min OR Mannitol 0.5 - 1.0 g/kg IV over 20 min. Elevate head of bed 30 degrees. Reduce fluid infusion rate by 30-50%.',
    };
  }

  if (isPediatric && (isPrecipitousDrop || (isSevereAcidosis && isRapidDrop))) {
    return {
      level: 'HIGH',
      warning: 'HIGH CEREBRAL EDEMA RISK: In pediatric patients (< 20 yrs), glucose decline > 75-90 mg/dL/h or excessive initial fluid rate creates plasma hypoosmolar shift, pulling water into swollen astrocytes.',
      rescueTreatment: 'PREVENTIVE ACTION: Reduce insulin infusion or increase Bag 2 (D10W) delivery to decelerate glucose decline to 50-75 mg/dL/h. Have 3% Hypertonic Saline at bedside.',
    };
  }

  if (isRapidDrop || isSevereAcidosis) {
    return {
      level: 'MODERATE',
      warning: 'MODERATE RISK: Glucose decline rate is approaching safe upper limits (75 mg/dL/h). Monitor hourly neurological signs (headache, bradycardia, lethargy).',
      rescueTreatment: null,
    };
  }

  return {
    level: 'LOW',
    warning: null,
    rescueTreatment: null,
  };
}

/**
 * Checks DKA Resolution criteria according to ADA / ISPAD guidelines:
 * 1. Blood glucose < 200 mg/dL
 * 2. At least two of:
 *    - Serum HCO3 >= 15 mEq/L (or >= 18 mEq/L)
 *    - Venous pH > 7.30
 *    - Anion gap <= 12 mEq/L
 *    - Beta-hydroxybutyrate < 1.0 mmol/L
 */
export function evaluateDkaResolution(
  glucoseMgDl: number,
  hco3: number,
  ph: number,
  anionGap: number,
  bOHB: number
): {
  isResolved: boolean;
  passedCriteria: string[];
  subqBridgeGuidance: string;
} {
  const criteria: string[] = [];

  const glucoseOk = glucoseMgDl < 200;
  if (glucoseOk) criteria.push('Blood Glucose < 200 mg/dL');

  let metabolicPassedCount = 0;
  if (hco3 >= 15) {
    metabolicPassedCount++;
    criteria.push(`Serum HCO3- >= 15 mEq/L (${hco3} mEq/L)`);
  }
  if (ph > 7.30) {
    metabolicPassedCount++;
    criteria.push(`Venous pH > 7.30 (${ph})`);
  }
  if (anionGap <= 12) {
    metabolicPassedCount++;
    criteria.push(`Anion Gap <= 12 mEq/L (${anionGap} mEq/L)`);
  }
  if (bOHB < 1.0) {
    metabolicPassedCount++;
    criteria.push(`Beta-hydroxybutyrate < 1.0 mmol/L (${bOHB} mmol/L)`);
  }

  const isResolved = glucoseOk && metabolicPassedCount >= 2;

  let subqBridgeGuidance = '';
  if (isResolved) {
    subqBridgeGuidance = 'DKA RESOLVED: Administer subcutaneous basal insulin (e.g. Glargine / Detemir) 2 to 4 HOURS BEFORE discontinuing the IV insulin drip. Never stop IV insulin abruptly without basal overlap, as circulating insulin half-life is under 10 minutes and rapid rebound ketoacidosis will occur.';
  } else {
    subqBridgeGuidance = 'DKA UNRESOLVED: Continue IV regular insulin infusion. If glucose < 200 mg/dL, infuse D5W or D10W (via Two-Bag titration) to keep glucose 150-200 mg/dL until anion gap closes and HCO3- >= 15 mEq/L.';
  }

  return {
    isResolved,
    passedCriteria: criteria,
    subqBridgeGuidance,
  };
}

/**
 * Main computation entrypoint for the DKA/HHS Workstation.
 */
export function computeDkaHhsState(input: DkaHhsPatientInput): DkaHhsClinicalMetrics {
  const correctedNa = calculateCorrectedSodium(input.measuredSodiumMeqL, input.measuredGlucoseMgDl);
  const effectiveOsm = calculateEffectiveOsmolality(input.measuredSodiumMeqL, input.measuredGlucoseMgDl);
  const totalOsm = calculateTotalOsmolality(input.measuredSodiumMeqL, input.measuredGlucoseMgDl, input.serumBunMgDl);
  const anionGap = calculateAnionGap(input.measuredSodiumMeqL, input.serumChlorideMeqL, input.serumBicarbonateMeqL);
  const waterDeficit = calculateWaterDeficitLiters(input.patientWeightKg, correctedNa);

  const diagnosis = classifyGlycemicCrisis(input, effectiveOsm, anionGap);
  const potassiumGate = evaluatePotassiumGate(input.measuredPotassiumMeqL);
  const twoBag = evaluateTwoBagInfusion(
    input.bag1RateMlH,
    input.bag2RateMlH,
    input.measuredGlucoseMgDl,
    anionGap,
    diagnosis
  );
  const cerebralEdema = evaluateCerebralEdemaRisk(
    input.hourlyGlucoseDropRateMgDlH,
    effectiveOsm,
    input.patientAgeYears,
    input.arterialVenousPh,
    input.gcsScore
  );
  const resolution = evaluateDkaResolution(
    input.measuredGlucoseMgDl,
    input.serumBicarbonateMeqL,
    input.arterialVenousPh,
    anionGap,
    input.betaHydroxybutyrateMmolL
  );

  const diagnosticSummary = `${diagnosis.replace(/_/g, ' ')} | Corrected Na+ ${correctedNa} mEq/L | Effective Osm ${effectiveOsm} mOsm/kg | Anion Gap ${anionGap} mEq/L | Free Water Deficit ~${waterDeficit} L. ${potassiumGate.status === 'HOLD_INSULIN_CRITICAL' ? '⚠️ INSULIN CONTRAINDICATED (HYPOKALEMIA)' : 'Insulin Infusion Permitted'}.`;

  return {
    diagnosis,
    correctedSodiumMeqL: correctedNa,
    effectiveOsmolalityMOsmKg: effectiveOsm,
    totalOsmolalityMOsmKg: totalOsm,
    anionGapMeqL: anionGap,
    waterDeficitLiters: waterDeficit,
    potassiumGateStatus: potassiumGate.status,
    potassiumGateAction: potassiumGate.action,
    totalInfusionRateMlH: twoBag.totalRateMlH,
    deliveredDextrosePercent: twoBag.deliveredDextrosePercent,
    dextroseDeliveryRateGH: twoBag.dextroseDeliveryRateGH,
    twoBagRecommendation: twoBag.recommendation,
    cerebralEdemaRiskLevel: cerebralEdema.level,
    cerebralEdemaWarning: cerebralEdema.warning,
    cerebralEdemaRescueTreatment: cerebralEdema.rescueTreatment,
    isDkaResolved: resolution.isResolved,
    resolutionCriteriaPassed: resolution.passedCriteria,
    subcutaneousBridgeRecommendation: resolution.subqBridgeGuidance,
    diagnosticSummary,
  };
}
