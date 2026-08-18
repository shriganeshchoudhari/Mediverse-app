/**
 * Master Objective Structured Clinical Examination (OSCE-403 / OSCE-301) Learning Catalog
 * Comprehensive practical stations covering Cardiovascular, Neurological, ATLS Trauma, ACLS MegaCode, Suturing, ABG, SPIKES & Obstetric Partograph
 */

import { OSCE_CARDIOVASCULAR_NEUROLOGICAL_STATIONS_MODULE } from "./osceCardiovascularNeurologicalStationsContent";
import { OSCE_EMERGENCY_TRAUMA_ACLS_STATIONS_MODULE } from "./osceEmergencyTraumaAclsStationsContent";
import { OSCE_SURGICAL_PROCEDURES_ABG_STATIONS_MODULE } from "./osceSurgicalProceduresAbgStationsContent";
import { OSCE_COMMUNICATION_ETHICS_OBGYN_STATIONS_MODULE } from "./osceCommunicationEthicsObgynStationsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./osceCardiovascularNeurologicalStationsContent";
export * from "./osceEmergencyTraumaAclsStationsContent";
export * from "./osceSurgicalProceduresAbgStationsContent";
export * from "./osceCommunicationEthicsObgynStationsContent";

export const OSCE_CORE_MODULES: PhysiologyLessonModule[] = [
  OSCE_CARDIOVASCULAR_NEUROLOGICAL_STATIONS_MODULE,
  OSCE_EMERGENCY_TRAUMA_ACLS_STATIONS_MODULE,
  OSCE_SURGICAL_PROCEDURES_ABG_STATIONS_MODULE,
  OSCE_COMMUNICATION_ETHICS_OBGYN_STATIONS_MODULE
];

export function getOsceModuleById(id: string): PhysiologyLessonModule | undefined {
  return OSCE_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOsceModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return OSCE_CORE_MODULES.find(m => m.competencies.includes(code));
}
