/**
 * StatusEpilepticusEngine.ts
 *
 * Comprehensive Biophysical & Neurocritical Care Engine for Status Epilepticus:
 * - American Epilepsy Society (AES 2016/2023) & Neurocritical Care Society (NCS) 3-Phase Algorithmic Protocol
 * - Phase 1: First-line IV/IM/Rectal Benzodiazepine precision weight-based dosing & underdosing safety interlocks
 * - Phase 2: Established SE (ESETT trial) second-line IV non-sedating ASMs (Levetiracetam, Fosphenytoin, Valproate)
 * - Phase 3: Refractory SE (RSE) continuous anesthetic infusions (Propofol, Midazolam, Ketamine) & PRIS interlock
 * - Receptor Trafficking Kinetics: Synaptic GABA_A receptor endocytosis vs NMDA receptor surface upregulation over time
 * - Electrographic Burst Suppression: Burst Suppression Ratio (BSR), target 8-12 bursts/min (50-80% suppression)
 * - Salzburg Consensus Criteria (2015) for Non-Convulsive Status Epilepticus (NCSE)
 *
 * Location: frontend/.gemini/skills/StatusEpilepticusEngine.ts
 */

export type StatusSeizureType =
  | 'CONVULSIVE_GCSE' // Generalized convulsive status epilepticus (bilateral tonic-clonic)
  | 'FOCAL_MOTOR_AWARE' // Focal motor SE with intact awareness
  | 'FOCAL_IMPAIRED_AWARENESS' // Focal SE with impaired consciousness
  | 'NON_CONVULSIVE_NCSE'; // Non-convulsive status epilepticus (with or without coma)

export type StatusPhase =
  | 'PRE_STATUS_IMMINENT' // 0 - 5 min: Ongoing seizure, preparing intervention
  | 'PHASE_1_EARLY_SE' // 5 - 10/20 min: First-line Benzodiazepine indicated
  | 'PHASE_2_ESTABLISHED_SE' // 10/20 - 40 min: Failed BZD, second-line IV ASM indicated
  | 'PHASE_3_REFRACTORY_SE' // > 20-40 min: Failed BZD + ASM, ICU intubation & continuous anesthetics
  | 'SUPER_REFRACTORY_SE'; // > 24 hours: Persistent/recurrent on continuous anesthetics

export type FirstLineBenzodiazepine =
  | 'LORAZEPAM_IV' // 0.1 mg/kg IV, max 4 mg/dose
  | 'MIDAZOLAM_IM' // 10 mg IM (>40kg) or 5 mg IM (13-40kg)
  | 'DIAZEPAM_IV' // 0.15 - 0.2 mg/kg IV, max 10 mg/dose
  | 'DIAZEPAM_RECTAL'; // 0.2 - 0.5 mg/kg rectal gel

export type SecondLineAsm =
  | 'LEVETIRACETAM_IV' // 60 mg/kg IV, max 4500 mg (ESETT)
  | 'FOSPHENYTOIN_IV' // 20 mg PE/kg IV, max 1500 mg PE (ESETT)
  | 'VALPROATE_SODIUM_IV' // 40 mg/kg IV, max 3000 mg (ESETT)
  | 'PHENOBARBITAL_IV'; // 15 - 20 mg/kg IV rescue

export type ContinuousAnestheticAgent =
  | 'PROPOFOL' // 2 - 10 mg/kg/h (watch PRIS > 4-5 mg/kg/h)
  | 'MIDAZOLAM_INFUSION' // 0.05 - 2.0 mg/kg/h
  | 'KETAMINE_INFUSION' // 1.0 - 5.0 mg/kg/h (NMDA blockade)
  | 'PENTOBARBITAL'; // 1 - 5 mg/kg/h

export interface StatusEpilepticusPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  seizureDurationMinutes: number;
  seizureType: StatusSeizureType;
  hasIvAccess: boolean;
  priorEpilepsyHistory: boolean;
  knownMitochondrialDisorderOrLiverDisease: boolean;
  hasSinusBradycardiaOrHeartBlock: boolean;
  isPregnant: boolean;
  // Phase 1 Administration History
  firstLineBenzodiazepineGiven?: FirstLineBenzodiazepine;
  firstLineDoseAdministeredMg?: number;
  numberOfBenzodiazepineDosesGiven: number;
  timeSinceFirstBzdMinutes?: number;
  // Phase 2 Administration History
  secondLineAsmAdministered?: SecondLineAsm;
  secondLineDoseAdministeredMg?: number;
  secondLineInfusionComplete: boolean;
  // Phase 3 Anesthetic Parameters
  isMechanicallyVentilated: boolean;
  continuousAnesthetic?: ContinuousAnestheticAgent;
  anestheticDoseMgKgH?: number;
  anestheticDurationHours?: number;
  // EEG Parameters
  continuousEegActive: boolean;
  eegDischargeFrequencyHz: number; // e.g. 1.0 - 4.0 Hz
  eegHasSpatiotemporalEvolution: boolean;
  eegHasResponseToIvTrial: boolean;
  observedBurstSuppressionRatioPercent?: number; // 0 - 100%
}

