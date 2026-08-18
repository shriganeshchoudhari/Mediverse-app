/**
 * Clinical Forensic Pathology: Forensic Ballistics & Gunshot Wound Dynamics
 * Authoritative medical content derived from Knight's Forensic Pathology (4th ed.), DiMaio's Gunshot Wounds.
 * Mapped to NMC CBME Competencies: FM3.1, FM3.2, MD40.2, SU38.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FORENSIC_BALLISTICS_GUNSHOT_WOUNDS_MODULE: PhysiologyLessonModule = {
  id: "forensic-adv-ballistics-gsw",
  unitCode: "FM3.1",
  title: "Forensic Ballistics: Range of Fire (Contact, Stippling, Tattooing) & Entrance vs Exit Wounds",
  competencies: ["FM3.1", "FM3.2", "MD40.2", "SU38.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Forensic Ballistics & Gunshot Wound Traumatology

Forensic ballistics evaluates firearm discharge dynamics, wound track morphology, and muzzle-to-target distance to reconstruct shooting incidents.

---

## 1. Range of Fire Classification Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Range of Fire} & \\textbf{Distance} & \\textbf{Wound Morphology} & \\textbf{Periwound Signatures} & \\textbf{Mechanistic Cause} \\\\
\\hline
\\textbf{Hard Contact} & \\text{Muzzle against skin} & \\mathbf{\\text{Stellate / Cruciform tear}} & \\mathbf{\\text{Muzzle stamp / impression;}} & \\text{Gas expansion in tight} \\\\
& & \\text{(over skull / bone)} & \\text{cherry-red subcutaneous tract} & \\text{subperiosteal / subgaleal space} \\\\
\\textbf{Close Range} & \\text{Muzzle inches away} & \\text{Central circular hole} & \\mathbf{\\text{Muzzle flame burn (singeing);}} & \\text{Flame heat + soot fouling} \\\\
& & & \\mathbf{\\text{soot / smudging (WASHABLE)}} & \\text{exits muzzle behind bullet} \\\\
\\textbf{Intermediate} & \\mathbf{\\text{Up to 1-3 feet}} & \\text{Central circular hole} & \\mathbf{\\text{Gunpowder Tattooing / Stippling}} & \\mathbf{\\text{Unburnt powder grains}} \\\\
\\text{(Near Range)} & & + \\text{ abrasion collar} & \\mathbf{\\text{(Punctate abrasions; CANNOT wash off)}} & \\mathbf{\\text{impact and embed in dermis}} \\\\
\\textbf{Distant Range} & \\mathbf{> 3\\text{ feet}} & \\text{Clean circular/oval hole} & \\mathbf{\\text{Abrasion Collar (friction ring)}} & \\text{Bullet spin/stretch without} \\\\
& & & + \\mathbf{\\text{Grease / Dirt Collar (bullet wipe)}} & \\text{any gas, flame, or powder residue} \\\\
\\hline
\\end{array}$$

---

## 2. Entrance vs Exit Wound Differentials

$$\\begin{array}{lcc}
\\hline
\\textbf{Pathological Feature} & \\textbf{Entrance Gunshot Wound} & \\textbf{Exit Gunshot Wound} \\\\
\\hline
\\textbf{Wound Size} & \\text{Usually smaller (corresponds to caliber)} & \\mathbf{\\text{Usually larger and irregular}} \\\\
\\textbf{Wound Margins} & \\mathbf{\\text{INVERTED (turned inward)}} & \\mathbf{\\text{EVERTED (turned outward)}} \\\\
\\textbf{Abrasion Collar} & \\mathbf{\\text{PRESENT (abrasion ring around defect)}} & \\mathbf{\\text{ABSENT (unless 'shored exit wound')}} \\\\
\\textbf{Soot / Tattooing} & \\text{Present if contact, close, or intermediate} & \\mathbf{\\text{ALWAYS ABSENT}} \\\\
\\textbf{Cranial Bone Beveling} & \\mathbf{\\text{INTERNAL BEVELING (funnel points in)}} & \\mathbf{\\text{EXTERNAL BEVELING (funnel points out)}} \\\\
\\hline
\\end{array}$$

- **Shored Exit Wound**:
  - If the skin at the exit site is firmly supported by a rigid surface (e.g., tight belt, brassiere strap, wall, chair back), the exiting bullet sloughs the epidermis against the support, creating an atypical **abrasion collar around an exit wound**.
`,
  clinicalVignettes: [
    {
      scenario: "During an autopsy of a gunshot homicide victim, external examination of the anterior chest wall demonstrates a 9 mm circular penetrating defect surrounded by numerous pinpoint, punctate, reddish-brown erythematous abrasions distributed uniformly in a 6 cm radius around the central hole. Vigorous washing with saline and surgical scrub sponges fails to remove these punctate spots. There is no evidence of skin charring, singeing of chest hairs, or black soot deposition on the clothing or skin.",
      question: "What is the range of fire, and what is the pathological nature of the non-washable punctate periwound lesions?",
      options: [
        "Intermediate Range Gunshot Wound (1 to 3 feet); Gunpowder Tattooing (Stippling) caused by unburnt and partially burnt gunpowder flakes propelled from the gun barrel embedding into the viable dermis",
        "Hard Contact Gunshot Wound; Expanding gas tears in the subgaleal space",
        "Close Range Gunshot Wound (<3 inches); Flame burn singeing and washable superficial carbon fouling",
        "Distant Range Gunshot Wound (>10 feet); Primary bullet friction ring alone"
      ],
      correctAnswerIndex: 0,
      explanation: "Gunpowder Tattooing (or Stippling) is the pathognomonic hallmark of an Intermediate Range Gunshot Wound (typically occurring between a few inches up to 1-3 feet depending on the firearm and barrel length). Unburnt and partially burnt propellant gunpowder particles travel out of the muzzle with the bullet and impact the skin with sufficient velocity to produce discrete, punctate intra-epidermal and dermal abrasive injuries. Unlike soot or carbon smudging (which is superficial and easily washed away with soap and water), tattooing/stippling represents true mechanical dermal penetration and cannot be wiped off. Flame burns and soot require close range (<few inches), which are absent here."
    }
  ]
};
