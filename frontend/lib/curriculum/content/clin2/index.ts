/**
 * Master Clinical Postings II (CLIN-302) Learning Catalog
 * Comprehensive modules covering Preoperative Risk Stratification, Postoperative Fever 5 Ws, Surgical Drains & Chest Tube Physics, and Wound Dehiscence & Evisceration Emergencies
 */

import { PREOPERATIVE_RISK_STRATIFICATION_MODULE } from "./preoperativeRiskStratificationContent";
import { POSTOPERATIVE_FEVER_5WS_MODULE } from "./postoperativeFever5WsContent";
import { SURGICAL_DRAINS_CHEST_TUBE_PHYSICS_MODULE } from "./surgicalDrainsChestTubePhysicsContent";
import { WOUND_DEHISCENCE_EVISCERATION_EMERGENCY_MODULE } from "./woundDehiscenceEviscerationEmergencyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./preoperativeRiskStratificationContent";
export * from "./postoperativeFever5WsContent";
export * from "./surgicalDrainsChestTubePhysicsContent";
export * from "./woundDehiscenceEviscerationEmergencyContent";

export const CLIN2_CORE_MODULES: PhysiologyLessonModule[] = [
  PREOPERATIVE_RISK_STRATIFICATION_MODULE,
  POSTOPERATIVE_FEVER_5WS_MODULE,
  SURGICAL_DRAINS_CHEST_TUBE_PHYSICS_MODULE,
  WOUND_DEHISCENCE_EVISCERATION_EMERGENCY_MODULE
];

export function getClin2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return CLIN2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getClin2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return CLIN2_CORE_MODULES.find(m => m.competencies.includes(code));
}
