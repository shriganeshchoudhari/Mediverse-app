/**
 * ThyroidStormEngine.ts
 * Biophysical, Diagnostic & Multimodal Pharmacotherapy Engine for Thyroid Storm
 * Implements:
 * 1. Burch-Wartofsky Point Scale (BWPS) for thyrotoxic storm vs impending storm vs unlikely
 * 2. Japan Thyroid Association (Akamizu et al. 2012) Diagnostic Criteria (TS1 Definite vs TS2 Suspected)
 * 3. The Multimodal 5-Step Therapeutic Chain (Thionamide -> Inorganic Iodine -> Corticosteroids -> Beta-Blockers -> Bile Acid Sequestrants)
 * 4. Critical Safety Interlock: Wolff-Chaikoff Iodine Timing (mandatory >= 1 hour post-thionamide)
 * 5. Aspirin / Salicylate TBG displacement contraindication interlock
 * Location: frontend/.gemini/skills/ThyroidStormEngine.ts
 */

export type BwpsDiagnosticCategory =
  | 'HIGHLY_SUGGESTIVE_THYROID_STORM' // >= 45 pts
  | 'IMPENDING_THYROID_STORM'         // 25-44 pts
  | 'THYROTOXIC_STORM_UNLIKELY';      // < 25 pts

export type AkamizuCategory =
  | 'TS1_DEFINITE_THYROID_STORM'
  | 'TS2_SUSPECTED_THYROID_STORM'
  | 'NOT_THYROID_STORM';

export type ThionamideDrug = 'PTU' | 'METHIMAZOLE';
export type BetaBlockerDrug = 'PROPRANOLOL' | 'ESMOLOL' | 'DILTIAZEM_NON_BB';

export interface ThyroidStormPatientInput {
  patientAgeYears: number;
  patientWeightKg: number;
  temperatureFahrenheit: number;
  cnsDysfunction: 'NONE' | 'MILD_AGITATION' | 'MODERATE_DELIRIUM_PSYCHOSIS' | 'SEVERE_COMA_SEIZURES';
  giHepaticDysfunction: 'NONE' | 'MODERATE_DIARRHEA_NAUSEA_PAIN' | 'SEVERE_JAUNDICE';
  heartRateBpm: number;
  congestiveHeartFailure: 'NONE' | 'MILD_PEDAL_EDEMA' | 'MODERATE_BASILAR_RALES' | 'SEVERE_PULMONARY_EDEMA';
  hasAtrialFibrillation: boolean;
  hasPrecipitatingHistory: boolean; // infection, trauma, surgery, DKA, iodine contrast, radioiodine
  
  // Confirmatory Laboratory Values
  freeT4NgDl: number;      // Normal 0.8 - 1.8 ng/dL (storm typically > 4.0)
  totalT3NgDl: number;     // Normal 80 - 200 ng/dL (storm typically > 300)
  tshUiuMl: number;        // Normal 0.4 - 4.0 uIU/mL (storm typically < 0.01)
  totalBilirubinMgDl: number; // For Akamizu & hepatic dysfunction
  
  // Management & Safety Simulation Toggles
  selectedThionamide: ThionamideDrug;
  isThionamideAdministered: boolean;
  minutesElapsedSinceThionamide: number; // For Iodine Timing Interlock
  isIodineAdministered: boolean;
  isStressDoseSteroidGiven: boolean; // Hydrocortisone or Dexamethasone
  selectedBetaBlocker: BetaBlockerDrug;
  isBetaBlockerAdministered: boolean;
  isCholestyramineGiven: boolean;
  isAspirinAdministered: boolean; // Critical Contraindication Check
  hasSevereAsthmaOrCopd: boolean; // Interlock for non-selective beta-blockers
  leftVentricularEjectionFractionPercent: number; // For cardiogenic failure guardrail
}

export interface BwpsScoreResult {
  temperatureScore: number;
  cnsScore: number;
  giHepaticScore: number;
  tachycardiaScore: number;
  chfScore: number;
  afibScore: number;
  precipitantScore: number;
  totalScore: number;
  category: BwpsDiagnosticCategory;
  estimatedMortalityPercent: number;
  clinicalInterpretation: string;
}

