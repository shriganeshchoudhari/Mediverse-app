/**
 * Master Internship Core Clinical Postings: Community Health & Rural Outreach (INT-506) Learning Catalog
 * Comprehensive modules covering National Health Programs (NTEP TB & NACP HIV), Vector-Borne Diseases & Malaria/Dengue (NVBDCP), Rural Primary Health Center (Ayushman Bharat HWCs & STI Kits), and Maternal-Child Nutrition & 10-Step Outbreak Investigation
 */

import { NATIONAL_HEALTH_PROGRAMS_NTEP_NACP_MODULE } from "./nationalHealthProgramsNtepNacpContent";
import { VECTOR_BORNE_DISEASES_MALARIA_DENGUE_MODULE } from "./vectorBorneDiseasesMalariaDengueContent";
import { RURAL_PRIMARY_CARE_AYUSHMAN_BHARAT_MODULE } from "./ruralPrimaryCareAyushmanBharatContent";
import { MATERNAL_CHILD_NUTRITION_OUTBREAK_CONTROL_MODULE } from "./maternalChildNutritionOutbreakControlContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./nationalHealthProgramsNtepNacpContent";
export * from "./vectorBorneDiseasesMalariaDengueContent";
export * from "./ruralPrimaryCareAyushmanBharatContent";
export * from "./maternalChildNutritionOutbreakControlContent";

export const INT6_CORE_MODULES: PhysiologyLessonModule[] = [
  NATIONAL_HEALTH_PROGRAMS_NTEP_NACP_MODULE,
  VECTOR_BORNE_DISEASES_MALARIA_DENGUE_MODULE,
  RURAL_PRIMARY_CARE_AYUSHMAN_BHARAT_MODULE,
  MATERNAL_CHILD_NUTRITION_OUTBREAK_CONTROL_MODULE
];

export function getInt6ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT6_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt6ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT6_CORE_MODULES.find(m => m.competencies.includes(code));
}
