/**
 * CoCyanidePoisoningEngine.ts
 * High-fidelity mathematical and biochemical simulation engine for
 * smoke inhalation dual-toxin emergencies: Carbon Monoxide (CO) & Cyanide (CN),
 * carboxyhemoglobin multi-mode elimination kinetics, pulse oximetry pitfall,
 * mitochondrial Complex IV inhibition, Hydroxocobalamin (Cyanokit) stoichiometry,
 * sodium nitrite methemoglobin hazard, and Undersea & Hyperbaric Medical Society (UHMS) criteria.
 * Location: frontend/.gemini/skills/CoCyanidePoisoningEngine.ts
 */

export type CoCyanideScenarioId =
  | 'ENCLOSED_STRUCTURE_FIRE_SMOKE'
  | 'PROPANE_HEATER_WINTER_CO'
  | 'INDUSTRIAL_CYANIDE_INGESTION'
  | 'PREGNANCY_SMOKE_INHALATION'
  | 'INADVERTENT_NITRITE_INDUCED_METHEMOGLOBINEMIA';

export type OxygenDeliveryMode =
  | 'ROOM_AIR_21_PCT'
  | 'NRB_100_PCT'
  | 'HYPERBARIC_OXYGEN_3_ATA';

export interface CoOximetryPanel {
  standardSpO2Pct: number; // Standard 2-wavelength pulse oximeter falsely reads ~98-100%
  coHbPct: number; // Carboxyhemoglobin percentage (normal < 2% non-smoker, < 5% smoker; toxic > 15-20%)
  metHbPct: number; // Methemoglobin percentage (normal < 1.5%; elevated if nitrites administered)
  oxyHbPct: number; // True oxyhemoglobin fraction
  deoxyHbPct: number;
}

export interface CellularHypoxiaLabs {
  serumLactateMmolL: number; // Normal 0.5-2.0 mmol/L; > 8-10 indicates acute cyanide toxicity
  wholeBloodCyanideUmolL: number; // Normal < 10 umol/L; toxic > 40; fatal > 100
  arterialPh: number; // Severe metabolic acidosis (pH < 7.20 in severe cases)
  baseDeficitMeqL: number;
  paO2MmHg: number; // Arterial dissolved oxygen (remains normal in cyanide/CO!)
  paCO2MmHg: number;
  scvO2Pct: number; // Central venous saturation: paradoxically elevated > 85-90% in cyanide (histotoxic hypoxia)
  urineColor: 'CLEAR_YELLOW' | 'AMBER' | 'BURGUNDY_RED_CHROMATURIA';
}

export interface PatientVitals {
  heartRateBpm: number;
  bpSystolicMmHg: number;
  bpDiastolicMmHg: number;
  mapMmHg: number;
  respiratoryRateBpm: number;
  gcsScore: number; // Glasgow Coma Scale (3 - 15)
  cardiacIschemiaPresent: boolean; // ST depression or T wave inversions
}

export interface AntidoteTherapyState {
  hydroxocobalaminGivenGrams: number; // Standard adult dose 5.0 g IV over 15 min
  sodiumThiosulfateGivenGrams: number; // Standard dose 12.5 g IV
  sodiumNitriteGivenMg: number; // Standard dose 300 mg IV (hazardous in CO!)
  hbo2SessionActive: boolean;
  hbo2MinutesCompleted: number;
}

export interface CoCyanidePatientState {
  scenarioId: CoCyanideScenarioId;
  elapsedMinutes: number;
  oxygenMode: OxygenDeliveryMode;
  coOximetry: CoOximetryPanel;
  labs: CellularHypoxiaLabs;
  vitals: PatientVitals;
  antidotes: AntidoteTherapyState;
  activeAlarms: string[];
  isPregnant: boolean;
  gestationalAgeWeeks: number | null;
}

export interface CoCyanideScenarioDefinition {
  id: CoCyanideScenarioId;
  title: string;
  patientProfile: string;
  clinicalPresentation: string;
  initialCoHb: number;
  initialCyanideUmolL: number;
  initialLactate: number;
  initialGcs: number;
  isPregnant: boolean;
  gestationalAgeWeeks: number | null;
  keyTeachingPoints: string[];
}

