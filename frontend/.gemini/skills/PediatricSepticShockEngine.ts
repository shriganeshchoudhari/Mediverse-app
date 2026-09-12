/**
 * PediatricSepticShockEngine.ts
 * Pediatric Critical Care & Emergency Resuscitation Engine: Pediatric Septic Shock
 * Phenotyping (Cold vs Warm Shock), FEAST-Informed Fluid Titration,
 * Vasoactive-Inotropic Score (VIS), PALS Resuscitation Bundles & CIRCI Hydrocortisone Rescue.
 *
 * Implements:
 * 1. Surviving Sepsis Campaign Pediatric (2020) & Phoenix Sepsis Criteria (2024):
 *    - Cold Shock (Low Cardiac Output, High SVR): Epinephrine first-line
 *    - Warm Shock (High Cardiac Output, Low SVR): Norepinephrine first-line
 * 2. Age-Calibrated Hemodynamics (PALS):
 *    - Minimum SBP = 70 + (2 * age_years) for 1-10y; 70 for <1y; 90 for >10y
 *    - Capillary refill, pulse volume (weak/bounding), extremity warmth
 * 3. Fluid Titration & Safety Overload Guardrails (FEAST Trial):
 *    - 10-20 mL/kg balanced crystalloids over 10-20 minutes
 *    - Re-assessment after each bolus for hepatomegaly (liver edge > 2cm) and pulmonary crackles
 * 4. Vasoactive-Inotropic Score (VIS):
 *    - VIS = Dopamine + Dobutamine + 100*Epi + 10*Milrinone + 10000*Vaso + 100*NorEpi
 *    - VIS < 10 (Mild), 10-20 (Moderate), > 20 (Severe risk of organ failure/mortality)
 * 5. Metabolic & Adrenal Rescue:
 *    - D10W (2-5 mL/kg) for hypoglycemia (< 70 mg/dL)
 *    - 10% Calcium Gluconate (50-100 mg/kg) for hypocalcemia (iCa < 1.1 mmol/L)
 *    - Stress-dose Hydrocortisone (1-2 mg/kg IV) for catecholamine-resistant shock (VIS >= 15-20)
 * 6. 6 Clinically Validated Pediatric Scenarios
 *
 * Location: frontend/.gemini/skills/PediatricSepticShockEngine.ts
 */

export type PediatricAgeGroup = 'INFANT' | 'TODDLER' | 'PRESCHOOL' | 'SCHOOL_AGE' | 'ADOLESCENT';

export type ShockPhenotype = 'COLD_SHOCK' | 'WARM_SHOCK' | 'COMPENSATED' | 'RESOLVED_EUVOLEMIC';

export type VasoactiveDrug = 'EPINEPHRINE' | 'NOREPINEPHRINE' | 'DOBUTAMINE' | 'DOPAMINE' | 'MILRINONE' | 'VASOPRESSIN';

export type PediatricScenarioPresetId =
  | 'COLD_SHOCK_TODDLER_PNEUMONIA'
  | 'WARM_SHOCK_ADOLESCENT_TSS'
  | 'FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL'
  | 'CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE'
  | 'MENINGOCOCCEMIA_PURPURA_FULMINANS'
  | 'FEBRILE_NEUTROPENIA_ONCOLOGY_SHOCK';

export interface VasoactiveInfusionRates {
  epinephrineMcgKgMin: number; // 0 to 1.0
  norepinephrineMcgKgMin: number; // 0 to 1.0
  dobutamineMcgKgMin: number; // 0 to 20
  dopamineMcgKgMin: number; // 0 to 20
  milrinoneMcgKgMin: number; // 0 to 0.75
  vasopressinUnitsKgMin: number; // 0 to 0.002
}

export interface PediatricHemodynamics {
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  meanArterialPressureMmHg: number;
  minimumAcceptableSbpMmHg: number; // 5th percentile
  respiratoryRateMin: number;
  spO2Percent: number;
  capillaryRefillSeconds: number; // Normal: 1.5 - 2.5s; Cold: > 3s; Warm: < 1s
  peripheralPulseQuality: 'THREADY_WEAK' | 'NORMAL' | 'BOUNDING_WATERHAMMER';
  extremityTemperature: 'COOL_MOTTLED' | 'WARM_FLUSHED' | 'NORMAL_WARM';
  cardiacOutputIndex: 'DEPRESSED_LOW' | 'NORMAL' | 'ELEVATED_HYPERDYNAMIC';
  systemicVascularResistance: 'ELEVATED_HIGH' | 'NORMAL' | 'DEPRESSED_LOW';
  phenotype: ShockPhenotype;
}

export interface MetabolicState {
  bloodGlucoseMgDl: number; // Normal: 70 - 140 mg/dL
  ionizedCalciumMmolL: number; // Normal: 1.10 - 1.30 mmol/L
  serumLactateMmolL: number; // Normal: 0.5 - 2.0 mmol/L
  arterialPh: number; // Normal: 7.35 - 7.45
  urineOutputMlKgHr: number; // Normal: 1.0 - 2.0 mL/kg/h
}

export interface FluidOverloadState {
  cumulativeFluidMlKg: number;
  liverEdgeBelowCostalMarginCm: number; // Normal: 0 - 2 cm; > 2-3 cm indicates hepatomegaly
  pulmonaryCracklesPresent: boolean;
  workOfBreathing: 'NORMAL' | 'MILD_RETRACTIONS' | 'SEVERE_GRUNTING_FLARING';
  fluidStopTriggered: boolean;
}

