/**
 * Master Clinical Gastroenterology & Hepatology (GASTRO-301) Learning Catalog
 * Comprehensive modules covering Cirrhosis/Portal HTN/SBP, Jaundice Differential, Inflammatory Bowel Disease, and Pancreatitis/Celiac
 */

import { CIRRHOSIS_PORTAL_HYPERTENSION_MODULE } from "./cirrhosisPortalHypertensionContent";
import { JAUNDICE_BILIRUBIN_METABOLISM_MODULE } from "./jaundiceBilirubinMetabolismContent";
import { INFLAMMATORY_BOWEL_DISEASE_MODULE } from "./inflammatoryBowelDiseaseContent";
import { PANCREATITIS_MALABSORPTION_MODULE } from "./pancreatitisMalabsorptionContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cirrhosisPortalHypertensionContent";
export * from "./jaundiceBilirubinMetabolismContent";
export * from "./inflammatoryBowelDiseaseContent";
export * from "./pancreatitisMalabsorptionContent";

export const GASTROENTEROLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  CIRRHOSIS_PORTAL_HYPERTENSION_MODULE,
  JAUNDICE_BILIRUBIN_METABOLISM_MODULE,
  INFLAMMATORY_BOWEL_DISEASE_MODULE,
  PANCREATITIS_MALABSORPTION_MODULE
];

export function getGastroenterologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return GASTROENTEROLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getGastroenterologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return GASTROENTEROLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