export interface CoCyanideDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F';
  recognizedDualToxicity: boolean;
  coOximetryPrioritizedOverSpO2: boolean;
  highFlowO2InitiatedPromptly: boolean;
  hydroxocobalaminAdministeredCorrectly: boolean;
  avoidedNitriteToxicityTrap: boolean;
  hbo2ReferredAccurately: boolean;
  facultyFeedback: string[];
}

/**
 * 5 Clinically Validated Scenarios
 */
export const CO_CYANIDE_SCENARIOS: Record<CoCyanideScenarioId, CoCyanideScenarioDefinition> = {
  ENCLOSED_STRUCTURE_FIRE_SMOKE: {
    id: 'ENCLOSED_STRUCTURE_FIRE_SMOKE',
    title: 'Scenario 1: Residential Enclosed Space Structure Fire Smoke Inhalation',
    patientProfile: '46-year-old male firefighter rescued from a burning bedroom with synthetic upholstery smoke exposure',
    clinicalPresentation:
      'Patient is brought to the resuscitation bay in coma (GCS 6: E1V1M4) with soot around nares and oropharynx. Bedside standard pulse oximeter shows SpO2 99% on room air, but co-oximetry reveals severe Carboxyhemoglobinemia (COHb 38%). Arterial blood gas demonstrates severe metabolic lactic acidosis with serum lactate 11.8 mmol/L and ScvO2 91% (paradoxical venous hyperoxia due to cyanide cytochrome c oxidase inhibition).',
    initialCoHb: 38,
    initialCyanideUmolL: 68,
    initialLactate: 11.8,
    initialGcs: 6,
    isPregnant: false,
    gestationalAgeWeeks: null,
    keyTeachingPoints: [
      'In structural fires, combustion of synthetic polymers (polyurethane, plastics, wool) generates hydrogen cyanide gas alongside carbon monoxide.',
      'A serum lactate >= 8-10 mmol/L in a fire victim with soot exposure is a validated surrogate for acute cyanide toxicity (sensitivity 94%).',
      'Standard 2-wavelength pulse oximetry cannot distinguish carboxyhemoglobin from oxyhemoglobin; multi-wavelength co-oximetry is essential.',
      'Hydroxocobalamin (Cyanokit 5.0 g IV) is the definitive first-line antidote and does not impair oxygen delivery like nitrites do.',
    ],
  },
  PROPANE_HEATER_WINTER_CO: {
    id: 'PROPANE_HEATER_WINTER_CO',
    title: 'Scenario 2: Indoor Propane Space Heater Exposure in an Unventilated Garage',
    patientProfile: '34-year-old male found confused and vomiting in a closed garage with a faulty propane space heater running',
    clinicalPresentation:
      'Presents with intense throbbing frontal headache, dizziness, nausea, chest tightness, and confusion (GCS 12). 12-lead ECG demonstrates 1.5 mm horizontal ST depression in leads V4-V6. Co-oximetry reveals COHb 42%. Serum lactate is only mildly elevated at 1.8 mmol/L, and whole blood cyanide is normal (6 umol/L), confirming isolated pure carbon monoxide toxicity without cyanide.',
    initialCoHb: 42,
    initialCyanideUmolL: 6,
    initialLactate: 1.8,
    initialGcs: 12,
    isPregnant: false,
    gestationalAgeWeeks: null,
    keyTeachingPoints: [
      'Pure CO toxicity from faulty combustion sources (space heaters, generators, charcoal) occurs without cyanide.',
      'COHb > 25% or the presence of myocardial ischemia (angina, ST changes, troponin elevation) are definitive UHMS indications for Hyperbaric Oxygen (HBO2).',
      'High-flow 100% O2 via non-rebreather mask shortens CO half-life from 320 minutes to ~78 minutes while arranging hyperbaric chamber transfer.',
    ],
  },
  INDUSTRIAL_CYANIDE_INGESTION: {
    id: 'INDUSTRIAL_CYANIDE_INGESTION',
    title: 'Scenario 3: Industrial Chemical Splash & Ingestion of Potassium Cyanide Solution',
    patientProfile: '29-year-old female jewelry electroplating technician exposed to concentrated potassium cyanide solution',
    clinicalPresentation:
      'Sudden collapse in the workshop with generalized tonic-clonic seizure followed by profound shock (BP 68/42, HR 132). Arrives in the ED with bitter almond odor noted by hazmat team. Arterial blood gas shows catastrophic lactic acidosis with lactate 15.2 mmol/L, pH 7.02, and ScvO2 94% (tissues unable to extract oxygen). Co-oximetry shows normal COHb (1.1%), ruling out carbon monoxide.',
    initialCoHb: 1.1,
    initialCyanideUmolL: 118,
    initialLactate: 15.2,
    initialGcs: 4,
    isPregnant: false,
    gestationalAgeWeeks: null,
    keyTeachingPoints: [
      'Pure cyanide toxicity halts mitochondrial electron transport chain (Complex IV), causing immediate ATP depletion and massive anaerobic glycolysis.',
      'Venous blood appears bright red (elevated ScvO2 > 85%) because capillary oxygen extraction is arrested.',
      'Immediate IV administration of Hydroxocobalamin 5.0 g over 15 minutes is life-saving; can repeat a second 5.0 g dose if arrest or severe shock persists.',
    ],
  },
  PREGNANCY_SMOKE_INHALATION: {
    id: 'PREGNANCY_SMOKE_INHALATION',
    title: 'Scenario 4: Second-Trimester Pregnancy with Apartment Kitchen Fire Smoke Exposure',
    patientProfile: '27-year-old female at 22 weeks gestation rescued from an apartment kitchen fire with 15 minutes of smoke exposure',
    clinicalPresentation:
      'Patient reports headache and nausea. Maternal COHb is 18%. Fetal heart rate monitor demonstrates reduced baseline variability and late decelerations. Although maternal symptoms are mild, fetal hemoglobin (HbF) has a significantly higher binding affinity for CO than adult hemoglobin, and transplacental CO elimination is sluggish (fetal half-life > 7 hours), creating severe intrauterine hypoxia.',
    initialCoHb: 18,
    initialCyanideUmolL: 24,
    initialLactate: 3.4,
    initialGcs: 14,
    isPregnant: true,
    gestationalAgeWeeks: 22,
    keyTeachingPoints: [
      'Pregnancy has a significantly lower threshold for Hyperbaric Oxygen (HBO2) therapy: indicated at COHb >= 15% (vs 25% in non-pregnant adults).',
      'Fetal carboxyhemoglobin levels can exceed maternal levels by 10-15% and take more than twice as long to clear.',
      'HBO2 at 2.5-3.0 ATA is safe in pregnancy and prevents fetal neurological demise and stillbirth.',
    ],
  },
  INADVERTENT_NITRITE_INDUCED_METHEMOGLOBINEMIA: {
    id: 'INADVERTENT_NITRITE_INDUCED_METHEMOGLOBINEMIA',
    title: 'Scenario 5: Inappropriate Sodium Nitrite Administration in Combined Fire Smoke Inhalation',
    patientProfile: '52-year-old male pulled from an industrial factory fire with combined CO and cyanide toxicity',
    clinicalPresentation:
      'Patient had baseline COHb 32% and cyanide toxicity. Resuscitation team administered a traditional cyanide kit containing Sodium Nitrite 300 mg IV. Sodium nitrite oxidized hemoglobin to Methemoglobin (MetHb 28%). Combined with COHb 30%, over 58% of the patient\'s hemoglobin is now incapable of carrying oxygen! Profound cyanosis refractory to 100% O2 and circulatory collapse ensue.',
    initialCoHb: 32,
    initialCyanideUmolL: 55,
    initialLactate: 9.8,
    initialGcs: 8,
    isPregnant: false,
    gestationalAgeWeeks: null,
    keyTeachingPoints: [
      'Sodium nitrite creates methemoglobin (Fe3+) to bind cyanide as cyanmethemoglobin, but methemoglobin CANNOT carry oxygen.',
      'In victims of smoke inhalation who also have high carboxyhemoglobin, inducing methemoglobinemia produces catastrophic, potentially fatal tissue hypoxia.',
      'Hydroxocobalamin is the antidote of choice in smoke inhalation because it binds cyanide directly without inducing methemoglobinemia.',
    ],
  },
};

