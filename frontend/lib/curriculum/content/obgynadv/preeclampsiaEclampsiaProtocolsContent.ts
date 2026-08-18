/**
 * Clinical Obgyn Advanced: Hypertensive Disorders of Pregnancy & Eclampsia Protocols
 * Authoritative obstetric content derived from Williams Obstetrics (26th ed.), ACOG Practice Bulletins.
 * Mapped to NMC CBME Competencies: OG1.1, OG1.2, MD44.1, SU42.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PREECLAMPSIA_ECLAMPSIA_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "obgyn-adv-preeclampsia-eclampsia",
  unitCode: "OG1.1",
  title: "Hypertensive Disorders of Pregnancy: Preeclampsia with Severe Features, HELLP & Magnesium Sulfate",
  competencies: ["OG1.1", "OG1.2", "MD44.1", "SU42.1"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Hypertensive Disorders of Pregnancy: Preeclampsia, HELLP & Eclampsia

Preeclampsia is a multisystem endothelial disorder triggered by defective placental spiral artery remodeling, presenting with gestational hypertension and systemic end-organ dysfunction.

---

## 1. Preeclampsia Classification & Diagnostic Criteria Matrix

$$\\begin{array}{lccc}
\\hline
\\textbf{Hypertensive Entity} & \\textbf{Blood Pressure Criteria} & \\textbf{Proteinuria / Laboratory Hallmarks} & \\textbf{Definitive Clinical Mandate} \\\\
\\hline
\\textbf{Gestational} & \\mathbf{\\text{BP } \\ge 140/90\\text{ mmHg}} & \\text{Absence of proteinuria} & \\text{Monitor weekly; reclassify} \\\\
\\textbf{Hypertension} & (\\ge 20\\text{ weeks gestation}) & \\text{and normal end-organ labs} & \\text{postpartum if persists} \\\\
\\textbf{Preeclampsia} & \\mathbf{\\text{BP } \\ge 140/90\\text{ mmHg}} & \\mathbf{\\text{Proteinuria } \\ge 300\\text{ mg/24h (UPCR } \\ge 0.3\\text{)}} & \\text{Delivery at } \\ge 37\\text{ weeks} \\\\
\\textbf{(Without Severe Features)} & (\\ge 20\\text{ weeks}) & \\text{OR thrombocytopenia/renal failure} & (\\text{or earlier if worsening}) \\\\
\\textbf{Preeclampsia with} & \\mathbf{\\text{BP } \\ge 160/110\\text{ mmHg}} & \\mathbf{\\text{Platelets } < 100{,}000/\\mu\\text{L} \\mid \\text{AST/ALT } >2\\times} & \\mathbf{\\text{Delivery at } \\ge 34\\text{ weeks;}} \\\\
\\textbf{Severe Features} & (\\text{on 2 occasions } \\ge 4\\text{h apart}) & \\mathbf{\\text{Creatinine } > 1.1\\text{ mg/dL} \\mid \\text{Pulmonary edema}} & \\mathbf{\\text{Immediate IV } \\text{MgSO}_4} \\\\
& & \\mathbf{\\text{New-onset visual/cerebral symptoms}} & + \\text{ Antihypertensives} \\\\
\\textbf{HELLP Syndrome} & \\text{Variable BP elevations} & \\mathbf{\\text{Hemolysis (LDH } > 600\\text{ U/L, schistocytes)}} & \\mathbf{\\text{Immediate delivery regardless}} \\\\
& & + \\mathbf{\\text{Elevated Liver Enzymes } + \\text{Platelets } < 100{,}000} & \\mathbf{\\text{of gestational age (}\\text{MgSO}_4\\text{)}} \\\\
\\textbf{Eclampsia} & \\text{Variable BP elevations} & \\mathbf{\\text{New-onset generalized tonic-clonic seizures}} & \\mathbf{\\text{Immediate IV } \\text{MgSO}_4 \\text{ loading}} \\\\
& & \\text{in a patient with preeclampsia} & + \\text{ emergent Cesarean/induction} \\\\
\\hline
\\end{array}$$

---

## 2. Magnesium Sulfate Seizure Prophylaxis & Antihypertensive Protocols

- **Magnesium Sulfate ($\\text{MgSO}_4$) Dosing Protocol**:
  - **Loading Dose**: $\mathbf{4 - 6\\text{ g IV in } 100\\text{ mL fluid over } 15 - 20\\text{ minutes}}$.
  - **Maintenance Dose**: $\mathbf{1 - 2\\text{ g/hour continuous IV infusion}}$ continued for at least $24\\text{ hours postpartum}$.
  - **Clinical Safety Monitoring**:
    1. Deep Tendon (Patellar) Reflexes present (loss of DTRs occurs at $[\\text{Mg}^{2+}] \\approx 7 - 10\\text{ mEq/L}$).
    2. Respiratory rate $\\ge 12\\text{ breaths/min}$ (respiratory depression at $[\\text{Mg}^{2+}] \\approx 12\\text{ mEq/L}$).
    3. Hourly urine output $\\ge 30\\text{ mL/hour}$ (since magnesium is excreted exclusively by the kidneys).
  - **TOXICITY ANTIDOTE**: **Intravenous Calcium Gluconate ($1\\text{ g of } 10\\%\\text{ solution IV over } 3 - 5\\text{ minutes}$)**.
- **Acute Antihypertensive Regimens (for $\\text{BP} \\ge 160/110\\text{ mmHg}$)**:
  - **IV Labetalol**: $20\\text{ mg IV}$ bolus $\\rightarrow$ double to $40\\text{ mg}$, then $80\\text{ mg}$ every $10\\text{ min}$ (max $220\\text{ mg}$; avoid in severe asthma/bradycardia).
  - **IV Hydralazine**: $5 - 10\\text{ mg IV}$ every $20\\text{ min}$ (max $20\\text{ mg}$; direct arteriolar vasodilator).
  - **Oral Nifedipine (Immediate-Release)**: $10 - 20\\text{ mg}$ orally (repeat in $20\\text{ min}$).
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old G1P0 female at 34 weeks of gestation presents to labor and delivery with severe persistent frontal headache, blurry vision with scotomas, and right upper quadrant epigastric pain. Blood pressure is 172/114 mmHg, heart rate is 86 bpm, and fetal heart rate baseline is 140 bpm with moderate variability. Laboratory evaluation demonstrates: Platelet count 64,000/uL, AST 184 U/L, ALT 192 U/L, Total Bilirubin 2.2 mg/dL, Serum LDH 840 U/L, and Serum Creatinine 1.3 mg/dL. Peripheral blood smear reveals numerous fragmented red blood cells (schistocytes and helmet cells).",
      question: "What is the diagnosis, what is the mandatory immediate pharmacological stabilization, and what is the definitive obstetric management?",
      options: [
        "HELLP Syndrome with Preeclampsia with Severe Features; administer IV Magnesium Sulfate loading dose (4-6 g) followed by 1-2 g/h infusion plus IV Labetalol, and proceed with delivery after maternal stabilization",
        "Gestational Thrombocytopenia; administer oral aspirin and discharge home with weekly clinic follow-up",
        "Thrombotic Thrombocytopenic Purpura (TTP); perform emergent therapeutic plasma exchange without delivery",
        "Acute Fatty Liver of Pregnancy; administer high-dose oral corticosteroids and expect spontaneous recovery"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic diagnostic triad of HELLP Syndrome (Hemolysis [elevated LDH >600, elevated bilirubin, schistocytes on blood smear], Elevated Liver enzymes [AST/ALT >2x upper limit], and Low Platelets [<100,000/uL]) superimposed on Preeclampsia with Severe Features (severe range BP >=160/110, severe headache/visual changes, RUQ pain, elevated creatinine). The mandatory immediate medical stabilization consists of: (1) Intravenous Magnesium Sulfate (4-6 g loading dose over 15-20 min, then 1-2 g/h) for seizure prophylaxis; (2) Acute antihypertensive therapy (IV Labetalol or IV Hydralazine) to lower BP <160/110 and prevent intracranial hemorrhage; and (3) Prompt delivery (induction or cesarean) regardless of gestational age once maternal hemodynamic stabilization is achieved."
    }
  ]
};
