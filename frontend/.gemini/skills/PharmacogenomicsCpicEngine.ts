/**
 * PharmacogenomicsCpicEngine.ts
 * Precision Medicine, Pharmacogenomics (PGx) & CPIC Guidelines Precision Dosing Engine
 *
 * Implements:
 * - Star-allele genetics & diplotype to phenotype translation for CYP2D6, CYP2C19, CYP2C9, VKORC1, SLCO1B1, TPMT, DPYD, HLA-B*57:01, HLA-B*15:02
 * - Activity score algorithms (CYP2D6, DPYD)
 * - Clinical Pharmacogenetics Implementation Consortium (CPIC) Level A/B dosing guidelines
 * - International Warfarin Pharmacogenetics Consortium (IWPC) pharmacogenetic dosing equation
 * - P2Y12 platelet inhibitor selection (Clopidogrel resistance vs Ticagrelor / Prasugrel)
 * - Opioid prodrug bioactivation risk modeling (Codeine/Tramadol to Morphine)
 * - Fluoropyrimidine (5-FU/Capecitabine) severe toxicity risk stratification
 *
 * Location: frontend/.gemini/skills/PharmacogenomicsCpicEngine.ts
 */

export type MetabolizerStatus = 'PM' | 'IM' | 'NM' | 'RM' | 'UM' | 'INDETERMINATE';

export interface StarAlleleInfo {
  allele: string;
  activityScore: number;
  function: 'normal' | 'decreased' | 'no_function' | 'increased';
  description: string;
  definingVariants: string;
}

export interface GeneDiplotype {
  gene: string;
  maternalAllele: string;
  paternalAllele: string;
  activityScore?: number;
  phenotype: MetabolizerStatus;
  phenotypeDescription: string;
}

export interface DrugRecommendation {
  drugName: string;
  therapeuticArea: string;
  implicatedGene: string;
  cpicLevel: 'A' | 'B' | 'C' | 'D';
  recommendationSummary: string;
  standardDosing: string;
  adjustedDosing: string;
  riskOfStandardTherapy: string;
  alternativeMedications: string[];
  monitoringGuidance: string;
}

export interface PatientPgxProfile {
  id: string;
  name: string;
  clinicalContext: string;
  age: number;
  sex: 'M' | 'F';
  weightKg: number;
  heightCm: number;
  targetDrug: string;
  diplotypes: Record<string, GeneDiplotype>;
  hlaTyping: {
    hlaB5701: boolean;
    hlaB1502: boolean;
    hlaA3101: boolean;
  };
  vkorc1Genotype: 'G/G' | 'G/A' | 'A/A';
  clinicalCovariates: {
    smoker: boolean;
    amiodarone: boolean;
    enzymeInducer: boolean;
  };
}

// ----------------------------------------------------------------------
// 1. Allele Catalogs
// ----------------------------------------------------------------------

export const CYP2D6_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'Wild-type reference allele', definingVariants: 'Reference' },
  '*2': { allele: '*2', activityScore: 1.0, function: 'normal', description: 'Normal activity variant', definingVariants: '2850C>T, 4180G>C' },
  '*4': { allele: '*4', activityScore: 0.0, function: 'no_function', description: 'Splicing defect, most common non-functional allele in Caucasians', definingVariants: '1846G>A (splicing defect)' },
  '*5': { allele: '*5', activityScore: 0.0, function: 'no_function', description: 'Complete gene deletion', definingVariants: 'Whole gene deletion' },
  '*10': { allele: '*10', activityScore: 0.25, function: 'decreased', description: 'Unstable enzyme, frequent in East Asians (~40%)', definingVariants: '100C>T (Pro34Ser)' },
  '*17': { allele: '*17', activityScore: 0.5, function: 'decreased', description: 'Reduced affinity, common in African descent (~20%)', definingVariants: '1023C>T (Thr107Ile)' },
  '*41': { allele: '*41', activityScore: 0.5, function: 'decreased', description: 'Splicing defect causing reduced mRNA expression', definingVariants: '2988G>A' },
  '*1xN': { allele: '*1xN', activityScore: 2.0, function: 'increased', description: 'Gene duplication, produces excess enzyme', definingVariants: 'Copy Number Gain (2+ copies)' }
};

export const CYP2C19_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'Wild-type normal function', definingVariants: 'Reference' },
  '*2': { allele: '*2', activityScore: 0.0, function: 'no_function', description: 'Aberrant splice site, null enzyme activity', definingVariants: '681G>A (splicing defect)' },
  '*3': { allele: '*3', activityScore: 0.0, function: 'no_function', description: 'Premature stop codon, null activity (common in East Asians)', definingVariants: '636G>A (Trp212Ter)' },
  '*17': { allele: '*17', activityScore: 1.5, function: 'increased', description: 'Promoter variant causing increased transcription', definingVariants: '-806C>T (promoter up-regulation)' }
};

