/**
 * End-of-Life Care, The Doctrine of Double Effect & Brain Death Determination
 * Authoritative medical content derived from Beauchamp & Childress, AAN Brain Death Guidelines, and USMLE Step 1/2/3 Ethics.
 * Mapped to NMC AETCOM Competency Modules: 4.1, 4.2, 5.1, 5.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const END_OF_LIFE_EUTHANASIA_ORGAN_DONATION_MODULE: PhysiologyLessonModule = {
  id: "aetcom-end-of-life-double-effect-brain-death",
  unitCode: "AET4.1",
  title: "AETCOM: End-of-Life Ethics, The Doctrine of Double Effect & Brain Death Criteria",
  competencies: ["AET4.1", "AET4.2", "AET4.3", "AET4.4"],
  estimatedMinutes: 145,
  organ3dTarget: "NEURAL",
  markdownContent: `
# AETCOM: End-of-Life Ethics, The Doctrine of Double Effect & Brain Death Criteria

Navigating palliative care, life-support withdrawal, brain death, and organ donation requires profound adherence to ethical doctrines and legal standards.

---

## 1. End-of-Life Decision-Making: DNR & Futility

- **Withholding vs Withdrawing Life-Sustaining Treatment**:
  - Ethically and legally equivalent; guided by the patient\'s prior autonomous wishes or surrogate substituted judgment.
- **Do Not Resuscitate (DNR) / Allow Natural Death (AND)**:
  - Applies **strictly to cardiopulmonary resuscitation (chest compressions, defibrillation, and emergency tracheal intubation)** in the event of cardiac or respiratory arrest.
  - **CRITICAL DISTINCTION**: A DNR order does **NOT** mean withholding IV antibiotics, blood transfusions, intensive nursing care, nutrition, or aggressive pain medications!

---

## 2. The Doctrine of Double Effect (Principle of Double Effect)

$$\\text{Ethical Rule}: \\text{An action with both a good effect and a foreseen harmful effect is permissible if the intention is purely good}$$

- **Core Palliative Scenario**: Administering high-dose intravenous Opioids (Morphine, Fentanyl) to relieve severe refractory cancer pain or terminal dyspnea in a dying patient, knowing that it carries the foreseen risk of respiratory depression and potentially hastening death.
- **The 4 Mandatory Ethical Criteria**:
  1. **Nature of the Act**: The act itself must be good or morally neutral (providing pain relief).
  2. **Direct Intention**: The physician\'s sole intention must be the relief of pain/suffering, **NEVER to cause or hasten death**.
  3. **Distinction between Means and Effects**: The bad effect (hastened death) must **not be the means** by which the good effect (pain relief) is achieved.
  4. **Proportionality**: There must be a grave, proportionate reason (intractable severe pain) to risk the bad effect, and the opioid dose must be titrated to symptom severity.

---

## 3. End-of-Life Terminology Matrix

| Modality / Concept | Definition & Mechanism | Legal & Ethical Standing |
| :--- | :--- | :--- |
| **Passive Euthanasia / Withdrawing Support** | Ceasing futile life-sustaining interventions (mechanical ventilator, dialysis) allowing natural underlying disease progression to cause death. | **Ethically and legally permissible worldwide** when authorized by patient/surrogate. |
| **Physician-Assisted Suicide (PAS)** | Physician prescribes a lethal medication that the **patient self-administers**. | Legal in select jurisdictions with strict safeguards (e.g. Oregon Death with Dignity Act, Switzerland); prohibited in most jurisdictions. |
| **Active Voluntary Euthanasia** | Physician **directly administers a lethal injection** at the patient\'s explicit request. | Prohibited in the majority of international legal frameworks (legal in Netherlands, Belgium, Canada). |
| **Palliative Sedation to Unconsciousness** | Continuous infusion of sedatives (Midazolam, Propofol) to induce deep unconsciousness for refractory terminal distress. | **Ethically permissible worldwide** under palliative care guidelines. |

---

## 4. Clinical Criteria for Brain Death Determination (AAN Guidelines)

$$\\text{Triad of Brain Death}: \\text{Unresponsive Coma} + \\text{Absence of ALL Brainstem Reflexes} + \\text{Positive Apnea Test}$$

- **Prerequisites Prior to Testing**:
  - Known irreversible structural brain injury (trauma, anoxic encephalopathy, massive stroke).
  - Absence of confounding CNS depressant drugs, alcohol, or neuromuscular blockers.
  - Normal core temperature ($> 36^\\circ\\text{C} / 96.8^\\circ\\text{F}$), normal systolic BP ($\\text{SBP} \\ge 100\\text{ mmHg}$ with vasopressors), and absence of severe metabolic/endocrine derangements.
- **Complete Absence of Brainstem Reflexes**:
  1. **Pupillary light reflex**: Bilateral fixed, mid-dilated or dilated pupils ($4-9\\text{ mm}$) unreactive to bright light.
  2. **Corneal reflex**: Absent blink response to cotton wisp on bilateral corneas.
  3. **Oculocephalic reflex (Doll\'s Eyes)**: Absent eye movement upon rapid head turning.
  4. **Oculovestibular reflex (Cold Calorics)**: No eye deviation following $50\\text{ mL}$ ice-water irrigation into external auditory canals.
  5. **Gag & Cough reflexes**: Absent pharyngeal contraction upon posterior pharynx stimulation and absent cough on deep endotracheal suctioning.
- **The Apnea Test Protocol**:
  - Pre-oxygenate with $100\\% O_2$ for 10 minutes $\rightarrow$ Disconnect mechanical ventilator with passive oxygen insufflation ($6\\text{ L/min}$ at carina) $\rightarrow$ Observe for $8-10\\text{ minutes}$ for spontaneous respiratory effort $\rightarrow$ Draw ABG.
  - **Positive Apnea Test**: **NO spontaneous respiratory effort observed AND Arterial $\\text{PaCO}_2 \\ge 60\\text{ mmHg}$ (or $\\ge 20\\text{ mmHg}$ increase above baseline)** with $pH < 7.28$.
  - *Confirmatory Ancillary Tests (if apnea test cannot be completed)*: Cerebral Angiography (no intracranial blood flow), Nuclear SPECT perfusion scan (empty skull sign), Transcranial Doppler, or Isoelectric EEG.
`,
  clinicalVignettes: [
    {
      scenario: "A 74-year-old female with stage IV metastatic pancreatic cancer with peritoneal carcinomatosis is admitted to hospice. She experiences agonizing breakthrough abdominal pain and severe dyspnea at rest (RR 34/min). The palliative care physician orders an IV Morphine infusion titrated to relieve her pain and respiratory distress. The patient's son expresses concern: 'Doctor, if you give her this high dose of morphine, won't it suppress her breathing and kill her faster?'",
      question: "Which ethical principle validates the palliative physician's administration of escalating opioid doses to relieve intractable suffering in terminal illness?",
      options: [
        "The Doctrine of Double Effect (Principle of Double Effect)",
        "The Principle of Autonomy over Non-Maleficence",
        "Passive Involuntary Euthanasia",
        "Substituted Judgment Standard"
      ],
      correctAnswerIndex: 0,
      explanation: "The Doctrine of Double Effect provides the ethical foundation for palliative symptom management. It states that an action with a foreseen harmful consequence (potential respiratory depression or shortened life) is ethically justifiable if the physician's sole direct intention is to achieve a good outcome (relief of severe terminal pain and dyspnea), the harm is not the means of achieving the relief, and the medication is carefully titrated to the patient's symptoms."
    }
  ]
};
