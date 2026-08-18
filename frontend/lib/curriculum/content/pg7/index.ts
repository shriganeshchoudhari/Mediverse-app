/**
 * Postgraduate Advanced Orthopedics & Musculoskeletal Oncology (PG-607) Curriculum Index
 * Authoritative learning modules covering Pelvic Ring Disruptions, Open Fractures & MESS, Acute Compartment Syndrome, and Musculoskeletal Oncology.
 * Mapped to NMC PG CBME Competencies PG7.1 - PG7.4.
 */

import { PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE } from "./pelvicRingDisruptionHemorrhageContent";
import { OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE } from "./openFractureMangledExtremityContent";
import { ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE } from "./acuteCompartmentSyndromeFasciotomyContent";
import { MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE } from "./musculoskeletalOncologyLimbSalvageContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PG7_CURRICULUM_MODULES: PhysiologyLessonModule[] = [
  PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE,
  OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE,
  ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE,
  MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE
];

export {
  PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE,
  OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE,
  ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE,
  MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE
};
