/**
 * Postgraduate Core Clinical Foundations & Residency Readiness: Critical Care Hemodynamics & ECMO
 * Authoritative critical care content derived from Hall & Schmidt's Principles of Critical Care, ELSO Guidelines.
 * Mapped to NMC PG CBME Competencies: PG1.1, ACGME Patient Care Milestones.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CRITICAL_CARE_HEMODYNAMICS_ECMO_MODULE: PhysiologyLessonModule = {
  id: "pg1-critical-care-hemodynamics-ecmo",
  unitCode: "PG1.1",
  title: "Postgraduate Critical Care Hemodynamics: Swan-Ganz Thermodilution, SvO2/ScvO2 & Veno-Arterial vs Veno-Venous ECMO Protocols",
  competencies: ["PG1.1", "CC1.1", "CC1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Postgraduate Critical Care Hemodynamics & Extracorporeal Support

Advanced pulmonary artery catheterization, microvascular oxygenation profiling, and extracorporeal life support algorithms manage refractory multi-organ failure.

---

## 1. Pulmonary Artery Catheter (Swan-Ganz) Hemodynamic Shock Matrix

$$\\begin{array}{lccccc}
\\hline
\\textbf{Shock State} & \\textbf{CVP (RA Pressure)} & \\textbf{PCWP (LA Preload)} & \\textbf{Cardiac Index (CI)} & \\textbf{Systemic Vascular Resistance (SVR)} & \\textbf{Mixed Venous } SvO_2 \\\\
\\hline
\\textbf{Hypovolemic Shock} & < 4\\text{ mmHg (\\(\\downarrow\\))} & < 8\\text{ mmHg (\\(\\downarrow\\))} & < 2.2\\text{ L/min/m}^2\\text{ (\\(\\downarrow\\))} & > 1{,}200\\text{ dynes}\\cdot\\text{s/cm}^5\\text{ (\\(\\uparrow\\))} & < 65\\%\\text{ (\\(\\downarrow\\))} \\\\
\\textbf{Cardiogenic Shock} & > 12\\text{ mmHg (\\(\\uparrow\\))} & > 18\\text{ mmHg (\\(\\uparrow\\))} & < 2.2\\text{ L/min/m}^2\\text{ (\\(\\downarrow\\))} & > 1{,}400\\text{ dynes}\\cdot\\text{s/cm}^5\\text{ (\\(\\uparrow\\))} & < 60\\%\\text{ (\\(\\downarrow\\downarrow\\))} \\\\
\\textbf{Septic / Distributive} & < 8\\text{ mmHg (\\(\\downarrow/\\leftrightarrow\\))} & < 10\\text{ mmHg (\\(\\downarrow/\\leftrightarrow\\))} & \\mathbf{> 4.0\\text{ L/min/m}^2\\text{ (\\(\\uparrow\\uparrow\\))}} & \\mathbf{< 800\\text{ dynes}\\cdot\\text{s/cm}^5\\text{ (\\(\\downarrow\\downarrow\\))}} & \\mathbf{> 75-80\\%\\text{ (\\(\\uparrow\\))}} \\\\
\\textbf{Cardiac Tamponade} & \\mathbf{\\ge 15\\text{ mmHg (\\(\\uparrow\\uparrow\\))}} & \\mathbf{\\ge 15\\text{ mmHg (\\(\\uparrow\\uparrow\\))}} & < 2.0\\text{ L/min/m}^2\\text{ (\\(\\downarrow\\downarrow\\))} & > 1{,}400\\text{ dynes}\\cdot\\text{s/cm}^5\\text{ (\\(\\uparrow\\))} & < 60\\%\\text{ (\\(\\downarrow\\downarrow\\))} \\\\
& \\multicolumn{5}{c}{\\mathbf{\\text{Diastolic Equalization: } CVP \\approx PAD \\approx PCWP}} \\\\
\\hline
\\end{array}$$

---

## 2. Global Oxygen Delivery (\(DO_2\)) & Consumption (\(VO_2\)) Equations

$$\\begin{array}{lcccc}
\\hline
\\textbf{Physiological Parameter} & \\textbf{Mathematical Formulation} & \\textbf{Normal Reference Range} \\\\
\\hline
\\textbf{Arterial Oxygen Content } (CaO_2) & CaO_2 = (1.34 \\times [\\text{Hb}] \\times SaO_2) + (0.003 \\times PaO_2) & 18-20\\text{ mL } O_2 / \\text{dL blood} \\\\
\\textbf{Total Oxygen Delivery } (DO_2) & DO_2 = CO \\times CaO_2 \\times 10 & 950-1{,}100\\text{ mL/min} \\\\
\\textbf{Total Oxygen Consumption } (VO_2) & VO_2 = CO \\times (CaO_2 - CvO_2) \\times 10 & 200-250\\text{ mL/min} \\\\
\\textbf{Oxygen Extraction Ratio } (O_2ER) & O_2ER = \\frac{VO_2}{DO_2} = \\frac{SaO_2 - SvO_2}{SaO_2} & 22-30\\% \\\\
\\textbf{Mixed Venous Saturation } (SvO_2) & \\text{Measured in Pulmonary Artery blood} & \\mathbf{65-75\\% (ScvO_2 \\ge 70\\%)} \\\\
\\hline
\\end{array}$$

---

## 3. Extracorporeal Membrane Oxygenation (ECMO): VV vs VA ECMO

$$\\begin{array}{lcccc}
\\hline
\\textbf{ECMO Modality} & \\textbf{Cannulation Configuration} & \\textbf{Hemodynamic / Cardiac Support} & \\textbf{Primary Clinical Indications} \\\\
\\hline
\\textbf{Veno-Venous (VV)} & \\text{Drainage: Femoral Vein (IVC)} & \\mathbf{\\text{NO cardiac hemodynamic support;}} & \\mathbf{\\text{Severe refractory ARDS (} PaO_2/FiO_2 < 80)} \\\\
& \\text{Reinfusion: Internal Jugular (RA)} & \\text{relies 100\\% on native cardiac output} & \\text{severe hypercapnic acidosis (pH } < 7.15\\text{)} \\\\
\\textbf{Veno-Arterial (VA)} & \\text{Drainage: Femoral Vein (RA)} & \\mathbf{\\text{FULL circulatory hemodynamic +}} & \\mathbf{\\text{Refractory Cardiogenic Shock, E-CPR,}} \\\\
& \\text{Reinfusion: Femoral Artery (retrograde)} & \\mathbf{\\text{gas exchange support (up to 5-7 L/min)}} & \\text{massive PE, postcardiotomy shock} \\\\
\\hline
\\textbf{VA Complications} & \\multicolumn{3}{c}{\\mathbf{\\text{Harlequin (North-South) Syndrome: }}\\text{Deoxygenated blood to brain/coronary arteries;}} \\\\
& \\multicolumn{3}{c}{\\mathbf{\\text{LV Distension / Afterload Mismatch: }}\\text{Relieved by Impella LV venting or balloon septostomy}} \\\\
& \\multicolumn{3}{c}{\\mathbf{\\text{Distal Limb Ischemia: }}\\text{Mandates insertion of a 6-8 Fr anterograde distal perfusion catheter}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with acute anterior myocardial infarction undergoes emergent percutaneous coronary intervention with stenting of the LAD. Post-procedure, he remains in profound refractory cardiogenic shock despite high-dose Norepinephrine (0.4 mcg/kg/min), Dobutamine (10 mcg/kg/min), and Epinephrine (0.15 mcg/kg/min). Vital signs show: BP 74/42 mmHg, HR 118 bpm, Lactate 6.8 mmol/L, and pulmonary artery catheterization reveals: CVP 18 mmHg, PCWP 26 mmHg, Cardiac Index 1.4 L/min/m^2, SVR 1,850 dynes*s/cm^5, and SvO2 44%. Peripheral Veno-Arterial (VA) ECMO is initiated via right femoral vein and right femoral artery cannulation at 4.5 L/min flow.",
      question: "What mandatory cannula must be placed in the right leg to prevent limb necrosis, and what dual pathology must be aggressively monitored during peripheral VA-ECMO?",
      options: [
        "A 6-8 Fr anterograde distal perfusion catheter must be placed into the right superficial femoral artery to prevent limb ischemia; clinicians must monitor for LV afterload overload/distension (requiring LV unloading with an Impella or inotrope) and Harlequin (North-South) syndrome (dual circulation hypoxemia to coronary/cerebral beds requiring conversion to V-AV ECMO or right radial arterial blood gas monitoring)",
        "A central venous dialysis catheter; monitor for hypokalemia only",
        "A pulmonary artery venting line; monitor for liver failure",
        "No distal cannula is required; discharge to the step-down telemetry ward"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents advanced critical care mechanical circulatory support: (1) Distal Limb Perfusion: Large arterial cannulae in the femoral artery obstruct distal anterograde arterial flow, mandating placement of a 6-8 Fr distal perfusion catheter into the superficial femoral artery to prevent fatal leg ischemia/amputation; (2) LV Distension: Retrograde aortic flow from VA-ECMO increases LV afterload, which can cause severe LV dilatation, pulmonary edema, and intracardiac thrombus formation (treated with an Impella for LV venting); (3) Harlequin Syndrome: When native poorly oxygenated blood is ejected by a recovering LV against well-oxygenated retrograde ECMO blood, cerebral and coronary vascular beds become hypoxic (monitored via right radial arterial line and managed by converting to V-AV ECMO)."
    }
  ]
};
