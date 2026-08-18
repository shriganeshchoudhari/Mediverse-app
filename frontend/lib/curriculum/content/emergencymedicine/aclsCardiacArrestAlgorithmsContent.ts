/**
 * Advanced Cardiovascular Life Support (ACLS), Defibrillation & Post-Cardiac Arrest Care
 * Authoritative medical content derived from AHA ACLS 2020-2025 Guidelines, Rosen, Tintinalli, and USMLE Step 2/3 Emergency Medicine.
 * Mapped to NMC CBME Competencies: EM1.1, EM1.2, EM2.1, EM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACLS_CARDIAC_ARREST_ALGORITHMS_MODULE: PhysiologyLessonModule = {
  id: "em-acls-cardiac-arrest-algorithms",
  unitCode: "EM1.1",
  title: "Emergency: ACLS Cardiac Arrest Algorithms (VF/pVT vs PEA/Asystole) & Defibrillation",
  competencies: ["EM1.1", "EM1.2", "EM2.1", "EM2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Emergency: ACLS Cardiac Arrest Algorithms (VF/pVT vs PEA/Asystole) & Defibrillation

High-quality cardiopulmonary resuscitation and immediate rhythm-specific advanced cardiac life support protocols are the determinants of survival in sudden cardiac arrest.

---

## 1. High-Quality CPR & Waveform Capnography ($EtCO_2$)

- **Chest Compression Metrics**:
  - **Rate**: $100 - 120\\text{ compressions/minute}$.
  - **Depth**: At least $5\\text{ cm}$ ($2\\text{ inches}$), not exceeding $6\\text{ cm}$ ($2.4\\text{ inches}$) in adults.
  - **Chest Recoil**: Allow complete recoil between compressions; do NOT lean on the patient\'s chest.
  - **Chest Compression Fraction (CCF)**: Keep interruptions $< 10\\text{ seconds}$ (target $\\text{CCF} > 80\\%$).
  - **Compressor Rotation**: Rotate compressors every **$2\\text{ minutes}$** (or after 5 cycles of $30:2$) to prevent fatigue.
- **Quantitative Waveform Capnography ($EtCO_2$) Monitoring**:
  - If $EtCO_2 < 10\\text{ mmHg} \\implies$ Inadequate CPR quality (improve compression depth/rate and optimize chest recoil).
  - **Sudden, sustained rise in $EtCO_2 \\ge 35 - 40\\text{ mmHg} \\implies$ Definitive physiological indicator of Return of Spontaneous Circulation (ROSC)!**

---

## 2. ACLS Protocol: Shockable vs Non-Shockable Rhythms

$$\\text{Cardiac Arrest Triad}: \\text{Unresponsive} + \\text{No Breathing / Agonal Gasps} + \\text{No Definite Carotid Pulse within } 10\\text{ s}$$

| Pathway | Presenting ECG Rhythm | Defibrillation & Energy | Pharmacotherapy Sequence | Clinical Pearls & Priorities |
| :--- | :--- | :--- | :--- | :--- |
| **Shockable** | **Ventricular Fibrillation (VF)** OR **Pulseless Ventricular Tachycardia (pVT)** | **IMMEDIATE SHOCK**:<br>• Biphasic: **$120 - 200\\text{ J}$** (manufacturer specific; use maximum if unknown)<br>• Monophasic: **$360\\text{ J}$** | • **Epinephrine $1\\text{ mg}$ IV/IO** after 2nd failed shock, repeated every **$3 - 5\\text{ minutes}$**.<br>• **Amiodarone $300\\text{ mg}$ IV/IO bolus** after 3rd shock; repeat second dose **$150\\text{ mg}$** once.<br>• *(Alternative: Lidocaine $1.0 - 1.5\\text{ mg/kg}$ initial, then $0.5 - 0.75\\text{ mg/kg}$)*.<br>• **Torsades de Pointes**: **IV Magnesium Sulfate $1 - 2\\text{ g}$**. | • **Resume CPR immediately for $2\\text{ minutes}$ after every shock without pausing for a pulse check!**<br>• Minimize pre-shock and post-shock pauses. |
| **Non-Shockable** | **Pulseless Electrical Activity (PEA)** OR **Asystole** | **DO NOT SHOCK** *(Defibrillation is completely ineffective and harmful)* | • **Epinephrine $1\\text{ mg}$ IV/IO IMMEDIATELY / As soon as possible**, repeated every $3 - 5\\text{ minutes}$.<br>• Antiarrhythmics (Amiodarone/Lidocaine) are **NOT indicated**. | • Focus on high-quality uninterrupted CPR.<br>• **Aggressively search and treat reversible underlying causes (The 5 Hs and 5 Ts)**. |

---

## 3. Reversible Causes of Cardiac Arrest: The 5 Hs and 5 Ts

- **The 5 Hs**:
  1. **Hypovolemia**: Rapid infusion of warm balanced crystalloids or blood products ($1:1:1$ MTP in trauma).
  2. **Hypoxia**: Provide $100\\% O_2$, optimize bag-valve-mask, and secure endotracheal airway.
  3. **Hydrogen Ion (Acidosis)**: Hyperventilate to eliminate $CO_2$; consider IV Sodium Bicarbonate ($1\\text{ mEq/kg}$) in severe preexisting metabolic acidosis or TCA overdose.
  4. **Hypo- / Hyperkalemia**:
     - *Hyperkalemia*: IV Calcium Gluconate $10\\% (10-20\\text{ mL}) +$ Regular Insulin $10\\text{ U}$ in $D_{50}W +$ Albuterol.
     - *Hypokalemia*: Rapid IV Potassium Chloride infusion.
  5. **Hypothermia**: Active internal and core rewarming (warm IV fluids, warm pleural/peritoneal lavage).
- **The 5 Ts**:
  1. **Tension Pneumothorax**: Immediate **Needle Decompression** (14G needle in 2nd ICS mid-clavicular line or 5th ICS anterior axillary line) followed by tube thoracostomy.
  2. **Tamponade (Cardiac)**: Point-of-Care Ultrasound (POCUS) $\\implies$ immediate subxiphoid **Pericardiocentesis** or emergent thoracotomy.
  3. **Toxins**: Targeted antidote administration (Naloxone for opioids, Atropine for organophosphates, Digibind for digitalis).
  4. **Thrombosis (Pulmonary - Massive PE)**: Emergency systemic IV Thrombolysis (**Alteplase / tPA $50-100\\text{ mg}$** IV bolus during ongoing CPR).
  5. **Thrombosis (Coronary - Massive STEMI)**: Immediate transfer to Cardiac Catheterization Lab for Primary Percutaneous Coronary Intervention (PPCI) post-ROSC.

---

## 4. Post-Cardiac Arrest Care & Targeted Temperature Management (TTM)

- **Hemodynamic & Ventilatory Optimization**:
  - Maintain Systolic BP $\\ge 90\\text{ mmHg}$ and **Mean Arterial Pressure (MAP) $\\ge 65\\text{ mmHg}$** (use Norepinephrine or Epinephrine infusion).
  - Avoid hyperoxia: Titrate $FiO_2$ to maintain $SpO_2\\text{ }92 - 98\\%$ and normocapnia ($PaCO_2\\text{ }35 - 45\\text{ mmHg}$).
- **Targeted Temperature Management (TTM)**:
  - Indicated for all comatose adult patients who achieve ROSC.
  - Maintain a constant target temperature between **$32^\\circ\\text{C}$ and $36^\\circ\\text{C}$** for at least **$24\\text{ hours}$** to mitigate ischemic-reperfusion neuronal injury, followed by controlled rewarming ($0.25^\\circ\\text{C}/\\text{hour}$) to prevent rebound hyperthermia/fever.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male collapses suddenly in the emergency department waiting room. The resuscitation team arrives within 15 seconds. The patient is unresponsive, apnoeic, and has no carotid pulse. CPR is initiated immediately. The defibrillator monitor pads are applied and reveal fine Ventricular Fibrillation (VF). A biphasic shock of 200 J is delivered. The team immediately resumes chest compressions for 2 minutes. Rhythm check at 2 minutes demonstrates persistent coarse VF.",
      question: "What is the immediate next step in management according to AHA ACLS guidelines?",
      options: [
        "Deliver a 2nd Defibrillation Shock (200 J) + Resume CPR immediately + Administer IV Epinephrine 1 mg",
        "Deliver a 2nd Shock + Administer IV Amiodarone 300 mg bolus immediately",
        "Pause compressions to check for a carotid pulse for 15 seconds",
        "Administer IV Calcium Gluconate and Sodium Bicarbonate"
      ],
      correctAnswerIndex: 0,
      explanation: "In shockable cardiac arrest (VF/pVT), the protocol after a failed first shock and 2 minutes of high-quality CPR is to deliver a 2nd defibrillation shock (200 J biphasic), immediately resume chest compressions for 2 minutes without pausing for a pulse check, and administer Epinephrine 1 mg IV/IO as soon as possible during CPR. Amiodarone (300 mg bolus) is administered only after the 3rd shock for refractory VF/pVT."
    }
  ]
};
