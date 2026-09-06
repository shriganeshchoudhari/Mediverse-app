/**
 * RenalTubularAcidosisEngine.ts
 * Biophysical & Diagnostic Engine for Normal Anion Gap Metabolic Acidosis (NAGMA),
 * Renal Tubular Acidosis (Types 1, 2, and 4), Urine Anion Gap (UAG),
 * Urine Osmolal Gap (UOG), and Ammonium (NH4+) Excretion Kinetics.
 * Location: frontend/.gemini/skills/RenalTubularAcidosisEngine.ts
 */

export type RtaDiagnosisType =
  | 'DISTAL_RTA_TYPE_1' // Impaired H+ secretion in alpha-intercalated cells
  | 'PROXIMAL_RTA_TYPE_2' // Impaired proximal HCO3- reabsorption (+/- Fanconi)
  | 'HYPERKALEMIC_RTA_TYPE_4' // Hypoaldosteronism or aldosterone resistance
  | 'DIARRHEA_GI_BICARB_LOSS' // Extra-renal NAGMA with brisk renal NH4+ excretion
  | 'NORMAL_ACID_BASE'
  | 'HIGH_ANION_GAP_ACIDOSIS'; // MUDPILES / GOLDMARK (not pure NAGMA)

export interface SerumElectrolytesInput {
  sodiumMeqL: number;
  potassiumMeqL: number;
  chlorideMeqL: number;
  bicarbonateMeqL: number;
  arterialPh: number;
  pco2MmHg: number;
  creatinineMgDl: number;
}

export interface UrineElectrolytesInput {
  urineSodiumMeqL: number;
  urinePotassiumMeqL: number;
  urineChlorideMeqL: number;
  urinePh: number;
  measuredUrineOsmolalityMOsmKg: number;
  urineUreaNitrogenMgDl: number;
  urineGlucoseMgDl: number;
  urineCreatinineMgDl: number;
  urineBicarbonateMeqL?: number;
}

export interface RtaDiagnosticOutcome {
  diagnosis: RtaDiagnosisType;
  diagnosisTitle: string;
  serumAnionGap: number; // Na - (Cl + HCO3)
  isNormalAnionGapMetabolicAcidosis: boolean;
  urineAnionGap: number; // U_Na + U_K - U_Cl
  urineOsmolalGap: number; // Measured - Calculated
  estimatedUrineAmmoniumMeqL: number; // UOG / 2
  isAmmoniumExcretionImpaired: boolean; // UAG > 0 or UOG < 150
  fractionalExcretionBicarbonatePercent: number;
  hypokalemiaOrHyperkalemia: 'HYPOKALEMIA' | 'NORMO_KALEMIA' | 'HYPERKALEMIA';
  pathophysiologicalMechanism: string;
  recommendedTherapy: {
    firstLineDrug: string;
    dosingStrategy: string;
    adjunctsAndMonitoring: string[];
    contraindicatedDrugs: string[];
  };
}

/**
 * 1. Compute Acid-Base Chemistry, Urine Anion Gap & Ammonium Output
 */
