/**
 * CcbBetaBlockerHietEngine.ts
 * Biophysical, Resuscitation & Pharmacotherapy Engine for CCB & Beta-Blocker Toxicity
 * Implements:
 * 1. Toxicological Differentiation: Calcium Channel Blocker (CCB) vs Beta-Blocker (BB)
 * 2. High-Dose Insulin Euglycemia Therapy (HIET) Titration Engine (1 to 10 units/kg/h)
 * 3. Dextrose Clamp & Potassium Homeostasis Guardrails (preventing fatal hypoglycemia & hypokalemia)
 * 4. IV Calcium (Chloride vs Gluconate elemental stoichiometry & central vs peripheral safety)
 * 5. Glucagon non-adrenergic adenylyl cyclase bypass mechanics
 * 6. Lipid Emulsion (ILE) 20% & VA-ECMO refractory rescue triggers
 * Location: frontend/.gemini/skills/CcbBetaBlockerHietEngine.ts
 */

export type ToxinClass = 'CCB_NON_DIHYDROPYRIDINE' | 'CCB_DIHYDROPYRIDINE' | 'BETA_BLOCKER' | 'MIXED_INGESTION';
export type CcbAgent = 'VERAPAMIL' | 'DILTIAZEM' | 'AMLODIPINE' | 'NIFEDIPINE';
export type BbAgent = 'PROPRANOLOL' | 'METOPROLOL' | 'ATENOLOL' | 'SOTALOL' | 'CARVEDILOL';

export interface OverdosePatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  toxinClass: ToxinClass;
  specificDrug: string;
  estimatedIngestionDoseMg: number;
  hoursPostIngestion: number;
  isExtendedReleaseFormulation: boolean;

  // Hemodynamics
  heartRateBpm: number;
  systolicBpMmHg: number;
  diastolicBpMmHg: number;
  qrsIntervalMs: number;
  qtcIntervalMs: number;

  // Metabolic & Labs
  bloodGlucoseMgDl: number;
  serumPotassiumMeqL: number;
  arterialPh: number;
  serumLactateMmolL: number;
  hasCentralVenousAccess: boolean;

  // HIET & Resuscitation Interventions
  isHietInitiated: boolean;
  insulinInfusionRateUnitsKgH: number; // 0.5 to 10 units/kg/h
  dextroseInfusionRateGKgH: number;   // 0.25 to 1.0 g/kg/h (D10W / D20W / D50W)
  isIvCalciumAdministered: boolean;
  calciumSaltType: 'CALCIUM_CHLORIDE' | 'CALCIUM_GLUCONATE';
  calciumDoseGrams: number;
  isGlucagonAdministered: boolean;
  glucagonBolusMg: number;
  vasopressorActive: 'NONE' | 'NOREPINEPHRINE' | 'EPINEPHRINE' | 'VASOPRESSIN';
  isLipidRescueConsidered: boolean;
}

export interface ShockSeverityEvaluation {
  meanArterialPressureMmHg: number;
  shockIndex: number; // HR / SBP
  severityCategory: 'REFRACTORY_CARDIOGENIC_COLLAPSE' | 'SEVERE_CARDIOGENIC_SHOCK' | 'MODERATE_TOXICITY' | 'MILD_COMPENSATED';
  vasodilatoryVsCardiogenicPhenotype: string;
  inHospitalMortalityRiskPercent: number;
}

export interface HietDosingGuidance {
  recommendedBolusUnits: number; // 1 unit/kg
  recommendedInitialInfusionUnitsPerHour: number; // 1 unit/kg/h
  currentInfusionDoseUnitsPerHour: number; // insulinInfusionRateUnitsKgH * weight
  maximalTitrationCapUnitsPerHour: number; // 10 units/kg/h * weight
  titrationAdvice: string;
  onsetOfInotropicEffectTimeframe: string;
  dextroseSupportNeeds: {
    recommendedDextroseConcentration: 'D10W_PERIPHERAL' | 'D20W_D50W_CENTRAL';
    gramsDextrosePerHour: number;
    targetGlucoseRangeMgDl: string;
    hypoglycemiaWarning: string | null;
  };
  potassiumGuardrail: {
    targetRangeMeqL: string;
    supplementationAdvice: string;
    hypokalemiaAlert: string | null;
  };
}

