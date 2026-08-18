/**
 * Postgraduate Advanced Ophthalmology: Neuro-Ophthalmology (GCA, A-AION vs NAION, Optic Neuritis)
 * Authoritative neuro-ophthalmic content derived from ONTT Protocols, AAO Neuro-Ophthalmology PPP, BSR GCA Guidelines.
 * Mapped to NMC PG CBME Competencies: PG8.4, OP4.1, OP4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE: PhysiologyLessonModule = {
  id: "pg8-neuro-ophthalmology-gca-aion-optic-neuritis",
  unitCode: "PG8.4",
  title: "Neuro-Ophthalmology: Giant Cell Arteritis (A-AION), Non-Arteritic AION & Optic Neuritis (ONTT)",
  competencies: ["PG8.4", "OP4.1", "OP4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Neuro-Ophthalmology: Ischemic Optic Neuropathies & Demyelinating Optic Neuritis

Acute visual loss from optic neuropathies demands immediate distinction between vasculitic emergencies (Giant Cell Arteritis), microvascular occlusions (NAION), and inflammatory demyelinating syndromes (Optic Neuritis).

---

## 1. Arteritic A-AION vs Non-Arteritic NAION Comparison

$$\\begin{array}{lcccc}
\\hline
\\textbf{Feature / Parameter} & \\textbf{Arteritic A-AION (Giant Cell Arteritis)} & \\textbf{Non-Arteritic NAION} \\\\
\\hline
\\textbf{Patient Demographics} & \\text{Age } > 60-70\\text{ yrs; Female predominance} & \\text{Age } 50-70\\text{ yrs; Vasculopathic risk factors} \\\\
\\textbf{Systemic Symptoms} & \\mathbf{\\text{Jaw claudication, scalp tenderness, PMR, weight loss}} & \\text{None (no systemic vasculitis)} \\\\
\\textbf{Visual Loss Severity} & \\mathbf{\\text{Catastrophic, profound vision loss (CF / HM / LP)}} & \\text{Moderate vision loss (altitudinal field defect)} \\\\
\\textbf{Optic Disc Appearance} & \\mathbf{\\text{Chalky white, pallid edema; arterial attenuation}} & \\text{Hyperemic segmental disc edema + flame hemorrhages} \\\\
\\textbf{Anatomic Predisposition} & \\text{None} & \\mathbf{\\text{''Crowded disc'' / Cup-to-disc ratio } < 0.1} \\\\
\\textbf{Inflammatory Markers} & \\mathbf{\\text{ESR } > 50-100\\text{ mm/hr; CRP } > 2.5\\text{ mg/dL; Thrombocytosis}} & \\text{Normal ESR, CRP, and platelets} \\\\
\\textbf{Emergency Treatment} & \\mathbf{\\text{High-Dose IV Methylprednisolone (1 g/day } \\times 3\\text{d) + TAB } \\ge 2\\text{cm}} & \\text{Cardiovascular risk modification; no acute steroid role} \\\\
\\hline
\\end{array}$$

---

## 2. Demyelinating Optic Neuritis & The Optic Neuritis Treatment Trial (ONTT)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{ONTT Finding / Protocol} & \\textbf{Pathophysiological Significance} \\\\
\\hline
\\textbf{Age \\& Presentation} & \\text{Young adults (20-40 yrs, Female 3:1); Subacute vision loss} & \\text{Strong association with Multiple Sclerosis} \\\\
\\textbf{Classic Symptom} & \\mathbf{\\text{Pain with eye movement in } 90\\% \\text{ of cases}} & \\text{Traction on inflamed optic nerve sheath at muscle cone} \\\\
\\textbf{Pupillary Exam} & \\mathbf{\\text{Relative Afferent Pupillary Defect (Marcus Gunn RAPD)}} & \\text{Hallmark of unilateral optic nerve conduction delay} \\\\
\\textbf{Standard Regimen} & \\mathbf{\\text{IV Methylprednisolone (1 g/day } \\times 3\\text{d) } \\rightarrow \\text{ Oral taper}} & \\text{Accelerates visual recovery; delays MS onset} \\\\
\\textbf{CONTRAINDICATION} & \\mathbf{\\text{ORAL PREDNISONE MONOTHERAPY IS STRICTLY CONTRAINDICATED}} & \\mathbf{\\text{Proved to DOUBLE the rate of optic neuritis recurrence!}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 74-year-old male presents with sudden, painless, profound loss of vision in his right eye noted upon waking. Over the past 3 weeks, he has experienced severe pain when chewing solid food (jaw claudication), tenderness over his right temple when combing his hair, and morning stiffness in his hips and shoulders. Visual acuity is Light Perception OD and 20/25 OS. Fundus examination OD shows a chalky white, pallid swollen optic disc with narrow retinal arterioles and an afferent pupillary defect. Laboratory evaluation reveals ESR 98 mm/hr and CRP 4.8 mg/dL.",
      question: "What is the diagnosis, what is the immediate emergency pharmacological intervention, and what is the definitive diagnostic procedure?",
      options: [
        "Arteritic Anterior Ischemic Optic Neuropathy (A-AION) secondary to Giant Cell (Temporal) Arteritis; administer immediate High-Dose IV Methylprednisolone (1000 mg/day for 3 days) without waiting for biopsy results to protect the fellow eye from catastrophic bilateral blindness, followed by an urgent temporal artery biopsy (TAB) with a specimen length of >= 2 cm to avoid skip lesions",
        "Non-Arteritic AION; initiate oral Aspirin 325 mg daily without corticosteroids",
        "Central Retinal Artery Occlusion; perform immediate anterior chamber paracentesis only",
        "Optic Neuritis; administer oral Prednisone 60 mg daily monotherapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Arteritic AION from Giant Cell Arteritis: (1) Clinical Hallmarks: Age >70, jaw claudication (pathognomonic), scalp tenderness, PMR symptoms, chalky white disc, and elevated inflammatory markers (ESR 98, CRP 4.8); (2) Emergency Steroid Protocol: High-dose IV Methylprednisolone (1 g/day x 3 days) must be started immediately to prevent irreversible infarction of the contralateral eye (risk >50% within days); (3) Biopsy: A temporal artery biopsy >=2 cm is definitive and remains positive for weeks after starting steroids."
    }
  ]
};
