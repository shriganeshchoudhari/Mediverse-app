export interface MDSLesson {
  id: string;
  title: string;
  dciCode: string;
  year: 1 | 2 | 3;
  has3DContent: boolean;
  hasSimulation: boolean;
  isResearchBased: boolean;
  description: string;
}

export interface MDSSubject {
  id: string;
  name: string;
  code: string;
  year: 1 | 2 | 3;
  creditHours: number;
  description: string;
  lessons: MDSLesson[];
}

export interface MDSSpecialty {
  id: string;
  name: string;
  shortName: string;
  code: string;
  dciSpecialtyCode: string;
  description: string;
  neetMdsCode: string;
  duration: string;
  subjects: MDSSubject[];
}

export const MDS_METADATA = {
  program: 'MDS',
  fullName: 'Master of Dental Surgery',
  duration: '3 Years',
  regulatoryBody: 'Dental Council of India (DCI)',
  totalSpecialties: 8
};

export const MDS_CURRICULUM: MDSSpecialty[] = [
  {
    id: 'mds-ortho',
    name: 'Orthodontics & Dentofacial Orthopaedics',
    shortName: 'Orthodontics',
    code: 'MDS-ORTHO',
    dciSpecialtyCode: 'MDS-I',
    description: 'Functional appliances, fixed Rx, orthognathic planning, and clear aligner biomechanics.',
    neetMdsCode: 'MDS001',
    duration: '3 years',
    subjects: [
      {
        id: 'ortho-s1',
        name: 'Growth & Facial Development',
        code: 'ORTHO-101',
        year: 1,
        creditHours: 10,
        description: 'Study of facial growth and development.',
        lessons: [
          { id: 'l1', title: 'Growth prediction', dciCode: 'O-1.1', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Craniofacial growth prediction.' },
          { id: 'l2', title: 'Ricketts cephalometrics', dciCode: 'O-1.2', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Cephalometric analysis.' },
          { id: 'l2b', title: 'Cervical vertebral maturation (CVM) staging', dciCode: 'O-1.3b', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'CVM-based growth timing for treatment decisions.' }
        ]
      },
      {
        id: 'ortho-s2',
        name: 'Fixed Orthodontic Mechanics & Biomaterials',
        code: 'ORTHO-102',
        year: 1,
        creditHours: 10,
        description: 'Biomechanics of tooth movement.',
        lessons: [
          { id: 'l3', title: 'Clear aligner biomechanics', dciCode: 'O-1.3', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Aligner design and forces.' },
          { id: 'l4', title: 'TAD anchorage', dciCode: 'O-1.4', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Temporary anchorage devices.' },
          { id: 'l4b', title: 'Bracket prescription systems (MBT vs Roth vs Damon)', dciCode: 'O-1.5b', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Bracket slot prescriptions and torque values.' }
        ]
      },
      {
        id: 'ortho-s3',
        name: 'Functional Appliances & Growth Modification',
        code: 'ORTHO-201',
        year: 2,
        creditHours: 10,
        description: 'Growth modification appliances.',
        lessons: [
          { id: 'l5', title: 'Twin Block / Frankel appliances', dciCode: 'O-2.1', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Myofunctional appliances.' },
          { id: 'l6', title: 'Orthognathic case planning', dciCode: 'O-2.2', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Surgical orthodontics.' },
          { id: 'l6b', title: 'Virtual surgical planning (VSP) & 3D printing in orthognathic surgery', dciCode: 'O-2.3b', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Digital workflow for Le Fort & BSSO planning.' }
        ]
      }
    ]
  },
  {
    id: 'mds-omfs',
    name: 'Oral & Maxillofacial Surgery',
    shortName: 'OMFS',
    code: 'MDS-OMFS',
    dciSpecialtyCode: 'MDS-II',
    description: 'Craniofacial trauma, oral oncology, salivary gland and TMJ surgery.',
    neetMdsCode: 'MDS002',
    duration: '3 years',
    subjects: [
      {
        id: 'omfs-s1',
        name: 'Craniofacial Trauma & Reconstruction',
        code: 'OMFS-101',
        year: 1,
        creditHours: 10,
        description: 'Trauma management.',
        lessons: [
          { id: 'om-l1', title: 'Panfacial fracture fixation', dciCode: 'OM-1.1', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Fixation principles.' },
          { id: 'om-l2', title: 'Mandibular reconstruction with free flaps', dciCode: 'OM-1.2', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Microvascular reconstruction.' },
          { id: 'om-l3', title: 'Zygomaticomaxillary complex (ZMC) reduction & plating', dciCode: 'OM-1.3', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Surgical approaches and 3D stabilization.' }
        ]
      },
      {
        id: 'omfs-s2',
        name: 'Oral Oncology & Reconstructive Surgery',
        code: 'OMFS-201',
        year: 2,
        creditHours: 10,
        description: 'Cancer management.',
        lessons: [
          { id: 'om-l4', title: 'Squamous cell carcinoma resection', dciCode: 'OM-2.1', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Tumor ablation margins.' },
          { id: 'om-l5', title: 'Neck dissection classification and techniques', dciCode: 'OM-2.2', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Selective, modified radical, and radical neck dissection.' },
          { id: 'om-l6', title: 'Anterolateral thigh (ALT) and fibula osteocutaneous flap harvest', dciCode: 'OM-2.3', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Harvest and anastomosis protocols.' }
        ]
      },
      {
        id: 'omfs-s3',
        name: 'Salivary Gland & TMJ Surgery',
        code: 'OMFS-202',
        year: 2,
        creditHours: 10,
        description: 'TMJ and salivary pathology.',
        lessons: [
          { id: 'om-l7', title: 'Sialendoscopy', dciCode: 'OM-2.4', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Endoscopic salivary interventions.' },
          { id: 'om-l8', title: 'Total alloplastic TMJ replacement', dciCode: 'OM-2.5', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'TMJ replacement.' },
          { id: 'om-l9', title: 'TMJ arthroscopy & arthrocentesis', dciCode: 'OM-2.6', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Minimally invasive joint lavaging and lysis.' }
        ]
      }
    ]
  },
  {
    id: 'mds-perio',
    name: 'Periodontology',
    shortName: 'Periodontology',
    code: 'MDS-PERIO',
    dciSpecialtyCode: 'MDS-III',
    description: 'Advanced periodontal surgery, implantology, laser therapy, and tissue regeneration.',
    neetMdsCode: 'MDS003',
    duration: '3 years',
    subjects: [
      {
        id: 'perio-s1',
        name: 'Advanced Periodontal Surgery',
        code: 'PERIO-101',
        year: 1,
        creditHours: 10,
        description: 'Surgical periodontics.',
        lessons: [
          { id: 'p-l1', title: 'Guided Bone Regeneration with titanium mesh', dciCode: 'P-1.1', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'GBR techniques.' },
          { id: 'p-l2', title: 'Sinus lift (Caldwell-Luc vs BAOSFE)', dciCode: 'P-1.2', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Sinus augmentation.' },
          { id: 'p-l3', title: 'Connective tissue graft (CTG) tunneling technique', dciCode: 'P-1.3', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Root coverage and soft tissue augmentation.' }
        ]
      },
      {
        id: 'perio-s2',
        name: 'Implantology & Osseointegration',
        code: 'PERIO-201',
        year: 2,
        creditHours: 10,
        description: 'Dental implants.',
        lessons: [
          { id: 'p-l4', title: 'All-on-4/All-on-6 concepts', dciCode: 'P-2.1', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Full arch implantology.' },
          { id: 'p-l5', title: 'Immediate implant placement in aesthetic zone', dciCode: 'P-2.2', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Dual-zone grafting and custom healing abutments.' },
          { id: 'p-l6', title: 'Peri-implantitis management and detoxification', dciCode: 'P-2.3', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Surgical resective and regenerative protocols.' }
        ]
      },
      {
        id: 'perio-s3',
        name: 'Laser Periodontics & Regeneration',
        code: 'PERIO-301',
        year: 3,
        creditHours: 10,
        description: 'Lasers in periodontics.',
        lessons: [
          { id: 'p-l7', title: 'Platelet-rich fibrin (PRF) protocols', dciCode: 'P-3.1', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Biologics.' },
          { id: 'p-l8', title: 'Er:YAG laser sulcular debridement', dciCode: 'P-3.2', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Laser therapy.' },
          { id: 'p-l9', title: 'Enamel matrix derivative (Emdogain) biology & clinical application', dciCode: 'P-3.3', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Periodontal regeneration with amelogenins.' }
        ]
      }
    ]
  },
  {
    id: 'mds-endo',
    name: 'Conservative Dentistry & Endodontics',
    shortName: 'Endodontics',
    code: 'MDS-ENDO',
    dciSpecialtyCode: 'MDS-IV',
    description: 'Microsurgical endodontics, regenerative pulp therapy, and adhesive esthetic dentistry.',
    neetMdsCode: 'MDS004',
    duration: '3 years',
    subjects: [
      {
        id: 'endo-s1',
        name: 'Microsurgical Endodontics',
        code: 'ENDO-101',
        year: 1,
        creditHours: 10,
        description: 'Apicoectomy and surgery.',
        lessons: [
          { id: 'e-l1', title: 'Endodontic microsurgery (apical resection & retrofill)', dciCode: 'E-1.1', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Periradicular surgery.' },
          { id: 'e-l2', title: 'Mineral Trioxide Aggregate (MTA)', dciCode: 'E-1.2', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Bioceramics.' },
          { id: 'e-l3', title: 'Ultrasonic root-end preparation under surgical operating microscope', dciCode: 'E-1.3', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Micro-instrumentation and retro-cavity preparation.' }
        ]
      },
      {
        id: 'endo-s2',
        name: 'Regenerative Endodontics & Vital Pulp Therapy',
        code: 'ENDO-201',
        year: 2,
        creditHours: 10,
        description: 'Vital pulp therapies.',
        lessons: [
          { id: 'e-l4', title: 'GentleWave ultrasonic debridement', dciCode: 'E-2.1', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Advanced irrigation.' },
          { id: 'e-l5', title: 'Direct pulp capping with Biodentine', dciCode: 'E-2.2', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Pulp capping materials.' },
          { id: 'e-l6', title: 'Regenerative endodontic protocol in necrotic immature teeth', dciCode: 'E-2.3', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Revascularization and induced bleeding.' }
        ]
      },
      {
        id: 'endo-s3',
        name: 'Adhesive Dentistry & Aesthetic Restorations',
        code: 'ENDO-301',
        year: 3,
        creditHours: 10,
        description: 'Aesthetic dentistry.',
        lessons: [
          { id: 'e-l7', title: 'CAD/CAM CEREC restorations', dciCode: 'E-3.1', year: 3, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Digital dentistry in endo.' },
          { id: 'e-l8', title: 'Ceramic laminate veneers & preparation design', dciCode: 'E-3.2', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Minimally invasive anterior aesthetic dentistry.' },
          { id: 'e-l9', title: 'Endodontically treated tooth restoration & post selection', dciCode: 'E-3.3', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Ferrule effect, fiber vs cast posts.' }
        ]
      }
    ]
  },
  {
    id: 'mds-pros',
    name: 'Prosthodontics & Crown and Bridge',
    shortName: 'Prosthodontics',
    code: 'MDS-PROS',
    dciSpecialtyCode: 'MDS-V',
    description: 'Digital prosthodontics, CAD/CAM, implant-supported prosthetics, and maxillofacial prosthetics.',
    neetMdsCode: 'MDS005',
    duration: '3 years',
    subjects: [
      {
        id: 'pros-s1',
        name: 'Digital Prosthodontics & CAD/CAM',
        code: 'PROS-101',
        year: 1,
        creditHours: 10,
        description: 'Digital dentistry.',
        lessons: [
          { id: 'pr-l1', title: 'Digital smile design (DSD)', dciCode: 'PR-1.1', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Smile aesthetics.' },
          { id: 'pr-l2', title: 'Zirconia monolithic crowns vs veneered', dciCode: 'PR-1.2', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Ceramic materials.' },
          { id: 'pr-l3', title: 'Intraoral scanning accuracy & digital articulation', dciCode: 'PR-1.3', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Virtual casts and jaw motion tracking.' }
        ]
      },
      {
        id: 'pros-s2',
        name: 'Implant-Supported Prosthetics',
        code: 'PROS-201',
        year: 2,
        creditHours: 10,
        description: 'Implant prosthetics.',
        lessons: [
          { id: 'pr-l4', title: 'All-on-4 protocol', dciCode: 'PR-2.1', year: 2, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Full mouth rehabilitation.' },
          { id: 'pr-l5', title: 'Immediate loading implants', dciCode: 'PR-2.2', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Immediate loading.' },
          { id: 'pr-l6', title: 'Screw-retained vs cement-retained implant crowns', dciCode: 'PR-2.3', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Abutment selection, biomechanics and complications.' }
        ]
      },
      {
        id: 'pros-s3',
        name: 'Maxillofacial Prosthetics & Geriatric Dentistry',
        code: 'PROS-301',
        year: 3,
        creditHours: 10,
        description: 'Maxillofacial prostheses.',
        lessons: [
          { id: 'pr-l7', title: 'Auricular/nasal prosthetics', dciCode: 'PR-3.1', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Facial prostheses.' },
          { id: 'pr-l8', title: 'Neuromuscular dentistry', dciCode: 'PR-3.2', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Occlusion and TMD.' },
          { id: 'pr-l9', title: 'Obturator prostheses for maxillectomy defects', dciCode: 'PR-3.3', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Surgical, interim, and definitive obturator fabrication.' }
        ]
      }
    ]
  },
  {
    id: 'mds-pedo',
    name: 'Pedodontics & Preventive Dentistry',
    shortName: 'Pedodontics',
    code: 'MDS-PEDO',
    dciSpecialtyCode: 'MDS-VI',
    description: 'Advanced behavior management, interceptive orthodontics, and special needs dentistry.',
    neetMdsCode: 'MDS006',
    duration: '3 years',
    subjects: [
      {
        id: 'pedo-s1',
        name: 'Advanced Behaviour Management & Sedation',
        code: 'PEDO-101',
        year: 1,
        creditHours: 10,
        description: 'Behavior management.',
        lessons: [
          { id: 'pd-l1', title: 'Oral sedation / N2O sedation protocols', dciCode: 'PD-1.1', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Conscious sedation.' },
          { id: 'pd-l2', title: 'General anaesthesia workflow in pediatric dental surgery', dciCode: 'PD-1.2', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Pre-op evaluation and full mouth rehab under GA.' },
          { id: 'pd-l3', title: 'Non-pharmacological behavior guidance techniques (Frankl scale)', dciCode: 'PD-1.3', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Tell-show-do, positive reinforcement, and voice control.' }
        ]
      },
      {
        id: 'pedo-s2',
        name: 'Interceptive Orthodontics & Space Management',
        code: 'PEDO-201',
        year: 2,
        creditHours: 10,
        description: 'Interceptive orthodontics.',
        lessons: [
          { id: 'pd-l4', title: 'Twin arch space maintainers', dciCode: 'PD-2.1', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Space management.' },
          { id: 'pd-l5', title: 'Traumatology in primary dentition', dciCode: 'PD-2.2', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Trauma management.' },
          { id: 'pd-l6', title: 'Habit breaking appliances (thumb sucking & tongue thrusting)', dciCode: 'PD-2.3', year: 2, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Crib appliances, Bluegrass, and oral screens.' }
        ]
      },
      {
        id: 'pedo-s3',
        name: 'Pediatric Special Needs Dentistry',
        code: 'PEDO-301',
        year: 3,
        creditHours: 10,
        description: 'Special needs care.',
        lessons: [
          { id: 'pd-l7', title: 'Cleft lip/palate dental management', dciCode: 'PD-3.1', year: 3, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Cleft care.' },
          { id: 'pd-l8', title: 'Down syndrome oral health', dciCode: 'PD-3.2', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Syndromic care.' },
          { id: 'pd-l9', title: 'Dental management of children with Autism Spectrum Disorder (ASD)', dciCode: 'PD-3.3', year: 3, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Sensory adapted dental environment (SADE) protocols.' }
        ]
      }
    ]
  },
  {
    id: 'mds-oralmed',
    name: 'Oral Medicine & Radiology',
    shortName: 'Oral Medicine',
    code: 'MDS-ORALMED',
    dciSpecialtyCode: 'MDS-VII',
    description: 'CBCT, orofacial pain, TMD management, and AI-assisted dental diagnostics.',
    neetMdsCode: 'MDS007',
    duration: '3 years',
    subjects: [
      {
        id: 'oralmed-s1',
        name: 'CBCT & Digital Radiology',
        code: 'ORALMED-101',
        year: 1,
        creditHours: 10,
        description: 'Advanced radiology.',
        lessons: [
          { id: 'omr-l1', title: 'CBCT dose optimization (ALARA)', dciCode: 'OM-1.1', year: 1, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'CBCT imaging.' },
          { id: 'omr-l2', title: 'Interpretation of maxillary sinus & airway on CBCT', dciCode: 'OM-1.2', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: false, description: 'Volumetric CT diagnostic features.' },
          { id: 'omr-l3', title: 'MRI & ultrasonography in salivary and head-neck diagnostics', dciCode: 'OM-1.3', year: 1, has3DContent: true, hasSimulation: false, isResearchBased: true, description: 'Soft tissue imaging principles.' }
        ]
      },
      {
        id: 'oralmed-s2',
        name: 'Orofacial Pain & TMD',
        code: 'ORALMED-201',
        year: 2,
        creditHours: 10,
        description: 'TMD and pain management.',
        lessons: [
          { id: 'omr-l4', title: 'Orofacial pain classification (ICOP 2020)', dciCode: 'OM-2.1', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Pain taxonomy.' },
          { id: 'omr-l5', title: 'Trigeminal neuralgia vs atypical facial pain', dciCode: 'OM-2.2', year: 2, has3DContent: false, hasSimulation: true, isResearchBased: false, description: 'Neuralgia diagnosis.' },
          { id: 'omr-l6', title: 'Pharmacotherapy for burning mouth syndrome (BMS) & neuropathic pain', dciCode: 'OM-2.3', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Gabapentinoids, TCAs, and topical clonazepam.' }
        ]
      },
      {
        id: 'oralmed-s3',
        name: 'AI-Assisted Dental Diagnostics',
        code: 'ORALMED-301',
        year: 3,
        creditHours: 10,
        description: 'AI in dentistry.',
        lessons: [
          { id: 'omr-l7', title: 'AI caries detection algorithms', dciCode: 'OM-3.1', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'AI diagnostics.' },
          { id: 'omr-l8', title: 'Radiomics in oral cancer screening', dciCode: 'OM-3.2', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Radiomics.' },
          { id: 'omr-l9', title: 'Deep learning in automatic cephalometric landmark identification', dciCode: 'OM-3.3', year: 3, has3DContent: true, hasSimulation: true, isResearchBased: true, description: 'Neural network landmarking accuracy.' }
        ]
      }
    ]
  },
  {
    id: 'mds-orpath',
    name: 'Oral Pathology & Microbiology',
    shortName: 'Oral Pathology',
    code: 'MDS-ORPATH',
    dciSpecialtyCode: 'MDS-VIII',
    description: 'Histopathology, molecular diagnostics, oral cancer biomarkers, and forensic odontology.',
    neetMdsCode: 'MDS008',
    duration: '3 years',
    subjects: [
      {
        id: 'orpath-s1',
        name: 'Oral Histopathology & Molecular Diagnostics',
        code: 'ORPATH-101',
        year: 1,
        creditHours: 10,
        description: 'Molecular pathology.',
        lessons: [
          { id: 'op-l1', title: 'PCR & FISH in oral pathology', dciCode: 'OP-1.1', year: 1, has3DContent: false, hasSimulation: true, isResearchBased: true, description: 'Molecular testing.' },
          { id: 'op-l2', title: 'Special stains in fungal and bacterial oral infections (PAS, GMS, ZN)', dciCode: 'OP-1.2', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: false, description: 'Histochemical staining protocols.' },
          { id: 'op-l3', title: 'Liquid biopsy & salivary biomarkers in oral disease diagnosis', dciCode: 'OP-1.3', year: 1, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Circulating tumor DNA and exosome analysis.' }
        ]
      },
      {
        id: 'orpath-s2',
        name: 'Oral Cancer Biomarkers & Genetics',
        code: 'ORPATH-201',
        year: 2,
        creditHours: 10,
        description: 'Cancer genetics.',
        lessons: [
          { id: 'op-l4', title: 'VEGF / Ki-67 immunohistochemistry', dciCode: 'OP-2.1', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'IHC markers.' },
          { id: 'op-l5', title: 'p53 mutation in oral carcinogenesis', dciCode: 'OP-2.2', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'p53 pathways.' },
          { id: 'op-l6', title: 'Epigenetic modifications & DNA methylation in oral premalignancy', dciCode: 'OP-2.3', year: 2, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Hypermethylation patterns in leukoplakia and OSMF.' }
        ]
      },
      {
        id: 'orpath-s3',
        name: 'Research Methodology & Forensic Odontology',
        code: 'ORPATH-301',
        year: 3,
        creditHours: 10,
        description: 'Forensics and research.',
        lessons: [
          { id: 'op-l7', title: 'Bite mark analysis', dciCode: 'OP-3.1', year: 3, has3DContent: true, hasSimulation: true, isResearchBased: false, description: 'Forensic odontology.' },
          { id: 'op-l8', title: 'DNA profiling from dental pulp', dciCode: 'OP-3.2', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'DNA extraction.' },
          { id: 'op-l9', title: 'Systematic review & meta-analysis in dentistry', dciCode: 'OP-3.3', year: 3, has3DContent: false, hasSimulation: false, isResearchBased: true, description: 'Research methods.' }
        ]
      }
    ]
  }
];

export function getMDSSpecialtyById(id: string): MDSSpecialty | undefined {
  return MDS_CURRICULUM.find((s) => s.id === id);
}
