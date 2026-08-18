/**
 * Clinical Toxicology: Signature Drug Overdoses & Targeted Antidote Protocols (APAP, Salicylates, TCAs, Digoxin)
 * Authoritative medical content derived from Goldfrank's Toxicologic Emergencies (11th ed.), Tintinalli's Emergency Medicine.
 * Mapped to NMC CBME Competencies: TX3.1, TX3.2, TX4.1, TX4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SIGNATURE_DRUG_OVERDOSES_ANTIDOTE_PROTOCOLS_MODULE: PhysiologyLessonModule = {
  id: "toxicology-signature-drug-overdoses-antidote-protocols",
  unitCode: "TX3.1",
  title: "Signature Overdoses & Targeted Antidotes: Acetaminophen (NAC), Salicylates (NaHCO3), TCAs & Digoxin (Fab)",
  competencies: ["TX3.1", "TX3.2", "TX4.1", "TX4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PHARMACOLOGY",
  markdownContent: `
# Signature Overdoses & Targeted Antidotes: Acetaminophen, Salicylates, TCAs & Digoxin

Targeted antidotal protocols prevent irreversible organ toxicity when initiated within optimal therapeutic windows.

---

## 1. High-Yield Overdose Syndromes & Specific Antidotes Matrix

| Toxic Drug Class | Toxic Mechanism & Pathophysiology | Classic Clinical Presentation & Diagnostic Triad | First-Line Antidote & Mechanistic Rationale | Treatment Protocol & Endpoints |
| :--- | :--- | :--- | :--- | :--- |
| **Acetaminophen (Paracetamol, APAP)** | Excess APAP saturates glucuronidation/sulfation $\\rightarrow$ shunted to **CYP2E1** $\\rightarrow$ **$N$-acetyl-$p$-benzoquinone imine (NAPQI)**. NAPQI depletes glutathione $\\rightarrow$ binds hepatocytes $\\rightarrow$ **Centrilobular Hepatic Necrosis (Zone 3)**. | • **Stage 1 ($0-24\\text{h}$)**: Asymptomatic, nausea/vomiting.<br>• **Stage 2 ($24-72\\text{h}$)**: Right upper quadrant pain, $\\uparrow$ AST/ALT ($>10,000\\text{ U/L}$), $\\uparrow$ INR.<br>• **Stage 3 ($72-96\\text{h}$)**: Fulminant hepatic failure, jaundice, coagulopathy, encephalopathy, renal failure.<br>• **Stage 4 ($4-14\\text{d}$)**: Recovery or death. | **$N$-Acetylcysteine (NAC)**:<br>1. Restores hepatic **glutathione** stores.<br>2. Directly binds/detoxifies NAPQI.<br>3. Acts as an antioxidant and free-radical scavenger. | **Rumack-Matthew Nomogram**: Plot APAP level drawn **between $4$ and $24\\text{ hours}$ post-ingestion**. Treatment line starts at **$150\\ \\mu\\text{g/mL}$ ($1000\\ \\mu\\text{mol/L}$) at $4\\text{ hours}$**.<br>• **IV NAC (21-hour 3-bag protocol)**: $150\\text{ mg/kg}$ over 1h, then $50\\text{ mg/kg}$ over 4h, then $100\\text{ mg/kg}$ over 16h.<br>• Most effective when started within **$8\\text{ hours}$** of ingestion. |
| **Salicylates (Aspirin)** | 1. Direct stimulation of medullary respiratory center $\\rightarrow$ **Hyperventilation $\\implies$ Primary Respiratory Alkalosis**.<br>2. **Uncoupling of Oxidative Phosphorylation** in mitochondria $\\rightarrow$ accumulation of lactic acid/ketoacids $\\implies$ **Primary High Anion Gap Metabolic Acidosis**.<br>3. Result: **Mixed Respiratory Alkalosis & Metabolic Acidosis**. | • **Tinnitus / Vertigo** (early hallmark).<br>• Tachypnea / Hyperpnea.<br>• Hyperthermia, Diaphoresis.<br>• Non-cardiogenic pulmonary edema, altered mental status, seizures, coma. | **Intravenous Sodium Bicarbonate ($\\text{NaHCO}_3$)**:<br>• **Urine Alkalinization**: Alkalinizing urine to **$\\text{pH } 7.5 - 8.0$ traps ionized salicylate ($\text{SA}^-$) in renal tubules**, preventing reabsorption and multiplying renal elimination $>10$-fold.<br>• **Serum Alkalinization ($\\text{pH } 7.45 - 7.55$)**: Prevents non-ionized salicylic acid from crossing the blood-brain barrier. | • Protocol: $100 - 150\\text{ mEq } \\text{NaHCO}_3$ in $1\\text{ L D5W}$ with $40\\text{ mEq KCl}$ at $200\\text{ mL/h}$.<br>• **Emergent Hemodialysis Indications**: Serum salicylate $>100\\text{ mg/dL}$ (acute) or $>60\\text{ mg/dL}$ (chronic), altered mental status/seizures, pulmonary edema, or refractory metabolic acidosis. |
| **Tricyclic Antidepressants (TCAs: Amitriptyline, Nortriptyline)** | 1. **Blockade of Cardiac Fast Sodium Channels ($I_{Na}$)** $\\rightarrow$ slows Phase 0 depolarization $\\implies$ **Intraventricular conduction delay & QRS widening**.<br>2. $I_{Kr}$ potassium channel blockade $\\rightarrow$ prolonged QTc.<br>3. Alpha-1 adrenergic blockade $\\rightarrow$ hypotension.<br>4. Muscarinic blockade $\\rightarrow$ anticholinergic syndrome.<br>5. GABA-A antagonism $\\rightarrow$ seizures. | • **Triad**: Altered mental status / Coma, **Seizures**, and **Cardiac Arrhythmias**.<br>• **Hallmark ECG Signs**:<br>  - **QRS $>100\\text{ ms}$**: Predicts **$34\\%$ seizure risk**.<br>  - **QRS $>160\\text{ ms}$**: Predicts **$50\\%$ risk of life-threatening ventricular arrhythmias**.<br>  - **Prominent Terminal R wave in aVR $\\ge 3\\text{ mm}$** (or $R/S$ ratio in aVR $>0.7$). | **Hypertonic Sodium Bicarbonate ($\\text{NaHCO}_3$)**:<br>1. **Sodium Load**: Overcomes competitive sodium channel blockade.<br>2. **Alkalinization (target serum $\\text{pH } 7.50 - 7.55$)**: Increases un-ionized TCA, decreasing binding affinity to the myocardial sodium channel. | • Protocol: **$1 - 2\\text{ mEq/kg}$ IV bolus (repeat until QRS narrows $<100\\text{ ms}$)**, followed by continuous maintenance infusion.<br>• **Contraindications**: Class IA (Quinidine, Procainamide) and Class IC (Flecainide) antiarrhythmics are strictly contraindicated! Physostigmine is contraindicated (causes asystole). |
| **Digoxin (Cardiac Glycosides)** | Inhibits myocardial **$\\text{Na}^+/\\text{K}^+\\text{-ATPase}$** $\\rightarrow$ intracellular $\\text{Na}^+$ accumulation $\\rightarrow$ reverses $\\text{Na}^+/\\text{Ca}^{2+}$ exchanger $\\rightarrow$ increased intracellular $\\text{Ca}^{2+}$ (positive inotropy). Concurrently causes **Hyperkalemia** (potassium cannot enter cells). | • **Visual**: Yellow-green xanthopsia (halos around lights).<br>• **GI**: Nausea, vomiting, abdominal pain.<br>• **Cardiovascular**: PVCs, junctional bradycardia, **Bidirectional Ventricular Tachycardia**.<br>• **Potassium level is the strongest prognostic indicator of mortality in acute toxicity!** | **Digoxin-Specific Fab Antibody Fragments (Digibind / DigiFab)**:<br>Directly binds free intravascular digoxin with high affinity, neutralizing toxicity. | • **Indications for Digifab**:<br>  1. Any life-threatening ventricular arrhythmia or severe bradycardia unresponsive to atropine.<br>  2. Serum $\\text{K}^+ > 5.0 - 5.5\\text{ mEq/L}$ in acute toxicity.<br>  3. Acute ingestion $>10\\text{ mg}$ in adults ($>4\\text{ mg}$ in children) or serum digoxin $>10 - 15\\text{ ng/mL}$.<br>• Empiric dose: $10 - 20\\text{ vials}$ IV for acute cardiac arrest. |

---

## 2. Beta-Blocker & Calcium Channel Blocker Overdose Antidotes

- **Beta-Blocker Toxicity**:
  - **First-Line Antidote: High-Dose Insulin Euglycemia Therapy (HIET)** ($1\\text{ unit/kg}$ bolus followed by $0.5 - 1.0\\text{ unit/kg/h}$ with D10W/D50W infusion) $+$ **Intravenous Glucagon ($5 - 10\\text{ mg}$ IV bolus)**. Glucagon stimulates adenylate cyclase via non-beta receptors, increasing intracellular cAMP and myocardial contractility.
- **Calcium Channel Blocker (CCB) Toxicity**:
  - **IV Calcium Gluconate / Calcium Chloride** ($10-20\\text{ mL } 10\%$) $+$ **High-Dose Insulin Euglycemia Therapy (HIET)** $+$ **Intravenous Lipid Emulsion (ILE $20\%$)** for lipophilic CCBs (Verapamil, Amlodipine).
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female is brought to the emergency department 2 hours after an intentional overdose of Amitriptyline. On arrival, she is lethargic and disoriented. Vital signs: BP 82/48 mmHg, HR 128 bpm, RR 16/min. The 12-lead ECG demonstrates sinus tachycardia with a widened QRS duration of 142 ms and a prominent terminal R wave measuring 4 mm in lead aVR.",
      question: "Which of the following is the most appropriate immediate pharmacotherapy to prevent fatal ventricular dysrhythmias and seizures in this patient?",
      options: [
        "Intravenous bolus of hypertonic Sodium Bicarbonate (1-2 mEq/kg) targeting a serum pH of 7.50 to 7.55",
        "Intravenous Physostigmine (1 mg over 5 minutes)",
        "Intravenous Amiodarone infusion (150 mg over 10 minutes)",
        "Intravenous Procainamide bolus (15 mg/kg)"
      ],
      correctAnswerIndex: 0,
      explanation: "Tricyclic antidepressants block myocardial fast inward sodium channels (INa), slowing Phase 0 depolarization and producing QRS widening (>100 ms predicts seizures; >160 ms predicts ventricular tachycardia/fibrillation) and a prominent terminal R wave in lead aVR (>=3 mm). The definitive first-line therapy is IV hypertonic Sodium Bicarbonate (1-2 mEq/kg boluses), which provides a high extracellular sodium load to overcome channel blockade and raises serum pH to 7.50-7.55, reducing drug binding to the receptor. Physostigmine and Class IA/IC antiarrhythmics are strictly contraindicated due to the risk of triggering asystole and fatal arrhythmias."
    }
  ]
};
