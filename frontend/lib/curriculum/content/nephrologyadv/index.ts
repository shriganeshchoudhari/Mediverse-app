/**
 * Master Clinical Nephrology & Acid-Base Electrophysiology (NEPH-301) Learning Catalog
 * Comprehensive modules covering Glomerulopathies, Acute Kidney Injury, Renal Tubular Acidoses, and Sodium/Potassium Electrophysiology
 */

import { GLOMERULOPATHIES_NEPHRITIC_NEPHROTIC_MODULE } from "./glomerulopathiesNephriticNephroticContent";
import { ACUTE_KIDNEY_INJURY_URINALYSIS_MODULE } from "./acuteKidneyInjuryUrinalysisContent";
import { RENAL_TUBULAR_ACIDOSES_ELECTROLYTES_MODULE } from "./renalTubularAcidosesElectrolytesContent";
import { SODIUM_POTASSIUM_ELECTROPHYSIOLOGY_MODULE } from "./sodiumPotassiumElectrophysiologyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./glomerulopathiesNephriticNephroticContent";
export * from "./acuteKidneyInjuryUrinalysisContent";
export * from "./renalTubularAcidosesElectrolytesContent";
export * from "./sodiumPotassiumElectrophysiologyContent";

export const NEPHROLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  GLOMERULOPATHIES_NEPHRITIC_NEPHROTIC_MODULE,
  ACUTE_KIDNEY_INJURY_URINALYSIS_MODULE,
  RENAL_TUBULAR_ACIDOSES_ELECTROLYTES_MODULE,
  SODIUM_POTASSIUM_ELECTROPHYSIOLOGY_MODULE
];

export function getNephrologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return NEPHROLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getNephrologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return NEPHROLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
