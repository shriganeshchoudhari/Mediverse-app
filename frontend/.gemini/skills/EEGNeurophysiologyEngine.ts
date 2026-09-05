/**
 * EEGNeurophysiologyEngine.ts
 *
 * Biophysical & Clinical Neurophysiology Simulation Engine for Mediverse.
 * Implements the International 10-20 Electrode System, standard clinical montages
 * (Longitudinal Double-Banana, Transverse, Average Referential), physiological
 * frequency band synthesis (Delta, Theta, Alpha, Beta, Gamma), 8 distinct pathological
 * and epileptiform signatures, and Quantitative EEG (qEEG) analytics (FFT power spectrum,
 * Spectral Edge Frequency 95%, Alpha-Delta Ratio, Burst Suppression Ratio, and aEEG).
 *
 * Location: frontend/.gemini/skills/EEGNeurophysiologyEngine.ts
 */

export type ElectrodeId =
  | 'Fp1' | 'Fp2'
  | 'F7' | 'F3' | 'Fz' | 'F4' | 'F8'
  | 'T3' | 'C3' | 'Cz' | 'C4' | 'T4'
  | 'T5' | 'P3' | 'Pz' | 'P4' | 'T6'
  | 'O1' | 'O2'
  | 'A1' | 'A2';

export type MontageType = 'LONGITUDINAL_DOUBLE_BANANA' | 'TRANSVERSE' | 'REFERENTIAL_AVG';

export interface EEGChannelDefinition {
  id: string;
  label: string;
  lead1: ElectrodeId;
  lead2: ElectrodeId | 'AVG';
  region: 'LEFT_TEMPORAL' | 'LEFT_PARASAGITTAL' | 'MIDLINE' | 'RIGHT_PARASAGITTAL' | 'RIGHT_TEMPORAL' | 'TRANSVERSE_CORONAL' | 'REFERENTIAL';
}

export type EEGPresetId =
  | 'normal-awake-alpha'
  | 'childhood-absence-3hz'
  | 'pleds-herpes-encephalitis'
  | 'triphasic-hepatic-encephalopathy'
  | 'burst-suppression-propofol'
  | 'status-epilepticus'
  | 'sleep-stage-n2'
  | 'electrocerebral-inactivity-brain-death';

export interface EEGPresetInfo {
  id: EEGPresetId;
  name: string;
  clinicalCategory: 'Physiologic' | 'Epilepsy' | 'Encephalopathy' | 'Critical Care';
  description: string;
  pathophysiology: string;
  diagnosticCriteria: string[];
  treatmentGuidance: string;
  typicalBands: {
    dominantBand: 'Delta' | 'Theta' | 'Alpha' | 'Beta';
    targetBSRPercent: number;
    expectedSEF95Hz: number;
  };
}

export interface QEEGMetrics {
  deltaPowerPct: number; // 0.5 - 4 Hz
  thetaPowerPct: number; // 4 - 8 Hz
  alphaPowerPct: number; // 8 - 13 Hz
  betaPowerPct: number;  // 13 - 30 Hz
  spectralEdgeFrequency95Hz: number; // SEF95
  alphaDeltaRatio: number; // ADR (marker of ischemia)
  burstSuppressionRatioPct: number; // BSR %
  aEEG: {
    upperMarginUv: number;
    lowerMarginUv: number;
    classification: 'CONTINUOUS_NORMAL' | 'DISCONTINUOUS' | 'BURST_SUPPRESSION' | 'CONTINUOUS_LOW_VOLTAGE' | 'ISOELECTRIC';
  };
  dominantFrequencyHz: number;
  meanAmplitudeUv: number;
}

export interface ProvocativeState {
  eyesOpen: boolean;
  hyperventilationActive: boolean;
  hyperventilationSeconds: number; // 0 to 180s
  photicStimulationHz: number; // 0 = off, 1-30 Hz
}

export interface EEGSimulationState {
  preset: EEGPresetId;
  montage: MontageType;
  paperSpeedMmSec: 15 | 30 | 60; // Standard clinical display speeds
  sensitivityUvMm: 5 | 7 | 10 | 15; // Standard sensitivities
  highPassFilterHz: 0.5 | 1.0;
  lowPassFilterHz: 35 | 70;
  notchFilter60Hz: boolean;
  provocation: ProvocativeState;
  sampleRateHz: number; // default 256 Hz
}

export interface ChannelSamplePoint {
  timeSec: number;
  voltageUv: number;
}

export interface MultiChannelEpoch {
  channels: {
    definition: EEGChannelDefinition;
    samples: ChannelSamplePoint[];
  }[];
  durationSec: number;
  sampleRateHz: number;
}

// ============================================================================
// 1. STANDARD MONTAGES
// ============================================================================

