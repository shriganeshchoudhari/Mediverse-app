/**
 * Internship Core Clinical Postings: Pediatric Advanced Life Support (PALS Bradycardia, Shock & Arrest)
 * Authoritative pediatric emergency content derived from AHA PALS Guidelines 2025, Nelson Pediatrics.
 * Mapped to NMC CBME Competencies: IN3.3, PE3.2, EM3.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_ADVANCED_LIFE_SUPPORT_PALS_MODULE: PhysiologyLessonModule = {
  id: "int3-pediatric-advanced-life-support-pals",
  unitCode: "IN3.3",
  title: "Pediatric Advanced Life Support (PALS 2025): Symptomatic Bradycardia (HR <60 CPR), Defibrillation & Shock Resuscitation",
  competencies: ["IN3.3", "PE3.2", "EM3.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Pediatric Advanced Life Support (PALS 2025 Guidelines)

In pediatric emergencies, respiratory failure and hypoxia drive cardiac collapse; early ventilation and weight-based fluid/drug dosing restore cardiopulmonary stability.

---

## 1. Pediatric Symptomatic Bradycardia with Poor Perfusion

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Assessment} & \\textbf{Heart Rate Threshold} & \\textbf{Primary Emergency Action} & \\textbf{Pharmacological Support} \\\\
\\hline
\\textbf{Pediatric Bradycardia} & \\mathbf{\\text{HR } < 60\\text{ bpm with signs}} & \\mathbf{\\text{1. Maintain airway, oxygenate, ventilate}} & \\mathbf{\\text{Epinephrine: } 0.01\\text{ mg/kg (0.1 mL/kg}} \\\\
\\textbf{with Poor Perfusion} & \\mathbf{\\text{of shock (altered mental status,}} & \\mathbf{\\text{2. START CHEST COMPRESSIONS if HR } < 60} & \\mathbf{\\text{of 1:10,000) IV/IO q3-5 min}} \\\\
& \\mathbf{\\text{weak pulses, capillary refill } > 2\\text{s)}} & \\mathbf{\\text{persists despite oxygenation/ventilation}} & \\text{Atropine: } 0.02\\text{ mg/kg only for vagal/AV block} \\\\
\\hline
\\end{array}$$

---

## 2. Pediatric Cardiac Arrest & Defibrillation Energy Dosing

$$\\begin{array}{lcccc}
\\hline
\\textbf{Rhythm Category} & \\textbf{Defibrillation Energy} & \\textbf{Epinephrine Dosing} & \\textbf{Antiarrhythmic Dosing} \\\\
\\hline
\\textbf{Shockable: VF / pVT} & \\mathbf{\\text{1st Shock: } 2\\text{ J/kg}} & \\mathbf{0.01\\text{ mg/kg (1:10,000)}} & \\mathbf{\\text{Amiodarone: } 5\\text{ mg/kg IV/IO bolus}} \\\\
& \\mathbf{\\text{2nd Shock: } 4\\text{ J/kg}} & \\text{administered after} & \\text{(repeat up to 2 times, max } 15\\text{ mg/kg)} \\\\
& \\mathbf{\\text{Subsequent: } \\ge 4\\text{ J/kg (max } 10\\text{ J/kg)}} & \\text{2nd shock} & \\text{or Lidocaine } 1\\text{ mg/kg load} \\\\
\\textbf{Non-Shockable: PEA / Asystole} & \\mathbf{\\text{NO DEFIBRILLATION; CPR}} & \\mathbf{0.01\\text{ mg/kg stat}} & \\text{None; treat reversible causes (Hs \u0026 Ts)} \\\\
\\hline
\\end{array}$$

---

## 3. Pediatric Shock & Isotonic Fluid Boluses

$$\\begin{array}{lcccc}
\\hline
\\textbf{Shock Subtype} & \\textbf{Fluid Bolus Volume \u0026 Rate} & \\textbf{First-Line Inotrope / Vasopressor} & \\textbf{Fluid Overload Warning Signs} \\\\
\\hline
\\textbf{Hypovolemic Shock} & \\mathbf{20\\text{ mL/kg isotonic crystalloid}} & \\text{Repeat boluses up to } 40-60\\text{ mL/kg;} & \\text{New hepatomegaly (liver edge descent),} \\\\
& \\text{(Normal Saline or LR) over 10-20 min} & \\text{blood products if hemorrhagic} & \\text{pulmonary rales / crackles, worsening work of breathing} \\\\
\\textbf{Septic \"Cold\" Shock} & 10-20\\text{ mL/kg boluses with careful re-eval} & \\mathbf{\\text{Epinephrine infusion (0.05-0.3 } \\mu\\text{g/kg/min)}} & \\mathbf{\\text{Stop fluid boluses immediately if hepatomegaly}} \\\\
\\textbf{Septic \"Warm\" Shock} & 10-20\\text{ mL/kg boluses with careful re-eval} & \\mathbf{\\text{Norepinephrine infusion (0.05-0.3 } \\mu\\text{g/kg/min)}} & \\mathbf{\\text{or rales develop; start vasoactive infusion}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 3-year-old female (weight 15 kg) with severe dehydration from infectious gastroenteritis is brought to the resuscitation bay. She is lethargic with mottling, delayed capillary refill (4 seconds), weak thready brachial pulses, and a heart rate of 48 bpm. The respiratory rate is 8 breaths/min with shallow chest expansion. Bag-mask ventilation with 100% O2 is initiated immediately. After 30 seconds of effective oxygenation and assisted ventilation, the pulse check reveals a persistent heart rate of 52 bpm with poor peripheral perfusion.",
      question: "What is the mandatory next step in the resuscitation of this pediatric patient?",
      options: [
        "Immediately initiate chest compressions at a 15:2 ratio (or 30:2 if single rescuer) because the heart rate remains <60 bpm with poor perfusion despite adequate oxygenation and ventilation",
        "Administer IV Atropine 0.5 mg bolus and observe",
        "Deliver an unsynchronized 30 J defibrillator shock",
        "Apply a non-rebreather face mask and wait 5 minutes"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates the classic PALS pediatric bradycardia algorithm: (1) Pediatric Bradycardia Mechanism: In children, bradycardia with poor perfusion is almost always secondary to severe hypoxia/respiratory failure; (2) Airway/Ventilation First: Initial management focuses on opening the airway and bag-mask ventilation with high-flow oxygen; (3) Chest Compressions Threshold: If the heart rate remains <60 bpm with signs of poor perfusion DESPITE at least 30 seconds of effective oxygenation and ventilation, chest compressions MUST be initiated immediately; (4) Epinephrine: If bradycardia persists despite CPR and ventilation, Epinephrine (0.01 mg/kg IV/IO = 0.15 mg) is administered."
    }
  ]
};
