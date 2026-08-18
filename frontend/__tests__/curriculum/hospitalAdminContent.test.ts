import {
  HOSPITAL_ADMIN_CORE_MODULES,
  getHospitalAdminModuleById,
  getHospitalAdminModuleByCompetency,
  BIOMEDICAL_WASTE_MANAGEMENT_RULES_2016_MODULE,
  HOSPITAL_INFECTION_CONTROL_CARE_BUNDLES_MODULE,
  HEALTHCARE_QUALITY_ACCREDITATION_AUDITS_MODULE,
  PATIENT_SAFETY_RISK_MANAGEMENT_RCA_MODULE
} from "../../lib/curriculum/content/hospitaladmin";

describe("Hospital Administration & Healthcare Quality (HADM-401) Learning Content Modules", () => {
  it("should contain all 4 core Hospital Administration modules", () => {
    expect(HOSPITAL_ADMIN_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    HOSPITAL_ADMIN_CORE_MODULES.forEach((mod) => {
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
    const bmw = getHospitalAdminModuleById("hospital-admin-biomedical-waste-management-rules-2016");
    expect(bmw).toBeDefined();
    expect(bmw?.title).toContain("Biomedical Waste Management");

    const hic = getHospitalAdminModuleById("hospital-admin-hospital-infection-control-care-bundles");
    expect(hic).toBeDefined();
    expect(hic?.title).toContain("Hospital Infection Control");

    const qual = getHospitalAdminModuleById("hospital-admin-healthcare-quality-accreditation-audits");
    expect(qual).toBeDefined();
    expect(qual?.title).toContain("Healthcare Quality");

    const rca = getHospitalAdminModuleById("hospital-admin-patient-safety-risk-management-rca");
    expect(rca).toBeDefined();
    expect(rca?.title).toContain("Patient Safety");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getHospitalAdminModuleByCompetency("HA1.1")?.id).toBe(BIOMEDICAL_WASTE_MANAGEMENT_RULES_2016_MODULE.id);
    expect(getHospitalAdminModuleByCompetency("HA3.1")?.id).toBe(HOSPITAL_INFECTION_CONTROL_CARE_BUNDLES_MODULE.id);
    expect(getHospitalAdminModuleByCompetency("HA5.1")?.id).toBe(HEALTHCARE_QUALITY_ACCREDITATION_AUDITS_MODULE.id);
    expect(getHospitalAdminModuleByCompetency("HA7.1")?.id).toBe(PATIENT_SAFETY_RISK_MANAGEMENT_RCA_MODULE.id);
  });
});
