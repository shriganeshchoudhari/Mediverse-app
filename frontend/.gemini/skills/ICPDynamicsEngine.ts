/**
 * ICPDynamicsEngine.ts
 * 
 * Neurocritical Care & Intracranial Pressure (ICP / TBI) Simulation Engine.
 * 
 * Implements:
 * - Monro-Kellie Volume-Pressure Elastance Curve (CSF translocation & venous buffer exhaustion)
 * - Cerebral Perfusion Pressure (CPP = MAP - ICP) & Cerebral Autoregulation (BTF target 60-70 mmHg)
 * - Micro-Scale Pulse Waveform Morphology (P1 Percussion, P2 Tidal/Compliance, P3 Dicrotic)
 * - Macro-Scale Lundberg Waves (A Plateau waves, B oscillations, C waves)
 * - Brain Herniation Syndrome Classification (Uncal, Central, Subfalcine, Tonsillar / Cushing Triad)
 * - Brain Trauma Foundation (BTF) Tiered Protocol (Tier 0 to Tier 3 Interventions)
 * - 6 Evidence-Based Neurocritical Presets
 * 
 * Location: frontend/.gemini/skills/ICPDynamicsEngine.ts
 */

export type HerniationType = 'NONE' | 'UNCAL' | 'CENTRAL' | 'SUBFALCINE' | 'TONSILLAR';

export type ComplianceState = 'NORMAL_COMPLIANCE' | 'COMPENSATED_HIGH_ELASTANCE' | 'DECOMPENSATED_CRITICAL';

export type LundbergWaveType = 'NONE' | 'LUNDBERG_A' | 'LUNDBERG_B' | 'LUNDBERG_C';

export interface TieredInterventions {
  headOfBed30Deg: boolean;            // Tier 0: optimizes jugular venous drainage
  sedationAnalgesia: boolean;         // Tier 0: propofol/fentanyl, blunts metabolic surges
  evdDrainageActive: boolean;         // Tier 1: External Ventricular Drain CSF drainage
  evdDrainedVolumeMl: number;         // CSF volume removed (0 - 30 mL)
  hyperosmolarMannitol: boolean;      // Tier 1: Mannitol 20% (0.5 - 1.0 g/kg)
  hyperosmolarHypertonicSaline: boolean; // Tier 1: 3% Hypertonic Saline (250 mL bolus)
  hyperventilationPaCO2: number;      // Tier 1: PaCO2 target (normal 38-42, hyperventilated 30-35)
  neuromuscularBlockade: boolean;     // Tier 2: paralytic infusion, avoids ventilator dyssynchrony
  moderateHypothermia: boolean;       // Tier 2: 35.0 - 36.0 C targeted temperature management
  barbiturateComa: boolean;          // Tier 3: Pentobarbital EEG burst-suppression
  decompressiveCraniectomy: boolean; // Tier 3: Hemicraniectomy bone flap removal
}

export interface ICPPatientParameters {
  massLesionVolumeMl: number;        // Hematoma / contusion / tumor (0 - 120 mL)
  meanArterialPressureMmHg: number;  // MAP (50 - 160 mmHg)
  paCO2MmHg: number;                 // PaCO2 (20 - 60 mmHg)
  temperatureC: number;              // Core temp (34.0 - 40.0 C)
  baselineICPMmHg: number;           // Resting ICP (normally ~10 mmHg)
  isUnilateralTemporalMass: boolean; // Triggers uncal tentorial herniation
}

export interface ICPComputationResult {
  icpMmHg: number;
  cppMmHg: number;
  complianceState: ComplianceState;
  herniationType: HerniationType;
  isCushingTriadActive: boolean;
  p1Amplitude: number;
  p2Amplitude: number;
  p3Amplitude: number;
  isP2Elevated: boolean; // P2 > P1 indicates brain compliance failure
  pupilRightMm: number;
  pupilLeftMm: number;
  pupilRightReactive: boolean;
  pupilLeftReactive: boolean;
  glasgowComaScale: number;
  activeAlarms: string[];
}

export interface ICPPulseWavePoint {
  timeSec: number;
  pressureMmHg: number;
  component: 'P1' | 'P2' | 'P3' | 'BASELINE';
}

export interface LundbergTrendPoint {
  minute: number;
  icpMmHg: number;
  cppMmHg: number;
  mapMmHg: number;
  waveType: LundbergWaveType;
}

