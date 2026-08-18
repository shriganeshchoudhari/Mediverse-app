/**
 * Neurophysiology & Special Senses Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.), Kandel, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PY10.1, PY10.2, PY10.3, PY10.4, PY10.5
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const NEUROPHYSIOLOGY_MODULE: PhysiologyLessonModule = {
  id: "phys-neurophysiology",
  unitCode: "PY10.1",
  title: "Basal Ganglia Circuitry, Visual Pathways & Synaptic Integration",
  competencies: ["PY10.1", "PY10.2", "PY10.3", "PY10.4"],
  estimatedMinutes: 120,
  organ3dTarget: "NEUROLOGY",
  markdownContent: `
# Basal Ganglia Circuitry, Visual Pathways & Synaptic Integration

Neurophysiology encompasses the computational integration of sensory inputs, central basal ganglia / cerebellar motor coordination loops, and special sense transduction mechanisms.

---

## 1. Basal Ganglia Direct & Indirect Motor Control Circuits

The basal ganglia regulate the initiation, scaling, and execution of voluntary motor movements:

> **Basal Ganglia Pathways**:
> 1. **Direct Pathway (Facilitates Movement / "GO" Pathway)**:
>    - Cortex (Glutamate +) $\rightarrow$ Striatum (Caudate + Putamen)
>    - $\rightarrow$ Striatum expresses $D_1$ Receptors (stimulated by Dopamine from Substantia Nigra Pars Compacta / SNc)
>    - $\rightarrow$ Striatum (GABA -) inhibits Globus Pallidus Internus (GPi) & Substantia Nigra Pars Reticulata (SNr)
>    - $\rightarrow$ Disinhibits (relieves inhibition on) Ventral Anterior/Ventral Lateral (VA/VL) Thalamus
>    - $\rightarrow$ Thalamus (Glutamate +) stimulates Motor Cortex $\rightarrow$ **Movement Initiated**.
>
> 2. **Indirect Pathway (Inhibits Movement / "NO-GO" Pathway)**:
>    - Cortex (Glutamate +) $\rightarrow$ Striatum
>    - $\rightarrow$ Striatum expresses $D_2$ Receptors (inhibited by Dopamine from SNc)
>    - $\rightarrow$ Striatum (GABA -) inhibits Globus Pallidus Externus (GPe)
>    - $\rightarrow$ Disinhibits Subthalamic Nucleus (STN)
>    - $\rightarrow$ STN (Glutamate +) excites GPi/SNr
>    - $\rightarrow$ GPi/SNr (GABA -) intensely inhibits VA/VL Thalamus
>    - $\rightarrow$ Thalamus cannot excite Motor Cortex $\rightarrow$ **Movement Suppressed**.

### Classical Basal Ganglia Disorders:
- **Parkinson's Disease**: Degeneration of dopaminergic neurons in the **Substantia Nigra Pars Compacta (SNc)** (Lewy bodies containing $\\alpha$-synuclein). Loss of $D_1$ stimulation (diminished direct pathway) and loss of $D_2$ inhibition (overactive indirect pathway) $\\implies$ **TRAP Triad** (Tremor at rest / pill-rolling, Rigidity / cogwheel, Akinesia / Bradykinesia, Postural instability).
- **Huntington's Disease**: Autosomal dominant CAG trinucleotide repeat expansion ($>40$ repeats on chromosome 4). Selective loss of **GABAergic/Cholinergic striatal neurons of the indirect pathway** $\\implies$ loss of subthalamic nucleus activation $\\implies$ uninhibited motor thalamus $\\implies$ **Chorea, athetosis, dementia, depression**.
- **Hemiballismus**: Lacunar stroke or lesion of the contralateral **Subthalamic Nucleus (STN)** $\\implies$ sudden, violent flinging movements of the unilateral arm and leg.

---

## 2. Visual Field Defects & Pupillary Light Reflex Pathways

Visual processing follows strict retinotopic topography from the optic nerve through the optic chiasm, optic tract, lateral geniculate nucleus (LGN), and optic radiations to the primary visual cortex (Brodmann area 17):

| Anatomical Lesion Site | Visual Field Defect | Classical Etiology |
| :--- | :--- | :--- |
| **Right Optic Nerve** | Complete monocular blindness of right eye (Right Anopia) | Optic Neuritis (Multiple Sclerosis), central retinal artery occlusion |
| **Optic Chiasm (Center)** | **Bitemporal Hemianopia** (Loss of bilateral temporal/peripheral fields) | Pituitary Adenoma, Craniopharyngioma |
| **Right Optic Tract** | **Left Homonymous Hemianopia** | Anterior choroidal artery or middle cerebral artery stroke |
| **Meyer's Loop (Temporal Lobe)** | **Left Homonymous Upper Quadrantanopia** ("Pie in the sky") | Temporal lobe stroke (MCA inferior division) or temporal lobectomy |
| **Dorsal Optic Radiation (Parietal Lobe)** | **Left Homonymous Lower Quadrantanopia** ("Pie on the floor") | Parietal lobe stroke (MCA superior division) |
| **Right Occipital Cortex (PCA Stroke)** | **Left Homonymous Hemianopia with Macular Sparing** | Posterior Cerebral Artery (PCA) occlusion (Macula spared due to dual collateral blood supply from MCA) |

---

## 3. Auditory Transduction & Tuning Fork Diagnostics

1. Sound waves vibrate Tympanic Membrane $\\rightarrow$ Malleus, Incus, Stapes amplify sound $22\\times$ onto **Oval Window**.
2. Fluid waves in **Scala Vestibuli & Scala Tympani** (filled with $Na^+$-rich **perilymph**) deflect the Basilar Membrane.
3. Shearing forces bend **stereocilia of Inner Hair Cells** in the Organ of Corti against the Tectorial Membrane.
4. Bending toward the tallest kinocilium opens mechanically-gated $K^+$ channels $\\implies$ influx of $K^+$-rich **endolymph** from the Scala Media (produced by Stria Vascularis; $[K^+] \\approx 150\\text{ mEq/L}$, $+80\\text{ mV}$ endocochlear potential) $\\implies$ depolarization $\\implies$ voltage-gated $Ca^{2+}$ entry $\\implies$ Glutamate release onto Cranial Nerve VIII (Cochlear nerve).

### Tuning Fork Interpretation (Rinne & Weber Tests):
- **Rinne Test (512 Hz on Mastoid vs in front of Ear)**:
  - *Normal*: Air Conduction $>$ Bone Conduction ($AC > BC$, Positive Rinne).
  - *Conductive Hearing Loss* (e.g. Cerumen impaction, Otitis media, Otosclerosis): **$BC > AC$ (Negative Rinne)** in the affected ear.
  - *Sensorineural Hearing Loss* (e.g. Presbycusis, Acoustic Neuroma, Aminoglycoside toxicity): **$AC > BC$** preserved in both ears.
- **Weber Test (Tuning fork placed on midline forehead / vertex)**:
  - *Normal*: Sound heard equally in the midline.
  - *Conductive Hearing Loss*: Lateralizes to the **AFFECTED (abnormal) ear** (ambient room noise masked out).
  - *Sensorineural Hearing Loss*: Lateralizes to the **UNAFFECTED (normal) ear** (functioning nerve hears better).
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old female presents with a 4-month history of progressive bitemporal visual disturbance and amenorrhea. Visual field perimetry confirms a complete bitemporal hemianopia. Contrast-enhanced brain MRI demonstrates a 2.4 cm sellar mass extending into the suprasellar cistern with upward compression.",
      question: "Which of the following neural fiber tracts is compressed by the mass in this patient?",
      options: [
        "Decussating nasal retinal fibers in the optic chiasm",
        "Non-decussating temporal retinal fibers in the optic chiasm",
        "Meyer's loop fibers traversing the temporal lobe",
        "Geniculocalcarine tract fibers traversing the parietal lobe"
      ],
      correctAnswerIndex: 0,
      explanation: "A pituitary macroadenoma expanding superiorly compresses the center of the optic chiasm. The decussating fibers originate from the nasal hemiretinae of both eyes, which receive light from the temporal visual fields. Compression therefore results in loss of both temporal visual fields (bitemporal hemianopia)."
    }
  ]
};
