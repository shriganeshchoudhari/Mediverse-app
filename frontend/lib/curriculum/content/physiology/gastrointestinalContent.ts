/**
 * Gastrointestinal Physiology Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.), Costanzo, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PY4.1, PY4.2, PY4.3, PY4.4, PY4.5
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const GASTROINTESTINAL_MODULE: PhysiologyLessonModule = {
  id: "phys-gastrointestinal",
  unitCode: "PY4.1",
  title: "Gastrointestinal Secretions, Motility & Enteric Regulation",
  competencies: ["PY4.1", "PY4.2", "PY4.3", "PY4.4"],
  estimatedMinutes: 105,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Gastrointestinal Secretions, Motility & Enteric Regulation

The gastrointestinal tract coordinates motility, enzymatic secretion, digestion, and nutrient absorption through the integration of the **Enteric Nervous System (ENS)**, autonomic reflexes, and gastrointestinal peptide hormones.

---

## 1. Gastric Parietal Cell Acid Secretion Mechanics

Parietal cells in the gastric fundus and corpus secrete hydrochloric acid ($\\text{HCl}$) against a steep concentration gradient ($[H^+]$ is **3 million times higher** in gastric juice than in arterial blood; gastric pH $\\approx 0.8 - 1.5$):

$$\\text{Intracellular: } \\text{CO}_2 + \\text{H}_2\\text{O} \\xrightleftharpoons{\\text{Carbonic Anhydrase}} \\text{H}^+ + \\text{HCO}_3^-$$

- **Apical Secretion**: $H^+/K^+$ ATPase pump (Proton Pump; inhibited irreversibly by **Omeprazole, Pantoprazole**) pumps $H^+$ into the gastric lumen in exchange for $K^+$, while $Cl^-$ diffuses through apical chloride channels.
- **Basolateral Transport**: $\\text{HCO}_3^-$ is extruded into the interstitial capillary blood in exchange for $Cl^-$ (causing the post-prandial **alkaline tide**).

> **Parietal Cell Secretory Regulation Pathways**:
> - **Stimulatory Agonists**:
>   1. **Histamine** (ECL cells) $\rightarrow H_2$ Receptors $\rightarrow G_s \rightarrow$ Adenylyl Cyclase $\rightarrow$ cAMP $\rightarrow$ PKA $\rightarrow$ Proton Pump activation.
>   2. **Acetylcholine** (Vagus / ENS) $\rightarrow M_3$ Receptors $\rightarrow G_q \rightarrow$ PLC $\rightarrow \text{IP}_3 / Ca^{2+} \rightarrow$ Proton Pump activation.
>   3. **Gastrin** (G-cells in Antrum) $\rightarrow CCK_B$ Receptors $\rightarrow G_q \rightarrow$ PLC $\rightarrow \text{IP}_3 / Ca^{2+} \rightarrow$ Proton Pump activation.
> - **Inhibitory Pathways**:
>   1. **Somatostatin** (D-cells in Antrum) $\rightarrow$ SST Receptors $\rightarrow G_i \rightarrow$ inhibits Adenylyl Cyclase (triggered when luminal pH < 3.0).
>   2. **Prostaglandin $PGE_2 / PGI_2$** $\rightarrow EP_3$ Receptors $\rightarrow G_i$ (stimulates protective mucosal mucus and bicarbonate barrier; blocked by NSAIDs).

---

## 2. Master Gastrointestinal Peptide Hormones

| Hormone | Primary Secretory Cell & Site | Triggering Stimulus | Primary Physiological Actions | Clinical Pathophysiology |
| :--- | :--- | :--- | :--- | :--- |
| **Gastrin** | G-cells (Gastric antrum & duodenum) | Peptides/amino acids, gastric distension, vagal GRP; **inhibited by luminal pH < 1.5** | $\\uparrow$ Gastric $H^+$ secretion, $\\uparrow$ growth of gastric mucosa | **Zollinger-Ellison Syndrome** (Gastrinoma $\\implies$ refractory recurrent peptic ulcers, diarrhea) |
| **Cholecystokinin (CCK)** | I-cells (Duodenum & jejunum) | Fatty acids and monoglycerides, amino acids | $\\uparrow$ Pancreatic enzyme secretion, $\\uparrow$ Gallbladder contraction, $\\downarrow$ Gastric emptying, relaxes Sphincter of Oddi | Gallstone pain triggered post-prandially by CCK contraction |
| **Secretin** | S-cells (Duodenum) | $H^+$ (acidic chyme entering duodenum, pH < 4.5), fatty acids | $\\uparrow$ Pancreatic & biliary $\\text{HCO}_3^-$ secretion, $\\downarrow$ Gastric $H^+$ secretion | Neutralizes gastric acid in duodenum, optimizing pancreatic lipase pH |
| **Glucose-Dependent Insulinotropic Peptide (GIP)** | K-cells (Duodenum & jejunum) | Oral glucose, fatty acids, amino acids | $\\uparrow$ Pancreatic $\\beta$-cell insulin secretion (Incretin effect), $\\downarrow$ Gastric $H^+$ secretion | Oral glucose elicits significantly higher insulin surge than IV glucose |
| **Motilin** | M-cells (Duodenum & jejunum) | Fasting state (secreted cyclically every 90-120 min) | Initiates **Migrating Motor Complex (MMC)** peristaltic housekeeping waves | **Erythromycin** acts as a motilin receptor agonist to treat diabetic gastroparesis |

---

## 3. Carbohydrate, Protein & Lipid Digestion/Absorption

- **Carbohydrates**:
  - Salivary and pancreatic $\\alpha$-amylase break starch into maltose and $\\alpha$-limit dextrins.
  - Brush border enzymes (maltase, sucrase, lactase) yield monosaccharides.
  - **Glucose and Galactose** absorbed across apical enterocyte membrane via **SGLT-1** ($Na^+$-glucose cotransporter; secondary active transport driven by basolateral $Na^+/K^+$ ATPase).
  - **Fructose** absorbed via **GLUT-5** (facilitated diffusion).
  - All monosaccharides exit basolateral membrane into portal capillaries via **GLUT-2**.
- **Lipids & Bile Acid Micelles**:
  - Pancreatic lipase + Colipase digest triglycerides into 2-monoglycerides and free fatty acids.
  - **Bile Acids & Phospholipids** form amphipathic **mixed micelles** carrying lipids through the unstirred water layer to the apical brush border.
  - Lipids diffuse into enterocytes, re-esterify into triglycerides in the smooth endoplasmic reticulum, combine with **Apolipoprotein B-48**, and are packaged into **Chylomicrons** which exit into **lacteals (lymphatics)**.
  - **Enterohepatic Circulation**: Conjugated bile acids are reabsorbed actively in the **Terminal Ileum** via the Apical Sodium-Dependent Bile Acid Transporter (ASBT) and recycled back to the liver via the portal vein (recycled 6–8 times daily).
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old male presents with severe epigastric burning pain and chronic watery diarrhea. Upper endoscopy reveals multiple deep ulcers in the second and third portions of the duodenum and upper jejunum. Fasting serum gastrin concentration is markedly elevated at 1,450 pg/mL (normal < 100 pg/mL). A secretin stimulation test produces a paradoxical increase in serum gastrin from 1,450 to 2,800 pg/mL.",
      question: "Which of the following is the definitive diagnosis and primary mechanism of ulceration in this patient?",
      options: [
        "Zollinger-Ellison Syndrome (Gastrinoma); Autonomous hypersecretion of gastrin causing massive gastric acid hypersecretion that overwhelms duodenal neutralization",
        "Helicobacter pylori pangastritis; Bacterial urease-mediated cytotoxicity and ammonium hydroxide generation",
        "Autoimmune atrophic gastritis; Anti-parietal cell autoantibodies causing achlorhydria and secondary compensatory G-cell hyperplasia",
        "Menetrier disease; Massive foveolar hyperplasia with protein-losing gastropathy and hypoalbuminemia"
      ],
      correctAnswerIndex: 0,
      explanation: "Zollinger-Ellison Syndrome is caused by a neuroendocrine gastrinoma (frequently in the gastrinoma triangle of duodenum/pancreas). Hypergastrinemia causes massive parietal cell acid hypersecretion leading to refractory post-bulbar duodenal ulceration. The secretin stimulation test is diagnostic because normal antral G-cells are inhibited by secretin, whereas gastrinoma cells paradoxically increase gastrin secretion."
    }
  ]
};
