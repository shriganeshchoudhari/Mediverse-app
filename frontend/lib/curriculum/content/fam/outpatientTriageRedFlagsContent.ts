/**
 * Family Medicine & Primary Care Postings: Outpatient Triage, Red Flags & Referral Workflows
 * Authoritative outpatient triage content derived from Rakel, Stern's Symptom to Diagnosis, NICE.
 * Mapped to NMC CBME Competencies: FM1.4, CM1.4, IM1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OUTPATIENT_TRIAGE_RED_FLAGS_MODULE: PhysiologyLessonModule = {
  id: "fam-outpatient-triage-red-flags",
  unitCode: "FM1.4",
  title: "Outpatient Triage & Red Flags: Cauda Equina, Thunderclap Headache, ALARMS Dyspepsia & Specialty Referrals",
  competencies: ["FM1.4", "CM1.4", "IM1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Outpatient Clinical Triage, Emergency Red Flags & Referral Workflows

Recognizing critical red flags in primary care prevents diagnostic delays and ensures rapid escalation for surgical and vascular emergencies.

---

## 1. Outpatient Clinical Red Flags Demanding Immediate Emergency Escalation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Presenting Symptom} & \\textbf{Critical Red Flag Features} & \\textbf{Suspected Life Threat} & \\textbf{Immediate Action Protocol} \\\\
\\hline
\\textbf{Low Back Pain} & \\mathbf{\\text{Saddle anesthesia, bowel/bladder incontinence,}} & \\mathbf{\\text{Cauda Equina Syndrome}} & \\mathbf{\\text{Stat emergent MRI lumbar spine;}} \\\\
& \\mathbf{\\text{progressive bilateral lower extremity motor weakness}} & (\\text{massive disc herniation / tumor}) & \\mathbf{\\text{immediate neurosurgical decompression}} \\\\
\\textbf{Acute Headache} & \\mathbf{\\text{\"Thunderclap\" onset (peaks within 1 minute),}} & \\mathbf{\\text{Subarachnoid Hemorrhage (SAH)}} & \\mathbf{\\text{Emergent transfer for non-contrast Head CT;}} \\\\
& \\text{neck stiffness, \"worst headache of life\"} & (\\text{ruptured saccular aneurysm}) & \\mathbf{\\text{if CT negative, perform lumbar puncture (LP)}} \\\\
\\textbf{Subacute Headache} & \\text{Unilateral temple headache, jaw claudication,} & \\mathbf{\\text{Giant Cell (Temporal) Arteritis}} & \\mathbf{\\text{High-dose systemic steroids immediately}} \\\\
& \\text{scalp tenderness, amaurosis fugax in age } \\ge 50 & (\\text{risk of permanent blindness}) & \\text{to save vision; temporal artery biopsy} \\\\
\\textbf{Dyspepsia / GERD} & \\mathbf{\\text{ALARMS criteria: Anemia, Loss of weight, Anorexia,}} & \\mathbf{\\text{Gastric / Esophageal Malignancy}} & \\mathbf{\\text{Urgent referral for upper endoscopy (EGD)}} \\\\
& \\mathbf{\\text{Recent onset in age } > 55\\text{, Melena, Swallowing dysphagia}} & & \\\\
\\hline
\\end{array}$$

---

## 2. Primary Care to Specialty Referral Architecture

$$\\begin{array}{lcccc}
\\hline
\\textbf{Referral Dimension} & \\textbf{Key Operational Objective} & \\textbf{Core Informational Elements Transferred} \\\\
\\hline
\\textbf{1. Clinical Question} & \\text{Explicit purpose of consultation} & \\text{Specific diagnostic or therapeutic question (e.g. \"Evaluate for surgical valve repair\")} \\\\
\\textbf{2. Pre-Consult Workup} & \\text{Prevent duplicative testing} & \\text{Recent relevant lab results (BMP, CBC), imaging discs/reports, biopsy pathology} \\\\
\\textbf{3. Triage Urgency} & \\text{Appropriate scheduling timeframe} & \\textbf{Emergent (immediate ED transfer) vs Urgent (<2 weeks) vs Routine (4-6 weeks)} \\\\
\\textbf{4. Closed-Loop Tracking} & \\text{Ensure transition completion} & \\text{Confirm specialist note received, patient attended visit, and recommendations reconciled} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 44-year-old male presents to his family physician with severe lower back pain radiating down both legs that began 2 days ago after lifting heavy furniture. Over the past 6 hours, he has experienced numbness in his groin and buttocks (perineum) and noticed that his underwear was soaked with urine without him feeling the urge to void. Physical examination reveals loss of pinprick sensation in the S2-S4 dermatomes (saddle distribution), bilateral foot drop (weakness in ankle dorsiflexion, 2/5 strength), and absent anal sphincter tone on digital rectal examination.",
      question: "What is the diagnosis, and what is the immediate management protocol?",
      options: [
        "Cauda Equina Syndrome; transfer immediately to the emergency department for an emergent stat MRI of the lumbar spine and urgent neurosurgical decompression within 24-48 hours to prevent permanent paraplegia and irreversible sphincter dysfunction",
        "Mild sciatica; prescribe oral NSAIDs and schedule physical therapy in 4 weeks",
        "Diabetic polyneuropathy; increase daily Metformin dose",
        "Acute prostatitis; start oral ciprofloxacin for 14 days"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic presentation of Cauda Equina Syndrome, a surgical emergency: (1) Pathognomonic Red Flags: Compression of the cauda equina nerve roots (L4-S5) causes saddle anesthesia (loss of sensation in S2-S4 perianal/perineal dermatomes), acute bladder/bowel dysfunction (urinary overflow incontinence, loss of rectal tone), and bilateral progressive lower motor neuron weakness (bilateral foot drop); (2) Emergency Protocol: Immediate stat transfer for urgent lumbar spine MRI and emergency surgical laminectomy/decompression (ideally within 24-48 hours of onset) is mandatory to prevent permanent lower extremity paralysis and lifelong urinary/fecal incontinence."
    }
  ]
};
