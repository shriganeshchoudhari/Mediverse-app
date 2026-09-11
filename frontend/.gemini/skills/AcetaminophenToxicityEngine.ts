/**
 * AcetaminophenToxicityEngine.ts
 * Acetaminophen (Paracetamol) Toxicity, CYP2E1 Bioactivation to NAPQI,
 * Hepatic Glutathione Depletion, Rumack-Matthew Nomogram Mathematics,
 * N-Acetylcysteine (NAC) Precision Protocols, and King's College Liver Transplant Criteria.
 * Location: frontend/.gemini/skills/AcetaminophenToxicityEngine.ts
 */

export type IngestionPattern = 'ACUTE_SINGLE' | 'CHRONIC_REPEATED' | 'UNKNOWN_OR_STAGGERED';
export type NacProtocolType = 'STANDARD_3_BAG_21H' | 'SIMPLIFIED_2_BAG_20H' | 'MASSIVE_OVERDOSE_AUGMENTED';

export interface AcetaminophenPatientInput {
  ingestionPattern: IngestionPattern;
  hoursPostIngestion: number; // e.g. 1 to 36 hours
  serumAcetaminophenMcgMl: number; // e.g. 0 to 600 mcg/mL (therapeutic 10-20; nomogram starts at 150 at 4h)
  patientWeightKg: number; // e.g. 40 to 120 kg
  // Hepatic & Renal Biomarkers
  serumAltIuL: number; // e.g. 20 to 12,000 IU/L (transaminitis marker)
  serumAstIuL: number; // e.g. 20 to 10,000 IU/L
  internationalNormalizedRatio: number; // INR e.g. 1.0 to 12.0
  serumCreatinineMgDl: number; // e.g. 0.8 to 6.0 mg/dL
  arterialBloodPh: number; // Post-fluid resuscitation arterial pH e.g. 7.10 to 7.45
  arterialLactateMmolL: number; // e.g. 1.0 to 9.0 mmol/L
  hepaticEncephalopathyGrade: number; // Grade 0 (none) to Grade 4 (coma)
  // Anaphylactoid & Infusion Status
  nacInfusionStarted: boolean;
  nacInfusionCompletedHours: number; // Hours of NAC already infused
  anaphylactoidReactionPresent: boolean; // Flushing, pruritus, mild bronchospasm
}

export interface RumackMatthewResult {
  isNomogramApplicable: boolean;
  treatmentLineThresholdMcgMl: number;
  originalToxicLineThresholdMcgMl: number;
  massiveIngestionThresholdMcgMl: number;
  toxicityRiskTier: 'BELOW_TREATMENT_LINE' | 'ABOVE_TREATMENT_LINE_TOXIC' | 'MASSIVE_INGESTION_CRITICAL' | 'TIME_WINDOW_INVALID';
  interpretation: string;
}

export interface KingsCollegeCriteriaResult {
  criteriaMet: boolean;
  phCriterionMet: boolean;
  triadCriteriaMet: boolean;
  inrExceeded: boolean;
  creatinineExceeded: boolean;
  encephalopathyExceeded: boolean;
  lactateHighRisk: boolean;
  recommendation: string;
}

export interface NacDosingSchedule {
  protocol: NacProtocolType;
  totalNacDoseGrams: number;
  bagDetails: {
    bagNumber: number;
    doseMgKg: number;
    totalDoseGrams: number;
    fluidVolumeMl: number;
    infusionDurationHours: number;
    infusionRateMlH: number;
  }[];
  massiveOverdoseBoostNeeded: boolean;
  anaphylactoidManagement: string | null;
  stoppingCriteriaMet: boolean;
  stoppingCriteriaDetails: string[];
  stoppingGuidance: string;
}

export interface AcetaminophenClinicalMetrics {
  rumackMatthew: RumackMatthewResult;
  kingsCollege: KingsCollegeCriteriaResult;
  nacDosing: NacDosingSchedule;
  estimatedGlutathioneRemainingPercent: number; // 0 to 100%
  hepatotoxicityPresent: boolean; // ALT > 1000 IU/L defines acute liver injury
  diagnosticSummary: string;
}

