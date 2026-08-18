/**
 * Nephrology: Glomerulopathies, Nephritic vs Nephrotic Syndromes
 * Authoritative medical content derived from Brenner & Rector's The Kidney (11th ed.), Robbins & Cotran Pathologic Basis of Disease (10th ed.).
 * Mapped to NMC CBME Competencies: PA21.1, PA21.2, IM13.1, IM13.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GLOMERULOPATHIES_NEPHRITIC_NEPHROTIC_MODULE: PhysiologyLessonModule = {
  id: "nephrology-adv-glomerulopathies-nephritic-nephrotic",
  unitCode: "NE1.1",
  title: "Glomerulopathies: Nephrotic (MCD, FSGS, Membranous) vs Nephritic Syndromes (PSGN, IgA, RPGN)",
  competencies: ["PA21.1", "PA21.2", "IM13.1", "IM13.2"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Glomerulopathies: Nephrotic vs Nephritic Syndromes

Glomerular diseases are broadly categorized into **Nephrotic Syndromes** (characterized by podocyte injury, selective/non-selective heavy proteinuria, and hypoalbuminemia) and **Nephritic Syndromes** (characterized by inflammatory capillary loop rupture, hematuria with RBC casts, and acute renal failure).

---

## 1. Nephrotic vs Nephritic Diagnostic Profiles

$$\\begin{array}{lcc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Nephrotic Syndrome} & \\textbf{Nephritic Syndrome} \\\\
\\hline
\\textbf{Proteinuria Magnitude} & \\mathbf{\\text{Heavy } \u003e3.5\\text{ g/24h (or PCR } \u003e3.5\\text{)}} & \\text{Sub-nephrotic (}\u003c3.5\\text{ g/24h)} \\\\
\\textbf{Hematuria \u0026 Sediments} & \\text{Fatty casts, \"Maltese cross\", oval fat bodies} & \\mathbf{\\text{Dysmorphic RBCs, RBC casts, cola urine}} \\\\
\\textbf{Serum Albumin} & \\mathbf{\\downarrow\\downarrow\\text{ Hypoalbuminemia (}\u003c3.0\\text{ g/dL)}} & \\text{Normal or mildly decreased} \\\\
\\textbf{Peripheral Edema} & \\mathbf{\\text{Severe generalized anasarca (periorbital + pedal)}} & \\text{Mild-to-moderate periorbital edema} \\\\
\\textbf{Blood Pressure} & \\text{Normal or mild hypertension} & \\mathbf{\\text{Prominent Hypertension (fluid overload)}} \\\\
\\textbf{Hypercoagulability} & \\mathbf{\\text{High risk (loss of Antithrombin III)}} & \\text{Rare} \\\\
\\hline
\\end{array}$$

---

## 2. Major Nephrotic Diseases

1. **Minimal Change Disease (MCD)**:
   - **Epidemiology**: Most common cause of nephrotic syndrome in children ($2-6\\text{ years}$).
   - **Histopathology**: Light Microscopy (LM) is completely **normal**; Electron Microscopy (EM) demonstrates **diffuse effacement of podocyte foot processes**.
   - **Therapy**: Excellent response to **oral Corticosteroids (Prednisone)** in $>90\\%$ of cases.

2. **Focal Segmental Glomerulosclerosis (FSGS)**:
   - **Epidemiology**: Most common cause of nephrotic syndrome in African Americans and adults; associated with HIV, heroin use, sickle cell, and *APOL1* genetic risk variants.
   - **Histopathology**: LM shows segmental sclerosis of some (focal) glomeruli with hyalinosis; steroid-resistant $\\rightarrow$ frequent progression to ESRD.

3. **Membranous Nephropathy**:
   - **Epidemiology**: Primary (autoantibodies to **phospholipase A2 receptor [anti-PLA2R]** in $70-80\\%$); Secondary (NSAIDs, hepatitis B/C, solid tumors, lupus class V).
   - **Histopathology**: Diffuse thickening of glomerular capillary wall; Immunofluorescence shows granular subepithelial IgG and C3; EM shows **\"spike-and-dome\"** subepithelial electron-dense deposits.
   - **Complication**: Highest incidence of **Renal Vein Thrombosis** among all nephrotic syndromes.

4. **Diabetic Nephropathy**:
   - **Pathophysiology**: Hyperglycemic hyperfiltration $\\rightarrow$ non-enzymatic glycation of efferent arteriole $\\rightarrow$ mesangial expansion and **Kimmelstiel-Wilson nodular glomerulosclerosis** $\\rightarrow$ ACEi/ARBs, SGLT2 inhibitors.

---

## 3. Major Nephritic Diseases & Rapidly Progressive Glomerulonephritis (RPGN)

1. **Post-Streptococcal Glomerulonephritis (PSGN)**:
   - **Clinical Presentation**: Group A $\\beta$-hemolytic Streptococcal pharyngitis ($1-2\\text{ weeks}$) or impetigo ($3-6\\text{ weeks}$) $\\rightarrow$ cola-colored urine, periorbital edema, hypertension.
   - **Diagnostics**: Elevated ASO/anti-DNase B titers, **depressed serum C3 complement**; EM shows subepithelial **\"humps\"**; LM shows diffuse endocapillary hypercellularity.

2. **IgA Nephropathy (Berger Disease)**:
   - **Clinical Presentation**: **Synpharyngitic hematuria** (gross hematuria developing within $1-2\\text{ days}$ during a viral upper respiratory or GI infection, recurring episodically); normal serum complement.
   - **Histopathology**: Mesangial proliferation with mesangial **IgA and C3 deposition** on immunofluorescence.

3. **Rapidly Progressive Glomerulonephritis (RPGN / Crescentic GN)**:
   - Characterized by rapid deterioration of renal function over weeks with **Crescent formation in Bowman\'s space** (composed of proliferated parietal epithelial cells, macrophages, and fibrin).
   - **Type I (Anti-GBM / Goodpasture Disease)**: Linear IgG and C3 along GBM $+$ pulmonary alveolar hemorrhage (hemoptysis).
   - **Type II (Immune Complex)**: Granular \"full-house\" deposition (Lupus Nephritis Class IV).
   - **Type III (Pauci-Immune ANCA Vasculitis)**: Negative / scanty IF: **Granulomatosis with Polyangiitis (GPA)** (c-ANCA / PR3-ANCA $+$ upper/lower respiratory granulomas) vs **Microscopic Polyangiitis (MPA)** (p-ANCA / MPO-ANCA; no granulomas).
`,
  clinicalVignettes: [
    {
      scenario: "A 44-year-old male presents with heavy bilateral pedal edema and frothy urine. Laboratory evaluation reveals: Serum Albumin 2.1 g/dL, Total Cholesterol 380 mg/dL, 24-hour urine protein excretion 7.4 g, and Serum Creatinine 1.1 mg/dL. Urinalysis demonstrates oval fat bodies displaying a 'Maltese cross' pattern under polarized light. Serology is positive for circulating anti-phospholipase A2 receptor (anti-PLA2R) autoantibodies. A renal biopsy demonstrates diffuse capillary wall thickening with a 'spike-and-dome' subepithelial IgG deposit pattern on electron microscopy.",
      question: "Which of the following complications is this patient at highest risk of developing compared to other glomerular diseases?",
      options: [
        "Renal Vein Thrombosis secondary to hypercoagulability from urinary antithrombin III loss",
        "Rapid progression to crescentic glomerulonephritis with pulmonary hemorrhage",
        "Spontaneous bacterial peritonitis from IgA deficiency",
        "Acute tubular necrosis from massive myoglobinuria"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic primary Membranous Nephropathy confirmed by nephrotic-range proteinuria (7.4 g/24h), hypoalbuminemia, hypercholesterolemia, positive anti-PLA2R antibodies, and pathognomonic 'spike-and-dome' subepithelial deposits on EM. Among all nephrotic syndromes, Membranous Nephropathy carries the highest risk for thromboembolic complications, particularly Renal Vein Thrombosis (and pulmonary embolism), due to urinary loss of endogenous anticoagulant factors (Antithrombin III, Protein C, Protein S) and hepatic hyperproduction of fibrinogen."
    }
  ]
};
