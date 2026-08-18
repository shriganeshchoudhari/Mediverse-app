/**
 * Postgraduate Advanced Ophthalmology, Vitreoretinal Surgery & Neuro-Ophthalmology (PG-608) Curriculum Index
 * Authoritative learning modules covering Rhegmatogenous Retinal Detachment & PPV, Neovascular AMD & DME Anti-VEGF, Acute Angle-Closure Glaucoma Crisis, and Neuro-Ophthalmology.
 * Mapped to NMC PG CBME Competencies PG8.1 - PG8.4.
 */

import { RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE } from "./retinalDetachmentParsPlanaVitrectomyContent";
import { NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE } from "./neovascularAmdDiabeticMacularEdemaAntiVegfContent";
import { ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE } from "./acuteAngleClosureGlaucomaLaserIridotomyContent";
import { NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE } from "./neuroOphthalmologyGcaAionOpticNeuritisContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PG8_CURRICULUM_MODULES: PhysiologyLessonModule[] = [
  RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE,
  NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE,
  ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE,
  NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE
];

export {
  RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE,
  NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE,
  ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE,
  NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE
};