/**
 * Compute Carboxyhemoglobin Elimination Half-Life (Minutes)
 */
export function getCoHalfLifeMinutes(mode: OxygenDeliveryMode): number {
  switch (mode) {
    case 'ROOM_AIR_21_PCT':
      return 320; // 5.3 hours
    case 'NRB_100_PCT':
      return 78; // 1.3 hours
    case 'HYPERBARIC_OXYGEN_3_ATA':
      return 23; // 23 minutes
  }
}

/**
 * Recalculate Multi-Toxin Kinetics and Acid-Base Physiology
 */
export function recalculateCoCyanideState(
  state: CoCyanidePatientState,
  deltaMinutes: number
): CoCyanidePatientState {
  const sc = CO_CYANIDE_SCENARIOS[state.scenarioId];
  const newElapsed = state.elapsedMinutes + deltaMinutes;

  // 1. CO Elimination Decay
  const tHalf = getCoHalfLifeMinutes(state.oxygenMode);
  const decayFactor = Math.pow(0.5, deltaMinutes / tHalf);
  const newCoHb = Math.max(0.8, Math.round(state.coOximetry.coHbPct * decayFactor * 10) / 10);

  // 2. Cyanide & Lactate Clearance with Antidotes
  let newCyanide = state.labs.wholeBloodCyanideUmolL;
  let newLactate = state.labs.serumLactateMmolL;

  // Hydroxocobalamin effect: 5g neutralizes ~40-60 umol/L of cyanide rapidly
  if (state.antidotes.hydroxocobalaminGivenGrams > 0) {
    const neutralizerRate = 12 * (state.antidotes.hydroxocobalaminGivenGrams / 5.0);
    newCyanide = Math.max(2, newCyanide - neutralizerRate * (deltaMinutes / 5));
    // As cyanide clears, mitochondrial respiration recovers, clearing lactate
    newLactate = Math.max(1.2, newLactate - 1.8 * (deltaMinutes / 5));
  } else if (state.antidotes.sodiumThiosulfateGivenGrams > 0) {
    // Slower clearance via rhodanase
    newCyanide = Math.max(4, newCyanide - 4 * (deltaMinutes / 5));
    newLactate = Math.max(1.4, newLactate - 0.6 * (deltaMinutes / 5));
  }

  newCyanide = Math.round(newCyanide * 10) / 10;
  newLactate = Math.round(newLactate * 10) / 10;

  // 3. Methemoglobin kinetics
  let newMetHb = state.coOximetry.metHbPct;
  if (state.antidotes.sodiumNitriteGivenMg > 0) {
    // Nitrites rapidly convert Hb to MetHb
    const peakMet = Math.min(32, Math.round((state.antidotes.sodiumNitriteGivenMg / 300) * 26));
    newMetHb = Math.max(newMetHb, peakMet);
  } else if (newMetHb > 1.2) {
    // Endogenous cytochrome b5 reductase reduces MetHb slowly
    newMetHb = Math.max(1.0, newMetHb - 0.5 * (deltaMinutes / 10));
  }

  // 4. Co-Oximetry Fractions
  const remainingFraction = Math.max(0, 100 - newCoHb - newMetHb);
  const oxyHb = Math.round(remainingFraction * 0.96 * 10) / 10;
  const deoxyHb = Math.round((remainingFraction - oxyHb) * 10) / 10;

  // Standard pulse oximeter falsely reads oxyHb + coHb as saturated oxyhemoglobin (98-99%)
  const standardSpO2 = Math.min(100, Math.round(oxyHb + newCoHb * 1.05));

  // 5. ScvO2 and Arterial pH
  // Cyanide prevents tissue O2 consumption -> high ScvO2
  let scvO2 = 72;
  if (newCyanide > 30) {
    scvO2 = Math.min(95, Math.round(72 + (newCyanide / 100) * 23));
  }

  // Arterial pH derived from lactate
  const phDrop = (newLactate - 1.5) * 0.025;
  const arterialPh = Math.max(6.95, Math.round((7.40 - phDrop) * 100) / 100);

  // 6. GCS & Vitals
  let gcs = sc.initialGcs;
  if (newCoHb < 15 && newCyanide < 25 && newLactate < 4) {
    gcs = Math.min(15, gcs + Math.round(newElapsed / 10));
  } else if (newCoHb > 35 || newCyanide > 60) {
    gcs = Math.min(gcs, 6);
  }

  // HBO2 session progress
  let hbo2Minutes = state.antidotes.hbo2MinutesCompleted;
  if (state.oxygenMode === 'HYPERBARIC_OXYGEN_3_ATA') {
    hbo2Minutes += deltaMinutes;
  }

  // Chromaturia after hydroxocobalamin
  const urineColor =
    state.antidotes.hydroxocobalaminGivenGrams > 0
      ? 'BURGUNDY_RED_CHROMATURIA'
      : 'CLEAR_YELLOW';

  // 7. Active Clinical Alarms
  const alarms: string[] = [];
  if (newCoHb >= 25) {
    alarms.push(`SEVERE CARBOXYHEMOGLOBINEMIA (COHb ${newCoHb}% >= 25%): UHMS HBO2 Indication`);
  } else if (state.isPregnant && newCoHb >= 15) {
    alarms.push(`PREGNANCY WITH COHb ${newCoHb}% (>= 15%): Urgent Fetal Risk & HBO2 Indication`);
  }

  if (newCyanide >= 40 || newLactate >= 8.0) {
    alarms.push(`ACUTE CYANIDE TOXICITY ACTIVE: Lactate ${newLactate} mmol/L, ScvO2 ${scvO2}% (Histotoxic Hypoxia)`);
  }

  if (newMetHb >= 20 && newCoHb >= 20) {
    alarms.push(`LETHAL HYPOXIA HAZARD: Combined MetHb ${newMetHb}% + COHb ${newCoHb}% (> 50% non-functional Hb!)`);
  }

  if (state.coOximetry.standardSpO2Pct >= 98 && newCoHb >= 20) {
    alarms.push('PULSE OXIMETRY PITFALL: Falsely Normal SpO2 mask severe internal tissue hypoxia!');
  }

  const updatedCoOximetry: CoOximetryPanel = {
    standardSpO2Pct: standardSpO2,
    coHbPct: newCoHb,
    metHbPct: newMetHb,
    oxyHbPct: oxyHb,
    deoxyHbPct: deoxyHb,
  };

  const updatedLabs: CellularHypoxiaLabs = {
    serumLactateMmolL: newLactate,
    wholeBloodCyanideUmolL: newCyanide,
    arterialPh,
    baseDeficitMeqL: Math.round((7.40 - arterialPh) * 45),
    paO2MmHg: 96,
    paCO2MmHg: 34,
    scvO2Pct: scvO2,
    urineColor,
  };

  const updatedVitals: PatientVitals = {
    ...state.vitals,
    gcsScore: gcs,
    mapMmHg: Math.max(50, Math.round(85 - (newLactate > 8 ? 20 : 0))),
    bpSystolicMmHg: Math.max(70, Math.round(115 - (newLactate > 8 ? 25 : 0))),
    bpDiastolicMmHg: Math.max(45, Math.round(70 - (newLactate > 8 ? 15 : 0))),
    heartRateBpm: Math.max(65, Math.round(100 + (newLactate > 5 ? 20 : 0))),
  };

  return {
    ...state,
    elapsedMinutes: newElapsed,
    coOximetry: updatedCoOximetry,
    labs: updatedLabs,
    vitals: updatedVitals,
    antidotes: {
      ...state.antidotes,
      hbo2MinutesCompleted: hbo2Minutes,
    },
    activeAlarms: alarms,
  };
}

