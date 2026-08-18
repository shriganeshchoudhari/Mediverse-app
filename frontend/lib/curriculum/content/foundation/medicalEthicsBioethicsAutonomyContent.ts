/**
 * Foundation Course & Early Clinical Exposure: Medical Ethics, Bioethics Principles & Patient Autonomy
 * Authoritative bioethics content derived from Beauchamp & Childress (8th ed.), AETCOM modules.
 * Mapped to NMC CBME Competencies: FC3.1, FC3.2, ECE1.2, AETCOM1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MEDICAL_ETHICS_BIOETHICS_AUTONOMY_MODULE: PhysiologyLessonModule = {
  id: "foundation-medical-ethics-bioethics-autonomy",
  unitCode: "FC3.1",
  title: "Medical Ethics & Bioethics: The Four Principles (Beauchamp & Childress), Informed Consent, Decisional Capacity & Tarasoff",
  competencies: ["FC3.1", "FC3.2", "ECE1.2", "AETCOM1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Medical Ethics, Bioethics Principles & Patient Autonomy

Clinical decision-making is anchored by biomedical ethical principles balancing patient self-determination, professional beneficence, harm minimization, and justice.

---

## 1. The Four Core Principles of Biomedical Ethics (Beauchamp \u0026 Childress)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Ethical Principle} & \\textbf{Definition / Core Concept} & \\textbf{Clinical Application} & \\textbf{Legal / Ethical Precedent} \\\\
\\hline
\\textbf{1. Autonomy} & \\mathbf{\\text{Respect for patient self-determination}} & \\mathbf{\\text{Informed consent, right to refuse treatment,}} & \\text{Competent adults may refuse any treatment,} \\\\
& \\text{and individual bodily integrity} & \\mathbf{\\text{advance directives (Living Will, DPOA)}} & \\text{even life-saving interventions} \\\\
\\textbf{2. Beneficence} & \\mathbf{\\text{Duty to act in the best interest}} & \\text{Recommending evidence-based therapies,} & \\text{Balancing paternalism vs autonomy;} \\\\
& \\text{of the patient (duty of care)} & \\text{providing compassionate care} & \\text{autonomy supersedes beneficence} \\\\
\\textbf{3. Non-Maleficence} & \\mathbf{\\text{\"Primum non nocere\" (First, do no harm)}} & \\text{Avoiding unnecessary harm, calculating} & \\text{Discontinuing futile painful interventions;} \\\\
& & \\text{risk-to-benefit therapeutic ratios} & \\text{rule of double effect (palliative sedation)} \\\\
\\textbf{4. Justice} & \\mathbf{\\text{Fair, equitable distribution of health}} & \\text{Triage during mass casualty incidents,} & \\text{Non-discrimination regardless of race, gender,} \\\\
& \\text{resources and equal treatment of equals} & \\text{organ transplant waitlist allocation} & \\text{socioeconomic status, or insurance} \\\\
\\hline
\\end{array}$$

---

## 2. Decisional Capacity vs Competence \u0026 Confidentiality Exceptions

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Domain} & \\textbf{Key Criterion / Threshold} & \\textbf{Responsible Authority} & \\textbf{Clinical Implication} \\\\
\\hline
\\textbf{Decisional Capacity} & \\mathbf{\\text{4 Elements: Understands condition, Appreciates}} & \\mathbf{\\text{Any Licensed Physician}} & \\mathbf{\\text{Decision-specific and time-specific;}} \\\\
& \\mathbf{\\text{consequences, Reasons choices, Expresses a choice}} & (\\text{bedside clinical assessment}) & \\mathbf{\\text{may fluctuate (delirium, intoxication)}} \\\\
\\textbf{Legal Competence} & \\text{Global legal capacity to manage personal affairs} & \\mathbf{\\text{Judge / Court of Law}} & \\text{Appoints a legal guardian or conservator} \\\\
\\textbf{Tarasoff Ruling} & \\mathbf{\\text{Duty to Protect / Warn identified 3rd parties}} & \\text{Physician / Psychiatrist} & \\mathbf{\\text{MANDATORY EXCEPTION TO CONFIDENTIALITY}} \\\\
(\\textbf{Confidentiality}) & \\mathbf{\\text{from credible imminent physical violence}} & & \\mathbf{\\text{Must notify victim and law enforcement}} \\\\
\\hline
\\end{array}$$

- **Mandatory Reporting Exceptions to Confidentiality**:
  1. **Tarasoff Duty**: Explicit, credible threat of severe physical harm against an identifiable individual.
  2. **Suspected Abuse**: Child abuse/neglect, elder abuse, vulnerable adult exploitation (mandatory in all jurisdictions).
  3. **Reportable Infectious Diseases**: Tuberculosis, Syphilis, Gonorrhea, HIV, Rabies, Measles, Cholera (reported to public health authorities).
  4. **Violent Injuries**: Gunshot wounds, stab wounds, criminal poisoning (reported to police).
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old female with severe bacterial pneumonia and septic shock requires endotracheal intubation and mechanical ventilation. She is fully alert, oriented x4, and has intact decisional capacity. However, she is a devout Jehovah's Witness and has a signed, notarized Advanced Directive (Living Will) stating that under no circumstances should she receive blood products (PRBCs, platelets, plasma). Twelve hours after intubation, her hemoglobin drops from 11.2 g/dL to 4.8 g/dL due to an acute stress-related upper gastrointestinal hemorrhage. Her attending physician believes that a blood transfusion is essential to prevent cardiac arrest.",
      question: "From an ethical and legal standpoint, what is the most appropriate management regarding the blood transfusion?",
      options: [
        "Respect the patient's autonomous refusal and withhold blood products; administer non-blood alternatives (IV fluids, erythropoietin, IV iron, and tranexamic acid) and continue aggressive supportive care",
        "Administer blood products under the principle of beneficence because it is life-saving",
        "Obtain consent from the patient's family to override her directive",
        "Seek an emergency court order to declare the patient incompetent"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario represents the ethical primacy of Patient Autonomy: (1) Core Ethical Principle: A competent adult patient has the absolute ethical and legal right to refuse any medical intervention, including life-sustaining treatments such as blood transfusions, mechanical ventilation, or dialysis; (2) Pre-stated Directives: A clear, voluntary advance directive executed while competent remains legally binding even if the patient subsequently becomes incapacitated; (3) Hierarchy of Principles: In modern biomedical ethics, patient autonomy supersedes medical beneficence; administering blood products against an explicit refusal constitutes battery."
    }
  ]
};
