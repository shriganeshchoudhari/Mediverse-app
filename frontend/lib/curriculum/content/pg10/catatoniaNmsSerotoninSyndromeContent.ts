/**
 * Postgraduate Advanced Psychiatry: Catatonia, Neuroleptic Malignant Syndrome & Serotonin Syndrome
 * Authoritative neuropsychiatric content derived from Bush-Francis Guidelines, DSM-5-TR, Hunter Serotonin Toxicity Criteria.
 * Mapped to NMC PG CBME Competencies: PG10.2, PSY2.1, PSY2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CATATONIA_NMS_SEROTONIN_SYNDROME_MODULE: PhysiologyLessonModule = {
  id: "pg10-catatonia-nms-serotonin-syndrome",
  unitCode: "PG10.2",
  title: "Catatonia, Neuroleptic Malignant Syndrome (NMS) & Serotonin Syndrome: Diagnostic Differentiation & Protocols",
  competencies: ["PG10.2", "PSY2.1", "PSY2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Catatonia, Neuroleptic Malignant Syndrome (NMS) & Serotonin Syndrome

Neuropsychiatric emergencies involving altered mental status, severe neuromuscular dysfunction, and autonomic instability require rapid differentiation to prevent fatal hyperthermic and rhabdomyolytic collapse.

---

## 1. Bush-Francis Catatonia & The Lorazepam Challenge

- **Clinical Features of Catatonia**:
  - Immobility/Stupor, Mutism, Waxy Flexibility (*cerea flexibilitas*), Catalepsy, Posturing, Negativism, Stereotypy, Echolalia/Echopraxia.
- **Lorazepam Challenge Protocol**:
  - Administer **$1-2\\text{ mg}$ IV Lorazepam** slowly over 2 minutes.
  - Re-evaluate at 15-30 minutes: **$\\ge 50\\%$ reduction in Bush-Francis Catatonia Rating Scale (BFCRS)** confirms catatonia and guides scheduled high-dose oral/IV lorazepam ($8-16\\text{ mg/day}$) or emergency ECT for malignant catatonia.

---

## 2. NMS vs Serotonin Syndrome: Critical Diagnostic & Therapeutic Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Neuroleptic Malignant Syndrome (NMS)} & \\textbf{Serotonin Syndrome (SS)} \\\\
\\hline
\\textbf{Triggering Agents} & \\mathbf{\\text{Dopamine D2 antagonists (antipsychotics)}} & \\mathbf{\\text{Serotonergic agents (SSRIs, SNRIs, MAOIs)}} \\\\
\\textbf{Onset Velocity} & \\text{Subacute (1-3 days to weeks)} & \\mathbf{\\text{Rapid / Acute (within hours)}} \\\\
\\textbf{Neuromuscular Exam} & \\mathbf{\\text{''Lead-Pipe'' Rigidity; Hypo-reflexia}} & \\mathbf{\\text{Hyperreflexia, Spontaneous / Ocular Clonus}} \\\\
\\textbf{Pupils \\& Bowel} & \\text{Normal pupils; normal bowel sounds} & \\mathbf{\\text{Mydriasis; Hyperactive bowel sounds / diarrhea}} \\\\
\\textbf{Laboratory Serum CK} & \\mathbf{\\text{Massively Elevated (CK } > 1,000-100,000\\text{ U/L)}} & \\text{Normal to mildly elevated CK} \\\\
\\textbf{Specific Pharmacotherapy} & \\mathbf{\\text{Dantrolene (1-2.5 mg/kg IV) + Bromocriptine}} & \\mathbf{\\text{Cyproheptadine (12 mg PO load, then 2 mg Q2H)}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male with bipolar disorder is brought to the emergency department by family after becoming progressively unresponsive over 48 hours following a recent dosage increase of Haloperidol to 20 mg daily. On examination, he is stuporous, mute, and intensely diaphoretic. Vital signs: Temperature 39.8 C (103.6 F), BP 178/104 mmHg, HR 128 bpm, RR 26/min. Neurological examination reveals extreme, diffuse 'lead-pipe' muscle rigidity in all four extremities and hyporeflexia. Laboratory investigations demonstrate: WBC 18,500/uL, Serum Creatine Kinase (CK) 38,400 U/L, Serum Creatinine 2.4 mg/dL (baseline 0.9 mg/dL), and urine positive for myoglobin.",
      question: "What is the diagnosis, what is the immediate medical resuscitation sequence, and what specific antidotes are indicated?",
      options: [
        "Neuroleptic Malignant Syndrome (NMS) complicated by acute rhabdomyolysis and acute kidney injury; immediately discontinue Haloperidol, initiate aggressive IV isotonic crystalloid hydration (targeting urine output >= 200 mL/hr) and active external cooling, and administer Dantrolene (1-2.5 mg/kg IV) to relax skeletal muscle and reduce heat production along with Bromocriptine (2.5-5 mg PO/NG Q8H) or Amantadine to restore central dopaminergic tone",
        "Serotonin Syndrome; administer high-dose Cyproheptadine and IV Fentanyl",
        "Catatonic depression; administer oral Fluoxetine and discharge home",
        "Bacterial meningitis; start IV Ceftriaxone without stopping Haloperidol"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Neuroleptic Malignant Syndrome: (1) Pathognomonic Tetrad: Hyperthermia (39.8 C), lead-pipe rigidity, autonomic instability (hypertension/tachycardia), and altered mental status following D2 blockade; (2) Laboratory Hallmarks: Massive CK elevation (38,400 U/L) and rhabdomyolytic acute kidney injury; (3) Management: Immediate offending drug cessation, aggressive hydration for myoglobinuria, and targeted pharmacotherapy with Dantrolene (ryanodine antagonist) and Bromocriptine (dopamine agonist)."
    }
  ]
};
