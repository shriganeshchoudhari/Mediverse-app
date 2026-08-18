/**
 * Labor Mechanics, Cardinal Movements & WHO Partogram Learning Content
 * Authoritative medical content derived from Williams Obstetrics, DC Dutta, WHO Labor Care Guide, and USMLE Step 2 CK OB/GYN.
 * Mapped to NMC CBME Competencies: OG1.1, OG1.2, OG1.3, OG2.1, OG2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LABOR_MECHANICS_PARTOGRAM_MODULE: PhysiologyLessonModule = {
  id: "obg-labor-partogram",
  unitCode: "OG1.1",
  title: "Obstetrics: Mechanism of Normal Labor, Cardinal Movements & WHO Partograph Interpretation",
  competencies: ["OG1.1", "OG1.2", "OG1.3", "OG2.1", "OG2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Obstetrics: Mechanism of Normal Labor, Cardinal Movements & WHO Partograph Interpretation

Labor is defined as regular, painful uterine contractions resulting in progressive cervical effacement and dilation, facilitating the descent and delivery of the fetus and placenta.

---

## 1. Cardinal Movements of Normal Labor (Vertex Presentation, Left Occipito-Anterior / LOA)

| Cardinal Movement | Mechanical Mechanism & Anatomical Landmark | Clinical Significance |
| :--- | :--- | :--- |
| **1. Engagement** | The widest transverse diameter of the fetal head (**Biparietal Diameter, $9.5\\text{ cm}$**) passes through the pelvic inlet. | Occurs at **Station 0** (fetal head vertex level with maternal ischial spines). Occurs $2-3$ weeks before labor in nulliparas; at onset of labor in multiparas. |
| **2. Descent** | Downward progression of the fetal head through the pelvis. | Continuous throughout labor, driven by uterine contractions, maternal pushing, and amniotic fluid hydrostatic pressure. |
| **3. Flexion** | The descending head meets resistance from the pelvic floor / cervix, flexing the fetal chin against the chest. | Substitutes the smaller **Suboccipitobregmatic diameter ($9.5\\text{ cm}$)** for the larger Occipitofrontal diameter ($11.5\\text{ cm}$). |
| **4. Internal Rotation** | The occiput rotates anteriorly by **$45^\\circ$** toward the maternal pubic symphysis (from LOA to Direct Occipito-Anterior). | Aligns the longest anteroposterior diameter of the fetal head with the longest anteroposterior diameter of the pelvic outlet. |
| **5. Extension** | The occiput pivots beneath the pubic subpubic arch, and the head extends forward and upward. | Leads to **Crowing** and sequential delivery of the vertex, forehead, nose, mouth, and chin over the perineum. |
| **6. Restitution** | After delivery, the head untwists by $45^\\circ$ to restore its natural perpendicular alignment with the fetal shoulders. | External visual untwisting matching the intra-pelvic shoulder orientation. |
| **7. External Rotation** | The fetal shoulders rotate internally into the anteroposterior pelvic diameter; the head rotates an additional $45^\\circ$ externally. | Fetal face now directly faces maternal right thigh (in LOA). |
| **8. Expulsion** | The **Anterior Shoulder** slips beneath the pubic symphysis first, followed by the Posterior Shoulder over the perineum and the remaining fetal body. | Complete delivery of the newborn infant. |

---

## 2. The 4 Clinical Stages of Labor

1. **First Stage (Onset of regular contractions to Complete Cervical Dilation $10\\text{ cm}$)**:
   - **Latent Phase**: Cervix effaces and dilates from $0\\text{ to } 5\\text{ cm}$ (slow progression; duration up to 20h in nulliparas, 14h in multiparas).
   - **Active Phase**: Rapid cervical dilation from $5\\text{ to } 10\\text{ cm}$ (normal rate $\\ge 1.0\\text{ cm/hour}$ in nulliparas, $\\ge 1.5\\text{ cm/hour}$ in multiparas).
2. **Second Stage (Complete Dilation $10\\text{ cm}$ to Delivery of Infant)**:
   - Nullipara: Up to 3 hours (4h with epidural). Multipara: Up to 2 hours (3h with epidural).
3. **Third Stage (Delivery of Infant to Complete Expulsion of Placenta & Membranes)**:
   - Normal duration $<30\\text{ minutes}$. Active Management of Third Stage of Labor (**AMTSL**) reduces PPH risk by $60\\%$.
4. **Fourth Stage (Immediate 1–2 Hours Post-Partum)**:
   - Critical window for monitoring maternal vitals, uterine tone, and early detection of uterine atony.

---

## 3. The Modified WHO Partograph

The Partograph is a graphical composite chart recording maternal and fetal parameters against elapsed time to detect obstructed labor early:
- **Plotting Baseline**: Begins at the start of the **Active Phase (Cervical dilation $\\ge 4-5\\text{ cm}$)**.
- **The Alert Line**: A straight line drawn at a slope of **$1.0\\text{ cm/hour}$** from $4\\text{ cm}$ to $10\\text{ cm}$.
  - Normal labor dilation curves stay **on or to the left** of the Alert Line.
- **The Action Line**: Drawn parallel to the Alert Line, **4 hours to the right**.
  - **Crossing the Alert Line**: Signals **Protracted Active Phase** (inadequate uterine contractions $\\rightarrow$ amniotomy $\\pm$ IV Oxytocin augmentation).
  - **Reaching or Crossing the Action Line**: Signals **Cephalopelvic Disproportion (CPD) / Obstructed Labor** $\\implies$ **Immediate Emergency Cesarean Delivery** to prevent uterine rupture, fetal asphyxia, and vesicovaginal fistula.
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old primigravida at 39 weeks of gestation is in active labor. At 8:00 AM, her cervix was 5 cm dilated and fetal head at Station -1. By 12:00 PM (4 hours later), repeated vaginal examination reveals the cervix remains at 5 cm dilation with significant fetal head caput succedaneum and secondary molding, despite regular strong uterine contractions (4 in 10 minutes, each lasting 50 seconds). On the WHO Partograph, the cervical dilation plotting has crossed the Alert Line and reached the Action Line.",
      question: "Which of the following is the most appropriate definitive management?",
      options: [
        "Perform an immediate Emergency Cesarean Section for Obstructed Labor / CPD",
        "Start an intravenous oxytocin infusion at maximum dose",
        "Administer intramuscular methylergonovine",
        "Reassure the patient and re-examine in 4 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "Arrest of cervical dilation in the active phase accompanied by strong contractions, significant caput and molding, and crossing the Action Line on the WHO Partograph indicates Cephalopelvic Disproportion (CPD) / Obstructed Labor. Oxytocin is strictly contraindicated in obstructed labor as it precipitates uterine rupture. The gold-standard definitive management is immediate Emergency Cesarean Delivery."
    }
  ]
};
