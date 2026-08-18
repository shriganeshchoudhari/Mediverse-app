/**
 * Traumatology, Mechanical Wounds, Firearms & Asphyxia Learning Content
 * Authoritative medical content derived from Reddy, Parikh, Knight, and USMLE / PG Entrance.
 * Mapped to NMC CBME Competencies: FM2.1, FM2.2, FM2.3, FM3.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMATOLOGY_MECHANICAL_WOUNDS_MODULE: PhysiologyLessonModule = {
  id: "for-traumatology",
  unitCode: "FM2.1",
  title: "Traumatology: Mechanical Wounds, Firearm Ballistics & Asphyxial Deaths",
  competencies: ["FM2.1", "FM2.2", "FM2.3", "FM3.1"],
  estimatedMinutes: 135,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Traumatology: Mechanical Wounds, Firearm Ballistics & Asphyxial Deaths

Traumatology is the medicolegal classification and reconstruction of mechanical, firearm, thermal, and asphyxial injuries to determine weapon type, force magnitude, vitality (ante-mortem vs post-mortem), and manner of death.

---

## 1. Mechanical Wounds: Laceration vs Incised Wound Differentiation

| Diagnostic Feature | Incised Wound (Slash / Cut) | Lacerated Wound (Tear / Split) |
| :--- | :--- | :--- |
| **Causative Weapon** | **Sharp-edged weapon** (knife, scalpel, razor, glass shard) | **Blunt impact / crushing force** (heavy rod, pipe, hammer, brick, vehicular impact) |
| **Margins / Edges** | **Clean-cut, sharp, regular, well-defined**; no bruising | **Ragged, uneven, torn, abraded, and contused** |
| **Tissue Bridges** | **ABSOLUTELY ABSENT**; all structures cleanly divided across wound plane | **PRESENT**: Intact blood vessels, nerve filaments, and connective tissue bands traversing across the floor |
| **Hair Bulbs** | Cleanly cut across the shafts | **Crushed, torn, or avulsed with bulbs intact** |
| **Wound Dimensions** | Length is typically greater than depth | Variable; shape reflects blunt surface (split over bony prominence e.g. scalp, shin) |
| **Directionality & Tailing** | Tailing of the wound occurs at the **point of exit / termination of stroke** | Undermining on one side indicates the direction of angular force |

---

## 2. Firearm Ballistics: Contact vs Close vs Distant Entry Wounds

| Firearm Entry Wound Type | Range / Distance of Discharge | Morphological Characteristics & Microscopic Hallmarks |
| :--- | :--- | :--- |
| **Hard Contact Wound** | Muzzle firmly pressed against skin | Muzzle stamp / imprint abrasion; expanding gases forced between scalp and skull produce **Stellate / Star-shaped laceration** with bone soot deposition (**Krukenberg effect**). |
| **Close-Range Wound** | Within range of burning powder ($<30\\text{–}60\\text{ cm}$) | **Triad of Thermal/Powder Effects**:<br>1. **Singeing**: Scorching/burning of hair and epidermis by flame ($<10\\text{–}15\\text{ cm}$).<br>2. **Blackening / Soot**: Superficial unburnt carbon soot (can be washed away with water).<br>3. **Tattooing / Stippling**: Unburnt gunpowder grains embedded deep in the dermis (permanent, **cannot be washed away!**). |
| **Distant Entry Wound** | Beyond the reach of powder soot ($>1\\text{ meter}$) | Circular or oval central hole surrounded by:<br>1. **Abrasion Collar (Rim of Abrasion)**: Friction of spinning bullet.<br>2. **Grease Collar (Dirt Collar / Lubricant Ring)**: Bullet wiping off barrel grease.<br>*NO singeing, blackening, or tattooing present!* |
| **Exit Wound** | Bullet exiting the body | Typically **larger, irregular, everted margins**, slit-like or stellate, **NO abrasion collar, NO soot or tattooing**. |

---

## 3. Asphyxial Deaths: Hanging vs Ligature Strangulation vs Throttling

| Diagnostic Criterion | Hanging (Ante-Mortem Suspension) | Ligature Strangulation (Homicide) | Throttling (Manual Strangulation) |
| :--- | :--- | :--- | :--- |
| **Mechanism of Force** | **Body weight** acts as the constricting force | Constricting force applied by **external ligature** independent of body weight | Constriction of neck by **human hands / fingers** |
| **Ligature Mark Location** | **High up on the neck** (above thyroid cartilage / hyoid level) | **Low down on the neck** (below or at the level of the thyroid cartilage) | Mid to lower neck (cricoid/thyroid level) |
| **Ligature Mark Pattern** | **Oblique, non-continuous** (interrupted at the suspension knot with inverted "V" apex) | **Horizontal, completely continuous circular band** around the entire neck | Multiple crescentic **fingernail abrasions** and disc-like **fingerpad contusions** |
| **Base of the Mark** | Pale, hard, dry, yellowish-brown, **parchment-like** | Soft, reddish-brown, congested | Variable bruising and soft tissue hemorrhage |
| **Facial Appearance** | Often pale and placid (complete arterial occlusion) | Marked facial congestion, **intense cyanosis, and petechial hemorrhages** | Intense cyanosis, subconjunctival petechiae, bloody froth |
| **Hyoid & Laryngeal Fractures** | Less common (seen in elderly $>40$ yrs; fracture of greater cornu of hyoid in judicial drop) | Rare thyroid cartilage fracture | **Very common fracture of Greater Cornu of Hyoid Bone & Thyroid Cartilage** |
`,
  clinicalVignettes: [
    {
      scenario: "During an autopsy of a suspected homicide victim, the forensic pathologist examines a wound on the scalp. The wound edges are ragged, abraded, and bruised. Microscopic examination of the wound floor demonstrates intact nerve fibers and connective tissue strands bridging across the defect. The hair shafts at the wound margin have crushed bulbs.",
      question: "Which of the following is the correct classification of this wound?",
      options: [
        "Lacerated Wound caused by a blunt object",
        "Incised Wound caused by a sharp razor blade",
        "Contact Gunshot Wound",
        "Chop Wound caused by a heavy cleaver"
      ],
      correctAnswerIndex: 0,
      explanation: "A laceration is caused by blunt mechanical impact tearing the tissue. Pathognomonic features include ragged, abraded/contused margins, intact tissue bridges (nerves, blood vessels, and fibrous bands traversing the wound base), and crushed/torn hair bulbs. In contrast, an incised wound has clean-cut edges and completely severed tissues with zero tissue bridging."
    }
  ]
};
