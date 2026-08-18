/**
 * Master Radiodiagnosis & Imaging (RAD-301) Learning Catalog
 * Comprehensive clinical coverage of Chest Radiography, Head CT, E-FAST Ultrasound & MRI Physics
 */

import { CHEST_RADIOGRAPHY_ABCDE_MODULE } from "./chestRadiographyAbcdeContent";
import { HEAD_CT_INTRACRANIAL_HEMORRHAGE_MODULE } from "./headCtIntracranialHemorrhageContent";
import { ABDOMINAL_FAST_ULTRASOUND_CT_MODULE } from "./abdominalFastUltrasoundCtContent";
import { RADIATION_SAFETY_MRI_PHYSICS_MODULE } from "./radiationSafetyMriPhysicsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./chestRadiographyAbcdeContent";
export * from "./headCtIntracranialHemorrhageContent";
export * from "./abdominalFastUltrasoundCtContent";
export * from "./radiationSafetyMriPhysicsContent";

export const RADIOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  CHEST_RADIOGRAPHY_ABCDE_MODULE,
  HEAD_CT_INTRACRANIAL_HEMORRHAGE_MODULE,
  ABDOMINAL_FAST_ULTRASOUND_CT_MODULE,
  RADIATION_SAFETY_MRI_PHYSICS_MODULE
];

export function getRadiologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return RADIOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getRadiologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return RADIOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
