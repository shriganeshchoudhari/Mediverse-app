/**
 * Systematic Chest Radiography (CXR ABCDE), Silhouette Sign & Lung Pathology Learning Content
 * Authoritative medical content derived from Felson, Grainger & Allison, Brant & Helms, and USMLE Step 2 CK Radiology.
 * Mapped to NMC CBME Competencies: RD1.1, RD1.2, RD2.1, RD2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHEST_RADIOGRAPHY_ABCDE_MODULE: PhysiologyLessonModule = {
  id: "rad-chest-radiography-abcde",
  unitCode: "RD1.1",
  title: "Radiology: Systematic Chest Radiography (RIPE & ABCDE), Silhouette Sign & Pneumothorax",
  competencies: ["RD1.1", "RD1.2", "RD2.1", "RD2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Radiology: Systematic Chest Radiography (RIPE & ABCDE), Silhouette Sign & Pneumothorax

A rigorous, systematic method prevents cognitive search-satisfaction bias during thoracic radiograph interpretation.

---

## 1. Technical Image Adequacy: The RIPE Checklist

| RIPE Parameter | Technical Standard & Quality Criteria | Diagnostic Pitfall if Inadequate |
| :--- | :--- | :--- |
| **R: Rotation** | Medial heads of the **Clavicles must be equidistant** from the central thoracic vertebral spinous processes. | Patient rotation causes artificial lung density asymmetry and apparent mediastinal widening. |
| **I: Inspiration** | At least **$9-10$ posterior ribs** (or $6$ anterior ribs) visible above the midpoint of the right hemidiaphragm. | Poor inspiration crowds basilar bronchovascular markings, mimicking basilar pneumonia or atelectasis. |
| **P: Position / Projection** | **Posteroanterior (PA) View** is the gold standard (film against anterior chest, X-ray beam from back to front, standard $6\\text{ ft} / 1.8\\text{ m}$ distance). | **Anteroposterior (AP) Portable View**: Heart is situated farther from film $\\implies$ **Cardiac silhouette magnified by $> 15\\%$** (cannot reliably diagnose cardiomegaly); clavicles are elevated. |
| **E: Exposure / Penetration** | Thoracic intervertebral disc spaces faintly visible through the cardiac silhouette; lower left hemidiaphragm visible behind heart. | • **Under-penetrated (too white)**: Obscures retrocardiac left lower lobe pathology.<br>• **Over-penetrated (too black)**: Burns out subtle lung nodules and fine interstitial markings. |

---

## 2. Systematic ABCDE Anatomical Review

- **A: Airway**:
  - Trachea position: Midline or shifted.
  - **Tracheal Deviation AWAY from Diseased Hemithorax**: Tension Pneumothorax, Massive Pleural Effusion, Large Thoracic Mass.
  - **Tracheal Deviation TOWARDS Diseased Hemithorax**: Lobar Atelectasis / Collapse, Lung Agenesis, Post-Pneumonectomy, Chronic Fibrosis.
  - Subcarinal angle: Normal $< 90^\\circ$ (splayed $> 90^\\circ$ in Left Atrial Enlargement or subcarinal lymphadenopathy).
- **B: Breathing & Lung Parenchyma**:
  - **The Silhouette Sign**: Loss of normal radiographic contour between two adjacent anatomical structures of identical water/soft-tissue density in direct contact.
    - **Right Middle Lobe (RML) Consolidation**: Obscures the **Right Heart Border** (Right hemidiaphragm remains sharply outlined).
    - **Left Lingular Consolidation**: Obscures the **Left Heart Border**.
    - **Right Lower Lobe (RLL) Consolidation**: Obscures the **Right Hemidiaphragm** (Right heart border remains sharply visible).
    - **Left Lower Lobe (LLL) Consolidation**: Obscures the **Left Hemidiaphragm / Retrocardiac space**.
  - **Air Bronchogram Sign**: Branching, tubular, lucent patent bronchial tree surrounded by opaque, fluid-filled consolidated alveoli (diagnostic of alveolar consolidation e.g. bacterial pneumonia, pulmonary edema).
  - **Deep Sulcus Sign**: Abnormally deep, lucent costophrenic angle on a supine radiograph; diagnostic of **Pneumothorax** in trauma/ICU patients.
  - **Kerley B Lines**: Short, horizontal, parallel linear opacities ($1-2\\text{ cm}$) at the lung periphery / lateral costophrenic angles representing fluid engorgement of interlobular septa in **Congestive Heart Failure / Cardiogenic Pulmonary Edema**.
- **C: Circulation (Cardiac Silhouette & Mediastinum)**:
  - **Cardiothoracic Ratio (CTR)**: $\\text{CTR} = \\text{Maximum Transverse Cardiac Diameter} / \\text{Maximum Thoracic Diameter}$.
  - **CTR $> 0.5$ ($> 50\\%$) on erect PA film indicates Cardiomegaly**.
  - **Water-Bottle Silhouette**: Globular, symmetric flask-like cardiac enlargement in massive Pericardial Effusion.
- **D: Diaphragm & Costophrenic Angles**:
  - Sharp, acute costophrenic angles. **Meniscus Blunting Sign**: Indicates **Pleural Effusion** ($> 175-200\\text{ mL}$ required for blunting on erect PA film; $> 50\\text{ mL}$ on lateral film; $> 5\\text{ mL}$ on lateral decubitus film).
  - **Pneumoperitoneum**: Crescentic lucency of free subdiaphragmatic gas under the right hemidiaphragm on erect film (**Rigler\'s Sign / Double Wall Sign**).
- **E: Everything Else (Extrathoracic Structures & Medical Devices)**:
  - Bone fractures (rib flail segments, clavicle), subcutaneous surgical emphysema.
  - Endotracheal (ET) Tube: Tip should be **$3-5\\text{ cm}$ above the carina** (mid-trachea).
  - Central Venous Catheter (CVC): Tip at the **Cavoatrial Junction** (lower 1/3 of SVC).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old female presents with fever, productive cough with rusty sputum, and right-sided pleuritic chest pain for 3 days. A standard erect PA chest radiograph is obtained. The image shows normal penetration with 10 posterior ribs visible. Examination of the lung fields reveals an opaque triangular density in the right mid-lung zone that completely effaces the right heart border, while the right hemidiaphragm contour remains sharply delineated. Air-filled branching tubular structures are visible within the opacity.",
      question: "What is the diagnosis, which lung lobe is involved, and what classic radiological signs are demonstrated?",
      options: [
        "Right Middle Lobe (RML) Pneumonia; Silhouette Sign of the right heart border + Air Bronchogram Sign",
        "Right Lower Lobe (RLL) Pneumonia; Silhouette Sign of the right hemidiaphragm",
        "Right Pleural Effusion; Meniscus Sign",
        "Right Tension Pneumothorax; Deep Sulcus Sign"
      ],
      correctAnswerIndex: 0,
      explanation: "Loss of the right heart border contour (positive Silhouette Sign) on a PA chest radiograph indicates an opacity in the Right Middle Lobe (RML) because the medial segment of the RML is in direct anatomical contact with the right atrium. The preservation of the right hemidiaphragm confirms that the lower lobe is uninvolved. The branching tubular lucencies represent the Air Bronchogram Sign, confirming alveolar airspace consolidation (pneumonia)."
    }
  ]
};
