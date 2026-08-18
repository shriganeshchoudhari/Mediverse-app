/**
 * Respiratory Mechanics & Gas Exchange Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.) and West's Respiratory Physiology.
 * Mapped to NMC CBME Competencies: PY6.1, PY6.2, PY6.3
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const RESPIRATORY_MECHANICS_MODULE: PhysiologyLessonModule = {
  id: "phys-respiratory-vq",
  unitCode: "PY6.2",
  title: "Respiratory Mechanics, Alveolar Gas Equation & V/Q Dynamics",
  competencies: ["PY6.1", "PY6.2"],
  estimatedMinutes: 110,
  simulatorRoute: "/simulators/respiratory-vq",
  simulatorParams: {
    fiO2: 0.21,
    paCO2: 40,
    rQuotient: 0.8,
    deadSpaceFraction: 0.3,
    shuntFraction: 0.05
  },
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Respiratory Mechanics, Alveolar Gas Equation & V/Q Dynamics

Pulmonary gas exchange relies on the precise balance of convective alveolar ventilation ($\\dot{V}_A$) and pulmonary capillary perfusion ($\\dot{Q}$).

---

## 1. The Alveolar Gas Equation

The Alveolar Gas Equation calculates the partial pressure of oxygen in alveolar gas ($P_A O_2$):

$$P_A O_2 = F_i O_2 \\cdot (P_{atm} - P_{H_2O}) - \\frac{P_a CO_2}{R}$$

Where:
- $F_i O_2$: Fraction of inspired oxygen ($0.21$ in room air).
- $P_{atm}$: Barometric pressure at sea level ($760\\text{ mmHg}$).
- $P_{H_2O}$: Water vapor pressure at body temperature $37^\\circ\\text{C}$ ($47\\text{ mmHg}$).
- $P_a CO_2$: Arterial carbon dioxide tension (normally $40\\text{ mmHg}$).
- $R$: Respiratory exchange ratio (typically $0.8$ on a standard mixed diet).

### Sea Level Normal Calculation:
$$P_A O_2 = 0.21 \\cdot (760 - 47) - \\frac{40}{0.8} = 0.21 \\cdot 713 - 50 = 149.7 - 50 = 99.7 \\approx 100\\text{ mmHg}$$

---

## 2. The Alveolar-Arterial (A-a) Gradient

The $A\\text{-}a$ gradient measures the efficiency of oxygen equilibration across the alveolar-capillary barrier:

$$\\text{A-a Gradient} = P_A O_2 - P_a O_2$$

- **Normal A-a Gradient**: $< 10 - 15\\text{ mmHg}$ in young adults, expanding with age:
  $$\\text{Expected Normal A-a} = \\frac{\\text{Age}}{4} + 4$$
- **Hypoxemia with Normal A-a Gradient**:
  - Hypoventilation (e.g. Opioid overdose, Guillain-Barré syndrome, Myasthenia gravis crisis).
  - High altitude (low inspired $P_i O_2$).
- **Hypoxemia with Elevated A-a Gradient**:
  - $V/Q$ Mismatch (e.g. COPD exacerbation, Asthma, Pulmonary embolism).
  - Right-to-Left Shunt (e.g. Tetralogy of Fallot, severe ARDS, alveolar consolidation).
  - Diffusion Impairment (e.g. Idiopathic Pulmonary Fibrosis).

---

## 3. Ventilation-Perfusion (V/Q) Mismatch & West Lung Zones

$$\\text{Overall Normal } \\frac{V}{Q} \\approx \\frac{4.2\\text{ L/min}}{5.0\\text{ L/min}} = 0.84$$

### Regional Variation (West Zones):
- **Apex (Zone 1 / Top of Lung)**: $V/Q \\approx 3.0$ (High ventilation relative to low hydrostatic perfusion). Highest $P_A O_2$ (~130 mmHg), making the apex the preferred site for *Mycobacterium tuberculosis* reactivation.
- **Base (Zone 3 / Bottom of Lung)**: $V/Q \\approx 0.6$ (High perfusion relative to ventilation). Lowest $P_A O_2$ (~89 mmHg).

### Extremes of V/Q Matching:
1. **Shunt ($V/Q = 0$)**: Perfusion without ventilation (e.g. Foreign body obstruction, Atelectasis, Complete lobar pneumonia). **Does NOT correct with 100% supplemental oxygen**.
2. **Dead Space ($V/Q = \\infty$)**: Ventilation without perfusion (e.g. Pulmonary Embolism obstructing pulmonary arterial branch). Alveolar gas tension equals room air ($P_A O_2 = 150\\text{ mmHg}$, $P_A CO_2 = 0\\text{ mmHg}$).

---

## 4. Alveolar Surface Tension & Law of Laplace

$$P = \\frac{2T}{r}$$

- Without pulmonary surfactant (dipalmitoylphosphatidylcholine, DPPC produced by **Type II Pneumocytes**), smaller alveoli ($r \\downarrow$) would generate higher collapse pressures and empty their air into larger alveoli (atelectasis).
- Surfactant lowers surface tension ($T$) proportionally more in smaller alveoli, stabilizing alveolar architecture and reducing the work of breathing.
- **Neonatal Respiratory Distress Syndrome (NRDS)**: Premature infants born before 32–34 weeks have insufficient surfactant production (Lecithin/Sphingomyelin ratio $< 2.0$), leading to widespread microatelectasis and intrapulmonary shunting.
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male is brought to the emergency department after an unintentional opioid overdose. Arterial blood gas analysis on room air reveals: pH 7.24, PaCO2 68 mmHg, PaO2 54 mmHg, and HCO3- 28 mEq/L.",
      question: "Assuming a barometric pressure of 760 mmHg, water vapor pressure of 47 mmHg, and respiratory quotient of 0.8, what is this patient's Alveolar-Arterial (A-a) oxygen gradient, and what is the underlying mechanism of hypoxemia?",
      options: [
        "A-a gradient = 11 mmHg; Hypoxemia secondary to pure alveolar hypoventilation with normal lung parenchyma",
        "A-a gradient = 35 mmHg; Hypoxemia secondary to significant ventilation-perfusion mismatch",
        "A-a gradient = 45 mmHg; Right-to-left intrapulmonary shunt refractory to oxygen therapy",
        "A-a gradient = 0 mmHg; Primary metabolic acidosis with respiratory compensation"
      ],
      correctAnswerIndex: 0,
      explanation: "Using the Alveolar Gas Equation: PAO2 = 0.21*(760 - 47) - (68/0.8) = 149.7 - 85 = 64.7 mmHg. The A-a gradient is PAO2 - PaO2 = 64.7 - 54 = 10.7 mmHg (~11 mmHg). An A-a gradient < 15 mmHg confirms pure central hypoventilation without intrinsic pulmonary parenchymal disease."
    }
  ]
};
