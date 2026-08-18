/**
 * Master Pathology & Pathophysiology (PATH-201) Learning Catalog
 * Comprehensive coverage of Cell Injury, Neoplasia, Hemodynamics, and Histopathology
 */

import { CELL_INJURY_INFLAMMATION_MODULE } from "./cellInjuryInflammationContent";
import { NEOPLASIA_ONCOGENESIS_MODULE } from "./neoplasiaOncogenesisContent";
import { HEMODYNAMICS_THROMBOSIS_MODULE } from "./hemodynamicsThrombosisContent";
import { SYSTEMIC_HISTOPATHOLOGY_MODULE } from "./systemicHistopathologyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cellInjuryInflammationContent";
export * from "./neoplasiaOncogenesisContent";
export * from "./hemodynamicsThrombosisContent";
export * from "./systemicHistopathologyContent";

export const PATHOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  CELL_INJURY_INFLAMMATION_MODULE,
  NEOPLASIA_ONCOGENESIS_MODULE,
  HEMODYNAMICS_THROMBOSIS_MODULE,
  SYSTEMIC_HISTOPATHOLOGY_MODULE
];

export function getPathologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return PATHOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPathologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PATHOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
