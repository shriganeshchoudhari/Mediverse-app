/**
 * Dentistry & Maxillofacial Surgery: Maxillofacial Trauma, Le Fort Fractures & Mandibular Fractures
 * Authoritative medical content derived from Fonseca's Oral and Maxillofacial Trauma, ATLS (10th ed.), and Peterson's OMFS.
 * Mapped to NMC CBME Competencies: DE5.1, DE5.2, DE6.1, DE6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MAXILLOFACIAL_TRAUMA_LE_FORT_FRACTURES_MODULE: PhysiologyLessonModule = {
  id: "dentistry-maxillofacial-trauma-le-fort-fractures",
  unitCode: "DE5.1",
  title: "Maxillofacial Trauma: Le Fort I–III Fractures, Mandibular Fractures & ZMC Tripod Trauma",
  competencies: ["DE5.1", "DE5.2", "DE6.1", "DE6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Maxillofacial Trauma: Le Fort I–III Fractures, Mandibular Fractures & ZMC Tripod Trauma

Systematic assessment of midfacial and mandibular skeletal fractures ensures airway protection, prevention of permanent occlusal deformity, and structural reconstruction.

---

## 1. Classification of Midface Fractures: The Le Fort Classification

Described by French surgeon René Le Fort in 1901 based on lines of structural midfacial weakness:

| Le Fort Type & Eponym | Fracture Line Trajectory & Skeletal Separation | Pathognomonic Physical Examination Signs | Essential Radiographic / CT Hallmarks |
| :--- | :--- | :--- | :--- |
| **Le Fort I**<br>*(Guerin\'s Fracture / Horizontal Maxillary)* | Horizontal fracture separating the **alveolar process and palate from the upper midface**. Runs through lower nasal septum, pyriform aperture, anterior maxillary sinus wall, and **lower third of pterygoid plates**. | **"Floating Palate"**: Grasping upper incisors and pulling forward moves ONLY the hard palate and teeth, while nasal bridge and orbits remain stable. Malocclusion with anterior open bite. | Disruption of lower maxillary antrum and pterygoid plates on axial CT. |
| **Le Fort II**<br>*(Pyramidal Fracture)* | Pyramidal fracture separating the **central midface/maxilla and nasal bones from the zygomas and skull base**. Runs through nasofrontal suture, lacrimal bones, **inferior orbital rim**, orbital floor, zygomaticomaxillary suture, and pterygoid plates. | **"Floating Maxilla"**: Grasping upper incisors moves maxilla AND nasal complex together. **Bilateral infraorbital nerve ($V_2$) hypoesthesia / numbness** of cheek and upper lip; step-off deformity at inferior orbital rims; subconjunctival ecchymosis; telecanthus. | Pyramidal disruption through nasal bridge, bilateral orbital floors, and lateral maxillary walls. |
| **Le Fort III**<br>*(Craniofacial Dysjunction)* | Complete separation of the **ENTIRE facial skeleton from the cranial base**. Runs through nasofrontal suture, ethmoid/cribriform plate, **superior orbital fissure**, lateral orbital wall, **zygomaticofrontal suture**, zygomatic arches, and **high pterygoid plates**. | **"Floating Face" / "Dish-Face" Deformity**: Face is lengthened and flattened; grasping teeth moves entire facial skeleton as a single unit. **Bilateral "Raccoon Eyes" (periorbital hematomas)**, massive midfacial edema, **CSF Rhinorrhea** (cribriform plate fracture), severe malocclusion, airway compromise. | Complete craniofacial disjunction with multi-buttress disruption across zygomaticofrontal sutures and pterygomaxillary junction. |

---

## 2. Mandibular Fractures: Frequency, Anatomy & Management

### Anatomic Frequency & Predisposition
1. **Condyle & Subcondylar Region ($29 - 35\\%$)**: Most common site overall. Blunt trauma to the symphysis transmits force along the mandible, causing indirect fracture of the thin condylar neck.
2. **Angle of the Mandible ($25 - 29\\%$)**: High incidence especially when an **impacted third molar (wisdom tooth)** is present, which creates a structural stress concentration point.
3. **Symphysis & Parasymphysis ($15 - 20\\%$)**: Direct blow to the chin.
4. **Body of the Mandible ($15 - 20\\%$)**: Region between mental foramen and angle.

### Diagnostic Physical Examination Hallmarks
- **Step Deformity in Dental Occlusion**: Loss of normal intercuspation (pre-trauma Class I occlusion lost).
- **Coleman\'s Sign (Sublingual Hematoma)**: Ecchymosis in the floor of the mouth is **pathognomonic of a mandibular body or symphysis fracture**.
- **Mental Nerve Paresthesia**: Numbness of the lower lip and chin indicating traction or transection of the **Inferior Alveolar Nerve ($V_3$)** within the mandibular canal.
- **Unilateral Condylar Fracture**: Chin deviates **TOWARD the side of the fracture** upon mouth opening (unopposed action of contralateral lateral pterygoid muscle); premature contact on ipsilateral molars with contralateral anterior open bite.

### Principles of Mandibular Treatment
1. **Maxillomandibular Fixation (MMF / Intermaxillary Fixation)**: Arch bars wired to upper and lower dentition and secured with elastic bands / stainless steel wires for $4 - 6\\text{ weeks}$ (re-establishes pre-morbid dental occlusion).
2. **Open Reduction and Internal Fixation (ORIF)**: Rigid fixation using titanium miniplates and monocortical screws placed along **Champy\'s Lines of Ideal Osteosynthesis** (tension zone along the superior border, compression zone along the inferior border).

---

## 3. Zygomaticomaxillary Complex (ZMC / "Tripod") Fractures

The ZMC connects the face to the neurocranium at four key buttress articulations:
1. **Zygomaticofrontal Suture** (Lateral orbital rim)
2. **Inferior Orbital Rim & Orbital Floor** (Infraorbital canal)
3. **Zygomaticomaxillary Buttress** (Maxillary sinus wall)
4. **Zygomatic Arch** (Temporal process of zygoma)

### Classic Clinical Tetrad of ZMC Fracture
1. **Malar Flattening**: Loss of the prominent cheekbone contour (best observed from above patient looking down forehead: "Bird\'s Eye View").
2. **Trismus**: Inability to open mouth due to **impingement of depressed zygomatic arch fragments onto the Coronoid Process and Temporalis Muscle**.
3. **Infraorbital Nerve ($V_2$) Anesthesia**: Numbness of ipsilateral cheek, side of nose, and upper lip.
4. **Diplopia & Enophthalmos**: Entrapment of inferior rectus / orbital fat in orbital floor disruption.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old motor vehicle crash victim arrives in the trauma bay with severe midfacial trauma. On examination, there is extensive periorbital ecchymosis, a flattened 'dish-face' facial contour, and clear fluid trickling from the left nostril that tests positive for Beta-2 Transferrin. When the trauma surgeon grasps the patient's maxillary central incisors and applies gentle anterior traction, the entire facial skeleton—including the maxilla, zygomas, and nasal bridge—moves as a single combined block relative to the forehead.",
      question: "Which of the following maxillofacial fractures is present in this patient?",
      options: [
        "Le Fort III Fracture (Craniofacial Dysjunction)",
        "Le Fort II Fracture (Pyramidal)",
        "Le Fort I Fracture (Horizontal Guerin)",
        "Isolated Mandibular Symphysis Fracture"
      ],
      correctAnswerIndex: 0,
      explanation: "A Le Fort III fracture (Craniofacial Dysjunction) separates the entire facial skeleton from the cranial base via fractures through the nasofrontal suture, ethmoid cribriform plate, superior orbital fissure, lateral orbital wall, and zygomaticofrontal suture. The clinical hallmarks present here are the classic 'floating face' (movement of maxilla, nose, and orbits as a single unit), dish-face deformity, raccoon eyes, and CSF rhinorrhea (confirmed by Beta-2 Transferrin) secondary to ethmoid/cribriform disruption."
    }
  ]
};
