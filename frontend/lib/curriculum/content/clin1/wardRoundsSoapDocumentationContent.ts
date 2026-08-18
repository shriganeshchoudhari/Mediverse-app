/**
 * Clinical Postings I: Inpatient Ward Rounds, Presentation Architecture & SOAP Documentation
 * Authoritative inpatient clinical medicine content derived from Bates, Hutchison, Harrison.
 * Mapped to NMC CBME Competencies: CP1.1, IM1.1, SU1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const WARD_ROUNDS_SOAP_DOCUMENTATION_MODULE: PhysiologyLessonModule = {
  id: "clin1-ward-rounds-soap-documentation",
  unitCode: "CP1.1",
  title: "Inpatient Ward Rounds & SOAP Documentation: Case Presentation Architecture, Daily Progress Notes & Medication Reconciliation",
  competencies: ["CP1.1", "IM1.1", "SU1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Inpatient Ward Rounds, Clinical Presentation Architecture & SOAP Documentation

Effective inpatient care relies on structured oral bedside case presentations, problem-based SOAP documentation, and rigorous discharge medication reconciliation.

---

## 1. Morning Inpatient Case Presentation Architecture

$$\\begin{array}{lcccc}
\\hline
\\textbf{Presentation Section} & \\textbf{Clinical Focus} & \\textbf{Key Data Elements} & \\textbf{Standard Clinical Script} \\\\
\\hline
\\textbf{1. One-Liner Summary} & \\text{Patient identification \u0026 context} & \\text{Name, age, hospital day (HD), admission diagnosis} & \\text{\"This is Mr. Jones, a 64-yo male, HD #3 for acute COPD exacerbation.\"} \\\\
\\textbf{2. Overnight Events} & \\text{Subjective symptoms \u0026 PRN meds} & \\text{Pain, dyspnea, fever spikes, telemetry runs, sleep quality} & \\text{\"Overnight he remained stable, required one albuterol PRN at 03:00.\"} \\\\
\\textbf{3. Objective Vitals \u0026 I/Os} & \\text{24-hour ranges \u0026 fluid balance} & \\mathbf{\\text{Tmax, BP range, HR range, RR, SpO}_2\\text{, strict I/Os, net balance}} & \\mathbf{\\text{\"Tmax 37.8}^{\\circ}\\text{C, BP 128/78, HR 82, RR 18, SpO}_2\\text{ 93\\% on 2L NC. I/O: 1800/2200 (-400 mL).\"}} \\\\
\\textbf{4. Focused Exam} & \\text{Targeted physical findings} & \\text{Lungs (wheezes/rales), heart (murmurs/JVP), abdomen, edema} & \\text{\"Lungs with mild end-expiratory wheezes bilaterally, no peripheral edema.\"} \\\\
\\textbf{5. Lab \u0026 Imaging Trends} & \\text{Diagnostics with comparison} & \\text{BMP (electrolytes, Cr), CBC, cultures, serial ECGs, CXR} & \\text{\"BMP stable: K 4.1, Cr 0.9 (down from 1.3). Sputum culture pending.\"} \\\\
\\textbf{6. Problem-Based Plan} & \\text{Synthesis by organ system / problem} & \\mathbf{\\text{Active problem list, therapy changes, lines, DVT/GI prophylaxis}} & \\mathbf{\\text{\"1. COPD: Continue oral Prednisone, wean oxygen; 2. Prophylaxis: Enoxaparin.\"}} \\\\
\\hline
\\end{array}$$

---

## 2. The SOAP Daily Progress Note Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{SOAP Section} & \\textbf{Clinical Purpose} & \\textbf{Mandatory Inpatient Components} \\\\
\\hline
\\mathbf{S} \\textbf{ (Subjective)} & \\text{Patient-reported clinical trajectory} & \\text{Symptoms over past 24h, functional status (appetite, ambulation, flatus, bowel movements, voiding)} \\\\
\\mathbf{O} \\textbf{ (Objective)} & \\text{Measurable clinical parameters} & \\mathbf{\\text{24h vitals, strict I/Os, weight trend, physical exam, BMP/CBC, imaging, microbiology, telemetry}} \\\\
\\mathbf{A} \\textbf{ (Assessment)} & \\text{Clinical synthesis \u0026 trajectory} & \\text{1-2 sentence overall trajectory (improving/stable/worsening), differential updates, clinical reasoning} \\\\
\\mathbf{P} \\textbf{ (Plan)} & \\text{Actionable orders by problem} & \\mathbf{\\text{Problem list (#1 Primary diagnosis, #2 Comorbidities, #3 Prophylaxis [DVT/GI], #4 Lines, #5 Disposition)}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "During morning internal medicine ward rounds, a 3rd-year medical student presents a 72-year-old female admitted for acute decompensated heart failure with reduced ejection fraction (HFrEF, EF 25%). The student presents a lengthy 15-minute narrative detailing the patient's entire outpatient medical history dating back 20 years, without mentioning the patient's overnight net fluid balance, current weight compared to admission, or morning serum creatinine and potassium levels before discussing the plan.",
      question: "According to standard inpatient ward round presentation principles, what is the most critical structural deficiency in this bedside presentation?",
      options: [
        "Failure to prioritize actionable overnight objective hemodynamic data: a focused inpatient presentation must synthesize 24-hour vital ranges, strict fluid intake/output (I/Os), daily weight trend, and key electrolyte/creatinine changes before articulating the problem-based plan",
        "Failure to read the entire nursing charting verbatim from the electronic health record",
        "Presenting while standing at the patient's bedside rather than sitting in the conference room",
        "Listing the patient's age and admission diagnosis in the opening sentence"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario illustrates the core tenets of effective Inpatient Case Presentations: (1) Focused Relevance: Inpatient morning rounds require a structured, concise (~3-5 minute) presentation focusing on overnight clinical trajectory, 24-hour vital ranges, strict I/Os and weight trends (essential for titrating diuretic therapy in heart failure), and critical lab values (potassium, renal function); (2) Problem-Based Synthesis: The presentation must culminate in a prioritized, problem-based Assessment and Plan that addresses active pathophysiological issues, medication titration, line/catheter necessity, and discharge barriers."
    }
  ]
};
