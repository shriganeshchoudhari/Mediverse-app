/**
 * Clinical Immunology: Targeted Biologics & Monoclonal Antibodies
 * Authoritative medical content derived from Abbas Cellular & Molecular Immunology (10th ed.), Janeway's Immunobiology.
 * Mapped to NMC CBME Competencies: IM1.3, IM1.4, PE18.2, MD38.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TARGETED_BIOLOGICS_MABS_MODULE: PhysiologyLessonModule = {
  id: "immunology-adv-targeted-biologics-mabs",
  unitCode: "IM3.1",
  title: "Targeted Biologics: TNF Inhibitors (Infliximab), CD20 (Rituximab), IL-6R (Tocilizumab) & C5 (Eculizumab)",
  competencies: ["IM1.3", "IM1.4", "PE18.2", "MD38.2"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Targeted Biologics & Monoclonal Antibodies in Clinical Practice

Monoclonal antibodies and receptor fusion proteins target specific cytokine cascades, lymphocyte surface antigens, and complement components to treat autoimmune, inflammatory, and hematologic diseases.

---

## 1. High-Yield Biologics & Clinical Warnings

$$\\begin{array}{lcccc}
\\hline
\\textbf{Biologic Agent} & \\textbf{Target} & \\textbf{Clinical Indications} & \\textbf{Black Box Warning / Risk} & \\textbf{Mandatory Pre-Screening} \\\\
\\hline
\\textbf{Infliximab / Adalimumab} & \\mathbf{\\text{TNF-}\\alpha} & \\text{RA, Crohn's, UC, Ankylosing Spondylitis} & \\mathbf{\\text{Reactivation of Latent TB,}} & \\mathbf{\\text{PPD / QuantiFERON-TB}} \\\\
\\text{Certolizumab / Etanercept} & & & \\text{Histoplasmosis, HBV} & \\text{and Hepatitis B Serology} \\\\
\\textbf{Rituximab} & \\mathbf{\\text{CD20 (B cells)}} & \\text{Lymphoma, GPA, Refractory RA} & \\mathbf{\\text{JC Virus } \\rightarrow \\text{ PML (Progressive}} & \\text{HBV Serology, baseline Ig} \\\\
& & & \\mathbf{\\text{Multifocal Leukoencephalopathy)}} & \\\\
\\textbf{Tocilizumab} & \\mathbf{\\text{IL-6 Receptor}} & \\text{Giant Cell Arteritis, RA, sJIA,} & \\text{Bowel Perforation (Diverticulitis),} & \\text{Lipid panel, LFTs, CBC} \\\\
& & \\mathbf{\\text{CAR-T Cytokine Release Syndrome}} & \\text{Elevated transaminases} & \\\\
\\textbf{Dupilumab} & \\mathbf{\\text{IL-4R-}\\alpha \\text{ / IL-13}} & \\text{Atopic Dermatitis, Eosinophilic Asthma} & \\text{Conjunctivitis, Keratitis} & \\text{Ocular symptom history} \\\\
\\textbf{Eculizumab / Ravulizumab} & \\mathbf{\\text{Complement C5}} & \\text{PNH, Atypical HUS (aHUS)} & \\mathbf{\\text{Fatal } Neisseria meningitidis} & \\mathbf{\\text{Meningococcal Conjugate}} \\\\
& & & \\mathbf{\\text{Meningococcemia (MAC block)}} & \\mathbf{\\text{+ Serogroup B Vaccination}} \\\\
\\hline
\\end{array}$$

---

## 2. Molecular Mechanisms of Action

1. **TNF-alpha Inhibitors (Infliximab, Adalimumab, Golimumab, Etanercept)**:
   - TNF-alpha is required for macrophage activation and the formation and maintenance of **granulomas**.
   - Neutralizing TNF-alpha leads to granuloma breakdown $\rightarrow$ **disseminated reactivation of latent *Mycobacterium tuberculosis*** or endemic mycoses (*Histoplasma capsulatum*).
2. **Rituximab (Anti-CD20)**:
   - Targets CD20 expressed on pre-B and mature B lymphocytes (sparing antibody-secreting plasma cells which lack CD20).
   - Eliminates circulating B cells via Complement-Dependent Cytotoxicity (CDC) and Antibody-Dependent Cellular Cytotoxicity (ADCC).
3. **Eculizumab (Anti-C5)**:
   - Monoclonal antibody binding C5, preventing cleavage into C5a and C5b, thereby halting assembly of the Membrane Attack Complex (MAC, C5b-9).
   - Without MAC, patients are exquisitely vulnerable to encapsulated **encapsulated *Neisseria* species** (Meningococcal sepsis).
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old male with paroxysmal nocturnal hemoglobinuria (PNH) and severe recurrent intravascular hemolytic crises with dark morning urine and iron deficiency anemia is evaluated for treatment with Eculizumab (a monoclonal antibody targeting Complement component C5).",
      question: "Which of the following interventions is mandatory prior to initiating Eculizumab therapy, and why?",
      options: [
        "Administration of meningococcal conjugate (MenACWY) and serogroup B (MenB) vaccines at least 2 weeks prior to therapy, because C5 blockade prevents assembly of the Membrane Attack Complex (C5b-9), predisposing to fulminant Neisseria meningitidis sepsis",
        "Administration of live-attenuated MMR vaccine to prevent measles reactivation",
        "Mandatory screening for latent tuberculosis with a PPD skin test because Eculizumab impairs granuloma maintenance",
        "Administration of high-dose intravenous immunoglobulin to maintain total serum IgG levels"
      ],
      correctAnswerIndex: 0,
      explanation: "Eculizumab is a recombinant humanized monoclonal antibody that binds with high affinity to complement protein C5, preventing its cleavage into C5a and C5b and completely blocking formation of the terminal Membrane Attack Complex (MAC, C5b-9). Because the terminal complement pathway is vital for the bactericidal killing of encapsulated Neisseria species, patients receiving Eculizumab have a >1,000-fold increased risk of fulminant, fatal Neisseria meningitidis bacteremia and meningitis. Mandatory vaccination with both MenACWY conjugate and MenB vaccines at least 2 weeks prior to the first dose is strictly required by FDA boxed warnings."
    }
  ]
};