export const CYP2C9_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'Wild-type normal activity', definingVariants: 'Reference' },
  '*2': { allele: '*2', activityScore: 0.5, function: 'decreased', description: 'Arg144Cys, ~70-80% reduced clearance of S-warfarin', definingVariants: '430C>T (Arg144Cys)' },
  '*3': { allele: '*3', activityScore: 0.1, function: 'decreased', description: 'Ile359Leu, ~90% reduced clearance of S-warfarin', definingVariants: '1075A>C (Ile359Leu)' }
};

export const DPYD_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'Wild-type functional dihydropyrimidine dehydrogenase', definingVariants: 'Reference' },
  '*2A': { allele: '*2A', activityScore: 0.0, function: 'no_function', description: 'c.1905+1G>A exon 14 skipping, complete null activity', definingVariants: 'IVS14+1G>A' },
  '*13': { allele: '*13', activityScore: 0.0, function: 'no_function', description: 'c.1679T>G (Ile560Ser), non-functional allele', definingVariants: 'c.1679T>G' },
  'c.2846A>T': { allele: 'c.2846A>T', activityScore: 0.5, function: 'decreased', description: 'c.2846A>T (Asp949Val), moderately decreased activity', definingVariants: 'c.2846A>T' },
  'HapB3': { allele: 'HapB3', activityScore: 0.5, function: 'decreased', description: 'c.1129-5923C>G / c.1236G>A deep intronic splicing variant', definingVariants: 'c.1129-5923C>G' }
};

export const SLCO1B1_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'OATP1B1 normal hepatic uptake transporter', definingVariants: 'Reference' },
  '*5': { allele: '*5', activityScore: 0.0, function: 'no_function', description: 'c.521T>C (Val174Ala), impaired statin hepatic clearance', definingVariants: 'c.521T>C (rs4149056)' },
  '*15': { allele: '*15', activityScore: 0.0, function: 'no_function', description: 'c.388A>G + c.521T>C compound haplotype', definingVariants: 'c.388A>G + c.521T>C' }
};

export const TPMT_ALLELES: Record<string, StarAlleleInfo> = {
  '*1': { allele: '*1', activityScore: 1.0, function: 'normal', description: 'Normal thiopurine S-methyltransferase activity', definingVariants: 'Reference' },
  '*2': { allele: '*2', activityScore: 0.0, function: 'no_function', description: 'c.238G>C (Ala80Pro), rapid degradation', definingVariants: 'c.238G>C' },
  '*3A': { allele: '*3A', activityScore: 0.0, function: 'no_function', description: 'c.460G>A + c.719A>G, most prevalent null allele in Caucasians', definingVariants: 'c.460G>A + c.719A>G' },
  '*3C': { allele: '*3C', activityScore: 0.0, function: 'no_function', description: 'c.719A>G, common null allele in Asian and African populations', definingVariants: 'c.719A>G' }
};

// ----------------------------------------------------------------------
// 2. Phenotype Translators
// ----------------------------------------------------------------------

export function translateCyp2d6Diplotype(maternal: string, paternal: string): GeneDiplotype {
  const al1 = CYP2D6_ALLELES[maternal] || CYP2D6_ALLELES['*1'];
  const al2 = CYP2D6_ALLELES[paternal] || CYP2D6_ALLELES['*1'];
  const as = al1.activityScore + al2.activityScore;

  let phenotype: MetabolizerStatus = 'NM';
  let description = 'Normal Metabolizer';

  if (as === 0) {
    phenotype = 'PM';
    description = 'Poor Metabolizer (AS = 0.0): Absent enzyme activity.';
  } else if (as > 0 && as <= 1.0) {
    phenotype = 'IM';
    description = `Intermediate Metabolizer (AS = ${as.toFixed(2)}): Significantly reduced enzyme activity.`;
  } else if (as > 1.0 && as <= 2.25) {
    phenotype = 'NM';
    description = `Normal Metabolizer (AS = ${as.toFixed(2)}): Fully functional baseline clearance.`;
  } else {
    phenotype = 'UM';
    description = `Ultrarapid Metabolizer (AS = ${as.toFixed(2)}): Excess enzyme expression / gene duplication.`;
  }

  return {
    gene: 'CYP2D6',
    maternalAllele: maternal,
    paternalAllele: paternal,
    activityScore: as,
    phenotype,
    phenotypeDescription: description
  };
}

