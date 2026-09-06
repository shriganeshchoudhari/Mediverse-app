import {
  computeDermoscopyState,
  calculate7PointChecklist,
  DERMOSCOPY_PRESETS,
  DermoscopyInputParams,
} from '@/.gemini/skills/DermoscopyEngine';

const DEFAULT_PARAMS: DermoscopyInputParams = {
  presetId: 'SUPERFICIAL_SPREADING_MELANOMA',
  lighting: 'POLARIZED_WHITE',
  magnification: '20X',
  caliperReticleVisible: true,
  immersionGelApplied: false,
  biopsyTypePerformed: 'NONE',
  topicalTherapyInitiated: false,
};

describe('DermoscopyEngine', () => {
  describe('Argenziano 7-Point Checklist Scoring', () => {
    test('computes score 6 and HIGH_MALIGNANT risk for all 3 major criteria', () => {
      const result = calculate7PointChecklist({
        atypicalPigmentNetwork: true, // 2
        blueWhiteVeil: true, // 2
        atypicalVascularPattern: true, // 2
        irregularPigmentation: false,
        irregularDotsGlobules: false,
        radialStreamingPseudopods: false,
        regressionStructures: false,
      });
      expect(result.score).toBe(6);
      expect(result.riskCategory).toBe('HIGH_MALIGNANT');
    });

    test('computes SUSPICIOUS risk for score 3 (1 major + 1 minor)', () => {
      const result = calculate7PointChecklist({
        atypicalPigmentNetwork: true, // 2
        blueWhiteVeil: false,
        atypicalVascularPattern: false,
        irregularPigmentation: true, // 1
        irregularDotsGlobules: false,
        radialStreamingPseudopods: false,
        regressionStructures: false,
      });
      expect(result.score).toBe(3);
      expect(result.riskCategory).toBe('SUSPICIOUS');
    });

    test('computes LOW_BENIGN risk for score < 3', () => {
      const result = calculate7PointChecklist({
        atypicalPigmentNetwork: false,
        blueWhiteVeil: false,
        atypicalVascularPattern: false,
        irregularPigmentation: true, // 1
        irregularDotsGlobules: false,
        radialStreamingPseudopods: false,
        regressionStructures: false,
      });
      expect(result.score).toBe(1);
      expect(result.riskCategory).toBe('LOW_BENIGN');
    });
  });

  describe('Cutaneous Oncology Presets & Diagnostics', () => {
    test('superficial spreading melanoma displays high 7-point score and excisional biopsy mandate', () => {
      const state = computeDermoscopyState(DEFAULT_PARAMS);
      expect(state.sevenPointScore).toBeGreaterThanOrEqual(5);
      expect(state.melanomaProbabilityPercent).toBeGreaterThan(90);
      expect(state.activeAlarms).toContain('HIGH_MELANOMA_RISK_EXCISION');
      expect(state.clinicalRecommendation).toContain('complete excisional biopsy with 1-2 mm margin');
      expect(state.dominantStructures).toContain('Confluent blue-white veil');
    });

    test('nodular basal cell carcinoma detects arborizing vessels and ovoid nests', () => {
      const state = computeDermoscopyState({
        ...DEFAULT_PARAMS,
        ...DERMOSCOPY_PRESETS.NODULAR_BASAL_CELL_CARCINOMA.initialState,
        presetId: 'NODULAR_BASAL_CELL_CARCINOMA',
      });
      expect(state.activeAlarms).toContain('BASAL_CELL_CARCINOMA_SUSPECTED');
      expect(state.dominantStructures).toContain('Branching arborizing telangiectasias');
      expect(state.dominantStructures).toContain('Blue-gray ovoid nests and globules');
      expect(state.clinicalRecommendation).toContain('Mohs');
    });

    test('benign seborrheic keratosis presents with milia-like cysts and benign alarm', () => {
      const state = computeDermoscopyState({
        ...DEFAULT_PARAMS,
        ...DERMOSCOPY_PRESETS.SEBORRHEIC_KERATOSIS_BENIGN.initialState,
        presetId: 'SEBORRHEIC_KERATOSIS_BENIGN',
      });
      expect(state.activeAlarms).toContain('SEBORRHEIC_KERATOSIS_BENIGN');
      expect(state.activeAlarms).toContain('BENIGN_REASSURING');
      expect(state.dominantStructures).toContain('Milia-like cysts (visible on immersion)');
      expect(state.dominantStructures).toContain('Comedo-like crypt openings');
    });
  });

  describe('Wood\'s Lamp (365 nm UVA) Fluorescence Optics', () => {
    test('erythrasma displays coral-pink coproporphyrin III fluorescence under 365 nm', () => {
      const state = computeDermoscopyState({
        ...DEFAULT_PARAMS,
        ...DERMOSCOPY_PRESETS.ERYTHRASMA_CORYNEBACTERIUM.initialState,
        presetId: 'ERYTHRASMA_CORYNEBACTERIUM',
        lighting: 'WOODS_LAMP_365NM',
      });
      expect(state.activeAlarms).toContain('BACTERIAL_ERYTHRASMA_CORAL_PINK');
      expect(state.fluorescenceColorDescription).toContain('CORAL-PINK');
      expect(state.clinicalRecommendation).toContain('Clindamycin');
    });

    test('vitiligo displays chalky-white accentuation under Wood\'s lamp', () => {
      const state = computeDermoscopyState({
        ...DEFAULT_PARAMS,
        ...DERMOSCOPY_PRESETS.VITILIGO_DEPIGMENTATION.initialState,
        presetId: 'VITILIGO_DEPIGMENTATION',
        lighting: 'WOODS_LAMP_365NM',
      });
      expect(state.activeAlarms).toContain('VITILIGO_CHALKY_WHITE_ACCENTUATION');
      expect(state.fluorescenceColorDescription).toContain('CHALKY-WHITE');
      expect(state.clinicalRecommendation).toContain('Tacrolimus');
    });

    test('dysplastic nevus triggers suspicious atypical lesion monitoring alarm', () => {
      const state = computeDermoscopyState({
        ...DEFAULT_PARAMS,
        ...DERMOSCOPY_PRESETS.DYSPLASTIC_NEVUS_ATYPICAL.initialState,
        presetId: 'DYSPLASTIC_NEVUS_ATYPICAL',
      });
      expect(state.activeAlarms).toContain('SUSPICIOUS_ATYPICAL_LESION');
      expect(state.sevenPointScore).toBe(3);
      expect(state.clinicalRecommendation).toContain('3-month short-term monitoring');
    });
  });
});
