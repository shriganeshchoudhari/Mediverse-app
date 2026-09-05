/**
 * CPETMetabolicErgometryEngine.ts
 * 
 * Cardiopulmonary Exercise Testing (CPET) & Metabolic Ergometry Engine
 * Implements Wasserman 9-Panel Diagnostic Framework, Hansen-Wasserman Normative Equations,
 * Beaver V-Slope Anaerobic Threshold (AT / VT1) & Respiratory Compensation Point (RCP / VT2) detection,
 * Ventilatory Efficiency (VE/VCO2 slope), Oxygen Pulse kinetics, Breathing Reserve, and Integrated Limitation Classification.
 * 
 * Location: frontend/.gemini/skills/CPETMetabolicErgometryEngine.ts
 */

export type ExercisePhase = 'REST' | 'UNLOADED' | 'RAMP' | 'PEAK' | 'RECOVERY';

export type BiologicalSex = 'M' | 'F';

export type LimitationType = 
  | 'NORMAL'
  | 'CARDIOVASCULAR'
  | 'VENTILATORY'
  | 'PULMONARY_VASCULAR'
  | 'METABOLIC_MYOPATHY'
  | 'SUBMAXIMAL_EFFORT';

export type WeberClass = 'CLASS_A' | 'CLASS_B' | 'CLASS_C' | 'CLASS_D';

export interface PatientDemographics {
  age: number;
  sex: BiologicalSex;
  heightCm: number;
  weightKg: number;
  fev1L: number;
  restingHr: number;
}

export interface CPETDataPoint {
  timeMinutes: number;
  timeSeconds: number;
  phase: ExercisePhase;
  workRateWatts: number;
  
  // Gas exchange
  vo2MlMin: number;
  vo2MlKgMin: number;
  vco2MlMin: number;
  rer: number; // VCO2 / VO2
  
  // Ventilation
  veLMin: number;
  peto2MmHg: number;
  petco2MmHg: number;
  veVo2: number; // VE / (VO2 / 1000)
  veVco2: number; // VE / (VCO2 / 1000)
  
  // Cardiovascular & Mechanics
  hrBpm: number;
  o2PulseMlBeat: number; // VO2 / HR
  vtL: number; // Tidal volume
  bfBreathsMin: number; // Breathing frequency
  spo2Percent: number; // Pulse oximetry
}

export interface CPETSummary {
  vo2PredictedMlMin: number;
  vo2PredictedMlKgMin: number;
  vo2PeakMlMin: number;
  vo2PeakMlKgMin: number;
  vo2PeakPercentPred: number;
  
  // Anaerobic Threshold & RCP
  atTimeMinutes: number;
  vo2AtMlKgMin: number;
  vo2AtPercentVo2Peak: number;
  rcpTimeMinutes: number;
  
  // Efficiency & Effort
  rerPeak: number;
  veVco2Slope: number;
  veVco2AtAt: number;
  petco2AtMmHg: number;
  petco2PeakMmHg: number;
  
  // Reserves
  peakHrBpm: number;
  predictedMaxHrBpm: number;
  hrReserveBpm: number;
  peakWorkWatts: number;
  peakVeLMin: number;
  mvvLMin: number;
  breathingReservePercent: number; // (MVV - PeakVE)/MVV * 100
  
  // Pulse & Oxygenation
  peakO2PulseMlBeat: number;
  peakO2PulsePercentPred: number;
  o2PulseMorphology: 'NORMAL_RISE' | 'ISCHEMIC_PLATEAU' | 'DECLINE';
  lowestSpo2Percent: number;
  
  // Diagnostic Classification
  limitationType: LimitationType;
  limitationExplanation: string;
  weberClass?: WeberClass;
}

export interface CPETPreset {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  patient: PatientDemographics;
  description: string;
  pathophysiologyFocus: string;
  clinicalTakeaway: string;
  rampRateWattsMin: number;
}

/**
 * Hansen-Wasserman Normative Equations for Predicted VO2 Peak (Cycle Ergometry)
 */
export function calculatePredictedVO2Peak(demographics: PatientDemographics): {
  vo2PredictedMlMin: number;
  vo2PredictedMlKgMin: number;
} {
  const { age, sex, heightCm, weightKg } = demographics;
  
  // Ideal body weight (Broca's index / modified Devine for CPET)
  const idealWeightKg = sex === 'M'
    ? 50 + 0.91 * (heightCm - 152.4)
    : 45.5 + 0.91 * (heightCm - 152.4);

  // If actual weight exceeds ideal, use predicted weight calculation
  const weightUsed = weightKg > idealWeightKg 
    ? idealWeightKg + 0.5 * (weightKg - idealWeightKg)
    : weightKg;

  let predictedLMin: number;
  if (sex === 'M') {
    // Wasserman/Hansen Cycle: (wt * (50.72 - 0.372 * age)) / 1000 or simplified standard
    predictedLMin = (weightUsed * (50.72 - 0.372 * age) / 1000) * (heightCm / 175);
  } else {
    predictedLMin = (weightUsed * (42.85 - 0.312 * age) / 1000) * (heightCm / 162);
  }

  const vo2PredictedMlMin = Math.max(800, Math.round(predictedLMin * 1000));
  const vo2PredictedMlKgMin = +(vo2PredictedMlMin / weightKg).toFixed(1);

  return { vo2PredictedMlMin, vo2PredictedMlKgMin };
}

