/**
 * Master Clinical Forensic Pathology & Legal Toxicology (FOR-301) Learning Catalog
 * Comprehensive modules covering Thanatology/PMI, Ballistics/GSWs, Mechanical Asphyxia, and Autopsy Toxicology
 */

import { THANATOLOGY_POSTMORTEM_INTERVAL_MODULE } from "./thanatologyPostmortemIntervalContent";
import { FORENSIC_BALLISTICS_GUNSHOT_WOUNDS_MODULE } from "./forensicBallisticsGunshotWoundsContent";
import { MECHANICAL_ASPHYXIA_NECK_TRAUMA_MODULE } from "./mechanicalAsphyxiaNeckTraumaContent";
import { FORENSIC_TOXICOLOGY_FATAL_POISONS_MODULE } from "./forensicToxicologyFatalPoisonsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./thanatologyPostmortemIntervalContent";
export * from "./forensicBallisticsGunshotWoundsContent";
export * from "./mechanicalAsphyxiaNeckTraumaContent";
export * from "./forensicToxicologyFatalPoisonsContent";

export const FORENSIC_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  THANATOLOGY_POSTMORTEM_INTERVAL_MODULE,
  FORENSIC_BALLISTICS_GUNSHOT_WOUNDS_MODULE,
  MECHANICAL_ASPHYXIA_NECK_TRAUMA_MODULE,
  FORENSIC_TOXICOLOGY_FATAL_POISONS_MODULE
];

export function getForensicAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return FORENSIC_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getForensicAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return FORENSIC_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
