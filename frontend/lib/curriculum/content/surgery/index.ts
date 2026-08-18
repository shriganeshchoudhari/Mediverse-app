/**
 * Master General Surgery (SURG-301) Learning Catalog
 * Comprehensive clinical coverage of Acute Abdomen, Trauma ATLS, Burns & Laparoscopy
 */

import { ACUTE_ABDOMEN_SURGICAL_MODULE } from "./acuteAbdomenSurgicalContent";
import { TRAUMA_ATLS_RESUSCITATION_MODULE } from "./traumaAtlsResuscitationContent";
import { BURNS_FLUID_PARKLAND_MODULE } from "./burnsFluidParklandContent";
import { LAPAROSCOPY_HERNIAS_WOUNDS_MODULE } from "./laparoscopyHerniasWoundsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./acuteAbdomenSurgicalContent";
export * from "./traumaAtlsResuscitationContent";
export * from "./burnsFluidParklandContent";
export * from "./laparoscopyHerniasWoundsContent";

export const SURGERY_CORE_MODULES: PhysiologyLessonModule[] = [
  ACUTE_ABDOMEN_SURGICAL_MODULE,
  TRAUMA_ATLS_RESUSCITATION_MODULE,
  BURNS_FLUID_PARKLAND_MODULE,
  LAPAROSCOPY_HERNIAS_WOUNDS_MODULE
];

export function getSurgeryModuleById(id: string): PhysiologyLessonModule | undefined {
  return SURGERY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getSurgeryModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return SURGERY_CORE_MODULES.find(m => m.competencies.includes(code));
}