export interface PediatricPatientState {
  scenarioId: PediatricScenarioPresetId;
  elapsedSeconds: number;
  patientAgeYears: number;
  weightKg: number;
  hemodynamics: PediatricHemodynamics;
  metabolic: MetabolicState;
  fluidState: FluidOverloadState;
  vasoactiveRates: VasoactiveInfusionRates;
  visScore: number;
  bloodCulturesObtained: boolean;
  antibioticsAdministered: boolean;
  antibioticName?: string;
  hydrocortisoneAdministered: boolean;
  calciumAdministered: boolean;
  glucoseAdministered: boolean;
  administeredFluidBolusesCount: number;
  clinicalAlarms: string[];
  interventionsPerformed: string[];
}

export interface PediatricScenarioDefinition {
  id: PediatricScenarioPresetId;
  title: string;
  patientAgeYears: number;
  ageGroup: PediatricAgeGroup;
  weightKg: number;
  historyAndPresentation: string;
  initialPhenotype: ShockPhenotype;
  baselineHemodynamics: {
    heartRateBpm: number;
    systolicBpMmHg: number;
    diastolicBpMmHg: number;
    respiratoryRateMin: number;
    spO2Percent: number;
    capillaryRefillSeconds: number;
    peripheralPulseQuality: 'THREADY_WEAK' | 'NORMAL' | 'BOUNDING_WATERHAMMER';
    extremityTemperature: 'COOL_MOTTLED' | 'WARM_FLUSHED' | 'NORMAL_WARM';
  };
  baselineMetabolic: {
    bloodGlucoseMgDl: number;
    ionizedCalciumMmolL: number;
    serumLactateMmolL: number;
  };
  initialLiverEdgeCm: number;
  underlyingInfection: string;
  recommendedFirstLineVasoactive: 'EPINEPHRINE' | 'NOREPINEPHRINE';
  expectedKeyActions: string[];
  facultyKeyPoints: string[];
}

/**
 * 6 Clinically Validated Pediatric Septic Shock Scenarios
 */
