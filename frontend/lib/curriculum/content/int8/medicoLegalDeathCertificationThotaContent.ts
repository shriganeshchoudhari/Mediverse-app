/**
 * Internship Core Clinical Postings: Medico-Legal Jurisprudence, Death Certification & Organ Donation
 * Authoritative forensic jurisprudence content derived from WHO MCCD Guidelines, THOTA 2014 Rules, Reddy's Forensic Medicine.
 * Mapped to NMC CBME Competencies: IN8.1, FM3.1, FM4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MEDICO_LEGAL_DEATH_CERTIFICATION_THOTA_MODULE: PhysiologyLessonModule = {
  id: "int8-medico-legal-death-certification-thota",
  unitCode: "IN8.1",
  title: "Medico-Legal Jurisprudence: Medical Certification of Cause of Death (MCCD), MLC Protocols & THOTA Brainstem Death Rules",
  competencies: ["IN8.1", "FM3.1", "FM4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Medico-Legal Jurisprudence: MCCD, MLC & THOTA Brainstem Death

Accurate death certification, forensic chain of custody, and statutory brainstem death testing ensure legal compliance and ethical organ procurement.

---

## 1. Medical Certification of Cause of Death (MCCD - Form 4 / 4A)

$$\\begin{array}{lcccc}
\\hline
\\textbf{MCCD Section} & \\textbf{Line Designation} & \\textbf{Clinical Entry Rule} & \\textbf{Prototypical Clinical Example} \\\\
\\hline
\\textbf{Part I (Sequela)} & \\text{Line (a) Immediate Cause} & \\text{Direct condition leading to death} & \\mathbf{\\text{Acute Myocardial Infarction}} \\\\
& \\text{Line (b) Antecedent Cause} & \\text{Intervening morbid state} & \\mathbf{\\text{due to / as a consequence of: Coronary Thrombosis}} \\\\
& \\mathbf{\\text{Line (c) Underlying Cause (UCOD)}} & \\mathbf{\\text{Initiating disease that started sequence}} & \\mathbf{\\text{due to / as a consequence of: Coronary Atherosclerosis}} \\\\
\\hline
\\textbf{Part II (Contributory)} & \\text{Secondary Conditions} & \\text{Other significant contributing conditions} & \\mathbf{\\text{Type 2 Diabetes Mellitus, Essential Hypertension}} \\\\
\\hline
\\textbf{CRITICAL ERROR} & \\mathbf{\\text{Modes / Mechanisms of Death}} & \\mathbf{\\text{NEVER enter as Underlying Cause!}} & \\mathbf{\\text{\"Cardiorespiratory arrest\", \"Asphyxia\", \"Heart failure\"}} \\\\
\\hline
\\end{array}$$

---

## 2. Medico-Legal Case (MLC) & Chain of Custody Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Forensic Step} & \\textbf{Mandated Action} & \\textbf{Legal / Procedural Safeguard} \\\\
\\hline
\\textbf{1. Mandatory Registration} & \\text{Register all RTAs, burns, poisons, assaults, brought-dead} & \\text{Send immediate written intimation to local police station} \\\\
\\textbf{2. Viscera Preservation} & \\text{Preserve stomach contents, liver, kidney in saturated saline} & \\text{Use saturated NaCl for routine poisons; NaF for blood alcohol} \\\\
\\textbf{3. Chain of Custody} & \\text{Meticulous sealing with hospital stamp \u0026 specimen signature} & \\text{Every transfer logged with timestamp, badge number, and signature} \\\\
\\hline
\\end{array}$$

---

## 3. THOTA Brainstem Death Certification Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Requirement} & \\textbf{Statutory Criteria (THOTA Act)} & \\textbf{Apnea Test Diagnostic Criteria} \\\\
\\hline
\\textbf{Board Composition} & \\mathbf{\\text{Board of 4 Doctors: Medical Sup/RMO + Treating Physician}} & \\text{Pre-oxygenate with } 100\\% \\text{ } O_2 \\text{ for 10 minutes} \\\\
& \\mathbf{\\text{+ Independent Neurologist/Surgeon + Authorized Expert}} & \\text{Disconnect ventilator, supply } 100\\% \\text{ } O_2 \\text{ at } 6\\text{ L/min via catheter} \\\\
\\textbf{Testing Interval} & \\mathbf{\\text{Two examinations separated by at least 6 HOURS in adults}} & \\mathbf{\\text{Positive test: No respiratory effort with } PaCO_2 \\ge 60\\text{ mmHg}} \\\\
& (\\text{longer in infants/neonates}) & \\mathbf{\\text{or } \\Delta PaCO_2 \\ge 20\\text{ mmHg above baseline}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with a 15-year history of poorly controlled hypertension and heavy smoking suffers sudden retrosternal crushing chest pain, collapses, and is brought to the emergency department. Resuscitation fails, and coronary angiography confirms complete thrombotic occlusion of the proximal left anterior descending coronary artery superimposed on severe calcific atherosclerotic plaques. The resident doctor completes the MCCD death certificate by writing 'Cardiorespiratory Arrest' in Part I Line (a).",
      question: "Why is this certification incorrect, and what is the legally and epidemiologically accurate MCCD entry?",
      options: [
        "Writing 'Cardiorespiratory arrest' is an error because it represents a terminal mode/mechanism of death rather than an etiologic underlying cause; the correct MCCD entry is: Part I Line (a) Acute Myocardial Infarction, Line (b) Coronary Artery Thrombosis, Line (c) Coronary Atherosclerosis (the true Underlying Cause of Death); Part II: Essential Hypertension and Tobacco Use Disorder",
        "The certificate is correct because the patient's heart and breathing stopped",
        "Part I should list only 'Old age' as the cause of death",
        "Part I should list 'Essential Hypertension' on line (a) and nothing else"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights fundamental WHO MCCD rules: (1) Terminal Mechanisms: 'Cardiorespiratory arrest', 'brain death', and 'asphyxia' describe terminal pathophysiological events common to all deaths and must NEVER be entered as the Underlying Cause of Death (UCOD); (2) Logical Sequence: Part I documents the causal chain: Acute Myocardial Infarction (immediate) due to Coronary Thrombosis (antecedent) due to Coronary Atherosclerosis (underlying); (3) Part II: Documents co-morbid risk factors (Hypertension, Smoking) contributing to mortality."
    }
  ]
};
