/**
 * Internship Core Clinical Postings: Rural Primary Health Center (PHC) & Sub-Center Outpatient Care
 * Authoritative rural health content derived from Ayushman Bharat Guidelines, NHM CPHC Manuals.
 * Mapped to NMC CBME Competencies: IN6.3, CM5.3, CM10.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RURAL_PRIMARY_CARE_AYUSHMAN_BHARAT_MODULE: PhysiologyLessonModule = {
  id: "int6-rural-primary-care-ayushman-bharat",
  unitCode: "IN6.3",
  title: "Rural Primary Care: Ayushman Bharat Health & Wellness Centres (HWCs), NCD Population Screening & STI Syndromic Kits",
  competencies: ["IN6.3", "CM5.3", "CM10.1"],
  estimatedMinutes: 150,
  organ3dTarget: "GENERAL",
  markdownContent: `
# Rural Primary Healthcare: Ayushman Bharat HWCs & Syndromic Management

Universal non-communicable disease (NCD) screening, decentralized primary healthcare delivery, and standardized color-coded syndromic management protocols bridge the rural health equity gap.

---

## 1. Ayushman Bharat Health and Wellness Centres (AB-HWCs / Ayushman Arogya Mandir)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Facility Level} & \\textbf{Primary Team Lead} & \\textbf{Population Covered} & \\textbf{Core Service Packages} \\\\
\\hline
\\textbf{Sub-Health Centre (SHC-HWC)} & \\mathbf{\\text{Community Health Officer (CHO)}} & 3{,}000-5{,}000 & \\text{12 Comprehensive Primary Health Care} \\\\
& + \\text{ Multi-Purpose Worker (MPW/ANM) + ASHA} & & (\\text{CPHC}) \\text{ Service Packages} \\\\
\\textbf{Primary Health Centre (PHC-HWC)} & \\mathbf{\\text{Medical Officer (MBBS)}} & 20{,}000-30{,}000 & \\text{Outpatient, basic emergency, maternal/child,} \\\\
& + \\text{ Staff Nurses + Pharmacist + Lab Tech} & & \\text{NCD management, teleconsultation (eSanjeevani)} \\\\
\\textbf{Community Health Centre (CHC)} & \\text{Specialists (Surgeon, Physician, ObGyn, Peds)} & 80{,}000-120{,}000 & \\text{First Referral Unit (FRU), 30 beds, emergency OR} \\\\
\\hline
\\end{array}$$

---

## 2. NCD Population-Based Screening (PBS) & CBAC Protocols

- **Target Population**: All individuals aged **$\\ge 30\\text{ years}$** in the village catchment area.
- **Community Based Assessment Checklist (CBAC)**:
  - Administered by ASHA worker door-to-door.
  - Scores $\\ge 4$ trigger prioritized physical evaluation at the HWC.
- **Hypertension & Diabetes Algorithms**:
  - **Hypertension**: Confirmed SBP $\\ge 140\\text{ mmHg}$ or DBP $\\ge 90\\text{ mmHg}$ $\\rightarrow$ Initiate **Telmisartan $40\\text{ mg}$ or Amlodipine $5\\text{ mg}$** once daily.
  - **Diabetes Mellitus**: Fasting capillary glucose $\\ge 126\\text{ mg/dL}$ or random $\\ge 200\\text{ mg/dL}$ $\\rightarrow$ Initiate **Metformin $500\\text{ mg}$ BID** with meals.

---

## 3. Syndromic Management of STIs / RTIs (NACO Color-Coded Kits)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Kit Color / Number} & \\textbf{Clinical STI Syndrome} & \\textbf{Standard Drug Regimen} & \\textbf{Target Pathogens} \\\\
\\hline
\\textbf{Kit 1 (Grey)} & \\mathbf{\\text{Urethral / Cervical Discharge}} & \\mathbf{\\text{Tab Azithromycin } 1\\text{ g single dose +}} & \\text{Neisseria gonorrhoeae} \\\\
& (\\text{or Painful Scrotal Swelling}) & \\mathbf{\\text{Tab Cefixime } 400\\text{ mg single dose}} & + \\text{ Chlamydia trachomatis} \\\\
\\textbf{Kit 2 (Green)} & \\mathbf{\\text{Vaginal Discharge / Vaginitis}} & \\mathbf{\\text{Tab Secnidazole } 2\\text{ g single dose +}} & \\text{Trichomonas vaginalis, Bacterial} \\\\
& & \\mathbf{\\text{Tab Fluconazole } 150\\text{ mg single dose}} & \\text{Vaginosis, Candida albicans} \\\\
\\textbf{Kit 3 (White)} & \\mathbf{\\text{Genital Ulcer (Non-Herpetic)}} & \\mathbf{\\text{Inj Benzathine Penicillin } 2.4\\text{ MU IM +}} & \\text{Treponema pallidum (Syphilis)} \\\\
& & \\mathbf{\\text{Tab Azithromycin } 1\\text{ g single dose}} & + \\text{ Haemophilus ducreyi (Chancroid)} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 23-year-old male presents to a rural Primary Health Centre outpatient clinic complaining of 3 days of burning micturition and copious purulent yellowish-white urethral discharge following unprotected sexual exposure. Microscopy facilities are not available at the centre.",
      question: "Under the NACO Syndromic STI Management national guidelines, which color-coded kit and medication regimen should be dispensed immediately?",
      options: [
        "Dispense Kit 1 (Grey Kit) containing Tab Azithromycin 1 g orally as a single dose PLUS Tab Cefixime 400 mg orally as a single dose; provide partner notification and treatment, condoms, and schedule 7-day follow-up",
        "Dispense Kit 2 (Green Kit) containing Secnidazole and Fluconazole",
        "Dispense oral ciprofloxacin 250 mg daily for 30 days without partner treatment",
        "Advise warm sitz baths and withhold antimicrobial therapy"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates NACO Syndromic STI Management: (1) Clinical Syndrome: Urethral discharge in a sexually active male is treated empirically for both Neisseria gonorrhoeae and Chlamydia trachomatis; (2) Kit Selection: Kit 1 (Grey Kit) contains Cefixime 400 mg (bactericidal for N. gonorrhoeae) + Azithromycin 1 g (eradicates C. trachomatis); (3) Comprehensive Management: Syndromic management mandates four pillars: treatment with standard kit, counseling/education, condom demonstration/provision, and mandatory confidential partner notification/treatment."
    }
  ]
};
