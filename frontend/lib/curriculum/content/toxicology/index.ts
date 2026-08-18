/**
 * Master Clinical Toxicology & Poisoning Emergencies (TOX-301) Learning Catalog
 * Comprehensive modules covering Toxidromes & Resuscitation, Signature Overdoses & Antidotes, Heavy Metals & Corrosives, and Toxic Alcohols & Elimination
 */

import { TOXIDROMES_ACUTE_POISONING_RESUSCITATION_MODULE } from "./toxidromesAcutePoisoningResuscitationContent";
import { SIGNATURE_DRUG_OVERDOSES_ANTIDOTE_PROTOCOLS_MODULE } from "./signatureDrugOverdosesAntidoteProtocolsContent";
import { HEAVY_METAL_POISONING_CHELATION_CORROSIVES_MODULE } from "./heavyMetalPoisoningChelationCorrosivesContent";
import { TOXIC_ALCOHOLS_ENVENOMATIONS_ENHANCED_ELIMINATION_MODULE } from "./toxicAlcoholsEnvenomationsEnhancedEliminationContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./toxidromesAcutePoisoningResuscitationContent";
export * from "./signatureDrugOverdosesAntidoteProtocolsContent";
export * from "./heavyMetalPoisoningChelationCorrosivesContent";
export * from "./toxicAlcoholsEnvenomationsEnhancedEliminationContent";

export const TOXICOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  TOXIDROMES_ACUTE_POISONING_RESUSCITATION_MODULE,
  SIGNATURE_DRUG_OVERDOSES_ANTIDOTE_PROTOCOLS_MODULE,
  HEAVY_METAL_POISONING_CHELATION_CORROSIVES_MODULE,
  TOXIC_ALCOHOLS_ENVENOMATIONS_ENHANCED_ELIMINATION_MODULE
];

export function getToxicologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return TOXICOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getToxicologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return TOXICOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
