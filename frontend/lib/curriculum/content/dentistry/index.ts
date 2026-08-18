/**
 * Master Dentistry & Maxillofacial Surgery (DENT-301) Learning Catalog
 * Comprehensive modules covering Dental Anatomy, Ludwig's Angina, Le Fort Fractures, Mandibular Fractures, Ameloblastoma & TMJ Disorders
 */

import { DENTAL_ANATOMY_ERUPTION_NOTATION_MODULE } from "./dentalAnatomyEruptionNotationContent";
import { ODONTOGENIC_INFECTIONS_FASCIAL_SPACES_MODULE } from "./odontogenicInfectionsFascialSpacesContent";
import { MAXILLOFACIAL_TRAUMA_LE_FORT_FRACTURES_MODULE } from "./maxillofacialTraumaLeFortFracturesContent";
import { ORAL_PATHOLOGY_PREMALIGNANCY_TMJ_MODULE } from "./oralPathologyPremalignancyTmjoContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./dentalAnatomyEruptionNotationContent";
export * from "./odontogenicInfectionsFascialSpacesContent";
export * from "./maxillofacialTraumaLeFortFracturesContent";
export * from "./oralPathologyPremalignancyTmjoContent";

export const DENTISTRY_CORE_MODULES: PhysiologyLessonModule[] = [
  DENTAL_ANATOMY_ERUPTION_NOTATION_MODULE,
  ODONTOGENIC_INFECTIONS_FASCIAL_SPACES_MODULE,
  MAXILLOFACIAL_TRAUMA_LE_FORT_FRACTURES_MODULE,
  ORAL_PATHOLOGY_PREMALIGNANCY_TMJ_MODULE
];

export function getDentistryModuleById(id: string): PhysiologyLessonModule | undefined {
  return DENTISTRY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getDentistryModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return DENTISTRY_CORE_MODULES.find(m => m.competencies.includes(code));
}
