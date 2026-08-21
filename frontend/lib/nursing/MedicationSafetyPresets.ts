export const TEN_RIGHTS_OF_MEDICATION: Array<{ number: number; right: string; clinicalAction: string; verificationQuestion: string }> = [
  { number: 1, right: 'Right Patient', clinicalAction: 'Use 2 identifiers (Name, DOB).', verificationQuestion: 'Is this the correct patient?' },
  { number: 2, right: 'Right Drug', clinicalAction: 'Check label against MAR.', verificationQuestion: 'Is this the correct medication?' },
  { number: 3, right: 'Right Dose', clinicalAction: 'Verify calculation and order.', verificationQuestion: 'Is this the prescribed and safe dose?' },
  { number: 4, right: 'Right Route', clinicalAction: 'Confirm administration path.', verificationQuestion: 'Can this be given via this route?' },
  { number: 5, right: 'Right Time', clinicalAction: 'Check last dose and schedule.', verificationQuestion: 'Is it the correct time for administration?' },
  { number: 6, right: 'Right Documentation', clinicalAction: 'Chart immediately after given.', verificationQuestion: 'Has it been properly documented?' },
  { number: 7, right: 'Right Reason', clinicalAction: 'Ensure med matches diagnosis.', verificationQuestion: 'Why is the patient receiving this?' },
  { number: 8, right: 'Right Response', clinicalAction: 'Monitor for desired effect.', verificationQuestion: 'Did the medication have the intended effect?' },
  { number: 9, right: 'Right to Refuse', clinicalAction: 'Acknowledge patient autonomy.', verificationQuestion: 'Does the patient consent?' },
  { number: 10, right: 'Right Education', clinicalAction: 'Inform patient about drug.', verificationQuestion: 'Does the patient understand what this is for?' }
];

export const PINCH_HIGH_ALERT_MEDS: Array<{ acronym: string; drugClass: string; examples: string[]; highRiskConsequences: string; doubleCheckProtocol: string }> = [
  { acronym: 'P', drugClass: 'Potassium & electrolytes', examples: ['IV Potassium Chloride', 'Magnesium Sulfate'], highRiskConsequences: 'Cardiac arrest, arrhythmias', doubleCheckProtocol: 'Require independent double check by 2 RNs prior to administration.' },
  { acronym: 'I', drugClass: 'Insulin', examples: ['Regular Insulin', 'Aspart', 'Glargine'], highRiskConsequences: 'Severe hypoglycemia, coma', doubleCheckProtocol: 'RN double check for syringe draw and blood glucose level.' },
  { acronym: 'N', drugClass: 'Narcotics & sedatives', examples: ['Morphine', 'Fentanyl', 'Midazolam'], highRiskConsequences: 'Respiratory depression, death', doubleCheckProtocol: 'Double check wasting and PCA pump settings.' },
  { acronym: 'C', drugClass: 'Chemotherapy', examples: ['Methotrexate', 'Doxorubicin'], highRiskConsequences: 'Severe toxicity, extravasation injury', doubleCheckProtocol: 'Chemo certified RN double check required.' },
  { acronym: 'H', drugClass: 'Heparin & anticoagulants', examples: ['IV Heparin', 'Warfarin'], highRiskConsequences: 'Severe bleeding, hemorrhage', doubleCheckProtocol: 'RN double check based on recent aPTT/INR results.' }
];

export const OSCE_SKILL_STATIONS: Array<{ id: string; stationNumber: number; title: string; durationMinutes: number; clinicalScenario: string; checklistItems: Array<{ id: string; step: string; isCritical: boolean; maxScore: number }>; passingScore: number }> = [
  {
    id: 'st1', stationNumber: 1, title: 'High-Alert Med Safety & 10 Rights', durationMinutes: 10, clinicalScenario: 'Administer IV Insulin safely to a diabetic patient.', checklistItems: [
      { id: '1a', step: 'Perform hand hygiene.', isCritical: true, maxScore: 2 },
      { id: '1b', step: 'Verify order and allergies.', isCritical: true, maxScore: 2 },
      { id: '1c', step: 'Execute independent double check.', isCritical: true, maxScore: 2 }
    ], passingScore: 5
  },
  {
    id: 'st2', stationNumber: 2, title: 'Aseptic Tracheostomy Care', durationMinutes: 15, clinicalScenario: 'Perform routine tracheostomy care maintaining sterility.', checklistItems: [
      { id: '2a', step: 'Don sterile gloves.', isCritical: true, maxScore: 2 },
      { id: '2b', step: 'Clean inner cannula.', isCritical: true, maxScore: 2 },
      { id: '2c', step: 'Assess stoma site.', isCritical: false, maxScore: 1 }
    ], passingScore: 4
  },
  {
    id: 'st3', stationNumber: 3, title: 'Foley Catheterization', durationMinutes: 15, clinicalScenario: 'Insert indwelling urinary catheter.', checklistItems: [
      { id: '3a', step: 'Maintain sterile field.', isCritical: true, maxScore: 2 },
      { id: '3b', step: 'Lubricate and insert catheter.', isCritical: true, maxScore: 2 },
      { id: '3c', step: 'Inflate balloon properly.', isCritical: true, maxScore: 2 }
    ], passingScore: 5
  },
  {
    id: 'st4', stationNumber: 4, title: 'Blood Transfusion Protocol', durationMinutes: 10, clinicalScenario: 'Initiate PRBC transfusion.', checklistItems: [
      { id: '4a', step: 'Verify consent and typing.', isCritical: true, maxScore: 2 },
      { id: '4b', step: 'Two RN bed-side check.', isCritical: true, maxScore: 2 },
      { id: '4c', step: 'Obtain baseline vitals.', isCritical: true, maxScore: 2 }
    ], passingScore: 5
  }
];
