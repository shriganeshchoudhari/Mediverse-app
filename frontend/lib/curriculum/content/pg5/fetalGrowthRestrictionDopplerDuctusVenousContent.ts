/**
 * Postgraduate Advanced Obstetrics & Fetal Medicine: FGR, Doppler Velocimetry & Delivery Triggers
 * Authoritative fetal medicine content derived from TRUFFLE Trial, SMFM FGR Guidelines, ISUOG Doppler Protocols.
 * Mapped to NMC PG CBME Competencies: PG5.2, OB2.1, OB2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FETAL_GROWTH_RESTRICTION_DOPPLER_DUCTUS_VENOUS_MODULE: PhysiologyLessonModule = {
  id: "pg5-fetal-growth-restriction-doppler-ductus-venous",
  unitCode: "PG5.2",
  title: "Early-Onset Fetal Growth Restriction (FGR): Umbilical Artery AREDF, MCA Brain Sparing & Ductus Venosus",
  competencies: ["PG5.2", "OB2.1", "OB2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Early-Onset FGR & Longitudinal Doppler Velocimetry

Placental villous vascular obliteration progresses predictably from the umbilical artery to cerebral vasodilation and precordial venous failure.

---

## 1. Longitudinal Doppler Progression & Delivery Benchmarks

$$\\begin{array}{lcccc}
\\hline
\\textbf{Vascular Bed} & \\textbf{Doppler Waveform Pattern} & \\textbf{Physiological Mechanism} & \\textbf{Delivery Trigger / Action} \\\\
\\hline
\\textbf{Umbilical Artery (UA)} & \\text{Elevated Pulsatility Index (PI } > 95\\text{th\\%)} & \\text{Placental vascular resistance rise} & \\text{Twice weekly Doppler monitoring} \\\\
\\textbf{UA AEDF} & \\mathbf{\\text{Absent End-Diastolic Flow}} & \\mathbf{> 50-60\\% \\text{ placental vascular bed obliterated}} & \\mathbf{\\text{Deliver at } 33-34\\text{ wks (after steroids)}} \\\\
\\textbf{UA REDF} & \\mathbf{\\text{Reversed End-Diastolic Flow}} & \\mathbf{> 70\\% \\text{ placental obliteration; extreme afterload}} & \\mathbf{\\text{Deliver at } 30-32\\text{ wks (after steroids)}} \\\\
\\textbf{Middle Cerebral (MCA)} & \\mathbf{\\text{Low PI (} < 5\\text{th\\%}) \\text{; CPR } < 1.08} & \\mathbf{\\text{Brain-Sparing Autoregulation (Hypoxia)}} & \\text{Close surveillance for venous decompensation} \\\\
\\textbf{Ductus Venosus (DV)} & \\mathbf{\\text{Absent or Reversed a-Wave}} & \\mathbf{\\text{Severe Right Ventricular Diastolic Failure}} & \\mathbf{\\text{EMERGENCY DELIVERY at } \\ge 26-28\\text{ wks}} \\\\
& \\mathbf{(\\text{during atrial contraction)}} & \\mathbf{\\& \\text{ Metabolic Acidemia (TRUFFLE Trial)}} & \\mathbf{(\\text{after Betamethasone rescue})} \\\\
\\hline
\\end{array}$$

---

## 2. The TRUFFLE Trial Paradigm

- **Key Evidence**:
  - Waiting for **Ductus Venosus (DV) late changes (absent/reversed a-wave)** or computerized CTG short-term variation (STV $<3.5\\text{ ms}$) prior to delivery between $26$ and $32\\text{ weeks}$ maximizes neurological intact survival without increasing stillbirth rates compared to early delivery based solely on arterial umbilical waveforms.
- **Antenatal Corticosteroids & Magnesium Sulfate**:
  - Administer **Betamethasone ($12\\text{ mg}$ IM Q24H $\\times 2$ doses)** for lung maturation and **Magnesium Sulfate ($4\\text{ g}$ IV load $+ 1\\text{ g/h}$ infusion)** for neuroprotection against cerebral palsy if delivery occurs at $<32\\text{ weeks}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old multigravida at 29 weeks gestation is admitted with severe early-onset fetal growth restriction (estimated fetal weight 720g, <3rd percentile). Fetal Doppler velocimetry reveals: Umbilical Artery shows Reversed End-Diastolic Flow (REDF), Middle Cerebral Artery shows marked vasodilation with PI of 0.88 (<5th percentile, confirming brain sparing), and Ductus Venosus Doppler demonstrates persistent Reversed a-Wave during atrial systole. Computerized cardiotocography reveals a baseline fetal heart rate of 135 bpm with reduced short-term variation (STV = 2.8 ms).",
      question: "What is the clinical interpretation of the Ductus Venosus reversed a-wave, and what is the definitive obstetric management?",
      options: [
        "Ductus Venosus reversed a-wave indicates severe right ventricular myocardial diastolic failure and severe fetal metabolic acidemia; according to the TRUFFLE trial guidelines, this is an absolute trigger for Emergency Delivery via Cesarean section following immediate administration of antenatal corticosteroids (Betamethasone 12 mg IM) and Magnesium Sulfate for fetal neuroprotection",
        "Expectant outpatient management until 38 weeks gestation",
        "The Ductus Venosus finding is normal; start maternal bed rest only",
        "Perform immediate fetal exchange transfusion for Rh isoimmunization"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates critical early-onset FGR Doppler progression: (1) Pathophysiology: Umbilical artery REDF indicates >70% placental bed obliteration, and MCA vasodilation reflects brain-sparing autoregulation. However, Ductus Venosus a-wave reversal reflects backward transmission of elevated right atrial pressure during myocardial failure and severe acidosis; (2) Delivery Trigger: In the TRUFFLE trial, DV a-wave reversal at >=26-28 weeks represents the ultimate safety boundary mandating emergency delivery to prevent intrauterine fetal demise."
    }
  ]
};
