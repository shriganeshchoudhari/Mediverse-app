/**
 * StatusAsthmaticusMechanicsEngine.ts
 * Biophysical, Respiratory Mechanics & Pharmacotherapy Engine for Acute Severe Asthma & Status Asthmaticus
 * Implements:
 * 1. GINA / NAEPP 2024 Severity Stratification (Mild/Mod vs Severe vs Life-Threatening "Silent Chest")
 * 2. Peak Expiratory Flow (PEF) & Dynamic Airway Resistance Mechanics
 * 3. Dynamic Hyperinflation & Auto-PEEP (Intrinsic PEEP) with Venous Return Hemodynamic Impairment
 * 4. Stepwise Pharmacotherapy: Continuous SABA, Ipratropium, Corticosteroids, IV Magnesium & Ketamine
 * 5. Mechanical Ventilation: Prolonged Expiratory Time (I:E 1:4), Permissive Hypercapnia & Ventilator Disconnection Maneuver
 * Location: frontend/.gemini/skills/StatusAsthmaticusMechanicsEngine.ts
 */

export type AsthmaSeverityGrade = 'MILD_MODERATE' | 'SEVERE' | 'LIFE_THREATENING_SILENT_CHEST' | 'NEAR_FATAL_ARREST';

export interface AsthmaPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  heightCm: number;
  gender: 'MALE' | 'FEMALE';

  // Respiratory Biometrics
  respiratoryRateBpm: number;
  oxygenSaturationPercent: number;
  fractionInspiredO2: number; // 0.21 to 1.0
  peakExpiratoryFlowLMin: number;
  baselinePredictedPefLMin: number; // e.g. 500 L/min

  // Physical Exam & Auscultation
  dyspneaGrade: 'CAN_SPEAK_SENTENCES' | 'CAN_SPEAK_PHRASES' | 'CAN_SPEAK_WORDS_ONLY' | 'SILENT_EXHAUSTED';
  auscultationFindings: 'NORMAL_VESICULAR' | 'EXPIRATORY_WHEEZE' | 'INSPIRATORY_EXPIRATORY_WHEEZE' | 'SILENT_CHEST';
  accessoryMuscleUse: 'NONE' | 'MODERATE_INTERCOSTAL' | 'SEVERE_STERNOCLEIDOMASTOID' | 'PARADOXICAL_THORACOABDOMINAL';
  pulsusParadoxusMmHg: number; // normal < 10, severe > 12-15

  // Blood Gas & Chemistry
  arterialPh: number;
  arterialPco2MmHg: number;
  arterialPo2MmHg: number;
  serumPotassiumMeqL: number; // monitor for SABA-induced hypokalemia
  serumLactateMmolL: number;   // type B lactic acidosis from beta-agonists vs tissue hypoxia

  // Mechanical Ventilation (if intubated)
  isMechanicallyVentilated: boolean;
  ventilatorTidalVolumeMl: number; // 6-8 mL/kg PBW
  ventilatorRespiratoryRateBpm: number;
  inspiratoryFlowRateLMin: number; // 60-100 L/min
  appliedPeepCmH2O: number;        // 0-5 cmH2O
  measuredPlateauPressureCmH2O: number;
  measuredAutoPeepCmH2O: number;   // Intrinsic PEEP

  // Pharmacotherapy Interventions Active
  isContinuousAlbuterolActive: boolean; // 10-15 mg/h
  isIpratropiumAdministered: boolean;   // 0.5 mg Q20m x3
  isSystemicCorticosteroidGiven: boolean; // Methylprednisolone 1-2 mg/kg or Dexamethasone
  isIvMagnesiumAdministered: boolean;   // 2 g IV over 20 min
  isTerbutalineOrEpiGiven: boolean;     // SubQ Terbutaline or IM Epinephrine
  isHelioxActive: boolean;              // 70:30 or 80:20 Helium-O2
}

