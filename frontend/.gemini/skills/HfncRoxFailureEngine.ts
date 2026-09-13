/**
 * HfncRoxFailureEngine.ts
 * Biophysical & Clinical Decision Support Engine for High-Flow Nasal Cannula (HFNC),
 * ROX Index Kinetics, Anatomical Dead Space Washout, Entrainment Dilution & P-SILI Prevention.
 *
 * References:
 * - Roca O, Messika J, Caralt B, et al. Predicting success of high-flow nasal cannula in
 *   pneumonia patients with hypoxemic respiratory failure: The utility of the 'ROX' index.
 *   J Crit Care. 2016;35:200-205.
 * - Roca O, Caralt B, Messika J, et al. An index combining respiratory rate and oxygenation
 *   to predict outcome of high-flow nasal cannula in COVID-19/hypoxemic ARF. Am J Respir Crit Care Med. 2019;199(11):1368-1376.
 * - Mauri T, Alban L, Turrini C, et al. Optimum support by high-flow nasal cannula in acute
 *   hypoxemic respiratory failure: effects of flow and temperature. Intensive Care Med. 2017;43(10):1453-1463.
 * - Brochard L, Slutsky A, Pesenti A. Mechanical Ventilation to Minimize Progression of Lung Injury
 *   in Acute Respiratory Failure (P-SILI). Am J Respir Crit Care Med. 2017;195(4):438-442.
 * - Kang BJ, Koh Y, Lim CM, et al. Failure of high-flow nasal cannula therapy may delay intubation
 *   and increase mortality. Intensive Care Med. 2015;41(4):623-632.
 */

export type RoxClassificationLevel = 'success' | 'intermediate' | 'high_risk' | 'very_high_risk';

export interface RoxClassification {
  level: RoxClassificationLevel;
  roxValue: number;
  roxHrValue: number;
  thresholdUsed: number;
  interpretation: string;
  actionRecommendation: string;
  intubationRecommended: boolean;
}

export interface HfncMechanicsInput {
  flowRateLpm: number; // 10 - 80 L/min
  setFio2: number; // 0.21 - 1.00
  patientPeakInspiratoryFlowLpm: number; // 20 - 140 L/min
  mouthOpen: boolean;
  temperatureC: number; // 31, 34, 37 C
  patientWeightKg: number;
}

export interface HfncMechanicsOutput {
  generatedPeepCmH2o: number;
  deadSpaceWashoutFraction: number; // 0.0 - 1.0
  deadSpaceWashoutPercent: number; // 0 - 100%
  effectiveMinuteVentilationReductionLpm: number; // reduction in required VE
  airEntrainedLpm: number;
  actualDeliveredFio2: number;
  fio2Diluted: boolean;
  absoluteHumidityMgL: number;
  relativeHumidityPercent: number;
  wobReductionPercent: number;
}

export interface PsiliEvaluationInput {
  respiratoryRate: number;
  tidalVolumeMlPerKgPbw: number; // 4 - 14 mL/kg
  accessoryMuscleUse: 'none' | 'mild' | 'moderate' | 'severe';
  esophagealPressureSwingCmH2o?: number; // delta Pes
}

export interface PsiliRiskReport {
  estimatedDeltaPesCmH2o: number;
  psiliRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  pendelluftRisk: boolean;
  alveolarShearStressWarning: boolean;
  dynamicTranspulmonaryStrain: 'Minimal' | 'Mild' | 'Excessive' | 'Critical';
  rationale: string;
}

export interface RoxTimepoint {
  hour: number; // e.g. 0, 2, 6, 12, 24
  spo2: number; // % (e.g. 92)
  fio2: number; // fraction 0.21 - 1.0
  respiratoryRate: number; // breaths/min
  heartRate: number; // bpm
  flowRateLpm: number; // L/min
  roxIndex: number;
}

