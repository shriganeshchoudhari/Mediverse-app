/**
 * Family Medicine & Primary Care Postings: Comprehensive Geriatric Assessment & Beers Criteria Polypharmacy
 * Authoritative geriatric care content derived from AGS Beers Criteria 2023, Hazzard's Geriatric Medicine.
 * Mapped to NMC CBME Competencies: FM1.3, CM1.3, IM1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GERIATRIC_ASSESSMENT_BEERS_MODULE: PhysiologyLessonModule = {
  id: "fam-geriatric-assessment-beers",
  unitCode: "FM1.3",
  title: "Geriatric Assessment & Polypharmacy: ADLs/IADLs, Mini-Cog, Fall Risk (TUG) & AGS Beers Criteria 2023 Deprescribing",
  competencies: ["FM1.3", "CM1.3", "IM1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Comprehensive Geriatric Assessment, Fall Prevention & Beers Deprescribing

Geriatric primary care preserves functional independence by screening for cognitive decline, assessing fall risks, and deprescribing potentially inappropriate medications.

---

## 1. Comprehensive Geriatric Assessment (CGA) Domains

$$\\begin{array}{lcccc}
\\hline
\\textbf{Assessment Domain} & \\textbf{Clinical Tool / Maneuver} & \\textbf{Core Components Evaluated} & \\textbf{Pathological Diagnostic Threshold} \\\\
\\hline
\\textbf{Basic ADLs} & \\text{Katz Index of ADLs} & \\text{Bathing, Dressing, Toileting, Transferring,} & \\text{Loss of } \\ge 1\\text{ ADL indicates dependency} \\\\
& & \\text{Continence, Feeding (\"DEATH\")} & \\text{requiring caregiver / nursing assistance} \\\\
\\textbf{Instrumental ADLs} & \\text{Lawton IADL Scale} & \\text{Managing finances, handling medications, telephone,} & \\mathbf{\\text{Early indicator of cognitive / executive decline;}} \\\\
(\\textbf{IADLs}) & & \\text{cooking, shopping, housekeeping, transportation (\"SHAFT\")} & \\text{lost before basic ADLs in mild dementia} \\\\
\\textbf{Cognitive Screening} & \\mathbf{\\text{Mini-Cog}} & \\mathbf{3\\text{-item word recall } + \\text{ Clock Drawing Test (CDT)}} & \\mathbf{\\text{Abnormal: 0 recall OR 1-2 recall with abnormal clock}} \\\\
\\textbf{Mobility \u0026 Fall Risk} & \\mathbf{\\text{Timed Up and Go (TUG)}} & \\text{Stand from chair, walk 3 meters, turn, return, sit} & \\mathbf{\\text{Time } > 12\\text{ seconds indicates HIGH fall risk}} \\\\
\\hline
\\end{array}$$

---

## 2. AGS Beers Criteria (2023 Update) High-Risk Medications to Avoid in Older Adults

$$\\begin{array}{lcccc}
\\hline
\\textbf{Drug Class / Medication} & \\textbf{Pharmacological Agent} & \\textbf{Adverse Consequences in Older Adults} & \\textbf{Safer Alternative} \\\\
\\hline
\\textbf{1st-Gen Antihistamines} & \\text{Diphenhydramine, Hydroxyzine} & \\mathbf{\\text{Anticholinergic: Delirium, falls, urinary retention, dry mouth}} & \\text{Loratadine, Cetirizine, Saline nasal spray} \\\\
\\textbf{Benzodiazepines \u0026 Z-Drugs} & \\text{Diazepam, Lorazepam, Zolpidem} & \\mathbf{\\text{Severe sedation, cognitive impairment, ataxia, motor vehicle crashes, hip fractures}} & \\text{CBT for Insomnia (CBT-I), Melatonin} \\\\
\\textbf{Long-Acting Sulfonylureas} & \\mathbf{\\text{Glyburide, Glimepiride}} & \\mathbf{\\text{Severe, prolonged hypoglycemia due to active renal metabolites}} & \\text{Glipizide, Metformin, DPP-4i, SGLT2i} \\\\
\\textbf{Chronic NSAIDs} & \\text{Ibuprofen, Naproxen, Ketorolac} & \\mathbf{\\text{GI bleeding/ulcers, acute kidney injury, worsening HTN and heart failure}} & \\text{Acetaminophen, Topical NSAIDs (Diclofenac)} \\\\
\\textbf{Muscle Relaxants} & \\text{Cyclobenzaprine, Carisoprodol} & \\text{Sedation, anticholinergic toxicity, fractured hips} & \\text{Physical therapy, heat, stretching} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "An 82-year-old female is brought to the outpatient clinic by her daughter due to progressive forgetfulness, unsteady gait, and two near-falls in the past month. Her current medications include Glyburide 10 mg daily for type 2 diabetes, Diphenhydramine 50 mg nightly for insomnia, and Zolpidem 10 mg as needed for sleep. On physical examination, her Timed Up and Go (TUG) test takes 18 seconds (normal <12 seconds). Her Mini-Cog demonstrates 1/3 word recall with an abnormal clock drawing test.",
      question: "According to the American Geriatrics Society (AGS) Beers Criteria 2023, what is the most appropriate initial medication management strategy for this patient?",
      options: [
        "Deprescribe Diphenhydramine and Zolpidem to reduce sedative-anticholinergic fall and delirium risk; discontinue Glyburide and transition to a lower-hypoglycemia agent (e.g. Glipizide or DPP-4 inhibitor); initiate physical therapy balance training",
        "Increase Zolpidem to 20 mg to ensure uninterrupted sleep",
        "Add Donepezil and maintain all other medications unchanged",
        "Start Amitriptyline for insomnia and neuropathic pain"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic polypharmacy and inappropriate prescribing in geriatrics based on the AGS Beers Criteria: (1) High-Risk Medications: Diphenhydramine (anticholinergic causing delirium, urinary retention, and falls), Zolpidem (Z-drug causing ataxia, nocturnal confusion, and hip fractures), and Glyburide (long-acting sulfonylurea causing prolonged hypoglycemia in elderly patients with reduced renal clearance); (2) Deprescribing Priority: Safely tapering and stopping these high-risk sedatives/anticholinergics and switching Glyburide to a safer agent directly mitigates the patient's elevated fall risk (TUG 18 seconds) and cognitive impairment (abnormal Mini-Cog)."
    }
  ]
};
