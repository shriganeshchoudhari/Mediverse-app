/**
 * Antimicrobial Chemotherapy & Mechanisms Learning Content
 * Authoritative medical content derived from Katzung, Goodman & Gilman, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: PH3.1, PH3.2, PH3.3, PH3.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANTIMICROBIAL_CHEMOTHERAPY_MODULE: PhysiologyLessonModule = {
  id: "pharm-antimicrobials",
  unitCode: "PH3.1",
  title: "Antimicrobial Chemotherapy: Mechanisms of Action, Resistance & Iconic Toxicities",
  competencies: ["PH3.1", "PH3.2", "PH3.3", "PH3.4"],
  estimatedMinutes: 135,
  organ3dTarget: "IMMUNOLOGY",
  markdownContent: `
# Antimicrobial Chemotherapy: Mechanisms of Action, Resistance & Iconic Toxicities

Antimicrobial pharmacology is structured around selective biochemical targets: **Bacterial Cell Wall Synthesis**, **Ribosomal Protein Synthesis (30S vs 50S)**, **Nucleic Acid Synthesis (DNA/RNA)**, and **Folic Acid Metabolism**.

---

## 1. Ribosomal Protein Synthesis Inhibitors Mnemonic: **Buy AT 30, CCEELL at 50**

- **30S Subunit Inhibitors (AT)**:
  - **A = Aminoglycosides** (Gentamicin, Tobramycin, Amikacin):
    - Irreversibly bind 30S ribosomal subunit $\\rightarrow$ block initiation complex and induce misreading of mRNA. Requires oxygen for uptake into bacteria (*ineffective against anaerobes!*).
    - **Adverse Effects (NNOT)**: **N**ephrotoxicity (acute tubular necrosis), **N**euromuscular blockade, **O**totoxicity (vestibular & cochlear damage), **T**eratogen (deafness in fetus).
  - **T = Tetracyclines** (Doxycycline, Minocycline):
    - Reversibly bind 30S subunit $\\rightarrow$ prevent attachment of aminoacyl-tRNA to the A-site.
    - **Adverse Effects**: **Tooth discoloration & enamel hypoplasia** in children $<8$ years, bone growth inhibition in pregnancy/infants, photosensitivity, pill-induced esophagitis.

- **50S Subunit Inhibitors (CCEELL)**:
  - **C = Chloramphenicol**: Blocks peptidyltransferase. Toxicities: **Gray Baby Syndrome** (deficient UDP-glucuronyltransferase in neonates) and dose-independent **Aplastic Anemia**.
  - **C = Clindamycin**: Blocks peptide transfer (translocation) at 50S. Classic use: Anaerobes above diaphragm (*Bacteroides, Clostridium perfringens*). Toxicities: **Pseudomembranous Colitis (*Clostridioides difficile*)**.
  - **E = Erythromycin / Macrolides** (Azithromycin, Clarithromycin): Bind 50S and inhibit translocation. Toxicities: **MACRO Mnemonic**: **M**otility stimulation (gastrointestinal cramps), **A**rrhythmia (prolonged QT interval / Torsades), **C**holestatic jaundice, **R**ash, e**O**sinophilia, potent CYP3A4 inhibition (except Azithromycin).
  - **L = Linezolid**: Binds 50S (23S rRNA) preventing 70S initiation complex formation. Iconic uses: **MRSA** and **VRE**. Toxicities: Bone marrow suppression (**thrombocytopenia**), peripheral/optic neuropathy, **Serotonin Syndrome** when combined with SSRIs (weak MAOI activity).

---

## 2. Cell Wall Synthesis Inhibitors ($\\beta$-Lactams & Glycopeptides)

| Drug Class | Mechanism of Action | Spectrum & Clinical Applications | Iconic Adverse Effects & Resistance |
| :--- | :--- | :--- | :--- |
| **Penicillins** (Penicillin G/V, Ampicillin, Amoxicillin, Piperacillin) | Bind **Penicillin-Binding Proteins (PBPs / Transpeptidases)** $\\rightarrow$ block peptidoglycan crosslinking | Gram-positives, *Treponema pallidum* (syphilis), *Listeria* (Ampicillin), *Pseudomonas* (Piperacillin-Tazobactam) | • Hypersensitivity (Type I anaphylaxis and Type II/III reactions).<br>• Resistance: Bacterial $\\beta$-lactamases (overcome by Clavulanic acid, Tazobactam). |
| **Cephalosporins (1st–5th Gen)** | Bind PBPs; Resistant to many $\\beta$-lactamases | • 1st Gen (Cefazolin): Surgical prophylaxis, MSSA.<br>• 3rd Gen (Ceftriaxone, Ceftazidime): Meningitis, Gonorrhea, *Pseudomonas*.<br>• 4th Gen (Cefepime): Broad Gram $+/-$ & *Pseudomonas*.<br>• 5th Gen (Ceftaroline): **Active against MRSA!** | • Disulfiram-like reaction with ethanol (Cefotetan).<br>• Vitamin K deficiency / bleeding (hypoprothrombinemia).<br>• Ceftriaxone biliary sludging. |
| **Carbapenems** (Meropenem, Imipenem-Cilastatin) | Extremely broad-spectrum $\\beta$-lactamase resistant PBPs blocker | Life-threatening multi-drug resistant nosocomial infections; ESBL producers | • **Seizure risk** (especially Imipenem in renal insufficiency); Cilastatin inhibits renal dehydropeptidase-I. |
| **Monobactams** (Aztreonam) | Binds PBP3 of Gram-negative aerobic rods ONLY; no Gram-positive or anaerobic coverage | **Gram-negative rods in patients with severe Penicillin/Cephalosporin allergy** (NO cross-reactivity!) | Well-tolerated; occasional GI upset or rash. |
| **Glycopeptides** (Vancomycin) | Binds **D-Ala-D-Ala terminus** of cell wall precursors $\\rightarrow$ sterically inhibits transglycosylase | **MRSA**, *S. epidermidis*, Enterococci, Oral for refractory *C. difficile* colitis | • **Red Man Syndrome** (rate-dependent histamine release; prevented by slow infusion + antihistamines).<br>• Nephrotoxicity and Ototoxicity (NOT Mnemonic).<br>• Resistance: Mutation of D-Ala-D-Ala to **D-Ala-D-Lac**. |

---

## 3. DNA / RNA / Folate Inhibitors

- **Fluoroquinolones (Ciprofloxacin, Levofloxacin, Moxifloxacin)**:
  - Inhibit bacterial **Topoisomerase II (DNA Gyrase)** and **Topoisomerase IV** $\\implies$ induce lethal double-stranded DNA breaks.
  - **Adverse Effects**: **Tendonitis and Achilles Tendon Rupture** (especially in elderly, athletes, and concurrent corticosteroid therapy); **QT prolongation**; cartilage damage in children (teratogen/contraindicated in pregnancy).
- **Sulfonamides + Trimethoprim (TMP-SMX)**:
  - **Sulfonamides** inhibit Dihydropteroate Synthase (PABA analog); **Trimethoprim** inhibits Dihydrofolate Reductase (DHFR) $\\implies$ synergistic sequential blockade of bacterial THF synthesis.
  - **Adverse Effects**: **Stevens-Johnson Syndrome (SJS) / Toxic Epidermal Necrolysis (TEN)**, megaloblastic anemia (treat with folinic acid / leucovorin), hyperkalemia, kernicterus in neonates, sulfa hypersensitivity.
- **Metronidazole**:
  - Reduced by pyruvate-ferredoxin oxidoreductase forming reactive free radical toxic metabolites that damage DNA.
  - Classic uses: **GET GAP on the Metro**: **G**iardia, **E**ntamoeba, **T**richomonas, **G**ardnerella vaginalis, **A**naerobes (*Bacteroides, C. diff*), **P**ylori (*H. pylori*).
  - **Adverse Effect**: **Severe Disulfiram-Like Reaction** with alcohol (flushing, nausea, vomiting, tachycardia due to acetaldehyde accumulation).
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male receives IV Vancomycin infusion for MRSA osteomyelitis. Twenty minutes after the start of a rapid infusion, he experiences intense pruritus and develops an erythematous, macular flushing over his face, neck, and upper chest. Blood pressure is 110/70 mmHg, and heart rate is 88 bpm. Auscultation reveals clear breath sounds with no wheezing or stridor.",
      question: "Which of the following is the mechanism of this adverse reaction, and how should it be managed?",
      options: [
        "Direct non-IgE mediated mast cell Histamine release (Red Man Syndrome); Slow the infusion rate and pretreat with antihistamines",
        "Type I IgE-mediated anaphylaxis; Administer Epinephrine IM immediately and stop Vancomycin permanently",
        "Type III immune-complex deposition; Administer high-dose intravenous Methylprednisolone",
        "Direct nephrotoxic damage to proximal tubular cells; Discontinue Vancomycin"
      ],
      correctAnswerIndex: 0,
      explanation: "Vancomycin-induced 'Red Man Syndrome' (Vancomycin Flushing Reaction) is an idiosyncratic, non-allergic (non-IgE mediated) reaction caused by direct mast cell degranulation and histamine release triggered by rapid infusion rates. It is characterized by flushing, erythema, and pruritus of the upper torso ('red man'). It is managed and prevented by slowing the infusion rate (over >=60-120 minutes) and administering H1/H2 antihistamines."
    }
  ]
};
