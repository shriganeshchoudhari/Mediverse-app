import {
  evaluateAorticStenosis,
  AS_PRESETS,
  EchoParameters,
  InvasiveCathParameters,
  ClinicalPatientProfile,
} from '../../.gemini/skills/AorticStenosisEngine';

describe('AorticStenosisEngine', () => {
  it('evaluates normal tricuspid aortic valve correctly', () => {
    const normalPreset = AS_PRESETS[0];
    const result = evaluateAorticStenosis(
      normalPreset.echo,
      normalPreset.cath,
      normalPreset.profile
    );

    expect(result.continuityAvaCm2).toBeGreaterThan(2.5);
    expect(result.severityGrade).toBe('NORMAL');
    expect(result.guidelineStage).toBe('STAGE_A');
    expect(result.dimensionlessVelocityIndex).toBeGreaterThan(0.5);
    expect(result.interventionStrategy).toBe('SURVEILLANCE');
  });

  it('computes Doppler continuity equation accurately', () => {
    // LVOT diameter = 2.0 cm -> Area = pi * 1.0^2 = 3.1416 cm^2
    // LVOT VTI = 18 cm, AV VTI = 54 cm
    // AVA = (3.1416 * 18) / 54 = 1.047 cm^2
    const echo: EchoParameters = {
      lvotDiameterCm: 2.0,
      lvotVtiCm: 18,
      avVtiCm: 54,
      lvotPeakVelocityMs: 0.9,
      avPeakVelocityMs: 3.5,
      meanGradientMmHg: 30,
      aorticRootDiameterCm: 3.0,
    };
    const cath: InvasiveCathParameters = {
      cardiacOutputLMin: 5.0,
      heartRateBpm: 70,
      systolicEjectionPeriodSec: 0.3,
      invasiveMeanGradientMmHg: 30,
    };
    const profile: ClinicalPatientProfile = {
      age: 65,
      bsaM2: 1.8,
      lvefPct: 60,
      strokeVolumeIndexMlM2: 40,
      systolicBpMmHg: 130,
      hasSymptoms: false,
      stsPromScorePct: 1.0,
      isBicuspid: false,
      transfemoralAccessFeasible: true,
      severeAortaCalcificationPorcelain: false,
    };

    const result = evaluateAorticStenosis(echo, cath, profile);
    expect(result.lvotAreaCm2).toBe(3.14);
    expect(result.continuityAvaCm2).toBeCloseTo(1.05, 1);
    expect(result.dimensionlessVelocityIndex).toBeCloseTo(0.9 / 3.5, 2);
    expect(result.peakGradientMmHg).toBeCloseTo(4 * Math.pow(3.5, 2), 1);
  });

  it('computes invasive Gorlin and Hakki equations', () => {
    // CO = 4.2 L/min, HR = 76, SEP = 0.28, meanGrad = 56 mmHg
    const echo = AS_PRESETS[2].echo;
    const cath = AS_PRESETS[2].cath;
    const profile = AS_PRESETS[2].profile;

    const result = evaluateAorticStenosis(echo, cath, profile);
    expect(result.gorlinAvaCm2).toBeLessThan(1.0);
    expect(result.hakkiAvaCm2).toBeLessThan(1.0);
    expect(result.gorlinAvaCm2).toBeGreaterThan(0.4);
  });

  it('identifies classic severe high-gradient AS (Stage D1) with SAVR/TAVI decision', () => {
    const preset = AS_PRESETS[2]; // 72yo, AVA 0.68, grad 54, symptoms
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.severityGrade).toBe('SEVERE');
    expect(result.guidelineStage).toBe('STAGE_D1');
    expect(result.continuityAvaCm2).toBeLessThanOrEqual(1.0);
    expect(result.peakGradientMmHg).toBeGreaterThan(80);
  });

  it('identifies Classical Low-Flow Low-Gradient AS (Stage D2) and Dobutamine indications', () => {
    const preset = AS_PRESETS[3]; // LVEF 28%, SVI 24, Mean Grad 26
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.guidelineStage).toBe('STAGE_D2');
    expect(result.stageTitle).toContain('Stage D2');
    expect(result.valvuloarterialImpedanceMmHgMlM2).toBeGreaterThan(4.5);
  });

  it('identifies Paradoxical Low-Flow Low-Gradient AS (Stage D3)', () => {
    const preset = AS_PRESETS[4]; // LVEF 65%, SVI 27 < 35, Mean Grad 31 < 40
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.guidelineStage).toBe('STAGE_D3');
    expect(result.stageTitle).toContain('Stage D3');
    expect(result.stageRationale).toContain('Paradoxical low flow');
  });

  it('recognizes Pseudo-Severe AS response to Dobutamine', () => {
    const preset = AS_PRESETS[5]; // pseudo severe
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.interventionStrategy).toBe('SURVEILLANCE');
    expect(result.recommendationSummary).toContain('Pseudo-severe AS confirmed');
  });

  it('prefers SAVR in young patients (<65) with bicuspid aortopathy', () => {
    const preset = AS_PRESETS[6]; // 48yo male, bicuspid
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.interventionStrategy).toBe('SAVR_PREFERRED');
    expect(result.recommendationSummary).toContain('Surgical Aortic Valve Replacement (SAVR) is preferred in patients < 65');
  });

  it('prefers TAVI in high-risk octogenarians with porcelain aorta', () => {
    const preset = AS_PRESETS[7]; // 86yo, porcelain aorta
    const result = evaluateAorticStenosis(preset.echo, preset.cath, preset.profile);

    expect(result.operativeRiskCategory).toBe('HIGH_OR_PROHIBITIVE');
    expect(result.interventionStrategy).toBe('TAVI_PREFERRED');
    expect(result.recommendationSummary).toContain('Transfemoral TAVI/TAVR is the treatment of choice');
  });
});
