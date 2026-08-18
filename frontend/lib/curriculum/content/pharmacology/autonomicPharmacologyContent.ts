/**
 * Autonomic Nervous System Pharmacology Learning Content
 * Authoritative medical content derived from Katzung, Goodman & Gilman, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PH1.5, PH1.6, PH1.7, PH1.8
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AUTONOMIC_PHARMACOLOGY_MODULE: PhysiologyLessonModule = {
  id: "pharm-autonomics",
  unitCode: "PH1.5",
  title: "Autonomic Pharmacology: Cholinergic, Adrenergic & Receptor Signal Transduction",
  competencies: ["PH1.5", "PH1.6", "PH1.7", "PH1.8"],
  estimatedMinutes: 135,
  organ3dTarget: "NEUROLOGY",
  markdownContent: `
# Autonomic Pharmacology: Cholinergic, Adrenergic & Receptor Signal Transduction

Autonomic drug actions are mediated by **G-Protein Coupled Receptors (GPCRs)**: $G_q$ (activates Phospholipase C $\\rightarrow \\text{IP}_3/\\text{DAG} \\rightarrow \\uparrow \\text{Ca}^{2+}$), $G_i$ (inhibits Adenylate Cyclase $\\rightarrow \\downarrow \\text{cAMP}$), and $G_s$ (stimulates Adenylate Cyclase $\\rightarrow \\uparrow \\text{cAMP}$).

---

## 1. GPCR Signal Transduction Mnemonic: **HAVe 1 M&M, MAD 2s, QISS and QIQ**

- **$G_q$ Receptors ($HAVe\\text{ }1\\text{ }M\\&M$)**: **$H_1, \\alpha_1, V_1, M_1, M_3$**
- **$G_i$ Receptors ($MAD\\text{ }2s$)**: **$M_2, \\alpha_2, D_2$**
- **$G_s$ Receptors**: **$\\beta_1, \\beta_2, \\beta_3, D_1, H_2, V_2$**

| Receptor | G-Protein & 2nd Messenger | Tissue Distribution | Physiological Action of Agonist | Classic Drugs |
| :--- | :--- | :--- | :--- | :--- |
| **$\\alpha_1$** | **$G_q \\rightarrow \\uparrow \\text{IP}_3/\\text{DAG} \\rightarrow \\uparrow \\text{Ca}^{2+}$** | Vascular smooth muscle, pupillary dilator muscle, internal urethral sphincter | **Vasoconstriction** ($\\uparrow$ SVR, $\\uparrow$ BP), **Mydriasis** (pupillary dilation), urinary retention | • Agonists: **Phenylephrine, Midodrine**<br>• Antagonists: **Prazosin, Doxazosin, Tamsulosin** (selective $\\alpha_{1A}$ for BPH) |
| **$\\alpha_2$** | **$G_i \\rightarrow \\downarrow \\text{cAMP}$** | Presynaptic adrenergic nerve terminals, pancreatic $\\beta$-cells | **Inhibits norepinephrine release** (sympatholytic), $\\downarrow$ insulin secretion | • Agonists: **Clonidine, Methyldopa** (gestational HTN), **Dexmedetomidine** |
| **$\\beta_1$** | **$G_s \\rightarrow \\uparrow \\text{cAMP} \\rightarrow \\text{PKA}$** | Heart (SA node, AV node, myocardium), Renal juxtaglomerular cells | **$\\uparrow$ Heart Rate** (chronotropy), **$\\uparrow$ Contractility** (inotropy), **$\\uparrow$ Renin release** | • Agonists: **Dobutamine, Isoproterenol**<br>• Selective Antagonists: **Metoprolol, Atenolol, Esmolol, Bisoprolol** |
| **$\\beta_2$** | **$G_s \\rightarrow \\uparrow \\text{cAMP} \\rightarrow \\text{MLCK relaxation}$** | Bronchial smooth muscle, vascular smooth muscle (skeletal), liver | **Bronchodilation**, **Vasodilation** ($\\downarrow$ SVR), $\\uparrow$ Glycogenolysis, **$\\uparrow \\text{K}^+$ cellular uptake** | • Agonists: **Albuterol, Salmeterol, Terbutaline** (tocolytic)<br>• Non-selective Blockers: **Propranolol, Timolol, Nadolol** |
| **$M_1$** | **$G_q$** | CNS, enteric nervous system | Mediates higher cognitive function, gastric secretion | • Agonists: Bethanechol<br>• Antagonists: Atropine, Dicyclomine |
| **$M_2$** | **$G_i \\rightarrow \\downarrow \\text{cAMP} \\rightarrow \\uparrow \\text{K}^+$ open** | Cardiac SA and AV nodes | **$\\downarrow$ Heart Rate** (negative chronotropy), **$\\downarrow$ AV conduction** | • Antagonists: **Atropine** (reverses bradycardia/AV block) |
| **$M_3$** | **$G_q \\rightarrow \\uparrow \\text{IP}_3/\\text{DAG} \\rightarrow \\uparrow \\text{Ca}^{2+}$** | Exocrine glands, bladder detrusor, ciliary muscle, vascular endothelium (NO release) | **$\\uparrow$ Secretions** (saliva, sweat, tears), **Bronchoconstriction**, **Detrusor contraction** (micturition), **Miosis** / Accommodation | • Agonists: **Pilocarpine** (glaucoma/xerostomia), **Bethanechol** (urinary retention)<br>• Antagonists: **Ipratropium/Tiotropium** (COPD), **Oxybutynin** (overactive bladder) |

---

## 2. Cholinergic & Anticholinergic Toxidromes

- **Organophosphate Toxicity (Irreversible Acetylcholinesterase Inhibition)**:
  - Excessive synaptic Acetylcholine $\\implies$ **DUMBBELSS Mnemonic**:
    - **D**iarrhea / Diaphoresis, **U**rination, **M**iosis, **B**ronchospasm & Bronchorrhea (deadliest killer!), **B**radycardia, **E**mesis, **L**acrimation, **S**alivation, **S**weating.
  - **Antidotes**:
    - **Atropine**: Competitive antagonist at muscarinic receptors (reverses bronchorrhea, bradycardia, miosis; does NOT fix nicotinic muscle weakness).
    - **Pralidoxime (2-PAM)**: Regenerates active Acetylcholinesterase by cleaving organophosphate before "aging" occurs (reverses nicotinic paralysis).
- **Anticholinergic (Atropine) Toxicity**:
  - *"Hot as a hare (hyperthermia), Blind as a bat (mydriasis/cycloplegia), Dry as a bone (anhidrosis), Red as a beet (flushed skin), Mad as a hatter (delirium), Full as a flask (urinary retention)."*
  - **Antidote**: **Physostigmine** (tertiary amine AChE inhibitor that crosses the blood-brain barrier).

---

## 3. Autonomic Hemodynamic Responses & Dale's Epinephrine Reversal

| Vasopressor / Agonist | Receptor Selectivity | Heart Rate ($HR$) Response | Systolic Blood Pressure ($SBP$) | Diastolic Blood Pressure ($DBP$) | Mean Arterial Pressure ($MAP$) | Peripheral Resistance ($SVR$) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Norepinephrine** | $\\alpha_1 > \\alpha_2 > \\beta_1$ | **$\\downarrow$ Reflex Bradycardia** | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ (Intense Vasoconstriction) |
| **Epinephrine (High Dose)** | $\\alpha_1, \\alpha_2, \\beta_1, \\beta_2$ | $\\uparrow$ Tachycardia | $\\uparrow\\uparrow$ | $\\uparrow$ | $\\uparrow$ | $\\uparrow$ ($\alpha_1$ overrides $\beta_2$) |
| **Epinephrine (Low Dose)** | $\\beta_2 > \\beta_1 > \\alpha_1$ | $\\uparrow$ Tachycardia | $\\uparrow$ | $\\downarrow$ | $\\leftrightarrow / \\downarrow$ | $\\downarrow$ ($\beta_2$ vasodilation) |
| **Epi $+$ $\\alpha$-Blocker (Phenoxybenzamine)** | **Pure $\\beta_1 + \\beta_2$ Unmasked** | $\\uparrow\\uparrow$ Tachycardia | $\\leftrightarrow / \\downarrow$ | $\\downarrow\\downarrow$ | $\\downarrow\\downarrow$ | $\\downarrow\\downarrow$ (**Epinephrine Reversal!**) |
| **Isoproterenol** | Pure $\\beta_1 = \\beta_2$ | $\\uparrow\\uparrow$ Direct Tachycardia | $\\uparrow$ | $\\downarrow\\downarrow$ | $\\downarrow$ | $\\downarrow\\downarrow$ (Vasodilation) |
| **Phenylephrine** | Pure $\\alpha_1$ | **$\\downarrow\\downarrow$ Marked Reflex Bradycardia** | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ | $\\uparrow\\uparrow$ (Pure Vasoconstrictor) |
`,
  clinicalVignettes: [
    {
      scenario: "An experimental animal model is infused with a high-dose IV bolus of Epinephrine, producing a rapid rise in systolic blood pressure from 120 to 180 mmHg and diastolic pressure from 80 to 110 mmHg. Following this, the animal is pretreated with an intravenous non-selective alpha-adrenergic antagonist (Phentolamine). When the same dose of Epinephrine is repeated, the blood pressure changes to 110/50 mmHg (marked decrease in blood pressure).",
      question: "Which of the following pharmacological phenomena explains this altered hemodynamic response?",
      options: [
        "Epinephrine Reversal (unmasking of beta-2 mediated vasodilation)",
        "Tachyphylaxis / Receptor desensitization",
        "Reflex parasympathetic vagal stimulation",
        "Potentiation of muscarinic M3 nitric oxide release"
      ],
      correctAnswerIndex: 0,
      explanation: "Epinephrine stimulates both alpha (alpha-1, alpha-2) and beta (beta-1, beta-2) receptors. At high doses, alpha-1 vasoconstriction normally predominates, increasing SVR and blood pressure. Pretreatment with an alpha-blocker (e.g. Phentolamine or Phenoxybenzamine) completely blocks the alpha-1 vasoconstrictor response, allowing Epinephrine's beta-2 vasodilatory action to proceed unopposed. This produces a net drop in mean arterial pressure, a classic physiological phenomenon known as Dale's Epinephrine Reversal."
    }
  ]
};
