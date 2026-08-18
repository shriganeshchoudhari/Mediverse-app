/**
 * Tuberculosis Pathogenesis, Diagnostics (CBNAAT/GeneXpert) & NTEP 2024 Regimens
 * Authoritative medical content derived from NTEP Guidelines 2024, WHO TB Guidelines, Crofton & Douglas, and USMLE Step 2/3 Pulmonology.
 * Mapped to NMC CBME Competencies: CT3.1, CT3.2, CT4.1, CT4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TUBERCULOSIS_NTEP_MDR_REGIMENS_MODULE: PhysiologyLessonModule = {
  id: "resp-tuberculosis-ntep-mdr-regimens",
  unitCode: "CT3.1",
  title: "Pulmonology: Tuberculosis (NTEP 2024), GeneXpert MTB/RIF & MDR/XDR-TB Regimens (BPaL)",
  competencies: ["CT3.1", "CT3.2", "CT4.1", "CT4.2"],
  estimatedMinutes: 145,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Pulmonology: Tuberculosis (NTEP 2024), GeneXpert MTB/RIF & MDR/XDR-TB Regimens (BPaL)

Tuberculosis (*Mycobacterium tuberculosis*) remains a leading cause of infectious mortality, managed globally through rapid molecular diagnostics and standardized multidrug regimens.

---

## 1. Primary vs Reactivation / Secondary Tuberculosis

- **Microbiology**: *Mycobacterium tuberculosis* is an obligate aerobe, acid-fast bacillus (AFB) with a lipid-rich mycolic acid cell wall (stained bright red with **Ziehl-Neelsen [ZN] stain** and fluorescing yellow-green with **Auramine-Rhodamine**).
- **Primary Tuberculosis**:
  - Inhaled droplet nuclei deposit in mid-to-lower lung zones $\\rightarrow$ subpleural **Ghon Focus**.
  - Spread via lymphatic drainage to regional hilar lymph nodes $\\implies$ **Ghon Complex** (Ghon focus $+$ hilar lymphadenopathy).
  - Subsequent dystrophic calcification and fibrosis $\\implies$ **Ranke Complex**.
  - Typically asymptomatic ($90-95\\%$) and contained by cell-mediated immunity (CD4+ Th1 cells secreting IFN-$\\gamma$, activating macrophages to form caseating epithelioid granulomas with Langhans giant cells).
- **Secondary / Reactivation Tuberculosis**:
  - Occurs during periods of impaired cell-mediated immunity (HIV/AIDS, malnutrition, anti-TNF-$\\alpha$ biologic therapy, diabetes, silicosis, end-stage renal disease).
  - Predilection for **Apical and Posterior Segments of Upper Lobes** (high ventilation-perfusion ratio with peak alveolar $pO_2$).
  - Classic Triad: **Low-grade evening fever with drenching night sweats**, chronic cough productive of blood-tinged sputum (**Hemoptysis**), and significant unintentional weight loss.
  - Cavitation and erosion into pulmonary arteries (**Rasmussen Aneurysm**) causes life-threatening massive hemoptysis.

---

## 2. Diagnostic Modalities: GeneXpert CBNAAT & Drug Susceptibility Testing

| Diagnostic Test | Technology & Methodology | Turnaround Time | Clinical Utility & Target Mutations |
| :--- | :--- | :--- | :--- |
| **CBNAAT / GeneXpert MTB/RIF** | Automated cartridge-based real-time PCR. | **$< 2\\text{ hours}$** | **Initial diagnostic test of choice under NTEP**; simultaneously detects *M. tuberculosis* DNA AND **Rifampicin resistance** (mutations in the **$rpoB$ gene** 81-bp core region). |
| **First-Line Line Probe Assay (FL-LPA)** | DNA strip hybridization PCR. | $24 - 48\\text{ hours}$ | Confirms resistance to **Isoniazid** (**$katG$** high-level resistance vs **$inhA$** low-level promoter resistance) and **Rifampicin** ($rpoB$). |
| **Second-Line LPA (SL-LPA)** | DNA strip hybridization PCR. | $24 - 48\\text{ hours}$ | Detects resistance to **Fluoroquinolones** ($gyrA$, $gyrB$) and Second-line Injectables ($rrs$, *eis*). |
| **Liquid Culture (MGIT 960)** | Automated fluorometric liquid broth culture. | $10 - 21\\text{ days}$ | **Gold Standard** for mycobacterial recovery, phenotype confirmation, and whole-genome sequencing. |

---

## 3. Standard Drug-Sensitive TB (DS-TB) Regimen & First-Line Drug Toxicities

$$\\text{NTEP Standard Regimen}: \\underbrace{2\\text{ HRZE}}_{\\text{Intensive Phase (2 months)}} + \\underbrace{4\\text{ HRE}}_{\\text{Continuation Phase (4 months)}}$$
*(Administered as daily Fixed-Dose Combinations [FDCs] weight-banded with DOTS support)*

| First-Line Anti-TB Drug | Mechanism of Action | Key Adverse Effects & Clinical Toxicities | Mandatory Monitoring & Prevention |
| :--- | :--- | :--- | :--- |
| **Isoniazid (H / INH)** | Inhibits **Mycolic Acid Synthesis** via bacterial InhA enzyme. | • **Peripheral Neuropathy** (competitive antagonism of pyridoxine / Vitamin $B_6$ causing GABA deficiency).<br>• **Hepatotoxicity** (toxic hydrazine metabolites).<br>• Drug-induced Lupus (anti-histone antibodies). | **Co-prescribe Pyridoxine (Vitamin $B_6$) $10 - 25\\text{ mg/day}$** in high-risk patients (pregnancy, diabetes, HIV, alcoholism, chronic renal failure). |
| **Rifampicin (R / RIF)** | Inhibits bacterial **DNA-dependent RNA Polymerase** ($rpoB$). | • **Benign Orange-Red Discoloration** of body fluids (urine, tears, sweat, contact lenses).<br>• **Potent CYP3A4 Enzyme Inducer** (drastically reduces levels of OCPs, Warfarin, Methadone, and Protease Inhibitors).<br>• Hepatotoxicity, cholestatic jaundice. | Warn patients about harmless red urine; switch oral contraceptives to barrier methods or IUDs. |
| **Pyrazinamide (Z / PZA)** | Disrupts membrane energy metabolism in acidic phagolysosomes. | • **Hyperuricemia & Acute Gouty Arthritis** (inhibits renal urate secretion).<br>• **Most potent Hepatotoxic first-line agent**; arthralgias. | Monitor serum uric acid; discontinue if acute gout flares or hepatotoxicity develops. |
| **Ethambutol (E / EMB)** | Inhibits **Arabinosyl Transferase** (blocks arabinogalactan synthesis). | • **Optic Neuritis / Retrobulbar Neuritis** (decreased visual acuity, central scotoma, **Red-Green Color Blindness**). | **Baseline visual acuity and Ishihara color chart testing**; strictly avoided in children $< 6\\text{ years}$ who cannot self-report visual deficits. |

---

## 4. Drug-Resistant Tuberculosis: MDR-TB, XDR-TB & The BPaL Regimen

- **Definitions**:
  - **MDR-TB (Multidrug-Resistant TB)**: Resistance to at least **Isoniazid (H) AND Rifampicin (R)**.
  - **Pre-XDR-TB**: MDR-TB plus resistance to any **Fluoroquinolone** (Levofloxacin or Moxifloxacin).
  - **XDR-TB (Extensively Drug-Resistant TB)**: MDR-TB plus resistance to a Fluoroquinolone AND at least one **Group A drug (Bedaquiline or Linezolid)**.
- **The Modern All-Oral Shorter Regimen (BPaL / BPaLM - 6 Months)**:
  - **B: Bedaquiline** (Inhibits mycobacterial ATP Synthase; monitor QTc interval on ECG).
  - **Pa: Pretomanid** (Inhibits mycolic acid synthesis and generates reactive nitrogen species).
  - **L: Linezolid** (Inhibits 50S ribosomal protein synthesis; monitor for myelosuppression and optic/peripheral neuropathy).
  - **M: Moxifloxacin** (Added in BPaLM for fluoroquinolone-susceptible MDR-TB).
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male with newly diagnosed pulmonary tuberculosis is initiated on the standard 4-drug fixed-dose regimen (2 HRZE). Three weeks into therapy, he presents to the clinic complaining of progressive bilateral visual blurring and difficulty distinguishing red from green traffic signals. Physical examination demonstrates bilateral central scotomas with reduced visual acuity (20/80 bilaterally). Fundoscopic examination reveals mild hyperemia of the optic disc.",
      question: "Which component of his anti-tuberculosis regimen is responsible for this adverse effect, and what is the immediate management?",
      options: [
        "Ethambutol (E); Discontinue Ethambutol immediately and obtain formal ophthalmology evaluation",
        "Isoniazid (H); Increase the daily Pyridoxine (Vitamin B6) dose to 100 mg",
        "Rifampicin (R); Reassure the patient that optic discoloration is harmless",
        "Pyrazinamide (Z); Measure serum uric acid and administer Allopurinol"
      ],
      correctAnswerIndex: 0,
      explanation: "The development of retrobulbar optic neuritis characterized by decreased visual acuity, central scotomas, and red-green dyschromatopsia is a classic, dose-dependent adverse effect of Ethambutol (E), which inhibits arabinosyl transferase. Ethambutol must be discontinued immediately upon the first onset of visual symptoms to prevent permanent, irreversible blindness. Isoniazid causes peripheral neuropathy, Rifampicin causes orange-red secretions, and Pyrazinamide causes hyperuricemia/gout."
    }
  ]
};
