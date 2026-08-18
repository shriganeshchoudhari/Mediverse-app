/**
 * Fracture Classification, Pediatric Physeal Injuries & Open Fractures Learning Content
 * Authoritative medical content derived from Rockwood and Green, Apley & Solomon, Campbell Orthopaedics, and USMLE Step 2 CK Orthopedics.
 * Mapped to NMC CBME Competencies: OR1.1, OR1.2, OR1.3, OR2.1, OR2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FRACTURE_CLASSIFICATION_PHYSEAL_MODULE: PhysiologyLessonModule = {
  id: "orth-fractures-physeal",
  unitCode: "OR1.1",
  title: "Orthopedics: Salter-Harris Physeal Fractures, Gustilo Open Fractures & Splinting Principles",
  competencies: ["OR1.1", "OR1.2", "OR1.3", "OR2.1", "OR2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "SKELETAL",
  markdownContent: `
# Orthopedics: Salter-Harris Physeal Fractures, Gustilo Open Fractures & Splinting Principles

Fracture management requires precise anatomical classification to preserve growth potential in pediatric growth plates and prevent osteomyelitis and amputation in high-energy open fractures.

---

## 1. Salter-Harris Classification of Pediatric Physeal Fractures (SALTR Mnemonic)

| Salter-Harris Type | Fracture Line Trajectory & Anatomy | Radiographic Sign & Growth Arrest Risk | Definitive Orthopedic Management |
| :--- | :--- | :--- | :--- |
| **Type I (S — Slipped / Straight across)** | Passes horizontally **straight through the physis (growth plate)** alone; separates epiphysis from metaphysis. | **Lowest risk of growth arrest ($<1\\%$)**. Normal X-ray or slight widening; localized physeal point tenderness. | Closed reduction $+$ immobilization in cast/splint for $3-4\\text{ weeks}$. |
| **Type II (A — Above physis)** | Passes through the physis and extends **upward into the Metaphysis**. | **Most common type ($75\\%$)**; low growth arrest risk. Classic **Thurston-Holland Fragment** (triangular metaphyseal bone spike). | Closed reduction $+$ cast immobilization. |
| **Type III (L — Lower / Below physis)** | Passes through the physis and exits **downward through the Epiphysis** into the joint space. | **Intra-articular fracture**; moderate risk of joint incongruity and angular deformity. | **Open Reduction and Internal Fixation (ORIF)** if displaced $>2\\text{ mm}$ to restore joint congruity. |
| **Type IV (T — Through / Two)** | Passes vertically through **all 3 zones: Metaphysis, Physis, AND Epiphysis**. | **High risk of premature physeal closure and limb length discrepancy**. | **Anatomical ORIF** with smooth pins/screws avoiding physeal cross-compression. |
| **Type V (R — Rammed / cRush)** | **Severe axial compression crushing the physis**. | **Worst prognosis ($>80\\%$ growth arrest / limb shortening)**; initial X-ray often appears deceptively normal. | Protected non-weight bearing cast; close longitudinal monitoring for angular deformity. |

---

## 2. Gustilo-Anderson Classification of Open Fractures

| Gustilo Type | Wound Size & Soft-Tissue Damage | Bone Injury & Contamination Level | Antibiotic & Surgical Debridement Protocol |
| :--- | :--- | :--- | :--- |
| **Type I** | Clean puncture wound **$< 1\\text{ cm}$** long (inside-out puncture). | Minimal muscle contusion; simple transverse/oblique fracture. | **1st-Generation Cephalosporin (IV Cefazolin $2\\text{ g}$)** q8h for 24h $+$ Tetanus toxoid. Urgent debridement in OR. |
| **Type II** | Laceration **$1\\text{ to } 10\\text{ cm}$** long. | Moderate soft-tissue damage; minimal periosteal stripping; moderate comminution. | **IV Cefazolin** for 48h $+$ Tetanus toxoid. Emergent formal OR irrigation and debridement. |
| **Type IIIA** | Extensive laceration **$> 10\\text{ cm}$** long. | Severe crushing, but **adequate periosteal soft-tissue coverage** of bone remains. | **IV Cefazolin $+$ Aminoglycoside (IV Gentamicin $5\\text{ mg/kg/day}$)** $+$ Penicillin G if farmyard/soil contamination (*C. perfringens* coverage). |
| **Type IIIB** | Extensive laceration with **extensive periosteal stripping and exposed bone**. | Severe contamination; **bone cannot be covered by local soft tissue**. | **Cefazolin $+$ Gentamicin $+$ Penicillin G**; Emergency skeletal stabilization (External Fixator) $+$ **Soft-tissue flap reconstruction**. |
| **Type IIIC** | Open fracture associated with **Arterial Injury requiring vascular repair** for limb salvage. | Ischemic limb regardless of wound size. | **Immediate Emergent Revascularization (Shunt / Saphenous Vein Graft) $+$ External Fixation** within 6 hours of warm ischemia. |

---

## 3. Principles of Emergency Fracture Splinting & Immobilization

- **Rule of Splinting**: Always immobilize the **Joint Above and the Joint Below** the fracture site.
- **Pre- and Post-Splinting Neurovascular Exam**: Mandatory assessment of distal pulses (Capillary refill, Dorsalis pedis, Posterior tibial, Radial), motor function, and sensation before and after applying any splint or reduction.
- **Avoid Circumferential Casting in Acute Trauma**: Fresh acute fractures swell rapidly; circumferential plaster casts cause iatrogenic **Acute Compartment Syndrome**. Always use a non-circumferential **Backslab / Splint** during the initial $48-72\\text{ hours}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 9-year-old boy falls from a skateboard onto his outstretched hand. Radiographs of the distal radius demonstrate a transverse fracture line through the physis that exits proximally through the dorsal metaphysis with a distinct triangular wedge of metaphyseal bone (Thurston-Holland sign). The articular surface and epiphysis are completely uninvolved.",
      question: "Which Salter-Harris fracture type is present, and what is the expected long-term prognosis for bone growth?",
      options: [
        "Salter-Harris Type II; Good prognosis with low risk of premature physeal growth arrest",
        "Salter-Harris Type I; Poor prognosis with high risk of limb length discrepancy",
        "Salter-Harris Type III; Requires mandatory open surgical reconstruction of the articular surface",
        "Salter-Harris Type IV; High risk of complete physeal closure and angular deformity"
      ],
      correctAnswerIndex: 0,
      explanation: "A fracture extending through the physis and exiting into the metaphysis represents a Salter-Harris Type II physeal fracture (A - Above physis). The pathognomonic triangular metaphyseal fragment is known as the Thurston-Holland sign. Type II fractures are the most common physeal injuries (accounting for ~75%) and carry a favorable prognosis with minimal risk of premature growth arrest because the germinal layer of the physis remains intact."
    }
  ]
};
