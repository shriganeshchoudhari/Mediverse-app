/**
 * Clinical Internal Medicine: Advanced Acid-Base Disorders & ABG Interpretation
 * Authoritative medical content derived from Harrison's (21st ed.), Goldman-Cecil Medicine.
 * Mapped to NMC CBME Competencies: IM1.5, IM1.6, MD41.3, SU39.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADVANCED_ACID_BASE_ABG_INTERPRETATION_MODULE: PhysiologyLessonModule = {
  id: "medicine-adv-acid-base-abg",
  unitCode: "IM5.1",
  title: "Advanced Acid-Base & ABG Interpretation: Winter's Formula, Delta-Delta Ratio & Mixed Disorders",
  competencies: ["IM1.5", "IM1.6", "MD41.3", "SU39.3"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Advanced Acid-Base & Arterial Blood Gas (ABG) Algorithm

Complex acid-base analysis requires a systematic five-step mathematical approach to diagnose mixed and triple acid-base disturbances in critical illness.

---

## 1. The Systematic 5-Step ABG Interpretation Algorithm

$$\\begin{array}{lccc}
\\hline
\\textbf{Step} & \\textbf{Calculated Parameter} & \\textbf{Diagnostic Formula / Rule} & \\textbf{Clinical Interpretation} \\\\
\\hline
\\textbf{1. pH Status} & \\text{Systemic Acidity} & \\text{pH } < 7.35 = \\text{Acidemia} \\mid > 7.45 = \\text{Alkalemia} & \\text{Normal range: } 7.35 - 7.45 \\\\
\\textbf{2. Primary Process} & \\text{Direction of } PaCO_2 \\text{ / } HCO_3^- & \\text{Metabolic if } \\Delta HCO_3^- \\mid \\text{Respiratory if } \\Delta PaCO_2 & \\text{Look at metabolic vs respiratory} \\\\
\\textbf{3. Serum Anion Gap} & \\mathbf{\\text{AG} = [\\text{Na}^+] - ([\\text{Cl}^-] + [\\text{HCO}_3^-])} & \\mathbf{\\text{Correct for Albumin: } +2.5 \\text{ for each } 1 \\text{ g/dL } \\downarrow} & \\mathbf{\\text{Normal AG: } 10 - 12\\text{ mEq/L}} \\\\
& & & \\mathbf{\\text{GOLD MARK / MUDPILES HAGMA}} \\\\
\\textbf{4. Respiratory Comp} & \\mathbf{\\text{Winter's Formula (Metabolic Acidosis)}} & \\mathbf{\\text{Expected } PaCO_2 = 1.5 \\times [\\text{HCO}_3^-] + 8 \\pm 2} & \\text{If actual } PaCO_2 > \\text{exp } \\rightarrow \\text{ Resp Acidosis} \\\\
& & & \\text{If actual } PaCO_2 < \\text{exp } \\rightarrow \\text{ Resp Alkalosis} \\\\
\\textbf{5. Delta-Delta Ratio} & \\mathbf{\\Delta\\text{-}\\Delta = \\frac{\\text{AG} - 12}{24 - [\\text{HCO}_3^-]}} & \\mathbf{< 0.4 - 0.8: \\text{ Combined HAGMA + NAGMA}} & \\mathbf{1.0 - 2.0: \\text{ Pure HAGMA (DKA/Lactate)}} \\\\
& & \\mathbf{> 2.0: \\text{ Combined HAGMA + Metabolic Alkalosis}} & (\\text{e.g., DKA + Vomiting / Diuretics}) \\\\
\\hline
\\end{array}$$

---

## 2. High Anion Gap Metabolic Acidosis (GOLD MARK Etiologies)

- **G**: Glycols (Ethylene glycol, Propylene glycol $\rightarrow$ Osmolar Gap $>10$, Calcium oxalate monohydrate envelope crystals).
- **O**: Oxoproline (5-oxoproline / pyroglutamic acid from chronic Acetaminophen ingestion).
- **L**: L-Lactate (Severe sepsis, hypoperfusion, shock).
- **D**: D-Lactate (Short bowel syndrome / bacterial overgrowth with neurotoxicity).
- **M**: Methanol (Toxic alcohol ingestion $\rightarrow$ Formic acid $\rightarrow$ Optic papillitis / "snowfield vision").
- **A**: Aspirin / Salicylates (Direct respiratory center stimulation causing primary Respiratory Alkalosis $+$ uncoupled oxidative phosphorylation causing HAGMA $\rightarrow$ classic **Mixed HAGMA + Respiratory Alkalosis**).
- **R**: Renal failure (Uremia $\rightarrow$ retention of unmeasured organic sulfates, phosphates).
- **K**: Ketoacidosis (Diabetic Ketoacidosis DKA, Alcoholic Ketoacidosis AKA, Starvation).
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old female with Type 1 Diabetes Mellitus presents with 2 days of nausea, intractable vomiting, and severe lethargy. Laboratory values: Na+ 138 mEq/L, K+ 4.8 mEq/L, Cl- 86 mEq/L, HCO3- 12 mEq/L, BUN 38 mg/dL, Creatinine 1.8 mg/dL, Blood Glucose 480 mg/dL, Serum Albumin 4.0 g/dL. Arterial Blood Gas (ABG): pH 7.28, PaCO2 26 mmHg, PaO2 95 mmHg on room air. Serum beta-hydroxybutyrate is markedly elevated at 8.2 mmol/L.",
      question: "Perform a systematic 5-step acid-base analysis. What is the comprehensive acid-base diagnosis for this patient?",
      options: [
        "Triple Acid-Base Disturbance: High Anion Gap Metabolic Acidosis (DKA) + Concomitant Metabolic Alkalosis (Vomiting) with appropriate respiratory compensation (Winter's formula)",
        "Pure High Anion Gap Metabolic Acidosis alone",
        "Normal Anion Gap Metabolic Acidosis with severe uncompensated respiratory acidosis",
        "Primary Respiratory Alkalosis with renal compensation"
      ],
      correctAnswerIndex: 0,
      explanation: "Step 1: pH 7.28 indicates Acidemia. Step 2: Primary process is Metabolic Acidosis (HCO3- 12 mEq/L). Step 3: Anion Gap = Na+ - (Cl- + HCO3-) = 138 - (86 + 12) = 40 mEq/L (severely elevated HAGMA due to DKA ketoacids). Step 4: Winter's formula expected PaCO2 = 1.5 * [12] + 8 +/- 2 = 18 + 8 = 26 mmHg. The actual PaCO2 is exactly 26 mmHg, confirming appropriate respiratory compensation. Step 5: Delta-Delta Ratio = (Actual AG - Normal AG) / (Normal HCO3 - Actual HCO3) = (40 - 12) / (24 - 12) = 28 / 12 = 2.33. A Delta-Delta ratio >2.0 proves that the bicarbonate is higher than expected for the degree of anion gap elevation, establishing a concurrent secondary Metabolic Alkalosis (from severe gastric HCl loss due to persistent vomiting). Thus, the patient has a classic mixed HAGMA + Metabolic Alkalosis."
    }
  ]
};
