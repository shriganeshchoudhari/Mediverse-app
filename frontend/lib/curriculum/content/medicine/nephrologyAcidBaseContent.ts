/**
 * Nephrology, Acid-Base & Electrolyte Disorders Learning Content
 * Authoritative medical content derived from Harrison, Davidson, Brenner & Rector, and USMLE Step 2 CK.
 * Mapped to NMC CBME Competencies: IM3.1, IM3.2, IM3.3, IM3.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEPHROLOGY_ACIDBASE_MODULE: PhysiologyLessonModule = {
  id: "med-nephrology",
  unitCode: "IM3.1",
  title: "Nephrology: Acute Kidney Injury (KDIGO), Prerenal vs ATN, Glomerulonephritis & Severe Electrolyte Emergencies",
  competencies: ["IM3.1", "IM3.2", "IM3.3", "IM3.4"],
  estimatedMinutes: 135,
  organ3dTarget: "RENAL",
  markdownContent: `
# Nephrology: Acute Kidney Injury (KDIGO), Prerenal vs ATN, Glomerulonephritis & Severe Electrolyte Emergencies

Nephrology integrates glomerular filtering dynamics, tubular transport mechanisms, fluid-electrolyte homeostasis, and systemic acid-base equilibrium.

---

## 1. Acute Kidney Injury (AKI): Prerenal Azotemia vs Acute Tubular Necrosis (ATN)

| Diagnostic Parameter | Prerenal Azotemia (Hypovolemia / Low EABV) | Intrinsic AKI / Acute Tubular Necrosis (Ischemic / Toxic) |
| :--- | :--- | :--- |
| **Pathophysiologic Mechanism** | Renal hypoperfusion with **intact tubular reabsorptive machinery** | Tubular epithelial cell injury/death with **loss of concentrated reabsorptive capacity** |
| **BUN / Serum Creatinine Ratio** | **$> 20 : 1$** (avid proximal urea reabsorption) | **$< 15 : 1$** |
| **Fractional Excretion of Sodium ($FeNa$)** | **$< 1.0\\%$ (Avid Na+ retention)** | **$> 2.0\\%$ (Tubular Na+ wasting)** |
| **Urine Sodium ($U_{Na}$)** | **$< 20\\text{ mEq/L}$** | **$> 40\\text{ mEq/L}$** |
| **Urine Osmolality ($U_{Osm}$)** | **$> 500\\text{ mOsm/kg}$ (Concentrated)** | **$< 350\\text{ mOsm/kg}$ (Isosthenuric)** |
| **Urine Microscopy / Casts** | **Hyaline casts** or normal bland sediment | **"Muddy Brown" Granular Casts** & renal tubular epithelial cell casts |
| **Response to Volume Resuscitation** | Rapid normalization of creatinine with IV fluids | No immediate response; requires supportive care & time for tubular regeneration |

$$FeNa = \\frac{U_{Na} \\times S_{Cr}}{S_{Na} \\times U_{Cr}} \\times 100$$
*(Note: If patient is on loop diuretics, use Fractional Excretion of Urea: $FeUrea < 35\\% \\implies$ Prerenal).*

---

## 2. Nephrotic vs Nephritic Glomerular Syndromes

- **Nephrotic Syndrome**:
  - **Tetrad**: Heavy Proteinuria ($>3.5\\text{ g/24h}$), Hypoalbuminemia ($<3.0\\text{ g/dL}$), Generalized Dependent Edema (anasarca), Hyperlipidemia / Lipiduria (**"Maltese cross"** on polarized microscopy).
  - Classic Entities: **Minimal Change Disease** (effacement of podocyte foot processes on EM, steroid-responsive in kids), **Focal Segmental Glomerulosclerosis (FSGS)** (HIV, heroin, sickle cell), **Membranous Nephropathy** (anti-PLA2R antibodies, "spike and dome" on silver stain).
- **Nephritic Syndrome**:
  - **Hallmarks**: Hematuria with **dysmorphic RBCs and RBC casts**, Oliguria, Hypertension, and Mild-to-Moderate Proteinuria ($<3.5\\text{ g/day}$).
  - Classic Entities: **Post-Streptococcal Glomerulonephritis (PSGN)** (subepithelial "humps", low C3), **IgA Nephropathy / Berger Disease** (gross hematuria days after URI), **Rapidly Progressive Glomerulonephritis (RPGN)** (crescent formation on biopsy, ANCA/anti-GBM).

---

## 3. Severe Electrolyte Emergencies

1. **Hyperkalemia ($K^+ > 5.5\\text{ mEq/L}$)**:
   - **ECG Progression**: Tall peaked T waves $\\rightarrow$ PR prolongation & flattening P waves $\\rightarrow$ QRS widening $\\rightarrow$ Sine wave $\\rightarrow$ Ventricular Fibrillation / Asystole.
   - **Emergency 4-Step Treatment Protocol**:
     1. **Stabilize Cardiac Membrane**: **IV Calcium Gluconate (10%)** 10 mL over 2–5 min (onset 1–3 min; protects against lethal arrhythmia, does NOT lower serum $K^+$).
     2. **Shift Potassium Intracellularly**: **IV Regular Insulin (10 Units) $+$ 50% Dextrose (50 mL)** (drives $K^+$ into cells via $Na^+/K^+$ ATPase; onset 15–30 min) $\\pm$ **Nebulized Albuterol** (10–20 mg).
     3. **Eliminate Potassium from Body**: Loop diuretics (Furosemide), Gastrointestinal cation binders (Sodium Polystyrene, Patiromer, Sodium Zirconium Cyclosilicate).
     4. **Definitive Clearance**: **Hemodialysis** (for refractory hyperkalemia or anuric renal failure).
2. **Hyponatremia & Correction Rate Limit**:
   - **Severe Acute Symptomatic**: Administer **3% Hypertonic Saline** (bolus 100 mL).
   - **Critical Safety Ceiling**: Correct serum $Na^+$ by **NO MORE than $8\\text{–}10\\text{ mEq/L per 24 hours}$** to prevent irreversible **Osmotic Demyelination Syndrome (Central Pontine Myelinolysis)**.
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old female with end-stage renal disease misses two consecutive hemodialysis sessions. She presents with severe generalized muscle weakness and palpitations. Electrocardiogram demonstrates wide QRS complexes (140 ms) and tall, tented, peaked T waves in precordial leads. Point-of-care potassium is 7.2 mEq/L.",
      question: "Which of the following medications must be administered as the very first immediate intervention?",
      options: [
        "Intravenous Calcium Gluconate (10%)",
        "Intravenous Regular Insulin with 50% Dextrose",
        "Oral Sodium Zirconium Cyclosilicate (Lokelma)",
        "Nebulized Albuterol high-dose"
      ],
      correctAnswerIndex: 0,
      explanation: "In severe hyperkalemia with electrocardiographic abnormalities (widened QRS, peaked T waves), the immediate life-saving priority is to antagonize potassium-induced cardiac toxicity and stabilize the myocardial resting membrane potential by administering Intravenous Calcium Gluconate. While insulin, dextrose, and albuterol lower potassium by shifting it into cells, only calcium provides immediate membrane stabilization within 1 to 3 minutes to prevent imminent ventricular fibrillation."
    }
  ]
};
