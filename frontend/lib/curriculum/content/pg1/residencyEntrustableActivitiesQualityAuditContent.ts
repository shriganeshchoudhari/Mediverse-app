/**
 * Postgraduate Core Clinical Foundations & Residency Readiness: Residency EPAs, M&M Audits & Crisis Resource Management
 * Authoritative graduate medical education content derived from ACGME Core Competencies, Reason's Swiss Cheese Model, Crisis Resource Management (CRM).
 * Mapped to NMC PG CBME Competencies: PG1.4, ACGME SBP & PBLI Milestones.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RESIDENCY_ENTRUSTABLE_ACTIVITIES_QUALITY_AUDIT_MODULE: PhysiologyLessonModule = {
  id: "pg1-residency-entrustable-activities-quality-audit",
  unitCode: "PG1.4",
  title: "Residency Core Competencies: ACGME Milestones, Systems-Based M&M Audits, Cognitive Heuristics & Crisis Resource Management",
  competencies: ["PG1.4", "ET4.1", "ET4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Residency Core Competencies, M&M Audits & Crisis Management

Mastering postgraduate entrustable milestones, deconstructing adverse outcomes through cognitive and systemic audits, and commanding resuscitation teams optimize patient safety.

---

## 1. ACGME 6 Core Competencies & Residency Milestones

$$\\begin{array}{lcccc}
\\hline
\\textbf{Core Competency Domain} & \\textbf{Postgraduate Operational Definition} & \\textbf{Target Level 5 Fellowship / Attending Milestone} \\\\
\\hline
\\textbf{1. Patient Care (PC)} & \\text{Compassionate, appropriate, effective patient care} & \\mathbf{\\text{Autonomously manages complex undifferentiated shock}} \\\\
\\textbf{2. Medical Knowledge (MK)} & \\text{Established and evolving biomedical/clinical sciences} & \\text{Critical appraisal and application of cutting-edge trials} \\\\
\\textbf{3. Practice-Based Learning (PBLI)} & \\text{Investigation and self-evaluation of patient care} & \\mathbf{\\text{Leads quality improvement audits and PDSA cycles}} \\\\
\\textbf{4. Interpersonal Skills (ICS)} & \\text{Effective information exchange with patients/teams} & \\text{Navigates high-stakes conflict and surrogate grief} \\\\
\\textbf{5. Professionalism (PROF)} & \\text{Commitment to ethical principles, altruism, diversity} & \\text{Serves as an exemplary role model for junior residents} \\\\
\\textbf{6. Systems-Based Practice (SBP)} & \\text{Awareness of and responsiveness to broader healthcare} & \\mathbf{\\text{Deconstructs hospital latent defects via Swiss Cheese models}} \\\\
\\hline
\\end{array}$$

---

## 2. Morbidity & Mortality (M&M) Cognitive Heuristics & Swiss Cheese Model

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cognitive Biases in M&M} & \\textbf{Heuristic Mechanism} & \\textbf{Clinical Mitigation Strategy} \\\\
\\hline
\\textbf{Anchoring Bias} & \\text{Fixating on an initial diagnostic impression} & \\text{Mandatory \"diagnostic time-out\" to generate} \\\\
& \\text{despite conflicting incoming clinical data} & \\text{alternative differential diagnoses} \\\\
\\textbf{Premature Closure} & \\text{Accepting a diagnosis before it is fully verified} & \\text{Systematic review of unaddressed vital abnormalities} \\\\
\\textbf{Availability Heuristic} & \\text{Judging diagnosis as likely due to recent vivid recall} & \\text{Evidence-based pre-test probability calculators} \\\\
\\hline
\\textbf{Reason's Swiss Cheese Model} & \\mathbf{\\text{Adverse events occur when latent systemic holes align}} & \\mathbf{\\text{Blameless systems analysis replacing human-fault blame}} \\\\
\\hline
\\end{array}$$

---

## 3. Resuscitation Crisis Resource Management (CRM)

- **Closed-Loop Communication**:
  - Sender gives clear, named instruction $\rightarrow$ Receiver verbally confirms and repeats instruction $\rightarrow$ Receiver confirms completion (e.g., *"Dr. Lee, administer 1 mg Epinephrine IV now"* $\rightarrow$ *"Administering 1 mg Epinephrine IV"* $\rightarrow$ *"1 mg Epinephrine IV given at 14:02"*).
- **Situational Awareness & Sterile Cockpit**:
  - The team leader stands at the foot of the bed without performing manual procedures, maintaining global situational awareness and eliminating non-essential ambient chatter during high-acuity interventions.
`,
  clinicalVignettes: [
    {
      scenario: "During a departmental Morbidity and Mortality (M&M) conference, a case of an in-hospital cardiac arrest following an emergency central line insertion is reviewed. The junior resident anchored on a diagnosis of acute pulmonary embolism when the patient became hypotensive, overlooking a progressive unilateral loss of breath sounds and distended neck veins following internal jugular cannulation, leading to a fatal delayed decompression of a tension pneumothorax. The audit panel analyzes the cognitive and systemic contributors.",
      question: "Which cognitive heuristic and systemic safety principle should be highlighted in this M&M review?",
      options: [
        "Anchoring bias (fixating on the initial diagnosis of pulmonary embolism and ignoring contradictory findings of absent breath sounds) and Premature closure; the systemic analysis should apply Reason's Swiss Cheese model to identify latent gaps (e.g. lack of post-procedure ultrasound lung sliding protocols and unstandardized supervision during lines) rather than focusing exclusively on individual human blame",
        "Hindsight bias only; fire the junior resident immediately",
        "Confirmation bias only; ban all central venous lines hospital-wide",
        "No systemic gap occurred; it was an unavoidable complication"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates modern postgraduate M&M and patient safety principles: (1) Cognitive Heuristics: Anchoring bias caused the clinician to fixate on pulmonary embolism despite physical signs of tension pneumothorax; (2) Swiss Cheese Model: James Reason's framework proves that catastrophic medical adverse events occur when multiple latent organizational holes (fatigue, lack of point-of-care lung ultrasound checklist, inadequate supervision) align simultaneously; (3) Systems-Based Learning: High-reliability organizations focus on institutional safeguards (mandatory post-procedure lung ultrasound) rather than retributive human blame."
    }
  ]
};
