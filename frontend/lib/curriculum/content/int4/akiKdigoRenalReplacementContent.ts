/**
 * Internship Core Clinical Postings: Acute Kidney Injury (KDIGO Staging) & Emergent Dialysis Indications
 * Authoritative nephrology content derived from KDIGO AKI Guidelines, Harrison's Principles.
 * Mapped to NMC CBME Competencies: IN4.3, IM4.3, NE4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AKI_KDIGO_RENAL_REPLACEMENT_MODULE: PhysiologyLessonModule = {
  id: "int4-aki-kdigo-renal-replacement",
  unitCode: "IN4.3",
  title: "Acute Kidney Injury: KDIGO Staging, FeNa Diagnostic Workup (Prerenal vs ATN) & Emergent Dialysis (AEIOU Indications)",
  competencies: ["IN4.3", "IM4.3", "NE4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Acute Kidney Injury (AKI): KDIGO Staging, FeNa & Emergent Dialysis (AEIOU)

Systematic differentiation between prerenal azotemia and acute tubular necrosis (ATN) guides targeted fluid resuscitation and timely renal replacement therapy.

---

## 1. KDIGO Clinical Staging Criteria for Acute Kidney Injury

$$\\begin{array}{lcccc}
\\hline
\\textbf{KDIGO Stage} & \\textbf{Serum Creatinine (sCr) Criteria} & \\textbf{Urine Output (UO) Criteria} \\\\
\\hline
\\textbf{Stage 1} & 1.5-1.9\\times \\text{ baseline OR } \\ge 0.3\\text{ mg/dL increase within 48h} & < 0.5\\text{ mL/kg/hr for 6-12 hours} \\\\
\\textbf{Stage 2} & 2.0-2.9\\times \\text{ baseline sCr} & < 0.5\\text{ mL/kg/hr for } \\ge 12\\text{ hours} \\\\
\\textbf{Stage 3} & \\mathbf{\\ge 3.0\\times \\text{ baseline OR } \\text{sCr} \\ge 4.0\\text{ mg/dL OR}} & \\mathbf{< 0.3\\text{ mL/kg/hr for } \\ge 24\\text{ hours}} \\\\
& \\mathbf{\\text{initiation of Renal Replacement Therapy (RRT)}} & \\mathbf{\\text{OR Anuria for } \\ge 12\\text{ hours}} \\\\
\\hline
\\end{array}$$

---

## 2. Prerenal Azotemia vs Acute Tubular Necrosis (ATN) Workup

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Test} & \\textbf{Prerenal Azotemia} & \\textbf{Intrinsic Acute Tubular Necrosis (ATN)} \\\\
\\hline
\\textbf{BUN / Creatinine Ratio} & \\mathbf{> 20 : 1 \\text{ (enhanced urea reabsorption)}} & \\approx 10-15 : 1 \\text{ (tubular damage)} \\\\
\\textbf{Fractional Excretion of } Na^+ & \\mathbf{\\text{FeNa} < 1\\% \\text{ (intact tubular } Na^+ \\text{ conservation)}} & \\mathbf{\\text{FeNa} > 2\\% \\text{ (impaired tubular } Na^+ \\text{ reabsorption)}} \\\\
\\textbf{Fractional Excretion of Urea} & \\mathbf{\\text{FeUrea} < 35\\% \\text{ (reliable even on diuretics)}} & \\text{FeUrea} > 50\\% \\\\
\\textbf{Urine Sodium (mEq/L)} & < 20\\text{ mEq/L} & > 40\\text{ mEq/L} \\\\
\\textbf{Urine Osmolality (mOsm/kg)} & > 500\\text{ mOsm/kg (concentrated)} & < 350\\text{ mOsm/kg (isosthenuric)} \\\\
\\textbf{Urine Microscopy} & \\text{Normal or Hyaline casts} & \\mathbf{\\text{Muddy brown granular casts / tubular cells}} \\\\
\\hline
\\end{array}$$

---

## 3. Emergent Indications for Renal Replacement Therapy (\"AEIOU\")

$$\\begin{array}{lcccc}
\\hline
\\textbf{Mnemonic} & \\textbf{Emergent Clinical Indication} & \\textbf{Diagnostic Threshold / Presentation} \\\\
\\hline
\\textbf{A - Acidosis} & \\text{Severe refractory metabolic acidosis} & \\mathbf{\\text{pH} < 7.10\\text{ despite optimal medical therapy}} \\\\
\\textbf{E - Electrolytes} & \\text{Refractory severe hyperkalemia} & \\mathbf{K^+ > 6.5\\text{ mEq/L with ECG changes (peaked T, sine wave)}} \\\\
\\textbf{I - Intoxications} & \\text{Dialyzable toxins (\"SLIME\")} & \\mathbf{\\text{Salicylate, Lithium, Isopropanol, Methanol, Ethylene glycol}} \\\\
\\textbf{O - Overload} & \\text{Refractory volume overload} & \\mathbf{\\text{Acute pulmonary edema unresponsive to high-dose loop diuretics}} \\\\
\\textbf{U - Uremia} & \\text{Severe symptomatic uremia} & \\mathbf{\\text{Uremic pericarditis (friction rub), uremic encephalopathy, asterixis}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old male with chronic kidney disease (baseline creatinine 1.4 mg/dL) is admitted with septic shock secondary to pneumonia. Over the past 24 hours, his urine output has been 15 mL/hour (weight 70 kg, corresponding to 0.21 mL/kg/hr for 24 hours). Laboratory evaluation shows: BUN 84 mg/dL, Serum creatinine 4.5 mg/dL, Serum potassium 6.8 mEq/L with peaked T waves on ECG, Arterial blood gas pH 7.08 and HCO3- 9 mEq/L. High-dose IV furosemide, calcium gluconate, and insulin-dextrose have been administered, but hyperkalemia and oliguria persist.",
      question: "What KDIGO stage of AKI does this patient have, and what is the definitive life-saving intervention indicated?",
      options: [
        "KDIGO Stage 3 AKI; emergent Renal Replacement Therapy (Hemodialysis) is indicated based on multiple refractory 'AEIOU' criteria: Refractory Acidosis (pH <7.10), Refractory severe hyperkalemia (K+ >6.5 with ECG changes), and Oliguria/Anuria (<0.3 mL/kg/hr for >24h)",
        "KDIGO Stage 1 AKI; discharge home on oral sodium polystyrene sulfonate",
        "KDIGO Stage 2 AKI; administer 4 liters of normal saline without dialysis consultation",
        "Prerenal azotemia; observe for 48 hours without repeat labs"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates KDIGO Stage 3 AKI with multiple emergent indications for urgent dialysis: (1) KDIGO Staging: Serum creatinine has tripled from baseline (1.4 -> 4.5 mg/dL) and is >=4.0 mg/dL, with urine output <0.3 mL/kg/hr for 24 hours, meeting Stage 3 criteria; (2) Emergent Dialysis Indications ('AEIOU'): (A) Acidosis with arterial pH 7.08; (E) Electrolyte disturbance with refractory K+ 6.8 mEq/L and ECG manifestations; (O) Oliguria/Overload; (3) Life-Saving Intervention: Urgent initiation of continuous renal replacement therapy (CRRT) or emergent hemodialysis."
    }
  ]
};
