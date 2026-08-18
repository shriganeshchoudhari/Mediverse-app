/**
 * Human Anatomy II: Cranial Nerves, Brainstem Nuclei & Stroke Syndromes
 * Authoritative gross anatomy & neuroanatomy content derived from Gray's Anatomy (42nd ed.), Moore's.
 * Mapped to NMC CBME Competencies: AN26.1, AN26.2, SU18.1, ENT1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CRANIAL_NERVES_BRAINSTEM_SYNDROMES_MODULE: PhysiologyLessonModule = {
  id: "anatomy2-cranial-nerves-brainstem-syndromes",
  unitCode: "AN26.1",
  title: "Cranial Nerves (I-XII) & Brainstem Stroke Syndromes: Wallenberg (PICA), Weber (PCA) & Dejerine (ASA)",
  competencies: ["AN26.1", "AN26.2", "SU18.1", "ENT1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Cranial Nerves & Brainstem Syndromes: Wallenberg, Weber & Dejerine

Precise localization of brainstem stroke syndromes requires anatomical mastery of cranial nerve nuclei functional columns, long tract cross-sections, and vascular territories.

---

## 1. Classical Brainstem Stroke Syndromes Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Syndrome} & \\textbf{Occluded Artery} & \\textbf{Involved Cranial Nerve / Nucleus} & \\textbf{Ipsilateral Signs} & \\textbf{Contralateral Signs} \\\\
\\hline
\\textbf{Lateral Medullary} & \\mathbf{\\text{PICA / Vertebral}} & \\mathbf{\\text{Nucleus Ambiguus (CN IX/X),}} & \\mathbf{\\text{Loss of gag, dysphagia, dysarthria,}} & \\mathbf{\\text{Loss of pain / temp on body}} \\\\
(\\textbf{Wallenberg}) & (\\text{Posterior Inferior Cerebellar}) & \\text{Spinal trigeminal (V), Vestibular} & \\mathbf{\\text{Horner syndrome, facial pain/temp loss}} & (\\text{spinothalamic tract}) \\\\
\\textbf{Medial Medullary} & \\mathbf{\\text{Anterior Spinal (ASA)}} & \\mathbf{\\text{Hypoglossal Nucleus (CN XII)}} & \\mathbf{\\text{Tongue deviates IPSILATERALLY}} & \\mathbf{\\text{Contralateral hemiparesis}} \\\\
(\\textbf{Dejerine}) & (\\text{paramedian branches}) & & (\\text{lower motor neuron XII palsy}) & + \\text{ loss of vibration/proprioception} \\\\
\\textbf{Weber Syndrome} & \\mathbf{\\text{Posterior Cerebral (PCA)}} & \\mathbf{\\text{Oculomotor Nerve (CN III)}} & \\mathbf{\\text{Ptosis, dilated fixed pupil,}} & \\mathbf{\\text{Contralateral spastic hemiplegia}} \\\\
(\\text{Medial Midbrain}) & (\\text{paramedian mesencephalic}) & + \\text{ Cerebral Peduncle (corticospinal)} & \\mathbf{\\text{\"down and out\" ocular deviation}} & (\\text{corticospinal tract}) \\\\
\\textbf{Lateral Pontine} & \\mathbf{\\text{AICA}} & \\mathbf{\\text{Facial Nucleus (CN VII),}} & \\mathbf{\\text{Facial droop (LMN VII), hearing loss,}} & \\mathbf{\\text{Loss of pain / temp on body}} \\\\
(\\text{Marie-Foix}) & (\\text{Anterior Inferior Cerebellar}) & \\text{Cochlear/Vestibular (VIII), Spinal V} & \\text{vertigo, Horner syndrome, ataxia} & (\\text{spinothalamic tract}) \\\\
\\hline
\\end{array}$$

---

## 2. Functional Columns of Cranial Nerve Nuclei

- **General Somatic Efferent (GSE)**: Extraocular and tongue skeletal muscles (**CN III, IV, VI, XII**).
- **Special Visceral Efferent (SVE / Branchial Motor)**: Muscles derived from pharyngeal arches:
  - Arch 1: Mastication, mylohyoid, tensor tympani (**CN V3**).
  - Arch 2: Facial expression, stapedius, stylohyoid (**CN VII**).
  - Arch 3: Stylopharyngeus (**CN IX**).
  - Arches 4 & 6: Larynx and pharynx via **Nucleus Ambiguus** (**CN X, XI**).
- **General Visceral Efferent (GVE / Parasympathetic)**:
  - **Edinger-Westphal Nucleus** (**CN III** $\\rightarrow$ pupillary sphincter, ciliary muscle).
  - **Superior Salivatory Nucleus** (**CN VII** $\\rightarrow$ lacrimal, submandibular, sublingual glands).
  - **Inferior Salivatory Nucleus** (**CN IX** $\\rightarrow$ otic ganglion $\\rightarrow$ parotid gland).
  - **Dorsal Motor Nucleus of Vagus** (**CN X** $\\rightarrow$ thoracic and abdominal viscera).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with long-standing hypertension presents with sudden onset of severe spinning vertigo, nausea, difficulty swallowing, and hoarseness. On neurological examination, he has absent gag reflex on the right, uvula deviating to the left, right-sided Horner syndrome (partial ptosis, miosis, anhidrosis), ataxia with falling toward the right, and loss of pain and temperature sensation over the right face and left arm, torso, and leg. Motor strength in all four limbs is completely preserved (5/5).",
      question: "What is the diagnosis, which cranial nerve nucleus lesion explains the dysphagia/hoarseness, and which vascular territory is occluded?",
      options: [
        "Lateral Medullary (Wallenberg) Syndrome caused by occlusion of the Posterior Inferior Cerebellar Artery (PICA) or Vertebral Artery; dysphagia and hoarseness are caused by infarction of the Nucleus Ambiguus (CN IX and X branchial motor fibers)",
        "Medial Medullary (Dejerine) Syndrome; Anterior Spinal Artery occlusion",
        "Weber Syndrome; Posterior Cerebral Artery occlusion",
        "Lateral Pontine Syndrome; Basilar Artery apex aneurysm"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic constellation of Lateral Medullary (Wallenberg) Syndrome: (1) Vascular Territory: Occlusion of the Posterior Inferior Cerebellar Artery (PICA) or Vertebral Artery; (2) Key Lesioned Structures: (a) Nucleus Ambiguus (CN IX and X) causes loss of gag reflex, dysphagia, hoarseness, and vocal cord paralysis; (b) Spinal Trigeminal Nucleus causes ipsilateral facial sensory loss (pain/temperature); (c) Spinothalamic Tract causes contralateral body sensory loss (pain/temperature); (d) Descending Sympathetic Tract causes ipsilateral Horner syndrome; (e) Inferior Cerebellar Peduncle and Vestibular Nuclei cause vertigo, nystagmus, and ipsilateral limb ataxia; (3) Motor Sparing: The corticospinal tract and medial lemniscus are located medially and thus spared."
    }
  ]
};
