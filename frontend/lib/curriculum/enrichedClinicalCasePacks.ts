/**
 * enrichedClinicalCasePacks.ts
 * High-Yield Multi-Domain Clinical Case Scenarios with Diagnostic Panels & Protocols
 */

export interface EnrichedClinicalCase {
  id: string;
  domain: string;
  domainTitle: string;
  patientDemographics: string;
  chiefComplaint: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    oxygenSaturation: string;
  };
  historyOfPresentIllness: string;
  physicalExamination: string[];
  diagnosticWorkup: {
    labInvestigations: { test: string; result: string; referenceRange: string; isAbnormal: boolean }[];
    imagingResults: string;
  };
  differentialDiagnosisRanked: {
    rank: number;
    diagnosis: string;
    supportingEvidence: string;
    refutingEvidence: string;
  }[];
  definitiveDiagnosis: string;
  managementProtocol: string[];
  clinicalPearls: string[];
}

export const ENRICHED_CASE_PACKS: Record<string, EnrichedClinicalCase> = {
  // 1. ALLOPATHIC MBBS
  'case-mbbs-01': {
    id: 'case-mbbs-01',
    domain: 'ALLOPATHIC_MBBS',
    domainTitle: 'Allopathic Medicine (MBBS)',
    patientDemographics: '58-year-old male, chronic smoker (30 pack-years), Type 2 Diabetes.',
    chiefComplaint: 'Severe retrosternal chest pain radiating to left arm and jaw for 2 hours.',
    vitals: {
      bloodPressure: '88/54 mmHg',
      heartRate: '112 bpm (Sinus tachycardia)',
      respiratoryRate: '24 breaths/min',
      temperature: '37.0 °C (98.6 °F)',
      oxygenSaturation: '93% on room air',
    },
    historyOfPresentIllness: 'Sudden onset "elephant on chest" pressure-like pain starting while climbing stairs. Associated with cold diaphoresis, nausea, and lightheadedness. Unrelieved by rest.',
    physicalExamination: [
      'General: Diaphoretic, pale, anxious, clutching chest (Levine sign positive).',
      'Cardiovascular: S1/S2 heard, audible S4 gallop, elevated JVP at 8 cm H2O, no murmurs.',
      'Respiratory: Bilateral basilar crackles in lower lung zones.',
      'Abdomen: Soft, non-tender, no organomegaly.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'High-Sensitivity Troponin I', result: '14.8 ng/mL', referenceRange: '< 0.04 ng/mL', isAbnormal: true },
        { test: 'Serum Potassium (K+)', result: '4.2 mEq/L', referenceRange: '3.5 - 5.0 mEq/L', isAbnormal: false },
        { test: 'Serum Creatinine', result: '1.1 mg/dL', referenceRange: '0.7 - 1.3 mg/dL', isAbnormal: false },
        { test: 'Blood Glucose (Random)', result: '210 mg/dL', referenceRange: '< 140 mg/dL', isAbnormal: true },
      ],
      imagingResults: '12-Lead ECG shows 3mm ST elevation in Leads V1-V4 with reciprocal ST depression in II, III, and aVF (Acute Extensive Anterior STEMI).',
    },
    differentialDiagnosisRanked: [
      {
        rank: 1,
        diagnosis: 'Acute Anterior STEMI (LAD Occlusion)',
        supportingEvidence: 'ST elevation V1-V4, elevated Troponin I, Levine sign, cardiogenic shock signs.',
        refutingEvidence: 'None. Diagnostic criteria fully satisfied.',
      },
      {
        rank: 2,
        diagnosis: 'Acute Aortic Dissection (Type A)',
        supportingEvidence: 'Severe sudden chest pain radiating posteriorly in a hypertensive patient.',
        refutingEvidence: 'ST elevation with typical troponin rise favors primary coronary thrombosis; symmetrical radial pulses.',
      },
      {
        rank: 3,
        diagnosis: 'Acute Massive Pulmonary Embolism',
        supportingEvidence: 'Dyspnea, hypoxia, sinus tachycardia, hypotension.',
        refutingEvidence: 'Anterior ST elevations and high troponin elevation point directly to LAD occlusion.',
      },
    ],
    definitiveDiagnosis: 'Acute ST-Elevation Myocardial Infarction (Anterior Wall) complicated by early Cardiogenic Shock.',
    managementProtocol: [
      'Immediate chewable Aspirin 325 mg + Ticagrelor 180 mg loading dose.',
      'Supplemental oxygen via nasal cannula targeting SpO2 >= 94%.',
      'Immediate transfer to Cardiac Catheterization Lab for Primary PCI (Door-to-Balloon < 90 min).',
      'Initiate Norepinephrine infusion if mean arterial pressure (MAP) remains < 65 mmHg.',
      'AVOID Nitrates due to systemic hypotension (BP 88/54).',
    ],
    clinicalPearls: [
      'Time is muscle: every 30-minute delay in reperfusion increases 1-year mortality by 7.5%.',
      'Never give beta-blockers in acute STEMI if signs of cardiogenic shock or heart failure (rales) are present.',
    ],
  },

  // 2. DENTAL BDS
  'case-bds-01': {
    id: 'case-bds-01',
    domain: 'DENTAL_BDS',
    domainTitle: 'Dental Surgery (BDS)',
    patientDemographics: '34-year-old female, no systemic medical illnesses.',
    chiefComplaint: 'Throbbing pain in lower right jaw keeping her awake at night.',
    vitals: {
      bloodPressure: '120/78 mmHg',
      heartRate: '76 bpm',
      respiratoryRate: '16 breaths/min',
      temperature: '36.8 °C',
      oxygenSaturation: '99% on room air',
    },
    historyOfPresentIllness: 'Pain initiated 3 weeks ago as sensitivity to cold drinks, but has progressed to constant, unprovoked nocturnal throbbing radiating to right ear.',
    physicalExamination: [
      'Intraoral: Deep disto-occlusal carious lesion on tooth #46 (mandibular right first molar).',
      'Thermal Cold Test (Endo-Ice): Severe excruciating sharp pain lasting > 45 seconds after cotton pellet removal.',
      'Electric Pulp Test: Premature response at low threshold (hyperalgesia).',
      'Percussion: Mild tenderness to vertical percussion.',
      'Palpation: No vestibular swelling or fluctuance.',
    ],
    diagnosticWorkup: {
      labInvestigations: [],
      imagingResults: 'Periapical radiograph shows deep radiolucency invading pulp chamber of #46 with early widening of periodontal ligament space at mesial apex.',
    },
    differentialDiagnosisRanked: [
      {
        rank: 1,
        diagnosis: 'Symptomatic Irreversible Pulpitis with Symptomatic Apical Periodontitis (#46)',
        supportingEvidence: 'Lingering thermal pain > 45s, nocturnal throbbing, radiographic pulp exposure, positive percussion.',
        refutingEvidence: 'None.',
      },
      {
        rank: 2,
        diagnosis: 'Reversible Pulpitis (#46)',
        supportingEvidence: 'Carious lesion with cold sensitivity.',
        refutingEvidence: 'Pain in reversible pulpitis resolves immediately (<5-10s) upon cold removal; does not cause nocturnal throbbing.',
      },
    ],
    definitiveDiagnosis: 'Symptomatic Irreversible Pulpitis with Symptomatic Apical Periodontitis of Tooth #46.',
    managementProtocol: [
      'Inferior Alveolar Nerve Block + Long Buccal anesthesia (2% Lignocaine with 1:80,000 Adrenaline).',
      'Rubber dam isolation and complete caries excavation.',
      'Emergency pulpectomy: canal biomechanical preparation using rotary NiTi files with 3% NaOCl irrigation.',
      'Intracanal calcium hydroxide medicament placement and temporary Cavit restoration.',
      'NSAID analgesia (Ibuprofen 400 mg + Paracetamol 500 mg TID). No systemic antibiotics indicated.',
    ],
    clinicalPearls: [
      'Antibiotics are ineffective for pulpitis because pulpal microcirculation is strangulated.',
      'Lingering response to cold (>30s) is pathognomonic for irreversible pulpal damage.',
    ],
  },
};
