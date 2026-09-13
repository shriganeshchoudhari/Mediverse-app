import {
  calculateHounsfieldValue,
  applyWindowLevel,
  calculateCaliperMeasurement,
  calculateRoiMetrics,
  getDicomClinicalPresets,
  getMprSlice,
  DICOM_WINDOW_PRESETS
} from '../../.gemini/skills/DicomPacsEngine';

describe('Track C2: DicomPacsEngine', () => {
  it('1. calculates Hounsfield Unit from raw pixel value with slope and intercept', () => {
    const raw = 1024;
    const slope = 1.0;
    const intercept = -1024;
    expect(calculateHounsfieldValue(raw, slope, intercept)).toBe(0); // Water (0 HU)

    const boneRaw = 2048;
    expect(calculateHounsfieldValue(boneRaw, slope, intercept)).toBe(1024); // Bone (+1024 HU)
  });

  it('2. maps HU values below lower bound to 0 and above upper bound to 255', () => {
    const level = 40;
    const width = 80; // Window range: [0, 80]
    expect(applyWindowLevel(-10, width, level)).toBe(0);
    expect(applyWindowLevel(0, width, level)).toBe(0);
    expect(applyWindowLevel(80, width, level)).toBe(255);
    expect(applyWindowLevel(150, width, level)).toBe(255);
  });

  it('3. maps center level to approximate mid-gray (128)', () => {
    const level = 40;
    const width = 80;
    const midVal = applyWindowLevel(40, width, level);
    expect(midVal).toBeGreaterThanOrEqual(126);
    expect(midVal).toBeLessThanOrEqual(129);
  });

  it('4. calculates Euclidean linear distance caliper with pixel spacing scaling', () => {
    const p1 = { x: 10, y: 10 };
    const p2 = { x: 20, y: 10 }; // 10 pixels in X
    const spacing: [number, number] = [0.8, 0.8]; // 0.8 mm/pixel
    const res = calculateCaliperMeasurement(p1, p2, spacing);
    expect(res.distanceMm).toBe(8.0);
    expect(res.distanceCm).toBe(0.8);
  });

  it('5. computes ROI metrics and classifies acute hemorrhage correctly', () => {
    const bloodPixels = [70, 72, 75, 74, 76, 78, 69, 71];
    const metrics = calculateRoiMetrics(bloodPixels);
    expect(metrics.count).toBe(8);
    expect(metrics.meanHu).toBeGreaterThanOrEqual(70);
    expect(metrics.meanHu).toBeLessThanOrEqual(76);
    expect(metrics.tissueClassification).toContain('Acute Hemorrhage');
  });

  it('6. classifies lung parenchyma and cortical bone correctly', () => {
    const lungPixels = [-750, -740, -760, -780];
    expect(calculateRoiMetrics(lungPixels).tissueClassification).toContain('Lung Parenchyma');

    const bonePixels = [850, 950, 1100, 1200];
    expect(calculateRoiMetrics(bonePixels).tissueClassification).toContain('Bone');
  });

  it('7. returns 3 clinical presets with 16 slices each', () => {
    const presets = getDicomClinicalPresets();
    expect(presets).toHaveLength(3);
    presets.forEach(p => {
      expect(p.slices).toHaveLength(16);
      expect(p.rows).toBe(32);
      expect(p.columns).toBe(32);
      expect(p.slices[0].metadata.patientId).toBeTruthy();
    });
  });

  it('8. verifies epidural hematoma preset contains hyperdense hematoma', () => {
    const presets = getDicomClinicalPresets();
    const epi = presets.find(p => p.id === 'brain-epidural-hematoma')!;
    expect(epi).toBeDefined();

    // Central slice should contain acute blood (75 HU)
    const midSlice = epi.slices[8];
    const hasBlood = midSlice.pixelData.some(hu => hu === 75);
    expect(hasBlood).toBe(true);
  });

  it('9. verifies pulmonary embolism preset contains filling defect in contrast vessel', () => {
    const presets = getDicomClinicalPresets();
    const pe = presets.find(p => p.id === 'chest-ctpa-pulmonary-embolism')!;
    expect(pe).toBeDefined();

    const midSlice = pe.slices[8];
    const hasContrast = midSlice.pixelData.some(hu => hu >= 250);
    const hasThrombus = midSlice.pixelData.some(hu => hu === 35);
    expect(hasContrast).toBe(true);
    expect(hasThrombus).toBe(true);
  });

  it('10. reconstructs multi-planar orthogonal slices with correct dimensions', () => {
    const presets = getDicomClinicalPresets();
    const series = presets[0];

    const axial = getMprSlice(series, 'axial', 4);
    expect(axial.width).toBe(32);
    expect(axial.height).toBe(32);
    expect(axial.pixels).toHaveLength(32 * 32);

    const coronal = getMprSlice(series, 'coronal', 16);
    expect(coronal.width).toBe(32);
    expect(coronal.height).toBe(16);
    expect(coronal.pixels).toHaveLength(32 * 16);

    const sagittal = getMprSlice(series, 'sagittal', 16);
    expect(sagittal.width).toBe(32);
    expect(sagittal.height).toBe(16);
    expect(sagittal.pixels).toHaveLength(32 * 16);
  });
});
