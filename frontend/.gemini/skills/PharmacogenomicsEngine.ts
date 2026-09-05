/**
 * PharmacogenomicsEngine.ts
 * 
 * Clinical Pharmacogenomics (PGx) & Precision Therapeutics Engine
 * Implements CPIC (Clinical Pharmacogenetics Implementation Consortium) and DPWG Level 1A Guidelines.
 * Star Allele diplotype calling, Activity Score (AS) translation, phenotype assignment,
 * International Warfarin Pharmacogenetics Consortium (IWPC) dosing algorithm,
 * and Clinical Decision Support (CDS) drug-gene alert generator for high-risk medications.
 * 
 * Location: frontend/.gemini/skills/PharmacogenomicsEngine.ts
 */

export type MetabolizerPhenotype = 
  | 'POOR_METABOLIZER'
  | 'INTERMEDIATE_METABOLIZER'
  | 'NORMAL_METABOLIZER'
  | 'RAPID_METABOLIZER'
  | 'ULTRARAPID_METABOLIZER';

export type CPICRecommendationLevel = 'STRONG' | 'MODERATE' | 'OPTIONAL' | 'CONTRAINDICATED';

export type AlertSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'INFO';

export interface StarAllele {
  allele: string;
  activityValue: number;
  description: string;
  clinicalImpact: string;
}

export interface GeneDiplotype {
  gene: 'CYP2C19' | 'CYP2D6' | 'CYP2C9' | 'VKORC1' | 'TPMT' | 'NUDT15' | 'DPYD' | 'SLCO1B1' | 'HLA-B';
  maternalAllele: string;
  paternalAllele: string;
  activityScore: number;
  phenotype: MetabolizerPhenotype;
  phenotypeDescription: string;
}

export interface DrugGeneInteractionRule {
  drugName: string;
  drugCategory: string;
  standardDose: string;
  primaryGene: GeneDiplotype['gene'];
  targetPhenotypes: MetabolizerPhenotype[];
  recommendationLevel: CPICRecommendationLevel;
  severity: AlertSeverity;
  clinicalAlert: string;
  alternativeTherapy: string;
  evidenceSummary: string;
}

export interface WarfarinPatientParameters {
  age: number;
  heightCm: number;
  weightKg: number;
  cyp2c9Diplotype: '*1/*1' | '*1/*2' | '*1/*3' | '*2/*2' | '*2/*3' | '*3/*3';
  vkorc1Genotype: 'G/G' | 'A/G' | 'A/A'; // -1639G>A (rs9923231)
  amiodaroneCoPrescribed: boolean;
  targetINR: number; // standard 2.5 (2.0 - 3.0)
}

export interface PGxClinicalPreset {
  id: string;
  patientName: string;
  clinicalIndication: string;
  category: string;
  prescribedDrug: string;
  patientGenes: Record<string, { maternal: string; paternal: string }>;
  description: string;
  clinicalRisk: string;
  actionRequired: string;
}

/**
 * CYP2C19 Allele Definitions (CPIC Standard)
 * *1 = Normal (1.0), *2 = No function (0), *3 = No function (0), *17 = Increased function (1.5)
 */
export const CYP2C19_ALLELES: Record<string, StarAllele> = {
  '*1': { allele: '*1', activityValue: 1.0, description: 'Wild type normal function', clinicalImpact: 'Standard substrate clearance' },
  '*2': { allele: '*2', activityValue: 0.0, description: 'c.681G>A aberrant splice site', clinicalImpact: 'Loss of catalytic activity' },
  '*3': { allele: '*3', activityValue: 0.0, description: 'c.636G>A premature stop codon (Trp212Ter)', clinicalImpact: 'Truncated non-functional protein' },
  '*17': { allele: '*17', activityValue: 1.5, description: 'c.-806C>T promoter hyper-transcription', clinicalImpact: 'Increased enzyme expression & ultrarapid clearance' },
};

/**
 * CYP2D6 Allele Definitions (CPIC Activity Score Framework)
 * *1, *2 = 1.0; *4, *5 = 0; *10, *41 = 0.25 - 0.5; *1xN = >2.0
 */
export const CYP2D6_ALLELES: Record<string, StarAllele> = {
  '*1': { allele: '*1', activityValue: 1.0, description: 'Wild type functional enzyme', clinicalImpact: 'Normal metabolic clearance' },
  '*2': { allele: '*2', activityValue: 1.0, description: 'Functional enzyme variant', clinicalImpact: 'Normal metabolic clearance' },
  '*4': { allele: '*4', activityValue: 0.0, description: 'c.1846G>A splicing defect', clinicalImpact: 'Complete loss of activity (most common in Europeans)' },
  '*5': { allele: '*5', activityValue: 0.0, description: 'Whole gene deletion', clinicalImpact: 'Zero enzyme synthesis' },
  '*10': { allele: '*10', activityValue: 0.25, description: 'c.100C>T Pro34Ser instability', clinicalImpact: 'Severely reduced function (predominant in East Asians)' },
  '*41': { allele: '*41', activityValue: 0.5, description: 'c.2988G>A splicing defect', clinicalImpact: 'Moderately reduced function' },
  '*1xN': { allele: '*1xN', activityValue: 2.0, description: 'Gene duplication (2+ copies)', clinicalImpact: 'Ultrarapid bioactivation and toxicity' },
};

