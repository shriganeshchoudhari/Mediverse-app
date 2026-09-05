/**
 * VentricularAssistEngine.test.ts
 *
 * Unit test suite for the Mechanical Circulatory Support & Percutaneous VAD Engine.
 */

import {
  P_LEVEL_SPECS,
  MCS_PRESETS,
  getPumpSpeedAndFlow,
  computeCardiacPowerOutput,
  evaluateLVUnloading,
  generatePVLoopCoordinates
} from '../../.gemini/skills/VentricularAssistEngine';

describe('VentricularAssistEngine', () => {
  describe('P-Level Kinetics & Flow Scaling', () => {
    it('scales rotational speed and forward flow from P-1 to P-9', () => {
      const p1 = getPumpSpeedAndFlow('IMPELLA_CP', 1);
      const p9 = getPumpSpeedAndFlow('IMPELLA_CP', 9);

      expect(p1.rpm).toBe(25000);
      expect(p1.flowLMin).toBe(1.0);

      expect(p9.rpm).toBe(46000);
      expect(p9.flowLMin).toBe(4.0);
    });

    it('provides higher peak flow up to 5.5 L/min for Impella 5.5', () => {
      const p9_55 = getPumpSpeedAndFlow('IMPELLA_5_5', 9);
      expect(p9_55.flowLMin).toBe(5.5);
    });
  });

  describe('Clinical Presets Catalog', () => {
    it('contains all 6 curated mechanical circulatory support presets', () => {
      const presetIds = Object.keys(MCS_PRESETS);
      expect(presetIds).toHaveLength(6);

      presetIds.forEach((id) => {
        const preset = MCS_PRESETS[id as keyof typeof MCS_PRESETS];
        expect(preset.title).toBeDefined();
        expect(preset.deviceType).toBeDefined();
        expect(preset.initialState.totalCOLMin).toBeGreaterThan(0);
        expect(preset.boardReviewPearls.length).toBeGreaterThanOrEqual(3);
      });
    });

    it('models ECPELLA synergy with V-A ECMO flow and low unloaded LVEDP', () => {
      const ecpella = MCS_PRESETS['ecpella-synergy-severe-distension'];
      expect(ecpella.initialState.ecmoFlowLMin).toBe(4.5);
      expect(ecpella.initialState.lvedpMmHg).toBeLessThan(15);
      expect(ecpella.initialState.cardiacPowerOutputWatts).toBeGreaterThan(0.8);
    });
  });

  describe('Cardiac Power Output (CPO)', () => {
    it('accurately computes CPO and identifies cardiogenic shock target (>0.6 W)', () => {
      // MAP = 76 mmHg, Total CO = 5.0 L/min -> CPO = (76 * 5.0) / 451 = 0.84 W
      const cpo = computeCardiacPowerOutput(76, 5.0);
      expect(cpo).toBe(0.84);
      expect(cpo).toBeGreaterThan(0.6);
    });

    it('identifies critical mortality risk when CPO < 0.6 W', () => {
      // MAP = 50 mmHg, CO = 3.0 L/min -> CPO = (50 * 3.0) / 451 = 0.33 W
      const cpo = computeCardiacPowerOutput(50, 3.0);
      expect(cpo).toBe(0.33);
      expect(cpo).toBeLessThan(0.6);
    });
  });

  describe('Left Ventricular Unloading & Alarm Mechanics', () => {
    it('progressively unloads the LV and reduces LVEDP as P-level increases', () => {
      const p2Result = evaluateLVUnloading('IMPELLA_CP', 2, 'CORRECT_TRANSVALVULAR', 10, 28, 55);
      const p8Result = evaluateLVUnloading('IMPELLA_CP', 8, 'CORRECT_TRANSVALVULAR', 10, 28, 55);

      expect(p8Result.pumpFlowLMin).toBeGreaterThan(p2Result.pumpFlowLMin);
      expect(p8Result.lvedpMmHg).toBeLessThan(p2Result.lvedpMmHg);
      expect(p8Result.mapMmHg).toBeGreaterThan(p2Result.mapMmHg);
      expect(p8Result.cpoWatts).toBeGreaterThan(p2Result.cpoWatts);
      expect(p8Result.alarms).toContain('OPTIMAL');
    });

    it('triggers suction and hypovolemia alarms when CVP is low at high P-level', () => {
      // CVP = 3 mmHg (<5) at P-8
      const suctionResult = evaluateLVUnloading('IMPELLA_CP', 8, 'CORRECT_TRANSVALVULAR', 3, 28, 55);

      expect(suctionResult.alarms).toContain('SUCTION');
      expect(suctionResult.alarms).toContain('CRITICAL_HYPOVOLEMIA');
      expect(suctionResult.pumpFlowLMin).toBeLessThan(2.0); // Flow drops due to suction
    });

    it('triggers cannula malposition alarm and halts LV unloading when retracted into aorta', () => {
      const malpositionResult = evaluateLVUnloading('IMPELLA_CP', 7, 'MIGRATED_AORTA', 10, 28, 55);

      expect(malpositionResult.alarms).toContain('CANNULA_MALPOSITION');
      expect(malpositionResult.lvedpMmHg).toBe(28); // Fails to unload LV!
    });
  });

  describe('Pressure-Volume Loop Generation', () => {
    it('generates closed PV-loop coordinates that shift leftward with higher P-levels', () => {
      const loopP2 = generatePVLoopCoordinates(20, 65, 2);
      const loopP8 = generatePVLoopCoordinates(10, 85, 8);

      expect(loopP2.length).toBeGreaterThan(5);
      expect(loopP8.length).toBeGreaterThan(5);

      // In loopP8 (unloaded), the end-diastolic volume should be significantly lower than loopP2
      const edvP2 = loopP2[0].volumeMl;
      const edvP8 = loopP8[0].volumeMl;
      expect(edvP8).toBeLessThan(edvP2);
    });
  });
});
