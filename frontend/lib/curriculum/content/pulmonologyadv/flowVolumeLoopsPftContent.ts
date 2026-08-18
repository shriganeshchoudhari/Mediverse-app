/**
 * Pulmonology: Flow-Volume Loops & Pulmonary Function Testing (PFT)
 * Authoritative medical content derived from West's Respiratory Physiology (11th ed.), Murray & Nadel's Textbook of Respiratory Medicine.
 * Mapped to NMC CBME Competencies: IM15.1, IM15.2, PY3.1, PY3.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FLOW_VOLUME_LOOPS_PFT_MODULE: PhysiologyLessonModule = {
  id: "pulmonology-adv-flow-volume-loops-pft",
  unitCode: "PU1.1",
  title: "Flow-Volume Loops, Spirometry, Obstructive vs Restrictive Patterns & Upper Airway Lesions",
  competencies: ["IM15.1", "IM15.2", "PY3.1", "PY3.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Flow-Volume Loops & Pulmonary Function Testing (PFT)

Pulmonary function tests measure dynamic airflow rates, static lung volumes, and alveolar-capillary gas diffusion to characterize respiratory pathology.

---

## 1. Obstructive vs Restrictive Spirometric Differentiation

$$\\begin{array}{lccccc}
\\hline
\\textbf{PFT Parameter} & \\textbf{Normal} & \\textbf{Obstructive Disease (COPD/Asthma)} & \\textbf{Intrinsic Restrictive (IPF)} & \\textbf{Extrinsic Restrictive (Chest Wall)} \\\\
\\hline
\\textbf{FEV}_1/\\textbf{FVC Ratio} & \\ge 0.70 - 0.80 & \\mathbf{\\downarrow\\text{ (}<0.70\\text{)}} & \\text{Normal or } \\mathbf{\\uparrow\\text{ (}\\ge 0.75\\text{)}} & \\text{Normal or } \\mathbf{\\uparrow\\text{ (}\\ge 0.75\\text{)}} \\\\
\\textbf{Total Lung Capacity (TLC)} & 80 - 120\\% & \\mathbf{\\uparrow} \\text{ (Hyperinflation / Air trapping)} & \\mathbf{\\downarrow\\text{ (}<80\\%\\text{)}} & \\mathbf{\\downarrow\\text{ (}<80\\%\\text{)}} \\\\
\\textbf{Residual Volume (RV)} & 80 - 120\\% & \\mathbf{\\uparrow\\uparrow} \\text{ (Air trapping)} & \\mathbf{\\downarrow} & \\text{Normal or } \\downarrow \\\\
\\textbf{DLCO (Diffusion Capacity)} & 80 - 120\\% & \\mathbf{\\downarrow} \\text{ in Emphysema; Normal in Asthma} & \\mathbf{\\downarrow\\downarrow} \\text{ (thickened interstitium)} & \\mathbf{\\text{NORMAL}} \\\\
\\hline
\\end{array}$$

- **Asthma Bronchodilator Reversibility Criteria**: Increase in $\\text{FEV}_1$ or $\\text{FVC}$ by $>12\\%$ AND $>200\\text{ mL}$ post-inhaled short-acting $\\beta_2$-agonist (Albuterol).

---

## 2. Upper Airway Obstruction Morphologies on Flow-Volume Loops

$$\\begin{array}{llll}
\\hline
\\textbf{Lesion Category} & \\textbf{Pathological Etiology} & \\textbf{Inspiratory Loop} & \\textbf{Expiratory Loop} \\\\
\\hline
\\textbf{Fixed Upper Airway Obstruction} & \\text{Tracheal stenosis, retrosternal goiter} & \\mathbf{\\text{FLATTENED}} & \\mathbf{\\text{FLATTENED}} \\\\
\\textbf{Variable Extrathoracic Obstruction} & \\text{Vocal cord paralysis, laryngomalacia} & \\mathbf{\\text{FLATTENED}} & \\text{Normal (Preserved)} \\\\
\\textbf{Variable Intrathoracic Obstruction} & \\text{Tracheomalacia, distal tracheal tumor} & \\text{Normal (Preserved)} & \\mathbf{\\text{FLATTENED}} \\\\
\\hline
\\end{array}$$

- **Physiological Basis of Extrathoracic vs Intrathoracic Obstruction**:
  - **Extrathoracic (Vocal Cords)**: During inspiration, airway pressure is negative relative to atmospheric pressure $\\rightarrow$ transmural collapse of flexible extrathoracic lesion $\\rightarrow$ **Inspiratory Plateau**.
  - **Intrathoracic (Carina / Mainstem)**: During forced expiration, pleural pressure becomes positive relative to airway lumen $\\rightarrow$ dynamic compression of flexible intrathoracic lesion $\\rightarrow$ **Expiratory Plateau**.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old female with a history of prolonged endotracheal intubation following a motor vehicle collision 6 months ago presents with progressive exertional dyspnea and audible biphasic stridor. Spirometry and flow-volume loop analysis demonstrate: FEV1 1.8 L (55% predicted), FVC 2.2 L (60% predicted), and FEV1/FVC ratio 0.82. Visual inspection of the flow-volume loop reveals marked, symmetrical plateauing/flattening of both the inspiratory and expiratory flow limbs, creating a box-like rectangular appearance.",
      question: "Which of the following is the most likely diagnosis and underlying mechanism?",
      options: [
        "Fixed Upper Airway Obstruction secondary to post-intubation tracheal stenosis",
        "Variable Extrathoracic Obstruction secondary to bilateral vocal cord paralysis",
        "Variable Intrathoracic Obstruction secondary to tracheomalacia",
        "Severe Chronic Obstructive Pulmonary Disease with dynamic hyperinflation"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient demonstrates the classic flow-volume loop of a Fixed Upper Airway Obstruction, characterized by severe flattening and plateauing of BOTH the inspiratory and expiratory flow limbs. In fixed obstructions (such as post-intubation circumferential fibrotic tracheal stenosis or a large non-compliant goiter), the orifice diameter remains constant throughout the respiratory cycle regardless of transmural pressure changes, limiting airflow equally during both inspiration and expiration."
    }
  ]
};