/**
 * TPMT Allele Definitions (Thiopurine S-methyltransferase)
 */
export const TPMT_ALLELES: Record<string, StarAllele> = {
  '*1': { allele: '*1', activityValue: 1.0, description: 'Wild type normal activity', clinicalImpact: 'Safe standard thiopurine inactivation' },
  '*2': { allele: '*2', activityValue: 0.0, description: 'c.238G>C missense', clinicalImpact: 'Accelerated protein degradation' },
  '*3A': { allele: '*3A', activityValue: 0.0, description: 'c.460G>A and c.719A>G', clinicalImpact: 'Severe enzyme deficiency; high TGN toxicity' },
  '*3C': { allele: '*3C', activityValue: 0.0, description: 'c.719A>G alone', clinicalImpact: 'Severe enzyme deficiency' },
};

/**
 * DPYD Allele Definitions (Dihydropyrimidine Dehydrogenase)
 */
export const DPYD_ALLELES: Record<string, StarAllele> = {
  '*1': { allele: '*1', activityValue: 1.0, description: 'Wild type normal DPD activity', clinicalImpact: 'Normal 5-FU clearance (>80% hepatic catabolism)' },
  '*2A': { allele: '*2A', activityValue: 0.0, description: 'c.1905+1G>A exon 14 skipping', clinicalImpact: 'Complete loss of DPD activity; lethal 5-FU toxicity' },
  '*13': { allele: '*13', activityValue: 0.0, description: 'c.1679T>G I560S', clinicalImpact: 'Zero enzyme activity' },
  'c.2846A>T': { allele: 'c.2846A>T', activityValue: 0.5, description: 'c.2846A>T D949V missense', clinicalImpact: 'Decreased function' },
  'HapB3': { allele: 'HapB3', activityValue: 0.5, description: 'Intronic c.1129-5923C>G splice variant', clinicalImpact: 'Decreased function' },
};

/**
 * Resolves CYP2C19 Diplotype to CPIC Phenotype
 */
export function callCYP2C19Phenotype(maternal: string, paternal: string): GeneDiplotype {
  const m = CYP2C19_ALLELES[maternal] || CYP2C19_ALLELES['*1'];
  const p = CYP2C19_ALLELES[paternal] || CYP2C19_ALLELES['*1'];
  const activityScore = +(m.activityValue + p.activityValue).toFixed(1);

  let phenotype: MetabolizerPhenotype = 'NORMAL_METABOLIZER';
  let phenotypeDescription = 'Normal enzyme activity; standard metabolism';

  if (activityScore === 0) {
    phenotype = 'POOR_METABOLIZER';
    phenotypeDescription = 'Complete loss of functional CYP2C19; fails to activate clopidogrel prodrug';
  } else if (activityScore <= 1.0) {
    phenotype = 'INTERMEDIATE_METABOLIZER';
    phenotypeDescription = 'Reduced enzyme activity; impaired prodrug bioactivation';
  } else if (activityScore === 2.0) {
    phenotype = 'NORMAL_METABOLIZER';
    phenotypeDescription = 'Standard catalytic activity and clinical response';
  } else if (activityScore === 2.5) {
    phenotype = 'RAPID_METABOLIZER';
    phenotypeDescription = 'Elevated enzyme expression; accelerated clearance';
  } else {
    phenotype = 'ULTRARAPID_METABOLIZER';
    phenotypeDescription = 'Extremely high enzyme activity; risk of therapeutic failure for voriconazole & PPIs';
  }

  return {
    gene: 'CYP2C19',
    maternalAllele: m.allele,
    paternalAllele: p.allele,
    activityScore,
    phenotype,
    phenotypeDescription,
  };
}

/**
 * Resolves CYP2D6 Diplotype to CPIC Activity Score & Phenotype
 */