export interface AdjuvantTherapyEvaluation {
  calciumGuidance: {
    elementalCalciumMeqDelivered: number;
    safetyRouteWarning: string | null;
    efficacyNote: string;
  };
  glucagonGuidance: {
    indicated: boolean;
    dosingRationale: string;
    emesisAspirationRisk: string;
  };
  vasopressorGuidance: {
    recommendedAgent: string;
    rationale: string;
  };
  refractoryRescue: {
    isIleIndicated: boolean;
    ileRationale: string;
    isVaEcmoIndicated: boolean;
    ecmoCriteria: string;
  };
}

export interface ComprehensiveOverdoseEvaluation {
  shockSeverity: ShockSeverityEvaluation;
  hiet: HietDosingGuidance;
  adjuvants: AdjuvantTherapyEvaluation;
  diagnosticHallmarks: {
    expectedGlucoseTrend: string;
    cellularMetabolismDefect: string;
  };
  criticalSafetyInterlocks: string[];
  immediateActionDirectives: string[];
  clinicalPearls: string[];
}

/**
 * 1. Evaluate Shock Severity & Hemodynamic Failure
 */
export function evaluateShockSeverity(input: OverdosePatientInput): ShockSeverityEvaluation {
  const map = Math.round((input.systolicBpMmHg + 2 * input.diastolicBpMmHg) / 3);
  const shockIndex = Number((input.heartRateBpm / Math.max(1, input.systolicBpMmHg)).toFixed(2));

  let category: ShockSeverityEvaluation['severityCategory'] = 'MILD_COMPENSATED';
  let mortality = 3;

  if (map < 55 || (input.systolicBpMmHg < 70 && input.heartRateBpm < 45) || input.serumLactateMmolL >= 8.0) {
    category = 'REFRACTORY_CARDIOGENIC_COLLAPSE';
    mortality = 45;
  } else if (map < 65 || input.systolicBpMmHg < 85 || input.heartRateBpm < 50 || input.serumLactateMmolL >= 4.0) {
    category = 'SEVERE_CARDIOGENIC_SHOCK';
    mortality = 25;
  } else if (map < 75 || input.heartRateBpm < 60 || input.serumLactateMmolL >= 2.5) {
    category = 'MODERATE_TOXICITY';
    mortality = 10;
  }

  let phenotype = 'Mixed Cardiogenic & Vasodilatory Failure';
  if (input.toxinClass === 'CCB_NON_DIHYDROPYRIDINE') {
    phenotype = 'Predominant Myocardial Depression & Severe Nodal Bradycardia (Verapamil/Diltiazem L-type Block)';
  } else if (input.toxinClass === 'CCB_DIHYDROPYRIDINE') {
    phenotype = 'Severe Distributive Vasodilation with Secondary Myocardial Failure (Amlodipine)';
  } else if (input.toxinClass === 'BETA_BLOCKER') {
    phenotype = 'Decreased Inotropy/Chronotropy with Preserved or Increased SVR (Beta-1 Blunted cAMP)';
  }

  return {
    meanArterialPressureMmHg: map,
    shockIndex,
    severityCategory: category,
    vasodilatoryVsCardiogenicPhenotype: phenotype,
    inHospitalMortalityRiskPercent: mortality,
  };
}

/**
 * 2. Calculate High-Dose Insulin Euglycemia Therapy (HIET)
 */
