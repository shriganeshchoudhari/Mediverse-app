/**
 * Postgraduate Advanced Ophthalmology & Medical Retina: Neovascular AMD & Diabetic Maculopathy
 * Authoritative medical retina content derived from AAO PPP Retina, DRCR.net Protocols, TENAYA/LUCERNE Trials.
 * Mapped to NMC PG CBME Competencies: PG8.2, OP2.1, OP2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE: PhysiologyLessonModule = {
  id: "pg8-neovascular-amd-diabetic-macular-edema",
  unitCode: "PG8.2",
  title: "Neovascular AMD & Diabetic Macular Edema: OCT Biomarkers, Anti-VEGF & Dual Ang-2 Inhibition",
  competencies: ["PG8.2", "OP2.1", "OP2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Neovascular AMD, Diabetic Macular Edema (DME) & Anti-VEGF Therapeutics

Choroidal and retinal vascular exudative diseases are the leading causes of irreversible central blindness, driven by VEGF-A overexpression, vascular hyperpermeability, and Angiopoietin-2 mediated inflammation.

---

## 1. Classification of Macular Neovascularization & OCT Biomarkers

$$\\begin{array}{lcccc}
\\hline
\\textbf{MNV Subtype} & \\textbf{Anatomic Location / Layer} & \\textbf{OCT / OCTA Biomarkers} & \\textbf{Fluorescein Angiography} \\\\
\\hline
\\textbf{Type 1 (Occult)} & \\text{Sub-RPE (beneath retinal pigment epithelium)} & \\text{Double-layer sign; fibrovascular PED} & \\text{Stippled hyperfluorescence} \\\\
\\textbf{Type 2 (Classic)} & \\mathbf{\\text{Subretinal (above RPE, below neuroretina)}} & \\mathbf{\\text{Subretinal hyperreflective material (SHRM)}} & \\mathbf{\\text{Early well-defined lace-like leakage}} \\\\
\\textbf{Type 3 (RAP)} & \\text{Intraretinal angiomatous proliferation} & \\text{Intraretinal fluid, retinal-retinal shunts} & \\text{Hotspot with surrounding edema} \\\\
\\textbf{Diabetic Macular Edema} & \\text{Breakdown of inner/outer blood-retinal barrier} & \\mathbf{\\text{Intraretinal cysts (IRF), SRF, CST } > 350\\;\\mu\\text{m}} & \\text{Petaloid flower-like macular leak} \\\\
\\hline
\\end{array}$$

---

## 2. Intravitreal Anti-VEGF & Bispecific Molecular Pharmacology

$$\\begin{array}{lcccc}
\\hline
\\textbf{Therapeutic Agent} & \\textbf{Molecular Structure \\& Target} & \\textbf{Standard Dosing} & \\textbf{Durability \\& Clinical Distinction} \\\\
\\hline
\\textbf{Faricimab (Vabysmo)} & \\mathbf{\\text{Bispecific antibody: VEGF-A + Angiopoietin-2}} & \\mathbf{6.0\\text{ mg intravitreal}} & \\mathbf{\\text{Extends intervals up to Q16 weeks;}} \\\\
& & & \\text{stabilizes vascular endothelial junctions} \\\\
\\textbf{Aflibercept (Eylea)} & \\text{Soluble VEGF decoy receptor (VEGF-A/B, PlGF)} & 2.0\\text{ mg / } 8.0\\text{ mg HD} & \\text{High binding affinity; Q8 to Q16 weeks} \\\\
\\textbf{Ranibizumab (Lucentis)} & \\text{Recombinant Fab fragment against all VEGF-A} & 0.5\\text{ mg intravitreal} & \\text{Monthly / Treat-and-Extend protocols} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 72-year-old female presents with rapid onset distortion of straight lines (metamorphopsia) and central scotoma in her left eye over 2 weeks. Visual acuity is 20/70 OS. Dilated fundus examination reveals subretinal hemorrhage, lipid exudation, and gray-green subfoveal lesion. Spectral-Domain OCT demonstrates extensive subretinal fluid (SRF), subretinal hyperreflective material (SHRM), and intraretinal cystoid spaces with a Central Subfield Thickness (CST) of 460 micrometers. OCT-Angiography confirms a Type 2 classic choroidal neovascular membrane breaching Bruch's membrane.",
      question: "What is the diagnosis, what is the first-line pharmacotherapeutic approach, and what molecular advantage does Faricimab offer in treatment extension?",
      options: [
        "Neovascular (Wet) Age-Related Macular Degeneration (nAMD) with Type 2 Classic Macular Neovascularization; initiate immediate intravitreal Anti-VEGF therapy (e.g., Aflibercept, Ranibizumab, or Faricimab) using a Treat-and-Extend protocol until complete fluid resolution; Faricimab provides dual inhibition of both VEGF-A and Angiopoietin-2 (Ang-2), stabilizing endothelial pericyte coverage, reducing vascular permeability, and enabling durable treatment intervals up to every 16 weeks",
        "Dry AMD with geographic atrophy; prescribe high-dose oral Vitamin C and E only",
        "Central Serous Chorioretinopathy; perform immediate focal thermal grid laser across the fovea",
        "Macular hole; perform immediate vitrectomy with internal limiting membrane peeling"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates active neovascular AMD: (1) Pathophysiology: Type 2 CNV penetrates through Bruch's membrane into the subretinal space, causing exudative fluid accumulation and metamorphopsia; (2) Anti-VEGF Therapy: Intravitreal VEGF inhibitors are gold standard to dry intraretinal/subretinal fluid and preserve photoreceptors; (3) Faricimab Dual Mechanism: By neutralizing both VEGF-A and Angiopoietin-2, Faricimab addresses inflammation and vascular destabilization, extending durability up to 16-week intervals."
    }
  ]
};
