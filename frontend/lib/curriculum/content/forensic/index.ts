/**
 * Master Forensic Medicine & Toxicology (FOR-201) Learning Catalog
 * Comprehensive coverage of Thanatology, Traumatology, Toxicology, and Jurisprudence
 */

import { THANATOLOGY_POSTMORTEM_MODULE } from "./thanatologyPostMortemContent";
import { TRAUMATOLOGY_MECHANICAL_WOUNDS_MODULE } from "./traumatologyMechanicalWoundsContent";
import { FORENSIC_TOXICOLOGY_POISONS_MODULE } from "./forensicToxicologyPoisonsContent";
import { MEDICAL_JURISPRUDENCE_AUTOPSY_MODULE } from "./medicalJurisprudenceAutopsyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./thanatologyPostMortemContent";
export * from "./traumatologyMechanicalWoundsContent";
export * from "./forensicToxicologyPoisonsContent";
export * from "./medicalJurisprudenceAutopsyContent";

export const FORENSIC_CORE_MODULES: PhysiologyLessonModule[] = [
  THANATOLOGY_POSTMORTEM_MODULE,
  TRAUMATOLOGY_MECHANICAL_WOUNDS_MODULE,
  FORENSIC_TOXICOLOGY_POISONS_MODULE,
  MEDICAL_JURISPRUDENCE_AUTOPSY_MODULE
];

export function getForensicModuleById(id: string): PhysiologyLessonModule | undefined {
  return FORENSIC_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getForensicModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return FORENSIC_CORE_MODULES.find(m => m.competencies.includes(code));
}
