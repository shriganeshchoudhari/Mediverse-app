/**
 * Internship Core Clinical Postings: Quality Improvement, Patient Safety & Clinical Audits
 * Authoritative patient safety content derived from IHI Open School, WHO Patient Safety Curriculum, Joint Commission SBAR Standards.
 * Mapped to NMC CBME Competencies: IN8.4, ET3.2, ET4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const QUALITY_IMPROVEMENT_PATIENT_SAFETY_SBAR_MODULE: PhysiologyLessonModule = {
  id: "int8-quality-improvement-patient-safety-sbar",
  unitCode: "IN8.4",
  title: "Quality Improvement & Patient Safety: Root Cause Analysis (Ishikawa 6Ms & 5 Whys), PDSA Cycles & SBAR Handover",
  competencies: ["IN8.4", "ET3.2", "ET4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Quality Improvement, Patient Safety & SBAR Communication

Systems-based safety architectures, root-cause investigations, rapid-cycle testing, and standardized handovers eliminate preventable clinical harm.

---

## 1. Root Cause Analysis (RCA): Ishikawa Fishbone & 5 Whys

$$\\begin{array}{lcccc}
\\hline
\\textbf{Ishikawa 6M Category} & \\textbf{Systemic Safety Domain} & \\textbf{Prototypical Hospital Safety Defect} \\\\
\\hline
\\textbf{1. Manpower (Personnel)} & \\text{Staffing levels, fatigue, training, competence} & \\text{Unsupervised fatigued junior doctor on 36-hour shift} \\\\
\\textbf{2. Methods (Processes)} & \\text{Clinical protocols, checklists, handovers} & \\text{Absence of double-check protocol for high-risk IV heparin} \\\\
\\textbf{3. Machines (Equipment)} & \\text{Infusion pumps, monitors, ventilators} & \\text{Different smart pump models lacking dose error reduction systems} \\\\
\\textbf{4. Materials (Supplies)} & \\text{Medications, blood products, disposables} & \\text{Look-alike, sound-alike (LASA) medication packaging} \\\\
\\textbf{5. Measurements (Data)} & \\text{Lab reports, vitals alerts, telemetry} & \\text{Delayed critical lab panic value reporting (>2h delay)} \\\\
\\textbf{6. Milieu (Environment)} & \\text{Noise, lighting, interruptions, culture} & \\text{High ambient noise and frequent interruptions in medication prep} \\\\
\\hline
\\textbf{The 5 Whys Technique} & \\mathbf{\\text{Iterative interrogative method}} & \\mathbf{\\text{Drills down from active sharp-end error to latent latent defect}} \\\\
\\hline
\\end{array}$$

---

## 2. Plan-Do-Study-Act (PDSA) Quality Improvement Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{PDSA Phase} & \\textbf{Specific Implementation Goal} & \\textbf{Key Performance Deliverable} \\\\
\\hline
\\textbf{Plan} & \\text{Formulate SMART aim statement and intervention design} & \\text{Design standardized Central Line-Associated Bloodstream} \\\\
& & \\text{Infection (CLABSI) chlorhexidine insertion bundle} \\\\
\\textbf{Do} & \\text{Execute small-scale pilot on a single clinical unit} & \\text{Test bundle in single 12-bed ICU for 4 weeks} \\\\
\\textbf{Study} & \\text{Analyze pre- vs post-intervention run chart data} & \\text{Measure checklist compliance (rose from 42\\% to 94\\%)} \\\\
\\textbf{Act} & \\text{Standardize system-wide or iterate based on findings} & \\text{Scale bundle hospital-wide with mandatory e-learning} \\\\
\\hline
\\end{array}$$

---

## 3. SBAR Structured Clinical Handover Framework

- **S - Situation**: Identify self, patient, location, and the immediate acute clinical problem (e.g., *"This is Dr. Rao from Ward 4 calling about Mr. Jones in Bed 12 who is acutely hypotensive with BP 78/40 mmHg"*).
- **B - Background**: Brief admission diagnosis, operative date, allergies, and pertinent baseline status (e.g., *"He is Day 2 post exploratory laparotomy for perforated appendicitis with baseline normal renal function"*).
- **A - Assessment**: Clinical impression, current trajectory, and severity (e.g., *"I believe he is developing septic shock secondary to intra-abdominal collection, with lactate 4.2 mmol/L"*).
- **R - Recommendation**: Specific, actionable, timed request (e.g., *"I need you to evaluate the patient bedside within 15 minutes, and authorize starting Norepinephrine via central line"*).
`,
  clinicalVignettes: [
    {
      scenario: "During a night shift on an acute surgical ward, an intern receives a handoff for an unstable patient who recently underwent Whipple resection. At 02:30, the patient becomes tachycardic (HR 130 bpm), tachypneic (RR 28/min), and hypotensive (BP 82/48 mmHg) with decreasing urine output (10 mL/hr for 2 consecutive hours). The intern calls the on-call surgical registrar to escalate care using the SBAR structured communication framework.",
      question: "Which statement exemplifies the most accurate and actionable SBAR handover in this emergency?",
      options: [
        "Situation: 'Dr. Smith, this is Dr. Patel on Ward 3 calling about Mr. Kumar in Bed 8 who is in septic shock with BP 82/48 and HR 130.' Background: 'He is Day 3 post-Whipple with new purulent drain output.' Assessment: 'I assess septic shock secondary to pancreatic anastomotic leak with oliguria.' Recommendation: 'I have started a 30 mL/kg fluid bolus and drawn blood cultures; I need you to evaluate him at bedside immediately and authorize ICU transfer and urgent CT angiography.'",
        "Situation: 'The patient in bed 8 is not doing well.' Background: 'He had surgery.' Assessment: 'He looks sick.' Recommendation: 'Check him when you wake up in the morning.'",
        "Situation: 'We need more nurses.' Background: 'Ward 3 is crowded.' Assessment: 'Everyone is busy.' Recommendation: 'Order some laboratory tests.'",
        "Situation: 'Blood pressure is low.' Background: 'Unknown.' Assessment: 'Maybe dehydration.' Recommendation: 'Give oral water.'"
      ],
      correctAnswerIndex: 0,
      explanation: "This case exemplifies the Joint Commission and WHO gold-standard SBAR communication format: (1) Situation: Immediate identification of speaker, patient, location, and vital sign instability; (2) Background: Concise pertinent clinical context (Day 3 post-Whipple with purulent drain output); (3) Assessment: Clear diagnostic hypothesis (septic shock from anastomotic leak); (4) Recommendation: Specific, actionable, and time-sensitive request (bedside evaluation, ICU transfer, CT angiography) alongside initiated resuscitative measures."
    }
  ]
};
