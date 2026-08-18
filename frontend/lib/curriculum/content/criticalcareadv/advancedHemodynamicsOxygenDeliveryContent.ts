/**
 * Critical Care: Advanced Hemodynamic Monitoring & Oxygen Delivery Dynamics
 * Authoritative medical content derived from Marino's The ICU Book (4th ed.), Irwin and Rippe's Intensive Care Medicine.
 * Mapped to NMC CBME Competencies: CC1.1, CC1.2, AN23.1, MD36.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADVANCED_HEMODYNAMICS_OXYGEN_DELIVERY_MODULE: PhysiologyLessonModule = {
  id: "critical-care-adv-hemodynamics-oxygen-delivery",
  unitCode: "CC1.1",
  title: "Advanced Hemodynamic Monitoring: DO2/VO2 Dynamics, Swan-Ganz Catheterization & ScvO2",
  competencies: ["CC1.1", "CC1.2", "AN23.1", "MD36.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Advanced Hemodynamics & Oxygen Transport Dynamics

In the intensive care unit, circulatory failure is defined by cellular dysoxia: an imbalance between systemic oxygen delivery ($DO_2$) and metabolic oxygen consumption ($VO_2$).

---

## 1. Mathematical Equations of Oxygen Transport

$$CaO_2 = (1.34 \\times [Hb] \\times SaO_2) + (0.003 \\times PaO_2)$$
$$DO_2 = CO \\times CaO_2 \\times 10 \\approx 1,000\\text{ mL } O_2\\text{/min}$$
$$VO_2 = CO \\times (CaO_2 - CvO_2) \\times 10 \\approx 250\\text{ mL } O_2\\text{/min}$$
$$O_2ER = \\frac{VO_2}{DO_2} = \\frac{CaO_2 - CvO_2}{CaO_2} \\approx 25\\%$$

- **The Critical $DO_2$ Threshold ($DO_{2\\text{crit}}$)**:
  - Normally, $VO_2$ is independent of $DO_2$ because tissues increase their Oxygen Extraction Ratio ($O_2ER$) up to $60-70\\%$ during reductions in blood flow or arterial oxygen content.
  - When $DO_2$ drops below the critical threshold ($\approx 330\\text{ mL/min/m}^2$), extraction cannot increase further $\\rightarrow$ **$VO_2$ becomes supply-dependent**, triggering cellular dysoxia, anaerobic metabolism, and systemic hyperlactatemia.

---

## 2. Pulmonary Artery (Swan-Ganz) Catheterization

$$\\begin{array}{lcccc}
\\hline
\\textbf{Chamber / Vessel} & \\textbf{Normal Pressure (mmHg)} & \\textbf{Waveform Morphology} & \\textbf{Clinical Correlate} \\\\
\\hline
\\textbf{Right Atrium (RA / CVP)} & 0 - 8 & a, c, v\\text{ waves; } x, y\\text{ descents} & \\text{Right ventricular preload} \\\\
\\textbf{Right Ventricle (RV)} & 15 - 30 \\, / \\, 0 - 8 & \\text{Sharp systolic rise, diastolic drop} & \\text{Pulsatile ventricular pressure} \\\\
\\textbf{Pulmonary Artery (PA)} & 15 - 30 \\, / \\, 4 - 12 & \\mathbf{\\text{Dicrotic notch (pulmonic valve)}} & \\text{PA diastolic } \\approx \\text{ PCWP} \\\\
\\textbf{Pulmonary Capillary Wedge (PCWP)} & 4 - 12 & \\text{Blunted } a \\text{ and } v \\text{ waves} & \\mathbf{\\text{Left ventricular end-diastolic pressure (LVEDP)}} \\\\
\\hline
\\end{array}$$

- **Mixed Venous Saturation ($SvO_2$, Normal $65-75\\%$)**:
  - **Low $SvO_2$ ($<65\\%$)**: Cardiogenic shock, hypovolemic shock, severe anemia, hypoxemia, or shivering (increased tissue extraction).
  - **High $SvO_2$ ($>75-80\\%$)**: Septic shock (microcirculatory shunting / mitochondrial dysfunction / histotoxic dysoxia), Cyanide poisoning, or hypothermia.
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old male with severe ischemic cardiomyopathy is admitted to the cardiac ICU in cardiogenic shock. A Swan-Ganz pulmonary artery catheter is placed. Hemodynamic profile reveals: BP 84/52 mmHg, HR 108 bpm, Central Venous Pressure (CVP) 16 mmHg, Pulmonary Artery Pressure (PAP) 48/26 mmHg, Pulmonary Capillary Wedge Pressure (PCWP) 24 mmHg, Cardiac Index (CI) 1.6 L/min/m2, Systemic Vascular Resistance (SVR) 2,100 dynes-sec/cm5, and Mixed Venous Oxygen Saturation (SvO2) 48%. Arterial blood gas shows: pH 7.28, PaO2 88 mmHg on 40% FiO2, and Serum Lactate 4.2 mmol/L.",
      question: "Which of the following explains the patient's low SvO2 (48%) and elevated lactate, and what is the most appropriate inotropic intervention?",
      options: [
        "Severe tissue hypoperfusion causing maximal cellular oxygen extraction from low forward cardiac output; Initiation of Dobutamine (beta-1 inotrope) to augment cardiac index and systemic oxygen delivery (DO2)",
        "Microcirculatory vasodilation with impaired tissue oxygen extraction; Rapid infusion of 3 liters of normal saline",
        "Cyanide toxicity from nitroprusside; Administration of Hydroxocobalamin",
        "Primary severe hypoxemic respiratory failure; Immediate initiation of VV-ECMO"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient demonstrates classic cardiogenic shock with profound pump failure: severely depressed Cardiac Index (1.6 L/min/m2), high filling pressures (PCWP 24 mmHg, CVP 16 mmHg), and high afterload (SVR 2100 dynes-sec/cm5). Because forward systemic oxygen delivery (DO2) has dropped below the critical threshold (DO2crit), peripheral tissues must extract maximal oxygen from capillary blood to sustain metabolism, causing mixed venous saturation (SvO2) to plummet to 48% (normal 65-75%). Anaerobic metabolism produces hyperlactatemia. The treatment of choice is an inotrope like Dobutamine (beta-1 adrenergic agonist) to increase myocardial contractility, augment cardiac output, and restore oxygen delivery."
    }
  ]
};
