/**
 * Family Medicine & Primary Care Postings: Chronic Disease Management Protocols
 * Authoritative chronic disease content derived from ACC/AHA 2017 HTN, ADA 2024 Diabetes, USPSTF ASCVD.
 * Mapped to NMC CBME Competencies: FM1.2, CM1.2, IM1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHRONIC_DISEASE_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "fam-chronic-disease-protocols",
  unitCode: "FM1.2",
  title: "Chronic Disease Protocols: ACC/AHA Hypertension Algorithms, ADA 2024 Diabetes Management & ASCVD Statin Stratification",
  competencies: ["FM1.2", "CM1.2", "IM1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Outpatient Chronic Disease Management: Hypertension, Diabetes & Dyslipidemia

Structured pharmacotherapeutic titration algorithms prevent end-organ damage across cardiac, renal, and microvascular systems.

---

## 1. ACC/AHA 2017 Hypertension Staging \u0026 First-Line Pharmacotherapy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Blood Pressure Category} & \\textbf{Systolic (mmHg)} & \\textbf{Diastolic (mmHg)} & \\textbf{First-Line Pharmacotherapy Strategy} \\\\
\\hline
\\textbf{Normal} & < 120 & \\text{and } < 80 & \\text{Lifestyle habits, annual reassessment} \\\\
\\textbf{Elevated} & 120-129 & \\text{and } < 80 & \\text{Non-pharmacological lifestyle therapy (DASH diet, weight, sodium } < 1.5\\text{ g/d)} \\\\
\\textbf{Stage 1 Hypertension} & 130-139 & \\text{or } 80-89 & \\text{Lifestyle } + \\text{ 1 drug if 10-year ASCVD risk } \\ge 10\\% \\\\
\\textbf{Stage 2 Hypertension} & \\ge 140 & \\text{or } \\ge 90 & \\mathbf{\\text{Lifestyle } + \\text{ 2 first-line agents from different classes if BP } > 20/10\\text{ above goal}} \\\\
\\hline
\\end{array}$$

- **Demographic & Comorbid Drug Selection**:
  - **General Non-Black Patients**: Thiazide-like diuretic (Chlorthalidone/HCTZ), Dihydropyridine CCB (Amlodipine), or ACEI/ARB (Lisinopril/Losartan).
  - **Black Patients without CKD**: **Calcium Channel Blocker (CCB)** or **Thiazide Diuretic** initial monotherapy (superior stroke reduction and BP response compared to ACEI monotherapy).
  - **Chronic Kidney Disease (CKD) with Proteinuria ($ACR \\ge 30\\text{ mg/g}$)**: **ACE Inhibitor or ARB** initial therapy (slows diabetic nephropathy progression via efferent arteriolar vasodilation).

---

## 2. ADA 2024 Type 2 Diabetes Glycemic Goals & Organ-Protective Agents

$$\\begin{array}{lcccc}
\\hline
\\textbf{Patient Comorbidity} & \\textbf{Glycemic Target} & \\textbf{First-Line / Preferred Pharmacotherapy} & \\textbf{Mechanism \u0026 Clinical Benefits} \\\\
\\hline
\\textbf{Standard Adults} & \\mathbf{\\text{HbA1c} < 7.0\\%} & \\mathbf{\\text{Metformin } + \\text{ Lifestyle modifications}} & \\text{Decreases hepatic gluconeogenesis; weight neutral; low hypoglycemia} \\\\
\\textbf{Heart Failure (HFrEF/HFpEF)} & \\text{HbA1c } < 7.0-7.5\\% & \\mathbf{\\text{SGLT2 Inhibitor (Empagliflozin / Dapagliflozin)}} & \\mathbf{\\text{Reduces HF hospitalization and cardiovascular death}} \\\\
\\textbf{Diabetic Kidney Disease} & \\text{HbA1c } < 7.0-7.5\\% & \\mathbf{\\text{SGLT2 Inhibitor } + \\text{ Nonsteroidal MRA (Finerenone)}} & \\mathbf{\\text{Slows CKD progression, reduces albuminuria and cardiovascular events}} \\\\
\\textbf{High ASCVD / Obesity} & \\text{HbA1c } < 7.0\\% & \\mathbf{\\text{GLP-1 RA (Semaglutide / Dulaglutide / Tirzepatide)}} & \\mathbf{\\text{Significant weight loss, reduces MACE, strokes, and MI}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old Black male with long-standing type 2 diabetes presents for follow-up. His home blood pressure logs average 154/94 mmHg (Stage 2 Hypertension). Laboratory testing reveals an HbA1c of 8.2%, serum creatinine 1.0 mg/dL, and urine albumin-to-creatinine ratio (ACR) of 280 mg/g (confirming persistent diabetic microalbuminuria). He is currently taking only Metformin 1,000 mg twice daily.",
      question: "According to ACC/AHA and ADA guidelines, what are the most appropriate pharmacotherapeutic additions to his regimen today?",
      options: [
        "Initiate an ACE Inhibitor (e.g. Lisinopril) for renal microalbuminuria protection PLUS a Calcium Channel Blocker (e.g. Amlodipine) for Stage 2 hypertension, and add an SGLT2 Inhibitor (e.g. Empagliflozin) for renal/cardiovascular risk reduction and glycemic control",
        "Start Atenolol monotherapy and increase Metformin to 3,000 mg daily",
        "Prescribe Furosemide 20 mg once daily and hold Metformin",
        "Advise dietary modifications alone and recheck in 1 year"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights guideline-directed management of complex multimorbidity: (1) Hypertension & CKD with Albuminuria: Although Black patients without CKD respond best to CCBs or thiazides, patients with diabetic nephropathy and microalbuminuria (ACR >=30 mg/g) mandate an ACE inhibitor or ARB for renal hemodynamics (efferent arteriolar vasodilation reducing intraglomerular pressure); (2) Stage 2 HTN: Because his BP is >20/10 mmHg above goal (<130/80), initial combination therapy with 2 agents (ACEI + CCB) is recommended; (3) Diabetes & Renal Protection: An SGLT2 inhibitor (Empagliflozin) provides proven synergistic reduction in CKD progression, albuminuria, and cardiovascular mortality."
    }
  ]
};
