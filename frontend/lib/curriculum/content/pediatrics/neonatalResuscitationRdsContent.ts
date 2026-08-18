/**
 * Neonatal Resuscitation Program (NRP), APGAR & Respiratory Distress Syndrome Learning Content
 * Authoritative medical content derived from NRP 8th Ed, Nelson Pediatrics, AAP, and USMLE Step 2 CK Pediatrics.
 * Mapped to NMC CBME Competencies: PE4.1, PE4.2, PE4.3, PE4.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEONATAL_RESUSCITATION_RDS_MODULE: PhysiologyLessonModule = {
  id: "ped-nrp-rds",
  unitCode: "PE4.1",
  title: "Neonatology: NRP 8th Ed Algorithm, APGAR Score & Respiratory Distress Syndrome (Surfactant)",
  competencies: ["PE4.1", "PE4.2", "PE4.3", "PE4.4"],
  estimatedMinutes: 135,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Neonatology: NRP 8th Ed Algorithm, APGAR Score & Respiratory Distress Syndrome (Surfactant)

The golden minute of neonatal resuscitation demands rapid physiological assessment, systematic airway management, and targeted lung recruitment to establish functional residual capacity (**FRC**).

---

## 1. The APGAR Scoring System (Assessed at 1 and 5 Minutes)

| APGAR Category | 0 Points | 1 Point | 2 Points |
| :--- | :--- | :--- | :--- |
| **A — Appearance (Color)** | Pale or completely blue | Body pink, extremities blue (**Acrocyanosis**) | Completely pink all over |
| **P — Pulse (Heart Rate)** | Absent | **$< 100\\text{ beats/min}$** | **$\\ge 100\\text{ beats/min}$** |
| **G — Grimace (Reflex Irritability)** | Flaccid / No response | Grimace / Weak response | Cough, sneeze, vigorous cry, pulls away |
| **A — Activity (Muscle Tone)** | Completely limp / flaccid | Some flexion of arms and legs | Active spontaneous motion / flexion |
| **R — Respiration (Effort)** | Absent / Apneic | Slow, irregular, shallow, gasping | Good strong vigorous cry |

- **Score 7–10**: Normal vigorous infant $\\rightarrow$ routine post-delivery care.
- **Score 4–6**: Moderate depression $\\rightarrow$ tactile stimulation, oxygen, positive pressure ventilation.
- **Score 0–3**: Severe depression $\\rightarrow$ immediate full NRP resuscitation protocol.

---

## 2. Neonatal Resuscitation Program (NRP 8th Edition) Flowchart

1. **Initial Assessment (Birth to 30 Seconds)**:
   - Term? Tone? Breathing or crying?
   - If **NO** $\\implies$ Warm, position head in sniffing position, clear airway secretions (mouth then nose), dry, and stimulate.
2. **Apnea, Gasping, or Heart Rate $< 100\\text{ bpm}$ (The Golden Minute)**:
   - Initiate **Positive Pressure Ventilation (PPV)** with bag-mask at **$40\\text{ to } 60\\text{ breaths/min}$**.
   - Initial $FiO_2$: **$21\\%\\text{ } O_2$ (Room Air)** for $\\ge 35\\text{ weeks}$; **$21\\text{–}30\\%\\text{ } O_2$** for $< 35\\text{ weeks}$.
   - Attach pulse oximeter probe to **Right Hand / Wrist (Pre-ductal saturation)**.
3. **If Heart Rate Remains $< 100\\text{ bpm}$ despite PPV**:
   - Perform **MR. SOPA** Ventilation Corrective Steps:
     - **M**: Mask adjustment (ensure tight seal).
     - **R**: Reposition airway (neutral sniffing position).
     - *(Try PPV & check chest movement)*
     - **S**: Suction mouth and nose.
     - **O**: Open the mouth.
     - *(Try PPV & check chest movement)*
     - **P**: Pressure increase (by $5-10\\text{ cmH}_2\\text{O}$, max $40$).
     - **A**: Alternative airway (**Endotracheal Intubation** or Laryngeal Mask Airway).
4. **If Heart Rate is $< 60\\text{ bpm}$ despite 30 seconds of effective PPV via ETT**:
   - Initiate **Chest Compressions**:
     - **3 : 1 Compression-to-Ventilation Ratio** ($90\\text{ compressions} + 30\\text{ breaths} = 120\\text{ events/min}$).
     - Two-thumb encircling-hands technique on lower third of sternum.
     - Increase oxygen to **$100\\% FiO_2$**.
5. **If Heart Rate remains $< 60\\text{ bpm}$ despite 60 seconds of compressions**:
   - Administer **Intravenous Epinephrine (1:10,000 / $0.1\\text{ mg/mL}$)** via Umbilical Venous Catheter (**$0.02\\text{ mg/kg} = 0.2\\text{ mL/kg}$**).

---

## 3. Respiratory Distress Syndrome (RDS / Hyaline Membrane Disease)

- **Pathophysiology**: Prematurity ($< 34\\text{ weeks}$) results in deficient **Pulmonary Surfactant** (synthesized by **Type II Alveolar Pneumocytes**; primary active component: **Dipalmitoylphosphatidylcholine / Lecithin**). Lack of surfactant leads to high alveolar surface tension $\\rightarrow$ end-expiratory alveolar collapse $\\rightarrow$ diffuse microatelectasis and ventilation-perfusion mismatch.
- **Classic Presentation**: Tachypnea ($RR > 60$), prominent **Expiratory Grunting** (auto-PEEP maneuver to maintain FRC), intercostal/subcostal retractions, and nasal flaring within hours of birth.
- **Chest Radiograph**: **Diffuse Bilateral "Ground-Glass" Reticulogranular Opacities with prominent Air Bronchograms** and low lung volumes (bell-shaped thorax).
- **Evidence-Based Management**:
  - **Antenatal Corticosteroids**: Intramuscular Betamethasone or Dexamethasone administered to mothers at risk of preterm delivery ($24-34\\text{ weeks}$) accelerates fetal lung maturation.
  - **Early Nasal Continuous Positive Airway Pressure (nCPAP)**: Provides positive end-expiratory pressure ($5-7\\text{ cmH}_2\\text{O}$) to prevent alveolar collapse.
  - **Exogenous Surfactant Replacement**: Intratracheal administration of natural bovine/porcine surfactant (**Poractant alfa / Curosurf**) via minimally invasive surfactant therapy (LISA / MIST).
`,
  clinicalVignettes: [
    {
      scenario: "A 28-week preterm male infant is born via emergency cesarean delivery due to placental abruption. At 1 minute of life, the infant is apneic with a heart rate of 70 bpm and limp tone. The resuscitation team dries and stimulates the infant, clears secretions, and initiates positive pressure ventilation (PPV) with a bag and mask in 30% oxygen. After 30 seconds of PPV, the infant's heart rate remains 72 bpm and the chest is not visibly rising.",
      question: "Which of the following is the most appropriate next step in resuscitation according to the NRP algorithm?",
      options: [
        "Perform MR. SOPA ventilation corrective steps before initiating chest compressions",
        "Immediately begin chest compressions at a 3:1 ratio with 100% oxygen",
        "Administer intravenous epinephrine 0.02 mg/kg via umbilical venous catheter",
        "Administer intravenous sodium bicarbonate infusion"
      ],
      correctAnswerIndex: 0,
      explanation: "In NRP 8th Edition, before initiating chest compressions for a heart rate < 100 bpm, the team must ensure effective ventilation with chest movement. When the chest is not rising and HR remains < 100 bpm, the mandatory next step is to perform MR. SOPA ventilation corrective steps (Mask adjustment, Reposition airway, Suction mouth/nose, Open mouth, Pressure increase, Alternative airway). Chest compressions are only initiated if the heart rate remains < 60 bpm despite at least 30 seconds of effective PPV that moves the chest (preferably via an endotracheal tube)."
    }
  ]
};
