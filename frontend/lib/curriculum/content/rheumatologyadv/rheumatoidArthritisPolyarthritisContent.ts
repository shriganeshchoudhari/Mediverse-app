/**
 * Rheumatology: Rheumatoid Arthritis (RA) & Inflammatory Polyarthritis
 * Authoritative medical content derived from Kelley and Firestein's Textbook of Rheumatology (11th ed.), Robbins & Cotran.
 * Mapped to NMC CBME Competencies: IM1.3, IM1.4, PA30.1, PA30.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RHEUMATOID_ARTHRITIS_POLYARTHRITIS_MODULE: PhysiologyLessonModule = {
  id: "rheumatology-adv-rheumatoid-arthritis-polyarthritis",
  unitCode: "RH3.1",
  title: "Rheumatoid Arthritis: Synovial Pannus, Anti-CCP (ACPA), Methotrexate DMARDs & Felty Syndrome",
  competencies: ["IM1.3", "IM1.4", "PA30.1", "PA30.2"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Rheumatoid Arthritis (RA) & Synovial Immunopathology

Rheumatoid Arthritis is a chronic, systemic, inflammatory autoimmune disorder characterized by invasive proliferative synovitis (pannus) targeting diarthrodial joints.

---

## 1. Pathophysiology of Synovial Pannus Formation

$$\\begin{array}{ll}
\\hline
\\textbf{Stage} & \\textbf{Immunopathological Events} \\\\
\\hline
\\textbf{1. Autoantigen Citrullination} & \\text{Peptidylarginine deiminase (PAD) converts arginine to citrulline in joint proteins} \\\\
\\textbf{2. Synovial T-cell Infiltration} & \\text{CD4+ T helper cells (Th1/Th17) trigger massive synovial macrophage activation} \\\\
\\textbf{3. Proliferative Pannus Formation} & \\mathbf{\\text{Invasive granulation tissue (Pannus) }} \\text{composed of proliferating synoviocytes, fibroblasts,} \\\\
& \\text{inflammatory cells, and neovessels secreting } \\mathbf{\\text{TNF-}}\\boldsymbol{\\alpha}\\mathbf{\\text{, IL-1, IL-6, and MMPs}} \\\\
\\textbf{4. Cartilage \u0026 Bone Destruction} & \\text{Osteoclast activation causes subchondral marginal bone erosions and cartilage loss} \\\\
\\hline
\\end{array}$$

---

## 2. Clinical Features & Joint Distribution

- **Typical Distribution**: Symmetrical polyarthritis of **Metacarpophalangeal (MCP)**, **Proximal Interphalangeal (PIP)**, wrist, and Metatarsophalangeal (MTP) joints.
- **Strictly Spared Joints**: **Distal Interphalangeal (DIP)** joints and the **Thoracolumbar Spine** are spared (involvement suggests osteoarthritis or psoriatic arthritis).
- **Cervical Spine Exception**: Cervical spine **C1-C2 (atlantoaxial) subluxation** can occur due to transverse ligament erosion $\\rightarrow$ risk of quadriplegia during endotracheal intubation (requires flexion-extension cervical X-rays).
- **Classic Deformities**:
  - **Swan-Neck**: PIP hyperextension with DIP flexion.
  - **Boutonnière**: PIP flexion with DIP hyperextension.
  - **Ulnar Deviation**: Subluxation of MCP joints toward the ulnar side.
  - **Baker Cyst**: Synovial fluid herniation into the popliteal fossa.

---

## 3. Diagnostic Serology & Evidence-Based Pharmacotherapy

- **Serological Biomarkers**:
  - **Anti-Cyclic Citrullinated Peptide (Anti-CCP / ACPA)**: Sensitivity $70-80\\%$, **Specificity $>95\\%$** (most specific test for RA, predicts erosive disease).
  - **Rheumatoid Factor (RF)**: IgM autoantibody directed against the Fc region of human IgG (sensitivity $70-80\\%$, lower specificity).
- **First-Line Pharmacotherapy**:
  - **Methotrexate (MTX)**: Anchor DMARD (dihydrofolate reductase inhibitor); co-prescribe daily **Folic Acid** to reduce hepatotoxicity and stomatitis; monitor CBC and liver enzymes; contraindicated in pregnancy (teratogen).
  - **Biologic DMARDs (TNF-$\\alpha$ Inhibitors: Infliximab, Adalimumab, Etanercept)**: Indicated for MTX-refractory disease $\\rightarrow$ **mandatory pre-treatment screening for Latent Tuberculosis (IGRA / PPD)** and Hepatitis B.
- **Felty Syndrome**: Triad of **Severe Rheumatoid Arthritis $+$ Splenomegaly $+$ Neutropenia (Absolute Neutrophil Count $<1,500/\\mu\\text{L}$)** $\rightarrow$ high risk of serious bacterial infections.
`,
  clinicalVignettes: [
    {
      scenario: "A 46-year-old female presents with bilateral hand and wrist pain and swelling lasting 5 months. She reports severe stiffness in her fingers every morning that takes over 2 hours to improve with activity. Physical examination reveals warm, tender, spongy swelling of the bilateral 2nd, 3rd, and 4th MCP and PIP joints, with sparing of all DIP joints and the lumbar spine. Hand radiographs show periarticular osteopenia and marginal bone erosions at the radial aspect of the 2nd MCP joint. Serology is positive for Anti-Cyclic Citrullinated Peptide (Anti-CCP) antibodies at >250 U/mL (Normal <20 U/mL).",
      question: "Which of the following represents the first-line disease-modifying antirheumatic drug (DMARD) of choice and its mandatory concurrent supplement?",
      options: [
        "Oral Methotrexate combined with daily Folic Acid supplementation",
        "Oral Prednisone monotherapy as definitive long-term disease modification",
        "Immediate initiation of Infliximab without prior screening for infectious diseases",
        "High-dose oral Indomethacin as sole chronic therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient demonstrates classic early, active, erosive Rheumatoid Arthritis supported by symmetrical small joint polyarthritis, prolonged morning stiffness (>1 hour), marginal bone erosions, and highly specific Anti-CCP antibody positivity (>95% specificity). The international gold-standard first-line anchor DMARD is Methotrexate, which should be initiated promptly to halt radiographic progression and joint destruction, co-prescribed with daily Folic Acid supplementation to reduce the incidence of gastrointestinal toxicity, oral ulcers, and transaminitis."
    }
  ]
};
