import {
  calculateCellularAsphyxiation,
  auditIrritantPulmonaryInjury,
  evaluateAntidoteSafety,
  TOXIC_GAS_SCENARIOS,
  PatientToxicGasState,
} from '../../.gemini/skills/ToxicGasInhalationEngine';

describe('ToxicGasInhalationEngine', () => {
  describe('calculateCellularAsphyxiation', () => {
    it('detects profound mitochondrial Complex IV arrest and histotoxic hypoxia in Cyanide poisoning', () => {
      const state = TOXIC_GAS_SCENARIOS.smoke_inhalation_cyanide.initialState;
      const result = calculateCellularAsphyxiation(state);

      expect(result.cytochromeInhibitionPercent).toBeGreaterThanOrEqual(80);
      expect(result.isHistotoxicHypoxia).toBe(true);
      expect(result.lactateToxicitySeverity).toBe('Profound Cytotoxic Lactic Acidosis');
      expect(result.cellularSummary).toContain('SEVERE MITOCHONDRIAL ARREST');
    });

    it('calculates restoration of cellular respiration following Hydroxocobalamin and Thiosulfate', () => {
      const treatedState: PatientToxicGasState = {
        ...TOXIC_GAS_SCENARIOS.smoke_inhalation_cyanide.initialState,
        activeAntidotes: {
          ...TOXIC_GAS_SCENARIOS.smoke_inhalation_cyanide.initialState.activeAntidotes,
          hydroxocobalaminGrams: 5,
          sodiumThiosulfateGiven: true,
        },
      };
      const result = calculateCellularAsphyxiation(treatedState);

      // 70% + 25% = 95% relief factor
      expect(result.cytochromeInhibitionPercent).toBeLessThan(10);
    });
  });

  describe('auditIrritantPulmonaryInjury', () => {
    it('detects the deceptive latent window in Phosgene exposure at hour 7', () => {
      const state = TOXIC_GAS_SCENARIOS.phosgene_delayed_pulmonary_edema.initialState;
      const result = auditIrritantPulmonaryInjury(state);

      expect(result.projectedArdsRiskPercent).toBeGreaterThan(80);
      expect(result.airwayBurnSeverity).toBe('Severe Alveolocapillary Disruption');
      expect(result.pulmonaryEdemaSummary).toContain('phosgene alveolar flooding');
    });

    it('identifies early latent phase at hour 4 with minimal edema', () => {
      const earlyPhosgene: PatientToxicGasState = {
        ...TOXIC_GAS_SCENARIOS.phosgene_delayed_pulmonary_edema.initialState,
        timeSinceExposureHours: 4.0,
        lungWaterEdemaIndex: 2,
      };
      const result = auditIrritantPulmonaryInjury(earlyPhosgene);

      expect(result.latentPhaseActive).toBe(true);
      expect(result.pulmonaryEdemaSummary).toContain('DECEPTIVE PHOSGENE LATENT PHASE');
    });

    it('evaluates chlorine acidic mucosal injury and projected ARDS risk', () => {
      const state = TOXIC_GAS_SCENARIOS.chlorine_industrial_spill.initialState;
      const result = auditIrritantPulmonaryInjury(state);

      expect(result.airwayBurnSeverity).toBe('Severe Alveolocapillary Disruption');
      expect(result.projectedArdsRiskPercent).toBeGreaterThan(50);
    });
  });

  describe('evaluateAntidoteSafety', () => {
    it('strictly contraindicates Sodium Nitrite in smoke inhalation with concomitant Carbon Monoxide', () => {
      const state = TOXIC_GAS_SCENARIOS.smoke_inhalation_cyanide.initialState;
      const audit = evaluateAntidoteSafety(state);

      expect(audit.recommendedFirstLineAntidote).toContain('Hydroxocobalamin');
      expect(audit.contraindicatedAntidotes.length).toBeGreaterThanOrEqual(1);
      expect(audit.contraindicatedAntidotes[0]).toContain('STRICT CONTRAINDICATION: Sodium Nitrite / Amyl Nitrite');
      expect(audit.contraindicatedAntidotes[0]).toContain('COHb 24%');
    });

    it('recommends Sodium Nitrite for Hydrogen Sulfide knockdown to induce methemoglobin scavenger', () => {
      const state = TOXIC_GAS_SCENARIOS.sewer_h2s_knockdown.initialState;
      const audit = evaluateAntidoteSafety(state);

      expect(audit.recommendedFirstLineAntidote).toContain('Sodium Nitrite 300mg IV');
      expect(audit.contraindicatedAntidotes).toHaveLength(0);
      expect(audit.actionableProtocolSteps[0]).toContain('generate Methemoglobin (Fe3+)');
    });

    it('recommends Nebulized Sodium Bicarbonate for Chlorine acidic burn', () => {
      const state = TOXIC_GAS_SCENARIOS.chlorine_industrial_spill.initialState;
      const audit = evaluateAntidoteSafety(state);

      expect(audit.recommendedFirstLineAntidote).toContain('Nebulized Sodium Bicarbonate');
      expect(audit.actionableProtocolSteps[0]).toContain('neutralize mucosal acid formation');
    });

    it('enforces strict bedrest and prophylactic PEEP for Phosgene', () => {
      const state = TOXIC_GAS_SCENARIOS.phosgene_delayed_pulmonary_edema.initialState;
      const audit = evaluateAntidoteSafety(state);

      expect(audit.recommendedFirstLineAntidote).toContain('Strict Absolute Bedrest');
      expect(audit.actionableProtocolSteps[0]).toContain('STRICT ABSOLUTE BEDREST');
      expect(audit.actionableProtocolSteps[1]).toContain('prophylactic CPAP / PEEP');
    });
  });
});
