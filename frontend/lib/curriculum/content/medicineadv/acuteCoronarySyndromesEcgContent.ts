/**
 * Clinical Internal Medicine: Acute Coronary Syndromes (ACS) & Culprit Vessel ECG Localization
 * Authoritative medical content derived from Harrison's Principles of Internal Medicine (21st ed.), ACC/AHA STEMI Guidelines.
 * Mapped to NMC CBME Competencies: IM1.1, IM1.2, MD41.1, SU39.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_CORONARY_SYNDROMES_ECG_MODULE: PhysiologyLessonModule = {
  id: "medicine-adv-acute-coronary-syndromes",
  unitCode: "IM1.1",
  title: "Acute Coronary Syndromes (ACS): Culprit Vessel ECG Localization, Primary PCI & RV Infarction",
  competencies: ["IM1.1", "IM1.2", "MD41.1", "SU39.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Acute Coronary Syndromes: Culprit Vessel Localization & Revascularization

Acute Coronary Syndromes (ACS) encompass unstable angina, NSTEMI, and STEMI, resulting from acute coronary plaque disruption and superimposed thrombosis.

---

## 1. ECG Culprit Vessel Localization Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Infarct Territory} & \\textbf{ECG Leads with ST Elevation} & \\textbf{Culprit Coronary Artery} & \\textbf{High-Yield Complications} & \\textbf{Critical Management Rule} \\\\
\\hline
\\textbf{Anterior / Septal} & \\mathbf{\\text{V}_1 - \\text{V}_4} & \\mathbf{\\text{Left Anterior Descending (LAD)}} & \\text{Cardiogenic shock, free wall rupture,} & \\mathbf{\\text{Emergent Primary PCI}} \\\\
& & (\\text{"Widow-Maker"}) & \\text{ventricular septal rupture (VSD)} & (\\le 90\\text{ min door-to-balloon}) \\\\
\\textbf{Inferior} & \\mathbf{\\text{II, III, aVF}} & \\mathbf{\\text{Right Coronary Artery (RCA)}} & \\mathbf{\\text{Right Ventricular (RV) Infarction,}} & \\mathbf{\\text{Obtain Right-Sided V}_4\\text{R;}} \\\\
& & (\\text{or dominant LCx } \\approx 15\\%) & \\text{Sinus bradycardia, complete AV block} & \\mathbf{\\text{AVOID Nitrates \u0026 Diuretics!}} \\\\
\\textbf{Lateral} & \\mathbf{\\text{I, aVL, V}_5 - \\text{V}_6} & \\mathbf{\\text{Left Circumflex (LCx)}} & \\text{Papillary muscle rupture} & \\text{PCI / DAPT / Anticoagulation} \\\\
& & \\text{or diagonal branches of LAD} & (\\text{acute severe mitral regurgitation}) & \\\\
\\textbf{Posterior} & \\mathbf{\\text{ST depression V}_1 - \\text{V}_3} & \\mathbf{\\text{Posterior Descending (PDA)}} & \\text{Mitral regurgitation, bradycardia} & \\text{Obtain posterior leads } \\text{V}_7 - \\text{V}_9 \\\\
& + \\mathbf{\\text{tall R waves (R/S } > 1\\text{)}} & (\\text{branch of RCA or LCx}) & & \\\\
\\hline
\\end{array}$$

---

## 2. Right Ventricular (RV) Infarction Pathophysiology & Caution

- **Pathophysiology**: Proximal RCA occlusion deprives the thin-walled right ventricle of perfusion $\rightarrow$ acute RV systolic dysfunction and dilatation $\rightarrow$ RV cannot pump blood into pulmonary circulation $\rightarrow$ severe drop in Left Ventricular preload $\rightarrow$ **profound systemic hypotension**.
- **Clinical Triad of RV Infarction**:
  1. Hypotension.
  2. Elevated Jugular Venous Pressure (JVP) with Kussmaul's sign.
  3. **CLEAR lung fields** (absence of pulmonary rales / edema).
- **CRITICAL CONTRAINDICATION**:
  - **NITRATES, MORPHINE, AND DIURETICS ARE STRICTLY CONTRAINDICATED!** They venodilate and reduce RV preload, precipitating catastrophic cardiovascular collapse.
  - **First-Line Treatment**: Immediate **Intravenous Isotonic Fluid Loading (Normal Saline boluses)** to augment RV filling pressures.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male presents to the emergency department with 2 hours of crushing substernal chest pressure radiating to the epigastrium and jaw. Blood pressure is 82/50 mmHg, heart rate is 52 bpm, and oxygen saturation is 98% on room air. Physical examination reveals distended neck veins with inspiration (positive Kussmaul sign) and clear breath sounds bilaterally without wheezes or crackles. The 12-lead ECG demonstrates 3 mm ST-segment elevations in leads II, III, and aVF with reciprocal ST depressions in leads I and aVL. A right-sided ECG demonstrates 2 mm ST elevation in lead V4R.",
      question: "Which of the following is the most appropriate next step in hemodynamic management prior to transfer for emergent primary percutaneous coronary intervention (PCI)?",
      options: [
        "Administer rapid intravenous isotonic crystalloid boluses (0.9% Normal Saline) to increase right ventricular preload; strictly avoid nitrates, morphine, and diuretics",
        "Administer sublingual Nitroglycerin spray and intravenous Furosemide",
        "Initiate high-dose intravenous Nitroprusside infusion",
        "Administer intravenous Diltiazem for rate control"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is suffering an Acute Inferior and Right Ventricular (RV) Myocardial Infarction (RCA culprit vessel), confirmed by ST elevation in leads II, III, aVF and lead V4R. The classic triad of RV infarction is hypotension, elevated JVP, and clear lung fields. Because the infarcted RV is stiff and non-contractile, forward cardiac output is exquisitely dependent on high right-sided filling pressures (preload). Administering nitrates, morphine, or diuretics causes venodilation and sudden preload reduction, precipitating profound, fatal shock. The initial management is immediate aggressive IV volume expansion with Normal Saline boluses to maintain RV preload while mobilizing the cardiac catheterization team for emergent Primary PCI within <=90 minutes."
    }
  ]
};
