import {
  auditClarkCriteria,
  calculatePregnancyDic,
  evaluateRightHeartHemodynamics,
  generateAfeDirectives,
  AFE_SCENARIOS,
  PatientAfeState,
} from '../../.gemini/skills/AmnioticFluidEmbolismEngine';

describe('AmnioticFluidEmbolismEngine', () => {
  describe('auditClarkCriteria', () => {
    it('confirms Definite AFE when all 4 SMFM/Clark criteria are fulfilled', () => {
      const state = AFE_SCENARIOS.peripartum_sudden_collapse_phase1.initialState;
      const audit = auditClarkCriteria(state);

      expect(audit.allCriteriaMet).toBe(true);
      expect(audit.diagnosticCertainty).toBe('Definite AFE (Clark Criteria Confirmed)');
      expect(audit.diagnosticSummary).toContain('All 4 SMFM/Clark consensus criteria satisfied');
    });

    it('excludes AFE when intrapartum fever >= 38.0 C is present (Septic Mimic)', () => {
      const septicState = AFE_SCENARIOS.mimic_septic_chorioamnionitis.initialState;
      const audit = auditClarkCriteria(septicState);

      expect(audit.allCriteriaMet).toBe(false);
      expect(audit.diagnosticCertainty).toBe('AFE Excluded / Alternative Etiology Likely');
      expect(audit.diagnosticSummary).toContain('Fever >= 38.0 C detected');
    });

    it('identifies atypical presentation when timing exceeds 30-minute classic window', () => {
      const delayedState: PatientAfeState = {
        ...AFE_SCENARIOS.postpartum_exsanguinating_dic_phase2.initialState,
        peripartumTimingMinutes: 120, // 2 hours post delivery
      };
      const audit = auditClarkCriteria(delayedState);

      expect(audit.allCriteriaMet).toBe(false);
      expect(audit.diagnosticCertainty).toBe('Probable AFE (Atypical Presentation)');
      expect(audit.diagnosticSummary).toContain('exceeds strict 30-minute classic window');
    });
  });

  describe('calculatePregnancyDic', () => {
    it('detects severe overt hyperfibrinolytic DIC in Phase 2 collapse', () => {
      const state = AFE_SCENARIOS.postpartum_exsanguinating_dic_phase2.initialState;
      const dic = calculatePregnancyDic(state);

      expect(dic.isHypofibrinogenemiaCritical).toBe(true);
      expect(dic.consumptiveDicSeverity).toBe('Severe Overt Hyperfibrinolytic DIC');
      expect(dic.modifiedIsthScore).toBeGreaterThanOrEqual(5);
      expect(dic.hemostaticSummary).toContain('Catastrophic consumptive coagulopathy');
    });

    it('confirms normal/non-DIC pregnancy profile in absence of consumption', () => {
      const nonDicState: PatientAfeState = {
        ...AFE_SCENARIOS.mimic_septic_chorioamnionitis.initialState,
        plateletCountThousands: 240,
        serumFibrinogenMgDl: 550,
        prothrombinTimeInr: 1.0,
      };
      const dic = calculatePregnancyDic(nonDicState);

      expect(dic.isHypofibrinogenemiaCritical).toBe(false);
      expect(dic.consumptiveDicSeverity).toBe('None');
    });
  });

  describe('evaluateRightHeartHemodynamics', () => {
    it('identifies acute catastrophic cor pulmonale with severe pulmonary vasoconstriction', () => {
      const state = AFE_SCENARIOS.peripartum_sudden_collapse_phase1.initialState;
      const rvAudit = evaluateRightHeartHemodynamics(state);

      expect(rvAudit.corPulmonaleSeverity).toBe('Catastrophic Acute Cor Pulmonale');
      expect(rvAudit.isFluidLoadingHazardous).toBe(true);
      expect(rvAudit.hemodynamicSummary).toContain('Massive pulmonary vasoconstriction');
      expect(rvAudit.hemodynamicSummary).toContain('fatal right ventricular ischemia');
    });

    it('recognizes preserved RV dimensions in non-pulmonary shock', () => {
      const septicState = AFE_SCENARIOS.mimic_septic_chorioamnionitis.initialState;
      const rvAudit = evaluateRightHeartHemodynamics(septicState);

      expect(rvAudit.corPulmonaleSeverity).toBe('Normal / Preserved');
      expect(rvAudit.isFluidLoadingHazardous).toBe(false);
    });
  });

  describe('generateAfeDirectives', () => {
    it('recommends immediate E-CPR / VA-ECMO deployment for cardiorespiratory arrest', () => {
      const state = AFE_SCENARIOS.peripartum_sudden_collapse_phase1.initialState;
      const report = generateAfeDirectives(state);

      expect(report.ecmoEligibility).toBe('Immediate E-CPR / VA-ECMO Mandatory');
      expect(report.actionableDirectives).toContain(
        'E-CPR PROTOCOL ACTIVATION: Deploy cannulation team for Veno-Arterial (VA) ECMO while performing continuous high-quality chest compressions with left uterine displacement.'
      );
      expect(report.contraindicatedActions).toContain(
        'DO NOT FLUID OVERLOAD: Aggressive crystalloid boluses will dilate the failing RV, worsen septal inversion, and precipitate asystole.'
      );
    });

    it('directs rapid cryoprecipitate and TXA administration for severe consumptive DIC', () => {
      const state = AFE_SCENARIOS.postpartum_exsanguinating_dic_phase2.initialState;
      const report = generateAfeDirectives(state);

      expect(report.actionableDirectives).toContain(
        'CRITICAL HYPOFIBRINOGENEMIA: Transfuse Cryoprecipitate (10-20 units) or Fibrinogen Concentrate (2-4g) to maintain Fibrinogen > 200 mg/dL.'
      );
      expect(report.actionableDirectives).toContain(
        'Administer Tranexamic Acid (TXA) 1g IV over 10 min immediately to halt hyperfibrinolysis.'
      );
    });
  });
});
