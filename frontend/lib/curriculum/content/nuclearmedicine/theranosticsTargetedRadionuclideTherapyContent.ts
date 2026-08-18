/**
 * Nuclear Medicine: Molecular Theranostics & Targeted Radionuclide Therapies (177Lu-DOTATATE, 177Lu-PSMA-617, 131I Radioablation)
 * Authoritative medical content derived from Mettler & Guiberteau (7th ed.), Baum's Theranostics, EANM/SNMMI Guidelines.
 * Mapped to NMC CBME Competencies: NM7.1, NM7.2, NM8.1, NM8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const THERANOSTICS_TARGETED_RADIONUCLIDE_THERAPY_MODULE: PhysiologyLessonModule = {
  id: "nuclearmedicine-theranostics-targeted-radionuclide-therapy",
  unitCode: "NM7.1",
  title: "Molecular Theranostics: 177Lu-DOTATATE PRRT, 177Lu-PSMA-617, 131I Thyroid Ablation & 223Ra Alpha Therapy",
  competencies: ["NM7.1", "NM7.2", "NM8.1", "NM8.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RADIOLOGY",
  markdownContent: `
# Molecular Theranostics & Targeted Radionuclide Therapies

Theranostics pairs a diagnostic imaging biomarker with an identical or structurally related therapeutic radiopharmaceutical to deliver targeted ionizing radiation directly to cancer cells.

---

## 1. The Clinical Molecular Theranostics Matrix

| Cancer Entity | Target Receptor / Biomarker | Diagnostic PET Radiopharmaceutical | Therapeutic Beta / Alpha Radiopharmaceutical | Clinical Trial Evidence & Outcomes |
| :--- | :--- | :--- | :--- | :--- |
| **Neuroendocrine Tumors (NETs)**<br>*(Gastroenteropancreatic NETs, carcinoids)* | **Somatostatin Receptor Subtype 2 (SSTR2)** | **$^{68}\text{Ga-DOTATATE}$** / $^{64}\text{Cu-DOTATATE}$ PET-CT | **$^{177}\text{Lu-DOTATATE}$ (Lutathera)** ($7.4\text{ GBq / } 200\text{ mCi}$ IV q8w $\times 4\text{ cycles}$). | **NETTER-1 Trial**: $>80\%$ reduction in disease progression/death. Mandatory **Lysine/Arginine amino acid co-infusion** to prevent nephrotoxicity. |
| **Metastatic Castration-Resistant Prostate Cancer (mCRPC)** | **Prostate-Specific Membrane Antigen (PSMA)** | **$^{68}\text{Ga-PSMA-11}$** / **$^{18}\text{F-DCFPyL}$** (Pylarify) PET-CT | **$^{177}\text{Lu-PSMA-617}$ (Pluvicto)** ($7.4\text{ GBq / } 200\text{ mCi}$ IV q6w $\times 6\text{ cycles}$). | **VISION Trial**: Significant overall survival benefit in PSMA-positive mCRPC previously treated with AR pathway inhibitors and taxane chemotherapy. |
| **Differentiated Thyroid Carcinoma & Graves Disease** | **Sodium-Iodide Symporter (NIS)** | **$^{123}\text{I}$** / Low-dose $^{131}\text{I}$ thyroid uptake scan | **$^{131}\text{I-Sodium Iodide}$** (Oral capsule/liquid). | • **Graves Disease**: $10 - 15\text{ mCi}$ ($370 - 555\text{ MBq}$).<br>• **Thyroid Cancer Ablation**: $30 - 150+\text{ mCi}$ following total thyroidectomy (stimulated by $\text{TSH} > 30\ \mu\text{IU/mL}$). |
| **Bone Metastatic Prostate Cancer** | **Bone Hydroxyapatite (Osteoblastic turnover)** | $^{99\text{m}}\text{Tc-MDP}$ Bone Scan / $^{18}\text{F-NaF}$ PET | **Radium-223 Dichloride ($^{223}\text{RaCl}_2$, Xofigo)** (Alpha emitter). | **ALSYMPCA Trial**: Calcium mimetic alpha emitter ($55\text{ kBq/kg}$ IV q4w $\times 6$). Delivers high linear energy transfer (LET) causing double-strand DNA breaks while sparing bone marrow ($<100\ \mu\text{m}$ range). |

---

## 2. Radioiodine ($^{131}\text{I}$) Thyroid Protocol & Safety Rules

- **Pre-Therapy Preparation**:
  1. Low-iodine diet for **$1 - 2\text{ weeks}$** prior to therapy.
  2. Discontinue Levothyroxine ($T_4$) for $4 - 6\text{ weeks}$ (or administer **Recombinant Human TSH [Thyrogen]**) to achieve endogenous $\text{TSH} > 30\ \mu\text{IU/mL}$ to upregulate Sodium-Iodide Symporters (NIS).
  3. Verify negative serum pregnancy test ($\beta\text{-hCG}$) within $24 - 48\text{ hours}$!
- **Post-Therapy Radiation Precautions**:
  - Distance: Sleep alone, maintain $\ge 2\text{ meters}$ distance from others (especially pregnant women and young children) for $3 - 7\text{ days}$.
  - Hydration: Aggressive fluids and frequent voiding to accelerate urinary excretion.
  - Sialadenitis Prevention: Sour candies / lemon drops after $24\text{ hours}$ to stimulate salivary flow and prevent radiation parotitis.

---

## 3. Radioprotective Renal Amino Acid Infusions

- **Mechanism of $^{177}\text{Lu-DOTATATE}$ Nephrotoxicity**:
  - Small peptide radiotracers undergo glomerular filtration followed by **megalin/cubilin receptor-mediated endocytosis into proximal convoluted tubule cells**, where retention causes radiation nephritis.
- **Renoprotection Protocol**:
  - Co-infuse positively charged amino acids (**L-Lysine and L-Arginine**) starting $30\text{ min}$ before $^{177}\text{Lu-DOTATATE}$ and continuing for $3 - 4\text{ hours}$ to competitively inhibit proximal tubule reabsorption.
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old male with progressive, somatostatin receptor-positive, well-differentiated ileal neuroendocrine tumor with hepatic metastases is scheduled to receive his first cycle of 177Lu-DOTATATE (Lutathera) peptide receptor radionuclide therapy (PRRT). Prior to starting the radiopharmaceutical infusion, the nuclear medicine team initiates an intravenous infusion of an amino acid solution containing L-lysine and L-arginine.",
      question: "What is the specific physiological and therapeutic rationale for administering this amino acid solution during PRRT?",
      options: [
        "Positively charged basic amino acids competitively inhibit proximal renal tubular reabsorption of the filtered radiolabeled peptide, preventing nephrotoxicity",
        "Amino acids increase somatostatin receptor expression on neuroendocrine tumor cells",
        "Lysine neutralizes beta-minus radiation particles in the bloodstream",
        "Arginine prevents acute allergic and anaphylactoid reactions"
      ],
      correctAnswerIndex: 0,
      explanation: "Peptide radiopharmaceuticals such as 177Lu-DOTATATE are cleared primarily by glomerular filtration and subsequently reabsorbed into the proximal renal tubular cells via megalin-cubilin receptor-mediated endocytosis, which leads to high local renal radiation doses. Co-infusion of positively charged basic amino acids (L-lysine and L-arginine) competitively inhibits this tubular reabsorption, allowing the radiotracer to be excreted in the urine and significantly protecting the kidneys from radiation nephropathy."
    }
  ]
};
