/**
 * Master Transfusion Medicine & Immunohematology (TRANS-301) Learning Catalog
 * Comprehensive modules covering ABO/Rh Antigens, Blood Components, MTP, TRALI vs TACO, and Rh HDFN
 */

import { ABO_RH_ANTIGENS_COOMBS_TESTING_MODULE } from "./aboRhAntigensCoombsTestingContent";
import { BLOOD_COMPONENTS_MASSIVE_TRANSFUSION_MODULE } from "./bloodComponentsMassiveTransfusionContent";
import { TRANSFUSION_REACTIONS_TRALI_TACO_AHTR_MODULE } from "./transfusionReactionsTraliTacoAhtrContent";
import { APHERESIS_SAFETY_HDFN_RHOGAM_MODULE } from "./apheresisSafetyHdfnRhogamContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./aboRhAntigensCoombsTestingContent";
export * from "./bloodComponentsMassiveTransfusionContent";
export * from "./transfusionReactionsTraliTacoAhtrContent";
export * from "./apheresisSafetyHdfnRhogamContent";

export const TRANSFUSION_CORE_MODULES: PhysiologyLessonModule[] = [
  ABO_RH_ANTIGENS_COOMBS_TESTING_MODULE,
  BLOOD_COMPONENTS_MASSIVE_TRANSFUSION_MODULE,
  TRANSFUSION_REACTIONS_TRALI_TACO_AHTR_MODULE,
  APHERESIS_SAFETY_HDFN_RHOGAM_MODULE
];

export function getTransfusionModuleById(id: string): PhysiologyLessonModule | undefined {
  return TRANSFUSION_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getTransfusionModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return TRANSFUSION_CORE_MODULES.find(m => m.competencies.includes(code));
}
