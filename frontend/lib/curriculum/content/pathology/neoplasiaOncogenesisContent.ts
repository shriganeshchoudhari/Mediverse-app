/**
 * Neoplasia, Oncogenes & Tumor Suppressors Learning Content
 * Authoritative medical content derived from Robbins & Cotran, Rubin's, Pathoma, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PA8.1, PA8.2, PA8.3, PA9.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEOPLASIA_ONCOGENESIS_MODULE: PhysiologyLessonModule = {
  id: "path-neoplasia",
  unitCode: "PA8.1",
  title: "Neoplasia, Hallmarks of Cancer, Oncogenes & Tumor Suppressors",
  competencies: ["PA8.1", "PA8.2", "PA8.3", "PA9.1"],
  estimatedMinutes: 125,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Neoplasia, Hallmarks of Cancer, Oncogenes & Tumor Suppressors

Neoplasia is autonomous, clonal, and uncoordinated cellular proliferation driven by sequential genetic mutations in **proto-oncogenes** (gain of function) and **tumor suppressor genes** (loss of function).

---

## 1. Hallmarks of Cancer (Hanahan & Weinberg)

1. **Self-Sufficiency in Growth Signals**: Gain-of-function mutations in receptor tyrosine kinases (e.g., *EGFR, HER2/neu*) or downstream intracellular transducers (e.g., *KRAS, BRAF*).
2. **Insensitivity to Anti-Growth Signals**: Inactivation of cell cycle checkpoint gatekeepers (*RB1, TP53, CDKN2A/p16*).
3. **Evasion of Apoptosis**: Overexpression of *BCL2* (e.g., $t(14;18)$ in Follicular Lymphoma) or loss of *TP53*.
4. **Limitless Replicative Potential**: Upregulation of **Telomerase** prevents telomere shortening and replicative senescence.
5. **Sustained Angiogenesis**: Secretion of **VEGF** and **bFGF** stimulated by hypoxia-inducible factor 1-alpha ($HIF\\text{-}1\\alpha$).
6. **Tissue Invasion and Metastasis**:
   - Downregulation of **E-cadherin** (loosens intercellular epithelial adhesion).
   - Attachment to laminin/fibronectin in basement membrane.
   - Degradation of extracellular matrix via **Matrix Metalloproteinases (MMP-2, MMP-9 / Type IV Collagenase)**.
   - Intravasation, survival in circulation, and extravasation to distant organ beds.

---

## 2. Classic Proto-Oncogenes & Associated Neoplasms

| Gene & Category | Molecular Mechanism & Mutation | Associated Malignancies & High-Yield Pearls |
| :--- | :--- | :--- |
| ***KRAS***<br>(GTPase signal transducer) | Point mutation impairs GTP hydrolysis $\\implies$ constitutive downstream MAPK/ERK activation | **Colorectal Cancer, Pancreatic Adenocarcinoma, Lung Adenocarcinoma**. Cetuximab ineffective in mutant KRAS. |
| ***c-MYC***<br>(Transcription Factor) | Translocation **$t(8;14)$** juxtaposes *MYC* with Ig heavy chain gene promoter | **Burkitt Lymphoma** (Starry-sky macrophage appearance, jaw lesion in endemic African, abdominal mass in sporadic). |
| ***HER2/neu (ERBB2)***<br>(Receptor Tyrosine Kinase) | Gene amplification leading to receptor overexpression on cell surface | **Invasive Ductal Breast Carcinoma, Gastric Adenocarcinoma**. Targeted by **Trastuzumab (Herceptin)**. |
| ***BCR-ABL***<br>(Non-Receptor Tyrosine Kinase) | Translocation **$t(9;22)$ (Philadelphia Chromosome)** creating fusion kinase | **Chronic Myelogenous Leukemia (CML)**. Targeted by **Imatinib (Gleevec)**. |
| ***BCL-2***<br>(Anti-Apoptotic Protein) | Translocation **$t(14;18)$** placing *BCL2* under Ig heavy chain enhancer | **Follicular Lymphoma** (painless waxing/waning lymphadenopathy; non-responsive to physiological germinal center apoptosis). |

---

## 3. Tumor Suppressor Genes & Knudson Two-Hit Hypothesis

Tumor suppressor genes require loss or inactivation of **BOTH alleles** (two hits: germline mutation $+$ acquired somatic mutation / LOH):

| Gene & Chromosome | Normal Physiological Function | Associated Familial Syndrome & Tumors |
| :--- | :--- | :--- |
| ***TP53*** ($17p13$)<br>*(Guardian of Genome)* | Transcription factor that arrests cell cycle at $G_1/S$ checkpoint via $p21$ in response to DNA damage; induces apoptosis via *Bax* if repair fails | **Li-Fraumeni Syndrome** (Autosomal Dominant; multiple sarcomas, breast carcinomas, brain tumors, adrenocortical carcinomas before age 45). |
| ***RB1*** ($13q14$) | Binds and sequesters **E2F** transcription factor when hypophosphorylated; prevents $G_1 \\rightarrow S$ phase transition | **Familial Retinoblastoma** (bilateral leukocoria / white pupillary reflex) and subsequent high risk of **Osteosarcoma**. |
| ***APC*** ($5q21$) | Degrades $\\beta$-catenin; prevents nuclear activation of cyclin D1 and c-MYC | **Familial Adenomatous Polyposis (FAP)**: 1000s of colonic adenomas; $100\\%$ risk of colorectal cancer without prophylactic colectomy. |
| ***BRCA1 / BRCA2*** ($17q / 13q$) | Homologous recombination DNA double-strand break repair | **Hereditary Breast and Ovarian Cancer Syndrome** (also pancreatic and male breast cancer). |
| ***VHL*** ($3p25$) | Forms ubiquitin ligase that degrades $HIF\\text{-}1\\alpha$ in normoxic conditions | **von Hippel-Lindau Disease**: Clear cell Renal Cell Carcinoma, Cerebellar/Retinal Hemangioblastomas, Pheochromocytoma. |

---

## 4. Tumor Staging vs Histological Grading

- **Grading (Histological differentiation)**:
  - Assesses how closely tumor cells resemble parent tissue (Well differentiated = Grade I, Poorly differentiated / Anaplastic = Grade III/IV). Based on pleomorphism, nuclear atypia, and mitotic index.
- **Staging (Anatomical extent of tumor)**:
  - **TNM System**: **T**umor size/depth ($T_0-T_4$), Regional Lymph **N**ode metastasis ($N_0-N_3$), Distant **M**etastasis ($M_0-M_1$).
  - **Clinical Rule**: **Staging is consistently the most important prognostic predictor for patient survival across virtually all solid organ malignancies.**
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female presents with a painless mass in her upper outer right breast. Family history is remarkable for her mother who died of ovarian cancer at age 42 and a maternal aunt who was diagnosed with bilateral breast cancer at age 36. Core needle biopsy demonstrates high-grade invasive ductal carcinoma. Genetic testing reveals a germline mutation on chromosome 17q resulting in impaired DNA repair.",
      question: "Which of the following cellular mechanisms is primarily defective in this patient?",
      options: [
        "Homologous Recombination Double-Strand Break Repair (BRCA1 Mutation)",
        "Nucleotide Excision Repair (Xeroderma Pigmentosum)",
        "Mismatch Repair (Lynch Syndrome / HNPCC)",
        "Translesion DNA Polymerase Synthesis"
      ],
      correctAnswerIndex: 0,
      explanation: "BRCA1 (located on chromosome 17q) and BRCA2 (chromosome 13q) encode proteins essential for error-free homologous recombination repair of DNA double-strand breaks. Germline mutations in BRCA1 confer a lifetime risk of breast cancer up to 70-80% and ovarian cancer up to 40-50%."
    }
  ]
};
