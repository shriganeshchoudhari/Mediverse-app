/**
 * Master General Medicine (MED-301) Learning Catalog
 * Comprehensive clinical coverage of Cardiology, Pulmonology, Nephrology & Endocrinology
 */

import { CARDIOLOGY_INTERNAL_MEDICINE_MODULE } from "./cardiologyInternalMedicineContent";
import { PULMONOLOGY_INTERNAL_MEDICINE_MODULE } from "./pulmonologyInternalMedicineContent";
import { NEPHROLOGY_ACIDBASE_MODULE } from "./nephrologyAcidBaseContent";
import { ENDOCRINOLOGY_METABOLISM_MODULE } from "./endocrinologyMetabolismContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cardiologyInternalMedicineContent";
export * from "./pulmonologyInternalMedicineContent";
export * from "./nephrologyAcidBaseContent";
export * from "./endocrinologyMetabolismContent";

export const MEDICINE_CORE_MODULES: PhysiologyLessonModule[] = [
  CARDIOLOGY_INTERNAL_MEDICINE_MODULE,
  PULMONOLOGY_INTERNAL_MEDICINE_MODULE,
  NEPHROLOGY_ACIDBASE_MODULE,
  ENDOCRINOLOGY_METABOLISM_MODULE
];

export function getMedicineModuleById(id: string): PhysiologyLessonModule | undefined {
  return MEDICINE_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getMedicineModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return MEDICINE_CORE_MODULES.find(m => m.competencies.includes(code));
}