export interface FirstLineBzdRecommendation {
  agent: FirstLineBenzodiazepine;
  agentName: string;
  recommendedDoseMg: number;
  maxSingleDoseMg: number;
  route: string;
  administrationSpeed: string;
  repeatWindowMinutes: string;
  isUnderdosed: boolean;
  underdosedWarning?: string;
  clinicalRationale: string;
}

export interface SecondLineAsmRecommendation {
  agent: SecondLineAsm;
  agentName: string;
  recommendedDoseMg: number;
  maxSingleDoseMg: number;
  infusionTimeMinutes: number;
  infusionRateLimit: string;
  contraindicationsDetected: string[];
  isContraindicated: boolean;
  monitoringRequirements: string[];
  esettEvidenceSummary: string;
}

export interface Phase3AnestheticEvaluation {
  currentPhase: StatusPhase;
  anestheticAgent?: ContinuousAnestheticAgent;
  anestheticDoseMgKgH: number;
  isPrisRiskHigh: boolean;
  prisWarning?: string;
  targetBurstSuppressionRatio: string;
  currentBurstSuppressionAdequacy: 'SUB_THERAPEUTIC' | 'ON_TARGET' | 'EXCESSIVE_SUPPRESSION' | 'NOT_APPLICABLE';
  titrationRecommendation: string;
  superRefractoryOptions: string[];
}

export interface ReceptorTraffickingKinetics {
  elapsedMinutes: number;
  synapticGabaAReceptorDensityPercent: number; // drops from 100% down to ~10-20%
  synapticNmdaReceptorDensityPercent: number; // surges from 100% up to ~220-280%
  relativeBenzodiazepineEfficacyPercent: number; // mirrors GABA_A loss
  relativeKetamineSynergyScore: number; // 1.0 to 3.5x as NMDA upregulates
  pathophysiologicDescription: string;
}

export interface SalzburgNcseEvaluation {
  isCriteriaMet: boolean;
  diagnosticConfidence: 'DEFINITE_NCSE' | 'POSSIBLE_NCSE' | 'UNLIKELY_NCSE';
  matchedFeatures: string[];
  clinicalManagementAdvice: string;
}

export interface StatusEpilepticusComprehensiveOutput {
  statusPhase: StatusPhase;
  phaseLabel: string;
  timeToT2DamageThresholdMinutes: number; // minutes remaining before irreversible injury (t2 = 30 min for convulsive)
  isPastT2Threshold: boolean;
  firstLineBzd: FirstLineBzdRecommendation;
  secondLineAsm: SecondLineAsmRecommendation;
  phase3Anesthetic: Phase3AnestheticEvaluation;
  receptorTrafficking: ReceptorTraffickingKinetics;
  salzburgNcse: SalzburgNcseEvaluation;
  urgentActionChecklist: string[];
  clinicalPearls: string[];
}

/**
 * Determine the exact status phase based on seizure duration and treatment responses.
 */
export function determineStatusPhase(
  durationMinutes: number,
  seizureType: StatusSeizureType,
  bzdDosesGiven: number,
  secondLineGiven: boolean,
  anestheticHours: number
): StatusPhase {
  if (anestheticHours >= 24) {
    return 'SUPER_REFRACTORY_SE';
  }
  if (durationMinutes >= 30 || (bzdDosesGiven >= 2 && secondLineGiven)) {
    return 'PHASE_3_REFRACTORY_SE';
  }
  if (durationMinutes >= 10 || bzdDosesGiven >= 1) {
    return 'PHASE_2_ESTABLISHED_SE';
  }
  if (durationMinutes >= 5) {
    return 'PHASE_1_EARLY_SE';
  }
  return 'PRE_STATUS_IMMINENT';
}

/**
 * Compute First-Line Benzodiazepine Protocol.
 */
