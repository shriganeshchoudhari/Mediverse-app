/**
 * Master Advanced Otolaryngology & Head/Neck Surgical Oncology (ENT-301) Learning Catalog
 * Comprehensive modules covering Deep Neck Space Infections, Vestibular Neurotology, Cholesteatoma & Otosclerosis, and Head/Neck Oncology
 */

import { DEEP_NECK_SPACE_AIRWAY_INFECTIONS_MODULE } from "./deepNeckSpaceAirwayInfectionsContent";
import { VESTIBULAR_AUDIOLOGY_NEUROMA_MODULE } from "./vestibularAudiologyNeuromaContent";
import { CHOLESTEATOMA_OTOSCLEROSIS_MODULE } from "./cholesteatomaOtosclerosisContent";
import { HEAD_NECK_ONCOLOGY_NECK_DISSECTIONS_MODULE } from "./headNeckOncologyNeckDissectionsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./deepNeckSpaceAirwayInfectionsContent";
export * from "./vestibularAudiologyNeuromaContent";
export * from "./cholesteatomaOtosclerosisContent";
export * from "./headNeckOncologyNeckDissectionsContent";

export const ENT_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  DEEP_NECK_SPACE_AIRWAY_INFECTIONS_MODULE,
  VESTIBULAR_AUDIOLOGY_NEUROMA_MODULE,
  CHOLESTEATOMA_OTOSCLEROSIS_MODULE,
  HEAD_NECK_ONCOLOGY_NECK_DISSECTIONS_MODULE
];

export function getEntAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return ENT_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEntAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ENT_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
