/**
 * TegHemostasisEngine.ts
 * Biophysical Simulation Engine for Thromboelastography (TEG) and Rotational Thromboelastometry (ROTEM)
 * 
 * Implements:
 * 1. Viscoelastic clot formation dynamics (R, K, alpha-angle, MA, G-value, LY30)
 * 2. ROTEM parallel differential assays (EXTEM, INTEM, FIBTEM, HEPTEM, APTEM)
 * 3. Targeted transfusion algorithm (Cryoprecipitate, Platelets, FFP/PCC, TXA, Protamine)
 * 4. Lethal Triad of Trauma (Hypothermia, Acidosis, Coagulopathy)
 * 5. 8 Validated Clinical Presets across the Hemostasis Spectrum
 * 
 * Location: frontend/.gemini/skills/TegHemostasisEngine.ts
 */

export type TegParameterStatus = 'LOW' | 'NORMAL' | 'HIGH';

export type HemostasisPhenotype =
  | 'NORMAL_PHYSIOLOGICAL'
  | 'COAGULATION_FACTOR_DEFICIENCY'
  | 'HYPOFIBRINOGENEMIA'
  | 'THROMBOCYTOPENIA_PLATELET_DYSFUNCTION'
  | 'PRIMARY_HYPERFIBRINOLYSIS'
  | 'HYPERFIBRINOLYSIS'
  | 'HEPARIN_EFFECT'
  | 'HYPERCOAGULABLE_PROTHROMBOTIC'
  | 'DILUTIONAL_TRAUMA_TRIAD';

export type TegPresetId =
  | 'NORMAL_PHYSIOLOGICAL_HEMOSTASIS'
  | 'SEVERE_HYPOFIBRINOGENEMIA_MASSIVE_HEMORRHAGE'
  | 'THROMBOCYTOPENIA_OR_TICP'
  | 'PRIMARY_HYPERFIBRINOLYSIS_TRAUMA'
  | 'SYSTEMIC_HEPARIN_EFFECT_POST_CPB'
  | 'FACTOR_DEFICIENCY_COAGULOPATHY_CIRRHOSIS'
  | 'HYPERCOAGULABLE_PROTHROMBOTIC_COVID_DIC'
  | 'DILUTIONAL_ACIDOSIS_HYPOTHERMIA_TRIAD';

export interface TegTracePoint {
  timeMinutes: number;
  upperAmplitudeMm: number;
  lowerAmplitudeMm: number;
  totalAmplitudeMm: number;
}

export interface RotemAssayResults {
  extemCtSec: number; // 43-82 s
  extemMcfMm: number; // 50-72 mm
  intemCtSec: number; // 100-240 s
  intemMcfMm: number; // 50-72 mm
  fibtemMcfMm: number; // 9-25 mm (isolated fibrinogen clot strength)
  heptemCtSec: number; // normalizes heparinized INTEM
  aptemMcfMm: number; // normalizes hyperfibrinolytic EXTEM
  maxLysisPct: number; // < 15%
}

export interface TegRawParameters {
  rTimeMinutes: number; // Reaction time: 5.0 - 10.0 min (clotting factors)
  kTimeMinutes: number; // Kinetics time: 1.0 - 3.0 min (fibrinogen rate)
  alphaAngleDegrees: number; // Alpha angle: 53 - 72 deg (fibrinogen burst)
  maxAmplitudeMm: number; // Maximum Amplitude: 50 - 70 mm (platelets 80%, fibrinogen 20%)
  ly30Pct: number; // Lysis at 30 min post-MA: 0.0 - 3.0 % (fibrinolysis)
  heparinaseRTimeMinutes: number; // R-time with heparinase reagent
}

export interface PatientBleedingContext {
  temperatureCelsius: number; // normal 36.5 - 37.5
  arterialPh: number; // normal 7.35 - 7.45
  ionizedCalciumMmolL: number; // normal 1.15 - 1.30
  hemoglobinGDl: number; // normal 12 - 16
  plateletCountKUl: number; // normal 150 - 400
  fibrinogenMgDl: number; // normal 200 - 400
}