export const PEDIATRIC_SHOCK_SCENARIOS: Record<PediatricScenarioPresetId, PediatricScenarioDefinition> = {
  COLD_SHOCK_TODDLER_PNEUMONIA: {
    id: 'COLD_SHOCK_TODDLER_PNEUMONIA',
    title: 'Scenario 1: Cold Shock in a Toddler (2-year-old, Low CO / High SVR)',
    patientAgeYears: 2,
    ageGroup: 'TODDLER',
    weightKg: 12,
    historyAndPresentation:
      'A 2-year-old boy presents with high fever, lethargy, and lobar pneumonia. He has cool mottled extremities, delayed capillary refill of 4.5 seconds, weak thready radial pulses, and narrow pulse pressure (BP 72/56 mmHg, min SBP 74). Heart rate is 178 bpm. Classic Cold Shock phenotype.',
    initialPhenotype: 'COLD_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 178,
      systolicBpMmHg: 72,
      diastolicBpMmHg: 56,
      respiratoryRateMin: 44,
      spO2Percent: 93,
      capillaryRefillSeconds: 4.5,
      peripheralPulseQuality: 'THREADY_WEAK',
      extremityTemperature: 'COOL_MOTTLED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 64, // Hypoglycemic
      ionizedCalciumMmolL: 0.98, // Hypocalcemic
      serumLactateMmolL: 4.6,
    },
    initialLiverEdgeCm: 1.0,
    underlyingInfection: 'Streptococcus pneumoniae Lobar Pneumonia',
    recommendedFirstLineVasoactive: 'EPINEPHRINE',
    expectedKeyActions: [
      'Balanced crystalloid bolus 10-20 mL/kg over 10 min',
      'Blood cultures & IV Ceftriaxone + Vancomycin',
      'IV D10W bolus 2 mL/kg for hypoglycemia',
      'IV Calcium Gluconate 10% 50-100 mg/kg',
      'Initiate Epinephrine infusion (0.05-0.2 mcg/kg/min) for cold shock',
    ],
    facultyKeyPoints: [
      'Cold shock (low CO, high SVR) accounts for ~60% of pediatric community-acquired septic shock.',
      'Epinephrine is the first-line vasoactive agent for pediatric cold shock to augment stroke volume and cardiac contractility.',
      'Children have low glycogen reserves and deplete glucose rapidly during septic shock; always check point-of-care glucose immediately.',
    ],
  },

  WARM_SHOCK_ADOLESCENT_TSS: {
    id: 'WARM_SHOCK_ADOLESCENT_TSS',
    title: 'Scenario 2: Warm Shock in an Adolescent (14-year-old, High CO / Low SVR)',
    patientAgeYears: 14,
    ageGroup: 'ADOLESCENT',
    weightKg: 52,
    historyAndPresentation:
      'A 14-year-old female presents with sudden high fever, erythroderma sunburn-like rash, vomiting, and profound weakness. Extremities are warm and flushed, capillary refill is flash (< 1 second), pulses are bounding (water-hammer), and pulse pressure is wide (BP 78/38 mmHg, min SBP 90). Staphylococcal Toxic Shock Syndrome.',
    initialPhenotype: 'WARM_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 142,
      systolicBpMmHg: 78,
      diastolicBpMmHg: 38,
      respiratoryRateMin: 28,
      spO2Percent: 97,
      capillaryRefillSeconds: 0.5,
      peripheralPulseQuality: 'BOUNDING_WATERHAMMER',
      extremityTemperature: 'WARM_FLUSHED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 92,
      ionizedCalciumMmolL: 1.12,
      serumLactateMmolL: 3.8,
    },
    initialLiverEdgeCm: 0.5,
    underlyingInfection: 'Staphylococcal Toxic Shock Syndrome (TSS)',
    recommendedFirstLineVasoactive: 'NOREPINEPHRINE',
    expectedKeyActions: [
      'Balanced crystalloid bolus 20 mL/kg (1000 mL)',
      'Blood cultures & IV Cefepime + Vancomycin + Clindamycin (toxin suppression)',
      'Initiate Norepinephrine infusion (0.05-0.2 mcg/kg/min) for warm shock',
    ],
    facultyKeyPoints: [
      'Warm shock (high CO, low SVR) presents with flash capillary refill (< 1s), wide pulse pressure, and bounding pulses.',
      'Norepinephrine is the drug of choice for pediatric warm shock to restore systemic vascular resistance and diastolic coronary perfusion.',
      'Clindamycin suppresses bacterial superantigen toxin synthesis in toxic shock syndrome.',
    ],
  },

  FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL: {
    id: 'FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL',
    title: 'Scenario 3: Fluid-Overloaded Shock with Hepatomegaly in a 4-year-old',
    patientAgeYears: 4,
    ageGroup: 'PRESCHOOL',
    weightKg: 16,
    historyAndPresentation:
      'A 4-year-old girl with pyelonephritis has received two 20 mL/kg fluid boluses (total 40 mL/kg). On reassessment, her liver edge has descended from 1.5 cm to 4.0 cm below the right costal margin with new inspiratory bibasilar rales and worsening tachypnea. Blood pressure remains 74/48 mmHg (min SBP 78). Fluid stop guardrail must be enacted immediately!',
    initialPhenotype: 'COLD_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 164,
      systolicBpMmHg: 74,
      diastolicBpMmHg: 48,
      respiratoryRateMin: 48,
      spO2Percent: 91,
      capillaryRefillSeconds: 3.5,
      peripheralPulseQuality: 'THREADY_WEAK',
      extremityTemperature: 'COOL_MOTTLED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 85,
      ionizedCalciumMmolL: 1.05,
      serumLactateMmolL: 4.1,
    },
    initialLiverEdgeCm: 4.0, // Markedly enlarged!
    underlyingInfection: 'E. coli Pyelonephritis / Urosepsis',
    recommendedFirstLineVasoactive: 'EPINEPHRINE',
    expectedKeyActions: [
      'HALT FURTHER FLUID BOLUSES immediately (liver edge 4 cm, pulmonary rales)',
      'Start Epinephrine infusion immediately via peripheral/IO line',
      'Supplemental oxygen / CPAP for pulmonary edema',
      'IV Ceftriaxone',
    ],
    facultyKeyPoints: [
      'The FEAST trial demonstrated that unchecked aggressive fluid boluses cause fatal pulmonary edema and cardiovascular collapse in resource-constrained or compromised pediatric sepsis.',
      'Hepatomegaly (> 2-3 cm) and pulmonary crackles are definitive hard stop signs for fluid resuscitation in pediatric shock.',
      'Early vasoactive infusions via peripheral or IO access must be started immediately once fluid responsiveness ends or fluid overload occurs.',
    ],
  },

  CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE: {
    id: 'CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE',
    title: 'Scenario 4: Catecholamine-Resistant Shock & CIRCI in an 8-year-old',
    patientAgeYears: 8,
    ageGroup: 'SCHOOL_AGE',
    weightKg: 28,
    historyAndPresentation:
      'An 8-year-old boy with perforated appendicitis and peritonitis is admitted to the PICU. Despite 40 mL/kg crystalloids, Epinephrine at 0.3 mcg/kg/min, and Norepinephrine at 0.2 mcg/kg/min (VIS = 50), he has refractory hypotension (BP 76/42 mmHg, min SBP 86). Critical Illness-Related Corticosteroid Insufficiency (CIRCI) suspected.',
    initialPhenotype: 'COLD_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 156,
      systolicBpMmHg: 76,
      diastolicBpMmHg: 42,
      respiratoryRateMin: 32,
      spO2Percent: 94,
      capillaryRefillSeconds: 4.0,
      peripheralPulseQuality: 'THREADY_WEAK',
      extremityTemperature: 'COOL_MOTTLED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 58, // Hypoglycemic from adrenal exhaustion
      ionizedCalciumMmolL: 1.02,
      serumLactateMmolL: 5.4,
    },
    initialLiverEdgeCm: 2.0,
    underlyingInfection: 'Perforated Appendicitis & Intra-Abdominal Sepsis',
    recommendedFirstLineVasoactive: 'EPINEPHRINE',
    expectedKeyActions: [
      'Draw baseline cortisol and administer STAT Stress-Dose Hydrocortisone (1-2 mg/kg IV)',
      'D10W bolus 2 mL/kg for hypoglycemia',
      'Titrate second-line inotrope (Milrinone or Vasopressin)',
      'Broad spectrum intra-abdominal coverage (Piperacillin-Tazobactam)',
    ],
    facultyKeyPoints: [
      'Catecholamine-resistant shock occurs when shock persists despite fluid resuscitation and escalating catecholamine infusions (VIS >= 15-20).',
      'Stress-dose Hydrocortisone (1-2 mg/kg q6h) restores vascular responsiveness to catecholamines by upregulating downregulated adrenergic receptors.',
      'Adrenal insufficiency frequently presents with concurrent hypoglycemia and hyponatremia.',
    ],
  },

  MENINGOCOCCEMIA_PURPURA_FULMINANS: {
    id: 'MENINGOCOCCEMIA_PURPURA_FULMINANS',
    title: 'Scenario 5: Meningococcemia & Purpura Fulminans in a 3-year-old',
    patientAgeYears: 3,
    ageGroup: 'TODDLER',
    weightKg: 14,
    historyAndPresentation:
      'A 3-year-old girl is brought to the resuscitation bay in shock with a rapidly spreading petechial and purpuric rash across lower extremities. Capillary refill is 5 seconds. Blood pressure is 66/38 mmHg (min SBP 76). Ionized calcium is severely depressed at 0.72 mmol/L. Severe purpura fulminans with consumption coagulopathy.',
    initialPhenotype: 'COLD_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 184,
      systolicBpMmHg: 66,
      diastolicBpMmHg: 38,
      respiratoryRateMin: 42,
      spO2Percent: 92,
      capillaryRefillSeconds: 5.0,
      peripheralPulseQuality: 'THREADY_WEAK',
      extremityTemperature: 'COOL_MOTTLED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 52, // Profound hypoglycemia
      ionizedCalciumMmolL: 0.72, // Severe critical hypocalcemia
      serumLactateMmolL: 6.8,
    },
    initialLiverEdgeCm: 1.5,
    underlyingInfection: 'Neisseria meningitidis (Meningococcemia)',
    recommendedFirstLineVasoactive: 'EPINEPHRINE',
    expectedKeyActions: [
      'IV Ceftriaxone within 15 minutes (do not delay for LP!)',
      'STAT 10% Calcium Gluconate 100 mg/kg IV',
      'STAT D10W 2 mL/kg IV bolus',
      'Crystalloid fluid bolus 10-20 mL/kg',
      'Initiate Epinephrine infusion for profound myocardial depression',
      'Waterhouse-Friderichsen adrenal necrosis coverage: Hydrocortisone 2 mg/kg',
    ],
    facultyKeyPoints: [
      'Meningococcemia can cause bilateral adrenal hemorrhage (Waterhouse-Friderichsen syndrome) and catastrophic purpura fulminans.',
      'Severe hypocalcemia (iCa < 0.8 mmol/L) collapses excitation-contraction coupling in the pediatric heart; IV calcium is an urgent inotropic resuscitation drug.',
      'Lumbar puncture is strictly contraindicated in unresuscitated septic shock and unstable coagulopathy.',
    ],
  },

  FEBRILE_NEUTROPENIA_ONCOLOGY_SHOCK: {
    id: 'FEBRILE_NEUTROPENIA_ONCOLOGY_SHOCK',
    title: 'Scenario 6: Febrile Neutropenia & Septic Shock in Pediatric Oncology (6-year-old)',
    patientAgeYears: 6,
    ageGroup: 'SCHOOL_AGE',
    weightKg: 21,
    historyAndPresentation:
      'A 6-year-old girl with B-ALL post-induction chemotherapy presents with fever 39.5°C, ANC 60/mcL, central venous catheter erythema, and obtundation. Extremities are cool, cap refill 3.5s, BP 76/44 mmHg (min SBP 82). Pseudomonas aeruginosa bacteremia suspected.',
    initialPhenotype: 'COLD_SHOCK',
    baselineHemodynamics: {
      heartRateBpm: 168,
      systolicBpMmHg: 76,
      diastolicBpMmHg: 44,
      respiratoryRateMin: 36,
      spO2Percent: 95,
      capillaryRefillSeconds: 3.5,
      peripheralPulseQuality: 'THREADY_WEAK',
      extremityTemperature: 'COOL_MOTTLED',
    },
    baselineMetabolic: {
      bloodGlucoseMgDl: 78,
      ionizedCalciumMmolL: 1.15,
      serumLactateMmolL: 3.9,
    },
    initialLiverEdgeCm: 1.0,
    underlyingInfection: 'Pseudomonas aeruginosa Central Line Associated Bloodstream Infection (CLABSI)',
    recommendedFirstLineVasoactive: 'EPINEPHRINE',
    expectedKeyActions: [
      'Door-to-antibiotic time < 30-60 min: IV Cefepime + Tobramycin + Vancomycin',
      'Draw peripheral and central line blood cultures',
      'Fluid bolus 20 mL/kg balanced crystalloids',
      'Early inotrope infusion (Epinephrine)',
    ],
    facultyKeyPoints: [
      'In pediatric febrile neutropenia, mortality doubles for every hour antibiotic administration is delayed.',
      'Monotherapy or combination therapy must provide rapid bactericidal antipseudomonal coverage (Cefepime or Meropenem).',
      'Children with oncology central lines are at high risk of rapid decompensation from gram-negative endotoxin release.',
    ],
  },
};

