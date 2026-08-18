/**
 * Postgraduate Advanced Physical Medicine & Rehabilitation: Pediatric Cerebral Palsy, Gait & Prosthetics
 * Authoritative physiatric content derived from GMFCS Consensus, Perry's Gait Analysis, Prosthetics & Orthotics Standards.
 * Mapped to NMC PG CBME Competencies: PG11.4, PMR4.1, PMR4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_CEREBRAL_PALSY_GAIT_PROSTHETICS_MODULE: PhysiologyLessonModule = {
  id: "pg11-pediatric-cerebral-palsy-gait-prosthetics",
  unitCode: "PG11.4",
  title: "Pediatric Cerebral Palsy (GMFCS I-V), Pathological Gait Kinematics, AFO Prescriptions & Prosthetics",
  competencies: ["PG11.4", "PMR4.1", "PMR4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Pediatric Cerebral Palsy, Gait Analysis & Amputee Rehabilitation

Pediatric rehabilitation and amputee biomechanics require systematic classification via the Gross Motor Function Classification System (GMFCS), prescription of Ground Reaction AFOs for crouch gait kinematics, and socket pressure biomechanics.

---

## 1. Gross Motor Function Classification System (GMFCS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{GMFCS Level} & \\textbf{Functional Mobility Status} & \\textbf{Stair Ambulation} & \\textbf{Assistive Devices / Transport} \\\\
\\hline
\\textbf{Level I} & \\text{Walks without limitations} & \\text{Climbs stairs without railing} & \\text{Speed, balance, and coordination limited} \\\\
\\textbf{Level II} & \\text{Walks with limitations} & \\text{Climbs stairs holding railing} & \\text{Difficulty on uneven terrain / crowds} \\\\
\\textbf{Level III} & \\mathbf{\\text{Walks with handheld mobility devices}} & \\text{Climbs stairs holding railing} & \\mathbf{\\text{Uses crutches / walker; wheelchair for distances}} \\\\
\\textbf{Level IV} & \\mathbf{\\text{Self-mobility with limitations}} & \\text{Cannot climb stairs} & \\mathbf{\\text{Uses powered wheelchair or physical assist}} \\\\
\\textbf{Level V} & \\mathbf{\\text{Transported in manual wheelchair}} & \\text{Severe limitations in head/trunk} & \\mathbf{\\text{Total physical assistance required}} \\\\
\\hline
\\end{array}$$

---

## 2. Pathological Gait Kinematics & Orthotic Prescriptions

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pathological Gait Pattern} & \\textbf{Kinematic Fault} & \\textbf{Primary Muscle Pathology} & \\textbf{Orthotic / Surgical Prescription} \\\\
\\hline
\\textbf{Crouch Gait} & \\mathbf{\\text{Excessive knee \\& hip flexion in stance}} & \\text{Weak quadriceps, tight hamstrings} & \\mathbf{\\text{Ground Reaction AFO (GRAFO)}} \\\\
\\textbf{Equinus Gait} & \\text{Toe walking (excessive plantarflexion)} & \\text{Gastrocnemius-soleus spasticity} & \\mathbf{\\text{Solid or Hinged AFO with PF stop}} \\\\
\\textbf{Jump Knee Gait} & \\text{Early stance equinus + late hyperextension} & \\text{Gastroc-soleus + hamstring spasticity} & \\text{Articulated AFO with PF stop} \\\\
\\textbf{Stiff Knee Gait} & \\text{Inadequate knee flexion in swing phase} & \\text{Rectus femoris spasticity} & \\mathbf{\\text{Rectus Femoris Transfer to Gracilis}} \\\\
\\hline
\\end{array}$$

---

## 3. Transtibial (Below-Knee Amputation BKA) Prosthetic Biomechanics

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pressure-Tolerant Areas (Load-Bearing)} & \\textbf{Pressure-Sensitive Areas (Relief Required)} \\\\
\\hline
\\mathbf{\\text{Patellar Tendon (primary load bearing)}} & \\mathbf{\\text{Tibial Tuberosity \\& Anterior Tibial Crest}} \\\\
\\mathbf{\\text{Medial Tibial Flare}} & \\mathbf{\\text{Distal Cut End of Tibia and Fibula}} \\\\
\\mathbf{\\text{Pretibial Muscle Belly}} & \\mathbf{\\text{Fibular Head \\& Common Peroneal Nerve}} \\\\
\\mathbf{\\text{Gastrocnemius Muscle Belly}} & \\text{Hamstring Tendons} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "An 8-year-old boy with spastic diplegic cerebral palsy (GMFCS Level II) is evaluated in the pediatric gait analysis laboratory. Observational 3D kinematic motion analysis reveals bilateral excessive knee flexion (35 degrees at midstance), excessive hip flexion, and prolonged ankle dorsiflexion throughout the stance phase without foot contact separation. Manual muscle testing reveals 3+/5 knee extensor (quadriceps) strength and dynamic hamstring tightness.",
      question: "What is this pathological gait pattern, and which specialized Ankle-Foot Orthosis (AFO) design is indicated to restore knee extension during stance phase?",
      options: [
        "Crouch Gait; prescribe a Ground Reaction Ankle-Foot Orthosis (GRAFO / Floor Reaction AFO), which holds the ankle in slight plantarflexion/neutral alignment and creates an anterior ground reaction force vector in front of the knee axis, generating an external knee extension moment during midstance to prevent crouch collapse",
        "Equinus gait; prescribe a posterior leaf spring AFO",
        "Stiff knee gait; perform immediate Achilles tendon lengthening",
        "Trendelenburg gait; prescribe high-top orthopedic shoes without braces"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Crouch Gait in cerebral palsy: (1) Kinematic Definition: Excessive knee flexion and hip flexion with calcaneus ankle dorsiflexion during stance; (2) Biomechanical Solution: Ground Reaction AFO (GRAFO) utilizes ground reaction forces by rigidly restricting ankle dorsiflexion, directing the ground reaction vector anterior to the knee joint center to generate an extension moment that uprights the knee."
    }
  ]
};
