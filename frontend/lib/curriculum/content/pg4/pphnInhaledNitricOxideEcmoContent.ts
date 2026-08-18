/**
 * Postgraduate Advanced Pediatrics & NICU: PPHN, Inhaled Nitric Oxide & Neonatal ECMO
 * Authoritative neonatology content derived from AHA/ATS PPHN Guidelines, Cochrane iNO Reviews.
 * Mapped to NMC PG CBME Competencies: PG4.2, PE2.1, PE2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PPHN_INHALED_NITRIC_OXIDE_ECMO_MODULE: PhysiologyLessonModule = {
  id: "pg4-pphn-inhaled-nitric-oxide-ecmo",
  unitCode: "PG4.2",
  title: "Persistent Pulmonary Hypertension of the Newborn (PPHN): Pre/Post-Ductal SpO2, Oxygenation Index & iNO",
  competencies: ["PG4.2", "PE2.1", "PE2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# PPHN, Inhaled Nitric Oxide (iNO) & Neonatal ECMO

Failure of postnatal pulmonary vascular resistance transition causes massive extrapulmonary right-to-left shunting and refractory hypoxemia.

---

## 1. PPHN Hemodynamics & Diagnostic Indicators

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Assessment} & \\textbf{Hemodynamic Calculation / Criteria} & \\textbf{Clinical Interpretation} \\\\
\\hline
\\textbf{Pre- vs Post-Ductal } SpO_2 & \\mathbf{\\text{Right Hand (Pre-ductal) vs Foot (Post-ductal)}} & \\mathbf{\\Delta SpO_2 \\ge 10\\% \\text{ (or } \\Delta PaO_2 \\ge 20\\text{ mmHg)}} \\\\
& & \\text{proves massive right-to-left shunt across PDA} \\\\
\\textbf{Oxygenation Index (OI)} & \\mathbf{\\text{OI} = \\frac{\\text{Mean Airway Pressure (MAP)} \\times FiO_2 \\times 100}{PaO_2}} & \\text{Quantifies severity of hypoxemic respiratory failure} \\\\
\\textbf{OI } \\ge 25 & \\text{Severe PPHN} & \\mathbf{\\text{Indication for Inhaled Nitric Oxide (iNO 20 ppm)}} \\\\
\\textbf{OI } \\ge 40 & \\mathbf{\\text{Critical Refractory Failure (Mortality } >50\\%\\text{)}} & \\mathbf{\\text{Indication for Neonatal Veno-Arterial (VA) ECMO}} \\\\
\\hline
\\end{array}$$

---

## 2. Inhaled Nitric Oxide (iNO) Therapy & Weaning Protocol

- **Starting Dosage**: **$20\\text{ ppm}$** (parts per million).
  - Selectively dilates ventilated pulmonary arterioles via cyclic GMP activation without inducing systemic hypotension.
- **Positive Response**:
  - Defined as an increase in **$PaO_2 > 20\\text{ mmHg}$** or a **$\\ge 20\\%$ reduction in Oxygenation Index** within 30-60 minutes.
- **Weaning Protocol**:
  - Once $FiO_2 < 0.60$ and $\\text{OI} < 10$, decrease iNO in decrements ($20 \\rightarrow 15 \\rightarrow 10 \\rightarrow 5 \\rightarrow 1\\text{ ppm}$) before discontinuing to prevent rebound pulmonary vasoconstriction.
- **Toxicology Monitoring**:
  - Monitor **Methemoglobin levels** (keep $\\text{MetHb} < 2.5\\%$) and ambient nitrogen dioxide ($NO_2 < 0.5\\text{ ppm}$).
`,
  clinicalVignettes: [
    {
      scenario: "A term female newborn with severe meconium aspiration syndrome is intubated on high-frequency oscillatory ventilation (Mean Airway Pressure = 22 cmH2O, FiO2 = 1.00). Pre-ductal SpO2 on the right wrist is 94%, while post-ductal SpO2 on the left foot is 78% (a difference of 16%). Arterial blood gas reveals: pH 7.24, PaCO2 48 mmHg, and PaO2 45 mmHg. The calculated Oxygenation Index is 48.8.",
      question: "What is the diagnosis, what does the pre/post-ductal difference prove, and what immediate interventions are indicated?",
      options: [
        "Severe Persistent Pulmonary Hypertension of the Newborn (PPHN); the >=10% pre-to-post-ductal saturation gradient proves massive right-to-left extrapulmonary shunting across a patent ductus arteriosus (PDA); because the Oxygenation Index is >25 (calculated OI = 48.8, exceeding the >=40 critical threshold), immediate therapy requires initiating Inhaled Nitric Oxide (iNO at 20 ppm) while concurrently mobilizing the Neonatal ECMO team for emergent Veno-Arterial (VA) ECMO cannulation",
        "Mild transient tachypnea of the newborn; wean to room air",
        "Tetralogy of Fallot; start IV Prostaglandin E1 only",
        "Spontaneous pneumothorax; perform needle thoracostomy only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates severe neonatal PPHN: (1) Pre/Post-ductal Saturation Difference: A gradient of >=10% confirms elevated pulmonary artery pressure forcing deoxygenated blood across the ductus arteriosus into the descending aorta; (2) Oxygenation Index: Calculated as (MAP x FiO2 x 100) / PaO2 = (22 x 1.0 x 100) / 45 = 48.8; (3) Intervention Hierarchy: An OI >=25 triggers immediate iNO (20 ppm), while an OI >=40 with failure to respond to iNO triggers emergent neonatal ECMO."
    }
  ]
};
