/**
 * Antepartum Hemorrhage, Cardiotocography (CTG) & Obstetric Emergencies Learning Content
 * Authoritative medical content derived from Williams Obstetrics, DC Dutta, ACOG, and USMLE Step 2 CK OB/GYN.
 * Mapped to NMC CBME Competencies: OG6.1, OG6.2, OG7.1, OG7.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OBSTETRIC_EMERGENCIES_FETAL_HEART_MODULE: PhysiologyLessonModule = {
  id: "obg-emergencies-ctg",
  unitCode: "OG6.1",
  title: "Obstetrics: Antepartum Hemorrhage (Previa vs Abruptio), CTG Fetal Heart Decelerations & Cord Prolapse",
  competencies: ["OG6.1", "OG6.2", "OG7.1", "OG7.2"],
  estimatedMinutes: 135,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Obstetrics: Antepartum Hemorrhage (Previa vs Abruptio), CTG Fetal Heart Decelerations & Cord Prolapse

Obstetric emergencies require rapid differentiation of third-trimester antepartum hemorrhage and systematic interpretation of electronic Cardiotocography (**CTG**) to prevent fetal demise and maternal exsanguination.

---

## 1. Antepartum Hemorrhage (APH): Placenta Previa vs Abruptio Placentae

| Clinical Feature | Placenta Previa (Abnormal Implantation over Cervical Os) | Abruptio Placentae (Premature Placental Separation) |
| :--- | :--- | :--- |
| **Pathophysiology** | Placenta covers internal cervical os (complete, partial, marginal). | Rupture of decidual spiral arteries $\\implies$ retroplacental hemorrhage. |
| **Vaginal Bleeding** | **PAINLESS, BRIGHT RED** recurrent vaginal bleeding. | **PAINFUL, DARK RED** vaginal bleeding (or concealed hemorrhage in $20\\%$). |
| **Abdominal Exam / Uterine Tone** | **SOFT, RELAXED, NON-TENDER uterus**; fetal parts easily palpable. | **"WOODY / BOARD-LIKE" HARD, TENSE, EXTREMELY TENDER uterus** with high resting baseline tone. |
| **Fetal Heart Status** | Typically **Normal / Reactive** unless massive maternal exsanguination occurs. | **Fetal Distress / Bradycardia / Demise** is common ($>50\\%$) due to loss of exchange surface area. |
| **Coagulopathy / DIC** | Rare. | **COMMON** (tissue factor release from retroplacental hematoma activates extrinsic coagulation cascade $\\implies$ consumptive coagulopathy / hypofibrinogenemia). |
| **Diagnostic Evaluation** | **Transvaginal Ultrasound (TVUS, Gold Standard)**. | Clinical diagnosis (ultrasound has low sensitivity $\\approx 50\\%$ for acute retroplacental clot). |
| **CRITICAL CAUTION** | **DIGITAL VAGINAL EXAMINATION IS STRICTLY FORBIDDEN!** *(Can tear through placenta and cause catastrophic maternal-fetal exsanguination)*. | Emergency Cesarean Delivery if maternal-fetal distress or failed trial of labor. |

---

## 2. Cardiotocography (CTG) Fetal Heart Rate Deceleration Patterns

| Deceleration Pattern | Waveform Morphology & Timing relative to Contraction | Pathophysiologic Mechanism | Clinical Significance & Management |
| :--- | :--- | :--- | :--- |
| **1. Early Deceleration** | Symmetrical, gradual decrease in FHR. **Nadir of deceleration matches EXACTLY with the peak of the uterine contraction** ("Mirror image"). | **Fetal Head Compression** $\\implies$ transient increase in intracranial pressure $\\implies$ vagal nerve stimulation and slowing of heart rate. | **BENIGN / PHYSIOLOGICAL**. No fetal hypoxia or acidosis. Requires no intervention; continue routine labor observation. |
| **2. Late Deceleration** | Gradual decrease in FHR where the **onset and nadir of deceleration occur AFTER the peak of the contraction** (delayed recovery to baseline after contraction ends). | **Uteroplacental Insufficiency & Fetal Hypoxemia / Acidosis**. Fetal chemoreceptor stimulation triggers reflex bradycardia and myocardial depression. | **OMINOUS / PATHOLOGICAL**. Immediate intrauterine resuscitation: Turn mother to **Left Lateral position**, Administer IV fluid bolus, Provide supplemental oxygen, **Discontinue Oxytocin infusion**, and prepare for Urgent Operative Delivery if persistent. |
| **3. Variable Deceleration** | Abrupt decrease in FHR (onset to nadir $<30\\text{ seconds}$); resembles **"V" or "W" shape** with rapid return to baseline. Variable timing relative to contractions. | **Umbilical Cord Compression** (oligohydramnios, nuchal cord, cord knot). Transient occlusion of umbilical vein and arteries. | Reposition mother to left/right lateral; perform vaginal exam to rule out **Umbilical Cord Prolapse**; consider amnioinfusion for oligohydramnios. |
| **4. Sinusoidal Pattern** | Smooth, undulating, wave-like pattern (frequency 3–5 cycles/min, amplitude 5–15 bpm) persisting for $>20\\text{ min}$ with absent accelerations. | **Severe Fetal Anemia** (Rh isoimmunization, fetomaternal hemorrhage, ruptured vasa previa) or severe terminal fetal hypoxia. | **CRITICAL SURGICAL EMERGENCY** $\\implies$ Immediate Emergency Cesarean Section or emergent intrauterine fetal transfusion. |

---

## 3. Umbilical Cord Prolapse

- **Definition**: Descent of the umbilical cord through the cervix alongside or ahead of the fetal presenting part following rupture of amniotic membranes.
- **Classic Presentation**: Sudden, severe prolonged fetal bradycardia or deep variable decelerations occurring immediately after spontaneous or artificial rupture of membranes (ARM).
- **Emergency 4-Step Management Protocol**:
  1. **Call for Immediate Emergency Cesarean Section**.
  2. **Manual Elevation of Fetal Presenting Part**: Examiner inserts sterile gloved fingers into the vagina to physically push the fetal head upward off the compressed umbilical cord.
  3. **Maternal Positioning**: Place patient in **Knee-Chest position** or Steep Trendelenburg to allow gravity to relieve cord compression.
  4. **Rapid Operative Delivery**: Keep hand in vagina elevating the head all the way into the operating room until the infant is delivered by emergency cesarean section.
`,
  clinicalVignettes: [
    {
      scenario: "A 31-year-old G2P1 at 38 weeks of gestation presents with painless, bright-red vaginal bleeding of 2 hours duration. On abdominal examination, the uterus is soft, non-tender, and relaxed. Fetal heart rate is 144 bpm and reactive. The intern on duty prepares to perform a digital vaginal examination with a sterile speculum to determine cervical dilation.",
      question: "What is the most appropriate next step in clinical management?",
      options: [
        "Cancel the digital vaginal examination immediately and perform a transvaginal ultrasound",
        "Proceed with gentle digital examination to palpate the cervical os",
        "Perform an artificial rupture of membranes to assess amniotic fluid",
        "Administer intramuscular carboprost for suspected uterine atony"
      ],
      correctAnswerIndex: 0,
      explanation: "Third-trimester painless bright-red vaginal bleeding with a soft, non-tender uterus is classic for Placenta Previa. In all cases of suspected placenta previa, digital vaginal examination is strictly contraindicated because inserting fingers into the internal cervical os can directly tear through the vascular placental bed, precipitating catastrophic maternal exsanguination. The definitive initial diagnostic test is a Transvaginal Ultrasound (TVUS) to confirm the placental position safely."
    }
  ]
};
