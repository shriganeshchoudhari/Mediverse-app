/**
 * Nephrology: Acute Kidney Injury (AKI) & Urinalysis Diagnostic Differentiation
 * Authoritative medical content derived from Brenner & Rector's The Kidney (11th ed.), KDIGO Clinical Guidelines.
 * Mapped to NMC CBME Competencies: IM14.1, IM14.2, PA22.1, PA22.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_KIDNEY_INJURY_URINALYSIS_MODULE: PhysiologyLessonModule = {
  id: "nephrology-adv-acute-kidney-injury-urinalysis",
  unitCode: "NE3.1",
  title: "Acute Kidney Injury: Prerenal Azotemia vs Intrinsic ATN vs AIN & Urinalysis Casts",
  competencies: ["IM14.1", "IM14.2", "PA22.1", "PA22.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Acute Kidney Injury (AKI) & Urinalysis Diagnostic Differentiation

Acute Kidney Injury is characterized by an abrupt decline in renal excretory function, categorized by etiology into **Prerenal**, **Intrinsic (Tubular, Interstitial, Vascular)**, and **Postrenal (Obstructive)**.

---

## 1. Prerenal Azotemia vs Intrinsic ATN vs Postrenal AKI Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Index} & \\textbf{Prerenal Azotemia} & \\textbf{Intrinsic ATN} & \\textbf{Postrenal AKI} \\\\
\\hline
\\textbf{BUN / Creatinine Ratio} & \\mathbf{\u003e20:1} & \\mathbf{\u003c15:1} & \\text{Variable (}\u003e15:1\\text{ early)} \\\\
\\textbf{Fractional Excretion of Na (FeNa)} & \\mathbf{\u003c1.0\\%} & \\mathbf{\u003e2.0\\%} & \\text{Variable (}\u003e1.0\\%\\text{)} \\\\
\\textbf{Fractional Excretion of Urea (FeUrea)} & \\mathbf{\u003c35\\%} \\text{ (if on diuretics)} & \\mathbf{\u003e50\\%} & \\text{Variable} \\\\
\\textbf{Urinary Sodium Concentration (UNa)} & \\mathbf{\u003c20\\text{ mEq/L}} & \\mathbf{\u003e40\\text{ mEq/L}} & \\mathbf{\u003e40\\text{ mEq/L}} \\\\
\\textbf{Urine Osmolality} & \\mathbf{\u003e500\\text{ mOsm/kg}} & \\mathbf{\u003c350\\text{ mOsm/kg}} & \\mathbf{\u003c350\\text{ mOsm/kg}} \\\\
\\textbf{Urinary Sediment Microscopy} & \\text{Hyaline casts, normal} & \\mathbf{\\text{Muddy brown granular casts}} & \\text{Normal, crystals, or hematuria} \\\\
\\hline
\\end{array}$$

- **Fractional Excretion of Sodium (FeNa) Calculation**:
  $$\\text{FeNa} = \\frac{U_{\\text{Na}} \\times P_{\\text{Cr}}}{P_{\\text{Na}} \\times U_{\\text{Cr}}} \\times 100\\%$$

---

## 2. High-Yield Urinalysis Microscopy Casts Catalog

| Cast Type | Underlying Pathophysiology | Clinical Conditions |
| :--- | :--- | :--- |
| **Muddy Brown Granular Casts** | Sloughed, necrotic tubular epithelial cells containing pigmented debris. | **Acute Tubular Necrosis (ATN)** (Ischemia, Aminoglycosides, Cisplatin, Radiocontrast). |
| **Red Blood Cell (RBC) Casts** | Intact erythrocytes trapped within Tamm-Horsfall mucoprotein across inflamed GBM. | **Glomerulonephritis / Nephritic Syndromes** (PSGN, IgA, Lupus, Vasculitis). |
| **White Blood Cell (WBC) Casts** | Leukocytes trapped in renal tubules from interstitial/tubular inflammation. | **Acute Pyelonephritis**, **Acute Interstitial Nephritis (AIN)**. |
| **Fatty Casts & Oval Fat Bodies** | Lipid droplets inside degenerating tubular cells showing **Maltese cross** polarization. | **Nephrotic Syndrome** (MCD, FSGS, Membranous). |
| **Broad Waxy Casts** | Dilated, atrophic tubules with stagnated proteinaceous material. | **Advanced Chronic Kidney Disease (End-Stage Renal Disease)**. |
| **Hyaline Casts** | Non-specific Tamm-Horsfall protein condensation during low tubular flow. | **Prerenal Azotemia**, Dehydration, Strenuous exercise. |

---

## 3. Acute Interstitial Nephritis (AIN) & Rhabdomyolysis

- **Acute Interstitial Nephritis (AIN)**:
  - **Etiology**: Drug-induced hypersensitivity ($>70\\%$): NSAIDs, Penicillins, Cephalosporins, Sulfonamides, Proton Pump Inhibitors (Omeprazole).
  - **Classic Clinical Triad (seen in $10-30\\%$)**: **Fever**, **Maculopapular Rash**, and **Eosinophilia / Eosinophiluria** with sterile pyuria and WBC casts $\\rightarrow$ discontinue offending drug $\\pm$ Corticosteroids.
- **Rhabdomyolysis-Induced AKI**:
  - **Pathology**: Muscle crush injury, prolonged immobilization, or statin toxicity $\\rightarrow$ myoglobin release $\\rightarrow$ direct tubular toxicity and intratubular cast obstruction.
  - **Diagnostic Hallmark**: **Urine dipstick positive for blood / heme**, but **NO red blood cells seen on microscopic analysis** $+$ serum Creatine Kinase (CK) $>10,000\\text{ U/L}$ $\\rightarrow$ Aggressive IV isotonic crystalloid volume expansion.
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old male with benign prostatic hyperplasia and chronic back pain taking high-dose Ibuprofen daily presents to the hospital with nausea, generalized malaise, and decreased urine output over the past 3 days. Vital signs: BP 94/58 mmHg, HR 108 bpm, dry mucous membranes. Laboratory studies demonstrate: Blood Urea Nitrogen (BUN) 64 mg/dL, Serum Creatinine 2.8 mg/dL (baseline 1.0 mg/dL), Serum Sodium 138 mEq/L. Urine studies reveal: Urine Sodium (UNa) 12 mEq/L, Urine Creatinine 84 mg/dL, Urine Osmolality 620 mOsm/kg. Urinalysis demonstrates rare hyaline casts with no red cells, white cells, or granular casts.",
      question: "Which of the following is the calculated Fractional Excretion of Sodium (FeNa) and the definitive underlying category of Acute Kidney Injury in this patient?",
      options: [
        "FeNa = 0.35% (<1.0%); Prerenal Azotemia secondary to intravascular volume depletion and NSAID-induced renal vasoconstriction",
        "FeNa = 3.2% (>2.0%); Intrinsic Acute Tubular Necrosis",
        "FeNa = 2.1%; Acute Interstitial Nephritis secondary to ibuprofen hypersensitivity",
        "FeNa = 1.8%; Postrenal obstructive uropathy"
      ],
      correctAnswerIndex: 0,
      explanation: "Using the formula FeNa = (UNa x PCr) / (PNa x UCr) x 100% = (12 x 2.8) / (138 x 84) x 100% = 33.6 / 11592 x 100% = 0.29% (~0.35%), which is well below 1.0%. Combined with a BUN/Cr ratio >20:1 (64/2.8 = 22.9), low urine sodium (<20 mEq/L), high urine osmolality (>500 mOsm/kg), and hyaline casts, this confirms Prerenal Azotemia. The patient's volume depletion combined with NSAID inhibition of vasodilatory prostaglandins (afferent arteriolar vasoconstriction) precipitated the prerenal failure, which will reverse with isotonic intravenous crystalloid volume resuscitation."
    }
  ]
};
