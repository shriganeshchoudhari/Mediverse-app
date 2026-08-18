/**
 * Clinical Oncology & Radiotherapy: Cytotoxic Chemotherapy, Toxicities & Immune Checkpoint Inhibitors
 * Authoritative medical content derived from Goodman & Gilman's Pharmacological Basis of Therapeutics (14th ed.), DeVita's Oncology.
 * Mapped to NMC CBME Competencies: ON3.1, ON3.2, ON4.1, ON4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHEMOTHERAPY_MECHANISMS_PRECISION_THERAPY_MODULE: PhysiologyLessonModule = {
  id: "oncology-chemotherapy-mechanisms-precision-therapy",
  unitCode: "ON3.1",
  title: "Cytotoxic Chemotherapy Classes, Unique Toxicities, Antidotes & Immune Checkpoint Inhibitors",
  competencies: ["ON3.1", "ON3.2", "ON4.1", "ON4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "PHARMACOLOGY",
  markdownContent: `
# Cytotoxic Chemotherapy Classes, Unique Toxicities, Antidotes & Immune Checkpoint Inhibitors

Precision oncology requires mastering the cell-cycle specificity of antineoplastic agents, their dose-limiting organ toxicities, targeted protective antidotes, and immune checkpoint biology.

---

## 1. Cytotoxic Antineoplastic Drug Classes & Cell-Cycle Phase Specificity

- **M-Phase Specific**: Vincristine, Vinblastine (inhibit microtubule assembly); Paclitaxel, Docetaxel (inhibit microtubule disassembly).
- **S-Phase Specific**: Methotrexate (DHFR inhibitor); 5-Fluorouracil (Thymidylate synthase inhibitor); Cytarabine; Gemcitabine; Hydroxyurea.
- **G2-Phase Specific**: Bleomycin (DNA strand breaks via iron-dependent free radicals); Etoposide (Topoisomerase II inhibitor).
- **Cell-Cycle Non-Specific (CCNS)**: Alkylating agents (Cyclophosphamide, Cisplatin, Carboplatin, Busulfan, Nitrosoureas).

---

## 2. High-Yield Dose-Limiting Toxicities & Protective Antidotes

| Drug & Class | Mechanism of Antitumor Action | Dose-Limiting & Signature Organ Toxicity | Specific Protective Antidote / Rescue Agent |
| :--- | :--- | :--- | :--- |
| **Cyclophosphamide / Ifosfamide**<br>*(Alkylating Agent)* | Cross-links DNA at guanine $N-7$ position. | **Hemorrhagic Cystitis**: Caused by the urinary metabolite **Acrolein** irritating the urothelium $\\implies$ gross hematuria, bladder fibrosis, transitional cell carcinoma risk. | **Mesna ($2\\text{-mercaptoethane sulfonate}$)**: Binds and neutralizes acrolein in the urinary bladder $+$ aggressive **IV hydration**. |
| **Doxorubicin / Daunorubicin**<br>*(Anthracycline)* | Intercalates into DNA; generates reactive oxygen species (ROS); inhibits Topoisomerase II. | **Cardiotoxicity**: Acute (arrhythmias, pericarditis) and Chronic Dose-Dependent **Dilated Cardiomyopathy & Congestive Heart Failure** (cumulative lifetime dose $>450 - 550\\text{ mg/m}^2$). | **Dexrazoxane**: Iron-chelating agent that reduces free radical formation in cardiomyocytes. Pre-treatment baseline ECHO/MUGA scan. |
| **Cisplatin**<br>*(Platinum Coordination Complex)* | Forms intrastrand and interstrand cross-links in DNA. | **Nephrotoxicity** (acute tubular necrosis in proximal tubule), **Ototoxicity** (irreversible bilateral high-frequency sensorineural hearing loss), and severe emetogenicity. | **Amifostine** (organic thiophosphate free-radical scavenger in renal parenchyma) $+$ intensive **aggressive pre/post IV normal saline hydration $+$ Mannitol diuresis**. |
| **Methotrexate**<br>*(Antimetabolite / Folate Antagonist)* | Competitive inhibitor of **Dihydrofolate Reductase (DHFR)**, depleting tetrahydrofolate ($FH_4$) and thymidylate synthesis. | **Myelosuppression**, mucositis, hepatic dysfunction, acute renal failure (tubular crystal precipitation). | **Leucovorin (Folinic Acid)**: Bypasses DHFR to rescue normal bone marrow and mucosal cells. **Glucarpidase (Voraxaze)** rapidly degrades methotrexate in severe renal failure. |
| **5-Fluorouracil (5-FU)**<br>*(Pyrimidine Antanalog)* | Metabolized to $FdUMP$, which irreversibly inhibits **Thymidylate Synthase**, blocking $dTMP$ synthesis (thymineless death). | Mucositis, diarrhea, myelosuppression, coronary vasospasm. Toxic accumulation occurs in patients with **Dihydropyrimidine Dehydrogenase (DPD) Deficiency**. | **Uridine Triacetate**: Emergency antidote for 5-FU overdose or early severe toxicity. Note: *Leucovorin is given intentionally WITH 5-FU to POTENTIATE its cytotoxicity!* |
| **Bleomycin**<br>*(Antitumor Antibiotic)* | Complexes with $Fe^{2+}$ to generate free radicals causing DNA single- and double-strand breaks. | **Pulmonary Fibrosis**: Dry cough, dyspnea, basilar crackles, drop in $DLCO$ (cumulative dose $>400\\text{ units}$). | Monitor pulmonary function tests ($PFTs$ with $DLCO$); avoid high inspired oxygen concentrations ($FiO_2$) during anesthesia. |
| **Vincristine**<br>*(Vinca Alkaloid)* | Binds $\\beta\\text{-tubulin}$, blocking microtubule polymerization and arresting mitosis in metaphase. | **Peripheral Neuropathy**: Stocking-glove sensorimotor paresthesia, loss of deep tendon reflexes, **Paralytic Ileus / Constipation**. *Spares bone marrow (minimal myelosuppression)*. | Constipation prophylaxis (stool softeners, laxatives). *FATAL IF ADMINISTERED INTRATHECALLY!* |

---

## 3. Immune Checkpoint Inhibitors (ICIs) & Toxicity Management

- **Mechanism of T-Cell Checkpoint Blockade**:
  - Tumor cells express **PD-L1 / PD-L2**, which binds to **PD-1 receptors** on cytotoxic $CD8^+$ T-cells, inducing T-cell exhaustion and immune evasion.
  - **Anti-PD-1 Antibodies** (*Pembrolizumab, Nivolumab*) and **Anti-PD-L1 Antibodies** (*Atezolizumab, Durvalumab*) block this axis, restoring $CD8^+$ T-cell tumor cell killing.
  - **Anti-CTLA-4 Antibodies** (*Ipilimumab*) block CTLA-4 from binding B7 costimulatory molecules, augmenting early T-cell priming in regional lymph nodes.

### Immune-Related Adverse Events (irAEs) Management:
- Common irAEs: **Autoimmune Thyroiditis** (hypothyroidism), **Colitis** (severe diarrhea), **Pneumonitis** (hypoxemia, ground-glass opacities), **Hepatitis**, **Hypophysitis** (pituitary insufficiency with adrenal crisis), **Myocarditis**.
- **Management Protocol**:
  - Grade 1: Continue ICI with close monitoring.
  - Grade 2: Withhold ICI; start oral Prednisone ($0.5 - 1.0\\text{ mg/kg/day}$).
  - **Grade 3–4 (Severe / Life-Threatening)**: **Permanently discontinue ICI; immediately administer High-Dose IV Methylprednisolone ($1 - 2\\text{ mg/kg/day}$)**; if refractory after 48 hours $\\implies$ add **Infliximab (anti-TNF$\\alpha$)** for severe colitis or **Mycophenolate Mofetil** for hepatitis (avoid infliximab in liver failure).
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old female with diffuse large B-cell lymphoma is receiving her third cycle of R-CHOP chemotherapy (Rituximab, Cyclophosphamide, Doxorubicin, Vincristine, Prednisone). Two days after infusion, she develops gross hematuria, severe suprapubic pain, and dysuria. Urinalysis reveals numerous red blood cells without bacterial organisms. Urine culture is negative.",
      question: "Which of the following chemotherapy agents is responsible for this condition, and what is the specific mechanism of the prophylactic agent that should have been administered to prevent it?",
      options: [
        "Cyclophosphamide; Mesna (2-mercaptoethane sulfonate) binds and neutralizes the toxic urothelial metabolite acrolein in the urinary bladder",
        "Doxorubicin; Dexrazoxane binds free intracellular iron and inhibits free-radical generation",
        "Vincristine; Leucovorin bypasses dihydrofolate reductase to restore folate pools",
        "Rituximab; Amifostine scavenges renal parenchymal reactive oxygen species"
      ],
      correctAnswerIndex: 0,
      explanation: "Cyclophosphamide (and Ifosfamide) is metabolized into Acrolein, a toxic urothelial irritant that causes Acute Hemorrhagic Cystitis (gross hematuria, dysuria, and bladder spasms). The gold-standard prophylactic agent is Mesna (2-mercaptoethane sulfonate), which binds and detoxifies acrolein in the bladder, administered alongside aggressive intravenous hydration."
    }
  ]
};
