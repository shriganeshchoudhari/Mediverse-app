import {
  calculateVascularResistance,
  evaluateInoCase,
  INO_PRESETS,
} from '../../.gemini/skills/InoVasoreactivityEngine';

describe('InoVasoreactivityEngine', () => {
  it('correctly calculates vascular resistance in Wood units and dynes*s/cm5', () => {
    // Gradient = 40 mmHg, CO = 5.0 L/min -> PVR = 8 Wood units, 8 * 80 = 640 dynes
    const pvr = calculateVascularResistance(40, 5.0);
    expect(pvr.woodUnits).toBe(8);
    expect(pvr.dynesSecCm5).toBe(640);
  });

  it('identifies a positive vasoreactive responder meeting Sitbon ESC/ERS criteria', () => {
    // Baseline mPAP = 48, on 20 ppm iNO drops to <= 40 with delta >= 10 and CO stable/increased
    const responder = evaluateInoCase({
      baselineMpapMmHg: 48,
      baselineCoLMin: 4.2,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 88,
      baselineCvpMmHg: 8,
      baselineSvo2Percent: 62,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 20,
      durationMinutes: 15,
      abruptWeaning: false,
    });

    expect(responder.deltaMpapMmHg).toBeLessThanOrEqual(-10);
    expect(responder.currentMpapMmHg).toBeLessThanOrEqual(40);
    expect(responder.deltaCoLMin).toBeGreaterThanOrEqual(0);
    expect(responder.isVasoreactivePositive).toBe(true);
    expect(responder.recommendedTherapy).toBe('ORAL_CALCIUM_CHANNEL_BLOCKERS');
    expect(responder.diagnosticGuidance).toContain('POSITIVE ACUTE VASOREACTIVITY');
  });

  it('correctly classifies non-responder and contraindicates CCBs', () => {
    // Severe baseline mPAP 58, drops by only 3-5 mmHg, absolute mPAP remains > 40
    const nonResponder = evaluateInoCase({
      baselineMpapMmHg: 58,
      baselineCoLMin: 3.4,
      baselinePcwpMmHg: 12,
      baselineMapMmHg: 82,
      baselineCvpMmHg: 12,
      baselineSvo2Percent: 54,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 40,
      durationMinutes: 20,
      abruptWeaning: false,
    });

    expect(responderOrNot(nonResponder.isVasoreactivePositive)).toBe(false);
    expect(nonResponder.currentMpapMmHg).toBeGreaterThan(40);
    expect(nonResponder.recommendedTherapy).not.toBe('ORAL_CALCIUM_CHANNEL_BLOCKERS');
    expect(nonResponder.diagnosticGuidance).toContain('STRICTLY CONTRAINDICATED');
  });

  it('models acute rebound pulmonary hypertension upon abrupt iNO cessation', () => {
    const reboundCase = evaluateInoCase({
      baselineMpapMmHg: 44,
      baselineCoLMin: 4.0,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 80,
      baselineCvpMmHg: 10,
      baselineSvo2Percent: 58,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 40,
      durationMinutes: 60,
      abruptWeaning: true,
    });

    expect(reboundCase.reboundHypertensionSeverity).toBe('SEVERE_LIFE_THREATENING');
    expect(reboundCase.currentMpapMmHg).toBeGreaterThan(44); // Spikes higher than baseline
    expect(reboundCase.reboundMpapSpikeMmHg).toBeGreaterThan(10);
    expect(reboundCase.clinicalAlerts.some((a) => /REBOUND HYPERTENSION/i.test(a))).toBe(true);
  });

  it('detects toxic methemoglobinemia and NO2 buildup on high-dose prolonged iNO', () => {
    const toxicCase = evaluateInoCase({
      baselineMpapMmHg: 42,
      baselineCoLMin: 4.8,
      baselinePcwpMmHg: 11,
      baselineMapMmHg: 84,
      baselineCvpMmHg: 9,
      baselineSvo2Percent: 65,
      agent: 'INHALED_NITRIC_OXIDE',
      dosePpmOrMcg: 80,
      durationMinutes: 90,
      abruptWeaning: false,
    });

    expect(toxicCase.methemoglobinPercent).toBeGreaterThanOrEqual(5.0);
    expect(toxicCase.nitrogenDioxidePpm).toBeGreaterThanOrEqual(1.0);
    expect(toxicCase.clinicalAlerts.some((a) => /METHEMOGLOBINEMIA/i.test(a))).toBe(true);
    expect(toxicCase.clinicalAlerts.some((a) => /Methylene Blue/i.test(a))).toBe(true);
    expect(toxicCase.clinicalAlerts.some((a) => /NITROGEN DIOXIDE TOXICITY/i.test(a))).toBe(true);
  });

  it('demonstrates loss of pulmonary selectivity with IV epoprostenol causing systemic vasodilation', () => {
    const ivProstacyclin = evaluateInoCase({
      baselineMpapMmHg: 50,
      baselineCoLMin: 4.0,
      baselinePcwpMmHg: 10,
      baselineMapMmHg: 90,
      baselineCvpMmHg: 8,
      baselineSvo2Percent: 60,
      agent: 'IV_EPOPROSTENOL',
      dosePpmOrMcg: 10,
      durationMinutes: 15,
      abruptWeaning: false,
    });

    expect(ivProstacyclin.deltaSvrPercent).toBeLessThanOrEqual(-15);
    expect(ivProstacyclin.clinicalAlerts.some((a) => /SYSTEMIC HYPOTENSION/i.test(a))).toBe(true);
  });
});

function responderOrNot(val: boolean): boolean {
  return val;
}
