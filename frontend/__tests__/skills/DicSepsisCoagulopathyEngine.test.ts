/**
 * DicSepsisCoagulopathyEngine.test.ts
 * Unit tests for DIC, SIC diagnostic scoring, component replacement and microvascular injury evaluation.
 */

import {
  calculateIsthScore,
  calculateSicScore,
  calculateReplacementDosing,
  evaluateMicrovascularInjury,
  DIC_SCENARIOS,
} from '../../.gemini/skills/DicSepsisCoagulopathyEngine';

describe('DicSepsisCoagulopathyEngine', () => {
  describe('calculateIsthScore (Taylor et al. 2001 Criteria)', () => {
    it('correctly scores severe overt DIC (8/8 points)', () => {
      // Platelets 25k (<50 = 2), D-Dimer 9000 (>4000 = 3), PT prolonged 8s (>6s = 2), Fibrinogen 70 (<100 = 1)
      const isth = calculateIsthScore(25, 9000, 8, 70);
      expect(isth.plateletScore).toBe(2);
      expect(isth.fibrinMarkerScore).toBe(3);
      expect(isth.ptProlongationScore).toBe(2);
      expect(isth.fibrinogenScore).toBe(1);
      expect(isth.totalScore).toBe(8);
      expect(isth.isOvertDic).toBe(true);
      expect(isth.repeatIntervalHours).toBe(12);
    });

    it('identifies non-overt DIC (score < 5)', () => {
      // Platelets 85k (1), D-Dimer 2000 (2), PT prolonged 2s (0), Fibrinogen 220 (0) => 3/8
      const isth = calculateIsthScore(85, 2000, 2, 220);
      expect(isth.plateletScore).toBe(1);
      expect(isth.fibrinMarkerScore).toBe(2);
      expect(isth.ptProlongationScore).toBe(0);
      expect(isth.fibrinogenScore).toBe(0);
      expect(isth.totalScore).toBe(3);
      expect(isth.isOvertDic).toBe(false);
      expect(isth.repeatIntervalHours).toBe(24);
    });

    it('handles exact score 5 as overt DIC threshold', () => {
      // Platelets 45k (2), D-Dimer 5000 (3), PT prolonged 1s (0), Fibrinogen 150 (0) => 5/8
      const isth = calculateIsthScore(45, 5000, 1, 150);
      expect(isth.totalScore).toBe(5);
      expect(isth.isOvertDic).toBe(true);
    });
  });

  describe('calculateSicScore (Iba et al. Sepsis-Induced Coagulopathy)', () => {
    it('detects early SIC in patient with cardiorespiratory dysfunction and mild coagulopathy', () => {
      // SOFA 2, Platelets 120k (1), INR 1.35 (1) => Total 4, hemostatic = 2 => Positive SIC
      const sic = calculateSicScore(2, 120, 1.35);
      expect(sic.sofaScore).toBe(2);
      expect(sic.plateletScore).toBe(1);
      expect(sic.inrScore).toBe(1);
      expect(sic.totalScore).toBe(4);
      expect(sic.isSicPositive).toBe(true);
    });

    it('returns negative SIC when total score < 4 or hemostatic parameters < 2', () => {
      // SOFA 2, Platelets 180k (0), INR 1.25 (1) => Total 3, hemostatic = 1 => Negative SIC
      const sic = calculateSicScore(2, 180, 1.25);
      expect(sic.totalScore).toBe(3);
      expect(sic.isSicPositive).toBe(false);
    });
  });

  describe('calculateReplacementDosing', () => {
    it('recommends platelet transfusion for count < 50k during active bleeding', () => {
      const state = {
        plateletsKPerUl: 35,
        fibrinogenMgDl: 180,
        ptSeconds: 14,
        inr: 1.2,
        dDimerNgMlFeu: 5000,
        antithrombinIiiPercent: 60,
        proteinCPercent: 65,
      };

      const advice = calculateReplacementDosing(state, 70, true, false);
      expect(advice.plateletsUnitsRecommended).toBe(1);
      expect(advice.plateletRationale).toContain('Target >= 50,000/uL');
    });

    it('withholds platelet transfusion in non-bleeding patient with platelet count > 10k', () => {
      const state = {
        plateletsKPerUl: 25,
        fibrinogenMgDl: 180,
        ptSeconds: 14,
        inr: 1.2,
        dDimerNgMlFeu: 5000,
        antithrombinIiiPercent: 60,
        proteinCPercent: 65,
      };

      const advice = calculateReplacementDosing(state, 70, false, false);
      expect(advice.plateletsUnitsRecommended).toBe(0);
      expect(advice.plateletRationale).toContain('No active bleeding');
    });

    it('calculates cryoprecipitate and fibrinogen concentrate dose for hypofibrinogenemia with bleeding', () => {
      const state = {
        plateletsKPerUl: 60,
        fibrinogenMgDl: 60, // deficit = 150 - 60 = 90 mg/dL
        ptSeconds: 15,
        inr: 1.3,
        dDimerNgMlFeu: 6000,
        antithrombinIiiPercent: 55,
        proteinCPercent: 50,
      };

      const advice = calculateReplacementDosing(state, 70, true, false);
      expect(advice.fibrinogenConcentrateGramsRecommended).toBeGreaterThan(2.0);
      expect(advice.cryoprecipitateUnitsRecommended).toBeGreaterThanOrEqual(10);
    });

    it('calculates FFP dose for INR > 1.5 with active bleeding', () => {
      const state = {
        plateletsKPerUl: 60,
        fibrinogenMgDl: 160,
        ptSeconds: 22,
        inr: 1.9,
        dDimerNgMlFeu: 4500,
        antithrombinIiiPercent: 50,
        proteinCPercent: 55,
      };

      const advice = calculateReplacementDosing(state, 70, true, false);
      // 70 kg * 15 mL/kg = 1050 mL rounded to nearest 50 = 1050 mL
      expect(advice.ffpVolumeMlRecommended).toBe(1050);
    });

    it('issues contraindication warning against TXA in standard procoagulant DIC', () => {
      const state = {
        plateletsKPerUl: 40,
        fibrinogenMgDl: 80,
        ptSeconds: 20,
        inr: 1.8,
        dDimerNgMlFeu: 8000,
        antithrombinIiiPercent: 40,
        proteinCPercent: 35,
      };

      const advice = calculateReplacementDosing(state, 70, true, false, false);
      expect(advice.antifibrinolyticsContraindicated).toBe(true);
      expect(advice.txaSafetyWarning).toContain('CONTRAINDICATED');
    });

    it('permits TXA in hyperfibrinolytic phenotype (APL)', () => {
      const state = {
        plateletsKPerUl: 25,
        fibrinogenMgDl: 70,
        ptSeconds: 18,
        inr: 1.5,
        dDimerNgMlFeu: 15000,
        antithrombinIiiPercent: 80,
        proteinCPercent: 85,
      };

      const advice = calculateReplacementDosing(state, 70, true, false, true);
      expect(advice.antifibrinolyticsContraindicated).toBe(false);
      expect(advice.txaSafetyWarning).toContain('PERMITTED WITH CAUTION');
    });
  });

  describe('evaluateMicrovascularInjury', () => {
    it('detects critical thrombosis risk and end-organ injury alerts when D-dimer is high and AT is depleted', () => {
      const state = {
        plateletsKPerUl: 30,
        fibrinogenMgDl: 80,
        ptSeconds: 22,
        inr: 2.0,
        dDimerNgMlFeu: 12000,
        antithrombinIiiPercent: 35,
        proteinCPercent: 28,
      };

      const report = evaluateMicrovascularInjury(state, true, true);
      expect(report.thrombosisRiskLevel).toBe('Critical');
      expect(report.bleedingRiskLevel).toBe('Critical');
      expect(report.targetOrganInjuryAlerts.length).toBeGreaterThan(0);
      expect(report.targetOrganInjuryAlerts.some((a) => a.includes('Purpura Fulminans'))).toBe(true);
    });
  });

  describe('DIC_SCENARIOS Catalog', () => {
    it('contains all 4 key clinical scenarios', () => {
      expect(DIC_SCENARIOS.septic_shock_purpura).toBeDefined();
      expect(DIC_SCENARIOS.placental_abruption).toBeDefined();
      expect(DIC_SCENARIOS.apl_hyperfibrinolysis).toBeDefined();
      expect(DIC_SCENARIOS.early_sic_responder).toBeDefined();
    });

    it('septic_shock_purpura qualifies for overt DIC with high ISTH score', () => {
      const sc = DIC_SCENARIOS.septic_shock_purpura;
      const ptProlongation = sc.initialLabs.ptSeconds - 12;
      const isth = calculateIsthScore(
        sc.initialLabs.plateletsKPerUl,
        sc.initialLabs.dDimerNgMlFeu,
        ptProlongation,
        sc.initialLabs.fibrinogenMgDl
      );
      expect(isth.isOvertDic).toBe(true);
      expect(isth.totalScore).toBeGreaterThanOrEqual(6);
    });

    it('early_sic_responder meets SIC criteria but remains non-overt on ISTH', () => {
      const sc = DIC_SCENARIOS.early_sic_responder;
      const sic = calculateSicScore(sc.sofaNonHematologic, sc.initialLabs.plateletsKPerUl, sc.initialLabs.inr);
      expect(sic.isSicPositive).toBe(true);

      const ptProlongation = sc.initialLabs.ptSeconds - 12;
      const isth = calculateIsthScore(
        sc.initialLabs.plateletsKPerUl,
        sc.initialLabs.dDimerNgMlFeu,
        ptProlongation,
        sc.initialLabs.fibrinogenMgDl
      );
      expect(isth.isOvertDic).toBe(false);
    });
  });
});
