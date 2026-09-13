/**
 * OrganophosphateToxEngine.ts
 * Biophysical & Pharmacotherapeutic Engine for Organophosphate and Carbamate Poisoning,
 * Acetylcholinesterase (AChE) Aging Kinetics, Muscarinic vs Nicotinic Crisis,
 * Atropine Doubling Protocol, Pralidoxime (2-PAM) Reactivation & Intermediate Syndrome (IMS).
 *
 * References:
 * - Eddleston M, Buckley NA, Eyer P, Dawson AH. Management of acute organophosphorus pesticide
 *   poisoning. Lancet. 2008;371(9612):597-607.
 * - Roberts DM, Aaron CK. Management of acute organophosphorus pesticide poisoning.
 *   BMJ. 2007;334(7594):629-634.
 * - King AM, Aaron CK. Organophosphate and carbamate poisoning. Emerg Med Clin North Am. 2015;33(1):133-151.
 * - World Health Organization. The clinical management of acute pesticide poisoning. WHO Guidelines. 2020.
 */

export type ToxinClass = 'organophosphate_pesticide' | 'nerve_agent' | 'carbamate';

export interface PatientToxState {
  toxinName: string;
  toxinClass: ToxinClass;
  exposureHoursAgo: number;
  plasmaAcheActivityPercent: number; // 0 - 100% (normal 80-120)
  rbcAcheActivityPercent: number; // 0 - 100% (true surrogate of synapse)
  heartRateBpm: number;
  systolicBpMmHg: number;
  respiratoryRateBpm: number;
  spo2Percent: number;
  bronchorrheaSeverity: 'none' | 'mild' | 'moderate' | 'massive';
  wheezingBronchospasm: boolean;
  pupilDiameterMm: number; // 1.0 (pinpoint) - 8.0 (dilated)
  axillaeMoisture: 'dry' | 'moist' | 'drenching_sweat';
  fasciculationsSeverity: 'none' | 'mild' | 'moderate' | 'generalized';
  diaphragmStrengthPercent: number; // 0 - 100%
  seizureActivity: boolean;
  cumulativeAtropineMg: number;
  pralidoximeInfusedGrams: number;
}

export interface AcheAgingReport {
  agingHalfLifeHours: number;
  estimatedAgingPercent: number; // % of enzyme irreversibly aged
  reactivatableFractionPercent: number; // % that 2-PAM can still rescue
  oximeEfficacyRating: 'High Efficacy' | 'Moderate Efficacy' | 'Limited (Partial Aging)' | 'Ineffective (Fully Aged)';
  clinicalAgingComment: string;
}

export interface AtropinizationStatus {
  isFullyAtropinized: boolean;
  clearLungsAchieved: boolean; // bronchorrhea resolved
  heartRateAdequate: boolean; // HR >= 80
  bloodPressureAdequate: boolean; // SBP >= 80
  dryAxillaeAchieved: boolean;
  pupilAlert: string; // reminder that pupil size is NOT a titration endpoint
  recommendedNextAtropineDoseMg: number;
  recommendedContinuousInfusionMgHr: number;
  clinicalAction: string;
}

export interface PralidoximeDosingReport {
  isIndicated: boolean;
  loadingDoseGrams: number;
  maintenanceInfusionMgHr: number;
  durationHoursRecommended: number;
  rationale: string;
}

export interface IntermediateSyndromeRisk {
  imsRiskLevel: 'Low' | 'Moderate' | 'High';
  onsetWindowHours: string;
  manifestations: string[];
  monitoringMandate: string;
}

export interface OpScenario {
  id: string;
  name: string;
  toxinName: string;
  toxinClass: ToxinClass;
  patientSummary: string;
  initialState: PatientToxState;
  clinicalPearls: string[];
}

/**
 * 1. Calculate Acetylcholinesterase Aging & Oxime Reactivatable Fraction
 */