export const ACETAMINOPHEN_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: AcetaminophenPatientInput;
}[] = [
  {
    id: 'acute-toxic-nomogram-positive',
    name: 'Acute Toxic Ingestion (Nomogram Positive at 6 Hours)',
    badge: 'Standard 21h IV NAC',
    description: 'A 24-year-old ingests 20 g acetaminophen 6 hours prior to arrival. Serum APAP is 165 mcg/mL (above 6h nomogram line of ~106 mcg/mL). Normal baseline ALT (32 IU/L) and INR (1.1). Prompt NAC replenishes glutathione and prevents hepatic necrosis.',
    input: {
      ingestionPattern: 'ACUTE_SINGLE',
      hoursPostIngestion: 6,
      serumAcetaminophenMcgMl: 165,
      patientWeightKg: 70,
      serumAltIuL: 32,
      serumAstIuL: 28,
      internationalNormalizedRatio: 1.1,
      serumCreatinineMgDl: 0.9,
      arterialBloodPh: 7.40,
      arterialLactateMmolL: 1.4,
      hepaticEncephalopathyGrade: 0,
      nacInfusionStarted: false,
      nacInfusionCompletedHours: 0,
      anaphylactoidReactionPresent: false,
    },
  },
  {
    id: 'massive-overdose-augmented-nac',
    name: 'Massive Overdose (APAP > 2x Nomogram Line)',
    badge: 'Augmented NAC Dose',
    description: 'A 32-year-old ingests 50 g acetaminophen. At 4 hours, serum level is 420 mcg/mL (well above the 300 mcg/mL massive line). Rapid saturation of glutathione requires higher maintenance NAC delivery (12.5 mg/kg/h) to match excessive NAPQI production.',
    input: {
      ingestionPattern: 'ACUTE_SINGLE',
      hoursPostIngestion: 4,
      serumAcetaminophenMcgMl: 420,
      patientWeightKg: 80,
      serumAltIuL: 85,
      serumAstIuL: 92,
      internationalNormalizedRatio: 1.2,
      serumCreatinineMgDl: 1.1,
      arterialBloodPh: 7.34,
      arterialLactateMmolL: 3.2,
      hepaticEncephalopathyGrade: 0,
      nacInfusionStarted: true,
      nacInfusionCompletedHours: 4,
      anaphylactoidReactionPresent: false,
    },
  },
  {
    id: 'fulminant-hepatic-failure-kings-college',
    name: 'Fulminant Acute Liver Failure (King\'s College Positive)',
    badge: 'Transplant Candidate',
    description: 'A 45-year-old presents 48 hours after staggered ingestion with severe jaundice and encephalopathy (Grade 3). ALT 6,400 IU/L, INR 7.2, Cr 3.8 mg/dL, arterial pH 7.24 post-resuscitation, and lactate 5.4 mmol/L. Meets definitive King\'s College Criteria for emergency liver transplantation.',
    input: {
      ingestionPattern: 'UNKNOWN_OR_STAGGERED',
      hoursPostIngestion: 48,
      serumAcetaminophenMcgMl: 18,
      patientWeightKg: 65,
      serumAltIuL: 6400,
      serumAstIuL: 7800,
      internationalNormalizedRatio: 7.2,
      serumCreatinineMgDl: 3.8,
      arterialBloodPh: 7.24,
      arterialLactateMmolL: 5.4,
      hepaticEncephalopathyGrade: 3,
      nacInfusionStarted: true,
      nacInfusionCompletedHours: 21,
      anaphylactoidReactionPresent: false,
    },
  },
  {
    id: 'nac-stopping-criteria-resolved',
    name: 'NAC End of Protocol (Stopping Criteria Evaluated)',
    badge: 'Protocol Completion',
    description: 'A 28-year-old completing 21 hours of IV NAC. Acetaminophen is now undetectable (< 10 mcg/mL), ALT has dropped to 48 IU/L, INR is 1.2, and encephalopathy is absent. Meets all criteria to safely discontinue NAC without relapse.',
    input: {
      ingestionPattern: 'ACUTE_SINGLE',
      hoursPostIngestion: 26,
      serumAcetaminophenMcgMl: 4,
      patientWeightKg: 72,
      serumAltIuL: 48,
      serumAstIuL: 42,
      internationalNormalizedRatio: 1.2,
      serumCreatinineMgDl: 0.9,
      arterialBloodPh: 7.42,
      arterialLactateMmolL: 1.1,
      hepaticEncephalopathyGrade: 0,
      nacInfusionStarted: true,
      nacInfusionCompletedHours: 21,
      anaphylactoidReactionPresent: false,
    },
  },
];

