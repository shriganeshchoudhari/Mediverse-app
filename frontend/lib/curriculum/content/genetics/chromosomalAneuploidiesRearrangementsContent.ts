/**
 * Medical Genetics & Genomics: Chromosomal Aneuploidies & Structural Rearrangements
 * Authoritative medical content derived from Thompson & Thompson Genetics in Medicine (9th ed.), Nussbaum, Emery's Elements of Medical Genetics.
 * Mapped to NMC CBME Competencies: GN1.1, GN1.2, GN2.1, GN2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHROMOSOMAL_ANEUPLOIDIES_REARRANGEMENTS_MODULE: PhysiologyLessonModule = {
  id: "genetics-chromosomal-aneuploidies-rearrangements",
  unitCode: "GN1.1",
  title: "Chromosomal Aneuploidies (Trisomies 21, 18, 13, Turner, Klinefelter) & Structural Rearrangements",
  competencies: ["GN1.1", "GN1.2", "GN2.1", "GN2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GENETICS",
  markdownContent: `
# Chromosomal Aneuploidies & Structural Rearrangements

Chromosomal abnormalities account for a major proportion of spontaneous first-trimester abortions, congenital malformations, and intellectual disability.

---

## 1. Autosomal Trisomies: Pathophysiology & Clinical Triads

| Aneuploidy Syndrome | Genetic Mechanism & Karyotype | Craniofacial & Neurological Hallmarks | Major Organ Malformations & Prognosis |
| :--- | :--- | :--- | :--- |
| **Down Syndrome<br>(Trisomy 21)** | • **Meiotic Nondisjunction ($95\\%$)**: Primarily Maternal Meiosis I; risk increases exponentially with advanced maternal age ($>35\\text{ years}$).<br>• **Robertsonian Translocation ($4\\%$)**: $rob(14;21)(q10;q10)$.<br>• **Mosaicism ($1\\%$)**: Post-zygotic mitotic error. | Flat facial profile, upslanting palpebral fissures, epicanthal folds, **Brushfield spots** on iris, single transverse palmar crease (simian crease), sandal gap between toes 1 and 2, neonatal hypotonia, intellectual disability. | • **Cardiac ($40 - 50\\%$)**: **Endocardial Cushion Defect (Complete Atrioventricular Canal Defect)**, VSD, ASD.<br>• **GI**: **Duodenal Atresia ("Double Bubble" sign)**, Hirschsprung disease.<br>• **Hematology/Neurology**: Acute Megakaryoblastic Leukemia (**AMKL / M7** in children $<5\\text{ y}$), ALL, early-onset Alzheimer disease ($APP$ gene on chromosome 21). |
| **Edwards Syndrome<br>(Trisomy 18)** | Meiotic nondisjunction of chromosome 18. Maternal age related. | Microcephaly, low-set malformed "faun-like" ears, prominent occiput, severe **micrognathia**. | • **Hands**: **Clenched fists with overlapping fingers** (2nd over 3rd, 5th over 4th).<br>• **Feet**: **Rocker-bottom feet** (prominent calcaneus, convex sole).<br>• **Cardiac**: VSD, PDA, Coarctation.<br>• **Prognosis**: $>90\\%$ die within the first year of life. |
| **Patau Syndrome<br>(Trisomy 13)** | Meiotic nondisjunction of chromosome 13. Defect in prechordal mesoderm development. | **Holoprosencephaly** (failure of forebrain to divide), **Microphthalmia / Anophthalmia**, **Cleft Lip & Palate**, **Cutis Aplasia** (punched-out scalp defect). | • **Limbs**: **Postaxial Polydactyly**, rocker-bottom feet.<br>• **Cardiac**: Congenital heart defects ($80\\%$, VSD/ASD/PDA).<br>• **Renal**: Polycystic kidneys.<br>• **Prognosis**: $>90\\%$ mortality in infancy. |

---

## 2. Sex Chromosome Aneuploidies

$$\\begin{array}{lcccc}
\\hline
\\textbf{Syndrome & Karyotype} & \\textbf{Primary Pathophysiology} & \\textbf{Clinical Phenotype & Stature} & \\textbf{Endocrine & Cardiac Features} \\\\
\\hline
\\textbf{Turner Syndrome (45,X)} & \\text{Paternal meiotic error ($70\\%$)} & \\text{Short stature (SHOX gene haploinsufficiency),} & \\mathbf{\\text{Streak Ovaries (Dysgenesis)}} \\rightarrow \\text{Primary Amenorrhea} \\\\
& \\text{Complete or mosaic ($45,X / 46,XX$)} & \\text{Webbed neck (Cystic Hygroma), Shield chest} & \\mathbf{\\text{Bicuspid Aortic Valve (30\\%) & Coarctation (10\\%)}} \\\\
\\textbf{Klinefelter Syndrome (47,XXY)} & \\text{Maternal or paternal nondisjunction} & \\text{Tall stature, long eunuchoid limbs,} & \\mathbf{\\text{Hypergonadotropic Hypogonadism (}\\uparrow\\text{FSH/LH, } \\downarrow\\text{Testo)}} \\\\
& \\text{Barr body positive (one inactive X)} & \\text{Gynecomastia, female hair distribution} & \\text{Testicular fibrosis/atrophy, azoospermia, infertility} \\\\
\\hline
\\end{array}$$

---

## 3. Structural Chromosomal Rearrangements

- **Robertsonian Translocation**:
  - Occurs between **Acrocentric Chromosomes** (Chromosomes **13, 14, 15, 21, 22**).
  - Breaks occur at the centromeres, fusing the two long arms ($q$) together with loss of the short arms ($p$) containing redundant ribosomal RNA genes.
  - A balanced carrier has **45 chromosomes** ($45,XX,rob(14;21)$) and is clinically normal, but carries a high risk of producing unbalanced gametes leading to **Translocation Down Syndrome (46,XX,+21,rob(14;21))**.
- **Microdeletion Syndromes**:
  - **Cri-du-chat Syndrome ($5p$ deletion)**: High-pitched cat-like cry, microcephaly, epicanthal folds, severe intellectual disability.
  - **DiGeorge / Velocardiofacial Syndrome ($22q11.2$ deletion)**: CATCH-22 (Cardiac defects, Abnormal facies, Thymic aplasia $\implies$ T-cell immunodeficiency, Cleft palate, Hypocalcemia secondary to parathyroid hypoplasia).
`,
  clinicalVignettes: [
    {
      scenario: "A 2-day-old female infant born to a 41-year-old mother is evaluated in the NICU for persistent bilious vomiting. Physical examination reveals generalized hypotonia, flat facial features, upslanting palpebral fissures, a single transverse palmar crease bilaterally, and an active precordial heave. An abdominal radiograph demonstrates two gas-filled structures in the upper abdomen with no distal bowel gas ('Double Bubble' sign). Echocardiography reveals a complete atrioventricular canal defect.",
      question: "Which of the following represents the most common cytogenetic mechanism responsible for this infant's condition, and what is her long-term hematologic risk?",
      options: [
        "Maternal Meiotic I Nondisjunction; Markedly elevated risk of Acute Megakaryoblastic Leukemia (AMKL) in early childhood",
        "Robertsonian Translocation rob(14;21); Risk of Chronic Myeloid Leukemia",
        "Paternal Meiotic II Nondisjunction; Risk of Polycythemia Vera",
        "Chromosomal Microdeletion 22q11.2; Risk of Burkitt Lymphoma"
      ],
      correctAnswerIndex: 0,
      explanation: "This infant presents with Down Syndrome (Trisomy 21) complicated by Duodenal Atresia ('double bubble' sign on X-ray) and Complete Atrioventricular Septal Defect (endocardial cushion defect). In >95% of cases, Trisomy 21 is caused by meiotic nondisjunction, most commonly during maternal Meiosis I, strongly correlated with advanced maternal age. Children with Down syndrome have a 500-fold increased risk of developing Acute Megakaryoblastic Leukemia (AMKL / FAB M7 AML) before age 5, as well as an increased risk of Acute Lymphoblastic Leukemia (ALL) and early-onset Alzheimer disease."
    }
  ]
};
