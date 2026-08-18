/**
 * Clinical Biochemistry: Glycogen Storage Diseases (GSDs) & Gluconeogenesis Disorders
 * Authoritative medical content derived from Harper's Illustrated Biochemistry (32nd ed.), Robbins & Cotran Pathologic Basis of Disease.
 * Mapped to NMC CBME Competencies: BI3.1, BI3.2, BI4.1, BI4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GLYCOGEN_STORAGE_DISEASES_GLUCONEOGENESIS_MODULE: PhysiologyLessonModule = {
  id: "biochemistry-adv-glycogen-storage-diseases-gluconeogenesis",
  unitCode: "BI3.1",
  title: "Glycogen Storage Diseases (GSDs): Von Gierke (Type I), Pompe (Type II), Cori (Type III) & McArdle (Type V)",
  competencies: ["BI3.1", "BI3.2", "BI4.1", "BI4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BIOCHEMISTRY",
  markdownContent: `
# Glycogen Storage Diseases (GSDs): Types I, II, III & V

Glycogen storage diseases are inherited enzyme deficiencies that impair the synthesis or degradation of glycogen, leading to abnormal glycogen accumulation in tissues and metabolic derangements.

---

## 1. High-Yield Glycogen Storage Disease (GSD) Matrix

| GSD Type \u0026 Name | Deficient Enzyme \u0026 Affected Tissue | Primary Biochemical Derangements | Hallmark Clinical Manifestations \u0026 Pathology | Targeted Management Protocols |
| :--- | :--- | :--- | :--- | :--- |
| **Type I: Von Gierke Disease** | **Glucose-6-Phosphatase** (Liver and Kidneys) | Impaired glycogenolysis AND gluconeogenesis $\\implies$ **Severe Fasting Hypoglycemia**, **Profound Lactic Acidosis**, **Hyperuricemia (Gout)**, **Hypertriglyceridemia** | • **Doll-like "cherubic" round facies**.<br>• **Massive Hepatomegaly** (glycogen and fat accumulation) with normal spleen.<br>• Failure to thrive, renomegaly.<br>• Late risk of **Hepatic Adenomas** (may undergo malignant transformation). | • **Frequent oral uncooked cornstarch** (slow-release glucose source) and nocturnal nasogastric glucose infusion.<br>• **Avoid pure Fructose and Galactose** (cannot be converted to glucose; worsen lactic acidosis!).<br>• Allopurinol for hyperuricemia. |
| **Type II: Pompe Disease** | **Lysosomal Acid $\\alpha$-Glucosidase (Acid Maltase)** (Generalized) | Lysosomal accumulation of normal glycogen structure in heart, skeletal muscle, and liver | • **"Pompe trashes the pump"**.<br>• **Massive Hypertrophic Cardiomyopathy** (enormous cardiomegaly with short PR interval and huge QRS voltages).<br>• **Severe generalized hypotonia ("floppy infant")**, macroglossia, early death from heart failure $<2\\text{ years}$. | • **Enzyme Replacement Therapy (ERT)** with recombinant human acid $\\alpha$-glucosidase (**Alglucosidase alfa**). |
| **Type III: Cori / Forbes Disease** | **Debranching Enzyme ($\\alpha\\text{-1,6-Glucosidase}$ / 4-$\\alpha$-glucanotransferase)** | Accumulation of abnormal glycogen with short outer branches (**Limit Dextrin-like structure**) | • Milder fasting hypoglycemia.<br>• Hepatomegaly in infancy.<br>• **NORMAL BLOOD LACTATE LEVEL** (gluconeogenesis is intact!).<br>• Skeletal myopathy and cardiomyopathy in adulthood. | • Frequent small meals with high protein content (provides gluconeogenic amino acid precursors). |
| **Type V: McArdle Disease** | **Skeletal Muscle Glycogen Phosphorylase (Myophosphorylase)** | Inability to mobilize muscle glycogen during anaerobic exercise $\\rightarrow$ lack of ATP | • **"McArdle = Muscle"**.<br>• **Painful muscle cramps, fatigue, and weakness during strenuous exercise**.<br>• **"Second-Wind Phenomenon"** (relief of fatigue after $10-15\\text{ min}$ due to increased blood flow and hepatic FFA/glucose delivery).<br>• **Myoglobinuria** (red-brown urine post-exercise, risk of acute kidney injury). | • Consumption of oral sucrose or simple carbohydrates immediately prior to exercise.<br>• Avoid intense anaerobic exertion. |

---

## 2. Laboratory Differentiators of Glycogenoses

- **Von Gierke vs Cori**:
  - *Von Gierke (Type I)* has **high blood lactate** (glucose-6-phosphate shunted to glycolysis), **high uric acid**, and severe hypoglycemia.
  - *Cori (Type III)* has **normal blood lactate and uric acid** because gluconeogenesis from lactate and alanine is fully functional!
- **McArdle Ischemic Forearm Exercise Test**:
  - Normal individual: anaerobic exercise generates rapid rise in **venous blood lactate** and ammonia.
  - McArdle patient: **FAILURE OF BLOOD LACTATE TO RISE (flat lactate curve)** with normal or exaggerated rise in **blood ammonia** (due to muscle AMP deaminase activation).
`,
  clinicalVignettes: [
    {
      scenario: "A 4-month-old infant is brought to the pediatric clinic for severe lethargy, sweating, and tremors 3 hours after feeding. Physical examination reveals a rounded 'doll-like' face, thin extremities, and massive hepatomegaly extending 6 cm below the right costal margin, without splenomegaly. Laboratory workup demonstrates: Plasma glucose 32 mg/dL, Blood Lactate 6.8 mmol/L (normal: <2.0), Serum Uric Acid 9.8 mg/dL, and elevated serum triglycerides. Administration of glucagon or epinephrine fails to increase blood glucose.",
      question: "Which of the following enzyme deficiencies is the primary cause of this infant's severe fasting hypoglycemia and lactic acidosis?",
      options: [
        "Glucose-6-Phosphatase (Von Gierke Disease, Type I GSD)",
        "Lysosomal Acid alpha-Glucosidase (Pompe Disease, Type II GSD)",
        "Glycogen Debranching Enzyme (Cori Disease, Type III GSD)",
        "Muscle Glycogen Phosphorylase (McArdle Disease, Type V GSD)"
      ],
      correctAnswerIndex: 0,
      explanation: "This infant presents with the classic triad of Von Gierke Disease (Type I Glycogen Storage Disease), caused by deficiency of Glucose-6-Phosphatase. Because this enzyme catalyzes the final common step of both glycogenolysis and gluconeogenesis, its absence produces severe fasting hypoglycemia. The trapped glucose-6-phosphate is shunted into alternative pathways, generating profound lactic acidosis (from pyruvate), hyperuricemia (from increased purine synthesis and lactic acid competition for renal urate excretion), and hypertriglyceridemia, presenting clinically with massive hepatomegaly and a characteristic doll-like cherubic face."
    }
  ]
};
