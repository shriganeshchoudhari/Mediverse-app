/**
 * EndocrineClampEngine.ts
 * Biophysical Simulation Engine for Hyperinsulinemic-Euglycemic & Hyperglycemic Clamp Dynamics
 * 
 * Implements:
 * 1. DeFronzo Hyperinsulinemic-Euglycemic Clamp (Gold Standard Whole-Body Insulin Sensitivity)
 * 2. Glucose Infusion Rate (GIR / M-value, mg/kg/min) & Insulin Sensitivity Index (M/I ratio)
 * 3. HOMA2-IR, HOMA2-Beta, and QUICKI Mathematical Solvers
 * 4. Bergman Minimal Model Disposition Index (DI = S_I * AIRg)
 * 5. Diabetic Ketoacidosis (DKA) / HHS Insulin-Dextrose Titration & Anion Gap Closure Logic
 * 6. 8 Validated Clinical Presets across the Metabolic Spectrum
 * 
 * Location: frontend/.gemini/skills/EndocrineClampEngine.ts
 */

export type ClampType = 'EUGYLCEMIC_HYPERINSULINEMIC' | 'HYPERGLYCEMIC' | 'DKA_HHS_RESUSCITATION';

export type InsulinResistanceGrade =
  | 'HIGHLY_SENSITIVE_ATHLETE'
  | 'NORMAL_INSULIN_SENSITIVE'
  | 'MILD_INSULIN_RESISTANCE'
  | 'MODERATE_METABOLIC_SYNDROME'
  | 'SEVERE_T2DM_RESISTANCE'
  | 'EXTREME_RECEPTOR_MUTATION';

export type EndocrinePresetId =
  | 'LEAN_HEALTHY_INSULIN_SENSITIVE'
  | 'METABOLIC_SYNDROME_INSULIN_RESISTANT'
  | 'TYPE_2_DIABETES_BETA_CELL_FAILURE'
  | 'ATHLETE_SUPRA_SENSITIVE'
  | 'TYPE_1_DIABETES_ABSOLUTE_DEFICIENCY'
  | 'SEVERE_ACUTE_DKA_PROTOCOL'
  | 'INSULINOMA_HYPOGLYCEMIC_CRISIS'
  | 'PCOS_HYPERANDROGENIC_RESISTANCE';

export interface ClampTimepoint {
  minute: number;
  glucoseMgDl: number;
  girMgKgMin: number;
  insulinUuMl: number;
  cPeptideNgMl: number;
}

export interface PatientAnthropometrics {
  weightKg: number;
  heightCm: number;
  sex: 'M' | 'F';
  ageYears: number;
  fastingGlucoseMgDl: number;
  fastingInsulinUuMl: number;
  fastingCPeptideNgMl: number;
}

export interface DkaHhsLabs {
  arterialPh: number;
  bicarbonateMeqL: number;
  betaHydroxybutyrateMmolL: number;
  anionGap: number;
  potassiumMeqL: number;
  serumOsmolalityMOsmKg: number;
}

export interface ClampInputParams {
  presetId: EndocrinePresetId;
  patient: PatientAnthropometrics;
  clampType: ClampType;
  targetGlucoseMgDl: number;
  insulinInfusionRateMuKgMin: number; // mU/kg/min (standard 1.0 mU/kg/min = 40 mU/m^2/min)
  dextroseConcentrationPct: number; // typically 20% D20W
  dextroseInfusionRateMlHr: number;
  elapsedMinutes: number; // 0 to 120-150 min
  timeSeries: ClampTimepoint[];
  dkaLabs: DkaHhsLabs;
}

export interface DkaResolutionMetrics {
  isAnionGapClosed: boolean;
  isBetaHydroxybutyrateNormal: boolean;
  isGlucoseControlled: boolean;
  isReadyForSubQTransition: boolean;
  recommendation: string;
}

export interface EndocrineClampState {
  bmi: number;
  bsaM2: number;
  steadyStateMValue: number; // mg/kg/min (GIR at steady-state min 60-120)
  metabolicClearanceRateGlucose: number; // mL/kg/min = M / G * 100
  insulinSensitivityIndexMI: number; // (mg/kg/min) / (uU/mL) * 100
  homaIR: number;
  homaBetaPct: number;
  quickiIndex: number;
  acuteInsulinResponseAIRg: number; // uU/mL * min
  dispositionIndex: number; // M * AIRg
  hepaticGlucoseSuppressionPct: number; // % suppression of EGP
  insulinResistanceGrade: InsulinResistanceGrade;
  dkaMetrics: DkaResolutionMetrics;
  activeAlarms: string[];
  clinicalGuidance: string;
  protocolRecommendations: string[];
}

