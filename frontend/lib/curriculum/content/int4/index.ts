/**
 * Master Internship Core Clinical Postings: Inpatient Medicine & Subspecialty Consults (INT-504) Learning Catalog
 * Comprehensive modules covering Acute Coronary Syndromes (ACS), DKA & HHS Hyperglycemic Crises, Acute Kidney Injury (KDIGO & RRT), and Cirrhotic Decompensation (Encephalopathy & Variceal Bleeding)
 */

import { ACUTE_CORONARY_SYNDROMES_MODULE } from "./acuteCoronarySyndromesContent";
import { DKA_HHS_HYPERGLYCEMIA_MODULE } from "./dkaHhsHyperglycemiaContent";
import { AKI_KDIGO_RENAL_REPLACEMENT_MODULE } from "./akiKdigoRenalReplacementContent";
import { CIRRHOTIC_DECOMPENSATION_ENCEPHALOPATHY_MODULE } from "./cirrhoticDecompensationEncephalopathyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./acuteCoronarySyndromesContent";
export * from "./dkaHhsHyperglycemiaContent";
export * from "./akiKdigoRenalReplacementContent";
export * from "./cirrhoticDecompensationEncephalopathyContent";

export const INT4_CORE_MODULES: PhysiologyLessonModule[] = [
  ACUTE_CORONARY_SYNDROMES_MODULE,
  DKA_HHS_HYPERGLYCEMIA_MODULE,
  AKI_KDIGO_RENAL_REPLACEMENT_MODULE,
  CIRRHOTIC_DECOMPENSATION_ENCEPHALOPATHY_MODULE
];

export function getInt4ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT4_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt4ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT4_CORE_MODULES.find(m => m.competencies.includes(code));
}
