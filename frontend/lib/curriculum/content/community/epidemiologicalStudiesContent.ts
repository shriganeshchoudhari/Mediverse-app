/**
 * Epidemiological Study Designs, Measures of Association & Biases Learning Content
 * Authoritative medical content derived from Park, Gordis, and USMLE Step 1 / Step 2 CK Biostatistics.
 * Mapped to NMC CBME Competencies: CM1.1, CM1.2, CM1.3, CM1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const EPIDEMIOLOGICAL_STUDIES_MODULE: PhysiologyLessonModule = {
  id: "comm-epidemiology",
  unitCode: "CM1.1",
  title: "Epidemiological Study Designs: Cohort, Case-Control, RCTs, Risk Ratios & Systematic Biases",
  competencies: ["CM1.1", "CM1.2", "CM1.3", "CM1.4"],
  estimatedMinutes: 135,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Epidemiological Study Designs: Cohort, Case-Control, RCTs, Risk Ratios & Systematic Biases

Epidemiology is the study of the distribution and determinants of health-related states or events in specified populations, and the application of this study to the control of health problems.

---

## 1. Observational vs Experimental Study Hierarchy

| Study Design | Selection Criterion | Directionality & Timeline | Key Metric of Association | Major Strengths & Limitations |
| :--- | :--- | :--- | :--- | :--- |
| **Case-Control Study** | Selected by **Disease Status** (Cases with disease vs Controls without disease) | **Retrospective** (looks back in time for prior exposure) | **Odds Ratio ($OR$)**:<br>$$OR = \\frac{a \\times d}{b \\times c}$$ | • **Strengths**: Best for **rare diseases** and conditions with long latency; inexpensive, rapid.<br>• **Limitations**: Highly vulnerable to **Recall Bias** and selection bias; cannot measure true incidence. |
| **Cohort Study** (Prospective / Retrospective) | Selected by **Exposure Status** (Exposed cohort vs Unexposed cohort free of disease at baseline) | **Longitudinal** (followed forward over time for incident disease) | **Relative Risk / Risk Ratio ($RR$)**:<br>$$RR = \\frac{a / (a+b)}{c / (c+d)}$$ | • **Strengths**: Best for **rare exposures**; directly measures disease **Incidence**; preserves temporal sequence.<br>• **Limitations**: Expensive, time-consuming; vulnerable to **Loss to Follow-up Bias**; inefficient for rare diseases. |
| **Cross-Sectional Study** | Representative sample of a population surveyed at a single point in time | **Snapshot / Simultaneous** (Exposure and disease assessed concurrently) | **Prevalence Ratio / Odds Ratio** | • **Strengths**: Inexpensive, quick, estimates disease burden.<br>• **Limitations**: Cannot establish **temporal relationship** (what came first: exposure or disease?). |
| **Randomized Controlled Trial (RCT)** | Patients randomly allocated to **Treatment Group** vs **Control / Placebo Group** | **Prospective Interventional** | **Absolute Risk Reduction ($ARR$)** & **$NNT$** | • **Gold Standard** for determining clinical efficacy.<br>• Minimizes confounding through randomization and blinding (single, double, triple). |

---

## 2. Key Epidemiological Risk Formulas

- **Relative Risk ($RR$)**:
  $$\\text{Incidence in Exposed } (I_e) = \\frac{a}{a+b}, \\quad \\text{Incidence in Unexposed } (I_u) = \\frac{c}{c+d}$$
  $$RR = \\frac{I_e}{I_u} = \\frac{a / (a+b)}{c / (c+d)}$$
  - $RR = 1.0 \\implies$ No association; $RR > 1.0 \\implies$ Increased risk (harmful exposure); $RR < 1.0 \\implies$ Protective exposure.
- **Attributable Risk ($AR$ / Risk Difference)**:
  $$AR = I_e - I_u = \\frac{a}{a+b} - \\frac{c}{c+d}$$
  - Quantifies the absolute excess risk attributable specifically to the risk factor.
- **Attributable Risk Percent ($AR\\%$)**:
  $$AR\\% = \\frac{I_e - I_u}{I_e} \\times 100 = \\frac{RR - 1}{RR} \\times 100$$
- **Number Needed to Treat ($NNT$) & Number Needed to Harm ($NNH$)**:
  $$ARR = \\text{Absolute Risk Reduction} = |I_c - I_t|$$
  $$NNT = \\frac{1}{ARR} = \\frac{1}{|I_{\\text{control}} - I_{\\text{treatment}}|}$$
  $$NNH = \\frac{1}{AR} = \\frac{1}{|I_{\\text{exposed}} - I_{\\text{unexposed}}|}$$

---

## 3. Systematic Biases in Clinical Research

1. **Selection Biases**:
   - **Berkson Bias**: Hospitalized patients have higher rates of multiple conditions than the general population, skewing associations.
   - **Healthy Worker Effect**: Employed individuals are systematically healthier than the general population (which includes the sick and disabled).
2. **Information & Measurement Biases**:
   - **Recall Bias**: Patients with an adverse outcome (e.g. mothers of infants born with malformations) remember prior exposures far more meticulously than healthy controls.
   - **Hawthorne Effect**: Study participants alter their behavior simply because they know they are being observed.
   - **Pygmalion / Observer-Expectancy Effect**: Researcher\'s belief in the treatment inadvertently influences patient assessment or reporting.
   - **Lead-Time Bias**: Early detection by screening falsely gives the illusion of prolonged survival without changing actual mortality date.
   - **Length-Time Bias**: Screening disproportionately detects slowly progressive, indolent disease, overestimating screening benefit.
3. **Confounding vs Effect Modification**:
   - **Confounder**: A third variable associated with both exposure and outcome that distorts the relationship (e.g. smoking is a confounder in coffee drinking vs pancreatic cancer). *Eliminated by matching, randomization, stratification, or multivariable regression*.
   - **Effect Modifier**: A biological phenomenon where the magnitude of effect genuinely differs across strata (e.g. age or genetic allele). *Identified when stratified analysis yields significantly different odds ratios across subgroups*.
`,
  clinicalVignettes: [
    {
      scenario: "A prospective randomized clinical trial evaluates a new SGLT2 inhibitor in patients with heart failure. Over a 3-year follow-up, cardiovascular mortality occurs in 10% of patients receiving the drug and in 15% of patients receiving placebo.",
      question: "Which of the following represents the Absolute Risk Reduction (ARR) and the Number Needed to Treat (NNT) to prevent one cardiovascular death over 3 years?",
      options: [
        "ARR = 5% (0.05); NNT = 20",
        "ARR = 33.3%; NNT = 3",
        "ARR = 15%; NNT = 7",
        "ARR = 2.5%; NNT = 40"
      ],
      correctAnswerIndex: 0,
      explanation: "Absolute Risk Reduction (ARR) is calculated as the event rate in the control group minus the event rate in the treatment group: ARR = 0.15 - 0.10 = 0.05 (5%). The Number Needed to Treat (NNT) is the reciprocal of ARR: NNT = 1 / ARR = 1 / 0.05 = 20. This means treating 20 patients with the SGLT2 inhibitor for 3 years prevents 1 cardiovascular death."
    }
  ]
};
