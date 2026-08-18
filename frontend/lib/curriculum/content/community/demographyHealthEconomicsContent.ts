/**
 * Demography, Vital Statistics & Health Economics Learning Content
 * Authoritative medical content derived from Park, Gordis, and USMLE Step 1 / Step 2 CK Biostatistics.
 * Mapped to NMC CBME Competencies: CM7.1, CM7.2, CM8.1, CM8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DEMOGRAPHY_HEALTH_ECONOMICS_MODULE: PhysiologyLessonModule = {
  id: "comm-demography",
  unitCode: "CM7.1",
  title: "Demography, Vital Health Indicators, DALYs, QALYs & Health Economics",
  competencies: ["CM7.1", "CM7.2", "CM8.1", "CM8.2"],
  estimatedMinutes: 130,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Demography, Vital Health Indicators, DALYs, QALYs & Health Economics

Demography is the statistical study of human populations regarding size, structure, distribution, and vital rates (fertility, mortality, and migration), guiding national healthcare resource allocation.

---

## 1. Core Vital Statistics & Demographic Indicators

| Demographic Indicator | Mathematical Definition & Formula | Reference Benchmarks & Significance |
| :--- | :--- | :--- |
| **Infant Mortality Rate ($IMR$)** | $$\\text{IMR} = \\frac{\\text{Deaths of infants } <1\\text{ year in a year}}{\\text{Total live births in the same year}} \\times 1,000$$ | **Single most sensitive indicator of overall health status, socioeconomic development, and healthcare quality of a nation**. |
| **Maternal Mortality Ratio ($MMR$)** | $$\\text{MMR} = \\frac{\\text{Maternal deaths from pregnancy/delivery causes}}{\\text{Total live births in the same year}} \\times 100,000$$ | Expressed **per 100,000 live births**; reflects obstetric emergency care and maternal health systems. |
| **Total Fertility Rate ($TFR$)** | Average number of children that would be born to a woman during her reproductive years ($15\\text{–}49$ yrs). | **Replacement-Level Fertility = $2.1$** (at this rate, population remains exactly stable without growing or declining). |
| **Crude Birth Rate ($CBR$)** | $$\\text{CBR} = \\frac{\\text{Total live births in a calendar year}}{\\text{Mid-year total population}} \\times 1,000$$ | Basic measure of fertility in a general population. |

---

## 2. Demographic Transition Model (5 Stages)

1. **Stage 1 (High Stationary)**: High birth rate $+$ High death rate $\implies$ Stable population (Historical pre-industrial societies).
2. **Stage 2 (Early Expanding)**: High birth rate $+$ **Rapidly falling death rate** (due to sanitation, antibiotics) $\implies$ **Population Explosion** (Developing nations).
3. **Stage 3 (Late Expanding)**: Falling birth rate $+$ Low death rate $\implies$ Slower population growth (Industrializing nations e.g. India).
4. **Stage 4 (Low Stationary)**: Low birth rate $+$ Low death rate $\implies$ Stable stationary population ($TFR \\approx 2.1$, e.g. USA, UK).
5. **Stage 5 (Declining)**: Birth rate falls **below death rate** $\implies$ Negative natural growth, aging population ($TFR < 1.5$, e.g. Japan, Italy, Germany).

---

## 3. Health Economics: DALYs, QALYs & Cost-Effectiveness

- **Disability-Adjusted Life Year ($DALY$)**:
  - One DALY represents the loss of the equivalent of **one year of full health**.
  $$DALY = YLL + YLD$$
  - **$YLL$ (Years of Life Lost)**: Number of deaths $\times$ remaining life expectancy at age of death.
  - **$YLD$ (Years Lost due to Disability)**: Number of incident cases $\times$ average duration $\times$ disability weight factor ($0.0 =$ perfect health, $1.0 =$ death).
- **Quality-Adjusted Life Year ($QALY$)**:
  - Measures the quantity and quality of life gained by a medical intervention.
  $$QALY = \\text{Additional Years of Life} \\times \\text{Utility Value } (0.0\\text{ to } 1.0)$$
- **Incremental Cost-Effectiveness Ratio ($ICER$)**:
  $$ICER = \\frac{\\text{Cost}_{\\text{new}} - \\text{Cost}_{\\text{standard}}}{\\text{Effect}_{\\text{new}} - \\text{Effect}_{\\text{standard}}} = \\frac{\\Delta \\text{Cost}}{\\Delta QALY}$$
  - Evaluates whether a new drug/procedure is economically justifiable based on a nation\'s Willingness-to-Pay threshold (typically $<\$50,000\\text{ to } \$100,000\\text{ per QALY}$).
`,
  clinicalVignettes: [
    {
      scenario: "A regional public health department conducts a global burden of disease assessment for chronic ischemic heart disease in an industrial township. Over one year, 100 premature cardiac deaths occur at an average age of 55 (life expectancy standard = 75 years, contributing 2,000 Years of Life Lost). Additionally, 500 individuals live with chronic angina and heart failure (disability weight = 0.20) for an average of 5 years each.",
      question: "Which of the following is the total number of Disability-Adjusted Life Years (DALYs) lost due to ischemic heart disease in this population?",
      options: [
        "2,500 DALYs",
        "2,000 DALYs",
        "500 DALYs",
        "3,000 DALYs"
      ],
      correctAnswerIndex: 0,
      explanation: "DALY = YLL + YLD. YLL = 2,000 years. YLD = Number of cases x Duration x Disability weight = 500 x 5 x 0.20 = 500 years. Total DALYs = 2,000 + 500 = 2,500 DALYs."
    }
  ]
};
