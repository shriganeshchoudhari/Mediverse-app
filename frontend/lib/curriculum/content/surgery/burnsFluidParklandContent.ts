/**
 * Burns, TBSA Assessment & Parkland Fluid Resuscitation Learning Content
 * Authoritative medical content derived from ABA Guidelines, Bailey & Love, Sabiston, and USMLE Step 2 CK Surgery.
 * Mapped to NMC CBME Competencies: SU5.1, SU5.2, SU5.3, SU5.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BURNS_FLUID_PARKLAND_MODULE: PhysiologyLessonModule = {
  id: "surg-burns-parkland",
  unitCode: "SU5.1",
  title: "Burns & Critical Care: Wallace Rule of Nines, Parkland Fluid Resuscitation Formula & Escharotomy",
  competencies: ["SU5.1", "SU5.2", "SU5.3", "SU5.4"],
  estimatedMinutes: 135,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Burns & Critical Care: Wallace Rule of Nines, Parkland Fluid Resuscitation Formula & Escharotomy

Severe thermal burn injury produces massive systemic capillary leak, evaporative fluid loss, burn shock, hypermetabolism, and acute immunosuppression requiring rapid estimation of Total Body Surface Area (TBSA) and titrated crystalloid resuscitation.

---

## 1. Estimation of Burn Extent: Wallace Rule of Nines (Adults)

| Anatomical Region | Percentage of Total Body Surface Area (% TBSA) |
| :--- | :--- |
| **Head and Neck** (Entire anterior & posterior) | **$9\\%$** |
| **Right Upper Extremity** (Arm, forearm, hand) | **$9\\%$** |
| **Left Upper Extremity** (Arm, forearm, hand) | **$9\\%$** |
| **Anterior Trunk / Torso** (Chest $+$ Abdomen) | **$18\\%$** |
| **Posterior Trunk / Torso** (Upper $+$ Lower back $+$ Buttocks) | **$18\\%$** |
| **Right Lower Extremity** (Thigh, leg, foot) | **$18\\%$** ($9\\%$ anterior $+$ $9\\%$ posterior) |
| **Left Lower Extremity** (Thigh, leg, foot) | **$18\\%$** ($9\\%$ anterior $+$ $9\\%$ posterior) |
| **Perineum / Genitalia** | **$1\\%$** |
| **Palmar Surface of Patient\'s Hand (including fingers)** | **$\\approx 1\\%$** (useful for estimating scattered, patchy burns) |

*(Note: First-degree superficial burns such as sunburn are EXCLUDED from the % TBSA calculation for fluid resuscitation).*

---

## 2. The Parkland Fluid Resuscitation Formula

For adults with $\\ge 20\\%$ TBSA partial-to-full thickness burns:

$$\\text{Total 24-Hour Ringer\'s Lactate (mL)} = 4\\text{ mL} \\times \\text{Body Weight (kg)} \\times \\%\\text{TBSA Burned}$$

### Chronological Dosing Protocol:
1. **First 8 Hours**: Administer **50% of the calculated 24-hour total volume**.
   - *CRITICAL RULE*: The 8-hour clock starts from the **EXACT TIME OF BURN INJURY**, NOT from the time of hospital arrival! If 2 hours have already elapsed before arrival, the first half must be infused over the remaining 6 hours.
2. **Next 16 Hours**: Administer the remaining **50% of the calculated 24-hour total volume**.
3. **Resuscitation Fluid of Choice**: **Ringer\'s Lactate (Hartmann\'s Solution)** is preferred over Normal Saline to prevent hyperchloremic metabolic acidosis.

### Clinical Endpoint for Fluid Titration:
- **Urine Output (Indwelling Foley Catheter)** is the single most reliable bedside physiological indicator of end-organ perfusion:
  - **Adults**: Target **$0.5\\text{ to } 1.0\\text{ mL/kg/hour}$** (typically $30-50\\text{ mL/h}$).
  - **Children ($<30\\text{ kg}$)**: Target **$1.0\\text{ to } 2.0\\text{ mL/kg/hour}$**.
  - **Electrical / High-Voltage Burns with Rhabdomyolysis / Myoglobinuria**: Target **$1.5\\text{ to } 2.0\\text{ mL/kg/hour}$** ($100-150\\text{ mL/h}$) $+$ Sodium Bicarbonate for urinary alkalinization to prevent acute tubular necrosis.

---

## 3. Circumferential Full-Thickness Burns & Emergency Escharotomy

- **Pathophysiology**: Deep dermal and full-thickness burns form a stiff, inelastic, leathery **Eschar**. As tissue edema builds beneath the non-yielding eschar during fluid resuscitation, interstitial compartment pressures rise dramatically ($>30\\text{ mmHg}$).
- **Complications**:
  - **Circumferential Torso / Chest Burns**: Restricts thoracic expansion $\\implies$ severe hypoventilation, high peak inspiratory pressures, and hypoxia.
  - **Circumferential Extremity Burns**: Compresses arterial blood flow $\\implies$ compartment syndrome, distal pulselessness, ischemic necrosis, and limb loss.
- **Emergency Escharotomy Technique**:
  - Longitudinal full-thickness surgical incision through the unyielding eschar into the underlying subcutaneous fat until the wound edges pop open and tissue compliance is restored.
  - *No local anesthesia required because full-thickness third-degree burns destroy cutaneous sensory nerve endings*.
`,
  clinicalVignettes: [
    {
      scenario: "A 70 kg male sustains second- and third-degree thermal burns to his entire anterior torso (18%), his entire right arm (9%), and the anterior surface of his right leg (9%) in an industrial boiler explosion. The burn occurred at 12:00 PM, and he arrives at the emergency burn center at 2:00 PM (2 hours after injury).",
      question: "According to the Parkland Formula, what is the total 24-hour fluid requirement, and at what hourly infusion rate should Ringer's Lactate be administered over the remaining 6 hours of the initial resuscitation phase?",
      options: [
        "Total 24h = 10,080 mL; Infuse at 840 mL/hour for the first 6 hours",
        "Total 24h = 5,040 mL; Infuse at 420 mL/hour for the first 8 hours",
        "Total 24h = 10,080 mL; Infuse at 630 mL/hour for the first 8 hours",
        "Total 24h = 7,200 mL; Infuse at 600 mL/hour for the first 6 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "1. Total % TBSA = Anterior Torso (18%) + Right Arm (9%) + Anterior Right Leg (9%) = 36% TBSA. 2. Total 24h Volume = 4 mL x 70 kg x 36% = 10,080 mL of Ringer's Lactate. 3. First 8h requirement = 50% of 10,080 mL = 5,040 mL. 4. Since 2 hours have already elapsed since the injury, this 5,040 mL must be delivered over the remaining 6 hours: Hourly rate = 5,040 mL / 6 hours = 840 mL/hour."
    }
  ]
};
