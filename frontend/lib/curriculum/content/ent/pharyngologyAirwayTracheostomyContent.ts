/**
 * Pharyngology, Deep Neck Infections (Quinsy, Ludwig's) & Tracheostomy Learning Content
 * Authoritative medical content derived from Scott-Brown, Cummings, Dhingra, and USMLE Step 2 CK ENT.
 * Mapped to NMC CBME Competencies: EN7.1, EN7.2, EN8.1, EN8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PHARYNGOLOGY_AIRWAY_TRACHEOSTOMY_MODULE: PhysiologyLessonModule = {
  id: "ent-pharyngology-tracheostomy",
  unitCode: "EN7.1",
  title: "ENT: Deep Neck Space Infections (Quinsy, Ludwig's Angina) & Tracheostomy",
  competencies: ["EN7.1", "EN7.2", "EN8.1", "EN8.2"],
  estimatedMinutes: 135,
  organ3dTarget: "LARYNGEAL",
  markdownContent: `
# ENT: Deep Neck Space Infections (Quinsy, Ludwig's Angina) & Tracheostomy

Deep neck space suppurations threaten rapid airway compromise and mediastinal spread, requiring timely surgical drainage and airway protection.

---

## 1. Peritonsillar Abscess (Quinsy) vs Ludwig\'s Angina

| Deep Neck Infection | Anatomical Space & Predisposing Infection | Clinical Signs & Symptoms | Emergency Surgical & Medical Management |
| :--- | :--- | :--- | :--- |
| **Peritonsillar Abscess (Quinsy)** | Potential space between the **Palatine Tonsil Capsule and Superior Pharyngeal Constrictor Muscle**; arises from acute exudative bacterial tonsillitis (*S. pyogenes*, *S. anginosus*, anaerobes). | • **Severe, unilateral sore throat & odynophagia**.<br>• **Trismus ("lockjaw")** from irritation/spasm of the internal (**medial**) pterygoid muscle.<br>• **Muffled "Hot-Potato" Voice**.<br>• **Contralateral Uvula Deviation** with marked medial displacement of the tonsil and peritonsillar bulge. | 1. **Needle Aspiration or Incision & Drainage (I&D)** at the point of maximum fluctuance (superior pole).<br>2. **Intravenous Antibiotics**: IV Ceftriaxone $+$ Metronidazole (or IV Ampicillin-Sulbactam) $+$ single-dose IV Dexamethasone.<br>3. Interval Tonsillectomy after 6 weeks if recurrent. |
| **Ludwig\'s Angina** | Rapidly spreading bilateral cellulitis of the **Submandibular, Sublingual, and Submental Spaces** without discrete abscess formation; $80\\%$ secondary to **Odontogenic Infection of 2nd/3rd Mandibular Molars** (roots extend below the mylohyoid line). | • **Brawny, "Woody" Hard, Non-Pitting Induration of the Bilateral Floor of the Mouth and Neck**.<br>• **Superior and Posterior Elevation of the Tongue**, completely obstructing the oropharynx.<br>• Drooling, stridor, tripoding, dyspnea, and impending asphyxiation. | 1. **IMMEDIATE AIRWAY SECURITY**: Awake **Fiberoptic Intubation** or **Emergency Awake Tracheostomy / Cricothyroidotomy** *(blind oral intubation is contraindicated!)*.<br>2. **IV Broad-Spectrum Antibiotics**: IV Ampicillin-Sulbactam (or Meropenem) $+$ Vancomycin.<br>3. Surgical decompression with wide submandibular collar incision if no response to medical therapy. |
| **Retropharyngeal Abscess** | Potential space between buccopharyngeal fascia and alar fascia; common in children $< 5\\text{ years}$ (suppuration of retropharyngeal lymph nodes of Rouviere). | Stridor, neck stiffness, high fever, dysphagia; **Widened Prevertebral Soft Tissue Shadow on Lateral Neck X-ray** ($> 7\\text{ mm}$ at C2; $> 14\\text{ mm}$ at C6). Risk of spread to **Danger Space** and acute mediastinitis! | Transoral or external surgical drainage in the operating room under general anesthesia with endotracheal tube in place. |

---

## 2. Surgical Tracheostomy Technique & Principles

- **Elective Tracheostomy Site**: Created between the **2nd and 3rd (or 3rd and 4th) Tracheal Rings** via a horizontal or vertical incision through the anterior tracheal wall (Björk flap or circular window).
- **CRITICAL SURGICAL PEARL**: **STRICTLY AVOID THE 1st TRACHEAL RING OR CRICOID CARTILAGE!** Injury to the cricoid cartilage triggers severe, irreversible **Subglottic Stenosis**.
- **Cricothyroidotomy vs Tracheostomy**:
  - **Emergency Surgical Cricothyroidotomy**: Performed rapidly through the **Cricothyroid Membrane** (between thyroid cartilage and cricoid cartilage) in the "Cannot Intubate, Cannot Oxygenate" (CICO) scenario.
  - Must be converted to a formal tracheostomy within $48-72\\text{ hours}$ to prevent subglottic chondrolysis and stenosis.
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old college student presents with severe right-sided throat pain and difficulty swallowing for 4 days following an episode of acute pharyngitis. On examination, he speaks with a muffled 'hot-potato' voice, is drooling saliva, and can only open his mouth 1.5 cm due to severe painful jaw spasm (trismus). Oropharyngeal examination reveals a bulging, erythematous right anterior pillar with marked medial displacement of the right tonsil and deviation of the uvula to the left. The medical officer prepares to drain the infection.",
      question: "What is the diagnosis, and what is the underlying anatomical mechanism responsible for this patient's trismus?",
      options: [
        "Peritonsillar Abscess (Quinsy); Spasm of the Medial Pterygoid Muscle due to contiguous inflammation",
        "Ludwig's Angina; Spasm of the Masseter Muscle from sublingual space infection",
        "Retropharyngeal Abscess; Irritation of the Longus Colli muscle",
        "Parapharyngeal Abscess; Direct compression of the Glossopharyngeal Nerve (CN IX)"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient with severe unilateral sore throat, muffled 'hot-potato' voice, uvula deviation away from the affected side, and trismus has a classic Peritonsillar Abscess (Quinsy). Trismus (difficulty opening the mouth / lockjaw) occurs because the inflammatory exudate and edema in the peritonsillar space directly irritate and cause reflex spasm of the adjacent Medial (Internal) Pterygoid Muscle, one of the primary muscles of mastication situated lateral to the tonsillar fossa."
    }
  ]
};