export interface ICPClinicalPreset {
  id: string;
  title: string;
  patientProfile: string;
  diagnosis: string;
  patientParams: ICPPatientParameters;
  interventions: TieredInterventions;
  description: string;
  clinicalGoals: string;
  highYieldPearl: string;
}

/**
 * Calculates Intracranial Pressure & Cerebral Perfusion Pressure
 * Implements non-linear Monro-Kellie Volume-Pressure curve
 */
export function calculateICPDynamics(
  params: ICPPatientParameters,
  interventions: TieredInterventions
): ICPComputationResult {
  const { massLesionVolumeMl, meanArterialPressureMmHg, paCO2MmHg, baselineICPMmHg, isUnilateralTemporalMass } = params;

  // 1. Calculate effective volume addition inside non-expandable cranium
  let effectiveVolumeAddition = massLesionVolumeMl;

  // EVD CSF drainage directly subtracts volume
  if (interventions.evdDrainageActive) {
    effectiveVolumeAddition = Math.max(0, effectiveVolumeAddition - interventions.evdDrainedVolumeMl);
  }

  // Hyperosmolar therapy shrinks brain parenchyma volume by osmotic gradient
  if (interventions.hyperosmolarMannitol) {
    effectiveVolumeAddition = Math.max(0, effectiveVolumeAddition - 14);
  }
  if (interventions.hyperosmolarHypertonicSaline) {
    effectiveVolumeAddition = Math.max(0, effectiveVolumeAddition - 18);
  }

  // 2. Monro-Kellie Volume-Pressure Elastance Curve
  // Initial compensatory buffer capacity: ~55 mL (CSF into spinal subarachnoid, venous collapse)
  const compensatoryBufferMl = 55;
  let rawICP = baselineICPMmHg;

  if (effectiveVolumeAddition <= compensatoryBufferMl) {
    // High compliance phase: modest linear rise
    rawICP += effectiveVolumeAddition * 0.12;
  } else {
    // Exhausted compliance phase: steep exponential surge
    const excessVolume = effectiveVolumeAddition - compensatoryBufferMl;
    const exponentialRise = Math.exp(Math.min(3.8, excessVolume * 0.072)) * 3.4;
    rawICP += (compensatoryBufferMl * 0.12) + exponentialRise;
  }

  // 3. PaCO2 cerebrovascular reactivity (~3% change in cerebral blood flow per 1 mmHg PaCO2)
  const paCO2Delta = (interventions.hyperventilationPaCO2 || paCO2MmHg) - 40;
  rawICP += paCO2Delta * 0.65;

  // 4. Tier 0 Interventions
  if (interventions.headOfBed30Deg) {
    rawICP -= 3.5; // improves jugular venous return
  }
  if (interventions.sedationAnalgesia) {
    rawICP -= 4.0; // blunts pain and cough-induced intrathoracic pressure spikes
  }

  // 5. Tier 2 Interventions
  if (interventions.neuromuscularBlockade) {
    rawICP -= 3.5; // eliminates shivering & patient-ventilator dyssynchrony
  }
  if (interventions.moderateHypothermia) {
    rawICP -= 4.5; // decreases CMRO2 and CBV
  }

  // 6. Tier 3 Interventions
  if (interventions.barbiturateComa) {
    rawICP -= 14.0; // profound suppression of cerebral metabolism & vascular volume
  }
  if (interventions.decompressiveCraniectomy) {
    // Hemicraniectomy converts closed box into open compliant space
    rawICP = Math.min(rawICP * 0.45, rawICP - 20);
  }

  const finalICP = +Math.max(4.0, Math.min(90.0, rawICP)).toFixed(1);

  // 7. Cerebral Perfusion Pressure (CPP = MAP - ICP)
  const cpp = +(meanArterialPressureMmHg - finalICP).toFixed(1);

  // 8. Intracranial Compliance Assessment & P1/P2/P3 Wave Morphology
  let complianceState: ComplianceState = 'NORMAL_COMPLIANCE';
  if (finalICP > 20 && finalICP <= 30) {
    complianceState = 'COMPENSATED_HIGH_ELASTANCE';
  } else if (finalICP > 30) {
    complianceState = 'DECOMPENSATED_CRITICAL';
  }

  // P1 is arterial pulse (amplitude ~10 mmHg above baseline)
  // P2 is tidal brain compliance wave (in normal brain, P2 < P1; in stiff brain, P2 > P1)
  const p1Amplitude = +(finalICP + 6.0).toFixed(1);
  const elastanceFactor = Math.min(2.5, finalICP / 14);
  const p2Amplitude = +(finalICP + (3.5 * elastanceFactor)).toFixed(1);
  const p3Amplitude = +(finalICP + 1.5).toFixed(1);
  const isP2Elevated = p2Amplitude > p1Amplitude;

  // 9. Herniation Syndrome Detection
  let herniationType: HerniationType = 'NONE';
  let pupilRightMm = 3.0;
  let pupilLeftMm = 3.0;
  let pupilRightReactive = true;
  let pupilLeftReactive = true;
  let gcs = 15;

  if (finalICP > 40 || (finalICP > 32 && meanArterialPressureMmHg > 120)) {
    herniationType = 'TONSILLAR';
    pupilRightMm = 6.5;
    pupilLeftMm = 6.5;
    pupilRightReactive = false;
    pupilLeftReactive = false;
    gcs = 3;
  } else if (isUnilateralTemporalMass && (finalICP > 22 || massLesionVolumeMl >= 45)) {
    herniationType = 'UNCAL';
    pupilRightMm = 7.0; // Ipsilateral blown pupil
    pupilLeftMm = 2.5;
    pupilRightReactive = false;
    pupilLeftReactive = true;
    gcs = 6;
  } else if (finalICP > 25) {
    herniationType = 'CENTRAL';
    pupilRightMm = 5.0;
    pupilLeftMm = 5.0;
    pupilRightReactive = false;
    pupilLeftReactive = false;
    gcs = 7;
  } else if (massLesionVolumeMl > 45) {
    herniationType = 'SUBFALCINE';
    pupilRightMm = 3.0;
    pupilLeftMm = 3.0;
    gcs = 11;
  } else {
    gcs = Math.max(8, 15 - Math.floor(finalICP / 3));
  }

  // 10. Cushing Triad (Hypertension, Bradycardia, Irregular Breathing)
  // Triggered when brainstem/medulla is compressed
  const isCushingTriadActive = finalICP >= 35 && meanArterialPressureMmHg >= 115;

  // Active alarms
  const activeAlarms: string[] = [];
  if (finalICP > 22) activeAlarms.push('CRITICAL INTRACRANIAL HYPERTENSION (ICP > 22 mmHg)');
  if (cpp < 60) activeAlarms.push('CEREBRAL ISCHEMIA RISK (CPP < 60 mmHg)');
  if (herniationType !== 'NONE') activeAlarms.push(`IMPENDING / ACTIVE ${herniationType} HERNIATION`);
  if (isCushingTriadActive) activeAlarms.push('CUSHING TRIAD DETECTED (MEDULLARY COMPRESSION)');
  if (isP2Elevated) activeAlarms.push('INTRAVENTRICULAR COMPLIANCE COLLAPSE (P2 > P1)');

  return {
    icpMmHg: finalICP,
    cppMmHg: cpp,
    complianceState,
    herniationType,
    isCushingTriadActive,
    p1Amplitude,
    p2Amplitude,
    p3Amplitude,
    isP2Elevated,
    pupilRightMm,
    pupilLeftMm,
    pupilRightReactive,
    pupilLeftReactive,
    glasgowComaScale: gcs,
    activeAlarms,
  };
}

