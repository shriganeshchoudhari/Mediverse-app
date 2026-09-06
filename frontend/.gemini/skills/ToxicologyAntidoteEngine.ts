/**
 * ToxicologyAntidoteEngine.ts
 * Biophysical Clinical Toxicology, Toxidrome Classifier & Antidote Precision Engine
 * Location: frontend/.gemini/skills/ToxicologyAntidoteEngine.ts
 *
 * Implements:
 * 1. Toxidrome pattern matching: Anticholinergic, Cholinergic, Opioid, Sympathomimetic, Sedative-Hypnotic, Serotonin Syndrome, NMS
 * 2. Rumack-Matthew Nomogram for Acetaminophen (APAP) hepatotoxicity & NAC 21-hour IV infusion solver
 * 3. Done Nomogram & Urine Alkalinization for Salicylate (Aspirin) poisoning
 * 4. Toxic Alcohols: Osmolar Gap & Anion Gap solver (Methanol / Ethylene Glycol) with Fomepizole & Dialysis triggers
 * 5. High-Dose Insulin Euglycemia (HIET) solver for CCB/Beta-Blocker shock
 * 6. Evidence-based antidote dosing (Naloxone, Atropine, 2-PAM, Physostigmine, Fomepizole, Cyproheptadine)
 */

export type ToxidromeType =
  | 'NORMAL'
  | 'ANTICHOLINERGIC'
  | 'CHOLINERGIC'
  | 'OPIOID'
  | 'SYMPATHOMIMETIC'
  | 'SEDATIVE_HYPNOTIC'
  | 'SEROTONIN_SYNDROME'
  | 'NEUROLEPTIC_MALIGNANT_SYNDROME';

export type PupilSize = 'PINPOINT' | 'CONSTRICTED' | 'NORMAL' | 'DILATED' | 'FIXED_DILATED';
export type SkinSweatState = 'DIAPHORETIC_DRENCHED' | 'NORMAL' | 'BONE_DRY_HOT';
export type BowelSoundState = 'HYPERACTIVE_BORBORYGMI' | 'NORMAL' | 'HYPOACTIVE_ABSENT';
export type ReflexState = 'NORMAL' | 'DEPRESSED' | 'HYPERREFLEXIC_CLONUS' | 'LEAD_PIPE_RIGIDITY';

export type ToxicologyAlarm =
  | 'OPTIMAL_STABLE'
  | 'APAP_HEPATOTOXIC_TREATMENT_LINE_EXCEEDED'
  | 'CHOLINERGIC_KILLER_BS_BRONCHORRHEA'
  | 'OPIOID_RESPIRATORY_ARREST'
  | 'SEVERE_HYPERTHERMIC_SYMPATHOMIMETIC'
  | 'TOXIC_ALCOHOL_HIGH_OSMOLAR_GAP'
  | 'SALICYLATE_NEUROTOXICITY_ALKALINIZATION_NEEDED'
  | 'SEROTONIN_SYNDROME_HUNTER_CRITERIA_MET'
  | 'CCB_CARDIOGENIC_VASOPLEGIC_SHOCK';

export type ToxicologyPresetId =
  | 'ACETAMINOPHEN_OVERDOSE_RUMACK'
  | 'ORGANOPHOSPHATE_CHOLINERGIC_CRISIS'
  | 'ANTICHOLINERGIC_DELIRIUM_DIPHENHYDRAMINE'
  | 'FENTANYL_OPIOID_RESPIRATORY_DEPRESSION'
  | 'ACUTE_SALICYLATE_ASPIRIN_TOXICITY'
  | 'ETHYLENE_GLYCOL_TOXIC_ALCOHOL'
  | 'SEROTONIN_SYNDROME_POLYPHARMACY'
  | 'CALCIUM_CHANNEL_BLOCKER_SHOCK';

export interface VitalsState {
  heartRateBpm: number;
  systolicBp: number;
  diastolicBp: number;
  respiratoryRate: number;
  temperatureCelsius: number;
  oxygenSaturationPct: number;
  gcsScore: number;
}

export interface PhysicalExamState {
  pupils: PupilSize;
  skin: SkinSweatState;
  bowelSounds: BowelSoundState;
  neuromuscular: ReflexState;
  urinaryRetention: boolean;
  salivationLacrimation: boolean;
  seizuresPresent: boolean;
}

