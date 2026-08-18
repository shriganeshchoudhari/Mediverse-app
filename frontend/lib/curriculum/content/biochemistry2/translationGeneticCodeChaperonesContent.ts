/**
 * Medical Biochemistry II: Translation, Genetic Code, Protein Folding & Chaperones
 * Authoritative molecular biochemistry content derived from Harper's (32nd ed.), Lehninger (8th ed.).
 * Mapped to NMC CBME Competencies: BI6.1, BI6.2, PA4.3, PE12.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TRANSLATION_GENETIC_CODE_CHAPERONES_MODULE: PhysiologyLessonModule = {
  id: "biochemistry2-translation-genetic-code-chaperones",
  unitCode: "BI6.1",
  title: "Translation & Chaperones: Genetic Code Degeneracy, Diphtheria Toxin (eEF-2), Proteasome (Bortezomib) & Prions (PrPSc)",
  competencies: ["BI6.1", "BI6.2", "PA4.3", "PE12.3"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Translation, Genetic Code, Protein Folding & Ubiquitin-Proteasome Degradation

Protein synthesis operates under the universal degenerate genetic code, regulated by molecular chaperones, elongation factor targets of bacterial toxins, and targeted ubiquitin-mediated proteolysis.

---

## 1. Genetic Code Features \u0026 Translational Toxins

$$\\begin{array}{lcccc}
\\hline
\\textbf{Feature / Toxin} & \\textbf{Biochemical Mechanism} & \\textbf{Molecular Target} & \\textbf{Clinical / Physiological Impact} \\\\
\\hline
\\textbf{Code Degeneracy} & \\text{61 sense codons specify 20 amino acids} & 3'\\text{ codon / } 5'\\text{ anticodon wobble position} & \\mathbf{\\text{Silent (synonymous) mutations do not}} \\\\
(\\textbf{Redundancy}) & (\\text{wobble hypothesis: G-U, I-U/C/A pairs}) & (\\text{Crick wobble base pairing}) & \\mathbf{\\text{alter primary amino acid sequence}} \\\\
\\textbf{Start Codon} & \\mathbf{5'\\text{-AUG-3'} \\text{ in Kozak / Shine-Dalgarno}} & \\text{Initiator tRNA (Met in euk, fMet in prok)} & \\text{Establishes correct open reading frame} \\\\
\\textbf{Stop Codons} & \\mathbf{5'\\text{-UAA-3'}, 5'\\text{-UAG-3'}, 5'\\text{-UGA-3'}} & \\text{Release Factors (eRF1 in eukaryotes)} & \\text{Nonsense mutation causes premature stop} \\\\
\\textbf{Diphtheria Toxin} & \\mathbf{\\text{ADP-ribosylates diphthamide residue}} & \\mathbf{\\text{Eukaryotic Elongation Factor 2 (eEF-2)}} & \\mathbf{\\text{Halts translation } \\rightarrow \\text{ pseudomembranous}} \\\\
(C. diphtheriae) & \\text{using } NAD^+ \\text{ cofactor} & & \\mathbf{\\text{pharyngitis, myocarditis, neuropathy}} \\\\
\\textbf{Exotoxin A} & \\mathbf{\\text{Identical ADP-ribosylation of eEF-2}} & \\mathbf{\\text{Eukaryotic Elongation Factor 2 (eEF-2)}} & \\mathbf{\\text{Host tissue necrosis in P. aeruginosa}} \\\\
(P. aeruginosa) & & & (\\text{ecthyma gangrenosum, ventilator pneumonia}) \\\\
\\hline
\\end{array}$$

---

## 2. Molecular Chaperones, Ubiquitin-Proteasome \u0026 Prion Pathology

- **Molecular Chaperones (HSP70 / HSP90)**:
  - ATP-dependent molecular machines that bind exposed hydrophobic patches on nascent or unfolded polypeptides, preventing aggregation and assisting correct folding.
- **Ubiquitin-Proteasome System (UPS)**:
  1. **E1 (Ubiquitin-Activating Enzyme)**: Activates ubiquitin in an ATP-dependent reaction.
  2. **E2 (Ubiquitin-Conjugating Enzyme)**: Trans-esterifies activated ubiquitin.
  3. **E3 (Ubiquitin Ligase)**: Recognizes degradation degrons on target substrates and transfers ubiquitin to lysine-48 ($K48$) residues.
  4. **26S Proteasome**: Cleaves polyubiquitinated proteins into small oligopeptides; pharmacologically inhibited by **Bortezomib** (induces toxic unfolded protein stress in multiple myeloma plasma cells).
- **Prion Protein Conformational Conversion ($PrP^C \\rightarrow PrP^{Sc}$)**:
  - Normal cellular prion protein ($PrP^C$) possesses predominantly $\\alpha$-helical structure and is protease-sensitive.
  - Pathological infectious scrapie prion ($PrP^{Sc}$) undergoes post-translational refolding into insoluble, **$\\beta$-sheet enriched sheets that are resistant to Proteinase K digestion**.
  - Triggers spongiform encephalopathy, rapid neurodegeneration, and myoclonus in **Creutzfeldt-Jakob Disease (CJD)**.
`,
  clinicalVignettes: [
    {
      scenario: "A 5-year-old unimmunized child from an underserved region presents with a 4-day history of sore throat, low-grade fever, dysphagia, and marked neck swelling ('bull neck' appearance). Physical examination reveals a thick, leathery, dirty-gray pseudomembrane covering the tonsils, uvula, and posterior pharynx that bleeds profusely when dislodged with a tongue depressor. Over the next 48 hours, the child develops electrocardiographic ST-T changes, cardiac arrhythmias, and bilateral vocal cord palsy. Blood tests confirm toxigenic Corynebacterium diphtheriae infection.",
      question: "What is the precise biochemical mechanism by which Diphtheria Toxin causes host cellular toxicity and tissue death?",
      options: [
        "ADP-ribosylation and irreversible inactivation of Eukaryotic Elongation Factor 2 (eEF-2) using NAD+ as a substrate, completely halting ribosomal translation and host protein synthesis",
        "Cleavage of 28S ribosomal RNA halting elongation",
        "Inhibition of peptidyltransferase in 60S ribosomal subunit",
        "Cleavage of SNAP-25 preventing exocytosis"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic toxic Diphtheria: (1) Toxin Mechanism: Diphtheria toxin (an A-B exotoxin encoded by the tox gene on a lysogenic beta-corynephage) catalyzes the transfer of an ADP-ribose moiety from NAD+ to a modified histidine residue (diphthamide) on Eukaryotic Elongation Factor 2 (eEF-2); (2) Impact on Translation: ADP-ribosylated eEF-2 is permanently inactivated, preventing ribosome translocation along mRNA and shutting down protein synthesis, resulting in mucosal necrosis (pseudomembrane), toxic myocarditis, and cranial neuropathies; (3) Identical Mechanism: Pseudomonas aeruginosa Exotoxin A utilizes an identical ADP-ribosylation of eEF-2."
    }
  ]
};
