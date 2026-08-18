/**
 * Postgraduate Advanced Psychiatry: Bipolar Mania, Perinatal Psychiatry & Lithium Toxicity
 * Authoritative neuropsychiatric content derived from APA Bipolar Guidelines, ISBD Guidelines, Teratology Reference Standards.
 * Mapped to NMC PG CBME Competencies: PG10.4, PSY4.1, PSY4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BIPOLAR_MANIA_PERINATAL_PSYCHIATRY_LITHIUM_MODULE: PhysiologyLessonModule = {
  id: "pg10-bipolar-mania-perinatal-psychiatry-lithium",
  unitCode: "PG10.4",
  title: "Bipolar Mania, Perinatal Psychiatric Emergencies & Lithium Toxicity Dialysis Thresholds",
  competencies: ["PG10.4", "PSY4.1", "PSY4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Bipolar Mania, Perinatal Psychiatric Emergencies & Lithium Resuscitation

Acute manic excitement and perinatal psychiatric crises demand urgent medical stabilization, recognition of teratogenic risk profiles, and precise pharmacovigilance for mood stabilizer toxicities.

---

## 1. Lithium Serum Concentration Ranges & Toxicity Resuscitation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical State} & \\textbf{Serum Lithium Concentration} & \\textbf{Clinical Signs \\& Symptoms} & \\textbf{Intervention / Protocol} \\\\
\\hline
\\textbf{Maintenance Target} & 0.6-0.8\\text{ mEq/L} & \\text{Euthymic mood stabilization} & \\text{Routine renal (BUN/Cr) + TSH monitoring} \\\\
\\textbf{Acute Mania Target} & \\mathbf{0.8-1.2\\text{ mEq/L}} & \\text{Antimanic therapeutic range} & \\text{Monitor 12-hour post-dose trough levels} \\\\
\\textbf{Mild Toxicity} & 1.5-2.0\\text{ mEq/L} & \\text{Nausea, vomiting, diarrhea, coarse tremor, ataxia} & \\text{Hold lithium; IV 0.9\\% normal saline hydration} \\\\
\\textbf{Moderate Toxicity} & 2.0-2.5\\text{ mEq/L} & \\text{Hyperreflexia, clonus, severe confusion, dysarthria} & \\text{Aggressive IV hydration; ICU monitoring} \\\\
\\textbf{Severe Toxicity} & \\mathbf{> 2.5\\text{ mEq/L (or } > 4.0\\text{ acute)}} & \\mathbf{\\text{Seizures, coma, cardiac arrhythmias, death}} & \\mathbf{\\text{EMERGENT HEMODIALYSIS}} \\\\
\\hline
\\end{array}$$

---

## 2. Perinatal Psychiatry & Teratogenicity Profiles

$$\\begin{array}{lcccc}
\\hline
\\textbf{Psychiatric Agent / Condition} & \\textbf{Teratogenic / Clinical Risk} & \\textbf{Key Pathophysiology \\& Clinical Rule} \\\\
\\hline
\\textbf{Postpartum Psychosis} & \\mathbf{\\text{High infanticide \\& suicide risk (5\\%)}} & \\mathbf{\\text{Psychiatric emergency within 1-2 weeks postpartum;}} \\\\
& & \\mathbf{\\text{requires involuntary hospitalization + antipsychotics/ECT}} \\\\
\\textbf{Lithium Carbonate} & \\mathbf{\\text{Ebstein Anomaly (1/1000 risk)}} & \\text{Apical displacement of tricuspid valve; monitor fetal echo} \\\\
\\textbf{Valproate / Divalproex} & \\mathbf{\\text{Neural Tube Defects (Spina Bifida 1-2\\%),}} & \\mathbf{\\text{STRICTLY CONTRAINDICATED in women of childbearing}} \\\\
& \\mathbf{\\text{facial clefts, IQ reduction (8-10 pts)}} & \\mathbf{\\text{potential unless all alternatives fail}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old female with bipolar I disorder on chronic Lithium Carbonate (1200 mg/day) is brought to the emergency department with severe confusion, slurred speech, generalized myoclonic jerking, and inability to walk. Her medical history is significant for recent hypertension treated with Hydrochlorothiazide 25 mg daily started 10 days ago. On examination, she is lethargic and disoriented with coarse tremors, marked hyperreflexia, and sustained ankle clonus. Vital signs: BP 100/60 mmHg, HR 56 bpm. Laboratory evaluation reveals: Serum Lithium level 3.6 mEq/L, BUN 44 mg/dL, and Serum Creatinine 2.8 mg/dL (baseline 0.8 mg/dL).",
      question: "What is the diagnosis, what drug interaction precipitated this emergency, and what is the definitive life-saving management?",
      options: [
        "Severe Acute-on-Chronic Lithium Toxicity (Serum Lithium 3.6 mEq/L) precipitated by Hydrochlorothiazide (thiazide diuretics reduce renal sodium reabsorption in the distal tubule, causing compensatory proximal tubule lithium and sodium reabsorption); immediately discontinue Lithium and Hydrochlorothiazide, and initiate Emergent Hemodialysis (indicated for serum lithium >2.5 mEq/L with severe neurotoxicity or >4.0 mEq/L regardless of symptoms)",
        "Mild lithium toxicity; administer oral sodium bicarbonate and discharge home",
        "Thiazide-induced hyponatremia only; administer 3% hypertonic saline without stopping Lithium",
        "Wernicke encephalopathy; administer IV thiamine only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates severe Lithium Toxicity: (1) Drug Interaction: Thiazide diuretics reduce renal lithium clearance by promoting proximal tubular lithium reabsorption, precipitating toxic accumulation; (2) Toxicity Manifestations: At levels >2.5 mEq/L, severe neurotoxicity (clonus, myoclonus, encephalopathy) and nephrotoxicity ensue; (3) Hemodialysis Thresholds: Emergent hemodialysis is mandatory for serum lithium >2.5 mEq/L with clinical neurotoxicity, renal failure, or levels >4.0 mEq/L."
    }
  ]
};