/**
 * Generates Real-Time ICP Pulse Waveform Points for a Single Cardiac Cycle (0.0 to 0.8 sec)
 */
export function generateICPPulseWaveform(
  icpResult: ICPComputationResult
): ICPPulseWavePoint[] {
  const points: ICPPulseWavePoint[] = [];
  const base = icpResult.icpMmHg;
  const p1Peak = icpResult.p1Amplitude;
  const p2Peak = icpResult.p2Amplitude;
  const p3Peak = icpResult.p3Amplitude;

  // 40 sample points over 0.8s cardiac cycle
  for (let i = 0; i <= 40; i++) {
    const t = +(i * (0.8 / 40)).toFixed(3);
    let p = base;
    let comp: ICPPulseWavePoint['component'] = 'BASELINE';

    // P1 Percussion wave: peak at 0.12s
    const d1 = (t - 0.12) / 0.05;
    const p1Contrib = (p1Peak - base) * Math.exp(-d1 * d1);

    // P2 Tidal wave: peak at 0.28s
    const d2 = (t - 0.28) / 0.07;
    const p2Contrib = (p2Peak - base) * Math.exp(-d2 * d2);

    // P3 Dicrotic wave: peak at 0.44s
    const d3 = (t - 0.44) / 0.06;
    const p3Contrib = (p3Peak - base) * Math.exp(-d3 * d3);

    p += p1Contrib + p2Contrib + p3Contrib;

    if (p1Contrib > p2Contrib && p1Contrib > p3Contrib && p1Contrib > 1.0) comp = 'P1';
    else if (p2Contrib > p1Contrib && p2Contrib > p3Contrib && p2Contrib > 1.0) comp = 'P2';
    else if (p3Contrib > 1.0) comp = 'P3';

    points.push({
      timeSec: t,
      pressureMmHg: +p.toFixed(2),
      component: comp,
    });
  }

  return points;
}

