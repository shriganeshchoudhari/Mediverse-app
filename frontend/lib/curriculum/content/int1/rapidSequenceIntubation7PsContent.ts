/**
 * Internship Core Clinical Postings: Rapid Sequence Intubation (The 7 Ps of Airway Management)
 * Authoritative airway management content derived from Walls Manual of Emergency Airway, Tintinalli.
 * Mapped to NMC CBME Competencies: IN1.4, EM1.4, AN1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RAPID_SEQUENCE_INTUBATION_7PS_MODULE: PhysiologyLessonModule = {
  id: "int1-rapid-sequence-intubation-7ps",
  unitCode: "IN1.4",
  title: "Rapid Sequence Intubation (RSI): The 7 Ps Framework, Induction/Paralytic Pharmacology & Waveform Capnography",
  competencies: ["IN1.4", "EM1.4", "AN1.4"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Rapid Sequence Intubation (RSI) & Emergency Airway Management

RSI provides rapid, definitive airway control while minimizing the risk of pulmonary aspiration and hemodynamic collapse in critically ill emergency patients.

---

## 1. The 7 Ps of Rapid Sequence Intubation (RSI) Timeline

$$\\begin{array}{lcccc}
\\hline
\\textbf{Step / Timeline} & \\textbf{RSI \"P\" Stage} & \\textbf{Core Clinical Actions \u0026 Objectives} \\\\
\\hline
\\mathbf{T - 10\\text{ min}} & \\mathbf{\\text{1. Preparation}} & \\mathbf{\\text{SOAP ME: Suction, Oxygen, Airway gear/video laryngoscope, Pharmacy, Monitoring, Equipment}} \\\\
\\mathbf{T - 5\\text{ min}} & \\mathbf{\\text{2. Preoxygenation}} & \\mathbf{100\\% \\text{ } O_2 \\text{ via non-rebreather mask / flush nasal cannula (denitrogenation creating 8 min apnea reserve)}} \\\\
\\mathbf{T - 3\\text{ min}} & \\mathbf{\\text{3. Pretreatment}} & \\text{Fentanyl (attenuates sympathetic surge in ICP/aortic dissection), Atropine (pediatric bradycardia)} \\\\
\\mathbf{T - 0\\text{ min}} & \\mathbf{\\text{4. Paralysis with Induction}} & \\mathbf{\\text{Simultaneous rapid IV administration of INDUCTION AGENT + NEUROMUSCULAR BLOCKER}} \\\\
\\mathbf{T + 30\\text{ sec}} & \\mathbf{\\text{5. Positioning \u0026 Protection}} & \\text{Ear-to-sternal notch alignment (\"sniffing position\"); gentle external laryngeal manipulation (BURP)} \\\\
\\mathbf{T + 45\\text{ sec}} & \\mathbf{\\text{6. Placement with Proof}} & \\mathbf{\\text{Laryngoscopic tube passage through vocal cords } \\rightarrow \\mathbf{\\text{Continuous Waveform Capnography (EtCO}_2\\text{)}}} \\\\
\\mathbf{T + 1\\text{ min}} & \\mathbf{\\text{7. Post-Intubation Management}} & \\text{Secure ETT, verify CXR (3-5 cm above carina), mechanical ventilation, continuous analgesia/sedation} \\\\
\\hline
\\end{array}$$

---

## 2. RSI Induction & Neuromuscular Blocking Pharmacology

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug Class / Agent} & \\textbf{Standard IV Dosing} & \\textbf{Clinical Advantages} & \\textbf{Contraindications / Risks} \\\\
\\hline
\\textbf{Etomidate} & 0.3\\text{ mg/kg} & \\mathbf{\\text{Hemodynamically neutral (ideal in shock/trauma)}} & \\text{Transient adrenal suppression (11-}\\beta\\text{-hydroxylase inhibition)} \\\\
\\textbf{Ketamine} & 1.5-2.0\\text{ mg/kg} & \\mathbf{\\text{Bronchodilator, preserves sympathetic tone in shock/asthma}} & \\text{Emergence delirium, increases myocardial oxygen demand} \\\\
\\textbf{Propofol} & 1.5-2.5\\text{ mg/kg} & \\text{Rapid onset, potent anticonvulsant and antiemetic} & \\mathbf{\\text{Severe hypotension (vasodilation) and myocardial depression}} \\\\
\\textbf{Succinylcholine} & \\mathbf{1.5\\text{ mg/kg}} & \\mathbf{\\text{Rapid depolarizing onset (45s), short duration (6-10 min)}} & \\mathbf{\\text{Hyperkalemia (burns >24h, denervation, crush injury), MH risk}} \\\\
\\textbf{Rocuronium} & \\mathbf{1.2\\text{ mg/kg}} & \\mathbf{\\text{Rapid non-depolarizing onset (60s), NO hyperkalemia risk}} & \\text{Long duration (45-60 min); reversible by Sugammadex 16 mg/kg} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male is admitted with 40% total body surface area full-thickness burns sustained in a house fire 48 hours ago. He develops acute stridor, severe laryngeal edema, and respiratory fatigue requiring urgent endotracheal intubation. His blood pressure is 88/50 mmHg. The team prepares for Rapid Sequence Intubation (RSI).",
      question: "Which combination of induction agent and neuromuscular blocking agent is the most appropriate and safe for this patient?",
      options: [
        "Etomidate (0.3 mg/kg) or Ketamine (1.5 mg/kg) for hemodynamically stable induction PLUS Rocuronium (1.2 mg/kg) for paralysis; Succinylcholine is STRICTLY CONTRAINDICATED due to the risk of lethal hyperkalemia in burns >24 hours old",
        "Propofol (2.5 mg/kg) PLUS Succinylcholine (1.5 mg/kg)",
        "Succinylcholine monotherapy without any induction agent",
        "Midazolam (0.5 mg/kg) PLUS Vecuronium (0.01 mg/kg)"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights critical RSI pharmacotherapeutic selection: (1) Succinylcholine Contraindication: In patients with thermal burns >24 hours old, crush injuries, denervation (stroke/spinal cord trauma), or severe intra-abdominal sepsis, upregulation of extrajunctional acetylcholine receptors (gamma and alpha-7 subunits) causes an exaggerated efflux of potassium upon succinylcholine administration, leading to massive, life-threatening hyperkalemia and immediate cardiac arrest; (2) Preferred Paralytic: Rocuronium (1.2 mg/kg high dose for rapid onset in 60 seconds) is the non-depolarizing paralytic of choice without risk of hyperkalemic surge; (3) Preferred Induction: Etomidate or Ketamine provides hemodynamic stability in a patient with borderline hypotension (BP 88/50)."
    }
  ]
};
