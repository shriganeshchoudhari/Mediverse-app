/**
 * Nephrology: Renal Tubular Acidoses (RTA Types 1, 2, 4) & Electrolyte Dynamics
 * Authoritative medical content derived from Brenner & Rector's The Kidney (11th ed.), Rose & Post's Clinical Physiology of Acid-Base.
 * Mapped to NMC CBME Competencies: IM13.3, IM13.4, PY4.1, PY4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RENAL_TUBULAR_ACIDOSES_ELECTROLYTES_MODULE: PhysiologyLessonModule = {
  id: "nephrology-adv-renal-tubular-acidoses-electrolytes",
  unitCode: "NE5.1",
  title: "Renal Tubular Acidoses: Type 1 Distal, Type 2 Proximal (Fanconi), Type 4 Hyperkalemic & Urine Anion Gap",
  competencies: ["IM13.3", "IM13.4", "PY4.1", "PY4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Renal Tubular Acidoses (RTA) & Tubular Electrophysiology

Renal Tubular Acidoses (RTAs) are a group of transport disorders characterized by **Normal Anion Gap (Hyperchloremic) Metabolic Acidosis** ($[\\text{Na}^+] - ([\\text{Cl}^-] + [\\text{HCO}_3^-]) = 8 - 12\\text{ mEq/L}$) with preserved or relatively preserved glomerular filtration rate.

---

## 1. RTA Types 1, 2, and 4 Comparative Diagnostic Matrix

$$\\begin{array}{lccc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Type 1 Distal RTA} & \\textbf{Type 2 Proximal RTA} & \\textbf{Type 4 Hyperkalemic RTA} \\\\
\\hline
\\textbf{Primary Tubular Defect} & \\text{Impaired } \\text{H}^+ \\text{ secretion by } \\alpha\\text{-intercalated cells} & \\text{Impaired } \\text{HCO}_3^- \\text{ reabsorption in PCT} & \\text{Aldosterone deficiency or resistance} \\\\
\\textbf{Serum Potassium Level} & \\mathbf{\\downarrow\\text{ Hypokalemia}} & \\mathbf{\\downarrow\\text{ Hypokalemia}} & \\mathbf{\\uparrow\\uparrow\\text{ HYPERKALEMIA}} \\\\
\\textbf{Urine pH during Acidemia} & \\mathbf{\u003e5.5\\text{ (Inability to acidify)}} & \\text{Variable (}\u003c5.5\\text{ once reset)} & \\mathbf{\u003c5.5} \\\\
\\textbf{Urine Anion Gap (UAG)} & \\mathbf{\\text{POSITIVE (}}\u003e0\\text{)}} & \\mathbf{\\text{NEGATIVE (}}\u003c0\\text{)}} & \\mathbf{\\text{POSITIVE (}}\u003e0\\text{)}} \\\\
\\textbf{Nephrocalcinosis / Stones} & \\mathbf{\\text{FREQUENT (CaPO}_4\\text{ stones)}} & \\text{Absent} & \\text{Absent} \\\\
\\textbf{Associated Conditions} & \\text{Sj\u00f6gren syndrome, Amphotericin B} & \\mathbf{\\text{Fanconi Syndrome}}\\text{, Multiple Myeloma} & \\text{Diabetic nephropathy, ACEi/ARBs, NSAIDs} \\\\
\\hline
\\end{array}$$

- **Urine Anion Gap (UAG) Formula**:
  $$\\text{UAG} = \\text{Urine } [\\text{Na}^+] + \\text{Urine } [\\text{K}^+] - \\text{Urine } [\\text{Cl}^-]$$
  - $\\text{Negative UAG} \\implies \\text{Normal renal } \\text{NH}_4^+ \\text{ excretion (e.g. Diarrhea, Type 2 RTA)}$.
  - $\\text{Positive UAG} \\implies \\text{Impaired renal } \\text{NH}_4^+ \\text{ excretion (e.g. Type 1 RTA, Type 4 RTA)}$.

---

## 2. Type 1 Distal vs Type 2 Proximal vs Type 4 Details

1. **Type 1 Distal RTA**:
   - **Mechanism**: Failure of $\\text{H}^+$-ATPase or $\\text{H}^+/\\text{K}^+$-ATPase in the collecting duct $\\alpha$-intercalated cells $\\rightarrow$ alkaline urine ($\\text{pH} > 5.5$) despite severe systemic acidosis.
   - **Complications**: High urine $\\text{pH}$ and low urinary citrate promote precipitation of calcium phosphate $\\rightarrow$ **bilateral Nephrocalcinosis** and recurrent nephrolithiasis.

2. **Type 2 Proximal RTA & Fanconi Syndrome**:
   - **Mechanism**: Defect in proximal tubule carbonic anhydrase or $\\text{Na}^+/\\text{HCO}_3^-$ cotransporter $\\rightarrow$ bicarbonate wasting until filtered load drops below lowered tubular threshold.
   - **Fanconi Syndrome**: Generalized proximal tubule transport dysfunction: Bicarbonaturia, **Glucosuria** (with normal blood glucose), **Aminoaciduria**, **Phosphaturia** (leading to hypophosphatemic Rickets/Osteomalacia), and Uricosuria.

3. **Type 4 Hyperkalemic RTA**:
   - **Mechanism**: Lack of aldosterone (adrenal insufficiency, hyporeninemic hypoaldosteronism) or receptor blockade $\rightarrow$ decreased $\\text{Na}^+$ reabsorption in principal cells $\rightarrow$ loss of lumen-negative potential $\rightarrow$ **retention of both Potassium and Hydrogen ions**.
   - **Clinical Context**: Most common RTA in clinical practice, classically seen in **diabetic nephropathy** with mild-to-moderate CKD taking ACE inhibitors or ARBs.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old female with primary Sjögren syndrome presents with recurrent bilateral flank pain and progressive fatigue. An unenhanced CT scan of the abdomen demonstrates dense bilateral medullary nephrocalcinosis and multiple calcium phosphate calculi in both renal pelvises. Arterial blood gas shows: pH 7.26, PaCO2 30 mmHg, HCO3- 13 mEq/L (Normal Anion Gap Metabolic Acidosis). Serum electrolytes: Na+ 139 mEq/L, K+ 2.8 mEq/L, Cl- 114 mEq/L. Urine studies during systemic acidemia reveal: Urine pH 6.6, Urine Na+ 42 mEq/L, Urine K+ 28 mEq/L, and Urine Cl- 24 mEq/L.",
      question: "Which of the following is the calculated Urine Anion Gap and the definitive underlying diagnosis in this patient?",
      options: [
        "Urine Anion Gap = +46 mEq/L; Type 1 (Distal) Renal Tubular Acidosis",
        "Urine Anion Gap = -32 mEq/L; Chronic secretory diarrhea",
        "Urine Anion Gap = -18 mEq/L; Type 2 (Proximal) Renal Tubular Acidosis with Fanconi syndrome",
        "Urine Anion Gap = +12 mEq/L; Type 4 (Hyperkalemic) Renal Tubular Acidosis"
      ],
      correctAnswerIndex: 0,
      explanation: "Using the formula Urine Anion Gap = UNa + UK - UCl = 42 + 28 - 24 = +46 mEq/L. A positive UAG (>0) in the setting of normal anion gap metabolic acidosis confirms impaired renal ammonium (NH4+) excretion. Combined with hypokalemia (K+ 2.8 mEq/L), an inability to acidify urine below pH 5.5 despite systemic acidemia (Urine pH 6.6), bilateral nephrocalcinosis with calcium phosphate stones, and an autoimmune etiology (Sjögren syndrome), this confirms Type 1 Distal RTA."
    }
  ]
};
