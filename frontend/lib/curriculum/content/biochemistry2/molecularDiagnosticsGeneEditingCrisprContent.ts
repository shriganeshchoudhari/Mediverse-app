/**
 * Medical Biochemistry II: Molecular Diagnostics, Recombinant DNA & CRISPR Gene Editing
 * Authoritative molecular biochemistry content derived from Harper's (32nd ed.), Lehninger (8th ed.).
 * Mapped to NMC CBME Competencies: BI8.1, BI8.2, PA4.4, PE12.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MOLECULAR_DIAGNOSTICS_GENE_EDITING_CRISPR_MODULE: PhysiologyLessonModule = {
  id: "biochemistry2-molecular-diagnostics-gene-editing-crispr",
  unitCode: "BI8.1",
  title: "Molecular Diagnostics & CRISPR: PCR Kinetics, Blotting (SNOW DROP), Sanger vs NGS & CRISPR-Cas9 (PAM)",
  competencies: ["BI8.1", "BI8.2", "PA4.4", "PE12.4"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Molecular Diagnostics, Recombinant DNA & CRISPR Gene Editing

Contemporary clinical medicine relies on high-resolution nucleic acid amplification, hybridization blotting, next-generation sequencing, and targeted CRISPR-Cas9 endonuclease genome engineering.

---

## 1. Molecular Blotting Techniques & PCR Kinetics Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Methodology} & \\textbf{Target Analyte} & \\textbf{Electrophoresis Matrix} & \\textbf{Probe / Detection Reagent} & \\textbf{Clinical / Diagnostic Application} \\\\
\\hline
\\textbf{Southern Blot} & \\mathbf{\\text{DNA (Deoxyribonucleic)}} & \\text{Agarose gel} & \\mathbf{\\text{Radiolabeled/fluorescent DNA probe}} & \\text{Gene deletions, RFLPs, triplet repeats} \\\\
\\textbf{Northern Blot} & \\mathbf{\\text{RNA (mRNA levels)}} & \\text{Formaldehyde-agarose gel} & \\mathbf{\\text{Complementary labeled RNA/cDNA}} & \\text{Gene expression and alternative splicing} \\\\
\\textbf{Western Blot} & \\mathbf{\\text{Protein (Antigen)}} & \\text{SDS-PAGE} & \\mathbf{\\text{Primary antibody + enzyme secondary}} & \\mathbf{\\text{Confirmatory Lyme/HIV; protein expression}} \\\\
\\textbf{Southwestern} & \\mathbf{\\text{DNA-Binding Proteins}} & \\text{SDS-PAGE} & \\mathbf{\\text{Double-stranded labeled DNA oligo}} & \\text{Transcription factors (c-Jun, c-Fos, NF-}\\kappa\\text{B)} \\\\
\\hline
\\end{array}$$

- **Mnemonic**: **S N O W** = **D R O P** (**S**outhern $\\rightarrow$ **D**NA; **N**orthern $\\rightarrow$ **R**NA; **W**estern $\\rightarrow$ **P**rotein).
- **PCR Thermal Cycling Architecture**:
  1. **Denaturation ($94-96^\\circ\\text{C}$)**: Heat breaks hydrogen bonds between double-stranded DNA templates.
  2. **Annealing ($50-65^\\circ\\text{C}$)**: Sequence-specific forward and reverse oligonucleotides anneal to flanking regions.
  3. **Extension ($72^\\circ\\text{C}$)**: Thermostable *Taq* DNA Polymerase synthesizes new complementary strands ($5' \\rightarrow 3'$).
  - Exponential Amplification: Yields $2^n$ copies after $n$ cycles ($30\\text{ cycles } \\approx 10^9\\text{-fold gain}$).

---

## 2. CRISPR-Cas9 Endonuclease Architecture \u0026 Gene Editing

- **System Components**:
  - **Cas9 Endonuclease**: RNA-guided DNA endonuclease derived from *Streptococcus pyogenes* that creates blunt double-strand breaks.
  - **Single-Guide RNA (sgRNA)**: Synthetic chimeric RNA combining crRNA (target recognition sequence $\\sim 20\\text{ nt}$) and tracrRNA (Cas9 scaffold binding handle).
  - **PAM (Protospacer Adjacent Motif)**: Conserved $5'\\text{-NGG-3'}$ sequence directly downstream of the target DNA strand that is required for Cas9 binding and cleavage.
- **DNA Repair \u0026 Therapeutic Outcomes**:
  - **Non-Homologous End Joining (NHEJ)**: Introduces random insertions/deletions (indels) $\\rightarrow$ frameshift $\\rightarrow$ **Gene Knockout** (e.g. disrupting *BCL11A* enhancer in Casgevy to reactivate fetal hemoglobin HbF).
  - **Homology-Directed Repair (HDR)**: In the presence of an exogenous homologous repair template $\\rightarrow$ **Precise Gene Knock-in / Point Mutation Correction**.
`,
  clinicalVignettes: [
    {
      scenario: "A 16-year-old male with severe sickle cell disease (HbSS) suffering from recurrent painful vaso-occlusive crises and acute chest syndrome undergoes ex vivo gene therapy with Exagamglogene autotemcel (Casgevy). Patient CD34+ hematopoietic stem and progenitor cells are harvested, electroporated with CRISPR-Cas9 targeting the erythroid-specific enhancer region of the BCL11A gene, and reinfused after myeloablative conditioning. Over the next 6 months, BCL11A expression in erythroid precursors decreases by 85%, resulting in a dramatic upregulation of gamma-globin chain synthesis and total fetal hemoglobin (HbF) levels rising to 42%, completely abolishing his vaso-occlusive crises.",
      question: "What is the molecular mechanism by which CRISPR-Cas9 achieves this therapeutic outcome in sickle cell disease?",
      options: [
        "Cas9 endonuclease guided by sgRNA induces a targeted double-strand break in the erythroid enhancer of the BCL11A gene adjacent to the 5'-NGG-3' PAM motif; non-homologous end joining introduces indels that disrupt the BCL11A repressor, releasing inhibition on gamma-globin transcription and restoring protective fetal hemoglobin (HbF)",
        "Cas9 inserts a functional beta-globin promoter via retroviral integration",
        "Cas9 cleaves the mutated beta-globin stop codon",
        "Cas9 performs homologous recombination using a synthetic delta-globin template"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient receives curative CRISPR-Cas9 gene editing (Casgevy): (1) Target Locus: BCL11A is a master zinc-finger transcriptional repressor that normally binds the gamma-globin promoter and shuts off fetal hemoglobin (HbF, alpha2-gamma2) synthesis after birth; (2) Molecular Mechanism: A synthetic single-guide RNA directs Cas9 endonuclease to introduce a double-strand break specifically in the erythroid-specific GATA1-binding enhancer region of BCL11A (adjacent to the 5'-NGG-3' PAM sequence); (3) DNA Repair: The break is repaired by error-prone Non-Homologous End Joining (NHEJ), introducing frameshift indels that disrupt BCL11A expression without affecting non-erythroid BCL11A function, derepressing gamma-globin transcription and elevating HbF to prevent HbS sickling and vaso-occlusion."
    }
  ]
};
