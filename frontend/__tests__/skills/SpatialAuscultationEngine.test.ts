import {
  calculateSpatialAttenuation,
  evaluateDynamicManeuver,
  synthesizePcgEcgWaveform,
  AUSCULTATION_LANDMARKS,
  AUSCULTATION_PRESETS
} from '../../.gemini/skills/SpatialAuscultationEngine';

describe('Track C3: SpatialAuscultationEngine', () => {
  it('1. returns 1.0 attenuation when stethoscope is placed directly over landmark', () => {
    const landmarkPos = { x: 42, y: 32 };
    const stethPos = { x: 42, y: 32 };
    const att = calculateSpatialAttenuation(landmarkPos, stethPos);
    expect(att).toBe(1.0);
  });

  it('2. attenuates smoothly with distance following inverse-squared law', () => {
    const landmarkPos = { x: 42, y: 32 };
    const closePos = { x: 44, y: 34 };
    const farPos = { x: 75, y: 70 };

    const attClose = calculateSpatialAttenuation(landmarkPos, closePos);
    const attFar = calculateSpatialAttenuation(landmarkPos, farPos);

    expect(attClose).toBeGreaterThan(attFar);
    expect(attClose).toBeGreaterThan(0.7);
    expect(attFar).toBeLessThan(0.3);
  });

  it('3. verifies all standard anatomical landmarks are defined with valid coordinates', () => {
    expect(AUSCULTATION_LANDMARKS.length).toBeGreaterThanOrEqual(8);
    const ids = AUSCULTATION_LANDMARKS.map(l => l.id);
    expect(ids).toContain('aortic');
    expect(ids).toContain('pulmonic');
    expect(ids).toContain('erbs');
    expect(ids).toContain('tricuspid');
    expect(ids).toContain('mitral');
    expect(ids).toContain('r_base');
    expect(ids).toContain('l_base');

    AUSCULTATION_LANDMARKS.forEach(l => {
      expect(l.x).toBeGreaterThanOrEqual(0);
      expect(l.x).toBeLessThanOrEqual(100);
      expect(l.y).toBeGreaterThanOrEqual(0);
      expect(l.y).toBeLessThanOrEqual(100);
    });
  });

  it('4. verifies 5 clinical presets with complete diagnoses and vitals', () => {
    expect(AUSCULTATION_PRESETS).toHaveLength(5);
    AUSCULTATION_PRESETS.forEach(p => {
      expect(p.heartRateBpm).toBeGreaterThan(50);
      expect(p.vitals.bp).toBeTruthy();
      expect(p.murmurDescription).toBeTruthy();
      expect(p.optimalChestpiece).toMatch(/bell|diaphragm/);
    });
  });

  it('5. models Carvallo sign during inspiration (right-sided murmurs increase)', () => {
    const res = evaluateDynamicManeuver('inspiration', 'tricuspid-regurgitation');
    expect(res.amplitudeMultiplier).toBeGreaterThan(1.0);
    expect(res.clinicalMechanism).toContain("Carvallo's Sign");
  });

  it('6. models handgrip augmentation of mitral regurgitation (+50% afterload)', () => {
    const res = evaluateDynamicManeuver('handgrip', 'mitral-regurgitation');
    expect(res.amplitudeMultiplier).toBe(1.5);
    expect(res.clinicalMechanism).toContain('afterload');
  });

  it('7. models Valsalva strain reducing preload and softening aortic stenosis', () => {
    const res = evaluateDynamicManeuver('valsalva', 'aortic-stenosis');
    expect(res.amplitudeMultiplier).toBeLessThan(1.0);
    expect(res.clinicalMechanism).toContain('preload');
  });

  it('8. synthesizes synchronized PCG and ECG waveform samples matching cardiac cycle', () => {
    const wave = synthesizePcgEcgWaveform({
      hrBpm: 75, // cycle = 800ms
      pathologyId: 'aortic-stenosis',
      chestpiece: 'diaphragm',
      maneuver: 'normal',
      spatialAttenuation: 1.0,
      samplePoints: 300
    });

    expect(wave).toHaveLength(300);
    expect(wave[0].timeMs).toBe(0);
    expect(wave[wave.length - 1].timeMs).toBeCloseTo(800, -1);
  });

  it('9. aligns S1 acoustic burst with ECG R-wave peak', () => {
    const wave = synthesizePcgEcgWaveform({
      hrBpm: 60, // cycle = 1000ms
      pathologyId: 'mitral-regurgitation',
      chestpiece: 'diaphragm',
      maneuver: 'normal',
      spatialAttenuation: 1.0,
      samplePoints: 500
    });

    // Find max ECG R-wave
    let maxEcgIdx = 0;
    let maxEcg = -999;
    wave.forEach((pt, i) => {
      if (pt.ecgVoltageMv > maxEcg) {
        maxEcg = pt.ecgVoltageMv;
        maxEcgIdx = i;
      }
    });

    // Peak R wave should be > 1.0 mV
    expect(maxEcg).toBeGreaterThan(1.0);

    // Nearby PCG should have significant amplitude burst (S1)
    const pcgNearby = wave.slice(Math.max(0, maxEcgIdx - 15), maxEcgIdx + 15);
    const hasPcgBurst = pcgNearby.some(pt => Math.abs(pt.pcgAmplitude) > 0.2);
    expect(hasPcgBurst).toBe(true);
  });

  it('10. amplifies low-pitched S3 gallop when Bell chestpiece is selected over Diaphragm', () => {
    const waveBell = synthesizePcgEcgWaveform({
      hrBpm: 80,
      pathologyId: 'chf-s3-crackles',
      chestpiece: 'bell',
      maneuver: 'normal',
      spatialAttenuation: 1.0,
      samplePoints: 400
    });

    const waveDiaphragm = synthesizePcgEcgWaveform({
      hrBpm: 80,
      pathologyId: 'chf-s3-crackles',
      chestpiece: 'diaphragm',
      maneuver: 'normal',
      spatialAttenuation: 1.0,
      samplePoints: 400
    });

    // At S3 time (~58% of cycle), bell amplitude should exceed diaphragm
    const s3Idx = Math.floor(400 * 0.58);
    const maxBellS3 = Math.max(...waveBell.slice(s3Idx - 10, s3Idx + 10).map(p => Math.abs(p.pcgAmplitude)));
    const maxDiaphS3 = Math.max(...waveDiaphragm.slice(s3Idx - 10, s3Idx + 10).map(p => Math.abs(p.pcgAmplitude)));

    expect(maxBellS3).toBeGreaterThan(maxDiaphS3);
  });
});