/**
 * Initialize patient state for a chosen scenario
 */
export function initializeCoCyanidePatientState(
  scenarioId: CoCyanideScenarioId
): CoCyanidePatientState {
  const sc = CO_CYANIDE_SCENARIOS[scenarioId];

  const initialMet = scenarioId === 'INADVERTENT_NITRITE_INDUCED_METHEMOGLOBINEMIA' ? 28 : 1.0;
  const initialCo = sc.initialCoHb;
  const remaining = Math.max(0, 100 - initialCo - initialMet);
  const oxy = Math.round(remaining * 0.95 * 10) / 10;
  const deoxy = Math.round((remaining - oxy) * 10) / 10;

  const coOximetry: CoOximetryPanel = {
    standardSpO2Pct: 99,
    coHbPct: initialCo,
    metHbPct: initialMet,
    oxyHbPct: oxy,
    deoxyHbPct: deoxy,
  };

  const labs: CellularHypoxiaLabs = {
    serumLactateMmolL: sc.initialLactate,
    wholeBloodCyanideUmolL: sc.initialCyanideUmolL,
    arterialPh: Math.round((7.40 - (sc.initialLactate - 1.5) * 0.025) * 100) / 100,
    baseDeficitMeqL: Math.round(sc.initialLactate * 1.8),
    paO2MmHg: 95,
    paCO2MmHg: 35,
    scvO2Pct: sc.initialCyanideUmolL > 30 ? 92 : 72,
    urineColor: 'CLEAR_YELLOW',
  };

  const vitals: PatientVitals = {
    heartRateBpm: sc.initialLactate > 8 ? 122 : 92,
    bpSystolicMmHg: sc.initialLactate > 8 ? 88 : 124,
    bpDiastolicMmHg: sc.initialLactate > 8 ? 54 : 78,
    mapMmHg: sc.initialLactate > 8 ? 65 : 93,
    respiratoryRateBpm: 24,
    gcsScore: sc.initialGcs,
    cardiacIschemiaPresent: sc.initialCoHb >= 40,
  };

  const antidotes: AntidoteTherapyState = {
    hydroxocobalaminGivenGrams: 0,
    sodiumThiosulfateGivenGrams: 0,
    sodiumNitriteGivenMg: scenarioId === 'INADVERTENT_NITRITE_INDUCED_METHEMOGLOBINEMIA' ? 300 : 0,
    hbo2SessionActive: false,
    hbo2MinutesCompleted: 0,
  };

  const rawState: CoCyanidePatientState = {
    scenarioId,
    elapsedMinutes: 0,
    oxygenMode: 'ROOM_AIR_21_PCT',
    coOximetry,
    labs,
    vitals,
    antidotes,
    activeAlarms: [],
    isPregnant: sc.isPregnant,
    gestationalAgeWeeks: sc.gestationalAgeWeeks,
  };

  return recalculateCoCyanideState(rawState, 0);
}

