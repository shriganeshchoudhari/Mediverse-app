/**
 * Foundation Course & Early Clinical Exposure: Doctor-Patient Communication, Empathy & History-Taking Models
 * Authoritative clinical communication content derived from Bates' Guide (13th ed.), Calgary-Cambridge Guide.
 * Mapped to NMC CBME Competencies: FC1.1, FC1.2, ECE1.1, AETCOM1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DOCTOR_PATIENT_COMMUNICATION_SPIKES_MODULE: PhysiologyLessonModule = {
  id: "foundation-doctor-patient-communication-spikes",
  unitCode: "FC1.1",
  title: "Doctor-Patient Communication & History-Taking: Calgary-Cambridge Model, SPIKES Protocol & Empathy (NURSE)",
  competencies: ["FC1.1", "FC1.2", "ECE1.1", "AETCOM1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Doctor-Patient Communication, Clinical Empathy & The SPIKES Protocol

Effective clinical communication forms the foundation of therapeutic rapport, diagnostic accuracy, treatment compliance, and shared decision-making.

---

## 1. Calgary-Cambridge Medical Interview Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{Interview Phase} & \\textbf{Primary Clinical Goal} & \\textbf{Key Verbal \u0026 Non-Verbal Skills} & \\textbf{High-Yield Technique} \\\\
\\hline
\\textbf{1. Initiating the Session} & \\text{Establish initial rapport \u0026 agenda} & \\text{Greet by name, introduce role, open body language} & \\mathbf{\\text{Open-ended opening: \"What would you like to discuss?\"}} \\\\
\\textbf{2. Gathering Information} & \\text{Elicit biomedical \u0026 patient perspective} & \\text{Open-to-closed cone questioning, active listening} & \\mathbf{\\text{ICE Exploration: Ideas, Concerns, Expectations}} \\\\
\\textbf{3. Building Relationship} & \\text{Develop trust \u0026 therapeutic alliance} & \\text{Empathetic validation, active silence, reflection} & \\mathbf{\\text{NURSE Mnemonic: Name, Understand, Respect, Support, Explore}} \\\\
\\textbf{4. Explanation \u0026 Planning} & \\text{Provide information \u0026 shared plan} & \\text{Avoid medical jargon, chunk information} & \\mathbf{\\text{\"Chunk and Check\": Check understanding before moving on}} \\\\
\\textbf{5. Closing the Session} & \\text{Summarize plan \u0026 safety netting} & \\text{Clarify next steps, provide contingency plans} & \\mathbf{\\text{Teach-Back Method: \"In your own words, what is our plan?\"}} \\\\
\\hline
\\end{array}$$

---

## 2. Breaking Bad News: The SPIKES 6-Step Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step} & \\textbf{Protocol Domain} & \\textbf{Clinical Objective} & \\textbf{Practical Exemplar Statement} \\\\
\\hline
\\mathbf{S} & \\textbf{SETTING} & \\text{Ensure privacy, sit at eye level, silence pager} & \\text{\"Let's step into this private room where we won't be interrupted.\"} \\\\
\\mathbf{P} & \\textbf{PERCEPTION} & \\text{Assess what the patient already knows / suspects} & \\mathbf{\\text{\"What is your understanding of why we did the biopsy?\"}} \\\\
\\mathbf{I} & \\textbf{INVITATION} & \\text{Ascertain how much detail the patient wants} & \\mathbf{\\text{\"Would you like me to go over all the detailed test results today?\"}} \\\\
\\mathbf{K} & \\textbf{KNOWLEDGE} & \\text{Deliver warning shot, then clear concise news} & \\mathbf{\\text{\"Unfortunately, the biopsy results showed cancer.\" (Avoid euphemisms)}} \\\\
\\mathbf{E} & \\textbf{EMPATHY} & \\text{Acknowledge emotional response with NURSE} & \\mathbf{\\text{\"I can see how upsetting this news is; we are going to support you.\"}} \\\\
\\mathbf{S} & \\textbf{STRATEGY / SUMMARY} & \\text{Formulate concrete actionable treatment roadmap} & \\mathbf{\\text{\"Here is our step-by-step plan: we have scheduled oncology tomorrow.\"}} \\\\
\\hline
\\end{array}$$

- **The NURSE Mnemonic for Empathetic Communication**:
  - **N (Name)**: State the emotion observed (*\"It sounds like you are feeling overwhelmed.\"*).
  - **U (Understand)**: Validate their reaction (*\"It is completely understandable that you feel frightened.\"*).
  - **R (Respect)**: Acknowledge their resilience (*\"You have shown tremendous strength managing this pain.\"*).
  - **S (Support)**: State ongoing commitment (*\"Our entire multidisciplinary team will walk with you through this.\"*).
  - **E (Explore)**: Invite deeper discussion (*\"Tell me more about what worries you most about the treatment.\"*).
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with a history of smoking presents to the outpatient clinic for the results of a CT-guided lung biopsy performed for a persistent solitary pulmonary nodule. The pathology report confirms invasive adenocarcinoma. The physician brings the patient and his wife into a private consultation room, sits down at eye level, silences his hospital pager, and begins by asking: 'Before we review the biopsy findings, what was your understanding of what the radiologist saw on your CT scan?' After the patient answers that he was told there was a suspicious shadow, the physician provides a warning shot: 'I am afraid I have some difficult news to share,' followed by clear disclosure: 'The biopsy showed lung cancer.' The patient immediately bursts into tears and covers his face.",
      question: "According to the SPIKES protocol for breaking bad news, what is the most appropriate next response by the physician?",
      options: [
        "Acknowledge and validate the patient's emotional response with empathetic silence and a supportive verbal statement (e.g., 'I can see how distressing and shocking this news is to hear; take all the time you need, and we are going to go through this together')",
        "Immediately provide detailed statistical survival curves and chemotherapy regimens to distract the patient",
        "Reassure the patient that 'everything will be fine' to alleviate his distress",
        "Leave the room immediately to give the patient privacy"
      ],
      correctAnswerIndex: 0,
      explanation: "In the SPIKES protocol for breaking bad news, Step 5 (E - Empathy/Emotion) requires the physician to address the patient's emotional response before attempting to provide further medical explanations or treatment plans: (1) Key Principle: When a patient is overwhelmed by acute emotional distress, cognitive processing of complex information ceases; moving directly to treatment details or statistical prognosis will be unhelpful and perceived as cold or dismissive; (2) Best Practice: Allow a period of empathetic silence, offer tissues, and utilize the NURSE mnemonic (Naming the emotion and Supporting the patient); (3) Avoid: False reassurance ('everything will be fine') or premature abandonment of the encounter."
    }
  ]
};
