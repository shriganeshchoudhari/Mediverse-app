/**
 * Clinical Biochemistry: Porphyrias, Heme Biosynthesis & Urea Cycle Disorders
 * Authoritative medical content derived from Harper's Illustrated Biochemistry (32nd ed.), Harrison's Principles of Internal Medicine.
 * Mapped to NMC CBME Competencies: BI7.1, BI7.2, BI8.1, BI8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PORPHYRIAS_HEME_SYNTHESIS_UREA_CYCLE_MODULE: PhysiologyLessonModule = {
  id: "biochemistry-adv-porphyrias-heme-synthesis-urea-cycle",
  unitCode: "BI7.1",
  title: "Porphyrias (AIP vs PCT), Heme Biosynthesis & Urea Cycle Disorders (OTC vs Orotic Aciduria)",
  competencies: ["BI7.1", "BI7.2", "BI8.1", "BI8.2"],
  estimatedMinutes: 150,
  organ3dTarget: "BIOCHEMISTRY",
  markdownContent: `
# Porphyrias, Heme Biosynthesis & Urea Cycle Disorders

Defects in the multistep heme synthetic pathway cause distinct acute neurovisceral or cutaneous porphyrias, while urea cycle enzyme defects trigger life-threatening hyperammonemic encephalopathy.

---

## 1. Porphyrias: Acute Intermittent Porphyria (AIP) vs Porphyria Cutanea Tarda (PCT)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Feature} & \\textbf{Acute Intermittent Porphyria (AIP)} & \\textbf{Porphyria Cutanea Tarda (PCT)} \\\\
\\hline
\\textbf{Deficient Enzyme} & \\mathbf{\\text{Porphobilinogen (PBG) Deaminase}} & \\mathbf{\\text{Uroporphyrinogen Decarboxylase (UROD)}} \\\\
& \\text{(also known as HMB Synthase)} & \\\\
\\textbf{Accumulated Substrates} & \\mathbf{\\delta\\text{-Aminolevulinic Acid (}\\delta\\text{-ALA)}} \\text{ \u0026 } \\mathbf{\\text{PBG}} & \\mathbf{\\text{Uroporphyrin (Type I / III)}} \\\\
\\textbf{Clinical Presentation} & \\mathbf{\\text{The 5 Ps Mnemonic (Neurovisceral Only!)}}: & \\mathbf{\\text{Cutaneous Photosensitivity Only!}} \\\\
& \\text{1. } \\mathbf{\\text{P}}\\text{ainful Abdomen (severe colicky)} & \\text{• Blistering, bullae, and skin fragility on} \\\\
& \\text{2. } \\mathbf{\\text{P}}\\text{olyneuropathy (motor weakness)} & \\text{  sun-exposed dorsal hands and face} \\\\
& \\text{3. } \\mathbf{\\text{P}}\\text{sychological disturbances (hallucinations)} & \\text{• Hyperpigmentation, hypertrichosis (facial hair)} \\\\
& \\text{4. } \\mathbf{\\text{P}}\\text{ort-wine colored urine (darkens in sunlight)} & \\text{• Tea-colored urine with }\\mathbf{\\text{Coral-Red}} \\\\
& \\text{5. } \\mathbf{\\text{P}}\\text{recipitated by CYP450 inducers/fasting} & \\mathbf{\\text{fluorescence under Wood's lamp}} \\\\
\\textbf{Cutaneous Photosensitivity} & \\mathbf{\\text{STRICTLY ABSENT (No skin lesions!)}} & \\mathbf{\\text{PROMINENT (Hallmark of disease)}} \\\\
\\textbf{Precipitating Triggers} & \\text{Barbiturates, Anti-epileptics, Alcohol, Starvation} & \\text{Hepatitis C, Alcohol, Iron overload (Hemochromatosis)} \\\\
\\textbf{First-Line Management} & \\mathbf{\\text{IV Hemin (Panhematin) \u0026 High-Dose Glucose}} & \\mathbf{\\text{Therapeutic Phlebotomy \u0026 Low-Dose Chloroquine}} \\\\
& \\text{(downregulates hepatic }\\delta\\text{-ALA Synthase 1)} & \\text{Treatment of underlying Hepatitis C} \\\\
\\hline
\\end{array}$$

---

## 2. Urea Cycle Disorders & Hyperammonemic Encephalopathy

- **The Urea Cycle Reaction Sequence**:
  $$\\text{Ammonia } + \\text{ CO}_2 \\xrightarrow{\\text{CPS I}} \\text{Carbamoyl Phosphate} \\xrightarrow{\\text{OTC}} \\text{Citrulline} \\xrightarrow{\\text{ASS}} \\text{Argininosuccinate} \\xrightarrow{\\text{ASL}} \\text{Arginine} \\xrightarrow{\\text{ARG}} \\text{Urea}$$
- **Hyperammonemia Pathophysiology**:
  - Excess ammonia crosses blood-brain barrier $\\rightarrow$ converts $\\alpha$-ketoglutarate to glutamate and glutamate to **glutamine** in astrocytes $\\implies$ **astrocytic swelling, cerebral edema, asterixis ("flapping tremor"), lethargy, coma, and respiratory alkalosis**.

---

## 3. High-Yield Diagnostic Differential: OTC Deficiency vs Orotic Aciduria

$$\\begin{array}{lcccc}
\\hline
\\textbf{Clinical Condition} & \\textbf{Deficient Enzyme \u0026 Pathway} & \\textbf{Serum Ammonia Level} & \\textbf{Urinary Orotic Acid} & \\textbf{Hematologic Finding} \\\\
\\hline
\\textbf{Ornithine Transcarbamylase} & \\text{OTC (Urea Cycle)} & \\mathbf{\\text{ELEVATED}} & \\mathbf{\\text{ELEVATED}} & \\text{No megaloblastic anemia} \\\\
\\textbf{(OTC) Deficiency} & \\text{(X-Linked Recessive)} & \\text{(Severe hyperammonemic coma)} & \\text{(Excess carbamoyl phosphate shunted)} & \\\\
\\hline
\\textbf{Hereditary Orotic Aciduria} & \\text{UMP Synthase} & \\mathbf{\\text{NORMAL}} & \\mathbf{\\text{ELEVATED}} & \\mathbf{\\text{Megaloblastic Anemia}} \\\\
& \\text{(Pyrimidine Synthesis)} & \\text{(No hyperammonemia!)} & & \\text{(Refractory to B12 / Folate)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old female presents to the emergency department with severe, diffuse, colicky abdominal pain, nausea, and visual hallucinations. She began a strict low-carbohydrate starvation diet and was started on Phenobarbital for a seizure disorder 3 days ago. On physical examination, her abdomen is soft and non-tender without peritoneal signs. Neurological examination reveals symmetric proximal motor weakness in the upper extremities. A fresh urine sample is initially pale yellow but turns a dark port-wine color after sitting on the laboratory bench for 2 hours in ambient light.",
      question: "Which of the following enzyme deficiencies and therapeutic interventions is indicated for this patient's acute presentation?",
      options: [
        "Porphobilinogen (PBG) Deaminase deficiency; Intravenous Hemin and Glucose infusion",
        "Uroporphyrinogen Decarboxylase deficiency; Therapeutic phlebotomy",
        "Ornithine Transcarbamylase deficiency; Sodium Benzoate and Phenylbutyrate",
        "delta-Aminolevulinic Acid Dehydratase deficiency; Oral Pyridoxine"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with an acute attack of Acute Intermittent Porphyria (AIP), an autosomal dominant disorder caused by deficiency of Porphobilinogen (PBG) Deaminase (HMB Synthase). The attack was precipitated by CYP450 induction (phenobarbital) and fasting, which upregulate hepatic delta-ALA Synthase 1. Hallmark signs include the classic '5 Ps': Painful abdomen (neurovisceral), Polyneuropathy, Psychological disturbances, Port-wine urine (PBG oxidizes in light to porphobilin), and Precipitated by CYP450 inducers, without cutaneous photosensitivity. The definitive first-line therapy is IV Hemin (Panhematin) and high-dose Glucose infusion, which exert direct negative feedback to downregulate hepatic delta-ALA Synthase 1."
    }
  ]
};
