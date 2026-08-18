/**
 * Postgraduate Advanced Obstetrics & Fetal Medicine: TTTS & Fetoscopic Laser Surgery
 * Authoritative fetal therapy content derived from Quintero Staging System, Eurofetus & Solomon Trials, SMFM Guidelines.
 * Mapped to NMC PG CBME Competencies: PG5.1, OB1.1, OB1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const MONOCHORIONIC_TTTS_FETOSCOPIC_LASER_MODULE: PhysiologyLessonModule = {
  id: "pg5-monochorionic-ttts-fetoscopic-laser",
  unitCode: "PG5.1",
  title: "Monochorionic Twin Gestations: Twin-to-Twin Transfusion Syndrome (TTTS), Quintero Staging & Solomon Laser",
  competencies: ["PG5.1", "OB1.1", "OB1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# TTTS, Quintero Staging & Fetoscopic Laser Photocoagulation

Unbalanced unidirectional arteriovenous (AV) placental anastomoses in monochorionic diamniotic (MCDA) twin gestations drive life-threatening volume dysregulation.

---

## 1. Quintero Clinical Staging of TTTS

$$\\begin{array}{lcccc}
\\hline
\\textbf{Quintero Stage} & \\textbf{Amniotic Fluid Discrepancy} & \\textbf{Donor Bladder} & \\textbf{Doppler Velocimetry} & \\textbf{Fetal Hydrops / Mortality} \\\\
\\hline
\\textbf{Stage I} & \\mathbf{\\text{Donor DVP } < 2\\text{ cm (Oligohydramnios)}} & \\mathbf{\\text{Visible / Filled}} & \\text{Normal Dopplers in both} & \\text{No hydrops} \\\\
& \\mathbf{\\text{Recipient DVP } > 8\\text{ cm (Polyhydramnios)}} & & & \\\\
\\textbf{Stage II} & \\text{Oligohydramnios / Polyhydramnios} & \\mathbf{\\text{Collapsed / Not visualized}} & \\text{Normal Dopplers} & \\text{No hydrops} \\\\
& & \\mathbf{(> 60\\text{ minutes on US})} & & \\\\
\\textbf{Stage III} & \\text{Oligohydramnios / Polyhydramnios} & \\text{Collapsed} & \\mathbf{\\text{Critically Abnormal: UA AEDF/REDF,}} & \\text{No hydrops} \\\\
& & & \\mathbf{\\text{DV reversed a-wave, or UV pulsations}} & \\\\
\\textbf{Stage IV} & \\text{Oligohydramnios / Polyhydramnios} & \\text{Collapsed} & \\text{Abnormal Dopplers} & \\mathbf{\\text{Fetal Hydrops in either twin}} \\\\
& & & & (\\text{recipient high-output failure}) \\\\
\\textbf{Stage V} & \\text{Oligohydramnios / Polyhydramnios} & \\text{Collapsed} & \\text{Absent flow} & \\mathbf{\\text{Demise of one or both fetuses}} \\\\
\\hline
\\end{array}$$

---

## 2. Fetoscopic Selective Laser Photocoagulation (Solomon Technique)

- **Timing & Eligibility**:
  - Indicated for **Quintero Stages II, III, and IV** between **$16^{+0}$ and $26^{+0}\text{ weeks}$** gestation.
- **Surgical Technique**:
  - Under local/regional anesthesia, a $3.3\text{ mm}$ curved fetoscope is inserted into the recipient\'s polyhydramniotic sac.
  - **Solomon Modification**: All communicating AV, VA, AA, and VV anastomoses along the vascular equator are selectively coagulated with a diode laser ($20-40\\text{ W}$), followed by a continuous line of photocoagulation from one placental margin to the other to functionally divide the placenta into two dichorionic units.
- **Outcome Benchmarks**:
  - Increases double twin survival to $>65-70\%$ and at least single twin survival to $>85-90\%$, while drastically reducing neurological handicap (cerebral palsy $<5\%$).
`,
  clinicalVignettes: [
    {
      scenario: "A 29-year-old primigravida at 20 weeks gestation with a monochorionic diamniotic (MCDA) twin pregnancy undergoes a routine anomaly ultrasound. Twin A (donor) demonstrates severe oligohydramnios with a maximum vertical pocket (DVP) of 1.2 cm, 'stuck twin' appearance, and the fetal bladder is completely invisible throughout the 75-minute scan. Twin B (recipient) demonstrates marked polyhydramnios with a DVP of 10.4 cm and cardiomegaly. Umbilical artery Doppler shows forward end-diastolic flow in both twins with normal Ductus Venosus tracings and no evidence of ascites or skin edema.",
      question: "What is the Quintero stage of TTTS, and what is the definitive gold-standard fetal therapeutic intervention?",
      options: [
        "Quintero Stage II TTTS (oligohydramnios/polyhydramnios sequence with persistent non-visualization of the donor fetal urinary bladder over >60 minutes, but normal Doppler velocimetry and absence of hydrops); the definitive treatment of choice is Fetoscopic Selective Laser Photocoagulation of communicating placental vessels (Solomon technique) at 16-26 weeks gestation",
        "Quintero Stage I TTTS; treat with expectant serial ultrasounds every month",
        "Quintero Stage IV TTTS; perform immediate emergency cesarean delivery at 20 weeks",
        "Twin Anemia-Polycythemia Sequence (TAPS); perform immediate maternal exchange transfusion"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates classical Quintero Staging for TTTS: (1) Stage II Criteria: Presence of oligohydramnios in donor (DVP <2 cm) + polyhydramnios in recipient (DVP >8 cm) PLUS persistent absence of donor bladder filling for >60 minutes, with preserved normal Dopplers (which would define Stage III); (2) Definitive Treatment: Fetoscopic selective laser photocoagulation of anastomoses along the vascular equator is the gold standard for Stages II-IV between 16-26 weeks, significantly outperforming serial amnioreduction."
    }
  ]
};
