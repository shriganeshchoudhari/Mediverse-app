/**
 * AcutePancreatitisEngine.ts
 * Acute Pancreatitis Severity Stratification, Revised Atlanta Classification (2012),
 * Modified Marshall Organ Failure Scoring, BISAP & Ranson Mortality Predictors,
 * WATERFALL Goal-Directed Fluid Resuscitation, and Antimicrobial Stewardship Engine.
 * Location: frontend/.gemini/skills/AcutePancreatitisEngine.ts
 */

export type AtlantaSeverity = 'MILD' | 'MODERATELY_SEVERE' | 'SEVERE';
export type ResuscitationFluidType = 'LACTATED_RINGERS' | 'NORMAL_SALINE' | 'BALANCED_CRYSTALLOID_PLASMA_LYTE';

export interface AcutePancreatitisPatientInput {
  // Diagnostic Triad
  typicalEpigastricPain: boolean;
  serumLipaseUlnRatio: number; // e.g. 1.0 to 15.0 x ULN (diagnostic >= 3.0)
  imagingConsistent: boolean; // CT/MRI/US consistent with pancreatitis
  // Modified Marshall Parameters
  pao2Fio2Ratio: number; // e.g. 80 to 480 (> 400=0, 301-400=1, 201-300=2, 101-200=3, <= 101=4)
  serumCreatinineMgDl: number; // e.g. 0.8 to 6.0 mg/dL (<= 1.4=0, 1.5-1.8=1, 1.9-3.5=2, 3.6-4.9=3, >= 5.0=4)
  systolicBpMmHg: number; // e.g. 70 to 150 mmHg
  systolicBpFluidResponsive: boolean; // Does SBP increase > 90 with fluid challenge?
  arterialBloodPh: number; // e.g. 7.10 to 7.45
  organFailureDurationHours: number; // < 48 hours = transient; >= 48 hours = persistent
  // Complications
  localComplicationsPresent: boolean; // Fluid collection, acute necrotic collection, pseudocyst
  systemicComorbidityExacerbation: boolean; // Exacerbation of preexisting CAD, COPD, CKD
  infectedPancreaticNecrosisSuspected: boolean; // Extraluminal gas on CT or positive FNA
  // BISAP Score Components
  serumBunMgDl: number; // > 25 mg/dL (1 pt)
  gcsScore: number; // < 15 impaired mental status (1 pt)
  sirsCriteriaMetCount: number; // Temp, HR > 90, RR > 20/PaCO2 < 32, WBC < 4k or > 12k (>= 2 criteria = 1 pt)
  patientAgeYears: number; // > 60 years (1 pt)
  pleuralEffusionPresent: boolean; // Pleural effusion on CXR/CT (1 pt)
  // Laboratory & Hemodynamics for Resuscitation
  hematocritPercent: number; // > 44% hemoconcentration marker
  patientWeightKg: number; // e.g. 50 to 120 kg
  hourlyUrineOutputMlKgH: number; // Normal >= 0.5 mL/kg/h
  clinicalFluidOverloadSigns: boolean; // Bibasilar rales, rising O2 requirement, peripheral edema
  activeHourlyInfusionMlH: number; // Active IV rate mL/h
  selectedFluidType: ResuscitationFluidType;
}

export interface MarshallScoreDetails {
  respiratoryScore: number;
  renalScore: number;
  cardiovascularScore: number;
  totalMarshallScore: number;
  hasOrganFailure: boolean; // Score >= 2 in any domain
  organFailureDomains: string[];
}

export interface AcutePancreatitisClinicalMetrics {
  diagnosticTriadMet: boolean;
  triadCriteriaCount: number;
  marshall: MarshallScoreDetails;
  atlantaClassification: AtlantaSeverity;
  bisapScore: number;
  bisapMortalityPercent: number;
  // Resuscitation Strategy
  isHemoconcentrated: boolean;
  fluidResuscitationProtocol: {
    recommendedFluid: ResuscitationFluidType;
    recommendedBolusMl: number;
    recommendedMaintenanceMlH: number;
    fluidOverloadRisk: 'LOW' | 'MODERATE' | 'HIGH_OVERLOAD_DETECTED';
    guidance: string;
  };
  // Antimicrobial Stewardship
  antibioticIndication: {
    indicated: boolean;
    rationale: string;
  };
  diagnosticSummary: string;
}

