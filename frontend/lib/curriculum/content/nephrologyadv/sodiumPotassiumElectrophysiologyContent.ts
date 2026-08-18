/**
 * Nephrology: Sodium, Water Balance & Potassium Electrophysiology
 * Authoritative medical content derived from Brenner & Rector's The Kidney (11th ed.), Braunwald's Heart Disease.
 * Mapped to NMC CBME Competencies: IM13.5, IM13.6, PY4.3, PY4.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SODIUM_POTASSIUM_ELECTROPHYSIOLOGY_MODULE: PhysiologyLessonModule = {
  id: "nephrology-adv-sodium-potassium-electrophysiology",
  unitCode: "NE7.1",
  title: "Sodium, Water Balance & Potassium Electrophysiology: SIADH, ODS, Hyperkalemia Sine-Wave & Calcium Rescue",
  competencies: ["IM13.5", "IM13.6", "PY4.3", "PY4.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Sodium, Water Homeostasis & Potassium Electrophysiology

Electrolyte disorders represent acute clinical emergencies requiring systematic differentiation of tonicity, volume status, and myocardial membrane stabilization.

---

## 1. Hyponatremia Diagnostic Algorithm & SIADH

$$\\begin{array}{lccc}
\\hline
\\textbf{Volume Status} & \\textbf{Urinary Sodium (UNa)} & \\textbf{Urine Osmolality} & \\textbf{Etiologies \u0026 Treatment} \\\\
\\hline
\\textbf{Hypovolemic} & \u003c20\\text{ (extrarenal loss)} & \u003e400\\text{ mOsm/kg} & \\text{Vomiting, diarrhea, third-spacing} \\\\
& \u003e20\\text{ (renal loss)} & \u003c400\\text{ mOsm/kg} & \\text{Diuretics, mineralocorticoid deficiency} \\\\
& & & \\mathbf{\\text{Treatment: }} 0.9\\%\\text{ Normal Saline} \\\\
\\hline
\\textbf{Euvolemic} & \\mathbf{\u003e40\\text{ mEq/L}} & \\mathbf{\u003e100\\text{ mOsm/kg}} & \\mathbf{\\text{SIADH}}\\text{ (Small cell lung cancer, SSRIs, CNS)} \\\\
& & & \\mathbf{\\text{Treatment: }} \\text{Fluid restriction, Vaptans} \\\\
& \u003c20\\text{ mEq/L} & \\mathbf{\u003c100\\text{ mOsm/kg}} & \\text{Psychogenic Polydipsia, Beer Potomania} \\\\
\\hline
\\textbf{Hypervolemic} & \u003c20\\text{ mEq/L} & \u003e400\\text{ mOsm/kg} & \\text{Heart failure, Cirrhosis, Nephrotic syndrome} \\\\
& & & \\mathbf{\\text{Treatment: }} \\text{Sodium/fluid restriction, Loop diuretics} \\\\
\\hline
\\end{array}$$

- **Osmotic Demyelination Syndrome (ODS / Central Pontine Myelinolysis)**:
  - Danger of overly rapid sodium correction in chronic hyponatremia ($>8 - 10\\text{ mEq/L}$ in $24\\text{ hours}$).
  - Pathophysiology: Massive brain endothelial shrinkage and oligodendrocyte demyelination $\\rightarrow$ **Dysarthria, Dysphagia, Spastic Quadriplegia, and \"Locked-in\" syndrome**.

---

## 2. Potassium Electrophysiology & Emergency Management

$$\\begin{array}{lll}
\\hline
\\textbf{Severity} & \\textbf{ECG Progression} & \\textbf{Immediate Management Protocol} \\\\
\\hline
\\textbf{Hyperkalemia} & \\text{• Mild (}5.5 - 6.5\\text{): Tall, narrow, peaked T waves} & \\mathbf{\\text{1. Membrane Stabilization: }} \\text{IV Calcium Gluconate 10\\%} \\\\
(\\text{K}^+ \u003e 5.5) & \\text{• Moderate (}6.5 - 7.5\\text{): PR prolongation, loss of P wave} & \\mathbf{\\text{2. Intracellular Shift: }} \\text{IV Regular Insulin + D50,} \\\\
& \\text{• Severe (}\u003e7.5\\text{): Widened QRS } \\rightarrow \\mathbf{\\text{Sine-Wave}} \\rightarrow \\text{VF/PEA} & \\quad \\text{Inhaled Albuterol, IV Sodium Bicarbonate} \\\\
& & \\mathbf{\\text{3. Elimination: }} \\text{Furosemide, Patiromer, Hemodialysis} \\\\
\\hline
\\textbf{Hypokalemia} & \\text{• Flat/inverted T waves, ST depression} & \\mathbf{\\text{1. Potassium Replacement: }} \\text{Oral/IV KCl} \\\\
(\\text{K}^+ \u003c 3.5) & \\text{• }\\mathbf{\\text{Prominent U waves}}\\text{, QT prolongation } \\rightarrow \\text{Torsades} & \\mathbf{\\text{2. Mandatory Co-factor: }} \\mathbf{\\text{IV Magnesium Sulfate}} \\\\
\\hline
\\end{array}$$

- **Critical Emergency Rule**: Intravenous Calcium does NOT lower serum potassium; it directly restores cardiac membrane resting potential, preventing fatal ventricular fibrillation while potassium-shifting therapies are administered.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with small cell lung cancer presents with confusion, anorexia, and lethargy. Examination reveals a euvolemic state with moist mucous membranes, normal skin turgor, no jugular venous distention, and absence of peripheral edema. Laboratory studies reveal: Serum Sodium 116 mEq/L, Serum Osmolality 242 mOsm/kg (Hypotonic), Serum Uric Acid 2.2 mg/dL (Low), Urine Sodium 52 mEq/L, and Urine Osmolality 510 mOsm/kg. Thyroid and adrenal functions are normal.",
      question: "Which of the following represents the definitive diagnosis, appropriate initial management, and safe correction limit to prevent Osmotic Demyelination Syndrome?",
      options: [
        "SIADH; Fluid restriction (500-1000 mL/day) and hypertonic 3% saline for severe symptoms, limiting correction to <=8 mEq/L in 24 hours",
        "Psychogenic polydipsia; Intravenous 0.9% normal saline at 200 mL/h with target sodium rise of 18 mEq/L in 24 hours",
        "Hypovolemic hyponatremia; Rapid infusion of 0.45% half-normal saline",
        "Cerebral salt wasting; High-dose loop diuretics and fluid restriction"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic features of SIADH (Syndrome of Inappropriate ADH Secretion) secondary to ectopic ADH production from small cell lung cancer: hypotonic hyponatremia (Na 116 mEq/L, Osm 242 mOsm/kg) in a clinically euvolemic patient, with concentrated urine (Urine Osm 510 mOsm/kg > 100) and elevated urinary sodium (UNa 52 mEq/L > 40) along with hypouricemia. The initial treatment is fluid restriction, with hypertonic 3% saline reserved for severe neurological symptoms. To prevent catastrophic Osmotic Demyelination Syndrome (central pontine myelinolysis), the rate of sodium correction must NOT exceed 8 mEq/L in any 24-hour period."
    }
  ]
};
