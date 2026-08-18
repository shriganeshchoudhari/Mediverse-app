/**
 * Internship Core Clinical Postings: Sepsis-3 Resuscitation Bundles & Septic Shock Hemodynamics
 * Authoritative sepsis resuscitation content derived from Surviving Sepsis Campaign 2024, Sepsis-3 Consensus.
 * Mapped to NMC CBME Competencies: IN1.2, EM1.2, AN1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SEPSIS3_RESUSCITATION_BUNDLE_MODULE: PhysiologyLessonModule = {
  id: "int1-sepsis3-resuscitation-bundle",
  unitCode: "IN1.2",
  title: "Sepsis-3 Resuscitation: Surviving Sepsis Campaign Hour-1 Bundle, 30 mL/kg Crystalloids & Vasopressor Titration",
  competencies: ["IN1.2", "EM1.2", "AN1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Sepsis-3 Diagnostic Criteria, Pathophysiology & Surviving Sepsis Hour-1 Bundle

Early identification of acute organ dysfunction and prompt completion of the Hour-1 bundle dramatically decrease septic shock mortality.

---

## 1. Sepsis-3 Consensus Definitions

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Syndrome} & \\textbf{Diagnostic Consensus Definition} & \\textbf{Hemodynamic / Cellular Criteria} \\\\
\\hline
\\textbf{Sepsis} & \\mathbf{\\text{Life-threatening organ dysfunction caused by a}} & \\mathbf{\\text{Acute increase in SOFA score } \\ge 2\\text{ points}} \\\\
& \\mathbf{\\text{dysregulated host response to infection}} & (\\text{or bedside qSOFA: RR } \\ge 22\\text{, altered mental status, SBP } \\le 100\\text{ mmHg}) \\\\
\\textbf{Septic Shock} & \\mathbf{\\text{Subsetting of sepsis with profound circulatory,}} & \\mathbf{\\text{1. Persisting hypotension requiring vasopressors to maintain}} \\\\
& \\mathbf{\\text{cellular, and metabolic abnormalities}} & \\mathbf{\\text{Mean Arterial Pressure (MAP) } \\ge 65\\text{ mmHg AND}} \\\\
& & \\mathbf{\\text{2. Serum Lactate } > 2\\text{ mmol/L } (18\\text{ mg/dL})\\text{ despite fluid resuscitation}} \\\\
\\hline
\\end{array}$$

---

## 2. Surviving Sepsis Campaign (SSC) Hour-1 Resuscitation Bundle

$$\\begin{array}{lcccc}
\\hline
\\textbf{Bundle Element} & \\textbf{Target Timing} & \\textbf{Clinical Protocol \u0026 Dosing Guidelines} \\\\
\\hline
\\textbf{1. Serum Lactate} & \\text{Within 60 min} & \\text{Measure baseline lactate; remeasure within 2-4 hours if initial lactate } > 2\\text{ mmol/L} \\\\
\\textbf{2. Blood Cultures} & \\text{Prior to abx} & \\text{Obtain 2 sets of blood cultures (aerobic + anaerobic) before antimicrobials (do not delay abx } > 45\\text{ min)} \\\\
\\textbf{3. Broad-Spectrum Antibiotics} & \\text{Within 60 min} & \\mathbf{\\text{Administer IV empiric broad-spectrum antimicrobials within 1 hour of recognition}} \\\\
\\textbf{4. Fluid Resuscitation} & \\text{Within 3 hours} & \\mathbf{\\text{Administer } 30\\text{ mL/kg IV balanced crystalloid (Lactated Ringer's/Plasmalyte) for SBP } < 90\\text{ or lactate } \\ge 4} \\\\
\\textbf{5. Vasopressor Support} & \\text{During/after fluid} & \\mathbf{\\text{Start NOREPINEPHRINE first-line to maintain MAP } \\ge 65\\text{ mmHg; add Vasopressin (0.03 U/min)}} \\\\
\\hline
\\end{array}$$

- **Refractory Septic Shock Escalation Hierarchy**:
  - **First-Line**: **Norepinephrine** (potent $\\alpha_1 > \\beta_1$ vasoconstrictor, titrate to $\\text{MAP} \\ge 65\\text{ mmHg}$).
  - **Second-Line (Adjunct)**: **Vasopressin $0.03\\text{ units/min}$ fixed dose** (restores vascular tone by activating $V_1$ receptors in catecholamine-resistant shock; spares norepinephrine dose).
  - **Third-Line (Inotrope)**: **Epinephrine** (if cardiac output/contractility remains depressed) or **Dobutamine**.
  - **Corticosteroids**: IV **Hydrocortisone $200\\text{ mg/day}$** (continuous or $50\\text{ mg}$ q6h) for refractory septic shock requiring escalating vasopressor doses.
`,
  clinicalVignettes: [
    {
      scenario: "A 71-year-old female is transferred to the emergency resuscitation bay with severe lethargy, productive cough with purulent sputum, and fever. Vital signs reveal: BP 78/42 mmHg (MAP 54 mmHg), HR 126 bpm, RR 28 breaths/min, SpO2 89% on room air, and Temp 39.4°C. Point-of-care arterial blood gas demonstrates a serum lactate of 5.2 mmol/L. She weighs 70 kg. Her lungs demonstrate right lower lobe bronchial breath sounds and crackles.",
      question: "According to the Surviving Sepsis Campaign Hour-1 Bundle, what is the most appropriate initial resuscitation protocol?",
      options: [
        "Obtain 2 sets of blood cultures, initiate broad-spectrum IV antibiotics (e.g. Vancomycin + Cefepime) within 1 hour, rapidly infuse 2,100 mL of IV balanced crystalloid (30 mL/kg), and start IV Norepinephrine infusion if MAP remains <65 mmHg during or after fluid loading",
        "Administer 500 mL normal saline slowly over 6 hours and wait for blood culture results before starting antibiotics",
        "Start high-dose oral prednisone and discharge home on oral amoxicillin",
        "Place the patient on fluid restriction and administer IV furosemide"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient meets criteria for Severe Sepsis / Septic Shock (hypotension, hyperlactatemia 5.2 mmol/L, acute respiratory failure): (1) Hour-1 Bundle Execution: Immediately obtain 2 sets of blood cultures, administer empiric broad-spectrum IV antibiotics within 1 hour, and begin rapid crystalloid resuscitation; (2) Fluid Dosing: 30 mL/kg of balanced crystalloid (70 kg x 30 mL/kg = 2,100 mL); (3) Vasopressor Target: If MAP remains <65 mmHg during or after fluid loading, initiate IV Norepinephrine immediately to maintain organ perfusion."
    }
  ]
};
