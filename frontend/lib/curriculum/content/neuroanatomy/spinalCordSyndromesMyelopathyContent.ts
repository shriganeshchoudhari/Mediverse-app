/**
 * Clinical Neuroanatomy: Spinal Cord Syndromes & Myelopathies
 * Authoritative medical content derived from Blumenfeld's Neuroanatomy through Clinical Cases, Adams and Victor's Neurology.
 * Mapped to NMC CBME Competencies: NE3.1, NE3.2, NE4.1, NE4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPINAL_CORD_SYNDROMES_MYELOPATHY_MODULE: PhysiologyLessonModule = {
  id: "neuroanatomy-spinal-cord-syndromes-myelopathy",
  unitCode: "NE3.1",
  title: "Spinal Cord Syndromes: Brown-Séquard, Anterior Spinal Artery, Syringomyelia (Cape-like) & SCD (B12)",
  competencies: ["NE3.1", "NE3.2", "NE4.1", "NE4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Spinal Cord Syndromes & Localization Myelopathies

Spinal cord lesions produce characteristic neurological deficits determined by the precise spatial somatotopy of ascending sensory tracts and descending motor pathways.

---

## 1. Cardinal Spinal Cord Syndromes Matrix

| Syndrome Name \u0026 Etiology | Neural Pathways Damaged | Motor Deficits | Sensory Deficits | Spared Modalities \u0026 Key Pearls |
| :--- | :--- | :--- | :--- | :--- |
| **Brown-Séquard Syndrome**<br>*(Spinal Hemicord Lesion, e.g. stab wound, tumor)* | 1. Ipsilateral Corticospinal tract<br>2. Ipsilateral Dorsal Columns<br>3. Decussated Spinothalamic tract | • **Ipsilateral Spastic Paresis below the lesion**.<br>• Ipsilateral LMN flaccid weakness at the level. | • **Ipsilateral Loss of Vibration \u0026 Joint Position Sense below lesion**.<br>• **Contralateral Loss of Pain \u0026 Temperature $1-2\\text{ levels}$ below lesion**.<br>• Ipsilateral anesthesia at the level. | Classical dissociated sensory loss (contralateral pain/temp vs ipsilateral proprioception/vibration). |
| **Anterior Spinal Artery (ASA) Syndrome**<br>*(Anterior Cord Infarct / Aortic surgery)* | Infarct of anterior $2/3$ of spinal cord: bilateral corticospinal tracts, lateral spinothalamic tracts, autonomic fibers | • **Bilateral Spastic Paraplegia / Quadriplegia below lesion**.<br>• Acute flaccid spinal shock at onset. | • **Bilateral Loss of Pain and Temperature below lesion**.<br>• Autonomic bowel/bladder dysfunction. | **POSTERIOR DORSAL COLUMNS REMAIN FULLY PRESERVED!** Vibration, fine touch, and 2-point discrimination are intact. |
| **Central Cord Syndrome / Syringomyelia**<br>*(Chiari I malformation, post-trauma syrinx)* | Cavitation (syrinx) expanding from central canal, compressing **Anterior White Commissure** | Upper extremity weakness $>$ lower extremity weakness (cervical somatotopy). | • **Bilateral "Cape-Like" Loss of Pain and Temperature across shoulders, arms, and upper chest**.<br>• Spares light touch and proprioception. | Spinothalamic second-order fibers decussate in the anterior white commissure, making them vulnerable to syrinx compression. |
| **Subacute Combined Degeneration (SCD)**<br>*(Vitamin $\\text{B}_{12}$ Deficiency)* | Demyelination of: 1. **Dorsal Columns**, 2. **Lateral Corticospinal tracts**, 3. **Spinocerebellar tracts** | Bilateral spasticity, weakness, hyperreflexia, positive Babinski signs. | • **Bilateral loss of vibration and joint position sense**.<br>• **Sensory Ataxia with Positive Romberg Sign**.<br>• Symmetrical stocking-glove paresthesias. | Methylmalonic acid accumulation causes defective myelin synthesis; anemia may be absent! |
| **Tabes Dorsalis**<br>*(Tertiary Neurosyphilis)* | Demyelination of dorsal roots and posterior dorsal columns | Loss of deep tendon reflexes, hypotonia. | • Severe sensory ataxia (high-stepping "slapping" gait).<br>• **Lancinating "lightning" pains**.<br>• Loss of vibration and proprioception. | **Argyll Robertson Pupils** (constrict to accommodation, but do not react to light). |

---

## 2. Somatotopic Tract Anatomy of the Spinal Cord

- **Dorsal Column-Medial Lemniscal (DCML)**: Fasciculus gracilis (medial, legs) and cuneatus (lateral, arms) $\rightarrow$ ipsilateral ascend to nucleus gracilis/cuneatus in medulla $\rightarrow$ internal arcuate fibers decussate to medial lemniscus.
- **Lateral Corticospinal Tract**: Decussates at medullary pyramids ($85-90\\%$) $\rightarrow$ descends in lateral funiculus (cervical medial, sacral lateral) $\rightarrow$ synapses on anterior horn alpha motor neurons.
- **Lateral Spinothalamic Tract**: First-order fibers enter Lissauer tract $\rightarrow$ synapse in substantia gelatinosa $\rightarrow$ **second-order fibers decussate in Anterior White Commissure $1-2\\text{ segments}$ above** $\rightarrow$ ascend to VPL nucleus of thalamus.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female presents with a 6-month history of painless burns on her hands and shoulders that occurred while cooking. Physical examination demonstrates bilateral loss of pain and temperature sensation in a 'cape-like' distribution over the neck, shoulders, and upper extremities extending to the level of T4. Sensation to light touch, two-point discrimination, and vibration are completely preserved throughout. Reflexes are 1+ in the upper extremities and 2+ in the lower extremities.",
      question: "Which of the following neural structures is primarily damaged by this pathological lesion?",
      options: [
        "Anterior White Commissure of the cervical spinal cord (Syringomyelia)",
        "Dorsal Columns of the thoracic spinal cord (Tabes Dorsalis)",
        "Lateral Corticospinal tracts bilaterally (Amyotrophic Lateral Sclerosis)",
        "Right spinal hemicord (Brown-Séquard Syndrome)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classical Syringomyelia, characterized by a fluid-filled cavitation (syrinx) within the central canal of the cervical spinal cord (frequently associated with Chiari type I malformations). As the syrinx expands, it first compresses and damages the decussating spinothalamic fibers within the Anterior White Commissure. This results in the pathognomonic bilateral 'cape-like' suspended sensory loss of pain and temperature over the shoulders and arms, with strict preservation of dorsal column fine touch and proprioception (dissociated sensory loss)."
    }
  ]
};
