/**
 * ArdsMechanicsEngine.ts
 * Acute Respiratory Distress Syndrome (ARDS) Berlin Definition,
 * Lung-Protective Mechanical Ventilation (ARDSNet PBW),
 * Driving Pressure (Delta P), Respiratory System Compliance (Crs),
 * Mechanical Power (Gattinoni equation), and PROSEVA / EOLIA Escalation Pathways.
 * Location: frontend/.gemini/skills/ArdsMechanicsEngine.ts
 */

export type PatientGender = 'MALE' | 'FEMALE';
export type BerlinArdsSeverity = 'NONE_OR_AT_RISK' | 'MILD_ARDS' | 'MODERATE_ARDS' | 'SEVERE_ARDS';
export type ArdsSubphenotype = 'HYPO_INFLAMMATORY_PHENOTYPE_1' | 'HYPER_INFLAMMATORY_PHENOTYPE_2';

export interface ArdsPatientInput {
  gender: PatientGender;
  heightCm: number; // e.g. 140 to 205 cm
  actualWeightKg: number; // e.g. 45 to 150 kg
  // Blood Gas & Oxygenation
  pao2MmHg: number; // e.g. 45 to 250 mmHg
  fio2Percent: number; // e.g. 21 to 100 % (0.21 to 1.0)
  arterialBloodPh: number; // e.g. 7.10 to 7.48
  serumBicarbonateMeqL: number; // e.g. 14 to 30 mEq/L
  // Ventilator Settings & Mechanics
  tidalVolumeMl: number; // e.g. 250 to 750 mL
  respiratoryRateBpm: number; // e.g. 10 to 38 breaths/min
  peepCmH2o: number; // e.g. 5 to 24 cmH2O
  plateauPressureCmH2o: number; // e.g. 14 to 45 cmH2O
  peakInspiratoryPressureCmH2o: number; // e.g. 18 to 55 cmH2O
  // Clinical Context
  timingWithinOneWeek: boolean;
  bilateralInfiltratesNotCardiac: boolean;
  vasopressorRequired: boolean;
  pronePositioningActive: boolean;
}

export interface ArdsClinicalMetrics {
  predictedBodyWeightKg: number;
  tidalVolumeMlPerKgPbw: number;
  pao2Fio2Ratio: number;
  berlinSeverity: BerlinArdsSeverity;
  complianceRespiratorySystemMlCmH2o: number; // Crs = Vt / (Pplat - PEEP)
  drivingPressureCmH2o: number; // Delta P = Pplat - PEEP
  drivingPressureRisk: 'SAFE_LOW_STRESS' | 'ELEVATED_VILI_RISK' | 'CRITICAL_LUNG_STRESS';
  mechanicalPowerJoulesMin: number; // Gattinoni equation
  mechanicalPowerRisk: 'SAFE' | 'BORDERLINE' | 'ERGOTRAUMA_HIGH_VILI';
  estimatedSubphenotype: ArdsSubphenotype;
  // Escalation Checklist
  pronePositioningIndicated: boolean; // PROSEVA: P/F < 150 with PEEP >= 10, FiO2 >= 0.6
  paralyticInfusionIndicated: boolean; // ACURASYS: P/F < 150 with high driving pressure/dyssynchrony
  vvEcmoConsiderationIndicated: boolean; // EOLIA criteria
  ventilatorOptimizationRecommendations: string[];
  diagnosticSummary: string;
}