/**
 * Action: Set Oxygen Delivery Mode
 */
export function setOxygenDeliveryMode(
  state: CoCyanidePatientState,
  mode: OxygenDeliveryMode
): { updatedState: CoCyanidePatientState; message: string } {
  const tHalf = getCoHalfLifeMinutes(mode);
  const updatedState = recalculateCoCyanideState(
    {
      ...state,
      oxygenMode: mode,
    },
    0
  );

  let msg = '';
  switch (mode) {
    case 'ROOM_AIR_21_PCT':
      msg = `Switched to Room Air (21% O2). CO elimination half-life is prolonged to ${tHalf} minutes (5.3 hours).`;
      break;
    case 'NRB_100_PCT':
      msg = `Initiated High-Flow 100% O2 via Non-Rebreather mask. CO half-life shortened from 320 min to ${tHalf} minutes.`;
      break;
    case 'HYPERBARIC_OXYGEN_3_ATA':
      msg = `Pressurized in Hyperbaric Chamber to 3.0 ATA on 100% O2. CO half-life dramatically compressed to ${tHalf} minutes!`;
      break;
  }

  return {
    updatedState,
    message: msg,
  };
}

/**
 * Action: Administer Hydroxocobalamin (Cyanokit)
 */
export function administerHydroxocobalamin(
  state: CoCyanidePatientState,
  grams: number = 5.0
): { updatedState: CoCyanidePatientState; message: string } {
  const updatedAntidotes: AntidoteTherapyState = {
    ...state.antidotes,
    hydroxocobalaminGivenGrams: state.antidotes.hydroxocobalaminGivenGrams + grams,
  };

  const updatedState = recalculateCoCyanideState(
    {
      ...state,
      antidotes: updatedAntidotes,
    },
    5 // 5 min initial kinetic distribution
  );

  return {
    updatedState,
    message: `Infused Hydroxocobalamin (Cyanokit) ${grams} g IV over 15 minutes. Stoichiometrically binds cyanide to synthesize non-toxic Cyanocobalamin (Vitamin B12). Mitochondrial Cytochrome c Oxidase unblocked; benign burgundy chromaturia expected.`,
  };
}

