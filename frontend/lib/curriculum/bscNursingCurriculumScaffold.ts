export interface BScNursingLesson {
  id: string;
  title: string;
  incCode: string;
  year: 1 | 2 | 3 | 4;
  hasSimulation: boolean;
  isClinical: boolean;
  description: string;
}

export interface BScNursingSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3 | 4;
  creditHours: number;
  description: string;
  lessons: BScNursingLesson[];
}

export interface BScNursingYear {
  year: 1 | 2 | 3 | 4;
  title: string;
  description: string;
  subjects: BScNursingSubject[];
}

export const BSC_NURSING_CURRICULUM: BScNursingYear[] = [
  {
    year: 1,
    title: 'First Year B.Sc Nursing',
    description: 'Foundation of Nursing, Basic Sciences, Microbiology, and Nursing Fundamentals per INC 2022 Syllabus.',
    subjects: [
      {
        id: 'subj-1-1',
        name: 'Applied Anatomy & Physiology',
        code: 'N-ANP',
        year: 1,
        creditHours: 80,
        description: 'Structural and functional organization of the human body with nursing application in clinical assessment and care planning.',
        lessons: [
          { id: 'n-anp-1', title: 'Skeletal System — Bones, Joints & Fracture Nursing Care', incCode: 'INC-ANP-01', year: 1, hasSimulation: true, isClinical: true, description: 'Bone classification, synovial joint anatomy, fracture types (closed vs compound), cast care, Neurovascular assessment (5Ps — Pain, Pallor, Paralysis, Paresthesia, Pulselessness), and compartment syndrome recognition.' },
          { id: 'n-anp-2', title: 'Cardiovascular Anatomy — Heart Structure, ECG Correlation & Nursing', incCode: 'INC-ANP-02', year: 1, hasSimulation: true, isClinical: true, description: 'Cardiac chambers and valve anatomy, conduction system (SA node → AV node → Bundle of His → Purkinje), normal sinus rhythm on ECG (P-QRS-T), and nursing interventions in arrhythmia monitoring.' },
          { id: 'n-anp-3', title: 'Respiratory System — Ventilation, Oxygenation & Nursing Assessment', incCode: 'INC-ANP-03', year: 1, hasSimulation: true, isClinical: true, description: 'Trachea, bronchi, alveolar anatomy; inspiratory/expiratory volumes (TV, IRV, ERV, RV), SpO2 monitoring, abnormal breath sounds (crackles, wheeze, rhonchi), and respiratory distress recognition in nursing.' },
          { id: 'n-anp-4', title: 'Nervous System — CNS, PNS & Neurological Nursing Assessment', incCode: 'INC-ANP-04', year: 1, hasSimulation: true, isClinical: true, description: 'Brain lobes, spinal cord tracts, cranial nerve functions (CN II, III, VII, XII), Glasgow Coma Scale (GCS) scoring, pupillary assessment (PERRLA), and nursing care in altered consciousness.' },
          { id: 'n-anp-5', title: 'Renal System — Kidney Anatomy, Fluid Balance & Catheter Care', incCode: 'INC-ANP-05', year: 1, hasSimulation: true, isClinical: true, description: 'Nephron anatomy, GFR, oliguria/anuria recognition (<0.5 mL/kg/hr), urine characteristics (color, specific gravity, dipstick interpretation), catheter insertion technique, and urinary tract infection prevention.' }
        ]
      },
      {
        id: 'subj-1-2',
        name: 'Nursing Foundations',
        code: 'N-FND',
        year: 1,
        creditHours: 120,
        description: 'Core nursing skills, clinical communication, infection prevention, and safe patient handling procedures per INC standards.',
        lessons: [
          { id: 'n-fnd-1', title: 'Vital Signs Assessment — Temperature, Pulse, Respiration & BP', incCode: 'INC-FND-01', year: 1, hasSimulation: true, isClinical: true, description: 'Normal ranges, fever classification (low-grade 37.2-38°C, high-grade >39°C), pulse assessment sites (radial, apical, femoral), Korotkoff sounds for blood pressure, and auscultatory gap.' },
          { id: 'n-fnd-2', title: 'Infection Control — Hand Hygiene, PPE & Sterilization', incCode: 'INC-FND-02', year: 1, hasSimulation: true, isClinical: true, description: 'WHO 5 Moments for Hand Hygiene, alcohol-based hand rub vs surgical handwash technique (Ayliffe method), PPE donning/doffing sequence, sterilization methods (autoclave, ethylene oxide, formaldehyde chamber), and Standard vs Transmission-Based Precautions.' },
          { id: 'n-fnd-3', title: 'Patient Positioning, Body Mechanics & Pressure Ulcer Prevention', incCode: 'INC-FND-03', year: 1, hasSimulation: true, isClinical: true, description: 'Fowler\'s (30°, 45°, 90°), Trendelenburg, lithotomy, lateral positions with clinical indications, Braden Scale for pressure ulcer risk stratification, 2-hour repositioning protocol, and protective dressing selection.' },
          { id: 'n-fnd-4', title: 'Medication Administration — Routes, Rights & Error Prevention', incCode: 'INC-FND-04', year: 1, hasSimulation: true, isClinical: true, description: '10 Rights of Medication Administration (Right Patient — 2 identifiers, Right Drug, Right Dose, Right Route, Right Time, Right Documentation, Right Reason, Right Response, Right to Refuse, Right Assessment), calculation of IV drip rates, and medication reconciliation.' },
          { id: 'n-fnd-5', title: 'Wound Care & Dressing Techniques', incCode: 'INC-FND-05', year: 1, hasSimulation: true, isClinical: true, description: 'Wound classification (clean, contaminated, infected), phases of wound healing (hemostasis → inflammation → proliferation → remodeling), dry vs wet dressings, iodine-based vs hydrocolloid applications, and suture/staple removal technique.' }
        ]
      },
      {
        id: 'subj-1-3',
        name: 'Applied Microbiology & Infection Control',
        code: 'N-MIC',
        year: 1,
        creditHours: 60,
        description: 'Pathogenic microorganisms, sterilization, disinfection, and hospital-acquired infection prevention relevant to nursing practice.',
        lessons: [
          { id: 'n-mic-1', title: 'Gram Stain, Culture & Sensitivity — Nursing Implications', incCode: 'INC-MIC-01', year: 1, hasSimulation: false, isClinical: true, description: 'Gram-positive (Staphylococcus, Streptococcus) vs Gram-negative (E. coli, Klebsiella, Pseudomonas) clinical significance in HAI, specimen collection technique (blood cultures × 2 before antibiotics, mid-stream urine, wound swab), and sensitivity report interpretation.' },
          { id: 'n-mic-2', title: 'Hospital-Acquired Infections (HAIs) — CAUTI, CLABSI, HAPI, VAP Prevention Bundles', incCode: 'INC-MIC-02', year: 1, hasSimulation: false, isClinical: true, description: 'CAUTI Bundle (assess catheter need daily, sterile insertion, closed drainage system, perineal care), CLABSI Bundle (maximal sterile barrier, chlorhexidine skin prep, subclavian preferred site), VAP Bundle (HOB 30-45°, oral chlorhexidine, sedation vacation, cuff pressure monitoring).' },
          { id: 'n-mic-3', title: 'Isolation Precautions — Contact, Droplet & Airborne', incCode: 'INC-MIC-03', year: 1, hasSimulation: false, isClinical: true, description: 'Contact precautions (MRSA, VRE, C. difficile — single room, gown, gloves), Droplet precautions (Influenza, COVID-19 — surgical mask, 1m distance), Airborne precautions (TB, measles, varicella — N95, negative pressure room, HEPA filtration).' }
        ]
      }
    ]
  },
  {
    year: 2,
    title: 'Second Year B.Sc Nursing',
    description: 'Medical-Surgical Nursing, Pathology for Nurses, OB/GYN Nursing, and Nutrition across disease states.',
    subjects: [
      {
        id: 'subj-2-1',
        name: 'Medical-Surgical Nursing-I',
        code: 'N-MSN1',
        year: 2,
        creditHours: 150,
        description: 'Nursing care for patients with cardiovascular, respiratory, endocrine, and neurological disorders.',
        lessons: [
          { id: 'n-msn-1', title: 'Acute Myocardial Infarction — Nursing Assessment & STEMI Care Bundle', incCode: 'INC-MSN-01', year: 2, hasSimulation: true, isClinical: true, description: 'Chest pain assessment (PQRST), 12-lead ECG interpretation for ST elevation, cardiac biomarker monitoring (Troponin I timing), primary PCI preparation (shaving, cannulation, contrast allergy assessment), and post-PCI nursing care (bleeding monitoring, hemostasis).' },
          { id: 'n-msn-2', title: 'Heart Failure — Fluid Management, Diuretic Therapy & Daily Weight Protocol', incCode: 'INC-MSN-02', year: 2, hasSimulation: true, isClinical: true, description: 'NYHA classification, fluid restriction (1-1.5 L/day in severe HF), daily morning weight monitoring (alert physician if weight gain >1 kg/day), furosemide administration and electrolyte monitoring (hypokalemia — banana/ORS), and BIPAP/CPAP application in acute pulmonary edema.' },
          { id: 'n-msn-3', title: 'Diabetic Ketoacidosis (DKA) Nursing Protocol', incCode: 'INC-MSN-03', year: 2, hasSimulation: true, isClinical: true, description: 'DKA triad recognition (Kussmaul breathing, fruity breath, dehydration), IV fluid resuscitation (0.9% NaCl 1L/hr first hour), insulin infusion monitoring, potassium replacement scheduling, blood glucose monitoring every hour, and transition to subcutaneous insulin.' },
          { id: 'n-msn-4', title: 'Acute Respiratory Failure & Mechanical Ventilator Nursing', incCode: 'INC-MSN-04', year: 2, hasSimulation: true, isClinical: true, description: 'Type I (hypoxemic) vs Type II (hypercapnic) respiratory failure, BiPAP/CPAP setup, ETT care (cuff pressure 20-30 mmHg, repositioning every 2 hours, oral care), ventilator alarms interpretation (high pressure, apnea, low tidal volume), and weaning criteria (RSBI < 105).' },
          { id: 'n-msn-5', title: 'Stroke Nursing — Acute Phase, Thrombolysis & Rehabilitation', incCode: 'INC-MSN-05', year: 2, hasSimulation: true, isClinical: true, description: 'FAST assessment (Face, Arms, Speech, Time), NIH Stroke Scale nursing observation, tPA administration precautions (no IM injections, BP < 185/110 before/during tPA, 1:1 nursing), positioning (HOB 0° in acute ischemic stroke first 24h), and dysphagia screen (bedside swallow test) before oral feeding.' }
        ]
      },
      {
        id: 'subj-2-2',
        name: 'Obstetric & Gynecological Nursing',
        code: 'N-OBG',
        year: 2,
        creditHours: 120,
        description: 'Antenatal, intranatal, and postnatal nursing care following MCH and NMC guidelines.',
        lessons: [
          { id: 'n-obg-1', title: 'Antenatal Nursing — ANC Visits, Danger Signs & PMSMA', incCode: 'INC-OBG-01', year: 2, hasSimulation: true, isClinical: true, description: 'Schedule of 8 ANC visits (HBNC protocol), PMSMA (Pradhan Mantri Surakshit Matritva Abhiyan) Day 9 fixed-day services, anemia screening (Hb<11g/dL target), BP monitoring for preeclampsia, fetal movement counting (Cardiff method), and VDRL/HIV screening.' },
          { id: 'n-obg-2', title: 'Normal Labor Nursing — Partogram Maintenance & Active Management', incCode: 'INC-OBG-02', year: 2, hasSimulation: true, isClinical: true, description: 'WHO Partogram completion (alert/action line), cervical dilatation monitoring (descent rule of fifths), assessment of uterine contractions (frequency, duration, strength), FHR auscultation (normal 110-160 bpm), and Active Management of Third Stage (oxytocin 10 IU IM, controlled cord traction, uterine massage).' },
          { id: 'n-obg-3', title: 'Postpartum Hemorrhage (PPH) Emergency Nursing Protocol', incCode: 'INC-OBG-03', year: 2, hasSimulation: true, isClinical: true, description: '4Ts assessment (Tone 80% — bimanual uterine compression/Syntocinon; Trauma 20% — systematic examination; Thrombin — coagulation support; Tissue — placental retention), IV access 2 large-bore cannulas, blood cross-match, Bakri balloon tamponade assistance, and escalation criteria (EBL > 500 mL vaginal delivery / > 1000 mL LSCS).' },
          { id: 'n-obg-4', title: 'Neonatal Resuscitation Program (NRP) — ABCDE Protocol', incCode: 'INC-OBG-04', year: 2, hasSimulation: true, isClinical: true, description: 'Initial steps (dry, stimulate, position, warm), assess breathing and HR (<100 bpm — PPV with bag-mask), chest compressions (3:1 ratio if HR < 60 bpm), epinephrine 0.1-0.3 mL/kg of 1:10,000 IV/IO, Apgar score 1 and 5 minutes, and meconium aspiration protocol.' }
        ]
      }
    ]
  },
  {
    year: 3,
    title: 'Third Year B.Sc Nursing',
    description: 'Mental Health Nursing, Child Health Nursing, Community Health Nursing, and Medical-Surgical Nursing-II.',
    subjects: [
      {
        id: 'subj-3-1',
        name: 'Mental Health Nursing',
        code: 'N-MHN',
        year: 3,
        creditHours: 120,
        description: 'Psychiatric nursing care, therapeutic communication, de-escalation techniques, and mental health legislation.',
        lessons: [
          { id: 'n-mhn-1', title: 'Mental State Examination (MSE) — Nursing Assessment', incCode: 'INC-MHN-01', year: 3, hasSimulation: false, isClinical: true, description: 'MSE components (Appearance, Behaviour, Speech, Mood/Affect, Thought content/form, Perceptions, Cognition, Insight/Judgment), nursing documentation, suicide risk assessment using Columbia Suicide Severity Rating Scale (C-SSRS), and safe environment creation (ligature point removal).' },
          { id: 'n-mhn-2', title: 'De-escalation Techniques & Aggression Management in Psychiatric Nursing', incCode: 'INC-MHN-02', year: 3, hasSimulation: false, isClinical: true, description: 'STAMP tool for aggression prediction (Staring, Tone, Anxiety, Mumbling, Pacing), verbal de-escalation hierarchy (listen → empathize → agree → partner), restraint alternatives, rapid tranquilization protocol (haloperidol + lorazepam), and post-incident debriefing.' },
          { id: 'n-mhn-3', title: 'Psychopharmacology Nursing — Antipsychotics, Mood Stabilizers & Antidepressants', incCode: 'INC-MHN-03', year: 3, hasSimulation: false, isClinical: true, description: 'EPS monitoring (AIMS scale for tardive dyskinesia), clozapine agranulocytosis — weekly WBC monitoring, lithium toxicity signs (tremor, ataxia, confusion — levels >1.5 mEq/L), SSRI serotonin syndrome identification, and patient psychoeducation on medication adherence.' }
        ]
      },
      {
        id: 'subj-3-2',
        name: 'Community Health Nursing',
        code: 'N-CHN',
        year: 3,
        creditHours: 120,
        description: 'Primary healthcare, disease surveillance, maternal-child health programs, and community nursing practice.',
        lessons: [
          { id: 'n-chn-1', title: 'National Health Programs — RMNCH+A, ASHA, RBSK & JSSK', incCode: 'INC-CHN-01', year: 3, hasSimulation: false, isClinical: true, description: 'RMNCH+A continuum (Reproductive, Maternal, Newborn, Child, Adolescent Health), ASHA incentive structure and home-based newborn care (HBNC) visits (Day 1, 3, 7, 14, 28), RBSK (Rashtriya Bal Swasthya Karyakram) 4Ds screening (Defects, Deficiencies, Diseases, Developmental delays), and Janani Shishu Suraksha Karyakram (JSSK) entitlements.' },
          { id: 'n-chn-2', title: 'Expanded Programme on Immunization (EPI/UIP) — Cold Chain & AEFI Management', incCode: 'INC-CHN-02', year: 3, hasSimulation: false, isClinical: true, description: 'Universal Immunization Programme schedule (BCG at birth, OPV+DPT+Hep B at 6/10/14 weeks, Measles-Rubella at 9 months), cold chain maintenance (2-8°C vaccine refrigerator, -20°C for OPV, Vaccine Vial Monitor), AEFI categories (mild, severe, vaccine-induced), and reporting protocol.' },
          { id: 'n-chn-3', title: 'Epidemiology for Nurses — Outbreak Investigation & Surveillance', incCode: 'INC-CHN-03', year: 3, hasSimulation: false, isClinical: false, description: 'Attack rate calculation, epidemic curve interpretation (point source vs propagated), contact tracing methodology, notifiable diseases (cholera, plague, yellow fever — International Health Regulations), IDSP (Integrated Disease Surveillance Programme) S/P/L forms, and RDT (Rapid Diagnostic Test) interpretation.' }
        ]
      }
    ]
  },
  {
    year: 4,
    title: 'Fourth Year B.Sc Nursing',
    description: 'Nursing Administration, Research, Specialty Clinical Placements, and Competency Assessment.',
    subjects: [
      {
        id: 'subj-4-1',
        name: 'Nursing Administration & Management',
        code: 'N-ADM',
        year: 4,
        creditHours: 100,
        description: 'Principles of nursing management, staffing, quality improvement, and healthcare leadership.',
        lessons: [
          { id: 'n-adm-1', title: 'Nurse Staffing & Workload Management — Patient-to-Nurse Ratios', incCode: 'INC-ADM-01', year: 4, hasSimulation: false, isClinical: true, description: 'Activity-based staffing calculation (average daily census × hours of care / productive hours), NHPPD (Nursing Hours Per Patient Day), IMR/INC bed-nurse ratios (1:3 ICU, 1:6 general ward), float pool management, and overtime/shift work fatigue safety protocols.' },
          { id: 'n-adm-2', title: 'Quality Improvement — NABH Standards, Incident Reporting & RCA', incCode: 'INC-ADM-02', year: 4, hasSimulation: false, isClinical: true, description: 'NABH (National Accreditation Board for Hospitals) nursing standards, near-miss vs sentinel event classification, Root Cause Analysis (RCA) fishbone/Ishikawa diagram, Plan-Do-Study-Act (PDSA) QI cycle, and medication error prevention through CPOE and barcode medication administration (BCMA).' },
          { id: 'n-adm-3', title: 'Legal Aspects of Nursing Practice — INC Act, Patient Rights & Documentation', incCode: 'INC-ADM-03', year: 4, hasSimulation: false, isClinical: false, description: 'Indian Nursing Council Act 1947, state nursing council registration, nursing negligence (duty, breach, causation, damages), informed consent documentation, confidentiality vs mandatory disclosure (HIV, TB, child abuse), and medico-legal nursing records.' }
        ]
      },
      {
        id: 'subj-4-2',
        name: 'Nursing Research & Evidence-Based Practice',
        code: 'N-RES',
        year: 4,
        creditHours: 60,
        description: 'Research methodology, statistical analysis, evidence-based practice implementation, and nursing literature critique.',
        lessons: [
          { id: 'n-res-1', title: 'Quantitative vs Qualitative Research Designs for Nursing', incCode: 'INC-RES-01', year: 4, hasSimulation: false, isClinical: false, description: 'RCT hierarchy of evidence, quasi-experimental pre/post test, descriptive correlation, phenomenological and grounded theory qualitative designs, triangulation, and CONSORT/STROBE checklist for appraisal.' },
          { id: 'n-res-2', title: 'Systematic Review, Meta-analysis & Clinical Practice Guidelines', incCode: 'INC-RES-02', year: 4, hasSimulation: false, isClinical: false, description: 'PICO question formulation, PRISMA 2020 flow diagram, Cochrane collaboration methodology, forest plot interpretation (effect size, heterogeneity I²), GRADE evidence quality rating, and translating Cochrane review findings into nursing care protocols.' },
          { id: 'n-res-3', title: 'Ethical Guidelines & Institutional Review Board (IRB) in Nursing Research', incCode: 'INC-RES-03', year: 4, hasSimulation: false, isClinical: false, description: 'Belmont Report principles (Respect for Persons, Beneficence, Justice), informed consent in vulnerable populations, ICMR ethical guidelines for biomedical research, and research protocol audit.' }
        ]

      }
    ]
  }
];

export const BSC_NURSING_METADATA = {
  programName: 'Bachelor of Science in Nursing',
  abbreviation: 'B.Sc Nursing',
  duration: '4 Years',
  regulatoryBody: 'INC (Indian Nursing Council)',
  totalYears: 4
};

export function getBScNursingSubjectById(id: string): BScNursingSubject | undefined {
  for (const year of BSC_NURSING_CURRICULUM) {
    const subject = year.subjects.find((s) => s.id === id);
    if (subject) return subject;
  }
  return undefined;
}
