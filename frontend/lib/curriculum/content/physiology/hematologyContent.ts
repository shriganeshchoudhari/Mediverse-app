/**
 * Hematology & Hemostasis Physiology Learning Content
 * Authoritative medical content derived from Guyton & Hall (14th ed.), Costanzo, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PY2.1, PY2.2, PY2.3, PY2.4, PY2.5
 */

import { PhysiologyLessonModule } from "./cardiacCycleContent";

export const HEMATOLOGY_MODULE: PhysiologyLessonModule = {
  id: "phys-hematology",
  unitCode: "PY2.1",
  title: "Hemostasis, Coagulation Cascade & Blood Group Immunology",
  competencies: ["PY2.1", "PY2.2", "PY2.3", "PY2.4"],
  estimatedMinutes: 110,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Hemostasis, Coagulation Cascade & Blood Group Immunology

Hemostasis is the tightly regulated physiological process that arrests bleeding from injured blood vessels while preventing inappropriate pathological intravascular thrombosis.

---

## 1. Primary Hemostasis: Platelet Plug Formation

1. **Endothelial Injury & Vasoconstriction**:
   - Damaged endothelial cells release **Endothelin-1** causing local reflex arteriolar vasoconstriction (transiently reducing blood loss).
2. **Platelet Adhesion**:
   - Subendothelial collagen binds **von Willebrand Factor (vWF)** (synthesized by Weibel-Palade bodies in endothelial cells and alpha-granules in megakaryocytes).
   - Platelets adhere to vWF via surface glycoprotein **GpIb** receptors. (*Deficiency: Bernard-Soulier Syndrome* $\\implies$ giant platelets, thrombocytopenia).
3. **Platelet Activation & Secretion**:
   - Adherent platelets change shape from smooth discs to spiny spheres and release:
     - **ADP** (binds $P2Y_{12}$ receptors on adjacent platelets $\\rightarrow$ activates GpIIb/IIIa receptors; inhibited by Clopidogrel, Ticagrelor, Prasugrel).
     - **Thromboxane $A_2$ ($TXA_2$)** (synthesized by COX-1; potent platelet aggregator and vasoconstrictor; irreversibly inhibited by Aspirin).
     - **Calcium ($Ca^{2+}$)** (essential cofactor for secondary hemostasis).
4. **Platelet Aggregation**:
   - Fibrinogen acts as a symmetrical molecular bridge linking adjacent platelets via activated **GpIIb/IIIa** receptor complexes (*Deficiency: Glanzmann Thrombasthenia* $\\implies$ normal platelet count, impaired aggregation; inhibited therapeutically by Abciximab, Eptifibatide, Tirofiban).
   - Results in a friable **Primary Platelet Plug**.

---

## 2. Secondary Hemostasis: The Coagulation Cascade

Secondary hemostasis stabilizes the weak platelet plug by generating a cross-linked **insoluble fibrin meshwork** via sequential enzymatic cleavage of proenzymes:

$$\\text{Prothrombin (Factor II)} \\xrightarrow{\\text{Prothrombinase Complex (FXa + FVa + } Ca^{2+} \\text{ + Phospholipids)}} \\text{Thrombin (Factor IIa)}$$

$$\\text{Fibrinogen (Factor I)} \\xrightarrow{\\text{Thrombin (Factor IIa)}} \\text{Fibrin Monomer (Factor Ia)} \\xrightarrow{\\text{Factor XIIIa (Transglutaminase)}} \\text{Cross-Linked Fibrin Mesh}$$

### The Three Pathways:
1. **Intrinsic Pathway (Contact Activation)**:
   - Surface contact $\\rightarrow$ Factor XII $\\rightarrow$ Factor XI $\\rightarrow$ Factor IX $\\rightarrow$ Factor IXa + Factor VIIIa complex ("Tenase") $\\rightarrow$ Factor X activation.
   - Monitored by **Activated Partial Thromboplastin Time (aPTT)** (Normal: $25 - 35\\text{ seconds}$).
   - Prolonged by: **Heparin** (enhances Antithrombin III activity), **Hemophilia A** (Factor VIII deficiency, X-linked recessive), **Hemophilia B** (Factor IX deficiency / Christmas Disease), **von Willebrand Disease**.
2. **Extrinsic Pathway (Tissue Factor)**:
   - Subendothelial **Tissue Factor (Thromboplastin / Factor III)** binds circulating **Factor VII** $\\rightarrow$ Factor VIIa-TF complex $\\rightarrow$ Factor X activation.
   - Monitored by **Prothrombin Time (PT)** and **International Normalized Ratio (INR)**:
     $$\\text{INR} = \\left( \\frac{\\text{Patient PT}}{\\text{Control PT}} \\right)^{\\text{ISI}} \\quad (\\text{Normal: } 0.8 - 1.2, \\text{ Therapeutic Warfarin Target: } 2.0 - 3.0)$$
   - Prolonged by: **Warfarin** (inhibits Vitamin K Epoxide Reductase / VKORC1), Liver Failure, Factor VII deficiency.
3. **Common Pathway**:
   - **Factor Xa + Factor Va + Calcium + Platelet Phospholipids** form the Prothrombinase complex $\\rightarrow$ converts Prothrombin (II) to Thrombin (IIa) $\\rightarrow$ converts Fibrinogen (I) to Fibrin (Ia).
   - Vitamin K-Dependent Factors: **II, VII, IX, X, Protein C, and Protein S** (require gamma-carboxylation of glutamate residues to bind negatively charged membrane phospholipids via $Ca^{2+}$ bridges).

---

## 3. Endogenous Anticoagulant Regulators & Fibrinolysis

- **Antithrombin III (AT-III)**: Inactivates Thrombin (IIa), Factor Xa, IXa, XIa, and XIIa. Heparin potentiates AT-III activity by **1000-fold**.
- **Protein C and Protein S Pathway**: Thrombin binds endothelial **Thrombomodulin** $\\rightarrow$ activates Protein C. Activated Protein C (APC) with cofactor Protein S degrades **Factor Va and Factor VIIIa**.
  - *Factor V Leiden Mutation*: Arginine-to-Glutamine mutation (Arg506Gln) rendering Factor Va resistant to APC cleavage $\\implies$ most common hereditary cause of hypercoagulability and recurrent Deep Vein Thrombosis (DVT).
- **Fibrinolysis**: Endothelial **Tissue Plasminogen Activator (tPA)** cleaves Plasminogen into **Plasmin**, which degrades the cross-linked fibrin meshwork into **D-Dimers** (biomarker for DVT, Pulmonary Embolism, and Disseminated Intravascular Coagulation / DIC).

---

## 4. Blood Group Immunology & Hemolytic Disease of the Fetus/Newborn

| Blood Group | RBC Surface Antigens | Serum Isohemagglutinins | Compatible Donor Packed RBCs | Compatible Donor Plasma |
| :--- | :--- | :--- | :--- | :--- |
| **A** | A antigen (N-acetylgalactosamine) | Anti-B (IgM) | A, O | A, AB |
| **B** | B antigen (Galactose) | Anti-A (IgM) | B, O | B, AB |
| **AB** (Universal RBC Recipient) | A and B antigens | None | A, B, AB, O | AB only |
| **O** (Universal RBC Donor) | H antigen only | Anti-A and Anti-B (IgM & IgG) | O only | A, B, AB, O (Universal Plasma Donor) |

### Rh (D) Incompatibility & Erythroblastosis Fetalis:
- **Etiology**: $Rh^-$ (D-negative) mother carrying an $Rh^+$ fetus. During initial delivery/fetomaternal hemorrhage, maternal exposure to Rh(D) antigen triggers maternal sensitization and IgG anti-D production.
- In subsequent $Rh^+$ pregnancies, maternal **IgG anti-D antibodies cross the placenta**, causing immune-mediated fetal RBC hemolysis, severe anemia, extramedullary hematopoiesis, high-output heart failure, and generalized fetal anasarca (**Hydrops Fetalis**).
- **Prevention**: Administer **Anti-D Immune Globulin (RhoGAM)** at 28 weeks gestation and within 72 hours of delivery/miscarriage/invasive prenatal testing to sequester fetal $Rh^+$ RBCs before maternal immune recognition occurs.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old male with a history of recurrent unprovoked deep venous thromboses presents with acute pleuritic chest pain and shortness of breath. CT pulmonary angiography confirms a saddle pulmonary embolism. Coagulation assays reveal a normal prothrombin time (PT), normal partial thromboplastin time (aPTT), but persistent resistance of the patient's plasma to the anticoagulant effects of Activated Protein C.",
      question: "Which of the following molecular mechanisms is responsible for this patient's hypercoagulable state?",
      options: [
        "Point mutation in the Factor V gene (Arg506Gln) rendering Factor Va resistant to proteolytic cleavage by Activated Protein C",
        "Decreased hepatic synthesis of Antithrombin III due to autosomal dominant gene deletion",
        "Autoantibodies targeting the platelet GpIIb/IIIa fibrinogen receptor complex",
        "Excessive cleavage of prothrombin by an overactive tissue factor-Factor VIIa complex"
      ],
      correctAnswerIndex: 0,
      explanation: "Factor V Leiden (Arg506Gln mutation) is the most common inherited thrombophilia. The mutated Factor Va cannot be inactivated by Activated Protein C (APC resistance), leading to uninhibited thrombin generation and recurrent venous thromboembolisms."
    }
  ]
};
