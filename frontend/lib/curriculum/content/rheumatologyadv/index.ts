/**
 * Master Clinical Rheumatology & Autoimmune Disorders (RHEUM-301) Learning Catalog
 * Comprehensive modules covering SLE/Lupus Nephritis, Rheumatoid Arthritis/Pannus, Systemic Sclerosis/SRC, and Spondyloarthropathies/Crystals/GCA
 */

import { SLE_LUPUS_NEPHRITIS_MODULE } from "./sleLupusNephritisContent";
import { RHEUMATOID_ARTHRITIS_POLYARTHRITIS_MODULE } from "./rheumatoidArthritisPolyarthritisContent";
import { SYSTEMIC_SCLEROSIS_RENAL_CRISIS_MODULE } from "./systemicSclerosisRenalCrisisContent";
import { SPONDYLOARTHROPATHIES_CRYSTALS_GCA_MODULE } from "./spondyloarthropathiesCrystalsGcaContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./sleLupusNephritisContent";
export * from "./rheumatoidArthritisPolyarthritisContent";
export * from "./systemicSclerosisRenalCrisisContent";
export * from "./spondyloarthropathiesCrystalsGcaContent";

export const RHEUMATOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  SLE_LUPUS_NEPHRITIS_MODULE,
  RHEUMATOID_ARTHRITIS_POLYARTHRITIS_MODULE,
  SYSTEMIC_SCLEROSIS_RENAL_CRISIS_MODULE,
  SPONDYLOARTHROPATHIES_CRYSTALS_GCA_MODULE
];

export function getRheumatologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return RHEUMATOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getRheumatologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return RHEUMATOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