export function calculateAcheAging(toxinClass: ToxinClass, exposureHoursAgo: number): AcheAgingReport {
  let agingHalfLifeHours = 36.0; // Default agricultural OP (Malathion, Chlorpyrifos ~ 24-48h)

  if (toxinClass === 'nerve_agent') {
    agingHalfLifeHours = 4.5; // Sarin ~5h; Soman ~2min; Tabun ~14h; VX ~48h
  } else if (toxinClass === 'carbamate') {
    // Carbamates do NOT age. Spontaneous decarbamylation occurs with t1/2 ~ 1-2 hours.
    return {
      agingHalfLifeHours: 0,
      estimatedAgingPercent: 0,
      reactivatableFractionPercent: 100,
      oximeEfficacyRating: 'Ineffective (Fully Aged)', // Not needed because spontaneous decarbamylation occurs
      clinicalAgingComment: 'Carbamates do not undergo covalent aging. Spontaneous hydrolytic decarbamylation reactivates enzyme within 24-48 hours.',
    };
  }

  // Aging follows first-order kinetics: % aged = (1 - (0.5)^(t / t1/2)) * 100
  const agedFraction = 1 - Math.pow(0.5, exposureHoursAgo / Math.max(0.1, agingHalfLifeHours));
  const estimatedAgingPercent = Math.round(agedFraction * 100);
  const reactivatableFractionPercent = Math.max(0, 100 - estimatedAgingPercent);

  let oximeEfficacyRating: 'High Efficacy' | 'Moderate Efficacy' | 'Limited (Partial Aging)' | 'Ineffective (Fully Aged)' = 'High Efficacy';
  if (estimatedAgingPercent > 80) oximeEfficacyRating = 'Ineffective (Fully Aged)';
  else if (estimatedAgingPercent > 50) oximeEfficacyRating = 'Limited (Partial Aging)';
  else if (estimatedAgingPercent > 20) oximeEfficacyRating = 'Moderate Efficacy';

  const clinicalAgingComment =
    estimatedAgingPercent > 75
      ? `Severe aging (${estimatedAgingPercent}% aged). Oximes will have minimal effect because dealkylation is nearly complete. Focus on atropine and mechanical ventilatory support.`
      : `Reversible window open (${reactivatableFractionPercent}% reactivatable). Administer Pralidoxime (2-PAM) promptly to regenerate synaptic AChE at neuromuscular junctions.`;

  return {
    agingHalfLifeHours,
    estimatedAgingPercent,
    reactivatableFractionPercent,
    oximeEfficacyRating,
    clinicalAgingComment,
  };
}

/**
 * 2. Evaluate Atropinization Endpoints & Doubling Protocol
 * Endpoints for full atropinization (Eddleston Lancet 2008):
 * 1. Clear lungs to auscultation (no crackles / bronchorrhea)
 * 2. Resolution of bronchospasm (no wheeze)
 * 3. Heart rate >= 80 bpm
 * 4. Systolic blood pressure >= 80 mmHg
 * 5. Dry axillae
 * Note: Pupil size is NOT an endpoint!
 */
