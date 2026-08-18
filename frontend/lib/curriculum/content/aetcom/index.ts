/**
 * Master AETCOM & Medical Ethics (AETCOM-001) Learning Catalog
 * Comprehensive clinical coverage of Bioethics, Consent, SPIKES Protocol, Confidentiality & End-of-Life
 */

import { BIOETHICS_FOUR_PRINCIPLES_CONSENT_MODULE } from "./bioethicsFourPrinciplesConsentContent";
import { SPIKES_BREAKING_BAD_NEWS_MODULE } from "./spikesBreakingBadNewsContent";
import { CONFIDENTIALITY_TARASOFF_NEGLIGENCE_MODULE } from "./confidentialityTarasoffNegligenceContent";
import { END_OF_LIFE_EUTHANASIA_ORGAN_DONATION_MODULE } from "./endOfLifeEuthanasiaOrganDonationContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./bioethicsFourPrinciplesConsentContent";
export * from "./spikesBreakingBadNewsContent";
export * from "./confidentialityTarasoffNegligenceContent";
export * from "./endOfLifeEuthanasiaOrganDonationContent";

export const AETCOM_CORE_MODULES: PhysiologyLessonModule[] = [
  BIOETHICS_FOUR_PRINCIPLES_CONSENT_MODULE,
  SPIKES_BREAKING_BAD_NEWS_MODULE,
  CONFIDENTIALITY_TARASOFF_NEGLIGENCE_MODULE,
  END_OF_LIFE_EUTHANASIA_ORGAN_DONATION_MODULE
];

export function getAetcomModuleById(id: string): PhysiologyLessonModule | undefined {
  return AETCOM_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getAetcomModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return AETCOM_CORE_MODULES.find(m => m.competencies.includes(code));
}
