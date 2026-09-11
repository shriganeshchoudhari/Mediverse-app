/**
 * DigoxinToxicityFabEngine.ts
 * Digoxin Overdose, Na+/K+-ATPase Inhibition, Hyperkalemia Mortality Risk,
 * DigiFab / Digibind Stoichiometric Dosing Solver, and Arrhythmia Electrophysiology.
 * Location: frontend/.gemini/skills/DigoxinToxicityFabEngine.ts
 */

export type DigoxinToxicityType = 'ACUTE_INGESTION' | 'CHRONIC_ACCUMULATION';

export type DigoxinArrhythmiaPattern =
  | 'NORMAL_SINUS_DIG_EFFECT' // Salvador Dali sagging ST scooped depression
  | 'SINUS_BRADYCARDIA_OR_EXIT_BLOCK'
  | 'JUNCTIONAL_TACHYCARDIA_WITH_AV_DISSOCIATION'
  | 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA' // Pathognomonic for digitalis toxicity
  | 'VENTRICULAR_FIBRILLATION_ASYSTOLE';

export interface DigoxinPatientInput {
  toxicityType: DigoxinToxicityType;
  patientWeightKg: number; // e.g. 40 to 140 kg
  serumDigoxinNgMl: number; // Serum Digoxin Concentration (SDC) in ng/mL (normal 0.5-0.9 ng/mL; toxic > 2.0)
  serumPotassiumMeqL: number; // Extracellular K+ in mEq/L (crucial prognostic biomarker)
  ingestedDoseMg: number; // Known acute ingested amount in mg (0 if unknown)
  estimatedGfrMlMin: number; // Renal function (affects chronic clearance)
  arrhythmia: DigoxinArrhythmiaPattern;
  cardiacArrestOrHemodynamicCollapse: boolean;
  fabAdministeredVials: number; // Digibind / DigiFab vials administered (0-40)
}

export interface DigoxinClinicalMetrics {
  isToxicityConfirmed: boolean;
  hyperkalemiaMortalityRiskPercent: number; // Smith et al. classic prognostic curve
  requiredFabVialsExact: number; // Exact calculated stoichiometrically
  recommendedFabVialsRounded: number; // Clinically rounded vials (38 mg/vial binds ~0.5 mg digoxin)
  totalFabDoseMg: number; // 38 mg per vial (DigiFab) or 40 mg (Digibind)
  postFabFreeDigoxinEstimatedNgMl: number;
  postFabTotalDigoxinAssayInterferenceWarning: boolean;
  dosingCalculationMethod: 'ACUTE_KNOWN_DOSE' | 'STEADY_STATE_SDC' | 'EMPIRIC_EMERGENCY_CODE';
  salvadorDaliScoopedSt: boolean;
  calciumAdministrationStrictlyContraindicated: boolean;
  clinicalActionChecklist: string[];
  diagnosticSummary: string;
}

export const DIGOXIN_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: DigoxinPatientInput;
}[] = [
  {
    id: 'acute-massive-suicidal-hyperkalemia',
    name: 'Acute Massive Overdose (Severe Hyperkalemia)',
    badge: 'STAT DigiFab 10-20 Vials (K+ > 5.5)',
    description: 'A 28-year-old ingests 10 mg digoxin (40 tablets of 0.25 mg). SDC is 8.5 ng/mL, serum K+ is 6.4 mEq/L due to whole-body Na+/K+-ATPase paralysis. High mortality (> 50-80%) without emergent antibody binding.',
    input: {
      toxicityType: 'ACUTE_INGESTION',
      patientWeightKg: 70,
      serumDigoxinNgMl: 8.5,
      serumPotassiumMeqL: 6.4,
      ingestedDoseMg: 10.0,
      estimatedGfrMlMin: 90,
      arrhythmia: 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    },
  },
  {
    id: 'chronic-elderly-renal-failure',
    name: 'Chronic Toxicity in Elderly CKD (Bidirectional VT)',
    badge: 'Chronic Stoichiometric Dosing',
    description: 'An 82-year-old female (55 kg) with eGFR 18 mL/min on chronic 0.125 mg daily digoxin. SDC is 4.2 ng/mL, K+ is 4.8 mEq/L. Bidirectional ventricular tachycardia and yellow-green halo visual disturbances (xanthopsia).',
    input: {
      toxicityType: 'CHRONIC_ACCUMULATION',
      patientWeightKg: 55,
      serumDigoxinNgMl: 4.2,
      serumPotassiumMeqL: 4.8,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 18,
      arrhythmia: 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    },
  },
  {
    id: 'cardiac-arrest-empiric-code',
    name: 'Refractory Cardiac Arrest (Empiric Resuscitation)',
    badge: 'STAT 20 Vials Bolus',
    description: 'Severe digoxin poisoning presenting with hemodynamic collapse / ventricular fibrillation. Serum level unknown in the field. Mandates empiric 20 vials IV push; avoid calcium gluconate ("stone heart").',
    input: {
      toxicityType: 'ACUTE_INGESTION',
      patientWeightKg: 80,
      serumDigoxinNgMl: 12.0,
      serumPotassiumMeqL: 6.8,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 60,
      arrhythmia: 'VENTRICULAR_FIBRILLATION_ASYSTOLE',
      cardiacArrestOrHemodynamicCollapse: true,
      fabAdministeredVials: 0,
    },
  },
  {
    id: 'therapeutic-digitalis-effect',
    name: 'Therapeutic Level with Salvador Dali ST Depression',
    badge: 'Dig Effect (Not Toxicity)',
    description: 'A 65-year-old on maintenance digoxin for atrial fibrillation. SDC is 0.8 ng/mL, K+ is 4.2 mEq/L. Characteristic scooped ST sagging (Salvador Dali mustache). Asymptomatic; no Fab fragments indicated.',
    input: {
      toxicityType: 'CHRONIC_ACCUMULATION',
      patientWeightKg: 75,
      serumDigoxinNgMl: 0.8,
      serumPotassiumMeqL: 4.2,
      ingestedDoseMg: 0,
      estimatedGfrMlMin: 75,
      arrhythmia: 'NORMAL_SINUS_DIG_EFFECT',
      cardiacArrestOrHemodynamicCollapse: false,
      fabAdministeredVials: 0,
    },
  },
];