export function calculateHietDosing(input: OverdosePatientInput): HietDosingGuidance {
  const bolusUnits = Math.round(input.patientWeightKg * 1.0);
  const initialInfusionUnitsH = Math.round(input.patientWeightKg * 1.0);
  const currentInfusionUnitsH = Math.round(input.patientWeightKg * input.insulinInfusionRateUnitsKgH);
  const maxCapUnitsH = Math.round(input.patientWeightKg * 10.0);

  let titrationAdvice = 'Titrate insulin by 0.5 - 1.0 unit/kg/h every 15-30 minutes until MAP >= 65 mmHg, SBP >= 90 mmHg, and cardiac output improves.';
  if (input.insulinInfusionRateUnitsKgH >= 5.0) {
    titrationAdvice = 'High titration tier (>= 5 units/kg/h): Ensure central line access, concentrated dextrose (D20W/D50W), and frequent electrolyte monitoring.';
  }

  // Dextrose needs
  const gramsDextrosePerHour = Number((input.dextroseInfusionRateGKgH * input.patientWeightKg).toFixed(1));
  const requiresCentralDextrose = !input.hasCentralVenousAccess && input.insulinInfusionRateUnitsKgH >= 2.0;

  let hypoWarning: string | null = null;
  if (input.bloodGlucoseMgDl < 100) {
    hypoWarning = 'CRITICAL HYPOGLYCEMIA ALERT: Blood glucose < 100 mg/dL during HIET! Immediately push 50 mL D50W IV bolus and step up dextrose infusion.';
  } else if (input.bloodGlucoseMgDl < 150) {
    hypoWarning = 'Low-target warning: Blood glucose < 150 mg/dL. Increase dextrose infusion rate to maintain safe euglycemia buffer (150-250 mg/dL).';
  }

  // Potassium guardrail
  let hypoKAlert: string | null = null;
  let kAdvice = 'Serum potassium expected to shift intracellularly. Check K+ every 30-60 min. Maintain K+ between 3.5 and 4.5 mEq/L.';
  if (input.serumPotassiumMeqL < 3.0) {
    hypoKAlert = 'CRITICAL HYPOKALEMIA ALERT: K+ < 3.0 mEq/L! Risk of lethal ventricular tachyarrhythmias. Infuse IV KCl 20-40 mEq/h via central line immediately.';
    kAdvice = 'Aggressive IV replacement required. Temporarily hold insulin rate increases until K+ >= 3.0 mEq/L.';
  } else if (input.serumPotassiumMeqL < 3.5) {
    kAdvice = 'Mild intracellular shift (3.0-3.4 mEq/L): Supplement KCl 10-20 mEq/h. Do NOT stop insulin infusion as total-body K+ is preserved.';
  }

  return {
    recommendedBolusUnits: bolusUnits,
    recommendedInitialInfusionUnitsPerHour: initialInfusionUnitsH,
    currentInfusionDoseUnitsPerHour: currentInfusionUnitsH,
    maximalTitrationCapUnitsPerHour: maxCapUnitsH,
    titrationAdvice,
    onsetOfInotropicEffectTimeframe: 'Delayed 15-45 minutes; hemodynamic improvement lags behind infusion onset. Maintain vasopressor bridge while insulin shifts metabolism.',
    dextroseSupportNeeds: {
      recommendedDextroseConcentration: input.hasCentralVenousAccess ? 'D20W_D50W_CENTRAL' : 'D10W_PERIPHERAL',
      gramsDextrosePerHour,
      targetGlucoseRangeMgDl: '150 - 250 mg/dL (8.3 - 13.9 mmol/L)',
      hypoglycemiaWarning: hypoWarning,
    },
    potassiumGuardrail: {
      targetRangeMeqL: '3.5 - 4.5 mEq/L',
      supplementationAdvice: kAdvice,
      hypokalemiaAlert: hypoKAlert,
    },
  };
}

/**
 * 3. Evaluate Adjuvant Therapies: Calcium, Glucagon, Pressors & ECMO
 */
