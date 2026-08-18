/**
 * Master Clinical Neurology & Stroke Localization (NEURO-301) Learning Catalog
 * Comprehensive modules covering Ischemic Stroke Syndromes, Intracranial Hemorrhages, Demyelinating/Movement Disorders, and Spinal Cord Syndromes/ALS
 */

import { ISCHEMIC_STROKE_VASCULAR_LOCALIZATION_MODULE } from "./ischemicStrokeVascularLocalizationContent";
import { INTRACRANIAL_HEMORRHAGES_TRAUMA_MODULE } from "./intracranialHemorrhagesTraumaContent";
import { DEMYELINATING_MOVEMENT_DISORDERS_MODULE } from "./demyelinatingMovementDisordersContent";
import { SPINAL_CORD_SYNDROMES_ALS_MODULE } from "./spinalCordSyndromesAlsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./ischemicStrokeVascularLocalizationContent";
export * from "./intracranialHemorrhagesTraumaContent";
export * from "./demyelinatingMovementDisordersContent";
export * from "./spinalCordSyndromesAlsContent";

export const NEUROLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  ISCHEMIC_STROKE_VASCULAR_LOCALIZATION_MODULE,
  INTRACRANIAL_HEMORRHAGES_TRAUMA_MODULE,
  DEMYELINATING_MOVEMENT_DISORDERS_MODULE,
  SPINAL_CORD_SYNDROMES_ALS_MODULE
];

export function getNeurologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return NEUROLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getNeurologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return NEUROLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
