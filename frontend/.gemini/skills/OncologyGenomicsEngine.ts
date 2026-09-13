/**
 * OncologyGenomicsEngine.ts
 * Clinical Somatic Genomics, Next-Generation Sequencing (NGS) Panel Modeling,
 * Variant Allele Fraction (VAF %) Deconvolution, AMP/ASCO/CAP 4-Tier Classification,
 * and Targeted Precision Oncology Therapy Matchmaking.
 * 
 * Location: frontend/.gemini/skills/OncologyGenomicsEngine.ts
 */

export type AmpTier = 'Tier I (Strong Clinical Significance)' | 'Tier II (Potential Clinical Significance)' | 'Tier III (VUS)' | 'Tier IV (Benign / Likely Benign)';
export type EvidenceLevel = 'Level A' | 'Level B' | 'Level C' | 'Level D' | 'None';

export interface SomaticVariant {
  id: string;
  gene: string;
  transcript: string;
  hgvsCoding: string;    // e.g. c.2573T>G
  hgvsProtein: string;   // e.g. p.Leu858Arg (L858R)
  exon: number;
  variantType: 'SNV' | 'INDEL' | 'FUSION' | 'CNV' | 'INSERTION';
  readDepth: number;     // total reads (e.g. 1250x)
  altDepth: number;      // mutant reads
  vafPercent: number;    // (altDepth / readDepth) * 100
  ampTier: AmpTier;
  evidenceLevel: EvidenceLevel;
  clinicalImpact: 'Activating Driver' | 'Secondary Resistance' | 'Inactivating Tumor Suppressor' | 'Unknown';
  targetedTherapies: {
    drugName: string;
    drugClass: string;
    fdaApproved: boolean;
    recommendation: 'First-Line Preferred' | 'Subsequent Line' | 'Resistance Overcoming' | 'Clinical Trial';
    clinicalNotes: string;
  }[];
  resistanceMechanism?: string;
  isSubclonal: boolean;
}

export interface TumorImmunogenomics {
  tmbMutMb: number;            // Tumor Mutational Burden (mutations / Megabase)
  tmbStatus: 'TMB-High (>= 10 mut/Mb)' | 'TMB-Intermediate (6-9 mut/Mb)' | 'TMB-Low (< 6 mut/Mb)';
  msiStatus: 'MSI-High (dMMR)' | 'MSI-Stable (pMMR)';
  pdl1TpsPercent: number;      // Tumor Proportion Score (0-100%)
  pdl1Category: '< 1% (Negative)' | '1-49% (Low-Positive)' | '>= 50% (High-Positive)';
  immunotherapyResponse: 'Highly Favorable' | 'Intermediate' | 'Unfavorable / Resistance Expected';
  immunotherapyRationale: string;
}

export interface OncologyPatientCase {
  id: string;
  patientName: string;
  age: number;
  tumorType: string;
  histology: string;
  stage: string;
  smokingStatus: string;
  biopsySite: string;
  tumorCellularityPercent: number; // Tumor purity (e.g. 60%)
  variants: SomaticVariant[];
  immunogenomics: TumorImmunogenomics;
  currentLineOfTherapy: number;
  treatmentHistory: string[];
}

// Helper: Calculate Variant Allele Fraction (VAF)
export function calculateVaf(altReads: number, totalReads: number): number {
  if (totalReads <= 0) return 0;
  return Number(((altReads / totalReads) * 100).toFixed(2));
}

// Helper: Assess whether a variant is clonal or subclonal based on tumor purity
export function assessClonality(vafPercent: number, tumorPurityPercent: number): { isSubclonal: boolean; clonalFraction: number } {
  // In a diploid tumor without copy number alterations, expected heterozygous somatic VAF = purity / 2
  const expectedClonalVaf = Math.max(tumorPurityPercent / 2, 5);
  const clonalFraction = Number((vafPercent / expectedClonalVaf).toFixed(2));
  // If VAF is significantly lower than expected (< 65% of expected clonal VAF), it is subclonal
  const isSubclonal = clonalFraction < 0.65;
  return { isSubclonal, clonalFraction };
}