export function evaluateAtropinization(state: PatientToxState): AtropinizationStatus {
  const {
    heartRateBpm,
    systolicBpMmHg,
    bronchorrheaSeverity,
    wheezingBronchospasm,
    axillaeMoisture,
    cumulativeAtropineMg,
  } = state;

  const clearLungsAchieved = bronchorrheaSeverity === 'none' && !wheezingBronchospasm;
  const heartRateAdequate = heartRateBpm >= 80;
  const bloodPressureAdequate = systolicBpMmHg >= 80;
  const dryAxillaeAchieved = axillaeMoisture === 'dry';

  const isFullyAtropinized =
    clearLungsAchieved && heartRateAdequate && bloodPressureAdequate && dryAxillaeAchieved;

  const pupilAlert =
    'CRITICAL CLINICAL PEARL: Pupil dilation (mydriasis) is NOT an endpoint for atropinization. Pinpoint miosis can persist due to topical exposure or autonomic exhaustion. Dosing atropine to dilate pupils risks fatal anticholinergic hyperthermia!';

  // Doubling Protocol Recommendation:
  // Initial 2 mg -> 4 mg -> 8 mg -> 16 mg -> 32 mg until full atropinization
  let recommendedNextAtropineDoseMg = 2;
  if (!isFullyAtropinized) {
    if (cumulativeAtropineMg === 0) recommendedNextAtropineDoseMg = 2;
    else if (cumulativeAtropineMg <= 2) recommendedNextAtropineDoseMg = 4;
    else if (cumulativeAtropineMg <= 6) recommendedNextAtropineDoseMg = 8;
    else if (cumulativeAtropineMg <= 14) recommendedNextAtropineDoseMg = 16;
    else recommendedNextAtropineDoseMg = 32;
  } else {
    recommendedNextAtropineDoseMg = 0;
  }

  // Once atropinized, continuous maintenance infusion is ~10-20% of the total loading dose per hour
  const recommendedContinuousInfusionMgHr = isFullyAtropinized
    ? Math.round(Math.max(1.0, cumulativeAtropineMg * 0.15) * 10) / 10
    : 0;

  let clinicalAction = '';
  if (isFullyAtropinized) {
    clinicalAction = `Patient is FULLY ATROPINIZED. Lung fields clear, HR ${heartRateBpm}, dry axillae. Transition to continuous maintenance infusion (~${recommendedContinuousInfusionMgHr} mg/hr) and monitor for recurrent bronchorrhea.`;
  } else {
    const missingEndpoints: string[] = [];
    if (!clearLungsAchieved) missingEndpoints.push('bronchorrhea/bronchospasm persistent');
    if (!heartRateAdequate) missingEndpoints.push('heart rate < 80 bpm');
    if (!bloodPressureAdequate) missingEndpoints.push('systolic BP < 80 mmHg');
    if (!dryAxillaeAchieved) missingEndpoints.push('axillae moist/sweating');

    clinicalAction = `Inadequate atropinization (${missingEndpoints.join(', ')}). Administer IV Atropine ${recommendedNextAtropineDoseMg} mg bolus immediately. Recheck in 3-5 minutes and double dose if uncorrected.`;
  }

  return {
    isFullyAtropinized,
    clearLungsAchieved,
    heartRateAdequate,
    bloodPressureAdequate,
    dryAxillaeAchieved,
    pupilAlert,
    recommendedNextAtropineDoseMg,
    recommendedContinuousInfusionMgHr,
    clinicalAction,
  };
}

/**
 * 3. Pralidoxime (2-PAM) Dosing & Indications
 */
export function calculatePralidoximeDosing(
  toxinClass: ToxinClass,
  agingReport: AcheAgingReport,
  fasciculationsSeverity: 'none' | 'mild' | 'moderate' | 'generalized',
  diaphragmStrengthPercent: number
): PralidoximeDosingReport {
  if (toxinClass === 'carbamate') {
    return {
      isIndicated: false,
      loadingDoseGrams: 0,
      maintenanceInfusionMgHr: 0,
      durationHoursRecommended: 0,
      rationale: 'Carbamate toxicity does not age and resolves spontaneously. 2-PAM is not routinely recommended unless mixed OP co-ingestion cannot be excluded.',
    };
  }

  if (agingReport.estimatedAgingPercent >= 90) {
    return {
      isIndicated: false,
      loadingDoseGrams: 0,
      maintenanceInfusionMgHr: 0,
      durationHoursRecommended: 0,
      rationale: `Enzyme is irreversibly aged (${agingReport.estimatedAgingPercent}%). Oxime cannot regenerate phosphorylated serine. Focus on airway and supportive care.`,
    };
  }

  // WHO Protocol: 2 g IV load over 20-30 min, then 8-10 mg/kg/h (~500 - 1000 mg/h)
  const isIndicated = fasciculationsSeverity !== 'none' || diaphragmStrengthPercent < 80 || agingReport.reactivatableFractionPercent > 30;

  return {
    isIndicated,
    loadingDoseGrams: 2.0,
    maintenanceInfusionMgHr: 650, // ~8-10 mg/kg/h for 70-80 kg
    durationHoursRecommended: 48,
    rationale: 'Pralidoxime (2-PAM) indicated to reactivate un-aged phosphorylated AChE at skeletal neuromuscular junctions, treating muscle fasciculations and diaphragmatic respiratory paralysis.',
  };
}

/**
 * 4. Intermediate Syndrome (IMS) Risk Assessment
 * Occurs 24-96 hours after OP exposure with weakness of neck flexors, proximal limbs, cranial nerves, and diaphragm.
 */
