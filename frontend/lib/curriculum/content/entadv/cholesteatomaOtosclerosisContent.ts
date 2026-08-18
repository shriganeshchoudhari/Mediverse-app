/**
 * Clinical Otolaryngology Advanced: Chronic Otitis Media, Cholesteatoma & Otosclerosis
 * Authoritative otology content derived from Cummings (7th ed.), Glasscock-Shambaugh Surgery of the Ear.
 * Mapped to NMC CBME Competencies: EN5.1, EN5.2, MD47.3, SU45.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHOLESTEATOMA_OTOSCLEROSIS_MODULE: PhysiologyLessonModule = {
  id: "ent-adv-cholesteatoma-otosclerosis",
  unitCode: "EN5.1",
  title: "Otology & Middle Ear Disorders: Cholesteatoma (Attic Retraction / Mastoidectomy) & Otosclerosis (Carhart Notch)",
  competencies: ["EN5.1", "EN5.2", "MD47.3", "SU45.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Otology & Middle Ear Disorders: Cholesteatoma & Otosclerosis

Middle ear pathologies present with progressive conductive hearing loss, chronic otorrhea, and bony osteolysis requiring precise microscopic and endoscopic reconstructive surgery.

---

## 1. Middle Ear Disorders Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Primary Pathophysiology} & \\textbf{Otoscopic \u0026 Clinical Findings} & \\textbf{Audiometry / Imaging Hallmarks} & \\textbf{Definitive Surgical Management} \\\\
\\hline
\\textbf{Cholesteatoma} & \\mathbf{\\text{Expansile keratinizing squamous}} & \\mathbf{\\text{Attic (pars flaccida) retraction pocket,}} & \\mathbf{\\text{High-Res Temporal Bone CT:}} & \\mathbf{\\text{Tympanomastoidectomy}} \\\\
& \\mathbf{\\text{epithelial cyst with collagenase}} & \\mathbf{\\text{white keratin debris, foul painless otorrhea}} & \\text{scutum blunting, ossicular/tegmen erosion} & (\\text{CWU vs CWD}) + \\text{ TORP/PORP} \\\\
\\textbf{Otosclerosis} & \\mathbf{\\text{Autosomal dominant otic capsule}} & \\text{Normal tympanic membrane} & \\mathbf{\\text{Carhart Notch (dip in bone conduction}} & \\mathbf{\\text{Stapedotomy / Stapedectomy}} \\\\
& \\mathbf{\\text{bone remodeling; stapes fixation}} & (\\text{occasional Schwartze sign - promontory flush}) & \\mathbf{\\text{at } 2{,}000\\text{ Hz}); Conductive hearing loss} & + \\text{ Teflon piston prosthesis} \\\\
\\textbf{Tympanic} & \\text{Infection (AOM) or acoustic /} & \\text{Perforation in pars tensa (central),} & \\text{Conductive hearing loss proportional} & \\text{Tympanoplasty (underlay / overlay} \\\\
\\textbf{Perforation} & \\text{barotrauma / direct trauma} & \\text{dry middle ear mucosa} & \\text{to size of tympanic membrane defect} & \\text{temporalis fascia / cartilage graft)} \\\\
\\hline
\\end{array}$$

---

## 2. Surgical Principles & Complications

- **Cholesteatoma Osteolysis & Complications**:
  - Osteoclasts and matrix metalloproteinases (MMPs) in the perimatrix digest surrounding bone.
  - **Critical Structures at Risk**:
    1. **Long process of Incus**: Most common ossicle eroded, causing maximal conductive hearing loss ($>30 - 50\\text{ dB}$ air-bone gap).
    2. **Facial Nerve Canal (Tympanic segment)**: Dehiscence leading to Lower Motor Neuron Facial Palsy (CN VII).
    3. **Lateral Semicircular Canal**: Erosion produces a labyrinthine fistula, causing **Hennebert sign / positive fistula test** (nystagmus and vertigo triggered by pneumatic otoscopy pressure).
    4. **Tegmen Tympani / Antri**: Dural erosion leading to meningitis, temporal lobe or cerebellar brain abscess, and sigmoid sinus thrombosis.
  - **Surgical Mandate**: **Canal Wall Up (CWU)** vs **Canal Wall Down (CWD)** Tympanomastoidectomy to completely eradicate squamous epithelium.
- **Otosclerosis & Stapedotomy**:
  - Bone remodeling in the *fissula ante fenestram* locks the stapes footplate in the oval window.
  - **Audiogram**: Air-bone gap with characteristic **Carhart's Notch** (artifactual dip in bone conduction thresholds at $2{,}000\\text{ Hz}$ due to mechanical loss of middle ear inertial resonance).
  - **Stapedotomy**: Micro-laser or micro-drill fenestration of the fixed stapes footplate, inserting a fluoroplastic/titanium piston prosthesis crimped onto the long process of the incus.
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male with a history of recurrent childhood ear infections presents with a 9-month history of persistent, foul-smelling, painless yellowish discharge from his right ear and progressive right-sided hearing loss. Over the past 2 weeks, he has noticed intermittent episodes of dizziness and spinning vertigo whenever he uses a Q-tip to clean his right ear canal. On otoscopic examination, the right tympanic membrane reveals a deep retraction pocket in the pars flaccida (attic) filled with whitish, cheesy keratinaceous debris and granulation tissue. Pneumatic otoscopy in the right ear produces immediate vertical-torsional nystagmus and vertigo (positive fistula test). Pure-tone audiometry demonstrates a 40 dB conductive hearing loss in the right ear.",
      question: "What is the diagnosis, what structure has been eroded by the disease process, and what is the definitive management?",
      options: [
        "Attic Cholesteatoma with erosion of the lateral semicircular canal (labyrinthine fistula); obtain high-resolution temporal bone CT without contrast and perform urgent Tympanomastoidectomy",
        "Otosclerosis; schedule an immediate Stapedotomy with piston prosthesis",
        "Acute Otitis Externa; prescribe topical Ciprofloxacin-Dexamethasone ear drops alone",
        "Vestibular Schwannoma; perform retrosigmoid craniotomy for tumor excision"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical and otoscopic hallmarks of an Attic Cholesteatoma complicated by a Labyrinthine Fistula: (1) Presentation: Chronic painless, foul-smelling otorrhea with conductive hearing loss and a white keratin-filled retraction pocket in the attic (pars flaccida); (2) Fistula Test Positivity: The onset of vertigo and nystagmus with pneumatic otoscopy or external canal pressure (positive fistula test) signifies enzymatic osteolysis eroding the bony capsule of the Lateral Semicircular Canal, creating a direct communication between the middle ear cavity and the membranous labyrinth; (3) Management: High-resolution temporal bone CT (bone window) to delineate ossicular destruction and tegmen/canal erosion, followed by formal Tympanomastoidectomy (Canal Wall Up or Canal Wall Down) to completely exteriorize/remove the cholesteatoma matrix and seal the labyrinthine fistula."
    }
  ]
};
