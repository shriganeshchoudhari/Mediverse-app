/**
 * Clinical Dermatology Advanced: Inflammatory Dermatoses, Psoriasis Biologics & Necrotizing Infections
 * Authoritative dermatology content derived from Bolognia (4th ed.), Fitzpatrick's (9th ed.).
 * Mapped to NMC CBME Competencies: DR7.1, DR7.2, MD49.4, SU47.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PSORIASIS_BIOLOGICS_INFLAMMATORY_MODULE: PhysiologyLessonModule = {
  id: "dermatology-adv-psoriasis-necrotizing",
  unitCode: "DR7.1",
  title: "Inflammatory & Infectious Dermatoses: Psoriasis (IL-17A / IL-23 Biologics, Auspitz) & Necrotizing Fasciitis (LRINEC)",
  competencies: ["DR7.1", "DR7.2", "MD49.4", "SU47.4"],
  estimatedMinutes: 150,
  organ3dTarget: "REPRODUCTIVE",
  markdownContent: `
# Inflammatory & Infectious Dermatoses: Psoriasis Biologics & Necrotizing Fasciitis

Immune-mediated dermatoses and necrotizing soft tissue infections demand mastery of cytokine pathways, clinical signs (Auspitz/Koebner), and life-saving operative emergency protocols.

---

## 1. Psoriasis Immunopathogenesis vs Necrotizing Fasciitis

$$\\begin{array}{lcccc}
\\hline
\\textbf{Condition} & \\textbf{Primary Pathophysiology} & \\textbf{Diagnostic Physical Examination Signs} & \\textbf{Laboratory \u0026 Diagnostic Scoring} & \\textbf{Targeted Treatment Paradigm} \\\\
\\hline
\\textbf{Plaque} & \\mathbf{\\text{IL-23 / Th17 / IL-17A axis;}} & \\mathbf{\\text{Auspitz sign (punctate bleeding);}} & \\text{Acanthosis, parakeratosis,} & \\mathbf{\\text{Biologics: Secukinumab (IL-17A),}} \\\\
\\textbf{Psoriasis} & \\text{keratinocyte hyperproliferation} & \\mathbf{\\text{Koebner phenomenon; silvery scales}} & \\mathbf{\\text{Munro microabscesses (neutrophils)}} & \\mathbf{\\text{Guselkumab (IL-23), Adalimumab (TNF)}} \\\\
\\textbf{Necrotizing} & \\mathbf{\\text{Type I (polymicrobial) vs}} & \\mathbf{\\text{PAIN OUT OF PROPORTION TO EXAM,}} & \\mathbf{\\text{LRINEC Score } \\ge 6-8\\text{ (CRP, WBC,}} & \\mathbf{\\text{EMERGENT OPERATIVE DEBRIDEMENT}} \\\\
\\textbf{Fasciitis} & \\mathbf{\\text{Type II (Group A Streptococcus)}} & \\mathbf{\\text{skin anesthesia, crepitus, bullae}} & \\text{Hb, Na+, Creatinine, Glucose)} & + \\text{ IV Vancomycin } + \\text{ Zosyn } + \\mathbf{\\text{Clindamycin}} \\\\
\\textbf{Atopic} & \\text{Filaggrin (FLG) loss-of-function,} & \\text{Pruritic flexural lichenification,} & \\text{Elevated total serum IgE,} & \\mathbf{\\text{Dupilumab (anti-IL-4R}\\alpha\\text{)},} \\\\
\\textbf{Dermatitis} & \\text{Th2-driven (IL-4, IL-13), barrier loss} & \\text{Dennie-Morgan folds, allergic shiners} & \\text{peripheral eosinophilia} & \\text{topical Tacrolimus, barrier emollients} \\\\
\\hline
\\end{array}$$

---

## 2. LRINEC Score for Necrotizing Fasciitis & Clindamycin Antitoxin

- **LRINEC (Laboratory Risk Indicator for Necrotizing Fasciitis) Scoring**:
  - **C-Reactive Protein (CRP) $\\ge 150\\text{ mg/L}$**: $4\\text{ points}$.
  - **Total WBC Count**: $<15 \\rightarrow 0$; $15 - 25 \\rightarrow 1\\text{ point}$; $>25\\times 10^9/\\text{L} \\rightarrow 2\\text{ points}$.
  - **Hemoglobin**: $>13.5 \\rightarrow 0$; $11 - 13.5 \\rightarrow 1\\text{ point}$; $<11\\text{ g/dL} \\rightarrow 2\\text{ points}$.
  - **Serum Sodium**: $\\ge 135 \\rightarrow 0$; $<135\\text{ mmol/L} \\rightarrow 2\\text{ points}$.
  - **Serum Creatinine**: $\\le 141 \\rightarrow 0$; $>141\\mu\\text{mol/L}$ ($>1.6\\text{ mg/dL}$) $\\rightarrow 2\\text{ points}$.
  - **Serum Glucose**: $\\le 10 \\rightarrow 0$; $>10\\text{ mmol/L}$ ($>180\\text{ mg/dL}$) $\\rightarrow 1\\text{ point}$.
  - **Risk Stratification**:
    - Score $<6$: Low risk ($<50\\%$ probability).
    - Score $6 - 7$: Moderate risk (suspect necrotizing fasciitis).
    - Score $\\ge 8$: High risk ($>75\\%$ probability of necrotizing fasciitis).
- **Mandatory Surgical Rule**:
  - **DO NOT DELAY SURGICAL EXPLORATION FOR MRI OR CT IMAGING** if necrotizing fasciitis is clinically suspected.
  - **Role of Clindamycin**: Acts at the bacterial $50\\text{S}$ ribosomal subunit to shut down production of **Streptococcal Pyrogenic Exotoxins (SpeA, SpeB, SpeC)** and Toxic Shock Syndrome Toxin-1 (TSST-1), overcoming the Eagle (inoculum) effect.
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old male with poorly controlled type 2 diabetes mellitus presents with rapidly progressive severe pain, swelling, and redness in his left lower leg following a minor scrape 36 hours ago. On physical examination, he appears toxic, tachycardic (HR 130 bpm), and hypotensive (BP 88/54 mmHg). The left lower leg displays poorly demarcated, dusky purplish-erythematous swelling extending rapidly up to the knee. Light palpation produces exquisite, agonizing pain that is vastly out of all proportion to the visual skin appearance, along with areas of palpable crackling crepitus and central cutaneous anesthesia. Laboratory studies show: CRP 240 mg/L (4 pts), WBC 28,000/uL (2 pts), Hemoglobin 10.2 g/dL (2 pts), Sodium 128 mmol/L (2 pts), Creatinine 2.1 mg/dL (2 pts), and Glucose 280 mg/dL (1 pt), yielding an LRINEC score of 13.",
      question: "What is the diagnosis, what is the mandatory immediate management, and why is Clindamycin an essential component of the antibiotic regimen?",
      options: [
        "Necrotizing Fasciitis with LRINEC score of 13 (high probability >75%); take the patient IMMEDIATELY to the operating room for emergent radical surgical fascial debridement without delaying for imaging, and administer IV Vancomycin + Piperacillin-Tazobactam + Clindamycin (to suppress streptococcal/staphylococcal protein exotoxin synthesis)",
        "Severe uncomplicated cellulitis; administer oral Cephalexin and discharge home",
        "Deep Venous Thrombosis; order a venous duplex ultrasound and administer IV Heparin",
        "Gouty arthritis; administer oral Colchicine and intra-articular steroid injection"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits a classic fulminant presentation of Necrotizing Fasciitis (Necrotizing Soft Tissue Infection): (1) Clinical Hallmarks: Severe pain out of all proportion to exam, cutaneous anesthesia, crepitus, and systemic toxicity/shock; (2) LRINEC Score: Total score of 13 strongly predicts necrotizing fasciitis (cutoff ≥8 gives >75% probability); (3) Surgical Mandate: The definitive life-saving intervention is Immediate Radical Operative Surgical Debridement of all necrotic fascia and tissue in the OR (imaging must never delay surgery); (4) Antimicrobial Role of Clindamycin: Clindamycin is specifically added to broad-spectrum coverage (Vancomycin + Pip-Tazo) because it binds the 50S ribosomal subunit to halt synthesis of lethal bacterial superantigens and pyrogenic exotoxins (e.g., Streptococcal Pyrogenic Exotoxin A and TSST-1)."
    }
  ]
};