/**
 * Maximum Voluntary Ventilation (MVV) Estimation
 * Typically measured directly or calculated as FEV1 * 40 (or FEV1 * 35-40)
 */
export function calculateMVV(fev1L: number): number {
  return +(fev1L * 40).toFixed(1);
}

/**
 * Breathing Reserve (BR)
 * BR = ((MVV - PeakVE) / MVV) * 100
 * Normal >= 15-20% (or Peak VE < 80-85% of MVV)
 */
export function calculateBreathingReserve(peakVeLMin: number, mvvLMin: number): number {
  if (mvvLMin <= 0) return 0;
  const br = ((mvvLMin - peakVeLMin) / mvvLMin) * 100;
  return +br.toFixed(1);
}

/**
 * Age-predicted Maximal Heart Rate
 * Astrand-Ryhming standard: 220 - age
 */
export function calculatePredictedMaxHR(age: number): number {
  return Math.max(100, 220 - age);
}

/**
 * Linear regression slope for VE vs VCO2 (Ventilatory Efficiency)
 * Evaluated from start of exercise to Respiratory Compensation Point (RCP)
 */
export function calculateVeVco2Slope(data: CPETDataPoint[], rcpTimeMinutes?: number): number {
  const points = data.filter(d => 
    d.phase === 'RAMP' || d.phase === 'PEAK'
  ).filter(d => rcpTimeMinutes ? d.timeMinutes <= rcpTimeMinutes : true);

  if (points.length < 3) return 28.0;

  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;
  const n = points.length;

  for (const pt of points) {
    const x = pt.vco2MlMin / 1000; // VCO2 in L/min
    const y = pt.veLMin;           // VE in L/min
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (denominator === 0) return 28.0;

  const slope = (n * sumXY - sumX * sumY) / denominator;
  return +slope.toFixed(1);
}

/**
 * Automatic detection of Anaerobic Threshold (AT / VT1) via V-Slope & Ventilatory Equivalents
 */
export function detectAnaerobicThreshold(data: CPETDataPoint[]): {
  atIndex: number;
  timeMinutes: number;
  vo2MlKgMin: number;
  workRateWatts: number;
} {
  const rampPoints = data.filter(d => d.phase === 'RAMP' || d.phase === 'PEAK');
  if (rampPoints.length === 0) {
    return { atIndex: 0, timeMinutes: 0, vo2MlKgMin: 0, workRateWatts: 0 };
  }

  // Find nadir of VE/VO2 while VE/VCO2 has not started its steep secondary rise
  let minVeVo2 = Infinity;
  let candidate = rampPoints[Math.floor(rampPoints.length * 0.45)]; // Default ~45% into exercise

  for (let i = 1; i < rampPoints.length - 2; i++) {
    const pt = rampPoints[i];
    if (pt.rer >= 0.85 && pt.rer <= 1.02) {
      if (pt.veVo2 < minVeVo2) {
        minVeVo2 = pt.veVo2;
        candidate = pt;
      }
    }
  }

  const atIndex = data.findIndex(d => d.timeMinutes === candidate.timeMinutes);
  return {
    atIndex: atIndex >= 0 ? atIndex : 0,
    timeMinutes: candidate.timeMinutes,
    vo2MlKgMin: candidate.vo2MlKgMin,
    workRateWatts: candidate.workRateWatts,
  };
}

/**
 * Automatic detection of Respiratory Compensation Point (RCP / VT2)
 */
export function detectRespiratoryCompensationPoint(data: CPETDataPoint[]): {
  rcpIndex: number;
  timeMinutes: number;
  vo2MlKgMin: number;
} {
  const rampPoints = data.filter(d => d.phase === 'RAMP' || d.phase === 'PEAK');
  if (rampPoints.length === 0) {
    return { rcpIndex: 0, timeMinutes: 0, vo2MlKgMin: 0 };
  }

  // RCP is the nadir of VE/VCO2 after AT (typically RER > 1.00)
  let minVeVco2 = Infinity;
  let candidate = rampPoints[Math.floor(rampPoints.length * 0.75)]; // Default ~75%

  for (let i = 1; i < rampPoints.length; i++) {
    const pt = rampPoints[i];
    if (pt.rer >= 1.00) {
      if (pt.veVco2 < minVeVco2) {
        minVeVco2 = pt.veVco2;
        candidate = pt;
      }
    }
  }

  const rcpIndex = data.findIndex(d => d.timeMinutes === candidate.timeMinutes);
  return {
    rcpIndex: rcpIndex >= 0 ? rcpIndex : 0,
    timeMinutes: candidate.timeMinutes,
    vo2MlKgMin: candidate.vo2MlKgMin,
  };
}

/**
 * Diagnostic Limitation Classifier
 * Evaluates breathing reserve, VO2 peak % predicted, VE/VCO2 slope, O2 pulse kinetics, and RER
 */
export function classifyExerciseLimitation(
  metrics: {
    vo2PeakPercentPred: number;
    vo2PeakMlKgMin: number;
    rerPeak: number;
    breathingReservePercent: number;
    veVco2Slope: number;
    hrReserveBpm: number;
    o2PulseMorphology: 'NORMAL_RISE' | 'ISCHEMIC_PLATEAU' | 'DECLINE';
    lowestSpo2Percent: number;
    vo2AtPercentVo2Peak: number;
    petco2PeakMmHg: number;
  }
): {
  limitationType: LimitationType;
  limitationExplanation: string;
  weberClass?: WeberClass;
} {
  const {
    vo2PeakPercentPred,
    vo2PeakMlKgMin,
    rerPeak,
    breathingReservePercent,
    veVco2Slope,
    hrReserveBpm,
    o2PulseMorphology,
    lowestSpo2Percent,
    vo2AtPercentVo2Peak,
    petco2PeakMmHg,
  } = metrics;

  // 1. Submaximal Effort Check
  if (rerPeak < 1.05 && hrReserveBpm > 20 && breathingReservePercent > 25) {
    return {
      limitationType: 'SUBMAXIMAL_EFFORT',
      limitationExplanation: `Peak RER (${rerPeak.toFixed(2)} < 1.05) indicates submaximal volitional effort without reaching physiological cardiopulmonary exhaustion. Significant breathing reserve (${breathingReservePercent.toFixed(1)}%) and heart rate reserve (${hrReserveBpm} bpm) remain untapped.`,
    };
  }

  // 2. Ventilatory Limitation (COPD / Mechanical Pulmonary)
  if ((breathingReservePercent < 15 || lowestSpo2Percent < 90) && vo2PeakPercentPred < 85) {
    return {
      limitationType: 'VENTILATORY',
      limitationExplanation: `Breathing reserve is critically exhausted (${breathingReservePercent.toFixed(1)}% < 15%) alongside reduced peak aerobic capacity (${vo2PeakPercentPred.toFixed(0)}% pred), indicating mechanical ventilatory limitation (airway obstruction/dynamic hyperinflation). Preserved heart rate reserve (${hrReserveBpm} bpm) and ${lowestSpo2Percent < 90 ? `exertional desaturation to ${lowestSpo2Percent}%` : 'preserved circulatory reserve'} confirm primary pulmonary etiology.`,
    };
  }

  // 3. Pulmonary Vascular Limitation (PAH)
  if (veVco2Slope > 40 && petco2PeakMmHg < 30) {
    return {
      limitationType: 'PULMONARY_VASCULAR',
      limitationExplanation: `Severely elevated VE/VCO2 slope (${veVco2Slope.toFixed(1)} > 40) paired with abnormally depressed end-tidal CO2 (PETCO2 = ${petco2PeakMmHg} mmHg) signifies increased physiological dead space ventilation (VD/VT mismatch), characteristic of Pulmonary Arterial Hypertension or chronic thromboembolic pulmonary disease.`,
    };
  }

  // 4. Metabolic / Mitochondrial Myopathy
  if (vo2AtPercentVo2Peak < 40 && vo2PeakPercentPred < 75 && veVco2Slope < 38 && o2PulseMorphology === 'NORMAL_RISE') {
    return {
      limitationType: 'METABOLIC_MYOPATHY',
      limitationExplanation: `Markedly premature Anaerobic Threshold (${(vo2AtPercentVo2Peak).toFixed(0)}% of peak VO2, normal > 50-60%) with early profound lactic acidosis despite normal lung mechanics and stroke volume rise. Consistent with mitochondrial cytopathy or severe peripheral muscle deconditioning impairing oxidative phosphorylation.`,
    };
  }

  // 5. Cardiovascular / Circulatory Limitation (Heart Failure, Ischemia)
  if (vo2PeakPercentPred < 80 || o2PulseMorphology !== 'NORMAL_RISE' || veVco2Slope > 34) {
    let weber: WeberClass = 'CLASS_A';
    if (vo2PeakMlKgMin > 20) weber = 'CLASS_A';
    else if (vo2PeakMlKgMin >= 16) weber = 'CLASS_B';
    else if (vo2PeakMlKgMin >= 10) weber = 'CLASS_C';
    else weber = 'CLASS_D';

    return {
      limitationType: 'CARDIOVASCULAR',
      limitationExplanation: `Reduced VO2 peak (${vo2PeakPercentPred.toFixed(0)}% predicted) with ${o2PulseMorphology === 'ISCHEMIC_PLATEAU' ? 'premature O2 pulse flattening/downward deflection consistent with myocardial ischemia' : 'circulatory stroke volume limitation'}. Elevated VE/VCO2 slope (${veVco2Slope.toFixed(1)}) and early AT align with Weber ${weber.replace('_', ' ')} heart failure functional impairment.`,
      weberClass: weber,
    };
  }

  // 6. Normal Response
  return {
    limitationType: 'NORMAL',
    limitationExplanation: `Normal physiological exercise response: VO2 peak exceeds 85% of predicted (${vo2PeakPercentPred.toFixed(0)}%), normal Anaerobic Threshold (> 50% peak VO2), normal ventilatory efficiency (VE/VCO2 slope ${veVco2Slope.toFixed(1)} < 30), and preserved breathing reserve (${breathingReservePercent.toFixed(1)}% > 15%).`,
  };
}

/**
 * Clinical Presets Definition
 */
export const CPET_PRESETS: CPETPreset[] = [
  {
    id: 'healthy-active',
    name: 'Healthy Active Adult',
    subtitle: 'Normal Cardiopulmonary Physiology',
    category: 'Physiology Baseline',
    patient: {
      age: 38,
      sex: 'M',
      heightCm: 178,
      weightKg: 75,
      fev1L: 4.2,
      restingHr: 68,
    },
    rampRateWattsMin: 20,
    description: 'Normal aerobic capacity, preserved breathing reserve, linear stroke volume kinetics, normal ventilatory efficiency slope.',
    pathophysiologyFocus: 'Symmetrical rise in VO2 and work rate (10 mL/min/W), AT at 58% peak VO2, RER >= 1.12 confirming maximal effort.',
    clinicalTakeaway: 'Normal test rules out significant occult cardiovascular, mechanical ventilatory, or pulmonary vascular pathology.',
  },
  {
    id: 'hfref-weber-c',
    name: 'Heart Failure (HFrEF - Weber C)',
    subtitle: 'Low Output Circulatory Limitation',
    category: 'Cardiology',
    patient: {
      age: 62,
      sex: 'M',
      heightCm: 172,
      weightKg: 82,
      fev1L: 3.4,
      restingHr: 78,
    },
    rampRateWattsMin: 10,
    description: 'Severe left ventricular systolic failure (EF 25%), early anaerobic threshold, flattened O2 pulse, and elevated VE/VCO2 slope > 36.',
    pathophysiologyFocus: 'Inadequate stroke volume augmentation with high pulmonary capillary wedge pressures drives dead-space ventilation and early acidosis.',
    clinicalTakeaway: 'Peak VO2 < 14 mL/kg/min and VE/VCO2 slope > 35 are key guideline criteria for heart transplant or LVAD referral (ISHLT guidelines).',
  },
  {
    id: 'copd-ventilatory',
    name: 'Severe COPD (GOLD Stage 3)',
    subtitle: 'Mechanical Ventilatory Limitation',
    category: 'Pulmonology',
    patient: {
      age: 65,
      sex: 'M',
      heightCm: 170,
      weightKg: 68,
      fev1L: 1.35, // Severe obstruction
      restingHr: 82,
    },
    rampRateWattsMin: 10,
    description: 'Flow limitation with dynamic hyperinflation, exhaustion of breathing reserve (BR < 10%), tidal volume plateau, and exertional hypoxemia.',
    pathophysiologyFocus: 'Peak VE collides with MVV (FEV1 * 40 = 54 L/min). Patient terminates exercise due to overwhelming dyspnea while heart rate reserve remains high.',
    clinicalTakeaway: 'Breathing reserve < 15% definitively establishes ventilatory limitation as the primary cause of exercise intolerance.',
  },
  {
    id: 'pah-vascular',
    name: 'Pulmonary Arterial Hypertension (PAH)',
    subtitle: 'Dead-Space Ventilation & RV Limitation',
    category: 'Vascular Pulmonology',
    patient: {
      age: 44,
      sex: 'F',
      heightCm: 164,
      weightKg: 60,
      fev1L: 2.9,
      restingHr: 86,
    },
    rampRateWattsMin: 15,
    description: 'Markedly elevated VE/VCO2 slope > 48, abnormally low PETCO2 (< 30 mmHg) at rest and exercise, right ventricular stroke volume failure.',
    pathophysiologyFocus: 'Pulmonary microvascular obliteration causes severe ventilation-perfusion mismatch (high dead space VD/VT) and blunted RV cardiac output.',
    clinicalTakeaway: 'High VE/VCO2 slope with depressed PETCO2 is a hallmark diagnostic and prognostic biomarker in WHO Group 1 PAH.',
  },
  {
    id: 'mitochondrial-myopathy',
    name: 'Mitochondrial Cytopathy',
    subtitle: 'Peripheral Oxygen Extraction Defect',
    category: 'Neuromuscular & Genetics',
    patient: {
      age: 29,
      sex: 'F',
      heightCm: 166,
      weightKg: 55,
      fev1L: 3.1,
      restingHr: 72,
    },
    rampRateWattsMin: 15,
    description: 'Early lactate surge with AT < 35% of predicted VO2 peak, hyperdynamic central circulation, but impaired cellular O2 extraction.',
    pathophysiologyFocus: 'Failure of mitochondrial oxidative phosphorylation triggers immediate anaerobic glycolysis, driving intense hyperventilation at trivial workloads.',
    clinicalTakeaway: 'Disproportionately low AT with normal lung function and preserved or high cardiac output points directly to mitochondrial or metabolic muscle disease.',
  },
  {
    id: 'elite-athlete',
    name: 'Elite Endurance Cyclist',
    subtitle: 'Supranormal Aerobic Performance',
    category: 'Sports & Performance',
    patient: {
      age: 26,
      sex: 'M',
      heightCm: 182,
      weightKg: 72,
      fev1L: 5.6,
      restingHr: 44,
    },
    rampRateWattsMin: 25,
    description: 'Supranormal VO2 peak (> 65 mL/kg/min, 160% predicted), delayed anaerobic threshold (> 75%), massive O2 pulse > 25 mL/beat.',
    pathophysiologyFocus: 'Huge eccentric cardiac hypertrophy delivers massive stroke volume (200 mL). High alveolar-capillary diffusion capacity with mild exercise-induced arterial hypoxemia.',
    clinicalTakeaway: 'Demonstrates maximum physiological human performance envelope and ceiling of integrated cardiopulmonary coupling.',
  },
];

/**
 * Synthetic CPET Ramp Protocol Generator
 * Accurately models continuous breath-by-breath kinetics across the 9 Wasserman panels
 */
export function generateSyntheticCPETData(
  presetId: string,
  customDemographics?: Partial<PatientDemographics>,
  customRampRate?: number
): { data: CPETDataPoint[]; summary: CPETSummary } {
  const preset = CPET_PRESETS.find(p => p.id === presetId) || CPET_PRESETS[0];
  const patient: PatientDemographics = {
    ...preset.patient,
    ...customDemographics,
  };

  const { vo2PredictedMlMin, vo2PredictedMlKgMin } = calculatePredictedVO2Peak(patient);
  const mvvLMin = calculateMVV(patient.fev1L);
  const predictedMaxHrBpm = calculatePredictedMaxHR(patient.age);
  const rampRate = customRampRate || preset.rampRateWattsMin;

  // Protocol phase timings
  const restMinutes = 2.0;
  const unloadedMinutes = 2.0;
  
  // Ramp duration varies by pathology
  let rampDurationMinutes = 8.0;
  if (preset.id === 'hfref-weber-c') rampDurationMinutes = 5.0;
  if (preset.id === 'copd-ventilatory') rampDurationMinutes = 4.5;
  if (preset.id === 'pah-vascular') rampDurationMinutes = 6.0;
  if (preset.id === 'mitochondrial-myopathy') rampDurationMinutes = 5.5;
  if (preset.id === 'elite-athlete') rampDurationMinutes = 11.0;

  const peakMinutes = restMinutes + unloadedMinutes + rampDurationMinutes;
  const recoveryMinutes = 3.0;
  const totalMinutes = peakMinutes + recoveryMinutes;

  const data: CPETDataPoint[] = [];
  const stepSeconds = 15; // 15-second averaged intervals
  const totalSteps = Math.floor((totalMinutes * 60) / stepSeconds);

  // Peak metrics calibrated to pathology
  let targetPeakVo2MlKgMin = 38.0;
  let atFraction = 0.55;
  let rcpFraction = 0.75;
  let o2PulseMorphology: 'NORMAL_RISE' | 'ISCHEMIC_PLATEAU' | 'DECLINE' = 'NORMAL_RISE';
  let targetVeVco2Slope = 26.0;
  let baselinePetco2 = 40.0;
  let peakSpo2 = 98.0;

  switch (preset.id) {
    case 'hfref-weber-c':
      targetPeakVo2MlKgMin = 12.8; // Weber C
      atFraction = 0.38;
      rcpFraction = 0.65;
      o2PulseMorphology = 'ISCHEMIC_PLATEAU';
      targetVeVco2Slope = 38.5;
      baselinePetco2 = 34.0;
      peakSpo2 = 96.0;
      break;
    case 'copd-ventilatory':
      targetPeakVo2MlKgMin = 15.2;
      atFraction = 0.52;
      rcpFraction = 0.70;
      o2PulseMorphology = 'NORMAL_RISE';
      targetVeVco2Slope = 32.0;
      baselinePetco2 = 42.0;
      peakSpo2 = 87.0; // Desaturation
      break;
    case 'pah-vascular':
      targetPeakVo2MlKgMin = 16.5;
      atFraction = 0.45;
      rcpFraction = 0.68;
      o2PulseMorphology = 'DECLINE';
      targetVeVco2Slope = 48.0; // Extremely high
      baselinePetco2 = 27.0; // Depressed dead space
      peakSpo2 = 91.0;
      break;
    case 'mitochondrial-myopathy':
      targetPeakVo2MlKgMin = 19.5;
      atFraction = 0.32; // Very early AT
      rcpFraction = 0.55;
      o2PulseMorphology = 'NORMAL_RISE';
      targetVeVco2Slope = 34.0;
      baselinePetco2 = 36.0;
      peakSpo2 = 98.0;
      break;
    case 'elite-athlete':
      targetPeakVo2MlKgMin = 68.5;
      atFraction = 0.75; // Late AT
      rcpFraction = 0.88;
      o2PulseMorphology = 'NORMAL_RISE';
      targetVeVco2Slope = 24.0;
      baselinePetco2 = 42.0;
      peakSpo2 = 94.0; // Mild hypoxemia from rapid transit
      break;
    default: // healthy
      targetPeakVo2MlKgMin = +(vo2PredictedMlKgMin * 1.04).toFixed(1);
      atFraction = 0.58;
      rcpFraction = 0.78;
      o2PulseMorphology = 'NORMAL_RISE';
      targetVeVco2Slope = 26.5;
      baselinePetco2 = 40.0;
      peakSpo2 = 98.0;
      break;
  }

  const atTimeMinutes = restMinutes + unloadedMinutes + rampDurationMinutes * atFraction;
  const rcpTimeMinutes = restMinutes + unloadedMinutes + rampDurationMinutes * rcpFraction;

  let peakWorkWatts = 0;
  let peakHrBpm = patient.restingHr;
  let peakVeLMin = 10;
  let peakVo2MlMin = 300;
  let peakVco2MlMin = 250;
  let peakO2Pulse = 4.0;
  let lowestSpo2Percent = 100;
  let petco2AtMmHg = baselinePetco2;
  let petco2PeakMmHg = baselinePetco2;

  for (let i = 0; i <= totalSteps; i++) {
    const timeSeconds = i * stepSeconds;
    const timeMinutes = +(timeSeconds / 60).toFixed(2);

    let phase: ExercisePhase = 'REST';
    let progress = 0; // 0 to 1 along ramp
    let workWatts = 0;

    if (timeMinutes < restMinutes) {
      phase = 'REST';
      workWatts = 0;
    } else if (timeMinutes < restMinutes + unloadedMinutes) {
      phase = 'UNLOADED';
      workWatts = 10;
    } else if (timeMinutes <= peakMinutes) {
      phase = timeMinutes >= peakMinutes - 0.25 ? 'PEAK' : 'RAMP';
      const rampElapsedMin = timeMinutes - (restMinutes + unloadedMinutes);
      progress = Math.min(1.0, rampElapsedMin / rampDurationMinutes);
      workWatts = Math.round(10 + rampElapsedMin * rampRate);
    } else {
      phase = 'RECOVERY';
      const recoveryElapsedMin = timeMinutes - peakMinutes;
      progress = Math.max(0, 1.0 - recoveryElapsedMin / recoveryMinutes);
      workWatts = Math.round(20 * (1 - recoveryElapsedMin / recoveryMinutes));
    }

    if (workWatts > peakWorkWatts) peakWorkWatts = workWatts;

    // Resting basal values
    const restingVo2 = +(3.5 * patient.weightKg).toFixed(0); // 1 MET
    const targetPeakVo2Total = targetPeakVo2MlKgMin * patient.weightKg;

    // VO2 kinetics
    let currentVo2 = 0;
    if (phase === 'REST') {
      currentVo2 = restingVo2 + (Math.sin(timeSeconds) * 15);
    } else if (phase === 'UNLOADED') {
      currentVo2 = restingVo2 + 150 + (Math.sin(timeSeconds) * 20);
    } else if (phase === 'RAMP' || phase === 'PEAK') {
      // Linear work rate vs VO2 relationship (~10 mL/min/Watt)
      const vo2Range = targetPeakVo2Total - (restingVo2 + 150);
      currentVo2 = restingVo2 + 150 + vo2Range * Math.pow(progress, 1.02);
    } else {
      // Recovery exponential decay
      const recoveryElapsed = timeMinutes - peakMinutes;
      currentVo2 = restingVo2 + (targetPeakVo2Total - restingVo2) * Math.exp(-recoveryElapsed * 1.1);
    }

    currentVo2 = Math.max(restingVo2, Math.round(currentVo2));
    const vo2MlKgMin = +(currentVo2 / patient.weightKg).toFixed(1);

    // VCO2 & RER kinetics (RER shifts through AT and peak)
    let currentRer = 0.82;
    if (phase === 'REST') {
      currentRer = 0.80 + Math.sin(timeSeconds * 0.1) * 0.02;
    } else if (phase === 'UNLOADED') {
      currentRer = 0.83;
    } else if (phase === 'RAMP' || phase === 'PEAK') {
      if (timeMinutes < atTimeMinutes) {
        // Pre-AT: RER stable 0.82 - 0.92
        const subAtProgress = (timeMinutes - (restMinutes + unloadedMinutes)) / (atTimeMinutes - (restMinutes + unloadedMinutes));
        currentRer = 0.83 + 0.12 * Math.max(0, subAtProgress);
      } else if (timeMinutes < rcpTimeMinutes) {
        // Between AT and RCP: lactic acid buffering generates excess VCO2
        const postAtProgress = (timeMinutes - atTimeMinutes) / (rcpTimeMinutes - atTimeMinutes);
        currentRer = 0.95 + 0.12 * postAtProgress;
      } else {
        // Post-RCP: hyperventilation pushes RER past 1.10
        const postRcpProgress = (timeMinutes - rcpTimeMinutes) / (peakMinutes - rcpTimeMinutes);
        currentRer = 1.07 + 0.11 * postRcpProgress;
      }
    } else {
      // Early recovery: RER surges because VO2 drops faster than VCO2
      const recoveryElapsed = timeMinutes - peakMinutes;
      currentRer = Math.max(0.85, 1.18 - recoveryElapsed * 0.1);
    }

    const currentVco2 = Math.round(currentVo2 * currentRer);

    // Heart rate kinetics
    let hr = patient.restingHr;
    if (phase === 'REST') {
      hr = patient.restingHr + Math.sin(timeSeconds * 0.2) * 2;
    } else if (phase === 'UNLOADED') {
      hr = patient.restingHr + 14;
    } else if (phase === 'RAMP' || phase === 'PEAK') {
      const maxPossibleHr = preset.id === 'copd-ventilatory'
        ? patient.restingHr + (predictedMaxHrBpm - patient.restingHr) * 0.65 // Preserved HRR in COPD
        : preset.id === 'hfref-weber-c'
        ? patient.restingHr + (predictedMaxHrBpm - patient.restingHr) * 0.72 // Chronotropic limit
        : predictedMaxHrBpm * 0.96;
      hr = Math.round(patient.restingHr + 14 + (maxPossibleHr - (patient.restingHr + 14)) * progress);
    } else {
      const recoveryElapsed = timeMinutes - peakMinutes;
      hr = Math.round(patient.restingHr + (peakHrBpm - patient.restingHr) * Math.exp(-recoveryElapsed * 0.8));
    }

    if (hr > peakHrBpm) peakHrBpm = hr;

    // O2 pulse (VO2 / HR)
    let o2Pulse = +(currentVo2 / hr).toFixed(1);
    if (o2PulseMorphology === 'ISCHEMIC_PLATEAU' && progress > 0.5) {
      // Pathologic plateau
      o2Pulse = +(Math.min(o2Pulse, 9.8 + (progress - 0.5) * 0.4)).toFixed(1);
    } else if (o2PulseMorphology === 'DECLINE' && progress > 0.6) {
      o2Pulse = +(Math.max(6.0, 10.2 - (progress - 0.6) * 4.0)).toFixed(1);
    }

    // Ventilation (VE)
    let ve = 8.0;
    if (phase === 'REST') {
      ve = 8.5 + Math.sin(timeSeconds * 0.3) * 0.5;
    } else if (phase === 'UNLOADED') {
      ve = 16.0;
    } else if (phase === 'RAMP' || phase === 'PEAK') {
      // Driven by VCO2 and VE/VCO2 slope
      const vco2LMin = currentVco2 / 1000;
      let effectiveSlope = targetVeVco2Slope;
      if (timeMinutes > rcpTimeMinutes) {
        // Hyperventilatory inflection post-RCP
        effectiveSlope += 8 * (timeMinutes - rcpTimeMinutes);
      }
      ve = 4.0 + (vco2LMin * effectiveSlope);
      // Clamp to mechanical MVV ceiling if COPD
      if (preset.id === 'copd-ventilatory') {
        ve = Math.min(mvvLMin * 0.95, ve);
      }
    } else {
      const recoveryElapsed = timeMinutes - peakMinutes;
      ve = 12.0 + (peakVeLMin - 12.0) * Math.exp(-recoveryElapsed * 0.7);
    }
    ve = +ve.toFixed(1);

    // Ventilatory equivalents
    const veVo2 = +(ve / (currentVo2 / 1000)).toFixed(1);
    const veVco2 = +(ve / (currentVco2 / 1000)).toFixed(1);

    // End-Tidal Gas Tensions (PETO2 & PETCO2)
    let peto2 = 102;
    let petco2 = baselinePetco2;
    if (phase === 'REST' || phase === 'UNLOADED') {
      peto2 = 100;
      petco2 = baselinePetco2;
    } else if (phase === 'RAMP' || phase === 'PEAK') {
      if (timeMinutes < atTimeMinutes) {
        // Pre-AT: PETCO2 increases slightly, PETO2 decreases slightly
        petco2 = baselinePetco2 + 3 * progress;
        peto2 = 98 - 3 * progress;
      } else if (timeMinutes < rcpTimeMinutes) {
        // Post-AT / Pre-RCP: PETCO2 plateaus at maximal value
        petco2 = baselinePetco2 + 4;
        peto2 = 98 + 4 * ((timeMinutes - atTimeMinutes) / (rcpTimeMinutes - atTimeMinutes));
      } else {
        // Post-RCP: vigorous hyperventilation blows off CO2 (PETCO2 drops, PETO2 rises)
        const postRcp = (timeMinutes - rcpTimeMinutes) / (peakMinutes - rcpTimeMinutes);
        petco2 = baselinePetco2 + 4 - 8 * postRcp;
        peto2 = 104 + 10 * postRcp;
      }
    } else {
      petco2 = baselinePetco2;
      peto2 = 102;
    }
    peto2 = +peto2.toFixed(1);
    petco2 = +petco2.toFixed(1);

    // Respiration Mechanics (VT and BF)
    let vt = 0.5;
    let bf = 14;
    if (preset.id === 'copd-ventilatory') {
      // COPD shallow rapid breathing pattern
      vt = Math.min(1.1, 0.5 + 0.6 * progress);
      bf = Math.round(ve / vt);
    } else {
      // Normal Hey plot: VT expands up to ~55-60% of vital capacity, then BF accelerates
      const maxVt = patient.fev1L * 0.75;
      vt = +(Math.min(maxVt, 0.6 + (maxVt - 0.6) * Math.pow(progress, 0.8))).toFixed(2);
      bf = Math.round(ve / vt);
    }

    // SpO2 desaturation modeling
    let spo2 = 98;
    if (phase === 'RAMP' || phase === 'PEAK') {
      spo2 = Math.round(98 - (98 - peakSpo2) * Math.pow(progress, 1.4));
    } else if (phase === 'RECOVERY') {
      spo2 = Math.round(peakSpo2 + (98 - peakSpo2) * 0.5);
    }
    if (spo2 < lowestSpo2Percent) lowestSpo2Percent = spo2;

    if (phase === 'PEAK' || (phase === 'RAMP' && currentVo2 > peakVo2MlMin)) {
      peakVo2MlMin = currentVo2;
      peakVco2MlMin = currentVco2;
      peakVeLMin = ve;
      peakO2Pulse = o2Pulse;
      petco2PeakMmHg = petco2;
    }

    if (Math.abs(timeMinutes - atTimeMinutes) < 0.25) {
      petco2AtMmHg = petco2;
    }

    data.push({
      timeMinutes,
      timeSeconds,
      phase,
      workRateWatts: workWatts,
      vo2MlMin: currentVo2,
      vo2MlKgMin,
      vco2MlMin: currentVco2,
      rer: +currentRer.toFixed(2),
      veLMin: ve,
      peto2MmHg: peto2,
      petco2MmHg: petco2,
      veVo2,
      veVco2,
      hrBpm: hr,
      o2PulseMlBeat: o2Pulse,
      vtL: vt,
      bfBreathsMin: bf,
      spo2Percent: spo2,
    });
  }

  const peakVo2MlKgMin = +(peakVo2MlMin / patient.weightKg).toFixed(1);
  const vo2PeakPercentPred = +((peakVo2MlMin / vo2PredictedMlMin) * 100).toFixed(1);
  const atVo2 = +(targetPeakVo2MlKgMin * atFraction).toFixed(1);
  const vo2AtPercentVo2Peak = +((atVo2 / peakVo2MlKgMin) * 100).toFixed(0);
  const breathingReserve = calculateBreathingReserve(peakVeLMin, mvvLMin);
  const hrReserve = Math.max(0, predictedMaxHrBpm - peakHrBpm);
  const calculatedSlope = calculateVeVco2Slope(data, rcpTimeMinutes);
  const rerPeak = +(data.reduce((max, d) => Math.max(max, d.rer), 0.8)).toFixed(2);

  const predictedO2Pulse = +(vo2PredictedMlMin / predictedMaxHrBpm).toFixed(1);
  const peakO2PulsePercentPred = +((peakO2Pulse / predictedO2Pulse) * 100).toFixed(0);

  const { limitationType, limitationExplanation, weberClass } = classifyExerciseLimitation({
    vo2PeakPercentPred,
    vo2PeakMlKgMin: peakVo2MlKgMin,
    rerPeak,
    breathingReservePercent: breathingReserve,
    veVco2Slope: calculatedSlope,
    hrReserveBpm: hrReserve,
    o2PulseMorphology,
    lowestSpo2Percent,
    vo2AtPercentVo2Peak,
    petco2PeakMmHg,
  });

  const summary: CPETSummary = {
    vo2PredictedMlMin,
    vo2PredictedMlKgMin,
    vo2PeakMlMin: peakVo2MlMin,
    vo2PeakMlKgMin: peakVo2MlKgMin,
    vo2PeakPercentPred,
    atTimeMinutes,
    vo2AtMlKgMin: atVo2,
    vo2AtPercentVo2Peak,
    rcpTimeMinutes,
    rerPeak,
    veVco2Slope: calculatedSlope,
    veVco2AtAt: +(targetVeVco2Slope).toFixed(1),
    petco2AtMmHg,
    petco2PeakMmHg,
    peakHrBpm,
    predictedMaxHrBpm,
    hrReserveBpm: hrReserve,
    peakWorkWatts,
    peakVeLMin,
    mvvLMin,
    breathingReservePercent: breathingReserve,
    peakO2PulseMlBeat: peakO2Pulse,
    peakO2PulsePercentPred,
    o2PulseMorphology,
    lowestSpo2Percent,
    limitationType,
    limitationExplanation,
    weberClass,
  };

  return { data, summary };
}
