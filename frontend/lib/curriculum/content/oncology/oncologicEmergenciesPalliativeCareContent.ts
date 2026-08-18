/**
 * Clinical Oncology & Radiotherapy: Oncologic Emergencies & Palliative Symptom Management
 * Authoritative medical content derived from DeVita's Oncology, ESMO/ASCO Guidelines, and WHO Palliative Care Standards.
 * Mapped to NMC CBME Competencies: ON7.1, ON7.2, ON8.1, ON8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ONCOLOGIC_EMERGENCIES_PALLIATIVE_CARE_MODULE: PhysiologyLessonModule = {
  id: "oncology-oncologic-emergencies-palliative-care",
  unitCode: "ON7.1",
  title: "Oncologic Emergencies (SVC Syndrome, Spinal Cord Compression, Tumor Lysis) & Palliative Analgesia (WHO Pain Ladder)",
  competencies: ["ON7.1", "ON7.2", "ON8.1", "ON8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Oncologic Emergencies & Palliative Symptom Management

Prompt recognition and aggressive medical or interventional management of acute oncologic emergencies prevents catastrophic permanent neurological disability, renal failure, and mortality.

---

## 1. Acute Oncologic Emergencies & Emergency Management Protocols

| Oncologic Emergency | Pathophysiology & Primary Causes | Clinical Presentation & Physical Exam Hallmarks | Emergency Diagnostic & Treatment Protocol |
| :--- | :--- | :--- | :--- |
| **Superior Vena Cava (SVC) Syndrome** | Extrinsic compression or intravascular thrombosis of the thin-walled SVC. Most common: **Small Cell Lung Cancer ($75\\%$)**, Non-Hodgkin Lymphoma, thymoma, central venous catheter thrombosis. | Facial and periorbital edema, plethora, distended collateral veins on neck and anterior chest wall (**Pemberton\'s Sign**: raising arms above head causes facial cyanosis and stridor), dyspnea, hoarseness. | 1. Elevate head of bed ($90^\\circ$), supplemental $O_2$, loop diuretics.<br>2. Contrast-enhanced Chest CT.<br>3. **Endovascular SVC Stenting** (immediate relief within hours) OR **Emergent Chemotherapy / Palliative Radiotherapy**. |
| **Malignant Spinal Cord Compression (MSCC)** | Direct epidural metastasis compressing the thecal sac. Most common: **Breast, Lung, Prostate, Renal, Myeloma**. Predilection: Thoracic spine ($70\\%$). | Progressive band-like localized and radicular back pain (worse lying flat, worse with cough/valsalva) $\\rightarrow$ Lower extremity motor weakness $\\rightarrow$ Sensory level $\\rightarrow$ **Late loss of bowel/bladder sphincter function (saddle anesthesia)**. | 1. **Immediate IV Dexamethasone ($16\\text{ mg}$ bolus $\\rightarrow 4\\text{ mg}$ q6h)** to reduce vasogenic epidural edema.<br>2. **Emergent Whole-Spine MRI within 24 hours**.<br>3. **Urgent Decompressive Surgical Laminectomy $+$ Stabilization** (Patchell protocol: superior for solitary operable site with $>3\\text{ mo}$ prognosis) OR **Emergent Radiotherapy ($30\\text{ Gy}$ in 10 fractions)**. |
| **Tumor Lysis Syndrome (TLS)** | Massive, rapid release of intracellular ions and nucleic acids into the circulation following initiation of cytotoxic chemotherapy in high-burden, rapidly proliferating hematologic malignancies (**Burkitt Lymphoma, ALL, AML**). | **Cairo-Bishop Laboratory Criteria** ($\\ge 2$ within 3–7 days of chemo):<br>1. **Hyperkalemia** ($K^+ \\ge 6.0\\text{ mEq/L}$) $\\implies$ Fatal arrhythmias, peaked T waves.<br>2. **Hyperphosphatemia** ($PO_4^{3-} \\ge 4.5\\text{ mg/dL}$).<br>3. **Hypocalcemia** ($Ca^{2+} \\le 7.0\\text{ mg/dL}$) $\\implies$ Tetany, prolonged QTc.<br>4. **Hyperuricemia** (Uric acid $\\ge 8.0\\text{ mg/dL}$) $\\implies$ Acute urate nephropathy. | 1. **Aggressive IV Hydration** ($2.5 - 3.0\\text{ L/m}^2/\\text{day}$) to maintain urine output $>100\\text{ mL/m}^2/\\text{hour}$.<br>2. **Rasburicase (Recombinant Urate Oxidase, $0.2\\text{ mg/kg}$ IV)**: Rapidly degrades uric acid into water-soluble Allantoin (*Contraindicated in G6PD deficiency due to methemoglobinemia/hemolysis*).<br>3. **Allopurinol (Xanthine Oxidase Inhibitor)**: Prophylaxis (prevents NEW uric acid formation; does not degrade existing uric acid).<br>4. Emergency hemodialysis for refractory hyperkalemia or anuria. |
| **Hypercalcemia of Malignancy (HCM)** | 1. **Humoral Hypercalcemia ($80\\%$)**: Secretion of **PTHrP** by Squamous Cell Carcinomas (lung, head/neck), renal cell, bladder.<br>2. **Osteolytic Metastases ($20\\%$)**: Breast, myeloma. | "Stones, Bones, Abdominal Groans, Psych Overtones": Constipation, polyuria, polydipsia, shortened QTc, confusion, coma. | 1. **Aggressive IV Normal Saline ($200 - 500\\text{ mL/hour}$)** to restore intravascular volume.<br>2. **IV Bisphosphonates (Zoledronic Acid $4\\text{ mg}$ IV over 15 min)** or **Denosumab (anti-RANKL monoclonal antibody)** (preferred in severe renal failure).<br>3. **Calcitonin ($4 - 8\\text{ IU/kg}$ IM/SC q12h)** for rapid onset reduction in the first 48 hours (tachyphylaxis occurs). |

---

## 2. Palliative Cancer Pain Management: The WHO 3-Step Analgesic Ladder

- **Step 1 (Mild Pain, Score 1–3)**:
  - Non-opioids: **Acetaminophen (Paracetamol)** $\\pm$ **NSAIDs (Ibuprofen, Naproxen, Celecoxib)** $\\pm$ Adjuvants (Gabapentin/Pregabalin for neuropathic pain).
- **Step 2 (Moderate Pain, Score 4–6)**:
  - Weak Opioids: **Codeine, Tramadol, Dihydrocodeine** $+$ Non-opioids $\\pm$ Adjuvants.
- **Step 3 (Severe Pain, Score 7–10)**:
  - Strong Opioids: **Morphine (First-Line), Oxycodone, Hydromorphone, Fentanyl, Methadone** $+$ Non-opioids $\\pm$ Adjuvants.
- **Opioid Principles**:
  - *By the Clock*: Administer long-acting around-the-clock analgesia with short-acting PRN breakthrough doses ($10 - 15\\%$ of total $24\\text{-hour}$ dose).
  - *Prophylaxis*: Mandatory co-prescription of **stimulant laxatives (Senna $+$ Docusate)** to prevent opioid-induced constipation (tolerance to constipation never develops!).
`,
  clinicalVignettes: [
    {
      scenario: "A 16-year-old male with newly diagnosed T-cell Acute Lymphoblastic Leukemia and massive mediastinal lymphadenopathy begins induction chemotherapy. Twelve hours post-infusion, his telemetry alarm sounds, and ECG demonstrates peaked T waves and PR prolongation. Urgent stat labs reveal: Potassium 6.8 mEq/L, Phosphate 7.2 mg/dL, Calcium 6.1 mg/dL, Uric Acid 14.5 mg/dL, Creatinine 2.8 mg/dL (baseline 0.9 mg/dL).",
      question: "Which of the following is the diagnosis, and what is the definitive enzymatic drug of choice to rapidly degrade the circulating uric acid?",
      options: [
        "Tumor Lysis Syndrome; Rasburicase (Recombinant Urate Oxidase)",
        "Tumor Lysis Syndrome; Allopurinol (Xanthine Oxidase Inhibitor)",
        "Hypercalcemia of Malignancy; Intravenous Zoledronic Acid",
        "Acute Adrenal Crisis; High-dose Hydrocortisone"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits full laboratory and clinical Tumor Lysis Syndrome (Cairo-Bishop criteria: Hyperkalemia, Hyperphosphatemia, Hypocalcemia, Hyperuricemia with acute kidney injury following induction chemotherapy). While Allopurinol only prevents NEW uric acid formation by inhibiting xanthine oxidase, Rasburicase (recombinant urate oxidase) enzymatically converts existing circulating, insoluble uric acid into highly water-soluble Allantoin, rapidly clearing uric acid and protecting the renal tubules from obstructive urate crystal nephropathy."
    }
  ]
};
