/**
 * Master Clinical Hematology, Hemostasis & Oncology (HEM-301) Learning Catalog
 * Comprehensive modules covering Coagulation Cascades, Anemia Diagnostic Algorithms, Leukemias & MPNs, and Plasma Cell Dyscrasias & Lymphomas
 */

import { COAGULATION_CASCADE_HEMOSTASIS_MODULE } from "./coagulationCascadeHemostasisContent";
import { ANEMIA_ALGORITHMIC_PROFILING_MODULE } from "./anemiaAlgorithmicProfilingContent";
import { LEUKEMIAS_MYELOPROLIFERATIVE_MODULE } from "./leukemiasMyeloproliferativeContent";
import { PLASMA_CELL_DYSCRASIAS_LYMPHOMAS_MODULE } from "./plasmaCellDyscrasiasLymphomasContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./coagulationCascadeHemostasisContent";
export * from "./anemiaAlgorithmicProfilingContent";
export * from "./leukemiasMyeloproliferativeContent";
export * from "./plasmaCellDyscrasiasLymphomasContent";

export const HEMATOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  COAGULATION_CASCADE_HEMOSTASIS_MODULE,
  ANEMIA_ALGORITHMIC_PROFILING_MODULE,
  LEUKEMIAS_MYELOPROLIFERATIVE_MODULE,
  PLASMA_CELL_DYSCRASIAS_LYMPHOMAS_MODULE
];

export function getHematologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return HEMATOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getHematologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return HEMATOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
