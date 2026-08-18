/**
 * Master Emergency Medicine & Resuscitation Science (EM-301) Learning Catalog
 * Comprehensive modules covering ACLS Protocols, Shock & Sepsis Resuscitation, Emergency Toxicology, and Trauma/eFAST Resuscitation
 */

import { ACLS_RESUSCITATION_PROTOCOLS_MODULE } from "./aclsResuscitationProtocolsContent";
import { SHOCK_CLASSIFICATION_HEMODYNAMICS_MODULE } from "./shockClassificationHemodynamicsContent";
import { EMERGENCY_TOXICOLOGY_TOXIDROMES_MODULE } from "./emergencyToxicologyToxidromesContent";
import { TRAUMA_RESUSCITATION_EFAST_MODULE } from "./traumaResuscitationEfastContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./aclsResuscitationProtocolsContent";
export * from "./shockClassificationHemodynamicsContent";
export * from "./emergencyToxicologyToxidromesContent";
export * from "./traumaResuscitationEfastContent";

export const EMERGENCY_MEDICINE_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ACLS_RESUSCITATION_PROTOCOLS_MODULE,
  SHOCK_CLASSIFICATION_HEMODYNAMICS_MODULE,
  EMERGENCY_TOXICOLOGY_TOXIDROMES_MODULE,
  TRAUMA_RESUSCITATION_EFAST_MODULE
];

export function getEmergencyMedicineAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return EMERGENCY_MEDICINE_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEmergencyMedicineAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return EMERGENCY_MEDICINE_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
