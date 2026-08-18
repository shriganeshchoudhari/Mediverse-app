/**
 * Clinical Radiology: Contrast Media Dynamics, CIN & NSF Protocols
 * Authoritative medical content derived from ACR Manual on Contrast Media (2023/2026), Brant and Helms' (5th ed.).
 * Mapped to NMC CBME Competencies: RD1.1, RD1.2, MD39.1, SU37.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CONTRAST_MEDIA_CIN_NSF_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "radiology-adv-contrast-cin-nsf",
  unitCode: "RD1.1",
  title: "Contrast Media Safety: Iodinated CIN/PC-AKI, Metformin Rules & Gadolinium Macrocyclic NSF",
  competencies: ["RD1.1", "RD1.2", "MD39.1", "SU37.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Contrast Media Dynamics, Nephrotoxicity & Safety Protocols

Diagnostic imaging relies on intravascular iodinated agents for computed tomography (CT) and gadolinium chelates for magnetic resonance imaging (MRI), requiring strict adherence to renal safety protocols.

---

## 1. Iodinated Contrast-Induced Nephropathy (CIN / PC-AKI)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Parameter} & \\textbf{Definition / Mechanism} & \\textbf{High-Risk Threshold} & \\textbf{Evidence-Based Prevention} & \\textbf{Metformin Safety Rule} \\\\
\\hline
\\textbf{Iodinated CIN} & \\text{Renal medullary vasoconstriction} & \\mathbf{\\text{eGFR } < 30\\text{ mL/min/1.73m}^2} & \\mathbf{\\text{Isotonic IV Hydration}} & \\mathbf{\\text{Hold Metformin at scan}} \\\\
\\text{(Post-Contrast AKI)} & + \\text{ tubular epithelial cytotoxicity} & (\\text{or } <45 \\text{ in diabetic/AKI}) & (\\text{Normal Saline } 1\\text{ mL/kg/h}) & \\mathbf{\\text{if eGFR } < 60\\text{; resume in 48h}} \\\\
& & & \\text{Minimize contrast volume} & \\text{after verifying normal renal fx} \\\\
\\hline
\\end{array}$$

- **The Metformin Lactic Acidosis Risk**:
  - Metformin is excreted $100\\%$ unchanged by the kidneys; it does NOT cause contrast nephropathy, but if contrast-induced acute kidney injury develops, metformin will accumulate and trigger fatal **Metformin-Associated Lactic Acidosis (MALA)**.
  - ACR Guideline: In patients with $\\text{eGFR} < 30-60\\text{ mL/min/1.73m}^2$ or acute renal dysfunction, hold metformin at the time of the procedure and withhold for $48\\text{ hours}$ until repeat renal function is confirmed stable.

---

## 2. Gadolinium-Based Contrast Agents (GBCAs) & Nephrogenic Systemic Fibrosis (NSF)

$$\\begin{array}{lcccc}
\\hline
\\textbf{GBCA Category} & \\textbf{Chemical Structure} & \\textbf{Thermodynamic Stability} & \\textbf{Examples} & \\textbf{NSF Risk in ESRD (eGFR } <30\\text{)} \\\\
\\hline
\\textbf{Group I (Linear Non-Ionic)} & \\text{Open linear flexible chain} & \\text{Low (Free } Gd^{3+}\\text{ release)} & \\text{Gadodiamide (Omniscan), Gadoversetamide} & \\mathbf{\\text{HIGH RISK (CONTRAINDICATED)}} \\\\
\\textbf{Group II (Macrocyclic)} & \\mathbf{\\text{Rigid cyclic cage structure}} & \\mathbf{\\text{Extremely High (Tight } Gd^{3+}\\text{)}} & \\mathbf{\\text{Gadobutrol (Gadavist), Gadoterate (Dotarem)}} & \\mathbf{\\text{NEGLIGIBLE / EXTREMELY SAFE}} \\\\
\\hline
\\end{array}$$

- **Pathophysiology of NSF**:
  - In severe renal impairment, delayed excretion allows dissociation of toxic, free $Gd^{3+}$ ions from unstable linear chelates $\rightarrow$ free $Gd^{3+}$ deposits in the dermis, fascia, and myocardium, recruiting **CD34+/procollagen I+ circulating fibrocytes** and causing debilitating, progressive dermal thickening and visceral fibrosis.
  - Group II macrocyclic agents cage $Gd^{3+}$ with extraordinary kinetic and thermodynamic stability, completely preventing ion dissociation.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with Type 2 Diabetes Mellitus (baseline serum creatinine 2.1 mg/dL, eGFR 32 mL/min/1.73m2) taking Metformin 1,000 mg twice daily is scheduled for a contrast-enhanced CT of the abdomen and pelvis to evaluate suspected colonic malignancy.",
      question: "Which of the following is the most appropriate, evidence-based nephroprotection and medication safety protocol according to American College of Radiology (ACR) guidelines?",
      options: [
        "Administer isotonic intravenous hydration (0.9% Normal Saline at 1 mL/kg/h) for 6-12 hours before and after the scan; hold Metformin at the time of the procedure and withhold for 48 hours until repeat serum creatinine confirms stable renal function",
        "Administer intravenous Furosemide prior to the scan to force diuresis",
        "Double the dose of Metformin to clear the contrast faster",
        "Perform the CT with Group I linear gadolinium contrast instead of iodinated contrast"
      ],
      correctAnswerIndex: 0,
      explanation: "According to American College of Radiology (ACR) guidelines, patients with pre-existing renal disease (eGFR <30-45 mL/min/1.73m2) undergoing iodinated contrast CT require: (1) Isotonic intravenous volume expansion (0.9% saline or sodium bicarbonate at 1 mL/kg/h pre- and post-procedure) to prevent medullary vasoconstriction; and (2) Holding Metformin at the time of contrast administration and withholding for at least 48 hours until renal function is re-evaluated, thereby preventing fatal Metformin-Associated Lactic Acidosis (MALA) if post-contrast AKI occurs."
    }
  ]
};
