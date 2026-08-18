import {
  CLIN2_CORE_MODULES,
  getClin2ModuleById,
  getClin2ModuleByCompetency,
  PREOPERATIVE_RISK_STRATIFICATION_MODULE,
  POSTOPERATIVE_FEVER_5WS_MODULE,
  SURGICAL_DRAINS_CHEST_TUBE_PHYSICS_MODULE,
  WOUND_DEHISCENCE_EVISCERATION_EMERGENCY_MODULE
} from "../../lib/curriculum/content/clin2";

describe("Clinical Postings II (CLIN-302) Content Modules", () => {
  it("should contain all 4 core Clinical Postings II modules", () => {
    expect(CLIN2_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    CLIN2_CORE_MODULES.forEach((mod) => {
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
    const preop = getClin2ModuleById("clin2-preoperative-risk-stratification");
    expect(preop).toBeDefined();
    expect(preop?.title).toContain("Preoperative Risk");

    const fever = getClin2ModuleById("clin2-postoperative-fever-5ws");
    expect(fever).toBeDefined();
    expect(fever?.title).toContain("Postoperative Fever");

    const drains = getClin2ModuleById("clin2-surgical-drains-chest-tube-physics");
    expect(drains).toBeDefined();
    expect(drains?.title).toContain("Surgical Drains");

    const wounds = getClin2ModuleById("clin2-wound-dehiscence-evisceration-emergency");
    expect(wounds).toBeDefined();
    expect(wounds?.title).toContain("Wound Complications");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getClin2ModuleByCompetency("CP2.1")?.id).toBe(PREOPERATIVE_RISK_STRATIFICATION_MODULE.id);
    expect(getClin2ModuleByCompetency("CP2.2")?.id).toBe(POSTOPERATIVE_FEVER_5WS_MODULE.id);
    expect(getClin2ModuleByCompetency("CP2.3")?.id).toBe(SURGICAL_DRAINS_CHEST_TUBE_PHYSICS_MODULE.id);
    expect(getClin2ModuleByCompetency("CP2.4")?.id).toBe(WOUND_DEHISCENCE_EVISCERATION_EMERGENCY_MODULE.id);
  });
});
