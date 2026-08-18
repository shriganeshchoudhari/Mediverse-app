/**
 * Postgraduate Advanced Otorhinolaryngology & Head & Neck Oncology: Advanced Laryngeal Carcinoma & Flap Reconstruction
 * Authoritative surgical oncology content derived from NCCN Head & Neck Guidelines, RTOG 91-11 Trial, Cummings Otolaryngology.
 * Mapped to NMC PG CBME Competencies: PG9.1, ENT1.1, ENT1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE: PhysiologyLessonModule = {
  id: "pg9-advanced-laryngeal-carcinoma-flap-reconstruction",
  unitCode: "PG9.1",
  title: "Advanced Laryngeal & Hypopharyngeal Carcinoma: TNM Staging, Total Laryngectomy & Flap Reconstructions",
  competencies: ["PG9.1", "ENT1.1", "ENT1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Advanced Laryngeal Carcinoma, Total Laryngectomy & Microvascular Flap Reconstruction

Locally advanced squamous cell carcinoma of the larynx and hypopharynx requires multimodal decision-making between organ-preservation chemoradiation and definitive surgical resection with complex soft-tissue reconstruction.

---

## 1. Laryngeal TNM Staging & Treatment Decision Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{T Stage} & \\textbf{Anatomic Invasion / Criteria} & \\textbf{NCCN / RTOG Standard Paradigm} \\\\
\\hline
\\textbf{T1 / T2} & \\text{Limited to glottis / supraglottis; cord mobile} & \\text{Transoral laser microsurgery (TLM) or Primary RT} \\\\
\\textbf{T3} & \\mathbf{\\text{Vocal cord fixation; pre-epiglottic / paraglottic space}} & \\mathbf{\\text{Definitive Concurrent Chemoradiotherapy (Cisplatin + RT)}} \\\\
& \\text{or minor thyroid cartilage cortex erosion} & (\\mathbf{\\text{Organ Preservation Paradigm - RTOG 91-11}}) \\\\
\\textbf{T4a} & \\mathbf{\\text{Gross through-and-through thyroid cartilage invasion,}} & \\mathbf{\\text{Total Laryngectomy + Bilateral Neck Dissection}} \\\\
& \\mathbf{\\text{strap muscles, trachea, esophagus, or soft tissue of neck}} & \\mathbf{+ \\text{ Adjuvant RT / Chemoradiotherapy}} \\\\
\\textbf{T4b} & \\text{Prevertebral space invasion, carotid encasement } > 270^\\circ & \\text{Unresectable; systemic palliative therapy} \\\\
\\hline
\\end{array}$$

---

## 2. Reconstructive Flap Selection & Speech Rehabilitation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Reconstructive Modality} & \\textbf{Vascular Pedicle / Source} & \\textbf{Clinical Indication \\& Reconstructive Role} \\\\
\\hline
\\textbf{Pectoralis Major Flap (PMMC)} & \\mathbf{\\text{Thoracoacromial artery (pectoral branch)}} & \\mathbf{\\text{Workhorse pedicled flap for pharyngeal patch defects,}} \\\\
& & \\text{salvage for pharyngocutaneous fistula, carotid coverage} \\\\
\\textbf{Free Anterolateral Thigh (ALT)} & \\mathbf{\\text{Descending branch of lateral circumflex femoral (LCFA)}} & \\mathbf{\\text{Tubed free flap for circumferential pharyngolaryngectomy}} \\\\
\\textbf{Tracheoesophageal Puncture (TEP)} & \\text{Puncture created at party wall between trachea \\& neo-pharynx} & \\mathbf{\\text{Primary/secondary placement of Blom-Singer voice valve}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male smoker (45 pack-years) presents with a 4-month history of progressive hoarseness, dysphagia, and a firm, non-tender left neck mass. Flexible fiberoptic laryngoscopy reveals an exophytic, ulcerated mass involving the left false cord, true cord, and ventricle, with complete fixation of the left vocal cord. Neck CT demonstrates an aggressive tumor invading the paraglottic space with gross destruction and extralaryngeal cartilage invasion through the thyroid lamina into the strap muscles, along with a necrotic 3.2 cm level IIA lymph node. Chest CT is negative for distant metastases. Biopsy confirms invasive moderately differentiated squamous cell carcinoma.",
      question: "What is the clinical TNM stage, what is the standard oncologic management, and what is the optimal speech rehabilitation method?",
      options: [
        "Stage IVA (T4a N1 M0) Laryngeal Squamous Cell Carcinoma with through-and-through thyroid cartilage destruction; the standard of care is Total Laryngectomy with Bilateral Selective Neck Dissection (Levels II-IV) followed by postoperative adjuvant radiation/chemoradiotherapy; reconstructive options include primary pharyngeal closure with PMMC flap reinforcement if needed, and alaryngeal speech rehabilitation via Primary Tracheoesophageal Puncture (TEP) with a Blom-Singer voice prosthesis",
        "Stage I (T1 N0 M0); manage with vocal cord stripping and voice therapy only",
        "Stage II (T2 N0 M0); treat with transoral laser microsurgery monotherapy without neck dissection",
        "Stage IVB (T4b); place a permanent tracheostomy and provide palliative chemotherapy only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates locally advanced laryngeal cancer: (1) Staging: Gross destruction and erosion through the thyroid cartilage into strap muscles defines T4a disease (Stage IVA); (2) Surgical Indication: T4a disease with cartilage invasion has poor response to chemoradiation and high risk of chondroradionecrosis, making Total Laryngectomy with neck dissection the gold standard; (3) Rehabilitation: Primary TEP with a one-way voice prosthesis provides the highest quality alaryngeal voice restoration."
    }
  ]
};
