/**
 * Gastroenterology: Jaundice Differential Diagnosis & Bilirubin Metabolism
 * Authoritative medical content derived from Sleisenger and Fordtran's Gastrointestinal and Liver Disease (11th ed.), Zakim and Boyer's Hepatology.
 * Mapped to NMC CBME Competencies: IM8.1, IM8.2, PA26.1, PA26.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const JAUNDICE_BILIRUBIN_METABOLISM_MODULE: PhysiologyLessonModule = {
  id: "gastroenterology-adv-jaundice-bilirubin-metabolism",
  unitCode: "GA3.1",
  title: "Algorithmic Differential Diagnosis of Jaundice: Gilbert, Crigler-Najjar, Dubin-Johnson & Cholestasis",
  competencies: ["IM8.1", "IM8.2", "PA26.1", "PA26.2"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Differential Diagnosis of Jaundice & Bilirubin Metabolism

Jaundice (icterus) occurs when serum total bilirubin exceeds $2.5 - 3.0\\text{ mg/dL}$, requiring systematic classification into **Unconjugated (Indirect)** vs **Conjugated (Direct)** hyperbilirubinemia.

---

## 1. Unconjugated vs Conjugated Hereditary Hyperbilirubinemias

$$\\begin{array}{lcccc}
\\hline
\\textbf{Disorder} & \\textbf{Bilirubin Type} & \\textbf{Enzymatic / Transport Defect} & \\textbf{Liver Histology} & \\textbf{Clinical Course} \\\\
\\hline
\\textbf{Gilbert Syndrome} & \\text{Unconjugated} & \\text{Mild } \\downarrow \\text{ UGT1A1 activity (}30\\%\\text{ normal; } \\text{TA}_7\\text{ promoter)} & \\text{Normal} & \\text{Benign; episodic mild jaundice with fasting/stress} \\\\
\\textbf{Crigler-Najjar Type I} & \\text{Unconjugated} & \\mathbf{\\text{ABSENT UGT1A1 activity}}\\text{ (Autosomal Recessive)} & \\text{Normal} & \\mathbf{\\text{Fatal kernicterus without liver transplant}} \\\\
\\textbf{Crigler-Najjar Type II} & \\text{Unconjugated} & \\text{Markedly reduced UGT1A1 (}\u003c10\\%\\text{)} & \\text{Normal} & \\text{Responds to } \\mathbf{\\text{Phenobarbital}} \\text{ (induces UGT)} \\\\
\\textbf{Dubin-Johnson} & \\mathbf{\\text{Conjugated}} & \\text{Defective canalicular } \\mathbf{\\text{MRP2 / ABCC2}} \\text{ export} & \\mathbf{\\text{DENSE BLACK LIVER}} & \\text{Benign; normal urinary coproporphyrin ratio} \\\\
\\textbf{Rotor Syndrome} & \\mathbf{\\text{Conjugated}} & \\text{Defective hepatic } \\mathbf{\\text{OATP1B1 / OATP1B3}} \\text{ uptake} & \\text{Normal (Non-pigmented)} & \\text{Benign; normal life expectancy} \\\\
\\hline
\\end{array}$$

---

## 2. Cholestatic vs Hepatocellular Laboratory Profiles

| Diagnostic Parameter | Pre-Hepatic (Hemolytic) | Intra-Hepatic (Hepatitis) | Extra-Hepatic (Biliary Obstruction) |
| :--- | :--- | :--- | :--- |
| **Predominant Bilirubin** | **Unconjugated (Indirect)** | Mixed (Conjugated $>$ Unconjugated) | **Conjugated (Direct)** |
| **Serum Transaminases (ALT/AST)** | Normal | **Markedly elevated ($>1,000\text{ U/L}$)** | Mild-to-moderate elevation |
| **Alkaline Phosphatase (ALP) & GGT** | Normal | Normal or mild elevation | **Markedly elevated ($>3-5\times\text{ ULN}$)** |
| **Urine Bilirubin (Conjugated)** | **ABSENT (Indirect is not water soluble)** | Present (Dark tea-colored urine) | **PRESENT (Dark tea-colored urine)** |
| **Stool Color** | Normal or dark (high stercobilin) | Normal or slightly pale | **ACHOLIC (Pale, clay-colored stools)** |

- **Courvoisier Sign**: Palpable, non-tender, enlarged gallbladder with painless progressive conjugated jaundice $\implies$ highly suggestive of **Malignant Extrahepatic Biliary Obstruction (Pancreatic Head Adenocarcinoma or Cholangiocarcinoma)**, rather than gallstones.
`,
  clinicalVignettes: [
    {
      scenario: "A 21-year-old male university student presents to the student health center complaining of mild yellowing of his eyes after pulling an all-nighter to study for final exams while fasting. He is completely asymptomatic with no abdominal pain, fever, nausea, or history of alcohol use. Physical examination reveals mild scleral icterus with no hepatosplenomegaly. Laboratory evaluation demonstrates: Total Bilirubin 3.2 mg/dL, Direct Bilirubin 0.3 mg/dL (Unconjugated Bilirubin 2.9 mg/dL > 85%), ALT 22 U/L, AST 18 U/L, Alkaline Phosphatase 64 U/L, Hemoglobin 15.2 g/dL, Reticulocyte count 0.8%, and normal haptoglobin.",
      question: "Which of the following represents the most likely diagnosis and underlying molecular pathophysiology in this patient?",
      options: [
        "Gilbert Syndrome secondary to a homozygous TA insertion mutation (A(TA)7TAA) in the promoter region of the UGT1A1 gene",
        "Crigler-Najjar Syndrome Type I secondary to complete deletion of the UGT1A1 catalytic domain",
        "Dubin-Johnson Syndrome secondary to mutation in the canalicular ABCC2 transport protein",
        "Autoimmune hemolytic anemia secondary to warm IgG anti-erythrocyte autoantibodies"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits isolated unconjugated hyperbilirubinemia in an asymptomatic young individual triggered by fasting and sleep deprivation/stress, with completely normal liver transaminases, normal alkaline phosphatase, and no evidence of hemolysis (normal hemoglobin, reticulocytes, and haptoglobin). This is classic Gilbert Syndrome, caused by a homozygous TA7 promoter repeat mutation in the UGT1A1 gene leading to ~30% residual glucuronosyltransferase activity. It is completely benign and requires no treatment or invasive workup."
    }
  ]
};
