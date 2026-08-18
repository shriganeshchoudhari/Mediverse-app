/**
 * Hematology: Anemia Algorithmic Diagnostic Profiling
 * Authoritative medical content derived from Williams Hematology (10th ed.), Hoffman's Hematology (8th ed.).
 * Mapped to NMC CBME Competencies: PA15.1, PA15.2, PA16.1, PA16.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANEMIA_ALGORITHMIC_PROFILING_MODULE: PhysiologyLessonModule = {
  id: "hematology-adv-anemia-algorithmic-profiling",
  unitCode: "HE3.1",
  title: "Anemia Diagnostic Algorithms: Microcytic Iron/Thalassemia, Normocytic Hemolysis & Macrocytic B12/Folate",
  competencies: ["PA15.1", "PA15.2", "PA16.1", "PA16.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Anemia Diagnostic Algorithms & Erythrocyte Pathophysiology

Anemia is defined as a reduction in total circulating red blood cell mass, evaluated systematically according to Mean Corpuscular Volume (MCV) and Reticulocyte Response.

---

## 1. Microcytic Hypochromic Anemias ($\\text{MCV} < 80\\text{ fL}$)

$$\\begin{array}{lccccc}
\\hline
\\textbf{Microcytic Disorder} & \\textbf{Serum Iron} & \\textbf{TIBC} & \\textbf{Ferritin} & \\textbf{Transferrin Sat} & \\textbf{Key Smear / Diagnostic Hallmark} \\\\
\\hline
\\textbf{Iron Deficiency Anemia (IDA)} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\downarrow\\downarrow} \\text{ (}\u003c30\\text{)} & \\mathbf{\\downarrow} \\text{ (}\u003c15\\%\\text{)} & \\text{Pencil / cigar cells, high RDW} \\\\
\\textbf{Anemia of Chronic Disease (ACD)} & \\mathbf{\\downarrow} & \\mathbf{\\downarrow} & \\mathbf{\\uparrow} \\text{ or Normal} & \\text{Normal / } \\downarrow & \\text{Hepcidin upregulation (inflammation)} \\\\
\\textbf{Thalassemia Minor (}\\alpha\\text{ or }\\beta\\text{)} & \\text{Normal / }\\uparrow & \\text{Normal} & \\text{Normal / }\\uparrow & \\text{Normal} & \\text{Target cells, Mentzer Index } \u003c13\\text{, } \\uparrow\\text{HbA}_2 \\\\
\\textbf{Sideroblastic Anemia} & \\mathbf{\\uparrow\\uparrow} & \\text{Normal / }\\downarrow & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow\\uparrow} & \\text{Ringed sideroblasts (Prussian blue)} \\\\
\\hline
\\end{array}$$

- **Mentzer Index Formula**:
  $$\\text{Mentzer Index} = \\frac{\\text{MCV (fL)}}{\\text{RBC Count (}\\times 10^6/\\mu\\text{L)}} \\quad (\\text{Index } \u003c13 \\implies \\text{Thalassemia Trait}; \\text{ Index } \u003e13 \\implies \\text{Iron Deficiency})$$

---

## 2. Normocytic Anemias ($\\text{MCV } 80-100\\text{ fL}$) & Hemolytic Profiling

- **Corrected Reticulocyte Index (CRI)**:
  $$\\text{CRI} = \\text{Reticulocyte Count (\\%)} \\times \\frac{\\text{Patient\'s Hematocrit}}{45} \\times \\frac{1}{\\text{Maturation Correction Factor}}$$
  - $\\text{CRI} > 2.0\\% \\implies \\text{Appropriate bone marrow response: Active Hemolysis or Acute Blood Loss}$.
  - $\\text{CRI} < 2.0\\% \\implies \\text{Inadequate marrow response: Hypoproliferation, Aplastic Anemia, Pure Red Cell Aplasia}$.
- **Intravascular vs Extravascular Hemolysis**:
  - **Intravascular Hemolysis** (PNH, mechanical valve, G6PD, DIC): Marked $\\downarrow \\text{Haptoglobin}$, $\\uparrow \\text{LDH}$, $\\uparrow \\text{Indirect Bilirubin}$, Hemoglobinuria, Hemosiderinuria.
  - **Extravascular Hemolysis** (Hereditary Spherocytosis, Warm Autoimmune Hemolytic Anemia AIHA): Spherocytes on smear, positive Direct Antiglobulin Test (DAT/Coombs in AIHA), Splenomegaly.

---

## 3. Macrocytic Megaloblastic Anemias ($\\text{MCV} > 100\\text{ fL}$)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Nutritional Deficiency} & \\textbf{Methylmalonic Acid (MMA)} & \\textbf{Homocysteine} & \\textbf{Neurological Deficits} & \\textbf{Peripheral Smear} \\\\
\\hline
\\textbf{Vitamin B12 (Cobalamin) Deficiency} & \\mathbf{\\uparrow\\uparrow\\text{ (ELEVATED)}} & \\mathbf{\\uparrow\\uparrow\\text{ (ELEVATED)}} & \\mathbf{\\text{PRESENT (Subacute Combined Degeneration)}} & \\text{Hypersegmented Neutrophils (}\\ge 5\\text{ lobes)} \\\\
\\textbf{Folate (Vitamin B9) Deficiency} & \\mathbf{\\text{NORMAL}} & \\mathbf{\\uparrow\\uparrow\\text{ (ELEVATED)}} & \\mathbf{\\text{ABSENT}} & \\text{Hypersegmented Neutrophils (}\\ge 5\\text{ lobes)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with a history of distal ileal resection for Crohn disease presents with progressive paresthesias in both feet, unsteady gait, and fatigue. Physical examination reveals pallor, glossitis, diminished vibration sense and proprioception at the toes, and a positive Romberg test. Laboratory studies demonstrate: Hemoglobin 8.4 g/dL, MCV 114 fL, White Blood Cell count 3,600/uL, Platelets 120,000/uL, and Reticulocyte count 0.6%. A peripheral blood smear reveals oval macrocytes and multiple hypersegmented neutrophils with 6 lobes.",
      question: "Which of the following biochemical profiles is most specific for confirming the diagnosis in this patient?",
      options: [
        "Elevated serum methylmalonic acid (MMA) and elevated serum homocysteine levels (Vitamin B12 deficiency)",
        "Normal serum methylmalonic acid and elevated serum homocysteine levels (Folate deficiency)",
        "Low serum ferritin and elevated total iron-binding capacity",
        "Elevated hemoglobin A2 on hemoglobin electrophoresis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Vitamin B12 (Cobalamin) deficiency secondary to malabsorption from ileal resection (the site of intrinsic factor-B12 complex absorption). Hallmarks include macrocytic megaloblastic anemia (MCV >100 fL, hypersegmented neutrophils) and Subacute Combined Degeneration (SCD) of the spinal cord (dorsal column vibration/proprioception loss). Vitamin B12 serves as a cofactor for methylmalonyl-CoA mutase; its deficiency leads to accumulation of BOTH Methylmalonic Acid (MMA) and Homocysteine. In contrast, Folate deficiency causes elevation of Homocysteine ONLY with normal MMA and lacks neurological deficits."
    }
  ]
};
