/**
 * Master Postgraduate Advanced Pediatrics & Neonatal Intensive Care (PG-604) Learning Catalog
 * Comprehensive modules covering Neonatal HIE & Therapeutic Hypothermia, PPHN & iNO, Extreme Prematurity & LISA, and Pediatric Septic Shock & VIS
 */

import { NEONATAL_HIE_THERAPEUTIC_HYPOTHERMIA_MODULE } from "./neonatalHieTherapeuticHypothermiaContent";
import { PPHN_INHALED_NITRIC_OXIDE_ECMO_MODULE } from "./pphnInhaledNitricOxideEcmoContent";
import { EXTREME_PREMATURITY_LISA_SURFACTANT_BPD_MODULE } from "./extremePrematurityLisaSurfactantBpdContent";
import { PEDIATRIC_SEPTIC_SHOCK_VASOACTIVE_SCORES_MODULE } from "./pediatricSepticShockVasoactiveScoresContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./neonatalHieTherapeuticHypothermiaContent";
export * from "./pphnInhaledNitricOxideEcmoContent";
export * from "./extremePrematurityLisaSurfactantBpdContent";
export * from "./pediatricSepticShockVasoactiveScoresContent";

export const PG4_CORE_MODULES: PhysiologyLessonModule[] = [
  NEONATAL_HIE_THERAPEUTIC_HYPOTHERMIA_MODULE,
  PPHN_INHALED_NITRIC_OXIDE_ECMO_MODULE,
  EXTREME_PREMATURITY_LISA_SURFACTANT_BPD_MODULE,
  PEDIATRIC_SEPTIC_SHOCK_VASOACTIVE_SCORES_MODULE
];

export function getPg4ModuleById(id: string): PhysiologyLessonModule | undefined {
  return PG4_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPg4ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PG4_CORE_MODULES.find(m => m.competencies.includes(code));
}
