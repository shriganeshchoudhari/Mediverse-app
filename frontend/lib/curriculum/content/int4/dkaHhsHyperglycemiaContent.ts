/**
 * Internship Core Clinical Postings: Hyperglycemic Crises: Diabetic Ketoacidosis (DKA) & Hyperosmolar Hyperglycemic State (HHS)
 * Authoritative endocrinology content derived from ADA Standards of Care 2025, Harrison's Principles.
 * Mapped to NMC CBME Competencies: IN4.2, IM4.2, EN4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DKA_HHS_HYPERGLYCEMIA_MODULE: PhysiologyLessonModule = {
  id: "int4-dka-hhs-hyperglycemia",
  unitCode: "IN4.2",
  title: "Hyperglycemic Crises: Diabetic Ketoacidosis (DKA), HHS, Two-Bag Fluid Resuscitation & Potassium/Insulin Protocols",
  competencies: ["IN4.2", "IM4.2", "EN4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Hyperglycemic Emergencies: Diabetic Ketoacidosis (DKA) & HHS Protocols

Protocolized fluid resuscitation, aggressive potassium management, continuous regular insulin titration, and dextrose addition prevent cerebral edema and rebound ketosis.

---

## 1. DKA vs Hyperosmolar Hyperglycemic State (HHS) Diagnostic Comparison

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Parameter} & \\textbf{Diabetic Ketoacidosis (DKA)} & \\textbf{Hyperosmolar Hyperglycemic State (HHS)} \\\\
\\hline
\\textbf{Serum Blood Glucose} & > 250\\text{ mg/dL (typically } 350-600\\text{)} & \\mathbf{\\text{Markedly Elevated (} > 600-1{,}000\\text{ mg/dL)}} \\\\
\\textbf{Arterial / Venous pH} & \\mathbf{\\text{Acidemic (} \\text{pH} < 7.30\\text{; severe } < 7.00\\text{)}} & \\text{Normal to Mild (} \\text{pH} > 7.30\\text{)} \\\\
\\textbf{Serum Bicarbonate} & \\mathbf{\\text{Low (} < 18\\text{ mEq/L; severe } < 10\\text{)}} & \\text{Normal (} > 18\\text{ mEq/L)} \\\\
\\textbf{Serum Anion Gap} & \\mathbf{\\text{Elevated Anion Gap (} > 12\\text{ mEq/L)}} & \\text{Normal (} \\le 12\\text{ mEq/L)} \\\\
\\textbf{Effective Osmolality} & \\text{Variable (usually } < 320\\text{ mOsm/kg)} & \\mathbf{\\text{Markedly Elevated (} > 320\\text{ mOsm/kg)}} \\\\
\\textbf{Serum Beta-Hydroxybutyrate} & \\mathbf{\\text{Markedly Positive (} > 3\\text{ mmol/L)}} & \\text{Absent or minimally elevated} \\\\
\\textbf{Average Fluid Deficit} & 3-6\\text{ L (}\\sim 100\\text{ mL/kg)} & \\mathbf{8-10\\text{ L (}\\sim 100-200\\text{ mL/kg; profound shock)}} \\\\
\\hline
\\end{array}$$

---

## 2. Potassium & Insulin Management Protocols

$$\\begin{array}{lcccc}
\\hline
\\textbf{Serum Potassium Level} & \\textbf{Mandated Emergency Action} & \\textbf{Insulin Administration Protocol} \\\\
\\hline
\\mathbf{K^+ < 3.3\\text{ mEq/L}} & \\mathbf{\\text{HOLD INSULIN; infuse } 20-40\\text{ mEq } K^+/\\text{hr}} & \\mathbf{\\text{DO NOT START INSULIN until } K^+ \\ge 3.3\\text{ mEq/L}} \\\\
& \\text{via central/peripheral lines until corrected} & \\mathbf{\\text{(prevents fatal arrhythmias and respiratory arrest)}} \\\\
\\mathbf{K^+ = 3.3 - 5.2\\text{ mEq/L}} & \\text{Add } 20-30\\text{ mEq } K^+ \\text{ per liter of IV fluid} & \\mathbf{\\text{Start IV Regular Insulin at } 0.1\\text{ units/kg/hr}} \\\\
& \\text{maintain serum } K^+ \\text{ between } 4.0-5.0\\text{ mEq/L} & (\\text{or } 0.14\\text{ U/kg/hr if no bolus}) \\\\
\\mathbf{K^+ > 5.2\\text{ mEq/L}} & \\text{Do NOT add potassium; recheck } K^+ \\text{ every 2h} & \\text{Start IV Regular Insulin at } 0.1\\text{ units/kg/hr} \\\\
\\hline
\\end{array}$$

---

## 3. DKA Fluid Titration & Resolution Criteria

- **Dextrose Switch Protocol**:
  - When blood glucose drops to **$< 200\\text{ mg/dL}$ in DKA** (or **$< 300\\text{ mg/dL}$ in HHS**), switch IV fluids to **$5\\%\\text{ Dextrose}$ in $0.45\\%\\text{ NS}$ ($D_5\\text{W } 1/2\\text{ NS}$)** while maintaining insulin infusion at $0.02-0.05\\text{ U/kg/hr}$ to clear ketoacidosis without inducing hypoglycemia or cerebral edema.
- **DKA Resolution Criteria** (All required):
  1. Blood glucose $< 200\\text{ mg/dL}$
  2. Serum bicarbonate $\\ge 18\\text{ mEq/L}$
  3. Venous $\\text{pH} > 7.30$
  4. Normalized anion gap $\\le 12\\text{ mEq/L}$
- **Subcutaneous Transition**:
  - Administer subcutaneous basal insulin (Glargine / Degludec) **2 hours BEFORE discontinuing the IV insulin infusion** to prevent rebound ketoacidosis.
`,
  clinicalVignettes: [
    {
      scenario: "An 18-year-old female with Type 1 Diabetes presents to the intensive care unit with 2 days of nausea, vomiting, abdominal pain, and Kussmaul respirations. Laboratory evaluation reveals: Blood glucose 480 mg/dL, Venous blood gas pH 7.14, Serum sodium 132 mEq/L, Serum potassium 3.0 mEq/L, Serum chloride 96 mEq/L, Serum bicarbonate 8 mEq/L, Anion gap 28 mEq/L, and Beta-hydroxybutyrate 6.2 mmol/L. The patient is dry and tachycardic (HR 124 bpm).",
      question: "What is the initial mandatory intervention regarding insulin and fluid/electrolyte administration?",
      options: [
        "Initiate aggressive isotonic crystalloid fluid resuscitation (0.9% Normal Saline 1,000 mL/hr) AND administer IV potassium replacement (20-40 mEq/hr); HOLD the IV insulin infusion until the serum potassium rises to >=3.3 mEq/L to prevent fatal hypokalemic cardiac arrest and respiratory muscle paralysis",
        "Immediately administer an IV bolus of 0.15 units/kg of regular insulin and start an insulin infusion without potassium",
        "Administer 2 ampules of IV sodium bicarbonate and withhold all intravenous fluids",
        "Switch immediately to subcutaneous insulin glargine and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights the critical 'Potassium-First' rule in DKA management: (1) Pathophysiology: Total body potassium is severely depleted in DKA due to osmotic diuresis and vomiting; however, acidosis and insulinopenia shift K+ extracellularly; (2) Insulin Effect: Administering insulin drives potassium into cells, which can trigger a precipitous drop in serum potassium and cause fatal ventricular arrhythmias or respiratory arrest; (3) Potassium Rule: When serum K+ is <3.3 mEq/L, insulin MUST be withheld while aggressive IV potassium replacement (20-40 mEq/hr) and isotonic fluid resuscitation are initiated until K+ is >=3.3 mEq/L."
    }
  ]
};