export interface AirwayMechanicsOutput {
  pefPercentPredicted: number;
  severityGrade: AsthmaSeverityGrade;
  severityDescription: string;
  hypercapnicArrestRisk: 'LOW' | 'MODERATE' | 'IMMINENT_CRITICAL';
  predictedBloodGasPhenotype: string;
}

export interface DynamicHyperinflationOutput {
  inspiratoryToExpiratoryRatio: string; // e.g. "1:4.2"
  expiratoryTimeSeconds: number;
  totalPeepCmH2O: number; // applied + auto-PEEP
  dynamicHyperinflationSeverity: 'NONE_MILD' | 'MODERATE' | 'SEVERE_CARDIOVASCULAR_COLLAPSE';
  hemodynamicVenousReturnDeficitPercent: number;
  barotraumaRiskPercent: number;
  circuitDisconnectDirective: string | null;
}

export interface AsthmaPharmacotherapyOutput {
  sabaTitration: {
    status: string;
    doseRecommendation: string;
    hypokalemiaPrecaution: string;
  };
  anticholinergicGuidance: {
    status: string;
    rationale: string;
  };
  steroidGuidance: {
    status: string;
    doseSchedule: string;
    onsetWindow: string;
  };
  magnesiumGuidance: {
    status: string;
    mechanism: string;
  };
  adjuvantParenteralGuidance: {
    status: string;
    clinicalPearl: string;
  };
}

export interface ComprehensiveAsthmaEvaluation {
  airwayMechanics: AirwayMechanicsOutput;
  hyperinflation: DynamicHyperinflationOutput;
  pharmacotherapy: AsthmaPharmacotherapyOutput;
  permissiveHypercapniaGuidance: {
    isIndicated: boolean;
    targetPhRange: string;
    targetPco2Range: string;
    contraindications: string[];
  };
  criticalSafetyInterlocks: string[];
  immediateActionDirectives: string[];
  clinicalPearls: string[];
}

/**
 * Calculate Predicted Body Weight (PBW) in kg
 */
export function calculateAsthmaPbwKg(heightCm: number, gender: 'MALE' | 'FEMALE'): number {
  const heightInches = heightCm / 2.54;
  if (gender === 'MALE') {
    return Math.round(50 + 0.91 * (heightCm - 152.4));
  }
  return Math.round(45.5 + 0.91 * (heightCm - 152.4));
}

/**
 * 1. Airway Mechanics & GINA Severity Grading
 */
export function evaluateAirwayMechanics(input: AsthmaPatientInput): AirwayMechanicsOutput {
  const pefPercent = Math.round(
    (input.peakExpiratoryFlowLMin / Math.max(50, input.baselinePredictedPefLMin)) * 100
  );

  let grade: AsthmaSeverityGrade = 'MILD_MODERATE';
  let desc = 'Mild to moderate bronchospasm. Speech preserved in full sentences.';

  // Critical "Silent Chest" or exhaustion
  if (
    input.auscultationFindings === 'SILENT_CHEST' ||
    input.dyspneaGrade === 'SILENT_EXHAUSTED' ||
    input.accessoryMuscleUse === 'PARADOXICAL_THORACOABDOMINAL' ||
    pefPercent < 30 ||
    input.arterialPco2MmHg >= 50
  ) {
    grade = 'LIFE_THREATENING_SILENT_CHEST';
    desc = 'Life-threatening status asthmaticus with "Silent Chest". Inadequate air movement to generate wheezing. Severe hypercapnic respiratory muscle exhaustion.';
  } else if (
    pefPercent < 50 ||
    input.dyspneaGrade === 'CAN_SPEAK_WORDS_ONLY' ||
    input.accessoryMuscleUse === 'SEVERE_STERNOCLEIDOMASTOID' ||
    input.respiratoryRateBpm > 30 ||
    input.pulsusParadoxusMmHg >= 15 ||
    input.arterialPco2MmHg >= 42
  ) {
    grade = 'SEVERE';
    desc = 'Severe acute asthma exacerbation. Monosyllabic speech, marked sternocleidomastoid use, impending diaphragmatic fatigue.';
  }

  // Hypercapnic crossover check:
  // In asthma, tachypnea normally causes respiratory alkalosis (PaCO2 25-32 mmHg).
  // A "normal" PaCO2 (40 mmHg) or elevated PaCO2 (> 45 mmHg) in a tachypneic asthmatic is an ominous sign of catastrophic respiratory arrest.
  let risk: AirwayMechanicsOutput['hypercapnicArrestRisk'] = 'LOW';
  let bgDesc = 'Compensated respiratory alkalosis (expected hyperventilation).';

  if (input.arterialPco2MmHg >= 45) {
    risk = 'IMMINENT_CRITICAL';
    bgDesc = 'Catastrophic hypercapnic crossover (PaCO2 >= 45 mmHg): Respiratory center failure and diaphragmatic exhaustion.';
  } else if (input.arterialPco2MmHg >= 38) {
    risk = 'MODERATE';
    bgDesc = 'Pseudonormal PaCO2 (38-44 mmHg): Loss of compensatory hyperventilation signaling imminent muscular collapse.';
  }

  return {
    pefPercentPredicted: pefPercent,
    severityGrade: grade,
    severityDescription: desc,
    hypercapnicArrestRisk: risk,
    predictedBloodGasPhenotype: bgDesc,
  };
}