export function translateCyp2c19Diplotype(maternal: string, paternal: string): GeneDiplotype {
  const isLoss = (al: string) => al === '*2' || al === '*3';
  const isGain = (al: string) => al === '*17';
  const isNormal = (al: string) => al === '*1';

  let phenotype: MetabolizerStatus = 'NM';
  let description = 'Normal Metabolizer (*1/*1)';

  if (isLoss(maternal) && isLoss(paternal)) {
    phenotype = 'PM';
    description = 'Poor Metabolizer: Significantly impaired prodrug bioactivation.';
  } else if ((isNormal(maternal) && isLoss(paternal)) || (isLoss(maternal) && isNormal(paternal))) {
    phenotype = 'IM';
    description = 'Intermediate Metabolizer: Reduced prodrug conversion.';
  } else if ((isLoss(maternal) && isGain(paternal)) || (isGain(maternal) && isLoss(paternal))) {
    phenotype = 'IM';
    description = 'Intermediate Metabolizer (*loss/*17 discordant diplotype).';
  } else if (isNormal(maternal) && isNormal(paternal)) {
    phenotype = 'NM';
    description = 'Normal Metabolizer (*1/*1): Standard enzyme capacity.';
  } else if ((isNormal(maternal) && isGain(paternal)) || (isGain(maternal) && isNormal(paternal))) {
    phenotype = 'RM';
    description = 'Rapid Metabolizer (*1/*17): Increased enzyme expression.';
  } else if (isGain(maternal) && isGain(paternal)) {
    phenotype = 'UM';
    description = 'Ultrarapid Metabolizer (*17/*17): High rate of drug clearance/metabolism.';
  }

  return {
    gene: 'CYP2C19',
    maternalAllele: maternal,
    paternalAllele: paternal,
    phenotype,
    phenotypeDescription: description
  };
}

export function translateDpydDiplotype(maternal: string, paternal: string): GeneDiplotype {
  const al1 = DPYD_ALLELES[maternal] || DPYD_ALLELES['*1'];
  const al2 = DPYD_ALLELES[paternal] || DPYD_ALLELES['*1'];
  const as = al1.activityScore + al2.activityScore;

  let phenotype: MetabolizerStatus = 'NM';
  let description = 'Normal Metabolizer (DPYD AS 2.0)';

  if (as <= 0.5) {
    phenotype = 'PM';
    description = `Poor Metabolizer (DPYD AS ${as.toFixed(1)}): Complete or near-complete DPD deficiency. High risk of lethal 5-FU toxicity.`;
  } else if (as >= 1.0 && as < 2.0) {
    phenotype = 'IM';
    description = `Intermediate Metabolizer (DPYD AS ${as.toFixed(1)}): Partial DPD deficiency. 50% dose reduction indicated.`;
  } else {
    phenotype = 'NM';
    description = 'Normal Metabolizer (DPYD AS 2.0): Standard fluoropyrimidine metabolism.';
  }

  return {
    gene: 'DPYD',
    maternalAllele: maternal,
    paternalAllele: paternal,
    activityScore: as,
    phenotype,
    phenotypeDescription: description
  };
}

export function translateSlco1b1Diplotype(maternal: string, paternal: string): GeneDiplotype {
  const isNull = (al: string) => al === '*5' || al === '*15';
  let phenotype: MetabolizerStatus = 'NM';
  let description = 'Normal Transporter Function (*1/*1)';

  if (isNull(maternal) && isNull(paternal)) {
    phenotype = 'PM';
    description = 'Poor Function Transporter (*5/*5 or *15/*15): Marked statin plasma accumulation.';
  } else if (isNull(maternal) || isNull(paternal)) {
    phenotype = 'IM';
    description = 'Decreased Function Transporter: Intermediate statin myopathy risk.';
  } else {
    phenotype = 'NM';
    description = 'Normal Function Transporter: Standard statin uptake.';
  }

  return {
    gene: 'SLCO1B1',
    maternalAllele: maternal,
    paternalAllele: paternal,
    phenotype,
    phenotypeDescription: description
  };
}

// ----------------------------------------------------------------------
// 3. Clinical CPIC Dosing & IWPC Algorithms
// ----------------------------------------------------------------------

/**
 * International Warfarin Pharmacogenetics Consortium (IWPC) Equation
 * Calculates predicted stable weekly warfarin dose in mg.
 */
