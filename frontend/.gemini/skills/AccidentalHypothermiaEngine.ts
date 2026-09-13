/**
 * AccidentalHypothermiaEngine.ts
 * Emergency Medicine, Critical Care & Perfusion Physiology Engine:
 * Accidental Hypothermia, Swiss Clinical Staging (HT I to HT IV),
 * "Not Dead Until Warm and Dead" (32-35°C Threshold),
 * Biophysics of Afterdrop (Core Temperature Drop from Peripheral Vasodilation),
 * Rewarming Shock (Cold Diuresis & Vasodilatory Collapse),
 * Osborn (J) Wave Arrhythmias & Extreme Myocardial Irritability,
 * Modified ACLS in Hypothermia (< 30°C vs 30-35°C Guidelines),
 * and Extracorporeal Life Support (ECLS / VA-ECMO) HOPE Survival Score.
 */

export type SwissHypothermiaStage =
  | 'STAGE_I_MILD'       // 32-35°C: Conscious, vigorous shivering, cold diuresis
  | 'STAGE_II_MODERATE'   // 28-32°C: Impaired consciousness, shivering ceases, Osborn waves
  | 'STAGE_III_SEVERE'    // 24-28°C: Unconscious, high VF risk, extreme irritability
  | 'STAGE_IV_CARDIAC_ARREST' // < 24°C: Apparent death, asystole/VF, ECLS candidate
  | 'STAGE_V_DEATH';      // Irreversible death (potassium > 12 mmol/L, or rewarmed > 35°C asystole)

export type CardiacRhythmHypothermia =
  | 'SINUS_BRADYCARDIA_WITH_OSBORN_J_WAVES'
  | 'SLOW_ATRIAL_FIBRILLATION'
  | 'VENTRICULAR_FIBRILLATION_FINE'
  | 'ASYSTOLE'
  | 'NORMAL_SINUS_RHYTHM';

export type RewarmingMethod =
  | 'PASSIVE_EXTERNAL_ONLY'           // Blankets, warm room (0.5-1.0 °C/h)
  | 'ACTIVE_EXTERNAL_TRUNK_BAIR'      // Forced air warming of TRUNK only (1.5-2.5 °C/h)
  | 'ACTIVE_EXTERNAL_EXTREMITIES_TRAP'// HAZARD: Heating arms/legs triggers severe AFTERDROP!
  | 'ACTIVE_INTERNAL_CORE_FLUIDS'     // Warm humidified O2 + IV fluids 42°C (2.0-3.5 °C/h)
  | 'CLOSED_CAVITY_LAVAGE'            // Thoracic / peritoneal lavage (3.0-5.0 °C/h)
  | 'EXTRACORPOREAL_ECLS_VA_ECMO';    // Gold standard in arrest: 6-10 °C/h rapid core rewarming

export interface HypothermiaPatientParams {
  coreTemperatureCelsius: number; // 18.0 to 37.0 °C (esophageal/tympanic probe)
  initialExposureCause: 'COLD_AIR_EXPOSURE' | 'WATER_IMMERSION' | 'AVALANCHE_BURIAL';
  shiveringPresent: boolean;
  mentalStatus: 'CONSCIOUS_ALERT' | 'CONFUSED_LETHARGIC' | 'UNCONSCIOUS_COMATOSE';
  cardiacRhythm: CardiacRhythmHypothermia;
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;

  // Diagnostics & HOPE criteria
  serumPotassiumMmolPerL: number; // Critical prognosticator: > 12 mmol/L (or > 8 in avalanche) = Death
  serumPh: number; // typically acidotic < 7.25
  cprDurationMinutes: number; // 0 to 180 min

  // Interventions
  rewarmingTechnique: RewarmingMethod;
  warmIvFluidsAdministeredMl: number; // Target warmed 40-42°C crystalloid boluses
  aclsEpinephrineGivenBelow30C: boolean; // PITFALL: Epinephrine below 30°C accumulates & causes toxicity!
  defibrillationAttemptsCount: number; // Max 3 shocks recommended below 30°C
}

