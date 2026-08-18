/**
 * Master Human Physiology (PHYS-101) Learning Modules Catalog
 * Comprehensive coverage across all NMC CBME Units with 3D Organ Canvas & Simulation Bindings
 */

import { CARDIAC_CYCLE_MODULE, PhysiologyLessonModule } from "./cardiacCycleContent";
import { RESPIRATORY_MECHANICS_MODULE } from "./respiratoryMechanicsContent";
import { RENAL_FILTRATION_MODULE } from "./renalFiltrationContent";
import { NERVE_MUSCLE_MODULE } from "./nerveMuscleContent";
import { ACID_BASE_MODULE } from "./acidBaseContent";
import { HEMATOLOGY_MODULE } from "./hematologyContent";
import { GASTROINTESTINAL_MODULE } from "./gastrointestinalContent";
import { ENDOCRINE_MODULE } from "./endocrineContent";
import { NEUROPHYSIOLOGY_MODULE } from "./neurophysiologyContent";

export * from "./cardiacCycleContent";
export * from "./respiratoryMechanicsContent";
export * from "./renalFiltrationContent";
export * from "./nerveMuscleContent";
export * from "./acidBaseContent";
export * from "./hematologyContent";
export * from "./gastrointestinalContent";
export * from "./endocrineContent";
export * from "./neurophysiologyContent";

export const PHYSIOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  CARDIAC_CYCLE_MODULE,
  RESPIRATORY_MECHANICS_MODULE,
  RENAL_FILTRATION_MODULE,
  NERVE_MUSCLE_MODULE,
  ACID_BASE_MODULE,
  HEMATOLOGY_MODULE,
  GASTROINTESTINAL_MODULE,
  ENDOCRINE_MODULE,
  NEUROPHYSIOLOGY_MODULE
];

export function getPhysiologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return PHYSIOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPhysiologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PHYSIOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
