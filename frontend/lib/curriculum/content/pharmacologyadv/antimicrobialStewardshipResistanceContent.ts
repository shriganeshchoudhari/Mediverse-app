/**
 * Clinical Pharmacology: Antimicrobial Stewardship, Beta-Lactamases & Resistance
 * Authoritative medical content derived from Sanford Guide, Goodman & Gilman's (14th ed.).
 * Mapped to NMC CBME Competencies: PH1.3, PH1.4, MD37.2, SU35.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANTIMICROBIAL_STEWARDSHIP_RESISTANCE_MODULE: PhysiologyLessonModule = {
  id: "pharmacology-adv-antimicrobial-stewardship",
  unitCode: "PH3.1",
  title: "Antimicrobial Stewardship: ESBL, MRSA PBP2a, Pseudomonas & Novel Beta-Lactamase Inhibitors",
  competencies: ["PH1.3", "PH1.4", "MD37.2", "SU35.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Antimicrobial Stewardship & Multidrug-Resistant Pathogens

Rational antimicrobial therapy balances broad-spectrum empiric coverage against targeted de-escalation to limit selection pressure for multi-drug resistant (MDR) pathogens.

---

## 1. Mechanisms of High-Yield Bacterial Resistance

$$\\begin{array}{lccc}
\\hline
\\textbf{MDR Pathogen / Enzyme} & \\textbf{Resistance Mechanism} & \\textbf{Ineffective Antibiotics} & \\textbf{Drug of Choice (DOC)} \\\\
\\hline
\\textbf{MRSA (Methicillin-Resistant)} & \\mathbf{\\text{Altered PBP2a (encoded by mecA)}} & \\text{All Beta-lactams (except Ceftaroline)} & \\mathbf{\\text{Vancomycin, Daptomycin, Linezolid, Ceftaroline}} \\\\
\\textbf{ESBL (Extended-Spectrum)} & \\text{Hydrolyzes Penicillins \u0026 Cephalosporins} & \\text{Ceftriaxone, Cefotaxime, Cefepime} & \\mathbf{\\text{Carbapenems (Meropenem), Ceftolozane-Tazobactam}} \\\\
\\textbf{CRE (Carbapenem-Resistant)} & \\text{KPC, NDM-1, OXA-48 carbapenemases} & \\text{Meropenem, Imipenem, Ertapenem} & \\mathbf{\\text{Ceftazidime-Avibactam, Meropenem-Vaborbactam}} \\\\
\\textbf{Pseudomonas aeruginosa} & \\text{Efflux pumps (MexAB), Porin loss (OprD)} & \\text{Standard beta-lactams} & \\mathbf{\\text{Pip-Tazo, Cefepime, Meropenem, Ceftazidime}} \\\\
\\textbf{VRE (Vancomycin-Resistant)} & \\text{D-Ala-D-Ala } \\rightarrow \\mathbf{\\text{D-Ala-D-Lac}} & \\text{Vancomycin, Teicoplanin} & \\mathbf{\\text{Linezolid, Daptomycin}} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Antibiotic Pearls & Toxicities

- **Daptomycin**:
  - Lipopeptide inserting into bacterial cell membrane causing rapid depolarization and potassium efflux.
  - **Surfactant Inactivation**: Pulmonary surfactant binds and inactivates Daptomycin $\\rightarrow$ **CONTRAINDICATED IN MRSA PNEUMONIA!**
  - Monitor: Serum Creatine Kinase (CK) weekly for drug-induced **Rhabdomyolysis and Myopathy**.
- **Linezolid**:
  - Oxazolidinone binding the 50S ribosomal subunit preventing 70S initiation complex formation.
  - **Monoamine Oxidase (MAO) Inhibition**: Risk of fatal **Serotonin Syndrome** when co-administered with SSRIs/SNRIs.
  - **Bone Marrow Suppression**: Thrombocytopenia and anemia with courses $>14\\text{ days}$; irreversible peripheral/optic neuropathy $>28\\text{ days}$.
- **Vancomycin**:
  - Glycopeptide binding D-Ala-D-Ala terminus of peptidoglycan cell wall precursors.
  - **Red Man Syndrome**: Non-IgE histamine release from mast cells during rapid IV infusion $\rightarrow$ prevent by slowing infusion rate to $\\ge 60\\text{ minutes}$ and pre-treating with antihistamines.
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old female intubated in the intensive care unit develops hospital-acquired pneumonia (HAP). Endotracheal aspirate culture grows 4+ Methicillin-Resistant Staphylococcus aureus (MRSA) with an oxacillin MIC >=8 mcg/mL and a Vancomycin MIC of 4 mcg/mL (Vancomycin-Intermediate S. aureus, VISA). The ICU resident suggests initiating intravenous Daptomycin 8 mg/kg daily.",
      question: "Why is intravenous Daptomycin strictly contraindicated in this patient, and which of the following is the most appropriate alternative MRSA therapy?",
      options: [
        "Daptomycin is bound and sequestered by pulmonary alveolar surfactant, rendering it clinically ineffective in pneumonia; initiate Linezolid (600 mg IV q12h) or Ceftaroline",
        "Daptomycin causes fatal bronchospasm within minutes of infusion; initiate oral Metronidazole",
        "Daptomycin requires anaerobic conditions in lung tissue; initiate Azithromycin monotherapy",
        "Daptomycin undergoes 100% pulmonary clearance on first-pass circulation; initiate Ciprofloxacin"
      ],
      correctAnswerIndex: 0,
      explanation: "Daptomycin is an outstanding bactericidal agent for MRSA bacteremia and right-sided endocarditis, but it is STRICTLY CONTRAINDICATED in pneumonia because it is bound, sequestered, and inactivated by pulmonary surfactant within alveolar spaces. For VISA or MRSA pneumonia, appropriate alternative agents include Linezolid (an oxazolidinone that achieves high epithelial lining fluid concentrations in the lung) or Ceftaroline (a 5th-generation cephalosporin with high affinity for PBP2a)."
    }
  ]
};
