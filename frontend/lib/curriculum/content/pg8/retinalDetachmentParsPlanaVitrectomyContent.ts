/**
 * Postgraduate Advanced Ophthalmology & Vitreoretinal Surgery: Rhegmatogenous Retinal Detachment & PPV
 * Authoritative vitreoretinal surgical content derived from Lincoff Rules, ASRS PPP Guidelines, Ryan's Retina.
 * Mapped to NMC PG CBME Competencies: PG8.1, OP1.1, OP1.2.
 */

import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE: PhysiologyLessonModule = {
  id: "pg8-retinal-detachment-pars-plana-vitrectomy",
  unitCode: "PG8.1",
  title: "Rhegmatogenous Retinal Detachment (RRD): Lincoff's Rules, 23G/25G PPV & Gas/Oil Endotamponades",
  competencies: ["PG8.1", "OP1.1", "OP1.2"],
  estimatedMinutes: 180,
  organ3dTarget: "NERVOUS",
  markdownContent: `
# Rhegmatogenous Retinal Detachment (RRD) & Pars Plana Vitrectomy (PPV)

Rhegmatogenous retinal detachment is a sight-threatening ophthalmic emergency occurring when liquefied vitreous enters the subretinal space through a full-thickness neurosensory retinal tear following posterior vitreous detachment.

---

## 1. Lincoff's Rules for Locating Primary Retinal Breaks

$$\\begin{array}{lcccc}
\\hline
\\textbf{RRD Configuration / Shape} & \\textbf{Subretinal Fluid Distribution} & \\textbf{Lincoff's Predicted Break Location} \\\\
\\hline
\\textbf{Superior Temporal / Nasal} & \\text{Fluid crosses 12 o'clock vertical meridian} & \\mathbf{\\text{Within } 1.5\\text{ clock hours of 12 o'clock}} \\\\
\\textbf{Superior Lateralized} & \\text{Fluid extends down one side past disc} & \\mathbf{\\text{Within superior quadrant on that side}} \\\\
\\textbf{Inferior Asymmetrical} & \\text{Fluid higher on temporal or nasal side} & \\mathbf{\\text{On the higher side (fluid tracks down)}} \\\\
\\textbf{Inferior Symmetrical} & \\text{Bullous fluid equally elevated on both sides} & \\mathbf{\\text{Near 6 o'clock at lowest point}} \\\\
\\hline
\\end{array}$$

---

## 2. Vitrectomy Endotamponade Properties & Clinical Selection

$$\\begin{array}{lcccc}
\\hline
\\textbf{Endotamponade Agent} & \\textbf{Concentration (Non-Expansile)} & \\textbf{Intraocular Longevity} & \\textbf{Optimal Clinical Indication} \\\\
\\hline
\\textbf{Sulfur Hexafluoride } (SF_6) & \\mathbf{20\\% \\text{ isovolumetric}} & \\mathbf{10-14\\text{ days}} & \\text{Superior / uncomplicated retinal tears} \\\\
\\textbf{Perfluoropropane } (C_3F_8) & \\mathbf{14\\% \\text{ isovolumetric}} & \\mathbf{6-8\\text{ weeks}} & \\mathbf{\\text{Inferior breaks, giant tears, PVR Grade C}} \\\\
\\textbf{Silicone Oil (1000/5000 cSt)} & 100\\% \\text{ non-absorbable} & \\text{Indefinite (requires removal)} & \\mathbf{\\text{Severe PVR, monocular, air travel required}} \\\\
\\hline
\\end{array}$$
`,
  clinicalVignettes: [
    {
      scenario: "A 58-year-old high myope (-6.50 D) presents with a 3-day history of sudden onset photopsias (flashing lights) and extensive floaters in his right eye, followed 24 hours later by a dark 'curtain' descending over his superior visual field. Dilated fundus examination reveals an inferior, bullous rhegmatogenous retinal detachment involving the macula (macula-off), with subretinal fluid extending higher on the temporal side up to the 8 o'clock meridian. Visual acuity is 20/200 OD.",
      question: "According to Lincoff's rules, where is the primary retinal break located, and what is the standard surgical intervention with endotamponade selection?",
      options: [
        "The primary break is located on the higher temporal side near 8 o'clock according to Lincoff's rules for inferior asymmetric RRD; perform 23G/25G Pars Plana Vitrectomy (PPV) with vitreous shaving, fluid-air exchange, 360-degree laser retinopexy around the break, and instillation of a long-acting 14% C3F8 gas endotamponade (lasting 6-8 weeks) or silicone oil combined with strict postoperative positioning",
        "The break is at 12 o'clock; perform pneumatic retinopexy with pure air only",
        "The detachment is exudative; start high-dose oral corticosteroids without surgery",
        "The condition is benign; observe with periodic visual field checks"
      ],
      correctAnswerIndex: 0,
      explanation: "This case demonstrates classic Rhegmatogenous Retinal Detachment: (1) Lincoff's Rules: In inferior RRD with asymmetric subretinal fluid, the primary break is located on the higher side (8 o'clock) where fluid originates; (2) Vitrectomy & Tamponade: Inferior tears require a long-acting non-expansile gas (14% C3F8 lasting 6-8 weeks) or silicone oil to maintain adequate buoyant surface tension against the break during prone/postural convalescence; (3) Urgent repair restores macular reattachment."
    }
  ]
};