export interface RoxTrajectoryAnalysis {
  timepoints: RoxTimepoint[];
  currentRox: number;
  currentRoxHr: number;
  deltaRox: number; // change from first to latest or latest - prior
  trajectoryTrend: 'improving' | 'stable' | 'deteriorating';
  failureProbabilityPercent: number;
  intubationUrgency: 'None' | 'Monitor Closely' | 'Prepare for Intubation' | 'Emergency Intubation';
  clinicalSummary: string;
}

export interface HfncScenario {
  id: string;
  name: string;
  patientSummary: string;
  primaryDiagnosis: string;
  patientWeightKg: number;
  initialVitals: {
    spo2: number;
    fio2: number;
    rr: number;
    hr: number;
    peakInspiratoryFlow: number;
    accessoryMuscleUse: 'none' | 'mild' | 'moderate' | 'severe';
    tidalVolumePerKg: number;
  };
  timepoints: RoxTimepoint[];
  clinicalTakeaway: string;
}

/**
 * 1. Calculate Standard ROX Index
 * ROX = (SpO2 [%] / FiO2 [fraction]) / RR [breaths/min]
 * Note: If FiO2 is given as percentage (e.g. 60 instead of 0.60), auto-convert.
 */
export function calculateRoxIndex(spo2: number, fio2: number, rr: number): number {
  if (rr <= 0) return 0;
  const normalizedFio2 = fio2 > 1.0 ? fio2 / 100 : Math.max(0.21, fio2);
  const normalizedSpo2 = Math.min(100, Math.max(50, spo2));
  const rox = (normalizedSpo2 / normalizedFio2) / rr;
  return Math.round(rox * 100) / 100;
}

/**
 * 2. Calculate Modified ROX-HR Index
 * ROX-HR = (ROX / Heart Rate) * 100
 * Incorporates adrenergic tachycardia response to respiratory distress.
 */
export function calculateRoxHrIndex(rox: number, heartRate: number): number {
  if (heartRate <= 0) return 0;
  const roxHr = (rox / heartRate) * 100;
  return Math.round(roxHr * 100) / 100;
}

/**
 * 3. Classify ROX Failure Risk based on Time on HFNC
 * Validated Roca Cut-offs:
 * - At 2h: < 2.85 is very high risk; 2.85 - 3.84 is high risk; 3.85 - 4.87 is intermediate; >= 4.88 success.
 * - At 6h: < 3.47 is very high risk; 3.47 - 3.84 is high risk; 3.85 - 4.87 is intermediate; >= 4.88 success.
 * - At 12h+: < 3.85 is high risk / failure; 3.85 - 4.87 is intermediate; >= 4.88 success.
 */