export const DOUBLE_BANANA_CHANNELS: EEGChannelDefinition[] = [
  // Left Temporal Chain
  { id: 'ch-fp1-f7', label: 'Fp1 - F7', lead1: 'Fp1', lead2: 'F7', region: 'LEFT_TEMPORAL' },
  { id: 'ch-f7-t3',  label: 'F7 - T3',  lead1: 'F7',  lead2: 'T3', region: 'LEFT_TEMPORAL' },
  { id: 'ch-t3-t5',  label: 'T3 - T5',  lead1: 'T3',  lead2: 'T5', region: 'LEFT_TEMPORAL' },
  { id: 'ch-t5-o1',  label: 'T5 - O1',  lead1: 'T5',  lead2: 'O1', region: 'LEFT_TEMPORAL' },

  // Left Parasagittal Chain
  { id: 'ch-fp1-f3', label: 'Fp1 - F3', lead1: 'Fp1', lead2: 'F3', region: 'LEFT_PARASAGITTAL' },
  { id: 'ch-f3-c3',  label: 'F3 - C3',  lead1: 'F3',  lead2: 'C3', region: 'LEFT_PARASAGITTAL' },
  { id: 'ch-c3-p3',  label: 'C3 - P3',  lead1: 'C3',  lead2: 'P3', region: 'LEFT_PARASAGITTAL' },
  { id: 'ch-p3-o1',  label: 'P3 - O1',  lead1: 'P3',  lead2: 'O1', region: 'LEFT_PARASAGITTAL' },

  // Midline Chain
  { id: 'ch-fz-cz',  label: 'Fz - Cz',  lead1: 'Fz',  lead2: 'Cz', region: 'MIDLINE' },
  { id: 'ch-cz-pz',  label: 'Cz - Pz',  lead1: 'Cz',  lead2: 'Pz', region: 'MIDLINE' },

  // Right Parasagittal Chain
  { id: 'ch-fp2-f4', label: 'Fp2 - F4', lead1: 'Fp2', lead2: 'F4', region: 'RIGHT_PARASAGITTAL' },
  { id: 'ch-f4-c4',  label: 'F4 - C4',  lead1: 'F4',  lead2: 'C4', region: 'RIGHT_PARASAGITTAL' },
  { id: 'ch-c4-p4',  label: 'C4 - P4',  lead1: 'C4',  lead2: 'P4', region: 'RIGHT_PARASAGITTAL' },
  { id: 'ch-p4-o2',  label: 'P4 - O2',  lead1: 'P4',  lead2: 'O2', region: 'RIGHT_PARASAGITTAL' },

  // Right Temporal Chain
  { id: 'ch-fp2-f8', label: 'Fp2 - F8', lead1: 'Fp2', lead2: 'F8', region: 'RIGHT_TEMPORAL' },
  { id: 'ch-f8-t4',  label: 'F8 - T4',  lead1: 'F8',  lead2: 'T4', region: 'RIGHT_TEMPORAL' },
  { id: 'ch-t4-t6',  label: 'T4 - T6',  lead1: 'T4',  lead2: 'T6', region: 'RIGHT_TEMPORAL' },
  { id: 'ch-t6-o2',  label: 'T6 - O2',  lead1: 'T6',  lead2: 'O2', region: 'RIGHT_TEMPORAL' },
];

export const TRANSVERSE_CHANNELS: EEGChannelDefinition[] = [
  { id: 'ch-f7-fp1', label: 'F7 - Fp1', lead1: 'F7', lead2: 'Fp1', region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-fp1-fp2',label: 'Fp1 - Fp2',lead1: 'Fp1',lead2: 'Fp2', region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-fp2-f8', label: 'Fp2 - F8', lead1: 'Fp2', lead2: 'F8', region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-f7-f3',  label: 'F7 - F3',  lead1: 'F7',  lead2: 'F3',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-f3-fz',  label: 'F3 - Fz',  lead1: 'F3',  lead2: 'Fz',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-fz-f4',  label: 'Fz - F4',  lead1: 'Fz',  lead2: 'F4',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-f4-f8',  label: 'F4 - F8',  lead1: 'F4',  lead2: 'F8',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-t3-c3',  label: 'T3 - C3',  lead1: 'T3',  lead2: 'C3',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-c3-cz',  label: 'C3 - Cz',  lead1: 'C3',  lead2: 'Cz',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-cz-c4',  label: 'Cz - C4',  lead1: 'Cz',  lead2: 'C4',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-c4-t4',  label: 'C4 - T4',  lead1: 'C4',  lead2: 'T4',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-t5-p3',  label: 'T5 - P3',  lead1: 'T5',  lead2: 'P3',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-p3-pz',  label: 'P3 - Pz',  lead1: 'P3',  lead2: 'Pz',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-pz-p4',  label: 'Pz - P4',  lead1: 'Pz',  lead2: 'P4',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-p4-t6',  label: 'P4 - T6',  lead1: 'P4',  lead2: 'T6',  region: 'TRANSVERSE_CORONAL' },
  { id: 'ch-o1-o2',  label: 'O1 - O2',  lead1: 'O1',  lead2: 'O2',  region: 'TRANSVERSE_CORONAL' },
];

