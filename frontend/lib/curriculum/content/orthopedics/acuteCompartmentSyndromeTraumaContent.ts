/**
 * Acute Compartment Syndrome, Intracompartmental Pressure & Fasciotomy Learning Content
 * Authoritative medical content derived from Rockwood and Green, Apley & Solomon, Campbell, and USMLE Step 2 CK Orthopedics.
 * Mapped to NMC CBME Competencies: OR3.1, OR3.2, OR3.3, OR4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_COMPARTMENT_SYNDROME_MODULE: PhysiologyLessonModule = {
  id: "orth-compartment-syndrome",
  unitCode: "OR3.1",
  title: "Orthopedics: Acute Compartment Syndrome (The 6 Ps), Delta Pressure (ΔP) & 4-Compartment Fasciotomy",
  competencies: ["OR3.1", "OR3.2", "OR3.3", "OR4.1"],
  estimatedMinutes: 140,
  organ3dTarget: "SKELETAL",
  markdownContent: `
# Orthopedics: Acute Compartment Syndrome (The 6 Ps), Delta Pressure (ΔP) & 4-Compartment Fasciotomy

Acute Compartment Syndrome (**ACS**) is an orthopedic surgical emergency where elevated tissue pressure within an unyielding osteofascial space exceeds capillary perfusion pressure, leading to progressive tissue ischemia, irreversible myonecrosis, and permanent nerve palsy.

---

## 1. Pathophysiology & Etiology

- **Etiology**: Closed or open **Tibial Shaft Fractures** ($>40\\%$ of cases), forearm fractures (both bones or supracondylar), high-energy crush injuries, prolonged tourniquet application, tight circumferential casts, and post-ischemic reperfusion edema.
- **Microvascular Cascade**: Increased interstitial fluid pressure $\\rightarrow$ post-capillary venule collapse $\\rightarrow$ increased venous pressure $\\rightarrow$ reduced arteriovenous pressure gradient $\\rightarrow$ tissue hypoxia $\\rightarrow$ capillary endothelial breakdown and worsening interstitial edema (vicious cycle).
- **Ischemia Thresholds**:
  - **Nerves**: Conduction loss occurs after **$1\\text{ to } 2\\text{ hours}$**; irreversible axonal loss occurs after **$6\\text{ to } 8\\text{ hours}$**.
  - **Muscles**: Functional loss occurs after **$4\\text{ hours}$**; irreversible myonecrosis and fibrosis occur after **$6\\text{ to } 8\\text{ hours}$**.

---

## 2. The 6 Ps of Acute Compartment Syndrome

| Clinical "P" | Physical Examination Hallmark | Chronological Significance |
| :--- | :--- | :--- |
| **1. Pain out of Proportion** | Severe, unyielding, deep aching pain unresponsive to escalating parenteral opioids. | **EARLIEST and most reliable clinical symptom**. |
| **2. Pain on Passive Stretch** | Exquisite pain elicited upon **passive elongation of the muscles residing within that compartment** (e.g. passive toe extension for anterior lower leg compartment). | **MOST SENSITIVE physical examination finding**. |
| **3. Paresthesia** | Hypoesthesia or "pins and needles" in the sensory cutaneous distribution of the nerves traversing the compartment (e.g. first web space numbness from Deep Peroneal nerve). | Early sign of nerve hypoxia. |
| **4. Pressure / Tense Swelling** | Compartment feels firm, tight, and "wood-like" on palpation; non-yielding fascial envelope. | Objective physical sign. |
| **5. Pallor / Poikilothermia** | Cool, pale, mottled extremity from microvascular shutdown. | Late sign of advanced ischemia. |
| **6. Pulselessness** | Loss of distal arterial pulses. | **EXTREMELY LATE / PRE-AMPUTATION SIGN**. *(CRITICAL RULE: The presence of palpable distal pulses does NOT rule out Compartment Syndrome!)* |

---

## 3. Intracompartmental Pressure Measurement & Delta Pressure ($\\Delta P$)

Direct needle manometry (Stryker pressure monitor) is indicated in unconscious, obtunded, or pediatric patients where physical examination is unreliable:

$$\\text{Delta Pressure } (\\Delta P) = \\text{Diastolic Blood Pressure} - \\text{Measured Intracompartmental Pressure}$$

- **Normal Tissue Pressure**: $0\\text{ to } 8\\text{ mmHg}$.
- **Critical Diagnostic Thresholds**:
  - **Absolute Pressure Threshold**: Measured Compartment Pressure **$> 30\\text{ mmHg}$**.
  - **Delta Pressure Threshold (Gold Standard)**: **$\\Delta P \\le 30\\text{ mmHg}$** (indicates inadequate perfusion gradient).

---

## 4. Emergency Surgical Decompression: 4-Compartment Fasciotomy

1. **Immediate Bedside Actions**: Completely bivalve and remove all circumferential casts, splints, and dressings down to bare skin; keep limb at **Heart Level** (do NOT elevate, as elevation lowers perfusion pressure!).
2. **Double-Incision 4-Compartment Fasciotomy of the Lower Leg**:
   - **Anterolateral Incision**: Decompresses the **Anterior Compartment** (Tibialis anterior, EHL, EDL, Deep Peroneal nerve) and **Lateral Compartment** (Peroneus longus/brevis, Superficial Peroneal nerve).
   - **Posteromedial Incision**: Decompresses the **Superficial Posterior Compartment** (Gastrocnemius, Soleus) and **Deep Posterior Compartment** (Tibialis posterior, FHL, FDL, Posterior Tibial artery/vein, Tibial nerve).
   - Wounds are left open with negative-pressure wound therapy (wound VAC) and scheduled for secondary closure or split-thickness skin grafting at $48-72\\text{ hours}$.
3. **Volkmann Ischemic Contracture**: Untreated forearm compartment syndrome leads to ischemic necrosis of the deep flexor muscles (FDP, FPL) resulting in fixed flexion contracture of the wrist and fingers with clawing.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old motorcyclist sustains a closed midshaft tibia and fibula fracture in an accident. A full circumferential long-leg cast is applied in the emergency department. Six hours later, the patient develops excruciating left calf pain refractory to repeated doses of intravenous morphine. Physical examination reveals a tense, rock-hard calf swelling. Passive flexion and extension of the toes elicit agonizing pain. Sensation in the dorsal first web space is diminished. The dorsalis pedis pulse remains palpable. Blood pressure is 120/70 mmHg, and needle manometry in the anterior compartment yields a tissue pressure of 48 mmHg (Delta P = 70 - 48 = 22 mmHg).",
      question: "Which of the following is the definitive next step in management?",
      options: [
        "Immediately remove the cast and perform an emergency 4-compartment fasciotomy",
        "Elevate the leg above the heart and increase the dose of intravenous opioids",
        "Reassure the patient since the dorsalis pedis pulse is still palpable",
        "Administer intravenous heparin for suspected deep vein thrombosis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Acute Compartment Syndrome (pain out of proportion to injury, pain on passive muscle stretch, tense swelling, and Delta P = 22 mmHg, which is well below the critical diagnostic threshold of <= 30 mmHg). The presence of a palpable distal pulse is expected because systolic pressure (120 mmHg) exceeds the 48 mmHg compartment pressure, but capillary beds are completely collapsed. The mandatory emergency management is immediate cast removal and emergency surgical double-incision 4-compartment fasciotomy to prevent irreversible muscle necrosis."
    }
  ]
};