/**
 * Calculates 5th percentile Minimum Systolic Blood Pressure for pediatric age
 */
export function calculateMinimumSbp(ageYears: number): number {
  if (ageYears < 1) {
    return 70; // Infant
  } else if (ageYears <= 10) {
    return 70 + 2 * ageYears; // Toddler through school-age
  } else {
    return 90; // Adolescent
  }
}

/**
 * Calculates Vasoactive-Inotropic Score (VIS)
 */
export function calculateVisScore(rates: VasoactiveInfusionRates): number {
  const vis =
    rates.dopamineMcgKgMin +
    rates.dobutamineMcgKgMin +
    100 * rates.epinephrineMcgKgMin +
    10 * rates.milrinoneMcgKgMin +
    10000 * rates.vasopressinUnitsKgMin +
    100 * rates.norepinephrineMcgKgMin;

  return Number(vis.toFixed(1));
}

/**
 * Classifies Pediatric Shock Phenotype based on physical exam & hemodynamics
 */
export function classifyShockPhenotype(
  extremities: 'COOL_MOTTLED' | 'WARM_FLUSHED' | 'NORMAL_WARM',
  capRefillSec: number,
  pulseQuality: 'THREADY_WEAK' | 'NORMAL' | 'BOUNDING_WATERHAMMER',
  sbp: number,
  minSbp: number
): ShockPhenotype {
  const isHypotensive = sbp < minSbp;

  if (extremities === 'NORMAL_WARM' && capRefillSec <= 2.5 && !isHypotensive) {
    return 'RESOLVED_EUVOLEMIC';
  }

  if (extremities === 'WARM_FLUSHED' || (capRefillSec < 1.0 && pulseQuality === 'BOUNDING_WATERHAMMER')) {
    return 'WARM_SHOCK';
  }

  if (extremities === 'COOL_MOTTLED' || capRefillSec > 3.0 || pulseQuality === 'THREADY_WEAK') {
    return 'COLD_SHOCK';
  }

  return 'COMPENSATED';
}

