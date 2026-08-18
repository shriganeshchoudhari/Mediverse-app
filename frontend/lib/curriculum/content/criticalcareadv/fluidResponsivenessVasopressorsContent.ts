/**
 * Critical Care: Dynamic Fluid Responsiveness, Vasopressors & Inotropes
 * Authoritative medical content derived from Surviving Sepsis Campaign (2021/2026), Marino's The ICU Book.
 * Mapped to NMC CBME Competencies: CC1.5, CC1.6, AN23.3, MD36.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FLUID_RESPONSIVENESS_VASOPRESSORS_MODULE: PhysiologyLessonModule = {
  id: "critical-care-adv-fluid-responsiveness-vasopressors",
  unitCode: "CC5.1",
  title: "Dynamic Fluid Responsiveness (PLR, SVV, PPV) & Vasoactive Pharmacology in Sepsis",
  competencies: ["CC1.5", "CC1.6", "AN23.3", "MD36.3"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Dynamic Fluid Responsiveness & Vasoactive Pharmacology

Fluid administration in critical illness is a pharmacological intervention with a narrow therapeutic window: under-resuscitation worsens hypoperfusion, while fluid overload increases mortality, ventilator days, and acute kidney injury.

---

## 1. Dynamic vs Static Fluid Responsiveness Assessment

$$\\begin{array}{lccc}
\\hline
\\textbf{Diagnostic Assessment} & \\textbf{Type} & \\textbf{Threshold for Response} & \\textbf{Clinical Limitations \u0026 Caveats} \\\\
\\hline
\\textbf{Central Venous Pressure (CVP)} & \\text{Static} & \\text{Unreliable / Poor predictive value} & \\text{Affected by PEEP, RV compliance, tricuspid regurg} \\\\
\\textbf{Passive Leg Raise (PLR) Test} & \\mathbf{\\text{Dynamic}} & \\mathbf{\\ge 10-15\\% \\uparrow\\text{ in Stroke Volume / CO}} & \\mathbf{\\text{Gold Standard: Reversible autotransfusion (300-500 mL)}} \\\\
& & & \\text{Valid in spontaneous breathing \u0026 arrhythmias} \\\\
\\textbf{Stroke Volume Variation (SVV)} & \\mathbf{\\text{Dynamic}} & \\mathbf{> 12-13\\%} & \\text{Requires: Volume-controlled MV (}V_T \\ge 8\\text{ mL/kg),} \\\\
\\textbf{Pulse Pressure Variation (PPV)} & & & \\mathbf{\\text{NO spontaneous breaths, sinus rhythm (NO arrhythmias)}} \\\\
\\textbf{IVC Collapsibility Index} & \\text{Dynamic} & > 50\\%\\text{ (Spontaneous breathing)} & \\text{Requires subcostal ultrasound window} \\\\
\\textbf{IVC Distensibility Index} & \\text{Dynamic} & > 18\\%\\text{ (Mechanical ventilation)} & \\text{Requires controlled mechanical ventilation} \\\\
\\hline
\\end{array}$$

---

## 2. Vasoactive Medications in Critical Care

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug} & \\textbf{Primary Receptor Target} & \\textbf{Hemodynamic Effect} & \\textbf{First-Line Clinical Indication} \\\\
\\hline
\\textbf{Norepinephrine} & \\mathbf{\\alpha_1 > \\beta_1} & \\mathbf{\\uparrow\\text{SVR, modest }\\uparrow\\text{Inotropy}} & \\mathbf{\\text{First-line vasopressor in Septic / Vasodilatory Shock}} \\\\
\\textbf{Vasopressin} & \\mathbf{V_1\\text{ Receptors}} & \\mathbf{\\uparrow\\text{SVR (Non-adrenergic)}} & \\mathbf{\\text{Fixed-dose adjunct (0.03 U/min) to spare Norepinephrine}} \\\\
\\textbf{Epinephrine} & \\alpha_1 + \\beta_1 + \\beta_2 & \\uparrow\\text{SVR, } \\uparrow\\text{CO, } \\uparrow\\text{HR, } \\uparrow\\text{Lactate} & \\text{Second-line refractory shock; Anaphylaxis} \\\\
\\textbf{Dobutamine} & \\mathbf{\\beta_1 > \\beta_2} & \\mathbf{\\uparrow\\uparrow\\text{Inotropy, } \\uparrow\\text{Lusitropy, } \\downarrow\\text{SVR}} & \\mathbf{\\text{Septic Cardiomyopathy with persistent hypoperfusion}} \\\\
\\textbf{Phenylephrine} & \\text{Pure } \\alpha_1 & \\uparrow\\text{SVR, reflex bradycardia} & \\text{Tachyarrhythmias precluding norepinephrine} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 66-year-old male with septic shock secondary to peritonitis is mechanically ventilated in the ICU. He has received 4.5 liters of balanced crystalloids over the past 8 hours. Currently, he is on Norepinephrine at 0.22 mcg/kg/min with vital signs: BP 88/54 mmHg (MAP 65 mmHg), HR 112 bpm (sinus tachycardia). Arterial blood gas demonstrates persistent hyperlactatemia (3.6 mmol/L). An arterial line pulse contour analysis demonstrates a Stroke Volume Variation (SVV) of 6%. A Passive Leg Raise (PLR) maneuver coupled with real-time echocardiography produces only a 3% increase in stroke volume and cardiac output.",
      question: "Which of the following is the most appropriate next clinical step regarding fluid management and vasoactive titration?",
      options: [
        "Withhold further intravenous fluid boluses (patient is non-fluid responsive); add Vasopressin (0.03 units/min) or consider Dobutamine if cardiac contractility is impaired on echocardiography",
        "Administer an immediate 2-liter normal saline bolus",
        "Increase tidal volume from 6 mL/kg to 12 mL/kg",
        "Discontinue Norepinephrine and initiate high-dose Phenylephrine"
      ],
      correctAnswerIndex: 0,
      explanation: "Both the Passive Leg Raise test (PLR increase <10-15%) and Stroke Volume Variation (SVV <12%) definitively demonstrate that this patient has reached the flat portion of the Frank-Starling curve and is NON-FLUID RESPONSIVE. Giving additional fluid boluses will not increase stroke volume or cardiac output, but will worsen pulmonary edema, prolong mechanical ventilation, and increase mortality. The correct approach is to withhold further fluid boluses and optimize vasoactive therapy: add fixed-dose Vasopressin (0.03 units/min) to reduce norepinephrine requirements, and consider an inotrope (Dobutamine) if myocardial dysfunction (septic cardiomyopathy) is present."
    }
  ]
};