export function evaluateAdjuvants(input: OverdosePatientInput): AdjuvantTherapyEvaluation {
  // Calcium stoichiometry
  // 1 g Calcium Chloride 10% = 13.6 mEq elemental Ca (272 mg elemental Ca)
  // 1 g Calcium Gluconate 10% = 4.65 mEq elemental Ca (93 mg elemental Ca)
  const isChloride = input.calciumSaltType === 'CALCIUM_CHLORIDE';
  const elementalFactor = isChloride ? 13.6 : 4.65;
  const elementalCa = Number((input.calciumDoseGrams * elementalFactor).toFixed(1));

  let calciumRouteWarning: string | null = null;
  if (isChloride && !input.hasCentralVenousAccess) {
    calciumRouteWarning = 'EXTRAVASATION TISSUE NECROSIS HAZARD: Calcium Chloride is a severe vesicant. Central venous catheter mandatory; if only peripheral access exists, use Calcium Gluconate (3x volume).';
  }

  const calciumEfficacy = isChloride
    ? 'Calcium Chloride provides 3x more bioavailable elemental calcium than Gluconate, making it the preferred formulation for rapid overcoming of competitive L-type channel blockade.'
    : 'Calcium Gluconate is preferred for peripheral lines to avoid severe extravasation skin necrosis, but requires higher gram-doses to achieve therapeutic calcium ion concentration.';

  // Glucagon for Beta-Blockers
  const isBb = input.toxinClass === 'BETA_BLOCKER';
  const glucagonIndicated = isBb && input.systolicBpMmHg < 90;
  const glucagonRationale = isBb
    ? 'Glucagon stimulates myocardial adenylyl cyclase via independent non-adrenergic Gs-coupled receptors, augmenting intracellular cAMP and improving heart rate and inotropy.'
    : 'Glucagon has minimal efficacy in primary Calcium Channel Blocker toxicity; HIET and vasopressors are significantly superior.';

  // Vasopressor guidance
  let pressorRec = 'Norepinephrine 0.05 - 0.5 mcg/kg/min (first-line for vasodilatory shock)';
  let pressorRationale = 'Alpha-1 vasoconstriction restores coronary perfusion pressure and systemic vascular resistance while HIET metabolic inotropy takes effect.';
  if (input.heartRateBpm < 40 && input.systolicBpMmHg < 75) {
    pressorRec = 'Epinephrine 0.02 - 0.2 mcg/kg/min combined with Norepinephrine';
    pressorRationale = 'Dual alpha/beta adrenergic stimulation for severe combined inotropic and chronotropic collapse.';
  }

  // Refractory triggers
  const map = (input.systolicBpMmHg + 2 * input.diastolicBpMmHg) / 3;
  const isRefractory = map < 55 && input.insulinInfusionRateUnitsKgH >= 2.0 && input.serumLactateMmolL >= 5.0;

  return {
    calciumGuidance: {
      elementalCalciumMeqDelivered: elementalCa,
      safetyRouteWarning: calciumRouteWarning,
      efficacyNote: calciumEfficacy,
    },
    glucagonGuidance: {
      indicated: glucagonIndicated,
      dosingRationale: glucagonRationale,
      emesisAspirationRisk: 'High incidence of severe projectile vomiting; ensure definitive airway protection (endotracheal intubation) prior to high-dose glucagon boluses.',
    },
    vasopressorGuidance: {
      recommendedAgent: pressorRec,
      rationale: pressorRationale,
    },
    refractoryRescue: {
      isIleIndicated: isRefractory && (input.specificDrug === 'VERAPAMIL' || input.specificDrug === 'PROPRANOLOL' || input.specificDrug === 'DILTIAZEM'),
      ileRationale: 'Intravenous Lipid Emulsion (ILE 20%) creates a lipid sink that partitions highly lipophilic cardiotoxins (Verapamil logP=3.8, Propranolol logP=3.5) away from myocardial receptors.',
      isVaEcmoIndicated: isRefractory,
      ecmoCriteria: 'Persistent cardiogenic shock with MAP < 55 mmHg, refractory bradycardia, and lactate > 8 mmol/L despite HIET (>= 5 U/kg/h) and dual vasopressors: emergent VA-ECMO cannulation is indicated as a bridge to metabolic clearance.',
    },
  };
}

/**
 * 4. Comprehensive Toxicological Evaluation
 */
