/**
 * Postgraduate Advanced Otorhinolaryngology: Deep Neck Space Infections & Emergency Airway
 * Authoritative surgical content derived from AAO-HNS Deep Neck Infection Guidelines, Cummings Otolaryngology.
 * Mapped to NMC PG CBME Competencies: PG9.4, ENT4.1, ENT4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE: PhysiologyLessonModule = {
  id: "pg9-deep-neck-space-infections-emergency-airway",
  unitCode: "PG9.4",
  title: "Deep Neck Space Infections: Parapharyngeal, Retropharyngeal, Danger Space Mediastinitis & Ludwig's Angina",
  competencies: ["PG9.4", "ENT4.1", "ENT4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Deep Neck Space Infections, Danger Space Mediastinitis & Surgical Airway Control

Infections of the deep cervical fascial spaces present high risk of fatal airway compromise and catastrophic descending necrotizing mediastinitis.

---

## 1. Deep Cervical Fascia Compartments & Clinical Features

$$\\begin{array}{lcccc}
\\hline
\\textbf{Fascial Space} & \\textbf{Anatomic Boundaries} & \\textbf{Clinical Hallmarks} & \\textbf{Major Life-Threatening Complications} \\\\
\\hline
\\textbf{Parapharyngeal (PPS)} & \\text{Pre-styloid (fat, internal maxillary art)} & \\mathbf{\\text{Trismus (medial pterygoid spasm),}} & \\mathbf{\\text{Lemierre syndrome (IJV septic thrombophlebitis),}} \\\\
& \\text{Post-styloid (carotid sheath: ICA, IJV, IX-XII)} & \\text{medial tonsil push, neck fullness} & \\text{carotid artery erosion / rupture} \\\\
\\textbf{Retropharyngeal} & \\text{Between buccopharyngeal and alar fascia;} & \\text{Odynophagia, torticollis, posterior pharynx bulge} & \\text{Airway obstruction; tracks to T1-T2 level} \\\\
& \\text{skull base to T1-T2} & & \\\\
\\textbf{Danger Space (Space 4)} & \\mathbf{\\text{Between alar and prevertebral fascia;}} & \\mathbf{\\text{Rapidly tracks from skull base}} & \\mathbf{\\text{Descending Necrotizing Mediastinitis}} \\\\
& \\mathbf{\\text{extends all the way down to DIAPHRAGM}} & \\mathbf{\\text{directly into posterior mediastinum}} & \\mathbf{\\text{(pleural effusion, pericarditis, shock)}} \\\\
\\textbf{Ludwig's Angina} & \\mathbf{\\text{Bilateral submandibular (sublingual +}} & \\mathbf{\\text{''Woody'' floor of mouth induration,}} & \\mathbf{\\text{Rapid acute airway occlusion;}} \\\\
& \\mathbf{\\text{submylohyoid) spaces; 2nd/3rd molar roots}} & \\mathbf{\\text{tongue displaced superiorly/posteriorly}} & \\mathbf{\\text{stridor, tripoding}} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Airway Management & Transcervical Drainage Protocols

$$\\begin{array}{lcccc}
\\hline
\\textbf{Management Component} & \\textbf{Recommended Standard Protocol} & \\textbf{CRITICAL SAFETY CONTRAINDICATION} \\\\
\\hline
\\textbf{Airway Control} & \\mathbf{\\text{Awake Flexible Fiberoptic Intubation or}} & \\mathbf{\\text{AVOID BLIND ORAL INTUBATION OR PARALYTICS}} \\\\
& \\mathbf{\\text{Awake Tracheostomy under local anesthesia}} & (\\mathbf{\\text{loss of tone causes immediate airway collapse!}}) \\\\
\\textbf{Antimicrobial Regimen} & \\text{Ampicillin-Sulbactam } 3\\text{ g IV Q6H} + \\text{ Metronidazole} & \\text{Covers polymicrobial oral aerobes + anaerobes} \\\\
& \\pm \\text{ Vancomycin (for MRSA)} & \\\\
\\textbf{Surgical Drainage} & \\mathbf{\\text{Urgent Transcervical Incision \\& Drainage}} & \\text{Drain all involved fascial compartments; debride necrotic tissue} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male presents with severe throat pain, inability to swallow his own saliva (drooling), and progressive difficulty breathing over 24 hours following the extraction of an infected lower third molar 3 days ago. On examination, he is tachypneic, febrile (39.2 C), and leaning forward in a 'sniffing' position with inspiratory stridor. The anterior submandibular and sublingual regions are intensely swollen, tender, and rock-hard ('woody induration') without fluctuance. The tongue is elevated and displaced posteriorly against the soft palate. Transnasal flexible laryngoscopy reveals severe supraglottic crowding.",
      question: "What is the diagnosis, what is the safest emergency airway securing technique, and what is the definitive surgical management?",
      options: [
        "Ludwig's Angina (bilateral submandibular space gangrenous cellulitis); immediately secure the airway via Awake Flexible Fiberoptic Intubation or Awake Tracheostomy under local anesthesia in the operating room (avoiding neuromuscular paralysis or blind oral intubation which precipitates total airway collapse), followed by broad-spectrum IV antibiotics (Ampicillin-Sulbactam + Metronidazole) and urgent bilateral transcervical incision and drainage with division of the mylohyoid muscle",
        "Peritonsillar abscess; perform immediate needle aspiration of the anterior tonsillar pillar in the ED without securing the airway",
        "Acute epiglottitis; administer nebulized racemic epinephrine and admit to the floor",
        "Anaphylactic angioedema; administer IM Epinephrine and IV diphenhydramine only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Ludwig's Angina: (1) Pathophysiology: Odontogenic spread from lower molars to the sublingual and submaxillary spaces pushes the tongue up and back into the airway; (2) Airway Priority: Rapidly fatal from airway obstruction; awake fiberoptic intubation or awake tracheostomy without paralysis is mandatory; (3) Surgical Decompression: Transcervical release of the submandibular spaces and mylohyoid muscle provides rapid relief of tissue tension."
    }
  ]
};
