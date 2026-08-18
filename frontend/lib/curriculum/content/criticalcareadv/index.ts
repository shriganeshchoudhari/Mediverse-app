/**
 * Master Critical Care Medicine & Hemodynamic Monitoring (CCM-301) Learning Catalog
 * Comprehensive modules covering Advanced Hemodynamics, ARDS & Ventilation, Fluid Responsiveness & Vasopressors, and ICU Sedation/Delirium
 */

import { ADVANCED_HEMODYNAMICS_OXYGEN_DELIVERY_MODULE } from "./advancedHemodynamicsOxygenDeliveryContent";
import { ARDS_MECHANICAL_VENTILATION_MODULE } from "./ardsMechanicalVentilationContent";
import { FLUID_RESPONSIVENESS_VASOPRESSORS_MODULE } from "./fluidResponsivenessVasopressorsContent";
import { ICU_SEDATION_DELIRIUM_ABCDEF_MODULE } from "./icuSedationDeliriumAbcdefContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./advancedHemodynamicsOxygenDeliveryContent";
export * from "./ardsMechanicalVentilationContent";
export * from "./fluidResponsivenessVasopressorsContent";
export * from "./icuSedationDeliriumAbcdefContent";

export const CRITICAL_CARE_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ADVANCED_HEMODYNAMICS_OXYGEN_DELIVERY_MODULE,
  ARDS_MECHANICAL_VENTILATION_MODULE,
  FLUID_RESPONSIVENESS_VASOPRESSORS_MODULE,
  ICU_SEDATION_DELIRIUM_ABCDEF_MODULE
];

export function getCriticalCareAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return CRITICAL_CARE_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getCriticalCareAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return CRITICAL_CARE_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