/**
 * 2. Dynamic Hyperinflation & Auto-PEEP Ventilator Mechanics
 */
export function evaluateDynamicHyperinflation(input: AsthmaPatientInput): DynamicHyperinflationOutput {
  const totalPeep = input.appliedPeepCmH2O + input.measuredAutoPeepCmH2O;

  // Estimate I:E ratio from ventilator settings if ventilated
  let ieRatioString = '1:2.0';
  let teSec = 2.0;

  if (input.isMechanicallyVentilated) {
    const cycleTimeSec = 60 / Math.max(1, input.ventilatorRespiratoryRateBpm);
    // Inspiratory time based on flow rate (L/min -> L/s)
    const flowLSec = input.inspiratoryFlowRateLMin / 60;
    const vtL = input.ventilatorTidalVolumeMl / 1000;
    const tiSec = vtL / Math.max(0.1, flowLSec);
    teSec = Math.max(0.2, cycleTimeSec - tiSec);
    const ieRatioNum = Number((teSec / Math.max(0.1, tiSec)).toFixed(1));
    ieRatioString = `1:${ieRatioNum}`;
  }

  let severity: DynamicHyperinflationOutput['dynamicHyperinflationSeverity'] = 'NONE_MILD';
  let venousDeficit = 5;
  let barotrauma = 5;
  let disconnectDirective: string | null = null;

  if (input.measuredAutoPeepCmH2O >= 15 || (input.isMechanicallyVentilated && totalPeep >= 20)) {
    severity = 'SEVERE_CARDIOVASCULAR_COLLAPSE';
    venousDeficit = 65;
    barotrauma = 50;
    disconnectDirective = 'EMERGENCY CIRCUIT DISCONNECT MANDATORY: Intrinsic Auto-PEEP >= 15 cmH2O is compressing right atrium and halting preload. Disconnect endotracheal tube from ventilator for 30-60 seconds and manually decompress chest to prevent PEA arrest!';
  } else if (input.measuredAutoPeepCmH2O >= 8 || input.pulsusParadoxusMmHg >= 15) {
    severity = 'MODERATE';
    venousDeficit = 30;
    barotrauma = 25;
  }

  return {
    inspiratoryToExpiratoryRatio: ieRatioString,
    expiratoryTimeSeconds: Number(teSec.toFixed(2)),
    totalPeepCmH2O: totalPeep,
    dynamicHyperinflationSeverity: severity,
    hemodynamicVenousReturnDeficitPercent: venousDeficit,
    barotraumaRiskPercent: barotrauma,
    circuitDisconnectDirective: disconnectDirective,
  };
}

/**
 * 3. Pharmacotherapy Optimization Bench
 */
