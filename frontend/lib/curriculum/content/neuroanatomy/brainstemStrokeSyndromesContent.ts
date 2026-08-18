/**
 * Clinical Neuroanatomy: Brainstem Stroke Syndromes & Cranial Nerve Localizers
 * Authoritative medical content derived from Blumenfeld's Neuroanatomy through Clinical Cases, Adams and Victor's Neurology.
 * Mapped to NMC CBME Competencies: NE1.1, NE1.2, NE2.1, NE2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BRAINSTEM_STROKE_SYNDROMES_MODULE: PhysiologyLessonModule = {
  id: "neuroanatomy-brainstem-stroke-syndromes",
  unitCode: "NE1.1",
  title: "Brainstem Stroke Syndromes: Wallenberg (PICA), Dejerine (ASA), AICA (Facial Droop) & Midbrain Syndromes",
  competencies: ["NE1.1", "NE1.2", "NE2.1", "NE2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Brainstem Vascular Stroke Syndromes & Cranial Nerve Localizers

Vascular occlusion of specific brainstem perforating and circumferential arteries produces classic crossed syndromes where cranial nerve signs are ipsilateral to the lesion and long-tract motor/sensory deficits are contralateral.

---

## 1. Medullary Stroke Syndromes: Lateral vs Medial

| Vascular Syndrome | Occluded Vessel | Damaged Neural Structures | Hallmark Clinical Neurological Signs | Spared Tracts |
| :--- | :--- | :--- | :--- | :--- |
| **Lateral Medullary (Wallenberg) Syndrome** | **Posterior Inferior Cerebellar Artery (PICA)** or Vertebral Artery | 1. **Nucleus Ambiguus (CN IX, X, XI)**<br>2. **Vestibular Nuclei**<br>3. **Spinal Trigeminal Nucleus/Tract**<br>4. **Spinothalamic Tract**<br>5. **Descending Sympathetic Tract**<br>6. **Inferior Cerebellar Peduncle** | • **Dysphagia, hoarseness, loss of gag reflex**.<br>• Vertigo, vomiting, horizontal/rotatory nystagmus.<br>• **Ipsilateral loss of pain/temp on face**.<br>• **Contralateral loss of pain/temp on body (Crossed Sensory Deficit!)**.<br>• **Ipsilateral Horner Syndrome** (ptosis, miosis, anhidrosis).<br>• Ipsilateral cerebellar limb ataxia. | **Corticospinal motor tract IS SPARED** (no paralysis!) and **Dorsal column vibration/proprioception IS SPARED**. |
| **Medial Medullary (Dejerine) Syndrome** | **Anterior Spinal Artery (ASA)** or Paramedian Vertebral Branches | 1. **Corticospinal Tract (Pyramid)**<br>2. **Medial Lemniscus**<br>3. **Hypoglossal Nucleus / Nerve (CN XII)** | • **Contralateral spastic hemiparesis** (body paralysis).<br>• **Contralateral loss of vibration and joint position sense (proprioception)**.<br>• **Ipsilateral flaccid tongue paralysis** (**tongue deviates TOWARD the side of the lesion** due to genioglossus unopposed action). | Spinothalamic pain/temp tract and cranial nerves IX, X, XI are spared. |

---

## 2. Pontine & Midbrain Stroke Syndromes

$$\\begin{array}{lcccc}
\\hline
\\textbf{Syndrome Name} & \\textbf{Occluded Artery} & \\textbf{Cranial Nerve Deficit (Ipsilateral)} & \\textbf{Long-Tract \u0026 Brainstem Deficits} \\\\
\\hline
\\textbf{Lateral Pontine Syndrome} & \\mathbf{\\text{AICA}} & \\mathbf{\\text{CN VII (Facial Motor Nucleus)}} & \\text{Contralateral pain/temp body loss,} \\\\
& \\text{(Anterior Inferior} & \\text{• Ipsilateral LMN facial droop} & \\text{ipsilateral facial pain/temp loss,} \\\\
& \\text{Cerebellar Artery)} & \\text{• Loss of corneal reflex \u0026 taste} & \\text{ipsilateral Horner, ataxia (MCP),} \\\\
& & \\mathbf{\\text{CN VIII}}: \\text{hearing loss, tinnitus} & \\mathbf{\\text{"Facial Droop = AICA"}} \\\\
\\hline
\\textbf{Weber Syndrome} & \\mathbf{\\text{PCA Branches}} & \\mathbf{\\text{CN III (Oculomotor Nerve)}} & \\mathbf{\\text{Contralateral Spastic Hemiparesis}} \\\\
\\text{(Ventral Midbrain)} & \\text{(Paramedian)} & \\text{• Down-and-out eye, ptosis,} & \\text{(damage to descending Corticospinal /} \\\\
& & \\text{  fixed dilated pupil (mydriasis)} & \\text{ Corticobulbar in Cerebral Peduncle)} \\\\
\\hline
\\textbf{Claude Syndrome} & \\text{PCA Perforators} & \\mathbf{\\text{CN III Oculomotor Palsy}} & \\mathbf{\\text{Contralateral Ataxia \u0026 Intention Tremor}} \\\\
\\text{(Dorsal Tegmentum)} & & \\text{• Ptosis, mydriasis, strabismus} & \\text{(damage to Red Nucleus / Cerebellothalamic)} \\\\
\\hline
\\textbf{Benedikt Syndrome} & \\text{PCA Branches} & \\mathbf{\\text{CN III Oculomotor Palsy}} & \\mathbf{\\text{Contralateral Hemiparesis + Choreoathetosis}} \\\\
\\text{(Paramedian Midbrain)} & & & \\text{(damage to CN III + Red Nucleus + Corticospinal)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with long-standing hypertension awakens with acute diplopia and weakness of the left arm and leg. Neurological examination reveals complete ptosis of the right upper eyelid, a dilated and non-reactive right pupil, and the right eye rests in an abducted and depressed ('down-and-out') position at baseline. On the left side, there is spastic hemiparesis with 2/5 muscle strength in the left upper and lower extremities, hyperactive deep tendon reflexes, and a positive left Babinski sign. Sensation and coordination are preserved.",
      question: "Which of the following is the anatomical location and eponym of this brainstem vascular syndrome?",
      options: [
        "Ventral Midbrain (Weber Syndrome; ipsilateral CN III palsy + contralateral corticospinal hemiparesis)",
        "Lateral Medulla (Wallenberg Syndrome; PICA occlusion)",
        "Lateral Pons (AICA occlusion; facial motor nucleus lesion)",
        "Medial Medulla (Dejerine Syndrome; ASA occlusion)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classical Weber Syndrome (ventral midbrain syndrome), caused by occlusion of paramedian penetrating branches of the Posterior Cerebral Artery (PCA). The infarct affects two key structures in the ventral midbrain: (1) The fascicles of the Oculomotor Nerve (CN III), producing an ipsilateral CN III palsy (down-and-out eye, ptosis, fixed dilated pupil due to parasympathetic loss); and (2) The descending Corticospinal and Corticobulbar tracts in the Cerebral Peduncle, producing contralateral spastic hemiparesis and hyperreflexia."
    }
  ]
};
