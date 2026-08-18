/**
 * Master Advanced Anesthesiology, Perioperative Medicine & Pain Management (ANE-301) Learning Catalog
 * Comprehensive modules covering Difficult Airway (LEMON / FONA), Local Anesthetic Toxicity (LAST / Lipid Rescue), Anesthetic Pharmacology (Propofol / Malignant Hyperthermia), and Neuromuscular Blockade (TOF / Sugammadex)
 */

import { DIFFICULT_AIRWAY_CRICOTHYROIDOTOMY_MODULE } from "./difficultAirwayCricothyroidotomyContent";
import { LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE } from "./localAnestheticToxicityLipidRescueContent";
import { ANESTHETIC_PHARMACOLOGY_MALIGNANT_HYPERTHERMIA_MODULE } from "./anestheticPharmacologyMalignantHyperthermiaContent";
import { NEUROMUSCULAR_BLOCKADE_SUGAMMADEX_MODULE } from "./neuromuscularBlockadeSugammadexContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./difficultAirwayCricothyroidotomyContent";
export * from "./localAnestheticToxicityLipidRescueContent";
export * from "./anestheticPharmacologyMalignantHyperthermiaContent";
export * from "./neuromuscularBlockadeSugammadexContent";

export const ANESTHESIOLOGY_ADV_CORE_MODULES: PhysiologyLessonModule[] = [
  DIFFICULT_AIRWAY_CRICOTHYROIDOTOMY_MODULE,
  LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE,
  ANESTHETIC_PHARMACOLOGY_MALIGNANT_HYPERTHERMIA_MODULE,
  NEUROMUSCULAR_BLOCKADE_SUGAMMADEX_MODULE
];

export function getAnesthesiologyAdvModuleById(id: string): PhysiologyLessonModule | undefined {
  return ANESTHESIOLOGY_ADV_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getAnesthesiologyAdvModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return ANESTHESIOLOGY_ADV_CORE_MODULES.find(m => m.competencies.includes(code));
}
