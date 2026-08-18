/**
 * Postgraduate Advanced Anesthesiology & Regional Anesthesia: LAST & Lipid Emulsion Rescue
 * Authoritative regional anesthesia content derived from ASRA 2025/2026 Guidelines on Local Anesthetic Systemic Toxicity.
 * Mapped to NMC PG CBME Competencies: PG6.2, AN2.1, AN2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE: PhysiologyLessonModule = {
  id: "pg6-local-anesthetic-toxicity-lipid-rescue",
  unitCode: "PG6.2",
  title: "Local Anesthetic Systemic Toxicity (LAST): Bupivacaine Cardiotoxicity & 20% Lipid Emulsion Protocols",
  competencies: ["PG6.2", "AN2.1", "AN2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Local Anesthetic Systemic Toxicity (LAST) & Lipid Emulsion Rescue

LAST is a life-threatening complication of regional anesthesia resulting from systemic intravascular absorption or accidental injection of local anesthetics, binding myocardial and neural $Na_V1.5$ sodium channels.

---

## 1. Clinical Toxicity Progression & Drug Risk Stratification

$$\\begin{array}{lcccc}
\\hline
\\textbf{Organ System} & \\textbf{Clinical Hallmarks / Sequence} & \\textbf{Pathophysiological Mechanism} & \\textbf{High-Risk Agents} \\\\
\\hline
\\textbf{CNS Toxicity} & \\mathbf{\\text{Perioral tingling, metallic taste, tinnitus,}} & \\text{Inhibition of cortical inhibitory pathways} & \\mathbf{\\text{Bupivacaine}} \\\\
(\\textbf{Early Prodrome}) & \\mathbf{\\text{visual disturbances, tonic-clonic seizures}} & \\rightarrow \\text{uninhibited excitatory neuronal firing} & (\\text{highly lipophilic amino-amide}) \\\\
\\textbf{Cardiovascular} & \\mathbf{\\text{PR/QRS widening, VT/VF, torsades,}} & \\mathbf{\\text{High-affinity fast } Na_V1.5 \\text{ blockade,}} & > \\text{ Levobupivacaine} \\\\
(\\textbf{Late / Severe}) & \\mathbf{\\text{severe negative inotropy, asystolic arrest}} & \\mathbf{\\text{mitochondrial acylcarnitine uncoupling}} & > \\text{ Ropivacaine } > \\text{ Lidocaine} \\\\
\\hline
\\end{array}$$

---

## 2. The ASRA 2025/2026 Lipid Emulsion Rescue Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Lipid Rescue Component} & \\textbf{Standard Dosing Regimen (70 kg Adult)} & \\textbf{Mechanism & Safety Caveats} \\\\
\\hline
\\textbf{20\\% Lipid Emulsion Bolus} & \\mathbf{1.5\\text{ mL/kg IV over 2-3 minutes}} & \\mathbf{\\text{''Lipid Sink'' extraction of lipophilic drug}} \\\\
(\\text{Intralipid 20\\%}) & (\\sim 100\\text{ mL for a } 70\\text{ kg adult}) & \\text{from tissue and direct myocardial inotropic fuel} \\\\
\\textbf{Continuous Infusion} & \\mathbf{0.25\\text{ mL/kg/min}} & \\text{Maintains intravascular lipid concentration;} \\\\
& (\\sim 18\\text{ mL/min or } 1{,}000\\text{ mL/hr}) & \\text{continue for at least 15 min after stability} \\\\
\\textbf{Repeat Bolus / Escalation} & \\mathbf{\\text{Repeat } 1.5\\text{ mL/kg bolus up to 2}\\times} & \\text{If cardiovascular instability or arrest persists;} \\\\
& \\mathbf{\\& \\uparrow \\text{ infusion to } 0.50\\text{ mL/kg/min}} & \\mathbf{\\text{Maximum total dose: } 12\\text{ mL/kg over 30 min}} \\\\
\\textbf{ACLS Modifications} & \\mathbf{\\text{Low-Dose Epinephrine (} \\le 1\\;\\mu\\text{g/kg)}} & \\mathbf{\\text{AVOID Vasopressin, Propofol, Ca-blockers,}} \\\\
& (\\text{give small } 10-100\\;\\mu\\text{g increments}) & \\mathbf{\\& \\text{ Local Anesthetics (Lidocaine/Procainamide)}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old female is undergoing an ultrasound-guided supraclavicular brachial plexus block with 25 mL of 0.5% Bupivacaine (125 mg) for wrist surgery. Two minutes after injection, she reports sudden perioral numbness, a strong metallic taste in her mouth, and loud bilateral tinnitus, rapidly progressing to generalized tonic-clonic seizures. The anesthesiologist administers 2 mg IV Midazolam to abort the seizures. Within 60 seconds, the patient becomes pulseless and the cardiac monitor reveals severe wide-complex polymorphic ventricular tachycardia degenerating into ventricular fibrillation.",
      question: "What is the diagnosis, what is the immediate antidote dosing regimen according to ASRA guidelines, and what specific modification to standard ACLS epinephrine is required?",
      options: [
        "Local Anesthetic Systemic Toxicity (LAST) secondary to intravascular Bupivacaine absorption; initiate chest compressions and administer 20% Lipid Emulsion (Intralipid) immediately: 1.5 mL/kg IV bolus over 2-3 minutes (approx 100 mL), followed by a continuous infusion of 0.25 mL/kg/min (repeat bolus up to 2 times and increase infusion to 0.5 mL/kg/min if arrest persists, max 12 mL/kg); reduce Epinephrine to low-dose increments (<=1 mcg/kg or 10-100 mcg) and avoid Vasopressin, Propofol, and Lidocaine",
        "Anaphylactic shock to local anesthetic; give IV Epinephrine 1 mg push every 3 minutes and high-dose Vasopressin 40 units",
        "Acute myocardial infarction; administer IV Lidocaine 100 mg and high-dose IV Verapamil",
        "Aspiration pneumonitis; start IV broad-spectrum antibiotics only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates classic Local Anesthetic Systemic Toxicity: (1) Pathophysiology: Bupivacaine's high lipid solubility causes fast-in, slow-out myocardial NaV1.5 channel blockade, causing early CNS excitable prodrome followed by refractory ventricular arrhythmias; (2) Lipid Emulsion Rescue: 20% Intralipid acts as a 'lipid sink' to scavenge lipophilic bupivacaine molecules and activates cardiac fatty acid metabolism (1.5 mL/kg bolus + 0.25 mL/kg/min infusion); (3) ACLS Modifications: High-dose epinephrine exacerbates arrhythmias and impairs lipid resuscitation, so low-dose Epi (<=1 mcg/kg) is used, while vasopressin, propofol, and lidocaine are strictly avoided."
    }
  ]
};