export function callCYP2D6Phenotype(maternal: string, paternal: string): GeneDiplotype {
  const m = CYP2D6_ALLELES[maternal] || CYP2D6_ALLELES['*1'];
  const p = CYP2D6_ALLELES[paternal] || CYP2D6_ALLELES['*1'];
  const activityScore = +(m.activityValue + p.activityValue).toFixed(2);

  let phenotype: MetabolizerPhenotype = 'NORMAL_METABOLIZER';
  let phenotypeDescription = 'Standard CYP2D6 metabolic capacity';

  if (activityScore === 0) {
    phenotype = 'POOR_METABOLIZER';
    phenotypeDescription = 'No functional CYP2D6 enzyme; no conversion of codeine to morphine; poor tamoxifen efficacy';
  } else if (activityScore <= 1.0) {
    phenotype = 'INTERMEDIATE_METABOLIZER';
    phenotypeDescription = 'Suboptimal clearance and impaired prodrug bioactivation';
  } else if (activityScore <= 2.25) {
    phenotype = 'NORMAL_METABOLIZER';
    phenotypeDescription = 'Normal physiological metabolic capacity';
  } else {
    phenotype = 'ULTRARAPID_METABOLIZER';
    phenotypeDescription = 'Gene duplication; rapid hyper-conversion of codeine/tramadol to morphine with lethal apnea risk';
  }

  return {
    gene: 'CYP2D6',
    maternalAllele: m.allele,
    paternalAllele: p.allele,
    activityScore,
    phenotype,
    phenotypeDescription,
  };
}

/**
 * Resolves TPMT Diplotype to Thiopurine Phenotype
 */
export function callTPMTPhenotype(maternal: string, paternal: string): GeneDiplotype {
  const m = TPMT_ALLELES[maternal] || TPMT_ALLELES['*1'];
  const p = TPMT_ALLELES[paternal] || TPMT_ALLELES['*1'];
  const activityScore = +(m.activityValue + p.activityValue).toFixed(1);

  let phenotype: MetabolizerPhenotype = 'NORMAL_METABOLIZER';
  let phenotypeDescription = 'Normal TPMT activity; standard thiopurine dosing tolerated';

  if (activityScore === 0) {
    phenotype = 'POOR_METABOLIZER';
    phenotypeDescription = 'Homozygous deficient; 100x accumulation of cytotoxic TGN nucleotides; requires 90% dose reduction';
  } else if (activityScore === 1.0) {
    phenotype = 'INTERMEDIATE_METABOLIZER';
    phenotypeDescription = 'Heterozygous deficient; moderate myelosuppression risk; start at 30-50% standard dose';
  } else {
    phenotype = 'NORMAL_METABOLIZER';
    phenotypeDescription = 'Standard thiopurine methylation activity';
  }

  return {
    gene: 'TPMT',
    maternalAllele: m.allele,
    paternalAllele: p.allele,
    activityScore,
    phenotype,
    phenotypeDescription,
  };
}

/**
 * Resolves DPYD Diplotype to Fluorouracil Phenotype & Activity Score
 */
export function callDPYDPhenotype(maternal: string, paternal: string): GeneDiplotype {
  const m = DPYD_ALLELES[maternal] || DPYD_ALLELES['*1'];
  const p = DPYD_ALLELES[paternal] || DPYD_ALLELES['*1'];
  const activityScore = +(m.activityValue + p.activityValue).toFixed(1);

  let phenotype: MetabolizerPhenotype = 'NORMAL_METABOLIZER';
  let phenotypeDescription = 'Normal DPD enzymatic activity; standard 5-FU/capecitabine clearance';

  if (activityScore === 0) {
    phenotype = 'POOR_METABOLIZER';
    phenotypeDescription = 'Complete DPD deficiency; fluoropyrimidines are CONTRAINDICATED due to lethal toxicity';
  } else if (activityScore <= 1.5) {
    phenotype = 'INTERMEDIATE_METABOLIZER';
    phenotypeDescription = 'Partial DPD deficiency; 50% dose reduction strongly recommended with TDM';
  } else {
    phenotype = 'NORMAL_METABOLIZER';
    phenotypeDescription = 'Standard fluoropyrimidine catabolic activity';
  }

  return {
    gene: 'DPYD',
    maternalAllele: m.allele,
    paternalAllele: p.allele,
    activityScore,
    phenotype,
    phenotypeDescription,
  };
}

/**
 * International Warfarin Pharmacogenetics Consortium (IWPC) Dosing Algorithm
 * Computes predicted therapeutic maintenance dose of Warfarin (mg/day)
 * Validated in >5,000 patients across international cohorts.
 */