export function classifyRoxFailureRisk(rox: number, hoursOnHfnc: number, heartRate: number = 90): RoxClassification {
  const roxHr = calculateRoxHrIndex(rox, heartRate);

  if (hoursOnHfnc <= 2) {
    if (rox >= 4.88) {
      return {
        level: 'success',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 4.88,
        interpretation: 'Low Risk of HFNC Failure (Early Success)',
        actionRecommendation: 'Continue HFNC at current settings. Monitor SpO2 and initiate gradual FiO2 weaning when stable.',
        intubationRecommended: false,
      };
    } else if (rox >= 3.85) {
      return {
        level: 'intermediate',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.85,
        interpretation: 'Intermediate Risk (Grey Zone)',
        actionRecommendation: 'Optimize flow rate to 60 L/min to maximize dead space clearance. Re-evaluate strictly in 2 hours.',
        intubationRecommended: false,
      };
    } else if (rox >= 2.85) {
      return {
        level: 'high_risk',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 2.85,
        interpretation: 'High Risk of HFNC Failure',
        actionRecommendation: 'Alert ICU team. Prepare intubation equipment and RSI drugs at bedside. Recheck in 1-2 hours.',
        intubationRecommended: false,
      };
    } else {
      return {
        level: 'very_high_risk',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 2.85,
        interpretation: 'Critical / Imminent HFNC Failure (Roca 2h Threshold < 2.85)',
        actionRecommendation: 'Proceed with urgent endotracheal intubation and invasive mechanical ventilation. Delaying intubation increases mortality.',
        intubationRecommended: true,
      };
    }
  } else if (hoursOnHfnc <= 6) {
    if (rox >= 4.88) {
      return {
        level: 'success',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 4.88,
        interpretation: 'Sustained HFNC Success at 6 Hours',
        actionRecommendation: 'Favorable trajectory. Maintain flow 50-60 L/min, titrate FiO2 down to target SpO2 92-96%.',
        intubationRecommended: false,
      };
    } else if (rox >= 3.85) {
      return {
        level: 'intermediate',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.85,
        interpretation: 'Intermediate Risk at 6 Hours',
        actionRecommendation: 'Ensure maximal flow support (60 L/min). Check for secretional plugging or fatigue.',
        intubationRecommended: false,
      };
    } else if (rox >= 3.47) {
      return {
        level: 'high_risk',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.47,
        interpretation: 'High Risk of Failure at 6 Hours',
        actionRecommendation: 'Failing to improve despite 6 hours of support. Prepare for controlled endotracheal intubation.',
        intubationRecommended: true,
      };
    } else {
      return {
        level: 'very_high_risk',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.47,
        interpretation: 'Severe HFNC Failure at 6 Hours (Roca 6h Threshold < 3.47)',
        actionRecommendation: 'Immediate endotracheal intubation indicated. High risk of sudden respiratory arrest.',
        intubationRecommended: true,
      };
    }
  } else {
    // 12 hours or beyond
    if (rox >= 4.88) {
      return {
        level: 'success',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 4.88,
        interpretation: 'Robust HFNC Success at >= 12 Hours',
        actionRecommendation: 'Stable clinical response. Plan stepwise weaning: FiO2 <= 0.40 first, then decrease flow by 5-10 L/min.',
        intubationRecommended: false,
      };
    } else if (rox >= 3.85) {
      return {
        level: 'intermediate',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.85,
        interpretation: 'Suboptimal / Prolonged Borderline HFNC Course',
        actionRecommendation: 'Patient has not reached definitive safety margin (ROX >= 4.88). Assess diaphragm fatigue and arterial blood gas.',
        intubationRecommended: false,
      };
    } else {
      return {
        level: 'very_high_risk',
        roxValue: rox,
        roxHrValue: roxHr,
        thresholdUsed: 3.85,
        interpretation: 'HFNC Failure at >= 12 Hours (Roca Threshold < 3.85)',
        actionRecommendation: 'Definitive HFNC failure. Proceed directly to invasive mechanical ventilation. Do NOT delay further.',
        intubationRecommended: true,
      };
    }
  }
}

/**
 * 4. Biophysical HFNC Mechanics & Aerodynamic Model
 * Calculates PEEP generation, dead space washout %, air entrainment dilution, and WOB reduction.
 */
