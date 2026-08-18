/**
 * Hospital Administration: Biomedical Waste Management Rules 2016 & Environmental Safety
 * Authoritative medical content derived from Ministry of Environment, Forest and Climate Change BMWM Rules 2016, NABH 5th Edition.
 * Mapped to NMC CBME Competencies: HA1.1, HA1.2, HA2.1, HA2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BIOMEDICAL_WASTE_MANAGEMENT_RULES_2016_MODULE: PhysiologyLessonModule = {
  id: "hospital-admin-biomedical-waste-management-rules-2016",
  unitCode: "HA1.1",
  title: "Biomedical Waste Management Rules 2016: Color-Coded Segregation, Treatment Technologies & Spill Protocols",
  competencies: ["HA1.1", "HA1.2", "HA2.1", "HA2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "COMMUNITY",
  markdownContent: `
# Biomedical Waste Management Rules 2016: Color-Coded Segregation & Safety Protocols

Biomedical Waste Management (BMWM) Rules 2016 mandate the color-coded segregation of healthcare waste at the point of generation to protect healthcare workers, patients, and the public from biohazard transmission.

---

## 1. Color-Coded Segregation & Disposal Matrix (BMWM Rules 2016)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Container / Bag Color} & \\textbf{Type of Waste Material} & \\textbf{Specific Item Examples} & \\textbf{Final Treatment \u0026 Disposal Technology} \\\\
\\hline
\\textbf{Yellow Bag} & \\text{Human Anatomical, Animal, Soiled Waste,} & \\text{Placenta, amputated limbs, biopsy tissues, soiled dressings,} & \\mathbf{\\text{Incineration}}\\text{ (}\u003e1050^\\circ\\text{C in secondary chamber)} \\\\
\\text{(Non-Chlorinated)} & \\text{Expired Drugs, Cytotoxic, Chemical, Blood Bags} & \\text{plaster casts, expired antibiotics, blood bags, microbiology cultures} & \\text{or Plasma Pyrolysis / Deep Burial (rural)} \\\\
\\hline
\\textbf{Red Bag} & \\text{Contaminated Recyclable Plastics} & \\text{Disposable tubing, IV bottles, Foley catheters, urine bags,} & \\mathbf{\\text{Autoclaving / Microwaving}}\\text{ followed by} \\\\
\\text{(Non-Chlorinated)} & \\text{(Flexible Plastic Waste)} & \\text{gloves, syringes without needles, vacutainer blood tubes} & \\mathbf{\\text{Shredding / Mutilation \u0026 Recycling}} \\\\
\\hline
\\textbf{White Translucent Container} & \\text{Waste Sharps (Contaminated / Clean)} & \\text{Needles, syringes with fixed needles, scalpels, surgical blades,} & \\mathbf{\\text{Autoclaving / Dry Heat Sterilization}} \\\\
\\text{(Puncture-Proof, Tamper-Proof)} & \\text{(Metals that cause puncture / laceration)} & \\text{lumbar puncture needles, contaminated metallic wires} & \\text{followed by }\\mathbf{\\text{Shredding / Encapsulation}} \\\\
\\hline
\\textbf{Blue Box / Cardboard with Blue} & \\text{Glassware \u0026 Metallic Body Implants} & \\text{Medicine vials, ampoules, broken glassware, IV glass bottles,} & \\mathbf{\\text{Disinfection (1-2\\% Sodium Hypochlorite)}} \\\\
\\text{Marking (Puncture-Resistant)} & \\text{(Rigid Glass \u0026 Prosthetic Metals)} & \\text{orthopedic screws, plates, intramedullary nails, joint prostheses} & \\text{or Autoclaving then }\\mathbf{\\text{Glass Recycling}} \\\\
\\hline
\\end{array}$$

---

## 2. Key Operational Rules & Prohibitions

1. **Point of Generation Segregation**: Waste MUST be segregated immediately at the site of production (bedside, nursing station, operation theatre, laboratory).
2. **Non-Chlorinated Bags**: All yellow and red plastic bags must be non-chlorinated to prevent the generation of carcinogenic **dioxins and furans** during high-temperature incineration.
3. **No Storage Beyond 48 Hours**: Untreated biomedical waste must not be stored in the hospital facility for more than **$48\\text{ hours}$**.
4. **Barcode & GPS Tracking**: All BMWM bags and sharp containers must bear a standardized **Bar Code label** for electronic scanning and GPS tracking during transport to the Common Bio-medical Waste Treatment Facility (CBWTF).
5. **No Recapping of Needles**: Needles must NEVER be bent, sheared, or manually recapped (primary cause of occupational needle-stick injuries!). Needle burners or point-of-use sharps containers must be utilized.

---

## 3. Hospital Spill Management Protocols

- **Blood & Body Fluid Spill Protocol**:
  - Small Spills ($<10\\text{ mL}$): Wipe with paper towels soaked in **$0.5\\% - 1.0\\%$ Sodium Hypochlorite** ($5,000 - 10,000\\text{ ppm}$ available chlorine).
  - Large Spills ($>10\\text{ mL}$): Cover spill entirely with absorbent paper towels / gauze; pour **$1\\%$ Sodium Hypochlorite ($10,000\\text{ ppm}$)** over the towels. Allow **$20 - 30\\text{ minutes}$ contact time** for viral eradication (HBV, HCV, HIV), then discard waste into **Yellow Bag**; clean area with detergent.
- **Mercury Spill Protocol**:
  - Evacuate and ventilate the room; turn off air conditioners.
  - Wear PPE (nitrile gloves, mask). Gather mercury droplets using cardboard stiff paper or aspirate with an eye-dropper/syringe.
  - Sprinkle **Sulfur Powder** or **Zinc Dust** over the spill site to convert volatile elemental mercury into non-volatile mercuric sulfide amalgam.
  - Place amalgamated residue in an airtight plastic container labeled "Hazardous Mercury Waste". *Never vacuum or sweep mercury with a broom!*
`,
  clinicalVignettes: [
    {
      scenario: "During an elective laparoscopic cholecystectomy in the operation theatre, the surgical team generates the following waste items: (1) An amputated gall bladder specimen with stones; (2) A contaminated plastic IV infusion set and empty normal saline plastic bottle; (3) Used disposable surgical scalpel blades; and (4) Several broken glass fentanyl and propofol ampoules.",
      question: "According to the Biomedical Waste Management (BMWM) Rules 2016, which of the following represents the correct color-coded segregation sequence for items (1), (2), (3), and (4) respectively?",
      options: [
        "Yellow Bag (Anatomical), Red Bag (Plastics), White Translucent Container (Sharps), Blue Cardboard Box (Glassware)",
        "Yellow Bag (Anatomical), White Container (Plastics), Red Bag (Sharps), Blue Box (Glassware)",
        "Red Bag (Anatomical), Yellow Bag (Plastics), Blue Box (Sharps), White Container (Glassware)",
        "Yellow Bag (Anatomical), Red Bag (Plastics), Blue Box (Sharps), White Translucent Container (Glassware)"
      ],
      correctAnswerIndex: 0,
      explanation: "Under the BMWM Rules 2016: (1) Human anatomical tissue (gall bladder specimen) goes into a non-chlorinated Yellow Bag for incineration; (2) Contaminated recyclable flexible plastics (IV tubing and plastic infusion bottle) go into a non-chlorinated Red Bag for autoclaving and shredding; (3) Metallic sharps and scalpel blades go into a puncture-proof, tamper-proof White Translucent Container for dry heat/autoclaving and encapsulation; and (4) Broken glass ampoules and glassware go into a puncture-resistant Blue Box/pouch with blue marking for hypochlorite disinfection and recycling."
    }
  ]
};