export interface TegInputParams {
  presetId: TegPresetId;
  teg: TegRawParameters;
  rotem: RotemAssayResults;
  patient: PatientBleedingContext;
}

export interface TransfusionInterventions {
  cryoprecipitatePools: number; // Pools of cryo (or grams of fibrinogen concentrate)
  plateletUnits: number; // Units of apheresis platelets
  ffpUnitsOrPccDose: string; // FFP or 4-Factor PCC
  txaDoseGrams: number; // Tranexamic acid (TXA)
  protamineDoseMg: number; // Protamine sulfate
  calciumChlorideGrams: number; // CaCl2
}

export interface TegState {
  gValueDynesCm2: number; // Clot shear elastic modulus: G = (5000 * MA) / (100 - MA)
  phenotype: HemostasisPhenotype;
  confidencePct: number;
  interventions: TransfusionInterventions;
  lethalTriadPresent: boolean;
  activeAlarms: string[];
  clinicalGuidance: string;
  traceCoordinates: TegTracePoint[];
}

/**
 * Calculate Shear Elastic Modulus (G-value, dynes/cm^2)
 * Formula: G = (5000 * MA) / (100 - MA)
 * Normal: 5,000 - 11,000 dynes/cm^2
 */
export function calculateGValue(maxAmplitudeMm: number): number {
  if (maxAmplitudeMm >= 99) return 495000;
  if (maxAmplitudeMm <= 0) return 0;
  const g = (5000 * maxAmplitudeMm) / (100 - maxAmplitudeMm);
  return Math.round(g);
}

/**
 * Generate synthetic continuous viscoelastic waveform trace (60 minutes)
 * Generates teardrop / champagne flute viscoelastic profile
 */
export function generateTegTraceCoordinates(
  rTime: number,
  kTime: number,
  alphaDeg: number,
  maMm: number,
  ly30Pct: number
): TegTracePoint[] {
  const points: TegTracePoint[] = [];
  const totalMinutes = 60;
  const timeStep = 0.5;

  for (let t = 0; t <= totalMinutes; t += timeStep) {
    let amplitude = 0;

    if (t < rTime) {
      // Pre-clotting latency: flat 2mm baseline pin drag
      amplitude = 1.0;
    } else if (t < rTime + kTime) {
      // Clot initiation / acceleration zone
      const progress = (t - rTime) / Math.max(0.5, kTime);
      const angleRad = (alphaDeg * Math.PI) / 180;
      const initialSlope = Math.tan(angleRad) * 4.0;
      amplitude = Math.min(maMm, 1.0 + progress * progress * initialSlope * 10);
    } else if (t < rTime + kTime + 15) {
      // Growth to Maximum Amplitude
      const phase = (t - (rTime + kTime)) / 15;
      const startAmp = 10;
      amplitude = startAmp + (maMm - startAmp) * Math.sin((phase * Math.PI) / 2);
    } else {
      // Fibrinolysis phase (t > MA plateau)
      const postMaTime = t - (rTime + kTime + 15);
      const lysisFraction = Math.min(1.0, (postMaTime / 30) * (ly30Pct / 100));
      amplitude = Math.max(0, maMm * (1 - lysisFraction));
    }

    const halfAmp = parseFloat((amplitude / 2).toFixed(2));
    points.push({
      timeMinutes: t,
      upperAmplitudeMm: halfAmp,
      lowerAmplitudeMm: -halfAmp,
      totalAmplitudeMm: parseFloat((halfAmp * 2).toFixed(2)),
    });
  }

  return points;
}

/**
 * Main Compute Function for Viscoelastic TEG / ROTEM State
 */
