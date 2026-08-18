/**
 * Master Clinical Internal Medicine (MED-301) Learning Catalog
 * Comprehensive modules covering ACS ECG Localization, HFrEF 4-Pillar GDMT, Advanced Acid-Base ABG, and AKI KDIGO
 */

import { ACUTE_CORONARY_SYNDROMES_ECG_MODULE } from "./acuteCoronarySyndromesEcgContent";
import { HEART_FAILURE_REDUCED_EF_GDMT_MODULE } from "./heartFailureReducedEfGdmtContent";
import { ADVANCED_ACID_BASE_ABG_INTERPRETATION_MODULE } from "./advancedAcidBaseAbgInterpretationContent";
import { ACUTE_KIDNEY_INJURY_KDIGO_FENA_MODULE } from "./acuteKidneyInjuryKdigoFeNaContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./acuteCoronarySyndromesEcgContent";
export * from "./heartFailureReducedEfGdmtContent";
export * from "./advancedAcidBaseAbgInterpretationContent";
export * from "./acuteKidneyInjuryKdigoFeNaContent";

export const MEDICINE_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ACUTE_CORONARY_SYNDROMES_ECG_MODULE,
  HEART_FAILURE_REDUCED_EF_GDMT_MODULE,
  ADVANCED_ACID_BASE_ABG_INTERPRETATION_MODULE,
  ACUTE_KIDNEY_INJURY_KDIGO_FENA_MODULE
];

export function getMedicineAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return MEDICINE_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getMedicineAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return MEDICINE_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