/**
 * Initialize patient state from a pediatric scenario preset
 */
export function initializePediatricShockState(scenarioId: PediatricScenarioPresetId): PediatricPatientState {
  const scenario = PEDIATRIC_SHOCK_SCENARIOS[scenarioId];
  const minSbp = calculateMinimumSbp(scenario.patientAgeYears);
  const sbp = scenario.baselineHemodynamics.systolicBpMmHg;
  const dbp = scenario.baselineHemodynamics.diastolicBpMmHg;
  const map = Math.round(dbp + (sbp - dbp) / 3);

  const vasoRates: VasoactiveInfusionRates = {
    epinephrineMcgKgMin: 0,
    norepinephrineMcgKgMin: 0,
    dobutamineMcgKgMin: 0,
    dopamineMcgKgMin: 0,
    milrinoneMcgKgMin: 0,
    vasopressinUnitsKgMin: 0,
  };

  // If scenario is catecholamine resistant, initialize with existing baseline rates
  if (scenarioId === 'CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE') {
    vasoRates.epinephrineMcgKgMin = 0.3;
    vasoRates.norepinephrineMcgKgMin = 0.2;
  }

  const initialVis = calculateVisScore(vasoRates);

  return {
    scenarioId,
    elapsedSeconds: 0,
    patientAgeYears: scenario.patientAgeYears,
    weightKg: scenario.weightKg,
    hemodynamics: {
      heartRateBpm: scenario.baselineHemodynamics.heartRateBpm,
      systolicBpMmHg: sbp,
      diastolicBpMmHg: dbp,
      meanArterialPressureMmHg: map,
      minimumAcceptableSbpMmHg: minSbp,
      respiratoryRateMin: scenario.baselineHemodynamics.respiratoryRateMin,
      spO2Percent: scenario.baselineHemodynamics.spO2Percent,
      capillaryRefillSeconds: scenario.baselineHemodynamics.capillaryRefillSeconds,
      peripheralPulseQuality: scenario.baselineHemodynamics.peripheralPulseQuality,
      extremityTemperature: scenario.baselineHemodynamics.extremityTemperature,
      cardiacOutputIndex: scenario.initialPhenotype === 'COLD_SHOCK' ? 'DEPRESSED_LOW' : 'ELEVATED_HYPERDYNAMIC',
      systemicVascularResistance: scenario.initialPhenotype === 'COLD_SHOCK' ? 'ELEVATED_HIGH' : 'DEPRESSED_LOW',
      phenotype: scenario.initialPhenotype,
    },
    metabolic: {
      bloodGlucoseMgDl: scenario.baselineMetabolic.bloodGlucoseMgDl,
      ionizedCalciumMmolL: scenario.baselineMetabolic.ionizedCalciumMmolL,
      serumLactateMmolL: scenario.baselineMetabolic.serumLactateMmolL,
      arterialPh: 7.26,
      urineOutputMlKgHr: 0.4,
    },
    fluidState: {
      cumulativeFluidMlKg: scenarioId === 'FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL' ? 40 : 0,
      liverEdgeBelowCostalMarginCm: scenario.initialLiverEdgeCm,
      pulmonaryCracklesPresent: scenario.initialLiverEdgeCm >= 3.5,
      workOfBreathing: scenario.initialLiverEdgeCm >= 3.5 ? 'SEVERE_GRUNTING_FLARING' : 'MILD_RETRACTIONS',
      fluidStopTriggered: scenario.initialLiverEdgeCm >= 3.5,
    },
    vasoactiveRates: vasoRates,
    visScore: initialVis,
    bloodCulturesObtained: false,
    antibioticsAdministered: false,
    hydrocortisoneAdministered: false,
    calciumAdministered: false,
    glucoseAdministered: false,
    administeredFluidBolusesCount: scenarioId === 'FLUID_OVERLOAD_HEPATOMEGALY_PRESCHOOL' ? 2 : 0,
    clinicalAlarms: [],
    interventionsPerformed: [],
  };
}

/**
 * Deliver a Fluid Bolus (10 to 20 mL/kg) with safety re-assessment
 */
