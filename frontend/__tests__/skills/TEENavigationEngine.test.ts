import {
  ASE_SCA_TEE_VIEWS,
  evaluateProbeAlignment,
  computeTEEHemodynamics,
  TEE_PRESETS,
  ProbeState,
  HemodynamicMeasurements
} from '../../.gemini/skills/TEENavigationEngine';

describe('TEENavigationEngine', () => {
  describe('ASE_SCA_TEE_VIEWS Catalog', () => {
    it('defines standard TEE views including ME 4-Chamber, TG Mid SAX, and Deep TG LAX', () => {
      expect(ASE_SCA_TEE_VIEWS.ME_4_CHAMBER).toBeDefined();
      expect(ASE_SCA_TEE_VIEWS.TG_MID_SAX).toBeDefined();
      expect(ASE_SCA_TEE_VIEWS.DEEP_TG_LAX).toBeDefined();
      expect(ASE_SCA_TEE_VIEWS.ME_BICAVAL).toBeDefined();
      expect(ASE_SCA_TEE_VIEWS.DESC_AORTA_SAX).toBeDefined();
      expect(Object.keys(ASE_SCA_TEE_VIEWS).length).toBeGreaterThanOrEqual(14);
    });

    it('has accurate ideal angles and structures for ME 4-Chamber', () => {
      const me4 = ASE_SCA_TEE_VIEWS.ME_4_CHAMBER;
      expect(me4.depthZone).toBe('MID_ESOPHAGEAL');
      expect(me4.idealOmniplaneAngleDeg).toBe(0);
      expect(me4.structuresVisualized).toContain('Left Atrium');
      expect(me4.structuresVisualized).toContain('Tricuspid Valve');
    });

    it('has accurate ideal parameters for Deep TG Long Axis', () => {
      const dtg = ASE_SCA_TEE_VIEWS.DEEP_TG_LAX;
      expect(dtg.depthZone).toBe('DEEP_TRANSGASTRIC');
      expect(dtg.idealDepthCm).toBe(47);
      expect(dtg.idealTipDeflectionDeg).toBeGreaterThanOrEqual(25);
    });
  });

  describe('evaluateProbeAlignment', () => {
    it('locks ME 4-Chamber when probe is at 32cm, 0 degrees omniplane, 0 rotation', () => {
      const probe: ProbeState = {
        depthZone: 'MID_ESOPHAGEAL',
        depthCm: 32,
        omniplaneAngleDeg: 0,
        probeRotationDeg: 0,
        tipDeflectionDeg: 0,
        lateralDeflectionDeg: 0
      };

      const result = evaluateProbeAlignment(probe);
      expect(result.currentViewId).toBe('ME_4_CHAMBER');
      expect(result.alignmentScorePct).toBeGreaterThanOrEqual(85);
      expect(result.isViewLocked).toBe(true);
    });

    it('locks TG Mid SAX when probe is transgastric with anteflexion', () => {
      const probe: ProbeState = {
        depthZone: 'TRANSGASTRIC',
        depthCm: 42,
        omniplaneAngleDeg: 0,
        probeRotationDeg: 0,
        tipDeflectionDeg: 20,
        lateralDeflectionDeg: 0
      };

      const result = evaluateProbeAlignment(probe);
      expect(result.currentViewId).toBe('TG_MID_SAX');
      expect(result.isViewLocked).toBe(true);
    });

    it('locks Deep TG LAX when probe is deep transgastric with steep anteflexion', () => {
      const probe: ProbeState = {
        depthZone: 'DEEP_TRANSGASTRIC',
        depthCm: 47,
        omniplaneAngleDeg: 0,
        probeRotationDeg: 0,
        tipDeflectionDeg: 28,
        lateralDeflectionDeg: 0
      };

      const result = evaluateProbeAlignment(probe);
      expect(result.currentViewId).toBe('DEEP_TG_LAX');
      expect(result.isViewLocked).toBe(true);
    });

    it('generates coaching tips when probe is misaligned', () => {
      const probe: ProbeState = {
        depthZone: 'MID_ESOPHAGEAL',
        depthCm: 32,
        omniplaneAngleDeg: 55, // in between views
        probeRotationDeg: 0,
        tipDeflectionDeg: 0,
        lateralDeflectionDeg: 0
      };

      const result = evaluateProbeAlignment(probe);
      expect(result.coachingGuidance.length).toBeGreaterThan(0);
    });
  });

  describe('computeTEEHemodynamics', () => {
    it('computes normal baseline hemodynamics accurately', () => {
      const normal = TEE_PRESETS.find(p => p.id === 'normal-comprehensive-28')!.measurements;
      const result = computeTEEHemodynamics(normal);

      expect(result.ejectionFractionPct).toBeGreaterThanOrEqual(55);
      expect(result.asSeverity).toBe('NORMAL');
      expect(result.diastolicDysfunctionGrade).toBe('NORMAL');
      expect(result.phSeverity).toBe('NORMAL');
      expect(result.aorticValveAreaCm2).toBeGreaterThan(2.0);
    });

    it('accurately identifies severe calcific aortic stenosis via continuity equation', () => {
      const asPreset = TEE_PRESETS.find(p => p.id === 'severe-calcific-as')!.measurements;
      const result = computeTEEHemodynamics(asPreset);

      expect(result.asSeverity).toBe('SEVERE');
      expect(result.aorticValveAreaCm2).toBeLessThan(1.0);
      expect(result.simplifiedBernoulliPeakGradientMmHg).toBeGreaterThanOrEqual(64);
      expect(result.dimensionlessVelocityIndex).toBeLessThan(0.25);
      expect(result.clinicalSummary.some(s => s.includes('Critical Aortic Stenosis'))).toBe(true);
    });

    it('diagnoses Grade III restrictive diastolic dysfunction', () => {
      const restPreset = TEE_PRESETS.find(p => p.id === 'grade-3-restrictive')!.measurements;
      const result = computeTEEHemodynamics(restPreset);

      expect(result.diastolicDysfunctionGrade).toBe('GRADE_III_RESTRICTIVE');
      expect(result.eOverARatio).toBeGreaterThan(2.0);
      expect(result.eOverEPrimeRatio).toBeGreaterThan(14);
      expect(result.clinicalSummary.some(s => s.includes('Restrictive Diastolic Filling'))).toBe(true);
    });

    it('diagnoses acute pulmonary hypertension & McConnell sign parameters', () => {
      const pePreset = TEE_PRESETS.find(p => p.id === 'massive-pe-mcconnell')!.measurements;
      const result = computeTEEHemodynamics(pePreset);

      expect(result.phSeverity).toBe('SEVERE_PH');
      expect(result.rvspMmHg).toBeGreaterThan(60);
      expect(result.rvFacPct).toBeLessThan(35);
      expect(result.clinicalSummary.some(s => s.includes('Severe Pulmonary Hypertension'))).toBe(true);
    });

    it('flags Stanford Type A aortic dissection and pericardial effusion', () => {
      const dissPreset = TEE_PRESETS.find(p => p.id === 'type-a-aortic-dissection')!.measurements;
      const result = computeTEEHemodynamics(dissPreset);

      expect(result.clinicalSummary.some(s => s.includes('Stanford Type A'))).toBe(true);
      expect(result.clinicalSummary.some(s => s.includes('Pericardial Effusion'))).toBe(true);
    });
  });
});