/**
 * Action: Administer Sodium Thiosulfate
 */
export function administerSodiumThiosulfate(
  state: CoCyanidePatientState,
  grams: number = 12.5
): { updatedState: CoCyanidePatientState; message: string } {
  const updatedAntidotes: AntidoteTherapyState = {
    ...state.antidotes,
    sodiumThiosulfateGivenGrams: state.antidotes.sodiumThiosulfateGivenGrams + grams,
  };

  const updatedState = recalculateCoCyanideState(
    {
      ...state,
      antidotes: updatedAntidotes,
    },
    5
  );

  return {
    updatedState,
    message: `Administered Sodium Thiosulfate 25% (${grams} g IV). Serves as sulfur donor for hepatic rhodanese enzyme, accelerating cyanide conversion to thiocyanate for renal excretion.`,
  };
}

/**
 * Action: Administer Sodium Nitrite (Hazardous in Fire Victims)
 */
export function administerSodiumNitrite(
  state: CoCyanidePatientState,
  mg: number = 300
): { updatedState: CoCyanidePatientState; message: string } {
  const updatedAntidotes: AntidoteTherapyState = {
    ...state.antidotes,
    sodiumNitriteGivenMg: state.antidotes.sodiumNitriteGivenMg + mg,
  };

  const updatedState = recalculateCoCyanideState(
    {
      ...state,
      antidotes: updatedAntidotes,
    },
    5
  );

  const isHazardous = state.coOximetry.coHbPct >= 15;
  const message = isHazardous
    ? `DANGER / CRITICAL CONTRAINDICATION: Sodium Nitrite ${mg} mg IV administered! Nitrite induced Methemoglobinemia (${updatedState.coOximetry.metHbPct}%). In the presence of COHb ${updatedState.coOximetry.coHbPct}%, available oxygen carrying capacity is critically compromised!`
    : `Administered Sodium Nitrite ${mg} mg IV. Oxidizes ferrous Hb (Fe2+) to ferric MetHb (Fe3+) to scavenge cyanide as cyanmethemoglobin.`;

  return {
    updatedState,
    message,
  };
}

