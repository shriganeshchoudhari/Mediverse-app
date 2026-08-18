/**
 * Advanced Trauma Life Support (ATLS), Primary Survey & Emergency Resuscitative Procedures
 * Authoritative medical content derived from ACS ATLS (10th ed.), Rosen, Tintinalli, and USMLE Step 2/3 Emergency Medicine.
 * Mapped to NMC CBME Competencies: EM7.1, EM7.2, EM8.1, EM8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMA_ATLS_EMERGENCY_PROCEDURES_MODULE: PhysiologyLessonModule = {
  id: "em-trauma-atls-emergency-procedures",
  unitCode: "EM7.1",
  title: "Emergency: ATLS Primary Survey (ABCDE), Tension Pneumothorax & Massive Transfusion (MTP)",
  competencies: ["EM7.1", "EM7.2", "EM8.1", "EM8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Emergency: ATLS Primary Survey (ABCDE), Tension Pneumothorax & Massive Transfusion (MTP)

In severe trauma, the systematic Advanced Trauma Life Support (ATLS) primary survey rapidly identifies and treats immediate life-threatening injuries in hierarchical order.

---

## 1. The ATLS Primary Survey ($ABCDE$) Hierarchy

| Phase | Assessment & Immediate Life Threats | Emergency Resuscitative Interventions |
| :--- | :--- | :--- |
| **A: Airway with C-Spine Protection** | • Inspect for foreign bodies, facial fractures, vomit/blood, stridor.<br>• Assume cervical spine injury in all blunt trauma; maintain manual inline stabilization.<br>• **Indication for Definitive Airway (ET tube)**: **$\\text{GCS} \\le 8$**, severe maxillofacial trauma, airway burns/inhalation injury, impending respiratory failure. | • Jaw-thrust maneuver (avoid head-tilt in trauma).<br>• Suction, insert oral/nasal airway adjunct.<br>• Rapid Sequence Intubation (RSI) with in-line cervical stabilization.<br>• Surgical Cricothyroidotomy if intubation fails (CICO). |
| **B: Breathing & Ventilation** | • Life threats: **Tension Pneumothorax, Open ("Sucking") Pneumothorax, Massive Hemothorax, Flail Chest**.<br>• Inspect chest expansion, auscultate breath sounds, check trachea position. | • **Tension Pneumothorax**: **Immediate Needle Decompression** followed by **Tube Thoracostomy (Chest Tube, 28–32 Fr)**.<br>• **Open Pneumothorax**: 3-sided occlusive dressing.<br>• **Flail Chest**: Positive pressure ventilation $+$ analgesia. |
| **C: Circulation with Hemorrhage Control** | • Assess pulse, blood pressure, capillary refill, skin color, and mental status.<br>• Identify external hemorrhage vs internal bleeding (**Chest, Abdomen, Pelvis, Retroperitoneum, Long bones, "Blood on the floor and 4 more"**). | • Direct pressure / Tourniquets on bleeding limbs.<br>• **Pelvic Binder / Sheet wrap** at level of greater trochanters for open-book pelvic fractures.<br>• Two large-bore (14–16G) peripheral IV lines or Intraosseous (IO) access.<br>• **Massive Transfusion Protocol (MTP)** $+$ **Tranexamic Acid (TXA)**. |
| **D: Disability & Neurological Status** | • **Glasgow Coma Scale (GCS 3–15)**.<br>• Pupil size, symmetry, and light reactivity.<br>• Motor response / lateralizing neurological deficits. | • Unilateral dilated fixed pupil $\\implies$ Uncal herniation (Hyperventilate to target $PaCO_2\\text{ }30-35\\text{ mmHg}$, IV Mannitol $1\\text{ g/kg}$ or $3\\%\\text{ Hypertonic Saline}$, emergent neurosurgical decompression). |
| **E: Exposure & Environmental Control** | • Completely undress patient to inspect all body surfaces.<br>• **Log-roll** with cervical spine stabilization to inspect spine, back, and rectal tone. | • **Prevent Hypothermia**: Warm blankets, warmed IV fluids, warm ambient room temperature ($>28^\\circ\\text{C}$). Hypothermia worsens the lethal trauma triad! |

---

## 2. Emergency Thoracic Decompression & Chest Tube Placement

- **Tension Pneumothorax**:
  - *Clinical Triad*: Severe respiratory distress, unilateral absent breath sounds with hyper-resonance, and tracheal deviation away from affected side $+$ obstructive shock (hypotension, distended neck veins).
  - *CRITICAL RULE*: **A clinical diagnosis! NEVER delay treatment for a chest radiograph (CXR)!**
  - *Immediate Treatment*: **Needle Decompression**:
    - Adults: **14-gauge or 16-gauge IV catheter (minimum $5\\text{ cm} / 2\\text{ inches}$ long)** inserted into the **2nd intercostal space at the mid-clavicular line** OR the **5th intercostal space at the anterior axillary line**.
    - Follow immediately with definitive **Tube Thoracostomy (Chest Tube, 28–32 Fr)** in the **"Safe Triangle"** (bordered by anterior border of latissimus dorsi, lateral border of pectoralis major, 5th intercostal space, and apex of axilla).
- **Massive Hemothorax**:
  - Rapid accumulation of $> 1500\\text{ mL}$ of blood in the pleural cavity.
  - *Indications for Immediate Emergency Exploratory Thoracotomy*:
    1. **Initial chest tube drainage $> 1500\\text{ mL}$ of blood** upon placement.
    2. **Ongoing bleeding $> 200\\text{ mL/hour}$ for $2 - 4\\text{ consecutive hours}$**.
    3. Persistent hemodynamic instability despite aggressive blood transfusion.

---

## 3. The Trauma "Lethal Triad" & Massive Transfusion Protocol (MTP)

$$\\text{The Lethal Trauma Triad}: \\text{Hypothermia} + \\text{Severe Metabolic Acidosis} + \\text{Coagulopathy}$$

- **Massive Transfusion Protocol (MTP)**:
  - Definition: Transfusion of $\\ge 10\\text{ units}$ of Packed Red Blood Cells (PRBCs) within 24 hours, or $> 4\\text{ units}$ in 1 hour.
  - **Balanced Blood Component Ratio**: **$1:1:1$ ratio of PRBCs : Fresh Frozen Plasma (FFP) : Platelets** (mimics whole blood, preventing dilution coagulopathy).
  - **Tranexamic Acid (TXA - CRASH-2 Trial)**:
    - Administer **$1\\text{ g}$ IV bolus over 10 minutes within $3\\text{ hours}$ of injury**, followed by **$1\\text{ g}$ IV infusion over 8 hours**.
    - Inhibits plasminogen activation $\\implies$ prevents fibrinolysis and reduces all-cause mortality by $>15\\%$.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male arrives in the trauma resuscitation bay following a high-speed motor vehicle collision. He was unrestrained and suffered blunt chest trauma against the steering wheel. He is agitated, gasping for air, and cyanotic. Vital signs are: blood pressure 68/40 mmHg, heart rate 146 bpm (thready), respiratory rate 38/min, and SpO2 78% on 15 L non-rebreather. Physical exam demonstrates severe subcutaneous emphysema over the right chest wall, hyper-resonance to percussion and complete absence of breath sounds over the right hemithorax, distended neck veins (JVD), and the trachea is visibly deviated to the left.",
      question: "What is the diagnosis, and what is the immediate, life-saving next step in management?",
      options: [
        "Right-sided Tension Pneumothorax; Perform immediate needle decompression with a 14G cannula in the right 5th ICS anterior axillary line or 2nd ICS mid-clavicular line",
        "Right-sided Massive Hemothorax; Order an urgent portable chest radiograph",
        "Pericardial Tamponade; Perform emergent subxiphoid pericardiocentesis",
        "Flail Chest; Perform immediate endotracheal intubation without decompression"
      ],
      correctAnswerIndex: 0,
      explanation: "A trauma patient presenting with obstructive shock (severe hypotension, distended neck veins), cyanosis, unilateral absent breath sounds with hyper-resonance, and contralateral tracheal deviation has a Right-Sided Tension Pneumothorax. Tension pneumothorax is a clinical emergency that requires immediate needle decompression (using a 14-gauge catheter in the 5th ICS anterior axillary line or 2nd ICS mid-clavicular line) followed immediately by tube thoracostomy. Ordering a portable CXR delays life-saving decompression and is an incorrect, fatal choice."
    }
  ]
};
