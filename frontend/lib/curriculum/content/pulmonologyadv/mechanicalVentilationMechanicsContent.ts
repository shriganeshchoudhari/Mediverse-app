/**
 * Pulmonology: Mechanical Ventilation Modes, Mechanics & Troubleshooting
 * Authoritative medical content derived from Tobin's Principles of Mechanical Ventilation (3rd ed.), West's Respiratory Physiology.
 * Mapped to NMC CBME Competencies: SU25.1, SU25.2, IM16.1, IM16.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MECHANICAL_VENTILATION_MECHANICS_MODULE: PhysiologyLessonModule = {
  id: "pulmonology-adv-mechanical-ventilation-mechanics",
  unitCode: "PU3.1",
  title: "Mechanical Ventilation: Modes (VCV vs PCV), Pressures (PIP vs Pplat), Compliance & High PIP Troubleshooting",
  competencies: ["SU25.1", "SU25.2", "IM16.1", "IM16.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Mechanical Ventilation Modes, Mechanics & Troubleshooting

Invasive mechanical ventilation provides positive-pressure alveolar ventilation, requiring careful monitoring of airway pressures, respiratory mechanics, and lung compliance.

---

## 1. Ventilator Pressures & Mechanics Equations

- **Peak Inspiratory Pressure (PIP)**: The maximum pressure measured at the airway opening during inspiration (reflects total resistive work of the circuit/airway PLUS elastic work of the lungs/chest wall).
- **Plateau Pressure ($P_{\\text{plat}}$)**: Pressure measured during an **end-inspiratory pause (hold)** when airflow ceases ($\\text{Flow} = 0$). Eliminates airway resistive pressure, directly reflecting **true alveolar distending pressure** (Target: $P_{\\text{plat}} \\le 30\\text{ cmH}_2\\text{O}$).
- **Static Respiratory System Compliance ($C_{\\text{stat}}$)**:
  $$C_{\\text{stat}} = \\frac{V_T}{P_{\\text{plat}} - \\text{PEEP}} \\quad (\\text{Normal: } 50 - 80\\text{ mL/cmH}_2\\text{O}; \\text{ severely reduced in ARDS } \u003c30)$$
- **Airway Resistance ($R_{\\text{aw}}$)**:
  $$R_{\\text{aw}} = \\frac{\\text{PIP} - P_{\\text{plat}}}{\\text{Inspiratory Flow Rate}} \\quad (\\text{Normal: } \u003c10\\text{ cmH}_2\\text{O}/(\\text{L/sec}))$$
- **Driving Pressure ($\\Delta P$)**:
  $$\\Delta P = P_{\\text{plat}} - \\text{PEEP} \\quad (\\text{Target: } \\Delta P \u003c 15\\text{ cmH}_2\\text{O}; \\text{ primary prognostic determinant of ARDS mortality})$$

---

## 2. High Peak Inspiratory Pressure (PIP) Troubleshooting Algorithm

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pressure Pattern} & \\textbf{PIP} & \\textbf{P}_{\\text{plat}} & \\textbf{Underlying Pathological Mechanism} & \\textbf{Immediate Corrective Action} \\\\
\\hline
\\textbf{High Resistance Pattern} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\text{NORMAL}} & \\textbf{Airway Resistance Problem} & \\text{Suction secretions, administer} \\\\
& & (\\le 30) & \\text{• Endotracheal tube biting/kinking} & \\text{bronchodilators (Albuterol),} \\\\
& & & \\text{• Severe bronchospasm / asthma} & \\text{insert bite block, clear ETT} \\\\
& & & \\text{• Mucus plugging / secretions} & \\\\
\\hline
\\textbf{Low Compliance Pattern} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow\\uparrow} & \\textbf{Lung / Chest Compliance Problem} & \\text{Decompress tension pneumothorax,} \\\\
& & (\u003e30) & \\text{• Tension pneumothorax (EMERGENCY!)} & \\text{withdraw ETT from right mainstem,} \\\\
& & & \\text{• Severe ARDS / Pulmonary edema} & \\text{optimize PEEP/paralysis} \\\\
& & & \\text{• Mainstem right bronchus intubation} & \\\\
& & & \\text{• Massive atelectasis / Abdominal hypertension} & \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old intubated male with severe acute pancreatitis in the ICU suddenly triggers the high-pressure ventilator alarm. The ventilator is set in Volume-Control Assist-Control (VCV) mode with Tidal Volume 420 mL, PEEP 10 cmH2O, and FiO2 0.70. Monitoring reveals: Peak Inspiratory Pressure (PIP) has acutely increased from 28 to 46 cmH2O. An end-inspiratory pause is performed, demonstrating a Plateau Pressure (Pplat) of 42 cmH2O (up from 22 cmH2O). Auscultation reveals absent breath sounds over the entire left hemithorax with tracheal deviation to the right and acute hypotension (BP 74/42 mmHg).",
      question: "Which of the following represents the underlying mechanism and the immediate life-saving intervention indicated for this patient?",
      options: [
        "Decreased lung compliance due to Tension Pneumothorax; Immediate needle thoracostomy decompression in the 2nd intercostal space midclavicular line",
        "Increased airway resistance due to severe bronchospasm; Inhaled albuterol and intravenous methylprednisolone",
        "Endotracheal tube kink; Repositioning and suctioning of the endotracheal tube",
        "Acute pulmonary embolism; Immediate intravenous administration of tissue plasminogen activator (tPA)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits a simultaneous acute elevation in BOTH Peak Inspiratory Pressure (PIP 46 cmH2O) and Plateau Pressure (Pplat 42 cmH2O), indicating a severe, acute reduction in static respiratory compliance (Driving Pressure = 42 - 10 = 32 cmH2O). The sudden drop in compliance, accompanied by unilateral absent breath sounds, tracheal deviation, and obstructive shock (hypotension 74/42 mmHg), confirms a Tension Pneumothorax. The immediate, life-saving intervention is emergency needle decompression followed by tube thoracostomy."
    }
  ]
};
