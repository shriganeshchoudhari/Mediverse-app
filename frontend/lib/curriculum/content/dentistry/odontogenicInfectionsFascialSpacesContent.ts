/**
 * Dentistry & Maxillofacial Surgery: Odontogenic Deep Fascial Space Infections & Ludwig's Angina
 * Authoritative medical content derived from Peterson's OMFS, Fonseca's Oral and Maxillofacial Surgery, and USMLE/INBDE.
 * Mapped to NMC CBME Competencies: DE3.1, DE3.2, DE4.1, DE4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ODONTOGENIC_INFECTIONS_FASCIAL_SPACES_MODULE: PhysiologyLessonModule = {
  id: "dentistry-odontogenic-infections-fascial-spaces",
  unitCode: "DE3.1",
  title: "Odontogenic Fascial Space Infections, Ludwig's Angina & Descending Mediastinitis",
  competencies: ["DE3.1", "DE3.2", "DE4.1", "DE4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Odontogenic Fascial Space Infections, Ludwig's Angina & Descending Mediastinitis

Severe deep neck space infections of odontogenic origin represent life-threatening emergencies requiring immediate surgical airway management and decompression.

---

## 1. Pathogenesis of Odontogenic Spread & The Mylohyoid Muscle Boundary

- **Pathogenesis Cascade**: Caries $\rightarrow$ Pulp Necrosis $\rightarrow$ Periapical Abscess $\rightarrow$ Perforation of Cortical Plate $\rightarrow$ Fascial Space Spread.

The anatomic attachment of the **Mylohyoid Muscle** on the internal oblique ridge of the mandible dictates the pathway of infection from lower teeth:
- **Roots ABOVE Mylohyoid Line (Incisors, Canines, Premolars, 1st Molar)**: Infection perforates lingually into the **Sublingual Space**.
- **Roots BELOW Mylohyoid Line (2nd & 3rd Molars)**: Root apices extend below the mylohyoid insertion $\\implies$ Lingual perforation enters directly into the **Submandibular Space**!

---

## 2. Ludwig's Angina: Pathophysiology & Emergency Protocol

### Clinical Definition & Key Hallmarks
- **Ludwig\'s Angina**: A rapidly spreading, bilateral, gangrenous cellulitis involving **ALL THREE primary spaces of the floor of the mouth bilaterally**:
  1. **Bilateral Submandibular Spaces**
  2. **Bilateral Sublingual Spaces**
  3. **Submental Space**
- **Classic Clinical Presentation**:
  - **"Woody" / Brawny Induration**: Board-like, non-fluctuant, intensely tender swelling of the submandibular and submental regions (fluctuance is absent because it is a cellulitis, not a localized abscess cavity).
  - **"Double Tongue" Sign**: The tongue is elevated, enlarged, and retrodisplaced against the hard palate and posterior pharynx, completely occluding the airway.
  - **Systemic Toxicity**: High fever, tachycardia, severe trismus (inability to open mouth), drooling (inability to swallow secretions), muffled "hot potato" voice, tachypnea, and stridor.

### Emergency Airway & Surgical Decompression Protocol
1. **Airway Management (Top Priority!)**:
   - **Mandatory**: **Awake Fiberoptic Nasotracheal Intubation** in the operating room with a tracheostomy tray open and ready.
   - **Contraindicated**: Standard direct laryngoscopy with paralytic induction (neuromuscular blockade causes catastrophic immediate loss of the already compromised airway $\\rightarrow$ *"cannot intubate, cannot ventilate"* fatal crisis).
   - If fiberoptic intubation fails or is impossible $\\implies$ **Emergency Surgical Tracheostomy / Cricothyroidotomy under local anesthesia**.
2. **Aggressive Broad-Spectrum Intravenous Antibiotics**:
   - High-dose **Ampicillin-Sulbactam ($3\\text{ g}$ IV q6h)** $+$ **Metronidazole ($500\\text{ mg}$ IV q8h)** OR **Clindamycin ($600 - 900\\text{ mg}$ IV q8h)** $+$ **Ceftriaxone ($2\\text{ g}$ IV q24h)** covering polymicrobial oral flora (Viridans streptococci, *Peptostreptococcus*, *Prevotella*, *Fusobacterium*).
3. **Surgical Incision & Drainage (Decompression)**:
   - Wide bilateral submandibular incisions extending from angle to angle ($2\\text{ cm}$ below inferior border of mandible to avoid the **Marginal Mandibular branch of CN VII**).
   - Divide the anterior belly of the digastric and mylohyoid muscles; place through-and-through Penrose / corrugated rubber drains.

---

## 3. Deep Neck Spaces & Descending Necrotizing Mediastinitis

$$\\begin{array}{lcccc}
\\hline
\\textbf{Fascial Space} & \\textbf{Anatomical Boundaries} & \\textbf{Primary Source} & \\textbf{Pathognomonic Finding} & \\textbf{Severe Complication} \\\\
\\hline
\\text{Canine Space} & \\text{Between Levator Labii Sup & Levator Anguli Oris} & \\text{Maxillary Canine / 1st PM} & \\text{Infraorbital swelling, loss of nasolabial fold} & \\text{Cavernous Sinus Thrombosis} \\\\
\\text{Buccal Space} & \\text{Between Buccinator & Skin} & \\text{Maxillary/Mandibular Molars} & \\text{Cheek swelling below zygoma} & \\text{Parotid / Infratemporal spread} \\\\
\\text{Sublingual Space} & \\text{Above Mylohyoid, deep to oral mucosa} & \\text{Mandibular Premolars/1st Molar} & \\text{Floor of mouth elevation, painful tongue} & \\text{Ludwig\'s Angina} \\\\
\\text{Submandibular Space} & \\text{Below Mylohyoid, above Hyoid bone} & \\text{Mandibular 2nd & 3rd Molars} & \\text{Submandibular fullness, angle fullness} & \\text{Parapharyngeal spread} \\\\
\\text{Parapharyngeal Space} & \\text{Lateral to Pharynx, Medial to Pterygoid} & \\text{Mandibular 3rd Molar / Tonsil} & \\text{Lateral pharyngeal wall bulge, severe trismus} & \\text{Internal Jugular Thrombophlebitis} \\\\
\\mathbf{\\text{Retropharyngeal / Danger Space}} & \\mathbf{\\text{Between Alar Fascia & Prevertebral Fascia (Space 4)}} & \\mathbf{\\text{Descending parapharyngeal}} & \\mathbf{\\text{Posterior pharyngeal bulge, neck stiffness}} & \\mathbf{\\text{Acute Mediastinitis (Mortality } >50\\%)} \\\\
\\hline
\\end{array}$$

- **The "Danger Space" (Space 4)**:
  - Extends from the base of the skull directly through the entire posterior mediastinum down to the **level of the Diaphragm ($T_{12}$)**!
  - Infection spreading here causes **Descending Necrotizing Mediastinitis (DNM)** $\\implies$ pleural effusions, pericardial tamponade, sepsis, and high mortality.
`,
  clinicalVignettes: [
    {
      scenario: "A 35-year-old male presents to the Emergency Department with severe neck swelling, high-grade fever, drooling, and difficulty breathing that developed 3 days after an untreated infection of his lower left third molar (tooth 38). Physical examination reveals brawny, non-fluctuant induration of the bilateral submandibular and submental regions, severe trismus, and a significantly elevated, enlarged tongue pushed against the roof of the mouth. Stridor is audible.",
      question: "Which of the following represents the most urgent, high-priority initial management step for this patient?",
      options: [
        "Secure the airway via Awake Fiberoptic Intubation in the operating room with tracheostomy equipment on standby",
        "Administer IV paralytics (Succinylcholine) and perform standard direct endotracheal laryngoscopy",
        "Immediately extract tooth 38 in the emergency department under local anesthesia",
        "Discharge on high-dose oral Amoxicillin-Clavulanate"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Ludwig's Angina (bilateral submandibular, sublingual, and submental cellulitis with airway elevation following a lower third molar infection). The immediate priority is SECURING THE AIRWAY. Because the tongue is pushed back and trismus is present, standard rapid-sequence paralytic intubation carries a catastrophic risk of complete airway collapse ('cannot intubate, cannot ventilate'). The gold standard is Awake Fiberoptic Intubation in the operating room with a surgical tracheostomy tray ready."
    }
  ]
};
