import {
  PG6_CURRICULUM_MODULES,
  MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE,
  LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE,
  TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE,
  ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE
} from "@/lib/curriculum/content/pg6";

describe("Postgraduate Advanced Anesthesiology, Perioperative Medicine & Pain Critical Care Curriculum (PG-606)", () => {
  test("should export 4 comprehensive PG-606 modules", () => {
    expect(PG6_CURRICULUM_MODULES).toHaveLength(4);
  });

  test("should correctly define Malignant Hyperthermia & Dantrolene Rescue module", () => {
    expect(MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE.unitCode).toBe("PG6.1");
    expect(MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE.competencies).toContain("PG6.1");
    expect(MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE.markdownContent).toContain("Dantrolene");
    expect(MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE.markdownContent).toContain("2.5");
    expect(MALIGNANT_HYPERTHERMIA_DANTROLENE_RESCUE_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define LAST & Lipid Emulsion Rescue module", () => {
    expect(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.unitCode).toBe("PG6.2");
    expect(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.competencies).toContain("PG6.2");
    expect(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.markdownContent).toContain("Lipid Emulsion");
    expect(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.markdownContent).toContain("1.5");
    expect(LOCAL_ANESTHETIC_TOXICITY_LIPID_RESCUE_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define TIVA/TCI & ERAS modules", () => {
    expect(TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE.unitCode).toBe("PG6.3");
    expect(TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE.markdownContent).toContain("TIVA");
    expect(TIVA_TARGET_CONTROLLED_INFUSION_NEUROMONITORING_MODULE.markdownContent).toContain("Schnider");

    expect(ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE.unitCode).toBe("PG6.4");
    expect(ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE.markdownContent).toContain("ERAS");
    expect(ERAS_MULTIMODAL_OPIOID_SPARING_ANALGESIA_MODULE.markdownContent).toContain("Lidocaine");
  });
});