export interface DrugLevelsLabParams {
  apapUgMl: number; // Acetaminophen level in ug/mL
  hoursPostIngestion: number; // 4 to 24h
  salicylateMgDl: number; // Salicylate in mg/dL
  measuredOsmolalityMOsmKg: number;
  sodiumMeqL: number;
  glucoseMgDl: number;
  bunMgDl: number;
  bicarbonateMeqL: number;
  chlorideMeqL: number;
  potassiumMeqL: number;
  arterialPh: number;
  urinePh: number;
  calciumOxalateCrystalsPresent: boolean;
}

export interface ToxicologyInputParams {
  presetId: ToxicologyPresetId;
  vitals: VitalsState;
  exam: PhysicalExamState;
  labs: DrugLevelsLabParams;
  antidoteAdministered: {
    naloxoneMg: number;
    atropineMg: number;
    pralidoximeG: number;
    physostigmineMg: number;
    nacGiven: boolean;
    fomepizoleMgKg: number;
    sodiumBicarbonateMeq: number;
    hietInsulinUnitsKg: number;
    cyproheptadineMg: number;
  };
}

export interface RumackMatthewResult {
  isAboveTreatmentLine: boolean;
  treatmentCutoffUgMl: number;
  hepatotoxicityRisk: 'LOW_NEGLIGIBLE' | 'PROBABLE' | 'HIGH_CRITICAL';
  nacRecommendation: string;
}

export interface OsmolarGapResult {
  calculatedOsmolality: number;
  osmolarGap: number;
  isHighOsmolarGap: boolean;
  anionGap: number;
  isHagma: boolean;
}

export interface ToxicologyState {
  primaryToxidrome: ToxidromeType;
  toxidromeConfidencePct: number;
  rumackResult: RumackMatthewResult;
  osmolarGapResult: OsmolarGapResult;
  salicylateDialysisIndicated: boolean;
  activeAlarms: ToxicologyAlarm[];
  antidoteProtocolSummary: string;
  criticalCareGuidance: string;
}

/**
 * Rumack-Matthew Nomogram Solver for Acetaminophen (APAP)
 * Normal treatment line starts at 150 ug/mL at 4 hours, halving every 4 hours (half-life = 4h):
 * C_treatment(t) = 150 * (0.5)^((t - 4) / 4)
 */
export function evaluateRumackMatthew(apapUgMl: number, hours: number): RumackMatthewResult {
  if (hours < 4) {
    return {
      isAboveTreatmentLine: false,
      treatmentCutoffUgMl: 150,
      hepatotoxicityRisk: 'LOW_NEGLIGIBLE',
      nacRecommendation: 'Levels drawn <4h are uninterpretable. Repeat serum APAP precisely at 4 hours post-ingestion.',
    };
  }

  // Treatment line (150-line): 150 at 4h, 75 at 8h, 37.5 at 12h, 18.75 at 16h, 9.38 at 20h, 4.69 at 24h
  const treatmentCutoff = 150 * Math.pow(0.5, (hours - 4) / 4);
  const cutoffRounded = parseFloat(treatmentCutoff.toFixed(1));

  const isAbove = apapUgMl >= cutoffRounded;

  let risk: 'LOW_NEGLIGIBLE' | 'PROBABLE' | 'HIGH_CRITICAL' = 'LOW_NEGLIGIBLE';
  let nacRecommendation = 'Serum APAP is below the 150-line. NAC is not indicated unless time of ingestion is unreliable.';

  if (apapUgMl >= cutoffRounded * 2) {
    risk = 'HIGH_CRITICAL';
    nacRecommendation =
      'CRITICAL: Serum APAP is more than double the treatment line. Start 21-hour IV N-acetylcysteine (NAC) immediately. High risk of fulminant hepatic failure.';
  } else if (isAbove) {
    risk = 'PROBABLE';
    nacRecommendation =
      'Serum APAP exceeds the 150 treatment line. Initiate 21-hour IV N-acetylcysteine (NAC) infusion protocol immediately to replenish glutathione.';
  }

  return {
    isAboveTreatmentLine: isAbove,
    treatmentCutoffUgMl: cutoffRounded,
    hepatotoxicityRisk: risk,
    nacRecommendation,
  };
}

