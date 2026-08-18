/**
 * Internship Core Clinical Postings: Advanced Cardiac Life Support (ACLS 2025 Algorithmic Pathways)
 * Authoritative resuscitation content derived from AHA ACLS Guidelines 2025, Tintinalli's Emergency Medicine.
 * Mapped to NMC CBME Competencies: IN1.1, EM1.1, AN1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACLS_PATHWAYS_ARREST_MODULE: PhysiologyLessonModule = {
  id: "int1-acls-pathways-arrest",
  unitCode: "IN1.1",
  title: "Advanced Cardiac Life Support (ACLS 2025): Shockable VF/pVT, Non-Shockable PEA/Asystole, 5 Hs & 5 Ts, & Post-ROSC TTM",
  competencies: ["IN1.1", "EM1.1", "AN1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Advanced Cardiac Life Support (ACLS 2025 Algorithmic Pathways)

High-quality chest compressions, prompt rhythm-directed defibrillation, disciplined vasopressor/antiarrhythmic pharmacology, and systematic elimination of reversible causes drive survival in adult cardiac arrest.

---

## 1. Shockable vs Non-Shockable Adult Cardiac Arrest Algorithms

$$\\begin{array}{lcccc}
\\hline
\\textbf{Arrest Rhythm} & \\textbf{Primary Electrical Intervention} & \\textbf{Pharmacotherapy Schedule} & \\textbf{Key Resuscitation Priorities} \\\\
\\hline
\\textbf{Shockable:} & \\mathbf{\\text{Defibrillation stat}} & \\mathbf{\\text{Epinephrine 1 mg IV/IO q3-5 min}} & \\text{Compressions 100-120/min, depth 2-2.4 in (5-6 cm);} \\\\
\\mathbf{\\text{VF / Pulseless VT}} & (120-200\\text{ J biphasic}) & \\mathbf{\\text{Amiodarone 300 mg bolus (1st), 150 mg (2nd)}} & \\text{minimize interruptions (}\\text{pause } < 10\\text{ s); complete recoil} \\\\
\\textbf{Non-Shockable:} & \\mathbf{\\text{NO SHOCK}} & \\mathbf{\\text{Epinephrine 1 mg IV/IO IMMEDIATELY;}} & \\mathbf{\\text{Search and treat reversible etiologies:}} \\\\
\\mathbf{\\text{PEA / Asystole}} & (\\text{continue high-quality CPR}) & \\text{repeat every 3-5 minutes} & \\mathbf{\\text{The 5 Hs and 5 Ts}} \\\\
\\hline
\\end{array}$$

---

## 2. Reversible Causes of Cardiac Arrest: The 5 Hs and 5 Ts

$$\\begin{array}{lcccc}
\\hline
\\textbf{The 5 Hs} & \\textbf{Diagnostic / Treatment Clues} & \\textbf{The 5 Ts} & \\textbf{Diagnostic / Treatment Clues} \\\\
\\hline
\\textbf{1. Hypovolemia} & \\text{History of bleeding/trauma } \\rightarrow \\text{ IV fluids / MTP blood} & \\textbf{1. Tension Pneumo} & \\text{Tracheal shift, absent breath sounds } \\rightarrow \\text{ needle decompression} \\\\
\\textbf{2. Hypoxia} & \\text{Airway occlusion / cyanosis } \\rightarrow 100\\% \\text{ } O_2 \\text{, bag-mask, ETT} & \\textbf{2. Tamponade} & \\text{Beck triad, pericardial fluid on FAST } \\rightarrow \\text{ pericardiocentesis} \\\\
\\textbf{3. Hydrogen (Acidosis)} & \\text{Severe metabolic acidosis } \\rightarrow \\text{ hyperventilate, } NaHCO_3 & \\textbf{3. Toxins} & \\text{Opioids (Naloxone), TCAs (} NaHCO_3 \\text{), CCBs (Calcium/Insulin)} \\\\
\\textbf{4. Hypo-/Hyperkalemia} & \\text{Peaked T / sine wave } \\rightarrow \\text{ Calcium gluconate, insulin/D50} & \\textbf{4. Thrombosis PE} & \\text{Acute RV strain, PE history } \\rightarrow \\text{ thrombolytic Alteplase} \\\\
\\textbf{5. Hypothermia} & \\text{Core temp } < 30^{\\circ}\\text{C } \\rightarrow \\text{ active internal/external rewarming} & \\textbf{5. Thrombosis ACS} & \\text{Pre-arrest angina, ST-elevation } \\rightarrow \\text{ emergent PCI post-ROSC} \\\\
\\hline
\\end{array}$$

---

## 3. Post-Cardiac Arrest Care & Targeted Temperature Management (TTM)

- **Return of Spontaneous Circulation (ROSC) Protocol**:
  - Optimize hemodynamics: Maintain **Mean Arterial Pressure (MAP) $\\ge 65\\text{ mmHg}$** and Systolic BP $> 90\\text{ mmHg}$ (using Norepinephrine or Epinephrine infusions).
  - Targeted Temperature Management (TTM): Maintain constant core temperature between **$32^{\\circ}\\text{C}$ and $36^{\\circ}\\text{C}$** for at least 24 hours in comatose patients post-ROSC (prevents reperfusion secondary neurotoxic injury).
  - Emergent Coronary Angiography: Immediate cardiac catheterization lab activation for suspected myocardial infarction or ST-elevation on post-ROSC 12-lead ECG.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with a history of coronary artery disease experiences a sudden witnessed cardiac arrest in the emergency department waiting room. The resuscitation team initiates high-quality CPR (110 compressions/min). The cardiac monitor is attached and demonstrates coarse, chaotic, irregular fibrillatory baseline deflections without identifiable QRS complexes or P waves (Ventricular Fibrillation). A defibrillator is charged to 200 J biphasic.",
      question: "According to the 2025 AHA ACLS Guidelines, what is the immediate sequence of electrical and pharmacotherapeutic interventions?",
      options: [
        "Deliver the 200 J shock immediately, resume CPR instantly for 2 minutes without pausing for a rhythm check, deliver a second shock if VF persists, resume CPR for 2 minutes and administer Epinephrine 1 mg IV, deliver a third shock if VF persists, resume CPR and administer Amiodarone 300 mg IV bolus",
        "Administer Epinephrine 1 mg IV first before attempting any defibrillation",
        "Deliver a shock and immediately stop CPR for 30 seconds to check for a pulse",
        "Administer Atropine 1 mg IV and prepare for transcutaneous pacing"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates the fundamental ACLS shockable cardiac arrest pathway: (1) Immediate Defibrillation: For shockable rhythms (VF/pulseless VT), the highest priority is immediate unsynchronized defibrillation (120-200 J biphasic); (2) CPR Resumption: CPR must be resumed immediately after each shock without pausing to check rhythm or pulse; (3) Drug Timing: Epinephrine (1 mg IV/IO) is administered after the 2nd defibrillation shock (during the 2nd cycle of CPR) and repeated every 3-5 minutes; (4) Antiarrhythmic Timing: Amiodarone (300 mg IV bolus first dose, 150 mg second dose) or Lidocaine (1-1.5 mg/kg) is administered for refractory VF/pVT after the 3rd defibrillation shock."
    }
  ]
};