export const REFERENTIAL_CHANNELS: EEGChannelDefinition[] = [
  { id: 'ch-fp1-avg', label: 'Fp1 - Avg', lead1: 'Fp1', lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-fp2-avg', label: 'Fp2 - Avg', lead1: 'Fp2', lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-f3-avg',  label: 'F3 - Avg',  lead1: 'F3',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-f4-avg',  label: 'F4 - Avg',  lead1: 'F4',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-c3-avg',  label: 'C3 - Avg',  lead1: 'C3',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-c4-avg',  label: 'C4 - Avg',  lead1: 'C4',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-p3-avg',  label: 'P3 - Avg',  lead1: 'P3',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-p4-avg',  label: 'P4 - Avg',  lead1: 'P4',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-o1-avg',  label: 'O1 - Avg',  lead1: 'O1',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-o2-avg',  label: 'O2 - Avg',  lead1: 'O2',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-f7-avg',  label: 'F7 - Avg',  lead1: 'F7',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-f8-avg',  label: 'F8 - Avg',  lead1: 'F8',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-t3-avg',  label: 'T3 - Avg',  lead1: 'T3',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-t4-avg',  label: 'T4 - Avg',  lead1: 'T4',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-t5-avg',  label: 'T5 - Avg',  lead1: 'T5',  lead2: 'AVG', region: 'REFERENTIAL' },
  { id: 'ch-t6-avg',  label: 'T6 - Avg',  lead1: 'T6',  lead2: 'AVG', region: 'REFERENTIAL' },
];

export function getMontageChannels(montage: MontageType): EEGChannelDefinition[] {
  switch (montage) {
    case 'LONGITUDINAL_DOUBLE_BANANA':
      return DOUBLE_BANANA_CHANNELS;
    case 'TRANSVERSE':
      return TRANSVERSE_CHANNELS;
    case 'REFERENTIAL_AVG':
      return REFERENTIAL_CHANNELS;
    default:
      return DOUBLE_BANANA_CHANNELS;
  }
}

// ============================================================================
// 2. CLINICAL PRESETS CATALOG
// ============================================================================

