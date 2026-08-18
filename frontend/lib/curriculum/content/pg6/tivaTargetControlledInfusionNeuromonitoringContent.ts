/**
 * Postgraduate Advanced Anesthesiology: TIVA, Target-Controlled Infusion (TCI) & Neuromonitoring
 * Authoritative clinical pharmacology & neuro-anesthesia content derived from Schnider/Marsh Models, Minto Model, Eger Context-Sensitive Half-Time.
 * Mapped to NMC PG CBME Competencies: PG6.3, AN3.1, AN3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE: PhysiologyLessonModule = {
  id: "pg6-tiva-target-controlled-infusion-neuromonitoring",
  unitCode: "PG6.3",
  title: "Total Intravenous Anesthesia (TIVA): Target-Controlled Infusion (TCI) PK/PD Models & BIS Neuromonitoring",
  competencies: ["PG6.3", "AN3.1", "AN3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Total Intravenous Anesthesia (TIVA), TCI PK/PD & Processed EEG

TIVA combines Target-Controlled Infusion (TCI) pharmacokinetic-pharmacodynamic modeling with processed EEG neuromonitoring to maintain stable effect-site drug concentrations and prevent intraoperative awareness.

---

## 1. Pharmacokinetic Compartmental Models & Context-Sensitive Half-Time

$$\\begin{array}{lcccc}
\\hline
\\textbf{PK Parameter} & \\textbf{Pharmacokinetic Definition} & \\textbf{Propofol (Marsh / Schnider)} & \\textbf{Remifentanil (Minto)} \\\\
\\hline
\\textbf{Compartments} & \\text{3-compartment mammillary model } (V_1, V_2, V_3) & V_1 = 0.228\\text{ L/kg (Marsh) / } 4.27\\text{ L (Schnider)} & V_1 = 5.1\\text{ L (covariates: Age, LBM)} \\\\
\\textbf{Effect-Site } (C_e) & \\text{Cortical concentration via } k_{e0} \\text{ rate constant} & \\mathbf{\\text{Induction: } 4-6\\;\\mu\\text{g/mL, Maint: } 2.5-4\\;\\mu\\text{g/mL}} & \\mathbf{\\text{Intubation: } 4-8\\text{ ng/mL, Maint: } 2-5\\text{ ng/mL}} \\\\
\\textbf{CSHT} & \\mathbf{\\text{Context-Sensitive Half-Time}} & \\text{Increases with duration } (\\sim 20-30\\text{ min at 4h}) & \\mathbf{\\text{CONSTANT at 3-4 minutes (esterase hydrolysis)}} \\\\
\\hline
\\end{array}$$

---

## 2. Processed EEG Neuromonitoring (Bispectral Index - BIS)

- **Target Range**: **$\text{BIS} = 40-60$** reflects adequate surgical hypnosis.
  - $\text{BIS} > 60$: Increased risk of intraoperative awareness and explicit recall.
  - $\text{BIS} < 40$: Excessive depth of anesthesia, increasing the risk of burst suppression ($\text{BSR} > 0$), delayed emergence, and postoperative delirium/cognitive dysfunction (POCD).
- **Remifentanil Synergy**:
  - Remifentanil exerts a potent synergistic effect on propofol hypnosis, allowing lower propofol $C_e$ ($2.0-3.0\\;\\mu\text{g/mL}$) to maintain $\text{BIS} < 50$ without prolonged recovery.
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with severe COPD is undergoing a 4-hour laparoscopic colectomy under Total Intravenous Anesthesia (TIVA) using Target-Controlled Infusion (TCI). The anesthesiologist initiates Propofol via the Schnider effect-site model targeting a Ce of 3.2 mcg/mL and Remifentanil via the Minto model targeting a Ce of 3.5 ng/mL. Bispectral Index (BIS) monitoring is applied, displaying an index of 46 with a Burst Suppression Ratio (BSR) of 0%. At the end of the 4-hour procedure, the Remifentanil and Propofol infusions are stopped simultaneously.",
      question: "What is the expected context-sensitive half-time (CSHT) behavior of Remifentanil compared to Propofol, and what does the BIS target of 40-60 guarantee?",
      options: [
        "Remifentanil maintains an ultra-short, invariant context-sensitive half-time of 3-4 minutes regardless of infusion duration due to rapid hydrolysis by non-specific blood and tissue esterases, while Propofol's CSHT rises to approximately 25-30 minutes after 4 hours; the BIS target of 40-60 ensures adequate surgical hypnosis preventing intraoperative awareness while avoiding excessive burst suppression that causes postoperative delirium",
        "Remifentanil's CSHT increases to 4 hours after a 4-hour infusion; the BIS should be kept below 20",
        "Propofol has an invariant CSHT of 1 minute; BIS is irrelevant in TIVA",
        "Both drugs accumulate indefinitely and require hemodialysis for emergence"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates precision TIVA management: (1) Remifentanil PK: Because Remifentanil is broken down by ubiquitous non-specific esterases, its context-sensitive half-time remains flat at 3-4 minutes even after prolonged infusions, ensuring predictable rapid offset; (2) Processed EEG: Titrating TCI to maintain a BIS between 40-60 ensures adequate depth of anesthesia to prevent awareness (BIS >60) while avoiding deep burst suppression (BIS <40) linked to postoperative cognitive dysfunction."
    }
  ]
};
