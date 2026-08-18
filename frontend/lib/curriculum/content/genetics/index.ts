/**
 * Master Medical Genetics & Genomics (GEN-201) Learning Catalog
 * Comprehensive modules covering Aneuploidies, Mendelian Inheritance, Epigenetic Imprinting, and Molecular Diagnostics
 */

import { CHROMOSOMAL_ANEUPLOIDIES_REARRANGEMENTS_MODULE } from "./chromosomalAneuploidiesRearrangementsContent";
import { MENDELIAN_INHERITANCE_PATTERNS_MODULE } from "./mendelianInheritancePatternsContent";
import { EPIGENETICS_IMPRINTING_TRINUCLEOTIDE_MODULE } from "./epigeneticsImprintingTrinucleotideContent";
import { MOLECULAR_DIAGNOSTICS_GENETIC_COUNSELING_MODULE } from "./molecularDiagnosticsGeneticCounselingContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./chromosomalAneuploidiesRearrangementsContent";
export * from "./mendelianInheritancePatternsContent";
export * from "./epigeneticsImprintingTrinucleotideContent";
export * from "./molecularDiagnosticsGeneticCounselingContent";

export const GENETICS_CORE_MODULES: PhysiologyLessonModule[] = [
  CHROMOSOMAL_ANEUPLOIDIES_REARRANGEMENTS_MODULE,
  MENDELIAN_INHERITANCE_PATTERNS_MODULE,
  EPIGENETICS_IMPRINTING_TRINUCLEOTIDE_MODULE,
  MOLECULAR_DIAGNOSTICS_GENETIC_COUNSELING_MODULE
];

export function getGeneticsModuleById(id: string): PhysiologyLessonModule | undefined {
  return GENETICS_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getGeneticsModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return GENETICS_CORE_MODULES.find(m => m.competencies.includes(code));
}
