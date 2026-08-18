/**
 * Emergency Medicine: Advanced Cardiac Life Support (ACLS) & Post-Cardiac Arrest Care
 * Authoritative medical content derived from AHA ACLS Guidelines (2020/2025), Tintinalli's Emergency Medicine (9th ed.).
 * Mapped to NMC CBME Competencies: EM1.1, EM1.2, MD35.1, AN22.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACLS_RESUSCITATION_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "emergency-adv-acls-resuscitation-protocols",
  unitCode: "EM1.1",
  title: "Advanced Cardiac Life Support (ACLS): Shockable vs Non-Shockable Arrest, H's & T's and ROSC",
  competencies: ["EM1.1", "EM1.2", "MD35.1", "AN22.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Advanced Cardiac Life Support (ACLS) & Resuscitation

Cardiac arrest resuscitation requires immediate categorization into **Shockable** and **Non-Shockable** algorithms, systematic identification of reversible causes (the H's and T's), and protocolized post-cardiac arrest neuroprotection.

---

## 1. ACLS Pulseless Arrest Algorithms

$$\\begin{array}{lcccc}
\\hline
\\textbf{Rhythm Category} & \\textbf{ECG Rhythms} & \\textbf{Electrical Therapy} & \\textbf{First-Line Pharmacotherapy} & \\textbf{Antiarrhythmic Therapy} \\\\
\\hline
\\textbf{Shockable} & \\mathbf{\\text{VF / Pulseless VT}} & \\mathbf{\\text{Immediate High-Energy Defibrillation}} & \\mathbf{\\text{Epinephrine 1 mg IV/IO}} & \\mathbf{\\text{Amiodarone 300 mg (1st dose)}} \\\\
& & \\text{(Biphasic 120-200 J / Monophasic 360 J)} & \\text{(Every 3-5 min after Shock 2)} & \\mathbf{150\\text{ mg (2nd dose) or Lidocaine}} \\\\
\\textbf{Non-Shockable} & \\mathbf{\\text{Asystole / PEA}} & \\mathbf{\\text{NO DEFIBRILLATION!}} & \\mathbf{\\text{Epinephrine 1 mg IV/IO}} & \\text{None; Focus on treating} \\\\
& & \\text{(Resume CPR immediately)} & \\mathbf{\\text{ASAP, then every 3-5 min}} & \\mathbf{\\text{Reversible Causes (H's \u0026 T's)}} \\\\
\\hline
\\end{array}$$

- **High-Quality CPR Metrics**:
  - Chest compression rate: **$100-120\\text{ beats/min}$**.
  - Compression depth: **$\ge 2\\text{ inches } (5\\text{ cm})$** in adults with complete chest recoil.
  - Minimize interruptions in compressions (Chest Compression Fraction $>60-80\\%$).
  - Quantitative waveform capnography: $\\text{PETCO}_2 < 10\\text{ mmHg}$ indicates poor CPR quality; **abrupt sustained increase to $\ge 35-40\\text{ mmHg}$ indicates Return of Spontaneous Circulation (ROSC)**.

---

## 2. Reversible Etiologies: The 5 H's and 5 T's

$$\\begin{array}{ll}
\\hline
\\textbf{The 5 H's} & \\textbf{The 5 T's} \\\\
\\hline
\\mathbf{\\text{Hypovolemia (Fluids / Blood)}} & \\mathbf{\\text{Tension Pneumothorax (Needle Decompression)}} \\\\
\\mathbf{\\text{Hypoxia (Ventilation / Oxygen)}} & \\mathbf{\\text{Tamponade, Cardiac (Pericardiocentesis)}} \\\\
\\mathbf{\\text{Hydrogen Ion / Acidosis (NaHCO}_3\\text{)}} & \\mathbf{\\text{Toxins / Overdose (Specific Antidotes)}} \\\\
\\mathbf{\\text{Hypo- / Hyperkalemia (CaCl}_2\\text{, Insulin)}} & \\mathbf{\\text{Thrombosis, Pulmonary PE (Thrombolytics)}} \\\\
\\mathbf{\\text{Hypothermia (Active Rewarming)}} & \\mathbf{\\text{Thrombosis, Coronary ACS (PCI / Cath Lab)}} \\\\
\\hline
\\end{array}$$

---

## 3. Post-Cardiac Arrest Care & Neuroprotection (ROSC)

- **Targeted Temperature Management (TTM)**: Maintain a constant core body temperature between **$32^\\circ\\text{C}$ and $36^\\circ\\text{C}$ for at least 24 hours** in comatose patients to reduce cerebral metabolic demand, free radical injury, and apoptotic neurodegeneration.
- **Hemodynamic & Ventilatory Goals**:
  - Maintain **$\\text{MAP} \\ge 65\\text{ mmHg}$** and systolic blood pressure $>90\\text{ mmHg}$ (using norepinephrine / epinephrine infusions).
  - Avoid hyperoxia: titrate $\\text{FiO}_2$ to maintain **$\\text{SpO}_2$ $92-98\\%$**.
  - Avoid hypocapnia/hypercapnia: maintain normocarbia (**$\\text{PaCO}_2$ $35-45\\text{ mmHg}$**).
  - Emergent coronary angiography (PCI) indicated for all patients with post-ROSC STEMI or suspected acute coronary occlusion.
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old male with a history of coronary artery disease collapses suddenly at an airport. Bystander CPR is initiated immediately. When the emergency medical services team arrives 4 minutes later, the cardiac monitor reveals coarse Ventricular Fibrillation (VF). The paramedic delivers an immediate unsynchronized biphasic shock of 200 Joules and CPR is resumed immediately for 2 minutes. Following the 2-minute cycle of CPR, the rhythm check demonstrates persistent Ventricular Fibrillation.",
      question: "Which of the following represents the correct sequence of next actions according to current AHA ACLS guidelines?",
      options: [
        "Deliver a second shock (200 J) -> Immediately resume CPR -> Administer Epinephrine 1 mg IV -> Perform pulse/rhythm check after 2 minutes -> Deliver third shock -> Administer Amiodarone 300 mg IV",
        "Administer Epinephrine 1 mg IV immediately -> Pause CPR to deliver a second shock -> Administer Atropine 1 mg IV",
        "Administer Amiodarone 300 mg IV immediately before delivering a second shock -> Resume CPR",
        "Switch to synchronized cardioversion (100 J) -> Administer Sodium Bicarbonate 50 mEq IV"
      ],
      correctAnswerIndex: 0,
      explanation: "According to current AHA ACLS guidelines for shockable cardiac arrest (VF / Pulseless VT): (1) Deliver initial shock; (2) Resume CPR immediately for 2 minutes; (3) Rhythm check: if persistent VF, deliver Shock #2; (4) Resume CPR immediately and administer Epinephrine 1 mg IV/IO (every 3-5 min); (5) After 2 minutes of CPR, if still in VF/pVT, deliver Shock #3 and administer the first dose of antiarrhythmic (Amiodarone 300 mg IV bolus or Lidocaine 1-1.5 mg/kg). Amiodarone is given after the 3rd shock, and chest compressions are resumed immediately after each shock without pausing to check pulse."
    }
  ]
};
