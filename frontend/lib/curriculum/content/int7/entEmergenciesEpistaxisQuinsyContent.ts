/**
 * Internship Core Clinical Postings: Otorhinolaryngology Emergencies: Severe Epistaxis & Quinsy Airway Triage
 * Authoritative ENT content derived from Cummings Otolaryngology, Scott-Brown's Otorhinolaryngology.
 * Mapped to NMC CBME Competencies: IN7.4, EN3.1, EN4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ENT_EMERGENCIES_EPISTAXIS_QUINSY_MODULE: PhysiologyLessonModule = {
  id: "int7-ent-emergencies-epistaxis-quinsy",
  unitCode: "IN7.4",
  title: "ENT Emergencies: Severe Epistaxis (Kiesselbach vs Woodruff Posterior Packing) & Peritonsillar Abscess (Quinsy I&D)",
  competencies: ["IN7.4", "EN3.1", "EN4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Otorhinolaryngology Emergencies: Epistaxis & Peritonsillar Abscess

Systematic vascular localization, posterior balloon tamponade, and trans-oral needle drainage prevent airway compromise and exsanguination.

---

## 1. Anterior vs Posterior Epistaxis Anatomical & Management Framework

$$\\begin{array}{lcccc}
\\hline
\\textbf{Epistaxis Type} & \\textbf{Anatomical Source / Arteries} & \\textbf{Primary Clinical Features} & \\textbf{Emergency Intervention Protocol} \\\\
\\hline
\\textbf{Anterior Epistaxis} & \\mathbf{\\text{Kiesselbach's Plexus (Little's Area):}} & \\text{Unilateral anterior bleeding, visible} & \\mathbf{\\text{Direct manual compression of nasal alae (10-15m),}} \\\\
(\\mathbf{90\\% \\text{ of cases}}) & \\text{Anterior ethmoidal, Sphenopalatine,} & \\text{vessel on septum; common in young} & \\text{topical vasoconstrictor (Oxymetazoline),} \\\\
& \\text{Greater palatine, Superior labial} & & \\mathbf{\\text{Silver nitrate (75\\%) chemical cautery}} \\\\
\\textbf{Posterior Epistaxis} & \\mathbf{\\text{Woodruff's Plexus / Sphenopalatine}} & \\text{Profuse bilateral bleeding flowing into} & \\mathbf{\\text{Posterior Nasal Packing (Dual-balloon catheter}} \\\\
(\\mathbf{10\\% \\text{ of cases}}) & \\text{artery branches (lateral nasal wall)} & \\text{posterior pharynx; elderly, hypertension} & \\mathbf{\\text{or Foley catheter 10-14 Fr with 5-10 mL saline)}} \\\\
\\hline
\\textbf{Mandatory Inpatient} & \\mathbf{\\text{Admit to Step-down/ICU with continuous pulse oximetry (nasopulmonary reflex apnea risk) +}} \\\\
\\textbf{Safety Rules} & \\mathbf{\\text{Prophylactic oral Augmentin (prevents Toxic Shock Syndrome from retained packs)}} \\\\
\\hline
\\end{array}$$

---

## 2. Peritonsillar Abscess (Quinsy) Diagnostic Tetrad & Drainage

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Feature} & \\textbf{Pathophysiological Manifestation} & \\textbf{Diagnostic Specificity} \\\\
\\hline
\\textbf{1. Severe Sore Throat} & \\text{Severe, progressive unilateral odynophagia referred to ear} & \\text{Hallmark symptom} \\\\
\\textbf{2. \"Hot Potato\" Voice} & \\text{Thick, muffled voice caused by edema of soft palate} & \\text{Characteristic pharyngeal sign} \\\\
\\textbf{3. Trismus} & \\mathbf{\\text{Inability to open mouth due to spasm of internal pterygoid muscle}} & \\mathbf{\\text{Differentiates quinsy from simple tonsillitis}} \\\\
\\textbf{4. Uvular Deviation} & \\mathbf{\\text{Marked displacement of the uvula toward the CONTRALATERAL side}} & \\mathbf{\\text{Confirms unilateral space-occupying abscess}} \\\\
\\hline
\\end{array}$$

---

## 3. Quinsy Needle Aspiration & Incision and Drainage (I&D)

- **Aspiration Landmark**:
  - Insert a **guarded 19-gauge needle** (leaving only the distal $1-1.5\\text{ cm}$ exposed with tape to **prevent accidental internal carotid artery puncture**) at the **point of maximal fluctuance** (midway between base of uvula and upper third molar).
- **Medical Adjuncts**:
  - **IV Ampicillin-Sulbactam ($1.5-3\\text{ g}$ q6h)** or Ceftriaxone $+$ Metronidazole.
  - **Single dose IV Dexamethasone ($8-10\\text{ mg}$)** to rapidly alleviate airway edema and trismus.
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old male presents with 4 days of worsening left-sided throat pain, fever, and severe difficulty swallowing his own saliva. He is drooling and speaks with a characteristic muffled 'hot potato' voice. Examination reveals marked trismus (inter-incisor distance 1.5 cm). Intraoral inspection demonstrates marked erythema and bulging of the left anterior tonsillar pillar with displacement of the left palatine tonsil inferomedially and deviation of the uvula to the right (contralateral) side. Tender left jugulodigastric lymphadenopathy is palpated.",
      question: "What is the diagnosis, and what is the definitive emergency bedside procedure and medical management?",
      options: [
        "Peritonsillar Abscess (Quinsy; left tonsillar bulge with contralateral uvular deviation, trismus, and hot-potato voice); emergency management requires needle aspiration or Incision & Drainage (I&D) at the point of maximal fluctuance using a guarded needle to avoid carotid injury PLUS intravenous Ampicillin-Sulbactam PLUS single-dose IV Dexamethasone for rapid airway edema reduction",
        "Acute viral pharyngitis; prescribe oral throat lozenges and discharge",
        "Epiglottitis; perform immediate blind digital palpation of the vallecula",
        "Diphtheria; administer oral erythromycin without drainage"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Peritonsillar Abscess (Quinsy): (1) Diagnostic Tetrad: Severe unilateral odynophagia, muffled 'hot potato' voice, trismus (internal pterygoid muscle irritation), and contralateral uvular displacement; (2) Emergency Procedure: Needle aspiration or Incision & Drainage (I&D) at the superior pole of the tonsillar fossa yields purulent fluid and provides immediate symptom relief; (3) Carotid Safety: The internal carotid artery lies posterolateral to the tonsil, mandating needle guarding (leaving only 1-1.5 cm tip exposed); (4) Medical Therapy: IV Ampicillin-Sulbactam + IV Dexamethasone (reduces pain, swelling, and trismus)."
    }
  ]
};
