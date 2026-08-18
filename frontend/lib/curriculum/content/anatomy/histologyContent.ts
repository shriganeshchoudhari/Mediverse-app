/**
 * General & Systemic Histology Learning Content
 * Authoritative medical content derived from Wheater's Functional Histology (7th ed.), Junqueira, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: AN65.1, AN66.1, AN67.1, AN69.1, AN71.1, AN75.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HISTOLOGY_MODULE: PhysiologyLessonModule = {
  id: "anat-histology",
  unitCode: "AN65.1",
  title: "Microscopic Architecture, Tissue Staining & Organ Histology",
  competencies: ["AN65.1", "AN66.1", "AN67.1", "AN69.1", "AN71.1"],
  estimatedMinutes: 110,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Microscopic Architecture, Tissue Staining & Organ Histology

Histology bridges macroscopic anatomy and cellular physiology by analyzing micro-anatomical architecture, extracellular matrix organization, and cell-junction complexes.

---

## 1. Epithelial Classifications & Functional Locations

| Epithelial Type | Distinct Microscopic Features | Classical Anatomical Locations | Primary Function |
| :--- | :--- | :--- | :--- |
| **Simple Squamous** | Single layer of flattened, scale-like cells with flat nuclei | Vascular endothelium, Alveolar Type I pneumocytes, Bowman's capsule parietal layer, Mesothelium | Rapid passive gas/fluid diffusion, filtration |
| **Simple Cuboidal** | Single layer of cube-shaped cells with central round nuclei | Renal collecting tubules, Thyroid follicles, Ovarian surface germinal epithelium | Secretion and active absorption |
| **Simple Columnar** | Tall column-like cells with basal oval nuclei; apical microvilli/cilia | Gastric and intestinal mucosa (enterocytes), Fallopian tube (ciliated) | Absorption, enzymatic secretion, ovum transport |
| **Pseudostratified Ciliated Columnar** | All cells rest on basement membrane, but nuclei lie at variable heights; goblet cells | Trachea, Bronchi, Nasal cavity (Respiratory epithelium) | Mucociliary clearance and particulate trapping |
| **Stratified Squamous (Keratinized)** | Multiple cell layers; superficial layers anucleate and packed with keratin | Epidermis of skin | Mechanical barrier, waterproof protection |
| **Stratified Squamous (Non-Keratinized)** | Multiple cell layers; superficial cells retain flat nuclei | Oral cavity, Esophagus, Vagina, Anal canal | Protection against mechanical friction without desiccation |
| **Transitional (Urothelium)** | Multi-layered with superficial dome-shaped **Umbrella Cells** containing uroplakin plaques | Renal pelvis, Ureters, Urinary Bladder | Distension without tearing, toxic osmotic barrier |

---

## 2. Connective Tissue ECM & Collagen Types

Collagen is the most abundant protein in the human body ($>25\\%$ of total protein mass):

> **Major Collagen Types & Clinical Diseases**:
> - **Type I (90%)**: **B**one, **S**kin, **T**endon, Dentin, Fascia, Cornea. (*Defect in COL1A1/COL1A2 causes **Osteogenesis Imperfecta** $\\implies$ multiple fractures, blue sclerae, hearing loss*).
> - **Type II**: Cartilage (**c**ar**two**lage: Hyaline and Elastic cartilage), Vitreous body, Nucleus pulposus.
> - **Type III**: **Reticular fibers**, Blood vessels, Uterus, Spleen, Granulation tissue. (*Defect in COL3A1 causes Vascular **Ehlers-Danlos Syndrome** $\\implies$ arterial and hollow organ rupture*).
> - **Type IV**: **Basement membrane** (Basal lamina), Lens. (*Defect in alpha-5 chain causes **Alport Syndrome** $\\implies$ nephritis, sensorineural hearing loss, ocular abnormalities; targeted by autoantibodies in **Goodpasture Syndrome***).

---

## 3. Specialized Diagnostic Histochemical Stains

1. **Hematoxylin & Eosin (H&E)**:
   - **Hematoxylin**: Basic dye staining acidic/basophilic structures (DNA, RNA, ribosomes) **dark blue/purple**.
   - **Eosin**: Acidic dye staining basic/acidophilic structures (cytoplasm, collagen, mitochondrial membranes) **pink/red**.
2. **Masson\'s Trichrome**:
   - Stains **Collagen/Fibrosis bright blue**, muscle fibers red, and nuclei dark brown. Used in grading hepatic cirrhosis and cardiac fibrosis.
3. **Periodic Acid-Schiff (PAS)**:
   - Stains glycogen, mucopolysaccharides, and glycoprotein basement membranes **magenta/pink**. Diagnostic for **Whipple Disease** (PAS+ macrophages) and glycogen storage diseases.
4. **Prussian Blue (Perls Stain)**:
   - Stains ferric iron ($Fe^{3+}$) **deep blue** (diagnostic in Hemochromatosis and pulmonary hemosiderin-laden 'heart failure' cells).
5. **Congo Red**:
   - Stains amyloid deposits with pathognomonic **apple-green birefringence** under polarized light microscopy.
`,
  clinicalVignettes: [
    {
      scenario: "A 4-year-old boy is brought to the pediatric clinic following his fifth low-impact bone fracture. Physical examination reveals short stature, multiple healing fractures on skeletal radiographs, and a distinct grayish-blue discoloration of the sclerae. Audiometry reveals mild bilateral conductive hearing loss.",
      question: "Which of the following collagen types is structurally defective in this patient?",
      options: [
        "Type I Collagen",
        "Type II Collagen",
        "Type III Collagen",
        "Type IV Collagen"
      ],
      correctAnswerIndex: 0,
      explanation: "Osteogenesis Imperfecta ('Brittle Bone Disease') is an autosomal dominant disorder caused by mutations in the COL1A1 or COL1A2 genes encoding Type I collagen. Defective Type I collagen leads to brittle bones prone to multiple low-trauma fractures, translucent thin sclerae allowing choroidal veins to show through (blue sclerae), and middle ear ossicle malformations (hearing loss)."
    }
  ]
};
