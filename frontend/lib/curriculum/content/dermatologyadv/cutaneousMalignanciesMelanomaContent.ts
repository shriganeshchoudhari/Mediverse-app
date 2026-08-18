/**
 * Clinical Dermatology Advanced: Cutaneous Malignancies, Melanoma & Mohs Surgery
 * Authoritative cutaneous oncology content derived from Bolognia (4th ed.), NCCN Guidelines.
 * Mapped to NMC CBME Competencies: DR5.1, DR5.2, MD49.3, SU47.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CUTANEOUS_MALIGNANCIES_MELANOMA_MODULE: PhysiologyLessonModule = {
  id: "dermatology-adv-malignancies-melanoma",
  unitCode: "DR5.1",
  title: "Cutaneous Oncology: Malignant Melanoma (Breslow Depth / BRAF V600E), BCC (Mohs) & SCC (Marjolin)",
  competencies: ["DR5.1", "DR5.2", "MD49.3", "SU47.3"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Cutaneous Oncology: Melanoma, Basal Cell & Squamous Cell Carcinomas

Cutaneous malignancies require precise histopathological microstaging (Breslow depth), targeted molecular genotyping (BRAF V600E), and tissue-sparing microscopic surgical excision.

---

## 1. Cutaneous Malignancies Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Malignancy} & \\textbf{Etiology \u0026 Driver Mutations} & \\textbf{Clinical Morphology \u0026 Signs} & \\textbf{Histopathology Hallmarks} & \\textbf{Definitive Surgical / Medical Rx} \\\\
\\hline
\\textbf{Malignant} & \\mathbf{\\text{Intermittent UV; BRAF V600E}} & \\mathbf{\\text{ABCDE criteria: Asymmetry,}} & \\mathbf{\\text{Breslow Thickness Microstaging,}} & \\mathbf{\\text{Wide Local Excision (1-2 cm) } +} \\\\
\\textbf{Melanoma} & (50\\%), \\text{ NRAS, CDKN2A/p16} & \\text{irregular border, color variegation, } \u003e 6\\text{mm} & \\text{pagetoid intraepidermal spread} & \\mathbf{\\text{SLNB } + \\text{ Dabrafenib / Pembrolizumab}} \\\\
\\textbf{Basal Cell} & \\mathbf{\\text{Cumulative UV; PTCH1 mutation}} & \\mathbf{\\text{Pearly translucent papule with rolled}} & \\mathbf{\\text{Nests of basaloid cells with}} & \\mathbf{\\text{Mohs Micrographic Surgery (100\\%}} \\\\
\\textbf{Carcinoma (BCC)} & (\\text{Sonic Hedgehog signaling}) & \\mathbf{\\text{borders \u0026 ARBORIZING TELANGIECTASIAS}} & \\mathbf{\\text{peripheral palisading \u0026 clefts}} & \\text{margins on face); Vismodegib (Hedgehog)} \\\\
\\textbf{Squamous Cell} & \\text{Cumulative UV, immunosuppression,} & \\text{Hyperkeratotic, ulcerated indurated} & \\mathbf{\\text{Invasive atypical keratinocytes,}} & \\text{Surgical excision with 4-6mm margins /} \\\\
\\textbf{Carcinoma (SCC)} & \\text{HPV-5/8, chronic burn scar (}\\mathbf{\\text{Marjolin}}\\text{)} & \\text{plaque/nodule on sun-exposed head/neck} & \\mathbf{\\text{keratin pearls, intercellular bridges}} & \\text{Mohs; Cemiplimab (anti-PD-1 for advanced)} \\\\
\\hline
\\end{array}$$

---

## 2. Breslow Depth Surgical Margins & Targeted Immunotherapy

- **Breslow Thickness Microstaging & Surgical Margins**:
  - **Melanoma In Situ**: $0.5\\text{ cm}$ surgical margin.
  - **Breslow $\\le 1.0\\text{ mm}$ (Thin Melanoma)**: $1.0\\text{ cm}$ margin.
  - **Breslow $1.01 - 2.0\\text{ mm}$ (Intermediate)**: $1.0 - 2.0\\text{ cm}$ margin PLUS **Sentinel Lymph Node Biopsy (SLNB)**.
  - **Breslow $>2.0\\text{ mm}$ (Thick Melanoma)**: $2.0\\text{ cm}$ margin PLUS **Sentinel Lymph Node Biopsy (SLNB)**.
- **Targeted Therapy & Immune Checkpoint Blockade**:
  - **BRAF V600E Mutation**: Found in $50\\%$ of cutaneous melanomas. Dual targeted therapy with **Dabrafenib (BRAF inhibitor) $+$ Trametinib (MEK inhibitor)** produces rapid tumor shrinkage.
  - **Immune Checkpoint Blockade**: **Pembrolizumab / Nivolumab (anti-PD-1)** $\\pm$ **Ipilimumab (anti-CTLA-4)** for unresectable Stage III/IV metastatic disease.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male presents with an irregularly shaped, multi-colored mole on his upper back that has enlarged and become darker over the past 5 months. On examination, the lesion measures 9 mm x 7 mm with asymmetric borders, notched margins, and dark brown, black, and reddish-pink hues (ABCDE positive). Complete diagnostic excisional biopsy with a 2 mm margin is performed. Histopathology reveals a superficial spreading malignant melanoma with a Breslow thickness of 1.65 mm, no ulceration, and a mitotic rate of 2/mm². Molecular testing is positive for the BRAF V600E point mutation.",
      question: "What is the next mandatory surgical management, and what is the standard targeted therapy if metastatic disease is detected?",
      options: [
        "Perform Wide Local Excision with a 1 to 2 cm surgical margin down to deep fascia plus Sentinel Lymph Node Biopsy (SLNB); if metastatic disease develops, initiate combination targeted therapy with Dabrafenib (BRAF inhibitor) plus Trametinib (MEK inhibitor) or anti-PD-1 immunotherapy (Pembrolizumab)",
        "Perform simple cauterization of the biopsy site and observe",
        "Perform Radical Neck Dissection immediately",
        "Prescribe topical Imiquimod 5% cream alone"
      ],
      correctAnswerIndex: 0,
      explanation: "For an intermediate-thickness cutaneous melanoma (Breslow depth 1.01 to 2.0 mm, here 1.65 mm): (1) Surgical Standards: NCCN guidelines mandate Wide Local Excision with a 1 to 2 cm radial margin down to (but not including) deep muscle fascia, combined with Sentinel Lymph Node Biopsy (SLNB) for accurate nodal staging; (2) Molecular Therapeutics: For BRAF V600E mutated melanomas that metastasize (Stage III/IV), dual BRAF/MEK inhibition (Dabrafenib + Trametinib) or anti-PD-1 immune checkpoint blockade (Pembrolizumab or Nivolumab ± Ipilimumab) provides potent, durable survival prolongation."
    }
  ]
};
