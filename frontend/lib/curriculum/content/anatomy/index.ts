/**
 * Master Human Anatomy & Histology (ANAT-101) Learning Catalog
 * Comprehensive coverage of Gross Anatomy, Regional Dissection, and Histology mapped to NMC CBME
 */

import { BRACHIAL_PLEXUS_MODULE } from "./brachialPlexusContent";
import { LOWER_LIMB_MODULE } from "./lowerLimbContent";
import { THORAX_MEDIASTINUM_MODULE } from "./thoraxMediastinumContent";
import { ABDOMEN_INGUINAL_MODULE } from "./abdomenInguinalContent";
import { HEAD_NECK_MODULE } from "./headNeckNeuroContent";
import { HISTOLOGY_MODULE } from "./histologyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./brachialPlexusContent";
export * from "./lowerLimbContent";
export * from "./thoraxMediastinumContent";
export * from "./abdomenInguinalContent";
export * from "./headNeckNeuroContent";
export * from "./histologyContent";

export const ANATOMY_CORE_MODULES: PhysiologyLessonModule[] = [
  BRACHIAL_PLEXUS_MODULE,
  LOWER_LIMB_MODULE,
  THORAX_MEDIASTINUM_MODULE,
  ABDOMEN_INGUINAL_MODULE,
  HEAD_NECK_MODULE,
  HISTOLOGY_MODULE
];

export function getAnatomyModuleById(id: string): PhysiologyLessonModule | undefined {
  return ANATOMY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getAnatomyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ANATOMY_CORE_MODULES.find(m => m.competencies.includes(code));
}
