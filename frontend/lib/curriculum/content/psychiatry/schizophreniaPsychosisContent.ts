/**
 * Schizophrenia Spectrum Disorders, Antipsychotic EPS & Neuroleptic Malignant Syndrome Learning Content
 * Authoritative medical content derived from Kaplan & Sadock, Stahl, DSM-5-TR, and USMLE Step 2 CK Psychiatry.
 * Mapped to NMC CBME Competencies: PS6.1, PS6.2, PS7.1, PS7.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SCHIZOPHRENIA_PSYCHOSIS_MODULE: PhysiologyLessonModule = {
  id: "psych-schizophrenia-psychosis",
  unitCode: "PS6.1",
  title: "Psychiatry: Schizophrenia Spectrum, Antipsychotic Extrapyramidal Symptoms (EPS) & NMS",
  competencies: ["PS6.1", "PS6.2", "PS7.1", "PS7.2"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# Psychiatry: Schizophrenia Spectrum, Antipsychotic Extrapyramidal Symptoms (EPS) & NMS

Psychotic disorders are characterized by delusions, hallucinations, disorganized thinking, and negative symptoms, requiring antipsychotic management and surveillance for movement emergencies.

---

## 1. Schizophrenia Spectrum: DSM-5-TR Diagnostic Criteria & Timeline

$$\\ge 2 \\text{ of the following 5 symptoms for } \\ge 1 \\text{ month, with continuous disturbance } \\ge 6 \\text{ months}$$
*(At least one must be Delusions, Hallucinations, or Disorganized Speech)*

1. **Delusions**: Persecutory, referential, somatic, or bizarre control delusions.
2. **Hallucinations**: Prominently **Auditory 2nd-person (commands) or 3rd-person (running commentary, arguing voices)**.
3. **Disorganized Speech**: Derailment, loose associations, tangentiality, word salad.
4. **Grossly Disorganized or Catatonic Behavior**: Purposeless agitation, waxy flexibility, mutism.
5. **Negative Symptoms (The 5 As)**: **Avolition** (lack of motivation), **Anhedonia**, **Alogia** (poverty of speech), **Affective Flattening**, and **Asociality**.

---

## 2. Psychotic Disorders Timeline & Differential Diagnosis

| Psychotic Disorder | Duration of Continuous Disturbance | Mood Episode Relationship |
| :--- | :--- | :--- |
| **Brief Psychotic Disorder** | **$\\ge 1\\text{ day to } < 1\\text{ month}$** | Sudden onset (frequently preceded by extreme psychological stressor); 100% full return to baseline functioning. |
| **Schizophreniform Disorder** | **$\\ge 1\\text{ month to } < 6\\text{ months}$** | Identical symptoms to schizophrenia, but total duration $< 6\\text{ months}$. |
| **Schizophrenia** | **$\\ge 6\\text{ months}$** (including $\ge 1\\text{ month}$ of active-phase symptoms) | Significant socio-occupational functional decline. |
| **Schizoaffective Disorder** | Prominent mood episodes (Major Depressive or Manic) concurrent with active psychotic symptoms... | **CRITICAL CRITERION**: Delusions or hallucinations must be present for **$\\ge 2\\text{ consecutive weeks}$ in the ABSENCE of prominent mood symptoms**! |
| **Major Depression with Psychotic Features** | Psychotic symptoms occur **EXCLUSIVELY during the major mood episode**. | Psychosis resolves when mood returns to euthymia. |

---

## 3. Antipsychotic Pharmacology: Extrapyramidal Symptoms (EPS) & Emergencies

| Movement Disorder / Complication | Onset After Initiation | Clinical Features & Pathology | Evidence-Based Management |
| :--- | :--- | :--- | :--- |
| **Acute Dystonic Reaction** | **Hours to 4 Days** | Sudden, painful, sustained muscle spasms: **Torticollis** (neck twisting), **Oculogyric Crisis** (upward eye deviation), **Trismus**, and Opisthotonos. | **IM / IV Diphenhydramine (Antihistaminic/Anticholinergic)** OR **IM Benztropine** (immediate relief). |
| **Akathisia** | **Days to 4 Weeks** | Severe subjective inner restlessness with compelling urge to move constantly; pacing, inability to sit still, rocking. | **Beta-Blockers (Propranolol $40-80\\text{ mg/day}$)** 1st-line, or Benzodiazepines (Lorazepam), or Benztropine. |
| **Drug-Induced Parkinsonism** | **Weeks to 4 Months** | Cogwheel rigidity, resting tremor ("pill-rolling"), bradykinesia, masked facies, and shuffling gait. | **Anticholinergic agents (Benztropine, Trihexyphenidyl)** OR switch to atypical antipsychotic. |
| **Tardive Dyskinesia (TD)** | **Months to Years ($> 6\\text{ mo}$)** | Involuntary, repetitive, choreoathetoid movements of the face, tongue, and lips (**Orofacial Dyskinesia: lip smacking, tongue protrusion / "flycatcher tongue"**, grimacing). | **VMAT2 Inhibitors (Valbenazine, Deutetrabenazine)**; switch to **Clozapine** *(Anticholinergics worsen TD!)*. |
| **Clozapine Agranulocytosis** | Any time (highest 1st 6 mo) | Severe, fatal drop in **Absolute Neutrophil Count (ANC $< 500/\\mu\\text{L}$)**; requires mandatory weekly ANC blood monitoring. | Stop Clozapine immediately if $\\text{ANC} < 1000/\\mu\\text{L}$; GM-CSF support if severe. |
| **Neuroleptic Malignant Syndrome (NMS)** | Any time (days to weeks) | **Tetrad**: 1. **"Lead-Pipe" Muscle Rigidity**, 2. **Hyperthermia ($> 40^\\circ\\text{C} / 104^\\circ\\text{F}$)**, 3. **Autonomic Instability** (tachycardia, diaphoresis, labile BP), 4. **Altered Mental Status**; massive **Serum CK Elevation ($> 10,000\\text{ U/L}$)** and leukocytosis. | 1. Stop antipsychotic immediately.<br>2. Transfer to ICU for aggressive cooling.<br>3. **Dantrolene (Ryanodine receptor antagonist)** OR **Bromocriptine (Dopamine agonist)**. |
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male with acute psychosis is admitted and started on intramuscular Haloperidol 5 mg twice daily. On day 3 of admission, the nursing staff calls the on-call resident because the patient has developed sudden, painful backward arching of his neck (retrocollis), uncontrollable upward deviation of both eyes (oculogyric crisis), and difficulty speaking due to forced jaw opening. He is extremely distressed but fully alert and oriented. Vital signs are normal.",
      question: "What is the diagnosis, and what is the immediate first-line pharmacological treatment?",
      options: [
        "Acute Dystonic Reaction; Intravenous or Intramuscular Diphenhydramine (or Benztropine)",
        "Neuroleptic Malignant Syndrome; Intravenous Dantrolene",
        "Akathisia; Oral Propranolol",
        "Tardive Dyskinesia; Oral Valbenazine"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient developing acute, painful, involuntary muscle spasms of the neck (torticollis/retrocollis) and eyes (oculogyric crisis) within hours to days of starting a high-potency first-generation antipsychotic (Haloperidol) is experiencing an Acute Dystonic Reaction. Acute dystonia results from a sudden dopaminergic-cholinergic imbalance in the basal ganglia (dopamine D2 blockade producing excess acetylcholine activity). The immediate treatment of choice is an anticholinergic medication such as Intramuscular/Intravenous Diphenhydramine (50 mg) or Benztropine (1-2 mg), which provides rapid resolution within minutes."
    }
  ]
};
