/**
 * Carbohydrate Metabolism & Bioenergetics Learning Content
 * Authoritative medical content derived from Harper's, Lippincott, Lehninger, and USMLE Step 1.
 * Mapped to NMC CBME Competencies: BI3.1, BI3.2, BI3.3, BI3.4, BI3.5
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CARBOHYDRATE_METABOLISM_MODULE: PhysiologyLessonModule = {
  id: "bioc-carbohydrate",
  unitCode: "BI3.1",
  title: "Glycolysis, Gluconeogenesis, Glycogenoses & Pyruvate Crossroads",
  competencies: ["BI3.1", "BI3.2", "BI3.3", "BI3.4", "BI3.5"],
  estimatedMinutes: 120,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Glycolysis, Gluconeogenesis, Glycogenoses & Pyruvate Crossroads

Carbohydrate metabolism maintains systemic normoglycemia ($70 - 99\\text{ mg/dL}$ fasting) and generates cellular adenosine triphosphate ($ATP$) through tight reciprocal allosteric and hormonal regulation.

---

## 1. Glycolysis vs Gluconeogenesis Reciprocal Regulation

Glycolysis converts one molecule of Glucose into two molecules of Pyruvate, generating a net of **$2\\text{ ATP}$ and $2\\text{ NADH}$**. Gluconeogenesis bypasses the three irreversible thermodynamic bottlenecks:

| Step & Irreversible Reaction | Glycolytic Enzyme & Allosteric Regulators | Gluconeogenic Bypass Enzyme & Regulators |
| :--- | :--- | :--- |
| **Step 1: Glucose $\\leftrightarrow$ G6P** | **Hexokinase** (ubiquitous; low $K_m$, low $V_{max}$; inhibited by G6P)<br>**Glucokinase** (Liver/$\\beta$-cells; high $K_m$, high $V_{max}$; induced by Insulin) | **Glucose-6-Phosphatase** (Endoplasmic reticulum of Liver/Kidney; absent in Muscle $\\implies$ muscle cannot release free glucose into blood) |
| **Step 2: F6P $\\leftrightarrow$ F-1,6-BP**<br>*(Rate-Limiting Step)* | **Phosphofructokinase-1 (PFK-1)**<br>• **Stimulated by**: AMP, **Fructose-2,6-bisphosphate ($F\\text{-}2,6\\text{-}BP$)**<br>• **Inhibited by**: ATP, Citrate | **Fructose-1,6-Bisphosphatase (FBPase-1)**<br>• **Stimulated by**: ATP, Citrate<br>• **Inhibited by**: AMP, **Fructose-2,6-bisphosphate** |
| **Step 3: PEP $\\leftrightarrow$ Pyruvate** | **Pyruvate Kinase (PK)**<br>• **Stimulated by**: Fructose-1,6-BP (feedforward)<br>• **Inhibited by**: ATP, Alanine, Glucagon (via PKA phosphorylation) | **Pyruvate Carboxylase** ($+$ Biotin/$B_7$, stimulated by Acetyl-CoA in mitochondria) $\\rightarrow$ Oxaloacetate $\\rightarrow$ **PEP Carboxykinase (PEPCK)** ($+$ GTP in cytosol) |

> **Master Bifunctional Switch: PFK-2 / FBPase-2**:
> - **Well-Fed State (Insulin $\\uparrow$)**: Activates Protein Phosphatase $\\rightarrow$ Dephosphorylates enzyme $\\rightarrow$ **PFK-2 active** $\\rightarrow \\uparrow F\\text{-}2,6\\text{-}BP \\rightarrow$ **Stimulates PFK-1 $\\implies$ Enhances Glycolysis**.
> - **Fasting State (Glucagon $\\uparrow \\implies \\uparrow$ cAMP $\\rightarrow$ PKA)**: Phosphorylates enzyme $\\rightarrow$ **FBPase-2 active** $\\rightarrow \\downarrow F\\text{-}2,6\\text{-}BP \\rightarrow$ Relieves inhibition on FBPase-1 $\\implies$ **Enhances Gluconeogenesis**.

---

## 2. Pyruvate Dehydrogenase (PDH) Complex & Arsenic Poisoning

Mitochondrial conversion of Pyruvate to Acetyl-CoA requires the **PDH multienzyme complex** ($E_1, E_2, E_3$) and **5 Essential Vitamin Coenzymes** (Mnemonic: **Tender Loving Care For Nancy**):

1. **T**hiamine pyrophosphate ($TPP, \\text{Vitamin } B_1$)
2. **L**ipoic acid (*Inhibited by Arsenic $\\implies$ garlic breath, vomiting, rice-water diarrhea, QT prolongation*)
3. **C**oenzyme A ($CoA, \\text{Vitamin } B_5$ / Pantothenic acid)
4. **F**AD ($FAD, \\text{Vitamin } B_2$ / Riboflavin)
5. **N**AD ($NAD^+, \\text{Vitamin } B_3$ / Niacin)

- **PDH Deficiency (X-linked)**: Pyruvate shunts to Lactic Acid (via LDH) and Alanine (via ALT), causing severe **lactic acidosis, neurological impairment, and microcephaly**.
  - *Dietary Treatment*: Ketogenic diet (high fat, high **Lysine and Leucine**—the only purely ketogenic amino acids).

---

## 3. Glycogen Storage Diseases (GSDs)

| Disease & Type | Deficient Enzyme | Clinical Presentation & Pathognomonic Triad | Liver / Muscle Involvement |
| :--- | :--- | :--- | :--- |
| **Type I: Von Gierke** | **Glucose-6-Phosphatase** | Severe fasting hypoglycemia, **$\\uparrow \\uparrow$ Lactic Acidosis**, **$\\uparrow \\uparrow$ Uric Acid (Gout)**, **$\\uparrow \\uparrow$ Triglycerides**, Doll-like cherubic face, Massive hepatomegaly | Liver & Kidney (Normal glycogen structure, massive accumulation) |
| **Type II: Pompe** | **Lysosomal $\\alpha$-1,4-glucosidase** (Acid Maltase) | **Hypertrophic Cardiomyopathy**, macroglossia, profound hypotonia, early infant death | Heart, Liver, Skeletal muscle (*"Pompe trashes the Pump"*) |
| **Type III: Cori** | **Debranching Enzyme** ($\\alpha$-1,6-glucosidase) | Mild hypoglycemia, hepatomegaly, normal blood lactate | Accumulation of **abnormal limit dextrin** (short outer branches) |
| **Type V: McArdle** | **Skeletal Muscle Glycogen Phosphorylase** (Myophosphorylase) | Painful muscle cramps and **myoglobinuria (red urine)** during strenuous exercise, **second-wind phenomenon**; normal blood lactate curve on ischemic exercise test | Muscle only (Liver is completely spared) |

---

## 4. HMP Shunt (Pentose Phosphate Pathway) & G6PD Deficiency

- **Rate-Limiting Enzyme**: **Glucose-6-Phosphate Dehydrogenase (G6PD)** generates $NADPH$.
- **Functions of $NADPH$**:
  1. Reductive biosynthesis (Fatty acids, Cholesterol, Steroids).
  2. **Reduced Glutathione ($GSH$) Maintenance**: Glutathione reductase uses $NADPH$ to reduce oxidized glutathione ($GSSG \\rightarrow 2\\text{ GSH}$), protecting RBC membranes from reactive oxygen species ($H_2O_2$).
- **G6PD Deficiency (X-linked Recessive)**:
  - Triggers: **Fava beans, Sulfa drugs, Primaquine, Dapsone, Nitrofurantoin, Infections**.
  - Oxidative stress denatures hemoglobin $\\implies$ **Heinz Bodies** (insoluble hemoglobin aggregates).
  - Splenic macrophages pluck out Heinz bodies $\\implies$ **Bite Cells (Degmacytes)** $\\rightarrow$ acute intravascular and extravascular hemolytic anemia.
`,
  clinicalVignettes: [
    {
      scenario: "A 4-month-old male infant is brought to the clinic for lethargy, irritability, and failure to thrive. Physical examination reveals a rounded, cherubic doll-like face, thin extremities, and profound hepatomegaly with liver edge palpable 6 cm below the right costal margin. Laboratory workup demonstrates: Fasting Blood Glucose 32 mg/dL (severe hypoglycemia), Serum Lactate 6.8 mmol/L (markedly elevated), Serum Uric Acid 11.2 mg/dL (hyperuricemia), and Serum Triglycerides 580 mg/dL. Administration of glucagon fails to produce an increase in blood glucose.",
      question: "Which of the following enzymes is deficient in this infant?",
      options: [
        "Glucose-6-Phosphatase (Von Gierke Disease / GSD Type I)",
        "Lysosomal alpha-1,4-glucosidase (Pompe Disease / GSD Type II)",
        "Muscle Glycogen Phosphorylase (McArdle Disease / GSD Type V)",
        "Galactose-1-Phosphate Uridyltransferase (Classic Galactosemia)"
      ],
      correctAnswerIndex: 0,
      explanation: "Von Gierke Disease (Type I Glycogen Storage Disease) is caused by deficiency of Glucose-6-Phosphatase, impairing both glycogenolysis and gluconeogenesis. This results in profound fasting hypoglycemia, severe lactic acidosis (pyruvate diverted to lactate), hyperuricemia (G6P shunted into HMP shunt increasing PRPP and purine catabolism), and hypertriglyceridemia with doll-like facial appearance and massive hepatomegaly."
    }
  ]
};