export const PANCREATITIS_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: AcutePancreatitisPatientInput;
}[] = [
  {
    id: 'mild-interstitial-edematous',
    name: 'Mild Interstitial Edematous Pancreatitis',
    badge: 'Standard Floor Care',
    description: 'A 42-year-old with gallstone pancreatitis presenting with severe epigastric pain and lipase 8x ULN. No organ failure (Marshall 0), BISAP 0, Hct 39%, BUN 14. Responsive to gentle hydration without ICU admission.',
    input: {
      typicalEpigastricPain: true,
      serumLipaseUlnRatio: 8.5,
      imagingConsistent: true,
      pao2Fio2Ratio: 440,
      serumCreatinineMgDl: 0.9,
      systolicBpMmHg: 124,
      systolicBpFluidResponsive: true,
      arterialBloodPh: 7.41,
      organFailureDurationHours: 0,
      localComplicationsPresent: false,
      systemicComorbidityExacerbation: false,
      infectedPancreaticNecrosisSuspected: false,
      serumBunMgDl: 14,
      gcsScore: 15,
      sirsCriteriaMetCount: 1,
      patientAgeYears: 42,
      pleuralEffusionPresent: false,
      hematocritPercent: 39,
      patientWeightKg: 75,
      hourlyUrineOutputMlKgH: 0.8,
      clinicalFluidOverloadSigns: false,
      activeHourlyInfusionMlH: 120,
      selectedFluidType: 'LACTATED_RINGERS',
    },
  },
  {
    id: 'severe-necrotizing-persistent-failure',
    name: 'Severe Necrotizing Pancreatitis with Persistent Failure',
    badge: 'ICU Critical Care',
    description: 'A 64-year-old presenting with necrotizing pancreatitis, PaO2/FiO2 180 (Score 3), Cr 2.4 (Score 2), SBP 82 requiring vasopressors (Score 2), persistent organ failure > 48h (Atlanta Severe). BISAP 4, hemoconcentrated (Hct 48%, BUN 38).',
    input: {
      typicalEpigastricPain: true,
      serumLipaseUlnRatio: 12.0,
      imagingConsistent: true,
      pao2Fio2Ratio: 180,
      serumCreatinineMgDl: 2.4,
      systolicBpMmHg: 82,
      systolicBpFluidResponsive: false,
      arterialBloodPh: 7.28,
      organFailureDurationHours: 54,
      localComplicationsPresent: true,
      systemicComorbidityExacerbation: true,
      infectedPancreaticNecrosisSuspected: false,
      serumBunMgDl: 38,
      gcsScore: 13,
      sirsCriteriaMetCount: 3,
      patientAgeYears: 64,
      pleuralEffusionPresent: true,
      hematocritPercent: 48,
      patientWeightKg: 80,
      hourlyUrineOutputMlKgH: 0.3,
      clinicalFluidOverloadSigns: false,
      activeHourlyInfusionMlH: 150,
      selectedFluidType: 'LACTATED_RINGERS',
    },
  },
  {
    id: 'waterfall-iatrogenic-overload',
    name: 'Iatrogenic Fluid Overload (WATERFALL Trial Caution)',
    badge: 'Fluid Overload Alert',
    description: 'A 58-year-old received aggressive fluid resuscitation (350 mL/h + multiple boluses). Developed bibasilar crackles, peripheral edema, new oxygen requirement, and normal saline hyperchloremic acidosis. Illustrates WATERFALL trial harm from unmonitored fluid overloading.',
    input: {
      typicalEpigastricPain: true,
      serumLipaseUlnRatio: 5.2,
      imagingConsistent: true,
      pao2Fio2Ratio: 280,
      serumCreatinineMgDl: 1.1,
      systolicBpMmHg: 136,
      systolicBpFluidResponsive: true,
      arterialBloodPh: 7.31,
      organFailureDurationHours: 12,
      localComplicationsPresent: false,
      systemicComorbidityExacerbation: false,
      infectedPancreaticNecrosisSuspected: false,
      serumBunMgDl: 16,
      gcsScore: 15,
      sirsCriteriaMetCount: 1,
      patientAgeYears: 58,
      pleuralEffusionPresent: true,
      hematocritPercent: 33,
      patientWeightKg: 70,
      hourlyUrineOutputMlKgH: 1.2,
      clinicalFluidOverloadSigns: true,
      activeHourlyInfusionMlH: 350,
      selectedFluidType: 'NORMAL_SALINE',
    },
  },
  {
    id: 'infected-pancreatic-necrosis',
    name: 'Infected Pancreatic Necrosis with Sepsis',
    badge: 'Targeted Antibiotics Indicated',
    description: 'A 68-year-old on Day 14 of necrotizing pancreatitis develops high spiking fevers, leukocytosis (24,000), worsening shock, and CT showing extraluminal gas bubbles in the peripancreatic necrosis. Warranted carbapenem therapy and step-up drainage.',
    input: {
      typicalEpigastricPain: true,
      serumLipaseUlnRatio: 4.1,
      imagingConsistent: true,
      pao2Fio2Ratio: 250,
      serumCreatinineMgDl: 2.1,
      systolicBpMmHg: 88,
      systolicBpFluidResponsive: true,
      arterialBloodPh: 7.30,
      organFailureDurationHours: 24,
      localComplicationsPresent: true,
      systemicComorbidityExacerbation: true,
      infectedPancreaticNecrosisSuspected: true,
      serumBunMgDl: 32,
      gcsScore: 14,
      sirsCriteriaMetCount: 4,
      patientAgeYears: 68,
      pleuralEffusionPresent: true,
      hematocritPercent: 37,
      patientWeightKg: 85,
      hourlyUrineOutputMlKgH: 0.45,
      clinicalFluidOverloadSigns: false,
      activeHourlyInfusionMlH: 175,
      selectedFluidType: 'LACTATED_RINGERS',
    },
  },
];

