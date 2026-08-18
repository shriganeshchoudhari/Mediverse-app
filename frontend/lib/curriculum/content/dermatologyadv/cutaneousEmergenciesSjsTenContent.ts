/**
 * Clinical Dermatology Advanced: Cutaneous Emergencies & Severe Drug Reactions
 * Authoritative dermatology content derived from Bolognia (4th ed.), Fitzpatrick's (9th ed.).
 * Mapped to NMC CBME Competencies: DR1.1, DR1.2, MD49.1, SU47.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CUTANEOUS_EMERGENCIES_SJS_TEN_MODULE: PhysiologyLessonModule = {
  id: "dermatology-adv-emergencies-sjs-ten",
  unitCode: "DR1.1",
  title: "Cutaneous Emergencies: SJS/TEN (SCORTEN / Nikolsky), SSSS (Desmoglein-1 Split) & DRESS Syndrome",
  competencies: ["DR1.1", "DR1.2", "MD49.1", "SU47.1"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Cutaneous Emergencies: SJS/TEN, SSSS & DRESS Syndrome

Severe cutaneous adverse reactions (SCARs) and toxin-mediated dermatoses are life-threatening medical emergencies that require rapid differentiation of cleavage planes, mucosal involvement, and visceral toxicity.

---

## 1. Life-Threatening Cutaneous Reactions Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Disorder} & \\textbf{Primary Pathophysiology} & \\textbf{Mucosal Involvement} & \\textbf{Histopathology \u0026 Cleavage} & \\textbf{Gold Standard Management} \\\\
\\hline
\\textbf{Stevens-Johnson} & \\mathbf{\\text{Cytotoxic T-cell / Granulysin}} & \\mathbf{\\text{Severe in } \\ge 2\\text{ sites}} & \\mathbf{\\text{Full-thickness epidermal necrosis}} & \\mathbf{\\text{Immediate drug cessation,}} \\\\
\\textbf{Syndrome (SJS)} & \\text{mediated keratinocyte apoptosis} & (\\text{oral, ocular, urogenital}) & (\\text{subepidermal split at BMZ}) & \\mathbf{\\text{Burn ICU, supportive care } \\pm \\text{ IVIG}} \\\\
& (\\mathbf{\\text{BSA } \u003c 10\\%}) & & & (\\text{SCORTEN prognostic scoring}) \\\\
\\textbf{Toxic Epidermal} & \\mathbf{\\text{Widespread Fas-FasL / Granulysin}} & \\mathbf{\\text{Severe extensive sloughing;}} & \\mathbf{\\text{Full-thickness confluent epidermal}} & \\mathbf{\\text{Burn ICU / BICU admission,}} \\\\
\\textbf{Necrolysis (TEN)} & \\mathbf{\\text{necrosis (BSA } \u003e 30\\%)} & \\text{cicatricial ocular synechiae} & \\mathbf{\\text{detachment; positive Nikolsky sign}} & \\mathbf{\\text{barrier wound care } + \\text{ Cyclosporine / IVIG}} \\\\
\\textbf{Staphylococcal Scalded} & \\mathbf{\\text{Exfoliative Toxins A/B (ETA/ETB)}} & \\mathbf{\\text{STRICTLY SPARED}} & \\mathbf{\\text{Superficial subcorneal cleavage}} & \\mathbf{\\text{IV Antistaphylococcal antibiotics}} \\\\
\\textbf{Skin Syndrome (SSSS)} & \\mathbf{\\text{cleaving Desmoglein-1}} & (\\text{normal mucous membranes}) & (\\text{stratum granulosum split}) & (\\text{Nafcillin / Oxacillin / Vancomycin}) \\\\
\\textbf{DRESS Syndrome} & \\mathbf{\\text{Delayed Type IVb hypersensitivity}} & \\text{Mild erythema / cheilitis;} & \\text{Spongiotic dermatitis with eosinophils;} & \\mathbf{\\text{Systemic Corticosteroids (Prednisone}} \\\\
(\\text{DIHS}) & \\mathbf{+ \\text{ HHV-6 viral reactivation}} & \\mathbf{\\text{severe FACIAL EDEMA}} & \\mathbf{\\text{Absolute eosinophilia } \u003e 700/\\mu\\text{L}} & \\mathbf{1\\text{ mg/kg/day}}\\text{ with slow 8-12w taper)} \\\\
\\hline
\\end{array}$$

---

## 2. SCORTEN Prognostic Score in SJS/TEN & Nikolsky Sign

- **The SCORTEN Score** (1 point for each parameter present within first $24\\text{ hours}$ of admission):
  1. **Age $\\ge 40\\text{ years}$**.
  2. **Heart rate $\\ge 120\\text{ bpm}$**.
  3. **Underlying malignancy / hematologic neoplasm**.
  4. **Body Surface Area (BSA) detached $\\ge 10\\%$ at Day 1**.
  5. **Serum Urea / BUN $>28\\text{ mg/dL}$ ($>10\\text{ mmol/L}$)**.
  6. **Serum Glucose $>252\\text{ mg/dL}$ ($>14\\text{ mmol/L}$)**.
  7. **Serum Bicarbonate $<20\\text{ mEq/L}$ ($<20\\text{ mmol/L}$)**.
- **Mortality Prediction by SCORTEN**:
  - Score $0 - 1$: $3.2\\%\\text{ mortality}$.
  - Score $2$: $12.1\\%\\text{ mortality}$.
  - Score $3$: $35.3\\%\\text{ mortality}$.
  - Score $4$: $58.3\\%\\text{ mortality}$.
  - Score $\\ge 5$: $90.0\\%\\text{ mortality}$.
- **Nikolsky Sign vs SSSS Subcorneal Split**:
  - **Positive Nikolsky Sign**: Lateral mechanical tangential pressure on normal-appearing perilesional skin causes dislodgement and epidermal sheet shearing (positive in SJS/TEN, SSSS, and Pemphigus vulgaris).
  - In **SSSS**, cleavage occurs high in the **stratum granulosum (Desmoglein-1)**; heals rapidly without scarring because the basal germative layer is completely intact.
  - In **TEN**, cleavage occurs at the **dermal-epidermal junction (full-thickness epidermal death)**; high risk of fluid loss, sepsis, and cicatricial blindness.
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old male with chronic gout was started on Allopurinol 300 mg daily 3 weeks ago. He presents to the emergency department with high fever, sore throat, painful burning eyes, and a widespread painful skin rash. On physical examination, temperature is 39.4°C, HR is 126 bpm, and BP is 102/64 mmHg. There are extensive dusky purpuric macules and flaccid confluent bullae covering his face, trunk, and extremities, with spontaneous epidermal sloughing involving 38% of total body surface area (BSA). Lateral shearing friction on normal-appearing skin causes the epidermis to slide off in sheets (positive Nikolsky sign). Severe hemorrhagic crusting is present on his vermilion lips, with extensive buccal mucosal ulcerations and bilateral purulent pseudomembranous conjunctivitis. Serum chemistry reveals BUN 34 mg/dL and Glucose 264 mg/dL.",
      question: "What is the diagnosis, what is the calculated SCORTEN score / mortality risk, and what is the mandatory immediate management protocol?",
      options: [
        "Toxic Epidermal Necrolysis (TEN) with SCORTEN score of 5 (>90% predicted mortality); immediately discontinue Allopurinol, admit directly to a dedicated Burn Intensive Care Unit (BICU), initiate aggressive fluid resuscitation, ophthalmologic amniotic membrane / lubrication care, and supportive barrier wound management",
        "Staphylococcal Scalded Skin Syndrome (SSSS); administer IV Nafcillin alone",
        "DRESS Syndrome; initiate high-dose oral Prednisone and discharge home",
        "Erythema Multiforme Minor; prescribe oral Acyclovir outpatient"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits Toxic Epidermal Necrolysis (TEN) triggered by Allopurinol: (1) Diagnosis: Epidermal detachment involving >30% BSA (here 38%) with severe multi-mucosal involvement (oral and ocular) and a positive Nikolsky sign defines TEN (versus SJS which is <10% BSA); (2) SCORTEN Calculation: The patient scores 5 points: (a) Age ≥40 [52 yo], (b) HR ≥120 [126 bpm], (c) BSA detached ≥10% [38%], (d) BUN >28 mg/dL [34 mg/dL], and (e) Glucose >252 mg/dL [264 mg/dL], corresponding to a predicted mortality rate of 90%; (3) Management Mandates: Immediate cessation of the offending drug (Allopurinol), urgent transfer to a Burn ICU (BICU) or specialized skin failure center, aggressive fluid and electrolyte replacement, warm environmental temperature control, strict sterile barrier wound dressing, and urgent ophthalmology consultation to prevent symblepharon and cicatricial blindness."
    }
  ]
};