export function calculateIWPCWarfarinDose(params: WarfarinPatientParameters): {
  predictedDailyDoseMg: number;
  predictedWeeklyDoseMg: number;
  doseAdjustmentPercentage: number;
  riskCategory: 'HIGH_SENSITIVITY' | 'MODERATE_SENSITIVITY' | 'STANDARD' | 'RESISTANT';
  geneticExplanation: string;
} {
  const { age, heightCm, weightKg, cyp2c9Diplotype, vkorc1Genotype, amiodaroneCoPrescribed } = params;

  // IWPC Pharmacogenetic Regression Model
  // Square root of weekly dose:
  // sqrt(WeeklyDose) = 5.6044
  // - 0.2614 * (Age/10)
  // + 0.0087 * Height_cm
  // + 0.0128 * Weight_kg
  // - 0.8677 * VKORC1_A/G - 1.6974 * VKORC1_A/A
  // - 0.5211 * CYP2C9_*1/*2 - 0.9636 * CYP2C9_*1/*3
  // - 1.0616 * CYP2C9_*2/*2 - 1.3788 * CYP2C9_*2/*3 - 2.2499 * CYP2C9_*3/*3
  // - 0.5857 * Amiodarone
  let sqrtWeekly = 5.6044;

  // Demographics
  sqrtWeekly -= 0.2614 * (age / 10);
  sqrtWeekly += 0.0087 * heightCm;
  sqrtWeekly += 0.0128 * weightKg;

  // VKORC1 (-1639G>A)
  if (vkorc1Genotype === 'A/G') sqrtWeekly -= 0.8677;
  else if (vkorc1Genotype === 'A/A') sqrtWeekly -= 1.6974;

  // CYP2C9 Diplotype
  switch (cyp2c9Diplotype) {
    case '*1/*2': sqrtWeekly -= 0.5211; break;
    case '*1/*3': sqrtWeekly -= 0.9636; break;
    case '*2/*2': sqrtWeekly -= 1.0616; break;
    case '*2/*3': sqrtWeekly -= 1.3788; break;
    case '*3/*3': sqrtWeekly -= 2.2499; break;
    default: break; // *1/*1
  }

  // Amiodarone drug-drug interaction
  if (amiodaroneCoPrescribed) sqrtWeekly -= 0.5857;

  const weeklyDose = Math.max(7, Math.pow(Math.max(1.0, sqrtWeekly), 2));
  const dailyDose = +(weeklyDose / 7).toFixed(1);
  const standardDaily = 5.0; // standard empirical starting dose
  const adjustmentPercent = +(((dailyDose - standardDaily) / standardDaily) * 100).toFixed(0);

  let riskCategory: 'HIGH_SENSITIVITY' | 'MODERATE_SENSITIVITY' | 'STANDARD' | 'RESISTANT' = 'STANDARD';
  let geneticExplanation = 'Standard metabolic clearance and receptor sensitivity.';

  if (dailyDose <= 2.0) {
    riskCategory = 'HIGH_SENSITIVITY';
    geneticExplanation = `Extreme sensitivity: VKORC1 ${vkorc1Genotype} (low baseline target enzyme) and CYP2C9 ${cyp2c9Diplotype} (severely impaired S-warfarin clearance). Standard 5 mg dose risks catastrophic INR > 8.0 and fatal intracranial hemorrhage.`;
  } else if (dailyDose < 4.0) {
    riskCategory = 'MODERATE_SENSITIVITY';
    geneticExplanation = `Moderate sensitivity: Reduced dose required due to ${vkorc1Genotype !== 'G/G' ? `VKORC1 ${vkorc1Genotype} promoter variant` : ''} ${cyp2c9Diplotype !== '*1/*1' ? `CYP2C9 ${cyp2c9Diplotype} reduced clearance` : ''}.`;
  } else if (dailyDose > 7.0) {
    riskCategory = 'RESISTANT';
    geneticExplanation = 'Warfarin resistance: Homozygous wild-type VKORC1 G/G with extensive clearance requires higher therapeutic titration.';
  }

  return {
    predictedDailyDoseMg: dailyDose,
    predictedWeeklyDoseMg: +weeklyDose.toFixed(1),
    doseAdjustmentPercentage: adjustmentPercent,
    riskCategory,
    geneticExplanation,
  };
}

/**
 * Generates Simulated 14-Day INR Kinetic Curve comparing empirical (5 mg) vs PGx-guided dosing
 */
export function simulateWarfarinINRKinetics(
  cyp2c9Diplotype: string,
  vkorc1Genotype: string,
  prescribedDailyDose: number
): { day: number; inrStandardEmpirical: number; inrPgxGuided: number }[] {
  const points = [];
  
  // Elimination half-life factor based on CYP2C9
  let clearanceFactor = 1.0;
  if (cyp2c9Diplotype === '*1/*2') clearanceFactor = 0.75;
  if (cyp2c9Diplotype === '*1/*3') clearanceFactor = 0.50;
  if (cyp2c9Diplotype === '*2/*2') clearanceFactor = 0.45;
  if (cyp2c9Diplotype === '*2/*3') clearanceFactor = 0.35;
  if (cyp2c9Diplotype === '*3/*3') clearanceFactor = 0.15;

  // Sensitivity factor based on VKORC1
  let sensitivityFactor = 1.0;
  if (vkorc1Genotype === 'A/G') sensitivityFactor = 1.4;
  if (vkorc1Genotype === 'A/A') sensitivityFactor = 2.1;

  for (let day = 1; day <= 14; day++) {
    // Standard empirical 5 mg/day
    const accumulationStandard = (5.0 / clearanceFactor) * (1 - Math.exp(-day / (3.0 / clearanceFactor)));
    const inrStandard = 1.0 + (accumulationStandard * 0.18 * sensitivityFactor);

    // PGx Guided Dose
    const accumulationPgx = (prescribedDailyDose / clearanceFactor) * (1 - Math.exp(-day / (3.0 / clearanceFactor)));
    const inrPgx = 1.0 + (accumulationPgx * 0.18 * sensitivityFactor);

    points.push({
      day,
      inrStandardEmpirical: +Math.min(10.0, inrStandard).toFixed(2),
      inrPgxGuided: +Math.min(10.0, inrPgx).toFixed(2),
    });
  }

  return points;
}

