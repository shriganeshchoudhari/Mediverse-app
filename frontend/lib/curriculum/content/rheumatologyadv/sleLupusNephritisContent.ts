/**
 * Rheumatology: Systemic Lupus Erythematosus (SLE), Lupus Nephritis & Antiphospholipid Syndrome
 * Authoritative medical content derived from Kelley and Firestein's Textbook of Rheumatology (11th ed.), Robbins & Cotran Pathologic Basis of Disease.
 * Mapped to NMC CBME Competencies: IM1.1, IM1.2, PA29.1, PA29.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SLE_LUPUS_NEPHRITIS_MODULE: PhysiologyLessonModule = {
  id: "rheumatology-adv-sle-lupus-nephritis",
  unitCode: "RH1.1",
  title: "Systemic Lupus Erythematosus (SLE), Autoantibody Panel, Lupus Nephritis & Antiphospholipid Syndrome",
  competencies: ["IM1.1", "IM1.2", "PA29.1", "PA29.2"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Systemic Lupus Erythematosus (SLE) & Antiphospholipid Syndrome

SLE is a chronic multisystem autoimmune disease characterized by loss of self-tolerance to nuclear autoantigens, polyclonal B-cell activation, and Type III immune complex-mediated tissue injury.

---

## 1. High-Yield Autoantibody Profiler in SLE

$$\\begin{array}{lcccc}
\\hline
\\textbf{Autoantibody} & \\textbf{Target Antigen} & \\textbf{Sensitivity} & \\textbf{Specificity} & \\textbf{Clinical Utility / Hallmark} \\\\
\\hline
\\textbf{ANA (Antinuclear)} & \\text{Nuclear macromolecular antigens} & \\mathbf{\u003e95\\%} & \\text{Low (}50-60\\%\\text{)} & \\text{Best initial screening test; negative excludes SLE} \\\\
\\textbf{Anti-dsDNA} & \\text{Double-stranded native DNA} & 60 - 70\\% & \\mathbf{\u003e95\\%} & \\mathbf{\\text{Correlates with Lupus Nephritis disease activity}} \\\\
\\textbf{Anti-Smith (Anti-Sm)} & \\text{Core protein of snRNPs (U1-U6)} & 25 - 30\\% & \\mathbf{\u003e99\\%} & \\mathbf{\\text{Most specific autoantibody for SLE}} \\\\
\\textbf{Anti-Ro / SSA} & \\text{Ro52 / Ro60 ribonucleoproteins} & 30 - 40\\% & \\text{Moderate} & \\mathbf{\\text{Neonatal Lupus \u0026 Congenital Complete Heart Block}} \\\\
\\textbf{Anti-Histone} & \\text{Histone octamer proteins (H1-H4)} & \\mathbf{\u003e95\\%} & \\text{Variable} & \\mathbf{\\text{Drug-Induced Lupus}}\\text{ (Hydralazine, Procainamide)} \\\\
\\textbf{Antiphospholipid (aPL)} & \\text{Cardiolipin, } \\beta_2\\text{-glycoprotein I} & 30 - 40\\% & \\text{High} & \\mathbf{\\text{Arterial/Venous Thrombosis \u0026 Fetal Loss; } \\uparrow\\text{PTT}} \\\\
\\hline
\\end{array}$$

---

## 2. Antiphospholipid Syndrome (APS) Diagnostic Hallmarks

- **Pathophysiology**: Autoantibodies direct platelet activation, endothelial dysfunction, and complement activation $\rightarrow$ hypercoagulable state.
- **Diagnostic Criteria**:
  1. **Clinical**: At least one confirmed **Vascular Thrombosis** (DVT, PE, stroke) OR **Obstetric Complication** ($\\ge 3$ consecutive unexplained miscarriages $<10\\text{ weeks}$, $\\ge 1$ unexplained fetal death $\\ge 10\\text{ weeks}$, or severe preeclampsia $<34\\text{ weeks}$).
  2. **Laboratory**: Persistent positivity on two occasions at least 12 weeks apart for: **Lupus Anticoagulant (LA)**, **Anticardiolipin IgG/IgM**, or **Anti-$\\beta_2$-glycoprotein I IgG/IgM**.
- **The PTT Paradox**: In vitro, Lupus Anticoagulant binds phospholipids in the reagent, **prolonging the activated partial thromboplastin time (PTT)**; however, in vivo it causes **severe thrombosis** (mixing study does NOT correct PTT).

---

## 3. Lupus Nephritis Histopathological Classification

- **Class IV (Diffuse Proliferative Glomerulonephritis)**: Most common and most severe form ($>50\\%$ of glomeruli involved).
  - Light Microscopy: Endocapillary hypercellularity, cellular crescents, and **\"wire-loop\" subendothelial immune complex deposits**.
  - Immunofluorescence: **\"Full-house\" granular deposition** of IgG, IgA, IgM, C3, and C1q.
  - Induction Pharmacotherapy: High-dose **Corticosteroids $+$ Mycophenolate Mofetil (MMF)** or IV Cyclophosphamide.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female presents with fatigue, malar rash sparing the nasolabial folds, bilateral hand and wrist arthralgias, and pleuritic chest pain. Laboratory studies reveal: ANA 1:1280 (homogeneous pattern), positive Anti-dsDNA (elevated titer), and positive Anti-Smith antibodies. Coagulation panel demonstrates: Prothrombin Time (PT) 12.0 sec (normal), Activated Partial Thromboplastin Time (PTT) 58 sec (prolonged, normal 25-35 sec). A 1:1 mixing study with normal pooled plasma fails to correct the prolonged PTT. She has a history of two unprovoked deep vein thromboses and two first-trimester miscarriages.",
      question: "Which of the following represents the underlying mechanism responsible for the prolonged PTT and the definitive diagnosis in this patient?",
      options: [
        "In vitro neutralization of reagent phospholipids by Lupus Anticoagulant; Antiphospholipid Syndrome in the setting of active Systemic Lupus Erythematosus",
        "Factor VIII inhibitor autoantibodies; Acquired Hemophilia A",
        "Inherited Factor V Leiden mutation with activated protein C resistance",
        "Von Willebrand factor deficiency with secondary Factor VIII instability"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has active Systemic Lupus Erythematosus (malar rash, arthritis, serositis, ANA+, anti-dsDNA+, anti-Smith+) complicated by secondary Antiphospholipid Syndrome (APS) manifested by recurrent DVTs, recurrent fetal loss, and a circulating Lupus Anticoagulant. In vitro, the Lupus Anticoagulant binds reagent phospholipids, interfering with assembly of coagulation complexes and causing an artifactually prolonged PTT that does NOT correct upon 1:1 mixing study (indicating the presence of an inhibitor rather than a factor deficiency). In vivo, however, it promotes a powerful hypercoagulable state requiring lifelong anticoagulation."
    }
  ]
};
