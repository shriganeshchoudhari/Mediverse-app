/**
 * Cardiovascular: Wiggers Diagram & Valvular Pressure-Volume (PV) Loops
 * Authoritative medical content derived from Braunwald's Heart Disease (12th ed.), Lilly's Pathophysiology of Heart Disease.
 * Mapped to NMC CBME Competencies: CV1.1, CV1.2, CV2.1, CV2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const WIGGERS_DIAGRAM_PV_LOOPS_MODULE: PhysiologyLessonModule = {
  id: "cardiovascular-adv-wiggers-diagram-pv-loops",
  unitCode: "CV1.1",
  title: "Wiggers Diagram, Ventricular Pressure-Volume Loops, Preload/Afterload Shifts & Valvular Lesions",
  competencies: ["CV1.1", "CV1.2", "CV2.1", "CV2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Wiggers Diagram & Ventricular Pressure-Volume (PV) Loops

The cardiac cycle is governed by dynamic interactions among electrical depolarization, intracardiac chamber pressures, ventricular volumes, and valvular mechanics.

---

## 1. Left Ventricular Pressure-Volume (PV) Loop Physiology

- **The Four Phases of the Left Ventricular PV Loop**:
  1. **Phase 1: Isovolumetric Contraction**: Mitral valve closes ($C$) $\\rightarrow$ pressure rises rapidly at constant End-Diastolic Volume (EDV) without ejection until aortic pressure is exceeded $\\rightarrow$ Aortic valve opens ($D$).
  2. **Phase 2: Systolic Ejection**: Rapid and reduced ejection $\\rightarrow$ volume falls to End-Systolic Volume (ESV) $\rightarrow$ Aortic valve closes ($A$).
  3. **Phase 3: Isovolumetric Relaxation**: Left ventricle relaxes at constant ESV until LV pressure drops below Left Atrial pressure $\rightarrow$ Mitral valve opens ($B$).
  4. **Phase 4: Diastolic Filling**: Rapid early filling, diastasis, and atrial kick $\rightarrow$ volume increases back to EDV.
- **Cardiovascular Hemodynamic Formulas**:
  $$\\text{Stroke Volume (SV)} = \\text{EDV} - \\text{ESV}$$
  $$\\text{Ejection Fraction (EF)} = \\frac{\\text{SV}}{\\text{EDV}} = \\frac{\\text{EDV} - \\text{ESV}}{\\text{EDV}} \\times 100\\%$$
  $$\\text{Cardiac Output (CO)} = \\text{Stroke Volume (SV)} \\times \\text{Heart Rate (HR)}$$

---

## 2. Valvular Pathophysiology on Pressure-Volume Loops

$$\\begin{array}{lcccc}
\\hline
\\textbf{Valvular Disorder} & \\textbf{Primary PV Loop Alteration} & \\textbf{Isovolumetric Phases} & \\textbf{Volume \u0026 Pressure Changes} \\\\
\\hline
\\textbf{Aortic Stenosis (AS)} & \\text{Marked }\\uparrow\\text{ peak LV systolic pressure} & \\text{Present} & \\uparrow\\text{ Afterload, } \\uparrow\\text{ ESV, } \\downarrow\\text{ SV, } \\\\
& \\text{(tall, narrow loop; transvalvular gradient)} & & \\text{concentric LV hypertrophy} \\\\
\\hline
\\textbf{Aortic Regurgitation (AR)} & \\text{Massive rightward shift \u0026 }\\uparrow\\text{ width} & \\mathbf{\\text{ABSENT}} & \\uparrow\\uparrow\\text{ EDV, } \\uparrow\\text{ SV, } \\uparrow\\text{ pulse pressure,} \\\\
& \\text{(retrograde diastolic aortic filling)} & \\text{(aortic valve never seals!)} & \\text{eccentric LV dilation} \\\\
\\hline
\\textbf{Mitral Stenosis (MS)} & \\text{Marked leftward shift \u0026 }\\downarrow\\text{ width} & \\text{Present} & \\downarrow\\downarrow\\text{ EDV, } \\downarrow\\text{ SV, } \\downarrow\\text{ ESV,} \\\\
& \\text{(impaired diastolic ventricular filling)} & & \\uparrow\\text{ Left Atrial / Pulmonary venous pressure} \\\\
\\hline
\\textbf{Mitral Regurgitation (MR)} & \\text{Rightward shift \u0026 triangular shape} & \\mathbf{\\text{ABSENT}} & \\uparrow\\text{ EDV, } \\downarrow\\text{ ESV, } \\uparrow\\text{ total SV} \\\\
& \\text{(systolic regurgitation into left atrium)} & \\text{(backflow begins immediately)} & \\text{(but }\\downarrow\\text{ effective forward SV!)} \\\\
\\hline
\\end{array}$$

---

## 3. Physiological Loading Shifts (Preload, Afterload, Inotropy)

1. **Increased Preload** (e.g. IV crystalloid bolus): $\\uparrow \\text{EDV}$, $\\uparrow \\text{SV}$, rightward shift of Phase 4 filling boundary; no change in ESV.
2. **Increased Afterload** (e.g. severe hypertension, phenylephrine): $\\uparrow \\text{Peak Systolic Pressure}$, $\\uparrow \\text{ESV}$, $\\downarrow \\text{SV}$; narrower loop.
3. **Increased Inotropy** (e.g. Dobutamine, Digoxin, exercise): Leftward shift of the End-Systolic Pressure-Volume Relationship (ESPVR) line slope, $\\downarrow \\text{ESV}$, $\\uparrow \\text{SV}$, $\\uparrow \\text{EF}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 74-year-old male presents with exertional dyspnea, angina, and a syncopal episode while walking uphill. On physical examination, blood pressure is 106/84 mmHg with a delayed, weak carotid pulse upstroke (pulsus parvus et tardus). Cardiac auscultation reveals a harsh, late-peaking crescendo-decrescendo systolic ejection murmur heard loudest at the right second intercostal space radiating to the carotids, with a soft, single second heart sound (S2). Transthoracic echocardiography demonstrates calcification of the trileaflet aortic valve with a peak systolic pressure gradient of 68 mmHg across the valve.",
      question: "Which of the following alterations on the left ventricular Pressure-Volume (PV) loop is characteristic of this patient's valvular pathology?",
      options: [
        "Marked elevation of peak left ventricular systolic pressure with increased end-systolic volume (ESV) and reduced stroke volume (Aortic Stenosis)",
        "Absence of isovolumetric contraction and relaxation phases with massively increased end-diastolic volume (Aortic Regurgitation)",
        "Marked reduction in end-diastolic volume (EDV) due to impaired diastolic filling (Mitral Stenosis)",
        "Absence of isovolumetric relaxation with decreased end-systolic volume (Mitral Regurgitation)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classical severe Aortic Stenosis (AS), characterized by the triad of dyspnea, angina, and syncope, accompanied by pulsus parvus et tardus and a harsh crescendo-decrescendo systolic murmur. On the left ventricular Pressure-Volume (PV) loop, severe afterload elevation produces a dramatic increase in peak LV systolic pressure (generating a large transvalvular pressure gradient), an increase in End-Systolic Volume (ESV), a reduction in Stroke Volume (narrower loop), and concentric left ventricular hypertrophy over time."
    }
  ]
};
