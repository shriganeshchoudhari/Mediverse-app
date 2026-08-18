import {
  PG3_CORE_MODULES,
  getPg3ModuleById,
  getPg3ModuleByCompetency,
  DAMAGE_CONTROL_LAPAROTOMY_LETHAL_TRIAD_MODULE,
  COMPLEX_HEPATIC_PANCREATIC_VASCULAR_TRAUMA_MODULE,
  REBOA_AORTIC_BALLOON_OCCLUSION_ZONES_MODULE,
  VISCOELASTOMETRY_TEG_ROTEM_MASSIVE_TRANSFUSION_MODULE
} from "../../lib/curriculum/content/pg3";

describe("Postgraduate Advanced General Surgery & Trauma Critical Care (PG-603) Content Modules", () => {
  it("should contain all 4 core Postgraduate Trauma Surgery modules", () => {
    expect(PG3_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    PG3_CORE_MODULES.forEach((mod) => {
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
    const dcl = getPg3ModuleById("pg3-damage-control-laparotomy-lethal-triad");
    expect(dcl).toBeDefined();
    expect(dcl?.title).toContain("Damage Control Laparotomy");

    const visceral = getPg3ModuleById("pg3-complex-hepatic-pancreatic-vascular-trauma");
    expect(visceral).toBeDefined();
    expect(visceral?.title).toContain("Complex Hepatic");

    const reboa = getPg3ModuleById("pg3-reboa-aortic-balloon-occlusion-zones");
    expect(reboa).toBeDefined();
    expect(reboa?.title).toContain("Resuscitative Endovascular Balloon Occlusion");

    const teg = getPg3ModuleById("pg3-viscoelastometry-teg-rotem-massive-transfusion");
    expect(teg).toBeDefined();
    expect(teg?.title).toContain("Viscoelastometry in Trauma");
  });

  it("should retrieve modules by NMC PG CBME competency code", () => {
    expect(getPg3ModuleByCompetency("PG3.1")?.id).toBe(DAMAGE_CONTROL_LAPAROTOMY_LETHAL_TRIAD_MODULE.id);
    expect(getPg3ModuleByCompetency("PG3.2")?.id).toBe(COMPLEX_HEPATIC_PANCREATIC_VASCULAR_TRAUMA_MODULE.id);
    expect(getPg3ModuleByCompetency("PG3.3")?.id).toBe(REBOA_AORTIC_BALLOON_OCCLUSION_ZONES_MODULE.id);
    expect(getPg3ModuleByCompetency("PG3.4")?.id).toBe(VISCOELASTOMETRY_TEG_ROTEM_MASSIVE_TRANSFUSION_MODULE.id);
  });
});
