/**
 * Postgraduate Advanced Psychiatry: Treatment-Resistant Depression (TRD) & Interventional Neuromodulation
 * Authoritative neuropsychiatric content derived from APA TRD Guidelines, CANMAT Guidelines, PRIDE ECT Trial.
 * Mapped to NMC PG CBME Competencies: PG10.1, PSY1.1, PSY1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TREATMENT_RESISTANT_DEPRESSION_NEUROMODULATION_MODULE: PhysiologyLessonModule = {
  id: "pg10-treatment-resistant-depression-neuromodulation",
  unitCode: "PG10.1",
  title: "Treatment-Resistant Depression (TRD): Augmentation, ECT Seizure Titration, rTMS & Esketamine Protocols",
  competencies: ["PG10.1", "PSY1.1", "PSY1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Treatment-Resistant Depression (TRD) & Interventional Neuromodulation

Treatment-Resistant Depression represents severe clinical morbidity following the failure of $\\ge 2$ adequate trials of first-line antidepressants, requiring structured pharmacologic augmentation and interventional neurostimulation.

---

## 1. Diagnostic Criteria & Pharmacological Augmentation Strategies

$$\\begin{array}{lcccc}
\\hline
\\textbf{Augmentation Agent} & \\textbf{Target Dose / Serum Level} & \\textbf{Mechanism of Action} & \\textbf{Key Clinical Monitoring} \\\\
\\hline
\\textbf{Aripiprazole / Brexpiprazole} & 2-5\\text{ mg / } 1-3\\text{ mg daily} & \\text{D2 partial agonism + 5-HT1A agonism} & \\text{Akathisia, metabolic parameters} \\\\
\\textbf{Lithium Carbonate} & \\mathbf{0.6-0.8\\text{ mEq/L}} & \\text{Enhances central serotonergic transmission} & \\mathbf{\\text{Serum lithium, renal function, TSH}} \\\\
\\textbf{Thyroid Hormone } (T_3) & 25-50\\;\\mu\\text{g daily (Liothyronine)} & \\text{Upregulates cerebral cortical metabolic rate} & \\text{Free T4, TSH, cardiac arrhythmias} \\\\
\\textbf{Esketamine (Spravato)} & \\mathbf{56\\text{ mg / } 84\\text{ mg intranasal}} & \\mathbf{\\text{Non-competitive NMDA receptor antagonist}} & \\mathbf{2\\text{-hour post-dose REMS monitoring}} \\\\
& & & (\\text{sedation, dissociation, BP spikes}) \\\\
\\hline
\\end{array}$$

---

## 2. Interventional Neuromodulation: ECT & rTMS

$$\\begin{array}{lcccc}
\\hline
\\textbf{Modality / Technique} & \\textbf{Electrode / Coil Placement} & \\textbf{Mechanism \\& Parameters} & \\textbf{Primary Indications \\& Safety} \\\\
\\hline
\\textbf{Electroconvulsive Therapy (ECT)} & \\mathbf{\\text{Right Unilateral (RUL d'Elia)}} & \\text{Induced generalized seizure;} & \\mathbf{\\text{Acute suicidality, psychotic depression,}} \\\\
& \\text{vs } \\mathbf{\\text{Bilateral (Bitemporal)}} & \\text{motor } \\ge 15\\text{s, EEG } \\ge 25\\text{s} & \\mathbf{\\text{catatonia; Methohexital + Succinylcholine}} \\\\
\\textbf{High-Frequency rTMS} & \\mathbf{\\text{Left DLPFC (10 Hz)}} & \\text{Cortical LTP / neural circuit activation} & \\text{Non-invasive; seizure risk } < 0.1\\% \\\\
\\textbf{Low-Frequency rTMS} & \\mathbf{\\text{Right DLPFC (1 Hz)}} & \\text{Cortical LTD / inhibitory modulation} & \\text{Ideal for comorbid anxiety / panic} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old female presents with severe, unremitting major depressive disorder with psychotic features (delusions of guilt and worthlessness), active suicidal ideation with a plan, and profound psychomotor retardation with total food and water refusal for 4 days. She has previously failed full 8-week therapeutic trials of Sertraline (200 mg/day) and Venlafaxine XR (225 mg/day) with verified adherence. Vital signs: BP 95/60 mmHg, HR 108 bpm, dry mucous membranes, and mild prerenal azotemia on lab testing.",
      question: "What is the diagnosis, what is the most rapid and effective first-line interventional treatment, and what standard anesthesia regimen is administered?",
      options: [
        "Major Depressive Disorder with Psychotic Features meeting criteria for Treatment-Resistant Depression with life-threatening food refusal and acute suicidality; the most rapid, definitive, and life-saving intervention is Electroconvulsive Therapy (ECT) using bitemporal or high-dose right unilateral electrode placement, administered under general anesthesia with Methohexital (0.75-1.0 mg/kg) as the induction agent (to avoid elevating seizure threshold) and Succinylcholine (0.5-1.0 mg/kg) for complete neuromuscular relaxation to prevent musculoskeletal trauma",
        "Switch to oral Fluoxetine 20 mg monotherapy and wait 6 weeks for response",
        "Start high-dose oral Bupropion without hospital admission",
        "Administer oral St. John's Wort and schedule outpatient cognitive behavioral therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates severe psychotic depression with life-threatening inanition and suicidality: (1) Indication for ECT: ECT is gold standard for psychotic depression, severe suicidality, and acute starvation; (2) Anesthetic Standards: Methohexital is the gold-standard barbiturate induction agent because it has minimal anticonvulsant properties, while Succinylcholine prevents seizure-induced musculoskeletal fractures; (3) Rapid Efficacy: ECT achieves remission in >80-90% of psychotic depression cases."
    }
  ]
};
