/**
 * Clinical Anesthesiology Advanced: General Anesthetic Pharmacology, Malignant Hyperthermia & PRIS
 * Authoritative anesthesiology content derived from Miller's Anesthesia (9th ed.), MHAUS Guidelines.
 * Mapped to NMC CBME Competencies: AN5.1, AN5.2, MD50.3, SU48.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANESTHETIC_PHARMACOLOGY_MALIGNANT_HYPERTHERMIA_MODULE: PhysiologyLessonModule = {
  id: "anesthesiology-adv-pharmacology-malignant-hyperthermia",
  unitCode: "AN5.1",
  title: "Anesthetic Pharmacology: Propofol (PRIS), Etomidate (Adrenal Suppression), Ketamine & Malignant Hyperthermia (RYR1 / Dantrolene)",
  competencies: ["AN5.1", "AN5.2", "MD50.3", "SU48.3"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Anesthetic Pharmacology: Intravenous Agents, Malignant Hyperthermia & PRIS

Rational selection of intravenous and inhalational anesthetics balances cardiovascular stability, intracranial dynamics, and prompt recognition of the life-threatening hypermetabolic crisis of Malignant Hyperthermia (MH).

---

## 1. Intravenous Induction Agents Pharmacological Comparison

$$\\begin{array}{lcccc}
\\hline
\\textbf{Agent} & \\textbf{Primary Mechanism} & \\textbf{Hemodynamic Profile} & \\textbf{Neuro / Airway Dynamics} & \\textbf{Key Toxicity / Clinical Hallmark} \\\\
\\hline
\\textbf{Propofol} & \\mathbf{\\text{GABA}_A\\text{ Receptor Agonist}} & \\text{Venodilation \u0026 arterial hypotension} & \\text{Decreases } CMRO_2\\text{, ICP, IOP;} & \\mathbf{\\text{Propofol Infusion Syndrome (PRIS):}} \\\\
& (\\text{enhances } Cl^-\\text{ current}) & (\\text{blunts baroreceptor reflex}) & \\text{potent antiemetic; bronchodilation} & \\text{Metabolic acidosis, rhabdomyolysis, shock} \\\\
\\textbf{Etomidate} & \\mathbf{\\text{GABA}_A\\text{ Allosteric Modulator}} & \\mathbf{\\text{HEMODYNAMICALLY STABLE}} & \\text{Decreases } CMRO_2\\text{ and ICP;} & \\mathbf{\\text{Inhibits 11-}\\beta\\text{-hydroxylase}} \\\\
& & (\\text{minimal change in HR, BP, CO}) & \\text{high incidence of myoclonus} & (\\mathbf{\\text{Adrenal steroidogenesis suppression}}) \\\\
\\textbf{Ketamine} & \\mathbf{\\text{Non-competitive NMDA}} & \\mathbf{\\text{Sympathetic stimulation (}\\uarr \\text{HR,}} & \\mathbf{\\text{DISSOCIATIVE ANESTHESIA;}} & \\text{Emergence delirium / vivid dreams} \\\\
& \\text{Receptor Antagonist} & \\uarr \\text{BP, } \\uarr \\text{CO via catecholamine release)} & \\mathbf{\\text{preserves airway reflexes, bronchodilates}} & (\\text{prevented with Benzodiazepines}) \\\\
\\textbf{Dexmedetomidine} & \\mathbf{\\alpha_2\\text{-Adrenergic Agonist}} & \\text{Bradycardia, biphasic BP} & \\text{Sedation mimicking natural non-REM sleep;} & \\text{Arousal-friendly sedation without} \\\\
& (\\text{locus coeruleus activation}) & (\\text{peripheral vasoconstriction } \\rightarrow \\text{ drop}) & \\text{ZERO respiratory depression} & \\text{loss of spontaneous ventilation} \\\\
\\hline
\\end{array}$$

---

## 2. Malignant Hyperthermia (MH) Pathophysiology \u0026 MHAUS Treatment Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Phase} & \\textbf{Pathophysiological Event} & \\textbf{Clinical / Laboratory Sign} & \\textbf{Mandatory Action / Intervention} \\\\
\\hline
\\textbf{Phase 1: Trigger} & \\mathbf{\\text{RYR1 mutation } \\rightarrow \\text{ massive Ca}^{2+}} & \\text{Exposure to volatile inhalational} & \\mathbf{\\text{Immediately HALT volatile agents}} \\\\
& \\text{efflux from sarcoplasmic reticulum} & (\\text{Sevoflurane/Desflurane}) + \\text{ Succinylcholine} & + \\mathbf{\\text{ Succinylcholine; call for MH cart}} \\\\
\\textbf{Phase 2: Early Signs} & \\text{Uncontrolled skeletal muscle metabolism} & \\mathbf{\\text{UNEXPLAINED RAPID RISE IN EtCO}_2} & \\mathbf{\\text{Hyperventilate with 100\\% } O_2} \\\\
& + \\text{ aerobic / anaerobic glycolysis} & \\mathbf{\\text{refractory to minute ventilation; masseter spasm}} & (\\ge 10\\text{ L/min high flow gas}) \\\\
\\textbf{Phase 3: Hypermetabolic} & \\text{ATP depletion, acidosis, myonecrosis} & \\text{Sinus tachycardia, mixed acidosis, } \\uarr K^+, & \\mathbf{\\text{Administer IV Dantrolene Sodium}} \\\\
& & \\text{extreme hyperthermia (late: } \u003e 41^\\circ\\text{C}) & \\mathbf{2.5\\text{ mg/kg rapid IV push (repeat q5-10m)}} \\\\
\\textbf{Phase 4: Resolution} & \\text{Stabilization of ryanodine receptors} & \\text{Targeting EtCO}_2 \\text{ decline, } K^+ \\text{ normalization} & \\text{ICU monitoring for 24-48h (Dantrolene 1 mg/kg)} \\\\
\\hline
\\end{array}$$

- **Ryanodine Receptor 1 (RYR1)**: Autosomal dominant gene defect on chromosome $19\\text{q}13.1$.
- **Dantrolene Sodium Pharmacodynamics**:
  - Direct antagonist of the **ryanodine receptor (RYR1)** channel; halts calcium release from the sarcoplasmic reticulum into the myoplasm without impairing cardiac electrical excitation.
  - **Dosing**: **$2.5\\text{ mg/kg}$ rapid IV push**, repeat every $5-10\\text{ minutes}$ as needed up to a maximum of $10\\text{ mg/kg}$ (often requires $30-40$ vials of traditional Dantrolene or Ryanodex formulation).
`,
  clinicalVignettes: [
    {
      scenario: "A 19-year-old male undergoing emergency open reduction and internal fixation of a fractured femur is induced with Propofol and Succinylcholine, and maintained on Sevoflurane 2.0% in 50% oxygen. Thirty minutes into the surgery, the anesthesiologist notices that the end-tidal CO2 (EtCO2) has risen steadily from 38 mmHg to 78 mmHg despite doubling the minute ventilation on the mechanical ventilator. The patient's heart rate increases from 80 to 148 bpm with frequent ventricular premature beats, and core temperature rises rapidly from 37.1°C to 39.8°C. Blood gas analysis reveals severe mixed metabolic and respiratory acidosis: pH 7.12, PaCO2 76 mmHg, PaO2 180 mmHg, HCO3- 16 mEq/L, Base Deficit -12 mEq/L, and Potassium 6.8 mEq/L. Generalized muscle rigidity is noted on palpation.",
      question: "What is the diagnosis, what is the specific molecular mechanism, and what is the definitive life-saving management protocol?",
      options: [
        "Malignant Hyperthermia (MH) triggered by Sevoflurane and Succinylcholine due to an autosomal dominant RYR1 mutation causing uncontrolled sarcoplasmic calcium efflux; immediately discontinue Sevoflurane, hyperventilate with 100% O2 at >=10 L/min, and administer IV Dantrolene Sodium 2.5 mg/kg rapid IV push while treating hyperkalemia and initiating active cooling",
        "Neuroleptic Malignant Syndrome; administer IV Bromocriptine",
        "Thyroid storm; administer IV Propranolol and Propylthiouracil",
        "Severe sepsis; administer IV Vancomycin and 30 mL/kg saline bolus"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with a fulminant crisis of Malignant Hyperthermia (MH): (1) Pathophysiology: Autosomal dominant mutation in the RYR1 (Ryanodine Receptor 1) gene exposed to triggering volatile halogenated anesthetics (Sevoflurane) and Succinylcholine, triggering massive unregulated calcium release from the sarcoplasmic reticulum; (2) Clinical Hallmarks: The earliest and most sensitive indicator is an unexplained, dramatic rise in end-tidal CO2 (EtCO2) refractory to hyperventilation, accompanied by tachycardia, muscle rigidity, mixed severe acidosis, life-threatening hyperkalemia, and rapid hyperthermia; (3) Life-Saving Protocol: (a) Turn off volatile vaporizers immediately and hyperventilate with 100% O2 at >10 L/min; (b) Rapidly administer IV Dantrolene Sodium 2.5 mg/kg push (blocks RYR1 calcium release), repeating every 5-10 min up to 10 mg/kg; (c) Aggressively treat hyperkalemia and initiate active external cooling."
    }
  ]
};
