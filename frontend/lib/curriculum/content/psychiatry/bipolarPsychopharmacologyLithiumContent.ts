/**
 * Bipolar Affective Disorders, DIGFAST & Mood Stabilizers (Lithium, Valproate) Learning Content
 * Authoritative medical content derived from Kaplan & Sadock, Stahl, DSM-5-TR, and USMLE Step 2 CK Psychiatry.
 * Mapped to NMC CBME Competencies: PS4.1, PS4.2, PS5.1, PS5.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BIPOLAR_PSYCHOPHARMACOLOGY_LITHIUM_MODULE: PhysiologyLessonModule = {
  id: "psych-bipolar-lithium",
  unitCode: "PS4.1",
  title: "Psychiatry: Bipolar Affective Disorder (DIGFAST) & Mood Stabilizers (Lithium Toxicity)",
  competencies: ["PS4.1", "PS4.2", "PS5.1", "PS5.2"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Psychiatry: Bipolar Affective Disorder (DIGFAST) & Mood Stabilizers (Lithium Toxicity)

Bipolar disorders are characterized by pathologic fluctuations in mood, energy, and activity levels, managed with mood stabilizers and atypical antipsychotics.

---

## 1. Classification: Bipolar I vs Bipolar II vs Cyclothymia

| Diagnostic Category | Diagnostic Criteria & Episode Characteristics | Functional Impairment / Hospitalization |
| :--- | :--- | :--- |
| **Bipolar I Disorder** | Requires at least **ONE Manic Episode** (lasting $\\ge 1\\text{ week}$, or any duration if hospitalization is required).<br>*Major depressive episodes are common but NOT required for diagnosis!* | Marked impairment in social/occupational functioning, hospitalization frequently required, or psychotic features present. |
| **Bipolar II Disorder** | Requires at least **ONE Hypomanic Episode** (lasting $\\ge 4\\text{ consecutive days}$) **PLUS at least ONE Major Depressive Episode**.<br>*There has NEVER been a full manic episode!* | No severe functional impairment, no hospitalization, and NO psychotic symptoms during hypomania. |
| **Cyclothymic Disorder** | $\\ge 2\\text{ years}$ ($\\ge 1\\text{ year}$ in children/adolescents) of fluctuating hypomanic symptoms and mild depressive periods without ever meeting full criteria for hypomania or MDD. | Chronic mild emotional instability with symptom-free periods $< 2\\text{ months}$. |

---

## 2. Manic & Hypomanic Symptoms: The DIGFAST Mnemonic

$$\\text{Diagnostic Criteria}: \\text{Elevated/irritable mood} + \\ge 3 \\text{ DIGFAST symptoms } (\\ge 4 \\text{ if mood is only irritable})$$

| DIGFAST Mnemonic | Clinical Phenomenon & Manifestation |
| :--- | :--- |
| **D: Distractibility** | Attention easily drawn to unimportant or irrelevant external stimuli. |
| **I: Irresponsibility / Impulsivity** | Excessive involvement in pleasurable, high-risk activities with high potential for painful consequences (reckless spending sprees, sexual indiscretions, foolish business investments). |
| **G: Grandiosity** | Inflated self-esteem, grand delusions of special powers, divine connections, or limitless wealth. |
| **F: Flight of Ideas** | Racing thoughts; subjective experience that thoughts are moving too fast. |
| **A: Activity Increased** | Increase in goal-directed activity (socially, at work, sexually) or psychomotor agitation. |
| **S: Sleep Need Decreased** | Feels fully rested, energetic, and refreshed after only $2-3\\text{ hours}$ of sleep. |
| **T: Talkativeness** | **Pressured Speech**: Fast, loud, unyielding speech that is difficult to interrupt. |

---

## 3. Lithium Carbonate Pharmacokinetics & Toxicity Management

- **Mechanism of Action**: Inositol monophosphatase (IMPase) and Glycogen Synthase Kinase-3 (GSK-3) inhibition; **proven anti-suicidal efficacy in bipolar disorder**.
- **Therapeutic Serum Window**:
  - Acute Mania: **$0.8 - 1.2\\text{ mEq/L}$**.
  - Long-Term Maintenance: **$0.6 - 0.8\\text{ mEq/L}$**.
- **Adverse Effects & Pre-Treatment Screening**:
  1. **Renal**: **Nephrogenic Diabetes Insipidus (NDI)** (lithium impairs principal cell response to ADH $\\rightarrow$ polyuria, polydipsia; treated with **Amiloride**), chronic interstitial nephritis.
  2. **Thyroid**: **Hypothyroidism and Goiter** (inhibits thyroid hormone release; monitor TSH every 6 months).
  3. **Cardiac**: T-wave inversion, sinus node dysfunction, and **Ebstein\'s Anomaly** (downward displacement of tricuspid valve into right ventricle if used in 1st trimester of pregnancy).
  4. **Neuromuscular**: Fine hand tremor, weight gain, benign leukocytosis.
- **Lithium Toxicity ($> 1.5\\text{ mEq/L}$)**:
  - **Precipitating Factors**: Dehydration, low-sodium diets, and drug interactions with **Thiazide Diuretics, NSAIDs (e.g. Ibuprofen), ACE Inhibitors, and ARBs** (which decrease renal clearance of lithium).
  - **Clinical Manifestations**:
    - Mild/Moderate ($1.5-2.5\\text{ mEq/L}$): Coarse tremor, vomiting, diarrhea, hyperreflexia, ataxia, confusion.
    - Severe ($> 2.5\\text{ mEq/L}$): Seizures, stupor, coma, malignant arrhythmias, acute renal failure.
  - **Emergency Treatment**:
    - Stop Lithium immediately $+$ aggressive **IV Isotonic Saline (0.9% NaCl)** hydration to restore GFR.
    - **EMERGENCY HEMODIALYSIS INDICATIONS**:
      1. Serum Lithium level **$> 4.0\\text{ mEq/L}$** (regardless of symptoms), OR
      2. Serum Lithium level **$> 2.5\\text{ mEq/L}$ with severe neurotoxicity (seizures, coma, altered mental status)** or renal failure.
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male with Bipolar I disorder on long-term lithium carbonate therapy presents to the emergency department with severe vomiting, confusion, and difficulty walking. Two days ago, he developed acute lower back strain and started taking high-dose over-the-counter Ibuprofen (800 mg TID). On physical examination, he has a prominent, coarse hand tremor, marked cerebellar ataxia, slurred speech, and hyperreflexia with clonus. Vital signs show BP 100/65 mmHg, HR 105 bpm. Emergency blood work reveals: Serum Lithium level: 3.4 mEq/L, Serum Creatinine: 2.6 mg/dL (baseline 0.9 mg/dL), BUN: 48 mg/dL.",
      question: "Which of the following explains this acute toxicity, and what is the definitive management of choice?",
      options: [
        "NSAID-induced decreased renal lithium clearance; Emergency Hemodialysis + IV Isotonic Saline",
        "Thiazide-induced hypokalemia; Oral potassium chloride replacement",
        "Lithium-induced nephrogenic diabetes insipidus; Subcutaneous Desmopressin (dDAVP)",
        "Serotonin syndrome from drug interaction; Intravenous Cyproheptadine"
      ],
      correctAnswerIndex: 0,
      explanation: "NSAIDs (such as Ibuprofen) inhibit renal prostaglandin synthesis, reducing renal blood flow and glomerular filtration rate, which drastically impairs renal lithium clearance and precipitates severe lithium toxicity. With a serum lithium level of 3.4 mEq/L (>2.5 mEq/L) accompanied by acute renal failure and severe central nervous system neurotoxicity (confusion, coarse tremor, ataxia), the definitive treatment of choice is emergency Hemodialysis combined with IV isotonic saline hydration."
    }
  ]
};
