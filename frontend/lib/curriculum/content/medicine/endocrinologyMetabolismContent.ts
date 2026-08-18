/**
 * Endocrinology, Metabolic Disorders & Endocrine Emergencies Learning Content
 * Authoritative medical content derived from Harrison, Davidson, Williams Endocrinology, and USMLE Step 2 CK.
 * Mapped to NMC CBME Competencies: IM4.1, IM4.2, IM4.3, IM4.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ENDOCRINOLOGY_METABOLISM_MODULE: PhysiologyLessonModule = {
  id: "med-endocrinology",
  unitCode: "IM4.1",
  title: "Endocrinology: Diabetic Ketoacidosis (DKA) vs HHS, Thyroid Storm, Cushing & Addison Disease",
  competencies: ["IM4.1", "IM4.2", "IM4.3", "IM4.4"],
  estimatedMinutes: 140,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Endocrinology: Diabetic Ketoacidosis (DKA) vs HHS, Thyroid Storm, Cushing & Addison Disease

Endocrine disorders involve complex feedback loops across the hypothalamic-pituitary-adrenal axis, thyroid axis, and pancreatic hormonal regulation of intermediary metabolism.

---

## 1. Diabetic Ketoacidosis (DKA) vs Hyperosmolar Hyperglycemic State (HHS)

| Diagnostic Parameter | Diabetic Ketoacidosis (DKA) | Hyperosmolar Hyperglycemic State (HHS) |
| :--- | :--- | :--- |
| **Typical Patient Population** | **Type 1 Diabetes Mellitus** (young, absolute insulin deficiency) | **Type 2 Diabetes Mellitus** (elderly, relative insulin deficiency) |
| **Plasma Glucose Level** | **$250\\text{–}500\\text{ mg/dL}$** | **$> 600\\text{ mg/dL}$ (often $>1000\\text{ mg/dL}$)** |
| **Arterial Blood pH** | **$< 7.30$ (Severe Metabolic Acidosis)** | **$> 7.30$ (Normal or mild acidosis)** |
| **Serum Bicarbonate ($HCO_3^-$)** | **$< 18\\text{ mEq/L}$ (often $<10\\text{ mEq/L}$)** | **$> 18\\text{ mEq/L}$** |
| **Serum Osmolality ($mOsm/kg$)** | Variable ($<320\\text{ mOsm/kg}$) | **$> 320\\text{ mOsm/kg}$ (Severe Hyperosmolality)** |
| **Urine / Serum Ketones** | **STRONGLY POSITIVE** ($\\beta$-hydroxybutyrate & acetoacetate) | Absent or trace |
| **Clinical Presentation** | **Kussmaul breathing** (rapid deep respirations), fruity acetone breath, abdominal pain/vomiting | Profound dehydration, **altered mental status / stupor / coma**, focal neurological signs |
| **Average Fluid Deficit** | **$3\\text{–}6\\text{ Liters}$** | **$8\\text{–}10\\text{ Liters}$ (Massive volume depletion)** |

### Comprehensive DKA Management Protocol:
1. **Aggressive IV Fluid Resuscitation**: 1–2 Liters of $0.9\\%$ Normal Saline in the first hour.
2. **Potassium Management Before Insulin**:
   - If $K^+ < 3.3\\text{ mEq/L}$: **HOLD INSULIN** and administer IV KCl ($20-40\\text{ mEq/h}$) until $K^+ > 3.3$ (prevent fatal cardiac arrest from insulin-driven hypokalemia!).
   - If $K^+ = 3.3-5.3\\text{ mEq/L}$: Start insulin and add $20-30\\text{ mEq } KCl$ per liter of IV fluid.
   - If $K^+ > 5.3\\text{ mEq/L}$: Start insulin without potassium; check $K^+$ every 2 hours.
3. **Continuous IV Regular Insulin**: $0.1\\text{ Units/kg/h}$ infusion (target glucose drop $50-75\\text{ mg/dL/h}$).
4. **Transition to D5W**: When glucose falls below $200\\text{ mg/dL}$, add **5% Dextrose** to IV fluids to prevent hypoglycemia while continuing insulin to close the anion gap.

---

## 2. Thyroid Emergencies: Thyroid Storm vs Myxedema Coma

| Feature | Thyroid Storm (Decompensated Thyrotoxicosis) | Myxedema Coma (Decompensated Hypothyroidism) |
| :--- | :--- | :--- |
| **Precipitating Trigger** | Infection, surgery, trauma, iodine load (CT contrast), non-compliance | Cold exposure, sepsis, opioids, sedative medications, myocardial infarction |
| **Clinical Features** | Severe hyperthermia ($>40^\\circ\\text{C}$), marked tachycardia/atrial fibrillation, agitation, delirium, high-output heart failure, jaundice. | Hypothermia ($<35^\\circ\\text{C}$), severe bradycardia, hypoventilation/hypercapnia, periorbital edema, delayed deep tendon reflexes, coma. |
| **Multimodal Pharmacotherapy** | **4-Step Emergency Regimen**:<br>1. **$\\beta$-Blocker**: IV Propranolol or Esmolol (controls sympathetic hyperactivity and inhibits peripheral T4-to-T3 conversion).<br>2. **Thionamide**: High-dose **Propylthiouracil (PTU)** (preferred over methimazole; blocks new synthesis AND peripheral T4-to-T3 conversion).<br>3. **Iodine Solution**: Lugol solution or Potassium Iodide (given **1 hour AFTER thionamide** to prevent Wolff-Chaikoff blockade escape).<br>4. **Corticosteroids**: IV Hydrocortisone (prevents adrenal crisis & inhibits peripheral T4-to-T3). | 1. **IV Levothyroxine (T4)** (loading dose $300-500\\text{ mcg}$) $\\pm$ IV Liothyronine (T3).<br>2. **IV Hydrocortisone** (100 mg q8h; **MUST be administered BEFORE or simultaneously with thyroid hormone** to prevent fatal precipitating Addisonian crisis).<br>3. Passive rewarming (avoid active external rewarming due to peripheral vasodilation & shock). |

---

## 3. Adrenal Cortex Disorders: Cushing Syndrome vs Addison Disease

- **Cushing Syndrome (Hypercortisolemia)**:
  - Clinical Signs: Moon facies, buffalo hump, central obesity with thin extremities, violaceous abdominal striae ($>1\\text{ cm}$ wide), proximal muscle weakness, hypertension, osteoporosis.
  - Screening: **24-hour urinary free cortisol**, Late-night salivary cortisol, or **1 mg overnight Low-Dose Dexamethasone Suppression Test** (cortisol fails to suppress $<1.8\\text{ mcg/dL}$).
  - Differential: **High-Dose (8 mg) Dexamethasone Test**: Suppresses in Pituitary Cushing Disease; **FAILS to suppress** in Ectopic ACTH (Small Cell Lung Cancer) or Adrenal Adenoma.
- **Addison Disease (Primary Adrenal Insufficiency)**:
  - Destruction of adrenal cortex $\\implies$ deficiency of cortisol AND aldosterone.
  - Hallmarks: **Hyperpigmentation** (elevated ACTH / $\\alpha$-MSH), severe fatigue, postural hypotension, **Hyponatremia**, **Hyperkalemia**, and non-anion gap metabolic acidosis.
  - Diagnosis: **Cosyntropin (ACTH) Stimulation Test** (serum cortisol fails to rise $>18\\text{ mcg/dL}$).
  - Treatment: Lifelong **Hydrocortisone** (glucocorticoid) $+$ **Fludrocortisone** (mineralocorticoid).
`,
  clinicalVignettes: [
    {
      scenario: "An 18-year-old female with Type 1 Diabetes is brought to the ED lethargic with vomiting and abdominal pain. Vitals: BP 90/58 mmHg, HR 122 bpm, RR 32 bpm (deep Kussmaul respirations). Labs: Glucose 480 mg/dL, Arterial pH 7.14, Serum Bicarbonate 8 mEq/L, Anion Gap 24 mEq/L, Serum Potassium 3.1 mEq/L, Urine ketones strongly positive.",
      question: "Which of the following represents the most crucial immediate management step?",
      options: [
        "Administer IV Potassium Chloride and HOLD insulin until K+ rises above 3.3 mEq/L",
        "Administer an immediate IV bolus of Regular Insulin (0.14 U/kg)",
        "Administer IV Sodium Bicarbonate infusion",
        "Start an IV continuous insulin infusion without potassium supplementation"
      ],
      correctAnswerIndex: 0,
      explanation: "Although insulin is necessary to arrest ketoacidosis, insulin drives extracellular potassium into cells. In a patient with baseline hypokalemia (K+ = 3.1 mEq/L, which is < 3.3 mEq/L), administering insulin immediately will trigger lethal cardiac arrhythmias, respiratory muscle paralysis, or cardiac arrest. The ADA and international guidelines mandate administering IV potassium and holding insulin until serum potassium is corrected above 3.3 mEq/L."
    }
  ]
};
