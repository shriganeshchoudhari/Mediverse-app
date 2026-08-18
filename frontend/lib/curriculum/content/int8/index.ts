/**
 * Master Internship Core Clinical Postings: Comprehensive Internship Exit Competencies & Clinical Portfolio (INT-508) Learning Catalog
 * Comprehensive modules covering Medico-Legal Jurisprudence (MCCD, MLC & THOTA), Entrustable Professional Activities (EPAs 1-13 & Chen Scale), Exit OSCE Master Stations (Resuscitation, CICO, PPH & Stroke), and Quality Improvement (RCA, PDSA & SBAR)
 */

import { MEDICO_LEGAL_DEATH_CERTIFICATION_THOTA_MODULE } from "./medicoLegalDeathCertificationThotaContent";
import { ENTRUSTABLE_PROFESSIONAL_ACTIVITIES_PORTFOLIO_MODULE } from "./entrustableProfessionalActivitiesPortfolioContent";
import { EXIT_OSCE_MASTER_STATION_SIMULATIONS_MODULE } from "./exitOsceMasterStationSimulationsContent";
import { QUALITY_IMPROVEMENT_PATIENT_SAFETY_SBAR_MODULE } from "./qualityImprovementPatientSafetySbarContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./medicoLegalDeathCertificationThotaContent";
export * from "./entrustableProfessionalActivitiesPortfolioContent";
export * from "./exitOsceMasterStationSimulationsContent";
export * from "./qualityImprovementPatientSafetySbarContent";

export const INT8_CORE_MODULES: PhysiologyLessonModule[] = [
  MEDICO_LEGAL_DEATH_CERTIFICATION_THOTA_MODULE,
  ENTRUSTABLE_PROFESSIONAL_ACTIVITIES_PORTFOLIO_MODULE,
  EXIT_OSCE_MASTER_STATION_SIMULATIONS_MODULE,
  QUALITY_IMPROVEMENT_PATIENT_SAFETY_SBAR_MODULE
];

export function getInt8ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT8_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt8ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT8_CORE_MODULES.find(m => m.competencies.includes(code));
}
