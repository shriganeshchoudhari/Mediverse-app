import {
  computeToxicologyState,
  evaluateRumackMatthew,
  calculateOsmolarAndAnionGap,
  classifyToxidrome,
  TOXICOLOGY_PRESETS,
  ToxicologyInputParams,
} from '@/.gemini/skills/ToxicologyAntidoteEngine';

describe('ToxicologyAntidoteEngine', () => {
  describe('Toxidrome Pattern Matching', () => {
    test('identifies Anticholinergic toxidrome based on dilated pupils, dry skin, tachycardia, and fever', () => {
      const { type, confidence } = classifyToxidrome(
        { heartRateBpm: 125, systolicBp: 145, diastolicBp: 90, respiratoryRate: 20, temperatureCelsius: 38.6, oxygenSaturationPct: 98, gcsScore: 13 },
        { pupils: 'DILATED', skin: 'BONE_DRY_HOT', bowelSounds: 'HYPOACTIVE_ABSENT', neuromuscular: 'NORMAL', urinaryRetention: true, salivationLacrimation: false, seizuresPresent: false }
      );
      expect(type).toBe('ANTICHOLINERGIC');
      expect(confidence).toBeGreaterThan(70);
    });

    test('identifies Cholinergic toxidrome based on pinpoint pupils, salivation, diaphoresis, and bradycardia', () => {
      const { type, confidence } = classifyToxidrome(
        { heartRateBpm: 45, systolicBp: 90, diastolicBp: 50, respiratoryRate: 26, temperatureCelsius: 36.5, oxygenSaturationPct: 90, gcsScore: 11 },
        { pupils: 'PINPOINT', skin: 'DIAPHORETIC_DRENCHED', bowelSounds: 'HYPERACTIVE_BORBORYGMI', neuromuscular: 'NORMAL', urinaryRetention: false, salivationLacrimation: true, seizuresPresent: false }
      );
      expect(type).toBe('CHOLINERGIC');
      expect(confidence).toBeGreaterThan(70);
    });

    test('identifies Opioid toxidrome based on pinpoint pupils, bradypnea, and coma', () => {
      const { type, confidence } = classifyToxidrome(
        { heartRateBpm: 58, systolicBp: 96, diastolicBp: 60, respiratoryRate: 6, temperatureCelsius: 36.0, oxygenSaturationPct: 82, gcsScore: 5 },
        { pupils: 'PINPOINT', skin: 'NORMAL', bowelSounds: 'HYPOACTIVE_ABSENT', neuromuscular: 'DEPRESSED', urinaryRetention: true, salivationLacrimation: false, seizuresPresent: false }
      );
      expect(type).toBe('OPIOID');
      expect(confidence).toBeGreaterThan(75);
    });

    test('identifies Serotonin Syndrome when hyperreflexia/clonus and diaphoresis are present', () => {
      const { type, confidence } = classifyToxidrome(
        { heartRateBpm: 130, systolicBp: 160, diastolicBp: 100, respiratoryRate: 22, temperatureCelsius: 39.2, oxygenSaturationPct: 96, gcsScore: 13 },
        { pupils: 'DILATED', skin: 'DIAPHORETIC_DRENCHED', bowelSounds: 'HYPERACTIVE_BORBORYGMI', neuromuscular: 'HYPERREFLEXIC_CLONUS', urinaryRetention: false, salivationLacrimation: false, seizuresPresent: false }
      );
      expect(type).toBe('SEROTONIN_SYNDROME');
      expect(confidence).toBeGreaterThan(70);
    });
  });

  describe('Quantitative Nomograms & Calculations', () => {
    test('Rumack-Matthew Nomogram accurately computes 150-line threshold at 4, 8, and 12 hours', () => {
      // At 4h: 150 ug/mL
      expect(evaluateRumackMatthew(160, 4).isAboveTreatmentLine).toBe(true);
      expect(evaluateRumackMatthew(140, 4).isAboveTreatmentLine).toBe(false);

      // At 8h: 75 ug/mL
      expect(evaluateRumackMatthew(80, 8).isAboveTreatmentLine).toBe(true);
      expect(evaluateRumackMatthew(70, 8).isAboveTreatmentLine).toBe(false);

      // At 12h: 37.5 ug/mL
      expect(evaluateRumackMatthew(40, 12).isAboveTreatmentLine).toBe(true);
      expect(evaluateRumackMatthew(30, 12).isAboveTreatmentLine).toBe(false);
    });

    test('calculateOsmolarAndAnionGap detects toxic alcohol high osmolar gap and HAGMA', () => {
      const result = calculateOsmolarAndAnionGap({
        apapUgMl: 0,
        hoursPostIngestion: 4,
        salicylateMgDl: 0,
        measuredOsmolalityMOsmKg: 340,
        sodiumMeqL: 140,
        glucoseMgDl: 108,
        bunMgDl: 14,
        bicarbonateMeqL: 12,
        chlorideMeqL: 102,
        potassiumMeqL: 4.5,
        arterialPh: 7.15,
        urinePh: 5.0,
        calciumOxalateCrystalsPresent: true,
      });
      // Calculated Osm = 2*140 + 108/18 + 14/2.8 = 280 + 6 + 5 = 291
      // Osmolar gap = 340 - 291 = 49 mOsm/kg
      expect(result.osmolarGap).toBeCloseTo(49.0, 0);
      expect(result.isHighOsmolarGap).toBe(true);
      // Anion gap = 140 - (102 + 12) = 26
      expect(result.anionGap).toBe(26.0);
      expect(result.isHagma).toBe(true);
    });
  });

  describe('Clinical Presets & Scenario Engine', () => {
    test('ACETAMINOPHEN_OVERDOSE_RUMACK triggers APAP hepatotoxicity alarm and NAC protocol', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.ACETAMINOPHEN_OVERDOSE_RUMACK.initialState);
      expect(state.activeAlarms).toContain('APAP_HEPATOTOXIC_TREATMENT_LINE_EXCEEDED');
      expect(state.rumackResult.isAboveTreatmentLine).toBe(true);
      expect(state.antidoteProtocolSummary).toContain('N-ACETYLCYSTEINE');
    });

    test('ORGANOPHOSPHATE_CHOLINERGIC_CRISIS triggers Killer Bs alarm and Atropine/2-PAM protocol', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.ORGANOPHOSPHATE_CHOLINERGIC_CRISIS.initialState);
      expect(state.activeAlarms).toContain('CHOLINERGIC_KILLER_BS_BRONCHORRHEA');
      expect(state.antidoteProtocolSummary).toContain('ATROPINE');
      expect(state.antidoteProtocolSummary).toContain('PRALIDOXIME');
    });

    test('FENTANYL_OPIOID_RESPIRATORY_DEPRESSION triggers opioid arrest alarm and Naloxone titration', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.FENTANYL_OPIOID_RESPIRATORY_DEPRESSION.initialState);
      expect(state.activeAlarms).toContain('OPIOID_RESPIRATORY_ARREST');
      expect(state.antidoteProtocolSummary).toContain('NALOXONE');
    });

    test('ACUTE_SALICYLATE_ASPIRIN_TOXICITY triggers urinary alkalinization recommendation', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.ACUTE_SALICYLATE_ASPIRIN_TOXICITY.initialState);
      expect(state.activeAlarms).toContain('SALICYLATE_NEUROTOXICITY_ALKALINIZATION_NEEDED');
      expect(state.antidoteProtocolSummary).toContain('SODIUM BICARBONATE');
    });

    test('ETHYLENE_GLYCOL_TOXIC_ALCOHOL triggers high osmolar gap alarm and Fomepizole', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.ETHYLENE_GLYCOL_TOXIC_ALCOHOL.initialState);
      expect(state.activeAlarms).toContain('TOXIC_ALCOHOL_HIGH_OSMOLAR_GAP');
      expect(state.antidoteProtocolSummary).toContain('FOMEPIZOLE');
    });

    test('CALCIUM_CHANNEL_BLOCKER_SHOCK triggers CCB shock alarm and HIET protocol', () => {
      const state = computeToxicologyState(TOXICOLOGY_PRESETS.CALCIUM_CHANNEL_BLOCKER_SHOCK.initialState);
      expect(state.activeAlarms).toContain('CCB_CARDIOGENIC_VASOPLEGIC_SHOCK');
      expect(state.antidoteProtocolSummary).toContain('HIGH-DOSE INSULIN EUGLYCEMIA THERAPY (HIET)');
    });
  });
});
