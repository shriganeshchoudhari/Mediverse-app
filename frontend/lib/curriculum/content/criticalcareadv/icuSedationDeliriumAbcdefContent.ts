/**
 * Critical Care: ICU Sedation, Analgesia, Delirium & The ABCDEF Bundle
 * Authoritative medical content derived from PADIS Guidelines, SCCM Critical Care Medicine.
 * Mapped to NMC CBME Competencies: CC1.7, CC1.8, AN23.4, MD36.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ICU_SEDATION_DELIRIUM_ABCDEF_MODULE: PhysiologyLessonModule = {
  id: "critical-care-adv-sedation-delirium-abcdef",
  unitCode: "CC7.1",
  title: "ICU Sedation (PADIS Guidelines), CAM-ICU Delirium Scoring & The ABCDEF Liberation Bundle",
  competencies: ["CC1.7", "CC1.8", "AN23.4", "MD36.4"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# ICU Sedation, Analgesia, Delirium & Ventilator Liberation

Current critical care paradigms prioritize an **analgesia-first, light-sedation strategy** with active delirium screening to accelerate ventilator liberation and reduce long-term post-intensive care syndrome (PICS).

---

## 1. Richmond Agitation-Sedation Scale (RASS) & PADIS Guidelines

$$\\begin{array}{lcl}
\\hline
\\textbf{RASS Score} & \\textbf{Clinical State} & \\textbf{Patient Response / Clinical Target} \\\\
\\hline
+4 & \\text{Combative} & \\text{Overtly combative, violent, immediate danger to staff} \\\\
+3 & \\text{Very Agitated} & \\text{Pulls on tubes, aggressive behavior} \\\\
+2 & \\text{Agitated} & \\text{Frequent non-purposeful movement, fights ventilator} \\\\
+1 & \\text{Restless} & \\text{Anxious, apprehensive, movements not aggressive} \\\\
\\mathbf{0} & \\mathbf{\\text{Alert and Calm}} & \\mathbf{\\text{Normal Spontaneous Baseline Target}} \\\\
\\mathbf{-1} & \\mathbf{\\text{Drowsy}} & \\mathbf{\\text{Sustained awakening (>10s) with eye contact to voice (LIGHT SEDATION TARGET)}} \\\\
-2 & \\text{Light Sedation} & \\text{Brief awakening (<10s) with eye contact to voice} \\\\
-3 & \\text{Moderate Sedation} & \\text{Movement or eye opening to voice, NO eye contact} \\\\
-4 & \\text{Deep Sedation} & \\text{No response to voice, physical stimulation required} \\\\
-5 & \\text{Unarousable} & \\text{No response to voice or physical stimulation} \\\\
\\hline
\\end{array}$$

- **Sedative Agent Selection**:
  - **Dexmedetomidine**: Selective $\\alpha_2$-adrenergic agonist providing cooperative, conscious sedation without respiratory depression; reduces ICU delirium and shortens time to extubation.
  - **Propofol**: $\\text{GABA}_A$ receptor agonist with rapid onset/offset; monitor for Propofol Infusion Syndrome (PRIS: refractory bradycardia, metabolic acidosis, rhabdomyolysis, renal failure with infusions $>4-5\\text{ mg/kg/h}$).
  - **Avoid Benzodiazepines (Midazolam/Lorazepam)**: Independent, dose-dependent risk factor for transition to delirium.

---

## 2. Confusion Assessment Method for the ICU (CAM-ICU)

$$\\begin{array}{lcc}
\\hline
\\textbf{CAM-ICU Feature} & \\textbf{Assessment Method} & \\textbf{Positive Criterion} \\\\
\\hline
\\textbf{Feature 1: Acute Onset / Fluctuating} & \\text{Baseline mental status change in last 24h} & \\text{Yes (Fluctuating score)} \\\\
\\textbf{Feature 2: Inattention} & \\text{Squeeze hand on letter 'A' in 'SAVEAHAART'} & \\mathbf{> 2\\text{ Errors (Score } < 8/10\\text{)}} \\\\
\\textbf{Feature 3: Altered Level of Consciousness} & \\text{Current RASS score} & \\mathbf{\\text{Current RASS } \\ne 0} \\\\
\\textbf{Feature 4: Disorganized Thinking} & 4\\text{ simple questions \u0026 command test} & > 1\\text{ Error} \\\\
\\hline
\\end{array}$$

$$\\mathbf{\\text{CAM-ICU Positive (Delirium)}} = \\mathbf{\\text{Feature 1 AND Feature 2 AND (Feature 3 OR Feature 4)}}$$

---

## 3. The ABCDEF ICU Liberation Bundle

- **A (Assess, Prevent, and Manage Pain)**: CPOT/BPS pain scales; IV opioids before sedatives.
- **B (Both SAT and SBT)**: Daily Spontaneous Awakening Trial (turn off sedatives) paired with Spontaneous Breathing Trial (T-piece or PSV).
- **C (Choice of Analgesia and Sedation)**: Target RASS $0$ to $-1$; use non-benzodiazepines (Dexmedetomidine / Propofol).
- **D (Delirium: Assess, Prevent, and Manage)**: Routine CAM-ICU screening; reorient patient, maintain day/night light cycles.
- **E (Early Mobility and Exercise)**: Progressive mobilization (dangling, standing, ambulation while intubated).
- **F (Family Engagement and Empowerment)**: Flexible ICU visiting hours, family presence during rounds.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male is mechanically ventilated on Day 4 of admission for severe acute pancreatitis. He is receiving a continuous Midazolam infusion (4 mg/h) and Fentanyl infusion (100 mcg/h). On assessment, he opens his eyes briefly when loudly called, but does not maintain eye contact (RASS -3). When the nurse stops the midazolam infusion as part of a Spontaneous Awakening Trial (SAT), the patient becomes awake (RASS +1), but when given the letter sequence 'S-A-V-E-A-H-A-A-R-T', he squeezes the nurse's hand on 4 incorrect letters (6/10 correct, Inattention positive). He also nods 'yes' when asked if a leaf floats on water, but nods 'yes' when asked if an elephant can fly.",
      question: "What is this patient's neurological status based on the CAM-ICU tool, and what is the most evidence-based management strategy?",
      options: [
        "CAM-ICU Positive (Hyperactive/Mixed ICU Delirium); Discontinue Midazolam, transition to an analgesia-first protocol with Dexmedetomidine if sedation is needed, and implement the ABCDEF bundle (early mobility, sleep hygiene, reorientation)",
        "CAM-ICU Negative; Double the dose of Midazolam to achieve deep sedation (RASS -4)",
        "Normal neurological recovery; Administer intravenous Haloperidol 10 mg every 4 hours routinely",
        "Acute ischemic stroke; Immediately administer IV recombinant tissue plasminogen activator (tPA)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is CAM-ICU positive for ICU Delirium: (1) Acute onset/fluctuating course (Feature 1 positive), (2) Inattention on the SaveAHAART test with >2 errors (Feature 2 positive), (3) Altered consciousness with RASS +1 (Feature 3 positive), and (4) Disorganized thinking (Feature 4 positive). According to SCCM PADIS guidelines, benzodiazepines (Midazolam) are a major independent driver of ICU delirium and should be discontinued. The evidence-based approach is to adopt an analgesia-first protocol, transition to a non-benzodiazepine sedative such as Dexmedetomidine if light sedation is required, avoid routine prophylactic antipsychotics, and systematically implement the ABCDEF ICU liberation bundle."
    }
  ]
};
