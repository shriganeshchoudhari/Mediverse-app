import {
  calculateBishopScore,
  calculateAlertActionLines,
  calculateMontevideoUnits,
  computeLaborPartogramState,
  LABOR_PRESETS,
} from '../../.gemini/skills/LaborPartogramEngine';

describe('LaborPartogramEngine', () => {
  describe('calculateBishopScore', () => {
    it('calculates a favorable Bishop score (>= 8) correctly', () => {
      const result = calculateBishopScore({
        dilatationCm: 5, // 3 pts
        effacementPct: 80, // 3 pts
        stationFifth: 1, // 3 pts
        consistency: 'SOFT', // 2 pts
        position: 'ANTERIOR', // 2 pts
      });
      expect(result.score).toBe(13);
      expect(result.isFavorable).toBe(true);
    });

    it('calculates an unfavorable Bishop score (<= 6) correctly', () => {
      const result = calculateBishopScore({
        dilatationCm: 0, // 0 pt
        effacementPct: 20, // 0 pt
        stationFifth: -3, // 0 pt
        consistency: 'FIRM', // 0 pt
        position: 'POSTERIOR', // 0 pt
      });
      expect(result.score).toBe(0);
      expect(result.isFavorable).toBe(false);
    });

    it('calculates intermediate scores accurately', () => {
      const result = calculateBishopScore({
        dilatationCm: 2, // 1 pt (1-2cm)
        effacementPct: 50, // 1 pt (40-50%)
        stationFifth: -1, // 2 pts (-1 or 0)
        consistency: 'MEDIUM', // 1 pt
        position: 'MID_POSITION', // 1 pt
      });
      expect(result.score).toBe(6);
      expect(result.isFavorable).toBe(false);
    });
  });

  describe('calculateAlertActionLines', () => {
    it('generates alert line starting at 4cm at hour 0, increasing 1cm/h', () => {
      const h0 = calculateAlertActionLines(0);
      expect(h0.alertLineCm).toBe(4);
      const h3 = calculateAlertActionLines(3);
      expect(h3.alertLineCm).toBe(7);
      const h6 = calculateAlertActionLines(6);
      expect(h6.alertLineCm).toBe(10);
      const h8 = calculateAlertActionLines(8);
      expect(h8.alertLineCm).toBe(10); // clamped at 10
    });

    it('generates action line displaced 4 hours to the right of alert line', () => {
      const h0 = calculateAlertActionLines(0);
      expect(h0.actionLineCm).toBe(4);
      const h4 = calculateAlertActionLines(4);
      expect(h4.actionLineCm).toBe(4);
      const h7 = calculateAlertActionLines(7);
      expect(h7.actionLineCm).toBe(7);
      const h10 = calculateAlertActionLines(10);
      expect(h10.actionLineCm).toBe(10);
    });
  });

  describe('calculateMontevideoUnits', () => {
    it('calculates MVU as frequency * intensity', () => {
      expect(calculateMontevideoUnits(4, 55)).toBe(220); // adequate
      expect(calculateMontevideoUnits(2, 35)).toBe(70); // inadequate
    });
  });

  describe('Clinical Scenarios and Presets', () => {
    it('evaluates NORMAL_ACTIVE_LABOR_FAVORABLE with physiologic progression', () => {
      const params = LABOR_PRESETS.NORMAL_ACTIVE_LABOR_FAVORABLE.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.bishopScore).toBeGreaterThanOrEqual(8);
      expect(state.isCervixFavorable).toBe(true);
      expect(state.isAlertLineCrossed).toBe(false);
      expect(state.isActionLineCrossed).toBe(false);
      expect(state.laborProgressionStatus).toBe('NORMAL_PROGRESS');
      expect(state.montevideoUnits).toBeGreaterThanOrEqual(200);
      expect(state.activeAlarms).toContain('LABOR_PROGRESSION_ON_TRACK_PHYSIOLOGIC');
    });

    it('evaluates UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION indicating cervical ripening', () => {
      const params = LABOR_PRESETS.UNFAVORABLE_CERVIX_BISHOP_3_INDUCTION.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.bishopScore).toBeLessThanOrEqual(6);
      expect(state.isCervixFavorable).toBe(false);
      expect(state.recommendedRipeningAgent).toMatch(/Dinoprostone|Misoprostol|Foley/i);
    });

    it('identifies PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED and suggests oxytocin', () => {
      const params = LABOR_PRESETS.PROTRACTED_ACTIVE_PHASE_ALERT_LINE_CROSSED.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.isAlertLineCrossed).toBe(true);
      expect(state.isActionLineCrossed).toBe(false);
      expect(state.laborProgressionStatus).toBe('PROTRACTED_ACTIVE_PHASE');
      expect(state.activeAlarms).toContain('WHO_PARTOGRAM_ALERT_LINE_CROSSED_PROTRACTION');
      expect(state.clinicalGuidance).toMatch(/ALERT LINE CROSSED/i);
    });

    it('flags ARREST_OF_DILATATION_ACTION_LINE when stalled across action line', () => {
      const params = LABOR_PRESETS.ARREST_OF_DILATATION_ACTION_LINE.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.isActionLineCrossed).toBe(true);
      expect(state.laborProgressionStatus).toBe('ARREST_OF_DILATATION');
      expect(state.activeAlarms).toContain('WHO_PARTOGRAM_ACTION_LINE_CROSSED_ARREST');
      expect(state.clinicalGuidance).toMatch(/ACTION LINE CROSSED/i);
    });

    it('detects CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT with Grade 3 molding', () => {
      const params = LABOR_PRESETS.CEPHALOPELVIC_DISPROPORTION_CPD_ARREST_DESCENT.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.isCephalopelvicDisproportion).toBe(true);
      expect(state.laborProgressionStatus).toBe('ARREST_OF_DESCENT_CPD');
      expect(state.activeAlarms).toContain('CEPHALOPELVIC_DISPROPORTION_CPD_SEVERE_MOLDING');
      expect(state.clinicalGuidance).toMatch(/CEPHALOPELVIC DISPROPORTION/i);
    });

    it('triggers resuscitation for OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION', () => {
      const params = LABOR_PRESETS.OXYTOCIN_INDUCED_TACHYSYSTOLE_HYPERSTIMULATION.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.isTachysystole).toBe(true);
      expect(state.intrauterineResuscitationRequired).toBe(true);
      expect(state.activeAlarms).toContain('UTERINE_TACHYSYSTOLE_HYPERSTIMULATION_HAZARD');
      expect(state.clinicalGuidance).toMatch(/Turn off Oxytocin/i);
    });

    it('alerts on CHORIOAMNIONITIS_PROLONGED_RUPTURE with antibiotic guidance', () => {
      const params = LABOR_PRESETS.CHORIOAMNIONITIS_PROLONGED_RUPTURE.initialState;
      const state = computeLaborPartogramState(params);

      expect(state.isChorioamnionitisSuspected).toBe(true);
      expect(state.activeAlarms).toContain('INTRAAMNIOTIC_INFECTION_CHORIOAMNIONITIS_ALERT');
      expect(state.clinicalGuidance).toMatch(/Ampicillin/i);
    });
  });
});
