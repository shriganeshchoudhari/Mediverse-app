/**
 * Master Internship Core Clinical Postings: Surgical Postings & Trauma Call (INT-505) Learning Catalog
 * Comprehensive modules covering Acute Abdomen Surgical Triage (Alvarado & Tokyo Criteria), Burns & Parkland Formula Resuscitation, Acute Extremity Compartment Syndrome & Fasciotomy, and Necrotizing Soft Tissue Infections & Surgical Sepsis
 */

import { ACUTE_ABDOMEN_APPENDICITIS_CHOLECYSTITIS_MODULE } from "./acuteAbdomenAppendicitisCholecystitisContent";
import { BURNS_PARKLAND_FORMULA_RESUSCITATION_MODULE } from "./burnsParklandFormulaResuscitationContent";
import { COMPARTMENT_SYNDROME_EMERGENCY_FASCIOTOMY_MODULE } from "./compartmentSyndromeEmergencyFasciotomyContent";
import { NECROTIZING_FASCIITIS_SURGICAL_SEPSIS_MODULE } from "./necrotizingFasciitisSurgicalSepsisContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./acuteAbdomenAppendicitisCholecystitisContent";
export * from "./burnsParklandFormulaResuscitationContent";
export * from "./compartmentSyndromeEmergencyFasciotomyContent";
export * from "./necrotizingFasciitisSurgicalSepsisContent";

export const INT5_CORE_MODULES: PhysiologyLessonModule[] = [
  ACUTE_ABDOMEN_APPENDICITIS_CHOLECYSTITIS_MODULE,
  BURNS_PARKLAND_FORMULA_RESUSCITATION_MODULE,
  COMPARTMENT_SYNDROME_EMERGENCY_FASCIOTOMY_MODULE,
  NECROTIZING_FASCIITIS_SURGICAL_SEPSIS_MODULE
];

export function getInt5ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT5_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt5ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT5_CORE_MODULES.find(m => m.competencies.includes(code));
}
