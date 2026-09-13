/**
 * DicomPacsEngine.ts
 * Digital Imaging and Communications in Medicine (DICOM) PACS & Multi-Planar Reconstruction Engine
 * Track C2 - Mediverse Clinical Platform Architecture
 */

export type MprPlane = 'axial' | 'coronal' | 'sagittal';

export interface DicomMetadata {
  patientName: string;
  patientId: string;
  patientSex: 'M' | 'F' | 'O';
  patientBirthDate: string;
  studyDate: string;
  modality: 'CT' | 'MR';
  studyDescription: string;
  seriesDescription: string;
  seriesNumber: number;
  instanceNumber: number;
  kvp: number;
  xRayTubeCurrentMa: number;
  sliceThicknessMm: number;
  pixelSpacingMm: [number, number]; // [row spacing, column spacing] in mm
  rows: number;
  columns: number;
  windowCenter: number;
  windowWidth: number;
  rescaleSlope: number;
  rescaleIntercept: number;
}

export interface DicomSlice {
  sliceIndex: number;
  sliceLocationMm: number;
  pixelData: number[]; // 1D array of length rows * columns (stores HUs directly)
  metadata: DicomMetadata;
}

export interface DicomSeries {
  id: string;
  name: string;
  organSystem: string;
  clinicalIndication: string;
  pathologyFinding: string;
  modality: 'CT' | 'MR';
  rows: number;
  columns: number;
  sliceCount: number;
  slices: DicomSlice[];
  defaultWindow: { level: number; width: number; name: string };
}

export interface WindowPreset {
  id: string;
  name: string;
  level: number;
  width: number;
  description: string;
}

export const DICOM_WINDOW_PRESETS: WindowPreset[] = [
  { id: 'brain', name: 'Brain (Stroke/Edema)', level: 40, width: 80, description: 'Differentiates gray matter, white matter, and cytotoxic edema' },
  { id: 'subdural', name: 'Subdural / Blood', level: 75, width: 150, description: 'Visualizes acute intracranial hemorrhage and extra-axial hematoma' },
  { id: 'lung', name: 'Lung Parenchyma', level: -600, width: 1500, description: 'Evaluates bronchoalveolar detail, infiltrates, and emphysema' },
  { id: 'soft-tissue', name: 'Mediastinum / Soft Tissue', level: 40, width: 400, description: 'Standard soft-tissue window for lymph nodes and great vessels' },
  { id: 'bone', name: 'Bone / Calvarium', level: 300, width: 1500, description: 'High dynamic range for cortical bone, fractures, and osteolysis' },
  { id: 'liver', name: 'Liver / Abdomen', level: 60, width: 150, description: 'Narrow soft-tissue window detecting subtle hepatic parenchymal lesions' }
];

/**
 * Calculate Hounsfield Value from raw pixel data
 */
export function calculateHounsfieldValue(rawPixel: number, slope: number, intercept: number): number {
  return Math.round(rawPixel * slope + intercept);
}

/**
 * Apply Window / Level Contrast Mapping (returns 0-255 grayscale integer)
 */
export function applyWindowLevel(hu: number, width: number, level: number): number {
  const lower = level - width / 2;
  const upper = level + width / 2;

  if (hu <= lower) return 0;
  if (hu >= upper) return 255;

  return Math.round(((hu - lower) / width) * 255);
}

/**
 * Calculate Caliper Linear Measurement in mm and cm
 */
export function calculateCaliperMeasurement(
  p1: { x: number; y: number },
  p2: { x: number; y: number },
  pixelSpacing: [number, number]
): { distanceMm: number; distanceCm: number } {
  const dx = (p2.x - p1.x) * pixelSpacing[1]; // column spacing
  const dy = (p2.y - p1.y) * pixelSpacing[0]; // row spacing
  const distanceMm = Math.sqrt(dx * dx + dy * dy);
  const distanceCm = distanceMm / 10;

  return {
    distanceMm: parseFloat(distanceMm.toFixed(2)),
    distanceCm: parseFloat(distanceCm.toFixed(2))
  };
}

/**
 * Calculate Region of Interest (ROI) Radiodensity Metrics
 */
