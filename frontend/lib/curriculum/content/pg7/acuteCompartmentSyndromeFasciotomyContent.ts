/**
 * Postgraduate Advanced Orthopedics: Acute Compartment Syndrome & Fasciotomy
 * Authoritative orthopedic trauma content derived from McQueen/Court-Brown Compartment Pressure Guidelines, Whitesides Technique.
 * Mapped to NMC PG CBME Competencies: PG7.3, OR3.1, OR3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE: PhysiologyLessonModule = {
  id: "pg7-acute-compartment-syndrome-fasciotomy",
  unitCode: "PG7.3",
  title: "Acute Compartment Syndrome (ACS): Delta Pressure Criteria & Emergent Dual-Incision Fasciotomies",
  competencies: ["PG7.3", "OR3.1", "OR3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Acute Compartment Syndrome (ACS) & Emergent Decompression Protocols

Acute Compartment Syndrome occurs when tissue pressure within an enclosed fascial space exceeds capillary perfusion pressure, leading to muscle ischemia and irreversible necrosis after 6-8 hours.

---

## 1. Clinical Diagnostic Progression & Compartment Pressure Manometry

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Sign / Parameter} & \\textbf{Clinical Feature / Criterion} & \\textbf{Diagnostic Sensitivity} & \\textbf{Physiological Basis} \\\\
\\hline
\\textbf{Earliest Sign} & \\mathbf{\\text{Pain out of proportion to injury}} & \\mathbf{\\text{Most sensitive early indicator}} & \\text{Ischemic stimulation of muscle spindle nociceptors} \\\\
\\textbf{Pathognomonic Sign} & \\mathbf{\\text{Severe pain on passive stretch}} & \\mathbf{\\text{Hallmark of active muscle ischemia}} & \\text{Tension on ischemic, edematous muscle fibers} \\\\
\\textbf{Neurological} & \\text{Paresthesia / Hypoesthesia in nerve distribution} & \\text{Early ischemic nerve dysfunction} & \\text{Deep peroneal (1st web space) / Tibial (plantar)} \\\\
\\textbf{Late Signs (Do NOT wait!)} & \\text{Paralysis, Pallor, Pulselessness} & \\text{Late / Irreversible necrosis} & \\text{Complete microvascular and axonal infarction} \\\\
\\textbf{Delta Pressure (}\\Delta P\\textbf{)} & \\mathbf{\\Delta P = \\text{Diastolic BP} - \\text{Compartment Pressure} \\le 30} & \\mathbf{\\text{Definitive surgical indication}} & \\text{Capillary collapse pressure threshold} \\\\
\\hline
\\end{array}$$

---

## 2. Anatomical Dual-Incision 4-Compartment Leg Fasciotomy

- **Anterolateral Incision**:
  - Placed midway between fibular shaft and anterior tibial crest.
  - Decompresses:
    - **Anterior Compartment**: Deep peroneal nerve, anterior tibial artery, tibialis anterior, EHL, EDL.
    - **Lateral Compartment**: Superficial peroneal nerve, peroneus longus, peroneus brevis.
- **Posteromedial Incision**:
  - Placed $2\\text{ cm}$ posterior to the posterior border of the tibia.
  - Decompresses:
    - **Superficial Posterior Compartment**: Gastrocnemius, soleus, plantaris.
    - **Deep Posterior Compartment**: Tibial nerve, posterior tibial vessels, flexor hallucis longus, flexor digitorum longus, tibialis posterior (releases soleus bridge from tibia).
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old male is admitted following a closed, displaced midshaft tibia fracture treated with a posterior splint. Six hours post-injury, he develops escalating, excruciating leg pain unresponsive to multiple doses of IV morphine. On examination, the anterior and deep posterior leg compartments are tense, firm ('woody'), and exquisitely tender. Passive plantarflexion of the great toe elicits severe pain in the anterior compartment, and passive dorsiflexion causes severe pain in the deep posterior compartment. Sensation is decreased in the first dorsal web space. Vital signs: BP 110/60 mmHg (Diastolic BP = 60 mmHg). Needle manometry reveals an intracompartmental pressure of 38 mmHg in the anterior compartment.",
      question: "What is the calculated Delta pressure (Delta P), what is the clinical diagnosis, and what is the definitive emergent surgical management?",
      options: [
        "Acute Compartment Syndrome (ACS) with a Delta pressure (Delta P) of 22 mmHg (Diastolic BP 60 mmHg - Compartment Pressure 38 mmHg = 22 mmHg, which is <=30 mmHg, meeting the definitive surgical threshold); immediately perform an emergent two-incision, four-compartment leg fasciotomy (anterolateral incision decompressing the anterior and lateral compartments; posteromedial incision decompressing the superficial and deep posterior compartments)",
        "Deep Vein Thrombosis; administer therapeutic low-molecular-weight heparin and elevate the leg",
        "Normal post-fracture swelling; increase IV opioid analgesia and recheck in 24 hours",
        "Complex Regional Pain Syndrome; start oral Gabapentin and apply ice packs"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates acute compartment syndrome: (1) Delta Pressure: Delta P = Diastolic BP (60) - Compartment Pressure (38) = 22 mmHg. A Delta P <=30 mmHg confirms tissue hypoperfusion requiring emergency decompression; (2) Clinical Hallmarks: Pain out of proportion and pain with passive muscle stretch are the earliest sensitive signs; (3) Definitive Fasciotomy: Emergent dual-incision 4-compartment fasciotomy is mandatory to prevent muscle infarction, Volkmann contracture, and rhabdomyolysis."
    }
  ]
};
