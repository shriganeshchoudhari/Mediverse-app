/**
 * Clinical Immunology: Autoimmunity, HLA Associations & Immune Tolerance Breakdown
 * Authoritative medical content derived from Abbas' Cellular and Molecular Immunology (10th ed.), Harrison's Principles of Internal Medicine.
 * Mapped to NMC CBME Competencies: IM5.1, IM5.2, IM6.1, IM6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AUTOIMMUNITY_HLA_TOLERANCE_BREAKDOWN_MODULE: PhysiologyLessonModule = {
  id: "immunology-autoimmunity-hla-tolerance-breakdown",
  unitCode: "IM5.1",
  title: "Immunological Tolerance, HLA Class I/II Disease Associations & Autoantibody Profiles",
  competencies: ["IM5.1", "IM5.2", "IM6.1", "IM6.2"],
  estimatedMinutes: 150,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Immunological Tolerance, HLA Class I/II Disease Associations & Autoantibody Profiles

Autoimmunity arises from the failure of self-tolerance mechanisms, influenced by genetic susceptibility (particularly Human Leukocyte Antigen [HLA] alleles) and environmental triggers.

---

## 1. Central vs Peripheral Immune Tolerance

- **Central Tolerance**:
  - *T Cells (Thymus)*: Immature T cells that recognize self-antigens with high affinity undergo **negative selection (apoptosis)** or differentiate into regulatory T cells (Tregs). Mediated by **Autoimmune Regulator (*AIRE*)** gene transcription factor. *Mutation in AIRE $\\implies$ **APECED / APS-1** (Autoimmune Polyendocrinopathy-Candidiasis-Ectodermal Dystrophy)*.
  - *B Cells (Bone Marrow)*: High-affinity self-reactive B cells undergo **receptor editing** (re-expression of RAG-1/RAG-2 to rearrange light chains) or apoptosis.
- **Peripheral Tolerance**:
  - **Anergy**: Functional inactivation when a T cell encounters self-antigen (Signal 1) in the absence of costimulatory B7-CD28 signaling (Signal 2) or via inhibitory receptors (**CTLA-4** and **PD-1**).
  - **Regulatory T Cells (Tregs)**: Phenotype **$\\text{CD4}^+ \\text{CD25}^+ \\text{FoxP3}^+$**. Suppress autoreactive T cells via **IL-10 and TGF-$\\beta$** secretion. *Mutation in FoxP3 $\\implies$ **IPEX Syndrome** (Immune dysregulation, Polyendocrinopathy, Enteropathy, X-linked)*.
  - **Activation-Induced Cell Death (Fas/FasL)**: Repeated TCR stimulation upregulates Fas (CD95) and Fas Ligand (FasL), triggering caspase-8 extrinsic apoptosis. *Mutation in Fas/FasL $\\implies$ **Autoimmune Lymphoproliferative Syndrome (ALPS)** (lymphadenopathy, splenomegaly, autoimmune cytopenias, double-negative CD4-CD8- T cells)*.

---

## 2. High-Yield HLA Allele Disease Associations

| HLA Complex | Associated Allele | Major Clinical Autoimmune Disease Entities | Pathogenetic Significance & Relative Risk |
| :--- | :--- | :--- | :--- |
| **HLA Class I**<br>*(HLA-A, B, C)* | **HLA-B27** | **Seronegative Spondyloarthropathies ("PAIR")**:<br>• **P**soriatic Arthritis<br>• **A**nkylosing Spondylitis (sacroiliitis, bamboo spine; $\\text{RR} > 90$)<br>• **I**nflammatory Bowel Disease Spondyloarthritis<br>• **R**eactive Arthritis (can't see, can't pee, can't climb a tree) | Cytotoxic CD8+ T-cell presentation of arthritogenic self/microbial peptides. |
| **HLA Class II**<br>*(HLA-DP, DQ, DR)* | **HLA-DR4** | **Rheumatoid Arthritis (RA)**, Type 1 Diabetes Mellitus, Pemphigus vulgaris | Shared epitope in DRB1 hypervariable region presenting citrullinated peptides. |
| | **HLA-DR3** | **Type 1 Diabetes Mellitus**, Hashimoto Thyroiditis, Graves Disease, Addison Disease, SLE | Strong association with autoimmune endocrinopathies. |
| | **HLA-DQ2 / HLA-DQ8** | **Celiac Disease (Gluten-Sensitive Enteropathy)** | Preferential binding of deamidated **gliadin peptides** to DQ2/DQ8 on dendritic cells $\\implies$ CD4+ T-cell activation. Negative test effectively rules out Celiac disease ($99\\%$ NPV). |
| | **HLA-DR2** | **Multiple Sclerosis**, Goodpasture Syndrome, Systemic Lupus Erythematosus | Myelin basic protein presentation / collagen IV alpha-3 presentation. |

---

## 3. Authoritative Autoantibody Clinical Reference Matrix

| Autoantibody | Specific Target Antigen | Primary Associated Autoimmune Disease | Clinical Utility & Diagnostic Significance |
| :--- | :--- | :--- | :--- |
| **Anti-Nuclear Antibody (ANA)** | Nuclear macromolecular complexes | **Systemic Lupus Erythematosus (SLE)** | High sensitivity ($>95\\%$), low specificity. Best **screening test** for systemic autoimmune rheumatic diseases. |
| **Anti-dsDNA** | Double-stranded native DNA | **SLE (Lupus Nephritis)** | **Highly specific ($>98\\%$)**. Titers fluctuate with disease activity; correlates directly with active lupus nephritis. |
| **Anti-Smith (Anti-Sm)** | Core snRNP spliceosomal proteins | **SLE** | **Most specific autoantibody for SLE ($>99\\%$)**; does not fluctuate with disease activity. |
| **Anti-Histone** | Histone octamers | **Drug-Induced Lupus (DILE)** | Positive in $>95\\%$ of DILE caused by **Hydralazine, Procainamide, Isoniazid, Quinidine**. Anti-dsDNA is typically negative. |
| **Anti-CCP (ACPA)** | Cyclic Citrullinated Peptides | **Rheumatoid Arthritis (RA)** | **Most specific test for RA ($>95\\%$)**; predicts erosive joint progression; more specific than Rheumatoid Factor (IgM anti-IgG Fc). |
| **Anti-Ro / SSA & Anti-La / SSB** | Ribonucleoprotein particles | **Sjögren Syndrome** & Neonatal Lupus | Keratoconjunctivitis sicca + xerostomia. Maternal Anti-Ro causes **congenital complete heart block** in neonates. |
| **Anti-Centromere** | Kinetochore centromeric proteins | **Limited Cutaneous Systemic Sclerosis (CREST)** | **C**alcinosis, **R**aynaud, **E**sophageal dysmotility, **S**clerodactyly, **T**elangiectasia. Favorable prognosis; associated with isolated pulmonary arterial hypertension. |
| **Anti-Scl-70 (Anti-Topoisomerase I)** | DNA Topoisomerase I | **Diffuse Cutaneous Systemic Sclerosis** | Associated with widespread skin thickening and rapid progression of **pulmonary interstitial fibrosis** and renal crisis. |
| **Anti-Jo-1 (Anti-Histidyl tRNA Synthetase)** | Histidyl-tRNA synthetase | **Polymyositis / Dermatomyositis** | Marker for **Antisynthetase Syndrome**: myositis, interstitial lung disease, Raynaud, and hyperkeratotic "mechanic's hands". |
| **c-ANCA (Anti-PR3)** | Proteinase 3 (neutrophil granules) | **Granulomatosis with Polyangiitis (GPA / Wegener)** | Cytoplasmic pattern. Triad of necrotizing upper airway, cavitary lung lesions, and necrotizing crescentic pauci-immune glomerulonephritis. |
| **p-ANCA (Anti-MPO)** | Myeloperoxidase | **Microscopic Polyangiitis (MPA) & EGPA (Churg-Strauss)** | Perinuclear pattern. Necrotizing pauci-immune crescentic GN; EGPA has asthma + eosinophilia. |
`,
  clinicalVignettes: [
    {
      scenario: "A 31-year-old female presents with a 4-month history of symmetric morning stiffness lasting 2 hours in her metacarpophalangeal (MCP) and proximal interphalangeal (PIP) joints bilaterally, fatigue, and low-grade fevers. Physical examination reveals swollen, warm, tender MCP and wrist joints. Laboratory workup reveals an elevated erythrocyte sedimentation rate (ESR 68 mm/h) and a positive Rheumatoid Factor (1:160).",
      question: "Which of the following serologic autoantibodies is the MOST SPECIFIC for confirming the diagnosis and predicting progressive erosive joint damage?",
      options: [
        "Anti-Cyclic Citrullinated Peptide (Anti-CCP / ACPA)",
        "Anti-Nuclear Antibody (ANA)",
        "Anti-Double Stranded DNA (Anti-dsDNA)",
        "Anti-Histidyl-tRNA Synthetase (Anti-Jo-1)"
      ],
      correctAnswerIndex: 0,
      explanation: "Anti-Cyclic Citrullinated Peptide (Anti-CCP / ACPA) antibodies have a specificity exceeding 95-98% for Rheumatoid Arthritis (significantly higher than Rheumatoid Factor, which can be positive in Sjögren, hepatitis C, and subacute bacterial endocarditis). Furthermore, high titers of Anti-CCP strongly correlate with aggressive, erosive radiographic joint destruction and extra-articular manifestations."
    }
  ]
};
