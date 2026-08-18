import {
  ORTHOPEDICS_ADV_CORE_MODULES,
  getOrthopedicsAdvModuleById,
  getOrthopedicsAdvModuleByCompetency,
  COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE,
  OPEN_FRACTURE_GUSTILO_ANDERSON_MODULE,
  PEDIATRIC_ORTHOPEDICS_HIP_DISORDERS_MODULE,
  MUSCULOSKELETAL_ONCOLOGY_BONE_TUMORS_MODULE
} from "../../lib/curriculum/content/orthopedicsadv";

describe("Clinical Orthopedics Advanced (ORT-301) Learning Content Modules", () => {
  it("should contain all 4 core Orthopedics Advanced modules", () => {
    expect(ORTHOPEDICS_ADV_CORE_MODULES.length).toBe(4);
  });

  it("should have valid metadata, markdown content, and clinical vignettes for all modules", () => {
    ORTHOPEDICS_ADV_CORE_MODULES.forEach((mod) => {
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
    const cs = getOrthopedicsAdvModuleById("orthopedics-adv-compartment-syndrome");
    expect(cs).toBeDefined();
    expect(cs?.title).toContain("Acute Compartment Syndrome");

    const of = getOrthopedicsAdvModuleById("orthopedics-adv-open-fractures");
    expect(of).toBeDefined();
    expect(of?.title).toContain("Open Fractures");

    const ped = getOrthopedicsAdvModuleById("orthopedics-adv-pediatric-hip");
    expect(ped).toBeDefined();
    expect(ped?.title).toContain("Pediatric Orthopedics");

    const onc = getOrthopedicsAdvModuleById("orthopedics-adv-bone-tumors");
    expect(onc).toBeDefined();
    expect(onc?.title).toContain("Musculoskeletal Oncology");
  });

  it("should retrieve modules by NMC CBME competency code", () => {
    expect(getOrthopedicsAdvModuleByCompetency("OR1.1")?.id).toBe(COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE.id);
    expect(getOrthopedicsAdvModuleByCompetency("OR3.1")?.id).toBe(OPEN_FRACTURE_GUSTILO_ANDERSON_MODULE.id);
    expect(getOrthopedicsAdvModuleByCompetency("OR5.1")?.id).toBe(PEDIATRIC_ORTHOPEDICS_HIP_DISORDERS_MODULE.id);
    expect(getOrthopedicsAdvModuleByCompetency("OR7.1")?.id).toBe(MUSCULOSKELETAL_ONCOLOGY_BONE_TUMORS_MODULE.id);
  });
});
