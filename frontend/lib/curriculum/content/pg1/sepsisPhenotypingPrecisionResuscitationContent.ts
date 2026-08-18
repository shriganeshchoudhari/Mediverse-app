/**
 * Postgraduate Core Clinical Foundations & Residency Readiness: Sepsis Phenotyping & Precision Resuscitation
 * Authoritative critical care content derived from Seymour Sepsis Phenotypes, Surviving Sepsis 2026, Marik Dynamic Resuscitation.
 * Mapped to NMC PG CBME Competencies: PG1.3, CC3.1, CC3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SEPSIS_PHENOTYPING_PRECISION_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "pg1-sepsis-phenotyping-precision-resuscitation",
  unitCode: "PG1.3",
  title: "Sepsis-3 Precision Resuscitation: Clinical Phenotyping (Alpha-Delta), Dynamic Fluid Responsiveness & De-escalation",
  competencies: ["PG1.3", "CC3.1", "CC3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Sepsis-3 Precision Phenotyping & Dynamic Fluid Resuscitation

Subtyping clinical sepsis phenotypes, evaluating dynamic stroke-volume preload recruitability, and executing timed de-escalation prevent fluid overload-induced organ injury.

---

## 1. Sepsis-3 Clinical Phenotyping (Seymour et al.)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Sepsis Phenotype} & \\textbf{Prevalence} & \\textbf{Dominant Clinical / Biomarker Features} & \\textbf{In-Hospital Mortality} \\\\
\\hline
\\textbf{Alpha (\\(\\alpha\\)) Phenotype} & 33\\% & \\text{Few abnormal lab values, lowest organ dysfunction, minimal vasopressors} & \\mathbf{2-5\\% (\\text{Lowest})} \\\\
\\textbf{Beta (\\(\\beta\\)) Phenotype} & 27\\% & \\text{Older patients, high chronic renal disease burden, elevated creatinine} & 13\\% \\\\
\\textbf{Gamma (\\(\\gamma\\)) Phenotype} & 27\\% & \\mathbf{\\text{Hyperinflammatory: high fever, high CRP/ESR/Procalcitonin, pulmonary failure}} & 15\\% \\\\
\\textbf{Delta (\\(\\delta\\)) Phenotype} & \\mathbf{13\\%} & \\mathbf{\\text{Severe hepatic dysfunction, hyperlactatemia, profound refractory shock}} & \\mathbf{32\\% (\\text{Highest})} \\\\
\\hline
\\end{array}$$

---

## 2. Dynamic Fluid Responsiveness vs Static Hemodynamic Indices

$$\\begin{array}{lcccc}
\\hline
\\textbf{Assessment Modality} & \\textbf{Diagnostic Maneuver / Parameter} & \\textbf{Positive Responsiveness Cutoff} & \\textbf{Key Clinical Limitations} \\\\
\\hline
\\textbf{Passive Leg Raise (PLR)} & \\text{Tilt patient } 45^{\\circ} \\text{ from semi-recumbent to} & \\mathbf{\\text{Real-time } \\Delta \\text{Stroke Volume (SV) }} & \\text{Accurate in spontaneous breathing,} \\\\
& \\text{supine with legs elevated } 45^{\\circ} & \\mathbf{\\ge 10\\% \\text{ on echo or Flotrac}} & \\text{arrhythmias, and low tidal volume} \\\\
\\textbf{Pulse Pressure Variation} & \\text{Arterial line respiratory variation} & \\mathbf{PPV > 13\\% \\text{ (or } SVV > 12\\%\\text{)}} & \\mathbf{\\text{Requires controlled MV, } V_t \\ge 8\\text{ mL/kg,}} \\\\
(\\textbf{PPV / SVV}) & \\text{during positive pressure ventilation} & & \\mathbf{\\text{regular sinus rhythm, no spontaneous breaths}} \\\\
\\textbf{End-Expiratory Occlusion} & \\text{15-second ventilator expiratory hold} & \\mathbf{\\Delta \\text{Stroke Volume } \\ge 5\\%} & \\text{Quick, reliable during lung-protective ventilation} \\\\
\\hline
\\textbf{Static Measures (FLAWED)} & \\text{Central Venous Pressure (CVP), PCWP} & \\text{Static pressure does NOT predict volume} & \\mathbf{\\text{Completely unreliable for fluid responsiveness}} \\\\
\\hline
\\end{array}$$

---

## 3. The 4-Phase Resuscitation Framework (ROSE Model)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Resuscitation Phase} & \\textbf{Clinical Timing} & \\textbf{Therapeutic Objective} & \\textbf{Fluid / Inotrope Strategy} \\\\
\\hline
\\textbf{1. Resuscitation (R)} & \\text{Minutes 0-180} & \\text{Restore minimum perfusion pressure} & 30\\text{ mL/kg balanced crystalloids + Norepinephrine} \\\\
\\textbf{2. Optimization (O)} & \\text{Hours 3-24} & \\text{Titrate for cellular oxygen delivery} & \\text{Fluid boluses ONLY if PLR positive (}\\Delta SV \\ge 10\\%\\text{)} \\\\
\\textbf{3. Stabilization (S)} & \\text{Days 1-3} & \\text{Prevent positive cumulative fluid balance} & \\text{Maintenance fluids restricted; enteral feeding} \\\\
\\textbf{4. Evacuation (E)} & \\mathbf{\\text{Day 3+}} & \\mathbf{\\text{Active fluid de-escalation / derotation}} & \\mathbf{\\text{Loop diuretics / CRRT to achieve negative fluid balance}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with biliary septic shock (Delta phenotype with total bilirubin 8.4 mg/dL and AST 480 IU/L) has received 4.5 liters of balanced crystalloids over the last 18 hours. He is on Norepinephrine at 0.25 mcg/kg/min and Vasopressin at 0.03 units/min with BP 94/58 mmHg (MAP 70 mmHg). Examination shows marked anasarca, diffuse crackles, and worsening hypoxemia (P/F ratio drops from 280 to 140). The resident considers ordering another 1-liter fluid bolus. An echocardiographic Passive Leg Raise (PLR) test is performed: baseline stroke volume is 52 mL, and upon leg elevation stroke volume changes to 53 mL (a 1.9% increase).",
      question: "How should the PLR result be interpreted, and what is the next critical phase in the patient's fluid management?",
      options: [
        "The PLR test is negative (<10% increase in stroke volume), proving that the patient is in the non-fluid-responsive plateau of the Frank-Starling curve where additional fluids will cause pulmonary edema and multi-organ congestive failure; further fluid administration must be stopped, and the clinical team should transition to the Evacuation/De-escalation phase using loop diuretics (Furosemide) or CRRT ultrafiltration to achieve a negative daily fluid balance",
        "The PLR test is positive; infuse 2 liters of normal saline immediately",
        "CVP is the only reliable guide; give fluids until CVP exceeds 20 mmHg",
        "Stop all vasopressors and start rapid blood transfusions"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates precision sepsis resuscitation: (1) PLR Physiology: A stroke volume rise of only 1.9% (threshold >=10%) confirms that the patient's heart is on the flat portion of the Frank-Starling curve and will NOT increase cardiac output with volume; (2) Fluid Overload Toxicity: Over-resuscitation produces intra-abdominal hypertension, worsening acute lung injury (P/F dropped to 140), and organ capsule stretch; (3) ROSE De-escalation: Following initial stabilization, the team must transition to the Evacuation phase, actively removing fluid via loop diuretics or CRRT ultrafiltration to restore microvascular diffusion and resolve pulmonary edema."
    }
  ]
};
