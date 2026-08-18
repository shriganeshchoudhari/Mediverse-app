/**
 * Internship Core Clinical Postings: Trauma Primary & Secondary Surveys (ATLS ABCDE & FAST Exam)
 * Authoritative trauma resuscitation content derived from ACS ATLS 10th ed., Tintinalli, EAST Guidelines.
 * Mapped to NMC CBME Competencies: IN1.3, EM1.3, SU1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMA_ATLS_FAST_EXAM_MODULE: PhysiologyLessonModule = {
  id: "int1-trauma-atls-fast-exam",
  unitCode: "IN1.3",
  title: "Trauma Resuscitation: ATLS ABCDE Primary Survey, Massive Transfusion Protocol (1:1:1), TXA & FAST Ultrasound",
  competencies: ["IN1.3", "EM1.3", "SU1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Advanced Trauma Life Support (ATLS ABCDE), Massive Transfusion & FAST Ultrasound

Systematic primary survey execution identifies and treats immediately life-threatening trauma injuries within minutes of arrival.

---

## 1. ATLS Primary Survey Algorithm (ABCDE)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Survey Domain} & \\textbf{Life Threats Identified} & \\textbf{Immediate Resuscitation Interventions} \\\\
\\hline
\\textbf{A - Airway \u0026 C-Spine} & \\text{Airway obstruction, facial crush, expanding neck hematoma} & \\mathbf{\\text{Manual in-line cervical stabilization; suction; endotracheal intubation if GCS } \\le 8} \\\\
\\textbf{B - Breathing \u0026 Chest} & \\mathbf{\\text{Tension pneumothorax, open pneumothorax, massive hemothorax}} & \\mathbf{\\text{Stat needle decompression (2nd ICS MCL / 5th ICS AAL) followed by chest tube; occlusive dressing}} \\\\
\\textbf{C - Circulation \u0026 Bleeding} & \\mathbf{\\text{Exsanguinating hemorrhage, pelvic ring disruption}} & \\mathbf{\\text{Direct wound pressure; pelvic binder; 2 large-bore (16G) IVs; Balanced MTP 1:1:1; TXA 1 g within 3h}} \\\\
\\textbf{D - Disability (Neuro)} & \\text{Intracranial mass effect, uncal herniation, spinal injury} & \\text{Assess Glasgow Coma Scale (GCS), pupil size/reactivity; administer hypertonic saline/mannitol} \\\\
\\textbf{E - Exposure \u0026 Temp} & \\mathbf{\\text{Occult injuries, lethal triad (hypothermia, acidosis, coagulopathy)}} & \\mathbf{\\text{Undress completely; apply warm blankets, warmed IV fluids; prevent core temperature drop}} \\\\
\\hline
\\end{array}$$

---

## 2. Focused Assessment with Sonography for Trauma (FAST / E-FAST)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Acoustic Window} & \\textbf{Anatomical Location} & \\textbf{Physiological Sign / Fluid Detection} \\\\
\\hline
\\textbf{1. Hepatorenal (Morison's Pouch)} & \\text{Right mid-axillary line, 8-11th intercostal space} & \\mathbf{\\text{Most sensitive dependent space in supine patient; anechoic (black) stripe = hemoperitoneum}} \\\\
\\textbf{2. Splenorenal Recess} & \\text{Left posterior-axillary line, 8-10th intercostal space} & \\text{Anechoic fluid between spleen and left kidney or subdiaphragmatic space} \\\\
\\textbf{3. Suprapubic (Pelvic Window)} & \\text{Transverse/sagittal superior to pubic symphysis} & \\text{Free fluid in rectovesical pouch (males) or pouch of Douglas (females)} \\\\
\\textbf{4. Subxiphoid Cardiac} & \\text{Inferior to xiphoid process angled toward left shoulder} & \\mathbf{\\text{Anechoic fluid around myocardium confirming Cardiac Tamponade}} \\\\
\\textbf{5. Thoracic E-FAST (Pleura)} & \\text{Anterior 2nd-4th intercostal spaces mid-clavicular} & \\mathbf{\\text{Absence of lung sliding \u0026 presence of barcode/stratosphere sign confirms Pneumothorax}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male is brought to the trauma resuscitation bay following a high-speed motorcycle collision. He is pale, diaphoretic, and confused (GCS 12). Vital signs reveal: BP 76/40 mmHg, HR 138 bpm, RR 26 breaths/min. A pelvic binder is applied for an unstable pelvic fracture. A focused bedside ultrasound (FAST exam) reveals an anechoic (black) fluid stripe in Morison's pouch (hepatorenal recess) and free fluid in the pelvis.",
      question: "According to ATLS and damage-control resuscitation guidelines, what is the most appropriate next step in hemodynamic management?",
      options: [
        "Activate the Massive Transfusion Protocol (MTP) with 1:1:1 balanced ratio of Packed Red Blood Cells (PRBCs), Fresh Frozen Plasma (FFP), and Platelets, administer Tranexamic Acid (TXA) 1 g IV over 10 minutes (given within 3 hours of trauma), and arrange immediate transfer to the Operating Room / Interventional Radiology",
        "Infuse 4 liters of normal saline rapidly and withhold blood products until type and screen is complete in 45 minutes",
        "Perform a whole-body non-contrast CT scan before initiating any fluid resuscitation",
        "Administer high-dose dopamine infusion monotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This unstable trauma patient has Class IV hemorrhagic shock and positive FAST (free intraperitoneal blood/hemoperitoneum): (1) Damage-Control Resuscitation: Immediate activation of Massive Transfusion Protocol (MTP) utilizing a 1:1:1 balanced ratio of PRBCs, FFP, and Platelets to treat trauma-induced coagulopathy; (2) Antifibrinolytic Therapy: Tranexamic Acid (TXA 1 g IV over 10 min, then 1 g infusion over 8 hours) significantly reduces bleeding mortality when given within 3 hours of trauma (CRASH-2 trial); (3) Hemorrhage Control: Rapid transfer to the OR for emergent laparotomy or angiography without delaying for CT scans in hemodynamically unstable patients."
    }
  ]
};
