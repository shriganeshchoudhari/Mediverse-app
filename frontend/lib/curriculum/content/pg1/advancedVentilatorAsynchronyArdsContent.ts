/**
 * Postgraduate Core Clinical Foundations & Residency Readiness: Advanced Mechanical Ventilation & ARDS
 * Authoritative pulmonary critical care content derived from ARDSNet Protocols, PROSEVA Trial, Tobin's Mechanical Ventilation.
 * Mapped to NMC PG CBME Competencies: PG1.2, CC2.1, CC2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADVANCED_VENTILATOR_ASYNCHRONY_ARDS_MODULE: PhysiologyLessonModule = {
  id: "pg1-advanced-ventilator-asynchrony-ards",
  unitCode: "PG1.2",
  title: "Advanced Mechanical Ventilation: ARDSNet Lung-Protective Strategy, Driving Pressure, Prone Positioning & Asynchronies",
  competencies: ["PG1.2", "CC2.1", "CC2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Advanced Mechanical Ventilation, ARDS & Asynchrony Waveforms

Lung-protective mechanical ventilation targets driving pressures, prone gas exchange optimizations, and ventilator-waveform dyssynchrony terminations.

---

## 1. ARDS Berlin Definition & ARDSNet Lung-Protective Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Severity Category} & \\textbf{PaO}_2 / \\textbf{FiO}_2\\textbf{ Ratio (P/F)} & \\textbf{PEEP Requirement} & \\textbf{Mortality Risk} \\\\
\\hline
\\textbf{Mild ARDS} & 201-300\\text{ mmHg} & \\text{PEEP } \\ge 5\\text{ cmH}_2\\text{O} & 27\\% \\\\
\\textbf{Moderate ARDS} & 101-200\\text{ mmHg} & \\text{PEEP } \\ge 5\\text{ cmH}_2\\text{O} & 32\\% \\\\
\\textbf{Severe ARDS} & \\mathbf{\\le 100\\text{ mmHg}} & \\text{PEEP } \\ge 5\\text{ cmH}_2\\text{O} & \\mathbf{45\\% (\\text{High})} \\\\
\\hline
\\end{array}$$

$$\\begin{array}{lcccc}
\\hline
\\textbf{Lung-Protective Target} & \\textbf{Standard Clinical Value} & \\textbf{Pathophysiological Rationale} \\\\
\\hline
\\textbf{Target Tidal Volume (} V_t \\text{)} & \\mathbf{4-6\\text{ mL/kg Predicted Body Weight (PBW)}} & \\text{Prevents volutrauma and alveolar overdistension} \\\\
\\textbf{Plateau Pressure (} P_{\\text{plat}} \\text{)} & \\mathbf{\\le 30\\text{ cmH}_2\\text{O (measured at end-inspiratory pause)}} & \\text{Limits alveolar barotrauma} \\\\
\\textbf{Driving Pressure (} \\Delta P \\text{)} & \\mathbf{\\Delta P = P_{\\text{plat}} - PEEP \\le 14\\text{ cmH}_2\\text{O}} & \\mathbf{\\text{Strongest predictor of ARDS survival (Amato 2015)}} \\\\
\\textbf{Permissive Hypercapnia} & \\text{Allow } PaCO_2 \\text{ to rise as long as } \\mathbf{\\text{pH } \\ge 7.20} & \\text{Avoids high airway pressures to normalize } CO_2 \\\\
\\hline
\\end{array}$$

---

## 2. Advanced ARDS Adjuncts: Prone Positioning & Paralysis

- **Prone Positioning (PROSEVA Trial)**:
  - Indication: Moderate-to-severe ARDS with **$PaO_2/FiO_2 < 150\\text{ mmHg}$** despite lung-protective settings.
  - Duration: **$\\ge 16\\text{ consecutive hours per day}$**.
  - Mechanism: Homogenizes transpulmonary pressure gradients, recruits dorsal lung units, decreases dead space, and unloads right ventricular afterload.
- **Neuromuscular Blockade (ACURASYS Trial)**:
  - Continuous **Cisatracurium infusion for 48 hours** in early severe ARDS ($P/F < 150$) terminates patient-ventilator asynchrony and reduces inflammatory biotrauma.

---

## 3. Patient-Ventilator Asynchrony Waveform Recognition

$$\\begin{array}{lcccc}
\\hline
\\textbf{Asynchrony Type} & \\textbf{Waveform Manifestation} & \\textbf{Root Cause} & \\textbf{Therapeutic Adjustment} \\\\
\\hline
\\textbf{Double Triggering} & \\mathbf{\\text{Two consecutive breaths delivered}} & \\text{Patient inspiratory time exceeds} & \\mathbf{\\text{Increase } V_t \\text{ / inspiratory time,}} \\\\
& \\mathbf{\\text{with single trigger (\"breath stacking\")}} & \\text{ventilator set inspiratory time} & \\text{or deepen neuromuscular sedation} \\\\
\\textbf{Flow Starvation} & \\text{Inward concavity / \"scalloping\"} & \\text{Patient peak inspiratory demand} & \\mathbf{\\text{Increase peak flow rate (>60-80 L/m)}} \\\\
& \\text{of the inspiratory pressure waveform} & \\text{exceeds ventilator set flow} & \\text{or switch to pressure-control mode} \\\\
\\textbf{Auto-PEEP} & \\mathbf{\\text{Expiratory flow fails to return to zero}} & \\text{Dynamic hyperinflation / air trapping} & \\mathbf{\\text{Decrease respiratory rate, increase flow}} \\\\
(\\textbf{Intrinsic PEEP}) & \\mathbf{\\text{baseline before next breath starts}} & \\text{(severe COPD / Status Asthmaticus)} & (\\mathbf{I:E \\text{ ratio } 1:3 \\text{ or } 1:4\\text{)}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 46-year-old male with severe COVID-19/influenza acute respiratory distress syndrome (ARDS) is intubated on volume-control mechanical ventilation. His height is 178 cm (Predicted Body Weight = 73 kg). Current ventilator settings are: Tidal volume 550 mL, PEEP 14 cmH2O, FiO2 0.80, Respiratory rate 24/min. ABG reveals: pH 7.26, PaCO2 54 mmHg, PaO2 68 mmHg (P/F ratio = 85). End-inspiratory pause measurement reveals an airway Plateau Pressure (Pplat) of 34 cmH2O, and the ventilator graphic displays double-triggering breath-stacking waveforms with tidal volumes spiking to 950 mL.",
      question: "What is the calculated Driving Pressure, what adjustments must be made to the tidal volume and position, and how should the asynchrony be managed?",
      options: [
        "Current Driving Pressure = 20 cmH2O (Pplat 34 - PEEP 14; dangerously elevated above the <=14 cmH2O threshold); immediate management requires reducing Tidal Volume to 4-6 mL/kg PBW (290-440 mL for 73 kg PBW) to lower Pplat <=30 cmH2O, initiating prone positioning for >=16 hours/day (PROSEVA protocol for P/F <150), and administering a continuous Cisatracurium neuromuscular blockade infusion to eliminate double-triggering breath stacking",
        "Increase tidal volume to 800 mL and switch to spontaneous CPAP",
        "Decrease PEEP to 0 cmH2O and extubate immediately",
        "Maintain current tidal volume and administer subcutaneous terbutaline"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates severe ARDS ventilator management: (1) Driving Pressure: Calculated as Pplat - PEEP (34 - 14 = 20 cmH2O); values >14 cmH2O significantly increase mortality; (2) Lung-Protective Strategy: Tidal volume must be calculated based on Predicted Body Weight (PBW = 73 kg), mandating reduction to 4-6 mL/kg (300-430 mL) to bring Pplat <=30 cmH2O and Driving Pressure <=14 cmH2O; (3) Prone Positioning: Proven by PROSEVA to cut ARDS mortality nearly in half when applied for >=16 consecutive hours/day in patients with P/F <150; (4) Paralysis: Cisatracurium infusion terminates severe double-triggering asynchrony and prevents fatal barotrauma."
    }
  ]
};
