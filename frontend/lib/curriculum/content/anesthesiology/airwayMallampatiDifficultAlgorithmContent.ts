/**
 * Preoperative Airway Assessment, Mallampati Classification & ASA Difficult Airway Algorithm
 * Authoritative medical content derived from Miller, Morgan & Mikhail, ASA 2022 Guidelines, and USMLE Step 2 CK Anesthesia.
 * Mapped to NMC CBME Competencies: AS1.1, AS1.2, AS2.1, AS2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AIRWAY_MALLAMPATI_DIFFICULT_ALGORITHM_MODULE: PhysiologyLessonModule = {
  id: "anes-airway-mallampati-algorithm",
  unitCode: "AS1.1",
  title: "Anesthesia: Airway Assessment (Mallampati & LEMON) & ASA Difficult Airway Algorithm (CICO)",
  competencies: ["AS1.1", "AS1.2", "AS2.1", "AS2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Anesthesia: Airway Assessment (Mallampati & LEMON) & ASA Difficult Airway Algorithm (CICO)

Anticipating and systematically executing difficult airway algorithms prevents hypoxic brain injury and cardiac arrest in perioperative care.

---

## 1. Preoperative Airway Assessment & Predictive Indices

| Examination Component | Diagnostic Criteria & Landmarks | Clinical Significance & Predictors |
| :--- | :--- | :--- |
| **Mallampati Classification**<br>*(Patient seated, head neutral, mouth open maximally, tongue protruded WITHOUT phonation)* | • **Class I**: Soft palate, fauces, uvula, anterior & posterior tonsillar pillars visible.<br>• **Class II**: Soft palate, fauces, and portion of uvula visible.<br>• **Class III**: Soft palate and base of uvula visible (pillars hidden).<br>• **Class IV**: **Hard palate only visible** (soft palate completely obscured). | **Class III & IV correlate with difficult direct laryngoscopy** (poor glottic visualization). |
| **LEMON Assessment** | • **L: Look externally**: Facial trauma, severe retrognathia / micrognathia, large goiter, beard.<br>• **E: Evaluate 3-3-2 Rule**: Inter-incisor gap $\\ge 3\\text{ fingerbreadths}$ ($> 4\\text{ cm}$), Thyromental distance $\\ge 3\\text{ fingerbreadths}$ ($> 6\\text{ cm}$), Hyoid-to-mental distance $\\ge 2\\text{ fingerbreadths}$.<br>• **M: Mallampati score** (Class III/IV).<br>• **O: Obstruction / Obesity** (Stridor, peritonsillar abscess, OSA with $\\text{BMI} > 35$).<br>• **N: Neck Mobility**: Normal atlanto-occipital extension $> 35^\\circ$. | Systematic composite score quantifying difficult intubation risk. |
| **Difficult Mask Ventilation (BONES Mnemonic)** | • **B: Beard** (impedes mask seal).<br>• **O: Obesity** ($\\text{BMI} > 30$).<br>• **N: No teeth** (edentulous causes sunken cheeks).<br>• **E: Elderly** ($> 55\\text{ years}$).<br>• **S: Snoring / OSA**. | Presence of $\ge 2$ BONES criteria predicts difficult bag-mask ventilation. |
| **Cormack-Lehane Laryngoscopy Grading** | • **Grade 1**: Complete visualization of vocal cords.<br>• **Grade 2**: Posterior commissure / arytenoids visible only.<br>• **Grade 3**: **Epiglottis visible only** (no vocal cords).<br>• **Grade 4**: Neither epiglottis nor vocal cords visible. | Grade 3 & 4 represent difficult intubation requiring video laryngoscopy or bougie assistance. |

---

## 2. ASA 2022 Difficult Airway & "Can\'t Intubate, Can\'t Oxygenate" (CICO) Algorithm

$$\\text{CICO Emergency}: \\text{Failed Tracheal Intubation} + \\text{Failed Supraglottic Airway (LMA)} + \\text{Failed Bag-Mask Ventilation}$$

- **Stepwise Cascade**:
  - **Plan A: Direct / Video Laryngoscopy**: Maximize 3 attempts; use Video Laryngoscope + Bougie/Stylet; optimize sniffing position / BURP maneuver.
  - **Plan B: Supraglottic Airway Device (SAD / LMA)**: Insert 2nd-generation LMA with gastric port (Max 2 attempts); verify ventilation with quantitative capnography (EtCO2).
  - **Plan C: Bag-Mask Ventilation (BMV)**: Two-person technique with VE-grip + Guedel Oral/Nasal Airways; reverse neuromuscular blockade if feasible (Sugammadex if Rocuronium).
  - **Plan D: Emergency Front of Neck Access (eFONA)**: **EMERGENCY SURGICAL CRICOTHYROIDOTOMY (Scalpel-Bougie-Tube 6.0 mm)**.

- **Emergency Front of Neck Access (eFONA) Technique**:
  1. Extend neck, palpate the **Cricothyroid Membrane** (between thyroid cartilage prominence and cricoid ring).
  2. Transverse scalpel blade incision through skin and cricothyroid membrane.
  3. Rotate scalpel $90^\\circ$ to open lumen; insert **Gum Elastic Bougie** into trachea.
  4. Railroad a **Cuffed $6.0\\text{ mm}$ Endotracheal Tube** over bougie; inflate cuff and confirm with $EtCO_2$.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old morbidly obese male (BMI 42 kg/m2) with a thick beard and short neck is scheduled for emergency exploratory laparotomy for bowel perforation. After rapid sequence induction with Propofol and Rocuronium, direct laryngoscopy is attempted. The anesthesiologist visualizes only the hard palate (Cormack-Lehane Grade 4). A second attempt with a video laryngoscope is unsuccessful due to copious secretions and severe pharyngeal edema. A second-generation laryngeal mask airway (LMA) is placed, but no chest rise is observed, and no end-tidal CO2 is detected. Two-person bag-valve-mask ventilation with an oral airway fails to deliver tidal volumes. The patient's SpO2 drops precipitously from 98% to 62%, and heart rate drops to 44 bpm.",
      question: "What airway crisis is occurring, and what is the immediate, life-saving next action according to the ASA Difficult Airway algorithm?",
      options: [
        "Can't Intubate, Can't Oxygenate (CICO) emergency; Perform immediate Emergency Surgical Cricothyroidotomy (eFONA)",
        "Laryngospasm; Administer IV Succinylcholine 1.5 mg/kg",
        "Bronchospasm; Administer inhaled Albuterol and IV Epinephrine",
        "Esophageal intubation; Re-attempt video laryngoscopy with a smaller tube"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is in a catastrophic 'Can't Intubate, Can't Oxygenate' (CICO) emergency following failed direct/video laryngoscopy (Plan A), failed supraglottic airway LMA (Plan B), and failed bag-mask ventilation (Plan C) with life-threatening desaturation (SpO2 62%) and hypoxic bradycardia. In accordance with the ASA 2022 Difficult Airway Algorithm, Plan D must be executed immediately: Emergency Front of Neck Access (eFONA) via surgical scalpel-bougie-tube cricothyroidotomy."
    }
  ]
};
