/**
 * Minimum Alveolar Concentration (MAC), Volatile Anesthetics & Malignant Hyperthermia Learning Content
 * Authoritative medical content derived from Miller, Morgan & Mikhail, and USMLE Step 2 CK Anesthesia.
 * Mapped to NMC CBME Competencies: AS3.1, AS3.2, AS4.1, AS4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VOLATILE_ANESTHETICS_MAC_MH_MODULE: PhysiologyLessonModule = {
  id: "anes-volatile-mac-malignant-hyperthermia",
  unitCode: "AS3.1",
  title: "Anesthesia: Volatile Anesthetics, MAC Principles & Malignant Hyperthermia (Dantrolene)",
  competencies: ["AS3.1", "AS3.2", "AS4.1", "AS4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Anesthesia: Volatile Anesthetics, MAC Principles & Malignant Hyperthermia (Dantrolene)

Inhalational anesthetics provide dose-dependent hypnosis, amnesia, and immobility quantified by the Minimum Alveolar Concentration (MAC), but carry the risk of life-threatening pharmacogenetic crises.

---

## 1. The Concept of Minimum Alveolar Concentration (MAC)

$$\\text{Definition of } 1\\text{ MAC}: \\text{Alveolar concentration at } 1\\text{ atm preventing movement in } 50\\% \\text{ of patients to surgical incision}$$
*(Note: $\\text{MAC-Awake} \\approx 0.3-0.4\\text{ MAC}$; $\\text{MAC-BAR (Blunt Autonomic Response)} \\approx 1.5\\text{ MAC}$; $\\text{ED}_{95} \\approx 1.3\\text{ MAC}$)*

| Inhalational Anesthetic | 1 MAC Value ($\\%$) | Blood:Gas Partition Coeff. ($\\lambda_{b:g}$) | Clinical Characteristics & Toxicities |
| :--- | :--- | :--- | :--- |
| **Nitrous Oxide ($N_2O$)** | **$104\\%$** *(cannot achieve 1 MAC at 1 atm)* | **$0.47$** (Extremely Fast) | Second gas effect; expands closed gas spaces (pneumothorax, bowel obstruction, inner ear surgery contraindicated); $B_{12}$ inactivation (methionine synthase inhibition). |
| **Desflurane** | **$6.0\\%$** | **$0.42$** (Fastest Volatile) | Ultra-rapid induction & emergence (ideal for bariatrics); requires heated pressurized vaporizer ($39^\\circ\\text{C}$); pungent (causes coughing/laryngospasm if used for mask induction); sympathetic surge. |
| **Sevoflurane** | **$2.0\\%$** | **$0.69$** (Very Fast) | **Sweet-smelling, non-pungent (Agent of choice for pediatric mask induction)**; bronchodilator; degraded by desiccated $CO_2$ absorbents into **Compound A** (nephrotoxic in rats). |
| **Isoflurane** | **$1.15\\%$** | **$1.40$** (Moderate) | Pungent; preserves cardiac output; excellent for neurosurgery; cheap and widely used for maintenance. |
| **Halothane** | **$0.75\\%$** | **$2.40$** (Slow) | Myocardial sensitizer to catecholamines (arrhythmias); **Halothane Hepatitis** (autoimmune mediated via trifluoroacetyl metabolites in $1:35,000$). |

---

## 2. Factors Altering MAC Requirements

- **Factors DECREASING MAC (Decreased Anesthetic Need)**:
  - Advanced age ($6\\%\\text{ decrease per decade after age 40}$).
  - Hypothermia.
  - Acute alcohol ingestion / intoxication.
  - Hypotension / shock / hypoxia / severe anemia.
  - Co-administration of Opioids, Benzodiazepines, Ketamine, Clonidine, Dexmedetomidine.
  - Pregnancy (due to progesterone/endorphins).
- **Factors INCREASING MAC (Increased Anesthetic Need)**:
  - Young age / infancy (peak MAC at 6 months).
  - Hyperthermia / fever.
  - Chronic alcohol abuse / amphetamine / cocaine use.
  - Hypernatremia, Thyrotoxicosis.

---

## 3. Malignant Hyperthermia (MH): Crisis Pathophysiology & Management

- **Genetics & Triggers**:
  - Autosomal dominant mutation in the **Ryanodine Receptor 1 ($RYR1$)** gene on chromosome 19q13.1 (rarely $CACNA1S$).
  - Triggered by **All Volatile Inhalational Anesthetics** (Sevoflurane, Desflurane, Isoflurane, Halothane) and the depolarizing muscle relaxant **Succinylcholine**.
- **Pathophysiology**: Uncontrolled massive calcium ($Ca^{2+}$) efflux from the sarcoplasmic reticulum into skeletal muscle myoplasm $\rightarrow$ sustained actin-myosin cross-bridging $\rightarrow$ explosive hypermetabolism, glycolysis, and ATP consumption.
- **Clinical Signs & Chronology**:
  1. **Sudden, Unexplained, Dramatic Rise in End-Tidal $CO_2$ ($EtCO_2 > 55-80\\text{ mmHg}$)**: **The earliest and most sensitive clinical indicator!**
  2. **Masseter Muscle Spasm / Jaw Rigidity (Trismus)** following succinylcholine.
  3. Sinus tachycardia, tachypnea, skin mottling.
  4. Generalized skeletal muscle "board-like" rigidity.
  5. Severe Mixed Respiratory and Metabolic Acidosis ($pH < 7.15$, lactate $> 8\\text{ mmol/L}$).
  6. Hyperkalemia ($K^+ > 6.0\\text{ mEq/L}$) and Rhabdomyolysis (**Creatine Kinase $> 20,000\\text{ U/L}$**, myoglobinuria).
  7. **Extreme Hyperthermia ($> 41-42^\\circ\\text{C}$ / $106^\\circ\\text{F}$)**: A **LATE** sign, rising at $1-2^\\circ\\text{C}$ every 5 minutes.
- **Step-by-Step Emergency Management**:
  1. **Immediately TURN OFF all triggering agents** (vaporizers and succinylcholine); notify surgeon to halt procedure.
  2. **Hyperventilate with $100\\% O_2$ at maximum flow ($> 10\\text{ L/min}$)** to wash out volatile agents and flush $CO_2$.
  3. **Administer IV Dantrolene**: Initial bolus **$2.5\\text{ mg/kg}$ rapid IV push**, repeating every $5-10\\text{ minutes}$ until symptoms abate (maximum cumulative dose $10\\text{ mg/kg}$).
  4. Active cooling: Infuse ice-cold $0.9\\%\\text{ Normal Saline}$ IV ($1000\\text{ mL}$), apply surface ice packs to axillae/groin, perform cold bladder/gastric lavage (stop cooling when core temp $< 38.5^\\circ\\text{C}$).
  5. Treat refractory hyperkalemia: **IV Calcium Gluconate $10\\% (10-20\\text{ mL})$** for cardiac membrane stabilization $+$ **Regular Insulin $10\\text{ Units}$ in $50\\text{ mL of } 50\\%\\text{ Dextrose}$** $+$ Sodium Bicarbonate.
`,
  clinicalVignettes: [
    {
      scenario: "A 16-year-old male undergoing elective open reduction and internal fixation of a femur fracture is maintained on general anesthesia with Sevoflurane (2.0%) and oxygen. Forty-five minutes into the procedure, the anesthesiologist notes that the end-tidal CO2 (EtCO2) has risen progressively from 38 mmHg to 78 mmHg despite doubling the minute ventilation. Heart rate is 142 bpm (sinus tachycardia), and blood pressure is 165/100 mmHg. The surgical field feels unusually hot, and the patient has developed generalized skeletal muscle rigidity. Core esophageal temperature is 39.8°C and rising. Arterial blood gas reveals: pH 7.12, PaCO2 74 mmHg, PaO2 180 mmHg, HCO3- 16 mEq/L, Base Deficit -12 mEq/L, Serum Potassium: 6.8 mEq/L.",
      question: "What is the diagnosis, and what is the immediate definitive pharmacotherapeutic agent of choice?",
      options: [
        "Malignant Hyperthermia (MH); Stop Sevoflurane + IV Dantrolene 2.5 mg/kg push",
        "Neuroleptic Malignant Syndrome (NMS); IV Bromocriptine",
        "Thyroid Storm; IV Propranolol and Propylthiouracil",
        "Pheochromocytoma crisis; IV Phentolamine"
      ],
      correctAnswerIndex: 0,
      explanation: "A patient developing acute hypermetabolism under volatile inhalational anesthesia (Sevoflurane) manifested by an explosive rise in EtCO2 refractory to hyperventilation, sinus tachycardia, generalized muscle rigidity, mixed respiratory/metabolic acidosis, hyperkalemia, and rapid hyperthermia is experiencing Malignant Hyperthermia (MH). The definitive emergency management is immediate cessation of all triggering volatile agents, hyperventilation with 100% O2, and rapid IV administration of Dantrolene sodium (2.5 mg/kg IV push), which directly binds to and inhibits mutated sarcoplasmic reticulum Ryanodine (RYR1) calcium channels."
    }
  ]
};