export function performOverdoseEvaluation(input: OverdosePatientInput): ComprehensiveOverdoseEvaluation {
  const shockSeverity = evaluateShockSeverity(input);
  const hiet = calculateHietDosing(input);
  const adjuvants = evaluateAdjuvants(input);

  const isCcb = input.toxinClass.startsWith('CCB');
  const diagnosticHallmarks = {
    expectedGlucoseTrend: isCcb
      ? 'Marked HYPERGLYCEMIA (often > 250-400 mg/dL): CCB blocks L-type calcium channels on pancreatic beta-islet cells, arresting insulin release.'
      : 'Euglycemia or HYPOGLYCEMIA: Beta-blockers blunt hepatic glycogenolysis and gluconeogenesis, masking autonomic hypoglycemic warning signs.',
    cellularMetabolismDefect:
      'Myocytes in shock shift from fatty acid oxidation to glucose for energy. CCB poisoning induces profound functional hypoinsulinemia, starving myocytes of carbohydrate substrate. HIET reverses this by driving glucose into cardiomyocytes.',
  };

  const safetyInterlocks: string[] = [];

  // Interlock 1: Calcium chloride via peripheral line
  if (input.isIvCalciumAdministered && input.calciumSaltType === 'CALCIUM_CHLORIDE' && !input.hasCentralVenousAccess) {
    safetyInterlocks.push('CRITICAL ROUTE CONTRAINDICATION: Calcium Chloride administered via peripheral vein! Severe risk of extravasation, tissue calcinosis, and full-thickness skin necrosis. Switch to Calcium Gluconate or place central venous catheter.');
  }

  // Interlock 2: HIET hypoglycemia without adequate dextrose
  if (input.isHietInitiated && input.bloodGlucoseMgDl < 120 && input.dextroseInfusionRateGKgH < 0.25) {
    safetyInterlocks.push('LETHAL HYPOGLYCEMIA HAZARD: High-dose insulin infusion running with subtherapeutic dextrose replacement. Immediate IV D50W bolus and concentrated dextrose infusion required to avoid neuroglycopenic coma.');
  }

  // Interlock 3: Extreme hypokalemia
  if (input.serumPotassiumMeqL < 3.0) {
    safetyInterlocks.push('ARRHYTHMIA INTERLOCK: Serum potassium < 3.0 mEq/L. Intracellular shift induced by HIET risks precipitating refractory ventricular fibrillation. Infuse IV KCl immediately.');
  }

  // Interlock 4: QRS widening with Propranolol
  if (input.specificDrug === 'PROPRANOLOL' && input.qrsIntervalMs >= 120) {
    safetyInterlocks.push('SODIUM CHANNEL BLOCKADE DETECTED: Propranolol has membrane-stabilizing activity (quinidine-like sodium channel block). Treat widened QRS (>= 120 ms) with IV Sodium Bicarbonate (1-2 mEq/kg).');
  }

  const immediateActionDirectives = [
    'Secure ABCs with continuous invasive arterial blood pressure monitoring and central venous catheterization.',
    'Initiate HIET: Regular insulin 1.0 unit/kg IV bolus + continuous infusion starting at 1.0 unit/kg/h; titrate aggressively up to 5-10 units/kg/h.',
    'Clamp blood glucose at 150-250 mg/dL with concentrated dextrose infusion (D10W peripheral or D20W/D50W central); check glucose q15-30m.',
    'Administer Calcium Chloride 10% (1-2 g IV via central line over 5-10 min) or Calcium Gluconate (3-6 g peripheral) to boost calcium gradient.',
    'Initiate Norepinephrine (0.05-0.5 mcg/kg/min) ± Epinephrine to maintain SBP > 90 mmHg while awaiting metabolic inotropic onset of HIET.',
    'Check serum potassium q30-60m and infuse IV KCl to maintain target 3.5-4.5 mEq/L; avoid stopping insulin for mild hypokalemia.',
    'If patient ingested lipophilic agent (Verapamil, Propranolol) with refractory shock: consider 20% Intravenous Lipid Emulsion (ILE) bolus.',
    'Notify Extracorporeal Membrane Oxygenation (VA-ECMO) team early if refractory shock persists despite maximal medical therapy.',
  ];

  const clinicalPearls = [
    'Diagnostic Dichotomy: Severe hyperglycemia with bradycardia points toward Calcium Channel Blocker toxicity, whereas hypoglycemia or normal glucose favors Beta-Blocker poisoning.',
    'The Metabolic Inotrope Concept: High-dose insulin is not acting as an endocrine hormone; at doses of 1-10 units/kg/h, it acts as a pure metabolic inotrope, forcing carbohydrate uptake into starved, stunned cardiomyocytes.',
    'HIET Hemodynamic Lag: Insulin-mediated contractility improvement requires 15 to 45 minutes to take effect. Do not abandon HIET prematurely; bridge with vasopressors and calcium during the induction window.',
    'Vesicant Warning: 10% Calcium Chloride delivers 13.6 mEq elemental calcium per gram vs 4.65 mEq for Calcium Gluconate (nearly 3:1 ratio). However, Calcium Chloride extravasation causes irreversible chemical tissue necrosis and limb compartment syndrome if infused peripherally.',
    'Glucagon Limitations: Glucagon bypasses beta-receptors to boost cAMP via Gs receptors, but tachyphylaxis occurs within 1-2 hours and projectile vomiting creates severe aspiration risks.',
  ];

  return {
    shockSeverity,
    hiet,
    adjuvants,
    diagnosticHallmarks,
    criticalSafetyInterlocks: safetyInterlocks,
    immediateActionDirectives,
    clinicalPearls,
  };
}

