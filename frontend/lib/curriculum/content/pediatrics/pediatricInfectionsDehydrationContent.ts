/**
 * Pediatric Gastroenteritis, Dehydration Assessment (WHO Plan A/B/C) & Respiratory Emergencies Learning Content
 * Authoritative medical content derived from WHO IMNCI, Nelson Pediatrics, Ghai Pediatrics, and USMLE Step 2 CK Pediatrics.
 * Mapped to NMC CBME Competencies: PE5.1, PE5.2, PE5.3, PE6.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_INFECTIONS_DEHYDRATION_MODULE: PhysiologyLessonModule = {
  id: "ped-dehydration-infections",
  unitCode: "PE5.1",
  title: "Pediatrics: WHO Dehydration Assessment (Plan A/B/C), Croup vs Epiglottitis & Bronchiolitis",
  competencies: ["PE5.1", "PE5.2", "PE5.3", "PE6.1"],
  estimatedMinutes: 135,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Pediatrics: WHO Dehydration Assessment (Plan A/B/C), Croup vs Epiglottitis & Bronchiolitis

Acute diarrheal dehydration and pediatric upper airway obstruction are among the most common life-threatening pediatric emergencies requiring rapid protocol-driven assessment.

---

## 1. WHO / IMNCI Classification & Fluid Management of Dehydration

| Dehydration Category | Physical Signs & Symptoms | Fluid Resuscitation Protocol (WHO Guidelines) |
| :--- | :--- | :--- |
| **No Dehydration (Plan A)** | Child is alert, active, normal eyes, tears present, drinks normally, skin pinch retracts immediately ($< 1\\text{ sec}$). | **Home ORS Therapy (Plan A)**:<br>• Give **$10\\text{ mL/kg}$ WHO-ORS** for every loose watery stool.<br>• Continue age-appropriate feeding / breastfeeding.<br>• **Oral Zinc Supplementation** ($10\\text{ mg/day}$ for infants $<6\\text{ mo}$; $20\\text{ mg/day}$ for $>6\\text{ mo}$ for 14 days). |
| **Some Dehydration (Plan B)** | **Restless / Irritable**, **Sunken eyes**, **Drinks eagerly / Thirsty**, **Skin pinch goes back slowly ($< 2\\text{ sec}$)**. | **Oral Rehydration Therapy in Clinic (Plan B)**:<br>• **WHO Low-Osmolarity ORS**: **$75\\text{ mL/kg}$ administered orally over 4 hours**.<br>• Reassess hydration status at 4 hours.<br>• Formula: $\\text{Volume (mL)} = \\text{Weight (kg)} \\times 75$. |
| **Severe Dehydration (Plan C)** | **Lethargic / Comatose / Unconscious**, Deeply sunken eyes, **Unable to drink / drinks poorly**, **Skin pinch goes back VERY SLOWLY ($> 2\\text{ sec}$)**, weak thready pulse, hypotension. | **Emergency Intravenous Fluid Therapy (Plan C)**:<br>• **Total $100\\text{ mL/kg}$ Ringer\'s Lactate** (or Normal Saline):<br>  - **Infants ($< 12\\text{ months}$)**: Give **$30\\text{ mL/kg}$ over 1 hour**, then **$70\\text{ mL/kg}$ over 5 hours** (Total $6\\text{ hours}$).<br>  - **Children ($1\\text{ to } 5\\text{ years}$)**: Give **$30\\text{ mL/kg}$ over 30 minutes**, then **$70\\text{ mL/kg}$ over 2.5 hours** (Total $3\\text{ hours}$). |

---

## 2. Pediatric Upper Airway Obstruction: Croup vs Acute Epiglottitis

| Feature | Croup (Laryngotracheobronchitis) | Acute Epiglottitis (True Surgical Emergency!) |
| :--- | :--- | :--- |
| **Etiologic Pathogen** | **Parainfluenza Virus (Type 1)** | ***Haemophilus influenzae* type b (Hib)** (or *Strep. pyogenes*) |
| **Typical Age Group** | **$6\\text{ months to } 3\\text{ years}$** | **$2\\text{ to } 7\\text{ years}$** (unvaccinated / under-immunized) |
| **Onset & Progression** | Gradual prodrome of low fever, rhinorrhea $\\rightarrow$ worsens over days. | **Abrupt onset, rapid progression within hours**, high toxic fever. |
| **Key Clinical Signs** | **"Barking Seal" cough**, inspiratory stridor, hoarseness; child is non-toxic. | **"3Ds"**: **D**ysphagia, **D**rooling, **D**istress. **"Tripod / Sniffing Position"** (leaning forward with neck extended), muffled **"hot-potato" voice**. *No barking cough!* |
| **Classic Radiographic Finding** | **"Steeple Sign"** on AP neck X-ray (subglottic tracheal narrowing). | **"Thumbprint Sign"** on Lateral neck X-ray (swollen, cherry-red epiglottis). |
| **CRITICAL WARNING** | Safe to examine oropharynx. | **NEVER EXAMINE OROPHARYNX WITH TONGUE BLADE!** *(Triggers fatal immediate complete laryngospasm)*. |
| **Definitive Management** | Single dose oral **Dexamethasone ($0.6\\text{ mg/kg}$)** $\\pm$ Nebulized Racemic Epinephrine. | **Secure Airway in Operating Room** (Endotracheal Intubation under general anesthesia) $+$ IV Ceftriaxone. |

---

## 3. Acute Bronchiolitis

- **Etiology**: **Respiratory Syncytial Virus (RSV)** in infants $< 2\\text{ years}$ (peak $2-6\\text{ months}$).
- **Clinical Signs**: Rhinorrhea, low-grade fever, followed by **diffuse expiratory wheezing, tachypnea, fine inspiratory crackles, and intercostal retractions**.
- **Management**: Primarily supportive: Nasal suctioning, hydration, supplemental oxygen to maintain $SpO_2 \\ge 90-92\\%$. Routine bronchodilators, systemic steroids, and antibiotics are **NOT recommended** by AAP guidelines.
`,
  clinicalVignettes: [
    {
      scenario: "A 3-year-old unimmunized girl is brought to the pediatric emergency department with high fever (39.8 C), severe respiratory distress, and inability to swallow her saliva. She is sitting upright in the 'tripod position' leaning forward with her chin thrust forward. Her voice is muffled ('hot potato' quality), inspiratory stridor is heard without coughing, and copious saliva drools from her mouth. The medical student reaches for a tongue depressor to inspect the posterior pharynx.",
      question: "Which of the following represents the most urgent, appropriate management?",
      options: [
        "Stop the tongue depressor exam immediately and alert anesthesiology/ENT for emergency intubation in the operating room",
        "Perform a vigorous tongue depressor exam to inspect the tonsils and epiglottis",
        "Administer intramuscular penicillin and obtain a lateral neck radiograph in the radiology suite",
        "Start high-flow oxygen via tight-fitting face mask and give oral dexamethasone"
      ],
      correctAnswerIndex: 0,
      explanation: "This child demonstrates the classic, life-threatening presentation of Acute Epiglottitis (high fever, severe distress, tripod position, drooling, muffled voice, absence of cough). In suspected epiglottitis, direct examination of the oropharynx with a tongue depressor or agitating the child is strictly contraindicated because it can precipitate immediate, fatal total laryngospasm and airway closure. The child must be kept calm and taken directly to the Operating Room with a pediatric anesthesiologist and ENT surgeon for definitive airway control (endotracheal intubation)."
    }
  ]
};
