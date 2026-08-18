/**
 * Neurology: Spinal Cord Syndromes & Motor Neuron Disease (ALS)
 * Authoritative medical content derived from Adams and Victor's Principles of Neurology (12th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: NE1.7, NE1.8, PA40.1, PA40.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPINAL_CORD_SYNDROMES_ALS_MODULE: PhysiologyLessonModule = {
  id: "neurology-adv-spinal-cord-syndromes-als",
  unitCode: "NE7.1",
  title: "Spinal Cord Syndromes (Brown-Séquard, Anterior, Central Syringomyelia) & ALS",
  competencies: ["NE1.7", "NE1.8", "PA40.1", "PA40.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Spinal Cord Syndromes & Motor Neuron Diseases

Spinal cord lesion localization integrates longitudinal tract anatomy with horizontal cross-sectional topography to identify transections, vascular infarctions, and motor neuron degenerations.

---

## 1. Comparative Matrix of Spinal Cord Syndromes

$$\\begin{array}{lccc}
\\hline
\\textbf{Spinal Syndrome} & \\textbf{Motor Deficit (Corticospinal)} & \\textbf{Pain \u0026 Temp (Spinothalamic)} & \\textbf{Vibration / Proprioception (Dorsal Columns)} \\\\
\\hline
\\textbf{Brown-S\u00e9quard (Hemicord)} & \\mathbf{\\text{Ipsilateral UMN weakness}} & \\mathbf{\\text{Contralateral loss (1-2 levels below)}} & \\mathbf{\\text{Ipsilateral loss below lesion}} \\\\
\\textbf{Anterior Cord (ASA Infarct)} & \\mathbf{\\text{Bilateral UMN paralysis}} & \\mathbf{\\text{Bilateral loss below lesion}} & \\mathbf{\\text{COMPLETELY PRESERVED / INTACT!}} \\\\
\\textbf{Central Cord (Syringomyelia)} & \\text{Upper extremity weakness } > \\text{ Lower} & \\mathbf{\\text{Bilateral \"cape-like\" arm/shoulder loss}} & \\text{Preserved (Dorsal columns spared)} \\\\
\\textbf{Subacute Combined Degeneration} & \\mathbf{\\text{Bilateral spastic paresis (Corticospinal)}} & \\text{Normal / Intact} & \\mathbf{\\text{Bilateral loss (Sensory ataxia, +Romberg)}} \\\\
\\hline
\\end{array}$$

- **Syringomyelia Pathophysiology**: Fluid-filled cystic cavity (syrinx) within the central canal of the cervical spinal cord (often associated with **Chiari I malformation** $\rightarrow$ herniation of cerebellar tonsils $>5\\text{ mm}$ through foramen magnum) $\rightarrow$ early compression of crossing fibers in the **anterior white commissure**, causing bilateral loss of pain and temperature in a \"cape-like\" distribution over shoulders and arms.
- **Subacute Combined Degeneration ($\text{B}_{12}$ Deficiency)**: Demyelination of:
  1. **Dorsal Columns**: Loss of vibration and position sense $\rightarrow$ sensory ataxia, positive Romberg sign.
  2. **Lateral Corticospinal Tracts**: Spastic weakness, hyperreflexia, extensor plantar responses (Babinski).
  3. **Spinocerebellar Tracts**: Limb and truncal ataxia.

---

## 2. Amyotrophic Lateral Sclerosis (ALS / Lou Gehrig Disease)

- **Pathophysiology**: Progressive neurodegeneration affecting both **Upper Motor Neurons (UMN)** in the precentral motor cortex (Betz cells) and **Lower Motor Neurons (LMN)** in the brainstem cranial nuclei and anterior horns of the spinal cord (associated with *SOD1* mutations and TDP-43 inclusions).
- **The Signature Combination of UMN & LMN Signs**:
  - **Upper Motor Neuron Signs**: Spasticity, hyperreflexia, positive Babinski sign, pseudobulbar affect (pathological laughing/crying), spastic dysarthria.
  - **Lower Motor Neuron Signs**: Flaccid asymmetric muscle weakness, prominent muscle atrophy, **fasciculations (muscle twitches)**, tongue wasting, and diaphragmatic weakness.
- **Strictly Spared Functions**: **Sensory modalities, bowel and bladder sphincters, and extraocular eye movements are COMPLETELY PRESERVED!**
- **Disease-Modifying Pharmacotherapy**:
  - **Riluzole**: Glutamate release and post-synaptic receptor inhibitor; prolongs tracheostomy-free survival by $2-3$ months.
  - **Edaravone**: Free radical scavenger that slows functional decline.
`,
  clinicalVignettes: [
    {
      scenario: "A 61-year-old male presents with a 6-month history of progressive weakness and muscle stiffness in both legs, accompanied by muscle twitching in his right arm and difficulty articulating speech. Physical examination reveals: asymmetric atrophy and prominent fasciculations of the right hand intrinsic muscles and tongue; bilateral hyperreflexia in the biceps, patellar (4+), and Achilles reflexes with sustained bilateral ankle clonus; and bilateral upgoing plantar reflexes (positive Babinski). Sensation to light touch, pinprick, temperature, vibration, and joint position is entirely normal throughout all four extremities. Bowel and bladder continence are fully intact.",
      question: "Which of the following represents the definitive diagnosis and the pharmacological mechanism of the drug that prolongs survival in this condition?",
      options: [
        "Amyotrophic Lateral Sclerosis (ALS); Riluzole (presynaptic glutamate release inhibitor)",
        "Multiple Sclerosis (MS); Natalizumab (alpha-4 integrin monoclonal antibody)",
        "Guillain-Barré Syndrome (GBS); Intravenous Immunoglobulin (IVIG)",
        "Vitamin B12 deficiency (Subacute Combined Degeneration); Intramuscular Cyanocobalamin replacement"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient demonstrates the pathognomonic coexistence of Upper Motor Neuron signs (hyperreflexia, clonus, bilateral Babinski signs) and Lower Motor Neuron signs (muscle atrophy, fasciculations of the hand and tongue) in the complete absence of sensory or sphincter abnormalities, confirming Amyotrophic Lateral Sclerosis (ALS). The only FDA-approved medication demonstrated to modestly prolong tracheostomy-free survival in ALS is Riluzole, which acts by decreasing glutamate neurotransmission (blocking presynaptic release and enhancing glutamate reuptake), thereby mitigating excitotoxic neuronal injury."
    }
  ]
};
