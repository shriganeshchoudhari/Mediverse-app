/**
 * Early Clinical Exposure II: Diagnostic Stewardship, Evidence-Based Medicine & Likelihood Ratios
 * Authoritative biostatistics & EBM content derived from Guyatt's Users' Guides, Sackett.
 * Mapped to NMC CBME Competencies: ECE2.3, FC2.3, AETCOM2.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DIAGNOSTIC_STEWARDSHIP_EBM_MODULE: PhysiologyLessonModule = {
  id: "ece2-diagnostic-stewardship-ebm",
  unitCode: "ECE2.3",
  title: "Diagnostic Stewardship & EBM: Sensitivity/Specificity, Likelihood Ratios (LR+/LR-), Fagan Nomograms & Pre-Test Odds",
  competencies: ["ECE2.3", "FC2.3", "AETCOM2.3"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Diagnostic Stewardship, Evidence-Based Decision Physics & Likelihood Ratios

Rational diagnostic testing integrates pre-test clinical probability, likelihood ratios, and post-test disease probabilities to avoid diagnostic cascades and overtesting harms.

---

## 1. Diagnostic Test Metrics & Bayes Theorem Mathematics

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Parameter} & \\textbf{Mathematical Formula} & \\textbf{Clinical Definition} & \\textbf{Impact of Disease Prevalence} \\\\
\\hline
\\textbf{Sensitivity (Sn)} & \\mathbf{\\frac{TP}{TP + FN}} & \\mathbf{\\text{Probability of positive test in diseased patients (SnNOut)}} & \\mathbf{\\text{INDEPENDENT of prevalence}} \\\\
\\textbf{Specificity (Sp)} & \\mathbf{\\frac{TN}{TN + FP}} & \\mathbf{\\text{Probability of negative test in non-diseased patients (SpPIn)}} & \\mathbf{\\text{INDEPENDENT of prevalence}} \\\\
\\textbf{Positive Predictive Value} & \\mathbf{\\frac{TP}{TP + FP}} & \\text{Probability that a patient with positive test has disease} & \\mathbf{\\text{INCREASES as prevalence increases}} \\\\
(\\textbf{PPV}) & & & (\\text{low PPV in low-prevalence screening}) \\\\
\\textbf{Negative Predictive Value} & \\mathbf{\\frac{TN}{TN + FN}} & \\text{Probability that a patient with negative test lacks disease} & \\mathbf{\\text{DECREASES as prevalence increases}} \\\\
(\\textbf{NPV}) & & & (\\text{high NPV in low-prevalence screening}) \\\\
\\textbf{Positive Likelihood Ratio} & \\mathbf{\\text{LR}^+ = \\frac{\\text{Sensitivity}}{1 - \\text{Specificity}}} & \\mathbf{\\text{Ratio of true pos to false pos (LR}^+ > 10 \\rightarrow \\text{ rules IN)}} & \\mathbf{\\text{INDEPENDENT of prevalence}} \\\\
\\textbf{Negative Likelihood Ratio} & \\mathbf{\\text{LR}^- = \\frac{1 - \\text{Sensitivity}}{\\text{Specificity}}} & \\mathbf{\\text{Ratio of false neg to true neg (LR}^- < 0.1 \\rightarrow \\text{ rules OUT)}} & \\mathbf{\\text{INDEPENDENT of prevalence}} \\\\
\\hline
\\end{array}$$

---

## 2. The Fagan Nomogram & Pre-Test to Post-Test Probability Transformation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Computational Step} & \\textbf{Mathematical Transformation} & \\textbf{Clinical Exemplar Calculation} \\\\
\\hline
\\textbf{1. Pre-Test Probability } (p) & \\text{Estimated from clinical history \u0026 Wells score} & p = 0.20 \\text{ (20\\% pre-test probability of DVT)} \\\\
\\textbf{2. Pre-Test Odds} & \\mathbf{\\text{Odds} = \\frac{p}{1 - p}} & \\text{Odds} = \\frac{0.20}{0.80} = 0.25 \\\\
\\textbf{3. Apply Likelihood Ratio} & \\mathbf{\\text{Post-Test Odds} = \\text{Pre-Test Odds} \\times \\text{LR}} & \\text{If D-dimer negative (LR}^- = 0.05\\text{): Post-Odds} = 0.25 \\times 0.05 = 0.0125 \\\\
\\textbf{4. Post-Test Probability } (P) & \\mathbf{P = \\frac{\\text{Post-Test Odds}}{\\text{Post-Test Odds} + 1}} & P = \\frac{0.0125}{1.0125} \\approx 0.0122 \\text{ (1.2\\% post-test probability } \\rightarrow \\text{ DVT excluded)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with atypical chest pain has a pre-test probability of obstructive coronary artery disease estimated at 30% (pre-test odds = 0.43). He undergoes an exercise stress echocardiogram. The test result is positive for new regional wall motion abnormalities. The test has a known sensitivity of 85% and a specificity of 90%.",
      question: "What is the Positive Likelihood Ratio (LR+) of this stress echocardiogram, and what is the approximate post-test probability of coronary artery disease?",
      options: [
        "LR+ = 8.5 (Sensitivity / [1 - Specificity] = 0.85 / 0.10); Post-test odds = 0.43 x 8.5 = 3.65; Post-test probability = 3.65 / (3.65 + 1) = ~78.5%",
        "LR+ = 0.94; Post-test probability = 30%",
        "LR+ = 1.17; Post-test probability = 45%",
        "LR+ = 17.0; Post-test probability = 95%"
      ],
      correctAnswerIndex: 0,
      explanation: "This question illustrates Bayesian probability updating using Likelihood Ratios: (1) Calculate LR+: LR+ = Sensitivity / (1 - Specificity) = 0.85 / (1 - 0.90) = 0.85 / 0.10 = 8.5; (2) Convert Pre-Test Probability to Odds: Pre-test odds = p / (1 - p) = 0.30 / 0.70 = 0.4286; (3) Calculate Post-Test Odds: Post-test odds = Pre-test odds x LR+ = 0.4286 x 8.5 = 3.643; (4) Convert Post-Test Odds to Probability: Post-test probability = Post-test odds / (Post-test odds + 1) = 3.643 / 4.643 = 0.7846 (~78.5%)."
    }
  ]
};
