/**
 * Hematology: Coagulation Cascades, Platelet Disorders & Hemostasis
 * Authoritative medical content derived from Williams Hematology (10th ed.), Hoffman's Hematology (8th ed.).
 * Mapped to NMC CBME Competencies: PA13.1, PA13.2, PA14.1, PA14.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const COAGULATION_CASCADE_HEMOSTASIS_MODULE: PhysiologyLessonModule = {
  id: "hematology-adv-coagulation-cascade-hemostasis",
  unitCode: "HE1.1",
  title: "Primary vs Secondary Hemostasis: ITP, TTP (ADAMTS13), DIC, Hemophilia A/B & von Willebrand Disease",
  competencies: ["PA13.1", "PA13.2", "PA14.1", "PA14.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Primary vs Secondary Hemostasis & Coagulation Pathophysiology

Hemostasis is a finely balanced physiological process comprising primary hemostasis (platelet plug formation) and secondary hemostasis (fibrin clot stabilization via the coagulation cascade).

---

## 1. Primary vs Secondary Hemostasis Diagnostic Distinctions

$$\\begin{array}{lcccc}
\\hline
\\textbf{Hemostatic Disorder} & \\textbf{Platelet Count} & \\textbf{Bleeding Time} & \\textbf{PT / INR} & \\textbf{aPTT} \\\\
\\hline
\\textbf{Immune Thrombocytopenic Purpura (ITP)} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow} & \\text{Normal} & \\text{Normal} \\\\
\\textbf{Thrombotic Thrombocytopenic Purpura (TTP)} & \\mathbf{\\downarrow\\downarrow} & \\mathbf{\\uparrow} & \\text{Normal} & \\text{Normal} \\\\
\\textbf{Disseminated Intravascular Coagulation (DIC)} & \\mathbf{\\downarrow} & \\mathbf{\\uparrow} & \\mathbf{\\uparrow} & \\mathbf{\\uparrow} \\\\
\\textbf{von Willebrand Disease (vWD)} & \\text{Normal} & \\mathbf{\\uparrow} & \\text{Normal} & \\text{Normal or } \\mathbf{\\uparrow} \\\\
\\textbf{Hemophilia A (Factor VIII) / B (Factor IX)} & \\text{Normal} & \\text{Normal} & \\text{Normal} & \\mathbf{\\uparrow\\uparrow} \\\\
\\textbf{Vitamin K Deficiency / Warfarin} & \\text{Normal} & \\text{Normal} & \\mathbf{\\uparrow\\uparrow} & \\mathbf{\\uparrow} \\text{ (in severe)} \\\\
\\hline
\\end{array}$$

---

## 2. Microangiopathic & Platelet Disorders

1. **Thrombotic Thrombocytopenic Purpura (TTP)**:
   - **Etiology**: Severe autoantibody deficiency of **ADAMTS13 metalloprotease** ($<10\\%$) $\\rightarrow$ inability to cleave ultra-large von Willebrand factor (vWF) multimers $\\rightarrow$ platelet microthrombi occluding arterioles and capillaries.
   - **The Classic TTP Pentad (FAT RN)**:
     1. **F**ever
     2. **A**nemia (Microangiopathic Hemolytic Anemia [MAHA] with abundant schistocytes on blood smear)
     3. **T**hrombocytopenia (severe, leading to purpura/petechiae)
     4. **R**enal insufficiency (mild-to-moderate)
     5. **N**eurological deficits (fluctuating confusion, seizures, focal deficits, coma)
   - **Therapeutic Emergency**: **Emergent Plasma Exchange (PLEX) + Caplacizumab (anti-vWF nanobody) + Corticosteroids**.
   - *Platelet transfusion is strictly contraindicated because it fuels further microvascular thrombosis!*

2. **Immune Thrombocytopenic Purpura (ITP)**:
   - **Pathophysiology**: Autoantibodies (IgG) against platelet membrane glycoproteins (**anti-GpIIb/IIIa**) $\\rightarrow$ splenic macrophage phagocytosis and premature destruction.
   - **Management**: First-line: High-dose Corticosteroids (Prednisone / Dexamethasone) $\\pm$ IVIG; Second-line: Rituximab, Thrombopoietin Receptor Agonists (Eltrombopag, Romiplostim), Splenectomy.

3. **Disseminated Intravascular Coagulation (DIC)**:
   - **Pathophysiology**: Systemic activation of coagulation (sepsis, trauma, obstetric catastrophes, acute promyelocytic leukemia) $\\rightarrow$ widespread microvascular thrombosis consuming clotting factors and platelets $\rightarrow$ paradoxically severe bleeding and end-organ ischemia.
   - **Laboratory Profile**: $\\uparrow \\text{PT}$, $\\uparrow \\text{aPTT}$, $\\uparrow \\text{D-dimer}$, $\\downarrow \\text{Fibrinogen}$, $\\downarrow \\text{Platelets}$, Schistocytes.

---

## 3. Coagulation Factor Deficiencies & Inherited Platelet Defects

- **von Willebrand Disease (vWD)**: Most common inherited bleeding disorder (Autosomal Dominant). vWF binds GpIb on platelets and stabilizes Factor VIII.
  - **Diagnostic Tests**: Decreased vWF antigen, decreased vWF activity (Ristocetin cofactor assay), normal or prolonged aPTT.
  - **Therapy**: Desmopressin (DDAVP stimulates endothelial vWF release); vWF/Factor VIII concentrate for severe bleeding.
- **Bernard-Soulier Syndrome**: Autosomal recessive deficiency of **GpIb** $\\rightarrow$ impaired platelet adhesion to subendothelial vWF $\rightarrow$ **Giant platelets** and thrombocytopenia; abnormal ristocetin aggregation that *does not correct* with normal plasma.
- **Glanzmann Thrombasthenia**: Autosomal recessive deficiency of **GpIIb/IIIa** $\\rightarrow$ impaired platelet aggregation and fibrinogen binding $\rightarrow$ Normal platelet count and morphology; abnormal aggregation to ADP/epinephrine/collagen, but normal ristocetin test.
- **Hemophilia A vs B**: X-linked recessive bleeding disorders causing deep tissue bleeding (hemarthroses, intramuscular hematomas).
  - Hemophilia A (Factor VIII deficiency); Hemophilia B (Factor IX deficiency / Christmas disease).
  - Mixing study (1:1 mix with normal plasma) completely corrects the prolonged aPTT, confirming factor deficiency over an inhibitor.
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female presents to the emergency department with fluctuating confusion, headache, petechial rash on both lower extremities, and fever (38.4°C). Laboratory investigations reveal: Hemoglobin 7.2 g/dL, Platelets 12,000/uL, Serum Creatinine 2.1 mg/dL, Total Bilirubin 3.8 mg/dL (Indirect 3.2 mg/dL), and LDH 1,450 U/L (normal: 140-280). Coagulation profile shows: PT 12.0 sec (normal: 11-13.5), INR 1.0, aPTT 28 sec (normal: 25-35), and Fibrinogen 320 mg/dL (normal: 200-400). A peripheral blood smear demonstrates prominent schistocytes (helmet cells) with marked reduction in platelets.",
      question: "Which of the following represents the underlying molecular pathophysiology and the immediate life-saving intervention indicated for this patient?",
      options: [
        "Autoantibody-mediated deficiency of ADAMTS13 metalloprotease; Emergent Plasma Exchange (PLEX) with corticosteroids",
        "Autoantibodies against platelet GpIIb/IIIa; Emergency platelet transfusion and IVIG",
        "Widespread consumption of clotting factors and platelets; Infusion of Fresh Frozen Plasma (FFP) and Cryoprecipitate",
        "Inherited deficiency of Factor VIII; Recombinant Factor VIII concentrate replacement"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic pentad of Thrombotic Thrombocytopenic Purpura (TTP): Microangiopathic Hemolytic Anemia (MAHA with schistocytes, high LDH, indirect hyperbilirubinemia), severe thrombocytopenia, fever, renal dysfunction, and fluctuating neurological deficits, with completely NORMAL coagulation parameters (normal PT, aPTT, fibrinogen, differentiating it from DIC). TTP is caused by severe deficiency of the ADAMTS13 metalloprotease (often due to inhibitory autoantibodies), leading to ultra-large vWF multimers and microvascular thrombosis. The immediate standard-of-care intervention is Emergent Plasma Exchange (PLEX) to remove antibodies and replenish ADAMTS13. Platelet transfusion is contraindicated."
    }
  ]
};