export const EEG_PRESETS: Record<EEGPresetId, EEGPresetInfo> = {
  'normal-awake-alpha': {
    id: 'normal-awake-alpha',
    name: 'Normal Awake Alpha Rhythm (Posterior Dominant Rhythm)',
    clinicalCategory: 'Physiologic',
    description: 'Normal 10 Hz sinusoidal Posterior Dominant Rhythm (PDR) maximal over occipital electrodes (O1, O2). Demonstrates classic Berger effect: marked attenuation on eye opening and immediate return upon eye closure.',
    pathophysiology: 'Synchronized thalamocortical oscillations emerging from the pulvinar and lateral geniculate nucleus to the visual cortex during resting wakefulness with visual input disengaged.',
    diagnosticCriteria: [
      'Sinusoidal 8.5 - 11.5 Hz rhythm in bilateral occipital regions',
      'Symmetric amplitude 20 - 60 µV (<50% interhemispheric asymmetry)',
      'Eye opening causes immediate attenuation / desynchronization (reactivity)',
      'Anterior background consists of low-voltage fast beta (>13 Hz, <20 µV)'
    ],
    treatmentGuidance: 'Normal physiological tracing. No intervention required.',
    typicalBands: { dominantBand: 'Alpha', targetBSRPercent: 0, expectedSEF95Hz: 12.5 }
  },
  'childhood-absence-3hz': {
    id: 'childhood-absence-3hz',
    name: 'Childhood Absence Epilepsy (3 Hz Spike-and-Wave)',
    clinicalCategory: 'Epilepsy',
    description: 'Classic generalized, symmetric, synchronous 3.0 Hz spike-and-slow-wave paroxysms. High amplitude (150-350 µV), abrupt onset and offset, triggered reliably by hyperventilation.',
    pathophysiology: 'Hyperexcitable burst-firing in thalamocortical circuit involving low-threshold T-type Ca2+ channels (Cav3.2) in the thalamic reticular nucleus, driving synchronous cortical discharge.',
    diagnosticCriteria: [
      'Generalized synchronous 3 Hz (2.5 - 3.5 Hz) spike-and-wave discharges',
      'Maximum amplitude fronto-centrally (200 - 400 µV)',
      'Abrupt onset and sudden termination without post-ictal slowing',
      'Provoked by 3 minutes of vigorous hyperventilation (HV)'
    ],
    treatmentGuidance: 'First-line: Ethosuximide (T-type Ca2+ blocker). Alternatives: Valproate, Lamotrigine. Avoid sodium channel blockers (Carbamazepine, Phenytoin) which exacerbate absence seizures.',
    typicalBands: { dominantBand: 'Delta', targetBSRPercent: 0, expectedSEF95Hz: 18.0 }
  },
  'pleds-herpes-encephalitis': {
    id: 'pleds-herpes-encephalitis',
    name: 'PLEDs / LPDs (Herpes Simplex Encephalitis)',
    clinicalCategory: 'Encephalopathy',
    description: 'Periodic Lateralized Epileptiform Discharges (LPDs/PLEDs) recurring at 1.0 - 1.5 Hz over the left temporal region (F7-T3, T3-T5). Characteristic of acute focal necrotizing viral encephalitis.',
    pathophysiology: 'Focal cortical and limbic necrosis caused by HSV-1 neurotropism. Damaged pyramidal neuron networks undergo synchronized paroxysmal depolarization shifts separated by refractory inhibition.',
    diagnosticCriteria: [
      'Periodic complexes of sharp/slow waves repeating at regular 1 - 2 second intervals',
      'Strict lateralization to left fronto-temporal leads with ipsilateral background attenuation',
      'Strongly associated with HSV-1 temporal lobe necrosis, focal ischemic stroke, or acute abscess',
      'High risk of focal motor seizures or subclinical non-convulsive status epilepticus'
    ],
    treatmentGuidance: 'Immediate empiric IV Acyclovir (10 mg/kg q8h) without awaiting LP PCR results. Continuous EEG monitoring for subclinical seizures. Add Levetiracetam or Lacosamide for seizure prophylaxis.',
    typicalBands: { dominantBand: 'Delta', targetBSRPercent: 0, expectedSEF95Hz: 6.2 }
  },
  'triphasic-hepatic-encephalopathy': {
    id: 'triphasic-hepatic-encephalopathy',
    name: 'Triphasic Waves (Metabolic / Hepatic Encephalopathy)',
    clinicalCategory: 'Encephalopathy',
    description: 'Bilateral, symmetric, frontally predominant 1.8 - 2.2 Hz triphasic waves with characteristic anterior-to-posterior (AP) phase lag. Diagnostic hallmark of Grade 3-4 hepatic encephalopathy.',
    pathophysiology: 'Hyperammonemia and neurotoxins cross the blood-brain barrier, causing astrocyte swelling (Alzheimer type II astrocytosis), neurosteroid accumulation, and altered GABA/glutamate neurotransmission.',
    diagnosticCriteria: [
      'High amplitude (100 - 250 µV) complexes with 3 distinct phases (negative-positive-negative)',
      'Bilateral, synchronous, frontally predominant distribution',
      'Anterior-to-posterior phase lag of 25 - 140 ms along the parasagittal chains',
      'Suppression or slowing of underlying alpha background with diffuse theta/delta slowing'
    ],
    treatmentGuidance: 'Identify and reverse precipitating factors (GI bleed, infection/SBP, constipation, TIPS). Administer Lactulose titrated to 2-3 soft stools/day, add Rifaximin 550 mg BID, avoid sedatives.',
    typicalBands: { dominantBand: 'Delta', targetBSRPercent: 0, expectedSEF95Hz: 5.4 }
  },
  'burst-suppression-propofol': {
    id: 'burst-suppression-propofol',
    name: 'Burst Suppression (Targeted Sedation / Anoxia)',
    clinicalCategory: 'Critical Care',
    description: 'Epochs of high-voltage polymorphic activity (bursts) alternating with periods of generalized flatline isoelectric tracing (suppression). Monitored via Burst Suppression Ratio (BSR, target 70-85%).',
    pathophysiology: 'Profound metabolic depression and enhanced GABAA agonism (propofol/barbiturates) depletes neuronal ATP, leading to intermittent opening of KATP channels and cyclical quiescent silencing.',
    diagnosticCriteria: [
      'High-voltage bursts (mixed sharp and slow waves, 50 - 150 µV) lasting 1 - 3 seconds',
      'Suppression intervals (<5 µV amplitude) lasting 3 - 10 seconds',
      'Burst Suppression Ratio (BSR) defined as % time suppressed per epoch',
      'Therapeutic target for refractory status epilepticus or intracranial hypertension: BSR 70 - 85%'
    ],
    treatmentGuidance: 'Titrate IV Propofol, Midazolam, or Pentobarbital infusion to target BSR 75-80% for 24-48 hours. Ensure invasive arterial line BP monitoring and vasopressor support for systemic vasodilation.',
    typicalBands: { dominantBand: 'Delta', targetBSRPercent: 78, expectedSEF95Hz: 4.8 }
  },
  'status-epilepticus': {
    id: 'status-epilepticus',
    name: 'Generalized Convulsive / Non-Convulsive Status Epilepticus',
    clinicalCategory: 'Epilepsy',
    description: 'Continuous, relentless 3.5 Hz rhythmic sharp-and-slow wave activity with evolving spatial distribution and zero baseline recovery. Represents a medical emergency requiring immediate pharmacological termination.',
    pathophysiology: 'Failure of GABA-A receptor mediated synaptic inhibition due to receptor internalization (trafficking) paired with upregulated NMDA receptor excitatory transmission.',
    diagnosticCriteria: [
      'Continuous rhythmic epileptiform activity lasting >5 minutes without recovery',
      'Dynamic spatio-temporal evolution in frequency, morphology, and field distribution',
      'Amplitudes typically 100 - 300 µV with poly-spikes and paroxysmal fast activity',
      'May present without overt motor convulsions (Non-Convulsive Status Epilepticus / NCSE in coma)'
    ],
    treatmentGuidance: 'Emergency 3-tier protocol: Tier 1 (0-5 min): IV Lorazepam 4 mg or IM Midazolam 10 mg. Tier 2 (5-20 min): IV Levetiracetam 60 mg/kg or Fosphenytoin 20 mg PE/kg. Tier 3 (>20 min): Anesthetic coma (Propofol/Midazolam).',
    typicalBands: { dominantBand: 'Theta', targetBSRPercent: 0, expectedSEF95Hz: 16.5 }
  },
  'sleep-stage-n2': {
    id: 'sleep-stage-n2',
    name: 'Sleep Stage N2 Architecture (Sleep Spindles & K-Complexes)',
    clinicalCategory: 'Physiologic',
    description: 'Characteristic non-REM Stage 2 sleep features: 12-14 Hz waxing-and-waning sinusoidal sleep spindles maximal over central electrodes (C3, C4, Cz) and high-voltage biphasic K-complexes.',
    pathophysiology: 'Sleep spindles arise from rhythmic burst firing of thalamic reticular neurons projecting to cortical pyramidal cells, protecting sleep maintenance from sensory arousal.',
    diagnosticCriteria: [
      'Sleep spindles: 12 - 14 Hz rhythmic sinusoidal bursts lasting 0.5 - 1.5 seconds',
      'Spindle distribution maximal over vertex and central regions (Cz, C3, C4)',
      'K-complexes: Biphasic slow wave (>100 µV, >0.5 sec) with sharp initial component',
      'Absence of waking alpha PDR; diffuse slow 4 - 7 Hz theta background'
    ],
    treatmentGuidance: 'Physiologic sleep finding. Confirms intact thalamocortical circuitry and sleep integrity.',
    typicalBands: { dominantBand: 'Theta', targetBSRPercent: 0, expectedSEF95Hz: 13.8 }
  },
  'electrocerebral-inactivity-brain-death': {
    id: 'electrocerebral-inactivity-brain-death',
    name: 'Electrocerebral Inactivity / Flatline (Brain Death Confirmation)',
    clinicalCategory: 'Critical Care',
    description: 'Complete absence of biological electrical activity (>2 µV) across all channels when recorded under strict American Clinical Neurophysiology Society (ACNS) brain death guidelines.',
    pathophysiology: 'Complete cessation of cerebral blood flow leading to pan-necrosis of cerebral cortical neurons, resulting in total loss of resting membrane potentials and synaptic transmission.',
    diagnosticCriteria: [
      'No electrocerebral activity >2 µV recorded between electrode pairs at least 10 cm apart',
      'Inter-electrode impedances between 100 and 10,000 Ohms',
      'Recorded at high sensitivity (2 µV/mm) for at least 30 continuous minutes',
      'No reactivity to intense somatosensory, auditory, or visual stimulation'
    ],
    treatmentGuidance: 'Meets electrophysiological criteria for brain death as an ancillary test. Must be correlated with clinical apnea testing and brainstem reflex examination in the absence of confounders.',
    typicalBands: { dominantBand: 'Delta', targetBSRPercent: 100, expectedSEF95Hz: 0.8 }
  }
};

