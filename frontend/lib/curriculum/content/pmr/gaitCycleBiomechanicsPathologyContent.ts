/**
 * Gait Cycle Biomechanics, Kinematics & Pathological Gaits
 * Authoritative medical content derived from Perry's Gait Analysis, Braddom's PM&R, DeLisa, and USMLE Step 2/3 PMR.
 * Mapped to NMC CBME Competencies: PM7.1, PM7.2, PM8.1, PM8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GAIT_CYCLE_BIOMECHANICS_PATHOLOGY_MODULE: PhysiologyLessonModule = {
  id: "pmr-gait-cycle-biomechanics-pathology",
  unitCode: "PM7.1",
  title: "PMR: Gait Cycle Biomechanics (Stance vs Swing) & Pathological Gaits (Trendelenburg, Steppage, Circumduction)",
  competencies: ["PM7.1", "PM7.2", "PM8.1", "PM8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# PMR: Gait Cycle Biomechanics (Stance vs Swing) & Pathological Gaits (Trendelenburg, Steppage, Circumduction)

Human bipedal locomotion consists of cyclical alternating phases of support and limb advancement that minimize vertical and lateral displacement of the body\'s center of mass.

---

## 1. Biomechanical Subdivisions of the Normal Gait Cycle

$$\\text{Normal Gait Cycle} = \\underbrace{\\text{Stance Phase } (60\\%)}_{\\text{Foot in contact with ground}} + \\underbrace{\\text{Swing Phase } (40\\%)}_{\\text{Foot advancing in air}}$$
$$\\text{Double Limb Support} = 20\\% \\text{ of gait cycle (10\\% at initial contact } + 10\\% \\text{ at pre-swing; disappears in running!)}$$

| Phase & Percentage | Subphase (Perry Terminology) | Key Muscle Activity & Joint Kinematics | Primary Functional Objective |
| :--- | :--- | :--- | :--- |
| **Stance Phase**<br>($60\\%$) | **1. Initial Contact (Heel Strike)** ($0-2\\%$) | Tibialis anterior contracts eccentrically; knee in full extension ($0^\\circ$). | Position foot for contact; begin deceleration. |
| | **2. Loading Response (Foot Flat)** ($2-12\\%$) | Quadriceps contract eccentrically to absorb shock; ankle plantarflexes $5^\\circ$. | **Shock absorption** and weight acceptance (Double support). |
| | **3. Mid-Stance** ($12-31\\%$) | Gastrocnemius-soleus contract eccentrically to control forward tibial progression; Gluteus medius stabilizes pelvis in coronal plane. | Single-limb support stability; progression of body over stationary foot. |
| | **4. Terminal Stance (Heel Off)** ($31-50\\%$) | Gastrocnemius-soleus contract concentrically for push-off; hip extends $10-20^\\circ$. | Progression beyond supporting foot; preparation for swing. |
| | **5. Pre-Swing (Toe Off)** ($50-62\\%$) | Iliopsoas and rectus femoris initiate hip flexion; knee flexes rapidly to $40^\\circ$. | Accelerate limb forward into swing (Double support). |
| **Swing Phase**<br>($40\\%$) | **6. Initial Swing (Acceleration)** ($62-75\\%$) | Tibialis anterior concentric dorsiflexion; knee reaches peak flexion ($60^\\circ$). | **Foot clearance** off the ground and limb acceleration. |
| | **7. Mid-Swing** ($75-87\\%$) | Tibialis anterior maintains ankle neutral ($0^\\circ$); hip flexes to $30^\\circ$. | Limb advancement and vertical foot clearance. |
| | **8. Terminal Swing (Deceleration)** ($87-100\\%$) | Hamstrings contract eccentrically to decelerate advancing leg; knee extends to $0^\\circ$. | Complete limb advancement; prepare for initial contact. |

---

## 2. Classic Pathological Gaits & Kinematic Hallmarks

| Pathological Gait | Neurological / Musculoskeletal Etiology | Pathognomonic Kinematic Features & Compensation | Targeted Rehabilitation & Bracing |
| :--- | :--- | :--- | :--- |
| **Trendelenburg Gait** | Weakness of Hip Abductors (**Gluteus Medius & Minimus**; **Superior Gluteal Nerve $L_4 - S_1$**) or hip dislocation/coxa vara. | • **Uncompensated**: During single-leg stance on affected limb, the **pelvis drops downward on the contralateral (swing) side**.<br>• **Compensated (Trendelenburg Lurch)**: Patient leans trunk laterally **TOWARD the affected (stance) side** to shift center of mass over the hip fulcrum. | Strengthening of gluteus medius; cane held in the **contralateral (opposite) hand** (reduces hip abductor force demand by $>50\\%$!). |
| **Steppage Gait ("Foot Drop Gait")** | Weakness of ankle dorsiflexors (**Tibialis Anterior**; **Deep Peroneal / Common Fibular Nerve**) or $L_5$ radiculopathy / Charcot-Marie-Tooth. | • Inability to dorsiflex ankle during swing phase $\\rightarrow$ patient excessively **flexes hip and knee ("high step")** to lift foot and prevent tripping, followed by an audible **foot slap** at initial contact. | **Posterior Leaf Spring (PLS) AFO** or Articulated AFO with dorsiflexion assist. |
| **Hemiplegic / Circumduction Gait** | Upper Motor Neuron lesion / post-stroke spastic hemiplegia (**Extensor synergy of lower limb**). | • Due to spastic knee extension and equinovarus ankle, the leg is functionally "too long" $\\rightarrow$ patient swings the affected stiff leg outward in a **lateral semicircular arc (circumduction)** and performs pelvic hiking to clear the floor. | Spasticity reduction (Botox/Baclofen), solid or hinged AFO, task-oriented gait training. |
| **Parkinsonian (Festinating) Gait** | Basal Ganglia dopamine deficiency (Parkinson\'s Disease). | • **Stooped forward posture**, narrow base of support, absent reciprocal arm swing, **short shuffling steps** with progressive involuntary acceleration (**festination**), difficulty initiating gait (freezing), and turning **"en bloc"**. | Visual and auditory cueing (metronome), big-movement physical therapy (LSVT BIG). |
| **Antalgic Gait** | Lower extremity pain (osteoarthritis, fracture, sprain). | • **Significantly shortened stance phase on the painful affected limb** with rapid, hurried swing phase on the healthy limb to minimize weight-bearing duration. | Assistive devices (cane in contralateral hand, crutches), joint offloading, analgesia. |
| **Cerebellar (Ataxic) Gait** | Cerebellar vermis / midline lesion (alcoholism, stroke, MS). | • **Wide-based, unsteady, staggering gait** with irregular stride lengths and lateral veering (titubation); severely impaired on tandem walking ("heel-to-toe"). | Balance training, weighted vests, Frenkel exercises. |
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old female who underwent an uncomplicated right total hip arthroplasty via a direct lateral (Hardinge) approach 3 months ago presents for gait evaluation. When asked to walk down the hallway, the examiner notices that whenever she stands on her right lower extremity during stance phase, her pelvis visibly drops downward on the left (unsupported swing) side. To prevent falling, she shifts her upper trunk laterally to the right over her right hip joint.",
      question: "Which nerve and muscle group were impaired, and in which hand should she hold a single-point cane to mechanically offload the joint?",
      options: [
        "Right Superior Gluteal Nerve injuring the Gluteus Medius and Minimus; Hold cane in the LEFT (contralateral) hand",
        "Right Inferior Gluteal Nerve injuring the Gluteus Maximus; Hold cane in the RIGHT (ipsilateral) hand",
        "Right Femoral Nerve injuring the Quadriceps; Hold cane in the LEFT hand",
        "Right Sciatic Nerve injuring the Hamstrings; Hold cane in the RIGHT hand"
      ],
      correctAnswerIndex: 0,
      explanation: "A pelvic drop on the contralateral (left) side during single-limb stance on the right side, accompanied by a lateral trunk lean (lurch) over the right hip, is a classic Trendelenburg Gait. This results from weakness or denervation of the right hip abductors (Gluteus Medius and Minimus, innervated by the Superior Gluteal Nerve L4-S1), which can be stretched or injured during a lateral approach to the hip. To mechanically assist the weak abductors, a cane must be held in the CONTRALATERAL (left) hand, which creates a long lever arm that provides an abductor moment to keep the pelvis level with minimal effort."
    }
  ]
};
