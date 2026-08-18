/**
 * Master Pulmonary Pathophysiology, Critical Care & Mechanical Ventilation (PULM-301) Learning Catalog
 * Comprehensive modules covering Flow-Volume Loops & PFT, Mechanical Ventilation Mechanics, ARDS & Prone Rescue, and Hypoxemia & Capnography
 */

import { FLOW_VOLUME_LOOPS_PFT_MODULE } from "./flowVolumeLoopsPftContent";
import { MECHANICAL_VENTILATION_MECHANICS_MODULE } from "./mechanicalVentilationMechanicsContent";
import { ARDS_BERLIN_DEFINITIONS_PRONE_MODULE } from "./ardsBerlinDefinitionsProneContent";
import { HYPOXEMIA_MECHANISMS_CAPNOGRAPHY_MODULE } from "./hypoxemiaMechanismsCapnographyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./flowVolumeLoopsPftContent";
export * from "./mechanicalVentilationMechanicsContent";
export * from "./ardsBerlinDefinitionsProneContent";
export * from "./hypoxemiaMechanismsCapnographyContent";

export const PULMONOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  FLOW_VOLUME_LOOPS_PFT_MODULE,
  MECHANICAL_VENTILATION_MECHANICS_MODULE,
  ARDS_BERLIN_DEFINITIONS_PRONE_MODULE,
  HYPOXEMIA_MECHANISMS_CAPNOGRAPHY_MODULE
];

export function getPulmonologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return PULMONOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPulmonologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PULMONOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
