/**
 * Acute Abdomen, Gastrointestinal Emergencies & Hepatobiliary Surgery Learning Content
 * Authoritative medical content derived from Bailey & Love, Sabiston, Schwartz, and USMLE Step 2 CK Surgery.
 * Mapped to NMC CBME Competencies: SU1.1, SU1.2, SU1.3, SU2.1, SU2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_ABDOMEN_SURGICAL_MODULE: PhysiologyLessonModule = {
  id: "surg-acute-abdomen",
  unitCode: "SU1.1",
  title: "General Surgery: Acute Abdomen, Appendicitis Alvarado Score, Cholecystitis & Bowel Perforation",
  competencies: ["SU1.1", "SU1.2", "SU1.3", "SU2.1", "SU2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# General Surgery: Acute Abdomen, Appendicitis Alvarado Score, Cholecystitis & Bowel Perforation

The acute abdomen is a surgical emergency characterized by rapid-onset severe abdominal pain resulting from infection, inflammation, ischemia, obstruction, or perforation of intra-abdominal viscera.

---

## 1. Acute Appendicitis & Alvarado (MANTRELS) Scoring

### Pathophysiology & Classic Signs:
- **Luminal Obstruction**: Fecalith (adults) or lymphoid hyperplasia (children/viral illness) $\\rightarrow$ increased intraluminal pressure $\\rightarrow$ venous congestion and mucosal ischemia $\\rightarrow$ bacterial translocation (*Bacteroides fragilis, E. coli*) $\\rightarrow$ gangrene and perforation.
- **Physical Signs**:
  - **McBurney\'s Point**: Junction of medial two-thirds and lateral one-third of the line connecting umbilicus to Anterior Superior Iliac Spine (ASIS).
  - **Rovsing Sign**: Palpation of the Left Iliac Fossa produces pain in the Right Iliac Fossa.
  - **Psoas Sign**: Passive extension of the right hip produces pain (indicates **Retrocecal Appendix**).
  - **Obturator Sign**: Passive internal rotation of the flexed right hip produces pain (indicates **Pelvic Appendix**).
  - **Dunphy Sign**: Sharp increase in RIF pain elicited by coughing.

### The Alvarado (MANTRELS) Scoring System:

| Alvarado Mnemonic Category | Clinical Sign / Symptom / Laboratory | Point Allocation |
| :--- | :--- | :--- |
| **M** — Migration of Pain | Periumbilical / Epigastric visceral pain shifting to RIF | 1 point |
| **A** — Anorexia | Loss of appetite | 1 point |
| **N** — Nausea / Vomiting | Nausea or episodes of emesis | 1 point |
| **T** — Tenderness in RIF | Localized tenderness at McBurney\'s point | **2 points** |
| **R** — Rebound Tenderness | Blumberg sign in Right Iliac Fossa | 1 point |
| **E** — Elevated Temperature | Pyrexia $\\ge 37.3^\\circ\\text{C}$ ($>99.1^\\circ\\text{F}$) | 1 point |
| **L** — Leukocytosis | Total WBC count $>10,000 /\\mu\\text{L}$ | **2 points** |
| **S** — Shift to the Left | Neutrophil band forms $\\ge 75\\%$ | 1 point |
| **Total Possible Score** | | **10 points** |

- **Score 1–4**: Unlikely appendicitis $\\implies$ discharge with warning advice.
- **Score 5–6**: Possible / Equivocal appendicitis $\\implies$ **Admit for active observation and Contrast-Enhanced CT / Ultrasound**.
- **Score 7–10**: Highly probable / Definite appendicitis $\\implies$ **Urgent Laparoscopic Appendectomy**.

---

## 2. Acute Cholecystitis & Biliary Tract Sepsis

| Clinical Entity | Pathophysiology & Clinical Triads | Diagnostic Imaging & Findings | Definitive Surgical Management |
| :--- | :--- | :--- | :--- |
| **Acute Calculous Cholecystitis** | Impacted stone in **Cystic Duct** $\\implies$ chemical & bacterial inflammation. **Murphy\'s Sign** (inspiratory arrest on RUQ palpation); **Boa\'s Sign** (hyperesthesia over right scapula). | **Abdominal Ultrasound (First-Line)**: Gallbladder wall thickening $>3-4\\text{ mm}$, pericholecystic fluid, gallstones, sonographic Murphy\'s sign. | **Early Laparoscopic Cholecystectomy** (within 72 hours of symptom onset). |
| **Acute Cholangitis** | Common Bile Duct (CBD) stone / stricture with ascending bacterial infection. | Ultrasound / MRCP demonstrating dilated CBD $>6-8\\text{ mm}$ with choledocholithiasis. | **Charcot\'s Triad**: Fever $+$ RUQ Pain $+$ Jaundice.<br>**Reynolds\' Pentad**: Charcot\'s $+$ **Hypotension $+$ Altered Mental Status** (Suppurative Cholangitis).<br>$\\implies$ **Emergency ERCP Biliary Decompression!** |

---

## 3. Peptic Ulcer Perforation & Bowel Obstruction

1. **Perforated Peptic Ulcer**:
   - Acute transmural erosion (anterior duodenal bulb or prepyloric gastric antrum) releasing gastric acid and bile into the peritoneal cavity.
   - **Clinical Triad**: Sudden onset "knife-like" epigastric agony $\\rightarrow$ Generalized **"Board-Like" Abdominal Rigidity** $\\rightarrow$ Loss of liver dullness.
   - **Pathognomonic Imaging**: **Erect Chest X-ray** demonstrating **Free Air Under the Right Diaphragmatic Dome (Pneumoperitoneum / Crescent Sign)**.
   - **Surgical Management**: Emergency Exploratory Laparotomy with **Graham Patch Omental Repair** (or Cellan-Jones pedicled omental plug).
2. **Small vs Large Bowel Obstruction**:
   - **Small Bowel Obstruction (SBO)**: Most commonly caused by **Post-operative Peritoneal Adhesions ($>60\\%$)** followed by Incarcerated Hernias. Abdominal radiograph demonstrates multiple central dilated loops with **valvulae conniventes (plicae circulares) traversing the complete lumen width** and "string-of-pearls" sign.
   - **Large Bowel Obstruction (LBO)**: Most commonly caused by **Colorectal Malignancy ($>60\\%$)** followed by Volvulus. Sigmoid Volvulus produces the classic **"Coffee Bean Sign"** pointing to the Right Upper Quadrant.
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old university student presents to the emergency surgical triage with a 14-hour history of abdominal pain. The pain initially began as a dull, poorly localized periumbilical ache, but has now localized sharply to the Right Iliac Fossa. He has had 2 episodes of non-bilious vomiting and complete loss of appetite. Examination reveals localized tenderness and rebound at McBurney's point, temperature 38.1 C, and blood tests show a WBC count of 14,800/uL with 82% neutrophils (Alvarado score = 9).",
      question: "Which of the following is the definitive next step in management?",
      options: [
        "Urgent Laparoscopic Appendectomy with IV prophylactic antibiotics",
        "Discharge home on oral amoxicillin-clavulanate with surgical clinic follow-up",
        "Perform a colonoscopy to inspect the appendiceal orifice",
        "Immediate exploratory laparotomy with Graham patch repair"
      ],
      correctAnswerIndex: 0,
      explanation: "An Alvarado score of 9/10 (MANTRELS: Migration 1, Anorexia 1, Vomiting 1, RIF Tenderness 2, Rebound 1, Fever 1, Leukocytosis 2) strongly establishes definite acute appendicitis. The gold-standard definitive management is urgent surgical removal (Laparoscopic Appendectomy) combined with perioperative intravenous antibiotics covering Gram-negative and anaerobic enteric pathogens."
    }
  ]
};
