/**
 * Master Advanced General, Laparoscopic & Surgical Oncology (SUR-301) Learning Catalog
 * Comprehensive modules covering Acute Abdomen & SBO, Laparoscopic Biliary CVS, GI Hemorrhage & Perforation, and Surgical Oncology Staging
 */

import { ACUTE_ABDOMEN_BOWEL_OBSTRUCTION_MODULE } from "./acuteAbdomenBowelObstructionContent";
import { LAPAROSCOPIC_BILIARY_CRITICAL_VIEW_MODULE } from "./laparoscopicBiliaryCriticalViewContent";
import { GI_HEMORRHAGE_ULCER_PERFORATION_MODULE } from "./giHemorrhageUlcerPerforationContent";
import { SURGICAL_ONCOLOGY_LYMPHATIC_STAGING_MODULE } from "./surgicalOncologyLymphaticStagingContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./acuteAbdomenBowelObstructionContent";
export * from "./laparoscopicBiliaryCriticalViewContent";
export * from "./giHemorrhageUlcerPerforationContent";
export * from "./surgicalOncologyLymphaticStagingContent";

export const SURGERY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ACUTE_ABDOMEN_BOWEL_OBSTRUCTION_MODULE,
  LAPAROSCOPIC_BILIARY_CRITICAL_VIEW_MODULE,
  GI_HEMORRHAGE_ULCER_PERFORATION_MODULE,
  SURGICAL_ONCOLOGY_LYMPHATIC_STAGING_MODULE
];

export function getSurgeryAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return SURGERY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getSurgeryAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return SURGERY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
