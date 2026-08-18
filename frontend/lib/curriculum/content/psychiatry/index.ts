/**
 * Master Psychiatry & Behavioral Health (PSYCH-301) Learning Catalog
 * Comprehensive clinical coverage of MSE, Affective Disorders, Bipolar, Schizophrenia & Anxiety
 */

import { MENTAL_STATE_EXAM_AFFECTIVE_MODULE } from "./mentalStateExamAffectiveContent";
import { BIPOLAR_PSYCHOPHARMACOLOGY_LITHIUM_MODULE } from "./bipolarPsychopharmacologyLithiumContent";
import { SCHIZOPHRENIA_PSYCHOSIS_MODULE } from "./schizophreniaPsychosisContent";
import { ANXIETY_TRAUMA_OBSESSIVE_MODULE } from "./anxietyTraumaObsessiveContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./mentalStateExamAffectiveContent";
export * from "./bipolarPsychopharmacologyLithiumContent";
export * from "./schizophreniaPsychosisContent";
export * from "./anxietyTraumaObsessiveContent";

export const PSYCHIATRY_CORE_MODULES: PhysiologyLessonModule[] = [
  MENTAL_STATE_EXAM_AFFECTIVE_MODULE,
  BIPOLAR_PSYCHOPHARMACOLOGY_LITHIUM_MODULE,
  SCHIZOPHRENIA_PSYCHOSIS_MODULE,
  ANXIETY_TRAUMA_OBSESSIVE_MODULE
];

export function getPsychiatryModuleById(id: string): PhysiologyLessonModule | undefined {
  return PSYCHIATRY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPsychiatryModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PSYCHIATRY_CORE_MODULES.find(m => m.competencies.includes(code));
}
