/**
 * Master Otorhinolaryngology / ENT (ENT-301) Learning Catalog
 * Comprehensive clinical coverage of Audiometry, Otology, Epistaxis & Airway
 */

import { AUDIOMETRY_TUNING_FORK_MODULE } from "./audiometryTuningForkHearingContent";
import { OTOLOGY_OTITIS_CHOLESTEATOMA_MODULE } from "./otologyOtitisCholesteatomaContent";
import { RHINOLOGY_EPISTAXIS_SINUSITIS_MODULE } from "./rhinologyEpistaxisSinusitisContent";
import { PHARYNGOLOGY_AIRWAY_TRACHEOSTOMY_MODULE } from "./pharyngologyAirwayTracheostomyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./audiometryTuningForkHearingContent";
export * from "./otologyOtitisCholesteatomaContent";
export * from "./rhinologyEpistaxisSinusitisContent";
export * from "./pharyngologyAirwayTracheostomyContent";

export const ENT_CORE_MODULES: PhysiologyLessonModule[] = [
  AUDIOMETRY_TUNING_FORK_MODULE,
  OTOLOGY_OTITIS_CHOLESTEATOMA_MODULE,
  RHINOLOGY_EPISTAXIS_SINUSITIS_MODULE,
  PHARYNGOLOGY_AIRWAY_TRACHEOSTOMY_MODULE
];

export function getEntModuleById(id: string): PhysiologyLessonModule | undefined {
  return ENT_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEntModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ENT_CORE_MODULES.find(m => m.competencies.includes(code));
}
