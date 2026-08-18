/**
 * Pulmonology: Hypoxemia Pathophysiology, A-a Gradient & Capnography
 * Authoritative medical content derived from West's Respiratory Physiology (11th ed.), Tobin's Mechanical Ventilation.
 * Mapped to NMC CBME Competencies: IM18.1, IM18.2, AN21.1, AN21.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HYPOXEMIA_MECHANISMS_CAPNOGRAPHY_MODULE: PhysiologyLessonModule = {
  id: "pulmonology-adv-hypoxemia-mechanisms-capnography",
  unitCode: "PU7.1",
  title: "Mechanisms of Hypoxemia, Alveolar Gas Equation, A-a Gradient & Capnography Waveforms",
  competencies: ["IM18.1", "IM18.2", "AN21.1", "AN21.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Hypoxemia Pathophysiology, Alveolar Gas Equation & Capnography

The assessment of arterial oxygenation and ventilation requires systematic calculation of the Alveolar-arterial ($A\\text{-}a$) oxygen gradient and analysis of quantitative capnography ($\\text{EtCO}_2$) waveforms.

---

## 1. The Five Pathophysiological Mechanisms of Hypoxemia

$$\\begin{array}{lcccc}
\\hline
\\textbf{Mechanism of Hypoxemia} & \\textbf{PaCO}_2 & \\textbf{A-a Gradient} & \\textbf{Response to 100\\% O}_2 & \\textbf{Clinical Examples} \\\\
\\hline
\\textbf{1. Low Inspired FiO}_2 & \\text{Normal} & \\mathbf{\\text{NORMAL}} & \\mathbf{\\text{YES (Corrects)}} & \\text{High altitude, enclosed space} \\\\
\\textbf{2. Hypoventilation} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\text{NORMAL}} & \\mathbf{\\text{YES (Corrects)}} & \\text{Opioid overdose, Guillain-Barré, ALS} \\\\
\\textbf{3. V/Q Mismatch} & \\text{Normal / }\\downarrow & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\text{YES (Corrects)}} & \\text{COPD, Asthma, Pneumonia, Pulmonary Embolism} \\\\
\\textbf{4. Right-to-Left Shunt} & \\text{Normal / }\\downarrow & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\text{REFRACTORY (NO!)}} & \\text{ARDS, Pulmonary AVM, Eisenmenger VSD} \\\\
\\textbf{5. Diffusion Impairment} & \\text{Normal / }\\downarrow & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\text{YES (Corrects)}} & \\text{Idiopathic Pulmonary Fibrosis (IPF)} \\\\
\\hline
\\end{array}$$

---

## 2. The Alveolar Gas Equation & $A\\text{-}a$ Gradient

- **Alveolar Oxygen Tension ($\\text{PAO}_2$)**:
  $$\\text{PAO}_2 = \\text{FiO}_2 \\times (P_{\\text{atm}} - P_{\\text{H}_2\\text{O}}) - \\frac{\\text{PaCO}_2}{R} = 0.21 \\times (760 - 47) - \\frac{\\text{PaCO}_2}{0.8} \\approx 150 - 1.25 \\times \\text{PaCO}_2$$
- **Alveolar-arterial ($A\\text{-}a$) Oxygen Gradient**:
  $$A\\text{-}a\\text{ Gradient} = \\text{PAO}_2 - \\text{PaO}_2 \\quad (\\text{Normal: } \\frac{\\text{Age}}{4} + 4 \\text{ or } \u003c15\\text{ mmHg on room air})$$

---

## 3. Quantitative Capnography ($\\text{EtCO}_2$) Waveform Morphology

- **Phases of the Normal Capnogram**:
  - **Phase I**: Inspiratory baseline (anatomical dead space gas, $\\text{CO}_2 = 0$).
  - **Phase II**: Expiratory upstroke (rapid mixing of dead space and alveolar gas).
  - **Phase III**: Alveolar plateau (pure alveolar gas exhalation).
  - **Point D**: End-Tidal $\\text{CO}_2$ ($\\text{EtCO}_2$; peak measurement at end-expiration).
  - **Phase 0**: Rapid inspiratory downstroke back to baseline.
- **Pathological Capnogram Patterns**:
  - **"Shark-Fin" Sloping Upward Plateau (Loss of Phase III flat plateau)**: Severe **bronchospasm / airflow obstruction** (Asthma exacerbation, severe COPD, partially obstructed ETT).
  - **Sudden Drop of $\\text{EtCO}_2$ to Zero**: Esophageal intubation, ventilator circuit disconnection, total airway extubation.
  - **Sudden Exponential Decrease in $\\text{EtCO}_2$**: Acute massive pulmonary embolism or circulatory arrest (loss of pulmonary capillary perfusion).
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male is brought to the emergency department unconscious following an accidental overdose of intravenous heroin. Vital signs: BP 96/60 mmHg, HR 54 bpm, RR 6/min, SpO2 82% on room air. Arterial blood gas analysis on room air (FiO2 0.21) demonstrates: pH 7.22, PaCO2 68 mmHg, and PaO2 55 mmHg. Room air Alveolar PO2 is calculated as PAO2 = 150 - (1.25 x 68) = 65 mmHg.",
      question: "Which of the following represents the patient's calculated A-a oxygen gradient and the primary underlying mechanism of hypoxemia?",
      options: [
        "A-a gradient = 10 mmHg (Normal); Pure Alveolar Hypoventilation secondary to central respiratory depression",
        "A-a gradient = 45 mmHg (Elevated); Right-to-left intrapulmonary shunt",
        "A-a gradient = 35 mmHg (Elevated); Severe ventilation-perfusion mismatch",
        "A-a gradient = 5 mmHg (Normal); Diffusion impairment across alveolar-capillary membrane"
      ],
      correctAnswerIndex: 0,
      explanation: "In this patient with opioid overdose, PAO2 is 65 mmHg and PaO2 is 55 mmHg, yielding an A-a gradient of PAO2 - PaO2 = 65 - 55 = 10 mmHg (which is completely NORMAL for a 24-year-old, where normal is <10-15 mmHg). A normal A-a gradient in the setting of severe hypercapnia (PaCO2 68 mmHg) and hypoxemia (PaO2 55 mmHg) is pathognomonic of Pure Alveolar Hypoventilation caused by central respiratory drive depression from opioids, requiring immediate administration of IV Naloxone and airway support."
    }
  ]
};
