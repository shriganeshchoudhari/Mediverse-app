/**
 * Clinical Psychiatry Advanced: Acute Psychiatric Emergencies & Tox-Syndromes
 * Authoritative psychiatric content derived from Kaplan & Sadock (10th ed.), Stahl's Psychopharmacology (5th ed.).
 * Mapped to NMC CBME Competencies: PS1.1, PS1.2, MD48.1, SU46.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PSYCHIATRIC_EMERGENCIES_TOX_SYNDROMES_MODULE: PhysiologyLessonModule = {
  id: "psychiatry-adv-emergencies-tox",
  unitCode: "PS1.1",
  title: "Acute Psychiatric Emergencies: Neuroleptic Malignant Syndrome (NMS), Serotonin Syndrome & Acute EPS",
  competencies: ["PS1.1", "PS1.2", "MD48.1", "SU46.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Acute Psychiatric Emergencies: NMS, Serotonin Syndrome & Acute EPS

Psychotropic drug toxicities present with life-threatening hyperthermia, autonomic storm, and neuromuscular dysfunction requiring rapid differential diagnosis.

---

## 1. Acute Psychotropic Tox-Syndromes Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Syndrome} & \\textbf{Primary Causative Agents} & \\textbf{Neuromuscular Findings} & \\textbf{Diagnostic Laboratory Markers} & \\textbf{Specific Pharmacotherapy} \\\\
\\hline
\\textbf{Neuroleptic} & \\mathbf{\\text{Dopamine (D2) antagonists}} & \\mathbf{\\text{\"Lead-Pipe\" rigidity,}} & \\mathbf{\\text{Massive elevated CK}} & \\mathbf{\\text{Dantrolene (ryanodine blocker)}} \\\\
\\textbf{Malignant (NMS)} & (\\text{Haloperidol, Fluphenazine}) & \\text{bradykinesia, hyporeflexia} & (\\mathbf{\\text{CK } \u003e 1{,}000 - 50{,}000\\text{ U/L}}) + \\text{ leukocytosis} & + \\mathbf{\\text{ Bromocriptine / Amantadine}} \\\\
\\textbf{Serotonin} & \\mathbf{\\text{Pro-serotonergic drugs}} & \\mathbf{\\text{Hyperreflexia, CLONUS}} & \\text{Mild CK elevation, metabolic acidosis,} & \\mathbf{\\text{Cyproheptadine (5-HT2A antagonist)}} \\\\
\\textbf{Syndrome (SS)} & (\\text{SSRIs, SNRIs, MAOIs, Linezolid}) & \\mathbf{(\\text{spontaneous, inducible, ocular}),} \\text{ tremor} & \\text{elevated transaminases} & + \\text{ IV Benzodiazepines (sedation)} \\\\
\\textbf{Anticholinergic} & \\text{TCAs, Diphenhydramine, Atropine,} & \\text{Normal reflexes, myoclonus,} & \\text{Normal CK; dry flushed skin, mydriasis,} & \\text{Physostigmine (AChE inhibitor)} \\\\
\\textbf{Toxicity} & \\text{Benztropine, Scopolamine} & \\text{urinary retention, delirium} & \\text{anhidrosis, absent bowel sounds} & (\\text{monitor ECG for QTc/bradycardia}) \\\\
\\textbf{Malignant} & \\text{Inhaled volatile anesthetics} & \\mathbf{\\text{Massive generalized rigidity,}} & \\mathbf{\\text{Massive CK elevation, hyperkalemia,}} & \\mathbf{\\text{Immediate IV Dantrolene}} \\\\
\\textbf{Hyperthermia} & (\\text{Halothane, Sevoflurane}) + \\text{ Succinylcholine} & \\text{masseter spasm, rhabdomyolysis} & \\text{mixed respiratory-metabolic acidosis} & (\\mathbf{2.5\\text{ mg/kg}}\\text{ push}) + \\text{ cooling} \\\\
\\hline
\\end{array}$$

---

## 2. Hunter Toxicity Criteria for Serotonin Syndrome vs NMS

- **Hunter Serotonin Toxicity Criteria** (Patient must take a serotonergic agent PLUS $\\ge 1$ of the following):
  1. **Spontaneous clonus**.
  2. **Inducible clonus** PLUS agitation or diaphoresis.
  3. **Ocular clonus** PLUS agitation or diaphoresis.
  4. **Tremor** PLUS hyperreflexia.
  5. **Hypertonia** PLUS temperature $>38^\circ\\text{C}$ PLUS ocular clonus or inducible clonus.
- **Key Clinical Rule**:
  - **NMS**: **HYPOREFLEXIA** with severe **LEAD-PIPE RIGIDITY** and **CK $>1{,}000 - 50{,}000\\text{ U/L}$**.
  - **Serotonin Syndrome**: **HYPERREFLEXIA** and **CLONUS (Spontaneous/Inducible/Ocular)** with lower CK elevation.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male with a history of major depressive disorder on daily Sertraline 150 mg is brought to the emergency room by his roommate due to sudden confusion, profuse sweating, and shivering. Two days ago, he was prescribed Linezolid 600 mg twice daily for a severe soft tissue MRSA infection. On physical examination, he is agitated, flushed, and diaphoretic. Vital signs: BP 168/98 mmHg, HR 128 bpm, RR 24/min, Temperature 39.1°C. Neurological examination reveals bilateral pupil dilation (mydriasis), hyperactive bowel sounds, continuous 4+ hyperreflexia in both lower extremities, and 8 beats of inducible bilateral ankle clonus along with rhythmic side-to-side ocular clonus.",
      question: "What is the diagnosis, what drug interaction caused this condition, and what is the specific pharmacological antidote?",
      options: [
        "Serotonin Syndrome; caused by drug interaction between Sertraline (SSRI) and Linezolid (which has non-selective MAO inhibitor activity); immediately discontinue both agents, administer IV Lorazepam for agitation, and give Cyproheptadine (5-HT2A antagonist)",
        "Neuroleptic Malignant Syndrome; administer IV Dantrolene and Bromocriptine",
        "Anticholinergic Toxicity; administer IV Physostigmine",
        "Malignant Hyperthermia; administer IV Dantrolene alone"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient satisfies the Hunter Serotonin Toxicity Criteria for Serotonin Syndrome: (1) Causative Interaction: Linezolid is an oxazolidinone antibiotic that exhibits potent, reversible monoamine oxidase (MAO) inhibition, which dramatically impairs serotonin degradation when co-administered with an SSRI (Sertraline), causing massive toxic accumulation of synaptic serotonin; (2) Clinical Presentation: Classic triad of mental status changes (agitation, confusion), autonomic hyperactivity (tachycardia, diaphoresis, hyperthermia, mydriasis, hyperactive bowel sounds), and neuromuscular hyperactivity (hyperreflexia, ocular clonus, inducible ankle clonus); (3) Management: Immediate cessation of all serotonergic drugs, aggressive supportive cooling, intravenous benzodiazepines (e.g., Lorazepam) to control agitation and muscle hyperactivity, and Cyproheptadine (a potent 5-HT2A receptor antagonist) as the specific antidote."
    }
  ]
};
