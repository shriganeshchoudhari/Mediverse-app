/**
 * Clinical Anesthesiology Advanced: Neuromuscular Blockade, Train-of-Four & Sugammadex Reversal
 * Authoritative anesthesiology content derived from Miller's Anesthesia (9th ed.), ASA Guidelines.
 * Mapped to NMC CBME Competencies: AN7.1, AN7.2, MD50.4, SU48.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEUROMUSCULAR_BLOCKADE_SUGAMMADEX_MODULE: PhysiologyLessonModule = {
  id: "anesthesiology-adv-neuromuscular-blockade-sugammadex",
  unitCode: "AN7.1",
  title: "Neuromuscular Blockade: Succinylcholine (Phase I/II & K+ Rise), Cisatracurium (Hofmann) & Sugammadex Cyclodextrin Reversal",
  competencies: ["AN7.1", "AN7.2", "MD50.4", "SU48.4"],
  estimatedMinutes: 150,
  organ3dTarget: "MUSCULOSKELETAL",
  markdownContent: `
# Neuromuscular Blockade, TOF Monitoring & Sugammadex Reversal

Objective quantitative Train-of-Four (TOF) monitoring and cyclodextrin encapsulation of aminosteroid muscle relaxants have revolutionized perioperative airway extubation safety.

---

## 1. Neuromuscular Blocking Agents (NMBAs) Pharmacological Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug} & \\textbf{NMBA Class} & \\textbf{Onset \u0026 Duration} & \\textbf{Elimination Pathway} & \\textbf{Clinical Pearls \u0026 Adverse Effects} \\\\
\\hline
\\textbf{Succinylcholine} & \\mathbf{\\text{Depolarizing (nAChR agonist)}} & \\mathbf{30-60\\text{s} / 5-10\\text{min}} & \\mathbf{\\text{Plasma pseudocholinesterase}} & \\mathbf{\\text{Raises } K^+ \\text{ by } 0.5\\text{ mEq/L; phase I/II block;}} \\\\
& (\\text{persistent depolarization}) & (\\text{Gold standard RSI}) & (\\text{butyrylcholinesterase}) & \\mathbf{\\text{atypical enzyme causes prolonged apnea}} \\\\
\\textbf{Rocuronium} & \\mathbf{\\text{Non-Depolarizing (Aminosteroid)}} & \\mathbf{60\\text{s (at 1.2 mg/kg)} / 30-40\\text{m}} & \\text{Biliary (70\\%) \u0026 Renal (30\\%)} & \\mathbf{\\text{Specifically encapsulated and reversed}} \\\\
& (\\text{competitive nAChR antagonist}) & & & \\mathbf{\\text{by Sugammadex (1:1 molecular ring)}} \\\\
\\textbf{Vecuronium} & \\text{Non-Depolarizing (Aminosteroid)} & 2-3\\text{min} / 30-45\\text{min} & \\text{Hepatic (50\\%) \u0026 Renal (40\\%)} & \\text{Active 3-desacetyl metabolite in renal failure} \\\\
\\textbf{Cisatracurium} & \\mathbf{\\text{Non-Depolarizing (Isoquinolinium)}} & 2-3\\text{min} / 40-50\\text{min} & \\mathbf{\\text{Organ-Independent Hofmann Elimination}} & \\mathbf{\\text{Drug of choice in severe renal \u0026 hepatic failure;}} \\\\
& & & + \\text{ ester hydrolysis} & \\text{laudanosine metabolite; ZERO histamine release} \\\\
\\hline
\\end{array}$$

---

## 2. Train-of-Four (TOF) Monitoring \u0026 Reversal Strategy

$$\\begin{array}{lcccc}
\\hline
\\textbf{Depth of Blockade} & \\textbf{TOF Response (Twitches)} & \\textbf{Post-Tetanic Count (PTC)} & \\textbf{Sugammadex Dosing} & \\textbf{Neostigmine + Glycopyrrolate} \\\\
\\hline
\\textbf{Profound Block} & \\text{0 / 4 twitches} & \\text{PTC = 0} & \\mathbf{16\\text{ mg/kg (Immediate RSI rescue)}} & \\mathbf{\\text{STRICTLY INEFFECTIVE}} \\\\
\\textbf{Deep Block} & \\text{0 / 4 twitches} & \\text{PTC } \\ge 1 - 2 & \\mathbf{4\\text{ mg/kg}} & \\mathbf{\\text{STRICTLY INEFFECTIVE (Can cause paradox)}} \\\\
\\textbf{Moderate Block} & \\mathbf{1 - 3\\text{ / 4 twitches}} & \\text{N/A} & \\mathbf{2\\text{ mg/kg}} & \\text{Can use Neostigmine } 0.05\\text{ mg/kg} \\\\
\\textbf{Shallow / Recovery} & \\mathbf{4 / 4\\text{ twitches (with fade)}} & \\text{N/A} & \\mathbf{2\\text{ mg/kg}} & \\text{Neostigmine } 0.03-0.05\\text{ mg/kg} \\\\
\\textbf{Safe Extubation Threshold} & \\mathbf{\\text{TOF Ratio } \\ge 0.90\\text{ (90\\%)}} & \\text{Full motor recovery} & \\text{Extubation safe} & \\text{Target TOF ratio } \\ge 0.90 \\text{ to prevent PORC} \\\\
\\hline
\\end{array}$$

- **Train-of-Four Ratio Threshold**: Quantitative neuromuscular transmission monitoring requires a **$T_4/T_1\\text{ ratio } \\ge 0.90$ (90\\%)** to eliminate postoperative residual curarization (PORC), upper airway collapse, and aspiration.
- **Sugammadex Molecular Ring Mechanism**:
  - Modified gamma-cyclodextrin with 8 lipophilic carboxyl groups creating an internal hydrophobic cavity that forms a **$1:1$ high-affinity stoichiometric complex with Rocuronium and Vecuronium**.
  - Rapidly removes free rocuronium molecules from plasma, establishing a sharp concentration gradient that pulls drug molecules off neuromuscular junction nicotinic receptors within minutes.
`,
  clinicalVignettes: [
    {
      scenario: "A 45-year-old male with end-stage renal disease (ESRD on hemodialysis) and severe hepatic cirrhosis undergoes emergency laparoscopic appendectomy. Anesthesia is induced with Propofol and Rocuronium 1.2 mg/kg. At the end of the 25-minute surgery, the surgical team requests immediate extubation. Quantitative acceleromyography over the adductor pollicis demonstrates 0 out of 4 twitches on Train-of-Four (TOF) with a Post-Tetanic Count (PTC) of 2. The junior resident suggests administering IV Neostigmine 0.07 mg/kg with Glycopyrrolate.",
      question: "Why is Neostigmine contraindicated at this depth of block, what is the correct pharmacological reversal agent, and what is the mandatory TOF ratio required before extubation?",
      options: [
        "Neostigmine is ineffective and potentially harmful in deep neuromuscular blockade (TOF 0/4, PTC 2) because acetylcholinesterase inhibition has a ceiling effect that cannot overcome dense post-junctional receptor saturation; the correct reversal agent is IV Sugammadex at a deep-block dose of 4 mg/kg, which rapidly encapsulates rocuronium to achieve the mandatory extubation threshold of TOF ratio >= 0.90 (90%)",
        "Administer Neostigmine alone without Glycopyrrolate",
        "Administer IV Physostigmine 2 mg push",
        "Extubate immediately with 0/4 twitches since spontaneous breathing has returned"
      ],
      correctAnswerIndex: 0,
      explanation: "This scenario highlights critical modern neuromuscular reversal principles: (1) Neostigmine Limitations: Neostigmine acts indirectly by inhibiting acetylcholinesterase, producing a finite 'ceiling effect' of synaptic acetylcholine that is completely ineffective in reversing profound or deep blocks (TOF 0/4 with PTC 1-2); attempting neostigmine reversal at this depth can precipitate paradoxical neuromuscular weakness and prolonged paralysis; (2) Sugammadex Reversal: Sugammadex (a modified gamma-cyclodextrin) directly encapsulates rocuronium in a 1:1 complex; for deep blockade (TOF 0/4, PTC ≥1-2), the recommended dose is 4 mg/kg (reverses block within 2-3 minutes); (3) Safe Extubation Criterion: The patient must demonstrate a quantitative TOF ratio ≥0.90 (90%) before tracheal extubation to avoid postoperative residual weakness and upper airway obstruction."
    }
  ]
};
