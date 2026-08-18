/**
 * Internship Core Clinical Postings: Acute Abdomen Surgical Triage & SBO Decision Pathways
 * Authoritative surgery content derived from Sabiston Surgery, Schwartz's Principles of Surgery.
 * Mapped to NMC CBME Competencies: IN5.1, SU3.1, EM3.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_ABDOMEN_APPENDICITIS_CHOLECYSTITIS_MODULE: PhysiologyLessonModule = {
  id: "int5-acute-abdomen-appendicitis-cholecystitis",
  unitCode: "IN5.1",
  title: "Acute Abdomen Surgical Triage: Alvarado Score (Appendicitis), Tokyo Guidelines (Cholecystitis) & SBO Strangulation Signs",
  competencies: ["IN5.1", "SU3.1", "EM3.1"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Acute Abdomen Surgical Triage & SBO Decision Pathways

Objective clinical risk scores and emergency imaging identify peritonitis, acute appendiceal inflammation, acute cholecystitis, and closed-loop small bowel strangulation.

---

## 1. Acute Appendicitis & The Alvarado (MANTRELS) Scoring System

$$\\begin{array}{lcccc}
\\hline
\\textbf{Alvarado Feature} & \\textbf{Clinical Component (MANTRELS)} & \\textbf{Assigned Points} \\\\
\\hline
\\textbf{M - Migration} & \\text{Migration of epigastric/periumbilical pain to Right Lower Quadrant} & 1 \\\\
\\textbf{A - Anorexia} & \\text{Loss of appetite or presence of acetone in urine} & 1 \\\\
\\textbf{N - Nausea / Vomiting} & \\text{Nausea or emesis occurring after pain onset} & 1 \\\\
\\textbf{T - Tenderness RLQ} & \\mathbf{\\text{Direct tenderness in the Right Lower Quadrant (McBurney's Point)}} & \\mathbf{2} \\\\
\\textbf{R - Rebound} & \\text{Rebound tenderness / signs of localized peritoneal irritation} & 1 \\\\
\\textbf{E - Elevated Temperature} & \\text{Oral temperature } \\ge 37.3^{\\circ}\\text{C (} \\ge 99.1^{\\circ}\\text{F)} & 1 \\\\
\\textbf{L - Leukocytosis} & \\mathbf{\\text{Total White Blood Cell (WBC) count } > 10{,}000 / \\mu\\text{L}} & \\mathbf{2} \\\\
\\textbf{S - Shift to the Left} & \\text{Neutrophil proportion } \\ge 75\\% & 1 \\\\
\\hline
\\textbf{Total Score Interpretation} & \\mathbf{\\text{Score } \\ge 7: \\text{ HIGH probability of appendicitis } \\rightarrow \\text{ Urgent OR Surgery}} & \\mathbf{10 \\text{ Total}} \\\\
\\hline
\\end{array}$$

---

## 2. Acute Cholecystitis & Tokyo Guidelines 2018 (TG18)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Criterion} & \\textbf{Clinical / Sonographic Findings} & \\textbf{Mandated Management} \\\\
\\hline
\\textbf{A. Local Inflammation} & \\text{Murphy's sign, Right Upper Quadrant tenderness/mass} & \\text{Definitive diagnosis requires} \\\\
\\textbf{B. Systemic Signs} & \\text{Fever, elevated C-reactive protein (CRP), leukocytosis} & \\text{A + B + C confirmation} \\\\
\\textbf{C. Imaging Features} & \\mathbf{\\text{Gallbladder wall thickening } \\ge 4\\text{ mm, pericholecystic fluid,}} & \\mathbf{\\text{Early Laparoscopic Cholecystectomy}} \\\\
& \\mathbf{\\text{sonographic Murphy's sign, impacted calculus}} & \\mathbf{\\le 72\\text{ hours from symptom onset}} \\\\
\\hline
\\end{array}$$

---

## 3. Small Bowel Obstruction (SBO) & Strangulation CT Red Flags

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Parameter} & \\textbf{Uncomplicated SBO} & \\textbf{Strangulated / Closed-Loop SBO} \\\\
\\hline
\\textbf{Primary Etiology} & \\mathbf{\\text{Intra-abdominal Adhesions (60-70\\%)}} & \\text{Volvulus, Internal hernia, Incarcerated hernia} \\\\
\\textbf{Abdominal Pain} & \\text{Intermittent, colicky periumbilical cramps} & \\mathbf{\\text{Continuous, severe, out of proportion to exam}} \\\\
\\textbf{CT Imaging Signs} & \\text{Dilated loops (} > 2.5\\text{ cm) with transition point} & \\mathbf{\\text{Mesenteric \"whirl sign\", bowel wall thickening}} \\\\
& \\text{decompressed colon, air-fluid levels} & \\mathbf{> 3\\text{ mm, pneumatosis intestinalis, portomesenteric gas}} \\\\
\\textbf{Management} & \\text{NG tube decompression, IV fluids, NPO} & \\mathbf{\\text{EMERGENT EXPLORATORY LAPAROTOMY}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old male presents with 18 hours of periumbilical abdominal cramping that migrated to his right lower quadrant 6 hours ago. He reports anorexia and 2 episodes of non-bilious vomiting. On examination, he has marked tenderness at McBurney's point with localized rebound tenderness. His oral temperature is 38.1°C (100.6°F). Laboratory evaluation demonstrates a WBC count of 14,800/uL with 82% neutrophils (shift to the left).",
      question: "What is the patient's calculated Alvarado score, and what is the definitive surgical management pathway?",
      options: [
        "Alvarado Score = 9 out of 10 (Migration = 1, Anorexia = 1, Nausea = 1, RLQ Tenderness = 2, Rebound = 1, Elevated Temp = 1, Leukocytosis = 2, Left Shift = 1); a score >=7 indicates high probability of Acute Appendicitis requiring urgent surgical consultation and laparoscopic appendectomy",
        "Alvarado Score = 4; discharge home with oral antacids",
        "Alvarado Score = 6; schedule elective outpatient colonoscopy in 3 weeks",
        "Diagnosis is uncomplicated mesenteric adenitis; manage with oral analgesia only"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates the application of the Alvarado (MANTRELS) score for acute appendicitis: (1) Scoring: Migration (1) + Anorexia (1) + Nausea/Vomiting (1) + RLQ Tenderness (2) + Rebound (1) + Elevated Temp (1) + Leukocytosis (2) + Left Shift (1) = 9 points; (2) Clinical Threshold: A score >=7 in a male patient has >90% sensitivity and specificity for acute appendicitis, justifying immediate surgical consultation and laparoscopic appendectomy without mandatory pre-operative CT imaging."
    }
  ]
};