export function assessIntermediateSyndromeRisk(
  toxinClass: ToxinClass,
  exposureHoursAgo: number,
  rbcAcheActivityPercent: number
): IntermediateSyndromeRisk {
  if (toxinClass === 'carbamate') {
    return {
      imsRiskLevel: 'Low',
      onsetWindowHours: 'N/A',
      manifestations: ['Carbamates do not cause classical Intermediate Syndrome.'],
      monitoringMandate: 'Routine toxicological observation until clinical recovery.',
    };
  }

  let imsRiskLevel: 'Low' | 'Moderate' | 'High' = 'Low';
  if (rbcAcheActivityPercent < 20) {
    imsRiskLevel = 'High';
  } else if (rbcAcheActivityPercent < 50) {
    imsRiskLevel = 'Moderate';
  }

  return {
    imsRiskLevel,
    onsetWindowHours: '24 to 96 hours post-exposure',
    manifestations: [
      'Neck flexor weakness ("head drop" inability to lift head off pillow - cardinal harbinger)',
      'Proximal limb motor weakness (shoulders, hips)',
      'Cranial motor nerve palsies (ptosis, facial diplegia, extraocular palsies)',
      'Sudden diaphragmatic weakness triggering acute hypercapnic respiratory arrest',
    ],
    monitoringMandate: 'Mandatory ICU monitoring for at least 4-6 days. Serial vital capacity (FVC) and negative inspiratory force (NIF). Atropine does NOT treat IMS as it is a nicotinic NMJ lesion.',
  };
}

/**
 * 5. Clinical Scenarios Catalog
 */
