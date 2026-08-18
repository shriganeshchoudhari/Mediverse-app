/**
 * Hematology: Acute & Chronic Leukemias & Myeloproliferative Neoplasms
 * Authoritative medical content derived from Williams Hematology (10th ed.), Hoffman's Hematology (8th ed.).
 * Mapped to NMC CBME Competencies: PA17.1, PA17.2, PA18.1, PA18.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const LEUKEMIAS_MYELOPROLIFERATIVE_MODULE: PhysiologyLessonModule = {
  id: "hematology-adv-leukemias-myeloproliferative",
  unitCode: "HE5.1",
  title: "Acute & Chronic Leukemias: AML (Auer Rods), ALL, CML (BCR-ABL1), CLL (Smudge Cells) & MPNs",
  competencies: ["PA17.1", "PA17.2", "PA18.1", "PA18.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Acute & Chronic Leukemias & Myeloproliferative Neoplasms (MPNs)

Leukemias represent malignant clonal proliferations of hematopoietic stem cells or lymphoid progenitors in the bone marrow and peripheral blood.

---

## 1. The Four Major Leukemias Diagnostic Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Leukemia Subtype} & \\textbf{Predominant Age} & \\textbf{Key Cytogenetic Aberration} & \\textbf{Diagnostic Morphological / Flow Hallmark} & \\textbf{First-Line Targeted Therapy} \\\\
\\hline
\\textbf{Acute Myeloid (AML)} & \\text{Adults (median 68y)} & \\text{t}(15;17) \\text{ in APL (PML-RARA)} & \\mathbf{\\text{Auer Rods}} \\text{ (MPO+), } \u003e20\\% \\text{ myeloblasts} & \\text{"7+3" Cytarabine + Daunorubicin; } \\\\
& & & & \\mathbf{\\text{ATRA + ATO}} \\text{ for APL (cures DIC!)} \\\\
\\hline
\\textbf{Acute Lymphoblastic (ALL)} & \\text{Children (peak 2-5y)} & \\text{t}(12;21) \\text{ (ETV6-RUNX1);} & \\mathbf{\\text{TdT+}}, \\text{ CD10/CALLA+}, \u003e20\\% \\text{ lymphoblasts} & \\text{Multi-agent chemotherapy} \\\\
& & \\text{t}(9;22) \\text{ Philadelphia chromosome} & & + \\text{ Tyrosine Kinase Inhibitor (TKI)} \\\\
\\hline
\\textbf{Chronic Myelogenous (CML)} & \\text{Adults (40-60y)} & \\mathbf{\\text{t}(9;22)(q34;q11)} & \\text{Full myeloid spectrum, } \\downarrow\\mathbf{\\text{LAP Score}}, & \\mathbf{\\text{Imatinib / Dasatinib}} \\\\
& & \\text{BCR-ABL1 fusion kinase} & \\text{prominent basophilia \u0026 splenomegaly} & (\\text{BCR-ABL1 Tyrosine Kinase Inhibitors}) \\\\
\\hline
\\textbf{Chronic Lymphocytic (CLL)} & \\text{Elderly (}\u003e65\\text{y)} & \\text{del}(13q), \\text{ del}(17p) / \\text{TP53} & \\mathbf{\\text{Smudge / Basket Cells}}, & \\text{BTK Inhibitors (Ibrutinib, Acalabrutinib),} \\\\
& & & \\text{CD5+ CD19+ CD23+ mature B-cells} & \\text{BCL-2 Inhibitor (Venetoclax)} \\\\
\\hline
\\end{array}$$

---

## 2. Acute Promyelocytic Leukemia (APL) & The DIC Medical Emergency

- **Cytogenetics**: Balanced reciprocal translocation $\\text{t}(15;17)(q22;q12)$ fusing the Promyelocytic Leukemia (*PML*) gene on chromosome 15 to the Retinoic Acid Receptor Alpha (*RARA*) gene on chromosome 17.
- **Pathology**: Heavy accumulation of abnormal promyelocytes packed with multiple crystalline azurophilic **Auer rods ("faggot cells")**.
- **Clinical Emergency**: Degranulation of promyelocyte granules releases tissue factor and procoagulants, triggering severe, life-threatening **Disseminated Intravascular Coagulation (DIC)** with fatal intracranial hemorrhage.
- **Definitive Targeted Cure**: **All-trans Retinoic Acid (ATRA) + Arsenic Trioxide (ATO)** induces differentiation of malignant promyelocytes into mature granulocytes, rapidly terminating the DIC coagulopathy.

---

## 3. Chronic Myeloproliferative Neoplasms (MPNs)

- **The *JAK2* V617F Mutation**: Constitutive activating point mutation in Janus Kinase 2 driving erythropoietin-independent proliferation.
  1. **Polycythemia Vera (PV)**: Clonal panmyelosis with massive expansion of red cell mass, low serum erythropoietin (EPO), severe **aquagenic pruritus** (itching after warm baths), erythromelalgia, and thrombosis $\\rightarrow$ Phlebotomy (target $\\text{Hct} < 45\\%$) $+$ Hydroxyurea.
  2. **Essential Thrombocythemia (ET)**: Sustained platelet count $>450,000/\\mu\\text{L}$ with large megakaryocytes; thrombotic and hemorrhagic complications.
  3. **Primary Myelofibrosis (PMF)**: Clonal megakaryocyte release of PDGF/TGF-$\\beta \\rightarrow$ progressive bone marrow fibrosis $\\rightarrow$ **"Dry tap"** on marrow aspiration, extramedullary hematopoiesis leading to **massive splenomegaly**, and **Teardrop poikilocytes (Dacryocytes)** and leucoerythroblastic picture on smear.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female presents to the emergency department with profound gingival bleeding, epistaxis, and widespread ecchymoses over her trunk. Complete blood count shows: Hemoglobin 7.8 g/dL, White Blood Cell count 2,400/uL, and Platelets 18,000/uL. Coagulation profile shows: PT 22 sec, aPTT 48 sec, Fibrinogen 70 mg/dL (normal: 200-400), and D-dimer markedly elevated at >20 ug/mL. A peripheral blood smear demonstrates abnormal promyelocytes with hypergranular cytoplasm containing sheaves of stacked, crystalline Auer rods ('faggot cells').",
      question: "Which of the following represents the diagnostic cytogenetic translocation and the emergency targeted therapy that should be initiated immediately?",
      options: [
        "t(15;17)(q22;q12) PML-RARA; Immediate initiation of All-trans Retinoic Acid (ATRA) with Arsenic Trioxide",
        "t(9;22)(q34;q11) BCR-ABL1; Immediate initiation of Imatinib mesylate",
        "t(8;14)(q24;q32) MYC-IGH; Multi-agent R-CHOP chemotherapy",
        "t(11;14)(q13;q32) CCND1; Autologous stem cell transplant"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with Acute Promyelocytic Leukemia (APL, AML-M3) complicated by severe life-threatening Disseminated Intravascular Coagulation (DIC: prolonged PT/aPTT, hypofibrinogenemia, elevated D-dimer). APL is characterized cytogenetically by the t(15;17)(q22;q12) PML-RARA translocation and morphologically by promyelocytes with multiple Auer rods ('faggot cells'). Emergency initiation of All-trans Retinoic Acid (ATRA) along with Arsenic Trioxide (ATO) must occur immediately without waiting for cytogenetic confirmation, as ATRA induces differentiation of malignant promyelocytes and halts the fatal DIC coagulopathy."
    }
  ]
};