export function computeTegHemostasisState(params: TegInputParams): TegState {
  const { teg, rotem, patient } = params;

  // 1. Calculate G-Value
  const gValueDynesCm2 = calculateGValue(teg.maxAmplitudeMm);

  // 2. Lethal Triad Detection (Hypothermia < 35.0 C, Acidosis pH < 7.20, Hypocalcemia Ca < 1.0)
  const lethalTriadPresent =
    patient.temperatureCelsius < 35.0 || patient.arterialPh < 7.20 || patient.ionizedCalciumMmolL < 1.0;

  // 3. Phenotype Classification Logic
  let phenotype: HemostasisPhenotype = 'NORMAL_PHYSIOLOGICAL';
  let confidencePct = 90;

  // Heparin Effect: R-time prolonged and significantly corrected by Heparinase
  const heparinCorrectionDelta = teg.rTimeMinutes - teg.heparinaseRTimeMinutes;
  const isHeparinized =
    teg.rTimeMinutes > 12.0 && (heparinCorrectionDelta >= 4.0 || rotem.intemCtSec > rotem.heptemCtSec * 1.5);

  // Hyperfibrinolysis: LY30 > 7.5% or ROTEM Maximum Lysis > 15%
  const isHyperfibrinolysis = teg.ly30Pct > 7.5 || rotem.maxLysisPct > 15.0;

  // Hypofibrinogenemia: FIBTEM MCF < 10 mm or low alpha angle + prolonged K with low MA
  const isHypofibrinogenemia =
    rotem.fibtemMcfMm < 10.0 || (teg.alphaAngleDegrees < 45.0 && teg.maxAmplitudeMm < 45.0 && !isHyperfibrinolysis);

  // Isolated Thrombocytopenia: Low MA with NORMAL FIBTEM MCF
  const isThrombocytopenia =
    teg.maxAmplitudeMm < 45.0 && rotem.fibtemMcfMm >= 10.0 && !isHyperfibrinolysis && !isHypofibrinogenemia;

  // Factor Deficiency: Prolonged R time without heparin correction
  const isFactorDeficiency = teg.rTimeMinutes > 10.5 && !isHeparinized;

  // Hypercoagulable: Short R time (<4 min), steep alpha (>74 deg), high MA (>72 mm)
  const isHypercoagulable = teg.rTimeMinutes < 4.5 && teg.alphaAngleDegrees > 72.0 && teg.maxAmplitudeMm > 70.0;

  if (isHeparinized) {
    phenotype = 'HEPARIN_EFFECT';
    confidencePct = 96;
  } else if (isHyperfibrinolysis) {
    phenotype = 'PRIMARY_HYPERFIBRINOLYSIS';
    confidencePct = 98;
  } else if (lethalTriadPresent && teg.maxAmplitudeMm < 40.0) {
    phenotype = 'DILUTIONAL_TRAUMA_TRIAD';
    confidencePct = 94;
  } else if (isHypofibrinogenemia) {
    phenotype = 'HYPOFIBRINOGENEMIA';
    confidencePct = 95;
  } else if (isThrombocytopenia) {
    phenotype = 'THROMBOCYTOPENIA_PLATELET_DYSFUNCTION';
    confidencePct = 92;
  } else if (isFactorDeficiency) {
    phenotype = 'COAGULATION_FACTOR_DEFICIENCY';
    confidencePct = 93;
  } else if (isHypercoagulable) {
    phenotype = 'HYPERCOAGULABLE_PROTHROMBOTIC';
    confidencePct = 95;
  } else {
    phenotype = 'NORMAL_PHYSIOLOGICAL';
    confidencePct = 95;
  }

  // 4. Targeted Transfusion Interventions Calculator
  const interventions: TransfusionInterventions = {
    cryoprecipitatePools: 0,
    plateletUnits: 0,
    ffpUnitsOrPccDose: 'None indicated',
    txaDoseGrams: 0,
    protamineDoseMg: 0,
    calciumChlorideGrams: 0,
  };

  // Cryoprecipitate / Fibrinogen Concentrate (Target FIBTEM MCF >= 10-12 mm, Fibrinogen >= 150-200 mg/dL)
  if (rotem.fibtemMcfMm < 10.0 || teg.alphaAngleDegrees < 50.0 || patient.fibrinogenMgDl < 150) {
    interventions.cryoprecipitatePools = 2; // 2 standard pools = 10 units of cryoprecipitate (or 3-4g fibrinogen concentrate)
  }

  // Platelet Transfusions (Target MA >= 50 mm, Platelets >= 50-100k)
  if (teg.maxAmplitudeMm < 48.0 && (isThrombocytopenia || patient.plateletCountKUl < 75)) {
    interventions.plateletUnits = 1; // 1 apheresis unit raises platelet count by ~30-50k
  }

  // FFP / 4-Factor PCC (Target R-time <= 8 min, EXTEM CT <= 80s)
  if (teg.rTimeMinutes > 10.0 && !isHeparinized) {
    interventions.ffpUnitsOrPccDose = '2–4 Units FFP or 4-Factor PCC 25 U/kg';
  }

  // Tranexamic Acid (Target LY30 < 3%, ML < 15%)
  if (isHyperfibrinolysis || teg.ly30Pct >= 5.0) {
    interventions.txaDoseGrams = 1.0; // TXA 1g IV over 10 min, then 1g infusion over 8 hrs (CRASH-2 trial)
  }

  // Protamine Sulfate (Neutralize residual circulating unfractionated heparin)
  if (isHeparinized) {
    interventions.protamineDoseMg = Math.min(50, Math.round(heparinCorrectionDelta * 3.5));
  }

  // Calcium Chloride (Ionized Ca < 1.15 mmol/L impairs Tenase & Prothrombinase complexes)
  if (patient.ionizedCalciumMmolL < 1.15) {
    interventions.calciumChlorideGrams = 1.0; // 1g CaCl2 IV push
  }

  // 5. Active Alarms
  const activeAlarms: string[] = [];

  if (isHyperfibrinolysis) {
    activeAlarms.push('FULMINANT_HYPERFIBRINOLYSIS_TXA_EMERGENCY');
  }

  if (isHeparinized) {
    activeAlarms.push('CIRCULATING_HEPARIN_PROTAMINE_REVERSAL_REQUIRED');
  }

  if (isHypofibrinogenemia) {
    activeAlarms.push('CRITICAL_HYPOFIBRINOGENEMIA_CRYOPRECIPITATE_NEEDED');
  }

  if (isThrombocytopenia) {
    activeAlarms.push('SEVERE_PLATELET_DEFICIT_LOW_CLOT_STRENGTH');
  }

  if (isFactorDeficiency) {
    activeAlarms.push('EXTENDED_R_TIME_FACTOR_DEPLETION_PCC_FFP');
  }

  if (lethalTriadPresent) {
    activeAlarms.push('LETHAL_TRIAD_HYPOTHERMIA_ACIDOSIS_COAGULOPATHY');
  }

  if (isHypercoagulable) {
    activeAlarms.push('PROTHROMBOTIC_STATE_THROMBOEMBOLISM_RISK');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_HEMOSTATIC_EQUILIBRIUM');
  }

  // 6. Clinical Guidance Formulation
  let clinicalGuidance = 'Viscoelastic parameters reflect intact clot initiation, propagation, and stability.';

  if (phenotype === 'PRIMARY_HYPERFIBRINOLYSIS') {
    clinicalGuidance =
      'CRITICAL HYPERFIBRINOLYSIS: Rapid clot breakdown (teardrop trace with LY30 > 7.5%). Administer Tranexamic Acid (TXA 1g IV bolus over 10 min + 1g infusion over 8h) immediately to inhibit plasminogen activation. Avoid cryoprecipitate until TXA is running.';
  } else if (phenotype === 'HEPARIN_EFFECT') {
    clinicalGuidance =
      'HEPARIN ANTICOAGULATION DETECTED: Significant discrepancy between native R-time and Heparinase R-time (or INTEM vs HEPTEM CT). Titrate Protamine Sulfate (25–50 mg IV slow push) to restore physiological factor activation.';
  } else if (phenotype === 'HYPOFIBRINOGENEMIA') {
    clinicalGuidance =
      'HYPOFIBRINOGENEMIA DETECTED: Flat alpha-angle (< 45°) and blunted FIBTEM MCF (< 10 mm) confirm inadequate substrate for fibrin mesh formation. Transfuse 2 pools of Cryoprecipitate (10 units) or 3–4g of Fibrinogen Concentrate. Target plasma fibrinogen > 200 mg/dL.';
  } else if (phenotype === 'THROMBOCYTOPENIA_PLATELET_DYSFUNCTION') {
    clinicalGuidance =
      'ISOLATED PLATELET DEFICIT: Low MA (< 48 mm) with preserved FIBTEM MCF demonstrates adequate fibrinogen but compromised platelet count or GPIIb/IIIa receptor inhibition. Transfuse 1 unit of apheresis platelets and ensure ionized calcium > 1.15 mmol/L.';
  } else if (phenotype === 'DILUTIONAL_TRAUMA_TRIAD') {
    clinicalGuidance =
      'LETHAL TRIAD RESUSCITATION: Concurrent hypothermia, severe acidemia, and dilutional coagulopathy from crystalloid over-resuscitation. Initiate MTP 1:1:1 balanced resuscitation, active rewarming to > 36°C, correct ionized calcium, and administer 1g IV CaCl2.';
  } else if (phenotype === 'COAGULATION_FACTOR_DEFICIENCY') {
    clinicalGuidance =
      'FACTOR DEPLETION / DILUTION: Prolonged R-time (> 10.5 min) and EXTEM CT reflect delayed thrombin burst due to hepatic failure, warfarin, or consumption. Administer 4-Factor PCC (25–50 U/kg) or 2–4 units of FFP.';
  } else if (phenotype === 'HYPERCOAGULABLE_PROTHROMBOTIC') {
    clinicalGuidance =
      'HYPERCOAGULABLE VISCOELASTIC PROFILE: Rapid R-time (< 4 min), steep alpha-angle, and super-normal MA (> 72 mm). High risk for deep venous thrombosis (DVT) and pulmonary embolism. Initiate therapeutic anticoagulation (LMWH/UFH) once active bleeding is excluded.';
  }

  // 7. Synthetic Trace Coordinates
  const traceCoordinates = generateTegTraceCoordinates(
    teg.rTimeMinutes,
    teg.kTimeMinutes,
    teg.alphaAngleDegrees,
    teg.maxAmplitudeMm,
    teg.ly30Pct
  );

  return {
    gValueDynesCm2,
    phenotype,
    confidencePct,
    interventions,
    lethalTriadPresent,
    activeAlarms,
    clinicalGuidance,
    traceCoordinates,
  };
}

