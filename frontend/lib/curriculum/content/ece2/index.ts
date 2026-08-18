/**
 * Master Early Clinical Exposure II (ECE-102) Learning Catalog
 * Comprehensive modules covering Patient Safety & RCA, Interprofessional Communication & SBAR, Diagnostic Stewardship & EBM, and Clinical Reasoning & Cognitive Biases
 */

import { PATIENT_SAFETY_ROOT_CAUSE_ANALYSIS_MODULE } from "./patientSafetyRootCauseAnalysisContent";
import { INTERPROFESSIONAL_COMMUNICATION_SBAR_MODULE } from "./interprofessionalCommunicationSbarContent";
import { DIAGNOSTIC_STEWARDSHIP_EBM_MODULE } from "./diagnosticStewardshipEbmContent";
import { CLINICAL_REASONING_COGNITIVE_BIASES_MODULE } from "./clinicalReasoningCognitiveBiasesContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./patientSafetyRootCauseAnalysisContent";
export * from "./interprofessionalCommunicationSbarContent";
export * from "./diagnosticStewardshipEbmContent";
export * from "./clinicalReasoningCognitiveBiasesContent";

export const ECE2_CORE_MODULES: PhysiologyLessonModule[] = [
  PATIENT_SAFETY_ROOT_CAUSE_ANALYSIS_MODULE,
  INTERPROFESSIONAL_COMMUNICATION_SBAR_MODULE,
  DIAGNOSTIC_STEWARDSHIP_EBM_MODULE,
  CLINICAL_REASONING_COGNITIVE_BIASES_MODULE
];

export function getEce2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return ECE2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEce2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ECE2_CORE_MODULES.find(m => m.competencies.includes(code));
}