export function computeFirstLineBzd(
  weightKg: number,
  hasIvAccess: boolean,
  administeredAgent?: FirstLineBenzodiazepine,
  administeredDoseMg?: number
): FirstLineBzdRecommendation {
  const safeWeight = Math.max(10, Math.min(180, weightKg));
  let recommendedAgent: FirstLineBenzodiazepine;
  let recommendedDoseMg: number;
  let maxSingleDoseMg: number;
  let route: string;
  let administrationSpeed: string;
  let repeatWindowMinutes = '5 to 10 minutes (if seizure persists)';
  let rationale: string;

  if (hasIvAccess) {
    recommendedAgent = 'LORAZEPAM_IV';
    recommendedDoseMg = Math.round(Math.min(4.0, safeWeight * 0.1) * 10) / 10;
    maxSingleDoseMg = 4.0;
    route = 'Intravenous (IV)';
    administrationSpeed = '2 mg/min slow IV push';
    rationale =
      'IV Lorazepam (0.1 mg/kg, max 4 mg) is the preferred first-line agent when IV access exists due to superior prolonged seizure termination and low redistribution volume compared to diazepam.';
  } else {
    recommendedAgent = 'MIDAZOLAM_IM';
    recommendedDoseMg = safeWeight >= 40 ? 10.0 : 5.0;
    maxSingleDoseMg = 10.0;
    route = 'Intramuscular (IM) autoinjector or syringe';
    administrationSpeed = 'Direct deep IM injection into mid-outer vastus lateralis';
    rationale =
      'IM Midazolam (10 mg for >40 kg, 5 mg for 13-40 kg) is FDA-approved and preferred over IV access establishment delays (RAMPART trial: faster seizure cessation and fewer hospitalizations).';
  }

  let isUnderdosed = false;
  let underdosedWarning: string | undefined;

  if (administeredAgent && administeredDoseMg !== undefined && administeredDoseMg > 0) {
    let targetMinDose = 0;
    if (administeredAgent === 'LORAZEPAM_IV') {
      targetMinDose = Math.min(4.0, safeWeight * 0.08);
    } else if (administeredAgent === 'MIDAZOLAM_IM') {
      targetMinDose = safeWeight >= 40 ? 8.0 : 4.0;
    } else if (administeredAgent === 'DIAZEPAM_IV') {
      targetMinDose = Math.min(10.0, safeWeight * 0.15);
    }

    if (administeredDoseMg < targetMinDose) {
      isUnderdosed = true;
      underdosedWarning = `Dose of ${administeredDoseMg} mg is SUBTHERAPEUTIC for patient weight of ${safeWeight} kg (Target: ${recommendedDoseMg} mg). Underdosing benzodiazepines is the #1 preventable driver of refractory status. Administer the remaining dose immediately.`;
    }
  }

  return {
    agent: recommendedAgent,
    agentName:
      recommendedAgent === 'LORAZEPAM_IV'
        ? 'IV Lorazepam (Ativan)'
        : recommendedAgent === 'MIDAZOLAM_IM'
        ? 'IM Midazolam (Versed)'
        : 'IV Diazepam (Valium)',
    recommendedDoseMg,
    maxSingleDoseMg,
    route,
    administrationSpeed,
    repeatWindowMinutes,
    isUnderdosed,
    underdosedWarning,
    clinicalRationale: rationale,
  };
}

/**
 * Compute Second-Line Antiseizure Medication (ESETT Trial Protocol).
 */
export function computeSecondLineAsm(
  weightKg: number,
  preferredAgent: SecondLineAsm = 'LEVETIRACETAM_IV',
  knownLiverOrMito: boolean = false,
  hasBradycardiaOrBlock: boolean = false,
  isPregnant: boolean = false
): SecondLineAsmRecommendation {
  const safeWeight = Math.max(10, Math.min(180, weightKg));
  const contraindications: string[] = [];

  let agentName = 'IV Levetiracetam (Keppra)';
  let recommendedDoseMg = Math.min(4500, Math.round(safeWeight * 60));
  let maxSingleDoseMg = 4500;
  let infusionTimeMinutes = 10;
  let infusionRateLimit = 'Infuse total dose over 10 minutes';
  let monitoringRequirements: string[] = ['Continuous SpO2 and non-invasive blood pressure', 'Behavioral/agitation monitoring post-infusion'];

  if (preferredAgent === 'LEVETIRACETAM_IV') {
    agentName = 'IV Levetiracetam (Keppra)';
    recommendedDoseMg = Math.min(4500, Math.round(safeWeight * 60));
    maxSingleDoseMg = 4500;
    infusionTimeMinutes = 10;
    infusionRateLimit = 'Infuse total dose in 100 mL NS/D5W over 10 minutes';
    monitoringRequirements = ['Continuous telemetry', 'Pulse oximetry', 'Post-ictal mental status'];
  } else if (preferredAgent === 'FOSPHENYTOIN_IV') {
    agentName = 'IV Fosphenytoin (Cerebyx)';
    recommendedDoseMg = Math.min(1500, Math.round(safeWeight * 20)); // in mg PE
    maxSingleDoseMg = 1500;
    infusionTimeMinutes = Math.ceil(recommendedDoseMg / 150); // max 150 mg PE/min
    infusionRateLimit = 'Max 150 mg PE/min (Never exceed rate due to severe cardiotoxicity)';
    monitoringRequirements = [
      'Continuous 12-lead ECG rhythm strip (mandatory)',
      'Continuous arterial or automated cycling BP (every 2-3 min)',
      'Monitor for QT prolongation, PR widening, and severe hypotension',
    ];
    if (hasBradycardiaOrBlock) {
      contraindications.push('Severe sinus bradycardia or 2nd/3rd degree AV block: Fosphenytoin is strictly contraindicated due to sodium-channel cardiac arrest risk.');
    }
  } else if (preferredAgent === 'VALPROATE_SODIUM_IV') {
    agentName = 'IV Valproate Sodium (Depacon)';
    recommendedDoseMg = Math.min(3000, Math.round(safeWeight * 40));
    maxSingleDoseMg = 3000;
    infusionTimeMinutes = 10;
    infusionRateLimit = 'Infuse in 100 mL NS/D5W over 10 minutes (approx 3-6 mg/kg/min)';
    monitoringRequirements = [
      'Baseline hepatic function panel and platelet count',
      'Serum ammonia if delayed awakening occurs post-status',
      'Avoid in women of childbearing potential when alternatives exist',
    ];
    if (knownLiverOrMito) {
      contraindications.push('Known acute liver disease or mitochondrial disorder (POLG mutation): Valproate precipitates fatal fulminant hepatic necrosis.');
    }
    if (isPregnant) {
      contraindications.push('Pregnancy: Valproate causes severe neural tube defects and congenital neurocognitive deficits.');
    }
  } else if (preferredAgent === 'PHENOBARBITAL_IV') {
    agentName = 'IV Phenobarbital';
    recommendedDoseMg = Math.min(1200, Math.round(safeWeight * 20));
    maxSingleDoseMg = 1200;
    infusionTimeMinutes = 20;
    infusionRateLimit = 'Infusion rate must NOT exceed 50-100 mg/min';
    monitoringRequirements = [
      'Airway readiness (very high incidence of respiratory arrest)',
      'Vasopressor support readiness (potent systemic vasodilation)',
    ];
  }

  const isContraindicated = contraindications.length > 0;
  const esettSummary =
    'ESETT Trial (NEJM 2019): Levetiracetam (60 mg/kg), Fosphenytoin (20 mg PE/kg), and Valproate (40 mg/kg) achieved identical ~47% efficacy in terminating status at 60 minutes with comparable safety profiles.';

  return {
    agent: preferredAgent,
    agentName,
    recommendedDoseMg,
    maxSingleDoseMg,
    infusionTimeMinutes,
    infusionRateLimit,
    contraindicationsDetected: contraindications,
    isContraindicated,
    monitoringRequirements,
    esettEvidenceSummary: esettSummary,
  };
}

