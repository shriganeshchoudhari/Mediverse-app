/**
 * Transfusion Medicine: Blood Component Therapy, Storage Lesions & Massive Transfusion Protocol (MTP)
 * Authoritative medical content derived from AABB Technical Manual (20th ed.), ACS Trauma Guidelines, and ATLS (10th ed.).
 * Mapped to NMC CBME Competencies: TR3.1, TR3.2, TR4.1, TR4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BLOOD_COMPONENTS_MASSIVE_TRANSFUSION_MODULE: PhysiologyLessonModule = {
  id: "transfusion-blood-components-massive-transfusion",
  unitCode: "TR3.1",
  title: "Blood Component Therapy (PRBC, Platelets, FFP, Cryoprecipitate), Storage Lesions & Balanced MTP (1:1:1)",
  competencies: ["TR3.1", "TR3.2", "TR4.1", "TR4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Blood Component Therapy, Storage Lesions & Balanced Massive Transfusion Protocol

Modern transfusion practice relies on targeted blood component separation to optimize efficacy, conserve donor resources, and prevent dilutional coagulopathy in massive hemorrhage.

---

## 1. Blood Components: Storage Parameters, Content & Clinical Indications

| Blood Component | Storage Temperature & Shelf-Life | Specific Content & Expected Increment | Standard Clinical Indications & Thresholds |
| :--- | :--- | :--- | :--- |
| **Packed Red Blood Cells (PRBCs)** | **$2 - 6^\\circ\\text{C}$** in CPDA-1 ($35\\text{ days}$) or SAGM ($42\\text{ days}$). | Volume: $250 - 300\\text{ mL}$. **$1\\text{ unit} \\implies \\uparrow\\text{Hb by } 1.0\\text{ g/dL}$** (or $\\uparrow\\text{Hct by } 3\\%$) in an average $70\\text{ kg}$ adult. | Symptomatic anemia, acute blood loss, or restrictive threshold **$\\text{Hb} < 7.0\\text{ g/dL}$** ($<8.0\\text{ g/dL}$ in acute coronary syndrome or orthopedic surgery). |
| **Platelet Concentrates (Random vs Apheresis)** | **$20 - 24^\\circ\\text{C}$ with continuous gentle agitation** ($5\\text{ days}$). *Highest risk of bacterial contamination!* | • **Random Donor**: $+5,000 - 10,000/\\mu\\text{L}$ per unit.<br>• **Single Donor Apheresis (SDP)**: Volume $\\sim 300\\text{ mL}$; **$\\mathbf{+30,000 - 50,000/\\mu\\text{L}}$** (equivalent to $6\\text{ random units}$). | Prophylaxis in non-bleeding: **$<10,000/\\mu\\text{L}$**.<br>Central line / minor surgery: **$<20,000 - 50,000/\\mu\\text{L}$**.<br>Major surgery / trauma / active bleed: **$<50,000/\\mu\\text{L}$**.<br>Neurosurgery / ocular surgery: **$<100,000/\\mu\\text{L}$**. |
| **Fresh Frozen Plasma (FFP)** | **$\\le -18^\\circ\\text{C}$ ($1\\text{ year}$)** or $-65^\\circ\\text{C}$ ($7\\text{ years}$). Must be transfused within $24\\text{ hours}$ of thawing at $30 - 37^\\circ\\text{C}$. | Volume: $200 - 250\\text{ mL}$. Contains **ALL coagulation factors** (including labile Factors V and VIII) and fibrinogen. | Coagulopathy with active bleeding or pre-procedure (**$\\text{INR} > 1.5 - 2.0$**), immediate warfarin reversal (when PCC unavailable), Massive Transfusion Protocol. Dosing: **$10 - 15\\text{ mL/kg}$**. |
| **Cryoprecipitate (Cryo)** | **$\\le -18^\\circ\\text{C}$ ($1\\text{ year}$)**. Insoluble precipitate formed upon slow thawing of FFP at $1 - 6^\\circ\\text{C}$. | Volume: $10 - 15\\text{ mL/unit}$. Enriched in **Fibrinogen ($\\ge 150\\text{ mg}$)**, **Factor VIII ($\\ge 80\\text{ IU}$)**, **von Willebrand Factor (vWF)**, and **Factor XIII**. | **Hypofibrinogenemia (Fibrinogen $<150 - 200\\text{ mg/dL}$)** in trauma, DIC, or massive hemorrhage; Dysfibrinogenemia; Factor XIII deficiency. 1 pool ($10\\text{ units}$) raises fibrinogen by $\\sim 50 - 70\\text{ mg/dL}$. |

---

## 2. Red Blood Cell Storage Lesions

During hypothermic storage ($2 - 6^\\circ\\text{C}$), progressive biochemical alterations occur:
1. **Depletion of $2,3\\text{-Diphosphoglycerate (2,3-DPG)}$**: Causes a **leftward shift of the oxygen-hemoglobin dissociation curve** (increased $O_2$ affinity $\\implies$ impaired oxygen unloading to peripheral tissues for the first $4 - 24\\text{ hours}$ post-transfusion).
2. **Depletion of ATP**: Causes loss of membrane deformability, spherocyte transformation, and microvascular sludging.
3. **Acidosis & Potassium Leakage**: Extracellular $pH$ drops to $<6.5$; extracellular potassium rises to **$>30 - 50\\text{ mEq/L}$** at day 35 (risk of transfusion-induced hyperkalemia in neonates and rapid massive transfusions).

---

## 3. The Massive Transfusion Protocol (MTP)

- **Definition of Massive Transfusion**:
  - Replacement of $\\ge 10\\text{ units of PRBCs}$ within $24\\text{ hours}$, or $\\ge 4\\text{ units}$ in $1\\text{ hour}$, or replacement of $>50\\%$ of total blood volume in $3\\text{ hours}$.
- **Damage Control Resuscitation Principles**:
  - **Balanced Ratio (1:1:1)**: **$1\\text{ unit PRBC} : 1\\text{ unit FFP} : 1\\text{ unit Platelets}$** (mimics reconstituted whole blood, preventing dilutional coagulopathy and thrombocytopenia).
  - **Tranexamic Acid (TXA)**: Administer **$1\\text{ g IV bolus over } 10\\text{ min}$ within $3\\text{ hours}$ of trauma**, followed by $1\\text{ g infusion over } 8\\text{ hours}$ (CRASH-2 trial: significantly reduces mortality).
  - **Complication Surveillance**:
    1. **Hypocalcemia**: Citrate in blood preservative chelates ionized calcium ($Ca^{2+}$) $\\implies$ myocardial depression, prolonged QTc $\\implies$ Infuse **$10\\text{ mL } 10\\%$ Calcium Gluconate** after every $4\\text{ units of blood}$.
    2. **Hypothermia**: Use rapid blood warmers.
    3. **Hyperkalemia & Acidosis**: Monitor arterial blood gases and potassium frequently.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male is brought to the trauma bay in hemorrhagic shock following a high-speed motorcycle collision. His blood pressure is 75/40 mmHg, pulse 135 bpm, and he has ongoing pelvic hemorrhage. The trauma team initiates the Massive Transfusion Protocol. After the rapid infusion of 6 units of PRBCs, 6 units of FFP, and 1 pool of platelets, his telemetry reveals a prolonged QTc interval (540 ms) and widening QRS complexes. Serum ionized calcium is 0.72 mmol/L (normal 1.15–1.35 mmol/L).",
      question: "Which of the following is the underlying biochemical cause of this acute electrolyte abnormality, and what is the immediate treatment?",
      options: [
        "Citrate toxicity from blood preservative chelating ionized calcium; Administer intravenous Calcium Gluconate",
        "Potassium leakage from stored red cells; Administer intravenous regular insulin and dextrose",
        "Hypothermia-induced calcium shifts; Administer warm saline boluses",
        "Dilutional thrombocytopenia; Administer additional cryoprecipitate pools"
      ],
      correctAnswerIndex: 0,
      explanation: "Massive transfusion of citrated blood components (especially FFP and PRBCs) delivers large quantities of sodium citrate preservative that overwhelm hepatic metabolic clearance, especially during hypoperfusion and hypothermia. Citrate binds free ionized calcium (Ca2+), causing acute Hypocalcemia, which manifests with QTc prolongation, cardiac dysfunction, hypotension, and tetany. The immediate treatment is the intravenous administration of 10% Calcium Gluconate (or Calcium Chloride)."
    }
  ]
};
