/**
 * Neurology: Demyelinating, Neuromuscular & Movement Disorders
 * Authoritative medical content derived from Adams and Victor's Principles of Neurology (12th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: NE1.5, NE1.6, PA39.1, PA39.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEMYELINATING_MOVEMENT_DISORDERS_MODULE: PhysiologyLessonModule = {
  id: "neurology-adv-demyelinating-movement-disorders",
  unitCode: "NE5.1",
  title: "Multiple Sclerosis, Guillain-Barré, Myasthenia Gravis, Parkinson & Huntington",
  competencies: ["NE1.5", "NE1.6", "PA39.1", "PA39.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Demyelinating, Neuromuscular Junction & Movement Disorders

This module encompasses autoimmune demyelinating syndromes of the central and peripheral nervous system, neuromuscular transmission defects, and basal ganglia neurodegenerations.

---

## 1. Multiple Sclerosis vs Guillain-Barré Syndrome (GBS)

$$\\begin{array}{lcc}
\\hline
\\textbf{Feature} & \\textbf{Multiple Sclerosis (MS)} & \\textbf{Guillain-Barr\u00e9 Syndrome (GBS - AIDP)} \\\\
\\hline
\\textbf{Target Pathology} & \\mathbf{\\text{CNS Oligodendrocyte Demyelination}} & \\mathbf{\\text{PNS Schwann Cell / Myelin Destruction}} \\\\
\\textbf{Trigger / Pathogenesis} & \\text{Autoimmune; separated in time \u0026 space} & \\mathbf{\\text{Post-Campylobacter jejuni / viral mimicry}} \\\\
\\textbf{Classic Clinical Signs} & \\mathbf{\\text{Optic Neuritis, Internuclear Ophthalmoplegia}} & \\mathbf{\\text{Ascending Flaccid Paralysis \u0026 Areflexia}} \\\\
& \\text{(INO: MLF lesion), Lhermitte, Uhthoff} & \\text{(Respiratory failure: monitor FVC/NIF)} \\\\
\\textbf{CSF Analysis} & \\mathbf{\\text{Oligoclonal IgG Bands \u0026 High IgG Index}} & \\mathbf{\\text{Albuminocytologic Dissociation}} \\\\
& & \\mathbf{(\\uparrow\\text{Protein }>100-300\\text{ mg/dL with NORMAL WBC})} \\\\
\\textbf{Acute Treatment} & \\text{IV High-Dose Methylprednisolone} & \\mathbf{\\text{IVIG or Plasma Exchange (Steroids INEFFECTIVE!)}} \\\\
\\hline
\\end{array}$$

- **Internuclear Ophthalmoplegia (INO)**: Lesion in the **Medial Longitudinal Fasciculus (MLF)** uncouples CN VI and CN III $\rightarrow$ during lateral horizontal gaze, the **ipsilateral eye fails to adduct**, while the **contralateral abducting eye develops horizontal nystagmus** (convergence is preserved).

---

## 2. Myasthenia Gravis vs Lambert-Eaton Myasthenic Syndrome (LEMS)

$$\\begin{array}{lcc}
\\hline
\\textbf{Diagnostic Feature} & \\textbf{Myasthenia Gravis (MG)} & \\textbf{Lambert-Eaton (LEMS)} \\\\
\\hline
\\textbf{Autoantibody Target} & \\mathbf{\\text{Postsynaptic Nicotinic ACh Receptors (AChR)}} & \\mathbf{\\text{Presynaptic P/Q Voltage-Gated Ca}^{2+}\\text{ Channels}} \\\\
\\textbf{Muscle Fatigability} & \\mathbf{\\text{Fatigable: WORSENS with repetitive use}} & \\mathbf{\\text{Facilitation: IMPROVES with repetitive use}} \\\\
\\textbf{Joint / Muscle Distribution} & \\text{Ocular (ptosis, diplopia), bulbar, proximal} & \\text{Proximal lower limb weakness, autonomic dry mouth} \\\\
\\textbf{Deep Tendon Reflexes} & \\text{Normal} & \\mathbf{\\text{Hyporeflexia / Absent Reflexes (return post-exercise)}} \\\\
\\textbf{Neoplastic Association} & \\mathbf{\\text{Thymoma (15\\%) \u0026 Thymic Hyperplasia (65\\%)}} & \\mathbf{\\text{Small Cell Lung Carcinoma (SCLC) (60\\%)}} \\\\
\\textbf{First-Line Pharmacotherapy} & \\mathbf{\\text{Pyridostigmine (Acetylcholinesterase Inh)}} & \\mathbf{3,4\\text{-Diaminopyridine (Amifampridine)}} \\\\
\\hline
\\end{array}$$

---

## 3. Movement Disorders: Parkinson Disease vs Huntington Disease

- **Parkinson Disease**:
  - Loss of dopaminergic neurons in **Substantia Nigra pars compacta** $\rightarrow$ **Lewy Bodies (cytoplasmic inclusions of aggregated $\\alpha$-synuclein)**.
  - **TRAP Tetrad**: **T**remor (resting 4-6 Hz 'pill-rolling'), **R**igidity (cogwheel), **A**kinesia / Bradykinesia, **P**ostural instability.
  - Pharmacotherapy: **Levodopa $+$ Carbidopa** (dopa-decarboxylase inhibitor that does not cross BBB).
- **Huntington Disease**:
  - Autosomal dominant **CAG trinucleotide repeat expansion in *HTT* gene on chromosome 4** with genetic anticipation.
  - Bilateral profound atrophy of the **Caudate Nucleus and Putamen (Striatum)** with marked enlargement of the frontal horns of the lateral ventricles.
  - Severe loss of **GABAergic and Cholinergic medium spiny neurons** $\rightarrow$ chorea, dementia, psychosis, depression.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with a 40-pack-year smoking history presents with progressive weakness in his hips and thighs making it difficult to rise from a chair. He notices that after walking for a few minutes, his leg strength actually improves and he feels stronger. He also reports dry mouth and erectile dysfunction. On examination, proximal lower extremity strength is 3/5 initially, but improves to 5/5 after 15 seconds of sustained maximal voluntary contraction. Deep tendon reflexes (patellar and Achilles) are absent at rest but reappear briskly following brief isometric muscle contraction.",
      question: "Which of the following autoantibodies and underlying malignancies is most strongly associated with this condition?",
      options: [
        "Antibodies against presynaptic P/Q-type voltage-gated calcium channels; Small Cell Lung Carcinoma",
        "Antibodies against postsynaptic acetylcholine receptors; Thymoma",
        "Antibodies against myelin basic protein; Primary CNS Lymphoma",
        "Antibodies against ganglioside GM1; Adenocarcinoma of the colon"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical presentation of Lambert-Eaton Myasthenic Syndrome (LEMS): proximal lower limb weakness that paradoxical IMPROVES with repetitive muscle use (post-exercise facilitation), absent deep tendon reflexes that return after brief contraction, and autonomic dysfunction (dry mouth, erectile dysfunction). LEMS is caused by pathogenic autoantibodies targeting presynaptic P/Q-type voltage-gated calcium channels (VGCC), blocking acetylcholine release into the synaptic cleft. It is a paraneoplastic syndrome in approximately 60% of cases, most commonly secondary to Small Cell Lung Carcinoma (SCLC)."
    }
  ]
};
