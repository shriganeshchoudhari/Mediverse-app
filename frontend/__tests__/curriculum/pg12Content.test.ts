import {
  PG12_MODULES,
  PSMA_RADIOLIGAND_THERAPY_PLUVICTO_MODULE,
  PRRT_DOTATATE_NEUROENDOCRINE_MODULE,
  THYROID_CANCER_IODINE131_ABLATION_MODULE,
  NUCLEAR_CARDIOLOGY_DOSIMETRY_MODULE
} from "@/lib/curriculum/content/pg12";

describe("Postgraduate Nuclear Medicine & Theranostics Curriculum (PG-612)", () => {
  test("aggregates all 4 PG-612 curriculum modules", () => {
    expect(PG12_MODULES).toHaveLength(4);
    expect(PG12_MODULES.map(m => m.code)).toEqual(["PG12.1", "PG12.2", "PG12.3", "PG12.4"]);
  });

  test("Module 1 (PG12.1) validates PSMA theranostics, Lu-177 Pluvicto, and Ac-225 alpha TAT", () => {
    expect(PSMA_RADIOLIGAND_THERAPY_PLUVICTO_MODULE.id).toBe("fa770005-0000-0000-0000-000000000001");
    expect(PSMA_RADIOLIGAND_THERAPY_PLUVICTO_MODULE.sections).toHaveLength(4);
    const text = PSMA_RADIOLIGAND_THERAPY_PLUVICTO_MODULE.sections.map(s => s.content).join(" ");
    expect(text).toContain("Theranostics");
    expect(text).toContain("VISION");
    expect(text).toContain("Pluvicto");
    expect(text).toContain("7.4\\text{ GBq}");
    expect(text).toContain("Xerostomia");
    expect(text).toContain("Targeted Alpha Therapy");
  });

  test("Module 2 (PG12.2) validates PRRT Lu-177 DOTATATE, SSTR2, and amino acid renal radioprotection", () => {
    expect(PRRT_DOTATATE_NEUROENDOCRINE_MODULE.id).toBe("fa770005-0000-0000-0000-000000000002");
    expect(PRRT_DOTATATE_NEUROENDOCRINE_MODULE.sections).toHaveLength(4);
    const text = PRRT_DOTATATE_NEUROENDOCRINE_MODULE.sections.map(s => s.content).join(" ");
    expect(text).toContain("NETTER-1");
    expect(text).toContain("Lutathera");
    expect(text).toContain("Krenning");
    expect(text).toContain("megalin");
    expect(text).toContain("L-lysine");
    expect(text).toContain("Octreotide");
  });

  test("Module 3 (PG12.3) validates Thyroid I-131 RAI, ATA risk stratification, and Thyrogen rhTSH", () => {
    expect(THYROID_CANCER_IODINE131_ABLATION_MODULE.id).toBe("fa770005-0000-0000-0000-000000000003");
    expect(THYROID_CANCER_IODINE131_ABLATION_MODULE.sections).toHaveLength(4);
    const text = THYROID_CANCER_IODINE131_ABLATION_MODULE.sections.map(s => s.content).join(" ");
    expect(text).toContain("Sodium-Iodide Symporter");
    expect(text).toContain("ATA Risk Category");
    expect(text).toContain("Thyrogen");
    expect(text).toContain("Low-Iodine Diet");
    expect(text).toContain("10 CFR 35.75");
  });

  test("Module 4 (PG12.4) validates Nuclear Cardiology MPI, Regadenoson, Polar maps, and ALARA health physics", () => {
    expect(NUCLEAR_CARDIOLOGY_DOSIMETRY_MODULE.id).toBe("fa770005-0000-0000-0000-000000000004");
    expect(NUCLEAR_CARDIOLOGY_DOSIMETRY_MODULE.sections).toHaveLength(4);
    const text = NUCLEAR_CARDIOLOGY_DOSIMETRY_MODULE.sections.map(s => s.content).join(" ");
    expect(text).toContain("Sestamibi");
    expect(text).toContain("Coronary Flow Reserve");
    expect(text).toContain("Regadenoson");
    expect(text).toContain("Aminophylline");
    expect(text).toContain("Reversible Ischemia");
    expect(text).toContain("ALARA");
    expect(text).toContain("50\\text{ mSv/year}");
  });
});
