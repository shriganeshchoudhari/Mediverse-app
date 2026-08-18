/**
 * Clinical Immunology: Hypersensitivity Reactions: Gell & Coombs Types I, II, III & IV
 * Authoritative medical content derived from Abbas' Cellular and Molecular Immunology (10th ed.), Robbins & Cotran Pathologic Basis of Disease.
 * Mapped to NMC CBME Competencies: IM3.1, IM3.2, IM4.1, IM4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HYPERSENSITIVITY_REACTIONS_TYPES_I_TO_IV_MODULE: PhysiologyLessonModule = {
  id: "immunology-hypersensitivity-reactions-types-i-to-iv",
  unitCode: "IM3.1",
  title: "Gell & Coombs Hypersensitivity Reactions: Types I (Immediate), II (Cytotoxic), III (Immune Complex) & IV (Delayed)",
  competencies: ["IM3.1", "IM3.2", "IM4.1", "IM4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "HEMATOLOGY",
  markdownContent: `
# Gell & Coombs Hypersensitivity Reactions: Types I, II, III & IV

The Gell and Coombs classification categorizes immunologic tissue injury into four distinct pathogenic mechanisms.

---

## 1. The Gell & Coombs Hypersensitivity Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Reaction Type} & \\textbf{Primary Immune Mediator} & \\textbf{Pathophysiologic Mechanism} & \\textbf{Typical Onset} & \\textbf{Classic Disease Examples} \\\\
\\hline
\\textbf{Type I (Immediate / IgE)} & \\text{IgE antibodies bound to Fc}\\varepsilon\\text{RI on Mast cells / Basophils} & \\text{Antigen cross-linking } \\rightarrow \\text{ Degranulation of Histamine, Leukotrienes (}\\text{LTC}_4, \\text{LTD}_4, \\text{LTE}_4\\text{), Tryptase} & \\text{Minutes to hours (15-30 min)} & \\text{Anaphylaxis, Allergic asthma, Allergic rhinitis, Urticaria, Food/Drug allergies} \\\\
\\textbf{Type II (Antibody-Mediated)} & \\text{IgG or IgM against cell-surface / matrix fixed antigens} & \\text{1. Complement-mediated lysis (MAC / C3b opsonization)}\\newline \\text{2. ADCC via NK cells}\\newline \\text{3. Receptor agonism / antagonism} & \\text{Hours to days} & \\text{Goodpasture (anti-GBM), Myasthenia Gravis (anti-AChR), Graves (anti-TSHR), ITP, Pemphigus vulgaris, Hemolytic anemia} \\\\
\\textbf{Type III (Immune Complex)} & \\text{Circulating soluble IgG/IgM Antigen-Antibody complexes} & \\text{Complex deposition in vessel walls } \\rightarrow \\text{ Classical complement activation (C3a/C5a) } \\rightarrow \\text{ Neutrophil recruitment & fibrinoid necrosis} & \\text{1 to 3 weeks (7-14 days)} & \\text{Serum sickness, Systemic Lupus Erythematosus (SLE nephritis), Post-streptococcal glomerulonephritis (PSGN), Polyarteritis nodosa} \\\\
\\textbf{Type IV (Delayed-Type / T-Cell)} & \\text{Sensitized CD4+ (Th1 / Th17) and CD8+ cytotoxic T lymphocytes} & \\text{Th1 release of IFN-}\\gamma \\rightarrow \\text{ Macrophage activation & epithelioid granulomas; CD8+ perforin/granzyme direct cytotoxicity} & \\mathbf{\\text{24 to 72 hours (Peak 48h)}} & \\text{Tuberculin (PPD) skin test, Contact dermatitis (Poison ivy / Nickel), Graft-versus-Host Disease (GvHD), Multiple Sclerosis, Type 1 DM} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Clinical Entities by Reaction Mechanism

### Type I: Anaphylaxis & Mast Cell Mediators
- **Preformed Granule Mediators**: **Histamine** (vasodilation, increased vascular permeability via $H_1$ receptors), **Tryptase** (serum marker of mast cell degranulation; elevated for $2-4\\text{ hours}$ post-event).
- **Newly Synthesized Lipid Mediators**: **Cysteinyl Leukotrienes ($\\text{LTC}_4, \\text{LTD}_4, \\text{LTE}_4$)** (potent bronchoconstriction, $1000\\times$ more potent than histamine), **Prostaglandin $\\text{PGD}_2$**, **Platelet-Activating Factor (PAF)**.
- **First-Line Emergency Therapy**: **Intramuscular (IM) Epinephrine $1:1000$ ($1\\text{ mg/mL}$)**, dose $0.3 - 0.5\\text{ mg}$ into anterolateral thigh. Epinephrine activates $\\alpha_1$ (vasoconstriction), $\\beta_1$ (increased heart rate/contractility), and $\\beta_2$ (bronchodilation and inhibition of mast cell mediator release).

### Type II: Direct Antibody-Mediated Cytotoxic & Functional Diseases
- **Receptor Stimulatory (Agonist)**: **Graves Disease** (Thyroid-Stimulating Immunoglobulin [TSI] binds TSH receptor $\\implies$ hyperthyroidism).
- **Receptor Inhibitory (Antagonist)**: **Myasthenia Gravis** (Anti-Acetylcholine Receptor [AChR] antibodies cross-link and endocytose ACh receptors at motor endplates $\\implies$ fatiguable ptosis, diplopia, generalized weakness).
- **Autoimmune Bullous Diseases**:
  - *Pemphigus Vulgaris*: Anti-**Desmoglein 1 and 3** (desmosomes) $\\implies$ intraepidermal flaccid blisters, positive Nikolsky sign, "tombstone" basal layer, fishnet/chicken-wire direct immunofluorescence.
  - *Bullous Pemphigoid*: Anti-**Hemidesmosomal BP180/BP230** $\\implies$ subepidermal tense bullae, negative Nikolsky sign, linear basement membrane IgG/C3 immunofluorescence.
- **Goodpasture Syndrome (Anti-GBM Disease)**: IgG autoantibodies against the **$\\alpha3$ chain of Type IV collagen** in glomerular and alveolar basement membranes $\\implies$ rapidly progressive crescentic glomerulonephritis (RPGN) with linear IgG immunofluorescence and alveolar pulmonary hemorrhage.

### Type III: Immune-Complex Deposition & Vasculitis
- **Classic Serum Sickness**: Occurs $7-14\\text{ days}$ after administration of heterologous foreign proteins (e.g. anti-thymocyte globulin, snake antivenom). Circulating immune complexes deposit in small vessels $\\implies$ triad of **Fever, Urticarial Rash, and Polyarthralgias/Arthritis** with **low serum complement (C3/C4)** and proteinuria.
- **Arthus Reaction**: Localized Type III reaction occurring $4-12\\text{ hours}$ after intradermal booster injection in an already sensitized individual (e.g. Tdap vaccine) $\\implies$ localized pain, edema, and hemorrhage.

### Type IV: Cell-Mediated Delayed-Type Hypersensitivity (DTH)
- **Contact Dermatitis**: **Hapten-protein complexes** (e.g. **Urushiol** from poison ivy, **Nickel** in jewelry). Dendritic cells present haptenized peptides to naive T cells in lymph nodes. Upon re-exposure, sensitized Th1 cells migrate to the skin, releasing **IFN-$\\gamma$** which recruits and activates cytotoxic macrophages $\\implies$ pruritic, erythematous, vesicular linear eruptions $24-48\\text{ hours}$ post-contact.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old male receives equine-derived antivenom following a pit viper snake bite. Ten days after discharge, he presents to the urgent care clinic with a low-grade fever (38.2°C), a widespread itchy morbilliform and urticarial rash, and bilateral knee and wrist joint pain. Urinalysis reveals mild proteinuria and microscopic hematuria. Serum complement levels reveal C3 of 42 mg/dL (normal: 90-180 mg/dL) and C4 of 8 mg/dL (normal: 16-47 mg/dL).",
      question: "Which of the following immunologic mechanisms explains this patient's clinical presentation?",
      options: [
        "Type III Hypersensitivity; Deposition of circulating antigen-antibody immune complexes causing classical complement consumption and neutrophil vasculitis",
        "Type I Hypersensitivity; IgE-mediated mast cell degranulation triggering histamine release",
        "Type II Hypersensitivity; IgG autoantibody-mediated cytotoxicity against vascular endothelial cell surfaces",
        "Type IV Hypersensitivity; Delayed T-lymphocyte activation with macrophage interferon-gamma secretion"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient is presenting with classic Acute Serum Sickness, a prototypical Type III Hypersensitivity reaction occurring 7-14 days after exposure to foreign heterologous proteins (equine antivenom). As host IgG antibodies are produced, they form circulating soluble immune complexes with the residual foreign antigens. These complexes deposit in small blood vessels, joints, and renal glomeruli, activating the classical complement cascade (causing marked consumption of C3 and C4) and triggering neutrophil recruitment with fibrinoid necrotizing vasculitis, presenting as the classic triad of fever, urticaria, and polyarthralgias."
    }
  ]
};
