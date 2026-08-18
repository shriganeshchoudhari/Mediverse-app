/**
 * Clinical Dermatology Advanced: Autoimmune Bullous Dermatoses & Immunofluorescence
 * Authoritative dermatology content derived from Bolognia (4th ed.), Fitzpatrick's (9th ed.).
 * Mapped to NMC CBME Competencies: DR3.1, DR3.2, MD49.2, SU47.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const AUTOIMMUNE_BULLOUS_PEMPHIGUS_MODULE: PhysiologyLessonModule = {
  id: "dermatology-adv-bullous-pemphigus",
  unitCode: "DR3.1",
  title: "Autoimmune Bullous Diseases: Pemphigus Vulgaris (Desmoglein-3/1), Bullous Pemphigoid (BP180/230) & Dermatitis Herpetiformis",
  competencies: ["DR3.1", "DR3.2", "MD49.2", "SU47.2"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Autoimmune Bullous Diseases: Pemphigus, Pemphigoid & Dermatitis Herpetiformis

Autoimmune blistering dermatoses require histological cleavage assessment, direct immunofluorescence (DIF) antibody mapping, and targeted systemic immunosuppression.

---

## 1. Autoimmune Blistering Dermatoses Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Target Autoantigen \u0026 Class} & \\textbf{Blister Morphology \u0026 Signs} & \\textbf{Direct Immunofluorescence (DIF)} & \\textbf{Gold Standard Pharmacotherapy} \\\\
\\hline
\\textbf{Pemphigus} & \\mathbf{\\text{Desmoglein-3 \u0026 Desmoglein-1}} & \\mathbf{\\text{FLACCID, easily ruptured bullae,}} & \\mathbf{\\text{Intercellular \"fishnet\" / \"chicken-wire\"}} & \\mathbf{\\text{High-dose Systemic Steroids}} \\\\
\\textbf{Vulgaris} & (\\text{cadherins in desmosomes; IgG}) & \\mathbf{\\text{painful oral mucosal erosions,}} & \\mathbf{\\text{pattern of IgG and C3}} & + \\mathbf{\\text{ Rituximab (anti-CD20) / MMF}} \\\\
& & \\mathbf{\\text{Nikolsky POSITIVE; Suprabasal cleft}} & \\text{throughout epidermal stratum spinosum} & \\\\
\\textbf{Bullous} & \\mathbf{\\text{BP180 (Col XVII) \u0026 BP230}} & \\mathbf{\\text{TENSE, firm bullae on urticarial base,}} & \\mathbf{\\text{Continuous linear band of IgG and C3}} & \\mathbf{\\text{High-potency topical Clobetasol}} \\\\
\\textbf{Pemphigoid} & (\\text{hemidesmosomes; IgG}) & \\mathbf{\\text{Nikolsky NEGATIVE; mucosal sparing}} & \\mathbf{\\text{along dermal-epidermal junction (BMZ)}} & \\text{0.05\\% or oral Prednisone} \\\\
& & (\\text{Subepidermal blister with eosinophils}) & & \\\\
\\textbf{Dermatitis} & \\mathbf{\\text{Epidermal Transglutaminase}} & \\mathbf{\\text{Intensely pruritic grouped vesicles on}} & \\mathbf{\\text{Granular IgA deposits in dermal}} & \\mathbf{\\text{Oral Dapsone (check G6PD)}} \\\\
\\textbf{Herpetiformis} & \\mathbf{\\text{(eTG-3); IgA; Celiac Disease}} & \\text{elbows, knees, buttocks; Subepidermal} & \\mathbf{\\text{papillae tips (neutrophilic abscesses)}} & + \\mathbf{\\text{ Strict lifelong Gluten-Free Diet}} \\\\
\\hline
\\end{array}$$

---

## 2. Acantholysis vs Subepidermal Blistering Mechanics

- **Pemphigus Vulgaris (Suprabasal Acantholysis)**:
  - Autoantibodies against Desmoglein-3 and Desmoglein-1 disrupt calcium-dependent desmosomal cadherins.
  - Basal keratinocytes remain attached to the basement membrane via intact hemidesmosomes, creating the characteristic **"row of tombstones"** appearance.
  - Rupture occurs with minimal shear stress, leading to widespread, painful, raw denuded erosions with severe secondary bacterial infection risk.
- **Bullous Pemphigoid (Subepidermal Clefting)**:
  - Autoantibodies against BP180 and BP230 activate the classical complement pathway, attracting eosinophils and neutrophils that release elastase and matrix metalloproteinases.
  - The entire full-thickness epidermis forms the roof of the blister, resulting in durable, **tense fluid-filled bullae** that resist rupture.
`,
  clinicalVignettes: [
    {
      scenario: "A 44-year-old female presents with painful oral mouth ulcers that have persisted for 4 months, making eating solid foods nearly impossible. Over the past 3 weeks, she has developed multiple raw, weeping, unroofed sores across her upper back, scalp, and chest. On physical examination, there are numerous shallow erosions with ragged borders and a few extremely fragile, thin-walled, flaccid bullae. Light lateral tangential pressure on normal-appearing perilesional skin causes immediate detachment of the epidermis (positive Nikolsky sign). Lesional punch biopsy reveals intraepidermal suprabasal acantholysis with a preserved single layer of basal keratinocytes anchored to the basement membrane ('tombstone appearance'). Direct immunofluorescence (DIF) shows intercellular deposition of IgG and C3 in a net-like 'chicken-wire' pattern.",
      question: "What is the diagnosis, what is the specific target autoantigen, and what is the definitive first-line disease-modifying therapy?",
      options: [
        "Pemphigus Vulgaris; autoantibodies targeting Desmoglein-3 (and Desmoglein-1) desmosomal cadherins; initiate high-dose systemic Corticosteroids (e.g., Prednisone 1 mg/kg/day) combined with Rituximab (anti-CD20 monoclonal antibody)",
        "Bullous Pemphigoid; autoantibodies targeting BP180/BP230; initiate high-potency topical Clobetasol propionate",
        "Dermatitis Herpetiformis; initiate Dapsone and a gluten-free diet",
        "Porphyria Cutanea Tarda; initiate therapeutic phlebotomy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinicopathologic features of Pemphigus Vulgaris: (1) Clinical Presentation: Painful, refractory oral mucosal erosions that precede cutaneous lesions, followed by fragile, flaccid bullae that rupture easily to leave painful denuded areas, with a positive Nikolsky sign; (2) Histopathology & DIF: Suprabasal acantholysis with retention of basal cells on the basement membrane ('tombstone' appearance) and intercellular IgG/C3 'fishnet' or 'chicken-wire' direct immunofluorescence targeting the desmosomal cadherin Desmoglein-3 (mucocutaneous) and Desmoglein-1; (3) Definitive Management: High-dose systemic Corticosteroids combined early with Rituximab (anti-CD20 B-cell depleting biologic) as first-line therapy to achieve complete remission and reduce steroid toxicity."
    }
  ]
};