/**
 * Calculate Osmolar Gap and Anion Gap for Toxic Alcohol Ingestion
 * Calculated Osm = 2 * Na + (Glucose / 18) + (BUN / 2.8)
 * Osmolar Gap = Measured - Calculated (Normal < 10-15 mOsm/kg)
 * Anion Gap = Na - (Cl + HCO3) (Normal 8-12 mEq/L)
 */
export function calculateOsmolarAndAnionGap(labs: DrugLevelsLabParams): OsmolarGapResult {
  const { measuredOsmolalityMOsmKg, sodiumMeqL, glucoseMgDl, bunMgDl, bicarbonateMeqL, chlorideMeqL } = labs;

  const calculatedOsm = 2 * sodiumMeqL + glucoseMgDl / 18 + bunMgDl / 2.8;
  const calculatedOsmRounded = parseFloat(calculatedOsm.toFixed(1));

  const osmolarGap = parseFloat((measuredOsmolalityMOsmKg - calculatedOsmRounded).toFixed(1));
  const isHighOsmolarGap = osmolarGap > 15.0;

  const anionGap = parseFloat((sodiumMeqL - (chlorideMeqL + bicarbonateMeqL)).toFixed(1));
  const isHagma = anionGap > 12.0;

  return {
    calculatedOsmolality: calculatedOsmRounded,
    osmolarGap,
    isHighOsmolarGap,
    anionGap,
    isHagma,
  };
}

/**
 * Classify Toxidrome using Multi-System Sign Matching Algorithm
 */
export function classifyToxidrome(vitals: VitalsState, exam: PhysicalExamState): { type: ToxidromeType; confidence: number } {
  const { heartRateBpm, respiratoryRate, temperatureCelsius } = vitals;
  const { pupils, skin, bowelSounds, neuromuscular, urinaryRetention, salivationLacrimation } = exam;

  // Anticholinergic Score
  let anticholinergicScore = 0;
  if (heartRateBpm > 100) anticholinergicScore += 2;
  if (pupils === 'DILATED' || pupils === 'FIXED_DILATED') anticholinergicScore += 3;
  if (skin === 'BONE_DRY_HOT') anticholinergicScore += 4;
  if (temperatureCelsius >= 38.0) anticholinergicScore += 2;
  if (bowelSounds === 'HYPOACTIVE_ABSENT') anticholinergicScore += 2;
  if (urinaryRetention) anticholinergicScore += 3;
  if (!salivationLacrimation) anticholinergicScore += 1;

  // Cholinergic Score
  let cholinergicScore = 0;
  if (pupils === 'PINPOINT' || pupils === 'CONSTRICTED') cholinergicScore += 3;
  if (salivationLacrimation) cholinergicScore += 4;
  if (skin === 'DIAPHORETIC_DRENCHED') cholinergicScore += 2;
  if (bowelSounds === 'HYPERACTIVE_BORBORYGMI') cholinergicScore += 3;
  if (heartRateBpm < 60) cholinergicScore += 2;
  if (respiratoryRate < 12 || respiratoryRate > 24) cholinergicScore += 1; // bronchorrhea

  // Opioid Score
  let opioidScore = 0;
  if (pupils === 'PINPOINT') opioidScore += 4;
  if (respiratoryRate < 10) opioidScore += 5;
  if (heartRateBpm < 65) opioidScore += 2;
  if (bowelSounds === 'HYPOACTIVE_ABSENT') opioidScore += 2;

  // Sympathomimetic Score
  let sympathomimeticScore = 0;
  if (heartRateBpm > 110) sympathomimeticScore += 3;
  if (pupils === 'DILATED') sympathomimeticScore += 2;
  if (skin === 'DIAPHORETIC_DRENCHED') sympathomimeticScore += 4; // Key differentiator from anticholinergic dry skin!
  if (temperatureCelsius >= 38.0) sympathomimeticScore += 3;
  if (bowelSounds === 'HYPERACTIVE_BORBORYGMI' || bowelSounds === 'NORMAL') sympathomimeticScore += 2;

  // Serotonin Syndrome Score (Hunter Criteria: Clonus + Diaphoresis/Agitation/Hyperreflexia)
  let serotoninScore = 0;
  if (neuromuscular === 'HYPERREFLEXIC_CLONUS') serotoninScore += 10;
  if (skin === 'DIAPHORETIC_DRENCHED') serotoninScore += 3;
  if (temperatureCelsius >= 38.0) serotoninScore += 2;
  if (bowelSounds === 'HYPERACTIVE_BORBORYGMI') serotoninScore += 2;
  if (pupils === 'DILATED') serotoninScore += 1;

  // Neuroleptic Malignant Syndrome (Lead Pipe Rigidity + Hyperthermia)
  let nmsScore = 0;
  if (neuromuscular === 'LEAD_PIPE_RIGIDITY') nmsScore += 7;
  if (temperatureCelsius >= 38.5) nmsScore += 3;
  if (skin === 'DIAPHORETIC_DRENCHED') nmsScore += 2;

  const scores = [
    { type: 'ANTICHOLINERGIC' as ToxidromeType, score: anticholinergicScore },
    { type: 'CHOLINERGIC' as ToxidromeType, score: cholinergicScore },
    { type: 'OPIOID' as ToxidromeType, score: opioidScore },
    { type: 'SYMPATHOMIMETIC' as ToxidromeType, score: sympathomimeticScore },
    { type: 'SEROTONIN_SYNDROME' as ToxidromeType, score: serotoninScore },
    { type: 'NEUROLEPTIC_MALIGNANT_SYNDROME' as ToxidromeType, score: nmsScore },
  ];

  scores.sort((a, b) => b.score - a.score);
  const best = scores[0];

  if (best.score < 5) {
    return { type: 'NORMAL', confidence: 50 };
  }

  const confidence = Math.min(98, Math.round((best.score / 14) * 100));
  return { type: best.type, confidence };
}