export function evaluateRenalTubularAcidosis(
  serum: SerumElectrolytesInput,
  urine: UrineElectrolytesInput
): RtaDiagnosticOutcome {
  // Serum Anion Gap: Na - (Cl + HCO3)
  const serumAnionGap = +(serum.sodiumMeqL - (serum.chlorideMeqL + serum.bicarbonateMeqL)).toFixed(1);
  const isHighAnionGap = serumAnionGap > 12;
  const isNormalAnionGapMetabolicAcidosis = !isHighAnionGap && serum.bicarbonateMeqL < 22 && serum.arterialPh < 7.35;

  // Urine Anion Gap (UAG) = U_Na + U_K - U_Cl
  const urineAnionGap = +(urine.urineSodiumMeqL + urine.urinePotassiumMeqL - urine.urineChlorideMeqL).toFixed(1);

  // Calculated Urine Osmolality = 2*(U_Na + U_K) + (U_Urea / 2.8) + (U_Glucose / 18)
  const calculatedUrineOsmolality = +(
    2 * (urine.urineSodiumMeqL + urine.urinePotassiumMeqL) +
    urine.urineUreaNitrogenMgDl / 2.8 +
    urine.urineGlucoseMgDl / 18
  ).toFixed(1);

  // Urine Osmolal Gap (UOG) = Measured - Calculated
  const urineOsmolalGap = +(urine.measuredUrineOsmolalityMOsmKg - calculatedUrineOsmolality).toFixed(1);

  // Estimated Urine Ammonium (NH4+) = UOG / 2
  const estimatedUrineAmmoniumMeqL = urineOsmolalGap > 0 ? +(urineOsmolalGap / 2).toFixed(1) : 0;
  const isAmmoniumExcretionImpaired = urineAnionGap > 0 || urineOsmolalGap < 150;

  // Fractional Excretion of Bicarbonate (FE_HCO3)
  // FE_HCO3 = (U_HCO3 * P_Cr) / (P_HCO3 * U_Cr) * 100
  let fractionalExcretionBicarbonatePercent = 0.0;
  if (urine.urineBicarbonateMeqL && urine.urineBicarbonateMeqL > 0 && serum.bicarbonateMeqL > 0 && urine.urineCreatinineMgDl > 0) {
    fractionalExcretionBicarbonatePercent = +(
      (urine.urineBicarbonateMeqL * serum.creatinineMgDl) /
      (serum.bicarbonateMeqL * urine.urineCreatinineMgDl) *
      100
    ).toFixed(1);
  }

  // Potassium Phenotype
  let hypokalemiaOrHyperkalemia: RtaDiagnosticOutcome['hypokalemiaOrHyperkalemia'] = 'NORMO_KALEMIA';
  if (serum.potassiumMeqL < 3.5) hypokalemiaOrHyperkalemia = 'HYPOKALEMIA';
  else if (serum.potassiumMeqL > 5.0) hypokalemiaOrHyperkalemia = 'HYPERKALEMIA';

  // Differential Diagnostic Logic for NAGMA
  let diagnosis: RtaDiagnosisType = 'NORMAL_ACID_BASE';
  let diagnosisTitle = 'Normal Acid-Base Profile';
  let mechanism = 'Normal acid-base equilibrium and intact renal handling of ammonium and bicarbonate.';

  let firstLineDrug = 'Observation';
  let dosingStrategy = 'No acid-base pharmacotherapy indicated.';
  const adjuncts: string[] = [];
  const contraindicated: string[] = [];

  if (isHighAnionGap) {
    diagnosis = 'HIGH_ANION_GAP_ACIDOSIS';
    diagnosisTitle = 'High Anion Gap Metabolic Acidosis (HAGMA)';
    mechanism =
      'Elevated unmeasured anions (Ketoacids, L-lactate, D-lactate, Toxins/Methanol/Ethylene Glycol, Uremia). Not a primary Renal Tubular Acidosis.';
    firstLineDrug = 'Etiology-Specific Antidote / Resuscitation';
    dosingStrategy = 'Address underlying toxic ingestion, DKA insulin protocol, or sepsis perfusion.';
  } else if (isNormalAnionGapMetabolicAcidosis) {
    // 1. Extra-renal GI loss (Diarrhea): UAG negative, UOG > 150, Urine pH < 5.3
    if (urineAnionGap < 0 && (urineOsmolalGap > 150 || urine.urineChlorideMeqL > urine.urineSodiumMeqL + urine.urinePotassiumMeqL)) {
      diagnosis = 'DIARRHEA_GI_BICARB_LOSS';
      diagnosisTitle = 'Gastrointestinal Bicarbonate Loss (Secretory Diarrhea)';
      mechanism =
        'Intact renal ammoniagenesis and distal H+ pumping. The kidneys excrete copious NH4+ with Cl-, rendering UAG negative (-20 to -50 mEq/L) and UOG high (>150 mOsm/kg).';
      firstLineDrug = 'Oral / IV Isotonic Bicarbonate + Volume Resuscitation';
      dosingStrategy = 'Balanced electrolyte solutions (e.g. Plasmalyte or 0.9% NaCl with NaHCO3) plus potassium repletion.';
      adjuncts.push('Antidiarrheal agents (Loperamide if non-infectious)', 'Stool electrolyte osmolar gap calculation');
    }
    // 2. Type 4 Hyperkalemic RTA: Hyperkalemia, Urine pH <= 5.3, UAG positive or low NH4+
    else if (serum.potassiumMeqL > 5.0 && urine.urinePh <= 5.3) {
      diagnosis = 'HYPERKALEMIC_RTA_TYPE_4';
      diagnosisTitle = 'Hyperkalemic Renal Tubular Acidosis (Type 4 RTA)';
      mechanism =
        'Hypoaldosteronism or aldosterone receptor resistance. Hyperkalemia inhibits proximal tubule glutamine uptake and ammoniagenesis (lack of NH3 buffer). Distal H+ pumps are intact so urine pH can drop <= 5.3, but total net acid excretion is impaired.';
      firstLineDrug = 'Loop Diuretic (Furosemide) + Low Potassium Diet';
      dosingStrategy = 'Furosemide 20-40 mg PO daily to promote kaliuresis; Fludrocortisone 0.05-0.1 mg PO daily if adrenal hypoaldosteronism.';
      adjuncts.push('Potassium binders (Patiromer 8.4g daily or Sodium Zirconium Cyclosilicate)', 'Oral Sodium Bicarbonate 1 mEq/kg/day');
      contraindicated.push('ACE inhibitors, ARBs, Spironolactone, NSAIDs, Trimethoprim (worsen hyperkalemia and block aldosterone)');
    }
    // 3. Type 2 Proximal RTA: High FE_HCO3 (> 15%) or Fanconi glucosuria
    else if (fractionalExcretionBicarbonatePercent > 15 || (urine.urineGlucoseMgDl > 50 && urine.urinePh > 5.3)) {
      diagnosis = 'PROXIMAL_RTA_TYPE_2';
      diagnosisTitle = 'Proximal Renal Tubular Acidosis (Type 2 RTA)';
      mechanism =
        'Defective proximal tubular bicarbonate reclamation (Na+/HCO3- cotransporter NBCe1 or carbonic anhydrase II). When serum HCO3- is normalized, FE_HCO3 > 15%. Associated with Fanconi syndrome (phosphaturia, glucosuria, aminoaciduria, rickets/osteomalacia).';
      firstLineDrug = 'High-Dose Oral Alkali (Sodium/Potassium Bicarbonate)';
      dosingStrategy = '10-20 mEq/kg/day in divided doses. Alkali load is rapidly excreted, requiring massive ongoing replacement.';
      adjuncts.push('Thiazide diuretic (Hydrochlorothiazide 25mg) to induce mild volume depletion and boost proximal reabsorption', 'Phosphate and Vitamin D for Fanconi rickets', 'Serum and urine protein electrophoresis (SPEP/UPEP) for Multiple Myeloma');
      contraindicated.push('Carbonic anhydrase inhibitors (Acetazolamide)');
    }
    // 4. Type 1 Distal RTA: Inability to acidify urine (Urine pH > 5.3), UAG positive, Hypokalemia, Nephrocalcinosis risk
    else if (urine.urinePh > 5.3 && urineAnionGap >= 0) {
      diagnosis = 'DISTAL_RTA_TYPE_1';
      diagnosisTitle = 'Classic Distal Renal Tubular Acidosis (Type 1 RTA)';
      mechanism =
        'Defect in alpha-intercalated cell apical H+-ATPase or H+/K+-ATPase. Kidneys CANNOT acidify urine below 5.3 despite severe systemic acidemia. Low NH4+ excretion yields positive UAG (+20 to +40 mEq/L). Hypocitraturia and alkaline urine cause recurrent calcium phosphate nephrolithiasis.';
      firstLineDrug = 'Potassium Citrate (or Sodium Bicarbonate)';
      dosingStrategy = 'Potassium Citrate 1-2 mEq/kg/day in 3-4 divided doses (corrects acidemia, replenishes K+, and restores urinary citrate to halt kidney stones).';
      adjuncts.push('Renal ultrasound / CT KUB for nephrocalcinosis', 'Screen for Autoimmune conditions (Sjögren syndrome, SLE, Hashimoto)');
      contraindicated.push('Acidifying salts (Ammonium chloride)');
    }
    // Fallback: Mild or unclassified proximal RTA
    else {
      diagnosis = 'PROXIMAL_RTA_TYPE_2';
      diagnosisTitle = 'Proximal Renal Tubular Acidosis (Type 2 RTA)';
      mechanism =
        'Defective proximal tubular bicarbonate reclamation. When serum HCO3- drops below reduced threshold, urine may transiently acidify.';
      firstLineDrug = 'High-Dose Oral Alkali (Sodium/Potassium Bicarbonate)';
      dosingStrategy = '10-20 mEq/kg/day in divided doses.';
      adjuncts.push('Thiazide diuretic');
      contraindicated.push('Carbonic anhydrase inhibitors (Acetazolamide)');
    }
  }

  return {
    diagnosis,
    diagnosisTitle,
    serumAnionGap,
    isNormalAnionGapMetabolicAcidosis,
    urineAnionGap,
    urineOsmolalGap,
    estimatedUrineAmmoniumMeqL,
    isAmmoniumExcretionImpaired,
    fractionalExcretionBicarbonatePercent,
    hypokalemiaOrHyperkalemia,
    pathophysiologicalMechanism: mechanism,
    recommendedTherapy: {
      firstLineDrug,
      dosingStrategy,
      adjunctsAndMonitoring: adjuncts,
      contraindicatedDrugs: contraindicated,
    },
  };
}
