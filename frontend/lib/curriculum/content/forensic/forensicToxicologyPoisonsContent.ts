/**
 * Forensic Toxicology & Iconic Poisons Learning Content
 * Authoritative medical content derived from Reddy, Parikh, Knight, and USMLE / PG Entrance.
 * Mapped to NMC CBME Competencies: FM8.1, FM8.2, FM8.3, FM8.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FORENSIC_TOXICOLOGY_POISONS_MODULE: PhysiologyLessonModule = {
  id: "for-toxicology",
  unitCode: "FM8.1",
  title: "Forensic Toxicology: Heavy Metals, Cyanide, Carbon Monoxide & Agricultural Poisons",
  competencies: ["FM8.1", "FM8.2", "FM8.3", "FM8.4"],
  estimatedMinutes: 135,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Forensic Toxicology: Heavy Metals, Cyanide, Carbon Monoxide & Agricultural Poisons

Forensic Toxicology investigates the identification, mechanism, autopsy pathology, and quantitative analysis of poisons, drugs, and noxious chemicals in suspected homicides, suicides, and industrial disasters.

---

## 1. Iconic Heavy Metal Poisoning Profiles

| Heavy Metal Poison | Biochemical Target & Pathophysiology | Clinical Hallmarks & Toxidrome | Diagnostic Test & Pathognomonic Signs | First-Line Antidotes |
| :--- | :--- | :--- | :--- | :--- |
| **Arsenic ($As_2O_3$ / White Arsenic)** | Inhibits **Lipoic Acid** and Pyruvate Dehydrogenase; substitutes for phosphate in ATP synthesis | • **Acute**: "Cholera-like" massive rice-water diarrhea, garlic odor of breath, acute renal failure.<br>• **Chronic**: **Raindrop hyperpigmentation** of skin, hyperkeratosis of palms/soles, peripheral sensorimotor neuropathy. | **Aldrich-Mees Lines** (transverse white bands on fingernails); Reinsch & Marsh tests; detected in hair and bone decades post-mortem. | **Dimercaprol (BAL)** or **DMSA (Succimer)** |
| **Lead ($Pb$ / Plumbism)** | Inhibits **$\\delta$-ALA Dehydratase** and **Ferrochelatase** $\\implies$ halts heme synthesis | Microcytic sideroblastic anemia, severe abdominal colic ("Lead Colic"), wrist drop & foot drop (radial/peroneal motor neuropathy), lead encephalopathy in children. | **Burtonian Line** (blue-purple lead sulfide line at gingival-tooth margin); **Basophilic Stippling** on peripheral blood smear; dense metaphyseal "Lead Bands" on long bone X-rays. | **Calcium Disodium EDTA**, **Dimercaprol (BAL)**, or **Succimer (DMSA)** in children |
| **Mercury ($Hg$ / Hydrargyrum)** | Binds sulfhydryl ($-SH$) groups of cellular enzymes $\\implies$ widespread necrosis | • Acute: Corrosive gastroenteritis, acute tubular necrosis.<br>• Chronic: **Erethism Mercurialis** (Mad Hatter syndrome: timidity, severe emotional lability, social phobia), coarse intention tremors (**"Hatter\'s Shakes"**), **Acrodynia (Pink Disease)** in infants. | **Mercuria Lentis** (grayish-brown discoloration on anterior lens capsule under slit-lamp). | **Dimercaprol (BAL)** or **DMSA / DMPS** |

---

## 2. Asphyxiant Gases: Carbon Monoxide vs Cyanide

| Characteristic | Carbon Monoxide ($CO$) | Cyanide ($HCN$ / Potassium Cyanide) |
| :--- | :--- | :--- |
| **Source & Exposure** | Incomplete combustion of hydrocarbons (house fires, charcoal heaters in closed rooms, faulty water geysers, motor car exhaust) | Electroplating, jewelry cleaning, cassava/bitter almond ingestion, industrial fire smoke |
| **Biochemical Mechanism** | Binds **Hemoglobin with $200\\text{–}250\\times$ higher affinity than Oxygen** $\\implies$ forms **Carboxyhemoglobin ($CO\\text{-}Hb$)**; causes severe left-shift of oxyhemoglobin dissociation curve (inhibits $O_2$ release). | **Inhibits Cytochrome $c$ Oxidase ($aa_3$)** in mitochondrial electron transport chain $\\implies$ halts cellular ATP generation $\\implies$ **Histotoxic Anoxia** (tissues cannot utilize delivered oxygen). |
| **Autopsy Findings** | **Cherry-Red Post-Mortem Lividity**, bright red musculature, **Bilateral Symmetrical Necrosis of the Globus Pallidus** in brain basal ganglia. | **Brick-Red / Pink Lividity**, **Bitter Almond Odor** on opening body cavities, engorged bright red venous blood, gastric mucosal erosion. |
| **Specific Antidote Regimen** | **$100\\%$ High-Flow Normobaric Oxygen** (reduces $t_{1/2}$ from $300\\text{ min}$ to $90\\text{ min}$) or **Hyperbaric Oxygen ($HBO$)** (reduces $t_{1/2}$ to $30\\text{ min}$). | 1. **Hydroxocobalamin** (first-line: binds cyanide to form cyanocobalamin/Vitamin B12).<br>2. **Cyanide Antidote Kit**: Amyl Nitrite + Sodium Nitrite (induces MetHb which sequesters cyanide) followed by **Sodium Thiosulfate** (enhances rhodanese conversion to thiocyanate). |

---

## 3. High-Yield Agricultural & Plant Poisons

- **Aluminum Phosphide (Celphos)**:
  - Grain preservative tablet that releases lethal **Phosphine Gas ($PH_3$)** upon contact with atmospheric moisture or gastric hydrochloric acid.
  - Mechanism: Inhibits Cytochrome $c$ Oxidase $\\implies$ profound cellular hypoxia, **fatal refractory cardiogenic shock**, and acute metabolic acidosis.
  - Autopsy: **Garlic / decaying fish odor**; silver nitrate paper test over gastric contents turns **black**.
- **Strychnine (*Strychnos nux-vomica*)**:
  - Competitive antagonist of **Glycine Receptors** on Renshaw interneurons in spinal cord.
  - Produces violent reflex tetanic convulsions, **Risus sardonicus**, and **Opisthotonos** with fully preserved consciousness until death.
- **Datura fastuosa (*Jimson Weed* / Dhatura)**:
  - Contains **Atropine, Scopolamine, Hyoscyamine** (deliriant / stupefying poison used in robbery).
  - Produces anticholinergic toxidrome (*"Blind as a bat, Mad as a hatter, Dry as a bone, Red as a beet, Hot as a hare"*). Antidote: **Physostigmine**.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old jeweler is found unconscious on the floor of his workshop next to an open bottle of metal-cleaning solution. Paramedics note a faint bitter almond scent on his breath. Arterial blood gas analysis reveals severe lactic acidosis (pH 7.12, lactate 14 mmol/L) with normal PaO2 and bright red venous blood (venous oxygen saturation 92%, indicating complete failure of cellular oxygen extraction).",
      question: "Which of the following is the primary cellular enzyme inhibited by this poison, and what is the preferred first-line antidote?",
      options: [
        "Inhibition of Cytochrome c Oxidase; Treat with Hydroxocobalamin IV",
        "Inhibition of Pyruvate Dehydrogenase; Treat with Dimercaprol",
        "Inhibition of Delta-ALA Dehydratase; Treat with Calcium Disodium EDTA",
        "Inhibition of Acetylcholinesterase; Treat with Atropine + Pralidoxime"
      ],
      correctAnswerIndex: 0,
      explanation: "Cyanide poisoning occurs in jewelry/electroplating workers and halts cellular aerobic respiration by binding and inhibiting mitochondrial Cytochrome c Oxidase (complex IV). This produces histotoxic anoxia where cells cannot extract oxygen, resulting in bright red venous blood and severe lactic acidosis. Hydroxocobalamin is the preferred first-line antidote because it binds cyanide directly to form non-toxic cyanocobalamin (Vitamin B12) excreted in urine."
    }
  ]
};
