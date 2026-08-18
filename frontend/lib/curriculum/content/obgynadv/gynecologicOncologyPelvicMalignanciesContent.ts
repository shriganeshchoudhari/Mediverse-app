/**
 * Clinical Obgyn Advanced: Gynecologic Oncology & Pelvic Malignancies
 * Authoritative gynecologic oncology content derived from Berek & Novak's Gynecology (16th ed.), NCCN Guidelines.
 * Mapped to NMC CBME Competencies: OG7.1, OG7.2, MD44.4, SU42.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GYNECOLOGIC_ONCOLOGY_PELVIC_MALIGNANCIES_MODULE: PhysiologyLessonModule = {
  id: "obgyn-adv-gynecologic-oncology",
  unitCode: "OG7.1",
  title: "Gynecologic Oncology: Cervical Cancer (HPV), Endometrial Carcinoma (Lynch) & Ovarian Cancer (BRCA)",
  competencies: ["OG7.1", "OG7.2", "MD44.4", "SU42.4"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Gynecologic Oncology: Cervical, Endometrial & Ovarian Malignancies

Female pelvic malignancies require tailored histomolecular characterization, precise FIGO surgical/radiological staging, and multimodality cytoreduction.

---

## 1. Major Gynecologic Malignancies Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Malignancy} & \\textbf{Primary Risk Factors / Genetics} & \\textbf{Classic Clinical Presentation} & \\textbf{Diagnostic Modality} & \\textbf{Primary Treatment Paradigm} \\\\
\\hline
\\textbf{Cervical} & \\mathbf{\\text{High-Risk HPV 16/18}} & \\text{Postcoital bleeding, foul discharge,} & \\mathbf{\\text{Cervical cytology (Pap) +}} & \\text{Early: Radical Hysterectomy} \\\\
\\textbf{Carcinoma} & (\\text{E6 inhibits p53, E7 inhibits Rb}) & \\text{exophytic/ulcerated cervical mass} & \\mathbf{\\text{Colposcopy-directed punch biopsy}} & \\mathbf{\\text{Locally Adv: Cisplatin Chemoradiation}} \\\\
\\textbf{Endometrial} & \\mathbf{\\text{Unopposed Estrogen, Obesity,}} & \\mathbf{\\text{Abnormal Postmenopausal Uterine}} & \\mathbf{\\text{Transvaginal US (endometrium } >4\\text{ mm)}} & \\mathbf{\\text{Total Hysterectomy + BSO}} \\\\
\\textbf{Carcinoma} & \\mathbf{\\text{Lynch Syndrome (MLH1/MSH2)}} & \\mathbf{\\text{Bleeding (PMB) in } >90\\% \\text{ of cases}} & + \\mathbf{\\text{Endometrial Pipelle Biopsy}} & + \\text{ Sentinel Lymph Node mapping} \\\\
\\textbf{Ovarian} & \\mathbf{\\text{BRCA1 / BRCA2, Lynch Syndrome,}} & \\text{Vague abdominal bloating, early satiety,} & \\text{Pelvic US (complex cystic/solid mass)} & \\mathbf{\\text{Primary Cytoreductive Surgery}} \\\\
\\textbf{Carcinoma} & \\text{nulliparity, fallopian tube origin} & \\text{pelvic mass, ascites, elevated CA-125} & + \\text{ Serum CA-125 / HE4} & + \\mathbf{\\text{Carboplatin + Paclitaxel } \\pm \\text{ Olaparib}} \\\\
\\hline
\\end{array}$$

---

## 2. Molecular Signatures & Oncologic Milestones

- **Cervical Cancer Pathogenesis**:
  - HPV E6 protein binds and degrades tumor suppressor **p53** via ubiquitin ligase.
  - HPV E7 protein binds and inactivates retinoblastoma protein (**pRb**), releasing E2F transcription factor.
  - FIGO Stage IB3 / IIA2 ($>4\\text{ cm}$) or IIB (parametrial invasion) $\\rightarrow$ **Definitive Concurrent Chemoradiation** (Weekly Cisplatin $+$ External Beam Radiotherapy $+$ Intracavitary Brachytherapy).
- **Endometrial Cancer Subtypes**:
  - **Type I (Endometrioid, 80%)**: Estrogen-dependent, low grade, background of endometrial hyperplasia, *PTEN* mutation, excellent prognosis.
  - **Type II (Serous / Clear Cell, 20%)**: Estrogen-independent, arises in atrophic endometrium, *TP53* mutation, highly aggressive.
- **Ovarian Cancer & BRCA Cytoreduction**:
  - High-Grade Serous Carcinoma (HGSC) arises from the **fimbriated end of the fallopian tube** (p53 signature $\\rightarrow$ Serous Tubal Intraepithelial Carcinoma STIC).
  - Optimal cytoreduction is defined as **no macroscopic residual disease ($R0$) or residual nodules $<1\\text{ cm}$**.
  - **PARP Inhibitors (Olaparib, Niraparib)**: Exploit homologous recombination deficiency (HRD) in *BRCA1/2*-mutated tumors (synthetic lethality).
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old postmenopausal female (BMI 36 kg/m2, history of nulliparity and hypertension) presents with 3 weeks of painless vaginal spotting. She experienced menopause 7 years ago and has had no bleeding until now. Physical and speculum examination reveals a normal-appearing cervix without visible lesions. Transvaginal ultrasound demonstrates an anteverted uterus with an irregularly thickened endometrial stripe measuring 14 mm (normal postmenopausal <=4 mm) and normal bilateral adnexa. An in-office Pipelle endometrial biopsy is performed.",
      question: "What is the most likely diagnosis, what genetic syndrome must be considered, and what is the definitive initial surgical management?",
      options: [
        "Endometrial Adenocarcinoma; screen for Lynch syndrome (HNPCC - DNA mismatch repair defects); perform Total Hysterectomy with Bilateral Salpingo-Oophorectomy (BSO) and sentinel lymph node mapping",
        "Atrophic vaginitis; administer topical vaginal estrogen cream without further workup",
        "Cervical intraepithelial neoplasia; perform loop electrosurgical excision procedure (LEEP)",
        "Granulosa cell tumor; initiate primary systemic chemotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "In any postmenopausal woman presenting with abnormal uterine bleeding (PMB), Endometrial Carcinoma is the primary concern until proven otherwise (accounts for ~10-15% of PMB). Transvaginal ultrasound demonstrating an endometrial thickness >4 mm mandates histological sampling via Pipelle endometrial biopsy. Risk factors include obesity and unopposed estrogen (peripheral aromatization of androstenedione to estrone in adipose tissue), nulliparity, and Lynch syndrome (hereditary nonpolyposis colorectal cancer due to germline mutations in MMR genes MLH1, MSH2, MSH6, PMS2). The standard primary treatment is Total Hysterectomy with Bilateral Salpingo-Oophorectomy (BSO) and surgical staging (including sentinel lymph node mapping)."
    }
  ]
};
