/**
 * Emergency Medicine: Acute Trauma Resuscitation, eFAST & Airway Emergencies
 * Authoritative medical content derived from ATLS (10th ed.), Tintinalli's Emergency Medicine (9th ed.).
 * Mapped to NMC CBME Competencies: EM1.7, EM1.8, SU33.1, AN22.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMA_RESUSCITATION_EFAST_MODULE: PhysiologyLessonModule = {
  id: "emergency-adv-trauma-resuscitation-efast",
  unitCode: "EM7.1",
  title: "Acute Trauma Resuscitation (ATLS), eFAST Sonography, Tension Pneumothorax & Massive Transfusion (1:1:1)",
  competencies: ["EM1.7", "EM1.8", "SU33.1", "AN22.4"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Acute Trauma Resuscitation, eFAST & Damage Control

Acute trauma resuscitation follows the ATLS protocol with immediate detection of life threats during the Primary Survey, bedside ultrasound, and balanced damage-control transfusion.

---

## 1. ATLS Primary Survey Life-Threats & Interventions

$$\\begin{array}{lccc}
\\hline
\\textbf{Life-Threatening Injury} & \\textbf{Physical Examination Hallmark} & \\textbf{Pathophysiology} & \\textbf{Immediate Intervention} \\\\
\\hline
\\textbf{Tension Pneumothorax} & \\mathbf{\\text{Absent unilateral breath sounds,}} & \\text{One-way valve air trapping } \\rightarrow & \\mathbf{\\text{Immediate Needle Thoracostomy}} \\\\
& \\mathbf{\\text{hyperresonance, contralateral tracheal shift}} & \\text{SVC collapse \u0026 obstructive shock} & \\mathbf{\\text{(5th ICS AAL / 2nd ICS MCL)}} \\rightarrow \\text{Chest tube} \\\\
\\textbf{Cardiac Tamponade} & \\mathbf{\\text{Beck's Triad (Hypotension, JVD,}} & \\text{Pericardial fluid restricts RV/LV} & \\mathbf{\\text{Subxiphoid Pericardiocentesis}} \\\\
& \\mathbf{\\text{Muffled heart sounds) + Pulsus Paradoxus}} & \\text{diastolic filling } \\rightarrow \\text{ shock} & \\text{or emergent thoracotomy} \\\\
\\textbf{Massive Hemothorax} & \\text{Absent breath sounds, } \\mathbf{\\text{DULLNESS to percussion,}} & \\text{Accumulation of }>1,500\\text{ mL blood} & \\mathbf{\\text{Large-bore chest tube (28-32F);}} \\\\
& \\text{tracheal shift, flat neck veins, shock} & \\text{in pleural cavity} & \\text{Thoracotomy if }>1,500\\text{ mL initial output} \\\\
\\textbf{Open Pneumothorax} & \\text{\"Sucking chest wound\", bubbling defect} & \\text{Intrapleural pressure equilibrates} & \\mathbf{3\\text{-sided occlusive dressing }} \\rightarrow \\text{ Chest tube} \\\\
\\hline
\\end{array}$$

---

## 2. Extended Focused Assessment with Sonography for Trauma (eFAST)

$$\\begin{array}{lcc}
\\hline
\\textbf{eFAST Window} & \\textbf{Anatomical Structure Examined} & \\textbf{Positive Diagnostic Finding} \\\\
\\hline
\\textbf{Right Upper Quadrant (RUQ)} & \\mathbf{\\text{Morison's Pouch (Hepatorenal space)}} & \\text{Anechoic (black) stripe of free fluid (blood)} \\\\
\\textbf{Left Upper Quadrant (LUQ)} & \\mathbf{\\text{Splenorenal Recess \u0026 subdiaphragmatic space}} & \\text{Anechoic free fluid around spleen / kidney} \\\\
\\textbf{Pelvis (Suprapubic)} & \\mathbf{\\text{Rectovesical pouch (male) / Pouch of Douglas (female)}} & \\text{Free fluid posterior / superior to bladder} \\\\
\\textbf{Subxiphoid Cardiac} & \\mathbf{\\text{Pericardial Sac (anterior \u0026 posterior RV)}} & \\text{Anechoic fluid rim separating pericardial layers} \\\\
\\textbf{Thoracic Pleural (Bilateral)} & \\mathbf{\\text{Parietal-visceral pleural interface (2nd-4th ICS)}} & \\mathbf{\\text{ABSENT lung sliding; \"Barcode / Stratosphere\" sign}} \\\\
\\hline
\\end{array}$$

---

## 3. Damage Control Resuscitation & Massive Transfusion Protocol (MTP)

- **Balanced Transfusion Ratio**: Administer blood products in a fixed **$1:1:1$ ratio (1 unit Packed RBCs : 1 unit Fresh Frozen Plasma : 1 unit Platelets)** to prevent dilutional coagulopathy and thrombocytopenia.
- **The Lethal Triad of Trauma**:
  1. **Hypothermia**: Impairs platelet function and coagulation cascades.
  2. **Coagulopathy**: Dilution, consumption, and hypothermia-induced clotting failure.
  3. **Acidosis**: Serum $\\text{pH} < 7.20$ inhibits clotting factor enzymatic complexes.
- **Tranexamic Acid (TXA)**: Synthetic lysine analogue (plasminogen inhibitor) that prevents fibrin clot breakdown. Administer **$1\\text{ g}$ IV over 10 minutes, followed by $1\\text{ g}$ IV over 8 hours** within **$3\\text{ hours}$ of trauma**.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male is brought to the trauma resuscitation bay following a high-speed motorcycle crash. He is in severe respiratory distress, cyanotic, and agitated. Vital signs: BP 72/40 mmHg, HR 142 bpm, RR 38/min, SpO2 78% on a non-rebreather mask. Physical examination reveals distended jugular veins, trachea deviated noticeably to the left, and complete absence of breath sounds with hyperresonance to percussion over the right hemithorax.",
      question: "Which of the following is the most immediate life-saving next step in management?",
      options: [
        "Immediate needle decompression (thoracostomy) in the right 5th intercostal space anterior axillary line (or 2nd intercostal space midclavicular line)",
        "Stat portable upright chest radiograph to confirm the diagnosis",
        "Endotracheal intubation with positive pressure mechanical ventilation",
        "Emergency subxiphoid pericardiocentesis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical presentation of a Tension Pneumothorax: severe respiratory distress, shock (hypotension, tachycardia), distended neck veins, absent breath sounds with hyperresonance on the affected (right) side, and tracheal deviation to the contralateral (left) side. Tension pneumothorax is a clinical diagnosis; obtaining a chest radiograph or initiating positive pressure ventilation before decompression will precipitate complete cardiovascular collapse and death due to obstructive shock (compression of the IVC/SVC and right atrium). The immediate life-saving action is emergent needle decompression with a large-bore angiocatheter (14-gauge) placed at the 5th intercostal space anterior axillary line or 2nd intercostal space midclavicular line, converted immediately to a formal tube thoracostomy."
    }
  ]
};
