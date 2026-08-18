/**
 * Audiometry, Tuning Fork Tests & Hearing Impairment Learning Content
 * Authoritative medical content derived from Scott-Brown, Cummings, Dhingra, and USMLE Step 2 CK ENT.
 * Mapped to NMC CBME Competencies: EN1.1, EN1.2, EN1.3, EN2.1, EN2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AUDIOMETRY_TUNING_FORK_MODULE: PhysiologyLessonModule = {
  id: "ent-audiometry-tuning-fork",
  unitCode: "EN1.1",
  title: "ENT: Tuning Fork Tests (Rinne, Weber), Pure Tone Audiometry & Tympanometry",
  competencies: ["EN1.1", "EN1.2", "EN1.3", "EN2.1", "EN2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "AUDITORY",
  markdownContent: `
# ENT: Tuning Fork Tests (Rinne, Weber), Pure Tone Audiometry & Tympanometry

Accurate auditory triage discriminates between conductive hearing loss (**CHL**, external/middle ear dysfunction) and sensorineural hearing loss (**SNHL**, cochlea/CN VIII dysfunction).

---

## 1. Classical Tuning Fork Tests (512 Hz Frequency — The Gold Standard)

| Tuning Fork Test | Test Protocol & Mechanism | Clinical Interpretation |
| :--- | :--- | :--- |
| **Rinne Test** | Compares **Air Conduction (AC)** at external auditory meatus with **Bone Conduction (BC)** over the mastoid process. | • **Rinne Positive ($\\text{AC} > \\text{BC}$)**: Normal hearing OR Sensorineural Hearing Loss.<br>• **Rinne Negative ($\\text{BC} > \\text{AC}$)**: **Conductive Hearing Loss** (indicates an Air-Bone Gap $> 15\\text{–}20\\text{ dB}$).<br>• **False Negative Rinne**: Severe unilateral dead ear; bone sound crosses skull to normal contralateral ear. |
| **Weber Test** | Vibrating tuning fork stem placed on midline skull (**Vertex / Mid-forehead / Incisors**). | • **Midline (No lateralization)**: Normal hearing OR symmetrical bilateral loss.<br>• **Lateralizes to AFFECTED / POORER ear**: **Conductive Hearing Loss** *(ambient masking noise blocked in diseased ear)*.<br>• **Lateralizes to UNAFFECTED / BETTER ear**: **Sensorineural Hearing Loss** *(intact sensorineural apparatus hears better)*. |
| **Schwabach Test** | Compares patient\'s bone conduction to examiner\'s normal bone conduction. | • **Prolonged / Lengthened**: Conductive Hearing Loss.<br>• **Reduced / Shortened**: Sensorineural Hearing Loss. |
| **Bing Test** | Tuning fork on mastoid; intermittently occlude external auditory meatus with tragus. | • **Bing Positive (Sound louder with occlusion)**: Normal or SNHL.<br>• **Bing Negative (No change in sound loudness)**: Conductive Hearing Loss. |

---

## 2. Pure Tone Audiometry (PTA) Signatures

$$\\text{Air-Bone Gap (ABG)} = \\text{Air Conduction Threshold (dB)} - \\text{Bone Conduction Threshold (dB)}$$

1. **Conductive Hearing Loss (CHL)**:
   - Bone Conduction thresholds are normal ($\le 25\\text{ dB}$); Air Conduction thresholds are elevated.
   - **Pathognomonic ABG $> 10\\text{ dB}$**.
2. **Sensorineural Hearing Loss (SNHL)**:
   - Both Air and Bone Conduction thresholds are elevated equally (**$\\text{ABG} < 10\\text{ dB}$**).
   - **Noise-Induced Hearing Loss (NIHL)**: Symmetrical sensory notch maximal at **$4000\\text{ Hz}$ ($4\\text{ kHz}$ Acoustic Dip)**.
   - **Presbycusis**: Symmetrical, bilateral, down-sloping high-frequency SNHL in elderly patients.
   - **Otosclerosis**: **Carhart\'s Notch**—a characteristic dip in bone conduction specifically at **$2000\\text{ Hz}$ ($2\\text{ kHz}$)** caused by mechanical stapes fixation.

---

## 3. Jerger Tympanometry Classification

| Jerger Type | Peak Compliance & Pressure (daPa) | Middle Ear Pathology |
| :--- | :--- | :--- |
| **Type A** | Normal peak compliance ($0.3-1.6\\text{ mL}$) at $-100\\text{ to } +100\\text{ daPa}$. | **Normal middle ear** aeration and intact ossicular chain. |
| **Type As (Shallow)** | Normal pressure peak, but **reduced compliance / stiffness ($< 0.3\\text{ mL}$)**. | **Otosclerosis** (stapes footplate ankylosis) or tympanosclerosis. |
| **Type Ad (Deep)** | Normal pressure, but **hypercompliant / infinite peak ($> 1.6\\text{ mL}$)**. | **Ossicular Chain Disruption** (incus dislocation) or flaccid atrophic eardrum. |
| **Type B (Flat)** | **No compliance peak / flat line across all pressures**. | • Normal ear canal volume ($0.6-2.0\\text{ mL}$) $\\implies$ **Otitis Media with Effusion (OME / "Glue Ear")**.<br>• Large canal volume ($> 2.5\\text{ mL}$) $\\implies$ **Tympanic Membrane Perforation** or patent grommet. |
| **Type C** | Peak shifted to **marked negative pressure ($< -100\\text{ daPa}$)**. | **Eustachian Tube Dysfunction** or early stage before fluid accumulation. |
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female presents with progressive hearing loss in her right ear over the past 2 years. Her mother had early hearing loss requiring surgery. Otoscopic examination shows bilateral normal tympanic membranes with a faint pinkish glow over the promontory (Schwartze's sign). Tuning fork testing (512 Hz) reveals: Right ear: BC > AC (Rinne negative); Left ear: AC > BC (Rinne positive); Weber test lateralizes to the right ear. Pure Tone Audiometry reveals a conductive hearing loss in the right ear with a notch in bone conduction at 2000 Hz (Carhart's notch). Tympanometry yields a Type As curve.",
      question: "Which of the following is the underlying diagnosis, and what is the definitive surgical management of choice?",
      options: [
        "Otosclerosis; Stapedotomy / Stapedectomy with Teflon piston prosthesis",
        "Otitis Media with Effusion; Myringotomy with Grommet tube insertion",
        "Vestibular Schwannoma; Translabyrinthine tumor resection",
        "Cholesteatoma; Modified Radical Mastoidectomy"
      ],
      correctAnswerIndex: 0,
      explanation: "A young female with a positive family history presenting with conductive hearing loss (Rinne negative in right ear, Weber lateralizing to right ear), Schwartze sign (promontory hypervascularity), Carhart's notch at 2000 Hz on bone conduction, and a Type As (shallow) tympanogram has classic Otosclerosis (stapedial fixation). The definitive surgical treatment of choice is Stapedotomy (or Stapedectomy), where the fixed stapes suprastructure is removed and replaced with a micro-prosthesis (such as a Teflon piston) placed into the vestibule."
    }
  ]
};
