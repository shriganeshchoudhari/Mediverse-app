/**
 * Clinical Ophthalmology Advanced: Uveitis, Ocular Immunology & Retinitis
 * Authoritative ocular immunology content derived from Kanski's (9th ed.), AAO Intraocular Inflammation.
 * Mapped to NMC CBME Competencies: OP5.1, OP5.2, MD46.3, SU44.3
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const UVEITIS_OCULAR_IMMUNOLOGY_RETINITIS_MODULE: PhysiologyLessonModule = {
  id: "ophthalmology-adv-uveitis-retinitis",
  unitCode: "OP5.1",
  title: "Uveitis & Ocular Immunology: HLA-B27 Anterior Hypopyon, Toxoplasmosis & CMV Retinitis",
  competencies: ["OP5.1", "OP5.2", "MD46.3", "SU44.3"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Uveitis & Ocular Immunology: Anterior, Intermediate, Posterior & Retinitis

Intraocular inflammatory conditions involve autoimmune and infectious destruction of the uveal tract (iris, ciliary body, choroid) and adjacent neurosensory retina.

---

## 1. Classification & Immunological Hallmarks Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Uveitic Entity} & \\textbf{Anatomical Location} & \\textbf{Systemic / Infectious Etiology} & \\textbf{Slit-Lamp \u0026 Fundus Hallmarks} & \\textbf{First-Line Medical Therapy} \\\\
\\hline
\\textbf{Acute Anterior} & \\mathbf{\\text{Iris \u0026 Ciliary Body}} & \\mathbf{\\text{HLA-B27 Seronegative}} & \\mathbf{\\text{Ciliary flush, Keratic Precipitates (KPs),}} & \\mathbf{\\text{Topical Prednisolone Acetate 1\\%}} \\\\
\\textbf{Uveitis (Iritis)} & (\\text{Anterior chamber}) & \\text{Spondylitis, Ankylosing, IBD} & \\mathbf{\\text{cells/flare, HYPOPYON (layered WBCs)}} & + \\mathbf{\\text{Cyclopentolate / Atropine}} \\\\
\\textbf{Intermediate} & \\mathbf{\\text{Vitreous \u0026 Pars Plana}} & \\text{Multiple Sclerosis, Sarcoidosis,} & \\mathbf{\\text{\"Snowballs\" (vitreous clumping)}} & \\text{Periocular / intravitreal triamcinolone} \\\\
\\textbf{Uveitis} & (\\text{Pars planitis}) & \\text{idiopathic autoimmune} & \\mathbf{\\text{and \"snowbanking\" over inferior pars plana}} & \\text{corticosteroid injections} \\\\
\\textbf{Toxoplasmosis} & \\mathbf{\\text{Retina \u0026 Choroid}} & \\mathbf{\\text{Toxoplasma gondii (obligate}} & \\mathbf{\\text{\"HEADLIGHT IN THE FOG\" focal}} & \\mathbf{\\text{Pyrimethamine } + \\text{Sulfadiazine}} \\\\
\\textbf{Chorioretinitis} & (\\text{Posterior segment}) & \\text{intracellular protozoan parasite)} & \\mathbf{\\text{yellow-white lesion adjacent to old scar}} & + \\text{ Leucovorin } + \\text{ systemic steroids} \\\\
\\textbf{Cytomegalovirus} & \\mathbf{\\text{Full-thickness Retina}} & \\mathbf{\\text{CMV in Advanced HIV/AIDS}} & \\mathbf{\\text{\"PIZZA-PIE\" / \"Cottage cheese \u0026 ketchup\"}} & \\mathbf{\\text{Intravenous / Oral Valganciclovir}} \\\\
\\textbf{(CMV) Retinitis} & (\\text{Opportunistic}) & (\\mathbf{\\text{CD4} < 50/\\mu\\text{L}}) & \\mathbf{\\text{dense perivascular hemorrhages \u0026 necrosis}} & \\text{or intravitreal Ganciclovir} \\\\
\\hline
\\end{array}$$

---

## 2. Immunological Mechanisms & Ophthalmic Rules

- **HLA-B27 Acute Anterior Uveitis**:
  - Breakdown of the **blood-aqueous barrier** causes leukocyte extravasation into the anterior chamber (graded as cells and flare on slit-lamp biomicroscopy).
  - Gravity causes neutrophils to sediment inferiorly, forming a **Hypopyon**.
  - **Cycloplegic Mydriatics (Cyclopentolate, Atropine)**:
    1. Paralyze the ciliary muscle to alleviate painful ciliary spasm.
    2. Dilate the pupil to prevent and break **posterior synechiae** (adhesions between iris and anterior lens capsule).
- **Ocular Toxoplasmosis**:
  - Most common cause of infectious posterior uveitis. Congenital or acquired ingestion of oocysts from undercooked meat or cat feces.
  - Classical presentation: An active fluffy yellow-white necrotizing retinochoroiditis lesion with intense overlying vitritis, described as a **"headlight in the fog"**, typically located at the border of a hyperpigmented, atrophic chorioretinal scar.
- **CMV Retinitis in Immunocompromised Patients**:
  - Occurs almost exclusively when $\mathbf{\\text{CD4} < 50\\text{ cells}/\\mu\\text{L}}$.
  - Fundus demonstrates necrotizing granular white retinal opacification along retinal vascular arcades with prominent brushfire hemorrhages (**"pizza-pie"** appearance).
`,
  clinicalVignettes: [
    {
      scenario: "A 29-year-old male with a 4-year history of chronic lower back pain and morning spinal stiffness (HLA-B27 positive) presents with acute, painful redness and extreme light sensitivity (photophobia) in his left eye for 2 days. On examination, visual acuity in the left eye is 20/40. Slit-lamp examination reveals intense 360-degree ciliary injection (ciliary flush), multiple fine keratic precipitates (KPs) on the corneal endothelium, 4+ inflammatory cells and flare in the anterior chamber, a 1.5 mm sterile hypopyon layered in the inferior anterior chamber angle, and an irregular, sluggishly reactive pupil due to early posterior synechiae.",
      question: "What is the diagnosis, what is the systemic association, and what is the standard topical therapeutic regimen?",
      options: [
        "Acute Anterior Uveitis (Iridocyclitis) associated with Ankylosing Spondylitis (HLA-B27 spondyloarthropathy); administer intensive topical Corticosteroids (Prednisolone acetate 1%) plus a Cycloplegic/Mydriatic agent (Cyclopentolate/Atropine)",
        "Bacterial Keratitis; administer topical Moxifloxacin drops and avoid steroids",
        "Acute Angle-Closure Glaucoma; administer topical Pilocarpine and IV Mannitol",
        "Cytomegalovirus Retinitis; administer intravenous Ganciclovir"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic clinical presentation of HLA-B27-Associated Acute Anterior Uveitis (Iridocyclitis). Key hallmarks include: (1) Systemic link: Strong association with Ankylosing Spondylitis and other HLA-B27 spondyloarthropathies; (2) Slit-Lamp Findings: Ciliary flush, keratic precipitates (inflammatory cell clusters on corneal endothelium), anterior chamber cells/flare, and a layered sterile leukocyte collection (hypopyon); (3) Dual Pharmacological Treatment: (a) High-potency topical corticosteroids (Prednisolone acetate 1% hourly) to suppress intraocular inflammation; and (b) Topical cycloplegic/mydriatic drops (Cyclopentolate or Atropine) to relieve excruciating ciliary muscle spasm and dilate the pupil, preventing fixed posterior synechiae to the lens capsule."
    }
  ]
};
