/**
 * Master Physical Medicine & Rehabilitation (PMR-401 / PMR-301) Learning Catalog
 * Comprehensive clinical coverage of Stroke Neuro-Rehab, SCI ASIA Scale, Prosthetics K-Levels & Gait Biomechanics
 */

import { STROKE_NEURO_REHAB_BRUNNSTROM_MODULE } from "./strokeNeuroRehabBrunnstromContent";
import { SPINAL_CORD_INJURY_ASIA_AUTONOMIC_MODULE } from "./spinalCordInjuryAsiaAutonomicContent";
import { PROSTHETICS_ORTHOTICS_K_LEVELS_MODULE } from "./prostheticsOrthoticsKLevelsContent";
import { GAIT_CYCLE_BIOMECHANICS_PATHOLOGY_MODULE } from "./gaitCycleBiomechanicsPathologyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./strokeNeuroRehabBrunnstromContent";
export * from "./spinalCordInjuryAsiaAutonomicContent";
export * from "./prostheticsOrthoticsKLevelsContent";
export * from "./gaitCycleBiomechanicsPathologyContent";

export const PMR_CORE_MODULES: PhysiologyLessonModule[] = [
  STROKE_NEURO_REHAB_BRUNNSTROM_MODULE,
  SPINAL_CORD_INJURY_ASIA_AUTONOMIC_MODULE,
  PROSTHETICS_ORTHOTICS_K_LEVELS_MODULE,
  GAIT_CYCLE_BIOMECHANICS_PATHOLOGY_MODULE
];

export function getPmrModuleById(id: string): PhysiologyLessonModule | undefined {
  return PMR_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPmrModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PMR_CORE_MODULES.find(m => m.competencies.includes(code));
}
