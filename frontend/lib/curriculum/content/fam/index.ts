/**
 * Master Family Medicine & Primary Care Postings (FAM-401) Learning Catalog
 * Comprehensive modules covering Preventive Screening & USPSTF, Chronic Disease Protocols, Geriatric Assessment & Beers, and Outpatient Triage & Red Flags
 */

import { PREVENTIVE_SCREENING_USPSTF_MODULE } from "./preventiveScreeningUspstfContent";
import { CHRONIC_DISEASE_PROTOCOLS_MODULE } from "./chronicDiseaseProtocolsContent";
import { GERIATRIC_ASSESSMENT_BEERS_MODULE } from "./geriatricAssessmentBeersContent";
import { OUTPATIENT_TRIAGE_RED_FLAGS_MODULE } from "./outpatientTriageRedFlagsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./preventiveScreeningUspstfContent";
export * from "./chronicDiseaseProtocolsContent";
export * from "./geriatricAssessmentBeersContent";
export * from "./outpatientTriageRedFlagsContent";

export const FAM_CORE_MODULES: PhysiologyLessonModule[] = [
  PREVENTIVE_SCREENING_USPSTF_MODULE,
  CHRONIC_DISEASE_PROTOCOLS_MODULE,
  GERIATRIC_ASSESSMENT_BEERS_MODULE,
  OUTPATIENT_TRIAGE_RED_FLAGS_MODULE
];

export function getFamModuleById(id: string): PhysiologyLessonModule | undefined {
  return FAM_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getFamModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return FAM_CORE_MODULES.find(m => m.competencies.includes(code));
}
