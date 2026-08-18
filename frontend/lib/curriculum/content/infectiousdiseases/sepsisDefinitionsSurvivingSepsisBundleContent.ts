/**
 * Infectious Diseases: Sepsis-3 Definitions, Pathophysiology & Surviving Sepsis Hour-1 Bundle
 * Authoritative medical content derived from Surviving Sepsis Campaign Guidelines 2021, Sepsis-3 Consensus Definitions.
 * Mapped to NMC CBME Competencies: ID1.1, ID1.2, ID2.1, ID2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SEPSIS_DEFINITIONS_SURVIVING_SEPSIS_BUNDLE_MODULE: PhysiologyLessonModule = {
  id: "infectious-diseases-sepsis-definitions-surviving-sepsis-bundle",
  unitCode: "ID1.1",
  title: "Sepsis-3 Consensus, SOFA/qSOFA Scoring, Septic Shock & Surviving Sepsis Campaign Hour-1 Bundle",
  competencies: ["ID1.1", "ID1.2", "ID2.1", "ID2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "MICROBIOLOGY",
  markdownContent: `
# Sepsis-3 Consensus, SOFA/qSOFA Scoring & Surviving Sepsis Hour-1 Bundle

Sepsis is defined by the Third International Consensus Definitions (Sepsis-3) as life-threatening organ dysfunction caused by a dysregulated host response to infection.

---

## 1. Sepsis-3 Diagnostic Criteria & SOFA Score

- **Sepsis**: Documented or suspected infection PLUS an acute increase in total **Sequential Organ Failure Assessment (SOFA) score $\\ge 2\\text{ points}$** above baseline. (Reflects an overall in-hospital mortality rate $>10\\%$).
- **Sequential Organ Failure Assessment (SOFA) Score (0 to 4 points per organ system)**:
  1. **Respiration**: $\\text{PaO}_2 / \\text{FiO}_2$ ratio ($<400 \\rightarrow 1\\text{ pt}$, $<300 \\rightarrow 2\\text{ pts}$, $<200\\text{ with ventilatory support} \\rightarrow 3\\text{ pts}$, $<100\\text{ with support} \\rightarrow 4\\text{ pts}$).
  2. **Coagulation**: Platelet count ($<150 \\times 10^3/\\mu\\text{L} \\rightarrow 1\\text{ pt}$, $<100 \\rightarrow 2\\text{ pts}$, $<50 \\rightarrow 3\\text{ pts}$, $<20 \\rightarrow 4\\text{ pts}$).
  3. **Liver**: Total Bilirubin ($1.2 - 1.9\\text{ mg/dL} \\rightarrow 1\\text{ pt}$, $2.0 - 5.9 \\rightarrow 2\\text{ pts}$, $6.0 - 11.9 \\rightarrow 3\\text{ pts}$, $\\ge 12.0 \\rightarrow 4\\text{ pts}$).
  4. **Cardiovascular**: Mean Arterial Pressure (MAP) and Vasopressor requirements ($\text{MAP} <70\\text{ mmHg} \\rightarrow 1\\text{ pt}$; Dopamine $\\le 5$ or Dobutamine any dose $\\rightarrow 2\\text{ pts}$; Norepinephrine $\\le 0.1\\ \\mu\\text{g/kg/min} \\rightarrow 3\\text{ pts}$; Norepinephrine $>0.1\\ \\mu\\text{g/kg/min} \\rightarrow 4\\text{ pts}$).
  5. **Central Nervous System**: Glasgow Coma Scale (GCS $13-14 \\rightarrow 1\\text{ pt}$, $10-12 \\rightarrow 2\\text{ pts}$, $6-9 \\rightarrow 3\\text{ pts}$, $<6 \\rightarrow 4\\text{ pts}$).
  6. **Renal**: Serum Creatinine or Urine Output ($\text{Cr } 1.2 - 1.9\\text{ mg/dL} \\rightarrow 1\\text{ pt}$, $2.0 - 3.4 \\rightarrow 2\\text{ pts}$, $3.5 - 4.9\\text{ or } <500\\text{ mL/day} \\rightarrow 3\\text{ pts}$, $>5.0\\text{ or } <200\\text{ mL/day} \\rightarrow 4\\text{ pts}$).

---

## 2. Bedside Quick SOFA (qSOFA) vs Septic Shock

| Clinical Entity | Formal Definition | Bedside Diagnostic Criteria | Clinical Significance |
| :--- | :--- | :--- | :--- |
| **qSOFA Screening** | Rapid bedside prompt to identify patients with suspected infection at high risk of poor outcome outside the ICU. | $\\mathbf{\\ge 2\\text{ of the following 3 criteria}}$:<br>1. **Respiratory Rate $\\ge 22/\\text{min}$**<br>2. **Altered Mentation (GCS $<15$)**<br>3. **Systolic Blood Pressure $\\le 100\\text{ mmHg}$** | High specificity; prompts urgent ICU consultation, laboratory workup, and lactate measurement. |
| **Septic Shock** | Subset of sepsis in which underlying circulatory and cellular/metabolic abnormalities are profound enough to substantially increase mortality ($>40\\%$). | **Sepsis with BOTH**:<br>1. **Persistent Hypotension** requiring vasopressors to maintain **$\\text{MAP} \\ge 65\\text{ mmHg}$** despite adequate fluid resuscitation.<br>2. **Serum Lactate $>2.0\\text{ mmol/L}$ ($>18\\text{ mg/dL}$)** despite adequate fluid resuscitation. | Represents cellular dysoxia, mitochondrial dysfunction, and vasoplegic distributive shock. |

---

## 3. Surviving Sepsis Campaign (SSC) Hour-1 Bundle

$$\\begin{array}{cll}
\\hline
\\textbf{Step} & \\textbf{Hour-1 Action Item} & \\textbf{Clinical Protocol \u0026 Quality Target} \\\\
\\hline
\\mathbf{1} & \\textbf{Measure Blood Lactate Level} & \\text{Remeasure within } 2-4\\text{ hours if initial lactate is elevated (}\u003e2.0\\text{ mmol/L) to guide resuscitation.} \\\\
\\mathbf{2} & \\textbf{Obtain Blood Cultures Prior to Antibiotics} & \\text{At least 2 sets (aerobic + anaerobic). Do NOT delay antibiotics if blood cultures take }\u003e45\\text{ min.} \\\\
\\mathbf{3} & \\textbf{Administer Broad-Spectrum IV Antibiotics} & \\text{Empiric broad-spectrum coverage initiated within }\\mathbf{\u003c1\\text{ hour}}\\text{ of sepsis recognition.} \\\\
\\mathbf{4} & \\textbf{Administer 30 mL/kg IV Balanced Crystalloid} & \\text{For hypotension (MAP }\u003c65\\text{) or lactate }\\ge 4.0\\text{ mmol/L. Plasmalyte / Ringer's Lactate preferred over 0.9\\% Saline.} \\\\
\\mathbf{5} & \\textbf{Apply Vasopressors if Hypotensive} & \\text{Titrate to maintain }\\mathbf{\\text{MAP } \\ge 65\\text{ mmHg}}\\text{. First-line: }\\mathbf{\\text{Norepinephrine}}\\text{; Second-line: }\\mathbf{\\text{Vasopressin (0.03 U/min)}}\\text{.} \\\\
\\hline
\\end{array}$$

- **Vasopressor Hierarchy**:
  - **First-Line**: **Norepinephrine** ($0.01 - 3.0\\ \mu\\text{g/kg/min}$) (potent $\\alpha_1$-agonist vasoconstriction with moderate $\\beta_1$ inotropy).
  - **Second-Line (Add-on)**: **Vasopressin** ($0.03\\text{ units/min}$ fixed dose, non-titrated) to raise MAP and reduce norepinephrine dosage (V1 receptor stimulation).
  - **Inotrope for Myocardial Dysfunction**: **Dobutamine** (up to $20\\ \mu\\text{g/kg/min}$) if persistent hypoperfusion despite adequate MAP and fluid loading.
  - **Refractory Septic Shock**: **Intravenous Hydrocortisone** ($200\\text{ mg/day}$ continuous infusion or $50\\text{ mg}$ IV q6h) for shock requiring ongoing high-dose vasopressors.
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old female presents to the emergency department from a nursing home with confusion, fever (38.8°C), and productive cough. Vital signs: BP 84/46 mmHg (MAP 58 mmHg), HR 128 bpm, RR 26/min, SpO2 91% on room air. Physical examination reveals crackles in the right lung base and lethargy (GCS 13). Arterial blood gas demonstrates a serum lactate of 4.4 mmol/L. Point-of-care laboratory tests show a WBC of 18,500/uL.",
      question: "Which of the following represents the patient's bedside qSOFA score and the immediate first-line fluid resuscitation volume indicated by the Surviving Sepsis Campaign Hour-1 Bundle (patient weight: 60 kg)?",
      options: [
        "qSOFA score = 3 (RR >=22, GCS <15, SBP <=100); Fluid bolus = 1,800 mL (30 mL/kg) of IV balanced crystalloid",
        "qSOFA score = 1; Fluid bolus = 500 mL of 5% Dextrose",
        "qSOFA score = 2; Fluid bolus = 3,000 mL of 0.9% Normal Saline with maintenance potassium",
        "qSOFA score = 3; Fluid restriction with immediate Dobutamine monotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient meets all 3 criteria for qSOFA (RR >=22 [26/min], altered mentation GCS <15 [GCS 13], and SBP <=100 [84 mmHg]), yielding a qSOFA score of 3/3, indicating high risk of in-hospital mortality. Under the Surviving Sepsis Campaign Hour-1 Bundle, patients with sepsis-induced hypotension (MAP <65 mmHg) or initial lactate >=4.0 mmol/L must immediately receive at least 30 mL/kg of IV balanced crystalloids (for a 60 kg patient: 60 * 30 = 1,800 mL) within the first 3 hours, along with blood cultures, broad-spectrum IV antibiotics within 1 hour, and Norepinephrine if MAP remains <65 mmHg."
    }
  ]
};
