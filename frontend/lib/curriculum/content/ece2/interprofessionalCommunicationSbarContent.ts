/**
 * Early Clinical Exposure II: Interprofessional Communication, SBAR Handover & Team Dynamics
 * Authoritative team training content derived from TeamSTEPPS, AHRQ, Joint Commission.
 * Mapped to NMC CBME Competencies: ECE2.2, FC2.2, AETCOM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INTERPROFESSIONAL_COMMUNICATION_SBAR_MODULE: PhysiologyLessonModule = {
  id: "ece2-interprofessional-communication-sbar",
  unitCode: "ECE2.2",
  title: "Interprofessional Communication & Team Dynamics: SBAR Handover, TeamSTEPPS, CUS Mnemonic & Two-Challenge Rule",
  competencies: ["ECE2.2", "FC2.2", "AETCOM2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Interprofessional Communication, Clinical Handovers & Team Dynamics

Standardized communication frameworks eliminate ambiguity, bridge hierarchical gradients, and protect clinical transitions of care from informational loss.

---

## 1. The SBAR Structured Handover Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{Component} & \\textbf{Domain / Focus} & \\textbf{Key Informational Elements} & \\textbf{Clinical Exemplar Statement} \\\\
\\hline
\\mathbf{S} & \\textbf{SITUATION} & \\text{State your name, unit, patient name, bed number,} & \\text{\"This is Nurse Patel in 4 West. I am calling about Mr. Miller} \\\\
& & \\text{and the immediate urgent reason for the call} & \\text{in 412 who has developed acute respiratory distress.\"} \\\\
\\mathbf{B} & \\textbf{BACKGROUND} & \\text{Admission diagnosis, date of surgery, pertinent history,} & \\text{\"He is POD-2 after right total hip arthroplasty. He has a history} \\\\
& & \\text{baseline vitals, and current medication/IV lines} & \\text{of DVT and has been on Enoxaparin 40 mg daily.\"} \\\\
\\mathbf{A} & \\textbf{ASSESSMENT} & \\text{Current physiological vitals, clinical changes,} & \\mathbf{\\text{\"His RR is 32, SpO}_2\\text{ dropped from 98\\% to 86\\% on room air,}} \\\\
& & \\text{physical findings, and your clinical interpretation} & \\mathbf{\\text{HR is 124, BP 90/60. I suspect an acute Pulmonary Embolism.\"} } \\\\
\\mathbf{R} & \\textbf{RECOMMENDATION} & \\text{Specific, actionable request, time urgency,} & \\mathbf{\\text{\"I need you to evaluate him at the bedside immediately,}} \\\\
& & \\text{and repeat-back confirmation} & \\mathbf{\\text{order a stat CT angiogram, and start high-flow oxygen.\"} } \\\\
\\hline
\\end{array}$$

---

## 2. TeamSTEPPS Safety Culture \u0026 Assertiveness Tools

$$\\begin{array}{lcccc}
\\hline
\\textbf{Communication Tool} & \\textbf{Mechanism / Trigger} & \\textbf{Assertiveness Script / Phrase} & \\textbf{Patient Safety Objective} \\\\
\\hline
\\textbf{CUS Mnemonic} & \\mathbf{\\text{Graduated escalation of concern}} & \\mathbf{\\text{\"I am CONCERNED... I am UNCOMFORTABLE...}} & \\mathbf{\\text{Overcomes steep authority gradients;}} \\\\
& \\text{for any critical safety hazard} & \\mathbf{\\text{this is a SAFETY issue / STOP THE LINE!\"}} & \\mathbf{\\text{halts harmful actions immediately}} \\\\
\\textbf{Two-Challenge Rule} & \\text{When an initial safety concern is ignored,} & \\text{Voice the concern a second time with clarity;} & \\text{Mandates response from team leader;} \\\\
& \\text{team member MUST re-assert concern} & \\text{if unaddressed, escalate to chain of command} & \\text{prevents silent compliance with error} \\\\
\\textbf{Closed-Loop} & \\text{Sender gives order } \\rightarrow \\text{ Receiver repeats} & \\text{Sender: \"Give Epinephrine 1 mg IV stat.\"} & \\text{Eliminates misunderstandings in} \\\\
\\textbf{Communication} & \\text{back } \\rightarrow \\text{ Sender verifies accuracy} & \\text{Receiver: \"Giving Epinephrine 1 mg IV now.\"} & \\text{high-stress resuscitations} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "During an emergency laparoscopic cholecystectomy for acute gangrenous cholecystitis, the attending surgeon prepares to clip and transect a tubular structure in the hepatocystic triangle, believing it to be the cystic duct. The scrub nurse and surgical resident observe that the structure is pulsating and runs directly behind the common hepatic duct, strongly suggesting it is the main right hepatic artery. When the resident mentions, 'Dr. Smith, the anatomy looks a bit unusual,' the surgeon dismisses the comment and continues applying the clip applier.",
      question: "According to TeamSTEPPS and patient safety principles, what is the most appropriate next action by the surgical resident?",
      options: [
        "Apply the Two-Challenge Rule using the CUS mnemonic: voice a clear, assertive second challenge ('Dr. Smith, I am CONCERNED and UNCOMFORTABLE proceeding because that structure appears to be the right hepatic artery; this is a critical SAFETY issue, please pause and let us perform an intraoperative cholangiogram before clipping')",
        "Remain silent because the attending surgeon has greater clinical experience and legal responsibility",
        "Step away from the sterile field and report the incident to the hospital risk manager after the surgery is completed",
        "Physically grab the clip applier out of the attending surgeon's hands"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario illustrates the life-saving necessity of the TeamSTEPPS Two-Challenge Rule and the CUS framework: (1) Two-Challenge Rule: When an initial safety concern is dismissed or unacknowledged by a team leader, all healthcare professionals have an ethical and operational obligation to voice their concern a second time with heightened clarity and assertiveness; (2) CUS Language: Utilizing standardized, unambiguous trigger words ('I am Concerned, I am Uncomfortable, this is a Safety issue') signals an immediate operational halt to re-evaluate the risk; (3) Harm Prevention: Transecting the right hepatic artery or common bile duct causes devastating patient morbidity; assertiveness across hierarchical authority gradients is vital for surgical safety."
    }
  ]
};
