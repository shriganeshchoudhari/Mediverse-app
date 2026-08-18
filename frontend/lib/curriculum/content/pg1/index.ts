/**
 * Master Postgraduate Core Clinical Foundations & Residency Readiness (PG-601) Learning Catalog
 * Comprehensive modules covering Critical Care Hemodynamics & ECMO, Advanced Mechanical Ventilation & ARDS, Sepsis Precision Resuscitation, and Residency Core Competencies & M&M Audits
 */

import { CRITICAL_CARE_HEMODYNAMICS_ECMO_MODULE } from "./criticalCareHemodynamicsEcmoContent";
import { ADVANCED_VENTILATOR_ASYNCHRONY_ARDS_MODULE } from "./advancedVentilatorAsynchronyArdsContent";
import { SEPSIS_PHENOTYPING_PRECISION_RESUSCITATION_MODULE } from "./sepsisPhenotypingPrecisionResuscitationContent";
import { RESIDENCY_ENTRUSTABLE_ACTIVITIES_QUALITY_AUDIT_MODULE } from "./residencyEntrustableActivitiesQualityAuditContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./criticalCareHemodynamicsEcmoContent";
export * from "./advancedVentilatorAsynchronyArdsContent";
export * from "./sepsisPhenotypingPrecisionResuscitationContent";
export * from "./residencyEntrustableActivitiesQualityAuditContent";

export const PG1_CORE_MODULES: PhysiologyLessonModule[] = [
  CRITICAL_CARE_HEMODYNAMICS_ECMO_MODULE,
  ADVANCED_VENTILATOR_ASYNCHRONY_ARDS_MODULE,
  SEPSIS_PHENOTYPING_PRECISION_RESUSCITATION_MODULE,
  RESIDENCY_ENTRUSTABLE_ACTIVITIES_QUALITY_AUDIT_MODULE
];

export function getPg1ModuleById(id: string): PhysiologyLessonModule | undefined {
  return PG1_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPg1ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PG1_CORE_MODULES.find(m => m.competencies.includes(code));
}
