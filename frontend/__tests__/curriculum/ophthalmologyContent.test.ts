import {
  OPHTHALMOLOGY_CORE_MODULES,
  getOphthalmologyModuleById,
  getOphthalmologyModuleByCompetency,
  GLAUCOMA_PATHOPHYSIOLOGY_TRIAGE_MODULE,
  CATARACT_PHACO_LENS_MODULE,
  SLIT_LAMP_CORNEA_REFRACTION_MODULE,
  RETINA_VASCULAR_EMERGENCIES_MODULE
} from "../../lib/curriculum/content/ophthalmology";

describe("Ophthalmology (OPHTH-301) Learning Content Modules", () => {
  it("should contain all 4 core ophthalmology modules", () => {
    expect(OPHTHALMOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    OPHTHALMOLOGY_CORE_MODULES.forEach((mod) => {
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
    const glauc = getOphthalmologyModuleById("ophth-glaucoma-triage");
    expect(glauc).toBeDefined();
    expect(glauc?.title).toContain("Glaucoma");

    const cat = getOphthalmologyModuleById("ophth-cataract-phaco");
    expect(cat).toBeDefined();
    expect(cat?.title).toContain("Cataracts");

    const slit = getOphthalmologyModuleById("ophth-slit-lamp-cornea");
    expect(slit).toBeDefined();
    expect(slit?.title).toContain("Slit-Lamp");

    const ret = getOphthalmologyModuleById("ophth-retina-emergencies");
    expect(ret).toBeDefined();
    expect(ret?.title).toContain("Retinal");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOphthalmologyModuleByCompetency("OP1.1")?.id).toBe(GLAUCOMA_PATHOPHYSIOLOGY_TRIAGE_MODULE.id);
    expect(getOphthalmologyModuleByCompetency("OP3.1")?.id).toBe(CATARACT_PHACO_LENS_MODULE.id);
    expect(getOphthalmologyModuleByCompetency("OP5.1")?.id).toBe(SLIT_LAMP_CORNEA_REFRACTION_MODULE.id);
    expect(getOphthalmologyModuleByCompetency("OP7.1")?.id).toBe(RETINA_VASCULAR_EMERGENCIES_MODULE.id);
  });
});
