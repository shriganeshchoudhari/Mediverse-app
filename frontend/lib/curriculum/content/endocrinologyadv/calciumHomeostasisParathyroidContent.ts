/**
 * Endocrinology: Calcium Homeostasis & Parathyroid Disorders
 * Authoritative medical content derived from Williams Textbook of Endocrinology (14th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: IM9.5, IM9.6, PA35.1, PA35.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CALCIUM_HOMEOSTASIS_PARATHYROID_MODULE: PhysiologyLessonModule = {
  id: "endocrinology-adv-calcium-homeostasis-parathyroid",
  unitCode: "EN5.1",
  title: "Calcium Homeostasis: Primary Hyperparathyroidism, FHH, Humoral Malignancy & Hypocalcemia",
  competencies: ["IM9.5", "IM9.6", "PA35.1", "PA35.2"],
  estimatedMinutes: 150,
  organ3dTarget: "ENDOCRINE",
  markdownContent: `
# Calcium Homeostasis & Parathyroid Pathophysiology

Calcium homeostasis is tightly regulated by parathyroid hormone (PTH), 1,25-dihydroxyvitamin D ($1,25(\\text{OH})_2\\text{D}$ / Calcitriol), and the calcium-sensing receptor (CaSR) across bone, kidney, and intestine.

---

## 1. Algorithmic Differential Diagnosis of Hypercalcemia

$$\\begin{array}{lcccc}
\\hline
\\textbf{Etiology} & \\textbf{Serum Ca}^{2+} & \\textbf{Intact PTH} & \\textbf{24-hr Urine Ca}^{2+} & \\textbf{PTHrP / Calcitriol} \\\\
\\hline
\\textbf{Primary Hyperparathyroidism (PHPT)} & \\mathbf{\\text{High (}>10.5\\text{)}} & \\mathbf{\\text{High / Inapprop. Normal}} & \\mathbf{\\text{High (}>200\\text{ mg/24h)}} & \\text{Low PTHrP, High Calcitriol} \\\\
\\textbf{Familial Hypocalciuric Hypercalcemia (FHH)} & \\mathbf{\\text{High (Mild)}} & \\mathbf{\\text{Normal / Mild High}} & \\mathbf{\\text{EXTREMELY LOW (CCCR }<0.01\\text{)}} & \\text{Normal} \\\\
\\textbf{Humoral Malignancy (HHM - PTHrP)} & \\mathbf{\\text{Markedly High}} & \\mathbf{\\text{SUPPRESSED (}<5\\text{ pg/mL)}} & \\text{Markedly High} & \\mathbf{\\text{High PTHrP}} \\\\
\\textbf{Granulomatous (Sarcoidosis / TB)} & \\text{High} & \\text{Suppressed} & \\text{High} & \\mathbf{\\text{High 1,25(OH)}_2\\text{D (1}\\alpha\\text{-hydroxylase)}} \\\\
\\hline
\\end{array}$$

$$\\text{Calcium-to-Creatinine Clearance Ratio (CCCR)} = \\frac{\\text{Urine Ca} \\times \\text{Serum Creatinine}}{\\text{Serum Ca} \\times \\text{Urine Creatinine}}$$

- **PHPT Clinical Manifestations**: \"Bones (osteitis fibrosa cystica, subperiosteal bone resorption, brown tumors of bone), Stones (nephrolithiasis, nephrocalcinosis), Groans (constipation, peptic ulcer disease, pancreatitis), Psychiatric overtones (fatigue, depression, cognitive impairment)\".
- **FHH Critical Distinction**: Autosomal dominant loss-of-function mutation in the *CASR* gene raises the set-point for parathyroid suppression; **benign condition requiring NO surgical parathyroidectomy** (CCCR $<0.01$ distinguishes FHH from PHPT).

---

## 2. Hypocalcemia: Clinical Signs & Pathophysiology

- **Etiologies**: Surgical damage during thyroidectomy (postoperative hypoparathyroidism), autoimmune destruction, DiGeorge syndrome ($22\\text{q11.2}$ deletion), severe hypomagnesemia (impairs both PTH release and peripheral PTH action), and Pseudohypoparathyroidism.
- **Physical Examination Signs of Neuromuscular Excitability**:
  1. **Chvostek Sign**: Tapping the facial nerve anterior to the earlobe produces ipsilateral twitching of the facial/lip muscles.
  2. **Trousseau Sign**: Inflating a sphygmomanometer blood pressure cuff $>20\\text{ mmHg}$ above systolic pressure for 3 minutes precipitates painful carpopedal spasm (more sensitive and specific than Chvostek).
- **ECG Hallmark**: **Prolonged QTc interval** (increases the risk of ventricular arrhythmias and Torsades de Pointes).
- **Emergency Resuscitation**: **Intravenous Calcium Gluconate ($10\\%$ solution, $10-20\\text{ mL}$ infused over 10 minutes)** $\pm$ Magnesium repletion if hypomagnesemic.
`,
  clinicalVignettes: [
    {
      scenario: "A 38-year-old male is referred for evaluation of incidental hypercalcemia found on routine wellness blood tests. He is entirely asymptomatic with no history of kidney stones, bone fractures, or gastrointestinal complaints. Laboratory studies reveal: Total Serum Calcium 10.9 mg/dL (Normal 8.5-10.2 mg/dL), Ionized Calcium 1.38 mmol/L (Normal 1.15-1.33 mmol/L), Serum Phosphate 3.2 mg/dL, and Intact PTH 48 pg/mL (Normal 15-65 pg/mL, inappropriately normal in the setting of hypercalcemia). 24-hour urine collection reveals: Urine Calcium 42 mg/24h (Normal 100-300 mg/24h), with a calculated Calcium-to-Creatinine Clearance Ratio (CCCR) of 0.004 (CCCR <0.01). Family history reveals asymptomatic mild hypercalcemia in his mother and brother.",
      question: "Which of the following represents the definitive diagnosis and the appropriate clinical management strategy?",
      options: [
        "Familial Hypocalciuric Hypercalcemia (FHH due to an inactivating CASR mutation); Conservative reassurance with no surgical parathyroid exploration",
        "Primary Hyperparathyroidism due to solitary parathyroid adenoma; Four-gland parathyroid exploration and excision",
        "Humoral Hypercalcemia of Malignancy; Whole-body PET-CT scanning for occult squamous cell carcinoma",
        "Vitamin D toxicity; High-dose loop diuretic hydration with Furosemide"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient demonstrates mild, asymptomatic, familial hypercalcemia with an inappropriately normal PTH level and profoundly low urinary calcium excretion (24-hour urine calcium <100 mg and CCCR = 0.004 < 0.01). This pattern is pathognomonic for Familial Hypocalciuric Hypercalcemia (FHH), an autosomal dominant condition caused by heterozygous loss-of-function mutations in the Calcium-Sensing Receptor (CASR) gene. FHH is a benign disorder with no associated end-organ damage (no nephrolithiasis or bone loss); parathyroidectomy is completely ineffective and strictly contraindicated."
    }
  ]
};
