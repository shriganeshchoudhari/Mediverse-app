/**
 * Internship Core Clinical Postings: National Health Programs & Tuberculosis Direct Observation (NTEP & NACP)
 * Authoritative public health content derived from NTEP Guidelines 2025, NACO Clinical Guidelines.
 * Mapped to NMC CBME Competencies: IN6.1, CM5.1, CM7.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NATIONAL_HEALTH_PROGRAMS_NTEP_NACP_MODULE: PhysiologyLessonModule = {
  id: "int6-national-health-programs-ntep-nacp",
  unitCode: "IN6.1",
  title: "National Health Programs: NTEP Tuberculosis Regimens (2HRZE/4HRE & CBNAAT), NACP Treat All HIV (TLD) & Post-Exposure Prophylaxis (PEP)",
  competencies: ["IN6.1", "CM5.1", "CM7.1"],
  estimatedMinutes: 150,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# National Health Programs: NTEP Tuberculosis & NACP HIV Control

Programmatic public health algorithms provide universal molecular diagnostics, daily fixed-dose combination antitubercular therapy, and immediate first-line antiretroviral coverage.

---

## 1. National Tuberculosis Elimination Program (NTEP - Nikshay)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Classification} & \\textbf{Mandated Diagnostic Test} & \\textbf{Standard Therapeutic Regimen} & \\textbf{Nikshay Monitoring} \\\\
\\hline
\\textbf{Presumptive Pulmonary TB} & \\mathbf{\\text{Upfront CBNAAT / GeneXpert}} & \\mathbf{2\\text{HRZE (2 months Intensive Phase:}} & \\text{Daily FDCs based on} \\\\
(\\text{Cough } \\ge 2\\text{w, fever, night sweats)} & \\text{MTB/RIF or Truenat} & \\text{Isoniazid, Rifampicin, Pyrazinamide, Ethambutol)} & \\text{weight bands; 99DOTS} \\\\
& & \\mathbf{+ 4\\text{HRE (4 months Continuation Phase)}} & \\text{adherence tracking} \\\\
\\textbf{MDR-TB / Rifampicin} & \\text{CBNAAT detected R-resistance} & \\mathbf{\\text{BPaLM Regimen: Bedaquiline,}} & \\text{Direct Benefit Transfer} \\\\
\\textbf{Resistant (RR-TB)} & + \\text{ Line Probe Assay (LPA)} & \\mathbf{\\text{Pretomanid, Linezolid, Moxifloxacin}} & \\text{(Nikshay Poshan Yojana} \\\\
& & (6\\text{ months shorter oral regimen}) & \\text{INR 500/month)} \\\\
\\hline
\\end{array}$$

---

## 2. National AIDS Control Program (NACP V) & Antiretroviral Therapy (ART)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Scenario} & \\textbf{First-Line Regimen / Dosing} & \\textbf{Timing \u0026 Duration} & \\textbf{Monitoring Parameters} \\\\
\\hline
\\textbf{Adult / Adolescent HIV} & \\mathbf{\\text{TLD Regimen (Single Tablet Daily):}} & \\mathbf{\\text{\"Treat All\" Policy: Initiate ART}} & \\text{Viral load at 6 months} \\\\
(\\text{Confirmed Positive}) & \\mathbf{\\text{Tenofovir (TDF } 300\\text{ mg) +}} & \\mathbf{\\text{immediately upon diagnosis regardless}} & \\text{and 12 months (target} \\\\
& \\mathbf{\\text{Lamivudine (3TC } 300\\text{ mg) +}} & \\mathbf{\\text{of CD4 count or clinical stage}} & < 1{,}000\\text{ copies/mL)} \\\\
& \\mathbf{\\text{Dolutegravir (DTG } 50\\text{ mg)}} & & \\\\
\\textbf{Occupational / Non-} & \\mathbf{\\text{TLD Regimen (Tenofovir +}} & \\mathbf{\\text{Initiate within } < 72\\text{ hours of exposure;}} & \\text{Baseline HIV testing;} \\\\
\\textbf{Occupational Exposure (PEP)} & \\mathbf{\\text{Lamivudine + Dolutegravir)}} & \\mathbf{\\text{continue daily for } 28\\text{ full days}} & \\text{repeat at 6w, 3m, 6m} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old male presents to a rural primary health centre with 4 weeks of productive cough, evening low-grade fevers, drenching night sweats, and a 5-kg unintentional weight loss. Sputum CBNAAT (GeneXpert MTB/RIF) demonstrates 'Mycobacterium tuberculosis DETECTED; Rifampicin resistance NOT DETECTED'. Baseline liver enzymes and renal function are normal, and his body weight is 54 kg.",
      question: "What is the standard first-line NTEP antitubercular regimen, duration, and patient support mechanism?",
      options: [
        "Initiate daily weight-banded Fixed-Dose Combination (FDC) therapy: 2 months of Intensive Phase (2HRZE: Isoniazid, Rifampicin, Pyrazinamide, Ethambutol) PLUS 4 months of Continuation Phase (4HRE) under 99DOTS digital adherence tracking, and register on the Nikshay portal for direct benefit nutritional support (Nikshay Poshan Yojana)",
        "Initiate streptomycin injections daily for 12 months as monotherapy",
        "Prescribe 14 days of oral amoxicillin and observe",
        "Admit for surgical lobectomy without initiating medical therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates the standard National Tuberculosis Elimination Program (NTEP) protocol for drug-sensitive pulmonary tuberculosis: (1) Diagnostic Standard: Upfront molecular testing (CBNAAT) confirmed Rifampicin-sensitive MTB; (2) Standard DS-TB Regimen: 2 months of Intensive Phase (2HRZE) + 4 months of Continuation Phase (4HRE) administered as daily weight-banded Fixed-Dose Combinations (FDCs); (3) Public Health Adherence: Nikshay portal registration enables digital adherence tracking (99DOTS) and monthly nutritional financial support (Nikshay Poshan Yojana)."
    }
  ]
};
