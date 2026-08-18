/**
 * Cardiovascular & Renal Pharmacology Learning Content
 * Authoritative medical content derived from Katzung, Goodman & Gilman, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PH2.1, PH2.2, PH2.3, PH2.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CARDIOVASCULAR_RENAL_PHARM_MODULE: PhysiologyLessonModule = {
  id: "pharm-cardiorenal",
  unitCode: "PH2.1",
  title: "Cardiovascular & Renal Pharmacology: Antihypertensives, Diuretics & Antiarrhythmics",
  competencies: ["PH2.1", "PH2.2", "PH2.3", "PH2.4"],
  estimatedMinutes: 140,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Cardiovascular & Renal Pharmacology: Antihypertensives, Diuretics & Antiarrhythmics

Cardiovascular pharmacology targets hemodynamics, inotropy, electrophysiology, and renal fluid-electrolyte balance.

---

## 1. Major Diuretic Classes & Nephron Target Sites

| Diuretic Class | Nephron Segment & Target Transporter | Mechanism & Electrolyte Changes | Classic Clinical Uses & High-Yield Adverse Effects |
| :--- | :--- | :--- | :--- |
| **Loop Diuretics** (Furosemide, Torsemide, Bumetanide) | **Thick Ascending Limb (TAL)**: Inhibits $\\text{Na}^+/\\text{K}^+/2\\text{Cl}^-$ cotransporter (NKCC2) | Abolishes corticomedullary osmotic gradient; $\\uparrow \\text{Na}^+, \\text{K}^+, \\text{Cl}^-, \\text{Ca}^{2+}, \\text{Mg}^{2+}$ excretion | • **Acute Pulmonary Edema**, Heart Failure, Cirrhosis, Refractory Hypertension.<br>• **Adverse Effects (OH DANG!)**: **O**totoxicity, **H**ypokalemia, **D**ehydration, **A**llergy (sulfa), **N**ephritis, **G**out (hyperuricemia). |
| **Thiazide Diuretics** (Hydrochlorothiazide, Chlorthalidone) | **Early Distal Convoluted Tubule (DCT)**: Inhibits $\\text{Na}^+/\\text{Cl}^-$ cotransporter (NCCT) | Blocks $\\text{Na}^+/\\text{Cl}^-$ reabsorption; $\\uparrow \\text{Ca}^{2+}$ reabsorption via basolateral $\\text{Na}^+/\\text{Ca}^{2+}$ exchanger | • **First-line Essential Hypertension**, Nephrolithiasis (hypercalciuria), Nephrogenic DI.<br>• **Adverse Effects (HyperGLUC)**: **Hyper**glycemia, **Hyper**lipidemia, **Hyper**uricemia, **Hyper**calcemia, **Hypo**kalemic metabolic alkalosis. |
| **Potassium-Sparing Diuretics** (Spironolactone, Eplerenone, Amiloride) | **Cortical Collecting Tubule (CCT)**: Aldosterone receptor antagonism (Spironolactone/Eplerenone) or direct ENaC block (Amiloride/Triamterene) | $\\downarrow \\text{Na}^+$ reabsorption, $\\downarrow \\text{K}^+$ and $\\text{H}^+$ excretion $\\implies$ prevents hypokalemia | • **Heart Failure with reduced Ejection Fraction (HFrEF - mortality reduction)**, Hyperaldosteronism (Conn syndrome), Ascites.<br>• **Adverse Effects**: **Hyperkalemia**, Gynecomastia / Anti-androgen effects (Spironolactone, avoided by Eplerenone). |
| **Carbonic Anhydrase Inhibitors** (Acetazolamide) | **Proximal Convoluted Tubule (PCT)**: Inhibits luminal & cytosolic Carbonic Anhydrase | Blocks $\\text{NaHCO}_3$ reabsorption $\\implies \\uparrow \\text{HCO}_3^-$ excretion, urine alkalinization | • **Acute Mountain Sickness**, Open-angle Glaucoma, Metabolic alkalosis.<br>• **Adverse Effects**: Hyperchloremic metabolic acidosis, calcium phosphate stones. |

---

## 2. Antihypertensive & Heart Failure Pharmacotherapies

- **ACE Inhibitors (Lisinopril, Enalapril, Ramipril)**:
  - Inhibit Angiotensin Converting Enzyme $\\implies \\downarrow \\text{Angiotensin II}, \\downarrow \\text{Aldosterone}$, and **$\\uparrow \\text{Bradykinin}$** (responsible for **dry cough** and life-threatening **angioedema**).
  - *Mortality benefit in HFrEF and diabetic nephropathy renoprotection (delays microalbuminuria)*; **Absolute Teratogen** (renal dysgenesis, oligohydramnios / Potter sequence).
- **Angiotensin Receptor Blockers (ARBs - Losartan, Valsartan)**:
  - Block $AT_1$ receptors directly without altering bradykinin metabolism (NO cough or bradykinin-mediated angioedema).
- **Calcium Channel Blockers (CCBs)**:
  - **Dihydropyridines (Amlodipine, Nifedipine)**: Vascular smooth muscle selective $\\implies$ arteriolar vasodilation (adverse effect: peripheral ankle edema, reflex tachycardia).
  - **Non-Dihydropyridines (Verapamil, Diltiazem)**: Cardiac nodal/myocardial selective $\\implies$ negative inotropy/chronotropy (contraindicated in severe HFrEF or AV block; Verapamil causes **severe constipation**).
- **Angiotensin Receptor-Neprilysin Inhibitors (ARNI - Sacubitril/Valsartan)**:
  - Sacubitril inhibits Neprilysin $\\implies \\uparrow$ B-type natriuretic peptide ($BNP$) and bradykinin $\\implies$ superior mortality reduction in HFrEF.

---

## 3. Vaughan Williams Antiarrhythmic Classification

| Class & Electrophysiological Mechanism | Iconic Drug Agents | Action Potential Duration & ECG Effects | High-Yield Clinical Indications & Toxicities |
| :--- | :--- | :--- | :--- |
| **Class IA (Moderate $\\text{Na}^+$ Block $+$ $\\text{K}^+$ Block)** | **Quinidine, Procainamide, Disopyramide** | $\\uparrow$ Action Potential Duration (APD), $\\uparrow$ Effective Refractory Period (ERP), **$\\uparrow$ QT interval** | • Procainamide: Re-entrant SVT, WPW syndrome; **Drug-Induced Lupus (anti-histone antibodies)**.<br>• Quinidine: Cinchonism (tinnitus, headache), thrombocytopenia, Torsades de pointes. |
| **Class IB (Weak $\\text{Na}^+$ Block, Fast Dissociation)** | **Lidocaine, Mexiletine** | **$\\downarrow$ APD** and ERP; preferential binding to ischemic/depolarized Purkinje tissue | • **Post-Myocardial Infarction Ventricular Arrhythmias** & digitalis-induced arrhythmias.<br>• Adverse Effects: CNS toxicity (tremor, seizures, paresthesias). |
| **Class IC (Strong $\\text{Na}^+$ Block, Slow Dissociation)** | **Flecainide, Propafenone** | Unchanged APD; marked **$\\uparrow$ QRS duration**; no effect on QT | • Refractory atrial fibrillation; **Contraindicated in ischemic heart disease / structural heart disease (proarrhythmic!)**. |
| **Class II ($\\beta$-Blockers)** | **Metoprolol, Esmolol, Propranolol** | $\\downarrow$ SA and AV nodal Phase 4 diastolic depolarization $\\implies \\downarrow$ Heart Rate | • Rate control in atrial fibrillation, SVT; HFrEF mortality reduction. |
| **Class III ($\\text{K}^+$ Channel Blockers)** | **Amiodarone, Sotalol, Dofetilide, Ibutilide** | **$\\uparrow\\uparrow$ APD, $\\uparrow\\uparrow$ ERP, $\\uparrow\\uparrow$ QT Interval** | • Amiodarone: Broadest antiarrhythmic; **Multi-organ Toxicities**: Pulmonary Fibrosis, Hypo/Hyperthyroidism (40% iodine by weight), Corneal microdeposits, Hepatotoxicity, Blue-gray skin discoloration. |
| **Class IV (Non-DHP CCBs)** | **Verapamil, Diltiazem** | $\\downarrow$ AV nodal conduction velocity, $\\uparrow$ PR interval | • Prevention and acute termination of nodal SVT, atrial fibrillation rate control. |
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old female with long-standing poorly controlled hypertension and type 2 diabetes mellitus is started on Lisinopril. Three weeks later, she returns to the clinic reporting a persistent, dry, hacking cough that keeps her awake at night. She has no fever, wheezing, dyspnea, or chest pain. Her serum creatinine is 1.0 mg/dL, and potassium is 4.6 mEq/L.",
      question: "Which of the following mediators is responsible for this patient's adverse effect, and which drug class should be substituted?",
      options: [
        "Elevated Bradykinin; Switch to an Angiotensin Receptor Blocker (Losartan)",
        "Elevated Angiotensin II; Switch to Amlodipine",
        "Elevated Substance P; Switch to Spironolactone",
        "Decreased Prostacyclin; Switch to Hydrochlorothiazide"
      ],
      correctAnswerIndex: 0,
      explanation: "ACE inhibitors prevent the breakdown of both bradykinin and substance P in the lungs, leading to bronchial irritation and a dry cough in up to 15% of patients. Angiotensin Receptor Blockers (ARBs like Losartan) block the AT1 receptor directly without inhibiting ACE, allowing normal bradykinin metabolism and eliminating the cough while maintaining equieffective blood pressure control and renoprotection."
    }
  ]
};
