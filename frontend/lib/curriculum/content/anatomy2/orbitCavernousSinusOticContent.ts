/**
 * Human Anatomy II: Orbit, Cavernous Sinus & Otic Microanatomy
 * Authoritative gross anatomy content derived from Gray's Anatomy (42nd ed.), Moore's.
 * Mapped to NMC CBME Competencies: AN41.1, AN41.2, SU18.3, ENT1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ORBIT_CAVERNOUS_SINUS_OTIC_MODULE: PhysiologyLessonModule = {
  id: "anatomy2-orbit-cavernous-sinus-otic",
  unitCode: "AN41.1",
  title: "Orbit, Cavernous Sinus & Otic Labyrinth: Cavernous Sinus Thrombosis (CN III/IV/V1/V2/VI) & Middle Ear Ossicles",
  competencies: ["AN41.1", "AN41.2", "SU18.3", "ENT1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Orbit, Cavernous Sinus & Otic Labyrinth: Cavernous Sinus Thrombosis & Otic Anatomy

Neurovascular relationships within the cavernous sinus, orbit apex, and middle/inner ear chambers dictate clinical presentations of septic thrombosis, orbital apex syndromes, and conductive/sensorineural hearing loss.

---

## 1. Cavernous Sinus Neurovascular Relations Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Location in Cavernous Sinus} & \\textbf{Transmitted Neurovascular Structure} & \\textbf{Function / Innervation} & \\textbf{Vulnerability to Compression} \\\\
\\hline
\\textbf{Lateral Dural Wall (Superior)} & \\mathbf{\\text{Oculomotor Nerve (CN III)}} & \\text{Superior/Medial/Inferior Recti, IO, LPS, pupil} & \\text{Compression causes ptosis, mydriasis} \\\\
\\textbf{Lateral Dural Wall (Middle)} & \\mathbf{\\text{Trochlear Nerve (CN IV)}} & \\text{Superior Oblique muscle (intorsion/depression)} & \\text{Compression causes vertical diplopia} \\\\
\\textbf{Lateral Dural Wall (Inferior)} & \\mathbf{\\text{Ophthalmic Nerve (CN } V_1\\text{)}} & \\text{Corneal sensation, forehead sensation} & \\text{Loss of corneal afferent blink reflex} \\\\
\\textbf{Lateral Dural Wall (Bottom)} & \\mathbf{\\text{Maxillary Nerve (CN } V_2\\text{)}} & \\text{Midface sensation, upper teeth, palate} & \\text{Hypesthesia over maxilla and upper lip} \\\\
\\textbf{Free Lumen / Center (MEDIAL)} & \\mathbf{\\text{Internal Carotid Artery (ICA)}} & \\text{Cerebral blood flow (carotid siphon)} & \\text{Carotid-cavernous fistula with pulsatile proptosis} \\\\
\\textbf{Free Lumen / Center (MEDIAL)} & \\mathbf{\\text{Abducens Nerve (CN VI)}} & \\mathbf{\\text{Lateral Rectus muscle (abduction)}} & \\mathbf{\\text{EARLIEST \u0026 MOST COMMONLY INVOLVED}} \\\\
& & & (\\mathbf{\\text{Medial strabismus / failure to abduct}}) \\\\
\\hline
\\end{array}$$

---

## 2. Middle Ear Cavity \u0026 Otic Labyrinth Boundaries

- **Middle Ear Ossicular Chain**:
  - **Malleus (Hammer)**: Handle attached to tympanic membrane umbo; head articulates with incus.
  - **Incus (Anvil)**: Body articulates with malleus, long process articulates with stapes head.
  - **Stapes (Stirrup)**: Footplate inserts into the **oval window (fenestra vestibuli)** of the inner ear to transmit acoustic pressure waves to the perilymph of the scala vestibuli.
- **Tympanic Cavity Walls**:
  - **Roof (Tegmental wall)**: *Tegmen tympani* (thin bony plate separating middle ear from middle cranial fossa / temporal lobe $\rightarrow$ otogenic temporal lobe abscess route).
  - **Floor (Jugular wall)**: Thin bone separating from the superior bulb of the internal jugular vein.
  - **Medial (Labyrinthine wall)**: Promontory (over basal cochlear turn), Oval Window (stapes footplate), Round Window (secondary tympanic membrane), and Prominence of the Facial Nerve Canal.
  - **Anterior (Carotid wall)**: Opening of the Eustachian (auditory) tube and Tensor Tympani canal; bone separates from the internal carotid artery.
  - **Posterior (Mastoid wall)**: Aditus to the mastoid antrum, pyramidal eminence (transmitting the Stapedius tendon).
`,
  clinicalVignettes: [
    {
      scenario: "A 23-year-old female presents with severe frontal headache, high fever, periorbital edema, chemosis, and progressive double vision 5 days after squeezing a painful infected pimple in the nasolabial fold ('danger triangle of the face'). On examination, she has bilateral chemosis, severe proptosis, right-sided fixed dilated pupil with complete ptosis, and complete inability to abduct, elevate, depress, or adduct the right eye. Sensation over the right forehead and upper cheek is markedly diminished.",
      question: "What is the diagnosis, what anatomical vascular pathway allowed the spread of facial infection, and which cranial nerve lying directly inside the cavernous sinus lumen is typically the first to become paralyzed?",
      options: [
        "Septic Cavernous Sinus Thrombosis (CST); infection spreads from the facial vein via the superior/inferior ophthalmic veins (which lack valves) directly into the cavernous sinus; the Abducens Nerve (CN VI) is the earliest and most severely affected because it travels freely inside the sinus lumen adjacent to the internal carotid artery",
        "Orbital cellulitis alone; direct extension through the cribriform plate; CN I affected first",
        "Acute Angle-Closure Glaucoma; pupillary block; CN II affected first",
        "Tolosa-Hunt Syndrome; non-specific inflammation of superior orbital fissure"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic Septic Cavernous Sinus Thrombosis (CST): (1) Anatomical Venous Pathway: The facial vein communicates with the ophthalmic veins and pterygoid venous plexus, which are valveless and drain directly into the cavernous sinus from the facial 'danger area'; (2) Lumen Contents: CN VI (Abducens nerve) and the Internal Carotid Artery travel directly through the center of the cavernous sinus lumen bathed in venous blood, making CN VI the earliest and most vulnerable cranial nerve to become compressed or paralyzed (producing failure of eye abduction and horizontal diplopia); (3) Lateral Wall Infiltration: As thrombosis expands, CN III, IV, V1, and V2 located within the lateral dural wall become paralyzed, resulting in complete total ophthalmoplegia, ptosis, fixed dilated pupil, and midface sensory loss."
    }
  ]
};
