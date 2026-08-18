/**
 * Master Orthopedics & Traumatology (ORTH-301) Learning Catalog
 * Comprehensive clinical coverage of Fractures, Compartment Syndrome, Dislocations & Tumors
 */

import { FRACTURE_CLASSIFICATION_PHYSEAL_MODULE } from "./fractureClassificationPhysealContent";
import { ACUTE_COMPARTMENT_SYNDROME_MODULE } from "./acuteCompartmentSyndromeTraumaContent";
import { JOINT_DISLOCATIONS_SPINE_NERVES_MODULE } from "./jointDislocationsSpineNervesContent";
import { BONE_TUMORS_INFECTIONS_MODULE } from "./boneTumorsInfectionsOsteomyelitisContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./fractureClassificationPhysealContent";
export * from "./acuteCompartmentSyndromeTraumaContent";
export * from "./jointDislocationsSpineNervesContent";
export * from "./boneTumorsInfectionsOsteomyelitisContent";

export const ORTHOPEDICS_CORE_MODULES: PhysiologyLessonModule[] = [
  FRACTURE_CLASSIFICATION_PHYSEAL_MODULE,
  ACUTE_COMPARTMENT_SYNDROME_MODULE,
  JOINT_DISLOCATIONS_SPINE_NERVES_MODULE,
  BONE_TUMORS_INFECTIONS_MODULE
];

export function getOrthopedicsModuleById(id: string): PhysiologyLessonModule | undefined {
  return ORTHOPEDICS_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOrthopedicsModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ORTHOPEDICS_CORE_MODULES.find(m => m.competencies.includes(code));
}