/**
 * Calculate Mosteller Body Surface Area (BSA) in m^2
 * BSA = sqrt((Height_cm * Weight_kg) / 3600)
 */
export function calculateBSA(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 1.73;
  return parseFloat(Math.sqrt((heightCm * weightKg) / 3600).toFixed(2));
}

/**
 * Calculate Body Mass Index (BMI) in kg/m^2
 */
export function calculateBMI(heightCm: number, weightKg: number): number {
  if (heightCm <= 0 || weightKg <= 0) return 22.0;
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(1));
}

/**
 * HOMA-IR (Homeostatic Model Assessment of Insulin Resistance)
 * Formula: (Fasting Glucose mg/dL * Fasting Insulin uU/mL) / 405
 * Normal: < 1.5; Insulin Resistant: > 2.5; Severe: > 4.0
 */
export function calculateHomaIR(glucoseMgDl: number, insulinUuMl: number): number {
  if (glucoseMgDl <= 0 || insulinUuMl <= 0) return 1.0;
  return parseFloat(((glucoseMgDl * insulinUuMl) / 405).toFixed(2));
}

/**
 * HOMA-Beta (% Beta-Cell Function)
 * Formula (mg/dL): (360 * Fasting Insulin uU/mL) / (Fasting Glucose mg/dL - 63) %
 * [Equivalent to (20 * Insulin) / (Glucose_mmol/L - 3.5)]
 * Normal: ~100%; Exhausted: < 30-50%; Hypersecretory: > 150%
 */
export function calculateHomaBeta(glucoseMgDl: number, insulinUuMl: number): number {
  if (glucoseMgDl <= 63 || insulinUuMl <= 0) return 100.0;
  const val = (360 * insulinUuMl) / (glucoseMgDl - 63);
  return parseFloat(Math.min(300, Math.max(0, val)).toFixed(1));
}

/**
 * QUICKI (Quantitative Insulin Sensitivity Check Index)
 * Formula: 1 / (log10(Fasting Insulin) + log10(Fasting Glucose))
 * Normal: > 0.35; Insulin Resistant: < 0.33
 */
export function calculateQUICKI(glucoseMgDl: number, insulinUuMl: number): number {
  if (glucoseMgDl <= 0 || insulinUuMl <= 0) return 0.38;
  const logG = Math.log10(glucoseMgDl);
  const logI = Math.log10(insulinUuMl);
  if (logG + logI <= 0) return 0.38;
  return parseFloat((1 / (logG + logI)).toFixed(3));
}

/**
 * Convert Dextrose Infusion Rate (mL/hr) of D20W to GIR (mg/kg/min)
 * D20W = 200 mg dextrose / mL = 0.20 g/mL
 * GIR (mg/kg/min) = (Rate_mL_hr * Concentration_mg_mL) / (Weight_kg * 60 min/hr)
 */
export function calculateGirFromInfusion(
  infusionRateMlHr: number,
  concentrationPct: number,
  weightKg: number
): number {
  if (weightKg <= 0 || infusionRateMlHr <= 0) return 0;
  const concentrationMgMl = concentrationPct * 10; // e.g. 20% -> 200 mg/mL
  const gir = (infusionRateMlHr * concentrationMgMl) / (weightKg * 60);
  return parseFloat(gir.toFixed(2));
}

/**
 * Evaluate DKA / HHS Resuscitation Resolution Criteria
 */
export function evaluateDkaResolution(
  glucoseMgDl: number,
  labs: DkaHhsLabs
): DkaResolutionMetrics {
  const isAnionGapClosed = labs.anionGap <= 12.0;
  const isBetaHydroxybutyrateNormal = labs.betaHydroxybutyrateMmolL < 0.6;
  const isGlucoseControlled = glucoseMgDl <= 200.0;
  const isPhAcceptable = labs.arterialPh >= 7.30 && labs.bicarbonateMeqL >= 18.0;

  const isReadyForSubQTransition =
    isAnionGapClosed && isGlucoseControlled && isPhAcceptable && isBetaHydroxybutyrateNormal;

  let recommendation = 'Continue IV Regular Insulin 0.1 U/kg/hr infusion.';
  if (glucoseMgDl <= 200 && !isAnionGapClosed) {
    recommendation =
      'CRITICAL DKA TRANSITION: Glucose <= 200 mg/dL with persistent Anion Gap. Add 5% or 10% Dextrose (D5W / D5 0.45% NS) to IV fluids and maintain insulin infusion to clear ketoacidosis without precipitating hypoglycemia or cerebral edema.';
  } else if (isReadyForSubQTransition) {
    recommendation =
      'DKA RESOLVED: Anion gap <= 12, venous pH > 7.30, HCO3 >= 18. Administer SubQ basal insulin (e.g. Glargine/Degludec) 2 hours BEFORE discontinuing IV insulin infusion to prevent rebound ketoacidosis.';
  } else if (labs.potassiumMeqL < 3.3) {
    recommendation =
      'HYPOKALEMIA ALERT: Serum K+ < 3.3 mEq/L. HOLD insulin infusion immediately and administer IV KCl 20-40 mEq/hr until K+ > 3.3 to avoid fatal cardiac arrhythmias.';
  }

  return {
    isAnionGapClosed,
    isBetaHydroxybutyrateNormal,
    isGlucoseControlled,
    isReadyForSubQTransition,
    recommendation,
  };
}

