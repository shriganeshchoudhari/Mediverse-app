/**
 * Postgraduate Advanced Nuclear Medicine & Theranostics (PG-612)
 * Module 3: Thyroid Oncology, I-131 Radioactive Iodine Ablation & Recombinant Human TSH
 */

import { CurriculumModule } from "../../types";

export const THYROID_CANCER_IODINE131_ABLATION_MODULE: CurriculumModule = {
  id: "fa770005-0000-0000-0000-000000000003",
  title: "Differentiated Thyroid Cancer, I-131 Radioactive Iodine Remnant Ablation, rhTSH & Radiation Safety",
  code: "PG12.3",
  subject: "Postgraduate Advanced Nuclear Medicine, Theranostics & Radioligand Oncology",
  semester: 10,
  description:
    "Mastery curriculum covering sodium-iodide symporter (NIS) biology in differentiated thyroid cancer (PTC/FTC), American Thyroid Association (ATA) risk-stratified post-thyroidectomy I-131 ablation dosing, recombinant human TSH (Thyrogen) stimulation vs thyroid hormone withdrawal, low-iodine diet preparation, NRC radiation release regulations, and redifferentiation strategies for RAI-refractory disease.",
  estimatedMinutes: 65,
  competencies: [
    "PG12.3.1: Delineate Sodium-Iodide Symporter (NIS) kinetics and I-131 decay physics (beta emission Emax 0.606 MeV, gamma 364 keV, t1/2 8.02 days)",
    "PG12.3.2: Apply ATA guidelines to stratify Low vs Intermediate vs High risk DTC and determine remnant ablation (30-100 mCi) vs adjuvant treatment (100-200 mCi)",
    "PG12.3.3: Contrast recombinant human TSH (rhTSH / Thyrogen 0.9 mg IM D1/D2) protocols with classical levothyroxine hormone withdrawal (TSH >30 mIU/L)",
    "PG12.3.4: Implement NRC 10 CFR 35.75 patient release criteria, salivary protection (lemon candy), and kinase inhibitor redifferentiation in RAI-refractory thyroid cancer"
  ],
  sections: [
    {
      id: "sec-nis-biology-i131",
      title: "1. Sodium-Iodide Symporter (NIS) & Iodine-131 Decay Physics",
      content: `
### Molecular Mechanism: Sodium-Iodide Symporter (NIS)

* **Physiological Transport:** The **Sodium-Iodide Symporter (NIS)** is a 13-transmembrane domain glycoprotein located on the basolateral membrane of thyroid follicular epithelial cells (encoded by the *SLC5A5* gene).
* **Stoichiometry:** Driven by the basolateral $Na^+/K^+$ ATPase pump gradient, NIS cotransports **$2\\text{ Na}^+$ ions down their concentration gradient along with $1\\text{ I}^-$ ion** into the thyroid follicular cytoplasm against a steep chemical gradient ($20-50\\times$ serum levels).
* **Organification:** Intracellular iodide is oxidized by thyroid peroxidase (TPO) and covalently bound to tyrosine residues on thyroglobulin.

---

### Physical Characteristics of Iodine-131 ($^{131}\\text{I}$)

* **Decay Mode:** Dual-emission radionuclide:
  * **Beta ($\\beta^-$) Emission ($89.9\\%$):** Therapeutic component; maximum energy $E_{\\text{max}} = 0.606\\text{ MeV}$ (mean $0.192\\text{ MeV}$), mean soft tissue penetration depth **$0.4-0.8\\text{ mm}$** (max $2.0\\text{ mm}$), causing lethal cross-strand DNA double-strand breaks in thyroid tissue.
  * **Gamma ($\\gamma$) Emission ($81.7\\%$):** Diagnostic component; principal photon energy **$364\\text{ keV}$**, permitting whole-body scintigraphy (WBS) and quantitative dosimetric scanning.
* **Physical Half-Life ($t_{1/2}$):** **$8.02\\text{ days}$** ($192.5\\text{ hours}$).

---

### Comparison of Thyroid Diagnostic Tracers

| Radiopharmaceutical | Physical Half-Life | Primary Radiation | Standard Diagnostic Dose | Clinical Indication & Uptake Timing |
| :--- | :--- | :--- | :--- | :--- |
| **$^{123}\\text{I}$** (Sodium Iodide) | **$13.2\\text{ hours}$** | Gamma $159\\text{ keV}$ (pure $\\gamma$) | $3.7-14.8\\text{ MBq}$ ($100-400\\text{ }\\mu\\text{Ci}$) PO | Diagnostic thyroid uptake & pre-ablation staging; **no stunning** of thyroid remnants. Scan at $24\\text{ hours}$. |
| **$^{131}\\text{I}$** (Sodium Iodide) | **$8.02\\text{ days}$** | Beta $\\beta^-$ ($0.606\\text{ MeV}$) $+$ Gamma ($364\\text{ keV}$) | Diagnostic: $37-185\\text{ MBq}$ ($1-5\\text{ mCi}$) PO; Therapeutic: $1.1-7.4\\text{ GBq}$ ($30-200\\text{ mCi}$) | Post-therapy whole body scan (RxWBS) at $3-7\\text{ days}$; diagnostic use can cause "thyroid stunning". |
| **$^{99\\text{m}}\\text{Tc}$-Pertechnetate** | **$6.0\\text{ hours}$** | Gamma $140\\text{ keV}$ | $74-370\\text{ MBq}$ ($2-10\\text{ mCi}$) IV | Rapid evaluation of thyroid nodules and hyperthyroidism; trapped by NIS but **not organified**. Scan at $20\\text{ min}$. |
      `
    },
    {
      id: "sec-ata-risk-stratification",
      title: "2. ATA Risk Stratification & I-131 Post-Surgical Ablation Dosing",
      content: `
### American Thyroid Association (ATA) Risk Stratification for DTC

Following total thyroidectomy for Differentiated Thyroid Cancer (Papillary Thyroid Carcinoma [PTC] and Follicular Thyroid Carcinoma [FTC]), the decision for adjuvant $^{131}\\text{I}$ radioactive iodine (RAI) is dictated by risk of recurrence:

| ATA Risk Category | Histopathological & Clinical Criteria | Indications for Post-Operative $^{131}\\text{I}$ RAI | Recommended Ingested $^{131}\\text{I}$ Activity |
| :--- | :--- | :--- | :--- |
| **Low Risk** | Intrathyroidal PTC $\\le 4\\text{ cm}$, unifocal or multifocal, no extrathyroidal extension, $N0$ or $\\le 5$ micro-metastases ($<0.2\\text{ cm}$), non-aggressive histology. | **NOT routinely indicated** (no proven survival or recurrence benefit). Selective remnant ablation optional for high-risk low-tier. | If indicated: **$1110\\text{ MBq}$ ($30\\text{ mCi}$)** |
| **Intermediate Risk** | Microscopic extrathyroidal extension, aggressive variants (tall cell, columnar, hobnail, diffuse sclerosing), vascular invasion ($>4$ foci in FTC), or clinical $N1$ ($>5$ involved lymph nodes, all $<3\\text{ cm}$). | **Remnant Ablation & Adjuvant Therapy Recommended** to destroy microscopic residual foci and facilitate serum Thyroglobulin (Tg) surveillance. | **$1110-3700\\text{ MBq}$ ($30-100\\text{ mCi}$)** |
| **High Risk** | Macroscopic gross extrathyroidal extension into strap muscles/trachea/larynx ($T4$), incomplete surgical resection ($R2$), lymph node metastasis $\\ge 3\\text{ cm}$, or distant metastases ($M1$: lungs, bone). | **Therapeutic $^{131}\\text{I}$ Mandatory** for treatment of residual locoregional tumor or distant metastases. | **$3700-7400\\text{ MBq}$ ($100-200\\text{ mCi}$)** (up to $250\\text{ mCi}$ dosimetrically) |

---

### Low-Iodine Diet (LID) Protocol

* **Purpose:** Deplete intracellular stable iodine ($^{127}\\text{I}$) pool to maximally upregulate NIS expression and prevent competitive inhibition of $^{131}\\text{I}$ uptake.
* **Duration:** Strict restriction to **$<50\\text{ }\\mu\\text{g/day}$ of dietary iodine** for **1 to 2 weeks** prior to RAI administration, continuing for 48 hours post-dose.
* **Restricted Foods:** Iodized salt, seafood, dairy products (milk, cheese, yogurt), eggs/egg yolks, commercial baked goods containing iodate dough conditioners, cured meats, red dye #3 (erythrosine), and seaweed/kelp supplements. Check 24-hour urine iodine ($<100\\text{ }\\mu\\text{g/24h}$ confirms compliance).
      `
    },
    {
      id: "sec-tsh-stimulation",
      title: "3. TSH Stimulation: Recombinant Human TSH (Thyrogen) vs Withdrawal",
      content: `
### Why TSH Stimulation is Essential

Elevated serum TSH ($>30\\text{ mIU/L}$) is required to phosphorylate and translocate NIS proteins to the follicular basolateral cell membrane, stimulating maximal radioiodine uptake and organification.

**Method 1: Hormone Withdrawal (THW)**
* Stop Levothyroxine ($T_4$) for 4-6 weeks (or $T_3$ for 2-3 weeks, then off for 2 weeks).
* Induces severe symptomatic hypothyroidism ($TSH > 30\\text{ mIU/L}$) with fatigue, depression, cognitive slowing, and cardiorenal strain.

**Method 2: Recombinant Human TSH (rhTSH / Thyrogen)**
* Patient stays ON Levothyroxine (remains completely euthyroid throughout preparation!).
* Day 1: Thyrogen $0.9\\text{ mg}$ IM gluteal injection.
* Day 2: Thyrogen $0.9\\text{ mg}$ IM gluteal injection.
* Day 3: Administer $^{131}\\text{I}$ therapeutic capsule orally.
* Day 5: Measure stimulated serum Thyroglobulin (Tg) & Anti-Tg antibodies.
* Days 6-8: Post-Therapy Whole-Body Scintigraphy (RxWBS).

* **Equivalence in Clinical Trials:** The randomized **ESTIMABL1** and **HiLo** trials proved that for low- and intermediate-risk DTC, **rhTSH $+$ $30\\text{ mCi}$ $^{131}\\text{I}$ achieves equivalent ablation success ($>90\\%$)** compared to hormone withdrawal $+$ $100\\text{ mCi}$, with significantly superior quality of life and lower whole-body bone marrow radiation exposure due to preserved glomerular filtration rate.
      `
    },
    {
      id: "sec-radiation-safety-redifferentiation",
      title: "4. NRC Radiation Safety, Salivary Protection & RAI Refractoriness",
      content: `
### NRC 10 CFR 35.75 Patient Release Criteria

Under US Nuclear Regulatory Commission (NRC) and international radiation safety standards, a patient treated with $^{131}\\text{I}$ may be released from the hospital when:
1. The total effective dose equivalent (TEDE) to any other individual (caregiver, public) is **unlikely to exceed $5\\text{ mSv}$ ($0.5\\text{ rem}$)**; OR
2. The measured dose rate at **$1\\text{ meter}$ distance is $\\le 7.0\\text{ mrem/hour}$** ($0.07\\text{ mSv/hour}$); OR
3. The retained patient activity is **$<1220\\text{ MBq}$ ($33\\text{ mCi}$)**.

#### Home Precaution Rules (5-7 Days Post-Treatment):
* Sleep in a separate bed ($>2\\text{ meters}$ / $6\\text{ feet}$ away from others).
* Avoid close contact with pregnant women and infants/children.
* Flush toilet twice after each use, sit during urination, and wash hands meticulously.
* Wash utensils, dishes, and linens separately.

---

### Salivary Gland Protection

* **Mechanism:** Salivary gland ductal epithelial cells actively express NIS, concentrating $^{131}\\text{I}$ in parotid and submandibular glands, leading to acute sialadenitis, xerostomia, and chronic ductal stenosis.
* **Sialagogue Protocol:** Instruct patient to suck on sour candies (lemon drops) or chew gum starting **24 hours AFTER radioiodine ingestion** (starting too early increases blood flow during peak serum activity and paradoxically worsens salivary dose).

---

### RAI-Refractory DTC & Redifferentiation Kinase Inhibitors

* **Definition of RAI-Refractory Thyroid Cancer:**
  1. Metastatic malignant lesions that completely fail to take up $^{131}\\text{I}$ on diagnostic or therapeutic scans.
  2. Tumor lesions that lose the ability to take up $^{131}\\text{I}$ after previous evidence of avidity.
  3. $^{131}\\text{I}$ is concentrated in some lesions but not in others.
  4. Progressive disease despite high cumulative administered $^{131}\\text{I}$ activity ($>22.2\\text{ GBq}$ / $600\\text{ mCi}$).
* **Molecular Redifferentiation Strategy:** MAPK pathway hyperactivation (*BRAF* V600E, *RET/PTC*, *RAS*) downregulates NIS expression via histone deacetylation.
  * **$BRAF$ / MEK Inhibitors:** Dabrafenib $+$ Trametinib or Selumetinib restores NIS basolateral trafficking, enabling successful re-induction of $^{131}\\text{I}$ uptake in previously RAI-refractory tumors.
  * **Multi-Kinase Inhibitors:** Lenvatinib or Sorafenib (VEGFR/FGFR/RET) are first-line systemic therapies for progressive symptomatic RAI-refractory disease.
      `
    }
  ]
};
