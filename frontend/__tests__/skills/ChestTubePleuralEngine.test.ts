import {
  computeChestTubeState,
  evaluateLightsCriteria,
  CHEST_TUBE_PRESETS,
  ChestTubeInputParams,
} from '@/.gemini/skills/ChestTubePleuralEngine';

describe('ChestTubePleuralEngine', () => {
  describe('Light\'s Criteria & Pleural Fluid Analysis', () => {
    test('classifies congestive transudate correctly', () => {
      const result = evaluateLightsCriteria({
        fluidProteinGdl: 1.5,
        serumProteinGdl: 6.5, // ratio = 0.23 (<0.5)
        fluidLdhUL: 80,
        serumLdhUL: 200, // ratio = 0.40 (<0.6)
        fluidPh: 7.45,
        fluidGlucoseMgdl: 100,
        triglyceridesMgdl: 20,
        hematocritPct: 1,
      });
      expect(result.isExudate).toBe(false);
      expect(result.reason).toContain('Transudative');
    });

    test('classifies parapneumonic exudate correctly based on protein ratio > 0.5 and LDH ratio > 0.6', () => {
      const result = evaluateLightsCriteria({
        fluidProteinGdl: 4.5,
        serumProteinGdl: 6.0, // ratio = 0.75 (>0.5)
        fluidLdhUL: 650,
        serumLdhUL: 200, // ratio = 3.25 (>0.6)
        fluidPh: 7.15,
        fluidGlucoseMgdl: 35,
        triglyceridesMgdl: 40,
        hematocritPct: 2,
      });
      expect(result.isExudate).toBe(true);
      expect(result.reason).toContain('Exudative');
    });
  });

  describe('Biophysical Scenarios & Clinical Presets', () => {
    test('TENSION_PNEUMOTHORAX_TRAUMA triggers critical tension alarm and obstructive shock', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.TENSION_PNEUMOTHORAX_TRAUMA.initialState);
      expect(state.activeAlarms).toContain('TENSION_PNEUMOTHORAX_CRITICAL');
      expect(state.meanPleuralPressureCmH2O).toBeGreaterThan(10);
      expect(state.mediastinalShiftMm).toBeGreaterThan(10);
      expect(state.cardiacOutputLMin).toBeLessThan(3.0);
      expect(state.clinicalRecommendation).toContain('IMMEDIATE LIFE THREAT');
    });

    test('needle decompression relieves tension pneumothorax and restores hemodynamics', () => {
      const decompressedState = computeChestTubeState({
        ...CHEST_TUBE_PRESETS.TENSION_PNEUMOTHORAX_TRAUMA.initialState,
        isNeedleDecompressed: true,
      });
      expect(decompressedState.activeAlarms).not.toContain('TENSION_PNEUMOTHORAX_CRITICAL');
      expect(decompressedState.cardiacOutputLMin).toBeGreaterThan(3.5);
    });

    test('MASSIVE_HEMOTHORAX_CHEST_INJURY triggers emergency thoracotomy alert based on ATLS thresholds', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.MASSIVE_HEMOTHORAX_CHEST_INJURY.initialState);
      expect(state.massiveHemothoraxTriggered).toBe(true);
      expect(state.activeAlarms).toContain('MASSIVE_HEMOTHORAX_THORACOTOMY_ALERT');
      expect(state.surgicalAction).toContain('Massive Transfusion Protocol');
      expect(state.surgicalAction).toContain('thoracotomy');
    });

    test('COMPLICATED_PARAPNEUMONIC_EMPYEMA triggers intrapleural enzyme MIST-2 recommendation', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.COMPLICATED_PARAPNEUMONIC_EMPYEMA.initialState);
      expect(state.activeAlarms).toContain('EMPYEMA_INTRAPLEURAL_ENZYMES_NEEDED');
      expect(state.surgicalAction).toContain('MIST-2 protocol');
      expect(state.surgicalAction).toContain('Alteplase');
    });

    test('POST_LOBECTOMY_AIR_LEAK exhibits continuous air leak alarm', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.POST_LOBECTOMY_AIR_LEAK.initialState);
      expect(state.activeAlarms).toContain('BRONCHOPLEURAL_FISTULA_AIR_LEAK');
      expect(state.surgicalAction).toContain('fistula');
    });

    test('IATROGENIC_CHYLOTHORAX identifies high triglyceride milky exudate and octreotide protocol', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.IATROGENIC_CHYLOTHORAX.initialState);
      expect(state.clinicalRecommendation).toContain('Chylothorax');
      expect(state.surgicalAction).toContain('Octreotide');
    });

    test('RESOLVED_LUNG_REEXPANSION exhibits optimal lung expansion and normal negative pleural pressure', () => {
      const state = computeChestTubeState(CHEST_TUBE_PRESETS.RESOLVED_LUNG_REEXPANSION.initialState);
      expect(state.activeAlarms).toContain('OPTIMAL_LUNG_EXPANSION');
      expect(state.lungExpansionPct).toBeGreaterThanOrEqual(95);
      expect(state.meanPleuralPressureCmH2O).toBeLessThan(0);
    });

    test('tube clamping triggers occlusion alarm when fluid/air accumulation present', () => {
      const state = computeChestTubeState({
        ...CHEST_TUBE_PRESETS.POST_LOBECTOMY_AIR_LEAK.initialState,
        isTubeClamped: true,
      });
      expect(state.activeAlarms).toContain('TUBE_OCCLUSION_ABSENT_TIDALING');
    });
  });
});
