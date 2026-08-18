/**
 * Pharmacokinetics & Pharmacodynamics Learning Content
 * Authoritative medical content derived from Katzung, Goodman & Gilman, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PH1.1, PH1.2, PH1.3, PH1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PHARMACOKINETICS_DYNAMICS_MODULE: PhysiologyLessonModule = {
  id: "pharm-pkpd",
  unitCode: "PH1.1",
  title: "Pharmacokinetics (ADME Equations), Elimination Kinetics & Receptor Dynamics",
  competencies: ["PH1.1", "PH1.2", "PH1.3", "PH1.4"],
  estimatedMinutes: 130,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Pharmacokinetics (ADME Equations), Elimination Kinetics & Receptor Dynamics

Pharmacokinetics (PK) quantitatively characterizes what the body does to a drug (**Absorption, Distribution, Metabolism, Excretion**), while Pharmacodynamics (PD) describes what the drug does to the body (**Receptor Binding, Signal Transduction, Dose-Response**).

---

## 1. Core Pharmacokinetic Formulas & Clinical Calculations

| PK Parameter | Mathematical Equation | Physiological Meaning & Clinical Application |
| :--- | :--- | :--- |
| **Volume of Distribution ($V_d$)** | $$V_d = \\frac{\\text{Dose (amount in body)}}{C_0 \\text{ (plasma concentration)}}$$ | Apparent volume required to contain the total drug at plasma concentration.<br>• **Low $V_d$ ($4\\text{–}8\\text{ L}$)**: High molecular weight / plasma protein binding (e.g. Warfarin, Heparin; stays in blood vascular compartment).<br>• **Medium $V_d$ ($12\\text{–}14\\text{ L}$)**: Extracellular fluid distribution (e.g. Aminoglycosides).<br>• **High $V_d$ ($>40\\text{ L}$)**: Lipophilic, extensive tissue/fat sequestration (e.g. Chloroquine, Digoxin). |
| **Clearance ($CL$)** | $$CL = \\frac{\\text{Rate of elimination}}{C_p} = V_d \\times k_e$$ | Volume of plasma cleared of drug per unit time ($mL/min$ or $L/h$). Equals renal clearance $+$ hepatic clearance $+$ other routes. |
| **Elimination Half-Life ($t_{1/2}$)** | $$t_{1/2} = \\frac{0.693 \\times V_d}{CL}$$ | Time required to reduce plasma concentration by $50\\%$.<br>• Takes **$4\\text{–}5$ half-lives** to reach steady state ($C_{ss}$) during constant infusion.<br>• Takes **$4\\text{–}5$ half-lives** to completely eliminate a drug after stopping. |
| **Loading Dose ($LD$)** | $$LD = \\frac{C_{target} \\times V_d}{F}$$ | Dose required to immediately achieve therapeutic target plasma concentration. *(Depends ONLY on $V_d$ and Bioavailability $F$, NOT on Clearance!)* |
| **Maintenance Dose ($MD$)** | $$MD = \\frac{C_{target} \\times CL \\times \\tau}{F}$$ | Dose administered per dosing interval ($\\tau$) to replace drug eliminated at steady state. *(Depends on Clearance $CL$, NOT on $V_d$!)* |

---

## 2. Zero-Order vs First-Order Elimination Kinetics

| Property | First-Order Elimination Kinetics | Zero-Order Elimination Kinetics |
| :--- | :--- | :--- |
| **Rate of Elimination** | **Constant fraction (percentage)** of drug eliminated per unit time (e.g. $50\\%/h$). | **Constant absolute amount** of drug eliminated per unit time (e.g. $10\\text{ mg/h}$). |
| **Concentration Dependency** | Rate is proportional to plasma concentration ($-\\frac{dC}{dt} = k \\times C$). | Rate is independent of plasma concentration ($-\\frac{dC}{dt} = k_0$) due to **saturation of metabolic enzymes**. |
| **Half-Life ($t_{1/2}$)** | Constant ($t_{1/2} = \\frac{0.693}{k_e}$). | Variable (increases as plasma concentration increases). |
| **Classic Drug Examples** | **$>95\\%$ of all clinical drugs** at therapeutic concentrations. | **PEA Mnemonic**: **P**henytoin, **E**thanol, **A**spirin (salicylates at toxic/high doses). |

---

## 3. Pharmacodynamics: Dose-Response & Receptor Antagonism

- **Potency vs Efficacy**:
  - **Potency**: Amount of drug needed to produce a given effect ($EC_{50}$: concentration producing $50\\%$ of maximal effect). *Leftward shift on log dose-response curve indicates higher potency*.
  - **Efficacy ($E_{\\max}$)**: Maximal effect a drug can produce regardless of dose. *(Clinically much more important than potency!)*
- **Receptor Antagonism Mechanisms**:
  - **Competitive Antagonist**: Competes directly with agonist for the same binding site.
    - Effect: **Shifts dose-response curve to the RIGHT** ($\\uparrow EC_{50}$, **potency decreased**), but **$E_{\\max}$ remains UNCHANGED** because high agonist concentrations overcome the blockade.
  - **Non-Competitive (Allosteric / Irreversible) Antagonist**: Binds allosteric site or covalently blocks receptor.
    - Effect: **Depresses $E_{\\max}$ downward** (**efficacy decreased**); $EC_{50}$ typically unchanged; cannot be overcome by adding more agonist.
  - **Partial Agonist**: Acts as an agonist alone with lower $E_{\\max}$ than a full agonist, but acts as a competitive antagonist in the presence of a full agonist (e.g. Buprenorphine, Pindolol).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with acute atrial fibrillation with rapid ventricular response is to be started on Digoxin. The target therapeutic plasma concentration is 1.5 ng/mL (1.5 mcg/L). The patient's estimated Volume of Distribution (Vd) is 7.0 L/kg, and his total body weight is 70 kg (total Vd = 490 L). Digoxin oral bioavailability (F) is 0.70.",
      question: "Which of the following is the calculated oral Loading Dose (LD) required to achieve immediate target plasma concentration?",
      options: [
        "1.05 mg (1050 mcg)",
        "0.52 mg (520 mcg)",
        "2.10 mg (2100 mcg)",
        "0.15 mg (150 mcg)"
      ],
      correctAnswerIndex: 0,
      explanation: "Loading Dose (LD) = (Target Cp * Vd) / F. Total Vd = 7.0 L/kg * 70 kg = 490 L. Target Cp = 1.5 mcg/L. LD = (1.5 mcg/L * 490 L) / 0.70 = 735 mcg / 0.70 = 1050 mcg = 1.05 mg."
    }
  ]
};
