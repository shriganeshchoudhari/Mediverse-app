/**
 * Bacterial Toxins, Virulence Factors & Mechanisms Learning Content
 * Authoritative medical content derived from Jawetz, Murray, Levinson, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: MI2.5, MI2.6, MI2.7, MI3.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const BACTERIAL_TOXINS_MODULE: PhysiologyLessonModule = {
  id: "micr-toxins",
  unitCode: "MI2.5",
  title: "Bacterial Exotoxins, Superantigens, Endotoxin Shock & Virulence Mechanisms",
  competencies: ["MI2.5", "MI2.6", "MI2.7", "MI3.2"],
  estimatedMinutes: 125,
  organ3dTarget: "IMMUNOLOGY",
  markdownContent: `
# Bacterial Exotoxins, Superantigens, Endotoxin Shock & Virulence Mechanisms

Bacterial virulence factors include **A-B Subunit Exotoxins** (targeting protein synthesis, second messengers, or neurotransmitters), **Superantigens** (massive polyclonal T-cell activation), and **Lipopolysaccharide ($LPS$) Endotoxin** triggering septic shock.

---

## 1. Exotoxins vs Endotoxin (Lipid A)

| Property | Bacterial Exotoxins | Endotoxin (Lipid A of LPS) |
| :--- | :--- | :--- |
| **Source Organisms** | Secreted by both **Gram-Positive and Gram-Negative** species | Outer membrane component of **Gram-Negative bacteria ONLY** |
| **Chemical Structure** | Polypeptides / Proteins (heat-labile in most) | **Lipid A** moiety of Lipopolysaccharide (heat-stable at $100^\\circ\\text{C}$ for 1 hour) |
| **Location of Genes** | Plasmid or Lysogenic Bacteriophage DNA | Bacterial Chromosome |
| **Toxicity & Potency** | **Extremely high potency** (fatal dose in micrograms) | Moderate / Lower toxicity (microgram to milligram range) |
| **Immune & Vaccine Response** | Highly antigenic; toxoids induce protective neutralizing antibodies (**Toxoid Vaccines**: Tetanus, Diphtheria) | Weakly immunogenic; NO toxoids or effective vaccines |
| **Clinical Effects** | Distinct, specific organ manifestations (spastic paralysis, watery diarrhea, pseudomembrane) | General systemic inflammation: **Fever, Hypotension, Shock, DIC** via Macrophage ($IL\\text{-}1, TNF\\text{-}\\alpha$) & Complement ($C3a, C5a$) |

---

## 2. Molecular Mechanisms of Major Bacterial Exotoxins

### Category A: Inhibit Protein Synthesis via ADP-Ribosylation of Elongation Factor-2 (EF-2)
- **Diphtheria Toxin (*Corynebacterium diphtheriae*)**:
  - Inactivates **EF-2** via ADP-ribosylation $\\implies$ halts host cell translation $\\implies$ **Pharyngeal Gray Pseudomembrane**, bull-neck lymphadenopathy, myocarditis, and cranial nerve neuropathies.
- **Exotoxin A (*Pseudomonas aeruginosa*)**:
  - Exact same mechanism: inactivates **EF-2** via ADP-ribosylation $\\implies$ host cell death and dermal/pulmonary necrosis.

### Category B: Increase Intracellular Cyclic AMP ($cAMP$)
- **Cholera Toxin (*Vibrio cholerae*)**:
  - Permanently ADP-ribosylates and **activates $G_{\\alpha s}$** $\\implies$ locks adenylate cyclase in "ON" state $\\implies \\uparrow cAMP \\rightarrow$ continuous opening of $CFTR$ chloride channels $\\implies$ massive secretory **"Rice-Water" Diarrhea** (up to $20\\text{ L/day}$).
- **Heat-Labile Enterotoxin / LT (*Enterotoxigenic E. coli* / ETEC)**:
  - Same mechanism as cholera toxin: stimulates **$G_s \\rightarrow \\uparrow cAMP \\rightarrow \\uparrow Cl^-$ secretion** (*"Labile in the Air / cAMP, Stable on the Ground / cGMP"*).
- **Pertussis Toxin (*Bordetella pertussis*)**:
  - ADP-ribosylates and **inactivates $G_{\\alpha i}$** $\\implies$ prevents inhibition of adenylate cyclase $\\implies \\uparrow cAMP \\rightarrow$ impairs neutrophil recruitment $\\implies$ **Whooping Cough** and marked lymphocytosis.
- **Anthrax Edema Factor (*Bacillus anthracis*)**:
  - Mimics host adenylate cyclase enzyme directly ($\\uparrow cAMP \\implies$ severe tissue edema around black necrotic eschar).

### Category C: Neurotoxins Cleaving SNARE Proteins (Inhibit Neurotransmission)
- **Tetanospasmin (*Clostridium tetani*)**:
  - Cleaves **Synaptobrevin (VAMP SNARE)** $\\rightarrow$ blocks release of inhibitory neurotransmitters (**GABA and Glycine**) from Renshaw interneurons in spinal cord $\\implies$ **Spastic Paralysis**, **Trismus (Lockjaw)**, **Risus sardonicus**, and **Opisthotonos**.
- **Botulinum Toxin (*Clostridium botulinum*)**:
  - Cleaves **SNARE proteins** at the neuromuscular junction $\\rightarrow$ blocks release of stimulatory **Acetylcholine (ACh)** $\\implies$ **Flaccid Paralysis**, descending motor weakness, ptosis, diplopia, and floppy baby syndrome (from ingesting honey spores).

### Category D: Superantigens Causing Cytokine Storm
- **Toxic Shock Syndrome Toxin-1 (TSST-1 / *Staphylococcus aureus*)** & **Exotoxin A (*Streptococcus pyogenes*)**:
  - Crosslink the **$\\beta$-chain of T-Cell Receptor (TCR)** directly to **MHC Class II on APCs** outside the normal antigen peptide-binding groove.
  - Causes massive uncontrolled polyclonal activation of up to $20\\%$ of all CD4+ T-cells $\\implies$ overwhelming release of **$IL\\text{-}1, IL\\text{-}2, IL\\text{-}6, TNF\\text{-}\\alpha, IFN\\text{-}\\gamma$** $\\implies$ high fever, diffuse macular sunburn-like erythrodermic rash (desquamates on palms/soles), refractory hypotension, multi-organ failure.
`,
  clinicalVignettes: [
    {
      scenario: "A 19-year-old female presents to the emergency department on the fourth day of her menstrual period with sudden onset high fever (39.8 C), rigors, confusion, vomiting, and diffuse watery diarrhea. Blood pressure is 74/42 mmHg (severe hypotension) and heart rate is 138 bpm. Physical examination reveals a diffuse blanching sunburn-like erythematous rash over her trunk and extremities, including the palms and soles. She has been using high-absorbency tampons.",
      question: "Which of the following is the molecular mechanism of the bacterial toxin responsible for this condition?",
      options: [
        "Binding MHC Class II and T-cell Receptor variable beta-chain simultaneously (TSST-1 Superantigen)",
        "ADP-ribosylation of Elongation Factor-2 halting protein synthesis",
        "Cleavage of synaptobrevin SNARE proteins blocking glycine release",
        "Constitutive activation of Gs alpha subunit stimulating adenylate cyclase"
      ],
      correctAnswerIndex: 0,
      explanation: "Staphylococcal Toxic Shock Syndrome Toxin-1 (TSST-1) acts as a superantigen. By crosslinking the variable beta-chain of the T-cell receptor (TCR) directly to MHC Class II molecules on antigen-presenting cells outside the antigen-binding cleft, it induces massive polyclonal T-cell activation and cytokine storm (TNF-alpha, IL-1, IL-6, IFN-gamma), producing fever, diffuse rash with palm/sole desquamation, hypotension, and multi-organ failure."
    }
  ]
};
