/**
 * Immunology & Coombs Hypersensitivity Learning Content
 * Authoritative medical content derived from Abbas, Murray, Levinson, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: MI1.1, MI1.2, MI1.3, MI1.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const IMMUNOLOGY_HYPERSENSITIVITY_MODULE: PhysiologyLessonModule = {
  id: "micr-immunology",
  unitCode: "MI1.1",
  title: "Innate & Adaptive Immunity, Coombs Hypersensitivity Types I–IV & Immunodeficiencies",
  competencies: ["MI1.1", "MI1.2", "MI1.3", "MI1.4"],
  estimatedMinutes: 120,
  organ3dTarget: "IMMUNOLOGY",
  markdownContent: `
# Innate & Adaptive Immunity, Coombs Hypersensitivity Types I–IV & Immunodeficiencies

The immune system protects against diverse pathogens through rapid **Innate Immunity** (physical barriers, phagocytes, complement, natural killer cells) and antigen-specific **Adaptive Immunity** ($B$ and $T$ lymphocytes).

---

## 1. MHC Class I vs MHC Class II Antigen Presentation

| Feature | MHC Class I | MHC Class II |
| :--- | :--- | :--- |
| **Expressed On** | **All nucleated cells** (except erythrocytes and syncytiotrophoblast) | **Professional Antigen-Presenting Cells (APCs)**: Dendritic cells, Macrophages, B-cells |
| **Presents To** | **$CD8^+$ Cytotoxic T-cells** ($1 \\times 8 = 8$) | **$CD4^+$ Helper T-cells** ($2 \\times 4 = 8$) |
| **Antigen Origin** | **Endogenous / Cytosolic antigens** (viral proteins, mutated tumor antigens) | **Exogenous antigens** (phagocytosed bacteria, extracellular parasites) |
| **Loading Mechanism** | Degraded by proteasome $\\rightarrow$ transported into ER via **TAP (Transporter associated with Antigen Processing)** | Acidified endolysosome $\\rightarrow$ digested; **Invariant Chain (CLIP)** displaced by **HLA-DM** |
| **Genetic Loci** | **HLA-A, HLA-B, HLA-C** | **HLA-DP, HLA-DQ, HLA-DR** |

---

## 2. Coombs & Gell Hypersensitivity Reactions (Types I–IV)

Mnemonic: **ACID** (Type I = **A**naphylactic/Atopic, Type II = **C**ytotoxic antibody-mediated, Type III = **I**mmune-complex, Type IV = **D**elayed T-cell mediated).

| Type & Name | Primary Mediators & Mechanism | Pathophysiological Cascade | Classic Clinical Disease Examples |
| :--- | :--- | :--- | :--- |
| **Type I: Immediate / Anaphylactic** | **$IgE$ antibodies** bound to high-affinity $Fc\\epsilon RI$ receptors on **Mast cells & Basophils** | Antigen crosslinks $IgE$ $\\rightarrow$ rapid **degranulation** of preformed **Histamine, Tryptase**, and de novo synthesis of **Leukotrienes ($LTC_4, LTD_4, LTE_4$)** and Prostaglandin $PGD_2$ $\\implies$ vasodilation, vascular permeability, and smooth muscle bronchospasm. | • **Anaphylaxis** (food, insect sting, penicillin)<br>• **Allergic Asthma, Allergic Rhinitis**<br>• **Atopic Dermatitis (Eczema), Urticaria** |
| **Type II: Antibody-Mediated Cytotoxic** | **$IgM$ and $IgG$** directed against intrinsic cell-surface or tissue matrix antigens | Three Mechanisms:<br>1. **Opsonization & Phagocytosis / MAC lysis**: Hemolytic anemia, transfusion reaction.<br>2. **Complement-mediated inflammation**: Goodpasture.<br>3. **Receptor dysfunction**: Graves disease (stimulatory anti-TSH-R), Myasthenia Gravis (inhibitory anti-AChR). | • **Goodpasture Syndrome** (anti-GBM / $\\alpha_3$ Type IV collagen)<br>• **Myasthenia Gravis** (anti-AChR)<br>• **Graves Disease** (anti-TSH receptor)<br>• **Rheumatic Fever** (molecular mimicry anti-M protein)<br>• **Hemolytic Disease of the Fetus/Newborn** ($Rh$ incompatibility) |
| **Type III: Immune-Complex Mediated** | Soluble **Antigen-Antibody ($IgG/IgM$) Complexes** deposited in microvascular beds | Circulating immune complexes deposit in capillary walls (subendothelial/mesangial) $\\rightarrow$ activate classical complement ($C3a, C5a$) $\\rightarrow$ recruit neutrophils $\\rightarrow$ release lysosomal enzymes causing **Fibrinoid Necrosis** and vasculitis. | • **Systemic Lupus Erythematosus (SLE)** (anti-dsDNA)<br>• **Post-Streptococcal Glomerulonephritis**<br>• **Polyarteritis Nodosa** (PAN)<br>• **Serum Sickness** (fever, urticaria, arthralgia 7-10d post-foreign protein/serum)<br>• **Arthus Reaction** (local dermal vasculitis) |
| **Type IV: Delayed-Type Cell-Mediated** | **Sensitized $T$-cells** ($CD4^+$ Th1/Th17 and $CD8^+$ CTLs); **NO Antibodies** | Prior sensitized $CD4^+$ Th1 cells encounter antigen $\\rightarrow$ secrete **$IFN\\text{-}\\gamma$** and **$TNF\\text{-}\\alpha$** $\\rightarrow$ activate macrophages $\\rightarrow$ tissue injury, granuloma formation, or $CD8^+$ direct cytotoxic killing. (*Takes 24–72 hours*). | • **Contact Dermatitis** (Poison Ivy / Urushiol, Nickel, Neomycin)<br>• **Tuberculin PPD Skin Test**<br>• **Multiple Sclerosis, Guillain-Barré Syndrome**<br>• **Type 1 Diabetes Mellitus** (islet $\\beta$-cell destruction)<br>• **Graft-versus-Host Disease (GVHD)** |

---

## 3. Primary Immunodeficiency Syndromes

| Syndrome | Gene Defect & Inheritance | Immunological Breakdown | Clinical Presentation & Pathognomonic Triad |
| :--- | :--- | :--- | :--- |
| **X-Linked (Bruton) Agammaglobulinemia (XLA)** | **$BTK$ (Bruton Tyrosine Kinase)** defect (X-Linked Recessive) | Impaired B-cell maturation ($pre\\text{-}B \\rightarrow immature\\text{ }B$); **Absent mature CD19/CD20 B-cells**, virtually undetectable all immunoglobulin classes ($IgG, IgA, IgM$) | Infant boy ($>6$ months as maternal $IgG$ wanes) with **recurrent sinopulmonary bacterial infections** (*S. pneumoniae*, *H. influenzae*) and enteroviral infections; **absent tonsils and germinal centers**. |
| **Severe Combined Immunodeficiency (SCID)** | **Common $\\gamma$-chain of $IL\\text{-}2R$** (X-linked) or **Adenosine Deaminase (ADA)** (Autosomal Recessive) | Complete failure of both **$T$-cell and $B$-cell immunity**; absent thymic shadow on chest radiograph | Severe recurrent **bacterial, viral, fungal (*Pneumocystis jirovecii*, *Candida*), and protozoal infections**, chronic diarrhea, failure to thrive. *Emergency bone marrow transplant required*. |
| **DiGeorge Syndrome (22q11.2 Deletion)** | Failure of **3rd and 4th Pharyngeal Pouches** to develop | Absent thymus (loss of $T$-cells) and absent parathyroids (hypocalcemia) | **CATCH-22 Triad**: **C**ardiac defects (Tetralogy of Fallot, Truncus Arteriosus), **A**bnormal facies, **T**hymic hypoplasia (recurrent viral/fungal infections), **C**left palate, **H**ypocalcemia / Tetany. |
| **Hyper-IgM Syndrome** | Defective **$CD40L$ on $CD4^+$ T-helper cells** (X-linked) | Inability of B-cells to undergo **Class-Switch Recombination**; high/normal $IgM$ with profound deficiency of $IgG, IgA, IgE$ | Severe pyogenic bacterial infections and opportunistic infections (*Pneumocystis jirovecii*, *Cryptosporidium*). |
| **Wiskott-Aldrich Syndrome (WAS)** | **$WAS$ gene mutation** (X-linked; actin cytoskeleton defect in leukocytes/platelets) | Progressive loss of cellular and humoral immunity; defective antigen presentation | **WATER Triad**: **W**iskott-**A**ldrich: **T**hrombocytopenia (petechiae, purpura, microplatelets), **E**czema, **R**ecurrent pyogenic infections. High $IgE$ and $IgA$, low $IgM$. |
`,
  clinicalVignettes: [
    {
      scenario: "A 9-month-old male infant presents with his third episode of Streptococcus pneumoniae bacteremia and otitis media. Physical examination reveals absent pharyngeal tonsils and no palpable peripheral lymph nodes. Complete blood count reveals normal absolute lymphocyte count, but flow cytometry demonstrates total absence of CD19+ and CD20+ circulating B-cells. Quantitative serum immunoglobulins reveal IgG 42 mg/dL (markedly low), IgA undetectable, and IgM undetectable.",
      question: "Which of the following genes is mutated in this patient?",
      options: [
        "Bruton Tyrosine Kinase (BTK / X-Linked Agammaglobulinemia)",
        "Adenosine Deaminase (ADA / SCID)",
        "CD40 Ligand (Hyper-IgM Syndrome)",
        "WAS Gene (Wiskott-Aldrich Syndrome)"
      ],
      correctAnswerIndex: 0,
      explanation: "X-Linked Agammaglobulinemia (Bruton disease) is caused by mutations in the BTK (Bruton Tyrosine Kinase) gene, blocking B-cell pre-B differentiation in bone marrow. This results in absent circulating CD19/CD20 B-cells, profound hypogammaglobulinemia across all classes (IgG, IgA, IgM), absent tonsils/germinal centers, and recurrent pyogenic sinopulmonary bacterial infections after 6 months of age."
    }
  ]
};
