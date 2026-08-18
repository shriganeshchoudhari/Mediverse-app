/**
 * Bullous Dermatoses, Pemphigus Vulgaris, Bullous Pemphigoid & Nikolsky Sign Learning Content
 * Authoritative medical content derived from Fitzpatrick, Bolognia, Rook, and USMLE Step 2 CK Dermatology.
 * Mapped to NMC CBME Competencies: DR3.1, DR3.2, DR3.3, DR4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BULLOUS_DERMATOSES_NIKOLSKY_MODULE: PhysiologyLessonModule = {
  id: "derm-bullous-nikolsky",
  unitCode: "DR3.1",
  title: "Dermatology: Bullous Dermatoses (Pemphigus Vulgaris vs Bullous Pemphigoid) & Nikolsky Sign",
  competencies: ["DR3.1", "DR3.2", "DR3.3", "DR4.1"],
  estimatedMinutes: 145,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Dermatology: Bullous Dermatoses (Pemphigus Vulgaris vs Bullous Pemphigoid) & Nikolsky Sign

Autoimmune blistering diseases are categorized by the anatomical plane of cleavage, autoantibody target, and physical signs such as Nikolsky\'s sign.

---

## 1. Diagnostic Matrix: Pemphigus Vulgaris vs Bullous Pemphigoid

| Feature / Metric | Pemphigus Vulgaris (PV) | Bullous Pemphigoid (BP) |
| :--- | :--- | :--- |
| **Primary Autoantigen** | IgG autoantibodies directed against **Desmoglein-3** (and **Desmoglein-1**), transmembrane desmosomal cadherins maintaining cell-to-cell adhesion. | IgG autoantibodies directed against **Hemidesmosomal Antigens**: **BP180 / BPAG2** (collagen XVII) and **BP230 / BPAG1** in the basement membrane zone. |
| **Level of Blister Cleavage** | **Intraepidermal (Suprabasal Acantholysis)** with loss of intercellular bridges between spinous keratinocytes. | **Subepidermal Cleavage** at the dermo-epidermal junction (lamina lucida). |
| **Blister Morphology** | **Flaccid, thin-walled, fragile bullae** that rupture readily, leaving painful, non-healing, weeping erosions and crusts. | **Tense, firm, thick-walled bullae** arising on normal or urticarial skin that remain intact for days without bursting. |
| **Oral Mucosal Involvement** | **Involved in $> 90\\%$ of patients**; oral painful erosions/stomatitis typically precede cutaneous blisters by months. | **Rare ($< 15\\%$)**; mild and self-limiting if present. |
| **Nikolsky\'s Sign** | **POSITIVE**: Gentle tangential lateral shearing pressure on normal-appearing perilesional skin causes **Epidermal Sloughing / Detachment**. | **NEGATIVE**: Lateral shearing friction does not dislodge the epidermis. |
| **Asboe-Hansen Sign** | **POSITIVE**: Direct vertical pressure on an intact blister pushes blister fluid laterally under adjacent normal skin. | **Negative**. |
| **Direct Immunofluorescence (DIF)** | **"Fishnet" / "Chicken-Wire" Pattern**: Reticular intercellular IgG and C3 deposition throughout the entire epidermis. | **Linear Band Pattern**: Continuous linear ribbon of IgG and C3 deposition along the **Basement Membrane Zone (BMZ)**. |
| **Histopathology & Smear** | **Suprabasal split** with **"Tombstoning"** (intact monolayer of basal keratinocytes anchored to basement membrane); **Acantholytic Tzanck Cells** on Tzanck smear. | **Subepidermal split** with intact full-thickness epidermal roof; dense **Eosinophil-rich** dermal inflammatory infiltrate. |
| **Typical Patient Demographics** | Adults aged **$30-60\\text{ years}$**; potentially fatal if untreated due to fluid loss and sepsis. | Elderly patients aged **$> 70\\text{ years}$**; chronic waxing-waning benign course. |
| **Guideline Management** | High-dose **Systemic Corticosteroids** (Prednisone $1-1.5\\text{ mg/kg/day}$) $+$ **Rituximab (Anti-CD20 monoclonal antibody)** or Mycophenolate Mofetil / Azathioprine. | **High-Potency Topical Corticosteroids** (Clobetasol propionate cream $20-30\\text{ g/day}$) or oral prednisone $\\pm$ Doxycycline / Nicotinamide. |

---

## 2. Dermatitis Herpetiformis (Duhring\'s Disease)

- **Pathophysiology**: Autoimmune blistering disorder triggered by **IgA Autoantibodies against Epidermal Transglutaminase (eTG)**.
  - Strongly associated ($> 90\\%$) with **Celiac Disease (Gluten-Sensitive Enteropathy)** and HLA-DQ2 / HLA-DQ8.
- **Clinical Presentation**:
  - Intensely **pruritic, burning, grouped (herpetiform) erythematous papulovesicles** and excoriated plaques classically distributed symmetrically on **Extensor Surfaces: Elbows, Knees, Upper Back, Buttocks, and Scalp**.
  - Intact blisters are rarely observed because intense pruritus leads to excoriation.
- **Direct Immunofluorescence (DIF)**:
  - **Granular Deposition of IgA within the Dermal Papillae (Stippled Pattern)**.
- **Definitive Clinical Treatment**:
  - **Dapsone** ($50-100\\text{ mg/day}$ PO): Provides dramatic, rapid cessation of pruritus and burning within $24-48\\text{ hours}$ *(requires baseline G6PD level check to avoid severe hemolytic anemia)*.
  - **Strict, Lifelong Gluten-Free Diet**: Clears both the underlying small bowel enteropathy and mucosal IgA antibody production, allowing eventual taper off Dapsone.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old female presents with severe, painful oral ulcerations for 3 months that have made eating difficult. Over the past 2 weeks, she has developed numerous fragile, flaccid blisters on her chest and back that rupture easily, leaving large denuded raw surfaces. On physical examination, applying gentle sliding pressure with a finger to normal-appearing skin adjacent to a lesion causes the epidermis to shear off easily. A punch biopsy is performed. Histopathology reveals suprabasal acantholysis with a single row of intact basal cells attached to the basement membrane ('tombstone appearance'). Direct immunofluorescence demonstrates intercellular IgG deposition in a net-like 'fishnet' pattern throughout the epidermis.",
      question: "Which of the following is the diagnosis, and which autoantibody is responsible for this condition?",
      options: [
        "Pemphigus Vulgaris; Anti-Desmoglein-3 IgG autoantibodies",
        "Bullous Pemphigoid; Anti-Hemidesmosome BP180 IgG autoantibodies",
        "Dermatitis Herpetiformis; Anti-Epidermal Transglutaminase IgA autoantibodies",
        "Epidermolysis Bullosa Acquisita; Anti-Type VII Collagen IgG autoantibodies"
      ],
      correctAnswerIndex: 0,
      explanation: "Painful oral mucosal erosions preceding fragile flaccid cutaneous bullae, a positive Nikolsky sign (epidermal sloughing on shearing force), suprabasal acantholysis with tombstoning of basal keratinocytes, and a 'fishnet' (chicken-wire) pattern of intercellular IgG on direct immunofluorescence are pathognomonic for Pemphigus Vulgaris. The condition is mediated by autoantibodies against Desmoglein-3 (mucosal-predominant and mucocutaneous) and Desmoglein-1 (cutaneous), which disrupt desmosomal cell-cell adhesion within the stratum spinosum."
    }
  ]
};
