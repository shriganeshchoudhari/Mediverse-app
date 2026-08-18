/**
 * Emergency Medicine: Shock Classification, Hemodynamic Profiles & Resuscitation
 * Authoritative medical content derived from Tintinalli's Emergency Medicine (9th ed.), Surviving Sepsis Campaign Guidelines (2021/2026).
 * Mapped to NMC CBME Competencies: EM1.3, EM1.4, MD35.2, AN22.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SHOCK_CLASSIFICATION_HEMODYNAMICS_MODULE: PhysiologyLessonModule = {
  id: "emergency-adv-shock-classification-hemodynamics",
  unitCode: "EM3.1",
  title: "Shock Classification (Hypovolemic, Cardiogenic, Distributive, Obstructive) & Sepsis Resuscitation",
  competencies: ["EM1.3", "EM1.4", "MD35.2", "AN22.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Shock Classification, Hemodynamics & Sepsis Resuscitation

Shock is systemic tissue hypoperfusion resulting in inadequate cellular oxygen delivery and energy failure, categorized by underlying pathophysiological mechanisms.

---

## 1. Comparative Hemodynamic Profiles of Shock States

$$\\begin{array}{lccccc}
\\hline
\\textbf{Shock Category} & \\textbf{Cardiac Output (CO)} & \\textbf{PCWP (Left Preload)} & \\textbf{CVP (Right Preload)} & \\textbf{SVR (Afterload)} & \\textbf{Mixed Venous } O_2\\text{ (}SvO_2\\text{)} \\\\
\\hline
\\textbf{Hypovolemic} & \\mathbf{\\downarrow} & \\mathbf{\\downarrow} & \\mathbf{\\downarrow} & \\mathbf{\\uparrow\\uparrow\\text{ (Compensatory)}} & \\mathbf{\\downarrow} \\\\
\\text{(Hemorrhage, Dehydration)} & & & & & \\\\
\\textbf{Cardiogenic} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow\\uparrow\\text{ (Vasoconstriction)}} & \\mathbf{\\downarrow\\downarrow} \\\\
\\text{(Acute MI, CHF, Myocarditis)} & & & & & \\\\
\\textbf{Distributive (Septic)} & \\mathbf{\\uparrow\\uparrow\\text{ (Early Hyperdynamic)}} & \\mathbf{\\downarrow\\text{ or Normal}} & \\mathbf{\\downarrow\\text{ or Normal}} & \\mathbf{\\downarrow\\downarrow\\text{ (Vasoplegia)}} & \\mathbf{\\uparrow\\text{ (Extraction Defect)}} \\\\
\\text{(Sepsis, Anaphylaxis, Neurogenic)} & \\downarrow\\text{ (Late Depressed)} & & & & \\\\
\\textbf{Obstructive} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow\\text{ (Tamponade) / }\\downarrow\\text{ (PE)}} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow\\uparrow\\text{ (Vasoconstriction)}} & \\mathbf{\\downarrow\\downarrow} \\\\
\\text{(PE, Tamponade, Tension PTX)} & & & & & \\\\
\\hline
\\end{array}$$

---

## 2. Surviving Sepsis Campaign: The 1-Hour Sepsis Bundle

- **Definition of Septic Shock**: Sepsis with persisting hypotension requiring vasopressors to maintain **$\\text{MAP} \\ge 65\\text{ mmHg}$** AND a **serum lactate $>2\\text{ mmol/L}$** despite adequate volume resuscitation.
- **The Protocolized 1-Hour Resuscitation Bundle**:
  1. **Measure Serum Lactate**: Remeasure within $2-4\\text{ hours}$ if initial lactate $>2\\text{ mmol/L}$ to guide resuscitation adequacy.
  2. **Blood Cultures**: Obtain at least 2 sets of blood cultures prior to starting antibiotics (without delaying antibiotic initiation).
  3. **Broad-Spectrum Antibiotics**: Administer empiric intravenous antimicrobials covering Gram-positive and Gram-negative pathogens within **$1\\text{ hour}$ of recognition**.
  4. **Rapid Fluid Bolus**: Administer **$30\\text{ mL/kg}$ of intravenous balanced crystalloids (Lactated Ringer's)** within the first 3 hours for hypotension ($\\text{MAP} < 65\\text{ mmHg}$) or lactate $\\ge 4\\text{ mmol/L}$.
  5. **Vasopressors**: Initiate vasopressors during or immediately after fluid resuscitation if $\\text{MAP} < 65\\text{ mmHg}$.
     - **First-Line Agent**: **Norepinephrine** ($\\alpha_1 > \\beta_1$ agonist).
     - **Second-Line / Adjunct**: **Vasopressin ($0.03\\text{ units/min}$)** to reduce norepinephrine requirements.
     - **Refractory Septic Shock**: Intravenous **Hydrocortisone ($200\\text{ mg/day}$)** if refractory to high-dose vasopressors.
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old female with diabetes is brought to the emergency department with fever, altered mental status, and severe flank pain for 2 days. Vital signs: BP 78/42 mmHg (MAP 54 mmHg), HR 128 bpm, RR 26/min, Temp 39.1°C, SpO2 96% on room air. Physical examination reveals warm, flushed extremities with bounding peripheral pulses and right costovertebral angle tenderness. Laboratory studies demonstrate: WBC 24,500/uL with 18% bands, Serum Creatinine 2.4 mg/dL (baseline 0.9 mg/dL), and Serum Lactate 4.8 mmol/L. Urinalysis demonstrates cloudy urine with 4+ leukocyte esterase and Gram-negative rods.",
      question: "Which of the following represents the hemodynamic profile of this patient's shock state and the definitive immediate fluid resuscitation target?",
      options: [
        "Elevated Cardiac Output, Low Systemic Vascular Resistance, Low/Normal PCWP; Rapid infusion of 30 mL/kg of balanced crystalloids within 3 hours, followed by Norepinephrine if MAP remains <65 mmHg",
        "Decreased Cardiac Output, High Systemic Vascular Resistance, High PCWP; Immediate Dobutamine infusion without fluid bolus",
        "Decreased Cardiac Output, High Systemic Vascular Resistance, Low PCWP; Transfusion of 2 units of Packed Red Blood Cells",
        "Decreased Cardiac Output, Low Systemic Vascular Resistance, Normal PCWP; Immediate Epinephrine infusion"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is in Septic Shock secondary to acute pyelonephritis/urosepsis, meeting Sepsis-3 criteria (infection + refractory hypotension + lactate >2 mmol/L). In early distributive (septic) shock, peripheral cytokine-mediated vasodilation (vasoplegia) causes a profound decrease in Systemic Vascular Resistance (SVR) with warm, flushed extremities, while Cardiac Output is elevated (hyperdynamic state) and preload pressures (CVP, PCWP) are low to normal. According to the Surviving Sepsis Campaign guidelines, immediate management requires rapid administration of 30 mL/kg of balanced crystalloids (Lactated Ringer's) within 3 hours, with initiation of Norepinephrine as the first-choice vasopressor to maintain MAP >= 65 mmHg."
    }
  ]
};
