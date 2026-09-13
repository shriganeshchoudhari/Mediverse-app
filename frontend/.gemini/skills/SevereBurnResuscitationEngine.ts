/**
 * SevereBurnResuscitationEngine.ts
 *
 * Biophysical Simulation Engine for Major Thermal Injury & Fluid Resuscitation:
 * Parkland (4 mL/kg/%TBSA) vs Modified Brooke (2 mL/kg/%TBSA) Formulas,
 * The Fluid Creep Phenomenon & Abdominal Compartment Syndrome (ACS),
 * Hourly Urine Output Titration (0.5 mL/kg/hr target), Albumin Colloid Rescue,
 * Inhalation Injury Airway Edema, and Circumferential Escharotomy Decompression.
 *
 * Location: frontend/.gemini/skills/SevereBurnResuscitationEngine.ts
 */

export type BurnFormula =
  | 'PARKLAND_4ML'
  | 'MODIFIED_BROOKE_2ML'
  | 'PEDIATRIC_3ML'
  | 'ELECTRICAL_MYOGLOBIN_4ML';

export type BurnInhalationStatus =
  | 'NONE'
  | 'SUSPECTED_SMOKE_INHALATION'
  | 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT';

export type CircumferentialBurnSite =
  | 'NONE'
  | 'CIRCUMFERENTIAL_TORSO'
  | 'CIRCUMFERENTIAL_EXTREMITIES';

export type ColloidRescueStrategy =
  | 'NONE_CRYSTALLOID_ONLY'
  | 'EARLY_ALBUMIN_8_12H'
  | 'LATE_ALBUMIN_POST_24H';

export interface BurnPatientParams {
  weightKg: number;
  tbsaPercentage: number;
  hoursSinceBurnInjury: number;
  selectedFormula: BurnFormula;
  inhalationInjury: BurnInhalationStatus;
  circumferentialBurn: CircumferentialBurnSite;
  hourlyUrineOutputMl: number;
  currentIvRateMlPerHour: number;
  cumulativeCrystalloidInfusedMl: number;
  colloidRescue: ColloidRescueStrategy;
  intraAbdominalPressureMmHg: number;
  escharotomyPerformed: boolean;
  coHbPercent: number;
}

export interface BurnSimulationResult {
  totalCalculated24hVolumeMl: number;
  first8hTargetRateMlPerHour: number;
  next16hTargetRateMlPerHour: number;
  fluidCreepVolumePerKg: number;
  fluidCreepHazardActive: boolean;
  abdominalCompartmentSyndromeRisk: 'NORMAL' | 'ELEVATED_BLADDER_PRESSURE' | 'FULL_ACS_LAPAROTOMY_MANDATED';
  resuscitationAdequacy: 'UNDER_RESUSCITATED_AKI' | 'OPTIMAL_TARGET_PERFUSION' | 'OVER_RESUSCITATED_FLUID_CREEP';
  inhalationAirwayThreat: boolean;
  escharotomyMandated: boolean;
  safetyScore: number;
  criticalAlerts: string[];
  physiologicMechanisms: string[];
  stepByStepProtocol: string[];
  contraindicationFlags: {
    fluidCreepCatastropheActive: boolean;
    airwayLossInhalationHazard: boolean;
    unrelievedEscharotomyCompartment: boolean;
    timingFromArrivalRatherThanBurnTrap: boolean;
  };
}

/**
 * Calculates burn resuscitation volumes and evaluates fluid creep & complications
 */