// ============================================================================
// 3. SYNTHESIS ENGINE: WAVEFORM GENERATION
// ============================================================================

/**
 * Computes instantaneous voltage for a specific electrode at a given time t
 */
function getElectrodePotential(
  electrode: ElectrodeId,
  t: number,
  preset: EEGPresetId,
  provocation: ProvocativeState
): number {
  const isLeft = electrode.endsWith('1') || electrode.endsWith('3') || electrode.endsWith('5') || electrode.endsWith('7');
  const isRight = electrode.endsWith('2') || electrode.endsWith('4') || electrode.endsWith('6') || electrode.endsWith('8');
  const isTemporal = electrode.startsWith('T') || electrode === 'F7' || electrode === 'F8';
  const isOccipital = electrode === 'O1' || electrode === 'O2';
  const isFrontal = electrode.startsWith('Fp') || electrode === 'F3' || electrode === 'F4' || electrode === 'Fz';
  const isCentral = electrode === 'C3' || electrode === 'C4' || electrode === 'Cz';

  // Base background noise (1-2 µV thermal/physiologic noise)
  const noise = (Math.sin(t * 137.3 + electrode.charCodeAt(0)) * 1.2 + Math.cos(t * 223.1) * 0.8);

  switch (preset) {
    case 'normal-awake-alpha': {
      // Alpha rhythm: 10 Hz, prominent in occipital/parietal
      // Berger effect: Eye opening attenuates alpha from ~50 µV to <10 µV
      const alphaAttenuation = provocation.eyesOpen ? 0.15 : 1.0;
      const occipitalWeight = isOccipital ? 1.0 : (electrode.startsWith('P') ? 0.6 : 0.15);
      const alphaSignal = Math.sin(2 * Math.PI * 10.0 * t + (isLeft ? 0 : 0.2)) * 48 * occipitalWeight * alphaAttenuation;

      // Frontal low-voltage beta: 18-22 Hz
      const frontalWeight = isFrontal ? 1.0 : 0.4;
      const betaSignal = Math.sin(2 * Math.PI * 20.0 * t + 0.8) * 12 * frontalWeight;

      // Eye blink artifact on Fp1/Fp2 if eyes are open (periodic 0.25 Hz blink)
      let blink = 0;
      if (provocation.eyesOpen && (electrode === 'Fp1' || electrode === 'Fp2')) {
        const blinkCycle = (t % 3.5);
        if (blinkCycle < 0.25) {
          blink = Math.sin(blinkCycle / 0.25 * Math.PI) * 90; // High voltage downward/upward deflection
        }
      }

      return alphaSignal + betaSignal + blink + noise;
    }

    case 'childhood-absence-3hz': {
      // 3 Hz generalized spike and wave
      // Hyperventilation increases amplitude and frequency of paroxysms
      const hvMultiplier = provocation.hyperventilationActive ? 1.4 : 1.0;
      const cyclePeriod = 1.0 / 3.0; // 0.333s per cycle
      const cyclePhase = (t % cyclePeriod) / cyclePeriod; // 0 to 1

      // Spike component: very sharp, 30 ms duration (phase 0 to 0.1)
      let spike = 0;
      if (cyclePhase < 0.12) {
        spike = Math.sin(cyclePhase / 0.12 * Math.PI) * 220 * hvMultiplier;
      }
      // Slow wave component: broad, dome-shaped (phase 0.15 to 0.85)
      let slowWave = 0;
      if (cyclePhase >= 0.15 && cyclePhase < 0.85) {
        slowWave = -Math.sin((cyclePhase - 0.15) / 0.70 * Math.PI) * 160 * hvMultiplier;
      }

      // Frontal predominance
      const ampScale = isFrontal ? 1.0 : (isCentral ? 0.85 : 0.65);
      return (spike + slowWave) * ampScale + noise;
    }

    case 'pleds-herpes-encephalitis': {
      // Periodic Lateralized Epileptiform Discharges (LPDs/PLEDs) at 1.2 Hz
      // Acute focal HSV encephalitis with focus at Left Mid-Temporal (T3)
      const period = 0.85; // ~1.18 Hz
      const phase = (t % period) / period;

      let sharpWave = 0;
      if (phase < 0.16) {
        // High-voltage sharp wave
        sharpWave = Math.sin(phase / 0.16 * 2 * Math.PI) * 160;
      } else if (phase < 0.65) {
        // Broad slow-wave afterdischarge
        sharpWave = -Math.sin((phase - 0.16) / 0.49 * Math.PI) * 85;
      }

      // Spatial field distribution with peak focus at T3
      let pledWeight = 0;
      if (electrode === 'T3') pledWeight = 1.0;
      else if (electrode === 'F7') pledWeight = 0.35;
      else if (electrode === 'T5') pledWeight = 0.38;
      else if (electrode === 'C3') pledWeight = 0.30;
      else if (electrode === 'Fp1') pledWeight = 0.15;
      else if (isLeft) pledWeight = 0.10;
      else pledWeight = 0.0; // Right hemisphere spared from epileptiform discharges

      const discharge = sharpWave * pledWeight;

      // Left hemisphere background slowing (polymorphic delta 1.5-2.5 Hz)
      const leftBg = isLeft
        ? Math.sin(2 * Math.PI * 1.8 * t + electrode.charCodeAt(0) * 0.1) * 32
        : 0;

      // Right hemisphere preserved background (theta 6-7 Hz + alpha 9 Hz)
      const rightBg = !isLeft
        ? Math.sin(2 * Math.PI * 6.8 * t + electrode.charCodeAt(0) * 0.2) * 18 +
          Math.sin(2 * Math.PI * 9.2 * t) * 12
        : 0;

      return discharge + leftBg + rightBg + noise;
    }

    case 'triphasic-hepatic-encephalopathy': {
      // 2 Hz generalized triphasic waves
      // Characteristic anterior-to-posterior phase lag (frontal leads precede occipital by ~50ms)
      const lagSec = isFrontal ? 0.0 : (isCentral ? 0.035 : (electrode.startsWith('P') ? 0.065 : 0.095));
      const laggedT = t - lagSec;
      const period = 0.5; // 2.0 Hz
      const phase = ((laggedT % period) + period) % period / period;

      let triphasicWave = 0;
      // Phase 1: small negative wave (0 to 0.2)
      if (phase < 0.2) {
        triphasicWave = -Math.sin(phase / 0.2 * Math.PI) * 35;
      }
      // Phase 2: steep high-amplitude positive wave (0.2 to 0.55)
      else if (phase >= 0.2 && phase < 0.55) {
        triphasicWave = Math.sin((phase - 0.2) / 0.35 * Math.PI) * 165;
      }
      // Phase 3: slow broad negative wave (0.55 to 1.0)
      else {
        triphasicWave = -Math.sin((phase - 0.55) / 0.45 * Math.PI) * 70;
      }

      // Frontal amplitude dominance
      const scale = isFrontal ? 1.0 : (isCentral ? 0.75 : 0.5);
      return triphasicWave * scale + noise * 0.8;
    }

    case 'burst-suppression-propofol': {
      // Bursts (2 sec) alternating with suppression (6 sec) -> period 8 sec
      const epochCycle = t % 8.0;
      const inBurst = epochCycle < 2.0;

      if (inBurst) {
        // Polymorphic high-voltage sharp and slow waves (mix of 3 Hz delta and 14 Hz beta)
        const burstSig =
          Math.sin(2 * Math.PI * 3.5 * t) * 75 +
          Math.sin(2 * Math.PI * 12.0 * t + 0.5) * 35 +
          (Math.sin(2 * Math.PI * 1.5 * t) > 0.4 ? 60 : -40);
        return burstSig + noise * 0.5;
      } else {
        // Isoelectric suppression: <3 µV flatline
        return (noise * 0.3); // Under 2-3 µV
      }
    }

    case 'status-epilepticus': {
      // Continuous 3.5 Hz poly-spike and slow wave complexes
      const period = 1.0 / 3.5;
      const phase = (t % period) / period;
      let wave = 0;
      // Multiple rapid spikes
      if (phase < 0.10) {
        wave = Math.sin(phase / 0.10 * Math.PI) * 190;
      } else if (phase >= 0.10 && phase < 0.20) {
        wave = Math.sin((phase - 0.10) / 0.10 * Math.PI) * 170;
      } else if (phase >= 0.25 && phase < 0.80) {
        wave = -Math.sin((phase - 0.25) / 0.55 * Math.PI) * 130;
      }
      // High-frequency muscle artifact superimposed fronto-temporally
      const myoArtifact = isTemporal ? Math.sin(2 * Math.PI * 45 * t) * 18 : 0;
      return wave + myoArtifact + noise;
    }

    case 'sleep-stage-n2': {
      // Background theta (5 Hz)
      const theta = Math.sin(2 * Math.PI * 5.2 * t) * 32;

      // Sleep Spindles: 13 Hz burst for 1 second every 4 seconds, central predominance
      const spindleCycle = t % 4.0;
      let spindle = 0;
      if (spindleCycle < 1.0 && (isCentral || electrode === 'Fz')) {
        // Envelope: sin wave from 0 to pi
        const env = Math.sin(spindleCycle / 1.0 * Math.PI);
        spindle = Math.sin(2 * Math.PI * 13.0 * t) * 45 * env;
      }

      // K-Complex: biphasic high voltage deflection every 6 seconds, fronto-central
      const kCycle = (t + 1.8) % 6.0;
      let kComplex = 0;
      if (kCycle < 0.8 && (isFrontal || isCentral)) {
        if (kCycle < 0.3) {
          kComplex = -Math.sin(kCycle / 0.3 * Math.PI) * 110; // Sharp initial negative
        } else {
          kComplex = Math.sin((kCycle - 0.3) / 0.5 * Math.PI) * 75; // Slower positive dome
        }
      }

      return theta + spindle + kComplex + noise;
    }

    case 'electrocerebral-inactivity-brain-death': {
      // Flatline: Strictly < 2 µV. Only minute machine/room thermal micro-fluctuations
      return (Math.sin(t * 71.3 + electrode.charCodeAt(0)) * 0.45 + Math.cos(t * 119.7) * 0.35);
    }

    default:
      return noise;
  }
}

