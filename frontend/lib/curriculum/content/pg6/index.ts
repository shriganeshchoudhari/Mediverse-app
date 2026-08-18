/**
 * Postgraduate Advanced Anesthesiology, Perioperative Medicine & Pain Critical Care (PG-606) Curriculum Index
 * Authoritative learning modules covering Malignant Hyperthermia, LAST & Lipid Rescue, TIVA/TCI Neuromonitoring, and ERAS Pathways.
 * Mapped to NMC PG CBME Competencies PG6.1 - PG6.4.
 */

import { MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE } from "./malignantHyperthermiaDantroleneRescueContent";
import { LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE } from "./localAnestheticToxicityLipidRescueContent";
import { TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE } from "./tivaTargetControlledInfusionNeuromonitoringContent";
import { ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE } from "./erasMultimodalOpioidSparingAnalgesiaContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export const PG6_CURRICULUM_MODULES: PhysiologyLessonModule[] = [
  MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE,
  LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE,
  TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE,
  ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE
];

export {
  MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE,
  LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE,
  TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE,
  ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE
};
