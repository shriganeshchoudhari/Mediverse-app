/**
 * Master Hospital Administration, Healthcare Quality & Patient Safety (HADM-401) Learning Catalog
 * Comprehensive modules covering BMWM Rules 2016, HIC & Care Bundles, Quality Frameworks & Bed Metrics, and Patient Safety & RCA
 */

import { BIOMEDICAL_WASTE_MANAGEMENT_RULES_2016_MODULE } from "./biomedicalWasteManagementRules2016Content";
import { HOSPITAL_INFECTION_CONTROL_CARE_BUNDLES_MODULE } from "./hospitalInfectionControlCareBundlesContent";
import { HEALTHCARE_QUALITY_ACCREDITATION_AUDITS_MODULE } from "./healthcareQualityAccreditationAuditsContent";
import { PATIENT_SAFETY_RISK_MANAGEMENT_RCA_MODULE } from "./patientSafetyRiskManagementRcaContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./biomedicalWasteManagementRules2016Content";
export * from "./hospitalInfectionControlCareBundlesContent";
export * from "./healthcareQualityAccreditationAuditsContent";
export * from "./patientSafetyRiskManagementRcaContent";

export const HOSPITAL_ADMIN_CORE_MODULES: PhysiologyLessonModule[] = [
  BIOMEDICAL_WASTE_MANAGEMENT_RULES_2016_MODULE,
  HOSPITAL_INFECTION_CONTROL_CARE_BUNDLES_MODULE,
  HEALTHCARE_QUALITY_ACCREDITATION_AUDITS_MODULE,
  PATIENT_SAFETY_RISK_MANAGEMENT_RCA_MODULE
];

export function getHospitalAdminModuleById(id: string): PhysiologyLessonModule | undefined {
  return HOSPITAL_ADMIN_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getHospitalAdminModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return HOSPITAL_ADMIN_CORE_MODULES.find(m => m.competencies.includes(code));
}