/**
 * Calculates Modified Marshall Organ Failure score for Respiratory, Renal, and Cardiovascular systems.
 * A score >= 2 in any domain indicates organ failure.
 */
export function calculateModifiedMarshallScore(
  pao2Fio2: number,
  creatinine: number,
  sbp: number,
  fluidResponsive: boolean,
  ph: number
): MarshallScoreDetails {
  // Respiratory
  let respScore = 0;
  if (pao2Fio2 <= 101) respScore = 4;
  else if (pao2Fio2 <= 200) respScore = 3;
  else if (pao2Fio2 <= 300) respScore = 2;
  else if (pao2Fio2 <= 400) respScore = 1;

  // Renal
  let renalScore = 0;
  if (creatinine >= 5.0) renalScore = 4;
  else if (creatinine >= 3.6) renalScore = 3;
  else if (creatinine >= 1.9) renalScore = 2;
  else if (creatinine >= 1.5) renalScore = 1;

  // Cardiovascular
  let cvScore = 0;
  if (sbp < 90) {
    if (ph < 7.20) cvScore = 4;
    else if (ph < 7.35) cvScore = 3;
    else if (!fluidResponsive) cvScore = 2;
    else cvScore = 1;
  }

  const domains: string[] = [];
  if (respScore >= 2) domains.push(`Respiratory (PF ${pao2Fio2}, Score ${respScore})`);
  if (renalScore >= 2) domains.push(`Renal (Cr ${creatinine} mg/dL, Score ${renalScore})`);
  if (cvScore >= 2) domains.push(`Cardiovascular (SBP ${sbp} mmHg, Score ${cvScore})`);

  const total = respScore + renalScore + cvScore;
  const hasFailure = respScore >= 2 || renalScore >= 2 || cvScore >= 2;

  return {
    respiratoryScore: respScore,
    renalScore: renalScore,
    cardiovascularScore: cvScore,
    totalMarshallScore: total,
    hasOrganFailure: hasFailure,
    organFailureDomains: domains,
  };
}

/**
 * Determines Revised Atlanta Classification (2012):
 * - Mild: No organ failure, no local or systemic complications.
 * - Moderately Severe: Transient organ failure (< 48h) and/or local/systemic complications.
 * - Severe: Persistent organ failure (>= 48h) in >= 1 organ system.
 */