export const ARDS_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: ArdsPatientInput;
}[] = [
  {
    id: 'severe-viral-ards-high-driving-pressure',
    name: 'Severe ARDS with High Driving Pressure (VILI Alert)',
    badge: 'Prone Candidate (PROSEVA)',
    description: 'A 56-year-old male (178 cm, 82 kg) with influenza pneumonia intubated for severe ARDS. On Vt 520 mL (7.4 mL/kg PBW), PEEP 14, Pplat 34 cmH2O (Driving Pressure 20 cmH2O!), PaO2 62 on FiO2 80% (P/F 78). Exceeds safe driving pressure (<= 14) and mechanical power thresholds.',
    input: {
      gender: 'MALE',
      heightCm: 178,
      actualWeightKg: 82,
      pao2MmHg: 62,
      fio2Percent: 80,
      arterialBloodPh: 7.28,
      serumBicarbonateMeqL: 19,
      tidalVolumeMl: 520,
      respiratoryRateBpm: 28,
      peepCmH2o: 14,
      plateauPressureCmH2o: 34,
      peakInspiratoryPressureCmH2o: 42,
      timingWithinOneWeek: true,
      bilateralInfiltratesNotCardiac: true,
      vasopressorRequired: true,
      pronePositioningActive: false,
    },
  },
  {
    id: 'lung-protective-ventilated-moderate',
    name: 'Moderate ARDS on Optimized ARDSNet Ventilation',
    badge: 'Lung-Protective Benchmark',
    description: 'A 62-year-old female (162 cm, 65 kg) with aspiration pneumonia. Ventilated on strict 6.0 mL/kg PBW (325 mL), PEEP 10 cmH2O, Pplat 22 cmH2O. Driving pressure is low (12 cmH2O), PaO2/FiO2 is 175 on FiO2 50%. Demonstrates optimal compliance and low mechanical power.',
    input: {
      gender: 'FEMALE',
      heightCm: 162,
      actualWeightKg: 65,
      pao2MmHg: 88,
      fio2Percent: 50,
      arterialBloodPh: 7.36,
      serumBicarbonateMeqL: 23,
      tidalVolumeMl: 325,
      respiratoryRateBpm: 22,
      peepCmH2o: 10,
      plateauPressureCmH2o: 22,
      peakInspiratoryPressureCmH2o: 27,
      timingWithinOneWeek: true,
      bilateralInfiltratesNotCardiac: true,
      vasopressorRequired: false,
      pronePositioningActive: false,
    },
  },
  {
    id: 'hyper-inflammatory-subphenotype',
    name: 'Hyper-Inflammatory ARDS Phenotype 2',
    badge: 'High-PEEP Responsive',
    description: 'A 48-year-old male with septic shock and ARDS. Characterized by profound metabolic acidosis (HCO3 15 mEq/L), refractory vasopressor dependence, PaO2/FiO2 110, and high mechanical power. Subphenotype 2 responds favorably to high PEEP titration and restrictive fluid strategy.',
    input: {
      gender: 'MALE',
      heightCm: 172,
      actualWeightKg: 78,
      pao2MmHg: 66,
      fio2Percent: 60,
      arterialBloodPh: 7.21,
      serumBicarbonateMeqL: 15,
      tidalVolumeMl: 450,
      respiratoryRateBpm: 32,
      peepCmH2o: 12,
      plateauPressureCmH2o: 31,
      peakInspiratoryPressureCmH2o: 39,
      timingWithinOneWeek: true,
      bilateralInfiltratesNotCardiac: true,
      vasopressorRequired: true,
      pronePositioningActive: false,
    },
  },
  {
    id: 'refractory-eolia-ecmo-candidate',
    name: 'Refractory Severe ARDS (EOLIA ECMO Screening)',
    badge: 'VV-ECMO Candidate',
    description: 'A 34-year-old female (168 cm, 70 kg) with necrotizing viral pneumonia. Despite 18 hours of prone positioning, neuromuscular blockade, and PEEP 16, PaO2 is 48 on FiO2 100% (P/F 48) for > 4 hours with Pplat 33 cmH2O and pH 7.14. Meets definitive EOLIA criteria for emergency VV-ECMO cannulation.',
    input: {
      gender: 'FEMALE',
      heightCm: 168,
      actualWeightKg: 70,
      pao2MmHg: 48,
      fio2Percent: 100,
      arterialBloodPh: 7.14,
      serumBicarbonateMeqL: 17,
      tidalVolumeMl: 350,
      respiratoryRateBpm: 34,
      peepCmH2o: 16,
      plateauPressureCmH2o: 33,
      peakInspiratoryPressureCmH2o: 44,
      timingWithinOneWeek: true,
      bilateralInfiltratesNotCardiac: true,
      vasopressorRequired: true,
      pronePositioningActive: true,
    },
  },
];

