/**
 * Endocrinology: Thyroid Pathophysiology: Graves, Hashimoto, Storm & Myxedema
 * Authoritative medical content derived from Williams Textbook of Endocrinology (14th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: IM9.3, IM9.4, PA34.1, PA34.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THYROID_DISORDERS_STORM_MYXEDEMA_MODULE: PhysiologyLessonModule = {
  id: "endocrinology-adv-thyroid-disorders-storm-myxedema",
  unitCode: "EN3.1",
  title: "Thyroid Pathophysiology: Graves Disease, Hashimoto Thyroiditis, Thyroid Storm & Myxedema Coma",
  competencies: ["IM9.3", "IM9.4", "PA34.1", "PA34.2"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Thyroid Pathophysiology & Endocrine Emergencies

Thyroid dysfunction spans autoimmune receptor stimulation, chronic destructive lymphocytic thyroiditis, and life-threatening hypermetabolic or hypometabolic crises.

---

## 1. Graves Disease vs Destructive / Toxic Thyroiditis

$$\\begin{array}{lcccc}
\\hline
\\textbf{Etiology} & \\textbf{Autoantibodies} & \\textbf{RAIU Uptake Scan} & \\textbf{Unique Extrathyroidal Signs} & \\textbf{Treatment} \\\\
\\hline
\\textbf{Graves Disease} & \\mathbf{\\text{TSI / TSH-R-Ab (}>90\\%\\text{)}} & \\mathbf{\\text{Diffuse Homogeneous High}} & \\mathbf{\\text{Exophthalmos, Pretibial Myxedema, Bruit}} & \\text{Methimazole, RAI, Surgery} \\\\
\\textbf{Toxic Multinodular} & \\text{None} & \\text{Patchy / Multiple Hot Nodules} & \\text{Tracheal compression (large goiter)} & \\text{Radioiodine ablation / Surgery} \\\\
\\textbf{De Quervain (Subacute)} & \\text{None (viral)} & \\mathbf{\\text{Very Low / Absent Uptake}} & \\mathbf{\\text{Exquisitely painful tender thyroid, }\\uparrow\\text{ESR}} & \\text{NSAIDs / Prednisone} \\\\
\\textbf{Hashimoto Thyroiditis} & \\mathbf{\\text{Anti-TPO \u0026 Anti-Tg}} & \\text{Variable / Low} & \\text{Painless goiter } \\rightarrow \\text{ Hypothyroid} & \\text{Levothyroxine (T4)} \\\\
\\hline
\\end{array}$$

- **Hashimoto Histopathology**: Dense lymphocytic infiltrate with well-developed germinal centers and **Hürthle cells (oxyphilic cells with granular eosinophilic cytoplasm)**; associated with an increased risk of **Primary Thyroid Marginal Zone B-cell Lymphoma**.

---

## 2. Thyroid Storm: 4-Step Sequential Emergency Protocol

Thyroid storm is a life-threatening state of extreme hypermetabolism triggered by infection, surgery, or non-compliance in a thyrotoxic patient (marked by hyperpyrexia $>40^\\circ\\text{C}$, tachyarrhythmias, agitated delirium, and high-output heart failure).

$$\\begin{array}{cll}
\\hline
\\textbf{Step} & \\textbf{Medication Class \u0026 Drug} & \\textbf{Specific Mechanism of Action} \\\\
\\hline
\\textbf{1} & \\mathbf{\\beta\\text{-Blocker (IV Propranolol / Esmolol)}} & \\text{Controls tachyarrhythmias, reduces tremor, blocks peripheral } \\text{T}_4 \\rightarrow \\text{T}_3 \\text{ conversion} \\\\
\\textbf{2} & \\mathbf{\\text{Thionamide (Propylthiouracil PTU / Methimazole)}} & \\text{Blocks thyroid peroxidase (TPO) to arrest new hormone organification} \\\\
\\textbf{3} & \\mathbf{\\text{Inorganic Iodine (Lugol Solution / SSKI)}} & \\mathbf{\\text{GIVEN } \\ge 1\\text{ HOUR AFTER THIONAMIDE; }} \\text{blocks hormone release (Wolff-Chaikoff)} \\\\
\\textbf{4} & \\mathbf{\\text{Corticosteroids (IV Hydrocortisone 100 mg q8h)}} & \\text{Blocks peripheral } \\text{T}_4 \\rightarrow \\text{T}_3 \\text{ deiodination and treats relative adrenal exhaustion} \\\\
\\hline
\\end{array}$$

- **Critical Sequencing Rationale**: Inorganic iodine must be delayed for at least 1 hour **after** the thionamide to prevent the iodine from acting as an organification substrate for accelerated de novo thyroid hormone synthesis (Jod-Basedow phenomenon).

---

## 3. Myxedema Coma Emergency Protocol

- **Presentation**: Severe hypothermia ($<35^\\circ\\text{C}$), hypoventilation/hypercapnia, bradycardia, severe periorbital/non-pitting edema, and lethargy progressing to coma in an elderly patient with untreated hypothyroidism.
- **Immediate Resuscitation**:
  1. **Passive external warming** (avoid aggressive active heating to prevent peripheral vasodilation and circulatory collapse).
  2. **Intravenous Hydrocortisone ($100\\text{ mg}$ IV bolus)** administered **before or simultaneously with thyroid hormone** to prevent precipitating acute adrenal crisis.
  3. **Intravenous Levothyroxine ($\\text{T}_4$) $\\pm$ IV Liothyronine ($\\text{T}_3$)** loading doses.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old female with poorly controlled Graves disease is brought to the emergency department by her family with acute mental confusion, severe agitation, profuse sweating, and vomiting following an acute bacterial pneumonia. Vital signs: Temp 40.2°C (104.4°F), HR 164 bpm (irregularly irregular, consistent with atrial fibrillation on ECG), BP 168/74 mmHg, RR 26/min. Physical examination reveals bilateral proptosis, an enlarged thyroid gland with an audible systolic bruit, tremor, and delirium.",
      question: "Which of the following represents the correct immediate sequential pharmacological protocol indicated to manage this life-threatening endocrine emergency?",
      options: [
        "IV Propranolol -> High-dose Propylthiouracil (PTU) -> Potassium Iodide (Lugol solution) administered at least 1 hour after PTU -> IV Hydrocortisone",
        "Immediate Potassium Iodide (Lugol solution) monotherapy followed 4 hours later by oral Methimazole",
        "High-dose intravenous Aspirin for hyperpyrexia combined with emergent total thyroidectomy",
        "Immediate intravenous Levothyroxine replacement and broad-spectrum antibiotics alone"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is in life-threatening Thyroid Storm (Burch-Wartofsky score >45). The evidence-based sequential management protocol requires: (1) Beta-blockade with IV Propranolol to control hemodynamic storm and block peripheral T4 to T3 deiodination; (2) High-dose Thionamide (PTU preferred for rapid onset) to arrest thyroid hormone organification; (3) Potassium Iodide (Lugol solution or SSKI) delayed for >=1 hour after thionamide to prevent it from serving as a substrate for new hormone synthesis; and (4) IV Hydrocortisone to block peripheral deiodination and prevent relative adrenal insufficiency. Note: Aspirin is strictly contraindicated as it displaces thyroid hormone from thyroid-binding globulin (TBG), exacerbating free T3/T4 levels."
    }
  ]
};
