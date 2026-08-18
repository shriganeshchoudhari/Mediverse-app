import {
  COMMUNITY_CORE_MODULES,
  getCommunityModuleById,
  getCommunityModuleByCompetency,
  EPIDEMIOLOGICAL_STUDIES_MODULE,
  BIOSTATISTICS_SCREENING_MODULE,
  INFECTIOUS_DISEASE_PUBLIC_HEALTH_MODULE,
  DEMOGRAPHY_HEALTH_ECONOMICS_MODULE
} from "../../lib/curriculum/content/community";

describe("Community Medicine & Public Health (COMM-201) Learning Content Modules", () => {
  it("should contain all 4 core community medicine modules", () => {
    expect(COMMUNITY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    COMMUNITY_CORE_MODULES.forEach((mod) => {
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
    const epi = getCommunityModuleById("comm-epidemiology");
    expect(epi).toBeDefined();
    expect(epi?.title).toContain("Epidemiological Study Designs");

    const bio = getCommunityModuleById("comm-biostatistics");
    expect(bio).toBeDefined();
    expect(bio?.title).toContain("Biostatistics");

    const inf = getCommunityModuleById("comm-infectious-prevention");
    expect(inf).toBeDefined();
    expect(inf?.title).toContain("Infectious Disease Dynamics");

    const dem = getCommunityModuleById("comm-demography");
    expect(dem).toBeDefined();
    expect(dem?.title).toContain("Demography");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getCommunityModuleByCompetency("CM1.1")?.id).toBe(EPIDEMIOLOGICAL_STUDIES_MODULE.id);
    expect(getCommunityModuleByCompetency("CM2.1")?.id).toBe(BIOSTATISTICS_SCREENING_MODULE.id);
    expect(getCommunityModuleByCompetency("CM3.1")?.id).toBe(INFECTIOUS_DISEASE_PUBLIC_HEALTH_MODULE.id);
    expect(getCommunityModuleByCompetency("CM7.1")?.id).toBe(DEMOGRAPHY_HEALTH_ECONOMICS_MODULE.id);
  });
});
