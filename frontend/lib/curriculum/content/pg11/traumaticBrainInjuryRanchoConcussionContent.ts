/**
 * Postgraduate Advanced Physical Medicine & Rehabilitation: Traumatic Brain Injury & Cognitive Staging
 * Authoritative physiatric content derived from Rancho Los Amigos Scale, AAN Disorders of Consciousness Guidelines, SCAT-6 Consensus.
 * Mapped to NMC PG CBME Competencies: PG11.2, PMR2.1, PMR2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRAUMATIC_BRAIN_INJURY_RANCHO_CONCUSSION_MODULE: PhysiologyLessonModule = {
  id: "pg11-traumatic-brain-injury-rancho-concussion",
  unitCode: "PG11.2",
  title: "Traumatic Brain Injury (TBI): Rancho Los Amigos Cognitive Staging (I-X), Disorders of Consciousness & SCAT-6",
  competencies: ["PG11.2", "PMR2.1", "PMR2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Traumatic Brain Injury, Cognitive Staging & Sports Concussion Protocols

Comprehensive neurotrauma rehabilitation requires systematic cognitive evaluation via the Rancho Los Amigos Levels of Cognitive Functioning (RLAS I-X), evidence-based pharmacologic emergence in Disorders of Consciousness (DoC), and structured graduated return-to-play protocols.

---

## 1. Rancho Los Amigos Levels of Cognitive Functioning (RLAS)

$$\\begin{array}{lcccc}
\\hline
\\textbf{RLAS Level} & \\textbf{Cognitive Staging} & \\textbf{Clinical Behaviors \\& Response Pattern} & \\textbf{Assistance Required \\& Environment} \\\\
\\hline
\\textbf{Level I-III} & \\text{No / Generalized / Localized} & \\text{Coma to inconsistent localized response} & \\text{Total Assistance; sensory stimulation} \\\\
\\textbf{Level IV} & \\mathbf{\\text{Confused-Agitated}} & \\mathbf{\\text{Heightened state of activity; bizarre, aggressive;}} & \\mathbf{\\text{Max Assistance; QUIET ROOM, NO RESTRAINTS,}} \\\\
& & \\mathbf{\\text{no short-term recall; internal confusion}} & \\mathbf{\\text{structured low-stimulation environment}} \\\\
\\textbf{Level V} & \\mathbf{\\text{Confused-Inappropriate,}} & \\text{Alert, responds to simple commands; highly} & \\text{Max Assistance; highly distractible,} \\\\
& \\mathbf{\\text{Non-Agitated}} & \\text{distractible, gross confabulation, un-focused} & \\text{requires structured redirection} \\\\
\\textbf{Level VI} & \\mathbf{\\text{Confused-Appropriate}} & \\text{Goal-directed behavior with cues; emerging memory} & \\text{Moderate Assistance; follows schedule} \\\\
\\textbf{Level VII-VIII} & \\text{Automatic / Purposeful} & \\text{Robot-like daily routines; increasing independence} & \\text{Minimal Assistance to Stand-by} \\\\
\\hline
\\end{array}$$

---

## 2. Disorders of Consciousness (DoC) & Neuro-Stimulant Pharmacotherapy

- **Differential Diagnosis of DoC**:
  - **Coma**: No wakefulness (no eye-opening), no purposeful awareness.
  - **Vegetative State / Unresponsive Wakefulness Syndrome (VS/UWS)**: Wakefulness present (spontaneous eye-opening) but absence of purposeful behavioral awareness.
  - **Minimally Conscious State (MCS)**: Reproducible, non-reflexive purposeful responses (visual tracking/fixation, command following, object manipulation).
- **Evidence-Based Pharmacotherapy**:
  - **Amantadine ($100-200\\text{ mg}$ BID)**: Dopamine agonist and NMDA receptor antagonist; proven in multicenter randomized controlled trials (NEJM) to accelerate functional emergence in traumatic DoC.

---

## 3. SCAT-6 Graduated Return-to-Play Concussion Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Stage} & \\textbf{Activity Level} & \\textbf{Exercise Objective \\& Functional Milestone} & \\textbf{Minimum Duration} \\\\
\\hline
\\mathbf{Stage\\;1} & \\text{Symptom-Limited Activity} & \\text{Daily activities that do not provoke symptoms} & \\ge 24\\text{ hours} \\\\
\\mathbf{Stage\\;2} & \\text{Light Aerobic Exercise} & \\text{Stationary cycling, walking; NO resistance training} & \\ge 24\\text{ hours} \\\\
\\mathbf{Stage\\;3} & \\text{Sport-Specific Exercise} & \\text{Running drills, skating; NO head impact activities} & \\ge 24\\text{ hours} \\\\
\\mathbf{Stage\\;4} & \\text{Non-Contact Training Drills} & \\text{Harder training drills (passing); progressive resistance} & \\ge 24\\text{ hours} \\\\
\\mathbf{Stage\\;5} & \\mathbf{\\text{Full-Contact Practice}} & \\mathbf{\\text{Medical clearance mandatory; restore confidence}} & \\ge 24\\text{ hours} \\\\
\\mathbf{Stage\\;6} & \\mathbf{\\text{Return to Competition}} & \\text{Full, unrestricted game play} & - \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old collegiate hockey player sustained a severe traumatic brain injury with right frontal contusion and diffuse axonal injury (DAI) 4 weeks ago. Following transfer to the inpatient neuro-rehabilitation unit, he is noted to be awake, restless, and intensely combative. He pulls repeatedly at his gastrostomy tube, yells profanities at staff, exhibits severe attention deficits, and does not recognize that he is in a hospital. He has zero short-term memory recall and attempts to climb out of bed continuously without purposeful intent.",
      question: "What Rancho Los Amigos Level of Cognitive Functioning does this patient demonstrate, and what is the gold-standard rehabilitation management strategy for this stage?",
      options: [
        "Rancho Los Amigos Level IV (Confused-Agitated); management focuses on providing a low-stimulation, highly structured environment in a quiet, private room with dim lighting, consistent routine, one-on-one supervision with a low floor-bed/enclosure bed, avoidance of physical and heavy chemical restraints (which paradoxically worsen agitation), and using calm, simple, non-confrontational redirection",
        "Rancho Los Amigos Level II (Generalized Response); administer high-dose Haloperidol and apply four-point leather wrist restraints",
        "Rancho Los Amigos Level VI (Confused-Appropriate); discharge home immediately to resume driving",
        "Rancho Los Amigos Level VIII (Purposeful-Appropriate); begin high-speed cognitive computerized testing"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Rancho Los Amigos Level IV (Confused-Agitated): (1) Clinical Hallmarks: Severe internal agitation, non-purposeful aggression, confusion, lack of short-term memory, and uncooperative behavior; (2) Gold-Standard Environment: Minimize external sensory stimulation (quiet room, low lighting, minimal visitors); (3) Safety Principles: Avoid physical restraints whenever possible because they trigger escalated panic and combative struggling; (4) Communication: Use calm, repetitive, concise redirection."
    }
  ]
};
