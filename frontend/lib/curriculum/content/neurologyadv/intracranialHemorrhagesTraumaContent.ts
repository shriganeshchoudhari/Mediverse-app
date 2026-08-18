/**
 * Neurology: Intracranial Hemorrhages & Traumatic Brain Injury
 * Authoritative medical content derived from Adams and Victor's Principles of Neurology (12th ed.), Harrison's.
 * Mapped to NMC CBME Competencies: NE1.3, NE1.4, PA38.1, PA38.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INTRACRANIAL_HEMORRHAGES_TRAUMA_MODULE: PhysiologyLessonModule = {
  id: "neurology-adv-intracranial-hemorrhages-trauma",
  unitCode: "NE3.1",
  title: "Intracranial Hemorrhages: Epidural (MMA), Subdural (Bridging Veins) & Subarachnoid (Berry Aneurysm)",
  competencies: ["NE1.3", "NE1.4", "PA38.1", "PA38.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Intracranial Hemorrhages & Traumatic Brain Injury

Intracranial hemorrhages represent acute neurosurgical emergencies categorized by vascular origin, cranial compartment, and classic neuroimaging morphology.

---

## 1. Comparative Diagnostic Matrix of Intracranial Bleeds

$$\\begin{array}{lcccc}
\\hline
\\textbf{Hemorrhage Type} & \\textbf{Vessel Ruptured} & \\textbf{Classic Clinical Scenario} & \\textbf{Head CT Morphology} & \\textbf{Suture Line Rules} \\\\
\\hline
\\textbf{Epidural (EDH)} & \\mathbf{\\text{Middle Meningeal Artery}} & \\mathbf{\\text{Lucid Interval } \\rightarrow \\text{ Uncal Herniation}} & \\mathbf{\\text{Biconvex (Lenticular) Hyperdensity}} & \\mathbf{\\text{DOES NOT cross suture lines}} \\\\
& \\text{(Pterion fracture)} & \\text{(Ipsilateral blown pupil, hemiparesis)} & & \\text{(Limited by dural attachments)} \\\\
\\textbf{Subdural (SDH)} & \\mathbf{\\text{Bridging Cortical Veins}} & \\text{Elderly / Alcoholics / Shaken Baby} & \\mathbf{\\text{Crescent-shaped (Concave)}} & \\mathbf{\\text{CAN cross suture lines}} \\\\
& & \\text{(Gradual headache, cognitive decline)} & \\text{(Hyperdense acute / Isodense chronic)} & \\text{(Limited by falx/tentorium)} \\\\
\\textbf{Subarachnoid (SAH)} & \\mathbf{\\text{Saccular (Berry) Aneurysm}} & \\mathbf{\\text{\"Worst headache of my life\"}} & \\text{Blood in basal cisterns \u0026 sulci;} & \\text{Fills subarachnoid space;} \\\\
& \\text{(ACom / PCom junction)} & \\text{(Thunderclap, meningismus, fever)} & \\mathbf{\\text{LP: Xanthochromia (>12h)}} & \\text{Risk of vasospasm (Days 3-14)} \\\\
\\hline
\\end{array}$$

---

## 2. Subarachnoid Hemorrhage (SAH) Emergency Protocols

- **Etiology**: Rupture of saccular (berry) aneurysms ($85\\%$), commonly located at the junction of the **Anterior Communicating Artery (ACom)** with the anterior cerebral artery, or Posterior Communicating Artery (PCom $\\rightarrow$ CN III compression with pupil dilation).
- **Associated Systemic Disorders**: **Autosomal Dominant Polycystic Kidney Disease (ADPKD)**, Ehlers-Danlos syndrome (vascular type), Marfan syndrome, and coarctation of the aorta.
- **Diagnostic Protocol**:
  1. **Non-contrast Head CT**: Sensitivity $>95-98\\%$ within first 6-12 hours.
  2. **Diagnostic Lumbar Puncture**: Indicated if CT is negative but clinical suspicion remains high $\\rightarrow$ demonstrates **Xanthochromia (yellow supernatant due to bilirubin formation from lysed RBCs $>12\\text{ hours}$)** and elevated opening pressure (differentiates from a traumatic tap).
- **Post-SAH Complications & Management**:
  - **Rebleeding**: Highest risk in the first 24 hours $\rightarrow$ urgent surgical clipping or endovascular coiling.
  - **Delayed Cerebral Ischemia / Vasospasm**: Occurs between **Days 3 to 14** due to spasmogenic blood breakdown products $\rightarrow$ **Prophylaxis with oral Nimodipine (dihydropyridine calcium channel blocker)**.
  - **Communicating Hydrocephalus**: Arachnoid villi plugging by RBCs $\rightarrow$ external ventricular drain (EVD) or ventriculoperitoneal shunt.
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old college student is struck on the right side of his head by a baseball. He experiences a 30-second loss of consciousness, but quickly awakens, feels alert, and insists on returning to the game. Two hours later in the locker room, he develops an excruciating headache, becomes rapidly somnolent, and becomes unarousable. In the emergency department, vital signs show: BP 178/92 mmHg, HR 52 bpm (Cushing reflex). Examination reveals a dilated, non-reactive right pupil and left-sided hemiplegia.",
      question: "Which of the following blood vessels has ruptured, and what characteristic finding is expected on urgent non-contrast head CT?",
      options: [
        "Middle Meningeal Artery; Biconvex (lenticular) hyperdense collection that does not cross cranial suture lines",
        "Bridging Cortical Veins; Crescent-shaped concave collection that freely crosses cranial suture lines",
        "Anterior Communicating Artery Aneurysm; Diffuse blood in the basal cisterns with ventricular enlargement",
        "Middle Cerebral Artery Lenticulostriate Artery; Hyperdense intraparenchymal hematoma in the putamen"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with the classical traumatic history of an Epidural Hemorrhage (EDH): impact to the pterion (temporal bone), a classic 'lucid interval' (brief initial unconsciousness followed by temporary full alertness), followed by rapid decompensation due to arterial expansion of the hematoma. The underlying lesion is rupture of the Middle Meningeal Artery (branch of the maxillary artery). Non-contrast head CT reveals a high-pressure, biconvex (lens-shaped) hyperdensity that does not cross cranial suture lines because the dura is tightly adhered to the cranial periosteum at the sutures. The dilated right pupil reflects ipsilateral uncal herniation compressing CN III."
    }
  ]
};