/**
 * Generates Monro-Kellie Volume-Pressure Curve across volume range (0 to 140 mL)
 */
export function generateMonroKellieCurve(
  params: ICPPatientParameters,
  interventions: TieredInterventions
): { volumeMl: number; icpMmHg: number; operatingPoint: boolean }[] {
  const points = [];
  const activeVolume = params.massLesionVolumeMl;

  for (let v = 0; v <= 140; v += 10) {
    const testParams = { ...params, massLesionVolumeMl: v };
    const res = calculateICPDynamics(testParams, interventions);
    points.push({
      volumeMl: v,
      icpMmHg: res.icpMmHg,
      operatingPoint: Math.abs(v - activeVolume) < 6,
    });
  }

  return points;
}

/**
 * Generates 30-Minute Continuous Monitoring Trend with Lundberg Waves
 */
export function generateLundbergTrend(
  params: ICPPatientParameters,
  interventions: TieredInterventions,
  targetWaveType: LundbergWaveType = 'NONE'
): LundbergTrendPoint[] {
  const points: LundbergTrendPoint[] = [];
  const baseResult = calculateICPDynamics(params, interventions);

  for (let minute = 0; minute <= 30; minute++) {
    let icp = baseResult.icpMmHg;
    let wave: LundbergWaveType = 'NONE';

    if (targetWaveType === 'LUNDBERG_A') {
      // Plateau waves: steep jump to 55-80 mmHg between minutes 10 and 22
      if (minute >= 10 && minute <= 22) {
        icp += 44 + Math.sin(minute) * 4;
        wave = 'LUNDBERG_A';
      }
    } else if (targetWaveType === 'LUNDBERG_B') {
      // Rhythmic oscillations at 1 wave per minute (amplitude 15-25 mmHg)
      icp += Math.sin(minute * 1.8) * 12;
      wave = 'LUNDBERG_B';
    } else if (targetWaveType === 'LUNDBERG_C') {
      // Fine rhythmic Traube-Hering oscillations
      icp += Math.sin(minute * 3.5) * 3;
      wave = 'LUNDBERG_C';
    } else {
      // Normal respiratory baseline drift
      icp += Math.sin(minute * 0.4) * 1.2;
    }

    const map = params.meanArterialPressureMmHg;
    const cpp = +(map - icp).toFixed(1);

    points.push({
      minute,
      icpMmHg: +Math.max(4, icp).toFixed(1),
      cppMmHg: cpp,
      mapMmHg: map,
      waveType: wave,
    });
  }

  return points;
}

/**
 * 6 Evidence-Based Neurocritical Care Presets
 */
