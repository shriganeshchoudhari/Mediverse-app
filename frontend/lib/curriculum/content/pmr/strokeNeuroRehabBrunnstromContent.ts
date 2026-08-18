/**
 * Stroke Neuro-Rehabilitation, Brunnstrom Motor Recovery & Spasticity Management (MAS)
 * Authoritative medical content derived from Braddom's PM&R, DeLisa, and USMLE Step 2/3 Physical Medicine & Rehabilitation.
 * Mapped to NMC CBME Competencies: PM1.1, PM1.2, PM2.1, PM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const STROKE_NEURO_REHAB_BRUNNSTROM_MODULE: PhysiologyLessonModule = {
  id: "pmr-stroke-neuro-rehab-brunnstrom",
  unitCode: "PM1.1",
  title: "PMR: Stroke Neuro-Rehabilitation, Brunnstrom Stages of Motor Recovery & Spasticity (MAS)",
  competencies: ["PM1.1", "PM1.2", "PM2.1", "PM2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# PMR: Stroke Neuro-Rehabilitation, Brunnstrom Stages of Motor Recovery & Spasticity (MAS)

Post-stroke motor recovery proceeds through predictable stereotypic stages of synergy patterns and muscle tone evolution, guiding targeted neuro-rehabilitation interventions.

---

## 1. Brunnstrom Stages of Post-Stroke Motor Recovery

$$\\text{Recovery Spectrum}: \\text{Flaccidity (Stage 1)} \\longrightarrow \\text{Peak Spasticity/Synergy (Stage 3)} \\longrightarrow \\text{Isolated Control (Stage 6)}$$

| Brunnstrom Stage | Motor Control & Voluntary Movement | Muscle Tone / Spasticity | Clinical Characteristics & Synergies |
| :--- | :--- | :--- | :--- |
| **Stage 1** | **Flaccidity**; Complete absence of voluntary movement on hemiplegic side. | **Hypotonic / Atonic** | No reflex or voluntary movement can be elicited; flaccid paralysis. |
| **Stage 2** | **Emergence of Synergies**; Minimal voluntary movement in gross synergy patterns. | **Spasticity Begins to Develop** | Associated reactions and basic flexor/extensor synergies emerge as weak involuntary or semi-voluntary twitches. |
| **Stage 3** | **Voluntary Control of Synergies**; Definite voluntary movement within stereotypic synergies. | **PEAK SPASTICITY** | **Upper Limb Flexor Synergy**: Scapular retraction, shoulder abduction/external rotation, elbow flexion, forearm supination, wrist/finger flexion.<br>**Lower Limb Extensor Synergy**: Hip extension/adduction/internal rotation, knee extension, ankle plantarflexion/inversion. |
| **Stage 4** | **Movement Deviating from Synergies**; Patient begins to break out of basic synergy patterns. | **Spasticity Begins to Decline** | Patient can place hand behind lumbar spine, elevate arm to $90^\\circ$ with elbow extended, and pronate/supinate forearm with elbow at $90^\\circ$. |
| **Stage 5** | **Independent Movement Out of Synergy**; Complex movement combinations possible. | **Spasticity Significantly Reduced** | Arm raising overhead, isolated knee flexion with hip extended, isolated ankle dorsiflexion with knee extended. |
| **Stage 6** | **Isolated Joint Movement**; Near-normal motor coordination. | **Normal or Minimal Tone** | Individual joint movements performed with normal coordination, speed, and isolated dexterity (e.g. rapid alternating movements). |

---

## 2. Spasticity Assessment: The Modified Ashworth Scale (MAS)

- **Definition**: Spasticity is a velocity-dependent increase in tonic stretch reflexes with exaggerated tendon jerks resulting from upper motor neuron (UMN) hyperexcitability.
- **Modified Ashworth Scale (MAS 0–4)**:
  - **Grade 0**: No increase in muscle tone.
  - **Grade 1**: Slight increase in muscle tone, manifested by a **"catch and release"** or by minimal resistance at the end of the range of motion (ROM) when the affected part(s) is moved in flexion or extension.
  - **Grade 1+**: Slight increase in muscle tone, manifested by a **"catch"**, followed by minimal resistance throughout the remainder (less than half) of the ROM.
  - **Grade 2**: More marked increase in muscle tone through most of the ROM, but affected part(s) is easily moved passively.
  - **Grade 3**: Considerable increase in muscle tone; passive movement is difficult.
  - **Grade 4**: Affected part(s) is **rigid in flexion or extension**.

---

## 3. Pharmacotherapy & Interventional Management of Spasticity

$$\\begin{array}{rcccl}
\\text{Mild / Generalized Spasticity} & \\longrightarrow & \\text{Oral Antispastics (Baclofen, Tizanidine, Dantrolene)} & \\implies & \\text{First-line systemic therapy} \\\\
\\text{Focal Spasticity (e.g. Biceps, Calf)} & \\longrightarrow & \\mathbf{Intramuscular Botulinum Toxin A (BoNT-A)} & \\implies & \\mathbf{Cleaves SNAP-25; Blocks ACh} \\\\
\\text{Severe Refractory Spasticity} & \\longrightarrow & \\mathbf{Intrathecal Baclofen (ITB) Pump} & \\implies & \\mathbf{Direct GABA_B \\text{ stimulation at spinal cord}}
\\end{array}$$

- **Botulinum Toxin A (BoNT-A)**:
  - Injected directly into spastic muscle bellies under ultrasound or EMG guidance.
  - Cleaves **SNAP-25** protein required for presynaptic vesicle exocytosis $\\implies$ prevents Acetylcholine release at the neuromuscular junction $\\implies$ produces chemical denervation and focal muscle relaxation lasting **$3 - 6\\text{ months}$**.
- **Oral Medications**:
  - **Baclofen**: $GABA_B$ receptor agonist that inhibits presynaptic motor neuron excitation in the spinal cord; *Warning: Sudden withdrawal can cause fatal seizures and hyperthermia!*
  - **Tizanidine**: Central $\\alpha_2$-adrenergic agonist that reduces excitatory interneuron transmission.
  - **Dantrolene**: Acts peripherally on the sarcoplasmic reticulum ryanodine receptor ($RYR1$) to block $Ca^{2+}$ release; requires monitoring of liver function tests.

---

## 4. Evidence-Based Stroke Neuro-Rehabilitation Paradigms

- **Constraint-Induced Movement Therapy (CIMT)**:
  - Indicated for patients with at least $10^\\circ$ active wrist extension and $10^\\circ$ active finger extension.
  - The **unaffected upper limb is restrained in a mitt for $\\ge 90\\%$ of waking hours for 2 consecutive weeks**, forcing repetitive task-oriented training of the paretic arm, overcoming "learned non-use" and driving cortical neuroplastic reorganization.
- **Task-Specific Gait Training & Body-Weight Supported Treadmill Training (BWSTT)**:
  - High-repetition, goal-oriented locomotion training that activates spinal central pattern generators (CPGs).
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old female who suffered an ischemic stroke 6 weeks ago is undergoing neuro-rehabilitation. On examination of the right upper limb, she is able to voluntarily initiate elbow flexion and shoulder abduction, but these movements occur strictly within an obligatory flexor synergy pattern (elbow flexes whenever she attempts to reach forward). There is marked resistance to passive elbow extension throughout most of the arc of motion, but the elbow can still be fully extended passively with moderate effort. She cannot place her hand behind her back or isolate wrist extension.",
      question: "Which Brunnstrom Stage of motor recovery and Modified Ashworth Scale (MAS) score best characterize her presentation?",
      options: [
        "Brunnstrom Stage 3 (Voluntary movement confined to synergy patterns) with MAS Grade 2 (Marked tone increase through most of ROM)",
        "Brunnstrom Stage 1 (Flaccidity) with MAS Grade 0",
        "Brunnstrom Stage 5 (Independent movement out of synergy) with MAS Grade 1",
        "Brunnstrom Stage 6 (Isolated coordination) with MAS Grade 4 (Rigidity)"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient who can move voluntarily but only within obligatory stereotypic synergy patterns (such as upper limb flexor synergy) is in Brunnstrom Stage 3 (the peak of spasticity). The presence of marked resistance to passive stretch throughout most of the range of motion while still permitting full passive movement corresponds to Modified Ashworth Scale (MAS) Grade 2."
    }
  ]
};
