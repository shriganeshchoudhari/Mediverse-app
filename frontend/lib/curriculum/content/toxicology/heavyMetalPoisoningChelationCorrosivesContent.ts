/**
 * Clinical Toxicology: Heavy Metal Poisoning, Chelation Therapy & Corrosive Ingestions
 * Authoritative medical content derived from Goldfrank's Toxicologic Emergencies (11th ed.), Casarett & Doull's Toxicology.
 * Mapped to NMC CBME Competencies: TX5.1, TX5.2, TX6.1, TX6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEAVY_METAL_POISONING_CHELATION_CORROSIVES_MODULE: PhysiologyLessonModule = {
  id: "toxicology-heavy-metal-poisoning-chelation-corrosives",
  unitCode: "TX5.1",
  title: "Heavy Metal Toxicity (Lead, Mercury, Arsenic, Iron Chelation) & Corrosive Acid/Alkali Ingestions",
  competencies: ["TX5.1", "TX5.2", "TX6.1", "TX6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PHARMACOLOGY",
  markdownContent: `
# Heavy Metal Toxicity, Chelation Protocols & Corrosive Ingestions

Heavy metal cations bind sulfhydryl ($-SH$) groups on functional enzymes, disrupting cellular respiration and metabolic homeostasis.

---

## 1. Heavy Metal Toxicity & Chelation Therapy Matrix

| Heavy Metal | Primary Sources & Biochemical Mechanism | Cardinal Signs, Symptoms & Diagnostic Hallmarks | Chelation Therapy Protocols & Guidelines |
| :--- | :--- | :--- | :--- |
| **Lead ($\text{Pb}$)** | Lead-based paints (pre-1978), batteries, contaminated water, leaded gasoline/smelting.<br>• **Inhibits $\\delta$-Aminolevulinic Acid Dehydratase ($\\delta$-ALAD)** and **Ferrochelatase** $\\implies$ blocks heme synthesis $\\rightarrow$ accumulation of free erythrocyte protoporphyrin. | • **Microcytic Anemia with coarse Basophilic Stippling** on peripheral blood smear.<br>• **Burton lines**: Bluish-purple lead lines along the gingival margin.<br>• **Lead lines on long-bone metaphyses** on X-ray.<br>• **Neurological**: Wrist drop / foot drop (radial/peroneal neuropathy), developmental regression, encephalopathy ($>70 - 100\\ \\mu\\text{g/dL}$).\u003cbr\u003e• **GI**: Colicky lead abdominal pain ("lead colic"), constipation. | • **Blood Lead $45 - 69\\ \\mu\\text{g/dL}$**: **Oral Succimer (Dimercaptosuccinic acid, DMSA)** ($10\\text{ mg/kg}$ PO tid $\\times 5\\text{d}$, then bid $\\times 14\\text{d}$).<br>• **Blood Lead $\\ge 70\\ \\mu\\text{g/dL}$ or Encephalopathy**: **Intramuscular BAL (Dimercaprol)** followed $4\\text{ hours}$ later by **Intravenous $\\text{CaNa}_2\\text{-EDTA}$**. *(Always give BAL first to prevent mobilization of lead into the CNS!)* |
| **Arsenic ($\text{As}$)** | Contaminated groundwater, pesticides, wood preservatives, pressure-treated lumber.<br>• **Inhibits Pyruvate Dehydrogenase** by binding lipoic acid sulfhydryl groups $\\implies$ disrupts Krebs cycle and ATP production. | • **Acute**: **Garlic odor on breath**, severe cholera-like "rice water" diarrhea, vomiting, QTc prolongation $\\rightarrow$ Torsades de pointes.<br>• **Chronic**: **"Raindrop" cutaneous hyperpigmentation**, hyperkeratosis of palms and soles, **Mees lines** (transverse white bands across fingernails), peripheral sensorimotor neuropathy (stocking-glove), squamous cell carcinoma of skin/lung. | • **Acute / Severe Toxicity**: **Intramuscular BAL (Dimercaprol)** ($3 - 5\\text{ mg/kg}$ IM q4h).<br>• **Subacute / Chronic Toxicity**: **Oral Succimer (DMSA)** or **Unithiol (DMPS)**.<br>• Aggressive IV crystalloid hydration. |
| **Mercury ($\text{Hg}$)** | • **Elemental $\\text{Hg}$**: Thermometers, barometers, dental amalgam (inhalation $\\rightarrow$ acute interstitial pneumonitis).<br>• **Inorganic $\\text{Hg}$**: Corrosive gastroenteritis + acute tubular necrosis.<br>• **Organic / Methylmercury**: Bioaccumulated in large predatory fish (tuna, swordfish, shark) $\\implies$ **Minamata Disease** (ataxia, concentric constriction of visual fields, paresthesias, teratogenic cerebral palsy). | • **Erethism Mercurialis**: Extreme emotional lability, erethism, severe shyness, delirium ("Mad as a Hatter").<br>• **Acrodynia ("Pink Disease")**: Painful, erythematous, desquamating palms and soles in children with hypertension and profuse sweating. | • **Inorganic / Elemental Ingestion**: **Oral DMSA (Succimer)** or **IM BAL (Dimercaprol)**.<br>• **Organic Methylmercury**: **Oral DMSA (Succimer)** is the chelator of choice. *(BAL is CONTRAINDICATED in methylmercury poisoning because it redistributes mercury into the brain!)* |
| **Iron ($\text{Fe}$)** | Pediatric ingestion of prenatal / adult multivitamin supplements.<br>• **Mechanism**: Direct corrosive mucosal injury $\\rightarrow$ free radical lipid peroxidation $\\rightarrow$ systemic mitochondrial poison causing uncoupling and metabolic acidosis. | • **Stage 1 ($0-6\\text{h}$)**: Severe hemorrhagic gastritis, vomiting, diarrhea, GI bleeding.<br>• **Stage 2 ($6-24\\text{h}$)**: Latent / quiescent period of false stabilization.<br>• **Stage 3 ($12-48\\text{h}$)**: **Cardiogenic shock, profound high anion gap metabolic acidosis**, acute hepatic failure.<br>• **Stage 4 ($2-5\\text{d}$)**: Fulminant hepatic necrosis, jaundice, coagulopathy.<br>• **Stage 5 ($2-6\\text{w}$)**: Gastric outlet obstruction due to cicatricial pyloric scarring. | • **Abdominal X-Ray**: Visualizes radio-opaque iron tablets in the stomach.<br>• **Whole Bowel Irrigation (WBI)** with Polyethylene Glycol (PEG) for high pill burden.<br>• **Definitive Chelation Antidote**: **Intravenous Deferoxamine** ($15\\text{ mg/kg/h}$ IV infusion). Binds ferric iron ($\\text{Fe}^{3+}$) to form ferrioxamine, creating pathognomonic **"Vin Rosé" (red-orange) urine**! |

---

## 2. Corrosive Ingestions: Acid vs Alkali Emergency Protocols

$$\\begin{array}{lcccc}
\\hline
\\textbf{Corrosive Agent} & \\textbf{Typical Household / Industrial Sources} & \\textbf{Pathophysiologic Mechanism of Injury} & \\textbf{Primary Anatomical Injury Site} \\\\
\\hline
\\textbf{Alkali Ingestion} & \\text{Drain cleaners (NaOH, KOH), Lye, Oven cleaners, Button batteries} & \\mathbf{\\text{Liquefactive Necrosis}}\\text{: Saponifies fats & lyses proteins } \\rightarrow \\text{ Deeper transmural penetration } \\rightarrow \\text{ High perforation risk} & \\mathbf{\\text{Esophagus (Severe stricture risk)}} \\\\
\\textbf{Acid Ingestion} & \\text{Toilet bowl cleaners (HCl), Battery acid (}\\text{H}_2\\text{SO}_4\\text{), Rust removers (HF)} & \\mathbf{\\text{Coagulation Necrosis}}\\text{: Denatures proteins } \\rightarrow \\text{ Forms a protective eschar/coagulum limiting deep penetration} & \\mathbf{\\text{Stomach (Antrum / Pylorus spasm)}} \\\\
\\hline
\\end{array}$$

### Critical Rules of Corrosive Management:
1. **Strictly NPO (Nil Per Os)**.
2. **DO NOT INDUCE EMESIS** (causes secondary chemical burning of the esophagus and pharynx).
3. **DO NOT ADMINISTER CHEMICAL NEUTRALIZING AGENTS** (acid-base neutralization generates massive exothermic heat, worsening thermal tissue destruction!).
4. **DO NOT ADMINISTER ACTIVATED CHARCOAL** (does not bind corrosives; obscures endoscopic visualization).
5. **Emergent Upper Gastrointestinal Endoscopy (EGD)**: Perform within **$12 - 24\\text{ hours}$** of ingestion to grade mucosal injury (Zargar classification) and guide surgical vs conservative management.
`,
  clinicalVignettes: [
    {
      scenario: "A 2-year-old toddler is brought to the emergency department by his mother 1 hour after accidentally swallowing approximately 30 tablets of her prenatal iron sulfate vitamins. The child has had 4 episodes of blood-tinged vomiting and abdominal cramping. On physical examination, the child is irritable and pale. Vital signs: BP 90/55 mmHg, HR 145 bpm. An urgent abdominal radiograph demonstrates multiple radio-opaque densities in the gastric fundus. Serum iron level is 680 mcg/dL (normal: 50-170 mcg/dL).",
      question: "Which of the following interventions represents the specific intravenous chelating antidote of choice for this patient?",
      options: [
        "Intravenous Deferoxamine infusion (forming a water-soluble ferrioxamine complex that produces vin rosé urine)",
        "Intravenous Calcium Disodium EDTA",
        "Oral Dimercaptosuccinic Acid (Succimer)",
        "Intramuscular Dimercaprol (BAL)"
      ],
      correctAnswerIndex: 0,
      explanation: "This child is suffering from acute severe iron toxicity (serum iron >500 mcg/dL with gastrointestinal bleeding and radio-opaque pills on X-ray). The specific parenteral chelator of choice is intravenous Deferoxamine (15 mg/kg/h). Deferoxamine binds free circulating ferric iron (Fe3+) with extremely high affinity, forming the inert, water-soluble complex ferrioxamine, which is excreted by the kidneys and characteristically turns the urine a classic 'vin rosé' (red-orange) color."
    }
  ]
};
