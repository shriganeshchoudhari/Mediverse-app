/**
 * Clinical Immunology: Flow Cytometry, Immunodiagnostics & Monoclonal Biological Therapies
 * Authoritative medical content derived from Abbas' Cellular and Molecular Immunology (10th ed.), Harrison's Rheumatology.
 * Mapped to NMC CBME Competencies: IM7.1, IM7.2, IM8.1, IM8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FLOW_CYTOMETRY_BIOLOGICS_IMMUNOTHERAPY_MODULE: PhysiologyLessonModule = {
  id: "immunology-flow-cytometry-biologics-immunotherapy",
  unitCode: "IM7.1",
  title: "Flow Cytometry Immunophenotyping, CD Differentiation Markers & Targeted Monoclonal Biologics",
  competencies: ["IM7.1", "IM7.2", "IM8.1", "IM8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Flow Cytometry Immunophenotyping & Targeted Monoclonal Biologics

Flow cytometry enables rapid multi-parametric quantitative analysis of cell surface and intracellular antigens using laser-excited fluorochrome-conjugated antibodies.

---

## 1. Flow Cytometry Principles & Cellular Gating

- **Forward Scatter (FSC)**: Proportional to **cell cross-sectional size / volume**.
- **Side Scatter (SSC)**: Proportional to **internal cellular complexity / cytoplasmic granularity** (neutrophils have high SSC; lymphocytes have low SSC).
- **Cluster of Differentiation (CD) Markers**:
  - **T Cells**: **CD3** (pan-T marker associated with TCR), **CD4** (helper T cells, interacts with MHC-II), **CD8** (cytotoxic T cells, interacts with MHC-I), **CD28** (costimulatory receptor for B7/CD80/CD86).
  - **B Cells**: **CD19, CD20** (pan-B cell markers), **CD21** (EBV receptor / complement C3d receptor), **CD40** (interacts with CD40L/CD154 on T cells).
  - **Natural Killer (NK) Cells**: **CD16** (Fc$\\gamma$RIII mediating ADCC), **CD56** (NCAM marker). *Lack CD3!*
  - **Monocytes / Macrophages**: **CD14** (endotoxin / LPS co-receptor with TLR-4).
  - **Hematopoietic Stem Cells**: **CD34** (used to quantify stem cell yield for autologous/allogeneic HSCT apheresis).

---

## 2. CD4+ T-Cell Staging & Prophylaxis in HIV/AIDS

$$\begin{array}{lcccc}
\hline
\textbf{CD4+ T-Cell Count} & \textbf{Major Opportunistic Pathogen Risk} & \textbf{First-Line Antimicrobial Prophylaxis} & \textbf{Clinical Presentation} \\
\hline
\mathbf{<200/\mu\text{L}} & \mathbf{\textit{Pneumocystis jirovecii}\text{ Pneumonia (PCP)}} & \mathbf{\text{Trimethoprim-Sulfamethoxazole (TMP-SMX)}} & \text{Subacute dyspnea, non-productive cough, bilateral interstitial infiltrates} \\
\mathbf{<100/\mu\text{L}} & \mathbf{\textit{Toxoplasma gondii}\text{ Encephalitis}} & \mathbf{\text{TMP-SMX}} & \text{Multiple ring-enhancing brain lesions, seizures, focal neurological deficits} \\
\mathbf{<100/\mu\text{L}} & \textit{Cryptococcus neoformans}\text{ Meningitis} & \text{Fluconazole (secondary prophylaxis after Ampho B + Flucytosine)} & \text{Subacute headache, fever, elevated opening pressure, positive India ink / CRAG} \\
\mathbf{<50/\mu\text{L}} & \mathbf{\textit{Mycobacterium avium}\text{ Complex (MAC)}} & \mathbf{\text{Azithromycin (weekly)}} & \text{Disseminated fever, night sweats, weight loss, hepatosplenomegaly, anemia} \\
\mathbf{<50/\mu\text{L}} & \text{Cytomegalovirus (CMV) Retinitis} & \text{Valganciclovir / Ganciclovir} & \text{Painless visual loss, retinal hemorrhages with yellow-white granular infiltrates} \\
\hline
\end{array}$$

---

## 3. Targeted Monoclonal Biological Agents & Mechanisms

| Biologic Agent | Target Molecule / Pathway | Primary Approved Clinical Indications | Critical Adverse Events & Black Box Warnings |
| :--- | :--- | :--- | :--- |
| **Infliximab / Adalimumab** | **Tumor Necrosis Factor-$\\alpha$ (TNF-$\\alpha$)** | Rheumatoid arthritis, Crohn disease, Ulcerative colitis, Ankylosing spondylitis, Plaque psoriasis | **Reactivation of Latent Tuberculosis** (granuloma dissolution) and fungal infections. **Mandatory baseline screening with IGRA or Tuberculin skin test!** |
| **Etanercept** | Soluble **TNF Receptor-Fc fusion protein** (decoy receptor) | RA, Psoriatic arthritis, Ankylosing spondylitis | Reactivation of latent TB, demyelinating disease. |
| **Rituximab** | **CD20** antigen on pre-B and mature B lymphocytes | B-cell Non-Hodgkin Lymphoma, Chronic Lymphocytic Leukemia, Refractory RA, Granulomatosis with Polyangiitis (GPA) | **Progressive Multifocal Leukoencephalopathy (PML)** due to JC virus reactivation; Hepatitis B viral reactivation. |
| **Tocilizumab** | **Interleukin-6 Receptor (IL-6R)** | Severe / Refractory Rheumatoid Arthritis, Systemic Juvenile Idiopathic Arthritis, **Cytokine Release Syndrome (CRS)** | Cytopenias, elevated transaminases, bowel perforation in diverticulitis. |
| **Omalizumab** | **Free serum Immunoglobulin E (IgE)** (prevents binding to Fc$\\varepsilon$RI) | Severe refractory **Allergic Asthma**, Chronic Idiopathic Urticaria | Anaphylaxis ($0.2\\%$), injection site reactions. |
| **Secukinumab / Ixekizumab** | **Interleukin-17A (IL-17A)** | Severe Plaque Psoriasis, Psoriatic Arthritis, Ankylosing Spondylitis | Increased susceptibility to **mucocutaneous *Candida* infections**; exacerbation of inflammatory bowel disease. |
| **Dupilumab** | **IL-4 Receptor Alpha (IL-4R$\\alpha$)** (dual blocker of IL-4 and IL-13 signaling) | Moderate-to-severe Atopic Dermatitis, Severe Eosinophilic Asthma, Chronic Rhinosinusitis with Nasal Polyps | Conjunctivitis, keratitis, injection site reactions. |
| **Belimumab** | **B-Lymphocyte Stimulator (BLyS / BAFF)** | Active **Systemic Lupus Erythematosus (SLE)** and Lupus Nephritis | Depression/suicidality, serious infections. |
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old male with severe, active Ankylosing Spondylitis refractory to maximum-dose NSAID therapy is being evaluated for initiation of Infliximab (anti-TNF-alpha monoclonal antibody). He is asymptomatic from a respiratory standpoint and has no known history of tuberculosis. Prior to starting Infliximab, an Interferon-Gamma Release Assay (IGRA / QuantiFERON-TB Gold) is performed and returns positive. Chest radiography shows no active pulmonary parenchymal infiltrates or cavitations.",
      question: "Which of the following management steps MUST be completed before initiating Infliximab therapy?",
      options: [
        "Initiate prophylactic treatment for Latent Tuberculosis Infection (e.g., daily Isoniazid for 9 months or Rifampin for 4 months) at least 1 month prior to starting Infliximab",
        "Proceed immediately with Infliximab because the chest X-ray is normal",
        "Perform a bronchoalveolar lavage to rule out active mycobacterial replication before starting Infliximab",
        "Switch to Rituximab since anti-CD20 antibodies do not carry a risk of tuberculosis reactivation"
      ],
      correctAnswerIndex: 0,
      explanation: "TNF-alpha is critical for the formation and maintenance of granulomas that sequester Mycobacterium tuberculosis. Neutralization of TNF-alpha with monoclonal antibodies (e.g., Infliximab, Adalimumab) disrupts granuloma architecture, leading to rapid reactivation of latent tuberculosis and disseminated disease. Therefore, all patients must undergo mandatory screening for latent TB (via IGRA or PPD) before initiating anti-TNF therapy, and latent TB treatment must be initiated (typically at least 1 month prior) before biologic administration."
    }
  ]
};
