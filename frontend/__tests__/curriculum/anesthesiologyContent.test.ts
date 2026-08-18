import {
  ANESTHESIOLOGY_CORE_MODULES,
  getAnesthesiologyModuleById,
  getAnesthesiologyModuleByCompetency,
  AIRWAY_MALLAMPATI_DIFFICULT_ALGORITHM_MODULE,
  VOLATILE_ANESTHETICS_MAC_MH_MODULE,
  NEUROMUSCULAR_BLOCKERS_REVERSAL_MODULE,
  ARDSNET_MECHANICAL_VENTILATION_ICU_MODULE
} from "../../lib/curriculum/content/anesthesiology";

describe("Anesthesiology & Critical Care (ANES-301) Learning Content Modules", () => {
  it("should contain all 4 core anesthesiology modules", () => {
    expect(ANESTHESIOLOGY_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ANESTHESIOLOGY_CORE_MODULES.forEach((mod) => {
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
    const airway = getAnesthesiologyModuleById("anes-airway-mallampati-algorithm");
    expect(airway).toBeDefined();
    expect(airway?.title).toContain("Airway Assessment");

    const mac = getAnesthesiologyModuleById("anes-volatile-mac-malignant-hyperthermia");
    expect(mac).toBeDefined();
    expect(mac?.title).toContain("Volatile Anesthetics");

    const nmb = getAnesthesiologyModuleById("anes-neuromuscular-blockade-reversal");
    expect(nmb).toBeDefined();
    expect(nmb?.title).toContain("Neuromuscular Blockade");

    const ards = getAnesthesiologyModuleById("anes-ardsnet-mechanical-ventilation");
    expect(ards).toBeDefined();
    expect(ards?.title).toContain("ARDS");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getAnesthesiologyModuleByCompetency("AS1.1")?.id).toBe(AIRWAY_MALLAMPATI_DIFFICULT_ALGORITHM_MODULE.id);
    expect(getAnesthesiologyModuleByCompetency("AS3.1")?.id).toBe(VOLATILE_ANESTHETICS_MAC_MH_MODULE.id);
    expect(getAnesthesiologyModuleByCompetency("AS5.1")?.id).toBe(NEUROMUSCULAR_BLOCKERS_REVERSAL_MODULE.id);
    expect(getAnesthesiologyModuleByCompetency("AS7.1")?.id).toBe(ARDSNET_MECHANICAL_VENTILATION_ICU_MODULE.id);
  });
});
