/**
 * Postgraduate Advanced Otorhinolaryngology & Rhinology: FESS, Skull Base Danger Zones & CSF Leak Repair
 * Authoritative rhinology and endoscopic skull base surgical content derived from AAO-HNS Rhinology, Hadad-Bassagasteguy Protocol.
 * Mapped to NMC PG CBME Competencies: PG9.2, ENT2.1, ENT2.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE: PhysiologyLessonModule = {
  id: "pg9-endoscopic-sinus-skull-base-csf-leak",
  unitCode: "PG9.2",
  title: "Endoscopic Sinus Surgery (FESS), Keros Skull Base Anatomy & Hadad Nasoseptal Flap CSF Repair",
  competencies: ["PG9.2", "ENT2.1", "ENT2.2"],
  estimatedMinutes: 180,
  organ3dTarget: "RESPIRATORY",
  markdownContent: `
# Functional Endoscopic Sinus Surgery (FESS), Skull Base Danger Zones & CSF Leak Repair

Endoscopic sinus and skull base surgery demands meticulous identification of fixed anatomical landmarks, recognition of variable skull base heights, and vascularized reconstructive techniques for dural defects.

---

## 1. Keros Classification of Cribriform Plate Depth & Danger Zones

$$\\begin{array}{lcccc}
\\hline
\\textbf{Keros Type} & \\textbf{Olfactory Fossa Depth (Height of Lateral Lamella)} & \\textbf{Intracranial Perforation Risk} & \\textbf{Surgical Precautions} \\\\
\\hline
\\textbf{Keros Type I} & 1-3\\text{ mm} & \\text{Low risk; flat ethmoid roof} & \\text{Standard dissection} \\\\
\\textbf{Keros Type II} & 4-7\\text{ mm (70\\% of population)} & \\text{Moderate risk} & \\text{Identify ethmoid roof angle} \\\\
\\textbf{Keros Type III} & \\mathbf{8-16\\text{ mm (deepest olfactory fossa)}} & \\mathbf{\\text{Highest risk of intracranial penetration}} & \\mathbf{\\text{Lateral lamella of cribriform plate}} \\\\
& & \\mathbf{\\text{and CSF rhinorrhea}} & \\mathbf{\\text{is paper-thin (0.1 mm) and vulnerable!}} \\\\
\\hline
\\end{array}$$

---

## 2. CSF Leak Localization & Vascularized Nasoseptal Flap Reconstruction

$$\\begin{array}{lcccc}
\\hline
\\textbf{Reconstructive Component} & \\textbf{Anatomic / Technical Detail} & \\textbf{Clinical Role \\& Success Rate} \\\\
\\hline
\\textbf{Diagnostic Biomarker} & \\mathbf{\\text{Beta-2 Transferrin (or Beta-trace protein)}} & \\mathbf{\\text{Gold-standard confirmation of CSF in nasal fluid}} \\\\
\\textbf{Vascularized Flap} & \\mathbf{\\text{Hadad-Bassagasteguy Nasoseptal Flap}} & \\mathbf{\\text{Pedicled on posterior septal branch of SPA;}} \\\\
& & \\mathbf{> 95\\% \\text{ primary skull base closure rate}} \\\\
\\textbf{Multi-Layer Technique} & \\text{Fascia lata underlay + Hadad overlay + tissue sealant} & \\text{Prevents pneumocephalus and recurrent meningitis} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 44-year-old female presents with persistent, clear, watery rhinorrhea from her right nostril for 3 weeks following a motor vehicle collision with facial trauma. The drainage increases markedly when leaning forward ('tea-pot sign') and is accompanied by a metallic taste. High-resolution coronal CT of the paranasal sinuses reveals a Keros Type III cribriform plate configuration with a 4 mm bony defect in the right lateral lamella of the cribriform plate with intracranial air. Beta-2 transferrin testing of the collected nasal fluid is positive.",
      question: "What is the diagnosis, and what is the definitive endoscopic skull base reconstructive approach?",
      options: [
        "Cribriform plate cerebrospinal fluid (CSF) fistula with pneumocephalus in a high-risk Keros Type III anatomy; manage with endoscopic endonasal skull base repair using a multilayered closure consisting of an autologous fascia lata/fascia graft underlay followed by a vascularized Hadad-Bassagasteguy Nasoseptal Flap overlay pedicled on the posterior septal branch of the sphenopalatine artery",
        "Allergic rhinitis; prescribe intranasal fluticasone and oral cetirizine only",
        "Vasomotor rhinitis; perform chemical cautery of the inferior turbinates",
        "Acute maxillary sinusitis; perform unilateral maxillary antrostomy without dural repair"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates post-traumatic CSF rhinorrhea: (1) Diagnosis: Positive Beta-2 transferrin is pathognomonic for CSF; Keros Type III (depth 8-16 mm) has the thinnest lateral lamella prone to fractures; (2) Endoscopic Reconstruction: The Hadad-Bassagasteguy vascularized nasoseptal flap provides a robust, resilient pedicled mucosal barrier achieving >95% primary healing, preventing ascending bacterial meningitis."
    }
  ]
};
