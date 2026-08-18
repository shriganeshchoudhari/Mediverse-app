/**
 * Internship Core Clinical Postings: Diagnostic Paracentesis & Thoracentesis Fluid Analysis
 * Authoritative fluid analysis content derived from Roberts and Hedges, Runyon's Ascites Guidelines, Light's Criteria.
 * Mapped to NMC CBME Competencies: IN2.2, EM2.2, IM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PARACENTESIS_THORACENTESIS_FLUID_MODULE: PhysiologyLessonModule = {
  id: "int2-paracentesis-thoracentesis-fluid",
  unitCode: "IN2.2",
  title: "Diagnostic Paracentesis & Thoracentesis: SAAG Calculation, SBP (PMN >=250/uL) & Light's Criteria for Pleural Exudates",
  competencies: ["IN2.2", "EM2.2", "IM2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Diagnostic Paracentesis, Ascitic Fluid Analysis & Thoracentesis Light's Criteria

Systematic fluid aspiration and biochemical analysis differentiate portal hypertensive transudates from spontaneous bacterial peritonitis and exudative pleural effusions.

---

## 1. Ascitic Fluid Analysis: SAAG & Spontaneous Bacterial Peritonitis (SBP)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Test} & \\textbf{Formula / Threshold} & \\textbf{Physiological Interpretation} & \\textbf{Clinical Etiologies} \\\\
\\hline
\\textbf{Serum-Ascites Albumin} & \\mathbf{\\text{SAAG} = \\text{Serum Albumin} - \\text{Ascitic Albumin}} & \\mathbf{\\text{SAAG } \\ge 1.1\\text{ g/dL: Portal Hypertension}} & \\text{Cirrhosis, Heart Failure, Budd-Chiari} \\\\
\\textbf{Gradient (SAAG)} & & \\mathbf{\\text{SAAG } < 1.1\\text{ g/dL: Non-Portal HTN}} & \\text{Peritoneal Carcinomatosis, TB, Nephrotic} \\\\
\\textbf{Spontaneous Bacterial} & \\mathbf{\\text{Ascitic Absolute Neutrophil Count (ANC)}} & \\mathbf{\\text{Bacterial translocation across permeable}} & \\mathbf{\\text{Start IV Cefotaxime/Ceftriaxone stat}} \\\\
\\textbf{Peritonitis (SBP)} & \\mathbf{(PMN) \\ge 250 / \\mu\\text{L}} & \\text{gut wall into cirrhotic ascites} & \\mathbf{+ \\text{ IV Albumin (1.5 g/kg d1, 1.0 g/kg d3)}} \\\\
\\hline
\\end{array}$$

- **Paracentesis Technical Pearls**:
  - **Insertion Site**: Left lower quadrant ($2\\text{ cm}$ superior and $2\\text{ cm}$ medial to ASIS) has a thinner abdominal wall and greater fluid pooling compared to the right side (avoids cecal distension and appendectomy scars).
  - **Z-Track Insertion Technique**: Displace skin $1\\text{--}2\\text{ cm}$ prior to needle entry; releases a non-aligned tract after needle withdrawal to prevent persistent ascitic fluid leaks.

---

## 2. Thoracentesis Anatomy & Light's Criteria for Pleural Exudates

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Parameter} & \\textbf{Light's Criteria Cutoff} & \\textbf{Pathophysiological Mechanism} & \\textbf{Etiological Examples} \\\\
\\hline
\\textbf{1. Pleural / Serum Protein} & > 0.5 & \\text{Increased pleural capillary permeability} & \\text{Parapneumonic effusion, Empyema, Malignancy,} \\\\
\\textbf{2. Pleural / Serum LDH} & > 0.6 & \\text{or impaired lymphatic drainage (exudate)} & \\text{Tuberculosis, Pulmonary Embolism, Rheumatoid} \\\\
\\textbf{3. Pleural Fluid LDH} & > 2/3 \\text{ upper normal serum LDH} & & \\\\
\\hline
\\textbf{Transudative Effusion} & \\mathbf{\\text{Meets NONE of the 3 criteria}} & \\mathbf{\\text{Elevated hydrostatic or low oncotic pressure}} & \\mathbf{\\text{Congestive Heart Failure, Cirrhosis, Nephrotic}} \\\\
\\hline
\\end{array}$$

- **Thoracentesis Safety Vector**:
  - Always insert needle **OVER THE SUPERIOR MARGIN OF THE RIB** to avoid the intercostal neurovascular bundle (Vein, Artery, Nerve - "VAN") located in the subcostal groove along the inferior margin of the rib above.
`,
  clinicalVignettes: [
    {
      scenario: "A 54-year-old male with decompensated alcoholic cirrhosis presents with worsening abdominal distension, mild diffuse tenderness, and low-grade fever (38.2°C). Paracentesis is performed yielding cloudy yellow fluid. Laboratory analysis reveals: Serum albumin 2.8 g/dL, Ascitic fluid albumin 0.8 g/dL, Ascitic total protein 1.4 g/dL, Ascitic WBC count 850/uL with 65% neutrophils (polymorphonuclear leukocytes - PMNs).",
      question: "What is the calculated SAAG, what is the diagnosis, and what is the immediate management protocol?",
      options: [
        "SAAG = 2.0 g/dL (indicates Portal Hypertension); Diagnosis: Spontaneous Bacterial Peritonitis (PMN count = 552/uL, which is >=250/uL); initiate broad-spectrum IV Ceftriaxone/Cefotaxime PLUS intravenous Albumin (1.5 g/kg on day 1 and 1.0 g/kg on day 3)",
        "SAAG = 0.8 g/dL (Peritoneal carcinomatosis); manage with oral NSAIDs",
        "SAAG = 3.6 g/dL; hold all antibiotics and schedule repeat tap in 2 weeks",
        "Diagnosis: Chyloperitoneum; start a low-fat diet only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates comprehensive ascites fluid interpretation: (1) SAAG Calculation: SAAG = Serum Albumin (2.8) - Ascitic Albumin (0.8) = 2.0 g/dL; because SAAG >=1.1 g/dL, portal hypertension is the underlying cause; (2) SBP Diagnosis: Absolute PMN count = 850 WBCs x 65% neutrophils = 552 PMNs/uL; an ascitic fluid ANC >=250 PMNs/uL confirms Spontaneous Bacterial Peritonitis; (3) Evidence-Based Management: Prompt initiation of 3rd-generation cephalosporin (Ceftriaxone/Cefotaxime) PLUS IV albumin (1.5 g/kg within 6h, 1.0 g/kg on day 3) reduces renal failure (hepatorenal syndrome) and significantly decreases mortality."
    }
  ]
};
