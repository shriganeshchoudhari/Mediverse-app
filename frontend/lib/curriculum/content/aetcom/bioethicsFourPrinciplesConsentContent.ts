/**
 * Biomedical Ethics Principles, Informed Consent & Decision-Making Capacity
 * Authoritative medical content derived from Beauchamp & Childress, GMC, AMA Code, and USMLE Step 1/2/3 Ethics.
 * Mapped to NMC AETCOM Competency Modules: 1.1, 1.2, 2.1, 2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BIOETHICS_FOUR_PRINCIPLES_CONSENT_MODULE: PhysiologyLessonModule = {
  id: "aetcom-bioethics-principles-consent",
  unitCode: "AET1.1",
  title: "AETCOM: The 4 Principles of Bioethics, Informed Consent & Decision-Making Capacity (CURB)",
  competencies: ["AET1.1", "AET1.2", "AET1.3", "AET1.4"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# AETCOM: The 4 Principles of Bioethics, Informed Consent & Decision-Making Capacity (CURB)

Medical practice is founded on four core bioethical principles that balance patient self-determination against professional beneficence and societal justice.

---

## 1. The 4 Cardinal Principles of Biomedical Ethics (Beauchamp & Childress)

| Principle | Core Ethical Obligation & Definition | Clinical Applications & Dilemmas |
| :--- | :--- | :--- |
| **1. Autonomy** | Respect for the patient\'s **Self-Determination**, personal values, voluntary choice, and bodily integrity. | • **Informed Consent & Informed Refusal**: A competent adult patient has the absolute right to accept or refuse any proposed medical treatment, even if that refusal results in death (e.g. adult Jehovah\'s Witness refusing blood transfusions).<br>• *Paternalism* (physician overriding patient choice "for their own good") is ethically unacceptable. |
| **2. Beneficence** | The active duty to **Act in the Best Interest of the Patient**, promoting their health, welfare, and well-being. | • Administering evidence-based therapies, immunizations, and preventive screenings.<br>• Balancing anticipated therapeutic benefits against potential burdens. |
| **3. Non-Maleficence** | **"Primum Non Nocere" (First, Do No Harm)**; the fundamental obligation not to inflict intentional or negligent injury, harm, or unnecessary suffering. | • Avoiding futile, excessively harmful, or unproven treatments.<br>• Balancing medication adverse effects against disease risks. |
| **4. Justice** | Fair, equitable, and non-discriminatory distribution of healthcare resources, benefits, and burdens (**Distributive Justice**). | • Fair allocation of scarce organs for transplantation (UNOS criteria based on medical urgency, NOT social worth or wealth).<br>• Triage protocols during pandemics / mass casualty disasters. |

---

## 2. Informed Consent: Core Elements & The CURB Capacity Checklist

- **The 4 Essential Components of Valid Informed Consent**:
  1. **Full Disclosure**: Clear explanation of diagnosis, nature of proposed intervention, material risks, expected benefits, alternatives (including the risk of doing nothing), and prognosis.
  2. **Comprehension**: The patient must understand the information provided (delivered in plain language without medical jargon; use professional medical interpreters).
  3. **Voluntariness**: The decision must be completely free from coercion, manipulation, or undue physician/family pressure.
  4. **Decision-Making Capacity**: The patient must possess the cognitive capacity to make the specific medical decision at that specific time.

- **Clinical Assessment of Decision-Making Capacity (The CURB Checklist)**:
  - **C: Communicate** a clear, consistent, stable choice.
  - **U: Understand** the relevant medical facts (diagnosis, nature of proposed treatment, risks, and alternatives).
  - **R: Reason / Rationalize** through the options logically, evaluating how choices align with personal values.
  - **B: Believe / Appreciate** how the medical condition and potential consequences apply directly to their own life.
  *(Clinical Pearl: **Capacity** is a clinical, decision-specific determination made by any licensed physician; **Competence** is a legal status determined exclusively by a judge).*

---

## 3. Surrogate Decision-Making Hierarchy & Substituted Judgment

When an incapacitated patient lacks decision-making capacity and has no prior advance directives:
1. **Advance Directives / Living Will**: Explicit written preferences regarding life-sustaining interventions.
2. **Durable Power of Attorney for Healthcare (Healthcare Proxy)**: Designated decision-maker bound by the **Substituted Judgment Standard** (making the decision the patient *would have made* if they were competent).
3. **Statutory Next-of-Kin Hierarchy**:
   $$\\text{Spouse} \\rightarrow \\text{Adult Children} \\rightarrow \\text{Parents} \\rightarrow \\text{Adult Siblings} \\rightarrow \\text{Nearest Relative}$$
   *(If the patient\'s prior wishes are unknown, the surrogate must decide based on the **Best Interest Standard**).*

---

## 4. Exceptions to Informed Consent

- **1. Emergency Exception**: Immediate life- or limb-threatening crisis where the patient is incapacitated and no surrogate is available (implied consent).
- **2. Lack of Capacity / Incompetence**: Requires appointed surrogate decision-maker.
- **3. Patient Waiver**: Patient explicitly requests not to be informed and delegates decision to another person.
- **4. Therapeutic Privilege (Extremely Rare)**: Legal exception allowing withholding of information only if disclosure would cause severe, immediate psychological collapse.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old alert, fully oriented male (GCS 15) who is a devout Jehovah's Witness is brought to the emergency department following a severe motorcycle collision. He has a compound femur fracture and massive retroperitoneal hemorrhage. His hemoglobin is 4.8 g/dL, and his blood pressure is 80/50 mmHg. The trauma surgeon explains that an immediate blood transfusion is required to save his life. The patient calmly and clearly refuses all blood products, stating: 'I understand that without blood I will likely die of hemorrhagic shock, but accepting blood violates my religious convictions.' He has no advance directive, and his distraught spouse begs the surgeon to transfuse him against his wishes.",
      question: "Which bioethical principle governs this case, and what is the legally and ethically correct management?",
      options: [
        "Patient Autonomy; Honor the patient's refusal of blood products and provide non-blood resuscitation (IV crystalloids/iron/EPO)",
        "Beneficence; Administer the life-saving blood transfusion over the patient's objection",
        "Substituted Judgment; Follow the spouse's consent because she is next-of-kin",
        "Therapeutic Privilege; Obtain an emergency court order to mandate transfusion"
      ],
      correctAnswerIndex: 0,
      explanation: "A conscious, competent adult patient with decision-making capacity has the absolute ethical and legal right of Autonomy to refuse any medical treatment, including life-saving blood transfusions, even if refusal leads to death. Beneficence does not override a competent patient's informed refusal. The spouse has no legal standing to make surrogate decisions when the patient possesses full decision-making capacity. Non-blood volume expanders and intensive supportive care must be provided."
    }
  ]
};