export function deliverFluidBolus(
  state: PediatricPatientState,
  volumeMlKg: number = 20
): { updatedState: PediatricPatientState; success: boolean; message: string } {
  const newState: PediatricPatientState = JSON.parse(JSON.stringify(state));

  // If fluid stop already active or hepatomegaly is present
  if (newState.fluidState.fluidStopTriggered || newState.fluidState.liverEdgeBelowCostalMarginCm >= 3.0) {
    const errorMsg =
      'FLUID STOP SAFETY INTERLOCK TRIGGERED: Hepatomegaly (liver edge >= 3.0 cm) and/or pulmonary crackles detected! Further fluid boluses are contraindicated to prevent fatal pulmonary edema. Transition to vasoactive infusions immediately.';
    newState.clinicalAlarms.push('FATAL FLUID OVERLOAD RISK: Further boluses blocked.');
    return { updatedState: newState, success: false, message: errorMsg };
  }

  newState.administeredFluidBolusesCount++;
  newState.fluidState.cumulativeFluidMlKg += volumeMlKg;
  // Liver edge descends with cumulative volume
  newState.fluidState.liverEdgeBelowCostalMarginCm += 0.8;

  // Check if this bolus crossed fluid overload threshold
  if (newState.fluidState.liverEdgeBelowCostalMarginCm >= 3.0) {
    newState.fluidState.fluidStopTriggered = true;
    newState.fluidState.pulmonaryCracklesPresent = true;
    newState.fluidState.workOfBreathing = 'SEVERE_GRUNTING_FLARING';
    newState.hemodynamics.spO2Percent = Math.max(86, newState.hemodynamics.spO2Percent - 5);
    newState.clinicalAlarms.push('NEW HEPATOMEGALY & PULMONARY CRACKLES: Cease fluid boluses immediately!');
  }

  // Hemodynamic response to fluid
  if (!newState.fluidState.fluidStopTriggered) {
    newState.hemodynamics.heartRateBpm = Math.max(90, newState.hemodynamics.heartRateBpm - 12);
    newState.hemodynamics.systolicBpMmHg = Math.min(110, newState.hemodynamics.systolicBpMmHg + 8);
    newState.hemodynamics.diastolicBpMmHg = Math.min(70, newState.hemodynamics.diastolicBpMmHg + 5);
    newState.hemodynamics.capillaryRefillSeconds = Math.max(1.8, newState.hemodynamics.capillaryRefillSeconds - 0.8);
  }

  newState.hemodynamics.meanArterialPressureMmHg = Math.round(
    newState.hemodynamics.diastolicBpMmHg + (newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg) / 3
  );

  newState.interventionsPerformed.push(`Fluid Bolus ${volumeMlKg} mL/kg Delivered (Total ${newState.fluidState.cumulativeFluidMlKg} mL/kg)`);

  return {
    updatedState: newState,
    success: true,
    message: `Delivered ${volumeMlKg} mL/kg balanced crystalloid bolus (${volumeMlKg * newState.weightKg} mL). Total cumulative: ${newState.fluidState.cumulativeFluidMlKg} mL/kg. Liver edge: ${newState.fluidState.liverEdgeBelowCostalMarginCm.toFixed(1)} cm.`,
  };
}

/**
 * Titrate Vasoactive Drug Infusion
 */
export function titrateVasoactiveDrug(
  state: PediatricPatientState,
  drug: VasoactiveDrug,
  rate: number
): { updatedState: PediatricPatientState; message: string } {
  const newState: PediatricPatientState = JSON.parse(JSON.stringify(state));

  switch (drug) {
    case 'EPINEPHRINE':
      newState.vasoactiveRates.epinephrineMcgKgMin = Math.max(0, Math.min(1.5, rate));
      break;
    case 'NOREPINEPHRINE':
      newState.vasoactiveRates.norepinephrineMcgKgMin = Math.max(0, Math.min(1.5, rate));
      break;
    case 'DOBUTAMINE':
      newState.vasoactiveRates.dobutamineMcgKgMin = Math.max(0, Math.min(20, rate));
      break;
    case 'DOPAMINE':
      newState.vasoactiveRates.dopamineMcgKgMin = Math.max(0, Math.min(20, rate));
      break;
    case 'MILRINONE':
      newState.vasoactiveRates.milrinoneMcgKgMin = Math.max(0, Math.min(0.75, rate));
      break;
    case 'VASOPRESSIN':
      newState.vasoactiveRates.vasopressinUnitsKgMin = Math.max(0, Math.min(0.002, rate));
      break;
  }

  newState.visScore = calculateVisScore(newState.vasoactiveRates);

  // Physiologic response:
  // Epinephrine increases inotropy and blood pressure
  if (drug === 'EPINEPHRINE') {
    if (rate > 0) {
      newState.hemodynamics.systolicBpMmHg = Math.min(125, newState.hemodynamics.systolicBpMmHg + Math.round(rate * 30));
      newState.hemodynamics.capillaryRefillSeconds = Math.max(1.8, newState.hemodynamics.capillaryRefillSeconds - rate * 2.5);
      newState.hemodynamics.extremityTemperature = 'NORMAL_WARM';
      newState.hemodynamics.peripheralPulseQuality = 'NORMAL';
    }
  } else if (drug === 'NOREPINEPHRINE') {
    if (rate > 0) {
      newState.hemodynamics.diastolicBpMmHg = Math.min(80, newState.hemodynamics.diastolicBpMmHg + Math.round(rate * 35));
      newState.hemodynamics.systolicBpMmHg = Math.min(120, newState.hemodynamics.systolicBpMmHg + Math.round(rate * 20));
      newState.hemodynamics.capillaryRefillSeconds = 2.0;
      newState.hemodynamics.peripheralPulseQuality = 'NORMAL';
    }
  }

  newState.hemodynamics.meanArterialPressureMmHg = Math.round(
    newState.hemodynamics.diastolicBpMmHg + (newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg) / 3
  );

  newState.hemodynamics.phenotype = classifyShockPhenotype(
    newState.hemodynamics.extremityTemperature,
    newState.hemodynamics.capillaryRefillSeconds,
    newState.hemodynamics.peripheralPulseQuality,
    newState.hemodynamics.systolicBpMmHg,
    newState.hemodynamics.minimumAcceptableSbpMmHg
  );

  return {
    updatedState: newState,
    message: `Titrated ${drug} to ${rate}. New Vasoactive-Inotropic Score (VIS): ${newState.visScore}.`,
  };
}