export const ICP_PRESETS: ICPClinicalPreset[] = [
  {
    id: 'tbi-acute-subdural',
    title: 'Severe TBI with Acute Subdural & Uncal Herniation',
    patientProfile: 'Nathan R. (Age 32, Male, 78 kg)',
    diagnosis: 'Motor Vehicle Crash, GCS 6, Right Acute Subdural Hematoma (65 mL), Midline Shift 9 mm, Ipsilateral Blown Right Pupil (7 mm, Fixed)',
    patientParams: {
      massLesionVolumeMl: 65,
      meanArterialPressureMmHg: 95,
      paCO2MmHg: 40,
      temperatureC: 37.2,
      baselineICPMmHg: 10,
      isUnilateralTemporalMass: true,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: true,
      evdDrainageActive: false,
      evdDrainedVolumeMl: 0,
      hyperosmolarMannitol: false,
      hyperosmolarHypertonicSaline: false,
      hyperventilationPaCO2: 40,
      neuromuscularBlockade: false,
      moderateHypothermia: false,
      barbiturateComa: false,
      decompressiveCraniectomy: false,
    },
    description: 'Acute extra-axial temporal hematoma causing uncal herniation. The uncus of the temporal lobe compresses CN III (blown fixed pupil) and the cerebral peduncle. Exhausted compensatory compliance produces P2 > P1.',
    clinicalGoals: 'Immediate emergent hyperosmolar therapy (3% NaCl bolus), hyperventilation rescue to PaCO2 32 mmHg, and urgent operative craniotomy for surgical clot evacuation.',
    highYieldPearl: 'Uncal herniation classic triad: ipsilateral dilated non-reactive pupil (compression of parasympathetic fibers on CN III), contralateral hemiparesis, and declining consciousness.',
  },
  {
    id: 'sah-hydrocephalus',
    title: 'Aneurysmal SAH with Acute Obstructive Hydrocephalus',
    patientProfile: 'Chloe D. (Age 52, Female, 64 kg)',
    diagnosis: 'Ruptured Anterior Communicating Aneurysm (Hunt-Hess 3, Fisher 3), Intraventricular Hemorrhage, Acute Biventricular Hydrocephalus',
    patientParams: {
      massLesionVolumeMl: 45,
      meanArterialPressureMmHg: 105,
      paCO2MmHg: 38,
      temperatureC: 37.5,
      baselineICPMmHg: 12,
      isUnilateralTemporalMass: false,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: true,
      evdDrainageActive: true,
      evdDrainedVolumeMl: 12,
      hyperosmolarMannitol: false,
      hyperosmolarHypertonicSaline: false,
      hyperventilationPaCO2: 38,
      neuromuscularBlockade: false,
      moderateHypothermia: false,
      barbiturateComa: false,
      decompressiveCraniectomy: false,
    },
    description: 'Blood within the basal cisterns and ventricular foramen blocks CSF outflow, precipitating acute hydrocephalus. Placement of an External Ventricular Drain (EVD) with CSF drainage instantly restores compliance.',
    clinicalGoals: 'Maintain CPP 65-75 mmHg to prevent vasospasm-induced delayed cerebral ischemia (DCI) while titrating EVD drainage against rebleeding risk prior to aneurysm coiling/clipping.',
    highYieldPearl: 'In aneurysmal SAH, excessive reduction of ICP before aneurysm securement increases the transmural pressure across the aneurysm dome, risking catastrophic rebleeding.',
  },
  {
    id: 'lundberg-a-plateau',
    title: 'Exhausted Compliance & Lundberg A Plateau Waves',
    patientProfile: 'Benjamin T. (Age 45, Male, 82 kg)',
    diagnosis: 'Diffuse Axonal Injury (DAI) & Brain Contusions, Baseline ICP 22 mmHg with Periodic Surges to 68 mmHg Lasting 12 Minutes',
    patientParams: {
      massLesionVolumeMl: 58,
      meanArterialPressureMmHg: 92,
      paCO2MmHg: 42,
      temperatureC: 37.8,
      baselineICPMmHg: 12,
      isUnilateralTemporalMass: false,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: true,
      evdDrainageActive: false,
      evdDrainedVolumeMl: 0,
      hyperosmolarMannitol: false,
      hyperosmolarHypertonicSaline: false,
      hyperventilationPaCO2: 42,
      neuromuscularBlockade: false,
      moderateHypothermia: false,
      barbiturateComa: false,
      decompressiveCraniectomy: false,
    },
    description: 'Patient operating at the steep inflection point of the Monro-Kellie curve. Minor increases in cerebral blood volume trigger Lundberg A plateau waves (steep spikes of ICP to 60-80 mmHg with critical reduction in CPP < 40 mmHg).',
    clinicalGoals: 'Abolish plateau waves by escalating to Tier 1-2 therapies (hypertonic saline, neuromuscular blockade, mild hyperventilation) to replenish intracranial reserve.',
    highYieldPearl: 'Lundberg A (plateau) waves reflect critical exhaustion of intracranial spatial buffering and severe cerebral ischemia; they mandate immediate intervention to prevent brain death.',
  },
  {
    id: 'cushing-triad-terminal',
    title: 'Tonsillar Herniation with Cushing Triad',
    patientProfile: 'Victor S. (Age 68, Male, 85 kg)',
    diagnosis: 'Massive Right Middle Cerebral Artery (MCA) Malignant Infarction, Brainstem Compression, Cushing Triad Active',
    patientParams: {
      massLesionVolumeMl: 95,
      meanArterialPressureMmHg: 145, // Extreme reflex hypertension (e.g. 210/110)
      paCO2MmHg: 48,
      temperatureC: 38.6,
      baselineICPMmHg: 12,
      isUnilateralTemporalMass: false,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: false,
      evdDrainageActive: false,
      evdDrainedVolumeMl: 0,
      hyperosmolarMannitol: false,
      hyperosmolarHypertonicSaline: false,
      hyperventilationPaCO2: 48,
      neuromuscularBlockade: false,
      moderateHypothermia: false,
      barbiturateComa: false,
      decompressiveCraniectomy: false,
    },
    description: 'Cerebellar tonsils are herniating downward through the foramen magnum into the cervical spinal canal, compressing the ventrolateral medulla and vasomotor centers.',
    clinicalGoals: 'Recognize the neurogenic Cushing response (hypertension, bradycardia, irregular respirations) as an agonal pre-terminal sign requiring immediate Tier 3 decompressive hemicraniectomy.',
    highYieldPearl: 'Cushing triad represents an endogenous ischemic reflex: medullary ischemia triggers massive sympathetic outflow causing intense systemic vasoconstriction to force blood into the cranium, followed by baroreceptor-mediated bradycardia.',
  },
  {
    id: 'hyperosmolar-evd-response',
    title: 'Hyperosmolar & EVD Titration Response',
    patientProfile: 'Sarah L. (Age 29, Female, 60 kg)',
    diagnosis: 'Closed Head Injury, Diffuse Cerebral Edema, ICP Controlled Post-Tier 1 Therapy',
    patientParams: {
      massLesionVolumeMl: 55,
      meanArterialPressureMmHg: 95,
      paCO2MmHg: 34,
      temperatureC: 36.8,
      baselineICPMmHg: 10,
      isUnilateralTemporalMass: false,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: true,
      evdDrainageActive: true,
      evdDrainedVolumeMl: 10,
      hyperosmolarMannitol: true,
      hyperosmolarHypertonicSaline: true,
      hyperventilationPaCO2: 34,
      neuromuscularBlockade: false,
      moderateHypothermia: false,
      barbiturateComa: false,
      decompressiveCraniectomy: false,
    },
    description: 'Demonstrates successful neurocritical medical management: combination of CSF drainage via EVD and 3% hypertonic saline bolus draws water from the interstitial space, shifting the patient leftward on the Monro-Kellie curve.',
    clinicalGoals: 'Maintain ICP < 20 mmHg, CPP 65-70 mmHg, and restore normal waveform morphology (P1 > P2).',
    highYieldPearl: 'Hypertonic saline (3%) does not cross an intact blood-brain barrier (reflection coefficient sigma = 1.0), generating an intense osmotic gradient that dehydrates brain tissue without the osmotic diuresis and hypotension associated with mannitol.',
  },
  {
    id: 'refractory-tier3-craniectomy',
    title: 'Refractory ICP Requiring Decompressive Craniectomy',
    patientProfile: 'Marcus B. (Age 38, Male, 80 kg)',
    diagnosis: 'Bifrontal Contusions, Intractable Intracranial Hypertension Refractory to Tiers 1-2, Post-Hemicraniectomy',
    patientParams: {
      massLesionVolumeMl: 80,
      meanArterialPressureMmHg: 90,
      paCO2MmHg: 36,
      temperatureC: 36.0,
      baselineICPMmHg: 12,
      isUnilateralTemporalMass: false,
    },
    interventions: {
      headOfBed30Deg: true,
      sedationAnalgesia: true,
      evdDrainageActive: true,
      evdDrainedVolumeMl: 15,
      hyperosmolarMannitol: true,
      hyperosmolarHypertonicSaline: true,
      hyperventilationPaCO2: 34,
      neuromuscularBlockade: true,
      moderateHypothermia: true,
      barbiturateComa: true,
      decompressiveCraniectomy: true,
    },
    description: 'Malignant cerebral edema refractory to medical therapy. Surgical removal of a large fronto-temporo-parietal bone flap (decompressive craniectomy) converts the closed rigid vault into a dynamic compliant space, aborting fatal herniation.',
    clinicalGoals: 'Evaluate post-surgical intracranial elastance normalization, avoid hypotension during barbiturate infusion, and monitor for external herniation or subdural hygromas.',
    highYieldPearl: 'The DECRA and RESCUEicp randomized trials proved decompressive craniectomy dramatically reduces mortality and duration of high ICP in refractory TBI, though with increased rates of severe disability.',
  },
];
