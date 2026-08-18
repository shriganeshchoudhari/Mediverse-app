/**
 * Master Clinical Endocrinology & Metabolic Pathophysiology (ENDO-301) Learning Catalog
 * Comprehensive modules covering Adrenal Disorders, Thyroid Disorders/Storm, Calcium Homeostasis/PHPT, and MEN/Pituitary Syndromes
 */

import { ADRENAL_DISORDERS_CUSHING_CONN_MODULE } from "./adrenalDisordersCushingConnContent";
import { THYROID_DISORDERS_STORM_MYXEDEMA_MODULE } from "./thyroidDisordersStormMyxedemaContent";
import { CALCIUM_HOMEOSTASIS_PARATHYROID_MODULE } from "./calciumHomeostasisParathyroidContent";
import { MULTIPLE_ENDOCRINE_NEOPLASIA_PITUITARY_MODULE } from "./multipleEndocrineNeoplasiaPituitaryContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./adrenalDisordersCushingConnContent";
export * from "./thyroidDisordersStormMyxedemaContent";
export * from "./calciumHomeostasisParathyroidContent";
export * from "./multipleEndocrineNeoplasiaPituitaryContent";

export const ENDOCRINOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ADRENAL_DISORDERS_CUSHING_CONN_MODULE,
  THYROID_DISORDERS_STORM_MYXEDEMA_MODULE,
  CALCIUM_HOMEOSTASIS_PARATHYROID_MODULE,
  MULTIPLE_ENDOCRINE_NEOPLASIA_PITUITARY_MODULE
];

export function getEndocrinologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return ENDOCRINOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEndocrinologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ENDOCRINOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