/**
 * Model Progressive GABA_A Receptor Endocytosis & NMDA Receptor Upregulation Kinetics.
 *
 * Biophysical principle: Synaptic GABA_A receptors undergo rapid clathrin-mediated
 * internalization into endosomes starting within 5-15 min of unremitting seizure activity.
 * Conversely, glutamatergic NMDA/AMPA receptors migrate from extrasynaptic reserves to the
 * active synapse, rendering benzodiazepines ineffective and ketamine/NMDA antagonists highly potent.
 */
export function calculateReceptorTraffickingKinetics(durationMinutes: number): ReceptorTraffickingKinetics {
  const t = Math.max(0, durationMinutes);

  // GABA_A density drops exponentially: N(t) = N_inf + (N_0 - N_inf) * exp(-k * t)
  // At t=0 -> 100%, at t=15 -> 55%, at t=30 -> 25%, at t=60+ -> ~12%
  const gabaDensity = Math.round(12 + (100 - 12) * Math.exp(-0.065 * t));

  // NMDA density surges: surges up to ~250%
  // At t=0 -> 100%, at t=15 -> 140%, at t=30 -> 200%, at t=60 -> 250%
  const nmdaDensity = Math.round(100 + 150 * (1 - Math.exp(-0.045 * t)));

  // Relative Benzodiazepine efficacy directly reflects available synaptic GABA_A receptors
  const bzdEfficacy = Math.round(gabaDensity * 0.95);

  // Ketamine synergy score (multiplication factor: 1.0 at baseline up to 3.2x as NMDA pools surge)
  const ketamineSynergy = Math.round((1.0 + (nmdaDensity - 100) / 70) * 10) / 10;

  let description: string;
  if (t < 5) {
    description =
      'Normal receptor architecture: Abundant synaptic GABA_A receptors ensure high responsiveness to first-line benzodiazepines.';
  } else if (t < 15) {
    description =
      'Early clathrin-mediated endocytosis: Synaptic GABA_A receptors begin rapid internalization into intracellular endosomes. Benzodiazepine potency begins to fall.';
  } else if (t < 30) {
    description =
      'Established pharmacoresistance: Over 60-75% of synaptic GABA_A receptors have internalized. Concurrently, excitatory NMDA/AMPA receptors migrate to the synapse, accelerating excitotoxicity.';
  } else {
    description =
      'Severe receptor remodeling: Synaptic GABA_A density is reduced by >85%, explaining complete benzodiazepine refractoriness. Abundant NMDA receptors make Ketamine infusion biologically synergistic and neuroprotective.';
  }

  return {
    elapsedMinutes: t,
    synapticGabaAReceptorDensityPercent: gabaDensity,
    synapticNmdaReceptorDensityPercent: nmdaDensity,
    relativeBenzodiazepineEfficacyPercent: bzdEfficacy,
    relativeKetamineSynergyScore: ketamineSynergy,
    pathophysiologicDescription: description,
  };
}

