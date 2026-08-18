/**
 * Internship Core Clinical Postings: Emergency Psychiatry & Neuroleptic Malignant Syndrome (NMS & Agitation)
 * Authoritative psychiatry content derived from Kaplan & Sadock's Psychiatry, DSM-5-TR Clinical Practice.
 * Mapped to NMC CBME Competencies: IN7.2, PS3.1, PS4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const EMERGENCY_PSYCHIATRY_NMS_SEROTONIN_MODULE: PhysiologyLessonModule = {
  id: "int7-emergency-psychiatry-nms-serotonin",
  unitCode: "IN7.2",
  title: "Emergency Psychiatry: Neuroleptic Malignant Syndrome (NMS vs Serotonin Syndrome), Acute Agitation & Rapid Tranquilization",
  competencies: ["IN7.2", "PS3.1", "PS4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Emergency Psychiatry: NMS vs Serotonin Syndrome & Rapid Tranquilization

Differentiating dopamine-receptor blockade emergencies from serotonin toxicity dictates antidote administration, rhabdomyolysis prevention, and safe pharmacological restraint.

---

## 1. Neuroleptic Malignant Syndrome (NMS) vs Serotonin Syndrome (SS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Neuroleptic Malignant Syndrome (NMS)} & \\textbf{Serotonin Syndrome (SS)} \\\\
\\hline
\\textbf{Primary Trigger} & \\mathbf{\\text{Dopamine } D_2\\text{ Receptor Antagonists (Haloperidol,}} & \\mathbf{\\text{Serotonergic Agents (SSRIs, SNRIs, MAOIs,}} \\\\
& \\text{Fluphenazine, Risperidone) or } L\\text{-Dopa withdrawal} & \\text{Tramadol, Linezolid, MDMA / Ecstasy)} \\\\
\\textbf{Neuromuscular Signs} & \\mathbf{\\text{Severe \"Lead-Pipe\" Muscle Rigidity, bradyreflexia}} & \\mathbf{\\text{Neuromuscular Hyperreflexia, Clonus, Tremor}} \\\\
& \\text{cogwheel rigidity, akinesia} & (\\mathbf{\\text{Spontaneous, inducible, or ocular clonus}}) \\\\
\\textbf{Thermoregulation} & \\mathbf{\\text{Severe Hyperthermia (often } > 38.5-40^{\\circ}\\text{C)}} & \\text{Hyperthermia (often moderate, severe in toxicity)} \\\\
\\textbf{Autonomic Status} & \\text{Labile blood pressure, severe diaphoresis, tachycardia} & \\text{Tachycardia, diaphoresis, mydriasis, hyperactive bowel} \\\\
\\textbf{Creatine Kinase (CK)} & \\mathbf{\\text{Markedly Elevated (CK } > 1{,}000-50{,}000\\text{ IU/L)}} & \\text{Mildly elevated or normal} \\\\
\\textbf{First-Line Antidote} & \\mathbf{\\text{Dantrolene (} 1-2.5\\text{ mg/kg IV) + Bromocriptine}} & \\mathbf{\\text{Cyproheptadine (} 12\\text{ mg PO load } \\rightarrow 2\\text{ mg q2h)}} \\\\
\\hline
\\end{array}$$

---

## 2. Acute Psychiatric Agitation: Rapid Tranquilization Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Regimen Component} & \\textbf{Specific Pharmacotherapy} & \\textbf{Mechanism / Clinical Rationale} \\\\
\\hline
\\textbf{First-Line Antipsychotic} & \\mathbf{\\text{Haloperidol (5 mg IM)}} & \\text{High-potency } D_2\\text{ blockade for rapid behavioral sedation} \\\\
\\textbf{First-Line Benzodiazepine} & \\mathbf{\\text{Lorazepam (2 mg IM)}} & \\text{GABA-A positive allosteric modulator for anxiolysis} \\\\
\\textbf{Anticholinergic / Antihistamine} & \\mathbf{\\text{Promethazine (25-50 mg IM)}} & \\mathbf{\\text{Prevents acute extrapyramidal dystonic reactions}} \\\\
& (\\text{or Diphenhydramine } 50\\text{ mg IM}) & \\text{and adds synergistic sedation (\"B52 Regimen\")} \\\\
\\hline
\\end{array}$$

---

## 3. Columbia-Suicide Severity Rating Scale (C-SSRS) Triage

- **High-Risk Active Suicidal Ideation**:
  - Active ideation with specific plan and intent, prior suicide attempts, access to lethal means $\rightarrow$ **1-to-1 constant visual observation** and inpatient psychiatric admission.
`,
  clinicalVignettes: [
    {
      scenario: "A 29-year-old male with treatment-resistant schizophrenia is brought to the emergency department from an inpatient psychiatric facility. He was started on high-dose intramuscular Haloperidol 4 days ago. On examination, the patient is obtunded, diaphoretic, and exhibits generalized, severe 'lead-pipe' muscle rigidity throughout all four extremities with hyporeflexia. His vital signs reveal: Temperature 39.8°C (103.6°F), Heart rate 134 bpm, Blood pressure fluctuating between 178/104 mmHg and 110/60 mmHg. Laboratory evaluation reveals: Serum Creatine Kinase (CK) 24,500 IU/L, Total WBC count 18,200/uL, and urinalysis positive for myoglobinuria.",
      question: "What is the diagnosis, and what is the definitive emergency pharmacological and resuscitation management?",
      options: [
        "Neuroleptic Malignant Syndrome (NMS; severe lead-pipe rigidity, hyperthermia, autonomic instability, and massive CK elevation secondary to dopamine D2 blockade); immediate management requires immediate discontinuation of Haloperidol, aggressive external physical cooling, aggressive IV isotonic fluid hydration to prevent myoglobinuric acute tubular necrosis, and administration of IV Dantrolene (ryanodine calcium channel blocker) PLUS oral Bromocriptine (dopamine agonist)",
        "Serotonin syndrome; administer oral cyproheptadine and increase haloperidol dose",
        "Acute catatonia; administer electroconvulsive therapy without fluid resuscitation",
        "Simple medication-induced dystonia; prescribe oral diphenhydramine and discharge"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates severe Neuroleptic Malignant Syndrome (NMS): (1) Clinical Hallmarks: Severe 'lead-pipe' muscle rigidity, malignant hyperthermia (39.8°C), autonomic instability, altered sensorium, and massive CK elevation (24,500 IU/L) following high-potency neuroleptic therapy (Haloperidol); (2) Differential: Serotonin syndrome features hyperreflexia and clonus rather than lead-pipe rigidity; (3) Management Triad: Immediate haloperidol cessation, aggressive IV hydration for rhabdomyolysis-induced ATN prevention, and specific pharmacotherapy with IV Dantrolene (blocks skeletal muscle calcium release) and oral Bromocriptine (restores central dopaminergic tone)."
    }
  ]
};
