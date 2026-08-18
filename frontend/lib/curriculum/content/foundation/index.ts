/**
 * Master Foundation Course & Early Clinical Exposure (FND-101 / ECE-101) Learning Catalog
 * Comprehensive modules covering Doctor-Patient Communication, Medical Ethics & Bioethics, Hospital Infection Control, and Vital Signs & GCS
 */

import { DOCTOR_PATIENT_COMMUNICATION_SPIKES_MODULE } from "./doctorPatientCommunicationSpikesContent";
import { MEDICAL_ETHICS_BIOETHICS_AUTONOMY_MODULE } from "./medicalEthicsBioethicsAutonomyContent";
import { INFECTION_CONTROL_PPE_UNIVERSAL_PRECAUTIONS_MODULE } from "./infectionControlPpeUniversalPrecautionsContent";
import { VITAL_SIGNS_CLINICAL_TRIAGE_GCS_MODULE } from "./vitalSignsClinicalTriageGcsContent";
import { PhysiologyLessonModule } from "../physiology/cardiacCycleContent";

export * from "./doctorPatientCommunicationSpikesContent";
export * from "./medicalEthicsBioethicsAutonomyContent";
export * from "./infectionControlPpeUniversalPrecautionsContent";
export * from "./vitalSignsClinicalTriageGcsContent";

export const FOUNDATION_CORE_MODULES: PhysiologyLessonModule[] = [
  DOCTOR_PATIENT_COMMUNICATION_SPIKES_MODULE,
  MEDICAL_ETHICS_BIOETHICS_AUTONOMY_MODULE,
  INFECTION_CONTROL_PPE_UNIVERSAL_PRECAUTIONS_MODULE,
  VITAL_SIGNS_CLINICAL_TRIAGE_GCS_MODULE
];

export function getFoundationModuleById(id: string): PhysiologyLessonModule | undefined {
  return FOUNDATION_CORE_MODULES.find(m => m.id === id || m.unitCode.toLowerCase() === id.toLowerCase());
}

export function getFoundationModuleByCompetency(code: string): PhysiologyLessonModule | undefined {
  return FOUNDATION_CORE_MODULES.find(m => m.competencies.includes(code));
}