export interface AkamizuResult {
  category: AkamizuCategory;
  meetsFreeThyroidElevation: boolean;
  cnsManifestationPresent: boolean;
  otherManifestationsCount: number;
  criteriaSummary: string;
}

export interface IodineTimingSafetyEvaluation {
  isSafeToAdministerIodine: boolean;
  minutesRemainingUntilSafe: number;
  timingWarning: string | null;
  wolffChaikoffExplanation: string;
}

export interface PharmacotherapyPlan {
  thionamideRegimen: {
    drug: ThionamideDrug;
    doseString: string;
    mechanism: string;
    rationale: string;
  };
  iodineRegimen: {
    recommended: boolean;
    timingStatus: string;
    doseString: string;
    mechanism: string;
  };
  steroidRegimen: {
    doseString: string;
    benefit: string;
  };
  betaBlockerRegimen: {
    drug: BetaBlockerDrug;
    doseString: string;
    cautionNote: string | null;
  };
  bileAcidSequestrantRegimen: {
    doseString: string;
    mechanism: string;
  };
  antipyreticSafeguard: {
    aspirinHazardDetected: boolean;
    recommendedAntipyresis: string;
    aspirinMechanismWarning: string | null;
  };
}

export interface ThyroidStormComprehensiveOutput {
  bwps: BwpsScoreResult;
  akamizu: AkamizuResult;
  iodineTiming: IodineTimingSafetyEvaluation;
  pharmacotherapy: PharmacotherapyPlan;
  safetyInterlocks: string[];
  immediateActionDirectives: string[];
  clinicalPearls: string[];
}

/**
 * 1. Calculate Burch-Wartofsky Point Scale (BWPS)
 */
export function calculateBwps(input: ThyroidStormPatientInput): BwpsScoreResult {
  // Temperature Points
  let tempPts = 0;
  const tempF = input.temperatureFahrenheit;
  if (tempF >= 104.0) tempPts = 30;
  else if (tempF >= 103.0) tempPts = 25;
  else if (tempF >= 102.0) tempPts = 20;
  else if (tempF >= 101.0) tempPts = 15;
  else if (tempF >= 100.0) tempPts = 10;
  else if (tempF >= 99.0) tempPts = 5;

  // CNS Points
  let cnsPts = 0;
  switch (input.cnsDysfunction) {
    case 'SEVERE_COMA_SEIZURES':
      cnsPts = 30;
      break;
    case 'MODERATE_DELIRIUM_PSYCHOSIS':
      cnsPts = 20;
      break;
    case 'MILD_AGITATION':
      cnsPts = 10;
      break;
    case 'NONE':
    default:
      cnsPts = 0;
      break;
  }

  // GI / Hepatic Points
  let giPts = 0;
  switch (input.giHepaticDysfunction) {
    case 'SEVERE_JAUNDICE':
      giPts = 20;
      break;
    case 'MODERATE_DIARRHEA_NAUSEA_PAIN':
      giPts = 10;
      break;
    case 'NONE':
    default:
      giPts = 0;
      break;
  }

  // Cardiovascular Tachycardia Points
  let hrPts = 0;
  const hr = input.heartRateBpm;
  if (hr >= 140) hrPts = 25;
  else if (hr >= 130) hrPts = 20;
  else if (hr >= 120) hrPts = 15;
  else if (hr >= 110) hrPts = 10;
  else if (hr >= 90) hrPts = 5;

  // Congestive Heart Failure Points
  let chfPts = 0;
  switch (input.congestiveHeartFailure) {
    case 'SEVERE_PULMONARY_EDEMA':
      chfPts = 15;
      break;
    case 'MODERATE_BASILAR_RALES':
      chfPts = 10;
      break;
    case 'MILD_PEDAL_EDEMA':
      chfPts = 5;
      break;
    case 'NONE':
    default:
      chfPts = 0;
      break;
  }

  // Atrial Fibrillation Points
  const afibPts = input.hasAtrialFibrillation ? 10 : 0;

  // Precipitating Event Points
  const precipPts = input.hasPrecipitatingHistory ? 10 : 0;

  const totalScore = tempPts + cnsPts + giPts + hrPts + chfPts + afibPts + precipPts;

  let category: BwpsDiagnosticCategory = 'THYROTOXIC_STORM_UNLIKELY';
  let mortality = 2;
  let interp = 'Burch-Wartofsky score < 25: Thyrotoxic storm is unlikely. Patient may have uncomplicated thyrotoxicosis or alternative febrile illness.';

  if (totalScore >= 45) {
    category = 'HIGHLY_SUGGESTIVE_THYROID_STORM';
    mortality = 25;
    interp = 'Burch-Wartofsky score >= 45: Highly suggestive of overt Thyroid Storm. Immediate ICU admission and five-stage multimodal pharmacotherapy mandated.';
  } else if (totalScore >= 25) {
    category = 'IMPENDING_THYROID_STORM';
    mortality = 10;
    interp = 'Burch-Wartofsky score 25-44: Suggests impending thyroid storm or decompensated thyrotoxicosis. Aggressive intervention required to prevent progression.';
  }

  return {
    temperatureScore: tempPts,
    cnsScore: cnsPts,
    giHepaticScore: giPts,
    tachycardiaScore: hrPts,
    chfScore: chfPts,
    afibScore: afibPts,
    precipitantScore: precipPts,
    totalScore,
    category,
    estimatedMortalityPercent: mortality,
    clinicalInterpretation: interp,
  };
}