/**
 * Compute Phase 3 Continuous Anesthetics & PRIS Interlock.
 */
export function evaluatePhase3Anesthetic(
  phase: StatusPhase,
  agent: ContinuousAnestheticAgent = 'PROPOFOL',
  doseMgKgH: number = 4.0,
  durationHours: number = 12,
  observedBsrPercent: number = 65
): Phase3AnestheticEvaluation {
  let isPrisHigh = false;
  let prisWarning: string | undefined;

  if (agent === 'PROPOFOL') {
    // PRIS threshold: dose > 4.5 mg/kg/h or duration > 48h
    if (doseMgKgH >= 4.5 || durationHours >= 48) {
      isPrisHigh = true;
      prisWarning = `CRITICAL PRIS ALERT: Propofol dose of ${doseMgKgH} mg/kg/h for ${durationHours} hours exceeds safety thresholds (>4-5 mg/kg/h for >48h). High risk of Propofol Infusion Syndrome (severe metabolic acidosis, rhabdomyolysis, hyperkalemia, acute renal failure, and fatal Brugada-like cardiac arrest). Check serial arterial blood gas, lactate, CPK, and triglycerides. Switch to Ketamine or Midazolam.`;
    }
  }

  let adequacy: 'SUB_THERAPEUTIC' | 'ON_TARGET' | 'EXCESSIVE_SUPPRESSION' | 'NOT_APPLICABLE' = 'NOT_APPLICABLE';
  let titrationRec = '';

  if (phase === 'PHASE_3_REFRACTORY_SE' || phase === 'SUPER_REFRACTORY_SE') {
    if (observedBsrPercent < 50) {
      adequacy = 'SUB_THERAPEUTIC';
      titrationRec = `Current Burst Suppression Ratio of ${observedBsrPercent}% is below target (50-80%). Increase anesthetic infusion rate by 10-20% under continuous cEEG guidance until 8-12 bursts/min (or >50% suppression) are achieved.`;
    } else if (observedBsrPercent > 85) {
      adequacy = 'EXCESSIVE_SUPPRESSION';
      titrationRec = `Current Burst Suppression Ratio of ${observedBsrPercent}% reflects excessive electrographic quiescence / near-isoelectricity. Gently down-titrate to prevent prolonged ICU delirium, severe vasodilation, and delayed emergence.`;
    } else {
      adequacy = 'ON_TARGET';
      titrationRec = `Burst Suppression Ratio of ${observedBsrPercent}% is ON TARGET (50-80% suppression). Maintain electrographic silence for 24-48 hours before attempting slow tapering (reduce by 10-25% every 4-6 hours).`;
    }
  }

  const superRefractoryOptions = [
    'Ketogenic Diet (4:1 fat-to-carbohydrate/protein ratio)',
    'Ketamine continuous NMDA antagonist infusion (1.0 - 5.0 mg/kg/h)',
    'Immunotherapy: IV Methylprednisolone 1g/day + IVIG 0.4 g/kg/day (treats NORSE / FIRES / autoimmune encephalitis)',
    'Therapeutic Hypothermia (32 - 35°C for 24-48 hours)',
    'Inhaled Volatile Anesthetics (Isoflurane / Desflurane via Anaconda device)',
    'Surgical Resection / Vagal Nerve Stimulation (VNS) / Responsive Neurostimulation (RNS)',
  ];

  return {
    currentPhase: phase,
    anestheticAgent: agent,
    anestheticDoseMgKgH: doseMgKgH,
    isPrisRiskHigh: isPrisHigh,
    prisWarning,
    targetBurstSuppressionRatio: '50% to 80% suppression (8 - 12 bursts per minute)',
    currentBurstSuppressionAdequacy: adequacy,
    titrationRecommendation: titrationRec,
    superRefractoryOptions,
  };
}

/**
 * Evaluate Salzburg Consensus Criteria for Non-Convulsive Status Epilepticus (NCSE).
 */
