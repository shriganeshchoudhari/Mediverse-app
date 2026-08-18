/**
 * Lower Limb Prosthetics, Orthotics (AFOs/KAFOs) & Functional K-Levels
 * Authoritative medical content derived from Braddom's PM&R, DeLisa, and USMLE Step 2/3 PMR.
 * Mapped to NMC CBME Competencies: PM5.1, PM5.2, PM6.1, PM6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PROSTHETICS_ORTHOTICS_K_LEVELS_MODULE: PhysiologyLessonModule = {
  id: "pmr-prosthetics-orthotics-k-levels",
  unitCode: "PM5.1",
  title: "PMR: Lower Limb Prosthetics, Functional K-Levels (K0–K4) & Orthotics (AFO/KAFO Prescriptions)",
  competencies: ["PM5.1", "PM5.2", "PM6.1", "PM6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# PMR: Lower Limb Prosthetics, Functional K-Levels (K0–K4) & Orthotics (AFO/KAFO Prescriptions)

Biomechanical prescription of prosthetic limbs and orthotic braces restores mobility, optimizes metabolic energy expenditure, and prevents secondary musculoskeletal deformities.

---

## 1. Lower Limb Amputation Levels & Energy Expenditure

$$\\text{Metabolic Oxygen Consumption / Energy Cost increases exponentially with higher levels of amputation!}$$

| Amputation Level | Anatomical Landmarks & Socket Types | Energy Cost (% Above Baseline) | Biomechanical Considerations & Walking Speed |
| :--- | :--- | :--- | :--- |
| **Transtibial (Below-Knee Amputation, BKA)** | Ideal residual bone length: **$12 - 17\\text{ cm}$ below tibial plateau** ($1/3$ to $1/2$ of tibial length).<br>Sockets: **Patellar Tendon Bearing (PTB)** (loads patellar tendon, medial tibial flare) vs **Total Surface Bearing (TSB)** with silicone suction liner. | **$+ 10 - 40\\%$ increase** | Preserves anatomical knee joint $\\implies$ normal proprioception and substantially lower energy expenditure than transfemoral amputation; $>80\\%$ achieve community ambulation. |
| **Transfemoral (Above-Knee Amputation, AKA)** | Ideal residual bone length: **$50 - 60\\%$ of femur length** (measured from greater trochanter).<br>Sockets: **Ischial Containment Socket** (locks ischial tuberosity inside socket for coronal stability) vs Quadrilateral socket. | **$+ 60 - 100\\%$ increase** | Loss of biological knee joint requires prosthetic knee mechanism; high metabolic penalty; elderly or vascular amputees often restricted to limited household ambulation. |
| **Syme Amputation** | Ankle disarticulation with removal of malleoli and preservation of the durable **Heel Pad** anchored to distal tibia. | **$+ 15\\%$ increase** | Allows direct distal **End-Bearing** for short transfers without prosthesis; cosmetically bulkier ankle container. |

---

## 2. Medicare Functional Classification Levels (K-Levels K0–K4)

The functional K-Level determines the clinical justification and Medicare reimbursement for specific prosthetic components (feet, knees, and socket materials).

| Functional Level | Ambulation Potential & Definition | Indicated Prosthetic Foot Design | Indicated Prosthetic Knee Unit |
| :--- | :--- | :--- | :--- |
| **Level K0** | **Non-Ambulator**: No ability or potential to ambulate or transfer safely with or without assistance; a prosthesis does not enhance mobility or quality of life. | **No prosthesis prescribed** (Wheelchair mobility). | None. |
| **Level K1** | **Household Ambulator**: Ability or potential to use prosthesis for transfers or ambulation on level surfaces at a **fixed, single cadence**. | **SACH Foot (Solid Ankle Cushion Heel)** or Single-Axis Foot. | Single-axis constant friction knee / manual locking knee. |
| **Level K2** | **Limited Community Ambulator**: Ability or potential to traverse low-level environmental barriers such as **curbs, stairs, or uneven surfaces**. | **Flexible Keel Foot** or Multi-Axial Foot. | Polycentric knee (provides geometric stability in stance). |
| **Level K3** | **Unlimited Community Ambulator**: Ability or potential for ambulation with **variable cadence**; capable of traversing most environmental barriers; recreational/vocational activities. | **Dynamic Response / Energy-Storing Carbon Fiber Foot** (stores energy in stance, releases energy at toe-off). | Fluid/Pneumatic knee or **Microprocessor-Controlled Knee (MPK)** (e.g. C-Leg). |
| **Level K4** | **High-Impact / Active Ambulator**: Exceeds basic ambulation skills; exhibits high-impact, stress, or energy levels (active child, athlete, laborer). | **Specialty Energy-Storing Carbon Blade / Sport Feet**. | Any appropriate high-activity knee system. |

---

## 3. Lower Limb Orthoses: AFO & KAFO Prescriptions

- **Ankle-Foot Orthosis (AFO)**:
  - **Posterior Leaf Spring (PLS) AFO**:
    - Thin, flexible polypropylene plastic trimmed behind the malleoli.
    - *Indication*: **Isolated Foot Drop (Dorsiflexor weakness $\\ge 3/5$ knee/quadriceps strength)** with normal mediolateral ankle stability and absence of severe spasticity. Provides spring-assisted toe clearance during swing phase.
  - **Solid Ankle AFO**:
    - Rigid plastic extending anterior to the malleoli, locking the ankle at $90^\\circ$ (neutral).
    - *Indication*: Severe spasticity, ankle instability, or **Genu Recurvatum (knee hyperextension)** in stance phase (locking ankle in $3-5^\\circ$ dorsiflexion reduces extension moment at the knee).
  - **Articulated / Hinged AFO**:
    - Incorporates a mechanical ankle hinge allowing free sagittal dorsiflexion while blocking plantarflexion (dorsiflexion assist / plantarflexion stop).
- **Knee-Ankle-Foot Orthosis (KAFO)**:
  - Extends across the knee to the thigh.
  - *Indication*: **Severe Quadriceps Weakness (Quadriceps strength $< 3/5$)** where knee buckling occurs during stance phase, or severe genu recurvatum $> 15^\\circ$.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male construction foreman underwent a left transtibial (below-knee) amputation following a severe industrial crush injury. He has completed residual limb conditioning and has full range of motion in the left knee with 5/5 quadriceps and hamstring strength. He is highly motivated to return to his active job site, walk across gravel and uneven ground, climb ladders, and engage in recreational jogging. He demonstrates the ability to walk at varying cadences during trial evaluations.",
      question: "Which Medicare Functional K-Level best describes this patient, and which prosthetic foot design is clinically indicated?",
      options: [
        "Functional Level K3 (Community ambulator with variable cadence); Prescribe a Dynamic Response / Energy-Storing Carbon Fiber Foot",
        "Functional Level K1 (Household ambulator); Prescribe a Solid Ankle Cushion Heel (SACH) foot",
        "Functional Level K0; No prosthetic prescription is indicated",
        "Functional Level K2; Prescribe a single-axis constant friction foot"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient capable of community ambulation with variable cadence, navigating uneven environmental barriers (such as construction sites and stairs), and engaging in high-level vocational/recreational activities meets the criteria for Functional Level K3. The gold-standard prosthetic foot component for K3 ambulators is a Dynamic Response / Energy-Storing Carbon Fiber Foot, which absorbs energy during stance and returns it at push-off to normalize gait efficiency."
    }
  ]
};