export function calculateHfncMechanics(input: HfncMechanicsInput): HfncMechanicsOutput {
  const { flowRateLpm, setFio2, patientPeakInspiratoryFlowLpm, mouthOpen, temperatureC } = input;

  // 1. Generated PEEP:
  // Closed mouth: ~0.8 cmH2O per 10 L/min (up to ~5.5-6.0 cmH2O at 60-70 L/min)
  // Open mouth: ~0.4 cmH2O per 10 L/min (~50% reduction)
  const peepMultiplier = mouthOpen ? 0.045 : 0.085;
  const rawPeep = flowRateLpm * peepMultiplier;
  const generatedPeepCmH2o = Math.round(Math.min(7.5, Math.max(0.5, rawPeep)) * 10) / 10;

  // 2. Anatomical Dead Space Washout:
  // Non-linear exponential saturation: 1 - exp(-flow / 25)
  // At 30 L/min -> ~70% washout; at 60 L/min -> ~91% washout
  const deadSpaceWashoutFraction = 1 - Math.exp(-flowRateLpm / 25);
  const deadSpaceWashoutPercent = Math.round(deadSpaceWashoutFraction * 100);

  // Minute ventilation reduction: Upper airway dead space is ~150 mL.
  // Purging expired CO2 saves approximately 1.5 - 3.5 L/min of minute ventilation demand.
  const effectiveMinuteVentilationReductionLpm = Math.round(deadSpaceWashoutFraction * 3.2 * 10) / 10;

  // 3. Air Entrainment & Delivered FiO2:
  // When Patient Peak Inspiratory Flow (PIF) exceeds HFNC Flow, ambient air (FiO2 0.21) is entrained.
  let airEntrainedLpm = 0;
  let actualDeliveredFio2 = setFio2;
  let fio2Diluted = false;

  if (patientPeakInspiratoryFlowLpm > flowRateLpm) {
    airEntrainedLpm = Math.round((patientPeakInspiratoryFlowLpm - flowRateLpm) * 10) / 10;
    // Weighted mixing formula:
    const deliveredFlowO2 = flowRateLpm * setFio2;
    const entrainedO2 = airEntrainedLpm * 0.21;
    actualDeliveredFio2 = (deliveredFlowO2 + entrainedO2) / patientPeakInspiratoryFlowLpm;
    actualDeliveredFio2 = Math.round(actualDeliveredFio2 * 100) / 100;
    fio2Diluted = actualDeliveredFio2 < (setFio2 - 0.02);
  }

  // 4. Active Conditioning: Absolute & Relative Humidity
  // Optimal standard is 37°C delivering 44 mg/L H2O (100% RH)
  let absoluteHumidityMgL = 44;
  let relativeHumidityPercent = 100;
  if (temperatureC === 34) {
    absoluteHumidityMgL = 37.6;
    relativeHumidityPercent = 100;
  } else if (temperatureC <= 31) {
    absoluteHumidityMgL = 32.0;
    relativeHumidityPercent = 100;
  }

  // 5. Work of Breathing (WOB) Reduction Percentage:
  // Driven by dead space washout + PEEP + flow matching PIF
  const flowMatchRatio = Math.min(1.0, flowRateLpm / Math.max(1, patientPeakInspiratoryFlowLpm));
  const wobReduction = Math.round((deadSpaceWashoutFraction * 0.45 + (generatedPeepCmH2o / 6.0) * 0.25 + flowMatchRatio * 0.30) * 100);
  const wobReductionPercent = Math.min(65, Math.max(10, wobReduction));

  return {
    generatedPeepCmH2o,
    deadSpaceWashoutFraction: Math.round(deadSpaceWashoutFraction * 1000) / 1000,
    deadSpaceWashoutPercent,
    effectiveMinuteVentilationReductionLpm,
    airEntrainedLpm,
    actualDeliveredFio2,
    fio2Diluted,
    absoluteHumidityMgL,
    relativeHumidityPercent,
    wobReductionPercent,
  };
}

/**
 * 5. Patient-Self-Inflicted Lung Injury (P-SILI) Risk Evaluator
 * Quantifies excessive respiratory effort, estimated esophageal pressure swings (delta Pes),
 * and pendelluft strain.
 */