/**
 * Calculates DigiFab Stoichiometry & Clinical Outcomes
 */
export function evaluateDigoxinCase(input: DigoxinPatientInput): DigoxinClinicalMetrics {
  const {
    toxicityType,
    patientWeightKg,
    serumDigoxinNgMl,
    serumPotassiumMeqL,
    ingestedDoseMg,
    arrhythmia,
    cardiacArrestOrHemodynamicCollapse,
    fabAdministeredVials,
  } = input;

  // 1. Toxicity Confirmation
  // Therapeutic range: 0.5 - 0.9 ng/mL (heart failure) or up to 1.2 ng/mL (AF rate control)
  // Toxicity typically manifests at > 2.0 ng/mL, or lower in severe hypokalemia/hypomagnesemia
  const isToxic =
    serumDigoxinNgMl > 2.0 ||
    (serumDigoxinNgMl >= 1.5 && (arrhythmia === 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA' || arrhythmia === 'JUNCTIONAL_TACHYCARDIA_WITH_AV_DISSOCIATION')) ||
    ingestedDoseMg >= 4.0;

  // 2. Hyperkalemia Mortality Risk Model (Smith / Bismuth classic correlation)
  // In acute digitalis poisoning:
  // K+ <= 5.0 -> 0% mortality with standard care
  // K+ 5.1 - 5.5 -> ~50% mortality without Fab
  // K+ > 5.5 -> ~100% historical mortality without Fab
  let mortalityRisk = 2;
  if (serumPotassiumMeqL > 5.5) {
    mortalityRisk = Math.min(95, Math.round(50 + (serumPotassiumMeqL - 5.5) * 45));
  } else if (serumPotassiumMeqL > 5.0) {
    mortalityRisk = Math.round(20 + (serumPotassiumMeqL - 5.0) * 60);
  } else if (serumPotassiumMeqL < 3.5) {
    // Hypokalemia increases myocardial sensitivity to digoxin
    mortalityRisk = 15;
  }

  // 3. DigiFab Stoichiometric Dosing Formulas
  // 1 vial DigiFab (38 mg) binds approx 0.5 mg (500 mcg) of digoxin
  let exactVials = 0;
  let method: DigoxinClinicalMetrics['dosingCalculationMethod'] = 'STEADY_STATE_SDC';

  if (cardiacArrestOrHemodynamicCollapse) {
    // Empiric emergency dosing
    method = 'EMPIRIC_EMERGENCY_CODE';
    exactVials = 20; // 10-20 vials empiric in arrest
  } else if (toxicityType === 'ACUTE_INGESTION' && ingestedDoseMg > 0) {
    // Formula 1: Based on ingested dose
    // Vials = (Ingested dose in mg * 0.80 bioavailability) / 0.5 mg per vial
    method = 'ACUTE_KNOWN_DOSE';
    exactVials = (ingestedDoseMg * 0.8) / 0.5;
  } else if (serumDigoxinNgMl > 0 && patientWeightKg > 0) {
    // Formula 2: Based on steady-state Serum Digoxin Concentration (SDC)
    // Total body load (mg) = (SDC ng/mL * 5.6 L/kg * Weight kg) / 1000
    // Vials = SDC * Weight / 100
    method = 'STEADY_STATE_SDC';
    exactVials = (serumDigoxinNgMl * patientWeightKg) / 100;
  } else {
    // Empiric stable chronic toxicity
    method = 'EMPIRIC_EMERGENCY_CODE';
    exactVials = toxicityType === 'CHRONIC_ACCUMULATION' ? 4 : 10;
  }

  // Rounded vials:
  // If exact < 1 and toxic, minimum 1 vial; round up to nearest integer
  let recVialsRounded = Math.max(isToxic ? 1 : 0, Math.ceil(exactVials));
  if (!isToxic && serumDigoxinNgMl < 1.5) {
    recVialsRounded = 0;
  }

  const totalMg = recVialsRounded * 38;

  // 4. Post-Fab Neutralization & Free vs Bound Digoxin
  // Each administered vial neutralizes up to 0.5 mg digoxin
  const mgNeutralized = fabAdministeredVials * 0.5;
  const estimatedTotalLoadMg = (serumDigoxinNgMl * 5.6 * patientWeightKg) / 1000;
  const remainingActiveLoadMg = Math.max(0, estimatedTotalLoadMg - mgNeutralized);
  const postFabFreeDig = estimatedTotalLoadMg > 0
    ? Math.round(((remainingActiveLoadMg / estimatedTotalLoadMg) * serumDigoxinNgMl) * 10) / 10
    : 0;

  // Standard immunoassay cross-reactivity warning:
  // Most commercial labs measure TOTAL digoxin (free + Fab-bound).
  // Total SDC will falsely surge or remain elevated for 1-2 weeks!
  const assayWarning = fabAdministeredVials > 0;

  // 5. Clinical Action Checklist & Warnings
  const actions: string[] = [];
  const salvadorDali = serumDigoxinNgMl >= 0.5;
  const avoidCalcium = isToxic;

  if (cardiacArrestOrHemodynamicCollapse) {
    actions.push('EMERGENCY CODE: Administer 20 vials of DigiFab IV push over 5 minutes.');
    actions.push('CRITICAL CONTRAINDICATION: Do NOT administer intravenous Calcium (Calcium Chloride / Gluconate) due to risk of refractory irreversible myocardial contraction ("Stone Heart").');
  } else if (isToxic) {
    actions.push(`Administer ${recVialsRounded} vial(s) (${totalMg} mg) of DigiFab IV infused over 30 minutes.`);
    if (serumPotassiumMeqL > 5.0) {
      actions.push(`CRITICAL HYPERKALEMIA (K+ = ${serumPotassiumMeqL} mEq/L): Marker of profound Na+/K+-ATPase blockade. DigiFab will restore pump activity and drive potassium back into cells. Avoid aggressive K+-lowering agents that cause rebound hypokalemia.`);
    }
    if (arrhythmia === 'BIDIRECTIONAL_VENTRICULAR_TACHYCARDIA') {
      actions.push('Bidirectional VT observed: Pathognomonic for digitalis toxicity due to delayed afterdepolarizations (DADs). Correct hypomagnesemia (2g IV Magnesium Sulfate).');
    }
  } else {
    actions.push('Therapeutic/sub-toxic digitalis level: No DigiFab indicated.');
    actions.push('Salvador Dali scooped ST segment reflects normal myocardial digoxin effect, not toxicity.');
  }

  if (assayWarning) {
    actions.push('POST-FAB LAB WARNING: Commercial digoxin immunoassays cross-react with Fab-bound drug. Total serum digoxin will be falsely high for 5-14 days. Do NOT use repeat total SDC to guide further Fab dosing; monitor clinical response and free digoxin if available.');
  }

  let summary = '';
  if (cardiacArrestOrHemodynamicCollapse) {
    summary = `Cardiac arrest secondary to suspected acute digoxin overdose. Empiric 20 vials DigiFab indicated STAT. Avoid calcium salts.`;
  } else if (isToxic) {
    summary = `Confirmed digitalis toxicity (SDC ${serumDigoxinNgMl} ng/mL, K+ ${serumPotassiumMeqL} mEq/L). Calculated DigiFab requirement: ${recVialsRounded} vial(s) (${totalMg} mg).`;
  } else {
    summary = `Therapeutic digitalis level (${serumDigoxinNgMl} ng/mL). Characteristic scooped ST changes represent pharmacologic effect. No antidote required.`;
  }

  return {
    isToxicityConfirmed: isToxic,
    hyperkalemiaMortalityRiskPercent: mortalityRisk,
    requiredFabVialsExact: Math.round(exactVials * 10) / 10,
    recommendedFabVialsRounded: recVialsRounded,
    totalFabDoseMg: totalMg,
    postFabFreeDigoxinEstimatedNgMl: postFabFreeDig,
    postFabTotalDigoxinAssayInterferenceWarning: assayWarning,
    dosingCalculationMethod: method,
    salvadorDaliScoopedSt: salvadorDali,
    calciumAdministrationStrictlyContraindicated: avoidCalcium,
    clinicalActionChecklist: actions,
    diagnosticSummary: summary,
  };
}
