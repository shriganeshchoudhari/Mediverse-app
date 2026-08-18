/**
 * Clinical Toxicology: Toxic Alcohols, Envenomations & Enhanced Elimination Techniques
 * Authoritative medical content derived from Goldfrank's Toxicologic Emergencies (11th ed.), Tintinalli's Emergency Medicine.
 * Mapped to NMC CBME Competencies: TX7.1, TX7.2, TX8.1, TX8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TOXIC_ALCOHOLS_ENVENOMATIONS_ENHANCED_ELIMINATION_MODULE: PhysiologyLessonModule = {
  id: "toxicology-toxic-alcohols-envenomations-enhanced-elimination",
  unitCode: "TX7.1",
  title: "Toxic Alcohols (Methanol/Ethylene Glycol & Fomepizole), Envenomations & Enhanced Toxin Elimination",
  competencies: ["TX7.1", "TX7.2", "TX8.1", "TX8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PHARMACOLOGY",
  markdownContent: `
# Toxic Alcohols, Envenomations & Enhanced Elimination

Toxic alcohols generate lethal metabolites through alcohol dehydrogenase (ADH) oxidation, while severe envenomations trigger neurotoxic paralysis or consumptive coagulopathy.

---

## 1. Toxic Alcohols: Methanol vs Ethylene Glycol vs Isopropanol

| Toxic Alcohol | Common Sources | Toxic Metabolite & Enzyme Pathway | Hallmark Clinical Signs & Organ Toxicity | Diagnostic Laboratory Profile | Specific Antidote & Dialysis |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Methanol (Wood Alcohol)** | Windshield washer fluid, moonshine/illicit liquor, solvents | Methanol $\\rightarrow$ (via ADH) Formaldehyde $\\rightarrow$ **Formic Acid** (mitochondrial cytochrome oxidase poison). | • **Visual**: Papillitis, retinal edema, optic disc hyperemia, **"snowstorm" visual field blindness**.<br>• **Neurologic**: Basal ganglia / **putaminal necrosis** and parkinsonism. | • **High Osmolar Gap ($>10$)** (early).<br>• **High Anion Gap Metabolic Acidosis** with elevated lactate (late). | • **Fomepizole (4-methylpyrazole)** ($15\\text{ mg/kg}$ loading, then $10\\text{ mg/kg}$ q12h) or IV Ethanol.<br>• **Folinic Acid / Leucovorin** ($50\\text{ mg}$ IV q4h) enhances formate clearance.<br>• **Emergent Hemodialysis**. |
| **Ethylene Glycol** | Automotive antifreeze / coolant, de-icing solutions | Ethylene Glycol $\\rightarrow$ (via ADH) Glycolaldehyde $\\rightarrow$ **Glycolic Acid** $\\rightarrow$ **Oxalic Acid**. Oxalate binds calcium $\\implies$ **Calcium Oxalate crystals**. | • **Phase 1 ($0.5-12\\text{h}$)**: Inebriation, CNS depression, nausea.<br>• **Phase 2 ($12-24\\text{h}$)**: Cardiopulmonary failure, tachycardia, pulmonary edema.<br>• **Phase 3 ($24-72\\text{h}$)**: **Acute Kidney Injury / Flank pain** (calcium oxalate monohydrate/dihydrate tubular plugging). | • **High Osmolar Gap** + **High Anion Gap Acidosis**.<br>• **Hypocalcemia** (QTc prolongation, tetany).<br>• **Envelope-shaped Calcium Oxalate crystals in urine**.<br>• Urine fluorescence under Wood's lamp. | • **Fomepizole** or IV Ethanol.<br>• **Pyridoxine (Vit B6) & Thiamine** ($100\\text{ mg}$ IV q6h) shunts glycolic acid to benign metabolites.<br>• **Emergent Hemodialysis**. |
| **Isopropanol (Rubbing Alcohol)** | Disinfectants, hand sanitizers, rubbing alcohol | Isopropanol $\\rightarrow$ (via ADH) **Acetone** (NOT oxidized to an acid!). | • Inebriation ($2\\times$ more intoxicating than ethanol).<br>• Severe hemorrhagic gastritis, ketotic fruity breath, CNS depression. | • **HIGH OSMOLAR GAP with NORMAL ANION GAP & NORMAL GLUCOSE (Positive Serum/Urine Ketones WITHOUT Acidosis!)**. | • **Supportive care only**.<br>• Fomepizole is NOT indicated because acetone is not severely toxic. Dialysis rarely needed. |

$$\\text{Serum Osmolality} = 2[\\text{Na}^+] + \\frac{\\text{Glucose}}{18} + \\frac{\\text{BUN}}{2.8} \\quad \\text{and} \\quad \\text{Osmolar Gap} = \\text{Measured Osmolality} - \\text{Calculated Osmolality}$$

---

## 2. Snakebite & Scorpion Envenomation Protocols

- **Snakebite Syndromes**:
  - **Elapid (Cobra / Krait)**: **Neurotoxic envenomation** (postsynaptic $\\alpha$-neurotoxins or presynaptic $\\beta$-neurotoxins). Presents with early **bilateral ptosis**, diplopia, dysarthria, dysphagia $\\rightarrow$ descending flaccid paralysis and respiratory arrest.
    - *Management*: Immediate **Polyvalent Snake Antivenom (ASV)** (10 vials IV) $+$ **Neostigmine Test** ($0.5 - 2\\text{ mg}$ IV with Atropine $0.6\\text{ mg}$ for cobra postsynaptic block).
  - **Viperid (Russell's Viper / Saw-Scaled Viper)**: **Vasculotoxic / Hemotoxic envenomation** (procoagulants, hemorrhagins). Severe local swelling, blistering, and **Venom-Induced Consumptive Coagulopathy (VICC)**.
    - *Diagnostic Bedside Test*: **20-Minute Whole Blood Clotting Test (20WBCT)** (unclotted blood at 20 min confirms severe coagulopathy).
    - *Management*: **Polyvalent ASV** (repeat doses based on 20WBCT every 6 hours).
- **Scorpion Envenomation (Red Scorpion - *Mesobuthus tamulus*)**:
  - Autonomic storm (massive catecholamine surge) $\\implies$ severe hypertension, peripheral vasoconstriction, acute myocarditis, and **Acute Pulmonary Edema**.
  - **Drug of Choice: Oral Prazosin ($0.5\\text{ mg}$ PO for children, $1\\text{ mg}$ PO for adults)** (alpha-1 blocker decreases systemic vascular resistance and treats pulmonary edema).

---

## 3. Enhanced Toxin Elimination Modalities

1. **Multidose Activated Charcoal (MDAC)**:
   - "Gastrointestinal Dialysis" for drugs undergoing enterohepatic / enteroenteric recirculation.
   - **Mnemonic: "These Drugs Can Prove Poisonous"**:
     - **T**heophylline
     - **D**apsone
     - **C**arbamazepine
     - **P**henobarbital
     - **Q**uinine
2. **Urine Alkalinization ($\\text{IV NaHCO}_3$, urine $\\text{pH } 7.5 - 8.0$)**:
   - Salicylates (Aspirin), Phenobarbital, Methotrexate, Chlorpropamide.
3. **Emergent Hemodialysis (Mnemonic: "I STUMBLE")**:
   - **I**sopropanol (only if severe hypotension)
   - **S**alicylates ($>100\\text{ mg/dL}$ acute or refractory acidosis)
   - **T**heophylline ($>100\\ \\mu\\text{g/mL}$ acute, seizures, arrhythmias)
   - **U**remia / End-stage renal disease
   - **M**ethanol ($>50\\text{ mg/dL}$, visual impairment, severe acidosis)
   - **B**arbiturates (long-acting: Phenobarbital)
   - **L**ithium ($>4\\text{ mEq/L}$ acute, $>2.5\\text{ mEq/L}$ chronic with symptoms)
   - **E**thylene Glycol ($>50\\text{ mg/dL}$, renal failure, severe acidosis)
`,
  clinicalVignettes: [
    {
      scenario: "A 48-year-old male with a history of alcohol use disorder is brought to the emergency department after being found unresponsive in a garage with an open bottle of automotive windshield washer fluid. On examination, he is stuporous. Pupils are sluggishly reactive and dilated. Fundoscopic examination reveals bilateral optic disc hyperemia and retinal edema. Arterial Blood Gas: pH 7.12, PaCO2 24 mmHg, HCO3- 8 mEq/L. Serum sodium: 140 mEq/L, potassium: 4.8 mEq/L, chloride: 100 mEq/L. Measured serum osmolality is 348 mOsm/kg (Calculated osmolality: 295 mOsm/kg; Osmolar gap: 53 mOsm/kg).",
      question: "Which of the following represents the most appropriate immediate medical antidote and definitive elimination therapy for this patient?",
      options: [
        "Intravenous Fomepizole (4-methylpyrazole) plus emergent Hemodialysis",
        "Intravenous N-Acetylcysteine plus Urine Alkalinization",
        "Intravenous Deferoxamine plus Whole Bowel Irrigation",
        "Intravenous Naloxone plus Multidose Activated Charcoal"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is suffering from acute Methanol poisoning (ingestion of windshield washer fluid, profound high anion gap metabolic acidosis, marked osmolar gap >10 mOsm/kg, and pathognomonic optic papillitis/retinal edema from toxic formic acid accumulation). The immediate antidote of choice is Fomepizole (a competitive inhibitor of alcohol dehydrogenase that halts conversion of methanol to toxic formaldehyde and formic acid) combined with emergent Hemodialysis to rapidly clear parent methanol and toxic formic acid and correct the severe metabolic acidosis."
    }
  ]
};
