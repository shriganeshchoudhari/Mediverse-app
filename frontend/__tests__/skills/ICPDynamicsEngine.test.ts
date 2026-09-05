import {
  calculateICPDynamics,
  generateICPPulseWaveform,
  generateMonroKellieCurve,
  generateLundbergTrend,
  ICP_PRESETS,
  ICPPatientParameters,
  TieredInterventions,
} from '../../.gemini/skills/ICPDynamicsEngine';

describe('ICPDynamicsEngine', () => {
  const normalInterventions: TieredInterventions = {
    headOfBed30Deg: true,
    sedationAnalgesia: false,
    evdDrainageActive: false,
    evdDrainedVolumeMl: 0,
    hyperosmolarMannitol: false,
    hyperosmolarHypertonicSaline: false,
    hyperventilationPaCO2: 40,
    neuromuscularBlockade: false,
    moderateHypothermia: false,
    barbiturateComa: false,
    decompressiveCraniectomy: false,
  };

  const normalPatient: ICPPatientParameters = {
    massLesionVolumeMl: 0,
    meanArterialPressureMmHg: 90,
    paCO2MmHg: 40,
    temperatureC: 37.0,
    baselineICPMmHg: 10,
    isUnilateralTemporalMass: false,
  };

  describe('Monro-Kellie Elastance & Pressure Dynamics', () => {
    it('computes normal baseline ICP and CPP for healthy brain', () => {
      const res = calculateICPDynamics(normalPatient, normalInterventions);

      expect(res.icpMmHg).toBeGreaterThanOrEqual(6.0);
      expect(res.icpMmHg).toBeLessThanOrEqual(15.0);
      expect(res.cppMmHg).toBeGreaterThanOrEqual(70);
      expect(res.complianceState).toBe('NORMAL_COMPLIANCE');
      expect(res.herniationType).toBe('NONE');
      expect(res.isP2Elevated).toBe(false); // P1 > P2 in healthy brain
    });

    it('demonstrates spatial compensation below buffer threshold and exponential surge above it', () => {
      // 30 mL volume (within compensatory spatial buffer ~55 mL)
      const compensated = calculateICPDynamics(
        { ...normalPatient, massLesionVolumeMl: 30 },
        normalInterventions
      );

      // 75 mL volume (exceeds compensatory buffer, exponential surge)
      const decompensated = calculateICPDynamics(
        { ...normalPatient, massLesionVolumeMl: 75 },
        normalInterventions
      );

      expect(compensated.icpMmHg).toBeLessThanOrEqual(20);
      expect(decompensated.icpMmHg).toBeGreaterThan(25);
      expect(decompensated.complianceState).not.toBe('NORMAL_COMPLIANCE');
      expect(decompensated.isP2Elevated).toBe(true); // P2 > P1 due to high elastance
    });

    it('detects uncal herniation with ipsilateral blown pupil in unilateral temporal mass', () => {
      const uncalPatient: ICPPatientParameters = {
        massLesionVolumeMl: 65,
        meanArterialPressureMmHg: 95,
        paCO2MmHg: 40,
        temperatureC: 37.2,
        baselineICPMmHg: 10,
        isUnilateralTemporalMass: true,
      };

      const res = calculateICPDynamics(uncalPatient, normalInterventions);

      expect(res.herniationType).toBe('UNCAL');
      expect(res.pupilRightMm).toBeGreaterThanOrEqual(6.0); // Blown right pupil
      expect(res.pupilRightReactive).toBe(false);
      expect(res.pupilLeftReactive).toBe(true); // Left pupil preserved
    });

    it('identifies tonsillar herniation and activates Cushing Triad in extreme hypertension/ICP', () => {
      const tonsillarPatient: ICPPatientParameters = {
        massLesionVolumeMl: 95,
        meanArterialPressureMmHg: 140, // Severe reflex hypertension
        paCO2MmHg: 45,
        temperatureC: 38.0,
        baselineICPMmHg: 12,
        isUnilateralTemporalMass: false,
      };

      const res = calculateICPDynamics(tonsillarPatient, normalInterventions);

      expect(res.herniationType).toBe('TONSILLAR');
      expect(res.isCushingTriadActive).toBe(true);
      expect(res.activeAlarms).toContain('CUSHING TRIAD DETECTED (MEDULLARY COMPRESSION)');
      expect(res.glasgowComaScale).toBe(3);
    });
  });

  describe('Brain Trauma Foundation (BTF) Tiered Interventions', () => {
    const highICPPatient: ICPPatientParameters = {
      massLesionVolumeMl: 65,
      meanArterialPressureMmHg: 90,
      paCO2MmHg: 40,
      temperatureC: 37.5,
      baselineICPMmHg: 10,
      isUnilateralTemporalMass: false,
    };

    it('lowers ICP with Tier 1 EVD CSF drainage and hyperosmolar therapy', () => {
      const untreated = calculateICPDynamics(highICPPatient, normalInterventions);

      const treatedTier1 = calculateICPDynamics(highICPPatient, {
        ...normalInterventions,
        evdDrainageActive: true,
        evdDrainedVolumeMl: 15,
        hyperosmolarHypertonicSaline: true,
        hyperventilationPaCO2: 34,
      });

      expect(treatedTier1.icpMmHg).toBeLessThan(untreated.icpMmHg - 8);
      expect(treatedTier1.cppMmHg).toBeGreaterThan(untreated.cppMmHg);
    });

    it('demonstrates profound ICP collapse with Tier 3 decompressive craniectomy', () => {
      const untreated = calculateICPDynamics(highICPPatient, normalInterventions);

      const craniectomy = calculateICPDynamics(highICPPatient, {
        ...normalInterventions,
        decompressiveCraniectomy: true,
      });

      expect(craniectomy.icpMmHg).toBeLessThan(untreated.icpMmHg / 2);
      expect(craniectomy.cppMmHg).toBeGreaterThanOrEqual(65);
    });
  });

  describe('Micro-Scale Pulse Waveform & Macro-Scale Lundberg Waves', () => {
    it('generates single cardiac cycle pulse waveform with P1, P2, P3 components', () => {
      const res = calculateICPDynamics(normalPatient, normalInterventions);
      const waveform = generateICPPulseWaveform(res);

      expect(waveform.length).toBe(41);
      const components = waveform.map(w => w.component);
      expect(components).toContain('P1');
      expect(components).toContain('P2');
      expect(components).toContain('P3');
    });

    it('generates 30-minute Lundberg A trend with severe plateau wave surge', () => {
      const resA = generateLundbergTrend(
        { ...normalPatient, massLesionVolumeMl: 55 },
        normalInterventions,
        'LUNDBERG_A'
      );

      expect(resA.length).toBe(31);
      const plateauPoints = resA.filter(p => p.waveType === 'LUNDBERG_A');
      expect(plateauPoints.length).toBeGreaterThanOrEqual(10);
      expect(plateauPoints[0].icpMmHg).toBeGreaterThan(50); // Plateau wave spike
    });

    it('generates Monro-Kellie volume-pressure curve showing non-linear inflection', () => {
      const curve = generateMonroKellieCurve(normalPatient, normalInterventions);

      expect(curve.length).toBe(15);
      const lowVolDelta = curve[3].icpMmHg - curve[0].icpMmHg; // 0 to 30 mL
      const highVolDelta = curve[10].icpMmHg - curve[7].icpMmHg; // 70 to 100 mL

      // High volume delta must be significantly steeper due to exponential elastance
      expect(highVolDelta).toBeGreaterThan(lowVolDelta * 2);
    });
  });

  describe('Clinical Presets', () => {
    it('contains all 6 evidence-based neurocritical care presets', () => {
      expect(ICP_PRESETS.length).toBe(6);
      const ids = ICP_PRESETS.map(p => p.id);

      expect(ids).toContain('tbi-acute-subdural');
      expect(ids).toContain('sah-hydrocephalus');
      expect(ids).toContain('lundberg-a-plateau');
      expect(ids).toContain('cushing-triad-terminal');
      expect(ids).toContain('hyperosmolar-evd-response');
      expect(ids).toContain('refractory-tier3-craniectomy');
    });
  });
});
