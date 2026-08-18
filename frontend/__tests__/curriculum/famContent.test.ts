import {
  FAM_CORE_MODULES,
  getFamModuleById,
  getFamModuleByCompetency,
  PREVENTIVE_SCREENING_USPSTF_MODULE,
  CHRONIC_DISEASE_PROTOCOLS_MODULE,
  GERIATRIC_ASSESSMENT_BEERS_MODULE,
  OUTPATIENT_TRIAGE_RED_FLAGS_MODULE
} from "../../lib/curriculum/content/fam";

describe("Family Medicine & Primary Care (FAM-401) Content Modules", () => {
  it("should contain all 4 core Family Medicine modules", () => {
    expect(FAM_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    FAM_CORE_MODULES.forEach((mod) => {
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
    const screening = getFamModuleById("fam-preventive-screening-uspstf");
    expect(screening).toBeDefined();
    expect(screening?.title).toContain("Preventive Health Screening");

    const chronic = getFamModuleById("fam-chronic-disease-protocols");
    expect(chronic).toBeDefined();
    expect(chronic?.title).toContain("Chronic Disease Protocols");

    const geriatrics = getFamModuleById("fam-geriatric-assessment-beers");
    expect(geriatrics).toBeDefined();
    expect(geriatrics?.title).toContain("Geriatric Assessment");

    const triage = getFamModuleById("fam-outpatient-triage-red-flags");
    expect(triage).toBeDefined();
    expect(triage?.title).toContain("Outpatient Triage");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getFamModuleByCompetency("FM1.1")?.id).toBe(PREVENTIVE_SCREENING_USPSTF_MODULE.id);
    expect(getFamModuleByCompetency("FM1.2")?.id).toBe(CHRONIC_DISEASE_PROTOCOLS_MODULE.id);
    expect(getFamModuleByCompetency("FM1.3")?.id).toBe(GERIATRIC_ASSESSMENT_BEERS_MODULE.id);
    expect(getFamModuleByCompetency("FM1.4")?.id).toBe(OUTPATIENT_TRIAGE_RED_FLAGS_MODULE.id);
  });
});
