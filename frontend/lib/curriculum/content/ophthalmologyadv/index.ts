/**
 * Master Advanced Ophthalmology & Ocular Microsurgery (OPH-301) Learning Catalog
 * Comprehensive modules covering Angle-Closure Glaucoma, Retinal Emergencies, Uveitis & Retinitis, and Corneal Ulcers
 */

import { ANGLE_CLOSURE_GLAUCOMA_IRIDOTOMY_MODULE } from "./angleClosureGlaucomaIridotomyContent";
import { RETINAL_VASCULAR_DETACHMENT_EMERGENCIES_MODULE } from "./retinalVascularDetachmentEmergenciesContent";
import { UVEITIS_OCULAR_IMMUNOLOGY_RETINITIS_MODULE } from "./uveitisOcularImmunologyRetinitisContent";
import { CORNEAL_ULCERS_REFRACTIVE_SURGERY_MODULE } from "./cornealUlcersRefractiveSurgeryContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./angleClosureGlaucomaIridotomyContent";
export * from "./retinalVascularDetachmentEmergenciesContent";
export * from "./uveitisOcularImmunologyRetinitisContent";
export * from "./cornealUlcersRefractiveSurgeryContent";

export const OPHTHALMOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ANGLE_CLOSURE_GLAUCOMA_IRIDOTOMY_MODULE,
  RETINAL_VASCULAR_DETACHMENT_EMERGENCIES_MODULE,
  UVEITIS_OCULAR_IMMUNOLOGY_RETINITIS_MODULE,
  CORNEAL_ULCERS_REFRACTIVE_SURGERY_MODULE
];

export function getOphthalmologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return OPHTHALMOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOphthalmologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return OPHTHALMOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
