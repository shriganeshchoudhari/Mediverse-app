/**
 * Toxicology Toxidromes, Antidotes & Specific Poisonings (Acetaminophen, Snakebite, CO, Cyanide)
 * Authoritative medical content derived from Goldfrank Toxicologic Emergencies, Rosen, and USMLE Step 2/3 Emergency Medicine.
 * Mapped to NMC CBME Competencies: EM5.1, EM5.2, EM6.1, EM6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TOXICOLOGY_TOXIDROMES_ANTIDOTES_MODULE: PhysiologyLessonModule = {
  id: "em-toxicology-toxidromes-antidotes",
  unitCode: "EM5.1",
  title: "Emergency: Toxicology Toxidromes, Antidotes, Acetaminophen (NAC) & Snakebite Envenomation",
  competencies: ["EM5.1", "EM5.2", "EM6.1", "EM6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Emergency: Toxicology Toxidromes, Antidotes, Acetaminophen (NAC) & Snakebite Envenomation

Rapid identification of toxic syndromes (toxidromes) guides life-saving resuscitation and targeted antidote therapy prior to confirmatory laboratory results.

---

## 1. The 5 Classic Toxidromes

| Toxidrome | Vital Signs | Pupils | Skin / Secretions | Bowel Sounds & CNS | Causative Toxins & Definitive Management |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Cholinergic**<br>*(DUMBELS)* | Bradycardia, Hypotension, Tachypnea | **Pinpoint Miosis** | **Profuse Diaphoresis, Salivation, Lacrimation, Bronchorrhea** | Hyperactive bowel sounds, diarrhea; Coma, fasciculations, seizures | **Organophosphates & Carbamates** (Insecticides, Nerve Agents) $\\implies$ **IV Atropine** (double dose q3-5m until bronchial secretions clear) $+$ **Pralidoxime (2-PAM)**. |
| **Anticholinergic** | Tachycardia, Hyperthermia, Hypertension | **Mydriasis (Dilated)** | **Dry, hot, flushed skin, dry mucous membranes, urinary retention** | Hypoactive / Absent bowel sounds; Delirium, hallucinations (*"Blind as a bat, mad as a hatter, red as a beet, hot as a hare, dry as a bone"*) | **Diphenhydramine, TCAs, Scopolamine, Atropine, Jimsonweed** $\\implies$ Supportive care, cooling, IV Benzodiazepines; **Physostigmine** (if pure anticholinergic delirium; *avoid in TCA wide QRS*). |
| **Sympathomimetic** | Severe Tachycardia, Extreme HTN, Hyperthermia | **Mydriasis (Dilated)** | **Profuse Diaphoresis (Sweaty, wet skin)** | Hyperactive bowel sounds; Agitation, paranoia, tremors, seizures | **Cocaine, Amphetamines, MDMA (Ecstasy), Methamphetamine** $\\implies$ **IV Benzodiazepines (Lorazepam/Diazepam)** $+$ active cooling; **AVOID pure $\\beta$-blockers** (unopposed $\\alpha$-vasoconstriction causes fatal coronary spasm/stroke!). |
| **Opioid** | Bradycardia, Hypotension, Hypothermia, **Bradypnea (RR $< 8$)** | **Pinpoint Miosis** | Normal / Pale, cool | Hypoactive bowel sounds; Lethargy, Stupor, Coma | **Heroin, Morphine, Fentanyl, Oxycodone, Methadone** $\\implies$ **IV/IM/IN Naloxone** (titrate to restore spontaneous respiratory rate $\\ge 12/\\text{min}$, not full consciousness). |
| **Sedative-Hypnotic** | Mild bradycardia/hypotension, Hypoventilation | Normal / Variable | Normal | Hypoactive bowel sounds; Slurred speech, ataxia, CNS depression | **Benzodiazepines, Barbiturates, GHB, Alcohol** $\\implies$ Airway protection & supportive care. *(Flumazenil is generally avoided due to precipitation of refractory withdrawal seizures)*. |

---

## 2. Acetaminophen (Paracetamol) Toxicity & The Rumack-Matthew Nomogram

- **Mechanism**: Therapeutic doses undergo glucuronidation/sulfation. In overdose, pathways saturate $\\rightarrow$ Cytochrome P450 (CYP2E1) converts APAP to toxic **$N$-acetyl-$p$-benzoquinone imine (NAPQI)**, which depletes hepatic **Glutathione**, causing hepatocellular necrosis and centrilobular liver failure.
- **Clinical Stages of APAP Toxicity**:
  - *Stage 1 ($0-24\\text{ h}$)*: Asymptomatic or mild nausea/vomiting.
  - *Stage 2 ($24-72\\text{ h}$)*: "Quiescent phase"; RUQ pain, progressive rise in AST/ALT and bilirubin.
  - *Stage 3 ($72-96\\text{ h}$)*: **Peak Hepatotoxicity**: Fulminant hepatic failure (AST/ALT $>10,000\\text{ U/L}$, Jaundice, Coagulopathy INR $>5$, Hepatic Encephalopathy, Renal failure).
  - *Stage 4 ($4-14\\text{ days}$)*: Recovery or death from multiorgan failure.
- **The Rumack-Matthew Nomogram & N-Acetylcysteine (NAC) Protocol**:
  - Obtain a serum APAP concentration at **$4\\text{ hours}$ post-ingestion**.
  - If the 4-hour level is on or above the treatment line (**$\\ge 150\\text{ }\\mu\\text{g/mL}$ at 4 hours**), immediately initiate **IV N-Acetylcysteine (NAC)**:
    - *NAC Protocol (3-bag IV infusion)*: Loading dose $150\\text{ mg/kg}$ over $1\\text{ h} \\rightarrow 50\\text{ mg/kg}$ over $4\\text{ h} \\rightarrow 100\\text{ mg/kg}$ over $16\\text{ h}$.
    - *Mechanism*: Replenishes hepatic glutathione stores and acts directly as a glutathione substitute to bind and neutralize NAPQI.

---

## 3. Snakebite Envenomation: Viperidae vs Elapidae

- **Viperidae (Vipers - Russell\'s Viper, Saw-Scaled Viper)**:
  - **Pathology**: **Vasculotoxic / Hemotoxic** $\implies$ Local tissue necrosis, severe pain, blistering, systemic coagulopathy, spontaneous hemorrhage, acute kidney injury.
  - **Bedside Diagnostic Test**: **20-Minute Whole Blood Clotting Test (20WBCT)**: Place $2\\text{ mL}$ venous blood in clean glass tube; leave undisturbed for 20 min. If blood fails to clot (liquid when tilted) $\implies$ Systemic envenomation.
  - **Definitive Treatment**: **Polyvalent Anti-Snake Venom (ASV)** (Initial dose: **$10\\text{ vials}$ IV infusion in $500\\text{ mL } 0.9\\%\\text{ NS}$ over 1 hour**; repeat at 6 hours if 20WBCT remains uncoagulated).
- **Elapidae (Cobras, Kraits)**:
  - **Pathology**: **Neurotoxic** $\implies$ Minimal local swelling; early bilateral **Ptosis**, diplopia, dysarthria, bulbar palsy, descending motor paralysis, and fatal respiratory muscle arrest.
  - **Definitive Treatment**: **Polyvalent ASV ($10\\text{ vials}$) $+$ IV Neostigmine ($0.5-2\\text{ mg}$) $+$ IV Atropine ($0.6\\text{ mg}$)** (the "Tensilon-like" anti-myasthenic trial).

---

## 4. Carbon Monoxide (CO) & Cyanide Poisoning

- **Carbon Monoxide (CO) Toxicity**:
  - Smoke inhalation / faulty heaters. Binds hemoglobin with $250\\times$ affinity of $O_2 \\rightarrow$ Carboxyhemoglobin ($COHb$), shifting oxygen-hemoglobin dissociation curve to the **LEFT** (Haldane effect, tissue hypoxia). Standard pulse oximeter reads **falsely normal**!
  - **Treatment**: **$100\\%\\text{ Normobaric } O_2$ via non-rebreather mask** (reduces $t_{1/2}$ of $COHb$ from 300 min to 80 min). **Hyperbaric Oxygen ($HBO_2$)** indicated if $COHb > 25\\%$, loss of consciousness, pregnancy ($COHb > 15\\%$), or severe acidosis.
- **Cyanide ($CN^-$) Poisoning**:
  - Inhibits Cytochrome c Oxidase in mitochondrial electron transport chain $\implies$ cellular histotoxic hypoxia with profound lactic acidosis ($>10\\text{ mmol/L}$) and venous oxygen saturation equal to arterial ($ScvO_2 \\approx 95\\%$).
  - **Antidote of Choice**: **IV Hydroxocobalamin ($5\\text{ g}$)** (binds cyanide to form harmless cyanocobalamin / Vitamin $B_{12}$, excreted in urine).
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old college student is brought to the emergency department by roommates 5 hours after intentionally swallowing 40 tablets of 500 mg Acetaminophen (20 g total) following a severe interpersonal crisis. She is currently nausea-free, alert, and her vital signs are stable. Physical examination shows no jaundice or abdominal tenderness. Baseline labs show AST 28 U/L, ALT 24 U/L, Total Bilirubin 0.8 mg/dL, and INR 1.0. A 5-hour post-ingestion serum acetaminophen concentration returns at 210 ug/mL.",
      question: "Which of the following represents the correct interpretation of the Rumack-Matthew nomogram and immediate management?",
      options: [
        "The APAP level is well above the treatment line (treatment threshold ~130 ug/mL at 5 hours); Initiate intravenous N-Acetylcysteine (NAC) infusion immediately",
        "The patient is asymptomatic with normal transaminases; Discharge home with psychiatric follow-up",
        "Administer single-dose oral activated charcoal and recheck transaminases in 24 hours",
        "The level is non-toxic; Administer intravenous Sodium Bicarbonate"
      ],
      correctAnswerIndex: 0,
      explanation: "On the Rumack-Matthew nomogram, the treatment threshold line starts at 150 ug/mL at 4 hours and is approximately 130 ug/mL at 5 hours. A 5-hour serum acetaminophen level of 210 ug/mL is well above the treatment threshold and predicts severe fulminant hepatotoxicity if untreated. Intravenous N-Acetylcysteine (NAC) must be initiated immediately. NAC replenishes hepatic glutathione stores and binds toxic NAPQI metabolites, conferring nearly 100% hepatoprotection when started within 8 hours of acute ingestion."
    }
  ]
};
