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

  // 3. BAMS — Amavata (Rheumatoid Arthritis)
  'case-bams-01': {
    id: 'case-bams-01',
    domain: 'AYUSH_BAMS',
    domainTitle: 'Ayurvedic Medicine (BAMS)',
    patientDemographics: '45-year-old male farmer, Vata-Pitta Prakriti, non-vegetarian diet, disturbed sleep pattern.',
    chiefComplaint: 'Bilateral symmetrical joint pain with morning stiffness > 1 hour for 8 months.',
    vitals: { bloodPressure: '126/82 mmHg', heartRate: '78 bpm', respiratoryRate: '16 breaths/min', temperature: '37.2 °C', oxygenSaturation: '98%' },
    historyOfPresentIllness: 'Gradual onset of painful swelling in metacarpophalangeal joints and proximal interphalangeal joints bilaterally. Associated with Ama (endotoxin) symptoms: heaviness, indigestion, coating on tongue, and fatigue after meals. Joint stiffness worst in morning and improves with movement (Vata-Ama correlation).',
    physicalExamination: [
      'Jihva (Tongue): Thick white Ama coating — indicative of Agnimandya (low digestive fire).',
      'Srotas (Channels): Artava Srotas obstruction confirmed by Nadi Pariksha (radial pulse) — Kapha-Ama predominant Vata pulse.',
      'Joints: Warm, tender, symmetrical swelling of MCP and PIP joints bilaterally. Swan-neck deformity developing in right middle finger.',
      'Agni Assessment: Vishama Agni (irregular digestive fire) — postprandial bloating and erratic bowel habits.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Rheumatoid Factor (RF)', result: '148 IU/mL', referenceRange: '< 20 IU/mL', isAbnormal: true },
        { test: 'Anti-CCP Antibodies', result: '280 U/mL', referenceRange: '< 20 U/mL', isAbnormal: true },
        { test: 'ESR (Erythrocyte Sedimentation Rate)', result: '78 mm/hr', referenceRange: '0-15 mm/hr', isAbnormal: true },
        { test: 'CRP (C-Reactive Protein)', result: '32 mg/L', referenceRange: '< 5 mg/L', isAbnormal: true },
        { test: 'Serum Uric Acid', result: '4.8 mg/dL', referenceRange: '3.5-7.2 mg/dL', isAbnormal: false },
      ],
      imagingResults: 'X-ray bilateral hands: Periarticular osteopenia and early erosions at radial aspect of 2nd and 3rd MCP joints. No chondrocalcinosis.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Amavata (Classical Rheumatoid Arthritis Correlation)', supportingEvidence: 'Symmetric small joint arthritis, Ama formation, positive RF and anti-CCP, morning stiffness > 1 hour, Vata-Ama Nadi.', refutingEvidence: 'None — all criteria satisfied.' },
      { rank: 2, diagnosis: 'Sandhivata (Osteoarthritis)', supportingEvidence: 'Joint pain and swelling in older male.', refutingEvidence: 'OA affects DIP joints (Heberden nodes), is asymmetric, and lacks RF/anti-CCP positivity or periarticular erosions.' },
      { rank: 3, diagnosis: 'Vatarakta (Gout — Ayurvedic Correlation)', supportingEvidence: 'Joint inflammation.', refutingEvidence: 'Normal serum uric acid and no monosodium urate crystals on aspiration. Symmetric pattern unlike Vatarakta monoarthritis.' },
    ],
    definitiveDiagnosis: 'Amavata — Ayurvedic diagnosis corresponding to Rheumatoid Arthritis (ACR/EULAR 2010 Criteria Score ≥ 6).',
    managementProtocol: [
      'Langhan Chikitsa: Therapeutic fasting (24-48 hours) to reduce Ama and kindle Agni.',
      'Svedana: Dashamula Svedana (herbal steam fomentation) to relieve Srotorodha and joint stiffness.',
      'Shamana Aushadhi: Shallaki (Boswellia serrata) 400 mg TID + Guduchi (Tinospora cordifolia) 500 mg BD + Guggulu (Commiphora mukul) 500 mg TID.',
      'Pathya (Diet): Warm, light, easy-to-digest foods. Avoid cold/raw foods, heavy dairy, and incompatible food combinations (Viruddha Ahara).',
      'Panchakarma Planning: After Ama reduction, plan Virechana (therapeutic purgation) followed by Basti (medicated enemas with Dashamula/Rasnasaptak Kwath).',
      'Modern co-management: Refer to rheumatology for DMARD initiation (Methotrexate 7.5-15 mg/week).',
    ],
    clinicalPearls: [
      'Amavata is the ONLY Ayurvedic Vyadhi where Snehana (oleation) is CONTRAINDICATED in the acute Ama-predominant phase — unlike most Vata diseases.',
      'Guggulsterones in Commiphora mukul inhibit NF-κB inflammatory signaling, providing mechanistic basis for anti-inflammatory action.',
    ],
  },

  // 4. BAMS — Medoroga (Metabolic Syndrome/Obesity)
  'case-bams-02': {
    id: 'case-bams-02',
    domain: 'AYUSH_BAMS',
    domainTitle: 'Ayurvedic Medicine (BAMS)',
    patientDemographics: '38-year-old software engineer, female, Kapha-dominant Prakriti, sedentary lifestyle, high-calorie diet.',
    chiefComplaint: 'Progressive weight gain (22 kg over 3 years), fatigue, excessive daytime sleepiness, and difficulty losing weight despite diet restriction.',
    vitals: { bloodPressure: '138/88 mmHg', heartRate: '82 bpm', respiratoryRate: '18 breaths/min', temperature: '36.5 °C', oxygenSaturation: '97%' },
    historyOfPresentIllness: 'Kapha-dominant individual with progressive Meda (adipose tissue) accumulation, leading to Dhatu Dushti. Reports Guru (heaviness), Alasya (lethargy), Tandra (drowsiness), Atinidra (hypersomnia), and Svasa (dyspnea on exertion). Nidana include Divasvapna (daytime sleep), Avyayama (physical inactivity), and Sheeta/Snigdha/Guru Ahara Seva (heavy, cold, oily foods).',
    physicalExamination: [
      'Anthropometry: BMI 34.2 kg/m² (Obese Class I). Waist circumference 98 cm. Waist-Hip Ratio 0.92.',
      'Nadi Pariksha: Kapha-predominant Mandha (slow, heavy, slippery) pulse — Medodushti.',
      'Skin: Snigdha (oily) skin texture, Sthira (stable/immobile) Mansa Dhatu deposits.',
      'Prakriti-Vikruti Assessment: Kapha Vridhi with secondary Vata Avarodha (obstruction of Vata channels by Meda).',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Fasting Blood Glucose', result: '108 mg/dL', referenceRange: '70-99 mg/dL', isAbnormal: true },
        { test: 'HbA1c', result: '6.0%', referenceRange: '< 5.7%', isAbnormal: true },
        { test: 'Fasting Triglycerides', result: '218 mg/dL', referenceRange: '< 150 mg/dL', isAbnormal: true },
        { test: 'HDL Cholesterol', result: '38 mg/dL', referenceRange: '> 50 mg/dL (female)', isAbnormal: true },
        { test: 'SGPT (ALT)', result: '64 IU/L', referenceRange: '7-40 IU/L', isAbnormal: true },
        { test: 'TSH', result: '2.8 mIU/L', referenceRange: '0.4-4.0 mIU/L', isAbnormal: false },
      ],
      imagingResults: 'Ultrasound abdomen: Grade II fatty liver (NAFLD). No gallstones.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Medoroga with Prameha Purvarupa (Metabolic Syndrome — Pre-diabetic)', supportingEvidence: 'IDF Metabolic Syndrome criteria met (central obesity, elevated TG, low HDL, elevated FBG, hypertension). Kapha Prakriti and Medodushti Nidana present.', refutingEvidence: 'None.' },
      { rank: 2, diagnosis: 'Hypothyroidism-induced obesity', supportingEvidence: 'Lethargy, weight gain, fatigue.', refutingEvidence: 'TSH 2.8 mIU/L — within normal range. No bradycardia, periorbital edema, or constipation.' },
    ],
    definitiveDiagnosis: 'Medoroga — Ayurvedic Metabolic Syndrome with Pre-diabetic state (IDF Criteria). NAFLD confirmed on USG.',
    managementProtocol: [
      'Nidana Parivarjana: Eliminate causative factors — no Divasvapna, Avyayama Chesta (daily exercise minimum 45 min), Sheeta/Guru Ahara restriction.',
      'Langhan Chikitsa: Periodic fasting (12-14 hours intermittent fasting aligned with Suryodaya-Suryasta cycle).',
      'Shodhana — Virechana: Triphala Kwath + Trivrit Leha Virechana to eliminate Ama from Koshtha and Meda Dhatu.',
      'Shamana: Guggulu (Medoghna property) 500 mg TID + Vijayasar (Pterocarpus marsupium — anti-diabetic) 500 mg BD + Triphala Guggulu for Meda reduction.',
      'Ahar Vyavastha: Jau (barley), Shyamak, Kodrava (millets), green leafy vegetables, lean proteins. Avoid Navanna (new-harvest rice), Maida, sugars.',
    ],
    clinicalPearls: [
      'In Medoroga, Meda Dhatu Dushti causes Srotoavarodha (channel blockage) leading to secondary Vata obstruction — hence Vata symptoms (joint stiffness, fatigue) paradoxically appear in a Kapha disease.',
      'Vijayasar (Indian Kino Tree) heartwood has Pterostilbene and Pterosupin — potent PPAR-gamma agonists with insulin-sensitizing properties validated in RCTs.',
    ],
  },

  // 5. BDS — Aggressive Periodontitis
  'case-bds-02': {
    id: 'case-bds-02',
    domain: 'DENTAL_BDS',
    domainTitle: 'Dental Surgery (BDS)',
    patientDemographics: '22-year-old female student, non-smoker, no systemic disease, family history of early tooth loss (father lost all teeth by age 40).',
    chiefComplaint: 'Bleeding gums, loose teeth, and "teeth shifting" position noticed over 6 months.',
    vitals: { bloodPressure: '118/74 mmHg', heartRate: '72 bpm', respiratoryRate: '14 breaths/min', temperature: '36.7 °C', oxygenSaturation: '99%' },
    historyOfPresentIllness: 'Disproportionately severe and rapidly progressive periodontal destruction inconsistent with minimal plaque and calculus deposits. Orthodontic assessment noted mesial drift of maxillary first molars and spacing development in anterior region over 6 months.',
    physicalExamination: [
      'Plaque Index: 0.8 (Low/Moderate — disproportionate to bone loss severity).',
      'Probing Depths: 7-9 mm pocketing localized to upper and lower first molars and incisors (classic localized aggressive periodontitis distribution).',
      'Furcation Involvement: Class II furcation involvement #16, #26, #36, #46.',
      'Mobility: Grade II mobility of mandibular right first molar (#46) and mandibular left first molar (#36).',
      'Gingival Status: Erythematous, bleeding on probing with purulent exudate from deep pockets. Minimal supra-gingival calculus.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Fasting Blood Glucose', result: '88 mg/dL', referenceRange: '70-99 mg/dL', isAbnormal: false },
        { test: 'CBC with differential', result: 'WBC 6.8 × 10³/µL, Neutrophils 62%', referenceRange: 'WBC 4-11 × 10³/µL', isAbnormal: false },
        { test: 'Periodontal Pathogen PCR (saliva)', result: 'A. actinomycetemcomitans (Aa) HIGH positive', referenceRange: 'Negative', isAbnormal: true },
      ],
      imagingResults: 'OPG (Orthopantomogram): Arc-shaped "vertical" bone loss at first molars (40-50% CEJ to apex) and horizontal bone loss at incisors. Loss of lamina dura. No generalized bone loss in premolar region — confirming localized pattern.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Localized Aggressive Periodontitis (Grade C, Stage III)', supportingEvidence: 'Young patient (<30 years), localized to first molars and incisors, rapid bone loss, high Aa bacterial load, family history, disproportionate bone loss vs plaque.', refutingEvidence: 'None — all Tonetti 2018 classification criteria satisfied.' },
      { rank: 2, diagnosis: 'Chronic Periodontitis with localized exacerbation', supportingEvidence: 'Pocketing, bone loss, bleeding.', refutingEvidence: 'Age <25, localized first molar/incisor distribution, minimal calculus, and Aa positivity exclude chronic periodontitis diagnosis.' },
    ],
    definitiveDiagnosis: 'Localized Aggressive Periodontitis — Grade C (rapid rate), Stage III (severe bone loss) as per 2018 World Workshop Classification.',
    managementProtocol: [
      'Full-mouth Scaling and Root Planing (SRP) — quadrant-by-quadrant — with adjunctive systemic Amoxicillin 500 mg + Metronidazole 400 mg TID × 7 days (Slots-Ting protocol for Aa eradication).',
      'Surgical Phase: Modified Widman Flap surgery at first molar sites for definitive subgingival debridement and bone defect visualization.',
      'Bone Grafting: Autogenous bone graft ± Enamel Matrix Derivative (Emdogain) at intrabony defect sites in first molar furcations.',
      'Supportive Periodontal Therapy (SPT): 3-month recall intervals with microbiological monitoring.',
      'Genetic counseling and periodontal screening of first-degree relatives.',
    ],
    clinicalPearls: [
      'Aggregatibacter actinomycetemcomitans (Aa) produces a leukotoxin that destroys neutrophils — explaining why normal neutrophil counts do not prevent periodontal destruction in aggressive periodontitis.',
      'In aggressive periodontitis, systemic antibiotics are NOT optional — SRP alone incompletely eradicates Aa which invades the gingival epithelial cells.',
    ],
  },

  // 6. BPharm/PharmD — Warfarin-Metronidazole Drug-Drug Interaction
  'case-bpharm-01': {
    id: 'case-bpharm-01',
    domain: 'PHARMACY_BPHARM',
    domainTitle: 'Pharmacy (B.Pharm / Pharm.D)',
    patientDemographics: '68-year-old male, chronic atrial fibrillation on Warfarin 5 mg/day (INR well-controlled at 2.3 for 18 months), now presenting with rectal bleeding.',
    chiefComplaint: 'Painless rectal bleeding for 2 days. Started antibiotic last week for dental abscess.',
    vitals: { bloodPressure: '102/64 mmHg', heartRate: '96 bpm (irregularly irregular)', respiratoryRate: '18 breaths/min', temperature: '36.9 °C', oxygenSaturation: '97%' },
    historyOfPresentIllness: 'Prescribed Metronidazole 400 mg TID 8 days ago by dentist for acute dental abscess. Developed rectal bleeding and easy bruising at injection sites. INR on emergency check: 5.8. Warfarin dose not changed. No NSAIDs, no new foods, alcohol-free.',
    physicalExamination: [
      'Cardiovascular: Irregularly irregular rhythm (AF), BP 102/64 (hypotension).',
      'Abdomen: Mild diffuse tenderness, no rigidity. Rectal examination: fresh blood on glove.',
      'Skin: Multiple unexplained ecchymoses on bilateral forearms.',
      'Hess Test: Positive (capillary fragility) — consistent with coagulopathy.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'INR (International Normalized Ratio)', result: '5.8', referenceRange: 'Therapeutic 2.0-3.0 (AF)', isAbnormal: true },
        { test: 'PT (Prothrombin Time)', result: '68 seconds', referenceRange: '11-15 seconds', isAbnormal: true },
        { test: 'aPTT', result: '58 seconds', referenceRange: '25-35 seconds', isAbnormal: true },
        { test: 'Hemoglobin', result: '9.4 g/dL', referenceRange: '13.5-17.5 g/dL', isAbnormal: true },
        { test: 'Platelets', result: '198 × 10³/µL', referenceRange: '150-400 × 10³/µL', isAbnormal: false },
        { test: 'Serum Warfarin Level', result: 'Markedly elevated (qualitative)', referenceRange: 'Not routinely monitored', isAbnormal: true },
      ],
      imagingResults: 'CT Abdomen/Pelvis (NCCT): No retroperitoneal hematoma. Intraluminal blood in descending colon. No perforation.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Warfarin Supratherapeutic Anticoagulation due to CYP2C9 Inhibition by Metronidazole', supportingEvidence: 'INR 5.8 (was stable 2.3), temporal relationship with Metronidazole initiation, no other precipitants. Metronidazole is a potent CYP2C9 inhibitor reducing S-Warfarin clearance.', refutingEvidence: 'None.' },
      { rank: 2, diagnosis: 'Colorectal cancer with bleeding', supportingEvidence: 'Age 68, rectal bleeding.', refutingEvidence: 'Coagulopathy fully explains bleeding. Will need colonoscopy after INR correction.' },
    ],
    definitiveDiagnosis: 'Warfarin toxicity (INR 5.8) secondary to CYP2C9 inhibition by Metronidazole. Lower GI bleed as clinical consequence.',
    managementProtocol: [
      'HOLD Warfarin immediately.',
      'Vitamin K1 (Phytonadione) 5-10 mg IV SLOWLY (over 30 min to prevent anaphylaxis) — expect INR correction in 12-24 hours.',
      'If active major bleeding: 4-Factor Prothrombin Complex Concentrate (4F-PCC) — dose based on INR and weight (25-50 IU/kg) — immediate INR reversal.',
      'Monitor INR every 6-12 hours until <2.0.',
      'Resume Warfarin at 20-25% dose reduction once INR stabilized. Use alternative antibiotic (not a CYP inhibitor) for dental infection.',
      'Pharmacist Drug Interaction Counseling: Educate patient on signs of bleeding and mandatory pharmacist/physician notification before any new prescription.',
    ],
    clinicalPearls: [
      'Metronidazole inhibits BOTH CYP2C9 (reducing S-Warfarin clearance, the more potent enantiomer) AND CYP3A4 — producing a 50-100% increase in Warfarin AUC.',
      'The ONLY antibiotics that do NOT significantly interact with Warfarin are Azithromycin (mild), Nitrofurantoin, and Clindamycin (unless via gut flora disruption).',
    ],
  },

  // 7. BSc Nursing — Post-CABG Atrial Fibrillation
  'case-nursing-01': {
    id: 'case-nursing-01',
    domain: 'NURSING_BSC',
    domainTitle: 'B.Sc Nursing',
    patientDemographics: '58-year-old male, Day 2 post-elective CABG (triple vessel coronary bypass), in Cardiac ICU.',
    chiefComplaint: 'New-onset rapid heart rate, palpitations, decreased urine output since morning rounds.',
    vitals: { bloodPressure: '88/56 mmHg (↓)', heartRate: '138 bpm (irregular)', respiratoryRate: '22 breaths/min', temperature: '38.2 °C', oxygenSaturation: '94% on O2 4L/min' },
    historyOfPresentIllness: 'Uneventful CABG Day 1. On Day 2 morning, telemetry alarm triggered for new irregularly irregular rhythm at 138 bpm. Patient reports palpitations and lightheadedness. Urine output dropped to 18 mL/hr over past 4 hours (oliguria). Baseline creatinine 0.9 mg/dL.',
    physicalExamination: [
      'Cardiovascular: Irregularly irregular pulse, S1/S2 heard. New bilateral basilar crackles. JVP elevated at 10 cm.',
      'Respiratory: Crackles in lower zones bilaterally — early pulmonary edema secondary to reduced cardiac output.',
      'Neurological: Alert, oriented, anxious.',
      'Monitoring Lines: IABP not in situ. Central line in right IJV. Urinary catheter draining 18 mL/hr.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Serum Potassium (K+)', result: '3.2 mEq/L', referenceRange: '3.5-5.0 mEq/L', isAbnormal: true },
        { test: 'Serum Magnesium (Mg²+)', result: '1.4 mEq/L', referenceRange: '1.7-2.2 mEq/L', isAbnormal: true },
        { test: 'Serum Creatinine', result: '1.6 mg/dL (↑)', referenceRange: '0.7-1.3 mg/dL', isAbnormal: true },
        { test: 'Serum Troponin I', result: '0.8 ng/mL', referenceRange: '< 0.04 ng/mL', isAbnormal: true },
      ],
      imagingResults: '12-Lead ECG: No discernible P-waves, irregularly irregular QRS complexes — consistent with Atrial Fibrillation with Rapid Ventricular Response (AF-RVR). Post-CABG day 2 — expected timing for post-operative AF (peaks 24-72 hours post-cardiac surgery).',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Post-operative Atrial Fibrillation (POAF) with Rapid Ventricular Response', supportingEvidence: 'Classic Day 2 timing, ECG confirmation, hypomagnesemia and hypokalemia precipitants, hemodynamic compromise.', refutingEvidence: 'None.' },
      { rank: 2, diagnosis: 'Acute MI (graft failure)', supportingEvidence: 'Troponin elevation, hemodynamic compromise.', refutingEvidence: 'Post-CABG troponin elevation expected. No new RWMA on echo. Rhythm is AF not VT/VF.' },
    ],
    definitiveDiagnosis: 'Post-operative Atrial Fibrillation with Rapid Ventricular Response (POAF) with oliguric Acute Kidney Injury (AKI KDIGO Stage 1) and hypomagnesemia.',
    managementProtocol: [
      'NURSING PRIORITIES — SBAR Communication to Cardiology team immediately.',
      'Continuous cardiac monitoring — 5-lead telemetry, document rhythm strip.',
      'IV Magnesium Sulfate 2g over 10-20 minutes — replace electrolyte deficit (Mg²+ stabilizes atrial membrane).',
      'IV Potassium Chloride 40 mEq over 4 hours via central line (NEVER rapid push — fatal arrhythmia risk).',
      'Rate control: IV Metoprolol (beta-blocker preferred in post-CABG) OR IV Amiodarone if hemodynamically unstable — per cardiologist order.',
      'Fluid balance: Assess need for IV fluid challenge vs diuresis based on CVP and respiratory status.',
      'Hourly urine output monitoring — target > 0.5 mL/kg/hr.',
      'Fall prevention: Bed rails up, call bell within reach — AF with hemodynamic compromise → syncope risk.',
    ],
    clinicalPearls: [
      'Post-operative AF occurs in 25-40% of CABG patients — peak incidence Day 2 due to adrenergic surge, pericardial inflammation, and electrolyte depletion from cardiopulmonary bypass.',
      'Nursing priority in post-surgical AF: Electrolyte repletion (Mg²+, K+) BEFORE rate control drugs — hypomagnesemia is the most common reversible precipitant.',
    ],
  },

  // 8. BPT — Lumbar Disc Herniation with Foot Drop
  'case-bpt-01': {
    id: 'case-bpt-01',
    domain: 'PHYSIOTHERAPY_BPT',
    domainTitle: 'Physiotherapy (B.P.T)',
    patientDemographics: '38-year-old male construction worker, BMI 28, chronic low back pain for 2 years, acute exacerbation 3 weeks ago after lifting a 40 kg load.',
    chiefComplaint: 'Severe right-sided sciatica (buttock to foot), weakness in right foot (cannot walk on heels), and numbness in right foot dorsum.',
    vitals: { bloodPressure: '128/80 mmHg', heartRate: '76 bpm', respiratoryRate: '16 breaths/min', temperature: '36.8 °C', oxygenSaturation: '99%' },
    historyOfPresentIllness: 'Sudden onset right leg pain after acute flexion-loading event. Pain radiates from right buttock → posterior thigh → lateral leg → dorsum of foot. Unable to dorsiflex right foot since 2 weeks. No bowel/bladder involvement. Analog pain scale 8/10. No improvement with NSAIDs and rest.',
    physicalExamination: [
      'Posture: Antalgic lean to left, lumbar scoliosis (away from pain side), reduced lumbar lordosis.',
      'ROM: Lumbar Flexion 40° (normal 80°), Extension 10° (painful), Right SLR positive at 35° (reproduces sciatica), Left SLR negative.',
      'Neurological: Right Tibialis Anterior power 2/5 (MRC Grade — foot drop confirmed), Extensor Hallucis Longus 2/5. Sensation decreased dorsal right foot (L4-L5 distribution). Right knee jerk intact, right ankle jerk absent.',
      'Special Tests: Slump Test positive right side. Femoral Nerve Stretch negative. No perineal anesthesia (no cauda equina).',
    ],
    diagnosticWorkup: {
      labInvestigations: [],
      imagingResults: 'MRI Lumbar Spine: Large right paracentral to foraminal disc herniation at L4-L5 level with right L5 nerve root compression in subarticular zone. Nerve root edema confirmed. No cord compression. Foraminal stenosis grade I.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'L4-L5 Disc Herniation with L5 Nerve Root Compression (Foot Drop)', supportingEvidence: 'MRI confirmed herniation, L5 distribution sensory loss, EHL and TA weakness (L5 myotome), absent ankle jerk (S1), positive SLR at 35°.', refutingEvidence: 'None.' },
      { rank: 2, diagnosis: 'Piriformis Syndrome', supportingEvidence: 'Sciatica, posterior thigh pain.', refutingEvidence: 'Foot drop is not caused by piriformis syndrome. MRI confirms disc pathology at L4-L5.' },
      { rank: 3, diagnosis: 'Cauda Equina Syndrome', supportingEvidence: 'Foot drop, bilateral symptoms possible.', refutingEvidence: 'No bowel/bladder dysfunction, no perineal anesthesia, no bilateral leg weakness — MRI shows unilateral L5 compression only.' },
    ],
    definitiveDiagnosis: 'Right L4-L5 Disc Herniation with Right L5 Nerve Root Radiculopathy producing Motor Deficit (Foot Drop — MRC 2/5).',
    managementProtocol: [
      'PHYSIOTHERAPY MANAGEMENT PROTOCOL:',
      'Acute Phase (Weeks 1-2): Neurodynamic mobilization (sciatic nerve slider technique — gentle non-provocative). Positioning: lying with knee flexed to reduce nerve tension. TENS over lumbar paraspinals for pain modulation.',
      'McKenzie Extension Protocol: Prone-lying → Prone on elbows → Press-ups (if directional preference confirmed). AVOID flexion exercises in acute phase.',
      'Foot Drop Functional Rehabilitation: Ankle-foot orthosis (AFO) for immediate gait safety. Active-assisted dorsiflexion exercises in gravity-eliminated position. FES (Functional Electrical Stimulation) to Tibialis Anterior 20 min/day.',
      'Subacute Phase (Weeks 3-6): Core stabilization (transversus abdominis co-contraction, bird-dog, McGill Big 3). Progressive resistance to TA and EHL using theraband.',
      'Surgical Consultation: Recommend neurosurgical evaluation — foot drop >6 weeks with MRC grade <3 is a surgical emergency (microdiscectomy). Delay beyond 12 weeks significantly reduces motor recovery.',
    ],
    clinicalPearls: [
      'The "window" for reversible foot drop in disc herniation is approximately 6-12 weeks — physiotherapists must escalate promptly for surgical evaluation when foot drop fails to improve with conservative management.',
      'SLR positive at <45° is highly specific for L4-L5 disc herniation. The Bowstring test (apply pressure to popliteal fossa during SLR) confirms it is nerve root, not hamstring tightness.',
    ],
  },

  // 9. BVSc — Canine Diabetic Ketoacidosis
  'case-bvsc-01': {
    id: 'case-bvsc-01',
    domain: 'VETERINARY_BVSC',
    domainTitle: 'Veterinary Science (B.V.Sc)',
    patientDemographics: 'Labrador Retriever, 9 years old, intact female (unspayed), 32 kg, presented from rural referral.',
    chiefComplaint: 'Vomiting, profound lethargy, and collapse over 48 hours. History of polydipsia/polyuria for 3 months.',
    vitals: { bloodPressure: '85/55 mmHg (hypotension)', heartRate: '136 bpm (tachycardia)', respiratoryRate: '40 breaths/min (Kussmaul)', temperature: '38.9 °C (low-grade fever)', oxygenSaturation: '94%' },
    historyOfPresentIllness: 'Owner reports 3-month history of polydipsia, polyuria, and weight loss. No prior diagnosis. In 3 days developed vomiting (5-6 episodes/day), anorexia, profound weakness, and Kussmaul breathing. Unspayed female Labrador — risk factor for diestrus-associated insulin resistance and diabetes mellitus secondary to progesterone elevation.',
    physicalExamination: [
      'General: Profoundly depressed, recumbent, unable to stand. Body Condition Score 3/9.',
      'Breath: Sweet/acetone odor — ketonemia.',
      'Mucous Membranes: Tacky, pale pink — dehydration estimated 10%. CRT 2.5 seconds.',
      'Abdomen: Cranial abdominal pain on palpation — concurrent pancreatitis suspected.',
      'Neurological: Obtunded, depressed — cerebral edema concern.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Blood Glucose (glucometer)', result: '548 mg/dL', referenceRange: '70-120 mg/dL (canine)', isAbnormal: true },
        { test: 'Venous Blood Gas pH', result: '7.14', referenceRange: '7.35-7.45', isAbnormal: true },
        { test: 'Bicarbonate (HCO3-)', result: '8 mEq/L', referenceRange: '18-24 mEq/L', isAbnormal: true },
        { test: 'Serum Potassium (K+)', result: '3.1 mEq/L (but total body K+ depleted)', referenceRange: '3.5-5.5 mEq/L (canine)', isAbnormal: true },
        { test: 'Urine Ketones (dipstick)', result: '3+ (large)', referenceRange: 'Negative', isAbnormal: true },
        { test: 'Spec cPL (Canine Pancreatic Lipase)', result: '1240 µg/L', referenceRange: '< 200 µg/L', isAbnormal: true },
      ],
      imagingResults: 'Point-of-care abdominal ultrasound: Enlarged edematous pancreas with peripancreatic mesenteric fat saponification — consistent with acute pancreatitis. Hepatomegaly (hepatic lipidosis). No evidence of pyometra.',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Diabetic Ketoacidosis (DKA) with concurrent Acute Pancreatitis', supportingEvidence: 'Blood glucose 548 mg/dL, ketonemia 3+, severe metabolic acidosis (pH 7.14), Kussmaul breathing, USG pancreatitis, Spec cPL 1240.', refutingEvidence: 'None — all criteria met.' },
      { rank: 2, diagnosis: 'Hyperosmolar Hyperglycemic State (HHS)', supportingEvidence: 'Profound hyperglycemia, dehydration, altered mentation.', refutingEvidence: 'Significant ketonemia (3+) and severe metabolic acidosis confirm DKA rather than pure HHS (HHS has minimal ketonemia).' },
    ],
    definitiveDiagnosis: 'Canine Diabetic Ketoacidosis complicated by Acute Necrotizing Pancreatitis. Likely secondary to progesterone-mediated insulin resistance in intact female (diestrus).',
    managementProtocol: [
      'IV Fluid Resuscitation: 0.9% NaCl 20 mL/kg bolus (shock dose) → reassess → maintenance at 2× normal maintenance rate.',
      'AVOID insulin until K+ corrected > 3.5 mEq/L (insulin drives K+ intracellularly → fatal hypokalemia).',
      'IV Potassium Chloride supplementation in fluids per sliding scale (K+ 3.1-3.5: add 40 mEq/L to fluids).',
      'Regular Insulin CRI (Constant Rate Infusion): 0.1 units/kg/hour. Target BG reduction 50-100 mg/dL/hour — avoid cerebral edema from rapid drops.',
      'When BG < 250 mg/dL: Switch to 0.45% NaCl + 5% Dextrose. Continue insulin CRI at reduced rate.',
      'NPO (nil per os) 24-48 hours for pancreatitis — then reintroduce low-fat diet.',
      'After stabilization: Ovariohysterectomy (spaying) to eliminate progesterone source and prevent recurrence.',
    ],
    clinicalPearls: [
      'In diabetic dogs, ALWAYS check for concurrent pancreatitis — it is present in 50-70% of canine DKA cases and triggers the ketotic state through glucagon excess and insulin resistance.',
      'Intact female dogs have 8× higher risk of diabetes mellitus than males due to progesterone (from diestrus corpus luteum) inducing GH release from mammary tissue, causing reversible/permanent insulin resistance.',
    ],
  },

  // 10. MBBS — Lupus Nephritis
  'case-mbbs-02': {
    id: 'case-mbbs-02',
    domain: 'ALLOPATHIC_MBBS',
    domainTitle: 'Allopathic Medicine (MBBS)',
    patientDemographics: '24-year-old female, no prior medical history, presenting with facial rash and swollen legs for 3 weeks.',
    chiefComplaint: 'Facial butterfly rash, bilateral leg swelling, fatigue, and foamy urine for 3 weeks. Arthralgia in wrists and fingers.',
    vitals: { bloodPressure: '156/98 mmHg', heartRate: '92 bpm', respiratoryRate: '18 breaths/min', temperature: '37.8 °C', oxygenSaturation: '97%' },
    historyOfPresentIllness: 'Young female presenting with malar rash (sparing nasolabial folds), photosensitivity, bilateral wrist and PIP arthralgia, serositis (pleuritic chest pain), and progressive bilateral pitting edema. Foamy urine consistent with heavy proteinuria. Fatigue and anorexia for 6 weeks.',
    physicalExamination: [
      'Skin: Erythematous malar rash — butterfly distribution, sharp edges, nasolabial fold sparing. Discoid lesions on ears.',
      'Musculoskeletal: Tender swelling in bilateral wrists and PIP joints — non-deforming arthritis.',
      'Cardiac/Respiratory: Bilateral pleural dullness consistent with effusions. No pericardial rub.',
      'Abdomen: Bilateral pitting edema 3+ to mid-tibia. Ascites on percussion (dullness shifting).',
      'Kidneys: Non-tender bilateral loin fullness.',
    ],
    diagnosticWorkup: {
      labInvestigations: [
        { test: 'Anti-dsDNA antibodies', result: '1:640 (Positive)', referenceRange: 'Negative (<1:10)', isAbnormal: true },
        { test: 'ANA (Antinuclear Antibodies)', result: 'Positive 1:320, Homogeneous pattern', referenceRange: 'Negative (<1:40)', isAbnormal: true },
        { test: 'Serum Complement C3', result: '42 mg/dL', referenceRange: '88-165 mg/dL', isAbnormal: true },
        { test: 'Serum Complement C4', result: '6 mg/dL', referenceRange: '14-40 mg/dL', isAbnormal: true },
        { test: '24-hour Urine Protein', result: '4.8 g/24h (Nephrotic)', referenceRange: '< 150 mg/24h', isAbnormal: true },
        { test: 'Serum Creatinine', result: '2.4 mg/dL', referenceRange: '0.5-1.1 mg/dL', isAbnormal: true },
        { test: 'Urine RBC Casts', result: 'Positive (3-5 per HPF)', referenceRange: 'Absent', isAbnormal: true },
      ],
      imagingResults: 'Kidney Biopsy (Mandatory for Class Determination): Light microscopy — endocapillary proliferation, wire-loop lesions, neutrophilic infiltration. Immunofluorescence — "Full House" IgG/IgM/IgA/C3/C4/C1q deposits. EM — subendothelial electron-dense deposits. Consistent with ISN/RPS Class III-IV Lupus Nephritis (Focal-Diffuse Proliferative).',
    },
    differentialDiagnosisRanked: [
      { rank: 1, diagnosis: 'Systemic Lupus Erythematosus with ISN/RPS Class III-IV Lupus Nephritis', supportingEvidence: 'ACR/EULAR 2019 Criteria score >10: Malar rash (4), anti-dsDNA high titer (6), low C3/C4 (4), arthritis (4), serositis (5), renal biopsy Class III-IV (10), proteinuria >0.5g (4). SLICC criteria also satisfied.', refutingEvidence: 'None — diagnostic.' },
      { rank: 2, diagnosis: 'IgA Nephropathy with Systemic Vasculitis', supportingEvidence: 'Young female, renal involvement, hematuria.', refutingEvidence: 'Full-house immunofluorescence pattern, positive anti-dsDNA, malar rash, complement consumption — all diagnostic for SLE/LN, not IgA-N.' },
    ],
    definitiveDiagnosis: 'Systemic Lupus Erythematosus (SLE) with Proliferative Lupus Nephritis — ISN/RPS Class IV (Diffuse). Mixed nephritic-nephrotic syndrome presentation.',
    managementProtocol: [
      'INDUCTION THERAPY: Pulse IV Methylprednisolone 1g × 3 days → Oral Prednisolone 1 mg/kg/day (up to 60 mg) tapering over 6 months.',
      'INDUCTION IMMUNOSUPPRESSION: IV Cyclophosphamide Euro-Lupus Protocol (500 mg q2 weeks × 6 doses, preferred for Asian patients) OR Mycophenolate Mofetil (MMF) 3g/day.',
      'MAINTENANCE THERAPY: MMF 1.5-2g/day OR Azathioprine 2 mg/kg/day for minimum 3 years.',
      'Hydroxychloroquine 200-400 mg/day (MANDATORY in all SLE — reduces flares, organ damage, mortality). Screen for retinopathy after 5 years.',
      'ACE inhibitor (Ramipril 5 mg OD) for proteinuria reduction — target <500 mg/24h.',
      'Bone protection: Calcium 1000 mg + Vitamin D3 800 IU + Alendronate (steroid-induced osteoporosis prevention).',
      'BP control: Target <130/80 mmHg.',
      'Monitor: CBC, creatinine, urine protein/creatinine ratio every 3 months. Anti-dsDNA and complement at each visit.',
    ],
    clinicalPearls: [
      'Anti-dsDNA and complement (C3/C4) are disease activity markers — they RISE during remission and FALL during flares. Monitor at every visit.',
      'Hydroxychloroquine must NEVER be stopped in SLE — withdrawal doubles the risk of major organ flares and increases overall mortality. It is the most evidence-based therapy in SLE.',
    ],
  },
};
