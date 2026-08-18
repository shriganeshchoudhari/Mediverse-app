/**
 * Pediatrics: Pediatric Gastrointestinal Emergencies: Pyloric Stenosis, Intussusception, Volvulus & NEC
 * Authoritative medical content derived from Nelson Textbook of Pediatrics (21st ed.), Ashcraft's Pediatric Surgery.
 * Mapped to NMC CBME Competencies: PE1.5, PE1.6, PA43.1, PA43.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PEDIATRIC_GASTROINTESTINAL_EMERGENCIES_MODULE: PhysiologyLessonModule = {
  id: "pediatrics-adv-pediatric-gastrointestinal-emergencies",
  unitCode: "PE5.1",
  title: "Pediatric GI Emergencies: Pyloric Stenosis (Alkalosis), Intussusception & Midgut Volvulus",
  competencies: ["PE1.5", "PE1.6", "PA43.1", "PA43.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Pediatric Surgical & Gastrointestinal Emergencies

Pediatric acute abdomen presents with age-specific clinical phenotypes categorized by vomit characteristics (bilious vs non-bilious), abdominal palpation, and radiological signs.

---

## 1. Comparative Matrix of Pediatric Abdominal Emergencies

$$\\begin{array}{lcccc}
\\hline
\\textbf{Condition} & \\textbf{Peak Age} & \\textbf{Emesis Character} & \\textbf{Pathognomonic Physical / Lab Finding} & \\textbf{Diagnostic / Therapeutic Modality} \\\\
\\hline
\\textbf{Pyloric Stenosis (IHPS)} & \\mathbf{3 - 6\\text{ weeks}} & \\mathbf{\\text{Non-Bilious Projectile}} & \\mathbf{\\text{Olive-shaped mass in RUQ;}} & \\mathbf{\\text{US: Thickness }}>3-4\\text{ mm; Ramstedt surgery}} \\\\
& & & \\mathbf{\\text{Hypochloremic, Hypokalemic Alkalosis}} & \\mathbf{\\text{(Correct electrolytes BEFORE surgery!)}} \\\\
\\textbf{Intussusception} & \\mathbf{6 - 36\\text{ months}} & \\text{Bilious or non-bilious} & \\mathbf{\\text{\"Currant Jelly\" stools (blood+mucus);}} & \\mathbf{\\text{Air / Contrast Enema}} \\\\
& & & \\mathbf{\\text{Sausage-shaped mass in RUQ; Dance sign}} & \\mathbf{\\text{(Diagnostic AND Therapeutic in }}>85\\%\\text{)}} \\\\
\\textbf{Midgut Volvulus} & \\mathbf{\\text{Neonate (1st mo)}} & \\mathbf{\\text{SUDDEN BILIOUS (Green)}} & \\text{Abdominal distension, peritonitis, shock} & \\mathbf{\\text{Upper GI Series: \"Corkscrew\" duodenum;}} \\\\
& & & & \\mathbf{\\text{Emergency Ladd Procedure}} \\\\
\\textbf{Necrotizing Enterocolitis} & \\text{Preterm neonate} & \\text{Bilious / feeding resid.} & \\mathbf{\\text{Abdominal X-ray: Pneumatosis intestinalis,}} & \\text{Bowel rest, NGT decompression, IV antibiotics;} \\\\
\\textbf{(NEC)} & & & \\mathbf{\\text{branching portal venous gas}} & \\text{Laparotomy if pneumoperitoneum} \\\\
\\hline
\\end{array}$$

---

## 2. Infantile Hypertrophic Pyloric Stenosis (IHPS)

- **Pathophysiology of Metabolic Derangement**:
  - Repetitive vomiting of pure gastric secretions causes loss of water, $\\text{H}^+$, and $\\text{Cl}^-$.
  - Dehydration activates aldosterone in renal cortical collecting ducts $\rightarrow$ kidneys avidly reabsorb $\\text{Na}^+$ in exchange for $\\text{K}^+$ and $\\text{H}^+$ (paradoxical aciduria), resulting in **Hypochloremic, Hypokalemic Metabolic Alkalosis**.
  - **Surgical Golden Rule**: Pyloromyotomy is **NEVER a surgical emergency**; surgery must be delayed until volume resuscitation and complete normalization of serum electrolytes and acid-base status are achieved.

---

## 3. Intussusception & Contrast Enema Reduction

- **Etiology**: Telescoping of a proximal bowel segment into an adjacent distal lumen (most commonly ileocecal).
- **Lead Points**: Hypertrophied Peyer patches secondary to viral infections (Adenovirus, Rotavirus), Meckel diverticulum, intestinal polyps, or Henoch-Schönlein purpura (IgA vasculitis).
- **Ultrasound Findings**: **Target / Donut Sign** on transverse cross-section (representing concentric rings of bowel) and **Pseudokidney Sign** on longitudinal section.
- **Intervention**: **Air or Hydrostatic (Saline/Barium) Enema reduction under fluoroscopic or sonographic guidance** (successful in $>85-90\\%$ of cases without peritonitis).
`,
  clinicalVignettes: [
    {
      scenario: "A 5-week-old first-born male infant is brought to the clinic due to worsening forceful vomiting that occurs after every feeding for the past 5 days. The mother notes that the vomit is 'white formula with curdled milk' (non-bilious), shoots several feet across the room, and the baby remains hungry and demands to feed immediately after vomiting. Physical examination reveals a mildly dehydrated infant with a visible gastric peristaltic wave moving left to right across the upper abdomen. On palpation with the baby relaxed, a firm, mobile, non-tender 2-cm olive-like mass is palpable in the right upper quadrant. Laboratory studies demonstrate: Serum Na+ 132 mEq/L, K+ 2.9 mEq/L, Cl- 86 mEq/L, and HCO3- 34 mEq/L.",
      question: "Which of the following represents the primary mandatory clinical step before proceeding to surgical pyloromyotomy?",
      options: [
        "Intravenous fluid resuscitation with isotonic saline containing potassium chloride to correct the hypochloremic, hypokalemic metabolic alkalosis",
        "Immediate emergency surgical Ramstedt pyloromyotomy within 1 hour to prevent bowel infarction",
        "Air reduction enema under fluoroscopic guidance",
        "Initiation of broad-spectrum intravenous Ampicillin and Gentamicin"
      ],
      correctAnswerIndex: 0,
      explanation: "This infant presents with the classic triad of Infantile Hypertrophic Pyloric Stenosis (IHPS): 3-6 weeks of age, non-bilious projectile vomiting, and a palpable 'olive' mass in the epigastrium. The loss of gastric hydrochloric acid produces a pathognomonic Hypochloremic, Hypokalemic Metabolic Alkalosis. Pyloric stenosis is a medical emergency requiring stabilization, NOT an immediate surgical emergency. Operating on an alkalotic, hypokalemic infant carries a high risk of postoperative apnea and cardiac arrhythmias. The mandatory initial step is aggressive IV hydration with Normal Saline and potassium chloride replacement until bicarbonate, potassium, and chloride fully normalize before elective Ramstedt pyloromyotomy."
    }
  ]
};
