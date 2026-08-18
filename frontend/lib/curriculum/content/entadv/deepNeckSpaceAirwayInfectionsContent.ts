/**
 * Clinical Otolaryngology Advanced: Deep Neck Space Infections & Airway Emergencies
 * Authoritative head and neck surgery content derived from Cummings (7th ed.), Scott-Brown's (8th ed.).
 * Mapped to NMC CBME Competencies: EN1.1, EN1.2, MD47.1, SU45.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEEP_NECK_SPACE_AIRWAY_INFECTIONS_MODULE: PhysiologyLessonModule = {
  id: "ent-adv-deep-neck-infections",
  unitCode: "EN1.1",
  title: "Deep Neck Space Infections: Ludwig Angina, Peritonsillar Abscess (Quinsy) & Danger Space Mediastinitis",
  competencies: ["EN1.1", "EN1.2", "MD47.1", "SU45.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Deep Neck Space Infections: Ludwig Angina, Quinsy & Danger Space Mediastinitis

Deep neck space infections are rapidly progressive surgical emergencies carrying high risks of fatal upper airway obstruction, carotid artery erosion, and descending necrotizing mediastinitis.

---

## 1. Major Deep Neck Infections Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Infection Entity} & \\textbf{Anatomical Space \u0026 Origin} & \\textbf{Classic Physical Examination Signs} & \\textbf{Life-Threatening Risks} & \\textbf{Emergency Surgical Management} \\\\
\\hline
\\textbf{Ludwig} & \\mathbf{\\text{Bilateral Submandibular \u0026}} & \\mathbf{\\text{\"Woody\" brawny submandibular}} & \\mathbf{\\text{Acute upper airway occlusion}} & \\mathbf{\\text{Awake Fiberoptic Intubation /}} \\\\
\\textbf{Angina} & \\mathbf{\\text{Sublingual spaces (2nd/3rd molar)}} & \\mathbf{\\text{induration, ELEVATED TONGUE}} & (\\text{stridor, asphyxiation}) & \\mathbf{\\text{Tracheostomy } + \\text{ IV Unasyn } + \\text{ I\u0026D}} \\\\
\\textbf{Peritonsillar} & \\mathbf{\\text{Between tonsillar capsule \u0026}} & \\mathbf{\\text{Trismus, \"hot potato voice\", severe}} & \\text{Aspiration pneumonia, airway} & \\mathbf{\\text{Needle aspiration / Incision \u0026}} \\\\
\\textbf{Abscess (Quinsy)} & \\text{superior pharyngeal constrictor} & \\mathbf{\\text{sore throat, UVULAR DEVIATION}} & \\text{compromise, parapharyngeal spread} & \\mathbf{\\text{Drainage (I\u0026D) } + \\text{ IV Ceftriaxone}} \\\\
\\textbf{Retropharyngeal} & \\mathbf{\\text{Between buccopharyngeal \u0026}} & \\text{Neck stiffness, torticollis, stridor,} & \\mathbf{\\text{Descends into posterior}} & \\mathbf{\\text{Emergent transoral or transcervical}} \\\\
\\textbf{Abscess} & \\text{alar fascia (lymph nodes in kids)} & \\mathbf{\\text{widened prevertebral space on X-ray}} & \\mathbf{\\text{mediastinum via \"Danger Space\"}} & \\mathbf{\\text{drainage under general anesthesia}} \\\\
\\textbf{Parapharyngeal} & \\text{Inverted cone lateral to pharynx} & \\text{Trismus, medial tonsillar bulge,} & \\text{Septic thrombophlebitis of IJV} & \\text{Transcervical surgical drainage} \\\\
\\textbf{Abscess} & (\\text{pre- and post-styloid spaces}) & \\text{swelling at angle of mandible} & (\\mathbf{\\text{Lemierre Syndrome}}) + \\text{ Carotid blowout} & + \\text{ IV Vancomycin } + \\text{ Piperacillin} \\\\
\\hline
\\end{array}$$

---

## 2. Anatomical Fascial Planes & The "Danger Space"

- **Ludwig Angina Airway First Protocol**:
  - Infection originates most commonly from roots of lower $2\\text{nd}$ and $3\\text{rd}$ molars (apices lie below the mylohyoid ridge, draining directly into the submandibular space).
  - Rapid cellulitis expands into the sublingual space, pushing the floor of the mouth and tongue superiorly and posteriorly against the palate.
  - **AIRWAY MANDATE**: **Blind oral or nasotracheal intubation is STRICTLY CONTRAINDICATED** (triggers acute laryngospasm and complete airway loss). Secure the airway via **Awake Fiberoptic Intubation** or **Awake Tracheostomy** under local anesthesia before any surgical debridement.
- **The "Danger Space" (Space 4)**:
  - Lies between the **alar layer of deep cervical fascia anteriorly** and the **prevertebral layer posteriorly**, extending from the skull base all the way down to the diaphragm ($T1 - T2$ posterior mediastinum).
  - Offers zero anatomical resistance to the gravitational spread of purulent infection, leading to **Descending Necrotizing Mediastinitis**, septic shock, and $>40\\%\\text{ mortality}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 38-year-old male with poor dentition presents to the emergency department with 3 days of worsening neck swelling, severe difficulty swallowing (dysphagia), inability to open his mouth fully (trismus), and shortness of breath. On examination, he is sitting upright, leaning forward, and drooling saliva. There is diffuse, non-fluctuant, rock-hard 'woody' swelling and brawny induration over the bilateral submandibular and submental regions with severe tenderness. His floor of mouth is elevated and erythematous, forcing his tongue superiorly and posteriorly against the hard palate. His voice is muffled ('hot potato' quality), and inspiratory stridor is audible on auscultation.",
      question: "What is the diagnosis, what is the mandatory immediate airway strategy, and what is the definitive medical/surgical management?",
      options: [
        "Ludwig Angina; secure the airway immediately with awake fiberoptic intubation or awake tracheostomy under local anesthesia, followed by IV Ampicillin-Sulbactam and emergent surgical decompression/drainage",
        "Peritonsillar Abscess; perform immediate bedside needle aspiration without airway control",
        "Retropharyngeal Abscess; perform blind rapid sequence oral intubation immediately",
        "Acute Epiglottitis alone; administer nebulized racemic epinephrine and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic life-threatening presentation of Ludwig Angina: (1) Pathophysiology: A rapidly spreading cellulitis/phlegmon involving the bilateral submandibular, sublingual, and submental spaces, typically originating from odontogenic infection of the lower 2nd or 3rd molars; (2) Clinical Presentation: 'Woody' brawny submandibular induration, superior/posterior displacement of the tongue obstructing the oropharyngeal airway, drooling, trismus, and inspiratory stridor; (3) Mandatory Airway Protocol: The primary cause of death is acute asphyxiation. Blind endotracheal intubation or standard RSI is contraindicated due to risk of airway collapse. The airway must be secured urgently via Awake Fiberoptic Intubation in experienced hands or an Awake Tracheostomy under local anesthesia; (4) Medical & Surgical Management: Broad-spectrum intravenous antibiotics covering oral aerobes and anaerobes (IV Ampicillin-Sulbactam or Clindamycin + Ceftriaxone) and formal surgical incision and decompression of the submandibular/sublingual fascial spaces."
    }
  ]
};
