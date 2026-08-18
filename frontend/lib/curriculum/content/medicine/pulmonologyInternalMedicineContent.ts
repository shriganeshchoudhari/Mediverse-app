/**
 * Pulmonology, Respiratory Mechanics & Critical Care Learning Content
 * Authoritative medical content derived from Harrison, Davidson, Murray & Nadel, and USMLE Step 2 CK.
 * Mapped to NMC CBME Competencies: IM2.1, IM2.2, IM2.3, IM2.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PULMONOLOGY_INTERNAL_MEDICINE_MODULE: PhysiologyLessonModule = {
  id: "med-pulmonology",
  unitCode: "IM2.1",
  title: "Pulmonology: Spirometry Patterns (Obstructive vs Restrictive), Pulmonary Embolism, CURB-65 & ABG",
  competencies: ["IM2.1", "IM2.2", "IM2.3", "IM2.4"],
  estimatedMinutes: 135,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Pulmonology: Spirometry Patterns (Obstructive vs Restrictive), Pulmonary Embolism, CURB-65 & ABG

Pulmonary medicine encompasses the evaluation of airway physiology, parenchymal gas diffusion, pulmonary vascular hemodynamics, respiratory infectious triage, and arterial blood gas interpretation.

---

## 1. Spirometry Diagnostic Algorithm: Obstructive vs Restrictive Disorders

| Parameter | Obstructive Lung Disease (COPD, Asthma, Bronchiectasis) | Intrinsic Restrictive Disease (Idiopathic Pulmonary Fibrosis, Sarcoidosis) | Extrinsic Restrictive Disease (Kyphoscoliosis, ALS, Obesity Hypoventilation) |
| :--- | :--- | :--- | :--- |
| **$FEV_1 / FVC$ Ratio** | **$\\downarrow < 0.70$ (Defining Hallmark!)** | **Normal or $\\uparrow (\\ge 0.70)$** | **Normal or $\\uparrow (\\ge 0.70)$** |
| **Forced Vital Capacity ($FVC$)** | Normal or $\\downarrow$ (due to severe air trapping) | **$\\downarrow < 80\\%$ predicted** | **$\\downarrow < 80\\%$ predicted** |
| **Total Lung Capacity ($TLC$)** | **$\\uparrow > 120\\%$ (Hyperinflation)** | **$\\downarrow < 80\\%$ (True Restriction)** | **$\\downarrow < 80\\%$ (True Restriction)** |
| **Residual Volume ($RV$)** | **$\\uparrow\\uparrow$ (Air Trapping)** | **$\\downarrow$** | Normal or $\\downarrow$ |
| **$DLCO$ (Diffusion Capacity)** | • **Emphysema**: **$\\downarrow$ (Alveolar destruction)**<br>• **Chronic Bronchitis**: **Normal**<br>• **Asthma**: **Normal or $\\uparrow$** | **$\\downarrow$ (Thickened fibrotic alveolar membrane)** | **Normal (Parenchyma and capillary bed are intact)** |

---

## 2. Pulmonary Embolism (PE) Diagnostic Pathway & Hemodynamic Triage

1. **Clinical Prediction Scores (Wells Score)**:
   - Clinical signs of DVT ($+3$), PE most likely diagnosis ($+3$), Heart rate $>100$ ($+1.5$), Immobilization/Surgery within 4 weeks ($+1.5$), Prior DVT/PE ($+1.5$), Hemoptysis ($+1$), Active malignancy ($+1$).
   - **Low/Intermediate Risk**: Order high-sensitivity **D-dimer** ($<500\\text{ ng/mL}$ reliably rules out PE).
   - **High Risk (Wells $>4$)**: Proceed directly to **CT Pulmonary Angiography (CTPA)** (Gold Standard).
2. **Hemodynamic Stratification & Management**:
   - **Massive (High-Risk) PE**: Persistent hypotension ($\\text{SBP} < 90\\text{ mmHg}$ for $>15\\text{ min}$) or cardiogenic shock $\\implies$ Emergency **Systemic Thrombolysis (Alteplase / tPA)** or catheter-directed thrombectomy.
   - **Submassive / Low-Risk PE**: Hemodynamically stable $\\implies$ Therapeutic anticoagulation (**DOACs: Apixaban, Rivaroxaban** or LMWH).

---

## 3. Community-Acquired Pneumonia (CAP) Triage: CURB-65 Score

| CURB-65 Criterion | Clinical Definition | Point Allocation |
| :--- | :--- | :--- |
| **C** — Confusion | New-onset disorientation to time, place, or person (Abbreviated Mental Test $\\le 8$) | 1 point |
| **U** — Urea | Blood Urea Nitrogen $>19\\text{ mg/dL}$ (Serum Urea $>7\\text{ mmol/L}$) | 1 point |
| **R** — Respiratory Rate | $\\ge 30\\text{ breaths per minute}$ | 1 point |
| **B** — Blood Pressure | Systolic $\\text{BP} < 90\\text{ mmHg}$ OR Diastolic $\\text{BP} \\le 60\\text{ mmHg}$ | 1 point |
| **65** — Age | Age $\\ge 65\\text{ years}$ | 1 point |

- **Score 0–1**: Low risk (mortality $<2\\%$) $\\implies$ **Outpatient management** (Amoxicillin or Doxycycline or Macrolide).
- **Score 2**: Intermediate risk (mortality $\\sim 9\\%$) $\\implies$ **Hospital ward admission** (IV Ceftriaxone $+$ Azithromycin OR Respiratory Fluoroquinolone).
- **Score 3–5**: High risk (mortality $15\\text{–}40\\%$) $\\implies$ **Urgent ICU admission** (IV $\\beta$-Lactam $+$ Macrolide $+$ respiratory support).
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a 40 pack-year smoking history presents with progressive exertional dyspnea and chronic productive cough. Pulmonary function testing reveals: FEV1/FVC = 0.52 (52%), Total Lung Capacity (TLC) = 128% of predicted, and DLCO = 44% of predicted.",
      question: "Which of the following pulmonary conditions is most consistent with these physiological findings?",
      options: [
        "Centrilobular Pulmonary Emphysema",
        "Idiopathic Pulmonary Fibrosis",
        "Asthma with reversible bronchospasm",
        "Chronic Bronchitis with intact alveolar architecture"
      ],
      correctAnswerIndex: 0,
      explanation: "An FEV1/FVC ratio < 0.70 establishes an obstructive ventilatory defect. The elevated Total Lung Capacity (128%) reflects hyperinflation and air trapping. A markedly reduced DLCO (44%) indicates widespread alveolar-capillary membrane destruction, which is pathognomonic for pulmonary emphysema. In contrast, pure chronic bronchitis and uncomplicated asthma maintain a normal DLCO because the alveolar capillary surface area is preserved."
    }
  ]
};
