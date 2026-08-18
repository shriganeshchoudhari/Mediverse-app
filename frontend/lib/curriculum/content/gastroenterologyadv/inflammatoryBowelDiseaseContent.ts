/**
 * Gastroenterology: Inflammatory Bowel Disease (Crohn Disease vs Ulcerative Colitis)
 * Authoritative medical content derived from Sleisenger and Fordtran's Gastrointestinal and Liver Disease (11th ed.), Robbins & Cotran Pathologic Basis of Disease.
 * Mapped to NMC CBME Competencies: IM7.3, IM7.4, PA27.1, PA27.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INFLAMMATORY_BOWEL_DISEASE_MODULE: PhysiologyLessonModule = {
  id: "gastroenterology-adv-inflammatory-bowel-disease",
  unitCode: "GA5.1",
  title: "Inflammatory Bowel Disease: Crohn Disease vs Ulcerative Colitis & Extraintestinal Manifestations",
  competencies: ["IM7.3", "IM7.4", "PA27.1", "PA27.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Inflammatory Bowel Disease (IBD): Crohn vs Ulcerative Colitis

Inflammatory Bowel Diseases comprise **Crohn Disease (CD)** and **Ulcerative Colitis (UC)**, two distinct chronic immune-mediated disorders of the gastrointestinal tract.

---

## 1. Crohn Disease vs Ulcerative Colitis Comparative Matrix

$$\\begin{array}{lcc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Crohn Disease} & \\textbf{Ulcerative Colitis} \\\\
\\hline
\\textbf{Anatomical Location} & \\text{Any part (mouth to anus; terminal ileum 80\\%)} & \\mathbf{\\text{Colon only (starts at rectum, extends proximally)}} \\\\
\\textbf{Lesion Distribution} & \\mathbf{\\text{Skip lesions (patchy, discontinuous)}} & \\mathbf{\\text{Continuous involvement without skip areas}} \\\\
\\textbf{Depth of Inflammation} & \\mathbf{\\text{Transmural (all wall layers)}} & \\mathbf{\\text{Mucosal and submucosal only}} \\\\
\\textbf{Endoscopy Findings} & \\text{Cobblestoning, deep aphthous ulcers, strictures} & \\text{Friable erythematous mucosa, pseudopolyps} \\\\
\\textbf{Histopathology} & \\mathbf{\\text{Non-caseating granulomas (60\\%)}}, \\text{ fissuring} & \\mathbf{\\text{Crypt abscesses with neutrophilic aggregates}} \\\\
\\textbf{Barium Imaging} & \\mathbf{\\text{\"String sign\" (terminal ileal stricture)}} & \\mathbf{\\text{\"Lead-pipe colon\" (loss of haustra)}} \\\\
\\textbf{Major Complications} & \\mathbf{\\text{Fistulas (entero-vesical/cutaneous)}}, \\text{strictures} & \\mathbf{\\text{Toxic Megacolon}}, \\mathbf{\\text{Colorectal Carcinoma}} \\\\
\\textbf{Serology Biomarker} & \\mathbf{\\text{Anti-Saccharomyces cerevisiae (ASCA+)}} & \\mathbf{\\text{p-ANCA (Perinuclear ANCA+)}} \\\\
\\textbf{Extraintestinal Traits} & \\text{Gallstones (ileal bile loss), Oxalate kidney stones} & \\mathbf{\\text{Primary Sclerosing Cholangitis (PSC)}}, \\text{Pyoderma} \\\\
\\textbf{Surgical Cure} & \\text{Non-curative (recurs at surgical anastomoses)} & \\mathbf{\\text{CURATIVE via Total Proctocolectomy}} \\\\
\\hline
\\end{array}$$

---

## 2. High-Yield Pathophysiological Mechanisms

- **Oxalate Nephrolithiasis in Crohn Disease**: Terminal ileal inflammation impairs bile salt reabsorption $\\rightarrow$ malabsorbed fatty acids bind luminal calcium in the colon $\rightarrow$ unbound free oxalate is absorbed hyper-efficiently into blood $\rightarrow$ excreted into urine $\rightarrow$ **Calcium Oxalate Kidney Stones**.
- **Toxic Megacolon in Ulcerative Colitis**: Severe transmural nitric oxide generation and neuromuscular paralysis $\rightarrow$ colonic dilation ($>6\\text{ cm}$ on abdominal X-ray) with systemic toxicity $\rightarrow$ high perforation risk $\rightarrow$ emergent colectomy if non-responsive to IV steroids.
`,
  clinicalVignettes: [
    {
      scenario: "A 26-year-old female presents with recurrent right lower quadrant crampy abdominal pain, non-bloody diarrhea, low-grade fevers, and a 6-kg weight loss over 4 months. Physical examination reveals an indurated, draining cutaneous opening in the right lower abdominal quadrant that discharges enteric contents. Colonoscopy demonstrates patchy areas of deep linear ulcerations with cobblestone appearance in the terminal ileum and ascending colon, separated by completely normal intervening mucosa. Biopsy shows transmural inflammation with multiple non-caseating granulomas.",
      question: "Which of the following is the definitive diagnosis and characteristic serological biomarker associated with this condition?",
      options: [
        "Crohn Disease; Positive Anti-Saccharomyces cerevisiae antibodies (ASCA+)",
        "Ulcerative Colitis; Positive Perinuclear antineutrophil cytoplasmic antibodies (p-ANCA+)",
        "Intestinal Tuberculosis; Positive T-SPOT interferon gamma release assay",
        "Celiac Disease; Positive Anti-tissue transglutaminase IgA (anti-tTG)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits classic features of Crohn Disease: terminal ileal and right colonic involvement with 'skip lesions' (discontinuous patches), transmural inflammation forming an enterocutaneous fistula, and pathognomonic non-caseating granulomas on histopathology. Crohn Disease is strongly associated with Anti-Saccharomyces cerevisiae antibodies (ASCA+ in 50-70% of cases), whereas Ulcerative Colitis is associated with p-ANCA+."
    }
  ]
};
