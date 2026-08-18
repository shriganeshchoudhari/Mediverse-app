/**
 * Master Internship Core Clinical Postings: Maternal, Neonatal & Pediatric Emergencies (INT-503) Learning Catalog
 * Comprehensive modules covering Obstetric Emergencies (PPH & Eclampsia), Neonatal Resuscitation Program (NRP 2025), Pediatric Advanced Life Support (PALS 2025), and Pediatric Status Epilepticus & Airway Obstruction
 */

import { POSTPARTUM_HEMORRHAGE_ECLAMPSIA_MODULE } from "./postpartumHemorrhageEclampsiaContent";
import { NEONATAL_RESUSCITATION_NRP_MODULE } from "./neonatalResuscitationNrpContent";
import { PEDIATRIC_ADVANCED_LIFE_SUPPORT_PALS_MODULE } from "./pediatricAdvancedLifeSupportPalsContent";
import { PEDIATRIC_STATUS_EPILEPTICUS_AIRWAY_MODULE } from "./pediatricStatusEpilepticusAirwayContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./postpartumHemorrhageEclampsiaContent";
export * from "./neonatalResuscitationNrpContent";
export * from "./pediatricAdvancedLifeSupportPalsContent";
export * from "./pediatricStatusEpilepticusAirwayContent";

export const INT3_CORE_MODULES: PhysiologyLessonModule[] = [
  POSTPARTUM_HEMORRHAGE_ECLAMPSIA_MODULE,
  NEONATAL_RESUSCITATION_NRP_MODULE,
  PEDIATRIC_ADVANCED_LIFE_SUPPORT_PALS_MODULE,
  PEDIATRIC_STATUS_EPILEPTICUS_AIRWAY_MODULE
];

export function getInt3ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT3_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt3ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT3_CORE_MODULES.find(m => m.competencies.includes(code));
}
