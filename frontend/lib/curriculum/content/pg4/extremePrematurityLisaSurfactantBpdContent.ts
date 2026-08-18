/**
 * Postgraduate Advanced Pediatrics & NICU: Extreme Prematurity, LISA Surfactant & BPD
 * Authoritative neonatology content derived from European Consensus RDS Guidelines 2023, NICHD BPD Benchmarks.
 * Mapped to NMC PG CBME Competencies: PG4.3, PE3.1, PE3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const EXTREME_PREMATURITY_LISA_SURFACTANT_BPD_MODULE: PhysiologyLessonModule = {
  id: "pg4-extreme-prematurity-lisa-surfactant-bpd",
  unitCode: "PG4.3",
  title: "Extreme Prematurity: Less Invasive Surfactant Administration (LISA / MIST), CPAP & BPD Prevention",
  competencies: ["PG4.3", "PE3.1", "PE3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Extreme Prematurity, LISA Surfactant & BPD Prevention

Less Invasive Surfactant Administration (LISA) avoids endotracheal mechanical ventilation, preserving alveolar architecture in extremely low birth weight infants.

---

## 1. Less Invasive Surfactant Administration (LISA / MIST) Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Procedural Parameter} & \\textbf{Clinical Standard / Technique} & \\textbf{Clinical / Physiological Rationale} \\\\
\\hline
\\textbf{Infant Candidacy} & \\text{Preterm infant } (24-32\\text{ wks GA) breathing spontaneously} & \\mathbf{\\text{Indicated if } FiO_2 > 0.30 \\text{ on CPAP } \\ge 6\\text{ cmH}_2\\text{O}} \\\\
\\textbf{Respiratory Support} & \\mathbf{\\text{Continuous Nasal CPAP (6 - 8 cmH}_2\\text{O)}} & \\text{Maintains Functional Residual Capacity (FRC)} \\\\
\\textbf{Catheter & Surfactant} & \\mathbf{\\text{Thin 16-18G vascular catheter / feeding tube;}} & \\mathbf{\\text{Surfactant drawn into lung by infant's own}} \\\\
& \\mathbf{\\text{Poractant alfa (200 mg/kg / 2.5 mL/kg Curosurf)}} & \\mathbf{\\text{negative spontaneous inspiratory efforts}} \\\\
\\textbf{Primary Benefit} & \\mathbf{\\text{Eliminates positive-pressure mechanical ventilation}} & \\mathbf{\\text{Reduces BPD & Death by >30\\% (Cochrane)}} \\\\
\\hline
\\end{array}$$

---

## 2. Bronchopulmonary Dysplasia (BPD) Prevention Bundle

- **Diagnostic Definition**:
  - Requirement for supplemental oxygen or positive-pressure support at **$36\\text{ weeks}$ Postmenstrual Age (PMA)**.
- **Caffeine Citrate Protocol**:
  - Loading dose: **$20\\text{ mg/kg}$ IV/oral**, followed by **$5-10\\text{ mg/kg/day}$ maintenance**.
  - Stimulates medullary respiratory centers, treats apnea of prematurity, accelerates extubation, and cuts BPD rates.
- **Target Oxygen Saturations**:
  - Maintain $SpO_2$ in the **$91-95\\%$ range** (avoid hyperoxia-induced retinopathy of prematurity [ROP] and free-radical pulmonary injury).
`,
  clinicalVignettes: [
    {
      scenario: "A female infant is delivered spontaneously at 28 weeks gestation (birth weight 980 grams) and immediately placed on non-invasive nasal CPAP at 7 cmH2O with FiO2 0.35 in the delivery room. In the NICU at 45 minutes of life, she has mild intercostal retractions and an arterial blood gas reveals: pH 7.28, PaCO2 51 mmHg, and PaO2 54 mmHg on CPAP 7 cmH2O with FiO2 0.38. The neonatologist prepares to administer surfactant.",
      question: "Which surfactant delivery technique is indicated to minimize the risk of Bronchopulmonary Dysplasia (BPD), and what is the drug dosing?",
      options: [
        "Less Invasive Surfactant Administration (LISA / MIST); while the infant remains spontaneously breathing on nasal CPAP (6-8 cmH2O), a thin flexible 16-18G catheter is placed through the vocal cords under direct laryngoscopy to instill Poractant alfa (Curosurf at 200 mg/kg = 2.5 mL/kg), immediately avoiding endotracheal intubation, mechanical ventilation barotrauma, and reducing the incidence of BPD at 36 weeks PMA",
        "Perform rapid sequence intubation, connect to high-pressure volume ventilation, and paralyze for 2 weeks",
        "Withhold surfactant and give systemic dexamethasone immediately",
        "Administer surfactant via a nebulizer face mask on room air"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates modern evidence-based respiratory care in prematurity: (1) LISA Technique: In spontaneously breathing preterms failing CPAP (FiO2 >0.30), surfactant instillation via a thin catheter during spontaneous breathing allows the infant's own negative inspiratory effort to distribute surfactant without positive-pressure barotrauma; (2) Dosing: Initial dose of Poractant alfa is 200 mg/kg (2.5 mL/kg); (3) Outcome: LISA reduces mechanical ventilation days and cuts the risk of BPD at 36 weeks postmenstrual age."
    }
  ]
};
