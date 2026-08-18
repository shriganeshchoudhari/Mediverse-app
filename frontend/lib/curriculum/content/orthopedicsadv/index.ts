/**
 * Master Advanced Orthopedic Surgery & Musculoskeletal Oncology (ORT-301) Learning Catalog
 * Comprehensive modules covering Compartment Syndrome, Open Fractures, Pediatric Hip, and Bone Oncology
 */

import { COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE } from "./compartmentSyndromeFasciotomyContent";
import { OPEN_FRACTURE_GUSTILO_ANDERSON_MODULE } from "./openFractureGustiloAndersonContent";
import { PEDIATRIC_ORTHOPEDICS_HIP_DISORDERS_MODULE } from "./pediatricOrthopedicsHipDisordersContent";
import { MUSCULOSKELETAL_ONCOLOGY_BONE_TUMORS_MODULE } from "./musculoskeletalOncologyBoneTumorsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./compartmentSyndromeFasciotomyContent";
export * from "./openFractureGustiloAndersonContent";
export * from "./pediatricOrthopedicsHipDisordersContent";
export * from "./musculoskeletalOncologyBoneTumorsContent";

export const ORTHOPEDICS_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE,
  OPEN_FRACTURE_GUSTILO_ANDERSON_MODULE,
  PEDIATRIC_ORTHOPEDICS_HIP_DISORDERS_MODULE,
  MUSCULOSKELETAL_ONCOLOGY_BONE_TUMORS_MODULE
];

export function getOrthopedicsAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return ORTHOPEDICS_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOrthopedicsAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ORTHOPEDICS_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