/**
 * 2. Calculate Japan Thyroid Association (Akamizu et al. 2012) Diagnostic Criteria
 */
export function calculateAkamizu(input: ThyroidStormPatientInput): AkamizuResult {
  const meetsFreeThyroid = input.freeT4NgDl > 1.8 || input.totalT3NgDl > 200 || input.tshUiuMl < 0.1;
  const cnsPresent = input.cnsDysfunction !== 'NONE';

  let otherCount = 0;
  // 1. Fever (>= 38 C / 100.4 F)
  if (input.temperatureFahrenheit >= 100.4) otherCount++;
  // 2. Tachycardia (>= 130 bpm)
  if (input.heartRateBpm >= 130) otherCount++;
  // 3. CHF or pulmonary edema
  if (input.congestiveHeartFailure === 'MODERATE_BASILAR_RALES' || input.congestiveHeartFailure === 'SEVERE_PULMONARY_EDEMA') otherCount++;
  // 4. GI or hepatic dysfunction
  if (input.giHepaticDysfunction !== 'NONE' || input.totalBilirubinMgDl >= 3.0) otherCount++;

  let category: AkamizuCategory = 'NOT_THYROID_STORM';
  let summary = 'Does not satisfy Japan Thyroid Association diagnostic criteria for thyroid storm.';

  if (meetsFreeThyroid) {
    if (cnsPresent && otherCount >= 1) {
      category = 'TS1_DEFINITE_THYROID_STORM';
      summary = 'Meets TS1 (Definite Thyroid Storm): Thyrotoxicosis + Central Nervous System disturbance + at least 1 other organ manifestation.';
    } else if (otherCount >= 3) {
      category = 'TS1_DEFINITE_THYROID_STORM';
      summary = 'Meets TS1 (Definite Thyroid Storm): Thyrotoxicosis + at least 3 major non-CNS organ manifestations (Fever, Tachycardia, CHF, GI/Hepatic).';
    } else if (cnsPresent || otherCount >= 2) {
      category = 'TS2_SUSPECTED_THYROID_STORM';
      summary = 'Meets TS2 (Suspected Thyroid Storm): Thyrotoxicosis with CNS disturbance alone or combination of 2 organ manifestations.';
    }
  }

  return {
    category,
    meetsFreeThyroidElevation: meetsFreeThyroid,
    cnsManifestationPresent: cnsPresent,
    otherManifestationsCount: otherCount,
    criteriaSummary: summary,
  };
}

/**
 * 3. Evaluate Iodine Timing Interlock (Wolff-Chaikoff Effect)
 */
