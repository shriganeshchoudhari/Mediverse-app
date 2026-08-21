export interface BrunnstromStage {
  stage: number;
  name: string;
  description: string;
  clinicalFeatures: string[];
  therapeuticGoals: string[];
}

export const BRUNNSTROM_STAGES: BrunnstromStage[] = [
  {
    stage: 1,
    name: 'Stage 1 Flaccidity',
    description: 'Period immediately following the acute episode.',
    clinicalFeatures: ['No voluntary movement', 'Flaccidity', 'No reflexes elicited'],
    therapeuticGoals: ['Prevent contractures', 'Proper positioning', 'Passive ROM']
  },
  {
    stage: 2,
    name: 'Stage 2 Synergies Appear',
    description: 'Basic limb synergies or some of their components may appear as associated reactions.',
    clinicalFeatures: ['Spasticity begins to develop', 'Minimal voluntary movement within synergy'],
    therapeuticGoals: ['Facilitate voluntary movement', 'Manage spasticity']
  },
  {
    stage: 3,
    name: 'Stage 3 Voluntary Synergies',
    description: 'Patient gains voluntary control of the movement synergies.',
    clinicalFeatures: ['Spasticity reaches its peak', 'Semi-voluntary movement within basic synergy patterns'],
    therapeuticGoals: ['Encourage movement out of synergy', 'Maintain ROM']
  },
  {
    stage: 4,
    name: 'Stage 4 Out-of-Synergy Movement',
    description: 'Some movement combinations that do not follow the paths of either synergy are mastered.',
    clinicalFeatures: ['Spasticity begins to decline', 'Increasing voluntary control'],
    therapeuticGoals: ['Promote isolated movements', 'Improve motor control']
  },
  {
    stage: 5,
    name: 'Stage 5 Complex Synergies',
    description: 'If progress continues, more difficult movement combinations are learned.',
    clinicalFeatures: ['Basic synergies lose their dominance', 'Spasticity continues to decrease'],
    therapeuticGoals: ['Fine motor control', 'Functional tasks combining complex movements']
  },
  {
    stage: 6,
    name: 'Stage 6 Isolated Joint Movement',
    description: 'Spasticity disappears; individual joint movements become possible.',
    clinicalFeatures: ['Near normal coordination', 'Isolated joint movements free of synergy'],
    therapeuticGoals: ['Refine coordination', 'Return to premorbid functional levels']
  }
];

export interface PNFPattern {
  id: string;
  extremity: 'Upper' | 'Lower';
  pattern: 'D1 Flexion' | 'D1 Extension' | 'D2 Flexion' | 'D2 Extension';
  functionalRelevance: string;
  componentMovements: {
    shoulderOrHip: string;
    elbowOrKnee: string;
    wristOrAnkle: string;
    fingersOrToes: string;
  };
  cueWords: string;
}

