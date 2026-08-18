/**
 * Clinical Otolaryngology Advanced: Vestibular Pathology, Peripheral Vertigo & Audiology
 * Authoritative neurotology content derived from Cummings (7th ed.), Scott-Brown's (8th ed.).
 * Mapped to NMC CBME Competencies: EN3.1, EN3.2, MD47.2, SU45.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VESTIBULAR_AUDIOLOGY_NEUROMA_MODULE: PhysiologyLessonModule = {
  id: "ent-adv-vestibular-neuroma",
  unitCode: "EN3.1",
  title: "Vestibular Pathology & Neurotology: BPPV (Dix-Hallpike / Epley), Ménière Disease & Acoustic Neuroma",
  competencies: ["EN3.1", "EN3.2", "MD47.2", "SU45.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Vestibular Pathology & Neurotology: BPPV, Ménière Disease & Acoustic Neuroma

Peripheral vestibular and retrocochlear disorders require targeted neurotological testing, audiological audiogram interpretation, and neuroimaging to differentiate benign canalithiasis from intracranial neoplasms.

---

## 1. Peripheral Vertigo & Retrocochlear Pathology Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Etiology \u0026 Pathophysiology} & \\textbf{Duration \u0026 Triggers} & \\textbf{Audiometric / Diagnostic Signs} & \\textbf{Gold Standard Management} \\\\
\\hline
\\textbf{BPPV} & \\mathbf{\\text{Canalithiasis (otoconia displaced from}} & \\mathbf{\\text{Brief seconds (\u003c 1 minute);}} & \\mathbf{\\text{Dix-Hallpike: geotropic upbeating}} & \\mathbf{\\text{Epley Canalith Repositioning}} \\\\
(\\text{Positional}) & \\mathbf{\\text{utricle into posterior semicircular canal)}} & \\text{triggered by head turn / roll in bed} & \\mathbf{\\text{torsional nystagmus with latency}} & \\mathbf{\\text{Maneuver (particle repositioning)}} \\\\
\\textbf{M\u00e9ni\u00e8re} & \\mathbf{\\text{Idiopathic Endolymphatic Hydrops}} & \\mathbf{\\text{Episodic (20 min - 12 hours);}} & \\mathbf{\\text{Fluctuating LOW-FREQUENCY SNHL,}} & \\mathbf{\\text{Dietary salt restriction (\u003c2 g/day)}} \\\\
\\textbf{Disease} & (\\text{excess fluid in membranous labyrinth}) & \\text{spontaneous unprovoked attacks} & \\mathbf{\\text{roaring tinnitus, aural fullness}} & + \\text{ Hydrochlorothiazide } \\pm \\text{ Steroids} \\\\
\\textbf{Vestibular} & \\text{Post-viral inflammation of superior /} & \\text{Continuous severe vertigo lasting} & \\text{Unidirectional horizontal nystagmus} & \\text{Short-term vestibular suppressants} \\\\
\\textbf{Neuritis} & \\text{inferior vestibular nerve (CN VIII)} & \\mathbf{2 - 5\\text{ days}}\\text{; nausea, ataxia} & (\\text{fast phase away from lesion}); \\mathbf{\\text{NO SNHL}} & (\\text{Meclizine } \\le 48\\text{h}) + \\text{ rehab} \\\\
\\textbf{Vestibular} & \\mathbf{\\text{Benign Schwannoma of CN VIII at}} & \\text{Insidious subacute unsteadiness} & \\mathbf{\\text{Asymmetric progressive HIGH-FREQ}} & \\mathbf{\\text{Gadolinium-enhanced MRI of IACs;}} \\\\
\\textbf{Schwannoma} & \\mathbf{\\text{cerebellopontine angle (CPA / IAC)}} & (\\text{rarely acute true vertigo}) & \\mathbf{\\text{SNHL with poor speech discrimination}} & \\text{Gamma Knife radiosurgery / Resection} \\\\
\\hline
\\end{array}$$

---

## 2. Diagnostic Testing & Neurotological Pearls

- **Dix-Hallpike Test & Epley Maneuver**:
  - The patient is brought from a seated position to supine with the head turned $45^\circ$ to one side and extended $20^\circ$ off the examination table.
  - A positive test produces: (1) Latency of $2-10\\text{ seconds}$; (2) Paroxysmal rotational/torsional upbeating nystagmus lasting $<60\\text{ seconds}$; (3) Subjective vertigo; (4) Fatigability on repeated testing.
  - **Epley Maneuver**: Rotates the head sequentially through $90^\circ$ increments to sweep otolith debris from the posterior canal back into the utricle.
- **Audiological Differences**:
  - **Ménière Disease**: Affects **low frequencies ($125 - 1{,}000\\text{ Hz}$)** early in disease course (ascending pure tone audiogram curve).
  - **Vestibular Schwannoma (Acoustic Neuroma)**: Affects **high frequencies ($4{,}000 - 8{,}000\\text{ Hz}$)** with **speech discrimination score (SDS) disproportionately poor** relative to pure tone threshold.
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old female presents to the neurotology clinic with recurrent episodes of severe spinning vertigo, nausea, and vomiting over the past 6 months. Each episode lasts between 2 and 4 hours and is preceded by an uncomfortable sensation of fullness and pressure in her left ear, accompanied by a low-pitched roaring sound. Between episodes, she feels well except for progressive hearing loss in her left ear. Physical examination between attacks shows normal cranial nerves and no spontaneous nystagmus. Pure-tone audiometry demonstrates a 45 dB sensorineural hearing loss in the left ear isolated to low frequencies (250, 500, and 1,000 Hz), with normal hearing in the right ear. Brain MRI with gadolinium is unremarkable.",
      question: "What is the diagnosis, what is the underlying pathophysiology, and what is the standard first-line medical management?",
      options: [
        "Ménière Disease (Idiopathic Endolymphatic Hydrops); excess accumulation of endolymph within the membranous labyrinth of the inner ear; initiate strict dietary sodium restriction (<2,000 mg/day) and oral Hydrochlorothiazide/Triamterene diuretic therapy",
        "Benign Paroxysmal Positional Vertigo; perform an immediate Epley canalith repositioning maneuver",
        "Vestibular Schwannoma; schedule urgent microsurgical retrosigmoid craniotomy",
        "Vestibular Migraine; prescribe daily high-dose oral Sumatriptan"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with the classic diagnostic tetrad of Ménière Disease (Idiopathic Endolymphatic Hydrops): (1) Episodic spontaneous spinning vertigo lasting 20 minutes to 12 hours (here 2-4 hours); (2) Fluctuating Low-Frequency Sensorineural Hearing Loss (confirmed on audiometry); (3) Low-pitched roaring tinnitus; and (4) Aural fullness in the affected ear. Pathophysiology involves decreased resorption or increased production of endolymph in the scala media, causing dilation and periodic microscopic ruptures of the membranous labyrinth with mixing of potassium-rich endolymph and perilymph. First-line maintenance therapy consists of dietary sodium restriction (<2 g/day) to decrease fluid retention, avoidance of caffeine/alcohol/tobacco, and maintenance oral diuretic therapy (e.g., Hydrochlorothiazide-Triamterene)."
    }
  ]
};
