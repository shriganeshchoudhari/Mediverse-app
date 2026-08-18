import {
  NEUROLOGY_ADV_CORE_MODULES,
  getNeurologyAdvModuleById,
  getNeurologyAdvModuleByCompetency,
  ISCHEMIC_STROKE_VASCULAR_LOCALIZATION_MODULE,
  INTRACRANIAL_HEMORRHAGES_TRAUMA_MODULE,
  DEMYELINATING_MOVEMENT_DISORDERS_MODULE,
  SPINAL_CORD_SYNDROMES_ALS_MODULE
} from "../../lib/curriculum/content/neurologyadv";

describe("Clinical Neurology & Stroke Localization (NEURO-301) Learning Content Modules", () => {
  it("should contain all 4 core Neurology Advanced modules", () => {
    expect(NEUROLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    NEUROLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const str = getNeurologyAdvModuleById("neurology-adv-ischemic-stroke-vascular-localization");
    expect(str).toBeDefined();
    expect(str?.title).toContain("Acute Ischemic Stroke");

    const hem = getNeurologyAdvModuleById("neurology-adv-intracranial-hemorrhages-trauma");
    expect(hem).toBeDefined();
    expect(hem?.title).toContain("Intracranial Hemorrhages");

    const dem = getNeurologyAdvModuleById("neurology-adv-demyelinating-movement-disorders");
    expect(dem).toBeDefined();
    expect(dem?.title).toContain("Multiple Sclerosis");

    const spi = getNeurologyAdvModuleById("neurology-adv-spinal-cord-syndromes-als");
    expect(spi).toBeDefined();
    expect(spi?.title).toContain("Spinal Cord Syndromes");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getNeurologyAdvModuleByCompetency("NE1.1")?.id).toBe(ISCHEMIC_STROKE_VASCULAR_LOCALIZATION_MODULE.id);
    expect(getNeurologyAdvModuleByCompetency("NE1.3")?.id).toBe(INTRACRANIAL_HEMORRHAGES_TRAUMA_MODULE.id);
    expect(getNeurologyAdvModuleByCompetency("NE1.5")?.id).toBe(DEMYELINATING_MOVEMENT_DISORDERS_MODULE.id);
    expect(getNeurologyAdvModuleByCompetency("NE1.7")?.id).toBe(SPINAL_CORD_SYNDROMES_ALS_MODULE.id);
  });
});
