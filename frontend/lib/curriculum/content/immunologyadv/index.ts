/**
 * Master Clinical Immunology & Advanced Immunotherapeutics (IMM-301) Learning Catalog
 * Comprehensive modules covering Hypersensitivity, Biologics, Checkpoint Inhibitors, and CAR-T Therapy
 */

import { HYPERSENSITIVITY_CELLULAR_PATHWAYS_MODULE } from "./hypersensitivityCellularPathwaysContent";
import { TARGETED_BIOLOGICS_MABS_MODULE } from "./targetedBiologicsMabsContent";
import { CHECKPOINT_INHIBITORS_IRAES_MODULE } from "./checkpointInhibitorsIraesContent";
import { CART_CELL_CRS_ICANS_MODULE } from "./cartCellCrsIcansContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./hypersensitivityCellularPathwaysContent";
export * from "./targetedBiologicsMabsContent";
export * from "./checkpointInhibitorsIraesContent";
export * from "./cartCellCrsIcansContent";

export const IMMUNOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  HYPERSENSITIVITY_CELLULAR_PATHWAYS_MODULE,
  TARGETED_BIOLOGICS_MABS_MODULE,
  CHECKPOINT_INHIBITORS_IRAES_MODULE,
  CART_CELL_CRS_ICANS_MODULE
];

export function getImmunologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return IMMUNOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getImmunologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return IMMUNOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