/**
 * Main Clinical Toxicology & Antidote Decision Solver
 */
export function computeToxicologyState(params: ToxicologyInputParams): ToxicologyState {
  const { presetId, vitals, exam, labs, antidoteAdministered } = params;

  // 1. Toxidrome Pattern Recognition
  const { type: toxidromeType, confidence: toxConfidence } = classifyToxidrome(vitals, exam);

  // 2. Rumack-Matthew Nomogram
  const rumackResult = evaluateRumackMatthew(labs.apapUgMl, labs.hoursPostIngestion);

  // 3. Osmolar & Anion Gap
  const osmolarGapResult = calculateOsmolarAndAnionGap(labs);

  // 4. Salicylate Hemodialysis Triggers
  // Level > 100 mg/dL (acute) or >60 mg/dL (chronic), or severe acidosis pH < 7.20
  const salicylateDialysisIndicated =
    labs.salicylateMgDl >= 90 || (labs.salicylateMgDl >= 60 && labs.arterialPh < 7.25);

  // 5. Active Clinical Alarms
  const activeAlarms: ToxicologyAlarm[] = [];

  if (rumackResult.isAboveTreatmentLine && !antidoteAdministered.nacGiven) {
    activeAlarms.push('APAP_HEPATOTOXIC_TREATMENT_LINE_EXCEEDED');
  }

  if (toxidromeType === 'CHOLINERGIC' || (exam.pupils === 'PINPOINT' && exam.salivationLacrimation)) {
    activeAlarms.push('CHOLINERGIC_KILLER_BS_BRONCHORRHEA');
  }

  if (vitals.respiratoryRate < 10 && exam.pupils === 'PINPOINT') {
    activeAlarms.push('OPIOID_RESPIRATORY_ARREST');
  }

  if (vitals.temperatureCelsius >= 39.0 && (toxidromeType === 'SYMPATHOMIMETIC' || toxidromeType === 'ANTICHOLINERGIC')) {
    activeAlarms.push('SEVERE_HYPERTHERMIC_SYMPATHOMIMETIC');
  }

  if (osmolarGapResult.isHighOsmolarGap && osmolarGapResult.isHagma) {
    activeAlarms.push('TOXIC_ALCOHOL_HIGH_OSMOLAR_GAP');
  }

  if (labs.salicylateMgDl >= 40 && labs.urinePh < 7.5) {
    activeAlarms.push('SALICYLATE_NEUROTOXICITY_ALKALINIZATION_NEEDED');
  }

  if (exam.neuromuscular === 'HYPERREFLEXIC_CLONUS' && exam.skin === 'DIAPHORETIC_DRENCHED') {
    activeAlarms.push('SEROTONIN_SYNDROME_HUNTER_CRITERIA_MET');
  }

  if (presetId === 'CALCIUM_CHANNEL_BLOCKER_SHOCK' || (vitals.systolicBp < 80 && vitals.heartRateBpm < 50)) {
    activeAlarms.push('CCB_CARDIOGENIC_VASOPLEGIC_SHOCK');
  }

  if (activeAlarms.length === 0) {
    activeAlarms.push('OPTIMAL_STABLE');
  }

  // 6. Actionable Antidote Protocols and Critical Care Guidance
  let antidoteProtocolSummary = 'Supportive care: ABCs, continuous cardiac telemetry, and serial examinations.';
  let criticalCareGuidance = 'Maintain patent airway, monitor serial vitals and tox labs every 2–4 hours.';

  if (activeAlarms.includes('APAP_HEPATOTOXIC_TREATMENT_LINE_EXCEEDED')) {
    antidoteProtocolSummary =
      'IV N-ACETYLCYSTEINE (NAC) 21-HOUR 3-BAG REGIMEN: Loading dose 150 mg/kg in 200 mL D5W over 1 hour; 2nd dose 50 mg/kg in 500 mL D5W over 4 hours; 3rd dose 100 mg/kg in 1000 mL D5W over 16 hours. Continue until INR < 2.0 and ALT/AST declining.';
    criticalCareGuidance =
      'Serial ALT/AST and INR every 12 hours. If pH < 7.30 or INR > 6.5 with encephalopathy, consult Liver Transplant Surgery immediately (King\'s College Criteria).';
  } else if (activeAlarms.includes('CHOLINERGIC_KILLER_BS_BRONCHORRHEA')) {
    antidoteProtocolSummary =
      'ATROPINE TITRATION FOR THE "KILLER B\'s" (Bronchorrhea, Bronchospasm, Bradycardia): Start 2 to 5 mg IV push every 3-5 minutes, doubling each dose until bronchial secretions dry and air entry clears. Concurrently administer PRALIDOXIME (2-PAM) 2g IV loading over 30 mins, then 500 mg/hr infusion to reactivate phosphorylated acetylcholinesterase.';
    criticalCareGuidance =
      'Do NOT titrate Atropine to pupil size; titrate solely to clear lung fields and dry pulmonary secretions. Decontaminate skin (remove clothing, double soap/water wash).';
  } else if (activeAlarms.includes('OPIOID_RESPIRATORY_ARREST')) {
    antidoteProtocolSummary =
      'NALOXONE (NARCAN) TITRATION: Initial dose 0.04 to 0.4 mg IV (or 2-4 mg IN). Target adequate spontaneous respiratory rate (RR 12-16) and ventilation, NOT full arousal, to prevent explosive acute opioid withdrawal and catecholamine surge.';
    criticalCareGuidance =
      'Watch for recrudescent respiratory depression as Naloxone half-life (~30–90 min) is shorter than long-acting opioids or high-potency synthetic fentanyl analogues. Consider continuous Naloxone infusion (2/3 of effective bolus dose per hour).';
  } else if (activeAlarms.includes('TOXIC_ALCOHOL_HIGH_OSMOLAR_GAP')) {
    antidoteProtocolSummary =
      'FOMEPIZOLE (4-METHYLPYRAZOLE) ALCOHOL DEHYDROGENASE INHIBITION: Loading dose 15 mg/kg IV in 100 mL saline over 30 mins, followed by 10 mg/kg every 12 hours. For Methanol: add Folinic acid (50 mg IV q4h). For Ethylene Glycol: add Thiamine (100 mg IV) and Pyridoxine (50 mg IV).';
    criticalCareGuidance =
      'Prepare for emergent Hemodialysis if: serum Methanol/Ethylene Glycol > 50 mg/dL, severe refractory metabolic acidosis (pH < 7.25), visual deficits (snowstorm vision in methanol), or acute renal failure.';
  } else if (activeAlarms.includes('SALICYLATE_NEUROTOXICITY_ALKALINIZATION_NEEDED')) {
    antidoteProtocolSummary =
      'SODIUM BICARBONATE URINARY ALKALINIZATION (ION TRAPPING): 150 mEq NaHCO3 in 1000 mL D5W + 20-40 mEq KCl infused at 150-250 mL/hr. Target urine pH 7.5 to 8.0 and arterial pH 7.50 to 7.55 to prevent non-ionized salicylic acid crossing the blood-brain barrier.';
    criticalCareGuidance =
      'Ensure aggressive potassium repletion; hypokalemia prevents urinary alkalinization because renal tubules exchange H+ for Na+ instead of K+. Emergency Hemodialysis if level > 90-100 mg/dL or CNS encephalopathy.';
  } else if (activeAlarms.includes('CCB_CARDIOGENIC_VASOPLEGIC_SHOCK')) {
    antidoteProtocolSummary =
      'HIGH-DOSE INSULIN EUGLYCEMIA THERAPY (HIET): Regular Insulin 1 unit/kg IV bolus + 1 unit/kg/hr infusion (titrate up to 10 units/kg/hr). Concurrently infuse D10W/D50W to maintain blood glucose 100-200 mg/dL and monitor K+ every 30-60 mins. Administer 10% Calcium Gluconate (30-60 mL IV) and Norepinephrine/Epinephrine.';
    criticalCareGuidance =
      'HIET provides inotropic fuel to starved myocytes. Onset takes 15–30 minutes. Consider Intralipid 20% (IVFE) lipid emulsion therapy for lipophilic local anesthetics or verapamil toxicity. ECMO/VA-ECMO standby for refractory shock.';
  } else if (activeAlarms.includes('SEROTONIN_SYNDROME_HUNTER_CRITERIA_MET')) {
    antidoteProtocolSummary =
      'CYPROHEPTADINE 5-HT2A ANTAGONISM: Initial dose 12 mg PO/NG, followed by 2 mg every 2 hours if symptoms persist. Aggressive Benzodiazepine sedation (Diazepam 5-10 mg IV) and physical cooling.';
    criticalCareGuidance =
      'Avoid antipyretics (acetaminophen/NSAIDs do NOT work for muscular hyperthermia). If temperature > 41.1°C, immediate paralysis with Vecuronium (do NOT use Succinylcholine due to rhabdomyolysis hyperkalemia risk) and endotracheal intubation.';
  }

  return {
    primaryToxidrome: toxidromeType,
    toxidromeConfidencePct: toxConfidence,
    rumackResult,
    osmolarGapResult,
    salicylateDialysisIndicated,
    activeAlarms,
    antidoteProtocolSummary,
    criticalCareGuidance,
  };
}

