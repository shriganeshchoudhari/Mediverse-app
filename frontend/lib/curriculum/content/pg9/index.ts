/**
 * Postgraduate Advanced Otorhinolaryngology, Head & Neck Oncology & Skull Base Surgery (PG-609) Curriculum Index
 * Authoritative learning modules covering Advanced Laryngeal Carcinoma & Flaps, FESS & CSF Leak Repair, Cholesteatoma & Lateral Skull Base, and Deep Neck Space Infections.
 * Mapped to NMC PG CBME Competencies PG9.1 - PG9.4.
 */

import { ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE } from "./advancedLaryngealCarcinomaFlapReconstructionContent";
import { ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE } from "./endoscopicSinusSkullBaseCsfLeakContent";
import { CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE } from "./cholesteatomaMastoidectomyLateralSkullBaseContent";
import { DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE } from "./deepNeckSpaceInfectionsEmergencyAirwayContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PG9_CURRICULUM_MODULES: PhysiologyLessonModule[] = [
  ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE,
  ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE,
  CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE,
  DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE
];

export {
  ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE,
  ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE,
  CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE,
  DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE
};
