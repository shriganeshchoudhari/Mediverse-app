/**
 * Master Infectious Diseases & Antimicrobial Stewardship (ID-301) Learning Catalog
 * Comprehensive modules covering Sepsis-3 & Surviving Sepsis Bundle, FUO & Tropical Fevers, MDR ESKAPE Pathogens, and Antimicrobial Stewardship & AWaRe
 */

import { SEPSIS_DEFINITIONS_SURVIVING_SEPSIS_BUNDLE_MODULE } from "./sepsisDefinitionsSurvivingSepsisBundleContent";
import { FEVER_UNKNOWN_ORIGIN_TROPICAL_FEVERS_MODULE } from "./feverUnknownOriginTropicalFeversContent";
import { MDR_PATHOGENS_ESKAPE_DIAGNOSTICS_MODULE } from "./mdrPathogensEskapeDiagnosticsContent";
import { ANTIMICROBIAL_STEWARDSHIP_AWARE_FRAMEWORK_MODULE } from "./antimicrobialStewardshipAwareFrameworkContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./sepsisDefinitionsSurvivingSepsisBundleContent";
export * from "./feverUnknownOriginTropicalFeversContent";
export * from "./mdrPathogensEskapeDiagnosticsContent";
export * from "./antimicrobialStewardshipAwareFrameworkContent";

export const INFECTIOUS_DISEASES_CORE_MODULES: PhysiologyLessonModule[] = [
  SEPSIS_DEFINITIONS_SURVIVING_SEPSIS_BUNDLE_MODULE,
  FEVER_UNKNOWN_ORIGIN_TROPICAL_FEVERS_MODULE,
  MDR_PATHOGENS_ESKAPE_DIAGNOSTICS_MODULE,
  ANTIMICROBIAL_STEWARDSHIP_AWARE_FRAMEWORK_MODULE
];

export function getInfectiousDiseaseModuleById(id: string): PhysiologyLessonModule | undefined {
  return INFECTIOUS_DISEASES_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInfectiousDiseaseModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INFECTIOUS_DISEASES_CORE_MODULES.find(m => m.competencies.includes(code));
}
