/**
 * Master Clinical Pharmacology & Rational Therapeutics (PHARM-301) Learning Catalog
 * Comprehensive modules covering Therapeutic Drug Monitoring, Antimicrobial Resistance, Anticoagulation Reversals, and Chemotherapy Toxicities
 */

import { THERAPEUTIC_DRUG_MONITORING_KINETICS_MODULE } from "./therapeuticDrugMonitoringKineticsContent";
import { ANTIMICROBIAL_STEWARDSHIP_RESISTANCE_MODULE } from "./antimicrobialStewardshipResistanceContent";
import { ANTICOAGULATION_REVERSAL_AGENTS_MODULE } from "./anticoagulationReversalAgentsContent";
import { CHEMOTHERAPY_TOXICITIES_RESCUE_MODULE } from "./chemotherapyToxicitiesRescueContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./therapeuticDrugMonitoringKineticsContent";
export * from "./antimicrobialStewardshipResistanceContent";
export * from "./anticoagulationReversalAgentsContent";
export * from "./chemotherapyToxicitiesRescueContent";

export const PHARMACOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  THERAPEUTIC_DRUG_MONITORING_KINETICS_MODULE,
  ANTIMICROBIAL_STEWARDSHIP_RESISTANCE_MODULE,
  ANTICOAGULATION_REVERSAL_AGENTS_MODULE,
  CHEMOTHERAPY_TOXICITIES_RESCUE_MODULE
];

export function getPharmacologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return PHARMACOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getPharmacologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return PHARMACOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
