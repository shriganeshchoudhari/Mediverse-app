/**
 * Biostatistics, Diagnostic & Screening Tests Learning Content
 * Authoritative medical content derived from Park, Gordis, and USMLE Step 1 / Step 2 CK Biostatistics.
 * Mapped to NMC CBME Competencies: CM2.1, CM2.2, CM2.3, CM2.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BIOSTATISTICS_SCREENING_MODULE: PhysiologyLessonModule = {
  id: "comm-biostatistics",
  unitCode: "CM2.1",
  title: "Biostatistics: 2x2 Contingency Matrix, Sensitivity, Specificity, ROC Curves & Hypothesis Testing",
  competencies: ["CM2.1", "CM2.2", "CM2.3", "CM2.4"],
  estimatedMinutes: 135,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Biostatistics: 2x2 Contingency Matrix, Sensitivity, Specificity, ROC Curves & Hypothesis Testing

Biostatistics provides the quantitative foundation for evaluating diagnostic accuracy, interpreting laboratory screening tools, and drawing valid scientific inferences from clinical data.

---

## 1. Diagnostic $2 \\times 2$ Contingency Table Matrix

| Diagnostic Test Result | Disease Present (Gold Standard $+$) | Disease Absent (Gold Standard $-$) | Total Margins |
| :--- | :--- | :--- | :--- |
| **Test Positive ($+$)** | **True Positive ($TP / a$)** | **False Positive ($FP / b$)** | Total Positive Tests ($a + b$) |
| **Test Negative ($-$)** | **False Negative ($FN / c$)** | **True Negative ($TN / d$)** | Total Negative Tests ($c + d$) |
| **Total Population** | Total Diseased ($a + c$) | Total Non-Diseased ($b + d$) | Grand Total ($N = a + b + c + d$) |

---

## 2. Core Diagnostic Formulas & Mnemonic Rules

| Diagnostic Metric | Mathematical Formula | Clinical Definition & High-Yield Mnemonic |
| :--- | :--- | :--- |
| **Sensitivity** | $$\\text{Sensitivity} = \\frac{TP}{TP + FN} = \\frac{a}{a+c}$$ | Probability that a diseased patient tests positive.<br>**SnNOut**: High **S**e**n**sitivity, **N**egative test rules **Out** disease (essential for screening tools e.g. ELISA). |
| **Specificity** | $$\\text{Specificity} = \\frac{TN}{TN + FP} = \\frac{d}{b+d}$$ | Probability that a non-diseased patient tests negative.<br>**SpPIn**: High **Sp**ecificity, **P**ositive test rules **In** disease (essential for confirmatory tools e.g. Western Blot, Biopsy). |
| **Positive Predictive Value ($PPV$)** | $$PPV = \\frac{TP}{TP + FP} = \\frac{a}{a+b}$$ | Probability that a patient with a positive test actually has the disease.<br>**Directly proportional to Disease Prevalence** ($\\uparrow$ Prevalence $\\implies \\uparrow PPV$). |
| **Negative Predictive Value ($NPV$)** | $$NPV = \\frac{TN}{TN + FN} = \\frac{d}{c+d}$$ | Probability that a patient with a negative test is truly disease-free.<br>**Inversely proportional to Disease Prevalence** ($\\uparrow$ Prevalence $\\implies \\downarrow NPV$). |
| **Positive Likelihood Ratio ($LR+$)** | $$LR+ = \\frac{\\text{Sensitivity}}{1 - \\text{Specificity}} = \\frac{\\text{True Positive Rate}}{\\text{False Positive Rate}}$$ | Degree to which a positive result increases odds of disease ($LR+ > 10$ provides strong diagnostic evidence). |
| **Negative Likelihood Ratio ($LR-$)** | $$LR- = \\frac{1 - \\text{Sensitivity}}{\\text{Specificity}} = \\frac{\\text{False Negative Rate}}{\\text{True Negative Rate}}$$ | Degree to which a negative result decreases odds of disease ($LR- < 0.1$ virtually rules out disease). |

---

## 3. Receiver Operating Characteristic (ROC) Curve

- **Axes**:
  - $Y$-axis: **Sensitivity** (True Positive Rate).
  - $X$-axis: **$1 - \\text{Specificity}$** (False Positive Rate).
- **Interpretation**:
  - A diagonal line ($45^\\circ$) represents a test with zero diagnostic utility ($\text{AUC} = 0.50$, equivalent to tossing a coin).
  - The closer the curve is to the **top-left corner**, the higher the **Area Under the Curve (AUC)** and overall test accuracy ($\text{AUC} = 1.0 \\implies$ perfect test).

---

## 4. Hypothesis Testing & Statistical Errors

- **Gaussian Normal Distribution (Empirical Rule)**:
  - $\\mu \\pm 1\\sigma = 68.2\\%$ of values.
  - $\\mu \\pm 2\\sigma = 95.4\\%$ of values.
  - $\\mu \\pm 3\\sigma = 99.7\\%$ of values.
- **Type I ($\\alpha$) vs Type II ($\\beta$) Errors**:
  - **Type I Error ($\\alpha$)**: Stating there is a difference when none exists (**False Positive conclusion**). Typically set at $\\alpha = 0.05$ ($p < 0.05$).
  - **Type II Error ($\\beta$)**: Stating there is no difference when one truly exists (**False Negative conclusion**).
  - **Statistical Power ($1 - \\beta$)**: Probability of detecting a difference when one truly exists. Power increases with **larger sample size ($n$)**, larger effect size, and lower variance.
- **Choosing the Right Statistical Test**:
  - **$t$-Test**: Compares the continuous means of **2 groups** (e.g. comparing mean BP between Drug A vs Placebo).
  - **ANOVA (Analysis of Variance)**: Compares the continuous means of **$\\ge 3$ groups** (e.g. comparing mean HbA1c across 3 different anti-diabetic medications).
  - **Chi-Square ($\\chi^2$) Test**: Compares proportions/frequencies of **categorical variables** (e.g. proportion of smokers vs non-smokers who develop lung cancer).
  - **Pearson Correlation Coefficient ($r$)**: Measures strength of linear association between two continuous variables (ranges from $-1.0$ to $+1.0$).
`,
  clinicalVignettes: [
    {
      scenario: "A newly developed rapid antigen test for influenza is evaluated in a cohort of 1,000 patients. The gold-standard RT-PCR identifies 200 patients with true influenza. The rapid test yields a positive result in 180 of the 200 diseased patients and also tests positive in 80 of the 800 non-diseased individuals.",
      question: "Which of the following represents the Sensitivity and Specificity of this rapid antigen screening test?",
      options: [
        "Sensitivity = 90%; Specificity = 90%",
        "Sensitivity = 80%; Specificity = 90%",
        "Sensitivity = 90%; Specificity = 80%",
        "Sensitivity = 69.2%; Specificity = 97.3%"
      ],
      correctAnswerIndex: 0,
      explanation: "Sensitivity = TP / (TP + FN) = 180 / 200 = 0.90 (90%). In non-diseased individuals, 80 test positive (FP) and 720 test negative (TN, because 800 - 80 = 720). Specificity = TN / (TN + FP) = 720 / 800 = 0.90 (90%)."
    }
  ]
};
