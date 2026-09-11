/**
 * SalicylateToxicityEngine.ts
 * Salicylate (Aspirin) Toxicity, Mitochondrial Oxidative Phosphorylation Uncoupling,
 * Mixed Respiratory Alkalosis + HAGMA, Ion Trapping Biophysics (CNS vs Plasma Partitioning),
 * Urinary Alkalinization & Hypokalemic Paradoxical Aciduria, and EXTRIP Hemodialysis Criteria.
 * Location: frontend/.gemini/skills/SalicylateToxicityEngine.ts
 */

export type SalicylateExposureType = 'ACUTE_OVERDOSE' | 'CHRONIC_INGESTION';

export interface SalicylatePatientInput {
  exposureType: SalicylateExposureType;
  serumSalicylateMgDl: number; // e.g., 10 to 140 mg/dL (therapeutic 15-30; toxic > 40-50; severe > 80-100)
  arterialPco2MmHg: number; // e.g., 15 to 45 mmHg (hyperventilation causes respiratory alkalosis)
  serumBicarbonateMeqL: number; // e.g., 8 to 28 mEq/L (metabolic acidosis consumes HCO3)
  serumPotassiumMeqL: number; // e.g., 2.5 to 5.5 mEq/L (crucial for renal alkalinization)
  urinePh: number; // e.g., 5.0 to 8.5 (target for ion trapping: 7.5 - 8.0)
  patientWeightKg: number; // e.g., 40 to 120 kg
  alteredMentalStatusOrSeizures: boolean; // CNS toxicity indicator
  pulmonaryEdemaArds: boolean; // Non-cardiogenic pulmonary edema
  bicarbonateInfusionActive: boolean; // IV NaHCO3 drip active
}

export interface SalicylateClinicalMetrics {
  calculatedArterialPh: number;
  anionGapMeqL: number; // Estimated based on typical Na 140, Cl 102 - HCO3
  primaryAcidBaseDisorders: string[];
  cnsToxicityRisk: 'LOW_THERAPEUTIC' | 'MODERATE' | 'SEVERE_CRITICAL_CNS_PENETRATION';
  nonIonizedFractionPercent: number; // Lipophilic HA crossing blood-brain barrier
  renalSalicylateClearanceMlMin: number; // Markedly enhanced by urine alkalinization
  paradoxicalAciduriaPresent: boolean; // Hypokalemia blocks urine alkalinization
  hemodialysisRequiredExtrip: boolean; // EXTRIP guidelines
  extripIndicationReasons: string[];
  clinicalActionChecklist: string[];
  diagnosticSummary: string;
}

export const SALICYLATE_PRESETS: {
  id: string;
  name: string;
  badge: string;
  description: string;
  input: SalicylatePatientInput;
}[] = [
  {
    id: 'acute-severe-mixed-disorder',
    name: 'Acute Severe Aspirin Overdose (Mixed Resp Alk + HAGMA)',
    badge: 'Urinary Alkalinization Candidate',
    description: 'A 24-year-old ingests 60 tablets of 325 mg aspirin. Serum salicylate is 72 mg/dL. Exhibits hyperventilation (PaCO2 20 mmHg) with metabolic acidosis (HCO3 14 mEq/L), tinnitus, and tachypnea. Target urine pH 7.5-8.0 to accelerate elimination.',
    input: {
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 72,
      arterialPco2MmHg: 20,
      serumBicarbonateMeqL: 14,
      serumPotassiumMeqL: 4.2,
      urinePh: 6.0,
      patientWeightKg: 70,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: false,
    },
  },
  {
    id: 'hypokalemic-paradoxical-aciduria',
    name: 'Alkalinization Failure (Hypokalemic Paradoxical Aciduria)',
    badge: 'Potassium Repletion Trap',
    description: 'A patient receiving IV sodium bicarbonate whose urine pH remains persistently acidic (5.5) despite systemic alkalinization. Serum K+ is 3.1 mEq/L; distal nephron H+/K+-ATPase secretes H+ to preserve K+, completely halting urinary salicylate elimination.',
    input: {
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 65,
      arterialPco2MmHg: 24,
      serumBicarbonateMeqL: 20,
      serumPotassiumMeqL: 3.1,
      urinePh: 5.5,
      patientWeightKg: 65,
      alteredMentalStatusOrSeizures: false,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: true,
    },
  },
  {
    id: 'extrip-dialysis-catastrophic-cns',
    name: 'Catastrophic Salicylism with Acidemia & Coma (EXTRIP Dialysis)',
    badge: 'Emergent Hemodialysis Alert',
    description: 'Severe salicylate poisoning (level 115 mg/dL) presenting with lethargy progressing to seizures, severe acidemia (pH 7.18), and pulmonary edema. High non-ionized salicylate penetrates brain. Mandates emergent hemodialysis per EXTRIP guidelines.',
    input: {
      exposureType: 'ACUTE_OVERDOSE',
      serumSalicylateMgDl: 115,
      arterialPco2MmHg: 28,
      serumBicarbonateMeqL: 10,
      serumPotassiumMeqL: 4.4,
      urinePh: 6.2,
      patientWeightKg: 80,
      alteredMentalStatusOrSeizures: true,
      pulmonaryEdemaArds: true,
      bicarbonateInfusionActive: true,
    },
  },
  {
    id: 'chronic-geriatric-salicylism',
    name: 'Chronic Geriatric Salicylism with Delirium',
    badge: 'Insidious Chronic Toxicity',
    description: 'An 79-year-old with osteoarthritis on chronic high-dose aspirin presenting with confusion, tachypnea, and unsteadiness. Salicylate level is 58 mg/dL with subtle mixed disorder. Often misdiagnosed as sepsis or stroke; early dialysis indicated in elderly delirium.',
    input: {
      exposureType: 'CHRONIC_INGESTION',
      serumSalicylateMgDl: 58,
      arterialPco2MmHg: 22,
      serumBicarbonateMeqL: 16,
      serumPotassiumMeqL: 3.8,
      urinePh: 6.5,
      patientWeightKg: 58,
      alteredMentalStatusOrSeizures: true,
      pulmonaryEdemaArds: false,
      bicarbonateInfusionActive: false,
    },
  },
];