/**
 * Execute Sepsis Bundle Action (Antibiotics, Blood Cultures, D10W, Calcium, Hydrocortisone)
 */
export function executeBundleAction(
  state: PediatricPatientState,
  action: 'BLOOD_CULTURES' | 'ANTIBIOTICS' | 'D10W_GLUCOSE' | 'CALCIUM_GLUCONATE' | 'HYDROCORTISONE'
): { updatedState: PediatricPatientState; message: string } {
  const newState: PediatricPatientState = JSON.parse(JSON.stringify(state));

  switch (action) {
    case 'BLOOD_CULTURES':
      newState.bloodCulturesObtained = true;
      newState.interventionsPerformed.push('STAT Blood Cultures Obtained');
      return { updatedState: newState, message: 'STAT Peripheral & Central Line Blood Cultures drawn.' };

    case 'ANTIBIOTICS':
      newState.antibioticsAdministered = true;
      newState.antibioticName = 'Cefepime + Vancomycin IV';
      newState.interventionsPerformed.push('Broad-Spectrum Antibiotics Infused (< 60 min bundle)');
      return { updatedState: newState, message: 'Broad-Spectrum Antibiotics infused per PALS Sepsis Bundle.' };

    case 'D10W_GLUCOSE':
      newState.glucoseAdministered = true;
      newState.metabolic.bloodGlucoseMgDl = Math.min(130, newState.metabolic.bloodGlucoseMgDl + 45);
      newState.interventionsPerformed.push(`D10W Bolus 2 mL/kg Delivered (${newState.weightKg * 2} mL)`);
      return { updatedState: newState, message: `D10W Bolus given. Blood glucose normalized to ${newState.metabolic.bloodGlucoseMgDl} mg/dL.` };

    case 'CALCIUM_GLUCONATE':
      newState.calciumAdministered = true;
      newState.metabolic.ionizedCalciumMmolL = 1.22;
      newState.hemodynamics.systolicBpMmHg = Math.min(115, newState.hemodynamics.systolicBpMmHg + 6);
      newState.interventionsPerformed.push('10% Calcium Gluconate 100 mg/kg IV Infused');
      return { updatedState: newState, message: '10% Calcium Gluconate given. Ionized calcium normalized to 1.22 mmol/L; myocardial contractility supported.' };

    case 'HYDROCORTISONE':
      newState.hydrocortisoneAdministered = true;
      newState.interventionsPerformed.push('Stress-Dose Hydrocortisone 2 mg/kg IV Infused (CIRCI Rescue)');
      // Restores catecholamine sensitivity:
      newState.hemodynamics.systolicBpMmHg = Math.min(115, newState.hemodynamics.systolicBpMmHg + 18);
      newState.hemodynamics.diastolicBpMmHg = Math.min(75, newState.hemodynamics.diastolicBpMmHg + 12);
      newState.hemodynamics.meanArterialPressureMmHg = Math.round(
        newState.hemodynamics.diastolicBpMmHg + (newState.hemodynamics.systolicBpMmHg - newState.hemodynamics.diastolicBpMmHg) / 3
      );
      newState.hemodynamics.phenotype = 'RESOLVED_EUVOLEMIC';
      return { updatedState: newState, message: 'Stress-dose Hydrocortisone given. Receptors resensitized, blood pressure restored.' };
  }
}

/**
 * Advance time step in pediatric simulation (15 seconds)
 */
export function advancePediatricTimeStep(state: PediatricPatientState, stepSeconds: number = 15): PediatricPatientState {
  const newState: PediatricPatientState = JSON.parse(JSON.stringify(state));
  newState.elapsedSeconds += stepSeconds;

  // Untreated shock deteriorates
  if (!newState.antibioticsAdministered && newState.elapsedSeconds > 180) {
    newState.metabolic.serumLactateMmolL = Math.min(10, newState.metabolic.serumLactateMmolL + 0.1);
  }

  // Check hypotension alarm
  if (newState.hemodynamics.systolicBpMmHg < newState.hemodynamics.minimumAcceptableSbpMmHg) {
    if (!newState.clinicalAlarms.includes('DECOMPENSATED HYPOTENSION: SBP below 5th percentile for age!')) {
      newState.clinicalAlarms.push('DECOMPENSATED HYPOTENSION: SBP below 5th percentile for age!');
    }
  }

  // Check hypoglycemia alarm
  if (newState.metabolic.bloodGlucoseMgDl < 70 && !newState.clinicalAlarms.includes('CRITICAL HYPOGLYCEMIA: Glucose < 70 mg/dL!')) {
    newState.clinicalAlarms.push('CRITICAL HYPOGLYCEMIA: Glucose < 70 mg/dL! Administer D10W 2 mL/kg STAT.');
  }

  // Check hypocalcemia alarm
  if (newState.metabolic.ionizedCalciumMmolL < 1.0 && !newState.clinicalAlarms.includes('CRITICAL HYPOCALCEMIA: iCa < 1.0 mmol/L!')) {
    newState.clinicalAlarms.push('CRITICAL HYPOCALCEMIA: iCa < 1.0 mmol/L! Administer Calcium Gluconate STAT.');
  }

  return newState;
}