export function evaluateSalzburgNcseCriteria(
  seizureType: StatusSeizureType,
  dischargeFrequencyHz: number,
  hasSpatiotemporalEvolution: boolean,
  hasResponseToIvTrial: boolean
): SalzburgNcseEvaluation {
  const matchedFeatures: string[] = [];

  if (dischargeFrequencyHz > 2.5) {
    matchedFeatures.push(`Continuous epileptiform discharges > 2.5 Hz (${dischargeFrequencyHz} Hz) on continuous EEG.`);
  }

  if (dischargeFrequencyHz <= 2.5 && dischargeFrequencyHz >= 0.5) {
    matchedFeatures.push(`Rhythmic delta/theta activity or discharges <= 2.5 Hz (${dischargeFrequencyHz} Hz).`);
    if (hasSpatiotemporalEvolution) {
      matchedFeatures.push('Definite spatiotemporal evolution in frequency (>1 Hz shift), morphology, or spatial distribution.');
    }
    if (hasResponseToIvTrial) {
      matchedFeatures.push('Prompt clinical or electrographic resolution upon IV trial of fast-acting ASM (Lorazepam or Levetiracetam).');
    }
  }

  let isCriteriaMet = false;
  let confidence: 'DEFINITE_NCSE' | 'POSSIBLE_NCSE' | 'UNLIKELY_NCSE' = 'UNLIKELY_NCSE';
  let advice = '';

  if (seizureType === 'NON_CONVULSIVE_NCSE' || seizureType === 'FOCAL_IMPAIRED_AWARENESS') {
    if (dischargeFrequencyHz > 2.5) {
      isCriteriaMet = true;
      confidence = 'DEFINITE_NCSE';
      advice =
        'Definite NCSE confirmed by Salzburg Criteria (>2.5 Hz epileptiform discharges). Initiate immediate first-line IV ASM therapy and continuous cEEG monitoring to prevent permanent excitotoxic cognitive injury.';
    } else if (dischargeFrequencyHz >= 0.5 && (hasSpatiotemporalEvolution || hasResponseToIvTrial)) {
      isCriteriaMet = true;
      confidence = 'DEFINITE_NCSE';
      advice =
        'Definite NCSE confirmed by Salzburg Criteria (<=2.5 Hz with documented electrographic evolution and/or positive response to IV ASM trial). Proceed with urgent ASM treatment.';
    } else if (dischargeFrequencyHz >= 0.5) {
      isCriteriaMet = false;
      confidence = 'POSSIBLE_NCSE';
      advice =
        'Possible NCSE: Discharges <= 2.5 Hz without documented evolution. Perform a standardized IV fast-acting ASM challenge (e.g. 1 mg IV Lorazepam or 1000 mg IV Levetiracetam) while recording continuous EEG.';
    } else {
      isCriteriaMet = false;
      confidence = 'UNLIKELY_NCSE';
      advice = 'Unlikely NCSE: EEG background lacks rhythmic epileptiform activity exceeding 0.5 Hz.';
    }
  } else {
    advice = 'Patient exhibits overt motor/convulsive semiology. Apply convulsive GCSE algorithmic protocol.';
  }

  return {
    isCriteriaMet,
    diagnosticConfidence: confidence,
    matchedFeatures,
    clinicalManagementAdvice: advice,
  };
}

/**
 * Perform Comprehensive Status Epilepticus Evaluation.
 */
