/**
 * Postgraduate Advanced Pediatrics & NICU: Pediatric Septic Shock & Vasoactive-Inotropic Scores
 * Authoritative pediatric critical care content derived from Surviving Sepsis Pediatric 2024, Gaies VIS Benchmarks.
 * Mapped to NMC PG CBME Competencies: PG4.4, PE4.1, PE4.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_SEPTIC_SHOCK_VASOACTIVE_SCORES_MODULE: PhysiologyLessonModule = {
  id: "pg4-pediatric-septic-shock-vasoactive-scores",
  unitCode: "PG4.4",
  title: "Pediatric Septic Shock: Cold vs Warm Shock Phenotypes, VIS Calculations & Stress-Dose Corticosteroids",
  competencies: ["PG4.4", "PE4.1", "PE4.2"],
  estimatedMinutes: 180,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Pediatric Septic Shock, Vasoactive Scores & Resuscitation

Pediatric septic shock diverges from adult shock with distinct myocardial depression (cold shock) requiring tailored inotropic-vasopressor selections.

---

## 1. Pediatric Septic Shock Phenotypes: Cold vs Warm Shock

$$\\begin{array}{lcccc}
\\hline
\\textbf{Shock Phenotype} & \\textbf{Prevalence in Children} & \\textbf{Hemodynamics & Clinical Signs} & \\textbf{First-Line Vasoactive Agent} \\\\
\\hline
\\textbf{Cold Shock} & \\mathbf{60-70\\% \\text{ (Dominant)}} & \\mathbf{\\text{Low Cardiac Output, High SVR,}} & \\mathbf{\\text{Epinephrine (0.05 - 0.3 mcg/kg/min)}} \\\\
& & \\mathbf{\\text{Cap refill } > 3\\text{ s, cool extremities, narrow PP}} & \\text{or Dobutamine (inotrope + vasodilator)} \\\\
\\textbf{Warm Shock} & 30-40\\% & \\mathbf{\\text{High Cardiac Output, Low SVR,}} & \\mathbf{\\text{Norepinephrine (0.05 - 0.3 mcg/kg/min)}} \\\\
& & \\mathbf{\\text{Flash cap refill } < 1\\text{ s, bounding pulses, wide PP}} & \\text{(pure potent alpha-1 vasoconstrictor)} \\\\
\\hline
\\end{array}$$

---

## 2. The Vasoactive-Inotropic Score (VIS) Formulation

$$\\begin{aligned}
\\text{VIS} = \\;& \\text{Dopamine (mcg/kg/min)} + \\text{Dobutamine (mcg/kg/min)} \\\\
& + 100 \\times \\text{Epinephrine (mcg/kg/min)} \\\\
& + 100 \\times \\text{Norepinephrine (mcg/kg/min)} \\\\
& + 10{,}000 \\times \\text{Vasopressin (units/kg/min)} \\\\
& + 10 \\times \\text{Milrinone (mcg/kg/min)}
\\end{aligned}$$

- **Clinical Benchmark**:
  - **$\\text{VIS} \\ge 20$**: Strongly predictive of high in-hospital mortality, prolonged mechanical ventilation, acute renal replacement therapy, and serves as an alert threshold for **Pediatric Extracorporeal Membrane Oxygenation (ECLS / VA-ECMO)** mobilization.

---

## 3. Stress-Dose Corticosteroids in Refractory Pediatric Shock

- **Clinical Indication**:
  - Catecholamine-resistant septic shock refractory to fluid boluses and high-dose Epinephrine/Norepinephrine.
- **Drug Regimen**:
  - **Hydrocortisone**: **$50-100\\text{ mg/m}^2/\\text{day}$** (or $1-2\\text{ mg/kg}$ Q6H IV boluses) to reverse critical illness-related corticosteroid insufficiency (CIRCI).
`,
  clinicalVignettes: [
    {
      scenario: "A 4-year-old female presents to the Pediatric ICU with meningococcal septic shock. After receiving 40 mL/kg of balanced crystalloids over 30 minutes, she remains hypotensive with BP 62/34 mmHg, HR 178 bpm, prolonged capillary refill time of 4.5 seconds, cool mottled lower extremities, and weak thready peripheral pulses ('cold shock'). Bedside echocardiography shows severe left ventricular systolic dysfunction with ejection fraction of 28%.",
      question: "Which first-line vasoactive agent is indicated for pediatric cold septic shock, and what is the formula for the Vasoactive-Inotropic Score (VIS)?",
      options: [
        "Initiate a continuous infusion of Epinephrine (0.05-0.3 mcg/kg/min) as the first-line agent because cold shock is characterized by low cardiac output and high SVR requiring combined inotropy and chronotropy; the VIS is calculated as Dopamine + Dobutamine + (100 x Epinephrine) + (100 x Norepinephrine) + (10,000 x Vasopressin) + (10 x Milrinone), where a VIS >=20 denotes high-risk shock",
        "Start low-dose oral Propranolol immediately",
        "Give 5 additional liters of 0.9% normal saline without vasopressors",
        "Norepinephrine is the only permitted agent in all forms of pediatric shock"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates pediatric septic shock hemodynamic resuscitation: (1) Cold Shock: Unlike adults who typically present with warm distributive shock, 60-70% of children present with cold shock (low cardiac output, vasoconstriction, high SVR), for which Epinephrine (beta-1 inotropic + alpha-1 support) or Milrinone is first-line; (2) VIS Metric: Formulated by Gaies et al., VIS >=20 quantifies pharmacologic support intensity and predicts poor outcomes, prompting ECMO evaluation; (3) Hydrocortisone is added if shock is catecholamine-resistant."
    }
  ]
};