/**
 * 5. Clinical Presets for Real-World Scenarios
 */
export interface OverdosePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: OverdosePatientInput;
}

export const OVERDOSE_PRESETS: OverdosePreset[] = [
  {
    id: 'MASSIVE_VERAPAMIL_COLLAPSE',
    name: 'Massive Verapamil SR Overdose with Cardiogenic Shock',
    badge: 'Profound CCB Toxicity',
    description: '52-year-old male ingested 4.8 g Verapamil SR. Presenting in junctional bradycardia (HR 32 bpm), BP 68/40 mmHg, blood glucose 380 mg/dL, and severe lactic acidosis.',
    inputs: {
      patientAgeYears: 52,
      patientWeightKg: 80,
      toxinClass: 'CCB_NON_DIHYDROPYRIDINE',
      specificDrug: 'VERAPAMIL',
      estimatedIngestionDoseMg: 4800,
      hoursPostIngestion: 3,
      isExtendedReleaseFormulation: true,
      heartRateBpm: 32,
      systolicBpMmHg: 68,
      diastolicBpMmHg: 40,
      qrsIntervalMs: 98,
      qtcIntervalMs: 460,
      bloodGlucoseMgDl: 380,
      serumPotassiumMeqL: 4.1,
      arterialPh: 7.18,
      serumLactateMmolL: 6.8,
      hasCentralVenousAccess: true,
      isHietInitiated: true,
      insulinInfusionRateUnitsKgH: 2.0,
      dextroseInfusionRateGKgH: 0.5,
      isIvCalciumAdministered: true,
      calciumSaltType: 'CALCIUM_CHLORIDE',
      calciumDoseGrams: 2.0,
      isGlucagonAdministered: false,
      glucagonBolusMg: 0,
      vasopressorActive: 'NOREPINEPHRINE',
      isLipidRescueConsidered: false,
    },
  },
  {
    id: 'PROPRANOLOL_SEIZURE_WIDE_QRS',
    name: 'Propranolol Overdose with Sodium Channel Blockade',
    badge: 'BB + Membrane Stabilization',
    description: '24-year-old female ingested 2.0 g Propranolol. Presenting in sinus bradycardia (HR 42 bpm), BP 76/48 mmHg, QRS 134 ms, generalized seizure, and blood glucose 62 mg/dL.',
    inputs: {
      patientAgeYears: 24,
      patientWeightKg: 55,
      toxinClass: 'BETA_BLOCKER',
      specificDrug: 'PROPRANOLOL',
      estimatedIngestionDoseMg: 2000,
      hoursPostIngestion: 2,
      isExtendedReleaseFormulation: false,
      heartRateBpm: 42,
      systolicBpMmHg: 76,
      diastolicBpMmHg: 48,
      qrsIntervalMs: 134,
      qtcIntervalMs: 480,
      bloodGlucoseMgDl: 62,
      serumPotassiumMeqL: 3.8,
      arterialPh: 7.22,
      serumLactateMmolL: 4.2,
      hasCentralVenousAccess: false,
      isHietInitiated: true,
      insulinInfusionRateUnitsKgH: 1.0,
      dextroseInfusionRateGKgH: 0.5,
      isIvCalciumAdministered: true,
      calciumSaltType: 'CALCIUM_GLUCONATE',
      calciumDoseGrams: 3.0,
      isGlucagonAdministered: true,
      glucagonBolusMg: 5,
      vasopressorActive: 'EPINEPHRINE',
      isLipidRescueConsidered: false,
    },
  },
  {
    id: 'AMLODIPINE_VASOPLEGIA_TRAP',
    name: 'Amlodipine Massive Ingestion with Vasoplegic Shock',
    badge: 'Dihydropyridine Distributive',
    description: '65-year-old male ingested 200 mg Amlodipine. Presenting with profound refractory vasodilatory shock (BP 62/34 mmHg) despite preserved heart rate (HR 88 bpm) and glucose 290 mg/dL.',
    inputs: {
      patientAgeYears: 65,
      patientWeightKg: 75,
      toxinClass: 'CCB_DIHYDROPYRIDINE',
      specificDrug: 'AMLODIPINE',
      estimatedIngestionDoseMg: 200,
      hoursPostIngestion: 6,
      isExtendedReleaseFormulation: false,
      heartRateBpm: 88,
      systolicBpMmHg: 62,
      diastolicBpMmHg: 34,
      qrsIntervalMs: 88,
      qtcIntervalMs: 440,
      bloodGlucoseMgDl: 290,
      serumPotassiumMeqL: 3.7,
      arterialPh: 7.24,
      serumLactateMmolL: 5.4,
      hasCentralVenousAccess: true,
      isHietInitiated: true,
      insulinInfusionRateUnitsKgH: 3.0,
      dextroseInfusionRateGKgH: 0.5,
      isIvCalciumAdministered: true,
      calciumSaltType: 'CALCIUM_CHLORIDE',
      calciumDoseGrams: 2.0,
      isGlucagonAdministered: false,
      glucagonBolusMg: 0,
      vasopressorActive: 'NOREPINEPHRINE',
      isLipidRescueConsidered: false,
    },
  },
  {
    id: 'CALCIUM_VESICANT_ERROR',
    name: 'Peripheral Calcium Chloride Extravasation Error',
    badge: 'Iatrogenic Tissue Hazard',
    description: 'Resuscitation scenario where 10% Calcium Chloride was infused into a peripheral hand vein without central access, triggering severe tissue extravasation danger.',
    inputs: {
      patientAgeYears: 42,
      patientWeightKg: 70,
      toxinClass: 'CCB_NON_DIHYDROPYRIDINE',
      specificDrug: 'DILTIAZEM',
      estimatedIngestionDoseMg: 1440,
      hoursPostIngestion: 4,
      isExtendedReleaseFormulation: true,
      heartRateBpm: 46,
      systolicBpMmHg: 78,
      diastolicBpMmHg: 50,
      qrsIntervalMs: 92,
      qtcIntervalMs: 450,
      bloodGlucoseMgDl: 260,
      serumPotassiumMeqL: 2.8, // Triggers hypokalemia alert!
      arterialPh: 7.26,
      serumLactateMmolL: 3.8,
      hasCentralVenousAccess: false, // Triggers peripheral CaCl2 hazard!
      isHietInitiated: true,
      insulinInfusionRateUnitsKgH: 2.0,
      dextroseInfusionRateGKgH: 0.2, // Triggers low dextrose hazard!
      isIvCalciumAdministered: true,
      calciumSaltType: 'CALCIUM_CHLORIDE',
      calciumDoseGrams: 2.0,
      isGlucagonAdministered: false,
      glucagonBolusMg: 0,
      vasopressorActive: 'NOREPINEPHRINE',
      isLipidRescueConsidered: false,
    },
  },
];
