/**
 * Clinical Otolaryngology Advanced: Head & Neck Squamous Cell Carcinoma & Neck Dissections
 * Authoritative head and neck oncology content derived from Cummings (7th ed.), NCCN Guidelines.
 * Mapped to NMC CBME Competencies: EN7.1, EN7.2, MD47.4, SU45.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEAD_NECK_ONCOLOGY_NECK_DISSECTIONS_MODULE: PhysiologyLessonModule = {
  id: "ent-adv-head-neck-oncology",
  unitCode: "EN7.1",
  title: "Head & Neck Surgical Oncology: HPV-16 Oropharyngeal Cancer, Laryngeal Staging & Neck Dissections (I-VI)",
  competencies: ["EN7.1", "EN7.2", "MD47.4", "SU45.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Head & Neck Surgical Oncology: HPV Oropharyngeal, Larynx & Neck Dissections

Head and neck malignancies require tumor site-specific biological staging, functional organ preservation protocols, and systematic cervical lymph node compartment dissection.

---

## 1. Head & Neck Malignancies Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Tumor Entity} & \\textbf{Etiologic Driver \u0026 Genetics} & \\textbf{Anatomical Subsites \u0026 Signs} & \\textbf{Biomarkers \u0026 Diagnostics} & \\textbf{Primary Treatment Paradigm} \\\\
\\hline
\\textbf{HPV-Positive} & \\mathbf{\\text{High-Risk HPV-16}} & \\mathbf{\\text{Palatine tonsil, base of tongue;}} & \\mathbf{\\text{Strong p16 overexpression (IHC);}} & \\mathbf{\\text{Definitive Chemoradiation}} \\\\
\\textbf{OPSCC} & (\\text{E6 oncoprotein degrades p53}) & \\text{cystic neck mass in non-smokers} & \\text{HPV-DNA in situ hybridization (ISH)} & (\\text{Cisplatin } + \\text{ IMRT}) \\pm \\text{ TORS} \\\\
\\textbf{HPV-Negative} & \\mathbf{\\text{Tobacco \u0026 Heavy Alcohol Abuse}} & \\text{Ulcerated oral cavity / larynx lesion;} & \\mathbf{\\text{p53 mutation, loss of p16;}} & \\text{Surgical resection } + \\text{ neck} \\\\
\\textbf{HNSCC} & (\\text{synergistic field cancerization}) & \\text{painful non-healing ulcer, otalgia} & \\text{aggressive biology, poorer cure rate} & \\text{dissection } + \\text{ adjuvant chemorad} \\\\
\\textbf{Glottic} & \\text{Tobacco smoking} & \\mathbf{\\text{EARLY persistent hoarseness;}} & \\text{Flexible laryngoscopy; CT larynx;} & \\mathbf{\\text{Early (T1-T2): Transoral Laser}} \\\\
\\textbf{Laryngeal Ca} & & \\text{true vocal cords (anterior 2/3)} & \\text{minimal lymphatics (low metastasis)} & \\text{Microsurgery (TLM) or Radiation} \\\\
\\textbf{Supraglottic} & \\text{Tobacco \u0026 alcohol} & \\text{Late muffled voice, foreign body sensation,} & \\text{Rich bilateral lymphatic drainage;} & \\text{Total laryngectomy / Chemorad} \\\\
\\textbf{Laryngeal Ca} & & \\text{dysphagia, referred ear pain (CN IX/X)} & \\text{high incidence of occult neck nodes} & + \\text{ Bilateral neck dissections} \\\\
\\hline
\\end{array}$$

---

## 2. Cervical Lymph Node Levels (I–VI) & Neck Dissection Classifications

- **Cervical Lymph Node Anatomical Levels**:
  - **Level I**: Submental (Ia) and Submandibular (Ib - submandibular gland).
  - **Level II**: Upper Jugular (skull base to hyoid bone; IIa anterior, IIb posterior to CN XI).
  - **Level III**: Mid-Jugular (hyoid bone to cricoid cartilage/omohyoid).
  - **Level IV**: Lower Jugular (cricoid cartilage to clavicle).
  - **Level V**: Posterior Triangle (spinal accessory nerve, transverse cervical artery).
  - **Level VI**: Central Compartment (pretracheal, paratracheal, Delphian lymph nodes around thyroid).
- **Neck Dissection Paradigms**:
  1. **Comprehensive Radical Neck Dissection (RND)**:
     - Removes Levels I–V PLUS sacrifices **3 non-lymphatic structures**:
       1. **Spinal Accessory Nerve (CN XI)** (causes trapezius paralysis / shoulder drop).
       2. **Internal Jugular Vein (IJV)**.
       3. **Sternocleidomastoid Muscle (SCM)**.
  2. **Modified Radical Neck Dissection (MRND)**:
     - Removes Levels I–V while **preserving 1, 2, or all 3 non-lymphatic structures**:
       - **Type I MRND**: Preserves **Spinal Accessory Nerve (CN XI)**.
       - **Type II MRND**: Preserves **CN XI and IJV**.
       - **Type III MRND (Functional Neck Dissection)**: Preserves **CN XI, IJV, and SCM**.
  3. **Selective Neck Dissection (SND)**:
     - Preserves one or more lymph node groups based on primary tumor drainage (e.g., Supraomohyoid SND Levels I-III for oral cavity cancer).
`,
  clinicalVignettes: [
    {
      scenario: "A 46-year-old male non-smoker presents with a 2-month history of a painless, progressively enlarging mass in the upper left neck. He denies weight loss, fever, or night sweats. Flexible fiberoptic laryngoscopy reveals asymmetry of the left palatine tonsil with a subtle submucosal fullness at the tonsillar base. Fine needle aspiration (FNA) biopsy of the neck mass demonstrates metastatic non-keratinizing squamous cell carcinoma with strong, diffuse cytoplasmic and nuclear p16 immunohistochemical positivity. High-risk HPV in situ hybridization is positive for HPV-16.",
      question: "What is the primary diagnosis, what is the anatomical neck level of the metastatic lymph node, and what is the expected clinical prognosis compared to HPV-negative head and neck cancer?",
      options: [
        "HPV-16-Positive Oropharyngeal Squamous Cell Carcinoma (OPSCC) presenting as a cystic Level II (Upper Jugular) metastatic lymph node; carries a significantly superior treatment response to definitive Chemoradiation and favorable overall survival",
        "HPV-Negative Oral Cavity Carcinoma; carries a dismal prognosis requiring radical neck dissection with sacrifice of the spinal accessory nerve",
        "Branchial Cleft Cyst; perform simple outpatient surgical excision without oncologic staging",
        "Hodgkin Lymphoma; initiate ABVD systemic chemotherapy without radiotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical presentation of HPV-Associated Oropharyngeal Squamous Cell Carcinoma (OPSCC): (1) Demographics & Clinical Clues: Classically affects younger, non-smoking, non-drinking individuals presenting with a painless, often cystic Level II (upper jugular) metastatic neck mass originating from the palatine or lingual tonsillar crypt epithelium; (2) Biomarker: Strong, diffuse p16 positivity on immunohistochemistry serves as a reliable surrogate marker for high-risk HPV (HPV-16 is responsible for >85% of cases); (3) Prognosis & Treatment: HPV-positive OPSCC is exquisitely radiosensitive and chemosensitive, resulting in dramatically improved progression-free and overall survival rates compared to traditional tobacco/alcohol-induced (HPV-negative) squamous cell carcinomas. Standard treatment is definitive organ-preserving concurrent chemoradiation (Cisplatin + IMRT) or transoral robotic surgery (TORS)."
    }
  ]
};