export function simulateBurnResuscitation(params: BurnPatientParams): BurnSimulationResult {
  // 1. Calculate Standard Baseline Formula Volumes (first 24 hours)
  let formulaMultiplier = 2.0; // Modified Brooke default
  if (params.selectedFormula === 'PARKLAND_4ML' || params.selectedFormula === 'ELECTRICAL_MYOGLOBIN_4ML') {
    formulaMultiplier = 4.0;
  } else if (params.selectedFormula === 'PEDIATRIC_3ML') {
    formulaMultiplier = 3.0;
  }

  // Inhalation injury adds approximately 40-50% fluid requirement
  let base24hVolume = formulaMultiplier * params.weightKg * params.tbsaPercentage;
  if (params.inhalationInjury === 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT') {
    base24hVolume *= 1.45;
  } else if (params.inhalationInjury === 'SUSPECTED_SMOKE_INHALATION') {
    base24hVolume *= 1.2;
  }

  const totalCalculated24hVolumeMl = Math.round(base24hVolume);
  const first8hTargetRateMlPerHour = Math.round((totalCalculated24hVolumeMl * 0.5) / 8.0);
  const next16hTargetRateMlPerHour = Math.round((totalCalculated24hVolumeMl * 0.5) / 16.0);

  // 2. Fluid Creep Evaluation (Cumulative Volume / Weight)
  const fluidCreepVolumePerKg = Math.round(params.cumulativeCrystalloidInfusedMl / params.weightKg);
  const fluidCreepHazardActive = fluidCreepVolumePerKg > 250;

  // 3. Abdominal Compartment Syndrome (ACS) Classification
  let abdominalCompartmentSyndromeRisk: BurnSimulationResult['abdominalCompartmentSyndromeRisk'] = 'NORMAL';
  if (params.intraAbdominalPressureMmHg >= 20 || (fluidCreepHazardActive && params.intraAbdominalPressureMmHg >= 16)) {
    abdominalCompartmentSyndromeRisk = 'FULL_ACS_LAPAROTOMY_MANDATED';
  } else if (params.intraAbdominalPressureMmHg >= 12) {
    abdominalCompartmentSyndromeRisk = 'ELEVATED_BLADDER_PRESSURE';
  }

  // 4. Urine Output Resuscitation Adequacy (Target 0.5 mL/kg/hr for thermal, 1.0-1.5 for electrical)
  const targetUrineOutputMlPerHr =
    params.selectedFormula === 'ELECTRICAL_MYOGLOBIN_4ML'
      ? params.weightKg * 1.0
      : params.weightKg * 0.5;

  let resuscitationAdequacy: BurnSimulationResult['resuscitationAdequacy'] = 'OPTIMAL_TARGET_PERFUSION';
  if (params.hourlyUrineOutputMl < targetUrineOutputMlPerHr * 0.7) {
    resuscitationAdequacy = 'UNDER_RESUSCITATED_AKI';
  } else if (params.hourlyUrineOutputMl > targetUrineOutputMlPerHr * 2.2 || fluidCreepHazardActive) {
    resuscitationAdequacy = 'OVER_RESUSCITATED_FLUID_CREEP';
  }

  // 5. Inhalation Injury Airway Threat
  const inhalationAirwayThreat =
    params.inhalationInjury === 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT' || params.coHbPercent > 15;

  // 6. Circumferential Escharotomy Need
  const escharotomyMandated =
    params.circumferentialBurn !== 'NONE' && !params.escharotomyPerformed;

  const criticalAlerts: string[] = [];
  const physiologicMechanisms: string[] = [];
  const stepByStepProtocol: string[] = [];

  // Critical Alerts
  if (fluidCreepHazardActive || abdominalCompartmentSyndromeRisk === 'FULL_ACS_LAPAROTOMY_MANDATED') {
    criticalAlerts.push(
      `FLUID CREEP & ABDOMINAL COMPARTMENT SYNDROME: Patient received ${fluidCreepVolumePerKg} mL/kg (> 250 mL/kg threshold) with bladder pressure ${params.intraAbdominalPressureMmHg} mmHg! Excessive crystalloid resuscitation has overwhelmed capillary beds, precipitating lethal visceral edema, oliguria, respiratory failure, and extremity/orbital compartment syndrome. Immediate 5% Albumin colloid rescue and gastric/bladder decompression required!`
    );
  }

  if (inhalationAirwayThreat) {
    criticalAlerts.push(
      `SEVERE INHALATION INJURY AIRWAY EMERGENCY: Smoke inhalation with chemical mucosal necrosis and COHb ${params.coHbPercent}%! Massive supraglottic airway edema develops over the first 12-24 hours as fluid resuscitation expands interstitial tissue. Preemptive endotracheal intubation is mandatory before complete airway obstruction occurs!`
    );
  }

  if (escharotomyMandated) {
    criticalAlerts.push(
      `UNRELIEVED CIRCUMFERENTIAL ESCHAR: Circumferential full-thickness burn on ${params.circumferentialBurn.replace(/_/g, ' ')}! Leathery, non-yielding burn eschar acts like a tourniquet as resuscitation fluid expands sub-eschar tissues. High risk of thoracic restrictive hypoventilation (peak airway pressure > 40 cmH2O) or irreversible limb ischemic necrosis. Emergent bedside escharotomy is required!`
    );
  }

  if (resuscitationAdequacy === 'UNDER_RESUSCITATED_AKI') {
    criticalAlerts.push(
      `UNDER-RESUSCITATION HAZARD: Hourly urine output (${params.hourlyUrineOutputMl} mL/hr) is below target (${Math.round(targetUrineOutputMlPerHr)} mL/hr). Hypovolemia causes microvascular hypoperfusion, burn depth conversion, and acute tubular necrosis. Increase IV fluid rate by 20-30%.`
    );
  }

  // Physiologic Mechanisms
  physiologicMechanisms.push(
    `Burn Shock Pathophysiology: Massive thermal injury (${params.tbsaPercentage}% TBSA) triggers systemic release of histamine, prostaglandins, and bradykinin, causing widespread endothelial pore enlargement and generalized capillary leak. Intravascular water, electrolytes, and albumin extravasate into the interstitium.`
  );

  if (params.colloidRescue === 'EARLY_ALBUMIN_8_12H') {
    physiologicMechanisms.push(
      'Colloid Rescue Mechanics: Introducing 5% Albumin at 8-12 hours post-injury coincides with partial stabilization of endothelial tight junctions. Exogenous albumin restores intravascular oncotic pressure, blunting crystalloid requirements by 40-50% and arresting the progression of fluid creep.'
    );
  }

  // Safety Score (0-100)
  let safetyScore = 100;
  if (fluidCreepHazardActive) safetyScore -= 40;
  if (abdominalCompartmentSyndromeRisk === 'FULL_ACS_LAPAROTOMY_MANDATED') safetyScore -= 30;
  if (inhalationAirwayThreat && params.inhalationInjury === 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT') safetyScore -= 20;
  if (escharotomyMandated) safetyScore -= 30;
  if (resuscitationAdequacy === 'UNDER_RESUSCITATED_AKI') safetyScore -= 20;
  safetyScore = Math.max(0, Math.min(100, safetyScore));

  // Step-by-Step Clinical Protocol
  stepByStepProtocol.push(
    `1. Formula Starting Rate: Initiate Lactated Ringer's (LR) based on ${params.selectedFormula.replace(/_/g, ' ')}. Calculated 24h total: ${totalCalculated24hVolumeMl} mL. Initial target rate: ${first8hTargetRateMlPerHour} mL/hr (first 8h from time of injury).`
  );
  stepByStepProtocol.push(
    `2. Urine Output Titration (The Golden Rule): Titrate IV infusion rate up or down by 20-30% every hour targeting strictly 0.5 mL/kg/hr (${Math.round(params.weightKg * 0.5)} mL/hr). Do NOT chase high urine outputs (> 1.0 mL/kg/hr) as this drives fluid creep!`
  );

  if (inhalationAirwayThreat) {
    stepByStepProtocol.push(
      '3. Early Airway Protection: Secure definitive endotracheal airway immediately with large-diameter tube (>= 8.0 mm to accommodate bronchoscopy). Administer 100% normobaric FiO2 for carbon monoxide clearance.'
    );
  }

  if (params.tbsaPercentage >= 30 || fluidCreepVolumePerKg > 160) {
    stepByStepProtocol.push(
      '4. Colloid Rescue Protocol: If crystalloid requirements exceed 6 mL/kg/%TBSA or at 8-12 hours post-burn, initiate 5% Albumin infusion (0.5-1.0 mL/kg/%TBSA/24h) to reduce crystalloid volume and prevent ACS.'
    );
  }

  if (params.circumferentialBurn !== 'NONE') {
    stepByStepProtocol.push(
      '5. Bedside Escharotomy: Incise full-thickness eschar along mid-axial lines down to subcutaneous fat (avoiding ulnar and peroneal nerves) to relieve unyielding tissue pressure.'
    );
  }

  return {
    totalCalculated24hVolumeMl,
    first8hTargetRateMlPerHour,
    next16hTargetRateMlPerHour,
    fluidCreepVolumePerKg,
    fluidCreepHazardActive,
    abdominalCompartmentSyndromeRisk,
    resuscitationAdequacy,
    inhalationAirwayThreat,
    escharotomyMandated,
    safetyScore,
    criticalAlerts,
    physiologicMechanisms,
    stepByStepProtocol,
    contraindicationFlags: {
      fluidCreepCatastropheActive: fluidCreepHazardActive,
      airwayLossInhalationHazard: inhalationAirwayThreat,
      unrelievedEscharotomyCompartment: escharotomyMandated,
      timingFromArrivalRatherThanBurnTrap: false,
    },
  };
}

/**
 * Standard Presets
 */
export const BURN_PRESETS: Record<string, BurnPatientParams> = {
  optimalBrookeResuscitation: {
    weightKg: 70,
    tbsaPercentage: 40,
    hoursSinceBurnInjury: 4,
    selectedFormula: 'MODIFIED_BROOKE_2ML',
    inhalationInjury: 'NONE',
    circumferentialBurn: 'NONE',
    hourlyUrineOutputMl: 38, // ~0.55 mL/kg/hr (optimal)
    currentIvRateMlPerHour: 350,
    cumulativeCrystalloidInfusedMl: 3200,
    colloidRescue: 'EARLY_ALBUMIN_8_12H',
    intraAbdominalPressureMmHg: 9,
    escharotomyPerformed: false,
    coHbPercent: 2,
  },
  fluidCreepAbdominalCompartment: {
    weightKg: 80,
    tbsaPercentage: 55,
    hoursSinceBurnInjury: 18,
    selectedFormula: 'PARKLAND_4ML',
    inhalationInjury: 'SUSPECTED_SMOKE_INHALATION',
    circumferentialBurn: 'NONE',
    hourlyUrineOutputMl: 95, // Chasing high urine output!
    currentIvRateMlPerHour: 1400,
    cumulativeCrystalloidInfusedMl: 23500, // 293 mL/kg! (Extreme fluid creep)
    colloidRescue: 'NONE_CRYSTALLOID_ONLY',
    intraAbdominalPressureMmHg: 24, // FULL ACS!
    escharotomyPerformed: false,
    coHbPercent: 5,
  },
  inhalationAirwayEmergency: {
    weightKg: 75,
    tbsaPercentage: 35,
    hoursSinceBurnInjury: 2,
    selectedFormula: 'MODIFIED_BROOKE_2ML',
    inhalationInjury: 'SEVERE_INHALATION_INJURY_AIRWAY_THREAT',
    circumferentialBurn: 'NONE',
    hourlyUrineOutputMl: 40,
    currentIvRateMlPerHour: 450,
    cumulativeCrystalloidInfusedMl: 1200,
    colloidRescue: 'NONE_CRYSTALLOID_ONLY',
    intraAbdominalPressureMmHg: 8,
    escharotomyPerformed: false,
    coHbPercent: 28, // Marked CO poisoning!
  },
  circumferentialTorsoConstriction: {
    weightKg: 70,
    tbsaPercentage: 45,
    hoursSinceBurnInjury: 5,
    selectedFormula: 'MODIFIED_BROOKE_2ML',
    inhalationInjury: 'NONE',
    circumferentialBurn: 'CIRCUMFERENTIAL_TORSO',
    hourlyUrineOutputMl: 36,
    currentIvRateMlPerHour: 400,
    cumulativeCrystalloidInfusedMl: 2800,
    colloidRescue: 'NONE_CRYSTALLOID_ONLY',
    intraAbdominalPressureMmHg: 14,
    escharotomyPerformed: false, // Unperformed escharotomy!
    coHbPercent: 3,
  },
  albuminColloidRescued: {
    weightKg: 85,
    tbsaPercentage: 60,
    hoursSinceBurnInjury: 14,
    selectedFormula: 'MODIFIED_BROOKE_2ML',
    inhalationInjury: 'SUSPECTED_SMOKE_INHALATION',
    circumferentialBurn: 'NONE',
    hourlyUrineOutputMl: 45,
    currentIvRateMlPerHour: 550,
    cumulativeCrystalloidInfusedMl: 10500, // Kept < 150 mL/kg via albumin!
    colloidRescue: 'EARLY_ALBUMIN_8_12H',
    intraAbdominalPressureMmHg: 11,
    escharotomyPerformed: false,
    coHbPercent: 4,
  },
};