// Helper: Assign AMP/ASCO/CAP Tier based on gene, mutation, and tumor type
export function assignAmpTier(gene: string, proteinChange: string, tumorType: string): { ampTier: AmpTier; evidenceLevel: EvidenceLevel } {
  const g = gene.toUpperCase();
  const p = proteinChange.toUpperCase();
  const t = tumorType.toLowerCase();

  // Tier I Level A: FDA-approved biomarkers in specific diseases
  if (
    (g === 'EGFR' && (p.includes('L858R') || p.includes('19DEL') || p.includes('T790M')) && t.includes('lung')) ||
    (g === 'KRAS' && p.includes('G12C') && t.includes('lung')) ||
    (g === 'BRAF' && p.includes('V600E') && (t.includes('melanoma') || t.includes('colorectal') || t.includes('lung'))) ||
    (g === 'ALK' && t.includes('lung')) ||
    (g === 'ERBB2' && (t.includes('breast') || t.includes('gastric'))) ||
    (g === 'BRCA1' || g === 'BRCA2') && (t.includes('ovarian') || t.includes('breast') || t.includes('prostate'))
  ) {
    return { ampTier: 'Tier I (Strong Clinical Significance)', evidenceLevel: 'Level A' };
  }

  // Tier I Level B: Well powered studies
  if (
    (g === 'KRAS' && (p.includes('G12D') || p.includes('G12V')) && t.includes('colorectal')) ||
    (g === 'MET' && p.includes('EXON 14'))
  ) {
    return { ampTier: 'Tier I (Strong Clinical Significance)', evidenceLevel: 'Level B' };
  }

  // Tier II Level C: Off-label FDA approved in other tumor types
  if (
    (g === 'KRAS' && p.includes('G12C') && t.includes('colorectal')) ||
    (g === 'BRAF' && p.includes('V600E') && t.includes('thyroid')) ||
    (g === 'ERBB2' && t.includes('lung'))
  ) {
    return { ampTier: 'Tier II (Potential Clinical Significance)', evidenceLevel: 'Level C' };
  }

  // Tier II Level D: Preclinical / emerging investigational targets
  if (g === 'EGFR' && p.includes('C797S')) {
    return { ampTier: 'Tier II (Potential Clinical Significance)', evidenceLevel: 'Level D' };
  }

  // Tier III: Variants of Uncertain Significance (VUS)
  return { ampTier: 'Tier III (VUS)', evidenceLevel: 'None' };
}

// Helper: Evaluate Immunogenomics Triad (TMB, MSI, PD-L1)
export function evaluateImmunogenomics(
  tmb: number,
  msi: 'MSI-High (dMMR)' | 'MSI-Stable (pMMR)',
  pdl1Tps: number
): TumorImmunogenomics {
  const tmbStatus = tmb >= 10 ? 'TMB-High (>= 10 mut/Mb)' : tmb >= 6 ? 'TMB-Intermediate (6-9 mut/Mb)' : 'TMB-Low (< 6 mut/Mb)';
  const pdl1Category = pdl1Tps >= 50 ? '>= 50% (High-Positive)' : pdl1Tps >= 1 ? '1-49% (Low-Positive)' : '< 1% (Negative)';

  let response: 'Highly Favorable' | 'Intermediate' | 'Unfavorable / Resistance Expected';
  let rationale = '';

  if (msi === 'MSI-High (dMMR)' || (tmb >= 10 && pdl1Tps >= 50)) {
    response = 'Highly Favorable';
    rationale = 'Concordant hypermutation and high neoantigen burden (MSI-H and/or TMB >= 10 mut/Mb with strong PD-L1 expression). Predicts robust objective response to Anti-PD-1 monotherapy (Pembrolizumab / Nivolumab).';
  } else if (pdl1Tps >= 50 || tmb >= 10 || (pdl1Tps >= 1 && tmb >= 6)) {
    response = 'Intermediate';
    rationale = 'Partial biomarker positivity (either elevated PD-L1 TPS >= 50% or TMB-High alone). First-line chemo-immunotherapy combination (Platinum doublet + Pembrolizumab) preferred over monotherapy.';
  } else {
    response = 'Unfavorable / Resistance Expected';
    rationale = 'TMB-Low, MSS (Microsatellite Stable), and PD-L1 TPS < 1%. Immune desert / cold phenotype. Immune checkpoint monotherapy has low response rates (< 10%). Platinum doublet chemotherapy or targeted TKI preferred.';
  }

  return {
    tmbMutMb: tmb,
    tmbStatus,
    msiStatus: msi,
    pdl1TpsPercent: pdl1Tps,
    pdl1Category,
    immunotherapyResponse: response,
    immunotherapyRationale: rationale,
  };
}