/**
 * Main Compute Function for Endocrine Clamp State
 */
export function computeEndocrineClampState(params: ClampInputParams): EndocrineClampState {
  const { patient, clampType, timeSeries, dkaLabs, dextroseInfusionRateMlHr, dextroseConcentrationPct } = params;

  // 1. Anthropometrics
  const bmi = calculateBMI(patient.heightCm, patient.weightKg);
  const bsaM2 = calculateBSA(patient.heightCm, patient.weightKg);

  // 2. Basal Fasting Indices
  const homaIR = calculateHomaIR(patient.fastingGlucoseMgDl, patient.fastingInsulinUuMl);
  const homaBetaPct = calculateHomaBeta(patient.fastingGlucoseMgDl, patient.fastingInsulinUuMl);
  const quickiIndex = calculateQUICKI(patient.fastingGlucoseMgDl, patient.fastingInsulinUuMl);

  // 3. Steady-State Clamp Analysis (minutes 60 to 120)
  // Steady state M value = mean GIR of points >= 60 min (or last available point if short)
  const steadyStatePoints = timeSeries.filter((pt) => pt.minute >= 60);
  let steadyStateMValue = 0;
  let steadyStateInsulin = patient.fastingInsulinUuMl;
  let steadyStateGlucose = patient.fastingGlucoseMgDl;

  if (steadyStatePoints.length > 0) {
    const sumGIR = steadyStatePoints.reduce((acc, curr) => acc + curr.girMgKgMin, 0);
    steadyStateMValue = parseFloat((sumGIR / steadyStatePoints.length).toFixed(2));

    const sumInsulin = steadyStatePoints.reduce((acc, curr) => acc + curr.insulinUuMl, 0);
    steadyStateInsulin = sumInsulin / steadyStatePoints.length;

    const sumGlucose = steadyStatePoints.reduce((acc, curr) => acc + curr.glucoseMgDl, 0);
    steadyStateGlucose = sumGlucose / steadyStatePoints.length;
  } else if (timeSeries.length > 0) {
    const lastPoint = timeSeries[timeSeries.length - 1];
    steadyStateMValue = lastPoint.girMgKgMin;
    steadyStateInsulin = lastPoint.insulinUuMl;
    steadyStateGlucose = lastPoint.glucoseMgDl;
  } else {
    // Calculated directly from current pump rate
    steadyStateMValue = calculateGirFromInfusion(dextroseInfusionRateMlHr, dextroseConcentrationPct, patient.weightKg);
  }

  // Metabolic Clearance Rate of Glucose (MCRg in mL/kg/min)
  // MCRg = M / SteadyStateGlucose * 100
  const metabolicClearanceRateGlucose =
    steadyStateGlucose > 0 ? parseFloat(((steadyStateMValue / steadyStateGlucose) * 100).toFixed(2)) : 0;

  // Insulin Sensitivity Index (M/I ratio in (mg/kg/min) / (uU/mL) * 100)
  const insulinSensitivityIndexMI =
    steadyStateInsulin > 0 ? parseFloat(((steadyStateMValue / steadyStateInsulin) * 100).toFixed(2)) : 0;

  // Acute Insulin Response (AIRg in uU/mL * min for Hyperglycemic clamp)
  // Sum of incremental insulin concentrations from 0 to 10 min
  const earlyPoints = timeSeries.filter((pt) => pt.minute >= 0 && pt.minute <= 10);
  let acuteInsulinResponseAIRg = 0;
  if (earlyPoints.length > 1) {
    const deltaInsulinSum = earlyPoints.reduce((acc, pt) => acc + Math.max(0, pt.insulinUuMl - patient.fastingInsulinUuMl), 0);
    acuteInsulinResponseAIRg = parseFloat((deltaInsulinSum * 2.5).toFixed(1));
  } else {
    acuteInsulinResponseAIRg = patient.fastingInsulinUuMl > 15 ? 45.0 : 180.0;
  }

  // Disposition Index (DI = M * AIRg or S_I * AIRg)
  const dispositionIndex = parseFloat((steadyStateMValue * acuteInsulinResponseAIRg).toFixed(1));

  // Hepatic Glucose Production Suppression % (normally > 85-95% suppressed at hyperinsulinemia > 60-80 uU/mL)
  let hepaticGlucoseSuppressionPct = 95.0;
  if (steadyStateInsulin < 30) {
    hepaticGlucoseSuppressionPct = parseFloat((steadyStateInsulin * 2.5).toFixed(1));
  } else if (homaIR > 4.0) {
    hepaticGlucoseSuppressionPct = 65.0; // severe hepatic insulin resistance
  } else if (homaIR > 2.5) {
    hepaticGlucoseSuppressionPct = 80.0;
  }

  // 4. Stratify Insulin Resistance Grade
  let insulinResistanceGrade: InsulinResistanceGrade = 'NORMAL_INSULIN_SENSITIVE';
  if (steadyStateMValue >= 11.0 && homaIR < 1.0) {
    insulinResistanceGrade = 'HIGHLY_SENSITIVE_ATHLETE';
  } else if (steadyStateMValue >= 7.5 && homaIR < 2.0) {
    insulinResistanceGrade = 'NORMAL_INSULIN_SENSITIVE';
  } else if (steadyStateMValue >= 5.0 || (homaIR >= 2.0 && homaIR < 3.0)) {
    insulinResistanceGrade = 'MILD_INSULIN_RESISTANCE';
  } else if (steadyStateMValue >= 3.0 || (homaIR >= 3.0 && homaIR < 5.0)) {
    insulinResistanceGrade = 'MODERATE_METABOLIC_SYNDROME';
  } else if (steadyStateMValue >= 1.5 || homaIR >= 5.0) {
    insulinResistanceGrade = 'SEVERE_T2DM_RESISTANCE';
  } else {
    insulinResistanceGrade = 'EXTREME_RECEPTOR_MUTATION';
  }

  // 5. DKA Resolution Evaluation
  const currentGlucose = timeSeries.length > 0 ? timeSeries[timeSeries.length - 1].glucoseMgDl : patient.fastingGlucoseMgDl;
  const dkaMetrics = evaluateDkaResolution(currentGlucose, dkaLabs);

  // 6. Alarms
  const activeAlarms: string[] = [];

  if (currentGlucose < 70) {
    activeAlarms.push('HYPOGLYCEMIA_CRITICAL_BELOW_70');
  } else if (currentGlucose > 300) {
    activeAlarms.push('SEVERE_HYPERGLYCEMIA_ABOVE_300');
  }

  if (dkaLabs.potassiumMeqL < 3.3) {
    activeAlarms.push('CRITICAL_HYPOKALEMIA_HOLD_INSULIN');
  } else if (dkaLabs.potassiumMeqL > 5.5) {
    activeAlarms.push('HYPERKALEMIA_MONITOR_ECG');
  }

  if (dkaLabs.anionGap > 16.0 && dkaLabs.arterialPh < 7.25) {
    activeAlarms.push('SEVERE_HIGH_ANION_GAP_KETOACIDOSIS');
  }

  if (steadyStateMValue < 3.5 && clampType === 'EUGYLCEMIC_HYPERINSULINEMIC') {
    activeAlarms.push('MARKED_PERIPHERAL_INSULIN_RESISTANCE');
  }

  if (homaBetaPct < 30.0) {
    activeAlarms.push('PANCREATIC_BETA_CELL_EXHAUSTION');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_CLAMP_EQUILIBRIUM');
  }

  // 7. Clinical Guidance & Recommendations
  let clinicalGuidance =
    'Clamp demonstrates physiological insulin sensitivity with normal peripheral glucose disposal and intact hepatic suppression.';
  const protocolRecommendations: string[] = [];

  if (clampType === 'DKA_HHS_RESUSCITATION') {
    clinicalGuidance = dkaMetrics.recommendation;
    protocolRecommendations.push(
      'Maintain IV Regular Insulin at 0.1 U/kg/hr; do not reduce insulin rate below 0.05 U/kg/hr until ketoacidosis resolves.',
      'Check capillary blood glucose every 1 hour and serum basic metabolic panel (BMP + venous blood gas) every 2 to 4 hours.',
      'Add 5% Dextrose (D5W / D5 0.45% NS) as soon as serum glucose drops below 200 mg/dL to prevent neuroglycopenia.'
    );
  } else if (clampType === 'EUGYLCEMIC_HYPERINSULINEMIC') {
    if (steadyStateMValue >= 8.0) {
      clinicalGuidance =
        'Excellent Whole-Body Insulin Sensitivity (M value >= 8.0 mg/kg/min). High muscle GLUT4 translocation capacity and vigorous hepatic glycogen synthase activation.';
      protocolRecommendations.push(
        'Maintain target euglycemia at 90-100 mg/dL with micro-titrations of 20% dextrose every 5 minutes.',
        'Low cardiometabolic risk profile; optimal glycemic control achievable with lifestyle or monotherapy.'
      );
    } else if (steadyStateMValue >= 4.5) {
      clinicalGuidance =
        'Moderate Insulin Resistance (M value 4.5–7.9 mg/kg/min). Predominantly skeletal muscle non-oxidative glucose storage impairment with compensatory hyperinsulinemia.';
      protocolRecommendations.push(
        'First-line Metformin (AMPK activator suppressing hepatic gluconeogenesis) + Lifestyle modification.',
        'Consider SGLT2 inhibitor or GLP-1 receptor agonist to enhance insulin sensitivity and promote weight loss.'
      );
    } else {
      clinicalGuidance =
        'Severe Peripheral Insulin Resistance (M value < 4.5 mg/kg/min). Profound post-receptor IRS-1/PI3K/Akt pathway defect, impaired GLUT4 vesicle fusion, and blunted hepatic suppression.';
      protocolRecommendations.push(
        'Dual or triple combination antidiabetic therapy (Metformin + SGLT2i + GLP-1 RA / GIP dual agonist).',
        'Assess for secondary lipodystrophy, severe visceral adiposity, or insulin receptor autoantibodies (Type B syndrome).'
      );
    }
  } else {
    // Hyperglycemic Clamp
    clinicalGuidance =
      'Hyperglycemic clamp assesses biphasic insulin secretion. First-phase acute insulin response (AIRg) reflects immediate release of docked granules; second phase reflects sustained de novo synthesis.';
    protocolRecommendations.push(
      'Blunted first-phase AIRg is the earliest pathognomonic defect in progression from prediabetes to overt T2DM.',
      'Disposition Index (DI = M * AIRg) quantifies beta-cell compensation for underlying insulin resistance.'
    );
  }

  return {
    bmi,
    bsaM2,
    steadyStateMValue,
    metabolicClearanceRateGlucose,
    insulinSensitivityIndexMI,
    homaIR,
    homaBetaPct,
    quickiIndex,
    acuteInsulinResponseAIRg,
    dispositionIndex,
    hepaticGlucoseSuppressionPct,
    insulinResistanceGrade,
    dkaMetrics,
    activeAlarms,
    clinicalGuidance,
    protocolRecommendations,
  };
}

