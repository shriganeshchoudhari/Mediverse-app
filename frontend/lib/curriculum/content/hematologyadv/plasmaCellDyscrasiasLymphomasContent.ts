/**
 * Hematology: Plasma Cell Dyscrasias & Lymphomas
 * Authoritative medical content derived from Williams Hematology (10th ed.), Hoffman's Hematology (8th ed.).
 * Mapped to NMC CBME Competencies: PA19.1, PA19.2, PA20.1, PA20.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PLASMA_CELL_DYSCRASIAS_LYMPHOMAS_MODULE: PhysiologyLessonModule = {
  id: "hematology-adv-plasma-cell-dyscrasias-lymphomas",
  unitCode: "HE7.1",
  title: "Plasma Cell Dyscrasias & Lymphomas: Multiple Myeloma (CRAB Criteria), MGUS, Hodgkin & Non-Hodgkin",
  competencies: ["PA19.1", "PA19.2", "PA20.1", "PA20.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Plasma Cell Dyscrasias & Malignant Lymphomas

Plasma cell dyscrasias and lymphomas represent clonal expansions of B-cell lineage neoplasms characterized by distinct immunophenotypic, cytogenetic, and clinical signatures.

---

## 1. Multiple Myeloma vs Smoldering MM vs MGUS

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Entity} & \\textbf{Serum M-Protein Spike} & \\textbf{Clonal Bone Marrow Plasma Cells} & \\textbf{End-Organ CRAB Features} \\\\
\\hline
\\textbf{MGUS} & \u003c3.0\\text{ g/dL} & \u003c10\\% & \\mathbf{\\text{ABSENT (No CRAB)}} \\\\
\\textbf{Smoldering Myeloma} & \\ge 3.0\\text{ g/dL} & 10 - 59\\% & \\mathbf{\\text{ABSENT (No CRAB)}} \\\\
\\textbf{Active Multiple Myeloma} & \\text{Any concentration} & \\ge 10\\% & \\mathbf{\\text{PRESENT (}\\ge 1\\text{ CRAB feature or biomarker)}} \\\\
\\hline
\\end{array}$$

- **The Four Cardinal CRAB Criteria in Multiple Myeloma**:
  1. **C**alcium Elevation: Serum calcium $>11.0\\text{ mg/dL}$ (due to osteoclast activation via RANKL/DKK1).
  2. **R**enal Insufficiency: Serum creatinine $>2.0\\text{ mg/dL}$ or GFR $<40\\text{ mL/min}$ (light chain cast nephropathy / "myeloma kidney").
  3. **A**nemia: Normocytic normochromic with hemoglobin $<10.0\\text{ g/dL}$ (or $>2\\text{ g/dL}$ below lower limit).
  4. **B**one Lesions: One or more "punched-out" osteolytic lesions on skeletal survey, CT, or MRI.

---

## 2. Waldenström Macroglobulinemia & Hyperviscosity

- **Clonal Lineage**: Lymphoplasmacytic lymphoma producing monoclonal **IgM pentamers**.
- **Pathophysiology**: High molecular weight IgM ($900\\text{ kDa}$) dramatically increases serum viscosity $\\rightarrow$ **Hyperviscosity Syndrome**:
  - Blurred vision with "sausage-link" retinal vein engorgement on funduscopy.
  - Mucosal epistaxis and oropharyngeal bleeding.
  - Headache, dizziness, ataxia, and fluctuating confusion.
- **Treatment of Hyperviscosity**: **Emergency Therapeutic Plasmapheresis (Plasma Exchange)** followed by Bruton Tyrosine Kinase (BTK) inhibitors (Ibrutinib, Zanubrutinib).

---

## 3. Hodgkin vs Non-Hodgkin Lymphomas

$$\\begin{array}{lcccc}
\\hline
\\textbf{Lymphoma Subtype} & \\textbf{Characteristic Histology} & \\textbf{Key Translocation / Genetics} & \\textbf{Clinical Hallmarks} \\\\
\\hline
\\textbf{Classical Hodgkin (cHL)} & \\mathbf{\\text{Reed-Sternberg Cells}} & \\text{EBV association (50\\%);} & \\text{B-symptoms (fever, sweats, weight loss),} \\\\
& (\\text{CD15+, CD30+, "owl-eyed"}) & \\text{9p24.1 (PD-L1 overexpression)} & \\text{Pel-Ebstein fevers, alcohol lymph pain} \\\\
\\hline
\\textbf{Diffuse Large B-Cell (DLBCL)} & \\text{Large vesicular nuclei with nucleoli} & \\text{BCL6 (3q27), BCL2, MYC;} & \\text{Rapidly enlarging symptomatic nodal/extraneodal} \\\\
& (\\text{CD20+, CD19+, PAX5+}) & \\text{Aggressive Non-Hodgkin} & \\text{mass; standard therapy is }\\mathbf{\\text{R-CHOP}} \\\\
\\hline
\\textbf{Follicular Lymphoma} & \\text{Nodular growth pattern of centrocytes} & \\mathbf{\\text{t}(14;18)(q32;q21)} & \\text{Indolent, painless, "waxing and waning"} \\\\
& (\\text{cleaved small cells}) & \\text{overexpresses }\\mathbf{\\text{BCL-2 (anti-apoptotic)}} & \\text{generalized lymphadenopathy} \\\\
\\hline
\\textbf{Burkitt Lymphoma} & \\mathbf{\\text{"Starry-Sky" Pattern}} & \\mathbf{\\text{t}(8;14)(q24;q32)} & \\text{Endemic jaw mass (EBV); sporadic abdominal mass;} \\\\
& (\\text{macrophages in sheet of B-cells}) & \\text{constitutive }\\mathbf{\\text{c-MYC}}\\text{ activation} & \\text{Ki-67 proliferation index } \\approx 100\\% \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 66-year-old male presents with persistent lower back pain, lethargy, and constipation. Laboratory studies reveal: Hemoglobin 9.1 g/dL, Serum Calcium 12.2 mg/dL (normal: 8.5-10.2), Serum Creatinine 2.6 mg/dL (normal: 0.7-1.3), Total Protein 9.8 g/dL, and Albumin 3.2 g/dL. Serum Protein Electrophoresis (SPEP) reveals a dense narrow band in the gamma region (monoclonal IgG M-spike of 4.2 g/dL). A plain radiograph of the skull demonstrates multiple well-demarcated 'punched-out' lytic lesions with no sclerotic rim.",
      question: "Which of the following bone marrow findings is required to confirm the diagnosis of Multiple Myeloma in this patient?",
      options: [
        "Clonal bone marrow plasma cells >=10% with CRAB criteria",
        "Clonal bone marrow plasma cells <10% with absent osteolytic lesions",
        "Abundant binucleated Reed-Sternberg cells expressing CD15 and CD30",
        "Sheets of mature small lymphocytes with smudge cells"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the full spectrum of active Multiple Myeloma fulfilling the CRAB criteria: Calcium elevation (12.2 mg/dL), Renal insufficiency (Creatinine 2.6 mg/dL due to light chain cast nephropathy), Anemia (9.1 g/dL), and Bone lytic lesions on skull radiograph, supported by a dense IgG M-spike on SPEP. The definitive diagnostic criteria for Multiple Myeloma require the demonstration of clonal bone marrow plasma cells >=10% (or biopsy-proven bony/extramedullary plasmacytoma) in the presence of one or more CRAB features."
    }
  ]
};
