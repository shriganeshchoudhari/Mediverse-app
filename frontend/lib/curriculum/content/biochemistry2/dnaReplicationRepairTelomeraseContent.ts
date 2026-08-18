/**
 * Medical Biochemistry II: DNA Replication, Repair Pathways & Telomerase Dynamics
 * Authoritative molecular biochemistry content derived from Harper's (32nd ed.), Lehninger (8th ed.).
 * Mapped to NMC CBME Competencies: BI2.1, BI2.2, PA4.1, PE12.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DNA_REPLICATION_REPAIR_TELOMERASE_MODULE: PhysiologyLessonModule = {
  id: "biochemistry2-dna-replication-repair-telomerase",
  unitCode: "BI2.1",
  title: "DNA Replication & Repair: Telomerase (TERT), Xeroderma Pigmentosum (NER), Lynch Syndrome (MMR) & BRCA1/2 (HR)",
  competencies: ["BI2.1", "BI2.2", "PA4.1", "PE12.1"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# DNA Replication, Repair Pathways & Telomerase Dynamics

High-fidelity DNA replication and genomic surveillance systems prevent mutagenic catastrophe, cancer predisposition syndromes, and replicative cellular senescence.

---

## 1. Major DNA Repair Pathways \u0026 Associated Clinical Syndromes

$$\\begin{array}{lcccc}
\\hline
\\textbf{DNA Repair Pathway} & \\textbf{Target Lesion / Damage} & \\textbf{Key Enzymatic Machinery} & \\textbf{Cell Cycle Phase} & \\textbf{Clinical Disease / Syndrome} \\\\
\\hline
\\textbf{Nucleotide Excision} & \\mathbf{\\text{Bulky helix-distorting pyrimidine}} & \\mathbf{\\text{Endonucleases, DNA Pol } \\delta/\\epsilon,} & \\mathbf{G_1\\text{ Phase}} & \\mathbf{\\text{XERODERMA PIGMENTOSUM: Extreme}} \\\\
\\textbf{Repair (NER)} & (\\text{thymine-thymine})\\text{ UV dimers} & \\text{DNA Ligase I} & & \\mathbf{\\text{photosensitivity, freckling, skin cancers}} \\\\
\\textbf{Base Excision} & \\text{Spontaneous deamination} & \\mathbf{\\text{DNA Glycosylase } \\rightarrow \\text{ AP-Endonuclease}} & \\text{Throughout cell cycle} & \\text{Protects against spontaneous base oxidation} \\\\
\\textbf{Repair (BER)} & (\\text{cytosine } \\rightarrow \\text{ uracil, oxidation}) & \\rightarrow \\text{ AP-Lyase } \\rightarrow \\text{ Pol } \\beta \\rightarrow \\text{ Ligase} & & (\\text{e.g., 8-oxoguanine repair}) \\\\
\\textbf{Mismatch Repair} & \\mathbf{\\text{Mismatched nucleotides \u0026 small}} & \\mathbf{\\text{MSH2, MLH1, MSH6, PMS2;}} & \\mathbf{S / G_2\\text{ Phase}} & \\mathbf{\\text{LYNCH SYNDROME (HNPCC):}} \\\\
(\\textbf{MMR}) & \\text{insertion/deletion loops} & \\text{Exonuclease I, DNA Pol } \\delta & & \\mathbf{\\text{Microsatellite Instability (MSI-H), colon ca}} \\\\
\\textbf{Homologous} & \\mathbf{\\text{Double-strand DNA breaks}} & \\mathbf{\\text{BRCA1, BRCA2, RAD51, PALB2;}} & \\mathbf{S / G_2\\text{ Phase (uses}} & \\mathbf{\\text{Hereditary Breast/Ovarian Cancer (HBOC);}} \\\\
\\textbf{Recombination (HR)} & & \\text{error-free homologous repair} & \\text{sister chromatid)} & \\mathbf{\\text{Sensitivity to PARP Inhibitors (Olaparib)}} \\\\
\\textbf{Non-Homologous} & \\mathbf{\\text{Double-strand DNA breaks}} & \\mathbf{\\text{Ku70/Ku80, DNA-PKcs, Artemis,}} & \\mathbf{G_0 / G_1\\text{ Phase (no}} & \\mathbf{\\text{ATAXIA-TELANGIECTASIA (ATM gene):}} \\\\
\\textbf{End Joining (NHEJ)} & & \\text{DNA Ligase IV / XRCC4 (error-prone)} & \\text{homologous template)} & \\text{Cerebellar ataxia, radiation sensitivity, IgA } \\darr \\\\
\\hline
\\end{array}$$

---

## 2. Telomerase Dynamics \u0026 Synthetic Lethality with PARP Inhibitors

- **Telomerase Architecture \u0026 Function**:
  - Specialized ribonucleoprotein enzyme composed of **TERT (Telomerase Reverse Transcriptase)** and **TERC (RNA template)**.
  - Adds repetitive non-coding hexanucleotide repeats (**$5'\\text{-TTAGGG-3'}$**) to the $3'$ hydroxyl overhang of eukaryotic chromosomes, solving the "end-replication problem."
  - Inactive in somatic cells (leads to Hayflick limit and replicative senescence); **reactivated in $>85-90\\%$ of human malignancies**.
- **Synthetic Lethality (BRCA1/2 Mutation and PARP Inhibition)**:
  - **PARP (Poly[ADP-ribose] Polymerase)** repairs single-strand DNA breaks via Base Excision Repair.
  - When PARP is pharmacologically inhibited by **Olaparib**, unrepaired single-strand breaks collapse replication forks into double-strand breaks.
  - Normal cells repair double-strand breaks via homologous recombination (intact BRCA1/2).
  - In **BRCA1/2-deficient tumor cells**, double-strand breaks cannot be repaired, leading to catastrophic genomic instability and selective cancer cell apoptosis (**Synthetic Lethality**).
`,
  clinicalVignettes: [
    {
      scenario: "A 4-year-old child is brought to the dermatology clinic by his parents because of extreme skin sensitivity to sunlight. Even after minimal sun exposure for 10 minutes, he develops severe blistering sunburns, extensive freckling (ephelides), and hyperpigmented macules across his face, arms, and neck. Skin examination reveals multiple dry, atrophic, scaling plaques and a suspicious hyperkeratotic nodule on his nose, which on punch biopsy is confirmed to be an invasive Squamous Cell Carcinoma (SCC). Cultured dermal fibroblasts from the patient are irradiated with ultraviolet (UV-C) light in vitro, revealing a complete inability to excise thymine-thymine cyclobutane pyrimidine dimers from genomic DNA.",
      question: "What is the diagnosis, and what specific DNA repair enzymatic mechanism is defective in this patient?",
      options: [
        "Xeroderma Pigmentosum; defective Nucleotide Excision Repair (NER) caused by deficiency of UV-specific repair endonucleases that normally excise bulky pyrimidine dimers during the G1 cell cycle phase",
        "Lynch Syndrome; defective Mismatch Repair (MSH2/MLH1)",
        "Ataxia-Telangiectasia; defective Non-Homologous End Joining (NHEJ)",
        "Fanconi Anemia; defective interstrand crosslink repair"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical and molecular presentation of Xeroderma Pigmentosum (XP): (1) Pathophysiology: Autosomal recessive defect in Nucleotide Excision Repair (NER) genes (e.g., XPA through XPG), which encode specialized endonucleases responsible for recognizing and excising bulky, helix-distorting pyrimidine dimers (such as UV-induced thymine-thymine cyclobutane dimers) in the G1 phase of the cell cycle; (2) Clinical Hallmarks: Severe photosensitivity, early severe solar freckling, progressive poikiloderma, corneal ulceration, and a >1,000-fold increased risk of developing cutaneous malignancies (melanoma, basal cell carcinoma, and squamous cell carcinoma) in early childhood; (3) Contrast with other repair pathways: Base Excision Repair (BER) removes small non-bulky damaged bases via glycosylases, while Mismatch Repair (MMR) corrects replication errors (Lynch syndrome)."
    }
  ]
};
