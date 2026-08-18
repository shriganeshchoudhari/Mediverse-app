/**
 * Postgraduate Advanced Physical Medicine & Rehabilitation: Stroke Spasticity, Botox & ITB
 * Authoritative physiatric content derived from AAPM&R Spasticity Consensus, Modified Ashworth Scale, ITB Emergency Protocols.
 * Mapped to NMC PG CBME Competencies: PG11.3, PMR3.1, PMR3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const STROKE_SPASTICITY_BOTOX_INTRATHECAL_BACLOFEN_MODULE: PhysiologyLessonModule = {
  id: "pg11-stroke-spasticity-botox-intrathecal-baclofen",
  unitCode: "PG11.3",
  title: "Stroke Neuro-Rehabilitation & Upper/Lower Motor Neuron Spasticity: MAS, Botulinum Toxin & ITB Emergencies",
  competencies: ["PG11.3", "PMR3.1", "PMR3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Stroke Neuro-Rehabilitation & Advanced Spasticity Interventions

Post-stroke hypertonia and upper motor neuron syndrome spasticity require systematic clinical grading (Modified Ashworth Scale), targeted intramuscular chemodenervation (Botulinum Toxin A), and advanced intrathecal therapies.

---

## 1. Modified Ashworth Scale (MAS) Diagnostic Grading

$$\\begin{array}{lcccc}
\\hline
\\textbf{MAS Grade} & \\textbf{Clinical Description} & \\textbf{Resistance Pattern Through ROM} \\\\
\\hline
\\textbf{Grade 0} & \\text{No increase in muscle tone} & \\text{Normal passive mobility} \\\\
\\textbf{Grade 1} & \\text{Slight increase in muscle tone} & \\text{Catch and release or minimal resistance at END of ROM} \\\\
\\textbf{Grade 1+} & \\text{Slight increase in muscle tone} & \\mathbf{\\text{Catch followed by minimal resistance through remainder } (< 50\\%)\\text{ of ROM}} \\\\
\\textbf{Grade 2} & \\text{More marked increase in tone} & \\text{Resistance through MOST of ROM, but affected part easily flexed} \\\\
\\textbf{Grade 3} & \\text{Considerable increase in tone} & \\mathbf{\\text{Passive movement difficult; passive stretch meets severe resistance}} \\\\
\\textbf{Grade 4} & \\text{Rigid in flexion or extension} & \\text{Affected part fixed / rigid} \\\\
\\hline
\\end{array}$$

---

## 2. Targeted Chemodenervation & Intrathecal Baclofen (ITB)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Modality / Intervention} & \\textbf{Mechanism of Action} & \\textbf{Dosing \\& Onset Parameters} & \\textbf{Key Safety Rules \\& Emergency Protocols} \\\\
\\hline
\\textbf{Botulinum Toxin A (Botox)} & \\mathbf{\\text{Cleaves SNAP-25 protein,}} & \\text{Onset: 48-72h; Peak: 4-6wks;} & \\mathbf{\\text{Max adult dose } \\le 400-600\\text{ Units/session;}} \\\\
& \\text{blocking presynaptic ACh release} & \\text{Duration: 3-4 months} & \\text{Ultrasound / EMG guidance mandatory} \\\\
\\textbf{Intrathecal Baclofen (ITB)} & \\mathbf{\\text{GABA-B receptor agonist}} & \\text{Continuous lumbar subarachnoid} & \\mathbf{\\text{ITB Withdrawal Emergency:}} \\\\
& \\text{in spinal dorsal horn} & \\text{micro-infusion} & \\mathbf{\\text{Acute hyperthermia, rebound spasticity,}} \\\\
& & & \\mathbf{\\text{rhabdomyolysis, death; IV BZDs + ITB re-infusion}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 44-year-old male with severe secondary progressive spastic quadriparesis managed with an implanted Intrathecal Baclofen (ITB) pump (infusing 450 ug/day) is brought to the emergency department with acute encephalopathy, severe generalized muscle rigidity, sweating, and hallucinations that started 8 hours ago. On examination, he is in extreme distress with generalized clonic spasms, fever of 39.9 C (103.8 F), BP 184/106 mmHg, and HR 136 bpm. Interrogation of the pump reveals an empty reservoir due to a missed refill appointment 2 days ago.",
      question: "What is the diagnosis, what life-threatening complications can rapidly develop, and what is the definitive resuscitation strategy?",
      options: [
        "Acute Intrathecal Baclofen (ITB) Withdrawal Emergency; this life-threatening crisis can rapidly precipitate malignant hyperthermia, rhabdomyolysis, multisystem organ failure, seizures, and death mimicking NMS or septic shock; immediately initiate aggressive supportive care with high-dose intravenous Benzodiazepines (Diazepam or Lorazepam titrated to effect) and urgent refill/re-infusion of Intrathecal Baclofen (or continuous IV Propofol/oral high-dose Baclofen if pump access is delayed)",
        "Baclofen toxicity/overdose; administer Flumazenil and drain the pump reservoir",
        "Acute bacterial meningitis; perform immediate lumbar puncture without administering GABA agonists",
        "Opioid withdrawal; administer high-dose Methadone and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates acute Intrathecal Baclofen Withdrawal: (1) Pathophysiology: Abrupt cessation of intrathecal GABA-B agonism causes uninhibited central autonomic storming and rebound spasticity; (2) Life-Threatening Manifestations: High fevers (39.9 C), severe spasticity, rhabdomyolysis, seizures, and death; (3) Immediate Stabilization: High-dose IV Benzodiazepines (GABA-A agonists) to suppress sympathetic storming while urgently restoring intrathecal baclofen delivery."
    }
  ]
};
