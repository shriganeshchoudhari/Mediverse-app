/**
 * Master Clinical Immunology & Immunopathology (IMM-201) Learning Catalog
 * Comprehensive modules covering Innate Immunity & PIDs, Gell & Coombs Hypersensitivities, Autoimmunity & HLA, and Flow Cytometry & Biologics
 */

import { INNATE_IMMUNITY_COMPLEMENT_DEFICIENCIES_MODULE } from "./innateImmunityComplementDeficienciesContent";
import { HYPERSENSITIVITY_REACTIONS_TYPES_I_TO_IV_MODULE } from "./hypersensitivityReactionsTypesItoIVContent";
import { AUTOIMMUNITY_HLA_TOLERANCE_BREAKDOWN_MODULE } from "./autoimmunityHlaToleranceBreakdownContent";
import { FLOW_CYTOMETRY_BIOLOGICS_IMMUNOTHERAPY_MODULE } from "./flowCytometryBiologicsImmunotherapyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./innateImmunityComplementDeficienciesContent";
export * from "./hypersensitivityReactionsTypesItoIVContent";
export * from "./autoimmunityHlaToleranceBreakdownContent";
export * from "./flowCytometryBiologicsImmunotherapyContent";

export const IMMUNOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  INNATE_IMMUNITY_COMPLEMENT_DEFICIENCIES_MODULE,
  HYPERSENSITIVITY_REACTIONS_TYPES_I_TO_IV_MODULE,
  AUTOIMMUNITY_HLA_TOLERANCE_BREAKDOWN_MODULE,
  FLOW_CYTOMETRY_BIOLOGICS_IMMUNOTHERAPY_MODULE
];

export function getImmunologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return IMMUNOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getImmunologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return IMMUNOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