/**
 * Calculates ARDSNet Predicted Body Weight (PBW) in kg.
 * Male: 50 + 0.91 * (Height - 152.4)
 * Female: 45.5 + 0.91 * (Height - 152.4)
 */
export function calculatePredictedBodyWeight(gender: PatientGender, heightCm: number): number {
  const base = gender === 'MALE' ? 50.0 : 45.5;
  const pbw = base + 0.91 * (heightCm - 152.4);
  return parseFloat(Math.max(30, pbw).toFixed(1));
}

/**
 * Calculates PaO2 / FiO2 ratio (P/F ratio).
 * FiO2 is represented as percentage (21 to 100) or decimal (0.21 to 1.0).
 */
export function calculatePfRatio(pao2MmHg: number, fio2Percent: number): number {
  const fio2Fraction = fio2Percent > 1.0 ? fio2Percent / 100 : fio2Percent;
  if (fio2Fraction <= 0) return 0;
  return Math.round(pao2MmHg / fio2Fraction);
}

/**
 * Stratifies Berlin Definition ARDS severity on PEEP >= 5 cmH2O:
 * Mild: 200 < P/F <= 300
 * Moderate: 100 < P/F <= 200
 * Severe: P/F <= 100
 */
export function classifyBerlinArds(
  pfRatio: number,
  peepCmH2o: number,
  timingValid: boolean,
  bilateralInfiltrates: boolean
): BerlinArdsSeverity {
  if (!timingValid || !bilateralInfiltrates || peepCmH2o < 5) {
    return 'NONE_OR_AT_RISK';
  }
  if (pfRatio <= 100) return 'SEVERE_ARDS';
  if (pfRatio <= 200) return 'MODERATE_ARDS';
  if (pfRatio <= 300) return 'MILD_ARDS';
  return 'NONE_OR_AT_RISK';
}

/**
 * Calculates Static Respiratory System Compliance (Crs):
 * Crs = Vt / (Pplat - PEEP)  (mL/cmH2O)
 * Normal: 50 - 80 mL/cmH2O; ARDS typically < 30 - 40 mL/cmH2O.
 */
export function calculateRespiratoryCompliance(
  tidalVolumeMl: number,
  plateauPressureCmH2o: number,
  peepCmH2o: number
): number {
  const drivingPressure = plateauPressureCmH2o - peepCmH2o;
  if (drivingPressure <= 0) return 0;
  return parseFloat((tidalVolumeMl / drivingPressure).toFixed(1));
}

/**
 * Calculates Driving Pressure (Delta P):
 * Delta P = Pplat - PEEP
 * Key trial threshold (Amato et al. NEJM 2015): Delta P > 14-15 cmH2O correlates with excess mortality.
 */
export function calculateDrivingPressure(
  plateauPressureCmH2o: number,
  peepCmH2o: number
): {
  drivingPressure: number;
  risk: 'SAFE_LOW_STRESS' | 'ELEVATED_VILI_RISK' | 'CRITICAL_LUNG_STRESS';
} {
  const dp = plateauPressureCmH2o - peepCmH2o;
  let risk: 'SAFE_LOW_STRESS' | 'ELEVATED_VILI_RISK' | 'CRITICAL_LUNG_STRESS' = 'SAFE_LOW_STRESS';

  if (dp > 18) {
    risk = 'CRITICAL_LUNG_STRESS';
  } else if (dp > 14) {
    risk = 'ELEVATED_VILI_RISK';
  }

  return { drivingPressure: dp, risk };
}

/**
 * Calculates Mechanical Power of ventilation (Gattinoni equation):
 * MP = 0.098 * RR * Vt(L) * [Ppeak - (Delta P / 2)] (Joules/min)
 * Threshold: > 17 J/min associates with ventilator-induced lung injury (VILI) and mortality.
 */