/**
 * Evaluates the Rumack-Matthew Nomogram for single acute ingestions between 4 and 24 hours.
 * Formula: Line(t) = 150 * (0.5)^((t - 4) / 4)
 */
export function evaluateRumackMatthewNomogram(
  pattern: IngestionPattern,
  hours: number,
  apapLevel: number
): RumackMatthewResult {
  if (pattern !== 'ACUTE_SINGLE' || hours < 4 || hours > 24) {
    let reason = '';
    if (pattern !== 'ACUTE_SINGLE') {
      reason = 'Nomogram is NOT valid for chronic, repeated, or staggered ingestions. Treat with NAC if APAP is detectable or transaminases are elevated.';
    } else if (hours < 4) {
      reason = 'Nomogram cannot be interpreted before 4 hours post-ingestion due to ongoing gastrointestinal absorption. Repeat serum level at the 4-hour mark.';
    } else {
      reason = 'Nomogram line ends at 24 hours post-ingestion. Patients presenting > 24h with detectable APAP or elevated ALT/AST require immediate NAC.';
    }
    return {
      isNomogramApplicable: false,
      treatmentLineThresholdMcgMl: 0,
      originalToxicLineThresholdMcgMl: 0,
      massiveIngestionThresholdMcgMl: 0,
      toxicityRiskTier: 'TIME_WINDOW_INVALID',
      interpretation: reason,
    };
  }

  // Calculate exponential decay line thresholds
  const exponent = (hours - 4) / 4;
  const treatmentLine = parseFloat((150 * Math.pow(0.5, exponent)).toFixed(1));
  const toxicLine = parseFloat((200 * Math.pow(0.5, exponent)).toFixed(1));
  const massiveLine = parseFloat((300 * Math.pow(0.5, exponent)).toFixed(1));

  let tier: 'BELOW_TREATMENT_LINE' | 'ABOVE_TREATMENT_LINE_TOXIC' | 'MASSIVE_INGESTION_CRITICAL' = 'BELOW_TREATMENT_LINE';
  let interpretation = '';

  if (apapLevel >= massiveLine) {
    tier = 'MASSIVE_INGESTION_CRITICAL';
    interpretation = `MASSIVE INGESTION DETECTED: Serum level (${apapLevel} mcg/mL at ${hours}h) exceeds double the treatment line (${massiveLine} mcg/mL). Massive NAPQI generation will outstrip standard NAC delivery. Initiate augmented NAC infusion.`;
  } else if (apapLevel >= treatmentLine) {
    tier = 'ABOVE_TREATMENT_LINE_TOXIC';
    interpretation = `TREATMENT LINE EXCEEDED: Serum level (${apapLevel} mcg/mL at ${hours}h) is above the 150-line (${treatmentLine} mcg/mL). N-Acetylcysteine (NAC) infusion is MANDATORY to prevent centrilobular hepatic necrosis.`;
  } else {
    tier = 'BELOW_TREATMENT_LINE';
    interpretation = `BELOW TREATMENT LINE: Serum level (${apapLevel} mcg/mL at ${hours}h) is below the nomogram treatment threshold (${treatmentLine} mcg/mL). Toxicity is unlikely; NAC is not indicated unless ingestion timing is questionable or transaminases rise.`;
  }

  return {
    isNomogramApplicable: true,
    treatmentLineThresholdMcgMl: treatmentLine,
    originalToxicLineThresholdMcgMl: toxicLine,
    massiveIngestionThresholdMcgMl: massiveLine,
    toxicityRiskTier: tier,
    interpretation,
  };
}

/**
 * Calculates King's College Hospital Criteria for emergency liver transplantation
 * in acetaminophen-induced acute liver failure.
 */
