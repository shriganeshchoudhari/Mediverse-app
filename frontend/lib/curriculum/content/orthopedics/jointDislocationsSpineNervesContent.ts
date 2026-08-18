/**
 * Joint Dislocations, Nerve Injuries & Upper/Lower Extremity Fractures Learning Content
 * Authoritative medical content derived from Apley & Solomon, Rockwood and Green, Campbell, and USMLE Step 2 CK Orthopedics.
 * Mapped to NMC CBME Competencies: OR5.1, OR5.2, OR6.1, OR6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const JOINT_DISLOCATIONS_SPINE_NERVES_MODULE: PhysiologyLessonModule = {
  id: "orth-dislocations-nerves",
  unitCode: "OR5.1",
  title: "Orthopedics: Joint Dislocations (Shoulder, Hip) & Peripheral Nerve Injuries in Fractures",
  competencies: ["OR5.1", "OR5.2", "OR6.1", "OR6.2"],
  estimatedMinutes: 140,
  organ3dTarget: "SKELETAL",
  markdownContent: `
# Orthopedics: Joint Dislocations (Shoulder, Hip) & Peripheral Nerve Injuries in Fractures

Joint dislocations are orthopedic emergencies that jeopardize joint cartilage viability, arterial supply, and adjacent peripheral nerves.

---

## 1. Shoulder Dislocations: Anterior vs Posterior

| Clinical Characteristic | Anterior Shoulder Dislocation ($>95\\%$) | Posterior Shoulder Dislocation ($<5\\%$) |
| :--- | :--- | :--- |
| **Mechanism of Injury** | Forceful **Abduction, External Rotation, and Extension** (e.g. throwing an athletic ball, blow to arm). | **Severe Epileptic Seizures, Electrocution / Lightning Strike**, direct anterior blow. *(Massive spasm of internal rotators: subscapularis)*. |
| **Physical Exam Contour** | Arm held slightly **Abducted and Externally Rotated**; loss of deltoid roundness (**"Squared-Off Shoulder"** sign); subacromial sulcus sign. | Arm held rigidly **Adducted and Internally Rotated**; anterior fullness lost with posterior prominence; unable to externally rotate arm. |
| **High-Yield Radiographic Signs** | **Bankart Lesion** (anteroinferior glenoid labrum tear) and **Hill-Sachs Lesion** (posterolateral humeral head compression defect). | **"Lightbulb Sign"** (fixed internal rotation gives round appearance to humeral head on AP view); **"Trough Sign"** (reverse Hill-Sachs). |
| **Vulnerable Nerve** | **Axillary Nerve** (innervates deltoid & teres minor; sensory loss over the lateral deltoid **"Regimental Badge Area"**). | Rarely nerve injury; frequently missed on routine AP radiographs (requires Axillary / Velpeau view). |
| **Reduction Maneuvers** | Stimson technique (prone hanging weight), Milch technique, Kocher or Traction-Countertraction. | Gentle traction in adduction with gentle anterior pressure on humeral head. |

---

## 2. Hip Dislocations: Posterior vs Anterior

| Clinical Characteristic | Posterior Hip Dislocation ($>90\\%$) | Anterior Hip Dislocation ($<10\\%$) |
| :--- | :--- | :--- |
| **Classic Mechanism** | **"Dashboard Injury"** in motor vehicle collision: axial force applied to the flexed knee/femur. | Forced abduction, external rotation, and extension of hip. |
| **Classic Limb Posture** | Lower limb is **FLEXED, ADDUCTED, INTERNALLY ROTATED, AND SHORTENED**. | Lower limb is **FLEXED, ABDUCTED, EXTERNALLY ROTATED, AND EXTENDED**. |
| **Nerve at Risk** | **Sciatic Nerve (Peroneal Division)** $\\implies$ Loss of dorsiflexion (**Foot Drop**) and sensory loss over dorsum of foot. | **Femoral Nerve** and Femoral Artery/Vein compression. |
| **Critical Complication** | **Avascular Necrosis (AVN) of Femoral Head** (due to disruption of medial and lateral circumflex femoral arteries). | Femoral head chondral damage; AVN. |
| **Orthopedic Emergency Rule** | **Closed Reduction within $6\\text{ hours}$** under conscious sedation to prevent irreversible osteonecrosis of the femoral head! | Urgent closed reduction. |

---

## 3. High-Yield Fracture & Peripheral Nerve Associations

| Fracture Site / Bone Injury | Vulnerable Nerve / Artery | Motor Deficit Hallmark | Sensory Deficit Hallmark |
| :--- | :--- | :--- | :--- |
| **Midshaft Humeral Fracture** | **Radial Nerve** (in the spiral groove) | **Wrist Drop** (loss of wrist, thumb, and finger extension) | Numbness on **Dorsal First Web Space** |
| **Supracondylar Fracture of Humerus** | **Anterior Interosseous Nerve (AIN)** (Median branch) $\\pm$ **Brachial Artery** | Loss of **"OK" Sign** (inability to flex index DIP via FDP and thumb IP via FPL) | No sensory loss (pure motor nerve); absent radial pulse if brachial artery trapped |
| **Medial Epicondyle / Hook of Hamate** | **Ulnar Nerve** | **Claw Hand** (loss of lumbricals 3 & 4; positive Froment sign / paper pinch test) | Numbness on **Palmar & Dorsal 5th digit** and medial half of 4th digit |
| **Fibula Neck Fracture / Knee Dislocation** | **Common Peroneal (Fibular) Nerve** | **Foot Drop** (loss of ankle dorsiflexion and eversion) | Numbness on **Dorsum of Foot** & lateral leg |
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male is brought to the trauma center following a head-on motor vehicle collision. His right knee struck the dashboard with high kinetic force. On physical examination, the patient's right lower extremity is held in a position of flexion, adduction, and internal rotation, and the right leg is noticeably shorter than the left. Sensation over the dorsum of the right foot is diminished, and he is unable to actively dorsiflex his right ankle.",
      question: "What is the primary diagnosis, which nerve is compromised, and what is the maximum time window for closed reduction to minimize the risk of avascular necrosis (AVN)?",
      options: [
        "Posterior Hip Dislocation; Sciatic Nerve; Reduction within 6 hours",
        "Anterior Hip Dislocation; Femoral Nerve; Reduction within 24 hours",
        "Femoral Neck Fracture; Obturator Nerve; Reduction within 12 hours",
        "Posterior Knee Dislocation; Tibial Nerve; Reduction within 48 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "A 'dashboard injury' that leaves the lower extremity flexed, adducted, internally rotated, and shortened is the classic presentation of a Posterior Hip Dislocation. The posterior displacement of the femoral head compresses or stretches the Sciatic Nerve (leading to foot drop from peroneal division injury). Emergency closed reduction under sedation must be performed within 6 hours of injury to preserve the medial circumflex femoral blood supply and prevent permanent avascular necrosis (AVN) of the femoral head."
    }
  ]
};
