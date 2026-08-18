/**
 * Master Ophthalmology (OPHTH-301) Learning Catalog
 * Comprehensive clinical coverage of Glaucoma, Cataract, Slit-Lamp & Retinal Emergencies
 */

import { GLAUCOMA_PATHOPHYSIOLOGY_TRIAGE_MODULE } from "./glaucomaPathophysiologyTriageContent";
import { CATARACT_PHACO_LENS_MODULE } from "./cataractPhacoLensContent";
import { SLIT_LAMP_CORNEA_REFRACTION_MODULE } from "./slitLampCorneaRefractionContent";
import { RETINA_VASCULAR_EMERGENCIES_MODULE } from "./retinaVascularEmergenciesContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./glaucomaPathophysiologyTriageContent";
export * from "./cataractPhacoLensContent";
export * from "./slitLampCorneaRefractionContent";
export * from "./retinaVascularEmergenciesContent";

export const OPHTHALMOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  GLAUCOMA_PATHOPHYSIOLOGY_TRIAGE_MODULE,
  CATARACT_PHACO_LENS_MODULE,
  SLIT_LAMP_CORNEA_REFRACTION_MODULE,
  RETINA_VASCULAR_EMERGENCIES_MODULE
];

export function getOphthalmologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return OPHTHALMOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOphthalmologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return OPHTHALMOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
