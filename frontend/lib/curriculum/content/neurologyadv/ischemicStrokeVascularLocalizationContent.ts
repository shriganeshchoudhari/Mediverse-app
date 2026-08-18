/**
 * Neurology: Acute Ischemic Stroke Syndromes & Vascular Neuro-Localization
 * Authoritative medical content derived from Adams and Victor's Principles of Neurology (12th ed.), Harrison's Principles of Internal Medicine.
 * Mapped to NMC CBME Competencies: NE1.1, NE1.2, PA37.1, PA37.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ISCHEMIC_STROKE_VASCULAR_LOCALIZATION_MODULE: PhysiologyLessonModule = {
  id: "neurology-adv-ischemic-stroke-vascular-localization",
  unitCode: "NE1.1",
  title: "Acute Ischemic Stroke Syndromes, Aphasias & Brainstem Vascular Neuro-Localization",
  competencies: ["NE1.1", "NE1.2", "PA37.1", "PA37.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Acute Ischemic Stroke Syndromes & Vascular Localization

Stroke localization relies on mapped vascular territories of the cerebral hemispheres and the distinct alternating deficits of brainstem infarctions.

---

## 1. Cerebral Hemispheric Vascular Syndromes

$$\\begin{array}{lcccc}
\\hline
\\textbf{Vascular Territory} & \\textbf{Motor Deficit} & \\textbf{Sensory Deficit} & \\textbf{Visual Field} & \\textbf{Cortical Signs} \\\\
\\hline
\\textbf{MCA (Main Stem)} & \\mathbf{\\text{Contralateral Face \u0026 Arm }>\\text{ Leg}} & \\text{Contralateral Face/Arm} & \\text{Homonymous Hemianopia} & \\mathbf{\\text{Aphasia (Dominant) / Neglect (Non-Dom)}} \\\\
\\textbf{ACA (Anterior Cerebral)} & \\mathbf{\\text{Contralateral Leg \u0026 Foot }>\\text{ Arm}} & \\text{Contralateral Leg/Foot} & \\text{Normal} & \\mathbf{\\text{Urinary Incontinence, Abulia, Grasp Reflex}} \\\\
\\textbf{PCA (Posterior Cerebral)} & \\text{Minimal / None} & \\text{Contralateral Hemi-sensory} & \\mathbf{\\text{Hemianopia with MACULAR SPARING}} & \\mathbf{\\text{Alexia without Agraphia (Splenium)}} \\\\
\\hline
\\end{array}$$

- **Cortical Aphasia Localization**:
  - **Broca Aphasia (Superior MCA)**: Inferior frontal gyrus (Brodmann 44/45); **Non-fluent, intact comprehension, impaired repetition**.
  - **Wernicke Aphasia (Inferior MCA)**: Superior temporal gyrus (Brodmann 22); **Fluent ('word salad'), impaired comprehension, impaired repetition**.
  - **Conduction Aphasia**: Damage to **Arcuate Fasciculus**; **Fluent, intact comprehension, SEVERELY IMPAIRED REPETITION**.
  - **Global Aphasia**: Mainstem MCA occlusion; **Non-fluent, impaired comprehension, impaired repetition**.

---

## 2. Brainstem Stroke Syndromes (Alternating Hemiplegias)

$$\\begin{array}{lccc}
\\hline
\\textbf{Syndrome} & \\textbf{Artery Involved} & \\textbf{Ipsilateral Cranial / Cerebellar Deficits} & \\textbf{Contralateral Long Tract Deficits} \\\\
\\hline
\\textbf{Lateral Medullary (Wallenberg)} & \\mathbf{\\text{PICA (Post. Inf. Cerebellar)}} & \\mathbf{\\text{CN IX, X (Dysphagia, Hoarseness, Gag Loss),}} & \\mathbf{\\text{Spinothalamic (Pain \u0026 Temp on Body)}} \\\\
& & \\text{Horner (Ptosis/Miosis), Ataxia, Facial Pain/Temp} & \\mathbf{\\text{(Motor Strength is STRICTLY SPARED!)}} \\\\
\\textbf{Lateral Pontine Syndrome} & \\mathbf{\\text{AICA (Ant. Inf. Cerebellar)}} & \\mathbf{\\text{CN VII (Facial Droop, Loss of Taste, Hyperacusis),}} & \\text{Spinothalamic (Pain \u0026 Temp on Body)} \\\\
& & \\text{CN VIII (Hearing Loss, Vertigo), Horner, Ataxia} & \\\\
\\textbf{Medial Medullary Syndrome} & \\mathbf{\\text{Anterior Spinal Artery (ASA)}} & \\mathbf{\\text{CN XII (Tongue deviates TOWARD lesion side)}} & \\mathbf{\\text{Corticospinal (Hemiparesis) \u0026 Medial Lemniscus}} \\\\
\\textbf{Weber Syndrome (Midbrain)} & \\mathbf{\\text{Paramedian Branches (PCA/Basilar)}} & \\mathbf{\\text{CN III (Down-\u0026-Out, Ptosis, Dilated Pupil)}} & \\mathbf{\\text{Corticospinal (Contralateral Hemiparesis)}} \\\\
\\hline
\\end{array}$$

- **The Rule of 4 for Brainstem Localization**:
  - Medial syndromes involve the **Motor pathway** (Corticospinal), **Medial lemniscus** (Proprioception), **Medial longitudinal fasciculus** (MLF), and **Motor cranial nerve nuclei** (CN III, IV, VI, XII - factors of 12 except 1 and 2).
  - Lateral syndromes involve the **Spinothalamic tract** (Pain/Temp), **Spinocerebellar tract** (Ataxia), **Sympathetic tract** (Horner), and **Sensory cranial nerve nuclei** (CN V, VII, VIII, IX, X).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with long-standing hypertension presents with sudden onset of severe vertigo, difficulty swallowing, hoarseness, and unsteadiness while walking. Neurological examination demonstrates: difficulty swallowing liquids with an absent right gag reflex; right-sided ptosis, miosis, and anhidrosis; right-sided limb dysmetria and ataxia; decreased pinprick and temperature sensation over the right face and left arm, trunk, and leg. Motor strength is 5/5 in all four extremities bilaterally with normal symmetrical reflexes.",
      question: "Which of the following blood vessels is acutely occluded, and which brainstem structure's ischemia explains the patient's dysphagia and hoarseness?",
      options: [
        "Right Posterior Inferior Cerebellar Artery (PICA); Nucleus Ambiguus in the lateral medulla",
        "Right Anterior Inferior Cerebellar Artery (AICA); Facial Motor Nucleus in the lateral pons",
        "Left Anterior Spinal Artery (ASA); Pyramidal tract in the medial medulla",
        "Right Posterior Cerebral Artery (PCA); Nucleus Cuneatus in the dorsal medulla"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical syndrome of Lateral Medullary (Wallenberg) Syndrome caused by occlusion of the Posterior Inferior Cerebellar Artery (PICA) or vertebral artery. The diagnostic hallmarks are: (1) Nucleus Ambiguus involvement (CN IX and X) causing dysphagia, hoarseness, and loss of gag reflex; (2) Ipsilateral Horner syndrome (descending sympathetics); (3) Ipsilateral limb ataxia (inferior cerebellar peduncle); (4) Crossed sensory deficit with loss of pain/temp on the ipsilateral face (spinal trigeminal tract) and contralateral body (spinothalamic tract); and (5) Preserved motor strength (pyramids in the medial medulla are spared)."
    }
  ]
};
