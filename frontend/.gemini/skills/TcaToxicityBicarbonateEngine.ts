/**
 * TcaToxicityBicarbonateEngine.ts
 * Biophysical, Electrophysiological & Toxicology Engine for Tricyclic Antidepressant (TCA) Overdose
 * Implements:
 * 1. 4 Core Toxic Mechanisms: Nav1.5 Sodium-Channel, Anticholinergic, Alpha-1 Antagonism, GABA Blockade
 * 2. 12-Lead ECG Hallmark Biomarkers: QRS Duration, Terminal R wave in aVR (> 3 mm), R/S ratio in aVR (> 0.7), QTc
 * 3. Sodium Bicarbonate (8.4% NaHCO3) Titration: Dual Mechanism (Na+ flooding + Serum Alkalinization pH 7.50-7.55)
 * 4. Critical Safety Interlocks: Absolute Physostigmine Prohibition, Class Ia/Ic Antiarrhythmic Hazard, Seizure Acidosis Trap
 * 5. Vasopressor (Norepinephrine) & Refractory Rescue (20% Lipid Emulsion / VA-ECMO)
 * Location: frontend/.gemini/skills/TcaToxicityBicarbonateEngine.ts
 */

export type TcaAgent = 'AMITRIPTYLINE' | 'NORTRIPTYLINE' | 'IMIPRAMINE' | 'DOXEPIN' | 'CLOMIPRAMINE';

export interface TcaPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  ingestedAgent: TcaAgent;
  estimatedDoseMg: number;
  hoursPostIngestion: number;
  coIngestants: string;

  // Electrophysiology & 12-Lead ECG
  heartRateBpm: number;
  qrsDurationMs: number;
  terminalRWaveAvrMm: number; // > 3 mm is highly predictive
  rToSRatioAvr: number;        // > 0.7 is abnormal
  qtcIntervalMs: number;

  // Hemodynamics & Neurologic Status
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  gcsScore: number; // 3 to 15
  hasActiveSeizures: boolean;
  pupilDiameterMm: number; // anticholinergic mydriasis 6-8 mm
  bowelSounds: 'NORMAL' | 'HYPOACTIVE' | 'ABSENT';
  axillaryMoisture: 'NORMAL' | 'DRY_ANHIDROTIC';

  // Blood Gas & Electrolytes
  arterialPh: number;
  serumBicarbonateMeqL: number;
  serumPotassiumMeqL: number;
  serumSodiumMeqL: number;

  // Resuscitation Interventions
  isSodiumBicarbonateBolusGiven: boolean;
  bicarbonateBolusDoseMeq: number; // 1-2 mEq/kg (50-100 mEq ampules)
  isBicarbonateInfusionActive: boolean;
  bicarbonateInfusionRateMlH: number; // 150 mEq in 1L D5W at 150-250 mL/h
  isPhysostigmineAttempted: boolean;  // Strict contraindication!
  antiarrhythmicGiven: 'NONE' | 'SODIUM_BICARBONATE' | 'LIDOCAINE' | 'PROCAINAMIDE_FLECAINIDE' | 'AMIODARONE';
  anticonvulsantGiven: 'NONE' | 'BENZODIAZEPINE' | 'PHENYTOIN' | 'PROPOFOL';
  vasopressorActive: 'NONE' | 'NOREPINEPHRINE' | 'EPINEPHRINE' | 'DOPAMINE' | 'PHENYLEPHRINE';
  isLipidRescueActive: boolean;
}

export interface EcgRiskStratification {
  qrsRiskCategory: 'LOW' | 'INTERMEDIATE_SEIZURE_RISK' | 'HIGH_VENTRICULAR_ARRHYTHMIA_RISK';
  seizureRiskPercent: number;
  ventricularArrhythmiaRiskPercent: number;
  terminalAvrSignificance: string;
  isQrsProlonged: boolean;
  isAvrTerminalRWaveProminent: boolean;
}

