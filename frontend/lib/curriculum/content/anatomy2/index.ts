/**
 * Master Human Anatomy II (ANAT-102) Learning Catalog
 * Comprehensive modules covering Cranial Nerves & Brainstem Syndromes, Deep Fascial Spaces of the Neck, Orbit & Cavernous Sinus, and Clinical Embryology
 */

import { CRANIAL_NERVES_BRAINSTEM_SYNDROMES_MODULE } from "./cranialNervesBrainstemSyndromesContent";
import { DEEP_FASCIAL_SPACES_HEAD_NECK_MODULE } from "./deepFascialSpacesHeadNeckContent";
import { ORBIT_CAVERNOUS_SINUS_OTIC_MODULE } from "./orbitCavernousSinusOticContent";
import { CLINICAL_EMBRYOLOGY_BRANCHIAL_APPARATUS_MODULE } from "./clinicalEmbryologyBranchialApparatusContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cranialNervesBrainstemSyndromesContent";
export * from "./deepFascialSpacesHeadNeckContent";
export * from "./orbitCavernousSinusOticContent";
export * from "./clinicalEmbryologyBranchialApparatusContent";

export const ANATOMY2_CORE_MODULES: PhysiologyLessonModule[] = [
  CRANIAL_NERVES_BRAINSTEM_SYNDROMES_MODULE,
  DEEP_FASCIAL_SPACES_HEAD_NECK_MODULE,
  ORBIT_CAVERNOUS_SINUS_OTIC_MODULE,
  CLINICAL_EMBRYOLOGY_BRANCHIAL_APPARATUS_MODULE
];

export function getAnatomy2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return ANATOMY2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getAnatomy2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ANATOMY2_CORE_MODULES.find(m => m.competencies.includes(code));
}
