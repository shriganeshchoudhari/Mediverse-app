/**
 * TransfusionReactionEngine.ts
 *
 * Biophysical Simulation Engine for Acute Hemolytic Transfusion Reaction (AHTR)
 * and the TRALI vs TACO Differential Diagnosis & Management:
 * ABO Incompatibility & Intravascular Hemolysis (Coombs/DAT, Haptoglobin, Plasma Heme, DIC),
 * Pigment Nephropathy & Forced Alkaline Diuresis (UOP >= 1.0-2.0 mL/kg/hr),
 * TRALI (Non-Cardiogenic Exudative Permeability Edema, Anti-HLA/HNA, Protein Ratio > 0.65, Diuretic Contraindication),
 * TACO (Hydrostatic Volume Overload, BNP surge > 1.5x, PCWP > 18 mmHg, Hypertension, Loop Diuretics),
 * Anaphylaxis in IgA Deficiency, and Immediate Bedside Stop-Transfusion Protocols.
 *
 * Location: frontend/.gemini/skills/TransfusionReactionEngine.ts
 */

export type TransfusionReactionType =
  | 'ACUTE_HEMOLYTIC_ABO'
  | 'TRALI_IMMUNE_LUNG_INJURY'
  | 'TACO_CIRCULATORY_OVERLOAD'
  | 'FEBRILE_NON_HEMOLYTIC_FNHTR'
  | 'ANAPHYLAXIS_IGA_DEFICIENCY'
  | 'TRANSFUSION_SEPSIS_BACTERIAL';

export type BloodProductType =
  | 'PRBC_PACKED_RED_CELLS'
  | 'FFP_FRESH_FROZEN_PLASMA'
  | 'PLATELETS_APHERESIS'
  | 'CRYOPRECIPITATE';

export type TransfusionAction =
  | 'CONTINUE_TRANSFUSION'
  | 'STOP_TRANSFUSION_DISCONNECT_TUBING'
  | 'STOP_AND_FLUSH_TUBING_HAZARD';

export interface TransfusionParams {
  reactionType: TransfusionReactionType;
  bloodProduct: BloodProductType;
  volumeInfusedMl: number; // e.g. 50 to 500 mL
  infusionRateMlPerHour: number; // e.g. 100 to 500 mL/hr
  patientAction: TransfusionAction;
  furosemideDoseMg: number; // 0 to 80 mg
  ivSalineBolusMl: number; // 0 to 2000 mL
  sodiumBicarbAdministered: boolean; // For urine alkalinization
  epinephrineAdministered: boolean; // For anaphylaxis / shock
  preExistingCardiacFailure: boolean; // EF < 35% or CHF history
  patientWeightKg: number;
}

export interface TransfusionResult {
  temperatureCelsius: number;
  systolicBp: number;
  diastolicBp: number;
  meanArterialPressure: number;
  heartRate: number;
  centralVenousPressureMmHg: number;
  pulmonaryCapillaryWedgePressureMmHg: number;
  bnpPgPerMl: number;
  spO2Percent: number;
  paO2FiO2Ratio: number;
  lungInfiltrates: 'CLEAR' | 'BILATERAL_EXUDATIVE_PERMEABILITY' | 'BILATERAL_HYDROSTATIC_KERLEY_B';
  edemaFluidPlasmaProteinRatio: number; // >0.65 in TRALI (exudate), <0.50 in TACO (transudate)
  directAntiglobulinTest: 'NEGATIVE' | 'POSITIVE_IGG_C3D';
  serumFreeHemoglobinMgPerDl: number; // normal < 5, hemolysis > 50
  serumHaptoglobinMgPerDl: number; // normal 30-200, hemolysis < 10
  plasmaAppearance: 'CLEAR_STRAW' | 'PINK_HEMOLYSIS' | 'DARK_BURGUNDY';
  urineColor: 'NORMAL_AMBER' | 'PINK' | 'DARK_RED_COCA_COLA';
  potassiumMeqPerL: number;
  dicScore: number; // 0-8 ISTH DIC score
  urineOutputMlPerHour: number;
  acuteKidneyInjuryRisk: 'LOW' | 'MODERATE' | 'SEVERE_ANURIC_ATN';
  diureticResponse: 'APPROPRIATE_TACO_RELIEF' | 'LETHAL_TRALI_HYPOVOLEMIC_CRASH' | 'NEUTRAL';
  clericalCheckConfirmed: boolean;
  immediateSafetyScore: number;
  criticalAlerts: string[];
  clinicalRecommendations: string[];
}

/**
 * Evaluates transfusion reaction biophysics: AHTR intravascular lysis & nephrotoxicity,
 * the TRALI vs TACO differential matrix, and acute resuscitation maneuvers.
 */
