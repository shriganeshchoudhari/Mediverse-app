/**
 * Cellular Injury, Adaptations & Inflammation Learning Content
 * Authoritative medical content derived from Robbins & Cotran, Rubin's, Pathoma, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PA1.1, PA1.2, PA2.1, PA3.1, PA4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CELL_INJURY_INFLAMMATION_MODULE: PhysiologyLessonModule = {
  id: "path-cell-injury",
  unitCode: "PA1.1",
  title: "Cellular Adaptations, Patterns of Necrosis, Apoptosis & Inflammation",
  competencies: ["PA1.1", "PA1.2", "PA2.1", "PA3.1", "PA4.1"],
  estimatedMinutes: 120,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Cellular Adaptations, Patterns of Necrosis, Apoptosis & Inflammation

Cellular injury occurs when environmental stress exceeds the adaptive capacity of the cell, progressing from reversible hydropic swelling to irreversible membrane disruption and programmed or unprogrammed cell death.

---

## 1. Cellular Adaptations to Stress

| Adaptation Pattern | Cellular Mechanism & Mediators | High-Yield Physiological & Pathological Examples |
| :--- | :--- | :--- |
| **Hypertrophy** | Increase in individual **cell size** via gene activation and protein synthesis; predominant in non-dividing permanent tissues | • **Physiologic**: Pregnant uterus (smooth muscle); athletic skeletal muscle<br>• **Pathologic**: Left Ventricular Hypertrophy (LVH) in systemic hypertension |
| **Hyperplasia** | Increase in **cell number** via stem cell recruitment and proliferation; occurs in labile/stable dividing tissues | • **Physiologic**: Lactating breast; partial hepatectomy liver regeneration<br>• **Pathologic**: Endometrial hyperplasia from unopposed estrogen (risk for carcinoma); BPH |
| **Atrophy** | Decrease in **cell size and number** via ubiquitin-proteasome degradation of cytoskeleton and **autophagy** | • **Physiologic**: Postpartum involution of uterus; embryological thyroglossal duct<br>• **Pathologic**: Disuse osteopenia, denervation atrophy, ischemic cerebral atrophy |
| **Metaplasia** | Reversible reprogramming of stem cells to replace one mature cell type with another better able to withstand stress | • **Barrett Esophagus**: Non-keratinized stratified squamous $\\rightarrow$ non-ciliated columnar with goblet cells (risk of adenocarcinoma)<br>• **Respiratory Epithelium**: Pseudostratified ciliated columnar $\\rightarrow$ stratified squamous in smokers |

---

## 2. Morphological Patterns of Tissue Necrosis

Necrosis is unprogrammed cell death accompanied by cellular swelling, loss of membrane integrity, enzyme leakage, and vigorous host inflammatory response:

| Necrosis Pattern | Characteristic Pathological Mechanism | Classic Clinical Organs & Vignettes |
| :--- | :--- | :--- |
| **Coagulative Necrosis** | Protein denaturation predominates over enzymatic lysis; cellular architecture preserved as "ghost cells" / tombstone outlines with pyknosis, karyorrhexis, and karyolysis | **All solid organ ischemic infarctions** (Heart, Kidney, Spleen, Liver) **EXCEPT the Brain**. |
| **Liquefactive Necrosis** | Enzymatic lysis predominates over denaturation; rapid proteolytic dissolution leaves a liquid cyst cavity filled with cellular debris | • **Ischemic Stroke / Brain Infarct** (microglial lysosomal enzymes)<br>• **Bacterial & Fungal Abscesses** (neutrophil lysosomal enzymes)<br>• **Pancreatic Parenchyma in Acute Pancreatitis** |
| **Caseous Necrosis** | Friable, cheese-like macroscopic appearance; amorphous acellular granular debris surrounded by granulomatous rim of epithelioid macrophages and Langhans giant cells | • **Tuberculosis ($Mycobacterium\\text{ }tuberculosis$)**<br>• **Systemic Mycoses** (*Histoplasma capsulatum*, *Coccidioides*, *Blastomyces*) |
| **Fat Necrosis** | Lipases cleave triglycerides into free fatty acids, which precipitate with ionic calcium to form chalky-white calcium soaps (**Saponification**) | • **Acute Pancreatitis** (peripancreatic fat digestion by activated pancreatic lipase)<br>• **Trauma to the Breast** |
| **Fibrinoid Necrosis** | Antigen-antibody complexes deposit in arterial walls with extravasated fibrin, producing bright amorphous eosinophilic smudgy vessel wall thickening | • **Immune-Complex Vasculitis** (Polyarteritis Nodosa)<br>• **Malignant Hypertension** (accelerated vascular injury)<br>• **Preeclampsia** (placental vessels) |
| **Gangrenous Necrosis** | Coagulative necrosis of a limb due to chronic arterial ischemia (**Dry Gangrene**); superadded bacterial liquefaction yields **Wet Gangrene** | Diabetic foot ischemia, peripheral arterial disease, frostbite. |

---

## 3. Apoptosis: Intrinsic vs Extrinsic Pathways

Apoptosis is genetically programmed, ATP-dependent cell suicide characterized by cell shrinkage, chromatin condensation, apoptotic bleb formation, and phagocytosis by macrophages **WITHOUT inflammation**:

> **Dual Signaling Cascades**:
> 1. **Intrinsic (Mitochondrial) Pathway**:
>    - Cellular stress, DNA damage (via p53), or growth factor withdrawal inactivates anti-apoptotic **Bcl-2 and Bcl-xL**, allowing pro-apoptotic **Bax and Bak** to form pores in the outer mitochondrial membrane.
>    - Release of **Cytochrome c** into cytosol $\\rightarrow$ binds **Apaf-1** $\\rightarrow$ forms the apoptosome $\\rightarrow$ activates initiator **Caspase-9**.
> 2. **Extrinsic (Death Receptor) Pathway**:
>    - **FAS (CD95)** binds **FAS Ligand (FASL)**, or **TNF-$\\alpha$** binds **TNFR1** $\\rightarrow$ recruits FADD adaptor $\\rightarrow$ activates initiator **Caspase-8**.
> 3. **Execution Phase**:
>    - Initiator Caspases (8 and 9) cleave and activate executioner **Caspase-3 and Caspase-6**, which activate endonucleases (internucleosomal DNA cleavage into 180-200 bp ladder) and degrade the cytoskeleton.

---

## 4. Acute Inflammation & Leukocyte Recruitment Cascade

1. **Margination & Rolling**: Selectins bind sialyl-Lewis X on leukocytes (**L-selectin** on WBCs, **E-selectin** & **P-selectin** on endothelium; P-selectin released from **Weibel-Palade bodies** stimulated by histamine).
2. **Tight Adhesion**: Endothelial **ICAM-1** and **VCAM-1** bind leukocyte $\\beta_2$-integrins (**LFA-1 / CD11a/CD18** and **Mac-1 / CD11b/CD18**).
   - *Leukocyte Adhesion Deficiency (LAD Type 1)*: Autosomal recessive defect in CD18 $\\implies$ impaired integrins $\\implies$ delayed separation of umbilical cord, severe neutrophilia, recurrent bacterial infections without pus formation.
3. **Diapedesis (Transmigration)**: Leukocytes squeeze through endothelial junctions via **PECAM-1 (CD31)**.
4. **Chemotaxis**: Guided by bacterial products, **C5a**, **Leukotriene $B_4$ ($LTB_4$)**, and **Interleukin-8 ($IL\\text{-}8$)**.
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with a 30-year history of heavy tobacco use and chronic gastroesophageal reflux disease (GERD) undergoes upper endoscopy. Visualization of the distal esophagus demonstrates salmon-pink velvet-like columnar mucosa extending 4 cm proximal to the gastroesophageal junction. Biopsy reveals replacement of non-keratinized stratified squamous epithelium by intestinal-type columnar epithelium with mucin-secreting goblet cells.",
      question: "Which of the following cellular adaptation processes is demonstrated in this patient's biopsy?",
      options: [
        "Columnar Metaplasia (Barrett Esophagus)",
        "Endometrial Hyperplasia",
        "Coagulative Necrosis",
        "Denervation Atrophy"
      ],
      correctAnswerIndex: 0,
      explanation: "Barrett Esophagus is a classic example of specialized intestinal metaplasia, where chronic acid reflux induces reprogramming of esophageal basal stem cells from non-keratinized stratified squamous epithelium into intestinal columnar epithelium with goblet cells. This metaplastic change confers a 30- to 40-fold increased risk of developing esophageal adenocarcinoma."
    }
  ]
};