/**
 * 8 Standard Validated Clinical Presets for TEG / ROTEM
 */
export const TEG_PRESETS: Record<
  TegPresetId,
  {
    title: string;
    description: string;
    initialState: TegInputParams;
  }
> = {
  NORMAL_PHYSIOLOGICAL_HEMOSTASIS: {
    title: 'Normal Physiological Hemostasis (Baseline Control)',
    description: 'Elective surgical patient with normal coagulation parameters: R = 6.5 min, alpha = 62 deg, MA = 60 mm, LY30 = 1.2%. No blood products indicated.',
    initialState: {
      presetId: 'NORMAL_PHYSIOLOGICAL_HEMOSTASIS',
      teg: { rTimeMinutes: 6.5, kTimeMinutes: 1.8, alphaAngleDegrees: 62.0, maxAmplitudeMm: 60.0, ly30Pct: 1.2, heparinaseRTimeMinutes: 6.3 },
      rotem: { extemCtSec: 62, extemMcfMm: 61, intemCtSec: 160, intemMcfMm: 62, fibtemMcfMm: 16, heptemCtSec: 158, aptemMcfMm: 61, maxLysisPct: 6 },
      patient: { temperatureCelsius: 37.0, arterialPh: 7.40, ionizedCalciumMmolL: 1.22, hemoglobinGDl: 14.0, plateletCountKUl: 240, fibrinogenMgDl: 280 },
    },
  },

  SEVERE_HYPOFIBRINOGENEMIA_MASSIVE_HEMORRHAGE: {
    title: 'Severe Hypofibrinogenemia (Massive Obstetric / Trauma Bleed)',
    description: 'Postpartum hemorrhage with acute consumption: Flat alpha angle (34 deg), low MA (32 mm), and critical FIBTEM MCF of 4 mm. Requires urgent cryoprecipitate or fibrinogen concentrate.',
    initialState: {
      presetId: 'SEVERE_HYPOFIBRINOGENEMIA_MASSIVE_HEMORRHAGE',
      teg: { rTimeMinutes: 7.8, kTimeMinutes: 4.6, alphaAngleDegrees: 34.0, maxAmplitudeMm: 32.0, ly30Pct: 1.8, heparinaseRTimeMinutes: 7.5 },
      rotem: { extemCtSec: 88, extemMcfMm: 33, intemCtSec: 195, intemMcfMm: 34, fibtemMcfMm: 4, heptemCtSec: 192, aptemMcfMm: 34, maxLysisPct: 8 },
      patient: { temperatureCelsius: 36.2, arterialPh: 7.32, ionizedCalciumMmolL: 1.08, hemoglobinGDl: 7.5, plateletCountKUl: 160, fibrinogenMgDl: 95 },
    },
  },

  THROMBOCYTOPENIA_OR_TICP: {
    title: 'Thrombocytopenia & Platelet Defect (Isolated Low MA)',
    description: 'Cirrhotic patient with hypersplenism presenting with low MA (36 mm) but normal FIBTEM MCF (15 mm), indicating isolated platelet insufficiency rather than hypofibrinogenemia.',
    initialState: {
      presetId: 'THROMBOCYTOPENIA_OR_TICP',
      teg: { rTimeMinutes: 6.8, kTimeMinutes: 2.2, alphaAngleDegrees: 58.0, maxAmplitudeMm: 36.0, ly30Pct: 0.8, heparinaseRTimeMinutes: 6.6 },
      rotem: { extemCtSec: 68, extemMcfMm: 38, intemCtSec: 172, intemMcfMm: 37, fibtemMcfMm: 15, heptemCtSec: 170, aptemMcfMm: 38, maxLysisPct: 5 },
      patient: { temperatureCelsius: 36.8, arterialPh: 7.38, ionizedCalciumMmolL: 1.18, hemoglobinGDl: 9.2, plateletCountKUl: 38, fibrinogenMgDl: 230 },
    },
  },

  PRIMARY_HYPERFIBRINOLYSIS_TRAUMA: {
    title: 'Primary Hyperfibrinolysis (Trauma Induced Coagulopathy)',
    description: 'Polytrauma shock presenting with rapid clot dissolution: Teardrop trace with LY30 of 26% and ROTEM maximum lysis of 38%. Pathognomonic for massive tissue plasminogen activator (tPA) release; TXA mandatory.',
    initialState: {
      presetId: 'PRIMARY_HYPERFIBRINOLYSIS_TRAUMA',
      teg: { rTimeMinutes: 5.8, kTimeMinutes: 2.0, alphaAngleDegrees: 60.0, maxAmplitudeMm: 52.0, ly30Pct: 26.0, heparinaseRTimeMinutes: 5.6 },
      rotem: { extemCtSec: 74, extemMcfMm: 51, intemCtSec: 180, intemMcfMm: 50, fibtemMcfMm: 12, heptemCtSec: 178, aptemMcfMm: 58, maxLysisPct: 38 },
      patient: { temperatureCelsius: 35.8, arterialPh: 7.28, ionizedCalciumMmolL: 1.05, hemoglobinGDl: 8.4, plateletCountKUl: 145, fibrinogenMgDl: 180 },
    },
  },

  SYSTEMIC_HEPARIN_EFFECT_POST_CPB: {
    title: 'Post-Cardiopulmonary Bypass Unfractionated Heparin Rebound',
    description: 'Microvascular bleeding post-cardiac surgery: Markedly prolonged native R-time (22.5 min) which normalizes to 6.2 min with Heparinase (INTEM CT 480s vs HEPTEM CT 175s). Protamine indicated.',
    initialState: {
      presetId: 'SYSTEMIC_HEPARIN_EFFECT_POST_CPB',
      teg: { rTimeMinutes: 22.5, kTimeMinutes: 3.8, alphaAngleDegrees: 48.0, maxAmplitudeMm: 54.0, ly30Pct: 1.0, heparinaseRTimeMinutes: 6.2 },
      rotem: { extemCtSec: 75, extemMcfMm: 55, intemCtSec: 480, intemMcfMm: 54, fibtemMcfMm: 14, heptemCtSec: 175, aptemMcfMm: 55, maxLysisPct: 5 },
      patient: { temperatureCelsius: 36.0, arterialPh: 7.36, ionizedCalciumMmolL: 1.16, hemoglobinGDl: 9.8, plateletCountKUl: 135, fibrinogenMgDl: 210 },
    },
  },

  FACTOR_DEFICIENCY_COAGULOPATHY_CIRRHOSIS: {
    title: 'Coagulation Factor Depletion (End-Stage Liver Disease)',
    description: 'Decompensated cirrhosis with prolonged R-time (14.2 min) and reduced alpha angle (44 deg) resistant to heparinase, reflecting synthesis failure of Factors II, VII, IX, and X. PCC/FFP indicated.',
    initialState: {
      presetId: 'FACTOR_DEFICIENCY_COAGULOPATHY_CIRRHOSIS',
      teg: { rTimeMinutes: 14.2, kTimeMinutes: 3.4, alphaAngleDegrees: 44.0, maxAmplitudeMm: 46.0, ly30Pct: 1.5, heparinaseRTimeMinutes: 14.0 },
      rotem: { extemCtSec: 145, extemMcfMm: 46, intemCtSec: 285, intemMcfMm: 45, fibtemMcfMm: 11, heptemCtSec: 280, aptemMcfMm: 47, maxLysisPct: 7 },
      patient: { temperatureCelsius: 36.6, arterialPh: 7.35, ionizedCalciumMmolL: 1.12, hemoglobinGDl: 8.8, plateletCountKUl: 72, fibrinogenMgDl: 165 },
    },
  },

  HYPERCOAGULABLE_PROTHROMBOTIC_COVID_DIC: {
    title: 'Prothrombotic Hypercoagulability (COVID-19 / Malignancy DIC)',
    description: 'Thrombotic storm with accelerated clot kinetics: R = 3.2 min, steep alpha (78 deg), supranormal MA (76 mm, G-value > 15,000 dynes/cm2), and zero fibrinolysis. High risk for pulmonary embolism.',
    initialState: {
      presetId: 'HYPERCOAGULABLE_PROTHROMBOTIC_COVID_DIC',
      teg: { rTimeMinutes: 3.2, kTimeMinutes: 1.0, alphaAngleDegrees: 78.0, maxAmplitudeMm: 76.0, ly30Pct: 0.1, heparinaseRTimeMinutes: 3.1 },
      rotem: { extemCtSec: 44, extemMcfMm: 76, intemCtSec: 110, intemMcfMm: 75, fibtemMcfMm: 28, heptemCtSec: 110, aptemMcfMm: 76, maxLysisPct: 2 },
      patient: { temperatureCelsius: 38.4, arterialPh: 7.44, ionizedCalciumMmolL: 1.25, hemoglobinGDl: 15.2, plateletCountKUl: 410, fibrinogenMgDl: 620 },
    },
  },

  DILUTIONAL_ACIDOSIS_HYPOTHERMIA_TRIAD: {
    title: 'Lethal Triad of Trauma (Hypothermia, Acidosis, Dilution)',
    description: 'Exsanguinating trauma resuscitated with 6L normal saline: Temperature 34.2 C, pH 7.12, prolonged R-time (13.5 min), flat alpha (32 deg), poor MA (28 mm), and hypocalcemia (Ca 0.88 mmol/L).',
    initialState: {
      presetId: 'DILUTIONAL_ACIDOSIS_HYPOTHERMIA_TRIAD',
      teg: { rTimeMinutes: 13.5, kTimeMinutes: 4.8, alphaAngleDegrees: 32.0, maxAmplitudeMm: 28.0, ly30Pct: 9.2, heparinaseRTimeMinutes: 13.2 },
      rotem: { extemCtSec: 160, extemMcfMm: 28, intemCtSec: 310, intemMcfMm: 27, fibtemMcfMm: 5, heptemCtSec: 305, aptemMcfMm: 35, maxLysisPct: 18 },
      patient: { temperatureCelsius: 34.2, arterialPh: 7.12, ionizedCalciumMmolL: 0.88, hemoglobinGDl: 6.4, plateletCountKUl: 55, fibrinogenMgDl: 85 },
    },
  },
};