export function evaluatePsiliRisk(input: PsiliEvaluationInput): PsiliRiskReport {
  const { respiratoryRate, tidalVolumeMlPerKgPbw, accessoryMuscleUse, esophagealPressureSwingCmH2o } = input;

  // Base delta Pes calculation if not directly measured via esophageal balloon:
  let estimatedDeltaPes = esophagealPressureSwingCmH2o;
  if (estimatedDeltaPes === undefined) {
    let muscleAddition = 0;
    if (accessoryMuscleUse === 'mild') muscleAddition = 4;
    else if (accessoryMuscleUse === 'moderate') muscleAddition = 9;
    else if (accessoryMuscleUse === 'severe') muscleAddition = 16;

    const rrContribution = Math.max(0, (respiratoryRate - 20) * 0.4);
    const vtContribution = Math.max(0, (tidalVolumeMlPerKgPbw - 6) * 1.5);
    // Baseline quiet breathing is ~ -4 to -5 cmH2O
    estimatedDeltaPes = Math.round((4.0 + muscleAddition + rrContribution + vtContribution) * 10) / 10;
  }

  // Pendelluft Risk: Occurs when strong diaphragmatic contractions create localized negative pleural
  // pressure in dependent regions, shifting gas from non-dependent to dependent lung before inspiration begins.
  const pendelluftRisk = estimatedDeltaPes >= 12.0 && respiratoryRate >= 28;
  const alveolarShearStressWarning = tidalVolumeMlPerKgPbw >= 9.0 || estimatedDeltaPes >= 15.0;

  let psiliRiskLevel: 'Low' | 'Moderate' | 'High' | 'Severe' = 'Low';
  let dynamicTranspulmonaryStrain: 'Minimal' | 'Mild' | 'Excessive' | 'Critical' = 'Minimal';
  let rationale = '';

  if (estimatedDeltaPes < 8.0 && tidalVolumeMlPerKgPbw <= 7.0) {
    psiliRiskLevel = 'Low';
    dynamicTranspulmonaryStrain = 'Minimal';
    rationale = 'Physiologic respiratory effort. Transpulmonary pressure swings are within safe limits.';
  } else if (estimatedDeltaPes < 12.0 && tidalVolumeMlPerKgPbw <= 8.5) {
    psiliRiskLevel = 'Moderate';
    dynamicTranspulmonaryStrain = 'Mild';
    rationale = 'Moderate inspiratory drive. Maximize HFNC flow (60 L/min) to alleviate work of breathing.';
  } else if (estimatedDeltaPes < 18.0 || tidalVolumeMlPerKgPbw < 10.5) {
    psiliRiskLevel = 'High';
    dynamicTranspulmonaryStrain = 'Excessive';
    rationale = 'Excessive negative intrapleural swings causing high dynamic transpulmonary pressure and regional lung strain.';
  } else {
    psiliRiskLevel = 'Severe';
    dynamicTranspulmonaryStrain = 'Critical';
    rationale = 'Critical P-SILI risk: Intense diaphragmatic swings generating severe pendelluft effect, occult alveolar overdistension, and vascular shear edema.';
  }

  return {
    estimatedDeltaPesCmH2o: estimatedDeltaPes,
    psiliRiskLevel,
    pendelluftRisk,
    alveolarShearStressWarning,
    dynamicTranspulmonaryStrain,
    rationale,
  };
}

/**
 * 6. Analyze Longitudinal ROX Trajectory
 * Evaluates directional trend across serial measurements (0h, 2h, 6h, 12h) to detect delayed failure.
 */