export function calculateIwpcWarfarinDose(patient: PatientPgxProfile): {
  predictedWeeklyDoseMg: number;
  predictedDailyDoseMg: number;
  percentReductionFromStandard: number;
  rationale: string;
} {
  const ageDecade = patient.age / 10;
  const heightCm = patient.heightCm;
  const weightKg = patient.weightKg;

  let vkorc1Coeff = 0;
  if (patient.vkorc1Genotype === 'G/A') vkorc1Coeff = -0.8677;
  else if (patient.vkorc1Genotype === 'A/A') vkorc1Coeff = -1.6974;

  const cyp2c9Dip = patient.diplotypes['CYP2C9'];
  const mat = cyp2c9Dip?.maternalAllele || '*1';
  const pat = cyp2c9Dip?.paternalAllele || '*1';
  const pair = [mat, pat].sort().join('/');

  let cypCoeff = 0;
  if (pair === '*1/*2') cypCoeff = -0.5211;
  else if (pair === '*1/*3') cypCoeff = -0.9616;
  else if (pair === '*2/*2') cypCoeff = -1.2099;
  else if (pair === '*2/*3') cypCoeff = -1.3439;
  else if (pair === '*3/*3') cypCoeff = -1.9774;

  let amiodaroneCoeff = patient.clinicalCovariates.amiodarone ? -0.5503 : 0;
  let inducerCoeff = patient.clinicalCovariates.enzymeInducer ? 1.2799 : 0;

  // IWPC Sqrt Model
  const sqrtDose =
    5.6044 -
    0.2614 * ageDecade +
    0.0087 * heightCm +
    0.0128 * weightKg +
    vkorc1Coeff +
    cypCoeff +
    amiodaroneCoeff +
    inducerCoeff;

  const predictedWeeklyDoseMg = Math.max(3.5, Math.pow(Math.max(0.5, sqrtDose), 2));
  const predictedDailyDoseMg = predictedWeeklyDoseMg / 7;
  const standardWeeklyDose = 35; // 5 mg daily standard
  const percentReductionFromStandard = Math.round(((standardWeeklyDose - predictedWeeklyDoseMg) / standardWeeklyDose) * 100);

  let rationale = `IWPC model incorporates CYP2C9 (${pair}) and VKORC1 (${patient.vkorc1Genotype}). `;
  if (patient.vkorc1Genotype === 'A/A') {
    rationale += 'VKORC1 A/A imparts high warfarin sensitivity requiring lower doses. ';
  }
  if (cypCoeff < -0.8) {
    rationale += 'CYP2C9 slow-metabolizing alleles dramatically prolong S-warfarin half-life.';
  }

  return {
    predictedWeeklyDoseMg: parseFloat(predictedWeeklyDoseMg.toFixed(1)),
    predictedDailyDoseMg: parseFloat(predictedDailyDoseMg.toFixed(1)),
    percentReductionFromStandard,
    rationale
  };
}

/**
 * Generate CPIC Guideline Recommendation based on patient PGx profile and target drug
 */
