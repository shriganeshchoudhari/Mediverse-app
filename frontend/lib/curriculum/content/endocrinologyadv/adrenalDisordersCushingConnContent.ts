/**
 * Endocrinology: Adrenal Pathophysiology: Cushing, Addison, Conn & Pheochromocytoma
 * Authoritative medical content derived from Williams Textbook of Endocrinology (14th ed.), Harrison's Principles of Internal Medicine.
 * Mapped to NMC CBME Competencies: IM9.1, IM9.2, PA33.1, PA33.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADRENAL_DISORDERS_CUSHING_CONN_MODULE: PhysiologyLessonModule = {
  id: "endocrinology-adv-adrenal-disorders-cushing-conn",
  unitCode: "EN1.1",
  title: "Adrenal Pathophysiology: Cushing Syndrome Algorithm, Addison Disease, Conn Syndrome & Pheochromocytoma",
  competencies: ["IM9.1", "IM9.2", "PA33.1", "PA33.2"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Adrenal Pathophysiology & Adrenocortical Syndromes

The adrenal gland regulates electrolyte homeostasis, vascular tone, glucocorticoid adaptation, and catecholamine discharge via distinct cortical and medullary zones.

---

## 1. Cushing Syndrome Diagnostic Algorithm

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cushing Subtype} & \\textbf{Baseline ACTH} & \\textbf{Low-Dose (1 mg) DST} & \\textbf{High-Dose (8 mg) DST} & \\textbf{Definitive Diagnostics} \\\\
\\hline
\\textbf{Cushing Disease (Pituitary)} & \\mathbf{\\text{Elevated (}>20\\text{ pg/mL)}} & \\text{No Suppression} & \\mathbf{\\text{Suppression (}>50\\%\\text{)}} & \\text{Pituitary MRI / IPSS} \\\\
\\textbf{Ectopic ACTH (Small Cell / Carcinoid)} & \\mathbf{\\text{Markedly High (}>100\\text{)}} & \\text{No Suppression} & \\mathbf{\\text{No Suppression}} & \\text{Chest/Abdominal CT} \\\\
\\textbf{Adrenal Adenoma / Carcinoma} & \\mathbf{\\text{Suppressed (}<5\\text{ pg/mL)}} & \\text{No Suppression} & \\text{No Suppression} & \\text{Adrenal CT / DHEA-S} \\\\
\\hline
\\end{array}$$

- **Initial Screening Tests**: (1) 24-hour Urinary Free Cortisol (UFC), (2) Late-night salivary cortisol, or (3) Overnight low-dose ($1\\text{ mg}$) dexamethasone suppression test.
- **Dexamethasone Distinction**: Pituitary adenomas (Cushing Disease) retain partial feedback sensitivity and **suppress cortisol production by $>50\\%$** with high-dose ($8\\text{ mg}$) dexamethasone, whereas autonomous ectopic tumors (small cell lung carcinoma) fail to suppress.

---

## 2. Primary vs Secondary Adrenal Insufficiency & Crisis

$$\\begin{array}{lcc}
\\hline
\\textbf{Parameter} & \\textbf{Primary (Addison Disease)} & \\textbf{Secondary / Tertiary} \\\\
\\hline
\\textbf{Pathology} & \\text{Autoimmune adrenalitis (cortex destruction)} & \\text{Pituitary ACTH or Hypothalamic CRH deficiency} \\\\
\\textbf{Hormone Deficits} & \\mathbf{\\text{Cortisol AND Aldosterone Deficient}} & \\mathbf{\\text{Cortisol Deficient ONLY (Aldosterone Intact via RAAS)}} \\\\
\\textbf{Serum ACTH} & \\mathbf{\\text{High (}\\uparrow\\uparrow\\text{)} \\rightarrow \\text{Hyperpigmentation}} & \\text{Low / Inappropriately Normal (Pale Skin)} \\\\
\\textbf{Electrolytes} & \\mathbf{\\text{Hyponatremia, Hyperkalemia, NAGMA}} & \\text{Hyponatremia only (dilutional; Potassium normal)} \\\\
\\textbf{Cosyntropin (250 }\\mu\\text{g)} & \\mathbf{\\text{Failure of Cortisol to Rise (}<18\\ \\mu\\text{g/dL)}} & \\text{Subnormal or delayed response} \\\\
\\hline
\\end{array}$$

- **Acute Adrenal Crisis**: Medical emergency presenting with refractory circulatory shock, fever, and severe abdominal pain $\\rightarrow$ **Immediate IV Hydrocortisone ($100\\text{ mg}$ bolus q8h) $+$ aggressive isotonic crystalloids with $5\\%$ Dextrose**.

---

## 3. Primary Hyperaldosteronism (Conn Syndrome) & Pheochromocytoma

1. **Conn Syndrome (Primary Hyperaldosteronism)**:
   - **Clinical Triad**: Treatment-resistant hypertension, hypokalemia, and metabolic alkalosis.
   - **Screening Test**: **Plasma Aldosterone-to-Renin Ratio (ARR $>20-30$)** with absolute plasma aldosterone $>15\\text{ ng/dL}$ and suppressed plasma renin activity.
   - **Management**: Unilateral adenoma $\\rightarrow$ Laparoscopic adrenalectomy; Bilateral hyperplasia $\rightarrow$ Aldosterone receptor antagonist (**Spironolactone / Eplerenone**).

2. **Pheochromocytoma (Chromaffin Cell Tumor)**:
   - **Clinical Pentad**: Paroxysmal 5 Ps: **P**aroxysms of **P**ain (headache), **P**erspiration, **P**alpitations, **P**allor, and severe hypertension.
   - **Diagnosis**: 24-hour urinary fractionated metanephrines and catecholamines or plasma free metanephrines.
   - **Mandatory Surgical Rule**: **NON-COMPETITIVE ALPHA-BLOCKER (Phenoxybenzamine / Doxazosin) FIRST for 10-14 days BEFORE BETA-BLOCKER!**
   - **Lethal Pitfall**: Initiating a beta-blocker first causes unopposed $\\alpha_1$-adrenergic receptor stimulation, precipitating a fatal hypertensive crisis and pulmonary edema.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old female presents with severe treatment-resistant hypertension (BP 182/108 mmHg despite therapy with Amlodipine, Lisinopril, and Hydrochlorothiazide). She complains of muscle weakness, fatigue, and polyuria. Laboratory investigations reveal: Serum Sodium 144 mEq/L, Serum Potassium 2.8 mEq/L (Normal 3.5-5.0 mEq/L), Serum Bicarbonate 33 mEq/L, Plasma Aldosterone Concentration 36 ng/dL (Normal 3-16 ng/dL), and Plasma Renin Activity 0.2 ng/mL/h (suppressed), yielding an Aldosterone-to-Renin Ratio (ARR) of 180 (Normal <20). Adrenal CT reveals a 1.6 cm well-circumscribed left adrenal cortical adenoma.",
      question: "Which of the following represents the underlying diagnosis and the definitive curative treatment of choice?",
      options: [
        "Primary Hyperaldosteronism (Conn Syndrome due to unilateral aldosterone-producing adenoma); Laparoscopic left adrenalectomy",
        "Secondary Hyperaldosteronism due to renal artery stenosis; Renal artery balloon angioplasty with stenting",
        "Pheochromocytoma; Immediate preoperative beta-blocker initiation followed by surgical resection",
        "Cushing Disease; Transsphenoidal resection of pituitary adenoma"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with the classic triad of Primary Hyperaldosteronism (Conn Syndrome): resistant hypertension, spontaneous hypokalemia, and metabolic alkalosis, confirmed by a markedly elevated Aldosterone-to-Renin Ratio (ARR = 180 with aldosterone >15 ng/dL). The identification of a unilateral 1.6 cm left adrenal adenoma on CT establishes an aldosterone-producing adenoma (APA), for which the definitive curative treatment is laparoscopic unilateral adrenalectomy (following blood pressure and hypokalemia optimization with Spironolactone)."
    }
  ]
};
