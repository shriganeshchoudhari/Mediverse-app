/**
 * Cataract Pathophysiology, Morphological Types & Phacoemulsification Learning Content
 * Authoritative medical content derived from Kanski, Parson, Khurana, and USMLE Step 2 CK Ophthalmology.
 * Mapped to NMC CBME Competencies: OP3.1, OP3.2, OP3.3, OP4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const CATARACT_PHACO_LENS_MODULE: PhysiologyLessonModule = {
  id: "ophth-cataract-phaco",
  unitCode: "OP3.1",
  title: "Ophthalmology: Cataracts (Nuclear, Cortical, Subcapsular), Phacoemulsification & Endophthalmitis",
  competencies: ["OP3.1", "OP3.2", "OP3.3", "OP4.1"],
  estimatedMinutes: 140,
  organ3dTarget: "OPTIC",
  markdownContent: `
# Ophthalmology: Cataracts (Nuclear, Cortical, Subcapsular), Phacoemulsification & Endophthalmitis

Cataract—the opacification of the crystalline lens—is the leading cause of reversible blindness worldwide, managed definitively with micro-incision ultrasonic **Phacoemulsification**.

---

## 1. Morphological Subtypes of Age-Related (Senile) Cataracts

| Cataract Morphology | Anatomical Location & Slit-Lamp Appearance | Visual Symptoms & Pathognomonic Features |
| :--- | :--- | :--- |
| **Nuclear Sclerotic** | Yellowish-to-brownish opacification of the central lens **Nucleus** (urochrome pigment accumulation). | **"Second Sight" (Myopic Shift)**: Nuclear hardening increases refractive index, allowing elderly presbyopic patients to temporarily read without reading glasses! Poor distance vision. |
| **Cortical** | Radial, wedge-shaped **"Spoke-Wheel" / Cuneiform Opacities** extending from the periphery toward the center. | Glare when driving at night (light scattering from cortical spokes); monocular diplopia. |
| **Posterior Subcapsular (PSC)** | Granular, plaque-like opacities situated directly anterior to the **Posterior Capsule** along the visual axis. | **Severe, disabling Daytime and Nighttime Glare**; difficulty reading in bright sunlight (miosis constricts visual axis over central opacity). Strong association with **Systemic Corticosteroids** and Diabetes. |

---

## 2. Systemic & Congenital Cataracts (High-Yield USMLE / NMC)

- **Diabetes Mellitus**: Classic **"Snowflake" Cortical Cataracts** caused by sorbitol accumulation via the **Aldose Reductase** pathway causing hyperosmotic lens fiber swelling.
- **Galactosemia (Galactose-1-Phosphate Uridyltransferase / GALT Deficiency)**: **"Oil-Drop" Cataract** in infants due to galactitol accumulation; resolves with dietary galactose elimination.
- **Myotonic Dystrophy (DM1)**: **"Christmas-Tree" Cataract** (iridescent polychromatic cholesterol crystal deposits in deep cortex).
- **Wilson Disease**: **"Sunflower Cataract"** (copper deposition under anterior capsule) alongside corneal **Kayser-Fleischer (KF) Rings**.
- **Congenital Rubella Syndrome**: Dense pearly-white nuclear cataracts, microphthalmia, sensorineural deafness, and patent ductus arteriosus (**PDA**).

---

## 3. Surgical Technique: Phacoemulsification with Foldable IOL

1. **Clear Corneal Incision ($2.2\\text{–}2.8\\text{ mm}$)**: Self-sealing, sutureless multi-planar incision.
2. **Ophthalmic Viscosurgical Device (OVD)** injection to protect the delicate corneal endothelium.
3. **Continuous Curvilinear Capsulorhexis (CCC)**: Precise $5.0-5.5\\text{ mm}$ circular opening created in the anterior lens capsule.
4. **Hydrodissection**: BSS fluid wave separates the lens cortex from the capsule.
5. **Ultrasonic Phacoemulsification**: High-frequency piezoelectric handpiece sculpts, divides (**"Stop-and-Chop"** or **"Divide-and-Conquer"**), and emulsifies the hard nucleus.
6. **Cortical Clean-Up (Bimanual I/A)**: Vacuum aspiration of remaining soft cortical fibers.
7. **In-the-Bag Implantation**: Implantation of a foldable hydrophobic acrylic **Posterior Chamber Intraocular Lens (PCIOL)** into the intact capsular bag.

---

## 4. Postoperative Endophthalmitis: Acute Ophthalmic Emergency

- **Incidence & Timing**: Occurs in $<0.1\\%$ of cases; presents within **$1\\text{ to } 7\\text{ days}$** postoperatively.
- **Microbiology**: ***Staphylococcus epidermidis*** ($70\\%$, normal ocular flora) and ***Staphylococcus aureus***.
- **Clinical Signs**: Severe, progressive eye pain, marked visual acuity loss, marked eyelid edema, conjunctival injection, **Hypopyon (layer of white pus in anterior chamber)**, and intense **Vitritis** (loss of red reflex).
- **Emergency Management**:
  - Immediate diagnostic **Vitreous Tap & Biopsy** for Gram stain and culture.
  - **Intravitreal Antibiotic Injections**: **Vancomycin ($1.0\\text{ mg} / 0.1\\text{ mL}$)** for Gram-positive coverage $+$ **Ceftazidime ($2.25\\text{ mg} / 0.1\\text{ mL}$)** for Gram-negative coverage.
  - **Emergency Pars Plana Vitrectomy (PPV)**: Indicated if initial visual acuity is reduced to **Light Perception (LP) only** (Endophthalmitis Vitrectomy Study [EVS] guideline).
`,
  clinicalVignettes: [
    {
      scenario: "A 71-year-old male with severe rheumatoid arthritis on chronic daily oral prednisone therapy for 8 years presents complaining of rapidly worsening difficulty reading and severe glare while driving at night. Slit-lamp biomicroscopy reveals a discrete granular, iridescent plaque-like opacity situated immediately anterior to the posterior lens capsule directly in the visual axis.",
      question: "Which type of cataract is present, and which modern surgical technique is the standard of care for definitive visual rehabilitation?",
      options: [
        "Posterior Subcapsular Cataract; Phacoemulsification with Posterior Chamber Intraocular Lens (PCIOL)",
        "Nuclear Sclerotic Cataract; Intracapsular Cataract Extraction (ICCE)",
        "Cortical Spoke Cataract; Anterior Chamber Lens Implantation without capsular support",
        "Congenital Oil-Drop Cataract; Laser Peripheral Iridotomy"
      ],
      correctAnswerIndex: 0,
      explanation: "A granular plaque-like opacity in the posterior cortex directly anterior to the posterior capsule along the visual axis in a patient on long-term corticosteroid therapy is a classic Posterior Subcapsular Cataract (PSC). PSCs cause severe glare and daytime/nighttime visual impairment due to visual axis obstruction. Modern micro-incision ultrasonic phacoemulsification with continuous curvilinear capsulorhexis (CCC) and implantation of a foldable posterior chamber intraocular lens (PCIOL) within the capsular bag is the gold-standard surgical cure."
    }
  ]
};