export const OP_SCENARIOS: Record<string, OpScenario> = {
  severe_malathion_ingestion: {
    id: 'severe_malathion_ingestion',
    name: '1. Agricultural Organophosphate Ingestion (Severe Muscarinic Crisis)',
    toxinName: 'Malathion (Dimethyl Organophosphate)',
    toxinClass: 'organophosphate_pesticide',
    patientSummary: '42yo farm worker found unresponsive in field with empty pesticide container, vomiting, copious pulmonary secretions, and diffuse fasciculations.',
    initialState: {
      toxinName: 'Malathion',
      toxinClass: 'organophosphate_pesticide',
      exposureHoursAgo: 3,
      plasmaAcheActivityPercent: 12,
      rbcAcheActivityPercent: 15,
      heartRateBpm: 42,
      systolicBpMmHg: 74,
      respiratoryRateBpm: 32,
      spo2Percent: 81,
      bronchorrheaSeverity: 'massive',
      wheezingBronchospasm: true,
      pupilDiameterMm: 1.0,
      axillaeMoisture: 'drenching_sweat',
      fasciculationsSeverity: 'generalized',
      diaphragmStrengthPercent: 45,
      seizureActivity: false,
      cumulativeAtropineMg: 0,
      pralidoximeInfusedGrams: 0,
    },
    clinicalPearls: [
      'The "Killer B\'s" (Bronchorrhea, Bronchospasm, Bradycardia) cause lethal asphyxiation unless rapidly reversed with atropine.',
      'Initiate doubling protocol: 2 mg IV, then 4 mg, 8 mg, 16 mg every 3-5 min until chest is dry.',
      'Start Pralidoxime (2-PAM) 2 g IV load immediately as enzyme aging half-life is ~24-36h.',
    ],
  },
  sarin_nerve_agent: {
    id: 'sarin_nerve_agent',
    name: '2. Chemical Nerve Agent Attack (Sarin / Rapid Aging Hazard)',
    toxinName: 'Sarin (GB Nerve Agent)',
    toxinClass: 'nerve_agent',
    patientSummary: '28yo civilian exposed to aerosolized organophosphate nerve agent in enclosed transit station. Convulsions, pinpoint miosis, severe stridor.',
    initialState: {
      toxinName: 'Sarin',
      toxinClass: 'nerve_agent',
      exposureHoursAgo: 1.5,
      plasmaAcheActivityPercent: 4,
      rbcAcheActivityPercent: 8,
      heartRateBpm: 38,
      systolicBpMmHg: 68,
      respiratoryRateBpm: 38,
      spo2Percent: 76,
      bronchorrheaSeverity: 'massive',
      wheezingBronchospasm: true,
      pupilDiameterMm: 1.0,
      axillaeMoisture: 'drenching_sweat',
      fasciculationsSeverity: 'generalized',
      diaphragmStrengthPercent: 30,
      seizureActivity: true,
      cumulativeAtropineMg: 0,
      pralidoximeInfusedGrams: 0,
    },
    clinicalPearls: [
      'Sarin aging half-life is only ~5 hours (Soman is ~2 minutes). Immediate auto-injector 2-PAM is life-saving before aging is complete.',
      'Benzodiazepines (Midazolam 10 mg IM/IV) must be co-administered immediately for seizure termination and neuropathology prevention.',
      'Full personal protective equipment (PPE with CBRN charcoal filter) mandatory to prevent secondary caregiver exposure.',
    ],
  },
  carbamate_poisoning: {
    id: 'carbamate_poisoning',
    name: '3. Carbamate Insecticide Ingestion (Carbaryl / Reversible)',
    toxinName: 'Carbaryl (Sevin Insecticide)',
    toxinClass: 'carbamate',
    patientSummary: '56yo landscaper accidentally ingested carbamate concentrate. Profuse salivation, diarrhea, and wheezing.',
    initialState: {
      toxinName: 'Carbaryl',
      toxinClass: 'carbamate',
      exposureHoursAgo: 2,
      plasmaAcheActivityPercent: 25,
      rbcAcheActivityPercent: 35,
      heartRateBpm: 52,
      systolicBpMmHg: 95,
      respiratoryRateBpm: 26,
      spo2Percent: 91,
      bronchorrheaSeverity: 'moderate',
      wheezingBronchospasm: true,
      pupilDiameterMm: 2.0,
      axillaeMoisture: 'moist',
      fasciculationsSeverity: 'mild',
      diaphragmStrengthPercent: 75,
      seizureActivity: false,
      cumulativeAtropineMg: 0,
      pralidoximeInfusedGrams: 0,
    },
    clinicalPearls: [
      'Carbamates carbamylate AChE; bond hydrolyzes spontaneously within 24-48 hours without aging.',
      'Atropine is the definitive antidote. Pralidoxime is generally unnecessary and does not improve outcomes.',
      'Tox duration is shorter than OP, usually resolving completely in 24 to 36 hours with supportive care.',
    ],
  },
  delayed_ims_presentation: {
    id: 'delayed_ims_presentation',
    name: '4. Intermediate Syndrome (Day 3 Post-Resuscitation Respiratory Failure)',
    toxinName: 'Chlorpyrifos (Lipophilic Organophosphate)',
    toxinClass: 'organophosphate_pesticide',
    patientSummary: '50yo male successfully atropinized 48 hours ago for OP ingestion, now developing bilateral ptosis, inability to lift head off pillow, and shallow breathing.',
    initialState: {
      toxinName: 'Chlorpyrifos',
      toxinClass: 'organophosphate_pesticide',
      exposureHoursAgo: 54,
      plasmaAcheActivityPercent: 18,
      rbcAcheActivityPercent: 14,
      heartRateBpm: 88,
      systolicBpMmHg: 118,
      respiratoryRateBpm: 12,
      spo2Percent: 88,
      bronchorrheaSeverity: 'none',
      wheezingBronchospasm: false,
      pupilDiameterMm: 3.5,
      axillaeMoisture: 'dry',
      fasciculationsSeverity: 'moderate',
      diaphragmStrengthPercent: 25,
      seizureActivity: false,
      cumulativeAtropineMg: 45,
      pralidoximeInfusedGrams: 4,
    },
    clinicalPearls: [
      'Intermediate Syndrome (IMS) manifests 24-96 hours after exposure as nicotinic NMJ failure.',
      'Lungs remain clear and heart rate normal, but patient develops acute hypercapnic respiratory arrest due to diaphragm weakness.',
      'Atropine is completely ineffective for IMS! Immediate elective endotracheal intubation and mechanical ventilation are required.',
    ],
  },
};
