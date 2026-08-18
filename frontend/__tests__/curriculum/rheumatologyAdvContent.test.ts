import {
  RHEUMATOLOGY_ADV_CORE_MODULES,
  getRheumatologyAdvModuleById,
  getRheumatologyAdvModuleByCompetency,
  SLE_LUPUS_NEPHRITIS_MODULE,
  RHEUMATOID_ARTHRITIS_POLYARTHRITIS_MODULE,
  SYSTEMIC_SCLEROSIS_RENAL_CRISIS_MODULE,
  SPONDYLOARTHROPATHIES_CRYSTALS_GCA_MODULE
} from "../../lib/curriculum/content/rheumatologyadv";

describe("Clinical Rheumatology & Autoimmune Disorders (RHEUM-301) Learning Content Modules", () => {
  it("should contain all 4 core Rheumatology Advanced modules", () => {
    expect(RHEUMATOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    RHEUMATOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const sle = getRheumatologyAdvModuleById("rheumatology-adv-sle-lupus-nephritis");
    expect(sle).toBeDefined();
    expect(sle?.title).toContain("Systemic Lupus Erythematosus");

    const ra = getRheumatologyAdvModuleById("rheumatology-adv-rheumatoid-arthritis-polyarthritis");
    expect(ra).toBeDefined();
    expect(ra?.title).toContain("Rheumatoid Arthritis");

    const scl = getRheumatologyAdvModuleById("rheumatology-adv-systemic-sclerosis-renal-crisis");
    expect(scl).toBeDefined();
    expect(scl?.title).toContain("Systemic Sclerosis");

    const cryst = getRheumatologyAdvModuleById("rheumatology-adv-spondyloarthropathies-crystals-gca");
    expect(cryst).toBeDefined();
    expect(cryst?.title).toContain("Ankylosing Spondylitis");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getRheumatologyAdvModuleByCompetency("IM1.1")?.id).toBe(SLE_LUPUS_NEPHRITIS_MODULE.id);
    expect(getRheumatologyAdvModuleByCompetency("IM1.3")?.id).toBe(RHEUMATOID_ARTHRITIS_POLYARTHRITIS_MODULE.id);
    expect(getRheumatologyAdvModuleByCompetency("IM1.5")?.id).toBe(SYSTEMIC_SCLEROSIS_RENAL_CRISIS_MODULE.id);
    expect(getRheumatologyAdvModuleByCompetency("IM1.7")?.id).toBe(SPONDYLOARTHROPATHIES_CRYSTALS_GCA_MODULE.id);
  });
});
