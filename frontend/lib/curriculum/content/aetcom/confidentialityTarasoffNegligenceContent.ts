/**
 * Medical Confidentiality, Mandatory Breach Exceptions (Tarasoff) & Medical Malpractice (4 Ds)
 * Authoritative medical content derived from Beauchamp & Childress, GMC, AMA Code, and USMLE Step 1/2/3 Ethics.
 * Mapped to NMC AETCOM Competency Modules: 3.1, 3.2, 4.1, 4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CONFIDENTIALITY_TARASOFF_NEGLIGENCE_MODULE: PhysiologyLessonModule = {
  id: "aetcom-confidentiality-tarasoff-negligence",
  unitCode: "AET3.1",
  title: "AETCOM: Confidentiality, Tarasoff Duty to Warn & Medical Malpractice (The 4 Ds)",
  competencies: ["AET3.1", "AET3.2", "AET3.3", "AET3.4"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# AETCOM: Confidentiality, Tarasoff Duty to Warn & Medical Malpractice (The 4 Ds)

Confidentiality protects the sacred trust between patient and physician, but ethical and legal boundaries require disclosure when third-party safety is critically jeopardized.

---

## 1. Medical Confidentiality & Doctor-Patient Privilege

- **Definition**: The ethical and legal duty of healthcare professionals to safeguard all protected health information (PHI), diagnoses, and communications from unauthorized disclosure.
- **Permissible Disclosures**:
  - Direct communication between healthcare providers involved in the patient\'s active circle of care.
  - Explicit written consent/authorization by the patient.

---

## 2. Mandatory Exceptions to Confidentiality (When Disclosure is Required)

| Exception Category | Legal & Ethical Standard | Required Action & Reporting Body |
| :--- | :--- | :--- |
| **The Tarasoff Ruling ("Duty to Protect / Warn")** | Occurs when a patient makes an **Imminent, Specific, Credible Threat of Serious Physical Violence against an Identifiable Third Party**. | Physician **MUST breach confidentiality**: 1. Notify law enforcement, 2. Directly warn the intended victim, 3. Initiate emergency psychiatric evaluation/hospitalization. |
| **Suspected Child Abuse or Neglect** | Any reasonable suspicion of physical, sexual, or emotional abuse or severe neglect in a minor. | **Mandatory immediate reporting to Child Protective Services (CPS) / Police** *(Parental consent is strictly NOT required!)*. |
| **Elder & Vulnerable Adult Abuse** | Suspicion of physical, sexual, financial exploitation or neglect in elderly or disabled adults. | Mandatory reporting to Adult Protective Services (APS). |
| **Notifiable Communicable Diseases** | High-consequence public health infections (e.g. Tuberculosis, Syphilis, HIV, Meningococcemia, Measles, COVID-19, Cholera). | Mandatory reporting to Public Health Authorities (for contact tracing and disease surveillance). |
| **Impaired Drivers / Public Safety** | Uncontrolled epilepsy, severe narcolepsy, syncope, or profound dementia in commercial drivers/pilots. | Mandatory notification of licensing authorities if patient refuses to stop operating vehicles. |
| **Court Subpoena / Judicial Warrant** | Formal judicial order signed by a judge. | Release limited, relevant medical records strictly as legally mandated. |

---

## 3. Medical Negligence & Malpractice: The 4 Ds

To establish legal liability for medical malpractice in civil tort law, the plaintiff must prove all four elements by a preponderance of the evidence:

$$\\text{Malpractice Liability} = \\text{Duty} + \\text{Dereliction} + \\text{Direct Causation} + \\text{Damages}$$

1. **Duty of Care**:
   - Existence of an established doctor-patient relationship creating a legal obligation to adhere to professional standards.
2. **Dereliction (Breach of Duty)**:
   - The physician failed to provide the accepted standard of medical care that a reasonably prudent physician with similar training would provide under similar circumstances (**The Bolam Test / Modified Montgomery Standard**).
3. **Direct Causation (Proximate Cause)**:
   - The breach of duty directly caused the patient\'s injury (i.e. the harm would not have occurred *"but for"* the physician\'s negligence).
4. **Damages**:
   - The patient sustained actual, measurable physical injury, psychological harm, loss of earning capacity, or financial loss.

- **Res Ipsa Loquitur ("The Thing Speaks for Itself")**:
  - Legal doctrine invoked when the injury could only have occurred through negligence, the instrumentality was under the exclusive control of the surgeon/team, and the patient contributed nothing to the harm (e.g. **Retained surgical laparotomy sponge / forceps inside abdomen**, amputating the wrong limb). The burden of proof shifts to the defendant.
`,
  clinicalVignettes: [
    {
      scenario: "During a psychiatric consultation, a 28-year-old male with severe borderline personality disorder and substance abuse states with intense anger: 'My ex-fiancée Sarah left me for another man last week. I bought a handgun yesterday, and I am going to her apartment tonight at 8 PM to shoot and kill her.' The psychiatrist determines that the patient is lucid, serious, and has the immediate intent and means to carry out the threat.",
      question: "Which legal and ethical precedent governs this situation, and what is the psychiatrist's immediate required duty?",
      options: [
        "The Tarasoff Ruling (Duty to Warn and Protect); Immediately notify law enforcement and attempt to warn the identifiable victim",
        "Absolute Confidentiality; Maintain doctor-patient privilege and double the patient's antipsychotic dose",
        "HIPAA Non-Disclosure; Contact only the patient's parents with the patient's written permission",
        "Therapeutic Privilege; Withhold the information until the next scheduled outpatient visit"
      ],
      correctAnswerIndex: 0,
      explanation: "Under the legal and ethical precedent established by the Tarasoff ruling (Tarasoff v. Regents of the University of California), when a patient communicates an explicit, credible, imminent threat of serious physical harm against an identifiable individual, the physician's duty to protect human life supersedes confidentiality. The physician is legally mandated to breach confidentiality by immediately notifying law enforcement and warning the threatened individual (Duty to Warn and Protect), along with arranging emergency psychiatric hold/hospitalization."
    }
  ]
};
