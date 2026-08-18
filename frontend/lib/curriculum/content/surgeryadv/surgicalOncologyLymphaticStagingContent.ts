/**
 * Clinical Surgery Advanced: Surgical Oncology & Lymphatic Staging Protocols
 * Authoritative surgical content derived from NCCN Guidelines, Schwartz (11th ed.), AJCC Cancer Staging.
 * Mapped to NMC CBME Competencies: SU7.1, SU7.2, MD43.4, SU41.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SURGICAL_ONCOLOGY_LYMPHATIC_STAGING_MODULE: PhysiologyLessonModule = {
  id: "surgery-adv-oncology-staging",
  unitCode: "SU7.1",
  title: "Surgical Oncology: Sentinel Lymph Node Biopsy (SLNB), Total Mesorectal Excision (TME) & Melanoma",
  competencies: ["SU7.1", "SU7.2", "MD43.4", "SU41.4"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Surgical Oncology, Lymphatic Mapping & Oncologic Margins

Surgical oncology relies on precise anatomic lymphatic staging (SLNB), embryologic mesorectal planes (TME), and depth-directed margin clearance to achieve local tumor control.

---

## 1. Sentinel Lymph Node Biopsy (SLNB) & Breast Oncology

$$\\begin{array}{lcccc}
\\hline
\\textbf{Malignancy} & \\textbf{SLNB Mapping Technique} & \\textbf{Histopathologic Assessment} & \\textbf{Surgical Margin Mandate} & \\textbf{Adjuvant Paradigm} \\\\
\\hline
\\textbf{Early Breast} & \\mathbf{\\text{Dual Mapping: Technetium-99m}} & \\text{H\u0026E + Cytokeratin IHC;} & \\mathbf{\\text{"No Ink on Tumor"}} & \\text{Whole-breast RT for BCS;} \\\\
\\textbf{Cancer (cT1-2 N0)} & \\mathbf{\\text{sulfur colloid + Isosulfan Blue dye}} & \\text{frozen section or imprint} & (\\text{invasive}) \\mid 2\\text{ mm for DCIS} & \\text{Endocrine / Chemo by subtype} \\\\
\\textbf{Cutaneous} & \\text{Radiolabeled colloid lymphoscintigraphy} & \\text{Serial sectioning + IHC} & \\mathbf{\\text{Breslow-directed margins}} & \\text{Immune checkpoint inhibitors} \\\\
\\textbf{Melanoma} & (\\ge 0.8\\text{ mm or ulcerated } <0.8\\text{ mm}) & (\\text{S100, Melan-A, HMB-45}) & (0.5\\text{ to } 2.0\\text{ cm}) & (\\text{anti-PD-1 for node-positive}) \\\\
\\hline
\\end{array}$$

---

## 2. Total Mesorectal Excision (TME) & Melanoma Margins Matrix

$$\\begin{array}{lccc}
\\hline
\\textbf{Oncologic Pathology} & \\textbf{Primary Surgical Procedure} & \\textbf{Margin / Node Harvest Rules} & \\textbf{High-Yield Oncologic Pearl} \\\\
\\hline
\\textbf{Rectal Adenocarcinoma} & \\mathbf{\\text{Total Mesorectal Excision (TME)}} & \\mathbf{\\text{Circumferential Resection Margin (CRM) } >1\\text{ mm;}} & \\text{Sharp dissection in embryologic "holy plane"} \\\\
& (\\text{Low Anterior Resection / APR}) & \\mathbf{\\text{Mandatory harvest of } \\ge 12\\text{ lymph nodes}} & \\text{reduces local recurrence from } >30\\% \\text{ to } <5\\% \\\\
\\textbf{Colon Adenocarcinoma} & \\text{Anatomic Hemicolectomy} & \\ge 5\\text{ cm proximal \u0026 distal bowel margins} & \\text{High vascular ligation at artery origin} \\\\
& & + \\mathbf{\\text{minimum } 12\\text{ mesenteric lymph nodes}} & \\text{for accurate pathological staging} \\\\
\\textbf{Melanoma in Situ} & \\text{Wide Local Excision} & \\mathbf{0.5\\text{ cm surgical margin}} & \\text{Excision down to deep subcutaneous fat} \\\\
\\textbf{Melanoma Breslow } <1\\text{ mm} & \\text{Wide Local Excision} & \\mathbf{1.0\\text{ cm surgical margin}} & \\text{SLNB indicated if } \\ge 0.8\\text{ mm or ulcerated} \\\\
\\textbf{Melanoma Breslow } 1.01-2\\text{ mm} & \\text{Wide Local Excision + SLNB} & \\mathbf{1.0 - 2.0\\text{ cm surgical margin}} & \\text{Dual tracer lymphatic mapping} \\\\
\\textbf{Melanoma Breslow } >2.0\\text{ mm} & \\text{Wide Local Excision + SLNB} & \\mathbf{2.0\\text{ cm surgical margin}} & \\text{Mandatory SLNB; systemic imaging} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old female undergoes a screening colonoscopy that reveals an ulcerated mass in the mid-rectum 7 cm from the anal verge. Biopsy confirms moderately differentiated adenocarcinoma. Pelvic MRI demonstrates tumor invading into the muscularis propria without extension into the mesorectal fascia (cT2 N0 M0; distance to mesorectal fascia is 8 mm). The multidisciplinary tumor board recommends curative-intent surgical resection.",
      question: "Which of the following describes the standard-of-care surgical oncologic technique and the minimum lymph node harvest required for accurate pathological staging?",
      options: [
        "Low Anterior Resection with Total Mesorectal Excision (TME) utilizing sharp dissection along the embryologic 'holy plane' preserving the intact mesorectal envelope, with a minimum harvest of >=12 lymph nodes",
        "Transanal local excision alone without lymph node sampling",
        "Subtotal colectomy with ileorectal anastomosis without mesorectal dissection",
        "Abdominoperineal resection with 3 lymph nodes examined"
      ],
      correctAnswerIndex: 0,
      explanation: "For mid- and low-rectal adenocarcinomas, the gold standard oncologic procedure is Low Anterior Resection (or APR if sphincter cannot be spared) with Total Mesorectal Excision (TME). TME involves meticulous sharp dissection along the avascular embryologic plane (Heald's 'holy plane') between the visceral mesorectal fascia and the parietal presacral fascia. Preserving an intact, pristine mesorectal fascial envelope with a negative circumferential resection margin (CRM >1 mm) dramatically reduces local recurrence rates from >30% to <5%. Furthermore, pathohistologic staging mandates the examination of a minimum of 12 lymph nodes to accurately exclude nodal metastasis."
    }
  ]
};
