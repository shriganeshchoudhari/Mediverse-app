/**
 * Master Clinical Diagnostic Radiology & Interventional Protocols (RAD-301) Learning Catalog
 * Comprehensive modules covering Contrast Media CIN/NSF, HRCT Chest Patterns, Acute Abdomen CT, and Interventional Radiology
 */

import { CONTRAST_MEDIA_CIN_NSF_PROTOCOLS_MODULE } from "./contrastMediaCinNsfProtocolsContent";
import { HRCT_CHEST_PATTERNS_PATHOLOGY_MODULE } from "./hrctChestPatternsPathologyContent";
import { ACUTE_ABDOMEN_EMERGENCY_CT_MODULE } from "./acuteAbdomenEmergencyCtContent";
import { INTERVENTIONAL_RADIOLOGY_PROCEDURES_MODULE } from "./interventionalRadiologyProceduresContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./contrastMediaCinNsfProtocolsContent";
export * from "./hrctChestPatternsPathologyContent";
export * from "./acuteAbdomenEmergencyCtContent";
export * from "./interventionalRadiologyProceduresContent";

export const RADIOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  CONTRAST_MEDIA_CIN_NSF_PROTOCOLS_MODULE,
  HRCT_CHEST_PATTERNS_PATHOLOGY_MODULE,
  ACUTE_ABDOMEN_EMERGENCY_CT_MODULE,
  INTERVENTIONAL_RADIOLOGY_PROCEDURES_MODULE
];

export function getRadiologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return RADIOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getRadiologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return RADIOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
