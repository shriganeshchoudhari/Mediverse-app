/**
 * Master Internship Core Clinical Postings: Elective Rotations & Subspecialty Postings (INT-507) Learning Catalog
 * Comprehensive modules covering Inpatient Dermatology (SJS/TEN & Erythroderma), Emergency Psychiatry (NMS & Serotonin Syndrome), Ophthalmic Emergencies (Glaucoma & CRAO), and ENT Emergencies (Epistaxis & Quinsy)
 */

import { INPATIENT_DERMATOLOGY_SJS_TEN_MODULE } from "./inpatientDermatologySjsTenContent";
import { EMERGENCY_PSYCHIATRY_NMS_SEROTONIN_MODULE } from "./emergencyPsychiatryNmsSerotoninContent";
import { OPHTHALMIC_EMERGENCIES_GLAUCOMA_CRAO_MODULE } from "./ophthalmicEmergenciesGlaucomaCraoContent";
import { ENT_EMERGENCIES_EPISTAXIS_QUINSY_MODULE } from "./entEmergenciesEpistaxisQuinsyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./inpatientDermatologySjsTenContent";
export * from "./emergencyPsychiatryNmsSerotoninContent";
export * from "./ophthalmicEmergenciesGlaucomaCraoContent";
export * from "./entEmergenciesEpistaxisQuinsyContent";

export const INT7_CORE_MODULES: PhysiologyLessonModule[] = [
  INPATIENT_DERMATOLOGY_SJS_TEN_MODULE,
  EMERGENCY_PSYCHIATRY_NMS_SEROTONIN_MODULE,
  OPHTHALMIC_EMERGENCIES_GLAUCOMA_CRAO_MODULE,
  ENT_EMERGENCIES_EPISTAXIS_QUINSY_MODULE
];

export function getInt7ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT7_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt7ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT7_CORE_MODULES.find(m => m.competencies.includes(code));
}
