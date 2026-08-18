/**
 * Clinical Postings I: Clinical Fluid Management, Electrolyte Calculations & Inpatient Prescribing
 * Authoritative fluid & electrolyte management content derived from Harrison, Marino's ICU Book.
 * Mapped to NMC CBME Competencies: CP1.4, IM1.4, SU1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FLUID_MANAGEMENT_ELECTROLYTE_EMERGENCY_MODULE: PhysiologyLessonModule = {
  id: "clin1-fluid-management-electrolyte-emergency",
  unitCode: "CP1.4",
  title: "Inpatient Fluid & Electrolyte Resuscitation: Holiday-Segar Rule, Hyponatremia Correction & Emergency Hyperkalemia Protocol",
  competencies: ["CP1.4", "IM1.4", "SU1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Inpatient Fluid Management, Electrolyte Calculations & Emergency Protocols

Accurate maintenance fluid prescribing and disciplined electrolyte correction velocities prevent life-threatening osmotic demyelination and cardiac arrest.

---

## 1. Maintenance IV Fluid Prescribing: The Holiday-Segar Rule (4-2-1 Rule)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Weight Tier} & \\textbf{Daily Fluid Requirement} & \\textbf{Hourly Fluid Rate} & \\textbf{Exemplar Calculation (70 kg Adult)} \\\\
\\hline
\\textbf{First 10 kg (1-10 kg)} & 100\\text{ mL/kg/day} & 4\\text{ mL/kg/hr} & 10 \\times 4 = 40\\text{ mL/hr} \\\\
\\textbf{Next 10 kg (11-20 kg)} & 50\\text{ mL/kg/day} & 2\\text{ mL/kg/hr} & 10 \\times 2 = 20\\text{ mL/hr} \\\\
\\textbf{Each kg above 20 kg} & 20\\text{ mL/kg/day} & 1\\text{ mL/kg/hr} & (70 - 20) \\times 1 = 50\\text{ mL/hr} \\\\
\\hline
\\textbf{Total Standard Maintenance Rate} & \\mathbf{\\text{Weight (kg) } + 40\\text{ mL/hr for adults } > 20\\text{ kg}} & \\mathbf{70 + 40 = 110\\text{ mL/hr}} \\\\
\\hline
\\end{array}$$

- **Crystalloid Fluid Physics**:
  - **Normal Saline ($0.9\\% \\text{ NaCl}$)**: $154\\text{ mEq/L } Na^+$, $154\\text{ mEq/L } Cl^-$ (supraphysiological chloride $\\rightarrow$ risk of **hyperchloremic non-anion gap metabolic acidosis** and renal vasoconstriction).
  - **Balanced Crystalloids (Lactated Ringer\'s / Plasma-Lyte)**: $130\\text{ mEq/L } Na^+$, $109\\text{ mEq/L } Cl^-$, $28\\text{ mEq/L lactate}$ (physiological buffering, lower risk of acute kidney injury and hyperchloremia).

---

## 2. Severe Hyponatremia \u0026 Emergency Hyperkalemia Algorithms

$$\\begin{array}{lcccc}
\\hline
\\textbf{Electrolyte Disorder} & \\textbf{Emergency Risk} & \\textbf{Core Therapeutic Protocol} & \\textbf{Critical Safety Constraint} \\\\
\\hline
\\textbf{Severe Symptomatic} & \\text{Cerebral edema, seizures,} & \\mathbf{3\\% \\text{ Hypertonic Saline (513 mEq/L Na)}} & \\mathbf{\\text{MAXIMUM correction rate:}} \\\\
\\textbf{Hyponatremia (Na } < 120\\text{)} & \\text{transtentorial herniation} & 100\\text{ mL IV bolus over 10-15 min (repeat } \\times 2\\text{ PRN)} & \\mathbf{6\\text{--}8\\text{ mEq/L in 24 hours}} \\\\
& & \\text{to raise Na by 4-6 mEq/L and stop seizures} & \\mathbf{\\text{(Prevents Osmotic Demyelination / CPM)}} \\\\
\\textbf{Severe Hyperkalemia} & \\mathbf{\\text{Fatal arrhythmias: Sine wave,}} & \\mathbf{\\text{1. Stabilize Membrane: IV Calcium Gluconate (10\\%) 10 mL}} & \\text{Calcium does NOT lower potassium; MUST} \\\\
(\\textbf{K}^+ > 6.5\\text{ or ECG changes)} & \\text{VFib, asystole} & \\mathbf{\\text{2. Shift Intracellular: Regular Insulin 10 U IV + D50W (50 mL)}} & \\text{give glucose to prevent hypoglycemia;} \\\\
& & \\mathbf{\\text{3. Eliminate: Furosemide, Lokelma, Hemodialysis}} & \\text{repeat ECG within 15 minutes} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with end-stage renal disease (ESRD) on maintenance hemodialysis misses two dialysis sessions. He presents to the emergency department with profound generalized muscular weakness. His ECG reveals tall, peaked T waves, widened QRS complexes (140 ms), and loss of P waves. Point-of-care laboratory testing reveals a serum potassium of 7.8 mEq/L.",
      question: "What is the immediate, life-saving first step in managing this patient?",
      options: [
        "Administer IV Calcium Gluconate (10 mL of 10% solution) immediately over 2-3 minutes to stabilize the cardiac myocyte resting membrane potential and prevent fatal ventricular fibrillation",
        "Administer oral Sodium Polystyrene Sulfonate (Kayexalate) and wait 4 hours",
        "Administer IV Normal Saline at 500 mL/hr to dilute potassium",
        "Administer oral Furosemide 20 mg"
      ],
      correctAnswerIndex: 0,
      explanation: "This case represents a life-threatening Hyperkalemic Emergency with conduction abnormalities: (1) Step 1 - Membrane Stabilization (IMMEDIATE): IV Calcium Gluconate (10%) or Calcium Chloride restores cardiac membrane excitability by raising the threshold potential, immediately neutralizing the risk of fatal ventricular arrhythmias (sine wave / VFib); calcium does not lower potassium levels; (2) Step 2 - Intracellular Shift: IV Regular Insulin (10 units) plus 50 mL of 50% Dextrose (D50W), paired with inhaled Albuterol, rapidly drives potassium into cells within 15-30 minutes; (3) Step 3 - Potassium Elimination: Emergent hemodialysis or gastrointestinal cation binders (Lokelma/Patiromer) remove total body potassium."
    }
  ]
};