export function performStatusEpilepticusEvaluation(
  input: StatusEpilepticusPatientInput
): StatusEpilepticusComprehensiveOutput {
  const phase = determineStatusPhase(
    input.seizureDurationMinutes,
    input.seizureType,
    input.numberOfBenzodiazepineDosesGiven,
    input.secondLineInfusionComplete,
    input.anestheticDurationHours || 0
  );

  // Time to irreversible injury (t2): 30 min for convulsive GCSE, 60 min for NCSE/focal
  const t2Threshold = input.seizureType === 'CONVULSIVE_GCSE' ? 30 : 60;
  const timeRemainingToT2 = Math.max(0, t2Threshold - input.seizureDurationMinutes);
  const isPastT2 = input.seizureDurationMinutes >= t2Threshold;

  const firstLineBzd = computeFirstLineBzd(
    input.patientWeightKg,
    input.hasIvAccess,
    input.firstLineBenzodiazepineGiven,
    input.firstLineDoseAdministeredMg
  );

  const secondLineAsm = computeSecondLineAsm(
    input.patientWeightKg,
    input.secondLineAsmAdministered || 'LEVETIRACETAM_IV',
    input.knownMitochondrialDisorderOrLiverDisease,
    input.hasSinusBradycardiaOrHeartBlock,
    input.isPregnant
  );

  const receptorTrafficking = calculateReceptorTraffickingKinetics(input.seizureDurationMinutes);

  const phase3Anesthetic = evaluatePhase3Anesthetic(
    phase,
    input.continuousAnesthetic || 'PROPOFOL',
    input.anestheticDoseMgKgH || 4.0,
    input.anestheticDurationHours || 6,
    input.observedBurstSuppressionRatioPercent !== undefined ? input.observedBurstSuppressionRatioPercent : 65
  );

  const salzburgNcse = evaluateSalzburgNcseCriteria(
    input.seizureType,
    input.eegDischargeFrequencyHz,
    input.eegHasSpatiotemporalEvolution,
    input.eegHasResponseToIvTrial
  );

  // Urgent Action Checklist
  const urgentActions: string[] = [
    'Secure Airway, Breathing, and Circulation (high-flow O2 via non-rebreather, suction oral cavity, do NOT place bite blocks).',
    'Fingerstick Blood Glucose immediately (rule out profound hypoglycemia; administer 50 mL D50W if < 60 mg/dL).',
    'Draw STAT labs: Electrolytes, ionized calcium, magnesium, venous/arterial blood gas, toxic screen, and baseline ASM levels.',
  ];

  if (phase === 'PHASE_1_EARLY_SE') {
    urgentActions.push(`Administer ${firstLineBzd.agentName} ${firstLineBzd.recommendedDoseMg} mg ${firstLineBzd.route} immediately.`);
    if (firstLineBzd.isUnderdosed) {
      urgentActions.push(`CORRECT UNDERDOSING: ${firstLineBzd.underdosedWarning}`);
    }
  } else if (phase === 'PHASE_2_ESTABLISHED_SE') {
    urgentActions.push(`Administer Second-Line IV ${secondLineAsm.agentName} ${secondLineAsm.recommendedDoseMg} mg over ${secondLineAsm.infusionTimeMinutes} minutes.`);
    urgentActions.push('Prepare RSI airway equipment and mechanical ventilator in case seizure fails to terminate within 10-15 minutes.');
  } else if (phase === 'PHASE_3_REFRACTORY_SE' || phase === 'SUPER_REFRACTORY_SE') {
    urgentActions.push('Endotracheal Intubation & Mechanical Ventilation (mandatory with continuous IV anesthetic infusions).');
    urgentActions.push('Continuous ICU EEG Monitoring (cEEG) setup: titrate anesthetic infusion to 50-80% burst suppression.');
    if (phase3Anesthetic.isPrisRiskHigh) {
      urgentActions.push(phase3Anesthetic.prisWarning || 'PRIS Risk High');
    }
  }

  const clinicalPearls: string[] = [
    'Benzodiazepine Underdosing Pitfall: Over 65-70% of status epilepticus patients are initially underdosed. Giving 2 mg lorazepam to an 80 kg adult (who requires 4 mg IV) directly triples the risk of status progression and ICU admission.',
    'Receptor Endocytosis Clock: Synaptic GABA_A receptors internalize into endosomes within 15-30 minutes of continuous seizing. After 30 minutes, benzodiazepines lose ~80-90% of their therapeutic potency while upregulated NMDA receptors make Ketamine highly effective.',
    'ESETT Trial Equivalence: Levetiracetam (60 mg/kg), Fosphenytoin (20 mg PE/kg), and Valproate (40 mg/kg) show identical efficacy (~47%) in terminating established status. Fosphenytoin requires continuous cardiac telemetry (max 150 mg PE/min); Valproate is contraindicated in POLG/liver disease and pregnancy.',
    'PRIS Thresholds: Propofol infusions exceeding 4-5 mg/kg/h or lasting longer than 48 hours carry high mortality from Propofol Infusion Syndrome (mitochondrial electron transport chain decoupling). Monitor CPK, lactate, triglycerides, and ABG every 12-24h.',
    'Salzburg NCSE Consensus: In non-convulsive status with discharges <=2.5 Hz, demonstrating spatiotemporal evolution or prompt electrographic/clinical recovery after a small IV ASM challenge confirms the diagnosis.'
  ];

  const phaseLabels: Record<StatusPhase, string> = {
    PRE_STATUS_IMMINENT: 'Imminent Status (< 5 min)',
    PHASE_1_EARLY_SE: 'Phase 1: Early Status (5 - 10 min)',
    PHASE_2_ESTABLISHED_SE: 'Phase 2: Established Status (10 - 30 min)',
    PHASE_3_REFRACTORY_SE: 'Phase 3: Refractory Status (> 30 min)',
    SUPER_REFRACTORY_SE: 'Super-Refractory Status (> 24 hours)',
  };

  return {
    statusPhase: phase,
    phaseLabel: phaseLabels[phase],
    timeToT2DamageThresholdMinutes: timeRemainingToT2,
    isPastT2Threshold: isPastT2,
    firstLineBzd,
    secondLineAsm,
    phase3Anesthetic,
    receptorTrafficking,
    salzburgNcse,
    urgentActionChecklist: urgentActions,
    clinicalPearls,
  };
}

export interface StatusPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: StatusEpilepticusPatientInput;
}

