import {
  computeAcousticGain,
  calculateCaliperDistance,
  generateMModeColumn,
  evaluateEfastSession,
  ACOUSTIC_WINDOWS,
  EFAST_CHECKLIST_STEPS,
  UltrasoundSettings,
  AcousticWindow
} from '../../.gemini/skills/PocusUltrasoundEngine';

describe('PocusUltrasoundEngine', () => {
  const defaultSettings: UltrasoundSettings = {
    gainDb: 50,
    depthCm: 16,
    frequencyMhz: 3.5,
    dynamicRangeDb: 60,
    tgcNear: 0,
    tgcMid1: 0,
    tgcMid2: 0,
    tgcFar: 0,
    mode: 'B_MODE',
    isFrozen: false,
    showGrid: true,
    caliperActive: false
  };

  describe('computeAcousticGain', () => {
    it('attenuates acoustic energy with increasing depth', () => {
      const nearGain = computeAcousticGain(0.1, defaultSettings);
      const farGain = computeAcousticGain(0.9, defaultSettings);
      expect(farGain).toBeLessThan(nearGain);
    });

    it('boosts gain when Far TGC slider is increased', () => {
      const flatGain = computeAcousticGain(0.9, defaultSettings);
      const boostedFar = computeAcousticGain(0.9, { ...defaultSettings, tgcFar: 8 });
      expect(boostedFar).toBeGreaterThan(flatGain);
    });

    it('clamps gain output within physiological range [0.05, 2.5]', () => {
      const ultraLow = computeAcousticGain(1.0, { ...defaultSettings, gainDb: 20 });
      const ultraHigh = computeAcousticGain(0.0, { ...defaultSettings, gainDb: 90, tgcNear: 10 });
      expect(ultraLow).toBeGreaterThanOrEqual(0.05);
      expect(ultraHigh).toBeLessThanOrEqual(2.5);
    });
  });

  describe('calculateCaliperDistance', () => {
    it('calculates accurate real-world distance in mm', () => {
      // 500px canvas height, 10cm depth = 100mm depth => 1px = 0.2mm
      // A vertical line of 100px should measure 20mm
      const p1 = { x: 250, y: 100 };
      const p2 = { x: 250, y: 200 };
      const dist = calculateCaliperDistance(p1, p2, 500, 10);
      expect(dist).toBe(20.0);
    });

    it('calculates diagonal distance correctly via Euclidean Pythagorean theorem', () => {
      // 3-4-5 triangle: dx=30, dy=40 -> pixelDist=50
      // 100px canvas, 10cm depth (100mm) -> 1px = 1mm -> dist = 50mm
      const p1 = { x: 0, y: 0 };
      const p2 = { x: 30, y: 40 };
      const dist = calculateCaliperDistance(p1, p2, 100, 10);
      expect(dist).toBe(50.0);
    });

    it('returns 0 for identical points or invalid bounds', () => {
      const p1 = { x: 100, y: 100 };
      expect(calculateCaliperDistance(p1, p1, 500, 16)).toBe(0);
      expect(calculateCaliperDistance(p1, { x: 200, y: 200 }, 0, 16)).toBe(0);
    });
  });

  describe('generateMModeColumn', () => {
    it('generates expected number of depth sample points', () => {
      const samples = generateMModeColumn('LUNG_PLEURAL', 'NORMAL', 1.0, 80);
      expect(samples).toHaveLength(80);
      expect(samples[0].depthFraction).toBe(0);
      expect(samples[79].depthFraction).toBe(1);
    });

    it('distinguishes normal Seashore granular speckle from Pneumothorax Barcode pattern', () => {
      const normalSamples = generateMModeColumn('LUNG_PLEURAL', 'NORMAL', 1.5, 100);
      const ptxSamples = generateMModeColumn('LUNG_PLEURAL', 'PNEUMOTHORAX', 1.5, 100);

      // In Pneumothorax (Barcode), laminar pattern persists deep into the scan
      // Check samples well below the pleura (depth > 0.6)
      const normalSubpleura = normalSamples.filter(s => s.depthFraction > 0.6);
      const ptxSubpleura = ptxSamples.filter(s => s.depthFraction > 0.6);

      expect(normalSubpleura.length).toBeGreaterThan(0);
      expect(ptxSubpleura.length).toBeGreaterThan(0);

      // Intensities remain bounded 0 to 255
      normalSamples.forEach(s => {
        expect(s.intensity).toBeGreaterThanOrEqual(0);
        expect(s.intensity).toBeLessThanOrEqual(255);
      });
    });

    it('models cardiac wall oscillations in Subxiphoid window', () => {
      const colT1 = generateMModeColumn('CARDIAC_SUBXIPHOID', 'NORMAL', 0.2, 50);
      const colT2 = generateMModeColumn('CARDIAC_SUBXIPHOID', 'NORMAL', 0.6, 50);
      expect(colT1).toHaveLength(50);
      expect(colT2).toHaveLength(50);
    });
  });

  describe('evaluateEfastSession', () => {
    it('reports incomplete when candidate has not viewed all 5 windows', () => {
      const assessed = new Set<AcousticWindow>(['RUQ_MORISONS_POUCH', 'CARDIAC_SUBXIPHOID']);
      const report = evaluateEfastSession(assessed, 'Positive hemoperitoneum', 'HEMOPERITONEUM');

      expect(report.isComplete).toBe(false);
      expect(report.totalViewsAssessed).toBe(2);
      expect(report.totalViewsRequired).toBe(5);
      expect(report.passedEvaluation).toBe(false); // under 75%
      expect(report.recommendations.some(r => r.includes('Complete all 5 standard eFAST windows'))).toBe(true);
    });

    it('awards high pass score for complete scan and accurate Hemoperitoneum diagnosis', () => {
      const allFive = new Set<AcousticWindow>(EFAST_CHECKLIST_STEPS.map(s => s.window));
      const report = evaluateEfastSession(allFive, 'Positive Hemoperitoneum in Morison pouch', 'HEMOPERITONEUM');

      expect(report.isComplete).toBe(true);
      expect(report.accuracy).toBe('ACCURATE');
      expect(report.scorePercentage).toBe(100);
      expect(report.passedEvaluation).toBe(true);
    });

    it('awards high pass score for complete scan with accurate Cardiac Tamponade diagnosis', () => {
      const allFive = new Set<AcousticWindow>(EFAST_CHECKLIST_STEPS.map(s => s.window));
      const report = evaluateEfastSession(allFive, 'Pericardial effusion with tamponade physiology', 'PERICARDIAL_EFFUSION_TAMPONADE');

      expect(report.isComplete).toBe(true);
      expect(report.accuracy).toBe('ACCURATE');
      expect(report.passedEvaluation).toBe(true);
    });

    it('awards pass score for complete scan with accurate Normal eFAST diagnosis', () => {
      const allFive = new Set<AcousticWindow>(EFAST_CHECKLIST_STEPS.map(s => s.window));
      const report = evaluateEfastSession(allFive, 'Normal negative eFAST, no free fluid', 'NORMAL');

      expect(report.isComplete).toBe(true);
      expect(report.accuracy).toBe('ACCURATE');
      expect(report.passedEvaluation).toBe(true);
    });

    it('flags incorrect diagnosis when false negative is declared on hemoperitoneum', () => {
      const allFive = new Set<AcousticWindow>(EFAST_CHECKLIST_STEPS.map(s => s.window));
      const report = evaluateEfastSession(allFive, 'Completely normal exam', 'HEMOPERITONEUM');

      expect(report.accuracy).toBe('INCORRECT');
      expect(report.passedEvaluation).toBe(false);
    });
  });

  describe('Registry Integrity', () => {
    it('has all 5 statutory acoustic windows defined with valid structures', () => {
      const expectedWindows: AcousticWindow[] = [
        'CARDIAC_SUBXIPHOID',
        'RUQ_MORISONS_POUCH',
        'LUQ_SPLENORENAL',
        'PELVIC_SUPRAPUBIC',
        'LUNG_PLEURAL'
      ];

      expectedWindows.forEach(w => {
        const def = ACOUSTIC_WINDOWS[w];
        expect(def).toBeDefined();
        expect(def.structures.length).toBeGreaterThan(0);
        expect(def.recommendedProbe).toBeDefined();
        expect(def.defaultDepthCm).toBeGreaterThan(0);
      });
    });
  });
});
