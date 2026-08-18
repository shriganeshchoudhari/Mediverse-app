/**
 * Trauma Surgery, ATLS Resuscitation & Hemorrhagic Shock Learning Content
 * Authoritative medical content derived from ATLS 10th Ed, Bailey & Love, Sabiston, and USMLE Step 2 CK Surgery.
 * Mapped to NMC CBME Competencies: SU3.1, SU3.2, SU3.3, SU4.1, SU4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMA_ATLS_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "surg-trauma-atls",
  unitCode: "SU3.1",
  title: "Trauma Surgery: ATLS Primary Survey (ABCDE), Tension Pneumothorax, FAST & Damage Control Resuscitation",
  competencies: ["SU3.1", "SU3.2", "SU3.3", "SU4.1", "SU4.2"],
  estimatedMinutes: 140,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Trauma Surgery: ATLS Primary Survey (ABCDE), Tension Pneumothorax, FAST & Damage Control Resuscitation

The Advanced Trauma Life Support (**ATLS**) protocol prioritizes the systematic identification and immediate management of greatest threats to life according to the **ABCDE** paradigm.

---

## 1. ATLS Primary Survey & Immediate Life-Threat Interventions

| Primary Survey Step | Life-Threatening Pathology | Diagnostic Physical Signs | Immediate Life-Saving Emergency Intervention |
| :--- | :--- | :--- | :--- |
| **A — Airway with C-Spine Control** | Airway obstruction (blood, secretions, facial trauma, GCS $\\le 8$) | Stridor, gurgling, hoarseness, apnea | • In-line cervical spine stabilization with rigid cervical collar.<br>• Chin-lift / Jaw-thrust.<br>• **Definitive Airway (Endotracheal Intubation)**.<br>• **Surgical Cricothyroidotomy** if intubation fails or massive maxillofacial destruction. |
| **B — Breathing & Ventilation** | **1. Tension Pneumothorax** | Tracheal deviation to opposite side, absent unilateral breath sounds, hyperresonance, distended neck veins, severe hypotension. | **Immediate Needle Decompression** (large-bore cannula in **5th Intercostal Space, Mid-Axillary Line**) followed immediately by **Tube Thoracostomy (Chest Tube)**. *NEVER wait for a chest X-ray!* |
| | **2. Cardiac Tamponade** | **Beck\'s Triad**: Hypotension $+$ Distended Jugular Veins $+$ Muffled Heart Sounds; **Pulsus Paradoxus** ($>10\\text{ mmHg}$ drop in SBP on inspiration). | Bedside **FAST Ultrasound** $\\implies$ Emergency **Subxiphoid Pericardiocentesis** or Resuscitative Thoracotomy. |
| | **3. Massive Hemothorax** | Dullness to percussion, collapsed neck veins, absent breath sounds, shock. | Chest tube ($28-32\\text{ Fr}$); **Emergency Thoracotomy** if initial drainage $>1500\\text{ mL}$ or ongoing output $>200\\text{ mL/h for 2-4 hours}$. |
| **C — Circulation & Hemorrhage** | Exsanguinating hemorrhagic shock | Tachycardia, hypotension, cool clammy extremities, active external bleeding. | Direct manual pressure on external bleed; pelvic binder for open-book fracture; **Balanced Blood Transfusion (1:1:1 MTP)**. |
| **D — Disability** | Acute traumatic brain injury | **Glasgow Coma Scale (GCS 3–15)**; pupillary asymmetry / sluggish reaction. | Prevent secondary brain injury (**avoid hypotension SBP $<90$ and hypoxia $PaO_2 <60$**); Urgent non-contrast Head CT. |
| **E — Exposure & Environment** | Hypothermia, occult burns/trauma | Full body log-roll inspection of spine. | Remove wet clothes, warm blankets, warm IV fluids ($39^\\circ\\text{C}$) to prevent the **Lethal Triad of Trauma**. |

> **The Lethal Triad of Trauma**: **Hypothermia** ($<35^\\circ\\text{C}$) $+$ **Metabolic Acidosis** (pH $<7.20$) $+$ **Coagulopathy** (INR $>1.5$). When established, mortality exceeds $90\\%$.

---

## 2. ATLS Classification of Hemorrhagic Shock

| Parameter | Class I Shock | Class II Shock (Compensated) | Class III Shock (Decompensated) | Class IV Shock (Pre-Terminal) |
| :--- | :--- | :--- | :--- | :--- |
| **Blood Loss (mL in 70kg)** | Up to $750\\text{ mL}$ | $750\\text{–}1500\\text{ mL}$ | **$1500\\text{–}2000\\text{ mL}$** | **$> 2000\\text{ mL}$** |
| **Blood Loss (% Volume)** | $< 15\\%$ | $15\\text{–}30\\text{ }\\%$ | **$30\\text{–}40\\% $** | **$> 40\\%$** |
| **Heart Rate (bpm)** | $< 100$ | **$> 100$ (Tachycardia)** | **$> 120$** | **$> 140$** |
| **Blood Pressure** | Normal | **Normal (maintained by SVR)** | **DECREASED (Hypotension)** | **Severely Decreased** |
| **Pulse Pressure** | Normal / $\\uparrow$ | **DECREASED (Narrowed)** | Decreased | Severely Decreased |
| **Respiratory Rate** | $14\\text{–}20$ | $20\\text{–}30$ | **$30\\text{–}40$ (Tachypnea)** | $> 35$ |
| **Urine Output (mL/h)** | $> 30$ | $20\\text{–}30$ | **$5\\text{–}15$ (Oliguria)** | **Negligible / Anuria** |
| **Mental Status** | Slightly anxious | Mildly anxious | Anxious, confused | Confused, lethargic |
| **Initial Fluid Therapy** | Crystalloid | Crystalloid | **Crystalloid $+$ Blood (PRBC)** | **Massive Transfusion Protocol (MTP)** |

---

## 3. Focused Assessment with Sonography for Trauma (FAST)

The FAST exam rapidly detects free intraperitoneal and pericardial fluid in 4 standard anatomical acoustic windows:
1. **Perihepatic Space (Morison\'s Pouch / Hepatorenal Recess)**: Most dependent part of the upper peritoneal cavity in the supine position; most common site for free fluid collection from liver or retroperitoneal laceration.
2. **Perisplenic Space (Splenorenal Recess)**: Detects splenic laceration hemorrhage.
3. **Pelvic Space (Rectovesical / Pouch of Douglas)**: Most dependent part of the true pelvis.
4. **Pericardial Window (Subxiphoid View)**: Evaluates for hemopericardium and cardiac tamponade.
*(Extended-FAST / eFAST adds anterior thoracic views to detect Pneumothorax via absence of lung sliding).*
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old unrestrained driver is brought to the trauma resuscitation bay following a high-speed head-on motor vehicle collision. Vitals: BP 70/42 mmHg, HR 138 bpm, RR 36 bpm, SpO2 84% on room air. Physical exam reveals severe respiratory distress, absent breath sounds on the entire right hemithorax, hyperresonance to percussion on the right, distended neck veins, and the trachea is deviated toward the left side.",
      question: "Which of the following represents the immediate life-saving intervention?",
      options: [
        "Immediate needle thoracostomy decompression in the 5th intercostal space mid-axillary line",
        "Stat portable upright chest X-ray to confirm pneumothorax",
        "Intravenous infusion of 2 liters of normal saline bolus",
        "Subxiphoid pericardiocentesis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic life-threatening signs of a Right Tension Pneumothorax (severe hypotension, absent right breath sounds, hyperresonance, distended neck veins, and tracheal deviation to the contralateral left side). Tension pneumothorax is a pure clinical diagnosis. ATLS guidelines strictly mandate immediate needle decompression (5th intercostal space, mid-axillary line) followed by chest tube thoracostomy. Waiting for a chest X-ray causes lethal cardiovascular collapse due to vena caval compression."
    }
  ]
};
