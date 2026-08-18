/**
 * Amino Acid Metabolism & Urea Cycle Learning Content
 * Authoritative medical content derived from Harper's, Lippincott, Lehninger, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: BI5.1, BI5.2, BI5.3, BI5.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AMINO_ACID_METABOLISM_MODULE: PhysiologyLessonModule = {
  id: "bioc-amino-acid",
  unitCode: "BI5.1",
  title: "Amino Acid Catabolism, Urea Cycle & Inborn Metabolic Errors",
  competencies: ["BI5.1", "BI5.2", "BI5.3", "BI5.4"],
  estimatedMinutes: 120,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Amino Acid Catabolism, Urea Cycle & Inborn Metabolic Errors

Nitrogenous waste generated from protein turnover is detoxified into **water-soluble Urea** in the hepatocytes of the liver via the mitochondrial and cytosolic reactions of the **Urea Cycle**.

---

## 1. Urea Cycle & Hyperammonemia

The Urea Cycle detoxifies free toxic ammonia ($NH_3 / NH_4^+$) into nontoxic urea:

> **Urea Cycle Reaction Sequence (Mnemonic: Ordinarily, Careless Careless Crappers Are Also Frivolous)**:
> 1. **Mitochondria - Rate-Limiting Step**:
>    $$NH_4^+ + HCO_3^- + 2\\text{ ATP} \\rightarrow \\text{Carbamoyl Phosphate} + 2\\text{ ADP} + P_i$$
>    *Obligate Allosteric Activator*: **N-Acetylglutamate (NAG)** (synthesized by NAG synthase from glutamate + acetyl-CoA; stimulated by Arginine).
> 2. **Mitochondria**: Carbamoyl Phosphate + **Ornithine** $\\rightarrow$ **Citrulline** (via Ornithine Transcarbamylase / OTC; Citrulline exits to cytosol).
> 3. **Cytosol**: Citrulline + **Aspartate** (donates 2nd nitrogen) $\\rightarrow$ **Argininosuccinate** (via Argininosuccinate Synthetase).
> 4. **Cytosol**: Argininosuccinate $\\rightarrow$ **Arginine** + **Fumarate** (via Argininosuccinase / ASL; Fumarate enters TCA cycle).
> 5. **Cytosol**: Arginine $\\rightarrow$ **Urea** + **Ornithine** (via Arginase-1; Ornithine re-enters mitochondria to repeat cycle).

### Urea Cycle Enzyme Deficiencies:
- **Ornithine Transcarbamylase (OTC) Deficiency (X-Linked Recessive)**:
  - *Most common urea cycle disorder*.
  - Excess carbamoyl phosphate shunts into pyrimidine synthesis $\\implies$ **$\\uparrow \\uparrow$ Orotic Acid in blood/urine**, **$\\uparrow \\uparrow$ Ammonia**, $\\downarrow$ BUN.
  - *Differentiated from Orotic Aciduria*: OTC deficiency has **Hyperammonemia** and NO megaloblastic anemia; Orotic Aciduria (UMP synthase deficiency) has megaloblastic anemia refractory to B12/folate, normal ammonia.
- **Hyperammonemia Toxicity**:
  - Excess ammonia shifts $\\alpha$-ketoglutarate $\\rightarrow$ glutamate $\\rightarrow$ glutamine in astrocytes $\\implies$ cerebral edema, lethargy, flapping tremor (**Asterixis**), slurred speech, vomiting, coma.
  - *Treatment*: Low-protein diet, **Lactulose** (acidifies gut lumen trapping $NH_4^+$ for excretion), **Sodium Phenylbutyrate / Sodium Benzoate** (nitrogen scavengers).

---

## 2. Classic Amino Acid Inborn Errors of Metabolism

| Disease | Deficient Enzyme & Cofactor | Accumulated Toxic Metabolites | Pathognomonic Clinical Presentation | Treatment |
| :--- | :--- | :--- | :--- | :--- |
| **Phenylketonuria (PKU)**<br>(Autosomal Recessive) | **Phenylalanine Hydroxylase (PAH)** or **Tetrahydrobiopterin ($BH_4$)** | Phenylalanine, Phenylpyruvate, Phenyllactate, Phenylacetate | **Musty / Mousy body odor**, Intellectual disability, Microcephaly, Seizures, **Fair hypopigmented skin & blue eyes** (due to $\\downarrow$ melanin from tyrosine block) | Low phenylalanine diet, $\\uparrow$ Tyrosine supplementation, $BH_4$ (Sapropterin) |
| **Maple Syrup Urine Disease (MSUD)**<br>(Autosomal Recessive) | **Branched-Chain $\\alpha$-Ketoacid Dehydrogenase (BCKDH)** ($+$ $B_1$ Thiamine) | Branched-chain amino acids: **Isoleucine, Leucine, Valine** (Mnemonic: **I Love Vermont**) | **Sweet maple syrup / burnt sugar odor of urine/earwax**, severe CNS toxicity, dystonia, vomiting, coma | Restriction of Isoleucine, Leucine, Valine; High-dose Thiamine ($B_1$) |
| **Alkaptonuria**<br>(Autosomal Recessive) | **Homogentisate Oxidase** (Tyrosine degradation pathway) | **Homogentisic Acid** | **Urine turns dark/black on standing** (oxidation); **Ochronosis** (blue-black pigmentation in sclerae and ear cartilage); Severe debilitating arthralgias in spine/large joints | Dietary tyrosine and phenylalanine restriction |
| **Homocystinuria**<br>(Autosomal Recessive) | **Cystathionine $\\beta$-Synthase (CBS)** ($+$ Vitamin $B_6$ / PLP) | **Homocysteine**, Methionine | **Down-and-in lens subluxation (Ectopia lentis)**, **Marfanoid habitus** (tall stature, long fingers), Intellectual disability, **Severe premature thromboembolism / DVT / Stroke** | High-dose Pyridoxine ($B_6$), Cysteine supplementation, Folate/$B_{12}$ |
`,
  clinicalVignettes: [
    {
      scenario: "A 3-day-old male newborn becomes lethargic and stops feeding. He develops generalized hypertonia and cyclical bicycling movements of his legs. Physical examination reveals an infant in acute encephalopathy, and a distinct sweet maple syrup odor is noted in his diaper and earwax. Serum amino acid analysis reveals markedly elevated concentrations of Leucine, Isoleucine, and Valine.",
      question: "Which of the following multienzyme complexes is deficient in this infant?",
      options: [
        "Branched-Chain alpha-Ketoacid Dehydrogenase (Maple Syrup Urine Disease)",
        "Phenylalanine Hydroxylase (Phenylketonuria)",
        "Ornithine Transcarbamylase (OTC Deficiency)",
        "Homogentisate 1,2-Dioxygenase (Alkaptonuria)"
      ],
      correctAnswerIndex: 0,
      explanation: "Maple Syrup Urine Disease (MSUD) is an autosomal recessive inborn error caused by deficiency of the Branched-Chain alpha-Ketoacid Dehydrogenase (BCKDH) complex. Inability to decarboxylate the branched-chain amino acids (Leucine, Isoleucine, Valine) leads to acute neurotoxicity, seizures, and the pathognomonic burnt sugar/maple syrup odor in urine and cerumen."
    }
  ]
};
