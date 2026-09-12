import {
  calculatePAO2,
  calculateExpectedAaGradient,
  calculateOxygenContent,
  calculateShuntFraction,
  predictPaO2OnHyperoxia,
  classifyHypoxemiaMechanism,
  classifyARDS,
  analyzeRespiratoryPhysiology,
  SHUNT_CLINICAL_PRESETS
} from '../../.gemini/skills/ShuntHypoxemiaEngine';

describe('ShuntHypoxemiaEngine - Pulmonology & Respiratory Physiology', () => {
  describe('Alveolar Gas Equation (PAO2)', () => {
    it('calculates normal PAO2 on room air at sea level', () => {
      // (760 - 47) * 0.21 - (40 / 0.8) = 713 * 0.21 - 50 = 149.73 - 50 = 99.7 mmHg
      const pAO2 = calculatePAO2(760, 0.21, 40, 0.8);
      expect(pAO2).toBeCloseTo(99.7, 1);
    });

    it('calculates PAO2 at high altitude (4,500m, P_atm 430 mmHg)', () => {
      // (430 - 47) * 0.21 - (25 / 0.8) = 383 * 0.21 - 31.25 = 80.43 - 31.25 = 49.2 mmHg
      const pAO2 = calculatePAO2(430, 0.21, 25, 0.8);
      expect(pAO2).toBeCloseTo(49.2, 1);
    });

    it('calculates PAO2 on 100% FiO2 at sea level', () => {
      // (760 - 47) * 1.0 - (40 / 0.8) = 713 - 50 = 663 mmHg
      const pAO2 = calculatePAO2(760, 1.0, 40, 0.8);
      expect(pAO2).toBe(663);
    });
  });

  describe('Expected A-a Gradient', () => {
    it('computes age-adjusted A-a gradient on room air', () => {
      // Age 40: 40/4 + 4 = 14 mmHg
      expect(calculateExpectedAaGradient(40, 0.21)).toBe(14);
      // Age 80: 80/4 + 4 = 24 mmHg
      expect(calculateExpectedAaGradient(80, 0.21)).toBe(24);
    });

    it('adjusts expected gradient for supplemental oxygen', () => {
      const gradientRoomAir = calculateExpectedAaGradient(40, 0.21);
      const gradientO2 = calculateExpectedAaGradient(40, 0.60);
      expect(gradientO2).toBeGreaterThan(gradientRoomAir);
    });
  });

  describe('Oxygen Content (CaO2, CvO2, CcO2)', () => {
    it('calculates normal arterial oxygen content', () => {
      // Hb 15, SaO2 98%, PaO2 100 -> 1.34 * 15 * 0.98 + 0.0031 * 100 = 19.7 + 0.31 = ~20.0 mL/dL
      const caO2 = calculateOxygenContent(15, 98, 100);
      expect(caO2).toBeGreaterThan(19.5);
      expect(caO2).toBeLessThan(20.5);
    });

    it('handles severe anemia properly', () => {
      const caO2 = calculateOxygenContent(7.0, 98, 100);
      expect(caO2).toBeLessThan(10.0);
    });
  });

  describe('Berggren Shunt Equation (Qs/Qt)', () => {
    it('calculates physiological shunt (~3-5%) under normal conditions', () => {
      const ccO2 = 20.5;
      const caO2 = 20.0;
      const cvO2 = 15.2; // cAV = 4.8
      const shunt = calculateShuntFraction(ccO2, caO2, cvO2);
      expect(shunt).toBeGreaterThanOrEqual(3.0);
      expect(shunt).toBeLessThan(10.0);
    });

    it('calculates severe pathological shunt in ARDS', () => {
      const ccO2 = 21.0;
      const caO2 = 16.0;
      const cvO2 = 11.5;
      // (21 - 16) / (21 - 11.5) = 5 / 9.5 = ~52.6%
      const shunt = calculateShuntFraction(ccO2, caO2, cvO2);
      expect(shunt).toBeGreaterThan(45);
    });
  });

  describe('Hyperoxia Predicted PaO2 & Shunt Refractoriness', () => {
    it('predicts high PaO2 (>450 mmHg) when shunt is minimal (V/Q mismatch)', () => {
      const predictedPaO2 = predictPaO2OnHyperoxia(4.0, 14.0);
      expect(predictedPaO2).toBeGreaterThan(450);
    });

    it('predicts blunted refractory PaO2 when shunt is severe (35%)', () => {
      const predictedPaO2 = predictPaO2OnHyperoxia(35.0, 11.5);
      expect(predictedPaO2).toBeLessThan(150);
    });
  });

  describe('Mechanisms of Hypoxemia Classification', () => {
    it('classifies Opioid Overdose as HYPOVENTILATION with normal A-a gradient', () => {
      const mech = classifyHypoxemiaMechanism(
        760,
        0.21,
        52,  // PaO2 low
        72,  // PaCO2 high
        10,  // A-a gradient normal
        11,  // expected A-a
        4.0  // normal shunt
      );
      expect(mech).toBe('HYPOVENTILATION');
    });

    it('classifies High Altitude as LOW_FIO2_ALTITUDE', () => {
      const mech = classifyHypoxemiaMechanism(
        430, // low barometric pressure
        0.21,
        44,
        25,
        6,
        12,
        3.5
      );
      expect(mech).toBe('LOW_FIO2_ALTITUDE');
    });

    it('classifies Severe ARDS as RIGHT_TO_LEFT_SHUNT', () => {
      const mech = classifyHypoxemiaMechanism(
        760,
        0.80,
        64,
        48,
        450, // massively elevated A-a
        50,
        36.0 // 36% shunt
      );
      expect(mech).toBe('RIGHT_TO_LEFT_SHUNT');
    });

    it('classifies COPD as VQ_MISMATCH', () => {
      const mech = classifyHypoxemiaMechanism(
        760,
        0.28,
        56,
        58,
        55, // elevated A-a
        20,
        12.0 // moderate shunt < 20%
      );
      expect(mech).toBe('VQ_MISMATCH');
    });
  });

  describe('Comprehensive Analysis and Clinical Presets', () => {
    it('analyzes Severe ARDS Refractory Shunt preset accurately', () => {
      const ardsPreset = SHUNT_CLINICAL_PRESETS.find(p => p.id === 'severe-ards-refractory-shunt')!;
      const result = analyzeRespiratoryPhysiology(ardsPreset.params);

      expect(result.primaryMechanism).toBe('RIGHT_TO_LEFT_SHUNT');
      expect(result.isRefractoryToOxygen).toBe(true);
      expect(result.pfRatio).toBeLessThan(100);
      expect(result.ardsClassification).toBe('SEVERE');
      expect(result.shuntFraction).toBeGreaterThan(25);
      expect(result.clinicalRecommendations.length).toBeGreaterThanOrEqual(3);
    });

    it('analyzes Pure Hypoventilation preset with normal A-a gradient', () => {
      const hypoventPreset = SHUNT_CLINICAL_PRESETS.find(p => p.id === 'opioid-overdose-hypoventilation')!;
      const result = analyzeRespiratoryPhysiology(hypoventPreset.params);

      expect(result.primaryMechanism).toBe('HYPOVENTILATION');
      expect(result.isAaElevated).toBe(false);
      expect(result.clinicalRecommendations.some(r => r.includes('Naloxone'))).toBe(true);
    });

    it('calculates DO2 and VO2 metrics correctly', () => {
      const ardsPreset = SHUNT_CLINICAL_PRESETS[0];
      const result = analyzeRespiratoryPhysiology(ardsPreset.params);

      expect(result.do2).toBeGreaterThan(600);
      expect(result.vo2).toBeGreaterThan(150);
      expect(result.oer).toBeGreaterThan(15);
    });
  });
});