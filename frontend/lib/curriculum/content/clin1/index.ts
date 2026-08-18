/**
 * Master Clinical Postings I (CLIN-201) Learning Catalog
 * Comprehensive modules covering Inpatient Ward Rounds & SOAP Documentation, Bedside Cardiovascular & JVP Signs, Bedside Pulmonary/Abdominal/Neuro Signs, and Fluid & Electrolyte Emergency Management
 */

import { WARD_ROUNDS_SOAP_DOCUMENTATION_MODULE } from "./wardRoundsSoapDocumentationContent";
import { BEDSIDE_CARDIOVASCULAR_JVP_SIGNS_MODULE } from "./bedsideCardiovascularJvpSignsContent";
import { BEDSIDE_PULMONARY_ABDOMINAL_NEURO_SIGNS_MODULE } from "./bedsidePulmonaryAbdominalNeuroSignsContent";
import { FLUID_MANAGEMENT_ELECTROLYTE_EMERGENCY_MODULE } from "./fluidManagementElectrolyteEmergencyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./wardRoundsSoapDocumentationContent";
export * from "./bedsideCardiovascularJvpSignsContent";
export * from "./bedsidePulmonaryAbdominalNeuroSignsContent";
export * from "./fluidManagementElectrolyteEmergencyContent";

export const CLIN1_CORE_MODULES: PhysiologyLessonModule[] = [
  WARD_ROUNDS_SOAP_DOCUMENTATION_MODULE,
  BEDSIDE_CARDIOVASCULAR_JVP_SIGNS_MODULE,
  BEDSIDE_PULMONARY_ABDOMINAL_NEURO_SIGNS_MODULE,
  FLUID_MANAGEMENT_ELECTROLYTE_EMERGENCY_MODULE
];

export function getClin1ModuleById(id: string): PhysiologyLessonModule | undefined {
  return CLIN1_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getClin1ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return CLIN1_CORE_MODULES.find(m => m.competencies.includes(code));
}