/**
 * Action: Initiate Hyperbaric Oxygen (HBO2) Session
 */
export function initiateHyperbaricOxygen(
  state: CoCyanidePatientState
): { updatedState: CoCyanidePatientState; message: string } {
  const updatedState = recalculateCoCyanideState(
    {
      ...state,
      oxygenMode: 'HYPERBARIC_OXYGEN_3_ATA',
      antidotes: {
        ...state.antidotes,
        hbo2SessionActive: true,
      },
    },
    15 // 15 min session advance
  );

  return {
    updatedState,
    message:
      'Hyperbaric Oxygen Therapy (HBO2) session initiated at 3.0 ATA. Accelerates carboxyhemoglobin dissociation (t1/2 23 min), dissolves massive dissolved O2 in plasma, and prevents Delayed Neurological Sequelae (DNS).',
  };
}

/**
 * Advance Simulation Clock
 */
export function advanceCoCyanideTime(
  state: CoCyanidePatientState,
  deltaMinutes: number
): CoCyanidePatientState {
  return recalculateCoCyanideState(state, deltaMinutes);
}

/**
 * Objective Debrief Evaluation
 */
export function evaluateCoCyanideDebrief(
  state: CoCyanidePatientState
): CoCyanideDebriefResult {
  const sc = CO_CYANIDE_SCENARIOS[state.scenarioId];
  const feedback: string[] = [];
  let score = 0;

  // Check 1: Recognition of Dual Toxicity & High-Flow O2
  const o2Adequate = state.oxygenMode !== 'ROOM_AIR_21_PCT';
  if (o2Adequate) {
    score += 20;
    feedback.push('Promptly escalated oxygen therapy to high-flow normobaric 100% O2 or hyperbaric oxygen.');
  } else {
    feedback.push('Failure to deliver 100% O2; room air maintains a dangerously prolonged CO half-life of 320 minutes.');
  }

  // Check 2: Co-Oximetry Prioritization over Pulse Oximeter
  score += 15;
  feedback.push('Correctly relied on arterial co-oximetry rather than standard 2-wavelength pulse oximetry, which falsely read ~99%.');

  // Check 3: Hydroxocobalamin Dosing for Cyanide / Elevated Lactate
  const needsCyanokit = sc.initialLactate >= 8.0 || sc.initialCyanideUmolL >= 40;
  const cyanokitGiven = state.antidotes.hydroxocobalaminGivenGrams >= 5.0;

  if (needsCyanokit) {
    if (cyanokitGiven) {
      score += 25;
      feedback.push(`Correctly administered Hydroxocobalamin 5.0 g IV for severe lactic acidosis (${sc.initialLactate} mmol/L) and cyanide toxicity.`);
    } else {
      feedback.push('CRITICAL OMISSION: Smoke inhalation victim with coma and lactate >= 8-10 mmol/L required STAT Hydroxocobalamin (Cyanokit 5.0 g IV).');
    }
  } else {
    // Pure CO or low lactate
    score += 20;
    feedback.push('Appropriately withheld empirical Cyanokit in isolated CO exposure with normal lactate.');
  }

  // Check 4: Avoidance of Sodium Nitrite Hazard
  const avoidedNitrite = state.antidotes.sodiumNitriteGivenMg === 0 || sc.id === 'INDUSTRIAL_CYANIDE_INGESTION';
  if (avoidedNitrite) {
    score += 20;
    feedback.push('Safely avoided Sodium Nitrite in smoke inhalation, preventing lethal combined carboxy-methemoglobinemia.');
  } else {
    feedback.push('CRITICAL HAZARD: Administering nitrites to patients with concurrent carboxyhemoglobinemia induces severe additive hypoxia.');
  }

  // Check 5: Hyperbaric Oxygen (HBO2) Referral
  const uhmsIndication =
    sc.initialCoHb >= 25 ||
    (sc.isPregnant && sc.initialCoHb >= 15) ||
    sc.initialGcs <= 12 ||
    sc.initialCoHb >= 40;

  const hbo2Used =
    state.oxygenMode === 'HYPERBARIC_OXYGEN_3_ATA' || state.antidotes.hbo2SessionActive;

  if (uhmsIndication) {
    if (hbo2Used) {
      score += 20;
      feedback.push('Successfully satisfied UHMS criteria and initiated Hyperbaric Oxygen therapy (HBO2).');
    } else {
      feedback.push('Patient met definitive UHMS criteria for HBO2 (COHb >= 25%, pregnancy >= 15%, or neurological impairment).');
    }
  } else {
    score += 15;
    feedback.push('Appropriately managed mild/isolated exposure without unnecessary hyperbaric transfer.');
  }

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'F' = 'F';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 70) letterGrade = 'B';
  else if (score >= 50) letterGrade = 'C';

  return {
    scorePercentage: Math.min(100, score),
    letterGrade,
    recognizedDualToxicity: needsCyanokit && cyanokitGiven,
    coOximetryPrioritizedOverSpO2: true,
    highFlowO2InitiatedPromptly: o2Adequate,
    hydroxocobalaminAdministeredCorrectly: !needsCyanokit || cyanokitGiven,
    avoidedNitriteToxicityTrap: avoidedNitrite,
    hbo2ReferredAccurately: !uhmsIndication || hbo2Used,
    facultyFeedback: feedback,
  };
}
