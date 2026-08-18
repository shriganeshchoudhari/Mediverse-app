/**
 * Master Postgraduate Advanced Internal Medicine & Subspecialty Consultations (PG-602) Learning Catalog
 * Comprehensive modules covering Mechanical Circulatory Support (Impella & IABP), RPGN & Renal Pathology, Neuro-ICU Tiered ICP Protocols, and Targeted Biologic Immunomodulation
 */

import { ADVANCED_MECHANICAL_CIRCULATORY_SUPPORT_IMPELLA_MODULE } from "./advancedMechanicalCirculatorySupportImpellaContent";
import { RPGN_RENAL_BIOPSY_PATHOLOGY_ANCA_MODULE } from "./rpgnRenalBiopsyPathologyAncaContent";
import { NEURO_ICU_TIERED_ICP_ESCALATION_HERNIATION_MODULE } from "./neuroIcuTieredIcpEscalationHerniationContent";
import { TARGETED_BIOLOGIC_IMMUNOMODULATION_CRISIS_MODULE } from "./targetedBiologicImmunomodulationCrisisContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./advancedMechanicalCirculatorySupportImpellaContent";
export * from "./rpgnRenalBiopsyPathologyAncaContent";
export * from "./neuroIcuTieredIcpEscalationHerniationContent";
export * from "./targetedBiologicImmunomodulationCrisisContent";

export const PG2_CORE_MODULES: PhysiologyLessonModule[] = [
  ADVANCED_MECHANICAL_CIRCULATORY_SUPPORT_IMPELLA_MODULE,
  RPGN_RENAL_BIOPSY_PATHOLOGY_ANCA_MODULE,
  NEURO_ICU_TIERED_ICP_ESCALATION_HERNIATION_MODULE,
  TARGETED_BIOLOGIC_IMMUNOMODULATION_CRISIS_MODULE
];

export function getPg2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return PG2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPg2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PG2_CORE_MODULES.find(m => m.competencies.includes(code));
}
