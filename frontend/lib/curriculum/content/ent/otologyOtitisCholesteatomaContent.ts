/**
 * Otology, Chronic Otitis Media, Cholesteatoma & Vestibular Disorders Learning Content
 * Authoritative medical content derived from Scott-Brown, Cummings, Dhingra, and USMLE Step 2 CK ENT.
 * Mapped to NMC CBME Competencies: EN3.1, EN3.2, EN3.3, EN4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OTOLOGY_OTITIS_CHOLESTEATOMA_MODULE: PhysiologyLessonModule = {
  id: "ent-otology-cholesteatoma",
  unitCode: "EN3.1",
  title: "ENT: Otitis Media, Unsafe Cholesteatoma, Meniere's Disease & BPPV",
  competencies: ["EN3.1", "EN3.2", "EN3.3", "EN4.1"],
  estimatedMinutes: 140,
  organ3dTarget: "AUDITORY",
  markdownContent: `
# ENT: Otitis Media, Unsafe Cholesteatoma, Meniere's Disease & BPPV

Otology spans acute and chronic middle ear pathology, osteolytic destructive cholesteatomas, and peripheral labyrinthine vestibular disorders.

---

## 1. Chronic Suppurative Otitis Media (CSOM): Safe vs Unsafe Types

| Clinical Feature | Tubotympanic Type ("Safe" / Mucosal) | Atticoantral Type ("Unsafe" / Cholesteatoma) |
| :--- | :--- | :--- |
| **Site of Perforation** | **Central Perforation** in the **Pars Tensa**; intact annulus fibrosus around the rim. | **Attic (Pars Flaccida) or Posterosuperior Marginal Perforation** with bone erosion. |
| **Otorrhea Nature** | **Profuse, mucoid, non-foul-smelling**; intermittent (associated with URTI or water entry). | **Scanty, persistently purulent, FOUL-SMELLING (cheesy/fetid)**; continuous. |
| **Pathology / Histology** | Benign middle ear mucosal edema and hypertrophy; **no osteolytic bone erosion**. | **Keratinizing Stratified Squamous Epithelium** forming an expanding sac with osteolytic enzymes (collagenases, matrix metalloproteinases). |
| **Life-Threatening Complications** | Rare. | **High Risk**: Ossicular necrosis (incus long process), **Facial Nerve (CN VII) LMN Palsy**, Labyrinthine Fistula (**Fistula Test positive** / Hennebert sign), Sigmoid Sinus Thrombosis, **Otic Hydrocephalus**, and **Cerebellar / Temporal Lobe Brain Abscess**! |
| **Definitive Treatment** | Medical aural toilet $+$ topical ciprofloxacin; elective **Tympanoplasty** (myringoplasty). | **MANDATORY SURGICAL DECOMPRESSION**: **Canal Wall Down / Up Modified Radical Mastoidectomy (MRM)** to completely eradicate all diseased squamous epithelium. |

---

## 2. Acute Otitis Media (AOM) vs Otitis Media with Effusion (OME / "Glue Ear")

- **Acute Otitis Media (AOM)**:
  - Acute pyogenic infection (*S. pneumoniae*, non-typeable *H. influenzae*, *M. catarrhalis*).
  - Otoscopy: **Bulging, intensely erythematous tympanic membrane** with loss of bony landmarks and light reflex $\\pm$ spontaneous perforation with pulsating discharge (**Light-House Sign**).
  - 1st-line Antibiotic: **High-dose Oral Amoxicillin ($80-90\\text{ mg/kg/day}$)** (or Amoxicillin-Clavulanate).
- **Otitis Media with Effusion (OME / Glue Ear)**:
  - Non-purulent, sterile fluid collection behind an intact tympanic membrane without acute signs of infection; common in school-age children with Eustachian tube dysfunction / adenoid hypertrophy.
  - Otoscopy: Retracted, amber/dull drum with **Fluid Levels or Air Bubbles**; **Type B flat tympanogram**.
  - Management: 3-month watchful waiting $\\rightarrow$ **Myringotomy with Grommet (Tympanostomy Tube) Insertion** $\\pm$ Adenoidectomy.

---

## 3. Peripheral Vestibular Disorders & Dizziness Triage

| Vestibular Disorder | Pathophysiological Mechanism | Diagnostic Hallmark | Definitive Clinical Management |
| :--- | :--- | :--- | :--- |
| **Benign Paroxysmal Positional Vertigo (BPPV)** | **Canalithiasis**: Dislodged otoconia (calcium carbonate crystals) free-floating in the **Posterior Semicircular Canal**. | Brief ($< 1\\text{ minute}$) intense rotational vertigo triggered by head position changes (rolling in bed). **Dix-Hallpike Test Positive** (torsional upbeating nystagmus with latency and fatiguability). | **Epley Canalith Repositioning Maneuver** (moves otoconia back into the utricle). |
| **Ménière\'s Disease (Endolymphatic Hydrops)** | Distension of the endolymphatic system from impaired resorption in the endolymphatic sac. | **Classic Tetrad**: 1. Spontaneous episodic vertigo ($20\\text{ min to } 12\\text{ hours}$), 2. Fluctuating low-frequency SNHL, 3. Low-pitched roaring tinnitus, 4. Aural fullness. | Low-sodium diet ($< 2\\text{ g/day}$), Betahistine, Thiazide diuretics, Intratympanic Gentamicin / Dexamethasone. |
| **Vestibular Neuritis / Labyrinthitis** | Viral reactivation / inflammation of the vestibular nerve (CN VIII). | Sudden, prolonged, severe incapacitating vertigo ($> 24\\text{ hours}$) with horizontal-torsional nystagmus and vomiting. *(Labyrinthitis has hearing loss; Vestibular Neuritis has normal hearing)*. | Short-term vestibular sedatives (Dimenhydrinate), high-dose oral steroids, vestibular rehabilitation. |
| **Vestibular Schwannoma (Acoustic Neuroma)** | Benign tumor of Schwann cells of the inferior vestibular nerve in the **Cerebellopontine Angle (CPA)**. | **Unilateral progressive high-frequency SNHL**, asymmetric tinnitus, poor speech discrimination, loss of corneal reflex (CN V compression). | **Gadolinium-Enhanced MRI of Brain & Internal Auditory Canal (IAC)**; Stereotactic Radiosurgery (Gamma Knife) or Microsurgical Resection. |
`,
  clinicalVignettes: [
    {
      scenario: "A 36-year-old male presents with a 5-year history of scanty, persistently foul-smelling discharge from his left ear accompanied by progressive hearing loss. Over the past 3 days, he has developed left-sided facial weakness with inability to close his left eye or wrinkle his forehead, and brief dizzy spells whenever he presses his tragus. Otoscopic examination reveals a marginal attic perforation in the pars flaccida filled with whitish, cheesy epidermal flakes. Applying positive pneumatic pressure to the external auditory canal induces sudden vertigo and nystagmus (positive Fistula test).",
      question: "Which of the following represents the most urgent, definitive intervention?",
      options: [
        "Emergency Modified Radical Mastoidectomy (MRM)",
        "Topical Ciprofloxacin ear drops and oral amoxicillin",
        "Epley canalith repositioning maneuver",
        "Myringotomy with Grommet tube insertion"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient with persistent foul-smelling otorrhea, an attic perforation with cheesy keratin debris, a positive Fistula test (erosion into the lateral semicircular canal), and lower motor neuron Facial Nerve (CN VII) palsy has complicated, osteolytic Atticoantral Chronic Suppurative Otitis Media with Cholesteatoma. This is an impending otogenic surgical emergency threatening intracranial spread (meningitis, brain abscess). Immediate surgical exploration and Modified Radical Mastoidectomy (MRM) is mandatory to eradicate the bone-eroding cholesteatoma and decompress the facial nerve."
    }
  ]
};
