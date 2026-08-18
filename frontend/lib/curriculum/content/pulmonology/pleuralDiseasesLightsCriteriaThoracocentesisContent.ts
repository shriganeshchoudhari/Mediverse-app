/**
 * Pleural Diseases, Light's Criteria, Thoracocentesis & Empyema Management
 * Authoritative medical content derived from BTS Pleural Guidelines, ATS, Murray & Nadel, and USMLE Step 2/3 Pulmonology.
 * Mapped to NMC CBME Competencies: CT5.1, CT5.2, CT6.1, CT6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PLEURAL_DISEASES_LIGHTS_CRITERIA_THORACOCENTESIS_MODULE: PhysiologyLessonModule = {
  id: "resp-pleural-diseases-lights-criteria",
  unitCode: "CT5.1",
  title: "Pulmonology: Pleural Diseases, Light's Criteria (Transudate vs Exudate) & Empyema Drainage",
  competencies: ["CT5.1", "CT5.2", "CT6.1", "CT6.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Pulmonology: Pleural Diseases, Light's Criteria (Transudate vs Exudate) & Empyema Drainage

The pleural space normally contains $0.1 - 0.2\\text{ mL/kg}$ of serous fluid. Pathological fluid accumulation (pleural effusion) requires diagnostic thoracocentesis and biochemical stratification.

---

## 1. Diagnostic Thoracocentesis Technique & Safety

- **Anatomical Landmark**:
  - Perform under bedside ultrasound guidance.
  - Insert needle in the **7th or 8th intercostal space** along the posterior mid-scapular line or posterior axillary line (at least 1–2 intercostal spaces below fluid level, never below 9th rib to avoid intra-abdominal injury).
  - **Insert the needle directly OVER the superior border of the lower rib** to avoid injury to the intercostal nerve, artery, and vein running in the subcostal groove along the inferior rib border.
- **Maximum Fluid Removal per Session**:
  - Limit evacuation to **$\\le 1500\\text{ mL}$** in a single session to prevent life-threatening **Re-Expansion Pulmonary Edema (REPE)**.

---

## 2. Light\'s Criteria for Distinguishing Transudate vs Exudate

$$\\text{An effusion is classified as an } \\mathbf{EXUDATE} \\text{ if } \\mathbf{ANY\\text{ }1} \\text{ of the following } 3 \\text{ criteria is satisfied:}$$

1. **$\\frac{\\text{Pleural Fluid Total Protein}}{\\text{Serum Total Protein}} > 0.5$**
2. **$\\frac{\\text{Pleural Fluid LDH}}{\\text{Serum LDH}} > 0.6$**
3. **$\\text{Pleural Fluid LDH} > \\frac{2}{3} \\text{ of the Upper Limit of Normal (ULN) Serum LDH}$** (typically $> 200\\text{ U/L}$)
*(If NONE of the 3 criteria are met, the effusion is definitively a **TRANSUDATE**)*

| Category | Primary Pathophysiological Mechanism | Common Clinical Etiologies | Typical Biochemical Profile |
| :--- | :--- | :--- | :--- |
| **TRANSUDATE** | Imbalance in systemic hydrostatic or colloid oncotic pressures; **Intact pleural microvascular permeability**. | • **Congestive Heart Failure (CHF)** ($>80\\%$ of transudates; bilateral, right $>$ left).<br>• **Hepatic Hydrothorax (Cirrhosis with ascites)**.<br>• **Nephrotic Syndrome**.<br>• Peritoneal Dialysis. | Protein ratio $\\le 0.5$, LDH ratio $\\le 0.6$, Pleural glucose $=$ serum glucose, $pH\\text{ }7.40 - 7.50$, low cell count ($<1000/\\mu\\text{L}$). |
| **EXUDATE** | Local inflammatory, infectious, or neoplastic process causing **Increased Pleural Capillary Permeability** and impaired lymphatic clearance. | • **Parapneumonic Effusion / Empyema**.<br>• **Malignancy** (Bronchogenic, Breast, Lymphoma, Mesothelioma).<br>• **Tuberculosis Pleurisy**.<br>• Pulmonary Embolism with infarction ($75\\%$ exudates).<br>• Pancreatitis, Rheumatoid arthritis, SLE. | Protein ratio $> 0.5$, LDH ratio $> 0.6$, elevated cell counts ($>1000/\\mu\\text{L}$), variable glucose and $pH$. |

---

## 3. High-Yield Pleural Fluid Analysis & Special Tests

- **Very Low Pleural Glucose ($< 30 - 50\\text{ mg/dL}$)**:
  - **Empyema / Complicated Parapneumonic Effusion** (high bacterial and leukocyte consumption).
  - **Rheumatoid Pleurisy** (characteristically extremely low, often $< 15 - 30\\text{ mg/dL}$).
  - **Malignancy & Tuberculosis**.
- **Elevated Pleural Amylase ($> \\text{Serum Amylase}$)**:
  - **Acute or Chronic Pancreatitis**, Pancreatic Pseudocyst with pleuro-pancreatic fistula.
  - **Esophageal Rupture (Boerhaave Syndrome)**: Salivary amylase with low $pH$ ($< 7.00$).
- **Elevated Adenosine Deaminase (ADA $> 40\\text{ U/L}$)**:
  - Strongly suggestive of **Tuberculous Pleurisy** (especially with lymphocytic predominance $>80\\%$).
- **Triglycerides $> 110\\text{ mg/dL}$ & Chylomicrons**:
  - **Chylothorax** (Disruption of the Thoracic Duct by lymphoma, trauma, or thoracic surgery).

---

## 4. Parapneumonic Effusion Staging & Tube Thoracostomy Guidelines

$$\\begin{array}{rcccl}
\\text{Stage 1: Uncomplicated} & \\longrightarrow & \\text{Clear fluid, } pH > 7.30, \\text{ Glucose} > 60\\text{ mg/dL}, \\text{ Gram-neg} & \\implies & \\text{IV Antibiotics alone} \\\\
\\text{Stage 2: Complicated} & \\longrightarrow & \\mathbf{pH < 7.20, \\text{ Glucose} < 40\\text{ mg/dL}, \\text{ LDH} > 1000\\text{ U/L}} & \\implies & \\mathbf{Mandatory Chest Tube Drainage} \\\\
\\text{Stage 3: Frank Empyema} & \\longrightarrow & \\mathbf{Frank pus or positive Gram stain/culture} & \\implies & \\mathbf{Chest Tube \\pm \\text{Intrapleural tPA/DNase} \\pm \\text{VATS}}
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male with right lower lobe Streptococcus pneumoniae pneumonia is treated with IV Ceftriaxone for 5 days. Despite antibiotic therapy, he has persistent high fevers (39.1°C), worsening right-sided pleuritic chest pain, and a growing moderate right-sided pleural effusion on chest radiograph. Bedside ultrasound-guided diagnostic thoracocentesis yields 60 mL of turbid, yellow fluid. Laboratory analysis of the pleural fluid demonstrates: Total Protein 4.6 g/dL (Serum 6.8 g/dL; ratio 0.68), LDH 1420 U/L (Serum 210 U/L; ratio 6.76), Glucose 24 mg/dL (Serum 110 mg/dL), pH 7.08, and Gram stain reveals Gram-positive diplococci.",
      question: "Which of the following is the diagnosis, and what is the immediate definitive therapeutic intervention?",
      options: [
        "Complicated Parapneumonic Effusion / Empyema; Insert an immediate Tube Thoracostomy (Chest Tube) for continuous drainage",
        "Uncomplicated Parapneumonic Effusion; Continue IV Ceftriaxone monotherapy for another 7 days",
        "Congestive Heart Failure Transudate; Administer IV Furosemide",
        "Tuberculous Pleurisy; Initiate 4-drug HRZE anti-tubercular therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "The pleural fluid satisfies Light's criteria for an Exudate (Protein ratio 0.68 > 0.5, LDH ratio 6.76 > 0.6). The presence of extreme pleural acidosis (pH 7.08 < 7.20), severely low glucose (24 mg/dL < 40 mg/dL), LDH > 1000 U/L, and a positive Gram stain establishes the diagnosis of a Complicated Parapneumonic Effusion / Empyema. In addition to broad-spectrum IV antibiotics, immediate Tube Thoracostomy (Chest Tube drainage) is mandatory because spontaneous resolution with antibiotics alone will not occur, risking fibrothorax and loculation."
    }
  ]
};
