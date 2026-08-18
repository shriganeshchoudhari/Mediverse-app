/**
 * Clinical Oncology & Radiotherapy: Cancer Biology, Hallmarks of Cancer & AJCC TNM 8th Edition Staging
 * Authoritative medical content derived from DeVita, Hellman, and Rosenberg's Cancer: Principles & Practice of Oncology (12th ed.), AJCC 8th ed.
 * Mapped to NMC CBME Competencies: ON1.1, ON1.2, ON2.1, ON2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CANCER_BIOLOGY_TNM_STAGING_MODULE: PhysiologyLessonModule = {
  id: "oncology-cancer-biology-tnm-staging",
  unitCode: "ON1.1",
  title: "Cancer Biology, Hallmarks of Malignancy, Genomic Drivers & AJCC TNM 8th Edition Staging",
  competencies: ["ON1.1", "ON1.2", "ON2.1", "ON2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CELLULAR",
  markdownContent: `
# Cancer Biology, Hallmarks of Malignancy, Genomic Drivers & AJCC TNM 8th Edition Staging

Understanding the multistep genetic and epigenetic evolution of neoplastic transformation combined with anatomical and molecular staging is essential for personalized cancer therapy.

---

## 1. The Hallmarks of Cancer (Hanahan & Weinberg)

1. **Self-sufficiency in growth signals** (e.g. *KRAS*, *EGFR*, *HER2* amplification).
2. **Insensitivity to anti-growth signals** (e.g. loss of *RB1*, *TP53* mutations).
3. **Evading programmed cell death / apoptosis** (e.g. *BCL-2* upregulation).
4. **Limitless replicative potential** (e.g. Telomerase activation / *TERT* promoter mutations).
5. **Sustained angiogenesis** (e.g. VEGF secretion driven by HIF-1alpha in hypoxia).
6. **Tissue invasion & metastasis** (e.g. loss of E-cadherin, epithelial-mesenchymal transition EMT).
7. **Reprogramming energy metabolism** (Warburg effect: aerobic glycolysis).
8. **Evading immune destruction** (e.g. PD-L1 expression, CTLA-4 upregulation).

---

## 2. Genomic Driver Mutations & Targeted Biomarkers

| Gene & Driver Alteration | Malignancy Association | Targeted Therapeutic Inhibitor | Mechanism & Clinical Hallmark |
| :--- | :--- | :--- | :--- |
| ***EGFR* (Exon 19 del / L858R)** | Non-Small Cell Lung Cancer (NSCLC, adenocarcinoma in non-smokers). | **Osimertinib (3rd-gen TKI)**, Erlotinib, Gefitinib. | Inhibits EGFR tyrosine kinase phosphorylation; Osimertinib also overcomes the secondary **T790M resistance mutation**. |
| ***ALK* Translocation (*EML4-ALK*)** | NSCLC ($3 - 5\\%$). | **Alectinib**, Brigatinib, Crizotinib. | EML4-ALK fusion protein exhibits constitutive kinase activity driving cell proliferation. |
| ***KRAS* (p.G12C Mutation)** | Colorectal cancer ($40\\%$), NSCLC ($13\\%$), Pancreatic adenocarcinoma ($90\\%$). | **Sotorasib**, Adagrasib (KRAS G12C inhibitors). | *KRAS* mutant colorectal cancers are **intrinsically resistant to anti-EGFR antibodies (Cetuximab, Panitumumab)**! |
| ***BRAF* (V600E Mutation)** | Cutaneous Melanoma ($50\\%$), Papillary Thyroid, CRC ($10\\%$). | **Dabrafenib $+$ Trametinib** (BRAF inhibitor $+$ MEK inhibitor). | Dual inhibition prevents paradoxical MAPK pathway reactivation and prevents secondary cutaneous squamous cell carcinomas. |
| ***HER2 / neu* (*ERBB2* Amplification)** | Invasive Breast Cancer ($15 - 20\\%$), Gastric Adenocarcinoma. | **Trastuzumab $+$ Pertuzumab $+$ T-DM1 / T-DXd**. | Monoclonal antibodies blocking HER2 dimerization; Trastuzumab emtansine (T-DM1) delivers a cytotoxic DM1 payload directly into HER2+ cells. |
| ***BRCA1 / BRCA2* (Homologous Recombination Deficiency)** | Hereditary Breast & Ovarian Cancer (HBOC), Pancreatic, Prostate. | **Olaparib, Talazoparib (PARP Inhibitors)**. | **Synthetic Lethality**: Cells with defective double-strand break repair (BRCA-/-) cannot survive when PARP is blocked from single-strand repair. |

---

## 3. The AJCC / UICC TNM 8th Edition Staging System

The TNM system classifies anatomic tumor extent:
- **T (Primary Tumor)**: $TX$ (cannot be assessed), $T0$ (no evidence of primary tumor), $Tis$ (Carcinoma in situ), $T1-T4$ (increasing size, depth of invasion, or local organ involvement).
- **N (Regional Lymph Nodes)**: $NX$ (cannot be assessed), $N0$ (no regional lymph node metastasis), $N1-N3$ (increasing number, station, or size of regional nodal metastases).
- **M (Distant Metastasis)**: $M0$ (no distant metastasis), $M1$ (distant metastasis present).

### Standard Prefix Designations:
- **$cTNM$ (Clinical Staging)**: Based on physical examination, pre-treatment imaging (CT/PET-CT/MRI), and diagnostic biopsies before any therapy.
- **$pTNM$ (Pathological Staging)**: Based on gross and microscopic pathological examination of the surgically resected specimen and regional lymph nodes.
- **$yTNM$ (Post-Neoadjuvant Staging)**: Staging performed *after neoadjuvant chemotherapy or radiotherapy* (e.g. $ypT0N0M0$ signifies a complete pathological response).
- **$rTNM$ (Recurrent Staging)**: Staging at the time of disease recurrence after a disease-free interval.

$$\\begin{array}{lcccc}
\\hline
\\textbf{Overall Stage} & \\textbf{Primary Tumor (T)} & \\textbf{Regional Nodes (N)} & \\textbf{Distant Metastasis (M)} & \\textbf{Clinical Intent & 5-Year Survival Prognosis} \\\\
\\hline
\\text{Stage 0} & Tis & N0 & M0 & \\text{Curative local excision (In situ, } >98\\%) \\\\
\\text{Stage I} & T1-T2 & N0 & M0 & \\text{Curative surgical resection / RT (Early local, } 85-95\\%) \\\\
\\text{Stage II} & T2-T3 & N0-N1 & M0 & \\text{Surgery } + \\text{ Adjuvant Systemic Therapy (Locally advanced, } 60-80\\%) \\\\
\\text{Stage III} & T1-T4 & N1-N3 & M0 & \\text{Multimodality: Neoadjuvant/Surgery/RT/Chemo (Regional nodal, } 30-55\\%) \\\\
\\mathbf{\\text{Stage IV}} & \\mathbf{\\text{Any T}} & \\mathbf{\\text{Any N}} & \\mathbf{M1} & \\mathbf{\\text{Palliative Systemic Therapy / Targeted / Immunotherapy (Metastatic, } <15-25\\%)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old female non-smoker presents with a persistent dry cough and 5 kg weight loss. A contrast-enhanced chest CT demonstrates a 3.2 cm peripheral mass in the right upper lobe with enlarged right paratracheal and subcarinal mediastinal lymph nodes (station 4R and 7). PET-CT shows intense FDG avidity in the lung mass and mediastinal nodes, with no distant metastatic lesions. Core needle biopsy confirms Lung Adenocarcinoma. Molecular profiling reveals an EGFR Exon 19 in-frame deletion.",
      question: "Which of the following represents the correct clinical TNM stage group and the gold-standard first-line systemic targeted therapy?",
      options: [
        "Stage IIIA (cT2a N2 M0); First-line Osimertinib (3rd-generation oral EGFR Tyrosine Kinase Inhibitor)",
        "Stage IV (cT4 N3 M1); First-line Cisplatin + Etoposide chemotherapy",
        "Stage I (cT1 N0 M0); Immediate surgical lobectomy alone without molecular testing",
        "Stage IIB (cT3 N0 M0); First-line Sotorasib KRAS G12C inhibitor"
      ],
      correctAnswerIndex: 0,
      explanation: "The primary tumor is 3.2 cm (>3 cm but <=4 cm = T2a). Ipsilateral mediastinal and subcarinal lymph node involvement represents N2 nodal disease. Absence of distant metastases = M0. T2a N2 M0 corresponds to Stage IIIA Non-Small Cell Lung Cancer. For advanced or metastatic NSCLC harboring sensitizing EGFR mutations (such as Exon 19 deletion or L858R), the FLAURA trial established Osimertinib (a 3rd-generation CNS-penetrant EGFR TKI that spares wild-type EGFR) as the standard-of-care first-line therapy, superior to 1st-generation TKIs (Gefitinib/Erlotinib)."
    }
  ]
};