export function evaluateIodineTiming(input: ThyroidStormPatientInput): IodineTimingSafetyEvaluation {
  const explanation = 'Inorganic iodine blocks preformed thyroid hormone release via the Wolff-Chaikoff effect. However, if administered before or simultaneously with a thionamide (PTU or Methimazole), the iodine acts as substrate (Jod-Basedow effect), stimulating accelerated de novo thyroid hormone synthesis and dangerously exacerbating the storm.';

  if (!input.isThionamideAdministered) {
    return {
      isSafeToAdministerIodine: false,
      minutesRemainingUntilSafe: 60,
      timingWarning: 'CRITICAL INTERLOCK: THIONAMIDE NOT ADMINISTERED. Giving iodine now will fuel synthesis of lethal amounts of thyroid hormone via the Jod-Basedow phenomenon. Administer PTU or Methimazole first, then wait at least 60 minutes.',
      wolffChaikoffExplanation: explanation,
    };
  }

  if (input.minutesElapsedSinceThionamide < 60) {
    const remaining = 60 - input.minutesElapsedSinceThionamide;
    return {
      isSafeToAdministerIodine: false,
      minutesRemainingUntilSafe: remaining,
      timingWarning:
        'TIMING HAZARD: Only ' +
        input.minutesElapsedSinceThionamide +
        ' minutes elapsed since thionamide. Wait ' +
        remaining +
        ' more minutes for complete follicular organification blockade before infusing iodine.',
      wolffChaikoffExplanation: explanation,
    };
  }

  return {
    isSafeToAdministerIodine: true,
    minutesRemainingUntilSafe: 0,
    timingWarning: null,
    wolffChaikoffExplanation: explanation,
  };
}

/**
 * 4. Generate Multimodal Pharmacotherapy Plan
 */
export function generatePharmacotherapyPlan(input: ThyroidStormPatientInput): PharmacotherapyPlan {
  const isPtu = input.selectedThionamide === 'PTU';

  const thionamideRegimen = {
    drug: input.selectedThionamide,
    doseString: isPtu
      ? 'Propylthiouracil (PTU) 500-1000 mg PO/NG/PR loading, then 200-250 mg q4h'
      : 'Methimazole (MMI) 20-30 mg PO/NG q4-6h (maximum 120 mg/day)',
    mechanism: isPtu
      ? 'Dual action: Inhibits thyroid peroxidase (TPO) to block organification AND inhibits peripheral 5-prime-deiodinase (blocks T4 to T3 conversion by 20-30%).'
      : 'Inhibits thyroid peroxidase (TPO) to block new thyroid hormone synthesis; longer duration of action than PTU but lacks peripheral deiodinase inhibition.',
    rationale: isPtu
      ? 'PTU is the preferred first-line thionamide in acute thyroid storm due to immediate inhibition of peripheral T4 to T3 conversion.'
      : 'Methimazole has lower risk of acute hepatic necrosis compared to PTU, preferred if baseline transaminases/bilirubin are markedly elevated without encephalopathy.',
  };

  const iodineTiming = evaluateIodineTiming(input);
  const iodineRegimen = {
    recommended: true,
    timingStatus: iodineTiming.isSafeToAdministerIodine
      ? 'SAFE TO ADMINISTER (>= 60 min post-thionamide)'
      : 'HOLD IODINE (' + iodineTiming.minutesRemainingUntilSafe + ' min delay required)',
    doseString: 'Saturated Solution of Potassium Iodide (SSKI) 5 drops PO q6h OR Lugols Solution 8-10 drops PO q6-8h',
    mechanism: 'Wolff-Chaikoff effect: acutely downregulates iodination and blocks proteolytic release of preformed T4/T3 from colloid into circulation.',
  };

  const steroidRegimen = {
    doseString: 'Hydrocortisone 100 mg IV q8h OR Dexamethasone 2 mg IV q6h',
    benefit: 'Inhibits peripheral T4 to T3 conversion, suppresses vasomotor instability, and treats relative adrenal exhaustion precipitated by hypermetabolic cortisol clearance.',
  };

  let bbCaution: string | null = null;
  let bbDose = 'Propranolol 60-80 mg PO q4-6h OR 1-2 mg IV slow push q10-15m (titrated to HR < 100 bpm)';

  if (input.selectedBetaBlocker === 'ESMOLOL') {
    bbDose = 'Esmolol 500 mcg/kg IV loading over 1 min, then 50-200 mcg/kg/min infusion';
    bbCaution = 'Preferred in ICU settings with invasive hemodynamics or borderline cardiac reserve due to rapid 9-minute half-life.';
  } else if (input.selectedBetaBlocker === 'DILTIAZEM_NON_BB') {
    bbDose = 'Diltiazem 0.25 mg/kg IV bolus over 2 min, then 5-15 mg/h continuous infusion';
    bbCaution = 'Non-dihydropyridine calcium channel blocker used when beta-blockers are strictly contraindicated (severe bronchospasm / refractory asthma).';
  } else {
    if (input.hasSevereAsthmaOrCopd) {
      bbCaution = 'WARNING: Non-selective beta-blockade (Propranolol) can induce fatal bronchospasm in active asthma. Switch to cardioselective Esmolol or Diltiazem.';
    } else if (input.leftVentricularEjectionFractionPercent < 35 && input.congestiveHeartFailure === 'SEVERE_PULMONARY_EDEMA') {
      bbCaution = 'CAUTION: High-dose Propranolol may precipitate low-output cardiogenic shock in decompensated heart failure. Titrate ultra-short acting Esmolol carefully.';
    }
  }

  const betaBlockerRegimen = {
    drug: input.selectedBetaBlocker,
    doseString: bbDose,
    cautionNote: bbCaution,
  };

  const bileAcidSequestrantRegimen = {
    doseString: 'Cholestyramine 4 g PO QID (or Colestipol 10 g PO BID)',
    mechanism: 'Binds free T4 and T3 in the gut lumen, interrupting enterohepatic circulation and increasing thyroid hormone fecal excretion by 50%.',
  };

  const antipyreticSafeguard = {
    aspirinHazardDetected: input.isAspirinAdministered,
    recommendedAntipyresis: 'Acetaminophen (Paracetamol) 650-1000 mg PO/PR q4-6h + Passive external cooling (cooling blankets, ice packs to axillae/groin).',
    aspirinMechanismWarning: input.isAspirinAdministered
      ? 'LETHAL CONTRAINDICATION: Aspirin (salicylates) aggressively displaces T4 and T3 from Thyroxine-Binding Globulin (TBG) and transthyretin, dramatically increasing free bioavailable hormone levels and triggering cardiovascular arrest. DISCONTINUE ASPIRIN IMMEDIATELY!'
      : null,
  };

  return {
    thionamideRegimen,
    iodineRegimen,
    steroidRegimen,
    betaBlockerRegimen,
    bileAcidSequestrantRegimen,
    antipyreticSafeguard,
  };
}

