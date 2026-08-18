/**
 * Thorax & Mediastinum Anatomy Learning Content
 * Authoritative medical content derived from Gray's Anatomy (42nd ed.), Netter, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN21.1, AN21.2, AN22.1, AN23.1, AN25.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THORAX_MEDIASTINUM_MODULE: PhysiologyLessonModule = {
  id: "anat-thorax",
  unitCode: "AN21.1",
  title: "Thorax, Mediastinal Compartments & Coronary Vascular Anatomy",
  competencies: ["AN21.1", "AN21.2", "AN22.1", "AN23.1", "AN25.1"],
  estimatedMinutes: 110,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Thorax, Mediastinal Compartments & Coronary Vascular Anatomy

The thoracic cavity protects the central cardiopulmonary organs and major vascular conduits within structured osteocartilaginous boundaries and mediastinal subdivisions.

---

## 1. Sternal Angle of Louis ($T4/T5$ Level Landmarks)

The horizontal transverse thoracic plane passing through the **Sternal Angle (Angle of Louis)** and the $T4 - T5$ intervertebral disc is the master anatomical reference line:

> **High-Yield Structures at Sternal Angle ($T4/T5$) (Mnemonic: RATTS)**:
> 1. **Rib 2**: Articulation of the second costal cartilage (used clinically to count intercostal spaces).
> 2. **Aortic Arch**: Begins and terminates at this level.
> 3. **Tracheal Bifurcation (Carina)**: Divides into right and left main bronchi.
> 4. **Thoracic Duct**: Crosses from right to left side of the vertebral column behind the esophagus.
> 5. **Superior Vena Cava**: Formed by union of left and right brachiocephalic veins, receives the Azygos vein arch.
> 6. **Pulmonary Trunk**: Bifurcates into right and left pulmonary arteries.

---

## 2. Mediastinal Compartments & Classical Masses

The mediastinum is partitioned by the pericardial sac into four primary surgical and radiological compartments:

| Compartment | Anatomical Boundaries | Primary Normal Contents | Classical Pathological Masses (4 T's) |
| :--- | :--- | :--- | :--- |
| **Superior Mediastinum** | Superior thoracic aperture to Sternal Angle ($T4/T5$) | Thymus remnants, Brachiocephalic veins, SVC, Aortic Arch + 3 branches, Trachea, Esophagus, Phrenic & Vagus nerves, Thoracic duct | Retrosternal Thyroid Goiter, Thymoma, Lymphoma |
| **Anterior Mediastinum** | Sternum anteriorly to Pericardium posteriorly | Thymus, internal thoracic lymph nodes, adipose connective tissue | **4 T's**: **T**hymoma, **T**eratoma (germ cell), **T**hyroid goiter, '<strong>T</strong>errible' Lymphoma |
| **Middle Mediastinum** | Enclosed within fibrous pericardium | Heart, Pericardium, Ascending Aorta, Pulmonary Trunk, SVC lower half, Phrenic nerves ($C3\text{-}C5$), Main bronchi | Pericardial cysts, Bronchogenic cysts, Lymphadenopathy |
| **Posterior Mediastinum** | Pericardium anteriorly to $T5-T12$ vertebrae posteriorly | Esophagus, Thoracic Aorta, Azygos & Hemiazygos veins, Thoracic Duct, Vagus nerves, Sympathetic trunks | **Neurogenic Tumors** (Schwannoma, Neurofibroma, Ganglioneuroma), Esophageal cancer |

---

## 3. Coronary Artery Distribution & Dominance

1. **Left Coronary Artery (LCA)**:
   - **Left Anterior Descending (LAD)**: Supplies anterior 2/3 of IVS, anterior LV wall, and cardiac apex (most frequently occluded: 45-50%).
   - **Left Circumflex (LCx)**: Supplies lateral and posterior LV free wall.
2. **Right Coronary Artery (RCA)**:
   - Supplies Right Ventricle, SA node (60% of people via SA nodal artery), and AV node (90% via AV nodal artery).
   - **Marginal Artery**: Supplies the acute margin of the right ventricle.
3. **Coronary Dominance**:
   - **Right Dominant ($85\%$)**: Posterior Descending Artery (PDA / Posterior Interventricular Artery) arises from the **RCA**.
   - **Left Dominant ($10\%$)**: PDA arises from the **LCx**.
   - **Codominant ($5\%$)**: PDA supplied by both RCA and LCx.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male presents with worsening myasthenia gravis characterized by bilateral ptosis and fatigable proximal muscle weakness. Contrast-enhanced chest CT demonstrates a well-circumscribed 4.5 cm solid mass located in the anterior mediastinum immediately behind the manubrium and sternal body.",
      question: "Which of the following neoplasms is most likely present in this patient?",
      options: [
        "Thymoma",
        "Schwannoma of the sympathetic trunk",
        "Bronchogenic cyst",
        "Esophageal leiomyoma"
      ],
      correctAnswerIndex: 0,
      explanation: "Thymomas are the most common primary anterior mediastinal tumors in adults and are strongly associated with Myasthenia Gravis (present in ~30-50% of thymoma patients). Schwannomas occur in the posterior mediastinum, while bronchogenic cysts are typically located in the middle mediastinum."
    }
  ]
};
