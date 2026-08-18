/**
 * Postgraduate Advanced Anesthesiology: ERAS & Multimodal Opioid-Sparing Analgesia
 * Authoritative perioperative medicine content derived from ERAS Society Guidelines, PROSPECT Analgesia Protocols.
 * Mapped to NMC PG CBME Competencies: PG6.4, AN4.1, AN4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE: PhysiologyLessonModule = {
  id: "pg6-eras-multimodal-opioid-sparing-analgesia",
  unitCode: "PG6.4",
  title: "Enhanced Recovery After Surgery (ERAS): Goal-Directed Fluid Therapy (GDFT), Ketamine & Fascial Blocks",
  competencies: ["PG6.4", "AN4.1", "AN4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# ERAS Pathways, Goal-Directed Fluid Therapy & Multimodal Analgesia

ERAS programs integrate evidence-based perioperative care bundles to attenuate surgical stress, preserve organ function, and minimize opioid-related complications.

---

## 1. ERAS Pathway Pillars & Goal-Directed Fluid Therapy (GDFT)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Perioperative Phase} & \\textbf{ERAS Core Interventions} & \\textbf{Clinical Standard / Target Goal} & \\textbf{Physiological Rationale} \\\\
\\hline
\\textbf{Preoperative} & \\mathbf{\\text{Preoperative Carbohydrate Loading}} & \\mathbf{\\text{Clear carb beverage 2h before induction}} & \\text{Reduces postoperative insulin resistance} \\\\
& \\text{No prolonged fasting} & (45\\text{ g complex maltodextrin}) & \\text{and prevents muscle catabolism} \\\\
\\textbf{Intraoperative GDFT} & \\mathbf{\\text{Dynamic Hemodynamic Fluid Optimization}} & \\mathbf{\\text{Stroke Volume Variation (SVV) } < 10-12\\%} & \\mathbf{\\text{Avoids crystalloid overload (gut edema)}} \\\\
& (\\text{pulse contour analysis / Doppler}) & \\mathbf{\\text{or Pulse Pressure Variation (PPV) } < 13\\%} & \\mathbf{\\& \\text{ prevents organ hypoperfusion}} \\\\
\\textbf{Temperature Control} & \\mathbf{\\text{Active Normothermia Maintenance}} & \\mathbf{\\text{Core temperature } > 36.0^{\\circ}\\text{C throughout}} & \\text{Prevents coagulopathy and SSI} \\\\
\\textbf{Postoperative} & \\mathbf{\\text{Early Enteral Nutrition \\& Mobilization}} & \\mathbf{\\text{Oral fluids within 4h, ambulate at 12-24h}} & \\text{Stimulates peristalsis, reduces DVT} \\\\
\\hline
\\end{array}$$

---

## 2. Multimodal Opioid-Sparing Analgesic Bundle

- **Intravenous Systemic Lidocaine Infusion**:
  - Bolus: **$1.5\\text{ mg/kg}$ IV over 10 minutes**, followed by **$1.5-2.0\\text{ mg/kg/hr}$ continuous infusion** throughout surgery until PACU discharge.
  - Blocks visceral peritoneal nociception, suppresses inflammatory cytokine release ($IL-6, TNF-\\alpha$), and shortens time to first flatus/bowel movement.
- **Subanesthetic Ketamine Infusion**:
  - Loading: **$0.25-0.5\\text{ mg/kg}$ IV**, maintenance: **$0.1-0.2\\text{ mg/kg/hr}$**.
  - Non-competitive NMDA receptor antagonist that prevents dorsal horn wind-up, opioid tolerance, and hyperalgesia.
- **Regional Fascial Plane Blocks**:
  - **Erector Spinae Plane (ESP)**, **TAP**, or **Thoracic Epidural (TEA)** blocks provide dense somatic and visceral analgesia, cutting opioid requirements by $>50-70\%$.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old female is scheduled for elective open right hemicolectomy for colon adenocarcinoma within an established Enhanced Recovery After Surgery (ERAS) protocol. She consumed a clear carbohydrate maltodextrin beverage 2.5 hours prior to surgery. In the operating room, an ultrasound-guided bilateral Erector Spinae Plane (ESP) block is placed at T8 with 20 mL 0.25% Ropivacaine per side. Intraoperatively, she receives an arterial line connected to a pulse contour cardiac output monitor, an IV lidocaine infusion at 1.5 mg/kg/hr, and subanesthetic ketamine at 0.15 mg/kg/hr.",
      question: "What is the hemodynamic goal for intraoperative Goal-Directed Fluid Therapy (GDFT), and what are the specific benefits of systemic IV lidocaine within ERAS?",
      options: [
        "Maintain Stroke Volume Variation (SVV) <10-12% or Pulse Pressure Variation (PPV) <13% to optimize cardiac stroke volume while strictly preventing crystalloid volume overload and gut wall edema; IV lidocaine infusion provides systemic anti-inflammatory analgesia, suppresses peritoneal visceral pain, significantly reduces opioid consumption, and accelerates return of bowel function to prevent postoperative ileus",
        "Infuse 6 liters of 0.9% normal saline unconditionally to maximize central venous pressure >18 mmHg",
        "Maintain patient core temperature below 34°C to minimize surgical bleeding",
        "Administer high-dose continuous fentanyl infusions without any regional blocks or non-opioid adjuncts"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates gold-standard ERAS perioperative anesthetic execution: (1) GDFT: Using dynamic indicators (SVV <10-12%, PPV <13%) guides fluid boluses based on the Frank-Starling curve, avoiding excessive fluid that causes anastomotic edema, wound dehiscence, and ileus; (2) Systemic Lidocaine: Acts as an anti-inflammatory and visceral analgesic, proven in Cochrane reviews to accelerate gastrointestinal recovery and reduce hospital length of stay; (3) Preoperative carbs prevent catabolism and regional ESP blocks provide dense opioid-sparing analgesia."
    }
  ]
};
