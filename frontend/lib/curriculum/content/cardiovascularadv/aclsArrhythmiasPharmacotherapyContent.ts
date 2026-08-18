/**
 * Cardiovascular: Advanced ACLS Arrhythmia Management & Pharmacotherapy
 * Authoritative medical content derived from AHA/ACC ACLS Guidelines 2020/2025, Braunwald's Heart Disease.
 * Mapped to NMC CBME Competencies: CV7.1, CV7.2, CV8.1, CV8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACLS_ARRHYTHMIAS_PHARMACOTHERAPY_MODULE: PhysiologyLessonModule = {
  id: "cardiovascular-adv-acls-arrhythmias-pharmacotherapy",
  unitCode: "CV7.1",
  title: "Advanced ACLS Protocols: Tachycardia, Shockable Pulseless Arrest (VT/VF), 5Hs & 5Ts, Atropine & Amiodarone",
  competencies: ["CV7.1", "CV7.2", "CV8.1", "CV8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Advanced ACLS Arrhythmia Algorithms & Resuscitation Pharmacotherapy

The American Heart Association (AHA) Advanced Cardiovascular Life Support (ACLS) protocols guide evidence-based resuscitation for peri-arrest tachyarrhythmias, bradyarrhythmias, and cardiac arrest.

---

## 1. ACLS Tachycardia Management Algorithm (With Pulse)

$$\\begin{array}{cll}
\\hline
\\textbf{Clinical Status} & \\textbf{ECG Characteristics} & \\textbf{First-Line ACLS Resuscitation Protocol} \\\\
\\hline
\\textbf{UNSTABLE} & \\text{Narrow or Wide QRS complex} & \\mathbf{\\text{IMMEDIATE SYNCHRONIZED CARDIOVERSION}} \\\\
\\text{(Hypotension, altered mental} & & \\text{• Narrow Regular (SVT/Flutter): } 50 - 100\\text{ J biphasic} \\\\
\\text{status, shock, chest pain, edema)} & & \\text{• Narrow Irregular (AFib): } 120 - 200\\text{ J biphasic} \\\\
& & \\text{• Wide Regular (VT with pulse): } 100\\text{ J biphasic} \\\\
\\hline
\\textbf{STABLE} & \\text{Narrow Regular Complex} & \\text{1. Vagal maneuvers (Valsalva, carotid sinus massage)} \\\\
& (\\text{QRS } \u003c0.12\\text{ sec, e.g. AVNRT / SVT}) & \\text{2. }\\mathbf{\\text{IV Adenosine } 6\\text{ mg}}\\text{ rapid push } + 20\\text{ mL flush} \\\\
& & \\text{3. }\\mathbf{\\text{IV Adenosine } 12\\text{ mg}}\\text{ if SVT persists after } 1-2\\text{ min} \\\\
\\hline
\\textbf{STABLE} & \\text{Wide Regular Complex} & \\mathbf{\\text{IV Amiodarone } 150\\text{ mg}}\\text{ over } 10\\text{ min (repeat as needed)} \\\\
& (\\text{QRS } \\ge 0.12\\text{ sec, e.g. Monomorphic VT}) & \\text{or }\\mathbf{\\text{IV Procainamide } 20-50\\text{ mg/min}} \\\\
\\hline
\\end{array}$$

---

## 2. ACLS Cardiac Arrest Algorithm (Pulseless Arrest)

- **Shockable Rhythms: Ventricular Fibrillation (VF) & Pulseless Ventricular Tachycardia (pVT)**:
  1. **Immediate Defibrillation**: High-energy **Unsynchronized Shock ($200\\text{ J}$ biphasic)**.
  2. **CPR for $2\\text{ minutes}$** immediately following shock (do NOT check rhythm/pulse!).
  3. **Vascular Access & Vasopressor**: **IV/IO Epinephrine $1\\text{ mg}$ (1:10,000)** administered every $3-5\\text{ minutes}$ starting after the 2nd shock.
  4. **Antiarrhythmic for Refractory VF/pVT**: **IV/IO Amiodarone $300\\text{ mg}$ bolus** (after 3rd shock); second dose **$150\\text{ mg}$** after 5th shock (or Lidocaine $1.0 - 1.5\\text{ mg/kg}$).
- **Non-Shockable Rhythms: Pulseless Electrical Activity (PEA) & Asystole**:
  1. **High-Quality CPR** $+$ **IV Epinephrine $1\\text{ mg}$ immediately** and repeated every $3-5\\text{ minutes}$.
  2. *Defibrillation is strictly contraindicated!*
  3. **Aggressive Search & Treatment of Reversible Causes (The 5 H\'s and 5 T\'s)**:
     - **5 H\'s**: **H**ypovolemia, **H**ypoxia, **H**ydrogen ion (Acidosis), **H**ypo/Hyperkalemia, **H**ypothermia.
     - **5 T\'s**: **T**ension pneumothorax, **T**amponade (cardiac), **T**oxins (overdoses), **T**hrombosis (pulmonary PE), **T**hrombosis (coronary ACS).

---

## 3. Symptomatic Bradycardia Protocol

- **Definition**: Heart rate $<50\\text{ bpm}$ accompanied by hypotension, altered mental status, signs of shock, or ischemic chest discomfort.
- **First-Line Pharmacotherapy**: **IV Atropine $1.0\\text{ mg}$ bolus** every $3-5\\text{ minutes}$ up to a maximum cumulative dose of **$3.0\\text{ mg}$** ($0.04\\text{ mg/kg}$).
- **Second-Line / If Atropine Ineffective**:
  - **Transcutaneous Pacing (TCP)**.
  - **IV Dopamine Infusion** ($5 - 20\\ \\mu\\text{g/kg/min}$).
  - **IV Epinephrine Infusion** ($2 - 10\\ \\mu\\text{g/min}$).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male is brought to the resuscitation bay in pulseless cardiac arrest. The cardiac monitor displays fine chaotic undulations with no identifiable QRS complexes or P waves, confirming Ventricular Fibrillation (VF). High-quality chest compressions are initiated. A biphasic defibrillator is applied and charged to 200 Joules.",
      question: "Which of the following represents the correct sequence of actions following delivery of the initial 200 J defibrillator shock?",
      options: [
        "Immediately resume CPR (chest compressions) for 2 minutes without pausing for a rhythm or pulse check",
        "Pause compressions for 30 seconds to re-evaluate the cardiac rhythm and check for a carotid pulse",
        "Immediately administer IV Epinephrine 1 mg before restarting chest compressions",
        "Perform endotracheal intubation and administer IV Sodium Bicarbonate"
      ],
      correctAnswerIndex: 0,
      explanation: "According to the AHA ACLS Guidelines, immediately following any defibrillator shock delivery (200 J biphasic), high-quality CPR (chest compressions and ventilations) MUST be resumed immediately for 2 minutes without pausing to check the rhythm or pulse. Checking the rhythm or pulse immediately after shock wastes vital perfusion time during the post-shock period. Rhythm and pulse checks are performed only after completion of the 2-minute CPR cycle."
    }
  ]
};
