/**
 * Master Clinical Neuroanatomy & Localization Neuropathology (NEURO-201) Learning Catalog
 * Comprehensive modules covering Brainstem Stroke Syndromes, Spinal Cord Syndromes, Higher Cortical Syndromes & Aphasias, and Cranial Nerve Localizers & NMJ
 */

import { BRAINSTEM_STROKE_SYNDROMES_MODULE } from "./brainstemStrokeSyndromesContent";
import { SPINAL_CORD_SYNDROMES_MYELOPATHY_MODULE } from "./spinalCordSyndromesMyelopathyContent";
import { CORTICAL_SYNDROMES_APHASIAS_VISUAL_FIELDS_MODULE } from "./corticalSyndromesAphasiasVisualFieldsContent";
import { CRANIAL_NERVES_CAVERNOUS_SINUS_NMJ_MODULE } from "./cranialNervesCavernousSinusNmjContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./brainstemStrokeSyndromesContent";
export * from "./spinalCordSyndromesMyelopathyContent";
export * from "./corticalSyndromesAphasiasVisualFieldsContent";
export * from "./cranialNervesCavernousSinusNmjContent";

export const NEUROANATOMY_CORE_MODULES: PhysiologyLessonModule[] = [
  BRAINSTEM_STROKE_SYNDROMES_MODULE,
  SPINAL_CORD_SYNDROMES_MYELOPATHY_MODULE,
  CORTICAL_SYNDROMES_APHASIAS_VISUAL_FIELDS_MODULE,
  CRANIAL_NERVES_CAVERNOUS_SINUS_NMJ_MODULE
];

export function getNeuroanatomyModuleById(id: string): PhysiologyLessonModule | undefined {
  return NEUROANATOMY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getNeuroanatomyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return NEUROANATOMY_CORE_MODULES.find(m => m.competencies.includes(code));
}