/**
 * CPIC & DPWG Drug-Gene Clinical Decision Support (CDS) Rules
 */
export const CPIC_DRUG_RULES: DrugGeneInteractionRule[] = [
  {
    drugName: 'Clopidogrel (Plavix)',
    drugCategory: 'Antiplatelet',
    standardDose: '75 mg PO daily',
    primaryGene: 'CYP2C19',
    targetPhenotypes: ['POOR_METABOLIZER', 'INTERMEDIATE_METABOLIZER'],
    recommendationLevel: 'STRONG',
    severity: 'CRITICAL',
    clinicalAlert: 'CPIC Level 1A Alert: Ineffective bioactivation of clopidogrel prodrug in CYP2C19 Poor/Intermediate Metabolizers leads to high on-treatment platelet reactivity and elevated risk of stent thrombosis and recurrent myocardial infarction.',
    alternativeTherapy: 'Prescribe Prasugrel (10 mg daily) or Ticagrelor (90 mg BID) which do not require CYP2C19 bioactivation (unless contraindicated by bleed risk or prior TIA/stroke).',
    evidenceSummary: 'TRITON-TIMI 38 & PLATO clinical trials confirm superior ischemic prevention with alternative P2Y12 inhibitors in CYP2C19 loss-of-function carriers.',
  },
  {
    drugName: 'Codeine / Tramadol',
    drugCategory: 'Analgesic (Opioid)',
    standardDose: '30-60 mg PO q4-6h',
    primaryGene: 'CYP2D6',
    targetPhenotypes: ['ULTRARAPID_METABOLIZER', 'POOR_METABOLIZER'],
    recommendationLevel: 'CONTRAINDICATED',
    severity: 'CRITICAL',
    clinicalAlert: 'FDA Black Box & CPIC Level 1A Warning: In CYP2D6 Ultrarapid Metabolizers, codeine is converted at accelerated rates to toxic morphine levels, risking fatal respiratory depression. In Poor Metabolizers, lack of active metabolite results in analgesia failure.',
    alternativeTherapy: 'Contraindicated. Use non-codeine analgesics (e.g. Acetaminophen, NSAIDs) or opioids not metabolized via CYP2D6 (e.g. Morphine, Hydromorphone, Fentanyl) with standard monitoring.',
    evidenceSummary: 'Fatal neonatal cases in breastfeeding mothers who were CYP2D6 UM, and fatal pediatric apnea post-tonsillectomy prompted global regulatory contraindications.',
  },
  {
    drugName: 'Azathioprine / 6-Mercaptopurine',
    drugCategory: 'Immunosuppressive / Antimetabolite',
    standardDose: '2.0-2.5 mg/kg daily',
    primaryGene: 'TPMT',
    targetPhenotypes: ['POOR_METABOLIZER', 'INTERMEDIATE_METABOLIZER'],
    recommendationLevel: 'STRONG',
    severity: 'CRITICAL',
    clinicalAlert: 'CPIC Level 1A Alert: Severe lack of TPMT methyltransferase enzyme causes cytotoxic 6-thioguanine nucleotides (6-TGN) to surge 100-fold, resulting in life-threatening bone marrow aplasia and severe pancytopenia.',
    alternativeTherapy: 'For Poor Metabolizers: Reduce dose by 90% (administer 10% of standard dose) and decrease frequency to 3x weekly. For Intermediate Metabolizers: Reduce initial dose by 30-50%.',
    evidenceSummary: 'Prospective pre-treatment TPMT and NUDT15 genotyping prevents lethal hematologic toxicity while preserving remission in leukemia and IBD.',
  },
  {
    drugName: 'Fluorouracil (5-FU) / Capecitabine',
    drugCategory: 'Chemotherapy (Antimetabolite)',
    standardDose: 'Standard oncology regimen',
    primaryGene: 'DPYD',
    targetPhenotypes: ['POOR_METABOLIZER', 'INTERMEDIATE_METABOLIZER'],
    recommendationLevel: 'CONTRAINDICATED',
    severity: 'CRITICAL',
    clinicalAlert: 'CPIC Level 1A Warning: Severe DPD deficiency impairs 5-FU clearance (>80% non-clearance), leading to life-threatening mucositis, intractable bloody diarrhea, septic neutropenia, and death.',
    alternativeTherapy: 'For Poor Metabolizers (AS 0): Contraindicated. Use non-fluoropyrimidine chemotherapy. For Intermediate Metabolizers (AS 1.0-1.5): Reduce starting dose by 50% with therapeutic drug monitoring (TDM).',
    evidenceSummary: 'DPYD *2A, *13, and c.2846A>T testing is mandatory across European and US oncology networks prior to initiating fluoropyrimidines.',
  },
  {
    drugName: 'Tamoxifen',
    drugCategory: 'Selective Estrogen Receptor Modulator (SERM)',
    standardDose: '20 mg PO daily',
    primaryGene: 'CYP2D6',
    targetPhenotypes: ['POOR_METABOLIZER'],
    recommendationLevel: 'MODERATE',
    severity: 'HIGH',
    clinicalAlert: 'CPIC Level 1A Alert: Tamoxifen requires CYP2D6 bioactivation into endoxifen (100-fold higher affinity for estrogen receptor). Poor Metabolizers have significantly lower endoxifen concentrations and higher breast cancer recurrence.',
    alternativeTherapy: 'In postmenopausal women, switch to an Aromatase Inhibitor (e.g. Anastrozole, Letrozole). In premenopausal women, consider higher dose tamoxifen (40 mg) or ovarian suppression + AI.',
    evidenceSummary: 'Endoxifen levels < 14 nM strongly correlate with decreased relapse-free survival in ER-positive breast cancer cohorts.',
  },
  {
    drugName: 'Simvastatin',
    drugCategory: 'HMG-CoA Reductase Inhibitor',
    standardDose: '40 mg PO daily',
    primaryGene: 'SLCO1B1',
    targetPhenotypes: ['POOR_METABOLIZER', 'INTERMEDIATE_METABOLIZER'],
    recommendationLevel: 'STRONG',
    severity: 'HIGH',
    clinicalAlert: 'CPIC Level 1A Alert: SLCO1B1 c.521T>C (*5) impairs hepatic OATP1B1 uptake transporter, leading to marked elevation of systemic simvastatin plasma levels and high risk of myopathy / rhabdomyolysis.',
    alternativeTherapy: 'Avoid simvastatin 40-80 mg. Prescribe lower dose simvastatin (20 mg) or switch to statins less dependent on OATP1B1 clearance (Rosuvastatin, Pravastatin) with monitoring.',
    evidenceSummary: 'SEARCH collaborative study identified an odds ratio > 16 for myopathy in patients homozygous for the SLCO1B1 *5 allele taking 80 mg simvastatin.',
  },
];

