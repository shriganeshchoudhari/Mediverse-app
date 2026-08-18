/**
 * Internship Core Clinical Postings: Entrustable Professional Activities (EPAs) & Clinical Portfolio
 * Authoritative medical education content derived from AAMC Core EPAs, NMC Competency-Based Medical Education Guidelines.
 * Mapped to NMC CBME Competencies: IN8.2, ET3.1, ET4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ENTRUSTABLE_PROFESSIONAL_ACTIVITIES_PORTFOLIO_MODULE: PhysiologyLessonModule = {
  id: "int8-entrustable-professional-activities-portfolio",
  unitCode: "IN8.2",
  title: "Entrustable Professional Activities: The 13 Core EPAs, Chen's 5-Level Entrustment Scale & Clinical Logbook Portfolio",
  competencies: ["IN8.2", "ET3.1", "ET4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Entrustable Professional Activities (EPAs) & Clinical Portfolio

Workplace-based assessments (WBA), longitudinal e-portfolios, and entrustment decision scales certify readiness for independent clinical practice.

---

## 1. The 13 Core Entrustable Professional Activities (EPAs)

$$\\begin{array}{lcccc}
\\hline
\\textbf{EPA Number} & \\textbf{Core Entrustable Professional Activity} & \\textbf{Target Exit Graduation Milestone} \\\\
\\hline
\\textbf{EPA 1} & \\text{Gather a history and perform a comprehensive physical examination} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 2} & \\text{Prioritize a differential diagnosis following a clinical encounter} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 3} & \\text{Recommend and interpret common diagnostic and screening tests} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 4} & \\text{Enter and discuss orders and prescriptions (medication safety)} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 5} & \\text{Document a clinical encounter in the health record} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 6} & \\text{Provide an oral presentation of a clinical encounter} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 7} & \\text{Formulate clinical questions and retrieve evidence (EBM)} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 8} & \\text{Give or receive a patient handover to transition care (SBAR)} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 9} & \\text{Collaborate as a member of an interprofessional healthcare team} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 10} & \\mathbf{\\text{Recognize patients requiring urgent/emergent care and initiate management}} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 11} & \\text{Obtain informed consent for tests and bedside procedures} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 12} & \\mathbf{\\text{Perform general procedural skills of a physician (IV, LP, Foley, ABG)}} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\textbf{EPA 13} & \\text{Identify system failures and contribute to quality improvement (QI)} & \\mathbf{\\text{Level 4 (Independent Practice)}} \\\\
\\hline
\\end{array}$$

---

## 2. Chen's 5-Level Entrustment Decision Scale

$$\\begin{array}{lcccc}
\\hline
\\textbf{Entrustment Level} & \\textbf{Supervisory Requirement} & \\textbf{Clinical Autonomy Definition} \\\\
\\hline
\\textbf{Level 1} & \\text{Direct Observation Only} & \\text{Trainee observes; not permitted to execute clinical actions} \\\\
\\textbf{Level 2} & \\text{Direct Supervision} & \\text{Supervisor is in the room observing trainee perform action} \\\\
\\textbf{Level 3} & \\text{Indirect Supervision} & \\text{Supervisor is immediately available in hospital to assist} \\\\
\\textbf{Level 4} & \\mathbf{\\text{Independent Practice}} & \\mathbf{\\text{Trainee executes independently; distant oversight (GRADUATION TARGET)}} \\\\
\\textbf{Level 5} & \\text{Supervising Others} & \\text{Trainee is entrusted to supervise and teach junior trainees} \\\\
\\hline
\\end{array}$$

---

## 3. Workplace-Based Assessment (WBA) Modalities

- **Mini-CEX (Clinical Evaluation Exercise)**: Real-time 15-minute observed patient encounter evaluated across history, physical exam, and counseling.
- **DOPS (Direct Observation of Procedural Skills)**: 15-minute structured evaluation of procedural technique, asepsis, and patient comfort.
- **CbD (Case-based Discussion)**: In-depth retrospective review of clinical reasoning, record keeping, and ethical decision-making.
`,
  clinicalVignettes: [
    {
      scenario: "During an end-of-posting Clinical Competency Committee (CCC) review, an intern's performance across 12 months of rotational postings is evaluated. The intern has logged 45 Mini-CEX encounters, 30 DOPS assessments (including successful independent arterial blood gas sampling, lumbar puncture, and central venous catheterization), and participated in hospital morbidity and mortality audits. The faculty review assesses whether the intern meets the graduation milestone for EPA 10 (Recognize and initiate emergent care) and EPA 12 (Perform general procedural skills).",
      question: "What level on Chen's Entrustment Scale is required for medical graduation and licensure, and what does it signify?",
      options: [
        "Level 4 (Entrustment for Independent Practice with distant oversight); it signifies that the trainee is deemed capable of executing clinical decision-making, procedural skills, and emergency triage without requiring direct or indirect in-room supervision, qualifying them for full medical registration and unsupervised primary medical practice",
        "Level 1 (Observation only); the intern must observe senior faculty for another 5 years",
        "Level 2 (Direct supervision); the intern must always have a professor in the room for every patient",
        "Level 5 (National program director); the intern must immediately direct all clinical residency programs"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights Competency-Based Medical Education (CBME) entrustment standards: (1) Target Milestone: Chen's Level 4 ('Entrustment for unsupervised, independent practice') is the explicit benchmark required for completion of compulsory rotating internship and medical council registration; (2) Definition: Level 4 entrustment confirms that the intern possesses adequate clinical competence, self-awareness, and safety consciousness to provide autonomous patient care with distant oversight; (3) WBA Triangulation: Mini-CEX, DOPS, and CbD provide objective validity evidence supporting Level 4 entrustment decisions."
    }
  ]
};
