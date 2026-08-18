/**
 * Cardiovascular: Heart Failure Hemodynamics & Shock Phenotyping
 * Authoritative medical content derived from Braunwald's Heart Disease (12th ed.), Lilly's Pathophysiology of Heart Disease.
 * Mapped to NMC CBME Competencies: CV5.1, CV5.2, CV6.1, CV6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEART_FAILURE_SHOCK_HEMODYNAMICS_MODULE: PhysiologyLessonModule = {
  id: "cardiovascular-adv-heart-failure-shock-hemodynamics",
  unitCode: "CV5.1",
  title: "Heart Failure Pathophysiology (HFrEF vs HFpEF), Laplace Wall Stress & Invasive Shock Profiling",
  competencies: ["CV5.1", "CV5.2", "CV6.1", "CV6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Heart Failure Hemodynamics & Invasive Shock Profiling

Cardiovascular shock represents a state of acute circulatory collapse characterized by inadequate end-organ perfusion and cellular dysoxia, classified into four distinct hemodynamic profiles.

---

## 1. Heart Failure Phenotypes & Laplace Law of Wall Stress

- **HFrEF (Systolic Heart Failure; $\\text{LVEF} \\le 40\\%$)**: Primary deficit in myocardial contractility $\\rightarrow$ eccentric hypertrophy, chamber dilation, $\\uparrow \\text{EDV}$, $\\uparrow \\text{ESV}$, reduced forward stroke volume.
- **HFpEF (Diastolic Heart Failure; $\\text{LVEF} \\ge 50\\%$)**: Primary deficit in myocardial relaxation and ventricular compliance $\\rightarrow$ concentric hypertrophy, stiff non-compliant ventricle, elevated filling pressures with normal cavity size.
- **Laplace Law of Myocardial Wall Stress**:
  $$\\text{Wall Stress (}\\sigma\\text{)} = \\frac{P \\times r}{2h}$$
  - $P = \\text{Intraventricular Systolic Pressure}$; $r = \\text{Ventricular Cavity Radius}$; $h = \\text{Myocardial Wall Thickness}$.
  - **Pressure Overload** (Aortic Stenosis, Hypertension) $\\rightarrow$ compensatory **Concentric Hypertrophy** ($\\uparrow h$) normalizes wall stress ($\\sigma$).
  - **Volume Overload** (Aortic/Mitral Regurgitation) $\\rightarrow$ **Eccentric Hypertrophy** ($\\uparrow r$) markedly increases wall stress and oxygen demand.

---

## 2. Invasive Swan-Ganz Catheterization Shock Profiling Matrix

$$\\begin{array}{lccccccl}
\\hline
\\textbf{Shock Category} & \\textbf{CVP / RAP} & \\textbf{PCWP} & \\textbf{Cardiac Index (CI)} & \\textbf{SVR} & \\textbf{SvO}_2 & \\textbf{First-Line Resuscitation} \\\\
\\hline
\\textbf{Hypovolemic Shock} & \\mathbf{\\downarrow} & \\mathbf{\\downarrow} & \\mathbf{\\downarrow} & \\mathbf{\\uparrow} & \\mathbf{\\downarrow} & \\text{Rapid IV Crystalloid Bolus ($30\\text{ mL/kg}$)} \\\\
\\text{(Hemorrhage, dehydration)} & (\\text{low preload}) & (\\text{low preload}) & (\\text{low stroke vol}) & (\\text{vasoconstriction}) & (\\uparrow\\text{ extraction}) & \\text{or Blood Transfusion} \\\\
\\hline
\\textbf{Cardiogenic Shock} & \\mathbf{\\uparrow} & \\mathbf{\\uparrow} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow} & \\mathbf{\\downarrow} & \\text{Inotropes (Dobutamine / Milrinone),} \\\\
\\text{(Acute MI, decompensated HF)} & (\\text{congestion}) & (\\text{congestion}) & (\\text{pump failure}) & (\\text{vasoconstriction}) & (\\uparrow\\text{ extraction}) & \\text{Norepinephrine, IABP / Impella} \\\\
\\hline
\\textbf{Distributive Shock} & \\mathbf{\\downarrow \\leftrightarrow} & \\mathbf{\\downarrow \\leftrightarrow} & \\mathbf{\\uparrow} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow} & \\text{IV Crystalloids + First-Line Vasopressor} \\\\
\\text{(Septic, anaphylactic, neurogenic)} & (\\text{pooling}) & (\\text{pooling}) & (\\text{hyperdynamic}) & (\\text{vasodilation}) & (\\text{shunting}) & (\\mathbf{\\text{Norepinephrine}}\\text{)} \\\\
\\hline
\\textbf{Obstructive Shock} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\downarrow \\leftrightarrow} & \\mathbf{\\downarrow} & \\mathbf{\\uparrow} & \\mathbf{\\downarrow} & \\text{Relieve obstruction: Pericardiocentesis,} \\\\
\\text{(Massive PE, tension PTX, tamponade)} & (\\text{RV overload}) & (\\text{impaired inflow}) & (\\text{poor filling}) & (\\text{vasoconstriction}) & & \\text{Needle decompression, Thrombolysis} \\\\
\\hline
\\end{array}$$

- **Systemic Vascular Resistance (SVR) Formula**:
  $$\\text{SVR} = 80 \\times \\frac{\\text{MAP} - \\text{CVP}}{\\text{Cardiac Output (CO)}} \\quad (\\text{Normal: } 800 - 1200\\text{ dynes}\\cdot\\text{sec}/\\text{cm}^5)$$
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with septic shock secondary to acute ascending cholangitis is admitted to the intensive care unit. Vital signs: BP 80/40 mmHg (MAP 53 mmHg), HR 122 bpm, RR 24/min, Temp 39.2°C. He has received 2,000 mL of IV balanced crystalloid solution. Invasive hemodynamic monitoring via a pulmonary artery catheter demonstrates: CVP 6 mmHg, PCWP 9 mmHg, Cardiac Output 8.4 L/min (Cardiac Index 4.2 L/min/m2; normal: 2.5-4.0), Systemic Vascular Resistance 480 dynes-sec/cm5 (normal: 800-1200), and Mixed Venous Oxygen Saturation (SvO2) 82%.",
      question: "Which of the following interventions represents the first-line targeted therapy indicated to restore vascular tone in this patient?",
      options: [
        "Initiate Intravenous Norepinephrine infusion titrated to maintain a MAP >= 65 mmHg",
        "Administer high-dose Intravenous Dobutamine infusion to increase cardiac contractility",
        "Administer sublingual Nitroglycerin to reduce preload",
        "Restrict IV fluids and start high-dose Furosemide diuresis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic Distributive (Septic) Shock characterized by profound systemic vasodilation (severely low SVR of 480 dynes-sec/cm5), a hyperdynamic elevated Cardiac Index (4.2 L/min/m2), warm peripheries, and high mixed venous oxygen saturation (SvO2 82% due to microvascular shunting and impaired cellular oxygen utilization). The primary hemodynamic defect is severe vasoplegia, and the first-line vasopressor of choice according to the Surviving Sepsis Campaign is Intravenous Norepinephrine titrated to a target MAP >= 65 mmHg."
    }
  ]
};