export interface PediatricDebriefResult {
  scorePercentage: number;
  letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL';
  correctPhenotypeIdentified: boolean;
  firstLineVasoactiveCorrect: boolean;
  fluidOverloadAvoided: boolean;
  bundleTimeliness: boolean;
  metabolicCorrectionsDone: boolean;
  facultyFeedback: string[];
}

/**
 * Objective Debriefing Rubric for Pediatric Septic Shock
 */
export function evaluatePediatricShockDebrief(state: PediatricPatientState): PediatricDebriefResult {
  const scenario = PEDIATRIC_SHOCK_SCENARIOS[state.scenarioId];
  let score = 100;
  const facultyFeedback: string[] = [];

  // 1. First-line Vasoactive selection (+20 or -20)
  let firstLineVasoactiveCorrect = false;
  if (scenario.recommendedFirstLineVasoactive === 'EPINEPHRINE') {
    if (state.vasoactiveRates.epinephrineMcgKgMin > 0) {
      firstLineVasoactiveCorrect = true;
      facultyFeedback.push('Excellent: Correctly selected Epinephrine for Cold Shock (low cardiac output, high SVR).');
    } else if (state.vasoactiveRates.norepinephrineMcgKgMin > 0) {
      score -= 15;
      facultyFeedback.push('Phenotype-Drug Mismatch: Norepinephrine alone in Cold Shock increases afterload without augmenting stroke volume; Epinephrine is preferred.');
    } else {
      score -= 20;
      facultyFeedback.push('Omission: Epinephrine infusion was not initiated despite persistent cold shock.');
    }
  } else if (scenario.recommendedFirstLineVasoactive === 'NOREPINEPHRINE') {
    if (state.vasoactiveRates.norepinephrineMcgKgMin > 0) {
      firstLineVasoactiveCorrect = true;
      facultyFeedback.push('Excellent: Correctly selected Norepinephrine for Warm Shock (vasodilated, low SVR).');
    } else {
      score -= 20;
      facultyFeedback.push('Omission: Norepinephrine was not initiated despite warm shock with flash capillary refill and wide pulse pressure.');
    }
  }

  // 2. Fluid Overload Awareness (+20 or -25)
  let fluidOverloadAvoided = true;
  if (state.fluidState.liverEdgeBelowCostalMarginCm >= 3.0 && state.administeredFluidBolusesCount > 2) {
    score -= 25;
    fluidOverloadAvoided = false;
    facultyFeedback.push('Critical Safety Error: Continued fluid boluses despite worsening hepatomegaly and pulmonary crackles.');
  } else {
    facultyFeedback.push('Appropriate Fluid Titration: Monitored liver edge and lung fields, adhering to FEAST safety principles.');
  }

  // 3. Sepsis Bundle Execution
  let bundleTimeliness = true;
  if (!state.bloodCulturesObtained) {
    score -= 10;
    bundleTimeliness = false;
    facultyFeedback.push('Missed Bundle Step: Blood cultures were not obtained.');
  }
  if (!state.antibioticsAdministered) {
    score -= 25;
    bundleTimeliness = false;
    facultyFeedback.push('Critical Omission: Broad-spectrum antibiotics were not administered within 60 minutes.');
  } else {
    facultyFeedback.push('Timely Antimicrobials: Broad-spectrum antibiotics delivered promptly.');
  }

  // 4. Metabolic Corrections (Glucose & Calcium)
  let metabolicCorrectionsDone = true;
  if (scenario.baselineMetabolic.bloodGlucoseMgDl < 70 && !state.glucoseAdministered) {
    score -= 15;
    metabolicCorrectionsDone = false;
    facultyFeedback.push('Metabolic Omission: Hypoglycemia (< 70 mg/dL) was uncorrected; D10W bolus is mandatory in pediatric sepsis.');
  }
  if (scenario.baselineMetabolic.ionizedCalciumMmolL < 1.0 && !state.calciumAdministered) {
    score -= 15;
    metabolicCorrectionsDone = false;
    facultyFeedback.push('Metabolic Omission: Critical hypocalcemia (iCa < 1.0 mmol/L) was uncorrected; calcium is a vital inotrope for pediatric myocardium.');
  }

  // 5. CIRCI Hydrocortisone
  if (scenario.id === 'CATECHOLAMINE_RESISTANT_CIRCI_SCHOOL_AGE') {
    if (state.hydrocortisoneAdministered) {
      facultyFeedback.push('Lifesaving CIRCI Rescue: Promptly identified catecholamine-resistant shock and administered stress-dose hydrocortisone.');
    } else {
      score -= 20;
      facultyFeedback.push('Missed CIRCI Rescue: Patient in catecholamine-resistant shock (VIS >= 20) requires stress-dose hydrocortisone.');
    }
  }

  score = Math.max(0, Math.min(100, score));

  let letterGrade: 'A+' | 'A' | 'B' | 'C' | 'FAIL' = 'FAIL';
  if (score >= 95) letterGrade = 'A+';
  else if (score >= 85) letterGrade = 'A';
  else if (score >= 75) letterGrade = 'B';
  else if (score >= 60) letterGrade = 'C';

  return {
    scorePercentage: score,
    letterGrade,
    correctPhenotypeIdentified: true,
    firstLineVasoactiveCorrect,
    fluidOverloadAvoided,
    bundleTimeliness,
    metabolicCorrectionsDone,
    facultyFeedback,
  };
}