export function analyzeRoxTrajectory(timepoints: RoxTimepoint[]): RoxTrajectoryAnalysis {
  if (timepoints.length === 0) {
    return {
      timepoints: [],
      currentRox: 0,
      currentRoxHr: 0,
      deltaRox: 0,
      trajectoryTrend: 'stable',
      failureProbabilityPercent: 50,
      intubationUrgency: 'Monitor Closely',
      clinicalSummary: 'No timepoints available.',
    };
  }

  const sorted = [...timepoints].sort((a, b) => a.hour - b.hour);
  const latest = sorted[sorted.length - 1];
  const earliest = sorted[0];
  const deltaRox = Math.round((latest.roxIndex - earliest.roxIndex) * 100) / 100;
  const currentRoxHr = calculateRoxHrIndex(latest.roxIndex, latest.heartRate);

  let trajectoryTrend: 'improving' | 'stable' | 'deteriorating' = 'stable';
  if (deltaRox > 0.5) trajectoryTrend = 'improving';
  else if (deltaRox < -0.5) trajectoryTrend = 'deteriorating';

  // Calculate failure probability based on latest ROX and trend:
  let failureProbability = 50;
  if (latest.roxIndex >= 6.0) {
    failureProbability = trajectoryTrend === 'improving' ? 8 : 15;
  } else if (latest.roxIndex >= 4.88) {
    failureProbability = trajectoryTrend === 'improving' ? 18 : 30;
  } else if (latest.roxIndex >= 3.85) {
    failureProbability = trajectoryTrend === 'deteriorating' ? 65 : 45;
  } else if (latest.roxIndex >= 2.85) {
    failureProbability = trajectoryTrend === 'deteriorating' ? 85 : 75;
  } else {
    failureProbability = 95;
  }

  let intubationUrgency: 'None' | 'Monitor Closely' | 'Prepare for Intubation' | 'Emergency Intubation' = 'None';
  let clinicalSummary = '';

  if (failureProbability < 25) {
    intubationUrgency = 'None';
    clinicalSummary = `Positive trajectory (Delta ROX +${deltaRox}). Patient is responding well to HFNC with low failure risk.`;
  } else if (failureProbability < 50) {
    intubationUrgency = 'Monitor Closely';
    clinicalSummary = `Intermediate trajectory. ROX is borderline (${latest.roxIndex}). Maintain flow >= 50-60 L/min and reassess in 2 hours.`;
  } else if (failureProbability < 80) {
    intubationUrgency = 'Prepare for Intubation';
    clinicalSummary = `High failure probability (${failureProbability}%). Patient shows poor response or downward trajectory. Prepare ICU airway team.`;
  } else {
    intubationUrgency = 'Emergency Intubation';
    clinicalSummary = `Critical HFNC failure (${failureProbability}% failure probability). Imminent respiratory arrest or severe P-SILI. Proceed to emergency endotracheal intubation.`;
  }

  return {
    timepoints: sorted,
    currentRox: latest.roxIndex,
    currentRoxHr,
    deltaRox,
    trajectoryTrend,
    failureProbabilityPercent: failureProbability,
    intubationUrgency,
    clinicalSummary,
  };
}

/**
 * 7. Standard Clinical Scenarios Catalog
 */
