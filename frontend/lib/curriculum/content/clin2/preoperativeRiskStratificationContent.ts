/**
 * Clinical Postings II: Preoperative Risk Stratification & Surgical Clearance
 * Authoritative perioperative surgical medicine content derived from Sabiston, Schwartz, ACC/AHA Guidelines.
 * Mapped to NMC CBME Competencies: CP2.1, SU1.1, AN1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PREOPERATIVE_RISK_STRATIFICATION_MODULE: PhysiologyLessonModule = {
  id: "clin2-preoperative-risk-stratification",
  unitCode: "CP2.1",
  title: "Preoperative Risk Stratification: Revised Cardiac Risk Index (RCRI), ASA Physical Status, METs & Perioperative Medication Management",
  competencies: ["CP2.1", "SU1.1", "AN1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Preoperative Risk Stratification, Functional Capacity & Surgical Clearance

Accurate preoperative assessment identifies modifiable cardiovascular risks, quantifies metabolic reserve, and establishes disciplined perioperative medication regimens.

---

## 1. Revised Cardiac Risk Index (RCRI / Lee Criteria) \u0026 ASA Physical Status

$$\\begin{array}{lcccc}
\\hline
\\textbf{RCRI Predictor Variable} & \\textbf{Clinical Definition} & \\textbf{Points} & \\textbf{Estimated Major Adverse Cardiac Event (MACE) Rate} \\\\
\\hline
\\textbf{1. High-Risk Surgery} & \\text{Intraperitoneal, intrathoracic, or suprainguinal vascular} & 1 & \\mathbf{\\text{Class I (0 predictors): 0.4\\%}} \\\\
\\textbf{2. Ischemic Heart Disease} & \\text{History of MI, positive stress test, angina, nitrate use, Q waves} & 1 & \\mathbf{\\text{Class II (1 predictor): 0.9\\%}} \\\\
\\textbf{3. Congestive Heart Failure} & \\text{History of HF, pulmonary edema, S3 gallop, elevated BNP} & 1 & \\mathbf{\\text{Class III (2 predictors): 6.6\\%}} \\\\
\\textbf{4. Cerebrovascular Disease} & \\text{Prior Stroke or Transient Ischemic Attack (TIA)} & 1 & \\mathbf{\\text{Class IV (}\\ge 3\\text{ predictors): > 11.0\\%}} \\\\
\\textbf{5. Insulin-Treated Diabetes} & \\text{Preoperative subcutaneous insulin therapy} & 1 & \\\\
\\textbf{6. Renal Impairment} & \\mathbf{\\text{Preoperative serum creatinine } > 2.0\\text{ mg/dL}} & 1 & \\\\
\\hline
\\end{array}$$

- **Functional Capacity (Metabolic Equivalents - METs)**:
  - $\\mathbf{\\ge 4\\text{ METs}}$ (climbing 2 flights of stairs, walking uphill at 4 mph, scrubbing floors) indicates adequate cardiopulmonary functional reserve; patients with $\\ge 4\\text{ METs}$ generally proceed to surgery without invasive cardiac testing even with elevated RCRI.
  - $\\mathbf{< 4\\text{ METs}}$ (unable to walk 2 blocks on level ground without stopping) indicates poor functional capacity requiring cardiology evaluation if clinical risk is high.

---

## 2. Perioperative Medication Management

$$\\begin{array}{lcccc}
\\hline
\\textbf{Medication Class} & \\textbf{Perioperative Action} & \\textbf{Underlying Pathophysiological Rationale} \\\\
\\hline
\\textbf{Beta-Blockers (Chronic)} & \\mathbf{\\text{CONTINUE through day of surgery}} & \\text{Abrupt withdrawal causes severe rebound tachycardia, HTN, and MI} \\\\
\\textbf{Statins} & \\mathbf{\\text{CONTINUE through day of surgery}} & \\text{Plaque stabilization, anti-inflammatory, endothelial protection} \\\\
\\textbf{ACE Inhibitors / ARBs} & \\mathbf{\\text{HOLD on morning of surgery}} & \\mathbf{\\text{Prevents refractory intraoperative vasoplegic hypotension under anesthesia}} \\\\
\\textbf{SGLT2 Inhibitors} & \\mathbf{\\text{HOLD 3-4 days prior to surgery}} & \\mathbf{\\text{Prevents life-threatening Euglycemic Diabetic Ketoacidosis (euDKA)}} \\\\
\\textbf{Warfarin} & \\text{HOLD 5 days prior (target INR } \\le 1.5\\text{)} & \\text{Allows hepatic clearance of vitamin K-dependent clotting factors} \\\\
\\textbf{DOACs (Apixaban/Rivaroxaban)} & \\text{HOLD 48-72 hours prior} & \\text{Short half-life; depends on renal clearance and surgical bleeding risk} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a history of anterior STEMI treated with a drug-eluting stent 4 years ago, congestive heart failure (LVEF 35%), and type 2 diabetes on subcutaneous insulin (serum creatinine 1.2 mg/dL) is scheduled for elective open right hemicolectomy for colon adenocarcinoma. He walks 3 miles daily and climbs 3 flights of stairs without chest tightness or shortness of breath. His chronic medications include Metoprolol succinate, Lisinopril, Empagliflozin, and Atorvastatin.",
      question: "What is his Revised Cardiac Risk Index (RCRI) score, and which medication adjustments are mandatory prior to his operation?",
      options: [
        "RCRI = 3 (High-risk surgery, Ischemic heart disease, Congestive heart failure, Insulin-treated diabetes = 4 risk factors, Class IV, MACE >11%); Continue Metoprolol and Atorvastatin; Hold Lisinopril on morning of surgery; Hold Empagliflozin (SGLT2 inhibitor) 3-4 days prior to prevent euglycemic DKA; proceed to surgery without stress testing due to excellent functional capacity (>4 METs)",
        "RCRI = 0; Discontinue Metoprolol immediately to prevent intraoperative bradycardia",
        "RCRI = 1; Continue all medications including Empagliflozin up to the minute of incision",
        "RCRI = 5; Cancel surgery permanently because functional capacity is inadequate"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates comprehensive Preoperative Risk Stratification: (1) RCRI Calculation: The patient has 4 independent predictors (High-risk intraperitoneal surgery, history of CAD/MI, history of CHF, and insulin-dependent diabetes) placing him in RCRI Class IV (>11% risk of major cardiac events); (2) Functional Capacity: Because he can walk 3 miles and climb 3 flights of stairs (>4 METs), guidelines recommend proceeding to surgery without preoperative stress testing; (3) Medication Protocols: Continue beta-blocker (prevents rebound ischemia) and statin; HOLD ACE-inhibitor (prevents vasoplegic hypotension under general anesthesia); HOLD SGLT2 inhibitor (Empagliflozin) 3-4 days prior to avoid perioperative euglycemic DKA."
    }
  ]
};