// Simulate Clonal Evolution & Secondary Resistance under Targeted TKI selection pressure
export function simulateClonalEvolution(
  initialPurity: number,
  driverVaf: number,
  resistanceVaf: number,
  monthsOnTherapy: number,
  therapyType: '1st-Gen TKI (Erlotinib)' | '3rd-Gen TKI (Osimertinib)' | 'Targeted + Monoclonal (Amivantamab + Lazertinib)' | 'Untreated'
): { months: number[]; driverClonePct: number[]; resistantClonePct: number[]; totalTumorVolumeCm3: number[] } {
  const months: number[] = [];
  const driverClonePct: number[] = [];
  const resistantClonePct: number[] = [];
  const totalTumorVolumeCm3: number[] = [];

  let curDriver = driverVaf;
  let curResistant = resistanceVaf;
  let baselineTumorVolume = 15.0; // cm3

  for (let m = 0; m <= monthsOnTherapy; m += 2) {
    months.push(m);

    if (therapyType === '1st-Gen TKI (Erlotinib)') {
      // Sensitive driver shrinks rapidly, but T790M resistant subclone grows exponentially
      curDriver = Math.max(driverVaf * Math.exp(-0.25 * m), 3.0);
      curResistant = Math.min(resistanceVaf * Math.exp(0.35 * m), 45.0);
    } else if (therapyType === '3rd-Gen TKI (Osimertinib)') {
      // Osimertinib eliminates both L858R and T790M, but C797S subclone emerges around month 10-14
      curDriver = Math.max(driverVaf * Math.exp(-0.20 * m), 2.0);
      curResistant = m > 8 ? Math.min(1.0 * Math.exp(0.30 * (m - 8)), 40.0) : Math.max(resistanceVaf * Math.exp(-0.15 * m), 0.5);
    } else if (therapyType === 'Targeted + Monoclonal (Amivantamab + Lazertinib)') {
      // Bispecific antibody + 3rd gen TKI suppresses tertiary resistant clones
      curDriver = Math.max(driverVaf * Math.exp(-0.18 * m), 2.0);
      curResistant = Math.max(resistanceVaf * Math.exp(-0.12 * m), 1.0);
    } else {
      // Untreated growth
      curDriver = Math.min(driverVaf * Math.exp(0.08 * m), 65.0);
      curResistant = Math.min(resistanceVaf * Math.exp(0.08 * m), 35.0);
    }

    driverClonePct.push(Number(curDriver.toFixed(1)));
    resistantClonePct.push(Number(curResistant.toFixed(1)));

    // Combined volumetric proxy
    const vol = baselineTumorVolume * ((curDriver + curResistant) / (driverVaf + resistanceVaf));
    totalTumorVolumeCm3.push(Number(Math.max(vol, 0.5).toFixed(1)));
  }

  return {
    months,
    driverClonePct,
    resistantClonePct,
    totalTumorVolumeCm3,
  };
}

