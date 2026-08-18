/**
 * The SPIKES Protocol for Delivering Bad News & NURSE Empathy Framework
 * Authoritative medical content derived from Baile & Buckman, GMC, and USMLE Step 2/3 Communication.
 * Mapped to NMC AETCOM Competency Modules: 2.1, 2.2, 3.1, 3.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPIKES_BREAKING_BAD_NEWS_MODULE: PhysiologyLessonModule = {
  id: "aetcom-spikes-breaking-bad-news",
  unitCode: "AET2.1",
  title: "AETCOM: The SPIKES Protocol for Delivering Bad News & NURSE Empathy Framework",
  competencies: ["AET2.1", "AET2.2", "AET2.3", "AET2.4"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# AETCOM: The SPIKES Protocol for Delivering Bad News & NURSE Empathy Framework

Delivering difficult, life-altering medical news requires a compassionate, structured communication protocol to reduce psychological trauma and build trust.

---

## 1. The 6-Step SPIKES Protocol (Baile & Buckman)

| Step | Core Objective | Key Communication Skills & Exemplar Verbatim Phrases |
| :--- | :--- | :--- |
| **S: Setting & Setup** | Create a private, comfortable, distraction-free environment. | • Ensure physical privacy (close door, draw curtains); sit down at eye level with no desk barrier.<br>• Silence pagers and phones.<br>• Ask: *"Would you like anyone else, such as family or a friend, to be with us while we talk?"* |
| **P: Perception** | Assess what the patient already knows, understands, or suspects (**"Ask before you tell"**). | • *"What is your understanding of why we did the CT scan and biopsy?"*<br>• *"What have the other doctors told you about your test results so far?"* |
| **I: Invitation** | Ascertain how much detailed information the patient wishes to receive (**"Ask how they want to know"**). | • *"Would you like me to go over all the specific medical details of the results today, or would you prefer a broad overview and outline of next steps?"*<br>• Respect patients who decline details and delegate discussion to family. |
| **K: Knowledge & Information** | Deliver the diagnosis with clarity, honesty, and simplicity. | • **Fire a Warning Shot**: *"Unfortunately, I have some difficult news to share..."*<br>• Use clear, non-jargon language (use *"cancer"* or *"tumor"* rather than *"poorly differentiated adenocarcinoma"*).<br>• Give information in small, digestible chunks; pause frequently to check comprehension. |
| **E: Empathy & Emotion Management** | Acknowledge, validate, and support the patient\'s emotional reactions (**The NURSE Framework**). | • Respond directly to tears, shock, or anger before discussing medical details.<br>• Offer supportive touch or tissues; maintain compassionate silence. |
| **S: Strategy & Summary** | Formulate a collaborative treatment plan and establish clear next steps. | • Summarize key points and formulate a step-by-step roadmap for therapy.<br>• Check comprehension via **Teach-Back**: *"To make sure I explained everything clearly, what will you tell your family about our plan?"*<br>• Provide direct contact info and schedule specific follow-up. |

---

## 2. The NURSE Framework for Expressing Clinical Empathy

- **N: Name the emotion**:
  - *"I can see that this diagnosis is deeply shocking and upsetting to you."*
- **U: Understand / Validate**:
  - *"It is completely natural and understandable to feel overwhelmed after hearing this news."*
- **R: Respect / Praise**:
  - *"You have shown tremendous courage and resilience through these difficult weeks of testing."*
- **S: Support**:
  - *"Our entire multidisciplinary oncology team is going to be with you every single step of the way."*
- **E: Explore**:
  - *"Can you tell me more about what is worrying you the most about the treatment?"*

---

## 3. Handling Family Requests to Withhold the Truth ("Collusion / Non-Disclosure")

- **Scenario**: Family members intercept the physician before entering the room and demand: *"Do not tell my mother she has cancer, it will destroy her hope and kill her!"*
- **Ethical & Communication Protocol**:
  1. **Acknowledge and Explore Family Concerns**:
     - *"I understand how deeply you love your mother and how worried you are about protecting her from distress. Can you tell me what you fear will happen if she knows?"*
  2. **Explain the Physician\'s Ethical & Legal Duty**:
     - Explain that ethical practice and patient autonomy require truth-telling, and that patients often know they are ill and experience heightened anxiety when kept in the dark.
  3. **Offer an Ethical Compromise via Patient Invitation**:
     - Enter the room with the family and ask the patient directly how much information they wish to receive:
       - *"Mrs. Sharma, before we review the biopsy results, I want to ask how you prefer to receive medical information. Would you like me to discuss the full details with you, or would you prefer me to discuss the specifics primarily with your son?"*
     - If the patient requests full disclosure $\implies$ disclose the diagnosis with compassion.
     - If the patient requests non-disclosure $\implies$ honor the patient\'s autonomy.
`,
  clinicalVignettes: [
    {
      scenario: "A 55-year-old female undergoes a core needle biopsy of a suspicious breast mass. The pathology confirms invasive ductal carcinoma. The physician brings the patient into a private consultation room, silences his pager, and sits down facing her. He begins the consultation by asking: 'Mrs. Davis, can you tell me what your understanding was of why we performed the breast biopsy last week?' After she explains, he asks: 'Before we review the pathology report, how would you like me to share the findings—would you like all the specific details, or a general summary?'",
      question: "Which steps of the SPIKES protocol for delivering bad news were demonstrated by these two opening questions?",
      options: [
        "Perception (Step 2) and Invitation (Step 3)",
        "Setting (Step 1) and Knowledge (Step 4)",
        "Empathy (Step 5) and Strategy (Step 6)",
        "Warning Shot (Step 4) and Summary (Step 6)"
      ],
      correctAnswerIndex: 0,
      explanation: "The physician demonstrated Step 2 (Perception: asking the patient what she already understands about the clinical situation before disclosing results) followed immediately by Step 3 (Invitation: asking the patient how much detail she wishes to receive). These initial steps ensure that information is tailored to the patient's cognitive baseline and personal preferences."
    }
  ]
};