/**
 * 5. Comprehensive Thyroid Storm Evaluation
 */
export function performThyroidStormEvaluation(input: ThyroidStormPatientInput): ThyroidStormComprehensiveOutput {
  const bwps = calculateBwps(input);
  const akamizu = calculateAkamizu(input);
  const iodineTiming = evaluateIodineTiming(input);
  const pharmacotherapy = generatePharmacotherapyPlan(input);

  const safetyInterlocks: string[] = [];

  // Interlock 1: Aspirin contraindication
  if (input.isAspirinAdministered) {
    safetyInterlocks.push('CRITICAL HAZARD: Aspirin administered in thyrotoxic storm. Salicylates displace T4/T3 from TBG, spiking free active hormone concentrations. Stop aspirin and switch to acetaminophen.');
  }

  // Interlock 2: Iodine given before thionamide or < 60 min
  if (input.isIodineAdministered && !iodineTiming.isSafeToAdministerIodine) {
    safetyInterlocks.push(iodineTiming.timingWarning || 'CRITICAL HAZARD: Iodine given without adequate prior thionamide blockade (Jod-Basedow hazard).');
  }

  // Interlock 3: Steroid omission
  if (!input.isStressDoseSteroidGiven && bwps.totalScore >= 25) {
    safetyInterlocks.push('OMISSION ALERT: Stress-dose corticosteroids not yet given. Hypermetabolism accelerates cortisol clearance; failure to administer hydrocortisone risks concurrent fatal adrenal collapse.');
  }

  // Interlock 4: Propranolol in severe asthma
  if (input.selectedBetaBlocker === 'PROPRANOLOL' && input.hasSevereAsthmaOrCopd) {
    safetyInterlocks.push('PHARMACOLOGIC CONTRAINDICATION: Propranolol is a non-selective beta-blocker (beta-1 + beta-2) and may trigger life-threatening bronchospasm. Switch to Esmolol or Diltiazem.');
  }

  const immediateActionDirectives = [
    'Secure ABCs and establish continuous cardiac telemetry and pulse oximetry in an Intensive Care Unit (ICU).',
    'Administer PTU 500-1000 mg loading PO/NG (or Methimazole 20-30 mg) immediately to block thyroid peroxidase synthesis.',
    'Administer Hydrocortisone 100 mg IV q8h to blunt peripheral T4-to-T3 conversion and safeguard against adrenal exhaustion.',
    'Administer Propranolol 60-80 mg PO q4h (or Esmolol infusion) targeting heart rate < 100 bpm with continuous hemodynamic monitoring.',
    'WAIT AT LEAST 60 MINUTES after thionamide before giving SSKI (5 drops q6h) to avoid the Jod-Basedow substrate phenomenon.',
    'Initiate Cholestyramine 4 g PO QID to interrupt enterohepatic recirculation of thyroid hormone.',
    'Cooling protocol: Use Acetaminophen and cooling blankets. Strictly avoid Aspirin / Salicylates due to TBG displacement risk.',
  ];

  const clinicalPearls = [
    'ATA Guidelines: PTU is superior to Methimazole in acute thyroid storm specifically because it inhibits type 1 5-prime-deiodinase, rapidly reducing circulating active T3 by up to 30%.',
    'The 1-Hour Iodine Rule: Never give iodine before or concurrently with thionamides. Unblocked follicular cells will rapidly incorporate iodine into new thyroid hormone, causing paradoxical clinical collapse.',
    'Aspirin Toxicity Paradox: Salicylates compete for TBG binding sites, acutely doubling free T4/T3. Acetaminophen is the only approved antipyretic for thyrotoxic hyperthermia.',
    'High-Output vs Low-Output Failure: Thyroid storm creates hyperadrenergic high-output heart failure; however, tachymyopathy and prolonged metabolic demand can culminate in low-output cardiogenic shock.',
    'Cholestyramine Synergy: Thyroid hormones undergo extensive enterohepatic circulation; oral bile acid sequestrants reduce serum T4 and T3 concentrations 2-3 times faster than thionamides alone.',
  ];

  return {
    bwps,
    akamizu,
    iodineTiming,
    pharmacotherapy,
    safetyInterlocks,
    immediateActionDirectives,
    clinicalPearls,
  };
}

