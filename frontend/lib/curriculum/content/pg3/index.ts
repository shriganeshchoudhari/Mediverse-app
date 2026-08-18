/**
 * Master Postgraduate Advanced General Surgery & Trauma Critical Care (PG-603) Learning Catalog
 * Comprehensive modules covering Damage Control Surgery & The Lethal Triad, Complex Hepatic/Pancreatic Trauma, REBOA Zones, and Viscoelastometry-Guided Transfusion
 */

import { DAMAGE_CONTROL_LAPAROTOMY_LETHAL_TRIAD_MODULE } from "./damageControlLaparotomyLethalTriadContent";
import { COMPLEX_HEPATIC_PANCREATIC_VASCULAR_TRAUMA_MODULE } from "./complexHepaticPancreaticVascularTraumaContent";
import { REBOA_AORTIC_BALLOON_OCCLUSION_ZONES_MODULE } from "./reboaAorticBalloonOcclusionZonesContent";
import { VISCOELASTOMETRY_TEG_ROTEM_MASSIVE_TRANSFUSION_MODULE } from "./viscoelastometryTegRotemMassiveTransfusionContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./damageControlLaparotomyLethalTriadContent";
export * from "./complexHepaticPancreaticVascularTraumaContent";
export * from "./reboaAorticBalloonOcclusionZonesContent";
export * from "./viscoelastometryTegRotemMassiveTransfusionContent";

export const PG3_CORE_MODULES: PhysiologyLessonModule[] = [
  DAMAGE_CONTROL_LAPAROTOMY_LETHAL_TRIAD_MODULE,
  COMPLEX_HEPATIC_PANCREATIC_VASCULAR_TRAUMA_MODULE,
  REBOA_AORTIC_BALLOON_OCCLUSION_ZONES_MODULE,
  VISCOELASTOMETRY_TEG_ROTEM_MASSIVE_TRANSFUSION_MODULE
];

export function getPg3ModuleById(id: string): PhysiologyLessonModule | undefined {
  return PG3_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPg3ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PG3_CORE_MODULES.find(m => m.competencies.includes(code));
}
