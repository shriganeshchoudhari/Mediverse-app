/**
 * AcuteLiverFailureEngine.test.ts
 * Unit tests for AcuteLiverFailureEngine.
 */

import {
  evaluateKingsCriteria,
  evaluateClichyCriteria,
  classifyLatencyPhenotype,
  calculateCerebralEdemaRisk,
  evaluateCoagulopathy,
  ALF_SCENARIOS,
} from '../../.gemini/skills/AcuteLiverFailureEngine';

describe('AcuteLiverFailureEngine', () => {
  describe('evaluateKingsCriteria', () => {
    it('fulfills APAP criteria based on arterial pH < 7.30 alone', () => {
      const state = ALF_SCENARIOS.severe_apap_overdose.initialState;
      const report = evaluateKingsCriteria(state);

      expect(report.isCriteriaFulfilled).toBe(true);
      expect(report.algorithmType).toBe('Acetaminophen (APAP)');
      expect(report.emergencyListingRecommended).toBe(true);
      expect(report.fulfilledSpecificCriteria.some((c) => c.includes('pH < 7.30'))).toBe(true);
    });

    it('fulfills Non-APAP criteria with >= 3 of 5 adverse prognostic markers', () => {
      const state = ALF_SCENARIOS.acute_hepatitis_b_fulminant.initialState;
      const report = evaluateKingsCriteria(state);

      expect(report.isCriteriaFulfilled).toBe(true);
      expect(report.algorithmType).toBe('Non-Acetaminophen (Non-APAP)');
      expect(report.emergencyListingRecommended).toBe(true);
      expect(report.mortalityWithoutTransplantPercent).toBeGreaterThanOrEqual(90);
    });
  });

  describe('evaluateClichyCriteria', () => {
    it('fulfills Clichy criteria for age >= 30 when Factor V < 30% with Grade 3 encephalopathy', () => {
      const state = ALF_SCENARIOS.acute_hepatitis_b_fulminant.initialState;
      const clichy = evaluateClichyCriteria(state);

      expect(clichy.isCriteriaMet).toBe(true);
      expect(clichy.factorVCutoffPercent).toBe(30);
    });

    it('uses 20% Factor V cutoff for patients under age 30', () => {
      const youngPatient = {
        ...ALF_SCENARIOS.wilsons_fulminant_crisis.initialState,
        patientAge: 22,
        factorVPercent: 25,
        encephalopathyGrade: 3 as const,
      };
      const clichy = evaluateClichyCriteria(youngPatient);

      expect(clichy.factorVCutoffPercent).toBe(20);
      expect(clichy.isCriteriaMet).toBe(false); // 25% is not < 20%
    });
  });

  describe('classifyLatencyPhenotype', () => {
    it('identifies hyperacute phenotype with high cerebral edema risk and high recovery potential', () => {
      const report = classifyLatencyPhenotype(3);
      expect(report.phenotype).toMatch(/Hyperacute/i);
      expect(report.cerebralEdemaRisk).toMatch(/Very High/i);
      expect(report.spontaneousSurvivalPotential).toMatch(/Highest/i);
    });

    it('identifies subacute phenotype with low cerebral edema risk but poor transplant-free survival', () => {
      const report = classifyLatencyPhenotype(35);
      expect(report.phenotype).toMatch(/Subacute/i);
      expect(report.cerebralEdemaRisk).toMatch(/Low/i);
      expect(report.spontaneousSurvivalPotential).toMatch(/Poorest/i);
    });
  });

  describe('calculateCerebralEdemaRisk', () => {
    it('calculates intracranial hypertension when arterial ammonia exceeds 200 umol/L', () => {
      const state = ALF_SCENARIOS.severe_apap_overdose.initialState;
      const edema = calculateCerebralEdemaRisk(state);

      expect(edema.projectedIcpMmHg).toBeGreaterThanOrEqual(20);
      expect(edema.herniationRiskPercent).toBeGreaterThanOrEqual(35);
      expect(edema.astrocyticSwellingGrade).toMatch(/Severe Cytotoxic Swelling|Herniation/i);
      expect(edema.neurocriticalTargetDeviations.some((d) => d.includes('ammonia critical'))).toBe(true);
    });
  });

  describe('evaluateCoagulopathy', () => {
    it('confirms rebalanced hemostasis and strictly forbids prophylactic FFP', () => {
      const state = ALF_SCENARIOS.severe_apap_overdose.initialState;
      const coag = evaluateCoagulopathy(state);

      expect(coag.isRebalancedHemostasis).toBe(true);
      expect(coag.ffpProphylaxisPermitted).toBe(false);
      expect(coag.coagulopathyWarning).toMatch(/Prophylactic FFP administration is STRICTLY CONTRAINDICATED/i);
    });
  });

  describe('ALF_SCENARIOS Catalog', () => {
    it('contains all 4 representative ALF cases', () => {
      const keys = Object.keys(ALF_SCENARIOS);
      expect(keys).toHaveLength(4);
      expect(keys).toContain('severe_apap_overdose');
      expect(keys).toContain('acute_hepatitis_b_fulminant');
      expect(keys).toContain('dili_subacute_failure');
      expect(keys).toContain('wilsons_fulminant_crisis');
    });
  });
});
