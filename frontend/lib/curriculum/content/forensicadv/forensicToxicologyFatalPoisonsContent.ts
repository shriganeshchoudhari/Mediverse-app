/**
 * Clinical Forensic Pathology: Medicolegal Autopsy Toxicology & Fatal Poisonings
 * Authoritative medical content derived from Goldfrank's Toxicologic Emergencies (11th ed.), Reddy's Essentials.
 * Mapped to NMC CBME Competencies: FM7.1, FM7.2, MD40.4, SU38.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FORENSIC_TOXICOLOGY_FATAL_POISONS_MODULE: PhysiologyLessonModule = {
  id: "forensic-adv-toxicology-fatal-poisons",
  unitCode: "FM7.1",
  title: "Medicolegal Autopsy Toxicology: Carbon Monoxide, Cyanide, Heavy Metals (Arsenic, Lead) & Antidotes",
  competencies: ["FM7.1", "FM7.2", "MD40.4", "SU38.4"],
  estimatedMinutes: 150,
  organ3dTarget: "BRAIN",
  markdownContent: `
# Medicolegal Autopsy Toxicology & Fatal Toxidromes

Forensic toxicology identifies foreign xenobiotics, lethal overdoses, and industrial poisons at autopsy, linking chemical mechanisms to postmortem pathology and clinical antidotes.

---

## 1. High-Yield Medicolegal Poisons & Autopsy Signatures

$$\\begin{array}{lcccc}
\\hline
\\textbf{Toxic Agent} & \\textbf{Biochemical Mechanism} & \\textbf{Postmortem Lividity / Signs} & \\textbf{Key Autopsy Finding} & \\textbf{Definitive Antidote} \\\\
\\hline
\\textbf{Carbon Monoxide} & \\mathbf{\\text{High affinity for Hb (}>200\\times\\text{)}} & \\mathbf{\\text{Bright Cherry-Red Lividity}} & \\mathbf{\\text{Bilateral Globus Pallidus}} & \\mathbf{100\\% \\text{ Normobaric O}_2} \\\\
\\textbf{(CO)} & \\text{Left shift oxy-Hb curve} & (\\text{skin, organs, blood}) & \\text{symmetrical necrosis} & \\text{or Hyperbaric } O_2 \\\\
\\textbf{Cyanide} & \\mathbf{\\text{Inhibits Cytochrome c Oxidase}} & \\mathbf{\\text{Bright Pink / Cherry-Red}} & \\text{Severe metabolic acidosis,} & \\mathbf{\\text{Hydroxocobalamin, or}} \\\\
\\textbf{(HCN / KCN)} & (Fe^{3+}\\text{ in Complex IV}) & \\mathbf{\\text{Bitter almond odor in stomach}} & \\text{high venous } SvO_2 & \\mathbf{\\text{Nitrites + Thiosulfate}} \\\\
\\textbf{Arsenic} & \\text{Pyruvate dehydrogenase inhibition} & \\text{Normal hypostasis;} & \\mathbf{\\text{Aldrich-Mees nail bands;}} & \\mathbf{\\text{Dimercaprol (BAL)}} \\\\
\\textbf{(As)} & (\\text{binds -SH lipoic acid}) & \\text{garlic breath, raindrop skin} & \\text{subendocardial petechiae} & \\text{or Succimer (DMSA)} \\\\
\\textbf{Lead} & \\text{Inhibits ferrochelatase \u0026} & \\text{Normal hypostasis;} & \\mathbf{\\text{Burton blue gingival lines;}} & \\mathbf{\\text{CaNa}_2\\text{EDTA +}} \\\\
\\textbf{(Pb)} & \\delta\\text{-ALA dehydratase} & \\text{basophilic stippling} & \\text{dense metaphyseal X-ray bands} & \\mathbf{\\text{Succimer / Dimercaprol}} \\\\
\\textbf{Organophosphates} & \\mathbf{\\text{Irreversible AChE inhibition}} & \\text{Dark purple hypostasis;} & \\text{Massive pulmonary edema,} & \\mathbf{\\text{Atropine (muscarinic) +}} \\\\
& \\text{Accumulation of acetylcholine} & \\text{pinpoint pupils, garlic/kerosene} & \\text{bronchial foaming secretions} & \\mathbf{\\text{Pralidoxime 2-PAM (nicotinic)}} \\\\
\\hline
\\end{array}$$

---

## 2. Differentiating Carbon Monoxide from Cyanide

- **Carbon Monoxide (CO)**:
  - Binds ferrous ($Fe^{2+}$) iron of hemoglobin forming **Carboxyhemoglobin (COHb)** $\rightarrow$ shifts oxygen dissociation curve leftward, preventing tissue oxygen unloading $\rightarrow$ blood remains bright cherry-red.
  - Neuroimaging / Autopsy hallmark: **Bilateral, symmetrical hemorrhagic necrosis of the Globus Pallidus**.
- **Cyanide (CN)**:
  - Binds ferric ($Fe^{3+}$) iron of mitochondrial **cytochrome c oxidase (Complex IV)** $\rightarrow$ completely halts electron transport chain and aerobic ATP synthesis (**histotoxic hypoxia**).
  - Tissues cannot extract oxygen from arterial blood; venous blood returning to the heart remains fully oxygenated ($SvO_2 \approx 90-95\%$), giving venous blood and postmortem lividity a striking **bright pink / brick-red appearance** accompanied by a distinct **bitter almond odor**.
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old jewelry worker is rushed to the emergency department following a collapse in an electroplating workshop. On arrival, he is comatose, tachypneic, and profoundly hypotensive (blood pressure 70/40 mmHg). Arterial blood gas reveals severe high-anion-gap metabolic acidosis with pH 7.02, PaO2 110 mmHg on room air, and serum lactate 16.5 mmol/L. Central venous blood gas demonstrates a mixed venous oxygen saturation (SvO2) of 94% (normal 65-75%). Physical examination reveals bright pink mucosal membranes, clear lungs, and a faint bitter almond scent on his breath.",
      question: "What is the diagnosis, what is the cellular mechanism of this toxidrome, and what is the definitive first-line antidote?",
      options: [
        "Acute Cyanide Poisoning; Non-competitive inhibition of mitochondrial Cytochrome c Oxidase (Complex IV), halting oxidative phosphorylation (histotoxic hypoxia); Administer Intravenous Hydroxocobalamin immediately",
        "Carbon Monoxide Poisoning; Carboxyhemoglobinemia; Administer Hyperbaric Oxygen",
        "Organophosphate Toxicity; Acetylcholinesterase inhibition; Administer Atropine and Pralidoxime",
        "Diabetic Ketoacidosis; Insulin deficiency; Administer regular insulin infusion and isotonic fluids"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic acute Cyanide Poisoning: (1) Severe high-anion-gap lactic acidosis; (2) Abnormally elevated central venous oxygen saturation (SvO2 >90%) because mitochondrial cytochrome c oxidase (Complex IV) is paralyzed, preventing cells from utilizing oxygen (histotoxic cellular hypoxia); (3) Bright pink skin and mucus membranes due to oxygenated venous blood; (4) Distinct bitter almond breath odor. The first-line preferred antidote is Intravenous Hydroxocobalamin, which directly binds cyanide ions with high affinity to form non-toxic Cyanocobalamin (Vitamin B12), safely excreted in the urine without inducing methemoglobinemia."
    }
  ]
};