export function calculateRoiMetrics(huValues: number[]): {
  count: number;
  meanHu: number;
  minHu: number;
  maxHu: number;
  stdDev: number;
  tissueClassification: string;
} {
  if (huValues.length === 0) {
    return { count: 0, meanHu: 0, minHu: 0, maxHu: 0, stdDev: 0, tissueClassification: 'Unknown' };
  }

  let sum = 0;
  let min = huValues[0];
  let max = huValues[0];

  for (const v of huValues) {
    sum += v;
    if (v < min) min = v;
    if (v > max) max = v;
  }

  const mean = sum / huValues.length;

  let sumSqDiff = 0;
  for (const v of huValues) {
    const diff = v - mean;
    sumSqDiff += diff * diff;
  }
  const stdDev = Math.sqrt(sumSqDiff / huValues.length);

  let tissue = 'Soft Tissue';
  if (mean < -500) tissue = 'Air / Lung Parenchyma';
  else if (mean >= -150 && mean <= -20) tissue = 'Adipose / Fat Tissue';
  else if (mean > -20 && mean <= 15) tissue = 'Simple Fluid / Water / Cyst';
  else if (mean > 15 && mean <= 50) tissue = 'Soft Tissue / Muscle / Visceral Parenchyma';
  else if (mean > 50 && mean <= 85) tissue = 'Acute Hemorrhage / Clotted Blood';
  else if (mean > 85 && mean <= 250) tissue = 'Contrast Enhancement / Calcification';
  else if (mean > 250) tissue = 'Dense Cortical Bone / Metal';

  return {
    count: huValues.length,
    meanHu: Math.round(mean),
    minHu: Math.round(min),
    maxHu: Math.round(max),
    stdDev: parseFloat(stdDev.toFixed(1)),
    tissueClassification: tissue
  };
}

/**
 * Multi-Planar Reconstruction (MPR) Extractor
 */
export function getMprSlice(
  series: DicomSeries,
  plane: MprPlane,
  sliceIndex: number
): { width: number; height: number; pixels: number[] } {
  const rows = series.rows;
  const cols = series.columns;
  const depth = series.slices.length;

  if (plane === 'axial') {
    const safeIdx = Math.max(0, Math.min(depth - 1, sliceIndex));
    const slice = series.slices[safeIdx];
    return {
      width: cols,
      height: rows,
      pixels: slice ? [...slice.pixelData] : new Array(rows * cols).fill(-1000)
    };
  }

  if (plane === 'coronal') {
    // Slicing through Y (row dimension). Height = depth, Width = cols
    const safeY = Math.max(0, Math.min(rows - 1, sliceIndex));
    const pixels: number[] = new Array(depth * cols).fill(0);

    for (let z = 0; z < depth; z++) {
      const sliceData = series.slices[z].pixelData;
      for (let x = 0; x < cols; x++) {
        const val = sliceData[safeY * cols + x];
        pixels[z * cols + x] = val !== undefined ? val : -1000;
      }
    }

    return {
      width: cols,
      height: depth,
      pixels
    };
  }

  // Sagittal: Slicing through X (column dimension). Height = depth, Width = rows
  const safeX = Math.max(0, Math.min(cols - 1, sliceIndex));
  const pixels: number[] = new Array(depth * rows).fill(0);

  for (let z = 0; z < depth; z++) {
    const sliceData = series.slices[z].pixelData;
    for (let y = 0; y < rows; y++) {
      const val = sliceData[y * cols + safeX];
      pixels[z * rows + y] = val !== undefined ? val : -1000;
    }
  }

  return {
    width: rows,
    height: depth,
    pixels
  };
}

/**
 * Synthetic Clinical DICOM Series Generator (32x32 resolution for fast WebGL/Canvas rendering)
 */
