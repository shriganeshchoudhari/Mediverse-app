/**
 * Spinal Cord Injury (SCI), ASIA Impairment Scale & Autonomic Dysreflexia
 * Authoritative medical content derived from ASIA / ISNCSCI Standards, Braddom's PM&R, DeLisa, and USMLE Step 2/3 PMR.
 * Mapped to NMC CBME Competencies: PM3.1, PM3.2, PM4.1, PM4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPINAL_CORD_INJURY_ASIA_AUTONOMIC_MODULE: PhysiologyLessonModule = {
  id: "pmr-spinal-cord-injury-asia-autonomic",
  unitCode: "PM3.1",
  title: "PMR: Spinal Cord Injury (SCI), ASIA Impairment Scale (A–E) & Autonomic Dysreflexia Protocol",
  competencies: ["PM3.1", "PM3.2", "PM4.1", "PM4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# PMR: Spinal Cord Injury (SCI), ASIA Impairment Scale (A–E) & Autonomic Dysreflexia Protocol

Accurate classification of spinal cord injuries using the international ASIA/ISNCSCI examination dictates functional prognosis, wheelchair prescription, and acute autonomic management.

---

## 1. The ASIA / ISNCSCI Impairment Scale (AIS Grades A–E)

$$\\text{Neurological Level of Injury (NLI)} = \\text{Most caudal spinal segment with intact motor (}\\ge 3/5\\text{ with } 5/5 \\text{ above) and intact sensation (2/2)}$$

| AIS Grade | Clinical Classification | Sacral Sparing ($S_4 - S_5$) Status | Motor / Sensory Preservation Below Neurological Level | Functional Prognosis & Ambulation |
| :--- | :--- | :--- | :--- | :--- |
| **Grade A** | **COMPLETE** | **NO Sacral Sparing** (No Voluntary Anal Contraction [VAC] and No Deep Anal Pressure [DAP]). | No sensory or motor function is preserved in sacral segments $S_4 - S_5$. | Minimal recovery below NLI ($<3\\%$ ambulation rate); wheelchair dependent. |
| **Grade B** | **SENSORY INCOMPLETE** | **Sensory Sacral Sparing Present** (DAP present or light touch/pinprick at $S_4-S_5$). | Sensory but **NO MOTOR function** is preserved below the neurological level and includes $S_4 - S_5$. | Sensory preservation predicts $30-40\\%$ chance of recovering some motor function. |
| **Grade C** | **MOTOR INCOMPLETE** | **Motor Sacral Sparing Present** (VAC present) OR Sensory Sparing $+$ motor preservation $>3$ levels below NLI. | Motor function is preserved below NLI, and **MORE THAN HALF of key muscle functions below NLI have a muscle grade $< 3/5$**. | Non-functional ambulation early; $\\sim 50\\%$ achieve community or household ambulation. |
| **Grade D** | **MOTOR INCOMPLETE** | **Motor Sacral Sparing Present** with strong motor preservation. | Motor function is preserved below NLI, and **AT LEAST HALF ($\\ge 50\\%$) of key muscle functions below NLI have a muscle grade $\\ge 3/5$**. | **Excellent functional prognosis**: $>90\\%$ achieve functional community ambulation with/without braces. |
| **Grade E** | **NORMAL** | Fully intact. | Sensory and motor functions are completely normal in all segments. | Full functional recovery. |

---

## 2. Autonomic Dysreflexia (AD): Emergency Resuscitation Protocol

- **Target Population**: Occurs exclusively in patients with spinal cord injury at or above the **$T_6$ spinal level** (above the major splanchnic sympathetic outflow).
- **Pathophysiology**:
  - Noxious visceral or somatic stimulus below injury level $\\rightarrow$ triggers massive uninhibited sympathetic reflex discharge via the splanchnic vascular bed $\\rightarrow$ severe arteriolar vasoconstriction $\\rightarrow$ **Severe Paroxysmal Hypertension**.
  - Baroreceptors in carotid sinus and aortic arch detect hypertension $\\rightarrow$ activate cranial parasympathetic output via Vagus nerve (CN X) $\\rightarrow$ **Compensatory Reflex Bradycardia**.
  - Sympathetic inhibitory signals descending from the medulla are blocked at the cord lesion level $\\implies$ skin **ABOVE $T_6$ is flushed, diaphoretic, and warm**, while skin **BELOW $T_6$ is pale, cold, and goosebumped (piloerection)**.
- **Common Noxious Triggers**:
  - **Distended / Obstructed Urinary Bladder** ($>85\\%$ of cases; kinked catheter, clogged lumen, urinary tract infection, calculi).
  - Fecal impaction / bowel distension ($10-15\\%$).
  - Pressure ulcers, ingrown toenails, tight restrictive clothing, acute surgical abdomen.

---

## 3. Step-by-Step Emergency Management of Autonomic Dysreflexia

$$\\begin{array}{rcl}
\\text{Step 1} & \\longrightarrow & \\mathbf{SIT\\text{ }THE\\text{ }PATIENT\\text{ }UPRIGHT\\text{ }(90^\\circ)\\text{ and loosen all clothing}} \\\\
\\text{Step 2} & \\longrightarrow & \\mathbf{CHECK\\text{ }THE\\text{ }BLADDER\\text{ }FIRST\\text{ (Catheterize or irrigate blocked Foley)}} \\\\
\\text{Step 3} & \\longrightarrow & \\mathbf{CHECK\\text{ }FOR\\text{ }FECAL\\text{ }IMPACTION\\text{ (Digital rectal exam with 2\\% lidocaine jelly)}} \\\\
\\text{Step 4} & \\longrightarrow & \\mathbf{IF\\text{ }SBP > 150\\text{ mmHg: Apply Topical Nitroglycerin 2\\% Paste or oral Nifedipine}}
\\end{array}$$

1. **Immediate Upright Posture**: Immediately elevate the head of the bed to $90^\\circ$ and dangle patient\'s legs over the bed side; inducing orthostatic venous pooling in the lower extremities rapidly reduces systemic blood pressure.
2. **Eliminate the Noxious Trigger**:
   - Inspect urinary catheter tubing for kinks or blockage; if no catheter is present, perform immediate in-and-out catheterization using lidocaine lubricating jelly.
   - If bladder is empty, perform a gentle digital rectal examination using topical $2\\%$ lidocaine jelly to check for and disimpact hard stool.
3. **Pharmacotherapy for Persistent Hypertension**:
   - If SBP remains $> 150\\text{ mmHg}$ despite non-pharmacological maneuvers:
     - Apply **$1\\text{ inch}$ of Topical Nitroglycerin $2\\%\\text{ Paste}$ (Nitropaste)** above the lesion level (can be rapidly wiped off if hypotension ensues).
     - Or administer **oral Nifedipine $10\\text{ mg}$ capsule (bite and swallow)**; *avoid sublingual nifedipine due to risk of unpredictable profound hypotension*.

---

## 4. Neurogenic Bladder: UMN (Spastic) vs LMN (Flaccid)

- **Upper Motor Neuron (UMN / Spastic / Reflex) Bladder** (Lesions above $S_2$):
  - Involuntary detrusor contractions with detrusor-sphincter dyssynergia (DSD); high intravesical pressures risk upper tract renal damage (hydronephrosis).
  - **Management**: **Clean Intermittent Catheterization (CIC) every 4–6 hours** $+$ **Anticholinergics (Oxybutynin / Solifenacin)** or $\\beta_3$ agonists (Mirabegron) to suppress detrusor overactivity.
- **Lower Motor Neuron (LMN / Flaccid / Atonic) Bladder** (Lesions at conus medullaris / cauda equina $S_2 - S_4$):
  - Atonic, large-capacity bladder with overflow incontinence.
  - **Management**: **Clean Intermittent Catheterization (CIC)**. Avoid manual compression (Credé maneuver) due to high risk of vesicoureteral reflux!
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male with a complete T4 spinal cord injury (ASIA Grade A) resulting from a motorcycle crash 8 months ago is resting in his rehabilitation room when he suddenly develops an excruciating, pounding occipital headache, profuse sweating over his face and neck, and blurred vision. On examination, his forehead is flushed and dripping with sweat, while his lower extremities are cool and pale. Blood pressure is 196/112 mmHg (baseline 95/60 mmHg), and heart rate is 46 bpm (sinus bradycardia).",
      question: "What is the diagnosis, and what is the immediate first step in the resuscitation protocol?",
      options: [
        "Autonomic Dysreflexia; Immediately sit the patient fully upright (90 degrees), loosen tight clothing, and check the urinary catheter for obstruction",
        "Acute Hypertensive Encephalopathy; Administer high-dose intravenous Nitroprusside in supine position",
        "Acute Myocardial Infarction; Administer chewable Aspirin and sublingual Nitroglycerin lying flat",
        "Spinal Shock; Infuse 2000 mL of normal saline bolus"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient with a spinal cord injury at or above T6 who presents with paroxysmal severe hypertension, pounding headache, facial diaphoresis/flushing above the lesion, cool/pale skin below, and reflex bradycardia is suffering from Autonomic Dysreflexia (AD). The immediate first-line action is to sit the patient upright (90 degrees) with legs dependent to induce orthostatic blood pressure lowering, loosen any restrictive clothing, and immediately check for the most common cause (distended bladder or blocked urinary catheter)."
    }
  ]
};
