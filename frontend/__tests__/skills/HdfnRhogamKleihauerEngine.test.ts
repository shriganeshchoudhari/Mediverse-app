import {
  computeMedianMcaPsv,
  evaluateHdfnCase,
  HDFN_PRESETS,
} from '../../.gemini/skills/HdfnRhogamKleihauerEngine';

describe('HdfnRhogamKleihauerEngine', () => {
  it('correctly calculates routine 28-week prophylaxis in unsensitized mother', () => {
    const routine = evaluateHdfnCase({
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'UNKNOWN',
      gestationalWeeks: 28,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 32,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 0,
    });

    expect(routine.isCandidateForRhIg).toBe(true);
    expect(routine.rhAlloimmunized).toBe(false);
    expect(routine.recommendedRhIgVials).toBe(1);
    expect(routine.recommendedRhIgMicrograms).toBe(300);
    expect(routine.fetalAnemiaSeverity).toBe('NONE');
  });

  it('calculates AABB precision RhIg dosing for massive FMH (90 mL)', () => {
    // 36 fetal cells in 2000 total = 1.8%
    // 1.8% * 50 = 90 mL whole blood
    // 90 / 30 = 3.0 -> 3 + 1 = 4 vials (1200 ug)
    const massive = evaluateHdfnCase({
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 34,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: true,
      kbFetalCellsCounted: 36,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 50,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 6,
    });

    expect(routinePercentage(massive.fetalCellsPercentage)).toBe(1.8);
    expect(massive.fetomaternalHemorrhageVolumeMl).toBe(90);
    expect(massive.recommendedRhIgVials).toBe(4);
    expect(massive.recommendedRhIgMicrograms).toBe(1200);
  });

  it('tests AABB decimal rounding rules for 40 mL and 52 mL FMH', () => {
    // 40 mL FMH: 40 / 30 = 1.33 -> decimal 0.33 < 0.5 -> round down (1) + 1 = 2 vials
    const bleed40 = evaluateHdfnCase({
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 38,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: true,
      kbFetalCellsCounted: 16, // 16/2000 = 0.8% * 50 = 40 mL
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 50,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 12,
    });
    expect(bleed40.recommendedRhIgVials).toBe(2);

    // 52 mL FMH: 52 / 30 = 1.73 -> decimal 0.73 >= 0.5 -> round up (2) + 1 = 3 vials
    const bleed52 = evaluateHdfnCase({
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 38,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: true,
      kbFetalCellsCounted: 21, // 21/2000 = 1.05% * 50 = 52.5 mL
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 50,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 12,
    });
    expect(bleed52.recommendedRhIgVials).toBe(3);
  });

  it('detects severe alloimmunization with MCA PSV > 1.50 MoM requiring Intrauterine Transfusion', () => {
    const sensitized = evaluateHdfnCase({
      maternalRhType: 'RH_NEGATIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 32,
      maternalAntiDTiter: 64,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 76,
      fetalAscitesOrEffusion: true,
      hoursPostDeliveryOrEvent: 0,
    });

    expect(sensitized.rhAlloimmunized).toBe(true);
    expect(sensitized.isCandidateForRhIg).toBe(false); // Ineffective once sensitized
    expect(sensitized.fetalMcaMom).toBeGreaterThan(1.50);
    expect(sensitized.fetalAnemiaSeverity).toBe('SEVERE_HYDROPS_RISK');
    expect(sensitized.intrauterineTransfusionIndicated).toBe(true);
    expect(sensitized.clinicalActionChecklist.some((a) => /Cordocentesis/i.test(a))).toBe(true);
  });

  it('identifies Rh-positive mother as non-candidate', () => {
    const rhPos = evaluateHdfnCase({
      maternalRhType: 'RH_POSITIVE',
      fetalRhType: 'RH_POSITIVE',
      gestationalWeeks: 38,
      maternalAntiDTiter: 0,
      rosetteScreenPositive: false,
      kbFetalCellsCounted: 0,
      kbTotalCellsCounted: 2000,
      fetalMcaPsvCmSec: 50,
      fetalAscitesOrEffusion: false,
      hoursPostDeliveryOrEvent: 24,
    });

    expect(rhPos.isCandidateForRhIg).toBe(false);
    expect(rhPos.recommendedRhIgVials).toBe(0);
    expect(rhPos.urgencyStatus).toBe('NOT_INDICATED');
  });
});

function routinePercentage(val: number): number {
  return Math.round(val * 10) / 10;
}