export const PNF_PATTERNS: PNFPattern[] = [
  {
    id: 'ue_d1_flex',
    extremity: 'Upper',
    pattern: 'D1 Flexion',
    functionalRelevance: 'Eating, brushing teeth on opposite side, reaching for seatbelt',
    componentMovements: {
      shoulderOrHip: 'Flexion, Adduction, External Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Flexion, Radial Deviation',
      fingersOrToes: 'Flexion'
    },
    cueWords: 'Squeeze my hand, turn and pull up and across your face.'
  },
  {
    id: 'ue_d1_ext',
    extremity: 'Upper',
    pattern: 'D1 Extension',
    functionalRelevance: 'Pushing out of a chair, reaching back to put arm in sleeve',
    componentMovements: {
      shoulderOrHip: 'Extension, Abduction, Internal Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Extension, Ulnar Deviation',
      fingersOrToes: 'Extension'
    },
    cueWords: 'Open your hand, turn and push down and away.'
  },
  {
    id: 'ue_d2_flex',
    extremity: 'Upper',
    pattern: 'D2 Flexion',
    functionalRelevance: 'Reaching up for a seatbelt, pulling on a shirt',
    componentMovements: {
      shoulderOrHip: 'Flexion, Abduction, External Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Extension, Radial Deviation',
      fingersOrToes: 'Extension'
    },
    cueWords: 'Open your hand, turn and lift your arm up and out.'
  },
  {
    id: 'ue_d2_ext',
    extremity: 'Upper',
    pattern: 'D2 Extension',
    functionalRelevance: 'Tucking in shirt, reaching across body to unbuckle seatbelt',
    componentMovements: {
      shoulderOrHip: 'Extension, Adduction, Internal Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Flexion, Ulnar Deviation',
      fingersOrToes: 'Flexion'
    },
    cueWords: 'Squeeze my hand, turn and pull down and across.'
  },
  {
    id: 'le_d1_flex',
    extremity: 'Lower',
    pattern: 'D1 Flexion',
    functionalRelevance: 'Putting on shoes/socks, crossing legs',
    componentMovements: {
      shoulderOrHip: 'Flexion, Adduction, External Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Dorsiflexion, Inversion',
      fingersOrToes: 'Extension'
    },
    cueWords: 'Pull your foot up, turn and pull your leg up and across.'
  },
  {
    id: 'le_d1_ext',
    extremity: 'Lower',
    pattern: 'D1 Extension',
    functionalRelevance: 'Pushing off during gait, standing up from sitting',
    componentMovements: {
      shoulderOrHip: 'Extension, Abduction, Internal Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Plantarflexion, Eversion',
      fingersOrToes: 'Flexion'
    },
    cueWords: 'Push your foot down, turn and push your leg down and out.'
  },
  {
    id: 'le_d2_flex',
    extremity: 'Lower',
    pattern: 'D2 Flexion',
    functionalRelevance: 'Stepping into a bathtub, clearing an obstacle',
    componentMovements: {
      shoulderOrHip: 'Flexion, Abduction, Internal Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Dorsiflexion, Eversion',
      fingersOrToes: 'Extension'
    },
    cueWords: 'Pull your foot up, turn and lift your leg up and out.'
  },
  {
    id: 'le_d2_ext',
    extremity: 'Lower',
    pattern: 'D2 Extension',
    functionalRelevance: 'Rolling in bed, planting foot during gait',
    componentMovements: {
      shoulderOrHip: 'Extension, Adduction, External Rotation',
      elbowOrKnee: 'Flexion or Extension',
      wristOrAnkle: 'Plantarflexion, Inversion',
      fingersOrToes: 'Flexion'
    },
    cueWords: 'Push your foot down, turn and push your leg down and in.'
  }
];

export interface ModifiedAshworthScore {
  score: string;
  numericValue: number;
  toneDescription: string;
  clinicalSignificance: string;
}

export const MODIFIED_ASHWORTH_SCALE: ModifiedAshworthScore[] = [
  {
    score: '0',
    numericValue: 0,
    toneDescription: 'No increase in muscle tone',
    clinicalSignificance: 'Normal muscle tone.'
  },
  {
    score: '1',
    numericValue: 1,
    toneDescription: 'Slight increase in muscle tone, manifested by a catch and release or by minimal resistance at the end of the ROM',
    clinicalSignificance: 'Mild spasticity.'
  },
  {
    score: '1+',
    numericValue: 1.5,
    toneDescription: 'Slight increase in muscle tone, manifested by a catch, followed by minimal resistance throughout the remainder (less than half) of the ROM',
    clinicalSignificance: 'Mild-moderate spasticity.'
  },
  {
    score: '2',
    numericValue: 2,
    toneDescription: 'More marked increase in muscle tone through most of the ROM, but affected part(s) easily moved',
    clinicalSignificance: 'Moderate spasticity.'
  },
  {
    score: '3',
    numericValue: 3,
    toneDescription: 'Considerable increase in muscle tone, passive movement difficult',
    clinicalSignificance: 'Severe spasticity, impacting functional movement.'
  },
  {
    score: '4',
    numericValue: 4,
    toneDescription: 'Affected part(s) rigid in flexion or extension',
    clinicalSignificance: 'Profound spasticity, high risk of contractures.'
  }
];