/**
 * 8 Standard Validated Clinical Presets
 */
export const ENDOCRINE_PRESETS: Record<
  EndocrinePresetId,
  {
    title: string;
    description: string;
    initialState: ClampInputParams;
  }
> = {
  LEAN_HEALTHY_INSULIN_SENSITIVE: {
    title: 'Lean Healthy Individual (High Insulin Sensitivity)',
    description: '25-year-old healthy volunteer (BMI 21.8). High steady-state glucose disposal (M = 9.8 mg/kg/min), normal HOMA-IR (0.9), and rapid 95% suppression of hepatic glucose output.',
    initialState: {
      presetId: 'LEAN_HEALTHY_INSULIN_SENSITIVE',
      patient: { weightKg: 70, heightCm: 178, sex: 'M', ageYears: 25, fastingGlucoseMgDl: 86, fastingInsulinUuMl: 4.2, fastingCPeptideNgMl: 1.2 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 95,
      insulinInfusionRateMuKgMin: 1.0,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 206, // ~9.8 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 86, girMgKgMin: 0.0, insulinUuMl: 4.2, cPeptideNgMl: 1.2 },
        { minute: 15, glucoseMgDl: 92, girMgKgMin: 3.2, insulinUuMl: 68.0, cPeptideNgMl: 0.8 },
        { minute: 30, glucoseMgDl: 94, girMgKgMin: 6.5, insulinUuMl: 85.0, cPeptideNgMl: 0.4 },
        { minute: 60, glucoseMgDl: 95, girMgKgMin: 9.6, insulinUuMl: 88.0, cPeptideNgMl: 0.2 },
        { minute: 90, glucoseMgDl: 96, girMgKgMin: 9.9, insulinUuMl: 90.0, cPeptideNgMl: 0.1 },
        { minute: 120, glucoseMgDl: 95, girMgKgMin: 9.8, insulinUuMl: 89.0, cPeptideNgMl: 0.1 },
      ],
      dkaLabs: { arterialPh: 7.41, bicarbonateMeqL: 24, betaHydroxybutyrateMmolL: 0.1, anionGap: 10, potassiumMeqL: 4.2, serumOsmolalityMOsmKg: 288 },
    },
  },

  METABOLIC_SYNDROME_INSULIN_RESISTANT: {
    title: 'Metabolic Syndrome & Impaired Fasting Glucose',
    description: '48-year-old male with visceral adiposity (BMI 31.2, waist 104 cm). Reduced glucose disposal (M = 4.2 mg/kg/min), elevated HOMA-IR (3.8), and compensatory hyperinsulinemia.',
    initialState: {
      presetId: 'METABOLIC_SYNDROME_INSULIN_RESISTANT',
      patient: { weightKg: 95, heightCm: 174, sex: 'M', ageYears: 48, fastingGlucoseMgDl: 112, fastingInsulinUuMl: 18.5, fastingCPeptideNgMl: 3.6 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 95,
      insulinInfusionRateMuKgMin: 1.0,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 120, // ~4.2 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 112, girMgKgMin: 0.0, insulinUuMl: 18.5, cPeptideNgMl: 3.6 },
        { minute: 15, glucoseMgDl: 105, girMgKgMin: 1.5, insulinUuMl: 82.0, cPeptideNgMl: 2.8 },
        { minute: 30, glucoseMgDl: 98, girMgKgMin: 2.8, insulinUuMl: 96.0, cPeptideNgMl: 1.9 },
        { minute: 60, glucoseMgDl: 96, girMgKgMin: 4.1, insulinUuMl: 102.0, cPeptideNgMl: 1.2 },
        { minute: 90, glucoseMgDl: 94, girMgKgMin: 4.3, insulinUuMl: 105.0, cPeptideNgMl: 0.9 },
        { minute: 120, glucoseMgDl: 95, girMgKgMin: 4.2, insulinUuMl: 104.0, cPeptideNgMl: 0.8 },
      ],
      dkaLabs: { arterialPh: 7.39, bicarbonateMeqL: 23, betaHydroxybutyrateMmolL: 0.2, anionGap: 11, potassiumMeqL: 4.4, serumOsmolalityMOsmKg: 294 },
    },
  },

  TYPE_2_DIABETES_BETA_CELL_FAILURE: {
    title: 'Type 2 Diabetes (Severe Resistance & Beta-Cell Failure)',
    description: '56-year-old female with longstanding T2DM (BMI 34.0, HbA1c 9.4%). Profoundly reduced GIR (M = 2.1 mg/kg/min), blunted HOMA-Beta (26%), and failed hepatic glucose suppression.',
    initialState: {
      presetId: 'TYPE_2_DIABETES_BETA_CELL_FAILURE',
      patient: { weightKg: 92, heightCm: 164, sex: 'F', ageYears: 56, fastingGlucoseMgDl: 186, fastingInsulinUuMl: 8.5, fastingCPeptideNgMl: 1.1 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 100,
      insulinInfusionRateMuKgMin: 1.5,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 58, // ~2.1 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 186, girMgKgMin: 0.0, insulinUuMl: 8.5, cPeptideNgMl: 1.1 },
        { minute: 15, glucoseMgDl: 165, girMgKgMin: 0.6, insulinUuMl: 75.0, cPeptideNgMl: 0.9 },
        { minute: 30, glucoseMgDl: 138, girMgKgMin: 1.2, insulinUuMl: 92.0, cPeptideNgMl: 0.7 },
        { minute: 60, glucoseMgDl: 108, girMgKgMin: 2.0, insulinUuMl: 110.0, cPeptideNgMl: 0.5 },
        { minute: 90, glucoseMgDl: 101, girMgKgMin: 2.2, insulinUuMl: 115.0, cPeptideNgMl: 0.4 },
        { minute: 120, glucoseMgDl: 99, girMgKgMin: 2.1, insulinUuMl: 114.0, cPeptideNgMl: 0.4 },
      ],
      dkaLabs: { arterialPh: 7.38, bicarbonateMeqL: 22, betaHydroxybutyrateMmolL: 0.3, anionGap: 12, potassiumMeqL: 4.5, serumOsmolalityMOsmKg: 302 },
    },
  },

  ATHLETE_SUPRA_SENSITIVE: {
    title: 'Elite Endurance Triathlete (Supra-Normal Sensitivity)',
    description: '28-year-old marathoner (BMI 19.8, VO2max 72 mL/kg/min). Massive glucose disposal (M = 13.5 mg/kg/min), ultra-low fasting insulin (2.4 uU/mL), and extreme GLUT4 muscle density.',
    initialState: {
      presetId: 'ATHLETE_SUPRA_SENSITIVE',
      patient: { weightKg: 64, heightCm: 180, sex: 'M', ageYears: 28, fastingGlucoseMgDl: 82, fastingInsulinUuMl: 2.4, fastingCPeptideNgMl: 0.8 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 90,
      insulinInfusionRateMuKgMin: 1.0,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 259, // ~13.5 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 82, girMgKgMin: 0.0, insulinUuMl: 2.4, cPeptideNgMl: 0.8 },
        { minute: 15, glucoseMgDl: 88, girMgKgMin: 5.2, insulinUuMl: 62.0, cPeptideNgMl: 0.4 },
        { minute: 30, glucoseMgDl: 91, girMgKgMin: 9.8, insulinUuMl: 78.0, cPeptideNgMl: 0.2 },
        { minute: 60, glucoseMgDl: 90, girMgKgMin: 13.2, insulinUuMl: 82.0, cPeptideNgMl: 0.1 },
        { minute: 90, glucoseMgDl: 89, girMgKgMin: 13.8, insulinUuMl: 84.0, cPeptideNgMl: 0.1 },
        { minute: 120, glucoseMgDl: 90, girMgKgMin: 13.5, insulinUuMl: 83.0, cPeptideNgMl: 0.1 },
      ],
      dkaLabs: { arterialPh: 7.42, bicarbonateMeqL: 25, betaHydroxybutyrateMmolL: 0.1, anionGap: 9, potassiumMeqL: 4.1, serumOsmolalityMOsmKg: 286 },
    },
  },

  TYPE_1_DIABETES_ABSOLUTE_DEFICIENCY: {
    title: 'Type 1 Diabetes (Undetectable C-Peptide, Preserved Muscle M)',
    description: '21-year-old with autoimmune T1DM. Undetectable C-peptide (<0.1 ng/mL), absent endogenous insulin, but normal peripheral muscle sensitivity when exogenous insulin is provided (M = 7.4 mg/kg/min).',
    initialState: {
      presetId: 'TYPE_1_DIABETES_ABSOLUTE_DEFICIENCY',
      patient: { weightKg: 68, heightCm: 172, sex: 'F', ageYears: 21, fastingGlucoseMgDl: 142, fastingInsulinUuMl: 1.0, fastingCPeptideNgMl: 0.05 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 95,
      insulinInfusionRateMuKgMin: 1.0,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 151, // ~7.4 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 142, girMgKgMin: 0.0, insulinUuMl: 1.0, cPeptideNgMl: 0.05 },
        { minute: 15, glucoseMgDl: 120, girMgKgMin: 2.1, insulinUuMl: 65.0, cPeptideNgMl: 0.05 },
        { minute: 30, glucoseMgDl: 104, girMgKgMin: 4.8, insulinUuMl: 80.0, cPeptideNgMl: 0.05 },
        { minute: 60, glucoseMgDl: 96, girMgKgMin: 7.2, insulinUuMl: 85.0, cPeptideNgMl: 0.05 },
        { minute: 90, glucoseMgDl: 94, girMgKgMin: 7.6, insulinUuMl: 87.0, cPeptideNgMl: 0.05 },
        { minute: 120, glucoseMgDl: 95, girMgKgMin: 7.4, insulinUuMl: 86.0, cPeptideNgMl: 0.05 },
      ],
      dkaLabs: { arterialPh: 7.40, bicarbonateMeqL: 24, betaHydroxybutyrateMmolL: 0.2, anionGap: 10, potassiumMeqL: 4.3, serumOsmolalityMOsmKg: 290 },
    },
  },

  SEVERE_ACUTE_DKA_PROTOCOL: {
    title: 'Severe Diabetic Ketoacidosis (DKA Infusion & Anion Gap)',
    description: '19-year-old presenting with acute DKA: Blood glucose 480 mg/dL, arterial pH 7.14, HCO3 8 mEq/L, Anion Gap 24, beta-hydroxybutyrate 6.2 mmol/L. Requires 0.1 U/kg/hr insulin + D5 transition.',
    initialState: {
      presetId: 'SEVERE_ACUTE_DKA_PROTOCOL',
      patient: { weightKg: 65, heightCm: 170, sex: 'M', ageYears: 19, fastingGlucoseMgDl: 480, fastingInsulinUuMl: 1.2, fastingCPeptideNgMl: 0.1 },
      clampType: 'DKA_HHS_RESUSCITATION',
      targetGlucoseMgDl: 150,
      insulinInfusionRateMuKgMin: 1.67, // 0.1 U/kg/hr = ~1.67 mU/kg/min
      dextroseConcentrationPct: 5,
      dextroseInfusionRateMlHr: 100,
      elapsedMinutes: 60,
      timeSeries: [
        { minute: 0, glucoseMgDl: 480, girMgKgMin: 0.0, insulinUuMl: 1.2, cPeptideNgMl: 0.1 },
        { minute: 15, glucoseMgDl: 440, girMgKgMin: 0.0, insulinUuMl: 95.0, cPeptideNgMl: 0.1 },
        { minute: 30, glucoseMgDl: 390, girMgKgMin: 0.0, insulinUuMl: 110.0, cPeptideNgMl: 0.1 },
        { minute: 45, glucoseMgDl: 340, girMgKgMin: 0.0, insulinUuMl: 115.0, cPeptideNgMl: 0.1 },
        { minute: 60, glucoseMgDl: 290, girMgKgMin: 0.0, insulinUuMl: 118.0, cPeptideNgMl: 0.1 },
      ],
      dkaLabs: { arterialPh: 7.14, bicarbonateMeqL: 8, betaHydroxybutyrateMmolL: 6.2, anionGap: 24, potassiumMeqL: 4.8, serumOsmolalityMOsmKg: 318 },
    },
  },

  INSULINOMA_HYPOGLYCEMIC_CRISIS: {
    title: 'Pancreatic Neuroendocrine Tumor (Insulinoma Whipple Triad)',
    description: '42-year-old female presenting with neuroglycopenia (confusion, diaphoresis) and Whipple triad. Fasting blood glucose 38 mg/dL with inappropriately elevated insulin (34 uU/mL) and C-peptide (4.8 ng/mL).',
    initialState: {
      presetId: 'INSULINOMA_HYPOGLYCEMIC_CRISIS',
      patient: { weightKg: 62, heightCm: 165, sex: 'F', ageYears: 42, fastingGlucoseMgDl: 38, fastingInsulinUuMl: 34.0, fastingCPeptideNgMl: 4.8 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 90,
      insulinInfusionRateMuKgMin: 0.0, // Autonomous endogenous secretion
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 180, // Heavy dextrose required just to stay alive
      elapsedMinutes: 60,
      timeSeries: [
        { minute: 0, glucoseMgDl: 38, girMgKgMin: 0.0, insulinUuMl: 34.0, cPeptideNgMl: 4.8 },
        { minute: 15, glucoseMgDl: 52, girMgKgMin: 6.2, insulinUuMl: 38.0, cPeptideNgMl: 5.1 },
        { minute: 30, glucoseMgDl: 68, girMgKgMin: 8.5, insulinUuMl: 42.0, cPeptideNgMl: 5.4 },
        { minute: 60, glucoseMgDl: 86, girMgKgMin: 9.7, insulinUuMl: 40.0, cPeptideNgMl: 5.2 },
      ],
      dkaLabs: { arterialPh: 7.42, bicarbonateMeqL: 25, betaHydroxybutyrateMmolL: 0.05, anionGap: 10, potassiumMeqL: 3.8, serumOsmolalityMOsmKg: 284 },
    },
  },

  PCOS_HYPERANDROGENIC_RESISTANCE: {
    title: 'Polycystic Ovary Syndrome (PCOS & Acanthosis Nigricans)',
    description: '24-year-old female with oligomenorrhea, hirsutism, and acanthosis nigricans (BMI 29.4). Marked peripheral insulin resistance (M = 3.6 mg/kg/min), elevated HOMA-IR (4.4), and impaired non-oxidative glucose disposal.',
    initialState: {
      presetId: 'PCOS_HYPERANDROGENIC_RESISTANCE',
      patient: { weightKg: 80, heightCm: 165, sex: 'F', ageYears: 24, fastingGlucoseMgDl: 98, fastingInsulinUuMl: 18.2, fastingCPeptideNgMl: 3.4 },
      clampType: 'EUGYLCEMIC_HYPERINSULINEMIC',
      targetGlucoseMgDl: 95,
      insulinInfusionRateMuKgMin: 1.0,
      dextroseConcentrationPct: 20,
      dextroseInfusionRateMlHr: 86, // ~3.6 mg/kg/min
      elapsedMinutes: 120,
      timeSeries: [
        { minute: 0, glucoseMgDl: 98, girMgKgMin: 0.0, insulinUuMl: 18.2, cPeptideNgMl: 3.4 },
        { minute: 15, glucoseMgDl: 96, girMgKgMin: 1.2, insulinUuMl: 84.0, cPeptideNgMl: 2.6 },
        { minute: 30, glucoseMgDl: 95, girMgKgMin: 2.4, insulinUuMl: 98.0, cPeptideNgMl: 1.8 },
        { minute: 60, glucoseMgDl: 94, girMgKgMin: 3.5, insulinUuMl: 106.0, cPeptideNgMl: 1.1 },
        { minute: 90, glucoseMgDl: 95, girMgKgMin: 3.7, insulinUuMl: 108.0, cPeptideNgMl: 0.9 },
        { minute: 120, glucoseMgDl: 95, girMgKgMin: 3.6, insulinUuMl: 107.0, cPeptideNgMl: 0.8 },
      ],
      dkaLabs: { arterialPh: 7.41, bicarbonateMeqL: 24, betaHydroxybutyrateMmolL: 0.1, anionGap: 10, potassiumMeqL: 4.2, serumOsmolalityMOsmKg: 290 },
    },
  },
};
