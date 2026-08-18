/**
 * Master Dermatology & Venereology (DERM-301) Learning Catalog
 * Comprehensive clinical coverage of Psoriasis, Bullous Dermatoses, Melanoma & Drug Eruptions
 */

import { PSORIASIS_PAPULOSQUAMOUS_MODULE } from "./psoriasisPapulosquamousContent";
import { BULLOUS_DERMATOSES_NIKOLSKY_MODULE } from "./bullousDermatosesNikolskyContent";
import { MELANOMA_SKIN_CANCER_MODULE } from "./melanomaSkinCancerContent";
import { DRUG_ERUPTIONS_SJS_TEN_MODULE } from "./drugEruptionsSjsTenContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./psoriasisPapulosquamousContent";
export * from "./bullousDermatosesNikolskyContent";
export * from "./melanomaSkinCancerContent";
export * from "./drugEruptionsSjsTenContent";

export const DERMATOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  PSORIASIS_PAPULOSQUAMOUS_MODULE,
  BULLOUS_DERMATOSES_NIKOLSKY_MODULE,
  MELANOMA_SKIN_CANCER_MODULE,
  DRUG_ERUPTIONS_SJS_TEN_MODULE
];

export function getDermatologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return DERMATOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getDermatologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return DERMATOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
