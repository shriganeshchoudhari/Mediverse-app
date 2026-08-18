/**
 * Clinical Biochemistry: Lysosomal Storage Disorders (LSDs) & Sphingolipidoses
 * Authoritative medical content derived from Harper's Illustrated Biochemistry (32nd ed.), Robbins & Cotran Pathologic Basis of Disease.
 * Mapped to NMC CBME Competencies: BI5.1, BI5.2, BI6.1, BI6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LYSOSOMAL_STORAGE_DISORDERS_SPHINGOLIPIDOSES_MODULE: PhysiologyLessonModule = {
  id: "biochemistry-adv-lysosomal-storage-disorders-sphingolipidoses",
  unitCode: "BI5.1",
  title: "Lysosomal Storage Disorders: Gaucher, Tay-Sachs, Niemann-Pick, Fabry & Mucopolysaccharidoses",
  competencies: ["BI5.1", "BI5.2", "BI6.1", "BI6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BIOCHEMISTRY",
  markdownContent: `
# Lysosomal Storage Disorders (LSDs) & Sphingolipidoses

Lysosomal storage diseases are inherited metabolic disorders characterized by deficiency of specific lysosomal acid hydrolases, leading to toxic intracellular accumulation of undigested complex substrates.

---

## 1. Cardinal Sphingolipidoses Diagnostic Matrix

| Disease Entity \u0026 Inheritance | Deficient Enzyme | Accumulated Toxic Substrate | Pathognomonic Histopathology | Hallmark Clinical Features |
| :--- | :--- | :--- | :--- | :--- |
| **Gaucher Disease (Type 1)**<br>*(Autosomal Recessive)* | **Glucocerebrosidase (Acid $\\beta$-Glucosidase)** | **Glucocerebroside (Glucosylceramide)** in reticuloendothelial macrophages | **"Crinkled tissue paper" / "crumpled silk"** lipid-laden macrophages with fibrillar cytoplasm | • **Most common lysosomal storage disorder**.<br>• **Massive Hepatosplenomegaly** (splenomegaly $>$ hepatomegaly).<br>• Pancytopenia (anemia, thrombocytopenia).<br>• **Bone crises, osteopenia, Erlenmeyer flask deformity of distal femur**, avascular necrosis of femoral head. |
| **Tay-Sachs Disease**<br>*(Autosomal Recessive)* | **Hexosaminidase A** | **$\\text{GM}_2$ Ganglioside** | **"Onion-skin" lamellar lysosomal inclusions** on electron microscopy | • **Cherry-Red Macular Spot** on fundoscopy.<br>• Progressive neurodevelopmental regression ($3-6\\text{ months}$), blindness, hyperacusis (exaggerated startle).<br>• **NO HEPATOSPLENOMEGALY (Normal spleen/liver - critical differentiator from Niemann-Pick!)**. |
| **Niemann-Pick Disease (Type A/B)**<br>*(Autosomal Recessive)* | **Acid Sphingomyelinase** | **Sphingomyelin** | **"Foamy histiocytes / macrophages"** with zebra bodies on electron microscopy | • **Cherry-Red Macular Spot**.<br>• Progressive neurodegeneration and developmental regression.<br>• **PROMINENT HEPATOSPLENOMEGALY** (distinguishes from Tay-Sachs!). |
| **Fabry Disease**<br>*(X-Linked Recessive)* | **$\\alpha$-Galactosidase A** | **Globotriaosylceramide ($\\text{Gb}_3$ / Ceramide Trihexoside)** | Concentric lamellar lipid zebra bodies in vascular endothelium | • **Acroparesthesias** (severe episodic burning neuropathic pain in hands and feet).<br>• **Angiokeratomas** (punctate dark red cutaneous macules in bathing-trunk area).<br>• **Hypohidrosis / Anhidrosis**, corneal verticillata.<br>• Progressive **renal failure and early hypertrophic cardiomyopathy / stroke**. |
| **Krabbe Disease**<br>*(Autosomal Recessive)* | **Galactocerebrosidase ($\beta$-galactosidase)** | **Galactocerebroside**, Psychosine (toxic to oligodendrocytes) | **Globoid cells** (multinucleated engorged macrophages) in white matter | • Peripheral neuropathy, rapid severe demyelination, optic atrophy, hypertonia, seizures, irritability. |

---

## 2. Mucopolysaccharidoses (MPS): Hurler vs Hunter Syndrome

$$\\begin{array}{lcccc}
\\hline
\\textbf{Feature} & \\textbf{Hurler Syndrome (MPS I)} & \\textbf{Hunter Syndrome (MPS II)} \\\\
\\hline
\\textbf{Inheritance} & \\text{Autosomal Recessive} & \\mathbf{\\text{X-Linked Recessive ("Hunter needs his target")}} \\\\
\\textbf{Deficient Enzyme} & \\mathbf{\\alpha\\text{-L-Iduronidase}} & \\mathbf{\\text{Iduronate-2-Sulfatase}} \\\\
\\textbf{Accumulated Substrate} & \\text{Heparan Sulfate \u0026 Dermatan Sulfate} & \\text{Heparan Sulfate \u0026 Dermatan Sulfate} \\\\
\\textbf{Corneal Clouding} & \\mathbf{\\text{PRESENT (Progressive blindness)}} & \\mathbf{\\text{ABSENT (Clear corneas)}} \\\\
\\textbf{Clinical Phenotype} & \\text{Coarse "gargoyle" facies, hepatosplenomegaly, dysostosis multiplex} & \\text{Coarse facies, aggressive behavior, skin papules, hearing loss} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "An 8-month-old infant is brought to the pediatric neurology clinic for progressive loss of previously acquired motor milestones. The parents note that the infant no longer sits unsupported and exhibits an exaggerated jump/startle reaction to moderate sounds. Fundoscopic examination reveals a bilateral bright cherry-red spot in the macula surrounded by a pale retinal halo. Abdominal examination demonstrates a soft, non-distended abdomen with no palpable hepatomegaly or splenomegaly.",
      question: "Which of the following enzyme deficiencies and accumulated biochemical substrates is characteristic of this infant's condition?",
      options: [
        "Hexosaminidase A deficiency; GM2 ganglioside accumulation (Tay-Sachs Disease)",
        "Acid Sphingomyelinase deficiency; Sphingomyelin accumulation (Niemann-Pick Disease)",
        "Glucocerebrosidase deficiency; Glucocerebroside accumulation (Gaucher Disease)",
        "alpha-Galactosidase A deficiency; Ceramide trihexoside accumulation (Fabry Disease)"
      ],
      correctAnswerIndex: 0,
      explanation: "This infant presents with Tay-Sachs Disease, an autosomal recessive lysosomal storage disease caused by deficiency of Hexosaminidase A, leading to toxic accumulation of GM2 ganglioside in neuronal lysosomes. The diagnostic hallmark is neurodevelopmental regression, exaggerated startle reflex (hyperacusis), and a classic 'cherry-red spot' on the macula WITHOUT hepatosplenomegaly. In contrast, Niemann-Pick disease also presents with a cherry-red macular spot but ALWAYS exhibits prominent hepatosplenomegaly and foamy histiocytes."
    }
  ]
};
