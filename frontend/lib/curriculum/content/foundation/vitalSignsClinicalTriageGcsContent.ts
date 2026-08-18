/**
 * Foundation Course & Early Clinical Exposure: Vital Signs, Clinical Triage & Basic Life Assessment
 * Authoritative clinical skills & triage content derived from Bates' Guide (13th ed.), Hutchison's.
 * Mapped to NMC CBME Competencies: FC7.1, FC7.2, ECE2.2, AETCOM1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VITAL_SIGNS_CLINICAL_TRIAGE_GCS_MODULE: PhysiologyLessonModule = {
  id: "foundation-vital-signs-clinical-triage-gcs",
  unitCode: "FC7.1",
  title: "Vital Signs & Clinical Triage: Blood Pressure Physics (Korotkoff), Orthostatics, Glasgow Coma Scale (GCS 3-15) & NEWS2",
  competencies: ["FC7.1", "FC7.2", "ECE2.2", "AETCOM1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Vital Signs Standardization, Physiological Triage & Glasgow Coma Scale

Accurate measurement of physiological vital signs, orthostatic reflex testing, neurological coma scoring, and early warning systems identify life-threatening deterioration.

---

## 1. Blood Pressure Measurement Standards \u0026 Orthostatics

$$\\begin{array}{lcccc}
\\hline
\\textbf{Parameter / Phenomenon} & \\textbf{Standardized Protocol} & \\textbf{Physiological Mechanism} & \\textbf{Clinical Threshold / Diagnostic Rule} \\\\
\\hline
\\textbf{Cuff Bladder Sizing} & \\mathbf{\\text{Bladder width } \\ge 40\\%\\text{ arm circumference,}} & \\text{Ensures uniform arterial compression} & \\mathbf{\\text{Too small cuff } \\rightarrow \\text{ FALSELY HIGH BP;}} \\\\
& \\mathbf{\\text{length } \\ge 80\\%\\text{ arm circumference}} & & \\mathbf{\\text{too large cuff } \\rightarrow \\text{ falsely low BP}} \\\\
\\textbf{Korotkoff Sounds} & \\mathbf{\\text{Phase I (clear tapping) } = \\text{ Systolic}} & \\text{Turbulent blood jet through partially} & \\text{Deflate cuff at } 2-3\\text{ mmHg/second;} \\\\
& \\mathbf{\\text{Phase V (disappearance) } = \\text{ Diastolic}} & \\text{occluded brachial artery} & \\text{Phase IV muffling used in hyperdynamic states} \\\\
\\textbf{Orthostatic Hypotension} & \\text{Measure BP/pulse supine after } 5\\text{ min,} & \\text{Failure of baroreceptor sympathetic reflex} & \\mathbf{\\text{Drop in Systolic } \\ge 20\\text{ mmHg OR}} \\\\
(\\textbf{Postural Vitals}) & \\text{then standing at } 1\\text{ and } 3\\text{ minutes} & (\\alpha_1\\text{ vasoconstriction, } \\beta_1\\text{ tachycardia}) & \\mathbf{\\text{Diastolic } \\ge 10\\text{ mmHg within } 3\\text{ min}} \\\\
\\hline
\\end{array}$$

---

## 2. Glasgow Coma Scale (GCS) Scoring Architecture

$$\\begin{array}{lcccc}
\\hline
\\textbf{Behavioral Response} & \\textbf{Score} & \\textbf{Specific Clinical Observation / Assessment} & \\textbf{Coma Severity Classification} \\\\
\\hline
\\textbf{Eye Opening (E)} & \\mathbf{4} & \\text{Spontaneous eye opening with normal blink} & \\mathbf{\\text{MILD (GCS 13 - 15)}} \\\\
& \\mathbf{3} & \\text{Opens eyes to verbal command / speech} & \\text{Concussion, minor head injury} \\\\
& \\mathbf{2} & \\text{Opens eyes to painful stimulus (trapezius pinch)} & \\\\
& \\mathbf{1} & \\text{No eye opening to any stimulus} & \\mathbf{\\text{MODERATE (GCS 9 - 12)}} \\\\
\\textbf{Verbal Response (V)} & \\mathbf{5} & \\text{Oriented to person, place, and time} & \\text{Lethargic, confused, requires close monitoring} \\\\
& \\mathbf{4} & \\text{Confused conversation, answers questions} & \\\\
& \\mathbf{3} & \\text{Inappropriate words (random exclamations)} & \\mathbf{\\text{SEVERE (GCS } \\le 8\\text{)}} \\\\
& \\mathbf{2} & \\text{Incomprehensible sounds (moaning/groaning)} & \\mathbf{\\text{\"GCS } \\le 8\\text{, INTUBATE\": Immediate}} \\\\
& \\mathbf{1} & \\text{No verbal response} & \\mathbf{\\text{airway protection required}} \\\\
\\textbf{Motor Response (M)} & \\mathbf{6} & \\text{Obeys multi-step motor commands} & \\\\
& \\mathbf{5} & \\text{Localizes painful stimulus (crosses midline)} & \\\\
& \\mathbf{4} & \\text{Normal flexion / withdrawal to pain} & \\\\
& \\mathbf{3} & \\mathbf{\\text{Abnormal flexion (Decorticate posturing - rubrospinal)}} & \\\\
& \\mathbf{2} & \\mathbf{\\text{Extension to pain (Decerebrate posturing - vestibulospinal)}} & \\\\
& \\mathbf{1} & \\text{No motor response (flaccid)} & \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old male is brought to the emergency trauma bay following a high-speed motorcycle collision. On primary survey, he does not open his eyes spontaneously or to verbal commands, but opens his eyes when a firm nailbed pressure stimulus is applied. When asked what happened, he produces only incomprehensible moans and groans. In response to a painful central trapezius squeeze, his arms exhibit rigid extension at the elbows, internal rotation of the shoulders, and pronation of the wrists (decerebrate posturing).",
      question: "What is this patient's exact Glasgow Coma Scale (GCS) score, what severity category does it represent, and what is the mandatory immediate airway intervention?",
      options: [
        "GCS = 5 (Eye: 2, Verbal: 2, Motor: 2); Severe Head Injury (GCS <= 8); requires immediate endotracheal intubation for definitive airway protection and neuroprotective ventilation",
        "GCS = 7 (Eye: 2, Verbal: 2, Motor: 3); Moderate Head Injury; observe on non-rebreather mask",
        "GCS = 4 (Eye: 1, Verbal: 2, Motor: 1); Severe Head Injury; administer IV Mannitol only",
        "GCS = 9 (Eye: 3, Verbal: 3, Motor: 3); Moderate Head Injury; obtain urgent non-contrast head CT"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient's Glasgow Coma Scale (GCS) is calculated as follows: (1) Eye Opening = 2 (opens eyes to painful stimulus only); (2) Verbal Response = 2 (incomprehensible sounds / moaning only); (3) Motor Response = 2 (abnormal extensor / decerebrate posturing to pain); (4) Total GCS Score = 2 + 2 + 2 = 5 (out of 15); (5) Clinical Management: A GCS score <= 8 defines a Severe Traumatic Brain Injury / coma where the patient loses upper airway protective reflexes (cough, gag), establishing a mandatory indication for immediate rapid sequence intubation (RSI) to prevent aspiration and maintain neuroprotective normocapnia (PaCO2 35-40 mmHg)."
    }
  ]
};
