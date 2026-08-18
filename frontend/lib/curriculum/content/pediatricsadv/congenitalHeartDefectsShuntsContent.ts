/**
 * Pediatrics: Congenital Heart Defects: Cyanotic (5 Ts) vs Acyanotic Shunts
 * Authoritative medical content derived from Nelson Textbook of Pediatrics (21st ed.), Moss & Adams' Heart Disease in Infants.
 * Mapped to NMC CBME Competencies: PE1.1, PE1.2, PA41.1, PA41.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CONGENITAL_HEART_DEFECTS_SHUNTS_MODULE: PhysiologyLessonModule = {
  id: "pediatrics-adv-congenital-heart-defects-shunts",
  unitCode: "PE1.1",
  title: "Congenital Heart Defects: Cyanotic (5 Ts: ToF, TGA, Truncus) vs Acyanotic Left-to-Right Shunts",
  competencies: ["PE1.1", "PE1.2", "PA41.1", "PA41.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Congenital Heart Diseases & Fetal Hemodynamics

Congenital heart defects are classified by hemodynamic presentation into **Early Cyanotic (Right-to-Left Shunts)** and **Late Cyanotic / Acyanotic (Left-to-Right Shunts)**.

---

## 1. Cyanotic Congenital Heart Diseases: The 5 Ts

$$\\begin{array}{lccc}
\\hline
\\textbf{Defect (The 5 Ts)} & \\textbf{Embryological Mechanism} & \\textbf{Classic Radiograph (CXR)} & \\textbf{Key Clinical Feature / Rx} \\\\
\\hline
\\textbf{1 T: Truncus Arteriosus} & \\text{Failure of truncoconal septation} & \\text{Cardiomegaly, } \\uparrow\\text{pulmonary flow} & \\mathbf{\\text{DiGeorge (22q11.2) association}} \\\\
\\textbf{2 Ts: Transposition (TGA)} & \\mathbf{\\text{Failure of aorticopulmonary spiraling}} & \\mathbf{\\text{\"Egg-on-a-string\" silhouette}} & \\mathbf{\\text{Immediate PGE}_1\\text{ infusion (Alprostadil)}} \\\\
& \\text{(Aorta from RV; Pulm artery from LV)} & & \\text{Arterial switch (Jatene) surgery} \\\\
\\textbf{3 Ts: Tricuspid Atresia} & \\text{Absence of tricuspid orifice} & \\text{Decreased pulmonary vascularity} & \\mathbf{\\text{Hypoplastic RV; Requires ASD + VSD}} \\\\
\\textbf{4 Ts: Tetralogy of Fallot (ToF)} & \\mathbf{\\text{Anterosuperior infundibular displacement}} & \\mathbf{\\text{\"Boot-shaped\" heart (coeur en sabot)}} & \\mathbf{\\text{\"Tet spells\" relieved by SQUATTING;}} \\\\
& \\mathbf{\\text{PROVe: Pulm stenosis, RVH, Aorta, VSD}} & & \\text{Infundibular stenosis dictates cyanosis} \\\\
\\textbf{5 Ts: TAPVR} & \\text{Pulmonary veins drain into SVC/RA} & \\mathbf{\\text{\"Snowman\" / \"Figure-8\" sign}} & \\text{Must have ASD/PFO for survival} \\\\
\\hline
\\end{array}$$

- **Pathophysiology of Tet Spells in Tetralogy of Fallot**:
  - Infundibular spasm or crying increases right ventricular outflow resistance, diverting desaturated blood through the VSD into the aorta $\rightarrow$ profound hypoxemia.
  - **Squatting / Knee-Chest Position**: Mechanically compresses femoral arteries, increasing **Systemic Vascular Resistance (SVR)** $\rightarrow$ raises left ventricular pressure above RV pressure $\rightarrow$ **reverses shunt to Left-to-Right**, driving blood into the pulmonary circulation.

---

## 2. Acyanotic Left-to-Right Shunts & Coarctation

$$\\begin{array}{lcccc}
\\hline
\\textbf{Acyanotic Defect} & \\textbf{Auscultation Hallmark} & \\textbf{Associated Condition} & \\textbf{Definitive Management} \\\\
\\hline
\\textbf{Ventricular Septal (VSD)} & \\mathbf{\\text{Harsh Holosystolic Murmur at LLSB}} & \\text{Down, Fetal Alcohol} & \\text{Surgical patch / spontaneous closure} \\\\
\\textbf{Atrial Septal (ASD)} & \\mathbf{\\text{Fixed Widely Split } S_2\\text{ + Systolic Ejection}} & \\text{Secundum (80%) / Primum (Down)} & \\text{Percutaneous closure / surgical repair} \\\\
\\textbf{Patent Ductus Arteriosus (PDA)} & \\mathbf{\\text{Continuous \"Machine-Like\" Murmur}} & \\text{Prematurity, Congenital Rubella} & \\mathbf{\\text{Indomethacin / Ibuprofen (PGE closure)}} \\\\
\\textbf{Coarctation of Aorta (CoA)} & \\mathbf{\\text{Radio-Femoral Pulse Delay; Upper HTN}} & \\mathbf{\\text{Turner Syndrome (45,X)}} & \\text{Balloon angioplasty / resection} \\\\
\\hline
\\end{array}$$

- **Eisenmenger Syndrome**: Unrepaired large VSD, ASD, or PDA leads to chronic pulmonary vascular shear stress $\rightarrow$ muscular hypertrophy of pulmonary arterioles $\rightarrow$ severe irreversible pulmonary hypertension $\rightarrow$ **shunt reversal (Right-to-Left)** causing late cyanosis, digital clubbing, and compensatory erythrocytosis.
`,
  clinicalVignettes: [
    {
      scenario: "A 2-day-old male infant born to a diabetic mother develops profound cyanosis that fails to improve despite administration of 100% oxygen via a non-rebreather mask (hyperoxia challenge test shows PaO2 42 mmHg). Vital signs: RR 68/min, HR 158 bpm, SpO2 64%. Physical examination demonstrates central cyanosis without a significant heart murmur. Chest radiograph demonstrates mild cardiomegaly with a narrow mediastinum, resembling an 'egg-on-a-string' cardiac silhouette, with increased pulmonary vascular markings.",
      question: "Which of the following represents the underlying embryological defect and the immediate life-saving medical intervention?",
      options: [
        "Failure of the aorticopulmonary septum to spiral (Transposition of the Great Arteries); Immediate continuous intravenous infusion of Prostaglandin E1 (Alprostadil)",
        "Anterosuperior displacement of the infundibular septum (Tetralogy of Fallot); Immediate intravenous Indomethacin infusion",
        "Failure of truncoconal septation (Truncus Arteriosus); Emergent high-dose Furosemide diuresis",
        "Premature closure of the ductus arteriosus; Emergent hyperbaric oxygen therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This newborn presents with refractory cyanosis (unresponsive to 100% oxygen) and an 'egg-on-a-string' cardiac silhouette on CXR, pathognomonic for D-Transposition of the Great Arteries (D-TGA). In TGA, failure of the aorticopulmonary septum to spiral results in two parallel, independent closed circuits (RV pumps desaturated systemic blood to aorta; LV pumps oxygenated blood to pulmonary arteries). Survival is entirely dependent on keeping the ductus arteriosus patent to permit mixing of blood. The immediate life-saving therapy is continuous IV infusion of Prostaglandin E1 (PGE1 / Alprostadil) to maintain ductal patency while preparing for balloon atrial septostomy and arterial switch surgery."
    }
  ]
};
