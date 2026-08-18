/**
 * Master Advanced Psychiatry & Clinical Psychopharmacology (PSY-301) Learning Catalog
 * Comprehensive modules covering Acute Psychiatric Emergencies, Mood Disorders & Teratology, Psychotic Disorders & Clozapine REMS, and Addiction Medicine
 */

import { PSYCHIATRIC_EMERGENCIES_TOX_SYNDROMES_MODULE } from "./psychiatricEmergenciesToxSyndromesContent";
import { MOOD_DISORDERS_LITHIUM_TERATOLOGY_MODULE } from "./moodDisordersLithiumTeratologyContent";
import { PSYCHOTIC_DISORDERS_ANTIPSYCHOTICS_MODULE } from "./psychoticDisordersAntipsychoticsContent";
import { SUBSTANCE_USE_ADDICTION_PROTOCOLS_MODULE } from "./substanceUseAddictionProtocolsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./psychiatricEmergenciesToxSyndromesContent";
export * from "./moodDisordersLithiumTeratologyContent";
export * from "./psychoticDisordersAntipsychoticsContent";
export * from "./substanceUseAddictionProtocolsContent";

export const PSYCHIATRY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  PSYCHIATRIC_EMERGENCIES_TOX_SYNDROMES_MODULE,
  MOOD_DISORDERS_LITHIUM_TERATOLOGY_MODULE,
  PSYCHOTIC_DISORDERS_ANTIPSYCHOTICS_MODULE,
  SUBSTANCE_USE_ADDICTION_PROTOCOLS_MODULE
];

export function getPsychiatryAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return PSYCHIATRY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPsychiatryAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PSYCHIATRY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
