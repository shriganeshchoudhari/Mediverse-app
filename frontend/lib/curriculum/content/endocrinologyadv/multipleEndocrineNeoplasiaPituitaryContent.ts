/**
 * Endocrinology: Multiple Endocrine Neoplasia (MEN), Pituitary & Diabetes Insipidus
 * Authoritative medical content derived from Williams Textbook of Endocrinology (14th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: IM9.7, IM9.8, PA36.1, PA36.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MULTIPLE_ENDOCRINE_NEOPLASIA_PITUITARY_MODULE: PhysiologyLessonModule = {
  id: "endocrinology-adv-multiple-endocrine-neoplasia-pituitary",
  unitCode: "EN7.1",
  title: "Multiple Endocrine Neoplasia (MEN 1, MEN 2A, MEN 2B) & Pituitary Diabetes Insipidus",
  competencies: ["IM9.7", "IM9.8", "PA36.1", "PA36.2"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Multiple Endocrine Neoplasia (MEN) & Pituitary Syndromes

Multiple Endocrine Neoplasia syndromes are inherited autosomal dominant disorders causing neoplastic transformation of distinct endocrine organs.

---

## 1. Multiple Endocrine Neoplasia (MEN) Diagnostic Matrix

$$\\begin{array}{lccc}
\\hline
\\textbf{Syndrome} & \\textbf{Mutated Gene} & \\textbf{Classic Triad of Endocrine Tumors} & \\textbf{Distinctive Pathognomonic Features} \\\\
\\hline
\\textbf{MEN 1 (Wermer)} & \\mathbf{\\text{MEN1 (Menin)}} & \\mathbf{\\text{3 Ps: Pituitary, Parathyroid (95\\%), Pancreas}} & \\text{Gastrinoma (Zollinger-Ellison), Insulinoma, Prolactinoma} \\\\
\\textbf{MEN 2A (Sipple)} & \\mathbf{\\text{RET proto-oncogene}} & \\mathbf{\\text{2 Ps: Parathyroid, Pheochromocytoma,}} & \\mathbf{\\text{Medullary Thyroid Carcinoma (MTC 100\\%)}} \\\\
& & \\mathbf{\\text{Medullary Thyroid Carcinoma}} & \\text{Prophylactic thyroidectomy in childhood} \\\\
\\textbf{MEN 2B} & \\mathbf{\\text{RET (M918T codon)}} & \\mathbf{\\text{1 P: Pheochromocytoma, Medullary Thyroid Carcinoma,}} & \\mathbf{\\text{Mucosal Neuromas (lips/tongue) \u0026 Marfanoid Habitus}} \\\\
& & \\mathbf{\\text{Mucosal Neuromas, Marfanoid Habitus}} & \\text{Extremely aggressive MTC presenting in infancy (No Parathyroid!)} \\\\
\\hline
\\end{array}$$

- **Medullary Thyroid Carcinoma (MTC)**: Derived from calcitonin-secreting parafollicular C-cells; histopathology shows sheets of malignant cells in an **amyloid-rich stroma** that stains positive with **Congo Red (apple-green birefringence)**.

---

## 2. Diabetes Insipidus: Water Deprivation & Desmopressin Testing

$$\\begin{array}{lcccc}
\\hline
\\textbf{Condition} & \\textbf{Plasma Osmolality} & \\textbf{Urine Osmolality (Baseline)} & \\textbf{Urine Osm after Desmopressin (dDAVP)} & \\textbf{Definitive Management} \\\\
\\hline
\\textbf{Central DI} & \\text{High (}>295\\text{ mOsm/kg)} & \\text{Low (}<300\\text{ mOsm/kg)} & \\mathbf{\\text{Dramatic Increase (}>50-100\\%\\text{)}} & \\mathbf{\\text{Desmopressin (dDAVP)}} \\\\
\\textbf{Nephrogenic DI} & \\text{High (}>295\\text{)} & \\text{Low (}<300\\text{)} & \\mathbf{\\text{Minimal / No Change (}<10\\%\\text{)}} & \\text{Hydrochlorothiazide, Amiloride, Indomethacin} \\\\
\\textbf{Primary Polydipsia} & \\text{Low (}<280\\text{)} & \\text{Low (dilute)} & \\text{Increases during water restriction} & \\text{Water restriction} \\\\
\\hline
\\end{array}$$

- **Nephrogenic DI Causes**: Chronic **Lithium** therapy (accumulates via ENaC in principal cells, disabling aquaporin-2 translocation), hypercalcemia, and mutations in the $V_2$ vasopressin receptor gene.
`,
  clinicalVignettes: [
    {
      scenario: "An 18-year-old male presents with a painless palpable nodule in his thyroid and a family history of endocrine tumors. Physical examination reveals bumpy, flesh-colored papules and nodules along the anterior border and tip of his tongue and inner mucosal aspect of his lips (mucosal neuromas). He has a tall, slender body build with long digits and joint laxity (marfanoid habitus), but normal lens examination and normal aortic root diameter. Fine needle aspiration biopsy of the thyroid nodule demonstrates calcitonin-positive cells with amyloid stroma, confirming medullary thyroid carcinoma.",
      question: "Which of the following genetic mutations and clinical syndromes is this patient most likely exhibiting, and what additional tumor must be ruled out prior to neck surgery?",
      options: [
        "RET proto-oncogene mutation; Multiple Endocrine Neoplasia Type 2B (MEN 2B); Preoperative screening for Pheochromocytoma with urinary metanephrines",
        "MEN1 tumor suppressor gene mutation; MEN 1; Screening for Pituitary Prolactinoma",
        "RET proto-oncogene mutation; MEN 2A; Screening for primary hyperparathyroidism",
        "FBN1 fibrillin-1 gene mutation; Marfan syndrome; Screening for ascending aortic dissection"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic pathognomonic physical features of Multiple Endocrine Neoplasia Type 2B (MEN 2B): mucosal neuromas of the tongue/lips, marfanoid habitus, and aggressive Medullary Thyroid Carcinoma (MTC), driven by autosomal dominant activating mutations in the RET proto-oncogene (most commonly codon M918T). Prior to any thyroidectomy or neck surgery, it is MANDATORY to rule out a concurrent or occult Pheochromocytoma via plasma or 24-hour urinary metanephrines to avoid precipitating a lethal intraoperative adrenergic crisis during anesthesia."
    }
  ]
};
