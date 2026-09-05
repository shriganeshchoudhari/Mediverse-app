/**
 * CoronaryAngiographyEngine.test.ts
 *
 * Unit test suite for the Diagnostic Cardiac Catheterization & Coronary Angiography Engine.
 */

import {
  PROJECTIONS,
  ANGIOGRAPHY_PRESETS,
  computeGorlinAVA,
  computeShuntFraction,
  evaluateFFR,
  synthesizeHemodynamicWaveform
} from '../../.gemini/skills/CoronaryAngiographyEngine';

describe('CoronaryAngiographyEngine', () => {
  describe('Fluoroscopy Projections Catalog', () => {
    it('contains all 7 standard C-arm fluoroscopy projections with precise angles', () => {
      const projectionKeys = Object.keys(PROJECTIONS);
      expect(projectionKeys).toHaveLength(7);

      const spiderView = PROJECTIONS.LAO_CRANIAL_SPIDER;
      expect(spiderView.name).toContain('Spider View');
      expect(spiderView.laoRaoAngleDeg).toBe(45);
      expect(spiderView.cranialCaudalAngleDeg).toBe(30);
      expect(spiderView.primaryVesselsShown).toContain('Left Main (LMCA)');

      const rcaView = PROJECTIONS.LAO_STRAIGHT;
      expect(rcaView.name).toContain('C-Shape');
      expect(rcaView.laoRaoAngleDeg).toBe(35);
      expect(rcaView.cranialCaudalAngleDeg).toBe(0);
    });
  });

  describe('Clinical Presets Catalog', () => {
    it('contains all 6 curated cardiac catheterization presets with comprehensive parameters', () => {
      const presetKeys = Object.keys(ANGIOGRAPHY_PRESETS);
      expect(presetKeys).toHaveLength(6);

      presetKeys.forEach((key) => {
        const preset = ANGIOGRAPHY_PRESETS[key as keyof typeof ANGIOGRAPHY_PRESETS];
        expect(preset.title).toBeDefined();
        expect(preset.dominance).toBeDefined();
        expect(preset.lesions.length).toBeGreaterThan(0);
        expect(preset.hemodynamics.cardiacOutputLMin).toBeGreaterThan(0);
        expect(preset.keyLearningPoints.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('models critical anterior STEMI with TIMI 0 occlusion in proximal LAD', () => {
      const stemi = ANGIOGRAPHY_PRESETS['critical-lad-stemi-timi-0'];
      const ladLesion = stemi.lesions.find((l) => l.vessel === 'LAD_PROXIMAL');

      expect(ladLesion).toBeDefined();
      expect(ladLesion?.stenosisPercent).toBe(99);
      expect(ladLesion?.timiFlow).toBe(0);
      expect(ladLesion?.ffr).toBeLessThan(0.75);
      expect(stemi.hemodynamics.lvedpMmHg).toBeGreaterThan(20);
    });

    it('models Medina 1,1,1 bifurcation lesion with functional ischemia across both branches', () => {
      const bif = ANGIOGRAPHY_PRESETS['bifurcation-medina-1-1-1'];
      const mainBranch = bif.lesions.find((l) => l.vessel === 'LAD_PROXIMAL');
      const sideBranch = bif.lesions.find((l) => l.vessel === 'D1');

      expect(mainBranch?.ffr).toBeLessThanOrEqual(0.80);
      expect(sideBranch?.ffr).toBeLessThanOrEqual(0.80);
      expect(bif.revascularizationStrategy).toContain('Provisional');
    });
  });

  describe('Gorlin Equation for Aortic Valve Area (AVA)', () => {
    it('computes severe aortic valve stenosis (AVA < 1.0 cm²)', () => {
      // Inputs: CO = 4.2 L/min, HR = 75 bpm, SEP = 0.34 s, Mean Gradient = 48 mmHg
      const result = computeGorlinAVA(4.2, 75, 0.34, 48);

      expect(result.avaCm2).toBeLessThan(1.0);
      expect(result.severity).toBe('SEVERE');
    });

    it('identifies normal valve orifice area (AVA > 2.0 cm²)', () => {
      // Inputs: CO = 5.2 L/min, HR = 70 bpm, SEP = 0.31 s, Mean Gradient = 1.5 mmHg
      const result = computeGorlinAVA(5.2, 70, 0.31, 1.5);

      expect(result.avaCm2).toBeGreaterThan(2.0);
      expect(result.severity).toBe('NORMAL');
    });

    it('handles edge case of 0 gradient safely', () => {
      const result = computeGorlinAVA(5.0, 70, 0.3, 0);
      expect(result.severity).toBe('NORMAL');
    });
  });

  describe('Fick Principle Intracardiac Shunt (Qp/Qs)', () => {
    it('computes normal 1:1 pulmonary to systemic flow ratio in absence of shunt', () => {
      // SaO2 = 98%, SvO2 = 72%, SpvO2 = 98%, SpaO2 = 72%
      const result = computeShuntFraction(98, 72, 98, 72);

      expect(result.qpqs).toBe(1.0);
      expect(result.isSignificant).toBe(false);
      expect(result.direction).toBe('NONE');
    });

    it('detects hemodynamically significant left-to-right ASD shunt (Qp/Qs > 1.5)', () => {
      // SaO2 = 98%, SvO2 = 65% (systemic diff = 0.33)
      // SpvO2 = 98%, SpaO2 = 84% (pulmonary diff = 0.14)
      // Qp/Qs = 0.33 / 0.14 = 2.36 ≈ 2.4
      const result = computeShuntFraction(98, 65, 98, 84);

      expect(result.qpqs).toBeGreaterThan(2.0);
      expect(result.isSignificant).toBe(true);
      expect(result.direction).toBe('LEFT_TO_RIGHT');
    });
  });

  describe('Fractional Flow Reserve (FFR) Evaluation', () => {
    it('accurately identifies ischemic cutoff (FFR ≤ 0.80)', () => {
      // Distal Pd = 68 mmHg, Aortic Pa = 95 mmHg -> FFR = 68/95 = 0.72
      const result = evaluateFFR(68, 95);

      expect(result.ffr).toBe(0.72);
      expect(result.isIschemic).toBe(true);
      expect(result.interpretation).toContain('Severe ischemia');
    });

    it('accurately identifies non-ischemic lesion (FFR > 0.80)', () => {
      // Distal Pd = 85 mmHg, Aortic Pa = 95 mmHg -> FFR = 85/95 = 0.89
      const result = evaluateFFR(85, 95);

      expect(result.ffr).toBe(0.89);
      expect(result.isIschemic).toBe(false);
      expect(result.interpretation).toContain('Non-ischemic');
    });
  });

  describe('Simultaneous Hemodynamic Waveform Synthesis', () => {
    it('synthesizes peak-to-peak gradient in severe calcific aortic stenosis', () => {
      // At peak systole (e.g. t = 0.1s in 75 bpm cycle)
      const sysWave = synthesizeHemodynamicWaveform(0.1, 'severe-calcific-aortic-stenosis');

      expect(sysWave.isSystole).toBe(true);
      expect(sysWave.lvPressure).toBeGreaterThan(sysWave.aoPressure);
      // Large transvalvular gradient
      expect(sysWave.lvPressure - sysWave.aoPressure).toBeGreaterThan(40);
    });

    it('demonstrates normal isobaric peak systole without gradient in normal coronary preset', () => {
      const sysWave = synthesizeHemodynamicWaveform(0.1, 'normal-coronary-right-dominant');

      expect(sysWave.isSystole).toBe(true);
      expect(Math.abs(sysWave.lvPressure - sysWave.aoPressure)).toBeLessThan(5);
    });
  });
});
