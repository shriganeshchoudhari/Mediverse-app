export interface GaitPhase {
  id: string;
  name: string;
  percentOfCycle: { start: number; end: number };
  task: 'Weight Acceptance' | 'Single Limb Support' | 'Limb Advancement';
  hipAngleDeg: number;
  kneeAngleDeg: number;
  ankleAngleDeg: number;
  activeMuscles: string[];
  criticalEvent: string;
}

export const RANCHO_GAIT_PHASES: GaitPhase[] = [
  {
    id: 'initial_contact',
    name: 'Initial Contact',
    percentOfCycle: { start: 0, end: 2 },
    task: 'Weight Acceptance',
    hipAngleDeg: 20,
    kneeAngleDeg: 5,
    ankleAngleDeg: 0,
    activeMuscles: ['Tibialis Anterior', 'Quadriceps', 'Gluteus Maximus', 'Hamstrings'],
    criticalEvent: 'Heel first contact'
  },
  {
    id: 'loading_response',
    name: 'Loading Response',
    percentOfCycle: { start: 2, end: 12 },
    task: 'Weight Acceptance',
    hipAngleDeg: 20,
    kneeAngleDeg: 15,
    ankleAngleDeg: -5,
    activeMuscles: ['Quadriceps', 'Gluteus Maximus', 'Pretibial muscles'],
    criticalEvent: 'Hip stability, controlled knee flexion and ankle plantarflexion'
  },
  {
    id: 'mid_stance',
    name: 'Mid Stance',
    percentOfCycle: { start: 12, end: 31 },
    task: 'Single Limb Support',
    hipAngleDeg: 0,
    kneeAngleDeg: 5,
    ankleAngleDeg: 5,
    activeMuscles: ['Gastrocnemius', 'Soleus', 'Gluteus Medius'],
    criticalEvent: 'Controlled tibial advancement'
  },
  {
    id: 'terminal_stance',
    name: 'Terminal Stance',
    percentOfCycle: { start: 31, end: 50 },
    task: 'Single Limb Support',
    hipAngleDeg: -20,
    kneeAngleDeg: 5,
    ankleAngleDeg: 10,
    activeMuscles: ['Gastrocnemius', 'Soleus'],
    criticalEvent: 'Controlled ankle dorsiflexion with heel rise'
  },
  {
    id: 'pre_swing',
    name: 'Pre-Swing',
    percentOfCycle: { start: 50, end: 62 },
    task: 'Limb Advancement',
    hipAngleDeg: -10,
    kneeAngleDeg: 40,
    ankleAngleDeg: -15,
    activeMuscles: ['Iliopsoas', 'Rectus Femoris'],
    criticalEvent: 'Passive knee flexion to 40 degrees, ankle plantarflexion'
  },
  {
    id: 'initial_swing',
    name: 'Initial Swing',
    percentOfCycle: { start: 62, end: 75 },
    task: 'Limb Advancement',
    hipAngleDeg: 15,
    kneeAngleDeg: 60,
    ankleAngleDeg: -5,
    activeMuscles: ['Iliopsoas', 'Tibialis Anterior', 'Hamstrings'],
    criticalEvent: 'Maximum knee flexion to 60 degrees for foot clearance'
  },
  {
    id: 'mid_swing',
    name: 'Mid Swing',
    percentOfCycle: { start: 75, end: 87 },
    task: 'Limb Advancement',
    hipAngleDeg: 25,
    kneeAngleDeg: 25,
    ankleAngleDeg: 0,
    activeMuscles: ['Tibialis Anterior', 'Hamstrings'],
    criticalEvent: 'Maximum hip flexion to 25 degrees, ankle dorsiflexion to 0 degrees'
  },
  {
    id: 'terminal_swing',
    name: 'Terminal Swing',
    percentOfCycle: { start: 87, end: 100 },
    task: 'Limb Advancement',
    hipAngleDeg: 20,
    kneeAngleDeg: 5,
    ankleAngleDeg: 0,
    activeMuscles: ['Quadriceps', 'Hamstrings', 'Tibialis Anterior'],
    criticalEvent: 'Knee extension to neutral for step length'
  }
];

export interface PathologicalGait {
  id: string;
  name: string;
  primaryEtiology: string;
  kinematicDeviations: string[];
  compensatoryMechanisms: string[];
  rehabilitationFocus: string[];
}

export const PATHOLOGICAL_GAITS: PathologicalGait[] = [
  {
    id: 'trendelenburg',
    name: 'Trendelenburg Gait',
    primaryEtiology: 'Gluteus Medius weakness',
    kinematicDeviations: ['Contralateral pelvic drop during single limb support'],
    compensatoryMechanisms: ['Lateral trunk lean over stance leg'],
    rehabilitationFocus: ['Hip abductor strengthening', 'Core stabilization']
  },
  {
    id: 'hemiplegic',
    name: 'Hemiplegic Circumduction',
    primaryEtiology: 'Upper motor neuron lesion (Stroke)',
    kinematicDeviations: ['Inability to flex hip/knee', 'Ankle plantarflexion/inversion'],
    compensatoryMechanisms: ['Hip hiking', 'Circumduction of the leg during swing phase'],
    rehabilitationFocus: ['Tone management', 'Motor control training', 'Ankle-foot orthosis (AFO)']
  },
  {
    id: 'steppage',
    name: 'Steppage Gait / Foot Drop',
    primaryEtiology: 'Deep fibular nerve palsy / L4-L5 radiculopathy',
    kinematicDeviations: ['Lack of active ankle dorsiflexion'],
    compensatoryMechanisms: ['Exaggerated hip and knee flexion during swing phase'],
    rehabilitationFocus: ['Ankle dorsiflexor strengthening', 'AFO prescription', 'Gait training']
  },
  {
    id: 'ataxic',
    name: 'Ataxic Cerebellar Gait',
    primaryEtiology: 'Cerebellar dysfunction',
    kinematicDeviations: ['Unsteady, staggering gait', 'Variable step length/width'],
    compensatoryMechanisms: ['Wide base of support', 'Arms held away from body'],
    rehabilitationFocus: ['Balance training', 'Core stability', 'Use of assistive device']
  },
  {
    id: 'parkinsonian',
    name: 'Parkinsonian Festinating Gait',
    primaryEtiology: 'Basal ganglia dysfunction (Parkinson\'s Disease)',
    kinematicDeviations: ['Short, shuffling steps', 'Loss of arm swing', 'Flexed posture'],
    compensatoryMechanisms: ['Festination (involuntary acceleration) to catch center of mass'],
    rehabilitationFocus: ['Visual/auditory cueing', 'Large amplitude movements (LSVT BIG)', 'Postural correction']
  },
  {
    id: 'antalgic',
    name: 'Antalgic Gait',
    primaryEtiology: 'Pain in weight-bearing structures',
    kinematicDeviations: ['Decreased stance time on affected limb', 'Decreased swing time on sound limb'],
    compensatoryMechanisms: ['Limping', 'Trunk lean towards painful side (if hip) or away (if knee/ankle)'],
    rehabilitationFocus: ['Pain management', 'Joint mobilization', 'Assistive device to unweight']
  }
];