export function evaluateAsthmaPharmacotherapy(input: AsthmaPatientInput): AsthmaPharmacotherapyOutput {
  return {
    sabaTitration: {
      status: input.isContinuousAlbuterolActive ? 'Active Continuous Nebulization' : 'Intermittent / Inactive',
      doseRecommendation: 'Albuterol 10 to 15 mg/hr continuous nebulization or 4-8 puffs via MDI with spacer Q20m.',
      hypokalemiaPrecaution: input.serumPotassiumMeqL < 3.2
        ? 'CRITICAL ALERT: Serum K+ < 3.2 mEq/L! High-dose beta-2 agonists stimulate Na+/K+ ATPase, driving potassium into cells. Check ECG and supplement potassium.'
        : 'Monitor serum K+ Q2-4h during continuous high-dose beta-2 agonist therapy.',
    },
    anticholinergicGuidance: {
      status: input.isIpratropiumAdministered ? 'Administered (M3 receptor blockade active)' : 'Not Administered',
      rationale: 'Ipratropium Bromide 0.5 mg Q20m x 3 doses combined with SABA significantly reduces hospital admission rates in severe exacerbations by blocking vagal bronchomotor tone.',
    },
    steroidGuidance: {
      status: input.isSystemicCorticosteroidGiven ? 'Administered' : 'Pending',
      doseSchedule: 'Methylprednisolone 60-120 mg IV or Dexamethasone 10-16 mg IV/PO or Prednisone 40-60 mg PO.',
      onsetWindow: 'Systemic corticosteroids require 4 to 6 hours for genomic transcription suppression of cytokines (IL-4, IL-5, IL-13) and upregulation of beta-2 receptors.',
    },
    magnesiumGuidance: {
      status: input.isIvMagnesiumAdministered ? 'Administered' : 'Not Administered',
      mechanism: 'IV Magnesium Sulfate 2.0 g in 100 mL D5W over 20 min. Competitively inhibits voltage-gated Ca2+ channels on bronchial smooth muscle, producing potent bronchodilation.',
    },
    adjuvantParenteralGuidance: {
      status: input.isTerbutalineOrEpiGiven ? 'Parenteral Beta-Agonist Active' : 'Not Given',
      clinicalPearl: 'IM Epinephrine (0.3-0.5 mg) or SubQ Terbutaline is lifesaving when severe bronchospasm and dynamic hyperinflation prevent inhaled aerosols from reaching peripheral terminal bronchioles.',
    },
  };
}

/**
 * 4. Comprehensive Multimodal Evaluation
 */
