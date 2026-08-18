/**
 * Postgraduate Advanced Obstetrics & Maternal Critical Care: Resuscitative Hysterotomy & PMCD
 * Authoritative obstetric resuscitation content derived from AHA Maternal Cardiac Arrest Guidelines, SMFM / ACOG PMCD Protocols.
 * Mapped to NMC PG CBME Competencies: PG5.4, OB4.1, OB4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RESUSCITATIVE_HYSTEROTOMY_PMCD_ARREST_MODULE: PhysiologyLessonModule = {
  id: "pg5-resuscitative-hysterotomy-pmcd-arrest",
  unitCode: "PG5.4",
  title: "Resuscitative Hysterotomy (PMCD): The 4-Minute Rule, Aortocaval Decompression & Maternal CPR",
  competencies: ["PG5.4", "OB4.1", "OB4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Resuscitative Hysterotomy (Peri-Mortem Cesarean Delivery - PMCD)

Resuscitative hysterotomy is primarily a maternal resuscitation procedure executed to relieve fatal aortocaval compression and restore maternal venous return.

---

## 1. Physiological Basis & The 4-Minute Rule

$$\\begin{array}{lcccc}
\\hline
\\textbf{Parameter} & \\textbf{Clinical Standard / Protocol Target} & \\textbf{Physiological Rationale} \\\\
\\hline
\\textbf{Gestational Age Threshold} & \\mathbf{\\ge 20\\text{ weeks (Fundus at/above Umbilicus)}} & \\mathbf{\\text{Uterus compresses IVC/Aorta, reducing venous}} \\\\
& & \\mathbf{\\text{return by up to } 60\\% \\text{ and nullifying CPR}} \\\\
\\textbf{Continuous Left Uterine} & \\mathbf{\\text{Manual Left Lateral Uterine Displacement (LUD)}} & \\text{Displaces gravid uterus off retroperitoneal vessels} \\\\
\\textbf{Displacement (LUD)} & & \\text{without tilting chest compression axis} \\\\
\\textbf{Decision-to-Incision} & \\mathbf{4\\text{ minutes of refractory maternal cardiac arrest}} & \\text{If no ROSC at 4 min, begin immediate laparotomy} \\\\
\\textbf{Delivery Benchmark} & \\mathbf{\\text{Complete fetal extraction by } 5\\text{ minutes}} & \\mathbf{\\text{Immediate relief of IVC obstruction increases}} \\\\
& & \\mathbf{\\text{maternal cardiac output by } 30-40\\% \\rightarrow \\text{ROSC}} \\\\
\\hline
\\end{array}$$

---

## 2. Procedural Execution: Bedside Surgical Standards

- **Location**:
  - Perform **where the arrest occurs** (Labor & Delivery room, Emergency Department, or ICU); **NEVER delay resuscitation by transporting the patient to the Operating Room**.
- **Preparation**:
  - **No antiseptic skin prep, no sterile drapes, and no waiting for surgical instrumentation or anesthesia**.
- **Incision**:
  - Rapid midline vertical skin incision from symphysis pubis toward umbilicus with a scalpel; open peritoneal cavity; vertical hysterotomy incision into lower uterine segment; deliver infant and placenta; pack uterus.
- **CPR Continuity**:
  - Uninterrupted high-quality chest compressions ($100-120\\text{/min}$, depth $\\ge 5\\text{ cm}$, hands placed slightly higher on sternum due to upward diaphragmatic elevation).
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old primigravida at 32 weeks gestation collapses in the emergency department waiting room with sudden witnessed asystolic cardiac arrest. High-quality CPR is initiated with continuous manual left uterine displacement (LUD), bag-valve-mask ventilation with 100% O2, and IV epinephrine 1 mg is administered. At 4 minutes of resuscitation, there is no return of spontaneous circulation (ROSC) and CPR remains in progress.",
      question: "What is the mandatory next step in management according to maternal resuscitation guidelines, and what is the target delivery time?",
      options: [
        "Perform an immediate bedside Resuscitative Hysterotomy (Peri-Mortem Cesarean Delivery - PMCD) directly in the emergency department without transferring to an operating room or waiting for sterile drapes/anesthesia, aiming for complete fetal extraction within 5 minutes of arrest to decompress the inferior vena cava and restore maternal cardiac output for ROSC",
        "Transport the patient across the hospital to the main surgical operating room suite",
        "Wait for a formal obstetric ultrasound to confirm fetal heart rate before considering surgery",
        "Continue chest compressions for 45 minutes before considering any surgical intervention"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates the critical time-sensitive mandate of Resuscitative Hysterotomy: (1) The 4-Minute Rule: If maternal cardiac arrest at >=20 weeks gestation does not achieve ROSC within 4 minutes of CPR, resuscitative hysterotomy must begin immediately at the bedside; (2) The 5-Minute Delivery Goal: Extracting the fetus by 5 minutes eliminates aortocaval compression, instantly restoring up to 40% of maternal venous return and offering the highest chance of maternal neurological survival and ROSC."
    }
  ]
};
