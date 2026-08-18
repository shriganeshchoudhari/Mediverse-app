/**
 * Clinical Toxicology: Toxidromes & Acute Poisoning Resuscitation
 * Authoritative medical content derived from Goldfrank's Toxicologic Emergencies (11th ed.), Nelson's Medical Toxicology.
 * Mapped to NMC CBME Competencies: TX1.1, TX1.2, TX2.1, TX2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TOXIDROMES_ACUTE_POISONING_RESUSCITATION_MODULE: PhysiologyLessonModule = {
  id: "toxicology-toxidromes-acute-poisoning-resuscitation",
  unitCode: "TX1.1",
  title: "Clinical Toxidromes: Cholinergic, Anticholinergic, Sympathomimetic, Opioid & Sedative-Hypnotic Syndromes",
  competencies: ["TX1.1", "TX1.2", "TX2.1", "TX2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PHARMACOLOGY",
  markdownContent: `
# Clinical Toxidromes & Acute Poisoning Resuscitation

A toxidrome (toxic syndrome) is a constellation of physical examination findings, vital sign abnormalities, and neurological signs that points to a specific class of toxin.

---

## 1. The 5 Cardinal Clinical Toxidromes Matrix

| Toxidrome | Causative Toxic Agents | Vital Signs & Physical Examination Findings | Hallmark Neurological & Autonomic Signs | Targeted Antidotes & Management |
| :--- | :--- | :--- | :--- | :--- |
| **Cholinergic (Muscarinic + Nicotinic)** | Organophosphate pesticides (Malathion, Chlorpyrifos), Carbamates, Nerve agents (Sarin, VX), Pilocarpine | **Bradycardia**, **Hypotension**, **Tachypnea / Bronchorrhea**, Hypothermia | **DUMBELS / SLUDGE-M**:<br>• **D**iarrhea / **D**iaphoresis<br>• **U**rination<br>• **M**iosis (pinpoint pupils)<br>• **B**ronchospasm / **B**ronchorrhea / **B**radycardia (**Killer B's**)<br>• **E**mesis<br>• **L**acrimation<br>• **S**alivation / Fasciculations | • **Atropine**: $2 - 5\\text{ mg}$ IV bolus, **doubled every 3-5 minutes until pulmonary secretions are completely dry** (*atropinization*).<br>• **Pralidoxime (2-PAM)**: $1 - 2\\text{ g}$ IV over 30 min (reactivates acetylcholinesterase before enzyme aging). |
| **Anticholinergic (Antimuscarinic)** | Atropine, Scopolamine, Tricyclic antidepressants, Diphenhydramine, *Datura stramonium* (Jimson weed) | **Tachycardia**, **Hypertension**, **Hyperthermia** | **Classic Mnemonic**:<br>• *Blind as a bat* (Mydriasis / Cycloplegia)<br>• *Mad as a hatter* (Delirium, Hallucinations)<br>• *Red as a beet* (Cutaneous flush)<br>• *Hot as a hare* (Hyperthermia)<br>• *Dry as a bone* (**Axillary & oral mucosa bone-dry; NO sweating!**) | • Supportive cooling + IV fluids.<br>• **Physostigmine**: $1 - 2\\text{ mg}$ slow IV over 5 min (central and peripheral acetylcholinesterase inhibitor). **Contraindicated if TCA overdose / wide QRS is suspected!** |
| **Sympathomimetic** | Cocaine, Amphetamines, Methamphetamine, MDMA (Ecstasy), Synthetic cathinones ("bath salts"), Pseudoephedrine | **Severe Tachycardia**, **Severe Hypertension**, **Marked Hyperthermia** | **Mydriasis**, Agitation, Psychosis, Tremors, Seizures, and **PROFOUND DIAPHORESIS (Wet skin vs Dry Anticholinergic!)** | • **IV Benzodiazepines (Diazepam / Lorazepam)** first-line for agitation, seizures, hypertension, and hyperthermia.<br>• Active external cooling.<br>• **AVOID pure $\\beta$-blockers (e.g. Propranolol)** due to risk of unopposed $\\alpha_1$-adrenergic vasoconstriction! |
| **Opioid** | Heroin, Morphine, Fentanyl, Oxycodone, Methadone, Hydromorphone | **Bradypnea (respiratory depression $<8 - 10/\\text{min}$)**, **Bradycardia**, **Hypotension**, Hypothermia | **Pinpoint Miosis**, CNS depression / Coma, Decreased bowel sounds | • **Naloxone (Narcan)**: $0.04 - 0.4\\text{ mg}$ IV/IM/IN titrated to **restore adequate spontaneous ventilation** (avoid precipitating acute severe opioid withdrawal). Continuous infusion for long-acting opioids (Methadone). |
| **Sedative-Hypnotic** | Benzodiazepines, Barbiturates, Zolpidem, Ethanol, GHB | Normal / mild Bradycardia, Normal / mild Hypotension, Hypoventilation | CNS depression, Lethargy, Coma, Slurred speech, Ataxia, Normal / variable pupils | • Airway protection and mechanical ventilation.<br>• **Flumazenil**: $0.2\\text{ mg}$ IV (GABA-A receptor antagonist). **Use with extreme caution! Strictly contraindicated in chronic benzodiazepine users (triggers intractable status epilepticus) or co-ingestion with TCAs.** |

---

## 2. Emergency Poisoning Resuscitation: The Resuscitative ABCD

1. **Airway**: Assess airway reflexes; endotracheal intubation indicated for Glasgow Coma Scale (GCS) $\\le 8$ or loss of protective airway reflexes.
2. **Breathing**: Provide supplemental oxygen; bag-valve-mask or mechanical ventilation for bradypnea / hypoventilation.
3. **Circulation**: Continuous cardiac monitoring, 12-lead ECG (evaluate QRS widening, QTc prolongation, terminal R wave in aVR), IV access, crystalloid boluses for hypotension.
4. **Decontamination**:
   - **Single-Dose Activated Charcoal ($1\\text{ g/kg}$, up to $50\\text{ g}$)**: Administer within **$1\\text{ hour}$ of ingestion** of adsorbable toxins.
   - **Contraindications to Activated Charcoal**: Unprotected airway, corrosive acids/alkalis, hydrocarbons (aspiration chemical pneumonitis), heavy metals (iron, lithium, lead do not bind charcoal), toxic alcohols.
   - **Gastric Lavage**: Generally NOT recommended due to perforation and aspiration risks; reserved only for life-threatening ingestions within $60\\text{ minutes}$.
`,
  clinicalVignettes: [
    {
      scenario: "A 23-year-old male is brought to the emergency department after collapsing at an outdoor music festival. On arrival, he is delirious, agitated, and picking at imaginary objects in the air. Vital signs: BP 168/98 mmHg, HR 138 bpm, RR 20/min, Temp 39.4°C (103.0°F). Physical examination demonstrates wildly dilated pupils (8 mm bilaterally), hot and flushed skin, completely dry axillae and oral mucous membranes, and absent bowel sounds.",
      question: "Which of the following toxidromes is this patient exhibiting, and what physical examination finding definitively differentiates it from a sympathomimetic toxidrome?",
      options: [
        "Anticholinergic Toxidrome; Completely dry axillae and skin (absence of diaphoresis)",
        "Sympathomimetic Toxidrome; Presence of pupillary mydriasis",
        "Cholinergic Toxidrome; Elevated core body temperature",
        "Opioid Toxidrome; Depressed level of consciousness"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with the classic Anticholinergic Toxidrome ('mad as a hatter, red as a beet, hot as a hare, dry as a bone, blind as a bat'). Both anticholinergic and sympathomimetic toxicity cause hyperthermia, tachycardia, hypertension, agitation, and dilated pupils (mydriasis). The critical physical examination differentiator is sweat gland activity: Anticholinergic toxicity blocks muscarinic receptors on eccrine sweat glands, resulting in bone-dry skin and dry axillae, whereas Sympathomimetic toxicity causes profound, profuse diaphoresis."
    }
  ]
};