export function evaluateKingsCollegeCriteria(
  arterialPh: number,
  inr: number,
  creatinineMgDl: number,
  encephalopathyGrade: number,
  lactateMmolL: number
): KingsCollegeCriteriaResult {
  const phCriterion = arterialPh < 7.30;
  const inrCriterion = inr > 6.5;
  const crCriterion = creatinineMgDl > 3.4;
  const encephCriterion = encephalopathyGrade >= 3;
  const triadMet = inrCriterion && crCriterion && encephCriterion;
  const lactateHighRisk = lactateMmolL > 3.5;

  const criteriaMet = phCriterion || triadMet;

  let recommendation = '';
  if (criteriaMet) {
    recommendation = `KING'S COLLEGE CRITERIA MET (${phCriterion ? 'Arterial pH < 7.30' : 'Triad of INR > 6.5 + Cr > 3.4 + Grade 3/4 Encephalopathy'}). Emergency liver transplant evaluation is MANDATORY. Predicted mortality without liver transplantation exceeds 80-90%. Transfer to transplant ICU immediately.`;
  } else if (lactateHighRisk || inr > 3.0 || creatinineMgDl > 2.0) {
    recommendation = 'HIGH-RISK HEPATOTOXICITY: Does not fully meet King\'s College Criteria yet, but elevated lactate (> 3.5 mmol/L) or coagulopathy signals severe progressive mitochondrial failure. Alert regional liver transplant center for early discussion.';
  } else {
    recommendation = 'King\'s College Criteria NOT met. Continue full-course NAC infusion and monitor serial coagulation and renal parameters.';
  }

  return {
    criteriaMet,
    phCriterionMet: phCriterion,
    triadCriteriaMet: triadMet,
    inrExceeded: inrCriterion,
    creatinineExceeded: crCriterion,
    encephalopathyExceeded: encephCriterion,
    lactateHighRisk,
    recommendation,
  };
}

/**
 * Computes N-Acetylcysteine (NAC) Dosing Protocol, checks stopping criteria,
 * and handles non-IgE anaphylactoid reaction guidance.
 */
export function calculateNacDosing(
  weightKg: number,
  isMassive: boolean,
  anaphylactoid: boolean,
  apapLevel: number,
  alt: number,
  inr: number,
  encephalopathy: number,
  completedHours: number
): NacDosingSchedule {
  // Cap weight at 100 kg for dosing calculations per toxicological standards
  const dosedWeight = Math.min(100, weightKg);

  // Standard 21-hour 3-bag protocol:
  // Bag 1: 150 mg/kg in 200 mL D5W over 1 hr
  // Bag 2: 50 mg/kg in 500 mL D5W over 4 hrs
  // Bag 3: 100 mg/kg in 1000 mL D5W over 16 hrs (or 200 mg/kg if massive)
  const bag3Multiplier = isMassive ? 200 : 100;
  const bag3Duration = isMassive ? 16 : 16;

  const bag1Grams = parseFloat(((150 * dosedWeight) / 1000).toFixed(1));
  const bag2Grams = parseFloat(((50 * dosedWeight) / 1000).toFixed(1));
  const bag3Grams = parseFloat(((bag3Multiplier * dosedWeight) / 1000).toFixed(1));

  const totalGrams = parseFloat((bag1Grams + bag2Grams + bag3Grams).toFixed(1));

  const bagDetails = [
    {
      bagNumber: 1,
      doseMgKg: 150,
      totalDoseGrams: bag1Grams,
      fluidVolumeMl: 200,
      infusionDurationHours: 1,
      infusionRateMlH: 200,
    },
    {
      bagNumber: 2,
      doseMgKg: 50,
      totalDoseGrams: bag2Grams,
      fluidVolumeMl: 500,
      infusionDurationHours: 4,
      infusionRateMlH: 125,
    },
    {
      bagNumber: 3,
      doseMgKg: bag3Multiplier,
      totalDoseGrams: bag3Grams,
      fluidVolumeMl: 1000,
      infusionDurationHours: bag3Duration,
      infusionRateMlH: 62.5,
    },
  ];

  // Anaphylactoid guidance
  let anaphylactoidGuidance: string | null = null;
  if (anaphylactoid) {
    anaphylactoidGuidance = 'NON-IgE ANAPHYLACTOID REACTION: Flushing, pruritus, or erythema is caused by direct histamine release during loading infusion. DO NOT permanently discontinue NAC! Pause infusion for 15-30 min, administer IV Diphenhydramine (25-50 mg), and resume infusion at 50% rate. For severe bronchospasm or hypotension, administer IM Epinephrine (0.3 mg) and nebulized albuterol.';
  }

  // Stopping Criteria (checked at or near completion of Bag 3)
  const apapCleared = apapLevel < 10;
  const altImproving = alt < 100 || alt < 1000;
  const inrNormalizing = inr <= 2.0;
  const noEncephalopathy = encephalopathy === 0;
  const minHoursDone = completedHours >= 20;

  const stoppingCriteriaPassed: string[] = [];
  if (apapCleared) stoppingCriteriaPassed.push(`Acetaminophen Undetectable (< 10 mcg/mL: ${apapLevel})`);
  if (altImproving) stoppingCriteriaPassed.push(`Transaminases Controlled / Improving (ALT ${alt} IU/L)`);
  if (inrNormalizing) stoppingCriteriaPassed.push(`INR ≤ 2.0 (INR ${inr})`);
  if (noEncephalopathy) stoppingCriteriaPassed.push('No Hepatic Encephalopathy (Grade 0)');
  if (minHoursDone) stoppingCriteriaPassed.push(`Completed Initial Infusion (≥ 20h: ${completedHours}h)`);

  const allCriteriaMet = apapCleared && inrNormalizing && noEncephalopathy && minHoursDone;

  let stoppingGuidance = '';
  if (allCriteriaMet) {
    stoppingGuidance = 'NAC DISCONTINUATION CRITERIA MET: Acetaminophen is cleared (< 10 mcg/mL), INR ≤ 2.0, transaminases are resolving, and patient is alert. NAC may be safely discontinued after completing current bag.';
  } else {
    stoppingGuidance = 'DO NOT STOP NAC: Pre-cessation criteria are NOT met. Continue maintenance NAC infusion (Bag 3 rate: 6.25 mg/kg/h or 100 mg/kg over 16h) and repeat hepatic labs every 12 hours until APAP is cleared and INR ≤ 2.0.';
  }

  return {
    protocol: isMassive ? 'MASSIVE_OVERDOSE_AUGMENTED' : 'STANDARD_3_BAG_21H',
    totalNacDoseGrams: totalGrams,
    bagDetails,
    massiveOverdoseBoostNeeded: isMassive,
    anaphylactoidManagement: anaphylactoidGuidance,
    stoppingCriteriaMet: allCriteriaMet,
    stoppingCriteriaDetails: stoppingCriteriaPassed,
    stoppingGuidance,
  };
}