/**
 * 6 Evidence-Based PGx Clinical Presets
 */
export const PGX_PRESETS: PGxClinicalPreset[] = [
  {
    id: 'post-pci-clopidogrel',
    patientName: 'David R. (Age 58, Male)',
    clinicalIndication: 'Acute Coronary Syndrome post-DES (Drug-Eluting Stent) in LAD',
    category: 'Cardiology',
    prescribedDrug: 'Clopidogrel 75 mg PO daily',
    patientGenes: {
      CYP2C19: { maternal: '*2', paternal: '*2' }, // Poor Metabolizer
      CYP2D6: { maternal: '*1', paternal: '*1' },
      CYP2C9: { maternal: '*1', paternal: '*1' },
      VKORC1: { maternal: 'G', paternal: 'G' },
      TPMT: { maternal: '*1', paternal: '*1' },
      DPYD: { maternal: '*1', paternal: '*1' },
    },
    description: 'Post-percutaneous coronary intervention (PCI) patient placed on dual antiplatelet therapy (DAPT) with aspirin and clopidogrel.',
    clinicalRisk: 'Homozygous CYP2C19 *2/*2 (Poor Metabolizer). Zero active thiol metabolite formed. High on-treatment platelet reactivity risks catastrophic subacute stent thrombosis.',
    actionRequired: 'Immediately switch from Clopidogrel to Ticagrelor 90 mg BID or Prasugrel 10 mg daily.',
  },
  {
    id: 'pediatric-codeine-um',
    patientName: 'Liam T. (Age 7, Male)',
    clinicalIndication: 'Post-Tonsillectomy & Adenoidectomy Analgesia',
    category: 'Pediatric Otolaryngology',
    prescribedDrug: 'Codeine 30 mg PO q6h PRN pain',
    patientGenes: {
      CYP2C19: { maternal: '*1', paternal: '*1' },
      CYP2D6: { maternal: '*1', paternal: '*1xN' }, // Ultrarapid Metabolizer (Duplication)
      CYP2C9: { maternal: '*1', paternal: '*1' },
      VKORC1: { maternal: 'G', paternal: 'G' },
      TPMT: { maternal: '*1', paternal: '*1' },
      DPYD: { maternal: '*1', paternal: '*1' },
    },
    description: 'Child prescribed oral codeine for severe throat pain following tonsillectomy for obstructive sleep apnea.',
    clinicalRisk: 'CYP2D6 Ultrarapid Metabolizer (duplication *1/*1xN). Ultra-fast bioactivation converts codeine to massive morphine concentrations, precipitating fatal nocturnal respiratory arrest.',
    actionRequired: 'Codeine is strictly contraindicated. Discontinue immediately. Prescribe oral acetaminophen and ibuprofen alternating, or non-codeine rescue.',
  },
  {
    id: 'all-thiopurine-tpmt',
    patientName: 'Aarav M. (Age 9, Male)',
    clinicalIndication: 'B-Cell Acute Lymphoblastic Leukemia (ALL) Maintenance',
    category: 'Pediatric Oncology',
    prescribedDrug: '6-Mercaptopurine (6-MP) 75 mg/m² PO daily',
    patientGenes: {
      CYP2C19: { maternal: '*1', paternal: '*1' },
      CYP2D6: { maternal: '*1', paternal: '*1' },
      CYP2C9: { maternal: '*1', paternal: '*1' },
      VKORC1: { maternal: 'G', paternal: 'G' },
      TPMT: { maternal: '*3A', paternal: '*3A' }, // Homozygous Deficient
      DPYD: { maternal: '*1', paternal: '*1' },
    },
    description: 'Pediatric leukemia patient undergoing protocol maintenance chemotherapy with methotrexate and daily 6-MP.',
    clinicalRisk: 'TPMT *3A/*3A homozygous deficiency. Zero S-methylation of thiopurines. Cytotoxic 6-TGN accumulation causes fatal bone marrow aplasia and life-threatening sepsis if full dose given.',
    actionRequired: 'Reduce 6-MP dose by 90% (administer 10% of standard protocol dose, 3x/week) and monitor weekly CBC.',
  },
  {
    id: 'colorectal-5fu-dpyd',
    patientName: 'Eleanor W. (Age 64, Female)',
    clinicalIndication: 'Stage III Colorectal Adenocarcinoma (FOLFOX Regimen)',
    category: 'Medical Oncology',
    prescribedDrug: '5-Fluorouracil (5-FU) 2400 mg/m² 46-hr infusion',
    patientGenes: {
      CYP2C19: { maternal: '*1', paternal: '*1' },
      CYP2D6: { maternal: '*1', paternal: '*1' },
      CYP2C9: { maternal: '*1', paternal: '*1' },
      VKORC1: { maternal: 'G', paternal: 'G' },
      TPMT: { maternal: '*1', paternal: '*1' },
      DPYD: { maternal: '*1', paternal: '*2A' }, // Intermediate Metabolizer (AS 1.0)
    },
    description: 'Patient scheduled for adjuvant FOLFOX chemotherapy containing infusional 5-FU following colon resection.',
    clinicalRisk: 'DPYD *1/*2A (exon 14 splice loss). DPD clearance capacity halved. Standard dosing carries a 40% risk of grade 4-5 lethal enteritis, mucosal sloughing, and agranulocytosis.',
    actionRequired: 'Reduce starting 5-FU dose by 50% (1200 mg/m²). Perform PK-guided therapeutic drug monitoring for cycle 2.',
  },
  {
    id: 'warfarin-high-sensitivity',
    patientName: 'Harold C. (Age 72, Male)',
    clinicalIndication: 'Non-Valvular Atrial Fibrillation Stroke Prevention',
    category: 'Hematology / Anticoagulation',
    prescribedDrug: 'Warfarin 5 mg PO daily (Empirical)',
    patientGenes: {
      CYP2C19: { maternal: '*1', paternal: '*1' },
      CYP2D6: { maternal: '*1', paternal: '*1' },
      CYP2C9: { maternal: '*2', paternal: '*3' }, // High Sensitivity
      VKORC1: { maternal: 'A', paternal: 'A' }, // Homozygous Sensitive
      TPMT: { maternal: '*1', paternal: '*1' },
      DPYD: { maternal: '*1', paternal: '*1' },
    },
    description: 'Elderly patient with atrial fibrillation prescribed traditional empirical 5 mg warfarin induction.',
    clinicalRisk: 'Compound heterozygous CYP2C9 *2/*3 and VKORC1 A/A. S-warfarin clearance is 65% reduced and target enzyme is exquisitely sensitive. Empirical 5 mg dose drives INR > 9.0 by Day 6 with massive bleeding risk.',
    actionRequired: 'Calculate IWPC pharmacogenetic dose: Initiate warfarin at 1.4 mg/day (or consider direct oral anticoagulant DOAC if renal function permits).',
  },
  {
    id: 'hiv-abacavir-hla',
    patientName: 'Marcus K. (Age 36, Male)',
    clinicalIndication: 'Treatment-Naive HIV-1 Antiretroviral Initiation',
    category: 'Infectious Disease',
    prescribedDrug: 'Triumeq (Abacavir / Dolutegravir / Lamivudine)',
    patientGenes: {
      CYP2C19: { maternal: '*1', paternal: '*1' },
      CYP2D6: { maternal: '*1', paternal: '*1' },
      CYP2C9: { maternal: '*1', paternal: '*1' },
      VKORC1: { maternal: 'G', paternal: 'G' },
      TPMT: { maternal: '*1', paternal: '*1' },
      DPYD: { maternal: '*1', paternal: '*1' },
    },
    description: 'Newly diagnosed HIV-1 patient with viral load 140,000 copies/mL being initiated on first-line single-tablet regimen.',
    clinicalRisk: 'Patient carries HLA-B*57:01 allele. Abacavir binding to HLA-B*57:01 antigen groove alters self-peptide presentation, triggering systemic CD8+ T-cell hyperactivation and fatal multi-organ hypersensitivity.',
    actionRequired: 'Abacavir is permanently CONTRAINDICATED. Switch to Biktarvy (Bictegravir / Tenofovir Alafenamide / Emtricitabine).',
  },
];

