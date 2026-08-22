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

| RASS Score | Clinical State | Patient Response / Clinical Target |
| :--- | :--- | :--- |
| **+4** | Combative | Overtly combative, violent, immediate danger to staff |
| **+3** | Very Agitated | Pulls on tubes, aggressive behavior |
| **+2** | Agitated | Frequent non-purposeful movement, fights ventilator |
| **+1** | Restless | Anxious, apprehensive, movements not aggressive |
| **0** | **Alert and Calm** | **Normal Spontaneous Baseline Target** |
| **-1** | **Drowsy** | **Sustained awakening (>10s) with eye contact to voice (LIGHT SEDATION TARGET)** |
| **-2** | Light Sedation | Brief awakening (<10s) with eye contact to voice |
| **-3** | Moderate Sedation | Movement or eye opening to voice, NO eye contact |
| **-4** | Deep Sedation | No response to voice, physical stimulation required |
| **-5** | Unarousable | No response to voice or physical stimulation |

- **Sedative Agent Selection**:
  - **Dexmedetomidine**: Selective $\\alpha_2$-adrenergic agonist providing cooperative, conscious sedation without respiratory depression; reduces ICU delirium and shortens time to extubation.
  - **Propofol**: $\\text{GABA}_A$ receptor agonist with rapid onset/offset; monitor for Propofol Infusion Syndrome (PRIS: refractory bradycardia, metabolic acidosis, rhabdomyolysis, renal failure with infusions $>4-5\\text{ mg/kg/h}$).
  - **Avoid Benzodiazepines (Midazolam/Lorazepam)**: Independent, dose-dependent risk factor for transition to delirium.

---

## 2. Confusion Assessment Method for the ICU (CAM-ICU)

| CAM-ICU Feature | Assessment Method | Positive Criterion |
| :--- | :--- | :--- |
| **Feature 1: Acute Onset / Fluctuating** | Baseline mental status change in last 24h | **Yes (Fluctuating score)** |
| **Feature 2: Inattention** | Squeeze hand on letter 'A' in 'SAVEAHAART' | **$> 2$ Errors (Score $< 8/10$)** |
| **Feature 3: Altered Level of Consciousness** | Current RASS score | **Current RASS $\\ne 0$** |
| **Feature 4: Disorganized Thinking** | 4 simple questions & 2-step command test | **$> 1$ Error** |

- **Diagnosis of Delirium**: Requires **Feature 1 + Feature 2** PLUS either **Feature 3 OR Feature 4**.

---

## 3. The ABCDEF ICU Liberation Bundle

- **A — Assess, Prevent, and Manage Pain**: Routine CPOT (Critical-Care Pain Observation Tool) scoring; multimodal analgesia (Acetaminophen, Ketamine, regional blocks) before sedation.
- **B — Both SAT and SBT**: Daily Spontaneous Awakening Trials (SAT) paired immediately with Spontaneous Breathing Trials (SBT).
- **C — Choice of Analgesia and Sedation**: Target light sedation (RASS -1 to 0); prioritize Dexmedetomidine or Propofol; eliminate scheduled benzodiazepines.
- **D — Delirium Assessment, Prevention, and Management**: Twice-daily CAM-ICU screening; non-pharmacological sleep hygiene, day/night light cycles, early glasses/hearing aids.
- **E — Early Mobility and Exercise**: Physical and occupational therapy initiated within 48h of intubation.
- **F — Family Engagement and Empowerment**: Unrestricted family visitation and active participation in multidisciplinary rounds.
`,
  clinicalVignettes: [
    {
      scenario: "A 71-year-old female is on post-operative day 3 following emergent bowel resection for strangulated hernia. She is mechanically ventilated on low-dose Propofol (15 mcg/kg/min). The morning sedation hold is performed (SAT passed). When assessing with CAM-ICU: Nurse notes baseline mental status fluctuates over the morning shift. On the attention screening test (letter 'A' in 'SAVEAHAART'), the patient misses 4 targets (Score 6/10). Her current RASS is +1 (restless, picking at IV lines).",
      question: "What is the CAM-ICU diagnostic interpretation and what is the optimal initial management strategy?",
      options: [
        "CAM-ICU Positive (Delirium present: Feature 1 + Feature 2 + Feature 3 present); Re-orient the patient, review all medications to discontinue anticholinergic/deliriogenic drugs, optimize day/night light cycles, ensure adequate analgesia, and avoid initiating high-dose benzodiazepines or haloperidol without acute distress",
        "CAM-ICU Negative; Increase Propofol to achieve deep sedation (RASS -4)",
        "CAM-ICU Indeterminate; Order emergency stat head CT scan before taking any action",
        "Normal post-operative emergence; Administer IV Midazolam 5 mg bolus to calm patient"
      ],
      correctAnswerIndex: 0,
      explanation: "The patient meets diagnostic criteria for CAM-ICU Positive (Delirium): Feature 1 (Acute onset/fluctuation) is positive, Feature 2 (Inattention with >2 errors on SAVEAHAART) is positive, and Feature 3 (Altered consciousness with RASS +1 != 0) is positive. Delirium is confirmed. The primary management is non-pharmacological: re-orientation, sleep-wake cycle preservation, pain management, early mobilization, and removal of deliriogenic agents (anticholinergics, benzodiazepines). Antipsychotics do not treat the underlying delirium or shorten ICU stay and should be reserved only for severe distress or patient/staff safety."
    }
  ]
};
