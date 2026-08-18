/**
 * Clinical Obgyn Advanced: Electronic Fetal Monitoring (EFM) & Intrapartum FHR
 * Authoritative obstetric content derived from Williams Obstetrics (26th ed.), NICHD / ACOG EFM Guidelines.
 * Mapped to NMC CBME Competencies: OG5.1, OG5.2, MD44.3, SU42.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ELECTRONIC_FETAL_MONITORING_CATEGORIES_MODULE: PhysiologyLessonModule = {
  id: "obgyn-adv-fetal-monitoring-efm",
  unitCode: "OG5.1",
  title: "Electronic Fetal Monitoring (EFM): NICHD Categories I-III, Decelerations (VEAL CHOP) & Resuscitation",
  competencies: ["OG5.1", "OG5.2", "MD44.3", "SU42.3"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Electronic Fetal Monitoring (EFM): NICHD Categories & Decelerations

Intrapartum Electronic Fetal Monitoring tracks fetal heart rate patterns and uterine contractions to evaluate fetal oxygenation and guide intrapartum resuscitation.

---

## 1. NICHD Three-Tier Fetal Heart Rate Classification

$$\\begin{array}{lccc}
\\hline
\\textbf{NICHD Category} & \\textbf{Baseline FHR \u0026 Variability} & \\textbf{Decelerations / Accelerations} & \\textbf{Clinical Action Mandate} \\\\
\\hline
\\textbf{Category I} & \\mathbf{\\text{Baseline: } 110 - 160\\text{ bpm}} & \\text{Early decelerations present/absent;} & \\mathbf{\\text{Normal / Reassuring;}} \\\\
\\textbf{(Normal)} & \\mathbf{\\text{Moderate variability } (6 - 25\\text{ bpm})} & \\mathbf{\\text{ABSENT late or variable decelerations;}} & \\text{predicts normal fetal acid-base;} \\\\
& & \\text{accelerations present or absent} & \\text{routine intrapartum care} \\\\
\\textbf{Category II} & \\text{Bradycardia with variability,} & \\text{Recurrent variable decelerations,} & \\mathbf{\\text{Indeterminate / Equivocal;}} \\\\
\\textbf{(Indeterminate)} & \\text{tachycardia, minimal variability } (<5), & \\text{prolonged deceleration } (2 - 10\\text{ min}), & \\text{initiate intrauterine resuscitation} \\\\
& \\text{or marked variability } (>25\\text{ bpm}) & \\text{absent accelerations after scalp stim} & \\text{and continuous surveillance} \\\\
\\textbf{Category III} & \\mathbf{\\text{ABSENT baseline variability PLUS:}} & \\mathbf{\\text{Recurrent late decelerations,}} & \\mathbf{\\text{Abnormal / High Acidemia Risk;}} \\\\
\\textbf{(Abnormal)} & \\text{Minimal/no fluctuation} & \\mathbf{\\text{Recurrent variable decelerations,}} & \\mathbf{\\text{Immediate intrauterine resuscitation;}} \\\\
& \\mathbf{\\text{OR Sinusoidal Pattern}} & \\mathbf{\\text{OR persistent fetal bradycardia}} & \\mathbf{\\text{Emergency Operative Delivery (Cesarean)}} \\\\
\\hline
\\end{array}$$

---

## 2. Deceleration Patterns & Pathophysiology (VEAL CHOP)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Deceleration Pattern} & \\textbf{Temporal Waveform Characteristics} & \\textbf{Physiologic Etiology} & \\textbf{Clinical Significance} & \\textbf{Immediate Intervention} \\\\
\\hline
\\textbf{V: Variable} & \\mathbf{\\text{Abrupt onset } (<30\\text{s to nadir}),} & \\mathbf{\\text{C: Cord Compression}} & \\text{Baroreceptor-mediated vagal} & \\mathbf{\\text{Maternal position change}} \\\\
& \\text{depth } \\ge 15\\text{ bpm lasting } \\ge 15\\text{s} & & \\text{reflex; recurrent } \\rightarrow \\text{ acidemia} & (\\text{left/right lateral) } \\pm \\text{ Amnioinfusion} \\\\
\\textbf{E: Early} & \\mathbf{\\text{Gradual onset } (\\ge 30\\text{s to nadir}),} & \\mathbf{\\text{H: Head Compression}} & \\text{Physiologic vagal stimulation} & \\mathbf{\\text{Benign / Reassuring;}} \\\\
& \\mathbf{\\text{nadir MIRRORS peak of contraction}} & & (\\text{active labor descent}) & \\text{continue labor monitoring} \\\\
\\textbf{A: Accelerations} & \\mathbf{\\ge 15\\text{ bpm above baseline for } \\ge 15\\text{s}} & \\mathbf{\\text{O: Oxygenated / Ok}} & \\text{Sympathetic fetal movement} & \\text{Rules out fetal acidemia} \\\\
\\textbf{L: Late} & \\mathbf{\\text{Gradual onset } (\\ge 30\\text{s to nadir}),} & \\mathbf{\\text{P: Placental Insufficiency}} & \\text{Fetal chemoreceptor hypoxia;} & \\mathbf{\\text{Intrauterine Resuscitation}} \\\\
& \\mathbf{\\text{nadir occurs AFTER peak of contraction}} & (\\text{hypoperfusion, tachysystole}) & \\text{recurrent } \\rightarrow \\text{ metabolic acidemia} & (\\text{Discontinue Oxytocin, Oxygen, IVF}) \\\\
\\hline
\\end{array}$$

- **Sinusoidal FHR Pattern**: Smooth, undulating, sine wave-like undulating baseline with regular frequency ($3-5\text{ cycles/min}$) and amplitude ($5-15\text{ bpm}$) persisting for $\ge 20\text{ minutes}$, pathognomonic for **Severe Fetal Anemia** (feto-maternal hemorrhage, Rh alloimmunization, parvovirus B19) or severe hypoxia.
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old G1P0 female at 40 weeks gestation is in active labor receiving intravenous Oxytocin augmentation. Continuous electronic fetal monitoring demonstrates a baseline fetal heart rate of 145 bpm with absent baseline FHR variability. Over the last 30 minutes, recurrent gradual decelerations are observed whose onset, nadir, and recovery occur consistently after the beginning, peak, and end of each uterine contraction (nadir occurs 40 seconds after contraction peak). Despite stopping oxytocin, turning the mother to the left lateral position, providing a 1,000 mL IV fluid bolus, and administering 10 L/min oxygen via non-rebreather mask, the tracing shows persistent absent variability with recurrent late decelerations.",
      question: "According to NICHD criteria, what is this fetal heart rate category, what is the underlying pathophysiology, and what is the definitive obstetric management?",
      options: [
        "NICHD Category III (Abnormal) Fetal Heart Rate Tracing; reflects acute fetal hypoxemia and acidemia from uteroplacental insufficiency; proceed with immediate emergency operative delivery (Cesarean section)",
        "NICHD Category I (Normal) Tracing; reflects benign head compression during pelvic descent; continue routine labor",
        "NICHD Category II Tracing; perform routine artificial rupture of membranes",
        "Sinusoidal pattern secondary to physiologic fetal sleep cycle"
      ],
      correctAnswerIndex: 0,
      explanation: "This tracing meets the strict criteria for a NICHD Category III (Abnormal / Non-Reassuring) FHR tracing due to the combination of Absent Baseline Variability PLUS Recurrent Late Decelerations. Late decelerations (nadir occurring after the contraction peak) are caused by uteroplacental insufficiency and fetal chemoreceptor activation in response to transient hypoxemia. When accompanied by absent baseline variability, Category III tracings are strongly predictive of abnormal fetal acid-base status (metabolic acidemia and asphyxia). When intrauterine resuscitation measures fail, immediate emergent operative delivery (Cesarean delivery or operative vaginal delivery if fully dilated and low station) is mandatory to prevent stillbirth or neurological injury."
    }
  ]
};
