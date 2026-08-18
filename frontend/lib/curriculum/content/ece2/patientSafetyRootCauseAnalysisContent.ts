/**
 * Early Clinical Exposure II: Patient Safety, Error Analysis & Root Cause Analysis
 * Authoritative patient safety & healthcare quality content derived from IHI, Reason's Human Error.
 * Mapped to NMC CBME Competencies: ECE2.1, FC2.1, AETCOM2.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PATIENT_SAFETY_ROOT_CAUSE_ANALYSIS_MODULE: PhysiologyLessonModule = {
  id: "ece2-patient-safety-root-cause-analysis",
  unitCode: "ECE2.1",
  title: "Patient Safety & Incident Analysis: James Reason Swiss Cheese Model, Root Cause Analysis (RCA) & FMEA",
  competencies: ["ECE2.1", "FC2.1", "AETCOM2.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Patient Safety Culture, Error Analysis & Root Cause Investigation

Modern healthcare safety shifts the focus from individual culpability to systems-level resilience, hazard mitigation, and structured root cause analysis.

---

## 1. James Reason\'s Swiss Cheese Model \u0026 Error Taxonomy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Safety Barrier Layer} & \\textbf{Type of Vulnerability} & \\textbf{Organizational Domain} & \\textbf{Clinical Exemplar} \\\\
\\hline
\\textbf{1. Organizational Policies} & \\mathbf{\\text{Latent Condition (Blunt End)}} & \\text{Hospital administration \u0026 staffing} & \\text{Severe understaffing, 24-hour shift fatigue} \\\\
\\textbf{2. Equipment \u0026 Technology} & \\mathbf{\\text{Latent Condition (Blunt End)}} & \\text{Biomedical engineering \u0026 EHR} & \\text{Look-alike / sound-alike drug packaging, poor UI} \\\\
\\textbf{3. Supervision \u0026 Protocols} & \\mathbf{\\text{Latent Condition (Blunt End)}} & \\text{Departmental clinical oversight} & \\text{Lack of standardized double-check protocols} \\\\
\\textbf{4. Frontline Execution} & \\mathbf{\\text{Active Failure (Sharp End)}} & \\text{Physicians, nurses, pharmacists} & \\mathbf{\\text{Slip / Lapse: Administering wrong syringe}} \\\\
\\hline
\\end{array}$$

- **Error Taxonomy**:
  - **Active Failures (Sharp End)**: Direct actions of frontline operators (e.g., inadvertently pressing the wrong infusion rate button).
  - **Latent Conditions (Blunt End)**: Hidden systemic flaws in organizational design, culture, or technology that lay dormant until aligned with active failures to create an accident trajectory.
  - **Slip / Lapse (Execution Failure)**: Correct plan, but incorrect execution (e.g., picking up Heparin 10,000 U instead of Heparin 10 U flush).
  - **Mistake (Planning Failure)**: Incorrect plan chosen due to rule-based or knowledge-based misinterpretation.

---

## 2. Root Cause Analysis (RCA) \u0026 Hierarchy of Safety Controls

$$\\begin{array}{lcccc}
\\hline
\\textbf{Level of Control} & \\textbf{Intervention Strength} & \\textbf{Intervention Mechanism} & \\textbf{Sustainability \u0026 Efficacy} \\\\
\\hline
\\textbf{Strongest (Forcing Functions)} & \\mathbf{\\text{Engineered / Physical Constraints}} & \\mathbf{\\text{Design makes wrong action impossible}} & \\mathbf{\\text{HIGHEST (Cannot be bypassed)}} \\\\
& & (\\text{e.g., Non-Luer epidural connectors}) & \\\\
\\textbf{Intermediate (Automation)} & \\text{Software constraints \u0026 read-backs} & \\text{Barcode medication scanning, smart pumps} & \\text{MODERATE-HIGH (Overcomes cognitive slips)} \\\\
\\textbf{Weakest (Policy / Education)} & \\mathbf{\\text{Administrative rules \u0026 warnings}} & \\mathbf{\\text{Memos, educational lectures, checklists}} & \\mathbf{\\text{LOWEST (Relies entirely on human memory)}} \\\\
\\hline
\\end{array}$$

- **Ishikawa (Fishbone) Diagram Dimensions**:
  - Investigates 6 core causative domains: **People** (training, fatigue), **Methods** (protocols, policies), **Machines/Equipment** (malfunctions, design), **Materials** (supplies, drug packaging), **Environment** (lighting, noise, distractions), and **Measurement** (laboratory calibration).
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old postoperative patient in the ICU is prescribed 10 units of regular insulin subcutaneous for hyperglycemia (blood glucose 280 mg/dL). Due to a busy night shift with nurse-to-patient ratio of 1:3, an exhausted ICU nurse accidentally draws up 100 units of regular insulin using a standard 1-mL tuberculin syringe instead of a dedicated U-100 orange-capped insulin syringe. No independent double-check is performed because the second nurse was assisting with an emergent cardiac arrest. Two hours later, the patient is found unarousable with profound diaphoresis, severe hypoglycemia (blood glucose 18 mg/dL), and generalized tonic-clonic seizures requiring emergent IV 50% dextrose resuscitation.",
      question: "Following this sentinel event, a multidisciplinary hospital committee convenes a Root Cause Analysis (RCA). According to the hierarchy of safety controls, what represents the strongest and most effective systemic intervention to permanently prevent future recurrence of this error?",
      options: [
        "Implementing an engineered forcing function and automation: removing all multi-dose regular insulin vials from patient units, stocking only pre-filled unit-dose insulin safety pens, and mandating automated barcode medication scanning (BCMA) paired with independent smart-pump double-checks",
        "Disciplining and suspending the involved ICU nurse to deter carelessness",
        "Issuing a hospital-wide memorandum reminding staff to be careful when drawing insulin",
        "Holding a mandatory 1-hour educational lecture on insulin syringe types"
      ],
      correctAnswerIndex: 0,
      explanation: "This sentinel adverse event illustrates the application of Root Cause Analysis (RCA) and the Hierarchy of Safety Controls: (1) Systemic Failure Analysis: The event resulted from the alignment of latent conditions (high workload, fatigue, look-alike multi-dose vials, absence of automated forcing functions) and an active slip/lapse (using a non-insulin syringe); (2) Strength of Controls: Punitive action, memos, and educational lectures represent the weakest, least sustainable interventions because they rely entirely on fallible human vigilance; (3) Strongest Controls: High-leverage architectural forcing functions (removing bulk vials, stocking single-dose safety pens, and automated barcode scanning) make it physically or computationally impossible to administer the wrong dose, permanently mitigating the latent hazard."
    }
  ]
};