export interface HypothermiaSimulationOutput {
  swissStage: SwissHypothermiaStage;
  swissStageLabel: string;
  osbornJWaveProminenceMm: number; // Height of Osborn J-point deflection (0 to 6 mm)
  cerebralMetabolicRateFraction: number; // 1.0 at 37°C down to ~0.25 at 20°C (neuroprotective)
  afterdropActive: boolean;
  afterdropCoreTempFallDegrees: number; // Core temp fall from peripheral vasodilation
  effectiveRewarmingRateDegreesPerHour: number;
  rewarmingShockDetected: boolean;
  warmAndDeadDictumMet: boolean; // True if rewarmed >= 32-35°C before declaring death

  // ACLS Protocol Compliance
  aclsWarning?: string;

  // Extracorporeal HOPE Score Assessment
  hopeScoreSurvivalProbabilityPercent: number;
  isPotassiumLethalThresholdMet: boolean; // K > 12 mmol/L indicates cell lysis

  clinicalAlerts: string[];
  therapeuticDirectives: string[];
}

export const DEFAULT_HYPOTHERMIA_PATIENT: HypothermiaPatientParams = {
  coreTemperatureCelsius: 26.5, // Stage III Severe Hypothermia
  initialExposureCause: 'COLD_AIR_EXPOSURE',
  shiveringPresent: false, // Shivering ceases below 30-32°C
  mentalStatus: 'UNCONSCIOUS_COMATOSE',
  cardiacRhythm: 'SINUS_BRADYCARDIA_WITH_OSBORN_J_WAVES',
  heartRateBpm: 34,
  systolicBpMmHg: 75,
  diastolicBpMmHg: 42,
  serumPotassiumMmolPerL: 4.6, // Viable for resuscitation
  serumPh: 7.18,
  cprDurationMinutes: 0,
  rewarmingTechnique: 'PASSIVE_EXTERNAL_ONLY',
  warmIvFluidsAdministeredMl: 500,
  aclsEpinephrineGivenBelow30C: false,
  defibrillationAttemptsCount: 0
};

/**
 * Simulates biophysical changes, afterdrop, rewarming kinetics, and modified ACLS protocols
 * for accidental hypothermia.
 */
