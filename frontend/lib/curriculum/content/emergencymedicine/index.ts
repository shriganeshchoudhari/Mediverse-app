/**
 * Master Emergency Medicine & Resuscitation (EM-301 / EM-401) Learning Catalog
 * Comprehensive clinical coverage of ACLS Cardiac Arrest, Shock Resuscitation, Toxicology Toxidromes & ATLS Trauma
 */

import { ACLS_CARDIAC_ARREST_ALGORITHMS_MODULE } from "./aclsCardiacArrestAlgorithmsContent";
import { SHOCK_HEMODYNAMIC_RESUSCITATION_MODULE } from "./shockHemodynamicResuscitationContent";
import { TOXICOLOGY_TOXIDROMES_ANTIDOTES_MODULE } from "./toxicologyToxidromesAntidotesContent";
import { TRAUMA_ATLS_EMERGENCY_PROCEDURES_MODULE } from "./traumaAtlsEmergencyProceduresContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./aclsCardiacArrestAlgorithmsContent";
export * from "./shockHemodynamicResuscitationContent";
export * from "./toxicologyToxidromesAntidotesContent";
export * from "./traumaAtlsEmergencyProceduresContent";

export const EMERGENCY_MEDICINE_CORE_MODULES: PhysiologyLessonModule[] = [
  ACLS_CARDIAC_ARREST_ALGORITHMS_MODULE,
  SHOCK_HEMODYNAMIC_RESUSCITATION_MODULE,
  TOXICOLOGY_TOXIDROMES_ANTIDOTES_MODULE,
  TRAUMA_ATLS_EMERGENCY_PROCEDURES_MODULE
];

export function getEmergencyMedicineModuleById(id: string): PhysiologyLessonModule | undefined {
  return EMERGENCY_MEDICINE_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getEmergencyMedicineModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return EMERGENCY_MEDICINE_CORE_MODULES.find(m => m.competencies.includes(code));
}
