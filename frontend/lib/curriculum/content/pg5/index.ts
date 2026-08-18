/**
 * Master Postgraduate Advanced Obstetrics, Fetal Medicine & Maternal Critical Care (PG-605) Learning Catalog
 * Comprehensive modules covering Monochorionic Twins & TTTS Laser, Early-Onset FGR & Ductus Venosus, AFE & A-OK Protocol, and Resuscitative Hysterotomy / PMCD
 */

import { MONOCHORIONIC_TTTS_FETOSCOPIC_LASER_MODULE } from "./monochorionicTttsFetoscopicLaserContent";
import { FETAL_GROWTH_RESTRICTION_DOPPLER_DUCTUS_VENOUS_MODULE } from "./fetalGrowthRestrictionDopplerDuctusVenousContent";
import { AMNIOTIC_FLUID_EMBOLISM_AOK_RESUSCITATION_MODULE } from "./amnioticFluidEmbolismAOkResuscitationContent";
import { RESUSCITATIVE_HYSTEROTOMY_PMCD_ARREST_MODULE } from "./resuscitativeHysterotomyPmcdArrestContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./monochorionicTttsFetoscopicLaserContent";
export * from "./fetalGrowthRestrictionDopplerDuctusVenousContent";
export * from "./amnioticFluidEmbolismAOkResuscitationContent";
export * from "./resuscitativeHysterotomyPmcdArrestContent";

export const PG5_CORE_MODULES: PhysiologyLessonModule[] = [
  MONOCHORIONIC_TTTS_FETOSCOPIC_LASER_MODULE,
  FETAL_GROWTH_RESTRICTION_DOPPLER_DUCTUS_VENOUS_MODULE,
  AMNIOTIC_FLUID_EMBOLISM_AOK_RESUSCITATION_MODULE,
  RESUSCITATIVE_HYSTEROTOMY_PMCD_ARREST_MODULE
];

export function getPg5ModuleById(id: string): PhysiologyLessonModule | undefined {
  return PG5_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPg5ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PG5_CORE_MODULES.find(m => m.competencies.includes(code));
}
