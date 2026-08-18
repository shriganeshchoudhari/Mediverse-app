/**
 * Clinical Psychiatry Advanced: Mood Disorders, Bipolarity & Psychopharmacologic Teratology
 * Authoritative psychiatric content derived from Kaplan & Sadock (10th ed.), Stahl's Psychopharmacology (5th ed.).
 * Mapped to NMC CBME Competencies: PS3.1, PS3.2, MD48.2, SU46.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MOOD_DISORDERS_LITHIUM_TERATOLOGY_MODULE: PhysiologyLessonModule = {
  id: "psychiatry-adv-mood-lithium",
  unitCode: "PS3.1",
  title: "Mood Disorders & Psychopharmacology: Bipolar I/II (DIG FAST), Lithium Narrow Window, Toxicity & Ebstein Anomaly",
  competencies: ["PS3.1", "PS3.2", "MD48.2", "SU46.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Mood Disorders & Psychopharmacology: Bipolarity, Lithium & Teratogenesis

Managing bipolar spectrum disorders requires differentiation of mania from hypomania, rigorous therapeutic drug monitoring of lithium, and vigilant surveillance of teratogenic and organ-specific toxicities.

---

## 1. Mood Stabilizers & Teratogenic Toxicities Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Mood Stabilizer} & \\textbf{Therapeutic Blood Range} & \\textbf{Acute \u0026 Chronic Toxicities} & \\textbf{Specific Teratogenic Defect} & \\textbf{Mandatory Baseline Monitoring} \\\\
\\hline
\\textbf{Lithium} & \\mathbf{0.6 - 1.2\\text{ mEq/L}} & \\mathbf{\\text{Tremor, Nephrogenic DI, Hypothyroidism,}} & \\mathbf{\\text{Ebstein Anomaly}} & \\mathbf{\\text{BUN/Creatinine, eGFR, TSH,}} \\\\
& (\\text{Toxic } \u003e 1.5\\text{; Dialysis } \u003e 2.5) & \\mathbf{\\text{hypercalcemia; Ataxia \u0026 Seizures (toxic)}} & (\\text{apical tricuspid shift, atrialized RV}) & \\text{serum Ca, pregnancy test, ECG} \\\\
\\textbf{Valproic Acid} & \\mathbf{50 - 125\\,\\mu\\text{g/mL}} & \\mathbf{\\text{Hepatotoxicity (fulminant hepatic necrosis),}} & \\mathbf{\\text{Neural Tube Defects}} & \\mathbf{\\text{LFTs, Complete Blood Count}} \\\\
(\\text{Divalproex}) & & \\text{pancreatitis, thrombocytopenia, weight gain} & (\\mathbf{\\text{Spina Bifida}} - 1-2\\%) & (\\text{platelets}), \\text{ pregnancy test} \\\\
\\textbf{Lamotrigine} & \\text{Titrated slowly} & \\mathbf{\\text{Stevens-Johnson Syndrome (SJS) / TEN,}} & \\text{Relatively low risk} & \\text{Daily dermatologic skin exam} \\\\
& (\\text{not blood monitored}) & \\text{aseptic meningitis, dizziness, diplopia} & (\\text{favored in pregnancy if needed}) & (\\text{halt if new rash appears}) \\\\
\\textbf{Carbamazepine} & \\mathbf{4 - 12\\,\\mu\\text{g/mL}} & \\mathbf{\\text{Aplastic anemia, agranulocytosis, SIADH}} & \\mathbf{\\text{Neural Tube Defects,}} & \\mathbf{\\text{CBC, electrolytes (Na+), LFTs,}} \\\\
& & (\\text{hyponatremia}), \\text{CYP3A4 autoinduction} & \\text{craniofacial / finger hypoplasia} & \\text{HLA-B*1502 screening} \\\\
\\hline
\\end{array}$$

---

## 2. Lithium Toxicity & Hemodialysis Indications

- **Drug-Drug Interactions that Trigger Lithium Toxicity**:
  1. **Thiazide Diuretics**: Inhibit distal tubule $\\text{Na}^+$ reabsorption $\\rightarrow$ compensatory proximal tubule $\\text{Na}^+$ and $\\text{Li}^+$ hyper-reabsorption $\\rightarrow$ severe lithium toxicity.
  2. **NSAIDs** (Ibuprofen, Naproxen): Decrease renal prostaglandin synthesis $\\rightarrow$ decrease renal blood flow and GFR $\rightarrow$ reduce lithium clearance by $30-50\\%$.
  3. **ACE Inhibitors / ARBs**: Decrease efferent arteriolar tone $\\rightarrow$ reduced GFR and decreased lithium elimination.
- **Lithium Toxicity Stages**:
  - **Mild-Moderate ($1.5 - 2.5\\text{ mEq/L}$)**: Coarse tremor, vomiting, diarrhea, hyperreflexia, ataxia, slurred speech.
  - **Severe ($>2.5\\text{ mEq/L}$)**: Clonic movements, seizures, stupor, coma, permanent cerebellar ataxia, acute tubular necrosis.
- **Indications for Emergent Hemodialysis**:
  - Serum Lithium level $>4.0\\text{ mEq/L}$ (regardless of symptoms).
  - Serum Lithium level $>2.5\\text{ mEq/L}$ with severe neurotoxicity, renal failure, or hemodynamically unstable vitals.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old female with bipolar I disorder well-controlled on Lithium Carbonate 600 mg twice daily presents to the emergency department with severe nausea, vomiting, unsteadiness on her feet (ataxia), coarse hand tremors, and confusion. One week ago, she was started on Hydrochlorothiazide 25 mg daily for mild essential hypertension and was taking Ibuprofen 600 mg three times daily for knee osteoarthritis. Physical examination reveals an impaired level of consciousness, hyperactive deep tendon reflexes (3+), and broad-based gait ataxia. Serum chemistry reveals: Sodium 134 mEq/L, Potassium 3.2 mEq/L, BUN 38 mg/dL, Serum Creatinine 2.4 mg/dL (baseline 0.9 mg/dL), and Serum Lithium level 3.4 mEq/L.",
      question: "What is the diagnosis, what pharmacokinetic drug interactions precipitated this crisis, and what is the definitive medical management?",
      options: [
        "Severe Lithium Toxicity; precipitated by dual drug-drug interactions: Thiazide diuretic (HCTZ) inducing proximal tubular lithium reabsorption and NSAID (Ibuprofen) impairing renal prostaglandin-mediated lithium clearance; initiate immediate emergent Hemodialysis along with IV isotonic saline hydration",
        "Serotonin Syndrome; administer IV Cyproheptadine and Lorazepam",
        "Neuroleptic Malignant Syndrome; administer IV Dantrolene and Bromocriptine",
        "Normal Lithium side effect; decrease lithium dose and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits life-threatening severe Lithium Toxicity (serum level 3.4 mEq/L) triggered by classic drug-drug interactions: (1) Mechanism: Both Thiazide diuretics (HCTZ) and NSAIDs (Ibuprofen) critically impair renal elimination of lithium. Thiazides cause volume contraction and promote compensatory proximal tubule lithium reabsorption, while NSAIDs inhibit renal prostaglandins and reduce GFR, driving lithium levels into the severe toxic range; (2) Clinical Manifestations: Coarse tremor, vomiting, ataxia, confusion, hyperreflexia, and acute kidney injury; (3) Management: Because the serum lithium level is >2.5 mEq/L in the presence of acute renal failure and severe neurological symptoms, Emergent Hemodialysis is the gold standard definitive treatment to rapidly clear lithium from the intravascular and intracellular compartments, accompanied by aggressive isotonic saline volume resuscitation."
    }
  ]
};
