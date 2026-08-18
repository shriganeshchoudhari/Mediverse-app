/**
 * Medical Genetics & Genomics: Molecular Cytogenetics, Next-Generation Sequencing & Genetic Counseling
 * Authoritative medical content derived from Thompson & Thompson Genetics in Medicine (9th ed.), ACMG Guidelines.
 * Mapped to NMC CBME Competencies: GN7.1, GN7.2, GN8.1, GN8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MOLECULAR_DIAGNOSTICS_GENETIC_COUNSELING_MODULE: PhysiologyLessonModule = {
  id: "genetics-molecular-diagnostics-genetic-counseling",
  unitCode: "GN7.1",
  title: "Molecular Cytogenetics (Karyotype, FISH, CMA), Next-Gen Sequencing (NGS) & Genetic Counseling",
  competencies: ["GN7.1", "GN7.2", "GN8.1", "GN8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GENETICS",
  markdownContent: `
# Molecular Cytogenetics, Next-Generation Sequencing & Genetic Counseling

Modern diagnostic genomics leverages a tier-based algorithm ranging from classical chromosomal banding to high-throughput whole-genome sequencing and non-directive genetic counseling.

---

## 1. Diagnostic Cytogenetic & Genomic Modalities

| Diagnostic Modality | Resolution & Technical Methodology | Target Genetic Abnormalities Detected | Primary Clinical Indications & Limitations |
| :--- | :--- | :--- | :--- |
| **G-Banded Karyotyping** | **$5 - 10\\text{ Mb}$** (requires living, dividing cells arrested in metaphase with Colchicine). | Major **Aneuploidies** (Trisomies 21, 18, 13; Turner; Klinefelter), **Large Deletions/Duplications**, **Balanced & Unbalanced Translocations**, Inversions. | Routine prenatal testing, recurrent pregnancy loss workup, suspected aneuploidy. *Cannot detect microdeletions or point mutations!* |
| **Fluorescence In Situ Hybridization (FISH)** | **$100 - 200\\text{ kb}$** (fluorescently labeled DNA probes hybridize to metaphase or interphase chromatin). | **Targeted Microdeletions** (e.g. *22q11.2* DiGeorge, *7q11.23* Williams, *15q11* PWS/AS), Gene Amplifications (e.g. *HER2/neu* in breast cancer), Known translocations (*BCR-ABL1* in CML). | Rapid diagnostic turnaround ($24 - 48\\text{ hours}$); *Requires a prior clinical suspicion of a specific target region (cannot perform genome-wide scan)*. |
| **Chromosomal Microarray (CMA / array CGH)** | **$20 - 50\\text{ kb}$** (competitive hybridization of patient vs control DNA on oligonucleotide/SNP chips). | **Submicroscopic Copy Number Variations (CNVs)**: Unbalanced microdeletions and microduplications across the entire genome; SNP arrays also detect **Absence of Heterozygosity (AOH / UPD)** and consanguinity. | **FIRST-TIER TEST** for unexplained **Intellectual Disability, Autism Spectrum Disorder (ASD), and Multiple Congenital Anomalies (MCA)**. *Cannot detect truly balanced translocations or single nucleotide variants!* |
| **Next-Generation Sequencing (NGS / WES / WGS)** | **Single Nucleotide Resolution (1 bp)** (massive parallel sequencing of exome [$1-2\\%$ of genome] or whole genome). | **Single Nucleotide Variants (SNVs)**, small insertions/deletions (indels), splice-site mutations, multigene panels (e.g. cardiomyopathy panels, hereditary cancer panels). | Unexplained undiagnosed genetic syndromes, heterogeneous monogenic disorders (e.g. Noonan, Muscular Dystrophy). Generates **Variants of Uncertain Significance (VUS)**. |

---

## 2. ACMG / AMP 5-Tier Genetic Variant Classification Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{ACMG Classification Tier} & \\textbf{Pathogenicity Probability} & \\textbf{Required Supporting Evidence} & \\textbf{Clinical Actionability} \\\\
\\hline
\\mathbf{\\text{Pathogenic (Class 5)}} & >99\\% & \\text{Null variants (nonsense/frameshift) in loss-of-function genes, proven segregation} & \\text{Confirmed diagnostic & predictive medical management} \\\\
\\mathbf{\\text{Likely Pathogenic (Class 4)}} & >90\\% & \\text{Well-established functional assays, de novo occurrence with consistent phenotype} & \\text{Actionable for clinical decision-making} \\\\
\\mathbf{\\text{Variant of Uncertain Significance (VUS)}} & \\text{Uncertain (10-90\\%)} & \\text{Conflicting or insufficient population/in silico evidence} & \\mathbf{\\text{DO NOT use to alter medical/surgical management!}} \\\\
\\mathbf{\\text{Likely Benign (Class 2)}} & <10\\% & \\text{High allele frequency in population databases (gnomAD), benign in silico} & \\text{Treated as normal variation} \\\\
\\mathbf{\\text{Benign (Class 1)}} & <1\\% & \\text{Common polymorphic allele ($>5\\%$ population frequency)} & \\text{No clinical consequence} \\\\
\\hline
\\end{array}$$

---

## 3. Principles of Clinical Genetic Counseling

- **Non-Directive Counseling**:
  - The counselor provides comprehensive, objective information regarding diagnosis, prognosis, recurrence risks, and reproductive options without imposing personal moral values or directing reproductive decisions.
- **Pre-Test & Post-Test Counseling**:
  - Discuss the possibility of **Secondary / Incidental Findings** (ACMG actionable gene list of 78 genes, e.g. *BRCA1/2*, *LDLR*, *TP53*, *MYH7* for which medical interventions exist).
  - Discuss the potential discovery of **Non-Paternity** or unexpected consanguinity.
  - Explore the psychological impact on extended family members (**Duty to Warn** vs Patient Confidentiality).
`,
  clinicalVignettes: [
    {
      scenario: "A 3-year-old boy is referred for genetic evaluation due to severe expressive language delay, intellectual disability, and mild dysmorphic features (hypertelorism, broad nasal bridge, and fifth finger clinodactyly). Routine G-banded karyotype (550-band resolution) is reported as 46,XY (normal male).",
      question: "Which of the following is the recommended gold-standard first-tier diagnostic investigation to identify the underlying genetic etiology?",
      options: [
        "Chromosomal Microarray (CMA / array CGH) to detect submicroscopic copy number variations (microdeletions and microduplications)",
        "Repeat G-banded karyotyping at 850-band resolution",
        "Skeletal survey radiographs",
        "Targeted Sanger sequencing of the CFTR gene"
      ],
      correctAnswerIndex: 0,
      explanation: "According to the American College of Medical Genetics and Genomics (ACMG) and international consensus guidelines, Chromosomal Microarray (CMA / array CGH) is the definitive first-tier diagnostic test for patients with unexplained developmental delay, intellectual disability, autism spectrum disorder, or multiple congenital anomalies. CMA provides >10-fold higher resolution than classical G-banded karyotyping, detecting submicroscopic copy number variations (microdeletions and microduplications) in approximately 15-20% of previously unexplained cases."
    }
  ]
};
