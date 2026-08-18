/**
 * Master Anesthesiology & Critical Care (ANES-301) Learning Catalog
 * Comprehensive clinical coverage of Airway Algorithms, Volatile MAC, NMB Reversal & ARDSNet Ventilation
 */

import { AIRWAY_MALLAMPATI_DIFFICULT_ALGORITHM_MODULE } from "./airwayMallampatiDifficultAlgorithmContent";
import { VOLATILE_ANESTHETICS_MAC_MH_MODULE } from "./volatileAnestheticsMacMhContent";
import { NEUROMUSCULAR_BLOCKERS_REVERSAL_MODULE } from "./neuromuscularBlockersReversalContent";
import { ARDSNET_MECHANICAL_VENTILATION_ICU_MODULE } from "./ardsnetMechanicalVentilationIcuContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./airwayMallampatiDifficultAlgorithmContent";
export * from "./volatileAnestheticsMacMhContent";
export * from "./neuromuscularBlockersReversalContent";
export * from "./ardsnetMechanicalVentilationIcuContent";

export const ANESTHESIOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  AIRWAY_MALLAMPATI_DIFFICULT_ALGORITHM_MODULE,
  VOLATILE_ANESTHETICS_MAC_MH_MODULE,
  NEUROMUSCULAR_BLOCKERS_REVERSAL_MODULE,
  ARDSNET_MECHANICAL_VENTILATION_ICU_MODULE
];

export function getAnesthesiologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return ANESTHESIOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getAnesthesiologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ANESTHESIOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
