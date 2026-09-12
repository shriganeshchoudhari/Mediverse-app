import {
  PROCEDURE_SCENARIOS,
  computeUltrasoundCrossSection,
  evaluateNeedleTrajectory,
  computeProceduralCompetencyScore,
} from '../../.gemini/skills/3d/WebXrProceduralTheaterEngine';

describe('WebXrProceduralTheaterEngine Unit Tests', () => {
  it('loads procedure scenarios with correct anatomical configurations', () => {
    expect(PROCEDURE_SCENARIOS.IJV_CENTRAL_LINE).toBeDefined();
    expect(PROCEDURE_SCENARIOS.PERICARDIOCENTESIS).toBeDefined();
    expect(PROCEDURE_SCENARIOS.LUMBAR_PUNCTURE).toBeDefined();

    expect(PROCEDURE_SCENARIOS.IJV_CENTRAL_LINE.idealAngleRangeDeg).toEqual([30, 45]);
    expect(PROCEDURE_SCENARIOS.PERICARDIOCENTESIS.idealDepthRangeMm).toEqual([35, 50]);
    expect(PROCEDURE_SCENARIOS.LUMBAR_PUNCTURE.targetStructure).toContain('Subarachnoid');
  });

  describe('Multiplanar Ultrasound Cross-Section Computation', () => {
    it('computes transverse B-mode view with IJV and Carotid Artery', () => {
      const probe = {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: 0, // Transverse
        tiltAngleDeg: 0,
        compressionMm: 0,
        depthCm: 5,
        gain: 50,
        colorDoppler: false,
      };
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 35,
        azimuthDeg: 5,
        depthMm: 10,
        isAspirating: false,
      };

      const crossSection = computeUltrasoundCrossSection('IJV_CENTRAL_LINE', probe, needle);
      expect(crossSection.probeMode).toBe('TRANSVERSE_SHORT_AXIS');
      expect(crossSection.structures).toHaveLength(3);

      const ijv = crossSection.structures.find(s => s.name.includes('Internal Jugular'));
      const cca = crossSection.structures.find(s => s.name.includes('Carotid'));
      expect(ijv).toBeDefined();
      expect(cca).toBeDefined();
      expect(ijv?.isCompressed).toBe(false);
      expect(cca?.isPulsatile).toBe(true);
    });

    it('compresses the Internal Jugular Vein upon probe pressure while sparing Carotid', () => {
      const probe = {
        position: { x: 0, y: 0, z: 0 },
        rotationDeg: 0,
        tiltAngleDeg: 0,
        compressionMm: 5.0, // Significant compression
        depthCm: 5,
        gain: 50,
        colorDoppler: false,
      };
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 35,
        azimuthDeg: 5,
        depthMm: 0,
        isAspirating: false,
      };

      const crossSection = computeUltrasoundCrossSection('IJV_CENTRAL_LINE', probe, needle);
      const ijv = crossSection.structures.find(s => s.name.includes('Internal Jugular'));
      const cca = crossSection.structures.find(s => s.name.includes('Carotid'));

      expect(ijv?.isCompressed).toBe(true);
      expect(ijv?.radiusYNorm).toBeLessThan(0.06); // Flattened lumen
      expect(cca?.isCompressed).toBe(false); // Rigid arterial wall resists compression
    });
  });

  describe('Needle Trajectory & Flashback Kinematics', () => {
    it('detects successful IJV lumen entry and dark venous blood flashback with aspiration', () => {
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 35,
        azimuthDeg: 5,
        depthMm: 20, // Inside target depth (14-26mm)
        isAspirating: true,
      };

      const feedback = evaluateNeedleTrajectory('IJV_CENTRAL_LINE', needle);
      expect(feedback.punctureStatus).toBe('TARGET_LUMEN_SUCCESS');
      expect(feedback.flashbackActive).toBe(true);
      expect(feedback.flashbackType).toBe('VENOUS_DARK_RED');
      expect(feedback.hasResistanceDrop).toBe(true);
      expect(feedback.safetyWarning).toBeUndefined();
    });

    it('detects critical accidental carotid artery puncture on medial needle deviation', () => {
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 35,
        azimuthDeg: 25, // Medial deviation toward Carotid Artery
        depthMm: 18,
        isAspirating: true,
      };

      const feedback = evaluateNeedleTrajectory('IJV_CENTRAL_LINE', needle);
      expect(feedback.punctureStatus).toBe('CRITICAL_ARTERY_PUNCTURE');
      expect(feedback.flashbackActive).toBe(true);
      expect(feedback.flashbackType).toBe('ARTERIAL_PULSATILE_BRIGHT');
      expect(feedback.safetyWarning).toContain('Accidental Carotid Artery Puncture');
    });

    it('detects posterior wall transfixion on overpenetration', () => {
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 35,
        azimuthDeg: 5,
        depthMm: 32, // Overpenetration > 28mm
        isAspirating: false,
      };

      const feedback = evaluateNeedleTrajectory('IJV_CENTRAL_LINE', needle);
      expect(feedback.punctureStatus).toBe('POSTERIOR_WALL_TRANSFIXION');
      expect(feedback.safetyWarning).toContain('posterior wall');
    });

    it('detects pericardial aspiration with hemodynamic improvement in pericardiocentesis', () => {
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 22,
        azimuthDeg: 0,
        depthMm: 42,
        isAspirating: true,
      };

      const feedback = evaluateNeedleTrajectory('PERICARDIOCENTESIS', needle);
      expect(feedback.punctureStatus).toBe('PERICARDIAL_ASPIRATION_SUCCESS');
      expect(feedback.flashbackType).toBe('PERICARDIAL_SEROSANGUINOUS');
      expect(feedback.hemodynamicDelta.mapChangeMmHg).toBeGreaterThan(0);
      expect(feedback.hemodynamicDelta.cardiacOutputDeltaLMin).toBeGreaterThan(0);
    });

    it('detects dural pop and clear CSF return in lumbar puncture', () => {
      const needle = {
        entryPoint: { x: 0, y: 0, z: 0 },
        angleDeg: 10,
        azimuthDeg: 0,
        depthMm: 50,
        isAspirating: true,
      };

      const feedback = evaluateNeedleTrajectory('LUMBAR_PUNCTURE', needle);
      expect(feedback.punctureStatus).toBe('SUBARACHNOID_CSF_FLOW');
      expect(feedback.flashbackType).toBe('CLEAR_CSF');
      expect(feedback.hasResistanceDrop).toBe(true);
    });
  });

  describe('Procedural Competency Scoring', () => {
    it('awards A+ grade for flawless technique with aspiration and tight precision', () => {
      const result = computeProceduralCompetencyScore({
        scenarioId: 'IJV_CENTRAL_LINE',
        attemptsCount: 1,
        bestTargetDistanceMm: 1.2,
        hasArterialPuncture: false,
        hasPosteriorTransfixion: false,
        aspiratedSuccessfully: true,
        timeTakenSec: 90,
      });

      expect(result.score).toBe(100);
      expect(result.grade).toBe('A+');
      expect(result.feedbackItems).toContain('Verified free aspiration of fluid/blood prior to wire advancement.');
    });

    it('assigns FAIL grade if inadvertent arterial puncture occurred', () => {
      const result = computeProceduralCompetencyScore({
        scenarioId: 'IJV_CENTRAL_LINE',
        attemptsCount: 2,
        bestTargetDistanceMm: 8.5,
        hasArterialPuncture: true,
        hasPosteriorTransfixion: true,
        aspiratedSuccessfully: false,
        timeTakenSec: 210,
      });

      expect(result.score).toBeLessThan(50);
      expect(result.grade).toBe('FAIL');
      expect(result.feedbackItems[0]).toContain('Major safety violation');
    });
  });
});
