/**
 * Clinical Immunology: Immune Checkpoint Inhibitors & irAEs
 * Authoritative medical content derived from ASCO/SITC Guidelines, Abbas Cellular & Molecular Immunology.
 * Mapped to NMC CBME Competencies: IM1.5, IM1.6, PE18.3, MD38.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CHECKPOINT_INHIBITORS_IRAES_MODULE: PhysiologyLessonModule = {
  id: "immunology-adv-checkpoint-inhibitors-iraes",
  unitCode: "IM5.1",
  title: "Immune Checkpoint Inhibitors (CTLA-4, PD-1, PD-L1) & Immune-Related Adverse Events (irAEs)",
  competencies: ["IM1.5", "IM1.6", "PE18.3", "MD38.3"],
  estimatedMinutes: 150,
  organ3dTarget: "CARDIOVASCULAR",
  markdownContent: `
# Immune Checkpoint Blockade & Immune-Related Adverse Events (irAEs)

Immune checkpoint inhibitors (ICIs) unleash anti-tumor T-cell responses by blocking co-inhibitory receptors, but concurrently precipitate systemic autoimmune toxicities known as immune-related adverse events (irAEs).

---

## 1. Checkpoint Receptor Biology & Targeted Agents

$$\\begin{array}{lcccc}
\\hline
\\textbf{Checkpoint Pathway} & \\textbf{Physiological Location} & \\textbf{Mechanism of Inhibition} & \\textbf{Therapeutic Monoclonal Antibodies} & \\textbf{Primary Oncology Indications} \\\\
\\hline
\\textbf{CTLA-4} & \\text{Secondary lymphoid organs} & \\mathbf{\\text{Competitively binds B7-1/B7-2}} & \\mathbf{\\text{Ipilimumab (Yervoy)}} & \\text{Melanoma, RCC, HCC, NSCLC} \\\\
\\text{(CD152)} & \\text{(Lymph node T-cell priming)} & \\mathbf{\\text{preventing CD28 costimulation}} & & \\text{(often combined with Nivolumab)} \\\\
\\textbf{PD-1} & \\text{Peripheral tissues \u0026 tumor} & \\mathbf{\\text{Recruits SHP-2 phosphatase,}} & \\mathbf{\\text{Pembrolizumab (Keytruda),}} & \\text{Melanoma, NSCLC, MSI-H CRC,} \\\\
\\text{(CD279)} & \\text{microenvironment} & \\mathbf{\\text{dephosphorylating TCR cascade}} & \\mathbf{\\text{Nivolumab (Opdivo), Cemiplimab}} & \\text{Hodgkin Lymphoma, Head \u0026 Neck} \\\\
\\textbf{PD-L1} & \\text{Tumor cells, Macrophages,} & \\text{Binds PD-1 on T cells inducing} & \\mathbf{\\text{Atezolizumab (Tecentriq),}} & \\text{SCLC, Triple-negative breast,} \\\\
\\text{(CD274)} & \\text{Dendritic cells} & \\text{peripheral T-cell exhaustion} & \\mathbf{\\text{Durvalumab (Imfinzi), Avelumab}} & \\text{Urothelial carcinoma} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Immune-Related Adverse Events (irAEs) & Management

$$\\begin{array}{lccc}
\\hline
\\textbf{Target Organ} & \\textbf{Clinical Presentation} & \\textbf{Diagnostic Findings} & \\textbf{Evidence-Based Management} \\\\
\\hline
\\textbf{Gastrointestinal} & \\mathbf{\\text{Immune-Mediated Colitis}} & \\text{Fecal calprotectin } \\uparrow, & \\text{Hold ICI; } \\mathbf{\\text{Prednisone 1-2 mg/kg/day;}} \\\\
& \\text{(Watery diarrhea, abdominal pain)} & \\text{mucosal ulceration on colonoscopy} & \\mathbf{\\text{Infliximab for steroid-refractory}} \\\\
\\textbf{Endocrine} & \\mathbf{\\text{Hypophysitis (Pituitary)}} & \\mathbf{\\downarrow\\text{ACTH, } \\downarrow\\text{TSH, } \\downarrow\\text{Cortisol;}} & \\mathbf{\\text{Hormone replacement (Hydrocortisone +}} \\\\
& \\text{(Headache, visual changes, fatigue)} & \\text{enlarged pituitary on brain MRI} & \\mathbf{\\text{Levothyroxine); rarely need to stop ICI}} \\\\
\\textbf{Pulmonary} & \\mathbf{\\text{Immune Pneumonitis}} & \\text{Bilateral ground-glass opacities} & \\text{Hold ICI; high-dose IV Methylprednisolone;} \\\\
& \\text{(Dry cough, dyspnea, hypoxemia)} & \\text{on high-resolution chest CT} & \\text{Mycophenolate Mofetil / Infliximab if refractory} \\\\
\\textbf{Cardiovascular} & \\mathbf{\\text{Fulminant Myocarditis}} & \\mathbf{\\uparrow\\text{Troponin, conduction block, VT;}} & \\mathbf{\\text{PERMANENTLY DISCONTINUE ICI;}} \\\\
& (\\text{Rare } <1\\%, \\mathbf{>40\\% \\text{ mortality}}) & \\text{myocardial edema on cardiac MRI} & \\mathbf{\\text{Pulse Methylprednisolone (1 g/day) + Abatacept}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old male with metastatic melanoma receiving combination immunotherapy with Ipilimumab (anti-CTLA-4) and Nivolumab (anti-PD-1) presents on week 6 with severe non-bloody watery diarrhea (8-10 episodes per day), severe cramping lower abdominal pain, low-grade fever, and dehydration. Flexible sigmoidoscopy reveals diffuse mucosal erythema, loss of vascular pattern, and deep punch-out ulcerations throughout the rectosigmoid colon. Stool testing for Clostridioides difficile, viral pathogens, and bacterial cultures is completely negative.",
      question: "What is the diagnosis, and what is the definitive initial management strategy for this immune-related adverse event (irAE)?",
      options: [
        "Grade 3 Immune Checkpoint Inhibitor-induced Colitis; Permanently hold Ipilimumab/Nivolumab, initiate intravenous Methylprednisolone 1-2 mg/kg/day, and consider Infliximab if symptoms fail to improve within 48-72 hours",
        "Infectious traveler's diarrhea; Initiate oral Ciprofloxacin and Loperamide",
        "Mild irAE; Continue Ipilimumab at full dose and prescribe oral bismuth subsalicylate",
        "Acute appendicitis; Schedule immediate emergent laparoscopic appendectomy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient has severe (Grade 3) Immune-Mediated Colitis induced by dual checkpoint blockade (anti-CTLA-4 + anti-PD-1). Checkpoint inhibition breaks peripheral tolerance, allowing autoreactive T-cell clones to attack the gastrointestinal mucosa. According to ASCO/SITC guidelines, Grade 3/4 colitis requires immediate cessation of checkpoint inhibitor therapy, hospitalization, and prompt initiation of high-dose systemic corticosteroids (IV Methylprednisolone 1-2 mg/kg/day). If significant clinical improvement is not achieved within 48-72 hours, the TNF-alpha inhibitor Infliximab or anti-integrin Vedolizumab must be administered as steroid-refractory rescue."
    }
  ]
};
