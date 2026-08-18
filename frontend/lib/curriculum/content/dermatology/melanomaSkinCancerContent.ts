/**
 * Malignant Melanoma, ABCDE Criteria & Non-Melanoma Skin Cancers Learning Content
 * Authoritative medical content derived from Fitzpatrick, Bolognia, Rook, and USMLE Step 2 CK Dermatology.
 * Mapped to NMC CBME Competencies: DR5.1, DR5.2, DR5.3, DR6.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MELANOMA_SKIN_CANCER_MODULE: PhysiologyLessonModule = {
  id: "derm-melanoma-skin-cancer",
  unitCode: "DR5.1",
  title: "Dermatology: Malignant Melanoma (ABCDE Criteria, Breslow Depth), BCC & SCC",
  competencies: ["DR5.1", "DR5.2", "DR5.3", "DR6.1"],
  estimatedMinutes: 140,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Dermatology: Malignant Melanoma (ABCDE Criteria, Breslow Depth), BCC & SCC

Cutaneous oncology encompasses aggressive malignant melanoma, non-melanoma skin malignancies, and key prognostic depth indicators.

---

## 1. Malignant Melanoma: The ABCDE Clinical Criteria

| ABCDE Criterion | Diagnostic Feature | High-Risk Presentation |
| :--- | :--- | :--- |
| **A: Asymmetry** | Bisecting the lesion does not yield two symmetric halves. | One half of the pigmented macule/nodule does not match the other. |
| **B: Border Irregularity** | Margins are scalloped, notched, jagged, or poorly circumscribed. | Ill-defined, hazy transition zone into adjacent normal skin. |
| **C: Color Variegation** | Non-uniform pigment distribution across the lesion. | Presence of multiple colors within a single lesion: **Brown, Black, Blue, Red, White (regression), or Pink**. |
| **D: Diameter** | Size of the pigmented lesion. | **$> 6\\text{ mm}$** (roughly the diameter of a pencil eraser); note that nodular melanoma can be smaller. |
| **E: Evolution / Evolving** | **The single most sensitive clinical sign!** | Any dynamic change in **Size, Shape, Color, Surface Elevation, Ulceration, Bleeding, or Pruritus** ("Ugly Duckling" sign). |

---

## 2. Breslow Depth & Staging of Melanoma

- **Breslow\'s Thickness / Depth of Invasion**:
  - Measured in **millimeters (mm)** with an ocular micrometer from the top of the epidermal granular cell layer (or ulcer base) to the deepest invasive melanoma cell in the dermis/subcutis.
  - **Single most important independent prognostic predictor of survival and sentinel lymph node metastasis!**

| Breslow Depth (mm) | T-Stage Classification | Recommended Surgical Excision Margins | Sentinel Lymph Node Biopsy (SLNB) |
| :--- | :--- | :--- | :--- |
| **Melanoma in situ** | Tis | **$0.5\\text{ cm}$** clear margins | Not indicated |
| **$\\le 1.0\\text{ mm}$ (Thin)** | T1 (T1a $<0.8\\text{ mm}$ without ulcer; T1b with ulcer or $0.8-1.0\\text{ mm}$) | **$1.0\\text{ cm}$** surgical margin | Discuss SLNB if T1b ($\ge 0.8\\text{ mm}$ or ulcerated) |
| **$1.01 - 2.0\\text{ mm}$ (Intermediate)** | T2 | **$1.0 - 2.0\\text{ cm}$** surgical margin | **Routinely Indicated** |
| **$2.01 - 4.0\\text{ mm}$ (Thick)** | T3 | **$2.0\\text{ cm}$** surgical margin | **Routinely Indicated** |
| **$> 4.0\\text{ mm}$ (Very Thick)** | T4 | **$2.0\\text{ cm}$** surgical margin | **Routinely Indicated** |

- **Biopsy Technique**:
  - **Excisional Biopsy with narrow $1-3\\text{ mm}$ margins** including full-thickness subcutis is the gold standard.
  - *Shave biopsies are strictly avoided for suspicious pigmented lesions because they transect the tumor base, preventing accurate Breslow depth calculation*.
- **Molecular Drivers & Targeted Therapy**:
  - **$BRAF^{V600E}$ Mutation** in $\sim 50\\%$ of cutaneous melanomas $\\implies$ Targeted Dual Kinase Inhibitors: **Dabrafenib (BRAF inhibitor) $+$ Trametinib (MEK inhibitor)**.
  - **Immune Checkpoint Inhibitors**: Anti-PD-1 (**Pembrolizumab, Nivolumab**) and Anti-CTLA-4 (**Ipilimumab**).

---

## 3. Non-Melanoma Skin Cancers: Basal Cell vs Squamous Cell Carcinoma

- **Basal Cell Carcinoma (BCC)**:
  - Most common human malignancy ($80\\%$ of all skin cancers); slow-growing, rarely metastasizes ($< 0.1\\%$), but locally destructive.
  - Clinical Features: **Pearly, translucent, flesh-colored or pink papule/nodule with raised, rolled borders and prominent arborizing Telangiectasias**; frequently develops central crusting / ulceration (**"Rodent Ulcer"**).
  - Histology: **Palisading nests of basaloid keratinocytes** with peripheral retraction artifact away from fibrous stroma.
  - Management: **Mohs Micrographic Surgery** (for high-risk facial / cosmetically sensitive areas to preserve tissue and confirm $100\\%$ peripheral/deep margin clearance).
- **Squamous Cell Carcinoma (SCC)**:
  - Second most common skin cancer; arises from precursor **Actinic Keratoses** on chronic UV sun-exposed skin (lower lip, pinna of ear, scalp).
  - Clinical Features: Firm, indurated, hyperkeratotic, scaling, erythematous plaque or nodule with central ulceration.
  - Histology: Sheets of atypical squamous epithelial cells with **Keratin Pearls** and intercellular bridges invading the dermis.
  - **Marjolin\'s Ulcer**: Highly aggressive, fast-growing SCC arising within a chronic non-healing burn scar, venous stasis ulcer, or sinus tract.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old fair-skinned male presents with a changing dark spot on his upper back. His wife noticed that over the past 6 months it has enlarged, developed irregular notched borders, and contains mixtures of dark brown, pitch black, and bluish-grey areas. The lesion measures 11 mm in diameter. An excisional biopsy with 2 mm margins is performed, which confirms a superficial spreading malignant melanoma with a measured Breslow thickness of 1.6 mm, with no evidence of ulceration or microsatellitosis. Staging CT scans show no distant metastases.",
      question: "What is the next best step in the clinical management of this patient?",
      options: [
        "Wide local re-excision with 1 to 2 cm margins + Sentinel Lymph Node Biopsy (SLNB)",
        "Shave re-excision with 0.5 cm margins + Immediate systemic high-dose chemotherapy",
        "Radiation therapy to the primary back site + Observation of lymph nodes",
        "Complete lymph node dissection of bilateral axillary and cervical basins without re-excision"
      ],
      correctAnswerIndex: 0,
      explanation: "For an intermediate-thickness primary cutaneous melanoma (Breslow depth between 1.01 mm and 2.0 mm), guidelines mandate a wide local re-excision with 1 to 2 cm margins to clear local micro-extensions, along with a Sentinel Lymph Node Biopsy (SLNB) to assess for subclinical regional nodal micrometastasis. Prophylactic complete lymph node dissection is no longer standard unless the sentinel node is pathologically positive."
    }
  ]
};
