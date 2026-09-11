/**
 * LastLipidRescueEngine.ts
 * ASRA Local Anesthetic Systemic Toxicity (LAST), 20% Lipid Emulsion (Intralipid)
 * Resuscitation Kinetics, Cardiotoxicity & ACLS Modification Protocol Solver.
 * Location: frontend/.gemini/skills/LastLipidRescueEngine.ts
 */

export type LocalAnestheticType = 'BUPIVACAINE' | 'ROPIVACAINE' | 'LIDOCAINE' | 'MEPIVACAINE';

export type ToxicityPhase =
  | 'ASYMPTOMATIC'
  | 'PRODROMAL_EXCITATION' // Tinnitus, metallic taste, circumoral paresthesia
  | 'SEIZURE_ACTIVITY' // Tonic-clonic seizures, respiratory compromise
  | 'CARDIOVASCULAR_COLLAPSE' // QRS widening, VT/VF, refractory asystole
  | 'POST_RESCUE_RECOVERED';

export interface LastPatientState {
  agent: LocalAnestheticType;
  doseAdministeredMg: number;
  bodyWeightKg: number;
  hasEpinephrineAdditive: boolean;
  intravascularAccidentalInjection: boolean;
  elapsedMinutesPostInjection: number;
  lipidBolusGivenMl: number;
  lipidInfusionRateMlMin: number;
  lipidCumulativeDoseMl: number;
  epinephrineDoseGivenMcg: number; // ASRA: reduced epinephrine <= 1 mcg/kg
  antiarrhythmicUsed: 'NONE' | 'LIDOCAINE' | 'AMIODARONE';
  ecmoAlerted: boolean;
}

export interface LastClinicalEvaluation {
  maxRecommendedDoseMg: number;
  doseExceededPercent: number;
  estimatedFreePlasmaConcentrationUgMl: number;
  toxicThresholdUgMl: number;
  currentPhase: ToxicityPhase;
  qrsDurationMs: number;
  heartRateBpm: number;
  meanArterialPressureMmHg: number;
  cardiacOutputLMin: number;
  ecgPattern: 'NORMAL_SINUS' | 'PR_PROLONGATION' | 'WIDE_QRS' | 'VENTRICULAR_TACHYCARDIA' | 'ASYSTOLE';
  lipidSinkSequestrationPercent: number;
  asraProtocolChecklist: {
    lipidBolusRecommendedMl: number;
    lipidInfusionRecommendedMlMin: number;
    maxCumulativeLipidLimitMl: number;
    cumulativeLipidAdministeredMl: number;
    epinephrineProtocolCompliant: boolean; // Must be <= 1 mcg/kg
    contraindicatedDrugsTriggered: string[];
    criticalReminders: string[];
  };
  survivalProbabilityPercent: number;
}

