/**
 * Thanatology & Post-Mortem Changes Learning Content
 * Authoritative medical content derived from Reddy, Parikh, Knight, and USMLE / PG Entrance.
 * Mapped to NMC CBME Competencies: FM1.1, FM1.2, FM1.3, FM1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THANATOLOGY_POSTMORTEM_MODULE: PhysiologyLessonModule = {
  id: "for-thanatology",
  unitCode: "FM1.1",
  title: "Thanatology: Post-Mortem Interval (PMI), Rigor, Livor, Algor Mortis & Decomposition",
  competencies: ["FM1.1", "FM1.2", "FM1.3", "FM1.4"],
  estimatedMinutes: 130,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Thanatology: Post-Mortem Interval (PMI), Rigor, Livor, Algor Mortis & Decomposition

Thanatology is the scientific study of death, the somatic vs cellular cessation of life, and the sequential physical, chemical, and biological changes occurring in the body over time (**Post-Mortem Interval / PMI**).

---

## 1. Classical Post-Mortem Triad: Algor, Rigor & Livor Mortis

| Post-Mortem Triad | Underlying Biochemical / Biophysical Mechanism | Chronological Evolution & Rules | Medicolegal & Forensic Significance |
| :--- | :--- | :--- | :--- |
| **Algor Mortis (Cooling of Body)** | Cessation of metabolic heat production; cooling by radiation, conduction, and convection toward ambient temperature. | • **Rule of Thumb**: Cools at $\\sim 0.5^\\circ\\text{C to } 1.0^\\circ\\text{C per hour}$ in temperate climates.<br>• **Henssge Nomogram**: Utilizes deep rectal temperature, ambient temperature, body weight, and clothing factor. | Determines early **Post-Mortem Interval (PMI)** during the first $18\\text{–}24\\text{ hours}$. Post-mortem caloricity (delayed cooling) occurs in heat stroke, tetanus, strychnine, pontine hemorrhage, septicemia. |
| **Rigor Mortis (Post-Mortem Stiffening)** | Depletion of cellular **ATP** prevents dissociation of actin-myosin crossbridges in skeletal and cardiac muscle $\\implies$ fixed contraction. | • **Nysten\'s Law**: Appears sequentially from smaller to larger muscles (Involuntary heart/diaphragm $\\rightarrow$ Jaw/Eyelids ($1\\text{–}2\\text{h}$) $\\rightarrow$ Neck & Face $\\rightarrow$ Upper Limbs ($4\\text{–}6\\text{h}$) $\\rightarrow$ Trunk $\\rightarrow$ Lower Limbs ($8\\text{–}12\\text{h}$)).<br>• **Rule of 12s**: Takes $12\\text{h}$ to develop, stays $12\\text{h}$, passes off over next $12\\text{h}$. | • Differentiates **Cadaveric Spasm** (instantaneous rigor at moment of death with no flaccid phase; indicates violent struggle, drowning / holding weeds, firearm in hand).<br>• Differentiates **Heat Stiffening** (protein coagulation at $>65^\\circ\\text{C}$, "pugilistic attitude"). |
| **Livor Mortis (Post-Mortem Lividity / Hypostasis)** | Gravitational settling of blood in dependent capillaries and venules following cessation of circulation. | • Appears in $1\\text{–}2\\text{ hours}$ as faint mottled patches.<br>• Coalesces into generalized purple discoloration by $4\\text{–}6\\text{ hours}$.<br>• **Becomes Fixed (non-blanchable upon thumb pressure)** by $6\\text{–}8\\text{ hours}$ due to hemolysis and tissue diffusion. | • **Determines position of body after death** and whether body was moved/tampered with.<br>• **Distinguishes from Contusion/Bruise**: Incision through livor washes out with water; bruise shows clotted blood extravasated into subcutaneous tissue. |

---

## 2. Iconic Livor Mortis Color Variations

| Livor Mortis Color | Underlying Chemical Entity / Poison | Classic Forensic Case Scenario |
| :--- | :--- | :--- |
| **Cherry-Red / Bright Pink** | **Carboxyhemoglobin ($CO\\text{-}Hb$)** | Carbon Monoxide ($CO$) poisoning (smoke inhalation, faulty heater in closed room, car exhaust in garage). |
| **Brick-Red / Bright Pink** | **Cyanmethemoglobin & Oxyhemoglobin** | Cyanide poisoning (inhibition of Cytochrome $c$ Oxidase; arterialized venous blood with tissue histotoxic anoxia) or extreme cold exposure (refrigeration). |
| **Chocolate-Brown / Slate Gray** | **Methemoglobinemia ($Met\\text{-}Hb$)** | Potassium Chlorate, Nitrites, Aniline dyes, Nitrobenzene poisoning. |
| **Dark Red / Purplish-Blue** | **Reduced Deoxygenated Hemoglobin** | Typical asphyxial deaths (hanging, ligature strangulation, throttling, suffocation, drowning). |

---

## 3. Late Post-Mortem Decomposition & Putrefaction

1. **Putrefaction Signs & Chronology**:
   - **Greenish Discoloration**: Appears in the **Right Iliac Fossa (over cecum)** at $24\\text{–}36\\text{ hours}$ due to hydrogen sulfide ($H_2S$) reacting with hemoglobin to form **Sulfhemoglobin**.
   - **Marbling of Skin**: By $36\\text{–}48\\text{ hours}$, hemolysis within superficial veins produces a dark greenish-purple branching arborization ("tree-like" venous network) driven by *Clostridium welchii (perfringens)*.
   - **Bloating & Gaseous Distension**: At $48\\text{–}72\\text{ hours}$, bacterial gas formation distends scrotum, abdomen, and causes tongue protrusion, bloody froth from mouth/nose, and post-mortem purging.
2. **Casper\'s Dictum (Rule of Decomposition Speed)**:
   - A body decomposes at roughly the same rate in: **$1\\text{ week in Air} = 2\\text{ weeks in Water} = 8\\text{ weeks in Earth (buried)}$** ($1 : 2 : 8$ ratio).
3. **Special Modifications of Decomposition**:
   - **Adipocere (Saponification)**: Occurs in bodies immersed in **warm, moist, anaerobic environments** (water bodies, wet vaults). Hydrolysis and hydrogenation of body fats into yellowish-white, foul-smelling waxy fatty acids by *C. perfringens* lecithinase. *Preserves facial features and stab wound morphology for years*.
   - **Mummification**: Occurs in **hot, dry, arid environments with constant draft of air** (deserts). Body undergoes rapid dehydration and shrivels into a dark brown, leathery, parchment-like shell. *Preserves anatomical contours indefinitely*.
`,
  clinicalVignettes: [
    {
      scenario: "The body of a 40-year-old male is discovered in a locked apartment in temperate weather (ambient temperature 22 C). Post-mortem examination reveals complete rigidity in the jaw, neck, upper extremities, and lower extremities. Dark purplish discoloration is present on the posterior dependent back and thighs that does not blanch upon firm thumb pressure. There is no greenish discoloration over the right iliac fossa.",
      question: "Which of the following is the most accurate estimated Post-Mortem Interval (PMI)?",
      options: [
        "12 to 24 hours",
        "2 to 4 hours",
        "36 to 48 hours",
        "Over 72 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "Rigor mortis is fully established in both upper and lower limbs between 12-24 hours in temperate climates. Livor mortis becomes fixed (non-blanchable on thumb pressure) after 6-8 hours. The absence of greenish discoloration over the right iliac fossa (which typically appears at 24-36 hours) confirms that the post-mortem interval is between 12 and 24 hours."
    }
  ]
};
