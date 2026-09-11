import {
  classifyStevensonProfile,
  analyzeCardiorenalCongestion,
  calculateDiureticPlan,
  calculatePeptideTrajectory,
  evaluatePharmacotherapy,
  performHeartFailureEvaluation,
  ADHF_PRESETS,
} from '../../.gemini/skills/HeartFailureStevensonEngine';

describe('HeartFailureStevensonEngine', () => {
  describe('classifyStevensonProfile', () => {
    it('correctly classifies Profile B (Warm & Wet)', () => {
      const result = classifyStevensonProfile(ADHF_PRESETS[0].inputs);
      expect(result.profile).toBe('PROFILE_B_WARM_WET');
      expect(result.isWet).toBe(true);
      expect(result.isCold).toBe(false);
      expect(result.profileName).toContain('Warm & Wet');
      expect(result.inHospitalMortalityRiskPercent).toBe(8.5);
    });

    it('correctly classifies Profile C (Cold & Wet / Cardiogenic Shock)', () => {
      const result = classifyStevensonProfile(ADHF_PRESETS[1].inputs);
      expect(result.profile).toBe('PROFILE_C_COLD_WET');
      expect(result.isWet).toBe(true);
      expect(result.isCold).toBe(true);
      expect(result.profileName).toContain('Cold & Wet');
      expect(result.inHospitalMortalityRiskPercent).toBe(32.0);
    });

    it('correctly classifies Profile L (Cold & Dry / Over-diuresed)', () => {
      const result = classifyStevensonProfile(ADHF_PRESETS[2].inputs);
      expect(result.profile).toBe('PROFILE_L_COLD_DRY');
      expect(result.isWet).toBe(false);
      expect(result.isCold).toBe(true);
      expect(result.profileName).toContain('Cold & Dry');
      expect(result.inHospitalMortalityRiskPercent).toBe(14.0);
    });

    it('correctly classifies Profile A (Warm & Dry / Compensated)', () => {
      const result = classifyStevensonProfile(ADHF_PRESETS[3].inputs);
      expect(result.profile).toBe('PROFILE_A_WARM_DRY');
      expect(result.isWet).toBe(false);
      expect(result.isCold).toBe(false);
      expect(result.profileName).toContain('Warm & Dry');
      expect(result.inHospitalMortalityRiskPercent).toBe(2.5);
    });

    it('falls back to clinical marker counts if hemodynamic invasives missing', () => {
      const customInput = {
        ...ADHF_PRESETS[0].inputs,
        pcwpMmHg: undefined,
        cardiacIndexLMinM2: undefined,
      };
      const result = classifyStevensonProfile(customInput);
      expect(result.isWet).toBe(true); // >= 2 congestion signs
      expect(result.isCold).toBe(false);
      expect(result.profile).toBe('PROFILE_B_WARM_WET');
    });
  });

  describe('analyzeCardiorenalCongestion', () => {
    it('calculates MAP, CVP, and Renal Perfusion Pressure correctly', () => {
      const analysis = analyzeCardiorenalCongestion(ADHF_PRESETS[0].inputs);
      // SBP 164, DBP 98 -> MAP = (2*98 + 164)/3 = 360/3 = 120 mmHg
      // CVP = 14 mmHg -> RPP = 120 - 14 = 106 mmHg
      expect(analysis.meanArterialPressureMmHg).toBe(120);
      expect(analysis.effectiveCvpMmHg).toBe(14);
      expect(analysis.renalPerfusionPressureMmHg).toBe(106);
      expect(analysis.isCongestiveNephropathyDominant).toBe(true);
      expect(analysis.clinicalInterpretation).toContain('Congestive Nephropathy');
    });

    it('identifies low-output hypoperfusion when MAP < 65', () => {
      const shockInput = {
        ...ADHF_PRESETS[1].inputs,
        cvpMmHg: 8, // lower CVP so map dominance tested
        systolicBpMmHg: 75,
        diastolicBpMmHg: 55,
      };
      const analysis = analyzeCardiorenalCongestion(shockInput);
      expect(analysis.isCongestiveNephropathyDominant).toBe(false);
      expect(analysis.clinicalInterpretation).toContain('Low-Output Prerenal Hypoperfusion');
    });
  });

  describe('calculateDiureticPlan', () => {
    it('calculates DOSE trial 2.5x oral dose for chronic loop users', () => {
      const plan = calculateDiureticPlan(40);
      expect(plan.homeOralFurosemideDoseMg).toBe(40);
      expect(plan.recommendedIvFurosemideDoseMg).toBe(100);
      expect(plan.equivalentTorsemideOralMg).toBe(20);
      expect(plan.equivalentBumetanideOralMg).toBe(1.0);
      expect(plan.doseRationale).toContain('DOSE Trial High-Dose Protocol');
    });

    it('handles loop-naive patients with initial 40 mg IV bolus recommendation', () => {
      const plan = calculateDiureticPlan(0);
      expect(plan.recommendedIvFurosemideDoseMg).toBe(40);
      expect(plan.doseRationale).toContain('Loop-Diuretic Naive');
    });
  });

  describe('calculatePeptideTrajectory', () => {
    it('detects optimal decongestion benchmark when NT-proBNP drops >= 30%', () => {
      const traj = calculatePeptideTrajectory(8000, 4800); // 40% reduction
      expect(traj.percentageChange).toBe(-40);
      expect(traj.isDecongestionBenchmarkMet).toBe(true);
      expect(traj.prognosticAssessment).toContain('Optimal Decongestion Benchmark Achieved');
    });

    it('flags sub-target decongestion when reduction is less than 30%', () => {
      const traj = calculatePeptideTrajectory(8000, 6800); // 15% reduction
      expect(traj.percentageChange).toBe(-15);
      expect(traj.isDecongestionBenchmarkMet).toBe(false);
      expect(traj.prognosticAssessment).toContain('Sub-target Decongestion');
    });

    it('flags adverse trajectory when peptide levels increase', () => {
      const traj = calculatePeptideTrajectory(5000, 6500); // +30% surge
      expect(traj.percentageChange).toBe(30);
      expect(traj.isDecongestionBenchmarkMet).toBe(false);
      expect(traj.prognosticAssessment).toContain('Adverse Biomarker Trajectory');
    });
  });

  describe('evaluatePharmacotherapy', () => {
    it('prohibits inotropes in Profile B and recommends vasodilators for hypertension', () => {
      const pharm = evaluatePharmacotherapy('PROFILE_B_WARM_WET', ADHF_PRESETS[0].inputs);
      expect(pharm.inotropeRecommendation).toContain('NOT indicated');
      expect(pharm.vasodilatorRecommendation).toContain('Nitroglycerin');
      expect(pharm.mechanicalCirculatorySupportCandidate).toBe(false);
    });

    it('warns against pure inodilators and indicates MCS in Profile C with severe hypotension', () => {
      const pharm = evaluatePharmacotherapy('PROFILE_C_COLD_WET', ADHF_PRESETS[1].inputs);
      expect(pharm.mechanicalCirculatorySupportCandidate).toBe(true);
      expect(pharm.safetyWarnings.some(w => w.includes('CRITICAL HYPOTENSION'))).toBe(true);
      expect(pharm.inotropeRecommendation).toContain('Dobutamine');
      expect(pharm.vasodilatorRecommendation).toContain('contraindicated');
    });

    it('recommends fluid challenge in Profile L', () => {
      const pharm = evaluatePharmacotherapy('PROFILE_L_COLD_DRY', ADHF_PRESETS[2].inputs);
      expect(pharm.inotropeRecommendation).toContain('fluid challenge');
    });
  });

  describe('performHeartFailureEvaluation & ADHF_PRESETS', () => {
    it('executes comprehensive evaluation on all 4 presets without errors', () => {
      ADHF_PRESETS.forEach(preset => {
        const evalOutput = performHeartFailureEvaluation(preset.inputs);
        expect(evalOutput.classification).toBeDefined();
        expect(evalOutput.cardiorenal).toBeDefined();
        expect(evalOutput.diureticPlan).toBeDefined();
        expect(evalOutput.peptideTrajectory).toBeDefined();
        expect(evalOutput.pharmacotherapy).toBeDefined();
        expect(evalOutput.urgentActionChecklist.length).toBeGreaterThan(0);
        expect(evalOutput.clinicalPearls.length).toBeGreaterThan(0);
      });
    });
  });
});
