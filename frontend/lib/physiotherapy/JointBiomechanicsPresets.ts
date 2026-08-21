export type JointType = 'shoulder' | 'elbow' | 'wrist' | 'hip' | 'knee' | 'ankle' | 'cervical' | 'lumbar';

export interface JointROMNorm {
  joint: JointType;
  movement: string;
  normalMinDeg: number;
  normalMaxDeg: number;
  fulcrumLandmark: string;
  stationaryArmAlignment: string;
  movingArmAlignment: string;
  expectedEndFeel: 'Hard (Bony)' | 'Soft (Tissue Approximation)' | 'Firm (Capsular/Ligamentous)' | 'Empty (Painful)';
  clinicalNotes: string;
}

export const JOINT_ROM_NORMS: JointROMNorm[] = [
  {
    joint: 'shoulder',
    movement: 'Shoulder Flexion',
    normalMinDeg: 0,
    normalMaxDeg: 180,
    fulcrumLandmark: 'Lateral aspect of greater tubercle',
    stationaryArmAlignment: 'Parallel to midaxillary line',
    movingArmAlignment: 'Lateral midline of humerus',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Watch for lumbar extension substitution.'
  },
  {
    joint: 'shoulder',
    movement: 'Shoulder Abduction',
    normalMinDeg: 0,
    normalMaxDeg: 180,
    fulcrumLandmark: 'Anterior aspect of acromion',
    stationaryArmAlignment: 'Parallel to sternum',
    movingArmAlignment: 'Anterior midline of humerus',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Requires external rotation to clear greater tuberosity.'
  },
  {
    joint: 'elbow',
    movement: 'Elbow Flexion',
    normalMinDeg: 0,
    normalMaxDeg: 145,
    fulcrumLandmark: 'Lateral epicondyle of humerus',
    stationaryArmAlignment: 'Lateral midline of humerus',
    movingArmAlignment: 'Lateral midline of radius',
    expectedEndFeel: 'Soft (Tissue Approximation)',
    clinicalNotes: 'End feel may be firm in very thin individuals.'
  },
  {
    joint: 'knee',
    movement: 'Knee Flexion',
    normalMinDeg: 0,
    normalMaxDeg: 135,
    fulcrumLandmark: 'Lateral epicondyle of femur',
    stationaryArmAlignment: 'Lateral midline of femur',
    movingArmAlignment: 'Lateral midline of fibula',
    expectedEndFeel: 'Soft (Tissue Approximation)',
    clinicalNotes: 'Measure with hip flexed to prevent rectus femoris passive insufficiency.'
  },
  {
    joint: 'hip',
    movement: 'Hip Flexion',
    normalMinDeg: 0,
    normalMaxDeg: 120,
    fulcrumLandmark: 'Greater trochanter',
    stationaryArmAlignment: 'Lateral midline of pelvis',
    movingArmAlignment: 'Lateral midline of femur',
    expectedEndFeel: 'Soft (Tissue Approximation)',
    clinicalNotes: 'Measure with knee flexed to prevent hamstring passive insufficiency.'
  },
  {
    joint: 'hip',
    movement: 'Hip Extension',
    normalMinDeg: 0,
    normalMaxDeg: 30,
    fulcrumLandmark: 'Greater trochanter',
    stationaryArmAlignment: 'Lateral midline of pelvis',
    movingArmAlignment: 'Lateral midline of femur',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Stabilize pelvis to prevent anterior tilt.'
  },
  {
    joint: 'ankle',
    movement: 'Ankle Dorsiflexion',
    normalMinDeg: 0,
    normalMaxDeg: 20,
    fulcrumLandmark: 'Lateral malleolus',
    stationaryArmAlignment: 'Lateral midline of fibula',
    movingArmAlignment: 'Parallel to fifth metatarsal',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Measure with knee flexed to isolate soleus.'
  },
  {
    joint: 'ankle',
    movement: 'Ankle Plantarflexion',
    normalMinDeg: 0,
    normalMaxDeg: 50,
    fulcrumLandmark: 'Lateral malleolus',
    stationaryArmAlignment: 'Lateral midline of fibula',
    movingArmAlignment: 'Parallel to fifth metatarsal',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Assess for anterior talofibular ligament laxity if hypermobile.'
  },
  {
    joint: 'cervical',
    movement: 'Cervical Rotation',
    normalMinDeg: 0,
    normalMaxDeg: 80,
    fulcrumLandmark: 'Center of cranial aspect of head',
    stationaryArmAlignment: 'Parallel to acromial line',
    movingArmAlignment: 'Tip of nose',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Ensure trunk remains stationary.'
  },
  {
    joint: 'lumbar',
    movement: 'Lumbar Flexion',
    normalMinDeg: 0,
    normalMaxDeg: 60,
    fulcrumLandmark: 'Over spinous processes',
    stationaryArmAlignment: 'Perpendicular to floor',
    movingArmAlignment: 'Following trunk',
    expectedEndFeel: 'Firm (Capsular/Ligamentous)',
    clinicalNotes: 'Often measured using modified Schober test.'
  }
];

export function assessMobility(joint: JointType, movement: string, measuredDeg: number): { status: 'Hypomobile' | 'Normal' | 'Hypermobile'; deviationDeg: number; interpretation: string } {
  const norm = JOINT_ROM_NORMS.find(n => n.joint === joint && (n.movement.toLowerCase().includes(movement.toLowerCase()) || movement.toLowerCase().includes(n.movement.toLowerCase())));
  if (!norm) {
    return { status: 'Normal', deviationDeg: 0, interpretation: 'Normative data not found.' };
  }
  
  if (measuredDeg < norm.normalMaxDeg - 25) {
    return { status: 'Hypomobile', deviationDeg: norm.normalMaxDeg - measuredDeg, interpretation: 'Range of motion is restricted compared to normal physiological limits.' };
  } else if (measuredDeg > norm.normalMaxDeg + 5) {
    return { status: 'Hypermobile', deviationDeg: measuredDeg - norm.normalMaxDeg, interpretation: 'Range of motion exceeds normal limits, indicating potential laxity or instability.' };
  } else {
    return { status: 'Normal', deviationDeg: 0, interpretation: 'Range of motion is within normal physiological limits.' };
  }
}

export function getJointNorms(joint: JointType): JointROMNorm[] {
  return JOINT_ROM_NORMS.filter(norm => norm.joint === joint);
}
