import { computeTraumaState, TRAUMA_PRESETS, TraumaInputParams } from '@/.gemini/skills/TraumaATLSEngine';

const DEFAULT_PARAMS: TraumaInputParams = {
  estimatedBloodLossML: 0,
  hasTensionPneumothorax: false,
  hasCardiacTamponade: false,
  hasOpenPneumothorax: false,
  hasMassiveHemothorax: false,
  hasFlailChest: false,
  hasPelvicRingDisruption: false,
  gcsPenalty: 0,
  mtpActivated: false,
  permissiveHypotensionEnabled: false,
  fastPositiveViews: [],
  tempCelsius: 37.0,
  tbsaBurnPct: 0,
};

describe('TraumaATLSEngine', () => {
  describe('Hemorrhagic Shock Classification', () => {
    test('Class I: <750 mL blood loss is hemodynamically stable', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 400 });
      expect(state.shockClass).toBe('CLASS_I');
      expect(state.hrBpm).toBeLessThan(105);
      expect(state.sbpMmHg).toBeGreaterThan(100);
      expect(state.activeAlarms).toContain('OPTIMAL');
    });

    test('Class II: 750–1500 mL triggers anxiety-range vitals', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 1100 });
      expect(state.shockClass).toBe('CLASS_II');
      expect(state.hrBpm).toBeGreaterThanOrEqual(100);
      expect(state.activeAlarms).toContain('HEMORRHAGIC_SHOCK_II');
    });

    test('Class III: 1500–2000 mL causes confusion + hypotension', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 1700, mtpActivated: true });
      expect(state.shockClass).toBe('CLASS_III');
      expect(state.sbpMmHg).toBeLessThan(92);
      expect(state.activeAlarms).toContain('HEMORRHAGIC_SHOCK_III');
      expect(state.activeAlarms).toContain('MTP_ACTIVATED');
    });

    test('Class IV: >2000 mL is exsanguinating with lethal vitals', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 2800, mtpActivated: true });
      expect(state.shockClass).toBe('CLASS_IV');
      expect(state.hrBpm).toBeGreaterThanOrEqual(140);
      expect(state.circulation).toBe('EXSANGUINATING');
      expect(state.activeAlarms).toContain('HEMORRHAGIC_SHOCK_IV');
    });
  });

  describe('Shock Index', () => {
    test('Shock index >1.0 in Class III+ shock', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 1800 });
      expect(state.shockIndex).toBeGreaterThan(1.0);
    });
  });

  describe('Immediately Life-Threatening Injuries', () => {
    test('Tension pneumothorax causes obstructive shock pattern', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, hasTensionPneumothorax: true });
      expect(state.breathing).toBe('TENSION_PTX');
      expect(state.sbpMmHg).toBeLessThanOrEqual(68);
      expect(state.spo2Pct).toBeLessThan(85);
      expect(state.activeAlarms).toContain('TENSION_PNEUMOTHORAX');
    });

    test('Cardiac tamponade shows narrow pulse pressure with Beck triad physiology', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, hasCardiacTamponade: true });
      expect(state.circulation).toBe('TAMPONADE');
      expect(state.sbpMmHg).toBeLessThanOrEqual(76);
      expect(state.activeAlarms).toContain('CARDIAC_TAMPONADE');
    });

    test('Massive hemothorax reduces SpO2 and triggers alarm', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, hasMassiveHemothorax: true });
      expect(state.breathing).toBe('MASSIVE_HEMOTHORAX');
      expect(state.spo2Pct).toBeLessThan(90);
      expect(state.activeAlarms).toContain('MASSIVE_HEMOTHORAX');
    });
  });

  describe('FAST Exam', () => {
    test('FAST is negative by default (no positive views specified)', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS });
      expect(state.fastPositive).toBe(false);
      expect(state.fastFindings.every(f => f.result === 'NEGATIVE')).toBe(true);
    });

    test('FAST positive with Morison pouch free fluid', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, fastPositiveViews: ['MORISON_POUCH', 'SPLENORENAL'] });
      expect(state.fastPositive).toBe(true);
      const morisonFinding = state.fastFindings.find(f => f.view === 'MORISON_POUCH');
      expect(morisonFinding?.result).toBe('POSITIVE');
      expect(morisonFinding?.fluidDepthMm).toBeGreaterThan(0);
    });

    test('Pericardial FAST positive with tamponade', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, hasCardiacTamponade: true, fastPositiveViews: ['PERICARDIAL_SUBXIPHOID'] });
      const pericard = state.fastFindings.find(f => f.view === 'PERICARDIAL_SUBXIPHOID');
      expect(pericard?.result).toBe('POSITIVE');
    });
  });

  describe('Lethal Triad & Damage Control', () => {
    test('Lethal triad (hypothermia + acidosis + coagulopathy) triggers damage control', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 2500, tempCelsius: 34.0 });
      expect(state.damageControlIndicated).toBe(true);
      expect(state.activeAlarms).toContain('DAMAGE_CONTROL_INDICATED');
      expect(state.tempCelsius).toBe(34.0);
      expect(state.exposureHypothermia).toBe(true);
    });

    test('Hypothermia alarm when temp <35 degrees Celsius', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, tempCelsius: 34.5 });
      expect(state.activeAlarms).toContain('HYPOTHERMIA_COAGULOPATHY');
    });
  });

  describe('Preset Catalog', () => {
    test('All 6 presets are defined with required fields', () => {
      expect(Object.keys(TRAUMA_PRESETS)).toHaveLength(6);
      Object.values(TRAUMA_PRESETS).forEach(p => {
        expect(p.title).toBeTruthy();
        expect(p.mechanism).toBeTruthy();
        expect(p.primarySurveyFinding).toBeTruthy();
        expect(p.initialState).toBeDefined();
      });
    });

    test('POLYTRAUMA_CLASS_IV preset produces Class IV shock', () => {
      const preset = TRAUMA_PRESETS['POLYTRAUMA_CLASS_IV'];
      const state = computeTraumaState({ ...DEFAULT_PARAMS, ...preset.initialState });
      expect(state.shockClass).toBe('CLASS_IV');
    });

    test('TENSION_PNEUMOTHORAX preset triggers tension PTX alarm', () => {
      const preset = TRAUMA_PRESETS['TENSION_PNEUMOTHORAX'];
      const state = computeTraumaState({ ...DEFAULT_PARAMS, ...preset.initialState });
      expect(state.activeAlarms).toContain('TENSION_PNEUMOTHORAX');
    });
  });

  describe('MTP & Labs', () => {
    test('MTP activation populates pRBC FFP platelets units given', () => {
      const state = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 1800, mtpActivated: true });
      expect(state.mtp.activated).toBe(true);
      expect(state.mtp.prbcUnitsGiven).toBeGreaterThan(0);
      expect(state.mtp.ffpUnitsGiven).toBeGreaterThan(0);
      expect(state.mtp.txa1gGiven).toBe(true);
    });

    test('Hemoglobin drops proportionally to blood loss', () => {
      const normal = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 0 });
      const heavy  = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 3000 });
      expect(heavy.hemoglobinGdL).toBeLessThan(normal.hemoglobinGdL);
    });

    test('Lactate rises with hemorrhagic shock severity', () => {
      const mild   = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 500 });
      const severe = computeTraumaState({ ...DEFAULT_PARAMS, estimatedBloodLossML: 2500 });
      expect(severe.lactateMmolL).toBeGreaterThan(mild.lactateMmolL);
    });
  });
});
