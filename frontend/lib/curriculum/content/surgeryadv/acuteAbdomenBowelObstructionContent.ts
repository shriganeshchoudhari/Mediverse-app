/**
 * Clinical Surgery Advanced: Acute Abdomen, Bowel Obstruction & Peritonitis Traumatology
 * Authoritative surgical content derived from Schwartz's Principles of Surgery (11th ed.), Sabiston (21st ed.).
 * Mapped to NMC CBME Competencies: SU1.1, SU1.2, MD43.1, SU41.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_ABDOMEN_BOWEL_OBSTRUCTION_MODULE: PhysiologyLessonModule = {
  id: "surgery-adv-acute-abdomen-sbo",
  unitCode: "SU1.1",
  title: "Acute Abdomen, Small Bowel Obstruction (SBO), Closed-Loop Strangulation & Peritonitis",
  competencies: ["SU1.1", "SU1.2", "MD43.1", "SU41.1"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Acute Abdomen, Mechanical Bowel Obstruction & Strangulation Ischemia

The surgical acute abdomen requires rapid discrimination between uncomplicated obstruction and closed-loop strangulation ischemia requiring immediate laparotomy.

---

## 1. Mechanical Bowel Obstruction Diagnostic Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Obstruction Entity} & \\textbf{Etiology / Frequency} & \\textbf{Characteristic Radiographic Signs} & \\textbf{Strangulation Risk} & \\textbf{Surgical Intervention Rule} \\\\
\\hline
\\textbf{Small Bowel} & \\mathbf{\\text{Postoperative Adhesions (>60\\%),}} & \\text{Dilated small bowel } >3\\text{ cm, multiple} & \\text{High in closed-loop} & \\text{NG tube decompression + IV fluids;} \\\\
\\textbf{Obstruction (SBO)} & \\text{incarcerated hernias, neoplasms} & \\text{air-fluid levels, absence of colonic gas} & (\\text{hernia/volvulus}) & \\mathbf{\\text{Laparotomy if signs of strangulation}} \\\\
\\textbf{Sigmoid Volvulus} & \\text{Redundant sigmoid loop, elderly,} & \\mathbf{\\text{Classic "Coffee Bean" sign, inverted U}} & \\text{Moderate} & \\text{Rigid sigmoidoscopy derotation} \\\\
& \\text{chronic constipation, neuropsychiatric} & \\text{arising from pelvis toward RUQ} & & \\text{followed by elective sigmoid resection} \\\\
\\textbf{Cecal Volvulus} & \\text{Mobile cecum / mesentery defect} & \\mathbf{\\text{"Embryo" / "Comma" sign pointing to LUQ}} & \\mathbf{\\text{Very High}} & \\mathbf{\\text{Emergent Right Hemicolectomy}} \\\\
\\textbf{Ogilvie Syndrome} & \\text{Acute colonic pseudo-obstruction} & \\text{Massive colonic dilatation (cecum } >10\\text{-}12\\text{ cm)} & \\text{Cecal rupture if } >12\\text{ cm} & \\mathbf{\\text{IV Neostigmine } (2\\text{ mg IV over 3-5 min)}} \\\\
& (\\text{postoperative, severe illness}) & \\text{without mechanical transition point} & & \\text{or colonoscopic decompression} \\\\
\\hline
\\end{array}$$

---

## 2. Signs of Strangulation & Closed-Loop Ischemia (Mandatory Laparotomy)

- **Clinical & Laboratory Cardinal Signs**:
  1. Persistent localized peritonitis (involuntary guarding, rebound tenderness, rigidity).
  2. Unremitting severe constant abdominal pain out of proportion to exam.
  3. Fever ($>38^\circ\text{C}$) and persistent resting tachycardia ($>100\text{ bpm}$).
  4. Marked leukocytosis with left shift ($\text{WBC} > 15{,}000/\\mu\\text{L}$).
  5. **Metabolic acidosis with elevated serum lactate** (indicating transmural bowel infarction).
- **CRITICAL SURGICAL MANDATE**:
  - The presence of any two signs of strangulation in a patient with bowel obstruction is an absolute indication for **Immediate Emergency Exploratory Laparotomy / Laparoscopy with Bowel Resection of Non-Viable Segments**.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old female with a history of open hysterectomy presents with 24 hours of colicky abdominal pain, bilious vomiting, and absolute obstipation. Physical examination reveals a distended abdomen with high-pitched hyperactive bowel sounds and mild diffuse tenderness without guarding. Abdominal CT demonstrates dilated small bowel loops up to 3.8 cm with a discrete transition point in the right lower quadrant, small bowel feces sign, and no colonic gas. Over the next 6 hours, her heart rate increases from 82 to 118 bpm, temperature rises to 38.6°C, she develops severe localized right lower quadrant rebound tenderness, her WBC rises from 9,200 to 18,500/uL, and serum lactate rises to 3.8 mmol/L.",
      question: "Which of the following is the most appropriate next step in surgical management?",
      options: [
        "Immediate emergency exploratory laparotomy for suspected closed-loop strangulation and ischemic bowel resection",
        "Continue conservative non-operative management with nasogastric decompression and repeat CT in 24 hours",
        "Perform diagnostic colonoscopy with decompression",
        "Administer intravenous Neostigmine"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient initially presented with uncomplicated adhesive small bowel obstruction (SBO) which rapidly progressed to acute strangulation ischemia and impending transmural bowel necrosis, evidenced by the classic cardinal tetrad: (1) Persistent tachycardia (118 bpm), (2) Fever (38.6°C), (3) Localized peritonitis with rebound tenderness, and (4) Marked leukocytosis (18,500/uL) with hyperlactatemia (3.8 mmol/L). While uncomplicated SBO can be managed non-operatively with NG decompression and IV hydration, signs of strangulation/ischemia are a strict, absolute indication for immediate emergency exploratory laparotomy and resection of non-viable bowel to prevent perforation, fecal peritonitis, and septic shock."
    }
  ]
};