export interface BicarbonateTitrationOutput {
  recommendedBolusMeq: number; // 1-2 mEq/kg
  continuousInfusionRecipe: string;
  targetPhRange: string;
  targetBicarbonateRange: string;
  currentPhStatus: 'ACIDEMIC_DANGEROUS' | 'TARGET_THERAPEUTIC' | 'EXCESSIVE_ALKALEMIC_HAZARD';
  potassiumGuardrailAlert: string | null;
  mechanismsOfAction: {
    sodiumOvercomingPoreBlock: string;
    alkalinizationReceptorDissociation: string;
  };
}

export interface TcaSafetyInterlocksOutput {
  criticalSafetyAlerts: string[];
  contraindicatedActions: string[];
  immediateActionDirectives: string[];
  clinicalPearls: string[];
}

export interface ComprehensiveTcaEvaluation {
  ecgRisk: EcgRiskStratification;
  bicarbonate: BicarbonateTitrationOutput;
  meanArterialPressureMmHg: number;
  shockIndex: number;
  safetyInterlocks: TcaSafetyInterlocksOutput;
}

/**
 * 1. Stratify 12-Lead ECG Risk based on QRS and lead aVR
 */
export function evaluateEcgRisk(input: TcaPatientInput): EcgRiskStratification {
  const isQrsProlonged = input.qrsDurationMs >= 100;
  const isAvrProminent = input.terminalRWaveAvrMm >= 3.0 || input.rToSRatioAvr >= 0.7;

  let category: EcgRiskStratification['qrsRiskCategory'] = 'LOW';
  let seizureRisk = 5;
  let arrhythmiaRisk = 2;

  if (input.qrsDurationMs >= 160) {
    category = 'HIGH_VENTRICULAR_ARRHYTHMIA_RISK';
    seizureRisk = 45;
    arrhythmiaRisk = 52;
  } else if (input.qrsDurationMs >= 100) {
    category = 'INTERMEDIATE_SEIZURE_RISK';
    seizureRisk = 34;
    arrhythmiaRisk = 15;
  }

  let avrSignificance = 'Lead aVR terminal R wave is normal (< 3 mm). Low probability of right ventricular conduction delay.';
  if (input.terminalRWaveAvrMm >= 3.0 && input.rToSRatioAvr >= 0.7) {
    avrSignificance = `CRITICAL aVR SIGN: Terminal R wave >= 3 mm (${input.terminalRWaveAvrMm} mm) with R/S ratio >= 0.7 (${input.rToSRatioAvr.toFixed(2)}) indicates severe rightward terminal axis shift from profound Nav1.5 right ventricular Purkinje block. Highly predictive of imminent seizures and ventricular arrhythmias!`;
  } else if (input.terminalRWaveAvrMm >= 3.0 || input.rToSRatioAvr >= 0.7) {
    avrSignificance = `ELEVATED aVR SIGN: Terminal R wave of ${input.terminalRWaveAvrMm} mm or R/S ratio ${input.rToSRatioAvr.toFixed(2)} indicates early terminal axis deviation. Monitor ECG continuously.`;
  }

  return {
    qrsRiskCategory: category,
    seizureRiskPercent: seizureRisk,
    ventricularArrhythmiaRiskPercent: arrhythmiaRisk,
    terminalAvrSignificance: avrSignificance,
    isQrsProlonged,
    isAvrTerminalRWaveProminent: isAvrProminent,
  };
}

/**
 * 2. Evaluate Sodium Bicarbonate Dosing, Targets and Guardrails
 */
