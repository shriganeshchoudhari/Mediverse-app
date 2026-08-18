/**
 * Master Cardiovascular Pathophysiology & Advanced Hemodynamics (CARD-301) Learning Catalog
 * Comprehensive modules covering Wiggers Diagram & PV Loops, JVP Waveforms, Heart Failure & Shock, and Advanced ACLS Arrhythmias
 */

import { WIGGERS_DIAGRAM_PV_LOOPS_MODULE } from "./wiggersDiagramPvLoopsContent";
import { JVP_WAVEFORMS_HEMODYNAMICS_MODULE } from "./jvpWaveformsHemodynamicsContent";
import { HEART_FAILURE_SHOCK_HEMODYNAMICS_MODULE } from "./heartFailureShockHemodynamicsContent";
import { ACLS_ARRHYTHMIAS_PHARMACOTHERAPY_MODULE } from "./aclsArrhythmiasPharmacotherapyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./wiggersDiagramPvLoopsContent";
export * from "./jvpWaveformsHemodynamicsContent";
export * from "./heartFailureShockHemodynamicsContent";
export * from "./aclsArrhythmiasPharmacotherapyContent";

export const CARDIOVASCULAR_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  WIGGERS_DIAGRAM_PV_LOOPS_MODULE,
  JVP_WAVEFORMS_HEMODYNAMICS_MODULE,
  HEART_FAILURE_SHOCK_HEMODYNAMICS_MODULE,
  ACLS_ARRHYTHMIAS_PHARMACOTHERAPY_MODULE
];

export function getCardiovascularAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return CARDIOVASCULAR_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getCardiovascularAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return CARDIOVASCULAR_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
