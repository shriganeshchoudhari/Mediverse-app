/**
 * Master Internship Core Clinical Postings: Procedural Skills & Point-of-Care Ultrasound (INT-502) Learning Catalog
 * Comprehensive modules covering Vascular Access & Arterial Lines, Paracentesis & Thoracentesis Fluid Analysis, Lumbar Puncture CSF Manometry, and POCUS Cardiac/Lung/Vascular
 */

import { VASCULAR_ACCESS_ARTERIAL_LINE_MODULE } from "./vascularAccessArterialLineContent";
import { PARACENTESIS_THORACENTESIS_FLUID_MODULE } from "./paracentesisThoracentesisFluidContent";
import { LUMBAR_PUNCTURE_CSF_MANOMETRY_MODULE } from "./lumbarPunctureCsfManometryContent";
import { POCUS_CARDIAC_LUNG_VASCULAR_MODULE } from "./pocusCardiacLungVascularContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./vascularAccessArterialLineContent";
export * from "./paracentesisThoracentesisFluidContent";
export * from "./lumbarPunctureCsfManometryContent";
export * from "./pocusCardiacLungVascularContent";

export const INT2_CORE_MODULES: PhysiologyLessonModule[] = [
  VASCULAR_ACCESS_ARTERIAL_LINE_MODULE,
  PARACENTESIS_THORACENTESIS_FLUID_MODULE,
  LUMBAR_PUNCTURE_CSF_MANOMETRY_MODULE,
  POCUS_CARDIAC_LUNG_VASCULAR_MODULE
];

export function getInt2ModuleById(id: string): PhysiologyLessonModule | undefined {
  return INT2_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getInt2ModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return INT2_CORE_MODULES.find(m => m.competencies.includes(code));
}