export function getDicomClinicalPresets(): DicomSeries[] {
  const rows = 32;
  const cols = 32;
  const sliceCount = 16;
  const pixelSpacing: [number, number] = [0.8, 0.8]; // 0.8mm isotropic

  // Preset 1: Acute Epidural Hematoma (CT Brain)
  const epiduralSlices: DicomSlice[] = [];
  for (let s = 0; s < sliceCount; s++) {
    const pixelData = new Array(rows * cols).fill(-1000); // Air background
    const zOffset = (s - sliceCount / 2) / (sliceCount / 2);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const nx = (x - cols / 2) / (cols / 2);
        const ny = (y - rows / 2) / (rows / 2);
        const r = Math.sqrt(nx * nx + ny * ny);

        if (r > 0.95) {
          pixelData[y * cols + x] = -1000; // Air
        } else if (r > 0.82) {
          pixelData[y * cols + x] = 1100; // Skull Bone
        } else if (r > 0.76) {
          pixelData[y * cols + x] = 5; // CSF / Subarachnoid space
        } else {
          // Brain parenchyma baseline (35-42 HU)
          let hu = 38 + Math.round(Math.sin(x * 0.4) * 3);

          // Ventricles in central slices
          if (s >= 6 && s <= 10 && Math.abs(nx) < 0.15 && Math.abs(ny) < 0.25) {
            hu = 2; // CSF
          }

          // Epidural Hematoma: Lenticular/Biconvex hyperdense mass in right temporoparietal (x > 0.45, y between -0.3 and 0.3)
          if (s >= 5 && s <= 11) {
            const dx = nx - 0.65;
            const dy = ny;
            const distLenticular = Math.sqrt(dx * dx * 1.8 + dy * dy * 3.5);
            if (distLenticular < 0.32) {
              hu = 75; // Acute Clotted Blood (Hyperdense)
            }
          }

          pixelData[y * cols + x] = hu;
        }
      }
    }

    epiduralSlices.push({
      sliceIndex: s,
      sliceLocationMm: s * 3.0,
      pixelData,
      metadata: {
        patientName: 'Kovacs^Arthur',
        patientId: 'MRN-CTB-8812',
        patientSex: 'M',
        patientBirthDate: '1984-07-22',
        studyDate: '2026-09-13',
        modality: 'CT',
        studyDescription: 'CT HEAD WITHOUT CONTRAST',
        seriesDescription: 'AXIAL BRAIN RECON',
        seriesNumber: 2,
        instanceNumber: s + 1,
        kvp: 120,
        xRayTubeCurrentMa: 280,
        sliceThicknessMm: 3.0,
        pixelSpacingMm: pixelSpacing,
        rows,
        columns: cols,
        windowCenter: 40,
        windowWidth: 80,
        rescaleSlope: 1.0,
        rescaleIntercept: 0.0
      }
    });
  }

  const epiduralSeries: DicomSeries = {
    id: 'brain-epidural-hematoma',
    name: 'Acute Epidural Hematoma with Calvarium Fracture (Head CT)',
    organSystem: 'Neuroradiology',
    clinicalIndication: 'Traumatic brain injury, right temporal impact, lucid interval followed by rapid coma',
    pathologyFinding: 'Biconvex (lenticular) extra-axial hyperdense mass (75 HU) in right temporoparietal region with midline shift',
    modality: 'CT',
    rows,
    columns: cols,
    sliceCount,
    slices: epiduralSlices,
    defaultWindow: { level: 75, width: 150, name: 'Subdural / Blood' }
  };

  // Preset 2: Acute Pulmonary Embolism (Chest CTPA)
  const peSlices: DicomSlice[] = [];
  for (let s = 0; s < sliceCount; s++) {
    const pixelData = new Array(rows * cols).fill(-1000);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const nx = (x - cols / 2) / (cols / 2);
        const ny = (y - rows / 2) / (rows / 2);
        const r = Math.sqrt(nx * nx + ny * ny);

        if (r > 0.95) {
          pixelData[y * cols + x] = -1000;
        } else if (r > 0.88) {
          pixelData[y * cols + x] = 600; // Ribs / Thoracic cage
        } else if (r > 0.82) {
          pixelData[y * cols + x] = 35; // Chest wall musculature
        } else {
          // Mediastinum vs Lungs
          const isMediastinum = Math.abs(nx) < 0.28 && Math.abs(ny) < 0.45;
          if (isMediastinum) {
            // Contrast-enhanced pulmonary trunk (+280 HU)
            let hu = 45;
            if (s >= 6 && s <= 10 && Math.abs(nx) < 0.18 && Math.abs(ny) < 0.22) {
              hu = 290; // Dense iodinated contrast in Pulmonary Artery

              // Saddle Pulmonary Embolism filling defect in bifurcation
              if (Math.abs(nx) < 0.08 && Math.abs(ny) < 0.08) {
                hu = 35; // Thrombus filling defect
              }
            }
            pixelData[y * cols + x] = hu;
          } else {
            // Lung parenchyma (-780 HU)
            let hu = -750 + Math.round(Math.sin(x * y) * 20);

            // Wedge-shaped peripheral pulmonary infarction (Hampton hump) in right base (s >= 10, nx > 0.5, ny > 0.3)
            if (s >= 10 && nx > 0.45 && ny > 0.25) {
              hu = -90; // Ground glass consolidation / alveolar hemorrhage
            }
            pixelData[y * cols + x] = hu;
          }
        }
      }
    }

    peSlices.push({
      sliceIndex: s,
      sliceLocationMm: s * 2.5,
      pixelData,
      metadata: {
        patientName: 'Sterling^Diane',
        patientId: 'MRN-CTA-5520',
        patientSex: 'F',
        patientBirthDate: '1970-03-14',
        studyDate: '2026-09-13',
        modality: 'CT',
        studyDescription: 'CTA CHEST FOR PULMONARY EMBOLISM',
        seriesDescription: 'PULMONARY ANGIOGRAPHY 0.8MM',
        seriesNumber: 3,
        instanceNumber: s + 1,
        kvp: 100,
        xRayTubeCurrentMa: 350,
        sliceThicknessMm: 2.5,
        pixelSpacingMm: pixelSpacing,
        rows,
        columns: cols,
        windowCenter: 40,
        windowWidth: 400,
        rescaleSlope: 1.0,
        rescaleIntercept: 0.0
      }
    });
  }

  const peSeries: DicomSeries = {
    id: 'chest-ctpa-pulmonary-embolism',
    name: 'Acute Saddle Pulmonary Embolism & Infarction (Chest CTPA)',
    organSystem: 'Thoracic Radiology',
    clinicalIndication: 'Pleuritic chest pain, acute dyspnea, tachycardia, Wells score 6.5, D-dimer 3,400 ng/mL',
    pathologyFinding: 'Central filling defect (35 HU) in contrast-opacified main pulmonary bifurcation (290 HU) with peripheral wedge consolidation',
    modality: 'CT',
    rows,
    columns: cols,
    sliceCount,
    slices: peSlices,
    defaultWindow: { level: 40, width: 400, name: 'Soft Tissue / Mediastinum' }
  };

  // Preset 3: Traumatic Liver Laceration & Hemoperitoneum (Abdominal CT)
  const liverSlices: DicomSlice[] = [];
  for (let s = 0; s < sliceCount; s++) {
    const pixelData = new Array(rows * cols).fill(-1000);

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const nx = (x - cols / 2) / (cols / 2);
        const ny = (y - rows / 2) / (rows / 2);
        const r = Math.sqrt(nx * nx + ny * ny);

        if (r > 0.95) {
          pixelData[y * cols + x] = -1000;
        } else if (r > 0.88) {
          pixelData[y * cols + x] = 700; // Spine / Pelvis bone
        } else {
          // Abdominal cavity
          let hu = -80; // Mesenteric retroperitoneal fat (-80 HU)

          // Right upper quadrant: Liver parenchyma (+60 HU)
          if (nx > -0.2 && ny > -0.6 && ny < 0.6) {
            hu = 65; // Normal enhanced liver parenchyma

            // Liver laceration tear in posterior right lobe (s between 6 and 11, nx > 0.35, ny > 0.1)
            if (s >= 6 && s <= 11 && nx > 0.32 && ny > 0.05 && ny < 0.45) {
              hu = 22; // Low-attenuation hematoma laceration cleft (22 HU)

              // Active arterial contrast extravasation "blush" (180 HU)
              if (nx > 0.42 && ny > 0.18 && ny < 0.28) {
                hu = 195; // Active bleeding blush
              }
            }
          }

          // Morison's pouch hemoperitoneum fluid in right flank (nx > 0.65)
          if (s >= 8 && s <= 13 && nx > 0.68) {
            hu = 52; // High-attenuation hemorrhagic fluid (Hemoperitoneum)
          }

          pixelData[y * cols + x] = hu;
        }
      }
    }

    liverSlices.push({
      sliceIndex: s,
      sliceLocationMm: s * 3.5,
      pixelData,
      metadata: {
        patientName: 'Briggs^Marcus',
        patientId: 'MRN-CTA-9021',
        patientSex: 'M',
        patientBirthDate: '1995-12-05',
        studyDate: '2026-09-13',
        modality: 'CT',
        studyDescription: 'CT ABDOMEN/PELVIS WITH IV CONTRAST',
        seriesDescription: 'PORTAL VENOUS PHASE 3MM',
        seriesNumber: 4,
        instanceNumber: s + 1,
        kvp: 120,
        xRayTubeCurrentMa: 320,
        sliceThicknessMm: 3.5,
        pixelSpacingMm: pixelSpacing,
        rows,
        columns: cols,
        windowCenter: 60,
        windowWidth: 150,
        rescaleSlope: 1.0,
        rescaleIntercept: 0.0
      }
    });
  }

  const liverSeries: DicomSeries = {
    id: 'abdomen-liver-laceration',
    name: 'Grade IV Hepatic Laceration with Active Arterial Blush (Abdominal CT)',
    organSystem: 'Abdominal Radiology',
    clinicalIndication: 'High-speed motor vehicle collision, steering wheel trauma, right upper quadrant tenderness, SBP 88 mmHg',
    pathologyFinding: 'Linear branching low-attenuation parenchymal disruption (22 HU) with focal pooling of contrast blush (195 HU) and perihepatic hemoperitoneum (52 HU)',
    modality: 'CT',
    rows,
    columns: cols,
    sliceCount,
    slices: liverSlices,
    defaultWindow: { level: 60, width: 150, name: 'Liver / Abdomen' }
  };

  return [epiduralSeries, peSeries, liverSeries];
}
