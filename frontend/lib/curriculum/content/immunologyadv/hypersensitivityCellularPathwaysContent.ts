/**
 * Clinical Immunology: Cellular Mechanisms of Hypersensitivity (Type I-IV)
 * Authoritative medical content derived from Abbas Cellular & Molecular Immunology (10th ed.), Janeway's Immunobiology.
 * Mapped to NMC CBME Competencies: IM1.1, IM1.2, PE18.1, MD38.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HYPERSENSITIVITY_CELLULAR_PATHWAYS_MODULE: PhysiologyLessonModule = {
  id: "immunology-adv-hypersensitivity-pathways",
  unitCode: "IM1.1",
  title: "Cellular Mechanisms of Hypersensitivity: Gell-Coombs Types I-IV, CDC, ADCC & T-Cell Cytotoxicity",
  competencies: ["IM1.1", "IM1.2", "PE18.1", "MD38.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Cellular Mechanisms of Hypersensitivity Reactions

Hypersensitivity reactions are immune responses that result in tissue injury and clinical disease, categorized into four distinct mechanistic pathways by Gell and Coombs.

---

## 1. The Gell and Coombs Classification Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Type} & \\textbf{Immune Mediator} & \\textbf{Effector Mechanism} & \\textbf{Classic Clinical Prototypes} & \\textbf{Onset / Time Course} \\\\
\\hline
\\textbf{Type I} & \\mathbf{\\text{IgE Antibodies}} & \\text{Mast cell / Basophil degranulation} & \\mathbf{\\text{Anaphylaxis, Allergic Asthma, Urticaria}} & \\mathbf{\\text{Immediate (minutes)}} \\\\
\\text{(Immediate)} & & (\\text{Histamine, Leukotrienes } C_4/D_4/E_4) & \\text{Late-phase eosinophil infiltration (IL-5)} & \\text{Late phase (4-8 hours)} \\\\
\\textbf{Type II} & \\mathbf{\\text{IgG / IgM}} & \\text{Complement (CDC / MAC), ADCC (NK cells),} & \\mathbf{\\text{AIHA, Goodpasture (anti-GBM), Graves,}} & \\text{Hours to days} \\\\
\\text{(Cytotoxic)} & & \\text{or receptor stimulation / blockade} & \\mathbf{\\text{Myasthenia Gravis, Pemphigus Vulgaris}} & \\\\
\\textbf{Type III} & \\mathbf{\\text{Immune Complexes}} & \\text{Vascular deposition } \\rightarrow \\text{ Complement} & \\mathbf{\\text{SLE (Lupus Nephritis), PSGN,}} & \\mathbf{7-14\\text{ days (Serum Sickness)}} \\\\
\\text{(Complex)} & \\text{(Ag-Ab)} & (\\text{C3a/C5a}) \\rightarrow \\text{ Neutrophil vasculitis} & \\mathbf{\\text{Serum Sickness, Arthus Reaction}} & \\\\
\\textbf{Type IV} & \\mathbf{\\text{T Lymphocytes}} & \\mathbf{\\text{CD4+ Th1 (IFN-}\\gamma \\text{ macrophages)}} & \\mathbf{\\text{PPD Skin Test, Contact Dermatitis,}} & \\mathbf{24-72\\text{ hours (Delayed)}} \\\\
\\text{(Delayed)} & (\\text{NO antibodies!}) & \\mathbf{\\text{and CD8+ CTLs (Perforin/Granzyme)}} & \\mathbf{\\text{Type 1 Diabetes, GVHD, SJS / TEN}} & \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Immunopathological Differentials

- **Type II vs Type III Glomerulonephritis on Immunofluorescence (IF)**:
  - **Type II (Anti-GBM / Goodpasture Syndrome)**: Smooth, **linear ribbon-like deposition** of IgG and C3 along the glomerular basement membrane (alpha-3 chain of Type IV collagen).
  - **Type III (Lupus Nephritis / PSGN)**: Granular, irregular, **"lumpy-bumpy" subepithelial or subendothelial immune complex deposits** with systemic hypocomplementemia (low serum C3 and C4 due to classical pathway consumption).
- **Type II Blistering Diseases**:
  - **Pemphigus Vulgaris**: IgG against **Desmoglein-3** (desmosomes) $\rightarrow$ intraepidermal flaccid blisters with positive Nikolsky sign and "tombstone" basal layer.
  - **Bullous Pemphigoid**: IgG against **BP180 / BP230** (hemidesmosomes) $\rightarrow$ subepidermal tense bullae with negative Nikolsky sign and linear basement membrane IgG deposition.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old female with systemic lupus erythematosus presents with fever, generalized malar rash, polyarthralgias, and gross hematuria 10 days after receiving equine antithymocyte globulin for aplastic anemia. Serum complement levels show markedly depressed C3 and C4. Urinalysis reveals 3+ protein and red blood cell casts. Renal biopsy demonstrates endocapillary proliferative glomerulonephritis with irregular, granular 'lumpy-bumpy' mesangial and subendothelial IgG and C3 deposits on immunofluorescence.",
      question: "Which of the following immunopathological mechanisms is responsible for this patient's acute systemic illness and renal injury?",
      options: [
        "Type III Hypersensitivity: Deposition of circulating foreign antigen-antibody immune complexes in microvascular beds, triggering classical complement activation and neutrophil-mediated vascular necrosis (Serum Sickness)",
        "Type I Hypersensitivity: IgE cross-linking on mast cells triggering immediate systemic histamine release",
        "Type II Hypersensitivity: Direct linear autoantibody binding to glomerular basement membrane Type IV collagen",
        "Type IV Hypersensitivity: CD8+ cytotoxic T lymphocyte lysis of renal tubular epithelial cells"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic Type III Hypersensitivity in the form of Serum Sickness and Immune Complex Glomerulonephritis. Following exposure to a foreign protein (antithymocyte globulin), circulating IgG and IgM form small, soluble antigen-antibody immune complexes that deposit in small vessel walls, renal glomeruli, and joints. These complexes fix and activate the classical complement cascade, generating anaphylatoxins (C3a, C5a) that recruit neutrophils. Neutrophil lysosomal enzymes cause microvascular inflammation, fibrinoid necrosis, and consumption of serum complement (low C3/C4), producing the characteristic granular 'lumpy-bumpy' immunofluorescence pattern."
    }
  ]
};
