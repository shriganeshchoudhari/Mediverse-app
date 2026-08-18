/**
 * Master Medical Biochemistry (BIOC-101) Learning Catalog
 * Comprehensive coverage of Carbohydrates, Lipids/Lipoproteins, Amino Acids, and Genetics
 */

import { CARBOHYDRATE_METABOLISM_MODULE } from "./carbohydrateMetabolismContent";
import { LIPID_LIPOPROTEIN_MODULE } from "./lipidLipoproteinContent";
import { AMINO_ACID_METABOLISM_MODULE } from "./aminoAcidMetabolismContent";
import { MOLECULAR_GENETICS_MODULE } from "./molecularGeneticsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./carbohydrateMetabolismContent";
export * from "./lipidLipoproteinContent";
export * from "./aminoAcidMetabolismContent";
export * from "./molecularGeneticsContent";

export const BIOCHEMISTRY_CORE_MODULES: PhysiologyLessonModule[] = [
  CARBOHYDRATE_METABOLISM_MODULE,
  LIPID_LIPOPROTEIN_MODULE,
  AMINO_ACID_METABOLISM_MODULE,
  MOLECULAR_GENETICS_MODULE
];

export function getBiochemistryModuleById(id: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getBiochemistryModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY_CORE_MODULES.find(m => m.competencies.includes(code));
}
