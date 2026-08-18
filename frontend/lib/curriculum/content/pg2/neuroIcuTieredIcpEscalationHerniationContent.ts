/**
 * Postgraduate Advanced Internal Medicine: Neuro-ICU Tiered ICP Escalation & Brain Herniation
 * Authoritative neurocritical care content derived from Neurocritical Care Society Guidelines, Greenberg's Neurosurgery.
 * Mapped to NMC PG CBME Competencies: PG2.3, NC1.1, NC1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEURO_ICU_TIERED_ICP_ESCALATION_HERNIATION_MODULE: PhysiologyLessonModule = {
  id: "pg2-neuro-icu-tiered-icp-escalation-herniation",
  unitCode: "PG2.3",
  title: "Neuro-ICU Intracranial Hypertension: Tiered ICP Protocols, Monro-Kellie Physics & Herniation Syndromes",
  competencies: ["PG2.3", "NC1.1", "NC1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Neuro-ICU Tiered ICP Escalation & Herniation Syndromes

Managing elevated intracranial pressure prevents secondary ischemic brain injury and fatal brainstem herniation.

---

## 1. Monro-Kellie Doctrine & Cerebral Perfusion Pressure (CPP)

$$V_{\\text{intracranial}} = V_{\\text{brain}} (80\\%) + V_{\\text{blood}} (10\\%) + V_{\\text{CSF}} (10\\%) = \\text{Constant}$$

$$\\begin{array}{lcccc}
\\hline
\\textbf{Hemodynamic Parameter} & \\textbf{Mathematical Formula} & \\textbf{Target Clinical Goal} \\\\
\\hline
\\textbf{Intracranial Pressure (ICP)} & \\text{Measured via External Ventricular Drain (EVD)} & \\mathbf{< 20-22\\text{ mmHg}} \\\\
\\textbf{Cerebral Perfusion Pressure (CPP)} & \\mathbf{\\text{CPP} = \\text{MAP} - \\text{ICP}} & \\mathbf{60 - 70\\text{ mmHg}} \\\\
\\textbf{Cerebral Autoregulation Curve} & \\text{Maintains constant CBF between MAP } 60-160\\text{ mmHg} & \\text{Impairs if CPP } < 50\\text{ or } > 80\\text{ mmHg} \\\\
\\hline
\\end{array}$$

---

## 2. Brain Herniation Syndromes & Localizing Signs

$$\\begin{array}{lcccc}
\\hline
\\textbf{Herniation Syndrome} & \\textbf{Anatomical Displacement} & \\textbf{Pathognomonic Clinical Triad} \\\\
\\hline
\\textbf{Uncal (Transtentorial)} & \\text{Medial temporal uncus over tentorium} & \\mathbf{\\text{Ipsilateral dilated \"blown\" pupil (CN III)} +} \\\\
& & \\mathbf{\\text{Contralateral hemiparesis (or Kernohan notch ipsilateral)}} \\\\
\\textbf{Subfalcine (Cingulate)} & \\text{Cingulate gyrus beneath falx cerebri} & \\text{ACA compression } \\rightarrow \\text{ contralateral leg weakness} \\\\
\\textbf{Tonsillar Herniation} & \\text{Cerebellar tonsils through foramen magnum} & \\mathbf{\\text{Medullary compression } \\rightarrow \\text{ Cushing's Triad}} \\\\
& & (\\mathbf{\\text{Severe HTN, Bradycardia, Irregular Respirations}}) \\\\
\\hline
\\end{array}$$

---

## 3. Tiered ICP Management Protocol (Neurocritical Care Society)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Protocol Tier} & \\textbf{Therapeutic Interventions} & \\textbf{Physiological Mechanism} \\\\
\\hline
\\textbf{Tier 0 (Basics)} & \\text{Head of bed } 30^{\\circ}\\text{, midline neck, normothermia, analgesia} & \\text{Optimizes jugular venous outflow, limits metabolism} \\\\
\\textbf{Tier 1} & \\mathbf{\\text{External Ventricular Drain (EVD) CSF drainage;}} & \\text{Volume reduction; creates osmotic gradient pulling} \\\\
& \\mathbf{\\text{Hypertonic Saline 3\\% (250 mL bolus) or Mannitol 20\\%}} & \\text{interstitial water into intravascular space} \\\\
\\textbf{Tier 2} & \\mathbf{\\text{Neuromuscular blockade; Mild hyperventilation (} PaCO_2\\ 30-35\\text{)}} & \\text{Cerebral vasoconstriction (bridge ONLY)} \\\\
\\textbf{Tier 3} & \\mathbf{\\text{High-dose Barbiturate Coma (Pentobarbital burst suppression);}} & \\mathbf{\\text{Profound metabolic shutdown; surgical skull volume}} \\\\
(\\textbf{Refractory}) & \\mathbf{\\text{Decompressive Craniectomy; Moderate Hypothermia (32-34}^{\\circ}\\text{C)}} & \\mathbf{\\text{expansion converting closed vault into open space}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old male with severe traumatic brain injury (right acute epidural hematoma status-post craniotomy) is intubated in the Neuro-ICU with an External Ventricular Drain (EVD) in place. Over 15 minutes, his ICP spikes from 14 to 28 mmHg, and his MAP is 85 mmHg (calculated CPP = 57 mmHg). Examination shows an acute sluggish dilatation of the right pupil (5 mm) compared to the left (2 mm). Tier 0 basic measures (30-degree HOB elevation, midline neutral neck positioning, and deep fentanyl/propofol sedation) are optimized.",
      question: "What is the next immediate Tier 1 intervention to control intracranial hypertension, and what target parameters must be tracked?",
      options: [
        "Administer a rapid intravenous bolus of Hypertonic Saline 3% (250 mL over 15 minutes) or IV Mannitol 20% (0.5-1.0 g/kg) and open the EVD to drain 5-10 mL of CSF, while titrating vasopressors to maintain Cerebral Perfusion Pressure (CPP = MAP - ICP) between 60-70 mmHg, monitoring serum sodium (target 145-155 mEq/L) and serum osmolarity (<320 mOsm/kg)",
        "Immediately place patient in Trendelenburg position (head-down)",
        "Administer 2 liters of hypotonic 0.45% saline",
        "Perform aggressive hyperventilation to PaCO2 <20 mmHg for 24 hours"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates Tier 1 Neuro-ICU ICP escalation: (1) Osmotherapy: Hypertonic saline 3% draws interstitial fluid out of edematous brain parenchyma across an intact blood-brain barrier, reducing ICP within minutes; (2) CPP Target: Maintaining CPP between 60-70 mmHg prevents secondary ischemic neuronal death; (3) Hyperventilation Warning: Aggressive prolonged hyperventilation (PaCO2 <30) causes severe cerebral vasoconstriction and secondary cerebral ischemia, so it is reserved only as a temporary Tier 2 rescue bridge."
    }
  ]
};