export function performAsthmaEvaluation(input: AsthmaPatientInput): ComprehensiveAsthmaEvaluation {
  const mechanics = evaluateAirwayMechanics(input);
  const hyperinflation = evaluateDynamicHyperinflation(input);
  const pharmacotherapy = evaluateAsthmaPharmacotherapy(input);

  const interlocks: string[] = [];
  const directives: string[] = [];

  // Interlock 1: Hypercapnic crossover arrest danger
  if (mechanics.hypercapnicArrestRisk === 'IMMINENT_CRITICAL') {
    interlocks.push(
      'HYPERCAPNIC CROSSOVER EMERGENCY: PaCO2 is >= 45 mmHg with severe exhaustion! In an acutely tachypneic asthmatic, normal or high PaCO2 represents diaphragmatic failure and imminent fatal respiratory arrest.'
    );
    directives.push('Prepare for immediate resuscitation / ICU admission; prepare ketamine bronchodilator induction.');
  }

  // Interlock 2: "Silent Chest" false security trap
  if (input.auscultationFindings === 'SILENT_CHEST') {
    interlocks.push(
      'SILENT CHEST TRAP: Absence of wheezing does NOT indicate clinical improvement! Tidal volume is so critically diminished (< 150 mL) that airflow velocity cannot vibrate airway walls. Impending cardiovascular collapse.'
    );
    directives.push('Administer parenteral IM Epinephrine (0.3 mg) or SubQ Terbutaline immediately while setting up continuous nebulization.');
  }

  // Interlock 3: Ventilator Auto-PEEP arrest & disconnect
  if (hyperinflation.circuitDisconnectDirective) {
    interlocks.push(hyperinflation.circuitDisconnectDirective);
    directives.push('CRITICAL DISCONNECT: Instantly remove patient from ventilator circuit and allow passive chest deflation for 30 seconds.');
  }

  // Interlock 4: Applied PEEP barotrauma hazard
  if (input.isMechanicallyVentilated && input.appliedPeepCmH2O > 5 && input.measuredAutoPeepCmH2O > 10) {
    interlocks.push(
      `INAPPROPRIATE APPLIED PEEP HAZARD: Applied PEEP of ${input.appliedPeepCmH2O} cmH2O added to Auto-PEEP of ${input.measuredAutoPeepCmH2O} cmH2O creates total PEEP >= ${hyperinflation.totalPeepCmH2O} cmH2O, dramatically increasing tension pneumothorax risk. Reduce applied PEEP to <= 5 cmH2O.`
    );
  }

  // Action directives if not intubated
  if (!input.isMechanicallyVentilated) {
    if (!input.isContinuousAlbuterolActive) {
      directives.push('Initiate high-dose continuous Albuterol nebulization (10-15 mg/hr).');
    }
    if (!input.isIpratropiumAdministered) {
      directives.push('Administer Ipratropium Bromide 0.5 mg nebulized with Albuterol (DuoNeb).');
    }
    if (!input.isSystemicCorticosteroidGiven) {
      directives.push('Administer systemic corticosteroids (Methylprednisolone 60-120 mg IV or Dexamethasone 12 mg IV).');
    }
    if (!input.isIvMagnesiumAdministered && mechanics.severityGrade !== 'MILD_MODERATE') {
      directives.push('Infuse IV Magnesium Sulfate 2.0 g in 100 mL saline/D5W over 20 minutes.');
    }
    if (directives.length === 0) {
      directives.push('Maintain continuous bronchodilator support and reassess peak expiratory flow Q1-2h.');
      directives.push('Monitor serum potassium and lactate Q2-4h during prolonged beta-agonist exposure.');
    }
  } else {
    directives.push('Maintain prolonged expiratory time (I:E ratio >= 1:4 to 1:5) with respiratory rate 8-12 bpm.');
    directives.push('Enforce Permissive Hypercapnia protocol: accept PaCO2 60-90 mmHg as long as pH >= 7.15-7.20.');
  }

  const clinicalPearls: string[] = [
    'Tachypnea with normal or elevated PaCO2 in asthma is never benign - it is the single most ominous marker of respiratory muscle fatigue.',
    'Pulsus Paradoxus > 12-15 mmHg reflects dramatic intrathoracic pressure swings (-30 to +20 cmH2O) during forced respiratory efforts.',
    'Heliox (70:30 He:O2) reduces Reynolds number and converts turbulent airway flow into laminar flow, decreasing work of breathing.',
    'Intubation in asthma carries up to 30% risk of pneumothorax, severe hypotension, or PEA arrest due to sudden dynamic hyperinflation.',
    'If sudden PEA arrest occurs within minutes of intubation: disconnect the circuit immediately and compress the chest to decompress trapped air.',
  ];

  return {
    airwayMechanics: mechanics,
    hyperinflation,
    pharmacotherapy,
    permissiveHypercapniaGuidance: {
      isIndicated: input.isMechanicallyVentilated,
      targetPhRange: '7.15 - 7.25',
      targetPco2Range: '60 - 90 mmHg',
      contraindications: [
        'Acute Traumatic Brain Injury (TBI) / Elevated ICP',
        'Severe Right Ventricular Failure / Decompensated Cor Pulmonale',
        'Severe Metabolic Acidosis (pH < 7.10)',
      ],
    },
    criticalSafetyInterlocks: interlocks,
    immediateActionDirectives: directives,
    clinicalPearls,
  };
}

export interface AsthmaPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: AsthmaPatientInput;
}

