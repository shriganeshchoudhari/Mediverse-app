/**
 * Master Pediatrics & Neonatology (PED-301) Learning Catalog
 * Comprehensive clinical coverage of Developmental Milestones, Jaundice, NRP & Dehydration
 */

import { DEVELOPMENTAL_MILESTONES_GROWTH_MODULE } from "./developmentalMilestonesGrowthContent";
import { NEONATAL_JAUNDICE_PHOTOTHERAPY_MODULE } from "./neonatalJaundicePhototherapyContent";
import { NEONATAL_RESUSCITATION_RDS_MODULE } from "./neonatalResuscitationRdsContent";
import { PEDIATRIC_INFECTIONS_DEHYDRATION_MODULE } from "./pediatricInfectionsDehydrationContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./developmentalMilestonesGrowthContent";
export * from "./neonatalJaundicePhototherapyContent";
export * from "./neonatalResuscitationRdsContent";
export * from "./pediatricInfectionsDehydrationContent";

export const PEDIATRICS_CORE_MODULES: PhysiologyLessonModule[] = [
  DEVELOPMENTAL_MILESTONES_GROWTH_MODULE,
  NEONATAL_JAUNDICE_PHOTOTHERAPY_MODULE,
  NEONATAL_RESUSCITATION_RDS_MODULE,
  PEDIATRIC_INFECTIONS_DEHYDRATION_MODULE
];

export function getPediatricsModuleById(id: string): PhysiologyLessonModule | undefined {
  return PEDIATRICS_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPediatricsModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PEDIATRICS_CORE_MODULES.find(m => m.competencies.includes(code));
}
