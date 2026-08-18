/**
 * Master Nuclear Medicine & Molecular Theranostics (NUCL-401) Learning Catalog
 * Comprehensive modules covering Radiopharmaceuticals, SPECT/Planar Scintigraphy, PET-CT Oncology & Neurology, and Theranostics/PRRT
 */

import { RADIOPHARMACEUTICALS_DECAY_PHYSICS_MODULE } from "./radiopharmaceuticalsDecayPhysicsContent";
import { PLANAR_SCINTIGRAPHY_SPECT_ORGAN_IMAGING_MODULE } from "./planarScintigraphySpectOrganImagingContent";
import { PET_CT_ONCOLOGY_NEUROLOGY_METABOLISM_MODULE } from "./petCtOncologyNeurologyMetabolismContent";
import { THERANOSTICS_TARGETED_RADIONUCLIDE_THERAPY_MODULE } from "./theranosticsTargetedRadionuclideTherapyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./radiopharmaceuticalsDecayPhysicsContent";
export * from "./planarScintigraphySpectOrganImagingContent";
export * from "./petCtOncologyNeurologyMetabolismContent";
export * from "./theranosticsTargetedRadionuclideTherapyContent";

export const NUCLEAR_MEDICINE_CORE_MODULES: PhysiologyLessonModule[] = [
  RADIOPHARMACEUTICALS_DECAY_PHYSICS_MODULE,
  PLANAR_SCINTIGRAPHY_SPECT_ORGAN_IMAGING_MODULE,
  PET_CT_ONCOLOGY_NEUROLOGY_METABOLISM_MODULE,
  THERANOSTICS_TARGETED_RADIONUCLIDE_THERAPY_MODULE
];

export function getNuclearMedicineModuleById(id: string): PhysiologyLessonModule | undefined {
  return NUCLEAR_MEDICINE_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getNuclearMedicineModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return NUCLEAR_MEDICINE_CORE_MODULES.find(m => m.competencies.includes(code));
}