export function calculateMechanicalPower(
  respiratoryRateBpm: number,
  tidalVolumeMl: number,
  peakPressureCmH2o: number,
  drivingPressureCmH2o: number
): {
  powerJoulesMin: number;
  risk: 'SAFE' | 'BORDERLINE' | 'ERGOTRAUMA_HIGH_VILI';
} {
  const vtLiters = tidalVolumeMl / 1000;
  const power = 0.098 * respiratoryRateBpm * vtLiters * (peakPressureCmH2o - drivingPressureCmH2o / 2);
  const roundedPower = parseFloat(Math.max(0, power).toFixed(1));

  let risk: 'SAFE' | 'BORDERLINE' | 'ERGOTRAUMA_HIGH_VILI' = 'SAFE';
  if (roundedPower >= 24) {
    risk = 'ERGOTRAUMA_HIGH_VILI';
  } else if (roundedPower >= 17) {
    risk = 'BORDERLINE';
  }

  return { powerJoulesMin: roundedPower, risk };
}

/**
 * Classifies ARDS Subphenotype (Calfee et al.):
 * Phenotype 2 (Hyper-inflammatory): Low bicarbonate (< 20), vasopressor dependence, severe hypoxemia.
 * Phenotype 1 (Hypo-inflammatory): Preserved bicarbonate, lower inflammatory stress.
 */
export function estimateArdsSubphenotype(
  bicarbonate: number,
  vasopressorRequired: boolean,
  pfRatio: number
): ArdsSubphenotype {
  let hyperScore = 0;
  if (bicarbonate < 20) hyperScore += 2;
  if (vasopressorRequired) hyperScore += 2;
  if (pfRatio < 150) hyperScore += 1;

  return hyperScore >= 3 ? 'HYPER_INFLAMMATORY_PHENOTYPE_2' : 'HYPO_INFLAMMATORY_PHENOTYPE_1';
}

/**
 * Evaluates PROSEVA trial prone positioning eligibility:
 * Indicated when PaO2/FiO2 < 150 on PEEP >= 10 cmH2O and FiO2 >= 0.60.
 */
export function evaluateProneEligibility(
  pfRatio: number,
  peepCmH2o: number,
  fio2Percent: number
): boolean {
  const fio2Frac = fio2Percent > 1.0 ? fio2Percent / 100 : fio2Percent;
  return pfRatio < 150 && peepCmH2o >= 10 && fio2Frac >= 0.60;
}

/**
 * Evaluates EOLIA trial ECMO eligibility:
 * Severe ARDS with PaO2/FiO2 < 50 for > 3h, or P/F < 80 for > 6h, or arterial pH < 7.15 with Pplat <= 32 cmH2O.
 */
export function evaluateEcmoEligibility(
  pfRatio: number,
  ph: number,
  plateauPressureCmH2o: number
): boolean {
  return pfRatio < 80 || (ph < 7.15 && plateauPressureCmH2o <= 32);
}

/**
 * Main evaluation entrypoint for ARDS Ventilator Mechanics Workstation.
 */
