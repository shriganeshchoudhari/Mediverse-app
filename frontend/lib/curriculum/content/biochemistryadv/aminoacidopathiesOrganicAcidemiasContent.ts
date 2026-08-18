/**
 * Clinical Biochemistry: Aminoacidopathies & Organic Acidemias
 * Authoritative medical content derived from Harper's Illustrated Biochemistry (32nd ed.), Lehninger Principles of Biochemistry.
 * Mapped to NMC CBME Competencies: BI1.1, BI1.2, BI2.1, BI2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AMINOACIDOPATHIES_ORGANIC_ACIDEMIAS_MODULE: PhysiologyLessonModule = {
  id: "biochemistry-adv-aminoacidopathies-organic-acidemias",
  unitCode: "BI1.1",
  title: "Inborn Errors of Amino Acid Metabolism: PKU, MSUD, Alkaptonuria & Homocystinuria",
  competencies: ["BI1.1", "BI1.2", "BI2.1", "BI2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BIOCHEMISTRY",
  markdownContent: `
# Inborn Errors of Amino Acid Metabolism: PKU, MSUD, Alkaptonuria & Homocystinuria

Enzyme deficiencies in amino acid catabolic pathways lead to toxic accumulation of upstream intermediates and deficiency of essential downstream products.

---

## 1. Cardinal Inborn Errors of Amino Acid Metabolism

| Disease Entity | Defective Enzyme \u0026 Cofactor | Toxic Biochemical Substrates Accumulated | Hallmark Pathognomonic Signs \u0026 Clinical Findings | Dietary \u0026 Pharmacological Management |
| :--- | :--- | :--- | :--- | :--- |
| **Phenylketonuria (PKU)** | **Phenylalanine Hydroxylase (PAH)** or **Tetrahydrobiopterin ($\\text{BH}_4$)** cofactor defect | **Phenylalanine**, Phenylpyruvate, Phenyllactate, Phenylacetate (excreted in urine) | • **Musty / Mousy body and urine odor** (phenylacetate).<br>• Severe progressive **intellectual disability**, microcephaly, seizures.<br>• **Hypopigmentation** (fair skin, blond hair, blue eyes due to tyrosine deficiency blocking melanin synthesis).<br>• *Maternal PKU*: microcephaly, congenital heart disease in fetus if mother is non-compliant. | • **Low-phenylalanine diet** initiated in the first $2\\text{ weeks}$ of life.<br>• **Tyrosine supplementation** (becomes an essential amino acid!).<br>• Avoid **Aspartame** (contains phenylalanine).<br>• **Sapropterin ($\\text{BH}_4$)** for cofactor-responsive PAH mutations. |
| **Maple Syrup Urine Disease (MSUD)** | **Branched-Chain $\\alpha$-Ketoacid Dehydrogenase (BCKAD)** complex (requires **Thiamine $\\text{B}_1$**) | Branched-Chain Amino Acids: **Isoleucine, Leucine, Valine** ("I Love Vermont maple syrup") | • **Sweet burnt sugar / maple syrup odor of urine and cerumen** (isoleucine).<br>• Neonatal onset ($4-7\\text{ days}$): severe ketoacidosis, poor feeding, lethargy, alternating hypertonia/hypotonia, **cerebral edema**, coma. | • Restriction of branched-chain amino acids (Isoleucine, Leucine, Valine) in special formula.<br>• **High-dose Thiamine ($\\text{B}_1$)** for thiamine-responsive variants. |
| **Alkaptonuria (Ochronosis)** | **Homogentisate 1,2-Dioxygenase** (tyrosine degradation pathway) | **Homogentisic Acid (HGA)** | • **Urine turns dark / black on standing or exposure to alkaline air**.<br>• **Ochronosis**: bluish-black pigmentation in sclera, ear cartilage, and nasal bridge.<br>• **Debilitating ochronotic arthropathy** of spine and large weight-bearing joints (calcification of intervertebral discs). | • Dietary protein restriction (low phenylalanine/tyrosine).<br>• **Nitisinone** (inhibits 4-hydroxyphenylpyruvate dioxygenase, reducing homogentisic acid formation).<br>• High-dose Vitamin C (antioxidant). |
| **Homocystinuria** | **Cystathionine $\\beta$-Synthase (CBS)** (requires **Pyridoxine $\\text{B}_6$**) | **Homocysteine**, Methionine; deficiency of Cysteine | • **Downward and inward subluxation of the lens (Ectopia Lentis)** (vs upward and outward in Marfan!).<br>• **Marfanoid habitus** (tall stature, long arachnodactyly fingers, pectus excavatum).<br>• Osteoporosis, intellectual disability.<br>• **MASSIVE RISK OF THROMBOEMBOLIC STROKE, MI, AND DVT AT YOUNG AGE**. | • **High-dose Pyridoxine ($\\text{B}_6$)** for $\\text{B}_6$-responsive CBS mutations.<br>• **Cysteine supplementation** (becomes essential!).<br>• Low-methionine diet $+$ **Betaine** (enhances remethylation of homocysteine to methionine). |

---

## 2. Essential Diagnostic Comparison: Homocystinuria vs Marfan Syndrome

$$\\begin{array}{lcccc}
\\hline
\\textbf{Feature} & \\textbf{Homocystinuria} & \\textbf{Marfan Syndrome} \\\\
\\hline
\\textbf{Primary Genetic Defect} & \\text{Autosomal Recessive: Cystathionine }\\beta\\text{-Synthase (CBS)} & \\text{Autosomal Dominant: Fibrillin-1 (}\\textit{FBN1}\\text{ gene)} \\\\
\\textbf{Ectopia Lentis (Lens Dislocation)} & \\mathbf{\\text{Downward and Inward Subluxation (Inferonasal)}} & \\mathbf{\\text{Upward and Outward Subluxation (Superotemporal)}} \\\\
\\textbf{Vascular Pathology} & \\mathbf{\\text{Premature Arterial \u0026 Venous Thrombosis (Stroke / DVT)}} & \\mathbf{\\text{Aortic Root Dilation / Dissection \u0026 MVP}} \\\\
\\textbf{Intellectual Disability} & \\text{Present (moderate to severe)} & \\text{Absent (normal intelligence)} \\\\
\\textbf{Metabolic Screening} & \\text{Elevated homocysteine \u0026 methionine in urine/blood} & \\text{Normal metabolic panel} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 12-year-old boy is evaluated in the genetics clinic for severe myopia, tall slender habitus with pectus excavatum, and mild learning difficulties. Slit-lamp ophthalmologic examination reveals bilateral downward and inward subluxation of the crystalline lenses. His past medical history is notable for an unprovoked deep vein thrombosis of the left lower extremity at age 10. Laboratory investigations demonstrate an elevated plasma total homocysteine level of 145 umol/L (normal: <15 umol/L) and elevated serum methionine.",
      question: "Which of the following enzyme deficiencies and vitamin cofactor combinations is responsible for this patient's clinical presentation?",
      options: [
        "Cystathionine beta-synthase (CBS) deficiency; Pyridoxine (Vitamin B6)",
        "Phenylalanine hydroxylase deficiency; Tetrahydrobiopterin (BH4)",
        "Branched-chain alpha-ketoacid dehydrogenase deficiency; Thiamine (Vitamin B1)",
        "Homogentisate 1,2-dioxygenase deficiency; Ascorbic acid (Vitamin C)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classical Homocystinuria caused by autosomal recessive Cystathionine beta-synthase (CBS) deficiency, which requires Pyridoxine (Vitamin B6) as an essential cofactor. Key distinguishing hallmarks include a marfanoid habitus, downward and inward (inferonasal) lens dislocation (ectopia lentis, contrasting with the superotemporal dislocation of Marfan syndrome), and a marked predisposition to premature arterial and venous thromboembolism (such as DVT or stroke) due to homocysteine-induced vascular endothelial injury."
    }
  ]
};
