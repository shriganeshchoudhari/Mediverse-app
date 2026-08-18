/**
 * Postgraduate Advanced Ophthalmology & Glaucoma: Acute Angle-Closure Glaucoma Crisis & LPI
 * Authoritative glaucoma clinical content derived from AAO Glaucoma PPP, European Glaucoma Society Guidelines.
 * Mapped to NMC PG CBME Competencies: PG8.3, OP3.1, OP3.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE: PhysiologyLessonModule = {
  id: "pg8-acute-angle-closure-glaucoma-laser-iridotomy",
  unitCode: "PG8.3",
  title: "Acute Angle-Closure Glaucoma (AACG): Pupillary Block, Hyperosmotic Therapy & Laser Iridotomy Protocols",
  competencies: ["PG8.3", "OP3.1", "OP3.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Acute Angle-Closure Glaucoma (AACG) & Laser Peripheral Iridotomy

Acute Angle-Closure Glaucoma is a sight-threatening ophthalmic emergency where relative pupillary block leads to iris bombe, sudden mechanical trabecular meshwork occlusion, and intraocular pressures exceeding $50-80\\text{ mmHg}$.

---

## 1. Pupillary Block Pathophysiology & Clinical Staging

$$\\begin{array}{lcccc}
\\hline
\\textbf{Predisposing Factors} & \\textbf{Triggering Event} & \\textbf{Biomechanical Mechanism} & \\textbf{Clinical Hallmarks} \\\\
\\hline
\\text{Shallow anterior chamber } (< 2.5\\text{ mm}), & \\mathbf{\\text{Mid-dilated pupil (4-5 mm)}} & \\mathbf{\\text{Maximal iris-lens apposition}} & \\mathbf{\\text{IOP 50-80 mmHg, steamy cornea,}} \\\\
\\text{hyperopia, thick cataractous lens} & (\\text{darkness, stress, mydriatics}) & \\mathbf{\\rightarrow \\text{Iris Bombe } \\rightarrow \\text{ closed angle}} & \\mathbf{\\text{mid-dilated fixed pupil, ciliary flush}} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Decompression Pharmacotherapy & Definitive Laser Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Therapeutic Intervention} & \\textbf{Regimen \\& Dosage} & \\textbf{Pharmacological Mechanism \\& Safety Rules} \\\\
\\hline
\\textbf{IV Hyperosmotic Agent} & \\mathbf{20\\% \\text{ Mannitol } 1.0-1.5\\text{ g/kg IV over 30m}} & \\text{Hyperosmotically dehydrates vitreous to deepen AC} \\\\
\\textbf{Systemic CAI} & \\mathbf{\\text{Acetazolamide } 500\\text{ mg IV / PO}} & \\text{Suppresses ciliary body aqueous production by } > 50\\% \\\\
\\textbf{Topical Triple Drop Bundle} & \\text{Timolol 0.5\\% + Brimonidine 0.2\\% + Dorzolamide} & \\text{Reduces aqueous inflow and increases outflow} \\\\
\\textbf{Parasympathomimetic} & \\mathbf{\\text{Pilocarpine 1-2\\% topical}} & \\mathbf{\\text{Induces miosis; give ONLY once IOP } < 40-50\\text{ mmHg}} \\\\
& & (\\text{iris sphincter is ischemic and unresponsive at high IOP}) \\\\
\\textbf{Definitive Laser Surgery} & \\mathbf{\\text{Nd:YAG Laser Peripheral Iridotomy (LPI)}} & \\mathbf{\\text{Creates bypass hole; PROPHYLACTIC LPI TO FELLOW EYE}} \\\\
& (\\text{superior iris at 11 or 1 o'clock}) & (50\\% \\text{ risk of contralateral attack within 5 years}) \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old hyperopic female presents to the emergency department with excruciating right eye pain, severe frontal headache, nausea, and vomiting that began while watching a movie in a darkened theater. She describes seeing rainbow halos around lights. On examination, visual acuity is counting fingers OD and 20/20 OS. Slit-lamp examination OD reveals a diffusely hazy 'steamy' cornea, a mid-dilated (5 mm) vertically oval pupil that is fixed and non-reactive to light, marked ciliary injection, and a shallow anterior chamber. Intraocular pressure (IOP) measured by Goldmann applanation tonometry is 68 mmHg OD and 16 mmHg OS. Gonioscopy OD demonstrates 360-degree iridocorneal contact (Shaffer Grade 0).",
      question: "What is the diagnosis, what is the emergency medical management sequence, and what is the definitive surgical procedure for BOTH eyes?",
      options: [
        "Acute Primary Angle-Closure Glaucoma crisis secondary to pupillary block; initiate immediate medical decompression with IV 20% Mannitol (1.5 g/kg), IV Acetazolamide (500 mg), and topical aqueous suppressants (Timolol, Brimonidine, Dorzolamide), followed by topical Pilocarpine 1-2% once IOP falls below 40-50 mmHg to break the pupillary block; perform bilateral Nd:YAG Laser Peripheral Iridotomy (LPI) to the affected eye and mandatory prophylactic LPI to the contralateral fellow eye",
        "Acute anterior uveitis; start topical Atropine 1% and high-dose Prednisolone eye drops immediately",
        "Neovascular glaucoma; perform immediate panretinal photocoagulation only",
        "Migraine with visual aura; administer oral sumatriptan and discharge home"
      ],
      correctAnswerIndex: 0,
      explanation: "This case illustrates an acute angle-closure glaucoma crisis: (1) Pupillary Block Mechanism: In anatomically predisposed hyperopes with shallow AC, mid-dilation traps aqueous in the posterior chamber, bowing the iris forward (iris bombe) to occlude the trabecular meshwork; (2) Medical Decompression: IV Mannitol, Acetazolamide, and topical drops lower IOP; Pilocarpine is added once IOP is <40-50 mmHg (iris sphincter is ischemic at higher pressures); (3) Bilateral LPI: Nd:YAG laser peripheral iridotomy creates a permanent bypass between chambers, and prophylactic LPI to the fellow eye is mandatory due to a 50% risk of bilateral attack."
    }
  ]
};
