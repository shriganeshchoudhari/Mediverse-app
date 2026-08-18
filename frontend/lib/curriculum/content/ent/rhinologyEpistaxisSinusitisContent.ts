/**
 * Rhinology, Epistaxis (Kiesselbach vs Woodruff), Sinusitis & Mucormycosis Learning Content
 * Authoritative medical content derived from Scott-Brown, Cummings, Dhingra, and USMLE Step 2 CK ENT.
 * Mapped to NMC CBME Competencies: EN5.1, EN5.2, EN5.3, EN6.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RHINOLOGY_EPISTAXIS_SINUSITIS_MODULE: PhysiologyLessonModule = {
  id: "ent-rhinology-epistaxis",
  unitCode: "EN5.1",
  title: "ENT: Epistaxis (Kiesselbach vs Woodruff Plexus), Rhinosinusitis & Invasive Mucormycosis",
  competencies: ["EN5.1", "EN5.2", "EN5.3", "EN6.1"],
  estimatedMinutes: 135,
  organ3dTarget: "NASAL",
  markdownContent: `
# ENT: Epistaxis (Kiesselbach vs Woodruff Plexus), Rhinosinusitis & Invasive Mucormycosis

Rhinology encompasses nasal vascular architecture, acute and refractory epistaxis triage, paranasal sinus drainage pathways, and fulminant invasive fungal infections.

---

## 1. Epistaxis: Anterior vs Posterior Vascular Plexus Anatomy

| Epistaxis Category | Vascular Plexus & Arterial Anastomosis | Typical Patient & Severity | Stepwise Management Cascade |
| :--- | :--- | :--- | :--- |
| **Anterior Epistaxis ($> 90\\%$)** | **Little\'s Area / Kiesselbach\'s Plexus** on the anteroinferior nasal septum.<br>Formed by anastomosis of **4 Arteries**:<br>1. **Anterior Ethmoidal Artery** (from Ophthalmic $\\rightarrow$ ICA)<br>2. **Sphenopalatine Artery** (from Maxillary $\\rightarrow$ ECA)<br>3. **Greater Palatine Artery** (from Maxillary $\\rightarrow$ ECA)<br>4. **Superior Labial Artery** (from Facial $\\rightarrow$ ECA) | Children and young adults; trauma (nose picking / digital trauma), dry air, allergic rhinitis; mild to moderate self-limiting bleeding. | 1. **Trotter\'s Method**: Pinch soft cartilaginous nose continuously for $10-15\\text{ min}$ leaning forward.<br>2. **Topical Vasoconstrictor**: Oxymetazoline spray.<br>3. **Chemical Cautery**: **Silver Nitrate ($AgNO_3 75\\%$)** applied to bleeding vessel *(never cauterize both sides of septum simultaneously $\\rightarrow$ risk of septal perforation!)*.<br>4. **Anterior Nasal Packing**: Merocel sponge / Rapid Rhino pack for $24-48\\text{ hours}$. |
| **Posterior Epistaxis ($< 10\\%$)** | **Woodruff\'s Plexus** located over the posterior lateral nasal wall inferior to the posterior end of the middle turbinate (Sphenopalatine artery terminal branches). | Elderly patients with **Systemic Arterial Hypertension**, atherosclerosis, or coagulopathies; profuse arterial bleeding flowing down the posterior pharynx into the airway. | 1. **Posterior Nasal Packing**: Dual-balloon catheter (Epistat) or 10-14 Fr Foley catheter inflated with $5-10\\text{ mL}$ sterile water in nasopharynx $+$ anterior pack.<br>2. **Endoscopic Sphenopalatine Artery Ligation (ESPAL)** or Interventional Radiology **Angiographic Embolization** if bleeding persists. |

---

## 2. Acute Bacterial Rhinosinusitis vs Invasive Fungal Mucormycosis

- **Acute Bacterial Rhinosinusitis**:
  - Inflammation of paranasal sinuses (*S. pneumoniae*, *H. influenzae*, *M. catarrhalis*) presenting with purulent nasal discharge, nasal congestion, and facial pain/pressure over the maxillary/frontal sinuses lasting $> 10\\text{ days}$ (or "double sickening" worsening after initial improvement).
  - 1st-line Antibiotic: **Oral Amoxicillin-Clavulanate ($875/125\\text{ mg}$ PO BID for $5-7\\text{ days}$)**.
- **Acute Invasive Fungal Sinusitis (Mucormycosis / *Rhizopus* & *Mucor* species)**:
  - Life-threatening angioinvasive infection occurring in patients with **Diabetic Ketoacidosis (DKA)** (due to acidic ketone-rich environment and free iron) or profound neutropenia/organ transplant recipients.
  - Clinical Signs: Facial pain, bloody nasal discharge, proptosis, ophthalmoplegia, visual loss (orbital apex syndrome), and pathognomonic **Black Necrotic Eschar on the middle turbinate, septum, or hard palate**.
  - Histology: **Broad, ribbon-like, non-septate hyphae with right-angle ($90^\\circ$) branching**.
  - Emergency Protocol: Immediate reversal of DKA/immunosuppression $+$ **Emergency Radical Endoscopic / Open Surgical Debridement** $+$ **High-dose Intravenous Liposomal Amphotericin B ($5-10\\text{ mg/kg/day}$)**.
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with poorly controlled type 2 diabetes mellitus presents in severe diabetic ketoacidosis (glucose 480 mg/dL, pH 7.18, anion gap 24). Over the past 24 hours, he has developed excruciating left facial pain, left-sided periorbital swelling, proptosis, and complete ophthalmoplegia with inability to move his left eye. Anterior rhinoscopy reveals a dry, black, necrotic eschar on the left middle turbinate and a necrotic ulcer on the hard palate. Biopsy of the turbinate tissue reveals broad, non-septate hyphae branching at 90-degree right angles with extensive vascular thrombosis.",
      question: "Which of the following represents the mandatory emergency dual-therapeutic intervention?",
      options: [
        "Emergency radical surgical debridement of necrotic sinus tissue + High-dose IV Liposomal Amphotericin B",
        "Intravenous Voriconazole monotherapy + Topical steroid nasal spray",
        "Intravenous Ceftriaxone + Vancomycin without surgical intervention",
        "Oral Fluconazole + Hyperbaric oxygen therapy alone"
      ],
      correctAnswerIndex: 0,
      explanation: "A diabetic patient in DKA presenting with facial pain, periorbital swelling, ophthalmoplegia (orbital apex syndrome), a black necrotic eschar, and tissue biopsy demonstrating broad, non-septate hyphae branching at 90-degree angles has acute, fulminant Rhino-Orbital-Cerebral Mucormycosis. This fungal infection is angioinvasive, causing extensive vascular thrombosis and tissue infarction that prevents parenteral antifungal drugs from penetrating dead tissues. Therefore, emergency treatment requires aggressive, radical surgical debridement of all necrotic tissue combined with high-dose intravenous Liposomal Amphotericin B."
    }
  ]
};
