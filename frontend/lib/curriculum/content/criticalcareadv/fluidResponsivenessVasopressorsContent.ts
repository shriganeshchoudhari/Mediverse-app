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

| Diagnostic Assessment | Type | Threshold for Response | Clinical Limitations & Caveats |
| :--- | :---: | :--- | :--- |
| **Central Venous Pressure (CVP)** | Static | Unreliable / Poor predictive value | Affected by PEEP, RV compliance, tricuspid regurgitation |
| **Passive Leg Raise (PLR) Test** | **Dynamic** | **$\\ge 10-15\\%$ increase in Stroke Volume / CO** | **Gold Standard: Reversible autotransfusion (300-500 mL)**; valid in spontaneous breathing & arrhythmias |
| **Stroke Volume Variation (SVV)** | **Dynamic** | **$> 12-13\\%$** | Requires controlled MV ($V_T \\ge 8\\text{ mL/kg}$), **NO spontaneous breaths, sinus rhythm (no arrhythmias)** |
| **Pulse Pressure Variation (PPV)** | **Dynamic** | **$> 13\\%$** | Requires controlled mechanical ventilation, sinus rhythm |
| **IVC Collapsibility Index** | Dynamic | $> 50\\%$ (Spontaneous breathing) | Requires clear subcostal ultrasound window |
| **IVC Distensibility Index** | Dynamic | $> 18\\%$ (Mechanical ventilation) | Requires controlled mechanical ventilation without spontaneous triggering |

---

## 2. Vasoactive Medications in Critical Care

| Drug | Primary Receptor Target | Hemodynamic Effect | First-Line Clinical Indication |
| :--- | :--- | :--- | :--- |
| **Norepinephrine** | **$\\alpha_1 > \\beta_1$** | **$\\uparrow$ SVR, modest $\\uparrow$ Inotropy** | **First-line vasopressor in Septic / Vasodilatory Shock** |
| **Vasopressin** | **$V_1$ Receptors** | **$\\uparrow$ SVR (Non-adrenergic mechanism)** | **Fixed-dose adjunct (0.03 U/min) to spare Norepinephrine** |
| **Epinephrine** | $\\alpha_1 + \\beta_1 + \\beta_2$ | $\\uparrow$ SVR, $\\uparrow$ CO, $\\uparrow$ HR, $\\uparrow$ Lactate | Second-line refractory shock; Anaphylaxis |
| **Dobutamine** | **$\\beta_1 > \\beta_2$** | **$\\uparrow\\uparrow$ Inotropy, $\\uparrow$ Lusitropy, $\\downarrow$ SVR** | **Septic Cardiomyopathy with persistent tissue hypoperfusion** |
| **Phenylephrine** | Pure $\\alpha_1$ | $\\uparrow$ SVR, reflex bradycardia | Tachyarrhythmias precluding norepinephrine |
`,
  clinicalVignettes: [
    {
      scenario: "A 66-year-old male with septic shock secondary to peritonitis is mechanically ventilated in the ICU. He has received 4.5 liters of balanced crystalloids over the past 8 hours. Currently, he is on Norepinephrine at 0.22 mcg/kg/min with vital signs: BP 88/54 mmHg (MAP 65 mmHg), HR 112 bpm (sinus tachycardia). Arterial blood gas demonstrates persistent hyperlactatemia (3.6 mmol/L). An arterial line pulse contour analysis demonstrates a Stroke Volume Variation (SVV) of 6%. A Passive Leg Raise (PLR) maneuver coupled with real-time echocardiography produces only a 3% increase in stroke volume and cardiac output.",
      question: "Which of the following is the most appropriate next clinical step regarding fluid management and vasoactive titration?",
      options: [
        "Withhold further intravenous fluid boluses (patient is non-fluid responsive); add Vasopressin (0.03 units/min) or consider Dobutamine if cardiac contractility is impaired on echocardiography",
        "Administer another 2 liters of 0.9% Normal Saline rapidly over 30 minutes",
        "Discontinue Norepinephrine and switch to Phenylephrine monotherapy",
        "Administer high-dose Furosemide immediately to reduce pre-load"
      ],
      correctAnswerIndex: 0,
      explanation: "Dynamic measures of fluid responsiveness demonstrate that the patient is non-fluid responsive: SVV is 6% (threshold > 13%) and PLR produced only a 3% increase in stroke volume (threshold >= 10-15%). Additional fluid boluses will not increase cardiac output and will only worsen pulmonary and tissue edema. The correct approach is to withhold further fluids, maintain MAP >= 65 mmHg using Norepinephrine, add Vasopressin (0.03 U/min) to reduce adrenergic dose, and assess cardiac contractility for Dobutamine inotrope support if myocardial dysfunction is present."
    }
  ]
};
