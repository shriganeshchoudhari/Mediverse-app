/**
 * Clinical Ophthalmology Advanced: Retinal Vascular Emergencies & Retinal Detachment
 * Authoritative retina content derived from Kanski's (9th ed.), AAO Retina and Vitreous.
 * Mapped to NMC CBME Competencies: OP3.1, OP3.2, MD46.2, SU44.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RETINAL_VASCULAR_DETACHMENT_EMERGENCIES_MODULE: PhysiologyLessonModule = {
  id: "ophthalmology-adv-retinal-emergencies",
  unitCode: "OP3.1",
  title: "Retinal Emergencies: Central Retinal Artery Occlusion (CRAO), CRVO & Rhegmatogenous Detachment",
  competencies: ["OP3.1", "OP3.2", "MD46.2", "SU44.2"],
  estimatedMinutes: 150,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Retinal Emergencies: CRAO, CRVO & Rhegmatogenous Retinal Detachment

Acute retinal vascular and vitreoretinal disorders require urgent ophthalmoscopic identification to prevent permanent irreversible blindness.

---

## 1. Acute Retinal Emergencies Comparative Matrix

$$\\begin{array}{lcccc}
\\hline
\\textbf{Retinal Entity} & \\textbf{Primary Pathophysiology} & \\textbf{Fundoscopic / Ophthalmoscopic Signs} & \\textbf{Visual Symptoms} & \\textbf{Emergency Interventions} \\\\
\\hline
\\textbf{CRAO} & \\mathbf{\\text{Embolic occlusion of central retinal}} & \\mathbf{\\text{Diffuse retinal whitening / edema with}} & \\mathbf{\\text{Sudden, painless, profound}} & \\mathbf{\\text{Ocular massage, anterior chamber}} \\\\
(\\text{Artery Occlusion}) & \\text{artery (carotid atheroma, Hollenhorst)} & \\mathbf{\\text{\"CHERRY-RED SPOT\" at fovea; boxcarring}} & \\text{monocular vision loss (count fingers)} & \\text{paracentesis, hyperbaric } \\text{O}_2 \\\\
\\textbf{CRVO} & \\mathbf{\\text{Thrombosis of central retinal vein}} & \\mathbf{\\text{\"BLOOD AND THUNDER\" appearance;}} & \\text{Subacute / painless vision loss;} & \\mathbf{\\text{Anti-VEGF intravitreal injections}} \\\\
(\\text{Vein Occlusion}) & \\text{at lamina cribrosa (HTN, glaucoma)} & \\text{widespread flame hemorrhages, disc edema} & \\text{variable visual acuity drop} & (\\text{Aflibercept}) + \\text{ Panretinal Laser} \\\\
\\textbf{Rhegmatogenous} & \\mathbf{\\text{Full-thickness retinal tear allowing}} & \\mathbf{\\text{Corrugated, elevated, grey subretinal fluid;}} & \\mathbf{\\text{Photopsias (flashes), floaters,}} & \\mathbf{\\text{Pneumatic retinopexy, Scleral}} \\\\
\\textbf{Detachment (RRD)} & \\text{vitreous into subretinal space} & \\mathbf{\\text{Shafer sign (\"tobacco dust\" pigment in vit)}} & \\mathbf{\\text{\"curtain coming down\" field defect}} & \\text{buckle, Pars plana vitrectomy} \\\\
\\hline
\\end{array}$$

---

## 2. Pathophysiological Mechanics & Treatment Rules

- **Central Retinal Artery Occlusion (CRAO)**:
  - The retina has a dual blood supply: outer layers from choroid, inner layers from central retinal artery.
  - In CRAO, the inner retina swells and turns opaque white. The fovea is nourished exclusively by the underlying choroid and lacks inner layers, thus appearing as a prominent **"Cherry-Red Spot"**.
  - **Ischemic Window**: Retinal ganglion cells undergo irreversible necrosis within **$90 - 100\\text{ minutes}$** of complete arterial occlusion.
- **Central Retinal Vein Occlusion (CRVO)**:
  - Venous stagnation triggers retinal ischemia, releasing high levels of **Vascular Endothelial Growth Factor (VEGF)**.
  - VEGF drives iris neovascularization (rubeosis iridis) and angle closure, causing **"90-Day Neovascular Glaucoma"**.
  - Treated with monthly intravitreal **anti-VEGF injections** (Aflibercept, Ranibizumab) and panretinal photocoagulation (PRP).
- **Rhegmatogenous Retinal Detachment (RRD)**:
  - Vitreous syneresis and posterior vitreous detachment (PVD) apply traction on the retina, causing a horseshoe tear.
  - **Shafer's Sign ("Tobacco Dust")**: Clumps of brownish retinal pigment epithelial (RPE) cells released into the anterior vitreous cavity through the retinal tear.
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a history of hypertension, hyperlipidemia, and heavy smoking presents to the emergency room with sudden, painless, complete loss of vision in his left eye that occurred abruptly 45 minutes ago while eating breakfast. He denies ocular pain, redness, or discharge. On examination, visual acuity is 20/20 in the right eye and limited to light perception only in the left eye. Pupillary examination of the left eye reveals an afferent pupillary defect (Marcus Gunn pupil). Dilated fundoscopic examination of the left eye demonstrates marked diffuse opacification and pale whitening of the posterior pole with prominent segmentation ('boxcarring') of the retinal arterioles and a vivid, sharply defined 'cherry-red spot' centered at the macula.",
      question: "What is the diagnosis, what is the underlying pathophysiology of the cherry-red spot, and what are the emergency interventions?",
      options: [
        "Central Retinal Artery Occlusion (CRAO); the cherry-red spot represents the normal reddish choroidal vascular bed shining through the extremely thin fovea surrounded by opacified, ischemic, edematous inner retinal layers; perform immediate digital ocular massage and anterior chamber paracentesis",
        "Central Retinal Vein Occlusion (CRVO); the cherry-red spot is a massive macular hemorrhage; administer systemic heparin",
        "Rhegmatogenous Retinal Detachment; perform emergency pneumatic retinopexy",
        "Open-Angle Glaucoma; administer topical Timolol drops alone"
      ],
      correctAnswerIndex: 0,
      explanation: "This patient presents with the pathognomonic clinical features of Acute Central Retinal Artery Occlusion (CRAO). Key points include: (1) Symptoms: Sudden, painless, severe monocular vision loss with an afferent pupillary defect (Marcus Gunn pupil); (2) Fundoscopy: Retinal whitening/edema of the inner retina due to cell swelling and ischemia. The 'cherry-red spot' is created because the central fovea contains only thin outer retinal layers nourished by the intact underlying choroidal circulation, allowing the reddish choroid to contrast sharply against the surrounding pale, edematous inner retina; (3) Emergency Treatment: Because irreversible retinal ganglion cell death occurs within ~90-100 minutes, immediate interventions to dislodge the embolus into a more distal branch include digital ocular massage (to suddenly drop IOP and increase perfusion pressure), anterior chamber paracentesis, and hyperbaric oxygen."
    }
  ]
};