export const LAST_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  state: LastPatientState;
}[] = [
  {
    id: 'bupivacaine-tap-arrest',
    name: 'Bupivacaine TAP Block Accidental IV (Cardiac Collapse)',
    badge: 'Myocardial Arrest',
    description: 'Accidental intravascular injection during ultrasound-guided TAP block. High lipophilicity Bupivacaine blocks cardiac Nav1.5 channels, causing wide QRS (180ms) and refractory collapse.',
    state: {
      agent: 'BUPIVACAINE',
      doseAdministeredMg: 150,
      bodyWeightKg: 70,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: true,
      elapsedMinutesPostInjection: 4,
      lipidBolusGivenMl: 0,
      lipidInfusionRateMlMin: 0,
      lipidCumulativeDoseMl: 0,
      epinephrineDoseGivenMcg: 0,
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: false,
    },
  },
  {
    id: 'ropivacaine-seizure-prodrome',
    name: 'Ropivacaine Interscalene Block (Early CNS Toxicity)',
    badge: 'Prodrome & Seizures',
    description: 'Brachial plexus block: patient develops metallic taste, severe agitation, and generalized seizures. Prompt seizure control and immediate lipid preparation indicated.',
    state: {
      agent: 'ROPIVACAINE',
      doseAdministeredMg: 225,
      bodyWeightKg: 75,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: false,
      elapsedMinutesPostInjection: 12,
      lipidBolusGivenMl: 0,
      lipidInfusionRateMlMin: 0,
      lipidCumulativeDoseMl: 0,
      epinephrineDoseGivenMcg: 0,
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: false,
    },
  },
  {
    id: 'lidocaine-tumescent-toxicity',
    name: 'Lidocaine Tumescent Liposuction Overdose',
    badge: 'Delayed Absorption',
    description: 'Delayed peak absorption 8 hours post-procedure with 35 mg/kg lidocaine. Patient displays confusion, lightheadedness, and progressive PR interval prolongation.',
    state: {
      agent: 'LIDOCAINE',
      doseAdministeredMg: 2400,
      bodyWeightKg: 65,
      hasEpinephrineAdditive: true,
      intravascularAccidentalInjection: false,
      elapsedMinutesPostInjection: 480, // 8 hours
      lipidBolusGivenMl: 0,
      lipidInfusionRateMlMin: 0,
      lipidCumulativeDoseMl: 0,
      epinephrineDoseGivenMcg: 0,
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: false,
    },
  },
  {
    id: 'successful-intralipid-rescue',
    name: 'Successful 20% Lipid Emulsion Rescue Protocol',
    badge: 'ASRA Protocol Adherence',
    description: 'Post-cardiac arrest from bupivacaine: 100 mL (1.5 mL/kg) 20% lipid bolus + 18 mL/min infusion resulted in rapid QRS narrowing and return of spontaneous circulation (ROSC).',
    state: {
      agent: 'BUPIVACAINE',
      doseAdministeredMg: 175,
      bodyWeightKg: 70,
      hasEpinephrineAdditive: false,
      intravascularAccidentalInjection: true,
      elapsedMinutesPostInjection: 15,
      lipidBolusGivenMl: 105,
      lipidInfusionRateMlMin: 18,
      lipidCumulativeDoseMl: 300,
      epinephrineDoseGivenMcg: 50, // Compliant titrated low-dose (< 1 mcg/kg)
      antiarrhythmicUsed: 'NONE',
      ecmoAlerted: true,
    },
  },
];

/**
 * Returns maximum recommended single-injection dose based on body weight and epinephrine additive
 */
export function getMaxRecommendedDoseMg(
  agent: LocalAnestheticType,
  weightKg: number,
  hasEpinephrine: boolean
): number {
  let mgPerKg = 2.0; // default bupivacaine plain
  if (agent === 'BUPIVACAINE') {
    mgPerKg = hasEpinephrine ? 2.5 : 2.0;
  } else if (agent === 'ROPIVACAINE') {
    mgPerKg = hasEpinephrine ? 3.5 : 3.0;
  } else if (agent === 'LIDOCAINE') {
    mgPerKg = hasEpinephrine ? 7.0 : 4.5;
  } else if (agent === 'MEPIVACAINE') {
    mgPerKg = hasEpinephrine ? 7.0 : 4.5;
  }
  return Math.round(mgPerKg * weightKg);
}

/**
 * Main simulation solver computing LAST pharmacokinetics, cardiac electrophysiology, and ASRA checklist compliance
 */
