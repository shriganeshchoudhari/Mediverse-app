/**
 * Clinical Postings I: Bedside Pulmonary, Abdominal & Neurological Clinical Signs
 * Authoritative physical examination content derived from Bates, Hutchison, Sapira.
 * Mapped to NMC CBME Competencies: CP1.3, IM1.3, SU1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BEDSIDE_PULMONARY_ABDOMINAL_NEURO_SIGNS_MODULE: PhysiologyLessonModule = {
  id: "clin1-bedside-pulmonary-abdominal-neuro-signs",
  unitCode: "CP1.3",
  title: "Bedside Physical Signs: Tactile Fremitus, Egophony, Shifting Dullness, Fluid Wave, Asterixis & Clonus",
  competencies: ["CP1.3", "IM1.3", "SU1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Bedside Pulmonary, Abdominal & Toxic-Metabolic Clinical Signs

Systematic bedside physical examination maneuvers differentiate fluid from solid pathology across chest, abdomen, and neuro-metabolic axes.

---

## 1. Pulmonary Physical Signs: Consolidation vs Pleural Effusion vs Pneumothorax

$$\\begin{array}{lcccc}
\\hline
\\textbf{Physical Exam Maneuver} & \\textbf{Lobar Consolidation (Pneumonia)} & \\textbf{Pleural Effusion} & \\textbf{Pneumothorax} \\\\
\\hline
\\textbf{Tactile Fremitus} & \\mathbf{\\text{INCREASED (Sound travels faster in solid)}} & \\mathbf{\\text{DECREASED (Fluid insulates sound)}} & \\mathbf{\\text{DECREASED / ABSENT (Air gap)}} \\\\
\\textbf{Percussion Note} & \\textbf{Dull / Flat} & \\textbf{Stony Dull} & \\mathbf{\\text{Hyperresonant / Tympanitic}} \\\\
\\textbf{Breath Sounds} & \\mathbf{\\text{Bronchial (Tubular / High-pitched)}} & \\text{Decreased / Absent over fluid} & \\text{Decreased / Absent over air} \\\\
\\textbf{Adventitious Sounds} & \\text{Late inspiratory crackles (rales)} & \\text{Pleural friction rub (early)} & \\text{None} \\\\
\\textbf{Vocal Resonance Signs} & \\mathbf{\\text{Egophony (\"E\" to \"A\"), Bronchophony, Whispered Pectoriloquy}} & \\text{Absent over effusion} & \\text{Absent} \\\\
\\textbf{Tracheal Deviation} & \\text{Midline} & \\text{Deviates AWAY (if massive)} & \\mathbf{\\text{Deviates AWAY (Tension Pneumo)}} \\\\
\\hline
\\end{array}$$

---

## 2. Abdominal \u0026 Toxic-Metabolic Clinical Signs

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Sign / Maneuver} & \\textbf{Maneuver Technique} & \\textbf{Underlying Pathophysiology} & \\textbf{Clinical Utility \u0026 Sensitivity} \\\\
\\hline
\\textbf{Shifting Dullness} & \\text{Percuss from midline to flank; turn patient} & \\text{Free ascites fluid shifts to dependent} & \\mathbf{\\text{Detects } > 1{,}500\\text{ mL ascites}} \\\\
& 45^{\\circ}\\text{ onto side; percussion changes from dull to tympanitic} & \\text{flank while air-filled bowel floats up} & (\\text{more sensitive than fluid wave}) \\\\
\\textbf{Fluid Wave} & \\text{Assistant places hand on midline; tap one flank,} & \\text{Shock wave transmitted through liquid} & \\mathbf{\\text{Detects large ascites (} > 2{,}000\\text{ mL)}} \\\\
& \\text{feel impulse on opposite flank} & \\text{fluid (assistant hand blocks skin artifact)} & (\\text{highly specific}) \\\\
\\textbf{Asterixis} & \\mathbf{\\text{Patient extends arms with wrists dorsiflexed}} & \\mathbf{\\text{Sudden, brief, non-rhythmic lapses of postural}} & \\mathbf{\\text{Hepatic Encephalopathy, Uremia,}} \\\\
(\\textbf{\"Flapping Tremor\"}) & \\text{and fingers spread for 30 seconds} & \\mathbf{\\text{motor tone due to diencephalic metabolic failure}} & \\mathbf{\\text{Hypercapnic } CO_2\\text{ Retention}} \\\\
\\textbf{Sustained Clonus} & \\text{Rapid, forceful dorsiflexion of ankle with knee flexed} & \\text{Rhythmic, oscillating muscle contractions (} \\ge 5\\text{ beats)} & \\text{Upper Motor Neuron lesion, Serotonin Syndrome} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old male with decompensated alcoholic cirrhosis presents with altered mental status and abdominal distension. On examination, he is somnolent but arousable. When asked to hold his arms extended in front of him with wrists maximally dorsiflexed and fingers spread, his hands exhibit intermittent, sudden, rapid downward flapping movements followed by quick recovery. Abdominal examination reveals tympany around the umbilicus with dullness in both flanks that shifts toward the bed when he rolls onto his lateral decubitus position.",
      question: "What physical exam signs are present, and what is the underlying pathophysiology of the hand movement abnormality?",
      options: [
        "Asterixis (flapping tremor) reflecting metabolic failure of postural motor tone regulation (hepatic encephalopathy due to hyperammonemia) and positive Shifting Dullness indicating >1,500 mL of peritoneal ascites",
        "Intention tremor due to cerebellar hemispheric stroke and negative fluid wave",
        "Cogwheel rigidity due to Parkinson's disease and abdominal wall lipoma",
        "Chorea due to Huntington's disease and paralytic ileus"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic physical signs of decompensated liver cirrhosis: (1) Asterixis: Brief, involuntary, non-rhythmic interruptions of postural tone in outstretched dorsiflexed hands ('negative myoclonus'), pathognomonic for toxic-metabolic encephalopathies (most commonly Hepatic Encephalopathy due to hyperammonemia, but also Uremia and severe CO2 retention); (2) Shifting Dullness: Percussion dullness shifting to dependent flanks when the patient changes position, confirming significant free peritoneal ascites (>1,500 mL)."
    }
  ]
};
