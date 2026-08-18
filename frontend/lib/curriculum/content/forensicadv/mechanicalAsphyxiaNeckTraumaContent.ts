/**
 * Clinical Forensic Pathology: Mechanical Asphyxia & Neck Compression Traumatology
 * Authoritative medical content derived from Reddy's Essentials of Forensic Medicine (35th ed.), Knight's Forensic Pathology.
 * Mapped to NMC CBME Competencies: FM5.1, FM5.2, MD40.3, SU38.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MECHANICAL_ASPHYXIA_NECK_TRAUMA_MODULE: PhysiologyLessonModule = {
  id: "forensic-adv-asphyxia-neck-trauma",
  unitCode: "FM5.1",
  title: "Mechanical Asphyxia: Hanging vs Ligature Strangulation vs Throttling & Drowning Pathophysiology",
  competencies: ["FM5.1", "FM5.2", "MD40.3", "SU38.3"],
  estimatedMinutes: 150,
  organ3dTarget: "PULMONARY",
  markdownContent: `
# Mechanical Asphyxia & Neck Compression Traumatology

Mechanical asphyxia results from external mechanical interference with oxygen uptake and cerebral blood flow, categorized into compression of the neck (hanging, strangulation) and airway occlusion (drowning, smothering, choking).

---

## 1. Differential Diagnosis of Neck Compression

$$\\begin{array}{lccc}
\\hline
\\textbf{Feature} & \\textbf{Ante-Mortem Hanging} & \\textbf{Ligature Strangulation} & \\textbf{Manual Strangulation (Throttling)} \\\\
\\hline
\\textbf{Ligature Mark} & \\mathbf{\\text{Oblique, Non-Continuous}} & \\mathbf{\\text{Horizontal, Continuous, Transverse}} & \\text{None (Fingertip contusions} \\\\
& \\text{highest at suspension point (knot)} & \\text{completely encircling the neck} & + \\mathbf{\\text{crescentic fingernail abrasions)}} \\\\
\\textbf{Level on Neck} & \\mathbf{\\text{Above thyroid cartilage (high)}} & \\mathbf{\\text{At or below thyroid cartilage (low)}} & \\text{Variable mid-to-lower neck} \\\\
\\textbf{Parchment Base} & \\text{Hard, grooved, dry, yellow-brown} & \\text{Soft, depressed furrow} & \\text{Linear/curved scratches and bruises} \\\\
\\textbf{Facial Congestion} & \\text{Usually pale (unless incomplete)} & \\mathbf{\\text{Florid congestion, cyanosis, petechiae}} & \\mathbf{\\text{Severe congestion, petechiae (Tardieu)}} \\\\
\\textbf{Salivary Dribbling} & \\mathbf{\\text{Present opposite knot (ANTE-MORTEM)}} & \\text{ABSENT} & \\text{ABSENT} \\\\
\\textbf{Hyoid Fracture} & \\text{Rare (15-20\\% in elderly)} & \\text{Uncommon (10-15\\%)} & \\mathbf{\\text{VERY COMMON (60-70\\% greater horns)}} \\\\
\\textbf{Manner of Death} & \\text{Almost always Suicide} & \\mathbf{\\text{Almost always Homicide}} & \\mathbf{\\text{ALWAYS Homicide}} \\\\
\\hline
\\end{array}$$

---

## 2. Drowning Autopsy Pathophysiology

1. **External Signs**:
   - **Persistent Froth at Mouth and Nostrils ("Mushroom of Foam")**: Fine, white, tenacious, leathery foam produced by agitated alveolar surfactant churning with inhaled water and respiratory mucus; increases when wiped away.
   - **Cutis Anserina (Goose Skin)**: Erector pili muscle rigor mortis.
   - **Washerwoman's Hands / Feet**: Dermal maceration and wrinkling from prolonged aquatic immersion.
2. **Internal Findings**:
   - **Emphysema Aquosum / Edema Aquosum**: Hyperinflated, waterlogged, heavy lungs ballooning out of the thoracic cavity; rib impressions on pleural surfaces.
   - **Paltauf's Hemorrhages**: Subpleural intra-alveolar hemorrhages ($0.5-2.0\\text{ cm}$) along the lower lobe margins due to alveolar septal rupture.
   - **Diatom Test**: Microscopic aquatic unicellular silica algae (*diatoms*) found within **closed bone marrow (femur)**, proving active cardiac circulation transported inhaled water from lungs to peripheral organs before death.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female is found deceased in her bedroom. The family reports that she committed suicide by hanging herself with a nylon rope from a ceiling hook. On forensic autopsy examination, the neck demonstrates a horizontal, completely continuous, transverse groove located below the thyroid cartilage encircling the circumference of the neck with uniform depth throughout. There is severe facial cyanosis, marked engorgement of facial veins, profuse subconjunctival petechial hemorrhages (Tardieu spots), deep strap muscle contusions, and bilateral fractures of the superior horns of the thyroid cartilage. No salivary stain is identified on the chin or chest.",
      question: "Based on these medicolegal findings, what is the true mechanism and manner of death?",
      options: [
        "Homicide by Ligature Strangulation staged to simulate suicide; Characterized by a horizontal, continuous ligature mark at or below the thyroid cartilage, marked venous congestion, Tardieu petechiae, and absence of salivary dribbling",
        "Suicide by Ante-mortem Suspension Hanging",
        "Accidental positional postural asphyxia",
        "Sudden fatal vasovagal carotid sinus syncope without mechanical trauma"
      ],
      correctAnswerIndex: 0,
      explanation: "This case represents a classic homicide by Ligature Strangulation staged postmortem to simulate a suicidal hanging. Suicidal hanging produces an oblique, non-continuous ligature mark that is highest at the suspension point (above the thyroid cartilage), with a gap at the knot and ante-mortem salivary dribbling opposite the suspension apex. In contrast, Ligature Strangulation produces a horizontal, continuous, transverse groove situated at or below the thyroid cartilage, completely encircling the neck. Because venous return is obstructed while arterial flow continues, intense facial congestion, cyanosis, and profuse Tardieu petechial hemorrhages are characteristic hallmarks of homicidal strangulation."
    }
  ]
};
