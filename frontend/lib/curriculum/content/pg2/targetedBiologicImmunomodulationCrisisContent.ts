/**
 * Postgraduate Advanced Internal Medicine: Targeted Biologic Immunomodulation in Autoimmune Crises
 * Authoritative rheumatology and immunology content derived from ACR/EULAR Guidelines, UpToDate Advanced Biologics.
 * Mapped to NMC PG CBME Competencies: PG2.4, RH1.1, RH1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const TARGETED_BIOLOGIC_IMMUNOMODULATION_CRISIS_MODULE: PhysiologyLessonModule = {
  id: "pg2-targeted-biologic-immunomodulation-crisis",
  unitCode: "PG2.4",
  title: "Targeted Biologic Immunomodulation: Rituximab, Eculizumab, Tocilizumab & Cytokine Storm Antagonisms",
  competencies: ["PG2.4", "RH1.1", "RH1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Targeted Biologics in Autoimmune & Rheumatologic Crises

Precision monoclonal antibodies and receptor antagonists halt hyperinflammatory cascades, prevent end-organ necrosis, and treat refractory rheumatologic emergencies.

---

## 1. Targeted Biologic Drug Classification & Black Box Warnings

$$\\begin{array}{lcccc}
\\hline
\\textbf{Biologic Agent} & \\textbf{Molecular Mechanism} & \\textbf{Primary Clinical Indications} & \\textbf{Mandatory Pre-Treatment Screening} \\\\
\\hline
\\textbf{Rituximab} & \\mathbf{\\text{Anti-CD20 Monoclonal Ab}} & \\text{ANCA Vasculitis (GPA/MPA), Refractory} & \\mathbf{\\text{Hepatitis B Serology (HBsAg, anti-HBc)}} \\\\
& \\text{(B-cell lysis via ADCC & CDC)} & \\text{Lupus Nephritis, Cryoglobulinemia, ITP} & (\\mathbf{\\text{High risk fatal HBV reactivation; Entecavir}}) \\\\
\\textbf{Eculizumab /} & \\mathbf{\\text{Anti-C5 Terminal Complement}} & \\mathbf{\\text{Atypical Hemolytic Uremic Syndrome (aHUS),}} & \\mathbf{\\text{Meningococcal Vaccination (MenACWY + MenB)}} \\\\
\\textbf{Ravulizumab} & \\text{(Blocks C5b-9 MAC assembly)} & \\mathbf{\\text{Paroxysmal Nocturnal Hemoglobinuria (PNH)}} & \\mathbf{+\\text{ Prophylactic oral Penicillin / Cipro}} \\\\
\\textbf{Tocilizumab /} & \\mathbf{\\text{Anti-IL-6 Receptor Antagonist}} & \\mathbf{\\text{Giant Cell Arteritis (GCA), Takayasu,}} & \\text{Latent TB screening, lipid monitoring;} \\\\
\\textbf{Sarilumab} & \\text{(Inhibits JAK-STAT signalling)} & \\mathbf{\\text{CAR-T Cytokine Release Syndrome (CRS)}} & \\mathbf{\\text{Artificially suppresses CRP/ESR within hours}} \\\\
\\textbf{Anakinra} & \\mathbf{\\text{Recombinant IL-1 Receptor}} & \\mathbf{\\text{Macrophage Activation Syndrome (MAS / sHLH),}} & \\text{Neutrophil count tracking;} \\\\
& \\text{Antagonist (IL-1Ra)} & \\text{Adult-onset Still's disease, Refractory Gout} & \\text{rapid 4-6h half-life allows titratability} \\\\
\\hline
\\end{array}$$

---

## 2. Complement Inhibition in Thrombotic Microangiopathy (aHUS)

- **Pathophysiology of aHUS**:
  - Uncontrolled alternative complement pathway activation due to mutations in Factor H, Factor I, or MCP/CD46 leads to continuous C5 cleavage, generating potent anaphylatoxin C5a and the cytotoxic Membrane Attack Complex (MAC / C5b-9).
  - Unopposed endothelial injury causes microvascular platelet thrombosis, microangiopathic hemolytic anemia (schistocytes on smear), and acute oliguric renal failure.
- **Eculizumab Rescue Protocol**:
  - Eculizumab binds with high affinity to C5, terminating MAC assembly and halting endothelial destruction within 24-48 hours.

---

## 3. Cytokine Storm & Macrophage Activation Syndrome (MAS)

- **Diagnostic Biomarkers**:
  - Extreme hyperferritinemia ($>5{,}000-10{,}000\\text{ ng/mL}$), hypertriglyceridemia, hypofibrinogenemia, hepatosplenomegaly, and pancytopenia.
- **Therapeutic Rescue**:
  - High-dose intravenous **Anakinra ($1-2\\text{ mg/kg}$ Q6H IV)** specifically neutralizes IL-1$\\beta$-driven macrophage hyperactivation.
`,
  clinicalVignettes: [
    {
      scenario: "A 28-year-old female presents with acute oliguric renal failure (creatinine 6.2 mg/dL), severe thrombocytopenia (platelets 18,000/mcL), non-immune microangiopathic hemolytic anemia with numerous schistocytes (4.5% on peripheral smear, LDH 1,850 IU/L, haptoglobin <10 mg/dL), and normal ADAMTS13 activity (68%, ruling out TTP). A diagnosis of complement-mediated Atypical Hemolytic Uremic Syndrome (aHUS) is established. The rheumatology/nephrology team prepares to start the terminal complement inhibitor Eculizumab.",
      question: "What life-threatening infection risk is associated with Eculizumab therapy, and what mandatory antimicrobial prophylaxis must be instituted immediately?",
      options: [
        "Eculizumab blocks the terminal complement cascade (C5b-9 MAC assembly), creating a >1,000-fold increased risk of fulminant, fatal Neisseria meningitidis (meningococcal) sepsis; patients must immediately receive both meningococcal conjugate (MenACWY) and serogroup B (MenB) vaccines, and since vaccination requires 2 weeks for protective antibody titers, mandatory immediate antibacterial prophylaxis with daily oral Penicillin VK or Ciprofloxacin must be initiated concurrently",
        "Pneumocystis jirovecii pneumonia; start IV Voriconazole",
        "Cytomegalovirus reactivation; start Ganciclovir",
        "No antimicrobial prophylaxis is required; administer live MMR vaccine"
      ],
      correctAnswerIndex: 0,
      explanation: "This case highlights precision biologic therapy in complement disorders: (1) Mechanism & Risk: The Membrane Attack Complex (C5b-9) is essential for host defense against encapsulated Neisseria species. Blocking C5 with Eculizumab/Ravulizumab causes extreme susceptibility to fatal meningococcal meningitis and bacteremia; (2) Prevention Bundle: FDA and international guidelines mandate vaccination with both quadrivalent (MenACWY) and MenB vaccines PLUS immediate daily antibiotic prophylaxis (Penicillin or Ciprofloxacin) during therapy and for at least 2 weeks after initial vaccination."
    }
  ]
};
