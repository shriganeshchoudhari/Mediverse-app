/**
 * Molecular Genetics, Purines, Vitamins & Storage Diseases Learning Content
 * Authoritative medical content derived from Harper's, Lippincott, Lehninger, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: BI6.1, BI7.1, BI8.1, BI9.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MOLECULAR_GENETICS_MODULE: PhysiologyLessonModule = {
  id: "bioc-molecular-genetics",
  unitCode: "BI6.1",
  title: "Purine/Pyrimidine Metabolism, Lysosomal Storage Diseases & Vitamins",
  competencies: ["BI6.1", "BI7.1", "BI8.1", "BI9.1"],
  estimatedMinutes: 120,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Purine/Pyrimidine Metabolism, Lysosomal Storage Diseases & Vitamins

Nucleotide biosynthesis, lysosomal sphingolipid degradation, and water-soluble/fat-soluble vitamin coenzymes underpin genome integrity, cellular energy transfer, and membrane turnover.

---

## 1. Purine & Pyrimidine Synthesis & Lesch-Nyhan Syndrome

- **Purine De Novo Synthesis**:
  - Precursors: Glutamine, Aspartate, Glycine, $CO_2$, and $N^{10}$-Formyl-THF.
  - Rate-limiting enzyme: **PRPP Amidotransferase** (inhibited by IMP, AMP, GMP; 6-Mercaptopurine).
- **Purine Salvage Pathway**:
  - Free purines (Hypoxanthine, Guanine) are salvaged back to IMP and GMP by **Hypoxanthine-Guanine Phosphoribosyltransferase (HGPRT)**:
    $$\\text{Hypoxanthine} + \\text{PRPP} \\rightarrow \\text{IMP} + \\text{PPi} \\quad (\\text{via HGPRT})$$
    $$\\text{Guanine} + \\text{PRPP} \\rightarrow \\text{GMP} + \\text{PPi} \\quad (\\text{via HGPRT})$$
- **Lesch-Nyhan Syndrome (X-Linked Recessive)**:
  - Absent **HGPRT** activity $\\implies$ inability to salvage purines $\\implies$ PRPP accumulates $\\implies$ massive de novo purine synthesis and excessive degradation into **Uric Acid**.
  - **Clinical Triad (Mnemonic: HGPRT)**:
    - **H**yperuricemia & Gout (orange 'sand' / sodium urate crystals in diapers)
    - **G**outy arthritis and nephrolithiasis
    - **P**issed off (severe aggression, compulsive **Self-Mutilation**—lip and finger biting)
    - **R**etardation (Intellectual disability)
    - **Dystonia** & Choreoathetosis
  - *Treatment*: **Allopurinol** or **Febuxostat** (competitive inhibitors of **Xanthine Oxidase**).

---

## 2. Lysosomal Storage Diseases (Sphingolipidoses)

| Disease | Deficient Enzyme | Accumulated Toxic Substrate | Pathognomonic Clinical Features |
| :--- | :--- | :--- | :--- |
| **Tay-Sachs Disease**<br>(Autosomal Recessive) | **Hexosaminidase A** | **$GM_2$ Ganglioside** | **Cherry-red spot on macula**, progressive neurodegeneration, developmental regression, hyperreflexia, **NO Hepatosplenomegaly** (*differentiates from Niemann-Pick*), onion-skin lysosomes. |
| **Niemann-Pick Disease**<br>(Autosomal Recessive) | **Sphingomyelinase** | **Sphingomyelin** | **Cherry-red spot on macula**, progressive neurodegeneration, **Profound Hepatosplenomegaly**, **Foam cells / Lipid-laden macrophages** in bone marrow. |
| **Gaucher Disease**<br>(Autosomal Recessive) | **Glucocerebrosidase** ($\\beta$-Glucosidase) | **Glucocerebroside** | **Most common lysosomal storage disease**. **Hepatosplenomegaly**, pancytopenia, aseptic bone necrosis, **Erlenmeyer flask deformity** of femur, **Gaucher cells** (lipid-laden macrophages resembling **wrinkled/crumpled tissue paper**). |
| **Fabry Disease**<br>(X-Linked Recessive) | **$\\alpha$-Galactosidase A** | **Ceramide Trihexoside** (Globotriaosylceramide) | **Triad**: Episodic severe burning neuropathic pain in hands/feet (**Acroparesthesias**), **Angiokeratomas** (dark red punctate skin papules), and **Hypohidrosis** (decreased sweating); late-stage progressive renal and cardiac failure. |

---

## 3. High-Yield Vitamin Coenzymes & Deficiency Syndromes

- **Vitamin $B_1$ (Thiamine)**:
  - Active cofactor: **Thiamine Pyrophosphate (TPP)** for Pyruvate Dehydrogenase, $\\alpha$-Ketoglutarate Dehydrogenase, Transketolase (HMP shunt), and BCKDH.
  - *Deficiency*:
    - **Wernicke Encephalopathy**: Acute triad of **Confusion, Ophthalmoplegia (nystagmus), and Ataxia** (reversible with IV thiamine).
    - **Korsakoff Psychosis**: Irreversible anterograde/retrograde amnesia with **confabulation** and mamillary body atrophy.
    - **Dry Beriberi**: Symmetrical peripheral polyneuropathy and muscle wasting.
    - **Wet Beriberi**: High-output dilated cardiomyopathy and peripheral edema.
- **Vitamin $B_3$ (Niacin)**:
  - Active cofactors: $NAD^+, NADP^+$. Derived from amino acid **Tryptophan** (requires $B_2$ and $B_6$ cofactors).
  - *Deficiency*: **Pellagra** (The **4 D\'s**: **D**iarrhea, **D**ermatitis / photosensitive casall necklace rash, **D**ementia, **D**eath).
- **Vitamin $B_{12}$ (Cobalamin) vs Folate ($B_9$)**:
  - Both cause **Megaloblastic Anemia** with hypersegmented neutrophils.
  - **Vitamin $B_{12}$ Deficiency**: Elevated **Methylmalonic Acid (MMA)** AND Homocysteine; causes **Subacute Combined Degeneration of the Spinal Cord** (dorsal and lateral corticospinal tracts $\\implies$ loss of vibration/proprioception and spastic paresis).
  - **Folate Deficiency**: Elevated Homocysteine with **NORMAL Methylmalonic Acid**; NO neurological deficits.
`,
  clinicalVignettes: [
    {
      scenario: "A 2-year-old male child is brought to the pediatric neurology clinic by his mother due to progressive severe irritability and self-injurious behavior. Physical examination reveals extensive ulcerations on his lips and fingertips from compulsive biting, generalized choreoathetosis, and spasticity. Microscopic urinalysis demonstrates orange crystalline deposits. Serum uric acid concentration is markedly elevated at 14.8 mg/dL.",
      question: "Which of the following enzymes is deficient in this patient?",
      options: [
        "Hypoxanthine-Guanine Phosphoribosyltransferase (HGPRT / Lesch-Nyhan Syndrome)",
        "Adenosine Deaminase (Severe Combined Immunodeficiency)",
        "Xanthine Oxidase (Hereditary Xanthinuria)",
        "Hexosaminidase A (Tay-Sachs Disease)"
      ],
      correctAnswerIndex: 0,
      explanation: "Lesch-Nyhan Syndrome is an X-linked recessive disorder caused by complete deficiency of HGPRT (Hypoxanthine-Guanine Phosphoribosyltransferase). Impaired purine salvage results in massive accumulation of PRPP, hyperuricemia (orange 'sand' in diapers, gouty nephropathy), choreoathetosis, and pathognomonic compulsive self-mutilation (lip and finger biting)."
    }
  ]
};
