import {
  TEN_RIGHTS_OF_MEDICATION,
  PINCH_HIGH_ALERT_MEDS,
  OSCE_SKILL_STATIONS
} from '../../lib/nursing/MedicationSafetyPresets';

describe('MedicationSafetyPresets', () => {
  it('has exactly 10 rights in TEN_RIGHTS_OF_MEDICATION', () => {
    expect(TEN_RIGHTS_OF_MEDICATION.length).toBe(10);
    expect(TEN_RIGHTS_OF_MEDICATION[0].right).toBe('Right Patient');
  });

  it('has 5 entries in PINCH_HIGH_ALERT_MEDS', () => {
    expect(PINCH_HIGH_ALERT_MEDS.length).toBe(5);
    const acronyms = PINCH_HIGH_ALERT_MEDS.map(m => m.acronym);
    expect(acronyms).toEqual(['P', 'I', 'N', 'C', 'H']);
  });

  it('has at least 4 stations in OSCE_SKILL_STATIONS with checklists', () => {
    expect(OSCE_SKILL_STATIONS.length).toBeGreaterThanOrEqual(4);
    OSCE_SKILL_STATIONS.forEach(station => {
      expect(station.checklistItems.length).toBeGreaterThan(0);
    });
  });
});
