/**
 * Clinical Orthopedics Advanced: Open Fractures & Mangled Extremity Protocols
 * Authoritative orthopedic trauma content derived from Rockwood & Green's (9th ed.), Orthopaedic Trauma Association (OTA).
 * Mapped to NMC CBME Competencies: OR3.1, OR3.2, MD45.2, SU43.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OPEN_FRACTURE_GUSTILO_ANDERSON_MODULE: PhysiologyLessonModule = {
  id: "orthopedics-adv-open-fractures",
  unitCode: "OR3.1",
  title: "Open Fractures: Gustilo-Anderson Classification, Antibiotic Regimens & Limb Salvage Protocols",
  competencies: ["OR3.1", "OR3.2", "MD45.2", "SU43.2"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Open Fractures: Gustilo-Anderson Classification & Emergency Triage

Open fractures represent orthopedic emergencies where broken bone communicates directly with the external environment, carrying a high risk of osteomyelitis and limb loss.

---

## 1. Gustilo-Anderson Open Fracture Classification Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Gustilo Type} & \\textbf{Wound Size \u0026 Soft Tissue Energy} & \\textbf{Periosteal Stripping \u0026 Fracture Pattern} & \\textbf{Infection Risk} & \\textbf{Antimicrobial Prophylaxis} \\\\
\\hline
\\textbf{Type I} & \\mathbf{< 1\\text{ cm}} & \\text{Minimal; simple transverse / oblique} & 0 - 2\\% & \\mathbf{\\text{1st-Gen Cephalosporin}} \\\\
& (\\text{clean puncture from inside-out}) & \\text{fracture without crushing} & & (\\text{Cefazolin } 2\\text{ g IV q8h } \\times 24\\text{h}) \\\\
\\textbf{Type II} & \\mathbf{1 - 10\\text{ cm}} & \\text{Moderate; minimal periosteal stripping;} & 2 - 7\\% & \\mathbf{\\text{1st-Gen Cephalosporin}} \\\\
& (\\text{moderate energy soft tissue damage}) & \\text{mild comminution} & & (\\text{Cefazolin } 2\\text{ g IV q8h } \\times 24\\text{h}) \\\\
\\textbf{Type IIIa} & \\mathbf{> 10\\text{ cm}} & \\mathbf{\\text{High-energy comminution;}} & 10 - 25\\% & \\mathbf{\\text{Cefazolin } + \\text{Aminoglycoside}} \\\\
& (\\text{extensive high-energy soft tissue tearing}) & \\mathbf{\\text{ADEQUATE soft tissue coverage of bone}} & & (\\text{Gentamicin } 5\\text{ mg/kg IV}) \\\\
\\textbf{Type IIIb} & \\mathbf{> 10\\text{ cm}} & \\mathbf{\\text{Extensive periosteal stripping \u0026 bone loss;}} & 25 - 50\\% & \\mathbf{\\text{Cefazolin } + \\text{Gentamicin}} \\\\
& (\\text{severe contamination, soft tissue defect}) & \\mathbf{\\text{REQUIRES plastic rotational / free flap}} & & + \\mathbf{\\text{Penicillin G (if barnyard/soil)}} \\\\
\\textbf{Type IIIc} & \\mathbf{\\text{Any open fracture}} & \\mathbf{\\text{Associated with ARTERIAL INJURY}} & > 50\\% & \\mathbf{\\text{Cefazolin } + \\text{Gentamicin}} \\\\
& (\\text{regardless of wound dimension}) & \\mathbf{\\text{requiring surgical vascular repair}} & (\\text{amputation risk}) & + \\text{ Emergency Revascularization} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Resuscitation & Surgical Debridement Protocols

- **Immediate Emergency Department Actions**:
  1. Administer **Intravenous Antibiotics within 1 hour** of presentation (every hour of delay increases osteomyelitis risk).
  2. Remove gross foreign contaminants, irrigate with sterile saline, and apply a **sterile saline-soaked occlusive dressing** (DO NOT repeatedly uncover or probe wound).
  3. Administer **Tetanus Prophylaxis** (Toxoid $\\pm$ Tetanus Immune Globulin TIG based on vaccination history).
  4. Splint the fractured limb in anatomical alignment and document distal neurovascular status.
- **Operative Principles**:
  - Urgent operative **Irrigation & Debridement (I&D)** in the operating room with low-pressure pulsatile lavage (minimum $3\\text{ L}$ for Type I, $6\\text{ L}$ for Type II, $9\\text{ L}$ for Type III).
  - Skeletal stabilization via **External Fixator (Ex-Fix)** for contaminated/unstable Type III fractures, followed by definitive internal fixation once soft tissues are clean.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old agricultural worker is brought to the trauma center after his lower leg is caught in a tractor power take-off on a farm. He sustained a high-energy open fracture of the tibia and fibula. On examination, there is a 14 cm laceration over the anterior shin heavily contaminated with soil and manure, with extensive periosteal stripping and 8 cm of bare cortical bone exposed that cannot be covered by local soft tissue. Distal dorsalis pedis and posterior tibial pulses are 2+ palpable with intact sensation in the foot.",
      question: "According to the Gustilo-Anderson classification, what is the fracture grade, and what is the mandatory immediate antibiotic regimen?",
      options: [
        "Gustilo-Anderson Type IIIb Open Fracture; administer IV Cefazolin (1st-gen cephalosporin) + IV Gentamicin (aminoglycoside) + IV Penicillin G (for Clostridium coverage in soil contamination)",
        "Gustilo-Anderson Type II Open Fracture; administer oral Ciprofloxacin alone",
        "Gustilo-Anderson Type IIIc Open Fracture; perform immediate primary amputation",
        "Gustilo-Anderson Type I Open Fracture; administer topical Bacitracin ointment"
      ],
      correctAnswerIndex: 0,
      explanation: "1. Gustilo-Anderson Staging: A high-energy open fracture with a wound >10 cm, severe contamination, extensive periosteal stripping, and soft tissue loss leaving bare bone that requires local or free flap coverage is classified as a Gustilo-Anderson Type IIIb open fracture (it is NOT Type IIIc because distal pulses are intact and there is no arterial injury requiring vascular repair). 2. Antibiotic Regimen: High-grade open fractures (Type III) mandate dual gram-positive and gram-negative coverage with a 1st-generation cephalosporin (Cefazolin) plus an aminoglycoside (Gentamicin). Because the injury occurred in a farm/soil/barnyard environment, high-dose IV Penicillin G must be added for mandatory anaerobic coverage against Clostridium perfringens (gas gangrene)."
    }
  ]
};
