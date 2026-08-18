/**
 * Infectious Diseases: Antimicrobial Stewardship Program (ASP) & WHO AWaRe Framework
 * Authoritative medical content derived from WHO AWaRe Classification, IDSA/SHEA Guidelines for Implementing an Antimicrobial Stewardship Program.
 * Mapped to NMC CBME Competencies: ID7.1, ID7.2, ID8.1, ID8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANTIMICROBIAL_STEWARDSHIP_AWARE_FRAMEWORK_MODULE: PhysiologyLessonModule = {
  id: "infectious-diseases-antimicrobial-stewardship-aware-framework",
  unitCode: "ID7.1",
  title: "Antimicrobial Stewardship Programs (ASP), WHO AWaRe Classification, Antibiotic Time-Out & Procalcitonin",
  competencies: ["ID7.1", "ID7.2", "ID8.1", "ID8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "MICROBIOLOGY",
  markdownContent: `
# Antimicrobial Stewardship Programs (ASP) & WHO AWaRe Classification

Antimicrobial Stewardship refers to coordinated organizational interventions designed to optimize antimicrobial selection, dosing, route, and duration to improve patient clinical outcomes while minimizing resistance and toxicity.

---

## 1. The WHO AWaRe Antibiotic Classification Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{AWaRe Category} & \\textbf{Resistance Potential \u0026 Spectrum} & \\textbf{Hospital Use Target} & \\textbf{Key Antibiotic Agents} \\\\
\\hline
\\textbf{ACCESS Group} & \\text{Narrow-spectrum, low resistance potential,} & \\mathbf{\\ge 60\\%}\\text{ of total hospital} & \\text{Amoxicillin, Ampicillin, Cefazolin, Cefalexin,} \\\\
& \\text{first/second line for 26 common infections.} & \\text{antibiotic consumption} & \\text{Doxycycline, Gentamicin, Metronidazole, Co-trimoxazole} \\\\
\\hline
\\textbf{WATCH Group} & \\text{Broader spectrum, higher resistance potential;} & \\text{Key targets for institutional} & \\text{Fluoroquinolones (Ciprofloxacin, Levofloxacin),} \\\\
& \\text{priority for stewardship monitoring \u0026 audits.} & \\text{stewardship restriction} & \\text{3rd-gen Cephalosporins (Ceftriaxone, Cefotaxime),} \\\\
& & & \\text{Carbapenems (Meropenem), Macrolides (Azithromycin)} \\\\
\\hline
\\textbf{RESERVE Group} & \\text{"Last-resort" protected antimicrobials;} & \\text{Strict pre-authorization \u0026} & \\text{Ceftazidime-avibactam, Meropenem-vaborbactam,} \\\\
& \\text{reserved for confirmed multi-drug resistant bugs.} & \\text{ID specialist sign-off} & \\text{Colistin, Polymyxin B, Linezolid, Daptomycin, Tigecycline} \\\\
\\hline
\\end{array}$$

---

## 2. Core Operational Antimicrobial Stewardship Interventions

1. **Prospective Audit and Feedback (PAF)**:
   - Multidisciplinary stewardship team (Infectious Disease Physician $+$ Clinical Pharmacist) conducts real-time daily audits of active antibiotic prescriptions, providing personalized optimization feedback to treating physicians.
2. **Formulary Restriction & Pre-Authorization**:
   - High-end Watch and Reserve antibiotics (e.g. Carbapenems, Colistin, Ceftazidime-avibactam) are locked in the electronic medical record (EMR) and require formal clinical indication justification.
3. **The 48-to-72-Hour Antibiotic "Time-Out"**:
   - Structured re-evaluation of every antibiotic regimen **at $48 - 72\\text{ hours}$** post-initiation when microbiological culture and antimicrobial susceptibility testing (AST) results become available.
   - Core Action: **De-escalation** from broad-spectrum empiric coverage to the narrowest-spectrum effective agent, or discontinuation if infection is ruled out.
4. **IV-to-Oral (IV2PO) Conversion**:
   - Switching stable patients with functioning gastrointestinal tracts to high-bioavailability oral agents (e.g. Fluoroquinolones, Linezolid, Metronidazole, Doxycycline, Fluconazole: all $>90\\%$ oral bioavailability).

---

## 3. Biomarker-Guided Stewardship: Serum Procalcitonin (PCT) Kinetics

- **Procalcitonin (PCT)**: Peptide precursor of calcitonin produced by ubiquitous parenchymal tissues in response to bacterial endotoxins (LPS) and proinflammatory cytokines (IL-1$\\beta$, TNF-$\\alpha$, IL-6).
- **Viral Suppression**: Interferon-gamma (IFN-$\\gamma$) released during viral infections directly inhibits procalcitonin synthesis (PCT remains low in viral illnesses).
- **Clinical Stewardship Decision Rules (Lower Respiratory Tract Infections & Sepsis)**:
  - **$\text{PCT} <0.10\\ \\mu\\text{g/L}$**: Bacterial infection highly unlikely $\\rightarrow$ **Antibiotics strongly discouraged**.
  - **$\text{PCT } 0.10 - 0.24\\ \\mu\\text{g/L}$**: Bacterial infection unlikely $\\rightarrow$ **Antibiotics discouraged**.
  - **$\text{PCT } 0.25 - 0.49\\ \\mu\\text{g/L}$**: Bacterial infection possible $\\rightarrow$ **Antibiotics recommended**.
  - **$\text{PCT} \\ge 0.50\\ \\mu\\text{g/L}$**: Severe bacterial sepsis $\\rightarrow$ **Antibiotics strongly indicated**.
  - **Discontinuation Rule**: Stop antibiotics when PCT drops to **$<0.25\\ \\mu\\text{g/L}$** or decreases by **$\\ge 80\\%$ from peak levels**.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old male is admitted to the medical ward with community-acquired pneumonia. On admission, he was started empirically on IV Ceftriaxone (Watch group) and IV Azithromycin (Watch group). At 48 hours post-admission, the patient is afebrile, clinically improved, and tolerating oral nutrition. Blood and sputum cultures grow Streptococcus pneumoniae susceptible to Penicillin (MIC 0.03 mcg/mL) and Amoxicillin (Access group). Serum procalcitonin has fallen from 2.8 mcg/L to 0.18 mcg/L.",
      question: "Which of the following interventions reflects the best-practice Antimicrobial Stewardship (ASP) action during the 48-hour Antibiotic Time-Out?",
      options: [
        "De-escalate therapy by switching from IV Ceftriaxone/Azithromycin to Oral Amoxicillin (Access group) to complete a 5-day total course",
        "Broaden therapy to IV Meropenem to prevent secondary nosocomial superinfections",
        "Continue IV Ceftriaxone and IV Azithromycin for a mandatory 14-day inpatient duration",
        "Add IV Vancomycin and IV Colistin to eliminate potential multi-drug resistant clones"
      ],
      correctAnswerIndex: 0,
      explanation: "The 48-to-72-hour Antibiotic Time-Out is the cornerstone of antimicrobial stewardship. In this patient, microbiological identification confirms Penicillin-susceptible Streptococcus pneumoniae, and clinical and biomarker recovery (PCT <0.25 mcg/L) is established. The optimal ASP action is de-escalation from empiric broad-spectrum Watch-group agents (Ceftriaxone + Azithromycin) to targeted, narrow-spectrum Oral Amoxicillin (Access group) via an IV-to-Oral (IV2PO) switch, completing a standard 5-day course."
    }
  ]
};
