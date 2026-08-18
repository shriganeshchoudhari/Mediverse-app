/**
 * Transfusion Medicine: ABO/Rh Blood Groups, Bombay Phenotype & Direct/Indirect Coombs Crossmatching
 * Authoritative medical content derived from AABB Technical Manual (20th ed.), Harmening's Modern Blood Banking (7th ed.), Mollison.
 * Mapped to NMC CBME Competencies: TR1.1, TR1.2, TR2.1, TR2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ABO_RH_ANTIGENS_COOMBS_TESTING_MODULE: PhysiologyLessonModule = {
  id: "transfusion-abo-rh-antigens-coombs-testing",
  unitCode: "TR1.1",
  title: "ABO/Rh Blood Groups, Bombay Phenotype, Direct/Indirect Coombs Tests & Compatibility Crossmatching",
  competencies: ["TR1.1", "TR1.2", "TR2.1", "TR2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# ABO/Rh Blood Groups, Bombay Phenotype, Direct/Indirect Coombs Tests & Compatibility Crossmatching

Immunohematology governs the molecular genetics of red blood cell surface antigens, naturally occurring and immune antibodies, and pre-transfusion compatibility testing.

---

## 1. Molecular Genetics of the ABO & Rh Blood Group Systems

### The ABO Carbohydrate Antigens & Enzymatic Pathway:
1. **Precursor Substance (Paragloboside)**: Type 1 or Type 2 carbohydrate core chains on RBC membranes.
2. **$H$-Gene (*FUT1* on Chromosome 19)**: Encodes $\\alpha\\text{-1,2-fucosyltransferase}$, adding **L-Fucose** to the terminal galactose of the precursor chain, creating the **H-Antigen (H Substance)**.
3. **ABO Gene (Chromosome 9)**:
   - **$A$-Gene**: Encodes **$\\alpha\\text{-1,3-N-acetylgalactosaminyltransferase}$**, adding **N-Acetylgalactosamine (GalNAc)** to the H-antigen $\\implies$ **A-Antigen**.
   - **$B$-Gene**: Encodes **$\\alpha\\text{-1,3-D-galactosyltransferase}$**, adding **D-Galactose** to the H-antigen $\\implies$ **B-Antigen**.
   - **$O$-Gene**: Amorph (non-functional protein due to single base deletion at guanine 261); leaves the **H-antigen unconverted** (Group O RBCs have the highest concentration of unmodified H-antigen!).

| Blood Group | RBC Surface Antigens | Naturally Occurring Serum Isohemagglutinins | Forward Typing (Anti-A, Anti-B) | Reverse Typing (A1 Cells, B Cells) |
| :--- | :--- | :--- | :--- | :--- |
| **Group A** | A Antigen, H Antigen | **Anti-B (predominantly IgM)** | Agglutination with Anti-A | Agglutination with B-Cells |
| **Group B** | B Antigen, H Antigen | **Anti-A (predominantly IgM)** | Agglutination with Anti-B | Agglutination with A1-Cells |
| **Group AB** | A Antigen, B Antigen | **None (Universal Recipient of RBCs)** | Agglutination with Anti-A & Anti-B | No Agglutination |
| **Group O** | H Antigen only | **Anti-A, Anti-B, and Anti-A,B (predominantly IgG)** | No Agglutination | Agglutination with A1-Cells & B-Cells |
| **Bombay Phenotype ($Oh / hh$)** | **No H, No A, No B Antigens** | **Anti-A, Anti-B, AND Potent Anti-H (IgM & IgG)** | No Agglutination with Anti-A, Anti-B, or Anti-H | Agglutination with A1, B, and O-Cells! |

---

## 2. The Bombay Phenotype ($Oh / hh$)

- **Genetics**: Homozygous recessive mutation ($hh$) in both *FUT1* (erythroid) and *FUT2* (secretor) genes on Chromosome 19.
- **Pathophysiology**: Inability to synthesize L-fucose transferase $\\implies$ No H-substance is formed. Even if $A$ or $B$ genes are present, the enzymes have no substrate to attach GalNAc or Galactose.
- **Immunohematological Hallmarks**:
  - Mistakenly types as **Group O** on routine forward typing (negative with Anti-A and Anti-B).
  - Negative reaction with **Anti-H Lectin (*Ulex europaeus*)** (distinguishing it from true Group O, which reacts strongly positive $4+$).
  - Serum contains a potent, wide-thermal-range **Anti-H antibody (IgM/IgG)** capable of fixing complement and causing immediate massive intravascular hemolysis.
  - **Transfusion Rule**: Can receive red blood cells **ONLY from another Bombay Phenotype donor** (autologous donation / rare donor registries).

---

## 3. Direct vs Indirect Antiglobulin (Coombs) Tests & Crossmatching

$$\\begin{array}{lcccc}
\\hline
\\textbf{Test Type} & \\textbf{Target Being Detected} & \\textbf{Patient Sample} & \\textbf{Mechanism & Reagents} & \\textbf{Clinical Diagnostic Indications} \\\\
\\hline
\\textbf{Direct Antiglobulin (DAT)} & \\mathbf{\\text{In Vivo Sensitized RBCs}} & \\text{Patient\'s Whole Blood (RBCs)} & \\text{Wash RBCs } + \\text{ Add AHG (Coombs Reagent) } \\rightarrow \\text{ Agglutination} & \\text{AIHA, HDFN, Drug-Induced Hemolysis, AHTR} \\\\
\\textbf{Indirect Antiglobulin (IAT)} & \\mathbf{\\text{In Vitro Free Serum Antibodies}} & \\text{Patient\'s Serum / Plasma} & \\text{Incubate Serum } + \\text{ Reagent RBCs } (37^\\circ\\text{C}) \\rightarrow \\text{ Wash } + \\text{ AHG} & \\text{Pre-transfusion Antibody Screen, RhD Workup} \\\\
\\hline
\\end{array}$$

### Pre-Transfusion Compatibility Testing (Crossmatching):
1. **Major Crossmatch**: **Donor RBCs $+$ Recipient Serum** (tests whether recipient has pre-formed antibodies against donor RBCs). Mandatory for all RBC transfusions!
2. **Minor Crossmatch**: **Donor Plasma $+$ Recipient RBCs** (largely replaced by routine donor antibody screening).
3. **Computerized / Electronic Crossmatch**: Allowed only when the recipient has a confirmed ABO/Rh type on record, two independent blood samples, and a completely negative antibody screen ($IAT$).
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old female with severe postpartum hemorrhage requires an urgent blood transfusion. Forward blood typing reveals no agglutination with Anti-A, Anti-B, or Anti-D (initial impression: O-negative). However, during reverse typing, the patient's serum strongly agglutinates reagent A1 cells, B cells, AND Group O screening red blood cells. Testing the patient's red cells with Ulex europaeus lectin reveals no agglutination (0 reaction).",
      question: "Which of the following represents the patient's true blood group, and what type of blood is safe for transfusion?",
      options: [
        "Bombay Phenotype (hh); The patient can safely receive red blood cells ONLY from another Bombay Phenotype donor",
        "Standard Group O Rh-negative; The patient can safely receive standard Group O Rh-negative PRBCs",
        "Group AB Rh-positive with cold autoantibodies; The patient can receive Group AB blood through a blood warmer",
        "Acquired B antigen syndrome; The patient can receive Group A blood"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic Bombay Phenotype (Oh/hh). Due to the lack of the FUT1 H-gene, no H substance is synthesized on red cells (confirmed by the negative reaction with Ulex europaeus anti-H lectin). Consequently, the patient naturally produces a potent, complement-fixing Anti-H antibody that agglutinates all normal Group O, A, B, and AB red blood cells (which all express H substance). If transfused with standard Group O red blood cells, fatal acute intravascular hemolytic transfusion reaction will ensue. The patient can ONLY receive red cells from another Bombay phenotype individual."
    }
  ]
};
