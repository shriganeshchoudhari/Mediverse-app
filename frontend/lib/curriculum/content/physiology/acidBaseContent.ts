/**
 * Acid-Base Physiology & Davenport Nomogram Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.) and Costanzo Acid-Base Physiology.
 * Mapped to NMC CBME Competencies: PY7.3, PY7.4
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const ACID_BASE_MODULE: PhysiologyLessonModule = {
  id: "phys-acid-base",
  unitCode: "PY7.4",
  title: "Acid-Base Homeostasis, Davenport Nomogram & Anion Gap Diagnostics",
  competencies: ["PY7.3", "PY7.4"],
  estimatedMinutes: 105,
  simulatorRoute: "/simulators/acid-base",
  simulatorParams: {
    paco2: 40,
    hco3: 24,
    na: 140,
    cl: 104
  },
  organ3dTarget: "RENAL",
  markdownContent: `
# Acid-Base Homeostasis, Davenport Nomogram & Anion Gap Diagnostics

Extracellular fluid pH is tightly regulated within the narrow range of **$7.35 - 7.45$** ($[H^+] = 35 - 45\\text{ nmol/L}$) to preserve enzymatic kinetics, membrane protein conformation, and cardiac electrophysiology.

---

## 1. The Henderson-Hasselbalch Equation

The primary physiological extracellular buffer is the bicarbonate-carbonic acid system:

$$\\text{CO}_2 + \\text{H}_2\\text{O} \\xrightleftharpoons{\\text{Carbonic Anhydrase}} \\text{H}_2\\text{CO}_3 \\xrightleftharpoons{} \\text{H}^+ + \\text{HCO}_3^-$$

$$pH = pK_a + \\log_{10}\\left( \\frac{[\\text{HCO}_3^-]}{[\\text{H}_2\\text{CO}_3]} \\right) = 6.1 + \\log_{10}\\left( \\frac{[\\text{HCO}_3^-]}{0.03 \\cdot P_a \\text{CO}_2} \\right)$$

- At normal values ($[\\text{HCO}_3^-] = 24\\text{ mEq/L}$, $P_a \\text{CO}_2 = 40\\text{ mmHg}$):
  $$pH = 6.1 + \\log_{10}\\left( \\frac{24}{0.03 \\times 40} \\right) = 6.1 + \\log_{10}\\left( \\frac{24}{1.2} \\right) = 6.1 + \\log_{10}(20) = 6.1 + 1.30 = 7.40$$
- The ratio $[\\text{HCO}_3^-] / (0.03 \\cdot P_a \\text{CO}_2)$ is **$20:1$**. As long as this ratio is preserved, blood pH remains 7.40.

---

## 2. The Davenport Nomogram & Buffer Lines

The Davenport diagram plots plasma $[\\text{HCO}_3^-]$ (y-axis) against pH (x-axis) across curved $P_a \\text{CO}_2$ isobars:

- **Non-Bicarbonate Buffer Line (Normal Buffer Slope)**: Represents buffering by hemoglobin, albumin, and intracellular phosphates. Slope $\\approx -25\\text{ to }-30\\text{ mmol/L/pH unit}$.
- **Respiratory Disturbances**: Point moves along the *Buffer Line* crossing different $P_a \\text{CO}_2$ isobars.
- **Metabolic Disturbances**: Point moves along a single $P_a \\text{CO}_2$ isobar (or shifts between buffer lines due to added fixed acids or bases).
- **Secondary Renal/Respiratory Compensation**: Shifts the point toward the normal pH range ($7.40$).

---

## 3. Systematic 4-Step ABG Interpretation

### Step 1: Examine pH
- $pH < 7.35 \\implies$ Acidemia.
- $pH > 7.45 \\implies$ Alkalemia.

### Step 2: Identify Primary Disorder
- If $pH < 7.35$ and $[\\text{HCO}_3^-] < 22\\text{ mEq/L} \\implies$ Primary **Metabolic Acidosis**.
- If $pH < 7.35$ and $P_a \\text{CO}_2 > 44\\text{ mmHg} \\implies$ Primary **Respiratory Acidosis**.
- If $pH > 7.45$ and $[\\text{HCO}_3^-] > 26\\text{ mEq/L} \\implies$ Primary **Metabolic Alkalosis**.
- If $pH > 7.45$ and $P_a \\text{CO}_2 < 36\\text{ mmHg} \\implies$ Primary **Respiratory Alkalosis**.

### Step 3: Assess Degree of Compensation
- **Metabolic Acidosis $\\rightarrow$ Winter's Formula**:
  $$\\text{Expected } P_a \\text{CO}_2 = 1.5 \\cdot [\\text{HCO}_3^-] + 8 \\pm 2$$
  - If measured $P_a \\text{CO}_2 > \\text{Expected} \\implies$ Concomitant **Respiratory Acidosis**.
  - If measured $P_a \\text{CO}_2 < \\text{Expected} \\implies$ Concomitant **Respiratory Alkalosis**.
- **Metabolic Alkalosis**:
  $$\\text{Expected } P_a \\text{CO}_2 = 0.7 \\cdot ([\\text{HCO}_3^-] - 24) + 40 \\pm 2$$
- **Acute Respiratory Acidosis**: For every $10\\text{ mmHg} \\uparrow P_a \\text{CO}_2 \\implies [\\text{HCO}_3^-] \\uparrow 1\\text{ mEq/L}$.
- **Chronic Respiratory Acidosis**: For every $10\\text{ mmHg} \\uparrow P_a \\text{CO}_2 \\implies [\\text{HCO}_3^-] \\uparrow 3.5\\text{ mEq/L}$.

---

## 4. Serum Anion Gap & Delta Ratio ($\\Delta - \\Delta$)

$$\\text{Serum Anion Gap (AG)} = [\\text{Na}^+] - ([\\text{Cl}^-] + [\\text{HCO}_3^-]) \\quad (\\text{Normal: } 10 - 12\\text{ mEq/L})$$

### MUDPILES Mnemonic for High Anion Gap Metabolic Acidosis (HAGMA):
- **M**: Methanol (Formic acid)
- **U**: Uremia (Phosphate/Sulfate retention)
- **D**: Diabetic Ketoacidosis (Beta-hydroxybutyrate, Acetoacetate)
- **P**: Propylene Glycol
- **I**: Iron, Isoniazid, Inborn errors of metabolism
- **L**: Lactic Acidosis (Tissue hypoperfusion, Shock, Sepsis, Metformin)
- **E**: Ethylene Glycol (Oxalic acid)
- **S**: Salicylates (Aspirin toxicity — mixed HAGMA + Respiratory Alkalosis)

### Delta-Delta Ratio ($\\Delta \\text{AG} / \\Delta \\text{HCO}_3^-$):
$$\\frac{\\Delta \\text{AG}}{\\Delta \\text{HCO}_3^-} = \\frac{\\text{Measured AG} - 12}{24 - \\text{Measured } [\\text{HCO}_3^-]}$$
- **$1.0 - 2.0$**: Pure High Anion Gap Metabolic Acidosis.
- **$< 1.0$**: Mixed HAGMA + Normal Anion Gap Metabolic Acidosis (e.g. DKA + Diarrhea or RTA).
- **$> 2.0$**: Mixed HAGMA + Pre-existing Metabolic Alkalosis (e.g. DKA + Protracted Vomiting or Diuretic therapy).
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old female with Type 1 Diabetes Mellitus presents to the emergency room with deep rapid Kussmaul breathing, abdominal pain, and confusion. Laboratory studies demonstrate: Serum Na+ 136 mEq/L, Cl- 96 mEq/L, HCO3- 8 mEq/L, Glucose 480 mg/dL, and arterial PaCO2 20 mmHg.",
      question: "Evaluate the Anion Gap, assess respiratory compensation with Winter's formula, and determine the exact acid-base diagnosis.",
      options: [
        "Anion Gap = 32 mEq/L; Expected PaCO2 = 20 mmHg; Pure High Anion Gap Metabolic Acidosis with appropriate respiratory compensation",
        "Anion Gap = 12 mEq/L; Normal Anion Gap metabolic acidosis secondary to urinary bicarbonate wasting",
        "Anion Gap = 32 mEq/L; Expected PaCO2 = 30 mmHg; Mixed Metabolic Acidosis and Primary Respiratory Acidosis",
        "Anion Gap = 16 mEq/L; Primary Respiratory Alkalosis with renal compensatory bicarbonate excretion"
      ],
      correctAnswerIndex: 0,
      explanation: "Serum Anion Gap = 136 - (96 + 8) = 32 mEq/L (severely elevated, normal 10-12). Applying Winter's formula: Expected PaCO2 = 1.5 * [HCO3-] + 8 +/- 2 = 1.5 * 8 + 8 = 12 + 8 = 20 mmHg (+/- 2). Because the measured PaCO2 is exactly 20 mmHg, this represents a pure high anion gap metabolic acidosis (DKA) with appropriate, full respiratory compensation."
    }
  ]
};
