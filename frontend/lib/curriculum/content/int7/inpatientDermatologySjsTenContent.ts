/**
 * Internship Core Clinical Postings: Inpatient Dermatology & Dermatologic Emergencies (SJS/TEN & Erythroderma)
 * Authoritative dermatology content derived from Fitzpatrick's Dermatology, British Association of Dermatologists Guidelines.
 * Mapped to NMC CBME Competencies: IN7.1, DR3.1, DR4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INPATIENT_DERMATOLOGY_SJS_TEN_MODULE: PhysiologyLessonModule = {
  id: "int7-inpatient-dermatology-sjs-ten",
  unitCode: "IN7.1",
  title: "Inpatient Dermatology: Stevens-Johnson Syndrome (SJS), TEN, SCORTEN Prognostication & Erythroderma Protocols",
  competencies: ["IN7.1", "DR3.1", "DR4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "INTEGUMENTARY",
  markdownContent: `
# Inpatient Dermatology: SJS/TEN Spectrum, SCORTEN & Erythroderma

Severe cutaneous adverse reactions (SCARs) and widespread exfoliative erythroderma require rapid drug cessation, ICU barrier nursing, and targeted immunomodulation.

---

## 1. SJS vs SJS/TEN Overlap vs Toxic Epidermal Necrolysis (TEN)

$$\\begin{array}{lcccc}
\\hline
\\textbf{SCAR Classification} & \\textbf{\\%TBSA Epidermal Detachment} & \\textbf{Mucosal Involvement} & \\textbf{Physical Examination Signs} \\\\
\\hline
\\textbf{Stevens-Johnson (SJS)} & < 10\\% \\text{ Body Surface Area} & \\ge 2 \\text{ Mucosal Sites (oral, ocular, genital)} & \\text{Targetoid purpuric macules, bullae} \\\\
\\textbf{SJS / TEN Overlap} & \\mathbf{10-30\\% \\text{ Body Surface Area}} & \\ge 2 \\text{ Mucosal Sites} & \\text{Confluent epidermal sloughing} \\\\
\\textbf{Toxic Epidermal Necrolysis} & \\mathbf{> 30\\% \\text{ Body Surface Area}} & \\ge 2 \\text{ Mucosal Sites with severe ulceration} & \\mathbf{\\text{Positive Nikolsky sign \u0026}} \\\\
(\\textbf{TEN}) & & & \\mathbf{\\text{Positive Asboe-Hansen sign}} \\\\
\\hline
\\end{array}$$

---

## 2. SCORTEN Prognostic Scoring System for TEN

$$\\begin{array}{lcccc}
\\hline
\\textbf{Prognostic Parameter} & \\textbf{Criteria for 1 Point} & \\textbf{Calculated SCORTEN Score} & \\textbf{Predicted In-Hospital Mortality} \\\\
\\hline
\\textbf{Age} & \\ge 40\\text{ years} & 0-1 \\text{ points} & 3.2\\% \\\\
\\textbf{Malignancy} & \\text{Present (active hematologic or solid)} & 2 \\text{ points} & 12.1\\% \\\\
\\textbf{Detached TBSA} & \\ge 10\\% \\text{ on Day 1} & 3 \\text{ points} & 35.3\\% \\\\
\\textbf{Serum Urea} & > 10\\text{ mmol/L (} > 28\\text{ mg/dL)} & 4 \\text{ points} & 58.3\\% \\\\
\\textbf{Serum Glucose} & > 14\\text{ mmol/L (} > 252\\text{ mg/dL)} & \\ge 5 \\text{ points} & \\mathbf{> 90\\% \\text{ Mortality}} \\\\
\\textbf{Serum Bicarbonate} & < 20\\text{ mEq/L} & & \\\\
\\textbf{Heart Rate} & \\ge 120\\text{ beats per minute} & & \\\\
\\hline
\\end{array}$$

---

## 3. Emergency Management & Erythroderma

- **SJS/TEN Emergency Management Bundle**:
  1. **Immediate Cessation**: Discontinue all potential offending medications immediately (common culprits: Allopurinol, Carbamazepine, Lamotrigine, Sulfamethoxazole-trimethoprim, Phenytoin, NSAIDs).
  2. **Burn ICU Admission**: Isothermal barrier nursing ($30-32^{\\circ}\\text{C}$ room), non-adherent dressings, sterile handling.
  3. **Immunomodulation**: High-dose **IVIG ($1-2\\text{ g/kg}$ total over 3-4 days)** and/or **Cyclosporine ($3-5\\text{ mg/kg/day}$)**.
  4. **Ophthalmology Consultation**: Daily amniotic membrane transplantation or lubricating drops to prevent synechiae and blindness.
- **Erythroderma (Exfoliative Dermatitis)**:
  - Generalized erythema and scaling affecting **$>90\\%$ of total body surface area**.
  - Risk of high-output heart failure, hypothermia, massive trans-epidermal fluid loss, and fatal *Staphylococcus aureus* sepsis.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old female who was started on Carbamazepine 3 weeks ago for trigeminal neuralgia presents to the emergency department with a burning rash, high fever, sore throat, and severe bilateral eye pain. On examination, confluent dusky erythematous sheets with flaccid bullae and epidermal sloughing cover 38% of her total body surface area. Gentle lateral pressure on perilesional skin causes immediate dislodgement of the epidermis (positive Nikolsky sign). Severe erosions of her oral mucosa, conjunctivae, and labia minora are noted. Her heart rate is 128 bpm, blood pressure is 98/62 mmHg, and lab evaluation shows serum urea 12.4 mmol/L and blood glucose 15.2 mmol/L.",
      question: "What is the diagnosis, the calculated SCORTEN score, and the immediate multidisciplinary management?",
      options: [
        "Toxic Epidermal Necrolysis (TEN; >30% TBSA epidermal detachment with mucosal erosions and positive Nikolsky sign); SCORTEN = 5 out of 7 (Age >=40 = 1, TBSA >=10% = 1, Urea >10 = 1, Glucose >14 = 1, HR >=120 = 1; predicting >90% mortality); immediate management requires immediate withdrawal of carbamazepine, emergent admission to a specialized Burn ICU, initiation of high-dose IVIG or Cyclosporine, sterile non-adherent wound dressing without debridement, and emergent ophthalmology consultation for amniotic membrane grafting",
        "Erythema multiforme minor; prescribe oral acyclovir and discharge home",
        "Staphylococcal scalded skin syndrome; perform aggressive surgical scrub debridement",
        "Fixed drug eruption; prescribe oral hydroxyzine alone"
      ],
      correctAnswerIndex: 0,
      explanation: "This case presents severe Toxic Epidermal Necrolysis (TEN): (1) Diagnostic Criteria: Epidermal detachment >30% TBSA + extensive multi-mucosal erosions + positive Nikolsky sign confirm TEN; (2) SCORTEN Calculation: Age >=40 (1) + TBSA >=10% (1) + Urea >10 (1) + Glucose >14 (1) + HR >=120 (1) = 5 points, indicating an in-hospital mortality rate exceeding 90%; (3) Critical Management: Immediate drug withdrawal, Burn ICU supportive care, IVIG/cyclosporine, and proactive ophthalmologic care to prevent blinding symblepharon formation."
    }
  ]
};
