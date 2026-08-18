/**
 * Hemodynamics, Thrombosis & Embolism Learning Content
 * Authoritative medical content derived from Robbins & Cotran, Rubin's, Pathoma, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PA6.1, PA6.2, PA6.3, PA7.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HEMODYNAMICS_THROMBOSIS_MODULE: PhysiologyLessonModule = {
  id: "path-hemodynamics",
  unitCode: "PA6.1",
  title: "Hemodynamics, Virchow Triad, Thrombosis, Embolism & Infarction",
  competencies: ["PA6.1", "PA6.2", "PA6.3", "PA7.1"],
  estimatedMinutes: 115,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Hemodynamics, Virchow Triad, Thrombosis, Embolism & Infarction

Hemodynamic stability requires a delicate balance between fluid extravasation (Starling forces), vascular integrity, platelet activation, coagulation cascade homeostasis, and fibrinolysis.

---

## 1. Virchow Triad & Pathogenesis of Thrombosis

Thrombus formation in the intact cardiovascular system requires one or more elements of **Virchow\'s Triad**:

1. **Endothelial Injury (Most Dominant)**:
   - Exposure of subendothelial **von Willebrand Factor (vWF)** and tissue factor ($TF$). Causes: atherosclerosis, hypertension, vasculitis, bacterial endotoxins, cigarette smoking.
2. **Alterations in Normal Blood Flow**:
   - **Stasis**: Allows platelets and coagulation factors to contact endothelium without washout; promotes venous thrombi in immobilized patients / AFib left atrial appendage.
   - **Turbulence**: Disrupts laminar flow and injures endothelium; promotes arterial thrombosis over atherosclerotic plaques and aneurysms.
3. **Hypercoagulability (Thrombophilia)**:
   - **Inherited (Primary)**:
     - **Factor V Leiden ($G1691A$ mutation)**: Resistance of Factor Va to cleavage by Activated Protein C (most common inherited thrombophilia in Caucasians).
     - **Prothrombin $G20210A$ mutation**: Point mutation in 3\'-untranslated region $\\implies \\uparrow$ prothrombin mRNA $\\implies$ elevated prothrombin levels.
     - **Antithrombin III Deficiency**: Diminished baseline response to unfractionated heparin (normal PTT rise fails to occur upon standard heparin dosing).
     - **Protein C or S Deficiency**: Inability to inactivate Factors Va and VIIIa; initiation of warfarin causes transient prothrombotic state $\\implies$ **Warfarin Skin Necrosis**.
   - **Acquired (Secondary)**: Prolonged bed rest, surgery, oral contraceptives / pregnancy ($\\uparrow$ hepatic clotting factors), malignancy (Trousseau syndrome / migratory thrombophlebitis), Antiphospholipid syndrome (Lupus anticoagulant / anticardiolipin).

---

## 2. Thrombus Morphology & Lines of Zahn

| Characteristic | Arterial Thrombi | Venous Thrombi (Phlebothrombosis) |
| :--- | :--- | :--- |
| **Primary Driver** | Endothelial injury, plaque rupture, high shear stress | Stasis and hypercoagulability (low shear) |
| **Typical Location** | Coronary, cerebral, femoral, mesenteric arteries | Deep veins of lower extremity (Femoral, Popliteal, Iliac veins) |
| **Direction of Growth** | Retrograde (grows backwards toward the heart) | Anterograde (grows forward in direction of venous flow toward heart) |
| **Microscopic Structure** | **Lines of Zahn**: Distinct alternating pale layers of platelets/fibrin and dark layers of red blood cells. *Confirms thrombus formed in living circulation (pre-mortem)* vs post-mortem "currant jelly / chicken fat" clot. | Red, fibrin-rich, trapped erythrocyte stasis coagulum with poorly formed Lines of Zahn. |

---

## 3. Embolism Classifications & Syndromes

An embolus is a detached intravascular solid, liquid, or gaseous mass carried by the blood to a site distant from its origin:

- **Pulmonary Thromboembolism (PE)**:
  - $>95\\%$ arise from proximal **Deep Vein Thrombosis (DVT)** above the knee (Iliac, Femoral, Popliteal veins).
  - **Saddle Embolus**: Lodges at the bifurcation of the main pulmonary artery $\\implies$ acute right ventricular failure (cor pulmonale), electromechanical dissociation, sudden death.
- **Fat Embolism Syndrome**:
  - Occurs 24–72 hours following **long bone fractures (femur, tibia)** or orthopedic surgery.
  - **Classic Clinical Triad**:
    1. **Neurological impairment** (confusion, restlessness, coma)
    2. **Hypoxemia / Dyspnea** (ARDS-like acute lung injury)
    3. **Petechial Rash** (conjunctival, axillary, and neck petechiae due to thrombocytopenia and microvascular occlusion)
- **Air Embolism**:
  - Gas bubbles $>100\\text{ mL}$ obstruct vascular flow (e.g., neurosurgery in sitting position, central venous line placement, obstetric trauma).
  - **Decompression Sickness ("The Bends")**: Rapid ascent in scuba divers causes dissolved nitrogen to precipitate as bubbles $\\implies$ severe periarticular pain (bends), lung edema (chokes), and osteonecrosis (Caisson disease).
- **Amniotic Fluid Embolism**:
  - Entry of amniotic fluid containing fetal squamous cells (lanugo, vernix) into maternal uterine circulation during labor.
  - Triggers acute severe anaphylactoid reaction, cardiogenic shock, respiratory failure, and **Disseminated Intravascular Coagulation (DIC)** with high maternal mortality ($>20-40\\%$).

---

## 4. Red (Hemorrhagic) vs White (Pale) Infarctions

| Infarct Type | Pathological Mechanism & Tissue Architecture | Classic Organ Locations |
| :--- | :--- | :--- |
| **Red (Hemorrhagic) Infarct** | Occurs in tissues with **dual blood supplies**, loose sponge-like parenchyma that allows blood to pool into necrotic zones, or when blood flow is re-established (reperfusion) | • **Lungs** (Pulmonary & Bronchial arteries)<br>• **Liver** (Hepatic artery & Portal vein)<br>• **Small & Large Intestine** (extensive mesenteric collaterals)<br>• **Testis & Ovary** (venous torsion)<br>• **Reperfused Myocardium / Brain** |
| **White (Pale / Anemic) Infarct** | Occurs in **solid organs with end-arterial circulation** where tissue density limits seepage of red cells from adjacent capillary beds | • **Heart** (Coronary end-arteries)<br>• **Spleen** (Splenic artery)<br>• **Kidney** (Renal segmental end-arteries) |
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male sustains a closed comminuted fracture of the right femoral shaft in a high-speed motor vehicle collision. Forty-eight hours after internal fixation, he becomes acutely tachypneic, confused, and agitated. Oxygen saturation drops to 84% on room air. Physical examination reveals a petechial rash distributed across the anterior chest, axillae, and conjunctivae. Chest radiograph demonstrates diffuse bilateral patchy alveolar infiltrates.",
      question: "Which of the following is the most likely diagnosis?",
      options: [
        "Fat Embolism Syndrome",
        "Pulmonary Thromboembolism from DVT",
        "Amniotic Fluid Embolism",
        "Air Embolism"
      ],
      correctAnswerIndex: 0,
      explanation: "Fat Embolism Syndrome classically occurs 24 to 72 hours after long bone fractures (e.g., femur). Bone marrow fat globules enter ruptured venous sinusoids, causing the pathognomonic clinical triad of Acute Respiratory Distress (hypoxemia), Neurological Alterations (confusion, coma), and a Petechial Skin Rash across the neck, axillae, and conjunctivae."
    }
  ]
};
