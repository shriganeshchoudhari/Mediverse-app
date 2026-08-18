/**
 * Master Pharmacology & Therapeutics (PHARM-201) Learning Catalog
 * Comprehensive coverage of PK/PD, Autonomics, Cardiorenal, and Antimicrobial Pharmacology
 */

import { PHARMACOKINETICS_DYNAMICS_MODULE } from "./pharmacokineticsDynamicsContent";
import { AUTONOMIC_PHARMACOLOGY_MODULE } from "./autonomicPharmacologyContent";
import { CARDIOVASCULAR_RENAL_PHARM_MODULE } from "./cardiovascularRenalPharmContent";
import { ANTIMICROBIAL_CHEMOTHERAPY_MODULE } from "./antimicrobialChemotherapyContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./pharmacokineticsDynamicsContent";
export * from "./autonomicPharmacologyContent";
export * from "./cardiovascularRenalPharmContent";
export * from "./antimicrobialChemotherapyContent";

export const PHARMACOLOGY_CORE_MODULES: PhysiologyLessonModule[] = [
  PHARMACOKINETICS_DYNAMICS_MODULE,
  AUTONOMIC_PHARMACOLOGY_MODULE,
  CARDIOVASCULAR_RENAL_PHARM_MODULE,
  ANTIMICROBIAL_CHEMOTHERAPY_MODULE
];

export function getPharmacologyModuleById(id: string): PhysiologyLessonModule | undefined {
  return PHARMACOLOGY_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPharmacologyModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PHARMACOLOGY_CORE_MODULES.find(m => m.competencies.includes(code));
}
