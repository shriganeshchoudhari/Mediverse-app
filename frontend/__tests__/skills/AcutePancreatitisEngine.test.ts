/**
 * AcutePancreatitisEngine.test.ts
 * Unit tests for Revised Atlanta classification, Modified Marshall scoring,
 * BISAP mortality predictor, WATERFALL resuscitation, and antibiotic stewardship.
 */

import {
  calculateModifiedMarshallScore,
  determineAtlantaClassification,
  calculateBisapScore,
  evaluateWaterfallResuscitation,
  evaluateAntibioticIndication,
  evaluatePancreatitisCase,
  PANCREATITIS_PRESETS,
} from '../../.gemini/skills/AcutePancreatitisEngine';

describe('AcutePancreatitisEngine Clinical Logic & Scoring', () => {
  it('correctly calculates Modified Marshall Organ Failure score', () => {
    // Normal values: PF 450, Cr 0.9, SBP 120 -> Score 0, no failure
    const normal = calculateModifiedMarshallScore(450, 0.9, 120, true, 7.40);
    expect(normal.totalMarshallScore).toBe(0);
    expect(normal.hasOrganFailure).toBe(false);

    // Severe: PF 150 (Score 3), Cr 2.5 (Score 2), SBP 80 unresponsive with pH 7.38 (Score 2) -> Score 7, Organ Failure
    const severe = calculateModifiedMarshallScore(150, 2.5, 80, false, 7.38);
    expect(severe.respiratoryScore).toBe(3);
    expect(severe.renalScore).toBe(2);
    expect(severe.cardiovascularScore).toBe(2);
    expect(severe.totalMarshallScore).toBe(7);
    expect(severe.hasOrganFailure).toBe(true);
    expect(severe.organFailureDomains).toHaveLength(3);
  });

  it('stratifies Revised Atlanta Classification based on organ failure duration and local complications', () => {
    // No organ failure, no complications -> MILD
    expect(determineAtlantaClassification(false, 0, false, false)).toBe('MILD');

    // Transient organ failure (< 48h) -> MODERATELY_SEVERE
    expect(determineAtlantaClassification(true, 24, false, false)).toBe('MODERATELY_SEVERE');

    // Local complication without organ failure -> MODERATELY_SEVERE
    expect(determineAtlantaClassification(false, 0, true, false)).toBe('MODERATELY_SEVERE');

    // Persistent organ failure (>= 48h) -> SEVERE
    expect(determineAtlantaClassification(true, 52, false, false)).toBe('SEVERE');
  });

  it('computes BISAP score and accurately predicts mortality rates', () => {
    // 0 points: BUN 15, GCS 15, SIRS 0, Age 40, no effusion
    const low = calculateBisapScore(15, 15, 0, 40, false);
    expect(low.score).toBe(0);
    expect(low.mortalityPercent).toBeLessThan(1);

    // 4 points: BUN 32 (+1), GCS 14 (+1), SIRS 3 (+1), Age 65 (+1), no effusion
    const high = calculateBisapScore(32, 14, 3, 65, false);
    expect(high.score).toBe(4);
    expect(high.mortalityPercent).toBeGreaterThanOrEqual(10);
  });

  it('applies WATERFALL trial goal-directed fluid rules and flags iatrogenic overload', () => {
    // Hemoconcentrated 80 kg patient: bolus 10 mL/kg (800 mL), maintenance 1.5 mL/kg/h (120 mL/h)
    const fluidPlan = evaluateWaterfallResuscitation(80, true, false, 120, 'LACTATED_RINGERS');
    expect(fluidPlan.recommendedBolusMl).toBe(800);
    expect(fluidPlan.recommendedMaintenanceMlH).toBe(120);
    expect(fluidPlan.fluidOverloadRisk).toBe('LOW');

    // Patient with clinical signs of pulmonary edema / overload
    const overloadPlan = evaluateWaterfallResuscitation(80, true, true, 350, 'NORMAL_SALINE');
    expect(overloadPlan.fluidOverloadRisk).toBe('HIGH_OVERLOAD_DETECTED');
    expect(overloadPlan.guidance).toContain('CRITICAL FLUID OVERLOAD DETECTED');
    expect(overloadPlan.guidance).toContain('WATERFALL Trial');
    expect(overloadPlan.guidance).toContain('Normal Saline is suboptimal');
  });

  it('strictly prohibits routine antibiotic prophylaxis while permitting targeted therapy for infected necrosis', () => {
    // Sterile pancreatitis
    const sterile = evaluateAntibioticIndication(false);
    expect(sterile.indicated).toBe(false);
    expect(sterile.rationale).toContain('STRICTLY CONTRAINDICATED');
    expect(sterile.rationale).toContain('Routine prophylactic antibiotics are NOT recommended');

    // Infected pancreatic necrosis
    const infected = evaluateAntibioticIndication(true);
    expect(infected.indicated).toBe(true);
    expect(infected.rationale).toContain('INDICATED FOR INFECTED NECROSIS');
    expect(infected.rationale).toContain('Carbapenem');
  });

  it('processes all standard presets successfully', () => {
    for (const preset of PANCREATITIS_PRESETS) {
      const state = evaluatePancreatitisCase(preset.input);
      expect(state.diagnosticTriadMet).toBe(true);
      expect(state.diagnosticSummary.length).toBeGreaterThan(15);
      expect(state.bisapScore).toBeGreaterThanOrEqual(0);
      expect(state.bisapScore).toBeLessThanOrEqual(5);
    }
  });
});
