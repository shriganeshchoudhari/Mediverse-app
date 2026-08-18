import {
  FOUNDATION_CORE_MODULES,
  getFoundationModuleById,
  getFoundationModuleByCompetency,
  DOCTOR_PATIENT_COMMUNICATION_SPIKES_MODULE,
  MEDICAL_ETHICS_BIOETHICS_AUTONOMY_MODULE,
  INFECTION_CONTROL_PPE_UNIVERSAL_PRECAUTIONS_MODULE,
  VITAL_SIGNS_CLINICAL_TRIAGE_GCS_MODULE
} from "../../lib/curriculum/content/foundation";

describe("Foundation Course & Early Clinical Exposure (FND-101) Content Modules", () => {
  it("should contain all 4 core Foundation Course modules", () => {
    expect(FOUNDATION_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    FOUNDATION_CORE_MODULES.forEach((mod) => {
      expect(mod.id).toBeTruthy();
      expect(mod.unitCode).toBeTruthy();
      expect(mod.title).toBeTruthy();
      expect(mod.markdownContent.length).toBeGreaterThan(500);
      expect(mod.clinicalVignettes.length).toBeGreaterThan(0);
      expect(mod.clinicalVignettes[0].scenario).toBeTruthy();
      expect(mod.clinicalVignettes[0].question).toBeTruthy();
      expect(mod.clinicalVignettes[0].explanation).toBeTruthy();
    });
  });

  it("should retrieve modules by ID", () => {
    const comm = getFoundationModuleById("foundation-doctor-patient-communication-spikes");
    expect(comm).toBeDefined();
    expect(comm?.title).toContain("Doctor-Patient Communication");

    const eth = getFoundationModuleById("foundation-medical-ethics-bioethics-autonomy");
    expect(eth).toBeDefined();
    expect(eth?.title).toContain("Medical Ethics & Bioethics");

    const inf = getFoundationModuleById("foundation-infection-control-ppe-universal-precautions");
    expect(inf).toBeDefined();
    expect(inf?.title).toContain("Hospital Infection Control");

    const vit = getFoundationModuleById("foundation-vital-signs-clinical-triage-gcs");
    expect(vit).toBeDefined();
    expect(vit?.title).toContain("Vital Signs & Clinical Triage");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getFoundationModuleByCompetency("FC1.1")?.id).toBe(DOCTOR_PATIENT_COMMUNICATION_SPIKES_MODULE.id);
    expect(getFoundationModuleByCompetency("FC3.1")?.id).toBe(MEDICAL_ETHICS_BIOETHICS_AUTONOMY_MODULE.id);
    expect(getFoundationModuleByCompetency("FC5.1")?.id).toBe(INFECTION_CONTROL_PPE_UNIVERSAL_PRECAUTIONS_MODULE.id);
    expect(getFoundationModuleByCompetency("FC7.1")?.id).toBe(VITAL_SIGNS_CLINICAL_TRIAGE_GCS_MODULE.id);
  });
});
