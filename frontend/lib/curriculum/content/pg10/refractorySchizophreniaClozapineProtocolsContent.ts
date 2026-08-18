/**
 * Postgraduate Advanced Psychiatry: Treatment-Refractory Schizophrenia & Clozapine Protocols
 * Authoritative neuropsychiatric content derived from FDA Clozapine REMS, APA Schizophrenia Guidelines, WFSBP TRS Guidelines.
 * Mapped to NMC PG CBME Competencies: PG10.3, PSY3.1, PSY3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const REFRACTORY_SCHIZOPHRENIA_CLOZAPINE_MODULE: PhysiologyLessonModule = {
  id: "pg10-refractory-schizophrenia-clozapine",
  unitCode: "PG10.3",
  title: "Treatment-Refractory Schizophrenia (TRS): Clozapine Titration, ANC Monitoring & REMS Guidelines",
  competencies: ["PG10.3", "PSY3.1", "PSY3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Treatment-Refractory Schizophrenia (TRS) & Clozapine REMS Protocols

Clozapine is the only evidence-based antipsychotic proven to reduce positive psychotic symptoms, suicidal behavior, and aggressive violence in treatment-refractory schizophrenia, but requires strict Absolute Neutrophil Count (ANC) pharmacovigilance.

---

## 1. Absolute Neutrophil Count (ANC) Monitoring Protocols (FDA REMS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Patient Population} & \\textbf{Baseline ANC Requirement} & \\textbf{Monitoring Schedule} & \\textbf{ANC Action Thresholds} \\\\
\\hline
\\textbf{General Population} & \\mathbf{\\text{ANC } \\ge 1,500/\\mu\\text{L}} & \\text{Weekly (Months 1-6)} & \\mathbf{\\text{ANC } 1,000-1,499: \\text{ Continue, test 3x/week}} \\\\
& & \\text{Biweekly (Months 7-12)} & \\mathbf{\\text{ANC } < 1,000: \\text{ SUSPEND IMMEDIATELY}} \\\\
& & \\text{Monthly (Thereafter)} & \\mathbf{\\text{ANC } < 500: \\text{ STOP PERMANENTLY (Agranulocytosis)}} \\\\
\\textbf{Benign Ethnic Neutropenia (BEN)} & \\mathbf{\\text{ANC } \\ge 1,000/\\mu\\text{L}} & \\text{Same interval schedule} & \\mathbf{\\text{ANC } < 500: \\text{ SUSPEND / Hematology consult}} \\\\
\\hline
\\end{array}$$

---

## 2. Clozapine Pharmacotherapy & High-Yield Adverse Effects

$$\\begin{array}{lcccc}
\\hline
\\textbf{Adverse Effect / Target} & \\textbf{Incidence \\& Timing} & \\textbf{Clinical Hallmarks} & \\textbf{Management \\& Safety Rules} \\\\
\\hline
\\textbf{Therapeutic Serum Level} & \\text{Trough target} & \\mathbf{350-600\\text{ ng/mL}} & \\text{Dose titrations; smoking induces CYP1A2} \\\\
\\textbf{Myocarditis} & \\text{First 4-6 weeks (0.1-1\\%)} & \\text{Chest pain, fever, tachycardia, dyspnea} & \\mathbf{\\text{Check Troponin + CRP; STOP IF ELEVATED}} \\\\
\\textbf{Severe Constipation / Ileus} & \\text{Anytime (up to 30\\%)} & \\text{Abdominal distension, obstipation, vomiting} & \\mathbf{\\text{Mandatory bowel regimen (PEG); high mortality!}} \\\\
\\textbf{Dose-Dependent Seizures} & > 600\\text{ mg/day (3-5\\%)} & \\text{Myoclonic jerks, generalized tonic-clonic} & \\text{Add Valproate (avoids CYP induction)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male with an 8-year history of chronic paranoid schizophrenia continues to experience persecutory auditory hallucinations, command delusions, and severe agitation despite consecutive full 8-week therapeutic trials of Risperidone (6 mg/day) and Olanzapine (20 mg/day) with verified treatment adherence. Medical workup and baseline labs show WBC 6,800/uL and Absolute Neutrophil Count (ANC) 3,900/uL. He has no history of blood dyscrasias.",
      question: "What is the diagnosis, what is the indicated next-line antipsychotic, and what is the mandatory ANC monitoring schedule during the first year of therapy?",
      options: [
        "Treatment-Refractory Schizophrenia (TRS); initiate Clozapine with slow upward titration targeting a therapeutic trough serum level of 350-600 ng/mL; per FDA Clozapine REMS guidelines, mandatory CBC monitoring of the Absolute Neutrophil Count (ANC) must be performed WEEKLY for the first 6 months, then BIWEEKLY (every 2 weeks) for months 6 through 12, and every 4 weeks thereafter as long as ANC remains >= 1,500/uL",
        "Treatment-Responsive Schizophrenia; switch to Haloperidol 10 mg daily without blood monitoring",
        "Schizoaffective disorder; start Lithium monotherapy only",
        "Atypical psychosis; initiate high-dose Lorazepam and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Treatment-Refractory Schizophrenia (TRS): (1) Definition: Failure of >=2 adequate trials of first-line antipsychotics (including second-generation) confirms TRS; (2) Clozapine Efficacy: Clozapine is uniquely effective for refractory positive symptoms and reducing suicide risk; (3) REMS Monitoring: Due to the risk of severe neutropenia/agranulocytosis, weekly ANC monitoring for 6 months, then biweekly for 6 months, then monthly is legally mandated."
    }
  ]
};
