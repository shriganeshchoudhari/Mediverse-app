/**
 * Head, Neck & Cranial Nerves Anatomy Learning Content
 * Authoritative medical content derived from Gray's Anatomy (42nd ed.), Netter, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN26.1, AN28.1, AN30.1, AN35.1, AN43.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEAD_NECK_MODULE: PhysiologyLessonModule = {
  id: "anat-head-neck",
  unitCode: "AN26.1",
  title: "Cranial Base Foramina, Cavernous Sinus & Neck Triangles",
  competencies: ["AN26.1", "AN28.1", "AN30.1", "AN35.1", "AN43.1"],
  estimatedMinutes: 125,
  organ3dTarget: "NEUROLOGY",
  markdownContent: `
# Cranial Base Foramina, Cavernous Sinus & Neck Triangles

The head and neck contain high-density neurovascular pathways, cranial nerve exit foramina across the skull base, and specialized fascial triangles.

---

## 1. Cranial Nerve Skull Base Exit Foramina

| Skull Base Foramen | Cranial Fossa | Transmitted Cranial Nerves & Major Vessels |
| :--- | :--- | :--- |
| **Cribriform Plate** | Anterior Cranial Fossa | **CN I (Olfactory Nerve bundles)** |
| **Optic Canal** | Middle Cranial Fossa | **CN II (Optic Nerve)**, **Ophthalmic Artery** |
| **Superior Orbital Fissure** | Middle Cranial Fossa | **CN III (Oculomotor)**, **CN IV (Trochlear)**, **CN V1 (Ophthalmic)**, **CN VI (Abducens)**, Superior Ophthalmic Vein |
| **Foramen Rotundum** | Middle Cranial Fossa | **CN V2 (Maxillary Nerve)** |
| **Foramen Ovale** | Middle Cranial Fossa | **CN V3 (Mandibular Nerve)**, Accessory meningeal artery, Lesser petrosal nerve, Emissary vein (Mnemonic: **OVALE**) |
| **Foramen Spinosum** | Middle Cranial Fossa | **Middle Meningeal Artery & Vein**, Meningeal branch of CN V3 (*Laceration causes Epidural Hematoma*) |
| **Internal Acoustic Meatus** | Posterior Cranial Fossa | **CN VII (Facial)**, **CN VIII (Vestibulocochlear)**, Labyrinthine artery |
| **Jugular Foramen** | Posterior Cranial Fossa | **CN IX (Glossopharyngeal)**, **CN X (Vagus)**, **CN XI (Accessory)**, Internal Jugular Vein |
| **Hypoglossal Canal** | Posterior Cranial Fossa | **CN XII (Hypoglossal Nerve)** |
| **Foramen Magnum** | Posterior Cranial Fossa | Brainstem/Spinal cord junction, Vertebral Arteries, Spinal roots of CN XI, Anterior/Posterior spinal arteries |

---

## 2. Cavernous Sinus Anatomy & Pathology

The **Cavernous Sinuses** are paired dural venous sinuses located bilaterally on the sides of the sella turcica of the sphenoid bone:

> **Cavernous Sinus Internal Architecture**:
> - **Lateral Dural Wall Contents (Superior to Inferior)**:
>   1. **CN III (Oculomotor Nerve)**
>   2. **CN IV (Trochlear Nerve)**
>   3. **CN V1 (Ophthalmic branch of Trigeminal)**
>   4. **CN V2 (Maxillary branch of Trigeminal)**
> - **Internal Lumen (Central) Contents (Freely bathed in venous blood)**:
>   1. **CN VI (Abducens Nerve)** - Most susceptible to compression or intracavernous aneurysm.
>   2. **Internal Carotid Artery (ICA)** - Cavernous segment (siphon).

### Clinical Syndromes:
- **Cavernous Sinus Thrombosis**: Septic thrombosis secondary to skin infections in the **Danger Triangle of the Face** (drained via ophthalmic veins without valves). Presents with severe retro-orbital headache, proptosis, chemosis, periorbital edema, and ophthalmoplegia (CN VI lateral rectus palsy first).
- **Internal Carotid Artery Aneurysm in Cavernous Sinus**: Compresses **CN VI** first $\\implies$ ipsilateral lateral gaze palsy.

---

## 3. Triangles of the Neck

1. **Anterior Triangle** (Bounded by SCM, Mandible, Midline):
   - **Carotid Triangle**: Bounded by SCM anterior border, posterior belly of digastric, superior belly of omohyoid. Contains Common Carotid bifurcation, Internal Jugular Vein, Vagus nerve (Carotid Sheath), and Hypoglossal nerve.
   - **Submandibular Triangle**: Contains submandibular salivary gland and facial artery/vein.
   - **Submental Triangle**: Unpaired midline triangle containing submental lymph nodes.
   - **Muscular Triangle**: Contains infrahyoid 'strap' muscles and thyroid/parathyroid glands.
2. **Posterior Triangle** (Bounded by SCM, Trapezius, Clavicle):
   - Transmits **Spinal Accessory Nerve (CN XI)** across the levator scapulae (vulnerable during lymph node biopsy $\\implies$ shoulder droop, inability to shrug trapezius).
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female presents with acute high fever, severe periorbital edema, and proptosis of the left eye following a squeezing of a furuncle on her upper lip 3 days ago. On physical examination, the left eye is fixed in midline with complete inability to abduct the left eye on lateral gaze. Sensation is decreased over the left forehead and maxillary region.",
      question: "Which of the following venous structures is primarily thrombosed in this patient?",
      options: [
        "Cavernous sinus",
        "Superior sagittal sinus",
        "Sigmoid sinus",
        "Straight sinus"
      ],
      correctAnswerIndex: 0,
      explanation: "Cavernous Sinus Thrombosis frequently develops from infections in the 'danger triangle of the face' (upper lip, nose) via retrograde spread through the superior and inferior ophthalmic veins into the cavernous sinus. CN VI passes through the center of the sinus and is affected earliest, causing lateral gaze palsy (lateral rectus paralysis), followed by CN III, IV, V1, and V2 involvement."
    }
  ]
};