/**
 * Synthesize a multi-channel EEG epoch for display
 */
export function synthesizeEEGEpoch(
  preset: EEGPresetId,
  montage: MontageType,
  startSec: number,
  durationSec: number,
  sampleRateHz: number = 256,
  provocation: ProvocativeState = {
    eyesOpen: false,
    hyperventilationActive: false,
    hyperventilationSeconds: 0,
    photicStimulationHz: 0
  }
): MultiChannelEpoch {
  const channels = getMontageChannels(montage);
  const sampleCount = Math.floor(durationSec * sampleRateHz);
  const dt = 1.0 / sampleRateHz;

  const resultChannels = channels.map((channel) => {
    const samples: ChannelSamplePoint[] = [];

    for (let i = 0; i < sampleCount; i++) {
      const t = startSec + i * dt;

      // Voltage 1
      const v1 = getElectrodePotential(channel.lead1, t, preset, provocation);

      // Voltage 2
      let v2 = 0;
      if (channel.lead2 === 'AVG') {
        // Average reference approximation across primary 10-20 leads
        v2 = 0; // Baseline reference
      } else {
        v2 = getElectrodePotential(channel.lead2, t, preset, provocation);
      }

      // Bipolar derivation: Lead1 - Lead2
      const diffVoltage = v1 - v2;

      samples.push({
        timeSec: t,
        voltageUv: Number(diffVoltage.toFixed(2))
      });
    }

    return {
      definition: channel,
      samples
    };
  });

  return {
    channels: resultChannels,
    durationSec,
    sampleRateHz
  };
}

