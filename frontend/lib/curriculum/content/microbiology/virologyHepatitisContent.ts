/**
 * Virology, Hepatitis B Serology & Opportunistic Infections Learning Content
 * Authoritative medical content derived from Jawetz, Murray, Levinson, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: MI8.1, MI8.2, MI8.3, MI8.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const VIROLOGY_HEPATITIS_MODULE: PhysiologyLessonModule = {
  id: "micr-virology",
  unitCode: "MI8.1",
  title: "Virology, Hepatitis B Serological Markers, HIV Opportunistic Stages & Herpesviruses",
  competencies: ["MI8.1", "MI8.2", "MI8.3", "MI8.4"],
  estimatedMinutes: 125,
  organ3dTarget: "IMMUNOLOGY",
  markdownContent: `
# Virology, Hepatitis B Serological Markers, HIV Opportunistic Stages & Herpesviruses

Viral pathogenesis involves host cell receptor binding, genome replication (DNA, $(+)$ssRNA, $(-)$ssRNA, or retroviral reverse transcription), and immune evasion or oncogenesis.

---

## 1. Hepatitis B Virus (HBV) Serology Interpretation Matrix

HBV (Hepadnavirus, partially dsDNA circular genome with reverse transcriptase) has distinct diagnostic serological markers:

| Clinical State | HBsAg (Surface Antigen) | Anti-HBs (Surface Antibody) | HBeAg (Envelope Antigen) | Anti-HBe (Envelope Antibody) | Anti-HBc IgM (Core IgM) | Anti-HBc IgG (Core IgG) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Acute HBV Infection (Early/Active)** | **POSITIVE** | Negative | **POSITIVE** (High infectivity) | Negative | **POSITIVE** | Negative |
| **Window Period** | Negative | Negative | Negative | Positive / Negative | **POSITIVE (Only Marker!)** | Negative |
| **Chronic HBV (High Infectivity)** | **POSITIVE ($>6$ mo)** | Negative | **POSITIVE** | Negative | Negative | **POSITIVE** |
| **Chronic HBV (Low Infectivity)** | **POSITIVE ($>6$ mo)** | Negative | Negative | **POSITIVE** | Negative | **POSITIVE** |
| **Recovery / Natural Immunity** | Negative | **POSITIVE** | Negative | Positive | Negative | **POSITIVE** |
| **Immunization / Vaccinated** | Negative | **POSITIVE (Only Marker!)** | Negative | Negative | Negative | Negative |

> **High-Yield Serology Rules**:
> - **Anti-HBs Positive ONLY** $\\implies$ **Vaccinated** (Recombinant HBsAg vaccine; no core or envelope exposure).
> - **Anti-HBs $+$ Anti-HBc IgG Positive** $\\implies$ **Natural Prior Infection & Recovery**.
> - **Window Period (HBsAg clears, but Anti-HBs not yet detectable)** $\\implies$ **Anti-HBc IgM is the ONLY diagnostic marker**.
> - **HBeAg Positive** $\\implies$ Active viral replication and **high infectivity / transmission risk**.

---

## 2. HIV: CD4+ T-Cell Count Opportunistic Infection Thresholds

As HIV destroys $CD4^+$ helper T-cells via gp120/gp41 attachment to CD4 and CXCR4/CCR5 coreceptors, specific opportunistic infections emerge at defined immunological thresholds:

| CD4+ T-Cell Count | Opportunistic Pathogen | Classic Clinical Manifestations | First-Line Prophylaxis / Treatment |
| :--- | :--- | :--- | :--- |
| **$<500 / \\mu\\text{L}$** | • *Candida albicans*<br>• Epstein-Barr Virus (EBV)<br>• HHV-8 (Kaposi Sarcoma)<br>• *Bartonella henselae* | • **Oral Thrush** (scrapable white plaques on pseudomembranes)<br>• **Oral Hairy Leukoplakia** (lateral tongue white ridges, non-scrapable)<br>• **Kaposi Sarcoma** (violaceous skin papules; spindle cells & slit-like vascular channels)<br>• **Bacillary Angiomatosis** (red vascular lesions resembling Kaposi) | Antiretroviral Therapy (ART) |
| **$<200 / \\mu\\text{L}$**<br>*(AIDS Defining)* | • ***Pneumocystis jirovecii*** (PCP)<br>• JC Virus (Polyomavirus) | • **Pneumocystis Pneumonia (PCP)**: Subacute dyspnea, dry cough, hypoxemia, bilateral ground-glass infiltrates; silver stain shows crushed ping-pong ball cysts.<br>• **Progressive Multifocal Leukoencephalopathy (PML)**: Demyelination of white matter. | **Trimethoprim-Sulfamethoxazole (TMP-SMX)** prophylaxis (or Dapsone/Atovaquone) |
| **$<100 / \\mu\\text{L}$** | • ***Toxoplasma gondii***<br>• ***Cryptococcus neoformans***<br>• CMV | • **Cerebral Toxoplasmosis**: Multiple ring-enhancing brain lesions with mass effect on MRI/CT.<br>• **Cryptococcal Meningitis**: India ink / mucicarmine shows thick polysaccharide capsule; elevated opening pressure.<br>• **CMV Esophagitis** (linear ulcers). | • **TMP-SMX** prophylaxis (for Toxoplasma)<br>• **Amphotericin B $+$ Flucytosine** $\\rightarrow$ Fluconazole (Cryptococcus) |
| **$<50 / \\mu\\text{L}$** | • ***Mycobacterium avium-intracellulare* (MAC)**<br>• **Cytomegalovirus (CMV)** | • **Disseminated MAC**: High fever, night sweats, weight loss, anemia, hepatosplenomegaly.<br>• **CMV Retinitis**: Pizza-pie / brushfire retinal hemorrhages, cotton-wool spots, blindness. | • **Azithromycin** prophylaxis (MAC)<br>• **Ganciclovir / Valganciclovir** (CMV) |

---

## 3. Herpesviridae Family (dsDNA Enveloped Viruses)

- **HSV-1 & HSV-2**: Cowdry A inclusions, syncytia (multinucleated giant cells on **Tzanck Smear**); HSV-1 latent in trigeminal ganglion (temporal lobe encephalitis), HSV-2 latent in sacral ganglia (genital herpes).
- **Varicella-Zoster Virus (VZV / HHV-3)**: Chickenpox (crops of lesions in various stages: papules $\\rightarrow$ vesicles on an erythematous base "dewdrops on a rose petal" $\\rightarrow$ crusts); reactivation as Herpes Zoster (Shingles) along a unilateral dermatome (latent in dorsal root ganglia).
- **Epstein-Barr Virus (EBV / HHV-4)**: Infects B-cells via **CD21** receptor $\\implies$ **Infectious Mononucleosis** (fever, pharyngitis, posterior cervical lymphadenopathy, splenomegaly, **Atypical reactive CD8+ T-lymphocytes / Downey cells**, positive Heterophile Monospot test).
- **Cytomegalovirus (CMV / HHV-5)**: Latent in mononuclear cells; **Owl-eye intranuclear inclusions**; congenital infection causes sensorineural hearing loss, periventricular calcifications, and blueberry muffin rash.
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old male with poorly controlled HIV infection (CD4+ count 78/uL) presents with a 2-week history of progressive headache, fever, and confusion. Contrast-enhanced brain MRI demonstrates multiple ring-enhancing lesions located in the basal ganglia with surrounding vasogenic edema and mass effect.",
      question: "Which of the following is the most likely pathogen responsible for this patient's presentation?",
      options: [
        "Toxoplasma gondii",
        "Pneumocystis jirovecii",
        "Cytomegalovirus (CMV)",
        "JC Polyomavirus (PML)"
      ],
      correctAnswerIndex: 0,
      explanation: "Toxoplasma gondii is an intracellular protozoan that reactivates in AIDS patients with CD4+ T-cell counts <100/uL, causing focal neurological deficits, headache, and pathognomonic multiple ring-enhancing brain lesions predominantly situated within the basal ganglia and corticomedullary junction."
    }
  ]
};
