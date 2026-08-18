/**
 * Lower Limb Anatomy Learning Content
 * Authoritative medical content derived from Gray's Anatomy (42nd ed.), Netter, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN14.1, AN15.1, AN17.1, AN18.1, AN20.1, AN25.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LOWER_LIMB_MODULE: PhysiologyLessonModule = {
  id: "anat-lower-limb",
  unitCode: "AN14.1",
  title: "Lower Limb Compartments, Joint Biomechanics & Gait Diagnostics",
  competencies: ["AN14.1", "AN15.1", "AN18.1", "AN20.1", "AN25.1"],
  estimatedMinutes: 115,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Lower Limb Compartments, Joint Biomechanics & Gait Diagnostics

The lower extremity provides bipedal locomotion, weight-bearing stability, and postural equilibrium through coordinated osteoarticular and neurovascular compartments.

---

## 1. Femoral Triangle & Femoral Sheath (NAVEL)

The **Femoral Triangle** (Scarpa's Triangle) is an anatomical landmark on the upper anterior thigh:

> **Boundaries of the Femoral Triangle**:
> - **Superior**: Inguinal Ligament (Poupart's ligament).
> - **Lateral**: Medial border of Sartorius muscle.
> - **Medial**: Medial border of Adductor Longus muscle.
> - **Floor**: Pectineus and Iliopsoas muscles.
> - **Roof**: Fascia lata and cribriform fascia.

### Neurovascular Contents (Lateral to Medial: NAVEL):
1. **Nerve (Femoral Nerve)**: Lies **OUTSIDE (lateral to) the femoral sheath** on iliopsoas.
2. **Artery (Femoral Artery)**: Pulse palpable at the mid-inguinal point (halfway between ASIS and pubic symphysis).
3. **Vein (Femoral Vein)**: Site for femoral central venous catheterization (punctured just medial to the femoral arterial pulse).
4. **Empty Space (Femoral Canal)**: Transmits lymphatic vessels and Cloquet/Rosenmüller deep inguinal lymph node. Site of **Femoral Hernias** (passes beneath inguinal ligament into medial thigh; highest rate of strangulation).
5. **Lymphatics**: Deep inguinal lymph nodes.

---

## 2. Knee Joint Biomechanics & Ligamentous Pathology

| Ligament / Structure | Primary Function | Clinical Injury Mechanism | Diagnostic Physical Exam Test |
| :--- | :--- | :--- | :--- |
| **Anterior Cruciate Ligament (ACL)** | Prevents anterior translation of tibia on femur | Non-contact deceleration, sudden pivoting or hyperextension | **Lachman test** (most sensitive), **Anterior Drawer test**, Pivot-Shift test |
| **Posterior Cruciate Ligament (PCL)** | Prevents posterior translation of tibia on femur | Dashboard injury (direct posterior blow to proximal tibia of flexed knee) | **Posterior Drawer test**, Posterior Sag sign |
| **Medial Collateral Ligament (MCL)** | Resists valgus (abduction) stress | Direct lateral blow to the knee | **Valgus stress test** at 30° knee flexion |
| **Lateral Collateral Ligament (LCL)** | Resists varus (adduction) stress | Direct medial blow to the knee | **Varus stress test** at 30° knee flexion |
| **Menisci (Medial & Lateral)** | Shock absorption and joint congruity | Twisting on weight-bearing flexed knee | **McMurray test** (pain/click on tibial rotation) & Apley grind test |

> **Unhappy Triad of O'Donoghue**:
> Classical triad caused by lateral force to a planted flexed knee:
> 1. **Anterior Cruciate Ligament (ACL)** tear
> 2. **Medial Collateral Ligament (MCL)** tear
> 3. **Medial Meniscus** (or Lateral Meniscus in acute contact tears) tear

---

## 3. Peripheral Nerves & Gait Pathologies

- **Common Fibular (Peroneal) Nerve Injury**:
  - *Location*: Vulnerable as it winds around the subcutaneous lateral **neck of the fibula** (fractures, compressive casts).
  - *Manifestation*: Loss of dorsiflexion and eversion $\\implies$ **'Foot Drop'**, high-stepping (steppage) gait, loss of sensation on anterolateral leg and dorsum of foot.
- **Superior Gluteal Nerve ($L4, L5, S1$)**:
  - *Innervation*: Gluteus medius, gluteus minimus, tensor fasciae latae.
  - *Action*: Abducts hip and keeps pelvis level during single-leg stance.
  - *Pathology*: **Positive Trendelenburg Sign** $\\implies$ when patient stands on the affected (weak) limb, the pelvis tilts downward on the contralateral normal side.
- **Inferior Gluteal Nerve ($L5, S1, S2$)**:
  - *Innervation*: Gluteus maximus.
  - *Deficit*: Difficulty rising from a seated position or climbing stairs (weak hip extension).
`,
  clinicalVignettes: [
    {
      scenario: "A 19-year-old collegiate soccer player experiences sudden severe right knee pain and an audible 'pop' after planting her foot and rapidly decelerating to change directions. On physical examination, marked joint effusion (hemarthrosis) is present. An examiner stabilizes the distal femur with one hand and pulls the proximal tibia anteriorly with the knee flexed at 30 degrees, revealing significant anterior tibial translation with a soft endpoint.",
      question: "Which of the following physical examination tests was performed and which structure is torn?",
      options: [
        "Lachman test; Anterior Cruciate Ligament (ACL)",
        "Posterior Drawer test; Posterior Cruciate Ligament (PCL)",
        "Valgus stress test; Medial Collateral Ligament (MCL)",
        "McMurray test; Medial Meniscus"
      ],
      correctAnswerIndex: 0,
      explanation: "The Lachman test (performed at 20-30 degrees of knee flexion) is the most sensitive physical examination maneuver for evaluating Anterior Cruciate Ligament (ACL) integrity. A sudden deceleration/pivoting injury accompanied by an audible pop and acute hemarthrosis is classic for an ACL tear."
    }
  ]
};