export function determineAtlantaClassification(
  hasOrganFailure: boolean,
  durationHours: number,
  localComplications: boolean,
  systemicComorbidity: boolean
): AtlantaSeverity {
  if (hasOrganFailure && durationHours >= 48) {
    return 'SEVERE';
  }
  if (hasOrganFailure && durationHours < 48) {
    return 'MODERATELY_SEVERE';
  }
  if (localComplications || systemicComorbidity) {
    return 'MODERATELY_SEVERE';
  }
  return 'MILD';
}

/**
 * Calculates BISAP (Bedside Index for Severity in Acute Pancreatitis) score (0-5)
 * and estimated in-hospital mortality.
 */
export function calculateBisapScore(
  bun: number,
  gcs: number,
  sirsCount: number,
  age: number,
  pleuralEffusion: boolean
): { score: number; mortalityPercent: number } {
  let score = 0;
  if (bun > 25) score += 1;
  if (gcs < 15) score += 1;
  if (sirsCount >= 2) score += 1;
  if (age > 60) score += 1;
  if (pleuralEffusion) score += 1;

  // Mortality estimate according to Wu et al. (Gut 2008)
  const mortalityMap: Record<number, number> = {
    0: 0.1,
    1: 0.4,
    2: 1.6,
    3: 5.3,
    4: 12.7,
    5: 22.5,
  };

  return {
    score,
    mortalityPercent: mortalityMap[score] || 0.1,
  };
}

/**
 * Evaluates WATERFALL goal-directed fluid resuscitation strategy and checks for iatrogenic fluid overload.
 */
export function evaluateWaterfallResuscitation(
  weightKg: number,
  isHemoconcentrated: boolean,
  clinicalOverload: boolean,
  activeHourlyRate: number,
  fluidType: ResuscitationFluidType
): {
  recommendedFluid: ResuscitationFluidType;
  recommendedBolusMl: number;
  recommendedMaintenanceMlH: number;
  fluidOverloadRisk: 'LOW' | 'MODERATE' | 'HIGH_OVERLOAD_DETECTED';
  guidance: string;
} {
  // WATERFALL protocol: 10 mL/kg bolus only if hypovolemic/hemoconcentrated; maintenance 1.5 mL/kg/h
  const recommendedBolus = isHemoconcentrated && !clinicalOverload ? Math.round(10 * weightKg) : 0;
  const recommendedMaintenance = Math.round(1.5 * weightKg);

  let overloadRisk: 'LOW' | 'MODERATE' | 'HIGH_OVERLOAD_DETECTED' = 'LOW';
  let guidance = '';

  if (clinicalOverload) {
    overloadRisk = 'HIGH_OVERLOAD_DETECTED';
    guidance = 'CRITICAL FLUID OVERLOAD DETECTED: Discontinue fluid boluses immediately. Restrict maintenance IV rate to insensible losses or hold. The WATERFALL Trial demonstrated aggressive hydration triples pulmonary edema and heart failure without improving pancreatic necrosis or clinical recovery.';
  } else if (activeHourlyRate > recommendedMaintenance * 1.8) {
    overloadRisk = 'MODERATE';
    guidance = `EXCESSIVE INFUSION RATE WARNING: Current rate (${activeHourlyRate} mL/h) exceeds WATERFALL target (${recommendedMaintenance} mL/h = 1.5 mL/kg/h). High risk of iatrogenic hypervolemia. De-escalate to goal-directed rate.`;
  } else {
    overloadRisk = 'LOW';
    if (isHemoconcentrated) {
      guidance = `GOAL-DIRECTED RESUSCITATION: Patient is hemoconcentrated (Hct > 44% / BUN > 20). Administer initial Lactated Ringer's bolus (${recommendedBolus} mL over 2 hours), followed by maintenance at ${recommendedMaintenance} mL/h (1.5 mL/kg/h). Reassess volume status at 3, 12, and 24 hours.`;
    } else {
      guidance = `EUVOLEMIC RESUSCITATION: No severe hemoconcentration. Maintain steady Lactated Ringer's infusion at ${recommendedMaintenance} mL/h without empiric large boluses. Titrate to urine output > 0.5 mL/kg/h.`;
    }
  }

  if (fluidType === 'NORMAL_SALINE') {
    guidance += ' ⚠️ FLUID SELECTION CAUTION: 0.9% Normal Saline is suboptimal. Large-volume 0.9% NaCl induces hyperchloremic non-anion gap metabolic acidosis, which exacerbates pancreatic acinar zymogen activation and systemic inflammation. Lactated Ringer\'s is strongly preferred.';
  }

  return {
    recommendedFluid: 'LACTATED_RINGERS',
    recommendedBolusMl: recommendedBolus,
    recommendedMaintenanceMlH: recommendedMaintenance,
    fluidOverloadRisk: overloadRisk,
    guidance,
  };
}