export function evaluateCpicGuideline(
  targetDrug: string,
  patient: PatientPgxProfile
): DrugRecommendation {
  const drugUpper = targetDrug.toUpperCase();

  // 1. CLOPIDOGREL (CYP2C19)
  if (drugUpper.includes('CLOPIDOGREL') || drugUpper.includes('PLAVIX')) {
    const dip = patient.diplotypes['CYP2C19'] || translateCyp2c19Diplotype('*1', '*1');
    if (dip.phenotype === 'PM' || dip.phenotype === 'IM') {
      return {
        drugName: 'Clopidogrel (Plavix)',
        therapeuticArea: 'Cardiology / Antiplatelet post-PCI',
        implicatedGene: 'CYP2C19',
        cpicLevel: 'A',
        recommendationSummary: 'Avoid Clopidogrel. Use alternative P2Y12 inhibitor (Ticagrelor or Prasugrel).',
        standardDosing: '75 mg PO once daily (after 300-600 mg loading dose)',
        adjustedDosing: 'Ticagrelor 90 mg PO BID or Prasugrel 10 mg PO daily (if no stroke/TIA history)',
        riskOfStandardTherapy: 'Significantly decreased active thiol metabolite generation leading to subtherapeutic platelet inhibition, high stent thrombosis risk, and recurrent myocardial infarction.',
        alternativeMedications: ['Ticagrelor (Brilinta)', 'Prasugrel (Effient)', 'Cangrelor (IV acute)'],
        monitoringGuidance: 'Platelet aggregation VerifyNow P2Y12 testing if alternative unavailable. PRU > 208 indicates high on-treatment platelet reactivity.'
      };
    } else if (dip.phenotype === 'UM' || dip.phenotype === 'RM') {
      return {
        drugName: 'Clopidogrel (Plavix)',
        therapeuticArea: 'Cardiology / Antiplatelet post-PCI',
        implicatedGene: 'CYP2C19',
        cpicLevel: 'A',
        recommendationSummary: 'Standard dose recommended. High bioactivation efficiency.',
        standardDosing: '75 mg PO once daily',
        adjustedDosing: 'Standard 75 mg PO daily',
        riskOfStandardTherapy: 'Slightly higher active metabolite levels, excellent antiplatelet efficacy without statistically increased major bleeding.',
        alternativeMedications: ['Ticagrelor', 'Prasugrel'],
        monitoringGuidance: 'Routine clinical monitoring for bleeding signs.'
      };
    } else {
      return {
        drugName: 'Clopidogrel (Plavix)',
        therapeuticArea: 'Cardiology / Antiplatelet post-PCI',
        implicatedGene: 'CYP2C19',
        cpicLevel: 'A',
        recommendationSummary: 'Standard clopidogrel therapy indicated (*1/*1 Normal Metabolizer).',
        standardDosing: '75 mg PO once daily',
        adjustedDosing: '75 mg PO once daily',
        riskOfStandardTherapy: 'Expected therapeutic response and acceptable bleeding profile.',
        alternativeMedications: ['Ticagrelor', 'Prasugrel'],
        monitoringGuidance: 'Standard clinical follow-up.'
      };
    }
  }

  // 2. CODEINE / TRAMADOL (CYP2D6)
  if (drugUpper.includes('CODEINE') || drugUpper.includes('TRAMADOL')) {
    const dip = patient.diplotypes['CYP2D6'] || translateCyp2d6Diplotype('*1', '*1');
    if (dip.phenotype === 'UM') {
      return {
        drugName: 'Codeine / Tramadol',
        therapeuticArea: 'Pain Management / Analgesia',
        implicatedGene: 'CYP2D6',
        cpicLevel: 'A',
        recommendationSummary: 'CONTRAINDICATED: Avoid codeine and tramadol due to extreme risk of fatal opioid toxicity.',
        standardDosing: 'Codeine 30-60 mg q4-6h PRN',
        adjustedDosing: 'Avoid prodrug opioids. Use non-CYP2D6 metabolized analgesics (e.g. Morphine, Hydromorphone, Non-opioids).',
        riskOfStandardTherapy: 'Rapid, extensive bioactivation to active morphine leading to severe respiratory depression, apnea, and fatal overdose even at normal therapeutic doses (FDA Black Box Warning).',
        alternativeMedications: ['Morphine (direct glucuronidation)', 'Hydromorphone (Dilaudid)', 'Acetaminophen / NSAIDs'],
        monitoringGuidance: 'Absolute contraindication in pediatric post-tonsillectomy and nursing mothers.'
      };
    } else if (dip.phenotype === 'PM') {
      return {
        drugName: 'Codeine / Tramadol',
        therapeuticArea: 'Pain Management / Analgesia',
        implicatedGene: 'CYP2D6',
        cpicLevel: 'A',
        recommendationSummary: 'Avoid codeine/tramadol due to lack of efficacy.',
        standardDosing: 'Codeine 30-60 mg q4-6h PRN',
        adjustedDosing: 'Switch to direct-acting opioid (Morphine, Oxycodone [partial], Hydromorphone) or non-opioid multimodal analgesia.',
        riskOfStandardTherapy: 'Inability to bioactivate codeine into morphine; patient will experience profound analgesia failure without pain relief.',
        alternativeMedications: ['Morphine', 'Hydromorphone', 'Fentanyl', 'Ketorolac'],
        monitoringGuidance: 'Pain score titration and multimodal analgesia.'
      };
    } else {
      return {
        drugName: 'Codeine / Tramadol',
        therapeuticArea: 'Pain Management / Analgesia',
        implicatedGene: 'CYP2D6',
        cpicLevel: 'A',
        recommendationSummary: 'Use label recommended dosing with standard safety precautions.',
        standardDosing: 'Codeine 30-60 mg q4-6h PRN',
        adjustedDosing: 'Standard therapeutic dosing',
        riskOfStandardTherapy: 'Standard therapeutic response expected.',
        alternativeMedications: ['Acetaminophen', 'Ibuprofen', 'Morphine'],
        monitoringGuidance: 'Standard sedation score and respiratory rate monitoring.'
      };
    }
  }

  // 3. WARFARIN (CYP2C9 + VKORC1)
  if (drugUpper.includes('WARFARIN') || drugUpper.includes('COUMADIN')) {
    const iwpc = calculateIwpcWarfarinDose(patient);
    return {
      drugName: 'Warfarin (Coumadin)',
      therapeuticArea: 'Hematology / Anticoagulation',
      implicatedGene: 'CYP2C9 & VKORC1',
      cpicLevel: 'A',
      recommendationSummary: `Initiate with IWPC genotype-guided dose: ${iwpc.predictedDailyDoseMg} mg/day (${iwpc.predictedWeeklyDoseMg} mg/week, ${iwpc.percentReductionFromStandard > 0 ? iwpc.percentReductionFromStandard + '% reduction' : 'standard'}).`,
      standardDosing: 'Empiric 5 mg PO daily',
      adjustedDosing: `${iwpc.predictedDailyDoseMg} mg PO daily (Target INR 2.0-3.0)`,
      riskOfStandardTherapy: iwpc.percentReductionFromStandard > 30
        ? 'Severe risk of supratherapeutic INR (> 5.0), intracranial hemorrhage, and major gastrointestinal bleeding due to combined impaired clearance and hypersensitive receptor target.'
        : 'Standard induction kinetics.',
      alternativeMedications: ['Apixaban (Eliquis)', 'Rivaroxaban (Xarelto)', 'Dabigatran (Pradaxa)'],
      monitoringGuidance: 'Check baseline INR, repeat INR on Day 3 and Day 5 of initiation. Adjust weekly dose by 10-15% according to INR trajectory.'
    };
  }

  // 4. 5-FLUOROURACIL / CAPECITABINE (DPYD)
  if (drugUpper.includes('5-FU') || drugUpper.includes('FLUOROURACIL') || drugUpper.includes('CAPECITABINE')) {
    const dip = patient.diplotypes['DPYD'] || translateDpydDiplotype('*1', '*1');
    if (dip.phenotype === 'PM') {
      return {
        drugName: '5-Fluorouracil (5-FU) / Capecitabine',
        therapeuticArea: 'Medical Oncology / GI & Breast Malignancy',
        implicatedGene: 'DPYD',
        cpicLevel: 'A',
        recommendationSummary: 'CONTRAINDICATED: Avoid all fluoropyrimidines due to fatal toxicity risk.',
        standardDosing: 'FOLFOX / FOLFIRI protocol (e.g. 5-FU 400 mg/m2 bolus + 2400 mg/m2 46h infusion)',
        adjustedDosing: 'Strongly recommend an alternative non-fluoropyrimidine chemotherapy regimen.',
        riskOfStandardTherapy: 'Catastrophic, life-threatening myelosuppression (Grade 4 pancytopenia), septic shock, necrotizing enterocolitis, severe neurotoxicity, and high mortality (> 50%).',
        alternativeMedications: ['Irinotecan-based (without 5-FU)', 'Oxaliplatin monotherapy', 'Targeted antibodies (e.g. Pembrolizumab, Panitumumab)'],
        monitoringGuidance: 'If fluoropyrimidine is considered absolutely unavoidable, dose reduction > 75-90% with emergency access to Uridine Triacetate (Vistogard).'
      };
    } else if (dip.phenotype === 'IM') {
      return {
        drugName: '5-Fluorouracil (5-FU) / Capecitabine',
        therapeuticArea: 'Medical Oncology / GI & Breast Malignancy',
        implicatedGene: 'DPYD',
        cpicLevel: 'A',
        recommendationSummary: 'Reduce starting dose by 50%. Titrate subsequent cycles based on toxicity.',
        standardDosing: 'Standard full body surface area (BSA) dosing',
        adjustedDosing: 'Reduce starting dose by 50% (e.g., 5-FU 1200 mg/m2 over 46h)',
        riskOfStandardTherapy: 'High incidence of Grade 3-4 diarrhea, severe stomatitis, neutropenia, and hand-foot syndrome.',
        alternativeMedications: ['Reduced-dose FOLFOX', 'Uridine Triacetate on standby'],
        monitoringGuidance: 'Weekly CBC with differential, absolute neutrophil count (ANC), and plasma 5-FU PK area-under-the-curve (AUC) monitoring.'
      };
    } else {
      return {
        drugName: '5-Fluorouracil (5-FU) / Capecitabine',
        therapeuticArea: 'Medical Oncology',
        implicatedGene: 'DPYD',
        cpicLevel: 'A',
        recommendationSummary: 'Normal DPYD activity. Administer standard protocol BSA-based dosing.',
        standardDosing: 'Standard protocol dosing',
        adjustedDosing: '100% standard dosing',
        riskOfStandardTherapy: 'Standard chemotherapy adverse event rates.',
        alternativeMedications: ['Standard regimen'],
        monitoringGuidance: 'Routine pre-chemotherapy CBC and liver enzymes.'
      };
    }
  }

  // 5. ABACAVIR (HLA-B*57:01)
  if (drugUpper.includes('ABACAVIR') || drugUpper.includes('ZIAGEN') || drugUpper.includes('TRIUMEQ')) {
    if (patient.hlaTyping.hlaB5701) {
      return {
        drugName: 'Abacavir (Ziagen / Triumeq component)',
        therapeuticArea: 'Infectious Disease / HIV Antiretroviral Therapy',
        implicatedGene: 'HLA-B*57:01',
        cpicLevel: 'A',
        recommendationSummary: 'CONTRAINDICATED: HLA-B*57:01 Positive. Do not prescribe Abacavir.',
        standardDosing: '600 mg PO once daily or 300 mg PO BID',
        adjustedDosing: 'Select an alternative nucleoside/nucleotide reverse transcriptase inhibitor (Tenofovir alafenamide / emtricitabine).',
        riskOfStandardTherapy: 'Severe Abacavir Hypersensitivity Reaction (HSR) manifesting with multiorgan involvement (fever, maculopapular rash, severe GI cramps, dyspnea, hypotension). Rechallenge is FATAL.',
        alternativeMedications: ['Tenofovir Alafenamide (TAF)', 'Tenofovir Disoproxil Fumarate (TDF)', 'Bictegravir/TAF/FTC (Biktarvy)'],
        monitoringGuidance: 'Add severe allergy alert to EHR with "Abacavir contraindicated due to HLA-B*57:01 positive status".'
      };
    } else {
      return {
        drugName: 'Abacavir (Ziagen)',
        therapeuticArea: 'Infectious Disease / HIV Antiretroviral Therapy',
        implicatedGene: 'HLA-B*57:01',
        cpicLevel: 'A',
        recommendationSummary: 'HLA-B*57:01 Negative. Abacavir can be safely initiated according to guidelines.',
        standardDosing: '600 mg PO once daily',
        adjustedDosing: 'Standard 600 mg PO daily',
        riskOfStandardTherapy: 'Extremely low risk of immunologically-mediated hypersensitivity reaction.',
        alternativeMedications: ['Tenofovir-based regimens'],
        monitoringGuidance: 'Standard antiretroviral viral load and CD4 count surveillance.'
      };
    }
  }

  // 6. SIMVASTATIN (SLCO1B1)
  if (drugUpper.includes('SIMVASTATIN') || drugUpper.includes('STATIN')) {
    const dip = patient.diplotypes['SLCO1B1'] || translateSlco1b1Diplotype('*1', '*1');
    if (dip.phenotype === 'PM' || dip.phenotype === 'IM') {
      return {
        drugName: 'Simvastatin (Zocor)',
        therapeuticArea: 'Cardiology / Lipid Management',
        implicatedGene: 'SLCO1B1',
        cpicLevel: 'A',
        recommendationSummary: 'Prescribe lower dose or switch to alternative statin (Rosuvastatin, Pravastatin, Atorvastatin).',
        standardDosing: 'Simvastatin 20-40 mg PO daily',
        adjustedDosing: 'Max Simvastatin 20 mg/day (or switch to Rosuvastatin 5-10 mg or Pravastatin 20-40 mg)',
        riskOfStandardTherapy: 'Decreased hepatic uptake via OATP1B1 leads to elevated systemic statin exposure, causing high risk of statin-associated muscle symptoms (SAMS), severe myopathy, and rhabdomyolysis.',
        alternativeMedications: ['Rosuvastatin (Crestor)', 'Pravastatin (Pravachol)', 'Atorvastatin (Lipitor)', 'Ezetimibe'],
        monitoringGuidance: 'Check baseline and symptomatic Serum Creatine Kinase (CK) and urinalysis for myoglobin.'
      };
    } else {
      return {
        drugName: 'Simvastatin (Zocor)',
        therapeuticArea: 'Cardiology / Lipid Management',
        implicatedGene: 'SLCO1B1',
        cpicLevel: 'A',
        recommendationSummary: 'Standard dose recommended. Normal transporter function.',
        standardDosing: 'Simvastatin 20-40 mg PO daily',
        adjustedDosing: 'Standard therapeutic dosing',
        riskOfStandardTherapy: 'Baseline low risk of statin-induced myopathy.',
        alternativeMedications: ['Atorvastatin', 'Rosuvastatin'],
        monitoringGuidance: 'Periodic lipid panel (LDL-C target).'
      };
    }
  }

  // Default fallback
  return {
    drugName: targetDrug,
    therapeuticArea: 'Clinical Pharmacology',
    implicatedGene: 'Pharmacogenomics Panel',
    cpicLevel: 'B',
    recommendationSummary: 'Review patient star-allele diplotype and adjust according to institutional PGx consult.',
    standardDosing: 'Standard manufacturer labeling',
    adjustedDosing: 'Consult clinical pharmacologist',
    riskOfStandardTherapy: 'Variable pharmacokinetics dependent on metabolic clearance phenotype.',
    alternativeMedications: ['Therapeutic drug monitoring', 'Alternative class agent'],
    monitoringGuidance: 'Routine clinical and laboratory monitoring.'
  };
}

