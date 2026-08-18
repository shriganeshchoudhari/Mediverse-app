/**
 * Clinical Postings I: Bedside Cardiovascular & Hemodynamic Physical Examination
 * Authoritative bedside cardiology content derived from Bates, Hutchison, Braunwald.
 * Mapped to NMC CBME Competencies: CP1.2, IM1.2, SU1.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BEDSIDE_CARDIOVASCULAR_JVP_SIGNS_MODULE: PhysiologyLessonModule = {
  id: "clin1-bedside-cardiovascular-jvp-signs",
  unitCode: "CP1.2",
  title: "Bedside Cardiovascular Signs: Jugular Venous Pressure (JVP) Waveforms, Kussmaul Sign, Hepatojugular Reflux & Pulsus Paradoxus",
  competencies: ["CP1.2", "IM1.2", "SU1.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Bedside Cardiovascular & Hemodynamic Physical Examination

Direct inspection of jugular venous pulsations and sphygmomanometric determination of pulsus paradoxus provide invaluable real-time bedside windows into intracardiac hemodynamics.

---

## 1. Jugular Venous Pressure (JVP) Measurement \u0026 Waveform Physics

$$\\begin{array}{lcccc}
\\hline
\\textbf{JVP Waveform Component} & \\textbf{Physiological Event} & \\textbf{Pathological Waveform Alteration} & \\textbf{Associated Clinical Diagnosis} \\\\
\\hline
\\mathbf{a} \\textbf{ Wave} & \\text{Right atrial active contraction} & \\mathbf{\\text{Cannon } a \\text{ waves (giant pulsations)}} & \\mathbf{\\text{AV dissociation, Complete Heart Block, VT}} \\\\
& (\\text{presystolic}) & \\text{Absent } a \\text{ waves} & \\text{Atrial Fibrillation (loss of atrial kick)} \\\\
\\mathbf{c} \\textbf{ Wave} & \\text{Tricuspid valve bulging during RV systole} & \\text{Normal physiological marker} & \\text{Isovolumetric ventricular contraction} \\\\
\\mathbf{x} \\textbf{ Descent} & \\text{Right atrial relaxation \u0026 downward pull} & \\text{Exaggerated } x \\text{ descent} & \\text{Cardiac Tamponade} \\\\
\\mathbf{v} \\textbf{ Wave} & \\text{Right atrial passive filling against closed tricuspid} & \\mathbf{\\text{Giant / Holosystolic } v \\text{ wave (Lancisi sign)}} & \\mathbf{\\text{Severe Tricuspid Regurgitation}} \\\\
\\mathbf{y} \\textbf{ Descent} & \\text{Rapid RV early diastolic filling through open tricuspid} & \\mathbf{\\text{Steep, rapid } y \\text{ descent (Friedreich sign)}} & \\mathbf{\\text{Constrictive Pericarditis}} \\\\
& & \\mathbf{\\text{Blunted / absent } y \\text{ descent}} & \\mathbf{\\text{Cardiac Tamponade (impaired early filling)}} \\\\
\\hline
\\end{array}$$

- **JVP Measurement Geometry**:
  - Measured at $45^{\\circ}$ bed angle. Sternal angle of Louis is approximately $5\\text{ cm}$ above the right atrium regardless of position.
  - Normal JVP: $\\le 3\\text{ cm}$ above sternal angle ($5 + 3 = \\le 8\\text{ cm } H_2O$).
  - **Kussmaul Sign**: Paradoxical rise (or failure to decrease) in JVP during inspiration (normal inspiration causes JVP to fall due to negative intrathoracic pressure). Seen in **Constrictive Pericarditis**, **Restrictive Cardiomyopathy**, and **Right Ventricular Infarction**.
  - **Hepatojugular Reflux**: Sustained rise in JVP $\\ge 3\\text{ cm}$ for $\\ge 15\\text{ s}$ with firm right upper quadrant compression, indicating elevated central venous pressure.

---

## 2. Pulsus Paradoxus \u0026 Ventricular Interdependence

$$\\begin{array}{lcccc}
\\hline
\\textbf{Hemodynamic Step} & \\textbf{Physiological Mechanism} & \\textbf{Sphygmomanometric Measurement} \\\\
\\hline
\\textbf{Definition} & \\mathbf{\\text{Drop in Systolic BP } > 10\\text{ mmHg during inspiration}} & \\text{Normal inspiratory drop is } \\le 10\\text{ mmHg} \\\\
\\textbf{Pathophysiology} & \\text{Inspiration increases RV filling; inside a non-compliant} & \\mathbf{\\text{Inflate cuff } > \\text{ SBP; slowly deflate (2 mmHg/s):}} \\\\
& \\text{rigid pericardium, RV expansion shifts the interventricular} & \\text{1. Note pressure where Korotkoff I sounds appear during expiration only} \\\\
& \\text{septum leftward, compromising LV stroke volume} & \\text{2. Note pressure where sounds persist during entire respiratory cycle} \\\\
& & \\mathbf{\\Delta \\text{ Pressure } > 10\\text{ mmHg} = \\text{Pulsus Paradoxus}} \\\\
\\textbf{Clinical Causes} & \\mathbf{\\text{Cardiac Tamponade (cardinal sign), Severe Asthma/COPD, Tension Pneumothorax}} & \\mathbf{\\text{NOT seen in pure Constrictive Pericarditis}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male with metastatic lung adenocarcinoma presents with worsening exertional dyspnea, orthopnea, and distant heart sounds. Bedside examination reveals a blood pressure of 96/70 mmHg, heart rate of 118 bpm, and elevated JVP (14 cm H2O). On manual sphygmomanometry, the first Korotkoff sounds are heard at 104 mmHg during expiration only, and become audible continuously throughout both inspiration and expiration at 86 mmHg (a drop of 18 mmHg). JVP waveform inspection reveals a prominent x descent and an absent/blunted y descent.",
      question: "What is the primary hemodynamic diagnosis indicated by these bedside cardiovascular signs?",
      options: [
        "Cardiac Tamponade with significant Pulsus Paradoxus (18 mmHg drop > 10 mmHg) and blunted y descent due to pericardial fluid preventing rapid early diastolic RV ventricular filling",
        "Constrictive Pericarditis with steep y descent and Kussmaul sign",
        "Severe Tricuspid Regurgitation with giant v waves",
        "Aortic Stenosis with pulsus parvus et tardus"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic physical exam findings of Cardiac Tamponade (Beck's triad + pulsus paradoxus): (1) Pulsus Paradoxus: An inspiratory drop in systolic blood pressure of 18 mmHg (104 - 86 mmHg) exceeds the diagnostic threshold of >10 mmHg, reflecting exaggerated ventricular interdependence within a tense pericardial effusion; (2) JVP Waveform: Tamponade preserves the systolic x descent (atrial relaxation) but blunts or obliterates the diastolic y descent because high intrapericardial pressure prevents rapid early diastolic ventricular filling; (3) Differentiation: Constrictive pericarditis presents with a steep, rapid y descent (Friedreich sign) and Kussmaul sign, while tamponade presents with an absent/blunted y descent and pulsus paradoxus."
    }
  ]
};
