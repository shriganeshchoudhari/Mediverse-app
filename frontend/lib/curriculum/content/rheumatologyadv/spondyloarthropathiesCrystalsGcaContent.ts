/**
 * Rheumatology: Spondyloarthropathies, Crystal Arthropathies (Gout vs CPPD) & Giant Cell Arteritis
 * Authoritative medical content derived from Kelley and Firestein's Textbook of Rheumatology (11th ed.), Robbins & Cotran.
 * Mapped to NMC CBME Competencies: IM1.7, IM1.8, PA32.1, PA32.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SPONDYLOARTHROPATHIES_CRYSTALS_GCA_MODULE: PhysiologyLessonModule = {
  id: "rheumatology-adv-spondyloarthropathies-crystals-gca",
  unitCode: "RH7.1",
  title: "Ankylosing Spondylitis (HLA-B27), Gout vs Pseudogout Crystals & Giant Cell Arteritis",
  competencies: ["IM1.7", "IM1.8", "PA32.1", "PA32.2"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Spondyloarthropathies, Crystal Arthropathies & Vasculitis

This module encompasses **HLA-B27 Seronegative Spondyloarthropathies**, microcrystalline inflammatory arthritis (**Gout vs Pseudogout**), and large-vessel **Giant Cell Arteritis**.

---

## 1. Crystal Arthropathies: Gout vs Pseudogout (CPPD)

$$\\begin{array}{lcc}
\\hline
\\textbf{Diagnostic Feature} & \\textbf{Gout} & \\textbf{Pseudogout (CPPD)} \\\\
\\hline
\\textbf{Crystal Chemical Composition} & \\mathbf{\\text{Monosodium Urate (MSU)}} & \\mathbf{\\text{Calcium Pyrophosphate Dihydrate (CPPD)}} \\\\
\\textbf{Crystal Morphology} & \\mathbf{\\text{Needle-shaped (fine, pointed)}} & \\mathbf{\\text{Rhomboid / Rod-shaped (polygonal)}} \\\\
\\textbf{Polarized Light Birefringence} & \\mathbf{\\text{STRONGLY NEGATIVE (Bright)}} & \\mathbf{\\text{WEAKLY POSITIVE}} \\\\
\\textbf{Compensator Alignment} & \\mathbf{\\text{YELLOW when parallel to axis}} & \\mathbf{\\text{BLUE when parallel to axis}} \\\\
& \\text{(BLUE when perpendicular)} & \\text{(YELLOW when perpendicular)} \\\\
\\textbf{Most Common Joint} & \\mathbf{\\text{1st MTP joint (Podagra in 50-70\\%)}} & \\mathbf{\\text{Knee joint (50\\%)}}, \\text{wrist, symphysis} \\\\
\\textbf{Classic Radiograph Finding} & \\text{Punched-out erosions with overhanging edges} & \\mathbf{\\text{Chondrocalcinosis (linear cartilage calcification)}} \\\\
\\textbf{Systemic Associations} & \\text{Hyperuricemia, alcohol, purine-rich diet} & \\mathbf{\\text{Hemochromatosis, Hyperparathyroidism}} \\\\
\\textbf{Acute Treatment} & \\text{NSAIDs (Indomethacin), Colchicine, Steroids} & \\text{NSAIDs, intra-articular steroid injection, Colchicine} \\\\
\\textbf{Chronic Therapy} & \\mathbf{\\text{Allopurinol / Febuxostat (Xanthine Oxidase Inh)}} & \\text{Treat underlying metabolic condition} \\\\
\\hline
\\end{array}$$

---

## 2. Seronegative Spondyloarthropathies (PAIR)

- **Common Features**: Strong association with **HLA-B27**, absence of rheumatoid factor (seronegative), axial involvement (sacroiliitis), enthesitis (inflammation at tendon insertions, e.g. Achilles tendonitis), dactylitis (\"sausage digit\"), and anterior uveitis.
- **Ankylosing Spondylitis (AS)**:
  - Young male presenting with chronic inflammatory lower back pain and morning stiffness that **improves with physical activity and exercise** (worsens with rest).
  - Radiography: Bilateral symmetrical sacroiliitis progressing to squaring of vertebral bodies and marginal syndesmophytes creating a **\"Bamboo Spine\"**.
  - Systemic Complications: Restrictive pulmonary defect (rigid ribcage), ascending aortic regurgitation, apical pulmonary fibrosis.
  - Pharmacotherapy: First-line **NSAIDs $+$ physical therapy**; second-line **TNF-$\\alpha$ inhibitors** (Infliximab, Adalimumab) or IL-17 inhibitors (Secukinumab).

---

## 3. Giant Cell (Temporal) Arteritis (GCA) Emergency Protocol

- **Epidemiology**: Granulomatous large-vessel vasculitis in individuals **$>50\\text{ years of age}$**.
- **Clinical Presentation**: Unilateral temporal throbbing headache, scalp tenderness (pain when brushing hair), **jaw claudication while chewing**, and amaurosis fugax (transient monocular visual loss).
- **Catastrophic Risk**: Occlusion of posterior ciliary arteries $\\rightarrow$ **Anterior Ischemic Optic Neuropathy (AION)** causing **irreversible permanent blindness**.
- **Diagnostic Findings**: Marked elevation in Erythrocyte Sedimentation Rate (**ESR $>50-100\\text{ mm/h}$**) and CRP; temporal artery biopsy shows transmural granulomatous inflammation with multinucleated giant cells and disruption of the internal elastic lamina.
- **Immediate Life-Saving Protocol**: **ADMINISTER HIGH-DOSE SYSTEMIC CORTICOSTEROIDS IMMEDIATELY!** (Do not delay steroids to obtain a biopsy or imaging; prompt therapy prevents contralateral blindness).
`,
  clinicalVignettes: [
    {
      scenario: "A 71-year-old female presents to the acute care clinic complaining of a severe, new-onset right-sided throbbing headache, tenderness over her right scalp when combing her hair, and cramping pain in her jaw muscles when chewing meat. This morning she experienced a 10-minute episode of transient painless vision loss in her right eye ('like a curtain coming down'). Vital signs: Temp 37.8°C, BP 138/82 mmHg. Palpation reveals a tender, nodular, non-pulsatile right temporal artery. Laboratory evaluation demonstrates: ESR 104 mm/h (Normal <30 mm/h) and CRP 48 mg/L.",
      question: "Which of the following represents the immediate next step in management to prevent permanent, irreversible bilateral blindness?",
      options: [
        "Immediate administration of high-dose intravenous Methylprednisolone (or high-dose oral Prednisone 60 mg daily) prior to scheduling a temporal artery biopsy",
        "Perform an immediate temporal artery biopsy and withhold corticosteroids until histopathology confirms giant cells",
        "Obtain an emergency contrast-enhanced CT angiogram of the head and neck before starting therapy",
        "Initiate oral Methotrexate monotherapy and schedule outpatient rheumatology follow-up"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic signs and symptoms of Giant Cell (Temporal) Arteritis: age >50, new-onset temporal headache, scalp tenderness, jaw claudication, marked ESR elevation (>100 mm/h), and amaurosis fugax. She is at imminent risk of irreversible permanent blindness due to ischemic optic neuropathy. The absolute golden rule in suspected GCA is to administer high-dose systemic Corticosteroids IMMEDIATELY without waiting for biopsy results or imaging. Corticosteroids will not alter biopsy histology for up to 1-2 weeks and will protect the contralateral eye from catastrophic ischemic blindness."
    }
  ]
};
