/**
 * Cardiovascular: Jugular Venous Pressure (JVP) & Hemodynamic Waveforms
 * Authoritative medical content derived from Braunwald's Heart Disease (12th ed.), Lilly's Pathophysiology of Heart Disease.
 * Mapped to NMC CBME Competencies: CV3.1, CV3.2, CV4.1, CV4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const JVP_WAVEFORMS_HEMODYNAMICS_MODULE: PhysiologyLessonModule = {
  id: "cardiovascular-adv-jvp-waveforms-hemodynamics",
  unitCode: "CV3.1",
  title: "Jugular Venous Pressure (JVP) Waveforms: Cannon 'a' Waves, Giant 'v' Waves, Constriction vs Tamponade",
  competencies: ["CV3.1", "CV3.2", "CV4.1", "CV4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Jugular Venous Pressure (JVP) Waveforms & Pericardial Hemodynamics

The internal jugular venous pulsation directly mirrors right atrial pressure dynamics throughout the cardiac cycle, providing vital bedside clues to chamber pressures, arrhythmias, and pericardial disease.

---

## 1. The Five Phases of the Normal JVP Waveform

$$\\begin{array}{cll}
\\hline
\\textbf{Wave / Descent} & \\textbf{Physiological Event} & \\textbf{Timing in Cardiac Cycle} \\\\
\\hline
\\mathbf{a\\text{ Wave}} & \\text{Active Right Atrial Contraction} & \\text{Late diastole (presystolic; precedes S1 and carotid pulse)} \\\\
\\mathbf{c\\text{ Wave}} & \\text{Tricuspid valve bulging into RA during RV isovolumetric contraction} & \\text{Early ventricular systole (simultaneous with carotid upstroke)} \\\\
\\mathbf{x\\text{ Descent}} & \\text{Atrial relaxation \u0026 downward pulling of tricuspid floor during RV ejection} & \\text{Midsystolic (trough occurs just before S2)} \\\\
\\mathbf{v\\text{ Wave}} & \\text{Passive venous filling of RA against closed tricuspid valve} & \\text{Late ventricular systole / early diastole (peaks at S2)} \\\\
\\mathbf{y\\text{ Descent}} & \\text{Rapid passive emptying of RA into RV upon tricuspid valve opening} & \\text{Early diastole (trough follows S2)} \\\\
\\hline
\\end{array}$$

---

## 2. Pathological JVP Waveform Morphology

| JVP Abnormality | Underlying Mechanism | Clinical Etiologies | Bedside Hallmark |
| :--- | :--- | :--- | :--- |
| **Cannon 'a' Waves** | Right atrium contracts against a **closed tricuspid valve** during ventricular systole. | **AV Dissociation**: Complete (3rd-degree) Heart Block, Ventricular Tachycardia, V-pacing. | Irregular, intermittent, violent neck pulsations ("cannon shots"). |
| **Absent 'a' Wave** | Loss of coordinated right atrial electrical depolarization and contraction. | **Atrial Fibrillation (AFib)**. | Flat presystolic contour; irregularly irregular carotid pulse. |
| **Giant 'v' Wave (or 'cv' wave)** | Systolic regurgitant jet transmitted retrogradely into right atrium through incompetent tricuspid valve. | **Tricuspid Regurgitation (TR)**. | Large systolic expansion of neck veins synchronous with pulse; holosystolic murmur at LSB. |
| **Prominent / Steep 'y' Descent** | Rapid, unimpeded early diastolic filling followed by abrupt halting. | **Constrictive Pericarditis** (dip-and-plateau / square-root sign). | Deep, sharp downward dip on JVP; pericardial knock sound; **Positive Kussmaul Sign**. |
| **Blunted / Absent 'y' Descent** | Equalization of intrapericardial and chamber pressures impairs early diastolic inflow. | **Cardiac Tamponade**. | Prominent 'x' descent with lost 'y' descent; **Pulsus Paradoxus $>10\\text{ mmHg}$**; Beck Triad. |

---

## 3. High-Yield Bedside Comparison: Constrictive Pericarditis vs Cardiac Tamponade

$$\\begin{array}{lcccc}
\\hline
\\textbf{Hemodynamic Parameter} & \\textbf{Constrictive Pericarditis} & \\textbf{Cardiac Tamponade} \\\\
\\hline
\\textbf{Primary Pathophysiology} & \\text{Rigid, fibrotic, calcified pericardium} & \\text{Intrapericardial fluid under high pressure} \\\\
\\textbf{JVP Waveform Profile} & \\mathbf{\\text{Prominent } x \\text{ AND sharp, deep } y \\text{ descent}} & \\mathbf{\\text{Prominent } x \\text{ descent, BLUNTED / ABSENT } y \\text{ descent}} \\\\
\\textbf{Kussmaul Sign (}\\uparrow\\text{ JVP on inspiration)} & \\mathbf{\\text{PRESENT (Classic finding)}} & \\mathbf{\\text{ABSENT (Negative)}} \\\\
\\textbf{Pulsus Paradoxus (}\u003e10\\text{ mmHg drop)} & \\text{Rare / Uncommon (}\u003c20\\%\\text{)} & \\mathbf{\\text{PRESENT (Universal hallmark in }\u003e90\\%\\text{)}} \\\\
\\textbf{Auscultatory Sound} & \\text{Pericardial Knock (early diastole)} & \\text{Muffled / Distant heart sounds (Beck Triad)} \\\\
\\textbf{Definitive Treatment} & \\text{Surgical Pericardiectomy ("pericardial stripping")} & \\text{Emergent Needle Pericardiocentesis} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male with a history of treated pulmonary tuberculosis presents with progressive abdominal distention, bilateral ankle edema, and exertional fatigue. On physical examination, the internal jugular venous pulse is elevated to 12 cm H2O. When the patient takes a deep breath in, the JVP visibly rises rather than falls (positive Kussmaul sign). On inspection of the venous waveform, there is a prominent, rapid 'x' descent followed by a sharp, deep, steep 'y' descent. Cardiac auscultation reveals a sharp, high-pitched early diastolic sound heard 0.10 seconds after S2. Pulsus paradoxus is 4 mmHg.",
      question: "Which of the following is the definitive diagnosis and characteristic hemodynamic finding on right heart catheterization?",
      options: [
        "Constrictive Pericarditis; 'Dip-and-plateau' (square-root sign) ventricular diastolic pressure waveform",
        "Cardiac Tamponade; Equalization of diastolic pressures with loss of the 'y' descent and pulsus paradoxus >15 mmHg",
        "Tricuspid Regurgitation; Giant 'cv' fusion wave on right atrial tracing",
        "Complete Heart Block; Intermittent cannon 'a' waves"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Constrictive Pericarditis (a frequent complication of tuberculosis), characterized by elevated JVP, a positive Kussmaul sign (paradoxical inspiratory rise in JVP), a sharp early diastolic Pericardial Knock, and prominent 'x' and sharp deep 'y' descents on the JVP tracing. On invasive hemodynamic catheterization, this produces the pathognomonic 'dip-and-plateau' or 'square-root sign' in ventricular diastolic pressure tracings due to rapid initial early diastolic filling followed by abrupt halting of expansion by the rigid, calcified pericardium."
    }
  ]
};
