/**
 * Postgraduate Advanced Internal Medicine: Advanced Mechanical Circulatory Support (Impella & IABP)
 * Authoritative cardiology content derived from AHA/ACC Guidelines, DanGer Shock Trial, ELSO MCS Protocols.
 * Mapped to NMC PG CBME Competencies: PG2.1, CD1.1, CD1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADVANCED_MECHANICAL_CIRCULATORY_SUPPORT_IMPELLA_MODULE: PhysiologyLessonModule = {
  id: "pg2-advanced-mechanical-circulatory-support-impella",
  unitCode: "PG2.1",
  title: "Advanced Mechanical Circulatory Support: IABP Hemodynamic Timing, Impella LV Unloading Mechanics & ECPELLA Protocols",
  competencies: ["PG2.1", "CD1.1", "CD1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Mechanical Circulatory Support: IABP, Impella & ECPELLA

Temporary percutaneous mechanical circulatory support unloads left ventricular filling pressures, augments coronary perfusion, and rescues refractory cardiogenic shock.

---

## 1. Intra-Aortic Balloon Pump (IABP) Physiological Timing

$$\\begin{array}{lcccc}
\\hline
\\textbf{Cardiac Cycle Phase} & \\textbf{IABP Mechanical Action} & \\textbf{Primary Physiological Benefit} & \\textbf{Waveform Landmark} \\\\
\\hline
\\textbf{Early Diastole} & \\mathbf{\\text{Rapid Balloon Inflation}} & \\mathbf{\\text{Augments coronary & cerebral perfusion pressure}} & \\text{Occurs at the } \\textbf{Dicrotic Notch} \\\\
\\textbf{End Diastole (Pre-systole)} & \\mathbf{\\text{Rapid Balloon Deflation}} & \\mathbf{\\text{Drastically reduces LV afterload & } MVO_2} & \\text{Occurs immediately prior to R-wave} \\\\
\\hline
\\textbf{Timing Error: Early Deflation} & \\text{Deflates prematurely in mid-diastole} & \\text{Suboptimal coronary perfusion, no afterload reduction} & \\text{U-shaped dip before systole} \\\\
\\textbf{Timing Error: Late Deflation} & \\mathbf{\\text{Deflates after aortic valve opens}} & \\mathbf{\\text{LV ejects against inflated balloon (WORST ERROR)}} & \\mathbf{\\text{Increases afterload & myocardial work}} \\\\
\\hline
\\end{array}$$

---

## 2. Impella Transvalvular Microaxial Flow Pump vs IABP

$$\\begin{array}{lcccc}
\\hline
\\textbf{Device Characteristic} & \\textbf{Intra-Aortic Balloon Pump (IABP)} & \\textbf{Impella Microaxial Pump (CP / 5.5)} \\\\
\\hline
\\textbf{Anatomical Location} & \\text{Descending Aorta (distal to L. Subclavian)} & \\mathbf{\\text{Crosses Aortic Valve (Inflow: LV } \\rightarrow \\text{ Outflow: Aorta)}} \\\\
\\textbf{Forward Flow Output} & \\text{Zero direct flow (pulsatile counterpulsation)} & \\mathbf{3.5 - 5.5\\text{ L/min continuous forward output}} \\\\
\\textbf{LV Unloading & LVEDP} & \\text{Indirect, modest afterload reduction} & \\mathbf{\\text{Direct active suction of LV (drastic } \\downarrow \\text{ LVEDP & PCWP)}} \\\\
\\textbf{Myocardial } O_2 \\textbf{ Consumption (} MVO_2 \\textbf{)} & \\text{Modest decrease (10-15\\%)} & \\mathbf{\\text{Profound reduction in LV wall tension & } MVO_2} \\\\
\\textbf{DanGer Shock Trial (2024)} & \\text{No survival benefit in routine STEMI shock} & \\mathbf{\\text{Significant 6-month mortality reduction in STEMI shock}} \\\\
\\hline
\\end{array}$$

---

## 3. The ECPELLA / ECMELLA Dual Configuration

- **Pathophysiological Rationale**:
  - Peripheral VA-ECMO pumps retrograde arterial flow into the aorta, dramatically increasing left ventricular afterload.
  - In a failing, stunned heart, high afterload prevents the aortic valve from opening, producing severe **LV distension, pulmonary capillary hydrostatic rupture (flash pulmonary edema), and intracardiac stasis/thrombosis**.
- **Impella Decompression (ECPELLA)**:
  - Inserting an Impella simultaneously with VA-ECMO provides active transvalvular LV venting, directly aspirating blood from the left ventricle into the ascending aorta, keeping the LV decompressed while VA-ECMO provides full systemic perfusion and oxygenation.
`,
  clinicalVignettes: [
    {
      scenario: "A 61-year-old male is in profound STEMI cardiogenic shock following successful primary PCI of an occluded proximal LAD. He was cannulated for peripheral VA-ECMO at 4.5 L/min flow. Two hours later in the CCU, bedside echocardiography reveals severe left ventricular dilatation, a closed immobile aortic valve with spontaneous echo contrast ('smoke' in the LV cavity), and chest radiography shows worsening dense bilateral pulmonary edema. Pulmonary artery catheter shows a PCWP of 32 mmHg.",
      question: "What acute complication of VA-ECMO is occurring, and what is the definitive percutaneous mechanical unloading intervention?",
      options: [
        "Left ventricular afterload overload and severe LV distension secondary to retrograde VA-ECMO flow, which prevents aortic valve opening and causes hydrostatic pulmonary edema and intraventricular stasis; immediate percutaneous placement of an Impella transvalvular microaxial pump (creating an ECPELLA configuration) is required to actively vent and unload the left ventricle",
        "Harlequin syndrome; convert VA-ECMO to VV-ECMO",
        "Aortic dissection; immediate emergency sternotomy",
        "Normal VA-ECMO response; administer 2 liters of normal saline"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates advanced mechanical circulatory support management: (1) LV Afterload Distension: High retrograde arterial flow from peripheral VA-ECMO increases aortic root pressure, preventing the failing left ventricle from generating sufficient pressure to open the aortic valve. Blood pools in the LV, leading to catastrophic LV distension, intraventricular thrombosis, and massive pulmonary edema; (2) ECPELLA Strategy: Placement of an Impella directly unloads the left ventricle across the aortic valve, reducing LVEDP and PCWP while maintaining total systemic perfusion via the ECMO circuit."
    }
  ]
};
