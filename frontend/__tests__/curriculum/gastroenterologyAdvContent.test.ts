import {
  GASTROENTEROLOGY_ADV_CORE_MODULES,
  getGastroenterologyAdvModuleById,
  getGastroenterologyAdvModuleByCompetency,
  CIRRHOSIS_PORTAL_HYPERTENSION_MODULE,
  JAUNDICE_BILIRUBIN_METABOLISM_MODULE,
  INFLAMMATORY_BOWEL_DISEASE_MODULE,
  PANCREATITIS_MALABSORPTION_MODULE
} from "../../lib/curriculum/content/gastroenterologyadv";

describe("Clinical Gastroenterology & Hepatology (GASTRO-301) Learning Content Modules", () => {
  it("should contain all 4 core Gastroenterology Advanced modules", () => {
    expect(GASTROENTEROLOGY_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    GASTROENTEROLOGY_ADV_CORE_MODULES.forEach((mod) => {
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
    const cirr = getGastroenterologyAdvModuleById("gastroenterology-adv-cirrhosis-portal-hypertension");
    expect(cirr).toBeDefined();
    expect(cirr?.title).toContain("Cirrhosis");

    const jaund = getGastroenterologyAdvModuleById("gastroenterology-adv-jaundice-bilirubin-metabolism");
    expect(jaund).toBeDefined();
    expect(jaund?.title).toContain("Jaundice");

    const ibd = getGastroenterologyAdvModuleById("gastroenterology-adv-inflammatory-bowel-disease");
    expect(ibd).toBeDefined();
    expect(ibd?.title).toContain("Inflammatory Bowel Disease");

    const panc = getGastroenterologyAdvModuleById("gastroenterology-adv-pancreatitis-malabsorption");
    expect(panc).toBeDefined();
    expect(panc?.title).toContain("Pancreatitis");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getGastroenterologyAdvModuleByCompetency("IM7.1")?.id).toBe(CIRRHOSIS_PORTAL_HYPERTENSION_MODULE.id);
    expect(getGastroenterologyAdvModuleByCompetency("IM8.1")?.id).toBe(JAUNDICE_BILIRUBIN_METABOLISM_MODULE.id);
    expect(getGastroenterologyAdvModuleByCompetency("IM7.3")?.id).toBe(INFLAMMATORY_BOWEL_DISEASE_MODULE.id);
    expect(getGastroenterologyAdvModuleByCompetency("IM8.3")?.id).toBe(PANCREATITIS_MALABSORPTION_MODULE.id);
  });
});
