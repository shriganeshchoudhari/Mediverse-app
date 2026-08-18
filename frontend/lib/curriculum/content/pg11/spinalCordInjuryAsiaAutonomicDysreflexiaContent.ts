/**
 * Postgraduate Advanced Physical Medicine & Rehabilitation: Spinal Cord Injury & Autonomic Dysreflexia
 * Authoritative physiatric content derived from ASIA/ISNCSCI Standards, PVA Autonomic Dysreflexia Consortium Guidelines.
 * Mapped to NMC PG CBME Competencies: PG11.1, PMR1.1, PMR1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPINAL_CORD_INJURY_ASIA_AUTONOMIC_DYSREFLEXIA_MODULE: PhysiologyLessonModule = {
  id: "pg11-spinal-cord-injury-asia-autonomic-dysreflexia",
  unitCode: "PG11.1",
  title: "Spinal Cord Injury (SCI): ISNCSCI/ASIA Impairment Scale (AIS A-E) & Autonomic Dysreflexia Resuscitation",
  competencies: ["PG11.1", "PMR1.1", "PMR1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Spinal Cord Injury & Autonomic Dysreflexia Protocols

Spinal Cord Injury (SCI) management requires precise neurological classification using the International Standards for Neurological Classification of SCI (ISNCSCI/ASIA) and immediate emergency stabilization for life-threatening Autonomic Dysreflexia.

---

## 1. ASIA Impairment Scale (AIS) Diagnostic Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{AIS Grade} & \\textbf{Classification} & \\textbf{Sacral S4-S5 Sparing (DAP / VAC)} & \\textbf{Motor / Sensory Function Below Level} \\\\
\\hline
\\textbf{AIS A} & \\mathbf{\\text{Complete}} & \\mathbf{\\text{NO (No DAP or VAC; no S4-S5 sensation)}} & \\text{No motor or sensory preservation in S4-S5} \\\\
\\textbf{AIS B} & \\mathbf{\\text{Sensory Incomplete}} & \\mathbf{\\text{YES (S4-S5 sensation or DAP preserved)}} & \\text{Sensory preserved; NO motor function} > 3\\text{ levels below} \\\\
\\textbf{AIS C} & \\mathbf{\\text{Motor Incomplete}} & \\text{YES (VAC or sensory sparing + motor)} & \\mathbf{> 50\\%\\text{ of key muscles below level have grade } < 3} \\\\
\\textbf{AIS D} & \\mathbf{\\text{Motor Incomplete}} & \\text{YES (VAC or sensory sparing + motor)} & \\mathbf{\\ge 50\\%\\text{ of key muscles below level have grade } \\ge 3} \\\\
\\textbf{AIS E} & \\text{Normal} & \\text{YES} & \\text{Normal motor and sensory function throughout} \\\\
\\hline
\\end{array}$$

---

## 2. Autonomic Dysreflexia (AD): Pathophysiology & Emergency Sequence

- **Pathophysiology of Lesions $\\ge T6$**:
  - Uninhibited sympathetic storming below $T6$ induced by noxious visceral triggers (distended bladder in $85\\%$, fecal impaction in $10\\%$).
  - Massive splanchnic vasoconstriction causes acute paroxysmal hypertension ($SBP > 20-40\\text{ mmHg}$ above baseline).
  - Baroreceptor-mediated vagal response produces **compensatory bradycardia, pounding headache, facial flushing, and profuse sweating above the lesion level**.

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step} & \\textbf{Emergency Intervention} & \\textbf{Clinical Rationale \\& Mechanism} \\\\
\\hline
\\mathbf{1} & \\mathbf{\\text{Sit Patient Upright } (90^{\\circ})\\text{ with Legs Dangling}} & \\mathbf{\\text{Induces orthostatic venous pooling to rapidly drop central BP}} \\\\
\\mathbf{2} & \\mathbf{\\text{Loosen All Constrictive Garments}} & \\text{Eliminates cutaneous pressure triggers, abdominal binders, stockings} \\\\
\\mathbf{3} & \\mathbf{\\text{Assess and Empty Urinary Bladder}} & \\mathbf{\\text{Catheterize with lidocaine jelly / flush clogged Foley catheter (85\\% cause)}} \\\\
\\mathbf{4} & \\mathbf{\\text{Digital Rectal Exam for Fecal Impaction}} & \\text{Check rectum with topical lidocaine after blood pressure stabilizes} \\\\
\\mathbf{5} & \\mathbf{\\text{Topical Nitropaste } (1-2\\text{ inches})\\text{ Above Lesion}} & \\mathbf{\\text{Immediate vasodilator; easily wiped off if hypotension develops}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male with chronic traumatic T4 AIS A complete spinal cord injury (baseline blood pressure 95/60 mmHg, resting heart rate 68 bpm) is brought to the clinic with an acute onset of severe, throbbing headache, blurred vision, profuse facial sweating, and nasal congestion. On examination, he is acutely agitated and diaphoretic above the T4 level with pale, cool, piloerect skin below T4. Vital signs: BP 186/112 mmHg, HR 46 bpm, RR 18/min. A continuous indwelling Foley catheter is in place, but the drainage tubing is noted to be severely kinked with no urine in the collection bag.",
      question: "What is the diagnosis, what is the immediate first step in medical stabilization, and what is the definitive emergency resuscitation sequence?",
      options: [
        "Autonomic Dysreflexia (AD) triggered by acute bladder distension due to an obstructed Foley catheter in a T4 spinal cord injury; immediately sit the patient upright at 90 degrees with legs dangling over the edge of the bed to promote orthostatic venous pooling, loosen all constrictive clothing, unkink and irrigate the catheter (or replace with lidocaine lubrication); if SBP remains >150 mmHg, apply 1-2 inches of 2% Nitroglycerin ointment (Nitropaste) above the level of the lesion",
        "Place the patient in the Trendelenburg position and administer IV normal saline boluses",
        "Diagnose intracranial hemorrhage and administer IV Mannitol without examining the Foley catheter",
        "Administer IV Labetalol while keeping the patient lying flat in bed"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Autonomic Dysreflexia (AD): (1) Pathognomonic Presentation: Paroxysmal severe hypertension (186/112 mmHg) and compensatory bradycardia (46 bpm) with diaphoresis above T4 and piloerection below T4; (2) Step 1: Immediately SIT THE PATIENT UPRIGHT (90 degrees) to exploit orthostatic pooling and rapidly reduce cerebral perfusion pressure; (3) Relieve Trigger: Bladder distension is the trigger in 85% of cases; unkink/empty the catheter immediately; (4) Antihypertensive: Topical Nitropaste is preferred because it can be immediately wiped off if sudden hypotension occurs once the noxious trigger is resolved."
    }
  ]
};
