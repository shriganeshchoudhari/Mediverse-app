/**
 * Medical Genetics & Genomics: Epigenetics, Genomic Imprinting & Trinucleotide Repeat Expansions
 * Authoritative medical content derived from Thompson & Thompson Genetics in Medicine (9th ed.), Nussbaum.
 * Mapped to NMC CBME Competencies: GN5.1, GN5.2, GN6.1, GN6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const EPIGENETICS_IMPRINTING_TRINUCLEOTIDE_MODULE: PhysiologyLessonModule = {
  id: "genetics-epigenetics-imprinting-trinucleotide",
  unitCode: "GN5.1",
  title: "Epigenetics, Genomic Imprinting (Prader-Willi vs Angelman) & Trinucleotide Repeat Expansions",
  competencies: ["GN5.1", "GN5.2", "GN6.1", "GN6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GENETICS",
  markdownContent: `
# Epigenetics, Genomic Imprinting & Trinucleotide Repeat Expansions

Epigenetic mechanisms alter gene expression without altering the primary nucleotide sequence, exemplified by parent-of-origin genomic imprinting and dynamic trinucleotide repeat instability.

---

## 1. Genomic Imprinting: Prader-Willi vs Angelman Syndrome

Genomic imprinting is the differential epigenetic silencing (via DNA methylation and histone modification) of a gene depending on whether it is inherited from the mother or the father. Both syndromes involve the critical **$15q11-q13$ locus**:

- **Normal 15q11-q13 Imprinting Architecture**:
  - *Maternal chromosome 15*: Paternally-expressed genes (*SNRPN*, *NDN*) are epigenetically SILENCED (imprinted). *UBE3A* is ACTIVE.
  - *Paternal chromosome 15*: Maternally-expressed gene (*UBE3A*) is epigenetically SILENCED (imprinted). *SNRPN* and *NDN* are ACTIVE.

| Clinical Parameter | Prader-Willi Syndrome (PWS) | Angelman Syndrome (AS) |
| :--- | :--- | :--- |
| **Genetic Defect** | **Loss of PATERNALLY expressed genes at $15q11-q13$** (*SNRPN*, *necdin*, snoRNAs). | **Loss of MATERNALLY expressed gene at $15q11-q13$** (***UBE3A*** ubiquitin-protein ligase). |
| **Molecular Mechanisms** | 1. **Paternal $15q11-q13$ Deletion ($70\\%$)**.<br>2. **Maternal Uniparental Disomy (UPD, $25\\%$)**: Inherits two maternal copies of chromosome 15 (no paternal copy).<br>3. Imprinting center defect ($5\\%$). | 1. **Maternal $15q11-q13$ Deletion ($70\\%$)**.<br>2. Paternal Uniparental Disomy (UPD, $5\\%$).<br>3. ***UBE3A* gene mutation ($10\\%$)**.<br>4. Imprinting center defect ($5\\%$). |
| **Infancy Phenotype** | Severe neonatal **hypotonia ("floppy infant")**, poor suckling reflex, failure to thrive, cryptorchidism, small hands and feet. | Severe intellectual disability, microcephaly, jerky puppet-like gait (**"happy puppet"**). |
| **Childhood Phenotype** | Insatiable appetite (**Hyperphagia** secondary to elevated ghrelin levels) $\\rightarrow$ **Severe Morbid Obesity**, type 2 diabetes, hypogonadism, behavioral problems (skin picking). | **Inappropriate paroxysms of laughter**, absent speech, severe ataxia, seizure disorder with abnormal EEG. |
| **Diagnostic Gold Standard** | **Methylation-Specific PCR (MS-PCR)** (demonstrates maternal-only methylation pattern). | **MS-PCR** $+$ targeted ***UBE3A* gene sequencing**. |

---

## 2. Trinucleotide Repeat Expansion Disorders

Trinucleotide repeat diseases are characterized by **Genetic Anticipation** (the disease manifests at an earlier age of onset and with increased clinical severity in successive generations as the dynamic unstable repeat tract expands during gametogenesis):

| Disease & Gene | Unstable Trinucleotide Repeat | Primary Expansion Transmission | Pathophysiologic Mechanism | Canonical Clinical Features |
| :--- | :--- | :--- | :--- | :--- |
| **Huntington Disease**<br>(*HTT* gene on $4p16.3$) | **$(CAG)_n$** (Normal $<26$, Disease **$\\ge 36 - 40+$**) | **Paternal Transmission** (expands predominantly during spermatogenesis). | **Polyglutamine (polyQ) Toxic Gain of Function**: Mutated huntingtin protein aggregates in caudate nucleus and putamen $\\implies$ profound **striatal GABAergic neuronal atrophy**. | Onset age 35–50; Progressive **Chorea** (involuntary writhing movements), depression, cognitive decline, executive dementia, suicide. |
| **Fragile X Syndrome**<br>(*FMR1* gene on $Xq27.3$) | **$(CGG)_n$** (Normal $<45$, Disease **$>200$ Full Mutation**) | **Maternal Transmission** (premutation expands to full mutation during female oogenesis). | **Hypermethylation & Epigenetic Gene Silencing**: CGG expansion triggers promoter methylation $\\implies$ complete loss of Fragile X Mental Retardation Protein (FMRP). | #1 inherited cause of intellectual disability in males; **Long narrow face with prominent jaw, Large everted ears, Post-pubertal Macroorchidism**, mitral valve prolapse, autism spectrum behaviors. |
| **Myotonic Dystrophy Type 1**<br>(*DMPK* gene on $19q13.3$) | **$(CTG)_n$** (Normal $<37$, Disease **$>50 - 1000+$**) | **Maternal Transmission** (massive expansion during oogenesis causes congenital form). | **Toxic RNA Gain of Function**: CUG-expanded RNA transcripts sequester muscleblind-like ($MBNL1$) splicing factors, leading to aberrant alternative splicing. | **Myotonia (delayed muscle relaxation after grip)**, distal muscle wasting, ptosis, **early-onset cataracts**, cardiac conduction blocks, frontal balding, gonadal atrophy. |
| **Friedreich Ataxia**<br>(*FXN* gene on $9q21.11$) | **$(GAA)_n$** (Autosomal Recessive!) | Both parents carriers of expanded GAA tract. | Intronic GAA expansion impairs transcriptional elongation $\\implies$ severe deficiency of **Frataxin** (iron-sulfur cluster protein) $\\implies$ mitochondrial iron overload. | Progressive spinocerebellar and sensory ataxia, loss of vibration/proprioception (posterior columns), absent DTRs, **Hypertrophic Cardiomyopathy**, pes cavus, kyphoscoliosis. |
`,
  clinicalVignettes: [
    {
      scenario: "A 6-year-old boy is brought to the genetics clinic for evaluation of rapid weight gain and severe behavioral outbursts surrounding food. His mother reports that he was extremely floppy as a newborn with severe feeding difficulties requiring a nasogastric tube for the first 3 months. However, by age 3, he developed an insatiable appetite, continuously scavenging for food and locking cupboards. Physical examination reveals a BMI of 34 kg/m2 (>99th percentile), small hands and feet, almond-shaped eyes, and bilateral cryptorchidism. Methylation-specific PCR demonstrates absence of the unmethylated paternal allele at the 15q11-q13 locus.",
      question: "Which of the following is the diagnosis, and what is the primary cytogenetic etiology in approximately 70% of affected patients?",
      options: [
        "Prader-Willi Syndrome; Microdeletion of the paternal chromosome 15q11-q13 region",
        "Angelman Syndrome; Microdeletion of the maternal chromosome 15q11-q13 region",
        "Prader-Willi Syndrome; Paternal uniparental disomy of chromosome 15",
        "Fragile X Syndrome; Expansion of a CGG trinucleotide repeat in the FMR1 gene"
      ],
      correctAnswerIndex: 0,
      explanation: "This child exhibits the classic biphasic clinical features of Prader-Willi Syndrome (infantile hypotonia with failure to thrive, followed in early childhood by hyperphagia, morbid obesity, hypogonadism, and characteristic facial features). Prader-Willi syndrome is caused by the loss of expression of paternally derived genes on chromosome 15q11-q13. In approximately 70% of cases, the underlying cause is a de novo microdeletion of the paternal 15q11-q13 region. In 25% of cases, it is caused by maternal uniparental disomy (inheriting two copies of maternal chromosome 15 and no paternal copy)."
    }
  ]
};