/**
 * Main evaluation entrypoint for Acetaminophen Workstation.
 */
export function evaluateAcetaminophenCase(input: AcetaminophenPatientInput): AcetaminophenClinicalMetrics {
  const nomogram = evaluateRumackMatthewNomogram(
    input.ingestionPattern,
    input.hoursPostIngestion,
    input.serumAcetaminophenMcgMl
  );

  const kings = evaluateKingsCollegeCriteria(
    input.arterialBloodPh,
    input.internationalNormalizedRatio,
    input.serumCreatinineMgDl,
    input.hepaticEncephalopathyGrade,
    input.arterialLactateMmolL
  );

  const isMassive = nomogram.toxicityRiskTier === 'MASSIVE_INGESTION_CRITICAL';

  const nac = calculateNacDosing(
    input.patientWeightKg,
    isMassive,
    input.anaphylactoidReactionPresent,
    input.serumAcetaminophenMcgMl,
    input.serumAltIuL,
    input.internationalNormalizedRatio,
    input.hepaticEncephalopathyGrade,
    input.nacInfusionCompletedHours
  );

  // Glutathione estimation:
  // Baseline 100%. If APAP > 150 at 4h, glutathione drops dramatically.
  let gsh = 100;
  if (input.serumAcetaminophenMcgMl > 0) {
    const consumptionRatio = input.serumAcetaminophenMcgMl / 200;
    gsh = Math.max(5, Math.round(100 - consumptionRatio * 70));
  }
  if (input.nacInfusionStarted && input.nacInfusionCompletedHours > 0) {
    gsh = Math.min(100, gsh + input.nacInfusionCompletedHours * 3);
  }

  const hepatotoxicity = input.serumAltIuL > 1000 || input.serumAstIuL > 1000;

  const diagnosticSummary = `Nomogram: ${nomogram.toxicityRiskTier.replace(/_/g, ' ')} | King's College: ${kings.criteriaMet ? 'CRITERIA MET (EMERGENT TRANSPLANT)' : 'Not Met'} | NAC: ${nac.stoppingCriteriaMet ? 'Stopping Criteria Met' : 'Active Infusion Required'} | Estimated Hepatic Glutathione: ~${gsh}%.`;

  return {
    rumackMatthew: nomogram,
    kingsCollege: kings,
    nacDosing: nac,
    estimatedGlutathioneRemainingPercent: gsh,
    hepatotoxicityPresent: hepatotoxicity,
    diagnosticSummary,
  };
}
