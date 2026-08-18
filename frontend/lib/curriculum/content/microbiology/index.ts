/**
 * Master Medical Microbiology & Immunology (MICR-201) Learning Catalog
 * Comprehensive coverage of Immunology, Systematic Bacteriology, Toxins, and Virology
 */

import { IMMUNOLOGY_HYPERSENSITIVITY_MODULE } from "./immunologyHypersensitivityContent";
import { SYSTEMATIC_BACTERIOLOGY_MODULE } from "./systematicBacteriologyContent";
import { BACTERIAL_TOXINS_MODULE } from "./bacterialToxinsContent";
import { VIROLOGY_HEPATITIS_MODULE } from "./virologyHepatitisContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./immunologyHypersensitivityContent";
export * from "./systematicBacteriologyContent";
export * from "./bacterialToxinsContent";
export * from "./virologyHepatitisContent";

export const MICROBIOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  IMMUNOLOGY_HYPERSENSITIVITY_MODULE,
  SYSTEMATIC_BACTERIOLOGY_MODULE,
  BACTERIAL_TOXINS_MODULE,
  VIROLOGY_HEPATITIS_MODULE
];

export function getMicrobiologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return MICROBIOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getMicrobiologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return MICROBIOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
