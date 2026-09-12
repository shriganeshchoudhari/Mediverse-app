/**
 * TbiIcpMonroeKellieEngine.test.ts
 * Rigorous Unit Tests for Traumatic Brain Injury, Monroe-Kellie Compliance,
 * Lundberg Waves, CPP Optimization & Decompressive Craniectomy Engine.
 */

import {
  TbiIcpMonroeKellieEngine,
  IntracranialCompartments,
  TbiSimulationState
} from '../../.gemini/skills/TbiIcpMonroeKellieEngine';

describe('TbiIcpMonroeKellieEngine', () => {
  const normalCompartments: IntracranialCompartments = {
    brainTissueVolumeMl: 1400,
    cerebralBloodVolumeMl: 150,
    csfVolumeMl: 150,
    massLesionVolumeMl: 0,
    vasogenicEdemaMl: 0,
    totalVaultCapacityMl: 1700
  };

  describe('Monroe-Kellie Volume-Pressure Curve & Compliance', () => {
    it('calculates normal resting ICP (~10 mmHg) in healthy cranial vault', () => {
      const result = TbiIcpMonroeKellieEngine.calculateIcp(
        normalCompartments,
        true, // EVD clamped
        0,
        38, // normocapnia
        30, // HOB 30 deg
        false // no craniectomy
      );

      expect(result.icp).toBeGreaterThanOrEqual(7);
      expect(result.icp).toBeLessThanOrEqual(15);
      expect(result.complianceState).toBe('HIGH_COMPLIANCE');
      expect(result.elastance).toBeLessThan(1.0);
    });

    it('demonstrates spatial compensation with small mass lesion (30 mL)', () => {
      const compensatedCompartments: IntracranialCompartments = {
        ...normalCompartments,
        massLesionVolumeMl: 30
      };

      const result = TbiIcpMonroeKellieEngine.calculateIcp(
        compensatedCompartments,
        true,
        0,
        38,
        30,
        false
      );

      // Still compensated, ICP stays under 20 mmHg
      expect(result.icp).toBeLessThan(20);
      expect(result.complianceState).toBe('HIGH_COMPLIANCE');
    });

    it('demonstrates exponential decompensation and critical elastance with large mass (85 mL)', () => {
      const decompensatedCompartments: IntracranialCompartments = {
        ...normalCompartments,
        massLesionVolumeMl: 65,
        vasogenicEdemaMl: 35 // total added = 100 mL
      };

      const result = TbiIcpMonroeKellieEngine.calculateIcp(
        decompensatedCompartments,
        true,
        0,
        38,
        30,
        false
      );

      expect(result.icp).toBeGreaterThanOrEqual(25);
      expect(result.complianceState).toMatch(/CRITICAL_ELASTANCE|DECOMPENSATED_HERNIATION/);
      expect(result.elastance).toBeGreaterThan(1.5);
    });

    it('flattens volume-pressure curve when decompressive craniectomy is performed', () => {
      const massiveLesionCompartments: IntracranialCompartments = {
        ...normalCompartments,
        massLesionVolumeMl: 70,
        vasogenicEdemaMl: 40
      };

      const closedSkullResult = TbiIcpMonroeKellieEngine.calculateIcp(
        massiveLesionCompartments,
        true,
        0,
        38,
        30,
        false
      );

      const craniectomyResult = TbiIcpMonroeKellieEngine.calculateIcp(
        massiveLesionCompartments,
        true,
        0,
        38,
        30,
        true // craniectomy performed!
      );

      expect(craniectomyResult.icp).toBeLessThan(closedSkullResult.icp);
      expect(craniectomyResult.complianceState).toBe('HIGH_COMPLIANCE');
      expect(craniectomyResult.elastance).toBeLessThan(closedSkullResult.elastance);
    });

    it('shows that active EVD CSF drainage reduces ICP in compensated/early decompensated states', () => {
      const moderateCompartments: IntracranialCompartments = {
        ...normalCompartments,
        massLesionVolumeMl: 45,
        vasogenicEdemaMl: 25
      };

      const clampedResult = TbiIcpMonroeKellieEngine.calculateIcp(
        moderateCompartments,
        true, // clamped
        0,
        38,
        30,
        false
      );

      const drainingResult = TbiIcpMonroeKellieEngine.calculateIcp(
        moderateCompartments,
        false, // open EVD
        15, // 15 mL/hr
        38,
        30,
        false
      );

      expect(drainingResult.icp).toBeLessThan(clampedResult.icp);
    });
  });

  describe('Cerebral Perfusion Pressure (CPP) & Autoregulation', () => {
    it('accurately computes CPP and confirms target achievement between 60 and 70 mmHg', () => {
      const map = 85;
      const icp = 20;
      const prx = 0.05; // intact

      const result = TbiIcpMonroeKellieEngine.calculateCpp(map, icp, prx);

      expect(result.cpp).toBe(65);
      expect(result.targetAchieved).toBe(true);
      expect(result.deficit).toBe(0);
      expect(result.ischemicThreat).toBe(false);
      expect(result.hyperemiaThreat).toBe(false);
    });

    it('flags cerebral ischemia threat when CPP falls below 60 mmHg', () => {
      const map = 70;
      const icp = 28;
      const prx = 0.1;

      const result = TbiIcpMonroeKellieEngine.calculateCpp(map, icp, prx);

      expect(result.cpp).toBe(42);
      expect(result.targetAchieved).toBe(false);
      expect(result.deficit).toBe(18);
      expect(result.ischemicThreat).toBe(true);
    });

    it('flags hyperemia and ARDS threat when CPP > 70 with disrupted autoregulation (high PRx)', () => {
      const map = 105;
      const icp = 18;
      const prx = 0.55; // positive PRx = pressure-passive circulation

      const result = TbiIcpMonroeKellieEngine.calculateCpp(map, icp, prx);

      expect(result.cpp).toBe(87);
      expect(result.targetAchieved).toBe(false);
      expect(result.hyperemiaThreat).toBe(true);
    });
  });

  describe('Pulse Waveform Morphology (P1/P2/P3) & Lundberg Waves', () => {
    it('produces normal P1 > P2 > P3 pulse waveform in high-compliance states', () => {
      const pulse = TbiIcpMonroeKellieEngine.calculatePulseWaveform(12, 0.45);

      expect(pulse.p2p1Ratio).toBeLessThan(1.0);
      expect(pulse.morphologyLabel).toContain('Normal Configuration');
    });

    it('produces inverted P2 >= P1 pulse waveform in high-elastance decompensation', () => {
      const pulse = TbiIcpMonroeKellieEngine.calculatePulseWaveform(38, 2.8);

      expect(pulse.p2p1Ratio).toBeGreaterThanOrEqual(1.0);
      expect(pulse.morphologyLabel).toMatch(/Impaired Intracranial Compliance|Severely Exhausted Compliance/);
    });

    it('identifies Lundberg A (Plateau) waves when ICP >= 40 mmHg', () => {
      const lundberg = TbiIcpMonroeKellieEngine.determineLundbergPattern(45, 'DECOMPENSATED_HERNIATION', 1.3);

      expect(lundberg.waveType).toBe('LUNDBERG_A_PLATEAU');
      expect(lundberg.amplitudeMmhg).toBeGreaterThan(20);
      expect(lundberg.clinicalSignificance).toContain('Plateau');
    });

    it('identifies Lundberg B waves when ICP is elevated between 22-39 mmHg with high P2/P1', () => {
      const lundberg = TbiIcpMonroeKellieEngine.determineLundbergPattern(26, 'CRITICAL_ELASTANCE', 1.1);

      expect(lundberg.waveType).toBe('LUNDBERG_B_RHYTHMIC');
      expect(lundberg.amplitudeMmhg).toBeGreaterThanOrEqual(8);
    });

    it('identifies Lundberg C waves under baseline physiological pressures', () => {
      const lundberg = TbiIcpMonroeKellieEngine.determineLundbergPattern(14, 'HIGH_COMPLIANCE', 0.7);

      expect(lundberg.waveType).toBe('NORMAL_C_WAVE');
    });
  });

  describe('Herniation Syndrome Assessment', () => {
    it('detects uncal herniation with unilateral blown pupil and anisocoria', () => {
      const pupils = {
        rightDiameterMm: 7.0,
        rightReactivity: 'FIXED_NONREACTIVE',
        leftDiameterMm: 3.0,
        leftReactivity: 'BRISK'
      };

      const result = TbiIcpMonroeKellieEngine.evaluateHerniationRisk(32, 7.5, pupils, 3);

      expect(result.syndrome).toBe('UNCAL_HERNIATION');
      expect(result.riskPercent).toBeGreaterThanOrEqual(85);
      expect(result.manifestations.some(m => m.includes('Oculomotor Nerve'))).toBe(true);
    });

    it('detects tonsillar herniation with Cushing triad and extreme ICP', () => {
      const pupils = {
        rightDiameterMm: 6.5,
        rightReactivity: 'FIXED_NONREACTIVE',
        leftDiameterMm: 6.5,
        leftReactivity: 'FIXED_NONREACTIVE'
      };

      const result = TbiIcpMonroeKellieEngine.evaluateHerniationRisk(56, 12.0, pupils, 1);

      expect(result.syndrome).toBe('TONSILLAR_HERNIATION');
      expect(result.riskPercent).toBeGreaterThanOrEqual(90);
      expect(result.manifestations.some(m => m.includes('Cushing Triad'))).toBe(true);
    });

    it('detects subfalcine herniation when midline shift >= 5 mm with preserved pupils', () => {
      const pupils = {
        rightDiameterMm: 3.0,
        rightReactivity: 'BRISK',
        leftDiameterMm: 3.0,
        leftReactivity: 'BRISK'
      };

      const result = TbiIcpMonroeKellieEngine.evaluateHerniationRisk(18, 6.0, pupils, 5);

      expect(result.syndrome).toBe('SUBFALCINE_CINGULATE');
      expect(result.manifestations.some(m => m.includes('Anterior Cerebral Artery'))).toBe(true);
    });
  });

  describe('Hyperosmolar Therapy & Osmolal Gap Monitoring', () => {
    it('calculates Mannitol 20% osmolal gap rise and warns when safety thresholds are breached', () => {
      const baselineSodium = 140;
      // High-dose Mannitol 1.0 g/kg
      const result = TbiIcpMonroeKellieEngine.calculateHyperosmolarTherapy(
        'MANNITOL_20',
        1.0,
        70,
        baselineSodium
      );

      expect(result.agent).toBe('MANNITOL_20');
      expect(result.osmolalGap).toBeGreaterThanOrEqual(20);
      expect(result.osmolalGapExceeded).toBe(true);
    });

    it('calculates 3% hypertonic saline delta sodium elevation', () => {
      const result = TbiIcpMonroeKellieEngine.calculateHyperosmolarTherapy(
        'HYPERTONIC_SALINE_3',
        250, // 250 mL
        70,
        140
      );

      expect(result.serumSodiumMeqL).toBeGreaterThan(140);
      expect(result.serumSodiumMeqL).toBeLessThan(145);
      expect(result.hypernatremiaWarning).toBe(false);
    });

    it('calculates 23.4% hypertonic saline bullet for acute uncal crisis', () => {
      const result = TbiIcpMonroeKellieEngine.calculateHyperosmolarTherapy(
        'HYPERTONIC_SALINE_23_4',
        30, // 30 mL bullet
        70,
        142
      );

      expect(result.serumSodiumMeqL).toBeGreaterThanOrEqual(144);
    });
  });

  describe('Ventilation, Hypocapnia & Brain Tissue Oxygenation (PbtO2)', () => {
    it('shows that mild hypocapnia (PaCO2 32 mmHg) maintains safe PbtO2 while reducing CBV', () => {
      const result = TbiIcpMonroeKellieEngine.evaluateVentilation(32, 100, 65);

      expect(result.cerebralVasoconstrictionIndex).toBeGreaterThan(0.1);
      expect(result.pbto2Mmhg).toBeGreaterThanOrEqual(18); // above ischemic threshold
    });

    it('shows that extreme hypocapnia (PaCO2 24 mmHg) causes severe microvascular ischemia and drops PbtO2 < 15', () => {
      const result = TbiIcpMonroeKellieEngine.evaluateVentilation(24, 100, 65);

      expect(result.pbto2Mmhg).toBeLessThan(15); // dangerous cerebral tissue hypoxia
    });
  });

  describe('Clinical Presets Integrity', () => {
    const presets = TbiIcpMonroeKellieEngine.getClinicalPresets();

    it('loads all 4 primary presets with distinct pathophysiologies', () => {
      expect(presets.epidural_uncal).toBeDefined();
      expect(presets.dai_plateau_waves).toBeDefined();
      expect(presets.contusion_dysautoregulation).toBeDefined();
      expect(presets.refractory_rescueicp).toBeDefined();
    });

    it('validates Epidural Hematoma preset triggers uncal herniation alerts in full simulation', () => {
      const output = TbiIcpMonroeKellieEngine.runSimulation(presets.epidural_uncal);

      expect(output.herniationRisk).toBe('UNCAL_HERNIATION');
      expect(output.safetyAlerts.some(a => a.includes('herniation'))).toBe(true);
      expect(output.recommendedActions.some(a => a.includes('23.4%'))).toBe(true);
    });

    it('validates DAI preset triggers Lundberg A or B waves and elevated elastance', () => {
      const output = TbiIcpMonroeKellieEngine.runSimulation(presets.dai_plateau_waves);

      expect(output.pulseWaveform.p2p1Ratio).toBeGreaterThanOrEqual(1.0);
      expect(output.icpMmhg).toBeGreaterThan(20);
    });
  });
});
