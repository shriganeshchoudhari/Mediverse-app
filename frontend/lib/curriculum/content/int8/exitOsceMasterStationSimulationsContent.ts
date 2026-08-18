/**
 * Internship Core Clinical Postings: Exit OSCE Master Stations: Multi-Disciplinary Clinical Simulations
 * Authoritative clinical OSCE content derived from Surviving Sepsis 2026, DAS Difficult Airway 2025, WHO PPH Bundles, AHA Stroke Guidelines.
 * Mapped to NMC CBME Competencies: IN8.3, IM5.1, SU5.1, OG5.1, PE5.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const EXIT_OSCE_MASTER_STATION_SIMULATIONS_MODULE: PhysiologyLessonModule = {
  id: "int8-exit-osce-master-station-simulations",
  unitCode: "IN8.3",
  title: "Exit OSCE Master Stations: Sepsis Shock Bundle, CICO Surgical Cricothyroidotomy, PPH Bakri Tamponade & Stroke Thrombolysis",
  competencies: ["IN8.3", "IM5.1", "SU5.1", "OG5.1", "PE5.1"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Exit OSCE Master Stations: Multi-Disciplinary Resuscitation

Standardized master stations test integrated cognitive, procedural, and communication skills under simulated clinical emergencies.

---

## 1. Multi-Disciplinary Exit OSCE Master Station Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{OSCE Station} & \\textbf{Clinical Emergency Scenario} & \\textbf{Critical Timed Milestone} & \\textbf{Definitive High-Stakes Action} \\\\
\\hline
\\textbf{Station 1 (Medicine)} & \\mathbf{\\text{Septic Shock with Lactate } > 4\\text{ mmol/L}} & \\le 1\\text{ hour (Antibiotics)} & \\mathbf{30\\text{ mL/kg balanced crystalloids +}} \\\\
& \\text{and refractory hypotension} & \\le 3\\text{ hours (Fluids)} & \\mathbf{\\text{Norepinephrine titration (MAP } \\ge 65\\text{ mmHg)}} \\\\
\\textbf{Station 2 (Surgery)} & \\mathbf{\\text{\"Cannot Intubate, Cannot Oxygenate\"}} & \\mathbf{\\le 60\\text{ seconds to hypoxemic}} & \\mathbf{\\text{Emergency Scalpel-Bougie-Tube}} \\\\
& (\\mathbf{\\text{CICO Airway Crisis}}) & \\text{irreversible brain injury} & \\mathbf{\\text{Surgical Cricothyroidotomy}} \\\\
\\textbf{Station 3 (OBGYN)} & \\mathbf{\\text{Refractory Postpartum Hemorrhage (PPH)}} & \\le 15\\text{ minutes (Medical)} & \\mathbf{\\text{Uterotonic escalation } \\rightarrow} \\\\
& (\\text{Uterine Atony, EBL } > 1{,}000\\text{ mL}) & \\le 30\\text{ minutes (Tamponade)} & \\mathbf{\\text{Bakri Balloon Intrauterine Tamponade}} \\\\
\\textbf{Station 4 (Neurology)} & \\mathbf{\\text{Acute Ischemic Stroke (NIHSS 14)}} & \\mathbf{\\le 4.5\\text{ hours from last known well}} & \\mathbf{\\text{Non-contrast CT exclude bleed } \\rightarrow} \\\\
& \\text{with sudden hemiparesis \u0026 aphasia} & (\\text{Door-to-needle } \\le 45\\text{m}) & \\mathbf{\\text{IV Alteplase (} 0.9\\text{ mg/kg) or Tenecteplase}} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Surgical Cricothyroidotomy (DAS Scalpel-Bougie-Tube Protocol)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step Number} & \\textbf{Surgical Action} & \\textbf{Anatomical Landmark \u0026 Instrument} \\\\
\\hline
\\textbf{Step 1: Palpation} & \\text{\"Laryngeal Handshake\" to stabilize larynx} & \\text{Palpate cricothyroid membrane (between thyroid \u0026 cricoid cartilage)} \\\\
\\textbf{Step 2: Incision} & \\mathbf{\\text{Transverse horizontal stab incision}} & \\text{Size 10 or 20 scalpel blade through cricothyroid membrane} \\\\
\\textbf{Step 3: Rotation} & \\text{Rotate scalpel blade } 90^{\\circ} & \\text{Direct blunt edge caudally to open tracheal lumen} \\\\
\\textbf{Step 4: Bougie Insertion} & \\mathbf{\\text{Insert angled gum-elastic bougie}} & \\text{Advance bougie } 10-15\\text{ cm caudally until tracheal clicks felt} \\\\
\\textbf{Step 5: Railroading} & \\mathbf{\\text{Railroad size 6.0 mm cuffed ETT}} & \\text{Inflate cuff, confirm with capnography (EtCO2), secure tube} \\\\
\\hline
\\end{array}$$

---

## 3. PPH Uterotonic Escalation Algorithm

- **Step 1**: Bimanual uterine compression $+$ **IV Oxytocin (10-20 IU in 500 mL crystalloid)**.
- **Step 2**: **IM Methylergometrine (0.2 mg IM)** (contraindicated in hypertension/preeclampsia).
- **Step 3**: **IM Carboprost / PGF2alpha (0.25 mg IM)** (contraindicated in active bronchial asthma).
- **Step 4**: **Sublingual/Rectal Misoprostol (800-1000 mcg)**.
- **Step 5**: **Bakri Balloon Tamponade (infuse 300-500 mL warm sterile saline)**.
`,
  clinicalVignettes: [
    {
      scenario: "During an Exit OSCE master station simulation, a 32-year-old trauma victim with severe maxillofacial crush injuries and airway burns undergoes rapid sequence intubation. Direct laryngoscopy fails due to severe blood and edema (Grade 4 view). Video laryngoscopy and supraglottic airway (i-gel) insertion fail to achieve ventilation. The patient's oxygen saturation plummets from 92% to 64% with developing bradycardia (HR 42 bpm), confirming a 'Cannot Intubate, Cannot Oxygenate' (CICO) airway emergency.",
      question: "What is the mandatory immediate next action to prevent imminent hypoxic cardiac arrest?",
      options: [
        "Declare a CICO emergency and execute immediate emergency front-of-neck access (FONA) via Scalpel-Bougie-Tube Surgical Cricothyroidotomy: perform a horizontal stab incision through the cricothyroid membrane, insert a coudé-tip bougie caudally into the trachea, railroad a size 6.0 mm cuffed endotracheal tube over the bougie, inflate the cuff, and confirm ventilation with waveform capnography",
        "Attempt a 4th endotracheal intubation with a larger size 8.5 mm tube",
        "Administer IV sodium bicarbonate and wait 10 minutes",
        "Call for an elective ENT consultation without attempting emergency front-of-neck access"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates the ultimate airway crisis: (1) CICO Crisis: When both endotracheal intubation and supraglottic airway rescue fail in a paralyzed, hypoxemic patient, the DAS guidelines mandate immediate Front-Of-Neck Access (FONA); (2) Scalpel-Bougie-Tube Technique: Fast, reliable bedside surgical cricothyroidotomy (horizontal stab incision through cricothyroid membrane -> bougie insertion with tactile tracheal click confirmation -> railroading a 6.0 mm cuffed ETT); (3) Prevention of Death: FONA restores oxygenation within 30-60 seconds, preventing fatal hypoxic brain death."
    }
  ]
};
