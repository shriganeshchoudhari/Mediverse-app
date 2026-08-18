/**
 * OSCE Simulation Stations: SPIKES Breaking Bad News & Obstetric Leopold Maneuvers / Partograph
 * Authoritative medical content derived from Baile & Buckman SPIKES, Williams Obstetrics (26th ed.), and USMLE Step 2 CS / Step 3 OSCE.
 * Mapped to NMC CBME Competencies: OS7.1, OS7.2, OS8.1, OS8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OSCE_COMMUNICATION_ETHICS_OBGYN_STATIONS_MODULE: PhysiologyLessonModule = {
  id: "osce-communication-ethics-obgyn-stations",
  unitCode: "OS7.1",
  title: "OSCE Station: SPIKES Breaking Bad News & Obstetric Leopold Maneuvers with Partograph",
  competencies: ["OS7.1", "OS7.2", "OS8.1", "OS8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# OSCE Station: SPIKES Breaking Bad News & Obstetric Leopold Maneuvers with Partograph

Empathetic communication during difficult clinical disclosures combined with tactile obstetrical palpation and intrapartum labor monitoring form high-stakes clinical competencies.

---

## 1. OSCE Station 7: The SPIKES 6-Step Protocol for Breaking Bad News

| Step | Objective & Key Actions | Examiner Scoring Rubric & Example Phrasing |
| :--- | :--- | :--- |
| **S: Setting up the Interview** | • Arrange a quiet, private room with no interruptions.<br>• Sit down at eye level with patient; avoid physical barriers (desks).<br>• Invite significant family members / support persons.<br>• Have tissues available; silence pager and phone. | *"Good morning Mrs. Patel. Please come in and take a seat with your husband. I have ensured our pagers are held so we can talk without interruptions."* |
| **P: Assessing Perception** | • Ask open-ended questions to determine what the patient already knows or suspects regarding their illness. | *"Before we look at the biopsy results, could you tell me your understanding of why we did the CT scan and what the doctors have discussed with you so far?"* |
| **I: Obtaining Invitation** | • Ask how much detail the patient desires (some prefer broad overview, others want detailed statistical data). | *"Would you like me to give you the full details and step-by-step numbers today, or would you prefer a broad overview of what we found and our next steps?"* |
| **K: Giving Knowledge ("Warning Shot")** | • **Deliver a Warning Shot** before disclosing bad news.<br>• Use clear, direct, non-technical language (say *"cancer"* or *"mass"*, not *"neoplasm"* or *"mitotic lesion"*).<br>• Deliver in short digestible chunks; **PAUSE frequently to allow processing**. | *"Unfortunately, I have some difficult news to share with you... The biopsy results show that the lung mass is a cancerous tumor."* *(PAUSE and maintain silence)*. |
| **E: Addressing Emotions (NURSE Framework)** | • Observe and validate emotional responses using **NURSE**:<br>  - **N (Name)**: *"I can see how upsetting this is."*<br>  - **U (Understand)**: *"Anyone in your position would feel shocked."*<br>  - **R (Respect)**: *"You have been incredibly strong through this."*<br>  - **S (Support)**: *"We will be with you every step of this journey."*<br>  - **E (Explore)**: *"Tell me what is concerning you most right now."* | Acknowledge tears, offer tissues, use appropriate silence, and validate grief without offering false premature reassurance (*never say "Everything will be fine"*). |
| **S: Strategy & Summary** | • Outline clear, actionable next steps (oncology referral, staging PET-CT).<br>• Conduct a **Teach-Back check** to verify understanding.<br>• Provide written summary and schedule close follow-up. | *"To make sure we are on the same page, could you summarize what we discussed today and what our plan is for next Tuesday?"* |

---

## 2. OSCE Station 8: Obstetric Leopold Maneuvers & The WHO Partograph

### The 4 Leopold Maneuvers (Performed at $\ge 28 - 32\\text{ Weeks}$)
- **Patient Position**: Supine with knees slightly flexed, abdomen exposed from xiphisternum to pubic symphysis; examiner stands on right side facing patient (for maneuvers 1–3) and facing feet (for maneuver 4).
1. **First Maneuver (Fundal Grip)**:
   - Palpate fundus with both hands.
   - *Breech* felt as soft, irregular, non-ballottable mass $\\implies$ Cephalic presentation.
   - *Head* felt as smooth, hard, round, ballottable mass $\\implies$ Breech presentation.
2. **Second Maneuver (Lateral / Umbilical Grip)**:
   - Place hands on either side of abdomen. One hand supports while the other palpates.
   - *Fetal Back* felt as smooth, continuous, firm convex resistance.
   - *Fetal Limbs / Extremities* felt as small, knobby, irregular moving nodules.
   - *Auscultate Fetal Heart Rate (FHR)*: Over the anterior shoulder on the side of the fetal back!
3. **Third Maneuver (Pawlik\'s Grip / First Pelvic Grip)**:
   - Grasp lower maternal abdomen just above pubic symphysis between thumb and fingers of dominant hand.
   - Determines presenting part and whether it is **engaged or freely mobile (ballottable)**.
4. **Fourth Maneuver (Deep Pelvic Grip)**:
   - Turn to face the patient\'s feet. Slide fingers downward along sides of uterus toward pelvic inlet.
   - Determines **degree of fetal head flexion** (prominence of cephalic sinciput vs occiput) and descent into true pelvis.

### The Modified WHO Partograph in Active Labor
- **Active Labor Definition**: Cervical dilation $\ge 4\\text{ cm}$ with regular uterine contractions.
- **Alert Line**: Straight line drawn from $4\\text{ cm}$ to $10\\text{ cm}$ assuming normal progression rate of **$1\\text{ cm/hour}$**.
- **Action Line**: Parallel line drawn **$4\\text{ hours}$ to the right of the Alert Line**.
- **Clinical Rules**:
  - Normal Labor: Dilation plot remains **ON or to the LEFT of the Alert Line**.
  - Prolonged Active Phase / Protracted Labor: Dilation plot crosses to the **RIGHT of the Alert Line** $\\implies$ Augmentation (hydration, amniotomy / ARM, oxytocin).
  - **Obstructed Labor**: Dilation plot reaches or crosses the **ACTION LINE** $\\implies$ Urgent decision for Emergency Cesarean Delivery!
`,
  clinicalVignettes: [
    {
      scenario: "During an obstetric OSCE station, a primigravida at 39 weeks gestation is admitted in active labor. Cervical dilation at 08:00 is 4 cm (plotted on the Alert line of the modified WHO partograph). On repeat cervical examination at 12:00 (4 hours later), cervical dilation is 5 cm (progression rate 0.25 cm/hour, crossing to the right of the Alert line). At 16:00 (another 4 hours later), cervical dilation remains 5 cm with severe fetal caput succedaneum and 3+ moulding, crossing the Action line. Fetal heart rate shows recurrent late decelerations.",
      question: "Which of the following is the diagnosis and mandatory clinical action dictated by the partograph?",
      options: [
        "Obstructed Labor / Secondary Arrest of Dilation crossing the Action Line; Prepare for Immediate Emergency Cesarean Section",
        "Normal active labor progression; Reassure patient and recheck in 4 hours",
        "Precipitous labor; Administer intravenous Tocolytics",
        "False labor; Discharge home with oral analgesics"
      ],
      correctAnswerIndex: 0,
      explanation: "On the modified WHO partograph, cervical dilation reaching or crossing the Action Line (4 hours to the right of the Alert line) represents Secondary Arrest of Dilation and Obstructed Labor / Cephalopelvic Disproportion (further confirmed by severe moulding, caput succedaneum, and non-reassuring late decelerations). The Action Line mandates an immediate definitive intervention: Emergency Cesarean Section."
    }
  ]
};