// ----------------------------------------------------------------------
// 4. Clinical Case Profiles
// ----------------------------------------------------------------------

export const CLINICAL_PGX_PRESETS: PatientPgxProfile[] = [
  {
    id: 'case-clopidogrel-pci',
    name: 'Robert C. - Post-PCI Stent Thrombosis Risk',
    clinicalContext: '61yo male status-post drug-eluting stent (DES) placement to proximal LAD for STEMI. Initiated on dual antiplatelet therapy (DAPT).',
    age: 61,
    sex: 'M',
    weightKg: 84,
    heightCm: 178,
    targetDrug: 'Clopidogrel (Plavix)',
    diplotypes: {
      CYP2C19: translateCyp2c19Diplotype('*2', '*2'),
      CYP2D6: translateCyp2d6Diplotype('*1', '*1'),
      CYP2C9: { gene: 'CYP2C9', maternalAllele: '*1', paternalAllele: '*1', phenotype: 'NM', phenotypeDescription: 'Normal' },
      SLCO1B1: translateSlco1b1Diplotype('*1', '*1'),
      DPYD: translateDpydDiplotype('*1', '*1')
    },
    hlaTyping: { hlaB5701: false, hlaB1502: false, hlaA3101: false },
    vkorc1Genotype: 'G/G',
    clinicalCovariates: { smoker: false, amiodarone: false, enzymeInducer: false }
  },
  {
    id: 'case-codeine-um',
    name: 'Ethan M. - Pediatric Post-Tonsillectomy Pain',
    clinicalContext: '12yo male post-adenotonsillectomy for obstructive sleep apnea. Prescribed acetaminophen with codeine elixir for severe throat pain.',
    age: 12,
    sex: 'M',
    weightKg: 42,
    heightCm: 148,
    targetDrug: 'Codeine',
    diplotypes: {
      CYP2D6: translateCyp2d6Diplotype('*1', '*1xN'),
      CYP2C19: translateCyp2c19Diplotype('*1', '*1'),
      CYP2C9: { gene: 'CYP2C9', maternalAllele: '*1', paternalAllele: '*1', phenotype: 'NM', phenotypeDescription: 'Normal' },
      SLCO1B1: translateSlco1b1Diplotype('*1', '*1'),
      DPYD: translateDpydDiplotype('*1', '*1')
    },
    hlaTyping: { hlaB5701: false, hlaB1502: false, hlaA3101: false },
    vkorc1Genotype: 'G/G',
    clinicalCovariates: { smoker: false, amiodarone: false, enzymeInducer: false }
  },
  {
    id: 'case-warfarin-bleeding',
    name: 'Eleanor H. - Non-Valvular Atrial Fibrillation',
    clinicalContext: '74yo female with new-onset Atrial Fibrillation (CHA2DS2-VASc 4). Initiating warfarin anticoagulation. Baseline INR 1.0.',
    age: 74,
    sex: 'F',
    weightKg: 58,
    heightCm: 160,
    targetDrug: 'Warfarin (Coumadin)',
    diplotypes: {
      CYP2C9: { gene: 'CYP2C9', maternalAllele: '*3', paternalAllele: '*3', phenotype: 'PM', phenotypeDescription: 'Poor Metabolizer (*3/*3)' },
      CYP2C19: translateCyp2c19Diplotype('*1', '*1'),
      CYP2D6: translateCyp2d6Diplotype('*1', '*2'),
      SLCO1B1: translateSlco1b1Diplotype('*1', '*1'),
      DPYD: translateDpydDiplotype('*1', '*1')
    },
    hlaTyping: { hlaB5701: false, hlaB1502: false, hlaA3101: false },
    vkorc1Genotype: 'A/A',
    clinicalCovariates: { smoker: false, amiodarone: true, enzymeInducer: false }
  },
  {
    id: 'case-5fu-dpyd',
    name: 'Marcus K. - Metastatic Colorectal Cancer (mCRC)',
    clinicalContext: '58yo male scheduled to begin first-line FOLFOX chemotherapy (5-FU + Leucovorin + Oxaliplatin) for stage IV sigmoid adenocarcinoma.',
    age: 58,
    sex: 'M',
    weightKg: 79,
    heightCm: 175,
    targetDrug: '5-Fluorouracil (5-FU)',
    diplotypes: {
      DPYD: translateDpydDiplotype('*1', '*2A'),
      CYP2D6: translateCyp2d6Diplotype('*1', '*1'),
      CYP2C19: translateCyp2c19Diplotype('*1', '*1'),
      CYP2C9: { gene: 'CYP2C9', maternalAllele: '*1', paternalAllele: '*1', phenotype: 'NM', phenotypeDescription: 'Normal' },
      SLCO1B1: translateSlco1b1Diplotype('*1', '*1')
    },
    hlaTyping: { hlaB5701: false, hlaB1502: false, hlaA3101: false },
    vkorc1Genotype: 'G/G',
    clinicalCovariates: { smoker: false, amiodarone: false, enzymeInducer: false }
  },
  {
    id: 'case-abacavir-hiv',
    name: 'David L. - Newly Diagnosed HIV Infection',
    clinicalContext: '34yo male preparing for antiretroviral therapy initiation with Triumeq (Abacavir / Dolutegravir / Lamivudine). Viral load 140,000 c/mL.',
    age: 34,
    sex: 'M',
    weightKg: 72,
    heightCm: 180,
    targetDrug: 'Abacavir (Ziagen)',
    diplotypes: {
      CYP2D6: translateCyp2d6Diplotype('*1', '*1'),
      CYP2C19: translateCyp2c19Diplotype('*1', '*1'),
      CYP2C9: { gene: 'CYP2C9', maternalAllele: '*1', paternalAllele: '*1', phenotype: 'NM', phenotypeDescription: 'Normal' },
      SLCO1B1: translateSlco1b1Diplotype('*1', '*1'),
      DPYD: translateDpydDiplotype('*1', '*1')
    },
    hlaTyping: { hlaB5701: true, hlaB1502: false, hlaA3101: false },
    vkorc1Genotype: 'G/G',
    clinicalCovariates: { smoker: false, amiodarone: false, enzymeInducer: false }
  }
];
