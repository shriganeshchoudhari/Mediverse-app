/**
 * Clinical Ophthalmology Advanced: Corneal Ulcers, Keratitis & Refractive Surgery
 * Authoritative cornea content derived from Kanski's (9th ed.), AAO Cornea and External Disease.
 * Mapped to NMC CBME Competencies: OP7.1, OP7.2, MD46.4, SU44.4
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CORNEAL_ULCERS_REFRACTIVE_SURGERY_MODULE: PhysiologyLessonModule = {
  id: "ophthalmology-adv-corneal-ulcers",
  unitCode: "OP7.1",
  title: "Corneal Ulcers & Keratitis: Bacterial (Pseudomonas), HSV Dendritic, Fungal & Acanthamoeba",
  competencies: ["OP7.1", "OP7.2", "MD46.4", "SU44.4"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Corneal Ulcers, Microbial Keratitis & Refractive Microsurgery

Microbial keratitis is a sight-threatening emergency requiring rapid microbiological identification and pathogen-specific antimicrobial therapy to prevent corneal perforation.

---

## 1. Microbial Keratitis Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Keratitis Type} & \\textbf{Primary Risk Factor / Vector} & \\textbf{Classic Slit-Lamp Morphology} & \\textbf{Diagnostic Stains} & \\textbf{Standard Therapeutic Regimen} \\\\
\\hline
\\textbf{Bacterial} & \\mathbf{\\text{Overnight Contact Lens Wear}} & \\mathbf{\\text{Dense white stromal infiltrate,}} & \\text{Gram stain \u0026 culture} & \\mathbf{\\text{Fortified Vancomycin } +} \\\\
(\\text{Pseudomonas}) & (\\text{mucopurulent discharge}) & \\mathbf{\\text{epithelial defect, hypopyon}} & (\\text{blood, chocolate, Sabouraud}) & \\mathbf{\\text{Tobramycin / Fluoroquinolone}} \\\\
\\textbf{Herpes Simplex} & \\text{Reactivation from trigeminal} & \\mathbf{\\text{DENDRITIC ULCER with terminal}} & \\mathbf{\\text{Fluorescein (stains bed),}} & \\mathbf{\\text{Topical Ganciclovir 0.15\\%}} \\\\
\\textbf{(HSV) Epithelial} & \\text{ganglion (HSV-1)} & \\mathbf{\\text{bulbs; reduced corneal sensation}} & \\mathbf{\\text{Rose Bengal (stains borders)}} & + \\text{ PO Acyclovir (}\\mathbf{\\text{NO STEROIDS!}}\\text{)} \\\\
\\textbf{Fungal} & \\mathbf{\\text{Vegetative agricultural trauma}} & \\mathbf{\\text{Gray-white infiltrate with FEATHERY}} & \\text{KOH prep, Calcofluor white,} & \\mathbf{\\text{Topical Natamycin 5\\% drops}} \\\\
(\\text{Fusarium/Aspergillus}) & (\\text{tree branch, plant scratch}) & \\mathbf{\\text{branching borders \u0026 satellite lesions}} & \\text{Grocott methenamine silver} & + \\text{ topical/oral Voriconazole} \\\\
\\textbf{Acanthamoeba} & \\mathbf{\\text{Swimming / hot tub in contact lenses,}} & \\mathbf{\\text{SEVERE PAIN OUT OF PROPORTION,}} & \\text{Confocal microscopy,} & \\mathbf{\\text{Topical Chlorhexidine 0.02\\%}} \\\\
(\\text{Free-living amoeba}) & \\text{cleaning lenses with tap water} & \\mathbf{\\text{radial perineural infiltrates, ring ulcer}} & \\text{non-nutrient agar with } E. coli & + \\mathbf{\\text{Polyhexamethylene biguanide (PHMB)}} \\\\
\\hline
\\end{array}$$

---

## 2. Pathogen Mechanics & Critical Ophthalmic Contraindications

- **HSV Epithelial Keratitis & The Steroid Contraindication**:
  - Live viral replication within the corneal epithelium creates a true **branching dendritic ulcer with terminal end-bulbs**.
  - **CRITICAL CONTRAINDICATION**: **Topical Corticosteroids are STRICTLY CONTRAINDICATED in active epithelial HSV keratitis**. Steroids suppress local cell-mediated immunity, causing rapid viral proliferation that transforms a small dendrite into a massive **geographic (amoebic) ulcer**, stromal necrosis, and corneal perforation.
- **Acanthamoeba Keratitis**:
  - Exists as trophozoites and highly resilient double-walled cysts.
  - Trophozoites track along corneal nerves, causing intense **radial keratoneuritis** (explaining excruciating ocular pain out of all proportion to early exam findings).
- **Refractive Microsurgery Paradigms**:
  - **LASIK (Laser-Assisted in Situ Keratomileusis)**: Creates a hinged corneal stromal flap ($100 - 120\\,\\mu\\text{m}$) using a femtosecond laser, ablates underlying stroma with an excimer laser, and repositions flap. Rapid visual recovery, minimal pain, but risk of flap dislodgement or ectasia.
  - **PRK (Photorefractive Keratectomy)**: Direct surface ablation of the stroma after epithelial debridement; ideal for thin corneas or high-impact athletic occupations (military/martial arts).
`,
  clinicalVignettes: [
    {
      scenario: "A 22-year-old college student who wears soft contact lenses on an extended-wear basis (frequently sleeping in her lenses) presents with 24 hours of severe right eye pain, redness, and foreign body sensation. On examination, visual acuity in the right eye is 20/100. Slit-lamp biomicroscopy reveals intense conjunctival injection, a 3.5 mm central round dense yellowish-white stromal infiltrate with an overlying epithelial defect that fluoresces brightly under cobalt blue light, and a 1 mm sterile hypopyon in the anterior chamber.",
      question: "What is the most likely pathogen, what is the diagnosis, and what is the mandatory immediate treatment regimen?",
      options: [
        "Pseudomonas aeruginosa Bacterial Keratitis; initiate intensive hourly topical fortified broad-spectrum antibiotics (such as Vancomycin 25 mg/mL + Tobramycin 14 mg/mL or high-concentration Fluoroquinolone drops)",
        "Herpes Simplex Virus Keratitis; initiate topical Dexamethasone steroid drops",
        "Allergic Conjunctivitis; prescribe topical Olopatadine antihistamine drops",
        "Dry Eye Syndrome; prescribe preservative-free artificial tears and continue wearing contact lenses"
      ],
      correctAnswerIndex: 0,
      explanation: "This contact lens wearer presenting with an acute, rapidly progressive, central suppurative corneal ulcer with an epithelial defect, dense stromal infiltrate, and hypopyon has Bacterial Keratitis, with Pseudomonas aeruginosa being the most common and aggressive causative organism in soft contact lens wearers. Pseudomonas produces virulent elastases and proteases that can cause stromal melting and corneal perforation within 24-48 hours if untreated. Immediate treatment mandates intensive hourly topical broad-spectrum bactericidal therapy (fortified Vancomycin + Aminoglycoside/Tobramycin, or intensive high-potency Fluoroquinolone such as Moxifloxacin/Ciprofloxacin) and strict cessation of contact lens wear."
    }
  ]
};
