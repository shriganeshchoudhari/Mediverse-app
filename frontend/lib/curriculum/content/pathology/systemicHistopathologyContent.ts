/**
 * Systemic Histopathology, Post-MI Timeline & Stains Learning Content
 * Authoritative medical content derived from Robbins & Cotran, Rubin's, Pathoma, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PA16.1, PA16.2, PA20.1, PA28.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SYSTEMIC_HISTOPATHOLOGY_MODULE: PhysiologyLessonModule = {
  id: "path-histopathology",
  unitCode: "PA16.1",
  title: "Myocardial Infarction Timeline, Glomerulonephritis & Diagnostic Stains",
  competencies: ["PA16.1", "PA16.2", "PA20.1", "PA28.1"],
  estimatedMinutes: 130,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Myocardial Infarction Timeline, Glomerulonephritis & Diagnostic Stains

Histopathological examination of organ tissues correlates gross macro-morphology with microscopic cellular architecture, diagnostic histochemical stains, and clinical outcome timelines.

---

## 1. Myocardial Infarction: Chronological Evolution Timeline

| Time Elapsed | Gross Macroscopic Pathology | Light Microscopic Histopathology | Principal Clinical Complications & Causes of Death |
| :--- | :--- | :--- | :--- |
| **0 – 4 hours** | None / subtle mottling | **Wavy myocardial fibers** (elongated, stretched myocytes); intracellular glycogen depletion | **Fatal Ventricular Arrhythmias** (Ventricular Fibrillation / V-Tach); cardiogenic shock |
| **4 – 24 hours** | Dark mottling; pale tetrazolium stain defect | **Coagulative Necrosis**, **Contraction Band Necrosis** (in reperfused margins due to $Ca^{2+}$ influx), early hypereosinophilia, pyknosis | Ventricular Arrhythmias; Heart Failure |
| **1 – 3 days** | Pale infarct with hyperemic border | **Extensive Neutrophil Infiltration**; loss of myocyte nuclei and striations | **Fibrinous Pericarditis** (friction rub, pleuritic chest pain) |
| **4 – 7 days** | Soft, yellow-tan necrotic center | **Macrophage phagocytic infiltration**; enzymatic clearance of necrotic debris | **Mechanical Rupture (PEAK RISK)**:<br>• **Free Wall Rupture** $\\rightarrow$ Hemopericardium & Cardiac Tamponade<br>• **Interventricular Septum Rupture** $\\rightarrow$ Left-to-Right shunt & VSD<br>• **Papillary Muscle Rupture** (Posteriomedial head via RCA) $\\rightarrow$ Acute Severe Mitral Regurgitation & Pulmonary Edema |
| **1 – 2 weeks** | Hyperemic border with prominent granulation tissue | **Granulation Tissue** with proliferating capillary neovascularization, fibroblasts, and loose collagen | True Ventricular Aneurysm formation (mural thrombi) |
| **> 2 weeks – Months** | Gray-white contracted firm scar | **Dense, hypocellular Type I Collagen Scar**; complete tissue remodeling | Heart Failure; **Dressler Syndrome** (autoimmune pericarditis 2–8 weeks post-MI) |

---

## 2. Glomerulonephritis: Classic Histopathological Patterns

| Disease & Category | Light Microscopy (LM) | Immunofluorescence (IF) | Electron Microscopy (EM) | Pathognomonic Clinical Presentation |
| :--- | :--- | :--- | :--- | :--- |
| **Minimal Change Disease (MCD)**<br>(Nephrotic) | Normal glomeruli (lipid accumulation in tubules $\\implies$ lipoid nephrosis) | Negative IF | **Diffuse effacement of podocyte foot processes** | Child with sudden profound selective proteinuria ($>3.5\\text{ g/day}$); excellent response to **Corticosteroids**. |
| **Membranous Nephropathy**<br>(Nephrotic) | Diffuse uniform capillary wall and basement membrane thickening | Granular IgG and C3 along GBM | Subepithelial deposits with **"Spike and Dome"** basement membrane protrusion | Most common cause of primary nephrotic syndrome in Caucasian adults; associated with **anti-PLA2R antibodies**, HBV, NSAIDs, solid tumors. |
| **Post-Streptococcal GN (PSGN)**<br>(Nephritic) | Hypercellular, enlarged glomeruli filled with neutrophils and mesangial cells | Granular **"Starry Sky"** / lumpy-bumpy mesangial & capillary IgG/C3 | Large **Subepithelial "Humps"** | Child 2–4 weeks after group A strep pharyngitis/impetigo with cola-colored urine, periorbital edema, hypertension. |
| **Rapidly Progressive GN (RPGN)**<br>(Nephritic) | **Crescents** in Bowman\'s space composed of proliferating parietal epithelial cells, macrophages, and fibrin | • Linear IgG: **Goodpasture syndrome**<br>• Granular: PSGN or Lupus<br>• Negative (Pauci-immune): **ANCA Vasculitis** (GPA, MPA) | Crescent compression and rupture of glomerular basement membrane | Rapid progression to renal failure within weeks to months; hematuria and RBC casts. |

---

## 3. High-Yield Special Histochemical Diagnostic Stains

| Histochemical Stain | Target Biochemical Molecule / Structure | Resulting Coloration | Classic Clinical Disease Associations |
| :--- | :--- | :--- | :--- |
| **Hematoxylin & Eosin (H&E)** | Nucleic acids (Hematoxylin, basic) & Proteins (Eosin, acidic) | **Nuclei Blue/Purple**<br>**Cytoplasm Pink/Red** | Routine standard diagnostic histopathology across all surgical pathology. |
| **Masson Trichrome** | Collagen vs Muscle/Parenchyma | **Collagen / Fibrosis Blue/Green**<br>Muscle Red, Nuclei Black | Hepatic Cirrhosis, Myocardial Fibrosis, Glomerulosclerosis. |
| **Periodic Acid-Schiff (PAS)** | Carbohydrates, Glycogen, Mucins, and Glycoproteins | **Magenta / Bright Pink** | Glycogen storage diseases, Fungal cell walls (*Candida*, *Aspergillus*), Glomerular basement membranes, Whipple disease (*Tropheryma whipplei* in macrophages). |
| **Congo Red** | Amyloid $\\beta$-pleated sheet fibrillar proteins | **Salmon-Pink** under standard light;<br>**Apple-Green Birefringence** under Polarized Light | Primary (AL) Amyloidosis (Multiple Myeloma), Secondary (AA) Amyloidosis (Chronic inflammation), Alzheimer disease ($A\\beta$). |
| **Prussian Blue (Perls)** | Ferric Iron ($Fe^{3+}$) in Hemosiderin | **Bright Blue** | Hereditary Hemochromatosis, Hemosiderosis, Heart Failure cells (hemosiderin-laden alveolar macrophages). |
| **Ziehl-Neelsen (Acid-Fast)** | Mycolic acids in cell wall | **Bright Red Acid-Fast Bacilli** against blue methylene background | *Mycobacterium tuberculosis*, *Mycobacterium leprae*, *Nocardia* (partially acid-fast). |
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male is admitted to the coronary care unit with an acute ST-elevation myocardial infarction (STEMI) of the anterior wall. Five days post-infarction, he suddenly collapses. Blood pressure drops precipitously to 60/30 mmHg with distant heart sounds, severe jugular venous distension, and pulsus paradoxus. Bedside echocardiography demonstrates a massive pericardial effusion with right ventricular diastolic collapse. Emergency pericardiocentesis aspirates 250 mL of non-clotting blood.",
      question: "Which of the following cellular events explains the timing of this catastrophic complication?",
      options: [
        "Peak macrophage infiltration and enzymatic lysis of necrotic myocardium weakening the ventricular wall (Free Wall Rupture)",
        "Contraction band necrosis from early reperfusion injury",
        "Dense Type I collagen scar formation and tissue retraction",
        "Extensive neutrophil infiltration causing fibrinous pericardial irritation"
      ],
      correctAnswerIndex: 0,
      explanation: "Between days 4 and 7 post-myocardial infarction, extensive macrophage infiltration occurs to clear necrotic myocyte debris. Proteolytic enzymes released during this cleanup produce a soft, structurally weakened myocardium, leading to the peak incidence of ventricular free wall rupture, hemopericardium, and acute fatal cardiac tamponade."
    }
  ]
};