/**
 * Clinical Decision Support (CDS) Evaluation Engine
 * Evaluates a patient's genetic diplotypes against candidate drugs and generates alerts.
 */
export function evaluatePatientPGxCDS(
  prescribedDrug: string,
  diplotypes: {
    cyp2c19: GeneDiplotype;
    cyp2d6: GeneDiplotype;
    tpmt: GeneDiplotype;
    dpyd: GeneDiplotype;
    hlaB5701Positive?: boolean;
    hlaB1502Positive?: boolean;
    hlaB5801Positive?: boolean;
  }
): {
  alerts: DrugGeneInteractionRule[];
  safetyStatus: 'SAFE' | 'ACTION_REQUIRED' | 'CONTRAINDICATED';
} {
  const triggeredAlerts: DrugGeneInteractionRule[] = [];

  // Match drug rules
  for (const rule of CPIC_DRUG_RULES) {
    if (prescribedDrug.toLowerCase().includes(rule.drugName.split(' ')[0].toLowerCase())) {
      let patientPhenotype: MetabolizerPhenotype = 'NORMAL_METABOLIZER';

      if (rule.primaryGene === 'CYP2C19') patientPhenotype = diplotypes.cyp2c19.phenotype;
      if (rule.primaryGene === 'CYP2D6') patientPhenotype = diplotypes.cyp2d6.phenotype;
      if (rule.primaryGene === 'TPMT') patientPhenotype = diplotypes.tpmt.phenotype;
      if (rule.primaryGene === 'DPYD') patientPhenotype = diplotypes.dpyd.phenotype;

      if (rule.targetPhenotypes.includes(patientPhenotype)) {
        triggeredAlerts.push(rule);
      }
    }
  }

  // HLA Specific checks
  if (prescribedDrug.toLowerCase().includes('abacavir') && diplotypes.hlaB5701Positive) {
    triggeredAlerts.push({
      drugName: 'Abacavir (Ziagen)',
      drugCategory: 'Antiretroviral (NRTI)',
      standardDose: '600 mg PO daily',
      primaryGene: 'HLA-B',
      targetPhenotypes: ['POOR_METABOLIZER'], // proxy
      recommendationLevel: 'CONTRAINDICATED',
      severity: 'CRITICAL',
      clinicalAlert: 'MANDATORY BLACK BOX WARNING: Patient is HLA-B*57:01 positive. Abacavir is strictly contraindicated due to 100% specific risk of fatal systemic multi-organ hypersensitivity syndrome.',
      alternativeTherapy: 'Prescribe Tenofovir Disoproxil/Alafenamide or a non-abacavir NRTI backbone.',
      evidenceSummary: 'PREDICT-1 randomized trial proved that prospective HLA-B*57:01 screening completely eliminates abacavir hypersensitivity reactions.',
    });
  }

  let safetyStatus: 'SAFE' | 'ACTION_REQUIRED' | 'CONTRAINDICATED' = 'SAFE';
  if (triggeredAlerts.some(a => a.recommendationLevel === 'CONTRAINDICATED')) {
    safetyStatus = 'CONTRAINDICATED';
  } else if (triggeredAlerts.length > 0) {
    safetyStatus = 'ACTION_REQUIRED';
  }

  return { alerts: triggeredAlerts, safetyStatus };
}