export const HFNC_SCENARIOS: Record<string, HfncScenario> = {
  covid_responder: {
    id: 'covid_responder',
    name: '1. Viral ARDS / COVID-19 (Favorable Responder)',
    patientSummary: '58yo male with severe bilateral viral pneumonia, initially on NRB 15 L/min with SpO2 88% and RR 34. Switched to HFNC 60 L/min, FiO2 0.80.',
    primaryDiagnosis: 'Acute Hypoxemic Respiratory Failure / Viral ARDS',
    patientWeightKg: 75,
    initialVitals: {
      spo2: 88,
      fio2: 0.85,
      rr: 34,
      hr: 112,
      peakInspiratoryFlow: 75,
      accessoryMuscleUse: 'moderate',
      tidalVolumePerKg: 8.2,
    },
    timepoints: [
      { hour: 0, spo2: 88, fio2: 0.80, respiratoryRate: 34, heartRate: 112, flowRateLpm: 60, roxIndex: 3.24 },
      { hour: 2, spo2: 93, fio2: 0.70, respiratoryRate: 26, heartRate: 98, flowRateLpm: 60, roxIndex: 5.11 },
      { hour: 6, spo2: 95, fio2: 0.55, respiratoryRate: 22, heartRate: 86, flowRateLpm: 55, roxIndex: 7.85 },
      { hour: 12, spo2: 96, fio2: 0.45, respiratoryRate: 18, heartRate: 78, flowRateLpm: 50, roxIndex: 11.85 },
    ],
    clinicalTakeaway: 'Successful responder showing rising ROX trajectory crossing 4.88 threshold by 2 hours and sustained de-escalation by 12 hours.',
  },
  bacterial_non_responder: {
    id: 'bacterial_non_responder',
    name: '2. Severe Bacterial Pneumonia (HFNC Failure & Delayed Intubation Risk)',
    patientSummary: '64yo female with right lower and middle lobe consolidation, septic shock responsive to fluids, persistent tachypnea on HFNC 60 L/min.',
    primaryDiagnosis: 'Community-Acquired Pneumonia / Sepsis',
    patientWeightKg: 68,
    initialVitals: {
      spo2: 89,
      fio2: 0.80,
      rr: 33,
      hr: 122,
      peakInspiratoryFlow: 90,
      accessoryMuscleUse: 'severe',
      tidalVolumePerKg: 9.8,
    },
    timepoints: [
      { hour: 0, spo2: 89, fio2: 0.80, respiratoryRate: 33, heartRate: 122, flowRateLpm: 60, roxIndex: 3.37 },
      { hour: 2, spo2: 90, fio2: 0.90, respiratoryRate: 34, heartRate: 125, flowRateLpm: 60, roxIndex: 2.94 },
      { hour: 6, spo2: 88, fio2: 1.00, respiratoryRate: 36, heartRate: 130, flowRateLpm: 60, roxIndex: 2.44 },
    ],
    clinicalTakeaway: 'Classic HFNC non-responder: ROX stays < 3.47 at 6h despite maximal flow. Prompt intubation avoids emergency crash intubation and reduces mortality.',
  },
  post_extubation_prophylaxis: {
    id: 'post_extubation_prophylaxis',
    name: '3. Post-Extubation High-Risk Prophylaxis',
    patientSummary: '72yo male with COPD/CHF overlap extubated after 4 days of mechanical ventilation. Placed on prophylactic HFNC to prevent reintubation.',
    primaryDiagnosis: 'Post-Extubation Respiratory Support',
    patientWeightKg: 80,
    initialVitals: {
      spo2: 95,
      fio2: 0.40,
      rr: 20,
      hr: 82,
      peakInspiratoryFlow: 45,
      accessoryMuscleUse: 'none',
      tidalVolumePerKg: 6.5,
    },
    timepoints: [
      { hour: 0, spo2: 95, fio2: 0.40, respiratoryRate: 20, heartRate: 82, flowRateLpm: 40, roxIndex: 11.88 },
      { hour: 2, spo2: 96, fio2: 0.35, respiratoryRate: 18, heartRate: 78, flowRateLpm: 40, roxIndex: 15.24 },
      { hour: 6, spo2: 95, fio2: 0.30, respiratoryRate: 16, heartRate: 74, flowRateLpm: 35, roxIndex: 19.79 },
    ],
    clinicalTakeaway: 'High-flow nasal cannula provides continuous airway dead space washout and mild PEEP, preventing post-extubation atelectasis and fatigue.',
  },
  psili_vigorous_effort: {
    id: 'psili_vigorous_effort',
    name: '4. Vigorous Respiratory Drive & P-SILI Risk',
    patientSummary: '46yo male with acute aspiration pneumonitis. Large tidal volumes (10.5 mL/kg), severe intercostal retractions, and borderline SpO2.',
    primaryDiagnosis: 'Aspiration Pneumonitis / Patient Self-Inflicted Lung Injury',
    patientWeightKg: 82,
    initialVitals: {
      spo2: 91,
      fio2: 0.70,
      rr: 31,
      hr: 116,
      peakInspiratoryFlow: 105,
      accessoryMuscleUse: 'severe',
      tidalVolumePerKg: 10.5,
    },
    timepoints: [
      { hour: 0, spo2: 91, fio2: 0.70, respiratoryRate: 31, heartRate: 116, flowRateLpm: 40, roxIndex: 4.19 },
      { hour: 2, spo2: 92, fio2: 0.75, respiratoryRate: 30, heartRate: 114, flowRateLpm: 50, roxIndex: 4.09 },
      { hour: 4, spo2: 90, fio2: 0.85, respiratoryRate: 32, heartRate: 120, flowRateLpm: 60, roxIndex: 3.31 },
    ],
    clinicalTakeaway: 'Vigorous respiratory effort causes negative intrathoracic pressure swings (estimated Delta Pes > 18 cmH2O) and pendelluft strain, exacerbating lung injury.',
  },
};
