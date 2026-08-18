/**
 * Master Pulmonology & Respiratory Medicine (RESP-401 / RESP-301) Learning Catalog
 * Comprehensive clinical coverage of Spirometry/PFTs, Tuberculosis NTEP, Light's Criteria & Occupational OSA
 */

import { SPIROMETRY_PFT_FLOW_VOLUME_CURVES_MODULE } from "./spirometryPftFlowVolumeCurvesContent";
import { TUBERCULOSIS_NTEP_MDR_REGIMENS_MODULE } from "./tuberculosisNtepMdrRegimensContent";
import { PLEURAL_DISEASES_LIGHTS_CRITERIA_THORACOCENTESIS_MODULE } from "./pleuralDiseasesLightsCriteriaThoracocentesisContent";
import { OCCUPATIONAL_LUNG_DISEASES_OSA_MODULE } from "./occupationalLungDiseasesOsaContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./spirometryPftFlowVolumeCurvesContent";
export * from "./tuberculosisNtepMdrRegimensContent";
export * from "./pleuralDiseasesLightsCriteriaThoracocentesisContent";
export * from "./occupationalLungDiseasesOsaContent";

export const PULMONOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  SPIROMETRY_PFT_FLOW_VOLUME_CURVES_MODULE,
  TUBERCULOSIS_NTEP_MDR_REGIMENS_MODULE,
  PLEURAL_DISEASES_LIGHTS_CRITERIA_THORACOCENTESIS_MODULE,
  OCCUPATIONAL_LUNG_DISEASES_OSA_MODULE
];

export function getPulmonologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return PULMONOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPulmonologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PULMONOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