export function computeArdsMechanics(input: ArdsPatientInput): ArdsClinicalMetrics {
  const pbw = calculatePredictedBodyWeight(input.gender, input.heightCm);
  const vtPerKgPbw = parseFloat((input.tidalVolumeMl / pbw).toFixed(1));
  const pf = calculatePfRatio(input.pao2MmHg, input.fio2Percent);
  const berlin = classifyBerlinArds(
    pf,
    input.peepCmH2o,
    input.timingWithinOneWeek,
    input.bilateralInfiltratesNotCardiac
  );
  const compliance = calculateRespiratoryCompliance(
    input.tidalVolumeMl,
    input.plateauPressureCmH2o,
    input.peepCmH2o
  );
  const dpResult = calculateDrivingPressure(input.plateauPressureCmH2o, input.peepCmH2o);
  const mpResult = calculateMechanicalPower(
    input.respiratoryRateBpm,
    input.tidalVolumeMl,
    input.peakInspiratoryPressureCmH2o,
    dpResult.drivingPressure
  );
  const subphenotype = estimateArdsSubphenotype(
    input.serumBicarbonateMeqL,
    input.vasopressorRequired,
    pf
  );
  const proneEligible = evaluateProneEligibility(pf, input.peepCmH2o, input.fio2Percent);
  const ecmoConsidered = evaluateEcmoEligibility(pf, input.arterialBloodPh, input.plateauPressureCmH2o);

  const recommendations: string[] = [];

  // Tidal volume check
  if (vtPerKgPbw > 6.5) {
    const target6 = Math.round(6.0 * pbw);
    recommendations.push(
      `TIDAL VOLUME EXCESS: Current delivery is ${vtPerKgPbw} mL/kg PBW (${input.tidalVolumeMl} mL). Titrate down to 6.0 mL/kg PBW (${target6} mL) or 4.0-5.0 mL/kg PBW if driving pressure remains elevated.`
    );
  } else {
    recommendations.push(
      `LUNG-PROTECTIVE TIDAL VOLUME: Delivering ${vtPerKgPbw} mL/kg PBW (target 4-8 mL/kg PBW).`
    );
  }

  // Driving pressure guidance
  if (dpResult.risk !== 'SAFE_LOW_STRESS') {
    recommendations.push(
      `ELEVATED DRIVING PRESSURE (${dpResult.drivingPressure} cmH2O): Exceeds safe limit (<= 14 cmH2O). Reduce tidal volume, reassess PEEP for optimal compliance, or initiate neuromuscular blockade to abolish patient-ventilator dyssynchrony.`
    );
  }

  // Mechanical Power guidance
  if (mpResult.risk === 'ERGOTRAUMA_HIGH_VILI') {
    recommendations.push(
      `EXCESSIVE MECHANICAL POWER (${mpResult.powerJoulesMin} J/min): High risk of ergotrauma and VILI. Lower respiratory rate or decrease tidal volume to reduce total energy transfer to diseased lung tissue.`
    );
  }

  // Prone Positioning
  if (proneEligible) {
    if (!input.pronePositioningActive) {
      recommendations.push(
        'PROSEVA PRONE POSITIONING INDICATED: PaO2/FiO2 < 150 with PEEP >= 10 and FiO2 >= 0.60. Initiate prone positioning for at least 16 consecutive hours daily to improve ventilation-perfusion matching and reduce 28-day mortality by 50%.'
      );
    } else {
      recommendations.push(
        'PRONE POSITIONING ACTIVE: Maintain prone posture for >= 16 consecutive hours. Reassess ABG at 4 hours and prior to supine return.'
      );
    }
  }

  // ECMO
  if (ecmoConsidered) {
    recommendations.push(
      'EOLIA CRITERIA MET (VV-ECMO CONSULT): Refractory hypoxemia (P/F < 80) or severe uncompensated hypercapnic acidosis (pH < 7.15) warrants urgent evaluation by ECMO retrieval team.'
    );
  }

  const diagnosticSummary = `Berlin: ${berlin.replace(/_/g, ' ')} (P/F ${pf}) | PBW ${pbw} kg (${vtPerKgPbw} mL/kg) | Driving Pressure ${dpResult.drivingPressure} cmH2O | Crs ${compliance} mL/cmH2O | Mechanical Power ${mpResult.powerJoulesMin} J/min | ${subphenotype === 'HYPER_INFLAMMATORY_PHENOTYPE_2' ? 'Hyper-inflammatory (Phenotype 2)' : 'Hypo-inflammatory (Phenotype 1)'}.`;

  return {
    predictedBodyWeightKg: pbw,
    tidalVolumeMlPerKgPbw: vtPerKgPbw,
    pao2Fio2Ratio: pf,
    berlinSeverity: berlin,
    complianceRespiratorySystemMlCmH2o: compliance,
    drivingPressureCmH2o: dpResult.drivingPressure,
    drivingPressureRisk: dpResult.risk,
    mechanicalPowerJoulesMin: mpResult.powerJoulesMin,
    mechanicalPowerRisk: mpResult.risk,
    estimatedSubphenotype: subphenotype,
    pronePositioningIndicated: proneEligible,
    paralyticInfusionIndicated: pf < 150 && dpResult.risk !== 'SAFE_LOW_STRESS',
    vvEcmoConsiderationIndicated: ecmoConsidered,
    ventilatorOptimizationRecommendations: recommendations,
    diagnosticSummary,
  };
}
