/**
 * Clinical Ophthalmology Advanced: Acute Angle-Closure Glaucoma & Ocular Hypertension
 * Authoritative ocular microsurgery content derived from Kanski's (9th ed.), AAO BCSC Glaucoma.
 * Mapped to NMC CBME Competencies: OP1.1, OP1.2, MD46.1, SU44.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const ANGLE_CLOSURE_GLAUCOMA_IRIDOTOMY_MODULE: PhysiologyLessonModule = {
  id: "ophthalmology-adv-angle-closure-glaucoma",
  unitCode: "OP1.1",
  title: "Acute Angle-Closure Glaucoma (AACG): Pupillary Block, Medical Decompression & Laser Iridotomy",
  competencies: ["OP1.1", "OP1.2", "MD46.1", "SU44.1"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Acute Angle-Closure Glaucoma: Pupillary Block, Pressure Lowering & Laser Iridotomy

Acute Angle-Closure Glaucoma (AACG) is an ophthalmic emergency caused by sudden obstruction of the trabecular meshwork by the peripheral iris, resulting in an acute rise in intraocular pressure (IOP) to $40-70\\text{ mmHg}$.

---

## 1. Pathophysiology & Clinical Triad Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Hallmark} & \\textbf{Physiologic Mechanism} & \\textbf{Physical Examination Signs} & \\textbf{High-Yield Clinical Value} \\\\
\\hline
\\textbf{1. Severe Unilateral Pain} & \\text{Ischemic distension of ciliary nerves \u0026 globe} & \\text{Severe retro-orbital / periorbital pain,} & \\text{Can mimic migraine, cluster headache,} \\\\
& & \\text{ipsilateral frontal headache, nausea/vomiting} & \\text{or acute intracranial hemorrhage} \\\\
\\textbf{2. Steamy Corneal Edema} & \\text{IOP exceeds endothelial dehydration pump} & \\mathbf{\\text{\"Steamy\" / cloudy / ground-glass cornea}} & \\mathbf{\\text{Produces classic halo vision}} \\\\
& & \\text{with marked loss of corneal luster} & (\\text{rainbow halos around point lights}) \\\\
\\textbf{3. Mid-Dilated Pupil} & \\text{Iris sphincter muscle ischemia from high IOP} & \\mathbf{\\text{Fixed, mid-dilated (4-6 mm) oval pupil}} & \\mathbf{\\text{Non-reactive to light or accommodation;}} \\\\
& & \\text{with profound conjunctival ciliary injection} & \\text{differentiates from acute uveitis (miotic)} \\\\
\\textbf{4. Shallow Anterior Chamber} & \\text{Anterior displacement of iris-lens diaphragm} & \\text{Slit-lamp van Herick Grade 0-1;} & \\text{Gonioscopy demonstrates closed iridocorneal} \\\\
& & \\text{rock-hard globe on gentle digital palpation} & \\text{angle with appositional closure} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Medical Pressure Lowering Protocol & Laser Iridotomy

- **Step 1: Rapid Reduction of Aqueous Humor Secretion**:
  - **Topical Beta-Blocker**: Timolol $0.5\\%$ (1 drop).
  - **Topical Alpha-2 Agonist**: Apraclonidine $1\\%$ or Brimonidine $0.2\\%$ (1 drop).
  - **Systemic Carbonic Anhydrase Inhibitor**: **Intravenous Acetazolamide ($500\\text{ mg IV}$)** (followed by $250\\text{ mg}$ PO q6h; check for sulfonamide allergy).
- **Step 2: Hyperosmotic Vitreous Dehydration**:
  - **Intravenous Mannitol**: $1.0 - 2.0\\text{ g/kg IV of } 20\\%\\text{ solution over } 30 - 45\\text{ minutes}$ (draws water from vitreous into intravascular space).
- **Step 3: Miosis & Angle Opening**:
  - **Topical Parasympathomimetic**: **Pilocarpine $1 - 2\\%$** (1 drop every $15\\text{ min}$ for 2 doses; note that pilocarpine is ineffective when $\\text{IOP} > 40 - 50\\text{ mmHg}$ due to iris ischemia, so give once pressure decreases).
- **Step 4: Definitive Surgical Intervention**:
  - **Laser Peripheral Iridotomy (LPI)**: Nd:YAG laser creates a full-thickness coloboma in the superior peripheral iris, equalizing pressure between anterior and posterior chambers and permanently curing pupillary block. **Mandatory prophylactic LPI to contralateral fellow eye**.
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old hyperopic female presents to the emergency department with severe, excruciating right eye and right frontal periorbital pain that began 3 hours ago while sitting in a darkened movie theater. She is nauseated and has vomited twice. She reports blurred vision and seeing rainbow-colored halos around streetlights. On examination, the right eye demonstrates marked conjunctival ciliary injection, a 'steamy' cloudy cornea, and a shallow anterior chamber. The right pupil is 5 mm, vertically oval, mid-dilated, and non-reactive to direct light. Digital palpation reveals a rock-hard right globe. Tonometry reveals an Intraocular Pressure (IOP) of 58 mmHg in the right eye (normal 10-21 mmHg) and 16 mmHg in the left eye.",
      question: "What is the diagnosis, what is the initial emergency pharmacological regimen, and what is the definitive procedure for both eyes?",
      options: [
        "Acute Angle-Closure Glaucoma (AACG); administer topical Timolol 0.5% + Apraclonidine 1% + IV Acetazolamide 500 mg + IV Mannitol, followed by Pilocarpine 2%, and perform bilateral Laser Peripheral Iridotomy (LPI)",
        "Acute Anterior Uveitis; administer high-dose topical Prednisolone acetate and topical Atropine",
        "Central Retinal Artery Occlusion; perform immediate ocular massage and hyperbaric oxygen",
        "Optic Neuritis; administer high-dose intravenous Methylprednisolone without ocular drops"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient exhibits the classic presentation of Acute Angle-Closure Glaucoma (AACG) triggered by pupillary dilation in a dark theater in an anatomically predisposed hyperopic eye. Key diagnostic features: severe retro-orbital pain with nausea/vomiting, rainbow halos around lights (corneal epithelial edema), steamy cornea, fixed mid-dilated oval pupil (due to iris sphincter ischemia), and dramatically elevated IOP (58 mmHg). Emergency medical management requires rapid multi-agent pressure reduction: (1) Topical beta-blocker (Timolol), alpha-2 agonist (Apraclonidine), and systemic IV Acetazolamide to decrease aqueous humor synthesis; (2) IV hyperosmotic Mannitol to dehydrate the vitreous; (3) Topical Pilocarpine to induce miosis and pull the peripheral iris away from the trabecular meshwork once IOP drops <40 mmHg; (4) Definitive cure is Nd:YAG Laser Peripheral Iridotomy (LPI), which must be performed bilaterally because the fellow eye shares the same shallow anatomical predisposition."
    }
  ]
};