/**
 * 6. Clinical Presets for Real-World Scenarios
 */
export interface ThyroidStormPreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  inputs: ThyroidStormPatientInput;
}

export const THYROID_STORM_PRESETS: ThyroidStormPreset[] = [
  {
    id: 'CLASSICAL_SEVERE_STORM',
    name: 'Classical Severe Thyroid Storm (BWPS = 75)',
    badge: 'Overt Storm (TS1)',
    description: '34-year-old female with Graves disease presenting with 104.2 F fever, severe delirium, AFib with RVR at 162 bpm, vomiting, and jaundice post-dental abscess.',
    inputs: {
      patientAgeYears: 34,
      patientWeightKg: 58,
      temperatureFahrenheit: 104.2,
      cnsDysfunction: 'MODERATE_DELIRIUM_PSYCHOSIS',
      giHepaticDysfunction: 'SEVERE_JAUNDICE',
      heartRateBpm: 162,
      congestiveHeartFailure: 'MODERATE_BASILAR_RALES',
      hasAtrialFibrillation: true,
      hasPrecipitatingHistory: true,
      freeT4NgDl: 6.8,
      totalT3NgDl: 480,
      tshUiuMl: 0.005,
      totalBilirubinMgDl: 3.8,
      selectedThionamide: 'PTU',
      isThionamideAdministered: true,
      minutesElapsedSinceThionamide: 75,
      isIodineAdministered: true,
      isStressDoseSteroidGiven: true,
      selectedBetaBlocker: 'PROPRANOLOL',
      isBetaBlockerAdministered: true,
      isCholestyramineGiven: true,
      isAspirinAdministered: false,
      hasSevereAsthmaOrCopd: false,
      leftVentricularEjectionFractionPercent: 50,
    },
  },
  {
    id: 'PREMATURE_IODINE_TRAP',
    name: 'Premature Iodine Administration Trap',
    badge: 'Jod-Basedow Hazard',
    description: 'Emergency scenario where inorganic iodine was ordered concurrently with thionamide without waiting 60 minutes, risking accelerated hormone release.',
    inputs: {
      patientAgeYears: 48,
      patientWeightKg: 72,
      temperatureFahrenheit: 102.4,
      cnsDysfunction: 'MILD_AGITATION',
      giHepaticDysfunction: 'MODERATE_DIARRHEA_NAUSEA_PAIN',
      heartRateBpm: 138,
      congestiveHeartFailure: 'MILD_PEDAL_EDEMA',
      hasAtrialFibrillation: false,
      hasPrecipitatingHistory: true,
      freeT4NgDl: 5.2,
      totalT3NgDl: 390,
      tshUiuMl: 0.01,
      totalBilirubinMgDl: 1.6,
      selectedThionamide: 'PTU',
      isThionamideAdministered: true,
      minutesElapsedSinceThionamide: 15,
      isIodineAdministered: true, // Triggers interlock!
      isStressDoseSteroidGiven: true,
      selectedBetaBlocker: 'PROPRANOLOL',
      isBetaBlockerAdministered: true,
      isCholestyramineGiven: false,
      isAspirinAdministered: false,
      hasSevereAsthmaOrCopd: false,
      leftVentricularEjectionFractionPercent: 55,
    },
  },
  {
    id: 'ASPIRIN_TBG_DISPLACEMENT',
    name: 'Iatrogenic Aspirin TBG Displacement Emergency',
    badge: 'Lethal Antipyretic Error',
    description: 'Patient treated with high-dose aspirin for hyperthermia, causing massive unbinding of T4/T3 from TBG and sudden hemodynamic decompensation.',
    inputs: {
      patientAgeYears: 29,
      patientWeightKg: 64,
      temperatureFahrenheit: 103.5,
      cnsDysfunction: 'SEVERE_COMA_SEIZURES',
      giHepaticDysfunction: 'MODERATE_DIARRHEA_NAUSEA_PAIN',
      heartRateBpm: 150,
      congestiveHeartFailure: 'SEVERE_PULMONARY_EDEMA',
      hasAtrialFibrillation: true,
      hasPrecipitatingHistory: true,
      freeT4NgDl: 8.4,
      totalT3NgDl: 550,
      tshUiuMl: 0.002,
      totalBilirubinMgDl: 2.1,
      selectedThionamide: 'PTU',
      isThionamideAdministered: true,
      minutesElapsedSinceThionamide: 90,
      isIodineAdministered: true,
      isStressDoseSteroidGiven: false, // Triggers adrenal interlock
      selectedBetaBlocker: 'PROPRANOLOL',
      isBetaBlockerAdministered: true,
      isCholestyramineGiven: true,
      isAspirinAdministered: true, // Triggers Aspirin interlock
      hasSevereAsthmaOrCopd: false,
      leftVentricularEjectionFractionPercent: 32,
    },
  },
  {
    id: 'ASTHMA_CARDIAC_GUARDRAIL',
    name: 'Severe Asthma & Acute Pulmonary Edema Guardrail',
    badge: 'Esmolol / Diltiazem Indication',
    description: 'Patient in impending thyroid storm with active severe asthma and pulmonary edema, where Propranolol is contraindicated and short-acting titration is required.',
    inputs: {
      patientAgeYears: 56,
      patientWeightKg: 80,
      temperatureFahrenheit: 101.8,
      cnsDysfunction: 'MILD_AGITATION',
      giHepaticDysfunction: 'NONE',
      heartRateBpm: 132,
      congestiveHeartFailure: 'SEVERE_PULMONARY_EDEMA',
      hasAtrialFibrillation: false,
      hasPrecipitatingHistory: true,
      freeT4NgDl: 4.5,
      totalT3NgDl: 310,
      tshUiuMl: 0.02,
      totalBilirubinMgDl: 1.1,
      selectedThionamide: 'METHIMAZOLE',
      isThionamideAdministered: true,
      minutesElapsedSinceThionamide: 80,
      isIodineAdministered: true,
      isStressDoseSteroidGiven: true,
      selectedBetaBlocker: 'ESMOLOL',
      isBetaBlockerAdministered: true,
      isCholestyramineGiven: true,
      isAspirinAdministered: false,
      hasSevereAsthmaOrCopd: true,
      leftVentricularEjectionFractionPercent: 30,
    },
  },
];
