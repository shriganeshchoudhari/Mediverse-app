/**
 * Master Community Medicine & Public Health (COMM-201) Learning Catalog
 * Comprehensive coverage of Epidemiology, Biostatistics, Infectious Dynamics & Demography
 */

import { EPIDEMIOLOGICAL_STUDIES_MODULE } from "./epidemiologicalStudiesContent";
import { BIOSTATISTICS_SCREENING_MODULE } from "./biostatisticsScreeningContent";
import { INFECTIOUS_DISEASE_PUBLIC_HEALTH_MODULE } from "./infectiousDiseasePublicHealthContent";
import { DEMOGRAPHY_HEALTH_ECONOMICS_MODULE } from "./demographyHealthEconomicsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./epidemiologicalStudiesContent";
export * from "./biostatisticsScreeningContent";
export * from "./infectiousDiseasePublicHealthContent";
export * from "./demographyHealthEconomicsContent";

export const COMMUNITY_CORE_MODULES: PhysiologyLessonModule[] = [
  EPIDEMIOLOGICAL_STUDIES_MODULE,
  BIOSTATISTICS_SCREENING_MODULE,
  INFECTIOUS_DISEASE_PUBLIC_HEALTH_MODULE,
  DEMOGRAPHY_HEALTH_ECONOMICS_MODULE
];

export function getCommunityModuleById(id: string): PhysiologyLessonModule | undefined {
  return COMMUNITY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getCommunityModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return COMMUNITY_CORE_MODULES.find(m => m.competencies.includes(code));
}