export function simulateTransfusionReaction(params: TransfusionParams): TransfusionResult {
  const {
    reactionType,
    volumeInfusedMl,
    infusionRateMlPerHour,
    patientAction,
    furosemideDoseMg,
    ivSalineBolusMl,
    sodiumBicarbAdministered,
    epinephrineAdministered,
    preExistingCardiacFailure,
    patientWeightKg = 70,
  } = params;

  const alerts: string[] = [];
  const recommendations: string[] = [];

  // 1. Immediate Bedside Protocol Check
  if (patientAction === 'CONTINUE_TRANSFUSION') {
    alerts.push(
      'LETHAL DELAY: Transfusion was NOT stopped! Immediate cessation of blood infusion is mandatory for any acute transfusion reaction.'
    );
  } else if (patientAction === 'STOP_AND_FLUSH_TUBING_HAZARD') {
    alerts.push(
      'TUBING FLUSH DISASTER: Clinician flushed the remaining blood in the infusion line into the patient! Blood tubing must be detached at the catheter hub immediately.'
    );
  }

  // 2. Hemodynamic & Laboratory Parameters Initialization
  let tempC = 37.0;
  let sbp = 120;
  let dbp = 80;
  let hr = 75;
  let cvp = 6.0;
  let pcwp = 10.0;
  let bnp = 110;
  let spO2 = 98;
  let pfRatio = 450;
  let lungInfiltrates: 'CLEAR' | 'BILATERAL_EXUDATIVE_PERMEABILITY' | 'BILATERAL_HYDROSTATIC_KERLEY_B' = 'CLEAR';
  let proteinRatio = 0.40;
  let datResult: 'NEGATIVE' | 'POSITIVE_IGG_C3D' = 'NEGATIVE';
  let serumFreeHb = 3.0;
  let serumHaptoglobin = 120;
  let plasmaColor: 'CLEAR_STRAW' | 'PINK_HEMOLYSIS' | 'DARK_BURGUNDY' = 'CLEAR_STRAW';
  let urineColor: 'NORMAL_AMBER' | 'PINK' | 'DARK_RED_COCA_COLA' = 'NORMAL_AMBER';
  let potassium = 4.2;
  let dicScore = 0;
  let baseUop = patientWeightKg * 0.7; // ~50 mL/hr

  // 3. Reaction-Specific Pathophysiology
  switch (reactionType) {
    case 'ACUTE_HEMOLYTIC_ABO': {
      datResult = 'POSITIVE_IGG_C3D';
      tempC = 39.2;
      hr = 125;
      sbp = 85;
      dbp = 45;
      cvp = 4.0;

      // Severity correlates with volume infused:
      const lysisFactor = Math.min(1.0, volumeInfusedMl / 250);
      serumFreeHb = Math.round(55 + lysisFactor * 120); // starts > 50 mg/dL up to 175 mg/dL
      serumHaptoglobin = Math.max(1, Math.round(8 - lysisFactor * 6)); // rapidly depleted to < 10 mg/dL
      potassium = Number((4.5 + lysisFactor * 2.2).toFixed(1)); // hyperkalemia up to 6.7 mEq/L
      dicScore = Math.min(8, Math.round(lysisFactor * 7));

      if (serumFreeHb > 80) {
        plasmaColor = 'DARK_BURGUNDY';
        urineColor = 'DARK_RED_COCA_COLA';
      } else if (serumFreeHb > 30) {
        plasmaColor = 'PINK_HEMOLYSIS';
        urineColor = 'DARK_RED_COCA_COLA';
      }

      alerts.push(
        'ACUTE HEMOLYTIC TRANSFUSION REACTION (ABO INCOMPATIBILITY): Intravascular hemolysis with positive DAT, haptoglobin depletion, hemoglobinuria, hyperkalemia, and DIC activation!'
      );
      break;
    }

    case 'TRALI_IMMUNE_LUNG_INJURY': {
      tempC = 38.6;
      hr = 115;
      sbp = 90; // Transient hypotension characteristic of TRALI
      dbp = 55;
      cvp = 5.0; // Normal or low CVP!
      pcwp = 11.0; // PCWP <= 18 mmHg (Non-cardiogenic pulmonary edema)
      bnp = 160; // Normal or minimal BNP elevation
      spO2 = 82;
      pfRatio = 145; // Severe ARDS-level hypoxemia
      lungInfiltrates = 'BILATERAL_EXUDATIVE_PERMEABILITY';
      proteinRatio = 0.78; // Exudative non-cardiogenic edema fluid (> 0.65)
      alerts.push(
        'TRALI CONFIRMED: Anti-HLA/HNA immune neutrophil activation causing high-permeability pulmonary capillaritis. Exudative protein ratio > 0.65 with normal PCWP (<= 18 mmHg).'
      );
      break;
    }

    case 'TACO_CIRCULATORY_OVERLOAD': {
      tempC = 37.1; // Typically afebrile (unlike TRALI)
      hr = 110;
      sbp = 175; // Hypertension & wide pulse pressure characteristic of TACO
      dbp = 95;
      cvp = 16.0; // Severe hydrostatic venous hypertension
      pcwp = 24.0; // PCWP > 18 mmHg (Cardiogenic / hydrostatic overload)
      bnp = preExistingCardiacFailure ? 1650 : 850; // Marked BNP surge > 1.5x baseline
      spO2 = 84;
      pfRatio = 180;
      lungInfiltrates = 'BILATERAL_HYDROSTATIC_KERLEY_B';
      proteinRatio = 0.38; // Transudative hydrostatic edema fluid (< 0.50)
      alerts.push(
        'TACO CONFIRMED: Hydrostatic circulatory volume overload. Elevated PCWP (> 18 mmHg), hypertension, marked BNP surge (> 1.5x), and Kerley B lines on chest radiography.'
      );
      break;
    }

    case 'FEBRILE_NON_HEMOLYTIC_FNHTR': {
      tempC = 38.4;
      hr = 95;
      sbp = 125;
      dbp = 80;
      alerts.push(
        'FEBRILE NON-HEMOLYTIC TRANSFUSION REACTION (FNHTR): Temperature rise >= 1°C from anti-leukocyte antibodies/cytokines. DAT negative and hemodynamics stable.'
      );
      break;
    }

    case 'ANAPHYLAXIS_IGA_DEFICIENCY': {
      tempC = 37.0;
      hr = 135;
      sbp = 70;
      dbp = 35;
      spO2 = 86;
      alerts.push(
        'SEVERE ANAPHYLAXIS (IgA DEFICIENCY): Sudden bronchospasm, angioedema, and distributive shock. Emergent IM Epinephrine 0.3-0.5 mg mandated!'
      );
      break;
    }

    case 'TRANSFUSION_SEPSIS_BACTERIAL': {
      tempC = 39.8;
      hr = 130;
      sbp = 75;
      dbp = 40;
      alerts.push(
        'TRANSFUSION-TRANSMITTED SEPSIS: High bacterial load in blood product (highest in platelets). Septic shock and rigors.'
      );
      break;
    }
  }

  // 4. Diuretic Response & The TRALI Fatal Trap
  let diureticResponse: 'APPROPRIATE_TACO_RELIEF' | 'LETHAL_TRALI_HYPOVOLEMIC_CRASH' | 'NEUTRAL' = 'NEUTRAL';

  if (furosemideDoseMg >= 20) {
    if (reactionType === 'TACO_CIRCULATORY_OVERLOAD') {
      diureticResponse = 'APPROPRIATE_TACO_RELIEF';
      pcwp -= 7.0;
      cvp -= 5.0;
      sbp -= 25;
      spO2 += 8;
      baseUop += furosemideDoseMg * 5;
    } else if (reactionType === 'TRALI_IMMUNE_LUNG_INJURY') {
      diureticResponse = 'LETHAL_TRALI_HYPOVOLEMIC_CRASH';
      sbp -= 35;
      dbp -= 20;
      hr += 25;
      cvp = 1.0;
      alerts.push(
        'CONTRAINDICATION DISASTER: Loop diuretic administered in TRALI! Patients with TRALI are already intravascularly depleted due to capillary leakage. Diuresis induces severe hypovolemic shock!'
      );
    }
  }

  // 5. Saline Hydration & Urine Output in AHTR (Pigment Nephropathy Prevention)
  let calculatedUop = baseUop;
  if (ivSalineBolusMl > 0) {
    calculatedUop += (ivSalineBolusMl / 500) * (patientWeightKg * 0.5);
    sbp += Math.min(25, (ivSalineBolusMl / 500) * 8);
  }

  let akiRisk: 'LOW' | 'MODERATE' | 'SEVERE_ANURIC_ATN' = 'LOW';
  if (reactionType === 'ACUTE_HEMOLYTIC_ABO') {
    const targetUop = patientWeightKg * 1.5; // ~100-140 mL/hr
    if (calculatedUop < targetUop) {
      akiRisk = 'SEVERE_ANURIC_ATN';
      alerts.push(
        'ACUTE TUBULAR NECROSIS THREAT: Urine output < 1.0-2.0 mL/kg/hr during acute intravascular hemolysis allows free hemoglobin precipitation in distal tubules!'
      );
    } else {
      akiRisk = 'MODERATE';
    }

    if (!sodiumBicarbAdministered) {
      alerts.push(
        'ALKALINIZATION OMISSION: Acidic tubular fluid converts free hemoglobin to insoluble ferrihemate. Administer Sodium Bicarbonate to alkalinize urine (pH > 7.0).'
      );
    }
  }

  // 6. Epinephrine in Anaphylaxis
  if (epinephrineAdministered && reactionType === 'ANAPHYLAXIS_IGA_DEFICIENCY') {
    sbp += 35;
    dbp += 20;
    hr -= 15;
    spO2 += 10;
  }

  // Clamping
  sbp = Math.max(40, Math.min(240, Math.round(sbp)));
  dbp = Math.max(20, Math.min(130, Math.round(dbp)));
  const map = Math.round(dbp + (sbp - dbp) / 3);
  hr = Math.max(30, Math.min(170, Math.round(hr)));
  spO2 = Math.max(50, Math.min(100, Math.round(spO2)));
  calculatedUop = Math.max(5, Math.min(600, Math.round(calculatedUop)));

  // 7. Safety Score Calculation
  let safetyScore = 100;
  if (patientAction === 'CONTINUE_TRANSFUSION') safetyScore -= 50;
  if (patientAction === 'STOP_AND_FLUSH_TUBING_HAZARD') safetyScore -= 45;
  if (diureticResponse === 'LETHAL_TRALI_HYPOVOLEMIC_CRASH') safetyScore -= 40;
  if (akiRisk === 'SEVERE_ANURIC_ATN') safetyScore -= 25;
  if (potassium >= 6.0) safetyScore -= 20;
  if (reactionType === 'ANAPHYLAXIS_IGA_DEFICIENCY' && !epinephrineAdministered) safetyScore -= 35;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // 8. Clinical Recommendations
  if (reactionType === 'ACUTE_HEMOLYTIC_ABO') {
    recommendations.push(
      'Aggressive IV crystalloid resuscitation to maintain urine output >= 1.0-2.0 mL/kg/hr (flushes nephrotoxic heme casts).'
    );
    recommendations.push(
      'IV Sodium Bicarbonate infusion to maintain urine pH > 7.0, preventing intratubular ferrihemate crystallization.'
    );
    recommendations.push(
      'Immediate treatment of hyperkalemia (IV Calcium Gluconate for membrane stabilization + Insulin/Dextrose).'
    );
  } else if (reactionType === 'TRALI_IMMUNE_LUNG_INJURY') {
    recommendations.push(
      'Lung-protective mechanical ventilation (6 mL/kg predicted body weight, PEEP titration) and supportive oxygenation.'
    );
    recommendations.push(
      'AVOID DIURETICS: Maintain euvolemia or gentle fluid support; diuresis precipitates profound cardiovascular collapse.'
    );
  } else if (reactionType === 'TACO_CIRCULATORY_OVERLOAD') {
    recommendations.push(
      'Place patient in upright sitting position and administer IV Furosemide (40-80 mg bolus) to reduce hydrostatic preload.'
    );
    recommendations.push(
      'Apply non-invasive positive pressure ventilation (CPAP/BiPAP) to decrease work of breathing and augment LV afterload reduction.'
    );
  } else if (reactionType === 'ANAPHYLAXIS_IGA_DEFICIENCY') {
    recommendations.push(
      'Administer Epinephrine 0.3-0.5 mg IM (anterolateral thigh) immediately. Repeat every 5-15 minutes as needed.'
    );
    recommendations.push(
      'For future transfusions, provide exclusively washed RBCs or blood products from confirmed IgA-deficient donors.'
    );
  }

  return {
    temperatureCelsius: Number(tempC.toFixed(1)),
    systolicBp: sbp,
    diastolicBp: dbp,
    meanArterialPressure: map,
    heartRate: hr,
    centralVenousPressureMmHg: Number(cvp.toFixed(1)),
    pulmonaryCapillaryWedgePressureMmHg: Number(pcwp.toFixed(1)),
    bnpPgPerMl: Math.round(bnp),
    spO2Percent: spO2,
    paO2FiO2Ratio: Math.round(pfRatio),
    lungInfiltrates,
    edemaFluidPlasmaProteinRatio: Number(proteinRatio.toFixed(2)),
    directAntiglobulinTest: datResult,
    serumFreeHemoglobinMgPerDl: serumFreeHb,
    serumHaptoglobinMgPerDl: serumHaptoglobin,
    plasmaAppearance: plasmaColor,
    urineColor,
    potassiumMeqPerL: potassium,
    dicScore,
    urineOutputMlPerHour: calculatedUop,
    acuteKidneyInjuryRisk: akiRisk,
    diureticResponse,
    clericalCheckConfirmed: patientAction === 'STOP_TRANSFUSION_DISCONNECT_TUBING',
    immediateSafetyScore: safetyScore,
    criticalAlerts: alerts,
    clinicalRecommendations: recommendations,
  };
}