/**
 * Assesses Antibiotic Stewardship: Routine prophylaxis in acute pancreatitis is CONTRAINDICATED.
 */
export function evaluateAntibioticIndication(infectedNecrosisSuspected: boolean): {
  indicated: boolean;
  rationale: string;
} {
  if (infectedNecrosisSuspected) {
    return {
      indicated: true,
      rationale: 'INDICATED FOR INFECTED NECROSIS: Gas bubbles in peripancreatic tissue or confirmed fine-needle aspiration (FNA) sepsis justifies broad-spectrum pancreatic penetration (Carbapenem e.g. Meropenem 1g q8h, or Fluoroquinolone + Metronidazole). Coordinate surgical / endosonographic step-up drainage.',
    };
  }
  return {
    indicated: false,
    rationale: 'STRICTLY CONTRAINDICATED (NO PROPHYLAXIS): Routine prophylactic antibiotics are NOT recommended for acute pancreatitis regardless of severity tier (Mild, Moderately Severe, or Sterile Necrotizing). Multiple randomized trials and meta-analyses demonstrate no reduction in infected necrosis or mortality, while increasing fungal superinfections and multi-drug resistant pathogens.',
  };
}

/**
 * Main evaluation entrypoint for Acute Pancreatitis Simulator.
 */
export function evaluatePancreatitisCase(input: AcutePancreatitisPatientInput): AcutePancreatitisClinicalMetrics {
  let triadCount = 0;
  if (input.typicalEpigastricPain) triadCount++;
  if (input.serumLipaseUlnRatio >= 3.0) triadCount++;
  if (input.imagingConsistent) triadCount++;
  const diagnosticTriadMet = triadCount >= 2;

  const marshall = calculateModifiedMarshallScore(
    input.pao2Fio2Ratio,
    input.serumCreatinineMgDl,
    input.systolicBpMmHg,
    input.systolicBpFluidResponsive,
    input.arterialBloodPh
  );

  const atlanta = determineAtlantaClassification(
    marshall.hasOrganFailure,
    input.organFailureDurationHours,
    input.localComplicationsPresent,
    input.systemicComorbidityExacerbation
  );

  const bisap = calculateBisapScore(
    input.serumBunMgDl,
    input.gcsScore,
    input.sirsCriteriaMetCount,
    input.patientAgeYears,
    input.pleuralEffusionPresent
  );

  const isHemoconcentrated = input.hematocritPercent > 44 || input.serumBunMgDl > 20;

  const resuscitation = evaluateWaterfallResuscitation(
    input.patientWeightKg,
    isHemoconcentrated,
    input.clinicalFluidOverloadSigns,
    input.activeHourlyInfusionMlH,
    input.selectedFluidType
  );

  const antibiotic = evaluateAntibioticIndication(input.infectedPancreaticNecrosisSuspected);

  const diagnosticSummary = `Atlanta: ${atlanta.replace(/_/g, ' ')} | Marshall Organ Failure: ${marshall.hasOrganFailure ? 'YES (' + marshall.organFailureDomains.join(', ') + ')' : 'NONE'} | BISAP ${bisap.score}/5 (${bisap.mortalityPercent}% mortality) | Resuscitation: ${resuscitation.fluidOverloadRisk === 'HIGH_OVERLOAD_DETECTED' ? 'FLUID OVERLOAD DETECTED' : 'Goal-Directed LR'} | Antibiotics: ${antibiotic.indicated ? 'Indicated (Infected Necrosis)' : 'No Prophylaxis'}.`;

  return {
    diagnosticTriadMet,
    triadCriteriaCount: triadCount,
    marshall,
    atlantaClassification: atlanta,
    bisapScore: bisap.score,
    bisapMortalityPercent: bisap.mortalityPercent,
    isHemoconcentrated,
    fluidResuscitationProtocol: resuscitation,
    antibioticIndication: antibiotic,
    diagnosticSummary,
  };
}
