/**
 * Pulmonary Function Tests (PFTs), Spirometry Interpretation & Flow-Volume Loops
 * Authoritative medical content derived from ATS/ERS Guidelines, GOLD 2024, GINA 2024, and USMLE Step 2/3 Pulmonology.
 * Mapped to NMC CBME Competencies: CT1.1, CT1.2, CT2.1, CT2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPIROMETRY_PFT_FLOW_VOLUME_CURVES_MODULE: PhysiologyLessonModule = {
  id: "resp-spirometry-pft-flow-volume-curves",
  unitCode: "CT1.1",
  title: "Pulmonology: Pulmonary Function Tests (PFTs), Spirometry & Flow-Volume Loops (Asthma vs COPD)",
  competencies: ["CT1.1", "CT1.2", "CT2.1", "CT2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Pulmonology: Pulmonary Function Tests (PFTs), Spirometry & Flow-Volume Loops (Asthma vs COPD)

Pulmonary function testing objectively quantifies respiratory mechanics, differentiates obstructive from restrictive pathophysiology, and assesses diffusion capacity across the alveolar-capillary membrane.

---

## 1. Stepwise Diagnostic Algorithm for PFT Interpretation

$$\\text{Step 1: Check } \\frac{FEV_1}{FVC} \\text{ Ratio} \\rightarrow \\text{Step 2: Check } FVC \\text{ and } TLC \\rightarrow \\text{Step 3: Check } DLCO$$

| Step & Parameter | Finding & Threshold | Pathophysiological Interpretation & Differentials |
| :--- | :--- | :--- |
| **Step 1: $\\text{FEV}_1 / \\text{FVC}$ Ratio** | **$< 0.70$ (or $< \\text{LLN}$)** | **OBSTRUCTIVE VENTILATORY DEFECT**:<br>• **Asthma**: Reversible airflow obstruction.<br>• **COPD / Emphysema / Chronic Bronchitis**: Fixed, progressive airflow limitation.<br>• **Bronchiectasis & Cystic Fibrosis**.<br>*(Next: Perform Bronchodilator Reversibility Test)*. |
| | **$\\ge 0.70$ (Normal/High)** | Proceed to Step 2 to evaluate for Restrictive Defect or Normal physiology. |
| **Step 2: $\\text{FVC}$ & $\\text{TLC}$** | **$\\text{FVC} < 80\\%$ AND $\\text{TLC} < 80\\%$** | **RESTRICTIVE VENTILATORY DEFECT**:<br>• Alveolar volume / lung expansion is reduced.<br>• Proceed to Step 3 ($DLCO$) to differentiate Intrinsic ILD from Extrinsic/Chest Wall etiology. |
| **Step 3: $\\text{DLCO}$ (Diffusion Capacity)** | **Reduced $\\text{DLCO}$ ($< 80\\%$) in Restriction** | **Intrinsic Interstitial Lung Disease (ILD)**: Alveolar-capillary membrane destruction / fibrosis (**Idiopathic Pulmonary Fibrosis IPF, Sarcoidosis, Asbestosis, Hypersensitivity Pneumonitis**). |
| | **Normal $\\text{DLCO}$ ($\\ge 80\\%$) in Restriction** | **Extrinsic / Chest Wall & Neuromuscular Disorders**: Normal alveolar membrane with mechanical restriction (**Kyphoscoliosis, Morbid Obesity, Myasthenia Gravis, ALS, Guillain-Barré**). |
| | **Reduced $\\text{DLCO}$ in Obstruction** | **Emphysema**: Alveolar septal destruction and loss of capillary surface area. |
| | **Normal / High $\\text{DLCO}$ in Obstruction** | **Asthma**: Preserved alveolar-capillary architecture with increased pulmonary capillary blood volume. |

---

## 2. Bronchodilator Reversibility Testing & GOLD Staging in COPD

- **Bronchodilator Reversibility Criteria (ATS/ERS Standard)**:
  - Administer $400\\text{ }\\mu\\text{g}$ inhaled Albuterol (Salbutamol) via spacer $\\rightarrow$ Repeat spirometry in 15 minutes.
  - **Positive Bronchodilator Response**: An increase in **$\\text{FEV}_1$ and/or $\\text{FVC} \\ge 12\\%$ AND $\\ge 200\\text{ mL}$ absolute volume increase** compared to baseline.
  - *Asthma* typically demonstrates complete or significant reversibility; *COPD* exhibits non-reversible or partially reversible airflow limitation.
- **GOLD 2024 Classification of Airflow Limitation in COPD (Post-Bronchodilator $\\text{FEV}_1$)**:
  - **GOLD 1 (Mild)**: $\\text{FEV}_1 \\ge 80\\%\\text{ predicted}$.
  - **GOLD 2 (Moderate)**: $50\\% \\le \\text{FEV}_1 < 80\\%\\text{ predicted}$.
  - **GOLD 3 (Severe)**: $30\\% \\le \\text{FEV}_1 < 50\\%\\text{ predicted}$.
  - **GOLD 4 (Very Severe)**: $\\text{FEV}_1 < 30\\%\\text{ predicted}$.

---

## 3. Flow-Volume Loop Morphologies

- **Normal Loop**: Asymmetric "Ice-cream cone" shape with steep expiratory effort-dependent peak followed by linear effort-independent descent, and smooth semi-circular inspiratory curve.
- **Obstructive Loop**: **"Scooped-out" coved / concave expiratory limb** due to prolonged expiration against elevated airway resistance; leftward shift with elevated Residual Volume ($RV$).
- **Restrictive Loop**: **Miniature "Witch\'s hat" shape**; narrow and steep with preserved peak flow rate and normal contours, but profoundly reduced lung volumes ($TLC$ and $FVC$).
- **Fixed Upper Airway Obstruction (Tracheal Stenosis, Goiter)**: **Flattening of BOTH inspiratory AND expiratory limbs** ($FEV_1/PEF$ ratio plateaued).
- **Variable Extrathoracic Obstruction (Vocal Cord Paralysis)**: **Flattening of the INSPIRATORY limb only** (subatmospheric pressure collapses extrathoracic airway during inspiration).
- **Variable Intrathoracic Obstruction (Tracheomalacia)**: **Flattening of the EXPIRATORY limb only** (positive pleural pressure compresses intrathoracic trachea during expiration).
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with a 35-pack-year smoking history presents with progressive exertional dyspnea and chronic morning cough productive of white sputum for the past 3 years. Baseline spirometry reveals: FVC 3.80 L (85% predicted), FEV1 1.90 L (52% predicted), FEV1/FVC ratio 0.50 (50%). Following the administration of 4 puffs of inhaled Albuterol, repeat spirometry shows: FVC 3.90 L, FEV1 1.98 L (4% increase, 80 mL increase). Total Lung Capacity (TLC) is 120% predicted, Residual Volume (RV) is 145% predicted, and DLCO is 48% predicted.",
      question: "Which of the following is the correct physiological diagnosis and disease stage?",
      options: [
        "COPD (Emphysema phenotype), GOLD 2 (Moderate) Airflow Limitation with reduced DLCO",
        "Bronchial Asthma with complete bronchodilator reversibility and normal DLCO",
        "Idiopathic Pulmonary Fibrosis with Restrictive Defect",
        "Fixed Upper Airway Tracheal Stenosis"
      ],
      correctAnswerIndex: 0,
      explanation: "The patient has an Obstructive Ventilatory Defect (FEV1/FVC 0.50 < 0.70) that is non-reversible after bronchodilator challenge (FEV1 increased by only 4% and 80 mL, falling short of the >=12% and >=200 mL threshold). Post-bronchodilator FEV1 of 52% classifies him as GOLD 2 (Moderate). The elevated TLC and RV indicate hyperinflation and air-trapping, while the significantly reduced DLCO (48%) confirms alveolar capillary destruction characteristic of the Emphysema phenotype of COPD."
    }
  ]
};
