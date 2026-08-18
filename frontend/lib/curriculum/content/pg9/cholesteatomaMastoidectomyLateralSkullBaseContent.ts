/**
 * Postgraduate Advanced Otorhinolaryngology & Otology: Cholesteatoma, Mastoidectomy & Lateral Skull Base
 * Authoritative otologic surgical content derived from AAO-HNS Otology, Glasscock-Shambaugh Surgery of the Ear.
 * Mapped to NMC PG CBME Competencies: PG9.3, ENT3.1, ENT3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE: PhysiologyLessonModule = {
  id: "pg9-cholesteatoma-mastoidectomy-lateral-skull-base",
  unitCode: "PG9.3",
  title: "Cholesteatoma: Labyrinthine Fistula, Canal Wall Up/Down Mastoidectomy & Cochlear Implantation",
  competencies: ["PG9.3", "ENT3.1", "ENT3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Cholesteatoma, Mastoidectomy Techniques & Lateral Skull Base Surgery

Middle ear cholesteatoma is an aggressive, destructive lesion of keratinizing squamous epithelium capable of enzymatic bone resorption, leading to labyrinthine fistulae, facial nerve paralysis, and intracranial otogenic complications.

---

## 1. Complications of Cholesteatoma & Anatomic Danger Zones

$$\\begin{array}{lcccc}
\\hline
\\textbf{Complication / Target} & \\textbf{Anatomic Structure} & \\textbf{Clinical Hallmarks} & \\textbf{Diagnostic Assessment} \\\\
\\hline
\\textbf{Ossicular Destruction} & \\mathbf{\\text{Incus long process (80\\%)}} & \\text{Conductive hearing loss (40-60 dB)} & \\text{Pure tone audiometry; ossicular reconstruction} \\\\
\\textbf{Labyrinthine Fistula} & \\mathbf{\\text{Lateral Semicircular Canal (LSCC)}} & \\mathbf{\\text{Vertigo with tragal pressure (Hennebert sign),}} & \\mathbf{\\text{High-resolution temporal bone CT;}} \\\\
& & \\mathbf{\\text{sound-induced vertigo (Tullio phenomenon)}} & \\text{fistula test; seal with fascia/bone wax} \\\\
\\textbf{Facial Nerve Dehiscence} & \\text{Tympanic segment (above oval window)} & \\text{Acute facial palsy / hemifacial twitch} & \\text{Intraoperative continuous EMG monitoring (NIM)} \\\\
\\textbf{Intracranial Extension} & \\text{Tegmen tympani / antri / Sigmoid plate} & \\text{Otogenic meningitis, brain abscess,} & \\text{Non-EPI DWI MRI (detects residual cholesteatoma)} \\\\
& & \\text{lateral sinus thrombophlebitis} & \\\\
\\hline
\\end{array}$$

---

## 2. Mastoidectomy Approaches & Cochlear Implant Access

$$\\begin{array}{lcccc}
\\hline
\\textbf{Surgical Technique} & \\textbf{Posterior Canal Wall Status} & \\textbf{Indications \\& Trade-offs} \\\\
\\hline
\\textbf{Canal Wall Up (CWU)} & \\mathbf{\\text{Preserved (intact)}} & \\text{Maintains normal anatomy, no water precautions; higher recidivism risk;} \\\\
& & \\text{requires second-look surgery or DWI MRI surveillance} \\\\
\\textbf{Canal Wall Down (CWD)} & \\mathbf{\\text{Removed (exteriorized bowl)}} & \\mathbf{\\text{Extensive disease, labyrinthine fistula, contracted mastoid, only-hearing ear;}} \\\\
& & \\text{requires wide meatoplasty; allows direct in-office inspection} \\\\
\\textbf{Facial Recess Approach} & \\text{Posterior tympanotomy} & \\mathbf{\\text{Borders: Facial nerve, chorda tympani, incudal buttress;}} \\\\
& & \\mathbf{\\text{standard portal for Cochlear Implant round window electrode insertion}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 38-year-old male presents with chronic, foul-smelling, non-bloody otorrhea from his left ear for 2 years and recent progressive hearing loss. Over the past 2 weeks, he has experienced brief episodes of severe true rotational vertigo and nausea whenever he cleans his ear with a cotton swab or presses on his left tragus (positive Hennebert sign). Otomicroscopy reveals an attic retraction pocket filled with pearly white keratin debris and granulation tissue eroding the scutum. High-resolution temporal bone CT demonstrates a soft-tissue mass filling the epitympanum and antrum, with erosion of the incus long process and a bony dehiscence over the dome of the lateral semicircular canal.",
      question: "What is the diagnosis, what specific complication is present, and what is the operative management strategy?",
      options: [
        "Attic cholesteatoma complicated by a Lateral Semicircular Canal (LSCC) Labyrinthine Fistula; perform Canal Wall Down (CWD) or intact canal tympanomastoidectomy with facial nerve monitoring; carefully dissect the cholesteatoma matrix off the LSCC fistula (leaving the matrix intact over the fistula until the end of surgery to protect endolymphatic integrity, then immediately sealing the defect with temporalis fascia, perichondrium, or bone patte)",
        "Acute otitis media; prescribe oral Amoxicillin-Clavulanate only",
        "Meniere's disease; start oral low-salt diet and hydrochlorothiazide",
        "Vestibular neuritis; administer oral meclizine and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Cholesteatoma with a Labyrinthine Fistula: (1) Pathophysiology: Enzymatic osteolysis of the lateral semicircular canal creates a fistula, causing vertigo on pneumatic or mechanical pressure (positive Hennebert sign/fistula test); (2) Surgical Principle: Careful microdissection with immediate dural/fascial graft sealing over the fistula prevents acute sensorineural hearing loss (dead ear) and suppurative labyrinthitis."
    }
  ]
};
