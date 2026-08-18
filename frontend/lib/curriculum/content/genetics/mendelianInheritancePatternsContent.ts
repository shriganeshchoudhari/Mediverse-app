/**
 * Medical Genetics & Genomics: Mendelian & Non-Mendelian Inheritance Patterns
 * Authoritative medical content derived from Thompson & Thompson Genetics in Medicine (9th ed.), Nussbaum, Strachan.
 * Mapped to NMC CBME Competencies: GN3.1, GN3.2, GN4.1, GN4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MENDELIAN_INHERITANCE_PATTERNS_MODULE: PhysiologyLessonModule = {
  id: "genetics-mendelian-inheritance-patterns",
  unitCode: "GN3.1",
  title: "Mendelian & Non-Mendelian Inheritance: Autosomal, X-Linked, Mitochondrial, Heteroplasmy & Penetrance",
  competencies: ["GN3.1", "GN3.2", "GN4.1", "GN4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GENETICS",
  markdownContent: `
# Mendelian & Non-Mendelian Inheritance: Autosomal, X-Linked, Mitochondrial & Non-Classic Patterns

Pedigree analysis and molecular genetics require mastering Mendelian inheritance modes alongside non-classic phenomena including anticipation, pleiotropy, and mitochondrial heteroplasmy.

---

## 1. Classical Mendelian Inheritance Patterns

| Inheritance Mode | Transmission Characteristics & Pedigree Hallmarks | Offspring Recurrence Risk | Canonical Clinical Disease Examples |
| :--- | :--- | :--- | :--- |
| **Autosomal Dominant (AD)** | • Vertical transmission (affects every generation).<br>• Males and females affected equally.<br>• Male-to-male transmission present.<br>• Structural protein mutations / Gain-of-function. | **$50\\%$ risk** for each child of an affected heterozygous parent ($Aa \\times aa$). | • **Huntington Disease** (*HTT* gene, CAG repeats).<br>• **Marfan Syndrome** (*FBN1* fibrillin-1; pleiotropy).<br>• **Achondroplasia** (*FGFR3* gain of function; $80\\%$ de novo mutations associated with advanced paternal age).<br>• **Neurofibromatosis Type 1 (NF1)** (*NF1* neurofibromin; variable expressivity).<br>• **Familial Hypercholesterolemia (FH)** (*LDLR* defect). |
| **Autosomal Recessive (AR)** | • Horizontal transmission (affects siblings in one generation).<br>• Consanguinity increases risk.<br>• Males and females affected equally.<br>• Enzymatic deficiencies / Loss-of-function. | **$25\\%$ affected ($aa$), $50\\%$ carrier ($Aa$), $25\\%$ homozygous normal ($AA$)** when both parents are carriers. | • **Cystic Fibrosis** (*CFTR* $\\Delta F508$ 3-bp deletion).<br>• **Sickle Cell Anemia** (*HBB* Glu6Val missense mutation).<br>• **Tay-Sachs Disease** (*HEXA* $\\beta\\text{-hexosaminidase A}$).<br>• **Phenylketonuria (PKU)** (*PAH* phenylalanine hydroxylase).<br>• **Hemochromatosis** (*HFE* C282Y mutation). |
| **X-Linked Recessive (XLR)** | • Skips generations via asymptomatic carrier females.<br>• **Much higher prevalence in males** ($X^a Y$).<br>• **NO male-to-male transmission** (fathers pass Y to sons).<br>• All daughters of affected fathers are obligate carriers ($X^A X^a$). | • Carrier mother ($X^A X^a$): **$50\\%$ of sons affected, $50\\%$ of daughters carriers**.<br>• Affected father ($X^a Y$): $0\\%$ sons affected, **$100\\%$ daughters carriers**. | • **Duchenne & Becker Muscular Dystrophy** (*DMD* dystrophin gene).<br>• **Hemophilia A (Factor VIII)** & **Hemophilia B (Factor IX)**.<br>• **Glucose-6-Phosphate Dehydrogenase (G6PD) Deficiency**.<br>• **Lesch-Nyhan Syndrome** (*HPRT* deficiency). |
| **X-Linked Dominant (XLD)** | • Transmitted through both males and females.<br>• Affected males pass to **$100\\%$ of daughters and $0\\%$ of sons**.<br>• Affected heterozygous females pass to $50\\%$ of sons and $50\\%$ of daughters. | • Affected mother: $50\\%$ risk to all children.<br>• Affected father: $100\\%$ daughters, $0\\%$ sons. | • **Fragile X Syndrome** (*FMR1* CGG repeat).<br>• **Rett Syndrome** (*MECP2* mutation; lethal in hemizygous males).<br>• **Hypophosphatemic Rickets** (X-linked vitamin D-resistant rickets). |

---

## 2. Mitochondrial Inheritance & Heteroplasmy

- **Maternal Transmission Only**: Mitochondria are inherited exclusively from the maternal oocyte cytoplasm (sperm mitochondria in the tail are tagged with ubiquitin and degraded upon fertilization).
- **Pedigree Rules**:
  - An affected **mother passes the disease to $100\\%$ of her children** (both sons and daughters).
  - An affected **father NEVER transmits the disease** to any offspring ($0\\%$ recurrence risk).
- **Heteroplasmy**:
  - Coexistence of mutated and wild-type mitochondrial DNA ($mtDNA$) within the same cell or tissue.
  - Severity of the clinical phenotype depends on the ratio of mutant-to-normal mtDNA exceeding a critical metabolic threshold (**Threshold Effect**; organs with high oxidative metabolic demand like brain, retina, heart, and skeletal muscle are most severely affected).
- **Canonical Diseases**:
  - **MELAS** (Mitochondrial Encephalomyopathy, Lactic Acidosis, and Stroke-like episodes).
  - **MERRF** (Myoclonic Epilepsy with Ragged Red Fibers on Gomori trichrome stain).
  - **LHON** (Leber Hereditary Optic Neuropathy; subacute bilateral painless vision loss in young adult males).

---

## 3. High-Yield Non-Mendelian Genetic Terminology

- **Variable Expressivity**: Individuals with the same disease genotype exhibit different severities or manifestations of the clinical phenotype (e.g. *NF1* patients ranging from mild café-au-lait spots to severe plexiform neurofibromas and optic gliomas).
- **Incomplete Penetrance**: Not all individuals carrying the disease-causing genotype express the clinical phenotype (e.g. *BRCA1* has $\sim 70-80\%$ lifetime penetrance for breast cancer).
- **Pleiotropy**: A single mutant gene causes multiple, seemingly unrelated phenotypic abnormalities across diverse organ systems (e.g. *FBN1* mutation in Marfan syndrome causing ectopia lentis, aortic root aneurysm, and tall arachnodactyly).
- **Locus Heterogeneity**: Mutations at **different genetic loci** cause the same clinical phenotype (e.g. Osteogenesis Imperfecta caused by mutations in either *COL1A1* on chromosome 17 or *COL1A2* on chromosome 7).
- **Allelic Heterogeneity**: **Different mutations within the same genetic locus** cause different severities or disease phenotypes (e.g. over 1500 different mutations in the *CFTR* gene).
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male presents with subacute, progressive, painless central vision loss first in his right eye, followed 6 weeks later by similar vision loss in his left eye. Funduscopic examination reveals circumpapillary telangiectatic microangiopathy and optic disc pseudoedema. Genetic testing confirms a homoplasmic m.11778G>A point mutation in the MT-ND4 mitochondrial gene, confirming Leber Hereditary Optic Neuropathy (LHON). The patient is newly married and asks about the risk of transmitting this condition to his future children.",
      question: "What is the precise recurrence risk of LHON for this patient's future offspring?",
      options: [
        "0% risk for all offspring, because mitochondrial DNA is transmitted exclusively through maternal oocyte cytoplasm",
        "50% risk for all offspring, consistent with autosomal dominant transmission",
        "100% of daughters will be affected and 0% of sons",
        "25% risk for all offspring if the spouse is a carrier"
      ],
      correctAnswerIndex: 0,
      explanation: "Leber Hereditary Optic Neuropathy (LHON) is caused by mutations in mitochondrial DNA (such as m.11778G>A in MT-ND4). Mitochondrial DNA is inherited strictly maternally via the cytoplasm of the ovum (sperm mitochondria are excluded or destroyed after fertilization). Therefore, an affected male CANNOT transmit a mitochondrial disorder to any of his biological children (0% transmission risk). In contrast, an affected female transmits the mitochondrial mutation to 100% of her offspring."
    }
  ]
};