export const ASTHMA_PRESETS: AsthmaPreset[] = [
  {
    id: 'SILENT_CHEST_IMPENDING_ARREST',
    name: 'Silent Chest Impending Respiratory Arrest',
    badge: 'Critical Life-Threatening',
    description: '24-year-old female with brittle asthma presenting with exhaustion, monosyllabic dyspnea, "Silent Chest" without audible wheezing, PEF 120 L/min (24% predicted), and PaCO2 surge to 54 mmHg indicating catastrophic crossover.',
    inputs: {
      patientAgeYears: 24,
      patientWeightKg: 60,
      heightCm: 165,
      gender: 'FEMALE',
      respiratoryRateBpm: 34,
      oxygenSaturationPercent: 88,
      fractionInspiredO2: 0.21,
      peakExpiratoryFlowLMin: 120,
      baselinePredictedPefLMin: 500,
      dyspneaGrade: 'SILENT_EXHAUSTED',
      auscultationFindings: 'SILENT_CHEST',
      accessoryMuscleUse: 'PARADOXICAL_THORACOABDOMINAL',
      pulsusParadoxusMmHg: 22,
      arterialPh: 7.22,
      arterialPco2MmHg: 54, // Critical hypercapnic crossover!
      arterialPo2MmHg: 58,
      serumPotassiumMeqL: 3.8,
      serumLactateMmolL: 2.8,
      isMechanicallyVentilated: false,
      ventilatorTidalVolumeMl: 420,
      ventilatorRespiratoryRateBpm: 12,
      inspiratoryFlowRateLMin: 80,
      appliedPeepCmH2O: 0,
      measuredPlateauPressureCmH2O: 20,
      measuredAutoPeepCmH2O: 0,
      isContinuousAlbuterolActive: false,
      isIpratropiumAdministered: false,
      isSystemicCorticosteroidGiven: false,
      isIvMagnesiumAdministered: false,
      isTerbutalineOrEpiGiven: false,
      isHelioxActive: false,
    },
  },
  {
    id: 'VENTILATOR_INDUCED_PEA_ARREST',
    name: 'Ventilator Dynamic Hyperinflation & PEA Collapse',
    badge: 'Ventilator Airway Trap',
    description: '30-year-old male intubated for status asthmaticus. Ventilator set at RR 22 bpm with high applied PEEP (10 cmH2O). Measured Auto-PEEP surges to 16 cmH2O (Total PEEP 26 cmH2O), cutting venous return and causing profound shock (BP 58/32 mmHg).',
    inputs: {
      patientAgeYears: 30,
      patientWeightKg: 75,
      heightCm: 178,
      gender: 'MALE',
      respiratoryRateBpm: 22,
      oxygenSaturationPercent: 91,
      fractionInspiredO2: 0.6,
      peakExpiratoryFlowLMin: 150,
      baselinePredictedPefLMin: 600,
      dyspneaGrade: 'SILENT_EXHAUSTED',
      auscultationFindings: 'SILENT_CHEST',
      accessoryMuscleUse: 'PARADOXICAL_THORACOABDOMINAL',
      pulsusParadoxusMmHg: 25,
      arterialPh: 7.14,
      arterialPco2MmHg: 72,
      arterialPo2MmHg: 68,
      serumPotassiumMeqL: 3.1,
      serumLactateMmolL: 4.6,
      isMechanicallyVentilated: true,
      ventilatorTidalVolumeMl: 550,
      ventilatorRespiratoryRateBpm: 22, // Way too fast, prevents expiration!
      inspiratoryFlowRateLMin: 60,
      appliedPeepCmH2O: 10,             // Inappropriate applied PEEP
      measuredPlateauPressureCmH2O: 38, // Exceeds safe limit
      measuredAutoPeepCmH2O: 16,        // Massive air trapping
      isContinuousAlbuterolActive: true,
      isIpratropiumAdministered: true,
      isSystemicCorticosteroidGiven: true,
      isIvMagnesiumAdministered: true,
      isTerbutalineOrEpiGiven: false,
      isHelioxActive: false,
    },
  },
  {
    id: 'BRITTLE_SEVERE_MAGNESIUM_RESPONSE',
    name: 'Severe Status Asthmaticus with Multimodal Rescue',
    badge: 'Pharmacotherapy Protocol',
    description: '35-year-old female presenting with severe status asthmaticus. Received continuous Albuterol, Ipratropium, systemic corticosteroids, and IV Magnesium Sulfate (2 g), achieving gradual airway bronchodilation and preventing intubation.',
    inputs: {
      patientAgeYears: 35,
      patientWeightKg: 65,
      heightCm: 168,
      gender: 'FEMALE',
      respiratoryRateBpm: 26,
      oxygenSaturationPercent: 93,
      fractionInspiredO2: 0.4,
      peakExpiratoryFlowLMin: 220,
      baselinePredictedPefLMin: 480,
      dyspneaGrade: 'CAN_SPEAK_PHRASES',
      auscultationFindings: 'EXPIRATORY_WHEEZE',
      accessoryMuscleUse: 'MODERATE_INTERCOSTAL',
      pulsusParadoxusMmHg: 12,
      arterialPh: 7.36,
      arterialPco2MmHg: 34,
      arterialPo2MmHg: 74,
      serumPotassiumMeqL: 3.4,
      serumLactateMmolL: 2.1,
      isMechanicallyVentilated: false,
      ventilatorTidalVolumeMl: 450,
      ventilatorRespiratoryRateBpm: 12,
      inspiratoryFlowRateLMin: 80,
      appliedPeepCmH2O: 0,
      measuredPlateauPressureCmH2O: 18,
      measuredAutoPeepCmH2O: 0,
      isContinuousAlbuterolActive: true,
      isIpratropiumAdministered: true,
      isSystemicCorticosteroidGiven: true,
      isIvMagnesiumAdministered: true,
      isTerbutalineOrEpiGiven: false,
      isHelioxActive: false,
    },
  },
  {
    id: 'PERMISSIVE_HYPERCAPNIA_OPTIMAL_VENT',
    name: 'Intubated Severe Asthma with Lung-Protective Ventilation',
    badge: 'ICU Ventilator Strategy',
    description: '28-year-old male intubated with optimal status asthmaticus strategy: low RR (10 bpm), long expiratory time (I:E 1:4.5), low tidal volume (6 mL/kg), high inspiratory flow (90 L/min), accepting permissive hypercapnia (PaCO2 68 mmHg, pH 7.22).',
    inputs: {
      patientAgeYears: 28,
      patientWeightKg: 70,
      heightCm: 175,
      gender: 'MALE',
      respiratoryRateBpm: 10,
      oxygenSaturationPercent: 95,
      fractionInspiredO2: 0.4,
      peakExpiratoryFlowLMin: 180,
      baselinePredictedPefLMin: 550,
      dyspneaGrade: 'SILENT_EXHAUSTED',
      auscultationFindings: 'EXPIRATORY_WHEEZE',
      accessoryMuscleUse: 'NONE',
      pulsusParadoxusMmHg: 8,
      arterialPh: 7.22,
      arterialPco2MmHg: 68, // Well-tolerated permissive hypercapnia
      arterialPo2MmHg: 88,
      serumPotassiumMeqL: 3.7,
      serumLactateMmolL: 1.6,
      isMechanicallyVentilated: true,
      ventilatorTidalVolumeMl: 440,
      ventilatorRespiratoryRateBpm: 10, // Slow rate allows complete exhalation
      inspiratoryFlowRateLMin: 90,     // High flow shortens Ti
      appliedPeepCmH2O: 2,
      measuredPlateauPressureCmH2O: 24, // Safe plateau pressure (< 30 cmH2O)
      measuredAutoPeepCmH2O: 4,         // Minimal Auto-PEEP
      isContinuousAlbuterolActive: true,
      isIpratropiumAdministered: true,
      isSystemicCorticosteroidGiven: true,
      isIvMagnesiumAdministered: true,
      isTerbutalineOrEpiGiven: false,
      isHelioxActive: false,
    },
  },
];
