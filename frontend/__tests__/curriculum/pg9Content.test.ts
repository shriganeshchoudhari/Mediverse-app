import {
  PG9_CURRICULUM_MODULES,
  ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE,
  ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE,
  CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE,
  DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE
} from "@/lib/curriculum/content/pg9";

describe("Postgraduate Advanced Otorhinolaryngology Curriculum (PG-609)", () => {
  test("should export 4 comprehensive PG-609 modules", () => {
    expect(PG9_CURRICULUM_MODULES).toHaveLength(4);
  });

  test("should correctly define Advanced Laryngeal Carcinoma module", () => {
    expect(ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE.unitCode).toBe("PG9.1");
    expect(ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE.competencies).toContain("PG9.1");
    expect(ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE.markdownContent).toContain("Total Laryngectomy");
    expect(ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE.markdownContent).toContain("PMMC");
    expect(ADVANCED_LARYNGEAL_CARCINOMA_FLAP_RECONSTRUCTION_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define FESS & CSF Leak module", () => {
    expect(ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE.unitCode).toBe("PG9.2");
    expect(ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE.competencies).toContain("PG9.2");
    expect(ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE.markdownContent).toContain("Keros");
    expect(ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE.markdownContent).toContain("Hadad-Bassagasteguy");
    expect(ENDOSCOPIC_SINUS_SKULL_BASE_CSF_LEAK_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define Cholesteatoma & Deep Neck Infections modules", () => {
    expect(CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE.unitCode).toBe("PG9.3");
    expect(CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE.markdownContent).toContain("Labyrinthine Fistula");
    expect(CHOLESTEATOMA_MASTOIDECTOMY_LATERAL_SKULL_BASE_MODULE.markdownContent).toContain("Mastoidectomy");

    expect(DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE.unitCode).toBe("PG9.4");
    expect(DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE.markdownContent).toContain("Danger Space");
    expect(DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE.markdownContent).toContain("Ludwig's Angina");
    expect(DEEP_NECK_SPACE_INFECTIONS_EMERGENCY_AIRWAY_MODULE.markdownContent).toContain("CONTRAINDICATION");
  });
});
