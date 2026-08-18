/**
 * Master Pediatric Pathophysiology & Neonatal Intensive Care (PEDS-301) Learning Catalog
 * Comprehensive modules covering Congenital Heart Defects, Neonatal Respiratory Distress, Pediatric GI Emergencies, and Immunodeficiencies/Metabolic
 */

import { CONGENITAL_HEART_DEFECTS_SHUNTS_MODULE } from "./congenitalHeartDefectsShuntsContent";
import { NEONATAL_RESPIRATORY_DISTRESS_NICU_MODULE } from "./neonatalRespiratoryDistressNicuContent";
import { PEDIATRIC_GASTROINTESTINAL_EMERGENCIES_MODULE } from "./pediatricGastrointestinalEmergenciesContent";
import { PEDIATRIC_IMMUNODEFICIENCY_METABOLIC_MODULE } from "./pediatricImmunodeficiencyMetabolicContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./congenitalHeartDefectsShuntsContent";
export * from "./neonatalRespiratoryDistressNicuContent";
export * from "./pediatricGastrointestinalEmergenciesContent";
export * from "./pediatricImmunodeficiencyMetabolicContent";

export const PEDIATRICS_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  CONGENITAL_HEART_DEFECTS_SHUNTS_MODULE,
  NEONATAL_RESPIRATORY_DISTRESS_NICU_MODULE,
  PEDIATRIC_GASTROINTESTINAL_EMERGENCIES_MODULE,
  PEDIATRIC_IMMUNODEFICIENCY_METABOLIC_MODULE
];

export function getPediatricsAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return PEDIATRICS_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPediatricsAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PEDIATRICS_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
