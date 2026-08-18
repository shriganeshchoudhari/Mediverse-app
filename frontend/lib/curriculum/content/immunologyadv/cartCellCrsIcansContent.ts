/**
 * Clinical Immunology: CAR-T Cell Therapy, CRS & ICANS
 * Authoritative medical content derived from ASTCT Guidelines, Abbas Cellular & Molecular Immunology.
 * Mapped to NMC CBME Competencies: IM1.7, IM1.8, PE18.4, MD38.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CART_CELL_CRS_ICANS_MODULE: PhysiologyLessonModule = {
  id: "immunology-adv-cart-cell-crs-icans",
  unitCode: "IM7.1",
  title: "CAR-T Cell Therapy: Synthetic Receptors, Cytokine Release Syndrome (CRS) & Neurotoxicity (ICANS)",
  competencies: ["IM1.7", "IM1.8", "PE18.4", "MD38.4"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# CAR-T Cell Therapy, Cytokine Release Syndrome (CRS) & ICANS

Chimeric Antigen Receptor (CAR) T-cell therapy represents a paradigm shift in precision cellular immunotherapy, combining antibody specificity with cytotoxic T-cell effector and memory functions.

---

## 1. CAR-T Molecular Construct Architecture

$$\\begin{array}{lcc}
\\hline
\\textbf{CAR Domain Component} & \\textbf{Molecular Structure} & \\textbf{Functional Role in T-Cell Activation} \\\\
\\hline
\\textbf{Extracellular Antigen Binding} & \\mathbf{\\text{Single-chain variable fragment (scFv)}} & \\text{MHC-independent binding to surface target} \\\\
& (V_H - V_L\\text{ linker from mAb}) & (\\mathbf{\\text{CD19 in B-ALL/DLBCL, BCMA in Myeloma}}) \\\\
\\textbf{Transmembrane Domain} & \\text{CD8 or CD28 alpha-helix} & \\text{Anchors receptor into plasma membrane} \\\\
\\textbf{Costimulatory Domain (Signal 2)} & \\mathbf{\\text{4-1BB (CD137) or CD28}} & \\mathbf{\\text{Enhances T-cell proliferation, survival, and persistence}} \\\\
\\textbf{Intracellular Signaling (Signal 1)} & \\mathbf{\\text{CD3-}\\zeta\\text{ chain (3 ITAM motifs)}} & \\mathbf{\\text{Transmits downstream TCR activation and cytolysis}} \\\\
\\hline
\\end{array}$$

---

## 2. Cytokine Release Syndrome (CRS) & ASTCT Consensus Grading

$$\\begin{array}{lccc}
\\hline
\\textbf{CRS Grade} & \\textbf{Core Clinical Criteria} & \\textbf{Primary Cytokine Drivers} & \\textbf{Targeted Pharmacological Management} \\\\
\\hline
\\textbf{Grade 1} & \\text{Fever } (\\ge 38.0^\\circ\\text{C})\\text{ alone; NO hypotension/hypoxia} & \\text{IL-6, IL-1, IFN-}\\gamma, & \\text{Supportive antipyretics, IV fluids, vigilance} \\\\
\\textbf{Grade 2} & \\text{Fever } + \\mathbf{\\text{Hypotension (fluid-responsive)}} & \\text{TNF-}\\alpha, \\text{ GM-CSF} & \\mathbf{\\text{Tocilizumab (anti-IL-6R, 8 mg/kg IV)}} \\\\
& \\text{OR } \\mathbf{\\text{Hypoxia requiring low-flow NC (}\\le 40\\%)} & & \\pm \\text{ IV Dexamethasone} \\\\
\\textbf{Grade 3} & \\text{Fever } + \\mathbf{\\text{Hypotension requiring 1 vasopressor}} & \\text{Massive bystander} & \\mathbf{\\text{Tocilizumab (repeat dose) + IV Dexamethasone}} \\\\
& \\text{OR } \\mathbf{\\text{Hypoxia requiring high-flow cannula / mask}} & \\text{monocyte activation} & \\mathbf{\\text{10-20 mg q6h; ICU admission}} \\\\
\\textbf{Grade 4} & \\text{Fever } + \\mathbf{\\text{Hypotension requiring multiple vasopressors}} & \\text{Endothelial leakage,} & \\mathbf{\\text{Pulse Methylprednisolone (1 g/day) + Tocilizumab}} \\\\
& \\text{OR } \\mathbf{\\text{Hypoxia requiring mechanical ventilation/CPAP}} & \\text{coagulopathy, shock} & + \\text{ Anakinra (anti-IL-1) for refractory cases} \\\\
\\hline
\\end{array}$$

---

## 3. Immune Effector Cell-Associated Neurotoxicity Syndrome (ICANS)

- **Clinical Features**: Expressive aphasia (early hallmark), dysgraphia, tremor, lethargy, global encephalopathy, seizures, and fatal cerebral edema.
- **Pathophysiology**: Systemic cytokines disrupt the blood-brain barrier (BBB), allowing cytokine entry (IL-1, IL-6) and microglial activation.
- **Treatment Strategy**:
  - **Dexamethasone is FIRST-LINE** (crosses the BBB and suppresses CNS neuroinflammation).
  - **Tocilizumab is INEFFECTIVE for isolated ICANS** because it has poor BBB penetration and can transiently elevate free serum IL-6 levels; Tocilizumab is used ONLY if concurrent CRS is present!
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male with relapsed refractory B-cell acute lymphoblastic leukemia (B-ALL) receives Tisagenlecleucel (anti-CD19 CAR-T cell infusion). On day 4 post-infusion, he develops a temperature of 39.4°C, heart rate 128 bpm, blood pressure 84/48 mmHg (mean arterial pressure 60 mmHg), and SpO2 91% on room air requiring 2 L/min via nasal cannula. Following a 1-liter bolus of Lactated Ringer's, his blood pressure remains 86/50 mmHg, necessitating initiation of a Norepinephrine infusion (0.08 mcg/kg/min).",
      question: "According to ASTCT consensus criteria, what is this patient's CRS grade, and what is the definitive targeted pharmacological antidote?",
      options: [
        "Grade 3 Cytokine Release Syndrome (CRS); Immediate administration of Intravenous Tocilizumab (anti-IL-6 receptor antibody, 8 mg/kg) plus Intravenous Dexamethasone 10-20 mg",
        "Grade 1 CRS; Administration of oral Acetaminophen and observation",
        "Septic shock; Immediate administration of broad-spectrum antibiotics and discontinuation of all immunosuppressive agents",
        "Isolated ICANS; Administration of Intravenous Haloperidol"
      ],
      correctAnswerIndex: 0,
      explanation: "According to ASTCT (American Society for Transplantation and Cellular Therapy) consensus criteria, CRS presenting with fever PLUS hypotension requiring vasopressor support (Norepinephrine) or hypoxia requiring high-flow oxygen is classified as Grade 3 CRS. The pathophysiology is driven by explosive macrophage and T-cell secretion of IL-6, IL-1, and IFN-gamma. The definitive, targeted first-line therapeutic antidote is Tocilizumab (an anti-IL-6 receptor monoclonal antibody) combined with intravenous Dexamethasone (10-20 mg every 6 hours) to rapidly halt the hyperinflammatory cascade without impairing CAR-T antitumor persistence."
    }
  ]
};
