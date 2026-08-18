/**
 * Master Obstetrics & Gynecology (OBG-301) Learning Catalog
 * Comprehensive clinical coverage of Labor Mechanics, Partogram, PPH, Preeclampsia & Obstetric Emergencies
 */

import { LABOR_MECHANICS_PARTOGRAM_MODULE } from "./laborMechanicsPartogramContent";
import { POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE } from "./postpartumHemorrhageUterotonicsContent";
import { HYPERTENSIVE_PREGNANCY_PREECLAMPSIA_MODULE } from "./hypertensivePregnancyPreeclampsiaContent";
import { OBSTETRIC_EMERGENCIES_FETAL_HEART_MODULE } from "./obstetricEmergenciesFetalHeartContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./laborMechanicsPartogramContent";
export * from "./postpartumHemorrhageUterotonicsContent";
export * from "./hypertensivePregnancyPreeclampsiaContent";
export * from "./obstetricEmergenciesFetalHeartContent";

export const OBGYN_CORE_MODULES: PhysiologyLessonModule[] = [
  LABOR_MECHANICS_PARTOGRAM_MODULE,
  POSTPARTUM_HEMORRHAGE_UTEROTONICS_MODULE,
  HYPERTENSIVE_PREGNANCY_PREECLAMPSIA_MODULE,
  OBSTETRIC_EMERGENCIES_FETAL_HEART_MODULE
];

export function getObgynModuleById(id: string): PhysiologyLessonModule | undefined {
  return OBGYN_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getObgynModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return OBGYN_CORE_MODULES.find(m => m.competencies.includes(code));
}
