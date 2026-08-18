/**
 * Postgraduate Advanced Nuclear Medicine & Theranostics (PG-612)
 * Module 1: Theranostics Paradigm, PSMA-Targeted Radioligand Therapy & Lu-177 Vipivotide Tetraxetan
 */

import { CurriculumModule } from "../../types";

export const PSMA_RADIOLIGAND_THERAPY_PLUVICTO_MODULE: CurriculumModule = {
  id: "fa770005-0000-0000-0000-000000000001",
  title: "Theranostics Paradigm, PSMA PET Staging, Lu-177 Vipivotide Tetraxetan & Alpha-Radioligand Protocols",
  code: "PG12.1",
  subject: "Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology",
  semester: 10,
  description:
    "Comprehensive postgraduate coverage of the oncology theranostics paradigm, pairing Ga-68/F-18 PSMA PET/CT with Lu-177 vipivotide tetraxetan (Pluvicto) beta-radioligand therapy for metastatic castration-resistant prostate cancer (mCRPC), VISION trial criteria, renal dosimetry, and emerging Ac-225 targeted alpha therapy.",
  estimatedMinutes: 65,
  competencies: [
    "PG12.1.1: Master the molecular theranostic paradigm pairing diagnostic 68Ga-PSMA-11 / 18F-DCFPyL PET with 177Lu-vipivotide tetraxetan",
    "PG12.1.2: Evaluate VISION trial eligibility criteria, PSMA-avidity thresholds (SUVmax > liver), and discordant FDG-positive/PSMA-negative tumor biology",
    "PG12.1.3: Detail 177Lu physical properties (beta emission, Emax 0.498 MeV, t1/2 6.65 days), administration protocols (7.4 GBq Q6W x 6 cycles), and salivary gland cooling",
    "PG12.1.4: Manage hematologic (Grade 3/4 cytopenias), renal, and xerostomia toxicities, and contrast targeted beta with 225Ac high-LET alpha-emitter radiobiology"
  ],
  sections: [
    {
      id: "sec-psma-intro",
      title: "1. The Theranostics Molecular Paradigm & PSMA Biology",
      content: `
### Theranostics: "See What You Treat, Treat What You See"

**Theranostics** (Therapeutics + Diagnostics) represents a paradigm shift in precision oncology where the identical or near-identical molecular vector (ligand, peptide, or monoclonal antibody) is utilized sequentially:
1. **Diagnostic Stage:** Radiolabeled with a positron emitter (e.g., $^{68}\\text{Ga}$, $^{18}\\text{F}$) or gamma emitter ($^{99\\text{m}}\\text{Tc}$) to perform high-resolution whole-body PET/CT or SPECT/CT, non-invasively mapping target antigen receptor density across all metastatic sites.
2. **Therapeutic Stage:** Radiolabeled with a particulate-emitting radionuclide (beta-minus $\\beta^-$ emitter like $^{177}\\text{Lu}$, or alpha $\\alpha$ emitter like $^{225}\\text{Ac}$) to deliver targeted, lethal ionizing radiation directly to tumor cells with sub-millimeter precision, sparing adjacent normal tissues.

---

### Prostate-Specific Membrane Antigen (PSMA) Target

* **Molecular Structure:** PSMA is a 750-amino acid, 100-kDa transmembrane glycoprotein with glutamate carboxypeptidase II enzymatic activity (encoded by the *FOLH1* gene).
* **Pathological Expression:** PSMA expression is upregulated **100- to 1,000-fold** in $>85-90\\%$ of prostate adenocarcinomas, with expression levels progressively increasing as tumors transition from hormone-sensitive to aggressive, metastatic castration-resistant prostate cancer (mCRPC).
* **Internalization Dynamics:** Binding of small-molecule urea-based PSMA ligands triggers receptor-mediated endocytosis into clathrin-coated pits, concentrating the therapeutic radioisotope intracellularly adjacent to the cell nucleus.

---

### Diagnostic PSMA PET/CT Radiotracers

| Radiotracer | Radioisotope & Half-Life ($t_{1/2}$) | Standard Dose & Administration | Normal Physiological Uptake | High-Yield Clinical Pearl |
| :--- | :--- | :--- | :--- | :--- |
| **$^{68}\\text{Ga}$-PSMA-11** (Gozetotide) | $^{68}\\text{Ga}$ ($t_{1/2} = 68\\text{ min}$), Generator-produced | $1.8-2.2\\text{ MBq/kg}$ ($3-7\\text{ mCi}$) IV; scan at $50-100\\text{ min}$ | Lacrimal/salivary glands, kidneys, ureters/bladder, liver, spleen, small bowel | Intense urinary bladder excretion can obscure local prostate bed recurrence. |
| **$^{18}\\text{F}$-DCFPyL** (Pylarify) | $^{18}\\text{F}$ ($t_{1/2} = 110\\text{ min}$), Cyclotron-produced | $333-370\\text{ MBq}$ ($9-10\\text{ mCi}$) IV; scan at $60\\text{ min}$ | Lacrimal/salivary glands, kidneys, bladder, liver, spleen, duodenum | Higher positron yield, lower positron energy (sharper spatial resolution), longer $t_{1/2}$ allows commercial regional distribution. |
| **$^{18}\\text{F}$-PSMA-1007** | $^{18}\\text{F}$ ($t_{1/2} = 110\\text{ min}$) | $200-250\\text{ MBq}$ ($5-7\\text{ mCi}$) IV; scan at $90\\text{ min}$ | Predominant **hepatic/biliary excretion**; minimal urinary excretion | Excellent for detecting local pelvic recurrences; higher rate of non-specific benign bone uptake. |
      `
    },
    {
      id: "sec-vision-trial",
      title: "2. Patient Selection, VISION Criteria & FDG-PSMA Discordance",
      content: `
### Landmark VISION Phase III Trial & FDA Approval

The phase III **VISION trial** established $^{177}\\text{Lu}$-vipivotide tetraxetan ($^{177}\\text{Lu}$-PSMA-617 / Pluvicto) plus standard of care vs standard of care alone in patients with progressive, PSMA-positive mCRPC who had previously received:
1. At least one androgen receptor pathway inhibitor (ARPI; e.g., Abiraterone or Enzalutamide).
2. One or two prior taxane chemotherapy regimens (Docetaxel and/or Cabazitaxel).

* **Primary Endpoints Met:** Statistically significant improvement in median overall survival ($15.3\\text{ months}$ vs $11.3\\text{ months}$, $\\text{HR} = 0.62$, $P < 0.001$) and radiographic progression-free survival (rPFS $8.7\\text{ months}$ vs $3.4\\text{ months}$, $\\text{HR} = 0.40$).

---

### Imaging Eligibility Criteria (PSMA-Avidity Scoring)

* **PSMA Positivity:** At least one metastatic tumor lesion must exhibit PSMA uptake **greater than normal liver parenchyma** ($SUV_{\\text{max}} > \\text{liver } SUV_{\\text{mean}}$).
* **Non-Eligibility / Exclusion (PSMA-Negative Disease):** Any soft tissue metastatic lesion measuring:
  * $\\ge 2.5\\text{ cm}$ in short axis for pelvic/retroperitoneal lymph nodes with uptake $\\le \\text{liver}$.
  * $\\ge 1.0\\text{ cm}$ in short axis for solid organ metastases (liver, lung, adrenal) with uptake $\\le \\text{liver}$.
  * Bone metastases with soft tissue component $\\ge 1.0\\text{ cm}$ lacking PSMA uptake.

---

### Dual-Tracer PET Biology: PSMA vs $^{18}\\text{F}$-FDG Discordance

In advanced neuroendocrine-differentiated or dedifferentiated mCRPC, tumor clones downregulate PSMA expression while upregulating GLUT1 transporters (Warburg effect):
* **Concordant PSMA+ / FDG-:** Highly differentiated, indolent to moderately aggressive prostate cancer; **superb response to $^{177}\\text{Lu}$-PSMA**.
* **Discordant PSMA- / FDG+:** Dedifferentiated aggressive prostate cancer lacking PSMA target; **primary resistance to $^{177}\\text{Lu}$-PSMA** and poor prognosis. Dual-tracer staging (Theranostics Ga-68 PSMA + F-18 FDG) prevents ineffective treatment of non-target-expressing metastases.
      `
    },
    {
      id: "sec-lu177-protocols",
      title: "3. Lu-177 Vipivotide Tetraxetan (Pluvicto) Protocols & Toxicities",
      content: `
### Physical & Radiochemical Characteristics of Lutetium-177 ($^{177}\\text{Lu}$)

* **Decay Mode:** Beta-minus particle ($\\beta^-$) emission ($100\\%$) accompanied by low-abundance gamma ($\\gamma$) photons ($208\\text{ keV}$ [$11\\%$] and $113\\text{ keV}$ [$6.4\\%$]) allowing post-injection SPECT/CT planar scintigraphy and quantitative dosimetry.
* **Physical Half-Life ($t_{1/2}$):** **$6.647\\text{ days}$** ($159.5\\text{ hours}$).
* **Beta Particle Energy:** Maximum energy $E_{\\text{max}} = 0.498\\text{ MeV}$; mean energy $E_{\\text{mean}} = 0.133\\text{ MeV}$.
* **Soft Tissue Path Length:** Maximum range **$1.8-2.0\\text{ mm}$** (mean range $\\sim 0.67\\text{ mm}$), matching the diameter of microscopic metastatic deposits and sparing adjacent normal parenchyma.

---

### Clinical Administration Regimen

* **Standard Dosing:** **$7.4\\text{ GBq}$ ($200\\text{ mCi}$) $\\pm 10\\%$** intravenously every **6 weeks** for up to a total of **6 cycles** (maximum cumulative activity $44.4\\text{ GBq}$ / $1200\\text{ mCi}$).
* **Pre-Medication & Hydration:**
  * Antiemetic: Ondansetron $8\\text{ mg}$ PO or Granisetron $1\\text{ mg}$ PO 30 minutes prior.
  * Hydration: $500-1000\\text{ mL}$ normal saline IV pre- and post-infusion to promote brisk diuresis and reduce renal/bladder radiation burden.
  * Salivary Gland Sparing: Application of external ice packs/cooling pads over parotid and submandibular glands for 4 hours starting 30 minutes before injection to induce vasoconstriction and reduce salivary radio-uptake.

---

### Organ-Specific Toxicities & Management Thresholds

| Target Organ / System | Pathophysiology & Incidence | Clinical Manifestation | Dose Modification & Management |
| :--- | :--- | :--- | :--- |
| **Salivary Glands** | Non-target PSMA expression in acinar cells ($38-43\\%$) | **Xerostomia** (dry mouth), altered taste (dysgeusia), transient sialadenitis | Sialagogues (lemon drops, pilocarpine), artificial saliva, salivary cooling. |
| **Bone Marrow** | Crossfire irradiation from skeletal metastases | **Anemia** ($32\\%$, Gr 3-4: $13\\%$), **Thrombocytopenia** ($17\\%$, Gr 3-4: $8\\%$), **Neutropenia** ($10\\%$, Gr 3-4: $3\\%$) | Hold therapy if $\\text{ANC} < 1000/\\mu\\text{L}$, $\\text{Platelets} < 50,000/\\mu\\text{L}$, or $\\text{Hb} < 8.0\\text{ g/dL}$. Reduce dose to $5.5\\text{ GBq}$ upon recovery. |
| **Renal Parenchyma** | Proximal tubule reabsorption | Creatinine elevation, renal insufficiency ($8-11\\%$) | Hold if baseline $\\text{CrCl} < 30\\text{ mL/min}$ or $\\text{eGFR} < 30\\text{ mL/min}/1.73\\text{ m}^2$. Maximum kidney biological effective dose (BED) $\\le 23\\text{ Gy}$. |
| **Gastrointestinal** | Intestinal PSMA uptake | Nausea ($35\\%$), decreased appetite ($21\\%$), fatigue ($43\\%$) | Routine 5-HT3 antagonists, oral hydration. |
      `
    },
    {
      id: "sec-alpha-theranostics",
      title: "4. Targeted Alpha Therapy (Ac-225) & Next-Generation Vectors",
      content: `
### Beta vs Alpha Radioligand Therapy Comparison

When patients develop resistance to $^{177}\\text{Lu}$-PSMA (e.g., DNA repair proficiency or bulky hypoxic tumors), **Targeted Alpha Therapy (TAT)** provides a potent alternative:

$$\\text{Linear Energy Transfer (LET): } \\text{Alpha (}\\sim 100\\text{ keV}/\\mu\\text{m}) \\gg \\text{Beta (}\\sim 0.2\\text{ keV}/\\mu\\text{m})$$

| Parameter | $^{177}\\text{Lu}$-PSMA-617 (Beta $\\beta^-$) | $^{225}\\text{Ac}$-PSMA-617 (Alpha $\\alpha$) |
| :--- | :--- | :--- |
| **Particle Type** | High-energy electron ($\\beta^-$) | Helium nucleus ($^4\\text{He}^{2+}$) |
| **Linear Energy Transfer (LET)** | Low: $\\sim 0.2\\text{ keV}/\\mu\\text{m}$ | **Ultra-High:** $80-100\\text{ keV}/\\mu\\text{m}$ |
| **Tissue Path Length** | Long: $1-2\\text{ mm}$ ($50-100$ cell diameters) | **Ultra-Short:** $40-100\\text{ }\\mu\\text{m}$ ($2-5$ cell diameters) |
| **DNA Damage Mechanism** | Single-strand breaks (sublethal; repairable by tumor ATM/BRCA) | **Complex Double-Strand Cluster Breaks (lethal; independent of cell cycle & oxygenation)** |
| **Physical Half-Life** | $6.65\\text{ days}$ | **$9.92\\text{ days}$** |
| **Decay Cascade** | Single beta decay to stable $^{177}\\text{Hf}$ | **4 net alpha decays** ($^{221}\\text{Fr} \\rightarrow ^{217}\\text{At} \\rightarrow ^{213}\\text{Bi} \\rightarrow ^{209}\\text{Pb}$) |
| **Dose-Limiting Toxicity** | Myelosuppression (bone marrow) | **Severe Irreversible Xerostomia** (salivary acinar destruction) |

* **Tandem / Combination Therapy:** Combining sub-therapeutic $^{225}\\text{Ac}$-PSMA ($5.0-6.5\\text{ MBq}$) with $^{177}\\text{Lu}$-PSMA ($4-6\\text{ GBq}$) produces synergistic tumor kill while minimizing devastating permanent xerostomia.
      `
    }
  ]
};
