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

| Severity | $PaO_2 / FiO_2$ Ratio (PEEP $\\ge 5\\text{ cmH}_2\\text{O}$) | Timing | Chest Imaging (CXR/CT) | Origin of Edema |
| :--- | :--- | :--- | :--- | :--- |
| **Mild** | $200 < PaO_2/FiO_2 \\le 300\\text{ mmHg}$ | **$\\le 1$ week of known clinical insult** | **Bilateral opacities NOT fully** | **Non-cardiogenic**; not fully |
| **Moderate** | $100 < PaO_2/FiO_2 \\le 200\\text{ mmHg}$ | or new/worsening respiratory symptoms | explained by effusions/collapse | explained by CHF or fluid overload |
| **Severe** | **$PaO_2/FiO_2 \\le 100\\text{ mmHg}$** | | | (Echocardiogram/PCWP $\\le 18\\text{ mmHg}$) |

---

## 2. ARDSNet Lung-Protective Ventilation Strategy

| Ventilator Parameter | Target Value | Pathophysiological Rationale |
| :--- | :--- | :--- |
| **Tidal Volume ($V_T$)** | **4 - 6 mL/kg Predicted Body Weight (PBW)** | **Prevents VOLUTRAUMA to functional "baby lung"** |
| **Plateau Pressure ($P_{plat}$)** | **$\\le 30\\text{ cmH}_2\\text{O}$** | **Prevents BAROTRAUMA (alveolar overdistension)** |
| **Driving Pressure ($\\Delta P$)** | **$\\Delta P = P_{plat} - \\text{PEEP} \\le 14-15\\text{ cmH}_2\\text{O}$** | **Single strongest mechanical predictor of ICU survival** |
| **Positive End-Expiratory Pressure (PEEP)** | Titrated via ARDSNet High-PEEP / $FiO_2$ Table | **Prevents ATELECTRAUMA (cyclic opening/collapse)** |
| **Permissive Hypercapnia** | Tolerate $PaCO_2$ 50-70 mmHg ($pH \\ge 7.20$) | Avoids excessive alveolar strain and volutrauma |

- **Predicted Body Weight (PBW) Formula**:
  - Males: $50 + 0.91 \\times [\\text{Height (cm)} - 152.4]$
  - Females: $45.5 + 0.91 \\times [\\text{Height (cm)} - 152.4]$
  - *Never use actual body weight, as lung size depends on height and biological sex, not adipose mass.*

---

## 3. Advanced ARDS Rescue Therapies

1. **Prone Positioning (PROSEVA Trial)**:
   - **Indication**: Severe ARDS with $PaO_2/FiO_2 < 150\\text{ mmHg}$ on $FiO_2 \\ge 0.60$ and $\\text{PEEP} \\ge 10\\text{ cmH}_2\\text{O}$.
   - **Protocol**: Maintain prone posture for **$\\ge 16$ consecutive hours per session**.
   - **Mechanism**: Eliminates compressive cardiac/abdominal weight on dorsal lung segments $\\rightarrow$ redistributes transpulmonary pressure more homogeneously $\\rightarrow$ markedly improves $V/Q$ matching and reduces mortality by nearly 50%.

2. **Neuromuscular Blockade (ROSE / ACURASYS Trials)**:
   - Infusion of cisatracurium for $\\le 48\\text{ hours}$ in early severe ARDS to abolish patient-ventilator dyssynchrony, pendelluft, and breath-stacking ("reverse triggering").

3. **Veno-Venous Extracorporeal Membrane Oxygenation (VV-ECMO)**:
   - Extracorporeal life support for refractory hypoxemic respiratory failure when conventional lung-protective ventilation fails ($PaO_2/FiO_2 < 80\\text{ mmHg}$ for $>6$ hours or $pH < 7.15$).
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old female (Height: 162 cm, Actual Weight: 98 kg, PBW: 54 kg) with acute necrotizing pancreatitis develops severe hypoxemic respiratory failure. Chest X-ray reveals diffuse bilateral airspace infiltrates. She is intubated and placed on volume-control ventilation with: VT 550 mL, RR 20/min, PEEP 14 cmH2O, and FiO2 0.80. ABG shows: pH 7.24, PaCO2 54 mmHg, PaO2 78 mmHg (PaO2/FiO2 ratio = 97.5 mmHg). An inspiratory hold reveals a Plateau Pressure (Pplat) of 36 cmH2O (Driving Pressure = 22 cmH2O).",
      question: "Which of the following interventions is the single most urgent and evidence-based adjustment to reduce mortality?",
      options: [
        "Decrease Tidal Volume immediately to 320 mL (6 mL/kg PBW) to reduce Plateau Pressure below 30 cmH2O and driving pressure below 14 cmH2O, and initiate Prone Positioning for at least 16 hours/day",
        "Increase Tidal Volume to 700 mL to blow off CO2 and normalize pH above 7.35",
        "Decrease PEEP to 5 cmH2O to reduce airway pressures",
        "Initiate high-dose corticosteroid infusion without changing ventilator settings"
      ],
      correctAnswerIndex: 0,
      explanation: "The patient is currently receiving excessive tidal volumes (550 mL = 10.2 mL/kg PBW for her 54 kg PBW) because the team calculated VT using actual weight rather than Predicted Body Weight (PBW). This causes severe volutrauma and barotrauma with dangerous Plateau Pressure (36 cmH2O, target <=30) and high Driving Pressure (22 cmH2O, target <=14). The VT must immediately be decreased to 6 mL/kg PBW (~320 mL) or lower. Because her PaO2/FiO2 is < 100 mmHg (severe ARDS), early Prone Positioning (>= 16 hours/day according to the PROSEVA trial) is strongly indicated to improve V/Q matching and reduce mortality."
    }
  ]
};
