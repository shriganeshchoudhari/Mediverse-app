/**
 * Master Advanced Obstetrics, High-Risk Perinatology & Gynecologic Oncology (OBG-301) Learning Catalog
 * Comprehensive modules covering Preeclampsia/Eclampsia, PPH Uterotonics, Electronic Fetal Monitoring, and Gynecologic Oncology
 */

import { PREECLAMPSIA_ECLAMPSIA_PROTOCOLS_MODULE } from "./preeclampsiaEclampsiaProtocolsContent";
import { POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE } from "./postpartumHemorrhageUterotonicsContent";
import { ELECTRONIC_FETAL_MONITORING_CATEGORIES_MODULE } from "./electronicFetalMonitoringCategoriesContent";
import { GYNECOLOGIC_ONCOLOGY_PELVIC_MALIGNANCIES_MODULE } from "./gynecologicOncologyPelvicMalignanciesContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./preeclampsiaEclampsiaProtocolsContent";
export * from "./postpartumHemorrhageUterotonicsContent";
export * from "./electronicFetalMonitoringCategoriesContent";
export * from "./gynecologicOncologyPelvicMalignanciesContent";

export const OBGYN_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  PREECLAMPSIA_ECLAMPSIA_PROTOCOLS_MODULE,
  POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE,
  ELECTRONIC_FETAL_MONITORING_CATEGORIES_MODULE,
  GYNECOLOGIC_ONCOLOGY_PELVIC_MALIGNANCIES_MODULE
];

export function getObgynAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return OBGYN_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getObgynAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return OBGYN_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
