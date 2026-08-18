/**
 * Clinical Radiology: HRCT Chest Patterns & Pulmonary Pathology
 * Authoritative medical content derived from Webb's HRCT of the Lung (5th ed.), Brant and Helms'.
 * Mapped to NMC CBME Competencies: RD1.3, RD1.4, MD39.2, SU37.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const HRCT_CHEST_PATTERNS_PATHOLOGY_MODULE: PhysiologyLessonModule = {
  id: "radiology-adv-hrct-chest-patterns",
  unitCode: "RD3.1",
  title: "High-Resolution Chest CT (HRCT): UIP Honeycombing, NSIP Subpleural Sparing & The CT Halo Sign",
  competencies: ["RD1.3", "RD1.4", "MD39.2", "SU37.2"],
  estimatedMinutes: 150,
  organ3dTarget: "PULMONARY",
  markdownContent: `
# High-Resolution Chest CT (HRCT) Patterns & Pulmonary Differential Diagnosis

HRCT slices ($1.0 - 1.5\\text{ mm}$ collimation) evaluate secondary pulmonary lobular anatomy, providing pathognomonic radiological signs for interstitial lung diseases (ILD) and pulmonary infections.

---

## 1. High-Yield HRCT Interstitial & Infectious Patterns

$$\\begin{array}{lcccc}
\\hline
\\textbf{HRCT Sign / Pattern} & \\textbf{Radiological Morphology} & \\textbf{Anatomical Distribution} & \\textbf{Pathognomonic Diagnosis} & \\textbf{Histopathology} \\\\
\\hline
\\textbf{Definite UIP Pattern} & \\mathbf{\\text{Honeycombing (thick-walled cysts)}} & \\mathbf{\\text{Subpleural \u0026 Basal predominance}} & \\mathbf{\\text{Idiopathic Pulmonary Fibrosis (IPF)}} & \\text{Temporal heterogeneity} \\\\
& + \\text{ Traction bronchiectasis} & & & \\text{fibroblastic foci} \\\\
\\textbf{NSIP Pattern} & \\text{Ground-glass opacities (GGO)} & \\mathbf{\\text{Subpleural SPARING}} & \\mathbf{\\text{Non-Specific Interstitial Pneumonia (NSIP)}} & \\text{Spatially \u0026 temporally} \\\\
& + \\text{ fine reticulations} & \\text{(spares immediate subpleural rim)} & (\\text{Systemic Sclerosis, Sjogren}) & \\text{uniform alveolar inflammation} \\\\
\\textbf{CT Halo Sign} & \\mathbf{\\text{Ground-glass halo around nodule}} & \\text{Random nodules} & \\mathbf{\\text{Angioinvasive Aspergillosis}} & \\text{Alveolar hemorrhage from} \\\\
& & & (\\text{in severely neutropenic host}) & \\text{fungal vessel occlusion} \\\\
\\textbf{Reverse Halo (Atoll)} & \\mathbf{\\text{Central GGO + dense outer crescent}} & \\text{Peripheral / Subpleural} & \\mathbf{\\text{Cryptogenic Organizing Pneumonia (COP)}} & \\text{Intra-alveolar Masson bodies} \\\\
& & & \\text{and Pulmonary Mucormycosis} & (\\text{fibroblastic plugs}) \\\\
\\textbf{Tree-in-Bud} & \\text{Branching centrilobular micro-nodules} & \\text{Centrilobular terminal bronchioles} & \\mathbf{\\text{Active Endobronchial TB / MAC}} & \\text{Caseous / purulent bronchiolitis} \\\\
\\hline
\\end{array}$$

---

## 2. Differentiating UIP from NSIP on HRCT

- **UIP (Idiopathic Pulmonary Fibrosis)**:
  - **Honeycombing is mandatory**: Multi-layered clustered cystic airspaces ($3-10\\text{ mm}$) sharing thick fibrotic walls in a strict subpleural and basilar gradient.
  - Minimal or absent ground-glass opacities; poor prognosis (median survival $3-5\\text{ years}$).
- **NSIP (Connective Tissue Disease-Associated ILD)**:
  - **Subpleural sparing is pathognomonic**: Ground-glass opacities and fine reticulations characteristically spare the subpleural lung rim ($2-5\\text{ mm}$ thickness).
  - Absence of true honeycombing; highly responsive to systemic corticosteroids and immunosuppression.
`,
  clinicalVignettes: [
    {
      scenario: "A 42-year-old male with acute myeloid leukemia undergoing induction chemotherapy develops profound prolonged neutropenia (Absolute Neutrophil Count ANC <100/uL). On day 14, he develops high fevers (39.2°C), pleuritic right-sided chest pain, and dry cough refractory to 5 days of intravenous Cefepime and Vancomycin. High-resolution chest CT (HRCT) demonstrates multiple discreet dense pulmonary nodules surrounded by a circumferential halo of ground-glass attenuation (CT Halo Sign). Serum galactomannan antigen is positive.",
      question: "What is the diagnosis, and what is the underlying histopathological mechanism responsible for the CT Halo Sign?",
      options: [
        "Angioinvasive Pulmonary Aspergillosis; Central ischemic fungal necrotic infarct surrounded by a rim of alveolar hemorrhage from fungal vascular invasion",
        "Pneumocystis jirovecii pneumonia; Diffuse intra-alveolar foamy eosinophilic exudate",
        "Bacterial aspiration abscess; Liquefactive necrosis with gas-fluid level",
        "Cryptogenic Organizing Pneumonia; Alveolar Masson polypoid fibroblastic plugs"
      ],
      correctAnswerIndex: 0,
      explanation: "In a severely neutropenic immunocompromised patient, the CT Halo Sign (a dense nodular consolidation surrounded by a perimeter of ground-glass opacity) is pathognomonic for Angioinvasive Aspergillosis. Aspergillus fumigatus hyphae invade and occlude small-to-medium pulmonary arterioles, causing an ischemic coagulative necrotic infarct (the central dense nodule) surrounded by an expanding perimeter of alveolar hemorrhage (the ground-glass halo). The first-line therapeutic agent is intravenous Voriconazole or Isavuconazole."
    }
  ]
};