export function evaluateBicarbonateTherapy(input: TcaPatientInput): BicarbonateTitrationOutput {
  const bolus = Math.round(input.patientWeightKg * 1.5); // 1.5 mEq/kg average (approx 100 mEq for 70kg)

  let phStatus: BicarbonateTitrationOutput['currentPhStatus'] = 'ACIDEMIC_DANGEROUS';
  if (input.arterialPh >= 7.50 && input.arterialPh <= 7.55) {
    phStatus = 'TARGET_THERAPEUTIC';
  } else if (input.arterialPh > 7.55) {
    phStatus = 'EXCESSIVE_ALKALEMIC_HAZARD';
  }

  let kAlert: string | null = null;
  if (input.serumPotassiumMeqL < 3.5) {
    kAlert = `HYPOKALEMIA GUARDRAIL TRIPPED: Serum K+ is ${input.serumPotassiumMeqL.toFixed(1)} mEq/L! Alkalinization with NaHCO3 shifts K+ into cells, inducing severe hypokalemia and prolonging QTc. Supplement 20-40 mEq KCl per liter of infusion. Target K+ 4.0-4.5 mEq/L.`;
  }

  return {
    recommendedBolusMeq: bolus,
    continuousInfusionRecipe: '150 mEq NaHCO3 (3 ampules of 8.4%) in 1,000 mL D5W, infused at 150 to 250 mL/hr.',
    targetPhRange: '7.50 - 7.55',
    targetBicarbonateRange: '30 - 32 mEq/L',
    currentPhStatus: phStatus,
    potassiumGuardrailAlert: kAlert,
    mechanismsOfAction: {
      sodiumOvercomingPoreBlock: 'Extracellular Sodium Flood: High extracellular Na+ concentration creates an electrochemical driving gradient that overcomes competitive Nav1.5 channel pore blockade by TCA molecules.',
      alkalinizationReceptorDissociation: 'pH-Dependent Receptor Uncoupling: Raising serum pH to 7.50-7.55 shifts TCA molecules from their charged quaternary amine form into uncharged neutral species, dramatically accelerating dissociation from the cardiac channel binding site.',
    },
  };
}

/**
 * 3. Perform Comprehensive Evaluation with Safety Interlocks
 */