export function evaluateLastToxicity(state: LastPatientState): LastClinicalEvaluation {
  const {
    agent,
    doseAdministeredMg,
    bodyWeightKg,
    hasEpinephrineAdditive,
    intravascularAccidentalInjection,
    elapsedMinutesPostInjection,
    lipidBolusGivenMl,
    lipidInfusionRateMlMin,
    lipidCumulativeDoseMl,
    epinephrineDoseGivenMcg,
    antiarrhythmicUsed,
    ecmoAlerted,
  } = state;

  const maxRecDose = getMaxRecommendedDoseMg(agent, bodyWeightKg, hasEpinephrineAdditive);
  const doseExceeded = Math.max(0, Math.round(((doseAdministeredMg - maxRecDose) / maxRecDose) * 100));

  // Toxic threshold in plasma (ug/mL)
  // Bupivacaine: 2.0-4.0 ug/mL; Ropivacaine: 3.0-4.0 ug/mL; Lidocaine: 5.0-6.0 ug/mL
  let toxicThreshold = 3.0;
  if (agent === 'BUPIVACAINE') toxicThreshold = 2.5;
  if (agent === 'ROPIVACAINE') toxicThreshold = 3.5;
  if (agent === 'LIDOCAINE') toxicThreshold = 5.0;

  // Authentic distribution kinetics: intravascular has immediate peak with distribution t1/2 ~20-25 min
  let timeFactor = 1.0;
  if (intravascularAccidentalInjection) {
    timeFactor = Math.exp(-0.03 * elapsedMinutesPostInjection);
  } else {
    timeFactor = Math.max(0, Math.exp(-0.02 * elapsedMinutesPostInjection) - Math.exp(-0.07 * elapsedMinutesPostInjection)) * 1.8;
  }
  let peakConcentration = (doseAdministeredMg / (bodyWeightKg * 1.5)) * (intravascularAccidentalInjection ? 6.5 : 1.6);

  // Lipid Sink sequestration effect
  // 20% Lipid Emulsion binds highly lipophilic drugs (Bupivacaine partition coefficient 560 > Ropivacaine 115 > Lidocaine 43)
  let affinityCoefficient = 0.85; // Bupivacaine high binding
  if (agent === 'ROPIVACAINE') affinityCoefficient = 0.65;
  if (agent === 'LIDOCAINE') affinityCoefficient = 0.35;

  const totalLipidGiven = Math.max(lipidCumulativeDoseMl, lipidBolusGivenMl);
  // Each 100 mL of 20% lipid emulsion can sequester ~20-30% of free bupivacaine
  const lipidSinkSequestration = Math.min(85, Math.round((totalLipidGiven / 150) * 45 * affinityCoefficient));

  const freePlasmaConc = Math.max(
    0.2,
    Math.round(peakConcentration * timeFactor * (1 - lipidSinkSequestration / 100) * 10) / 10
  );

  // Toxicity Phase determination
  let currentPhase: ToxicityPhase = 'ASYMPTOMATIC';
  let qrsMs = 90;
  let hr = 75;
  let map = 85;
  let co = 5.2;
  let ecgPattern: LastClinicalEvaluation['ecgPattern'] = 'NORMAL_SINUS';

  if (lipidSinkSequestration > 50 && freePlasmaConc < toxicThreshold && elapsedMinutesPostInjection > 10) {
    currentPhase = 'POST_RESCUE_RECOVERED';
    qrsMs = 95;
    hr = 80;
    map = 78;
    co = 4.8;
    ecgPattern = 'NORMAL_SINUS';
  } else if (freePlasmaConc >= toxicThreshold * 2.0) {
    currentPhase = 'CARDIOVASCULAR_COLLAPSE';
    qrsMs = Math.min(220, Math.round(110 + (freePlasmaConc - toxicThreshold * 2) * 18));
    hr = qrsMs > 160 ? 175 : 42; // VT or profound bradycardia/asystole
    map = Math.max(15, Math.round(55 - (qrsMs - 120) * 0.45));
    co = Math.max(0.5, Math.round((map / 18) * 10) / 10);
    ecgPattern = qrsMs > 160 ? 'VENTRICULAR_TACHYCARDIA' : 'WIDE_QRS';
    if (map <= 25) ecgPattern = 'ASYSTOLE';
  } else if (freePlasmaConc >= toxicThreshold * 1.3) {
    currentPhase = 'SEIZURE_ACTIVITY';
    qrsMs = 115;
    hr = 120;
    map = 105;
    co = 5.8;
    ecgPattern = 'PR_PROLONGATION';
  } else if (freePlasmaConc >= toxicThreshold * 0.8) {
    currentPhase = 'PRODROMAL_EXCITATION';
    qrsMs = 95;
    hr = 95;
    map = 90;
    co = 5.4;
    ecgPattern = 'NORMAL_SINUS';
  }

  // ASRA Checklist calculations
  // Bolus: 1.5 mL/kg of 20% lipid emulsion
  const recBolus = Math.round(1.5 * bodyWeightKg);
  // Infusion: 0.25 mL/kg/min
  const recInfusion = Math.round(0.25 * bodyWeightKg * 10) / 10;
  // Max cumulative limit: 12 mL/kg
  const maxCumulativeLimit = Math.round(12 * bodyWeightKg);

  const contraindicatedDrugs: string[] = [];
  if (antiarrhythmicUsed === 'LIDOCAINE') {
    contraindicatedDrugs.push('CONTRAINDICATION: Lidocaine must NEVER be used to treat LAST arrhythmias (adds to sodium channel blockade)!');
  }

  // Epinephrine compliance: ASRA requires reduced epinephrine (<= 1 mcg/kg)
  const maxSafeEpinephrine = bodyWeightKg; // 1 mcg/kg
  const epiCompliant = epinephrineDoseGivenMcg <= maxSafeEpinephrine;
  if (!epiCompliant) {
    contraindicatedDrugs.push(`WARNING: High-dose Epinephrine (${epinephrineDoseGivenMcg} mcg > ${maxSafeEpinephrine} mcg [1 mcg/kg]) impairs lipid emulsion efficacy and exacerbates hyperlactatemia/arrhythmias.`);
  }

  const reminders: string[] = [
    'ASRA Protocol: STOP local anesthetic injection immediately and call for help + 20% Lipid Emulsion Kit.',
    'Seizure management: Use Benzodiazepines (e.g., Midazolam 1-2 mg IV). Avoid large doses of Propofol (cardiovascular depressant).',
    'ACLS Modification: Avoid Vasopressin, Calcium Channel Blockers, and Beta Blockers.',
    'Early notification of Cardiopulmonary Bypass / ECMO team if cardiovascular instability does not rapidly resolve.',
  ];

  // Survival probability heuristic
  let survival = 95;
  if (currentPhase === 'CARDIOVASCULAR_COLLAPSE') {
    survival = 40;
    if (totalLipidGiven >= recBolus) survival += 35;
    if (epiCompliant) survival += 10;
    if (antiarrhythmicUsed === 'LIDOCAINE') survival -= 30;
    if (ecmoAlerted) survival += 10;
  } else if (currentPhase === 'SEIZURE_ACTIVITY') {
    survival = 85;
    if (totalLipidGiven >= recBolus) survival += 10;
  }
  survival = Math.max(5, Math.min(99, survival));

  return {
    maxRecommendedDoseMg: maxRecDose,
    doseExceededPercent: doseExceeded,
    estimatedFreePlasmaConcentrationUgMl: freePlasmaConc,
    toxicThresholdUgMl: toxicThreshold,
    currentPhase,
    qrsDurationMs: qrsMs,
    heartRateBpm: hr,
    meanArterialPressureMmHg: map,
    cardiacOutputLMin: co,
    ecgPattern,
    lipidSinkSequestrationPercent: lipidSinkSequestration,
    asraProtocolChecklist: {
      lipidBolusRecommendedMl: recBolus,
      lipidInfusionRecommendedMlMin: recInfusion,
      maxCumulativeLipidLimitMl: maxCumulativeLimit,
      cumulativeLipidAdministeredMl: totalLipidGiven,
      epinephrineProtocolCompliant: epiCompliant,
      contraindicatedDrugsTriggered: contraindicatedDrugs,
      criticalReminders: reminders,
    },
    survivalProbabilityPercent: survival,
  };
}
