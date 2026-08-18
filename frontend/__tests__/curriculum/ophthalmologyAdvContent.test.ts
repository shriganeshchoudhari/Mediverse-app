import {
  OPHTHALMOLOGY_ADV_CORE_MODULES,
  getOphthalmologyAdvModuleById,
  getOphthalmologyAdvModuleByCompetency,
  ANGLE_CLOSURE_GLAUCOMA_IRIDOTOMY_MODULE,
  RETINAL_VASCULAR_DETACHMENT_EMERGENCIES_MODULE,
  UVEITIS_OCULAR_IMMUNOLOGY_RETINITIS_MODULE,
  CORNEAL_ULCERS_REFRACTIVE_SURGERY_MODULE
} from "../../lib/curriculum/content/ophthalmologyadv";

describe("Clinical Ophthalmology Advanced (OPH-301) Learning Content Modules", () => {
  it("should contain all 4 core Ophthalmology Advanced modules", () => {
    expect(OPHTHALMOLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    OPHTHALMOLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const gl = getOphthalmologyAdvModuleById("ophthalmology-adv-angle-closure-glaucoma");
    expect(gl).toBeDefined();
    expect(gl?.title).toContain("Acute Angle-Closure Glaucoma");

    const ret = getOphthalmologyAdvModuleById("ophthalmology-adv-retinal-emergencies");
    expect(ret).toBeDefined();
    expect(ret?.title).toContain("Retinal Emergencies");

    const uve = getOphthalmologyAdvModuleById("ophthalmology-adv-uveitis-retinitis");
    expect(uve).toBeDefined();
    expect(uve?.title).toContain("Uveitis & Ocular Immunology");

    const cor = getOphthalmologyAdvModuleById("ophthalmology-adv-corneal-ulcers");
    expect(cor).toBeDefined();
    expect(cor?.title).toContain("Corneal Ulcers & Keratitis");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOphthalmologyAdvModuleByCompetency("OP1.1")?.id).toBe(ANGLE_CLOSURE_GLAUCOMA_IRIDOTOMY_MODULE.id);
    expect(getOphthalmologyAdvModuleByCompetency("OP3.1")?.id).toBe(RETINAL_VASCULAR_DETACHMENT_EMERGENCIES_MODULE.id);
    expect(getOphthalmologyAdvModuleByCompetency("OP5.1")?.id).toBe(UVEITIS_OCULAR_IMMUNOLOGY_RETINITIS_MODULE.id);
    expect(getOphthalmologyAdvModuleByCompetency("OP7.1")?.id).toBe(CORNEAL_ULCERS_REFRACTIVE_SURGERY_MODULE.id);
  });
});
