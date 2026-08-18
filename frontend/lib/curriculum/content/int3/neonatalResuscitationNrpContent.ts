/**
 * Internship Core Clinical Postings: Neonatal Resuscitation Program (NRP 2025 Algorithmic Sequences)
 * Authoritative neonatal resuscitation content derived from AHA/AAP NRP 8th Edition & 2025 Updates.
 * Mapped to NMC CBME Competencies: IN3.2, PE3.1, EM3.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEONATAL_RESUSCITATION_NRP_MODULE: PhysiologyLessonModule = {
  id: "int3-neonatal-resuscitation-nrp",
  unitCode: "IN3.2",
  title: "Neonatal Resuscitation (NRP 2025): The Golden Minute, MR SOPA Corrective Steps & 3:1 Compressions",
  competencies: ["IN3.2", "PE3.1", "EM3.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Neonatal Resuscitation Program (NRP 2025 Algorithmic Sequence)

Effective positive pressure ventilation within the first 60 seconds of birth is the single most critical intervention in neonatal resuscitation.

---

## 1. The NRP 2025 Chronological Resuscitation Timeline

$$\\begin{array}{lcccc}
\\hline
\\textbf{Timeline (Seconds)} & \\textbf{Clinical Assessment} & \\textbf{Mandated Procedural Intervention} & \\textbf{Target Oxygen / Device} \\\\
\\hline
\\textbf{0 - 30s (Birth)} & \\text{Term? Good tone? Breathing?} & \\text{Warm, dry, position head (sniffing),} & \\text{Radiant warmer; suction} \\\\
& & \\text{suction mouth then nose if secretions obstruct} & \\text{only if airway obstructed} \\\\
\\textbf{30 - 60s} & \\mathbf{\\text{Apnea, gasping, or HR } < 100\\text{ bpm}} & \\mathbf{\\text{Initiate Positive Pressure Ventilation (PPV)}} & \\mathbf{\\ge 35\\text{w: } 21\\% \\text{ (Room Air)}} \\\\
(\\textbf{The Golden Minute}) & & \\mathbf{\\text{at } 40-60\\text{ breaths/min; attach right wrist } SpO_2} & \\mathbf{< 35\\text{w: } 21-30\\% \\text{ } O_2} \\\\
\\textbf{60 - 90s} & \\text{No chest rise with PPV} & \\mathbf{\\text{Execute MR SOPA Ventilation Corrective Steps}} & \\text{Titrate } FiO_2 \\text{ to match} \\\\
& & \\text{before proceeding to chest compressions} & \\text{pre-ductal target chart} \\\\
\\textbf{90 - 150s} & \\mathbf{\\text{HR } < 60\\text{ bpm despite 30s PPV}} & \\mathbf{\\text{Start 3:1 Chest Compressions (2-thumb)}} & \\mathbf{100\\% \\text{ } O_2 \\text{ + secure airway}} \\\\
& \\mathbf{\\text{with good chest movement}} & \\mathbf{90\\text{ compressions} + 30\\text{ breaths (120 events/min)}} & (\\text{Intubate / LMA}) \\\\
\\textbf{> 150s} & \\text{HR } < 60\\text{ persists after 60s} & \\mathbf{\\text{Epinephrine: } 0.02\\text{ mg/kg (0.2 mL/kg of 1:10,000)}} & \\text{Normal Saline } 10\\text{ mL/kg IV} \\\\
& \\text{effective compressions + PPV} & \\mathbf{\\text{IV/IO via Umbilical Venous Catheter (UVC)}} & \\text{if hypovolemic / pale} \\\\
\\hline
\\end{array}$$

---

## 2. MR SOPA Ventilation Corrective Steps

$$\\begin{array}{lcccc}
\\hline
\\textbf{Letter} & \\textbf{Corrective Step} & \\textbf{Procedural Action} & \\textbf{Re-Evaluation Check} \\\\
\\hline
\\textbf{M} & \\textbf{Mask Adjustment} & \\text{Reapply mask to achieve a complete airtight seal around nose and mouth} & \\text{Check chest rise} \\\\
\\textbf{R} & \\textbf{Reposition Airway} & \\text{Adjust neck into neutral / sniffing position; avoid over-extension or flexion} & \\text{Check chest rise} \\\\
\\hline
\\textbf{S} & \\textbf{Suction Airway} & \\text{Suction mouth then nose with bulb syringe or suction catheter (80-100 mmHg)} & \\text{Check chest rise} \\\\
\\textbf{O} & \\textbf{Open Mouth} & \\text{Open mouth slightly and lift jaw forward during PPV delivery} & \\text{Check chest rise} \\\\
\\hline
\\textbf{P} & \\textbf{Pressure Increase} & \\text{Increase peak inspiratory pressure (PIP) in increments of 5-10 cm } H_2O & \\text{Check chest rise} \\\\
& & (\\text{max } 30-40\\text{ cm } H_2O\\text{) until chest movement is seen} & \\\\
\\hline
\\textbf{A} & \\textbf{Alternative Airway} & \\mathbf{\\text{Insert Endotracheal Tube (ETT) or Laryngeal Mask Airway (LMA)}} & \\mathbf{\\text{Confirm } EtCO_2 \\text{ + chest rise}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A male infant is born at 39 weeks gestation via emergent cesarean delivery for fetal bradycardia. At birth, the baby is limp, cyanotic, and apneic. The team dries, warms, stimulates, and positions the infant. At 30 seconds of life, the heart rate is 70 bpm and the infant remains apneic. Positive pressure ventilation (PPV) is initiated at 40-60 breaths/min with room air (21% O2). At 45 seconds, the assistant notes that the infant's chest is not moving with ventilations and the heart rate remains 68 bpm.",
      question: "What is the immediate next priority in the management of this neonate?",
      options: [
        "Perform the MR SOPA ventilation corrective steps (Mask adjustment, Reposition airway, Suction mouth/nose, Open mouth, Pressure increase, Alternative airway) to achieve bilateral chest rise before initiating chest compressions",
        "Immediately initiate 3:1 chest compressions without adjusting the airway",
        "Administer intravenous Epinephrine 0.02 mg/kg via the umbilical vein",
        "Administer 100% free-flow oxygen via blow-by tubing"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario represents the fundamental rule of neonatal resuscitation (NRP): (1) Ventilation Priority: Hypoventilation/asphyxia is almost always the cause of neonatal bradycardia; (2) Chest Movement Rule: Before starting chest compressions, the provider MUST verify that PPV is actively moving the chest; (3) MR SOPA: Because the chest is not moving, the operator must methodically execute the MR SOPA corrective steps (Mask, Reposition, Suction, Open mouth, Pressure increase, Alternative airway); (4) Compressions Timing: Chest compressions are indicated ONLY IF the heart rate remains <60 bpm AFTER at least 30 seconds of effective PPV that achieves visible chest movement."
    }
  ]
};
