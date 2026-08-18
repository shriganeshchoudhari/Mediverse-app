/**
 * Family Medicine & Primary Care Postings: Preventive Health Screening & USPSTF Cancer Surveillance
 * Authoritative preventive medicine content derived from USPSTF, CDC ACIP, Rakel's Family Medicine.
 * Mapped to NMC CBME Competencies: FM1.1, CM1.1, IM1.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PREVENTIVE_SCREENING_USPSTF_MODULE: PhysiologyLessonModule = {
  id: "fam-preventive-screening-uspstf",
  unitCode: "FM1.1",
  title: "Preventive Health Screening: USPSTF Cancer Surveillance (CRC, Breast, Cervical, Lung LDCT, AAA) & Adult Immunizations",
  competencies: ["FM1.1", "CM1.1", "IM1.1"],
  estimatedMinutes: 150,
  organ3dTarget: "GASTROINTESTINAL",
  markdownContent: `
# Preventive Health Screening, USPSTF Guidelines & Adult Immunizations

Evidence-based preventive primary care reduces premature mortality through age-appropriate cancer surveillance and population-level immunization.

---

## 1. USPSTF Cancer Screening Guidelines Summary

$$\\begin{array}{lcccc}
\\hline
\\textbf{Malignancy} & \\textbf{Target Demographic} & \\textbf{Screening Modality \u0026 Frequency} & \\textbf{Discontinuation Criteria} \\\\
\\hline
\\textbf{Colorectal Cancer} & \\mathbf{\\text{Ages 45 to 75 years}} & \\mathbf{\\text{Colonoscopy every 10 years}} \\text{ OR annual FIT} & \\text{Age 76-85 (individualized);} \\\\
& & \\text{OR stool FIT-DNA every 3 years} & \\mathbf{\\text{discontinue } > 85\\text{ years}} \\\\
\\textbf{Breast Cancer} & \\mathbf{\\text{Ages 40 to 74 years}} & \\mathbf{\\text{Biennial screening mammography (every 2 years)}} & \\text{Age } \\ge 75\\text{ years (insufficient evidence)} \\\\
\\textbf{Cervical Cancer} & \\text{Ages 21-29: Pap every 3y} & \\mathbf{\\text{Ages 30-65: hrHPV every 5y OR Pap every 3y}} & \\mathbf{\\text{Age 65 if adequate prior negative tests}} \\\\
& & \\text{OR hrHPV + Pap co-testing every 5y} & (\\ge 3\\text{ Pap or } \\ge 2\\text{ HPV negative in 10y}) \\\\
\\textbf{Lung Cancer} & \\mathbf{\\text{Ages 50 to 80 years with}} & \\mathbf{\\text{Annual Low-Dose Computed Tomography (LDCT)}} & \\text{Quit smoking } \\ge 15\\text{ years ago OR} \\\\
& \\mathbf{\\ge 20\\text{ pack-year history}} & & \\text{develops limiting health condition} \\\\
\\textbf{Abdominal Aortic} & \\mathbf{\\text{Men aged 65 to 75 years}} & \\mathbf{\\text{One-time abdominal ultrasound screening}} & \\text{Non-smokers or women without family} \\\\
\\textbf{Aneurysm (AAA)} & \\mathbf{\\text{who have EVER smoked}} & & \\text{history (not routinely recommended)} \\\\
\\hline
\\end{array}$$

---

## 2. Adult Immunization Schedule (CDC ACIP)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Vaccine} & \\textbf{Target Population} & \\textbf{Dosing Schedule \u0026 Indications} \\\\
\\hline
\\textbf{Influenza} & \\text{All adults } \\ge 6\\text{ months} & \\text{Annually in autumn (high-dose or adjuvanted for age } \\ge 65\\text{)} \\\\
\\textbf{Tdap / Td} & \\text{All adults} & \\mathbf{\\text{1 dose Tdap, then Td/Tdap booster every 10 years; Tdap with EACH pregnancy (27-36 weeks)}} \\\\
\\textbf{Zoster Recombinant (Shingrix)} & \\mathbf{\\text{Adults } \\ge 50\\text{ years}} & \\mathbf{2\\text{ doses (0, 2-6 months) regardless of prior shingles or live zoster vaccine}} \\\\
\\textbf{Pneumococcal (PCV20 / PCV15)} & \\mathbf{\\text{Adults } \\ge 65\\text{ years}} & \\mathbf{\\text{1 dose PCV20 alone OR PCV15 followed by PPSV23 1 year later (or age 19-64 with comorbidities)}} \\\\
\\textbf{RSV (Respiratory Syncytial)} & \\text{Adults } \\ge 60\\text{ years} & \\text{Shared clinical decision-making based on chronic cardiopulmonary risk} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 56-year-old male presents for a routine annual wellness examination. He has no personal or family history of cancer. He smoked 1 pack of cigarettes daily for 25 years (25 pack-years) but successfully quit 6 years ago. He has never undergone any cancer screening procedures. He feels entirely asymptomatic with normal vital signs and physical examination.",
      question: "According to the United States Preventive Services Task Force (USPSTF) guidelines, which cancer screening modalities are recommended for this patient today?",
      options: [
        "Annual Low-Dose CT (LDCT) of the chest for lung cancer screening AND screening Colonoscopy (or annual fecal immunochemical test FIT) for colorectal cancer screening",
        "Abdominal ultrasound for abdominal aortic aneurysm AND whole-body PET scan",
        "Chest X-ray every 6 months AND serum CEA tumor marker level",
        "No screening is indicated because he quit smoking 6 years ago and is asymptomatic"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates age- and risk-appropriate USPSTF cancer screening recommendations: (1) Lung Cancer Screening: Annual Low-Dose Computed Tomography (LDCT) is recommended for adults aged 50-80 who have a >=20 pack-year smoking history and currently smoke or have quit within the past 15 years; because this patient has 25 pack-years and quit 6 years ago, he meets criteria; (2) Colorectal Cancer Screening: Recommended for all average-risk adults aged 45-75 via colonoscopy every 10 years or annual FIT; (3) AAA Screening: AAA ultrasound is indicated only for men aged 65-75 who have ever smoked, so he is currently too young for AAA screening."
    }
  ]
};
