/**
 * Clinical Internal Medicine: Heart Failure with Reduced Ejection Fraction (HFrEF) & 4-Pillar GDMT
 * Authoritative medical content derived from AHA/ACC/HFSA Heart Failure Guidelines, Harrison's (21st ed.).
 * Mapped to NMC CBME Competencies: IM1.3, IM1.4, MD41.2, SU39.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEART_FAILURE_REDUCED_EF_GDMT_MODULE: PhysiologyLessonModule = {
  id: "medicine-adv-heart-failure-hfref",
  unitCode: "IM3.1",
  title: "Heart Failure with Reduced Ejection Fraction (HFrEF): The 4 Foundational Pillars of GDMT",
  competencies: ["IM1.3", "IM1.4", "MD41.2", "SU39.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Heart Failure with Reduced Ejection Fraction (HFrEF): 4-Pillar GDMT

HFrEF (Left Ventricular Ejection Fraction $\\text{LVEF} \\le 40\\%$) is characterized by progressive ventricular remodeling and neurohormonal overactivation, managed by four foundational pharmacological pillars with proven mortality benefits.

---

## 1. The Four Foundational Pillars of Guideline-Directed Medical Therapy (GDMT)

$$\\begin{array}{lcccc}
\\hline
\\textbf{GDMT Pillar} & \\textbf{Representative Drug Classes} & \\textbf{Specific Recommended Agents} & \\textbf{Landmark Trial Benefit} & \\textbf{Clinical Safety Rules} \\\\
\\hline
\\textbf{1. ARNI} & \\mathbf{\\text{Angiotensin Receptor-}} & \\mathbf{\\text{Sacubitril / Valsartan}} & \\mathbf{\\text{PARADIGM-HF: } >20\\%} & \\mathbf{\\text{Mandatory 36-hour washout}} \\\\
& \\mathbf{\\text{Neprilysin Inhibitor}} & (\\text{Entresto}) & \\text{reduction in CV death \u0026 HF hosp} & \\mathbf{\\text{when switching from ACEi (Angioedema!)}} \\\\
\\textbf{2. Beta-Blocker} & \\mathbf{\\beta_1\\text{-Selective or Non-selective}} & \\mathbf{\\text{Carvedilol, Metoprolol Succinate}} & \\mathbf{\\text{MERIT-HF / COPERNICUS:}} & \\text{Initiate only when euvolemic;} \\\\
& \\text{with vasodilating properties} & (\\text{NOT Tartrate!), Bisoprolol} & >30\\% \\text{ mortality reduction} & \\text{start low and titrate slowly} \\\\
\\textbf{3. MRA} & \\mathbf{\\text{Mineralocorticoid Receptor}} & \\mathbf{\\text{Spironolactone, Eplerenone}} & \\mathbf{\\text{RALES / EMPHASIS-HF:}} & \\text{Monitor } K^+ \\text{ and creatinine;} \\\\
& \\text{Antagonists (Aldosterone block)} & & >30\\% \\text{ mortality reduction} & \\text{avoid if } K^+ > 5.0\\text{ or eGFR } < 30 \\\\
\\textbf{4. SGLT2i} & \\mathbf{\\text{Sodium-Glucose Cotransporter-2}} & \\mathbf{\\text{Dapagliflozin, Empagliflozin}} & \\mathbf{\\text{DAPA-HF / EMPEROR-Reduced:}} & \\text{Cardiorenal protection} \\\\
& \\text{Inhibitors} & & >25\\% \\text{ reduction in CV death/HF} & \\mathbf{\\text{REGARDLESS of diabetes status!}} \\\\
\\hline
\\end{array}$$

---

## 2. Advanced HFrEF Device & Pharmacological Escalations

- **Hydralazine + Isosorbide Dinitrate (BiDil)**: Added to 4-pillar GDMT in African American patients with NYHA class III-IV symptoms (A-HeFT trial).
- **Ivabradine**: $I_f$ funny channel inhibitor indicated for patients in sinus rhythm with resting heart rate $\ge 70\text{ bpm}$ despite maximally tolerated beta-blocker therapy (SHIFT trial).
- **Vericiguat**: Soluble guanylate cyclase (sGC) stimulator for high-risk patients following a recent HF hospitalization (VICTORIA trial).
- **Implantable Cardioverter-Defibrillator (ICD)**: Indicated for primary prevention of sudden cardiac death in ischemic or non-ischemic cardiomyopathy with $\text{LVEF} \le 35\%$ after at least $3\text{ months}$ of optimal GDMT.
- **Cardiac Resynchronization Therapy (CRT)**: Biventricular pacing indicated for $\text{LVEF} \le 35\%$, NYHA class II-IV symptoms, sinus rhythm, and **Left Bundle Branch Block (LBBB) with QRS duration } \\ge 150\\text{ ms}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old female with non-ischemic dilated cardiomyopathy (echocardiogram shows left ventricular ejection fraction of 28%) and NYHA class II symptoms is currently taking Lisinopril 20 mg daily, Metoprolol Succinate 100 mg daily, and Furosemide 40 mg daily. Blood pressure is 124/76 mmHg, heart rate is 68 bpm, serum potassium is 4.2 mEq/L, and eGFR is 62 mL/min/1.73m2. The cardiology team decides to upgrade her renin-angiotensin inhibition to Sacubitril/Valsartan (ARNI) and complete her 4-pillar GDMT regimen.",
      question: "Which of the following clinical transition protocols and additions is mandatory according to current AHA/ACC/HFSA heart failure guidelines?",
      options: [
        "Withhold Lisinopril for at least 36 hours prior to initiating Sacubitril/Valsartan to prevent life-threatening angioedema, and initiate Spironolactone (MRA) plus Dapagliflozin (SGLT2i)",
        "Start Sacubitril/Valsartan immediately without stopping Lisinopril",
        "Switch Metoprolol Succinate to Metoprolol Tartrate",
        "Discontinue all beta-blocker therapy before starting an SGLT2 inhibitor"
      ],
      correctAnswerIndex: 0,
      explanation: "According to AHA/ACC/HFSA guidelines: (1) When switching a patient from an ACE inhibitor (Lisinopril) to an ARNI (Sacubitril/Valsartan), a mandatory 36-hour washout period is strictly required because simultaneous inhibition of both ACE and Neprilysin causes severe accumulation of bradykinin, dramatically increasing the risk of fatal angioedema; (2) The contemporary gold standard 4-pillar GDMT regimen for HFrEF (LVEF <=40%) consists of: [1] ARNI (preferred over ACEi/ARB); [2] Evidence-based Beta-blocker (Metoprolol Succinate, Carvedilol, or Bisoprolol); [3] MRA (Spironolactone or Eplerenone); and [4] SGLT2 inhibitor (Dapagliflozin or Empagliflozin), all of which independently reduce all-cause mortality and heart failure hospitalizations."
    }
  ]
};
