/**
 * Clinical Internal Medicine: Acute Kidney Injury (AKI): KDIGO Staging & FeNa
 * Authoritative medical content derived from KDIGO AKI Guidelines, Harrison's (21st ed.).
 * Mapped to NMC CBME Competencies: IM1.7, IM1.8, MD41.4, SU39.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_KIDNEY_INJURY_KDIGO_FENA_MODULE: PhysiologyLessonModule = {
  id: "medicine-adv-aki-kdigo-fena",
  unitCode: "IM7.1",
  title: "Acute Kidney Injury (AKI): KDIGO Staging, FeNa/FeUrea & Urinary Sediment Diagnostics",
  competencies: ["IM1.7", "IM1.8", "MD41.4", "SU39.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Acute Kidney Injury (AKI): KDIGO Staging & Urinary Differentials

Acute Kidney Injury is an abrupt decline in renal filtration function, categorized by KDIGO clinical staging and differentiated into prerenal, intrinsic renal, and postrenal etiologies.

---

## 1. KDIGO AKI Staging Matrix

$$\\begin{array}{lcc}
\\hline
\\textbf{KDIGO Stage} & \\textbf{Serum Creatinine Criteria} & \\textbf{Urine Output Criteria} \\\\
\\hline
\\textbf{Stage 1} & \\mathbf{1.5 - 1.9\\times\\text{ baseline}} \\text{ OR } \\mathbf{\\ge 0.3\\text{ mg/dL (}\\ge 26.5\\,\\mu\\text{mol/L) increase}} & < 0.5\\text{ mL/kg/h for } 6 - 12\\text{ hours} \\\\
\\textbf{Stage 2} & \\mathbf{2.0 - 2.9\\times\\text{ baseline}} & < 0.5\\text{ mL/kg/h for } \\ge 12\\text{ hours} \\\\
\\textbf{Stage 3} & \\mathbf{\\ge 3.0\\times\\text{ baseline}} \\text{ OR } \\mathbf{\\ge 4.0\\text{ mg/dL}} \\text{ OR initiation of RRT} & < 0.3\\text{ mL/kg/h for } \\ge 24\\text{ hours} \\\\
& & \\text{OR Anuria for } \\ge 12\\text{ hours} \\\\
\\hline
\\end{array}$$

---

## 2. Prerenal Azotemia vs ATN vs AIN Diagnostic Differentials

$$\\begin{array}{lcccc}
\\hline
\\textbf{Parameter / Test} & \\textbf{Prerenal Azotemia} & \\textbf{Acute Tubular Necrosis (ATN)} & \\textbf{Acute Interstitial Nephritis (AIN)} \\\\
\\hline
\\textbf{Pathophysiology} & \\text{Renal hypoperfusion (intact tubules)} & \\text{Ischemic / toxic tubular injury} & \\text{Drug-induced allergic tubulointerstitial inflammation} \\\\
\\textbf{BUN / Creatinine Ratio} & \\mathbf{> 20:1} & < 15:1 & < 15:1 \\\\
\\textbf{FeNa (Fractional Na Excretion)} & \\mathbf{< 1\\%} & \\mathbf{> 2\\%} & \\text{Variable (usually } > 1\\%\\text{)} \\\\
\\textbf{FeUrea (if on diuretics)} & \\mathbf{< 35\\%} & > 50\\% & > 50\\% \\\\
\\textbf{Urine Osmolality} & \\mathbf{> 500\\text{ mOsm/kg}} & < 350\\text{ mOsm/kg} & < 350\\text{ mOsm/kg} \\\\
\\textbf{Urine Sodium (UNa)} & \\mathbf{< 20\\text{ mEq/L}} & > 40\\text{ mEq/L} & > 40\\text{ mEq/L} \\\\
\\textbf{Urinary Microscopy / Casts} & \\mathbf{\\text{Hyaline casts alone}} & \\mathbf{\\text{"Muddy Brown" Granular casts}} & \\mathbf{\\text{White Blood Cell (WBC) casts,}} \\\\
& (\\text{or completely bland urine}) & + \\text{ tubular epithelial cells} & \\mathbf{\\text{sterile pyuria, eosinophiluria}} \\\\
\\hline
\\end{array}$$

- **FeNa Formula**:
  $$\\mathbf{\\text{FeNa} = \\frac{\\text{Urine Na} \\times \\text{Serum Creatinine}}{\\text{Serum Na} \\times \\text{Urine Creatinine}} \\times 100}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a history of hypertension and osteoarthritis treated with daily Naproxen and Lisinopril undergoes emergency repair of a ruptured abdominal aortic aneurysm complicated by intraoperative hemorrhagic shock and 45 minutes of cross-clamp time. On postoperative day 2, his serum creatinine has risen from a baseline of 1.0 mg/dL to 3.2 mg/dL with a urine output of 150 mL over the last 12 hours (0.18 mL/kg/h). Spot urine chemistries show: Urine Na+ 68 mEq/L, Urine Creatinine 32 mg/dL, Serum Na+ 138 mEq/L, Serum Creatinine 3.2 mg/dL. Urine microscopy reveals numerous coarse 'muddy brown' pigmented granular casts and sloughed renal tubular epithelial cells.",
      question: "According to KDIGO criteria, what is this patient's AKI stage, what is his calculated FeNa, and what is the underlying diagnosis?",
      options: [
        "KDIGO Stage 3 Acute Kidney Injury; Calculated FeNa = 4.9% (>2%), establishing Acute Tubular Necrosis (ATN) secondary to ischemic and nephrotoxic tubular injury",
        "KDIGO Stage 1 AKI; FeNa <1%, establishing Prerenal Azotemia",
        "KDIGO Stage 2 AKI; Acute Glomerulonephritis with red blood cell casts",
        "Acute Interstitial Nephritis with sterile pyuria and eosinophiluria"
      ],
      correctAnswerIndex: 0,
      explanation: "1. KDIGO Staging: A serum creatinine rise >3.0x baseline (from 1.0 to 3.2 mg/dL) or anuria/severe oliguria <0.3 mL/kg/h for >=12-24 hours fulfills the criteria for KDIGO Stage 3 AKI. 2. FeNa Calculation: FeNa = (UNa * Serum Cr) / (Serum Na * UCr) * 100 = (68 * 3.2) / (138 * 32) * 100 = 217.6 / 4416 * 100 = 4.93%. A FeNa >2%, high urine sodium (>40 mEq/L), and the pathognomonic finding of coarse 'muddy brown' granular casts composed of sloughed necrotic tubular epithelial cells confirm Acute Tubular Necrosis (ATN) triggered by profound ischemic hypotension and NSAID-mediated loss of compensatory afferent renal vasodilation."
    }
  ]
};