// Master Presets Library of Oncology NGS Clinical Cases
export const ONCOLOGY_CASES: OncologyPatientCase[] = [
  {
    id: 'nsclc-egfr-evolution',
    patientName: 'David K., 61M',
    age: 61,
    tumorType: 'Non-Small Cell Lung Cancer (NSCLC)',
    histology: 'Lung Adenocarcinoma, TTF-1 Positive',
    stage: 'Stage IVB (Brain and Bone Metastases)',
    smokingStatus: 'Never Smoker (< 100 lifetime cigarettes)',
    biopsySite: 'Right Lower Lobe Lung Core Biopsy',
    tumorCellularityPercent: 65,
    currentLineOfTherapy: 1,
    treatmentHistory: ['Chemo-naive', 'Scheduled for First-Line Targeted Therapy Evaluation'],
    immunogenomics: {
      tmbMutMb: 3.2,
      tmbStatus: 'TMB-Low (< 6 mut/Mb)',
      msiStatus: 'MSI-Stable (pMMR)',
      pdl1TpsPercent: 5,
      pdl1Category: '1-49% (Low-Positive)',
      immunotherapyResponse: 'Unfavorable / Resistance Expected',
      immunotherapyRationale: 'EGFR-mutated lung adenocarcinoma characteristically exhibits cold immune microenvironments despite low PD-L1. Targeted EGFR TKI is superior to immunotherapy.',
    },
    variants: [
      {
        id: 'egfr-l858r',
        gene: 'EGFR',
        transcript: 'NM_005228.5',
        hgvsCoding: 'c.2573T>G',
        hgvsProtein: 'p.Leu858Arg (L858R)',
        exon: 21,
        variantType: 'SNV',
        readDepth: 1420,
        altDepth: 462,
        vafPercent: 32.54,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level A',
        clinicalImpact: 'Activating Driver',
        isSubclonal: false,
        targetedTherapies: [
          {
            drugName: 'Osimertinib',
            drugClass: '3rd-Generation CNS-Penetrant EGFR TKI',
            fdaApproved: true,
            recommendation: 'First-Line Preferred',
            clinicalNotes: 'FLAURA trial standard of care. Superior PFS (18.9 mo) and OS (38.6 mo) vs 1st gen TKIs with intracranial efficacy.',
          },
          {
            drugName: 'Erlotinib / Gefitinib',
            drugClass: '1st-Generation Reversible EGFR TKI',
            fdaApproved: true,
            recommendation: 'Subsequent Line',
            clinicalNotes: 'Legacy standard. High risk of emergence of secondary gatekeeper T790M resistance mutation within 9-12 months.',
          },
        ],
      },
      {
        id: 'tp53-r273h',
        gene: 'TP53',
        transcript: 'NM_000546.6',
        hgvsCoding: 'c.818G>A',
        hgvsProtein: 'p.Arg273His (R273H)',
        exon: 8,
        variantType: 'SNV',
        readDepth: 1280,
        altDepth: 410,
        vafPercent: 32.03,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level B',
        clinicalImpact: 'Inactivating Tumor Suppressor',
        isSubclonal: false,
        targetedTherapies: [],
      },
      {
        id: 'egfr-t790m-subclone',
        gene: 'EGFR',
        transcript: 'NM_005228.5',
        hgvsCoding: 'c.2369C>T',
        hgvsProtein: 'p.Thr790Met (T790M)',
        exon: 20,
        variantType: 'SNV',
        readDepth: 2150,
        altDepth: 43,
        vafPercent: 2.00,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level A',
        clinicalImpact: 'Secondary Resistance',
        isSubclonal: true,
        resistanceMechanism: 'Steric gatekeeper mutation conferring resistance to 1st/2nd-gen TKIs by restoring high ATP binding affinity.',
        targetedTherapies: [
          {
            drugName: 'Osimertinib',
            drugClass: '3rd-Generation EGFR TKI',
            fdaApproved: true,
            recommendation: 'Resistance Overcoming',
            clinicalNotes: 'Covalently binds Cys797; retains potent nM inhibition against T790M gatekeeper mutant.',
          },
        ],
      },
    ],
  },
  {
    id: 'colorectal-kras-braf',
    patientName: 'Elena V., 58F',
    age: 58,
    tumorType: 'Colorectal Cancer (mCRC)',
    histology: 'Invasive Colon Adenocarcinoma, CDX2 Positive',
    stage: 'Stage IV (Synchronous Liver Metastases)',
    smokingStatus: 'Former Smoker (15 pack-years)',
    biopsySite: 'Left Colon Primary Resection',
    tumorCellularityPercent: 70,
    currentLineOfTherapy: 1,
    treatmentHistory: ['FOLFOX adjuvant completed 18 months ago', 'Recent hepatic progression'],
    immunogenomics: {
      tmbMutMb: 4.8,
      tmbStatus: 'TMB-Low (< 6 mut/Mb)',
      msiStatus: 'MSI-Stable (pMMR)',
      pdl1TpsPercent: 0,
      pdl1Category: '< 1% (Negative)',
      immunotherapyResponse: 'Unfavorable / Resistance Expected',
      immunotherapyRationale: 'MSS colorectal cancers are profoundly resistant to immune checkpoint blockade. Checkpoint inhibitors are NOT indicated.',
    },
    variants: [
      {
        id: 'kras-g12c',
        gene: 'KRAS',
        transcript: 'NM_033360.4',
        hgvsCoding: 'c.34G>T',
        hgvsProtein: 'p.Gly12Cys (G12C)',
        exon: 2,
        variantType: 'SNV',
        readDepth: 1840,
        altDepth: 625,
        vafPercent: 33.97,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level A',
        clinicalImpact: 'Activating Driver',
        isSubclonal: false,
        resistanceMechanism: 'Confers intrinsic resistance to anti-EGFR monoclonal antibodies (Cetuximab, Panitumumab) when used as monotherapy.',
        targetedTherapies: [
          {
            drugName: 'Adagrasib + Cetuximab',
            drugClass: 'KRAS G12C Inhibitor + Anti-EGFR mAb',
            fdaApproved: true,
            recommendation: 'Subsequent Line',
            clinicalNotes: 'KRYSTAL-1 trial: Dual inhibition blocks rapid EGFR-mediated feedback reactivation seen in colorectal KRAS G12C.',
          },
          {
            drugName: 'FOLFIRI + Bevacizumab',
            drugClass: 'Chemotherapy + Anti-VEGF',
            fdaApproved: true,
            recommendation: 'First-Line Preferred',
            clinicalNotes: 'NCCN guideline standard for KRAS-mutated metastatic CRC.',
          },
        ],
      },
      {
        id: 'apc-r1450x',
        gene: 'APC',
        transcript: 'NM_000038.6',
        hgvsCoding: 'c.4348C>T',
        hgvsProtein: 'p.Arg1450Ter (R1450*)',
        exon: 16,
        variantType: 'SNV',
        readDepth: 1100,
        altDepth: 380,
        vafPercent: 34.55,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level B',
        clinicalImpact: 'Inactivating Tumor Suppressor',
        isSubclonal: false,
        targetedTherapies: [],
      },
    ],
  },
  {
    id: 'melanoma-braf-v600e',
    patientName: 'Marcus T., 49M',
    age: 49,
    tumorType: 'Cutaneous Malignant Melanoma',
    histology: 'Nodular Melanoma, S100/SOX10 Positive',
    stage: 'Stage IVM1c (Lung and Subcutaneous Metastases)',
    smokingStatus: 'Non-Smoker',
    biopsySite: 'Left Inguinal Lymph Node Biopsy',
    tumorCellularityPercent: 80,
    currentLineOfTherapy: 1,
    treatmentHistory: ['Treatment Naive'],
    immunogenomics: {
      tmbMutMb: 18.4,
      tmbStatus: 'TMB-High (>= 10 mut/Mb)',
      msiStatus: 'MSI-Stable (pMMR)',
      pdl1TpsPercent: 60,
      pdl1Category: '>= 50% (High-Positive)',
      immunotherapyResponse: 'Highly Favorable',
      immunotherapyRationale: 'UV-signature hypermutation (TMB 18.4 mut/Mb) and high PD-L1 TPS (60%). Patient has two excellent frontline options: Dual Immunotherapy (Nivolumab + Ipilimumab) or Targeted BRAF+MEK inhibition.',
    },
    variants: [
      {
        id: 'braf-v600e',
        gene: 'BRAF',
        transcript: 'NM_004333.6',
        hgvsCoding: 'c.1799T>A',
        hgvsProtein: 'p.Val600Glu (V600E)',
        exon: 15,
        variantType: 'SNV',
        readDepth: 2300,
        altDepth: 910,
        vafPercent: 39.57,
        ampTier: 'Tier I (Strong Clinical Significance)',
        evidenceLevel: 'Level A',
        clinicalImpact: 'Activating Driver',
        isSubclonal: false,
        targetedTherapies: [
          {
            drugName: 'Dabrafenib + Trametinib',
            drugClass: 'BRAF Inhibitor + MEK Inhibitor',
            fdaApproved: true,
            recommendation: 'First-Line Preferred',
            clinicalNotes: 'Rapid tumor regression (ORR > 65%). Combined MEK inhibition delays acquired paradoxical MAPK pathway reactivation.',
          },
          {
            drugName: 'Encorafenib + Binimetinib',
            drugClass: '2nd-Generation BRAF + MEK Inhibitor',
            fdaApproved: true,
            recommendation: 'First-Line Preferred',
            clinicalNotes: 'COLUMBUS trial: prolonged dissociation half-life (> 30 hrs) and reduced pyrexia rate.',
          },
        ],
      },
    ],
  },
];
