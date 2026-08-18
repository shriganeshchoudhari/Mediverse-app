/**
 * Internship Core Clinical Postings: Thermal Burns & Fluid Resuscitation: Parkland Formula & Rule of Nines
 * Authoritative burn surgery content derived from ABA Guidelines, Sabiston Surgery.
 * Mapped to NMC CBME Competencies: IN5.2, SU3.2, EM3.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BURNS_PARKLAND_FORMULA_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "int5-burns-parkland-formula-resuscitation",
  unitCode: "IN5.2",
  title: "Thermal Burns & Fluid Resuscitation: Rule of Nines (%TBSA), Parkland Formula & Urine Output Titration",
  competencies: ["IN5.2", "SU3.2", "EM3.2"],
  estimatedMinutes: 150,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Thermal Burns & Fluid Resuscitation: Rule of Nines & Parkland Formula

Protocolized crystalloid fluid calculation, strict hourly timing from the moment of burn injury, and urine output titration prevent burn shock and resuscitation-related fluid creep.

---

## 1. Wallace Rule of Nines for Adult %TBSA Burn Estimation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Anatomical Region} & \\textbf{Percentage of Total Body Surface Area (\\%TBSA)} \\\\
\\hline
\\textbf{Head and Neck} & 9\\% \\text{ (Anterior } 4.5\\% \\text{ + Posterior } 4.5\\%\\text{)} \\\\
\\textbf{Anterior Torso (Chest + Abdomen)} & \\mathbf{18\\%} \\\\
\\textbf{Posterior Torso (Upper + Lower Back)} & \\mathbf{18\\%} \\\\
\\textbf{Right Upper Extremity (Entire Arm)} & 9\\% \\text{ (Anterior } 4.5\\% \\text{ + Posterior } 4.5\\%\\text{)} \\\\
\\textbf{Left Upper Extremity (Entire Arm)} & 9\\% \\text{ (Anterior } 4.5\\% \\text{ + Posterior } 4.5\\%\\text{)} \\\\
\\textbf{Right Lower Extremity (Entire Leg)} & \\mathbf{18\\% \\text{ (Anterior } 9\\% \\text{ + Posterior } 9\\%\\text{)}} \\\\
\\textbf{Left Lower Extremity (Entire Leg)} & \\mathbf{18\\% \\text{ (Anterior } 9\\% \\text{ + Posterior } 9\\%\\text{)}} \\\\
\\textbf{Perineum and Genitalia} & 1\\% \\\\
\\hline
\\textbf{Clinical Exclusion Rule} & \\mathbf{\\text{Superficial 1st-degree burns (erythema without blisters) are EXCLUDED}} \\\\
\\hline
\\end{array}$$

---

## 2. The Parkland (Baxter) Fluid Resuscitation Formula

$$\\mathbf{\\text{Total 24-Hour Crystalloid Volume (Lactated Ringer's)}} = \\mathbf{4\\text{ mL} \\times \\text{Body Weight (kg)} \\times \\%\\text{TBSA Burn}}$$

$$\\begin{array}{lcccc}
\\hline
\\textbf{Resuscitation Phase} & \\textbf{Calculated Volume Proportion} & \\textbf{Critical Timing Rule} \\\\
\\hline
\\textbf{First 8 Hours} & \\mathbf{50\\% \\text{ of Total Calculated Volume}} & \\mathbf{\\text{Calculated FROM TIME OF BURN INJURY,}} \\\\
& & \\mathbf{\\text{NOT emergency department arrival time}} \\\\
\\textbf{Next 16 Hours} & \\mathbf{50\\% \\text{ of Total Calculated Volume}} & \\text{Administer remaining half over the subsequent 16 hours} \\\\
\\hline
\\end{array}$$

---

## 3. Resuscitation End-Points & Urine Output Titration

$$\\begin{array}{lcccc}
\\hline
\\textbf{Patient Population} & \\textbf{Target Hourly Urine Output (UO)} & \\textbf{Clinical Adjustment} \\\\
\\hline
\\textbf{Adult Thermal Burns} & \\mathbf{0.5-1.0\\text{ mL/kg/hr (}\\approx 30-50\\text{ mL/hr)}} & \\text{Titrate IV LR infusion rate up/down by 10-20\\% hourly} \\\\
\\textbf{Pediatric Burns (} < 30\\text{ kg)} & \\mathbf{1.0-2.0\\text{ mL/kg/hr}} & \\text{Add maintenance } D_5\\text{W } 1/2\\text{ NS to prevent hypoglycemia} \\\\
\\textbf{Electrical Burns (Myoglobinuria)} & \\mathbf{1.5-2.0\\text{ mL/kg/hr (}\\approx 75-100\\text{ mL/hr)}} & \\text{Aggressive hydration to prevent myoglobin tubular cast ATN} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 70-kg, 35-year-old male firefighter sustains partial- and full-thickness thermal burns to his entire anterior torso, entire right upper extremity, and entire right lower extremity in an industrial flash fire at 14:00. He arrives at the trauma bay at 16:00 (2 hours post-injury). On examination, superficial erythematous sunburn on his face is noted, but blistered partial-thickness burns cover his chest, abdomen, right arm, and right leg.",
      question: "What is the calculated %TBSA burn, the total 24-hour Lactated Ringer's volume via Parkland formula, and the fluid infusion rate for the remaining 6 hours of the first 8-hour window?",
      options: [
        "%TBSA = 45% (Anterior Torso 18% + Right Arm 9% + Right Leg 18%; superficial facial erythema excluded); Total 24h Volume = 4 mL x 70 kg x 45 = 12,600 mL Lactated Ringer's; First 8-hour volume = 6,300 mL (50%); since 2 hours elapsed prior to arrival, the remaining 6,300 mL must be infused over the remaining 6 hours at 1,050 mL/hour",
        "%TBSA = 65%; Total Volume = 5,000 mL normal saline infused over 24 hours at 200 mL/hr",
        "%TBSA = 30%; administer 500 mL boluses of D5W only",
        "%TBSA = 100%; immediately initiate whole blood transfusion"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates the precise application of the Parkland formula and the Rule of Nines: (1) %TBSA Calculation: Anterior torso (18%) + Right arm (9%) + Right leg (18%) = 45% TBSA (1st-degree superficial facial burns are excluded); (2) Total 24-Hour Volume: 4 mL x 70 kg x 45% = 12,600 mL Lactated Ringer's; (3) First 8-Hour Volume: 50% = 6,300 mL; (4) Timing Benchmark: The 8-hour window starts at the time of injury (14:00). With 2 hours elapsed, the entire 6,300 mL must be administered over the remaining 6 hours (6,300 / 6 = 1,050 mL/hr) targeting urine output 0.5-1.0 mL/kg/hr."
    }
  ]
};