export function simulateAccidentalHypothermia(params: HypothermiaPatientParams): HypothermiaSimulationOutput {
  const alerts: string[] = [];
  const directives: string[] = [];

  // 1. Swiss Clinical Staging
  let stage: SwissHypothermiaStage = 'STAGE_I_MILD';
  let stageLabel = '';

  if (params.coreTemperatureCelsius >= 32.0 && params.coreTemperatureCelsius <= 35.0) {
    stage = 'STAGE_I_MILD';
    stageLabel = 'Stage I (Mild): 32-35°C. Conscious, vigorous shivering, cold diuresis.';
  } else if (params.coreTemperatureCelsius >= 28.0 && params.coreTemperatureCelsius < 32.0) {
    stage = 'STAGE_II_MODERATE';
    stageLabel = 'Stage II (Moderate): 28-32°C. Impaired consciousness, cessation of shivering, Osborn J waves.';
  } else if (params.coreTemperatureCelsius >= 24.0 && params.coreTemperatureCelsius < 28.0) {
    stage = 'STAGE_III_SEVERE';
    stageLabel = 'Stage III (Severe): 24-28°C. Unconscious/comatose, extreme myocardial irritability, high VF risk.';
  } else {
    stage = 'STAGE_IV_CARDIAC_ARREST';
    stageLabel = 'Stage IV (Profound / Cardiac Arrest): < 24°C. Apparent death, asystole/fine VF, ECLS candidate.';
  }

  // 2. Potassium Lethality & HOPE Survival Score
  const isPotassiumLethalThresholdMet =
    params.serumPotassiumMmolPerL > 12.0 ||
    (params.initialExposureCause === 'AVALANCHE_BURIAL' && params.serumPotassiumMmolPerL > 8.0);

  if (isPotassiumLethalThresholdMet) {
    stage = 'STAGE_V_DEATH';
    stageLabel = 'Stage V (Irreversible Death): Extreme hyperkalemia indicates massive cell lysis and death.';
    alerts.push(`LETHAL POTASSIUM THRESHOLD EXCEEDED (${params.serumPotassiumMmolPerL} mmol/L): Serum potassium > 12 mmol/L (> 8 in avalanche) represents irreversible cell death and tissue necrosis. Resuscitation should be terminated.`);
  }

  // HOPE Survival Calculation
  let hopeSurvival = 65; // Baseline high survival in accidental hypothermia
  if (params.coreTemperatureCelsius < 20) hopeSurvival += 15; // Deeper hypothermia offers greater cerebral protection!
  if (params.serumPotassiumMmolPerL > 6.0) hopeSurvival -= 25;
  if (params.serumPotassiumMmolPerL > 10.0) hopeSurvival -= 40;
  if (params.cprDurationMinutes > 60) hopeSurvival -= 20;
  if (isPotassiumLethalThresholdMet) hopeSurvival = 0;
  hopeSurvival = Math.max(0, Math.min(95, hopeSurvival));

  // 3. Neuroprotective Metabolic Suppression
  // CMRO2 decreases ~6-7% per 1°C fall below 37°C
  const tempDeficit = Math.max(0, 37.0 - params.coreTemperatureCelsius);
  const cerebralMetabolicRateFraction = Math.max(0.15, Math.round((1.0 - tempDeficit * 0.065) * 100) / 100);

  // 4. Osborn (J) Wave Prominence
  let osbornJWaveMm = 0;
  if (params.coreTemperatureCelsius < 32.0) {
    osbornJWaveMm = Math.min(6.0, Math.round((32.0 - params.coreTemperatureCelsius) * 0.8 * 10) / 10);
    alerts.push(`PATHOGNOMONIC ECG FINDING: Prominent Osborn (J) wave detected (${osbornJWaveMm} mm deflection at QRS-ST junction), reflecting altered epicardial-endocardial repolarization gradient.`);
  }

  // 5. Afterdrop Biophysics
  let afterdropActive = false;
  let afterdropDegrees = 0;
  let rewarmingRate = 0.5; // °C/h baseline

  if (params.rewarmingTechnique === 'ACTIVE_EXTERNAL_EXTREMITIES_TRAP') {
    afterdropActive = true;
    afterdropDegrees = 1.6; // Core drops by up to 1.5-2.0°C!
    rewarmingRate = -0.8; // Temperature initially drops!
    alerts.push('CRITICAL BIOPHYSICAL PITFALL (AFTERDROP): Actively warming arms and legs triggers peripheral vasodilation, shunting cold, acidotic, hyperkalemic venous blood from extremities back to the core. This drops core temperature further and provokes fatal ventricular fibrillation! Rewarm the TRUNK/CORE first.');
  } else if (params.rewarmingTechnique === 'PASSIVE_EXTERNAL_ONLY') {
    rewarmingRate = 0.8;
  } else if (params.rewarmingTechnique === 'ACTIVE_EXTERNAL_TRUNK_BAIR') {
    rewarmingRate = 2.0;
  } else if (params.rewarmingTechnique === 'ACTIVE_INTERNAL_CORE_FLUIDS') {
    rewarmingRate = 3.0;
  } else if (params.rewarmingTechnique === 'CLOSED_CAVITY_LAVAGE') {
    rewarmingRate = 4.5;
  } else if (params.rewarmingTechnique === 'EXTRACORPOREAL_ECLS_VA_ECMO') {
    rewarmingRate = 8.0;
    alerts.push('ECLS / VA-ECMO CORE REWARMING: Extracorporeal circuit provides full hemodynamic circulatory support while rewarming central blood directly at 6-10°C/hour. Gold standard for stage IV cardiac arrest.');
  }

  // 6. Rewarming Shock (Vasodilatory Collapse & Cold Diuresis Hypovolemia)
  const isRewarmingActive = params.rewarmingTechnique !== 'PASSIVE_EXTERNAL_ONLY';
  const rewarmingShockDetected = isRewarmingActive && params.warmIvFluidsAdministeredMl < 1000 && params.systolicBpMmHg < 80;
  if (rewarmingShockDetected) {
    alerts.push('REWARMING SHOCK DETECTED: Peripheral vasodilation combined with severe pre-existing hypovolemia (cold diuresis) has precipitated profound circulatory collapse. Rapid volume resuscitation with warmed (40-42°C) crystalloid is urgently required.');
  }

  // 7. Modified ACLS Protocol in Hypothermia
  let aclsWarning: string | undefined = undefined;
  if (params.coreTemperatureCelsius < 30.0) {
    if (params.aclsEpinephrineGivenBelow30C) {
      aclsWarning = 'ACLS PITFALL: Epinephrine and antiarrhythmics are CONTRAINDICATED below 30°C! Hepatic metabolism is paused; repeated epinephrine doses accumulate in circulation and trigger lethal malignant tachyarrhythmias and hypertension upon rewarming.';
      alerts.push(aclsWarning);
    }
    if (params.defibrillationAttemptsCount > 3) {
      alerts.push('DEFIBRILLATION LIMIT: Below 30°C, the hypothermic myocardium is resistant to defibrillation. Limit shocks to maximum 3 attempts; defer further shocks until core temperature reaches >= 30°C.');
    }
  } else if (params.coreTemperatureCelsius >= 30.0 && params.coreTemperatureCelsius < 35.0) {
    alerts.push('MODIFIED ACLS (30-35°C): Epinephrine administration intervals should be DOUBLED (every 6 to 10 minutes instead of standard 3 to 5 minutes) to account for reduced drug clearance.');
  }

  // 8. "Not Dead Until Warm and Dead" Dictum Check
  const warmAndDeadDictumMet = params.coreTemperatureCelsius >= 32.0;
  if (!warmAndDeadDictumMet && params.cardiacRhythm === 'ASYSTOLE' && !isPotassiumLethalThresholdMet) {
    alerts.push('MANDATORY RESUSCITATION DIRECTIVE: "NO ONE IS DEAD UNTIL WARM AND DEAD!" Resuscitation and CPR MUST continue until the patient is rewarmed to at least 32-35°C. Successful neurological recovery is well-documented after prolonged hypothermic arrest.');
  }

  // Directives
  if (params.coreTemperatureCelsius < 28.0) {
    directives.push('GENTLE HANDLING: Handle patient with extreme caution; rough movements, unnecessary repositioning, or endotracheal tube bumping can trigger refractory ventricular fibrillation.');
  }
  if (params.rewarmingTechnique !== 'EXTRACORPOREAL_ECLS_VA_ECMO' && stage === 'STAGE_IV_CARDIAC_ARREST') {
    directives.push('URGENT ECLS REFERRAL: Expedite emergency transport to an ECMO / Cardiopulmonary Bypass center for extracorporeal rewarming.');
  }
  if (params.warmIvFluidsAdministeredMl < 1500) {
    directives.push('Infuse warmed (40-42°C) normal saline or Plasmalyte boluses to treat hypothermia-induced cold diuresis hypovolemia.');
  }

  return {
    swissStage: stage,
    swissStageLabel: stageLabel,
    osbornJWaveProminenceMm: osbornJWaveMm,
    cerebralMetabolicRateFraction,
    afterdropActive,
    afterdropCoreTempFallDegrees: afterdropDegrees,
    effectiveRewarmingRateDegreesPerHour: rewarmingRate,
    rewarmingShockDetected,
    warmAndDeadDictumMet,
    aclsWarning,
    hopeScoreSurvivalProbabilityPercent: hopeSurvival,
    isPotassiumLethalThresholdMet,
    clinicalAlerts: alerts,
    therapeuticDirectives: directives
  };
}
