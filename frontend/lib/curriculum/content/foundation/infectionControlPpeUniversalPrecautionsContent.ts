/**
 * Foundation Course & Early Clinical Exposure: Hospital Infection Control, PPE & Universal Precautions
 * Authoritative hospital epidemiology & infection control content derived from WHO Guidelines, CDC.
 * Mapped to NMC CBME Competencies: FC5.1, FC5.2, ECE2.1, AETCOM1.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const INFECTION_CONTROL_PPE_UNIVERSAL_PRECAUTIONS_MODULE: PhysiologyLessonModule = {
  id: "foundation-infection-control-ppe-universal-precautions",
  unitCode: "FC5.1",
  title: "Hospital Infection Control: WHO 5 Moments for Hand Hygiene, Standard & Transmission Precautions, PPE & NSI Prophylaxis",
  competencies: ["FC5.1", "FC5.2", "ECE2.1", "AETCOM1.3"],
  estimatedMinutes: 150,
  organ3dTarget: "IMMUNE",
  markdownContent: `
# Hospital Infection Control, Personal Protective Equipment & Post-Exposure Prophylaxis

Healthcare-associated infections (HAIs) and occupational bloodborne pathogen transmissions are prevented through rigorous hand hygiene, isolation precautions, and rapid post-exposure protocols.

---

## 1. Transmission-Based Precautions \u0026 Isolation Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Precaution Category} & \\textbf{Target Pathogens} & \\textbf{Required PPE} & \\textbf{Room / Ventilation Requirement} & \\textbf{Clinical Protocol} \\\\
\\hline
\\textbf{Standard} & \\text{All patients (blood, bodily fluids,} & \\text{Gloves, gown/mask if splash risk} & \\text{Standard room} & \\mathbf{\\text{WHO 5 Moments for Hand Hygiene}} \\\\
\\textbf{Precautions} & \\text{non-intact skin, mucous membranes)} & & & \\\\
\\textbf{Contact} & \\mathbf{\\text{MRSA, VRE, C. difficile,}} & \\mathbf{\\text{Gloves + Gown (mandatory}} & \\text{Private room (or cohorting)} & \\mathbf{\\text{Soap and water for C. difficile}} \\\\
\\textbf{Precautions} & \\text{ESBL, Norovirus, Scabies} & \\mathbf{\\text{upon entering patient room)}} & & (\\mathbf{\\text{Alcohol rub ineffective vs spores}}) \\\\
\\textbf{Droplet} & \\mathbf{\\text{N. meningitidis, Influenza,}} & \\mathbf{\\text{Surgical Mask (within 3-6 feet)}} & \\text{Private room; spatial separation} & \\text{Patient wears surgical mask} \\\\
\\textbf{Precautions} & \\text{B. pertussis, Rubella, Mumps} & + \\text{ eye protection if coughing} & \\ge 3 \\text{ feet if shared} & \\text{during hospital transport} \\\\
\\textbf{Airborne} & \\mathbf{\\text{Mycobacterium tuberculosis,}} & \\mathbf{\\text{Fit-Tested N95 Respirator}} & \\mathbf{\\text{Airborne Infection Isolation Room (AIIR):}} & \\mathbf{\\text{Negative pressure room with}} \\\\
\\textbf{Precautions} & \\mathbf{\\text{Measles (Rubeola), Varicella-Zoster}} & \\text{or PAPR before entry} & \\mathbf{\\text{Negative Pressure, } \\ge 12\\text{ ACH, HEPA}} & \\mathbf{\\ge 12\\text{ air changes/hr (ACH)}} \\\\
\\hline
\\end{array}$$

- **PPE Donning \u0026 Doffing Sequences**:
  - **Donning (Putting On)**: Gown $\\rightarrow$ Mask / N95 Respirator $\\rightarrow$ Goggles / Face Shield $\\rightarrow$ Gloves (pulled over gown cuffs).
  - **Doffing (Taking Off - Most Contaminated First)**: Gloves $\\rightarrow$ Goggles / Shield $\\rightarrow$ Gown $\\rightarrow$ Mask / N95 (removed by straps outside room) $\\rightarrow$ **Immediate Hand Hygiene**.

---

## 2. Needle-Stick Injury (NSI) \u0026 Post-Exposure Prophylaxis (PEP)

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pathogen} & \\textbf{Transmission Risk per NSI} & \\textbf{Immediate First Aid} & \\textbf{PEP Regimen \u0026 Window} & \\textbf{Duration / Monitoring} \\\\
\\hline
\\textbf{HIV} & \\mathbf{\\sim 0.3\\%\\text{ (1 in 300 percutaneous)}} & \\text{Wash with soap \u0026 water;} & \\mathbf{\\text{Tenofovir (TDF) + Emtricitabine (FTC)}} & \\mathbf{28\\text{ Days Duration;}} \\\\
& & \\mathbf{\\text{DO NOT squeeze or scrub}} & \\mathbf{+ \\text{ Dolutegravir (DTG) within } \\le 2\\text{h (max 72h)}} & \\text{baseline, 6w, 12w, 24w testing} \\\\
\\textbf{Hepatitis B} & \\mathbf{\\sim 30\\%\\text{ (if HBeAg positive)}} & \\text{Wash with soap \u0026 water} & \\mathbf{\\text{HBIG (0.06 mL/kg) + Hep B Vaccine}} & \\text{If recipient is unimmunized or non-responder} \\\\
(\\textbf{HBV}) & \\sim 6\\% \\text{ (if HBeAg negative)} & & (\\text{give within } 24\\text{ hours}) & (\\text{Anti-HBs } < 10\\text{ mIU/mL}) \\\\
\\textbf{Hepatitis C} & \\mathbf{\\sim 1.8\\%\\text{ (1-2 per 100)}} & \\text{Wash with soap \u0026 water} & \\mathbf{\\text{NO PEP AVAILABLE;}} & \\text{Check HCV RNA at 4-6 weeks;} \\\\
(\\textbf{HCV}) & & & \\text{monitor for seroconversion} & \\text{treat early with DAAs if positive} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 24-year-old first-year medical intern accidentally sustains a deep needle-stick injury to her left index finger while drawing arterial blood from a hollow-bore needle used on an inpatient with poorly controlled HIV (viral load 120,000 copies/mL) and acute hepatitis B infection. The intern immediately washes her finger under running tap water with soap and water without squeezing or scrubbing the wound. Hospital records show the intern received the full 3-dose Hepatitis B vaccine series upon medical school entry, with a documented anti-HBs titer of 240 mIU/mL (protective immunity >10 mIU/mL).",
      question: "What is the most appropriate immediate post-exposure prophylaxis (PEP) management for this intern?",
      options: [
        "Initiate 3-drug HIV Post-Exposure Prophylaxis (Tenofovir + Emtricitabine/Lamivudine + Dolutegravir) immediately (ideally within 2 hours, maximum 72 hours) and continue for 28 days; no Hepatitis B PEP or vaccine booster is needed because she has documented protective immunity (anti-HBs >10 mIU/mL)",
        "Administer both HIV PEP and Hepatitis B Immunoglobulin (HBIG) plus Hepatitis B vaccine booster",
        "Withhold HIV PEP and wait for the intern's baseline HIV antibody test results",
        "Wash the puncture site with concentrated povidone-iodine and bleach"
      ],
      correctAnswerIndex: 0,
      explanation: "This needle-stick scenario illustrates standard post-exposure prophylaxis (PEP) guidelines: (1) HIV Exposure Management: Hollow-bore blood exposure from a source patient with high HIV viremia represents high transmission risk (~0.3%); a 3-drug antiretroviral PEP regimen (Tenofovir disoproxil fumarate + Emtricitabine + Dolutegravir) must be started immediately (optimal window <2 hours, absolute cut-off 72 hours) and maintained for a full 28 days; (2) Hepatitis B Immunity: The intern has documented protective anti-HBs antibodies (>10 mIU/mL), meaning she is immune to HBV and requires neither HBIG nor additional vaccine boosters; (3) Wound Care: Gentle washing with soap and water is correct; squeezing, milking, or using caustic antiseptics increases local tissue damage and infection risk."
    }
  ]
};
