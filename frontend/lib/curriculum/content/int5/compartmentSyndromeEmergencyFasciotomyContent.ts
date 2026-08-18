/**
 * Internship Core Clinical Postings: Acute Extremity Compartment Syndrome & Emergency Fasciotomy
 * Authoritative orthopedic trauma content derived from Rockwood and Green's Fractures in Adults, Sabiston Surgery.
 * Mapped to NMC CBME Competencies: IN5.3, OR3.1, EM3.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const COMPARTMENT_SYNDROME_EMERGENCY_FASCIOTOMY_MODULE: PhysiologyLessonModule = {
  id: "int5-compartment-syndrome-emergency-fasciotomy",
  unitCode: "IN5.3",
  title: "Acute Extremity Compartment Syndrome: The 6 Ps, Stryker Needle Manometry (Delta P <= 30 mmHg) & Emergent Fasciotomy",
  competencies: ["IN5.3", "OR3.1", "EM3.3"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Acute Extremity Compartment Syndrome & Emergent Fasciotomy

Elevated osteofascial compartment pressure compromises capillary perfusion, producing rapid ischemic neuromuscular necrosis unless decompressed by emergent surgical fasciotomy.

---

## 1. The 6 Ps of Acute Compartment Syndrome

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Sign} & \\textbf{Physiological Manifestation} & \\textbf{Diagnostic Reliability} \\\\
\\hline
\\textbf{1. Pain Out of Proportion} & \\text{Severe, unremitting, crescendo pain} & \\mathbf{\\text{Earliest and most sensitive clinical sign}} \\\\
\\textbf{2. Pain with Passive Stretch} & \\mathbf{\\text{Exquisite pain elicited by passive muscular elongation}} & \\mathbf{\\text{Most reliable early physical examination finding}} \\\\
\\textbf{3. Paresthesias} & \\text{Hypoesthesia in cutaneous nerve sensory distribution} & \\text{Early sign of nerve ischemia (sensory loss first)} \\\\
\\textbf{4. Pallor} & \\text{Skin pallor due to microvascular capillary collapse} & \\text{Variable; capillary refill may remain normal} \\\\
\\textbf{5. Poikilothermia} & \\text{Cool extremity distal to the ischemic compartment} & \\text{Reflects microvascular hypoperfusion} \\\\
\\textbf{6. Pulselessness} & \\mathbf{\\text{Loss of distal arterial pulsations (radial / dorsalis pedis)}} & \\mathbf{\\text{VERY LATE FINDING; indicates irreversible necrosis}} \\\\
\\hline
\\end{array}$$

---

## 2. Compartment Pressure Manometry & Diagnostic Delta Pressure ($\\Delta P$)

$$\\mathbf{\\text{Delta Pressure (}\\Delta P\\text{)}} = \\mathbf{\\text{Diastolic Blood Pressure (DBP)} - \\text{Compartment Pressure (}P_{\\text{comp}}\\text{)}} \\le \\mathbf{30\\text{ mmHg}}$$

- **Diagnostic Thresholds**:
  - Absolute Compartment Pressure ($P_{\\text{comp}}$) $> 30\\text{ mmHg}$.
  - **Delta Pressure ($\\Delta P$) $\\le 30\\text{ mmHg}$**: Gold-standard objective threshold confirming inadequate microvascular perfusion and mandating immediate surgical decompression.

---

## 3. Lower Leg Two-Incision Four-Compartment Fasciotomy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Surgical Incision} & \\textbf{Decompressed Osteofascial Compartments} & \\textbf{Key Structures at Risk} \\\\
\\hline
\\textbf{Anterolateral Incision} & \\mathbf{\\text{1. Anterior Compartment}} & \\text{Superficial peroneal nerve (crosses} \\\\
(\\text{midway between tibia and fibula}) & \\mathbf{\\text{2. Lateral Compartment}} & \\text{lateral compartment in distal 1/3 of leg)} \\\\
\\textbf{Posteromedial Incision} & \\mathbf{\\text{3. Superficial Posterior Compartment}} & \\text{Great saphenous vein and saphenous nerve} \\\\
(2\\text{ cm posterior to medial tibial border}) & \\mathbf{\\text{4. Deep Posterior Compartment}} & \\text{(retracted anteriorly)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male is brought to the emergency department following a motorcycle collision resulting in a closed, displaced mid-shaft tibia-fibula fracture. A long-leg posterior splint is applied. Four hours later, he complains of excruciating, progressive right calf and shin pain that is completely unresponsive to multiple doses of intravenous fentanyl. On examination, the anterior and lateral compartments of his leg are tense and 'woody'. Passive plantarflexion of his great toe and ankle produces agonizing pain in the anterior calf. Distal dorsalis pedis pulses are 2+ and intact. His blood pressure is 118/74 mmHg (diastolic BP = 74 mmHg). Stryker needle manometry of the anterior compartment reveals an intracompartmental pressure of 48 mmHg.",
      question: "What is the diagnosis, the calculated Delta pressure, and the mandatory emergency surgical intervention?",
      options: [
        "Acute Compartment Syndrome; Delta Pressure = DBP (74) - Pcomp (48) = 26 mmHg (which is <=30 mmHg, confirming tissue ischemia); presence of distal pulses does NOT rule out compartment syndrome; the patient requires immediate split-thickness cast/splint removal and emergent two-incision four-compartment fasciotomy of the lower leg",
        "Normal postoperative pain; increase intravenous opioid infusion and elevate the leg above the heart",
        "Deep Vein Thrombosis; initiate therapeutic low molecular weight heparin immediately without surgery",
        "Superficial muscle strain; discharge home on crutches and oral NSAIDs"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates acute compartment syndrome of the lower extremity: (1) Clinical Presentation: Pain out of proportion to injury and pain on passive muscular stretch are the classic earliest signs; (2) Normal Distal Pulses: Intact distal arterial pulses do NOT exclude compartment syndrome because systolic pressure typically exceeds intracompartmental pressure; (3) Delta Pressure Calculation: Delta P = Diastolic BP (74) - Compartment Pressure (48) = 26 mmHg. A Delta P <=30 mmHg confirms critical microvascular hypoperfusion; (4) Mandatory Action: Emergent two-incision four-compartment lower leg fasciotomy prevents irreversible ischemic neuromuscular necrosis and amputation."
    }
  ]
};
