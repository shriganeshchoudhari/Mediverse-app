/**
 * Gastroenterology: Pancreatitis, Celiac Disease & Malabsorption Syndromes
 * Authoritative medical content derived from Sleisenger and Fordtran's Gastrointestinal and Liver Disease (11th ed.), Robbins & Cotran.
 * Mapped to NMC CBME Competencies: IM8.3, IM8.4, PA28.1, PA28.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PANCREATITIS_MALABSORPTION_MODULE: PhysiologyLessonModule = {
  id: "gastroenterology-adv-pancreatitis-malabsorption",
  unitCode: "GA7.1",
  title: "Acute Pancreatitis, Celiac Disease (anti-tTG), Whipple Disease & Malabsorption",
  competencies: ["IM8.3", "IM8.4", "PA28.1", "PA28.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Acute Pancreatitis, Celiac Disease & Malabsorption

Malabsorptive and exocrine pancreatic disorders require precise differentiation of mucosal vs enzymopathic pathology.

---

## 1. Acute Pancreatitis: Diagnostic Criteria & Pathophysiology

- **Revised Atlanta Diagnostic Criteria** (Requires at least $2$ of the following $3$ features):
  1. Severe epigastric abdominal pain radiating straight through to the back.
  2. Serum **Lipase or Amylase $\\ge 3\\times$ Upper Limit of Normal (ULN)** (Lipase is more sensitive and specific, remaining elevated longer).
  3. Characteristic findings on abdominal contrast-enhanced CT, MRI, or transabdominal ultrasound.
- **Top Etiologies**: **Gallstones ($40-50\\%$)** and **Alcohol ($30-35\\%$)**, followed by **Hypertriglyceridemia ($>1,000\\text{ mg/dL}$)** and ERCP.
- **Evidence-Based Management**: Early aggressive intravenous crystalloid hydration ($200-500\\text{ mL/h}$ with **Lactated Ringer\'s solution**), multimodal analgesia, and early oral/enteral nutrition within $24-48\\text{ hours}$ (reduces infectious complications).

---

## 2. Celiac Disease vs Whipple Disease vs Tropical Sprue

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Primary Site} & \\textbf{Histopathology} & \\textbf{Serology / Diagnostic Marker} & \\textbf{Clinical Hallmarks} \\\\
\\hline
\\textbf{Celiac Disease} & \\text{Duodenum \u0026 Jejunum} & \\mathbf{\\text{Villous atrophy, crypt hyperplasia,}} & \\mathbf{\\text{Anti-tTG IgA, anti-EMA IgA}} & \\text{HLA-DQ2/DQ8; } \\mathbf{\\text{Dermatitis Herpetiformis}} \\\\
& & \\text{intraepithelial lymphocytosis} & & \\text{(granular IgA at dermal papillae } \\rightarrow \\text{ Dapsone)} \\\\
\\hline
\\textbf{Whipple Disease} & \\text{Small intestine / Systemic} & \\mathbf{\\text{PAS-positive, diastase-resistant}} & \\text{PCR for } \\mathbf{\\text{Tropheryma whipplei}} & \\text{Cardiac (endocarditis), Arthralgias, Neuro,} \\\\
& & \\text{macrophages in lamina propria} & & \\text{Diarrhea; IV Ceftriaxone } \\rightarrow \\text{ 1 yr TMP-SMX} \\\\
\\hline
\\textbf{Tropical Sprue} & \\text{Entire small bowel (ileum)} & \\text{Blunted villi, similar to celiac} & \\text{Nutritional deficiencies (B12 + Folate)} & \\text{History of travel/residence in tropics; } \\\\
& & & & \\text{responds to Tetracycline + Folate} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 32-year-old female presents with chronic bloating, recurrent watery diarrhea, and a 5-kg weight loss over 6 months. Physical examination reveals an extremely pruritic vesicular eruption grouped symmetrically over her bilateral extensor elbows, knees, and buttocks. Laboratory evaluation reveals: Microcytic anemia with Hemoglobin 10.4 g/dL and Ferritin 14 ug/L. Serology is strongly positive for anti-tissue transglutaminase IgA (anti-tTG > 100 U/mL). An upper endoscopy with duodenal biopsy is performed.",
      question: "Which of the following histopathological findings on duodenal biopsy and associated dermatological condition are characteristic of this patient's disease?",
      options: [
        "Diffuse villous atrophy, crypt hyperplasia, and intraepithelial lymphocytosis; Dermatitis Herpetiformis",
        "PAS-positive foamy macrophages in the lamina propria; Erythema Nodosum",
        "Non-caseating granulomas in the submucosa; Pyoderma Gangrenosum",
        "Mucosal pseudopolyps with neutrophilic crypt abscesses; Acanthosis Nigricans"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Celiac Disease complicated by Dermatitis Herpetiformis (intensely pruritic grouped vesicles over extensor surfaces). The pathognomonic triad on duodenal biopsy includes: 1. Diffuse blunting/atrophy of intestinal villi (causing malabsorption of iron and nutrients), 2. Crypt hyperplasia, and 3. Marked intraepithelial lymphocytosis. Direct immunofluorescence of skin lesions reveals granular IgA deposition at the dermal papillae tips, which clears completely with a gluten-free diet and oral Dapsone."
    }
  ]
};
