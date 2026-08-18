import {
  ONCOLOGY_CORE_MODULES,
  getOncologyModuleById,
  getOncologyModuleByCompetency,
  CANCER_BIOLOGY_TNM_STAGING_MODULE,
  CHEMOTHERAPY_MECHANISMS_PRECISION_THERAPY_MODULE,
  RADIATION_BIOLOGY_CLINICAL_RADIOTHERAPY_MODULE,
  ONCOLOGIC_EMERGENCIES_PALLIATIVE_CARE_MODULE
} from "../../lib/curriculum/content/oncology";

describe("Clinical Oncology & Radiotherapy (ONCO-401) Learning Content Modules", () => {
  it("should contain all 4 core Oncology modules", () => {
    expect(ONCOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ONCOLOGY_CORE_MODULES.forEach((mod) => {
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
    const tnm = getOncologyModuleById("oncology-cancer-biology-tnm-staging");
    expect(tnm).toBeDefined();
    expect(tnm?.title).toContain("Cancer Biology");

    const chemo = getOncologyModuleById("oncology-chemotherapy-mechanisms-precision-therapy");
    expect(chemo).toBeDefined();
    expect(chemo?.title).toContain("Cytotoxic Chemotherapy");

    const radio = getOncologyModuleById("oncology-radiation-biology-clinical-radiotherapy");
    expect(radio).toBeDefined();
    expect(radio?.title).toContain("Radiation Biology");

    const emerg = getOncologyModuleById("oncology-oncologic-emergencies-palliative-care");
    expect(emerg).toBeDefined();
    expect(emerg?.title).toContain("Oncologic Emergencies");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOncologyModuleByCompetency("ON1.1")?.id).toBe(CANCER_BIOLOGY_TNM_STAGING_MODULE.id);
    expect(getOncologyModuleByCompetency("ON3.1")?.id).toBe(CHEMOTHERAPY_MECHANISMS_PRECISION_THERAPY_MODULE.id);
    expect(getOncologyModuleByCompetency("ON5.1")?.id).toBe(RADIATION_BIOLOGY_CLINICAL_RADIOTHERAPY_MODULE.id);
    expect(getOncologyModuleByCompetency("ON7.1")?.id).toBe(ONCOLOGIC_EMERGENCIES_PALLIATIVE_CARE_MODULE.id);
  });
});
