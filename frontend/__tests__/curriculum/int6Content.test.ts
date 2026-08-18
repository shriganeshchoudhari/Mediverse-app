import {
  INT6_CORE_MODULES,
  getInt6ModuleById,
  getInt6ModuleByCompetency,
  NATIONAL_HEALTH_PROGRAMS_NTEP_NACP_MODULE,
  VECTOR_BORNE_DISEASES_MALARIA_DENGUE_MODULE,
  RURAL_PRIMARY_CARE_AYUSHMAN_BHARAT_MODULE,
  MATERNAL_CHILD_NUTRITION_OUTBREAK_CONTROL_MODULE
} from "../../lib/curriculum/content/int6";

describe("Internship Core Community Health & Rural Outreach (INT-506) Content Modules", () => {
  it("should contain all 4 core Internship Community Health modules", () => {
    expect(INT6_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    INT6_CORE_MODULES.forEach((mod) => {
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
    const ntep = getInt6ModuleById("int6-national-health-programs-ntep-nacp");
    expect(ntep).toBeDefined();
    expect(ntep?.title).toContain("National Health Programs");

    const malaria = getInt6ModuleById("int6-vector-borne-diseases-malaria-dengue");
    expect(malaria).toBeDefined();
    expect(malaria?.title).toContain("Vector-Borne Diseases");

    const primary = getInt6ModuleById("int6-rural-primary-care-ayushman-bharat");
    expect(primary).toBeDefined();
    expect(primary?.title).toContain("Rural Primary Care");

    const nutrition = getInt6ModuleById("int6-maternal-child-nutrition-outbreak-control");
    expect(nutrition).toBeDefined();
    expect(nutrition?.title).toContain("Maternal-Child Nutrition");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getInt6ModuleByCompetency("IN6.1")?.id).toBe(NATIONAL_HEALTH_PROGRAMS_NTEP_NACP_MODULE.id);
    expect(getInt6ModuleByCompetency("IN6.2")?.id).toBe(VECTOR_BORNE_DISEASES_MALARIA_DENGUE_MODULE.id);
    expect(getInt6ModuleByCompetency("IN6.3")?.id).toBe(RURAL_PRIMARY_CARE_AYUSHMAN_BHARAT_MODULE.id);
    expect(getInt6ModuleByCompetency("IN6.4")?.id).toBe(MATERNAL_CHILD_NUTRITION_OUTBREAK_CONTROL_MODULE.id);
  });
});
