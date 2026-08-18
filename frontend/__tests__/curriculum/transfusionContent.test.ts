import {
  TRANSFUSION_CORE_MODULES,
  getTransfusionModuleById,
  getTransfusionModuleByCompetency,
  ABO_RH_ANTIGENS_COOMBS_TESTING_MODULE,
  BLOOD_COMPONENTS_MASSIVE_TRANSFUSION_MODULE,
  TRANSFUSION_REACTIONS_TRALI_TACO_AHTR_MODULE,
  APHERESIS_SAFETY_HDFN_RHOGAM_MODULE
} from "../../lib/curriculum/content/transfusion";

describe("Transfusion Medicine & Immunohematology (TRANS-301) Learning Content Modules", () => {
  it("should contain all 4 core Transfusion Medicine modules", () => {
    expect(TRANSFUSION_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    TRANSFUSION_CORE_MODULES.forEach((mod) => {
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
    const abo = getTransfusionModuleById("transfusion-abo-rh-antigens-coombs-testing");
    expect(abo).toBeDefined();
    expect(abo?.title).toContain("ABO/Rh Blood Groups");

    const comp = getTransfusionModuleById("transfusion-blood-components-massive-transfusion");
    expect(comp).toBeDefined();
    expect(comp?.title).toContain("Blood Component Therapy");

    const rxn = getTransfusionModuleById("transfusion-transfusion-reactions-trali-taco-ahtr");
    expect(rxn).toBeDefined();
    expect(rxn?.title).toContain("Transfusion Reactions");

    const aph = getTransfusionModuleById("transfusion-apheresis-safety-hdfn-rhogam");
    expect(aph).toBeDefined();
    expect(aph?.title).toContain("Therapeutic Apheresis");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getTransfusionModuleByCompetency("TR1.1")?.id).toBe(ABO_RH_ANTIGENS_COOMBS_TESTING_MODULE.id);
    expect(getTransfusionModuleByCompetency("TR3.1")?.id).toBe(BLOOD_COMPONENTS_MASSIVE_TRANSFUSION_MODULE.id);
    expect(getTransfusionModuleByCompetency("TR5.1")?.id).toBe(TRANSFUSION_REACTIONS_TRALI_TACO_AHTR_MODULE.id);
    expect(getTransfusionModuleByCompetency("TR7.1")?.id).toBe(APHERESIS_SAFETY_HDFN_RHOGAM_MODULE.id);
  });
});