export function performTcaEvaluation(input: TcaPatientInput): ComprehensiveTcaEvaluation {
  const map = Math.round((input.systolicBpMmHg + 2 * input.diastolicBpMmHg) / 3);
  const shockIndex = Number((input.heartRateBpm / Math.max(1, input.systolicBpMmHg)).toFixed(2));

  const ecg = evaluateEcgRisk(input);
  const bicarb = evaluateBicarbonateTherapy(input);

  const alerts: string[] = [];
  const contraindications: string[] = [];
  const directives: string[] = [];

  // Interlock 1: Absolute Physostigmine Prohibition
  if (input.isPhysostigmineAttempted) {
    alerts.push(
      'LETHAL ANTIDOTE TRAP TRIPPED: Physostigmine is ABSOLUTELY CONTRAINDICATED in TCA overdose! Acetylcholinesterase inhibition in TCA poisoning precipitates profound cholinergic asystole, refractory bradycardia, and sudden cardiovascular collapse.'
    );
    contraindications.push('Physostigmine: NEVER administer to a patient with known or suspected TCA overdose.');
  }

  // Interlock 2: Class Ia and Ic Antiarrhythmic Contraindication
  if (input.antiarrhythmicGiven === 'PROCAINAMIDE_FLECAINIDE') {
    alerts.push(
      'FATAL ANTIARRHYTHMIC HAZARD: Class Ia (Procainamide, Quinidine) and Class Ic (Flecainide, Propafenone) are sodium channel blockers! Administering them on top of TCA Nav1.5 blockade exacerbates conduction delay and triggers immediate ventricular fibrillation.'
    );
    contraindications.push('Class Ia/Ic Antiarrhythmics (Procainamide, Flecainide): Strictly prohibited.');
  }

  // Interlock 3: Phenytoin Seizure Prohibition
  if (input.anticonvulsantGiven === 'PHENYTOIN') {
    alerts.push(
      'PHENYTOIN CONDUCTION HAZARD: Phenytoin is a Class Ib sodium-channel blocker that is ineffective for toxic seizures and compounds myocardial conduction impairment. First-line therapy for TCA seizures is exclusively IV Benzodiazepines.'
    );
    contraindications.push('Phenytoin: Contraindicated for TCA seizures; use Benzodiazepines (Lorazepam / Midazolam).');
  }

  // Interlock 4: Seizure Acidosis Cycle
  if (input.hasActiveSeizures || input.arterialPh < 7.25) {
    alerts.push(
      'SEIZURE ACIDOSIS MALIGNANT CYCLE: Active seizures produce massive lactic acidosis. Acidemia increases TCA protein unbinding and augments Nav1.5 receptor affinity, immediately triggering fatal monomorphic VT / VFib!'
    );
    directives.push('Administer IV Benzodiazepines (Lorazepam 2-4 mg or Midazolam 5-10 mg) immediately to terminate seizures.');
    directives.push('Push 100 mEq (2 ampules) of 8.4% Sodium Bicarbonate IV stat to counter post-ictal acidosis.');
  }

  // Interlock 5: Alkalemia Ceiling Hazard
  if (bicarb.currentPhStatus === 'EXCESSIVE_ALKALEMIC_HAZARD') {
    alerts.push(
      `EXCESSIVE ALKALEMIA WARNING: Arterial pH is ${input.arterialPh.toFixed(2)} (> 7.55)! Severe alkalemia triggers tetany, cerebral vasoconstriction, and dangerous intracellular potassium depletion. Titrate down or pause NaHCO3 infusion.`
    );
  }

  // Directives based on QRS
  if (ecg.isQrsProlonged && !input.isSodiumBicarbonateBolusGiven) {
    directives.push(`QRS is ${input.qrsDurationMs} ms (>= 100 ms): Administer 1 to 2 mEq/kg of 8.4% Sodium Bicarbonate (50-100 mEq IV push over 2-3 minutes).`);
    directives.push('Repeat 12-lead ECG in 5 minutes to confirm QRS narrowing.');
  }

  if (map < 65) {
    directives.push('Hypotension refractory to volume: Initiate Norepinephrine (alpha-1 agonist) to reverse peripheral vascular alpha-1 receptor blockade.');
  }

  if (input.qrsDurationMs >= 160 && input.antiarrhythmicGiven === 'NONE') {
    directives.push('Refractory ventricular tachycardia / QRS > 160 ms: Consider IV Lidocaine (Class Ib agent with rapid dissociation kinetics) if NaHCO3 is partially refractory.');
  }

  if (directives.length === 0) {
    directives.push('Maintain telemetry monitoring and serial 12-lead ECGs every 1-2 hours until QRS normalizes (< 100 ms).');
    directives.push('Monitor serum electrolytes (especially K+ and Na+) and arterial blood gases Q2-4h.');
  }

  const clinicalPearls: string[] = [
    'The classic triad of TCA toxicity: Anticholinergic toxidrome, Coma/Seizures, and Cardiac conduction delay.',
    'A terminal R wave > 3 mm in aVR is often the earliest diagnostic warning sign of impending cardiotoxicity before marked limb lead widening occurs.',
    'Sodium bicarbonate functions both via sodium pore competition AND alkalinization-induced uncoupling from the receptor site.',
    'Patients asymptomatic with normal ECG at 6 hours post-ingestion have virtually zero risk of delayed catastrophic cardiac arrest.',
    'Intravenous Lipid Emulsion (20% ILE) acts as an intravascular lipid sink for lipophilic TCAs (Amitriptyline logP ~4.9) in refractory arrest.',
  ];

  return {
    ecgRisk: ecg,
    bicarbonate: bicarb,
    meanArterialPressureMmHg: map,
    shockIndex,
    safetyInterlocks: {
      criticalSafetyAlerts: alerts,
      contraindicatedActions: contraindications,
      immediateActionDirectives: directives,
      clinicalPearls,
    },
  };
}