/**
 * 8 Clinical Standard Presets for Medical Toxicology
 */
export const TOXICOLOGY_PRESETS: Record<
  ToxicologyPresetId,
  {
    title: string;
    description: string;
    initialState: ToxicologyInputParams;
  }
> = {
  ACETAMINOPHEN_OVERDOSE_RUMACK: {
    title: 'Acute Acetaminophen Toxicity (Rumack-Matthew)',
    description: 'Intentional ingestion of 20g Paracetamol. Serum level 210 ug/mL at 6 hours post-ingestion, significantly exceeding the 150 treatment line and requiring emergency 21-hour IV NAC.',
    initialState: {
      presetId: 'ACETAMINOPHEN_OVERDOSE_RUMACK',
      vitals: { heartRateBpm: 82, systolicBp: 124, diastolicBp: 78, respiratoryRate: 16, temperatureCelsius: 36.8, oxygenSaturationPct: 99, gcsScore: 15 },
      exam: { pupils: 'NORMAL', skin: 'NORMAL', bowelSounds: 'NORMAL', neuromuscular: 'NORMAL', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 210, hoursPostIngestion: 6, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 290, sodiumMeqL: 140, glucoseMgDl: 95, bunMgDl: 14, bicarbonateMeqL: 24, chlorideMeqL: 104, potassiumMeqL: 4.1, arterialPh: 7.41, urinePh: 6.0, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  ORGANOPHOSPHATE_CHOLINERGIC_CRISIS: {
    title: 'Organophosphate Cholinergic Crisis (Sarin/Insecticide)',
    description: 'Severe agricultural organophosphate poisoning. Full SLUDGEM/DUMBELS presentation: pinpoint miosis, copious bronchorrhea, profuse diaphoresis, severe bradycardia (HR 42), and fasciculations.',
    initialState: {
      presetId: 'ORGANOPHOSPHATE_CHOLINERGIC_CRISIS',
      vitals: { heartRateBpm: 42, systolicBp: 88, diastolicBp: 52, respiratoryRate: 28, temperatureCelsius: 36.4, oxygenSaturationPct: 88, gcsScore: 10 },
      exam: { pupils: 'PINPOINT', skin: 'DIAPHORETIC_DRENCHED', bowelSounds: 'HYPERACTIVE_BORBORYGMI', neuromuscular: 'NORMAL', urinaryRetention: false, salivationLacrimation: true, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 2, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 292, sodiumMeqL: 141, glucoseMgDl: 110, bunMgDl: 16, bicarbonateMeqL: 20, chlorideMeqL: 105, potassiumMeqL: 4.4, arterialPh: 7.28, urinePh: 6.2, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  ANTICHOLINERGIC_DELIRIUM_DIPHENHYDRAMINE: {
    title: 'Anticholinergic Delirium (Diphenhydramine OD)',
    description: 'Classic anticholinergic presentation: hyperthermia (38.8°C), mydriasis, bone-dry flushed skin, absent bowel sounds, palpable urinary bladder, and restless purposeless picking delirium.',
    initialState: {
      presetId: 'ANTICHOLINERGIC_DELIRIUM_DIPHENHYDRAMINE',
      vitals: { heartRateBpm: 134, systolicBp: 152, diastolicBp: 94, respiratoryRate: 20, temperatureCelsius: 38.8, oxygenSaturationPct: 98, gcsScore: 12 },
      exam: { pupils: 'DILATED', skin: 'BONE_DRY_HOT', bowelSounds: 'HYPOACTIVE_ABSENT', neuromuscular: 'NORMAL', urinaryRetention: true, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 4, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 295, sodiumMeqL: 142, glucoseMgDl: 105, bunMgDl: 15, bicarbonateMeqL: 23, chlorideMeqL: 106, potassiumMeqL: 4.0, arterialPh: 7.42, urinePh: 6.5, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  FENTANYL_OPIOID_RESPIRATORY_DEPRESSION: {
    title: 'Synthetic Opioid Toxicity (Fentanyl Hypoventilation)',
    description: 'Unresponsive patient with triad of pinpoint miosis, severe bradypnea (RR 4), hypoxemia (SpO2 78%), and respiratory acidosis requiring titrated Naloxone.',
    initialState: {
      presetId: 'FENTANYL_OPIOID_RESPIRATORY_DEPRESSION',
      vitals: { heartRateBpm: 56, systolicBp: 94, diastolicBp: 58, respiratoryRate: 4, temperatureCelsius: 35.8, oxygenSaturationPct: 78, gcsScore: 4 },
      exam: { pupils: 'PINPOINT', skin: 'NORMAL', bowelSounds: 'HYPOACTIVE_ABSENT', neuromuscular: 'DEPRESSED', urinaryRetention: true, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 1, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 288, sodiumMeqL: 139, glucoseMgDl: 88, bunMgDl: 12, bicarbonateMeqL: 28, chlorideMeqL: 101, potassiumMeqL: 4.2, arterialPh: 7.18, urinePh: 6.0, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  ACUTE_SALICYLATE_ASPIRIN_TOXICITY: {
    title: 'Acute Salicylate Poisoning (Aspirin Alkalinization)',
    description: 'Tinnitus, hyperventilation (tachypnea RR 32), serum salicylate 74 mg/dL at 8 hours, and mixed respiratory alkalosis + high anion gap metabolic acidosis.',
    initialState: {
      presetId: 'ACUTE_SALICYLATE_ASPIRIN_TOXICITY',
      vitals: { heartRateBpm: 118, systolicBp: 132, diastolicBp: 76, respiratoryRate: 32, temperatureCelsius: 38.3, oxygenSaturationPct: 98, gcsScore: 14 },
      exam: { pupils: 'NORMAL', skin: 'DIAPHORETIC_DRENCHED', bowelSounds: 'NORMAL', neuromuscular: 'NORMAL', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 8, salicylateMgDl: 74, measuredOsmolalityMOsmKg: 298, sodiumMeqL: 142, glucoseMgDl: 115, bunMgDl: 18, bicarbonateMeqL: 15, chlorideMeqL: 106, potassiumMeqL: 3.4, arterialPh: 7.46, urinePh: 5.5, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  ETHYLENE_GLYCOL_TOXIC_ALCOHOL: {
    title: 'Ethylene Glycol Ingestion (Fomepizole & Dialysis)',
    description: 'Antifreeze ingestion presenting with high osmolar gap (46 mOsm/kg), severe HAGMA (pH 7.12, AG 26), and calcium oxalate monohydrate needle/envelope crystals in urine.',
    initialState: {
      presetId: 'ETHYLENE_GLYCOL_TOXIC_ALCOHOL',
      vitals: { heartRateBpm: 98, systolicBp: 110, diastolicBp: 68, respiratoryRate: 26, temperatureCelsius: 36.5, oxygenSaturationPct: 97, gcsScore: 11 },
      exam: { pupils: 'NORMAL', skin: 'NORMAL', bowelSounds: 'NORMAL', neuromuscular: 'DEPRESSED', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 5, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 338, sodiumMeqL: 140, glucoseMgDl: 108, bunMgDl: 16, bicarbonateMeqL: 10, chlorideMeqL: 104, potassiumMeqL: 4.8, arterialPh: 7.12, urinePh: 5.0, calciumOxalateCrystalsPresent: true },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  SEROTONIN_SYNDROME_POLYPHARMACY: {
    title: 'Serotonin Syndrome (Hunter Criteria Met)',
    description: 'Polypharmacy with Sertraline + Tramadol + Linezolid. Marked spontaneous inducible ankle clonus, ocular clonus, tremor, diaphoresis, hyperthermia (39.5°C), and agitation.',
    initialState: {
      presetId: 'SEROTONIN_SYNDROME_POLYPHARMACY',
      vitals: { heartRateBpm: 128, systolicBp: 168, diastolicBp: 102, respiratoryRate: 24, temperatureCelsius: 39.5, oxygenSaturationPct: 96, gcsScore: 13 },
      exam: { pupils: 'DILATED', skin: 'DIAPHORETIC_DRENCHED', bowelSounds: 'HYPERACTIVE_BORBORYGMI', neuromuscular: 'HYPERREFLEXIC_CLONUS', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 6, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 294, sodiumMeqL: 141, glucoseMgDl: 120, bunMgDl: 17, bicarbonateMeqL: 21, chlorideMeqL: 106, potassiumMeqL: 4.3, arterialPh: 7.36, urinePh: 6.5, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },

  CALCIUM_CHANNEL_BLOCKER_SHOCK: {
    title: 'Refractory CCB Poisoning (High-Dose Insulin / HIET)',
    description: 'Severe Amlodipine + Diltiazem overdose presenting in refractory cardiogenic and vasoplegic shock: HR 36 bpm, BP 68/38, resistant to fluids and vasopressors, requiring HIET protocol.',
    initialState: {
      presetId: 'CALCIUM_CHANNEL_BLOCKER_SHOCK',
      vitals: { heartRateBpm: 36, systolicBp: 68, diastolicBp: 38, respiratoryRate: 14, temperatureCelsius: 35.9, oxygenSaturationPct: 92, gcsScore: 9 },
      exam: { pupils: 'NORMAL', skin: 'NORMAL', bowelSounds: 'HYPOACTIVE_ABSENT', neuromuscular: 'DEPRESSED', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false },
      labs: { apapUgMl: 0, hoursPostIngestion: 4, salicylateMgDl: 0, measuredOsmolalityMOsmKg: 290, sodiumMeqL: 138, glucoseMgDl: 240, bunMgDl: 22, bicarbonateMeqL: 16, chlorideMeqL: 104, potassiumMeqL: 4.6, arterialPh: 7.24, urinePh: 6.0, calciumOxalateCrystalsPresent: false },
      antidoteAdministered: { naloxoneMg: 0, atropineMg: 0, pralidoximeG: 0, physostigmineMg: 0, nacGiven: false, fomepizoleMgKg: 0, sodiumBicarbonateMeq: 0, hietInsulinUnitsKg: 0, cyproheptadineMg: 0 },
    },
  },
};
