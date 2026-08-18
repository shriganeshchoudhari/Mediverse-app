/**
 * Slit-Lamp Biomicroscopy, Corneal Ulcers & Optics/Refraction Learning Content
 * Authoritative medical content derived from Kanski, Parson, Khurana, and USMLE Step 2 CK Ophthalmology.
 * Mapped to NMC CBME Competencies: OP5.1, OP5.2, OP5.3, OP6.1, OP6.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const SLIT_LAMP_CORNEA_REFRACTION_MODULE: PhysiologyLessonModule = {
  id: "ophth-slit-lamp-cornea",
  unitCode: "OP5.1",
  title: "Ophthalmology: Slit-Lamp Biomicroscopy, Corneal Ulcers (HSV, Bacterial, Fungal) & Optics",
  competencies: ["OP5.1", "OP5.2", "OP5.3", "OP6.1", "OP6.2"],
  estimatedMinutes: 140,
  organ3dTarget: "OPTIC",
  markdownContent: `
# Ophthalmology: Slit-Lamp Biomicroscopy, Corneal Ulcers (HSV, Bacterial, Fungal) & Optics

Slit-lamp examination provides multi-planar stereoscopic optical sectioning of the anterior segment, essential for the diagnosis of microbial keratitis and corneal dystrophies.

---

## 1. Slit-Lamp Illumination Techniques

| Illumination Mode | Optical Principle | Clinical Utility |
| :--- | :--- | :--- |
| **Direct Focal Slit (Optical Section)** | Thin, focused $0.1-0.2\\text{ mm}$ slit beam cuts through optical media like an in-vivo histological slice. | Precise localization of depth within the 5 corneal layers (Epithelium, Bowman, Stroma, Descemet, Endothelium), anterior chamber depth, and lens nucleus. |
| **Sclerotic Scatter** | Broad beam focused on the limbus uses **total internal reflection** within the cornea. | Detects subtle central corneal stromal edema, faint nebular corneal scars, or foreign bodies. |
| **Specular Reflection** | Aligns the angle of incidence with the angle of reflection from the posterior corneal surface. | High-magnification visualization of the **Corneal Endothelial Mosaic** (hexagonal cell density and guttata in Fuchs endothelial dystrophy). |
| **Retroillumination** | Light reflects off the iris or red fundus reflex to illuminate the cornea/lens from behind. | Detects iris transillumination defects, subtle lens vacuoles, and corneal epithelial microcysts. |

---

## 2. Microbial Keratitis & Corneal Ulcer Diagnostic Matrix

| Infectious Entity | Predisposing Etiology | Slit-Lamp Hallmark & Staining | Definitive Medical Management |
| :--- | :--- | :--- | :--- |
| **Herpes Simplex Virus (HSV) Keratitis** | Latent HSV-1 reactivated in the trigeminal ganglion. | **Dendritic Ulcer with true Terminal End-Bulbs**; stains bright green with **Fluorescein** (epithelial defect) and rose bengal (devitalized border cells). Reduced corneal sensation. | **Topical Ganciclovir 0.15% gel** or oral **Acyclovir ($400\\text{ mg } 5\\times/\\text{day}$)**.<br>*(CRITICAL WARNING: Topical Corticosteroids are STRICTLY CONTRAINDICATED $\\rightarrow$ triggers amoeboid "Geographic Ulcer" and corneal perforation!)* |
| **Bacterial Keratitis** | Extended-wear soft contact lenses, trauma. Pathogens: ***Pseudomonas aeruginosa*** (rapid stromal melting), ***S. aureus***. | Dense white/yellow suppurative stromal infiltrate with overlying epithelial defect, stromal edema, and sterile **Hypopyon**. | Intensive fortified topical antibiotics: **Fluoroquinolones (Moxifloxacin 0.5%)** or **Vancomycin $+$ Tobramycin** hourly. |
| **Fungal Keratitis** | Vegetative / agricultural trauma (tree branches, soil). Pathogens: ***Fusarium***, ***Aspergillus***, *Candida*. | Greyish-white stromal infiltrate with **Feathery / Serrated Margins**, dry texture, and multiple **Satellite Infiltrates** surrounding the main ulcer. | Topical **Natamycin 5% suspension** (first-line for filamentous fungi) or **Amphotericin B 0.15%** for yeasts. |
| **Acanthamoeba Keratitis** | Contact lens wearers washing lenses in **Tap Water / Swimming pools**. | **Severe, excruciating ocular pain out of proportion to exam**; perineural infiltrates (radial keratoneuritis) $\\rightarrow$ late **Ring-Shaped Stromal Infiltrate**. | Topical **Polyhexamethylene Biguanide (PHMB 0.02%)** or **Chlorhexidine (0.02%)** $+$ Brolene. |

---

## 3. Principles of Optics, Refraction & Corrective Lenses

1. **Myopia (Nearsightedness)**:
   - Light rays focus **IN FRONT OF THE RETINA** (due to excessive axial length or steep corneal curvature).
   - Corrected with **Concave (Diverging / Negative Diopter) Lenses** (e.g. $-3.00\\text{ D}$).
2. **Hyperopia (Farsightedness)**:
   - Light rays focus **BEHIND THE RETINA** (due to short axial length or flat cornea).
   - Corrected with **Convex (Converging / Positive Diopter) Lenses** (e.g. $+2.50\\text{ D}$). Predisposes to acute angle-closure glaucoma!
3. **Astigmatism**:
   - Asymmetry in corneal/lens curvature creating two different focal lines (Conoid of Sturm).
   - Corrected with **Cylindrical / Toric Lenses**.
4. **Presbyopia**:
   - Age-related ($>40\\text{ years}$) physiological loss of crystalline lens elasticity and ciliary muscle accommodative amplitude.
   - Corrected with **Convex Reading Plus Lenses** (e.g. $+1.00\\text{ to } +3.00\\text{ D}$).
`,
  clinicalVignettes: [
    {
      scenario: "A 34-year-old male presents with red, irritated, painful right eye and mild foreign body sensation for 3 days. Slit-lamp examination with cobalt blue illumination after sodium fluorescein instillation reveals a branching, arborizing dendritic epithelial ulcer with distinct terminal bulbs along the branches. Corneal esthesiometry demonstrates markedly reduced corneal sensation in the right eye compared to the left.",
      question: "Which of the following pharmacotherapeutic agents is absolute CONTRAINDICATED in the management of this patient?",
      options: [
        "Topical Prednisolone Acetate 1% drops",
        "Topical Ganciclovir 0.15% ophthalmic gel",
        "Oral Acyclovir 400 mg tablets",
        "Preservative-free artificial tear lubricants"
      ],
      correctAnswerIndex: 0,
      explanation: "A branching dendritic corneal ulcer with terminal bulbs that stains with fluorescein and is accompanied by reduced corneal sensation is pathognomonic for Herpes Simplex Virus (HSV) Epithelial Keratitis. In active HSV epithelial keratitis, topical corticosteroids (such as prednisolone) are strictly contraindicated because they inhibit local antiviral immunity, promote unchecked viral replication, and rapidly transform the fine dendritic ulcer into a massive, destructive 'Geographic / Amoeboid Ulcer' with severe risk of corneal perforation."
    }
  ]
};