export const STATUS_PRESETS: StatusPreset[] = [
  {
    id: 'EARLY_GCSE_PREHOSPITAL',
    name: 'Early Generalized Convulsive SE (Prehospital RAMPART Scenario)',
    badge: 'Phase 1 • 7 min • No IV Access',
    description: '34 yo female with known epilepsy in continuous bilateral tonic-clonic seizing for 7 minutes in prehospital setting. No IV access yet. Weight 65 kg.',
    inputs: {
      patientAgeYears: 34,
      patientWeightKg: 65,
      seizureDurationMinutes: 7,
      seizureType: 'CONVULSIVE_GCSE',
      hasIvAccess: false,
      priorEpilepsyHistory: true,
      knownMitochondrialDisorderOrLiverDisease: false,
      hasSinusBradycardiaOrHeartBlock: false,
      isPregnant: false,
      numberOfBenzodiazepineDosesGiven: 0,
      secondLineInfusionComplete: false,
      isMechanicallyVentilated: false,
      continuousEegActive: false,
      eegDischargeFrequencyHz: 3.2,
      eegHasSpatiotemporalEvolution: true,
      eegHasResponseToIvTrial: false,
    },
  },
  {
    id: 'UNDERDOSED_ESTABLISHED_SE',
    name: 'Underdosed Benzodiazepine Established SE (ESETT Scenario)',
    badge: 'Phase 2 • 18 min • Underdose Alert',
    description: '52 yo male (80 kg) with ongoing convulsive status for 18 minutes. Received only 2 mg IV lorazepam (target 4 mg). Seizures persist; requires full BZD correction and immediate second-line IV Levetiracetam.',
    inputs: {
      patientAgeYears: 52,
      patientWeightKg: 80,
      seizureDurationMinutes: 18,
      seizureType: 'CONVULSIVE_GCSE',
      hasIvAccess: true,
      priorEpilepsyHistory: false,
      knownMitochondrialDisorderOrLiverDisease: false,
      hasSinusBradycardiaOrHeartBlock: false,
      isPregnant: false,
      firstLineBenzodiazepineGiven: 'LORAZEPAM_IV',
      firstLineDoseAdministeredMg: 2.0,
      numberOfBenzodiazepineDosesGiven: 1,
      secondLineAsmAdministered: 'LEVETIRACETAM_IV',
      secondLineInfusionComplete: false,
      isMechanicallyVentilated: false,
      continuousEegActive: false,
      eegDischargeFrequencyHz: 2.8,
      eegHasSpatiotemporalEvolution: true,
      eegHasResponseToIvTrial: false,
    },
  },
  {
    id: 'REFRACTORY_SE_BURST_SUPPRESSION',
    name: 'Refractory Status Epilepticus (RSE in ICU on Propofol/Ketamine)',
    badge: 'Phase 3 RSE • 45 min • cEEG Burst 65%',
    description: '61 yo female with refractory status lasting 45 minutes despite 2 doses of lorazepam and full-dose Keppra. Intubated in neuro-ICU; receiving Propofol + Ketamine with continuous EEG burst suppression titration.',
    inputs: {
      patientAgeYears: 61,
      patientWeightKg: 70,
      seizureDurationMinutes: 45,
      seizureType: 'CONVULSIVE_GCSE',
      hasIvAccess: true,
      priorEpilepsyHistory: false,
      knownMitochondrialDisorderOrLiverDisease: false,
      hasSinusBradycardiaOrHeartBlock: false,
      isPregnant: false,
      firstLineBenzodiazepineGiven: 'LORAZEPAM_IV',
      firstLineDoseAdministeredMg: 4.0,
      numberOfBenzodiazepineDosesGiven: 2,
      secondLineAsmAdministered: 'LEVETIRACETAM_IV',
      secondLineDoseAdministeredMg: 4200,
      secondLineInfusionComplete: true,
      isMechanicallyVentilated: true,
      continuousAnesthetic: 'PROPOFOL',
      anestheticDoseMgKgH: 4.2,
      anestheticDurationHours: 14,
      continuousEegActive: true,
      eegDischargeFrequencyHz: 1.5,
      eegHasSpatiotemporalEvolution: false,
      eegHasResponseToIvTrial: false,
      observedBurstSuppressionRatioPercent: 65,
    },
  },
  {
    id: 'SALZBURG_NCSE_POST_ARREST',
    name: 'Non-Convulsive Status Epilepticus (Salzburg Criteria Post-Arrest)',
    badge: 'Salzburg Definite • 2.8 Hz • Comatose',
    description: '68 yo male comatose post-cardiac arrest with subtle facial myoclonus. Continuous EEG demonstrates continuous 2.8 Hz generalized periodic epileptiform discharges meeting Salzburg criteria for NCSE.',
    inputs: {
      patientAgeYears: 68,
      patientWeightKg: 75,
      seizureDurationMinutes: 65,
      seizureType: 'NON_CONVULSIVE_NCSE',
      hasIvAccess: true,
      priorEpilepsyHistory: false,
      knownMitochondrialDisorderOrLiverDisease: false,
      hasSinusBradycardiaOrHeartBlock: false,
      isPregnant: false,
      numberOfBenzodiazepineDosesGiven: 0,
      secondLineAsmAdministered: 'VALPROATE_SODIUM_IV',
      secondLineInfusionComplete: false,
      isMechanicallyVentilated: true,
      continuousEegActive: true,
      eegDischargeFrequencyHz: 2.8,
      eegHasSpatiotemporalEvolution: true,
      eegHasResponseToIvTrial: true,
      observedBurstSuppressionRatioPercent: 10,
    },
  },
];
