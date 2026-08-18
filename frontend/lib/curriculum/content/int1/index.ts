/**
 * Master Internship Core Clinical Postings: Emergency & Critical Care (INT-501) Learning Catalog
 * Comprehensive modules covering ACLS 2025 Pathways, Sepsis-3 Resuscitation, Trauma ATLS & FAST, and Rapid Sequence Intubation (7 Ps)
 */

import { ACLS_PATHWAYS_ARREST_MODULE } from "./aclsPathwaysArrestContent";
import { SEPSIS3_RESUSCITATION_BUNDLE_MODULE } from "./sepsis3ResuscitationBundleContent";
import { TRAUMA_ATLS_FAST_EXAM_MODULE } from "./traumaAtlsFastExamContent";
import { RAPID_SEQUENCE_INTUBATION_7PS_MODULE } from "./rapidSequenceIntubation7PsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./aclsPathwaysArrestContent";
export * from "./sepsis3ResuscitationBundleContent";
export * from "./traumaAtlsFastExamContent";
export * from "./rapidSequenceIntubation7PsContent";

export const INT1_CORE_MODULES: PhysiologyLessonModule[] = [
  ACLS_PATHWAYS_ARREST_MODULE,
  SEPSIS3_RESUSCITATION_BUNDLE_MODULE,
  TRAUMA_ATLS_FAST_EXAM_MODULE,
  RAPID_SEQUENCE_INTUBATION_7PS_MODULE
];

export function getInt1ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT1_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt1ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT1_CORE_MODULES.find(m => m.competencies.includes(code));
}
