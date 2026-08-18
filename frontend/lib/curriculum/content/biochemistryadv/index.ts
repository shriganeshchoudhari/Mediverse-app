/**
 * Master Clinical Biochemistry & Inborn Errors of Metabolism (BIO-201 Advanced) Learning Catalog
 * Comprehensive modules covering Aminoacidopathies, Glycogen Storage Diseases, Lysosomal Storage Disorders, and Porphyrias & Urea Cycle Disorders
 */

import { AMINOACIDOPATHIES_ORGANIC_ACIDEMIAS_MODULE } from "./aminoacidopathiesOrganicAcidemiasContent";
import { GLYCOGEN_STORAGE_DISEASES_GLUCONEOGENESIS_MODULE } from "./glycogenStorageDiseasesGluconeogenesisContent";
import { LYSOSOMAL_STORAGE_DISORDERS_SPHINGOLIPIDOSES_MODULE } from "./lysosomalStorageDisordersSphingolipidosesContent";
import { PORPHYRIAS_HEME_SYNTHESIS_UREA_CYCLE_MODULE } from "./porphyriasHemeSynthesisUreaCycleContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./aminoacidopathiesOrganicAcidemiasContent";
export * from "./glycogenStorageDiseasesGluconeogenesisContent";
export * from "./lysosomalStorageDisordersSphingolipidosesContent";
export * from "./porphyriasHemeSynthesisUreaCycleContent";

export const BIOCHEMISTRY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  AMINOACIDOPATHIES_ORGANIC_ACIDEMIAS_MODULE,
  GLYCOGEN_STORAGE_DISEASES_GLUCONEOGENESIS_MODULE,
  LYSOSOMAL_STORAGE_DISORDERS_SPHINGOLIPIDOSES_MODULE,
  PORPHYRIAS_HEME_SYNTHESIS_UREA_CYCLE_MODULE
];

export function getBiochemistryAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getBiochemistryAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return BIOCHEMISTRY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
