/**
 * Internship Core Clinical Postings: Ophthalmic Emergencies: Acute Angle-Closure Glaucoma & CRAO
 * Authoritative ophthalmology content derived from Kanski's Clinical Ophthalmology, American Academy of Ophthalmology.
 * Mapped to NMC CBME Competencies: IN7.3, OP3.1, OP4.1
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const OPHTHALMIC_EMERGENCIES_GLAUCOMA_CRAO_MODULE: PhysiologyLessonModule = {
  id: "int7-ophthalmic-emergencies-glaucoma-crao",
  unitCode: "IN7.3",
  title: "Ophthalmic Emergencies: Acute Angle-Closure Glaucoma (IOP Cocktail & Laser Iridotomy) & Central Retinal Artery Occlusion",
  competencies: ["IN7.3", "OP3.1", "OP4.1"],
  estimatedMinutes: 150,
  organ3dTarget: "SENSORY",
  markdownContent: `
# Ophthalmic Emergencies: Acute Angle-Closure Glaucoma & CRAO

Urgent medical intraocular pressure reduction, parasympathomimetic pupillary constrictions, and retinal ischemic window preservation protect permanent visual acuity.

---

## 1. Acute Angle-Closure Glaucoma (AACG) Diagnostic Triad & Signs

$$\\begin{array}{lcccc}
\\hline
\\textbf{Diagnostic Feature} & \\textbf{Clinical Presentation / Signs} & \\textbf{Normal vs Elevated IOP} \\\\
\\hline
\\textbf{Patient Symptoms} & \\text{Severe unilateral ocular pain, frontal headache, nausea, colored haloes} & \\mathbf{\\text{Intraocular Pressure (IOP):}} \\\\
& \\text{around lights, sudden blurred/decreased visual acuity} & \\mathbf{40-70\\text{ mmHg (Normal } 10-21\\text{)}} \\\\
\\textbf{Anterior Chamber} & \\text{Extremely shallow anterior chamber; peripheral iris in contact with cornea} & \\text{Slit-lamp gonioscopy reveals closed angle} \\\\
\\textbf{Cornea \u0026 Pupil} & \\mathbf{\\text{Steamy / cloudy corneal edema, ciliary injection;}} & \\text{\"Stony hard\" eyeball on gentle} \\\\
& \\mathbf{\\text{mid-dilated, vertically oval, non-reactive pupil}} & \\text{tactile palpation} \\\\
\\hline
\\end{array}$$

---

## 2. Emergency Medical IOP-Lowering Cocktail Protocol

$$\\begin{array}{lcccc}
\\hline
\\textbf{Pharmacological Agent} & \\textbf{Dosing \u0026 Route} & \\textbf{Mechanism of Action} & \\textbf{Administration Timing Rule} \\\\
\\hline
\\textbf{1. IV Acetazolamide} & \\mathbf{500\\text{ mg IV bolus}} & \\text{Carbonic anhydrase inhibition;} & \\text{Give immediately on arrival} \\\\
& & \\text{decreases aqueous humor secretion} & \\\\
\\textbf{2. Topical Beta-Blocker} & \\mathbf{\\text{Timolol } 0.5\\% \\text{ 1 drop}} & \\text{Beta-adrenergic blockade;} & \\text{Give immediately (check asthma/heart block)} \\\\
& & \\text{reduces aqueous humor production} & \\\\
\\textbf{3. Topical Alpha-2 Agonist} & \\mathbf{\\text{Apraclonidine } 1\\% \\text{ 1 drop}} & \\text{Reduces aqueous synthesis and} & \\text{Synergistic IOP reduction} \\\\
& (\\text{or Brimonidine } 0.2\\%\\text{)} & \\text{increases uveoscleral outflow} & \\\\
\\textbf{4. IV Hyperosmotic} & \\mathbf{\\text{IV Mannitol } 20\\% \\text{ (} 1-2\\text{ g/kg)}} & \\text{Osmotic fluid shift from vitreous} & \\text{Infuse over 30-45 minutes} \\\\
& & \\text{into intravascular space; rapid IOP drop} & \\\\
\\textbf{5. Topical Pilocarpine} & \\mathbf{\\text{Pilocarpine } 2\\% \\text{ 1 drop q15min}} & \\text{Parasympathomimetic miosis pulls} & \\mathbf{\\text{ADMINISTER ONLY WHEN IOP } < 40\\text{ mmHg}} \\\\
& & \\text{peripheral iris away from trabecular mesh} & \\mathbf{\\text{(ischemic sphincter unresponsive at } > 40\\text{)}} \\\\
\\hline
\\textbf{Definitive Treatment} & \\mathbf{\\text{Laser Peripheral Iridotomy (LPI) in BOTH affected and fellow eye}} & \\text{Creates full-thickness iris bypass hole} \\\\
\\hline
\\end{array}$$

---

## 3. Central Retinal Artery Occlusion (CRAO)

- **Presentation**: Sudden, painless, severe, catastrophic monocular loss of vision ("eye stroke").
- **Fundoscopy**: **Pale, opaque, milky-white retina with a prominent \"Cherry-red spot\" at the fovea** (foveola lacks inner retinal layers, allowing red vascular choroid to shine through) and segmentation ("boxcarring") of retinal arterioles.
- **Emergency Interventions (Window $<4-6\\text{ hours}$)**: Ocular massage, anterior chamber paracentesis, sublingual isosorbide dinitrate.
`,
  clinicalVignettes: [
    {
      scenario: "A 64-year-old hyperopic female presents to the emergency department at 21:00 with excruciating pain in her right eye, intense right-sided hemicranial headache, nausea, and vomiting that began 3 hours after entering a dark movie theater. She notes seeing rainbow-colored haloes around streetlights and marked blurring of vision in her right eye. On examination, the right cornea is steamy and hazy, the conjunctiva exhibits marked ciliary injection, and the right pupil is mid-dilated, vertically oval, and fixed to light. Tactile palpation reveals a rock-hard right globe. Tonometry reveals an Intraocular Pressure (IOP) of 58 mmHg in the right eye (left eye IOP is 16 mmHg).",
      question: "What is the diagnosis, the emergency pharmacological sequence, and the definitive curative intervention?",
      options: [
        "Acute Angle-Closure Glaucoma (AACG); immediate emergency management requires intravenous Acetazolamide (500 mg IV) PLUS topical Timolol 0.5% PLUS topical Apraclonidine 1% PLUS IV Mannitol (20% 1-2 g/kg); withhold topical Pilocarpine until the IOP drops below 40 mmHg (due to pressure-induced iris sphincter ischemia); once the cornea clears, perform bilateral Laser Peripheral Iridotomy (LPI) in both the affected right eye and the prophylactic left eye",
        "Acute anterior uveitis; administer topical atropine and mydriatics immediately",
        "Migraine with visual aura; prescribe oral sumatriptan and discharge home",
        "Bacterial keratitis; administer topical ciprofloxacin drops and patch the eye"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates acute angle-closure glaucoma (AACG): (1) Clinical Hallmarks: Severe unilateral ocular pain, halo vision, steamy cornea, mid-dilated non-reactive pupil, and markedly elevated IOP (58 mmHg); (2) Emergency IOP Cocktail: Rapid reduction with IV Acetazolamide, topical Timolol, Apraclonidine, and hyperosmotic IV Mannitol; (3) Pilocarpine Rule: High IOP (>40 mmHg) causes iris sphincter ischemia, rendering it unresponsive to pilocarpine; therefore, pilocarpine 2% is administered only after initial medical IOP reduction (<40 mmHg) induces miosis; (4) Definitive Therapy: Bilateral Laser Peripheral Iridotomy (LPI) prevents future pupillary block in both eyes."
    }
  ]
};
