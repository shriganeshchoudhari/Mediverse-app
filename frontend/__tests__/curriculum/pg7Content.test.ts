import {
  PG7_CURRICULUM_MODULES,
  PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE,
  OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE,
  ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE,
  MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE
} from "@/lib/curriculum/content/pg7";

describe("Postgraduate Advanced Orthopedics & Musculoskeletal Oncology Curriculum (PG-607)", () => {
  test("should export 4 comprehensive PG-607 modules", () => {
    expect(PG7_CURRICULUM_MODULES).toHaveLength(4);
  });

  test("should correctly define Pelvic Ring Disruptions module", () => {
    expect(PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE.unitCode).toBe("PG7.1");
    expect(PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE.competencies).toContain("PG7.1");
    expect(PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE.markdownContent).toContain("Young-Burgess");
    expect(PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE.markdownContent).toContain("Preperitoneal Packing");
    expect(PELVIC_RING_DISRUPTION_HEMORRHAGE_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define Open Fractures & MESS module", () => {
    expect(OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE.unitCode).toBe("PG7.2");
    expect(OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE.competencies).toContain("PG7.2");
    expect(OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE.markdownContent).toContain("Gustilo-Anderson");
    expect(OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE.markdownContent).toContain("MESS");
    expect(OPEN_FRACTURE_MANGLED_EXTREMITY_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define ACS & Musculoskeletal Oncology modules", () => {
    expect(ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE.unitCode).toBe("PG7.3");
    expect(ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE.markdownContent).toContain("Delta Pressure");
    expect(ACUTE_COMPARTMENT_SYNDROME_FASCIOTOMY_MODULE.markdownContent).toContain("Dual-Incision");

    expect(MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE.unitCode).toBe("PG7.4");
    expect(MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE.markdownContent).toContain("Enneking");
    expect(MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE.markdownContent).toContain("Osteosarcoma");
    expect(MUSCULOSKELETAL_ONCOLOGY_LIMB_SALVAGE_MODULE.markdownContent).toContain("Ewing");
  });
});
