/**
 * Clinical Psychiatry Advanced: Psychotic Disorders, Schizophrenia & Antipsychotic Safety
 * Authoritative psychiatric content derived from Kaplan & Sadock (10th ed.), Stahl's Psychopharmacology (5th ed.).
 * Mapped to NMC CBME Competencies: PS5.1, PS5.2, MD48.3, SU46.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PSYCHOTIC_DISORDERS_ANTIPSYCHOTICS_MODULE: PhysiologyLessonModule = {
  id: "psychiatry-adv-psychosis-antipsychotics",
  unitCode: "PS5.1",
  title: "Psychotic Disorders & Antipsychotic Therapeutics: Schizophrenia Spectrum, Clozapine REMS (Agranulocytosis) & Metabolic Monitoring",
  competencies: ["PS5.1", "PS5.2", "MD48.3", "SU46.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Psychotic Disorders & Antipsychotics: Schizophrenia, Clozapine & Safety

Schizophrenia spectrum disorders require rigorous diagnostic timeline criteria, targeted antipsychotic selection, and vigilant surveillance of life-threatening agranulocytosis and metabolic decompensation.

---

## 1. Antipsychotics Comparative Efficacy & Adverse Effect Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Antipsychotic} & \\textbf{Pharmacologic Class} & \\textbf{Primary Indication} & \\textbf{Major Adverse Effects} & \\textbf{Mandatory Safety Monitoring} \\\\
\\hline
\\textbf{Clozapine} & \\mathbf{\\text{Atypical SGA (5-HT2A/D2/D4)}} & \\mathbf{\\text{Treatment-Resistant}} & \\mathbf{\\text{Severe Neutropenia / Agranulocytosis}} & \\mathbf{\\text{REMS Absolute Neutrophil Count}} \\\\
& & \\mathbf{\\text{Schizophrenia \u0026 Suicidality}} & (\\mathbf{\\text{ANC } \u003c 500/\\mu\\text{L}})\\text{, Myocarditis, Seizures} & (\\mathbf{\\text{ANC}})\\text{ weekly } \\rightarrow 2\\text{w } \\rightarrow 4\\text{w} \\\\
\\textbf{Olanzapine} & \\text{Atypical SGA} & \\text{Acute psychosis, bipolar mania} & \\mathbf{\\text{Severe metabolic syndrome:}} & \\text{Fasting glucose, lipid panel,} \\\\
& & & \\mathbf{\\text{massive weight gain, DKA, dyslipidemia}} & \\text{waist circumference, BMI} \\\\
\\textbf{Risperidone} & \\text{Atypical SGA (potent D2)} & \\text{Schizophrenia, bipolar mania} & \\mathbf{\\text{Hyperprolactinemia (galactorrhea,}} & \\text{Serum prolactin if symptomatic,} \\\\
& & & \\text{amenorrhea, gynecomastia), EPS at high dose} & \\text{monitor bone density long-term} \\\\
\\textbf{Haloperidol} & \\mathbf{\\text{Typical FGA (High-potency D2)}} & \\text{Acute severe agitation, delirium} & \\mathbf{\\text{High Extrapyramidal Symptoms (EPS),}} & \\text{AIMS exam (tardive dyskinesia),} \\\\
& & & \\text{acute dystonia, akathisia, NMS} & \\text{ECG (QTc prolongation)} \\\\
\\textbf{Aripiprazole} & \\text{Atypical SGA (D2 partial agonist)} & \\text{Schizophrenia, MDD adjunct} & \\text{Akathisia; } \\mathbf{\\text{WEIGHT NEUTRAL,}} & \\text{Assess for motor restlessness /} \\\\
& & & \\text{low metabolic risk, no prolactin rise} & \\text{akathisia early in treatment} \\\\
\\hline
\\end{array}$$

---

## 2. Clozapine REMS Monitoring Protocol & Warning Thresholds

- **Absolute Neutrophil Count (ANC) Thresholds in General Population**:
  - **Normal Baseline**: $\\text{ANC} \\ge 1{,}500/\\mu\\text{L}$ (for Benign Ethnic Neutropenia [BEN], baseline $\\ge 1{,}000/\\mu\\text{L}$).
  - **Mild Neutropenia ($1{,}000 - 1{,}499/\\mu\\text{L}$)**: Continue Clozapine, monitor ANC 3 times weekly.
  - **Moderate Neutropenia ($500 - 999/\\mu\\text{L}$)**: **Interrupt Clozapine therapy immediately**, daily hematology consult, daily ANC monitoring until $\\text{ANC} \\ge 1{,}000/\\mu\\text{L}$.
  - **Severe Neutropenia / Agranulocytosis ($<500/\\mu\\text{L}$)**: **PERMANENTLY DISCONTINUE CLOZAPINE**. Never rechallenge unless benefits overwhelmingly outweigh risks. Administer G-CSF (Filgrastim) and isolate for infection.
- **Other Clozapine Black Box Warnings**:
  - **Myocarditis & Cardiomyopathy** (monitor troponin and CRP in first 4 weeks).
  - **Dose-dependent Seizures** ($>600\\text{ mg/day}$; co-prescribe Valproate).
  - **Severe Gastrointestinal Hypomotility / Fatal Paralytic Ileus**.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male with a 6-year history of treatment-resistant schizophrenia has failed sequential adequate trials of Risperidone, Olanzapine, and Haloperidol Decanoate. He continues to experience persistent persecutory auditory hallucinations and paranoid delusions. He is initiated on Clozapine after baseline labs confirm an Absolute Neutrophil Count (ANC) of 3,800/uL. Eight weeks into treatment, during routine weekly REMS hematologic monitoring, his complete blood count reveals: WBC 1,800/uL with 20% neutrophils, yielding an Absolute Neutrophil Count (ANC) of 360/uL. He has a mild sore throat and a low-grade temperature of 38.0°C.",
      question: "What is the diagnosis, what is the mandatory immediate action regarding Clozapine, and what is the definitive medical management?",
      options: [
        "Clozapine-Induced Severe Neutropenia / Agranulocytosis (ANC < 500/uL); immediately and permanently discontinue Clozapine, hospitalize for reverse protective isolation, obtain blood cultures, and administer subcutaneous Granulocyte Colony-Stimulating Factor (G-CSF / Filgrastim)",
        "Mild drug-induced neutropenia; reduce Clozapine dose by 50% and repeat ANC in one week",
        "Neuroleptic Malignant Syndrome; administer IV Dantrolene immediately",
        "Benign Ethnic Neutropenia; continue current Clozapine dose without modification"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has developed Clozapine-Induced Severe Neutropenia / Agranulocytosis, defined as an Absolute Neutrophil Count (ANC) < 500/uL (here 360/uL): (1) REMS Mandate: Under Clozapine REMS criteria, an ANC < 500/uL mandates immediate and permanent discontinuation of Clozapine therapy. Rechallenge is strictly contraindicated; (2) Infection Risk: The presence of fever (38.0°C) and pharyngitis in an agranulocytic patient constitutes a medical emergency. The patient must be admitted to the hospital, placed in reverse protective isolation, have blood cultures drawn, receive empiric broad-spectrum IV antibiotics (e.g., Cefepime), and receive subcutaneous G-CSF (Filgrastim) to accelerate bone marrow myeloid recovery."
    }
  ]
};
