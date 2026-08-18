/**
 * Glaucoma Pathophysiology, Open vs Closed Angle & Emergency Triage Learning Content
 * Authoritative medical content derived from Kanski, Parson, Khurana, AAO PPP, and USMLE Step 2 CK Ophthalmology.
 * Mapped to NMC CBME Competencies: OP1.1, OP1.2, OP1.3, OP2.1, OP2.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const GLAUCOMA_PATHOPHYSIOLOGY_TRIAGE_MODULE: PhysiologyLessonModule = {
  id: "ophth-glaucoma-triage",
  unitCode: "OP1.1",
  title: "Ophthalmology: Glaucoma (POAG vs Acute Angle-Closure), IOP Dynamics & Laser Iridotomy",
  competencies: ["OP1.1", "OP1.2", "OP1.3", "OP2.1", "OP2.2"],
  estimatedMinutes: 140,
  organ3dTarget: "OPTIC",
  markdownContent: `
# Ophthalmology: Glaucoma (POAG vs Acute Angle-Closure), IOP Dynamics & Laser Iridotomy

Glaucoma is a progressive optic neuropathy characterized by retinal ganglion cell (**RGC**) death, progressive visual field loss, and structural optic disc cupping, frequently driven by elevated **Intraocular Pressure (IOP)**.

---

## 1. Aqueous Humor Dynamics & Normal Intraocular Pressure

- **Production**: Active secretion by the non-pigmented ciliary body epithelium ($Na^+/K^+$ ATPase and Carbonic Anhydrase) $\\rightarrow$ Posterior Chamber $\\rightarrow$ Pupil $\\rightarrow$ Anterior Chamber.
- **Outflow Pathways**:
  - **Trabecular (Conventional) Pathway ($80\\text{–}90\\%$)**: Trabecular Meshwork $\\rightarrow$ Schlemm\'s Canal $\\rightarrow$ Collector Channels $\\rightarrow$ Episcleral Veins. Pressure-dependent.
  - **Uveoscleral (Unconventional) Pathway ($10\\text{–}20\\%$)**: Ciliary muscle interstitial spaces $\\rightarrow$ Suprachoroidal space. Pressure-independent.
- **Normal IOP**: **$10\\text{ to } 21\\text{ mmHg}$** (measured via Goldmann Applanation Tonometry).

---

## 2. Primary Open-Angle Glaucoma (POAG) vs Acute Angle-Closure Glaucoma (AACG)

| Clinical Parameter | Primary Open-Angle Glaucoma (POAG) | Acute Angle-Closure Glaucoma (AACG - Emergency!) |
| :--- | :--- | :--- |
| **Anatomical Angle (Gonioscopy)** | **Open, unobstructed trabecular meshwork** (Shaffer Grade 3–4); microscopic outflow resistance. | **Narrow / Occluded Angle (Shaffer Grade 0–1)**; peripheral iris directly apposes trabecular meshwork (**Iris bombé**). |
| **Onset & Symptoms** | **Insidious, painless, slowly progressive bilateral**; *"the sneak thief of sight"*. | **Sudden, excruciating, unilateral periorbital/ocular pain**, headache, nausea, vomiting, **Colored Halos around lights** (corneal edema). |
| **Optic Disc Changes** | **Cup-to-Disc (C:D) ratio $> 0.5$**; asymmetry $> 0.2$; **Violation of ISNT Rule** (normal neuroretinal rim: Inferior $\\ge$ Superior $\\ge$ Nasal $\\ge$ Temporal; in POAG, inferior/superior rims thin first); **Drance disc hemorrhages**. | Acute ischemic optic disc edema; rapid permanent optic nerve atrophy if untreated. |
| **Visual Field Defects** | **Arcuate (Bjerrum) Scotoma**, Seidel scotoma, **Nasal Step of Roenne** $\\rightarrow$ late **"Tunnel Vision"** (central vision spared until end-stage). | Rapid generalized visual field constriction. |
| **Slit-Lamp Physical Signs** | Normal anterior segment; deep anterior chamber; normal cornea and pupil. | **"Steamy / Cloudy Ground-Glass" cornea**, **Ciliary Flush (deep conjunctival injection)**, **Mid-dilated, fixed, vertically oval, non-reactive pupil**, shallow anterior chamber. |
| **Measured IOP** | Moderately elevated ($22\\text{ to } 35\\text{ mmHg}$) or normal (Normal-Tension Glaucoma). | **Severely elevated ($40\\text{ to } 70\\text{+ mmHg}$)**; rock-hard globe on palpation. |

---

## 3. Evidence-Based Medical & Surgical Management

### 1. First-Line Medical Therapy for POAG:
- **Prostaglandin Analogs (Latanoprost, Bimatoprost)**: *First-line monotherapy*; increases **uveoscleral outflow**. Side effects: Iris hyperpigmentation (brown iris), eyelash hypertrichosis (lengthening/thickening).
- **Topical Beta-Blockers (Timolol 0.5%)**: Decreases aqueous production. *Contraindications: Asthma, COPD, Bradycardia, Heart Block*.
- **Topical Alpha-2 Agonists (Brimonidine)**: Decreases aqueous production and increases uveoscleral outflow.
- **Topical Carbonic Anhydrase Inhibitors (Dorzolamide)**: Decreases aqueous production.

### 2. Emergency Medical Regimen for Acute Angle-Closure:
1. **Intravenous / Oral Acetazolamide ($500\\text{ mg}$)**: Rapidly shuts down ciliary aqueous secretion.
2. **Intravenous Hyperosmotic Agent (20% Mannitol $1\\text{–}2\\text{ g/kg}$ IV over $30\\text{ min}$)**: Creates osmotic gradient drawing water out of the vitreous body, rapidly collapsing IOP.
3. **Topical Drops**: Timolol 0.5% $+$ Brimonidine 0.2% $+$ Prednisolone acetate 1%.
4. **Topical Pilocarpine 1–2%**: Muscarinic agonist causing pupillary constriction (miosis), pulling peripheral iris away from the trabecular meshwork *(give after IOP drops below $40-50\\text{ mmHg}$ due to iris sphincter ischemia at high pressures)*.
5. **Definitive Cure**: **Laser Peripheral Iridotomy (LPI)** to bypass pupillary block in the affected eye **AND prophylactic LPI in the contralateral fellow eye!**
`,
  clinicalVignettes: [
    {
      scenario: "A 62-year-old hyperopic female presents to the emergency room with severe right eye pain, right-sided hemicranial headache, nausea, and vomiting that began while watching a movie in a dark theater. She describes seeing rainbow-colored halos around lights. Physical examination reveals an injected right eye with a steamy, hazy cornea and a mid-dilated, vertically oval pupil that does not react to light. Goldmann applanation tonometry reveals an intraocular pressure of 58 mmHg in the right eye and 15 mmHg in the left eye.",
      question: "Which of the following represents the most urgent, definitive intervention following initial pressure-lowering medical therapy?",
      options: [
        "Bilateral Laser Peripheral Iridotomy (LPI)",
        "Topical Atropine 1% cycloplegic drops to both eyes",
        "Immediate right eye trabeculectomy with mitomycin C",
        "Unilateral right eye laser trabeculoplasty (SLT)"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with classic Acute Angle-Closure Glaucoma (triggered by pupillary mid-dilation in a dark theater, leading to pupillary block, steamy cornea, mid-dilated vertically oval fixed pupil, and IOP 58 mmHg). After emergency medical pressure lowering with IV acetazolamide, IV mannitol, and topical drops, the definitive curative treatment is Laser Peripheral Iridotomy (LPI), which creates an opening in the peripheral iris to eliminate pupillary block. Crucially, prophylactic LPI must also be performed in the contralateral fellow eye because it shares the same narrow-angle anatomical predisposition."
    }
  ]
};