export interface TcaPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: TcaPatientInput;
}

export const TCA_PRESETS: TcaPreset[] = [
  {
    id: 'MASSIVE_AMITRIPTYLINE_WIDE_QRS',
    name: 'Amitriptyline Overdose with Severe QRS Widening',
    badge: 'Classic Cardiotoxicity',
    description: '28-year-old female ingested 2,500 mg Amitriptyline. Presenting obtunded (GCS 7) with dry skin, dilated pupils, BP 76/42 mmHg, QRS 152 ms, and terminal R wave in aVR of 4.2 mm.',
    inputs: {
      patientAgeYears: 28,
      patientWeightKg: 65,
      ingestedAgent: 'AMITRIPTYLINE',
      estimatedDoseMg: 2500,
      hoursPostIngestion: 2.5,
      coIngestants: 'NONE',
      heartRateBpm: 128,
      qrsDurationMs: 152,
      terminalRWaveAvrMm: 4.2,
      rToSRatioAvr: 1.1,
      qtcIntervalMs: 510,
      systolicBpMmHg: 76,
      diastolicBpMmHg: 42,
      gcsScore: 7,
      hasActiveSeizures: false,
      pupilDiameterMm: 7,
      bowelSounds: 'ABSENT',
      axillaryMoisture: 'DRY_ANHIDROTIC',
      arterialPh: 7.28,
      serumBicarbonateMeqL: 18,
      serumPotassiumMeqL: 4.2,
      serumSodiumMeqL: 138,
      isSodiumBicarbonateBolusGiven: false,
      bicarbonateBolusDoseMeq: 0,
      isBicarbonateInfusionActive: false,
      bicarbonateInfusionRateMlH: 0,
      isPhysostigmineAttempted: false,
      antiarrhythmicGiven: 'NONE',
      anticonvulsantGiven: 'NONE',
      vasopressorActive: 'NONE',
      isLipidRescueActive: false,
    },
  },
  {
    id: 'SEIZURE_ACIDOSIS_VENTRICULAR_TACHYCARDIA',
    name: 'Seizure Lactic Acidosis with Monomorphic VT',
    badge: 'Malignant Arrest Cycle',
    description: '34-year-old male ingested 3,000 mg Imipramine. Developed status epilepticus, severe post-ictal lactic acidosis (pH 7.12), QRS widening to 184 ms, degenerating into monomorphic ventricular tachycardia.',
    inputs: {
      patientAgeYears: 34,
      patientWeightKg: 78,
      ingestedAgent: 'IMIPRAMINE',
      estimatedDoseMg: 3000,
      hoursPostIngestion: 3,
      coIngestants: 'ALCOHOL',
      heartRateBpm: 165,
      qrsDurationMs: 184,
      terminalRWaveAvrMm: 5.5,
      rToSRatioAvr: 1.4,
      qtcIntervalMs: 545,
      systolicBpMmHg: 62,
      diastolicBpMmHg: 36,
      gcsScore: 3,
      hasActiveSeizures: true, // Triggers seizure acidosis cycle
      pupilDiameterMm: 8,
      bowelSounds: 'ABSENT',
      axillaryMoisture: 'DRY_ANHIDROTIC',
      arterialPh: 7.12, // Critical acidemia
      serumBicarbonateMeqL: 12,
      serumPotassiumMeqL: 4.6,
      serumSodiumMeqL: 136,
      isSodiumBicarbonateBolusGiven: false,
      bicarbonateBolusDoseMeq: 0,
      isBicarbonateInfusionActive: false,
      bicarbonateInfusionRateMlH: 0,
      isPhysostigmineAttempted: false,
      antiarrhythmicGiven: 'NONE',
      anticonvulsantGiven: 'NONE',
      vasopressorActive: 'NOREPINEPHRINE',
      isLipidRescueActive: false,
    },
  },
  {
    id: 'PHYSOSTIGMINE_ASYSTOLE_TRAP',
    name: 'Iatrogenic Physostigmine Administration Disaster',
    badge: 'Contraindicated Antidote Trap',
    description: 'Resuscitation scenario where Physostigmine 2 mg IV was erroneously administered for anticholinergic delirium, triggering profound cholinergic bradycardia and asystolic arrest.',
    inputs: {
      patientAgeYears: 42,
      patientWeightKg: 70,
      ingestedAgent: 'DOXEPIN',
      estimatedDoseMg: 1500,
      hoursPostIngestion: 1.5,
      coIngestants: 'NONE',
      heartRateBpm: 38, // Severe cholinergic bradycardia
      qrsDurationMs: 130,
      terminalRWaveAvrMm: 3.4,
      rToSRatioAvr: 0.85,
      qtcIntervalMs: 490,
      systolicBpMmHg: 54,
      diastolicBpMmHg: 30,
      gcsScore: 5,
      hasActiveSeizures: false,
      pupilDiameterMm: 5,
      bowelSounds: 'HYPOACTIVE',
      axillaryMoisture: 'NORMAL',
      arterialPh: 7.22,
      serumBicarbonateMeqL: 16,
      serumPotassiumMeqL: 4.8,
      serumSodiumMeqL: 137,
      isSodiumBicarbonateBolusGiven: false,
      bicarbonateBolusDoseMeq: 0,
      isBicarbonateInfusionActive: false,
      bicarbonateInfusionRateMlH: 0,
      isPhysostigmineAttempted: true, // Triggers lethal antidote trap!
      antiarrhythmicGiven: 'NONE',
      anticonvulsantGiven: 'NONE',
      vasopressorActive: 'EPINEPHRINE',
      isLipidRescueActive: false,
    },
  },
  {
    id: 'EXCESSIVE_ALKALEMIA_HYPOKALEMIA',
    name: 'Excessive Bicarbonate Alkalemia & Hypokalemia Trap',
    badge: 'Iatrogenic Alkalemia Hazard',
    description: 'Aggressive unmonitored sodium bicarbonate infusion resulted in extreme metabolic alkalemia (pH 7.62, HCO3 39 mEq/L) and profound intracellular potassium depletion (K+ 2.7 mEq/L) causing tetany and worsened QTc.',
    inputs: {
      patientAgeYears: 22,
      patientWeightKg: 55,
      ingestedAgent: 'NORTRIPTYLINE',
      estimatedDoseMg: 1000,
      hoursPostIngestion: 5,
      coIngestants: 'NONE',
      heartRateBpm: 104,
      qrsDurationMs: 98, // QRS normalized
      terminalRWaveAvrMm: 1.8,
      rToSRatioAvr: 0.45,
      qtcIntervalMs: 520, // Prolonged due to hypokalemia!
      systolicBpMmHg: 108,
      diastolicBpMmHg: 68,
      gcsScore: 13,
      hasActiveSeizures: false,
      pupilDiameterMm: 4,
      bowelSounds: 'NORMAL',
      axillaryMoisture: 'NORMAL',
      arterialPh: 7.62, // Critical alkalemia (> 7.55)
      serumBicarbonateMeqL: 39,
      serumPotassiumMeqL: 2.7, // Critical hypokalemia (< 3.5)
      serumSodiumMeqL: 154,
      isSodiumBicarbonateBolusGiven: true,
      bicarbonateBolusDoseMeq: 150,
      isBicarbonateInfusionActive: true,
      bicarbonateInfusionRateMlH: 300,
      isPhysostigmineAttempted: false,
      antiarrhythmicGiven: 'SODIUM_BICARBONATE',
      anticonvulsantGiven: 'BENZODIAZEPINE',
      vasopressorActive: 'NONE',
      isLipidRescueActive: false,
    },
  },
];
