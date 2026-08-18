/**
 * Master Clinical Oncology & Palliative Radiotherapy (ONCO-401) Learning Catalog
 * Comprehensive modules covering Cancer Biology, TNM Staging, Chemotherapy, Checkpoint Inhibitors, Radiobiology 4 Rs, and Oncologic Emergencies
 */

import { CANCER_BIOLOGY_TNM_STAGING_MODULE } from "./cancerBiologyTnmStagingContent";
import { CHEMOTHERAPY_MECHANISMS_PRECISION_THERAPY_MODULE } from "./chemotherapyMechanismsPrecisionTherapyContent";
import { RADIATION_BIOLOGY_CLINICAL_RADIOTHERAPY_MODULE } from "./radiationBiologyClinicalRadiotherapyContent";
import { ONCOLOGIC_EMERGENCIES_PALLIATIVE_CARE_MODULE } from "./oncologicEmergenciesPalliativeCareContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./cancerBiologyTnmStagingContent";
export * from "./chemotherapyMechanismsPrecisionTherapyContent";
export * from "./radiationBiologyClinicalRadiotherapyContent";
export * from "./oncologicEmergenciesPalliativeCareContent";

export const ONCOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  CANCER_BIOLOGY_TNM_STAGING_MODULE,
  CHEMOTHERAPY_MECHANISMS_PRECISION_THERAPY_MODULE,
  RADIATION_BIOLOGY_CLINICAL_RADIOTHERAPY_MODULE,
  ONCOLOGIC_EMERGENCIES_PALLIATIVE_CARE_MODULE
];

export function getOncologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return ONCOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getOncologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ONCOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
