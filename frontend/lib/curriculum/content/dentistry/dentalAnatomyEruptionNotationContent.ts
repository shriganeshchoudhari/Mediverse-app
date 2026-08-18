/**
 * Dentistry & Maxillofacial Surgery: Dental Anatomy, Eruption Chronology & Tooth Numbering Systems
 * Authoritative medical content derived from Wheeler's Dental Anatomy, Ten Cate's Oral Histology, and INBDE/USMLE.
 * Mapped to NMC CBME Competencies: DE1.1, DE1.2, DE2.1, DE2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const DENTAL_ANATOMY_ERUPTION_NOTATION_MODULE: PhysiologyLessonModule = {
  id: "dentistry-dental-anatomy-eruption-notation",
  unitCode: "DE1.1",
  title: "Dental Anatomy, Eruption Chronology, Palmer/FDI Notation & Caries Microbiology",
  competencies: ["DE1.1", "DE1.2", "DE2.1", "DE2.2"],
  estimatedMinutes: 145,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Dental Anatomy, Eruption Chronology, Palmer/FDI Notation & Caries Microbiology

A thorough understanding of dental histology, precise tooth notation systems, eruption sequences, and the cariogenic microenvironment is fundamental to clinical dentistry and maxillofacial assessment.

---

## 1. Histological Structure of the Human Tooth & Periodontium

| Layer / Tissue | Embryological Origin & Cell Type | Mineral Composition & Unique Biological Properties | Clinical Significance & Pathology |
| :--- | :--- | :--- | :--- |
| **Enamel** | **Ectoderm** (Ameloblasts). | **$96\\%$ Inorganic Hydroxyapatite**, $1\\%$ Organic, $3\\%$ Water. **Hardest biological substance in human body**. Highly organized into enamel prisms/rods. | **Acellular and Avascular**: Ameloblasts are lost upon tooth eruption $\\implies$ **No cellular regeneration**. Demineralizes at **Critical $pH \\le 5.5$**. Fluoride converts hydroxyapatite to fluorapatite ($pH$ threshold decreases to $4.5$). |
| **Dentin** | **Ectomesenchyme / Neural Crest** (Odontoblasts). | **$70\\%$ Inorganic**, $20\\%$ Organic (Type I collagen), $10\\%$ Water. Contains S-shaped **Dentinal Tubules** bathed in dentinal fluid. | Odontoblast cell bodies reside in the outer pulpal wall; odontoblastic processes extend into dentinal tubules. Fluid movement across tubules activates A-delta nerve fibers (**Brannstrom\'s Hydrodynamic Theory of Dentin Hypersensitivity**). |
| **Dental Pulp** | **Ectomesenchyme** (Fibroblasts, undifferentiated mesenchymal cells). | Loose vascularized connective tissue enclosed within a rigid non-compliant dentin chamber. | Rich innervation by **Myelinated A-delta fibers** (sharp, fleeting, cold-induced pain) and **Unmyelinated C fibers** (dull, throbbing, unprovoked nocturnal pain of irreversible pulpitis). |
| **Periodontal Ligament (PDL)** | **Ectomesenchyme** (Dental follicle). | Specialized fibrous connective tissue with **Type I Collagen Sharpey\'s Fibers** anchoring cementum to alveolar bone. Width: $\\sim 0.2\\text{ mm}$. | Possesses high tactile and proprioceptive mechanoreceptor sensitivity. Dissolved during acute periapical periodontitis, creating percussion tenderness and pathological mobility. |
| **Cementum** | **Ectomesenchyme** (Cementoblasts). | **$50\\%$ Inorganic Hydroxyapatite**, $50\\%$ Organic/Water. Avascular bone-like tissue covering root. | Resists resorption better than alveolar bone (allowing orthodontic tooth movement without extensive root loss). |

---

## 2. Eruption Chronology of Primary and Permanent Dentition

$$\\begin{array}{lcccc}
\\hline
\\textbf{Dentition Phase} & \\textbf{Total Count} & \\textbf{Dental Formula (per quadrant)} & \\textbf{First Tooth to Erupt} & \\textbf{Completion Age} \\\\
\\hline
\\text{Primary (Deciduous)} & 20 & \\text{I 2/2, C 1/1, M 2/2} & \\text{Mandibular Central Incisor } (6-8\\text{ mo}) & 24 - 30\\text{ months} \\\\
\\text{Permanent} & 32 & \\text{I 2/2, C 1/1, PM 2/2, M 3/3} & \\mathbf{\\text{First Permanent Molar (6-yr Molar)}} & 17 - 21\\text{ years (3rd molars)} \\\\
\\hline
\\end{array}$$

### Chronological Permanent Eruption Sequence:
1. **Mandibular 1st Molar ("6-Year Molar")**: Erupts at $6\\text{ years}$ *behind the primary 2nd molar without replacing any deciduous tooth* (non-succedaneous).
2. **Central Incisors**: $6 - 7\\text{ years}$ (Mandibular $\\rightarrow$ Maxillary).
3. **Lateral Incisors**: $7 - 8\\text{ years}$.
4. **Mandibular Canine**: $9 - 10\\text{ years}$.
5. **First Premolars (Bicuspids)**: $10 - 11\\text{ years}$ (replacing primary 1st molars).
6. **Second Premolars & Maxillary Canines**: $11 - 12\\text{ years}$ (Maxillary canine is frequently impacted due to late eruption).
7. **Second Molars ("12-Year Molar")**: $12 - 13\\text{ years}$.
8. **Third Molars ("Wisdom Teeth")**: $17 - 21\\text{ years}$ (highest incidence of impaction).

---

## 3. Dental Notation Systems

- **FDI Two-Digit World Dental Federation System**:
  - Quadrant 1 = Upper Right Permanent, Quadrant 2 = Upper Left Permanent
  - Quadrant 3 = Lower Left Permanent, Quadrant 4 = Lower Right Permanent
  - Quadrants 5, 6, 7, 8 = Deciduous Quadrants (UR, UL, LL, LR)
  - *Example*: Tooth 46 = Quadrant 4 (Lower Right), Tooth 6 (First Molar) = Lower Right First Permanent Molar.
  - *Example*: Tooth 65 = Quadrant 6 (Upper Left Deciduous), Tooth 5 (Second Molar) = Upper Left Primary Second Molar.
- **Universal Numbering System (American Standard)**:
  - *Permanent*: Teeth numbered 1 to 32 starting from Upper Right 3rd Molar (1) across to Upper Left 3rd Molar (16), down to Lower Left 3rd Molar (17) across to Lower Right 3rd Molar (32).
  - *Primary*: Letters A to T (Upper Right 2nd Primary Molar = A, Lower Right 2nd Primary Molar = T).
- **Palmer Notation**:
  - Uses quadrant grid brackets with numbers 1 to 8 (permanent) or letters A to E (primary).

---

## 4. Microbiology & Pathophysiology of Dental Caries

- **Key Etiological Triad (Keyes' Triad)**: Host (Susceptible Tooth & Saliva) $+$ Substrate (Fermentable Carbohydrates: Sucrose) $+$ Microorganisms (Cariogenic Biofilm) $+$ Time.
- **Primary Cariogenic Organisms**:
  1. ***Streptococcus mutans***: The primary initiator of dental caries. Utilizes **Glucosyltransferase (GTF)** to synthesize sticky, water-insoluble extracellular glucans from sucrose, creating a dense dental plaque biofilm. Highly **acidogenic** (rapidly converts sugars to lactic acid) and **aciduric** (survives at $pH < 5.0$).
  2. ***Lactobacillus acidophilus***: Secondary invader responsible for **caries progression and deep dentinal cavitations**.
  3. ***Actinomyces viscosus***: Predominant in **root surface (cemental) caries** in elderly patients with gingival recession.
- **Stephan Curve & Critical $pH$**:
  - Following a glucose rinse, plaque $pH$ drops from resting baseline ($6.8 - 7.0$) to $< 5.0$ within $3 - 5\\text{ minutes}$.
  - Plaque stays below the **Critical $pH$ of $5.5$ for $20 - 40\\text{ minutes}$**, during which active calcium and phosphate demineralization of hydroxyapatite occurs.
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old dental student is reviewing a panoramic radiograph (OPG) and charting a patient's mouth using the FDI World Dental Federation two-digit notation system. The patient has a deep carious lesion involving the pulpal chamber of the mandibular right first permanent molar, as well as an impacted maxillary right permanent third molar.",
      question: "Which of the following represents the correct FDI tooth numbers for the mandibular right first permanent molar and the maxillary right third molar, respectively?",
      options: [
        "Tooth 46 and Tooth 18",
        "Tooth 36 and Tooth 28",
        "Tooth 16 and Tooth 48",
        "Tooth 41 and Tooth 11"
      ],
      correctAnswerIndex: 0,
      explanation: "In the FDI two-digit system, the first digit designates the quadrant (1 = Maxillary Right, 2 = Maxillary Left, 3 = Mandibular Left, 4 = Mandibular Right) and the second digit designates the tooth (1 = Central Incisor to 8 = Third Molar). Thus, the mandibular right first permanent molar is Quadrant 4 + Tooth 6 = Tooth 46. The maxillary right permanent third molar is Quadrant 1 + Tooth 8 = Tooth 18."
    }
  ]
};