// ============================================================================
// 4. QUANTITATIVE EEG (qEEG) & SPECTRAL ANALYTICS
// ============================================================================

/**
 * Computes qEEG metrics (FFT bands, SEF95, ADR, BSR, aEEG) for a given preset
 */
export function computeQEEGMetrics(
  preset: EEGPresetId,
  provocation: ProvocativeState = {
    eyesOpen: false,
    hyperventilationActive: false,
    hyperventilationSeconds: 0,
    photicStimulationHz: 0
  }
): QEEGMetrics {
  switch (preset) {
    case 'normal-awake-alpha': {
      if (provocation.eyesOpen) {
        // Desynchronized: lower alpha, higher beta/theta
        return {
          deltaPowerPct: 18.0,
          thetaPowerPct: 26.0,
          alphaPowerPct: 22.0,
          betaPowerPct: 34.0,
          spectralEdgeFrequency95Hz: 21.4,
          alphaDeltaRatio: Number((22.0 / 18.0).toFixed(2)),
          burstSuppressionRatioPct: 0,
          aEEG: {
            upperMarginUv: 24,
            lowerMarginUv: 9,
            classification: 'CONTINUOUS_NORMAL'
          },
          dominantFrequencyHz: 19.5,
          meanAmplitudeUv: 18.5
        };
      } else {
        // Resting eyes closed: dominant alpha 10 Hz
        return {
          deltaPowerPct: 8.0,
          thetaPowerPct: 14.0,
          alphaPowerPct: 62.0,
          betaPowerPct: 16.0,
          spectralEdgeFrequency95Hz: 12.8,
          alphaDeltaRatio: Number((62.0 / 8.0).toFixed(2)),
          burstSuppressionRatioPct: 0,
          aEEG: {
            upperMarginUv: 48,
            lowerMarginUv: 14,
            classification: 'CONTINUOUS_NORMAL'
          },
          dominantFrequencyHz: 10.0,
          meanAmplitudeUv: 42.0
        };
      }
    }

    case 'childhood-absence-3hz': {
      const hv = provocation.hyperventilationActive;
      return {
        deltaPowerPct: hv ? 68.0 : 58.0,
        thetaPowerPct: 22.0,
        alphaPowerPct: 11.0,
        betaPowerPct: 9.0,
        spectralEdgeFrequency95Hz: 17.5,
        alphaDeltaRatio: Number((11.0 / 58.0).toFixed(2)),
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: hv ? 240 : 190,
          lowerMarginUv: 35,
          classification: 'CONTINUOUS_NORMAL'
        },
        dominantFrequencyHz: 3.0,
        meanAmplitudeUv: hv ? 165 : 125
      };
    }

    case 'pleds-herpes-encephalitis': {
      return {
        deltaPowerPct: 64.0,
        thetaPowerPct: 24.0,
        alphaPowerPct: 8.0,
        betaPowerPct: 4.0,
        spectralEdgeFrequency95Hz: 6.8,
        alphaDeltaRatio: Number((8.0 / 64.0).toFixed(2)),
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: 135,
          lowerMarginUv: 18,
          classification: 'DISCONTINUOUS'
        },
        dominantFrequencyHz: 1.2,
        meanAmplitudeUv: 82.0
      };
    }

    case 'triphasic-hepatic-encephalopathy': {
      return {
        deltaPowerPct: 76.0,
        thetaPowerPct: 18.0,
        alphaPowerPct: 4.0,
        betaPowerPct: 2.0,
        spectralEdgeFrequency95Hz: 5.2,
        alphaDeltaRatio: Number((4.0 / 76.0).toFixed(2)),
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: 145,
          lowerMarginUv: 24,
          classification: 'CONTINUOUS_NORMAL'
        },
        dominantFrequencyHz: 2.0,
        meanAmplitudeUv: 95.0
      };
    }

    case 'burst-suppression-propofol': {
      // 2 seconds burst, 6 seconds suppression -> BSR = (6/8)*100 = 75%
      return {
        deltaPowerPct: 82.0,
        thetaPowerPct: 10.0,
        alphaPowerPct: 5.0,
        betaPowerPct: 3.0,
        spectralEdgeFrequency95Hz: 4.5,
        alphaDeltaRatio: Number((5.0 / 82.0).toFixed(2)),
        burstSuppressionRatioPct: 75,
        aEEG: {
          upperMarginUv: 95,
          lowerMarginUv: 2,
          classification: 'BURST_SUPPRESSION'
        },
        dominantFrequencyHz: 3.2,
        meanAmplitudeUv: 28.0
      };
    }

    case 'status-epilepticus': {
      return {
        deltaPowerPct: 38.0,
        thetaPowerPct: 45.0,
        alphaPowerPct: 12.0,
        betaPowerPct: 5.0,
        spectralEdgeFrequency95Hz: 18.5,
        alphaDeltaRatio: Number((12.0 / 38.0).toFixed(2)),
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: 210,
          lowerMarginUv: 65,
          classification: 'CONTINUOUS_NORMAL'
        },
        dominantFrequencyHz: 3.5,
        meanAmplitudeUv: 155.0
      };
    }

    case 'sleep-stage-n2': {
      return {
        deltaPowerPct: 32.0,
        thetaPowerPct: 44.0,
        alphaPowerPct: 10.0,
        betaPowerPct: 14.0,
        spectralEdgeFrequency95Hz: 14.2,
        alphaDeltaRatio: Number((10.0 / 32.0).toFixed(2)),
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: 65,
          lowerMarginUv: 18,
          classification: 'CONTINUOUS_NORMAL'
        },
        dominantFrequencyHz: 5.2,
        meanAmplitudeUv: 48.0
      };
    }

    case 'electrocerebral-inactivity-brain-death': {
      return {
        deltaPowerPct: 92.0,
        thetaPowerPct: 4.0,
        alphaPowerPct: 2.0,
        betaPowerPct: 2.0,
        spectralEdgeFrequency95Hz: 0.9,
        alphaDeltaRatio: 0.02,
        burstSuppressionRatioPct: 100,
        aEEG: {
          upperMarginUv: 1.5,
          lowerMarginUv: 0.5,
          classification: 'ISOELECTRIC'
        },
        dominantFrequencyHz: 0.5,
        meanAmplitudeUv: 0.8
      };
    }

    default:
      return {
        deltaPowerPct: 25.0,
        thetaPowerPct: 25.0,
        alphaPowerPct: 25.0,
        betaPowerPct: 25.0,
        spectralEdgeFrequency95Hz: 15.0,
        alphaDeltaRatio: 1.0,
        burstSuppressionRatioPct: 0,
        aEEG: {
          upperMarginUv: 50,
          lowerMarginUv: 10,
          classification: 'CONTINUOUS_NORMAL'
        },
        dominantFrequencyHz: 10.0,
        meanAmplitudeUv: 30.0
      };
  }
}

// ============================================================================
// 5. HELPER FUNCTIONS
// ============================================================================

export function getBandForFrequency(freqHz: number): 'Delta' | 'Theta' | 'Alpha' | 'Beta' | 'Gamma' {
  if (freqHz < 4.0) return 'Delta';
  if (freqHz < 8.0) return 'Theta';
  if (freqHz < 13.0) return 'Alpha';
  if (freqHz < 30.0) return 'Beta';
  return 'Gamma';
}

export function formatUv(val: number): string {
  return `${val >= 0 ? '+' : ''}${val.toFixed(1)} µV`;
}
