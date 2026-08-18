/**
 * Clinical Anesthesiology Advanced: Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Emulsion Rescue
 * Authoritative anesthesiology content derived from Miller's Anesthesia (9th ed.), ASRA Guidelines.
 * Mapped to NMC CBME Competencies: AN3.1, AN3.2, MD50.2, SU48.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE: PhysiologyLessonModule = {
  id: "anesthesiology-adv-local-anesthetic-toxicity-lipid-rescue",
  unitCode: "AN3.1",
  title: "Local Anesthetic Systemic Toxicity (LAST): Bupivacaine Nav1.5 Blockade & 20% Lipid Emulsion Rescue",
  competencies: ["AN3.1", "AN3.2", "MD50.1", "SU48.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Local Anesthetic Systemic Toxicity (LAST) & 20% Lipid Emulsion Rescue

Accidental intravascular injection or systemic accumulation of local anesthetics can trigger fulminant central nervous system neurotoxicity followed by refractory, lethal cardiovascular collapse requiring the ASRA Lipid Emulsion protocol.

---

## 1. Local Anesthetic Pharmacodynamics \u0026 Cardiotoxicity Profile

$$\\begin{array}{lcccc}
\\hline
\\textbf{Local Anesthetic} & \\textbf{Chemical Class} & \\textbf{Lipophilicity \u0026 Potency} & \\textbf{Metabolic Pathway} & \\textbf{Relative Cardiotoxicity (CC/CNS Ratio)} \\\\
\\hline
\\textbf{Bupivacaine} & \\mathbf{\\text{Amide (two \"i\"s)}} & \\mathbf{\\text{Extreme (Lipophilic)}} & \\text{Hepatic CYP450 (dealkylation)} & \\mathbf{\\text{HIGHEST (CC/CNS ratio } \\approx 2.0)} \\\\
& & (\\text{\"Fast in, slow out\" } Na_V1.5) & & (\\text{Refractory ventricular arrhythmias / asystole}) \\\\
\\textbf{Ropivacaine} & \\text{Amide (S-enantiomer)} & \\text{High potency, pure S-isomer} & \\text{Hepatic CYP1A2 / CYP3A4} & \\text{Intermediate (safer than bupivacaine)} \\\\
\\textbf{Lidocaine} & \\text{Amide (two \"i\"s)} & \\text{Moderate potency} & \\text{Hepatic CYP3A4 (MEGX)} & \\text{Low (CNS toxicity precedes cardiac arrest)} \\\\
\\textbf{Procaine / Tetracaine} & \\text{Ester (one \"i\")} & \\text{Low to high potency} & \\mathbf{\\text{Plasma pseudocholinesterase}} & \\text{PABA metabolite carries high allergy risk} \\\\
\\textbf{Benzocaine} & \\text{Ester (topical spray)} & \\text{Surface mucosal anesthetic} & \\text{Plasma pseudocholinesterase} & \\mathbf{\\text{Triggers METHEMOGLOBINEMIA (MetHb)}} \\\\
& & & & (\\text{Reversed with Methylene Blue 1-2 mg/kg}) \\\\
\\hline
\\end{array}$$

---

## 2. ASRA LAST Management Protocol \u0026 20% Intralipid Dosing

$$\\begin{array}{lcccc}
\\hline
\\textbf{Protocol Step} & \\textbf{Clinical Target} & \\textbf{Intervention / Drug Dosing} & \\textbf{Critical Rule / Avoidance} \\\\
\\hline
\\textbf{Step 1: Immediate Halt} & \\text{Stop local anesthetic} & \\text{Cease injection immediately, call for LAST rescue kit} & \\text{Do not delay calling for Lipid Emulsion} \\\\
\\textbf{Step 2: Airway \u0026 Seizure} & \\text{Prevent hypoxemia / acidosis} & \\mathbf{100\\%\\text{ } O_2\\text{, hyperventilate, IV Midazolam } 1-2\\text{mg}} & \\mathbf{\\text{AVOID large Propofol doses (causes CV collapse)}} \\\\
\\textbf{Step 3: 20\\% Lipid Bolus} & \\mathbf{\\text{Lipid sink / extraction}} & \\mathbf{20\\%\\text{ Lipid Emulsion: } 1.5\\text{ mL/kg IV bolus over } 2-3\\text{m}} & (\\approx 100\\text{ mL for a } 70\\text{ kg patient}) \\\\
\\textbf{Step 4: Lipid Infusion} & \\mathbf{\\text{Myocardial metabolic rescue}} & \\mathbf{\\text{Continuous IV Infusion: } 0.25\\text{ mL/kg/min}} & \\text{Can repeat bolus 1-2x and double infusion to } 0.5 \\\\
\\textbf{Step 5: ACLS Adaptations} & \\text{Modified resuscitation} & \\mathbf{\\text{Low-dose Epinephrine (}\\le 1\\mu\\text{g/kg aliquots)}} & \\mathbf{\\text{STRICTLY AVOID: Vasopressin, Ca-channel /}} \\\\
& & & \\mathbf{\\text{Beta-blockers, Lidocaine, Procainamide}} \\\\
\\hline
\\end{array}$$

- **Maximum Cumulative Lipid Emulsion Dose**: Limit total volume to **$10 - 12\\text{ mL/kg}$ over the first $30\\text{ minutes}$**.
- **Mechanisms of Lipid Rescue**:
  1. **Lipid Sink Theory**: Creates an intravascular lipid phase that captures lipophilic local anesthetic molecules away from target cardiac sodium channels and brain tissue.
  2. **Metabolic Substrate Activation**: Overcomes bupivacaine-induced inhibition of carnitine acyltransferase, restoring myocardial fatty acid $\\beta$-oxidation and ATP synthesis.
  3. **Direct Positive Inotropic Action**: Enhances intracellular calcium transit and cardiac contractility.
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female undergoing an elective rotator cuff repair receives an ultrasound-guided interscalene brachial plexus block with 25 mL of 0.5% Bupivacaine (125 mg). Two minutes after completion of the injection, the patient complains of a metallic taste, perioral numbness, ringing in her ears (tinnitus), and sudden severe lightheadedness. Within 30 seconds, she develops generalized tonic-clonic seizures, loses consciousness, and becomes apneic. The cardiac monitor demonstrates wide-complex ventricular tachycardia (QRS > 180 ms) that rapidly degenerates into pulseless polymorphic ventricular tachycardia/fibrillation with blood pressure 0/0 mmHg.",
      question: "What is the diagnosis, what is the mandatory immediate pharmacologic antidote, and what modifications to standard ACLS resuscitation must be applied?",
      options: [
        "Local Anesthetic Systemic Toxicity (LAST) from Bupivacaine; secure the airway with 100% O2, immediately administer 20% Lipid Emulsion (Intralipid) as an initial IV bolus of 1.5 mL/kg over 2-3 minutes followed by a continuous infusion of 0.25 mL/kg/min; in ACLS resuscitation, strictly AVOID Vasopressin, Beta-Blockers, Calcium Channel Blockers, and Lidocaine, and reduce Epinephrine boluses to <= 1 mcg/kg",
        "Anaphylactic shock; administer IV Epinephrine 1 mg push and IV Diphenhydramine",
        "Aspiration pneumonitis; administer IV Clindamycin and place a nasogastric tube",
        "Simple vasovagal syncope; elevate the legs and administer IV Atropine 0.5 mg"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits fulminant Local Anesthetic Systemic Toxicity (LAST) induced by Bupivacaine: (1) Pathophysiology: Bupivacaine is highly lipid-soluble with slow dissociation kinetics from cardiac Nav1.5 channels ('fast in, slow out'), triggering rapid CNS toxicity (tinnitus, seizures) followed by refractory ventricular arrhythmias and cardiovascular collapse; (2) Specific Antidote (20% Lipid Emulsion): ASRA guidelines mandate an immediate IV bolus of 20% Lipid Emulsion at 1.5 mL/kg (~100 mL for 70 kg) over 2-3 minutes, followed by a continuous infusion of 0.25 mL/kg/min (can repeat bolus and increase infusion to 0.5 mL/kg/min; max cumulative 10-12 mL/kg over 30 min); (3) ACLS Modifications: Avoid Vasopressin, Lidocaine, Beta-blockers, and Calcium channel blockers, and reduce Epinephrine doses to small increments (≤1 mcg/kg) to prevent worsening intractable arrhythmias."
    }
  ]
};
