/**
 * Pulmonology: ARDS Pathophysiology, Berlin Criteria & Prone Positioning
 * Authoritative medical content derived from ARDSNet Guidelines, Murray & Nadel's Respiratory Medicine, West's Physiology.
 * Mapped to NMC CBME Competencies: IM17.1, IM17.2, SU25.3, SU25.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ARDS_BERLIN_DEFINITIONS_PRONE_MODULE: PhysiologyLessonModule = {
  id: "pulmonology-adv-ards-berlin-definitions-prone",
  unitCode: "PU5.1",
  title: "ARDS Pathophysiology: Berlin Definition, ARDSNet Low Tidal Volume (4-8 mL/kg) & Prone Positioning",
  competencies: ["IM17.1", "IM17.2", "SU25.3", "SU25.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Acute Respiratory Distress Syndrome (ARDS) & Advanced Rescue

ARDS is an acute, diffuse, inflammatory lung injury characterized by increased pulmonary vascular permeability, alveolar flooding, surfactant inactivation, and extensive true shunt ($\\dot{V}/\\dot{Q} = 0$).

---

## 1. The Berlin Diagnostic Definition of ARDS

$$\\begin{array}{ll}
\\hline
\\textbf{Diagnostic Category} & \\textbf{Berlin Consensus Criteria} \\\\
\\hline
\\textbf{Timing} & \\text{Acute onset within 1 week of a known clinical insult or new/worsening respiratory symptoms} \\\\
\\textbf{Chest Imaging (CXR/CT)} & \\text{Bilateral opacities consistent with pulmonary edema not fully explained by effusions, collapse, or nodules} \\\\
\\textbf{Origin of Edema} & \\text{Respiratory failure not fully explained by cardiac failure or fluid overload (objective exclusion via echo)} \\\\
\\textbf{Oxygenation (on PEEP } \\ge 5\\text{)} & \\text{• }\\mathbf{\\text{Mild ARDS: }} 200 \u003c \\text{PaO}_2/\\text{FiO}_2 \\le 300\\text{ mmHg} \\\\
& \\text{• }\\mathbf{\\text{Moderate ARDS: }} 100 \u003c \\text{PaO}_2/\\text{FiO}_2 \\le 200\\text{ mmHg} \\\\
& \\text{• }\\mathbf{\\text{Severe ARDS: }} \\text{PaO}_2/\\text{FiO}_2 \\le 100\\text{ mmHg} \\\\
\\hline
\\end{array}$$

---

## 2. ARDSNet Lung-Protective Mechanical Ventilation Strategy

1. **Low Tidal Volume Ventilation**: $V_T = 4 - 8\\text{ mL/kg}$ of **Predicted Body Weight (PBW)** (NOT actual body weight!) to prevent volutrauma.
   $$\\text{PBW (Males)} = 50 + 0.91 \\times [\\text{Height (cm)} - 152.4]$$
   $$\\text{PBW (Females)} = 45.5 + 0.91 \\times [\\text{Height (cm)} - 152.4]$$
2. **Limit Plateau Pressure**: Maintain $P_{\\text{plat}} \\le 30\\text{ cmH}_2\\text{O}$ (prevents barotrauma/alveolar rupture).
3. **Driving Pressure Minimization**: Target $\\Delta P = P_{\\text{plat}} - \\text{PEEP} < 15\\text{ cmH}_2\\text{O}$.
4. **Permissive Hypercapnia**: Allow respiratory acidosis ($\text{pH} \\ge 7.20$) to maintain low tidal volume protection.

---

## 3. Severe ARDS Rescue Therapies

- **Prone Positioning (PROSEVA Trial)**:
  - **Indication**: Moderate-to-Severe ARDS with $\\text{PaO}_2/\\text{FiO}_2 < 150\\text{ mmHg}$ on $\\text{FiO}_2 \\ge 0.60$ and $\\text{PEEP} \\ge 10\\text{ cmH}_2\\text{O}$.
  - **Protocol**: **$\\ge 16\\text{ consecutive hours per day}$ in the prone position**.
  - **Mechanisms**: Recruits collapsed dorsal lung units, produces more homogeneous transpulmonary pressure distribution, reduces ventral-dorsal pleural pressure gradient, relieves cardiac compression of posterior lung, and dramatically reduces mortality.
- **Early Neuromuscular Blockade (ACURASYS Trial)**: 48-hour continuous infusion of Cisatracurium for $\\text{P/F} < 150$ to eliminate patient-ventilator dyssynchrony.
- **Veno-Venous Extracorporeal Membrane Oxygenation (VV-ECMO)**: Extracorporeal gas exchange for refractory hypoxemia ($\text{P/F} < 80$ for $>6\\text{ hours}$).
`,
  clinicalVignettes: [
    {
      scenario: "A 36-year-old female (height: 165 cm, actual weight: 95 kg, predicted body weight: 57 kg) with severe urosepsis is intubated in the ICU for acute hypoxemic respiratory failure. Her arterial blood gas on FiO2 0.80 and PEEP 14 cmH2O shows: pH 7.28, PaCO2 50 mmHg, and PaO2 88 mmHg (P/F ratio = 110 mmHg, confirming Moderate-to-Severe ARDS). Chest radiography reveals diffuse bilateral infiltrates without cardiomegaly.",
      question: "Which of the following represents the appropriate initial tidal volume setting and evidence-based rescue intervention indicated for this patient?",
      options: [
        "Tidal volume of 340 mL (6 mL/kg PBW) and initiation of prone positioning for >=16 hours/day",
        "Tidal volume of 570 mL (6 mL/kg actual weight) and high-dose intravenous methylprednisolone",
        "Tidal volume of 800 mL and immediate placement of an intra-aortic balloon pump",
        "Discontinuation of PEEP and immediate extubation to high-flow nasal cannula"
      ],
      correctAnswerIndex: 0,
      explanation: "According to the ARDSNet protocol and the PROSEVA trial, lung-protective ventilation requires low tidal volumes of 6 mL/kg based on Predicted Body Weight (PBW = 57 kg; 6 x 57 = 342 mL ~ 340 mL) rather than actual weight (to avoid massive volutrauma). In patients with severe/moderate ARDS whose PaO2/FiO2 ratio remains <150 mmHg despite lung-protective settings, Prone Positioning for at least 16 hours per day provides a significant, proven mortality reduction by recruiting dorsal alveolar units and improving ventilation-perfusion matching."
    }
  ]
};
