/**
 * Clinical Orthopedics Advanced: Acute Compartment Syndrome & Fasciotomy Protocols
 * Authoritative orthopedic trauma content derived from Rockwood & Green's (9th ed.), Campbell's (14th ed.).
 * Mapped to NMC CBME Competencies: OR1.1, OR1.2, MD45.1, SU43.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE: PhysiologyLessonModule = {
  id: "orthopedics-adv-compartment-syndrome",
  unitCode: "OR1.1",
  title: "Acute Compartment Syndrome (ACS): The 6 'P's, Delta Pressure & 4-Compartment Leg Fasciotomy",
  competencies: ["OR1.1", "OR1.2", "MD45.1", "SU43.1"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Acute Compartment Syndrome: Pathophysiology, Delta Pressure & Fasciotomy

Acute Compartment Syndrome (ACS) occurs when tissue hydrostatic pressure within a closed osteofascial compartment exceeds capillary perfusion pressure, leading to muscle and nerve ischemia.

---

## 1. The 6 'P's & Diagnostic Delta Pressure Calculation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cardinal 'P'} & \\textbf{Physiologic Mechanism} & \\textbf{Temporal Onset} & \\textbf{Clinical Diagnostic Value} \\\\
\\hline
\\textbf{1. Pain Out of Proportion} & \\text{Ischemic stimulation of deep muscle nociceptors} & \\mathbf{\\text{Earliest (\u003c2-4 hours)}} & \\mathbf{\\text{Most sensitive clinical indicator;}} \\\\
& \\text{unrelieved by standard opioid analgesics} & & \\text{demands immediate pressure testing} \\\\
\\textbf{2. Pain on Passive Stretch} & \\text{Tension on already ischemic, edematous muscle fibers} & \\mathbf{\\text{Early (\u003c2-4 hours)}} & \\mathbf{\\text{Most sensitive physical sign on exam}} \\\\
\\textbf{3. Paresthesias} & \\text{Ischemic hypoxia of sensory nerves traversing compartment} & \\text{Intermediate (4-6h)} & \\text{Deep peroneal (1st webspace), tibial (sole)} \\\\
\\textbf{4. Pallor / Poikilothermia} & \\text{Severe impairment of microvascular capillary bed filling} & \\text{Late (6-8h)} & \\text{Indicates severe, advanced ischemia} \\\\
\\textbf{5. Paralysis} & \\text{Irreversible motor axon necrosis and myocyte death} & \\text{Very Late (\u003e8h)} & \\text{Permanent deficit / Volkmann contracture} \\\\
\\textbf{6. Pulselessness} & \\text{External compression or direct injury to major artery} & \\mathbf{\\text{Extremely Late / Rare}} & \\mathbf{\\text{DO NOT wait for pulselessness to diagnose!}} \\\\
\\hline
\\end{array}$$

- **Delta Pressure ($\\Delta P$) Formula**:
  $$\\mathbf{\\Delta P = \\text{Diastolic Blood Pressure} - \\text{Intracompartmental Pressure}}$$
  - An absolute compartment pressure $>30\\text{ mmHg}$ OR a **Delta Pressure $\\Delta P \\le 30\\text{ mmHg}$** is the diagnostic gold standard indicating the need for immediate surgical decompression.

---

## 2. Dual-Incision 4-Compartment Leg Fasciotomy

$$\\begin{array}{lccc}
\\hline
\\textbf{Surgical Incision} & \\textbf{Decompressed Compartments} & \\textbf{Key Anatomical Structures at Risk} & \\textbf{Operative Technique} \\\\
\\hline
\\textbf{Anterolateral Incision} & \\mathbf{\\text{Anterior Compartment}} & \\text{Superficial Peroneal Nerve} & \\text{Longitudinal incision midway between} \\\\
(2\\text{ cm anterior to fibula}) & + \\mathbf{\\text{Lateral Compartment}} & (\\text{exits deep fascia } \\approx 10\\text{ cm above ankle}) & \\text{tibial crest and fibula; transverse H-fasciotomy} \\\\
\\textbf{Posteromedial Incision} & \\mathbf{\\text{Superficial Posterior}} & \\text{Saphenous Vein and Nerve} & \\text{Longitudinal incision } 2\\text{ cm posterior to} \\\\
(2\\text{ cm posterior to tibia}) & + \\mathbf{\\text{Deep Posterior}} & + \\text{ Tibial nerve \u0026 posterior tibial vessels} & \\text{posterior tibial border; detach soleus bridge} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male motorcyclist is struck by a vehicle and sustains a closed, displaced midshaft tibia and fibula fracture. In the emergency department, a long leg splint is applied. Four hours later, he complains of severe, excruciating pain in his right calf that is completely unresponsive to multiple doses of intravenous Morphine and Fentanyl. On examination, the anterior and lateral calf compartments are tense and 'woody' on palpation. Passive plantarflexion of the great toe elicits agonizing pain. Sensation to light touch is diminished in the dorsal first webspace of the foot. Dorsalis pedis and posterior tibial pulses are 2+ palpable. Blood pressure is 110/70 mmHg. Direct needle intracompartmental manometry of the anterior compartment reveals a pressure of 48 mmHg.",
      question: "Calculate the Delta Pressure (ΔP), establish the diagnosis, and state the mandatory emergency surgical intervention.",
      options: [
        "Delta Pressure = 22 mmHg (<=30 mmHg), confirming Acute Compartment Syndrome; proceed immediately with emergent dual-incision 4-compartment leg fasciotomy",
        "Delta Pressure = 62 mmHg, ruling out compartment syndrome; increase intravenous opioids and elevate the limb above heart level",
        "Deep Vein Thrombosis; initiate therapeutic low molecular weight heparin anticoagulation",
        "Tight cast syndrome alone; split the splint and re-evaluate in 24 hours without surgery"
      ],
      correctAnswerIndex: 0,
      explanation: "1. Delta Pressure Calculation: Delta P = Diastolic BP - Compartment Pressure = 70 mmHg - 48 mmHg = 22 mmHg. A Delta P <=30 mmHg (or absolute pressure >30 mmHg) is diagnostic of Acute Compartment Syndrome (ACS). 2. Clinical Hallmarks: The patient exhibits the earliest and most reliable signs of ACS: excruciating pain out of proportion to the injury, intense pain on passive stretch of the ischemic muscle (toe extension/plantarflexion), and paresthesia in the deep peroneal nerve distribution (1st webspace). Normal distal pulses are typically preserved until irreversible necrosis occurs and must never be used to rule out compartment syndrome. 3. Surgical Mandate: Immediate emergent dual-incision 4-compartment fasciotomy (decompression of anterior, lateral, superficial posterior, and deep posterior compartments) is required within 6 hours to prevent irreversible muscle infarction, Volkmann contracture, and rhabdomyolysis."
    }
  ]
};
