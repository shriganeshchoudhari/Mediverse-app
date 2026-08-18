/**
 * Medical Biochemistry II: Transcription, Epigenetic Regulation & RNA Splicing
 * Authoritative molecular biochemistry content derived from Harper's (32nd ed.), Lehninger (8th ed.).
 * Mapped to NMC CBME Competencies: BI4.1, BI4.2, PA4.2, PE12.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRANSCRIPTION_EPIGENETICS_SPLICING_MODULE: PhysiologyLessonModule = {
  id: "biochemistry2-transcription-epigenetics-splicing",
  unitCode: "BI4.1",
  title: "Transcription & Splicing: RNA Polymerase I/II/III (alpha-Amanitin), Histone Acetylation & Spliceosome snRNPs (SLE)",
  competencies: ["BI4.1", "BI4.2", "PA4.2", "PE12.2"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Transcription, Epigenetic Remodeling & Post-Transcriptional Splicing

Eukaryotic gene expression is controlled through chromatin accessibility, differential RNA polymerases, and post-transcriptional processing mechanisms whose dysfunction causes autoimmune and toxic states.

---

## 1. Eukaryotic RNA Polymerases \u0026 Mushroom Toxins

$$\\begin{array}{lcccc}
\\hline
\\textbf{RNA Polymerase} & \\textbf{Primary RNA Products} & \\textbf{Subcellular Localization} & \\textbf{Inhibition by } \\alpha\\textbf{-Amanitin} & \\textbf{Promoter Elements} \\\\
\\hline
\\textbf{RNA Polymerase I} & \\mathbf{28\\text{S}, 18\\text{S}, 5.8\\text{S}\\text{ rRNA}} & \\text{Nucleolus} & \\mathbf{\\text{INSENSITIVE (No inhibition)}} & \\text{Upstream Control Element (UCE)} \\\\
\\textbf{RNA Polymerase II} & \\mathbf{\\text{mRNA, snRNA, microRNA}} & \\text{Nucleoplasm} & \\mathbf{\\text{EXTREMELY SENSITIVE}} & \\mathbf{\\text{TATA box (}-25\\text{), CAAT box (}-75\\text{),}} \\\\
& & & (\\mathbf{\\text{Inhibited by } \\alpha\\text{-Amanitin } 10^{-8}\\text{M}}) & \\text{GC box (Sp1 binding site)} \\\\
\\textbf{RNA Polymerase III} & \\mathbf{\\text{tRNA, } 5\\text{S}\\text{ rRNA}} & \\text{Nucleoplasm} & \\text{Inhibited only at very high conc} & \\text{Internal promoters (Box A, B, C)} \\\\
\\hline
\\end{array}$$

- **$\\alpha$-Amanitin Poisoning (*Amanita phalloides* Death Cap Mushroom)**:
  - Potent bicyclic octapeptide that selectively binds and locks **RNA Polymerase II**, halting transcription of essential cellular mRNAs.
  - Clinical Progression: Gastrointestinal phase ($6-24\\text{ hours}$: severe abdominal cramps, vomiting, watery diarrhea) followed by apparent recovery, culminating in **fulminant hepatic necrosis, jaundice, coagulopathy, and acute renal failure**.

---

## 2. Post-Transcriptional Splicing \u0026 Autoimmune Antibodies

$$\\begin{array}{lcccc}
\\hline
\\textbf{Processing Step} & \\textbf{Biochemical Reaction / Signal} & \\textbf{Catalytic Machinery} & \\textbf{Diagnostic / Clinical Correlation} \\\\
\\hline
\\mathbf{5'\\text{ Capping}} & 7\\text{-methylguanosine (}m^7G\\text{) via } 5'-5'\\text{ triphosphate} & \\text{Guanylyltransferase / SAM} & \\text{Protects from } 5'\\text{ exonucleases; binds eIF4E} \\\\
\\mathbf{3'\\text{ Polyadenylation}} & \\text{Cleavage at } AAUAAA \\text{ signal } + \\sim 200\\text{ A's} & \\text{Poly(A) Polymerase (template-free)} & \\text{Facilitates nuclear export and mRNA stability} \\\\
\\textbf{Pre-mRNA Splicing} & \\text{Excision of introns with lariat loop at branch A} & \\mathbf{\\text{snRNPs (U1, U2, U4, U5, U6)}} & \\mathbf{\\text{Anti-Smith (anti-Sm) in SLE (specific);}} \\\\
& (\\text{GU at } 5'\\text{ donor, AG at } 3'\\text{ acceptor}) & & \\mathbf{\\text{Anti-U1 RNP in Mixed Connective Tissue Disease}} \\\\
\\hline
\\end{array}$$

- **Epigenetic Modifications: Histone Acetylation vs DNA Methylation**:
  - **Histone Acetyltransferases (HATs)**: Add acetyl groups to lysine residues, neutralizing positive charge $\\rightarrow$ relaxes chromatin into **transcriptionally active Euchromatin**.
  - **Histone Deacetylases (HDACs)**: Remove acetyl groups $\rightarrow$ condenses chromatin into **Heterochromatin** (silenced). Targeted by **HDAC inhibitors (Vorinostat)** in cutaneous T-cell lymphoma.
`,
  clinicalVignettes: [
    {
      scenario: "A 36-year-old female presents with fatigue, polyarthralgias, photosensitive facial malar rash, and pleuritic chest pain. Laboratory testing reveals ANA positive at 1:1280 (speckled pattern), anti-dsDNA positive, and low serum complement C3 and C4 levels. Further autoimmune profiling is strongly positive for Anti-Smith (anti-Sm) antibodies. In molecular biology research, the specific macromolecular complex targeted by Anti-Smith antibodies is isolated from HeLa cell nuclear extract.",
      question: "What is the diagnosis, and what precise cellular structure and biochemical function does the antigen recognized by Anti-Smith antibodies perform?",
      options: [
        "Systemic Lupus Erythematosus (SLE); the Anti-Smith antibody targets core proteins of small nuclear ribonucleoproteins (snRNPs / U1, U2, U4/U6, U5), which form the spliceosome responsible for excising introns from pre-mRNA during post-transcriptional processing",
        "Systemic Sclerosis; targets topoisomerase I (Scl-70)",
        "Mixed Connective Tissue Disease; targets aminoacyl-tRNA synthetase",
        "Sjögren Syndrome; targets ribonucleoprotein Ro/SSA"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical and serological presentation of Systemic Lupus Erythematosus (SLE) with Anti-Smith (anti-Sm) positivity: (1) Antigen Identity: The Smith antigen consists of core proteins (B/B', D1, D2, D3, E, F, G) complexed with small nuclear RNAs (U1, U2, U4, U5, U6) to form small nuclear ribonucleoproteins (snRNPs); (2) Biochemical Function: snRNPs assemble into the spliceosome, which recognizes the 5' splice donor (GU), 3' splice acceptor (AG), and branch-point adenine, catalyzing the removal of non-coding introns and ligation of exons to form mature mRNA; (3) Clinical Utility: Anti-Smith antibodies are highly specific (>99%) for SLE (in contrast to Anti-U1 RNP, which is characteristic of Mixed Connective Tissue Disease)."
    }
  ]
};
