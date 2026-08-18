/**
 * Master Advanced Dermatology & Cutaneous Oncology (DER-301) Learning Catalog
 * Comprehensive modules covering Cutaneous Emergencies (SJS/TEN), Autoimmune Bullous Diseases, Cutaneous Malignancies (Melanoma), and Psoriasis/Necrotizing Fasciitis
 */

import { CUTANEOUS_EMERGENCIES_SJS_TEN_MODULE } from "./cutaneousEmergenciesSjsTenContent";
import { AUTOIMMUNE_BULLOUS_PEMPHIGUS_MODULE } from "./autoimmuneBullousPemphigusContent";
import { CUTANEOUS_MALIGNANCIES_MELANOMA_MODULE } from "./cutaneousMalignanciesMelanomaContent";
import { PSORIASIS_BIOLOGICS_INFLAMMATORY_MODULE } from "./psoriasisBiologicsInflammatoryContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cutaneousEmergenciesSjsTenContent";
export * from "./autoimmuneBullousPemphigusContent";
export * from "./cutaneousMalignanciesMelanomaContent";
export * from "./psoriasisBiologicsInflammatoryContent";

export const DERMATOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  CUTANEOUS_EMERGENCIES_SJS_TEN_MODULE,
  AUTOIMMUNE_BULLOUS_PEMPHIGUS_MODULE,
  CUTANEOUS_MALIGNANCIES_MELANOMA_MODULE,
  PSORIASIS_BIOLOGICS_INFLAMMATORY_MODULE
];

export function getDermatologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return DERMATOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getDermatologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return DERMATOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
