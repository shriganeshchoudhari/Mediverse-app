/**
 * Critical Care: Acute Respiratory Distress Syndrome (ARDS) & Mechanical Ventilation
 * Authoritative medical content derived from ARDSNet, Marino's The ICU Book, PROSEVA trial.
 * Mapped to NMC CBME Competencies: CC1.3, CC1.4, AN23.2, MD36.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ARDS_MECHANICAL_VENTILATION_MODULE: PhysiologyLessonModule = {
  id: "critical-care-adv-ards-mechanical-ventilation",
  unitCode: "CC3.1",
  title: "Acute Respiratory Distress Syndrome (ARDS): Berlin Criteria, ARDSNet Low-VT & Prone Positioning",
  competencies: ["CC1.3", "CC1.4", "AN23.2", "MD36.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PULMONARY",
  markdownContent: `
# Acute Respiratory Distress Syndrome (ARDS) & Mechanical Ventilation

ARDS is an acute, diffuse, inflammatory lung injury characterized by increased alveolar-capillary permeability, non-cardiogenic pulmonary edema, and refractory hypoxemia.

---

## 1. The Berlin Definition of ARDS

$$\\begin{array}{lcccc}
\\hline
\\textbf{Severity} & \\textbf{PaO}_2 / \\text{FiO}_2\\textbf{ Ratio (PEEP } \\ge 5\\text{ cmH}_2\\text{O)} & \\textbf{Timing} & \\textbf{Chest Imaging (CXR/CT)} & \\textbf{Origin of Edema} \\\\
\\hline
\\textbf{Mild} & 200 < \\text{PaO}_2/\\text{FiO}_2 \\le 300\\text{ mmHg} & \\mathbf{\\le 1\\text{ week of known insult}} & \\mathbf{\\text{Bilateral opacities NOT fully}} & \\mathbf{\\text{Non-cardiogenic; not fully}} \\\\
\\textbf{Moderate} & 100 < \\text{PaO}_2/\\text{FiO}_2 \\le 200\\text{ mmHg} & \\text{or new/worsening symptoms} & \\text{explained by effusions/collapse} & \\text{explained by CHF or fluid overload} \\\\
\\textbf{Severe} & \\mathbf{\\text{PaO}_2/\\text{FiO}_2 \\le 100\\text{ mmHg}} & & & \\text{(Echocardiogram/PCWP } \\le 18\\text{)} \\\\
\\hline
\\end{array}$$

---

## 2. ARDSNet Lung-Protective Ventilation Strategy

$$\\begin{array}{lcc}
\\hline
\\textbf{Ventilator Parameter} & \\textbf{Target Value} & \\textbf{Pathophysiological Rationale} \\\\
\\hline
\\textbf{Tidal Volume (}V_T\\textbf{)} & \\mathbf{4 - 6\\text{ mL/kg Predicted Body Weight (PBW)}} & \\mathbf{\\text{Prevents VOLUTRAUMA to functional \"baby lung\"}} \\\\
\\textbf{Plateau Pressure (}P_{plat}\\textbf{)} & \\mathbf{\\le 30\\text{ cmH}_2\\text{O}} & \\mathbf{\\text{Prevents BAROTRAUMA (alveolar overdistension)}} \\\\
\\textbf{Driving Pressure (}\\Delta P\\textbf{)} & \\mathbf{\\Delta P = P_{plat} - PEEP \\le 14-15\\text{ cmH}_2\\text{O}} & \\mathbf{\\text{Single strongest mechanical predictor of survival}} \\\\
\\textbf{Positive End-Expiratory (PEEP)} & \\text{High PEEP titrated via PEEP/FiO}_2\\text{ table} & \\mathbf{\\text{Prevents ATELECTRAUMA (cyclic collapse/reopening)}} \\\\
\\textbf{Permissive Hypercapnia} & \\text{Tolerate } PaCO_2\\text{ 50-70 mmHg (pH } \\ge 7.20\\text{)} & \\text{Avoids excessive alveolar strain} \\\\
\\hline
\\end{array}$$

- **Predicted Body Weight (PBW) Formula**:
  - Males: $50 + 0.91 \\times [\\text{Height (cm)} - 152.4]$
  - Females: $45.5 + 0.91 \\times [\\text{Height (cm)} - 152.4]$
  - *Never use actual body weight, as lung size depends on height and biological sex, not adipose mass.*

---

## 3. Advanced ARDS Rescue Therapies

1. **Prone Positioning (PROSEVA Trial)**:
   - Indication: Moderate-to-Severe ARDS with $\\text{PaO}_2/\\text{FiO}_2 < 150\\text{ mmHg}$ despite PEEP $\\ge 10\\text{ cmH}_2\\text{O}$.
   - Duration: **At least $16\\text{ hours/day}$**.
   - Mechanism: Reduces ventral-dorsal transpulmonary pressure gradients, relieves cardiac compression on lower lung lobes, promotes recruitment of dorsal alveoli, and dramatically reduces 28-day mortality.
2. **Neuromuscular Blockade (Cisatracurium Infusion)**:
   - Improves patient-ventilator synchrony, eliminates patient-generated negative transpulmonary pressure spikes (reverse triggering/pendelluft), and reduces oxygen consumption in the first $48\\text{ hours}$.
3. **Veno-Venous ECMO (VV-ECMO)**:
   - For refractory hypoxemic respiratory failure when lung-protective ventilation cannot maintain oxygenation/ventilation without exceeding safe plateau pressures ($P_{plat} > 30$).
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old female (height: 160 cm, actual weight: 95 kg, predicted body weight: 52 kg) is intubated for severe sepsis from community-acquired pneumonia. The patient is placed on volume-controlled mechanical ventilation with: VT 600 mL (based on actual weight), PEEP 10 cmH2O, FiO2 0.80, and RR 20/min. An end-inspiratory pause demonstrates: Peak Inspiratory Pressure (PIP) 44 cmH2O and Plateau Pressure (Pplat) 36 cmH2O. Arterial blood gas shows: pH 7.34, PaCO2 42 mmHg, PaO2 68 mmHg (PaO2/FiO2 ratio = 85 mmHg, Severe ARDS).",
      question: "Which of the following represents the single most crucial ventilator adjustment according to ARDSNet lung-protective guidelines?",
      options: [
        "Reduce Tidal Volume to 310 mL (6 mL/kg of Predicted Body Weight) to reduce Plateau Pressure to <=30 cmH2O and Driving Pressure to <=14 cmH2O",
        "Increase Tidal Volume to 750 mL to wash out carbon dioxide and increase PaO2",
        "Increase Respiratory Rate to 35/min without adjusting tidal volume",
        "Decrease PEEP to 0 cmH2O to lower the Peak Inspiratory Pressure"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is receiving inappropriately large tidal volumes based on actual weight (600 mL) rather than Predicted Body Weight (PBW = 52 kg), producing severe lung-injurious barotrauma and volutrauma (Plateau Pressure = 36 cmH2O, Driving Pressure = 26 cmH2O). The cornerstone of ARDSNet lung-protective ventilation is: (1) Tidal volume 4-6 mL/kg of PREDICTED body weight (52 kg x 6 mL/kg = 312 mL); (2) Limiting Plateau Pressure (Pplat) to <=30 cmH2O; and (3) Minimizing Driving Pressure (Pplat - PEEP) to <=14 cmH2O. For persistent severe ARDS (PaO2/FiO2 <150), prone positioning for >=16 hours/day should be initiated."
    }
  ]
};