/**
 * Evaluates Salicylate Toxicity, Ion Trapping, and EXTRIP Dialysis Indication
 */
export function evaluateSalicylateCase(input: SalicylatePatientInput): SalicylateClinicalMetrics {
  const {
    exposureType,
    serumSalicylateMgDl,
    arterialPco2MmHg,
    serumBicarbonateMeqL,
    serumPotassiumMeqL,
    urinePh,
    alteredMentalStatusOrSeizures,
    pulmonaryEdemaArds,
  } = input;

  // 1. Henderson-Hasselbalch Arterial pH Calculation
  // pH = 6.1 + log10( [HCO3-] / (0.03 * PaCO2) )
  const hco3 = Math.max(2, serumBicarbonateMeqL);
  const pco2 = Math.max(10, arterialPco2MmHg);
  const ratio = hco3 / (0.03 * pco2);
  const calculatedPh = Math.round((6.1 + Math.log10(ratio)) * 100) / 100;

  // Estimated Anion Gap: Na (assumed 140) - (Cl 102 + HCO3)
  const anionGap = Math.round(140 - (102 + hco3));

  // 2. Identify Primary Acid-Base Disorders
  const disorders: string[] = [];
  if (pco2 < 35) disorders.push('Primary Respiratory Alkalosis (Medullary Stimulation)');
  if (hco3 < 22 || anionGap > 12) disorders.push('High Anion Gap Metabolic Acidosis (Mitochondrial Uncoupling)');
  if (pco2 > 45) disorders.push('Respiratory Acidosis (CNS Depression / Hypoventilation)');

  // 3. Ion Trapping Biophysics & Non-Ionized HA Crossing Blood-Brain Barrier
  // Salicylic acid pKa ~ 3.00
  // Non-ionized fraction HA / Total = 1 / (1 + 10^(pH - pKa))
  // In percent:
  const pKa = 3.0;
  const nonIonizedFraction = Math.round((1 / (1 + Math.pow(10, calculatedPh - pKa))) * 10000) / 100;

  let cnsRisk: SalicylateClinicalMetrics['cnsToxicityRisk'] = 'LOW_THERAPEUTIC';
  if (serumSalicylateMgDl < 30 && calculatedPh >= 7.35) {
    cnsRisk = 'LOW_THERAPEUTIC';
  } else if (calculatedPh < 7.30 || serumSalicylateMgDl >= 80 || alteredMentalStatusOrSeizures) {
    cnsRisk = 'SEVERE_CRITICAL_CNS_PENETRATION';
  } else {
    cnsRisk = 'MODERATE';
  }

  // 4. Renal Clearance vs Urine pH
  // Baseline clearance at urine pH 5.0 is ~5-10 mL/min
  // At urine pH 7.5 - 8.0, clearance surges 10- to 20-fold to 80-120 mL/min
  // Formula: Cl = 8 * 10^(0.4 * (urinePh - 5.0))
  const renalClearance = Math.min(
    140,
    Math.round(8 * Math.pow(10, Math.max(0, 0.45 * (urinePh - 5.0))) * 10) / 10
  );

  // 5. Hypokalemic Paradoxical Aciduria Pitfall
  // If serum K+ < 3.8 and urine pH < 6.5 despite attempted alkalinization,
  // distal nephron H+/K+-ATPase secretes H+ to preserve potassium
  const isParadoxicalAciduria = serumPotassiumMeqL < 3.8 && urinePh < 6.5;

  // 6. EXTRIP Workgroup Hemodialysis Criteria
  // Indications:
  // 1. Serum salicylate > 100 mg/dL (acute) or > 90 mg/dL (with impaired renal function)
  // 2. Serum salicylate > 60 mg/dL in chronic poisoning with elderly/altered mental status
  // 3. Altered mental status, coma, or seizures
  // 4. Non-cardiogenic pulmonary edema (ARDS)
  // 5. Refractory severe acidemia (pH < 7.20)
  const extripReasons: string[] = [];

  if (exposureType === 'ACUTE_OVERDOSE' && serumSalicylateMgDl >= 100) {
    extripReasons.push(`Acute Salicylate Level >= 100 mg/dL (${serumSalicylateMgDl} mg/dL).`);
  }
  if (exposureType === 'CHRONIC_INGESTION' && serumSalicylateMgDl >= 60) {
    extripReasons.push(`Chronic Salicylate Level >= 60 mg/dL (${serumSalicylateMgDl} mg/dL).`);
  }
  if (alteredMentalStatusOrSeizures && serumSalicylateMgDl >= 40) {
    extripReasons.push('Altered mental status, encephalopathy, or seizures (severe neuroglycopenia/cerebral edema).');
  }
  if (pulmonaryEdemaArds) {
    extripReasons.push('Non-cardiogenic pulmonary edema (ARDS) precludes volume resuscitation.');
  }
  if (calculatedPh < 7.20) {
    extripReasons.push(`Severe refractory systemic acidemia (arterial pH ${calculatedPh} < 7.20).`);
  }

  const isDialysisIndicated = extripReasons.length > 0;

  // 7. Clinical Action Checklist
  const actions: string[] = [];

  if (isDialysisIndicated) {
    actions.push('EMERGENT HEMODIALYSIS (EXTRIP Criteria Met): Prompt nephrology consultation. Intermittent hemodialysis rapidly clears both free and protein-bound salicylate, restores acid-base balance, and corrects volume overload.');
  }

  if (serumSalicylateMgDl >= 40 && !isDialysisIndicated) {
    actions.push('URINARY ALKALINIZATION: Administer IV Sodium Bicarbonate (1-2 mEq/kg bolus, followed by 150 mEq NaHCO3 in 1 L D5W at 1.5-2x maintenance). Titrate to target urine pH 7.5 - 8.0.');
  }

  if (isParadoxicalAciduria) {
    actions.push(`CRITICAL HYPOKALEMIA PITFALL (K+ = ${serumPotassiumMeqL} mEq/L): Renal distal tubule H+/K+-ATPase secretes H+ into urine to conserve potassium, producing paradoxical aciduria. Urinary alkalinization is IMPOSSIBLE without aggressive potassium repletion (target K+ 4.0 - 4.5 mEq/L).`);
  }

  if (cnsRisk === 'SEVERE_CRITICAL_CNS_PENETRATION') {
    actions.push(`CNS TOXICITY WARNING: Systemic acidemia (pH ${calculatedPh}) shifts salicylate into non-ionized lipid-soluble form, accelerating blood-brain barrier transit. Target arterial pH 7.45 - 7.55 to ion-trap salicylate in plasma.`);
  }

  if (serumSalicylateMgDl < 30) {
    actions.push('Serum salicylate within therapeutic anti-inflammatory range. Continue supportive observation.');
  }

  let summary = '';
  if (isDialysisIndicated) {
    summary = `Severe salicylate poisoning (${serumSalicylateMgDl} mg/dL, pH ${calculatedPh}). Emergent hemodialysis indicated per EXTRIP criteria (${extripReasons[0]}).`;
  } else if (serumSalicylateMgDl >= 40) {
    summary = `Salicylate toxicity (${serumSalicylateMgDl} mg/dL, pH ${calculatedPh}). Target urine pH 7.5-8.0 for ion trapping. Renal clearance: ${renalClearance} mL/min.`;
  } else {
    summary = `Therapeutic/mild salicylate exposure (${serumSalicylateMgDl} mg/dL). Acid-base status: pH ${calculatedPh}.`;
  }

  return {
    calculatedArterialPh: calculatedPh,
    anionGapMeqL: anionGap,
    primaryAcidBaseDisorders: disorders,
    cnsToxicityRisk: cnsRisk,
    nonIonizedFractionPercent: nonIonizedFraction,
    renalSalicylateClearanceMlMin: renalClearance,
    paradoxicalAciduriaPresent: isParadoxicalAciduria,
    hemodialysisRequiredExtrip: isDialysisIndicated,
    extripIndicationReasons: extripReasons,
    clinicalActionChecklist: actions,
    diagnosticSummary: summary,
  };
}
