import {
  PG8_CURRICULUM_MODULES,
  RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE,
  NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE,
  ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE,
  NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE
} from "@/lib/curriculum/content/pg8";

describe("Postgraduate Advanced Ophthalmology Curriculum (PG-608)", () => {
  test("should export 4 comprehensive PG-608 modules", () => {
    expect(PG8_CURRICULUM_MODULES).toHaveLength(4);
  });

  test("should correctly define Retinal Detachment & PPV module", () => {
    expect(RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE.unitCode).toBe("PG8.1");
    expect(RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE.competencies).toContain("PG8.1");
    expect(RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE.markdownContent).toContain("Lincoff");
    expect(RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE.markdownContent).toContain("Vitrectomy");
    expect(RETINAL_DETACHMENT_PARS_PLANA_VITRECTOMY_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define Neovascular AMD & Anti-VEGF module", () => {
    expect(NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE.unitCode).toBe("PG8.2");
    expect(NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE.competencies).toContain("PG8.2");
    expect(NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE.markdownContent).toContain("Faricimab");
    expect(NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE.markdownContent).toContain("Aflibercept");
    expect(NEOVASCULAR_AMD_DIABETIC_MACULAR_EDEMA_MODULE.clinicalVignettes.length).toBeGreaterThan(0);
  });

  test("should correctly define Glaucoma & Neuro-Ophthalmology modules", () => {
    expect(ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE.unitCode).toBe("PG8.3");
    expect(ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE.markdownContent).toContain("Pupillary Block");
    expect(ACUTE_ANGLE_CLOSURE_GLAUCOMA_MODULE.markdownContent).toContain("Laser Peripheral Iridotomy");

    expect(NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE.unitCode).toBe("PG8.4");
    expect(NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE.markdownContent).toContain("Giant Cell Arteritis");
    expect(NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE.markdownContent).toContain("ONTT");
    expect(NEURO_OPHTHALMOLOGY_GCA_AION_OPTIC_NEURITIS_MODULE.markdownContent).toContain("CONTRAINDICATED");
  });
});
