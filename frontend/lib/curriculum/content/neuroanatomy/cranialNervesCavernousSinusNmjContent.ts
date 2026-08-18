/**
 * Clinical Neuroanatomy: Cranial Nerves, Cavernous Sinus & Neuromuscular Junction
 * Authoritative medical content derived from Blumenfeld's Neuroanatomy through Clinical Cases, Adams and Victor's Neurology.
 * Mapped to NMC CBME Competencies: NE7.1, NE7.2, NE8.1, NE8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CRANIAL_NERVES_CAVERNOUS_SINUS_NMJ_MODULE: PhysiologyLessonModule = {
  id: "neuroanatomy-cranial-nerves-cavernous-sinus-nmj",
  unitCode: "NE7.1",
  title: "Cranial Nerve Localizers, Cavernous Sinus, MLF Internuclear Ophthalmoplegia & NMJ Disorders",
  competencies: ["NE7.1", "NE7.2", "NE8.1", "NE8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Cranial Nerve Localizers, Cavernous Sinus & Neuromuscular Junctions

Precise understanding of cranial nerve pathways through the skull base, brainstem internuclear circuits, and synaptic neuromuscular transmission allows accurate lesion localization.

---

## 1. Cavernous Sinus Syndrome & Cranial Nerve Pathways

- **Cavernous Sinus Topography**:
  - **Lateral Wall (Superior to Inferior)**: **CN III (Oculomotor)**, **CN IV (Trochlear)**, **CN $\\text{V}_1$ (Ophthalmic)**, **CN $\\text{V}_2$ (Maxillary)**.
  - **Center of Cavernous Sinus (Adjacent to Internal Carotid Artery)**: **CN VI (Abducens)** and post-ganglionic sympathetic fibers.
- **Clinical Cavernous Sinus Syndrome**:
  - Etiology: Septic thrombosis (from facial furuncle/sinusitis), pituitary macroadenoma expansion, carotid-cavernous fistula.
  - Clinical Findings: **Complete internal and external ophthalmoplegia (CN III, IV, VI palsies)**, ptosis, proptosis, chemosis, sensory loss over forehead and cheek ($\text{V}_1, \text{V}_2$). *Note: CN VI is the first nerve affected by internal carotid aneurysm or compression because it sits freely within the sinus lumen!*

---

## 2. Internuclear Ophthalmoplegia (INO) & Conjugate Gaze

- **Circuit**: Frontal Eye Field $\rightarrow$ contralateral PPRF (paramedian pontine reticular formation) $\rightarrow$ CN VI nucleus $\rightarrow$ **Medial Longitudinal Fasciculus (MLF)** $\rightarrow$ contralateral CN III nucleus (medial rectus subnucleus).
- **Pathophysiology**:
  - Demyelination (hallmark of **Multiple Sclerosis** in young patients) or lacunar infarction (elderly) of the **MLF**.
- **Clinical Signs of Right MLF Lesion (Right INO)**:
  - On attempted **left lateral conjugate gaze**:
    1. **Right eye fails to adduct** (impaired right medial rectus adduction).
    2. **Left eye exhibits horizontal nystagmus** during abduction.
    3. **Convergence remains intact** (utilizes a direct pretectal pathway bypassing the MLF).

---

## 3. Neuromuscular Junction Disorders: Myasthenia Gravis vs Lambert-Eaton

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Feature} & \\textbf{Myasthenia Gravis (MG)} & \\textbf{Lambert-Eaton Myasthenic Syndrome (LEMS)} \\\\
\\hline
\\textbf{Autoantibody Target} & \\mathbf{\\text{Post-synaptic Nicotinic ACh Receptors (anti-AChR)}} & \\mathbf{\\text{Pre-synaptic P/Q-Type Voltage-Gated Ca}^{2+}\\text{ Channels (VGCC)}} \\\\
\\textbf{Ocular Involvement} & \\mathbf{\\text{Prominent (Early ptosis \u0026 diplopia in }>85\\%)} & \\text{Rare / Minimal ocular signs} \\\\
\\textbf{Fatigue vs Exercise} & \\mathbf{\\text{Weakness WORSENS with repetitive use / end of day}} & \\mathbf{\\text{Weakness IMPROVES with repetitive use / exercise!}} \\\\
\\textbf{Deep Tendon Reflexes} & \\text{Normal} & \\mathbf{\\text{Hyporeflexia / Areflexia (improves post-exercise)}} \\\\
\\textbf{Autonomic Symptoms} & \\text{Absent} & \\mathbf{\\text{Present (Dry mouth, erectile dysfunction, constipation)}} \\\\
\\textbf{Malignancy Association} & \\mathbf{\\text{Thymoma (15\\%) / Thymic Hyperplasia (65\\%)}} & \\mathbf{\\text{Small Cell Lung Carcinoma (SCLC) (60\\%)}} \\\\
\\textbf{First-Line Pharmacotherapy} & \\mathbf{\\text{Pyridostigmine (AChE inhibitor)}} & \\mathbf{\\text{Amifampridine (3,4-DAP) \u0026 Treat underlying SCLC}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old female with a history of optic neuritis presents with double vision on looking to the left. On physical examination, when the patient attempts to look straight to the left, the left eye abducts fully but exhibits horizontal nystagmus, while the right eye fails to adduct past the midline. When the patient is asked to look at a near object held 10 cm in front of her nose, both eyes adduct symmetrically and the pupils constrict normally.",
      question: "Which of the following neural pathways is damaged, and what is the eponym for this ocular motility disorder?",
      options: [
        "Right Medial Longitudinal Fasciculus (Right Internuclear Ophthalmoplegia [INO])",
        "Left Abducens Nerve (CN VI Palsy)",
        "Left Medial Longitudinal Fasciculus (Left INO)",
        "Right Oculomotor Nerve (CN III Palsy)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits a classic Right Internuclear Ophthalmoplegia (INO) caused by a demyelinating plaque in the Right Medial Longitudinal Fasciculus (MLF), highly characteristic of Multiple Sclerosis. The right MLF normally carries ascending excitatory signals from the left abducens (CN VI) nucleus in the pons to the right oculomotor (CN III) medial rectus subnucleus in the midbrain. When damaged, conjugate left lateral gaze produces failure of right eye adduction with monocular horizontal nystagmus of the abducting left eye, while convergence remains intact because convergence circuits bypass the MLF."
    }
  ]
};
