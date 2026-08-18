/**
 * Postgraduate Advanced Internal Medicine: Rapidly Progressive Glomerulonephritis & Renal Biopsy Pathology
 * Authoritative nephrology content derived from KDIGO Glomerular Diseases 2024, Brenner & Rector's The Kidney.
 * Mapped to NMC PG CBME Competencies: PG2.2, NP1.1, NP1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RPGN_RENAL_BIOPSY_PATHOLOGY_ANCA_MODULE: PhysiologyLessonModule = {
  id: "pg2-rpgn-renal-biopsy-pathology-anca",
  unitCode: "PG2.2",
  title: "Rapidly Progressive Glomerulonephritis (RPGN): Renal Biopsy Pathology, Immunofluorescence & ANCA Vasculitis",
  competencies: ["PG2.2", "NP1.1", "NP1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RENAL",
  markdownContent: `
# Rapidly Progressive Glomerulonephritis (RPGN) & Renal Pathology

RPGN manifests with active nephritic urine sediment, doubling of serum creatinine within weeks to months, and extensive crescentic glomerular formation on renal biopsy.

---

## 1. Crescent Formation Pathophysiology

- **Histopathological Definition**: A crescent consists of **$\\ge 2$ layers of proliferating parietal epithelial cells and infiltrating monocytes/macrophages** occupying Bowman's space, stimulated by fibrin leakage through ruptures in the glomerular basement membrane (GBM).
- **Clinical Significance**: Involving **$>50\\%$ of glomeruli** defines Crescentic Glomerulonephritis (RPGN), requiring urgent immunosuppression to prevent progression to end-stage renal disease (ESRD).

---

## 2. The 3 Major Immunofluorescence (IF) Patterns of RPGN

$$\\begin{array}{lcccc}
\\hline
\\textbf{RPGN Category} & \\textbf{Immunofluorescence Pattern} & \\textbf{Serological Biomarkers} & \\textbf{Gold-Standard Induction Therapy} \\\\
\\hline
\\textbf{Type I RPGN} & \\mathbf{\\text{Linear IgG & C3 deposition along GBM}} & \\text{Anti-GBM Antibodies} & \\mathbf{\\text{Therapeutic Plasma Exchange (14 sessions)}} \\\\
(\\textbf{Anti-GBM / Goodpasture}) & \\text{(autoantibodies against } \\alpha_3 \\text{ NC1 domain)} & (\\alpha_3 \\text{ type IV collagen}) & \\mathbf{+\\text{ Pulse Methylprednisolone } +\\text{ Cyclophosphamide}} \\\\
\\textbf{Type II RPGN} & \\mathbf{\\text{Granular (\"lumpy-bumpy\") deposition}} & \\text{Low C3/C4, Anti-dsDNA (Lupus),} & \\text{Corticosteroids } + \\text{ Mycophenolate Mofetil} \\\\
(\\textbf{Immune Complex}) & \\text{of IgG/IgM and C3 in mesangium/capillaries} & \\text{ASO (PSGN), Cryoglobulins} & \\text{or Cyclophosphamide / Belimumab} \\\\
\\textbf{Type III RPGN} & \\mathbf{\\text{Pauci-Immune (Absent / trace <1+ IF)}} & \\mathbf{\\text{c-ANCA (Anti-PR3) [GPA]}} & \\mathbf{\\text{Rituximab (375 mg/m}^2/\\text{wk } \\times 4\\text{)}} \\\\
(\\textbf{ANCA Vasculitis}) & \\text{Necrotizing crescentic glomerulonephritis} & \\mathbf{\\text{p-ANCA (Anti-MPO) [MPA]}} & \\mathbf{+\\text{ Pulse Methylprednisolone / Avacopan}} \\\\
\\hline
\\end{array}$$

---

## 3. Targeted Therapy & Complement Modulation (Avacopan)

- **ADVOCATE Trial Breakthrough**:
  - **Avacopan**: Oral selective **C5a receptor (C5aR1) antagonist**, eliminating the need for high-dose toxic oral glucocorticoid maintenance in ANCA-associated vasculitis while preserving renal recovery and reducing infection rates.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old female presents with a 3-week history of worsening fatigue, microscopic hematuria with dysmorphic red blood cells and RBC casts, proteinuria (1.8 g/day), and serum creatinine spiking from 0.9 to 4.8 mg/dL. Renal biopsy reveals necrotizing crescentic glomerulonephritis with cellular crescents in 65% of sampled glomeruli. Immunofluorescence microscopy shows zero (trace negative) staining for IgG, IgM, IgA, or complement components. Serology reveals strongly positive c-ANCA (Anti-Proteinase 3 IgG titre >150 U/mL).",
      question: "What is the diagnosis, and what is the gold-standard induction immunosuppressive regimen according to international guidelines?",
      options: [
        "Type III Pauci-Immune RPGN secondary to Granulomatosis with Polyangiitis (GPA); gold-standard induction requires Pulse IV Methylprednisolone (1,000 mg/day x 3 days) followed by oral prednisone taper PLUS Rituximab (375 mg/m^2 weekly x 4 doses or 1,000 mg on days 1 and 15) or oral Cyclophosphamide (with consideration of the oral C5aR1 inhibitor Avacopan)",
        "Type I Anti-GBM disease; treat with hemodialysis alone without immunosuppression",
        "Minimal change disease; treat with oral ACE inhibitors only",
        "Post-streptococcal glomerulonephritis; treat with oral penicillin"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Type III Pauci-Immune RPGN: (1) Pathological Hallmark: Crescentic glomerulonephritis (>50% crescents) with absent/trace immunofluorescence confirms a pauci-immune vasculitis; (2) Serology: Positive c-ANCA (anti-PR3) confirms Granulomatosis with Polyangiitis (GPA); (3) Evidence-Based Induction: The RAVE and ADVOCATE trials establish that Pulse Methylprednisolone plus Rituximab (anti-CD20) or Cyclophosphamide achieves high remission rates. Avacopan (C5a receptor antagonist) can replace high-dose steroid toxicity."
    }
  ]
};
