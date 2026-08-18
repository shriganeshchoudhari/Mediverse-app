/**
 * Postgraduate Advanced Nuclear Medicine & Theranostics (PG-612)
 * Module 2: Peptide Receptor Radionuclide Therapy (PRRT) with Lu-177 DOTATATE (Lutathera)
 */

import { CurriculumModule } from "../../types";

export const PRRT_DOTATATE_NEUROENDOCRINE_MODULE: CurriculumModule = {
  id: "fa770005-0000-0000-0000-000000000002",
  title: "Peptide Receptor Radionuclide Therapy (PRRT), Lu-177 DOTATATE, SSTR2 Biology & Renal Amino Acid Protection",
  code: "PG12.2",
  subject: "Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology",
  semester: 10,
  description:
    "Authoritative postgraduate curriculum covering somatostatin receptor subtype 2 (SSTR2) targeting in neuroendocrine tumors (NETs), Ga-68 DOTATATE / Cu-64 DOTATATE Krenning scoring, NETTER-1 trial protocols, Lu-177 oxodotreotide (Lutathera) administration, positive amino acid renal radioprotection, and long-term MDS/AML monitoring.",
  estimatedMinutes: 65,
  competencies: [
    "PG12.2.1: Master SSTR2 receptor pharmacology and Ga-68 DOTATATE / Cu-64 DOTATATE PET/CT diagnostic staging using Krenning criteria",
    "PG12.2.2: Implement the NETTER-1 protocol for progressive midgut and pancreatic GEP-NETs with 177Lu-oxodotreotide (7.4 GBq Q8W x 4 cycles)",
    "PG12.2.3: Explain the biophysical mechanism of L-lysine / L-arginine competitive megalin/cubilin inhibition for renal radioprotection",
    "PG12.2.4: Prevent and treat carcinoid crisis during radioisotope infusion and monitor for secondary myeloid neoplasms (t-MDS / t-AML)"
  ],
  sections: [
    {
      id: "sec-prrt-biology",
      title: "1. Somatostatin Receptor (SSTR2) Biology & Theranostic Pairing",
      content: `
### Somatostatin Receptors in Neuroendocrine Tumors

**Neuroendocrine Tumors (NETs)** arise from neuroendocrine cells throughout the body (gastroenteropancreatic system, bronchopulmonary tract, and pheochromocytoma/paraganglioma). 
* **SSTR Subtypes:** Five G-protein coupled receptors ($SSTR_1$ through $SSTR_5$) exist. **$SSTR_2$** is overexpressed in $>80-90\\%$ of well-differentiated gastroenteropancreatic NETs (GEP-NETs: WHO Grade 1 and Grade 2, $Ki-67 \\le 20\\%$).
* **Target Ligands:** Octreotate (DOTATATE) has a **9-fold higher binding affinity** for $SSTR_2$ ($IC_{50} \\approx 0.2-1.5\\text{ nM}$) compared to octreotide (DOTATOC).

---

### Diagnostic SSTR PET/CT Imaging & Krenning Staging

| Radiopharmaceutical | Radionuclide & Half-Life | Standard Injected Dose | Diagnostic Mechanism & Clinical Role |
| :--- | :--- | :--- | :--- |
| **$^{68}\\text{Ga}$-DOTATATE** (Netspot) | $^{68}\\text{Ga}$ ($t_{1/2} = 68\\text{ min}$) | $2\\text{ MBq/kg}$ ($0.054\\text{ mCi/kg}$, up to $5.4\\text{ mCi}$) IV | Replaced $^{111}\\text{In}$-Octreotide (OctreoScan SPECT) with 10x higher spatial resolution and lower radiation dose. |
| **$^{64}\\text{Cu}$-DOTATATE** (Detectnet) | $^{64}\\text{Cu}$ ($t_{1/2} = 12.7\\text{ hours}$) | $148\\text{ MBq}$ ($4.0\\text{ mCi}$) IV bolus | Cyclotron-produced with long half-life allowing flexible scheduling and shelf-life of $>24\\text{ hours}$. |

#### Krenning Visual Grading Scale for SSTR Avidity:
* **Grade 0:** No uptake in tumor.
* **Grade 1:** Tumor uptake $<$ normal liver parenchyma.
* **Grade 2:** Tumor uptake $=$ normal liver parenchyma.
* **Grade 3:** Tumor uptake $>$ normal liver parenchyma.
* **Grade 4:** Tumor uptake $>$ normal spleen or kidney parenchyma (highest avidity).
* **PRRT Eligibility:** Patients must demonstrate **Grade 3 or Grade 4 uptake** on majority of lesions to qualify for $^{177}\\text{Lu}$-DOTATATE therapy.
      `
    },
    {
      id: "sec-netter-trial",
      title: "2. NETTER-1 Trial & Lu-177 DOTATATE (Lutathera) Protocols",
      content: `
### Landmark NETTER-1 Trial & Clinical Indications

The phase III **NETTER-1 trial** evaluated $^{177}\\text{Lu}$-oxodotreotide ($^{177}\\text{Lu}$-DOTATATE / Lutathera) $+$ $30\\text{ mg}$ octreotide LAR vs high-dose octreotide LAR ($60\\text{ mg}$ every 4 weeks) in patients with progressive, inoperable, SSTR-positive metastatic midgut NETs:
* **PFS Rate at 20 Months:** **$65.2\\%$** in the $^{177}\\text{Lu}$-DOTATATE arm vs **$10.8\\%$** in the control arm ($P < 0.0001$; hazard ratio $\\text{HR} = 0.18$, representing an **$82\\%$ reduction in risk of disease progression or death**).
* **Objective Response Rate (ORR):** $18\\%$ vs $3\\%$ ($P < 0.001$).
* **FDA Indications:** SSTR-positive gastroenteropancreatic neuroendocrine tumors (GEP-NETs), including foregut (gastric/duodenal), midgut (ileal/jejunal), and hindgut (rectal/colonic), as well as progressive pancreatic NETs (pNETs).

---

### Standard Lutathera Dosing & Infusion Schedule

* **Dose:** **$7.4\\text{ GBq}$ ($200\\text{ mCi}$) $\\pm 10\\%$** intravenously administered over 30 minutes every **8 weeks** for a total of **4 cycles** (cumulative administered activity $29.6\\text{ GBq}$ / $800\\text{ mCi}$).
* **Concomitant Somatostatin Analogs (SSAs):**
  * Discontinue long-acting SSAs (Octreotide LAR, Lanreotide) for at least **4-6 weeks** prior to each $^{177}\\text{Lu}$ dose (or bridge with short-acting subcutaneous octreotide, stopped 24 hours prior) to prevent competitive receptor saturation.
  * Re-administer Octreotide LAR $30\\text{ mg}$ IM within 4 to 24 hours after completion of each $^{177}\\text{Lu}$-DOTATATE infusion.
      `
    },
    {
      id: "sec-renal-radioprotection",
      title: "3. Renal Radioprotection: Megalin/Cubilin Amino Acid Blockade",
      content: `
### Biophysics of PRRT Nephrotoxicity

* **Glomerular Filtration:** Small radiolabeled peptides ($^{177}\\text{Lu}$-DOTATATE, MW $\\sim 1.5\\text{ kDa}$) are freely filtered through the glomerulus.
* **Tubular Reabsorption:** In the proximal convoluted tubule, the endocytic receptor complex **megalin and cubilin** binds the basic amino acid residues on the radiopeptide, reabsorbing them into tubular epithelial cells.
* **Intracellular Retention:** Intracellular lysosomal degradation traps the radioactive $^{177}\\text{Lu}$ in the renal cortex, generating a high cumulative kidney absorbed dose (critical organ at risk: dose-limiting toxicity is radiation nephropathy and chronic kidney disease).

---

### Positively Charged Amino Acid Infusion Protocol

$$\\text{Co-infusion of basic amino acids } (\\text{L-Lysine } + \\text{L-Arginine}) \\rightarrow \\text{Saturates Megalin/Cubilin Receptors } \\rightarrow \\downarrow \\text{Tubular Reabsorption by } 40-60\\%$$

* **Prescription Solution:** 
  * Commercial mixture containing **$2.5\\%$ L-lysine and $2.5\\%$ L-arginine** in $1000\\text{ mL}$ normal saline (or sterile water).
* **Timing & Delivery:**
  * Initiate the amino acid infusion **30 to 60 minutes prior** to the $^{177}\\text{Lu}$-DOTATATE dose.
  * Continue concurrent infusion during the 30-minute radioisotope administration.
  * Maintain infusion for a total duration of **4 hours** ($250\\text{ mL/hour}$) post-injection.
* **Hyperkalemia & Nausea Risk:** Arginine shifts potassium from intracellular to extracellular compartments; monitor serum $K^+$ in patients with borderline renal reserve. Routine antiemetic pre-medication (Ondansetron $8\\text{ mg}$ $+$ Aprepitant / Fosaprepitant) is mandatory due to amino acid-induced hyperosmolar nausea.
      `
    },
    {
      id: "sec-prrt-toxicities",
      title: "4. Acute Carcinoid Crisis, Cytopenias & Secondary Myeloid Neoplasms",
      content: `
### Acute Carcinoid Crisis Prevention & Management

* **Trigger:** Rapid tumor cell lysis from ionizing radiation causes massive release of vasoactive biogenic amines (serotonin, histamine, bradykinin, kallikrein, prostaglandins).
* **Presentation:** Severe flushing, bronchospasm, profound hemodynamic instability (refractory hypotension or hypertensive crises), tachycardia, and uncontrolled watery diarrhea.
* **Emergency Protocol:**
  * Pre-treatment prophylaxis: Ensure patient is covered with somatostatin analog.
  * Active Crisis Rescue: Immediate intravenous bolus of **Octreotide $100-500\\text{ }\\mu\\text{g}$** in $100\\text{ mL}$ normal saline over 5-10 minutes, followed by continuous IV infusion at $50-100\\text{ }\\mu\\text{g/hour}$. Avoid epinephrine/sympathomimetics if possible (can paradoxically worsen bradykinin release via tumor beta-receptors).

---

### Hematologic Monitoring & Secondary Malignancies (t-MDS / t-AML)

| Hematologic Parameter | Safe Baseline Threshold for Cycle | Action if Threshold Breached |
| :--- | :--- | :--- |
| **Hemoglobin (Hb)** | $\\ge 8.0\\text{ g/dL}$ | Hold cycle; transfuse PRBCs if symptomatic. |
| **Platelet Count** | $\\ge 75,000/\\mu\\text{L}$ ($75 \\times 10^9/\\text{L}$) | Hold cycle until $\\ge 75,000/\\mu\\text{L}$; reduce dose to $3.7\\text{ GBq}$ ($100\\text{ mCi}$) for persistent thrombocytopenia. |
| **Absolute Neutrophil Count (ANC)** | $\\ge 1,000/\\mu\\text{L}$ ($1.0 \\times 10^9/\\text{L}$) | Hold cycle until recovery; check weekly CBC. |

* **Therapy-Related Myeloid Neoplasms (t-MDS / t-AML):**
  * Bone marrow absorbed dose ($\sim 0.05\\text{ Gy/GBq}$) can induce alkylator-like chromosomal translocations (del(5q), del(7q), complex karyotype).
  * Lifetime incidence: **$1.5-2.0\\%$** of PRRT-treated patients, typically presenting $2-5\\text{ years}$ post-therapy with unexplained persistent macrocytic anemia, thrombocytopenia, or circulating myeloblasts. Requires bone marrow biopsy with cytogenetics and NGS.
      `
    }
  ]
};
