import {
  ORGAN_PRESETS,
  getOrganPresetByChapterId,
  getAllOrganPresets
} from "../../.gemini/skills/3d/OrganPresets";

describe("E2E Functional: 3D Multi-Organ WebGL Scene Presets & Landmark Mapping (FR-3D)", () => {
  const expectedOrganSystems = [
    "cardiovascular",
    "respiratory",
    "renal",
    "neurophysiology",
    "gastrointestinal",
    "endocrine"
  ];

  test("E2E-3D-001: Verifies all core organ system presets are fully populated", () => {
    expectedOrganSystems.forEach(systemId => {
      const preset = ORGAN_PRESETS[systemId];
      expect(preset).toBeDefined();
      expect(preset.id).toBe(systemId);
      expect(preset.title).toBeTruthy();
      expect(preset.subtitle).toBeTruthy();
      expect(preset.overview).toBeTruthy();

      // Camera coordinates in 3D space [x, y, z]
      expect(preset.cameraPosition).toHaveLength(3);
      expect(preset.cameraTarget).toHaveLength(3);

      // Theme colors
      expect(preset.themeColors.primary).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(preset.themeColors.secondary).toMatch(/^#[0-9a-fA-F]{6}$/);

      // Dissection hints
      expect(preset.dissectionHints).toBeDefined();
      expect(["sagittal", "coronal", "transverse"]).toContain(preset.dissectionHints!.recommendedPlane);

      // Landmark pins
      expect(preset.landmarks.length).toBeGreaterThanOrEqual(3);
    });
  });

  test("E2E-3D-002: Verifies clinical landmark pins and coordinate vectors for Cardiovascular Preset", () => {
    const cvPreset = ORGAN_PRESETS.cardiovascular;
    expect(cvPreset).toBeDefined();

    const landmarks = cvPreset.landmarks;
    const landmarkNames = landmarks.map(l => l.name);

    expect(landmarkNames).toContain("Left Ventricle (LV)");
    expect(landmarkNames).toContain("Sinoatrial (SA) Node");
    expect(landmarkNames).toContain("Aortic Valve");
    expect(landmarkNames).toContain("Interventricular Septum (IVS)");

    landmarks.forEach(pin => {
      expect(pin.id).toBeTruthy();
      expect(pin.position).toHaveLength(3);
      expect(pin.clinicalSignificance.length).toBeGreaterThan(20);
      expect(pin.physiologicalRole.length).toBeGreaterThan(20);
    });
  });

  test("E2E-3D-003: Verifies contextual chapter mapping (getOrganPresetByChapterId)", () => {
    // Cardiac cycle chapter -> cardiovascular preset
    const cardiacPreset = getOrganPresetByChapterId("cardiac-cycle");
    expect(cardiacPreset.id).toBe("cardiovascular");

    // Respiratory mechanics chapter -> respiratory preset
    const respPreset = getOrganPresetByChapterId("respiratory-mechanics");
    expect(respPreset.id).toBe("respiratory");

    // Renal filtration -> renal preset
    const renalPreset = getOrganPresetByChapterId("renal-filtration");
    expect(renalPreset.id).toBe("renal");
  });

  test("E2E-3D-004: Verifies getAllOrganPresets returns all registered presets", () => {
    const allPresets = getAllOrganPresets();
    expect(allPresets.length).toBeGreaterThanOrEqual(6);
    const ids = allPresets.map(p => p.id);
    expect(ids).toContain("cardiovascular");
    expect(ids).toContain("respiratory");
    expect(ids).toContain("renal");
  });
});
