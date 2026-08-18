/**
 * Severe Cutaneous Adverse Drug Reactions: SJS, TEN & DRESS Syndrome Learning Content
 * Authoritative medical content derived from Fitzpatrick, Bolognia, Rook, and USMLE Step 2 CK Dermatology.
 * Mapped to NMC CBME Competencies: DR7.1, DR7.2, DR8.1, DR8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DRUG_ERUPTIONS_SJS_TEN_MODULE: PhysiologyLessonModule = {
  id: "derm-drug-eruptions-sjs-ten",
  unitCode: "DR7.1",
  title: "Dermatology: Severe Cutaneous Adverse Reactions (SJS vs TEN, SCORTEN) & DRESS Syndrome",
  competencies: ["DR7.1", "DR7.2", "DR8.1", "DR8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Dermatology: Severe Cutaneous Adverse Reactions (SJS vs TEN, SCORTEN) & DRESS Syndrome

Severe Cutaneous Adverse Reactions (SCAR) are life-threatening immunologic drug reactions characterized by extensive epidermal necrosis or severe systemic organ dysfunction.

---

## 1. Spectrum of SJS vs TEN: Pathophysiology & Classification

- **Immunopathophysiology**:
  - Delayed-type cell-mediated cytotoxic reaction driven by drug-specific **CD8+ Cytotoxic T-Lymphocytes and Natural Killer (NK) Cells**.
  - Release massive amounts of **Granulysin, Perforin/Granzyme B, and Fas-Ligand (CD95L)**, which trigger widespread, catastrophic apoptosis of basal and spinous keratinocytes across the entire epidermis.
- **Common High-Risk Culprit Medications**:
  1. **Anticonvulsants**: Carbamazepine, Phenytoin, Lamotrigine, Phenobarbital.
  2. **Allopurinol** (gout therapy; high risk in renal impairment).
  3. **Sulfonamide Antibiotics**: Trimethoprim-Sulfamethoxazole (TMP-SMX), Sulfasalazine.
  4. **Oxicam NSAIDs**: Piroxicam, Meloxicam.
  5. **Nevirapine** (NNRTI antiretroviral).
  - *Strong Pharmacogenomic Associations*: **HLA-B*1502** with Carbamazepine in Han Chinese/Southeast Asians; **HLA-B*5801** with Allopurinol in Asians.

| Clinical Classification | Total Body Surface Area (TBSA) Epidermal Detachment | Mucosal Surface Involvement | Mortality Rate |
| :--- | :--- | :--- | :--- |
| **Stevens-Johnson Syndrome (SJS)** | **$< 10\\%\\text{ TBSA}$** epidermal sloughing. | **Severe erosive mucositis in $\\ge 2$ mucosal sites** (oral, ocular, urogenital). | $\sim 5\\text{–}10\\%$ |
| **SJS / TEN Overlap** | **$10\\%\\text{ to } 30\\%\\text{ TBSA}$** epidermal detachment. | Severe involvement of multiple mucosal surfaces. | $\sim 15\\text{–}25\\%$ |
| **Toxic Epidermal Necrolysis (TEN / Lyell\'s Syndrome)** | **$> 30\\%\\text{ TBSA}$** widespread full-thickness sheet-like epidermal detachment. | Massive, painful denudation of oral cavity, esophagus, trachea, conjunctiva, and genitalia. | **$> 30\\text{–}50\\%$** |

- **Physical Hallmarks**:
  - Initial prodrome ($1-3\\text{ days}$) of fever, sore throat, and stinging eyes.
  - Confluent dusky red-to-violaceous purpuric macules and atypical flaccid targetoid bullae that coalesce.
  - **Nikolsky\'s Sign Strongly POSITIVE**: Lateral shear force dislodges large sheets of necrotic epidermis like wet wallpaper.

---

## 2. SCORTEN: Severity-of-Illness Score for Toxic Epidermal Necrolysis

Calculated within the first $24\\text{ hours}$ of hospital admission to predict in-hospital mortality:

$$\\text{SCORTEN Score} = \\sum (\\text{Present Criteria, 1 point each})$$

| Prognostic Variable | Definition / Threshold Criterion | Points Assigned |
| :--- | :--- | :--- |
| **Age** | **$\\ge 40\\text{ years}$** | 1 point |
| **Malignancy** | Underlying malignancy present | 1 point |
| **TBSA Detachment** | **$> 10\\%\\text{ TBSA}$** on day 1 | 1 point |
| **Tachycardia** | **Heart Rate $\\ge 120\\text{ beats/min}$** | 1 point |
| **Serum Urea (BUN)** | **$> 10\\text{ mmol/L}$ ($> 28\\text{ mg/dL}$)** | 1 point |
| **Serum Glucose** | **$> 14\\text{ mmol/L}$ ($> 252\\text{ mg/dL}$)** | 1 point |
| **Serum Bicarbonate** | **$< 20\\text{ mEq/L}$ (Acidosis)** | 1 point |

- **Mortality Risk by SCORTEN**:
  - Score $0-1$: $\sim 3.2\\%$ mortality
  - Score $2$: $\sim 12.1\\%$ mortality
  - Score $3$: $\sim 35.3\\%$ mortality
  - Score $4$: $\sim 58.3\\%$ mortality
  - Score $\ge 5$: **$> 90\\%$ mortality**

---

## 3. Emergency Management Protocol of SJS / TEN

1. **Immediate Withdrawal of ALL Non-Essential & Suspected Offending Drugs** (most critical prognostic determinant).
2. **Immediate Transfer to a Specialized Burn Center or Intensive Care Unit (ICU)**.
3. **Aggressive Supportive Therapy**: Warm ambient room temperature ($30-32^\\circ\\text{C}$ to prevent hypothermia), sterile non-adherent silicone/petrolatum dressings, balanced crystalloid IV fluids (titrated according to Parkland/burn formulas), high-calorie enteral nutrition.
4. **Urgent Ophthalmology Consultation**: Daily saline rinses, topical antibiotic/steroid drops, and amniotic membrane transplantation to prevent cicatrizing conjunctivitis, symblepharon, and permanent blindness.
5. **Targeted Immunomodulation**: High-dose **Intravenous Immunoglobulin (IVIG)** ($2-3\\text{ g/kg}$ over $3-4\\text{ days}$ to block Fas-mediated apoptosis), **Cyclosporine** ($3-5\\text{ mg/kg/day}$), or Anti-TNF agent (**Etanercept**).

---

## 4. DRESS Syndrome (Drug Reaction with Eosinophilia and Systemic Symptoms)

- **Clinical Triad**:
  1. **Extensive Cutaneous Eruption**: Morbilliform or diffuse maculopapular rash with marked **Facial Edema (swollen face / periorbital puffiness in $> 70\\%$)**.
  2. **Hematologic Abnormalities**: **Marked Peripheral Eosinophilia ($> 1500/\\mu\\text{L}$)** and atypical reactive lymphocytosis.
  3. **Internal Organ Involvement**: **Acute Hepatitis with elevated ALT/AST ($> 80\\%$)**, interstitial nephritis (elevated creatinine), or myocarditis/pneumonitis.
- **Distinctive Timing**:
  - Characteristically **Delayed Onset: $2-8\\text{ weeks}$ after drug initiation** (unlike typical drug rashes occurring at 1-2 weeks).
  - Associated with human herpesvirus-6 (**HHV-6**) and CMV reactivation.
- **Treatment**: Discontinue drug immediately $+$ **Systemic Corticosteroids (Prednisone $1\\text{ mg/kg/day}$ with prolonged taper over $2-3\\text{ months}$)** to prevent relapses.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male was started on Allopurinol 300 mg daily for gout 3 weeks ago. He presents with a 2-day history of high fever (39.2°C), painful swallowing, and burning in his eyes. On examination, he has extensive dusky violaceous macules over his face, trunk, and extremities that have coalesced into flaccid bullae. Applying gentle tangential shearing force to normal skin causes sheet-like epidermal sloughing (Nikolsky positive). The total body surface area of detached and detachable epidermis is calculated to be 38%. He has severe hemorrhagic crusting of the lips and bilateral purulent conjunctivitis. Laboratory work shows: HR 128 bpm, Serum Urea 12.4 mmol/L, Serum Glucose 15.6 mmol/L, Serum Bicarbonate 18 mEq/L.",
      question: "What is the diagnosis, what is his SCORTEN score, and what is the immediate management priority?",
      options: [
        "Toxic Epidermal Necrolysis (TEN); SCORTEN = 6 (Predicting >90% mortality); Immediate transfer to Burn Unit + Discontinue Allopurinol + Ophthalmology consult",
        "Stevens-Johnson Syndrome (SJS); SCORTEN = 2; Outpatient oral prednisone + Continue allopurinol with dose reduction",
        "Staphylococcal Scalded Skin Syndrome (SSSS); SCORTEN = 1; Intravenous Nafcillin + Clindamycin",
        "DRESS Syndrome; SCORTEN = 4; Urgent hemodialysis + High-dose Allopurinol challenge"
      ],
      correctAnswerIndex: 0,
      explanation: "With 38% TBSA full-thickness epidermal detachment and severe multi-mucosal involvement, this patient has Toxic Epidermal Necrolysis (TEN, defined as >30% TBSA). Calculating his SCORTEN at admission: 1. Age ≥ 40 (Age 42 = 1 pt), 2. TBSA > 10% (38% = 1 pt), 3. HR ≥ 120 (128 bpm = 1 pt), 4. Urea > 10 mmol/L (12.4 = 1 pt), 5. Glucose > 14 mmol/L (15.6 = 1 pt), 6. Bicarbonate < 20 mEq/L (18 = 1 pt) -> SCORTEN = 6 points, corresponding to a predicted in-hospital mortality of >90%. Immediate management requires urgent cessation of allopurinol, immediate transfer to a specialized Burn Center/ICU, supportive fluid management, and urgent ophthalmology consultation to prevent blindness."
    }
  ]
};
