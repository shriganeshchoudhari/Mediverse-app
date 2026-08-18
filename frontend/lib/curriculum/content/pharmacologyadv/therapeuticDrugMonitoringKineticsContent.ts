/**
 * Clinical Pharmacology: Pharmacokinetics, Therapeutic Drug Monitoring & Non-Linear Elimination
 * Authoritative medical content derived from Goodman & Gilman's (14th ed.), Katzung's Basic & Clinical Pharmacology.
 * Mapped to NMC CBME Competencies: PH1.1, PH1.2, MD37.1, SU35.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THERAPEUTIC_DRUG_MONITORING_KINETICS_MODULE: PhysiologyLessonModule = {
  id: "pharmacology-adv-tdm-kinetics",
  unitCode: "PH1.1",
  title: "Therapeutic Drug Monitoring (TDM): Vancomycin AUC/MIC, Aminoglycosides & Zero-Order Phenytoin",
  competencies: ["PH1.1", "PH1.2", "MD37.1", "SU35.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RENAL",
  markdownContent: `
# Therapeutic Drug Monitoring (TDM) & Non-Linear Pharmacokinetics

Drugs with a narrow therapeutic index require precise therapeutic drug monitoring (TDM) to maximize clinical efficacy while preventing life-threatening toxicities.

---

## 1. High-Yield Therapeutic Drug Monitoring Profiles

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug} & \\textbf{Therapeutic Target} & \\textbf{Primary Toxicity} & \\textbf{Monitoring Strategy} & \\textbf{Specific Reversal / Antidote} \\\\
\\hline
\\textbf{Vancomycin} & \\mathbf{\\text{AUC}_{24}/\\text{MIC } \\ge 400-600} & \\text{Nephrotoxicity, Ototoxicity, Red Man} & \\text{Bayesian AUC vs trough (15-20)} & \\text{Discontinue; Hemodialysis} \\\\
\\textbf{Aminoglycosides} & C_{\\text{max}}/\\text{MIC } \\ge 8-10 & \\mathbf{\\text{ATN Nephrotoxicity, Irreversible Ototoxicity}} & \\mathbf{\\text{Extended-interval QD (trough } <1\\text{)}} & \\text{Hydration, Calcium gluconate (NM block)} \\\\
\\textbf{Digoxin} & 0.5 - 0.9\\text{ ng/mL (CHF)} & \\text{Arrhythmias, Xanthopsia (yellow halos)} & \\text{Exacerbated by } \\mathbf{\\downarrow K^+, \\downarrow Mg^{2+}} & \\mathbf{\\text{Digoxin Immune Fab (DigiFab)}} \\\\
\\textbf{Lithium} & 0.6 - 1.2\\text{ mEq/L} & \\text{Tremor, Ataxia, Nephrogenic DI} & \\mathbf{\\text{Toxicity triggered by Thiazides/NSAIDs}} & \\mathbf{\\text{Emergent Hemodialysis}} \\\\
\\textbf{Theophylline} & 5 - 15\\text{ mcg/mL} & \\text{Seizures, Fatal Tachyarrhythmias} & \\text{CYP1A2 inhibition (Ciprofloxacin)} & \\text{Beta-blockers, Activated charcoal} \\\\
\\hline
\\end{array}$$

---

## 2. Phenytoin Non-Linear (Michaelis-Menten) Elimination Kinetics

$$v = \\frac{V_{\\text{max}} \\cdot C}{K_m + C}$$

- **The Transition from First-Order to Zero-Order**:
  - At low plasma concentrations ($C \\ll K_m$), the rate of elimination is proportional to concentration $\\rightarrow$ **Linear first-order kinetics** (constant half-life $t_{1/2}$).
  - At therapeutic levels ($10 - 20\\text{ mcg/mL}$), plasma concentration approaches $K_m$ ($\approx 4\\text{ mcg/mL}$), saturating hepatic microsomal enzymes (**CYP2C9 & CYP2C19**).
  - Above saturation ($C > K_m$), a fixed amount of drug is cleared per unit time $\\rightarrow$ **Zero-order kinetics** (half-life increases with dose).
  - **Clinical Danger**: Small, incremental dosage increases (e.g., $300\\text{ mg} \\rightarrow 350\\text{ mg/day}$) can cause catastrophic, exponential surges in serum phenytoin levels, producing horizontal nystagmus, cerebellar ataxia, lethargy, and coma.
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male with generalized tonic-clonic epilepsy has been taking Phenytoin 300 mg daily for 6 months with a steady-state serum phenytoin concentration of 11 mcg/mL (therapeutic range: 10-20 mcg/mL). Because he experienced a single breakthrough seizure, his physician increases his dose to 400 mg daily (a 33% increase). Ten days later, he presents to the emergency department with severe horizontal nystagmus, bilateral dysdiadochokinesia, wide-based staggering ataxia, and slurred speech. Repeat serum phenytoin concentration is 38 mcg/mL.",
      question: "Which of the following pharmacokinetic principles explains this dramatic, non-linear surge in plasma drug concentration?",
      options: [
        "Saturation of hepatic CYP2C9/2C19 metabolic enzymes transitioning elimination from first-order linear to zero-order capacity-limited kinetics (Michaelis-Menten)",
        "Severe acute kidney injury decreasing renal glomerular clearance of unchanged drug",
        "Induction of intestinal P-glycoprotein efflux transporters increasing oral bioavailability",
        "Decreased volume of distribution due to acute expansion of extracellular fluid volume"
      ],
      correctAnswerIndex: 0,
      explanation: "Phenytoin exhibits classic capacity-limited non-linear (Michaelis-Menten) pharmacokinetics. At low concentrations, hepatic clearance follows linear first-order elimination. However, within the upper therapeutic range (10-20 mcg/mL), hepatic CYP2C9 and CYP2C19 enzymes become completely saturated (Michaelis constant Km is exceeded). Once zero-order kinetics are reached, a fixed amount of drug is metabolized per unit time regardless of concentration; thus, even a modest 33% dosage increase leads to an exponential, disproportionate quadrupling of serum concentration (from 11 to 38 mcg/mL), precipitating severe cerebellar-vestibular toxicity (nystagmus, ataxia, slurred speech)."
    }
  ]
};
