/**
 * Clinical Neuroanatomy: Higher Cortical Syndromes, Aphasias & Visual Field Deficits
 * Authoritative medical content derived from Blumenfeld's Neuroanatomy through Clinical Cases, Adams and Victor's Neurology.
 * Mapped to NMC CBME Competencies: NE5.1, NE5.2, NE6.1, NE6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CORTICAL_SYNDROMES_APHASIAS_VISUAL_FIELDS_MODULE: PhysiologyLessonModule = {
  id: "neuroanatomy-cortical-syndromes-aphasias-visual-fields",
  unitCode: "NE5.1",
  title: "Aphasia Syndromes (Broca vs Wernicke vs Conduction), Gerstmann Syndrome & Visual Field Deficits",
  competencies: ["NE5.1", "NE5.2", "NE6.1", "NE6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Higher Cortical Syndromes, Aphasias & Visual Pathways

Lesions of the cerebral cortex, association bundles, and geniculocalcarine tracts produce distinctive clinical syndromes reflecting specialized hemispheric localization.

---

## 1. The Clinical Aphasia Diagnostic Matrix

$$\\begin{array}{lcccccl}
\\hline
\\textbf{Aphasia Type} & \\textbf{Fluency} & \\textbf{Comprehension} & \\textbf{Repetition} & \\textbf{Anatomical Lesion Site} & \\textbf{Associated Deficits} \\\\
\\hline
\\textbf{Broca Aphasia} & \\mathbf{\\text{Non-Fluent}} & \\mathbf{\\text{Intact}} & \\mathbf{\\text{Impaired}} & \\text{Left Inferior Frontal Gyrus} & \\text{Right hemiparesis (arm \u003e leg),} \\\\
\\text{(Motor / Expressive)} & \\text{(Telegraphic, effortful)} & & & \\text{(Brodmann area 44 / 45)} & \\text{patient frustrated \u0026 aware} \\\\
\\hline
\\textbf{Wernicke Aphasia} & \\mathbf{\\text{Fluent}} & \\mathbf{\\text{Impaired}} & \\mathbf{\\text{Impaired}} & \\text{Left Superior Temporal Gyrus} & \\text{Right upper quadrantanopia,} \\\\
\\text{(Sensory / Receptive)} & \\text{("Word salad", neologisms)} & & & \\text{(Brodmann area 22)} & \\text{patient unaware of deficit} \\\\
\\hline
\\textbf{Conduction Aphasia} & \\mathbf{\\text{Fluent}} & \\mathbf{\\text{Intact}} & \\mathbf{\\text{SEVERELY}} & \\text{Arcuate Fasciculus} & \\text{Phonemic paraphasic errors} \\\\
& & & \\mathbf{\\text{IMPAIRED}} & \\text{(connection between Broca \u0026 Wernicke)} & \\\\
\\hline
\\textbf{Global Aphasia} & \\mathbf{\\text{Non-Fluent}} & \\mathbf{\\text{Impaired}} & \\mathbf{\\text{Impaired}} & \\text{Large Left MCA Infarct} & \\text{Severe right hemiplegia} \\\\
& & & & \\text{(Broca + Wernicke + Arcuate)} & \\text{\u0026 hemisensory loss} \\\\
\\hline
\\textbf{Transcortical Motor} & \\text{Non-Fluent} & \\text{Intact} & \\mathbf{\\text{INTACT}} & \\text{Anterior Watershed (ACA-MCA)} & \\text{Preserved repetition!} \\\\
\\hline
\\textbf{Transcortical Sensory} & \\text{Fluent} & \\text{Impaired} & \\mathbf{\\text{INTACT}} & \\text{Posterior Watershed (MCA-PCA)} & \\text{Preserved repetition!} \\\\
\\hline
\\end{array}$$

---

## 2. Signature Cortical Syndromes: Gerstmann & Balint

- **Gerstmann Syndrome (Dominant Left Angular Gyrus / Inferior Parietal Lobule - Left MCA)**:
  1. **Agraphia**: Inability to communicate through writing.
  2. **Acalculia**: Inability to perform simple arithmetic calculations.
  3. **Finger Agnosia**: Inability to name, identify, or distinguish fingers on either hand.
  4. **Left-Right Disorientation**: Inability to distinguish the left from right side of the body.
- **Balint Syndrome (Bilateral Parieto-Occipital Lesions / Watershed Infarcts)**:
  1. **Optic Ataxia**: Impaired visual guidance of reaching and grasping movements.
  2. **Ocular Apraxia**: Inability to voluntarily guide saccadic eye movements to a visual target.
  3. **Simultanagnosia**: Inability to perceive more than one visual item at a time.

---

## 3. Visual Field Deficit Localizers

| Lesion Location in Visual Pathway | Resulting Visual Field Deficit | Common Clinical Etiology |
| :--- | :--- | :--- |
| **Optic Nerve** | **Monocular Blindness (Anopsia)** (complete ipsilateral visual loss) | Optic neuritis (MS), central retinal artery occlusion. |
| **Optic Chiasm** | **Bitemporal Hemianopia** (loss of peripheral visual fields bilaterally) | **Pituitary Adenoma**, Craniopharyngioma (compresses crossing nasal retinal fibers). |
| **Optic Tract** | **Contralateral Homonymous Hemianopia** | Anterior choroidal artery or PCA territory stroke. |
| **Meyer Loop (Temporal Lobe)** | **Contralateral Superior Homonymous Quadrantanopia ("Pie in the Sky")** | Temporal lobectomy, MCA inferior division stroke. |
| **Dorsal Baum Optic Radiation (Parietal Lobe)** | **Contralateral Inferior Homonymous Quadrantanopia ("Pie on the Floor")** | Parietal lobe stroke (MCA superior division). |
| **Primary Visual Cortex (Occipital Lobe)** | **Contralateral Homonymous Hemianopia WITH MACULAR SPARING** | **PCA Infarct** (macular region receives collateral flow from MCA!). |
`,
  clinicalVignettes: [
    {
      scenario: "A 52-year-old right-handed female presents after a left middle cerebral artery territory ischemic stroke. On bedside examination, she is unable to write her name or sentences (agraphia) despite having normal hand motor strength. She cannot perform simple subtraction (7 minus 3) and cannot identify which of her fingers is the ring finger versus the index finger (finger agnosia). When asked to touch her right ear with her left hand, she exhibits marked confusion between left and right.",
      question: "Which of the following cortical anatomical structures is injured in this patient?",
      options: [
        "Left Angular Gyrus / Inferior Parietal Lobule (Gerstmann Syndrome)",
        "Left Inferior Frontal Gyrus (Broca Area)",
        "Bilateral Parieto-Occipital Cortex (Balint Syndrome)",
        "Left Superior Temporal Gyrus (Wernicke Area)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic tetrad of Gerstmann Syndrome: (1) Agraphia (inability to write); (2) Acalculia (inability to do arithmetic); (3) Finger agnosia (inability to name/recognize fingers); and (4) Left-right disorientation. This syndrome localizes precisely to the dominant (usually left) Angular Gyrus and surrounding Inferior Parietal Lobule in the territory of the left Middle Cerebral Artery (MCA)."
    }
  ]
};
