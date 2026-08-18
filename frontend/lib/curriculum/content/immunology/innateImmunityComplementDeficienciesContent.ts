/**
 * Clinical Immunology: Innate Immunity, Complement Cascade & Primary Immunodeficiencies
 * Authoritative medical content derived from Abbas' Cellular and Molecular Immunology (10th ed.), Janeway's Immunobiology (10th ed.).
 * Mapped to NMC CBME Competencies: IM1.1, IM1.2, IM2.1, IM2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INNATE_IMMUNITY_COMPLEMENT_DEFICIENCIES_MODULE: PhysiologyLessonModule = {
  id: "immunology-innate-immunity-complement-deficiencies",
  unitCode: "IM1.1",
  title: "Innate Immunity, Complement Activation Cascades & Primary Immunodeficiency Syndromes",
  competencies: ["IM1.1", "IM1.2", "IM2.1", "IM2.2"],
  estimatedMinutes: 150,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Innate Immunity, Complement Activation Cascades & Primary Immunodeficiency Syndromes

Innate immunity provides the first line of host defense through pattern recognition receptors (PRRs), phagocytosis, the complement cascade, and natural killer (NK) cells.

---

## 1. Complement Activation Cascades & Terminal Lysis

1. **Classical Pathway**: Initiated by antigen-antibody complexes (**IgM or IgG1/IgG3**) binding to **C1q** $\\rightarrow$ activates C1r/C1s $\\rightarrow$ cleaves C4 and C2 $\\rightarrow$ **C4b2a (Classical C3 Convertase)**.
2. **Alternative Pathway**: Initiated by spontaneous low-level hydrolysis of C3 ("tickover") or microbial surface polysaccharides $\\rightarrow$ Factor B and Factor D $\\rightarrow$ **C3bBb (Alternative C3 Convertase)**. Properdin stabilizes C3bBb.
3. **Lectin Pathway**: Mannose-binding lectin (MBL) or ficolins bind microbial carbohydrate residues $\\rightarrow$ activates MASP-1/MASP-2 $\\rightarrow$ cleaves C4 and C2 $\\rightarrow$ **C4b2a**.
4. **Terminal Pathway (Membrane Attack Complex, MAC)**: C5 convertase (C4b2a3b or C3bBbC3b) cleaves C5 into **C5a (anaphylatoxin & neutrophil chemoattractant)** and C5b. C5b recruits **C6, C7, C8, and poly-C9** to form the transmembrane pore **C5b-9 (MAC)**, inducing target cell osmotic lysis.

---

## 2. High-Yield Primary Immunodeficiency Syndromes (PIDs)

| Immunodeficiency Disorder | Genetic / Molecular Defect | Clinical Hallmarks & Cardinal Manifestations | Laboratory Findings & Diagnostics |
| :--- | :--- | :--- | :--- |
| **Severe Combined Immunodeficiency (SCID)** | • **X-Linked SCID ($50\\%$)**: Common $\\gamma$-chain (*IL2RG*) defect of IL-2, 4, 7, 9, 15, 21 receptors.<br>• **Autosomal Recessive SCID**: Adenosine Deaminase (*ADA*) deficiency $\\implies$ toxic dATP accumulation in lymphocytes. | Severe recurrent fungal (*Candida* thrush), viral (CMV, VZV), and bacterial infections in early infancy ($<3\\text{ months}$); **chronic diarrhea, failure to thrive**; absent tonsils/lymph nodes. | • **Absent thymic shadow** on chest X-ray.<br>• Markedly reduced/absent T cells (CD3+) and NK cells.<br>• **Definitive Treatment**: Emergent Allogeneic Hematopoietic Stem Cell Transplant (HSCT). |
| **X-Linked (Bruton) Agammaglobulinemia (XLA)** | Mutation in **Bruton Tyrosine Kinase (*BTK*)** gene $\\implies$ failure of pre-B cells to mature into naive B lymphocytes. | Males present after **$6\\text{ months}$** (loss of protective maternal IgG) with recurrent **sinopulmonary pyogenic bacterial infections** (*Streptococcus pneumoniae, Haemophilus influenzae*) and enteroviruses (*Coxsackie*). | • **Absent B cells (CD19+/CD20+ $<1\\%$)** in peripheral blood.<br>• **Pan-hypogammaglobulinemia** (all Ig classes severely reduced: IgG, IgA, IgM, IgE).<br>• Underdeveloped/absent germinal centers and tonsils. |
| **Common Variable Immunodeficiency (CVID)** | Defect in B-cell differentiation into mature antibody-secreting plasma cells. | Presents in **late childhood or young adulthood ($20 - 40\\text{ years}$)** with recurrent bronchiectasis, sinopulmonary infections, autoimmune cytopenias, and high risk of gastric cancer/lymphoma. | • **Normal number of peripheral B cells (CD19+)**, but **severely reduced plasma cells and low serum IgG/IgA/IgM**.<br>• Impaired vaccine antibody responses. |
| **Hyper-IgM Syndrome** | Most commonly **X-Linked CD40 Ligand (*CD40L / CD154*) defect on activated CD4+ T helper cells** $\\implies$ inability of T cells to trigger B-cell immunoglobulin class switching. | Recurrent sinopulmonary infections plus severe opportunistic infections: ***Pneumocystis jirovecii* pneumonia (PCP)** and *Cryptosporidium* biliary tract disease. | • **Elevated or normal IgM** with **severely deficient IgG, IgA, and IgE**.<br>• Flow cytometry: Absence of CD154 (CD40L) on activated T cells. |
| **Hyper-IgE (Job) Syndrome** | Autosomal dominant **$STAT3$ mutation** $\\implies$ impaired Th17 cell differentiation and neutrophil recruitment. | **FATED Triad**: Coarse **F**acies, "Cold" non-inflamed Staphylococcal **A**bscesses, Retained primary **T**eeth, High **E**levated IgE, and **D**ermatologic severe eczematoid dermatitis. | • **Serum IgE $>2000\\text{ IU/mL}$**.<br>• Eosinophilia. Low Th17 cell counts. |
| **Chronic Granulomatous Disease (CGD)** | Defect in **NADPH Oxidase (gp91phox / CYBB)** $\\implies$ inability of phagocytes to generate reactive oxygen species (ROS / $\\text{H}_2\\text{O}_2$) during respiratory burst. | Recurrent life-threatening infections and granuloma formation caused by **Catalase-Positive Organisms**: ***Staphylococcus aureus, Burkholderia cepacia, Serratia marcescens, Nocardia, Aspergillus***. | • **Dihydrorhodamine 123 (DHR) flow cytometry assay** (reduced/absent green rhodamine fluorescence).<br>• Negative Nitroblue Tetrazolium (NBT) dye reduction test (fails to turn blue). |
| **Wiskott-Aldrich Syndrome (WAS)** | X-Linked **$WAS$ gene mutation** $\\implies$ actin cytoskeleton reorganization defect in hematopoietic cells. | **WATER Triad**: **W**iskott-**A**ldrich, **T**hrombocytopenia with **characteristic microplatelets (small platelet volume)**, **E**czema, and **R**ecurrent infections. | • Low/normal IgG, low IgM, high IgA and IgE.<br>• Marked micro-thrombocytopenia ($<50,000/\\mu\\text{L}$ with low MPV). |
| **Ataxia-Telangiectasia** | Autosomal recessive mutation in **$ATM$ gene** $\\implies$ defective double-strand DNA break repair kinase. | Progressive cerebellar **ataxia** (wheelchair-bound by age 10), oculocutaneous **telangiectasias** (sclera/ears), recurrent sinopulmonary infections, extreme sensitivity to ionizing radiation, and high malignancy risk (lymphoma/leukemia). | • **Elevated serum Alpha-Fetoprotein (AFP)**.<br>• Selective IgA and IgG2 deficiency.<br>• Cerebellar vermis atrophy on MRI. |
| **C1 Esterase Inhibitor Deficiency** | Autosomal dominant defect in **C1 Inhibitor (*SERPING1*)** $\\implies$ uncontrolled activation of the kallikrein-kinin system. | **Hereditary Angioedema (HAE)**: Recurrent, non-pitting, **non-pruritic subcutaneous and submucosal edema** affecting the face, extremities, larynx (asphyxiation risk), and GI tract (severe colicky abdominal pain). **NO urticaria or pruritus!** | • **Elevated Bradykinin** (drives vascular permeability).<br>• **Low serum C4 levels** (best screening test even during remissions).<br>• Treatment: C1-INH concentrate, **Icatibant** (bradykinin B2 receptor antagonist), or **Ecallantide** (kallikrein inhibitor). Antihistamines and epinephrine are ineffective! |
| **Terminal Complement Deficiency (C5-C9)** | Failure of Membrane Attack Complex (MAC) pore assembly. | Recurrent, invasive, disseminated infections with **encapsulated *Neisseria* species** (*Neisseria meningitidis* meningococcemia and *Neisseria gonorrhoeae*). | • Markedly low/undetectable total hemolytic complement activity (**CH50 assay $<10\\%$**). |
`,
  clinicalVignettes: [
    {
      scenario: "A 4-year-old boy is brought to the pediatric immunology clinic with a history of recurrent right neck lymphadenitis requiring surgical drainage, perianal abscesses, and a prior episode of pneumonia caused by Burkholderia cepacia. Flow cytometric dihydrorhodamine 123 (DHR) oxidation testing shows no increase in green fluorescence in the patient's stimulated neutrophils compared to healthy controls.",
      question: "Which of the following biochemical defects is responsible for this child's clinical presentation and laboratory findings?",
      options: [
        "Deficiency of the phagocyte NADPH oxidase enzyme complex impairing hydrogen peroxide generation",
        "Mutations in Bruton tyrosine kinase preventing B-cell receptor signaling",
        "Impaired adenosine deaminase causing accumulation of toxic deoxyadenosine metabolites",
        "Loss of C1 esterase inhibitor activity leading to excess bradykinin generation"
      ],
      correctAnswerIndex: 0,
      explanation: "This child has Chronic Granulomatous Disease (CGD), most commonly caused by an X-linked recessive mutation in the gp91phox subunit of the phagocyte NADPH oxidase enzyme complex. Phagocytes can ingest pathogens but cannot generate the superoxide radicals and hydrogen peroxide required for intracellular bacterial and fungal killing. Catalase-positive organisms (e.g., S. aureus, Burkholderia cepacia, Serratia marcescens, Nocardia, Aspergillus) degrade endogenous bacterial hydrogen peroxide, surviving within phagocytes and triggering recurrent granulomatous infections. DHR 123 flow cytometry is the gold standard diagnostic test."
    }
  ]
};
