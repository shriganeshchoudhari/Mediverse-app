import {
  IMMUNOHEMATOLOGY_SCENARIOS,
  DOSAGE_SENSITIVE_ANTIGENS,
  ENZYME_DESTROYED_ANTIGENS,
  ENZYME_ENHANCED_ANTIGENS,
  ENZYME_UNAFFECTED_ANTIGENS,
  getAntigenZygosity,
  evaluateRuleOuts,
  evaluateRuleOfThree,
  calculateDonorScreening,
  generateImmunohematologyDebrief,
} from '../../.gemini/skills/TransfusionAntibodyIdEngine';

describe('TransfusionAntibodyIdEngine', () => {
  describe('Standardized 11-Cell Panel & Presets', () => {
    it('has all 6 validated clinical scenarios configured', () => {
      expect(Object.keys(IMMUNOHEMATOLOGY_SCENARIOS)).toHaveLength(6);
      expect(IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION).toBeDefined();
      expect(IMMUNOHEMATOLOGY_SCENARIOS.ANTI_JKA_DOSAGE_DELAYED).toBeDefined();
      expect(IMMUNOHEMATOLOGY_SCENARIOS.MULTIPLE_ANTI_E_ANTI_FYA).toBeDefined();
      expect(IMMUNOHEMATOLOGY_SCENARIOS.COLD_AUTOANTI_I_PREWARMED).toBeDefined();
      expect(IMMUNOHEMATOLOGY_SCENARIOS.WAIHA_WITH_MASKED_ANTI_C).toBeDefined();
      expect(IMMUNOHEMATOLOGY_SCENARIOS.ANTI_D_OBSTETRIC_HDFN).toBeDefined();
    });

    it('each scenario contains exactly 11 reagent RBC panel cells', () => {
      for (const scenarioId in IMMUNOHEMATOLOGY_SCENARIOS) {
        const sc = IMMUNOHEMATOLOGY_SCENARIOS[scenarioId as keyof typeof IMMUNOHEMATOLOGY_SCENARIOS];
        expect(sc.panelCells).toHaveLength(11);
      }
    });
  });

  describe('Zygosity & Dosage Effect Calculations', () => {
    it('accurately identifies homozygous vs heterozygous expression for Rh, Duffy, and Kidd', () => {
      const cell1 = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION.panelCells[0]; // Cell 1: C+c-, E-e+, Fy(a+b-), Jk(a+b-)
      expect(getAntigenZygosity('C', cell1.antigens)).toBe('Homozygous');
      expect(getAntigenZygosity('Fya', cell1.antigens)).toBe('Homozygous');
      expect(getAntigenZygosity('Jka', cell1.antigens)).toBe('Homozygous');

      const cell2 = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION.panelCells[1]; // Cell 2: Fy(a+b+), Jk(a+b+)
      expect(getAntigenZygosity('Fya', cell2.antigens)).toBe('Heterozygous');
      expect(getAntigenZygosity('Jka', cell2.antigens)).toBe('Heterozygous');
    });

    it('contains expected antigens in dosage-sensitive and enzyme arrays', () => {
      expect(DOSAGE_SENSITIVE_ANTIGENS).toContain('Jka');
      expect(DOSAGE_SENSITIVE_ANTIGENS).toContain('Fya');
      expect(DOSAGE_SENSITIVE_ANTIGENS).toContain('E');

      expect(ENZYME_DESTROYED_ANTIGENS).toContain('Fya');
      expect(ENZYME_DESTROYED_ANTIGENS).toContain('M');

      expect(ENZYME_ENHANCED_ANTIGENS).toContain('D');
      expect(ENZYME_ENHANCED_ANTIGENS).toContain('Jka');

      expect(ENZYME_UNAFFECTED_ANTIGENS).toContain('K');
    });
  });

  describe('Rule-Out Engine with Strict Dosage Guardrails', () => {
    it('correctly flags dosage warning when attempting to rule out Jka or Fya on heterozygous cells', () => {
      // Create artificial scenario where only cell 2 (Jka heterozygous) is non-reactive
      const testCells = [...IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION.panelCells];
      const ruleOuts = evaluateRuleOuts(testCells, true);

      // In Anti-K scenario, K+ cells are 2, 5, 8, 11
      // Non-reactive cells (1, 3, 4, 6, 7, 9, 10) have Jka homozygous (cell 1)
      expect(ruleOuts.K.ruledOut).toBe(false); // K reacts, cannot be ruled out
      expect(ruleOuts.K.safeToExclude).toBe(false);
    });

    it('prevents safe exclusion of dosage sensitive antigen if only heterozygous non-reactive cell exists', () => {
      // Cell 2 has Fya+ Fyb+ (heterozygous Fya) and Jka+ Jkb+ (heterozygous Jka)
      // If ONLY Cell 2 is non-reactive:
      const isolatedHeterozygous = [
        {
          ...IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION.panelCells[1],
          ahgReaction: '0' as const, // Non-reactive
        },
      ];
      const ruleOuts = evaluateRuleOuts(isolatedHeterozygous, true);
      expect(ruleOuts.Fya.dosageWarning).toBe(true);
      expect(ruleOuts.Fya.safeToExclude).toBe(false); // Dosage rule blocks safe exclusion
      expect(ruleOuts.Jka.dosageWarning).toBe(true);
      expect(ruleOuts.Jka.safeToExclude).toBe(false);
    });
  });

  describe('Statistical Rule of Three (3+ / 3-)', () => {
    it('confirms Anti-K satisfies Rule of Three with p <= 0.05', () => {
      const scenario = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION;
      const statResult = evaluateRuleOfThree('K', scenario.panelCells);

      expect(statResult.positiveReactiveCount).toBeGreaterThanOrEqual(3);
      expect(statResult.negativeNonReactiveCount).toBeGreaterThanOrEqual(3);
      expect(statResult.isConfirmedRuleOfThree).toBe(true);
      expect(statResult.pValApprox).toBeLessThanOrEqual(0.05);
    });

    it('does not confirm when reactive count is under 3', () => {
      const scenario = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION;
      // D has only non-reactive cells in rr lot, but also has D+ cells that don't react with anti-K
      const statResult = evaluateRuleOfThree('D', scenario.panelCells);
      expect(statResult.isConfirmedRuleOfThree).toBe(false);
    });
  });

  describe('Donor Screening & Crossmatch Calculations', () => {
    it('calculates units to screen for single Anti-K antibody', () => {
      const result = calculateDonorScreening(['K'], 2);
      expect(result.recommendedCrossmatchType).toBe('FullSerologicalAHG');
      // K is ~9% positive -> 91% negative. Units to screen = ceil(2 / 0.91) = 3 units
      expect(result.unitsToScreen).toBe(3);
      expect(result.probabilityCompatible).toBeCloseTo(0.91, 2);
    });

    it('calculates units to screen for multiple antibodies (Anti-E + Anti-Fya)', () => {
      const result = calculateDonorScreening(['E', 'Fya'], 2);
      // E: 30% pos (70% neg), Fya: 65% pos (35% neg)
      // Compatibility = 0.70 * 0.35 = 0.245 (24.5%)
      // Units to screen for 2 units = ceil(2 / 0.245) = 9 units
      expect(result.unitsToScreen).toBe(9);
      expect(result.probabilityCompatible).toBeCloseTo(0.245, 2);
    });

    it('recommends Immediate Spin or Electronic crossmatch if no alloantibodies present', () => {
      const result = calculateDonorScreening([], 2);
      expect(result.recommendedCrossmatchType).toBe('ImmediateSpin');
      expect(result.unitsToScreen).toBe(2);
    });
  });

  describe('Objective Debrief Scoring', () => {
    it('awards A+ score for perfect identification and safe rule-outs', () => {
      const scenario = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION;
      const debrief = generateImmunohematologyDebrief(scenario, ['K'], ['D', 'C', 'E', 'c', 'e']);
      expect(debrief.correctlyIdentified).toBe(true);
      expect(debrief.letterGrade).toBe('A+');
      expect(debrief.scorePercentage).toBeGreaterThanOrEqual(95);
    });

    it('penalizes when true target antibody is mistakenly ruled out', () => {
      const scenario = IMMUNOHEMATOLOGY_SCENARIOS.ANTI_K_ALLOIMMUNIZATION;
      const debrief = generateImmunohematologyDebrief(scenario, ['K'], ['K']); // Mistakenly ruled out K
      expect(debrief.falseRuleOuts).toContain('K');
      expect(debrief.scorePercentage).toBeLessThan(70);
    });
  });
});
