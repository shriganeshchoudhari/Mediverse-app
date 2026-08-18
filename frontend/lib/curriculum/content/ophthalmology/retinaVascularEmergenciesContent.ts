/**
 * Retinal Vascular Emergencies, Detachment & Diabetic Retinopathy Learning Content
 * Authoritative medical content derived from Kanski, AAO, Parson, and USMLE Step 2 CK Ophthalmology.
 * Mapped to NMC CBME Competencies: OP7.1, OP7.2, OP8.1, OP8.2
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RETINA_VASCULAR_EMERGENCIES_MODULE: PhysiologyLessonModule = {
  id: "ophth-retina-emergencies",
  unitCode: "OP7.1",
  title: "Ophthalmology: Retinal Emergencies (CRAO Cherry-Red Spot, CRVO, Retinal Detachment & PDR)",
  competencies: ["OP7.1", "OP7.2", "OP8.1", "OP8.2"],
  estimatedMinutes: 140,
  organ3dTarget: "OPTIC",
  markdownContent: `
# Ophthalmology: Retinal Emergencies (CRAO Cherry-Red Spot, CRVO, Retinal Detachment & PDR)

Acute retinal vascular occlusions and retinal detachments are time-critical ophthalmic emergencies where prompt identification protects the photoreceptor-RPE neurosensory interface.

---

## 1. Central Retinal Artery Occlusion (CRAO) — "Ocular Stroke"

- **Etiology**: Embolic occlusion (carotid atheroma plaque, cardiac mural thrombus, or giant cell arteritis) of the central retinal artery.
- **Clinical Presentation**: **Sudden, painless, profound, catastrophic monocular visual loss** (vision reduced to Count Fingers or Light Perception); **Relative Afferent Pupillary Defect (RAPD / Marcus Gunn pupil)** present.
- **Funduscopy Hallmark**:
  - **Diffuse Pale / Milky-White Ischemic Retina** (due to intracellular edema of the nerve fiber layer).
  - **Pathognomonic "Cherry-Red Spot" at the Fovea**: The fovea centralis is extremely thin ($<100\\,\\mu\\text{m}$) and lacks inner retinal layers, allowing the underlying richly vascular choroid (supplied by short posterior ciliary arteries) to shine through!
  - **"Boxcarring" / Cattle-Trucking**: Segmented column of motionless erythrocytes in retinal arterioles.
- **Emergency Management ($<4\\text{–}6\\text{ hours}$)**: Ocular digital massage, anterior chamber paracentesis (to drop IOP and dislodge embolus), sublingual isosorbide dinitrate, hyperbaric oxygen, and urgent Giant Cell Arteritis (GCA) workup (ESR/CRP, high-dose IV steroids if suspected).

---

## 2. Central Retinal Vein Occlusion (CRVO)

- **Etiology**: Thrombosis of the central retinal vein at the lamina cribrosa (associated with HTN, diabetes, glaucoma, hypercoagulability).
- **Clinical Presentation**: Sudden, painless, moderate-to-severe monocular vision loss.
- **Funduscopy Hallmark**:
  - **"Blood and Thunder" Appearance**: Massive, extensive flame-shaped and blot retinal hemorrhages across all 4 quadrants.
  - Markedly dilated, tortuous, engorged retinal veins; prominent macular edema; multiple cotton-wool spots (ischemic infarcts).
- **Major Complication**: **"90-Day Neovascular Glaucoma"** caused by massive VEGF release from ischemic retina causing neovascularization of the iris (NVI / rubeosis iridis) and angle closure.
- **Management**: Intravitreal **Anti-VEGF Agents** (Aflibercept, Ranibizumab) and Panretinal Photocoagulation (PRP) if neovascularization develops.

---

## 3. Rhegmatogenous Retinal Detachment (RRD)

- **Pathogenesis**: Full-thickness retinal tear/break (horseshoe tear) allows liquefied vitreous fluid to enter the subretinal space, separating the **Neurosensory Retina from the underlying Retinal Pigment Epithelium (RPE)**.
- **Classic Symptom Triad**:
  1. **Photopsia**: Flashes of light (vitreoretinal traction).
  2. **Floaters**: Sudden "shower of black pepper spots" / cobwebs (vitreous hemorrhage or pigment release).
  3. **Visual Field Curtain**: A **"dark shadow or veil descending over the field of vision"** that progresses toward central fixation.
- **Examination**: **Elevated, billowing, corrugated grey-white detached retina** with undulating folds; **Shafer's Sign ("Tobacco Dust")**—brown pigment cells in anterior vitreous.
- **Definitive Management**: Emergency surgical reattachment via **Pneumatic Retinopexy**, **Scleral Buckling**, or **Pars Plana Vitrectomy (PPV)** with laser retinopexy and gas/silicone oil tamponade.

---

## 4. Diabetic Retinopathy (DR)

| Classification | Pathophysiology & Fundus Findings | Clinical Staging & Management |
| :--- | :--- | :--- |
| **Non-Proliferative (NPDR)** | Hyperglycemic microvascular pericyte loss $\\rightarrow$ capillary basement membrane thickening $\\rightarrow$ breakdown of inner blood-retinal barrier. | **Mild/Moderate/Severe**: Microaneurysms, dot-and-blot hemorrhages, hard exudates (lipid deposits), cotton-wool spots (nerve fiber layer ischemia). Tight glycemic/BP control. |
| **Proliferative (PDR)** | Severe capillary non-perfusion $\\rightarrow$ retinal ischemia $\\rightarrow$ **massive VEGF upregulation**. | **Neovascularization of the Disc (NVD)** or **Neovascularization Elsewhere (NVE)**. Risk of vitreous hemorrhage & tractional retinal detachment.<br>Management: **Panretinal Photocoagulation (PRP Laser)** $\\pm$ Intravitreal Anti-VEGF injections. |
`,
  clinicalVignettes: [
    {
      scenario: "A 68-year-old male with a history of hypertension, coronary artery disease, and carotid stenosis presents to the eye clinic with sudden, painless complete loss of vision in his left eye that occurred 90 minutes ago. Pupillary examination reveals a marked left relative afferent pupillary defect (Marcus Gunn pupil). Dilated fundus examination of the left eye reveals a diffuse cloudy, milky-white pale retina with marked attenuation of retinal arterioles and a vivid, cherry-red spot in the center of the macula.",
      question: "What is the diagnosis, and why does the macular fovea appear cherry-red in this condition?",
      options: [
        "Central Retinal Artery Occlusion; The thin fovea allows the underlying choroidal circulation to show through the pale, edematous retina",
        "Central Retinal Vein Occlusion; Severe intra-foveal flame hemorrhage creates a dense cherry-red hematoma",
        "Rhegmatogenous Retinal Detachment; The fovea is torn, exposing bare bare sclera",
        "Acute Angle-Closure Glaucoma; The red appearance is due to ischemic anterior chamber hyphema"
      ],
      correctAnswerIndex: 0,
      explanation: "Sudden, painless profound vision loss with an afferent pupillary defect and a pale, milky-white retina surrounding a prominent 'cherry-red spot' at the fovea is the classic presentation of a Central Retinal Artery Occlusion (CRAO). The cherry-red spot occurs because the fovea is extremely thin, lacking the thickened, edematous inner retinal nerve fiber layers that become opaque in ischemia, thereby allowing the red vascular bed of the underlying intact choroid (supplied by posterior ciliary arteries) to remain distinctly visible."
    }
  ]
};
