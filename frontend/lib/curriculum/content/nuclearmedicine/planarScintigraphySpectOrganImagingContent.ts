/**
 * Nuclear Medicine: Planar Scintigraphy, SPECT-CT & Organ Functional Imaging (Bone, V/Q, HIDA, Renal)
 * Authoritative medical content derived from Mettler & Guiberteau (7th ed.), Ziessman's Nuclear Medicine: The Requisites.
 * Mapped to NMC CBME Competencies: NM3.1, NM3.2, NM4.1, NM4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PLANAR_SCINTIGRAPHY_SPECT_ORGAN_IMAGING_MODULE: PhysiologyLessonModule = {
  id: "nuclearmedicine-planar-scintigraphy-spect-organ-imaging",
  unitCode: "NM3.1",
  title: "Planar Scintigraphy & SPECT-CT: Bone Scan, V/Q Lung Scan, HIDA Cholecystitis & Renal Scintigraphy",
  competencies: ["NM3.1", "NM3.2", "NM4.1", "NM4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RADIOLOGY",
  markdownContent: `
# Planar Scintigraphy & SPECT-CT: Bone Scan, V/Q Lung Scan, HIDA Cholecystitis & Renal Scintigraphy

Scintigraphic imaging detects functional and physiologic changes that frequently precede anatomical alterations seen on CT or MRI.

---

## 1. High-Yield Clinical Scintigraphic Studies

| Scintigraphic Examination | Radiopharmaceutical & Mechanism | Diagnostic Criteria & Hallmark Findings | Primary Clinical Indications |
| :--- | :--- | :--- | :--- |
| **Bone Scintigraphy (3-Phase Bone Scan)** | **$^{99\\text{m}}\\text{Tc-MDP (Methylene Diphosphonate)}$**: Chemisorption onto hydroxyapatite crystals proportional to osteoblastic activity and bone blood flow. | • **3 Phases**: Flow (arterial), Blood pool ($5\\text{ min}$ soft tissue), Delayed ($2 - 4\\text{ hours}$ skeletal).<br>• **Osteomyelitis**: Focal hot spot on **ALL 3 phases** (vs Cellulitis: positive flow/pool, normal/diffuse delayed).<br>• **Superscan**: Diffuse, intense skeletal uptake with complete non-visualization of kidneys (metastatic prostate/breast cancer or renal osteodystrophy). | Skeletal metastases (prostate, breast, lung), osteomyelitis, occult stress fractures, Paget disease. |
| **Ventilation / Perfusion (V/Q) Lung Scan** | • **Perfusion**: **$^{99\\text{m}}\\text{Tc-MAA (Macroaggregated Albumin)}$** (traps in pulmonary capillaries; $200,000 - 500,000$ particles).<br>• **Ventilation**: **$^{99\\text{m}}\\text{Tc-DTPA aerosol}$** or **$^{133}\\text{Xe gas}$**. | • **High-Probability Pulmonary Embolism (Modified PIOPED II)**: **$\\ge 2$ large (or equivalent moderate) wedge-shaped segmental perfusion defects with NORMAL ventilation** (**V/Q Mismatch**).<br>• **V/Q Match**: Defect on both ventilation and perfusion (COPD, pneumonia, atelectasis). | Suspected Pulmonary Embolism when CT Pulmonary Angiography (CTPA) is contraindicated (severe renal failure, iodinated contrast allergy, pregnancy). |
| **Hepatobiliary Scintigraphy (HIDA Scan)** | **$^{99\\text{m}}\\text{Tc-Mebrofenin / Disofenin}$**: Extracted by hepatocytes into bile without conjugation. | • **Acute Cholecystitis**: **Non-visualization of gallbladder at $60\\text{ min}$** despite prompt tracer excretion into the common bile duct and duodenum (due to cystic duct obstruction).<br>• **Morphine Augmentation**: $0.04\\text{ mg/kg}$ IV contracts sphincter of Oddi; persistent gallbladder non-visualization at $30\\text{ min}$ post-morphine confirms acute cholecystitis.<br>• **Rim Sign**: Increased hepatic parenchymal radioactivity adjacent to gallbladder fossa (severe inflammation / gangrenous cholecystitis). | Gold standard for **Acute Calculous & Acalculous Cholecystitis**; biliary atresia in neonates; post-operative bile leaks. |
| **Renal Scintigraphy (MAG3 vs DTPA vs DMSA)** | • **$^{99\\text{m}}\\text{Tc-MAG3}$**: $95\\%$ tubular secretion (best for renal failure/obstruction).<br>• **$^{99\\text{m}}\\text{Tc-DTPA}$**: $100\\%$ glomerular filtration (measures true GFR).<br>• **$^{99\\text{m}}\\text{Tc-DMSA}$**: Cortical fixation in proximal tubular cells. | • **UPJ Obstruction (Lasix Washout Test)**: Intravenous Furosemide ($20 - 40\\text{ mg}$); clearance half-time **$T_{1/2} > 20\\text{ min}$ indicates true mechanical obstruction** ($<10\\text{ min}$ is non-obstructed).<br>• **Renal Scarring**: Focal cortical cold defects on $^{99\\text{m}}\\text{Tc-DMSA}$.<br>• **Captopril Renal Scan**: ACE inhibitor causes $>10\\%$ drop in affected kidney split function in **Renovascular Hypertension (Renal Artery Stenosis)**. | Ureteropelvic junction obstruction, pediatric pyelonephritis cortical scarring, renovascular hypertension. |

---

## 2. Gastrointestinal & Endocrine Scintigraphy

- **Meckel's Diverticulum Scan ($^{99\text{m}}\text{Tc-Pertechnetate}$)**:
  - Trapped by **ectopic gastric mucosa** ($95\%$ of bleeding Meckels have ectopic gastric mucosa in the right lower quadrant). Pre-treated with **Ranitidine/Cimetidine** ($H_2$ blocker inhibits tracer secretion), **Pentagastrin** (stimulates mucosal uptake), or **Glucagon** (decreases peristalsis).
- **Parathyroid Adenoma Scintigraphy ($^{99\text{m}}\text{Tc-Sestamibi}$)**:
  - Dual-phase planar/SPECT-CT: Sestamibi washes out rapidly from normal thyroid tissue ($20\text{ min}$), but is **retained in hyperfunctioning parathyroid adenomas** at $2-3\text{ hours}$ due to high mitochondrial density.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old female presents to the emergency department with severe right upper quadrant abdominal pain, nausea, and fever (38.5°C). Right upper quadrant ultrasound is equivocal due to bowel gas, showing gallstones without definitive gallbladder wall thickening. A hepatobiliary HIDA scan is performed with 99mTc-Mebrofenin. Sequential dynamic imaging at 60 minutes demonstrates prompt hepatic uptake and rapid filling of the common bile duct and duodenum, but complete non-visualization of the gallbladder. Intravenous morphine is administered, and repeat imaging 30 minutes later still shows no tracer in the gallbladder.",
      question: "Which of the following represents the correct diagnosis and underlying pathophysiologic mechanism?",
      options: [
        "Acute Cholecystitis; Obstruction of the cystic duct preventing tracer entry into the gallbladder",
        "Biliary Atresia; Absence of extrahepatic biliary ductal arborization",
        "Common Bile Duct Obstruction; Choledocholithiasis causing retrograde stasis",
        "Chronic Acalculous Cholecystopathy; Low gallbladder ejection fraction"
      ],
      correctAnswerIndex: 0,
      explanation: "On a 99mTc-Mebrofenin HIDA scan, the normal gallbladder fills within 60 minutes. The hallmark of Acute Cholecystitis is the failure of the gallbladder to visualize at 60 minutes (and persisting after morphine augmentation) despite normal hepatic uptake and patent excretion into the common bile duct and duodenum. This occurs because an impacted gallstone in the cystic duct (or acute mucosal edema in acalculous cholecystitis) obstructs radiotracer entry into the gallbladder lumen."
    }
  ]
};
