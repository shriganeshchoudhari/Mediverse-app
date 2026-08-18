/**
 * Postgraduate Advanced Orthopedics: Open Fractures & Mangled Extremity Scoring
 * Authoritative orthopedic trauma content derived from Gustilo-Anderson Classification, MESS Scoring System, OTA-OFC Guidelines.
 * Mapped to NMC PG CBME Competencies: PG7.2, OR2.1, OR2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE: PhysiologyLessonModule = {
  id: "pg7-open-fracture-mangled-extremity",
  unitCode: "PG7.2",
  title: "High-Energy Open Fractures: Gustilo-Anderson Classification, MESS Limb Salvage & Antibiotic Protocols",
  competencies: ["PG7.2", "OR2.1", "OR2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# High-Energy Open Fractures, Gustilo-Anderson & MESS Limb Salvage

Open fractures are surgical emergencies requiring rapid antibiotic prophylaxis, staged operative debridement, and objective limb salvage scoring.

---

## 1. Gustilo-Anderson Classification & Antibiotic Protocols

$$\\begin{array}{lcccc}
\\hline
\\textbf{Gustilo Grade} & \\textbf{Wound Size \\& Soft Tissue Pathology} & \\textbf{Infection Rate} & \\textbf{Antibiotic Prophylaxis Protocol} \\\\
\\hline
\\textbf{Type I} & \\text{Puncture } < 1\\text{ cm, clean, minimal crush} & 0-2\\% & \\mathbf{\\text{1st-Gen Cephalosporin (Cefazolin 2 g IV Q8H)}} \\\\
\\textbf{Type II} & \\text{Laceration } 1-10\\text{ cm, moderate crush/stripping} & 2-7\\% & \\mathbf{\\text{Cefazolin 2 g IV Q8H}} \\\\
\\textbf{Type IIIA} & \\mathbf{\\text{Crush } > 10\\text{ cm; adequate periosteal coverage}} & 10-15\\% & \\mathbf{\\text{Cefazolin + Aminoglycoside (Gentamicin 5 mg/kg)}} \\\\
\\textbf{Type IIIB} & \\mathbf{\\text{Extensive periosteal loss, bone exposed (needs flap)}} & 20-30\\% & \\mathbf{\\text{Cefazolin + Gentamicin (add Penicillin G for soil)}} \\\\
\\textbf{Type IIIC} & \\mathbf{\\text{Open fracture with arterial injury needing repair}} & 25-50\\% & \\mathbf{\\text{Cefazolin + Gentamicin + Emergency Vascular Shunt}} \\\\
\\hline
\\end{array}$$

---

## 2. Mangled Extremity Severity Score (MESS) & Salvage Decision Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Variable} & \\textbf{Clinical Criteria} & \\textbf{Score Points} \\\\
\\hline
\\textbf{1. Skeletal / Soft Tissue} & \\text{Low energy (stab, simple fx) / Medium (open fx, crush) / High (close-range GSW) / Massive} & 1 / 2 / 3 / 4 \\\\
\\textbf{2. Limb Ischemia} & \\text{Pulse reduced / Absent pulse, capillary refill >3s / Cool, paralyzed, insensate (}\\times 2\\text{ if }>6\\text{h)} & 1 / 2 / 3 \\\\
\\textbf{3. Shock} & \\text{Normotensive / Transient hypotension / Persistent hypotension in field} & 0 / 1 / 2 \\\\
\\textbf{4. Age} & <30\\text{ years} / 30-50\\text{ years} / >50\\text{ years} & 0 / 1 / 2 \\\\
\\hline
\\end{array}$$

- **MESS Score $\ge 7$**: Highly predictive of **unsuccessful limb salvage and secondary amputation** (100% specificity for non-salvageable limb).
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old motorcyclist is involved in a high-speed collision sustaining a severe open left tibia-fibula fracture with a 14 cm laceration over the anterior shin, extensive periosteal stripping with exposed cortical bone devoid of soft tissue coverage, and severe dirt/gravel contamination from the road. Distal pulses (dorsalis pedis and posterior tibial) are palpable with capillary refill under 2 seconds, and light touch sensation is intact across the foot.",
      question: "What is the Gustilo-Anderson classification, what is the appropriate empiric antibiotic regimen, and what soft-tissue reconstructive strategy will be required?",
      options: [
        "Gustilo-Anderson Type IIIB open fracture (high energy, >10 cm, extensive periosteal stripping and bone exposure requiring flap coverage); initiate immediate IV Cefazolin (2 g Q8H) plus an Aminoglycoside (Gentamicin 5 mg/kg daily) and consider Penicillin G for heavy soil contamination; perform urgent radical operative debridement within 12-24 hours with temporary external fixation followed by planned rotational or free flap soft-tissue reconstruction",
        "Gustilo-Anderson Type I open fracture; give oral Amoxicillin only and apply a cast",
        "Gustilo-Anderson Type IIIC open fracture; perform immediate primary through-knee amputation without debridement",
        "Closed fracture; admit for observation without antibiotics"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates an open tibia fracture with extensive soft-tissue loss: (1) Classification: Because the bone is stripped of periosteum and cannot be closed primarily, it is Type IIIB (Type IIIA has adequate local coverage, while Type IIIC mandates arterial repair); (2) Antibiotic Coverage: Type III open fractures require gram-positive (Cefazolin) plus gram-negative (Gentamicin) coverage, adding Penicillin G for soil/barnyard anaerobes; (3) Reconstruction: Staged debridement, spanning ex-fix, and definitive flap coverage are required."
    }
  ]
};
