export interface SpecialTest {
  id: string;
  name: string;
  joint: 'Knee' | 'Shoulder' | 'Hip' | 'Spine' | 'Elbow/Wrist';
  targetPathology: string;
  patientPosition: string;
  examinerTechnique: string;
  positiveIndicator: string;
  sensitivity: number;
  specificity: number;
  clinicalPearl: string;
}

export const SPECIAL_TESTS_REGISTRY: SpecialTest[] = [
  {
    id: 'lachman',
    name: 'Lachman Test',
    joint: 'Knee',
    targetPathology: 'Anterior Cruciate Ligament (ACL) tear',
    patientPosition: 'Supine with knee flexed to 20-30 degrees',
    examinerTechnique: 'Stabilize femur, apply anterior translation to tibia',
    positiveIndicator: 'Excessive anterior translation lacking a firm endpoint',
    sensitivity: 85,
    specificity: 94,
    clinicalPearl: 'Most valid test for acute ACL tears.'
  },
  {
    id: 'mcmurray',
    name: 'McMurray Test',
    joint: 'Knee',
    targetPathology: 'Meniscal tear',
    patientPosition: 'Supine with hip and knee maximally flexed',
    examinerTechnique: 'Externally rotate tibia for medial meniscus, internally rotate for lateral, while extending knee',
    positiveIndicator: 'Clicking, catching, or pain at the joint line',
    sensitivity: 51,
    specificity: 90,
    clinicalPearl: 'High specificity means a positive test strongly rules in a meniscal tear.'
  },
  {
    id: 'anterior_drawer_knee',
    name: 'Anterior Drawer Knee',
    joint: 'Knee',
    targetPathology: 'ACL tear',
    patientPosition: 'Supine with hip flexed 45 deg, knee flexed 90 deg',
    examinerTechnique: 'Apply anterior force to proximal tibia',
    positiveIndicator: 'Excessive anterior translation >6mm',
    sensitivity: 62,
    specificity: 88,
    clinicalPearl: 'Often false negative in acute settings due to hemarthrosis and guarding.'
  },
  {
    id: 'pivot_shift',
    name: 'Pivot Shift',
    joint: 'Knee',
    targetPathology: 'ACL tear / Anterolateral rotary instability',
    patientPosition: 'Supine',
    examinerTechnique: 'Internal rotation of tibia, valgus stress, slowly flex knee',
    positiveIndicator: 'Subluxated tibia reduces with a clunk at 20-30 deg flexion',
    sensitivity: 24,
    specificity: 98,
    clinicalPearl: 'Difficult to perform on a conscious patient due to muscle guarding.'
  },
  {
    id: 'hawkins_kennedy',
    name: 'Hawkins-Kennedy',
    joint: 'Shoulder',
    targetPathology: 'Subacromial Impingement',
    patientPosition: 'Sitting or standing',
    examinerTechnique: 'Flex shoulder to 90, flex elbow to 90, passively internally rotate shoulder',
    positiveIndicator: 'Pain in subacromial space',
    sensitivity: 79,
    specificity: 59,
    clinicalPearl: 'Compresses supraspinatus tendon against coracoacromial ligament.'
  },
  {
    id: 'neer',
    name: 'Neer Impingement',
    joint: 'Shoulder',
    targetPathology: 'Subacromial Impingement',
    patientPosition: 'Sitting or standing',
    examinerTechnique: 'Scapula stabilized, shoulder passively elevated in scapular plane with internal rotation',
    positiveIndicator: 'Pain in anterior-lateral shoulder',
    sensitivity: 79,
    specificity: 53,
    clinicalPearl: 'Jamming greater tuberosity against anteroinferior acromion.'
  },
  {
    id: 'empty_can',
    name: 'Empty Can / Jobe',
    joint: 'Shoulder',
    targetPathology: 'Supraspinatus tear or tendinopathy',
    patientPosition: 'Standing',
    examinerTechnique: '90 deg elevation in scapular plane, full internal rotation, resist downward force',
    positiveIndicator: 'Pain or weakness compared to contralateral side',
    sensitivity: 74,
    specificity: 30,
    clinicalPearl: 'Full Can test may be equally sensitive but more comfortable for patients.'
  },
  {
    id: 'speed_test',
    name: 'Speed Test',
    joint: 'Shoulder',
    targetPathology: 'Biceps tendinopathy / SLAP lesion',
    patientPosition: 'Standing',
    examinerTechnique: 'Resist shoulder flexion with elbow extended and forearm supinated',
    positiveIndicator: 'Pain in bicipital groove',
    sensitivity: 54,
    specificity: 81,
    clinicalPearl: 'Can also indicate anterior superior labral tear.'
  },
  {
    id: 'yergason',
    name: 'Yergason Test',
    joint: 'Shoulder',
    targetPathology: 'Biceps tendinopathy / SLAP lesion / Transverse humeral ligament tear',
    patientPosition: 'Sitting with elbow flexed 90 deg',
    examinerTechnique: 'Resist forearm supination and shoulder external rotation',
    positiveIndicator: 'Pain in bicipital groove or snapping of tendon',
    sensitivity: 43,
    specificity: 79,
    clinicalPearl: 'Primarily tests stability of the long head of biceps in the bicipital groove.'
  },
  {
    id: 'phalen',
    name: 'Phalen Test',
    joint: 'Elbow/Wrist',
    targetPathology: 'Carpal Tunnel Syndrome',
    patientPosition: 'Sitting or standing',
    examinerTechnique: 'Maximal passive wrist flexion for 60 seconds',
    positiveIndicator: 'Numbness or tingling in median nerve distribution',
    sensitivity: 68,
    specificity: 73,
    clinicalPearl: 'Reverse Phalen (prayer stretch) can also be used.'
  },
  {
    id: 'finkelstein',
    name: 'Finkelstein Test',
    joint: 'Elbow/Wrist',
    targetPathology: 'De Quervain tenosynovitis',
    patientPosition: 'Sitting',
    examinerTechnique: 'Patient makes fist over thumb, examiner passively ulnarly deviates wrist',
    positiveIndicator: 'Sharp pain over first extensor compartment (abductor pollicis longus and extensor pollicis brevis)',
    sensitivity: 81,
    specificity: 50,
    clinicalPearl: 'Often positive in postpartum women due to lifting mechanics.'
  },
  {
    id: 'faber',
    name: 'FABER / Patrick',
    joint: 'Hip',
    targetPathology: 'Hip joint pathology or Sacroiliac joint dysfunction',
    patientPosition: 'Supine',
    examinerTechnique: 'Flex, Abduct, Externally Rotate test leg so ankle rests above opposite knee. Apply overpressure to knee.',
    positiveIndicator: 'Pain in groin (hip) or posterior pelvis (SI joint)',
    sensitivity: 60,
    specificity: 18,
    clinicalPearl: 'Location of pain dictates interpretation (anterior = hip, posterior = SIJ).'
  },
  {
    id: 'ober',
    name: 'Ober Test',
    joint: 'Hip',
    targetPathology: 'IT Band / Tensor Fasciae Latae tightness',
    patientPosition: 'Side-lying, test leg up',
    examinerTechnique: 'Passively abduct and extend hip with knee flexed, then allow leg to drop into adduction',
    positiveIndicator: 'Inability of the leg to drop below horizontal',
    sensitivity: 40,
    specificity: 80,
    clinicalPearl: 'Ensure pelvis is stabilized to prevent posterior tilt.'
  },
  {
    id: 'thomas',
    name: 'Thomas Test',
    joint: 'Hip',
    targetPathology: 'Hip flexor tightness',
    patientPosition: 'Supine on edge of table',
    examinerTechnique: 'Bring both knees to chest, let test leg drop to table',
    positiveIndicator: 'Test thigh rises off table (iliopsoas) or knee extends (rectus femoris)',
    sensitivity: 89,
    specificity: 92,
    clinicalPearl: 'Modified Thomas test allows assessment of multiple structures based on leg position.'
  },
  {
    id: 'slr',
    name: 'Straight Leg Raise / Lasegue',
    joint: 'Spine',
    targetPathology: 'Lumbar radiculopathy (Sciatica)',
    patientPosition: 'Supine',
    examinerTechnique: 'Passively elevate leg with knee extended',
    positiveIndicator: 'Radiating pain down the leg at 35-70 degrees of flexion',
    sensitivity: 91,
    specificity: 26,
    clinicalPearl: 'Add ankle dorsiflexion (Bragard sign) to further sensitize nerve.'
  },
  {
    id: 'spurling',
    name: 'Spurling Test',
    joint: 'Spine',
    targetPathology: 'Cervical radiculopathy',
    patientPosition: 'Sitting',
    examinerTechnique: 'Extend and laterally flex neck towards painful side, apply axial compression',
    positiveIndicator: 'Radiating pain down the arm in a dermatomal pattern',
    sensitivity: 50,
    specificity: 88,
    clinicalPearl: 'High specificity makes it good for confirming cervical radiculopathy.'
  },
  {
    id: 'roos',
    name: 'Roos Test',
    joint: 'Spine',
    targetPathology: 'Thoracic Outlet Syndrome',
    patientPosition: 'Sitting',
    examinerTechnique: 'Shoulders abducted 90, externally rotated, elbows flexed 90. Open and close hands for 3 mins',
    positiveIndicator: 'Ischemic pain, heaviness, profound weakness, or numbness in hand/arm',
    sensitivity: 84,
    specificity: 30,
    clinicalPearl: 'Also known as the Elevated Arm Stress Test (EAST).'
  }
];

export function getTestsByJoint(joint: string): SpecialTest[] {
  return SPECIAL_TESTS_REGISTRY.filter(test => test.joint.toLowerCase() === joint.toLowerCase());
}
