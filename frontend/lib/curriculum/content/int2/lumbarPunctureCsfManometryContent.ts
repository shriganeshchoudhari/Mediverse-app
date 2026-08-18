/**
 * Internship Core Clinical Postings: Lumbar Puncture CSF Opening Pressure & Differential Manometry
 * Authoritative procedure content derived from Roberts and Hedges, Adams and Victor's Neurology.
 * Mapped to NMC CBME Competencies: IN2.3, EM2.3, IM2.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LUMBAR_PUNCTURE_CSF_MANOMETRY_MODULE: PhysiologyLessonModule = {
  id: "int2-lumbar-puncture-csf-manometry",
  unitCode: "IN2.3",
  title: "Lumbar Puncture & CSF Manometry: Anatomical Landmarks (L4-L5 Tuffier's Line), Dural Pops & Differential CSF Diagnostics",
  competencies: ["IN2.3", "EM2.3", "IM2.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Lumbar Puncture Technique, Spinal Anatomy & Cerebrospinal Fluid (CSF) Interpretation

Accurate anatomical identification of the L3-L4/L4-L5 interspaces and rapid CSF interpretation differentiate bacterial meningitis from aseptic meningitis and subarachnoid hemorrhage.

---

## 1. Spinal Anatomy, Needle Trajectory & Ligamentous \"Pops\"

$$\\begin{array}{lcccc}
\\hline
\\textbf{Anatomical Structure} & \\textbf{Spatial Relationship} & \\textbf{Tactile Sensation / Milestone} \\\\
\\hline
\\textbf{Intercristal (Tuffier's) Line} & \\text{Line connecting highest points of iliac crests} & \\mathbf{\\text{Crosses L4 spinous process or L4-L5 interspace}} \\\\
\\textbf{Conus Medullaris Level} & \\text{Spinal cord terminates at lower border of L1-L2 (adult)} & \\mathbf{\\text{Safe subarachnoid puncture at L3-L4 or L4-L5}} \\\\
\\textbf{Ligamentum Flavum} & \\text{Connects adjacent laminae; tough fibroelastic tissue} & \\mathbf{\\text{FIRST distinct tactile \"give\" or \"pop\"}} \\\\
\\textbf{Dura / Arachnoid Mater} & \\text{Encloses subarachnoid space containing CSF and cauda equina} & \\mathbf{\\text{SECOND tactile \"pop\" } \\rightarrow \\text{ fluid flow upon stylet removal}} \\\\
\\hline
\\end{array}$$

- **Sequential Anatomical Layers Traversed**:
  $$\\text{Skin} \\rightarrow \\text{Subcutaneous tissue} \\rightarrow \\text{Supraspinous ligament} \\rightarrow \\text{Interspinous ligament} \\rightarrow \\mathbf{\\text{Ligamentum flavum (1st pop)}} \\rightarrow \\text{Epidural space} \\rightarrow \\mathbf{\\text{Dura mater / Arachnoid (2nd pop)}} \\rightarrow \\text{Subarachnoid space}$$

---

## 2. CSF Differential Diagnostic Profiles

$$\\begin{array}{lccccc}
\\hline
\\textbf{Clinical Condition} & \\textbf{Opening Pressure (cm } H_2O\\text{)} & \\textbf{WBC Count (/}\\mu\\text{L)} & \\textbf{Dominant Cell Type} & \\textbf{Protein (mg/dL)} & \\textbf{Glucose Ratio (CSF:Serum)} \\\\
\\hline
\\textbf{Normal CSF} & 10-20 & < 5 & \\text{Lymphocytes} & 15-45 & > 60\\% \\text{ (} > 40\\text{ mg/dL)} \\\\
\\textbf{Bacterial Meningitis} & \\mathbf{\\text{Markedly Elevated (} > 25\\text{)}} & \\mathbf{1{,}000 - 10{,}000+} & \\mathbf{\\text{Neutrophils (PMNs) } \\ge 80\\%} & \\mathbf{\\text{Markedly Elevated (} > 100-500\\text{)}} & \\mathbf{\\text{Markedly Low (} < 40\\%\\text{ or } < 20\\text{)}} \\\\
\\textbf{Viral (Aseptic)} & \\text{Normal to Mildly Elevated} & 50 - 500 & \\mathbf{\\text{Lymphocytes / Mononuclear}} & \\text{Normal to Mildly Elevated (} < 100\\text{)} & \\mathbf{\\text{NORMAL (} > 60\\%\\text{)}} \\\\
\\textbf{Fungal / TB} & \\text{Markedly Elevated} & 100 - 500 & \\text{Lymphocytes} & \\text{Markedly Elevated (} > 100-500\\text{)} & \\mathbf{\\text{Markedly Low (} < 30\\%\\text{)}} \\\\
\\textbf{Subarachnoid Hemorrhage} & \\text{Elevated} & \\text{Elevated RBCs (Tubes 1-4)} & \\mathbf{\\text{Xanthochromia (yellow supernatant)}} & \\text{Elevated} & \\text{Normal} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old college student is brought to the emergency department with high fever (39.5°C), severe throbbing headache, photophobia, altered mentation, and neck stiffness. Kernig and Brudzinski signs are positive. A diagnostic lumbar puncture is performed at the L3-L4 interspace. The opening pressure is 32 cm H2O. CSF analysis reveals: Turbid appearance, WBC count 4,800/uL with 92% neutrophils (PMNs), Protein 280 mg/dL, and CSF glucose 18 mg/dL (concomitant blood glucose is 110 mg/dL, giving a CSF-to-serum glucose ratio of 16%).",
      question: "Which of the following represents the correct diagnosis and the immediate empiric antimicrobial and adjunctive pharmacotherapy?",
      options: [
        "Acute Bacterial Meningitis (marked PMN pleocytosis, high protein, low CSF glucose <40%); immediately administer empiric IV Vancomycin PLUS IV Ceftriaxone (or Cefotaxime) PLUS adjunctive IV Dexamethasone (10 mg IV administered prior to or with the first dose of antibiotics to prevent neurological sequelae and S. pneumoniae hearing loss)",
        "Viral (Aseptic) Meningitis; administer oral Acyclovir and discharge with outpatient follow-up",
        "Traumatic tap; repeat the lumbar puncture immediately at the C1-C2 level",
        "Multiple Sclerosis; start high-dose oral glatiramer acetate"
      ],
      correctAnswerIndex: 0,
      explanation: "This CSF profile is classic for Acute Bacterial Meningitis: (1) CSF Hallmarks: Opening pressure >25 cm H2O, massive PMN pleocytosis (4,800 WBCs with 92% PMNs), marked hyperproteinorachia (protein 280 mg/dL), and severe hypoglycorrhachia (glucose ratio 16%, well below the 40% cutoff); (2) Empiric Antimicrobial Regimen: IV Vancomycin (covers resistant S. pneumoniae) PLUS 3rd-generation cephalosporin (Ceftriaxone covers N. meningitidis and S. pneumoniae); (3) Dexamethasone: Adjunctive IV Dexamethasone reduces mortality and sensorineural hearing loss and must be given immediately before or concurrent with initial antibiotics."
    }
  ]
};
