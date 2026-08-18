/**
 * Infectious Diseases: Fever of Unknown Origin (FUO), Vector-Borne & Tropical Fevers
 * Authoritative medical content derived from Mandell's Infectious Diseases (9th ed.), Harrison's Principles of Internal Medicine.
 * Mapped to NMC CBME Competencies: ID3.1, ID3.2, ID4.1, ID4.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const FEVER_UNKNOWN_ORIGIN_TROPICAL_FEVERS_MODULE: PhysiologyLessonModule = {
  id: "infectious-diseases-fever-unknown-origin-tropical-fevers",
  unitCode: "ID3.1",
  title: "Fever of Unknown Origin (FUO), Malaria (Artesunate), Dengue, Typhoid (Faget Sign) & Scrub Typhus (Eschar)",
  competencies: ["ID3.1", "ID3.2", "ID4.1", "ID4.2"],
  estimatedMinutes: 150,
  organ3dTarget: "MICROBIOLOGY",
  markdownContent: `
# Fever of Unknown Origin (FUO), Vector-Borne & Tropical Fevers

Fever of Unknown Origin represents a diagnostic challenge requiring systematic multi-system evaluation, while tropical fevers demand rapid targeted antimicrobial and supportive therapy.

---

## 1. Classification & Diagnostic Workup of Fever of Unknown Origin (FUO)

- **Classic Petersdorf & Beeson Definition**:
  - Temperature **$>38.3^\\circ\\text{C}$ ($>101.0^\\circ\\text{F}$)** recorded on several occasions.
  - Fever duration of **$>3\\text{ weeks}$**.
  - Uncertain diagnosis despite **$1\\text{ week}$ of intensive inpatient investigation** (or 3 outpatient visits).
- **Durack & Street Revised Categories of FUO**:
  1. **Classic FUO**: Infections ($30-40\\%$, e.g. Extrapulmonary TB, occult intra-abdominal/pelvic abscesses, Infective Endocarditis - Modified Duke Criteria), Malignancies ($20-30\\%$, e.g. Lymphoma, Renal Cell Carcinoma), Non-Infectious Inflammatory Diseases (NIID $20-30\\%$, e.g. Adult-Onset Still Disease, Giant Cell Arteritis/Temporal Arteritis, SLE), Miscellaneous ($10\\%$, Drug fever, Factitious fever).
  2. **Nosocomial FUO**: Hospitalized patient, fever $\\ge 38.3^\\circ\\text{C}$, no infection present on admission, undiagnosed after $3\\text{ days}$ of workup (C. diff, septic thrombophlebitis, drug fever).
  3. **Neutropenic FUO**: Absolute Neutrophil Count (**$\\text{ANC} <500/\\mu\\text{L}$**), fever $\\ge 38.3^\\circ\\text{C}$, negative cultures after $3\\text{ days}$ (invasive aspergillosis, candidiasis).
  4. **HIV-Associated FUO**: Confirmed HIV infection, fever $>3\\text{ weeks}$ outpatient or $>3\\text{ days}$ inpatient (Mycobacterium avium complex [MAC], CMV, Pneumocystis, Histoplasmosis).

---

## 2. Cardinal Tropical Fevers & Vector-Borne Infectious Diseases

| Tropical Disease Entity | Causative Pathogen \u0026 Vector | Hallmark Pathognomonic Clinical Features | Definitive Laboratory Diagnostics | First-Line Antimicrobial / Protocol |
| :--- | :--- | :--- | :--- | :--- |
| **Severe Malaria** | *Plasmodium falciparum* (Female *Anopheles* mosquito) | Cerebral malaria (coma, seizures), blackwater fever (massive intravascular hemolysis + dark hemoglobinuria), severe anemia, ARDS, metabolic acidosis. | Thick and thin Giemsa peripheral blood smears (delicate ring forms, high parasitemia $>5\\%$, **banana/crescent-shaped gametocytes**); Rapid Diagnostic Tests (Pf HRP-2 antigen). | **Intravenous Artesunate** ($2.4\\text{ mg/kg}$ IV at 0, 12, and 24 hours, then once daily until oral therapy can be tolerated) followed by full oral ACT (Artemether-Lumefantrine). |
| **Dengue Fever** | Dengue virus (DENV 1-4 Flavivirus, *Aedes aegypti* mosquito) | "Breakbone fever", severe retro-orbital headache, macular rash, positive **Tourniquet Test** ($>20\\text{ petechiae/sq inch}$).<br>• **Severe Dengue Warning Signs**: Persistent vomiting, abdominal pain, mucosal bleeding, **Plasma Leakage (Hematocrit rise $>20\\%$)**, pleural effusion/ascites, shock. | • **Day 1 to 5**: **Dengue NS1 Antigen ELISA**.<br>• **Day 5 onwards**: **Dengue IgM ELISA** / RT-PCR.<br>• Serial monitoring of Hematocrit and Platelet count. | **Supportive Isotonic Crystalloid Fluid Titration** (maintain adequate tissue perfusion while avoiding fluid overload pulmonary edema). *Aspirin and NSAIDs are strictly contraindicated due to platelet inhibition and Reye syndrome risk!* |
| **Enteric / Typhoid Fever** | *Salmonella enterica* serovar Typhi / Paratyphi (fecal-oral food/water) | **Step-ladder pyrexia** (gradual daily temperature rise), **Relative Bradycardia (Faget Sign - dissociation between high fever and slow pulse)**, **Rose Spots** on trunk/abdomen, hepatosplenomegaly, "pea-soup" diarrhea or constipation. | • **Week 1**: **Blood Culture ($80\\%$ sensitivity)**.<br>• **Week 2**: Widal Serology Test ($TO \\ge 1:160$, $TH \\ge 1:160$).<br>• **Week 3**: Stool and urine cultures (risk of intestinal perforation in Peyer patches). | **IV Ceftriaxone ($2\\text{ g/day}$)** or **Oral Azithromycin ($500\\text{ mg/day} \\times 7\\text{d}$)** for fluoroquinolone-resistant strains. |
| **Scrub Typhus** | *Orientia tsutsugamushi* (Larval trombiculid chigger mite: *Leptotrombidium deliense*) | High fever, severe headache, generalized lymphadenopathy, and the pathognomonic **"Cigarette-Burn" Eschar** (painless black necrotic crusted lesion with surrounding erythematous halo at the site of chigger bite). | • **Weil-Felix Test**: Strong agglutination with **Proteus antigen OX-K**.<br>• Scrub Typhus IgM ELISA / PCR for $56\\text{ kDa}$ outer membrane protein gene. | **Oral Doxycycline ($100\\text{ mg}$ PO bid $\times 7\\text{ days}$)** or **Azithromycin ($500\\text{ mg}$ PO daily $\times 5\\text{ days}$)** (safe in pregnant women and children). |
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old agricultural worker presents to the outpatient clinic with a 6-day history of high spiking fevers, severe retro-orbital headache, body aches, and a non-pruritic dark lesion in the right groin. Vital signs: BP 110/70 mmHg, HR 104 bpm, Temp 39.6°C. Physical examination reveals a 6 mm painless black necrotic crusted ulcer with an erythematous border in the inguinal fold and tender right inguinal lymphadenopathy. Weil-Felix serology demonstrates strong agglutination with the Proteus OX-K strain.",
      question: "Which of the following is the definitive diagnosis and first-line antimicrobial therapy for this patient?",
      options: [
        "Scrub Typhus (Orientia tsutsugamushi); Oral Doxycycline (100 mg twice daily for 7 days)",
        "Severe Falciparum Malaria; Intravenous Artesunate",
        "Typhoid Fever; Intravenous Ceftriaxone",
        "Dengue Hemorrhagic Fever; Platelet transfusion"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Scrub Typhus caused by Orientia tsutsugamushi (transmitted by larval chigger mites). The hallmark pathognomonic diagnostic sign is the painless, black necrotic crusted 'cigarette-burn' eschar located in warm, intertriginous skin folds (groin, axilla, waist) associated with regional lymphadenopathy, high fever, and positive Weil-Felix serology with the OX-K strain. The first-line drug of choice is Doxycycline (100 mg PO bid for 7 days), which yields dramatic defervescence within 24-48 hours."
    }
  ]
};
